import { Matrix4 } from "../math/Matrix4";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Camera } from "./Camera";
import { LightManager } from "../lights/LightManager";

export class Transform
{
    public children: Array<Transform>;

    public position: Vector3;
    public rotation: Quaternion;
    public scale: Vector3;
    public visible: boolean;

    protected matrix: Matrix4;
    protected worldMatrix: Matrix4;

    constructor()
    {
        this.children = [];
        this.position = new Vector3();
        this.rotation = new Quaternion();
        this.scale = new Vector3(1, 1, 1);
        this.visible = true;

        this.matrix = new Matrix4();
        this.worldMatrix = new Matrix4();
    }

    draw(parent: Transform, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.children.forEach((elem : Transform) => {
            elem.draw(this, camera, lightManager);
        });
    }

    postRender(): void
    {
        this.children.forEach((elem : Transform) => {
            elem.postRender();
        });
    }

    computeWorldTransform(parent: Transform): void
    {
        this.matrix.makeTransform(this.position, this.rotation, this.scale);
        
        this.worldMatrix.copy(parent.worldMatrix);
        this.worldMatrix.multiply(this.matrix);

        this.children.forEach((elem : Transform) => {
            elem.computeWorldTransform(this);
        });
    }

    add(child : Transform) 
    {
        this.children.push(child);
    }

    remove(child : Transform): Transform | null
    {
        const index = this.children.indexOf(child);

        if(index == -1)
        {
            return null;
        }
        else
        {
            const removedElement = this.children.splice(index, 1);
            return removedElement[0];
        }
    }

    setLights(lightManager: LightManager): void
    {
        this.children.forEach((elem) => {
            elem.setLights(lightManager);
        });
    }

    translate(translation: Vector3): void
    {
        this.position.add(this.rotation.rotate(translation));
    }

    translateX(distance: number): void
    {
        this.position.add(this.rotation.rotate(new Vector3(distance, 0, 0)));
    }

    translateY(distance: number): void
    {
        this.position.add(this.rotation.rotate(new Vector3(0, distance, 0)));
    }

    translateZ(distance: number): void
    {
        this.position.add(this.rotation.rotate(new Vector3(0, 0, distance)));
    }

    // in local space
    lookAt(target: Vector3, up = Vector3.UP): void
    {
        const rotationMatrix = Matrix4.lookAt(this.position, target, up);
        this.rotation.setMatrix(rotationMatrix);
    }

    getWorldMatrix(): Matrix4
    {
        return this.worldMatrix;
    }

    getLocalMatrix(): Matrix4
    {
        return this.matrix;
    }
}