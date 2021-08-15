const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss");

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

module.exports = app;
