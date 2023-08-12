import { Wall, Rapier } from "./src";
import RAPIER from '@dimforge/rapier2d-compat';

const world = new Rapier.World({ x: 0, y: 0 });
let walls = [
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
console.log('walls are loaded', walls.length);