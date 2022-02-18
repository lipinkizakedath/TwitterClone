const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  res.status(200).render('login');
});

router.post('/', async (req, res, next) => {
  const payload = req.body;
  if (req.body.logUsername && req.body.logPassword) {
    const user = await User.findOne({
      $or: [
        { username: req.body.logUsername },
        { password: req.body.logPassword },
      ],
    }).catch(error => {
      payload.errorMessage = error.message || 'Something went wrong!';
      res.status(422).render('login', payload);
    });
    console.log(user);
    if (user) {
      const result = await bcrypt.compare(req.body.logPassword, user.password);
      if (result) {
        req.session.user = user;
        return res.status(302).redirect('/');
      }
      payload.errorMessage = 'Invalid username or password!';
      res.status(302).render('login', payload);
    }
  }
  payload.errorMessage = 'Fill all the mandatory fields!';
  res.status(302).render('login', payload);
});

module.exports = router;
