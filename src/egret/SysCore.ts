import {
    DisplayObject,
    Matrix,
    BitmapData,
    type EngineWebGLTexture,
    type BlendModeValue,
    LocaleStringsHelper,
    Stage,
    __reflect,
    HashObject,
    Rectangle,
    type FPSStyles,
    getFps,
    type FPSDisplay,
    StageScaleMode,
    Capabilities,
    RuntimeType,
    type TickCallback,
    GlobalHelper,
    type DeferredCallback,
    ColorMatrixFilter,
    type GradientTypeValue,
    type CapsStyleValue,
    type JointStyleValue,
    type ITextStyle,
    $error,
    BitmapFillMode,
    CallHelper,
    CapsStyle,
    DefinitionHelper,
    // getDefinitionByName,
    getFpsDisplay,
    getTicker,
    getTimer,
    Texture,
    WebGLUtils,
    Event,
    TouchEvent,
    log,
    DisplayObjectContainer,
} from "./EgretCore";
import type {
    DrawLabel,
    WebGLRenderTarget,
    WebGLRenderContext,
    PremultipliedTexture,
    TextureDrawData,
} from "./WebCore";
import { runtime } from "./Runtime";
import {
    LifecycleContext,
    LifecycleHelper,
} from "./Lifecycle";

export type RenderContext = CanvasRenderingContext2D | WebGLRenderingContext;
export type PathCommand = 1 | 2 | 3 | 4;

export interface RenderBuffer {
    resize(width: number, height: number): void;
    getPixels(x: number, y: number): Uint8Array | Uint8ClampedArray;
}
export interface SystemRenderer {
    render(target: DisplayObject, buffer: RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
}
export interface CanvasGraphicsRenderer {
    drawNodeToBuffer(node: GraphicsNode, buffer: RenderBuffer, matrix: Matrix, forHitTest: boolean): void;
}
export interface BitmapDrawNode {
    image: BitmapData | null;
    imageWidth: number;
    imageHeight: number;
    smoothing: boolean;
    drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void;
}
export interface RenderBuffer {
    surface: HTMLCanvasElement | WebGLRenderTarget;
    resize(width: number, height: number, useMaxSize?: boolean): void;
    clear(): void;
    getPixels(x: number, y: number, width?: number, height?: number): Uint8Array | Uint8ClampedArray;
}
export interface CanvasContext extends CanvasRenderingContext2D {
    $offsetX: number;
    $offsetY: number;
    $imageSmoothingEnabled?: boolean;
}
export interface CanvasRenderBuffer extends RenderBuffer {
    surface: HTMLCanvasElement;
    context: CanvasContext;
}
export interface SystemRenderer {
    render(target: DisplayObject, buffer: RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
}
export interface StageSize {
    stageWidth: number;
    stageHeight: number;
    displayWidth: number;
    displayHeight: number;
}
export interface IScreenAdapter {
    calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): StageSize;
}
interface IntervalEntry {
    delay: number;
    originDelay: number;
    execute(): void;
}
interface TimeoutEntry {
    delay: number;
    execute(): void;
}

export function measureText(text: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): number {
    const textContext = runtime.web.WebMiscHelper.getTextContext();
    let font: string = "";
    if (italic) {
        font += "italic ";
    }
    if (bold) {
        font += "bold ";
    }
    font += (fontSize || 12) + "px ";
    font += fontFamily || "Arial";
    textContext.font = font;
    return measureTextWith(textContext, text);
}
export function mainCanvas(width: number, height: number): HTMLCanvasElement {
    return createCanvas(width, height);
}
export function createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    if (!isNaN(width) && !isNaN(height)) {
        canvas.width = width;
        canvas.height = height;
    }
    return canvas;
}
export function resizeContext(renderContext: WebGLRenderContext | null, width: number, height: number, useMaxSize?: boolean): void {
    if (!renderContext) {
        return;
    }
    const surface: HTMLCanvasElement = renderContext.surface;
    if (useMaxSize) {
        if (surface.width < width) {
            surface.width = width;
        }
        if (surface.height < height) {
            surface.height = height;
        }
    } else {
        if (surface.width !== width) {
            surface.width = width;
        }
        if (surface.height !== height) {
            surface.height = height;
        }
    }
    renderContext.onResize();
}
export function getContextWebGL(surface: HTMLCanvasElement): WebGLRenderingContext | null {
    const options: WebGLContextAttributes = {
        antialias : runtime.web.WebGLRenderContext.antialias,
        stencil   : true,
    };
    let gl: WebGLRenderingContext | null = null;
    const names: string[] = ["webgl", "experimental-webgl"];
    for (let i: number = 0; i < names.length; ++i) {
        try {
            gl = surface.getContext(names[i]!, options) as WebGLRenderingContext | null;
        } catch {
            // Some browsers throw for unsupported context names; try the next alias.
        }
        if (gl) {
            break;
        }
    }
    if (!gl) {
        $error(1021);
    }
    return gl;
}
export function getContext2d(surface: HTMLCanvasElement | null): CanvasContext | null {
    return surface ? surface.getContext("2d") as CanvasContext | null : null;
}
export function createTexture(renderContext: WebGLRenderContext, bitmapData: TexImageSource): EngineWebGLTexture | undefined {
    const gl: WebGLRenderingContext = renderContext.context;
    const texture: PremultipliedTexture | null = gl.createTexture() as PremultipliedTexture | null;
    if (!texture) {
        renderContext.contextLost = true;
        return;
    }
    texture[DefinitionHelper.glContext] = gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    texture[DefinitionHelper.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}
export function _createTexture(renderContext: WebGLRenderContext, width: number, height: number, data: ArrayBufferView | null): EngineWebGLTexture | null {
    const gl: WebGLRenderingContext = renderContext.context;
    const texture: PremultipliedTexture | null = gl.createTexture() as PremultipliedTexture | null;
    if (!texture) {
        renderContext.contextLost = true;
        return null;
    }
    texture[DefinitionHelper.glContext] = gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    texture[DefinitionHelper.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}
export function drawTextureElements(renderContext: WebGLRenderContext, data: TextureDrawData, offset: number): number {
    const gl: WebGLRenderingContext = renderContext.context;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, data.texture);
    const size: number = data.count * 3;
    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
    return size;
}
export function measureTextWith(context: CanvasRenderingContext2D, text: string): number {
    return context.measureText(text).width;
}
export function createCanvasRenderBufferSurface(defaultFunc: (width: number, height: number, root?: boolean) => HTMLCanvasElement | null, width: number, height: number, _root?: boolean): HTMLCanvasElement | null {
    void _root;

    return defaultFunc(width, height);
}
export function resizeCanvasRenderBuffer(renderContext: CanvasRenderBuffer, width: number, height: number, useMaxSize?: boolean): void {
    const surface: HTMLCanvasElement = renderContext.surface;
    if (useMaxSize) {
        let change: boolean = false;
        if (surface.width < width) {
            surface.width = width;
            change = true;
        }
        if (surface.height < height) {
            surface.height = height;
            change = true;
        }
        if (!change) {
            renderContext.context.globalCompositeOperation = "source-over";
            renderContext.context.setTransform(1, 0, 0, 1, 0, 0);
            renderContext.context.globalAlpha = 1;
        }
    } else {
        if (surface.width != width) {
            surface.width = width;
        }
        if (surface.height != height) {
            surface.height = height;
        }
    }
    renderContext.clear();
}
export function $logToFPS(info: string): void {
    if (!LoggerHelper.fpsDisplay) {
        LoggerHelper.logLines!.push(info);
        return;
    }
    LoggerHelper.fpsDisplay.updateInfo(info);
}
export function $warnToFPS(info: string): void {
    if (!LoggerHelper.fpsDisplay) {
        LoggerHelper.warnLines!.push(info);
        return;
    }
    LoggerHelper.fpsDisplay.updateWarn(info);
}
export function $errorToFPS(info: string): void {
    if (!LoggerHelper.fpsDisplay) {
        LoggerHelper.errorLines!.push(info);
        return;
    }
    LoggerHelper.fpsDisplay.updateError(info);
}
export function blendModeToNumber(blendMode: string): number {
    const num: number | undefined = BlendModeHelper.getBlendModeNumber()[blendMode];
    return num === undefined ? 0 : num;
}
export function numberToBlendMode(blendMode: number): BlendModeValue {
    const str: BlendModeValue | undefined = BlendModeHelper.blendModeString[blendMode];
    return str === undefined ? "normal" : str;
}
export function tr(code: number, ...args: unknown[]): string {
    let text: string | undefined = LocaleStringsHelper.getLocaleStrings()[LocaleStringsHelper.getLanguage()]![code];
    if (!text) {
        return "{" + code + "}";
    }
    const length: number = args.length;
    for (let i: number = 0; i < length; i++) {
        // ���� replace ������ʱ������ת�����滻�������壬��Ԥ��ת���ַ�����
        text = text.replace("{" + i + "}", args[i] as string);
    }
    return text;
}

export class RenderBuffHelper {
    public static RenderBuffer: (new (width?: number, height?: number, root?: boolean) => RenderBuffer) | undefined;
    public static CanvasRenderBuffer: (new (width?: number, height?: number) => CanvasRenderBuffer) | undefined;

    public static customHitTestBuffer: RenderBuffer | undefined;
    public static systemRenderer: SystemRenderer | undefined;
}

export class TempStageHelper {
    public static $TempStage: Stage | undefined;
}

export class ScreenAdapterHelper {
    public static screenAdapter: IScreenAdapter | undefined;
}

export class StartTimeHelper {
    public static $START_TIME: number = 0;
}

export class RenderHelper {
    public static $invalidateRenderFlag: boolean = false;
    public static $requestRenderingFlag: boolean = false;

    public static canvasHitTestBuffer: CanvasRenderBuffer | undefined;
    public static canvasRenderer: CanvasGraphicsRenderer | undefined;
}

class BlendModeHelper {
    public static readonly blendModeString: BlendModeValue[] = ["normal", "add", "erase"];
    private static blendModeNumber: Record<string, number | undefined> | undefined;

    public static getBlendModeNumber() {
        return BlendModeHelper.blendModeNumber ??= BlendModeHelper.generateBlendModeNumber();
    }
    private static generateBlendModeNumber(): Record<string, number | undefined> {
        const blendModeNumber: Record<string, number | undefined> = {};
        const length: number = BlendModeHelper.blendModeString.length;
        for (let i: number = 0; i < length; i++) {
            blendModeNumber[BlendModeHelper.blendModeString[i]!] = i;
        }

        return blendModeNumber;
    }
}

class LoggerHelper {
    public static logLines: string[] | null = [];
    public static warnLines: string[] | null = [];
    public static errorLines: string[] | null = [];
    public static fpsDisplay: FPSImpl | undefined;
}

export class RenderNode<TDrawData = unknown> {
    public type: number = 0;
    public drawData: TDrawData[] = [];
    public renderCount: number = 0;

    public constructor() {
    }

    public cleanBeforeRender(): void {
        this.drawData.length = 0;
        this.renderCount = 0;
    }

    public $getRenderCount(): number {
        return this.renderCount;
    }
}
__reflect(RenderNode.prototype, "egret.sys.RenderNode");

export class Path2D {
    public type: number = 0;
    public $commands: PathCommand[] = [];
    public $data: number[] = [];
    public commandPosition: number = 0;
    public dataPosition: number = 0;
    public $lastX: number = 0;
    public $lastY: number = 0;

    public constructor() {
    }

    public moveTo(x: number, y: number): void {
        this.$commands[this.commandPosition++] = 1;
        let pos: number = this.dataPosition;
        this.$data[pos++] = x;
        this.$data[pos++] = y;
        this.dataPosition = pos;
    }

    public lineTo(x: number, y: number): void {
        this.$commands[this.commandPosition++] = 2;
        let pos: number = this.dataPosition;
        this.$data[pos++] = x;
        this.$data[pos++] = y;
        this.dataPosition = pos;
    }

    public curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void {
        this.$commands[this.commandPosition++] = 3;
        let pos: number = this.dataPosition;
        this.$data[pos++] = controlX;
        this.$data[pos++] = controlY;
        this.$data[pos++] = anchorX;
        this.$data[pos++] = anchorY;
        this.dataPosition = pos;
    }

    public cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void {
        this.$commands[this.commandPosition++] = 4;
        let pos: number = this.dataPosition;
        this.$data[pos++] = controlX1;
        this.$data[pos++] = controlY1;
        this.$data[pos++] = controlX2;
        this.$data[pos++] = controlY2;
        this.$data[pos++] = anchorX;
        this.$data[pos++] = anchorY;
        this.dataPosition = pos;
    }

    public drawRect(x: number, y: number, width: number, height: number): void {
        const x2: number = x + width;
        const y2: number = y + height;
        this.moveTo(x, y);
        this.lineTo(x2, y);
        this.lineTo(x2, y2);
        this.lineTo(x, y2);
        this.lineTo(x, y);
    }

    public drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void {
        let radiusX: number = (ellipseWidth * 0.5) | 0;
        let radiusY: number = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
        if (!radiusX || !radiusY) {
            this.drawRect(x, y, width, height);
            return;
        }
        const hw: number = width * 0.5;
        const hh: number = height * 0.5;
        if (radiusX > hw) {
            radiusX = hw;
        }
        if (radiusY > hh) {
            radiusY = hh;
        }
        if (hw === radiusX && hh === radiusY) {
            if (radiusX === radiusY) {
                this.drawCircle(x + radiusX, y + radiusY, radiusX);
            } else {
                this.drawEllipse(x, y, radiusX * 2, radiusY * 2);
            }
            return;
        }
        const right: number = x + width;
        const bottom: number = y + height;
        const xlw: number = x + radiusX;
        const xrw: number = right - radiusX;
        const ytw: number = y + radiusY;
        const ybw: number = bottom - radiusY;
        this.moveTo(right, ybw);
        this.curveTo(right, bottom, xrw, bottom);
        this.lineTo(xlw, bottom);
        this.curveTo(x, bottom, x, ybw);
        this.lineTo(x, ytw);
        this.curveTo(x, y, xlw, y);
        this.lineTo(xrw, y);
        this.curveTo(right, y, right, ytw);
        this.lineTo(right, ybw);
    }

    public drawCircle(x: number, y: number, radius: number): void {
        this.arcToBezier(x, y, radius, radius, 0, Math.PI * 2);
    }

    public drawEllipse(x: number, y: number, width: number, height: number): void {
        const radiusX: number = width * 0.5;
        const radiusY: number = height * 0.5;
        x += radiusX;
        y += radiusY;
        this.arcToBezier(x, y, radiusX, radiusY, 0, Math.PI * 2);
    }

    public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        if (anticlockwise) {
            if (endAngle >= startAngle) {
                endAngle -= Math.PI * 2;
            }
        } else {
            if (endAngle <= startAngle) {
                endAngle += Math.PI * 2;
            }
        }
        this.arcToBezier(x, y, radius, radius, startAngle, endAngle, anticlockwise);
    }

    public arcToBezier(x: number, y: number, radiusX: number, radiusY: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        const halfPI: number = Math.PI * 0.5;
        let start: number = startAngle;
        let end: number = start;
        if (anticlockwise) {
            end += -halfPI - (start % halfPI);
            if (end < endAngle) {
                end = endAngle;
            }
        } else {
            end += halfPI - (start % halfPI);
            if (end > endAngle) {
                end = endAngle;
            }
        }
        let currentX: number = x + Math.cos(start) * radiusX;
        let currentY: number = y + Math.sin(start) * radiusY;
        if (this.$lastX != currentX || this.$lastY != currentY) {
            this.moveTo(currentX, currentY);
        }
        let u: number = Math.cos(start);
        let v: number = Math.sin(start);
        for (let i: number = 0; i < 4; i++) {
            const addAngle: number = end - start;
            const a: number = 4 * Math.tan(addAngle / 4) / 3;
            const x1: number = currentX - v * a * radiusX;
            const y1: number = currentY + u * a * radiusY;
            u = Math.cos(end);
            v = Math.sin(end);
            currentX = x + u * radiusX;
            currentY = y + v * radiusY;
            const x2: number = currentX + v * a * radiusX;
            const y2: number = currentY - u * a * radiusY;
            this.cubicCurveTo(x1, y1, x2, y2, currentX, currentY);
            if (end === endAngle) {
                break;
            }
            start = end;
            if (anticlockwise) {
                end = start - halfPI;
                if (end < endAngle) {
                    end = endAngle;
                }
            } else {
                end = start + halfPI;
                if (end > endAngle) {
                    end = endAngle;
                }
            }
        }
    }
}
__reflect(Path2D.prototype, "egret.sys.Path2D");

export class DisplayList extends HashObject {
    public static $canvasScaleFactor: number = 1;
    public static $canvasScaleX: number = 1;
    public static $canvasScaleY: number = 1;
    public isStage: boolean = false;
    public $renderNode: BitmapNode = new BitmapNode();
    public renderBuffer: RenderBuffer = null!;
    public offsetX: number = 0;
    public offsetY: number = 0;
    public offsetMatrix: Matrix = new Matrix();
    public $canvasScaleX: number = 1;
    public $canvasScaleY: number = 1;
    public declare bitmapData: BitmapData | undefined;
    public root: DisplayObject;

    public constructor(root: DisplayObject) {
        super();

        this.root = root;
        this.isStage = root instanceof Stage;
    }
    public static create(target: DisplayObject): DisplayList | null {
        const displayList: DisplayList = new DisplayList(target);
        try {
            displayList.renderBuffer = new RenderBuffHelper.RenderBuffer!();
        } catch {
            return null;
        }
        displayList.root = target;
        return displayList;
    }
    public $getRenderNode(): BitmapNode {
        return this.$renderNode;
    }
    public setClipRect(width: number, height: number): void {
        this.renderBuffer.resize(width * DisplayList.$canvasScaleX, height * DisplayList.$canvasScaleY);
    }
    public drawToSurface(): number {
        this.$canvasScaleX = this.offsetMatrix.a = DisplayList.$canvasScaleX;
        this.$canvasScaleY = this.offsetMatrix.d = DisplayList.$canvasScaleY;
        if (!this.isStage) {
            this.changeSurfaceSize();
        }
        const buffer: RenderBuffer = this.renderBuffer;
        buffer.clear();
        const drawCalls: number = RenderBuffHelper.systemRenderer!.render(this.root, buffer, this.offsetMatrix);
        if (!this.isStage) {
            const surface: HTMLCanvasElement = buffer.surface as HTMLCanvasElement;
            const renderNode: BitmapNode = this.$renderNode;
            renderNode.drawData.length = 0;
            const width: number = surface.width;
            const height: number = surface.height;
            if (!this.bitmapData) {
                this.bitmapData = new BitmapData(surface);
            } else {
                this.bitmapData.source = surface;
                this.bitmapData.width = width;
                this.bitmapData.height = height;
            }
            renderNode.image = this.bitmapData;
            renderNode.imageWidth = width;
            renderNode.imageHeight = height;
            renderNode.drawImage(0, 0, width, height, -this.offsetX, -this.offsetY, width / this.$canvasScaleX, height / this.$canvasScaleY);
        }
        return drawCalls;
    }
    public changeSurfaceSize(): void {
        const oldOffsetX: number = this.offsetX;
        const oldOffsetY: number = this.offsetY;
        const bounds: Rectangle = this.root.$getOriginalBounds();
        this.offsetX = -bounds.x;
        this.offsetY = -bounds.y;
        this.offsetMatrix.setTo(this.offsetMatrix.a, 0, 0, this.offsetMatrix.d, this.offsetX, this.offsetY);
        const buffer: RenderBuffer = this.renderBuffer;
        const width: number = Math.max(257, bounds.width * this.$canvasScaleX);
        const height: number = Math.max(257, bounds.height * this.$canvasScaleY);
        if (this.offsetX == oldOffsetX && this.offsetY == oldOffsetY && buffer.surface.width == width && buffer.surface.height == height) {
            return;
        }
        buffer.resize(width, height);
    }
    public static $setCanvasScale(x: number, y: number): void {
        DisplayList.$canvasScaleX = x;
        DisplayList.$canvasScaleY = y;
    }
}
__reflect(DisplayList.prototype, "egret.sys.DisplayList");

export class Player extends HashObject {
    public isPlaying: boolean = false;
    public stage: Stage | null;
    public screenDisplayList: DisplayList;
    public showFPS: boolean = false;
    public showLog: boolean = false;
    public stageDisplayList: DisplayList | null = null;
    public declare root: unknown;
    public entryClass: typeof DisplayObjectContainer;

    public constructor(buffer: RenderBuffer, stage: Stage, entryClass: typeof DisplayObjectContainer) {
        super();
        this.entryClass = entryClass;
        if (!buffer) {
            $error(1003, "buffer");
        }
        this.stage = stage;
        this.screenDisplayList = this.createDisplayList(stage, buffer);
    }
    public createDisplayList(stage: Stage, buffer: RenderBuffer): DisplayList {
        const displayList: DisplayList = new DisplayList(stage);
        displayList.renderBuffer = buffer;
        stage.$displayList = displayList;
        return displayList;
    }
    public start(): void {
        if (this.isPlaying || !this.stage) {
            return;
        }
        TempStageHelper.$TempStage ||= this.stage;
        this.isPlaying = true;
        if (!this.root) {
            this.initialize();
        }
        getTicker().$addPlayer(this);
    }
    public initialize(): void {
        if (this.entryClass) {
            const rootContainer: unknown = new this.entryClass();
            this.root = rootContainer;
            if (rootContainer instanceof DisplayObject) {
                this.stage!.addChild(rootContainer);
            } else {
                $error(1002, this.entryClass);
            }
        } else {
            $error(1001, this.entryClass);
        }
    }
    public stop(): void {
        this.pause();
        this.stage = null;
    }
    public pause(): void {
        if (!this.isPlaying) {
            return;
        }
        this.isPlaying = false;
        getTicker().$removePlayer(this);
    }
    public $render(triggerByFrame: boolean, costTicker: number): void {
        const stage: Stage = this.stage!;
        const t1: number = getTimer();
        const drawCalls: number = stage.$displayList!.drawToSurface();
        const t2: number = getTimer();
        if (triggerByFrame && this.showFPS) {
            LoggerHelper.fpsDisplay!.update(drawCalls, t2 - t1, costTicker);
        }
    }
    public updateStageSize(stageWidth: number, stageHeight: number): void {
        const stage: Stage = this.stage!;
        stage.$stageWidth = stageWidth;
        stage.$stageHeight = stageHeight;
        {
            this.screenDisplayList.setClipRect(stageWidth, stageHeight);
            if (this.stageDisplayList) {
                this.stageDisplayList.setClipRect(stageWidth, stageHeight);
            }
        }
        stage.dispatchEventWith(Event.RESIZE);
    }
    public displayFPS(showFPS: boolean, showLog: boolean, logFilter: string, styles: FPSStyles): void {
        showLog = !!showLog;
        runtime.web.WebMiscHelper.isShowLog = showLog;

        this.showFPS = !!showFPS;
        this.showLog = showLog;
        if (!LoggerHelper.fpsDisplay) {
            LoggerHelper.fpsDisplay = new (getFps())(this.stage!, showFPS, showLog, logFilter, styles);
            for (let i: number = 0, length: number = LoggerHelper.logLines!.length; i < length; i++) {
                LoggerHelper.fpsDisplay.updateInfo(LoggerHelper.logLines![i]!);
            }
            LoggerHelper.logLines = null;
            for (let i: number = 0, length: number = LoggerHelper.warnLines!.length; i < length; i++) {
                LoggerHelper.fpsDisplay.updateWarn(LoggerHelper.warnLines![i]!);
            }
            LoggerHelper.warnLines = null;
            for (let i: number = 0, length: number = LoggerHelper.errorLines!.length; i < length; i++) {
                LoggerHelper.fpsDisplay.updateError(LoggerHelper.errorLines![i]!);
            }
            LoggerHelper.errorLines = null;
        }
    }
}
__reflect(Player.prototype, "egret.sys.Player");

export class FPSImpl {
    public infoLines: string[] = [];
    public totalTime: number = 0;
    public totalTick: number = 0;
    public lastTime: number = 0;
    public drawCalls: number = 0;
    public costRender: number = 0;
    public costTicker: number = 0;
    public fpsDisplay: FPSDisplay;
    public filter: (message: string) => boolean;
    public _stage: Stage;
    public showFPS: boolean;
    public showLog: boolean;
    public logFilter: string;
    public styles: FPSStyles;

    public constructor(_stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: FPSStyles) {
        this._stage = _stage;
        this.showFPS = showFPS;
        this.showLog = showLog;
        this.logFilter = logFilter;
        this.styles = styles;

        this.fpsDisplay = new (getFpsDisplay())(_stage, showFPS, showLog, logFilter, styles);
        let logFilterRegExp: RegExp | null | undefined;
        try {
            logFilterRegExp = logFilter ? new RegExp(logFilter) : null;
        } catch (e: unknown) {
            log(e);
        }
        this.filter = (message: string): boolean => logFilterRegExp ? logFilterRegExp.test(message) : !logFilter || message.indexOf(logFilter) == 0;
    }
    public update(drawCalls: number, costRender: number, costTicker: number): void {
        const current: number = getTimer();
        this.totalTime += current - this.lastTime;
        this.lastTime = current;
        this.totalTick++;
        this.drawCalls += drawCalls;
        this.costRender += costRender;
        this.costTicker += costTicker;
        if (this.totalTime >= 1000) {
            this.fpsDisplay.update({
                fps : Math.min(Math.ceil(this.totalTick * 1000 / this.totalTime), getTicker().$frameRate), draw : Math.round(this.drawCalls / this.totalTick), costRender : Math.round(this.costRender / this.totalTick), costTicker : Math.round(this.costTicker / this.totalTick),
            });
            this.totalTick = 0;
            this.totalTime %= 1000;
            this.drawCalls = this.costRender = this.costTicker = 0;
        }
    }
    public updateInfo(info: string): void {
        if (info && this.showLog && this.filter(info)) {
            this.fpsDisplay.updateInfo(info);
        }
    }
    public updateWarn(info: string): void {
        if (!info || !this.showLog || !this.filter(info)) {
            return;
        }
        if (this.fpsDisplay.updateWarn) {
            this.fpsDisplay.updateWarn(info);
        } else {
            this.fpsDisplay.updateInfo("[Warning]" + info);
        }
    }
    public updateError(info: string): void {
        if (!info || !this.showLog || !this.filter(info)) {
            return;
        }
        if (this.fpsDisplay.updateError) {
            this.fpsDisplay.updateError(info);
        } else {
            this.fpsDisplay.updateInfo("[Error]" + info);
        }
    }
}
__reflect(FPSImpl.prototype, "FPSImpl");

export class DefaultScreenAdapter extends HashObject implements IScreenAdapter {
    public calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): StageSize {
        let displayWidth: number = screenWidth;
        let displayHeight: number = screenHeight;
        let stageWidth: number = contentWidth;
        let stageHeight: number = contentHeight;
        const scaleX: number = screenWidth / stageWidth || 0;
        const scaleY: number = screenHeight / stageHeight || 0;
        switch (scaleMode) {
            case StageScaleMode.EXACT_FIT: break;
            case StageScaleMode.FIXED_HEIGHT: stageWidth = Math.round(screenWidth / scaleY);
                break;
            case StageScaleMode.FIXED_WIDTH: stageHeight = Math.round(screenHeight / scaleX);
                break;
            case StageScaleMode.NO_BORDER:
                if (scaleX > scaleY) {
                    displayHeight = Math.round(stageHeight * scaleX);
                } else {
                    displayWidth = Math.round(stageWidth * scaleY);
                }
                break;
            case StageScaleMode.SHOW_ALL:
                if (scaleX > scaleY) {
                    displayWidth = Math.round(stageWidth * scaleY);
                } else {
                    displayHeight = Math.round(stageHeight * scaleX);
                }
                break;
            case StageScaleMode.FIXED_NARROW:
                if (scaleX > scaleY) {
                    stageWidth = Math.round(screenWidth / scaleY);
                } else {
                    stageHeight = Math.round(screenHeight / scaleX);
                }
                break;
            case StageScaleMode.FIXED_WIDE:
                if (scaleX > scaleY) {
                    stageHeight = Math.round(screenHeight / scaleX);
                } else {
                    stageWidth = Math.round(screenWidth / scaleY);
                }
                break;
            default: stageWidth = screenWidth;
                stageHeight = screenHeight;
                break;
        }
        if (Capabilities.runtimeType != RuntimeType.WXGAME) {
            if (stageWidth % 2 != 0) {
                stageWidth++;
            }
            if (stageHeight % 2 != 0) {
                stageHeight++;
            }
            if (displayWidth % 2 != 0) {
                displayWidth++;
            }
            if (displayHeight % 2 != 0) {
                displayHeight++;
            }
        }
        return {
            stageWidth, stageHeight, displayWidth, displayHeight,
        };
    }
}
__reflect(DefaultScreenAdapter.prototype, "egret.sys.DefaultScreenAdapter", ["egret.sys.IScreenAdapter"]);

export class SystemTicker {
    private static _instance: SystemTicker | null = null;
    public playerList: Player[] = [];
    public callBackList: TickCallback[] = [];
    public thisObjectList: unknown[] = [];
    public $frameRate: number = 30;
    public lastTimeStamp: number = 0;
    public costEnterFrame: number = 0;
    public isPaused: boolean = false;
    public frameDeltaTime: number;
    public lastCount: number;
    public frameInterval: number;

    private readonly setIntervalCache: Record<string, IntervalEntry> = {};
    private setIntervalIndex: number = 0;
    private setIntervalCount: number = 0;
    private intervalLastTime: number = 0;
    private readonly setTimeoutCache: Record<string, TimeoutEntry> = {};
    private setTimeoutIndex: number = 0;
    private setTimeoutCount: number = 0;
    private timeoutLastTime: number = 0;

    public static get instance(): SystemTicker {
        return SystemTicker._instance ??= new SystemTicker();
    }
    private constructor() {
        if (SystemTicker._instance) {
            $error(1008, "egret.sys.SystemTicker");
        }
        StartTimeHelper.$START_TIME = Date.now();
        this.frameDeltaTime = 1000 / this.$frameRate;
        this.lastCount = this.frameInterval = Math.round(60000 / this.$frameRate);
    }
    public $addPlayer(player: Player): void {
        if (this.playerList.indexOf(player) != -1) {
            return;
        }
        GlobalHelper.egret_stages.push(player.stage!);
        this.playerList = this.playerList.concat();
        this.playerList.push(player);
    }
    public $removePlayer(player: Player): void {
        const index: number = this.playerList.indexOf(player);
        if (index !== -1) {
            const i: number = GlobalHelper.egret_stages.indexOf(player.stage!);
            GlobalHelper.egret_stages.splice(i, 1);
            this.playerList = this.playerList.concat();
            this.playerList.splice(index, 1);
        }
    }
    public $startTick(callBack: TickCallback, thisObject: unknown): void {
        if (this.getTickIndex(callBack, thisObject) != -1) {
            return;
        }
        this.concatTick();
        this.callBackList.push(callBack);
        this.thisObjectList.push(thisObject);
    }
    public $stopTick(callBack: TickCallback, thisObject: unknown): void {
        const index: number = this.getTickIndex(callBack, thisObject);
        if (index == -1) {
            return;
        }
        this.concatTick();
        this.callBackList.splice(index, 1);
        this.thisObjectList.splice(index, 1);
    }
    public getTickIndex(callBack: TickCallback, thisObject: unknown): number {
        for (let i: number = this.callBackList.length - 1; i >= 0; i--) {
            if (this.callBackList[i] == callBack && this.thisObjectList[i] == thisObject) {
                return i;
            }
        }
        return -1;
    }
    public concatTick(): void {
        this.callBackList = this.callBackList.concat();
        this.thisObjectList = this.thisObjectList.concat();
    }
    public $setFrameRate(value: number): boolean {
        if (value <= 0 || this.$frameRate == value) {
            return false;
        }
        this.$frameRate = value;
        if (value > 60) {
            value = 60;
        }
        this.frameDeltaTime = 1000 / value;
        this.lastCount = this.frameInterval = Math.round(60000 / value);
        return true;
    }
    public pause(): void {
        this.isPaused = true;
    }
    public resume(): void {
        this.isPaused = false;
    }
    public update(forceUpdate?: boolean): void {
        const t1: number = getTimer();
        const callBackList: TickCallback[] = this.callBackList;
        const thisObjectList: unknown[] = this.thisObjectList;
        const length: number = callBackList.length;
        let requestRenderingFlag: boolean = RenderHelper.$requestRenderingFlag;
        const timeStamp: number = getTimer();
        const contexts: LifecycleContext[] = LifecycleHelper.contexts;
        for (let i: number = 0; i < contexts.length; i++) {
            const c: LifecycleContext = contexts[i]!;
            if (c.onUpdate) {
                c.onUpdate();
            }
        }
        if (this.isPaused) {
            this.lastTimeStamp = timeStamp;
            return;
        }
        this.callLaterAsyncs();
        for (let i: number = 0; i < length; i++) {
            if (callBackList[i]!.call(thisObjectList[i], timeStamp)) {
                requestRenderingFlag = true;
            }
        }
        const t2: number = getTimer();
        const deltaTime: number = timeStamp - this.lastTimeStamp;
        this.lastTimeStamp = timeStamp;
        if (deltaTime >= this.frameDeltaTime || forceUpdate) {
            this.lastCount = this.frameInterval;
        } else {
            this.lastCount -= 1000;
            if (this.lastCount > 0) {
                if (requestRenderingFlag) {
                    this.render(false, this.costEnterFrame + t2 - t1);
                }
                return;
            }
            this.lastCount += this.frameInterval;
        }
        this.render(true, this.costEnterFrame + t2 - t1);
        const t3: number = getTimer();
        this.broadcastEnterFrame();
        const t4: number = getTimer();
        this.costEnterFrame = t4 - t3;
    }
    public render(triggerByFrame: boolean, costTicker: number): void {
        const playerList: Player[] = this.playerList;
        const length: number = playerList.length;
        if (length == 0) {
            return;
        }
        this.callLaters();
        if (RenderHelper.$invalidateRenderFlag) {
            this.broadcastRender();
            RenderHelper.$invalidateRenderFlag = false;
        }
        for (let i: number = 0; i < length; i++) {
 playerList[i]!.$render(triggerByFrame, costTicker);
        }
        RenderHelper.$requestRenderingFlag = false;
    }
    public broadcastEnterFrame(): void {
        const list: DisplayObject[] = DisplayObject.$enterFrameCallBackList.concat();
        for (let i: number = 0; i < list.length; i++) {
 list[i]!.dispatchEventWith(Event.ENTER_FRAME);
        }
    }
    public broadcastRender(): void {
        const list: DisplayObject[] = DisplayObject.$renderCallBackList.concat();
        for (let i: number = 0; i < list.length; i++) {
 list[i]!.dispatchEventWith(Event.RENDER);
        }
    }
    public callLaters(): void {
        if (CallHelper.$callLaterFunctionList.length == 0) {
            return;
        }
        const functionList: (DeferredCallback | null)[] = CallHelper.$callLaterFunctionList;
        const thisList: unknown[] = CallHelper.$callLaterThisList;
        const argsList: unknown[][] = CallHelper.$callLaterArgsList;
        CallHelper.$callLaterFunctionList = [];
        CallHelper.$callLaterThisList = [];
        CallHelper.$callLaterArgsList = [];
        for (let i: number = 0; i < functionList.length; i++) {
            const func: DeferredCallback | null | undefined = functionList[i];
            if (func != null) {
                func.apply(thisList[i], argsList[i]!);
            }
        }
    }
    public callLaterAsyncs(): void {
        if (CallHelper.$callAsyncFunctionList.length == 0) {
            return;
        }
        const functionList: (DeferredCallback | null)[] = CallHelper.$callAsyncFunctionList;
        const thisList: unknown[] = CallHelper.$callAsyncThisList;
        const argsList: unknown[][] = CallHelper.$callAsyncArgsList;
        CallHelper.$callAsyncFunctionList = [];
        CallHelper.$callAsyncThisList = [];
        CallHelper.$callAsyncArgsList = [];
        for (let i: number = 0; i < functionList.length; i++) {
            const func: DeferredCallback | null | undefined = functionList[i];
            if (func != null) {
                func.apply(thisList[i], argsList[i]!);
            }
        }
    }

    public setInterval<TThis, TArgs extends unknown[], TResult>(
        listener: (this: TThis, ...args: TArgs) => TResult, thisObject: TThis, delay: number, ...args: TArgs
    ): number {
        const data: IntervalEntry = {
            delay       : delay,
            originDelay : delay,
            execute     : (): void => {
                listener.apply(thisObject, args);
            },
        };
        this.setIntervalCount++;
        if (this.setIntervalCount == 1) {
            this.intervalLastTime = getTimer();
            this.$startTick(this.intervalUpdate, this);
        }
        this.setIntervalIndex++;
        this.setIntervalCache[this.setIntervalIndex] = data;
        return this.setIntervalIndex;
    }
    public clearInterval(key: number): void {
        if (this.setIntervalCache[key]) {
            this.setIntervalCount--;
            delete this.setIntervalCache[key];
            if (this.setIntervalCount == 0) {
                this.$stopTick(this.intervalUpdate, this);
            }
        }
    }
    private intervalUpdate(timeStamp: number): boolean {
        const dt: number = timeStamp - this.intervalLastTime;
        this.intervalLastTime = timeStamp;
        let key: string;
        for (key in this.setIntervalCache) {
            const data: IntervalEntry = this.setIntervalCache[key]!;
            data.delay -= dt;
            if (data.delay <= 0) {
                data.delay = data.originDelay;
                data.execute();
            }
        }
        return false;
    }

    public setTimeout<TThis, TArgs extends unknown[], TResult>(
        listener: (this: TThis, ...args: TArgs) => TResult, thisObject: TThis, delay: number, ...args: TArgs
    ): number {
        const data: TimeoutEntry = {
            delay   : delay,
            execute : (): void => {
                listener.apply(thisObject, args);
            },
        };
        this.setTimeoutCount++;
        if (this.setTimeoutCount == 1) {
            this.timeoutLastTime = getTimer();
            this.$startTick(this.timeoutUpdate, this);
        }
        this.setTimeoutIndex++;
        this.setTimeoutCache[this.setTimeoutIndex] = data;
        return this.setTimeoutIndex;
    }
    public clearTimeout(key: number): void {
        if (this.setTimeoutCache[key]) {
            this.setTimeoutCount--;
            delete this.setTimeoutCache[key];
            if (this.setTimeoutCount == 0) {
                this.$stopTick(this.timeoutUpdate, this);
            }
        }
    }
    private timeoutUpdate(timeStamp: number): boolean {
        const dt: number = timeStamp - this.timeoutLastTime;
        this.timeoutLastTime = timeStamp;
        let key: string;
        for (key in this.setTimeoutCache) {
            const data: TimeoutEntry = this.setTimeoutCache[key]!;
            data.delay -= dt;
            if (data.delay <= 0) {
                this.clearTimeout(Number(key));
                data.execute();
            }
        }
        return false;
    }
}
__reflect(SystemTicker.prototype, "egret.sys.SystemTicker");

export class TouchHandler extends HashObject {
    public maxTouches: number = 0;
    public useTouchesCount: number = 0;
    public touchDownTarget: Partial<Record<number, DisplayObject>> = {};
    public lastTouchX: number = -1;
    public lastTouchY: number = -1;
    public stage: Stage;

    public constructor(stage: Stage) {
        super();
        this.stage = stage;
    }
    public $initMaxTouches(): void {
        this.maxTouches = this.stage.$maxTouches;
    }
    public onTouchBegin(x: number, y: number, touchPointID: number): void {
        if (this.useTouchesCount >= this.maxTouches) {
            return;
        }
        this.lastTouchX = x;
        this.lastTouchY = y;
        const target: DisplayObject = this.findTarget(x, y);
        if (this.touchDownTarget[touchPointID] == null) {
            this.touchDownTarget[touchPointID] = target;
            this.useTouchesCount++;
        }
        TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_BEGIN, true, true, x, y, touchPointID, true);
    }
    public onTouchMove(x: number, y: number, touchPointID: number): void {
        if (this.touchDownTarget[touchPointID] == null || (this.lastTouchX == x && this.lastTouchY == y)) {
            return;
        }
        this.lastTouchX = x;
        this.lastTouchY = y;
        const target: DisplayObject = this.findTarget(x, y);
        TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_MOVE, true, true, x, y, touchPointID, true);
    }
    public onTouchEnd(x: number, y: number, touchPointID: number): void {
        const oldTarget: DisplayObject | undefined = this.touchDownTarget[touchPointID];
        if (oldTarget == null) {
            return;
        }
        const target: DisplayObject = this.findTarget(x, y);
        delete this.touchDownTarget[touchPointID];
        this.useTouchesCount--;
        TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_END, true, true, x, y, touchPointID, false);
        if (oldTarget == target) {
            TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_TAP, true, true, x, y, touchPointID, false);
        } else {
            TouchEvent.dispatchTouchEvent(oldTarget, TouchEvent.TOUCH_RELEASE_OUTSIDE, true, true, x, y, touchPointID, false);
        }
    }
    public findTarget(stageX: number, stageY: number): DisplayObject {
        return this.stage.$hitTest(stageX, stageY) || this.stage;
    }
}
__reflect(TouchHandler.prototype, "egret.sys.TouchHandler");

export class BitmapNode extends RenderNode<number> implements BitmapDrawNode {
    public image: BitmapData | null = null;
    public smoothing: boolean = true;
    public blendMode: number | null = null;
    public alpha: number = NaN;
    public filter: ColorMatrixFilter | null = null;
    public rotated: boolean = false;
    public matrix: Matrix | null = null;
    public declare imageWidth: number;
    public declare imageHeight: number;
    public constructor() {
        super();
        this.type = 1;
    }
    public drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void {
        this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
        this.renderCount++;
    }
    public override cleanBeforeRender(): void {
        super.cleanBeforeRender();
        this.image = null;
        this.matrix = null;
        this.blendMode = null;
        this.alpha = NaN;
        this.filter = null;
    }
    public static $updateTextureData(node: BitmapDrawNode, image: BitmapData | null, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number, fillMode: string, smoothing: boolean): void {
        if (!image) {
            return;
        }
        const scale: number = Texture.$TextureScaleFactor;
        node.smoothing = smoothing;
        node.image = image;
        node.imageWidth = sourceWidth;
        node.imageHeight = sourceHeight;
        if (fillMode == BitmapFillMode.SCALE) {
            const tsX: number = destW / textureWidth * scale;
            const tsY: number = destH / textureHeight * scale;
            node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, tsX * offsetX, tsY * offsetY, tsX * bitmapWidth, tsY * bitmapHeight);
        } else if (fillMode == BitmapFillMode.CLIP) {
            const displayW: number = Math.min(textureWidth, destW);
            const displayH: number = Math.min(textureHeight, destH);
            BitmapNode.drawClipImage(node, scale, bitmapX, bitmapY, bitmapWidth * scale, bitmapHeight * scale, offsetX, offsetY, displayW, displayH);
        } else {
            const scaledBitmapW: number = bitmapWidth * scale;
            const scaledBitmapH: number = bitmapHeight * scale;
            for (let startX: number = 0; startX < destW; startX += textureWidth) {
                for (let startY: number = 0; startY < destH; startY += textureHeight) {
                    const displayW: number = Math.min(destW - startX, textureWidth);
                    const displayH: number = Math.min(destH - startY, textureHeight);
                    BitmapNode.drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH, offsetX, offsetY, displayW, displayH, startX, startY);
                }
            }
        }
    }
    public static $updateTextureDataWithScale9Grid(node: BitmapDrawNode, image: BitmapData | null, scale9Grid: Rectangle, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number, smoothing: boolean): void {
        node.smoothing = smoothing;
        node.image = image;
        node.imageWidth = sourceWidth;
        node.imageHeight = sourceHeight;
        const scale: number = Texture.$TextureScaleFactor;
        destW -= textureWidth - bitmapWidth * scale;
        destH -= textureHeight - bitmapHeight * scale;
        const targetW0: number = scale9Grid.x - offsetX;
        const targetH0: number = scale9Grid.y - offsetY;
        let sourceW0: number = targetW0 / scale;
        let sourceH0: number = targetH0 / scale;
        let sourceW1: number = scale9Grid.width / scale;
        let sourceH1: number = scale9Grid.height / scale;
        if (sourceH1 == 0) {
            sourceH1 = 1;
            if (sourceH0 >= bitmapHeight) {
                sourceH0--;
            }
        }
        if (sourceW1 == 0) {
            sourceW1 = 1;
            if (sourceW0 >= bitmapWidth) {
                sourceW0--;
            }
        }
        const sourceX0: number = bitmapX;
        const sourceX1: number = sourceX0 + sourceW0;
        const sourceX2: number = sourceX1 + sourceW1;
        const sourceW2: number = bitmapWidth - sourceW0 - sourceW1;
        const sourceY0: number = bitmapY;
        const sourceY1: number = sourceY0 + sourceH0;
        const sourceY2: number = sourceY1 + sourceH1;
        const sourceH2: number = bitmapHeight - sourceH0 - sourceH1;
        const targetW2: number = sourceW2 * scale;
        const targetH2: number = sourceH2 * scale;
        if ((sourceW0 + sourceW2) * scale > destW || (sourceH0 + sourceH2) * scale > destH) {
            node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
            return;
        }
        const targetX0: number = offsetX;
        const targetX1: number = targetX0 + targetW0;
        const targetX2: number = targetX0 + destW - targetW2;
        const targetW1: number = destW - targetW0 - targetW2;
        const targetY0: number = offsetY;
        const targetY1: number = targetY0 + targetH0;
        const targetY2: number = targetY0 + destH - targetH2;
        const targetH1: number = destH - targetH0 - targetH2;
        if (sourceH0 > 0) {
            if (sourceW0 > 0) {
                node.drawImage(sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
            }
            if (sourceW1 > 0) {
                node.drawImage(sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
            }
            if (sourceW2 > 0) {
                node.drawImage(sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
            }
        }
        if (sourceH1 > 0) {
            if (sourceW0 > 0) {
                node.drawImage(sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
            }
            if (sourceW1 > 0) {
                node.drawImage(sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
            }
            if (sourceW2 > 0) {
                node.drawImage(sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
            }
        }
        if (sourceH2 > 0) {
            if (sourceW0 > 0) {
                node.drawImage(sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
            }
            if (sourceW1 > 0) {
                node.drawImage(sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
            }
            if (sourceW2 > 0) {
                node.drawImage(sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
            }
        }
    }
    public static drawClipImage(node: BitmapDrawNode, scale: number, bitmapX: number, bitmapY: number, scaledBitmapW: number, scaledBitmapH: number, offsetX: number, offsetY: number, destW: number, destH: number, startX: number = 0, startY: number = 0): void {
        let offset: number = offsetX + scaledBitmapW - destW;
        if (offset > 0) {
            scaledBitmapW -= offset;
        }
        offset = offsetY + scaledBitmapH - destH;
        if (offset > 0) {
            scaledBitmapH -= offset;
        }
        node.drawImage(bitmapX, bitmapY, scaledBitmapW / scale, scaledBitmapH / scale, startX + offsetX, startY + offsetY, scaledBitmapW, scaledBitmapH);
    }
}
__reflect(BitmapNode.prototype, "egret.sys.BitmapNode");

export class NormalBitmapNode extends RenderNode<number> implements BitmapDrawNode {
    public image: BitmapData | null = null;
    public smoothing: boolean = true;
    public rotated: boolean = false;
    public declare imageWidth: number;
    public declare imageHeight: number;
    public declare sourceX: number;
    public declare sourceY: number;
    public declare sourceW: number;
    public declare sourceH: number;
    public declare drawX: number;
    public declare drawY: number;
    public declare drawW: number;
    public declare drawH: number;
    public constructor() {
        super();
        this.type = 6;
    }
    public drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void {
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.sourceW = sourceW;
        this.sourceH = sourceH;
        this.drawX = drawX;
        this.drawY = drawY;
        this.drawW = drawW;
        this.drawH = drawH;
        this.renderCount = 1;
    }
    public override cleanBeforeRender(): void {
        super.cleanBeforeRender();
        this.image = null;
    }
}
__reflect(NormalBitmapNode.prototype, "egret.sys.NormalBitmapNode");

export class MeshNode extends RenderNode<number> {
    public image: BitmapData | null = null;
    public smoothing: boolean = true;
    public bounds: Rectangle = new Rectangle();
    public blendMode: number | null = null;
    public alpha: number = NaN;
    public filter: ColorMatrixFilter | null = null;
    public rotated: boolean = false;
    public vertices: number[] = [];
    public uvs: number[] = [];
    public indices: number[] = [];
    public matrix: Matrix | null = null;
    public declare imageWidth: number;
    public declare imageHeight: number;
    public constructor() {
        super();
        this.type = 5;
    }
    public drawMesh(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void {
        this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
        this.renderCount++;
    }
    public override cleanBeforeRender(): void {
        super.cleanBeforeRender();
        this.image = null;
        this.matrix = null;
    }
}
__reflect(MeshNode.prototype, "egret.sys.MeshNode");

export class GroupNode extends RenderNode<RenderNode> {
    public matrix: Matrix | null = null;
    public constructor() {
        super();
        this.type = 4;
    }
    public addNode(node: RenderNode): void {
        this.drawData.push(node);
    }
    public override cleanBeforeRender(): void {
        for (let i: number = this.drawData.length - 1; i >= 0; i--) {
 this.drawData[i]!.cleanBeforeRender();
        }
    }
    public override $getRenderCount(): number {
        let result: number = 0;
        for (let i: number = this.drawData.length - 1; i >= 0; i--) {
            result += this.drawData[i]!.$getRenderCount();
        }
        return result;
    }
}
__reflect(GroupNode.prototype, "egret.sys.GroupNode");

export class FillPath extends Path2D {
    public declare fillColor: number;
    public declare fillAlpha: number;
    public constructor() {
        super();
        this.type = 1;
    }
}
__reflect(FillPath.prototype, "egret.sys.FillPath");

export class GradientFillPath extends Path2D {
    public declare gradientType: GradientTypeValue;
    public declare colors: number[];
    public declare alphas: number[];
    public declare ratios: number[];
    public declare matrix: Matrix;
    public constructor() {
        super();
        this.type = 2;
    }
}
__reflect(GradientFillPath.prototype, "egret.sys.GradientFillPath");

export class StrokePath extends Path2D {
    public declare lineWidth: number;
    public declare lineColor: number;
    public declare lineAlpha: number;
    public declare caps: CapsStyleValue;
    public declare joints: JointStyleValue;
    public declare miterLimit: number;
    public declare lineDash: number[];
    public constructor() {
        super();
        this.type = 3;
    }
}
__reflect(StrokePath.prototype, "egret.sys.StrokePath");

export class GraphicsNode extends RenderNode<Path2D> {
    public declare $canvasScaleX: number;

    public declare $canvasScaleY: number;

    public declare $textureWidth: number;

    public declare $textureHeight: number;

    public dirtyRender: boolean = true;
    public declare x: number;
    public declare y: number;
    public declare width: number;
    public declare height: number;
    public declare $texture: EngineWebGLTexture | null | undefined;
    public constructor() {
        super();
        this.type = 3;
    }
    public beginFill(color: number, alpha: number = 1, beforePath?: Path2D | null): FillPath {
        const path: FillPath = new FillPath();
        path.fillColor = color;
        path.fillAlpha = alpha;
        if (beforePath) {
            this.drawData.splice(this.drawData.lastIndexOf(beforePath), 0, path);
        } else {
            this.drawData.push(path);
        }
        this.renderCount++;
        return path;
    }
    public beginGradientFill(type: GradientTypeValue, colors: number[], alphas: number[], ratios: number[], matrix?: Matrix | null, beforePath?: Path2D | null): GradientFillPath {
        const m: Matrix = new Matrix();
        if (matrix) {
            m.a = matrix.a * 819.2;
            m.b = matrix.b * 819.2;
            m.c = matrix.c * 819.2;
            m.d = matrix.d * 819.2;
            m.tx = matrix.tx;
            m.ty = matrix.ty;
        } else {
            m.a = 100;
            m.d = 100;
        }
        const path: GradientFillPath = new GradientFillPath();
        path.gradientType = type;
        path.colors = colors;
        path.alphas = alphas;
        path.ratios = ratios;
        path.matrix = m;
        if (beforePath) {
            this.drawData.splice(this.drawData.lastIndexOf(beforePath), 0, path);
        } else {
            this.drawData.push(path);
        }
        this.renderCount++;
        return path;
    }
    public lineStyle(thickness: number, color: number, alpha: number = 1, caps: CapsStyleValue | null = null, joints: JointStyleValue | null = null, miterLimit: number = 3, lineDash: number[] = []): StrokePath {
        if (caps !== "none" && caps !== "round" && caps !== "square") {
            caps = "round";
        }
        if (joints !== "bevel" && joints !== "miter" && joints !== "round") {
            joints = "round";
        }
        const path: StrokePath = new StrokePath();
        path.lineWidth = thickness;
        path.lineColor = color;
        path.lineAlpha = alpha;
        path.caps = caps || CapsStyle.ROUND;
        path.joints = joints;
        path.miterLimit = miterLimit;
        path.lineDash = lineDash;
        this.drawData.push(path);
        this.renderCount++;
        return path;
    }
    public clear(): void {
        this.drawData.length = 0;
        this.dirtyRender = true;
        this.renderCount = 0;
    }
    public override cleanBeforeRender(): void { }
    public clean(): void {
        if (this.$texture) {
            WebGLUtils.deleteWebGLTexture(this.$texture);
            this.$texture = null;
            this.dirtyRender = true;
        }
    }
}
__reflect(GraphicsNode.prototype, "egret.sys.GraphicsNode");

export class TextNode extends RenderNode<number | string | ITextStyle> {
    public declare $canvasScaleX: number;

    public declare $canvasScaleY: number;

    public declare $textureWidth: number;

    public declare $textureHeight: number;

    public declare DrawLabel?: DrawLabel[];

    public declare x: number;
    public declare y: number;
    public declare width: number;
    public declare height: number;
    public textColor: number = 0xFFFFFF;
    public strokeColor: number = 0;
    public size: number = 30;
    public stroke: number = 0;
    public bold: boolean = false;
    public italic: boolean = false;
    public fontFamily: string = "Arial";
    public dirtyRender: boolean = true;
    public declare $texture: EngineWebGLTexture | null | undefined;
    public constructor() {
        super();
        this.type = 2;
    }
    public drawText(x: number, y: number, text: string, format: ITextStyle): void {
        this.drawData.push(x, y, text, format);
        this.renderCount++;
        this.dirtyRender = true;
    }
    public clean(): void {
        if (this.$texture) {
            WebGLUtils.deleteWebGLTexture(this.$texture);
            this.$texture = null;
            this.dirtyRender = true;
        }
    }
    public override cleanBeforeRender(): void {
        super.cleanBeforeRender();
        this.dirtyRender = true;
    }
}
__reflect(TextNode.prototype, "egret.sys.TextNode");
