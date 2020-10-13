import React, { useState } from 'react'
import "./Chat.css"
import { Avatar, IconButton } from '@material-ui/core'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic'
import axios from '../axios'

function Chat({ messages }) {

    const [input, setInput] = useState("")
    const sendMessage = async e => {
        e.preventDefault()
        await axios.post('/messages/new', {
            message: input,
            name: "Demo app",
            timestamp: "just now",
            recieved: false
        })
        setInput('')
    }

    return (
        <div className="chat">
            {/* chat header */}
            <div className="chat__header">

                {/* avatar */}
                <Avatar />

                {/* header info */}
                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at ...</p>
                </div>

                {/* header right icons */}
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            {/* chat body */}
            <div className="chat__body">
                {messages.map((message) => (
                    <p
                        className={`chat__message ${message.recieved ? "chat__reciever" : ""}`}
                    >
                        <span className="chat__name">
                            {message.name}
                        </span>
                        {message.message}
                        <span className="chat__timestamp">
                            {message.timestamp}
                        </span>
                    </p>
                ))}
            </div>

            {/* chat footer */}
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        onClick={sendMessage}
                    >
                        Send a message
                    </button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
