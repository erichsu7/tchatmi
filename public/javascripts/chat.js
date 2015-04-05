function Chat (socket) {
  this.socket = socket;
};

Chat.prototype.sendMessage = function (message) {
  this.socket.emit("message", {
    message: message
  })
};

module.exports = Chat;
