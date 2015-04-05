(function () {
  if (typeof tchatmi === "undefined") {
    window.tchatmi = {};
  }

  var ChatUI = tchatmi.ChatUI = function () {
    var socket = io();
    this.chat = new Chat(socket);
    this.messageForm = $("#messageForm");
    this.messageFormInput = $("#message-form-input");
    this.chatMessagesList = $("#chat-messages-list");
  }

  ChatUI.prototype.handleSubmit = function () {
    this.messageForm.on("submit", function (event) {
      event.preventDefault();
      var message = this.messageFormInput.val();
      this.chat.sendMessage(message);
      this.appendMessage(message);
    })
  };

  ChatUI.prototype.appendMessage = function (message) {
    var $li = $("<li class=\"chat-message\">");
    $li.text(message);
    this.chatMessagesList.append($li);
  };

})();
