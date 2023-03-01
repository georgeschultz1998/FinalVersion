const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Initialize passport
app.use(passport.initialize());

// Configure passport to use Local Strategy for authentication
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

// Route for user sign up
app.post('/signup', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).send(info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

// Route for user sign in
app.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).send(info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});
