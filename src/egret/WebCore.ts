import {
    BitmapData,
    type EngineWebGLTexture,
    Filter,
    type BitmapDataSource,
    DisplayObject,
    Stage,
    Capabilities,
    RuntimeType,
    WebGLUtils,
    CanvasRenderer,
    type Video,
    type ImageLoader,
    Rectangle,
    __reflect,
    EventDispatcher,
    IOErrorEvent,
    type InputTextField,
    TextField,
    Point,
    toColorString,
    TextFieldUtils,
    HashObject,
    type FPSDisplay,
    type FPSStyles,
    type FPSMetrics,
    type StageScreen,
    StageOrientationEvent,
    StageScaleMode,
    OrientationMode,
    Matrix,
    CompressedTextureData,
    CustomFilter,
    BlurFilter,
    type ITextStyle,
    NumberUtils,
    type SocketCallback,
    type SocketDataCallback,
    type SocketSendData,
    getTicker,
    stopTick,
    startTick,
    Event,
    ProgressEvent,
    $warn,
    $callAsync,
    $error,
    DefinitionHelper,
    LocaleStringsHelper,
    getFontString,
    getImageLoader,
    log,
    warn,
    type StageText,
    DisplayObjectContainer,
} from "./EgretCore";
import {
    type CanvasContext,
    type IScreenAdapter,
    RenderBuffHelper,
    RenderHelper,
    DisplayList,
    SystemTicker,
    ScreenAdapterHelper,
    DefaultScreenAdapter,
    createCanvas,
    BitmapNode,
    type CanvasRenderBuffer as sysCanvasRenderBuffer,
    createCanvasRenderBufferSurface,
    resizeCanvasRenderBuffer,
    TouchHandler,
    Player,
    type RenderBuffer,
    type StageSize,
    _createTexture,
    mainCanvas,
    resizeContext,
    getContextWebGL,
    createTexture,
    getContext2d,
    drawTextureElements,
    type SystemRenderer,
    RenderNode,
    TextNode,
    GraphicsNode,
    GroupNode,
    MeshNode,
    NormalBitmapNode,
    measureText,
} from "./SysCore";
import {
    LifecycleContext,
    LifecycleHelper,
    addLifecycleListener,
} from "./Lifecycle";

export type InputElement = HTMLInputElement | (HTMLTextAreaElement & { type: string });
export type DrawCommandType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type MeshArray = ArrayLike<number>;
export type UniformInput = number | UniformVector2 | UniformVector3 | UniformVector4 | ArrayLike<number>;
export type UniformValue = number | number[] | Float32Array;
type FullscreenMethod = (this: HTMLVideoElement) => void | Promise<void>;
type BufferSurface = HTMLCanvasElement | WebGLRenderTarget;
type TextureCanvas = HTMLCanvasElement & Partial<BitmapData> & { isCanvas?: boolean };
type ResponseValue = string | ArrayBuffer | Blob | Document | null;
type StyleMap = CSSStyleDeclaration & Record<string, string>;
type SmoothingKey = "webkitImageSmoothingEnabled" | "mozImageSmoothingEnabled" | "msImageSmoothingEnabled";

export interface LegacyWindow extends Window {
    XMLHttpRequest?: typeof XMLHttpRequest;
    ActiveXObject?: new (name: string) => XMLHttpRequest;
    webkitURL?: typeof URL;
    convertResponseBodyToText(binary: unknown): string;
    IEBinaryToArray_ByteStr(binary: unknown): string;
    IEBinaryToArray_ByteStr_Last(binary: unknown): string;
    webkitAudioContext?: new () => LegacyAudioContext;
    mozAudioContext?: new () => LegacyAudioContext;
    browser?: QQBrowser;
    webkitRequestAnimationFrame?: typeof requestAnimationFrame;
    mozRequestAnimationFrame?: typeof requestAnimationFrame;
    oRequestAnimationFrame?: typeof requestAnimationFrame;
    msRequestAnimationFrame?: typeof requestAnimationFrame;
}
export interface InputCanvas extends HTMLCanvasElement {
    userTyping?: boolean;
}
export interface TextureDrawData {
    texture: WebGLTexture | null;
    count: number;
}
export interface PremultipliedTexture extends EngineWebGLTexture {
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: boolean;
}
export interface RunEgretOptions {
    renderMode?: string;
    antialias?: boolean;
    audioType?: number;
    canvasScaleFactor?: number;
    calculateCanvasScaleFactor?: (context: CanvasContext) => number;
    screenAdapter?: IScreenAdapter;
    entryClass: typeof DisplayObjectContainer;
}
export interface PlayerOptions {
    entryClass: typeof DisplayObjectContainer;
    scaleMode: string;
    frameRate: number;
    contentWidth: number;
    contentHeight: number;
    orientation: string;
    maxTouches: number;
    textureScaleFactor: number;
    showFPS: boolean;
    fpsStyles: Record<string, string | undefined>;
    showLog: boolean;
    logFilter: string | null;
}
export interface WebGLDrawData extends TextureDrawData {
    type: DrawCommandType;
    texture: EngineWebGLTexture | null;
    filter: Filter | null | undefined;
    textureWidth: number | undefined;
    textureHeight: number | undefined;
    smoothing: boolean;
    value: string;
    buffer: WebGLRenderBuffer | null;
    width: number;
    height: number;
    x: number;
    y: number;
}
export interface RenderRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface CompressedTextureExtension {
    name: string;
    [key: string]: string | number;
}
export interface CompressedTextureInfo {
    extensionName: string;
    supportedFormats: [string, string | number][];
}
export interface UniformVector2 {
    x: number;
    y: number;
}
export interface UniformVector3 extends UniformVector2 {
    z: number;
}
export interface UniformVector4 extends UniformVector3 {
    w: number;
}
export interface LegacyAudioContext extends AudioContext {
    createGainNode(): GainNode;
}
export interface LegacyAudioBufferSourceNode extends AudioBufferSourceNode {
    noteOff(when: number): void;
}
interface FullscreenDocument extends Document {
    webkitIsFullScreen?: boolean;
    msExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
    oCancelFullScreen?: () => void;
    webkitExitFullscreen?: () => void;
}
interface RenderImage {
    texture?: EngineWebGLTexture | null;
    source?: (BitmapDataSource & { texture?: EngineWebGLTexture | null }) | null | undefined;
    webGLTexture?: EngineWebGLTexture | null | undefined;
}
interface BrowserSocket extends globalThis.WebSocket {
    disconnect?: () => void;
}
interface PlayerContainer extends HTMLElement {
    "egret-player": WebPlayer;
}
interface BackingStoreContext extends CanvasContext {
    backingStorePixelRatio?: number;
    webkitBackingStorePixelRatio?: number;
    mozBackingStorePixelRatio?: number;
    msBackingStorePixelRatio?: number;
    oBackingStorePixelRatio?: number;
}
interface QQBrowser {
    execWebFn?: { postX5GamePlayerMessage?: (event: { type: string }) => void };
}
interface LegacyNavigator extends Navigator {
    msPointerEnabled?: boolean;
    browserLanguage?: string;
}
interface LegacyDocument extends Document {
    mozHidden?: boolean;
    msHidden?: boolean;
    webkitHidden?: boolean;
    oHidden?: boolean;
}
interface LegacyXHR extends XMLHttpRequest {
    responseBody?: unknown;
}
interface SmoothingContext extends CanvasRenderingContext2D {
    webkitImageSmoothingEnabled?: boolean;
    mozImageSmoothingEnabled?: boolean;
    msImageSmoothingEnabled?: boolean;
}
interface TouchLocation {
    pageX: number;
    pageY: number;
    identifier?: number;
}
interface PointerTouchEvent extends PointerEvent {
    identifier: number;
}
interface PreventableEvent extends globalThis.Event {
    isScroll?: boolean;
}
// interface PluginMessage {
//     functionName: string; value: string;
// }

export function $getTextAdapter(textfield: DisplayObject): HTMLInput | undefined {
    const stageHash: number = textfield.stage ? textfield.stage.$hashCode : 0;
    const adapter: HTMLInput | undefined = WebMiscHelper.stageToTextLayerMap[stageHash];
    const canvas: InputCanvas | undefined = WebMiscHelper.stageToCanvasMap[stageHash];
    const container: HTMLElement | undefined = WebMiscHelper.stageToContainerMap[stageHash];
    if (canvas && container) {
        delete WebMiscHelper.stageToCanvasMap[stageHash];
        delete WebMiscHelper.stageToContainerMap[stageHash];
    }
    return adapter;
}
export function $cacheTextAdapter(adapter: HTMLInput, stage: Stage, container: HTMLElement, canvas: InputCanvas): void {
    adapter._initStageDelegateDiv(container, canvas);
    WebMiscHelper.stageToTextLayerMap[stage.$hashCode] = adapter;
    WebMiscHelper.stageToCanvasMap[stage.$hashCode] = canvas;
    WebMiscHelper.stageToContainerMap[stage.$hashCode] = container;
}
export function WebLifeCycleHandler(context: LifecycleContext): void {
    const visibilityDocument: LegacyDocument = document;
    let hidden: "hidden" | "mozHidden" | "msHidden" | "webkitHidden" | "oHidden" | undefined;
    let visibilityChange: string | undefined;
    const handleVisibilityChange: () => void = (): void => {
        if (!visibilityDocument[hidden!]) {
            context.resume();
        } else {
            context.pause();
        }
    };
    window.addEventListener("focus", context.resume, false);
    window.addEventListener("blur", context.pause, false);
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof visibilityDocument.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
    } else if (typeof visibilityDocument.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof visibilityDocument.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    } else if (typeof visibilityDocument.oHidden !== "undefined") {
        hidden = "oHidden";
        visibilityChange = "ovisibilitychange";
    }
    if ("onpageshow" in window && "onpagehide" in window) {
        window.addEventListener("pageshow", context.resume, false);
        window.addEventListener("pagehide", context.pause, false);
    }
    if (hidden && visibilityChange) {
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
    const ua: string = navigator.userAgent;
    const isWX: boolean = /micromessenger/gi.test(ua);
    let isQQBrowser: boolean = /mqq/ig.test(ua);
    const isQQ: boolean = /mobile.*qq/gi.test(ua);
    if (isQQ || isWX) {
        isQQBrowser = false;
    }
    if (isQQBrowser) {
        const browser: QQBrowser = WebMiscHelper.browserWindow.browser || {};
        browser.execWebFn = browser.execWebFn || {};
        browser.execWebFn.postX5GamePlayerMessage = (event: { type: string }): void => {
            const eventType: string = event.type;
            if (eventType == "app_enter_background") {
                context.pause();
            } else if (eventType == "app_enter_foreground") {
                context.resume();
            }
        };
        WebMiscHelper.browserWindow.browser = browser;
    }
}
export function getPrefixStyleName(name: string, element?: object | null): string {
    let header: string;
    if (element != null) {
        header = getPrefix(name, element);
    } else {
        if (WebMiscHelper.currentPrefix == null) {
            const tempStyle: CSSStyleDeclaration = document.createElement("div").style;
            WebMiscHelper.currentPrefix = getPrefix("transform", tempStyle);
        }
        header = WebMiscHelper.currentPrefix;
    }
    return header == "" ? name : header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
}
export function getPrefix(name: string, element: object): string {
    if (name in element) {
        return "";
    }
    name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
    const transArr: string[] = ["webkit", "ms", "Moz", "O"];
    for (let i: number = 0; i < transArr.length; i++) {
        const tempStyle: string = transArr[i]! + name;
        if (tempStyle in element) {
            return transArr[i]!;
        }
    }
    return "";
}
export function updateAllScreens(): void {
    if (!WebMiscHelper.isRunning) {
        return;
    }
    const containerList: NodeListOf<PlayerContainer> = document.querySelectorAll<PlayerContainer>(".egret-player");
    const length: number = containerList.length;
    for (let i: number = 0; i < length; i++) {
        const container: PlayerContainer = containerList[i]!;
        const player: WebPlayer = container["egret-player"];
        player.updateScreenSize();
    }
}
export function runEgret(options: RunEgretOptions): void {
    if (WebMiscHelper.isRunning) {
        return;
    }
    WebMiscHelper.isRunning = true;
    const ua: string = navigator.userAgent.toLowerCase();
    if (ua.indexOf("egretnative") >= 0 && ua.indexOf("egretwebview") == -1) {
        Capabilities.runtimeType = RuntimeType.RUNTIME2;
    }
    {
        Html5Capatibility._audioType = options.audioType;
        Html5Capatibility.$init();
        let renderMode: string | undefined = options.renderMode;
        if (renderMode == "webgl") {
            WebGLRenderContext.antialias = !!options.antialias;
        }
        RenderBuffHelper.CanvasRenderBuffer = CanvasRenderBuffer;
        if (ua.indexOf("egretnative") >= 0 && renderMode != "webgl") {
            $warn(1051);
            renderMode = "webgl";
        }
        setRenderMode(renderMode);
        let canvasScaleFactor: number;
        if (options.canvasScaleFactor) {
            canvasScaleFactor = options.canvasScaleFactor;
        } else if (options.calculateCanvasScaleFactor) {
            canvasScaleFactor = options.calculateCanvasScaleFactor(RenderHelper.canvasHitTestBuffer!.context);
        } else {
            const context: BackingStoreContext = RenderHelper.canvasHitTestBuffer!.context;
            const backingStore: number = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
            canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
        }
        DisplayList.$canvasScaleFactor = canvasScaleFactor;
        const ticker: SystemTicker = getTicker();
        startTicker(ticker);
        if (options.screenAdapter) {
            ScreenAdapterHelper.screenAdapter = options.screenAdapter;
        } else if (!ScreenAdapterHelper.screenAdapter) {
            ScreenAdapterHelper.screenAdapter = new DefaultScreenAdapter();
        }
        const list: NodeListOf<PlayerContainer> = document.querySelectorAll<PlayerContainer>(".egret-player");
        const length: number = list.length;
        for (let i: number = 0; i < length; i++) {
            const container: PlayerContainer = list[i]!;
            const player: WebPlayer = new WebPlayer();
            container["egret-player"] = player;
            player.init(container, options);
            player.initOrientation();
        }
        window.addEventListener("resize", (): void => {
            if (isNaN(WebMiscHelper.resizeTimer)) {
                WebMiscHelper.resizeTimer = window.setTimeout(doResize, 300);
            }
        });
    }
}
export function parseXML(text: string): XML | null {
    const xmlDoc: Document = DomParserHelper.parser.parseFromString(text, "text/xml");
    const length: number = xmlDoc.childNodes.length;
    for (let i: number = 0; i < length; i++) {
        const node: ChildNode = xmlDoc.childNodes[i]!;
        if (node.nodeType == 1) {
            return parseNode(node as Element, null);
        }
    }
    return null;
}
export function getOption(key: string): string | undefined {
    if (window.location) {
        let search: string = location.search;
        if (search == "") {
            return "";
        }
        search = search.slice(1);
        const searchArr: string[] = search.split("&");
        const length: number = searchArr.length;
        for (let i: number = 0; i < length; i++) {
            const str: string = searchArr[i]!;
            const arr: string[] = str.split("=");
            if (arr[0] == key) {
                return arr[1];
            }
        }
    }
    return "";
}
function parseNode(node: Element, parent: XML | null): XML {
    if (node.localName == "parsererror") {
        throw new Error(node.textContent!);
    }
    const xml: XML = new XML(node.localName, parent, node.prefix, node.namespaceURI, node.nodeName);
    const nodeAttributes: NamedNodeMap = node.attributes;
    const attributes: Record<string, string> = xml.attributes;
    let length: number = nodeAttributes.length;
    for (let i: number = 0; i < length; i++) {
        const attributeNode: Attr = nodeAttributes[i]!;
        const name: string = attributeNode.name;
        if (name.indexOf("xmlns:") == 0) {
            continue;
        }
        attributes[name] = attributeNode.value;
        xml[`$${name}`] = attributeNode.value;
    }
    const childNodes: NodeListOf<ChildNode> = node.childNodes;
    length = childNodes.length;
    const children: (XML | XMLText)[] = xml.children;
    for (let i: number = 0; i < length; i++) {
        const childNode: ChildNode = childNodes[i]!;
        const nodeType: number = childNode.nodeType;
        let childXML: XML | XMLText | null = null;
        if (nodeType == 1) {
            childXML = parseNode(childNode as Element, xml);
        } else if (nodeType == 3) {
            const text: string = childNode.textContent!.trim();
            if (text) {
                childXML = new XMLText(text, xml);
            }
        }
        if (childXML) {
            children.push(childXML);
        }
    }
    return xml;
}
function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader: WebGLShader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
    if (!compiled) {
        console.log("shader not compiled!");
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}
function createWebGLProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program: WebGLProgram = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
}
function extractAttributes(gl: WebGLRenderingContext, program: WebGLProgram): Record<string, EgretWebGLAttribute> {
    const attributes: Record<string, EgretWebGLAttribute> = {};
    const totalAttributes: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number;
    for (let i: number = 0; i < totalAttributes; i++) {
        const attribData: WebGLActiveInfo = gl.getActiveAttrib(program, i)!;
        const name: string = attribData.name;
        const attribute: EgretWebGLAttribute = new EgretWebGLAttribute(gl, program, attribData);
        attributes[name] = attribute;
    }
    return attributes;
}
function extractUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Record<string, EgretWebGLUniform> {
    const uniforms: Record<string, EgretWebGLUniform> = {};
    const totalUniforms: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i: number = 0; i < totalUniforms; i++) {
        const uniformData: WebGLActiveInfo = gl.getActiveUniform(program, i)!;
        const name: string = uniformData.name;
        const uniform: EgretWebGLUniform = new EgretWebGLUniform(gl, program, uniformData);
        uniforms[name] = uniform;
    }
    return uniforms;
}
function __createCanvas__(width: number, height: number): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = createCanvas(width, height)!;
    const context: SmoothingContext = canvas.getContext("2d")!;
    if (context.imageSmoothingEnabled === undefined) {
        const keys: SmoothingKey[] = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
        let key: SmoothingKey = keys[0]!;
        for (let i: number = keys.length - 1; i >= 0; i--) {
            key = keys[i]!;
            if (context[key] !== undefined) {
                break;
            }
        }
        try {
            Object.defineProperty(context, "imageSmoothingEnabled", {
                get : function (this: SmoothingContext): boolean | undefined {
                    return this[key];
                },
                set : function (this: SmoothingContext, value: boolean): void {
                    this[key] = value;
                },
            });
        } catch {
            context.imageSmoothingEnabled = context[key]!;
        }
    }
    return canvas;
}
function setRenderMode(renderMode: string | undefined): void {
    if (renderMode == "webgl" && WebGLUtils.checkCanUseWebGL()) {
        RenderBuffHelper.RenderBuffer = WebGLRenderBuffer;
        RenderBuffHelper.systemRenderer = new WebGLRenderer();
        RenderHelper.canvasRenderer = new CanvasRenderer();
        RenderBuffHelper.customHitTestBuffer = new WebGLRenderBuffer(3, 3);
        RenderHelper.canvasHitTestBuffer = new CanvasRenderBuffer(3, 3);
        Capabilities.renderMode = "webgl";
    } else {
        RenderBuffHelper.RenderBuffer = CanvasRenderBuffer;
        RenderBuffHelper.systemRenderer = new CanvasRenderer();
        RenderHelper.canvasRenderer = RenderBuffHelper.systemRenderer as CanvasRenderer;
        RenderBuffHelper.customHitTestBuffer = new CanvasRenderBuffer(3, 3);
        RenderHelper.canvasHitTestBuffer = RenderBuffHelper.customHitTestBuffer as CanvasRenderBuffer;
        Capabilities.renderMode = "canvas";
    }
}
function startTicker(ticker: SystemTicker): void {
    let requestFrame: typeof requestAnimationFrame | undefined = window.requestAnimationFrame || WebMiscHelper.browserWindow.webkitRequestAnimationFrame ||
        WebMiscHelper.browserWindow.mozRequestAnimationFrame || WebMiscHelper.browserWindow.oRequestAnimationFrame || WebMiscHelper.browserWindow.msRequestAnimationFrame;
    if (!requestFrame) {
        requestFrame = (callback: FrameRequestCallback): number => window.setTimeout(callback, 1000 / 60);
    }
    const schedule: typeof requestAnimationFrame = requestFrame;
    schedule(onTick);
    function onTick(): void {
        schedule(onTick);
        ticker.update();
    }
}
function doResize(): void {
    WebMiscHelper.resizeTimer = NaN;
    updateAllScreens();
}

export class WebMiscHelper {
    public static readonly browserWindow: LegacyWindow = window as unknown as LegacyWindow;
    public static readonly browserNavigator: LegacyNavigator = navigator;
    public static readonly winURL: typeof URL = window.URL || WebMiscHelper.browserWindow.webkitURL!;

    public static readonly stageToTextLayerMap: Record<number, HTMLInput | undefined> = {};
    public static readonly stageToCanvasMap: Record<number, InputCanvas | undefined> = {};
    public static readonly stageToContainerMap: Record<number, HTMLElement | undefined> = {};

    public static currentPrefix: string | null = null;
    public static isRunning: boolean = false;
    public static isShowLog = false;
    public static resizeTimer: number = NaN;

    private static textContext: CanvasRenderingContext2D | null = null;

    public static getTextContext(): CanvasRenderingContext2D {
        return WebMiscHelper.textContext ??= WebMiscHelper.createContext();
    }
    private static createContext(): CanvasRenderingContext2D {
        const textContext = RenderHelper.canvasHitTestBuffer!.context;
        textContext.textAlign = "left";
        textContext.textBaseline = "middle";
        return textContext;
    }
}

export class WebVideo extends DisplayObject implements Video {
    public loaded: boolean = false;
    public closed: boolean = false;
    public heightSet: number = NaN;
    public widthSet: number = NaN;
    public waiting: boolean = false;
    public userPause: boolean = false;
    public userPlay: boolean = false;
    public isPlayed: boolean = false;
    public _fullscreen: boolean = true;
    public src: string | undefined;
    public declare poster: string | undefined;
    public declare video: HTMLVideoElement | null;
    public declare posterData: BitmapData | undefined;
    public declare _bitmapData: BitmapData | undefined;
    public declare $renderNode: BitmapNode;

    public constructor(url?: string, _cache: boolean = true) {
        void _cache;

        super();
        this.$renderNode = new BitmapNode();
        this.src = url;
        this.once(Event.ADDED_TO_STAGE, this.loadPoster, this);
        if (url) {
            this.load();
        }
    }
    public screenChanged: (event: globalThis.Event) => void = (_e: globalThis.Event): void => {
        void _e;

        const fullscreenDocument: FullscreenDocument = document;
        const isfullscreen: boolean | undefined = document.fullscreenEnabled || fullscreenDocument.webkitIsFullScreen;
        if (!isfullscreen) {
            this.checkFullScreen(false);
            if (!Capabilities.isMobile) {
                this._fullscreen = !!isfullscreen;
            }
        }
    };
    public onVideoLoaded: () => void = (): void => {
        this.video!.removeEventListener("canplay", this.onVideoLoaded);
        const video: HTMLVideoElement = this.video!;
        this.loaded = true;
        if (this.posterData) {
            this.posterData.width = this.getPlayWidth();
            this.posterData.height = this.getPlayHeight();
        }
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        window.setTimeout((): void => {
            this.dispatchEventWith(Event.COMPLETE);
        }, 200);
    };
    public load(url?: string, _cache: boolean = true): void {
        void _cache;

        url = url || this.src;
        this.src = url;
        if (!url) {
            $error(3002);
        }
        if (this.video && this.video.src == url) {
            return;
        }
        let video: HTMLVideoElement;
        if (!this.video || Capabilities.isMobile) {
            video = document.createElement("video");
            this.video = video;
            video.controls = false;
        } else {
            video = this.video;
        }
        video.src = url;
        video.setAttribute("autoplay", "autoplay");
        video.setAttribute("webkit-playsinline", "true");
        video.addEventListener("canplay", this.onVideoLoaded);
        video.addEventListener("error", (): void => this.onVideoError());
        video.addEventListener("ended", (): void => this.onVideoEnded());
        let firstPause: boolean = false;
        video.addEventListener("canplay", (): void => {
            this.waiting = false;
            if (!firstPause) {
                firstPause = true;
                video.pause();
            } else if (this.userPause) {
                this.pause();
            } else if (this.userPlay) {
                this.play();
            }
        });
        video.addEventListener("waiting", (): void => {
            this.waiting = true;
        });
        video.load();
        this.videoPlay();
        video.style.position = "absolute";
        video.style.top = "0px";
        video.style.zIndex = "-88888";
        video.style.left = "0px";
        video.height = 1;
        video.width = 1;
    }
    public play(startTime?: number, loop: boolean = false): void {
        if (this.loaded == false) {
            this.load(this.src);
            this.once(Event.COMPLETE, (_e: Event): void => {
                void _e;
                return this.play(startTime, loop);
            }, this);
            return;
        }
        this.isPlayed = true;
        const video: HTMLVideoElement = this.video!;
        if (startTime != undefined) {
            video.currentTime = +startTime || 0;
        }
        video.loop = !!loop;
        video.style.zIndex = Capabilities.isMobile ? "-88888" : "9999";
        video.style.position = "absolute";
        video.style.top = "0px";
        video.style.left = "0px";
        video.height = video.videoHeight;
        video.width = video.videoWidth;
        if (Capabilities.os != "Windows PC" && Capabilities.os != "Mac OS") {
            window.setTimeout((): void => {
                video.width = 0;
            }, 1000);
        }
        this.checkFullScreen(this._fullscreen);
    }
    public videoPlay(): void {
        this.userPause = false;
        if (this.waiting) {
            this.userPlay = true;
            return;
        }
        this.userPlay = false;
        this.video!.play();
    }
    public checkFullScreen(playFullScreen: boolean): void {
        const video: HTMLVideoElement = this.video!;
        if (playFullScreen) {
            if (video.parentElement == null) {
                video.removeAttribute("webkit-playsinline");
                document.body.appendChild(video);
            }
            stopTick(this.markDirty, this);
            this.goFullscreen();
        } else {
            if (video.parentElement != null) {
                video.parentElement.removeChild(video);
            }
            video.setAttribute("webkit-playsinline", "true");
            this.setFullScreenMonitor(false);
            startTick(this.markDirty, this);
            if (Capabilities.isMobile) {
                this.video!.currentTime = 0;
                this.onVideoEnded();
                return;
            }
        }
        this.videoPlay();
    }
    public goFullscreen(): boolean {
        const video: HTMLVideoElement = this.video!;
        const methods: Record<string, FullscreenMethod | undefined> = video as unknown as Record<string, FullscreenMethod | undefined>;
        let fullscreenType: string = getPrefixStyleName("requestFullscreen", video);
        if (!methods[fullscreenType]) {
            fullscreenType = getPrefixStyleName("requestFullScreen", video);
            if (!methods[fullscreenType]) {
                return true;
            }
        }
        video.removeAttribute("webkit-playsinline");
        methods[fullscreenType]!.call(video);
        this.setFullScreenMonitor(true);
        return true;
    }
    public setFullScreenMonitor(use: boolean): void {
        const video: HTMLVideoElement = this.video!;
        if (use) {
            video.addEventListener("mozfullscreenchange", this.screenChanged);
            video.addEventListener("webkitfullscreenchange", this.screenChanged);
            video.addEventListener("mozfullscreenerror", this.screenError);
            video.addEventListener("webkitfullscreenerror", this.screenError);
        } else {
            video.removeEventListener("mozfullscreenchange", this.screenChanged);
            video.removeEventListener("webkitfullscreenchange", this.screenChanged);
            video.removeEventListener("mozfullscreenerror", this.screenError);
            video.removeEventListener("webkitfullscreenerror", this.screenError);
        }
    }
    public screenError(): void {
        $error(3014);
    }
    public exitFullscreen(): void {
        const fullscreenDocument: FullscreenDocument = document;
        if (fullscreenDocument.exitFullscreen) {
            fullscreenDocument.exitFullscreen();
        } else if (fullscreenDocument.msExitFullscreen) {
            fullscreenDocument.msExitFullscreen();
        } else if (fullscreenDocument.mozCancelFullScreen) {
            fullscreenDocument.mozCancelFullScreen();
        } else if (fullscreenDocument.oCancelFullScreen) {
            fullscreenDocument.oCancelFullScreen();
        } else if (fullscreenDocument.webkitExitFullscreen) {
            fullscreenDocument.webkitExitFullscreen();
        }
    }
    public onVideoEnded(): void {
        this.pause();
        this.isPlayed = false;
        this.dispatchEventWith(Event.ENDED);
    }
    public onVideoError(): void {
        this.dispatchEventWith(IOErrorEvent.IO_ERROR);
    }
    public close(): void {
        this.closed = true;
        this.video!.removeEventListener("canplay", this.onVideoLoaded);
        this.video!.removeEventListener("error", (): void => this.onVideoError());
        this.video!.removeEventListener("ended", (): void => this.onVideoEnded());
        this.pause();
        if (this.loaded == false && this.video) {
            this.video.src = "";
        }
        if (this.video && this.video.parentElement) {
            this.video.parentElement.removeChild(this.video);
            this.video = null;
        }
        this.loaded = false;
    }
    public pause(): void {
        this.userPlay = false;
        if (this.waiting) {
            this.userPause = true;
            return;
        }
        this.userPause = false;
        this.video!.pause();
        stopTick(this.markDirty, this);
    }
    public get volume(): number {
        return this.video ? this.video.volume : 1;
    }
    public set volume(value: number) {
        if (this.video) {
            this.video.volume = value;
        }
    }
    public get position(): number {
        return this.video ? this.video.currentTime : 0;
    }
    public set position(value: number) {
        if (this.video) {
            this.video.currentTime = value;
        }
    }
    public get fullscreen(): boolean {
        return this._fullscreen;
    }
    public set fullscreen(value: boolean) {
        if (Capabilities.isMobile) {
            return;
        }
        this._fullscreen = !!value;
        if (this.video && this.video.paused == false) {
            this.checkFullScreen(this._fullscreen);
        }
    }
    public get bitmapData(): BitmapData | null {
        if (!this.video || !this.loaded) {
            return null;
        }
        if (!this._bitmapData) {
            this.video.width = this.video.videoWidth;
            this.video.height = this.video.videoHeight;
            this._bitmapData = new BitmapData(this.video);
            this._bitmapData.$deleteSource = false;
        }
        return this._bitmapData;
    }
    public loadPoster(): void {
        const poster: string | undefined = this.poster;
        if (!poster) {
            return;
        }
        const imageLoader: ImageLoader = new (getImageLoader())();
        imageLoader.once(Event.COMPLETE, (_e: Event): void => {
            void _e;

            this.posterData = imageLoader.data!;
            this.$renderDirty = true;
            this.posterData.width = this.getPlayWidth();
            this.posterData.height = this.getPlayHeight();
        }, this);
        imageLoader.load(poster);
    }
    public override $measureContentBounds(bounds: Rectangle): void {
        const bitmapData: BitmapData | null = this.bitmapData;
        const posterData: BitmapData | undefined = this.posterData;
        if (bitmapData || posterData) {
            bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
        } else {
            bounds.setEmpty();
        }
    }
    public getPlayWidth(): number {
        if (!isNaN(this.widthSet)) {
            return this.widthSet;
        }
        if (this.bitmapData) {
            return this.bitmapData.width;
        }
        if (this.posterData) {
            return this.posterData.width;
        }
        return NaN;
    }
    public getPlayHeight(): number {
        if (!isNaN(this.heightSet)) {
            return this.heightSet;
        }
        if (this.bitmapData) {
            return this.bitmapData.height;
        }
        if (this.posterData) {
            return this.posterData.height;
        }
        return NaN;
    }
    public override $updateRenderNode(): void {
        const node: BitmapNode = this.$renderNode;
        const bitmapData: BitmapData | null = this.bitmapData;
        const posterData: BitmapData | undefined = this.posterData;
        const width: number = this.getPlayWidth();
        const height: number = this.getPlayHeight();
        if ((!this.isPlayed || Capabilities.isMobile) && posterData) {
            node.image = posterData;
            node.imageWidth = width;
            node.imageHeight = height;
            node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
        } else if (this.isPlayed && bitmapData) {
            node.image = bitmapData;
            node.imageWidth = bitmapData.width;
            node.imageHeight = bitmapData.height;
            WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
            bitmapData.webGLTexture = null;
            node.drawImage(0, 0, bitmapData.width, bitmapData.height, 0, 0, width, height);
        }
    }
    public markDirty(): boolean {
        this.$renderDirty = true;
        return true;
    }
    public override $setHeight(value: number): void {
        this.heightSet = value;
        if (this.paused) {
            this.$renderDirty = true;
            window.setTimeout((): void => {
                this.$renderDirty = false;
            }, 200);
        }
        super.$setHeight(value);
    }
    public override $setWidth(value: number): void {
        this.widthSet = value;
        if (this.paused) {
            this.$renderDirty = true;
            window.setTimeout((): void => {
                this.$renderDirty = false;
            }, 200);
        }
        super.$setWidth(value);
    }
    public get paused(): boolean {
        return this.video ? this.video.paused : true;
    }
    public get length(): number {
        if (this.video) {
            return this.video.duration;
        }
        throw new Error("Video not loaded!");
    }
}
__reflect(WebVideo.prototype, "egret.web.WebVideo", ["egret.Video", "egret.DisplayObject"]);

export class WebHttpRequest<TResponse = ResponseValue> extends EventDispatcher {
    public timeout: number = 0;
    public _url: string = "";
    public _method: string = "";
    public _xhr: LegacyXHR | null = null;
    public declare _responseType: XMLHttpRequestResponseType | undefined;
    public declare _withCredentials: boolean | undefined;
    public declare headerObj: Record<string, string> | undefined;
    public get response(): TResponse | null {
        if (!this._xhr) {
            return null;
        }
        if (this._xhr.response != undefined) {
            return this._xhr.response as TResponse;
        }
        if (this._responseType == "text") {
            return this._xhr.responseText as TResponse;
        }
        if (this._responseType == "arraybuffer" && /msie 9.0/i.test(navigator.userAgent)) {
            return WebMiscHelper.browserWindow.convertResponseBodyToText(this._xhr.responseBody) as TResponse;
        }
        if (this._responseType == "document") {
            return this._xhr.responseXML as TResponse | null;
        }
        return null;
    }
    public get responseType(): XMLHttpRequestResponseType | undefined {
        return this._responseType;
    }
    public set responseType(value: XMLHttpRequestResponseType | undefined) {
        this._responseType = value;
    }
    public get withCredentials(): boolean | undefined {
        return this._withCredentials;
    }
    public set withCredentials(value: boolean | undefined) {
        this._withCredentials = value;
    }
    public getXHR(): LegacyXHR {
        if (WebMiscHelper.browserWindow.XMLHttpRequest) {
            return new WebMiscHelper.browserWindow.XMLHttpRequest();
        }
        return new WebMiscHelper.browserWindow.ActiveXObject!("MSXML2.XMLHTTP");
    }
    public open(url: string, method: string = "GET"): void {
        this._url = url;
        this._method = method;
        if (this._xhr) {
            this._xhr.abort();
            this._xhr = null;
        }
        const xhr: LegacyXHR = this.getXHR();
        if (WebMiscHelper.browserWindow.XMLHttpRequest) {
            xhr.addEventListener("load", this.onload.bind(this));
            xhr.addEventListener("error", this.onerror.bind(this));
        } else {
            xhr.onreadystatechange = this.onReadyStateChange.bind(this);
        }
        xhr.onprogress = this.updateProgress.bind(this);
        xhr.ontimeout = this.onTimeout.bind(this);
        xhr.open(this._method, this._url, true);
        this._xhr = xhr;
    }
    public send(data?: Document | XMLHttpRequestBodyInit | null): void {
        const xhr: LegacyXHR = this._xhr!;
        if (this._responseType != null) {
            xhr.responseType = this._responseType;
        }
        if (this._withCredentials != null) {
            xhr.withCredentials = this._withCredentials;
        }
        if (this.headerObj) {
            const keys: string[] = Object.keys(this.headerObj);
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i]!;
                xhr.setRequestHeader(key, this.headerObj[key]!);
            }
        }
        xhr.timeout = this.timeout;
        xhr.send(data);
    }
    public abort(): void {
        if (this._xhr) {
            this._xhr.abort();
        }
    }
    public getAllResponseHeaders(): string | null {
        if (!this._xhr) {
            return null;
        }
        const result: string = this._xhr.getAllResponseHeaders();
        return result ? result : "";
    }
    public setRequestHeader(header: string, value: string): void {
        if (!this.headerObj) {
            this.headerObj = {};
        }
        this.headerObj[header] = value;
    }
    public getResponseHeader(header: string): string | null {
        if (!this._xhr) {
            return null;
        }
        const result: string | null = this._xhr.getResponseHeader(header);
        return result ? result : "";
    }
    public onTimeout(): void {
        $warn(1052, this._url);
        this.dispatchEventWith(IOErrorEvent.IO_ERROR);
    }
    public onReadyStateChange(): void {
        const xhr: LegacyXHR = this._xhr!;
        if (xhr.readyState == 4) {
            const ioError: boolean = xhr.status >= 400 || xhr.status == 0;
            const url: string = this._url;
            window.setTimeout((): void => {
                if (ioError) {
                    if (!this.hasEventListener(IOErrorEvent.IO_ERROR)) {
                        $error(1011, url);
                    }
                    this.dispatchEventWith(IOErrorEvent.IO_ERROR);
                } else {
                    this.dispatchEventWith(Event.COMPLETE);
                }
            }, 0);
        }
    }
    public updateProgress(event: globalThis.ProgressEvent): void {
        if (event.lengthComputable) {
            ProgressEvent.dispatchProgressEvent(this, ProgressEvent.PROGRESS, event.loaded, event.total);
        }
    }
    public onload(): void {
        const xhr: LegacyXHR = this._xhr!;
        const url: string = this._url;
        const ioError: boolean = xhr.status >= 400;
        window.setTimeout((): void => {
            if (ioError) {
                if (!this.hasEventListener(IOErrorEvent.IO_ERROR)) {
                    $error(1011, url);
                }
                this.dispatchEventWith(IOErrorEvent.IO_ERROR);
            } else {
                this.dispatchEventWith(Event.COMPLETE);
            }
        }, 0);
    }
    public onerror(): void {
        const url: string = this._url;
        window.setTimeout((): void => {
            if (!this.hasEventListener(IOErrorEvent.IO_ERROR)) {
                $error(1011, url);
            }
            this.dispatchEventWith(IOErrorEvent.IO_ERROR);
        }, 0);
    }
}
__reflect(WebHttpRequest.prototype, "egret.web.WebHttpRequest", ["egret.HttpRequest"]);

export class WebImageLoader extends EventDispatcher implements ImageLoader {
    public static crossOrigin: string | null = null;
    public data: BitmapData | null = null;
    public _crossOrigin: string | null = null;
    public _hasCrossOriginSet: boolean = false;
    public currentImage: HTMLImageElement | null = null;
    public request: WebHttpRequest<Blob> | null | undefined = null;
    public declare currentURL: string;
    public get crossOrigin(): string | null {
        return this._crossOrigin;
    }
    public set crossOrigin(value: string | null) {
        this._hasCrossOriginSet = true;
        this._crossOrigin = value;
    }
    public load(url: string): void {
        if (Html5Capatibility._canUseBlob && url.indexOf("wxLocalResource:") != 0 &&
            url.indexOf("data:") != 0 && url.indexOf("http:") != 0 && url.indexOf("https:") != 0) {
            let request: WebHttpRequest<Blob> | null | undefined = this.request;
            if (!request) {
                request = this.request = new WebHttpRequest<Blob>();
                request.addEventListener(Event.COMPLETE, this.onBlobLoaded, this);
                request.addEventListener(IOErrorEvent.IO_ERROR, this.onBlobError, this);
                request.responseType = "blob";
            }
            this.currentURL = url;
            request.open(url);
            request.send();
        } else {
            this.loadImage(url);
        }
    }
    public onBlobLoaded(_event: Event): void {
        void _event;

        const blob: Blob = this.request!.response!;
        this.request = undefined;
        this.loadImage(WebMiscHelper.winURL.createObjectURL(blob));
    }
    public onBlobError(_event: Event): void {
        void _event;

        this.dispatchIOError(this.currentURL);
        this.request = undefined;
    }
    public loadImage(src: string): void {
        const image: HTMLImageElement = new Image();
        this.data = null;
        this.currentImage = image;
        if (this._hasCrossOriginSet) {
            if (this._crossOrigin) {
                image.crossOrigin = this._crossOrigin;
            }
        } else if (WebImageLoader.crossOrigin) {
            image.crossOrigin = WebImageLoader.crossOrigin;
        }
        image.onload = this.onImageComplete.bind(this);
        image.onerror = this.onLoadError.bind(this);
        image.src = src;
    }
    public onImageComplete(event: globalThis.Event): void {
        const image: HTMLImageElement | null = this.getImage(event);
        if (!image) {
            return;
        }
        this.data = new BitmapData(image);
        window.setTimeout((): void => {
            this.dispatchEventWith(Event.COMPLETE);
        }, 0);
    }
    public onLoadError(event: globalThis.Event | string): void {
        const image: HTMLImageElement | null = this.getImage(event as globalThis.Event);
        if (!image) {
            return;
        }
        this.dispatchIOError(image.src);
    }
    public dispatchIOError(url: string): void {
        window.setTimeout((): void => {
            if (!this.hasEventListener(IOErrorEvent.IO_ERROR)) {
                $error(1011, url);
            }
            this.dispatchEventWith(IOErrorEvent.IO_ERROR);
        }, 0);
    }
    public getImage(event: globalThis.Event): HTMLImageElement | null {
        const image: HTMLImageElement = event.target as HTMLImageElement;
        const url: string = image.src;
        if (url.indexOf("blob:") == 0) {
            try {
                WebMiscHelper.winURL.revokeObjectURL(image.src);
            } catch {
                $warn(1037);
            }
        }
        image.onerror = null;
        image.onload = null;
        if (this.currentImage !== image) {
            return null;
        }
        this.currentImage = null;
        return image;
    }
}
__reflect(WebImageLoader.prototype, "egret.web.WebImageLoader", ["egret.ImageLoader"]);

export class HTML5StageText extends EventDispatcher implements StageText {
    public _isNeedShow: boolean = false;
    public inputElement: InputElement | null = null;
    public inputDiv: HTMLDivElement | null = null;
    public _gscaleX: number = 0;
    public _gscaleY: number = 0;
    public textValue: string = "";
    public colorValue: number = 0xffffff;
    public _styleInfoes: Record<string, string> = {};
    public declare $textfield: InputTextField & TextField;
    public declare htmlInput: HTMLInput;
    public $setTextField(textfield: InputTextField): boolean {
        this.$textfield = textfield as InputTextField & TextField;
        return true;
    }
    public $addToStage(): void {
        this.htmlInput = $getTextAdapter(this.$textfield)!;
    }
    public _initElement(): void {
        const point: Point = this.$textfield.localToGlobal(0, 0);
        const x: number = point.x;
        const y: number = point.y;
        const scaleX: number = this.htmlInput.$scaleX;
        const scaleY: number = this.htmlInput.$scaleY;
        this.inputDiv!.style.left = x * scaleX + "px";
        this.inputDiv!.style.top = y * scaleY + "px";
        if (this.$textfield.multiline && this.$textfield.height > this.$textfield.size) {
            this.inputDiv!.style.top = y * scaleY + "px";
            this.inputElement!.style.top = -this.$textfield.lineSpacing / 2 * scaleY + "px";
        } else {
            this.inputDiv!.style.top = y * scaleY + "px";
            this.inputElement!.style.top = "0px";
        }
        let node: DisplayObject = this.$textfield;
        let cX: number = 1;
        let cY: number = 1;
        let rotation: number = 0;
        while (node.parent) {
            cX *= node.scaleX;
            cY *= node.scaleY;
            rotation += node.rotation;
            node = node.parent;
        }
        const transformKey: string = getPrefixStyleName("transform");
        (this.inputDiv!.style as StyleMap)[transformKey] = "rotate(" + rotation + "deg)";
        this._gscaleX = scaleX * cX;
        this._gscaleY = scaleY * cY;
    }
    public $show(): void {
        if (!this.htmlInput.isCurrentStageText(this)) {
            this.inputElement = this.htmlInput.getInputElement(this);
            this.inputElement.type = this.$textfield.multiline ? "text" : this.$textfield.inputType;
            this.inputDiv = this.htmlInput._inputDIV;
        } else {
 this.inputElement!.onblur = null;
        }
        this.htmlInput._needShow = true;
        this._isNeedShow = true;
        this._initElement();
    }
    public onBlurHandler(): void {
        this.htmlInput.clearInputElement();
        window.scrollTo(0, 0);
    }
    public onFocusHandler(): void {
        window.setTimeout((): void => {
            if (this.inputElement) {
                this.inputElement.scrollIntoView();
            }
        }, 200);
    }
    public executeShow(): void {
        const input: InputElement = this.inputElement!;
        input.value = this.$getText();
        if (input.onblur == null) {
            input.onblur = this.onBlurHandler.bind(this);
        }
        if (input.onfocus == null) {
            input.onfocus = this.onFocusHandler.bind(this);
        }
        this.$resetStageText();
        if (this.$textfield.maxChars > 0) {
            input.setAttribute("maxlength", String(this.$textfield.maxChars));
        } else {
            input.removeAttribute("maxlength");
        }
        input.selectionStart = input.value.length;
        input.selectionEnd = input.value.length;
        input.focus();
    }
    public $hide(): void {
        if (this.htmlInput) {
            this.htmlInput.disconnectStageText(this);
        }
    }
    public $getText(): string {
        if (!this.textValue) {
            this.textValue = "";
        }
        return this.textValue;
    }
    public $setText(value: string): boolean {
        this.textValue = value;
        this.resetText();
        return true;
    }
    public resetText(): void {
        if (this.inputElement) {
            this.inputElement.value = this.textValue;
        }
    }
    public $setColor(value: number): boolean {
        this.colorValue = value;
        this.resetColor();
        return true;
    }
    public resetColor(): void {
        if (this.inputElement) {
            this.setElementStyle("color", toColorString(this.colorValue));
        }
    }
    public $onBlur(): void { }
    public _onInput(): void {
        window.setTimeout((): void => {
            if (this.inputElement && this.inputElement.selectionStart == this.inputElement.selectionEnd) {
                this.textValue = this.inputElement.value;
                Event.dispatchEvent(this, "updateText", false);
            }
        }, 0);
    }
    public setAreaHeight(): void {
        const textfield: TextField = this.$textfield;
        if (textfield.multiline) {
            const textheight: number = TextFieldUtils.$getTextHeight(textfield);
            if (textfield.height <= textfield.size) {
                this.setElementStyle("height", textfield.size * this._gscaleY + "px");
                this.setElementStyle("padding", "0px");
                this.setElementStyle("lineHeight", textfield.size * this._gscaleY + "px");
            } else if (textfield.height < textheight) {
                this.setElementStyle("height", textfield.height * this._gscaleY + "px");
                this.setElementStyle("padding", "0px");
                this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
            } else {
                this.setElementStyle("height", (textheight + textfield.lineSpacing) * this._gscaleY + "px");
                const rap: number = (textfield.height - textheight) * this._gscaleY;
                const valign: number = TextFieldUtils.$getValign(textfield);
                const top: number = rap * valign;
                const bottom: number = rap - top;
                this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
                this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
            }
        }
    }
    public _onClickHandler(event: MouseEvent): void {
        if (this._isNeedShow) {
            event.stopImmediatePropagation();
            this._isNeedShow = false;
            this.executeShow();
            this.dispatchEvent(new Event("focus"));
        }
    }
    public _onDisconnect(): void {
        this.inputElement = null;
        this.dispatchEvent(new Event("blur"));
    }
    public setElementStyle(style: string, value: string): void {
        if (this.inputElement && this._styleInfoes[style] != value) {
            (this.inputElement.style as StyleMap)[style] = value;
        }
    }
    public $removeFromStage(): void {
        if (this.inputElement) {
            this.htmlInput.disconnectStageText(this);
        }
    }
    public $resetStageText(): void {
        if (!this.inputElement) {
            return;
        }
        const textfield: TextField = this.$textfield;
        this.setElementStyle("fontFamily", textfield.fontFamily);
        this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
        this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
        this.setElementStyle("textAlign", textfield.textAlign);
        this.setElementStyle("fontSize", textfield.size * this._gscaleY + "px");
        this.setElementStyle("color", toColorString(textfield.textColor));
        let tw: number;
        if (textfield.stage) {
            tw = textfield.localToGlobal(0, 0).x;
            tw = Math.min(textfield.width, textfield.stage.stageWidth - tw);
        } else {
            tw = textfield.width;
        }
        this.setElementStyle("width", tw * this._gscaleX + "px");
        this.setElementStyle("verticalAlign", textfield.verticalAlign);
        if (textfield.multiline) {
            this.setAreaHeight();
        } else {
            this.setElementStyle("lineHeight", textfield.size * this._gscaleY + "px");
            if (textfield.height < textfield.size) {
                this.setElementStyle("height", textfield.size * this._gscaleY + "px");
                const bottom: number = textfield.size / 2 * this._gscaleY;
                this.setElementStyle("padding", "0px 0px " + bottom + "px 0px");
            } else {
                this.setElementStyle("height", textfield.size * this._gscaleY + "px");
                const rap: number = (textfield.height - textfield.size) * this._gscaleY;
                const valign: number = TextFieldUtils.$getValign(textfield);
                const top: number = rap * valign;
                let bottom: number = rap - top;
                if (bottom < textfield.size / 2 * this._gscaleY) {
                    bottom = textfield.size / 2 * this._gscaleY;
                }
                this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
            }
        }
        this.inputDiv!.style.clip = "rect(0px " + textfield.width * this._gscaleX + "px " + textfield.height * this._gscaleY + "px 0px)";
        this.inputDiv!.style.height = textfield.height * this._gscaleY + "px";
        this.inputDiv!.style.width = tw * this._gscaleX + "px";
    }
}
__reflect(HTML5StageText.prototype, "egret.web.HTML5StageText", ["egret.StageText"]);

export class HTMLInput {
    public _needShow: boolean = false;
    public $scaleX: number = 1;
    public $scaleY: number = 1;
    public declare _stageText: HTML5StageText | null;
    public declare canvas: InputCanvas;
    public declare StageDelegateDiv: HTMLDivElement;
    public declare _inputDIV: HTMLDivElement;
    public declare _inputElement: InputElement | null;
    public declare _multiElement: InputElement;
    public declare _simpleElement: HTMLInputElement;
    public isInputOn(): boolean {
        return this._stageText != null;
    }
    public isCurrentStageText(stageText: HTML5StageText): boolean {
        return this._stageText == stageText;
    }
    public initValue(dom: HTMLElement): void {
        dom.style.position = "absolute";
        dom.style.left = "0px";
        dom.style.top = "0px";
        dom.style.border = "none";
        dom.style.padding = "0";
    }
    public $updateSize(): void {
        if (!this.canvas) {
            return;
        }
        this.$scaleX = DisplayList.$canvasScaleX;
        this.$scaleY = DisplayList.$canvasScaleY;
        this.StageDelegateDiv.style.left = this.canvas.style.left;
        this.StageDelegateDiv.style.top = this.canvas.style.top;
        const transformKey: string = getPrefixStyleName("transform");
        (this.StageDelegateDiv.style as StyleMap)[transformKey] = (this.canvas.style as StyleMap)[transformKey]!;
        (this.StageDelegateDiv.style as StyleMap)[getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
    }
    public _initStageDelegateDiv(container: HTMLElement, canvas: InputCanvas): void {
        this.canvas = canvas;
        const stageDelegateDiv: HTMLDivElement = document.createElement("div");
        this.StageDelegateDiv = stageDelegateDiv;
        stageDelegateDiv.id = "StageDelegateDiv";
        container.appendChild(stageDelegateDiv);
        this.initValue(stageDelegateDiv);
        this._inputDIV = document.createElement("div");
        this.initValue(this._inputDIV);
        this._inputDIV.style.width = "0px";
        this._inputDIV.style.height = "0px";
        this._inputDIV.style.left = "0px";
        this._inputDIV.style.top = "-100px";
        (this._inputDIV.style as StyleMap)[getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
        stageDelegateDiv.appendChild(this._inputDIV);
        this.canvas.addEventListener("click", (event: MouseEvent): void => {
            if (this._needShow) {
                this._needShow = false;
                this._stageText!._onClickHandler(event);
                this.show();
            } else if (this._inputElement) {
                this.clearInputElement();
                this._inputElement.blur();
                this._inputElement = null;
            }
        });
        this.initInputElement(true);
        this.initInputElement(false);
    }
    public initInputElement(multiline: boolean): void {
        let inputElement: InputElement;
        if (multiline) {
            inputElement = document.createElement("textarea") as InputElement;
            inputElement.style.resize = "none";
            this._multiElement = inputElement;
            inputElement.id = "egretTextarea";
        } else {
            inputElement = document.createElement("input");
            this._simpleElement = inputElement;
            inputElement.id = "egretInput";
            inputElement.type = "text";
        }
        this._inputDIV.appendChild(inputElement);
        inputElement.setAttribute("tabindex", "-1");
        inputElement.style.width = "1px";
        inputElement.style.height = "12px";
        this.initValue(inputElement);
        inputElement.style.outline = "thin";
        inputElement.style.background = "none";
        inputElement.style.overflow = "hidden";
        inputElement.style.wordBreak = "break-all";
        inputElement.style.opacity = "0";
        inputElement.oninput = (): void => {
            if (this._stageText) {
                this._stageText._onInput();
            }
        };
    }
    public show(): void {
        const inputElement: InputElement = this._inputElement!;
        $callAsync((): void => {
            inputElement.style.opacity = "1";
        }, this);
    }
    public disconnectStageText(stageText: HTML5StageText): void {
        if (this._stageText == null || this._stageText == stageText) {
            if (this._inputElement) {
                this._inputElement.blur();
            }
            this.clearInputElement();
        }
        this._needShow = false;
    }
    public clearInputElement(): void {
        if (this._inputElement) {
            this._inputElement.value = "";
            this._inputElement.onblur = null;
            this._inputElement.onfocus = null;
            this._inputElement.style.width = "1px";
            this._inputElement.style.height = "12px";
            this._inputElement.style.left = "0px";
            this._inputElement.style.top = "0px";
            this._inputElement.style.opacity = "0";
            const otherElement: InputElement = this._simpleElement == this._inputElement ? this._multiElement : this._simpleElement;
            otherElement.style.display = "block";
            this._inputDIV.style.left = "0px";
            this._inputDIV.style.top = "-100px";
            this._inputDIV.style.height = "0px";
            this._inputDIV.style.width = "0px";
        }
        if (this._stageText) {
            this._stageText._onDisconnect();
            this._stageText = null;
            this.canvas.userTyping = false;
        }
    }
    public getInputElement(stageText: HTML5StageText): InputElement {
        this.clearInputElement();
        this._stageText = stageText;
        this.canvas.userTyping = true;
        this._inputElement = stageText.$textfield.multiline ? this._multiElement : this._simpleElement;
        const otherElement: InputElement = this._simpleElement == this._inputElement ? this._multiElement : this._simpleElement;
        otherElement.style.display = "none";
        return this._inputElement;
    }
}
__reflect(HTMLInput.prototype, "egret.web.HTMLInput");

export class CanvasRenderBuffer implements sysCanvasRenderBuffer {
    public surface: HTMLCanvasElement;
    public context: CanvasContext;
    public constructor(width: number = NaN, height: number = NaN, root?: boolean) {
        this.surface = createCanvasRenderBufferSurface(__createCanvas__, width, height, root)!;
        this.context = this.surface.getContext("2d") as CanvasContext;
        if (this.context) {
            this.context.$offsetX = 0;
            this.context.$offsetY = 0;
        }
        this.resize(width, height);
    }
    public get width(): number {
        return this.surface.width;
    }
    public get height(): number {
        return this.surface.height;
    }
    public resize(width: number, height: number, useMaxSize?: boolean): void {
        resizeCanvasRenderBuffer(this, width, height, useMaxSize);
    }
    public getPixels(x: number, y: number, width: number = 1, height: number = 1): Uint8ClampedArray {
        return this.context.getImageData(x, y, width, height).data;
    }
    public toDataURL(type?: string, encoderOptions?: number): string {
        return this.surface.toDataURL(type, encoderOptions);
    }
    public clear(): void {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.surface.width, this.surface.height);
    }
    public destroy(): void {
        this.surface.width = this.surface.height = 0;
    }
}
__reflect(CanvasRenderBuffer.prototype, "egret.web.CanvasRenderBuffer", ["egret.sys.RenderBuffer"]);

export class WebTouchHandler extends HashObject {
    public canvas: InputCanvas;
    public touch: TouchHandler;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public rotation: number = 0;
    public constructor(stage: Stage, canvas: InputCanvas) {
        super();
        this.canvas = canvas;
        this.touch = new TouchHandler(stage);
        this.addListeners();
    }
    public onTouchBegin: (event: TouchLocation) => void = (event: TouchLocation): void => {
        const location: Point = this.getLocation(event);
        this.touch.onTouchBegin(location.x, location.y, event.identifier!);
    };
    public onMouseMove: (event: MouseEvent) => void = (event: MouseEvent): void => {
        if (event.buttons == 0) {
            this.onTouchEnd(event);
        } else {
            this.onTouchMove(event);
        }
    };
    public onTouchMove: (event: TouchLocation) => void = (event: TouchLocation): void => {
        const location: Point = this.getLocation(event);
        this.touch.onTouchMove(location.x, location.y, event.identifier!);
    };
    public onTouchEnd: (event: TouchLocation) => void = (event: TouchLocation): void => {
        const location: Point = this.getLocation(event);
        this.touch.onTouchEnd(location.x, location.y, event.identifier!);
    };
    public addListeners(): void {
        if (WebMiscHelper.browserNavigator.msPointerEnabled) {
            this.canvas.addEventListener("MSPointerDown", (event: globalThis.Event): void => {
                const pointer: PointerTouchEvent = event as PointerTouchEvent;
                pointer.identifier = pointer.pointerId;
                this.onTouchBegin(pointer);
                this.prevent(pointer);
            }, false);
            this.canvas.addEventListener("MSPointerMove", (event: globalThis.Event): void => {
                const pointer: PointerTouchEvent = event as PointerTouchEvent;
                pointer.identifier = pointer.pointerId;
                this.onTouchMove(pointer);
                this.prevent(pointer);
            }, false);
            this.canvas.addEventListener("MSPointerUp", (event: globalThis.Event): void => {
                const pointer: PointerTouchEvent = event as PointerTouchEvent;
                pointer.identifier = pointer.pointerId;
                this.onTouchEnd(pointer);
                this.prevent(pointer);
            }, false);
        } else {
            if (!Capabilities.isMobile) {
                this.addMouseListener();
            }
            this.addTouchListener();
        }
    }
    public addMouseListener(): void {
        this.canvas.addEventListener("mousedown", this.onTouchBegin);
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("mouseup", this.onTouchEnd);
    }
    public addTouchListener(): void {
        this.canvas.addEventListener("touchstart", (event: globalThis.TouchEvent): void => {
            const length: number = event.changedTouches.length;
            for (let i: number = 0; i < length; i++) {
                this.onTouchBegin(event.changedTouches[i]!);
            }
            this.prevent(event);
        }, false);
        this.canvas.addEventListener("touchmove", (event: globalThis.TouchEvent): void => {
            const length: number = event.changedTouches.length;
            for (let i: number = 0; i < length; i++) {
                this.onTouchMove(event.changedTouches[i]!);
            }
            this.prevent(event);
        }, false);
        this.canvas.addEventListener("touchend", (event: globalThis.TouchEvent): void => {
            const length: number = event.changedTouches.length;
            for (let i: number = 0; i < length; i++) {
                this.onTouchEnd(event.changedTouches[i]!);
            }
            this.prevent(event);
        }, false);
        this.canvas.addEventListener("touchcancel", (event: globalThis.TouchEvent): void => {
            const length: number = event.changedTouches.length;
            for (let i: number = 0; i < length; i++) {
                this.onTouchEnd(event.changedTouches[i]!);
            }
            this.prevent(event);
        }, false);
    }
    public prevent(event: PreventableEvent): void {
        event.stopPropagation();
        if (event.isScroll != true && !this.canvas.userTyping) {
            event.preventDefault();
        }
    }
    public getLocation(event: TouchLocation): Point {
        event.identifier = +event.identifier! || 0;
        const doc: HTMLElement = document.documentElement;
        const box: DOMRect = this.canvas.getBoundingClientRect();
        const left: number = box.left + window.pageXOffset - doc.clientLeft;
        const top: number = box.top + window.pageYOffset - doc.clientTop;
        const x: number = event.pageX - left;
        const y: number = event.pageY - top;
        let newx: number = x;
        let newy: number = y;
        if (this.rotation == 90) {
            newx = y;
            newy = box.width - x;
        } else if (this.rotation == -90) {
            newx = box.height - y;
            newy = x;
        }
        newx /= this.scaleX;
        newy /= this.scaleY;
        return Point.$TempPoint.setTo(Math.round(newx), Math.round(newy));
    }
    public updateScaleMode(scaleX: number, scaleY: number, rotation: number): void {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.rotation = rotation;
    }
    public $updateMaxTouches(): void {
        this.touch.$initMaxTouches();
    }
}
__reflect(WebTouchHandler.prototype, "egret.web.WebTouchHandler");

export class AudioType {
    public static WEB_AUDIO: number = 2;
    public static HTML5_AUDIO: number = 3;
}
__reflect(AudioType.prototype, "egret.web.AudioType");

export class Html5Capatibility extends HashObject {
    public static _canUseBlob: boolean = false;
    public static _audioType: number | undefined = 0;
    public static ua: string = "";
    // public static declare _AudioClass: new () => Sound;
    public static $init(): void {
        const ua: string = navigator.userAgent.toLowerCase();
        Html5Capatibility.ua = ua;
        Html5Capatibility._canUseBlob = false;

        // const AudioConstructor: (new () => AudioContext) | undefined = window.AudioContext || browserWindow.webkitAudioContext || browserWindow.mozAudioContext;
        // let canUseWebAudio: boolean = !!AudioConstructor;
        // const isIos: boolean = ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0;
        // if (AudioConstructor) {
        //     try {
        //         WebAudioDecode.ctx = new AudioConstructor() as LegacyAudioContext;
        //     } catch {
        //         canUseWebAudio = false;
        //     }
        // }
        // const audioType: number | undefined = Html5Capatibility._audioType;
        // let checkAudioType: boolean;
        // if ((audioType == AudioType.WEB_AUDIO && canUseWebAudio) || audioType == AudioType.HTML5_AUDIO) {
        //     checkAudioType = false;
        //     Html5Capatibility.setAudioType(audioType!);
        // } else if (!isIos && ua.indexOf("safari") >= 0 && ua.indexOf("chrome") === -1) {
        //     checkAudioType = false;
        //     Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
        // } else {
        //     checkAudioType = true;
        //     Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
        // }
        // if (ua.indexOf("android") >= 0) {
        //     if (checkAudioType && canUseWebAudio) {
        //         Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
        //     }
        // } else if (isIos && Html5Capatibility.getIOSVersion() >= 7) {
        //     Html5Capatibility._canUseBlob = true;
        //     if (checkAudioType && canUseWebAudio) {
        //         Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
        //     }
        // }

        if (!WebMiscHelper.winURL) {
            Html5Capatibility._canUseBlob = false;
        }
        if (ua.indexOf("egretnative") >= 0) {
            Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
            Html5Capatibility._canUseBlob = true;
        }
        // egret.Sound = Html5Capatibility._AudioClass;
    }
    public static setAudioType(type: number): void {
        Html5Capatibility._audioType = type;
        // switch (type) {
        //     case AudioType.WEB_AUDIO: Html5Capatibility._AudioClass = WebAudioSound; break;
        //     case AudioType.HTML5_AUDIO: Html5Capatibility._AudioClass = HtmlSound; break;
        // }
    }
    public static getIOSVersion(): number {
        const matches: RegExpMatchArray | null = Html5Capatibility.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/);
        if (!matches || matches.length == 0) {
            return 0;
        }
        const value: string = matches[0]!;
        return parseInt(value.match(/\d+(_\d)*/)![0]) || 0;
    }
}
__reflect(Html5Capatibility.prototype, "egret.web.Html5Capatibility");

export class WebCapability {
    public static detect(): void {
        const capabilities: typeof Capabilities = Capabilities;
        const ua: string = navigator.userAgent.toLowerCase();
        capabilities.isMobile = ua.indexOf("mobile") != -1 || ua.indexOf("android") != -1;
        if (capabilities.isMobile) {
            if (ua.indexOf("windows") < 0 && (ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)) {
                capabilities.os = "iOS";
            } else if (ua.indexOf("android") != -1 && ua.indexOf("linux") != -1) {
                capabilities.os = "Android";
            } else if (ua.indexOf("windows") != -1) {
                capabilities.os = "Windows Phone";
            }
        } else {
            if (ua.indexOf("windows nt") != -1) {
                capabilities.os = "Windows PC";
            } else if (navigator.platform == "MacIntel" && navigator.maxTouchPoints > 1) {
                capabilities.os = "iOS";
                capabilities.isMobile = true;
            } else if (ua.indexOf("mac os") != -1) {
                capabilities.os = "Mac OS";
            }
        }
        const language: string = (navigator.language || WebMiscHelper.browserNavigator.browserLanguage!).toLowerCase();
        const strings: string[] = language.split("-");
        if (strings.length > 1) {
            strings[1] = strings[1]!.toUpperCase();
        }
        capabilities.language = strings.join("-");
        WebCapability.injectUIntFixOnIE9();

        {
            const locale: string = (navigator.language || WebMiscHelper.browserNavigator.browserLanguage || "en_US").replace("-", "_");
            if (locale in LocaleStringsHelper.getLocaleStrings()) {
                LocaleStringsHelper.setLanguage(locale);
            }
        }
    }
    public static injectUIntFixOnIE9(): void {
        if (/msie 9.0/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            const script: string = "<script type='text/vbscript' language='VBScript'>\r\n" +
                "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
                "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
                "End Function\r\n" +
                "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
                "   Dim lastIndex\r\n" +
                "   lastIndex = LenB(Binary)\r\n" +
                "   if lastIndex mod 2 Then\r\n" +
                "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
                "   Else\r\n" +
                "       IEBinaryToArray_ByteStr_Last = \"\"\r\n" +
                "   End If\r\n" +
                "End Function\r\n</script>\r\n";
            document.write(script);
            WebMiscHelper.browserWindow.convertResponseBodyToText = (binary: unknown): string => {
                const byteMapping: Record<string, string> = {};
                for (let i: number = 0; i < 256; i++) {
                    for (let j: number = 0; j < 256; j++) {
                        byteMapping[String.fromCharCode(i + j * 256)] = String.fromCharCode(i) + String.fromCharCode(j);
                    }
                }
                const rawBytes: string = WebMiscHelper.browserWindow.IEBinaryToArray_ByteStr(binary);
                const lastChr: string = WebMiscHelper.browserWindow.IEBinaryToArray_ByteStr_Last(binary);
                return rawBytes.replace(/[\s\S]/g, (match: string): string => byteMapping[match]!) + lastChr;
            };
        }
    }
}
__reflect(WebCapability.prototype, "egret.web.WebCapability");
WebCapability.detect();

export class WebFps implements FPSDisplay {
    public showPanle: boolean = true;
    public fpsHeight: number = 0;
    public WIDTH: number = 101;
    public HEIGHT: number = 20;
    public bgCanvasColor: string = "#18304b";
    public fpsFrontColor: string = "#18fefe";
    public WIDTH_COST: number = 50;
    public cost1Color: string = "#18fefe";
    public cost3Color: string = "#ff0000";
    public arrFps: number[] = [];
    public arrCost: [number, number][] = [];
    public arrLog: string[] = [];
    public declare renderMode: string;
    public declare panelX: number;
    public declare panelY: number;
    public declare fontColor: string;
    public declare fontSize: number;
    public declare container: HTMLDivElement;
    public declare containerFps: HTMLDivElement;
    public declare fps: HTMLDivElement;
    public declare canvasFps: HTMLCanvasElement;
    public declare contextFps: CanvasRenderingContext2D;
    public declare divDatas: HTMLDivElement;
    public declare divDraw: HTMLDivElement;
    public declare divCost: HTMLDivElement;
    public declare canvasCost: HTMLCanvasElement;
    public declare contextCost: CanvasRenderingContext2D;
    public declare log: HTMLDivElement;
    public declare lastNumDraw: number;
    public constructor(_stage: Stage, showFPS: boolean, showLog: boolean, _logFilter: string, styles: FPSStyles) {
        if (showFPS || showLog) {
            this.renderMode = Capabilities.renderMode == "canvas" ? "Canvas" : "WebGL";
            this.panelX = styles.x === undefined ? 0 : parseInt(String(styles.x));
            this.panelY = styles.y === undefined ? 0 : parseInt(String(styles.y));
            this.fontColor = styles.textColor === undefined ? "#ffffff" : String(styles.textColor).replace("0x", "#");
            this.fontSize = styles.size === undefined ? 12 : parseInt(String(styles.size));
            if (Capabilities.isMobile) {
                this.fontSize -= 2;
            }
            const all: HTMLDivElement = document.createElement("div");
            all.style.position = "absolute";
            all.style.background = "rgba(0,0,0," + styles.bgAlpha + ")";
            all.style.left = this.panelX + "px";
            all.style.top = this.panelY + "px";
            all.style.pointerEvents = "none";
            all.id = "egret-fps-panel";
            document.body.appendChild(all);
            const container: HTMLDivElement = document.createElement("div");
            container.style.color = this.fontColor;
            container.style.fontSize = this.fontSize + "px";
            container.style.lineHeight = this.fontSize + "px";
            container.style.margin = "4px 4px 4px 4px";
            this.container = container;
            all.appendChild(container);
            if (showFPS) {
                this.addFps();
            }
            if (showLog) {
                this.addLog();
            }
        }
    }
    public addFps(): void {
        const div: HTMLDivElement = document.createElement("div");
        div.style.display = "inline-block";
        this.containerFps = div;
        this.container.appendChild(div);
        const fps: HTMLDivElement = document.createElement("div");
        fps.style.paddingBottom = "2px";
        this.fps = fps;
        this.containerFps.appendChild(fps);
        fps.innerHTML = "0 FPS " + this.renderMode + "<br/>min0 max0 avg0";
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        this.containerFps.appendChild(canvas);
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;
        this.canvasFps = canvas;
        let context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        this.contextFps = context;
        context.fillStyle = this.bgCanvasColor;
        context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        const divDatas: HTMLDivElement = document.createElement("div");
        this.divDatas = divDatas;
        this.containerFps.appendChild(divDatas);
        const left: HTMLDivElement = document.createElement("div");
        left.style.cssFloat = "left";
        left.innerHTML = "Draw<br/>Cost";
        divDatas.appendChild(left);
        const right: HTMLDivElement = document.createElement("div");
        right.style.paddingLeft = left.offsetWidth + 20 + "px";
        divDatas.appendChild(right);
        const draw: HTMLDivElement = document.createElement("div");
        this.divDraw = draw;
        draw.innerHTML = "0<br/>";
        right.appendChild(draw);
        const cost: HTMLDivElement = document.createElement("div");
        this.divCost = cost;
        cost.innerHTML = "<font  style=\"color:" + this.cost1Color + "\">0<font/> <font  style=\"color:" + this.cost3Color + "\">0<font/>";
        right.appendChild(cost);
        canvas = document.createElement("canvas");
        this.canvasCost = canvas;
        this.containerFps.appendChild(canvas);
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;
        context = canvas.getContext("2d")!;
        this.contextCost = context;
        context.fillStyle = this.bgCanvasColor;
        context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        context.fillStyle = "#000000";
        context.fillRect(this.WIDTH_COST, 0, 1, this.HEIGHT);
        this.fpsHeight = this.container.offsetHeight;
    }
    public addLog(): void {
        const logElement: HTMLDivElement = document.createElement("div");
        logElement.style.maxWidth = document.body.clientWidth - 8 - this.panelX + "px";
        logElement.style.wordWrap = "break-word";
        this.log = logElement;
        this.container.appendChild(logElement);
    }
    public update(datas: FPSMetrics, showLastData: boolean = false): void {
        let numFps: number;
        let numCostTicker: number;
        let numCostRender: number;
        if (!showLastData) {
            numFps = datas.fps;
            numCostTicker = datas.costTicker;
            numCostRender = datas.costRender;
            this.lastNumDraw = datas.draw;
            this.arrFps.push(numFps);
            this.arrCost.push([numCostTicker, numCostRender]);
        } else {
            numFps = this.arrFps[this.arrFps.length - 1]!;
            numCostTicker = this.arrCost[this.arrCost.length - 1]![0];
            numCostRender = this.arrCost[this.arrCost.length - 1]![1];
        }
        let fpsTotal: number = 0;
        let lenFps: number = this.arrFps.length;
        if (lenFps > 101) {
            lenFps = 101;
            this.arrFps.shift();
            this.arrCost.shift();
        }
        let fpsMin: number = this.arrFps[0]!;
        let fpsMax: number = this.arrFps[0]!;
        for (let i: number = 0; i < lenFps; i++) {
            const num: number = this.arrFps[i]!;
            fpsTotal += num;
            if (num < fpsMin) {
                fpsMin = num;
            } else if (num > fpsMax) {
                fpsMax = num;
            }
        }
        const WIDTH: number = this.WIDTH;
        const HEIGHT: number = this.HEIGHT;
        let context: CanvasRenderingContext2D = this.contextFps;
        context.drawImage(this.canvasFps, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);
        context.fillStyle = this.bgCanvasColor;
        context.fillRect(WIDTH - 1, 0, 1, HEIGHT);
        let lastHeight: number = Math.floor(numFps / 60 * 20);
        if (lastHeight < 1) {
            lastHeight = 1;
        }
        context.fillStyle = this.fpsFrontColor;
        context.fillRect(WIDTH - 1, 20 - lastHeight, 1, lastHeight);
        const WIDTH_COST: number = this.WIDTH_COST;
        context = this.contextCost;
        context.drawImage(this.canvasCost, 1, 0, WIDTH_COST - 1, HEIGHT, 0, 0, WIDTH_COST - 1, HEIGHT);
        context.drawImage(this.canvasCost, WIDTH_COST + 2, 0, WIDTH_COST - 1, HEIGHT, WIDTH_COST + 1, 0, WIDTH_COST - 1, HEIGHT);
        let c1Height: number = Math.floor(numCostTicker / 2);
        if (c1Height < 1) {
            c1Height = 1;
        } else if (c1Height > 20) {
            c1Height = 20;
        }
        let c2Height: number = Math.floor(numCostRender / 2);
        if (c2Height < 1) {
            c2Height = 1;
        } else if (c2Height > 20) {
            c2Height = 20;
        }
        context.fillStyle = this.bgCanvasColor;
        context.fillRect(WIDTH_COST - 1, 0, 1, HEIGHT);
        context.fillRect(WIDTH_COST * 2, 0, 1, HEIGHT);
        context.fillRect(WIDTH_COST * 3 + 1, 0, 1, HEIGHT);
        context.fillStyle = this.cost1Color;
        context.fillRect(WIDTH_COST - 1, 20 - c1Height, 1, c1Height);
        context.fillStyle = this.cost3Color;
        context.fillRect(WIDTH_COST * 2, 20 - c2Height, 1, c2Height);
        const fpsAvg: number = Math.floor(fpsTotal / lenFps);
        let fpsOutput: string = numFps + " FPS " + this.renderMode;
        if (this.showPanle) {
            fpsOutput += "<br/>min" + fpsMin + " max" + fpsMax + " avg" + fpsAvg;
            this.divDraw.innerHTML = this.lastNumDraw + "<br/>";
            this.divCost.innerHTML = "<font  style=\"color:#18fefe\">" + numCostTicker + "<font/> <font  style=\"color:#ff0000\">" + numCostRender + "<font/>";
        }
        this.fps.innerHTML = fpsOutput;
    }
    public updateInfo(info: string): void {
        this.arrLog.push(info);
        this.updateLogLayout();
    }
    public updateWarn(info: string): void {
        this.arrLog.push("[Warning]" + info);
        this.updateLogLayout();
    }
    public updateError(info: string): void {
        this.arrLog.push("[Error]" + info);
        this.updateLogLayout();
    }
    public updateLogLayout(): void {
        this.log.innerHTML = this.arrLog.join("<br/>");
        while (document.body.clientHeight < this.log.offsetHeight + this.fpsHeight + this.panelY + this.fontSize * 2) {
            this.arrLog.shift();
            this.log.innerHTML = this.arrLog.join("<br/>");
        }
    }
}
__reflect(WebFps.prototype, "egret.web.WebFps", ["egret.FPSDisplay"]);

export class WebPlayer extends HashObject implements StageScreen {
    public declare playerOption: PlayerOptions;
    public declare container: HTMLElement;
    public declare canvas: InputCanvas;
    public declare stage: Stage;
    public declare player: Player;
    public declare webTouchHandler: WebTouchHandler;
    public declare webInput: HTMLInput;
    // public constructor(container: HTMLElement, options: RunEgretOptions) {
    //     super();
    //     this.init(container, options);
    //     this.initOrientation();
    // }
    public init(container: HTMLElement, options: RunEgretOptions): void {
        console.log("Egret Engine Version:", Capabilities.engineVersion);
        const option: PlayerOptions = this.readOption(container, options);
        const stage: Stage = new Stage();
        stage.$screen = this;
        stage.$scaleMode = option.scaleMode;
        stage.$orientation = option.orientation;
        stage.$maxTouches = option.maxTouches;
        stage.frameRate = option.frameRate;
        stage.textureScaleFactor = option.textureScaleFactor;
        const buffer: RenderBuffer = new RenderBuffHelper.RenderBuffer!(undefined, undefined, true);
        const canvas: InputCanvas = buffer.surface as InputCanvas;
        this.attachCanvas(container, canvas);
        const webTouch: WebTouchHandler = new WebTouchHandler(stage, canvas);
        const player: Player = new Player(buffer, stage, option.entryClass);
        LifecycleHelper.stage = stage;
        addLifecycleListener(WebLifeCycleHandler);
        const webInput: HTMLInput = new HTMLInput();
        if ((option.showFPS || option.showLog)) {
            player.displayFPS(option.showFPS, option.showLog, option.logFilter!, option.fpsStyles);
        }
        this.playerOption = option;
        this.container = container;
        this.canvas = canvas;
        this.stage = stage;
        this.player = player;
        this.webTouchHandler = webTouch;
        this.webInput = webInput;
        $cacheTextAdapter(webInput, stage, container, canvas);
        this.updateScreenSize();
        this.updateMaxTouches();
        player.start();
    }
    public initOrientation(): void {
        window.addEventListener("orientationchange", (): void => {
            window.setTimeout((): void => {
                StageOrientationEvent.dispatchStageOrientationEvent(this.stage, StageOrientationEvent.ORIENTATION_CHANGE);
            }, 350);
        });
    }
    public readOption(container: HTMLElement, _options: RunEgretOptions): PlayerOptions {
        const styles: Record<string, string | undefined> = {};
        const styleStr: string = container.getAttribute("data-show-fps-style") || "";
        const stylesArr: string[] = styleStr.split(",");
        for (let i: number = 0; i < stylesArr.length; i++) {
            const tempStyleArr: string[] = stylesArr[i]!.split(":");
            styles[tempStyleArr[0]!] = tempStyleArr[1];
        }
        return {
            // entryClass: container.getAttribute("data-entry-class"),
            entryClass         : _options.entryClass,
            scaleMode          : container.getAttribute("data-scale-mode") || StageScaleMode.NO_SCALE,
            frameRate          : Number(container.getAttribute("data-frame-rate")) || 30,
            contentWidth       : Number(container.getAttribute("data-content-width")) || 480,
            contentHeight      : Number(container.getAttribute("data-content-height")) || 800,
            orientation        : container.getAttribute("data-orientation") || OrientationMode.AUTO,
            maxTouches         : Number(container.getAttribute("data-multi-fingered")) || 2,
            textureScaleFactor : Number(container.getAttribute("texture-scale-factor")) || 1,
            showFPS            : container.getAttribute("data-show-fps") == "true",
            fpsStyles          : styles,
            showLog            : container.getAttribute("data-show-log") == "true",
            logFilter          : container.getAttribute("data-log-filter"),
        };
    }
    public attachCanvas(container: HTMLElement, canvas: HTMLCanvasElement): void {
        let style: CSSStyleDeclaration = canvas.style;
        style.cursor = "inherit";
        style.position = "absolute";
        style.top = style.bottom = style.left = style.right = "0";
        container.appendChild(canvas);
        style = container.style;
        style.overflow = "hidden";
        style.position = "absolute";
    }
    public updateScreenSize(): void {
        const canvas: InputCanvas = this.canvas;
        if (canvas.userTyping) {
            return;
        }
        const option: PlayerOptions = this.playerOption;
        const screenRect: DOMRect = this.container.getBoundingClientRect();
        let top: number = 0;
        const boundingClientWidth: number = screenRect.width;
        let boundingClientHeight: number = screenRect.height;
        if (boundingClientWidth == 0 || boundingClientHeight == 0) {
            return;
        }
        if (screenRect.top < 0) {
            boundingClientHeight += screenRect.top;
            top = -screenRect.top;
        }
        let shouldRotate: boolean = false;
        const orientation: string = this.stage.$orientation;
        if (orientation != OrientationMode.AUTO) {
            shouldRotate = orientation != OrientationMode.PORTRAIT && boundingClientHeight > boundingClientWidth
                || orientation == OrientationMode.PORTRAIT && boundingClientWidth > boundingClientHeight;
        }
        const screenWidth: number = shouldRotate ? boundingClientHeight : boundingClientWidth;
        const screenHeight: number = shouldRotate ? boundingClientWidth : boundingClientHeight;
        Capabilities.boundingClientWidth = screenWidth;
        Capabilities.boundingClientHeight = screenHeight;
        const stageSize: StageSize = ScreenAdapterHelper.screenAdapter!.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
        const stageWidth: number = stageSize.stageWidth;
        const stageHeight: number = stageSize.stageHeight;
        const displayWidth: number = stageSize.displayWidth;
        const displayHeight: number = stageSize.displayHeight;
        const style: CSSStyleDeclaration & Record<string, string> = canvas.style as CSSStyleDeclaration & Record<string, string>;
        style[getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
        if (canvas.width != stageWidth) {
            canvas.width = stageWidth;
        }
        if (canvas.height != stageHeight) {
            canvas.height = stageHeight;
        }
        let rotation: number = 0;
        if (shouldRotate) {
            if (orientation == OrientationMode.LANDSCAPE) {
                rotation = 90;
                canvas.style.top = top + (boundingClientHeight - displayWidth) / 2 + "px";
                canvas.style.left = (boundingClientWidth + displayHeight) / 2 + "px";
            } else {
                rotation = -90;
                canvas.style.top = top + (boundingClientHeight + displayWidth) / 2 + "px";
                canvas.style.left = (boundingClientWidth - displayHeight) / 2 + "px";
            }
        } else {
            canvas.style.top = top + (boundingClientHeight - displayHeight) / 2 + "px";
            canvas.style.left = (boundingClientWidth - displayWidth) / 2 + "px";
        }
        const scalex: number = displayWidth / stageWidth;
        const scaley: number = displayHeight / stageHeight;
        let canvasScaleX: number = scalex * DisplayList.$canvasScaleFactor;
        let canvasScaleY: number = scaley * DisplayList.$canvasScaleFactor;
        if (Capabilities.renderMode == "canvas") {
            canvasScaleX = Math.ceil(canvasScaleX);
            canvasScaleY = Math.ceil(canvasScaleY);
        }
        const m: Matrix = Matrix.create();
        m.identity();
        m.scale(scalex / canvasScaleX, scaley / canvasScaleY);
        m.rotate(rotation * Math.PI / 180);
        const transform: string = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.tx + "," + m.ty + ")";
        Matrix.release(m);
        style[getPrefixStyleName("transform")] = transform;
        DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
        this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
        this.webInput.$updateSize();
        this.player.updateStageSize(stageWidth, stageHeight);
    }
    public setContentSize(width: number, height: number): void {
        const option: PlayerOptions = this.playerOption;
        option.contentWidth = width;
        option.contentHeight = height;
        this.updateScreenSize();
    }
    public updateMaxTouches(): void {
        this.webTouchHandler.$updateMaxTouches();
    }
}
__reflect(WebPlayer.prototype, "egret.web.WebPlayer", ["egret.sys.Screen"]);

export class XMLNode {
    public nodeType: 1 | 3;
    public parent: XML | null;

    public constructor(nodeType: 1 | 3, parent: XML | null) {
        this.nodeType = nodeType;
        this.parent = parent;
    }
}
__reflect(XMLNode.prototype, "egret.web.XMLNode");

export class XML extends XMLNode {
    public localName: string;
    public prefix: string | null;
    public namespace: string | null;
    public name: string;
    public attributes: Record<string, string> = {};
    public children: (XML | XMLText)[] = [];

    [attribute: `$${string}`]: string;
    public constructor(localName: string, parent: XML | null, prefix: string | null, namespaceUri: string | null, name: string) {
        super(1, parent);

        this.localName = localName;
        this.prefix = prefix;
        this.namespace = namespaceUri;
        this.name = name;
    }
}
__reflect(XML.prototype, "egret.web.XML");

export class XMLText extends XMLNode {
    public text: string;
    public constructor(text: string, parent: XML) {
        super(3, parent);
        this.text = text;
    }
}
__reflect(XMLText.prototype, "egret.web.XMLText");

export class DomParserHelper {
    public static readonly parser = new DOMParser();
}

export class WebGLDrawCmdManager {
    public drawData: WebGLDrawData[] = [];
    public drawDataLen: number = 0;
    private nextData(): WebGLDrawData {
        return this.drawData[this.drawDataLen] ?? {
            type          : 0,
            count         : 0,
            texture       : null,
            filter        : null,
            textureWidth  : 0,
            textureHeight : 0,
            smoothing     : false,
            value         : "",
            buffer        : null,
            width         : 0,
            height        : 0,
            x             : 0,
            y             : 0,
        };
    }
    public pushDrawRect(): void {
        if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1]!.type != 1) {
            const data: WebGLDrawData = this.nextData();
            data.type = 1;
            data.count = 0;
            this.drawData[this.drawDataLen++] = data;
        }
        this.drawData[this.drawDataLen - 1]!.count += 2;
    }
    public pushDrawTexture(texture: EngineWebGLTexture | null, count: number = 2, filter?: Filter | null, textureWidth?: number, textureHeight?: number): void {
        if (filter) {
            const data: WebGLDrawData = this.nextData();
            data.type = 0;
            data.texture = texture;
            data.filter = filter;
            data.count = count;
            data.textureWidth = textureWidth;
            data.textureHeight = textureHeight;
            this.drawData[this.drawDataLen++] = data;
        } else {
            if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1]!.type != 0 || texture != this.drawData[this.drawDataLen - 1]!.texture || this.drawData[this.drawDataLen - 1]!.filter) {
                const data: WebGLDrawData = this.nextData();
                data.type = 0;
                data.texture = texture;
                data.count = 0;
                this.drawData[this.drawDataLen++] = data;
            }
            this.drawData[this.drawDataLen - 1]!.count += count;
        }
    }
    public pushChangeSmoothing(texture: EngineWebGLTexture, smoothing: boolean): void {
        texture.smoothing = smoothing;
        const data: WebGLDrawData = this.nextData();
        data.type = 10;
        data.texture = texture;
        data.smoothing = smoothing;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushPushMask(count: number = 1): void {
        const data: WebGLDrawData = this.nextData();
        data.type = 2;
        data.count = count * 2;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushPopMask(count: number = 1): void {
        const data: WebGLDrawData = this.nextData();
        data.type = 3;
        data.count = count * 2;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushSetBlend(value: string): void {
        const len: number = this.drawDataLen;
        let drawState: boolean = false;
        for (let i: number = len - 1; i >= 0; i--) {
            const data: WebGLDrawData | undefined = this.drawData[i];
            if (data) {
                if (data.type == 0 || data.type == 1) {
                    drawState = true;
                }
                if (!drawState && data.type == 4) {
                    this.drawData.splice(i, 1);
                    this.drawDataLen--;
                    continue;
                }
                if (data.type == 4) {
                    if (data.value == value) {
                        return;
                    } else {
                        break;
                    }
                }
            }
        }
        const data: WebGLDrawData = this.nextData();
        data.type = 4;
        data.value = value;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushResize(buffer: WebGLRenderBuffer, width: number, height: number): void {
        const data: WebGLDrawData = this.nextData();
        data.type = 5;
        data.buffer = buffer;
        data.width = width;
        data.height = height;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushClearColor(): void {
        const data: WebGLDrawData = this.nextData();
        data.type = 6;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushActivateBuffer(buffer: WebGLRenderBuffer): void {
        const len: number = this.drawDataLen;
        let drawState: boolean = false;
        for (let i: number = len - 1; i >= 0; i--) {
            const data: WebGLDrawData | undefined = this.drawData[i];
            if (data) {
                if (data.type != 4 && data.type != 7) {
                    drawState = true;
                }
                if (!drawState && data.type == 7) {
                    this.drawData.splice(i, 1);
                    this.drawDataLen--;
                    continue;
                }
            }
        }
        const data: WebGLDrawData = this.nextData();
        data.type = 7;
        data.buffer = buffer;
        data.width = buffer.rootRenderTarget!.width;
        data.height = buffer.rootRenderTarget!.height;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushEnableScissor(x: number, y: number, width: number, height: number): void {
        const data: WebGLDrawData = this.nextData();
        data.type = 8;
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;
        this.drawData[this.drawDataLen++] = data;
    }
    public pushDisableScissor(): void {
        const data: WebGLDrawData = this.nextData();
        data.type = 9;
        this.drawData[this.drawDataLen++] = data;
    }
    public clear(): void {
        for (let i: number = 0; i < this.drawDataLen; i++) {
            const data: WebGLDrawData = this.drawData[i]!;
            data.type = 0;
            data.count = 0;
            data.texture = null;
            data.filter = null;
            data.value = "";
            data.buffer = null;
            data.width = 0;
            data.height = 0;
            data.textureWidth = 0;
            data.textureHeight = 0;
            data.smoothing = false;
            data.x = 0;
            data.y = 0;
        }
        this.drawDataLen = 0;
    }
}
__reflect(WebGLDrawCmdManager.prototype, "egret.web.WebGLDrawCmdManager");

export class WebGLVertexArrayObject {
    public vertSize: number = 5;
    public vertByteSize: number = this.vertSize * 4;
    public maxQuadsCount: number = 2048;
    public maxVertexCount: number = this.maxQuadsCount * 4;
    public maxIndicesCount: number = this.maxQuadsCount * 6;
    public vertices: Float32Array;
    public indices: Uint16Array;
    public indicesForMesh: Uint16Array;
    public vertexIndex: number = 0;
    public indexIndex: number = 0;
    public hasMesh: boolean = false;
    public _vertices: ArrayBuffer;
    public _verticesFloat32View: Float32Array;
    public _verticesUint32View: Uint32Array;
    public constructor() {
        const numVerts: number = this.maxVertexCount * this.vertSize;
        this.vertices = new Float32Array(numVerts);
        this._vertices = new ArrayBuffer(this.maxVertexCount * this.vertByteSize);
        this._verticesFloat32View = new Float32Array(this._vertices);
        this._verticesUint32View = new Uint32Array(this._vertices);
        this.vertices = this._verticesFloat32View;
        const maxIndicesCount: number = this.maxIndicesCount;
        this.indices = new Uint16Array(maxIndicesCount);
        this.indicesForMesh = new Uint16Array(maxIndicesCount);
        for (let i: number = 0, j: number = 0; i < maxIndicesCount; i += 6, j += 4) {
            this.indices[i] = j;
            this.indices[i + 1] = j + 1;
            this.indices[i + 2] = j + 2;
            this.indices[i + 3] = j;
            this.indices[i + 4] = j + 2;
            this.indices[i + 5] = j + 3;
        }
    }
    public reachMaxSize(vertexCount: number = 4, indexCount: number = 6): boolean {
        return this.vertexIndex > this.maxVertexCount - vertexCount || this.indexIndex > this.maxIndicesCount - indexCount;
    }
    public getVertices(): Float32Array {
        const view: Float32Array = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
        return view;
    }
    public getIndices(): Uint16Array {
        return this.indices;
    }
    public getMeshIndices(): Uint16Array {
        return this.indicesForMesh;
    }
    public changeToMeshIndices(): void {
        if (!this.hasMesh) {
            for (let i: number = 0, l: number = this.indexIndex; i < l; ++i) {
                this.indicesForMesh[i] = this.indices[i]!;
            }
            this.hasMesh = true;
        }
    }
    public isMesh(): boolean {
        return this.hasMesh;
    }
    public cacheArrays(buffer: WebGLRenderBuffer, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
        destX: number, destY: number, destWidth: number, destHeight: number, textureSourceWidth: number, textureSourceHeight: number,
        meshUVs?: MeshArray | null, meshVertices?: MeshArray | null, meshIndices?: MeshArray | null, rotated?: boolean): void {
        let alpha: number = buffer.globalAlpha;
        alpha = Math.min(alpha, 1.0);
        const globalTintColor: number = buffer.globalTintColor || 0xFFFFFF;
        const currentTexture: EngineWebGLTexture | null = buffer.currentTexture;
        alpha = alpha < 1.0 && currentTexture && currentTexture[DefinitionHelper.UNPACK_PREMULTIPLY_ALPHA_WEBGL]
            ? WebGLUtils.premultiplyTint(globalTintColor, alpha) : globalTintColor + (alpha * 255 << 24);
        const locWorldTransform: Matrix = buffer.globalMatrix;
        let a: number = locWorldTransform.a;
        let b: number = locWorldTransform.b;
        let c: number = locWorldTransform.c;
        let d: number = locWorldTransform.d;
        let tx: number = locWorldTransform.tx;
        let ty: number = locWorldTransform.ty;
        const offsetX: number = buffer.$offsetX;
        const offsetY: number = buffer.$offsetY;
        if (offsetX != 0 || offsetY != 0) {
            tx = offsetX * a + offsetY * c + tx;
            ty = offsetX * b + offsetY * d + ty;
        }
        if (!meshVertices) {
            if (destX != 0 || destY != 0) {
                tx = destX * a + destY * c + tx;
                ty = destX * b + destY * d + ty;
            }
            const a1: number = destWidth / sourceWidth;
            if (a1 != 1) {
                a = a1 * a;
                b = a1 * b;
            }
            const d1: number = destHeight / sourceHeight;
            if (d1 != 1) {
                c = d1 * c;
                d = d1 * d;
            }
        }
        const vertices: Float32Array = this.vertices;
        const verticesUint32View: Uint32Array = this._verticesUint32View;
        let index: number = this.vertexIndex * this.vertSize;
        if (meshVertices) {
            for (let i: number = 0, l: number = meshUVs!.length; i < l; i += 2) {
                const iD: number = index + i * 5 / 2;
                const x: number = meshVertices[i]!;
                const y: number = meshVertices[i + 1]!;
                const u: number = meshUVs![i]!;
                const v: number = meshUVs![i + 1]!;
                vertices[iD] = a * x + c * y + tx;
                vertices[iD + 1] = b * x + d * y + ty;
                if (rotated) {
                    vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                    vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                } else {
                    vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                    vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                }
                verticesUint32View[iD + 4] = alpha;
            }
            if (this.hasMesh) {
                for (let i: number = 0, l: number = meshIndices!.length; i < l; ++i) {
                    this.indicesForMesh[this.indexIndex + i] = meshIndices![i]! + this.vertexIndex;
                }
            }
            this.vertexIndex += meshUVs!.length / 2;
            this.indexIndex += meshIndices!.length;
        } else {
            const width: number = textureSourceWidth;
            const height: number = textureSourceHeight;
            const w: number = sourceWidth;
            const h: number = sourceHeight;
            sourceX /= width;
            sourceY /= height;
            if (rotated) {
                const temp: number = sourceWidth;
                sourceWidth = sourceHeight / width;
                sourceHeight = temp / height;
                vertices[index++] = tx;
                vertices[index++] = ty;
                vertices[index++] = sourceWidth + sourceX;
                vertices[index++] = sourceY;
                verticesUint32View[index++] = alpha;
                vertices[index++] = a * w + tx;
                vertices[index++] = b * w + ty;
                vertices[index++] = sourceWidth + sourceX;
                vertices[index++] = sourceHeight + sourceY;
                verticesUint32View[index++] = alpha;
                vertices[index++] = a * w + c * h + tx;
                vertices[index++] = d * h + b * w + ty;
                vertices[index++] = sourceX;
                vertices[index++] = sourceHeight + sourceY;
                verticesUint32View[index++] = alpha;
                vertices[index++] = c * h + tx;
                vertices[index++] = d * h + ty;
                vertices[index++] = sourceX;
                vertices[index++] = sourceY;
                verticesUint32View[index] = alpha;
            } else {
                sourceWidth /= width;
                sourceHeight /= height;
                vertices[index++] = tx;
                vertices[index++] = ty;
                vertices[index++] = sourceX;
                vertices[index++] = sourceY;
                verticesUint32View[index++] = alpha;
                vertices[index++] = a * w + tx;
                vertices[index++] = b * w + ty;
                vertices[index++] = sourceWidth + sourceX;
                vertices[index++] = sourceY;
                verticesUint32View[index++] = alpha;
                vertices[index++] = a * w + c * h + tx;
                vertices[index++] = d * h + b * w + ty;
                vertices[index++] = sourceWidth + sourceX;
                vertices[index++] = sourceHeight + sourceY;
                verticesUint32View[index++] = alpha;
                vertices[index++] = c * h + tx;
                vertices[index++] = d * h + ty;
                vertices[index++] = sourceX;
                vertices[index++] = sourceHeight + sourceY;
                verticesUint32View[index] = alpha;
            }
            if (this.hasMesh) {
                const indicesForMesh: Uint16Array = this.indicesForMesh;
                indicesForMesh[this.indexIndex] = this.vertexIndex;
                indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                indicesForMesh[this.indexIndex + 3] = this.vertexIndex;
                indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
            }
            this.vertexIndex += 4;
            this.indexIndex += 6;
        }
    }
    public clear(): void {
        this.hasMesh = false;
        this.vertexIndex = 0;
        this.indexIndex = 0;
    }
}
__reflect(WebGLVertexArrayObject.prototype, "egret.web.WebGLVertexArrayObject");

export class WebGLRenderTarget extends HashObject {
    public clearColor: [number, number, number, number] = [0, 0, 0, 0];
    public useFrameBuffer: boolean = true;
    public declare width: number;
    public declare height: number;
    public declare texture: EngineWebGLTexture | null;
    public declare frameBuffer: WebGLFramebuffer | null;
    public declare stencilBuffer: WebGLRenderbuffer | null;
    public gl: WebGLRenderingContext;

    public constructor(gl: WebGLRenderingContext, width: number, height: number) {
        super();
        this.gl = gl;
        this._resize(width, height);
    }

    public _resize(width: number, height: number): void {
        width = width || 1;
        height = height || 1;
        if (width < 1) {
            warn("WebGLRenderTarget _resize width = " + width);
            width = 1;
        }
        if (height < 1) {
            warn("WebGLRenderTarget _resize height = " + height);
            height = 1;
        }
        this.width = width;
        this.height = height;
    }
    public resize(width: number, height: number): void {
        this._resize(width, height);
        const gl: WebGLRenderingContext = this.gl;
        if (this.frameBuffer) {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        if (this.stencilBuffer) {
            gl.deleteRenderbuffer(this.stencilBuffer);
            this.stencilBuffer = null;
        }
    }
    public activate(): void {
        const gl: WebGLRenderingContext = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
    }
    public getFrameBuffer(): WebGLFramebuffer | null {
        if (!this.useFrameBuffer) {
            return null;
        }
        return this.frameBuffer;
    }
    public initFrameBuffer(): void {
        if (!this.frameBuffer) {
            const gl: WebGLRenderingContext = this.gl;
            this.texture = this.createTexture();
            this.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        }
    }
    public createTexture(): EngineWebGLTexture | null {
        const webglrendercontext: WebGLRenderContext = WebGLRenderContext.getInstance(0, 0);
        return _createTexture(webglrendercontext, this.width, this.height, null);
    }
    public clear(bind?: boolean): void {
        const gl: WebGLRenderingContext = this.gl;
        if (bind) {
            this.activate();
        }
        gl.colorMask(true, true, true, true);
        gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    public enabledStencil(): void {
        if (!this.frameBuffer || this.stencilBuffer) {
            return;
        }
        const gl: WebGLRenderingContext = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        this.stencilBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
    }
    public dispose(): void {
        WebGLUtils.deleteWebGLTexture(this.texture);
    }
}
__reflect(WebGLRenderTarget.prototype, "egret.web.WebGLRenderTarget");

export class WebGLRenderContext {
    private static readonly debugLogCompressedTextureNotSupported: Record<number, boolean> = {};

    public static antialias: boolean = false;
    public static glContextId: number = 0;
    public static blendModesForGL: Record<string, [number, number]>;
    public static instance: WebGLRenderContext | undefined;
    public _defaultEmptyTexture: EngineWebGLTexture | null | undefined = null;
    public glID: number | null = null;
    public projectionX: number = NaN;
    public projectionY: number = NaN;
    public contextLost: boolean = false;
    public _supportedCompressedTextureInfo: CompressedTextureInfo[] = [];
    public $scissorState: boolean = false;
    public vertSize: number = 5;
    public surface: HTMLCanvasElement;
    public declare context: WebGLRenderingContext;
    public declare $bufferStack: WebGLRenderBuffer[];
    public declare vertexBuffer: WebGLBuffer | null;
    public declare indexBuffer: WebGLBuffer | null;
    public declare drawCmdManager: WebGLDrawCmdManager;
    public declare vao: WebGLVertexArrayObject;
    public declare currentBuffer: WebGLRenderBuffer;
    public declare activatedBuffer: WebGLRenderBuffer | null;
    public declare currentProgram: EgretWebGLProgram | undefined;
    public declare bindIndices: boolean;
    public declare $maxTextureSize: number;
    public declare pvrtc: CompressedTextureExtension | null;
    public declare etc1: CompressedTextureExtension | null;
    public declare $filter: Filter | null;
    public constructor(width: number, height: number) {
        this.surface = mainCanvas(width, height)!;
        this.initWebGL();
        this.$bufferStack = [];
        const gl: WebGLRenderingContext = this.context;
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.drawCmdManager = new WebGLDrawCmdManager();
        this.vao = new WebGLVertexArrayObject();
        this.setGlobalCompositeOperation("source-over");
    }
    public static getInstance(width: number, height: number): WebGLRenderContext {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new WebGLRenderContext(width, height);
        return this.instance;
    }
    public pushBuffer(buffer: WebGLRenderBuffer): void {
        this.$bufferStack.push(buffer);
        if (buffer != this.currentBuffer) {
            this.drawCmdManager.pushActivateBuffer(buffer);
        }
        this.currentBuffer = buffer;
    }
    public popBuffer(): void {
        if (this.$bufferStack.length <= 1) {
            return;
        }
        const buffer: WebGLRenderBuffer = this.$bufferStack.pop()!;
        const lastBuffer: WebGLRenderBuffer = this.$bufferStack[this.$bufferStack.length - 1]!;
        if (buffer != lastBuffer) {
            this.drawCmdManager.pushActivateBuffer(lastBuffer);
        }
        this.currentBuffer = lastBuffer;
    }
    public activateBuffer(buffer: WebGLRenderBuffer, width: number, height: number): void {
        buffer.rootRenderTarget!.activate();
        if (!this.bindIndices) {
            this.uploadIndicesArray(this.vao.getIndices());
        }
        buffer.restoreStencil();
        buffer.restoreScissor();
        this.onResize(width, height);
    }
    public uploadVerticesArray(array: Float32Array): void {
        const gl: WebGLRenderingContext = this.context;
        gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
    }
    public uploadIndicesArray(array: Uint16Array): void {
        const gl: WebGLRenderingContext = this.context;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
        this.bindIndices = true;
    }
    public destroy(): void {
        this.surface.width = this.surface.height = 0;
    }
    public onResize(width?: number, height?: number): void {
        width = width || this.surface.width;
        height = height || this.surface.height;
        this.projectionX = width / 2;
        this.projectionY = -height / 2;
        if (this.context) {
            this.context.viewport(0, 0, width, height);
        }
    }
    public resize(width: number, height: number, useMaxSize?: boolean): void {
        resizeContext(this, width, height, useMaxSize);
    }
    public _buildSupportedCompressedTextureInfo(extensions: (CompressedTextureExtension | null)[]): CompressedTextureInfo[] {
        const returnValue: CompressedTextureInfo[] = [];
        for (let i: number = 0; i < extensions.length; i++) {
            const extension: CompressedTextureExtension | null = extensions[i]!;
            if (!extension) {
                continue;
            }
            const info: CompressedTextureInfo = {
                extensionName    : extension.name,
                supportedFormats : [],
            };
            let key: string;
            for (key in extension) {
                info.supportedFormats.push([key, extension[key]!]);
            }
            if (info.supportedFormats.length === 0) {
                console.error("buildSupportedCompressedTextureInfo failed = " + extension.name);
            } else {
                log("support: " + extension.name);
                for (key in extension) {
                    const value: string | number = extension[key]!;
                    log(key, value, "0x" + (typeof value === "number" ? value.toString(16) : value.toString()));
                }
            }
            returnValue.push(info);
        }
        return returnValue;
    }
    public initWebGL(): void {
        this.onResize();
        this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
        this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
        this.getWebGLContext();
        const gl: WebGLRenderingContext = this.context;
        this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
        this.pvrtc = (gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc")) as CompressedTextureExtension | null;
        if (this.pvrtc) {
            this.pvrtc.name = "WEBGL_compressed_texture_pvrtc";
        }
        this.etc1 = (gl.getExtension("WEBGL_compressed_texture_etc1") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_etc1")) as CompressedTextureExtension | null;
        if (this.etc1) {
            this.etc1.name = "WEBGL_compressed_texture_etc1";
        }
        Capabilities.supportedCompressedTexture = Capabilities.supportedCompressedTexture || {
            pvrtc : false,
            etc1  : false,
        };
        Capabilities.supportedCompressedTexture.pvrtc = !!this.pvrtc;
        Capabilities.supportedCompressedTexture.etc1 = !!this.etc1;
        this._supportedCompressedTextureInfo = this._buildSupportedCompressedTextureInfo([this.etc1, this.pvrtc]);
    }
    public handleContextLost(): void {
        this.contextLost = true;
    }
    public handleContextRestored(): void {
        this.initWebGL();
        this.contextLost = false;
    }
    public getWebGLContext(): void {
        const gl: WebGLRenderingContext = getContextWebGL(this.surface)!;
        this.setContext(gl);
    }
    public setContext(gl: WebGLRenderingContext): void {
        this.context = gl;
        const engineGL: WebGLRenderingContext & { id: number } = gl as WebGLRenderingContext & { id: number };
        engineGL.id = WebGLRenderContext.glContextId++;
        this.glID = engineGL.id;
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.colorMask(true, true, true, true);
        gl.activeTexture(gl.TEXTURE0);
    }
    public enableStencilTest(): void {
        const gl: WebGLRenderingContext = this.context;
        gl.enable(gl.STENCIL_TEST);
    }
    public disableStencilTest(): void {
        const gl: WebGLRenderingContext = this.context;
        gl.disable(gl.STENCIL_TEST);
    }
    public enableScissorTest(rect: RenderRectangle): void {
        const gl: WebGLRenderingContext = this.context;
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(rect.x, rect.y, rect.width, rect.height);
    }
    public disableScissorTest(): void {
        const gl: WebGLRenderingContext = this.context;
        gl.disable(gl.SCISSOR_TEST);
    }
    public getPixels(x: number, y: number, width: number, height: number, pixels: Uint8Array | Uint8ClampedArray): void {
        const gl: WebGLRenderingContext = this.context;
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    public createTexture(bitmapData: TexImageSource): EngineWebGLTexture | undefined {
        return createTexture(this, bitmapData);
    }
    public checkCompressedTextureInternalFormat(supportedCompressedTextureInfo: CompressedTextureInfo[], internalFormat: number): boolean {
        for (let i: number = 0, length: number = supportedCompressedTextureInfo.length; i < length; ++i) {
            const ss: CompressedTextureInfo = supportedCompressedTextureInfo[i]!;
            const supportedFormats: [string, string | number][] = ss.supportedFormats;
            for (let j: number = 0, formatCount: number = supportedFormats.length; j < formatCount; ++j) {
                if (supportedFormats[j]![1] === internalFormat) {
                    return true;
                }
            }
        }
        return false;
    }
    public $debugLogCompressedTextureNotSupported(supportedCompressedTextureInfo: CompressedTextureInfo[], internalFormat: number): void {
        if (!WebGLRenderContext.debugLogCompressedTextureNotSupported[internalFormat]) {
            WebGLRenderContext.debugLogCompressedTextureNotSupported[internalFormat] = true;
            log("internalFormat = " + internalFormat + ":0x" + internalFormat.toString(16) + ", the current hardware does not support the corresponding compression format.");
            for (let i: number = 0, length: number = supportedCompressedTextureInfo.length; i < length; ++i) {
                const ss: CompressedTextureInfo = supportedCompressedTextureInfo[i]!;
                if (ss.supportedFormats.length > 0) {
                    log("support = " + ss.extensionName);
                    for (let j: number = 0, formatCount: number = ss.supportedFormats.length; j < formatCount; ++j) {
                        const tp: [string, string | number] = ss.supportedFormats[j]!;
                        log(tp[0] + " : " + tp[1] + " : 0x" + (typeof tp[1] === "number" ? tp[1].toString(16) : tp[1].toString()));
                    }
                }
            }
        }
    }
    public createCompressedTexture(data: Uint8Array, width: number, height: number, levels: number, internalFormat: number): EngineWebGLTexture | undefined {
        const checkSupported: boolean = this.checkCompressedTextureInternalFormat(this._supportedCompressedTextureInfo, internalFormat);
        if (!checkSupported) {
            this.$debugLogCompressedTextureNotSupported(this._supportedCompressedTextureInfo, internalFormat);
            return this.defaultEmptyTexture;
        }
        const gl: WebGLRenderingContext = this.context;
        const texture: EngineWebGLTexture | null = gl.createTexture();
        if (!texture) {
            this.contextLost = true;
            return;
        }
        texture[DefinitionHelper.glContext] = gl;
        texture[DefinitionHelper.is_compressed_texture] = true;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        texture[DefinitionHelper.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
        gl.compressedTexImage2D(gl.TEXTURE_2D, levels, internalFormat, width, height, 0, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    public updateTexture(texture: EngineWebGLTexture, bitmapData: TexImageSource): void {
        const gl: WebGLRenderingContext = this.context;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
    }
    public get defaultEmptyTexture(): EngineWebGLTexture | undefined {
        if (!this._defaultEmptyTexture) {
            const size: number = 16;
            const canvas: HTMLCanvasElement = createCanvas(size, size)!;
            const context: CanvasContext = getContext2d(canvas)!;
            context.fillStyle = "white";
            context.fillRect(0, 0, size, size);
            this._defaultEmptyTexture = this.createTexture(canvas);
            this._defaultEmptyTexture![DefinitionHelper.engine_default_empty_texture] = true;
        }
        return this._defaultEmptyTexture;
    }
    public getWebGLTexture(bitmapData: BitmapData): EngineWebGLTexture | null | undefined {
        if (!bitmapData.webGLTexture) {
            if (bitmapData.format == "image" && !bitmapData.hasCompressed2d()) {
                bitmapData.webGLTexture = this.createTexture(bitmapData.source as TexImageSource);
            } else if (bitmapData.hasCompressed2d()) {
                const compressedData: CompressedTextureData = bitmapData.getCompressed2dTextureData()!;
                bitmapData.webGLTexture = this.createCompressedTexture(compressedData.byteArray, compressedData.width, compressedData.height, compressedData.level, compressedData.glInternalFormat);
                const etcAlphaMask: BitmapData | null = bitmapData.etcAlphaMask;
                if (etcAlphaMask) {
                    const maskTexture: EngineWebGLTexture | null | undefined = this.getWebGLTexture(etcAlphaMask);
                    if (maskTexture) {
 bitmapData.webGLTexture![DefinitionHelper.etc_alpha_mask] = maskTexture;
                    }
                }
            }
            if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                if (bitmapData.source) {
                    bitmapData.source.src = "";
                    bitmapData.source = null;
                }
                bitmapData.clearCompressedTextureData();
            }
            if (bitmapData.webGLTexture) {
                bitmapData.webGLTexture.smoothing = true;
            }
        }
        return bitmapData.webGLTexture;
    }
    public clearRect(x: number, y: number, width: number, height: number): void {
        if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
            const buffer: WebGLRenderBuffer = this.currentBuffer;
            if (buffer.$hasScissor) {
                this.setGlobalCompositeOperation("destination-out");
                this.drawRect(x, y, width, height);
                this.setGlobalCompositeOperation("source-over");
            } else {
                const m: Matrix = buffer.globalMatrix;
                if (m.b == 0 && m.c == 0) {
                    x = x * m.a + m.tx;
                    y = y * m.d + m.ty;
                    width *= m.a;
                    height *= m.d;
                    this.enableScissor(x, -y - height + buffer.height, width, height);
                    this.clear();
                    this.disableScissor();
                } else {
                    this.setGlobalCompositeOperation("destination-out");
                    this.drawRect(x, y, width, height);
                    this.setGlobalCompositeOperation("source-over");
                }
            }
        } else {
            this.clear();
        }
    }
    public setGlobalCompositeOperation(value: string): void {
        this.drawCmdManager.pushSetBlend(value);
    }
    public drawImage(image: BitmapData | WebGLRenderTarget | HTMLCanvasElement | null, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
        destX: number, destY: number, destWidth: number, destHeight: number, imageSourceWidth: number, imageSourceHeight: number, rotated?: boolean, smoothing?: boolean): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        if (this.contextLost || !image || !buffer) {
            return;
        }
        let texture: EngineWebGLTexture | null | undefined;
        let offsetX: number | undefined;
        let offsetY: number | undefined;
        const renderImage: RenderImage = image as RenderImage;
        if (renderImage.texture || (renderImage.source && renderImage.source.texture)) {
            texture = renderImage.texture || renderImage.source!.texture;
            buffer.saveTransform();
            offsetX = buffer.$offsetX;
            offsetY = buffer.$offsetY;
            buffer.useOffset();
            buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
        } else if (!renderImage.source && !renderImage.webGLTexture) {
            return;
        } else {
            texture = this.getWebGLTexture(image as BitmapData);
        }
        if (!texture) {
            return;
        }
        this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, undefined, undefined, undefined, undefined, rotated, smoothing);
        if (renderImage.source && renderImage.source.texture) {
            buffer.$offsetX = offsetX!;
            buffer.$offsetY = offsetY!;
            buffer.restoreTransform();
        }
    }
    public drawMesh(image: BitmapData | WebGLRenderTarget | null, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
        destX: number, destY: number, destWidth: number, destHeight: number, imageSourceWidth: number, imageSourceHeight: number,
        meshUVs: MeshArray, meshVertices: MeshArray, meshIndices: MeshArray, bounds: RenderRectangle, rotated?: boolean, smoothing?: boolean): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        if (this.contextLost || !image || !buffer) {
            return;
        }
        let texture: EngineWebGLTexture | null | undefined;
        let offsetX: number | undefined;
        let offsetY: number | undefined;
        const renderImage: RenderImage = image;
        if (renderImage.texture || (renderImage.source && renderImage.source.texture)) {
            texture = renderImage.texture || renderImage.source!.texture;
            buffer.saveTransform();
            offsetX = buffer.$offsetX;
            offsetY = buffer.$offsetY;
            buffer.useOffset();
            buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
        } else if (!renderImage.source && !renderImage.webGLTexture) {
            return;
        } else {
            texture = this.getWebGLTexture(image as BitmapData);
        }
        if (!texture) {
            return;
        }
        this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);
        if (renderImage.texture || (renderImage.source && renderImage.source.texture)) {
            buffer.$offsetX = offsetX!;
            buffer.$offsetY = offsetY!;
            buffer.restoreTransform();
        }
    }
    public drawTexture(texture: EngineWebGLTexture, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
        destX: number, destY: number, destWidth: number, destHeight: number, textureWidth: number, textureHeight: number,
        meshUVs?: MeshArray | null, meshVertices?: MeshArray | null, meshIndices?: MeshArray | null, _bounds?: RenderRectangle, rotated?: boolean, smoothing?: boolean): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        if (this.contextLost || !texture || !buffer) {
            return;
        }
        if (meshVertices && meshIndices) {
            if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                this.$drawWebGL();
            }
        } else if (this.vao.reachMaxSize()) {
            this.$drawWebGL();
        }
        if (smoothing != undefined && texture.smoothing != smoothing) {
            this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
        }
        if (meshUVs) {
            this.vao.changeToMeshIndices();
        }
        const count: number = meshIndices ? meshIndices.length / 3 : 2;
        this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);
        buffer.currentTexture = texture;
        this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, rotated);
    }
    public drawRect(x: number, y: number, width: number, height: number): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        if (this.contextLost || !buffer) {
            return;
        }
        if (this.vao.reachMaxSize()) {
            this.$drawWebGL();
        }
        this.drawCmdManager.pushDrawRect();
        buffer.currentTexture = null;
        this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
    }
    public pushMask(x: number, y: number, width: number, height: number): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        if (this.contextLost || !buffer) {
            return;
        }
        buffer.$stencilList.push({
            x,
            y,
            width,
            height,
        });
        if (this.vao.reachMaxSize()) {
            this.$drawWebGL();
        }
        this.drawCmdManager.pushPushMask();
        buffer.currentTexture = null;
        this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
    }
    public popMask(): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        if (this.contextLost || !buffer) {
            return;
        }
        const mask: RenderRectangle = buffer.$stencilList.pop()!;
        if (this.vao.reachMaxSize()) {
            this.$drawWebGL();
        }
        this.drawCmdManager.pushPopMask();
        buffer.currentTexture = null;
        this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
    }
    public clear(): void {
        this.drawCmdManager.pushClearColor();
    }
    public enableScissor(x: number, y: number, width: number, height: number): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        this.drawCmdManager.pushEnableScissor(x, y, width, height);
        buffer.$hasScissor = true;
    }
    public disableScissor(): void {
        const buffer: WebGLRenderBuffer = this.currentBuffer;
        this.drawCmdManager.pushDisableScissor();
        buffer.$hasScissor = false;
    }
    public $drawWebGL(): void {
        if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
            return;
        }
        this.uploadVerticesArray(this.vao.getVertices());
        if (this.vao.isMesh()) {
            this.uploadIndicesArray(this.vao.getMeshIndices());
        }
        const length: number = this.drawCmdManager.drawDataLen;
        let offset: number = 0;
        for (let i: number = 0; i < length; i++) {
            const data: WebGLDrawData = this.drawCmdManager.drawData[i]!;
            offset = this.drawData(data, offset);
            if (data.type == 7) {
                this.activatedBuffer = data.buffer;
            }
            if (data.type == 0 || data.type == 1 || data.type == 2 || data.type == 3) {
                if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                    this.activatedBuffer.$drawCalls++;
                }
            }
        }
        if (this.vao.isMesh()) {
            this.uploadIndicesArray(this.vao.getIndices());
        }
        this.drawCmdManager.clear();
        this.vao.clear();
    }
    public drawData(data: WebGLDrawData, offset: number): number;
    public drawData(data: null | undefined, offset: number): undefined;
    public drawData(data: WebGLDrawData | null | undefined, offset: number): number | undefined {
        if (!data) {
            return;
        }
        const gl: WebGLRenderingContext = this.context;
        let program: EgretWebGLProgram | undefined;
        const filter: Filter | null | undefined = data.filter;
        let buffer: WebGLRenderBuffer | null;
        switch (data.type) {
            case 0:
                if (filter) {
                    if (filter.type === "custom") {
                        const customFilter: CustomFilter = filter as CustomFilter;
                        program = EgretWebGLProgram.getProgram(gl, customFilter.$vertexSrc, customFilter.$fragmentSrc, customFilter.$shaderKey);
                    } else if (filter.type === "colorTransform") {
                        if (data.texture![DefinitionHelper.etc_alpha_mask]) {
                            gl.activeTexture(gl.TEXTURE1);
                            gl.bindTexture(gl.TEXTURE_2D, data.texture![DefinitionHelper.etc_alpha_mask]!);
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.colorTransform_frag_etc_alphamask_frag, "colorTransform_frag_etc_alphamask_frag");
                        } else {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.colorTransform_frag, "colorTransform");
                        }
                    } else if (filter.type === "blurX" || filter.type === "blurY") {
                        program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.blur_frag, "blur");
                    } else if (filter.type === "glow") {
                        program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.glow_frag, "glow");
                    }
                } else {
                    if (data.texture![DefinitionHelper.etc_alpha_mask]) {
                        program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.texture_etc_alphamask_frag, DefinitionHelper.etc_alpha_mask);
                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, data.texture![DefinitionHelper.etc_alpha_mask]!);
                    } else {
                        program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.texture_frag, "texture");
                    }
                }
                this.activeProgram(gl, program!);
                this.syncUniforms(program!, filter, data.textureWidth, data.textureHeight);
                offset += this.drawTextureElements(data, offset);
                break;
            case 1:
            case 2:
            case 3:
                program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.primitive_frag, "primitive");
                this.activeProgram(gl, program);
                this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                if (data.type == 1) {
                    offset += this.drawRectElements(data, offset);
                } else if (data.type == 2) {
                    offset += this.drawPushMaskElements(data, offset);
                } else {
                    offset += this.drawPopMaskElements(data, offset);
                }
                break;
            case 4: this.setBlendMode(data.value);
                break;
            case 5: data.buffer!.rootRenderTarget!.resize(data.width, data.height);
                this.onResize(data.width, data.height);
                break;
            case 6:
                if (this.activatedBuffer) {
                    const target: WebGLRenderTarget = this.activatedBuffer.rootRenderTarget!;
                    if (target.width != 0 || target.height != 0) {
                        target.clear(true);
                    }
                }
                break;
            case 7: this.activateBuffer(data.buffer!, data.width, data.height);
                break;
            case 8:
                buffer = this.activatedBuffer;
                if (buffer) {
                    if (buffer.rootRenderTarget) {
                        buffer.rootRenderTarget.enabledStencil();
                    }
                    buffer.enableScissor(data.x, data.y, data.width, data.height);
                }
                break;
            case 9: buffer = this.activatedBuffer;
                if (buffer) {
                    buffer.disableScissor();
                }
                break;
            case 10:
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
                if (data.smoothing) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                }
                break;
            default: break;
        }
        return offset;
    }
    public activeProgram(gl: WebGLRenderingContext, program: EgretWebGLProgram): void {
        if (program != this.currentProgram) {
            gl.useProgram(program.id);
            const attribute: Record<string, { location: number }> = program.attributes;
            let key: string;
            for (key in attribute) {
                if (key === "aVertexPosition") {
                    gl.vertexAttribPointer(attribute.aVertexPosition!.location, 2, gl.FLOAT, false, 5 * 4, 0);
                    gl.enableVertexAttribArray(attribute.aVertexPosition!.location);
                } else if (key === "aTextureCoord") {
                    gl.vertexAttribPointer(attribute.aTextureCoord!.location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
                    gl.enableVertexAttribArray(attribute.aTextureCoord!.location);
                } else if (key === "aColor") {
                    gl.vertexAttribPointer(attribute.aColor!.location, 4, gl.UNSIGNED_BYTE, true, 5 * 4, 4 * 4);
                    gl.enableVertexAttribArray(attribute.aColor!.location);
                }
            }
            this.currentProgram = program;
        }
    }
    public syncUniforms(program: EgretWebGLProgram, filter: Filter | null | undefined, textureWidth?: number, textureHeight?: number): void {
        const uniforms: EgretWebGLProgram["uniforms"] = program.uniforms;
        let key: string;
        for (key in uniforms) {
            if (key === "projectionVector") {
 uniforms[key]!.setValue({
     x : this.projectionX,
     y : this.projectionY,
 });
            } else if (key === "uTextureSize") {
 uniforms[key]!.setValue({
     x : textureWidth!,
     y : textureHeight!,
 });
            } else if (key === "uSampler") {
 uniforms[key]!.setValue(0);
            } else if (key === "uSamplerAlphaMask") {
 uniforms[key]!.setValue(1);
            } else {
                const value: unknown = filter!.$uniforms[key];
                if (value !== undefined) {
 uniforms[key]!.setValue(value as UniformInput);
                }
            }
        }
    }
    public drawTextureElements(data: WebGLDrawData, offset: number): number {
        return drawTextureElements(this, data, offset);
    }
    public drawRectElements(data: WebGLDrawData, offset: number): number {
        const gl: WebGLRenderingContext = this.context;
        const size: number = data.count * 3;
        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
        return size;
    }
    public drawPushMaskElements(data: WebGLDrawData, offset: number): number {
        const gl: WebGLRenderingContext = this.context;
        const size: number = data.count * 3;
        const buffer: WebGLRenderBuffer | null = this.activatedBuffer;
        if (buffer) {
            if (buffer.rootRenderTarget) {
                buffer.rootRenderTarget.enabledStencil();
            }
            if (buffer.stencilHandleCount == 0) {
                buffer.enableStencil();
                gl.clear(gl.STENCIL_BUFFER_BIT);
            }
            const level: number = buffer.stencilHandleCount;
            buffer.stencilHandleCount++;
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.EQUAL, level, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            gl.colorMask(true, true, true, true);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        }
        return size;
    }
    public drawPopMaskElements(data: WebGLDrawData, offset: number): number {
        const gl: WebGLRenderingContext = this.context;
        const size: number = data.count * 3;
        const buffer: WebGLRenderBuffer | null = this.activatedBuffer;
        if (buffer) {
            buffer.stencilHandleCount--;
            if (buffer.stencilHandleCount == 0) {
                buffer.disableStencil();
            } else {
                const level: number = buffer.stencilHandleCount;
                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            }
        }
        return size;
    }
    public setBlendMode(value: string): void {
        const gl: WebGLRenderingContext = this.context;
        const blendModeWebGL: [number, number] | undefined = WebGLRenderContext.blendModesForGL[value];
        if (blendModeWebGL) {
            gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
        }
    }
    public drawTargetWidthFilters(filters: Filter[], input: WebGLRenderBuffer): void {
        const originInput: WebGLRenderBuffer = input;
        const filtersLen: number = filters.length;
        let output: WebGLRenderBuffer;
        if (filtersLen > 1) {
            for (let i: number = 0; i < filtersLen - 1; i++) {
                const filter: Filter = filters[i]!;
                const width: number = input.rootRenderTarget!.width;
                const height: number = input.rootRenderTarget!.height;
                output = WebGLRenderBuffer.create(width, height);
                output.setTransform(1, 0, 0, 1, 0, 0);
                output.globalAlpha = 1;
                this.drawToRenderTarget(filter, input, output);
                if (input != originInput) {
                    WebGLRenderBuffer.release(input);
                }
                input = output;
            }
        }
        const filter: Filter = filters[filtersLen - 1]!;
        this.drawToRenderTarget(filter, input, this.currentBuffer);
        if (input != originInput) {
            WebGLRenderBuffer.release(input);
        }
    }
    public drawToRenderTarget(filter: Filter, input: WebGLRenderBuffer, output: WebGLRenderBuffer): void {
        if (this.contextLost) {
            return;
        }
        if (this.vao.reachMaxSize()) {
            this.$drawWebGL();
        }
        this.pushBuffer(output);
        const originInput: WebGLRenderBuffer = input;
        let temp: WebGLRenderBuffer;
        const width: number = input.rootRenderTarget!.width;
        const height: number = input.rootRenderTarget!.height;
        if (filter.type == "blur") {
            const blurFilter: BlurFilter = filter as BlurFilter;
            const blurXFilter: BlurFilter["blurXFilter"] = blurFilter.blurXFilter;
            const blurYFilter: BlurFilter["blurYFilter"] = blurFilter.blurYFilter;
            if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                temp = WebGLRenderBuffer.create(width, height);
                temp.setTransform(1, 0, 0, 1, 0, 0);
                temp.globalAlpha = 1;
                this.drawToRenderTarget(blurXFilter, input, temp);
                if (input != originInput) {
                    WebGLRenderBuffer.release(input);
                }
                input = temp;
                filter = blurYFilter;
            } else {
                filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
            }
        }
        output.saveTransform();
        output.transform(1, 0, 0, -1, 0, height);
        output.currentTexture = input.rootRenderTarget!.texture;
        this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
        output.restoreTransform();
        this.drawCmdManager.pushDrawTexture(input.rootRenderTarget!.texture, 2, filter, width, height);
        if (input != originInput) {
            WebGLRenderBuffer.release(input);
        }
        this.popBuffer();
    }
    public static initBlendMode(): void {
        WebGLRenderContext.blendModesForGL = {};
        WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
        WebGLRenderContext.blendModesForGL["lighter"] = [1, 1];
        WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
        WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
        WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
    }
}
__reflect(WebGLRenderContext.prototype, "egret.web.WebGLRenderContext", ["egret.sys.RenderContext"]);
WebGLRenderContext.initBlendMode();

export class WebGLRenderBuffer extends HashObject implements RenderBuffer {
    private static readonly bufferPool: WebGLRenderBuffer[] = [];

    public currentTexture: EngineWebGLTexture | null = null;
    public globalAlpha: number = 1;
    public globalTintColor: number = 0xFFFFFF;
    public stencilState: boolean = false;
    public $stencilList: RenderRectangle[] = [];
    public stencilHandleCount: number = 0;
    public $scissorState: boolean = false;
    public scissorRect: Rectangle = new Rectangle();
    public $hasScissor: boolean = false;
    public $drawCalls: number = 0;
    public $computeDrawCall: boolean = false;
    public globalMatrix: Matrix = new Matrix();
    public savedGlobalMatrix: Matrix = new Matrix();
    public $offsetX: number = 0;
    public $offsetY: number = 0;
    public context: WebGLRenderContext;
    public surface: BufferSurface;
    public rootRenderTarget: WebGLRenderTarget | null;
    public declare root: boolean | undefined;
    public static autoClear: boolean = true;
    public constructor(width: number = NaN, height: number = NaN, root?: boolean) {
        super();
        this.context = WebGLRenderContext.getInstance(width, height);
        this.rootRenderTarget = new WebGLRenderTarget(this.context.context, 3, 3);
        if (width && height) {
            this.resize(width, height);
        }
        this.root = root;
        if (this.root) {
            this.context.pushBuffer(this);
            this.surface = this.context.surface;
            this.$computeDrawCall = true;
        } else {
            const lastBuffer: WebGLRenderBuffer | null = this.context.activatedBuffer;
            if (lastBuffer) {
 lastBuffer.rootRenderTarget!.activate();
            }
            this.rootRenderTarget.initFrameBuffer();
            this.surface = this.rootRenderTarget;
        }
    }
    public enableStencil(): void {
        if (!this.stencilState) {
            this.context.enableStencilTest();
            this.stencilState = true;
        }
    }
    public disableStencil(): void {
        if (this.stencilState) {
            this.context.disableStencilTest();
            this.stencilState = false;
        }
    }
    public restoreStencil(): void {
        if (this.stencilState) {
            this.context.enableStencilTest();
        } else {
            this.context.disableStencilTest();
        }
    }
    public enableScissor(x: number, y: number, width: number, height: number): void {
        if (!this.$scissorState) {
            this.$scissorState = true;
            this.scissorRect.setTo(x, y, width, height);
            this.context.enableScissorTest(this.scissorRect);
        }
    }
    public disableScissor(): void {
        if (this.$scissorState) {
            this.$scissorState = false;
            this.scissorRect.setEmpty();
            this.context.disableScissorTest();
        }
    }
    public restoreScissor(): void {
        if (this.$scissorState) {
            this.context.enableScissorTest(this.scissorRect);
        } else {
            this.context.disableScissorTest();
        }
    }
    public get width(): number {
        return this.rootRenderTarget!.width;
    }
    public get height(): number {
        return this.rootRenderTarget!.height;
    }
    public resize(width: number, height: number, useMaxSize?: boolean): void {
        width = width || 1;
        height = height || 1;
        this.context.pushBuffer(this);
        const target: WebGLRenderTarget = this.rootRenderTarget!;
        if (width != target.width || height != target.height) {
            this.context.drawCmdManager.pushResize(this, width, height);
            target.width = width;
            target.height = height;
        }
        if (this.root) {
            this.context.resize(width, height, useMaxSize);
        }
        this.context.clear();
        this.context.popBuffer();
    }
    public getPixels(x: number, y: number, width: number = 1, height: number = 1): Uint8Array {
        const pixels: Uint8Array = new Uint8Array(4 * width * height);
        {
            const target: WebGLRenderTarget = this.rootRenderTarget!;
            const useFrameBuffer: boolean = target.useFrameBuffer;
            target.useFrameBuffer = true;
            target.activate();
            this.context.getPixels(x, y, width, height, pixels);
            target.useFrameBuffer = useFrameBuffer;
            target.activate();
        }
        const result: Uint8Array = new Uint8Array(4 * width * height);
        for (let i: number = 0; i < height; i++) {
            for (let j: number = 0; j < width; j++) {
                const index1: number = (width * (height - i - 1) + j) * 4;
                const index2: number = (width * i + j) * 4;
                const a: number = pixels[index2 + 3]!;
                result[index1] = Math.round(pixels[index2]! / a * 255);
                result[index1 + 1] = Math.round(pixels[index2 + 1]! / a * 255);
                result[index1 + 2] = Math.round(pixels[index2 + 2]! / a * 255);
                result[index1 + 3] = a;
            }
        }
        return result;
    }
    public toDataURL(type?: string, encoderOptions?: number): string {
        return this.context.surface.toDataURL(type, encoderOptions);
    }
    public destroy(): void {
        this.context.destroy();
    }
    public onRenderFinish(): void {
        this.$drawCalls = 0;
    }
    public drawFrameBufferToSurface(sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, clear: boolean = false): void {
        const target: WebGLRenderTarget = this.rootRenderTarget!;
        target.useFrameBuffer = false;
        target.activate();
        this.context.disableStencilTest();
        this.context.disableScissorTest();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.globalAlpha = 1;
        this.context.setGlobalCompositeOperation("source-over");
        if (clear) {
            this.context.clear();
        }
        this.context.drawImage(target, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
        this.context.$drawWebGL();
        target.useFrameBuffer = true;
        target.activate();
        this.restoreStencil();
        this.restoreScissor();
    }
    public drawSurfaceToFrameBuffer(sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, clear: boolean = false): void {
        const target: WebGLRenderTarget = this.rootRenderTarget!;
        target.useFrameBuffer = true;
        target.activate();
        this.context.disableStencilTest();
        this.context.disableScissorTest();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.globalAlpha = 1;
        this.context.setGlobalCompositeOperation("source-over");
        if (clear) {
            this.context.clear();
        }
        this.context.drawImage(this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
        this.context.$drawWebGL();
        target.useFrameBuffer = false;
        target.activate();
        this.restoreStencil();
        this.restoreScissor();
    }
    public clear(): void {
        this.context.pushBuffer(this);
        this.context.clear();
        this.context.popBuffer();
    }
    public setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        const matrix: Matrix = this.globalMatrix;
        matrix.a = a;
        matrix.b = b;
        matrix.c = c;
        matrix.d = d;
        matrix.tx = tx;
        matrix.ty = ty;
    }
    public transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        const matrix: Matrix = this.globalMatrix;
        const a1: number = matrix.a;
        const b1: number = matrix.b;
        const c1: number = matrix.c;
        const d1: number = matrix.d;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            matrix.a = a * a1 + b * c1;
            matrix.b = a * b1 + b * d1;
            matrix.c = c * a1 + d * c1;
            matrix.d = c * b1 + d * d1;
        }
        matrix.tx = tx * a1 + ty * c1 + matrix.tx;
        matrix.ty = tx * b1 + ty * d1 + matrix.ty;
    }
    public useOffset(): void {
        if (this.$offsetX != 0 || this.$offsetY != 0) {
            this.globalMatrix.append(1, 0, 0, 1, this.$offsetX, this.$offsetY);
            this.$offsetX = this.$offsetY = 0;
        }
    }
    public saveTransform(): void {
        this.savedGlobalMatrix.copyFrom(this.globalMatrix);
    }
    public restoreTransform(): void {
        this.globalMatrix.copyFrom(this.savedGlobalMatrix);
    }
    public static create(width: number, height: number): WebGLRenderBuffer {
        let buffer: WebGLRenderBuffer | undefined = WebGLRenderBuffer.bufferPool.pop();
        if (buffer) {
            buffer.resize(width, height);
            buffer.setTransform(1, 0, 0, 1, 0, 0);
            buffer.globalAlpha = 1;
            buffer.$offsetX = 0;
            buffer.$offsetY = 0;
        } else {
            buffer = new WebGLRenderBuffer(width, height);
            buffer.$computeDrawCall = false;
        }
        return buffer;
    }
    public static release(buffer: WebGLRenderBuffer): void {
        WebGLRenderBuffer.bufferPool.push(buffer);
    }
}
__reflect(WebGLRenderBuffer.prototype, "egret.web.WebGLRenderBuffer", ["egret.sys.RenderBuffer"]);

export class WebGLRenderer implements SystemRenderer {
    private static readonly defaultCompositeOp: GlobalCompositeOperation = "source-over";
    private static readonly blendModes: GlobalCompositeOperation[] = ["source-over", "lighter", "destination-out"];
    private static readonly rendererBufferPool: WebGLRenderBuffer[] = [];
    public static readonly property_drawLabel = "DrawLabel";

    public wxiOS10: boolean = false;
    public nestLevel: number = 0;
    public declare canvasRenderer: CanvasRenderer | undefined;
    public declare canvasRenderBuffer: CanvasRenderBuffer | undefined;
    public render(displayObject: DisplayObject, buffer: RenderBuffer, matrix: Matrix, _forRenderTexture?: boolean): number {
        void _forRenderTexture;

        this.nestLevel++;
        const webglBuffer: WebGLRenderBuffer = buffer as WebGLRenderBuffer;
        const context: WebGLRenderContext = webglBuffer.context;
        context.pushBuffer(webglBuffer);
        webglBuffer.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
        this.drawDisplayObject(displayObject, webglBuffer, matrix.tx, matrix.ty, true);
        context.$drawWebGL();
        const drawCall: number = webglBuffer.$drawCalls;
        webglBuffer.onRenderFinish();
        context.popBuffer();
        const invert: Matrix = Matrix.create();
        matrix.$invertInto(invert);
        webglBuffer.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
        Matrix.release(invert);
        this.nestLevel--;
        if (this.nestLevel === 0) {
            if (WebGLRenderer.rendererBufferPool.length > 6) {
                WebGLRenderer.rendererBufferPool.length = 6;
            }
            const length: number = WebGLRenderer.rendererBufferPool.length;
            for (let i: number = 0; i < length; i++) {
                WebGLRenderer.rendererBufferPool[i]!.resize(0, 0);
            }
        }
        return drawCall;
    }
    public drawDisplayObject(displayObject: DisplayObject, buffer: WebGLRenderBuffer, offsetX: number, offsetY: number, isStage?: boolean): number {
        let drawCalls: number = 0;
        let node: RenderNode | null;
        const displayList: DisplayList | null = displayObject.$displayList;
        if (displayList && !isStage) {
            if (displayObject.$cacheDirty || displayObject.$renderDirty || displayList.$canvasScaleX != DisplayList.$canvasScaleX || displayList.$canvasScaleY != DisplayList.$canvasScaleY) {
                drawCalls += displayList.drawToSurface();
            }
            node = displayList.$renderNode;
        } else {
            node = displayObject.$renderDirty ? displayObject.$getRenderNode() : displayObject.$renderNode;
        }
        displayObject.$cacheDirty = false;
        if (node) {
            drawCalls++;
            this.renderNode(node, buffer, offsetX, offsetY);
            buffer.$offsetX = 0;
            buffer.$offsetY = 0;
        }
        if (displayList && !isStage) {
            return drawCalls;
        }
        const children: DisplayObject[] | null = displayObject.$children;
        if (children) {
            if (displayObject.sortableChildren && displayObject.$sortDirty) {
                displayObject.sortChildren();
            }
            const length: number = children.length;
            for (let i: number = 0; i < length; i++) {
                const child: DisplayObject = children[i]!;
                let offsetX2: number;
                let offsetY2: number;
                let tempAlpha: number | undefined;
                let tempTintColor: number | undefined;
                if (child.$alpha != 1) {
                    tempAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= child.$alpha;
                }
                if (child.tint !== 0xFFFFFF) {
                    tempTintColor = buffer.globalTintColor;
                    buffer.globalTintColor = child.$tintRGB;
                }
                let savedMatrix: Matrix | undefined;
                if (child.$useTranslate) {
                    const m: Matrix = child.$getMatrix();
                    offsetX2 = offsetX + child.$x;
                    offsetY2 = offsetY + child.$y;
                    savedMatrix = Matrix.create();
                    savedMatrix.copyFrom(buffer.globalMatrix);
                    buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                    offsetX2 = -child.$anchorOffsetX;
                    offsetY2 = -child.$anchorOffsetY;
                } else {
                    offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                    offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                }
                switch (child.$renderMode) {
                    case 1: break;
                    case 2: drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                        break;
                    case 3: drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                        break;
                    case 4: drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                        break;
                    default: drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                        break;
                }
                if (tempAlpha) {
                    buffer.globalAlpha = tempAlpha;
                }
                if (tempTintColor) {
                    buffer.globalTintColor = tempTintColor;
                }
                if (savedMatrix) {
                    buffer.globalMatrix.copyFrom(savedMatrix);
                    Matrix.release(savedMatrix);
                }
            }
        }
        return drawCalls;
    }
    public drawWithFilter(displayObject: DisplayObject, buffer: WebGLRenderBuffer, offsetX: number, offsetY: number): number {
        let drawCalls: number = 0;
        if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
            return drawCalls;
        }
        const filters: Filter[] = displayObject.$filters!;
        const hasBlendMode: boolean = displayObject.$blendMode !== 0;
        const compositeOp: GlobalCompositeOperation = WebGLRenderer.blendModes[displayObject.$blendMode] || WebGLRenderer.defaultCompositeOp;
        const displayBounds: Rectangle = displayObject.$getOriginalBounds();
        const displayBoundsX: number = displayBounds.x;
        const displayBoundsY: number = displayBounds.y;
        const displayBoundsWidth: number = displayBounds.width;
        const displayBoundsHeight: number = displayBounds.height;
        if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
            return drawCalls;
        }
        const filter: Filter | undefined = filters[0];
        if (!displayObject.mask && filters.length == 1 && filter && (filter.type == "colorTransform" || (filter.type === "custom" && (filter as CustomFilter).padding === 0))) {
            const childrenDrawCount: number = this.getRenderCount(displayObject);
            if (!displayObject.$children || childrenDrawCount == 1) {
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(compositeOp);
                }
                buffer.context.$filter = filter;
                if (displayObject.$mask) {
                    drawCalls += this.drawWithClip(displayObject, buffer, offsetX, offsetY);
                } else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
                } else {
                    drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                }
                buffer.context.$filter = null;
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(WebGLRenderer.defaultCompositeOp);
                }
                return drawCalls;
            }
        }
        const displayBuffer: WebGLRenderBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
        displayBuffer.context.pushBuffer(displayBuffer);
        if (displayObject.$mask) {
            drawCalls += this.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
        } else if (displayObject.$scrollRect || displayObject.$maskRect) {
            drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
        } else {
            drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
        }
        displayBuffer.context.popBuffer();
        if (drawCalls > 0) {
            if (hasBlendMode) {
                buffer.context.setGlobalCompositeOperation(compositeOp);
            }
            drawCalls++;
            buffer.$offsetX = offsetX + displayBoundsX;
            buffer.$offsetY = offsetY + displayBoundsY;
            const savedMatrix: Matrix = Matrix.create();
            const curMatrix: Matrix = buffer.globalMatrix;
            savedMatrix.copyFrom(curMatrix);
            buffer.useOffset();
            buffer.context.drawTargetWidthFilters(filters, displayBuffer);
            curMatrix.copyFrom(savedMatrix);
            Matrix.release(savedMatrix);
            if (hasBlendMode) {
                buffer.context.setGlobalCompositeOperation(WebGLRenderer.defaultCompositeOp);
            }
        }
        WebGLRenderer.rendererBufferPool.push(displayBuffer);
        return drawCalls;
    }
    public getRenderCount(displayObject: DisplayObject): number {
        let drawCount: number = 0;
        const node: RenderNode | null = displayObject.$getRenderNode();
        if (node) {
            drawCount += node.$getRenderCount();
        }
        if (displayObject.$children) {
            const children: DisplayObject[] = displayObject.$children;
            for (let i: number = 0; i < children.length; i++) {
                const child: DisplayObject = children[i]!;
                const filters: Filter[] | null | undefined = child.$filters;
                if (filters && filters.length > 0) {
                    return 2;
                } else if (child.$children) {
                    drawCount += this.getRenderCount(child);
                } else {
                    const childNode: RenderNode | null = child.$getRenderNode();
                    if (childNode) {
                        drawCount += childNode.$getRenderCount();
                    }
                }
            }
        }
        return drawCount;
    }
    public drawWithClip(displayObject: DisplayObject, buffer: WebGLRenderBuffer, offsetX: number, offsetY: number): number {
        let drawCalls: number = 0;
        const hasBlendMode: boolean = displayObject.$blendMode !== 0;
        const compositeOp: GlobalCompositeOperation = WebGLRenderer.blendModes[displayObject.$blendMode] || WebGLRenderer.defaultCompositeOp;
        const scrollRect: Rectangle | null = displayObject.$scrollRect || displayObject.$maskRect;
        const mask: DisplayObject | null = displayObject.$mask;
        if (mask) {
            const maskRenderMatrix: Matrix = mask.$getMatrix();
            if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                return drawCalls;
            }
        }
        if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
            if (scrollRect) {
                buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
            }
            if (hasBlendMode) {
                buffer.context.setGlobalCompositeOperation(compositeOp);
            }
            drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
            if (hasBlendMode) {
                buffer.context.setGlobalCompositeOperation(WebGLRenderer.defaultCompositeOp);
            }
            if (scrollRect) {
                buffer.context.popMask();
            }
            return drawCalls;
        }
        const displayBounds: Rectangle = displayObject.$getOriginalBounds();
        const displayBoundsX: number = displayBounds.x;
        const displayBoundsY: number = displayBounds.y;
        const displayBoundsWidth: number = displayBounds.width;
        const displayBoundsHeight: number = displayBounds.height;
        if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
            return drawCalls;
        }
        const displayBuffer: WebGLRenderBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
        displayBuffer.context.pushBuffer(displayBuffer);
        drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
        if (mask) {
            const maskBuffer: WebGLRenderBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
            maskBuffer.context.pushBuffer(maskBuffer);
            const maskMatrix: Matrix = Matrix.create();
            maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
            mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
            maskMatrix.translate(-displayBoundsX, -displayBoundsY);
            maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
            Matrix.release(maskMatrix);
            drawCalls += this.drawDisplayObject(mask, maskBuffer, 0, 0);
            maskBuffer.context.popBuffer();
            displayBuffer.context.setGlobalCompositeOperation("destination-in");
            displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
            const target: WebGLRenderTarget = maskBuffer.rootRenderTarget!;
            const maskBufferWidth: number = target.width;
            const maskBufferHeight: number = target.height;
            displayBuffer.context.drawTexture(target.texture!, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
            displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
            displayBuffer.context.setGlobalCompositeOperation("source-over");
            maskBuffer.setTransform(1, 0, 0, 1, 0, 0);
            WebGLRenderer.rendererBufferPool.push(maskBuffer);
        }
        displayBuffer.context.setGlobalCompositeOperation(WebGLRenderer.defaultCompositeOp);
        displayBuffer.context.popBuffer();
        if (drawCalls > 0) {
            drawCalls++;
            if (hasBlendMode) {
                buffer.context.setGlobalCompositeOperation(compositeOp);
            }
            if (scrollRect) {
                buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
            }
            const savedMatrix: Matrix = Matrix.create();
            const curMatrix: Matrix = buffer.globalMatrix;
            savedMatrix.copyFrom(curMatrix);
            curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
            const target: WebGLRenderTarget = displayBuffer.rootRenderTarget!;
            const displayBufferWidth: number = target.width;
            const displayBufferHeight: number = target.height;
            buffer.context.drawTexture(target.texture!, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
            if (scrollRect) {
                displayBuffer.context.popMask();
            }
            if (hasBlendMode) {
                buffer.context.setGlobalCompositeOperation(WebGLRenderer.defaultCompositeOp);
            }
            buffer.globalMatrix.copyFrom(savedMatrix);
            Matrix.release(savedMatrix);
        }
        WebGLRenderer.rendererBufferPool.push(displayBuffer);
        return drawCalls;
    }
    public drawWithScrollRect(displayObject: DisplayObject, buffer: WebGLRenderBuffer, offsetX: number, offsetY: number): number {
        let drawCalls: number = 0;
        const scrollRect: Rectangle = (displayObject.$scrollRect || displayObject.$maskRect)!;
        if (scrollRect.isEmpty()) {
            return drawCalls;
        }
        if (displayObject.$scrollRect) {
            offsetX -= scrollRect.x;
            offsetY -= scrollRect.y;
        }
        const m: Matrix = buffer.globalMatrix;
        const context: WebGLRenderContext = buffer.context;
        let scissor: boolean = false;
        if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
            context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
        } else {
            const a: number = m.a;
            const d: number = m.d;
            const tx: number = m.tx;
            const ty: number = m.ty;
            const x: number = scrollRect.x + offsetX;
            const y: number = scrollRect.y + offsetY;
            const xMax: number = x + scrollRect.width;
            const yMax: number = y + scrollRect.height;
            let minX: number;
            let minY: number;
            let maxX: number;
            let maxY: number;
            if (a == 1.0 && d == 1.0) {
                minX = x + tx;
                minY = y + ty;
                maxX = xMax + tx;
                maxY = yMax + ty;
            } else {
                let x0: number = a * x + tx;
                let y0: number = d * y + ty;
                let x1: number = a * xMax + tx;
                let y1: number = d * y + ty;
                let x2: number = a * xMax + tx;
                let y2: number = d * yMax + ty;
                let x3: number = a * x + tx;
                let y3: number = d * yMax + ty;
                let tmp: number;
                if (x0 > x1) {
                    tmp = x0;
                    x0 = x1;
                    x1 = tmp;
                }
                if (x2 > x3) {
                    tmp = x2;
                    x2 = x3;
                    x3 = tmp;
                }
                minX = x0 < x2 ? x0 : x2;
                maxX = x1 > x3 ? x1 : x3;
                if (y0 > y1) {
                    tmp = y0;
                    y0 = y1;
                    y1 = tmp;
                }
                if (y2 > y3) {
                    tmp = y2;
                    y2 = y3;
                    y3 = tmp;
                }
                minY = y0 < y2 ? y0 : y2;
                maxY = y1 > y3 ? y1 : y3;
            }
            context.enableScissor(minX, -maxY + buffer.height, maxX - minX, maxY - minY);
            scissor = true;
        }
        drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
        if (scissor) {
            context.disableScissor();
        } else {
            context.popMask();
        }
        return drawCalls;
    }
    public drawNodeToBuffer(node: RenderNode, buffer: RenderBuffer, matrix: Matrix, forHitTest?: boolean): void {
        const webglBuffer: WebGLRenderBuffer = buffer as WebGLRenderBuffer;
        webglBuffer.context.pushBuffer(webglBuffer);
        webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.renderNode(node, webglBuffer, 0, 0, forHitTest);
        webglBuffer.context.$drawWebGL();
        webglBuffer.onRenderFinish();
        webglBuffer.context.popBuffer();
    }
    public drawDisplayToBuffer(displayObject: DisplayObject, buffer: WebGLRenderBuffer, matrix?: Matrix): number {
        buffer.context.pushBuffer(buffer);
        if (matrix) {
            buffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        }
        const node: RenderNode | null = displayObject.$renderDirty ? displayObject.$getRenderNode() : displayObject.$renderNode;
        let drawCalls: number = 0;
        if (node) {
            drawCalls++;
            this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
        }
        const children: DisplayObject[] | null = displayObject.$children;
        if (children) {
            const length: number = children.length;
            for (let i: number = 0; i < length; i++) {
                const child: DisplayObject = children[i]!;
                switch (child.$renderMode) {
                    case 1: break;
                    case 2: drawCalls += this.drawWithFilter(child, buffer, 0, 0);
                        break;
                    case 3: drawCalls += this.drawWithClip(child, buffer, 0, 0);
                        break;
                    case 4: drawCalls += this.drawWithScrollRect(child, buffer, 0, 0);
                        break;
                    default: drawCalls += this.drawDisplayObject(child, buffer, 0, 0);
                        break;
                }
            }
        }
        buffer.context.$drawWebGL();
        buffer.onRenderFinish();
        buffer.context.popBuffer();
        return drawCalls;
    }
    public renderNode(node: RenderNode, buffer: WebGLRenderBuffer, offsetX: number, offsetY: number, forHitTest?: boolean): void {
        buffer.$offsetX = offsetX;
        buffer.$offsetY = offsetY;
        switch (node.type) {
            case 1: this.renderBitmap(node as BitmapNode, buffer);
                break;
            case 2: this.renderText(node as TextNode, buffer);
                break;
            case 3: this.renderGraphics(node as GraphicsNode, buffer, forHitTest);
                break;
            case 4: this.renderGroup(node as GroupNode, buffer);
                break;
            case 5: this.renderMesh(node as MeshNode, buffer);
                break;
            case 6: this.renderNormalBitmap(node as NormalBitmapNode, buffer);
                break;
        }
    }
    public renderNormalBitmap(node: NormalBitmapNode, buffer: WebGLRenderBuffer): void {
        const image: BitmapData | null = node.image;
        if (!image) {
            return;
        }
        buffer.context.drawImage(image, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX, node.drawY, node.drawW, node.drawH, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
    }
    public renderBitmap(node: BitmapNode, buffer: WebGLRenderBuffer): void {
        const image: BitmapData | null = node.image;
        if (!image) {
            return;
        }
        const data: number[] = node.drawData;
        const length: number = data.length;
        let pos: number = 0;
        const m: Matrix | null = node.matrix;
        const blendMode: number | null = node.blendMode;
        const alpha: number = node.alpha;
        let savedMatrix: Matrix | undefined;
        let offsetX: number = buffer.$offsetX;
        let offsetY: number = buffer.$offsetY;
        if (m) {
            savedMatrix = Matrix.create();
            savedMatrix.copyFrom(buffer.globalMatrix);
            offsetX = buffer.$offsetX;
            offsetY = buffer.$offsetY;
            buffer.useOffset();
            buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }
        if (blendMode) {
            buffer.context.setGlobalCompositeOperation(WebGLRenderer.blendModes[blendMode]!);
        }
        let originAlpha: number = buffer.globalAlpha;
        if (alpha == alpha) {
            originAlpha = buffer.globalAlpha;
            buffer.globalAlpha *= alpha;
        }
        if (node.filter) {
            buffer.context.$filter = node.filter;
            while (pos < length) {
                buffer.context.drawImage(image, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
            }
            buffer.context.$filter = null;
        } else {
            while (pos < length) {
                buffer.context.drawImage(image, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
            }
        }
        if (blendMode) {
            buffer.context.setGlobalCompositeOperation(WebGLRenderer.defaultCompositeOp);
        }
        if (alpha == alpha) {
            buffer.globalAlpha = originAlpha;
        }
        if (m) {
            buffer.globalMatrix.copyFrom(savedMatrix!);
            buffer.$offsetX = offsetX;
            buffer.$offsetY = offsetY;
            Matrix.release(savedMatrix!);
        }
    }
    public renderMesh(node: MeshNode, buffer: WebGLRenderBuffer): void {
        const image: BitmapData | null = node.image;
        const data: number[] = node.drawData;
        const length: number = data.length;
        let pos: number = 0;
        const m: Matrix | null = node.matrix;
        const blendMode: number | null = node.blendMode;
        const alpha: number = node.alpha;
        let savedMatrix: Matrix | undefined;
        let offsetX: number = buffer.$offsetX;
        let offsetY: number = buffer.$offsetY;
        if (m) {
            savedMatrix = Matrix.create();
            savedMatrix.copyFrom(buffer.globalMatrix);
            offsetX = buffer.$offsetX;
            offsetY = buffer.$offsetY;
            buffer.useOffset();
            buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }
        if (blendMode) {
            buffer.context.setGlobalCompositeOperation(WebGLRenderer.blendModes[blendMode]!);
        }
        let originAlpha: number = buffer.globalAlpha;
        if (alpha == alpha) {
            originAlpha = buffer.globalAlpha;
            buffer.globalAlpha *= alpha;
        }
        if (node.filter) {
            buffer.context.$filter = node.filter;
            while (pos < length) {
                buffer.context.drawMesh(image!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
            }
            buffer.context.$filter = null;
        } else {
            while (pos < length) {
                buffer.context.drawMesh(image!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
            }
        }
        if (blendMode) {
            buffer.context.setGlobalCompositeOperation(WebGLRenderer.defaultCompositeOp);
        }
        if (alpha == alpha) {
            buffer.globalAlpha = originAlpha;
        }
        if (m) {
            buffer.globalMatrix.copyFrom(savedMatrix!);
            buffer.$offsetX = offsetX;
            buffer.$offsetY = offsetY;
            Matrix.release(savedMatrix!);
        }
    }
    public ___renderText____(node: TextNode, buffer: WebGLRenderBuffer): void {
        const width: number = node.width - node.x;
        const height: number = node.height - node.y;
        if (width <= 0 || height <= 0 || !width || !height || node.drawData.length === 0) {
            return;
        }
        let canvasScaleX: number = DisplayList.$canvasScaleX;
        let canvasScaleY: number = DisplayList.$canvasScaleY;
        const maxTextureSize: number = buffer.context.$maxTextureSize;
        if (width * canvasScaleX > maxTextureSize) {
            canvasScaleX *= maxTextureSize / (width * canvasScaleX);
        }
        if (height * canvasScaleY > maxTextureSize) {
            canvasScaleY *= maxTextureSize / (height * canvasScaleY);
        }


        const x: number = node.x * canvasScaleX;
        const y: number = node.y * canvasScaleY;
        if (node.$canvasScaleX !== canvasScaleX || node.$canvasScaleY !== canvasScaleY) {
            node.$canvasScaleX = canvasScaleX;
            node.$canvasScaleY = canvasScaleY;
            node.dirtyRender = true;
        }
        if (x || y) {
            buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
        }
        if (node.dirtyRender) {
            TextAtlasRender.analysisTextNodeAndFlushDrawLabel(node);
        }
        const drawCommands: DrawLabel[] | undefined = node[WebGLRenderer.property_drawLabel];
        if (drawCommands && drawCommands.length > 0) {
            const saveOffsetX: number = buffer.$offsetX;
            const saveOffsetY: number = buffer.$offsetY;
            for (let i: number = 0, length: number = drawCommands.length; i < length; ++i) {
                const cmd: DrawLabel = drawCommands[i]!;
                const anchorX: number = cmd.anchorX;
                const anchorY: number = cmd.anchorY;
                const textBlocks: TextBlock[] = cmd.textBlocks;
                buffer.$offsetX = saveOffsetX + anchorX;
                for (let j: number = 0, length1: number = textBlocks.length; j < length1; ++j) {
                    const tb: TextBlock = textBlocks[j]!;
                    if (j > 0) {
                        buffer.$offsetX -= tb.canvasWidthOffset;
                    }
                    buffer.$offsetY = saveOffsetY + anchorY - (tb.measureHeight + (tb.stroke2 ? tb.canvasHeightOffset : 0)) / 2;
                    const page: Page = tb.line!.page!;
                    buffer.context.drawTexture(page.webGLTexture!, tb.u, tb.v, tb.contentWidth, tb.contentHeight, 0, 0, tb.contentWidth, tb.contentHeight, page.pageWidth, page.pageHeight);
                    buffer.$offsetX += tb.contentWidth - tb.canvasWidthOffset;
                }
            }
            buffer.$offsetX = saveOffsetX;
            buffer.$offsetY = saveOffsetY;
        }
        if (x || y) {
            buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
        }
        node.dirtyRender = false;
    }
    public renderText(node: TextNode, buffer: WebGLRenderBuffer): void {
        let width: number = node.width - node.x;
        let height: number = node.height - node.y;
        if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
            return;
        }
        let canvasScaleX: number = DisplayList.$canvasScaleX;
        let canvasScaleY: number = DisplayList.$canvasScaleY;
        const maxTextureSize: number = buffer.context.$maxTextureSize;
        if (width * canvasScaleX > maxTextureSize) {
            canvasScaleX *= maxTextureSize / (width * canvasScaleX);
        }
        if (height * canvasScaleY > maxTextureSize) {
            canvasScaleY *= maxTextureSize / (height * canvasScaleY);
        }
        width *= canvasScaleX;
        height *= canvasScaleY;
        const x: number = node.x * canvasScaleX;
        const y: number = node.y * canvasScaleY;
        if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
            node.$canvasScaleX = canvasScaleX;
            node.$canvasScaleY = canvasScaleY;
            node.dirtyRender = true;
        }
        if (this.wxiOS10) {
            if (!this.canvasRenderer) {
                this.canvasRenderer = new CanvasRenderer();
            }
            if (node.dirtyRender) {
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            }
        } else {
            if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                this.canvasRenderer = new CanvasRenderer();
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            } else if (node.dirtyRender) {
                this.canvasRenderBuffer.resize(width, height);
            }
        }
        const canvasBuffer: CanvasRenderBuffer = this.canvasRenderBuffer!;
        if (!canvasBuffer.context) {
            return;
        }
        if (canvasScaleX != 1 || canvasScaleY != 1) {
            canvasBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
        }
        if (x || y) {
            if (node.dirtyRender) {
                canvasBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, -x, -y);
            }
            buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
        } else if (canvasScaleX != 1 || canvasScaleY != 1) {
            canvasBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
        }
        if (node.dirtyRender) {
            const surface: TextureCanvas = canvasBuffer.surface;
            this.canvasRenderer!.renderText(node, canvasBuffer.context);
            if (this.wxiOS10) {
                surface.isCanvas = true;
                node.$texture = surface;
            } else {
                let texture: EngineWebGLTexture | null | undefined = node.$texture;
                if (!texture) {
                    texture = buffer.context.createTexture(surface);
                    node.$texture = texture;
                } else {
                    buffer.context.updateTexture(texture, surface);
                }
            }
            node.$textureWidth = surface.width;
            node.$textureHeight = surface.height;
        }
        const textureWidth: number = node.$textureWidth;
        const textureHeight: number = node.$textureHeight;
        buffer.context.drawTexture(node.$texture!, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
        if (x || y) {
            if (node.dirtyRender) {
                canvasBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
            }
            buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
        }
        node.dirtyRender = false;
    }
    public renderGraphics(node: GraphicsNode, buffer: WebGLRenderBuffer, forHitTest?: boolean): void {
        let width: number = node.width;
        let height: number = node.height;
        if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
            return;
        }
        let canvasScaleX: number = DisplayList.$canvasScaleX;
        let canvasScaleY: number = DisplayList.$canvasScaleY;
        if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
            canvasScaleX = canvasScaleY = 1;
        }
        if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
            node.$canvasScaleX = canvasScaleX;
            node.$canvasScaleY = canvasScaleY;
            node.dirtyRender = true;
        }
        width *= canvasScaleX;
        height *= canvasScaleY;
        const width2: number = Math.ceil(width);
        const height2: number = Math.ceil(height);
        canvasScaleX *= width2 / width;
        canvasScaleY *= height2 / height;
        width = width2;
        height = height2;
        if (this.wxiOS10) {
            if (!this.canvasRenderer) {
                this.canvasRenderer = new CanvasRenderer();
            }
            if (node.dirtyRender) {
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            }
        } else {
            if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                this.canvasRenderer = new CanvasRenderer();
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            } else if (node.dirtyRender) {
                this.canvasRenderBuffer.resize(width, height);
            }
        }
        const canvasBuffer: CanvasRenderBuffer = this.canvasRenderBuffer!;
        if (!canvasBuffer.context) {
            return;
        }
        if (canvasScaleX != 1 || canvasScaleY != 1) {
            canvasBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
        }
        if (node.x || node.y) {
            if (node.dirtyRender || forHitTest) {
                canvasBuffer.context.translate(-node.x, -node.y);
            }
            buffer.transform(1, 0, 0, 1, node.x, node.y);
        }
        const surface: TextureCanvas = canvasBuffer.surface;
        if (forHitTest) {
            this.canvasRenderer!.renderGraphics(node, canvasBuffer.context, true);
            let texture: EngineWebGLTexture | null | undefined;
            if (this.wxiOS10) {
                surface.isCanvas = true;
                texture = surface;
            } else {
                WebGLUtils.deleteWebGLTexture(surface);
                texture = buffer.context.getWebGLTexture(surface as TextureCanvas & BitmapData);
            }
            buffer.context.drawTexture(texture!, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
        } else {
            if (node.dirtyRender) {
                this.canvasRenderer!.renderGraphics(node, canvasBuffer.context);
                if (this.wxiOS10) {
                    surface.isCanvas = true;
                    node.$texture = surface;
                } else {
                    let texture: EngineWebGLTexture | null | undefined = node.$texture;
                    if (!texture) {
                        texture = buffer.context.createTexture(surface);
                        node.$texture = texture;
                    } else {
                        buffer.context.updateTexture(texture, surface);
                    }
                }
                node.$textureWidth = surface.width;
                node.$textureHeight = surface.height;
            }
            const textureWidth: number = node.$textureWidth;
            const textureHeight: number = node.$textureHeight;
            buffer.context.drawTexture(node.$texture!, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
        }
        if (node.x || node.y) {
            if (node.dirtyRender || forHitTest) {
                canvasBuffer.context.translate(node.x, node.y);
            }
            buffer.transform(1, 0, 0, 1, -node.x, -node.y);
        }
        if (!forHitTest) {
            node.dirtyRender = false;
        }
    }
    public renderGroup(groupNode: GroupNode, buffer: WebGLRenderBuffer): void {
        const m: Matrix | null = groupNode.matrix;
        let savedMatrix: Matrix | undefined;
        let offsetX: number = buffer.$offsetX;
        let offsetY: number = buffer.$offsetY;
        if (m) {
            savedMatrix = Matrix.create();
            savedMatrix.copyFrom(buffer.globalMatrix);
            offsetX = buffer.$offsetX;
            offsetY = buffer.$offsetY;
            buffer.useOffset();
            buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }
        const children: RenderNode[] = groupNode.drawData;
        const length: number = children.length;
        for (let i: number = 0; i < length; i++) {
            const node: RenderNode = children[i]!;
            this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
        }
        if (m) {
            buffer.globalMatrix.copyFrom(savedMatrix!);
            buffer.$offsetX = offsetX;
            buffer.$offsetY = offsetY;
            Matrix.release(savedMatrix!);
        }
    }
    public createRenderBuffer(width: number, height: number): WebGLRenderBuffer {
        let buffer: WebGLRenderBuffer | undefined = WebGLRenderer.rendererBufferPool.pop();
        if (buffer) {
            buffer.resize(width, height);
        } else {
            buffer = new WebGLRenderBuffer(width, height);
            buffer.$computeDrawCall = false;
        }
        return buffer;
    }
}
__reflect(WebGLRenderer.prototype, "egret.web.WebGLRenderer", ["egret.sys.SystemRenderer"]);

export class TextBlock extends HashObject {
    private _width: number = 0;
    private _height: number = 0;
    private _border: number = 0;
    public line: Line | null = null;
    public x: number = 0;
    public y: number = 0;
    public u: number = 0;
    public v: number = 0;
    public tag: string = "";
    public measureWidth: number = 0;
    public measureHeight: number = 0;
    public canvasWidthOffset: number = 0;
    public canvasHeightOffset: number = 0;
    public stroke2: number = 0;
    public constructor(width: number, height: number, measureWidth: number, measureHeight: number, canvasWidthOffset: number, canvasHeightOffset: number, stroke2: number, border: number) {
        super();
        this._width = width;
        this._height = height;
        this._border = border;
        this.measureWidth = measureWidth;
        this.measureHeight = measureHeight;
        this.canvasWidthOffset = canvasWidthOffset;
        this.canvasHeightOffset = canvasHeightOffset;
        this.stroke2 = stroke2;
    }
    public get border(): number {
        return this._border;
    }
    public get width(): number {
        return this._width + this.border * 2;
    }
    public get height(): number {
        return this._height + this.border * 2;
    }
    public get contentWidth(): number {
        return this._width;
    }
    public get contentHeight(): number {
        return this._height;
    }
    public get page(): Page | null {
        return this.line ? this.line.page : null;
    }
    public updateUV(): boolean {
        const line: Line | null = this.line;
        if (!line) {
            return false;
        }
        this.u = line.x + this.x + this.border;
        this.v = line.y + this.y + this.border;
        return true;
    }
    public get subImageOffsetX(): number {
        const line: Line | null = this.line;
        return line ? line.x + this.x + this.border : 0;
    }
    public get subImageOffsetY(): number {
        const line: Line | null = this.line;
        return line ? line.y + this.y + this.border : 0;
    }
}
__reflect(TextBlock.prototype, "egret.web.TextBlock");

export class Line extends HashObject {
    public page: Page | null = null;
    public textBlocks: TextBlock[] = [];
    public dynamicMaxHeight: number = 0;
    public maxWidth: number = 0;
    public x: number = 0;
    public y: number = 0;
    public constructor(maxWidth: number) {
        super();
        this.maxWidth = maxWidth;
    }
    public isCapacityOf(textBlock: TextBlock | null | undefined): boolean {
        if (!textBlock) {
            return false;
        }
        let posx: number = 0;
        const lastTxtBlock: TextBlock | null = this.lastTextBlock();
        if (lastTxtBlock) {
            posx = lastTxtBlock.x + lastTxtBlock.width;
        }
        if (posx + textBlock.width > this.maxWidth) {
            return false;
        }
        if (this.dynamicMaxHeight > 0 && (textBlock.height > this.dynamicMaxHeight || textBlock.height / this.dynamicMaxHeight < 0.5)) {
            return false;
        }
        return true;
    }
    public lastTextBlock(): TextBlock | null {
        return this.textBlocks.length > 0 ? this.textBlocks[this.textBlocks.length - 1]! : null;
    }
    public addTextBlock(textBlock: TextBlock | null | undefined, needCheck?: boolean): boolean {
        if (!textBlock) {
            return false;
        }
        if (needCheck && !this.isCapacityOf(textBlock)) {
            return false;
        }
        let posx: number = 0;
        let posy: number = 0;
        const lastTxtBlock: TextBlock | null = this.lastTextBlock();
        if (lastTxtBlock) {
            posx = lastTxtBlock.x + lastTxtBlock.width;
            posy = lastTxtBlock.y;
        }
        textBlock.x = posx;
        textBlock.y = posy;
        textBlock.line = this;
        this.textBlocks.push(textBlock);
        this.dynamicMaxHeight = Math.max(this.dynamicMaxHeight, textBlock.height);
        return true;
    }
}
__reflect(Line.prototype, "egret.web.Line");

export class Page extends HashObject {
    public lines: Line[] = [];
    public pageWidth: number = 0;
    public pageHeight: number = 0;
    public webGLTexture: EngineWebGLTexture | null | undefined = null;
    public constructor(pageWidth: number, pageHeight: number) {
        super();
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
    }
    public addLine(line: Line | null | undefined): boolean {
        if (!line) {
            return false;
        }
        let posx: number = 0;
        let posy: number = 0;
        const lines: Line[] = this.lines;
        if (lines.length > 0) {
            const lastLine: Line = lines[lines.length - 1]!;
            posx = lastLine.x;
            posy = lastLine.y + lastLine.dynamicMaxHeight;
        }
        if (line.maxWidth > this.pageWidth) {
            console.error("line.maxWidth = " + line.maxWidth + ", this.pageWidth = " + this.pageWidth);
            return false;
        }
        if (posy + line.dynamicMaxHeight > this.pageHeight) {
            return false;
        }
        line.x = posx;
        line.y = posy;
        line.page = this;
        this.lines.push(line);
        return true;
    }
}
__reflect(Page.prototype, "egret.web.Page");

export class Book extends HashObject {
    private _pages: Page[] = [];
    private _sortLines: Line[] = [];
    private _maxSize: number = 1024;
    private _border: number = 1;
    public constructor(maxSize: number, border: number) {
        super();
        this._maxSize = maxSize;
        this._border = border;
    }
    public addTextBlock(textBlock: TextBlock): boolean {
        const result: [Page | null, Line] | null = this._addTextBlock(textBlock);
        if (!result) {
            return false;
        }
        textBlock.updateUV();
        let exist: boolean = false;
        const sortLines: Line[] = this._sortLines;
        for (let i: number = 0; i < sortLines.length; i++) {
            const line: Line = sortLines[i]!;
            if (line === result[1]) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            sortLines.push(result[1]);
        }
        this.sort();
        return true;
    }
    public _addTextBlock(textBlock: TextBlock | null | undefined): [Page | null, Line] | null {
        if (!textBlock) {
            return null;
        }
        if (textBlock.width > this._maxSize || textBlock.height > this._maxSize) {
            return null;
        }
        const sortLines: Line[] = this._sortLines;
        for (let i: number = 0, length: number = sortLines.length; i < length; ++i) {
            const line: Line = sortLines[i]!;
            if (!line.isCapacityOf(textBlock)) {
                continue;
            }
            if (line.addTextBlock(textBlock, false)) {
                return [line.page, line];
            }
        }
        const newLine: Line = new Line(this._maxSize);
        if (!newLine.addTextBlock(textBlock, true)) {
            console.error("_addTextBlock !newLine.addTextBlock(textBlock, true)");
            return null;
        }
        const pages: Page[] = this._pages;
        for (let i: number = 0, length: number = pages.length; i < length; ++i) {
            const page: Page = pages[i]!;
            if (page.addLine(newLine)) {
                return [page, newLine];
            }
        }
        const newPage: Page = this.createPage(this._maxSize, this._maxSize);
        if (!newPage.addLine(newLine)) {
            console.error("_addText newPage.addLine failed");
            return null;
        }
        return [newPage, newLine];
    }
    public createPage(pageWidth: number, pageHeight: number): Page {
        const newPage: Page = new Page(pageWidth, pageHeight);
        this._pages.push(newPage);
        return newPage;
    }
    public sort(): void {
        if (this._sortLines.length <= 1) {
            return;
        }
        const sortFunc: (a: Line, b: Line) => number = (a: Line, b: Line): number => a.dynamicMaxHeight < b.dynamicMaxHeight ? -1 : 1;
        this._sortLines = this._sortLines.sort(sortFunc);
    }
    public createTextBlock(tag: string, width: number, height: number, measureWidth: number, measureHeight: number, canvasWidthOffset: number, canvasHeightOffset: number, stroke2: number): TextBlock | null {
        const txtBlock: TextBlock = new TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, this._border);
        if (!this.addTextBlock(txtBlock)) {
            return null;
        }
        txtBlock.tag = tag;
        return txtBlock;
    }
}
__reflect(Book.prototype, "egret.web.Book");

export class DrawLabel extends HashObject {
    public anchorX: number = 0;
    public anchorY: number = 0;
    public textBlocks: TextBlock[] = [];
    public static pool: DrawLabel[] = [];
    public clear(): void {
        this.anchorX = 0;
        this.anchorY = 0;
        this.textBlocks.length = 0;
    }
    public static create(): DrawLabel {
        const pool: DrawLabel[] = DrawLabel.pool;
        if (pool.length === 0) {
            pool.push(new DrawLabel());
        }
        return pool.pop()!;
    }
    public static back(drawLabel: DrawLabel | null | undefined, checkRepeat?: boolean): void {
        if (!drawLabel) {
            return;
        }
        const pool: DrawLabel[] = DrawLabel.pool;
        if (checkRepeat && pool.indexOf(drawLabel) >= 0) {
            console.error("DrawLabel.back repeat");
            return;
        }
        drawLabel.clear();
        pool.push(drawLabel);
    }
}
__reflect(DrawLabel.prototype, "egret.web.DrawLabel");

class StyleInfo extends HashObject {
    public format: ITextStyle;
    public textColor: number;
    public strokeColor: number;
    public size: number;
    public stroke: number;
    public bold: boolean;
    public italic: boolean;
    public fontFamily: string;
    public font: string;
    public description: string;
    public constructor(textNode: TextNode, format: ITextStyle) {
        super();
        this.textColor = textNode.textColor;
        this.strokeColor = textNode.strokeColor;
        this.size = textNode.size;
        this.stroke = textNode.stroke;
        this.bold = textNode.bold;
        this.italic = textNode.italic;
        this.fontFamily = textNode.fontFamily;
        this.format = format;
        this.font = getFontString(textNode, this.format);
        const textColor: number = !format.textColor ? textNode.textColor : format.textColor;
        const strokeColor: number = !format.strokeColor ? textNode.strokeColor : format.strokeColor;
        const stroke: number = !format.stroke ? textNode.stroke : format.stroke;
        const size: number = !format.size ? textNode.size : format.size;
        this.description = "" + this.font + "-" + size;
        this.description += "-" + toColorString(textColor);
        this.description += "-" + toColorString(strokeColor);
        if (stroke) {
            this.description += "-" + stroke * 2;
        }
    }
}
__reflect(StyleInfo.prototype, "StyleInfo");

class CharImageRender extends HashObject {
    public char: string = "";
    public styleInfo: StyleInfo | null = null;
    public hashCodeString: string = "";
    public charWithStyleHashCode: number = 0;
    public measureWidth: number = 0;
    public measureHeight: number = 0;
    public canvasWidthOffset: number = 0;
    public canvasHeightOffset: number = 0;
    public stroke2: number = 0;
    public static chineseCharactersRegExp: RegExp = new RegExp("^[\u4E00-\u9FA5]$");
    public static chineseCharacterMeasureFastMap: Record<string, number> = {};
    public reset(char: string, styleKey: StyleInfo): this {
        this.char = char;
        this.styleInfo = styleKey;
        this.hashCodeString = char + ":" + styleKey.description;
        this.charWithStyleHashCode = NumberUtils.convertStringToHashCode(this.hashCodeString);
        this.canvasWidthOffset = 0;
        this.canvasHeightOffset = 0;
        this.stroke2 = 0;
        return this;
    }
    public measureAndDraw(targetCanvas: HTMLCanvasElement | null | undefined): void {
        const canvas: HTMLCanvasElement | null | undefined = targetCanvas;
        if (!canvas) {
            return;
        }
        const text: string = this.char;
        const styleInfo: StyleInfo = this.styleInfo!;
        const format: ITextStyle = styleInfo.format;
        const textColor: number = !format.textColor ? styleInfo.textColor : format.textColor;
        const strokeColor: number = !format.strokeColor ? styleInfo.strokeColor : format.strokeColor;
        const stroke: number = !format.stroke ? styleInfo.stroke : format.stroke;
        const size: number = !format.size ? styleInfo.size : format.size;
        this.measureWidth = this.measure(text, styleInfo, size);
        this.measureHeight = size;
        let canvasWidth: number = this.measureWidth;
        let canvasHeight: number = this.measureHeight;
        const strokeDouble: number = stroke * 2;
        if (strokeDouble > 0) {
            canvasWidth += strokeDouble * 2;
            canvasHeight += strokeDouble * 2;
        }
        this.stroke2 = strokeDouble;
        canvas.width = Math.ceil(canvasWidth) + 2 * 2;
        canvas.height = Math.ceil(canvasHeight) + 2 * 2;
        this.canvasWidthOffset = (canvas.width - this.measureWidth) / 2;
        this.canvasHeightOffset = (canvas.height - this.measureHeight) / 2;
        const numberOfPrecision: number = 3;
        const precision: number = Math.pow(10, numberOfPrecision);
        this.canvasWidthOffset = Math.floor(this.canvasWidthOffset * precision) / precision;
        this.canvasHeightOffset = Math.floor(this.canvasHeightOffset * precision) / precision;
        const context: CanvasRenderingContext2D = getContext2d(canvas)!;
        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.font = styleInfo.font;
        context.fillStyle = toColorString(textColor);
        context.strokeStyle = toColorString(strokeColor);
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (stroke) {
            context.lineWidth = stroke * 2;
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
        }
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        context.restore();
    }
    public measure(text: string, styleKey: StyleInfo, textFlowSize: number): number {
        const isChinese: boolean = CharImageRender.chineseCharactersRegExp.test(text);
        if (isChinese && CharImageRender.chineseCharacterMeasureFastMap[styleKey.font]) {
            return CharImageRender.chineseCharacterMeasureFastMap[styleKey.font]!;
        }
        const measureTextWidth: number = measureText(text, styleKey.fontFamily, textFlowSize || styleKey.size, styleKey.bold, styleKey.italic);
        if (isChinese) {
            CharImageRender.chineseCharacterMeasureFastMap[styleKey.font] = measureTextWidth;
        }
        return measureTextWidth;
    }
}
__reflect(CharImageRender.prototype, "CharImageRender");

export class TextAtlasRender extends HashObject {
    private static __textAtlasRender__: TextAtlasRender | null = null;

    public book: Book;
    public charImageRender: CharImageRender = new CharImageRender();
    public textBlockMap: Record<number, TextBlock> = {};
    private _canvas: HTMLCanvasElement | null = null;
    public textAtlasTextureCache: EngineWebGLTexture[] = [];
    public webglRenderContext: WebGLRenderContext;
    public constructor(webglRenderContext: WebGLRenderContext, maxSize: number, border: number) {
        super();
        this.webglRenderContext = webglRenderContext;
        this.book = new Book(maxSize, border);
    }
    public static analysisTextNodeAndFlushDrawLabel(textNode: TextNode | null | undefined): void {
        if (!textNode) {
            return;
        }
        if (!TextAtlasRender.__textAtlasRender__) {
            const webglcontext: WebGLRenderContext = WebGLRenderContext.getInstance(0, 0);
            TextAtlasRender.__textAtlasRender__ = new TextAtlasRender(webglcontext, 512, 1);
        }
        const drawLabels: DrawLabel[] = (textNode[WebGLRenderer.property_drawLabel] ||= []);
        for (let i: number = 0; i < drawLabels.length; i++) {
            const drawLabel: DrawLabel = drawLabels[i]!;
            DrawLabel.back(drawLabel, false);
        }
        drawLabels.length = 0;
        const offset: number = 4;
        const drawData: (number | string | ITextStyle)[] = textNode.drawData;
        let anchorX: number;
        let anchorY: number;
        let labelString: string;
        let labelFormat: ITextStyle;
        const resultAsRenderTextBlocks: TextBlock[] = [];
        for (let i: number = 0, length: number = drawData.length; i < length; i += offset) {
            anchorX = drawData[i] as number;
            anchorY = drawData[i + 1] as number;
            labelString = drawData[i + 2] as string;
            labelFormat = (drawData[i + 3] as ITextStyle | undefined) || {};
            resultAsRenderTextBlocks.length = 0;
            TextAtlasRender.__textAtlasRender__.convertLabelStringToTextAtlas(labelString, new StyleInfo(textNode, labelFormat), resultAsRenderTextBlocks);
            const drawLabel: DrawLabel = DrawLabel.create();
            drawLabel.anchorX = anchorX;
            drawLabel.anchorY = anchorY;
            drawLabel.textBlocks = resultAsRenderTextBlocks.slice();
            drawLabels.push(drawLabel);
        }
    }
    public convertLabelStringToTextAtlas(labelstring: string, styleKey: StyleInfo, resultAsRenderTextBlocks: TextBlock[]): void {
        const canvas: HTMLCanvasElement = this.canvas;
        const charImageRender: CharImageRender = this.charImageRender;
        const textBlockMap: Record<number, TextBlock> = this.textBlockMap;
        for (let i: number = 0; i < labelstring.length; i++) {
            const char: string = labelstring[i]!;
            charImageRender.reset(char, styleKey);
            const cachedBlock: TextBlock | undefined = textBlockMap[charImageRender.charWithStyleHashCode];
            if (cachedBlock) {
                resultAsRenderTextBlocks.push(cachedBlock);
                continue;
            }
            charImageRender.measureAndDraw(canvas);
            const txtBlock: TextBlock | null = this.book.createTextBlock(char, canvas.width, canvas.height, charImageRender.measureWidth, charImageRender.measureHeight, charImageRender.canvasWidthOffset, charImageRender.canvasHeightOffset, charImageRender.stroke2);
            if (!txtBlock) {
                continue;
            }
            resultAsRenderTextBlocks.push(txtBlock);
            textBlockMap[charImageRender.charWithStyleHashCode] = txtBlock;
            const page: Page = txtBlock.page!;
            if (!page.webGLTexture) {
                page.webGLTexture = this.createTextTextureAtlas(page.pageWidth, page.pageHeight, false);
            }
            const gl: WebGLRenderingContext = this.webglRenderContext.context;
            page.webGLTexture![DefinitionHelper.glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, page.webGLTexture!);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            page.webGLTexture![DefinitionHelper.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            gl.texSubImage2D(gl.TEXTURE_2D, 0, txtBlock.subImageOffsetX, txtBlock.subImageOffsetY, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }
    }
    public createTextTextureAtlas(width: number, height: number, debug: boolean): EngineWebGLTexture | null | undefined {
        let texture: EngineWebGLTexture | null | undefined;
        if (debug) {
            const canvas: HTMLCanvasElement = createCanvas(width, width)!;
            const context: CanvasRenderingContext2D = getContext2d(canvas)!;
            context.fillStyle = "black";
            context.fillRect(0, 0, width, width);
            texture = createTexture(this.webglRenderContext, canvas);
        } else {
            texture = _createTexture(this.webglRenderContext, width, height, null);
        }
        if (texture) {
            this.textAtlasTextureCache.push(texture);
        }
        return texture;
    }
    public get canvas(): HTMLCanvasElement {
        if (!this._canvas) {
            this._canvas = createCanvas(24, 24)!;
        }
        return this._canvas;
    }
}
__reflect(TextAtlasRender.prototype, "egret.web.TextAtlasRender");

export class EgretWebGLAttribute {
    public gl: WebGLRenderingContext;
    public name: string;
    public type: number;
    public size: number;
    public location: number;
    public count: number = 0;
    public format: number;
    public constructor(gl: WebGLRenderingContext, program: WebGLProgram, attributeData: WebGLActiveInfo) {
        this.gl = gl;
        this.name = attributeData.name;
        this.type = attributeData.type;
        this.size = attributeData.size;
        this.location = gl.getAttribLocation(program, this.name);
        this.initCount(gl);
        this.format = gl.FLOAT;
        this.initFormat(gl);
    }
    public initCount(_gl: WebGLRenderingContext): void {
        void _gl;

        const type: number = this.type;
        switch (type) {
            case 5126: case 5120: case 5121: case 5123: this.count = 1;
                break;
            case 35664: this.count = 2;
                break;
            case 35665: this.count = 3;
                break;
            case 35666: this.count = 4;
                break;
        }
    }
    public initFormat(gl: WebGLRenderingContext): void {
        const type: number = this.type;
        switch (type) {
            case 5126: case 35664: case 35665: case 35666: this.format = gl.FLOAT;
                break;
            case 5121: this.format = gl.UNSIGNED_BYTE;
                break;
            case 5123: this.format = gl.UNSIGNED_SHORT;
                break;
            case 5120: this.format = gl.BYTE;
                break;
        }
    }
}
__reflect(EgretWebGLAttribute.prototype, "egret.web.EgretWebGLAttribute");

export class EgretWebGLProgram {
    public vshaderSource: string;
    public fshaderSource: string;
    public vertexShader: WebGLShader;
    public fragmentShader: WebGLShader;
    public id: WebGLProgram;
    public uniforms: Record<string, EgretWebGLUniform>;
    public attributes: Record<string, EgretWebGLAttribute>;
    public static programCache: Record<string, EgretWebGLProgram> = {};
    public constructor(gl: WebGLRenderingContext, vertSource: string, fragSource: string) {
        this.vshaderSource = vertSource;
        this.fshaderSource = fragSource;
        this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
        this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
        this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);
        this.uniforms = extractUniforms(gl, this.id);
        this.attributes = extractAttributes(gl, this.id);
    }
    public static getProgram(gl: WebGLRenderingContext, vertSource: string, fragSource: string, key: string): EgretWebGLProgram {
        if (!this.programCache[key]) {
            this.programCache[key] = new EgretWebGLProgram(gl, vertSource, fragSource);
        }
        return this.programCache[key]!;
    }
    public static deleteProgram(_gl: WebGLRenderingContext, _vertSource: string, _fragSource: string, _key: string): void {
        void _gl;

        void _vertSource;

        void _fragSource;

        void _key;
    }
}
__reflect(EgretWebGLProgram.prototype, "egret.web.EgretWebGLProgram");

export class EgretWebGLUniform {
    public gl: WebGLRenderingContext;
    public name: string;
    public type: number;
    public size: number;
    public location: WebGLUniformLocation | null;
    public declare value: UniformValue;
    public declare setValue: (value: UniformInput) => void;
    public declare upload: () => void;
    public constructor(gl: WebGLRenderingContext, program: WebGLProgram, uniformData: WebGLActiveInfo) {
        this.gl = gl;
        this.name = uniformData.name;
        this.type = uniformData.type;
        this.size = uniformData.size;
        this.location = gl.getUniformLocation(program, this.name);
        this.setDefaultValue();
        this.generateSetValue();
        this.generateUpload();
    }
    public setDefaultValue(): void {
        const type: number = this.type;
        switch (type) {
            case 5126: case 35678: case 35680: case 35670: case 5124: this.value = 0;
                break;
            case 35664: case 35671: case 35667: this.value = [0, 0];
                break;
            case 35665: case 35672: case 35668: this.value = [0, 0, 0];
                break;
            case 35666: case 35673: case 35669: this.value = [0, 0, 0, 0];
                break;
            case 35674: this.value = new Float32Array([1, 0, 0, 1]);
                break;
            case 35675: this.value = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
                break;
            case 35676: this.value = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                break;
        }
    }
    public generateSetValue(): void {
        const type: number = this.type;
        switch (type) {
            case 5126: case 35678: case 35680: case 35670: case 5124:
                this.setValue = function (this: EgretWebGLUniform, value: UniformInput): void {
                    const notEqual: boolean = this.value !== value;
                    this.value = value as number;
                    if (notEqual) {
                        this.upload();
                    }
                };
                break;
            case 35664: case 35671: case 35667:
                this.setValue = function (this: EgretWebGLUniform, value: UniformInput): void {
                    const vector: UniformVector2 = value as UniformVector2;
                    const current: number[] = this.value as number[];
                    const notEqual: boolean = current[0] !== vector.x || current[1] !== vector.y;
                    current[0] = vector.x;
                    current[1] = vector.y;
                    if (notEqual) {
                        this.upload();
                    }
                };
                break;
            case 35665: case 35672: case 35668:
                this.setValue = function (this: EgretWebGLUniform, value: UniformInput): void {
                    const vector: UniformVector3 = value as UniformVector3;
                    const current: number[] = this.value as number[];
                    current[0] = vector.x;
                    current[1] = vector.y;
                    current[2] = vector.z;
                    this.upload();
                };
                break;
            case 35666: case 35673: case 35669:
                this.setValue = function (this: EgretWebGLUniform, value: UniformInput): void {
                    const vector: UniformVector4 = value as UniformVector4;
                    const current: number[] = this.value as number[];
                    current[0] = vector.x;
                    current[1] = vector.y;
                    current[2] = vector.z;
                    current[3] = vector.w;
                    this.upload();
                };
                break;
            case 35674: case 35675: case 35676:
                this.setValue = function (this: EgretWebGLUniform, value: UniformInput): void {
                    (this.value as Float32Array).set(value as ArrayLike<number>);
                    this.upload();
                };
                break;
        }
    }
    public generateUpload(): void {
        const gl: WebGLRenderingContext = this.gl;
        const type: number = this.type;
        const location: WebGLUniformLocation | null = this.location;
        switch (type) {
            case 5126:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number = this.value as number;
                    gl.uniform1f(location, value);
                };
                break;
            case 35664:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number[] = this.value as number[];
                    gl.uniform2f(location, value[0]!, value[1]!);
                };
                break;
            case 35665:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number[] = this.value as number[];
                    gl.uniform3f(location, value[0]!, value[1]!, value[2]!);
                };
                break;
            case 35666:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number[] = this.value as number[];
                    gl.uniform4f(location, value[0]!, value[1]!, value[2]!, value[3]!);
                };
                break;
            case 35678: case 35680: case 35670: case 5124:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number = this.value as number;
                    gl.uniform1i(location, value);
                };
                break;
            case 35671: case 35667:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number[] = this.value as number[];
                    gl.uniform2i(location, value[0]!, value[1]!);
                };
                break;
            case 35672: case 35668:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number[] = this.value as number[];
                    gl.uniform3i(location, value[0]!, value[1]!, value[2]!);
                };
                break;
            case 35673: case 35669:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: number[] = this.value as number[];
                    gl.uniform4i(location, value[0]!, value[1]!, value[2]!, value[3]!);
                };
                break;
            case 35674:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: Float32Array = this.value as Float32Array;
                    gl.uniformMatrix2fv(location, false, value);
                };
                break;
            case 35675:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: Float32Array = this.value as Float32Array;
                    gl.uniformMatrix3fv(location, false, value);
                };
                break;
            case 35676:
                this.upload = function (this: EgretWebGLUniform): void {
                    const value: Float32Array = this.value as Float32Array;
                    gl.uniformMatrix4fv(location, false, value);
                };
                break;
        }
    }
}
__reflect(EgretWebGLUniform.prototype, "egret.web.EgretWebGLUniform");

export class EgretShaderLib {
    public static blur_frag: string = "precision mediump float;\r\nuniform vec2 blur;\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\nuniform vec2 uTextureSize;\r\nvoid main()\r\n{\r\n    const int sampleRadius = 5;\r\n    const int samples = sampleRadius * 2 + 1;\r\n    vec2 blurUv = blur / uTextureSize;\r\n    vec4 color = vec4(0, 0, 0, 0);\r\n    vec2 uv = vec2(0.0, 0.0);\r\n    blurUv /= float(sampleRadius);\r\n\r\n    for (int i = -sampleRadius; i <= sampleRadius; i++) {\r\n        uv.x = vTextureCoord.x + float(i) * blurUv.x;\r\n        uv.y = vTextureCoord.y + float(i) * blurUv.y;\r\n        color += texture2D(uSampler, uv);\r\n    }\r\n\r\n    color /= float(samples);\r\n    gl_FragColor = color;\r\n}";
    public static colorTransform_frag: string = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n    if(texColor.a > 0.) {\r\n        texColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n    }\r\n    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\r\n    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\r\n}";
    public static default_vert: string = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\nattribute vec4 aColor;\r\n\r\nuniform vec2 projectionVector;\r\n\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nconst vec2 center = vec2(-1.0, 1.0);\r\n\r\nvoid main(void) {\r\n   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\r\n   vTextureCoord = aTextureCoord;\r\n   vColor = aColor;\r\n}";
    public static glow_frag: string = "precision highp float;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\n\r\nuniform float dist;\r\nuniform float angle;\r\nuniform vec4 color;\r\nuniform float alpha;\r\nuniform float blurX;\r\nuniform float blurY;\r\nuniform float strength;\r\nuniform float inner;\r\nuniform float knockout;\r\nuniform float hideObject;\r\n\r\nuniform vec2 uTextureSize;\r\n\r\nfloat random(vec2 scale)\r\n{\r\n    return fract(sin(dot(gl_FragCoord.xy, scale)) * 43758.5453);\r\n}\r\n\r\nvoid main(void) {\r\n    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);\r\n    const float linearSamplingTimes = 7.0;\r\n    const float circleSamplingTimes = 12.0;\r\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\r\n    vec4 curColor;\r\n    float totalAlpha = 0.0;\r\n    float maxTotalAlpha = 0.0;\r\n    float curDistanceX = 0.0;\r\n    float curDistanceY = 0.0;\r\n    float offsetX = dist * cos(angle) * px.x;\r\n    float offsetY = dist * sin(angle) * px.y;\r\n\r\n    const float PI = 3.14159265358979323846264;\r\n    float cosAngle;\r\n    float sinAngle;\r\n    float offset = PI * 2.0 / circleSamplingTimes * random(vec2(12.9898, 78.233));\r\n    float stepX = blurX * px.x / linearSamplingTimes;\r\n    float stepY = blurY * px.y / linearSamplingTimes;\r\n    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {\r\n        cosAngle = cos(a + offset);\r\n        sinAngle = sin(a + offset);\r\n        for (float i = 1.0; i <= linearSamplingTimes; i++) {\r\n            curDistanceX = i * stepX * cosAngle;\r\n            curDistanceY = i * stepY * sinAngle;\r\n            if (vTextureCoord.x + curDistanceX - offsetX >= 0.0 && vTextureCoord.y + curDistanceY + offsetY <= 1.0){\r\n                curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));\r\n                totalAlpha += (linearSamplingTimes - i) * curColor.a;\r\n            }\r\n            maxTotalAlpha += (linearSamplingTimes - i);\r\n        }\r\n    }\r\n\r\n    ownColor.a = max(ownColor.a, 0.0001);\r\n    ownColor.rgb = ownColor.rgb / ownColor.a;\r\n\r\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);\r\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;\r\n\r\n    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);\r\n    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\r\n    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\r\n    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);\r\n    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);\r\n}";
    public static primitive_frag: string = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = vColor;\r\n}";
    public static texture_frag: string = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\r\n}";
    public static texture_etc_alphamask_frag: string = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\nvoid main(void) {\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 v4Color = texture2D(uSampler, vTextureCoord);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
    public static colorTransform_frag_etc_alphamask_frag: string = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\n\r\nvoid main(void){\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 texColor = texture2D(uSampler, vTextureCoord);\r\nif(texColor.a > 0.0) {\r\ntexColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n}\r\nvec4 v4Color = clamp(texColor * matrix + colorAdd, 0.0, 1.0);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
}
__reflect(EgretShaderLib.prototype, "egret.web.EgretShaderLib");

export class HTML5WebSocket {
    public host: string = "";
    public port: number = 0;
    private socket!: BrowserSocket;
    private onConnect: SocketCallback | undefined;
    private onClose: SocketCallback | undefined;
    private onSocketData: SocketDataCallback | undefined;
    private onError: SocketCallback | undefined;
    private thisObject: unknown;

    public constructor() {
        if (!window.WebSocket) {
            $error(3100);
        }
    }
    public addCallBacks(onConnect: SocketCallback, onClose: SocketCallback, onSocketData: SocketDataCallback, onError: SocketCallback, thisObject: unknown): void {
        this.onConnect = onConnect;
        this.onClose = onClose;
        this.onSocketData = onSocketData;
        this.onError = onError;
        this.thisObject = thisObject;
    }
    public connect(host: string, port: number): void {
        this.host = host;
        this.port = port;
        const socketServerUrl: string = "ws://" + this.host + ":" + this.port;
        this.socket = new window.WebSocket(socketServerUrl);
        this.socket.binaryType = "arraybuffer";
        this._bindEvent();
    }
    public connectByUrl(url: string): void {
        this.socket = new window.WebSocket(url);
        this.socket.binaryType = "arraybuffer";
        this._bindEvent();
    }
    private _bindEvent(): void {

        const socket: BrowserSocket = this.socket;
        socket.onopen = (): void => {
            if (this.onConnect) {
                this.onConnect.call(this.thisObject);
            }
        };
        socket.onclose = (): void => {
            if (this.onClose) {
                this.onClose.call(this.thisObject);
            }
        };
        socket.onerror = (): void => {
            if (this.onError) {
                this.onError.call(this.thisObject);
            }
        };
        socket.onmessage = (e: MessageEvent<string | ArrayBuffer>): void => {
            if (this.onSocketData) {
                this.onSocketData.call(this.thisObject, e.data ? e.data : e);
            }
        };
    }
    public send(message: SocketSendData): void {
        this.socket.send(message as string);
    }
    public close(): void {
        this.socket.close();
    }
    public disconnect(): void {
        if (this.socket.disconnect) {
            this.socket.disconnect();
        }
    }
}
__reflect(HTML5WebSocket.prototype, "egret.web.HTML5WebSocket", ["egret.ISocket"]);
