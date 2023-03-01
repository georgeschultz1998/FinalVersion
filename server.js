const express = require('express');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const csv = require('csv-parser');
const Papa = require('papaparse');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const sessionSecret = 'your-secret-key';
const app = express();

// Add session middleware
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

var EJS  = require('ejs');

app.engine('html', EJS.renderFile);
// Set the view engine and views directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views')); // Update file path to reflect new location of EJS files
app.set('view engine', 'ejs');


// Define route for home page
app.get('/', (req, res) => {
  res.render('home');
});

// Define route for featured properties page
app.get('/featured', (req, res) => {
  res.render('featured');
});

// Define route for sign up/sign in page
app.get('/account', (req, res) => {
  res.render('account');
});

// Define route for contact page
app.get('/contact', (req, res) => {
  res.render('contact');
});

// Define route for index page (database)
app.get('/index', (req, res) => {
  res.render('index');
});

// Define route for index page (database)
app.get('/privacy', (req, res) => {
  res.render('privacy');
});

// Define route for index page (database)
app.get('/tos', (req, res) => {
  res.render('tos');
});

app.use(express.static(__dirname + '/public'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize passport
app.use(passport.initialize());

// Set up passport session middleware
app.use(passport.session());

// Define the local authentication strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    // Here, you can authenticate the user by checking if the email and password are valid
    // If the user is authenticated, call done(null, user)
    // If the user is not authenticated, call done(null, false)
  }
));

// Define serialization and deserialization functions for passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Here, you can fetch the user object from the database using the id
  // Once you have the user object, call done(null, user)
});

// Handle requests for the sign up route
app.post('/signup', (req, res) => {
  // Here, you can create a new user account using the information in req.body
  // If the user account is created successfully, redirect the user to the sign in page
  // If there was an error, send an error response to the client
});

// Handle requests for the sign in route
app.post('/signin', passport.authenticate('local'), (req, res) => {
  // If the user is authenticated, you can proceed with the request handling logic here
  // For example, you can redirect the user to a dashboard page or return a JSON response containing a JWT token
});

const filePath1 = 'database.csv';
const filePath2 = 'history.csv';

function loadData(callback) {
  const dataArray = [];
  const headers = [];

  fs.createReadStream(filePath1)
    .pipe(csv())
    .on('data', (row) => {
      dataArray.push(row);
      // Save headers
      if (headers.length === 0) {
        headers.push(...Object.keys(row));
      }
    })
    .on('end', () => {
      // Dynamically create arrays based on headers
      const dataByHeader = headers.reduce((acc, curr) => {
        acc[curr] = dataArray.map((row) => row[curr]);
        return acc;
      }, {});

      // Call the callback function with the data arrays
      callback(dataArray, dataByHeader);
    });
}

function loadHistoryData(callback) {
  const historyArray = [];
  fs.createReadStream(filePath2)
    .pipe(csv())
    .on('data', (row) => {
      historyArray.push(row);
    })
    .on('error', (err) => { // Add error handler
      console.error(err);
      callback([]);
    })
    .on('end', () => {
      callback(historyArray);
    });
}



function updateDatabase(body) {
  fs.writeFile(filePath1, body, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Database updated successfully');
    }
  });
}

let previousData = "";


function updateHistory(body) {
  var dataArray = Papa.parse(body.trim()).data;
  fs.readFile(filePath2, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const csvData = data.toString();
      var csvArray = Papa.parse(csvData.trim()).data;

      // Check if the current data array is different from the previous version
      if (!arraysEqual(dataArray, previousData)) {
        fs.appendFile(filePath2, body, (err) => {
          if (err) {
            console.error(err);
          } else {
            //console.log("Updated History:" + body);
            previousData = dataArray; // update previousData with the current data array
          }
        });
      }
    }
  });
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) {
      return false;
    }
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// Define serialization and deserialization functions for passport
// Define serialization and deserialization functions for passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Here, you can fetch the user object from the database using the id
  // Once you have the user object, call done(null, user)
});

// Handle requests for the sign up route
app.post('/signup', (req, res) => {
  // Here, you can create a new user account using the information in req.body
  // If the user account is created successfully, redirect the user to the sign in page
  // If there was an error, send an error response to the client
});

// Handle requests for the sign in route
app.post('/signin', passport.authenticate('local'), (req, res) => {
  // If the user is authenticated, you can proceed with the request handling logic here
  // For example, you can redirect the user to a dashboard page or return a JSON response containing a JWT token
});

// Handle logout request
app.get('/logout', (req, res) => {
  // Here, you can clear the session and redirect the user to the home page
});

// Handle requests for the contact form
app.post('/contact', (req, res) => {
  // Here, you can handle the contact form submission and send an email to the site owner
  // If the email is sent successfully, redirect the user to a thank you page
  // If there was an error, send an error response to the client
});

// Define route for privacy policy page
app.get('/privacy', (req, res) => {
  res.render('privacy');
});

// Define route for terms of service page
app.get('/tos', (req, res) => {
  res.render('tos');
});

// Define route for index page (database)
app.get('/index', (req, res) => {
  loadData((dataArray, dataByHeader) => {
    res.render('index', { dataArray, dataByHeader });
  });
});

// Handle updates to the database
app.post('/update', (req, res) => {
  updateDatabase(req.body.body);
  updateHistory(req.body.body);
  res.status(200).send('OK');
});

// Handle retrieval of history data
app.get('/history', (req, res) => {
  loadHistoryData((historyArray) => {
    res.send(historyArray);
  });
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send("Sorry, that page doesn't exist");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
