// importing
import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbmessages.js'
import Pusher from 'pusher'
import cors from 'cors'

// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: '1067938',
    key: '0f123b939b8704797fe2',
    secret: '9f1986231959e6fc91ad',
    cluster: 'eu',
    encrypted: true
});

// middlewire
app.use(express.json())
app.use(cors())
// DB config
const connection_url = 'mongodb+srv://admin:PcNOEp0f6yh1JQCz@cluster0.esrld.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// ?????
const db = mongoose.connection
db.once('open', () => {
    console.log("DB connected")
    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()
    changeStream.on("change", (change) => {
        console.log(change)

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument
            pusher.trigger('message', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.recieved
            })
        } else {
            console.log('error triggering pusher')
        }
    })
})

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'))
app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// listener
app.listen(port, () => console.log(`Listening on localhost:${port}`))
