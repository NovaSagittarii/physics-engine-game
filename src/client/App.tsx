import React from 'react';

let lastSent = performance.now();

// const socket = new WebSocket('ws://localhost:3000/socket.io/?EIO=4&transport=websocket');
// // Connection opened
// socket.addEventListener('message', (event) => {
//   console.log(event.data);
//   console.log(performance.now() - lastSent, 'time to receive');
// });
// socket.addEventListener('open', (event) => {
//   console.log(performance.now() - lastSent, 'time to open');
//   lastSent = performance.now();
//   socket.send('Hello Server!');
// });

import { io } from 'socket.io-client';
const socket = io();
socket.on('connect', () => {
  console.log(performance.now() - lastSent, 'time to open');
  lastSent = performance.now();
});

export default function ReactApp() {
  return <h1 onClick={() => socket.send('clicked!')}>Hello, world</h1>;
}