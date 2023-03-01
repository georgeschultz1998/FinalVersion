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


function registerUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return false;
  }

  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
  ];

  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: 'us-west-2_cwx6X3fBu',
    ClientId: '2560pmrpa95k7h0opsijakkia1',
  });

  userPool.signUp(email, password, attributeList, null, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return false;
    } else {
      const cognitoUser = result.user;
      const authenticationData = {
        Username: email,
        Password: password,
      };
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
      );
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          // Here, you can redirect the user to a new page or update the UI to show the user has signed in
          alert('User successfully registered and signed in');
          return true;
        },
        onFailure: function (err) {
          alert(err.message || JSON.stringify(err));
          return false;
        },
      });
    }
  });

  return false;
}

function signIn(email, password) {
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: 'us-west-2_cwx6X3fBu',
    ClientId: '2560pmrpa95k7h0opsijakkia1',
  });
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log('Access token:', result.getAccessToken().getJwtToken());
      console.log('ID token:', result.getIdToken().getJwtToken());
      console.log('Refresh token:', result.getRefreshToken().getToken());
    },
    onFailure: function (err) {
      console.error('Authentication error:', err);
    },
  });
}




