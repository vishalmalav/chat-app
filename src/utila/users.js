const users = []
const adduser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.toLowerCase()


    //validate data
    if (!username || !room) {
        return {
            error: "username and room are required"
        }
    }
    //check for existing user
    const exitingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    // validate user name
    if (exitingUser) {
        return {
            error: "username is in use"
        }
    }
    //store
    const user = {
        id, username, room
    }
    users.push(user)
    return { user }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)


}
const userInRoom = (room) => {

    return users.filter((user) => user.room === room)

}

const removeUser = (id) => {
    const index = users.find((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]

    }

}



module.exports = {
    adduser
    , getUser, userInRoom, removeUser
}