const express = require("express");
const router = express.Router();
const Gym = require("../models/Gym");
const Booking = require("../models/Booking");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/:id", function (req, res) {
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  if (checkForHexRegExp.test(req.params.id)) {
    Booking.find({ gymId: req.params.id }).then(function (bookings) {
      if (bookings.length !== 0) {
        res.send(bookings);
      } else {
        res.send("No bookings have been found");
      }
    });
  } else res.send("Invalid Id format");
});

router.post("/:id", (req, res) => {
  const { newTotal } = req.body;
  const gymId = req.params.id;
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  if (checkForHexRegExp.test(req.params.id)) {
    if (req.body.newTotal == null) {
      const msg = `Could not update Total: REQ_FIELDS[newTotal]`;
      res.status(400).send(msg);
    } else {
      Gym.findOne({ _id: gymId }).then(function (gym) {
        if (gym) {
          Gym.updateOne(
            {
              _id: ObjectId(req.params.id),
            },
            {
              ["hours.00.total"]: req.body.newTotal,
              ["hours.01.total"]: req.body.newTotal,
              ["hours.02.total"]: req.body.newTotal,
              ["hours.03.total"]: req.body.newTotal,
              ["hours.04.total"]: req.body.newTotal,
              ["hours.05.total"]: req.body.newTotal,
              ["hours.06.total"]: req.body.newTotal,
              ["hours.07.total"]: req.body.newTotal,
              ["hours.08.total"]: req.body.newTotal,
              ["hours.09.total"]: req.body.newTotal,
              ["hours.10.total"]: req.body.newTotal,
              ["hours.11.total"]: req.body.newTotal,
              ["hours.12.total"]: req.body.newTotal,
              ["hours.13.total"]: req.body.newTotal,
              ["hours.14.total"]: req.body.newTotal,
              ["hours.15.total"]: req.body.newTotal,
              ["hours.16.total"]: req.body.newTotal,
              ["hours.17.total"]: req.body.newTotal,
              ["hours.18.total"]: req.body.newTotal,
              ["hours.19.total"]: req.body.newTotal,
              ["hours.20.total"]: req.body.newTotal,
              ["hours.21.total"]: req.body.newTotal,
              ["hours.22.total"]: req.body.newTotal,
              ["hours.23.total"]: req.body.newTotal,
            }
          ).then(function (gym) {
            res.send("success");
          });
        } else {
          res.send("Gym does not exist");
        }
      });
    }
  } else {
    res.send("Invalid Id format");
  }
});

router.post("/:id/:hour", (req, res) => {
  const { current, total } = req.body;
  const gymId = req.params.id;
  const hour = req.params.hour;
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  if (checkForHexRegExp.test(req.params.id)) {
    if (req.body.total == null || req.body.current == null) {
      const msg = `Could not update Total: REQ_FIELDS[current,total]`;
      res.status(400).send(msg);
    } else {
      Gym.findOne({ _id: gymId }).then(function (gym) {
        if (gym) {
          Gym.updateOne(
            {
              _id: ObjectId(req.params.id),
            },
            { ["hours." + hour]: req.body }
          ).then(function (gym) {
            res.send("success");
          });
        } else {
          res.send("Gym does not exist");
        }
      });
    }
  } else {
    res.send("Invalid Id format");
  }
});
module.exports = router;
