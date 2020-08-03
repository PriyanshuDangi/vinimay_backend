const Channel = require("../../models/channel");
const Message = require("../../models/message");

// let currentChannel;
// let userId;

function sendMessageWithDetails(message, userId) {
  return {
    message,
    userId,
  };
}

module.exports = function socketEvents(io) {
  io.on("connection", (socket) => {
    console.log("new websocket connection");

    socket.on("join", async (details, callback) => {
      try {
        let currentChannel = await Channel.findById(details.room);
        if (!currentChannel) {
          //also have to add that user is one of owner1 or owner2
          throw new Error(" Channel Not Found");
        }
        // userId = details.userId;
        socket.join(details.room);
        socket.emit(
          "message",
          sendMessageWithDetails("welcome!", details.userId)
        );
        callback();
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("sendMessage", async (details, message, callback) => {
      try {
        io.to(details.room).emit(
          "message",
          sendMessageWithDetails(message, details.userId)
        );
        let newMessage = new Message({
          channelID: details.room,
          text: message,
          userName: details.username,
          userID: details.userId,
        });
        await newMessage.save();
        console.log(newMessage);
        callback();
      } catch (err) {
        console.log(err);
      }
    });
  });
};
