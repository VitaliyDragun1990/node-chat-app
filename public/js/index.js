// try to connect to the server wia websocket and get a client socket back
let socket = io();

socket.on('connect', function () {
    // request list of active rooms from the server
    socket.emit('getRoomList', function (roomList) {
        // if there are active rooms - show select with their names
       if (roomList.length > 0) {
           jQuery('#selectGroup').removeAttr('hidden');
           let select = jQuery('select').append(jQuery('<option></option>'));
           for (let i = 0; i < roomList.length; i++) {
               select.append(jQuery('<option></option>').attr('value', roomList[i]).text(roomList[i]));
           }
           select.on('change', function () {
              jQuery('#room').val(select.val());
           });
       }
    });
});