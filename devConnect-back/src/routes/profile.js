const express = require("express");
const profileRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const {
  validateSignUpData,
  validateLogin,
  validateEditProfileData,
  validatePasswordChangeData,
} = require("../utils/validation");

const { userAuth } = require("../middlewares/auth");
profileRouter.use(express.json()); //this will work for all route
profileRouter.use(cookieParser());

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  //get the user from the token
  try {
    const user = req.user;

    //fetch user details from db
    res.send(user);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  //get the user from the token
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, "password")) {
      throw new Error("Use /profile/password to update password");
    }

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid data");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.send({
      message: "Profile updated successfully",
      user: user.toObject(),
    });
  } catch (err) {
    const statusCode = err.message === "Invalid data" ? 400 : 401;
    res.status(statusCode).send({ error: err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validatePasswordChangeData(req);

    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await user.validatePassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;
//   const ALLOWED_UPDATES = [
//     "photo",

//     "userId",
//     "gender",
//     "password",
//     "about",
//     "skills",
//     "age",
//   ];

//   try {
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k),
//     );
//     if (!isUpdateAllowed) {
//       return res.status(400).send({ error: "Invalid updates" });
//     }
//     if (data.skills && data.skills.length > 8) {
//       throw new Error("You can add maximum 8 skills");
//     }
//     const user = await User.findByIdAndUpdate(userId, data, {
//       runValidators: true,
//     });
//     if (!user) {
//       return res.status(404).send({ error: "User not found" });
//     }
//     res.status(200).send({ message: "User updated successfully" });
//   } catch (err) {
//     res.status(400).send({ error: err.message });
//   }
// });

module.exports = profileRouter;
