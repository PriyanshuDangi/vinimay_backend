const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

require("./src/db/mongoose");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRouter = require("./src/routers/user");
const productRouter = require("./src/routers/product");
const chatRouter = require("./src/routers/chat");
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/chat", chatRouter);

const socket = require("./src/utils/chat/io");
socket(io);

//serve static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 2000;
server.listen(port, () => {
  console.log("Application is up on port " + port);
});
