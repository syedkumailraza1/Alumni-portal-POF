const express = require('express');
const router = express.Router();
const upload = require("../Middleware/multer.middleware.js")
const { RegisterUser, LoginUser, GetStudents, UpdateStudent, DeleteStudent, SearchStudent } = require("../Controller/student.controller.js");

router.post('/register', upload.single('image'), RegisterUser)
router.post("/login", LoginUser);
router.get("/students", GetStudents);
router.post("/student/:id", DeleteStudent);
router.put("/student/:id", UpdateStudent);
router.get("/student/:id", SearchStudent);

module.exports = router;
