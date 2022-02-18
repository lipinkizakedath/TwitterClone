const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

// Setting the view engine
app.set('view engine', 'pug');
// View rendering file location
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  res.status(200).render('register');
});

router.post('/', async (req, res, next) => {
  const firstname = req.body.firstname.trim();
  const lastname = req.body.lastname.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password;
  const passwordConf = req.body.passwordConf;
  const payload = req.body;

  if (firstname && lastname && email && username && password) {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch(error => {
      payload.errorMessage = error.message || 'Something went wrong!';
    });

    if (user == null) {
      // no user found
      const data = req.body;
      data.password = await bcrypt.hash(password, 10);

      User.create(data).then(user => {
        req.session.user = user;
        return res.redirect('/');
      });
    } else {
      // user found
      if (email == user.email) {
        payload.errorMessage = 'Email already in use!';
      } else {
        payload.errorMessage = 'Username already taken!';
      }
      res.status(200).render('register', payload);
    }
  } else {
    // payload.errorMessage = 'Make sure all madatory fields are filled!';
    // res.status(200).render('register', payload);
  }
});

module.exports = router;
