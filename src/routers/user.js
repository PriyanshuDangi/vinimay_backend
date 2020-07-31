const User = require("../models/user");
const express = require("express");

const sendOTP = require("../email/otp");

const router = new express.Router();

/**
 * @route   POST api/user/signup
 * @desc    Signup user
 * @access  Public
 */
router.post("/signup", async (req, res) => {
  try {
    const otp = Math.round(Math.random() * 9000 + 1000);
    const user = new User({ ...req.body, otp });
    await user.save();
    // res.status(201).send(user);
    // sendOTP(user.webmail, user.otp);
    // res.status(201).json({ doVerify: true });
    const token = await user.genrateAuthToken();
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        webmail: user.webmail,
      },
    });
  } catch (err) {
    // console.log(err);
    // Duplicate webmail
    if (err.errors) {
      if (err.errors["webmail"]) {
        return res.status(422).send({ error: err.errors["webmail"].message });
      }
      if (err.errors["name"]) {
        return res.status(422).send({ error: err.errors["name"].message });
      }
      if (err.errors["password"]) {
        return res.status(422).send({ error: err.errors["password"].message });
      }
    }
    if (err.name === "MongoError" && err.code === 11000) {
      return res
        .status(422)
        .send({ error: "Account already exist! Please Login" });
    }

    res.status(401).json({ error: "Unable to create account" });
  }
});

/**
 * @route   POST api/user/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.webmail,
      req.body.password
    );
    // if (user.otp) {
    //   user.otp = Math.round(Math.random() * 9000 + 1000);
    //   await user.save();
    //   //   sendOTP(user.webmail, user.otp);
    //   res.status(201).json({ doVerify: true });
    // }
    const token = await user.genrateAuthToken();
    res.status(200).json({
      token,
      doVerify: false,
      user: {
        _id: user._id,
        name: user.name,
        webmail: user.webmail,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
});

router.post("/checkOTP", async (req, res) => {
  try {
    const user = await User.findOne({ webmail: req.body.webmail });
    if (!user) {
      throw new Error("no such user exist");
    }
    if (!user.otp) {
      throw new Error("otp not needed, You can directly login");
    }
    if (req.body.otp !== user.otp) {
      throw new Error("wrong otp");
    }
    user.otp = null;
    const token = await user.genrateAuthToken();
    res.status(200).json({
      token,
      doVerify: false,
      user: {
        _id: user._id,
        name: user.name,
        webmail: user.webmail,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
});

router.post("/regenrateOTP", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.send("user does not exist");
    }
    if (!user.otp) {
      return res.send("otp not needed");
    }
    user.otp = Math.round(Math.random() * 9000 + 1000);
    await user.save();
    res.send("otp is sent to the registered webmail");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
