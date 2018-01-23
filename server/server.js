const path = require('path');
const express = require('express');

// create variable containing path to our index.html file
const publicPath = path.join(__dirname, '../public');
// define port variable for heroku deployment
const port = process.env.PORT || 3000;

// create new express application
const app = express();

// add middleware to express - set directory with public access files in it
app.use(express.static(publicPath));

// start express application, listening on port 3000
app.listen(port, () => {
   console.log(`Server is up on port ${port}`);
});



