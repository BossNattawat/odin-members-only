const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const router = require("./routes/router")
const auth = require('./routes/auth');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const mongoose = require('mongoose');

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

const PORT = process.env.PORT || 8080
const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs");

app.use(expressSession({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: { maxAge: 3600000 }
}));
app.use(express.urlencoded({ extended: false }));

app.use(auth)
app.use(router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})