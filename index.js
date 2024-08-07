require('dotenv').config()

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 8080,
    BOT_TOKEN = `bot${process.env.BOT_TOKEN}`,
    baseUrl = 'https://api.telegram.org'

app.use(express.json())

async function sendMessage(chatId, message) {
    if (!chatId) return

    const res = await fetch(`${baseUrl}/${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })

    console.log(res)
}

app.post('/', async (req, res) => {
    const chatId = req.body?.message?.from?.id
    console.log(req.body)
    console.log(chatId)
    await sendMessage(chatId, req.body?.message?.text?.trim() === 'ping' ? 'pong' : 'something went wrong')

    res.sendStatus(200)
})

app.listen(PORT, () => {
    console.log(`Bot listening ${PORT}`)
})
