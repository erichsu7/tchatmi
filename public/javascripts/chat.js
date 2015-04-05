(function () {
  if (typeof tchatmi === "undefined") {
    window.tchatmi = {};
  }

  var Chat = tchatmi.Chat = function (socket) {
    this.socket = socket;
  }

  Chat.prototype.sendMessage = function (text) {
    this.socket.emit("message", {
      text: text
    })
  };

  Chat.prototype.processCommand = function (text) {
    var commands = text.split(" ");

    if (commands[0] === "nick") {
      this.socket.emit("nicknameChangeRequest", commands[1])
    } else {
      this.socket.emit("message", {
        text: text + " is not a recognized command."
      })
    }
  };
})();
