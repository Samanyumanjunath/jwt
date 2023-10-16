const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const session = require('express-session');
const app = express();
const passport=require('passport');
const localStratergy=require('passport-local');
const user= require('./models/User');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// middleware

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://sam:1234@cluster0.6wq7sr3.mongodb.net/node-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(7000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
app.get('/user-data',csrfProtection, (req, res ) => {
  if (req.session.user) {
    const userData = req.session.user;
    res.status(200).json({ userData });
    
  } else {
    res.status(401).json({ message: 'UNAUTHORISED' });
  }
});
app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  res.status(403);
  res.send("UNAUTHORISED");
});

