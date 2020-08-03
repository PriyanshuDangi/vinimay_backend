const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    owner1: {
      //one who started
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    owner2: {
      //one who was selling
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    between: mongoose.Schema.Types.Array,
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model("channel", channelSchema);

module.exports = Channel;
