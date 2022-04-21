export class Color3
{
    public static readonly WHITE = new Color3(1, 1, 1);
    public static readonly BLACK = new Color3(0, 0, 0);
    public static readonly RED = new Color3(1, 0 ,0);
    public static readonly GREEN = new Color3(0, 1 ,0);
    public static readonly BLUE = new Color3(0, 0, 1);
    public static readonly YELLOW = new Color3(1, 1, 0);
    public static readonly PURPLE = new Color3(1, 0, 1);
    public static readonly CYAN = new Color3(0, 1, 1);

    public r : number;
    public g : number;
    public b : number;

    constructor(r = 0, g = 0, b = 0)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    set(r: number, g: number, b: number): void
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    copy(color: Color3)
    {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
    }
}