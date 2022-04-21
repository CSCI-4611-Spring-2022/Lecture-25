import { Transform } from "../core/Transform";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { Color4 } from "../math/Color4";
import { Material } from "../materials/Material";
import { GouraudMaterial } from "../materials/GouraudMaterial";
import { Camera } from "../core/Camera";
import { LightManager } from "../lights/LightManager";
import { GraphicsApp } from "../core/GraphicsApp";

export class Mesh extends Transform
{
    protected readonly gl : WebGL2RenderingContext;

    public positionBuffer: WebGLBuffer | null;
    public normalBuffer: WebGLBuffer | null;
    public colorBuffer: WebGLBuffer | null;
    public indexBuffer: WebGLBuffer | null;
    public texCoordBuffer: WebGLBuffer | null;

    public positionBufferDirty: boolean;
    public normalBufferDirty: boolean;
    public colorBufferDirty: boolean;
    public indexBufferDirty: boolean;
    public texCoordBufferDirty: boolean;

    public vertexCount: number;
    public triangleCount: number;

    public material: Material;
    
    constructor()
    {
        super();

        this.gl  = GraphicsApp.getInstance().renderer.gl;

        this.positionBuffer = this.gl.createBuffer();
        this.normalBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.indexBuffer = this.gl.createBuffer();
        this.texCoordBuffer = this.gl.createBuffer();
        this.positionBufferDirty = false;
        this.normalBufferDirty = false;
        this.colorBufferDirty = false;
        this.indexBufferDirty = false;
        this.texCoordBufferDirty = false;
        this.vertexCount = 0;
        this.triangleCount = 0;

        // default material
        this.material = new GouraudMaterial();
    }

    draw(parent: Transform, camera: Camera, lightManager: LightManager) : void
    {
        if(!this.visible)
            return;

        this.material.draw(this, this, camera, lightManager);

        this.children.forEach((elem : Transform) => {
            elem.draw(this, camera, lightManager);
        });
    }

    postRender(): void
    {
        this.positionBufferDirty = false;
        this.normalBufferDirty = false;
        this.colorBufferDirty = false;
        this.indexBufferDirty = false;

        this.children.forEach((elem : Transform) => {
            elem.postRender();
        });
    }

    setVertices(vertices : Vector3[] | number[]) : void
    {
        if(vertices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

            if(typeof vertices[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices as number[]), this.gl.DYNAMIC_DRAW);
                this.vertexCount = vertices.length / 3;
            }
            else
            {
                const vArray : number[] = [];
                (vertices as Vector3[]).forEach((elem : Vector3) =>
                {
                    vArray.push(elem.x, elem.y, elem.z);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), this.gl.DYNAMIC_DRAW);
                this.vertexCount = vertices.length;
            }

            this.positionBufferDirty = true;
        }
    }

    setNormals(normals : Vector3[] | number[]) : void
    {
        if(normals.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);

            if(typeof normals[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals as number[]), this.gl.DYNAMIC_DRAW);
            }
            else
            {
                const nArray : number[] = [];
                (normals as Vector3[]).forEach((elem : Vector3) =>
                {
                    nArray.push(elem.x, elem.y, elem.z);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), this.gl.DYNAMIC_DRAW);
            }

            this.normalBufferDirty = true;
        }
    }

    setColors(colors: Color4[] | number[]) : void
    {
        if(colors.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

            if(typeof colors[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors as number[]), this.gl.DYNAMIC_DRAW);
            }
            else
            {
                const cArray : number[] = [];
                (colors as Color4[]).forEach((elem : Color4) =>
                {
                    cArray.push(elem.r, elem.g, elem.b, elem.a);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cArray), this.gl.DYNAMIC_DRAW);
            }

            this.colorBufferDirty = true;
        }
    }

    setTextureCoordinates(texCoords: Vector2[] | number[]): void
    {
        if(texCoords.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

            if(typeof texCoords[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords as number[]), this.gl.DYNAMIC_DRAW);
            }
            else
            {
                const tArray : number[] = [];
                (texCoords as Vector2[]).forEach((elem: Vector2) =>
                {
                    tArray.push(elem.x, elem.y);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tArray), this.gl.DYNAMIC_DRAW);
            }

            this.texCoordBufferDirty = true;
        }
    }

    setIndices(indices: Vector3[] | number[]) : void
    {
        if(indices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            if(typeof indices[0] === 'number')
            {
                this.triangleCount = indices.length / 3;
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices as number[]), this.gl.DYNAMIC_DRAW);
            }
            else
            {
                this.triangleCount = indices.length;
                const iArray: number[] = [];
                (indices as Vector3[]).forEach((elem : Vector3) =>
                {
                    iArray.push(elem.x, elem.y, elem.z);
                });
                
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(iArray), this.gl.DYNAMIC_DRAW);
            }

            this.indexBufferDirty = true;
        }
    }

    setArrayBuffer(values : Vector3[] | number[], buffer: WebGLBuffer | null) : void
    {
        if(values.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

            if(typeof values[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values as number[]), this.gl.DYNAMIC_DRAW);
            }
            else
            {
                const nArray : number[] = [];
                (values as Vector3[]).forEach((elem : Vector3) =>
                {
                    nArray.push(elem.x, elem.y, elem.z);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), this.gl.DYNAMIC_DRAW);
            }
        }
    }

    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    getNormals(): number[]
    {
        const normalArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.normalBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, normalArray);
        return [... normalArray];
    }

    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    getTextureCoordinates(): number[]
    {
        const texCoordArray = new Float32Array(this.vertexCount * 2);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.texCoordBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, texCoordArray);
        return [... texCoordArray];
    }

    getIndices(): number[]
    {
        const indexArray = new Uint16Array(this.triangleCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.indexBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, indexArray);
        return [... indexArray];
    }

    getArrayBuffer(buffer: WebGLBuffer | null): number[]
    {
        const valueArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, buffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, valueArray);
        return [... valueArray];
    }

    public createDefaultVertexColors(): void
    {
        const colors = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }
}