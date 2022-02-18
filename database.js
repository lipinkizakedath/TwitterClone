const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(
        'mongodb+srv://twitterclone:WPgoJFtwOKwFkFcf@cluster0.8jg1a.mongodb.net/twitterClone?retryWrites=true&w=majority'
      )
      .then(res =>
        console.log(
          'Database connected succesfully!, Listening on port ',
          res.connections[0].port.toString()
        )
      )
      .catch(err => console.log(err));
  }
}

module.exports = new Database();
