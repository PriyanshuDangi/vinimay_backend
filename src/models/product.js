const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      //   validate(value) {
      //     if (value < 0) {
      //       throw new Error("price must be positive");
      //     }
      //   },
      validate: {
        validator: (value) => value >= 0,
        message: () => "price must be positive",
      },
    },
    category: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          ["books", "cycles", "eg stuff", "miscellanous"].includes(value),
        message: (props) => props.value + " is not a defined category",
      },
    },
    image: {
      type: Buffer,
      required: true,
    },
    image2: {
      type: Buffer,
    },
    image3: {
      type: Buffer,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
