const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const router = require("./routes/router")
require('dotenv').config();

const PORT = process.env.PORT || 8080
const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs");

app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(express.urlencoded({ extended: false }));

app.use(router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})