const socket = io()

socket.on('connect', function() {
  console.log('connected to server')

  socket.emit('createMessage', {
    from: 'greg',
    text: 'sup'
  })
})

socket.on('disconnect', function() {
  console.log('disconnected from server')
})

socket.on('newMessage', function(msg) {
  console.log('newMessage', msg)
})

// newMessage, createMessage
