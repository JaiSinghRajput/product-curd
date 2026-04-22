import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0.01,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    exchange: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ userId: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
