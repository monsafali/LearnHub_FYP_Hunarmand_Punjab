



export const LOGIN_OTP_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Login OTP</title>
</head>

<body style="
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">

  <!-- Header -->
  <div style="
    background: linear-gradient(to right, #0066ff, #0099ff);
    padding: 20px;
    text-align: center;
  ">
    <h1 style="color: white; margin: 0;">Login OTP</h1>
  </div>

  <!-- Body -->
  <div style="
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  ">
    <p>Hello,</p>
    <p>Use the One-Time Password (OTP) below to log in to your account:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #0066ff;
      ">{otp}</span>
    </div>

    <p>This OTP is valid for <b>5 minutes</b>.</p>
    <p>If you didn't request this login attempt, please ignore this email.</p>

    <p>Regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="
    text-align: center;
    margin-top: 20px;
    color: #888;
    font-size: 0.8em;
  ">
    <p>This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
`;





export const FORGOT_PASSWORD_OTP_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset OTP</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">

  <div style="
    max-width: 500px;
    margin: auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
  ">

    <h2 style="color: #333;">
      🔐 Password Reset Request
    </h2>

    <p>
      We received a request to reset your password.
    </p>

    <p>
      Your password reset OTP is:
    </p>

    <div style="
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      text-align: center;
      padding: 20px;
      background: #f1f1f1;
      border-radius: 8px;
    ">
      {otp}
    </div>

    <p style="margin-top: 20px;">
      This OTP will expire in <strong>5 minutes</strong>.
    </p>

    <p>
      If you did not request a password reset, you can safely ignore this email.
    </p>

    <hr>

    <p style="font-size: 12px; color: #777;">
      This is an automated email. Please do not reply.
    </p>

  </div>

</body>
</html>
`;
