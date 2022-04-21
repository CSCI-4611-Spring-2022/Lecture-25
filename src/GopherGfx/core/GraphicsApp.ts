import { Renderer } from './Renderer'
import { Camera } from './Camera'
import { Scene } from './Scene';

export abstract class GraphicsApp 
{
    private static instance : GraphicsApp;
    
    public static getInstance() : GraphicsApp
    {
        return GraphicsApp.instance;
    }

    public renderer : Renderer;
    public camera : Camera;
    public scene : Scene;

    private time : number;

    constructor()
    {
        GraphicsApp.instance = this;

        this.time = Date.now();

        this.camera = new Camera();
        this.scene = new Scene();

        this.renderer = new Renderer();
        this.renderer.resize(window.innerWidth, window.innerHeight, this.camera.getAspectRatio());
  
        // Register event handlers
        window.addEventListener('resize', () => {this.resize()}, false);
        window.addEventListener('mousedown', (event: MouseEvent) => {this.onMouseDownEventHandler(event)});
        window.addEventListener('mouseup', (event: MouseEvent) => {this.onMouseUpEventHandler(event)});
        window.addEventListener('mousemove', (event: MouseEvent) => {this.onMouseMoveEventHandler(event)});
        window.addEventListener('wheel', (event: WheelEvent) => {this.onMouseWheelEventHandler(event)});
        window.addEventListener('keydown', (event: KeyboardEvent) => {this.onKeyDownEventHandler(event)});
        window.addEventListener('keyup', (event: KeyboardEvent) => {this.onKeyUpEventHandler(event)});  
    }

    // Create the scene and enter the main loop
    start() : void 
    {
        this.createScene();
        this.mainLoop();
    }

    // This starts the main loop of the game
    private mainLoop() : void
    {
        // Update the app
        this.update((Date.now() - this.time) / 1000);

        // Draw the graphics
        this.renderer.render(this.scene, this.camera);

        this.scene.postRender();

        // Run the main loop function on the next frame
        window.requestAnimationFrame(() => this.mainLoop());
    }

    // Resize the viewport
    resize() : void
    {
        this.renderer.resize(window.innerWidth, window.innerHeight, this.camera.getAspectRatio());
    }

    // Your app should implement the following abstract methods
    abstract createScene() : void;
    abstract update(deltaTime : number) : void;

    // Subclasses can override these methods to handle events
    onMouseDown(event: MouseEvent) : void {}
    onMouseUp(event: MouseEvent) : void {}
    onMouseMove(event: MouseEvent) : void {}
    onMouseWheel(event: WheelEvent) : void {}
    onKeyDown(event: KeyboardEvent) : void {}
    onKeyUp(event: KeyboardEvent) : void {}
    
    // Internal methods to handle events
    private onMouseDownEventHandler(event: MouseEvent) : void 
    {
        this.camera.onMouseDown(event);
        this.onMouseDown(event);
    }

    private onMouseUpEventHandler(event: MouseEvent) : void 
    {
        this.camera.onMouseUp(event);
        this.onMouseUp(event);
    }

    private onMouseMoveEventHandler(event: MouseEvent) : void 
    {
        this.camera.onMouseMove(event);
        this.onMouseMove(event);
    }

    private onMouseWheelEventHandler(event: WheelEvent) : void 
    {
        this.camera.onMouseWheel(event);
        this.onMouseWheel(event);
    }

    private onKeyDownEventHandler(event: KeyboardEvent) : void 
    {
        this.camera.onKeyDown(event);
        this.onKeyDown(event);
    }

    private onKeyUpEventHandler(event: KeyboardEvent) : void 
    {
        this.camera.onKeyUp(event);
        this.onKeyUp(event);
    }
}