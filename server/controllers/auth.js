const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Files = require("../models/Files");

//  SignIn user
exports.signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorResponse("Please provide an email and password", 400));
    }
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }
      sendToken(user, 200, res);
    } catch (err) {
      next(err);
    }
  };

  //   Register user
exports.signup = async (req, res, next) => {
    const { fullname, email, password, cpassword } = req.body;
  
    try {
      const oldUser = await User.findOne({ email: req.body.email });
      if (password != cpassword) {
        return res.status(401).json({ sucess: false, error: "Invalid credential" });
      }
      if (oldUser) {
        return res.status(409).json({ sucess: false, error: "user already exist" })
      }
      const user = await User.create({
        fullname,
        email,
        password,
      });
  
      sendToken(user, 200, res);
    }
    catch (err) {
      next(err);
    }
  };
  

  const sendToken = async (user, statusCode, res) => {
    const token = await user.getSignedJwtToken();
    res.status(statusCode).json({ sucess: true, token });
  };


exports.storeFiles = async (req, res, next) => {
    try {
        const { cidValue , userUid , userName , userEmail , userImg ,filename} = req.body;
        const files = await Files.create({
          cidValue: cidValue ,
          userUid: userUid,
          userName: userName,
          userEmail: userEmail,
          userImg : userImg,
          filename : filename
      });
      res.status(200).json({ sucess: true, message: "File Added Successfully" });
    } catch (err) {
        next(err);
    }
};


exports.getallFilesData = async (req, res, next) => {
  try {
          const filesExist = await Files.find({userUid: req.body.userUid}).sort({ 'createdAt': -1 } );
          if (!filesExist) {
              return res.status(404).json({ sucess: false, error: "Files data unavailable" });
          }
          else {
              return res.status(200).json({ filesData: filesExist });
          }

  } catch (err) {
      next(err);
  }
};