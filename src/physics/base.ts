import { type RAPIER, Rapier } from './rapier';

export default class DisposableEntity {
  private alive: boolean;
  private disposed: boolean;
  protected world: RAPIER.World;
  constructor(world: RAPIER.World) {
    this.world = world;
    this.alive = true;
    this.disposed = false;
  }
  step() {}
  dispose() {
    if (this.disposed) return;
    this.alive = false;
    this.disposed = true;
  }
  isAlive() {
    return this.alive;
  }
  isDisposed() {
    return this.disposed;
  }
}
export class DisposableColliderEntity extends DisposableEntity {
  private attachments: Map<number, DisposableColliderEntity>[];
  protected collider: RAPIER.Collider;
  constructor(world: RAPIER.World) {
    super(world);
    this.attachments = [];
  }
  dispose() {
    super.dispose();
    for (const map of this.attachments) map.delete(this.collider.handle);
    this.world.removeCollider(this.collider, true);
  }
  attachCollider(dictionary: Map<number, DisposableColliderEntity>) {
    dictionary.set(this.collider.handle, this);
    this.attachments.push(dictionary);
  }
}
export class ImmovableObject extends DisposableEntity {
  protected collider: RAPIER.Collider;
  protected colliderDesc: RAPIER.ColliderDesc;
  constructor(world: RAPIER.World, colliderDesc: RAPIER.ColliderDesc) {
    super(world);
    this.colliderDesc = colliderDesc;
    this.collider = world.createCollider(this.colliderDesc);
  }
}
export class MovableObject extends DisposableColliderEntity {
  protected rigidBody: RAPIER.RigidBody;
  protected rigidBodyDesc: RAPIER.RigidBodyDesc;
  // protected collider: RAPIER.Collider;
  protected colliderDesc: RAPIER.ColliderDesc;
  constructor(
    world: RAPIER.World,
    rigidBodyDesc: RAPIER.RigidBodyDesc,
    colliderDesc: RAPIER.ColliderDesc,
  ) {
    super(world);
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
  bump() {
    this.rigidBody.applyImpulse(
      Vector2FromPolar(this.rigidBody.mass() * 5, Math.random() * 2 * Math.PI),
      true,
    );
  }
}

export function Vector2FromPolar(r: number, theta: number) {
  return new Rapier.Vector2(r * Math.cos(theta), r * Math.sin(theta));
}
