const Channel = require("../../models/channel");
const Message = require("../../models/message");
const User = require("../../models/user");
function sendMessageWithDetails(message, userId, room) {
  return {
    message,
    userId,
    room,
  };
}

module.exports = function socketEvents(io) {
  io.on("connection", (socket) => {
    console.log("new websocket connection");

    socket.on("join", async (details, callback) => {
      try {
        if (!details.home) {
          let currentChannel = await Channel.findById(details.room);
          if (!currentChannel) {
            //also have to add that user is one of owner1 or owner2
            throw new Error(" Channel Not Found");
          }
        }
        // console.log(details);
        // userId = details.userId;
        socket.join(details.room);
        // socket.emit(
        //   "message",
        //   sendMessageWithDetails("welcome!", details.userId)
        // );
        callback();
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("sendMessage", async (details, message, callback) => {
      try {
        console.log(details);
        io.to(details.room).emit(
          "message",
          sendMessageWithDetails(message, details.userId, details.room)
        );
        let newMessage = new Message({
          channelID: details.room,
          text: message,
          userName: details.username,
          userID: details.userId,
        });
        let channel = await Channel.findById(details.room);
        let index = channel.between.findIndex((element) => {
          return String(element.id) === String(details.userId);
        });
        let otherIndex = index ? 0 : 1;
        const otherUser = await User.findById(channel.between[otherIndex].id);
        if (!otherUser) {
          //unable to send message
        }
        otherUser.newMessageCount = otherUser.newMessageCount + 1;
        io.to(channel.between[otherIndex].id).emit(
          "notification",
          otherUser.newMessageCount,
          details.room,
          message,
          details.userId
        );
        channel.between[index].newMessagesRecieved =
          channel.between[index].newMessagesRecieved + 1;
        channel.lastMessage = message;
        channel.lastSendBy = details.userId;
        await otherUser.save();
        await newMessage.save();
        await channel.save();
        // console.log(channel.between);
        // console.log(channel);
        // console.log(newMessage);
        callback();
      } catch (err) {
        console.log(err);
      }
    });
  });
};
