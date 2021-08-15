const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, "Invalid First Name"],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, "Invalid Last Name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "A User must have an email address"],
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
      },
    },
    password: {
      type: String,
      minLength: [6, "Password Must be of minimum 6 characters"],
      maxLength: [16, "Password Must be of maximum 16 characters"],
      required: [true, "A User Must have a Password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
    },
    contact: {
      type: String,
      minlength: 6,
      required: [true, "A User Must Enter his Contact Number"],
    },
    avatar: {
      type: String,
    },
  },
  {
    // for virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  // will run when user.save() or user.create({});
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  typed_password,
  user_password
) {
  return await bcryptjs.compare(typed_password, user_password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
