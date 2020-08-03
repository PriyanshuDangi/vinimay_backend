const Channel = require("../models/channel");
const Message = require("../models/message");
const User = require("../models/user");
const express = require("express");
const auth = require("../middleware/auth");

const router = new express.Router();

/**
 * @route   POST api/chat/channel/create
 * @desc    Create Channel
 * @access  Private
 */
router.post("/channel/create", auth, async (req, res) => {
  try {
    const seller = await User.findById(req.body.sellerId);
    if (!seller) {
      throw new Error("Unable To Find Seller");
    }
    let channelId;
    let alreadyChatting = req.user.chatWith.every((element) => {
      if (String(element.id) == String(seller._id)) {
        channelId = element.channelId;
      }
      return String(element.id) === String(seller._id);
    });
    if (req.user.chatWith.length === 0) {
      alreadyChatting = false;
    }
    console.log(alreadyChatting);
    if (alreadyChatting) {
      let channel = await Channel.findById(channelId).lean();
      return res.json({ channel });
    }
    let channel = new Channel({
      owner1: req.user._id, //the one who want to buy
      owner2: seller._id, //the one who is selling
      between: [
        {
          id: req.user._id,
          name: req.user.name,
        },
        {
          id: seller._id,
          name: seller.name,
        },
      ],
    });
    seller.chatWith.push({
      name: req.user.name,
      id: req.user._id,
      channelId: channel._id,
    });
    req.user.chatWith.push({
      name: seller.name,
      id: seller._id,
      channelId: channel._id,
    });
    await channel.save();
    await req.user.save();
    await seller.save();
    res.json({ channel });
  } catch (err) {
    console.log(err);
    res.status(400).send("unable to create the channel");
  }
});

router.get("/peoples/get", auth, async (req, res) => {
  try {
    const peoples = req.user.chatWith;
    res.json({ peoples });
  } catch (err) {
    console.log(err);
  }
});

router.post("/getChat", auth, async (req, res) => {
  try {
    console.log(req.body);
    const messages = await Message.find({ channelID: req.body.channelId })
      .sort({ createdAt: -1 })
      .lean();
    const a = messages.map((message) => {
      return {
        userId: message.userID,
        message: message.text,
      };
    });
    console.log(a);
    res.json({ messages: a });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
