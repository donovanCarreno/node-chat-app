const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage } = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('createMessage', (msg) => {
    io.emit('newMessage', generateMessage(msg.from, msg.text))
    // socket.broadcast.emit('newMessage', {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // })
  })

  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})

server.listen(PORT, () => console.log(`listening on port ${PORT}`))
