const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Not a strong password.minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
          );
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw new Error("Invalid gender");
        }
      },
    },
    photo: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
    birthDate: { type: Date },
    about: { type: String, default: "This is a default about section." },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: this._id }, "DEV@CONNECT");
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(password, passwordHash);
  return isPasswordValid;
};

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

userSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
