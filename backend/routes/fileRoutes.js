const express = require("express");
const { getFileContent } = require("../controllers/fileController");

const router = express.Router();

router.get("/content", getFileContent);

module.exports = router;
