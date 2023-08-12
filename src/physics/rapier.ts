/** https://github.com/viridia/demo-rapier-three/blob/main/src/physics/rapier.ts */

// import RAPIER from '@dimforge/rapier2d';

// export type Rapier = typeof import('@dimforge/rapier2d');

// export function getRapier() {
//   // eslint-disable-next-line import/no-named-as-default-member
//   return import('@dimforge/rapier2d');
// }
// export type Rapier = typeof import('@dimforge/rapier2d');
// export const Rapier = await import('@dimforge/rapier2d');

export * as RAPIER from '@dimforge/rapier2d';
const RAPIER_INSTANCE = await import('@dimforge/rapier2d');
export const Rapier: typeof RAPIER_INSTANCE = RAPIER_INSTANCE; // i dont really want like 789124 copies of the init (i think thats how it works)
