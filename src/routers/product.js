const express = require("express");
const Product = require("../models/product");
const auth = require("../middleware/auth");
const multer = require("multer");
const uploads = multer({});

const router = new express.Router();

/**
 * @route   POST api/product/create
 * @desc    Create Product
 * @access  Private
 */
router.post(
  "/create",
  auth,
  uploads.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const product = new Product({
        ...req.body,
        image: req.files["image1"][0].buffer,
        image2: req.files["image2"] ? req.files["image2"][0].buffer : null,
        image3: req.files["image3"] ? req.files["image3"][0].buffer : null,
        owner: req.user._id,
      });
      await product.save();
      res.status(201).send({ product });
    } catch (err) {
      console.log(err);
      if (err.message) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).send({ error: "unable to create the product" });
    }
  }
);

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
    let isOwner = String(req.user._id) === String(product.owner);
    res.status(200).json({ product, isOwner });
  } catch (err) {
    res.status(400).json({ error: "unable to get the product" });
    console.log(err);
  }
});

/**
 * @route   POST api/product/update/:id
 * @desc    Update Product
 * @access  Private
 */
router.post(
  "/update/:id",
  auth,
  uploads.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
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
        "image2",
        "image3",
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
      if (req.files["image1"]) {
        product.image = req.files["image1"][0].buffer;
      }
      if (req.files["image2"]) {
        product.image2 = req.files["image2"][0].buffer;
      }
      if (req.files["image3"]) {
        product.image3 = req.files["image3"][0].buffer;
      }
      await product.save();
      res.json({ product });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 * @route   Delete api/product/delete/:id
 * @desc    Delete Product
 * @access  Private
 */
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!product) {
      throw new Error("unable to delete the requested product");
    }
    product.remove();
    res.json({ msg: "product removed successfully!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   GET api/product/readAll?limit=12&skip=0
 * @desc    To get all the products
 * @access  Must be logged in
 */
router.get("/readAll", auth, async (req, res) => {
  try {
    const products = await Product.find()
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort({ createdAt: -1 })
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
 * @desc    TO get all my Products
 * @access  Private
 */
router.get("/myproducts", auth, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    if (!products) {
      throw new Error("No Product Found");
    }
    res.json({ products });
  } catch (err) {
    res.status(400).send({ error: "Unable To Fetch The Products" });
    console.log(err);
  }
});

/**
 * @route   Get api/product/search?string=physics
 * @desc    My Products
 * @access  Private
 */
router.get("/search", auth, async (req, res) => {
  try {
    let allProducts;
    if (req.query.sortBy) {
      console.log(req.query.sortBy);
      if (req.query.sortBy.includes("price")) {
        let sortquery = req.query.sortBy.split("-");
        if (sortquery[1] === "desc") {
          allProducts = await Product.find().sort({ price: -1 }).lean();
        } else {
          allProducts = await Product.find().sort({ price: 1 }).lean();
        }
      }
    } else {
      allProducts = await Product.find().sort({ createdAt: -1 }).lean();
    }

    let products;
    if (req.query.string === undefined) {
      products = allProducts;
    } else {
      products = allProducts.filter((product) => {
        const regex = new RegExp(`${req.query.string}`, "gi");
        return product.title.match(regex);
      });
    }
    const totalPage = Math.ceil(products.length / 12);
    res.json({ products, totalPage });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
