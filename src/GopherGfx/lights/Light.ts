import { Color3 } from "../math/Color3";
import { LightManager } from "./LightManager";
import { Transform } from "../core/Transform";

export enum LightType
{
    POINT = 0,
    DIRECTIONAL
}

export abstract class Light extends Transform
{
    public ambientIntensity: Color3;
    public diffuseIntensity: Color3;
    public specularIntensity: Color3;

    protected readonly type : LightType;

    constructor(type = LightType.POINT, ambientIntensity = new Color3(), diffuseIntensity = new Color3(), specularIntensity = new Color3())
    {
        super();

        this.type = type;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
    }

    getType() : LightType
    {
        return this.type;
    }

    setLights(lightManager: LightManager) : void
    {
        lightManager.addLight(this);
        super.setLights(lightManager);
    }
}