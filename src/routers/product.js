const Product = require("../models/product");
const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const uploads = multer({});

const router = new express.Router();

/**
 * @route   POST api/product/create
 * @desc    Create Product
 * @access  Private
 */
router.post("/create", auth, uploads.single("image1"), async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      image: req.file.buffer,
      owner: req.user._id,
    });
    await product.save();
    res.send({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.log(err);
  }
});

/**
 * @route   GET api/product/read/:id
 * @desc    Read Product
 * @access  must be logged in
 */
router.get("/read/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      throw new Error("Product not found");
    }
    let isOwner = req.user._id.toString() == product.owner.toString();
    res.status(200).json({ product, isOwner });
  } catch (err) {
    res.status(400).json({ error: "unable to get the product" });
    console.log(err);
  }
});

/**
 * @route   POST api/product/read/:id
 * @desc    Update Product
 * @access  Private
 */
router.post("/update/:id", auth, uploads.single("image1"), async (req, res) => {
  try {
    // const product = await Product.findById(req.params.id);
    //have to use this one after authentication is added
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!product) {
      throw new Error("No such product exist");
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "category",
      "title",
      "description",
      "price",
      "image",
    ];
    const isValid = updates.filter((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValid) {
      throw new Error("Please provide valid data!");
    }
    isValid.forEach((update) => {
      product[update] = req.body[update];
    });
    product.image = req.file.buffer;
    await product.save();
    res.json({ product });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
});

/**
 * @route   Delete api/product/delete/:id
 * @desc    Delete Product
 * @access  Private
 */
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    // const product = await Product.findById(req.params.id);
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!product) {
      throw new Error("unable to delete the requested product");
    }
    // await setTimeout(() => {}, 10000);
    product.remove();
    res.json({ msg: "product removed successfully!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   GET api/product/readAll?limit=12&skip=0
 * @desc    Update Product
 * @access  Must be logged in
 */
router.get("/readAll", auth, async (req, res) => {
  try {
    const products = await Product.find()
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .lean();
    if (!products) {
      throw new Error("No Product Found");
    }
    const productsCount = await Product.countDocuments();
    const totalPage = Math.ceil(productsCount / parseInt(req.query.limit));
    res.json({ products, totalPage });
  } catch (err) {
    res.status(400).send({ error: "Unable To Fetch The Products" });
    console.log(err);
  }
});

/**
 * @route   GET api/product/myproducts
 * @desc    My Products
 * @access  Private
 */
router.get("/myproducts", auth, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id }).lean();
    if (!products) {
      throw new Error("No Product Found");
    }
    res.json({ products });
  } catch (err) {
    res.status(400).send({ error: "Unable To Fetch The Products" });
    console.log(err);
  }
});

//request to buy a product

module.exports = router;