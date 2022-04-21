import { Mesh } from './Mesh'
import { Transform } from '../core/Transform'
import { Camera } from "../core/Camera";
import { LightManager } from "../lights/LightManager";
import { Material } from '../materials/Material';

export class MeshInstance extends Transform
{
    public readonly baseMesh;
    public material: Material;

    constructor(baseMesh: Mesh)
    {
        super();
        this.baseMesh = baseMesh;
        this.material = baseMesh.material;
    }

    getBaseMesh(): Mesh
    {
        return this.baseMesh;
    }

    draw(parent: Transform, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseMesh, this, camera, lightManager);

        this.children.forEach((elem : Transform) => {
            elem.draw(this, camera, lightManager);
        });
    }

    postRender(): void
    {
        this.baseMesh.postRender();
        
        this.children.forEach((elem : Transform) => {
            elem.postRender();
        });
    }
}