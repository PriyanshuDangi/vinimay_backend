const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    between: [
      {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        newMessagesRecieved: {
          //number of new messages recieved from the above name or send by the above name
          type: Number,
          default: 0,
        },
      },
    ],
    lastMessage: {
      type: String,
      default: null,
    },
    lastSendBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model("channel", channelSchema);

module.exports = Channel;
