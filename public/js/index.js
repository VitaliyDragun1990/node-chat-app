let socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

// listen to custom events

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    // create <li> with jQuery
    let li = jQuery('<li></li>');
    // create <a> with jQuery
    let a = jQuery('<a target="_blank">My current location</a>');
    // set text for <li>
    li.text(`${message.from}: `);
    // set link location to <a>
    a.attr('href', message.url);
    // append elements to <ol>
    li.append(a);
    jQuery('#messages').append(li);

});

// listen submit event on button
jQuery('#message-form').on('submit', function (e) {
    // prevent standard form submitting behavior
    e.preventDefault();

    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val(''); // clean input field value
    });
});

// listen to 'Send Location' button click event
let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    // disabled button after send user current location to prevent spamming
    locationButton.attr('disabled', 'disabled').text('Sending location ...');

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