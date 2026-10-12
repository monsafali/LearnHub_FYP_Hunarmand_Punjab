export const setTokenCookieAndSend = (
  res,
  user,
  statusCode = 200,
  message = "Success"
) => {
  const token = user.generateJsonWebToken();

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

  // Production frontends and APIs are commonly hosted on different sites.
  // SameSite=None is required for the browser to send the cookie cross-site,
  // and browsers require Secure whenever SameSite=None is used.
  const isProduction = process.env.NODE_ENV === "production";

  return res
    .status(statusCode)
    .cookie("jwt-token", token, {
      expires: new Date(
        Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    .json({
      success: true,
      message,
      user,
    });
};
