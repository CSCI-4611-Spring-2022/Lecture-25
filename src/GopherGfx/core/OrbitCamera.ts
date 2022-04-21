import { Camera } from "./Camera";
import { Quaternion } from "../math/Quaternion";

export class OrbitCamera extends Camera
{
    private mouseDrag : boolean;

    // Camera parameters
    public cameraOrbitX : Quaternion;
    public cameraOrbitY : Quaternion;
    public cameraDistance : number;

    constructor(cameraDistance = 1, fov = 60, aspectRatio = 1920/1080, near = 0.1, far = 100)
    {
        super(fov, aspectRatio, near, far);

        this.mouseDrag = false;
        this.cameraOrbitX = new Quaternion();
        this.cameraOrbitY = new Quaternion();
        this.cameraDistance = cameraDistance;

        this.updateCameraOrbit();
    }

    onMouseDown(event: MouseEvent) : void 
    {
        if((event.target! as Element).localName == "canvas")
        {
            this.mouseDrag = true;
        }
    }

    onMouseUp(event: MouseEvent) : void
    {
        this.mouseDrag = false;
    }
    
    onMouseMove(event: MouseEvent) : void
    {
        if(this.mouseDrag)
        {
            this.cameraOrbitX.multiply(Quaternion.makeRotationX(-event.movementY * Math.PI / 180));
            this.cameraOrbitY.multiply(Quaternion.makeRotationY(-event.movementX * Math.PI / 180));
            this.updateCameraOrbit();
        }
    }

    onMouseWheel(event: WheelEvent) : void
    {
        this.cameraDistance += event.deltaY / 1000;
        this.updateCameraOrbit();
    }

    public updateCameraOrbit() : void
    {
        this.rotation.copy(this.cameraOrbitX);
        this.rotation.multiply(this.cameraOrbitY);

        this.position.set(0, 0, this.cameraDistance);
        this.position.rotate(this.rotation);
    }
}