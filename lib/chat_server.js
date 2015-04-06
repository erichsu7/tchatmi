var _ = require("lodash");
var guestNumber = 1;
var nicknames = {};
var currentRooms = {};

function createChat (server) {
  var io = require("socket.io")(server);

  io.on("connection", function (socket) {
    assignGuestNickname(socket, io);
    joinRoom(socket, io, "lobby");
    handleMessages(socket, io);
    handleNicknameChanges(socket, io);
    handleErrorMessages(socket);
    handleDisconnect(socket, io);
  });
};

function joinRoom (socket, io, room) {
  currentRooms[socket.id] = room;
  socket.join(room);
  io.to(room).emit("message", {
    text: nicknames[socket.id] + " has joined the room."
  })
};

function assignGuestNickname (socket, io) {
  nicknames[socket.id] = "guest" + guestNumber;
  guestNumber++;
};

function handleMessages (socket, io) {
  socket.on("message", function (data) {
    io.to(currentRooms[socket.id]).emit("message", {
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
      io.to(currentRooms[socket.id]).emit("nicknameChangeResult", {
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
