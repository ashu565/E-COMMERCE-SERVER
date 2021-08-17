const express = require("express");
const authController = require("../Controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.get("/getUser", authController.protect, authController.getuser);
router.post("/resetPassword/:id", authController.resetPassword);

module.exports = router;
