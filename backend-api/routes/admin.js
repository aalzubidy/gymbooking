// Require
const express = require('express');
// const fs = require('fs-extra');
// const config = fs.readJSONSync('./config.json');
// const {
//   MongoClient,
// } = require('mongodb');

// Initialize router
const router = express.Router();

// Connect to Mongo
// let mongo = '';
// async function mongoConnect() {
//   mongo = await MongoClient.connect(config.dbProps.dbUri, {
//     useNewUrlParser: true,
//   });
// }
// mongoConnect();

// Test route
router.get('/admin/test', (req, res) => {
  res.send('hello from test');
});

// router.get('/programs/list', (req, res) => {
//   mongo.db('uniadmin').collection('programs').find({}).toArray((err, results) => {
//     if (err) {
//       const msg = `Could not find programs ${err}`;
//       console.log(msg);
//       res.status(400).send(msg);
//     }
//     res.send(results);
//   });
// });

// router.get('/programs/:id', (req, res) => {
//   mongo.db('uniadmin').collection('programs').findOne({
//     'programId': parseInt(req.params.id, 10),
//   }, (err, results) => {
//     if (err) {
//       const msg = `Could not run query to find program ${err}`;
//       console.log(msg);
//       res.status(400).send(msg);
//     }
//     if (results) {
//       res.send(results);
//     } else {
//       res.status(400).send('Program is not found');
//     }
//   });
// });

module.exports = router;
