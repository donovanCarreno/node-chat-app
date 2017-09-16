const socket = io()

socket.on('connect', function() {
  console.log('connected to server')
})

socket.on('disconnect', function() {
  console.log('disconnected from server')
})

socket.on('newMessage', function(msg) {
  var formattedTime = moment(msg.createdAt).format('h:mm a')
  var li = $('<li></li>')
  li.text(`${msg.from} ${formattedTime}: ${msg.text}`)

  $('#messages').append(li)
})

socket.on('newLocationMessage', function(msg) {
  var formattedTime = moment(msg.createdAt).format('h:mm a')
  var li = $('<li></li>')
  var a = $('<a target="_blank">My current location</a>')

  li.text(`${msg.from} ${formattedTime}: `)
  a.attr('href', msg.url)
  li.append(a)
  $('#messages').append(li)
})

$('#message-form').on('submit', function(e) {
  e.preventDefault()
  var msgTextBox = $('[name=message]')
  socket.emit('createMessage', {
    from: 'User',
    text: msgTextBox.val()
  }, function() {
    msgTextBox.val('')
  })
})

var locationButton = $('#send-location')

locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location')
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function() {
    locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location')
  })
})
