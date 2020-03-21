const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  profilepic: {
    type: String
    // default:
    //   "https://image.shutterstock.com/z/stock-vector-businessman-icon-564112600.jpg"
    //male: https://image.flaticon.com/icons/svg/236/236831.svg
    //female: https://image.flaticon.com/icons/svg/180/180678.svg
  },
  date: {
    type: Date,
    default: Date.now()
  },
  //task:
  gender: {
    type: String,
    required: true
  }
});

module.exports = Person = mongoose.model("myPerson", PersonSchema);
