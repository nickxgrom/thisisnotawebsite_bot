require('dotenv').config()

const app = require('express')(),
    PORT = process.env.PORT || 8080,
    BOT_TOKEN = `bot${process.env.BOT_TOKEN}`,
    baseUrl = 'https://api.telegram.org'

async function sendMessage(chatId, message) {
    await fetch(`${baseUrl}/${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
            chatId,
            text: message
        })
    })
}

app.post('/', async (req, res) => {
    const chatId = req.body.message.from.id
    console.log('just test log')
    console.log(chatId)
    await sendMessage(chatId, req.body?.message?.text?.trim() === 'ping' ? 'pong' : 'something went wrong')

    res.sendStatus(200)
})

app.listen(PORT, () => {
    console.log(`Bot listening ${PORT}`)
})