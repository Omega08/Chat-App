const express = require("express");
const {
  sendMessage,
  AllMessages,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, AllMessages);

module.exports = router;
