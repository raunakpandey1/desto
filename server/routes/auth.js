const express = require('express');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const router = express.Router();
const {signin, signup ,storeFiles, getallFilesData} = require('../controllers/auth')

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/upload").post(storeFiles);
router.route("/fetchfiles").post(getallFilesData);

// router.route("/upload").post(upload.single('file'), storeFiles);


module.exports = router;