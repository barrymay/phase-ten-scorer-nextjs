const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';

/* Configure Auth0Strategy */
const auth0Strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: dev
      ? 'http://localhost:3000/callback'
      : process.env.AUTH0_CALLBACK_URL,
  },
  function (profile, done) {
    return done(null, profile);
  },
);

/* Configure Passport */
passport.use(auth0Strategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();

/* Middleware */
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

/* Session Management */
const sessionConfig = {
  secret: 'mysecret',
  cookie: {
    maxAge: 86400 * 1000, // 24 hours in milliseconds
  },
  name: 'token',
  resave: false,
  saveUninitialized: true,
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

/* Auth Routes */
app.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
  }),
  (req, res) => res.redirect('/'),
);

app.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user) => {
    if (err) return next(err);

    if (!user) return res.redirect('/');

    if (user) {
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    }
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();
  const BASE_URL = dev ? 'http://localhost:3000' : process.env.ROOT_DOMAIN;

  return res.redirect(
    `https://${process.env.AUTH0_DOMAIN}/logout?client_id=${process.env.AUTH0_CLIENT}&returnTo=${BASE_URL}`,
  );
});

app.get('/user', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: undefined });
  }
});

module.exports = app;
