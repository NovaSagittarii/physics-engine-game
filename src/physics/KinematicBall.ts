import { type RAPIER } from './rapier';
import { MovableBall, MovableBallDecode } from './MovableBall';
import {
  Serializable,
  Vector2Angle,
  Vector2FromPolar,
  Vector2Magnitude,
  Vector2Subtract,
} from './base';
import * as net from './networking';

export class KinematicBall extends MovableBall implements Serializable {
  private initialX: number;
  private initialY: number;
  private goalX: number;
  private goalY: number;
  constructor(world: RAPIER.World, x: number, y: number, radius: number) {
    super(world, x, y, radius);
    this.initialX = this.goalX = x;
    this.initialY = this.goalY = y;
  }
  goTo(x: number, y: number) {
    if (this.goalX !== x || this.goalY !== y) {
      this.initialX = this.getTranslation().x;
      this.initialY = this.getTranslation().y;
    }
    this.goalX = x;
    this.goalY = y;
  }
  step() {
    const { x, y } = this.getTranslation();
    const sourceDist = Math.hypot(x - this.initialX, y - this.initialY);
    const terminalDist = Math.hypot(x - this.goalX, y - this.goalY);
    const velocity = Math.max(0.1, Math.min(1, sourceDist, terminalDist)) * 10;
    const theta = Math.atan2(this.goalY - y, this.goalX - x);
    // this.rigidBody.setLinvel(Vector2FromPolar(velocity, theta));
    const goalLinvel = Vector2FromPolar(velocity, theta);
    const maxImpulse = this.rigidBody.mass() * 1;
    const currentLinvel = this.rigidBody.linvel();
    const reqLinvel = Vector2Subtract(goalLinvel, currentLinvel);
    const reqLinvelTheta = Vector2Angle(reqLinvel);
    const reqLinvelMagnitude = Vector2Magnitude(reqLinvel);
    this.rigidBody.applyImpulse(
      Vector2FromPolar(
        Math.min(maxImpulse, reqLinvelMagnitude),
        reqLinvelTheta,
      ),
      true,
    );
  }
  
  serialize(){
    const [buffer, view] = net.abv(16);
    view.setFloat32(0, this.initialX, true);
    view.setFloat32(4, this.initialY, true);
    view.setFloat32(8, this.goalX, true);
    view.setFloat32(12, this.goalY, true);
    return net.append(super.serialize(), buffer);
  }
  static deserialize(world: RAPIER.World, buffer: ArrayBufferLike){
    const { movableBallProps, kinematicBallProps } = KinematicBallDecode(buffer);
    const o = new KinematicBall(world, ...movableBallProps);
    for(const k of ['goalY', 'goalX', 'initialY', 'initialX'] as KinematicBallProps[])
      o[k] = kinematicBallProps[k];
    return o;
  }
}

export function KinematicBallDecode(buffer: ArrayBufferLike){
  const props = {
    initialX: 0,
    initialY: 0,
    goalX: 0,
    goalY: 0,
  };
  let view: DataView;
  for(const k of ['goalY', 'goalX', 'initialY', 'initialX'] as KinematicBallProps[]){
    [buffer, view] = net.extract_back(buffer, 4); // maybe this not good to reassign?
    props[k] = view.getFloat32(0, true);
  }
  return {
    movableBallProps: MovableBallDecode(buffer),
    kinematicBallProps: props,
  };
}

export type KinematicBallProps = 'goalY' | 'goalX' | 'initialY' | 'initialX';