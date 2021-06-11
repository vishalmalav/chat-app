const socket = io()

const $messageForm = document.querySelector("form")
const $messagFormInput = document.querySelector("input")
const $messageFormButton = document.querySelector("button")
const $locationbutton = document.querySelector("#geoloction")
const $message = document.querySelector("#messages")

const messageTemplates = document.querySelector("#message-template").innerHTML
const locationtemplate = document.querySelector("#geoloc").innerHTML
const sidebartemp = document.querySelector("#sidebar-template").innerHTML


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //new message elemne
    const $newMessage = $message.lastElementChild
    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newmessageHeight = $newMessage.offsetHeight + newMessageMargin
    // console.log(newMessageMargin)
    //visible  height
    const visibleHeight = $message.offsetHeight
    //height of messages contaner
    const contanerheight = $message.scrollHeight
    //how far i have scroled
    const scrollOffset = $message.scrollTop + visibleHeight
    if (contanerheight - newmessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }

}

socket.on("message", (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplates, {
        message: message.text,
        username: message.username,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML("beforeend", html)
    autoscroll()
})
$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute("disabled", "disabled")

    const message = e.target.elements.message.value


    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled")
        $messagFormInput.value = ""
        $messagFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log("message del")
    })


})


socket.on("locationmessage", (message) => {
    const html = Mustache.render(locationtemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    console.log(message)
    $message.insertAdjacentHTML("beforeend", html)
    autoscroll()

})
socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebartemp, {
        room,
        users


    })
    document.querySelector("#sidebar").innerHTML = html
})



$locationbutton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("geoloc not support")
    }


    $locationbutton.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendlocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationbutton.removeAttribute("disabled")
            console.log("loc send")
        })

    })
})

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }

})