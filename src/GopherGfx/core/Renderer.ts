import { Scene } from "./Scene";
import { Camera } from "./Camera";
import { Color4 } from "../math/Color4";
import { Vector2 } from "../math/Vector2";
import { MathUtils } from "../math/MathUtils";

export class Renderer
{
    public background : Color4;

    public readonly canvas : HTMLCanvasElement;
    public readonly gl : WebGL2RenderingContext;

    constructor()
    {
        this.canvas = document.getElementById("gfxCanvas") as HTMLCanvasElement;
        if(!this.canvas)
        {
            alert("Unable to find gfxCanvas.");
        }

        // Initialize the GL context
        const gl = this.canvas.getContext("webgl2")!;
        if(!gl) 
        {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        }
        this.gl = gl!;
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.enable(gl.CULL_FACE);
        this.gl.cullFace(gl.BACK);

        this.background = new Color4();
    }

    resize(width: number, height: number, aspectRatio: number) : void
    {
        this.canvas.width = width;
        this.canvas.height= height;

        // Resize and center the viewport to preserve the aspect ratio
        if(aspectRatio > window.innerWidth / window.innerHeight)
        {
            this.gl.viewport(
                0, 
                (window.innerHeight - window.innerWidth / aspectRatio) / 2, 
                window.innerWidth, 
                window.innerWidth / aspectRatio
            );
        }
        else
        {
            this.gl.viewport(
                (window.innerWidth - window.innerHeight * aspectRatio) / 2, 
                0, 
                window.innerHeight * aspectRatio, 
                window.innerHeight
            );
        }
    }

    render(scene : Scene, camera : Camera) : void
    {
        this.gl.clearColor(this.background.r, this.background.g, this.background.b, this.background.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); 
        
        scene.draw(camera);
    }

    getNormalizedDeviceCoordinates(mouseX: number, mouseY: number): Vector2
    {
        const viewport = this.gl.getParameter(this.gl.VIEWPORT) as Int32Array;
        return new Vector2(
            MathUtils.clamp((mouseX - viewport[0]) / viewport[2] * 2 - 1, -1, 1),
            MathUtils.clamp((mouseY - viewport[1]) / viewport[3] * -2 + 1, -1, 1)
        );
    }
}