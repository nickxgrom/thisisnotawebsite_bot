require('dotenv').config()

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 8080,
    BOT_TOKEN = `bot${process.env.BOT_TOKEN}`,
    baseUrl = 'https://api.telegram.org',
    SCHEDULE_INTERVAL = +process.env.SCHEDULE_INTERVAL || 60000

const activeChats = []

app.use(express.json())

async function sendMessage(chatId, message) {
    if (!chatId) return

    await fetch(`${baseUrl}/${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
}

async function getWellIsIt() {
    const res = await fetch('https://files.thisisnotawebsitedotcom.com/is-it-time-yet/well-is-it.txt')

    return await res.text() !== 'NO'
}

function setScheduler() {
    setInterval(async () => {
        if (activeChats.length > 0) {
            const wellIsIt = await getWellIsIt()

            activeChats.forEach((chat) => {
                sendMessage(chat, wellIsIt ? 'something changed. visit https://www.thisisnotawebsitedotcom.com/ password: T.J.Eckleburg' : 'it\'s still not')
            })
        }
    }, SCHEDULE_INTERVAL)
}

app.get('/',  async (req, res) => {
    await getWellIsIt()

    res.sendStatus(200)
} )


app.post('/', async (req, res) => {
    const chatId = req.body?.message?.from?.id

    if (req.body?.message?.text?.trim() === 'well is it?') {
        if (!activeChats.includes(chatId)) {
            activeChats.push(chatId)
            console.log(`new chatId was added: ${chatId}`)
            await sendMessage(chatId, `you have subscribed to updates`)
        }

        await sendMessage(chatId, `i will notice you status in next hour`)
    } else {
        await sendMessage(chatId, 'i dunno what you mean')
    }

    res.sendStatus(200)
})

app.listen(PORT, () => {
    console.log(`Bot listening ${PORT}`)
    setScheduler()
})
