(function () {
  if (typeof tchatmi === "undefined") {
    window.tchatmi = {};
  }

  var Chat = tchatmi.Chat = function (socket) {
    this.socket = socket;
  }

  Chat.prototype.sendMessage = function (message) {
    this.socket.emit("message", {
      text: message
    })
  };
})();
