const mongose = require("mongoose");
const userSchema = new mongose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  //  fields for password reset functionality
  resetOTP: {
    type: String,
    default: null,
  },
  resetOTPExpires: {
    type: Date,
    default: null,
  },
});
const Usermodel = mongose.model("User", userSchema);
module.exports = Usermodel;
