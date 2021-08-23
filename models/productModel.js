const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "A Product Must Have a Name"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A Product Must have a Description"],
    },
    headImage: {
      type: String,
      required: [true, "A Product Must have a image"],
    },
    otherImages: {
      type: [String],
    },
    colors: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Please add atleast one availble color",
      },
    },
    sizes: {
      type: [String],
      enum: ["sm", "lg", "xl", "2xl", "3xl"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Please add atleast one availble size",
      },
    },
    quantity: {
      type: Number,
      required: [true, "A Product Must have quantites"],
    },
    availble: {
      type: Boolean,
      default: false,
    },
  },
  {
    // for virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function (next) {
  // this is document middleware
  if (this.quantity > 0) {
    this.availble = true;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
