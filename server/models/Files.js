const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  userImg: {
    type: String,
    required: true,
    default: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png",
  },
  userName: {
    type: String,
    required: [true, "Please provide Fullname"],
  },
  userEmail: {
    type: String,
    required: [true, "Please provide email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  userUid: {
    type: String,
    required: [true, "Please add user UId"],
    
  },
  cidValue: {
    type: String,
    required: [true, "Please provide cid "],
  },
  filename: {
    type: String,
    required: [true, "Please provide filename"],
  },
  
},{timestamps: true});









const Files = mongoose.model("Files", UserSchema);

module.exports = Files;