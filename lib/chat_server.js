var _ = require("lodash");
var guestNumber = 1;
var nicknames = {};
var currentRooms = {};

function createChat (server) {
  var io = require("socket.io")(server);

  io.on("connection", function (socket) {
    assignGuestNickname(socket, io);
    handleRoomChanges(socket, io);
    joinRoom(socket, io, "lobby");
    emitWelcome(socket);
    emitInstructions(socket);
    handleMessages(socket, io);
    handleNicknameChanges(socket, io);
    handleInstructions(socket);
    handleErrorMessages(socket);
    handleDisconnect(socket, io);
  });
};

function emitWelcome (socket) {
  socket.emit("message", {
    text: "Welcome to tchatmi!"
  })
};

function emitInstructions (socket) {
  var instructions = "/name nickname - change your alias in the chat room \n";
  instructions += "/join room - change to another room \n\n";
  instructions += "Type /help to show this again.";

  socket.emit("message", {
    text: instructions
  })
};

function leaveRoom (socket, io) {
  io.to(currentRooms[socket.id]).emit("message", {
    text: nicknames[socket.id] + " has left the room " + currentRooms[socket.id] + "."
  })
  socket.leave(currentRooms[socket.id]);
  delete currentRooms[socket.id];
};

function joinRoom (socket, io, room) {
  currentRooms[socket.id] = room;
  socket.join(room);
  io.to(room).emit("message", {
    text: nicknames[socket.id] + " has joined the room " + room + "."
  })
  io.sockets.emit("roomList", getRoomRosters());
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
        message: "Nickname " + nickname + " is already taken."
      })
    } else {
      var prevNickname = nicknames[socket.id];
      nicknames[socket.id] = nickname;
      io.to(currentRooms[socket.id]).emit("nicknameChangeResult", {
        success: true,
        message: prevNickname + " is now " + nickname + "."
      })
      io.sockets.emit("roomList", getRoomRosters());
    }
  })
};

function handleRoomChanges (socket, io) {
  socket.on("roomChangeRequest", function (room) {
    leaveRoom(socket, io);
    joinRoom(socket, io, room);
  })
};

function handleErrorMessages (socket) {
  socket.on("errorMessage", function (data) {
    socket.emit("message", {
      text: data.text
    })
  })
};

function handleInstructions (socket) {
  socket.on("instructions", emitInstructions.bind(this, socket));
}

function handleDisconnect (socket, io) {
  socket.on("disconnect", function () {
    var prevRoom = currentRooms[socket.id];
    io.emit("message", {
      text: nicknames[socket.id] + " has left the room " + prevRoom + "."
    })
    delete nicknames[socket.id];
    delete currentRooms[socket.id];
    io.sockets.emit("roomList", getRoomRosters());
  })
};

function getRoomRosters () {
  var roomRosters = {};
  var room;
  for (var socketID in currentRooms) {
    room = currentRooms[socketID];
    if (roomRosters[room]) {
      roomRosters[room].push(nicknames[socketID]);
    } else {
      roomRosters[room] = [nicknames[socketID]];
    }
  }

  return roomRosters;
};

module.exports = createChat;
