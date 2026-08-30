const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
userRouter.use(express.json()); //this will work for all route
userRouter.use(cookieParser());

//get all the pending requests for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "emailId",
      "age",
      "gender",
      "photo",
      "about",
      "skills",
    ]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/user/requests/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "photo",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "photo",
        "about",
        "skills",
      ]);
    const users = connectionRequests.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return {
          user: request.toUserId,
          status: request.status,
        };
      } else {
        return {
          user: request.fromUserId,
          status: request.status,
        };
      }
    });

    res.json({
      message: "Data fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id.toString();
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .select("fromUserId toUserId status")
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      if (request.fromUserId?._id) {
        hideUserFromFeed.add(request.fromUserId._id.toString());
      }
      if (request.toUserId?._id) {
        hideUserFromFeed.add(request.toUserId._id.toString());
      }
    });

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUserFromFeed) } },
      ],
    }).select("firstName lastName emailId age gender photo about skills");

    const filteredUsers = users.filter(
      (user) =>
        user._id.toString() !== loggedInUserId &&
        !hideUserFromFeed.has(user._id.toString()),
    );

    const paginatedUsers = filteredUsers.slice(
      (page - 1) * limit,
      page * limit,
    );

    res.json({
      message: "Data fetched successfully",
      data: paginatedUsers,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
module.exports = userRouter;
