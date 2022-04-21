import * as gfx from './GopherGfx/GopherGfx'

export class RaycastApp extends gfx.GraphicsApp
{
    private ground: gfx.PlaneMesh;
    private sky: gfx.SphereMesh;

    private line: gfx.BoxMesh;
    private marker: gfx.SphereMesh;

    private testMesh: gfx.Mesh;
    private testMeshBounds: gfx.MeshInstance;

    constructor()
    {
        super();

        this.ground = new gfx.PlaneMesh(1000, 1000);
        this.sky = new gfx.SphereMesh(500);

        this.line = new gfx.BoxMesh(0.01, 0.01, 100);
        this.marker = new gfx.SphereMesh(0.05);

        this.testMesh = gfx.ObjLoader.load('./assets/bunny.obj');
        this.testMeshBounds = new gfx.MeshInstance(this.testMesh);
    }

    createScene(): void 
    {
        this.camera = new gfx.OrbitCamera(3, 60, 1920/1080, 0.1, 1000);

        const ambientLight = new gfx.AmbientLight(new gfx.Color3(0.5, 0.5, 0.5));
        this.scene.add(ambientLight);

        const directionaLight = new gfx.DirectionalLight(new gfx.Color3(.6, .6 , .6));
        directionaLight.position.set(10, 0, 0)
        this.scene.add(directionaLight);

        const groundMaterial = new gfx.GouraudMaterial();
        groundMaterial.ambientColor.set(.425, .90, .555);
        this.ground.material = groundMaterial;
        this.ground.position.set(0, -1, 0);
        this.ground.rotation.setEulerAngles(0, Math.PI / 2, 0);
        this.scene.add(this.ground);

        const skyMaterial = new gfx.UnlitMaterial();
        skyMaterial.side = gfx.Side.BACK;
        skyMaterial.color.set(.529, .807, .921);
        this.sky.material = skyMaterial;
        this.scene.add(this.sky);

        const testMaterial = new gfx.GouraudMaterial();
        testMaterial.ambientColor.set(0, 0, 1);
        testMaterial.specularColor.set(1, 1, 1);

        this.testMesh.material = testMaterial;
        //this.testMesh.translateY(1);
        //this.testMesh.rotation.setRotationY(-Math.PI / 2)
        this.scene.add(this.testMesh);

        this.testMeshBounds.material = new gfx.BoundingVolumeMaterial(gfx.BoundingVolumeMode.BOX);
        this.testMesh.add(this.testMeshBounds);

        const lineMaterial = new gfx.UnlitMaterial();
        lineMaterial.color.set(1, 0, 1);
        this.line.material = lineMaterial;
        this.line.visible = false;
        this.scene.add(this.line);

        const markerMaterial = new gfx.GouraudMaterial();
        markerMaterial.ambientColor.set(1, 0, 0);
        markerMaterial.diffuseColor.set(1, 0, 0);
        this.marker.material = markerMaterial;
        this.marker.visible = false;
        this.scene.add(this.marker);
    }

    update(deltaTime: number): void 
    {
        
    }

    onMouseDown(event: MouseEvent): void 
    {
        // Get the mouse position in normalized device coordinates
        // Then create the ray caster
        const deviceCoords = this.renderer.getNormalizedDeviceCoordinates(event.x, event.y);
        const raycaster = new gfx.Raycaster();
        raycaster.setPickRay(deviceCoords, this.camera);

        // Use the line object to visualize the ray cast
        this.line.visible = true;
        this.line.position.copy(raycaster.ray.origin);
        this.line.lookAt(gfx.Vector3.add(raycaster.ray.origin, raycaster.ray.direction));
        this.line.translateZ(this.line.depth / -2 - 0.5);

        // Set the ray cast marker to invisible by default
        this.marker.visible = false;

        // Ray cast to the mesh
        const meshIntersection = raycaster.intersectsMesh(this.testMesh);
        if(meshIntersection)
        {
            this.marker.position.copy(meshIntersection);
            this.marker.visible = true;
            return;
        }

        // Ray cast to the ground plane
        const plane = new gfx.Plane(this.ground.position, gfx.Vector3.UP);
        const planeIntersection = raycaster.intersectsPlane(plane);
        if(planeIntersection)
        {
            this.marker.position.copy(planeIntersection);
            this.marker.visible = true;
            return;
        }
    }
}