import { Material } from './Material';
import { WireframeMaterial } from './WireframeMaterial'
import { Mesh } from '../geometry/Mesh';
import { Camera } from '../core/Camera';
import { Transform } from '../core/Transform'
import { LightManager } from '../lights/LightManager';
import { Vector3 } from '../math/Vector3' 
import { Color4 } from '../math/Color4' 
import { SphereMesh } from '../geometry/SphereMesh';
import { BoxMesh } from '../geometry/BoxMesh';

export enum BoundingVolumeMode
{
    BOX,
    SPHERE,
    NONE
}

export class BoundingVolumeMaterial extends Material
{
    public color: Color4;
    public mode: BoundingVolumeMode;

    private sphere: SphereMesh;
    private box: BoxMesh;

    constructor(mode = BoundingVolumeMode.BOX, color = new Color4(1, 1, 1, 1))
    {
        super();

        this.color = color;
        this.mode = mode;
        this.sphere = new SphereMesh(1, 2);
        this.box = new BoxMesh(1, 1, 1);

        const wireframeMaterial = new WireframeMaterial();
        wireframeMaterial.color.copy(this.color);
        this.sphere.material = wireframeMaterial;
        this.box.material = wireframeMaterial;
    }

    draw(mesh: Mesh, transform: Transform, camera: Camera, lightManager: LightManager): void
    {
        if(this.mode == BoundingVolumeMode.BOX)
        {
            const boxCenter = Vector3.add(mesh.boundingBox.min, mesh.boundingBox.max);
            boxCenter.multiplyScalar(0.5);
            this.box.position.copy(boxCenter);
            this.box.scale.set(
                mesh.boundingBox.max.x - mesh.boundingBox.min.x,
                mesh.boundingBox.max.y - mesh.boundingBox.min.y,
                mesh.boundingBox.max.z - mesh.boundingBox.min.z
            );
            this.box.computeWorldTransform(mesh);
            this.box.draw(mesh, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.SPHERE)
        {
            this.sphere.position.copy(mesh.boundingSphere.center);
            this.sphere.scale.set(mesh.boundingSphere.radius, mesh.boundingSphere.radius, mesh.boundingSphere.radius);
            this.sphere.computeWorldTransform(mesh);
            this.sphere.draw(mesh, camera, lightManager);
        }
    }
}