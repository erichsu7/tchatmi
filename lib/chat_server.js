var _ = require("lodash");
var guestNumber = 1;
var nicknames = {};

function createChat (server) {
  var io = require("socket.io")(server);

  io.on("connection", function (socket) {
    console.log(socket);
    assignGuestNickname(socket, io);
    handleMessages(socket, io);
    handleNicknameChanges(socket, io);
    handleErrorMessages(socket);
    handleDisconnect(socket, io);
  });
};

function assignGuestNickname (socket, io) {
  nicknames[socket.id] = "guest" + guestNumber;
  guestNumber++;
  io.emit("message", {
    text: nicknames[socket.id] + " has joined the room."
  })
};

function handleMessages (socket, io) {
  socket.on("message", function (data) {
    io.emit("message", {
      nickname: nicknames[socket.id],
      text: data.text
    })
  });
}

function handleNicknameChanges (socket, io) {
  socket.on("nicknameChangeRequest", function (nickname) {
    if (nickname.toLowerCase().indexOf("guest") === 0) {
      socket.emit("nicknameChangeResult", {
        success: false,
        message: "Nickname cannot begin with 'Guest' nor 'guest'."
      })
    } else if (_.values(nicknames).indexOf(nickname) >= 0) {
      socket.emit("nicknameChangeResult", {
        success: false,
        message: "Nickname is already taken."
      })
    } else {
      var prevNickname = nicknames[socket.id];
      nicknames[socket.id] = nickname;
      io.emit("nicknameChangeResult", {
        success: true,
        message: prevNickname + " is now " + nickname + "."
      })
    }
  })
};

function handleErrorMessages (socket) {
  socket.on("errorMessage", function (data) {
    socket.emit("message", {
      text: data.text
    })
  })
};

function handleDisconnect (socket, io) {
  socket.on("disconnect", function () {
    io.emit("message", {
      text: nicknames[socket.id] + " has left the room."
    })
    delete nicknames[socket.id];
  })
};



module.exports = createChat;
