// Require
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const path = require('path');

// Import routes
const adminRoutes = require('./routes/admin');

// App Settings
const port = 3001;
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(expressSanitizer());

// Index Route
app.get('/', (req, res) => {
  res.redirect('http://gymbooking.com');
});

// Admin Routes
app.use(adminRoutes);


// All other routes
app.get('*', function (req, res) {
  res.render('notFound');
});

app.post('*', function (req, res) {
  res.render('notFound');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
