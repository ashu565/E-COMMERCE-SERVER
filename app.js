const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss");
const globalErrorHandler = require("./utils/globalErrorHandler");
const AppError = require("./utils/AppError");

const authRoutes = require("./routes/authRoutes");

const app = express();

// parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// allows cross origin resource sharing
app.use(cors());
app.options("*", cors());

app.use(helmet());

// prevents cross-side-scrypt
// app.use(xss());
app.get("/", function (req, res) {
  res.send("Hey E-Commerce Root Directory");
});

// hpp still remains

// routes
app.use("/api/v1/auth", authRoutes);
// globalerrorHandler

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`), 404);
});
app.use(globalErrorHandler);

module.exports = app;
