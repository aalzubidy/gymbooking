const express = require("express");
const router = express.Router();
const Gym = require("../models/Gym");
const Booking = require("../models/Booking");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

//Welcome
router.get("/", function (req, res) {
  Gym.find({}).then(function (gyms) {
    res.send(gyms);
  });
});

router.post("/", (req, res) => {
  const {
    name,
    email,
    address,
    currentTime,
    sqft,
    totalCapacity,
    hours,
  } = req.body;
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.hours == null ||
    req.body.address == null ||
    req.body.sqft == null ||
    req.body.totalCapacity == null
  ) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[name,email,hours,address,sqft]`;
    res.status(400).send(msg);
  } else {
    const newGym = new Gym({
      name,
      email,
      address,
      currentTime,
      sqft,
      totalCapacity,
      hours,
    });
    Gym.findOne({ name: name }).then(function (gym) {
      if (!gym) {
        newGym.save().then(function (gym) {
          res.send(gym["_id"]);
        });
      } else {
        res.send("Gym already exist");
      }
    });
  }
});

router.get("/:id", function (req, res) {
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  if (checkForHexRegExp.test(req.params.id)) {
    Gym.findOne({ _id: ObjectId(req.params.id) }).then(function (gym) {
      if (gym) {
        res.send(gym);
      } else {
        res.send("No gym has been found");
      }
    });
  } else res.send("Invalid Id format");
});

router.post("/:id", (req, res) => {
  const { name, email, hour } = req.body;
  const gymId = req.params.id;
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.hour == null
  ) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[name,email,hour]`;
    res.status(400).send(msg);
  } else {
    const newBooking = new Booking({
      name,
      email,
      hour,
      gymId,
    });
    Booking.findOne({
      gymId: gymId,
      name: name,
      email: email,
      hour: hour,
    }).then(function (Booking) {
      if (!Booking) {
        newBooking.save().then(function (booking) {
          res.send(booking["_id"]);
        });
      } else {
        res.send("Booking already exist");
      }
    });
  }
});

router.delete("/:id", (req, res) => {
  const { name, email, hour } = req.body;
  const gymId = req.params.id;
  if (req.body.bookingId == null) {
    const msg = `Could not delete booking: REQ_FIELDS[booking]`;
    res.status(400).send(msg);
  } else {
    Booking.findOne({
      gymId: gymId,
      _id: ObjectId(req.body.bookingId),
    }).then(function (Booking) {
      console.log(Booking);
      if (Booking) {
        Booking.deleteOne({
          _id: ObjectId(req.body.bookingId),
        }).then(function (booking) {
          res.send("success");
        });
      } else {
        res.send("Nothing to delete");
      }
    });
  }
});
module.exports = router;
