import { ErrorHandler } from "../middleware/errorMiddleware.js";

import UserAuth from "../models/UserAuth.model.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { setTokenCookieAndSend } from "../utils/jwtToken.js";


import { sendEmail } from "../utils/sendEmail.js";
import { FORGOT_PASSWORD_OTP_EMAIL_TEMPLATE, LOGIN_OTP_EMAIL_TEMPLATE } from "../utils/Email_Templates.js";
import { deleteFromCloudinary, isFileTypeSupported, uploadToCloudinary } from "../utils/cloudinaryConfig.js";



export const CreateInstructor = catchAsyncErrors(
  async (req, res, next) => {
    const {
      fullname,
      username,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !fullname ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return next(
        new ErrorHandler("All fields are required", 400)
      );
    }

    if (password !== confirmPassword) {
      return next(
        new ErrorHandler("Passwords do not match", 400)
      );
    }

    const userExists = await UserAuth.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return next(
        new ErrorHandler(
          "Username or email already exists",
          400
        )
      );
    }

    const instructor = await UserAuth.create({
      fullname,
      username,
      email,
      password,
      role: "Instructor",
      isActive : true,

      // Optional: keep track of which admin created them
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Instructor created successfully",
      instructor: {
        id: instructor._id,
        fullname: instructor.fullname,
        username: instructor.username,
        email: instructor.email,
        role: instructor.role,
      },
    });
  }
);


export const SignupUser = catchAsyncErrors(async (req, res, next) => {
  const { fullname, username, email, password,
    confirmPassword, role } = req.body;

  if(!fullname || !username || !email || !password || !confirmPassword || !role)
    return next(new ErrorHandler("All fields are required", 400));

  if (password !== confirmPassword)
    return next(new ErrorHandler("Passwords do not match", 400));


  // if already exist user
  const userExists = await UserAuth.findOne({ username });
  if (userExists) return next(new ErrorHandler("User already exists", 400));

  const user = await UserAuth.create({
    fullname,
    username,
    email,
    password,
    role,
    isActive: false,
  });

  const otp = Math.floor(Math.random() * 1000000).toString();
  user.otpCode = otp;
  await user.save();


    await sendEmail({
    to: user.email,
    subject: "🔐 Your Signup OTP",
    html: LOGIN_OTP_EMAIL_TEMPLATE.replace("{otp}", otp),
  });

  setTokenCookieAndSend(res, user, 201, "Please verify your emai");



})


export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password, role } = req.body;

  // Basic validations
  if (!username || !password || !role)
    return next(
      new ErrorHandler("Username, password, and role are required", 400)
    );

  // Find user
  const user = await UserAuth.findOne({ username });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Check if role matches
  if (user.role !== role) {
    return next(
      new ErrorHandler(
        `Invalid role selected. This account belongs to '${user.role}'`,
        403
      )
    );
  }

  // Check if active
  if (!user.isActive) {
    return next(
      new ErrorHandler("Your account has been deactivated. Contact admin.", 403)
    );
  }



  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));

  // Session enforcement (only vendors)
  if (user.singleDeviceEnforced && user.sessionVersion !== 0) {
    return next(
      new ErrorHandler(
        "Already logged in on another device. Please logout first.",
        403
      )
    );
  }
  // const otp = crypto.randomInt(100000, 999999).toString();
  const otp = "123456";
  user.otpCode = otp
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  user.isOtpVerified = false;

  // Assign sessionVersion only for vendors
  if (user.singleDeviceEnforced) {
    user.sessionVersion = Date.now();;
  }

   await user.save();
  await sendEmail({
    to: user.email,
    subject: "🔐 Your Login OTP",
    html: LOGIN_OTP_EMAIL_TEMPLATE.replace("{otp}", otp),
  });

 res.status(200).json({
    success: true,
    message: "OTP sent to email. Please verify.",
  });
});



export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  const user = await UserAuth.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.singleDeviceEnforced) {
    user.sessionVersion = 0;
    await user.save();
  }
  res
    .status(200)
    .cookie("jwt-token", "", { expires: new Date(0), httpOnly: true })
    .json({ success: true, message: "Logged out successfully" });
});





export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("Both old and new passwords are required", 400)
    );
  }

  const user = await UserAuth.findById(req.user._id);

  if (!user) return next(new ErrorHandler("User not found", 404));

  // Verify old password
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  // Hash and update password
  user.password = newPassword;

  // Vendor → force logout from all devices
  if (user.role === "vendor") {
    user.sessionVersion = Date.now(); // reset session to force re-login
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully. Please login again.",
  });
});

export const GetMe = catchAsyncErrors(async (req, res, next) => {
  const user = await UserAuth.findById(req.user._id).select("-password");
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, user });
});



export const verifyLoginOtp = async (req, res, next) => {
  const { username, otp } = req.body;

  const user = await UserAuth.findOne({ username });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.otpCode !== otp) return next(new ErrorHandler("Invalid OTP", 400));

  if (user.otpExpiry < Date.now())
    return next(new ErrorHandler("OTP expired", 400));

  user.isOtpVerified = true;
  user.otpCode = null;
  user.otpExpiry = null;
  user.isActive = true,

  await user.save();

  // Issue JWT Token
  const token = user.generateJsonWebToken();
  setTokenCookieAndSend(res, user, 200, "Logged in successfully");
};



export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const user = await UserAuth.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP
  user.otpCode = otp;

  // OTP expires after 5 minutes
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();

  // Send email
  await sendEmail({
    to: user.email,
    subject: "🔐 Your Password Reset OTP",
    html: FORGOT_PASSWORD_OTP_EMAIL_TEMPLATE.replace(
      "{otp}",
      otp
    ),
  });

  res.status(200).json({
    success: true,
    message: "Password reset OTP sent to your email",
  });
});




export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const {
    email,
    otp,
    newPassword,
    confirmPassword,
  } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return next(
      new ErrorHandler("All fields are required", 400)
    );
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("Passwords do not match", 400)
    );
  }

  const user = await UserAuth.findOne({ email });

  if (!user) {
    return next(
      new ErrorHandler("User not found", 404)
    );
  }

  // Check OTP
  if (user.otpCode !== otp) {
    return next(
      new ErrorHandler("Invalid OTP", 400)
    );
  }

  // Check OTP expiry
  if (
    !user.otpExpiry ||
    user.otpExpiry < Date.now()
  ) {
    return next(
      new ErrorHandler("OTP expired", 400)
    );
  }

  // Update password
  user.password = newPassword;
  user.isActive = true;

  // Clear reset OTP
  user.otpCode = null;
  user.otpExpiry = null;




  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful. Please login again.",
  });
});



export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await UserAuth.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const {
    cnic,
    district,
    districtId,
    tehsil,
    address,
    contactno,
    bio,
  } = req.body;

  const file = req.files?.imageFile;

  if (!file) {
    return next(new ErrorHandler("Image is required", 400));
  }

  if (!isFileTypeSupported(file.name)) {
    return next(
      new ErrorHandler("File type not supported", 400)
    );
  }

  // Upload new image first
  const upload = await uploadToCloudinary(
    file,
    "Learn_HUB"
  );

  // Delete old image if user already has one
  if (user.imagePublicId) {
    await deleteFromCloudinary(user.imagePublicId);
  }

  // Save new image
  user.imageUrl = upload.secure_url;
  user.imagePublicId = upload.public_id;

  // Update profile fields
  user.cnic = cnic;
  user.district = district;
  user.districtId = districtId;
  user.tehsil = tehsil;
  user.address = address;
  user.contactno = contactno;
  user.bio = bio;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});




