const express = require("express");

const app = express();
app.use("/home", (req, res) => {
  res.send("Welcome to home");
});
app.use("/", (req, res) => {
  res.send("Hello 123 /");
});

app.listen(3002, () => {
  console.log("my server");
});
