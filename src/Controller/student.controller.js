const  Student = require("../Model/Student.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") // Ensure jwt is imported
const { uploadOnCloudinary } = require('../Utility/claudinary.js'); // Ensure the path matches your project structure

const multer = require('multer');

// Set up multer storage (in memory for now)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict', // Added for cookie security
};

const generateTokens = async (studentId) => {
    try {
        const user = await Student.findById(studentId);
        const accessToken = jwt.sign({ id: studentId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: studentId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error While Generating Tokens: ", error);
        throw new Error("Token Generation Failed"); // Explicitly throw an error to catch it later
    }
};


const RegisterUser = async (req, res) => {
    try {
        // Extract text data and file data
        const { name, email, password, phone, skills, working, workingAt, experience, description, yearOfPassing, course, batch } = req.body;
        console.log(req.body); // This will now be filled when form-data is used

        if (!name) return res.status(400).json({ error: "FullName is Required" });
        if (!email) return res.status(400).json({ error: "Email is Required" });
        if (!password) return res.status(400).json({ error: "Password is Required" });
        if (!phone) return res.status(400).json({ error: "Phone number is Required" });
        if (!skills) return res.status(400).json({ error: "Skills are Required" });
        if (!experience) return res.status(400).json({ error: "Experience is Required" });
        if (!yearOfPassing) return res.status(400).json({ error: "Year of Pass is Required" });
        if (!course) return res.status(400).json({ error: "Course is Required" });
        if (!batch) return res.status(400).json({ error: "Batch is Required" });

        const studentExist = await Student.findOne({ email });
        if (studentExist) return res.status(400).json({ error: "Student Already Exist" });

        // Get image from user and check
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer) {
            return res.status(400).json({ message: "image is required" });
        }

        const image = await uploadOnCloudinary(imageBuffer);
        if (!image) {
            return res.status(400).json({ message: "Failed to upload cover image" });
        }

        console.log("Image URL:", image.secure_url);

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({
            name, email, password: hashedPassword, phone, skills, working, workingAt, experience, description, yearOfPassing, course, batch, image: image.secure_url
        });
        await newStudent.save();

        return res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.log("Error while registering student: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ error: "Email is Required" });
        if (!password) return res.status(400).json({ error: "Password is Required" });

        const studentExist = await Student.findOne({ email });
        if (!studentExist) return res.status(400).json({ error: "Student Not Found" });

        const isPasswordCorrect = await bcrypt.compare(password, studentExist.password);
        if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid Password" });

        const { accessToken, refreshToken } = await generateTokens(studentExist._id);
        console.log("Tokens generated successfully!");

        const loggedStudent = await Student.findById(studentExist._id).select("-password -phone -refreshToken");
        if (!loggedStudent) return res.status(400).json({ error: "Student Not Found" });

        console.log("Student Successfully Logged In!");

        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({ message: 'Student logged in successfully', user: loggedStudent, accessToken, refreshToken });
    } catch (error) {
        console.log("Error while Login: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const GetStudents = async (req,res)=>{
 
    try {
      const allStudents = await Student.find();
      res.json(allStudents);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error:', error });
      console.log(error);
  }
  }

  const DeleteStudent = async (req,res)=>{
    try {
        //find the event
        const studentId = req.params.id
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Event not found" });
        
        //delete event
        await student.deleteOne({_id: studentId})
    
        //display success message 
       res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.log("Error during deleting event: ",error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const UpdateStudent = async (req,res)=>{
    try {
        //find the event id
        const student = req.body
        const studentId = req.params.id
        const studentExist = await Event.findById(studentId);
        if (!studentExist) return res.status(404).json({ error: "student not found"})

        //update it
        await Event.updateOne(
            {"_id": studentId},
            {$set: student}
        )

        //give success message
        res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        console.log("Error during updating student: ",error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const SearchStudent = async (req,res)=>{
    try {
        //get the event id
        const studentId = req.params.id
        
        //find the event
        const student = await Student.findById(eventId);
        if (!student) return res.status(404).json({ error: "Student not found"})

        //show event
        res.status(200).json(student);
        console.log(student);
        
    } catch (error) {
        console.log("Error during Searching Student: ",error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }
module.exports = {
    RegisterUser,
    LoginUser,
    DeleteStudent,
    UpdateStudent,
    SearchStudent,
    GetStudents
};