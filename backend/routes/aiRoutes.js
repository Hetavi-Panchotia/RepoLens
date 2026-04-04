const express = require("express");
const { handleAIChat } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", handleAIChat);

module.exports = router;
