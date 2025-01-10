const express = require('express');
const Message = require('../models/Message');
const router = express.Router()
require('dotenv').config();

router.get("/", (req, res) => {
    let login = req.session.login
    Message.find().sort({ createAt: -1 }).exec()
    .then((doc) => {
        let role = "User"
        if(login){
            role = req.session.user.role
        }
        res.render("index", {login:login, message:doc, role:role})
    })
    .catch((err) => {
        console.error(err);
    })
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
    const author = req.session.user.fullname
    const username = req.session.user.username

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


router.get("/:page", (req, res) => {
    let login = req.session.login
    let pageName = req.params.page
    res.render("404", {pageName:pageName, login:login})
})

module.exports = router