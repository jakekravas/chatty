/* Jake Kravas
This file sends user-inputted chat data,
such as their alias and message to server.js.
It also checks for new chats every 1 second
*/

let sendBtn = document.getElementById('send-btn');
let messageForm = document.getElementById('message-form');

// Create and save message
messageForm.addEventListener('submit', function(e) {
  e.preventDefault();

  let aliasVal = document.getElementById('alias-input').value;
  let messageVal = document.getElementById('message-input').value;

  // if both alias and message are not empty, send them to back-end
  if (aliasVal && messageVal) {
    let currentTime = new Date().getTime();
    let newMessageHTML = `<p class='chat'><strong>${aliasVal}: </strong>${messageVal}</p>`;
    let chatContent = document.getElementById('chat-content');

    // object to send to front-end
    const info = {
      time: currentTime,
      alias: aliasVal,
      message: messageVal
    }

    // let post = fetch('http://127.0.0.1:8080/createchat', {
    let post = fetch('/createchat', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: { 'Content-Type': 'application/json'}
    });

    post.then((response) => {
      return response.text();
    }).then((text) => {
      console.log(text);
      // add message content to HTML
      chatContent.innerHTML = chatContent.innerHTML + newMessageHTML;
    });

  }

});

window.onload = loadAllMessages();

// retrieve all messages in database and display them to user
function loadAllMessages() {

  
  // let url = 'http://127.0.0.1:8080/get';
  let url = '/get';
  fetch(url).then((response) => {
    return response.text();
  }).then((text) =>{

    // insert messages into HTML
    document.getElementById('chat-content').innerHTML = text;
  }).catch( (error) => {
    console.log(error);
  });
}

// look for new messages every 1 second
window.setInterval(loadAllMessages, 1000);
