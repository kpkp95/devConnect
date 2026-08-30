require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./configs/database");
const User = require("./models/user");
const { validateSignUpData, validateLogin } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = 3000;
const { userAuth } = require("./middlewares/auth");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/users", async (req, res) => {
  const email = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(201).send(user, { message: "User found" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  const ALLOWED_UPDATES = [
    "photo",

    "userId",
    "gender",
    "password",
    "about",
    "skills",
    "age",
  ];

  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      return res.status(400).send({ error: "Invalid updates" });
    }
    if (data.skills && data.skills.length > 8) {
      throw new Error("You can add maximum 8 skills");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

connectDB()
  .then(() => {
    app.listen(port, () => {});
  })
  .catch((err) => {
    // connection failed silently; errors are handled in database config
  });
