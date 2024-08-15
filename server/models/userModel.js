const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userschema = mongoose.Schema({
  name: {
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
  IsAdmin: {
    type: Boolean,
    default: false,
  },
  IsDoctor: {
    type: Boolean,
    default: false,
  },
  Notification: {
    type: Array,
    default: [],
  },
  SeenNotification: {
    type: Array,
    default: [],
  }
});
// usermodel.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
// usermodel.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
const userModel = mongoose.model("users", userschema);
module.exports = userModel;
