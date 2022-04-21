import { GraphicsApp } from '../core/GraphicsApp';

export class Texture
{
    private static numTextures = 0;

    protected readonly gl: WebGL2RenderingContext;

    public texture: WebGLTexture | null;
    public id: number;

    constructor(url: string | null = null)
    {
        this.gl  = GraphicsApp.getInstance().renderer.gl;

        this.texture = this.gl.createTexture();
        this.id = Texture.numTextures;
        Texture.numTextures++;

        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, 
            this.gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        
        if(url)
            this.load(url);
    }

    load(url: string): void
    {
        const image = new Image();
        image.addEventListener('load', (event: Event)=>{ this.setImage(image) }, false);
        image.src = url;
    }

    setImage(image: HTMLImageElement): void
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }
}