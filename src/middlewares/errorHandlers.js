import { ERROR_MESSAGES } from "../config.js";

const notFound = (req, res) => res.status(404).render("404.pug");

const notFoundError = (res, resource = "Resource") =>
  res.status(404).json({ error: `${resource} not found` });

const handleError = (err, req, res, next) => {
  let status = 500;
  let message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  let details = null;

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    status = 400;
    details = Object.entries(err.errors).reduce((acc, [field, error]) => {
      acc[field] = error.message;
      return acc;
    }, {});
  }
  // Handle Mongoose Cast Error (invalid ObjectId)
  else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.kind}: ${err.value}`;
  }
  // Handle Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  else if (err.status) {
    status = err.status;
  }

  if (req.method === "GET" && req.accepts("html") && !req.xhr) {
    return res.status(status).render("error.ejs", { message });
  }

  const response = { error: message };
  if (details) response.details = details;
  res.status(status).json(response);
};

export { notFound, handleError, notFoundError };
