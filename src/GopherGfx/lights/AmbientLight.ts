import { Color3 } from "../math/Color3";
import { Light, LightType } from "./Light";

export class AmbientLight extends Light
{
    constructor(color = new Color3(0.5, 0.5, 0.5))
    {
        super(LightType.POINT, color, new Color3(0, 0, 0),  new Color3(0, 0, 0));
    }
}