const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
//Login
router.get("/login", forwardAuthenticated, function (req, res) {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//Logout
router.get("/logout", function (req, res) {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});
//Register
router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then(function (user) {
      if (user) {
        errors.push({ msg: "User already Exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        bcrypt.hash(password, 10, function (err, hash) {
          newUser.password = hash;
          newUser
            .save()
            .then(function (user) {
              req.flash("success_msg", "You are now registered and can log-in");
              res.redirect("/users/login");
            })
            .catch(function (err) {
              console.log(err);
            });
        });
      }
    });
  }
});

//Dashboard
router.get("/dashboard", ensureAuthenticated, function (req, res) {
  console.log(req.user);
  res.render("dashboard", {
    user: req.user.name,
    gymID: req.user.roles[0],
  });
});

module.exports = router;
