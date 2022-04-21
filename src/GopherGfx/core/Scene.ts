import { Camera } from "./Camera";
import { Transform } from "./Transform";
import { LightManager } from "../lights/LightManager";

export class Scene
{
    public root : Transform;
    private lightManager: LightManager;
    
    constructor()
    {
        this.root = new Transform();
        this.lightManager = new LightManager();
    }

    draw(camera: Camera) : void
    {
        // Make sure the camera world transform is computed
        camera.computeWorldTransform(this.root);

        // Compute the world transforms for all objects in the scene graph
        this.computeWorldTransforms();

        // Update the scene lights
        this.lightManager.clear();
        this.root.setLights(this.lightManager);
        this.lightManager.updateLights();

        this.root.children.forEach((elem : Transform) => {
            elem.draw(this.root, camera, this.lightManager);
        });
    }

    postRender(): void
    {
        this.root.children.forEach((elem : Transform) => {
            elem.postRender();
        });
    }

    add(child : Transform) : void
    {
        this.root.add(child);
    }

    remove(child : Transform) : void
    {
        this.root.remove(child);
    }

    computeWorldTransforms() : void
    {
        this.root.children.forEach((elem : Transform) => {
            elem.computeWorldTransform(this.root);
        });
    }
}