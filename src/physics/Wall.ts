import { type RAPIER, Rapier } from './rapier';
import { ImmovableObject, Serializable } from './base';
import * as net from './networking';

export class Wall extends ImmovableObject implements Serializable {
  public readonly x: number;
  public readonly y: number;
  public readonly w: number;
  public readonly h: number;
  constructor(world: RAPIER.World, x: number, y: number, w: number, h: number) {
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

  serialize(){
    const [buffer, view] = net.abv(16);
    view.setFloat32(0, this.x, true);
    view.setFloat32(4, this.y, true);
    view.setFloat32(8, this.w, true);
    view.setFloat32(12, this.h, true);
    return buffer;
    // return net.append(super.serialize(), buffer);
  }
  static deserialize(world: RAPIER.World, buffer: ArrayBufferLike){
    const o = new Wall(world, ...WallDecode(buffer));
    return o;
  }
}

export function WallDecode(buffer: ArrayBufferLike){
  let view: DataView;
  const props: [number, number, number, number] = [0, 0, 0, 0];
  for(const k of [3, 2, 1, 0]){
    [buffer, view] = net.extract_back(buffer, 4); // maybe this not good to reassign?
    props[k] = view.getFloat32(0, true);
  }
  return props;
}