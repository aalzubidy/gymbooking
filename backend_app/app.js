const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
var path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
app.use(bodyParser.json());
//DB Config
const db = require("./config/keys").MongoURI;
//Passport Config
require("./config/passport")(passport);
//Connet To Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: true }));

//Express Session
app.use(
  session({
    secret: "very secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport

app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use("/gyms", require("./routes/gyms.js"));
app.use("/admin", require("./routes/admin.js"));

app.listen(PORT, console.log("Server started on port " + PORT));
