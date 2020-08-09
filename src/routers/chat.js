const Channel = require("../models/channel");
const Message = require("../models/message");
const User = require("../models/user");
const express = require("express");
const auth = require("../middleware/auth");
const { response } = require("express");

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
    // let channelAlreadyExists = await Channel.find({
    //   "between.id": req.user._id,
    //   "between.id": req.body.sellerId,
    // });
    // if (channelAlreadyExists.length !== 0) {
    //   console.log("already exists");
    //   return res.json({ channel: channelAlreadyExists[0] });
    // }

    // let channelId;
    // let alreadyChatting = req.user.chatWith.find((element) => {
    //   if (String(element.id) === String(seller._id)) {
    //     channelId = element.channelId;
    //   }
    //   return String(element.id) === String(seller._id);
    // });
    // if (req.user.chatWith.length === 0) {
    //   alreadyChatting = false;
    // }
    // if (alreadyChatting) {
    //   let channel = await Channel.findById(channelId).lean();
    //   return res.json({ channel });
    // }
    let channel = new Channel({
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
    // seller.chatWith.unshift({
    //   name: req.user.name,
    //   id: req.user._id,
    //   channelId: channel._id,
    // });
    // req.user.chatWith.unshift({
    //   name: seller.name,
    //   id: seller._id,
    //   channelId: channel._id,
    // });
    await channel.save();
    // await req.user.save();
    // await seller.save();
    res.json({ channel });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "unable to create the channel" });
  }
});

/**
 * @route   GET api/chat/peoples/get
 * @desc    Get all the peoples inbox
 * @access  Private
 */
router.get("/peoples/get", auth, async (req, res) => {
  try {
    // const peoples = req.user.chatWith;
    // res.json({ peoples });
    const peoplesArray = await Channel.find({
      "between.id": req.user._id,
    }).sort({ updatedAt: -1 });
    let peoples = peoplesArray.map((people) => {
      let index = people.between.findIndex((element) => {
        return String(element.id) !== String(req.user._id);
      });
      return {
        channelId: people._id,
        id: people.between[index].id,
        name: people.between[index].name,
        newMessagesRecieved: people.between[index].newMessagesRecieved,
        lastMessage: people.lastMessage,
        time: people.updatedAt,
      };
    });
    res.json({ peoples });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "unable to fetch the inbox" });
  }
});

/**
 * @route   POST api/chat/getChat
 * @desc    Get all the messages
 * @access  Private
 */
router.post("/getChat", auth, async (req, res) => {
  try {
    const channel = await Channel.findOne({
      _id: req.body.channelId,
      "between.id": req.user._id,
    });
    if (!channel) {
      throw new Error("No such channel exists");
    }
    const messages = await Message.find({
      channelID: req.body.channelId,
    })
      .sort({ createdAt: 1 })
      .lean();
    const a = messages.map((message) => {
      return {
        userId: message.userID,
        message: message.text,
        time: message.updatedAt,
      };
    });
    res.json({ messages: a });
    // let channel = await Channel.findById(req.body.channelId);
    let index = channel.between.findIndex((element) => {
      return String(element.id) !== String(req.user._id);
    });
    channel.between[index].newMessagesRecieved = 0;
    await channel.save();
  } catch (err) {
    console.log(err);
    if (err.message) {
      return res.status(400).send({ error: err.message });
    }
    res.status(500).send({ error: "unable to load the older messages" });
  }
});

/**
 * @route   GET api/chat/totalNewMessage/count
 * @desc
 * @access  Private
 */
router.get("totalNewMessage/count", auth, async (req, res) => {
  try {
    const peoplesArray = await Channel.find({ "between.id": req.user._id });
    let count = 0;
    peoplesArray.forEach((people) => {
      let index = people.between.findIndex((element) => {
        return String(element.id) !== String(req.user._id);
      });
      if (people.between[index].newMessageCount > 0) {
        count++;
      }
    });
    res.json({ count });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
