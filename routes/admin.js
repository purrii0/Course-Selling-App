const { Router } = require("express");
const jwt = require("jsonwebtoken")
const adminRoute = Router();
const bcrypt = require("bcryptjs")
const { z } = require("zod");
const { Admin, User, Creator, Course, Purchase } = require("../auth/db")
const secretkey = process.env.JWT_ADMIN;

const registrationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
    email: z.string().min(1, "Email is Required"),
    password: z.string().min(1, "Password is required")
})

adminRoute.post("/signup", async (req, res) => {
    try {
        const parsedData = await registrationSchema.parse(req.body);
        const { name, email, password } = parsedData;
        const validEmail = Admin.findOne({ email })

        if (validEmail) {
            res.status(400).json({ message: "Email Already Registered" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);
        await Admin.create({
            name,
            email,
            password: hashPassword
        })
        res.status(200).json({ message: "Admin Account Succesfully created" })
    } catch (error) {
        res.status(400).json({ error: error.errors || "Validation error" });
    }
})

adminRoute.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });
        const hashPassword = user.password;
        const isPasswordValid = await bcrypt.compare(password, hashPassword);
        if (isPasswordValid) {
            let token = await jwt.sign({
                id: user._id,
            }, secretkey)
            res.status(200).json({ token })
        }
    } catch (error) {
        res.status(400).json({ error: error.errors })
    }
})

adminRoute.get("/alluser", adminauth, async (req, res) => {
    const users = await User.find();
    if (users) {
        res.status(200).json({ users });
    } else {
        res.status(404).json({ message: "No Users Found" })
    }
})

adminRoute.get("/allcreators", adminauth, async (req, res) => {
    const creators = await Creator.find();
    if (creators) {
        res.status(200).json({ creators })
    } else {
        res.status(404).json({ message: "No creators found" })
    }
})

adminRoute.get("/allcourses", adminauth, async (req, res) => {
    const courses = await Course.find();
    if (courses) {
        res.status(200).json({ courses })
    } else {
        res.status(404).json({ message: "No course found" })
    }
})

async function adminauth(req, res, next) {
    const token = req.headers.token;
    if (token) {
        const response = await jwt.verify(token, secretkey);
        if (response) {
            req.userId = response.id;
            next();
        } else {
            res.status(404).json({ message: "You are not a admin" })
        }
    } else {
        res.status(400).json({ message: "Sign In First" })
    }
}

module.exports = adminRoute