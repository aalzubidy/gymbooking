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
      }
      res.send(gyms);
    });
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
  if (req.body.bookingId == null || req.body.email == null) {
    const msg = `Could not delete booking: At least one of the required fields is null.REQ_FIELDS[bookingId,email]`;
    console.log(msg);
    res.status(400).send(msg);
  } else {
    mongo
      .db("gymtracker")
      .collection("bookings")
      .insertOne(
        {
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
