const genratemessage = (username, text) => {
    return {
        username,
        text: text,
        createdAt: new Date().getTime()
    }
}
const genrateLocation = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    genratemessage,
    genrateLocation
}