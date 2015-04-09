# tchatmi

tchatmi ('chat-me') is a lightweight chat room application.

[See it live here!](http://tchatmi.erichsu.io)

## Technological Highlights

### Overview

tchatmi's chat server is built on the **Node.js** framework, and the client UI relies on **jQuery** DOM manipulation and **Socket.IO** communication.

### Server-side
Node.js' asynchronous event loop is well-suited for a chat room with multiple connected users. Using Socket.IO, the server listens for incoming events across all sockets, processes the incoming data, and emits a message back to the appropriate clients. Because the server is simply accepting messages and relaying them back out to the clients, there is no need for much overhead, making the app quick and efficient.

### Client-side
The Socket.IO client-side library establishes communication to the server by emitting events and passing data. When a user submits a message input, a "message" event is triggered along with the text data, which the server handles. After the server sends back a response, the UI is updated to reflect new messages, room changes, and new users with jQuery DOM manipulation.

### Nicknames
Sockets and their corresponding nicknames are stored in a hashmap on the server. When a user makes a name change request, this hashmap is cross-referenced to verify that the name isn't already taken.

### Rooms
The server keeps track of connected sockets and their current room. When a room roster is required, such as when a user joins/leaves a room or changes his name, this is inverted and a hashmap containing rooms and their connected sockets is returned. This hashmap is passed from the server to the client so that the room roster may be updated.
