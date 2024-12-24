const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const Message = require('../models/Message');
const router = express.Router()
require('dotenv').config();

router.get("/", (req, res) => {
    let login = req.session.login
    Message.find().sort({ createAt: -1 }).exec()
    .then((doc) => {
        let role = req.session.role
        res.render("index", {login:login, message:doc, role:role})
    })
    .catch((err) => {
        console.error(err);
    })
})

router.get("/login", async (req, res) => {
    let login = req.session.login
    if(login){
        res.redirect("/")
    }
    else{
        res.render("login", {login:login})
    }
})

router.get("/register", (req, res) => {
    let login = req.session.login
    if(login){
        res.redirect("/")
    }
    else{
        res.render("register", {login:login})
    }
})

router.get("/newPost", (req, res) => {
    let login = req.session.login
    if(login){
        res.render("newMessage", {login:login})
    }
    else{
        res.redirect("/")
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/")
        console.log(`Logout`);
    })
})

router.get("/delete/:id", (req, res) => {
    let id = req.params.id
    Message.findByIdAndDelete(id, {useFindAndModify:false}).exec()
    .then(() => {
        res.redirect("/")
        console.log("Deleted message");
    })
    .catch((err) => {
        console.error(err);
        res.status(500)
    })
})

router.post("/addNewMessage", async (req, res) => {
    const {title, message} = req.body
    const author = req.session.fullname
    const username = req.session.username

    let data = new Message({
        author:author,
        username:username,
        title:title,
        message:message
    })

    Message.saveMessage(data)
    .then(() => {
        res.redirect("/")
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving message")
    })

})

router.post("/loginToAccount", async (req, res) => {
    const {username, password} = req.body
    const existingUser = await User.findOne({ username });

    const passwordMatch = existingUser.password === password

    const timeExpire = 3600000

    if(existingUser && passwordMatch){
        req.session.fullname = existingUser.fullname
        req.session.role = existingUser.role
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge = timeExpire
        res.redirect("/login")
        console.log(`${req.session.username} has login!`);
    }
    else{
        res.redirect("/register")
    }
})

router.post("/registerNewAccount", async (req, res) => {
    const {fullname, username, password, confirmPassword} = req.body

    const isMatch = password === confirmPassword
    const existingUser = await User.findOne({ username });

    if(!isMatch || existingUser){
        res.redirect("/register")
    }

    let data = new User({
        fullname:fullname,
        username:username,
        password:password,
        confirmPassword:confirmPassword
    })

    User.saveUser(data)
    .then(() => {
        res.redirect("/")
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error registering user")
    })

})

module.exports = router