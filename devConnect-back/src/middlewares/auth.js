const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  // read the token from the request header\

  try {
    const cookie = req.cookies;

    const token = cookie.token;
    if (!token) {
      return res.status(401).send({ error: "Please login first" });
    }
    const decodedObj = await jwt.verify(token, "DEV@CONNECT");
    if (!decodedObj) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { userAuth };
