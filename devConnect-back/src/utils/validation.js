const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name must be between 4 and 50 characters");
  } else if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last name must be between 4 and 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not a strong password");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "password",
    "photo",
    "gender",
    "about",
    "skills",
    "age",
    "emailId",
    "linkedinUrl",
    "githubUrl",
  ];
  const isUpdateAllowed = Object.keys(req.body || {}).every((k) =>
    ALLOWED_UPDATES.includes(k),
  );
  return isUpdateAllowed;
};

const validateLogin = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not a strong password");
  }
};

const validatePasswordChangeData = (req) => {
  const { oldPassword, newPassword } = req.body || {};

  if (!oldPassword || !newPassword) {
    throw new Error("oldPassword and newPassword are required");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("New password is not strong enough");
  }

  if (oldPassword === newPassword) {
    throw new Error("New password must be different from old password");
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateLogin,
  validatePasswordChangeData,
};
