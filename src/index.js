const express = require("express")
const path = require("path")
const socketio = require("socket.io")
const http = require("http")
const { genratemessage, genrateLocation } = require("./utila/message")
const { adduser, getUser, userInRoom, removeUser } = require('./utila/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.port || 3000


const publicDir = path.join(__dirname, "../public")


app.use(express.static(publicDir))


io.on("connection", (socket) => {

    socket.on("join", (options, callback) => {
        const { error, user } = adduser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("message", genratemessage("Admin", "welcome"))

        socket.broadcast.to(user.room).emit("message", genratemessage("Admin", `${user.username} has joined`))
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: userInRoom(user.room)
        })
        callback()

    })
    socket.on("sendMessage", (m, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit("message", genratemessage(user.username, m))
        callback()

    })


    socket.on("sendlocation", (coords, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit("locationmessage", genrateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })




    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {

            io.to(user.room).emit("message", genratemessage("Admin", `${user.username}has left`))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: userInRoom(user.room)
            })
        }
    })
})


server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

