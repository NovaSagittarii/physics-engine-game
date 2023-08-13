import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { EVENTS } from '../Events';
import { Rapier } from '../physics';

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

let world = new Rapier.World({ x: 0, y: 0 });

const socket = io();
socket.on('connect', () => {
  console.log(performance.now() - lastSent, 'time to open');
  lastSent = performance.now();
});
let t = 0;
socket.on(EVENTS.LOAD, (data: ArrayBuffer) => {
  const newWorld = Rapier.World.restoreSnapshot(new Uint8Array(data));
  if (newWorld) world = newWorld;
  console.log(t);
  t = 0;
});

export default function ReactApp() {
  const [state, setState] = useState([] as [number, number][]);

  useEffect(() => {
    setInterval(() => {
      world.step();
      const newState = [] as [number, number][];
      world.colliders.forEach((body) => {
        const { x, y } = body.translation();
        newState.push([x, y]);
      });
      setState(newState);
      t++;
    }, 50);
  }, []);

  // this is HOT GARBAGE but i reallly just wanted to verify that ANY form of knowing the server and physics worked
  return (
    <>
      <h1 onClick={() => socket.emit(EVENTS.MOVE)}>Hello, world</h1>
      <div style={{ overflow: 'none', transform: 'scale(1)' }}>
        {state.map(([x, y], index) => (
          <div
            style={{
              position: 'absolute',
              transform: `translate(${200 + x * 10}px, ${200 + y * 10}px)`,
            }}
            key={index}
          >
            A
          </div>
        ))}
      </div>
    </>
  );
}
