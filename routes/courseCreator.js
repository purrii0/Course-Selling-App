const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const creatorRouter = Router();
const { Creator, Course } = require("../auth/db");
const jwt = require("jsonwebtoken");
const secretkey = "texty123";

const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().min(1, "Email is Required"),
  password: z.string().min(1, "Password is required"),
});

creatorRouter.post("/signup", async (req, res) => {
  try {
    const parsedData = registrationSchema.parse(req.body);
    const { name, email, password } = parsedData;
    const exisitingUser = await Creator.findOne({ email });
    if (exisitingUser) {
      res.status(400).json({
        message: "Email Already Registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await Creator.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.status(200).json({
      message: "You are signed up as a creator",
    });
  } catch (error) {
    res.status(400).json({ error: error.errors || "Validation error" });
  }
});

creatorRouter.post("/signin", async (req, res) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;

    const user = await Creator.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      let token = jwt.sign(
        {
          id: user._id,
        },
        secretkey
      );
      return res.status(200).json({ token });
    } else {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.errors || "Validation error" });
  }
});

creatorRouter.post("/create", auth, async (req, res) => {
  try {
    const creatorId = req.userId;
    const creator = await Creator.findOne({ _id: creatorId });
    const { title, description, price } = req.body;
    console.log(req.body);
    await Course.create({
      title,
      description,
      creator: creator.name,
      price,
    });
    res.status(200).json({
      message: "Course Sucessfully created",
    });
  } catch (error) {
    res.status(400).json({ error: error.errors || "Validation error" });
  }
});

async function auth(req, res, next) {
  const token = req.headers.token;
  const response = await jwt.verify(token, secretkey);
  if (response) {
    req.userId = response.id;
    return next();
  } else {
    res.status.json("Please Sign In First");
  }
}

module.exports = creatorRouter;
