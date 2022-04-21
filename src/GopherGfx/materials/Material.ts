import { GraphicsApp } from '../core/GraphicsApp';
import { Mesh } from '../geometry/Mesh';
import { Camera } from '../core/Camera';
import { Transform } from '../core/Transform';
import { LightManager } from '../lights/LightManager';

export enum Side
{
    FRONT,
    BACK,
    DOUBLE
}

export abstract class Material
{
    public visible: boolean;
    public side: Side;

    protected readonly gl: WebGL2RenderingContext;

    constructor()
    {
        this.visible = true;
        this.side = Side.FRONT;
        this.gl  = GraphicsApp.getInstance().renderer.gl;
    }

    protected initialize(): void
    {
        if(this.side == Side.DOUBLE)
        {
            this.gl.disable(this.gl.CULL_FACE);
            return;
        }

        this.gl.enable(this.gl.CULL_FACE);

        if(this.side == Side.FRONT)
             this.gl.cullFace(this.gl.BACK);
        else
            this.gl.cullFace(this.gl.FRONT);
    }

    abstract draw(mesh: Mesh, transform: Transform, camera: Camera, lightManager: LightManager) : void; 
}