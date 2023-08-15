import { type RAPIER, Rapier } from './rapier';
import { MovableObject } from './base';
import * as net from './networking';

export class MovableBall extends MovableObject {
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

  serialize(){
    const [buffer, view] = net.abv(12);
    const {x, y} = this.getTranslation();
    view.setFloat32(0, x, true);
    view.setFloat32(4, y, true);
    view.setFloat32(8, this.radius, true);
    return buffer;
  }
  static deserialize(world: RAPIER.World, buffer: ArrayBufferLike){
    return new MovableBall(world, ...MovableBallDecode(buffer));
  }
  
}

export function MovableBallDecode(buffer: ArrayBufferLike){
  let view: DataView;
  const props: [number, number, number] = [0, 0, 0];
  for(const k of [2, 1, 0]){
    [buffer, view] = net.extract_back(buffer, 4); // maybe this not good to reassign?
    props[k] = view.getFloat32(0, true);
  }
  return props;
}