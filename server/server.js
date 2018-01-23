const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// create variable containing path to our index.html file
const publicPath = path.join(__dirname, '../public');
// define port variable for heroku deployment
const port = process.env.PORT || 3000;

// create new express application
const app = express();
// create server using our express application
let server = http.createServer(app);
// configure the server to use socketIO
let io = socketIO(server);

// register an event listener
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    });
});

// add middleware to express - set directory with public access files in it
app.use(express.static(publicPath));

// start server, listening on port 3000
server.listen(port, () => {
   console.log(`Server is up on port ${port}`);
});



