const Product = require("./../models/productModel");
const AppError = require("../utils/AppError");
const cloudinary = require("./../utils/cloudinary");

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      product,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "successfully updated",
      product,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const product = await Product.find({});
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (err) {
    next(err);
  }
};
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
    });
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(201).json({
      id: result.public_id,
      src: result.secure_url,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.destroy(
      req.params.id,
      function (result) {
        console.log(result);
      }
    );
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};
