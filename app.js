const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

//Adding the Database Config
require('./config/db');

const app = express();

const poll = require('./routes/poll')

// Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser middleware needed to handle form submissions.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Enable Cors
app.use(cors());

app.use('/poll', poll);

const port = 3000;

//Start server
app.listen(port, () => console.log(`Server Started on port ${port}`));