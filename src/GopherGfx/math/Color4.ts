export class Color4
{
    public static readonly WHITE = new Color4(1, 1, 1);
    public static readonly BLACK = new Color4(0, 0, 0);
    public static readonly RED = new Color4(1, 0 ,0);
    public static readonly GREEN = new Color4(0, 1 ,0);
    public static readonly BLUE = new Color4(0, 0, 1);
    public static readonly YELLOW = new Color4(1, 1, 0);
    public static readonly PURPLE = new Color4(1, 0, 1);
    public static readonly CYAN = new Color4(0, 1, 1);

    public r : number;
    public g : number;
    public b : number;
    public a : number;

    constructor(r = 0, g = 0, b = 0, a = 1)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    set(r: number, g: number, b: number, a: number): void
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    copy(color: Color4)
    {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }
}