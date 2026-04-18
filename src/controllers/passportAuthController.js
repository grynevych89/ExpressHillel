import { SESSION_COOKIE_NAME } from "../config.js";
import { register } from "../services/userService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const passportRegister = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await register(email, password);
  await new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) {
        const loginError = new Error("Login after registration failed");
        loginError.status = 500;
        return reject(loginError);
      }
      resolve();
    });
  });
  res.status(201).json({ user });
});

const passportLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie(SESSION_COOKIE_NAME);
      res.json({ message: "Logged out" });
    });
  });
};

const passportGetMe = (req, res) => {
  res.json({ user: req.user });
};

export { passportRegister, passportLogout, passportGetMe };
