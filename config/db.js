const mongoose = require('mongoose');

//Map Global Promises
mongoose.Promise = global.Promise;

//Mongoose Connect.
mongoose.connect('mongodb://ralph:rc042101@ds251240.mlab.com:51240/pollingapp')
        .then(() => console.log('MongoDb Connected'))
        .catch(err => console.log(err));