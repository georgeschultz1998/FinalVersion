const express = require('express');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const csv = require('csv-parser');
const Papa = require('papaparse');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

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



// Initialize passport
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




module.exports = {
  updateDatabase,
};








