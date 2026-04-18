export const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-change-in-production";
export const JWT_EXPIRES = "1h";
export const JWT_COOKIE_NAME = "token";
export const JWT_COOKIE_MAX_AGE = 60 * 60 * 1000; // 1 hour

export const BCRYPT_SALT_ROUNDS = 10;

export const SESSION_SECRET =
  process.env.SESSION_SECRET || "dev-session-secret-change-in-production";
export const SESSION_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
export const SESSION_COOKIE_NAME = "connect.sid";

export const THEME_COOKIE_NAME = "theme";
export const THEME_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
export const ALLOWED_THEMES = ["light", "dark"];

export const VALIDATION_RULES = {
  article: {
    title: {
      minlength: 3,
      maxlength: 200,
      message: "Title must be between 3 and 200 characters",
    },
    author: {
      minlength: 2,
      maxlength: 100,
      message: "Author name must be between 2 and 100 characters",
    },
    content: {
      minlength: 10,
      message: "Content must be at least 10 characters",
    },
  },
  user: {
    password: {
      minlength: 6,
      message: "Password must be at least 6 characters",
    },
    email: {
      message: "Please provide a valid email",
    },
  },
};

export const ERROR_MESSAGES = {
  ARTICLE_NOT_FOUND: "Article not found",
  USER_NOT_FOUND: "User not found",
  INVALID_EMAIL: "Invalid email or password",
  USER_EXISTS: "User already exists",
  NO_IDS_PROVIDED: "No ids provided",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};
