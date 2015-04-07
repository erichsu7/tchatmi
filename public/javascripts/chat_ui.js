(function () {
  if (typeof tchatmi === "undefined") {
    window.tchatmi = {};
  }

  var ChatUI = tchatmi.ChatUI = function (chat) {
    this.chat = chat;

    $(document).on("ready", function (event) {
      this.messageForm = $("#message-form");
      this.messageFormInput = $("#message-form-input");
      this.chatMessagesList = $("#chat-messages-list");
      this.roomName = $("#room-name");
      this.roomRoster = $("#room-roster");

      this.handleSubmit();
      this.handleMessage();
      this.handleNicknameChange();
      this.handleRoomChange();
    }.bind(this))
  }

  ChatUI.prototype.handleSubmit = function () {
    this.messageForm.on("submit", function (event) {
      event.preventDefault();
      var message = this.messageFormInput.val();
      if (message[0] === "/") {
        this.chat.processCommand(message.slice(1));
      } else {
        this.chat.sendMessage(message);
      }
      this.messageFormInput.val("");
    }.bind(this));
  };

  ChatUI.prototype.appendMessage = function (message, nickname) {
    var $li = $("<li class=\"list-group-item\">");
    if (nickname.length > 0) { nickname = nickname + " " };
    $li.text(nickname + message);
    this.chatMessagesList.append($li);
  };

  ChatUI.prototype.appendNickname = function (nickname) {
    var $li = $("<li class=\"room-roster-item\">");
    $li.text(nickname);
    this.roomRoster.append($li);
  }

  ChatUI.prototype.handleMessage = function () {
    this.chat.socket.on("message", function (message) {
      var nickname = message.nickname || "";
      this.appendMessage(message.text, nickname);
    }.bind(this));
  };

  ChatUI.prototype.handleNicknameChange = function () {
    this.chat.socket.on("nicknameChangeResult", function (result) {
      this.appendMessage(result.message);
    }.bind(this));
  };

  ChatUI.prototype.handleRoomChange = function () {
    this.chat.socket.on("roomList", function (roomRosters) {
      this.roomName.text(this.chat.room);
      this.roomRoster.text("");
      roomRosters[this.chat.room].forEach(function (nickname) {
        this.appendNickname(nickname);
      }.bind(this))
    }.bind(this))
  }
})();
