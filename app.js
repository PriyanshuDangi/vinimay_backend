const express = require("express");

require("./src/db/mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRouter = require("./src/routers/user");
const productRouter = require("./src/routers/product");
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log("Application is up on port " + port);
});
