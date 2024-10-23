const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const baseSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

const courseSchema = new Schema({
    title: String,
    description: String,
    creator: { type: String, ref: 'creators' },
    price: String,
})
const purchaseSchema = new Schema({
    userid: { type: ObjectId, ref: 'users' },
    courseid: { type: ObjectId, ref: 'courses' },
    title: String,
    description: String,
})

const User = mongoose.model("users", baseSchema)
const Creator = mongoose.model("creators", baseSchema)
const Admin = mongoose.model("admins", baseSchema)
const Course = mongoose.model("courses", courseSchema)
const Purchase = mongoose.model("purchases", purchaseSchema)

module.exports = {
    User,
    Creator,
    Admin,
    Course,
    Purchase
}