const express = require("express");
const requestRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { validateSignUpData, validateLogin } = require("../utils/validation");
requestRouter.use(express.json()); //this will work for all route
requestRouter.use(cookieParser());
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const validStatuses = ["ignored", "interested"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ error: "You cannot send a request to yourself" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ error: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const savedConnectionRequest = await connectionRequest.save();

      res.status(200).json({
        message: "Connection request sent successfully",
        connectionRequest: savedConnectionRequest,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      
      const {status, requestId }= req.params
      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      // Find the connection request by ID and ensure it belongs to the logged-in user
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      // If the connection request doesn't exist or doesn't belong to the logged-in user, return an error
      if (!connectionRequest) {
        return res.status(404).json({ error: "Connection request not found" });
      }

      connectionRequest.status = status;
      const updatedConnectionRequest = await connectionRequest.save();

      res.status(200).json({
        message: `Connection request ${status} successfully`,
        connectionRequest: updatedConnectionRequest,
      });



      // sender to receiver
      // is sender the logged in user which means  logged in user will toUserId
      //status = interested because is the receiver got request from sender who is interested in connecting with the receiver
      //other status is not required because the receiver can only accept or reject the request
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  },
);

module.exports = requestRouter;
