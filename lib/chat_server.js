var guestNumber = 1;
var nicknames = {};

function createChat (server) {
  var io = require("socket.io")(server);

  io.on("connection", function (socket) {
    assignGuestNickname(socket);
    socket.on("message", function (data) {
      io.emit("message", { text: data.text })
    })
  });
};

function assignGuestNickname (socket) {
  nicknames[socket.id] = "guest" + guestNumber;
  guestNumber++;
  console.log("connected as " + nicknames[socket.id]);
};

function handleNicknameChange (socket) {
  socket.on("nicknameChangeRequest", function (nickname) {
    if (nickname.toLowerCase().indexOf("guest") === 0) {
      socket.emit("nicknameChangeResult", {
        success: false,
        message: "Nickname cannot begin with 'Guest' nor 'guest'."
      })
    }
  })
};

module.exports = createChat;
