(function () {
  if (typeof tchatmi === "undefined") {
    window.tchatmi = {};
  }

  var Chat = tchatmi.Chat = function (socket) {
    this.socket = socket;
    this.room = "lobby";
  }

  Chat.prototype.sendMessage = function (text) {
    this.socket.emit("message", {
      text: text
    })
  };

  Chat.prototype.processCommand = function (text) {
    var commands = text.split(" ");

    if (commands[0] === "name") {
      if (commands[1]) {
        this.socket.emit("nicknameChangeRequest", commands[1])
      } else {
        this.socket.emit("errorMessage", {
          text: "/nick requires a nickname, i.e. /nick i<3kittens."
        })
      }
    } else if (commands[0] === "join") {
      if (commands[1]) {
        this.room = commands[1];
        this.socket.emit("roomChangeRequest", commands[1])
      } else {
        this.socket.emit("errorMessage", {
          text: "/join requires a room name, i.e. /join kittenluvvers."
        })
      }
    } else if (commands[0] === "help") {
      this.socket.emit("instructions");
    } else {
      this.socket.emit("errorMessage", {
        text: "/" + text + " is not a recognized command."
      })
    }
  };
})();
