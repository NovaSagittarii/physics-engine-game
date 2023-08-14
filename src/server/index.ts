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

import { Rapier, Wall, MovableBall } from '../physics';
import { EVENTS } from '../Events';
const world = new Rapier.World({ x: 0, y: 0 });
const _walls = [
  // {x: 0, y: -5, w: 20, h: 10}, // inner container
  // {x: -10, y: 5, w: 1, h: 10},
  // {x: 10, y: 5, w: 1, h: 10},

  { x: 0, y: -5, w: 100, h: 1 }, // outer container
  { x: -20, y: 10, w: 1, h: 50 },
  { x: 20, y: 10, w: 1, h: 50 },
  { x: 0, y: 35, w: 100, h: 1 }, // lid
].map((a) => {
  const { x, y, w, h } = a;
  return new Wall(world, x, y, w, h);
});
const balls: Map<string, MovableBall> = new Map();

io.on('connection', (socket) => {
  console.log(socket.id, 'connect');

  {
    const ball = new MovableBall(world, Math.random() * 10, Math.random() * 10, 1);
    balls.set(socket.id, ball);
  }
  io.emit(EVENTS.LOAD, world.takeSnapshot());
  // socket.emit(EVENTS.LOAD, world.takeSnapshot());
  // io.emit(EVENTS.JOIN, {
  //   id: socket.id,
  // });
  socket.on(EVENTS.MOVE, () => {
    // io.emit(EVENTS.MOVE, { });
    balls.get(socket.id).bump();
    console.log(socket.id, 'bump');
    io.emit(EVENTS.LOAD, world.takeSnapshot());
  });
  socket.on('disconnect', (reason: string) => {
    console.log(socket.id, 'disconnect', reason);
    // io.emit(EVENTS.LEAVE, socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

let t = 0;
function gameLoop() {
  t++;
  // const startTime = performance.now();

  for (const [_id, ball] of balls) ball.step();
  world.step();

  if (t % 100 == 0) io.emit(EVENTS.LOAD, world.takeSnapshot());

  // const endTime = performance.now();
  // console.log((endTime - startTime));
  // setTimeout(gameLoop, 25-(endTime - startTime));
}
gameLoop();
setInterval(gameLoop, 25);
