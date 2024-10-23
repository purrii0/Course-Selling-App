const { Router } = require("express")
const bcrypt = require("bcryptjs")
const { z } = require("zod");
const userRouter = Router();
const { User, Course, Purchase } = require("../auth/db")
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_USER ;

const registrationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
    email: z.string().min(1, "Email is Required"),
    password: z.string().min(1, "Password is required")
})

userRouter.post("/signup", async (req, res) => {
    try {
        const parsedData = await registrationSchema.parse(req.body)
        const { name, email, password } = parsedData;
        const exisitingUser = await User.findOne({ email })
        if (exisitingUser) {
            res.status(400).json({
                message: "Email Already Registered"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        await User.create({
            name: name,
            email: email,
            password: hashPassword
        })
        res.status(200).json({
            message: "You are signed up as user"
        })
    } catch (error) {
        res.status(400).json({ error: error.errors || "Validation error" });
    }
});

userRouter.post("/signin", async (req, res) => {
    try {
        const parsedData = await loginSchema.parse(req.body);
        const { email, password } = parsedData;

        const user = await User.findOne({ email });
        console.log(user)
        const hashPassword = user.password;

        const isPasswordValid = await bcrypt.compare(password, hashPassword);
        if (isPasswordValid) {
            let token = await jwt.sign({
                id: user._id
            }, secretkey)
            res.status(200).json({
                token: token
            })
        } else {
            res.status(400).json({
                message: "Incorrect Password"
            })
        }
    } catch (error) {
        console.log(error);

        res.status(400).json({ error: error.errors || "Validation error" });
    }
});
userRouter.get("/all", async (req, res) => {
    const courses = await Course.find();
    console.log(courses);
    res.status(200).json({ courses })
})
userRouter.post("/purchase", auth, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.userId;
    const course = await Course.findOne({
        _id: courseId
    })
    await Purchase.create({
        userid: userId,
        courseid: courseId,
        title: course.title,
        description: course.description
    })
    res.status(200).json({
        message: "Course Succesfully Bought"
    })
});

userRouter.get("/purchases", auth, async (req, res) => {
    const userId = req.userId;
    const purchasedCourse = await Course.find({ userid: userId._id })
    if (purchasedCourse) {
        res.status(200).json({ purchasedCourse })
    } else {
        res.status(404).json({ message: "No Purchase Course" })
    }
})

async function auth(req, res, next) {
    const token = req.headers.token;
    const response = await jwt.verify(token, secretkey)
    if (response) {
        req.userId = response.id;
        return next();
    } else {
        res.status.json("Please Sign In First")
    }
}

module.exports = userRouter