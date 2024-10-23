const express = require("express")
const userRoute = require("./routes/user")
const creatorRouter = require("./routes/courseCreator")
const adminRoute = require("./routes/admin")
const { z } = require("zod");
const mongoose = require("mongoose")
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL)

const app = express();
app.use(express.json())

app.use("/user", userRoute);
app.use("/creator", creatorRouter);
app.use("/admin", adminRoute);

app.listen(3000)