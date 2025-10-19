const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

console.log("Register is:", typeof register, "Login is:", typeof login);
router.post("/register", register);
router.post("/login", login);

module.exports = router;