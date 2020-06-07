// Require
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const path = require("path");
const assert = require("assert");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017";

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

// Get a list of all gyms
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

app.post("/gyms/", (req, res) => {
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.hours == null ||
    req.body.address == null ||
    req.body.sqft == null ||
    req.body.totalCapacity == null ||
    req.body.credentials == null
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
          credentials: req.body.credentials,
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
            const msg = `Could not insert gym ${err}`;
            console.log(msg);
            res.status(400).send(msg);
          } else {
            res.send(user.ops[0]["_id"]);
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

// Book an hour at a gym
app.post("/gyms/:id", (req, res) => {
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.phoneNumber == null ||
    req.body.hour == null
  ) {
    const msg = `Could not insert booking: At least one of the required fields is null.REQ_FIELDS[name,email,phoneNumber,hour]`;
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
          phoneNumber: req.body.phoneNumber,
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
