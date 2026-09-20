import UserAuth from "../models/UserAuth.model.js";
import Course from "../models/Courses.model.js";
import EnrollmentCourse from "../models/EnrollmentCourse.model.js";

import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";


// =====================================================
// CREATE INSTRUCTOR
// =====================================================

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
      fullname: fullname.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "Instructor",
      isActive: true,
      deactivated: false,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Instructor created successfully",
      instructor: {
        _id: instructor._id,
        fullname: instructor.fullname,
        username: instructor.username,
        email: instructor.email,
        role: instructor.role,
        isActive: instructor.isActive,
        deactivated: instructor.deactivated,
        createdAt: instructor.createdAt,
      },
    });
  }
);


// =====================================================
// GET ANALYTICS
// =====================================================

export const getAdminAnalytics = catchAsyncErrors(
  async (req, res, next) => {
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      totalCourses,
      totalEnrollments,
      activeUsers,
      inactiveUsers,
    ] = await Promise.all([
      UserAuth.countDocuments(),

      UserAuth.countDocuments({
        role: "Student",
      }),

      UserAuth.countDocuments({
        role: "Instructor",
      }),

      UserAuth.countDocuments({
        role: "Admin",
      }),

      Course.countDocuments(),

      EnrollmentCourse.countDocuments(),

      UserAuth.countDocuments({
        isActive: true,
        deactivated: false,
      }),

      UserAuth.countDocuments({
        $or: [
          { isActive: false },
          { deactivated: true },
        ],
      }),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        totalEnrollments,
        activeUsers,
        inactiveUsers,
      },
    });
  }
);


// =====================================================
// GET ALL USERS
// =====================================================

export const getAllUsers = catchAsyncErrors(
  async (req, res, next) => {
    const users = await UserAuth.find({})
      .select(
        "-password -otpCode -otpExpiry -sessionVersion"
      )
      .populate(
        "createdBy",
        "fullname username email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  }
);


// =====================================================
// GET ALL INSTRUCTORS
// =====================================================

export const getAllInstructors = catchAsyncErrors(
  async (req, res, next) => {
    const instructors = await UserAuth.find({
      role: "Instructor",
    })
      .select(
        "-password -otpCode -otpExpiry -sessionVersion"
      )
      .populate(
        "createdBy",
        "fullname username email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: instructors.length,
      instructors,
    });
  }
);


// =====================================================
// GET SINGLE INSTRUCTOR
// =====================================================

export const getInstructorById = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const instructor = await UserAuth.findOne({
      _id: id,
      role: "Instructor",
    }).select(
      "-password -otpCode -otpExpiry -sessionVersion"
    );

    if (!instructor) {
      return next(
        new ErrorHandler("Instructor not found", 404)
      );
    }

    res.status(200).json({
      success: true,
      instructor,
    });
  }
);


// =====================================================
// UPDATE INSTRUCTOR
// =====================================================

export const updateInstructor = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const instructor = await UserAuth.findOne({
      _id: id,
      role: "Instructor",
    });

    if (!instructor) {
      return next(
        new ErrorHandler("Instructor not found", 404)
      );
    }

    const {
      fullname,
      username,
      email,
      cnic,
      district,
      districtId,
      tehsil,
      address,
      contactno,
      bio,
    } = req.body;

    // Check username conflict
    if (username && username !== instructor.username) {
      const usernameExists = await UserAuth.findOne({
        username,
        _id: { $ne: id },
      });

      if (usernameExists) {
        return next(
          new ErrorHandler(
            "Username already exists",
            400
          )
        );
      }

      instructor.username = username.trim();
    }

    // Check email conflict
    if (email && email !== instructor.email) {
      const emailExists = await UserAuth.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (emailExists) {
        return next(
          new ErrorHandler(
            "Email already exists",
            400
          )
        );
      }

      instructor.email = email.toLowerCase().trim();
    }

    if (fullname !== undefined)
      instructor.fullname = fullname.trim();

    if (cnic !== undefined)
      instructor.cnic = cnic;

    if (district !== undefined)
      instructor.district = district;

    if (districtId !== undefined)
      instructor.districtId = districtId;

    if (tehsil !== undefined)
      instructor.tehsil = tehsil;

    if (address !== undefined)
      instructor.address = address;

    if (contactno !== undefined)
      instructor.contactno = contactno;

    if (bio !== undefined)
      instructor.bio = bio;

    await instructor.save();

    res.status(200).json({
      success: true,
      message: "Instructor updated successfully",
      instructor: {
        _id: instructor._id,
        fullname: instructor.fullname,
        username: instructor.username,
        email: instructor.email,
        cnic: instructor.cnic,
        district: instructor.district,
        districtId: instructor.districtId,
        tehsil: instructor.tehsil,
        address: instructor.address,
        contactno: instructor.contactno,
        bio: instructor.bio,
        role: instructor.role,
        isActive: instructor.isActive,
        deactivated: instructor.deactivated,
        imageUrl: instructor.imageUrl,
      },
    });
  }
);


// =====================================================
// ACTIVATE / DEACTIVATE INSTRUCTOR
// =====================================================





export const deleteInstructor = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const instructor = await UserAuth.findOne({
      _id: id,
      role: "Instructor",
    });

    if (!instructor) {
      return next(
        new ErrorHandler("Instructor not found", 404)
      );
    }

    await UserAuth.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
    });
  }
);
