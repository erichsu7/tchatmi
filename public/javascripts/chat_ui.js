(function () {
  if (typeof tchatmi === "undefined") {
    window.tchatmi = {};
  }

  var ChatUI = tchatmi.ChatUI = function () {
    var socket = io();
    this.chat = new tchatmi.Chat(socket);

    $(document).on("ready", function (event) {
      this.messageForm = $("#message-form");
      this.messageFormInput = $("#message-form-input");
      this.chatMessagesList = $("#chat-messages-list");
      this.handleSubmit();
      this.handleMessage();
    }.bind(this))
  }

  ChatUI.prototype.handleSubmit = function () {
    this.messageForm.on("submit", function (event) {
      event.preventDefault();
      var message = this.messageFormInput.val();
      this.chat.sendMessage(message);
    }.bind(this));
  };

  ChatUI.prototype.appendMessage = function (message) {
    var $li = $("<li class=\"chat-message\">");
    $li.text(message);
    this.chatMessagesList.append($li);
  };

  ChatUI.prototype.handleMessage = function () {
    this.chat.socket.on("message", function (message) {
      this.appendMessage(message.text)
      // this.appendMessage(message.nickname + ": " + message.text);
    }.bind(this));
  };
})();
