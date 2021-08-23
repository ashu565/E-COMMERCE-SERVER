const User = require("../models/authModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");
const Email = require("../utils/email");
const crypto = require("crypto");
const cloudinary = require("../utils/cloudinary");

exports.signup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, passwordConfirm } =
      req.body;
    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match same", 400));
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      passwordConfirm,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.password = undefined;
    user.passwordConfirm = undefined;
    const message = `Hey ${user.first_name} , Welcome to Louis World, Will look greatful to you`;
    await new Email(user, message).sendWelcomeMessage();
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
      return next(new AppError("Email or Password is Missing", 400));
    }
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user || !(await user.comparePasswords(password, user.password))) {
      return next(new AppError("Email or Password is Incorrect", 401));
    }
    user.password = undefined;
    user.passwordConfirm = undefined;
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

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new AppError("You are not logged in", 400));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // return decoded : {id} because User was encrypted using its id
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("No Such User Exist", 404));
    }
    user.password = undefined; // it just avoid showing password in response but not in database
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
// getting data of user
exports.getuser = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return next(new AppError("No Such User Exist", 404));
    }
    res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return next(new AppError("No Such Account with this email", 404));
    }
    const resetToken = await user.createResetToken();
    const resetURL = `${process.env.CLIENT_URL}/${resetToken}`;
    const message = `Hey ${user.first_name} ,Forgotten your password ! Reset your password using ${resetURL} if already done please ignore this message`;
    try {
      await new Email(user, message).sendPasswordResetMessage();
      res.status(200).json({
        status: "success",
        message: "Token Send to the Email",
      });
      await user.save({ validateBeforeSave: false });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("Token Can't Send,Server is busy", 400));
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.id;
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      next(
        new AppError(
          "The Password Reset Link has been expired ! Please Reset Again",
          404
        )
      );
    }
    const { password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
      return next(new AppError("Password do not match Same", 400));
    }
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfilePhoto = async (req, res, next) => {
  try {
    const { user } = req; // will run after protect route
    if (user.avatar_id) {
      await cloudinary.uploader.destroy(user.avatar_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        avatar_url: result.secure_url,
        avatar_id: result.public_id,
      },
      {
        new: true,
        runValidators: false,
      }
    );
    res.status(200).json({
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
