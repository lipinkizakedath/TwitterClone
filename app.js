const express = require('express');
const app = express();
const PORT = 3003;
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

// Middle ware
const middleware = require('./middleware');

const server = app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});

// Setting the view engine
app.set('view engine', 'pug');

// View rendering file location
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'top secret key$$%',
    resave: true,
    saveUninitialized: false,
  })
);

// Routes
const loginRoutes = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use('/login', loginRoutes);
app.use('/register', registerRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
  };
  res.status(200).render('home', payload);
});
