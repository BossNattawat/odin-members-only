const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbURL = process.env.DB_URL

mongoose.connect(dbURL, {
    serverSelectionTimeoutMS: 30000,
})
.then(() => {
    console.log("Database connected successfully!");
})
.catch((err) => {
    console.error("Database connection error:", err);
})

const userSchema = mongoose.Schema({
    fullname: {type:String, require: true},
    username: {type:String, require: true, unique: true},
    password: {type:String, require: true},
    role: {type:String, default: "User"},
    createAt: {type: Date, default: Date.now}
})

let User = mongoose.model('User', userSchema);

module.exports = User

module.exports.saveUser = (data) => {
    const user = new User(data)
    return user.save()
    .then(() => {
        console.log("User registered successfully!")
    })
    .catch((err) => {
        console.error("Error registering user:", err);
    })
}