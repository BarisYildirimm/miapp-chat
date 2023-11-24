export const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req}`);
  res.status(404);
  next(error);
};
import colors from "colors";

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  //Check for Mongoose bad ObjectId

  if (err.name === "castError" && err.kind == "object") {
    message = "Resource not found";
    statusCode = 404;
  }
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV !== "production" ? "OK" : err.stack,
  });
};
