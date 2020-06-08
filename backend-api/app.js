// Require
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const path = require("path");
const assert = require("assert");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017";
const http = require("http");

// App Settings
const port = 3001;
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(expressSanitizer());

// Import routes
const adminRoutes = require("./routes/admin");

// Connect to Mongo
let mongo = "";
async function mongoConnect() {
  mongo = await MongoClient.connect(url, {
    useNewUrlParser: true,
  });
}
mongoConnect();

app.post("/login/", (req, res) => {
  if (req.body.username == null || req.body.password == null) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[username,password]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    const now = Date.now();
    mongo
      .db("gymtracker")
      .collection("users")
      .findOne(
        {
          username: req.body.username,
          password: req.body.password,
        },
        function (err, user) {
          if (err) {
            const msg = `Could not login ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          } else {
            if (user) {
              res.send(user.roles[0]);
            } else {
              res.send("User NOT Found");
            }
          }
        }
      );
  }
});

app.post("/users/", (req, res) => {
  if (
    req.body.username == null ||
    req.body.password == null ||
    req.body.roles == null
  ) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[username,password]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    const now = Date.now();
    mongo
      .db("gymtracker")
      .collection("users")
      .insertOne(
        {
          username: req.body.username,
          password: req.body.password,
          roles: req.body.roles,
        },
        function (err, user) {
          if (err) {
            const msg = `Could not insert user ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          } else {
            res.send(user.ops[0]["_id"]);
          }
        }
      );
  }
});
app.post("/admin/:gymId/:hour", (req, res) => {
  if (req.body.current == null || req.body.total == null) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[current,total]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    const now = Date.now();
    const hour = req.params.hour;
    mongo
      .db("gymtracker")
      .collection("gyms")
      .update(
        {
          _id: ObjectId(req.params.gymId),
        },
        {
          $set: {
            ["hours." + hour]: req.body,
          },
        },
        function (err, gym) {
          if (err) {
            const msg = `Could not update gym ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          } else {
            console.log(gym);
            if (gym.result.n) {
              res.send("success");
            } else {
              res.send("update failed");
            }
          }
        }
      );
  }
});
app.post("/admin/:gymId/", (req, res) => {
  if (
    req.body.username == null ||
    req.body.password == null ||
    req.body.newTotal == null
  ) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[username,password,newTotal]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    const now = Date.now();
    const newTotal = req.body.newTotal;
    mongo
      .db("gymtracker")
      .collection("gyms")
      .update(
        {
          _id: ObjectId(req.params.gymId),
        },
        {
          $set: {
            ["hours.00.total"]: req.body.newTotal,
            ["hours.01.total"]: req.body.newTotal,
            ["hours.02.total"]: req.body.newTotal,
            ["hours.03.total"]: req.body.newTotal,
            ["hours.04.total"]: req.body.newTotal,
            ["hours.05.total"]: req.body.newTotal,
            ["hours.06.total"]: req.body.newTotal,
            ["hours.07.total"]: req.body.newTotal,
            ["hours.08total"]: req.body.newTotal,
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
          },
        },
        function (err, gym) {
          if (err) {
            const msg = `Could not update gym ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          } else {
            if (gym.result.n) {
              res.send("success");
            } else {
              res.send("update failed");
            }
          }
        }
      );
  }
});
app.get("/gyms", (req, res) => {
  const now = Date.now();
  console.log(now);
  mongo
    .db("gymtracker")
    .collection("gyms")
    .find({})
    .toArray((err, gyms) => {
      if (err) {
        const msg = `Could not find gyms ${err}`;
        console.log(msg);
        res.status(400).send(msg);
      } else {
        res.send(gyms);
      }
    });
});

app.get("/admin/:gymId", (req, res) => {
  const now = Date.now();
  console.log(now);
  mongo
    .db("gymtracker")
    .collection("bookings")
    .find({ gymId: req.params.gymId })
    .toArray((err, bookings) => {
      if (err) {
        const msg = `Could not find bookings ${err}`;
        console.log(msg);
        res.status(400).send(msg);
      } else {
        res.send(bookings);
      }
    });
});

app.post("/gyms/", (req, res) => {
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.hours == null ||
    req.body.address == null ||
    req.body.sqft == null ||
    req.body.totalCapacity == null
  ) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[name,email,hours,address,sqft]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    const now = Date.now();
    mongo
      .db("gymtracker")
      .collection("gyms")
      .insertOne(
        {
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          currentTime: now,
          sqft: req.body.sqft,
          totalCapacity: req.body.totalCapacity,
          hours: req.body.hours,
        },
        function (err, gym) {
          if (err) {
            const msg = `Could not insert gym ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          } else {
            res.send(gym.ops[0]);
          }
        }
      );
  }
});

app.get("/gyms/:id", (req, res) => {
  console.log(req.params.id);
  const now = Date.now();
  console.log(now);
  mongo
    .db("gymtracker")
    .collection("gyms")
    .findOne({ _id: ObjectId(req.params.id) }, function (err, gym) {
      if (err) {
        const msg = `Could not find gym ${err}`;
        console.log(msg);
        res.status(400).send(msg);
      }
      res.send(gym);
    });
});

app.post("/gyms/:id", (req, res) => {
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.hour == null
  ) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[name,email,hour]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    const now = Date.now();
    console.log(now);
    mongo
      .db("gymtracker")
      .collection("bookings")
      .insertOne(
        {
          gymId: req.params.id,
          name: req.body.name,
          email: req.body.email,
          hour: req.body.hour,
          currentTime: now,
        },
        function (err, booking) {
          if (err) {
            const msg = `Could not insert booking ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          }
          console.log(booking);
          res.send(booking.ops[0]._id);
        }
      );
  }
});

app.delete("/gyms/:id", (req, res) => {
  if (req.body.bookingId == null) {
    const msg = `Could not delete booking: REQ_FIELDS[bookingId]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    console.log("gymID: " + req.params.id);
    console.log("bookingID: " + req.body.bookingId);
    mongo
      .db("gymtracker")
      .collection("bookings")
      .remove(
        { gymId: req.params.id, _id: ObjectId(req.body.bookingId) },
        function (err, booking) {
          if (err) {
            const msg = `Could not find booking ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          } else {
            // console.log(booking);
            // console.log(booking.n);
            if (booking.result.n) {
              res.send("success");
            } else {
              res.send(booking);
            }
          }
        }
      );
  }
});

// Admin Routes
app.use(adminRoutes);
// All other routes
app.get("*", function (req, res) {
  res.render("notFound");
});

app.post("*", function (req, res) {
  res.render("notFound");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
