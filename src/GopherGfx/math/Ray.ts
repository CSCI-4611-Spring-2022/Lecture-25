import { Vector3 } from "./Vector3"

export class Ray 
{
    public origin: Vector3;
    public direction: Vector3;

    constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1))
    {
        this.origin = origin;
        this.direction = direction;
    }
    
    set(origin: Vector3, direction: Vector3): void
    {
        this.origin = origin;
        this.direction = direction;
    }
}