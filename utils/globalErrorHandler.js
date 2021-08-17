const handleDuplicateError = (err, req, res) => {
  const duplicateFields = Object.keys(err.keyValue).join(" , ");

  const message = `Value given to ${duplicateFields} already taken!`;

  res.status(err.statusCode).json({
    status: err.status,
    message,
  });
};

const handleInvalidToken = (err, req, res) => {
  const message = " Authorization token invalid";
  res.status(err.statusCode).json({ status: err.status, message });
};

const sendErrorDev = (err, req, res, next) => {
  if (err.code === 11000) return handleDuplicateError(err, req, res);
  if (err.name === "JsonWebTokenError")
    return handleInvalidToken(err, req, res);
  console.log(err.name);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendErrorProd = (err, req, res, next) => {
  //A) Programming or logic error, do not send error to client.
  if (!err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: "something went wrong",
    });
  }

  // B) Operational, trusted error: send message to client
  if (err.code === "11000") return handleDuplicateError(err, req, res);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res, next);
  } else sendErrorProd(err, req, res, next);
};
