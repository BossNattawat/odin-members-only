const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const router = require("./routes/router")
const auth = require('./routes/auth');
const MongoStore = require('connect-mongo');
require('dotenv').config();

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

app.use(router)
app.use(auth)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})