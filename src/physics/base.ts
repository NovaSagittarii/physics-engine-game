import RAPIER from '@dimforge/rapier2d-compat';
import { Rapier } from './rapier';

export class Entity {}
export class ImmovableObject {
  protected collider: RAPIER.Collider;
  protected colliderDesc: RAPIER.ColliderDesc;
  constructor(world: RAPIER.World, colliderDesc: RAPIER.ColliderDesc) {
    this.colliderDesc = colliderDesc;
    this.collider = world.createCollider(this.colliderDesc);
  }
}
export class MovableObject {
  protected rigidBody: RAPIER.RigidBody;
  protected rigidBodyDesc: RAPIER.RigidBodyDesc;
  protected collider: RAPIER.Collider;
  protected colliderDesc: RAPIER.ColliderDesc;
  constructor(
    world: RAPIER.World,
    rigidBodyDesc: RAPIER.RigidBodyDesc,
    colliderDesc: RAPIER.ColliderDesc,
  ) {
    this.rigidBodyDesc = rigidBodyDesc;
    this.rigidBody = world.createRigidBody(this.rigidBodyDesc);
    this.colliderDesc = colliderDesc;
    this.collider = world.createCollider(this.colliderDesc, this.rigidBody);
  }
  getTranslation() {
    return this.rigidBody.translation();
  }
  getVelocity() {
    return this.rigidBody.linvel();
  }
  getAngularVelocity() {
    return this.rigidBody.angvel();
  }
  freeze() {
    const { x, y } = this.getVelocity();
    const J = -Math.hypot(x, y) * this.rigidBody.mass();
    const theta = Math.atan2(y, x);
    this.rigidBody.applyImpulse(Vector2FromPolar(J, theta), true);
  }
}

export function Vector2FromPolar(r: number, theta: number) {
  return new Rapier.Vector2(r * Math.cos(theta), r * Math.sin(theta));
}
