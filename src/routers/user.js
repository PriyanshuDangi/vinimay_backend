const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendOTP } = require("../email/otp");

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
    sendOTP(user.webmail, user.otp);
    // res.status(201).json({ doVerify: true });
    // const token = await user.genrateAuthToken();
    // res.status(201).json({
    //   token,
    //   user: {
    //     _id: user._id,
    //     name: user.name,
    //     webmail: user.webmail,
    //   },
    // });

    res.status(201).json({ doVerify: true });
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

    res.status(400).json({ error: "Unable to create account" });
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
    if (!user) {
      throw new Error("User not found!");
    }
    if (!user.verified) {
      user.otp = Math.round(Math.random() * 9000 + 1000);
      sendOTP(user.webmail, user.otp);
      await user.save();
      return res.status(200).json({
        doVerify: true,
      });
    }
    const token = await user.genrateAuthToken();
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        webmail: user.webmail,
        newMessageCount: user.newMessageCount,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   POST api/user/checkOTP
 * @desc    To verify the user
 * @access  Public
 */
router.post("/checkOTP", async (req, res) => {
  try {
    const user = await User.findOne({ webmail: req.body.webmail });
    if (!user) {
      throw new Error("no such user exist");
    }
    if (user.verified) {
      throw new Error("otp not needed, You can directly login");
    }
    console.log(req.body);
    if (String(req.body.otp) !== String(user.otp)) {
      throw new Error("wrong otp");
    }
    user.otp = null;
    user.verified = true;
    const token = await user.genrateAuthToken();
    res.status(200).json({
      token,
      doVerify: false,
      verified: true,
      user: {
        _id: user._id,
        name: user.name,
        webmail: user.webmail,
        newMessageCount: user.newMessageCount,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
});

/**
 * @route   POST api/user/regenrateOTP
 * @desc    To regnrate OTP
 * @access  Public
 */
router.post("/regenrateOTP", async (req, res) => {
  try {
    const user = await User.findOne({ webmail: req.body.webmail });
    if (!user) {
      throw new Error("user does not exist");
    }
    if (!user.otp) {
      throw new Error("otp verification not needed");
    }
    user.otp = Math.round(Math.random() * 9000 + 1000);
    sendOTP(user.webmail, user.otp);
    await user.save();
    res.status(200).send({ message: "otp is sent to the registered webmail" });
  } catch (err) {
    console.log(err);
    if (err.message) {
      return res.status(400).send({ error: err.message });
    }
    res.status(500).json({ error: "sorry unable to send the otp again" });
  }
});

/**
 * @route   POST api/user/changePassword
 * @desc    Change Password
 * @access  Private
 */
router.post("/changePassword", auth, async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.webmail,
      req.body.oldPassword
    );
    if (!user) {
      throw new Error("webmail and oldPassword doesn't match");
    }
    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({ message: "password successfully changed" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   GET api/user/checkToken
 * @desc    For checking the token on automatically logging in
 * @access  Private
 */
router.get("/checkToken", auth, (req, res) => {
  res.status(200).send({
    user: {
      _id: req.user._id,
      name: req.user.name,
      webmail: req.user.webmail,
      newMessageCount: req.user.newMessageCount,
    },
  });
});

module.exports = router;
