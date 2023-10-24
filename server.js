/* Jake Kravas
This file receives data from the front end,
and adds chat aliases and messages to the database
*/

const express = require('express');
const app = express();
const port = 8080;
const bp = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Database stuff
// const MONGODB_URL = 'mongodb://localhost:27017';
// const MONGODB_URL = 'mongodb://localhost:27017/chatty';
// const MONGODB_URL = 'mongodb+srv://jake:a4d7g3dmjfvDJ4F4@cluster0.mw0iqgf.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_URL = 'mongodb://127.0.0.1:27017/chatty';

let Schema = mongoose.Schema;

let ChatSchema = new Schema({
  time: Number,
  alias: String,
  message: String
});

let Chat = mongoose.model('chat', ChatSchema );

const db = async() => {
  try {
    const con = await mongoose.connect(MONGODB_URL);
    console.log('Database Connected');
  } catch (err) {
    console.log(err)
  }
}

db()

app.use(express.static('/assets'), express.static(__dirname + '/public_html'));
app.use(bp.json());
app.use(cors());

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);

app.get('/get', async function(req, res) {
  let chats = await Chat.find({});
  let chatsHTML = '';
  
  // append data from each chat to HTML-compatible string
  for (let i = 0; i < chats.length; i++) {
    chatsHTML += `<p class='chat'><strong>${chats[i].alias}: </strong>${chats[i].message}</p>`
  }
  
  res.end(chatsHTML);
})


app.post('/createchat', async function(req, res) {
  let time = req.body.time;
  let message = req.body.message;
  let alias = req.body.alias;

  let newChat = new Chat({
    time: time,
    alias: alias,
    message: message,
  });

  try {
    await newChat.save();
    return res.send('Message saved successfully');
  } catch (err) {
    return res.status(500).send('Failed to save message');
  }

})
