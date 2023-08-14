import { type RAPIER } from './rapier';
import { MovableBall } from './MovableBall';
import {
  Vector2Angle,
  Vector2FromPolar,
  Vector2Magnitude,
  Vector2Subtract,
} from './base';

export class KinematicBall extends MovableBall {
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
}
