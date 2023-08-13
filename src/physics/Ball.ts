import { type RAPIER, Rapier } from './rapier';
import { MovableObject } from './base';

export class Ball extends MovableObject {
  protected x: number;
  protected y: number;
  public readonly radius: number;
  constructor(world: RAPIER.World, x: number, y: number, radius: number) {
    const rigidBodyDesc = Rapier.RigidBodyDesc.dynamic();
    rigidBodyDesc.setTranslation(x, y);
    // rigidBodyDesc.setLinearDamping(1.0);
    // rigidBodyDesc.setAngularDamping(1.0);
    // rigidBodyDesc.setCcdEnabled(true);
    const colliderDesc = Rapier.ColliderDesc.ball(radius);
    colliderDesc.setFriction(0.5);
    colliderDesc.setRestitution(1.0);

    super(world, rigidBodyDesc, colliderDesc);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}
