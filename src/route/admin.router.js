const express = require('express');
const router = express.Router();
const { RegisterAdmin, LoginAdmin } = require("../Controller/admin.controller.js");

router.post("/register", RegisterAdmin);
router.post("/login", LoginAdmin);

module.exports = router;
