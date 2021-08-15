const User = require("../models/authModel");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, contact, password, passwordConfirm } =
      req.body;
    if (password !== passwordConfirm) {
      res.status(400).json({
        status: "fail",
        message: "password and password-confirm do not match same",
      });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      contact,
      password,
      passwordConfirm,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.password = undefined;
    user.passwordConfirm = undefined;

    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("auth failed");
      return;
    }
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user || !(await user.comparePasswords(password, user.password))) {
      console.log("auth failed");
      return;
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};
