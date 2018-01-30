const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

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
// create users instance to store all users connected to the server
let users = new Users();

// register an event listener for incoming 'connection' event from joined client
io.on('connection', (socket) => {
    console.log('New user connected');

    /*************** EMIT CUSTOM EVENTS TO CLIENTS *****************/


    /*************** LISTEN TO CUSTOM EVENTS FROM CLIENT *****************/

    socket.on('getRoomList', (callback) => {
       callback(users.getRoomList());
    });

    socket.on('join', (params, callback) => {
        // check if there are all required parameters
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }
        let name = params.name.trim();
        // check if username is unique
        if (users.getUsernameList().indexOf(name) !== -1) {
            return callback(`Sorry, name ${name} is already taken. Please choose another one.`)
        }

        // make sure that room name is case insensitive
        let room = params.room.trim().toLowerCase();

        // joins a room which name is provided in the params.room property
        socket.join(room);
        // remove user from any potential previous room
        users.removeUser(socket.id);
        // add new joined user to the users collection
        users.addUser(socket.id, name, room);

        // living specific room
        // socket.leave(params['room']);

        // emit message to all users in a specific room
        io.to(room).emit('updateUserList', users.getUserList(room));
        // send message to current user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        // send message to all connected users in a specific room, except current user
        socket.broadcast.to(room)
            .emit('newMessage', generateMessage('Admin', `${name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            // emit event to all connected users
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            // generate new message with location url
            io.to(user.room)
                .emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    /*--------------------------------------------------------------*/
    socket.on('disconnect', () => {
        // remove user from user collections on user's disconnect
        let user = users.removeUser(socket.id);

        if (user) {
            // send new user list without disconnected user
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            // notify other users in the same room that user left
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

// add middleware to express - set directory with public access files in it
app.use(express.static(publicPath));

// start server, listening on port 3000
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});



