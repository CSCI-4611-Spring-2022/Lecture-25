import { Matrix4 } from '../math/Matrix4'
import { Transform } from './Transform'

export class Camera extends Transform
{
    protected projectionMatrix: Matrix4;
    protected viewMatrix: Matrix4;
    protected fov: number;
    protected aspectRatio: number;
    protected near: number;
    protected far: number;
    
    constructor(fov = 60, aspectRatio = 1920/1080, near = 0.1, far = 100)
    {
        super();

        this.projectionMatrix = new Matrix4();
        this.viewMatrix = new Matrix4();

        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;

        this.projectionMatrix.makePerspective(fov, aspectRatio, near, far);
    }

    public getProjectionMatrix(): Matrix4
    {
        return this.projectionMatrix;
    }

    public getViewMatrix(): Matrix4
    {
        return this.viewMatrix;
    }

    public setPerspectiveCamera(fov : number, aspectRatio : number, near : number, far : number) : void
    {
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;

        this.projectionMatrix.makePerspective(fov, aspectRatio, near, far);
    }

    public computeWorldTransform(parent: Transform) : void
    {
        super.computeWorldTransform(parent);
        this.viewMatrix = this.worldMatrix.inverse();
    }

    public getFov(): number
    {
        return this.fov;
    }

    public getAspectRatio(): number
    {
        return this.aspectRatio;
    }

    public getNear(): number
    {
        return this.near;
    }

    public getFar(): number
    {
        return this.far;
    }

    // Subclasses can override these methods to handle events
    onMouseDown(event: MouseEvent) : void {}
    onMouseUp(event: MouseEvent) : void {}
    onMouseMove(event: MouseEvent) : void {}
    onMouseWheel(event: WheelEvent) : void {}
    onKeyDown(event: KeyboardEvent) : void {}
    onKeyUp(event: KeyboardEvent) : void {}
}