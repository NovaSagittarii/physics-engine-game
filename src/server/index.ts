// import { fileURLToPath } from 'url';
// import path, { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// welp this is veryyy weird but i guess its fine??
// app.use('/', express.static(path.join(__dirname, '../../dist/public'))); // __dirname takes the file this is from (not where the new file is)
app.use('/', express.static('public')); // this also works (since npm run start does it from ~/dist)

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

import '../physics/test-rapier';
