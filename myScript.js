// Get references to the forms and toggle link
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleLink = document.getElementById('toggle-signup');

// Function to toggle between the login and sign up forms
function toggleForm() {
  if (signupForm.style.display === 'none') {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
  } else {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  }
}

// Add an event listener to the toggle link to toggle the forms when clicked
toggleLink.addEventListener('click', toggleForm);

// Add event listeners to the login and sign up forms to handle the submission of the forms
loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);

// Function to handle the submission of the login form
function handleLogin(event) {
  event.preventDefault();

  // Get the username and password from the form
  const username = event.target.elements.username.value;
  const password = event.target.elements.password.value;

  // Validate the username and password (e.g. check if they are not empty)
  if (!username || !password) {
    // Display an error message if the username or password is empty
    displayError('Please enter a username and password');
    return;
  }

  // Send a request to the server to log in with the provided username and password
  login(username, password);
}

// Function to handle the submission of the sign up form
function handleSignup(event) {
  event.preventDefault();

  // Get the username, password, and confirm password from the form
  const username = event.target.elements.username.value;
  const password = event.target.elements.password.value;
  const confirmPassword = event.target.elements.confirmPassword.value;

  // Validate the username, password, and confirm password (e.g. check if they are not empty, and that the password and confirm password match)
  if (!username || !password || !confirmPassword) {
    // Display an error message if any of the fields are empty
    displayError('Please enter a username, password, and confirm password');
    return;
  }

  if (password !== confirmPassword) {
    // Display an error message if the password and confirm password do not match
    displayError('The password and confirm password do not match');
    return;
  }

  // Send a request to the server to create a new account with the provided username and password
  createAccount(username, password).then((response) => {
    if (response.success) {
      // If the account was successfully created, log the user in
      login(username, password);
    } else {
      // If there was an error creating the account, display the error message
      displayError(response.error);
    }
  });
}

// Function to send a request to the server to log in with the provided username and password
function login(username, password) {
  // Send a request to the server to log in with the provided username and password
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json()).then((response) => {
    if (response.success) {
      // If the login was successful, redirect the user to the dashboard
      window.location.href = '/dashboard';
    } else {
      // If there was an error logging in, display the error message
      displayError(response.error);
    }
  });
}

function fetchUserData(username) {
  return fetch(`https://api.example.com/users/${username}`)
    .then(response => {
      if (!response.ok) {
        displayError(response.error);
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      displayError('Error fetching user data');
      throw error;
    });
}

function displayUser(username) {
  fetchUserData(username)
    .then(user => {
      const { name, email, bio } = user;
      // display user information on the page
      document.getElementById('name').textContent = name;
      document.getElementById('email').textContent = email;
      document.getElementById('bio').textContent = bio;
    })
    .catch(error => {
      console.error('Error displaying user:', error);
      displayError('Error displaying user');
    });
}



// retrieve data from storage (if available)
var data = JSON.parse(localStorage.getItem("tableData")) || [];

function addRow() {
  var id = document.getElementById("id").value;
  var apt = document.getElementById("apt").value;
  var tenant = document.getElementById("tenant").value;
  var month = document.getElementById("month").value;
  var year = document.getElementById("year").value;
  var transaction = document.getElementById("transaction").value;
  var debit = document.getElementById("debit").value;
  var credit = document.getElementById("credit").value;
  var date = document.getElementById("date").value;
  var type = document.getElementById("type").value;
  var notes = document.getElementById("notes").value;

  // create row object
  var row = {
    id: id,
    apt: apt,
    tenant: tenant,
    month: month,
    year: year,
    transaction: transaction,
    debit: debit,
    credit: credit,
    date: date,
    type: type,
    notes: notes
  };

  // add row object to data array
  data.push(row);

  // save data to storage
  localStorage.setItem("tableData", JSON.stringify(data));

  // add row to table
  var table = document.getElementById("data");
  var newRow = table.insertRow(-1);
  var rowValues = Object.values(row);
  for (var i = 0; i < rowValues.length; i++) {
    var cell = newRow.insertCell(i);
    cell.innerHTML = rowValues[i];
    // add event listener to cell for editing
    cell.addEventListener("click", function() {
      var currentCell = this;
      var originalValue = currentCell.innerHTML;
      currentCell.innerHTML = "<input type='text' value='" + originalValue + "'>";
      var input = currentCell.firstChild;
      input.focus();
      input.addEventListener("blur", function() {
        currentCell.innerHTML = input.value;
        updateData();
      });
    });
  }

  // clear input fields
  document.getElementById("id").value = "";
  document.getElementById("apt").value = "";
  document.getElementById("tenant").value = "";
  document.getElementById("month").value = "";
  document.getElementById("year").value = "";
  document.getElementById("transaction").value = "";
  document.getElementById("debit").value = "";
  document.getElementById("credit").value = "";
  document.getElementById("date").value = "";
  document.getElementById("type").value = "";
  document.getElementById("notes").value = "";
}

function populateTable(data) {
  var table = document.getElementById("myTable");

  // Loop through the data and create a new row for each object
  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(-1);

    // Add a cell for each data element
    var idCell = row.insertCell(0);
    var aptCell = row.insertCell(1);
    var tenantCell = row.insertCell(2);
    var monthCell = row.insertCell(3);
    var yearCell = row.insertCell(4);
    var transCell = row.insertCell(5);
    var debitCell = row.insertCell(6);
    var creditCell = row.insertCell(7);
    var dateCell = row.insertCell(8);
    var typeCell = row.insertCell(9);
    var notesCell = row.insertCell(10);

    // Populate the cells with the data
    idCell.innerHTML = data[i].ID;
    aptCell.innerHTML = data[i].Apt;
    tenantCell.innerHTML = data[i].Tenant;
    monthCell.innerHTML = data[i].Month;
    yearCell.innerHTML = data[i].Year;
    transCell.innerHTML = data[i].Transaction;
    debitCell.innerHTML = data[i].Debit;
    creditCell.innerHTML = data[i].Credit;
    dateCell.innerHTML = data[i].Date;
    typeCell.innerHTML = data[i].Type;
    notesCell.innerHTML = data[i].Notes;
  }
}

function zoomIn(image) {
	image.classList.toggle("zoom");
}

// Function to handle Google sign-in
function onSignIn(googleUser) {
  // Get the Google ID token
  const idToken = googleUser.getAuthResponse().id_token;

  // Send a request to the server to sign in with the Google ID token
  fetch('/googleSignIn', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json()).then((response) => {
    if (response.success) {
      // If the login was successful, redirect the user to the dashboard
      window.location.href = '/dashboard';
    } else {
      // If there was an error logging in, display the error message
      displayError(response.error);
    }
  });
}
