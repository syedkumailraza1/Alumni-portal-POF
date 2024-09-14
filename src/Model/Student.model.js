const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  phone: { type: String, required: true },
  image: { type: String, default: "https://uxwing.com/default-profile-picture-male-icon/" },
  skills: { type: [String] },
  working: { type: Boolean, default: false },
  workingAt: { type: String, default: "Sahyog College" }, // Company name or position
  experience: { type: String }, // Years or type of experience
  description: { type: String },
  yearOfPassing: { type: Number }, // Year of graduation
  course: { type: String }, // Course of study
  batch: { type: String }, // Batch year or name
  isEmailVerified: { type: Boolean, default: false }, // Email verification status
  isAdminVerified: { type: Boolean, default: false }, // Admin verification status
  isAlumni: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
  
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
