// try to connect to the server wia websocket and get a client socket back
let socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

/*************** LISTEN TO CUSTOM EVENTS FROM SERVER *****************/

// get new message from server
socket.on('newMessage', function (message) {
    // create formatted time string with moment
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

// get new message from server containing location url
socket.on('newLocationMessage', function (message) {
    // create formatted time string with moment
    let formattedTime = moment(message.createdAt).format('h:mm a');
    // create <li> with jQuery
    let li = jQuery('<li></li>');
    // create <a> with jQuery
    let a = jQuery('<a target="_blank">My current location</a>');
    // set text for <li>
    li.text(`${message.from} ${formattedTime}: `);
    // set link location to <a>
    a.attr('href', message.url);
    // append <a> to <li> and <li> to <ol>
    li.append(a);
    jQuery('#messages').append(li);

});

/*************** LISTEN TO DOM EVENTS FROM UI ELEMENTS *****************/

// listen 'submit' event on button
jQuery('#message-form').on('submit', function (e) {
    // prevent standard form submitting behavior
    e.preventDefault();

    // get text from input field
    let messageTextbox = jQuery('[name=message]');

    // emit custom event via socket
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val(''); // clean input field value when server get the message
    });
});

// listen to 'Send location' button 'click' event
let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    // if geolocation api isn't supported by user's browser
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    // disabled button after send user current location to prevent spamming
    locationButton.attr('disabled', 'disabled').text('Sending location ...');

    // get user current location via geolocation api
    navigator.geolocation.getCurrentPosition(function (position) {
        // enable button after data was send
        locationButton.removeAttr('disabled').text('Send location');
        // emit new message containing user location data
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        // enable button even if  data wasn't send
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    })
});