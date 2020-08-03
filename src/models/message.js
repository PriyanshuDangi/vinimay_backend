const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    channelID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "channel",
    },
    text: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
