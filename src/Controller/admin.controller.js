const  Admin = require("../Model/Admin.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") // Ensure jwt is imported

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict', // Added for cookie security
};

const generateTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = jwt.sign({ id: adminId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: adminId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error While Generating Tokens: ", error);
        throw new Error("Token Generation Failed"); // Explicitly throw an error to catch it later
    }
};

const RegisterAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);

        if (!name) return res.status(400).json({ error: "FullName is Required" });
        if (!email) return res.status(400).json({ error: "Email is Required" });
        if (!password) return res.status(400).json({ error: "Password is Required" });

        const adminExist = await Admin.findOne({ email });
        if (adminExist) return res.status(400).json({ error: "Admin Already Exist" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        return res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.log("Error while registering admin: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const LoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ error: "Email is Required" });
        if (!password) return res.status(400).json({ error: "Password is Required" });

        const adminExist = await Admin.findOne({ email });
        if (!adminExist) return res.status(400).json({ error: "Admin Not Found" });

        const isPasswordCorrect = await bcrypt.compare(password, adminExist.password);
        if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid Password" });

        const { accessToken, refreshToken } = await generateTokens(adminExist._id);
        console.log("Tokens generated successfully!");

        const loggedAdmin = await Admin.findById(adminExist._id).select("-password -refreshToken");
        if (!loggedAdmin) return res.status(400).json({ error: "Admin Not Found" });

        console.log("Admin Successfully Logged In!");

        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({ message: 'Admin logged in successfully', user: loggedAdmin, accessToken, refreshToken });
    } catch (error) {
        console.log("Error while Login: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    RegisterAdmin,
    LoginAdmin
}

