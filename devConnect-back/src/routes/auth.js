const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
authRouter.use(express.json()); //this will work for all route
authRouter.use(cookieParser());

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashedPassword,
      age: req.body.age,
      gender: req.body.gender,
      about: req.body.about,
      photo: req.body.photo,
      skills: req.body.skills,
      linkedinUrl: req.body.linkedinUrl,
      githubUrl: req.body.githubUrl,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }); // Expires in 1 day
    res.status(201).json({
      user: savedUser.toObject(),
      message: "User created successfully",
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("emailId and password are required");
    }

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send({ error: "Invalid credentials" });
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const token = await user.getJWT();
    res.cookie("token", token, { httpOnly: true });

    res.status(200).send({
      user: user.toObject(),
      message: "Login successful",
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { httpOnly: true, expires: new Date(0) });
    res.status(200).send({ message: "Logout successful" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = authRouter;
