function ChatUI () {
  var socket = io();
  this.chat = new Chat(socket);
}

module.exports = ChatUI;
