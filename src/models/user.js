const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    webmail: {
      type: String,
      trim: true,
      required: [true, "webmail is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => /^\d{9}@nitt.edu/.test(value),
        message: () => "please enter valid webmail",
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
      minlength: 7,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    otp: {
      type: Number,
      minlength: 4,
      maxlength: 4,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    chatWith: [
      {
        name: String,
        id: mongoose.Schema.Types.ObjectId,
        channelId: mongoose.Schema.Types.ObjectId,
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.genrateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//used to login user
userSchema.statics.findByCredentials = async (webmail, password) => {
  const user = await User.findOne({ webmail });
  if (!user) {
    throw new Error("Invalid Credentials");
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new Error("Invalid Credentials");
  }
  return user;
};

//for hashing the password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
