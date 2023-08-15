import { type RAPIER, Rapier } from './rapier';

// TS has no static methods in interface or abstract static :sob:
export interface Serializable /*<T>*/ {
  serialize(): ArrayBufferLike;
  // static deserialize(data: ArrayBufferLike): T;
  // static decode(data: ArrayBufferLike): any[];
  // these *should* be there :^)
}

export class DisposableEntity {
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
export abstract class DisposableColliderEntity
  extends DisposableEntity
  implements Serializable
{
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
  serialize() {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, this.collider.handle, true);
    return buffer;
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
  serialize() {
    // const buffer = new ArrayBuffer(8);
    // new DataView(buffer).setFloat64(0, this.collider.handle, true);
    // return buffer;
    return new ArrayBuffer(0);
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
    console.log(this.collider.handle);
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

const { PI } = Math;
const TWO_PI = 2 * PI;
export type Vector2Like = { x: number; y: number };
export type radians = number;

export function Vector2FromPolar(r: radians, theta: number) {
  return new Rapier.Vector2(r * Math.cos(theta), r * Math.sin(theta));
}

export function angleDifference(a1: radians, a2: radians) {
  a1 = ((a1 % TWO_PI) + TWO_PI) % TWO_PI;
  a2 = ((a2 % TWO_PI) + TWO_PI) % TWO_PI;
  const da = Math.abs(a1 - a2);
  return Math.min(da, PI - da);
}

export function Vector2Subtract(a: Vector2Like, b: Vector2Like) {
  return new Rapier.Vector2(a.x - b.x, a.y - b.y);
}

export function Vector2Angle(a: Vector2Like) {
  return Math.atan2(a.y, a.x);
}

export function Vector2Magnitude(a: Vector2Like) {
  return Math.hypot(a.x, a.y);
}
