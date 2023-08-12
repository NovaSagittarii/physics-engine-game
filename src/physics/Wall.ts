import RAPIER from "@dimforge/rapier2d-compat";
import { ImmovableObject } from './base';
import { Rapier } from "./rapier";

export class Wall extends ImmovableObject {
  public readonly x: number;
  public readonly y: number;
  public readonly w: number;
  public readonly h: number;
  constructor(world: RAPIER.World, x: number, y: number, w: number, h: number) {
    console.log('aa');
    const colliderDesc = Rapier.ColliderDesc.cuboid(w / 2, h / 2);
    colliderDesc.setTranslation(x, y);
    colliderDesc.setRestitution(1);
    // colliderDesc.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL);

    super(world, colliderDesc);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}
