// try to connect to the server wia websocket and get a client socket back
let socket = io();

// define auto-scrolling algorithm for chat window
function scrollToBottom () {
    // Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    // Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

/*************** LISTEN TO CUSTOM EVENTS FROM SERVER *****************/

// get new message from server
socket.on('newMessage', function (message) {
    // create formatted time string with moment.js
    let formattedTime = moment(message.createdAt).format('h:mm a');
    // get html content of <script> element contained our mustache template
    let template = jQuery('#message-template').html();
    // render it with our variables using mustache
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    // append rendered template to our message list
    jQuery('#messages').append(html);

    // check whether we need to scroll down chat window a bit or not
    scrollToBottom();
});

// get new message from server containing location url
socket.on('newLocationMessage', function (message) {
    // create formatted time string with moment.js
    let formattedTime = moment(message.createdAt).format('h:mm a');
    // get html content of <script> element contained our mustache template
    let template = jQuery('#location-message-template').html();
    // render it with our variables using mustache
    let html = Mustache.render(template, {
       from: message.from,
       url: message.url,
       createdAt: formattedTime
    });

    // append rendered template to our message list
    jQuery('#messages').append(html);

    // check whether we need to scroll down chat window a bit or not
    scrollToBottom();
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