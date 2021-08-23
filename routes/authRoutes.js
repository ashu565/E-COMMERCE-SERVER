const express = require("express");
const authController = require("../Controllers/authController");
const multer = require("../utils/multer");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post(
  "/update-profile-picture",
  authController.protect,
  multer.single("image"),
  authController.updateProfilePhoto
);
router.post("/forgotPassword", authController.forgotPassword);
router.get("/getUser", authController.protect, authController.getuser);
router.post("/resetPassword/:id", authController.resetPassword);

module.exports = router;
