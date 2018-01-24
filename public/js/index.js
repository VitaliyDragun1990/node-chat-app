let socket = io();

socket.on('connect', function ()  {
    console.log('Connected to server');

    // emit custom events

    socket.emit('createMessage', {
        from: 'bill@example.com',
        text: 'Hey, Bill here!'
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

// listen to custom events

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
});