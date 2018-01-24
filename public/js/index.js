let socket = io();

socket.on('connect', function ()  {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

// listen to custom events

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
});