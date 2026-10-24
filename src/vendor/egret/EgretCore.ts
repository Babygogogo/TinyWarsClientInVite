
import type * as web from "./WebCore";
import type * as sys from "./SysCore";
import { runtime } from "./Runtime";

window.isNaN = (value: unknown): boolean => {
    const numericValue: number = +(value as number);
    return numericValue !== numericValue;
};

export type FilterUniforms = Record<string, unknown>;
export type NativeFilterId = number;
export type EventListener = (this: unknown, event: Event) => void;
export type DisplayRenderMode = 1 | 2 | 3 | 4 | null;
export type GradientTypeValue = "linear" | "radial";
export type JointStyleValue = JointStyleConstants[keyof JointStyleConstants];
export type HttpRequest<TResponse = string | ArrayBuffer | Blob | Document | null> = web.WebHttpRequest<TResponse>;
export type URLLoaderFormat = "binary" | "text" | "variables" | "texture" | "sound";
export type ScrollEaseFunction = (ratio: number, start?: number, change?: number, duration?: number) => number;
export type ScrollTweenProperties = Record<string, unknown>;
export type ScrollPolicy = "auto" | "on" | "off";
export type URLRequestData = Document | XMLHttpRequestBodyInit | URLVariables | null;
export type URLLoaderData = string | ArrayBuffer | Blob | Document | URLVariables | Texture | Sound | null;
export type URLVariableScalar = string | number | boolean;
export type URLVariableValue = URLVariableScalar | URLVariableScalar[];
export type URLVariableMap = Record<string, URLVariableValue>;
export type TickerListener = (this: unknown, frameTime: number) => void;
export type SocketMessage = string | ArrayBuffer | MessageEvent<string | ArrayBuffer>;
export type SocketCallback = (this: unknown) => void;
export type SocketDataCallback = (this: unknown, message: SocketMessage) => void;
export type SocketSendData = string | ArrayBuffer | ArrayBufferView | Blob;
export type TweenProperties = Record<string, unknown>;
export type TweenTarget = object & { tween_count?: number };
export type EaseFunction = (ratio: number, start?: number, change?: number, duration?: number) => number;
export type ExternalCallback<TValue = string> = (value: TValue) => void;
export type DeferredCallback = (this: unknown, ...args: unknown[]) => unknown;
export type TickCallback = (this: unknown, timeStamp: number) => boolean | void;
export type BlendModeValue = "normal" | "add" | "erase";
export type ChildrenSortModeValue = ChildrenSortModeConstants[keyof ChildrenSortModeConstants];
export type CapsStyleValue = CapsStyleConstants[keyof CapsStyleConstants];
export type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;
export type BitmapDataCallback = (bitmapData: BitmapData) => void;
export type BitmapDataInputType = "arraybuffer" | "base64";
export type LocaleStrings = Record<number, string | undefined>;
export type LocaleStringTables = Record<string, LocaleStrings | undefined>;
export type KTXData = ArrayBuffer;
export type EventPhaseValue = 1 | 2 | 3;
export type EventPropertyData = Record<string, unknown>;
type ScrollTweenTarget = object & { tween_count?: number };
type PixelBuffer = Uint8ClampedArray | number[];
type RGBA = [number, number, number, number];
type EventMap = Record<string, EventBin[] | null | undefined>;
// type ConsoleMethod = (...data: unknown[]) => void;

export interface IHashObject {
    readonly hashCode: number;
}
export interface EventConstructor<TEvent extends Event = Event> {
    new(type: string, bubbles?: boolean, cancelable?: boolean): TEvent;
}
export interface BlurVectorUniform {
    x: number;
    y: number;
}
export interface BlurPassUniforms extends FilterUniforms {
    blur: BlurVectorUniform;
}
export interface IBlurXFilter extends Filter {
    blurX: number;
}
export interface IBlurYFilter extends Filter {
    blurY: number;
}
export interface ColorMatrixUniforms extends FilterUniforms {
    matrix: number[];
    colorAdd: GlowColorUniform;
}
export interface SpriteConstructor {
    new(): DisplayObjectContainer;
}
export interface JointStyleConstants {
    BEVEL: "bevel";
    MITER: "miter";
    ROUND: "round";
}
export interface FPSStyles {
    x?: number;
    y?: number;
    size?: number;
    textColor?: number;
    bgAlpha?: number;
    [key: string]: string | number | boolean | undefined;
}
export interface FPSMetrics {
    fps: number;
    draw: number;
    costTicker: number;
    costRender: number;
}
export interface FPSDisplay {
    update(metrics: FPSMetrics): void;
    updateInfo(info: string): void;
    updateWarn?(info: string): void;
    updateError?(info: string): void;
}
export interface CompressedTextureData {
    glInternalFormat: number;
    width: number;
    height: number;
    byteArray: Uint8Array;
    face: number;
    level: number;
}
export interface ITextStyle {
    textColor?: number;
    strokeColor?: number;
    stroke?: number;
    size?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontFamily?: string;
    href?: string;
    target?: string;
}
export interface ITextElement {
    text: string;
    style?: ITextStyle;
}
export interface BitmapFontGlyph {
    x: number; y: number; w: number; h: number;
    offX?: number; offY?: number; sourceW?: number; sourceH?: number; xadvance?: number;
}
export interface BitmapFontConfig {
    frames: Record<string, BitmapFontGlyph | undefined>;
}
export interface TextFieldState {
    0: number; 1: number; 2: number; 3: number; 4: number; 5: number; 6: number; 7: number;
    8: string; 9: string; 10: string; 11: string; 12: string; 13: string; 14: ITextElement[];
    15: boolean; 16: boolean; 17: boolean; 18: boolean; 19: boolean; 20: boolean;
    21: number; 22: number; 23: number; 24: string; 25: number; 26: string; 27: number;
    28: number; 29: number; 30: boolean; 31: boolean; 32: number; 33: boolean; 34: number;
    35: string | null; 36: string | null; 37: string; 38: boolean;
}
export interface TextLineElement extends ITextElement {
    width: number;
    style: ITextStyle;
}
export interface TextLine {
    width: number;
    height: number;
    charNum: number;
    elements: TextLineElement[];
    hasNextLine: boolean;
}
export interface TextHit {
    lineIndex: number;
    textElementIndex: number;
}
export interface GeolocationEvent<TData = unknown> {
    altitude: number | null;
    heading: number | null;
    accuracy: number;
    latitude: number;
    longitude: number;
    speed: number | null;
    altitudeAccuracy: number | null;
    errorType: string;
    errorMessage: string;
}
export interface MotionAcceleration {
    x: number | null;
    y: number | null;
    z: number | null;
}
export interface MotionRotationRate {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}
export interface MotionEvent<TData = unknown> {
    acceleration: MotionAcceleration;
    accelerationIncludingGravity: MotionAcceleration;
    rotationRate: MotionRotationRate;
}
export interface SoundChannel extends IEventDispatcher {
    volume: number;
    readonly position: number;
    stop(): void;
}
export interface Sound extends IEventDispatcher {
    readonly length: number;
    load(url: string): void;
    play(startTime?: number, loops?: number): SoundChannel;
    close(): void;
}
export interface Video extends DisplayObject {
    src: string | undefined;
    poster: string | undefined;
    volume: number;
    position: number;
    fullscreen: boolean;
    readonly bitmapData: BitmapData | null;
    readonly paused: boolean;
    readonly length: number;
    load(url?: string, cache?: boolean): void;
    play(startTime?: number, loop?: boolean): void;
    close(): void;
    pause(): void;
}
export interface ImageLoader extends EventDispatcher {
    data: BitmapData | null;
    load(url: string): void;
}
export interface MovieClipFrameData {
    res?: string;
    x?: number;
    y?: number;
    duration?: number | string;
    frame?: number;
}
export interface MovieClipLabelData {
    name: string;
    frame: number;
    end?: number;
}
export interface MovieClipFrameEventData {
    frame: number;
    name: string;
}
export interface MovieClipSource {
    frameRate?: number;
    frames?: MovieClipFrameData[];
    labels?: MovieClipLabelData[];
    events?: MovieClipFrameEventData[];
}
export interface MovieClipTextureData {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface MovieClipDataSet {
    mc: Record<string, MovieClipSource>;
    res: Record<string, MovieClipTextureData>;
}
export interface ScrollTweenOptions {
    useTicks?: boolean;
    ignoreGlobalPause?: boolean;
    loop?: boolean;
    onChange?: EventListener;
    onChangeObj?: unknown;
    override?: boolean;
    paused?: boolean;
    position?: number;
}
export interface ScrollTweenStep {
    d: number;
    t: number;
    p0: ScrollTweenProperties;
    p1: ScrollTweenProperties;
    e?: ScrollEaseFunction | undefined;
    v?: boolean;
}
export interface ScrollTweenAction {
    t: number;
    execute: () => void;
}
export interface ScrollTweenPlugin {
    init(tween: ScrollTween, name: string, value: unknown): unknown;
    step?(tween: ScrollTween, name: string, oldValue: unknown, newValue: unknown, injectProps: ScrollTweenProperties): void;
    tween(tween: ScrollTween, name: string, value: unknown, start: ScrollTweenProperties, end: ScrollTweenProperties, ratio: number, isWait: boolean, isEnd: boolean): unknown;
}
export interface URLRequestHeader {
    name: string;
    value: string;
}
export interface ScrollPoint {
    x: number;
    y: number;
}
export interface ScrollAnimationData {
    position: number;
    duration: number;
}
export interface TweenOptions {
    useTicks?: boolean;
    ignoreGlobalPause?: boolean;
    loop?: boolean;
    onChange?: EventListener;
    onChangeObj?: unknown;
    override?: boolean;
    paused?: boolean;
    position?: number;
}
export interface TweenStep {
    type: "step";
    d: number;
    t: number;
    p0: TweenProperties;
    p1: TweenProperties;
    e?: EaseFunction | null | undefined;
    v?: boolean | undefined;
}
export interface TweenAction {
    type: "action";
    t: number;
    execute(): void;
}
export interface TweenPlugin {
    init(tween: Tween, name: string, value: unknown): unknown;
    step?(tween: Tween, name: string, oldValue: unknown, newValue: unknown, injectProps: TweenProperties): void;
    tween(tween: Tween, name: string, value: unknown, start: TweenProperties, end: TweenProperties, ratio: number, isWait: boolean, isEnd: boolean): unknown;
}
export interface Texture {
    $renderBuffer?: sys.RenderBuffer | null;
}
export interface EngineWebGLTexture {
    isCanvas?: boolean;
    smoothing?: boolean;
    UNPACK_PREMULTIPLY_ALPHA_WEBGL?: boolean;
    is_compressed_texture?: boolean;
    etc_alpha_mask?: EngineWebGLTexture;
}
export interface OrientationEvent {
    beta: number | null;
    gamma: number | null;
    alpha: number | null;
}
export interface XML extends web.XML {

}
export interface InputTextFieldState {
    13: string;
    35: string | null | undefined;
    36: string | null | undefined;
}
export interface InputTextField extends DisplayObject {
    $inputEnabled: boolean;
    $TextField: InputTextFieldState;
    $setIsTyping(value: boolean): void;
    $setBaseText(value: string): void;
}
export interface StageText extends IEventDispatcher {
    $setTextField(text: InputTextField): void;
    $addToStage(): void;
    $removeFromStage(): void;
    $getText(): string;
    $setText(value: string): void;
    $setColor(value: number): void;
    $onBlur(): void;
    $show(): void;
    $hide(): void;
    $resetStageText(): void;
}
export interface GlowColorUniform {
    x: number;
    y: number;
    z: number;
    w: number;
}
export interface GlowFilterUniforms extends FilterUniforms {
    color: GlowColorUniform;
    alpha: number;
    blurX: number;
    blurY: number;
    strength: number;
    inner: 0 | 1;
    knockout: 0 | 1;
    dist: number;
    angle: number;
    hideObject: 0 | 1;
}
export interface StageScreen {
    updateScreenSize(): void;
    updateMaxTouches(): void;
    setContentSize(width: number, height: number): void;
}
export interface StageTicker {
    $frameRate: number;
    $setFrameRate(value: number): void;
}
export interface ChildrenSortModeConstants {
    DEFAULT: "default";
    INCREASE_Y: "increaseY";
    DECREASE_Y: "decreaseY";
}
export interface CapsStyleConstants {
    NONE: "none";
    ROUND: "round";
    SQUARE: "square";
}
export interface EngineWebGLTexture extends WebGLTexture {
    engine_default_empty_texture?: boolean;
    glContext?: WebGLContext | null;
}
export interface BitmapDataSource {
    width?: number | string;
    height?: number | string;
    readonly byteLength?: number;
    src?: string;
    dispose?(): void;
}
export interface Texture {
    scale9Grid?: Rectangle | null;
}
export interface SpriteConstructor {
    $EVENT_ADD_TO_STAGE_LIST: DisplayObject[];
    $EVENT_REMOVE_FROM_STAGE_LIST: DisplayObject[];
}
export interface FilterOffset {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
export interface IEventDispatcher extends IHashObject {
    addEventListener(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean, priority?: number): void;
    once(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean, priority?: number): void;
    removeEventListener(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean): void;
    hasEventListener(type: string): boolean;
    willTrigger(type: string): boolean;
    dispatchEvent(event: Event): boolean;
    dispatchEventWith<TData = unknown>(type: string, bubbles?: boolean, data?: TData, cancelable?: boolean): boolean;
}
export interface EventBin<TListener = EventListener> {
    type: string;
    listener: TListener;
    thisObject: unknown;
    priority: number;
    target: EventDispatcher;
    useCapture: boolean | undefined;
    dispatchOnce: boolean;
}
interface EventDispatcherState {
    0: object;
    1: EventMap;
    2: EventMap;
    3: number;
}
interface BlurFilterShape extends Filter {
    type: "blur";
    blurX: number;
    blurY: number;
}
interface GlowFilterShape extends Filter {
    type: "glow";
    blurX: number;
    blurY: number;
    distance?: number;
    angle?: number;
}
interface CustomFilterShape extends Filter {
    type: "custom";
    padding: number;
}
interface RecyclerFrameCheck {
    $checkFrame(): void;
}
interface AccessorClass<TThis, TArgs extends unknown[], TResult> {
    prototype: object;
    __sets__?: Record<string, ((this: TThis, ...values: TArgs) => void) | undefined>;
    __gets__?: Record<string, ((this: TThis) => TResult) | undefined>;
}
interface ReflectionMetadata {
    __class__?: string;
    __types__?: string[];
}
interface QualifiedPrototype extends ReflectionMetadata {
    constructor: { toString(): string };
}
interface PrototypeValue {
    prototype?: QualifiedPrototype;
}
// interface ConsoleMethods {
//     error: ConsoleMethod;
//     debug: ConsoleMethod;
//     warn: ConsoleMethod;
//     info: ConsoleMethod;
//     log: ConsoleMethod;
// }
interface PrototypeOwner {
    prototype: object;
}
interface PooledEventConstructor<TEvent extends Event> extends EventConstructor<TEvent> {
    eventPool?: TEvent[];
    _props?: EventPropertyData;
}

export function getString(code: number, ...params: unknown[]): string {
    return runtime.sys.tr.apply(runtime.sys, [code, ...params]);
}
export function $error(code: number, ...params: unknown[]): never {
    const text: string = runtime.sys.tr.apply(null, [code, ...params]);
    runtime.sys.$errorToFPS("Error #" + code + ": " + text);
    throw new Error("#" + code + ": " + text);
}
export function $warn(code: number, ...params: unknown[]): void {
    const text: string = runtime.sys.tr.apply(null, [code, ...params]);
    runtime.sys.$warnToFPS("Warning #" + code + ": " + text);
    warn("Warning #" + code + ": " + text);
}
export function $markCannotUse<TValue>(instance: PrototypeOwner, property: PropertyKey, defaultValue?: TValue): void {
    Object.defineProperty(instance.prototype, property, {
        get: function (): TValue | undefined {
            $warn(1009, getQualifiedClassName(instance), property);
            return defaultValue;
        },
        set: function (_value: TValue): void {
            $error(1009, getQualifiedClassName(instance), property);
        },
        enumerable: true,
        configurable: true
    });
}
export function log(...messages: unknown[]): void {
    if (runtime.web.WebMiscHelper.isShowLog) {
        let info: string = "";
        for (let i: number = 0; i < messages.length; i++) {
            info += messages[i] + " ";
        }
        runtime.sys.$logToFPS(info);
    }
    console.log(...messages);
}
export function warn(...messages: unknown[]): void {
    if (runtime.web.WebMiscHelper.isShowLog) {
        let info: string = "";
        for (let i: number = 0; i < messages.length; i++) {
            info += messages[i] + " ";
        }
        runtime.sys.$warnToFPS(info);
    }
    console.warn(...messages);
}
export function error(...messages: unknown[]): void {
    if (runtime.web.WebMiscHelper.isShowLog) {
        let info: string = "";
        for (let i: number = 0; i < messages.length; i++) {
            info += messages[i] + " ";
        }
        runtime.sys.$errorToFPS(info);
    }
    console.error(...messages);
}
export function assert(condition?: unknown, ...messages: unknown[]): void {
    console.assert(condition as boolean | undefined, ...messages);
}
export function registerImplementation<T>(interfaceName: string, instance: T): void {
    ImplMapHelper.implMap[interfaceName] = instance;
}
export function getImplementation<T = unknown>(interfaceName: string): T | undefined {
    return ImplMapHelper.implMap[interfaceName] as T | undefined;
}
export function registerClass<T extends object>(classDefinition: { prototype: T }, className: string, interfaceNames?: string[]): void {
    if (!classDefinition) { $error(1003, "classDefinition"); }
    if (!classDefinition.prototype) { $error(1012, "classDefinition"); }
    if (className === undefined) { $error(1003, "className"); }
    const prototype: T & ReflectionMetadata = classDefinition.prototype as T & ReflectionMetadata;
    Object.defineProperty(prototype, '__class__', { value: className, enumerable: false, writable: true });
    let types: string[] = [className];
    if (interfaceNames) { types = types.concat(interfaceNames); }
    const superTypes: string[] | undefined = prototype.__types__;
    if (superTypes) {
        const length: number = superTypes.length;
        for (let i: number = 0; i < length; i++) {
            const name: string = superTypes[i]!;
            if (types.indexOf(name) == -1) { types.push(name); }
        }
    }
    Object.defineProperty(prototype, '__types__', { value: types, enumerable: false, writable: true });
}
export function callLater<TThis, TArgs extends unknown[], TResult>(
    method: (this: TThis, ...args: TArgs) => TResult, thisObject: TThis, ...args: TArgs
): void {
    CallHelper.$callLaterFunctionList.push(method as DeferredCallback);
    CallHelper.$callLaterThisList.push(thisObject);
    CallHelper.$callLaterArgsList.push(args);
}
export function $callAsync<TThis, TArgs extends unknown[], TResult>(
    method: (this: TThis, ...args: TArgs) => TResult, thisObject: TThis, ...args: TArgs
): void {
    CallHelper.$callAsyncFunctionList.push(method as DeferredCallback);
    CallHelper.$callAsyncThisList.push(thisObject);
    CallHelper.$callAsyncArgsList.push(args);
}
export function superSetter<TThis, TArgs extends unknown[]>(
    currentClass: AccessorClass<TThis, TArgs, unknown>, thisObj: TThis, type: string, ...values: TArgs
): void {
    const cla: object = currentClass.prototype;
    if (!Object.prototype.hasOwnProperty.call(currentClass, "__sets__")) {
        Object.defineProperty(currentClass, "__sets__", { value: {} });
    }
    const setters: NonNullable<typeof currentClass.__sets__> = currentClass.__sets__!;
    let setter: ((this: TThis, ...values: TArgs) => void) | undefined = setters[type];
    if (setter) { return setter.apply(thisObj, values); }
    let prototype: object | null = Object.getPrototypeOf(cla) as object | null;
    while (prototype && !Object.prototype.hasOwnProperty.call(prototype, type)) {
        prototype = Object.getPrototypeOf(prototype) as object | null;
    }
    if (!prototype) { return; }
    const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(prototype, type)!;
    setter = descriptor.set as unknown as (this: TThis, ...values: TArgs) => void;
    setters[type] = setter;
    setter.apply(thisObj, values);
}
export function superGetter<TResult = unknown, TThis = unknown>(
    currentClass: AccessorClass<TThis, unknown[], TResult>, thisObj: TThis, type: string
): TResult | undefined {
    const cla: object = currentClass.prototype;
    if (!Object.prototype.hasOwnProperty.call(currentClass, "__gets__")) {
        Object.defineProperty(currentClass, "__gets__", { value: {} });
    }
    const getters: NonNullable<typeof currentClass.__gets__> = currentClass.__gets__!;
    let getter: ((this: TThis) => TResult) | undefined = getters[type];
    if (getter) { return getter.call(thisObj); }
    let prototype: object | null = Object.getPrototypeOf(cla) as object | null;
    while (prototype && !Object.prototype.hasOwnProperty.call(prototype, type)) {
        prototype = Object.getPrototypeOf(prototype) as object | null;
    }
    if (!prototype) { return undefined; }
    const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(prototype, type)!;
    getter = descriptor.get as (this: TThis) => TResult;
    getters[type] = getter;
    return getter.call(thisObj);
}
export function getDefinitionByName<T = unknown>(name: string): T | null {
    if (!name) { return null; }
    let definition: unknown = DefinitionHelper.getDefinitionByNameCache[name];
    if (definition) { return definition as T; }
    const paths: string[] = name.split(".");
    const length: number = paths.length;
    definition = (globalThis as any).global ?? globalThis;
    for (let i: number = 0; i < length; i++) {
        const path: string = paths[i]!;
        definition = (definition as Record<string, unknown>)[path];
        if (!definition) { return null; }
    }
    DefinitionHelper.getDefinitionByNameCache[name] = definition;
    return definition as T;
}
export function cleanCache(): void {
    DefinitionHelper.getDefinitionByNameCache = {};
}
export function getQualifiedClassName(value: unknown): string {
    const type: string = typeof value;
    if (!value || (type != "object" && !(value as PrototypeValue).prototype)) { return type; }
    const prototype: QualifiedPrototype = (value as PrototypeValue).prototype ||
        Object.getPrototypeOf(value) as QualifiedPrototype;
    if (Object.prototype.hasOwnProperty.call(prototype, "__class__")) { return prototype.__class__!; }
    const constructorString: string = prototype.constructor.toString().trim();
    const index: number = constructorString.indexOf("(");
    const className: string = constructorString.substring(9, index);
    Object.defineProperty(prototype, "__class__", { value: className, enumerable: false, writable: true });
    return className;
}
export function getQualifiedSuperclassName(value: unknown): string | null {
    if (!value || (typeof value != "object" && !(value as PrototypeValue).prototype)) { return null; }
    const prototype: QualifiedPrototype = (value as PrototypeValue).prototype ||
        Object.getPrototypeOf(value) as QualifiedPrototype;
    const superProto: QualifiedPrototype | null = Object.getPrototypeOf(prototype) as QualifiedPrototype | null;
    if (!superProto) { return null; }
    const superClass: string = getQualifiedClassName(superProto.constructor);
    return superClass || null;
}
export function getTimer(): number {
    return Date.now() - runtime.sys.StartTimeHelper.$START_TIME;
}
export function hasDefinition(name: string): boolean {
    const definition: unknown = getDefinitionByName(name);
    return !!definition;
}
export function is(instance: unknown, typeName: string): boolean {
    if (!instance || typeof instance != "object") { return false; }
    const prototype: ReflectionMetadata | null = Object.getPrototypeOf(instance) as ReflectionMetadata | null;
    const types: string[] | null | undefined = prototype ? prototype.__types__ : null;
    return !!types && types.indexOf(typeName) !== -1;
}
export function startTick(callBack: TickCallback, thisObject: unknown): void {
    if (!callBack) { $error(1003, "callBack"); }
    getTicker().$startTick(callBack, thisObject);
}
export function stopTick(callBack: TickCallback, thisObject: unknown): void {
    if (!callBack) { $error(1003, "callBack"); }
    getTicker().$stopTick(callBack, thisObject);
}
export function toColorString(value: number): string {
    if (value < 0) { value = 0; }
    if (value > 16777215) { value = 16777215; }
    let color: string = value.toString(16).toUpperCase();
    while (color.length > 6) { color = color.slice(1, color.length); }
    while (color.length < 6) { color = "0" + color; }
    return "#" + color;
}
export function getHttpRequest() {
    return runtime.web.WebHttpRequest;
}
export function getImageLoader() {
    return runtime.web.WebImageLoader;
}
export function getStageText() {
    return runtime.web.HTML5StageText;
}
export function getFpsDisplay() {
    return runtime.web.WebFps;
}
export function runEgret(options: web.RunEgretOptions) {
    Recycler.$init();

    runtime.web.runEgret(options);
}
export function updateAllScreens() {
    runtime.web.updateAllScreens();
}
export function getOption(key: string) {
    return runtime.web.getOption(key);
}
export function getVideo() {
    return runtime.web.WebVideo;
}
export function getTicker(): sys.SystemTicker {
    // TODO 原api为 export const ticker = sys.SystemTicker.instance;
    return runtime.sys.SystemTicker.instance;
}
export function setInterval<TThis, TArgs extends unknown[], TResult>(
    listener: (this: TThis, ...args: TArgs) => TResult, thisObject: TThis, delay: number, ...args: TArgs
): number {
    return getTicker().setInterval(listener, thisObject, delay, ...args);
}
export function clearInterval(key: number): void {
    getTicker().clearInterval(key);
}
export function setTimeout<TThis, TArgs extends unknown[], TResult>(
    listener: (this: TThis, ...args: TArgs) => TResult, thisObject: TThis, delay: number, ...args: TArgs
): number {
    return getTicker().setTimeout(listener, thisObject, delay, ...args);
}
export function clearTimeout(key: number): void {
    getTicker().clearTimeout(key);
}
export function getFontString(node: sys.TextNode, format: ITextStyle): string {
    const italic: boolean = format.italic == null ? node.italic : format.italic;
    const bold: boolean = format.bold == null ? node.bold : format.bold;
    const size: number = format.size == null ? node.size : format.size;
    const fontFamily: string = format.fontFamily || node.fontFamily;
    let font: string = italic ? "italic " : "normal ";
    font += bold ? "bold " : "normal "; font += size + "px " + fontFamily; return font;
}
export function getRGBAString(color: number, alpha: number): string {
    const red: number = color >> 16;
    const green: number = color >> 8 & 0xFF;
    const blue: number = color & 0xFF;
    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
}
export function getFps() {
    return runtime.sys.FPSImpl;
}
export function createMap<TValue = unknown>(): Record<string, TValue | undefined> {
    const obj: Record<string, TValue | undefined> = Object.create(null) as Record<string, TValue | undefined>;
    obj.__v8__ = undefined;
    delete obj.__v8__;
    return obj;
}
export function __reflect(prototype: object, className: string, types?: string[]): void {
    const metadata: ReflectionMetadata = prototype as ReflectionMetadata;
    metadata.__class__ = className;
    if (types) {
        types.push(className);
    } else {
        types = [className];
    }
    metadata.__types__ = metadata.__types__ ? types.concat(metadata.__types__) : types;
}
function getGradient(context: sys.CanvasContext, type: GradientTypeValue, colors: number[], alphas: number[], ratios: number[], _matrix: Matrix): CanvasGradient {
    const gradient: CanvasGradient = type == GradientType.LINEAR ? context.createLinearGradient(-1, 0, 1, 0) : context.createRadialGradient(0, 0, 0, 0, 0, 1);
    for (let i: number = 0; i < colors.length; i++) { gradient.addColorStop(ratios[i]! / 255, getRGBAString(colors[i]!, alphas[i]!)); }
    return gradient;
}
function setArray(a: PixelBuffer, b: ArrayLike<number>, index: number = 0): void {
    for (let i: number = 0, l: number = b.length; i < l; i++) { a[i + index] = b[i]!; }
}
function colorFilter(buffer: PixelBuffer, w: number, h: number, matrix: readonly number[]): void {
    const r0: number = matrix[0]!, r1: number = matrix[1]!, r2: number = matrix[2]!, r3: number = matrix[3]!, r4: number = matrix[4]!;
    const g0: number = matrix[5]!, g1: number = matrix[6]!, g2: number = matrix[7]!, g3: number = matrix[8]!, g4: number = matrix[9]!;
    const b0: number = matrix[10]!, b1: number = matrix[11]!, b2: number = matrix[12]!, b3: number = matrix[13]!, b4: number = matrix[14]!;
    const a0: number = matrix[15]!, a1: number = matrix[16]!, a2: number = matrix[17]!, a3: number = matrix[18]!, a4: number = matrix[19]!;
    for (let p: number = 0, e: number = w * h * 4; p < e; p += 4) {
        const r: number = buffer[p]!, g: number = buffer[p + 1]!, b: number = buffer[p + 2]!, a: number = buffer[p + 3]!;
        buffer[p] = r0 * r + r1 * g + r2 * b + r3 * a + r4;
        buffer[p + 1] = g0 * r + g1 * g + g2 * b + g3 * a + g4;
        buffer[p + 2] = b0 * r + b1 * g + b2 * b + b3 * a + b4;
        buffer[p + 3] = a0 * r + a1 * g + a2 * b + a3 * a + a4;
    }
}
function blurFilter(buffer: PixelBuffer, w: number, h: number, blurX: number, blurY: number): void {
    blurFilterH(buffer, w, h, blurX); blurFilterV(buffer, w, h, blurY);
}
function blurFilterH(buffer: PixelBuffer, w: number, h: number, blurX: number): void {
    const lineBuffer: PixelBuffer = Use8ClampHelper.getUse8Clamp() ? new Uint8ClampedArray(w * 4) : new Array<number>(w * 4);
    const lineSize: number = w * 4;
    const windowLength: number = blurX * 2 + 1;
    for (let y: number = 0; y < h; y++) {
        const pLineStart: number = y * lineSize;
        let rs: number = 0, gs: number = 0, bs: number = 0, as: number = 0, alpha: number = 0, alpha2: number = 0;
        for (let ptr: number = -blurX * 4, end: number = blurX * 4 + 4; ptr < end; ptr += 4) {
            const key: number = pLineStart + ptr;
            if (key < pLineStart || key >= pLineStart + lineSize) { continue; }
            alpha = buffer[key + 3]!;
            rs += buffer[key]! * alpha; gs += buffer[key + 1]! * alpha; bs += buffer[key + 2]! * alpha; as += alpha;
        }
        for (let ptr: number = pLineStart, end: number = pLineStart + lineSize, linePtr: number = 0, lastPtr: number = ptr - blurX * 4, nextPtr: number = ptr + (blurX + 1) * 4; ptr < end; ptr += 4, linePtr += 4, nextPtr += 4, lastPtr += 4) {
            if (as === 0) { lineBuffer[linePtr] = lineBuffer[linePtr + 1] = lineBuffer[linePtr + 2] = lineBuffer[linePtr + 3] = 0; }
            else { lineBuffer[linePtr] = rs / as; lineBuffer[linePtr + 1] = gs / as; lineBuffer[linePtr + 2] = bs / as; lineBuffer[linePtr + 3] = as / windowLength; }
            alpha = buffer[nextPtr + 3]!; alpha2 = buffer[lastPtr + 3]!;
            if (alpha || alpha == 0) {
                if (alpha2 || alpha2 == 0) {
                    rs += buffer[nextPtr]! * alpha - buffer[lastPtr]! * alpha2;
                    gs += buffer[nextPtr + 1]! * alpha - buffer[lastPtr + 1]! * alpha2;
                    bs += buffer[nextPtr + 2]! * alpha - buffer[lastPtr + 2]! * alpha2; as += alpha - alpha2;
                } else { rs += buffer[nextPtr]! * alpha; gs += buffer[nextPtr + 1]! * alpha; bs += buffer[nextPtr + 2]! * alpha; as += alpha; }
            } else if (alpha2 || alpha2 == 0) { rs += -buffer[lastPtr]! * alpha2; gs += -buffer[lastPtr + 1]! * alpha2; bs += -buffer[lastPtr + 2]! * alpha2; as += -alpha2; }
        }
        if (Use8ClampHelper.getUse8Clamp()) {
            (buffer as Uint8ClampedArray).set(lineBuffer, pLineStart);
        } else {
            setArray(buffer, lineBuffer, pLineStart);
        }
    }
}
function blurFilterV(buffer: PixelBuffer, w: number, h: number, blurY: number): void {
    const columnBuffer: PixelBuffer = Use8ClampHelper.getUse8Clamp() ? new Uint8ClampedArray(h * 4) : new Array<number>(h * 4);
    const stride: number = w * 4;
    const windowLength: number = blurY * 2 + 1;
    for (let x: number = 0; x < w; x++) {
        const pColumnStart: number = x * 4;
        let rs: number = 0, gs: number = 0, bs: number = 0, as: number = 0, alpha: number = 0, alpha2: number = 0;
        for (let ptr: number = -blurY * stride, end: number = blurY * stride + stride; ptr < end; ptr += stride) {
            const key: number = pColumnStart + ptr;
            if (key < pColumnStart || key >= pColumnStart + h * stride) { continue; }
            alpha = buffer[key + 3]!;
            rs += buffer[key]! * alpha; gs += buffer[key + 1]! * alpha; bs += buffer[key + 2]! * alpha; as += alpha;
        }
        for (let ptr: number = pColumnStart, end: number = pColumnStart + h * stride, columnPtr: number = 0, lastPtr: number = pColumnStart - blurY * stride, nextPtr: number = pColumnStart + (blurY + 1) * stride; ptr < end; ptr += stride, columnPtr += 4, nextPtr += stride, lastPtr += stride) {
            if (as === 0) { columnBuffer[columnPtr] = columnBuffer[columnPtr + 1] = columnBuffer[columnPtr + 2] = columnBuffer[columnPtr + 3] = 0; }
            else { columnBuffer[columnPtr] = rs / as; columnBuffer[columnPtr + 1] = gs / as; columnBuffer[columnPtr + 2] = bs / as; columnBuffer[columnPtr + 3] = as / windowLength; }
            alpha = buffer[nextPtr + 3]!; alpha2 = buffer[lastPtr + 3]!;
            if (alpha || alpha == 0) {
                if (alpha2 || alpha2 == 0) {
                    rs += buffer[nextPtr]! * alpha - buffer[lastPtr]! * alpha2;
                    gs += buffer[nextPtr + 1]! * alpha - buffer[lastPtr + 1]! * alpha2;
                    bs += buffer[nextPtr + 2]! * alpha - buffer[lastPtr + 2]! * alpha2; as += alpha - alpha2;
                } else { rs += buffer[nextPtr]! * alpha; gs += buffer[nextPtr + 1]! * alpha; bs += buffer[nextPtr + 2]! * alpha; as += alpha; }
            } else if (alpha2 || alpha2 == 0) { rs += -buffer[lastPtr]! * alpha2; gs += -buffer[lastPtr + 1]! * alpha2; bs += -buffer[lastPtr + 2]! * alpha2; as += -alpha2; }
        }
        for (let i: number = x * 4, end: number = i + h * stride, j: number = 0; i < end; i += stride, j += 4) {
            buffer[i] = columnBuffer[j]!; buffer[i + 1] = columnBuffer[j + 1]!; buffer[i + 2] = columnBuffer[j + 2]!; buffer[i + 3] = columnBuffer[j + 3]!;
        }
    }
}
function dropShadowFilter(buffer: PixelBuffer, w: number, h: number, color: RGBA, blurX: number, blurY: number, angle: number, distance: number, strength: number): void {
    const tmp: PixelBuffer = alphaFilter(buffer, color);
    panFilter(tmp, w, h, angle, distance);
    blurFilter(tmp, w, h, blurX, blurY);
    scaleAlphaChannel(tmp, strength);
    compositeSourceOver(tmp, buffer);
    (buffer as Uint8ClampedArray).set(tmp);
    if (Use8ClampHelper.getUse8Clamp()) {
        (buffer as Uint8ClampedArray).set(tmp);
    } else {
        setArray(buffer, tmp);
    }
}
function alphaFilter(buffer: PixelBuffer, color: RGBA = [0, 0, 0, 0]): PixelBuffer {
    color = color || [0, 0, 0, 0];
    const plane: PixelBuffer = Use8ClampHelper.getUse8Clamp() ? new Uint8ClampedArray(buffer) : new Array<number>(buffer.length);
    if (!Use8ClampHelper.getUse8Clamp()) {
        setArray(plane, buffer);
    }
    const colorR: number = color[0], colorG: number = color[1], colorB: number = color[2], colorA: number = color[3];
    for (let ptr: number = 0, end: number = plane.length; ptr < end; ptr += 4) {
        const alpha: number = plane[ptr + 3]!;
        plane[ptr] = colorR * alpha; plane[ptr + 1] = colorG * alpha; plane[ptr + 2] = colorB * alpha; plane[ptr + 3] = colorA * alpha;
    }
    return plane;
}
function panFilter(buffer: PixelBuffer, w: number, h: number, angle: number, distance: number): void {
    const dy: number = Math.sin(angle) * distance | 0;
    const dx: number = Math.cos(angle) * distance | 0;
    if (Use8ClampHelper.getUse8Clamp()) {
        const oldBuffer: Int32Array = new Int32Array((buffer as Uint8ClampedArray).buffer);
        const newBuffer: Int32Array = new Int32Array(oldBuffer.length);
        for (let oy: number = 0; oy < h; oy++) {
            const ny: number = oy + dy;
            if (ny < 0 || ny > h) { continue; }
            for (let ox: number = 0; ox < w; ox++) {
                const nx: number = ox + dx;
                if (nx < 0 || nx > w) { continue; }
                newBuffer[ny * w + nx] = oldBuffer[oy * w + ox]!;
            }
        }
        oldBuffer.set(newBuffer);
    } else {
        const newBuffer: number[] = new Array<number>(buffer.length);
        for (let oy: number = 0; oy < h; oy++) {
            const ny: number = oy + dy;
            if (ny < 0 || ny > h) { continue; }
            for (let ox: number = 0; ox < w; ox++) {
                const nx: number = ox + dx;
                if (nx < 0 || nx > w) { continue; }
                newBuffer[(ny * w + nx) * 4] = buffer[(oy * w + ox) * 4]!;
                newBuffer[(ny * w + nx) * 4 + 1] = buffer[(oy * w + ox) * 4 + 1]!;
                newBuffer[(ny * w + nx) * 4 + 2] = buffer[(oy * w + ox) * 4 + 2]!;
                newBuffer[(ny * w + nx) * 4 + 3] = buffer[(oy * w + ox) * 4 + 3]!;
            }
        }
        setArray(buffer, newBuffer);
    }
}
function scaleAlphaChannel(buffer: PixelBuffer, value: number): void {
    for (let ptr: number = 0, end: number = buffer.length; ptr < end; ptr += 4) { buffer[ptr + 3] = buffer[ptr + 3]! * value; }
}
function compositeSourceOver(dst: PixelBuffer, src: PixelBuffer): void {
    for (let ptr: number = 0, end: number = dst.length; ptr < end; ptr += 4) {
        const Dr: number = dst[ptr]!, Dg: number = dst[ptr + 1]!, Db: number = dst[ptr + 2]!, Da: number = dst[ptr + 3]! / 255;
        const Sr: number = src[ptr]!, Sg: number = src[ptr + 1]!, Sb: number = src[ptr + 2]!, Sa: number = src[ptr + 3]! / 255;
        dst[ptr] = Sr + Dr * (1 - Sa); dst[ptr + 1] = Sg + Dg * (1 - Sa); dst[ptr + 2] = Sb + Db * (1 - Sa); dst[ptr + 3] = (Sa + Da * (1 - Sa)) * 255;
    }
}
function mix(v1: number, v2: number, rate: number): number {
    return v1 * (1 - rate) + v2 * rate;
}
function dropShadowFilter2(buffer: PixelBuffer, w: number, h: number, color: RGBA, blurX: number, blurY: number, angle: number, distance: number, strength: number, inner: number, knockout: number, hideObject: number): void {
    const plane: PixelBuffer = Use8ClampHelper.getUse8Clamp() ? new Uint8ClampedArray(buffer.length) : new Array<number>(buffer.length);
    const alpha: number = color[3];
    let curDistanceX: number = 0, curDistanceY: number = 0;
    const offsetX: number = distance * Math.cos(angle), offsetY: number = distance * Math.sin(angle);
    const linearSamplingTimes: number = 7, circleSamplingTimes: number = 12;
    const PI: number = 3.14159265358979323846264;
    let cosAngle: number, sinAngle: number;
    const stepX: number = blurX / linearSamplingTimes, stepY: number = blurY / linearSamplingTimes;
    for (let u: number = 0; u < w; u++) {
        for (let v: number = 0; v < h; v++) {
            const offset: number = 0, key: number = v * w * 4 + u * 4;
            let totalAlpha: number = 0, maxTotalAlpha: number = 0;
            const r: number = buffer[key]! / 255, g: number = buffer[key + 1]! / 255, b: number = buffer[key + 2]! / 255;
            let a: number = buffer[key + 3]! / 255;
            for (let sampleAngle: number = 0; sampleAngle <= PI * 2; sampleAngle += PI * 2 / circleSamplingTimes) {
                cosAngle = Math.cos(sampleAngle + offset); sinAngle = Math.sin(sampleAngle + offset);
                for (let i: number = 0; i < linearSamplingTimes; i++) {
                    curDistanceX = i * stepX * cosAngle; curDistanceY = i * stepY * sinAngle;
                    const sampleU: number = Math.round(u + curDistanceX - offsetX), sampleV: number = Math.round(v + curDistanceY - offsetY);
                    let sampleAlpha: number = 0;
                    if (!(sampleU >= w || sampleU < 0 || sampleV < 0 || sampleV >= h)) {
                        const sampleKey: number = sampleV * w * 4 + sampleU * 4;
                        sampleAlpha = buffer[sampleKey + 3]! / 255;
                    }
                    totalAlpha += (linearSamplingTimes - i) * sampleAlpha; maxTotalAlpha += linearSamplingTimes - i;
                }
            }
            a = Math.max(a, 0.0001);
            const outerGlowAlpha: number = totalAlpha / maxTotalAlpha * strength * alpha * (1 - inner) * Math.max(Math.min(hideObject, knockout), 1 - a);
            const innerGlowAlpha: number = (maxTotalAlpha - totalAlpha) / maxTotalAlpha * strength * alpha * inner * a;
            a = Math.max(a * knockout * (1 - hideObject), 0.0001);
            const rate1: number = innerGlowAlpha / (innerGlowAlpha + a);
            const r1: number = mix(r, color[0], rate1), g1: number = mix(g, color[1], rate1), b1: number = mix(b, color[2], rate1);
            const rate2: number = outerGlowAlpha / (innerGlowAlpha + a + outerGlowAlpha);
            const r2: number = mix(r1, color[0], rate2), g2: number = mix(g1, color[1], rate2), b2: number = mix(b1, color[2], rate2);
            const resultAlpha: number = Math.min(a + outerGlowAlpha + innerGlowAlpha, 1);
            plane[key] = r2 * 255; plane[key + 1] = g2 * 255; plane[key + 2] = b2 * 255; plane[key + 3] = resultAlpha * 255;
        }
    }
    if (Use8ClampHelper.getUse8Clamp()) {
        (buffer as Uint8ClampedArray).set(plane);
    } else {
        setArray(buffer, plane);
    }
}
function measureTextWidth(text: string, values: TextFieldState, style: ITextStyle = {}): number {
    const italic: boolean = style.italic == null ? values[16] : style.italic;
    const bold: boolean = style.bold == null ? values[15] : style.bold;
    const size: number = style.size == null ? values[0] : style.size;
    const fontFamily: string = style.fontFamily || values[8] || TextField.default_fontFamily;
    return runtime.sys.measureText(text, fontFamily, size, bold, italic);
}
function clampAngle(value: number): number {
    value %= Math.PI * 2;
    if (value < 0) {
        value += Math.PI * 2;
    }
    return value;
}
function createBezierPoints(pointsData: readonly number[], pointsAmount: number): Point[] {
    const points: Point[] = [];
    for (let i: number = 0; i < pointsAmount; i++) {
        const point: Point = getBezierPointByFactor(pointsData, i / pointsAmount);
        if (point) {
            points.push(point);
        }
    }
    return points;
}
function getBezierPointByFactor(pointsData: readonly number[], t: number): Point {
    let i: number = 0;
    let x: number = 0;
    let y: number = 0;
    const len: number = pointsData.length;
    if (len / 2 == 3) {
        const x0: number = pointsData[i++]!;
        const y0: number = pointsData[i++]!;
        const x1: number = pointsData[i++]!;
        const y1: number = pointsData[i++]!;
        const x2: number = pointsData[i++]!;
        const y2: number = pointsData[i++]!;
        x = getCurvePoint(x0, x1, x2, t);
        y = getCurvePoint(y0, y1, y2, t);
    } else if (len / 2 == 4) {
        const x0: number = pointsData[i++]!;
        const y0: number = pointsData[i++]!;
        const x1: number = pointsData[i++]!;
        const y1: number = pointsData[i++]!;
        const x2: number = pointsData[i++]!;
        const y2: number = pointsData[i++]!;
        const x3: number = pointsData[i++]!;
        const y3: number = pointsData[i++]!;
        x = getCubicCurvePoint(x0, x1, x2, x3, t);
        y = getCubicCurvePoint(y0, y1, y2, y3, t);
    }
    return Point.create(x, y);
}
function getCurvePoint(value0: number, value1: number, value2: number, factor: number): number {
    const result: number = Math.pow(1 - factor, 2) * value0 + 2 * factor * (1 - factor) * value1 + Math.pow(factor, 2) * value2;
    return result;
}
function getCubicCurvePoint(value0: number, value1: number, value2: number, value3: number, factor: number): number {
    const result: number = Math.pow(1 - factor, 3) * value0 + 3 * factor * Math.pow(1 - factor, 2) * value1 + 3 * (1 - factor) * Math.pow(factor, 2) * value2 + Math.pow(factor, 3) * value3;
    return result;
}
function clampRotation(value: number): number {
    value %= 360;
    if (value > 180) {
        value -= 360;
    } else if (value < -180) {
        value += 360;
    }
    return value;
}

export class JointStyle {
    public static readonly BEVEL: JointStyleValue = "bevel";
    public static readonly MITER: JointStyleValue = "miter";
    public static readonly ROUND: JointStyleValue = "round";
}

export class LocaleStringsHelper {
    private static $locale_strings: Record<string, Record<string, string>> | undefined;
    private static $language: string = "en_US";

    public static getLocaleStrings(): Record<string, Record<string, string>> {
        return LocaleStringsHelper.$locale_strings ??= LocaleStringsHelper.createLocaleStrings();
    }
    private static createLocaleStrings(): Record<string, Record<string, string>> {
        const $locale_strings: Record<string, Record<string, string>> = {};
        $locale_strings["zh_CN"] ||= {};
        $locale_strings["en_US"] ||= {};

        {
            const locale_strings: LocaleStrings = $locale_strings["en_US"];
            locale_strings[1001] = "Could not find Egret entry class: {0}��";
            locale_strings[1002] = "Egret entry class '{0}' must inherit from egret.DisplayObject.";
            locale_strings[1003] = "Parameter {0} must be non-null.";
            locale_strings[1004] = "An object cannot be added as a child to one of it's children (or children's children, etc.).";
            locale_strings[1005] = "An object cannot be added as a child of itself.";
            locale_strings[1006] = "The supplied DisplayObject must be a child of the caller.";
            locale_strings[1007] = "An index specified for a parameter was out of range.";
            locale_strings[1008] = "Instantiate singleton error��singleton class {0} can not create multiple instances.";
            locale_strings[1009] = "the Class {0} cannot use the property \"{1}\"";
            locale_strings[1010] = "the property \"{1}\" of the Class \"{0}\" is readonly";
            locale_strings[1011] = "Stream Error. URL: {0}";
            locale_strings[1012] = "The type of parameter {0} must be Class.";
            locale_strings[1013] = "Variable assignment is NaN, please see the code!";
            locale_strings[1014] = "the constant \"{1}\" of the Class \"{0}\" is read-only";
            locale_strings[1015] = "xml not found!";
            locale_strings[1016] = "{0}has been obsoleted";
            locale_strings[1017] = "The format of JSON file is incorrect: {0}\ndata: {1}";
            locale_strings[1018] = "the scale9Grid is not correct";
            locale_strings[1019] = "Network ab:{0}";
            locale_strings[1020] = "Cannot initialize Shader";
            locale_strings[1021] = "Current browser does not support webgl";
            locale_strings[1022] = "{0} ArgumentError";
            locale_strings[1023] = "This method is not available in the ScrollView!";
            locale_strings[1025] = "end of the file";
            locale_strings[1026] = "! EncodingError The code point {0} could not be encoded.";
            locale_strings[1027] = "DecodingError";
            locale_strings[1028] = ". called injection is not configured rule: {0}, please specify configuration during its initial years of injection rule, and then call the corresponding single case.";
            locale_strings[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
            locale_strings[1033] = "Photos can not be used across domains toDataURL to convert base64";
            locale_strings[1034] = "Music file decoding failed: \"{0}\", please use the standard conversion tool reconversion under mp3.";
            locale_strings[1035] = "Native does not support this feature!";
            locale_strings[1036] = "Sound has stopped, please recall Sound.play () to play the sound!";
            locale_strings[1037] = "Non-load the correct blob!";
            locale_strings[1038] = "XML format error!";
            locale_strings[1039] = "Cross domains pictures can not get pixel information!";
            locale_strings[1040] = "hitTestPoint can not detect crossOrigin images! Please check if the display object has crossOrigin elements.";
            locale_strings[1041] = "{0} is deprecated, please use {1} replace";
            locale_strings[1042] = "The parameters passed in the region needs is an integer in drawToTexture method. Otherwise, some browsers will draw abnormal.";
            locale_strings[1043] = "Compile errors in {0}, the attribute name: {1}, the attribute value: {2}.";
            locale_strings[1044] = "The current version of the Runtime does not support video playback, please use the latest version";
            locale_strings[1045] = "The resource url is not found";
            locale_strings[1046] = "BitmapText no corresponding characters: {0}, please check the configuration file";
            locale_strings[1047] = "egret.localStorage.setItem save failed,key={0}&value={1}";
            locale_strings[1048] = "Video loading failed";
            locale_strings[1049] = "In the absence of sound is not allowed to play after loading";
            locale_strings[1050] = "ExternalInterface calls the method without js registration: {0}";
            locale_strings[1051] = "runtime only support webgl render mode";
            locale_strings[1052] = "network request timeout{0}";
            locale_strings[3000] = "Theme configuration file failed to load: {0}";
            locale_strings[3001] = "Cannot find the skin name which is configured in Theme: {0}";
            locale_strings[3002] = "Index:\"{0}\" is out of the collection element index range";
            locale_strings[3003] = "Cannot be available in this component. If this component is container, please continue to use";
            locale_strings[3004] = "addChild(){0}addElement() replace";
            locale_strings[3005] = "addChildAt(){0}addElementAt() replace";
            locale_strings[3006] = "removeChild(){0}removeElement() replace";
            locale_strings[3007] = "removeChildAt(){0}removeElementAt() replace";
            locale_strings[3008] = "setChildIndex(){0}setElementIndex() replace";
            locale_strings[3009] = "swapChildren(){0}swapElements() replace";
            locale_strings[3010] = "swapChildrenAt(){0}swapElementsAt() replace";
            locale_strings[3011] = "Index:\"{0}\" is out of the visual element index range";
            locale_strings[3012] = "This method is not available in Scroller component!";
            locale_strings[3013] = "UIStage is GUI root container, and only one such instant is in the display list��";
            locale_strings[3014] = "set fullscreen error";
            locale_strings[3100] = "Current browser does not support WebSocket";
            locale_strings[3101] = "Please connect Socket firstly";
            locale_strings[3102] = "Please set the type of binary type";
            locale_strings[3200] = "getResByUrl must be called after loadConfig";
            locale_strings[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
            locale_strings[4001] = "Abstract class can not be instantiated!";
            locale_strings[4002] = "Unnamed data!";
            locale_strings[4003] = "Nonsupport version!";
            locale_strings[4500] = "The platform does not support {0} adapter mode and has been automatically replaced with {1} mode, please modify your code adapter logic";
        }
        {
            const locale_strings: LocaleStrings = $locale_strings["zh_CN"];
            locale_strings[1001] = "找不到Egret入口类: {0}。";
            locale_strings[1002] = "Egret入口类 {0} 必须继承自egret.DisplayObject。";
            locale_strings[1003] = "参数 {0} 不能为 null。";
            locale_strings[1004] = "无法将对象添加为它的一个子对象（或子对象的子对象等）的子对象。";
            locale_strings[1005] = "不能将对象添加为其自身的子对象。";
            locale_strings[1006] = "提供的 DisplayObject 必须是调用者的子级。";
            locale_strings[1007] = "为参数指定的索引不在范围内。";
            locale_strings[1008] = "实例化单例出错，不允许实例化多个 {0} 对象。";
            locale_strings[1009] = "类 {0} 不可以使用属性 {1}";
            locale_strings[1010] = "类 {0} 属性 {1} 是只读的";
            locale_strings[1011] = "流错误。URL: {0}";
            locale_strings[1012] = "参数 {0} 的类型必须为 Class。";
            locale_strings[1013] = "变量赋值为NaN，请查看代码！";
            locale_strings[1014] = "类 {0} 常量 {1} 是只读的";
            locale_strings[1015] = "xml not found!";
            locale_strings[1016] = "{0}已经废弃";
            locale_strings[1017] = "JSON文件格式不正确: {0}\ndata: {1}";
            locale_strings[1018] = "9宫格设置错误";
            locale_strings[1019] = "网络异常:{0}";
            locale_strings[1020] = "无法初始化着色器";
            locale_strings[1021] = "当前浏览器不支持webgl";
            locale_strings[1022] = "{0} ArgumentError";
            locale_strings[1023] = "此方法在ScrollView内不可用!";
            locale_strings[1025] = "遇到文件尾";
            locale_strings[1026] = "EncodingError! The code point {0} could not be encoded.";
            locale_strings[1027] = "DecodingError";
            locale_strings[1028] = "调用了未配置的注入规则:{0}。 请先在项目初始化里配置指定的注入规则，再调用对应单例。";
            locale_strings[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
            locale_strings[1033] = "跨域图片不可以使用toDataURL来转换成base64";
            locale_strings[1034] = "音乐文件解码失败：\"{0}\"，请使用标准的转换工具重新转换下mp3。";
            locale_strings[1035] = "Native 下暂未实现此功能！";
            locale_strings[1036] = "声音已停止，请重新调用 Sound.play() 来播放声音！";
            locale_strings[1037] = "非正确的blob加载！";
            locale_strings[1038] = "XML 格式错误!";
            locale_strings[1039] = "跨域图片不能获取像素信息!";
            locale_strings[1040] = "hitTestPoint 不能对跨域图片进行检测! 请检查该显示对象内是否含有跨域元素";
            locale_strings[1041] = "{0} 已废弃,请使用 {1} 代替";
            locale_strings[1042] = "drawToTexture方法传入的区域各个参数需要为整数,否则某些浏览器绘制会出现异常";
            locale_strings[1043] = "{0} 中存在编译错误，属性名 : {1}，属性值 : {2}";
            locale_strings[1044] = "当前的 runtime 版本不支持视频播放,请使用最新的版本";
            locale_strings[1045] = "没有设置要加载的资源地址";
            locale_strings[1046] = "BitmapText 找不到对应字符:{0}，请检查配置文件";
            locale_strings[1047] = "egret.localStorage.setItem保存失败,key={0}&value={1}";
            locale_strings[1048] = "视频加载失败";
            locale_strings[1049] = "声音在没有加载完之前不允许播放";
            locale_strings[1050] = "ExternalInterface调用了js没有注册的方法: {0}";
            locale_strings[1051] = "runtime 只支持 webgl 渲染模式";
            locale_strings[1052] = "网络请求超时:{0}";
            locale_strings[3000] = "主题配置文件加载失败: {0}";
            locale_strings[3001] = "找不到主题中所配置的皮肤类名: {0}";
            locale_strings[3002] = "索引:\"{0}\"超出集合元素索引范围";
            locale_strings[3003] = "在此组件中不可用，若此组件为容器类，请使用";
            locale_strings[3004] = "addChild(){0}addElement()代替";
            locale_strings[3005] = "addChildAt(){0}addElementAt()代替";
            locale_strings[3006] = "removeChild(){0}removeElement()代替";
            locale_strings[3007] = "removeChildAt(){0}removeElementAt()代替";
            locale_strings[3008] = "setChildIndex(){0}setElementIndex()代替";
            locale_strings[3009] = "swapChildren(){0}swapElements()代替";
            locale_strings[3010] = "swapChildrenAt(){0}swapElementsAt()代替";
            locale_strings[3011] = "索引:\"{0}\"超出可视元素索引范围";
            locale_strings[3012] = "此方法在Scroller组件内不可用!";
            locale_strings[3013] = "UIStage是GUI根容器，只能有一个此实例在显示列表中！";
            locale_strings[3014] = "设置全屏模式失败";
            locale_strings[3100] = "当前浏览器不支持WebSocket";
            locale_strings[3101] = "请先连接WebSocket";
            locale_strings[3102] = "请先设置type为二进制类型";
            locale_strings[3200] = "getResByUrl 必须在 loadConfig 之后调用";
            locale_strings[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
            locale_strings[4001] = "Abstract class can not be instantiated!";
            locale_strings[4002] = "Unnamed data!";
            locale_strings[4003] = "Nonsupport version!";
            locale_strings[4500] = "该平台不支持 {0} 适配模式，已经自动替换为 {1} 模式，请修改您的代码适配逻辑";
        }

        return $locale_strings;
    }

    public static getLanguage(): string {
        return LocaleStringsHelper.$language;
    }
    public static setLanguage(language: string): void {
        LocaleStringsHelper.$language = language;
    }
}

export class CallHelper {
    public static $callLaterFunctionList: (DeferredCallback | null)[] = [];
    public static $callLaterThisList: unknown[] = [];
    public static $callLaterArgsList: unknown[][] = [];
    public static $callAsyncFunctionList: (DeferredCallback | null)[] = [];
    public static $callAsyncThisList: unknown[] = [];
    public static $callAsyncArgsList: unknown[][] = [];
}

export class DefinitionHelper {
    public static getDefinitionByNameCache: Record<string, unknown> = {};

    public static readonly etc_alpha_mask: "etc_alpha_mask" = 'etc_alpha_mask';
    public static readonly engine_default_empty_texture: "engine_default_empty_texture" = 'engine_default_empty_texture';
    public static readonly is_compressed_texture: "is_compressed_texture" = 'is_compressed_texture';
    public static readonly glContext: "glContext" = 'glContext';
    public static readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: "UNPACK_PREMULTIPLY_ALPHA_WEBGL" = 'UNPACK_PREMULTIPLY_ALPHA_WEBGL';
}

export class GlobalHelper {
    public static readonly egret_stages: Stage[] = [];
}

export class BitmapFillMode {
    public static readonly REPEAT = "repeat";
    public static readonly SCALE = "scale";
    public static readonly CLIP = "clip";
}

export class OrientationMode {
    public static readonly AUTO: "auto";
    public static readonly PORTRAIT: "portrait";
    public static readonly LANDSCAPE: "landscape";
    public static readonly LANDSCAPE_FLIPPED: "landscapeFlipped";
}

export class RuntimeType {
    public static readonly WEB: string = "web";
    public static readonly NATIVE: string = "native";
    public static readonly RUNTIME2: string = "runtime2";
    public static readonly MYGAME: string = "mygame";
    public static readonly WXGAME: string = "wxgame";
    public static readonly BAIDUGAME: string = "baidugame";
    public static readonly QGAME: string = "qgame";
    public static readonly OPPOGAME: string = "oppogame";
    public static readonly QQGAME: string = "qqgame";
    public static readonly VIVOGAME: string = "vivogame";
}

export class ChildrenSortMode {
    public static readonly DEFAULT: ChildrenSortModeValue = "default";
    public static readonly INCREASE_Y: ChildrenSortModeValue = "increaseY";
    public static readonly DECREASE_Y: ChildrenSortModeValue = "decreaseY";
}

export class CapsStyle {
    public static readonly NONE: CapsStyleValue = "none";
    public static readonly ROUND: CapsStyleValue = "round";
    public static readonly SQUARE: CapsStyleValue = "square";
}

class UuidHelper {
    private static readonly chars: string[] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    private static readonly uuid: string[] = new Array<string>(36);
    private static rnd: number = 0;
    private static r: number;

    public static generateUUID(): string {
        for (let i: number = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                UuidHelper.uuid[i] = '-';
            } else if (i === 14) {
                UuidHelper.uuid[i] = '4';
            } else {
                if (UuidHelper.rnd <= 0x02) {
                    UuidHelper.rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                }
                UuidHelper.r = UuidHelper.rnd & 0xf;
                UuidHelper.rnd = UuidHelper.rnd >> 4;
                UuidHelper.uuid[i] = UuidHelper.chars[(i === 19) ? (UuidHelper.r & 0x3) | 0x8 : UuidHelper.r]!;
            }
        }
        return UuidHelper.uuid.join('');
    };

}

class SplitRegexHelper {
    public static readonly SplitRegex = new RegExp("(?=[\\u00BF-\\u1FFF\\u2C00-\\uD7FF]|\\b|\\s)(?![。，！、》…）)}”】\\.\\,\\!\\?\\]\\:])");
}

class Use8ClampHelper {
    private static use8Clamp: boolean | undefined;

    public static getUse8Clamp(): boolean {
        return Use8ClampHelper.use8Clamp ??= Use8ClampHelper.checkUse8Clamp();
    }
    private static checkUse8Clamp(): boolean {
        let use8Clamp: boolean = false;
        try {
            use8Clamp = typeof Uint8ClampedArray !== "undefined";
        } catch (e: unknown) {
            return false;
        }
        return use8Clamp;
    }
}

class ImplMapHelper {
    public static readonly implMap: Record<string, unknown> = {};
}

export class HashObject implements IHashObject {
    public static $hashCount: number = 1;

    public $hashCode: number;

    public constructor() {
        this.$hashCode = HashObject.$hashCount++;
    }

    public get hashCode(): number {
        return this.$hashCode;
    }
}
__reflect(HashObject.prototype, "egret.HashObject", ["egret.IHashObject"]);

export class EventDispatcher extends HashObject implements IEventDispatcher {
    private static readonly ONCE_EVENT_LIST: EventBin[] = [];

    public $EventDispatcher: EventDispatcherState;

    public constructor(target: object | null = null) {
        super();
        this.$EventDispatcher = {
            0: target ? target : this,
            1: {},
            2: {},
            3: 0
        };
    }

    public $getEventMap(useCapture?: boolean): EventMap {
        const values: EventDispatcherState = this.$EventDispatcher;
        const eventMap: EventMap = useCapture ? values[2] : values[1];
        return eventMap;
    }

    public addEventListener(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean, priority?: number): void {
        this.$addListener(type, listener, thisObject, useCapture, priority);
    }

    public once(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean, priority?: number): void {
        this.$addListener(type, listener, thisObject, useCapture, priority, true);
    }

    public $addListener(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void {
        if (!listener) {
            $error(1003, "listener");
        }
        const values: EventDispatcherState = this.$EventDispatcher;
        const eventMap: EventMap = useCapture ? values[2] : values[1];
        let list: EventBin[] | null | undefined = eventMap[type];
        if (!list) {
            list = eventMap[type] = [];
        } else if (values[3] !== 0) {
            eventMap[type] = list = list.concat();
        }
        this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
    }

    public $insertEventBin<TListener>(list: EventBin<TListener>[], type: string, listener: TListener, thisObject: unknown, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): boolean {
        priority = +(priority ?? 0) | 0;
        let insertIndex: number = -1;
        const length: number = list.length;
        for (let i: number = 0; i < length; i++) {
            const bin: EventBin<TListener> = list[i]!;
            if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                return false;
            }
            if (insertIndex == -1 && bin.priority < priority) {
                insertIndex = i;
            }
        }
        const eventBin: EventBin<TListener> = {
            type: type,
            listener: listener,
            thisObject: thisObject,
            priority: priority,
            target: this,
            useCapture: useCapture,
            dispatchOnce: !!dispatchOnce
        };
        if (insertIndex !== -1) {
            list.splice(insertIndex, 0, eventBin);
        } else {
            list.push(eventBin);
        }
        return true;
    }

    public removeEventListener(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean): void {
        const values: EventDispatcherState = this.$EventDispatcher;
        const eventMap: EventMap = useCapture ? values[2] : values[1];
        let list: EventBin[] | null | undefined = eventMap[type];
        if (!list) {
            return;
        }
        if (values[3] !== 0) {
            eventMap[type] = list = list.concat();
        }
        this.$removeEventBin(list, listener, thisObject);
        if (list.length == 0) {
            eventMap[type] = null;
        }
    }

    public $removeEventBin<TListener>(list: EventBin<TListener>[], listener: TListener, thisObject: unknown): boolean {
        const length: number = list.length;
        for (let i: number = 0; i < length; i++) {
            const bin: EventBin<TListener> = list[i]!;
            if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                list.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    public hasEventListener(type: string): boolean {
        const values: EventDispatcherState = this.$EventDispatcher;
        return !!(values[1][type] || values[2][type]);
    }

    public willTrigger(type: string): boolean {
        return this.hasEventListener(type);
    }

    public dispatchEvent(event: Event): boolean {
        event.$currentTarget = this.$EventDispatcher[0];
        event.$setTarget(event.$currentTarget);
        return this.$notifyListener(event, false);
    }

    public $notifyListener(event: Event, capturePhase: boolean): boolean {
        const values: EventDispatcherState = this.$EventDispatcher;
        const eventMap: EventMap = capturePhase ? values[2] : values[1];
        const list: EventBin[] | null | undefined = eventMap[event.$type];
        if (!list) {
            return true;
        }
        const length: number = list.length;
        if (length == 0) {
            return true;
        }
        const onceList: EventBin[] = EventDispatcher.ONCE_EVENT_LIST;
        values[3]++;
        for (let i: number = 0; i < length; i++) {
            const eventBin: EventBin = list[i]!;
            eventBin.listener.call(eventBin.thisObject, event);
            if (eventBin.dispatchOnce) {
                onceList.push(eventBin);
            }
            if (event.$isPropagationImmediateStopped) {
                break;
            }
        }
        values[3]--;
        while (onceList.length) {
            const eventBin: EventBin = onceList.pop()!;
            eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
        }
        return !event.$isDefaultPrevented;
    }

    public dispatchEventWith<TData = unknown>(type: string, bubbles?: boolean, data?: TData, cancelable?: boolean): boolean {
        if (bubbles || this.hasEventListener(type)) {
            const event: Event = Event.create(Event, type, bubbles, cancelable);
            event.data = data;
            const result: boolean = this.dispatchEvent(event);
            Event.release(event);
            return result;
        }
        return true;
    }
}
__reflect(EventDispatcher.prototype, "egret.EventDispatcher", ["egret.IEventDispatcher"]);

export class Filter extends HashObject {
    public type: string | null = null;
    public $id: NativeFilterId | null = null;
    public paddingTop: number = 0;
    public paddingBottom: number = 0;
    public paddingLeft: number = 0;
    public paddingRight: number = 0;
    public $uniforms: FilterUniforms = {};

    public $toJson(): string {
        return '';
    }

    public updatePadding(): void {
    }

    public onPropertyChange(): void {
        const self: this = this;
        self.updatePadding();
    }
}
__reflect(Filter.prototype, "egret.Filter");

export class DisplayObject extends EventDispatcher {
    public static defaultTouchEnabled: boolean = false;
    public static $enterFrameCallBackList: DisplayObject[] = [];
    public static $renderCallBackList: DisplayObject[] = [];

    public $children: DisplayObject[] | null = null;
    public $name: string = "";
    public $parent: DisplayObjectContainer | null = null;
    public $stage: Stage | null = null;
    public $nestLevel: number = 0;
    public $useTranslate: boolean = false;
    public $matrix: Matrix = new Matrix();
    public $matrixDirty: boolean = false;
    public $x: number = 0;
    public $y: number = 0;
    public $scaleX: number = 1;
    public $scaleY: number = 1;
    public $rotation: number = 0;
    public $skewX: number = 0;
    public $skewXdeg: number = 0;
    public $skewY: number = 0;
    public $skewYdeg: number = 0;
    public $explicitWidth: number = NaN;
    public $explicitHeight: number = NaN;
    public $anchorOffsetX: number = 0;
    public $anchorOffsetY: number = 0;
    public $visible: boolean = true;
    public $displayList: sys.DisplayList | null = null;
    public $cacheAsBitmap: boolean = false;
    public $cacheDirty: boolean = false;
    public $alpha: number = 1;
    public $touchEnabled: boolean = DisplayObject.defaultTouchEnabled;
    public $scrollRect: Rectangle | null = null;
    public $blendMode: number = 0;
    public $maskedObject: DisplayObject | null = null;
    public $mask: DisplayObject | null = null;
    public $maskRect: Rectangle | null = null;
    public $parentDisplayList: sys.DisplayList | null = null;
    public $renderNode: sys.RenderNode | null = null;
    public $renderDirty: boolean = false;
    public $renderMode: DisplayRenderMode = null;
    public _tint: number = 0;
    public $tintRGB: number = 0;
    public $sortDirty: boolean = false;
    public _zIndex: number = 0;
    public $lastSortedIndex: number = 0;
    public sortableChildren: boolean = false;
    public declare $hasAddToStage: boolean | undefined;
    public declare $concatenatedMatrix: Matrix | undefined;
    public declare $invertedConcatenatedMatrix: Matrix | undefined;
    public declare $filters: Filter[] | null | undefined;
    // ���� nativeRender Ϊ true ʱ������ԭ�����÷�֧���ô�����ʱԼ����

    public constructor() {
        super();
        this.tint = 0xFFFFFF;
    }

    public get name(): string {
        return this.$name;
    }

    public set name(value: string) {
        this.$name = value;
    }

    public get parent(): DisplayObjectContainer | null {
        return this.$parent;
    }

    public $setParent(parent: DisplayObjectContainer | null): void {
        this.$parent = parent;
    }

    public $onAddToStage(stage: Stage, nestLevel: number): void {
        const self: this = this;
        self.$stage = stage;
        self.$nestLevel = nestLevel;
        self.$hasAddToStage = true;
        Sprite.$EVENT_ADD_TO_STAGE_LIST.push(self);
    }

    public $onRemoveFromStage(): void {
        const self: this = this;
        self.$nestLevel = 0;
        Sprite.$EVENT_REMOVE_FROM_STAGE_LIST.push(self);
    }

    public $updateUseTransform(): void {
        const self: this = this;
        if (self.$scaleX == 1 && self.$scaleY == 1 && self.$skewX == 0 && self.$skewY == 0) {
            self.$useTranslate = false;
        } else {
            self.$useTranslate = true;
        }
    }

    public get stage(): Stage | null {
        return this.$stage;
    }

    public get matrix(): Matrix {
        return this.$getMatrix().clone();
    }

    public set matrix(value: Matrix) {
        this.$setMatrix(value);
    }

    public $getMatrix(): Matrix {
        const self: this = this;
        if (self.$matrixDirty) {
            self.$matrixDirty = false;
            self.$matrix.$updateScaleAndRotation(self.$scaleX, self.$scaleY, self.$skewX, self.$skewY);
        }
        self.$matrix.tx = self.$x;
        self.$matrix.ty = self.$y;
        return self.$matrix;
    }

    public $setMatrix(matrix: Matrix, needUpdateProperties: boolean = true): void {
        const self: this = this;
        const m: Matrix = self.$matrix;
        m.a = matrix.a;
        m.b = matrix.b;
        m.c = matrix.c;
        m.d = matrix.d;
        self.$x = matrix.tx;
        self.$y = matrix.ty;
        self.$matrixDirty = false;
        if (m.a == 1 && m.b == 0 && m.c == 0 && m.d == 1) {
            self.$useTranslate = false;
        } else {
            self.$useTranslate = true;
        }
        if (needUpdateProperties) {
            self.$scaleX = m.$getScaleX();
            self.$scaleY = m.$getScaleY();
            self.$skewX = matrix.$getSkewX();
            self.$skewY = matrix.$getSkewY();
            self.$skewXdeg = clampRotation(self.$skewX * 180 / Math.PI);
            self.$skewYdeg = clampRotation(self.$skewY * 180 / Math.PI);
            self.$rotation = clampRotation(self.$skewY * 180 / Math.PI);
        }
    }

    public $getConcatenatedMatrix(): Matrix {
        const self: this = this;
        let matrix: Matrix | undefined = self.$concatenatedMatrix;
        if (!matrix) {
            matrix = self.$concatenatedMatrix = new Matrix();
        }
        if (self.$parent) {
            self.$parent.$getConcatenatedMatrix().$preMultiplyInto(self.$getMatrix(), matrix);
        } else {
            matrix.copyFrom(self.$getMatrix());
        }
        const offsetX: number = self.$anchorOffsetX;
        const offsetY: number = self.$anchorOffsetY;
        const rect: Rectangle | null = self.$scrollRect;
        if (rect) {
            matrix.$preMultiplyInto(Matrix.$TempMatrix.setTo(1, 0, 0, 1, -rect.x - offsetX, -rect.y - offsetY), matrix);
        } else if (offsetX != 0 || offsetY != 0) {
            matrix.$preMultiplyInto(Matrix.$TempMatrix.setTo(1, 0, 0, 1, -offsetX, -offsetY), matrix);
        }
        return self.$concatenatedMatrix!;
    }

    public $getInvertedConcatenatedMatrix(): Matrix {
        const self: this = this;
        if (!self.$invertedConcatenatedMatrix) {
            self.$invertedConcatenatedMatrix = new Matrix();
        }
        self.$getConcatenatedMatrix().$invertInto(self.$invertedConcatenatedMatrix);
        return self.$invertedConcatenatedMatrix;
    }

    public get x(): number {
        return this.$getX();
    }

    public set x(value: number) {
        this.$setX(value);
    }

    public $getX(): number {
        return this.$x;
    }

    public $setX(value: number): boolean {
        const self: this = this;
        if (self.$x == value) {
            return false;
        }
        self.$x = value;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
        return true;
    }

    public get y(): number {
        return this.$getY();
    }

    public set y(value: number) {
        this.$setY(value);
    }

    public $getY(): number {
        return this.$y;
    }

    public $setY(value: number): boolean {
        const self: this = this;
        if (self.$y == value) {
            return false;
        }
        self.$y = value;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
        return true;
    }

    public get scaleX(): number {
        return this.$getScaleX();
    }

    public set scaleX(value: number) {
        this.$setScaleX(value);
    }

    public $getScaleX(): number {
        return this.$scaleX;
    }

    public $setScaleX(value: number): void {
        const self: this = this;
        if (self.$scaleX == value) {
            return;
        }
        self.$scaleX = value;
        self.$matrixDirty = true;
        self.$updateUseTransform();
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get scaleY(): number {
        return this.$getScaleY();
    }

    public set scaleY(value: number) {
        this.$setScaleY(value);
    }

    public $getScaleY(): number {
        return this.$scaleY;
    }

    public $setScaleY(value: number): void {
        const self: this = this;
        if (self.$scaleY == value) {
            return;
        }
        self.$scaleY = value;
        self.$matrixDirty = true;
        self.$updateUseTransform();
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get rotation(): number {
        return this.$getRotation();
    }

    public set rotation(value: number) {
        this.$setRotation(value);
    }

    public $getRotation(): number {
        return this.$rotation;
    }

    public $setRotation(value: number): void {
        value = clampRotation(value);
        const self: this = this;
        if (value == self.$rotation) {
            return;
        }
        const delta: number = value - self.$rotation;
        const angle: number = delta / 180 * Math.PI;
        self.$skewX += angle;
        self.$skewY += angle;
        self.$rotation = value;
        self.$matrixDirty = true;
        self.$updateUseTransform();
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get skewX(): number {
        return this.$skewXdeg;
    }

    public set skewX(value: number) {
        this.$setSkewX(value);
    }

    public $setSkewX(value: number): void {
        const self: this = this;
        if (value == self.$skewXdeg) {
            return;
        }
        self.$skewXdeg = value;
        value = clampRotation(value);
        value = value / 180 * Math.PI;
        self.$skewX = value;
        self.$matrixDirty = true;
        self.$updateUseTransform();
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get skewY(): number {
        return this.$skewYdeg;
    }

    public set skewY(value: number) {
        this.$setSkewY(value);
    }

    public $setSkewY(value: number): void {
        const self: this = this;
        if (value == self.$skewYdeg) {
            return;
        }
        self.$skewYdeg = value;
        value = clampRotation(value);
        value = (value + self.$rotation) / 180 * Math.PI;
        self.$skewY = value;
        self.$matrixDirty = true;
        self.$updateUseTransform();
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get width(): number {
        return this.$getWidth();
    }

    public set width(value: number) {
        this.$setWidth(value);
    }

    public $getWidth(): number {
        const self: this = this;
        return isNaN(self.$explicitWidth) ? self.$getOriginalBounds().width : self.$explicitWidth;
    }

    public $setWidth(value: number): void {
        value = isNaN(value) ? NaN : value;
        if (this.$explicitWidth == value) {
            return;
        }
        this.$explicitWidth = value;
    }

    public get height(): number {
        return this.$getHeight();
    }

    public set height(value: number) {
        this.$setHeight(value);
    }

    public $getHeight(): number {
        const self: this = this;
        return isNaN(self.$explicitHeight) ? self.$getOriginalBounds().height : self.$explicitHeight;
    }

    public $setHeight(value: number): void {
        value = isNaN(value) ? NaN : value;
        if (this.$explicitHeight == value) {
            return;
        }
        this.$explicitHeight = value;
    }

    public get measuredWidth(): number {
        return this.$getOriginalBounds().width;
    }

    public get measuredHeight(): number {
        return this.$getOriginalBounds().height;
    }

    public get anchorOffsetX(): number {
        return this.$anchorOffsetX;
    }

    public set anchorOffsetX(value: number) {
        this.$setAnchorOffsetX(value);
    }

    public $setAnchorOffsetX(value: number): void {
        const self: this = this;
        if (self.$anchorOffsetX == value) {
            return;
        }
        self.$anchorOffsetX = value;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get anchorOffsetY(): number {
        return this.$anchorOffsetY;
    }

    public set anchorOffsetY(value: number) {
        this.$setAnchorOffsetY(value);
    }

    public $setAnchorOffsetY(value: number): void {
        const self: this = this;
        if (self.$anchorOffsetY == value) {
            return;
        }
        self.$anchorOffsetY = value;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get visible(): boolean {
        return this.$visible;
    }

    public set visible(value: boolean) {
        this.$setVisible(value);
    }

    public $setVisible(value: boolean): void {
        const self: this = this;
        if (self.$visible == value) {
            return;
        }
        self.$visible = value;
        {
            self.$updateRenderMode();
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get cacheAsBitmap(): boolean {
        return this.$cacheAsBitmap;
    }

    public set cacheAsBitmap(value: boolean) {
        const self: this = this;
        self.$cacheAsBitmap = value;
        self.$setHasDisplayList(value);
    }

    public $setHasDisplayList(value: boolean): void {
        const self: this = this;
        const hasDisplayList: boolean = !!self.$displayList;
        if (hasDisplayList == value) {
            return;
        }
        if (value) {
            const displayList: sys.DisplayList | null = runtime.sys.DisplayList.create(self);
            if (displayList) {
                self.$displayList = displayList;
                self.$cacheDirty = true;
            }
        } else {
            self.$displayList = null;
        }
    }

    public $cacheDirtyUp(): void {
        const p: DisplayObjectContainer | null = this.$parent;
        if (p && !p.$cacheDirty) {
            p.$cacheDirty = true;
            p.$cacheDirtyUp();
        }
    }

    public get alpha(): number {
        return this.$alpha;
    }

    public set alpha(value: number) {
        this.$setAlpha(value);
    }

    public $setAlpha(value: number): void {
        const self: this = this;
        if (self.$alpha == value) {
            return;
        }
        self.$alpha = value;
        {
            self.$updateRenderMode();
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get touchEnabled(): boolean {
        return this.$getTouchEnabled();
    }

    public set touchEnabled(value: boolean) {
        this.$setTouchEnabled(value);
    }

    public $getTouchEnabled(): boolean {
        return this.$touchEnabled;
    }

    public $setTouchEnabled(value: boolean): void {
        this.$touchEnabled = !!value;
    }

    public get scrollRect(): Rectangle | null {
        return this.$scrollRect;
    }

    public set scrollRect(value: Rectangle | null) {
        this.$setScrollRect(value);
    }

    public $setScrollRect(value: Rectangle | null): void {
        const self: this = this;
        if (!value && !self.$scrollRect) {
            self.$updateRenderMode();
            return;
        }
        if (value) {
            if (!self.$scrollRect) {
                self.$scrollRect = new Rectangle();
            }
            self.$scrollRect.copyFrom(value);
        } else {
            self.$scrollRect = null;
        }
        self.$updateRenderMode();
        const p: DisplayObjectContainer | null = self.$parent;
        if (p && !p.$cacheDirty) {
            p.$cacheDirty = true;
            p.$cacheDirtyUp();
        }
        const maskedObject: DisplayObject | null = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
            maskedObject.$cacheDirty = true;
            maskedObject.$cacheDirtyUp();
        }
    }

    public get blendMode(): string {
        return runtime.sys.numberToBlendMode(this.$blendMode);
    }

    public set blendMode(value: string) {
        const self: this = this;
        const mode: number = runtime.sys.blendModeToNumber(value);
        if (self.$blendMode == mode) {
            return;
        }
        self.$blendMode = mode;
        {
            self.$updateRenderMode();
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get mask(): DisplayObject | Rectangle | null {
        const self: this = this;
        return self.$mask ? self.$mask : self.$maskRect;
    }

    public set mask(value: DisplayObject | Rectangle | null) {
        const self: this = this;
        if (value === self) {
            return;
        }
        if (value) {
            if (value instanceof DisplayObject) {
                if (value == self.$mask) {
                    return;
                }
                if (value.$maskedObject) {
                    value.$maskedObject.mask = null;
                }
                value.$maskedObject = self;
                self.$mask = value;
                value.$updateRenderMode();
                if (self.$maskRect) {
                    self.$maskRect = null;
                }
            } else {
                if (!self.$maskRect) {
                    self.$maskRect = new Rectangle();
                }
                self.$maskRect.copyFrom(value);
                if (self.$mask) {
                    self.$mask.$maskedObject = null;
                    self.$mask.$updateRenderMode();
                }
                if (self.mask) {
                    self.$mask = null;
                }
            }
        } else {
            if (self.$mask) {
                self.$mask.$maskedObject = null;
                self.$mask.$updateRenderMode();
            }
            if (self.mask) {
                self.$mask = null;
            }
            if (self.$maskRect) {
                self.$maskRect = null;
            }
        }
        self.$updateRenderMode();
    }

    public $setMaskRect(value: Rectangle | null): void {
        const self: this = this;
        if (!value && !self.$maskRect) {
            return;
        }
        if (value) {
            if (!self.$maskRect) {
                self.$maskRect = new Rectangle();
            }
            self.$maskRect.copyFrom(value);
        } else {
            self.$maskRect = null;
        }
    }

    public get filters(): Filter[] | null | undefined {
        return this.$filters;
    }

    public set filters(value: Filter[] | null | undefined) {
        const self: this = this;
        const filters: Filter[] | null | undefined = self.$filters;
        if (!filters && !value) {
            self.$filters = value;
            {
                self.$updateRenderMode();
                const p: DisplayObjectContainer | null = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                const maskedObject: DisplayObject | null = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return;
        }
        if (value && value.length) {
            value = value.concat();
            self.$filters = value;
        } else {
            self.$filters = value;
        }
        self.$updateRenderMode();
        const p: DisplayObjectContainer | null = self.$parent;
        if (p && !p.$cacheDirty) {
            p.$cacheDirty = true;
            p.$cacheDirtyUp();
        }
        const maskedObject: DisplayObject | null = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
            maskedObject.$cacheDirty = true;
            maskedObject.$cacheDirtyUp();
        }
    }

    public getTransformedBounds(targetCoordinateSpace?: DisplayObject | null, resultRect?: Rectangle | null): Rectangle {
        targetCoordinateSpace = targetCoordinateSpace || this;
        return this.$getTransformedBounds(targetCoordinateSpace, resultRect);
    }

    public getBounds(resultRect?: Rectangle | null, calculateAnchor: boolean = true): Rectangle {
        const self: this = this;
        resultRect = self.$getTransformedBounds(self, resultRect);
        if (calculateAnchor) {
            if (self.$anchorOffsetX != 0) {
                resultRect.x -= self.$anchorOffsetX;
            }
            if (self.$anchorOffsetY != 0) {
                resultRect.y -= self.$anchorOffsetY;
            }
        }
        return resultRect;
    }

    public $getTransformedBounds(targetCoordinateSpace?: DisplayObject | null, resultRect?: Rectangle | null): Rectangle {
        const self: this = this;
        const bounds: Rectangle = self.$getOriginalBounds();
        if (!resultRect) {
            resultRect = new Rectangle();
        }
        resultRect.copyFrom(bounds);
        if (targetCoordinateSpace == self) {
            return resultRect;
        }
        let m: Matrix;
        if (targetCoordinateSpace) {
            m = Matrix.$TempMatrix;
            const invertedTargetMatrix: Matrix = targetCoordinateSpace.$getInvertedConcatenatedMatrix();
            invertedTargetMatrix.$preMultiplyInto(self.$getConcatenatedMatrix(), m);
        } else {
            m = self.$getConcatenatedMatrix();
        }
        m.$transformBounds(resultRect);
        return resultRect;
    }

    public globalToLocal(stageX: number = 0, stageY: number = 0, resultPoint?: Point | null): Point {
        {
            const m: Matrix = this.$getInvertedConcatenatedMatrix();
            return m.transformPoint(stageX, stageY, resultPoint);
        }
    }

    public localToGlobal(localX: number = 0, localY: number = 0, resultPoint?: Point | null): Point {
        {
            const m: Matrix = this.$getConcatenatedMatrix();
            return m.transformPoint(localX, localY, resultPoint);
        }
    }

    public $getOriginalBounds(): Rectangle {
        const self: this = this;
        const bounds: Rectangle = self.$getContentBounds();
        self.$measureChildBounds(bounds);
        const offset: FilterOffset = self.$measureFiltersOffset(false);
        if (offset) {
            bounds.x += offset.minX;
            bounds.y += offset.minY;
            bounds.width += -offset.minX + offset.maxX;
            bounds.height += -offset.minY + offset.maxY;
        }
        return bounds;
    }

    public $measureChildBounds(_bounds: Rectangle): void {
    }

    public $getContentBounds(): Rectangle {
        const bounds: Rectangle = Rectangle.$TempRectangle;
        bounds.setEmpty();
        this.$measureContentBounds(bounds);
        return bounds;
    }

    public $measureContentBounds(_bounds: Rectangle): void {
    }

    public $getRenderNode(): sys.RenderNode | null {
        const self: this = this;
        let node: sys.RenderNode | null = self.$renderNode;
        if (!node) {
            return null;
        }
        if (self.$renderDirty) {
            node.cleanBeforeRender();
            self.$updateRenderNode();
            self.$renderDirty = false;
            node = self.$renderNode;
        }
        return node;
    }

    public $updateRenderMode(): void {
        const self: this = this;
        if (!self.$visible || self.$alpha <= 0 || self.$maskedObject) {
            self.$renderMode = 1;
        } else if (self.filters && self.filters.length > 0) {
            self.$renderMode = 2;
        } else if (self.$blendMode !== 0 || (self.$mask && self.$mask.$stage)) {
            self.$renderMode = 3;
        } else if (self.$scrollRect || self.$maskRect) {
            self.$renderMode = 4;
        } else {
            self.$renderMode = null;
        }
    }

    public $measureFiltersOffset(fromParent: boolean): FilterOffset {
        let display: DisplayObject | null = this;
        let minX: number = 0;
        let minY: number = 0;
        let maxX: number = 0;
        let maxY: number = 0;
        while (display) {
            const filters: Filter[] | null | undefined = display.$filters;
            if (filters && filters.length) {
                const length: number = filters.length;
                for (let i: number = 0; i < length; i++) {
                    const filter: Filter = filters[i]!;
                    // Filter ����������ʱ�ṩ����ԭ�� type ���ȷ����Ӧ�Ľṹ��
                    if (filter.type == "blur") {
                        const blurFilter: BlurFilterShape = filter as BlurFilterShape;
                        const offsetX: number = blurFilter.blurX;
                        const offsetY: number = blurFilter.blurY;
                        minX -= offsetX;
                        minY -= offsetY;
                        maxX += offsetX;
                        maxY += offsetY;
                    } else if (filter.type == "glow") {
                        const glowFilter: GlowFilterShape = filter as GlowFilterShape;
                        const offsetX: number = glowFilter.blurX;
                        const offsetY: number = glowFilter.blurY;
                        minX -= offsetX;
                        minY -= offsetY;
                        maxX += offsetX;
                        maxY += offsetY;
                        const distance: number = glowFilter.distance || 0;
                        const angle: number = glowFilter.angle || 0;
                        let distanceX: number = 0;
                        let distanceY: number = 0;
                        if (distance != 0) {
                            distanceX = distance * NumberUtils.cos(angle);
                            if (distanceX > 0) {
                                distanceX = Math.ceil(distanceX);
                            } else {
                                distanceX = Math.floor(distanceX);
                            }
                            distanceY = distance * NumberUtils.sin(angle);
                            if (distanceY > 0) {
                                distanceY = Math.ceil(distanceY);
                            } else {
                                distanceY = Math.floor(distanceY);
                            }
                            minX += distanceX;
                            maxX += distanceX;
                            minY += distanceY;
                            maxY += distanceY;
                        }
                    } else if (filter.type == "custom") {
                        const customFilter: CustomFilterShape = filter as CustomFilterShape;
                        const padding: number = customFilter.padding;
                        minX -= padding;
                        minY -= padding;
                        maxX += padding;
                        maxY += padding;
                    }
                }
            }
            if (fromParent) {
                display = display.$parent;
            } else {
                display = null;
            }
        }
        minX = Math.min(minX, 0);
        minY = Math.min(minY, 0);
        maxX = Math.max(maxX, 0);
        maxY = Math.max(maxY, 0);
        return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
    }

    public $getConcatenatedMatrixAt(root: DisplayObject, matrix: Matrix): void {
        const invertMatrix: Matrix = root.$getInvertedConcatenatedMatrix();
        if (invertMatrix.a === 0 || invertMatrix.d === 0) {
            let target: DisplayObject = this;
            const rootLevel: number = root.$nestLevel;
            matrix.identity();
            while (target.$nestLevel > rootLevel) {
                const rect: Rectangle | null = target.$scrollRect;
                if (rect) {
                    matrix.concat(Matrix.$TempMatrix.setTo(1, 0, 0, 1, -rect.x, -rect.y));
                }
                matrix.concat(target.$getMatrix());
                target = target.$parent!;
            }
        } else {
            invertMatrix.$preMultiplyInto(matrix, matrix);
        }
    }

    public $updateRenderNode(): void {
    }

    public $hitTest(stageX: number, stageY: number): DisplayObject | null {
        const self: this = this;
        if ((!self.$renderNode) || !self.$visible || self.$scaleX == 0 || self.$scaleY == 0) {
            return null;
        }
        const m: Matrix = self.$getInvertedConcatenatedMatrix();
        if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {
            return null;
        }
        const bounds: Rectangle = self.$getContentBounds();
        const localX: number = m.a * stageX + m.c * stageY + m.tx;
        const localY: number = m.b * stageX + m.d * stageY + m.ty;
        if (bounds.contains(localX, localY)) {
            if (!self.$children) {
                const rect: Rectangle | null = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                if (rect && !rect.contains(localX, localY)) {
                    return null;
                }
                if (self.$mask && !self.$mask.$hitTest(stageX, stageY)) {
                    return null;
                }
            }
            return self;
        }
        return null;
    }

    public hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean {
        const self: this = this;
        if (!shapeFlag) {
            if (self.$scaleX == 0 || self.$scaleY == 0) {
                return false;
            }
            const m: Matrix = self.$getInvertedConcatenatedMatrix();
            const bounds: Rectangle = self.getBounds(null, false);
            const localX: number = m.a * x + m.c * y + m.tx;
            const localY: number = m.b * x + m.d * y + m.ty;
            if (bounds.contains(localX, localY)) {
                const rect: Rectangle | null = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                if (rect && !rect.contains(localX, localY)) {
                    return false;
                }
                return true;
            }
            return false;
        } else {
            const m: Matrix = self.$getInvertedConcatenatedMatrix();
            const localX: number = m.a * x + m.c * y + m.tx;
            const localY: number = m.b * x + m.d * y + m.ty;
            let data: Uint8Array | Uint8ClampedArray;
            {
                const displayList: sys.DisplayList | null = self.$displayList;
                if (displayList) {
                    const buffer: sys.RenderBuffer = displayList.renderBuffer;
                    try {
                        data = buffer.getPixels(localX - displayList.offsetX, localY - displayList.offsetY);
                    } catch (e: unknown) {
                        throw new Error(runtime.sys.tr(1039));
                    }
                } else {
                    const buffer: sys.RenderBuffer = runtime.sys.RenderBuffHelper.customHitTestBuffer!;
                    buffer.resize(3, 3);
                    const matrix: Matrix = Matrix.create();
                    matrix.identity();
                    matrix.translate(1 - localX, 1 - localY);
                    runtime.sys.RenderBuffHelper.systemRenderer!.render(this, buffer, matrix, true);
                    Matrix.release(matrix);
                    try {
                        data = buffer.getPixels(1, 1);
                    } catch (e: unknown) {
                        throw new Error(runtime.sys.tr(1039));
                    }
                }
                if (data[3] === 0) {
                    return false;
                }
                return true;
            }
        }
    }

    public override $addListener(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void {
        super.$addListener(type, listener, thisObject, useCapture, priority, dispatchOnce);
        const isEnterFrame: boolean = type == Event.ENTER_FRAME;
        if (isEnterFrame || type == Event.RENDER) {
            const list: DisplayObject[] = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
            if (list.indexOf(this) == -1) {
                list.push(this);
            }
        }
    }

    public override removeEventListener(type: string, listener: EventListener, thisObject: unknown, useCapture?: boolean): void {
        super.removeEventListener(type, listener, thisObject, useCapture);
        const isEnterFrame: boolean = type == Event.ENTER_FRAME;
        if ((isEnterFrame || type == Event.RENDER) && !this.hasEventListener(type)) {
            const list: DisplayObject[] = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
            const index: number = list.indexOf(this);
            if (index !== -1) {
                list.splice(index, 1);
            }
        }
    }

    public override dispatchEvent(event: Event): boolean {
        if (!event.$bubbles) {
            return super.dispatchEvent(event);
        }
        const list: DisplayObject[] = this.$getPropagationList(this);
        const targetIndex: number = list.length * 0.5;
        event.$setTarget(this);
        this.$dispatchPropagationEvent(event, list, targetIndex);
        return !event.$isDefaultPrevented;
    }

    public $getPropagationList(target: DisplayObject | null): DisplayObject[] {
        let list: DisplayObject[] = [];
        while (target) {
            list.push(target);
            target = target.$parent;
        }
        const captureList: DisplayObject[] = list.concat();
        captureList.reverse();
        list = captureList.concat(list);
        return list;
    }

    public $dispatchPropagationEvent(event: Event, list: DisplayObject[], targetIndex: number): void {
        const length: number = list.length;
        const captureIndex: number = targetIndex - 1;
        for (let i: number = 0; i < length; i++) {
            const currentTarget: DisplayObject = list[i]!;
            event.$currentTarget = currentTarget;
            if (i < captureIndex) {
                event.$eventPhase = 1;
            } else if (i == targetIndex || i == captureIndex) {
                event.$eventPhase = 2;
            } else {
                event.$eventPhase = 3;
            }
            currentTarget.$notifyListener(event, i < targetIndex);
            if (event.$isPropagationStopped || event.$isPropagationImmediateStopped) {
                return;
            }
        }
    }

    public override willTrigger(type: string): boolean {
        let parent: DisplayObject | null = this;
        while (parent) {
            if (parent.hasEventListener(type)) {
                return true;
            }
            parent = parent.$parent;
        }
        return false;
    }

    public get tint(): number {
        return this._tint;
    }

    public set tint(value: number) {
        this._tint = value;
        this.$tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
    }

    public sortChildren(): void {
        this.$sortDirty = false;
    }

    public get zIndex(): number {
        return this._zIndex;
    }

    public set zIndex(value: number) {
        this._zIndex = value;
        if (this.parent) {
            this.parent.$sortDirty = true;
        }
    }
}
__reflect(DisplayObject.prototype, "egret.DisplayObject");

export class Texture extends HashObject {
    public static $TextureScaleFactor: number = 1;

    private static sharedCanvas: HTMLCanvasElement | undefined;
    private static sharedContext: CanvasRenderingContext2D | undefined;

    public disposeBitmapData: boolean = true;
    public $bitmapX: number = 0;
    public $bitmapY: number = 0;
    public $bitmapWidth: number = 0;
    public $bitmapHeight: number = 0;
    public $offsetX: number = 0;
    public $offsetY: number = 0;
    public $textureWidth: number = 0;
    public $textureHeight: number = 0;
    public $sourceWidth: number = 0;
    public $sourceHeight: number = 0;
    public $bitmapData: BitmapData | null = null;
    public $ktxData: KTXData | null = null;
    public $rotated: boolean = false;

    public constructor() {
        super();
    }

    public get textureWidth(): number {
        return this.$getTextureWidth();
    }

    public $getTextureWidth(): number {
        return this.$textureWidth;
    }

    public get textureHeight(): number {
        return this.$getTextureHeight();
    }

    public $getTextureHeight(): number {
        return this.$textureHeight;
    }

    public $getScaleBitmapWidth(): number {
        return this.$bitmapWidth * Texture.$TextureScaleFactor;
    }

    public $getScaleBitmapHeight(): number {
        return this.$bitmapHeight * Texture.$TextureScaleFactor;
    }

    public get bitmapData(): BitmapData | null {
        return this.$bitmapData;
    }

    public set bitmapData(value: BitmapData) {
        this.$ktxData = null;
        this._setBitmapData(value);
    }

    public _setBitmapData(value: BitmapData): void {
        this.$bitmapData = value;
        const scale: number = Texture.$TextureScaleFactor;
        const w: number = value.width * scale;
        const h: number = value.height * scale;
        this.$initData(0, 0, w, h, 0, 0, w, h, value.width, value.height);
    }

    public get ktxData(): KTXData | null {
        return this.$ktxData;
    }

    public set ktxData(data: KTXData | null | undefined) {
        this._setKtxData(data);
    }

    public _setKtxData(value: KTXData | null | undefined): void {
        if (!value) {
            error('ktx data is null');
            return;
        }
        if (value == this.$ktxData) {
            return;
        }
        const ktx: KTXContainer = new KTXContainer(value, 1);
        if (ktx.isInvalid) {
            error('ktx data is invalid');
            return;
        }
        this.$ktxData = value;
        const bitmapData: BitmapData = new BitmapData(value);
        bitmapData.format = 'ktx';
        ktx.uploadLevels(bitmapData, false);
        this._setBitmapData(bitmapData);
    }

    public $initData(
        bitmapX: number,
        bitmapY: number,
        bitmapWidth: number,
        bitmapHeight: number,
        offsetX: number,
        offsetY: number,
        textureWidth: number,
        textureHeight: number,
        sourceWidth: number,
        sourceHeight: number,
        rotated: boolean = false
    ): void {
        const scale: number = Texture.$TextureScaleFactor;
        this.$bitmapX = bitmapX / scale;
        this.$bitmapY = bitmapY / scale;
        this.$bitmapWidth = bitmapWidth / scale;
        this.$bitmapHeight = bitmapHeight / scale;
        this.$offsetX = offsetX;
        this.$offsetY = offsetY;
        this.$textureWidth = textureWidth;
        this.$textureHeight = textureHeight;
        this.$sourceWidth = sourceWidth;
        this.$sourceHeight = sourceHeight;
        this.$rotated = rotated;
        BitmapData.$invalidate(this.$bitmapData);
    }

    public getPixel32(x: number, y: number): Uint8Array | Uint8ClampedArray | undefined {
        $warn(1041, "getPixel32", "getPixels");
        return this.getPixels(x, y);
    }

    private convertImageToCanvas(rect?: Rectangle | null): HTMLCanvasElement {
        if (!Texture.sharedCanvas) {
            const sharedCanvas = runtime.sys.createCanvas(NaN, NaN)!;
            Texture.sharedCanvas = sharedCanvas;
            Texture.sharedContext = sharedCanvas.getContext("2d")!;
        }

        const w: number = this.$getTextureWidth();
        const h: number = this.$getTextureHeight();
        if (rect == null) {
            rect = Rectangle.$TempRectangle;
            rect.x = rect.y = 0;
            rect.width = w;
            rect.height = h;
        }
        rect.x = Math.min(rect.x, w - 1);
        rect.y = Math.min(rect.y, h - 1);
        rect.width = Math.min(rect.width, w - rect.x);
        rect.height = Math.min(rect.height, h - rect.y);
        const iWidth: number = rect.width;
        const iHeight: number = rect.height;
        const surface: HTMLCanvasElement = Texture.sharedCanvas!;
        surface.style.width = iWidth + "px";
        surface.style.height = iHeight + "px";
        surface.width = iWidth;
        surface.height = iHeight;

        if (Capabilities.renderMode == "webgl") {
            let renderTexture: Texture;
            if (!this.$renderBuffer) {
                renderTexture = new RenderTexture();
                (renderTexture as RenderTexture).drawToTexture(new Bitmap(this));
            } else {
                renderTexture = this;
            }
            const pixels: Uint8Array | Uint8ClampedArray = renderTexture.$renderBuffer!.getPixels(rect.x, rect.y, iWidth, iHeight);
            const imageData: ImageData = new ImageData(iWidth, iHeight);
            for (let i: number = 0; i < pixels.length; i++) { imageData.data[i] = pixels[i]!; }
            Texture.sharedContext!.putImageData(imageData, 0, 0);
            if (!this.$renderBuffer) {
                renderTexture.dispose();
            }
        } else {
            const offsetX: number = Math.round(this.$offsetX);
            const offsetY: number = Math.round(this.$offsetY);
            const bitmapWidth: number = this.$bitmapWidth;
            const bitmapHeight: number = this.$bitmapHeight;
            Texture.sharedContext!.drawImage(
                this.$bitmapData!.source as CanvasImageSource,
                this.$bitmapX + rect.x / Texture.$TextureScaleFactor,
                this.$bitmapY + rect.y / Texture.$TextureScaleFactor,
                bitmapWidth * rect.width / w,
                bitmapHeight * rect.height / h,
                offsetX,
                offsetY,
                rect.width,
                rect.height
            );
        }
        return surface;
    }

    public getPixels(x: number, y: number, width: number = 1, height: number = 1): Uint8Array | Uint8ClampedArray | undefined {
        if (Capabilities.renderMode == "webgl") {
            let renderTexture: Texture;
            if (!this.$renderBuffer) { renderTexture = new RenderTexture(); (renderTexture as RenderTexture).drawToTexture(new Bitmap(this)); }
            else { renderTexture = this; }
            const pixels: Uint8Array | Uint8ClampedArray = renderTexture.$renderBuffer!.getPixels(x, y, width, height);
            return pixels;
        }
        try {
            const result: Uint8ClampedArray = Texture.sharedContext!.getImageData(x, y, width, height).data;
            return result;
        } catch { $error(1039); }
    }

    public toDataURL(type: string, rect?: Rectangle | null, encoderOptions?: number): string | null {
        try {
            const surface: HTMLCanvasElement = this.convertImageToCanvas(rect);
            const result: string = surface.toDataURL(type, encoderOptions);
            return result;
        } catch {
            $error(1033);
        }
        return null;
    }

    public saveToFile(type: string, filePath: string, rect?: Rectangle | null, encoderOptions?: number): void {
        const base64: string | null = this.toDataURL(type, rect, encoderOptions);
        if (base64 == null) { return; }
        const href: string = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
        const aLink: HTMLAnchorElement = document.createElement("a");
        aLink.download = filePath;
        aLink.href = href;
        const evt: MouseEvent = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        aLink.dispatchEvent(evt);
    }

    public dispose(): void {
        if (this.$bitmapData) {
            if (this.disposeBitmapData) {
                this.$bitmapData.$dispose();
            }
            this.$bitmapData = null;
        }
    }
}
__reflect(Texture.prototype, "egret.Texture");

export class Event<TData = unknown> extends HashObject {
    public static ADDED_TO_STAGE: string = "addedToStage";
    public static REMOVED_FROM_STAGE: string = "removedFromStage";
    public static ADDED: string = "added";
    public static REMOVED: string = "removed";
    public static ENTER_FRAME: string = "enterFrame";
    public static RENDER: string = "render";
    public static RESIZE: string = "resize";
    public static CHANGE: string = "change";
    public static CHANGING: string = "changing";
    public static COMPLETE: string = "complete";
    public static LOOP_COMPLETE: string = "loopComplete";
    public static FOCUS_IN: string = "focusIn";
    public static FOCUS_OUT: string = "focusOut";
    public static ENDED: string = "ended";
    public static ACTIVATE: string = "activate";
    public static DEACTIVATE: string = "deactivate";
    public static CLOSE: string = "close";
    public static CONNECT: string = "connect";
    public static LEAVE_STAGE: string = "leaveStage";
    public static SOUND_COMPLETE: string = "soundComplete";

    public $eventPhase: EventPhaseValue = 2;
    public $currentTarget: object | null = null;
    public $target: object | null = null;
    public $isDefaultPrevented: boolean = false;
    public $isPropagationStopped: boolean = false;
    public $isPropagationImmediateStopped: boolean = false;
    public $type: string;
    public $bubbles: boolean;
    public $cancelable: boolean;
    // ����ʱ����ʡ�����ݣ��黹�����ʱ�����Ϊ null��
    public data: TData | null | undefined;

    public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: TData) {
        super();
        this.$type = type;
        this.$bubbles = !!bubbles;
        this.$cancelable = !!cancelable;
        this.data = data;
    }

    public get type(): string {
        return this.$type;
    }

    public get bubbles(): boolean {
        return this.$bubbles;
    }

    public get cancelable(): boolean {
        return this.$cancelable;
    }

    public get eventPhase(): EventPhaseValue {
        return this.$eventPhase;
    }

    public get currentTarget(): object | null {
        return this.$currentTarget;
    }

    public get target(): object | null {
        return this.$target;
    }

    public $setTarget(target: object | null): boolean {
        this.$target = target;
        return true;
    }

    public isDefaultPrevented(): boolean {
        return this.$isDefaultPrevented;
    }

    public preventDefault(): void {
        if (this.$cancelable) {
            this.$isDefaultPrevented = true;
        }
    }

    public stopPropagation(): void {
        if (this.$bubbles) {
            this.$isPropagationStopped = true;
        }
    }

    public stopImmediatePropagation(): void {
        if (this.$bubbles) {
            this.$isPropagationImmediateStopped = true;
        }
    }

    public clean(): void {
        this.$currentTarget = null;
        this.data = null;
        this.$setTarget(null);
    }

    public static dispatchEvent<TData = unknown>(target: IEventDispatcher, type: string, bubbles: boolean = false, data?: TData): boolean {
        const event: Event = Event.create(Event, type, bubbles);
        const props: EventPropertyData = Event._getPropertyData(Event);
        if (data != undefined) {
            props.data = data;
        }
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }

    public static _getPropertyData<TEvent extends Event>(EventClass: EventConstructor<TEvent>): EventPropertyData {
        const constructor: PooledEventConstructor<TEvent> = EventClass as PooledEventConstructor<TEvent>;
        let props: EventPropertyData | undefined = constructor._props;
        if (!props) {
            props = constructor._props = {};
        }
        return props;
    }

    public static create<TEvent extends Event>(EventClass: EventConstructor<TEvent>, type: string, bubbles?: boolean, cancelable?: boolean): TEvent {
        const constructor: PooledEventConstructor<TEvent> = EventClass as PooledEventConstructor<TEvent>;
        let eventPool: TEvent[] | undefined;
        const hasEventPool: boolean = constructor.hasOwnProperty("eventPool");
        if (hasEventPool) {
            eventPool = constructor.eventPool;
        }
        if (!eventPool) {
            eventPool = constructor.eventPool = [];
        }
        if (eventPool.length) {
            const event: TEvent = eventPool.pop()!;
            event.$type = type;
            event.$bubbles = !!bubbles;
            event.$cancelable = !!cancelable;
            event.$isDefaultPrevented = false;
            event.$isPropagationStopped = false;
            event.$isPropagationImmediateStopped = false;
            event.$eventPhase = 2;
            return event;
        }
        return new EventClass(type, bubbles, cancelable);
    }

    public static release<TEvent extends Event>(event: TEvent): void {
        event.clean();
        const prototype: { constructor: PooledEventConstructor<TEvent> } = Object.getPrototypeOf(event) as { constructor: PooledEventConstructor<TEvent> };
        const EventClass: PooledEventConstructor<TEvent> = prototype.constructor;
        // ��ԭʵ��һ�£�ֻ����ͨ�� Event.create �����˶���ص�ʵ����
        EventClass.eventPool!.push(event);
    }
}
__reflect(Event.prototype, "egret.Event");

export class Point extends HashObject {
    public static readonly $TempPoint: Point = new Point();
    private static readonly pointPool: Point[] = [];
    private static readonly DEG_TO_RAD: number = Math.PI / 180;

    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    public static release(point: Point | null | undefined): void {
        if (!point) {
            return;
        }
        Point.pointPool.push(point);
    }

    public static create(x: number, y: number): Point {
        let point: Point | undefined = Point.pointPool.pop();
        if (!point) {
            point = new Point();
        }
        return point.setTo(x, y);
    }

    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public setTo(x: number, y: number): Point {
        this.x = x;
        this.y = y;
        return this;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public equals(toCompare: Point): boolean {
        return this.x == toCompare.x && this.y == toCompare.y;
    }

    public static distance(p1: Point, p2: Point): number {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }

    public copyFrom(sourcePoint: Point): void {
        this.x = sourcePoint.x;
        this.y = sourcePoint.y;
    }

    public add(v: Point): Point {
        return new Point(this.x + v.x, this.y + v.y);
    }

    public static interpolate(pt1: Point, pt2: Point, f: number): Point {
        const f1: number = 1 - f;
        return new Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
    }

    public normalize(thickness: number): void {
        if (this.x != 0 || this.y != 0) {
            const relativeThickness: number = thickness / this.length;
            this.x *= relativeThickness;
            this.y *= relativeThickness;
        }
    }

    public offset(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    public static polar(len: number, angle: number): Point {
        return new Point(len * NumberUtils.cos(angle / Point.DEG_TO_RAD), len * NumberUtils.sin(angle / Point.DEG_TO_RAD));
    }

    public subtract(v: Point): Point {
        return new Point(this.x - v.x, this.y - v.y);
    }

    public toString(): string {
        return "(x=" + this.x + ", y=" + this.y + ")";
    }
}
__reflect(Point.prototype, "egret.Point");

export class DisplayObjectContainer extends DisplayObject {
    public static $EVENT_ADD_TO_STAGE_LIST: DisplayObject[] = [];
    public static $EVENT_REMOVE_FROM_STAGE_LIST: DisplayObject[] = [];
    public $touchChildren: boolean = true;
    public override $children: DisplayObject[] = [];

    public constructor() {
        super();
    }

    public get numChildren(): number {
        return this.$children.length;
    }

    public setChildrenSortMode(_value: string): void {
    }

    public addChild(child: DisplayObject): DisplayObject {
        let index: number = this.$children.length;
        if (child.$parent == this) {
            index--;
        }
        return this.$doAddChild(child, index);
    }

    public addChildAt(child: DisplayObject, index: number): DisplayObject {
        index = +index | 0;
        if (index < 0 || index >= this.$children.length) {
            index = this.$children.length;
            if (child.$parent == this) {
                index--;
            }
        }
        return this.$doAddChild(child, index);
    }

    public $doAddChild(child: DisplayObject, index: number, notifyListeners: boolean = true): DisplayObject {
        const self: this = this;
        if (child == self) {
            $error(1005);
        } else if (child instanceof DisplayObjectContainer && child.contains(self)) {
            $error(1004);
        }
        const host: DisplayObjectContainer | null = child.$parent;
        if (host == self) {
            self.doSetChildIndex(child, index);
            return child;
        }
        if (host) {
            host.removeChild(child);
        }
        self.$children.splice(index, 0, child);
        child.$setParent(self);
        const stage: Stage | null = self.$stage;
        if (stage) {
            child.$onAddToStage(stage, self.$nestLevel + 1);
        }
        if (notifyListeners) {
            child.dispatchEventWith(Event.ADDED, true);
        }
        if (stage) {
            const list: DisplayObject[] = DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST;
            while (list.length) {
                const childAddToStage: DisplayObject = list.shift()!;
                if (childAddToStage.$stage && notifyListeners) {
                    childAddToStage.dispatchEventWith(Event.ADDED_TO_STAGE);
                }
            }
        }
        if (child.$maskedObject) {
            child.$maskedObject.$updateRenderMode();
        }
        if (!self.$cacheDirty) {
            self.$cacheDirty = true;
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
        this.$childAdded(child, index);
        return child;
    }

    public contains(child: DisplayObject | null): boolean {
        while (child) {
            if (child == this) {
                return true;
            }
            child = child.$parent;
        }
        return false;
    }

    public getChildAt(index: number): DisplayObject | null {
        index = +index | 0;
        if (index >= 0 && index < this.$children.length) {
            return this.$children[index]!;
        } else {
            $error(1007);
            return null;
        }
    }

    public getChildIndex(child: DisplayObject): number {
        return this.$children.indexOf(child);
    }

    public getChildByName(name: string): DisplayObject | null {
        const children: DisplayObject[] = this.$children;
        const length: number = children.length;
        let displayObject: DisplayObject;
        for (let i: number = 0; i < length; i++) {
            displayObject = children[i]!;
            if (displayObject.name == name) {
                return displayObject;
            }
        }
        return null;
    }

    public removeChild(child: DisplayObject): DisplayObject | null {
        const index: number = this.$children.indexOf(child);
        if (index >= 0) {
            return this.$doRemoveChild(index);
        } else {
            $error(1006);
            return null;
        }
    }

    public removeChildAt(index: number): DisplayObject | null {
        index = +index | 0;
        if (index >= 0 && index < this.$children.length) {
            return this.$doRemoveChild(index);
        } else {
            $error(1007);
            return null;
        }
    }

    public $doRemoveChild(index: number, notifyListeners: boolean = true): DisplayObject {
        index = +index | 0;
        const self: this = this;
        const children: DisplayObject[] = this.$children;
        // �ڲ���������ԭʵ�ֵ�Լ����index �����Ӧһ���������
        const child: DisplayObject = children[index]!;
        this.$childRemoved(child, index);
        if (notifyListeners) {
            child.dispatchEventWith(Event.REMOVED, true);
        }
        if (this.$stage) {
            child.$onRemoveFromStage();
            const list: DisplayObject[] = DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST;
            while (list.length > 0) {
                const childAddToStage: DisplayObject = list.shift()!;
                if (notifyListeners && childAddToStage.$hasAddToStage) {
                    childAddToStage.$hasAddToStage = false;
                    childAddToStage.dispatchEventWith(Event.REMOVED_FROM_STAGE);
                }
                childAddToStage.$hasAddToStage = false;
                childAddToStage.$stage = null;
            }
        }
        child.$setParent(null);
        const indexNow: number = children.indexOf(child);
        if (indexNow != -1) {
            children.splice(indexNow, 1);
        }
        {
            if (child.$maskedObject) {
                child.$maskedObject.$updateRenderMode();
            }
            if (!self.$cacheDirty) {
                self.$cacheDirty = true;
                const p: DisplayObjectContainer | null = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                const maskedObject: DisplayObject | null = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }
        return child;
    }

    public setChildIndex(child: DisplayObject, index: number): void {
        index = +index | 0;
        if (index < 0 || index >= this.$children.length) {
            index = this.$children.length - 1;
        }
        this.doSetChildIndex(child, index);
    }

    public doSetChildIndex(child: DisplayObject, index: number): void {
        const self: this = this;
        const lastIndex: number = this.$children.indexOf(child);
        if (lastIndex < 0) {
            $error(1006);
        }
        if (lastIndex == index) {
            return;
        }
        this.$childRemoved(child, lastIndex);
        this.$children.splice(lastIndex, 1);
        this.$children.splice(index, 0, child);
        this.$childAdded(child, index);
        {
            if (!self.$cacheDirty) {
                self.$cacheDirty = true;
                const p: DisplayObjectContainer | null = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                const maskedObject: DisplayObject | null = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }
    }

    public swapChildrenAt(index1: number, index2: number): void {
        index1 = +index1 | 0;
        index2 = +index2 | 0;
        if (index1 >= 0 && index1 < this.$children.length && index2 >= 0 && index2 < this.$children.length) {
            this.doSwapChildrenAt(index1, index2);
        } else {
            $error(1007);
        }
    }

    public swapChildren(child1: DisplayObject, child2: DisplayObject): void {
        const index1: number = this.$children.indexOf(child1);
        const index2: number = this.$children.indexOf(child2);
        if (index1 == -1 || index2 == -1) {
            $error(1006);
        } else {
            this.doSwapChildrenAt(index1, index2);
        }
    }

    public doSwapChildrenAt(index1: number, index2: number): void {
        const self: this = this;
        if (index1 > index2) {
            const temp: number = index2;
            index2 = index1;
            index1 = temp;
        } else if (index1 == index2) {
            return;
        }
        const list: DisplayObject[] = this.$children;
        const child1: DisplayObject = list[index1]!;
        const child2: DisplayObject = list[index2]!;
        this.$childRemoved(child1, index1);
        this.$childRemoved(child2, index2);
        list[index1] = child2;
        list[index2] = child1;
        this.$childAdded(child2, index1);
        this.$childAdded(child1, index2);
        {
            if (!self.$cacheDirty) {
                self.$cacheDirty = true;
                const p: DisplayObjectContainer | null = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                const maskedObject: DisplayObject | null = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }
    }

    public removeChildren(): void {
        const children: DisplayObject[] = this.$children;
        for (let i: number = children.length - 1; i >= 0; i--) {
            this.$doRemoveChild(i);
        }
    }

    public $childAdded(_child: DisplayObject, _index: number): void {
    }

    public $childRemoved(_child: DisplayObject, _index: number): void {
    }

    public override $onAddToStage(stage: Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);
        const children: DisplayObject[] = this.$children;
        const length: number = children.length;
        nestLevel++;
        for (let i: number = 0; i < length; i++) {
            const child: DisplayObject = this.$children[i]!;
            child.$onAddToStage(stage, nestLevel);
            if (child.$maskedObject) {
                child.$maskedObject.$updateRenderMode();
            }
        }
    }

    public override $onRemoveFromStage(): void {
        super.$onRemoveFromStage();
        const children: DisplayObject[] = this.$children;
        const length: number = children.length;
        for (let i: number = 0; i < length; i++) {
            const child: DisplayObject = children[i]!;
            child.$onRemoveFromStage();
        }
    }

    public override $measureChildBounds(bounds: Rectangle): void {
        const children: DisplayObject[] = this.$children;
        const length: number = children.length;
        if (length == 0) {
            return;
        }
        let xMin: number = 0;
        let xMax: number = 0;
        let yMin: number = 0;
        let yMax: number = 0;
        let found: boolean = false;
        for (let i: number = -1; i < length; i++) {
            let childBounds: Rectangle;
            if (i == -1) {
                childBounds = bounds;
            } else {
                children[i]!.getBounds(Rectangle.$TempRectangle);
                children[i]!.$getMatrix().$transformBounds(Rectangle.$TempRectangle);
                childBounds = Rectangle.$TempRectangle;
            }
            if (childBounds.isEmpty()) {
                continue;
            }
            if (found) {
                xMin = Math.min(xMin, childBounds.x);
                xMax = Math.max(xMax, childBounds.x + childBounds.width);
                yMin = Math.min(yMin, childBounds.y);
                yMax = Math.max(yMax, childBounds.y + childBounds.height);
            } else {
                found = true;
                xMin = childBounds.x;
                xMax = xMin + childBounds.width;
                yMin = childBounds.y;
                yMax = yMin + childBounds.height;
            }
        }
        bounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
    }

    public get touchChildren(): boolean {
        return this.$getTouchChildren();
    }

    public set touchChildren(value: boolean) {
        this.$setTouchChildren(!!value);
    }

    public $getTouchChildren(): boolean {
        return this.$touchChildren;
    }

    public $setTouchChildren(value: boolean): boolean {
        if (this.$touchChildren == value) {
            return false;
        }
        this.$touchChildren = value;
        return true;
    }

    public override $hitTest(stageX: number, stageY: number): DisplayObject | null {
        if (!this.$visible) {
            return null;
        }
        const m: Matrix = this.$getInvertedConcatenatedMatrix();
        const localX: number = m.a * stageX + m.c * stageY + m.tx;
        const localY: number = m.b * stageX + m.d * stageY + m.ty;
        const rect: Rectangle | null = this.$scrollRect ? this.$scrollRect : this.$maskRect;
        if (rect && !rect.contains(localX, localY)) {
            return null;
        }
        if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
            return null;
        }
        const children: DisplayObject[] = this.$children;
        let found: boolean = false;
        let target: DisplayObject | null = null;
        for (let i: number = children.length - 1; i >= 0; i--) {
            const child: DisplayObject = children[i]!;
            if (child.$maskedObject) {
                continue;
            }
            target = child.$hitTest(stageX, stageY);
            if (target) {
                found = true;
                if (target.$touchEnabled) {
                    break;
                } else {
                    target = null;
                }
            }
        }
        if (target) {
            if (this.$touchChildren) {
                return target;
            }
            return this;
        }
        if (found) {
            return this;
        }
        return super.$hitTest(stageX, stageY);
    }

    public _sortChildrenFunc(a: DisplayObject, b: DisplayObject): number {
        if (a.zIndex === b.zIndex) {
            return a.$lastSortedIndex - b.$lastSortedIndex;
        }
        return a.zIndex - b.zIndex;
    }

    public override sortChildren(): void {
        super.sortChildren();
        this.$sortDirty = false;
        let sortRequired: boolean = false;
        const children: DisplayObject[] = this.$children;
        let child: DisplayObject | null = null;
        const length: number = children.length;
        for (let i: number = 0; i < length; ++i) {
            child = children[i]!;
            child.$lastSortedIndex = i;
            if (!sortRequired && child.zIndex !== 0) {
                sortRequired = true;
            }
        }
        if (sortRequired && children.length > 1) {
            children.sort(this._sortChildrenFunc);
        }
    }
}
__reflect(DisplayObjectContainer.prototype, "egret.DisplayObjectContainer");

export class SpriteSheet extends HashObject {
    public _bitmapX: number = 0;
    public _bitmapY: number = 0;
    public _textureMap: Record<string, Texture | undefined> = createMap<Texture>();
    public $texture: Texture;

    public constructor(texture: Texture) {
        super();
        this.$texture = texture;
        this._bitmapX = texture.$bitmapX - texture.$offsetX;
        this._bitmapY = texture.$bitmapY - texture.$offsetY;
    }

    public getTexture(name: string): Texture | null | undefined {
        return this._textureMap[name];
    }

    public createTexture(
        name: string,
        bitmapX: number,
        bitmapY: number,
        bitmapWidth: number,
        bitmapHeight: number,
        offsetX: number = 0,
        offsetY: number = 0,
        textureWidth: number = offsetX + bitmapWidth,
        textureHeight: number = offsetY + bitmapHeight
    ): Texture {
        const texture: Texture = new Texture();
        texture.disposeBitmapData = false;
        texture.$bitmapData = this.$texture.$bitmapData;
        texture.$initData(this._bitmapX + bitmapX, this._bitmapY + bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, this.$texture.$sourceWidth, this.$texture.$sourceHeight);
        this._textureMap[name] = texture;
        return texture;
    }

    public dispose(): void {
        if (this.$texture) {
            this.$texture.dispose();
        }
    }
}
__reflect(SpriteSheet.prototype, "egret.SpriteSheet");

export class Bitmap extends DisplayObject {
    public static defaultSmoothing: boolean = true;
    public $texture: Texture | null | undefined = null;
    public $bitmapData: BitmapData | null = null;
    public $bitmapX: number = 0;
    public $bitmapY: number = 0;
    public $bitmapWidth: number = 0;
    public $bitmapHeight: number = 0;
    public $offsetX: number = 0;
    public $offsetY: number = 0;
    public $textureWidth: number = 0;
    public $textureHeight: number = 0;
    public $sourceWidth: number = 0;
    public $sourceHeight: number = 0;
    public $smoothing: boolean = Bitmap.defaultSmoothing;
    public $explicitBitmapWidth: number = NaN;
    public $explicitBitmapHeight: number = NaN;
    public $scale9Grid: Rectangle | null = null;
    public $fillMode: string = "scale";
    public _pixelHitTest: boolean = false;
    public declare $renderNode: sys.NormalBitmapNode | sys.BitmapNode | sys.MeshNode;

    public constructor(value?: Texture | null) {
        super();
        this.$renderNode = new runtime.sys.NormalBitmapNode();
        this.$setTexture(value);
        if (value) {
            this.$renderNode.rotated = value.$rotated;
        }
    }

    public override $onAddToStage(stage: Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);
        const texture: Texture | null | undefined = this.$texture;
        if (texture && texture.$bitmapData) {
            BitmapData.$addDisplayObject(this, texture.$bitmapData);
        }
    }

    public override $onRemoveFromStage(): void {
        super.$onRemoveFromStage();
        const texture: Texture | null | undefined = this.$texture;
        if (texture) {
            BitmapData.$removeDisplayObject(this, texture.$bitmapData);
        }
    }

    public get texture(): Texture | null | undefined {
        return this.$texture;
    }

    public set texture(value: Texture | null | undefined) {
        const self: this = this;
        self.$setTexture(value);
        if (value && self.$renderNode) {
            self.$renderNode.rotated = value.$rotated;
        }
    }

    public $setTexture(value?: Texture | null): boolean {
        const self: this = this;
        const oldTexture: Texture | null | undefined = self.$texture;
        if (value == oldTexture) {
            return false;
        }
        self.$texture = value;
        if (value) {
            self.$refreshImageData();
        } else {
            if (oldTexture) {
                BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
            }
            self.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            self.$renderDirty = true;
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
            return true;
        }
        if (self.$stage) {
            if (oldTexture && oldTexture.$bitmapData) {
                const oldHashCode: number = oldTexture.$bitmapData.hashCode;
                const newHashCode: number = value.$bitmapData ? value.$bitmapData.hashCode : -1;
                if (oldHashCode == newHashCode) {
                    self.$renderDirty = true;
                    const p: DisplayObjectContainer | null = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    const maskedObject: DisplayObject | null = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                    return true;
                }
                BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
            }
            BitmapData.$addDisplayObject(self, value.$bitmapData);
        }
        self.$renderDirty = true;
        const p: DisplayObjectContainer | null = self.$parent;
        if (p && !p.$cacheDirty) {
            p.$cacheDirty = true;
            p.$cacheDirtyUp();
        }
        const maskedObject: DisplayObject | null = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
            maskedObject.$cacheDirty = true;
            maskedObject.$cacheDirtyUp();
        }
        return true;
    }

    public $setBitmapData(value?: Texture | null): void {
        this.$setTexture(value);
    }

    public $refreshImageData(): void {
        const texture: Texture | null | undefined = this.$texture;
        if (texture) {
            this.setImageData(texture.$bitmapData, texture.$bitmapX, texture.$bitmapY, texture.$bitmapWidth, texture.$bitmapHeight, texture.$offsetX, texture.$offsetY, texture.$getTextureWidth(), texture.$getTextureHeight(), texture.$sourceWidth, texture.$sourceHeight);
        }
    }

    public setImageData(
        bitmapData: BitmapData | null,
        bitmapX: number,
        bitmapY: number,
        bitmapWidth: number,
        bitmapHeight: number,
        offsetX: number,
        offsetY: number,
        textureWidth: number,
        textureHeight: number,
        sourceWidth: number,
        sourceHeight: number
    ): void {
        this.$bitmapData = bitmapData;
        this.$bitmapX = bitmapX;
        this.$bitmapY = bitmapY;
        this.$bitmapWidth = bitmapWidth;
        this.$bitmapHeight = bitmapHeight;
        this.$offsetX = offsetX;
        this.$offsetY = offsetY;
        this.$textureWidth = textureWidth;
        this.$textureHeight = textureHeight;
        this.$sourceWidth = sourceWidth;
        this.$sourceHeight = sourceHeight;
    }

    public get scale9Grid(): Rectangle | null {
        return this.$scale9Grid;
    }

    public set scale9Grid(value: Rectangle | null) {
        this.$setScale9Grid(value);
    }

    public $setScale9Grid(value: Rectangle | null): void {
        const self: this = this;
        self.$scale9Grid = value;
        self.$renderDirty = true;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public get fillMode(): string {
        return this.$fillMode;
    }

    public set fillMode(value: string) {
        this.$setFillMode(value);
    }

    public $setFillMode(value: string): boolean {
        const self: this = this;
        if (value == self.$fillMode) {
            return false;
        }
        self.$fillMode = value;
        {
            self.$renderDirty = true;
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
        return true;
    }

    public get smoothing(): boolean {
        return this.$smoothing;
    }

    public set smoothing(value: boolean) {
        const self: this = this;
        if (value == this.$smoothing) {
            return;
        }
        this.$smoothing = value;
        this.$renderNode.smoothing = value;
        const p: DisplayObjectContainer | null = self.$parent;
        if (p && !p.$cacheDirty) {
            p.$cacheDirty = true;
            p.$cacheDirtyUp();
        }
        const maskedObject: DisplayObject | null = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
            maskedObject.$cacheDirty = true;
            maskedObject.$cacheDirtyUp();
        }
    }

    public override $setWidth(value: number): boolean {
        const self: this = this;
        if (value < 0 || value == self.$explicitBitmapWidth) {
            return false;
        }
        self.$explicitBitmapWidth = value;
        self.$renderDirty = true;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
        return true;
    }

    public override $setHeight(value: number): boolean {
        const self: this = this;
        if (value < 0 || value == self.$explicitBitmapHeight) {
            return false;
        }
        self.$explicitBitmapHeight = value;
        self.$renderDirty = true;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
        return true;
    }

    public override $getWidth(): number {
        return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
    }

    public override $getHeight(): number {
        return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
    }

    public override $measureContentBounds(bounds: Rectangle): void {
        if (this.$bitmapData) {
            const w: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
            const h: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
            bounds.setTo(0, 0, w, h);
        } else {
            const w: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : 0;
            const h: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : 0;
            bounds.setTo(0, 0, w, h);
        }
    }

    public override $updateRenderNode(): void {
        if (this.$texture) {
            const destW: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
            const destH: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
            const scale9Grid: Rectangle | null | undefined = this.scale9Grid || this.$texture.scale9Grid;
            if (scale9Grid) {
                if (this.$renderNode instanceof runtime.sys.NormalBitmapNode) {
                    this.$renderNode = new runtime.sys.BitmapNode();
                }
                runtime.sys.BitmapNode.$updateTextureDataWithScale9Grid(this.$renderNode as sys.BitmapNode, this.$bitmapData, scale9Grid, this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight, this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight, destW, destH, this.$sourceWidth, this.$sourceHeight, this.$smoothing);
            } else {
                if (this.fillMode == BitmapFillMode.REPEAT && this.$renderNode instanceof runtime.sys.NormalBitmapNode) {
                    this.$renderNode = new runtime.sys.BitmapNode();
                }
                runtime.sys.BitmapNode.$updateTextureData(this.$renderNode as sys.NormalBitmapNode | sys.BitmapNode, this.$bitmapData, this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight, this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight, destW, destH, this.$sourceWidth, this.$sourceHeight, this.$fillMode, this.$smoothing);
            }
        }
    }

    public get pixelHitTest(): boolean {
        return this._pixelHitTest;
    }

    public set pixelHitTest(value: boolean) {
        this._pixelHitTest = !!value;
    }

    public override $hitTest(stageX: number, stageY: number): DisplayObject | null {
        let target: DisplayObject | null = super.$hitTest(stageX, stageY);
        if (target && this._pixelHitTest) {
            const boo: boolean = this.hitTestPoint(stageX, stageY, true);
            if (!boo) {
                target = null;
            }
        }
        return target;
    }
}
__reflect(Bitmap.prototype, "egret.Bitmap");

export class GlowFilter extends Filter {
    public declare $color: number;
    public declare $blue: number;
    public declare $green: number;
    public declare $red: number;
    public declare $alpha: number;
    public declare $blurX: number;
    public declare $blurY: number;
    public declare $strength: number;
    public declare $quality: number;
    public declare $inner: boolean;
    public declare $knockout: boolean;
    // Filter ���캯������ uniform �����������캯���������³�Ա��
    public declare $uniforms: GlowFilterUniforms;

    public constructor(
        color: number = 0xFF0000,
        alpha: number = 1.0,
        blurX: number = 6.0,
        blurY: number = 6.0,
        strength: number = 2,
        quality: number = 1,
        inner: boolean = false,
        knockout: boolean = false
    ) {
        super();
        const self: this = this;
        self.type = "glow";
        self.$color = color;
        self.$blue = color & 0x0000FF;
        self.$green = (color & 0x00ff00) >> 8;
        self.$red = color >> 16;
        self.$alpha = alpha;
        self.$blurX = blurX;
        self.$blurY = blurY;
        self.$strength = strength;
        self.$quality = quality;
        self.$inner = inner;
        self.$knockout = knockout;
        self.$uniforms.color = { x: this.$red / 255, y: this.$green / 255, z: this.$blue / 255, w: 1 };
        self.$uniforms.alpha = alpha;
        self.$uniforms.blurX = blurX;
        self.$uniforms.blurY = blurY;
        self.$uniforms.strength = strength;
        self.$uniforms.inner = inner ? 1 : 0;
        self.$uniforms.knockout = knockout ? 0 : 1;
        self.$uniforms.dist = 0;
        self.$uniforms.angle = 0;
        self.$uniforms.hideObject = 0;
        self.onPropertyChange();
    }

    public get color(): number {
        return this.$color;
    }

    public set color(value: number) {
        if (this.$color == value) {
            return;
        }
        this.$color = value;
        this.$blue = value & 0x0000FF;
        this.$green = (value & 0x00ff00) >> 8;
        this.$red = value >> 16;
        this.$uniforms.color.x = this.$red / 255;
        this.$uniforms.color.y = this.$green / 255;
        this.$uniforms.color.z = this.$blue / 255;
    }

    public get alpha(): number {
        return this.$alpha;
    }

    public set alpha(value: number) {
        if (this.$alpha == value) {
            return;
        }
        this.$alpha = value;
        this.$uniforms.alpha = value;
    }

    public get blurX(): number {
        return this.$blurX;
    }

    public set blurX(value: number) {
        const self: this = this;
        if (self.$blurX == value) {
            return;
        }
        self.$blurX = value;
        self.$uniforms.blurX = value;
        self.onPropertyChange();
    }

    public get blurY(): number {
        return this.$blurY;
    }

    public set blurY(value: number) {
        const self: this = this;
        if (self.$blurY == value) {
            return;
        }
        self.$blurY = value;
        self.$uniforms.blurY = value;
        self.onPropertyChange();
    }

    public get strength(): number {
        return this.$strength;
    }

    public set strength(value: number) {
        if (this.$strength == value) {
            return;
        }
        this.$strength = value;
        this.$uniforms.strength = value;
    }

    public get quality(): number {
        return this.$quality;
    }

    public set quality(value: number) {
        if (this.$quality == value) {
            return;
        }
        this.$quality = value;
    }

    public get inner(): boolean {
        return this.$inner;
    }

    public set inner(value: boolean) {
        if (this.$inner == value) {
            return;
        }
        this.$inner = value;
        this.$uniforms.inner = value ? 1 : 0;
    }

    public get knockout(): boolean {
        return this.$knockout;
    }

    public set knockout(value: boolean) {
        if (this.$knockout == value) {
            return;
        }
        this.$knockout = value;
        this.$uniforms.knockout = value ? 0 : 1;
    }

    public override $toJson(): string {
        return '{"color": ' + this.$color + ', "red": ' + this.$red + ', "green": ' + this.$green + ', "blue": ' + this.$blue + ', "alpha": ' + this.$alpha + ', "blurX": ' + this.$blurX + ', "blurY": ' + this.blurY + ', "strength": ' + this.$strength + ', "quality": ' + this.$quality + ', "inner": ' + this.$inner + ', "knockout": ' + this.$knockout + '}';
    }

    public override updatePadding(): void {
        const self: this = this;
        self.paddingLeft = self.blurX;
        self.paddingRight = self.blurX;
        self.paddingTop = self.blurY;
        self.paddingBottom = self.blurY;
    }
}
__reflect(GlowFilter.prototype, "egret.GlowFilter");

export class Stage extends DisplayObjectContainer {
    public $stageWidth: number = 0;
    public $stageHeight: number = 0;
    public $scaleMode: string = StageScaleMode.SHOW_ALL;
    public $orientation: string = OrientationMode.AUTO;
    public $maxTouches: number = 99;
    // ����������ע�� screen��ʹ��������÷���ǰ����ɳ�ʼ����
    public declare $screen: StageScreen;

    public constructor() {
        super();
        this.$stage = this;
        this.$nestLevel = 1;
    }

    public get frameRate(): number {
        return getTicker().$frameRate;
    }

    public set frameRate(value: number) {
        getTicker().$setFrameRate(value);
    }

    public get stageWidth(): number {
        return this.$stageWidth;
    }

    public get stageHeight(): number {
        return this.$stageHeight;
    }

    public invalidate(): void {
        runtime.sys.RenderHelper.$invalidateRenderFlag = true;
    }

    public registerImplementation<TImplementation>(interfaceName: string, instance: TImplementation): void {
        registerImplementation(interfaceName, instance);
    }

    public getImplementation<TImplementation = unknown>(interfaceName: string): TImplementation | undefined {
        return getImplementation<TImplementation>(interfaceName);
    }

    public get scaleMode(): string {
        return this.$scaleMode;
    }

    public set scaleMode(value: string) {
        if (this.$scaleMode == value) {
            return;
        }
        this.$scaleMode = value;
        this.$screen.updateScreenSize();
    }

    public get orientation(): string {
        return this.$orientation;
    }

    public set orientation(value: string) {
        if (this.$orientation == value) {
            return;
        }
        this.$orientation = value;
        this.$screen.updateScreenSize();
    }

    public get textureScaleFactor(): number {
        return Texture.$TextureScaleFactor;
    }

    public set textureScaleFactor(value: number) {
        Texture.$TextureScaleFactor = value;
    }

    public get maxTouches(): number {
        return this.$maxTouches;
    }

    public set maxTouches(value: number) {
        if (this.$maxTouches == value) {
            return;
        }
        this.$maxTouches = value;
        this.$screen.updateMaxTouches();
    }

    public setContentSize(width: number, height: number): void {
        this.$screen.setContentSize(width, height);
    }
}
__reflect(Stage.prototype, "egret.Stage");
$markCannotUse(Stage, "alpha", 1);
$markCannotUse(Stage, "visible", true);
$markCannotUse(Stage, "x", 0);
$markCannotUse(Stage, "y", 0);
$markCannotUse(Stage, "scaleX", 1);
$markCannotUse(Stage, "scaleY", 1);
$markCannotUse(Stage, "rotation", 0);
$markCannotUse(Stage, "cacheAsBitmap", false);
$markCannotUse(Stage, "scrollRect", null);
$markCannotUse(Stage, "filters", null);
$markCannotUse(Stage, "blendMode", null);
$markCannotUse(Stage, "touchEnabled", true);
$markCannotUse(Stage, "matrix", null);

export class BlendMode {
    public static NORMAL: BlendModeValue = "normal";
    public static ADD: BlendModeValue = "add";
    public static ERASE: BlendModeValue = "erase";

    public constructor() {
    }
}
__reflect(BlendMode.prototype, "egret.BlendMode");

export class WebGLUtils {
    public static canUseWebGL: boolean | undefined;

    public constructor() {
    }

    public static compileProgram(gl: WebGLContext, vertexSrc: string, fragmentSrc: string): WebGLProgram | null {
        const fragmentShader: WebGLShader | null = WebGLUtils.compileFragmentShader(gl, fragmentSrc);
        const vertexShader: WebGLShader | null = WebGLUtils.compileVertexShader(gl, vertexSrc);
        const shaderProgram: WebGLProgram | null = gl.createProgram();
        // ����ԭʵ�֣�����������ʧ��ʱ�Խ�������� WebGL API��������ı��������
        gl.attachShader(shaderProgram!, vertexShader!);
        gl.attachShader(shaderProgram!, fragmentShader!);
        gl.linkProgram(shaderProgram!);
        if (!gl.getProgramParameter(shaderProgram!, gl.LINK_STATUS)) {
            $warn(1020);
        }
        return shaderProgram;
    }

    public static compileFragmentShader(gl: WebGLContext, shaderSrc: string): WebGLShader | null {
        return WebGLUtils._compileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
    }

    public static compileVertexShader(gl: WebGLContext, shaderSrc: string): WebGLShader | null {
        return WebGLUtils._compileShader(gl, shaderSrc, gl.VERTEX_SHADER);
    }

    public static _compileShader(gl: WebGLContext, shaderSrc: string, shaderType: number): WebGLShader | null {
        const shader: WebGLShader | null = gl.createShader(shaderType);
        gl.shaderSource(shader!, shaderSrc);
        gl.compileShader(shader!);
        if (!gl.getShaderParameter(shader!, gl.COMPILE_STATUS)) {
            return null;
        }
        return shader;
    }

    public static checkCanUseWebGL(): boolean {
        if (WebGLUtils.canUseWebGL == undefined) {
            try {
                const canvas: HTMLCanvasElement = document.createElement("canvas");
                WebGLUtils.canUseWebGL = !!window.WebGLRenderingContext
                    && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
            } catch (e: unknown) {
                WebGLUtils.canUseWebGL = false;
            }
        }
        return WebGLUtils.canUseWebGL;
    }

    public static deleteWebGLTexture(webglTexture: EngineWebGLTexture | null | undefined): void {
        if (!webglTexture) {
            return;
        }
        if (webglTexture[DefinitionHelper.engine_default_empty_texture]) {
            console.warn('deleteWebGLTexture:' + DefinitionHelper.engine_default_empty_texture);
            return;
        }
        const gl: WebGLContext | null | undefined = webglTexture[DefinitionHelper.glContext];
        if (gl) {
            gl.deleteTexture(webglTexture);
        } else {
            console.error('deleteWebGLTexture gl = ' + gl);
        }
    }

    public static premultiplyTint(tint: number, alpha: number): number {
        if (alpha === 1.0) {
            return (alpha * 255 << 24) + tint;
        }
        if (alpha === 0.0) {
            return 0;
        }
        let R: number = (tint >> 16) & 0xFF;
        let G: number = (tint >> 8) & 0xFF;
        let B: number = tint & 0xFF;
        R = ((R * alpha) + 0.5) | 0;
        G = ((G * alpha) + 0.5) | 0;
        B = ((B * alpha) + 0.5) | 0;
        return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
    }
}
__reflect(WebGLUtils.prototype, "egret.WebGLUtils");

export class FocusEvent extends Event {
    public static override FOCUS_IN: string = "focusIn";
    public static override FOCUS_OUT: string = "focusOut";

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }
}
__reflect(FocusEvent.prototype, "egret.FocusEvent");

export class GeolocationEvent<TData = unknown> extends Event<TData> {
    public static PERMISSION_DENIED: string = "permissionDenied";
    public static UNAVAILABLE: string = "unavailable";

    public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: TData) {
        super(type, bubbles, cancelable, data);
    }
}
__reflect(GeolocationEvent.prototype, "egret.GeolocationEvent");

export class HTTPStatusEvent extends Event {
    public static HTTP_STATUS: string = "httpStatus";
    public _status: number = 0;

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }

    public get status(): number {
        return this._status;
    }

    public static dispatchHTTPStatusEvent(target: IEventDispatcher, status: number): boolean {
        const event: HTTPStatusEvent = Event.create(HTTPStatusEvent, HTTPStatusEvent.HTTP_STATUS);
        event._status = status;
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(HTTPStatusEvent.prototype, "egret.HTTPStatusEvent");

export class IOErrorEvent extends Event {
    public static IO_ERROR: string = "ioError";

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }

    public static dispatchIOErrorEvent(target: IEventDispatcher): boolean {
        const event: IOErrorEvent = Event.create(IOErrorEvent, IOErrorEvent.IO_ERROR);
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(IOErrorEvent.prototype, "egret.IOErrorEvent");

export class MotionEvent<TData = unknown> extends Event<TData> {
    public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: TData) {
        super(type, bubbles, cancelable, data);
    }
}
__reflect(MotionEvent.prototype, "egret.MotionEvent");

export class OrientationEvent<TData = unknown> extends Event<TData> {
    public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: TData) {
        super(type, bubbles, cancelable, data);
    }
}
__reflect(OrientationEvent.prototype, "egret.OrientationEvent");

export class ProgressEvent extends Event {
    public static PROGRESS: string = "progress";
    public static SOCKET_DATA: string = "socketData";
    public bytesLoaded: number = 0;
    public bytesTotal: number = 0;

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, bytesLoaded: number = 0, bytesTotal: number = 0) {
        super(type, bubbles, cancelable);
        this.bytesLoaded = bytesLoaded;
        this.bytesTotal = bytesTotal;
    }

    public static dispatchProgressEvent(target: IEventDispatcher, type: string, bytesLoaded: number = 0, bytesTotal: number = 0): boolean {
        const event: ProgressEvent = Event.create(ProgressEvent, type);
        event.bytesLoaded = bytesLoaded;
        event.bytesTotal = bytesTotal;
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(ProgressEvent.prototype, "egret.ProgressEvent");

export class StageOrientationEvent extends Event {
    public static ORIENTATION_CHANGE: string = "orientationChange";

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }

    public static dispatchStageOrientationEvent(target: IEventDispatcher, type: string): boolean {
        const event: StageOrientationEvent = Event.create(StageOrientationEvent, type);
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(StageOrientationEvent.prototype, "egret.StageOrientationEvent");

export class TextEvent extends Event {
    public static LINK: string = "link";
    public text: string;

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, text: string = "") {
        super(type, bubbles, cancelable);
        this.text = text;
    }

    public static dispatchTextEvent(target: IEventDispatcher, type: string, text: string): boolean {
        const event: TextEvent = Event.create(TextEvent, type);
        event.text = text;
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(TextEvent.prototype, "egret.TextEvent");

export class TimerEvent extends Event {
    public static TIMER: string = "timer";
    public static TIMER_COMPLETE: string = "timerComplete";

    public constructor(type: string, bubbles?: boolean, cancelable?: boolean) {
        super(type, bubbles, cancelable);
    }

    public updateAfterEvent(): void {
        runtime.sys.RenderHelper.$requestRenderingFlag = true;
    }

    public static dispatchTimerEvent(target: IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean): boolean {
        const event: TimerEvent = Event.create(TimerEvent, type, bubbles, cancelable);
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(TimerEvent.prototype, "egret.TimerEvent");

export class CompressedTextureData {
    public constructor() {
    }
}
__reflect(CompressedTextureData.prototype, "egret.CompressedTextureData");

export class BitmapData extends HashObject {
    public static _displayList: Record<string, DisplayObject[] | undefined> = createMap<DisplayObject[]>();
    public format: string = "image";
    public $deleteSource: boolean = true;
    public compressedTextureData: CompressedTextureData[][] = [];
    public debugCompressedTextureURL: string = '';
    public etcAlphaMask: BitmapData | null = null;
    public declare $source: BitmapDataSource | null | undefined;
    public declare webGLTexture: EngineWebGLTexture | null | undefined;
    // �ߴ��� source ��ѹ��������������䣻�� source ʱ����δ��ʼ��״̬��
    public declare width: number;
    public declare height: number;
    // ���� nativeRender ģʽ�´�����ԭ����֧���øó�ʼ��Լ����

    public constructor(source?: BitmapDataSource | null) {
        super();
        this.source = source;
        this.source = source;
        if (this.source) {
            this.width = +source!.width!;
            this.height = +source!.height!;
        }
    }

    public get source(): BitmapDataSource | null | undefined {
        return this.$source;
    }

    public set source(value: BitmapDataSource | null | undefined) {
        this.$source = value;
    }

    public static create(type: "arraybuffer", data: ArrayBuffer, callback?: BitmapDataCallback): BitmapData;
    public static create(type: "base64", data: string, callback?: BitmapDataCallback): BitmapData;
    public static create(type: BitmapDataInputType, data: ArrayBuffer | string, callback?: BitmapDataCallback): BitmapData {
        let base64: string = "";
        if (type === "arraybuffer") {
            base64 = Base64Util.encode(data as ArrayBuffer);
        } else {
            base64 = data as string;
        }
        let imageType: string = "image/png";
        if (base64.charAt(0) === '/') {
            imageType = "image/jpeg";
        } else if (base64.charAt(0) === 'R') {
            imageType = "image/gif";
        } else if (base64.charAt(0) === 'i') {
            imageType = "image/png";
        }
        const img: HTMLImageElement = new Image();
        img.src = "data:" + imageType + ";base64," + base64;
        img.crossOrigin = '*';
        const bitmapData: BitmapData = new BitmapData(img);
        img.onload = function (): void {
            img.onload = null;
            bitmapData.source = img;
            bitmapData.height = img.height;
            bitmapData.width = img.width;
            if (callback) {
                callback(bitmapData);
            }
        };
        return bitmapData;
    }

    public $dispose(): void {
        if (Capabilities.renderMode == "webgl" && this.webGLTexture) {
            WebGLUtils.deleteWebGLTexture(this.webGLTexture);
            this.webGLTexture = null;
        }
        if (this.source && this.source.dispose) {
            this.source.dispose();
        }
        if (this.source && this.source.src) {
            this.source.src = "";
        }
        this.source = null;
        this.clearCompressedTextureData();
        this.debugCompressedTextureURL = '';
        this.etcAlphaMask = null;
        BitmapData.$dispose(this);
    }

    public static $addDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData | null | undefined): void {
        if (!bitmapData) {
            return;
        }
        const hashCode: number = bitmapData.hashCode;
        if (!hashCode) {
            return;
        }
        if (!BitmapData._displayList[hashCode]) {
            BitmapData._displayList[hashCode] = [displayObject];
            return;
        }
        const tempList: DisplayObject[] = BitmapData._displayList[hashCode]!;
        if (tempList.indexOf(displayObject) < 0) {
            tempList.push(displayObject);
        }
    }

    public static $removeDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData | null | undefined): void {
        if (!bitmapData) {
            return;
        }
        const hashCode: number = bitmapData.hashCode;
        if (!hashCode) {
            return;
        }
        if (!BitmapData._displayList[hashCode]) {
            return;
        }
        const tempList: DisplayObject[] = BitmapData._displayList[hashCode]!;
        const index: number = tempList.indexOf(displayObject);
        if (index >= 0) {
            tempList.splice(index, 1);
        }
    }

    public static $invalidate(bitmapData: BitmapData | null | undefined): void {
        if (!bitmapData) {
            return;
        }
        const hashCode: number = bitmapData.hashCode;
        if (!hashCode) {
            return;
        }
        if (!BitmapData._displayList[hashCode]) {
            return;
        }
        const tempList: DisplayObject[] = BitmapData._displayList[hashCode]!;
        for (let i: number = 0; i < tempList.length; i++) {
            const displayObject: DisplayObject = tempList[i]!;
            if (displayObject instanceof Bitmap) {
                displayObject.$refreshImageData();
            }
            const bitmap: DisplayObject = tempList[i]!;
            bitmap.$renderDirty = true;
            const p: DisplayObjectContainer | null = bitmap.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = bitmap.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
    }

    public static $dispose(bitmapData: BitmapData | null | undefined): void {
        if (!bitmapData) {
            return;
        }
        const hashCode: number = bitmapData.hashCode;
        if (!hashCode) {
            return;
        }
        if (!BitmapData._displayList[hashCode]) {
            return;
        }
        const tempList: DisplayObject[] = BitmapData._displayList[hashCode]!;
        for (let i: number = 0; i < tempList.length; i++) {
            const node: DisplayObject = tempList[i]!;
            if (node instanceof Bitmap) {
                node.$bitmapData = null;
            }
            node.$renderDirty = true;
            const p: DisplayObjectContainer | null = node.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            const maskedObject: DisplayObject | null = node.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        }
        delete BitmapData._displayList[hashCode];
    }

    public _getCompressedTextureData(level: number, face: number): CompressedTextureData | null | undefined {
        const levelData: CompressedTextureData[] | undefined = this.compressedTextureData[level];
        return levelData ? levelData[face] : null;
    }

    public getCompressed2dTextureData(): CompressedTextureData | null | undefined {
        return this._getCompressedTextureData(0, 0);
    }

    public hasCompressed2d(): boolean {
        return !!this.getCompressed2dTextureData();
    }

    public clearCompressedTextureData(): void {
        this.compressedTextureData.length = 0;
    }
}
__reflect(BitmapData.prototype, "egret.BitmapData");

export class TouchEvent extends Event {
    private static readonly localPoint: Point = new Point();

    public static TOUCH_MOVE: string = "touchMove";
    public static TOUCH_BEGIN: string = "touchBegin";
    public static TOUCH_END: string = "touchEnd";
    public static TOUCH_CANCEL: string = "touchCancel";
    public static TOUCH_TAP: string = "touchTap";
    public static TOUCH_RELEASE_OUTSIDE: string = "touchReleaseOutside";
    public targetChanged: boolean = true;
    public touchDown: boolean = false;
    public declare touchPointID: number;
    public declare $stageX: number;
    public declare $stageY: number;
    public declare _localX: number | undefined;
    public declare _localY: number | undefined;

    public constructor(type: string, bubbles?: boolean, cancelable?: boolean, stageX?: number, stageY?: number, touchPointID?: number) {
        super(type, bubbles, cancelable);
        this.$initTo(stageX, stageY, touchPointID);
    }

    public $initTo(stageX?: number, stageY?: number, touchPointID?: number): void {
        this.touchPointID = +touchPointID! || 0;
        this.$stageX = +stageX! || 0;
        this.$stageY = +stageY! || 0;
    }

    public get stageX(): number {
        return this.$stageX;
    }

    public get stageY(): number {
        return this.$stageY;
    }

    public get localX(): number | undefined {
        if (this.targetChanged) {
            this.getLocalXY();
        }
        return this._localX;
    }

    public get localY(): number | undefined {
        if (this.targetChanged) {
            this.getLocalXY();
        }
        return this._localY;
    }

    public getLocalXY(): void {
        this.targetChanged = false;
        // �����¼���Ŀ�갴����ʱԼ��Ϊ��ʾ����δ�ɷ�ʱ��ȡ����������ԭʵ�ֵĴ�����Ϊ��
        const m: Matrix = (this.$target as DisplayObject).$getInvertedConcatenatedMatrix();
        m.transformPoint(this.$stageX, this.$stageY, TouchEvent.localPoint);
        this._localX = TouchEvent.localPoint.x;
        this._localY = TouchEvent.localPoint.y;
    }

    public override $setTarget(target: object | null): boolean {
        this.$target = target;
        this.targetChanged = !!target;
        return true;
    }

    public updateAfterEvent(): void {
        runtime.sys.RenderHelper.$requestRenderingFlag = true;
    }

    public static dispatchTouchEvent(
        target: IEventDispatcher,
        type: string,
        bubbles?: boolean,
        cancelable?: boolean,
        stageX?: number,
        stageY?: number,
        touchPointID?: number,
        touchDown: boolean = false
    ): boolean {
        if (!bubbles && !target.hasEventListener(type)) {
            return true;
        }
        const event: TouchEvent = Event.create(TouchEvent, type, bubbles, cancelable);
        event.$initTo(stageX, stageY, touchPointID);
        event.touchDown = touchDown;
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(TouchEvent.prototype, "egret.TouchEvent");

export class BlurFilter extends Filter {
    public declare $blurX: number;
    public declare $blurY: number;
    public declare $quality: number;
    public declare blurXFilter: IBlurXFilter;
    public declare blurYFilter: IBlurYFilter;

    public constructor(blurX: number = 4, blurY: number = 4, quality: number = 1) {
        super();
        const self: this = this;
        self.type = "blur";
        self.$blurX = blurX;
        self.$blurY = blurY;
        self.$quality = quality;
        self.blurXFilter = new BlurXFilter(blurX);
        self.blurYFilter = new BlurYFilter(blurY);
        self.onPropertyChange();
    }

    public get blurX(): number {
        return this.$blurX;
    }

    public set blurX(value: number) {
        const self: this = this;
        if (self.$blurX == value) {
            return;
        }
        self.$blurX = value;
        self.blurXFilter.blurX = value;
        self.onPropertyChange();
    }

    public get blurY(): number {
        return this.$blurY;
    }

    public set blurY(value: number) {
        const self: this = this;
        if (self.$blurY == value) {
            return;
        }
        self.$blurY = value;
        self.blurYFilter.blurY = value;
        self.onPropertyChange();
    }

    public override $toJson(): string {
        return '{"blurX": ' + this.$blurX + ', "blurY": ' + this.$blurY + ', "quality": 1}';
    }

    public override updatePadding(): void {
        const self: this = this;
        self.paddingLeft = self.blurX;
        self.paddingRight = self.blurX;
        self.paddingTop = self.blurY;
        self.paddingBottom = self.blurY;
    }

    public override onPropertyChange(): void {
        const self: this = this;
        self.updatePadding();
    }
}
__reflect(BlurFilter.prototype, "egret.BlurFilter");

class BlurXFilter extends Filter implements IBlurXFilter {
    public declare $uniforms: BlurPassUniforms;

    public constructor(blurX: number = 4) {
        super();
        this.type = "blurX";
        this.$uniforms.blur = { x: blurX, y: 0 };
        this.onPropertyChange();
    }

    public get blurX(): number {
        return this.$uniforms.blur.x;
    }

    public set blurX(value: number) {
        this.$uniforms.blur.x = value;
    }
}
__reflect(BlurXFilter.prototype, "BlurXFilter", ["egret.IBlurXFilter"]);

class BlurYFilter extends Filter implements IBlurYFilter {
    public declare $uniforms: BlurPassUniforms;

    public constructor(blurY: number = 4) {
        super();
        this.type = "blurY";
        this.$uniforms.blur = { x: 0, y: blurY };
        this.onPropertyChange();
    }

    public get blurY(): number {
        return this.$uniforms.blur.y;
    }

    public set blurY(value: number) {
        this.$uniforms.blur.y = value;
    }
}
__reflect(BlurYFilter.prototype, "BlurYFilter", ["egret.IBlurYFilter"]);

export class ColorMatrixFilter extends Filter {
    public $matrix: number[] = [];
    public matrix2: number[] = [];
    public declare $uniforms: ColorMatrixUniforms;

    public constructor(matrix: ArrayLike<number> | null = null) {
        super();
        this.type = "colorTransform";
        this.$uniforms.matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        this.$uniforms.colorAdd = { x: 0, y: 0, z: 0, w: 0 };
        this.setMatrix(matrix);
        this.onPropertyChange();
    }

    public get matrix(): number[] {
        for (let i: number = 0; i < 20; i++) {
            this.matrix2[i] = this.$matrix[i]!;
        }
        return this.matrix2;
    }

    public set matrix(value: ArrayLike<number> | null) {
        this.setMatrix(value);
    }

    public setMatrix(value: ArrayLike<number> | null): void {
        if (value) {
            // ���÷�Ӧ�ṩ 4��5 ����� 20 ����ֵ������ԭʵ�ֲ�У�鳤�ȵ���Ϊ��
            for (let i: number = 0; i < 20; i++) {
                this.$matrix[i] = value[i]!;
            }
        } else {
            for (let i: number = 0; i < 20; i++) {
                this.$matrix[i] = (i == 0 || i == 6 || i == 12 || i == 18) ? 1 : 0;
            }
        }
        const $matrix: number[] = this.$matrix;
        const matrix: number[] = this.$uniforms.matrix;
        const colorAdd: GlowColorUniform = this.$uniforms.colorAdd;
        let j: number = 0;
        for (let i: number = 0; i < $matrix.length; i++) {
            if (i === 4) {
                colorAdd.x = $matrix[i]! / 255;
            } else if (i === 9) {
                colorAdd.y = $matrix[i]! / 255;
            } else if (i === 14) {
                colorAdd.z = $matrix[i]! / 255;
            } else if (i === 19) {
                colorAdd.w = $matrix[i]! / 255;
            } else {
                matrix[j] = $matrix[i]!;
                j++;
            }
        }
        this.onPropertyChange();
    }

    public override $toJson(): string {
        return '{"matrix": [' + this.$matrix.toString() + ']}';
    }
}
__reflect(ColorMatrixFilter.prototype, "egret.ColorMatrixFilter");

export class CustomFilter extends Filter {
    private static readonly SOURCE_KEY_MAP: Record<string, string | undefined> = {};

    public $padding: number = 0;
    public $vertexSrc: string;
    public $fragmentSrc: string;
    public $shaderKey: string;

    public constructor(vertexSrc: string, fragmentSrc: string, uniforms: FilterUniforms = {}) {
        super();
        this.$vertexSrc = vertexSrc;
        this.$fragmentSrc = fragmentSrc;
        const tempKey: string = vertexSrc + fragmentSrc;
        if (!CustomFilter.SOURCE_KEY_MAP[tempKey]) {
            CustomFilter.SOURCE_KEY_MAP[tempKey] = UuidHelper.generateUUID();
        }
        this.$shaderKey = CustomFilter.SOURCE_KEY_MAP[tempKey]!;
        this.$uniforms = uniforms;
        this.type = "custom";
    }

    public get padding(): number {
        return this.$padding;
    }

    public set padding(value: number) {
        const self: this = this;
        if (self.$padding == value) {
            return;
        }
        self.$padding = value;
        self.onPropertyChange();
    }

    public get uniforms(): FilterUniforms {
        return this.$uniforms;
    }

    public override onPropertyChange(): void {
    }
}
__reflect(CustomFilter.prototype, "egret.CustomFilter");

export class DropShadowFilter extends GlowFilter {
    public declare $distance: number;
    public declare $angle: number;
    public declare $hideObject: boolean;

    public constructor(
        distance: number = 4.0,
        angle: number = 45,
        color: number = 0,
        alpha: number = 1.0,
        blurX: number = 4.0,
        blurY: number = 4.0,
        strength: number = 1.0,
        quality: number = 1,
        inner: boolean = false,
        knockout: boolean = false,
        hideObject: boolean = false
    ) {
        super(color, alpha, blurX, blurY, strength, quality, inner, knockout);
        const self: this = this;
        self.$distance = distance;
        self.$angle = angle;
        self.$hideObject = hideObject;
        self.$uniforms.dist = distance;
        self.$uniforms.angle = angle / 180 * Math.PI;
        self.$uniforms.hideObject = hideObject ? 1 : 0;
        self.onPropertyChange();
    }

    public get distance(): number {
        return this.$distance;
    }

    public set distance(value: number) {
        const self: this = this;
        if (self.$distance == value) {
            return;
        }
        self.$distance = value;
        self.$uniforms.dist = value;
        self.onPropertyChange();
    }

    public get angle(): number {
        return this.$angle;
    }

    public set angle(value: number) {
        const self: this = this;
        if (self.$angle == value) {
            return;
        }
        self.$angle = value;
        self.$uniforms.angle = value / 180 * Math.PI;
        self.onPropertyChange();
    }

    public get hideObject(): boolean {
        return this.$hideObject;
    }

    public set hideObject(value: boolean) {
        if (this.$hideObject == value) {
            return;
        }
        this.$hideObject = value;
        this.$uniforms.hideObject = value ? 1 : 0;
    }

    public override $toJson(): string {
        return '{"distance": ' + this.$distance + ', "angle": ' + this.$angle + ', "color": ' + this.$color + ', "red": ' + this.$red + ', "green": ' + this.$green + ', "blue": ' + this.$blue + ', "alpha": ' + this.$alpha + ', "blurX": ' + this.$blurX + ', "blurY": ' + this.blurY + ', "strength": ' + this.$strength + ', "quality": ' + this.$quality + ', "inner": ' + this.$inner + ', "knockout": ' + this.$knockout + ', "hideObject": ' + this.$hideObject + '}';
    }

    public override updatePadding(): void {
        const self: this = this;
        self.paddingLeft = self.blurX;
        self.paddingRight = self.blurX;
        self.paddingTop = self.blurY;
        self.paddingBottom = self.blurY;
        const distance: number = self.distance || 0;
        const angle: number = self.angle || 0;
        let distanceX: number = 0;
        let distanceY: number = 0;
        if (distance != 0) {
            distanceX = distance * NumberUtils.cos(angle);
            if (distanceX > 0) {
                distanceX = Math.ceil(distanceX);
            } else {
                distanceX = Math.floor(distanceX);
            }
            distanceY = distance * NumberUtils.sin(angle);
            if (distanceY > 0) {
                distanceY = Math.ceil(distanceY);
            } else {
                distanceY = Math.floor(distanceY);
            }
            self.paddingLeft += distanceX;
            self.paddingRight += distanceX;
            self.paddingTop += distanceY;
            self.paddingBottom += distanceY;
        }
    }
}
__reflect(DropShadowFilter.prototype, "egret.DropShadowFilter");

export class GradientType {
    public static LINEAR: GradientTypeValue = "linear";
    public static RADIAL: GradientTypeValue = "radial";

    public constructor() {
    }
}
__reflect(GradientType.prototype, "egret.GradientType");

export class Graphics extends HashObject {
    public lastX: number = 0;
    public lastY: number = 0;
    public fillPath: sys.Path2D | null = null;
    public strokePath: sys.Path2D | null = null;
    public topLeftStrokeWidth: number = 0;
    public bottomRightStrokeWidth: number = 0;
    public minX: number = Infinity;
    public minY: number = Infinity;
    public maxX: number = -Infinity;
    public maxY: number = -Infinity;
    public includeLastPosition: boolean = true;
    public $renderNode: sys.GraphicsNode = new runtime.sys.GraphicsNode();
    public declare $targetDisplay: DisplayObject;
    public declare $targetIsSprite: boolean;

    public constructor() {
        super();
    }

    public $setTarget(target: DisplayObject): void {
        if (this.$targetDisplay) {
            this.$targetDisplay.$renderNode = null;
        }
        target.$renderNode = this.$renderNode;
        this.$targetDisplay = target;
        this.$targetIsSprite = target instanceof Sprite;
    }

    public setStrokeWidth(width: number): void {
        switch (width) {
            case 1:
                this.topLeftStrokeWidth = 0;
                this.bottomRightStrokeWidth = 1;
                break;
            case 3:
                this.topLeftStrokeWidth = 1;
                this.bottomRightStrokeWidth = 2;
                break;
            default:
                const half: number = Math.ceil(width * 0.5) | 0;
                this.topLeftStrokeWidth = half;
                this.bottomRightStrokeWidth = half;
                break;
        }
    }

    public beginFill(color: number, alpha: number = 1): void {
        color = +color || 0;
        alpha = +alpha || 0;
        this.fillPath = this.$renderNode.beginFill(color, alpha, this.strokePath);
        if (this.$renderNode.drawData.length > 1) {
            this.fillPath.moveTo(this.lastX, this.lastY);
        }
    }

    public beginGradientFill(type: GradientTypeValue, colors: number[], alphas: number[], ratios: number[], matrix: Matrix | null = null): void {
        this.fillPath = this.$renderNode.beginGradientFill(type, colors, alphas, ratios, matrix, this.strokePath);
        if (this.$renderNode.drawData.length > 1) {
            this.fillPath.moveTo(this.lastX, this.lastY);
        }
    }

    public endFill(): void {
        this.fillPath = null;
    }

    public lineStyle(
        thickness: number = NaN,
        color: number = 0,
        alpha: number = 1.0,
        _pixelHinting: boolean = false,
        _scaleMode: string = "normal",
        caps: CapsStyleValue | null = null,
        joints: JointStyleValue | null = null,
        miterLimit: number = 3,
        lineDash?: number[]
    ): void {
        thickness = +thickness || 0;
        color = +color || 0;
        alpha = +alpha || 0;
        miterLimit = +miterLimit || 0;
        if (thickness <= 0) {
            this.strokePath = null;
            this.setStrokeWidth(0);
        } else {
            this.setStrokeWidth(thickness);
            this.strokePath = this.$renderNode.lineStyle(thickness, color, alpha, caps, joints, miterLimit, lineDash);
            if (this.$renderNode.drawData.length > 1) {
                this.strokePath.moveTo(this.lastX, this.lastY);
            }
        }
    }

    public drawRect(x: number, y: number, width: number, height: number): void {
        x = +x || 0;
        y = +y || 0;
        width = +width || 0;
        height = +height || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.drawRect(x, y, width, height);
        strokePath && strokePath.drawRect(x, y, width, height);
        this.extendBoundsByPoint(x + width, y + height);
        this.updatePosition(x, y);
        this.dirty();
    }

    public drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void {
        x = +x || 0;
        y = +y || 0;
        width = +width || 0;
        height = +height || 0;
        ellipseWidth = +ellipseWidth || 0;
        ellipseHeight = +ellipseHeight! || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
        strokePath && strokePath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
        const radiusX: number = (ellipseWidth * 0.5) | 0;
        const radiusY: number = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
        const right: number = x + width;
        const bottom: number = y + height;
        const ybw: number = bottom - radiusY;
        this.extendBoundsByPoint(x, y);
        this.extendBoundsByPoint(right, bottom);
        this.updatePosition(right, ybw);
        this.dirty();
    }

    public drawCircle(x: number, y: number, radius: number): void {
        x = +x || 0;
        y = +y || 0;
        radius = +radius || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.drawCircle(x, y, radius);
        strokePath && strokePath.drawCircle(x, y, radius);
        this.extendBoundsByPoint(x - radius - 1, y - radius - 1);
        this.extendBoundsByPoint(x + radius + 2, y + radius + 2);
        this.updatePosition(x + radius, y);
        this.dirty();
    }

    public drawEllipse(x: number, y: number, width: number, height: number): void {
        x = +x || 0;
        y = +y || 0;
        width = +width || 0;
        height = +height || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.drawEllipse(x, y, width, height);
        strokePath && strokePath.drawEllipse(x, y, width, height);
        this.extendBoundsByPoint(x - 1, y - 1);
        this.extendBoundsByPoint(x + width + 2, y + height + 2);
        this.updatePosition(x + width, y + height * 0.5);
        this.dirty();
    }

    public moveTo(x: number, y: number): void {
        x = +x || 0;
        y = +y || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.moveTo(x, y);
        strokePath && strokePath.moveTo(x, y);
        this.includeLastPosition = false;
        this.lastX = x;
        this.lastY = y;
        this.dirty();
    }

    public lineTo(x: number, y: number): void {
        x = +x || 0;
        y = +y || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.lineTo(x, y);
        strokePath && strokePath.lineTo(x, y);
        this.updatePosition(x, y);
        this.dirty();
    }

    public curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void {
        controlX = +controlX || 0;
        controlY = +controlY || 0;
        anchorX = +anchorX || 0;
        anchorY = +anchorY || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.curveTo(controlX, controlY, anchorX, anchorY);
        strokePath && strokePath.curveTo(controlX, controlY, anchorX, anchorY);
        const lastX: number = this.lastX || 0;
        const lastY: number = this.lastY || 0;
        const bezierPoints: Point[] = createBezierPoints([lastX, lastY, controlX, controlY, anchorX, anchorY], 50);
        for (let i: number = 0; i < bezierPoints.length; i++) {
            const point: Point = bezierPoints[i]!;
            this.extendBoundsByPoint(point.x, point.y);
            Point.release(point);
        }
        this.extendBoundsByPoint(anchorX, anchorY);
        this.updatePosition(anchorX, anchorY);
        this.dirty();
    }

    public cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void {
        controlX1 = +controlX1 || 0;
        controlY1 = +controlY1 || 0;
        controlX2 = +controlX2 || 0;
        controlY2 = +controlY2 || 0;
        anchorX = +anchorX || 0;
        anchorY = +anchorY || 0;
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        fillPath && fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
        strokePath && strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
        const lastX: number = this.lastX || 0;
        const lastY: number = this.lastY || 0;
        const bezierPoints: Point[] = createBezierPoints([lastX, lastY, controlX1, controlY1, controlX2, controlY2, anchorX, anchorY], 50);
        for (let i: number = 0; i < bezierPoints.length; i++) {
            const point: Point = bezierPoints[i]!;
            this.extendBoundsByPoint(point.x, point.y);
            Point.release(point);
        }
        this.extendBoundsByPoint(anchorX, anchorY);
        this.updatePosition(anchorX, anchorY);
        this.dirty();
    }

    public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        if (radius < 0 || startAngle === endAngle) {
            return;
        }
        x = +x || 0;
        y = +y || 0;
        radius = +radius || 0;
        startAngle = +startAngle || 0;
        endAngle = +endAngle || 0;
        anticlockwise = !!anticlockwise;
        startAngle = clampAngle(startAngle);
        endAngle = clampAngle(endAngle);
        const fillPath: sys.Path2D | null = this.fillPath;
        const strokePath: sys.Path2D | null = this.strokePath;
        if (fillPath) {
            fillPath.$lastX = this.lastX;
            fillPath.$lastY = this.lastY;
            fillPath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
        }
        if (strokePath) {
            strokePath.$lastX = this.lastX;
            strokePath.$lastY = this.lastY;
            strokePath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
        }
        if (anticlockwise) {
            this.arcBounds(x, y, radius, endAngle, startAngle);
        } else {
            this.arcBounds(x, y, radius, startAngle, endAngle);
        }
        const endX: number = x + Math.cos(endAngle) * radius;
        const endY: number = y + Math.sin(endAngle) * radius;
        this.updatePosition(endX, endY);
        this.dirty();
    }

    public dirty(): void {
        const self: this = this;
        self.$renderNode.dirtyRender = true;
        const target: DisplayObject = self.$targetDisplay;
        target.$cacheDirty = true;
        const p: DisplayObjectContainer | null = target.$parent;
        if (p && !p.$cacheDirty) {
            p.$cacheDirty = true;
            p.$cacheDirtyUp();
        }
        const maskedObject: DisplayObject | null = target.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
            maskedObject.$cacheDirty = true;
            maskedObject.$cacheDirtyUp();
        }
    }

    public arcBounds(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
        const PI: number = Math.PI;
        if (Math.abs(startAngle - endAngle) < 0.01) {
            this.extendBoundsByPoint(x - radius, y - radius);
            this.extendBoundsByPoint(x + radius, y + radius);
            return;
        }
        if (startAngle > endAngle) {
            endAngle += PI * 2;
        }
        const startX: number = Math.cos(startAngle) * radius;
        const endX: number = Math.cos(endAngle) * radius;
        let xMin: number = Math.min(startX, endX);
        let xMax: number = Math.max(startX, endX);
        const startY: number = Math.sin(startAngle) * radius;
        const endY: number = Math.sin(endAngle) * radius;
        let yMin: number = Math.min(startY, endY);
        let yMax: number = Math.max(startY, endY);
        const startRange: number = startAngle / (PI * 0.5);
        const endRange: number = endAngle / (PI * 0.5);
        for (let i: number = Math.ceil(startRange); i <= endRange; i++) {
            switch (i % 4) {
                case 0: xMax = radius; break;
                case 1: yMax = radius; break;
                case 2: xMin = -radius; break;
                case 3: yMin = -radius; break;
            }
        }
        xMin = Math.floor(xMin);
        yMin = Math.floor(yMin);
        xMax = Math.ceil(xMax);
        yMax = Math.ceil(yMax);
        this.extendBoundsByPoint(xMin + x, yMin + y);
        this.extendBoundsByPoint(xMax + x, yMax + y);
    }

    public clear(): void {
        this.$renderNode.clear();
        this.updatePosition(0, 0);
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
        this.dirty();
    }

    public extendBoundsByPoint(x: number, y: number): void {
        this.extendBoundsByX(x);
        this.extendBoundsByY(y);
    }

    public extendBoundsByX(x: number): void {
        this.minX = Math.min(this.minX, x - this.topLeftStrokeWidth);
        this.maxX = Math.max(this.maxX, x + this.bottomRightStrokeWidth);
        this.updateNodeBounds();
    }

    public extendBoundsByY(y: number): void {
        this.minY = Math.min(this.minY, y - this.topLeftStrokeWidth);
        this.maxY = Math.max(this.maxY, y + this.bottomRightStrokeWidth);
        this.updateNodeBounds();
    }

    public updateNodeBounds(): void {
        const node: sys.GraphicsNode = this.$renderNode;
        node.x = this.minX;
        node.y = this.minY;
        node.width = Math.ceil(this.maxX - this.minX);
        node.height = Math.ceil(this.maxY - this.minY);
    }

    public updatePosition(x: number, y: number): void {
        if (!this.includeLastPosition) {
            this.extendBoundsByPoint(this.lastX, this.lastY);
            this.includeLastPosition = true;
        }
        this.lastX = x;
        this.lastY = y;
        this.extendBoundsByPoint(x, y);
    }

    public $measureContentBounds(bounds: Rectangle): void {
        if (this.minX === Infinity) {
            bounds.setEmpty();
        } else {
            bounds.setTo(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
        }
    }

    public $hitTest(stageX: number, stageY: number): DisplayObject | null {
        const target: DisplayObject = this.$targetDisplay;
        const m: Matrix = target.$getInvertedConcatenatedMatrix();
        const localX: number = m.a * stageX + m.c * stageY + m.tx;
        const localY: number = m.b * stageX + m.d * stageY + m.ty;
        const buffer: sys.RenderBuffer = runtime.sys.RenderHelper.canvasHitTestBuffer!;
        buffer.resize(3, 3);
        const node: sys.GraphicsNode = this.$renderNode;
        const matrix: Matrix = Matrix.create();
        matrix.identity();
        matrix.translate(1 - localX, 1 - localY);
        runtime.sys.RenderHelper.canvasRenderer!.drawNodeToBuffer(node, buffer, matrix, true);
        Matrix.release(matrix);
        try {
            const data: Uint8Array | Uint8ClampedArray = buffer.getPixels(1, 1);
            if (data[3] === 0) {
                return null;
            }
        } catch (e: unknown) {
            throw new Error(runtime.sys.tr(1039));
        }
        return target;
    }

    public $onRemoveFromStage(): void {
        if (this.$renderNode) {
            this.$renderNode.clean();
        }
    }
}
__reflect(Graphics.prototype, "egret.Graphics");

export class Matrix extends HashObject {
    public static readonly $TempMatrix: Matrix = new Matrix();
    private static readonly PI: number = Math.PI;
    private static readonly TwoPI: number = Matrix.PI * 2;
    private static readonly DEG_TO_RAD: number = Matrix.PI / 180;
    private static readonly matrixPool: Matrix[] = [];

    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public tx: number;
    public ty: number;

    public constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    public static release(matrix: Matrix | null | undefined): void {
        if (!matrix) {
            return;
        }
        Matrix.matrixPool.push(matrix);
    }

    public static create(): Matrix {
        let matrix: Matrix | undefined = Matrix.matrixPool.pop();
        if (!matrix) {
            matrix = new Matrix();
        }
        return matrix;
    }

    public clone(): Matrix {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    public concat(other: Matrix): void {
        let a: number = this.a * other.a;
        let b: number = 0.0;
        let c: number = 0.0;
        let d: number = this.d * other.d;
        let tx: number = this.tx * other.a + other.tx;
        let ty: number = this.ty * other.d + other.ty;
        if (this.b !== 0.0 || this.c !== 0.0 || other.b !== 0.0 || other.c !== 0.0) {
            a += this.b * other.c;
            d += this.c * other.b;
            b += this.a * other.b + this.b * other.d;
            c += this.c * other.a + this.d * other.c;
            tx += this.ty * other.c;
            ty += this.tx * other.b;
        }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    public copyFrom(other: Matrix): Matrix {
        this.a = other.a;
        this.b = other.b;
        this.c = other.c;
        this.d = other.d;
        this.tx = other.tx;
        this.ty = other.ty;
        return this;
    }

    public identity(): void {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
    }

    public invert(): void {
        this.$invertInto(this);
    }

    public $invertInto(target: Matrix): void {
        let a: number = this.a;
        let b: number = this.b;
        let c: number = this.c;
        let d: number = this.d;
        const tx: number = this.tx;
        const ty: number = this.ty;
        if (b == 0 && c == 0) {
            target.b = target.c = 0;
            if (a == 0 || d == 0) {
                target.a = target.d = target.tx = target.ty = 0;
            } else {
                a = target.a = 1 / a;
                d = target.d = 1 / d;
                target.tx = -a * tx;
                target.ty = -d * ty;
            }
            return;
        }
        let determinant: number = a * d - b * c;
        if (determinant == 0) {
            target.identity();
            return;
        }
        determinant = 1 / determinant;
        const k: number = target.a = d * determinant;
        b = target.b = -b * determinant;
        c = target.c = -c * determinant;
        d = target.d = a * determinant;
        target.tx = -(k * tx + c * ty);
        target.ty = -(b * tx + d * ty);
    }

    public rotate(angle: number): void {
        angle = +angle;
        if (angle !== 0) {
            angle = angle / Matrix.DEG_TO_RAD;
            const u: number = NumberUtils.cos(angle);
            const v: number = NumberUtils.sin(angle);
            const ta: number = this.a;
            const tb: number = this.b;
            const tc: number = this.c;
            const td: number = this.d;
            const ttx: number = this.tx;
            const tty: number = this.ty;
            this.a = ta * u - tb * v;
            this.b = ta * v + tb * u;
            this.c = tc * u - td * v;
            this.d = tc * v + td * u;
            this.tx = ttx * u - tty * v;
            this.ty = ttx * v + tty * u;
        }
    }

    public scale(sx: number, sy: number): void {
        if (sx !== 1) {
            this.a *= sx;
            this.c *= sx;
            this.tx *= sx;
        }
        if (sy !== 1) {
            this.b *= sy;
            this.d *= sy;
            this.ty *= sy;
        }
    }

    public setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    }

    public transformPoint(pointX: number, pointY: number, resultPoint?: Point | null): Point {
        const x: number = this.a * pointX + this.c * pointY + this.tx;
        const y: number = this.b * pointX + this.d * pointY + this.ty;
        if (resultPoint) {
            resultPoint.setTo(x, y);
            return resultPoint;
        }
        return new Point(x, y);
    }

    public translate(dx: number, dy: number): void {
        this.tx += dx;
        this.ty += dy;
    }

    public equals(other: Matrix): boolean {
        return this.a == other.a && this.b == other.b && this.c == other.c && this.d == other.d && this.tx == other.tx && this.ty == other.ty;
    }

    public prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
        const tx1: number = this.tx;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            const a1: number = this.a;
            const c1: number = this.c;
            this.a = a1 * a + this.b * c;
            this.b = a1 * b + this.b * d;
            this.c = c1 * a + this.d * c;
            this.d = c1 * b + this.d * d;
        }
        this.tx = tx1 * a + this.ty * c + tx;
        this.ty = tx1 * b + this.ty * d + ty;
        return this;
    }

    public append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
        const a1: number = this.a;
        const b1: number = this.b;
        const c1: number = this.c;
        const d1: number = this.d;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            this.a = a * a1 + b * c1;
            this.b = a * b1 + b * d1;
            this.c = c * a1 + d * c1;
            this.d = c * b1 + d * d1;
        }
        this.tx = tx * a1 + ty * c1 + this.tx;
        this.ty = tx * b1 + ty * d1 + this.ty;
        return this;
    }

    public deltaTransformPoint(point: Point): Point {
        const self: this = this;
        const x: number = self.a * point.x + self.c * point.y;
        const y: number = self.b * point.x + self.d * point.y;
        return new Point(x, y);
    }

    public toString(): string {
        return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
    }

    public createBox(scaleX: number, scaleY: number, rotation: number = 0, tx: number = 0, ty: number = 0): void {
        const self: this = this;
        if (rotation !== 0) {
            rotation = rotation / Matrix.DEG_TO_RAD;
            const u: number = NumberUtils.cos(rotation);
            const v: number = NumberUtils.sin(rotation);
            self.a = u * scaleX;
            self.b = v * scaleY;
            self.c = -v * scaleX;
            self.d = u * scaleY;
        } else {
            self.a = scaleX;
            self.b = 0;
            self.c = 0;
            self.d = scaleY;
        }
        self.tx = tx;
        self.ty = ty;
    }

    public createGradientBox(width: number, height: number, rotation: number = 0, tx: number = 0, ty: number = 0): void {
        this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
    }

    public $transformBounds(bounds: Rectangle): void {
        const a: number = this.a;
        const b: number = this.b;
        const c: number = this.c;
        const d: number = this.d;
        const tx: number = this.tx;
        const ty: number = this.ty;
        const x: number = bounds.x;
        const y: number = bounds.y;
        const xMax: number = x + bounds.width;
        const yMax: number = y + bounds.height;
        let x0: number = a * x + c * y + tx;
        let y0: number = b * x + d * y + ty;
        let x1: number = a * xMax + c * y + tx;
        let y1: number = b * xMax + d * y + ty;
        let x2: number = a * xMax + c * yMax + tx;
        let y2: number = b * xMax + d * yMax + ty;
        let x3: number = a * x + c * yMax + tx;
        let y3: number = b * x + d * yMax + ty;
        let tmp: number = 0;
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
        bounds.x = Math.floor(x0 < x2 ? x0 : x2);
        bounds.width = Math.ceil((x1 > x3 ? x1 : x3) - bounds.x);
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
        bounds.y = Math.floor(y0 < y2 ? y0 : y2);
        bounds.height = Math.ceil((y1 > y3 ? y1 : y3) - bounds.y);
    }

    public getDeterminant(): number {
        return this.a * this.d - this.b * this.c;
    }

    public $getScaleX(): number {
        const m: this = this;
        if (m.b == 0) {
            return m.a;
        }
        const result: number = Math.sqrt(m.a * m.a + m.b * m.b);
        return this.getDeterminant() < 0 ? -result : result;
    }

    public $getScaleY(): number {
        const m: this = this;
        if (m.c == 0) {
            return m.d;
        }
        const result: number = Math.sqrt(m.c * m.c + m.d * m.d);
        return this.getDeterminant() < 0 ? -result : result;
    }

    public $getSkewX(): number {
        if (this.d < 0) {
            return Math.atan2(this.d, this.c) + Matrix.PI / 2;
        } else {
            return Math.atan2(this.d, this.c) - Matrix.PI / 2;
        }
    }

    public $getSkewY(): number {
        if (this.a < 0) {
            return Math.atan2(this.b, this.a) - Matrix.PI;
        } else {
            return Math.atan2(this.b, this.a);
        }
    }

    public $updateScaleAndRotation(scaleX: number, scaleY: number, skewX: number, skewY: number): void {
        if ((skewX == 0 || skewX == Matrix.TwoPI) && (skewY == 0 || skewY == Matrix.TwoPI)) {
            this.a = scaleX;
            this.b = this.c = 0;
            this.d = scaleY;
            return;
        }
        skewX = skewX / Matrix.DEG_TO_RAD;
        skewY = skewY / Matrix.DEG_TO_RAD;
        const u: number = NumberUtils.cos(skewX);
        const v: number = NumberUtils.sin(skewX);
        if (skewX == skewY) {
            this.a = u * scaleX;
            this.b = v * scaleX;
        } else {
            this.a = NumberUtils.cos(skewY) * scaleX;
            this.b = NumberUtils.sin(skewY) * scaleX;
        }
        this.c = -v * scaleY;
        this.d = u * scaleY;
    }

    public $preMultiplyInto(other: Matrix, target: Matrix): void {
        let a: number = other.a * this.a;
        let b: number = 0.0;
        let c: number = 0.0;
        let d: number = other.d * this.d;
        let tx: number = other.tx * this.a + this.tx;
        let ty: number = other.ty * this.d + this.ty;
        if (other.b !== 0.0 || other.c !== 0.0 || this.b !== 0.0 || this.c !== 0.0) {
            a += other.b * this.c;
            d += other.c * this.b;
            b += other.a * this.b + other.b * this.d;
            c += other.c * this.a + other.d * this.c;
            tx += other.ty * this.c;
            ty += other.tx * this.b;
        }
        target.a = a;
        target.b = b;
        target.c = c;
        target.d = d;
        target.tx = tx;
        target.ty = ty;
    }
}
__reflect(Matrix.prototype, "egret.Matrix");

export class Rectangle extends HashObject {
    private static readonly rectanglePool: Rectangle[] = [];
    public static readonly $TempRectangle = new Rectangle();

    public x: number;
    public y: number;
    public width: number;
    public height: number;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public static release(rect: Rectangle | null | undefined): void {
        if (!rect) {
            return;
        }
        Rectangle.rectanglePool.push(rect);
    }

    public static create(): Rectangle {
        let rect: Rectangle | undefined = Rectangle.rectanglePool.pop();
        if (!rect) {
            rect = new Rectangle();
        }
        return rect;
    }

    public get right(): number {
        return this.x + this.width;
    }

    public set right(value: number) {
        this.width = value - this.x;
    }

    public get bottom(): number {
        return this.y + this.height;
    }

    public set bottom(value: number) {
        this.height = value - this.y;
    }

    public get left(): number {
        return this.x;
    }

    public set left(value: number) {
        this.width += this.x - value;
        this.x = value;
    }

    public get top(): number {
        return this.y;
    }

    public set top(value: number) {
        this.height += this.y - value;
        this.y = value;
    }

    public get topLeft(): Point {
        return new Point(this.left, this.top);
    }

    public set topLeft(value: Point) {
        this.top = value.y;
        this.left = value.x;
    }

    public get bottomRight(): Point {
        return new Point(this.right, this.bottom);
    }

    public set bottomRight(value: Point) {
        this.bottom = value.y;
        this.right = value.x;
    }

    public copyFrom(sourceRect: Rectangle): Rectangle {
        this.x = sourceRect.x;
        this.y = sourceRect.y;
        this.width = sourceRect.width;
        this.height = sourceRect.height;
        return this;
    }

    public setTo(x: number, y: number, width: number, height: number): Rectangle {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    public contains(x: number, y: number): boolean {
        return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y;
    }

    public intersection(toIntersect: Rectangle): Rectangle {
        return this.clone().$intersectInPlace(toIntersect);
    }

    public inflate(dx: number, dy: number): void {
        this.x -= dx;
        this.width += 2 * dx;
        this.y -= dy;
        this.height += 2 * dy;
    }

    public $intersectInPlace(clipRect: Rectangle): Rectangle {
        const x0: number = this.x;
        const y0: number = this.y;
        const x1: number = clipRect.x;
        const y1: number = clipRect.y;
        const l: number = Math.max(x0, x1);
        const r: number = Math.min(x0 + this.width, x1 + clipRect.width);
        if (l <= r) {
            const t: number = Math.max(y0, y1);
            const b: number = Math.min(y0 + this.height, y1 + clipRect.height);
            if (t <= b) {
                this.setTo(l, t, r - l, b - t);
                return this;
            }
        }
        this.setEmpty();
        return this;
    }

    public intersects(toIntersect: Rectangle): boolean {
        return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)
            && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
    }

    public isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    public setEmpty(): void {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    public clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    public containsPoint(point: Point): boolean {
        if (this.x <= point.x && this.x + this.width > point.x && this.y <= point.y && this.y + this.height > point.y) {
            return true;
        }
        return false;
    }

    public containsRect(rect: Rectangle): boolean {
        const r1: number = rect.x + rect.width;
        const b1: number = rect.y + rect.height;
        const r2: number = this.x + this.width;
        const b2: number = this.y + this.height;
        return rect.x >= this.x && rect.x < r2 && rect.y >= this.y && rect.y < b2 && r1 > this.x && r1 <= r2 && b1 > this.y && b1 <= b2;
    }

    public equals(toCompare: Rectangle): boolean {
        if (this === toCompare) {
            return true;
        }
        return this.x === toCompare.x && this.y === toCompare.y && this.width === toCompare.width && this.height === toCompare.height;
    }

    public inflatePoint(point: Point): void {
        this.inflate(point.x, point.y);
    }

    public offset(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    public offsetPoint(point: Point): void {
        this.offset(point.x, point.y);
    }

    public toString(): string {
        return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
    }

    public union(toUnion: Rectangle): Rectangle {
        const result: Rectangle = this.clone();
        if (toUnion.isEmpty()) {
            return result;
        }
        if (result.isEmpty()) {
            result.copyFrom(toUnion);
            return result;
        }
        const l: number = Math.min(result.x, toUnion.x);
        const t: number = Math.min(result.y, toUnion.y);
        result.setTo(l, t, Math.max(result.right, toUnion.right) - l, Math.max(result.bottom, toUnion.bottom) - t);
        return result;
    }

    public $getBaseWidth(angle: number): number {
        const u: number = Math.abs(Math.cos(angle));
        const v: number = Math.abs(Math.sin(angle));
        return u * this.width + v * this.height;
    }

    public $getBaseHeight(angle: number): number {
        const u: number = Math.abs(Math.cos(angle));
        const v: number = Math.abs(Math.sin(angle));
        return v * this.width + u * this.height;
    }
}
__reflect(Rectangle.prototype, "egret.Rectangle");

export class HttpResponseType {
    public static TEXT: string = "text";
    public static ARRAY_BUFFER: string = "arraybuffer";
}
__reflect(HttpResponseType.prototype, "egret.HttpResponseType");

export class StageScaleMode {
    public static NO_SCALE: string = "noScale";
    public static SHOW_ALL: string = "showAll";
    public static NO_BORDER: string = "noBorder";
    public static EXACT_FIT: string = "exactFit";
    public static FIXED_WIDTH: string = "fixedWidth";
    public static FIXED_HEIGHT: string = "fixedHeight";
    public static FIXED_NARROW: string = "fixedNarrow";
    public static FIXED_WIDE: string = "fixedWide";
}
__reflect(StageScaleMode.prototype, "egret.StageScaleMode");

export class Capabilities {
    public static language: string = "zh-CN";
    public static os: string = "Unknown";
    public static declare isMobile: boolean;
    public static runtimeType: string = RuntimeType.WEB;
    public static engineVersion: string = "5.2.33";
    public static renderMode: string = "Unknown";
    public static boundingClientWidth: number = 0;
    public static boundingClientHeight: number = 0;
    public static declare supportedCompressedTexture: { pvrtc: boolean; etc1: boolean } | undefined;
}
__reflect(Capabilities.prototype, "egret.Capabilities");

export class HorizontalAlign {
    public static LEFT: string = "left";
    public static RIGHT: string = "right";
    public static CENTER: string = "center";
    public static JUSTIFY: string = "justify";
    public static CONTENT_JUSTIFY: string = "contentJustify";
}
__reflect(HorizontalAlign.prototype, "egret.HorizontalAlign");

export class KTXContainer {
    public static HEADER_LEN: number = 12 + 13 * 4;
    public static COMPRESSED_2D: number = 0;
    public static COMPRESSED_3D: number = 1;
    public static TEX_2D: number = 2;
    public static TEX_3D: number = 3;
    public isInvalid: boolean = false;
    public declare glType: number;
    public declare glTypeSize: number;
    public declare glFormat: number;
    public declare glInternalFormat: number;
    public declare glBaseInternalFormat: number;
    public declare pixelWidth: number;
    public declare pixelHeight: number;
    public declare pixelDepth: number;
    public declare numberOfArrayElements: number;
    public declare numberOfFaces: number;
    public declare numberOfMipmapLevels: number;
    public declare bytesOfKeyValueData: number;
    public declare loadType: number | undefined;
    public arrayBuffer: ArrayBuffer;

    public constructor(arrayBuffer: ArrayBuffer, facesExpected: number, _threeDExpected?: boolean, _textureArrayExpected?: boolean) {
        this.arrayBuffer = arrayBuffer;
        const identifier: Uint8Array = new Uint8Array(arrayBuffer, 0, 12);
        const expected: readonly number[] = [0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A];
        if (expected.some((value: number, index: number): boolean => identifier[index] !== value)) {
            this.isInvalid = true;
            console.error("texture missing KTX identifier");
            return;
        }
        const dataSize: number = Uint32Array.BYTES_PER_ELEMENT;
        const header: DataView = new DataView(arrayBuffer, 12, 13 * dataSize);
        const littleEndian: boolean = header.getUint32(0, true) === 0x04030201;
        this.glType = header.getUint32(dataSize, littleEndian);
        this.glTypeSize = header.getUint32(2 * dataSize, littleEndian);
        this.glFormat = header.getUint32(3 * dataSize, littleEndian);
        this.glInternalFormat = header.getUint32(4 * dataSize, littleEndian);
        this.glBaseInternalFormat = header.getUint32(5 * dataSize, littleEndian);
        this.pixelWidth = header.getUint32(6 * dataSize, littleEndian);
        this.pixelHeight = header.getUint32(7 * dataSize, littleEndian);
        this.pixelDepth = header.getUint32(8 * dataSize, littleEndian);
        this.numberOfArrayElements = header.getUint32(9 * dataSize, littleEndian);
        this.numberOfFaces = header.getUint32(10 * dataSize, littleEndian);
        this.numberOfMipmapLevels = header.getUint32(11 * dataSize, littleEndian);
        this.bytesOfKeyValueData = header.getUint32(12 * dataSize, littleEndian);
        if (this.glType !== 0) { console.error("only compressed formats currently supported"); return; }
        this.numberOfMipmapLevels = Math.max(1, this.numberOfMipmapLevels);
        if (this.pixelHeight === 0 || this.pixelDepth !== 0) { console.error("only 2D textures currently supported"); return; }
        if (this.numberOfArrayElements !== 0) { console.error("texture arrays not currently supported"); return; }
        if (this.numberOfFaces !== facesExpected) { console.error("number of faces expected" + facesExpected + ", but found " + this.numberOfFaces); return; }
        this.loadType = KTXContainer.COMPRESSED_2D;
    }
    public uploadLevels(bitmapData: BitmapData, loadMipmaps: boolean): void {
        if (this.loadType === KTXContainer.COMPRESSED_2D) { this._upload2DCompressedLevels(bitmapData, loadMipmaps); }
    }
    public _upload2DCompressedLevels(bitmapData: BitmapData, loadMipmaps: boolean): void {
        bitmapData.clearCompressedTextureData();
        const compressedTextureData: CompressedTextureData[][] = bitmapData.compressedTextureData;
        let dataOffset: number = KTXContainer.HEADER_LEN + this.bytesOfKeyValueData;
        let width: number = this.pixelWidth;
        let height: number = this.pixelHeight;
        const mipmapCount: number = loadMipmaps ? this.numberOfMipmapLevels : 1;
        for (let level: number = 0; level < mipmapCount; level++) {
            const imageSize: number = new Int32Array(this.arrayBuffer, dataOffset, 1)[0]!;
            dataOffset += 4;
            const levelData: CompressedTextureData[] = [];
            for (let face: number = 0; face < this.numberOfFaces; face++) {
                const byteArray: Uint8Array = new Uint8Array(this.arrayBuffer, dataOffset, imageSize);
                const compressedData: CompressedTextureData = new CompressedTextureData();
                compressedData.glInternalFormat = this.glInternalFormat;
                compressedData.width = width;
                compressedData.height = height;
                compressedData.byteArray = byteArray;
                compressedData.face = face;
                compressedData.level = level;
                levelData.push(compressedData);
                dataOffset += imageSize;
                dataOffset += 3 - ((imageSize + 3) % 4);
            }
            compressedTextureData.push(levelData);
            width = Math.max(1, width * 0.5);
            height = Math.max(1, height * 0.5);
        }
        const compressed2d: CompressedTextureData | null | undefined = bitmapData.getCompressed2dTextureData();
        if (compressed2d) { bitmapData.width = compressed2d.width; bitmapData.height = compressed2d.height; }
    }
}
__reflect(KTXContainer.prototype, "egret.KTXContainer");

export class CanvasRenderer {
    private static readonly blendModes: GlobalCompositeOperation[] = ["source-over", "lighter", "destination-out"];
    private static readonly defaultCompositeOp: GlobalCompositeOperation = "source-over";
    private static readonly BLACK_COLOR: string = "#000000";
    private static readonly CAPS_STYLES: Record<CapsStyleValue, CanvasLineCap> = { none: "butt", square: "square", round: "round" };
    private static readonly renderBufferPool: sys.CanvasRenderBuffer[] = [];
    private static readonly renderBufferPool_Filters: sys.CanvasRenderBuffer[] = [];

    public nestLevel: number = 0;
    public renderingMask: boolean = false;

    public render(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix: Matrix, _forRenderTexture?: boolean): number {
        this.nestLevel++;
        const context: sys.CanvasContext = (buffer as sys.CanvasRenderBuffer).context;
        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
        const drawCall: number = this.drawDisplayObject(displayObject, context, matrix.tx, matrix.ty, true);
        const invert: Matrix = Matrix.create();
        matrix.$invertInto(invert);
        context.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
        Matrix.release(invert);
        this.nestLevel--;
        if (this.nestLevel === 0) {
            if (CanvasRenderer.renderBufferPool.length > 6) {
                CanvasRenderer.renderBufferPool.length = 6;
            }
            for (let i: number = 0; i < CanvasRenderer.renderBufferPool.length; i++) {
                CanvasRenderer.renderBufferPool[i]!.resize(0, 0);
            }
        }
        return drawCall;
    }
    public drawDisplayObject(displayObject: DisplayObject, context: sys.CanvasContext, offsetX: number, offsetY: number, isStage?: boolean): number {
        let drawCalls: number = 0;
        let node: sys.RenderNode | null;
        const displayList: sys.DisplayList | null = displayObject.$displayList;
        if (displayList && !isStage) {
            if (displayObject.$cacheDirty || displayObject.$renderDirty || displayList.$canvasScaleX != runtime.sys.DisplayList.$canvasScaleX || displayList.$canvasScaleY != runtime.sys.DisplayList.$canvasScaleY) { drawCalls += displayList.drawToSurface(); }
            node = displayList.$renderNode;
        } else { node = displayObject.$renderDirty ? displayObject.$getRenderNode() : displayObject.$renderNode; }
        displayObject.$cacheDirty = false;
        if (node) {
            drawCalls++;
            context.$offsetX = offsetX; context.$offsetY = offsetY;
            this.renderNode(node, context);
            context.$offsetX = context.$offsetY = 0;
        }
        if (displayList && !isStage) { return drawCalls; }
        const children: DisplayObject[] | null = displayObject.$children;
        if (children) {
            const length: number = children.length;
            for (let i: number = 0; i < length; i++) {
                const child: DisplayObject = children[i]!;
                let offsetX2: number;
                let offsetY2: number;
                if (child.$useTranslate) {
                    const m: Matrix = child.$getMatrix();
                    offsetX2 = offsetX + child.$x; offsetY2 = offsetY + child.$y;
                    context.save(); context.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                    offsetX2 = -child.$anchorOffsetX; offsetY2 = -child.$anchorOffsetY;
                } else { offsetX2 = offsetX + child.$x - child.$anchorOffsetX; offsetY2 = offsetY + child.$y - child.$anchorOffsetY; }
                let tempAlpha: number | undefined;
                if (child.$alpha != 1) { tempAlpha = context.globalAlpha; context.globalAlpha *= child.$alpha; }
                switch (child.$renderMode) {
                    case 1: break;
                    case 2: drawCalls += this.drawWithFilter(child, context, offsetX2, offsetY2); break;
                    case 3: drawCalls += this.drawWithClip(child, context, offsetX2, offsetY2); break;
                    case 4: drawCalls += this.drawWithScrollRect(child, context, offsetX2, offsetY2); break;
                    default: drawCalls += this.drawDisplayObject(child, context, offsetX2, offsetY2); break;
                }
                if (child.$useTranslate) { context.restore(); } else if (tempAlpha) { context.globalAlpha = tempAlpha; }
            }
        }
        return drawCalls;
    }
    public drawWithFilter(displayObject: DisplayObject, context: sys.CanvasContext, offsetX: number, offsetY: number): number {
        if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) { return 0; }
        let drawCalls: number = 0;
        const filters: Filter[] = displayObject.$filters!;
        const filtersLen: number = filters.length;
        const hasBlendMode: boolean = displayObject.$blendMode !== 0;
        const compositeOp: GlobalCompositeOperation = CanvasRenderer.blendModes[displayObject.$blendMode] || CanvasRenderer.defaultCompositeOp;
        const displayBounds: Rectangle = displayObject.$getOriginalBounds();
        const displayBoundsX: number = displayBounds.x;
        const displayBoundsY: number = displayBounds.y;
        const displayBoundsWidth: number = displayBounds.width;
        const displayBoundsHeight: number = displayBounds.height;
        if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
            return drawCalls;
        }
        const displayBuffer: sys.CanvasRenderBuffer = this.createRenderBuffer(displayBoundsWidth - displayBoundsX, displayBoundsHeight - displayBoundsY, true);
        const displayContext: sys.CanvasContext = displayBuffer.context;
        if (displayObject.$mask) { drawCalls += this.drawWithClip(displayObject, displayContext, -displayBoundsX, -displayBoundsY); }
        else if (displayObject.$scrollRect || displayObject.$maskRect) { drawCalls += this.drawWithScrollRect(displayObject, displayContext, -displayBoundsX, -displayBoundsY); }
        else { drawCalls += this.drawDisplayObject(displayObject, displayContext, -displayBoundsX, -displayBoundsY); }
        if (drawCalls > 0) {
            if (hasBlendMode) { context.globalCompositeOperation = compositeOp; }
            drawCalls++;
            const imageData: ImageData = displayContext.getImageData(0, 0, displayBuffer.surface.width, displayBuffer.surface.height);
            for (let i: number = 0; i < filtersLen; i++) {
                const filter: Filter = filters[i]!;
                if (filter.type == "colorTransform") {
                    colorFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, (filter as ColorMatrixFilter).$matrix);
                } else if (filter.type == "blur") {
                    const blur: BlurFilter = filter as BlurFilter;
                    blurFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, blur.$blurX, blur.$blurY);
                } else if (filter.type == "glow") {
                    const glow: GlowFilter & Partial<Pick<DropShadowFilter, "$hideObject" | "$angle" | "$distance">> = filter as GlowFilter;
                    const color: RGBA = [glow.$red / 255, glow.$green / 255, glow.$blue / 255, glow.$alpha];
                    if (glow.$inner || glow.$knockout || glow.$hideObject) {
                        dropShadowFilter2(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, color, glow.$blurX, glow.$blurY, glow.$angle ? glow.$angle / 180 * Math.PI : 0, glow.$distance || 0, glow.$strength, glow.$inner ? 1 : 0, glow.$knockout ? 0 : 1, glow.$hideObject ? 1 : 0);
                    } else { dropShadowFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, color, glow.$blurX, glow.$blurY, glow.$angle ? glow.$angle / 180 * Math.PI : 0, glow.$distance || 0, glow.$strength); }
                }
            }
            displayContext.putImageData(imageData, 0, 0);
            context.drawImage(displayBuffer.surface, offsetX + displayBoundsX, offsetY + displayBoundsY);
            if (hasBlendMode) { context.globalCompositeOperation = CanvasRenderer.defaultCompositeOp; }
        }
        CanvasRenderer.renderBufferPool_Filters.push(displayBuffer);
        return drawCalls;
    }
    public drawWithClip(displayObject: DisplayObject, context: sys.CanvasContext, offsetX: number, offsetY: number): number {
        let drawCalls: number = 0;
        const hasBlendMode: boolean = displayObject.$blendMode !== 0;
        const compositeOp: GlobalCompositeOperation = CanvasRenderer.blendModes[displayObject.$blendMode] || CanvasRenderer.defaultCompositeOp;
        const scrollRect: Rectangle | null = displayObject.$scrollRect || displayObject.$maskRect;
        const mask: DisplayObject | null = displayObject.$mask;
        if (mask) {
            const maskRenderMatrix: Matrix = mask.$getMatrix();
            if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) { return drawCalls; }
        }
        if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
            if (scrollRect) {
                context.save(); context.beginPath(); context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height); context.clip();
            }
            if (hasBlendMode) {
                context.globalCompositeOperation = compositeOp;
            }
            drawCalls += this.drawDisplayObject(displayObject, context, offsetX, offsetY);
            if (hasBlendMode) {
                context.globalCompositeOperation = CanvasRenderer.defaultCompositeOp;
            }
            if (scrollRect) {
                context.restore();
            }
            return drawCalls;
        }
        if (mask) {
            const maskRenderNode: sys.RenderNode | null = mask.$getRenderNode();
            const fill: sys.FillPath | undefined = (maskRenderNode as sys.GraphicsNode | null)?.drawData[0] as sys.FillPath | undefined;
            if ((!mask.$children || mask.$children.length == 0) && maskRenderNode && maskRenderNode.type == 3 && maskRenderNode.drawData.length == 1 && fill?.type == 1 && fill.fillAlpha == 1) {
                this.renderingMask = true;
                context.save();
                const maskMatrix: Matrix = Matrix.create();
                maskMatrix.copyFrom(mask.$getConcatenatedMatrix()); mask.$getConcatenatedMatrixAt(displayObject, maskMatrix); maskMatrix.prepend(1, 0, 0, 1, offsetX, offsetY);
                context.transform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                let calls: number = this.drawDisplayObject(mask, context, 0, 0);
                this.renderingMask = false;
                maskMatrix.$invertInto(maskMatrix);
                context.transform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                Matrix.release(maskMatrix);
                if (scrollRect) { context.beginPath(); context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height); context.clip(); }
                calls += this.drawDisplayObject(displayObject, context, offsetX, offsetY);
                context.restore(); return calls;
            }
        }
        const displayBounds: Rectangle = displayObject.$getOriginalBounds();
        const displayBoundsX: number = displayBounds.x;
        const displayBoundsY: number = displayBounds.y;
        const displayBoundsWidth: number = displayBounds.width;
        const displayBoundsHeight: number = displayBounds.height;
        if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
            return drawCalls;
        }
        const displayBuffer: sys.CanvasRenderBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
        const displayContext: sys.CanvasContext = displayBuffer.context;
        if (!displayContext) { return drawCalls + this.drawDisplayObject(displayObject, context, offsetX, offsetY); }
        drawCalls += this.drawDisplayObject(displayObject, displayContext, -displayBoundsX, -displayBoundsY);
        if (mask) {
            const maskRenderNode: sys.RenderNode | null = mask.$getRenderNode();
            const maskMatrix: Matrix = Matrix.create();
            maskMatrix.copyFrom(mask.$getConcatenatedMatrix()); mask.$getConcatenatedMatrixAt(displayObject, maskMatrix); maskMatrix.translate(-displayBoundsX, -displayBoundsY);
            if ((maskRenderNode && maskRenderNode.$getRenderCount() == 1) || mask.$displayList) {
                displayContext.globalCompositeOperation = "destination-in"; displayContext.save();
                displayContext.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                drawCalls += this.drawDisplayObject(mask, displayContext, 0, 0); displayContext.restore();
            } else {
                const maskBuffer: sys.CanvasRenderBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                const maskContext: sys.CanvasContext = maskBuffer.context;
                maskContext.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                drawCalls += this.drawDisplayObject(mask, maskContext, 0, 0);
                displayContext.globalCompositeOperation = "destination-in"; displayContext.drawImage(maskBuffer.surface, 0, 0);
                CanvasRenderer.renderBufferPool.push(maskBuffer);
            }
            Matrix.release(maskMatrix);
        }
        if (drawCalls > 0) {
            drawCalls++;
            if (hasBlendMode) {
                context.globalCompositeOperation = compositeOp;
            }
            if (scrollRect) {
                context.save(); context.beginPath(); context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height); context.clip();
            }
            context.drawImage(displayBuffer.surface, offsetX + displayBoundsX, offsetY + displayBoundsY);
            if (scrollRect) {
                context.restore();
            }
            if (hasBlendMode) {
                context.globalCompositeOperation = CanvasRenderer.defaultCompositeOp;
            }
        }
        CanvasRenderer.renderBufferPool.push(displayBuffer);
        return drawCalls;
    }
    public drawWithScrollRect(displayObject: DisplayObject, context: sys.CanvasContext, offsetX: number, offsetY: number): number {
        const scrollRect: Rectangle = (displayObject.$scrollRect || displayObject.$maskRect)!;
        if (scrollRect.isEmpty()) { return 0; }
        if (displayObject.$scrollRect) { offsetX -= scrollRect.x; offsetY -= scrollRect.y; }
        context.save(); context.beginPath(); context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height); context.clip();
        const drawCalls: number = this.drawDisplayObject(displayObject, context, offsetX, offsetY);
        context.restore(); return drawCalls;
    }
    public drawNodeToBuffer(node: sys.RenderNode, buffer: sys.RenderBuffer, matrix: Matrix, forHitTest?: boolean): void {
        const context: sys.CanvasContext = (buffer as sys.CanvasRenderBuffer).context;
        context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.renderNode(node, context, forHitTest);
    }
    public drawDisplayToBuffer(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix?: Matrix | null): number {
        const context: sys.CanvasContext = (buffer as sys.CanvasRenderBuffer).context;
        if (matrix) { context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty); }
        const node: sys.RenderNode | null = displayObject.$renderDirty ? displayObject.$getRenderNode() : displayObject.$renderNode;
        let drawCalls: number = 0;
        if (node) { drawCalls++; this.renderNode(node, context); }
        const children: DisplayObject[] | null = displayObject.$children;
        if (children) {
            for (let i: number = 0; i < children.length; i++) {
                const child: DisplayObject = children[i]!;
                switch (child.$renderMode) {
                    case 1: break;
                    case 2: drawCalls += this.drawWithFilter(child, context, 0, 0); break;
                    case 3: drawCalls += this.drawWithClip(child, context, 0, 0); break;
                    case 4: drawCalls += this.drawWithScrollRect(child, context, 0, 0); break;
                    default: drawCalls += this.drawDisplayObject(child, context, 0, 0); break;
                }
            }
        }
        return drawCalls;
    }
    public renderNode(node: sys.RenderNode, context: sys.CanvasContext, forHitTest?: boolean): number {
        // RenderNode.type ��ԭ���������ʱ�б��ֶΣ��������ݲ����ɶ�Ӧ���ඨ�塣
        switch (node.type) {
            case 1: return this.renderBitmap(node as sys.BitmapNode, context);
            case 2: this.renderText(node as sys.TextNode, context); return 1;
            case 3: return this.renderGraphics(node as sys.GraphicsNode, context, forHitTest);
            case 4: return this.renderGroup(node as sys.GroupNode, context);
            case 5: return this.renderMesh(node as sys.MeshNode, context);
            case 6: return this.renderNormalBitmap(node as sys.NormalBitmapNode, context);
            default: return 0;
        }
    }
    public renderNormalBitmap(node: sys.NormalBitmapNode, context: sys.CanvasContext): number {
        const image: BitmapData | null = node.image;
        if (!image || !image.source) { return 0; }
        const source: CanvasImageSource = image.source as CanvasImageSource;
        if (context.$imageSmoothingEnabled != node.smoothing) { context.imageSmoothingEnabled = context.$imageSmoothingEnabled = node.smoothing; }
        if (node.rotated) {
            const sourceX: number = node.sourceX;
            const sourceY: number = node.sourceY;
            const sourceHeight: number = node.sourceW;
            const sourceWidth: number = node.sourceH;
            const offsetX: number = node.drawX;
            const offsetY: number = node.drawY;
            const destHeight: number = node.drawW;
            const destWidth: number = node.drawH;
            context.save(); context.transform(0, -1, 1, 0, 0, destWidth);
            context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, offsetX + context.$offsetX, offsetY + context.$offsetY, destWidth, destHeight); context.restore();
        } else { context.drawImage(source, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX + context.$offsetX, node.drawY + context.$offsetY, node.drawW, node.drawH); }
        return 1;
    }
    public renderBitmap(node: sys.BitmapNode, context: sys.CanvasContext): number {
        const image: BitmapData | null = node.image;
        if (!image || !image.source) { return 0; }
        const source: CanvasImageSource = image.source as CanvasImageSource;
        if (context.$imageSmoothingEnabled != node.smoothing) {
            context.imageSmoothingEnabled = context.$imageSmoothingEnabled = node.smoothing;
        }
        const data: number[] = node.drawData;
        const length: number = data.length;
        let pos: number = 0;
        const m: Matrix | null = node.matrix;
        const blendMode: number | null = node.blendMode;
        const alpha: number = node.alpha;
        let saved: boolean = false;
        let offsetX: number | undefined;
        let offsetY: number | undefined;
        if (m) {
            context.save(); saved = true;
            if (context.$offsetX != 0 || context.$offsetY != 0) {
                context.translate(context.$offsetX, context.$offsetY); offsetX = context.$offsetX; offsetY = context.$offsetY; context.$offsetX = context.$offsetY = 0;
            }
            context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }
        if (blendMode) { context.globalCompositeOperation = CanvasRenderer.blendModes[blendMode]!; }
        let originAlpha: number | undefined;
        if (alpha == alpha) { originAlpha = context.globalAlpha; context.globalAlpha *= alpha; }
        let drawCalls: number = 0;
        const filter: ColorMatrixFilter | null = node.filter;
        if (filter && length == 8) {
            const sourceX: number = data[0]!;
            const sourceY: number = data[1]!;
            let sourceWidth: number = data[2]!;
            let sourceHeight: number = data[3]!;
            const drawX: number = data[4]!;
            const drawY: number = data[5]!;
            let destWidth: number = data[6]!;
            let destHeight: number = data[7]!;
            if (node.rotated) { sourceWidth = data[3]!; sourceHeight = data[2]!; destWidth = data[7]!; destHeight = data[6]!; }
            const displayBuffer: sys.CanvasRenderBuffer = this.createRenderBuffer(destWidth, destHeight);
            const displayContext: sys.CanvasContext = displayBuffer.context;
            drawCalls++;
            if (node.rotated) { context.transform(0, -1, 1, 0, 0, destWidth); }
            displayContext.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, destWidth, destHeight);
            drawCalls++;
            const imageData: ImageData = displayContext.getImageData(0, 0, destWidth, destHeight);
            colorFilter(imageData.data, destWidth, destHeight, filter.$matrix);
            displayContext.putImageData(imageData, 0, 0);
            context.drawImage(displayBuffer.surface, 0, 0, destWidth, destHeight, drawX + context.$offsetX, drawY + context.$offsetY, destWidth, destHeight);
            CanvasRenderer.renderBufferPool.push(displayBuffer);
        } else {
            while (pos < length) {
                drawCalls++;
                if (node.rotated) {
                    const sourceX: number = data[pos++]!;
                    const sourceY: number = data[pos++]!;
                    const sourceHeight: number = data[pos++]!;
                    const sourceWidth: number = data[pos++]!;
                    const drawX: number = data[pos++]!;
                    const drawY: number = data[pos++]!;
                    const destHeight: number = data[pos++]!;
                    const destWidth: number = data[pos++]!;
                    context.save(); context.transform(0, -1, 1, 0, 0, destWidth);
                    context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, drawX + context.$offsetX, drawY + context.$offsetY, destWidth, destHeight); context.restore();
                } else { context.drawImage(source, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]!, data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY, data[pos++]!, data[pos++]!); }
            }
        }
        if (saved) {
            context.restore();
        } else {
            if (blendMode) {
                context.globalCompositeOperation = CanvasRenderer.defaultCompositeOp;
            }
            if (alpha == alpha) {
                context.globalAlpha = originAlpha!;
            }
        }
        if (offsetX) {
            context.$offsetX = offsetX;
        }
        if (offsetY) {
            context.$offsetY = offsetY;
        }
        return drawCalls;
    }
    public renderMesh(_node: sys.MeshNode, _context: sys.CanvasContext): number {
        return 0;
    }
    public renderText(node: sys.TextNode, context: sys.CanvasContext): void {
        context.textAlign = "left"; context.textBaseline = "middle"; context.lineJoin = "round";
        const drawData: (number | string | ITextStyle)[] = node.drawData;
        let pos: number = 0;
        while (pos < drawData.length) {
            const x: number = drawData[pos++] as number;
            const y: number = drawData[pos++] as number;
            const text: string = drawData[pos++] as string;
            const format: ITextStyle = drawData[pos++] as ITextStyle;
            context.font = getFontString(node, format);
            const textColor: number = format.textColor == null ? node.textColor : format.textColor;
            const strokeColor: number = format.strokeColor == null ? node.strokeColor : format.strokeColor;
            const stroke: number = format.stroke == null ? node.stroke : format.stroke;
            context.fillStyle = toColorString(textColor); context.strokeStyle = toColorString(strokeColor);
            if (stroke) { context.lineWidth = stroke * 2; context.strokeText(text, x + context.$offsetX, y + context.$offsetY); }
            context.fillText(text, x + context.$offsetX, y + context.$offsetY);
        }
    }
    public renderGraphics(node: sys.GraphicsNode, context: sys.CanvasContext, forHitTest?: boolean): number {
        const drawData: sys.Path2D[] = node.drawData;
        const length: number = drawData.length;
        forHitTest = !!forHitTest;
        for (let i: number = 0; i < length; i++) {
            const path: sys.Path2D = drawData[i]!;
            switch (path.type) {
                case 1: {
                    const fillPath: sys.FillPath = path as sys.FillPath;
                    context.fillStyle = forHitTest ? CanvasRenderer.BLACK_COLOR : getRGBAString(fillPath.fillColor, fillPath.fillAlpha);
                    this.renderPath(path, context);
                    if (this.renderingMask) {
                        context.clip();
                    } else {
                        context.fill();
                    }
                    break;
                }
                case 2: {
                    const g: sys.GradientFillPath = path as sys.GradientFillPath;
                    context.fillStyle = forHitTest ? CanvasRenderer.BLACK_COLOR : getGradient(context, g.gradientType, g.colors, g.alphas, g.ratios, g.matrix);
                    context.save();
                    const m: Matrix = g.matrix;
                    this.renderPath(path, context); context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty); context.fill(); context.restore(); break;
                }
                case 3: {
                    const strokeFill: sys.StrokePath = path as sys.StrokePath;
                    const lineWidth: number = strokeFill.lineWidth;
                    context.lineWidth = lineWidth;
                    context.strokeStyle = forHitTest ? CanvasRenderer.BLACK_COLOR : getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha);
                    context.lineCap = CanvasRenderer.CAPS_STYLES[strokeFill.caps]; context.lineJoin = strokeFill.joints; context.miterLimit = strokeFill.miterLimit;
                    if (context.setLineDash) {
                        context.setLineDash(strokeFill.lineDash);
                    }
                    const isSpecialCaseWidth: boolean = lineWidth === 1 || lineWidth === 3;
                    if (isSpecialCaseWidth) {
                        context.translate(0.5, 0.5);
                    }
                    this.renderPath(path, context); context.stroke();
                    if (isSpecialCaseWidth) {
                        context.translate(-0.5, -0.5);
                    }
                    break;
                }
            }
        }
        return length == 0 ? 0 : 1;
    }
    public renderPath(path: sys.Path2D, context: sys.CanvasContext): void {
        context.beginPath();
        const data: number[] = path.$data;
        const commands: sys.PathCommand[] = path.$commands;
        let pos: number = 0;
        for (let commandIndex: number = 0; commandIndex < commands.length; commandIndex++) {
            const command: sys.PathCommand = commands[commandIndex]!;
            switch (command) {
                case 4: context.bezierCurveTo(data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY, data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY, data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY); break;
                case 3: context.quadraticCurveTo(data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY, data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY); break;
                case 2: context.lineTo(data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY); break;
                case 1: context.moveTo(data[pos++]! + context.$offsetX, data[pos++]! + context.$offsetY); break;
            }
        }
    }
    public renderGroup(groupNode: sys.GroupNode, context: sys.CanvasContext): number {
        const m: Matrix | null = groupNode.matrix;
        let saved: boolean = false;
        let offsetX: number | undefined;
        let offsetY: number | undefined;
        if (m) {
            context.save(); saved = true;
            if (context.$offsetX != 0 || context.$offsetY != 0) { context.translate(context.$offsetX, context.$offsetY); offsetX = context.$offsetX; offsetY = context.$offsetY; context.$offsetX = context.$offsetY = 0; }
            context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }
        let drawCalls: number = 0;
        const children: sys.RenderNode[] = groupNode.drawData;
        for (let i: number = 0; i < children.length; i++) { drawCalls += this.renderNode(children[i]!, context); }
        if (saved) { context.restore(); }
        if (offsetX) { context.$offsetX = offsetX; }
        if (offsetY) { context.$offsetY = offsetY; }
        return drawCalls;
    }
    public createRenderBuffer(width: number, height: number, useForFilters?: boolean): sys.CanvasRenderBuffer {
        let buffer: sys.CanvasRenderBuffer | undefined = useForFilters ? CanvasRenderer.renderBufferPool_Filters.pop() : CanvasRenderer.renderBufferPool.pop();
        if (buffer) {
            buffer.resize(width, height, true);
        } else {
            buffer = new runtime.sys.RenderBuffHelper.CanvasRenderBuffer!(width, height);
        }
        return buffer;
    }
}
__reflect(CanvasRenderer.prototype, "egret.CanvasRenderer");

export class Mesh extends Bitmap {
    public _verticesDirty: boolean = true;
    public _bounds: Rectangle = new Rectangle();
    public declare $renderNode: sys.MeshNode;
    public constructor(value?: Texture | null) { super(value); this.$renderNode = new runtime.sys.MeshNode(); }
    public override $updateRenderNode(): void {
        const image: BitmapData | null = this.$bitmapData;
        if (!image) { return; }
        const node: sys.MeshNode = this.$renderNode;
        node.smoothing = this.$smoothing; node.image = image; node.imageWidth = this.$sourceWidth; node.imageHeight = this.$sourceHeight;
        const destW: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
        const destH: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
        const tsX: number = destW / this.$textureWidth, tsY: number = destH / this.$textureHeight;
        const bitmapWidth: number = this.$bitmapWidth, bitmapHeight: number = this.$bitmapHeight;
        node.drawMesh(this.$bitmapX, this.$bitmapY, bitmapWidth, bitmapHeight, this.$offsetX * tsX, this.$offsetY * tsY, tsX * bitmapWidth, tsY * bitmapHeight);
    }
    public $updateVertices(): void {
        this._verticesDirty = true; this.$renderDirty = true;
        {
            const p: DisplayObjectContainer | null = this.$parent;
            if (p && !p.$cacheDirty) { p.$cacheDirty = true; p.$cacheDirtyUp(); }
            const maskedObject: DisplayObject | null = this.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) { maskedObject.$cacheDirty = true; maskedObject.$cacheDirtyUp(); }
        }
    }
    public override $measureContentBounds(bounds: Rectangle): void {
        if (this._verticesDirty) {
            this._verticesDirty = false;
            const node: sys.MeshNode = this.$renderNode;
            const vertices: number[] = node.vertices;
            if (vertices.length) {
                this._bounds.setTo(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                for (let i: number = 0, l: number = vertices.length; i < l; i += 2) {
                    const x: number = vertices[i]!, y: number = vertices[i + 1]!;
                    if (this._bounds.x > x) { this._bounds.x = x; }
                    if (this._bounds.width < x) { this._bounds.width = x; }
                    if (this._bounds.y > y) { this._bounds.y = y; }
                    if (this._bounds.height < y) { this._bounds.height = y; }
                }
                this._bounds.width -= this._bounds.x; this._bounds.height -= this._bounds.y;
            } else { this._bounds.setTo(0, 0, 0, 0); }
            node.bounds.copyFrom(this._bounds);
        }
        bounds.copyFrom(this._bounds);
    }
}
__reflect(Mesh.prototype, "egret.Mesh");

export class RenderTexture extends Texture {
    public $renderBuffer: sys.RenderBuffer | null;
    public constructor() {
        super();
        this.$renderBuffer = new runtime.sys.RenderBuffHelper.RenderBuffer!();
        const bitmapData: BitmapData = new BitmapData(this.$renderBuffer.surface as HTMLCanvasElement);
        bitmapData.$deleteSource = false; this._setBitmapData(bitmapData);
    }
    public drawToTexture(displayObject: DisplayObject, clipBounds?: Rectangle | null, scale: number = 1): boolean {
        if (clipBounds && (clipBounds.width == 0 || clipBounds.height == 0)) { return false; }
        const bounds: Rectangle = clipBounds || displayObject.$getOriginalBounds();
        if (bounds.width == 0 || bounds.height == 0) { return false; }
        scale /= Texture.$TextureScaleFactor;
        let width: number = (bounds.x + bounds.width) * scale, height: number = (bounds.y + bounds.height) * scale;
        if (clipBounds) { width = bounds.width * scale; height = bounds.height * scale; }
        const renderBuffer: sys.RenderBuffer | null = this.$renderBuffer;
        if (!renderBuffer) { return false; }
        renderBuffer.resize(width, height); this.$bitmapData!.width = width; this.$bitmapData!.height = height;
        {
            const matrix: Matrix = Matrix.create(); matrix.identity(); matrix.scale(scale, scale);
            if (clipBounds) { matrix.translate(-clipBounds.x, -clipBounds.y); }
            runtime.sys.RenderBuffHelper.systemRenderer!.render(displayObject, renderBuffer, matrix, true);
            Matrix.release(matrix);
        }
        this.$initData(0, 0, width, height, 0, 0, width, height, width, height); return true;
    }
    public override getPixel32(x: number, y: number): Uint8Array | Uint8ClampedArray | undefined {
        let data: Uint8Array | Uint8ClampedArray | undefined;
        if (this.$renderBuffer) {
            const scale: number = Texture.$TextureScaleFactor;
            x = Math.round(x / scale); y = Math.round(y / scale); data = this.$renderBuffer.getPixels(x, y, 1, 1);
        }
        return data;
    }
    public override dispose(): void { super.dispose(); this.$renderBuffer = null; }
}
__reflect(RenderTexture.prototype, "egret.RenderTexture");

export class Shape extends DisplayObject {
    public $graphics: Graphics;
    public constructor() { super(); this.$graphics = new Graphics(); this.$graphics.$setTarget(this); }
    public get graphics(): Graphics { return this.$graphics; }
    public override $measureContentBounds(bounds: Rectangle): void { this.$graphics.$measureContentBounds(bounds); }
    public override $hitTest(stageX: number, stageY: number): DisplayObject | null {
        let target: DisplayObject | null = super.$hitTest(stageX, stageY);
        if (target == this) { target = this.$graphics.$hitTest(stageX, stageY); } return target;
    }
    public override $onRemoveFromStage(): void { super.$onRemoveFromStage(); if (this.$graphics) { this.$graphics.$onRemoveFromStage(); } }
}
__reflect(Shape.prototype, "egret.Shape");

export class BitmapFont extends SpriteSheet {
    public firstCharHeight: number = 0;
    public charList: Record<string, BitmapFontGlyph | undefined>;
    public constructor(texture: Texture, config: string | BitmapFontConfig | null) {
        super(texture);
        if (typeof config == "string") { this.charList = this.parseConfig(config); }
        else if (config && config.hasOwnProperty("frames")) { this.charList = config.frames; }
        else { this.charList = {}; }
    }
    public override getTexture(name: string): Texture | null {
        let texture: Texture | undefined = this._textureMap[name];
        if (!texture) {
            const c: BitmapFontGlyph | undefined = this.charList[name];
            if (!c) { return null; }
            texture = this.createTexture(name, c.x, c.y, c.w, c.h, c.offX, c.offY, c.sourceW, c.sourceH); this._textureMap[name] = texture;
        }
        return texture;
    }
    public getConfig(name: string, key: keyof BitmapFontGlyph): number | undefined { return this.charList[name] ? this.charList[name]![key] : 0; }
    public _getFirstCharHeight(): number {
        if (this.firstCharHeight == 0) {
            let str: string;
            for (str in this.charList) {
                const c: BitmapFontGlyph | undefined = this.charList[str];
                if (c) {
                    let sourceH: number | undefined = c.sourceH;
                    if (sourceH === undefined) { const h: number = c.h === undefined ? 0 : c.h; const offY: number = c.offY === undefined ? 0 : c.offY; sourceH = h + offY; }
                    if (sourceH <= 0) { continue; } this.firstCharHeight = sourceH; break;
                }
            }
        }
        return this.firstCharHeight;
    }
    public parseConfig(fntText: string): Record<string, BitmapFontGlyph | undefined> {
        fntText = fntText.split("\r\n").join("\n");
        const lines: string[] = fntText.split("\n");
        const charsCount: number = this.getConfigByKey(lines[3]!, "count");
        const chars: Record<string, BitmapFontGlyph | undefined> = {};
        for (let i: number = 4; i < 4 + charsCount; i++) {
            const charText: string = lines[i]!;
            const letter: string = String.fromCharCode(this.getConfigByKey(charText, "id"));
            const c: BitmapFontGlyph = {
                x: this.getConfigByKey(charText, "x"), y: this.getConfigByKey(charText, "y"), w: this.getConfigByKey(charText, "width"), h: this.getConfigByKey(charText, "height"),
                offX: this.getConfigByKey(charText, "xoffset"), offY: this.getConfigByKey(charText, "yoffset"), xadvance: this.getConfigByKey(charText, "xadvance")
            };
            chars[letter] = c;
        }
        return chars;
    }
    public getConfigByKey(configText: string, key: string): number {
        const itemConfigTextList: string[] = configText.split(" ");
        for (let i: number = 0; i < itemConfigTextList.length; i++) {
            const itemConfigText: string = itemConfigTextList[i]!;
            if (key == itemConfigText.substring(0, key.length)) { const value: string = itemConfigText.substring(key.length + 1); return parseInt(value); }
        }
        return 0;
    }
}
__reflect(BitmapFont.prototype, "egret.BitmapFont");

export class BitmapText extends DisplayObject {
    public static EMPTY_FACTOR: number = 0.33;
    public $smoothing: boolean = Bitmap.defaultSmoothing;
    public $text: string = "";
    public $textFieldWidth: number = NaN;
    public $textLinesChanged: boolean = false;
    public $textFieldHeight: number = NaN;
    public $font: BitmapFont | null = null;
    public $fontStringChanged: boolean = false;
    public $lineSpacing: number = 0;
    public $letterSpacing: number = 0;
    public $textAlign: string = HorizontalAlign.LEFT;
    public $verticalAlign: string = VerticalAlign.TOP;
    public $textWidth: number = NaN;
    public $textHeight: number = NaN;
    public $textOffsetX: number = 0;
    public $textOffsetY: number = 0;
    public $textStartX: number = 0;
    public $textStartY: number = 0;
    public textLines: string[] = [];
    public $lineHeights: number[] = [];
    public declare $textLinesWidth: number[];
    public declare $renderNode: sys.BitmapNode;
    public constructor() {
        super();
        this.$renderNode = new runtime.sys.BitmapNode();
    }
    public get smoothing(): boolean { return this.$smoothing; }
    public set smoothing(value: boolean) {
        if (value == this.$smoothing) { return; } this.$smoothing = value;
        {
            const p: DisplayObjectContainer | null = this.$parent;
            if (p && !p.$cacheDirty) { p.$cacheDirty = true; p.$cacheDirtyUp(); }
            const maskedObject: DisplayObject | null = this.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) { maskedObject.$cacheDirty = true; maskedObject.$cacheDirtyUp(); }
        }
    }
    public get text(): string { return this.$text; }
    public set text(value: string) { this.$setText(value); }
    public $setText(value: unknown): boolean {
        const text: string = value == null ? "" : String(value);
        if (text == this.$text) { return false; } this.$text = text; this.$invalidateContentBounds(); return true;
    }
    public override $getWidth(): number { return isNaN(this.$textFieldWidth) ? this.$getContentBounds().width : this.$textFieldWidth; }
    public override $setWidth(value: number): boolean {
        if (value < 0 || value == this.$textFieldWidth) { return false; } this.$textFieldWidth = value; this.$invalidateContentBounds(); return true;
    }
    public $invalidateContentBounds(): void { this.$renderDirty = true; this.$textLinesChanged = true; this.$updateRenderNode(); }
    public override $getHeight(): number { return isNaN(this.$textFieldHeight) ? this.$getContentBounds().height : this.$textFieldHeight; }
    public override $setHeight(value: number): boolean {
        if (value < 0 || value == this.$textFieldHeight) { return false; } this.$textFieldHeight = value; this.$invalidateContentBounds(); return true;
    }
    public get font(): BitmapFont | null { return this.$font; }
    public set font(value: BitmapFont | null) { this.$setFont(value); }
    public $setFont(value: BitmapFont | null): boolean {
        if (this.$font == value) { return false; } this.$font = value; this.$fontStringChanged = true; this.$invalidateContentBounds(); return true;
    }
    public get lineSpacing(): number { return this.$lineSpacing; }
    public set lineSpacing(value: number) { this.$setLineSpacing(value); }
    public $setLineSpacing(value: number): boolean {
        if (this.$lineSpacing == value) { return false; } this.$lineSpacing = value; this.$invalidateContentBounds(); return true;
    }
    public get letterSpacing(): number { return this.$letterSpacing; }
    public set letterSpacing(value: number) { this.$setLetterSpacing(value); }
    public $setLetterSpacing(value: number): boolean {
        if (this.$letterSpacing == value) { return false; } this.$letterSpacing = value; this.$invalidateContentBounds(); return true;
    }
    public get textAlign(): string { return this.$textAlign; }
    public set textAlign(value: string) { this.$setTextAlign(value); }
    public $setTextAlign(value: string): boolean {
        if (this.$textAlign == value) { return false; } this.$textAlign = value; this.$invalidateContentBounds(); return true;
    }
    public get verticalAlign(): string { return this.$verticalAlign; }
    public set verticalAlign(value: string) { this.$setVerticalAlign(value); }
    public $setVerticalAlign(value: string): boolean {
        if (this.$verticalAlign == value) { return false; } this.$verticalAlign = value; this.$invalidateContentBounds(); return true;
    }
    public override $updateRenderNode(): void {
        const textLines: string[] = this.$getTextLines();
        const length: number = textLines.length;
        if (length == 0) {
            return;
        }
        const textLinesWidth: number[] = this.$textLinesWidth;
        const bitmapFont: BitmapFont = this.$font!;
        let node: sys.BitmapNode | undefined;
        {
            node = this.$renderNode;
            if (bitmapFont.$texture) { node.image = bitmapFont.$texture.$bitmapData; }
            node.smoothing = this.$smoothing;
        }
        const emptyHeight: number = bitmapFont._getFirstCharHeight(), emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
        const hasSetHeight: boolean = !isNaN(this.$textFieldHeight);
        const textWidth: number = this.$textWidth, textFieldWidth: number = this.$textFieldWidth, textFieldHeight: number = this.$textFieldHeight;
        const align: string = this.$textAlign;
        let yPos: number = this.$textOffsetY + this.$textStartY;
        const lineHeights: number[] = this.$lineHeights;
        for (let i: number = 0; i < length; i++) {
            const lineHeight: number = lineHeights[i]!;
            if (hasSetHeight && i > 0 && yPos + lineHeight > textFieldHeight) { break; }
            const line: string = textLines[i]!;
            const len: number = line.length;
            let xPos: number = this.$textOffsetX;
            if (align != HorizontalAlign.LEFT) {
                const countWidth: number = textFieldWidth > textWidth ? textFieldWidth : textWidth;
                if (align == HorizontalAlign.RIGHT) { xPos += countWidth - textLinesWidth[i]!; }
                else if (align == HorizontalAlign.CENTER) { xPos += Math.floor((countWidth - textLinesWidth[i]!) / 2); }
            }
            for (let j: number = 0; j < len; j++) {
                const character: string = line.charAt(j);
                const texture: Texture | null = bitmapFont.getTexture(character);
                if (!texture) { if (character == " ") { xPos += emptyWidth; } else { $warn(1046, character); } continue; }
                const bitmapWidth: number = texture.$bitmapWidth, bitmapHeight: number = texture.$bitmapHeight;
                {
                    node!.imageWidth = texture.$sourceWidth; node!.imageHeight = texture.$sourceHeight;
                    node!.drawImage(texture.$bitmapX, texture.$bitmapY, bitmapWidth, bitmapHeight, xPos + texture.$offsetX, yPos + texture.$offsetY, texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight());
                }
                xPos += (bitmapFont.getConfig(character, "xadvance") || texture.$getTextureWidth()) + this.$letterSpacing;
            }
            yPos += lineHeight + this.$lineSpacing;
        }
    }
    public override $measureContentBounds(bounds: Rectangle): void {
        const lines: string[] = this.$getTextLines();
        if (lines.length == 0) { bounds.setEmpty(); } else { bounds.setTo(this.$textOffsetX + this.$textStartX, this.$textOffsetY + this.$textStartY, this.$textWidth - this.$textOffsetX, this.$textHeight - this.$textOffsetY); }
    }
    public get textWidth(): number { this.$getTextLines(); return this.$textWidth; }
    public get textHeight(): number { this.$getTextLines(); return this.$textHeight; }
    public $getTextLines(): string[] {
        if (!this.$textLinesChanged) { return this.textLines; }
        const textLines: string[] = [];
        this.textLines = textLines;
        const textLinesWidth: number[] = [];
        this.$textLinesWidth = textLinesWidth; this.$textLinesChanged = false;
        const lineHeights: number[] = [];
        this.$lineHeights = lineHeights;
        if (!this.$text || !this.$font) { this.$textWidth = 0; this.$textHeight = 0; return textLines; }
        const lineSpacing: number = this.$lineSpacing, letterSpacing: number = this.$letterSpacing;
        let textWidth: number = 0, textHeight: number = 0;
        const textOffsetX: number = 0, textOffsetY: number = 0;
        const hasWidthSet: boolean = !isNaN(this.$textFieldWidth);
        const textFieldWidth: number = this.$textFieldWidth, textFieldHeight: number = this.$textFieldHeight;
        const bitmapFont: BitmapFont = this.$font;
        const emptyHeight: number = bitmapFont._getFirstCharHeight(), emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
        const text: string = this.$text;
        const textArr: string[] = text.split(/(?:\r\n|\r|\n)/);
        let isFirstLine: boolean = true, isFirstChar: boolean = false, isLastChar: boolean = false;
        let lineHeight: number = 0, xPos: number = 0;
        for (let i: number = 0; i < textArr.length; i++) {
            let line: string = textArr[i]!;
            let len: number = line.length;
            lineHeight = 0; xPos = 0; isFirstChar = true; isLastChar = false;
            for (let j: number = 0; j < len; j++) {
                if (!isFirstChar) { xPos += letterSpacing; }
                const character: string = line.charAt(j);
                let textureWidth: number, textureHeight: number;
                const texture: Texture | null = bitmapFont.getTexture(character);
                if (!texture) {
                    if (character == " ") { textureWidth = emptyWidth; textureHeight = emptyHeight; }
                    else { $warn(1046, character); if (isFirstChar) { isFirstChar = false; } continue; }
                } else {
                    textureWidth = texture.$getTextureWidth();
                    textureHeight = texture.$getTextureHeight();
                }
                if (isFirstChar) { isFirstChar = false; }
                if (isFirstLine) { isFirstLine = false; }
                if (hasWidthSet && j > 0 && xPos + textureWidth > textFieldWidth) {
                    if (!setLineData(line.substring(0, j))) { break; }
                    line = line.substring(j); len = line.length; j = 0;
                    xPos = j == len - 1 ? textureWidth : bitmapFont.getConfig(character, "xadvance") || textureWidth;
                    lineHeight = textureHeight; continue;
                }
                xPos += j == len - 1 ? textureWidth : bitmapFont.getConfig(character, "xadvance") || textureWidth;
                lineHeight = Math.max(textureHeight, lineHeight);
            }
            if (textFieldHeight && i > 0 && textHeight > textFieldHeight) { break; }
            isLastChar = true;
            if (!setLineData(line)) { break; }
        }
        function setLineData(str: string): boolean {
            if (textFieldHeight && textLines.length > 0 && textHeight > textFieldHeight) { return false; }
            textHeight += lineHeight + lineSpacing;
            if (!isFirstChar && !isLastChar) { xPos -= letterSpacing; }
            textLines.push(str); lineHeights.push(lineHeight); textLinesWidth.push(xPos); textWidth = Math.max(xPos, textWidth); return true;
        }
        textHeight -= lineSpacing;
        this.$textWidth = textWidth; this.$textHeight = textHeight; this.$textOffsetX = textOffsetX; this.$textOffsetY = textOffsetY; this.$textStartX = this.$textStartY = 0;
        let alignType: string;
        if (textFieldWidth > textWidth) {
            alignType = this.$textAlign;
            if (alignType == HorizontalAlign.RIGHT) { this.$textStartX = textFieldWidth - textWidth; }
            else if (alignType == HorizontalAlign.CENTER) { this.$textStartX = Math.floor((textFieldWidth - textWidth) / 2); }
        }
        if (textFieldHeight > textHeight) {
            alignType = this.$verticalAlign;
            if (alignType == VerticalAlign.BOTTOM) { this.$textStartY = textFieldHeight - textHeight; }
            else if (alignType == VerticalAlign.MIDDLE) { this.$textStartY = Math.floor((textFieldHeight - textHeight) / 2); }
        }
        return textLines;
    }
}
__reflect(BitmapText.prototype, "egret.BitmapText");

export class TextField extends DisplayObject {
    public static default_fontFamily: string = "Arial";
    public static default_size: number = 30;
    public static default_textColor: number = 0xffffff;
    public $inputEnabled: boolean = false;
    public inputUtils: InputController | null = null;
    public $graphicsNode: sys.GraphicsNode | null = null;
    public isFlow: boolean = false;
    public textArr: ITextElement[] = [];
    public linesArr: TextLine[] = [];
    public $isTyping: boolean = false;
    public textNode: sys.TextNode;
    public $TextField: TextFieldState;

    public constructor() {
        super();
        const textNode: sys.TextNode = new runtime.sys.TextNode();
        textNode.fontFamily = TextField.default_fontFamily;
        this.textNode = textNode;
        this.$renderNode = textNode;
        this.$TextField = {
            0: TextField.default_size, 1: 0, 2: TextField.default_textColor, 3: NaN, 4: NaN,
            5: 0, 6: 0, 7: 0, 8: TextField.default_fontFamily, 9: "left", 10: "top",
            11: "#ffffff", 12: "", 13: "", 14: [], 15: false, 16: false, 17: true,
            18: false, 19: false, 20: false, 21: 0, 22: 0, 23: 0,
            24: TextFieldType.DYNAMIC, 25: 0x000000, 26: "#000000", 27: 0,
            28: -1, 29: 0, 30: false, 31: false, 32: 0x000000, 33: false,
            34: 0xffffff, 35: null, 36: null, 37: TextFieldInputType.TEXT, 38: false
        };
    }
    public isInput(): boolean { return this.$TextField[24] == TextFieldType.INPUT; }
    public override $setTouchEnabled(value: boolean): void {
        super.$setTouchEnabled(value);
        if (this.isInput()) { this.$inputEnabled = true; }
    }
    public get fontFamily(): string { return this.$TextField[8]; }
    public set fontFamily(value: string) { this.$setFontFamily(value); }
    public $setFontFamily(value: string): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[8] == value) { return false; }
        values[8] = value;
        this.invalidateFontString();
        return true;
    }
    public get size(): number { return this.$TextField[0]; }
    public set size(value: number) { this.$setSize(value); }
    public $setSize(value: number): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[0] == value) { return false; }
        values[0] = value;
        this.invalidateFontString();
        return true;
    }
    public get bold(): boolean { return this.$TextField[15]; }
    public set bold(value: boolean) { this.$setBold(value); }
    public $setBold(value: boolean): boolean {
        const values: TextFieldState = this.$TextField;
        if (value == values[15]) { return false; }
        values[15] = value;
        this.invalidateFontString();
        return true;
    }
    public get italic(): boolean { return this.$TextField[16]; }
    public set italic(value: boolean) { this.$setItalic(value); }
    public $setItalic(value: boolean): boolean {
        const values: TextFieldState = this.$TextField;
        if (value == values[16]) { return false; }
        values[16] = value;
        this.invalidateFontString();
        return true;
    }
    public invalidateFontString(): void {
        this.$TextField[17] = true;
        this.$invalidateTextField();
    }
    public get textAlign(): string { return this.$TextField[9]; }
    public set textAlign(value: string) { this.$setTextAlign(value); }
    public $setTextAlign(value: string): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[9] == value) { return false; }
        values[9] = value;
        this.$invalidateTextField();
        return true;
    }
    public get verticalAlign(): string { return this.$TextField[10]; }
    public set verticalAlign(value: string) { this.$setVerticalAlign(value); }
    public $setVerticalAlign(value: string): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[10] == value) { return false; }
        values[10] = value;
        this.$invalidateTextField();
        return true;
    }
    public get lineSpacing(): number { return this.$TextField[1]; }
    public set lineSpacing(value: number) { this.$setLineSpacing(value); }
    public $setLineSpacing(value: number): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[1] == value) { return false; }
        values[1] = value;
        this.$invalidateTextField();
        return true;
    }
    public get textColor(): number { return this.$TextField[2]; }
    public set textColor(value: number) { this.$setTextColor(value); }
    public $setTextColor(value: number): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[2] == value) { return false; }
        values[2] = value;
        if (this.inputUtils) { this.inputUtils._setColor(values[2]); }
        this.$invalidateTextField();
        return true;
    }
    public get wordWrap(): boolean { return this.$TextField[19]; }
    public set wordWrap(value: boolean) { this.$setWordWrap(value); }
    public $setWordWrap(value: boolean): void {
        const values: TextFieldState = this.$TextField;
        if (value == values[19] || values[20]) { return; }
        values[19] = value;
        this.$invalidateTextField();
    }
    public get type(): string { return this.$TextField[24]; }
    public set type(value: string) { this.$setType(value); }
    public $setType(value: string): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[24] == value) { return false; }
        values[24] = value;
        if (value == TextFieldType.INPUT) {
            if (isNaN(values[3])) { this.$setWidth(100); }
            if (isNaN(values[4])) { this.$setHeight(30); }
            this.$setTouchEnabled(true);
            if (this.inputUtils == null) { this.inputUtils = new InputController(); }
            this.inputUtils.init(this);
            this.$invalidateTextField();
            if (this.$stage) { this.inputUtils._addStageText(); }
        } else {
            if (this.inputUtils) {
                this.inputUtils._removeStageText();
                this.inputUtils = null;
            }
            this.$setTouchEnabled(false);
        }
        return true;
    }
    public get inputType(): string { return this.$TextField[37]; }
    public set inputType(value: string) {
        if (this.$TextField[37] == value) { return; }
        this.$TextField[37] = value;
    }
    public get text(): string { return this.$getText(); }
    public set text(value: string) { this.$setText(value); }
    public $getText(): string {
        if (this.isInput()) { return this.inputUtils!._getText(); }
        return this.$TextField[13];
    }
    public $setBaseText(value: unknown): boolean {
        const normalized: string = value == null ? "" : String(value);
        this.isFlow = false;
        const values: TextFieldState = this.$TextField;
        if (values[13] == normalized) { return false; }
        this.$invalidateTextField();
        values[13] = normalized;
        const text: string = values[20] ? this.changeToPassText(normalized) : normalized;
        this.setMiddleStyle([{ text: text }]);
        return true;
    }
    public $setText(value: unknown): boolean {
        const result: boolean = this.$setBaseText(value == null ? "" : value);
        if (this.inputUtils) { this.inputUtils._setText(this.$TextField[13]); }
        return result;
    }
    public get displayAsPassword(): boolean { return this.$TextField[20]; }
    public set displayAsPassword(value: boolean) { this.$setDisplayAsPassword(value); }
    public $setDisplayAsPassword(value: boolean): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[20] == value) { return false; }
        values[20] = value;
        this.$invalidateTextField();
        const text: string = value ? this.changeToPassText(values[13]) : values[13];
        this.setMiddleStyle([{ text: text }]);
        return true;
    }
    public get strokeColor(): number { return this.$TextField[25]; }
    public set strokeColor(value: number) { this.$setStrokeColor(value); }
    public $setStrokeColor(value: number): boolean {
        const values: TextFieldState = this.$TextField;
        if (values[25] == value) { return false; }
        this.$invalidateTextField();
        values[25] = value;
        values[26] = toColorString(value);
        return true;
    }
    public get stroke(): number { return this.$TextField[27]; }
    public set stroke(value: number) { this.$setStroke(value); }
    public $setStroke(value: number): boolean {
        if (this.$TextField[27] == value) { return false; }
        this.$invalidateTextField();
        this.$TextField[27] = value;
        return true;
    }
    public get maxChars(): number { return this.$TextField[21]; }
    public set maxChars(value: number) { this.$setMaxChars(value); }
    public $setMaxChars(value: number): boolean {
        if (this.$TextField[21] == value) { return false; }
        this.$TextField[21] = value;
        return true;
    }
    public get scrollV(): number { return Math.min(Math.max(this.$TextField[28], 1), this.maxScrollV); }
    public set scrollV(value: number) {
        value = Math.max(value, 1);
        if (value == this.$TextField[28]) { return; }
        this.$TextField[28] = value;
        this.$invalidateTextField();
    }
    public get maxScrollV(): number {
        this.$getLinesArr();
        return Math.max(this.$TextField[29] - TextFieldUtils.$getScrollNum(this) + 1, 1);
    }
    public get selectionBeginIndex(): number { return 0; }
    public get selectionEndIndex(): number { return 0; }
    public get caretIndex(): number { return 0; }
    public $setSelection(_beginIndex: number, _endIndex: number): boolean { return false; }
    public $getLineHeight(): number { return this.$TextField[1] + this.$TextField[0]; }
    public get numLines(): number { this.$getLinesArr(); return this.$TextField[29]; }
    public get multiline(): boolean { return this.$TextField[30]; }
    public set multiline(value: boolean) { this.$setMultiline(value); }
    public $setMultiline(value: boolean): boolean {
        if (this.$TextField[30] == value) { return false; }
        this.$TextField[30] = value;
        this.$invalidateTextField();
        return true;
    }
    public get restrict(): string | null {
        const values: TextFieldState = this.$TextField;
        let str: string | null = null;
        if (values[35] != null) { str = values[35]; }
        if (values[36] != null) {
            if (str == null) { str = ""; }
            str += "^" + values[36];
        }
        return str;
    }
    public set restrict(value: string | null) {
        const values: TextFieldState = this.$TextField;
        if (value == null) { values[35] = null; values[36] = null; return; }
        let index: number = -1;
        while (index < value.length) {
            index = value.indexOf("^", index);
            if (index == 0) { break; }
            else if (index > 0) {
                if (value.charAt(index - 1) != "\\") { break; }
                index++;
            } else { break; }
        }
        if (index == 0) { values[35] = null; values[36] = value.substring(index + 1); }
        else if (index > 0) { values[35] = value.substring(0, index); values[36] = value.substring(index + 1); }
        else { values[35] = value; values[36] = null; }
    }
    public override $setWidth(value: number): boolean {
        const values: TextFieldState = this.$TextField;
        if (isNaN(value)) {
            if (isNaN(values[3])) { return false; }
            values[3] = NaN;
        } else {
            if (values[3] == value) { return false; }
            values[3] = value;
        }
        value = +value;
        if (value < 0) { return false; }
        this.$invalidateTextField();
        return true;
    }
    public override $setHeight(value: number): boolean {
        const values: TextFieldState = this.$TextField;
        if (isNaN(value)) {
            if (isNaN(values[4])) { return false; }
            values[4] = NaN;
        } else {
            if (values[4] == value) { return false; }
            values[4] = value;
        }
        value = +value;
        if (value < 0) { return false; }
        this.$invalidateTextField();
        return true;
    }
    public override $getWidth(): number {
        const values: TextFieldState = this.$TextField;
        return isNaN(values[3]) ? this.$getContentBounds().width : values[3];
    }
    public override $getHeight(): number {
        const values: TextFieldState = this.$TextField;
        return isNaN(values[4]) ? this.$getContentBounds().height : values[4];
    }
    public get border(): boolean { return this.$TextField[31]; }
    public set border(value: boolean) { this.$setBorder(value); }
    public $setBorder(value: boolean): void {
        value = !!value;
        if (this.$TextField[31] == value) { return; }
        this.$TextField[31] = value;
        this.$invalidateTextField();
    }
    public get borderColor(): number { return this.$TextField[32]; }
    public set borderColor(value: number) { this.$setBorderColor(value); }
    public $setBorderColor(value: number): void {
        value = +value || 0;
        if (this.$TextField[32] == value) { return; }
        this.$TextField[32] = value;
        this.$invalidateTextField();
    }
    public get background(): boolean { return this.$TextField[33]; }
    public set background(value: boolean) { this.$setBackground(value); }
    public $setBackground(value: boolean): void {
        if (this.$TextField[33] == value) { return; }
        this.$TextField[33] = value;
        this.$invalidateTextField();
    }
    public get backgroundColor(): number { return this.$TextField[34]; }
    public set backgroundColor(value: number) { this.$setBackgroundColor(value); }
    public $setBackgroundColor(value: number): void {
        if (this.$TextField[34] == value) { return; }
        this.$TextField[34] = value;
        this.$invalidateTextField();
    }
    public fillBackground(lines?: (number | undefined)[]): void {
        let graphics: sys.GraphicsNode | null = this.$graphicsNode;
        if (graphics) { graphics.clear(); }
        const values: TextFieldState = this.$TextField;
        if (values[33] || values[31] || (lines && lines.length > 0)) {
            if (!graphics) {
                graphics = this.$graphicsNode = new runtime.sys.GraphicsNode();
                {
                    const groupNode: sys.GroupNode = new runtime.sys.GroupNode();
                    groupNode.addNode(graphics);
                    groupNode.addNode(this.textNode);
                    this.$renderNode = groupNode;
                }
            }
            let strokePath: sys.StrokePath | undefined;
            if (values[33]) {
                const fillPath: sys.FillPath = graphics.beginFill(values[34]);
                fillPath.drawRect(0, 0, this.$getWidth(), this.$getHeight());
            }
            if (values[31]) {
                strokePath = graphics.lineStyle(1, values[32]);
                strokePath.drawRect(0, 0, this.$getWidth() - 1, this.$getHeight() - 1);
            }
            if (lines && lines.length > 0) {
                const textColor: number = values[2];
                let lastColor: number = -1;
                const length: number = lines.length;
                for (let i: number = 0; i < length; i += 4) {
                    const x: number = lines[i]!;
                    const y: number = lines[i + 1]!;
                    const w: number = lines[i + 2]!;
                    const color: number = lines[i + 3] || textColor;
                    if (lastColor < 0 || lastColor != color) {
                        lastColor = color;
                        strokePath = graphics.lineStyle(2, color, 1, CapsStyle.NONE);
                    }
                    strokePath!.moveTo(x, y);
                    strokePath!.lineTo(x + w, y);
                }
            }
        }
        if (graphics) {
            const bounds: Rectangle = this.$getRenderBounds();
            graphics.x = bounds.x; graphics.y = bounds.y;
            graphics.width = bounds.width; graphics.height = bounds.height;
            Rectangle.release(bounds);
        }
    }
    public setFocus(): void {
        if (this.type == TextFieldType.INPUT && this.$stage) { this.inputUtils!.$onFocus(); }
    }
    public override $onRemoveFromStage(): void {
        super.$onRemoveFromStage();
        this.removeEvent();
        if (this.isInput()) { this.inputUtils!._removeStageText(); }
        if (this.textNode) {
            this.textNode.clean();
        }
    }
    public override $onAddToStage(stage: Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);
        this.addEvent();
        if (this.isInput()) { this.inputUtils!._addStageText(); }
    }
    public $invalidateTextField(): void {
        const self: this = this;
        self.$renderDirty = true;
        self.$TextField[18] = true;
        self.$TextField[38] = true;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) { p.$cacheDirty = true; p.$cacheDirtyUp(); }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) { maskedObject.$cacheDirty = true; maskedObject.$cacheDirtyUp(); }
        }
    }
    public $getRenderBounds(): Rectangle {
        const bounds: Rectangle = this.$getContentBounds();
        const tmpBounds: Rectangle = Rectangle.create();
        tmpBounds.copyFrom(bounds);
        if (this.$TextField[31]) { tmpBounds.width += 2; tmpBounds.height += 2; }
        const strokeDouble: number = this.$TextField[27] * 2;
        if (strokeDouble > 0) { tmpBounds.width += strokeDouble * 2; tmpBounds.height += strokeDouble * 2; }
        tmpBounds.x -= strokeDouble + 2;
        tmpBounds.y -= strokeDouble + 2;
        tmpBounds.width = Math.ceil(tmpBounds.width) + 4;
        tmpBounds.height = Math.ceil(tmpBounds.height) + 4;
        return tmpBounds;
    }
    public override $measureContentBounds(bounds: Rectangle): void {
        this.$getLinesArr();
        let w: number = 0;
        let h: number = 0;
        {
            w = !isNaN(this.$TextField[3]) ? this.$TextField[3] : this.$TextField[5];
            h = !isNaN(this.$TextField[4]) ? this.$TextField[4] : TextFieldUtils.$getTextHeight(this);
        }
        bounds.setTo(0, 0, w, h);
    }
    public override $updateRenderNode(): void {
        if (this.isInput()) {
            this.inputUtils!._updateProperties();
            if (this.$isTyping) { this.fillBackground(); return; }
        } else if (this.$TextField[3] == 0) {
            const graphics: sys.GraphicsNode | null = this.$graphicsNode;
            if (graphics) { graphics.clear(); }
            return;
        }
        const underLines: (number | undefined)[] = this.drawText();
        this.fillBackground(underLines);
        const bounds: Rectangle = this.$getRenderBounds();
        const node: sys.TextNode = this.textNode;
        node.x = bounds.x; node.y = bounds.y;
        node.width = Math.ceil(bounds.width); node.height = Math.ceil(bounds.height);
        Rectangle.release(bounds);
    }
    public get textFlow(): ITextElement[] { return this.textArr; }
    public set textFlow(textArr: ITextElement[] | null) {
        this.isFlow = true;
        let text: string = "";
        if (textArr == null) { textArr = []; }
        for (let i: number = 0; i < textArr.length; i++) {
            const element: ITextElement = textArr[i]!;
            text += element.text;
        }
        if (this.$TextField[20]) { this.$setBaseText(text); }
        else {
            this.$TextField[13] = text;
            this.setMiddleStyle(textArr);
        }
    }
    public changeToPassText(text: string): string {
        if (!this.$TextField[20]) { return text; }
        let passText: string = "";
        for (let i: number = 0, num: number = text.length; i < num; i++) {
            switch (text.charAt(i)) {
                case '\n': passText += "\n"; break;
                case '\r': break;
                default: passText += '*';
            }
        }
        return passText;
    }
    public setMiddleStyle(textArr: ITextElement[]): void {
        this.$TextField[18] = true;
        this.$TextField[38] = true;
        this.textArr = textArr;
        this.$invalidateTextField();
    }
    public get textWidth(): number {
        this.$getLinesArr();
        return this.$TextField[5];
    }
    public get textHeight(): number {
        this.$getLinesArr();
        return TextFieldUtils.$getTextHeight(this);
    }
    public appendText(text: string): void { this.appendElement({ text: text }); }
    public appendElement(element: ITextElement): void {
        const text: string = this.$TextField[13] + element.text;
        if (this.$TextField[20]) {
            this.$setBaseText(text);
        } else {
            this.$TextField[13] = text;
            this.textArr.push(element);
            this.setMiddleStyle(this.textArr);
        }
    }
    public $getLinesArr(): TextLine[] | undefined {
        return this.$getLinesArr2();
    }
    public $getLinesArr2(): TextLine[] {
        const values: TextFieldState = this.$TextField;
        if (!values[18]) { return this.linesArr; }
        values[18] = false;
        const text2Arr: ITextElement[] = this.textArr;
        this.linesArr.length = 0;
        values[6] = 0; values[5] = 0;
        const textFieldWidth: number = values[3];
        if (!isNaN(textFieldWidth) && textFieldWidth == 0) {
            values[29] = 0;
            return [{ width: 0, height: 0, charNum: 0, elements: [], hasNextLine: false }];
        }
        const linesArr: TextLine[] = this.linesArr;
        let lineW: number = 0;
        let lineCharNum: number = 0;
        let lineH: number = 0;
        let lineCount: number = 0;
        let lineElement: TextLine | undefined;
        for (let i: number = 0, text2ArrLength: number = text2Arr.length; i < text2ArrLength; i++) {
            const element: ITextElement = text2Arr[i]!;
            if (!element.text) {
                if (lineElement) {
                    lineElement.width = lineW; lineElement.height = lineH; lineElement.charNum = lineCharNum;
                    values[5] = Math.max(values[5], lineW); values[6] += lineH;
                }
                continue;
            }
            element.style = element.style || {};
            const text: string = element.text.toString();
            const textArr: string[] = text.split(/(?:\r\n|\r|\n)/);
            for (let j: number = 0, textArrLength: number = textArr.length; j < textArrLength; j++) {
                if (linesArr[lineCount] == null) {
                    lineElement = { width: 0, height: 0, elements: [], charNum: 0, hasNextLine: false };
                    linesArr[lineCount] = lineElement;
                    lineW = 0; lineH = 0; lineCharNum = 0;
                }
                if (values[24] == TextFieldType.INPUT) { lineH = values[0]; }
                else { lineH = Math.max(lineH, element.style.size || values[0]); }
                let isNextLine: boolean = true;
                if (textArr[j] == "") {
                    if (j == textArrLength - 1) { isNextLine = false; }
                } else {
                    let w: number = measureTextWidth(textArr[j]!, values, element.style);
                    if (isNaN(textFieldWidth)) {
                        lineW += w;
                        lineCharNum += textArr[j]!.length;
                        lineElement!.elements.push({ width: w, text: textArr[j]!, style: element.style });
                        if (j == textArrLength - 1) { isNextLine = false; }
                    } else if (lineW + w <= textFieldWidth) {
                        lineElement!.elements.push({ width: w, text: textArr[j]!, style: element.style });
                        lineW += w;
                        lineCharNum += textArr[j]!.length;
                        if (j == textArrLength - 1) { isNextLine = false; }
                    } else {
                        let k: number = 0;
                        let ww: number = 0;
                        const word: string = textArr[j]!;
                        const words: string[] = values[19] ? word.split(SplitRegexHelper.SplitRegex) : word.match(/./g)!;
                        const wl: number = words.length;
                        let charNum: number = 0;
                        for (; k < wl; k++) {
                            let codeLen: number = words[k]!.length;
                            let has4BytesUnicode: boolean = false;
                            if (codeLen == 1 && k < wl - 1) {
                                const charCodeHigh: number = words[k]!.charCodeAt(0);
                                const charCodeLow: number = words[k + 1]!.charCodeAt(0);
                                if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) {
                                    const realWord: string = words[k]! + words[k + 1]!;
                                    codeLen = 2; has4BytesUnicode = true;
                                    w = measureTextWidth(realWord, values, element.style);
                                } else { w = measureTextWidth(words[k]!, values, element.style); }
                            } else { w = measureTextWidth(words[k]!, values, element.style); }
                            if (lineW != 0 && lineW + w > textFieldWidth && lineW + k != 0) { break; }
                            if (ww + w > textFieldWidth) {
                                const words2: string[] = words[k]!.match(/./g)!;
                                for (let k2: number = 0, wl2: number = words2.length; k2 < wl2; k2++) {
                                    codeLen = words2[k2]!.length;
                                    let has4BytesUnicode2: boolean = false;
                                    if (codeLen == 1 && k2 < wl2 - 1) {
                                        const charCodeHigh: number = words2[k2]!.charCodeAt(0);
                                        const charCodeLow: number = words2[k2 + 1]!.charCodeAt(0);
                                        if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) {
                                            const realWord: string = words2[k2]! + words2[k2 + 1]!;
                                            codeLen = 2; has4BytesUnicode2 = true;
                                            w = measureTextWidth(realWord, values, element.style);
                                        } else { w = measureTextWidth(words2[k2]!, values, element.style); }
                                    } else { w = measureTextWidth(words2[k2]!, values, element.style); }
                                    if (k2 > 0 && lineW + w > textFieldWidth) { break; }
                                    charNum += codeLen; ww += w; lineW += w; lineCharNum += charNum;
                                    if (has4BytesUnicode2) { k2++; }
                                }
                            } else { charNum += codeLen; ww += w; lineW += w; lineCharNum += charNum; }
                            if (has4BytesUnicode) { k++; }
                        }
                        if (k > 0) {
                            lineElement!.elements.push({ width: ww, text: word.substring(0, charNum), style: element.style });
                            const leftWord: string = word.substring(charNum);
                            let m: number;
                            const lwleng: number = leftWord.length;
                            for (m = 0; m < lwleng; m++) { if (leftWord.charAt(m) != " ") { break; } }
                            textArr[j] = leftWord.substring(m);
                        }
                        if (textArr[j] != "") { j--; isNextLine = false; }
                    }
                }
                if (isNextLine) { lineCharNum++; lineElement!.hasNextLine = true; }
                if (j < textArr.length - 1) {
                    lineElement!.width = lineW; lineElement!.height = lineH; lineElement!.charNum = lineCharNum;
                    values[5] = Math.max(values[5], lineW); values[6] += lineH;
                    lineCount++;
                }
            }
            if (i == text2Arr.length - 1 && lineElement) {
                lineElement.width = lineW; lineElement.height = lineH; lineElement.charNum = lineCharNum;
                values[5] = Math.max(values[5], lineW); values[6] += lineH;
            }
        }
        values[29] = linesArr.length;
        return linesArr;
    }
    public $setIsTyping(value: boolean): void {
        this.$isTyping = value;
        this.$invalidateTextField();
    }
    public drawText(): (number | undefined)[] {
        const node: sys.TextNode = this.textNode;
        const values: TextFieldState = this.$TextField;
        node.bold = values[15]; node.fontFamily = values[8] || TextField.default_fontFamily;
        node.italic = values[16]; node.size = values[0]; node.stroke = values[27];
        node.strokeColor = values[25]; node.textColor = values[2];
        const lines: TextLine[] | undefined = this.$getLinesArr();
        if (values[5] == 0) { return []; }
        const maxWidth: number = !isNaN(values[3]) ? values[3] : values[5];
        const textHeight: number = TextFieldUtils.$getTextHeight(this);
        let drawY: number = 0;
        const startLine: number = TextFieldUtils.$getStartLine(this);
        const textFieldHeight: number = values[4];
        if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
            const vAlign: number = TextFieldUtils.$getValign(this);
            drawY += vAlign * (textFieldHeight - textHeight);
        }
        drawY = Math.round(drawY);
        const hAlign: number = TextFieldUtils.$getHalign(this);
        let drawX: number = 0;
        const underLineData: (number | undefined)[] = [];
        for (let i: number = startLine, numLinesLength: number = values[29]; i < numLinesLength; i++) {
            const line: TextLine = lines![i]!;
            const h: number = line.height;
            drawY += h / 2;
            if (i != startLine) {
                if (values[24] == TextFieldType.INPUT && !values[30]) { break; }
                if (!isNaN(textFieldHeight) && drawY > textFieldHeight) { break; }
            }
            drawX = Math.round((maxWidth - line.width) * hAlign);
            for (let j: number = 0, elementsLength: number = line.elements.length; j < elementsLength; j++) {
                const element: TextLineElement = line.elements[j]!;
                const size: number = element.style.size || values[0];
                node.drawText(drawX, drawY + (h - size) / 2, element.text, element.style);
                if (element.style.underline) { underLineData.push(drawX, drawY + h / 2, element.width, element.style.textColor); }
                drawX += element.width;
            }
            drawY += h / 2 + values[1];
        }
        return underLineData;
    }
    public addEvent(): void { this.addEventListener(TouchEvent.TOUCH_TAP, this.onTapHandler, this); }
    public removeEvent(): void { this.removeEventListener(TouchEvent.TOUCH_TAP, this.onTapHandler, this); }
    public onTapHandler(event: Event): void {
        if (this.isInput()) { return; }
        const e: TouchEvent = event as TouchEvent;
        const ele: TextLineElement | null = TextFieldUtils.$getTextElement(this, e.localX!, e.localY!);
        if (ele == null) { return; }
        const style: ITextStyle = ele.style;
        if (style && style.href) {
            const match: RegExpMatchArray | null = style.href.match(/^event:/);
            if (match) {
                const type: string = match[0];
                TextEvent.dispatchTextEvent(this, TextEvent.LINK, style.href.substring(type.length));
            } else { open(style.href, style.target || "_blank"); }
        }
    }
}
__reflect(TextField.prototype, "egret.TextField");

export class TextFieldInputType {
    public static TEXT: string = "text";
    public static TEL: string = "tel";
    public static PASSWORD: string = "password";
}
__reflect(TextFieldInputType.prototype, "egret.TextFieldInputType");

export class TextFieldType {
    public static DYNAMIC: string = "dynamic";
    public static INPUT: string = "input";
}
__reflect(TextFieldType.prototype, "egret.TextFieldType");

export class TextFieldUtils {
    public static $getStartLine(textfield: TextField): number {
        const values: TextFieldState = textfield.$TextField;
        const textHeight: number = TextFieldUtils.$getTextHeight(textfield);
        let startLine: number = 0;
        const textFieldHeight: number = values[4];
        if (!isNaN(textFieldHeight)) {
            if (textHeight > textFieldHeight) {
                startLine = Math.max(values[28] - 1, 0);
                startLine = Math.min(values[29] - 1, startLine);
            }
            if (!values[30]) {
                startLine = Math.max(values[28] - 1, 0);
                if (values[29] > 0) { startLine = Math.min(values[29] - 1, startLine); }
            }
        }
        return startLine;
    }
    public static $getHalign(textfield: TextField): number {
        const lineArr: TextLine[] = textfield.$getLinesArr2();
        let halign: number = 0;
        if (textfield.$TextField[9] == HorizontalAlign.CENTER) { halign = 0.5; }
        else if (textfield.$TextField[9] == HorizontalAlign.RIGHT) { halign = 1; }
        if (textfield.$TextField[24] == TextFieldType.INPUT && !textfield.$TextField[30] && lineArr.length > 1) { halign = 0; }
        return halign;
    }
    public static $getTextHeight(textfield: TextField): number {
        const textHeight: number = (TextFieldType.INPUT == textfield.$TextField[24] && !textfield.$TextField[30])
            ? textfield.$TextField[0] : textfield.$TextField[6] + (textfield.$TextField[29] - 1) * textfield.$TextField[1];
        return textHeight;
    }
    public static $getValign(textfield: TextField): number {
        const textHeight: number = TextFieldUtils.$getTextHeight(textfield);
        const textFieldHeight: number = textfield.$TextField[4];
        if (!isNaN(textFieldHeight) && textHeight < textFieldHeight) {
            let valign: number = 0;
            if (textfield.$TextField[10] == VerticalAlign.MIDDLE) { valign = 0.5; }
            else if (textfield.$TextField[10] == VerticalAlign.BOTTOM) { valign = 1; }
            return valign;
        }
        return 0;
    }
    public static $getTextElement(textfield: TextField, x: number, y: number): TextLineElement | null {
        const hitTextEle: TextHit | null = TextFieldUtils.$getHit(textfield, x, y);
        const lineArr: TextLine[] = textfield.$getLinesArr2();
        if (hitTextEle) { return lineArr[hitTextEle.lineIndex]?.elements[hitTextEle.textElementIndex] ?? null; }
        return null;
    }
    public static $getHit(textfield: TextField, x: number, y: number): TextHit | null {
        const lineArr: TextLine[] = textfield.$getLinesArr2();
        if (textfield.$TextField[3] == 0) { return null; }
        let line: number = 0;
        const textHeight: number = TextFieldUtils.$getTextHeight(textfield);
        let startY: number = 0;
        const textFieldHeight: number = textfield.$TextField[4];
        if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
            const valign: number = TextFieldUtils.$getValign(textfield);
            startY = valign * (textFieldHeight - textHeight);
            if (startY != 0) { y -= startY; }
        }
        const startLine: number = TextFieldUtils.$getStartLine(textfield);
        let lineH: number = 0;
        for (let i: number = startLine; i < lineArr.length; i++) {
            const lineEle: TextLine = lineArr[i]!;
            if (lineH + lineEle.height >= y) {
                if (lineH < y) { line = i + 1; }
                break;
            } else { lineH += lineEle.height; }
            if (lineH + textfield.$TextField[1] > y) { return null; }
            lineH += textfield.$TextField[1];
        }
        if (line == 0) { return null; }
        const lineElement: TextLine = lineArr[line - 1]!;
        let textFieldWidth: number = textfield.$TextField[3];
        if (isNaN(textFieldWidth)) { textFieldWidth = textfield.textWidth; }
        const halign: number = TextFieldUtils.$getHalign(textfield);
        x -= halign * (textFieldWidth - lineElement.width);
        let lineW: number = 0;
        for (let i: number = 0; i < lineElement.elements.length; i++) {
            const iwTE: TextLineElement = lineElement.elements[i]!;
            if (lineW + iwTE.width <= x) { lineW += iwTE.width; }
            else if (lineW < x) { return { lineIndex: line - 1, textElementIndex: i }; }
        }
        return null;
    }
    public static $getScrollNum(textfield: TextField): number {
        let scrollNum: number = 1;
        if (textfield.$TextField[30]) {
            const height: number = textfield.height;
            const size: number = textfield.size;
            const lineSpacing: number = textfield.lineSpacing;
            scrollNum = Math.floor(height / (size + lineSpacing));
            const leftH: number = height - (size + lineSpacing) * scrollNum;
            if (leftH > size / 2) { scrollNum++; }
        }
        return scrollNum;
    }
}
__reflect(TextFieldUtils.prototype, "egret.TextFieldUtils");

export class VerticalAlign {
    public static TOP: string = "top";
    public static BOTTOM: string = "bottom";
    public static MIDDLE: string = "middle";
    public static JUSTIFY: string = "justify";
    public static CONTENT_JUSTIFY: string = "contentJustify";
}
__reflect(VerticalAlign.prototype, "egret.VerticalAlign");

export class Base64Util {
    private static readonly chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    private static lookup: Uint8Array | null = null;
    public static getLookup(): Uint8Array {
        if (!Base64Util.lookup) {
            const lookup: Uint8Array = new Uint8Array(256);
            for (let i: number = 0; i < Base64Util.chars.length; i++) {
                lookup[Base64Util.chars.charCodeAt(i)] = i;
            }
            Base64Util.lookup = lookup;
        }
        return Base64Util.lookup;
    }
    public static encode(arraybuffer: ArrayBuffer): string {
        const bytes: Uint8Array = new Uint8Array(arraybuffer);
        const len: number = bytes.length;
        let base64: string = '';
        for (let i: number = 0; i < len; i += 3) {
            base64 += Base64Util.chars[bytes[i]! >> 2];
            base64 += Base64Util.chars[((bytes[i]! & 3) << 4) | (bytes[i + 1]! >> 4)];
            base64 += Base64Util.chars[((bytes[i + 1]! & 15) << 2) | (bytes[i + 2]! >> 6)];
            base64 += Base64Util.chars[bytes[i + 2]! & 63];
        }
        if (len % 3 === 2) { base64 = base64.substring(0, base64.length - 1) + '='; }
        else if (len % 3 === 1) { base64 = base64.substring(0, base64.length - 2) + '=='; }
        return base64;
    }
    public static decode(base64: string): ArrayBuffer {
        let bufferLength: number = base64.length * 0.75;
        const len: number = base64.length;
        let p: number = 0;
        let encoded1: number = 0, encoded2: number = 0, encoded3: number = 0, encoded4: number = 0;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') { bufferLength--; }
        }
        const arraybuffer: ArrayBuffer = new ArrayBuffer(bufferLength);
        const bytes: Uint8Array = new Uint8Array(arraybuffer);
        const lookup = Base64Util.getLookup();
        for (let i: number = 0; i < len; i += 4) {
            encoded1 = lookup[base64.charCodeAt(i)]!;
            encoded2 = lookup[base64.charCodeAt(i + 1)]!;
            encoded3 = lookup[base64.charCodeAt(i + 2)]!;
            encoded4 = lookup[base64.charCodeAt(i + 3)]!;
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    }
}
__reflect(Base64Util.prototype, "egret.Base64Util");

// export class Logger {
//     private static logFuncs: ConsoleMethods | undefined;

//     public static ALL: string = "all";
//     public static DEBUG: string = "debug";
//     public static INFO: string = "info";
//     public static WARN: string = "warn";
//     public static ERROR: string = "error";
//     public static OFF: string = "off";

//     public static set logLevel(logType: string) {
//         if (Logger.logFuncs == null) {
//             Logger.logFuncs = {
//                 error: console.error,
//                 debug: console.debug,
//                 warn: console.warn,
//                 info: console.info,
//                 log: console.log
//             };
//         }
//         switch (logType) {
//             case Logger.OFF: console.error = (): void => { };
//             case Logger.ERROR: console.warn = (): void => { };
//             case Logger.WARN: console.info = (): void => { }; console.log = (): void => { };
//             case Logger.INFO: console.debug = (): void => { };
//             default: break;
//         }
//         switch (logType) {
//             case Logger.ALL:
//             case Logger.DEBUG: console.debug = Logger.logFuncs.debug;
//             case Logger.INFO: console.log = Logger.logFuncs.log; console.info = Logger.logFuncs.info;
//             case Logger.WARN: console.warn = Logger.logFuncs.warn;
//             case Logger.ERROR: console.error = Logger.logFuncs.error;
//             default: break;
//         }
//     }
// }
// __reflect(Logger.prototype, "egret.Logger");

export class NumberUtils {
    private static egret_sin_map: { [key: number]: number } | undefined;
    private static egret_cos_map: { [key: number]: number } | undefined;
    private static DEG_TO_RAD = Math.PI / 180;

    private static getEgretSinMap(): { [key: number]: number } {
        if (!NumberUtils.egret_sin_map) {
            NumberUtils.egret_sin_map = {};
            for (let i: number = 0; i < 360; i++) {
                NumberUtils.egret_sin_map[i] = Math.sin(i * NumberUtils.DEG_TO_RAD);
            }
            NumberUtils.egret_sin_map[90] = 1;
            NumberUtils.egret_sin_map[180] = 0;
            NumberUtils.egret_sin_map[270] = -1;
        }
        return NumberUtils.egret_sin_map;
    }

    private static getEgretCosMap(): { [key: number]: number } {
        if (!NumberUtils.egret_cos_map) {
            NumberUtils.egret_cos_map = {};
            for (let i: number = 0; i < 360; i++) {
                NumberUtils.egret_cos_map[i] = Math.cos(i * NumberUtils.DEG_TO_RAD);
            }
            NumberUtils.egret_cos_map[90] = 0;
            NumberUtils.egret_cos_map[180] = -1;
            NumberUtils.egret_cos_map[270] = 0;
        }
        return NumberUtils.egret_cos_map;
    }

    public static isNumber(value: unknown): value is number {
        return typeof value === "number" && !isNaN(value);
    }

    public static sin(value: number): number {
        const valueFloor: number = Math.floor(value);
        const valueCeil: number = valueFloor + 1;
        const resultFloor: number = NumberUtils.sinInt(valueFloor);
        if (valueFloor == value) {
            return resultFloor;
        }

        const resultCeil: number = NumberUtils.sinInt(valueCeil);
        return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
    }
    public static sinInt(value: number): number {
        value %= 360;
        if (value < 0) {
            value += 360;
        }
        return NumberUtils.getEgretSinMap()[value]!;
    }
    public static cos(value: number): number {
        const valueFloor: number = Math.floor(value);
        const valueCeil: number = valueFloor + 1;
        const resultFloor: number = NumberUtils.cosInt(valueFloor);
        if (valueFloor == value) {
            return resultFloor;
        }

        const resultCeil: number = NumberUtils.cosInt(valueCeil);
        return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
    }
    public static cosInt(value: number): number {
        value %= 360;
        if (value < 0) {
            value += 360;
        }
        return NumberUtils.getEgretCosMap()[value]!;
    }
    public static convertStringToHashCode(str: string): number {
        if (str.length === 0) { return 0; }
        let hash: number = 0;
        for (let i: number = 0, length: number = str.length; i < length; ++i) {
            const chr: number = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }
}
__reflect(NumberUtils.prototype, "egret.NumberUtils");

export class Endian {
    public static LITTLE_ENDIAN: string = "littleEndian";
    public static BIG_ENDIAN: string = "bigEndian";
}
__reflect(Endian.prototype, "egret.Endian");

export class ByteArray {
    public bufferExtSize: number = 0;
    public EOF_byte: number = -1;
    public EOF_code_point: number = -1;
    public write_position: number;
    public _position: number;
    public _bytes: Uint8Array;
    public data: DataView;
    public $endian: number = 1;
    public constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize: number = 0) {
        if (bufferExtSize < 0) { bufferExtSize = 0; }
        this.bufferExtSize = bufferExtSize;
        let bytes: Uint8Array;
        let wpos: number = 0;
        if (buffer) {
            let uint8: Uint8Array;
            if (buffer instanceof Uint8Array) { uint8 = buffer; wpos = buffer.length; }
            else { wpos = buffer.byteLength; uint8 = new Uint8Array(buffer); }
            if (bufferExtSize == 0) { bytes = new Uint8Array(wpos); }
            else {
                const multi: number = (wpos / bufferExtSize | 0) + 1;
                bytes = new Uint8Array(multi * bufferExtSize);
            }
            bytes.set(uint8);
        } else { bytes = new Uint8Array(bufferExtSize); }
        this.write_position = wpos;
        this._position = 0;
        this._bytes = bytes;
        this.data = new DataView(bytes.buffer);
        this.endian = Endian.BIG_ENDIAN;
    }
    public get endian(): string { return this.$endian == 0 ? Endian.LITTLE_ENDIAN : Endian.BIG_ENDIAN; }
    public set endian(value: string) { this.$endian = value == Endian.LITTLE_ENDIAN ? 0 : 1; }
    public setArrayBuffer(_buffer: ArrayBuffer): void { }
    public get readAvailable(): number { return this.write_position - this._position; }
    public get buffer(): ArrayBuffer { return this.data.buffer.slice(0, this.write_position) as ArrayBuffer; }
    public set buffer(value: ArrayBuffer) {
        const wpos: number = value.byteLength;
        const uint8: Uint8Array = new Uint8Array(value);
        const bufferExtSize: number = this.bufferExtSize;
        let bytes: Uint8Array;
        if (bufferExtSize == 0) { bytes = new Uint8Array(wpos); }
        else {
            const multi: number = (wpos / bufferExtSize | 0) + 1;
            bytes = new Uint8Array(multi * bufferExtSize);
        }
        bytes.set(uint8);
        this.write_position = wpos;
        this._bytes = bytes;
        this.data = new DataView(bytes.buffer);
    }
    public get rawBuffer(): ArrayBuffer { return this.data.buffer as ArrayBuffer; }
    public get bytes(): Uint8Array { return this._bytes; }
    public get dataView(): DataView { return this.data; }
    public set dataView(value: DataView) { this.buffer = value.buffer as ArrayBuffer; }
    public get bufferOffset(): number { return this.data.byteOffset; }
    public get position(): number { return this._position; }
    public set position(value: number) {
        this._position = value;
        if (value > this.write_position) { this.write_position = value; }
    }
    public get length(): number { return this.write_position; }
    public set length(value: number) {
        this.write_position = value;
        if (this.data.byteLength > value) { this._position = value; }
        this._validateBuffer(value);
    }
    public _validateBuffer(value: number): void {
        if (this.data.byteLength < value) {
            const be: number = this.bufferExtSize;
            let tmp: Uint8Array;
            if (be == 0) { tmp = new Uint8Array(value); }
            else {
                const nLen: number = ((value / be >> 0) + 1) * be;
                tmp = new Uint8Array(nLen);
            }
            tmp.set(this._bytes);
            this._bytes = tmp;
            this.data = new DataView(tmp.buffer);
        }
    }
    public get bytesAvailable(): number { return this.data.byteLength - this._position; }
    public clear(): void {
        const buffer: ArrayBuffer = new ArrayBuffer(this.bufferExtSize);
        this.data = new DataView(buffer); this._bytes = new Uint8Array(buffer);
        this._position = 0; this.write_position = 0;
    }
    public readBoolean(): boolean | undefined { if (this.validate(1)) { return !!this._bytes[this.position++]; } }
    public readByte(): number | undefined { if (this.validate(1)) { return this.data.getInt8(this.position++); } }
    public readBytes(bytes: ByteArray | null, offset: number = 0, length: number = 0): void {
        if (!bytes) { return; }
        const pos: number = this._position;
        const available: number = this.write_position - pos;
        if (available < 0) { $error(1025); return; }
        if (length == 0) { length = available; }
        else if (length > available) { $error(1025); return; }
        const position: number = bytes._position;
        bytes._position = 0;
        bytes.validateBuffer(offset + length);
        bytes._position = position;
        bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
        this.position += length;
    }
    public readDouble(): number | undefined {
        if (this.validate(8)) {
            const value: number = this.data.getFloat64(this._position, this.$endian == 0);
            this.position += 8;
            return value;
        }
    }
    public readFloat(): number | undefined {
        if (this.validate(4)) {
            const value: number = this.data.getFloat32(this._position, this.$endian == 0);
            this.position += 4;
            return value;
        }
    }
    public readInt(): number | undefined {
        if (this.validate(4)) {
            const value: number = this.data.getInt32(this._position, this.$endian == 0);
            this.position += 4;
            return value;
        }
    }
    public readShort(): number | undefined {
        if (this.validate(2)) {
            const value: number = this.data.getInt16(this._position, this.$endian == 0);
            this.position += 2;
            return value;
        }
    }
    public readUnsignedByte(): number | undefined { if (this.validate(1)) { return this._bytes[this.position++]; } }
    public readUnsignedInt(): number | undefined {
        if (this.validate(4)) {
            const value: number = this.data.getUint32(this._position, this.$endian == 0);
            this.position += 4;
            return value;
        }
    }
    public readUnsignedShort(): number | undefined {
        if (this.validate(2)) {
            const value: number = this.data.getUint16(this._position, this.$endian == 0);
            this.position += 2;
            return value;
        }
    }
    public readUTF(): string | undefined {
        const length: number | undefined = this.readUnsignedShort();
        if (length !== undefined && length > 0) { return this.readUTFBytes(length); }
        return "";
    }
    public readUTFBytes(length: number): string | undefined {
        if (!this.validate(length)) { return; }
        const data: DataView = this.data;
        const bytes: Uint8Array = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
        this.position += length;
        return this.decodeUTF8(bytes);
    }
    public writeBoolean(value: boolean): void { this.validateBuffer(1); this._bytes[this.position++] = +value; }
    public writeByte(value: number): void { this.validateBuffer(1); this._bytes[this.position++] = value & 0xff; }
    public writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
        let writeLength: number;
        if (offset < 0 || length < 0) { return; }
        else if (length == 0) { writeLength = bytes.length - offset; }
        else { writeLength = Math.min(bytes.length - offset, length); }
        if (writeLength > 0) {
            this.validateBuffer(writeLength);
            this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
            this.position = this._position + writeLength;
        }
    }
    public writeDouble(value: number): void {
        this.validateBuffer(8); this.data.setFloat64(this._position, value, this.$endian == 0); this.position += 8;
    }
    public writeFloat(value: number): void {
        this.validateBuffer(4); this.data.setFloat32(this._position, value, this.$endian == 0); this.position += 4;
    }
    public writeInt(value: number): void {
        this.validateBuffer(4); this.data.setInt32(this._position, value, this.$endian == 0); this.position += 4;
    }
    public writeShort(value: number): void {
        this.validateBuffer(2); this.data.setInt16(this._position, value, this.$endian == 0); this.position += 2;
    }
    public writeUnsignedInt(value: number): void {
        this.validateBuffer(4); this.data.setUint32(this._position, value, this.$endian == 0); this.position += 4;
    }
    public writeUnsignedShort(value: number): void {
        this.validateBuffer(2); this.data.setUint16(this._position, value, this.$endian == 0); this.position += 2;
    }
    public writeUTF(value: string): void {
        const utf8bytes: Uint8Array = this.encodeUTF8(value);
        const length: number = utf8bytes.length;
        this.validateBuffer(2 + length);
        this.data.setUint16(this._position, length, this.$endian == 0);
        this.position += 2;
        this._writeUint8Array(utf8bytes, false);
    }
    public writeUTFBytes(value: string): void { this._writeUint8Array(this.encodeUTF8(value)); }
    public toString(): string { return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable; }
    public _writeUint8Array(bytes: Uint8Array, validateBuffer: boolean = true): void {
        const pos: number = this._position;
        const npos: number = pos + bytes.length;
        if (validateBuffer) { this.validateBuffer(npos); }
        this.bytes.set(bytes, pos);
        this.position = npos;
    }
    public validate(len: number): true | undefined {
        const bl: number = this._bytes.length;
        if (bl > 0 && this._position + len <= bl) { return true; }
        $error(1025);
    }
    public validateBuffer(len: number): void {
        this.write_position = len > this.write_position ? len : this.write_position;
        len += this._position;
        this._validateBuffer(len);
    }
    public encodeUTF8(str: string): Uint8Array {
        let pos: number = 0;
        const codePoints: number[] = this.stringToCodePoints(str);
        const outputBytes: number[] = [];
        while (codePoints.length > pos) {
            const code_point: number = codePoints[pos++]!;
            if (this.inRange(code_point, 0xD800, 0xDFFF)) { this.encoderError(code_point); }
            else if (this.inRange(code_point, 0x0000, 0x007f)) { outputBytes.push(code_point); }
            else {
                let count: number = NaN, offset: number = NaN;
                if (this.inRange(code_point, 0x0080, 0x07FF)) { count = 1; offset = 0xC0; }
                else if (this.inRange(code_point, 0x0800, 0xFFFF)) { count = 2; offset = 0xE0; }
                else if (this.inRange(code_point, 0x10000, 0x10FFFF)) { count = 3; offset = 0xF0; }
                outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                while (count > 0) {
                    const temp: number = this.div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + temp % 64);
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    }
    public decodeUTF8(data: Uint8Array): string {
        const fatal: boolean = false;
        let pos: number = 0;
        let result: string = "";
        let code_point: number | null = null;
        let utf8_code_point: number = 0;
        let utf8_bytes_needed: number = 0;
        let utf8_bytes_seen: number = 0;
        let utf8_lower_boundary: number = 0;
        while (data.length > pos) {
            const byte: number = data[pos++]!;
            if (byte == this.EOF_byte) {
                if (utf8_bytes_needed != 0) { code_point = this.decoderError(fatal); }
                else { code_point = this.EOF_code_point; }
            } else {
                if (utf8_bytes_needed == 0) {
                    if (this.inRange(byte, 0x00, 0x7F)) { code_point = byte; }
                    else {
                        if (this.inRange(byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1; utf8_lower_boundary = 0x80; utf8_code_point = byte - 0xC0;
                        } else if (this.inRange(byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2; utf8_lower_boundary = 0x800; utf8_code_point = byte - 0xE0;
                        } else if (this.inRange(byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3; utf8_lower_boundary = 0x10000; utf8_code_point = byte - 0xF0;
                        } else { this.decoderError(fatal); }
                        utf8_code_point *= Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                } else if (!this.inRange(byte, 0x80, 0xBF)) {
                    utf8_code_point = 0; utf8_bytes_needed = 0; utf8_bytes_seen = 0; utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.decoderError(fatal, byte);
                } else {
                    utf8_bytes_seen += 1;
                    utf8_code_point += (byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                    if (utf8_bytes_seen !== utf8_bytes_needed) { code_point = null; }
                    else {
                        const cp: number = utf8_code_point;
                        const lower_boundary: number = utf8_lower_boundary;
                        utf8_code_point = 0; utf8_bytes_needed = 0; utf8_bytes_seen = 0; utf8_lower_boundary = 0;
                        if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) { code_point = cp; }
                        else { code_point = this.decoderError(fatal, byte); }
                    }
                }
            }
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0) { result += String.fromCharCode(code_point); }
                } else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    }
    public encoderError(code_point: number): void { $error(1026, code_point); }
    public decoderError(fatal: boolean, opt_code_point?: number): number {
        if (fatal) { $error(1027); }
        return opt_code_point || 0xFFFD;
    }
    public inRange(a: number, min: number, max: number): boolean { return min <= a && a <= max; }
    public div(n: number, d: number): number { return Math.floor(n / d); }
    public stringToCodePoints(string: string): number[] {
        const cps: number[] = [];
        let i: number = 0;
        const n: number = string.length;
        while (i < string.length) {
            const c: number = string.charCodeAt(i);
            if (!this.inRange(c, 0xD800, 0xDFFF)) { cps.push(c); }
            else if (this.inRange(c, 0xDC00, 0xDFFF)) { cps.push(0xFFFD); }
            else if (i == n - 1) { cps.push(0xFFFD); }
            else {
                const d: number = string.charCodeAt(i + 1);
                if (this.inRange(d, 0xDC00, 0xDFFF)) {
                    const a: number = c & 0x3FF;
                    const b: number = d & 0x3FF;
                    i += 1;
                    cps.push(0x10000 + (a << 10) + b);
                } else { cps.push(0xFFFD); }
            }
            i += 1;
        }
        return cps;
    }
}
__reflect(ByteArray.prototype, "egret.ByteArray");

export class Sprite extends DisplayObjectContainer {
    public $graphics: Graphics;
    public constructor() {
        super();
        this.$graphics = new Graphics();
        this.$graphics.$setTarget(this);
    }
    public get graphics(): Graphics { return this.$graphics; }
    public override $hitTest(stageX: number, stageY: number): DisplayObject | null {
        if (!this.$visible) { return null; }
        const m: Matrix = this.$getInvertedConcatenatedMatrix();
        const localX: number = m.a * stageX + m.c * stageY + m.tx;
        const localY: number = m.b * stageX + m.d * stageY + m.ty;
        const rect: Rectangle | null = this.$scrollRect ? this.$scrollRect : this.$maskRect;
        if (rect && !rect.contains(localX, localY)) { return null; }
        if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) { return null; }
        const children: DisplayObject[] = this.$children;
        let found: boolean = false;
        let target: DisplayObject | null = null;
        for (let i: number = children.length - 1; i >= 0; i--) {
            const child: DisplayObject = children[i]!;
            if (child.$maskedObject) { continue; }
            target = child.$hitTest(stageX, stageY);
            if (target) {
                found = true;
                if (target.$touchEnabled) { break; }
                else { target = null; }
            }
        }
        if (target) { return this.$touchChildren ? target : this; }
        if (found) { return this; }
        target = DisplayObject.prototype.$hitTest.call(this, stageX, stageY);
        if (target) { target = this.$graphics.$hitTest(stageX, stageY); }
        return target;
    }
    public override $measureContentBounds(bounds: Rectangle): void { this.$graphics.$measureContentBounds(bounds); }
    public override $onRemoveFromStage(): void {
        super.$onRemoveFromStage();
        if (this.$graphics) { this.$graphics.$onRemoveFromStage(); }
    }
}
__reflect(Sprite.prototype, "egret.Sprite");

export class Timer extends EventDispatcher {
    public _delay: number = 0;
    public _currentCount: number = 0;
    public _running: boolean = false;
    public updateInterval: number = 1000;
    public lastCount: number = 1000;
    public lastTimeStamp: number = 0;
    public repeatCount: number;
    public constructor(delay: number, repeatCount: number = 0) {
        super();
        this.delay = delay;
        this.repeatCount = +repeatCount | 0;
    }
    public get delay(): number { return this._delay; }
    public set delay(value: number) {
        if (value < 1) { value = 1; }
        if (this._delay == value) { return; }
        this._delay = value;
        this.lastCount = this.updateInterval = Math.round(60 * value);
    }
    public get currentCount(): number { return this._currentCount; }
    public get running(): boolean { return this._running; }
    public reset(): void { this.stop(); this._currentCount = 0; }
    public start(): void {
        if (this._running) { return; }
        this.lastCount = this.updateInterval;
        this.lastTimeStamp = getTimer();
        getTicker().$startTick(this.$update as TickCallback, this);
        this._running = true;
    }
    public stop(): void {
        if (!this._running) { return; }
        stopTick(this.$update as TickCallback, this);
        this._running = false;
    }
    public $update(timeStamp: number): boolean {
        const deltaTime: number = timeStamp - this.lastTimeStamp;
        if (deltaTime >= this._delay) { this.lastCount = this.updateInterval; }
        else {
            this.lastCount -= 1000;
            if (this.lastCount > 0) { return false; }
            this.lastCount += this.updateInterval;
        }
        this.lastTimeStamp = timeStamp;
        this._currentCount++;
        const complete: boolean = this.repeatCount > 0 && this._currentCount >= this.repeatCount;
        if (this.repeatCount == 0 || this._currentCount <= this.repeatCount) {
            TimerEvent.dispatchTimerEvent(this, TimerEvent.TIMER);
        }
        if (complete) {
            this.stop();
            TimerEvent.dispatchTimerEvent(this, TimerEvent.TIMER_COMPLETE);
        }
        return false;
    }
}
__reflect(Timer.prototype, "egret.Timer");

export class URLLoaderDataFormat {
    public static BINARY: URLLoaderFormat = "binary";
    public static TEXT: URLLoaderFormat = "text";
    public static VARIABLES: URLLoaderFormat = "variables";
    public static TEXTURE: URLLoaderFormat = "texture";
    public static SOUND: URLLoaderFormat = "sound";
}
__reflect(URLLoaderDataFormat.prototype, "egret.URLLoaderDataFormat");

export class FrameLabel extends EventDispatcher {
    private _name: string;
    private _frame: number;
    private _end: number | undefined;

    public constructor(name: string, frame: number, end?: number) {
        super();
        this._name = name;
        this._frame = frame | 0;
        if (end) { this._end = end | 0; }
    }
    public get name(): string { return this._name; }
    public get frame(): number { return this._frame; }
    public get end(): number | undefined { return this._end; }
    public clone(): FrameLabel { return new FrameLabel(this._name, this._frame, this._end); }
}
__reflect(FrameLabel.prototype, "egret.FrameLabel");

export class MovieClipData extends HashObject {
    public $mcData: MovieClipSource | null = null;
    public numFrames: number = 1;
    public frames: MovieClipFrameData[] = [];
    public labels: FrameLabel[] | null = null;
    public events: (string | undefined)[] = [];
    public frameRate: number = 0;
    public textureData: Record<string, MovieClipTextureData> | null = null;
    public spriteSheet: SpriteSheet | null = null;

    public $init(mcData: MovieClipSource, textureData: Record<string, MovieClipTextureData>, spriteSheet: SpriteSheet | null): void {
        this.textureData = textureData;
        this.spriteSheet = spriteSheet;
        this.setMCData(mcData);
    }
    public getKeyFrameData(frame: number): MovieClipFrameData {
        let outputFrameData: MovieClipFrameData = this.frames[frame - 1]!;
        if (outputFrameData.frame) { outputFrameData = this.frames[outputFrameData.frame - 1]!; }
        return outputFrameData;
    }
    public getTextureByFrame(frame: number): Texture | null {
        const frameData: MovieClipFrameData = this.getKeyFrameData(frame);
        if (frameData.res) { return this.getTextureByResName(frameData.res); }
        return null;
    }
    public $getOffsetByFrame(frame: number, point: Point): void {
        const frameData: MovieClipFrameData = this.getKeyFrameData(frame);
        if (frameData.res) { point.setTo((frameData.x ?? 0) | 0, (frameData.y ?? 0) | 0); }
    }
    private getTextureByResName(resName: string): Texture | null {
        if (this.spriteSheet == null) { return null; }
        let texture: Texture | null | undefined = this.spriteSheet.getTexture(resName);
        if (!texture) {
            const textureData: MovieClipTextureData = this.textureData![resName]!;
            texture = this.spriteSheet.createTexture(resName, textureData.x, textureData.y, textureData.w, textureData.h);
        }
        return texture;
    }
    public $isDataValid(): boolean { return this.frames.length > 0; }
    public $isTextureValid(): boolean { return this.textureData != null && this.spriteSheet != null; }
    public $fillMCData(mcData: MovieClipSource): void {
        this.frameRate = mcData.frameRate || 24;
        this.fillFramesData(mcData.frames);
        this.fillFrameLabelsData(mcData.labels);
        this.fillFrameEventsData(mcData.events);
    }
    private fillFramesData(framesData: MovieClipFrameData[] | undefined): void {
        const frames: MovieClipFrameData[] = this.frames;
        const length: number = framesData ? framesData.length : 0;
        for (let i: number = 0; i < length; i++) {
            const frameData: MovieClipFrameData = framesData![i]!;
            frames.push(frameData);
            if (frameData.duration) {
                const duration: number = parseInt(String(frameData.duration));
                if (duration > 1) {
                    const keyFramePosition: number = frames.length;
                    for (let j: number = 1; j < duration; j++) { frames.push({ frame: keyFramePosition }); }
                }
            }
        }
        this.numFrames = frames.length;
    }
    private fillFrameLabelsData(frameLabelsData: MovieClipLabelData[] | undefined): void {
        if (frameLabelsData && frameLabelsData.length > 0) {
            this.labels = [];
            for (let i: number = 0; i < frameLabelsData.length; i++) {
                const label: MovieClipLabelData = frameLabelsData[i]!;
                this.labels.push(new FrameLabel(label.name, label.frame, label.end));
            }
        }
    }
    private fillFrameEventsData(frameEventsData: MovieClipFrameEventData[] | undefined): void {
        if (frameEventsData && frameEventsData.length > 0) {
            this.events = [];
            for (let i: number = 0; i < frameEventsData.length; i++) {
                const event: MovieClipFrameEventData = frameEventsData[i]!;
                this.events[event.frame] = event.name;
            }
        }
    }
    public get mcData(): MovieClipSource | null { return this.$mcData; }
    public set mcData(value: MovieClipSource | null) { this.setMCData(value); }
    private setMCData(value: MovieClipSource | null): void {
        if (this.$mcData == value) { return; }
        this.$mcData = value;
        if (value) { this.$fillMCData(value); }
    }
}
__reflect(MovieClipData.prototype, "egret.MovieClipData");

export class MovieClipDataFactory extends EventDispatcher {
    public enableCache: boolean = true;
    public $mcDataCache: Record<string, MovieClipData> = {};
    public $mcDataSet: MovieClipDataSet | null | undefined;
    public $spriteSheet: SpriteSheet | null = null;

    public constructor(movieClipDataSet?: MovieClipDataSet | null, texture?: Texture | null) {
        super();
        this.$mcDataSet = movieClipDataSet;
        this.setTexture(texture);
    }
    public clearCache(): void { this.$mcDataCache = {}; }
    public generateMovieClipData(movieClipName: string = ""): MovieClipData | null {
        if (movieClipName == "" && this.$mcDataSet) {
            for (movieClipName in this.$mcDataSet.mc) { break; }
        }
        if (movieClipName == "") { return null; }
        let output: MovieClipData | null = this.findFromCache(movieClipName, this.$mcDataCache);
        if (!output) {
            output = new MovieClipData();
            this.fillData(movieClipName, output, this.$mcDataCache);
        }
        return output;
    }
    private findFromCache(movieClipName: string, cache: Record<string, MovieClipData>): MovieClipData | null {
        if (this.enableCache && cache[movieClipName]) { return cache[movieClipName]!; }
        return null;
    }
    private fillData(movieClipName: string, movieClip: MovieClipData, cache: Record<string, MovieClipData>): void {
        if (this.$mcDataSet) {
            const mcData: MovieClipSource | undefined = this.$mcDataSet.mc[movieClipName];
            if (mcData) {
                movieClip.$init(mcData, this.$mcDataSet.res, this.$spriteSheet);
                if (this.enableCache) { cache[movieClipName] = movieClip; }
            }
        }
    }
    public get mcDataSet(): MovieClipDataSet | null | undefined { return this.$mcDataSet; }
    public set mcDataSet(value: MovieClipDataSet | null | undefined) { this.$mcDataSet = value; }
    public set texture(value: Texture | null | undefined) { this.setTexture(value); }
    public get spriteSheet(): SpriteSheet | null { return this.$spriteSheet; }
    private setTexture(value: Texture | null | undefined): void { this.$spriteSheet = value ? new SpriteSheet(value) : null; }
}
__reflect(MovieClipDataFactory.prototype, "egret.MovieClipDataFactory");

export class MovieClipEvent extends Event {
    public static FRAME_LABEL: string = "frame_label";
    public frameLabel: string | null = null;
    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, frameLabel: string | null = null) {
        super(type, bubbles, cancelable);
        this.frameLabel = frameLabel;
    }
    public static dispatchMovieClipEvent(target: IEventDispatcher, type: string, frameLabel: string | null = null): boolean {
        const event: MovieClipEvent = Event.create(MovieClipEvent, type);
        event.frameLabel = frameLabel;
        const result: boolean = target.dispatchEvent(event);
        Event.release(event);
        return result;
    }
}
__reflect(MovieClipEvent.prototype, "egret.MovieClipEvent");

export class ScrollEase {
    public constructor() { $error(1014); }
    public static get(amount: number): ScrollEaseFunction {
        if (amount < -1) { amount = -1; }
        if (amount > 1) { amount = 1; }
        return (t: number): number => {
            if (amount == 0) { return t; }
            if (amount < 0) { return t * (t * -amount + 1 + amount); }
            return t * ((2 - t) * amount + (1 - amount));
        };
    }
    public static getPowOut(pow: number): ScrollEaseFunction {
        return (t: number): number => 1 - Math.pow(1 - t, pow);
    }
    public static quintOut: ScrollEaseFunction = ScrollEase.getPowOut(5);
    public static quartOut: ScrollEaseFunction = ScrollEase.getPowOut(4);
}
__reflect(ScrollEase.prototype, "egret.ScrollEase");

export class ScrollTween extends EventDispatcher {
    public static _tweens: ScrollTween[] = [];
    public static IGNORE: object = {};
    public static _plugins: Record<string, ScrollTweenPlugin[]> = {};
    public static _inited: boolean = false;
    public static _lastTime: number = 0;
    public _target: ScrollTweenTarget | null = null;
    public _useTicks: boolean | undefined = false;
    public ignoreGlobalPause: boolean | undefined = false;
    public loop: boolean | undefined = false;
    public pluginData: ScrollTweenProperties | null = null;
    public _steps: ScrollTweenStep[] = [];
    public _actions: ScrollTweenAction[] = [];
    public paused: boolean = false;
    public duration: number = 0;
    public _prevPos: number = -1;
    public position: number | null = null;
    public _prevPosition: number = 0;
    public _stepPosition: number = 0;
    public passive: boolean = false;
    public _curQueueProps: ScrollTweenProperties = {};
    public _initQueueProps: ScrollTweenProperties = {};

    public constructor(target: object, props: ScrollTweenOptions | null = null, pluginData: ScrollTweenProperties | null = null) {
        super();
        this.initialize(target, props, pluginData);
    }
    public static get(target: object, props: ScrollTweenOptions | null = null, pluginData: ScrollTweenProperties | null = null, override: boolean = false): ScrollTween {
        if (override) { ScrollTween.removeTweens(target); }
        return new ScrollTween(target, props, pluginData);
    }
    public static removeTweens(target: ScrollTweenTarget): void {
        if (!target.tween_count) { return; }
        const tweens: ScrollTween[] = ScrollTween._tweens;
        for (let i: number = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]!._target == target) { tweens[i]!.paused = true; tweens.splice(i, 1); }
        }
        target.tween_count = 0;
    }
    public static tick(timeStamp: number, paused: boolean = false): boolean {
        const delta: number = timeStamp - ScrollTween._lastTime;
        ScrollTween._lastTime = timeStamp;
        const tweens: ScrollTween[] = ScrollTween._tweens.concat();
        for (let i: number = tweens.length - 1; i >= 0; i--) {
            const tween: ScrollTween = tweens[i]!;
            if ((paused && !tween.ignoreGlobalPause) || tween.paused) { continue; }
            tween.tick(tween._useTicks ? 1 : delta);
        }
        return false;
    }
    public static _register(tween: ScrollTween, value: boolean): void {
        const target: ScrollTweenTarget | null = tween._target;
        const tweens: ScrollTween[] = ScrollTween._tweens;
        if (value) {
            if (target) { target.tween_count = (target.tween_count ?? 0) > 0 ? target.tween_count! + 1 : 1; }
            tweens.push(tween);
            if (!ScrollTween._inited) {
                ScrollTween._lastTime = getTimer();
                getTicker().$startTick(ScrollTween.tick, null);
                ScrollTween._inited = true;
            }
        } else {
            if (target) { target.tween_count = (target.tween_count ?? NaN) - 1; }
            let i: number = tweens.length;
            while (i--) { if (tweens[i] == tween) { tweens.splice(i, 1); return; } }
        }
    }
    public initialize(target: object, props: ScrollTweenOptions | null, pluginData: ScrollTweenProperties | null): void {
        this._target = target;
        if (props) {
            this._useTicks = props.useTicks;
            this.ignoreGlobalPause = props.ignoreGlobalPause;
            this.loop = props.loop;
            if (props.onChange) { this.addEventListener("change", props.onChange, props.onChangeObj); }
            if (props.override) { ScrollTween.removeTweens(target); }
        }
        this.pluginData = pluginData || {};
        this._curQueueProps = {};
        this._initQueueProps = {};
        this._steps = [];
        this._actions = [];
        if (props && props.paused) { this.paused = true; } else { ScrollTween._register(this, true); }
        if (props && props.position != null) { this.setPosition(props.position); }
    }
    public setPosition(value: number, actionsMode: number = 1): boolean {
        if (value < 0) { value = 0; }
        let t: number = value;
        let end: boolean = false;
        if (t >= this.duration) {
            if (this.loop) { t = t % this.duration; } else { t = this.duration; end = true; }
        }
        if (t == this._prevPos) { return end; }
        const prevPos: number = this._prevPos;
        this.position = this._prevPos = t;
        this._prevPosition = value;
        if (this._target) {
            if (end) { this._updateTargetProps(null, 1); }
            else if (this._steps.length > 0) {
                let i: number = 0;
                const length: number = this._steps.length;
                for (; i < length; i++) { if (this._steps[i]!.t > t) { break; } }
                const step: ScrollTweenStep = this._steps[i - 1]!;
                this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
            }
        }
        if (end) { this.setPaused(true); }
        if (actionsMode != 0 && this._actions.length > 0) {
            if (this._useTicks) { this._runActions(t, t); }
            else if (actionsMode == 1 && t < prevPos) {
                if (prevPos != this.duration) { this._runActions(prevPos, this.duration); }
                this._runActions(0, t, true);
            } else { this._runActions(prevPos, t); }
        }
        this.dispatchEventWith("change");
        return end;
    }
    public _runActions(startPos: number, endPos: number, includeStart: boolean = false): void {
        let sPos: number = startPos;
        let ePos: number = endPos;
        let i: number = -1;
        let j: number = this._actions.length;
        let k: number = 1;
        if (startPos > endPos) { sPos = endPos; ePos = startPos; i = j; j = k = -1; }
        while ((i += k) != j) {
            const action: ScrollTweenAction = this._actions[i]!;
            const pos: number = action.t;
            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) { action.execute(); }
        }
    }
    public _updateTargetProps(step: ScrollTweenStep | null, ratio: number): void {
        let p0: ScrollTweenProperties;
        let p1: ScrollTweenProperties;
        if (!step && ratio == 1) { this.passive = false; p0 = p1 = this._curQueueProps; }
        else {
            this.passive = !!step!.v;
            if (this.passive) { return; }
            if (step!.e) { ratio = step!.e(ratio, 0, 1, 1); }
            p0 = step!.p0;
            p1 = step!.p1;
        }
        let n: string;
        for (n in this._initQueueProps) {
            let v0: unknown = p0[n];
            let v1: unknown = p1[n];
            if (v0 == null) { p0[n] = v0 = this._initQueueProps[n]; }
            if (v1 == null) { p1[n] = v1 = v0; }
            let v: unknown;
            if (v0 == v1 || ratio == 0 || ratio == 1 || typeof v0 != "number") { v = ratio == 1 ? v1 : v0; }
            else { v = v0 + (Number(v1) - v0) * ratio; }
            let ignore: boolean = false;
            const plugins: ScrollTweenPlugin[] | undefined = ScrollTween._plugins[n];
            if (plugins) {
                for (let i: number = 0; i < plugins.length; i++) {
                    const plugin: ScrollTweenPlugin = plugins[i]!;
                    const v2: unknown = plugin.tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                    if (v2 == ScrollTween.IGNORE) { ignore = true; } else { v = v2; }
                }
            }
            if (!ignore) { (this._target as ScrollTweenProperties)[n] = v; }
        }
    }
    public setPaused(value: boolean): this { this.paused = value; ScrollTween._register(this, !value); return this; }
    public _cloneProps(props: ScrollTweenProperties): ScrollTweenProperties {
        const output: ScrollTweenProperties = {};
        let n: string;
        for (n in props) { output[n] = props[n]; }
        return output;
    }
    public _addStep(step: ScrollTweenStep): this {
        if (step.d > 0) { this._steps.push(step); step.t = this.duration; this.duration += step.d; }
        return this;
    }
    public _appendQueueProps(props: ScrollTweenProperties): ScrollTweenProperties {
        let injectProps: ScrollTweenProperties | undefined;
        let n: string;
        for (n in props) {
            if (this._initQueueProps[n] === undefined) {
                let oldValue: unknown = (this._target as ScrollTweenProperties)[n];
                const plugins: ScrollTweenPlugin[] | undefined = ScrollTween._plugins[n];
                if (plugins) {
                    for (let i: number = 0; i < plugins.length; i++) {
                        const plugin: ScrollTweenPlugin = plugins[i]!;
                        oldValue = plugin.init(this, n, oldValue);
                    }
                }
                this._initQueueProps[n] = this._curQueueProps[n] = oldValue === undefined ? null : oldValue;
            }
        }
        for (n in props) {
            const oldValue: unknown = this._curQueueProps[n];
            const plugins: ScrollTweenPlugin[] | undefined = ScrollTween._plugins[n];
            if (plugins) {
                injectProps = injectProps || {};
                for (let i: number = 0; i < plugins.length; i++) {
                    const plugin: ScrollTweenPlugin = plugins[i]!;
                    if (plugin.step) { plugin.step(this, n, oldValue, props[n], injectProps); }
                }
            }
            this._curQueueProps[n] = props[n];
        }
        if (injectProps) { this._appendQueueProps(injectProps); }
        return this._curQueueProps;
    }
    public _addAction(action: ScrollTweenAction): this { action.t = this.duration; this._actions.push(action); return this; }
    public to(props: ScrollTweenProperties, duration: number, ease?: ScrollEaseFunction): this {
        if (isNaN(duration) || duration < 0) { duration = 0; }
        return this._addStep({ t: 0, d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
    }
    public call<TThis, TArgs extends unknown[]>(callback: (this: TThis, ...args: TArgs) => unknown, thisObj?: TThis, params?: TArgs): this {
        const context: TThis = (thisObj ? thisObj : this._target) as TThis;
        const args: TArgs = (params ? params : []) as TArgs;
        return this._addAction({ t: 0, execute: (): void => { callback.apply(context, args); } });
    }
    public tick(delta: number): void { if (!this.paused) { this.setPosition(this._prevPosition + delta); } }
}
__reflect(ScrollTween.prototype, "egret.ScrollTween");

export class ScrollView extends DisplayObjectContainer {
    public static weight: number[] = [1, 1.33, 1.66, 2, 2.33];
    public scrollBeginThreshold: number = 10;
    public scrollSpeed: number = 1;
    public _content: DisplayObject | null = null;
    public delayTouchBeginEvent: TouchEvent | null = null;
    public touchBeginTimer: Timer | null = null;
    public _ScrV_Props_: ScrollViewProperties;
    public _tempStage: Stage | null = null;

    public constructor(content: DisplayObject | null = null) {
        super();
        this.touchEnabled = true;
        this._ScrV_Props_ = new ScrollViewProperties();
        if (content) { this.setContent(content); }
    }
    public get bounces(): boolean { return this._ScrV_Props_._bounces; }
    public set bounces(value: boolean) { this._ScrV_Props_._bounces = !!value; }
    public setContent(content: DisplayObject | null): void {
        if (this._content === content) { return; }
        this.removeContent();
        if (content) { this._content = content; super.addChild(content); this._addEvents(); }
    }
    public removeContent(): void {
        if (this._content) { this._removeEvents(); super.removeChildAt(0); }
        this._content = null;
    }
    public get verticalScrollPolicy(): ScrollPolicy { return this._ScrV_Props_._verticalScrollPolicy; }
    public set verticalScrollPolicy(value: ScrollPolicy) {
        if (value == this._ScrV_Props_._verticalScrollPolicy) { return; }
        this._ScrV_Props_._verticalScrollPolicy = value;
    }
    public get horizontalScrollPolicy(): ScrollPolicy { return this._ScrV_Props_._horizontalScrollPolicy; }
    public set horizontalScrollPolicy(value: ScrollPolicy) {
        if (value == this._ScrV_Props_._horizontalScrollPolicy) { return; }
        this._ScrV_Props_._horizontalScrollPolicy = value;
    }
    public get scrollLeft(): number { return this._ScrV_Props_._scrollLeft; }
    public set scrollLeft(value: number) {
        if (value == this._ScrV_Props_._scrollLeft) { return; }
        this._ScrV_Props_._scrollLeft = value;
        this._validatePosition(false, true);
        this._updateContentPosition();
    }
    public get scrollTop(): number { return this._ScrV_Props_._scrollTop; }
    public set scrollTop(value: number) {
        if (value == this._ScrV_Props_._scrollTop) { return; }
        this._ScrV_Props_._scrollTop = value;
        this._validatePosition(true, false);
        this._updateContentPosition();
    }
    public setScrollPosition(top: number, left: number, isOffset: boolean = false): void {
        if (isOffset && top == 0 && left == 0) { return; }
        if (!isOffset && this._ScrV_Props_._scrollTop == top && this._ScrV_Props_._scrollLeft == left) { return; }
        const oldTop: number = this._ScrV_Props_._scrollTop;
        const oldLeft: number = this._ScrV_Props_._scrollLeft;
        if (isOffset) {
            const maxLeft: number = this.getMaxScrollLeft();
            const maxTop: number = this.getMaxScrollTop();
            if (oldTop <= 0 || oldTop >= maxTop) { top /= 2; }
            if (oldLeft <= 0 || oldLeft >= maxLeft) { left /= 2; }
            let newTop: number = oldTop + top;
            let newLeft: number = oldLeft + left;
            const bounces: boolean = this._ScrV_Props_._bounces;
            if (!bounces) {
                if (newTop <= 0 || newTop >= maxTop) { newTop = Math.max(0, Math.min(newTop, maxTop)); }
                if (newLeft <= 0 || newLeft >= maxLeft) { newLeft = Math.max(0, Math.min(newLeft, maxLeft)); }
            }
            this._ScrV_Props_._scrollTop = newTop;
            this._ScrV_Props_._scrollLeft = newLeft;
        } else { this._ScrV_Props_._scrollTop = top; this._ScrV_Props_._scrollLeft = left; }
        this._validatePosition(true, true);
        this._updateContentPosition();
    }
    public _validatePosition(top: boolean = false, left: boolean = false): void {
        if (top) {
            const height: number = this.height;
            const contentHeight: number = this._getContentHeight();
            this._ScrV_Props_._scrollTop = Math.max(this._ScrV_Props_._scrollTop, -height / 2);
            this._ScrV_Props_._scrollTop = Math.min(this._ScrV_Props_._scrollTop, contentHeight > height ? contentHeight - height / 2 : height / 2);
        }
        if (left) {
            const width: number = this.width;
            const contentWidth: number = this._getContentWidth();
            this._ScrV_Props_._scrollLeft = Math.max(this._ScrV_Props_._scrollLeft, -width / 2);
            this._ScrV_Props_._scrollLeft = Math.min(this._ScrV_Props_._scrollLeft, contentWidth > width ? contentWidth - width / 2 : width / 2);
        }
    }
    public $setWidth(value: number): void {
        if (this.$explicitWidth == value) { return; }
        super.$setWidth(value);
        this._updateContentPosition();
    }
    public $setHeight(value: number): void {
        if (this.$explicitHeight == value) { return; }
        super.$setHeight(value);
        this._updateContentPosition();
    }
    public _updateContentPosition(): void {
        const height: number = this.height;
        const width: number = this.width;
        this.scrollRect = new Rectangle(Math.round(this._ScrV_Props_._scrollLeft), Math.round(this._ScrV_Props_._scrollTop), width, height);
        this.dispatchEvent(new Event(Event.CHANGE));
    }
    public _checkScrollPolicy(): boolean {
        const hpolicy: ScrollPolicy = this._ScrV_Props_._horizontalScrollPolicy;
        const hCanScroll: boolean = this.__checkScrollPolicy(hpolicy, this._getContentWidth(), this.width);
        this._ScrV_Props_._hCanScroll = hCanScroll;
        const vpolicy: ScrollPolicy = this._ScrV_Props_._verticalScrollPolicy;
        const vCanScroll: boolean = this.__checkScrollPolicy(vpolicy, this._getContentHeight(), this.height);
        this._ScrV_Props_._vCanScroll = vCanScroll;
        return hCanScroll || vCanScroll;
    }
    public __checkScrollPolicy(policy: ScrollPolicy, contentLength: number, viewLength: number): boolean {
        if (policy == "on") { return true; }
        if (policy == "off") { return false; }
        return contentLength > viewLength;
    }
    public _addEvents(): void {
        this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
        this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
        this.addEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
    }
    public _removeEvents(): void {
        this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
        this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
        this.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
    }
    public _onTouchBegin(event: Event): void {
        const e: TouchEvent = event as TouchEvent;
        if (e.$isDefaultPrevented) { return; }
        const canScroll: boolean = this._checkScrollPolicy();
        if (!canScroll) { return; }
        this._ScrV_Props_._touchStartPosition.x = e.stageX;
        this._ScrV_Props_._touchStartPosition.y = e.stageY;
        if (this._ScrV_Props_._isHTweenPlaying || this._ScrV_Props_._isVTweenPlaying) { this._onScrollFinished(); }
        this._tempStage = this.stage;
        this._tempStage!.addEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
        this._tempStage!.addEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
        this._tempStage!.addEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
        this.addEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);
        this._logTouchEvent(e);
        e.preventDefault();
    }
    public _onTouchBeginCapture(baseEvent: Event): void {
        const event: TouchEvent = baseEvent as TouchEvent;
        let canScroll: boolean = this._checkScrollPolicy();
        if (!canScroll) { return; }
        let target: DisplayObject = event.target as DisplayObject;
        while (target != this) {
            if ("_checkScrollPolicy" in target && typeof target._checkScrollPolicy === "function") {
                canScroll = Boolean(target._checkScrollPolicy());
                if (canScroll) { return; }
            }
            target = target.parent!;
        }
        event.stopPropagation();
        const evt: TouchEvent = this.cloneTouchEvent(event);
        this.delayTouchBeginEvent = evt;
        if (!this.touchBeginTimer) {
            this.touchBeginTimer = new Timer(100, 1);
            this.touchBeginTimer.addEventListener(TimerEvent.TIMER_COMPLETE, this._onTouchBeginTimer, this);
        }
        this.touchBeginTimer.start();
        this._onTouchBegin(event);
    }
    public _onTouchEndCapture(baseEvent: Event): void {
        const event: TouchEvent = baseEvent as TouchEvent;
        if (!this.delayTouchBeginEvent) { return; }
        this._onTouchBeginTimer();
        event.stopPropagation();
        const evt: TouchEvent = this.cloneTouchEvent(event);
        callLater((): void => { if (this.stage) { this.dispatchPropagationEvent(evt); } }, this);
    }
    public _onTouchBeginTimer(): void {
        this.touchBeginTimer!.stop();
        const event: TouchEvent = this.delayTouchBeginEvent!;
        this.delayTouchBeginEvent = null;
        if (this.stage) { this.dispatchPropagationEvent(event); }
    }
    public dispatchPropagationEvent(event: TouchEvent): void {
        const target: DisplayObject | null = event.$target as DisplayObject | null;
        const list: DisplayObject[] = this.$getPropagationList(target);
        const length: number = list.length;
        let targetIndex: number = list.length * 0.5;
        let startIndex: number = -1;
        for (let i: number = 0; i < length; i++) { if (list[i] === this._content) { startIndex = i; break; } }
        list.splice(0, startIndex + 1);
        targetIndex -= startIndex + 1;
        this.$dispatchPropagationEvent(event, list, targetIndex);
        Event.release(event);
    }
    public _onTouchMove(baseEvent: Event): void {
        const event: TouchEvent = baseEvent as TouchEvent;
        if (this._ScrV_Props_._lastTouchPosition.x == event.stageX && this._ScrV_Props_._lastTouchPosition.y == event.stageY) { return; }
        if (!this._ScrV_Props_._scrollStarted) {
            const x: number = event.stageX - this._ScrV_Props_._touchStartPosition.x;
            const y: number = event.stageY - this._ScrV_Props_._touchStartPosition.y;
            const distance: number = Math.sqrt(x * x + y * y);
            if (distance < this.scrollBeginThreshold) { this._logTouchEvent(event); return; }
        }
        this._ScrV_Props_._scrollStarted = true;
        if (this.delayTouchBeginEvent) { this.delayTouchBeginEvent = null; this.touchBeginTimer!.stop(); }
        this.touchChildren = false;
        const offset: ScrollPoint = this._getPointChange(event);
        this.setScrollPosition(offset.y, offset.x, true);
        this._calcVelocitys(event);
        this._logTouchEvent(event);
    }
    public _onTouchEnd(_event: Event): void {
        this.touchChildren = true;
        this._ScrV_Props_._scrollStarted = false;
        this._tempStage!.removeEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
        this._tempStage!.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
        this._tempStage!.removeEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
        this.removeEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);
        this._moveAfterTouchEnd();
    }
    public _onEnterFrame(_event: Event): void {
        const time: number = getTimer();
        if (time - this._ScrV_Props_._lastTouchTime > 100 && time - this._ScrV_Props_._lastTouchTime < 300) {
            this._calcVelocitys(this._ScrV_Props_._lastTouchEvent!);
        }
    }
    public _logTouchEvent(e: TouchEvent): void {
        this._ScrV_Props_._lastTouchPosition.x = e.stageX;
        this._ScrV_Props_._lastTouchPosition.y = e.stageY;
        this._ScrV_Props_._lastTouchEvent = this.cloneTouchEvent(e);
        this._ScrV_Props_._lastTouchTime = getTimer();
    }
    public _getPointChange(e: TouchEvent): ScrollPoint {
        return {
            x: this._ScrV_Props_._hCanScroll === false ? 0 : this._ScrV_Props_._lastTouchPosition.x - e.stageX,
            y: this._ScrV_Props_._vCanScroll === false ? 0 : this._ScrV_Props_._lastTouchPosition.y - e.stageY
        };
    }
    public _calcVelocitys(e: TouchEvent): void {
        const time: number = getTimer();
        if (this._ScrV_Props_._lastTouchTime == 0) { this._ScrV_Props_._lastTouchTime = time; return; }
        const change: ScrollPoint = this._getPointChange(e);
        const timeoffset: number = time - this._ScrV_Props_._lastTouchTime;
        change.x /= timeoffset;
        change.y /= timeoffset;
        this._ScrV_Props_._velocitys.push(change);
        if (this._ScrV_Props_._velocitys.length > 5) { this._ScrV_Props_._velocitys.shift(); }
        this._ScrV_Props_._lastTouchPosition.x = e.stageX;
        this._ScrV_Props_._lastTouchPosition.y = e.stageY;
    }
    public _getContentWidth(): number { return this._content!.$explicitWidth || this._content!.width; }
    public _getContentHeight(): number { return this._content!.$explicitHeight || this._content!.height; }
    public getMaxScrollLeft(): number { const max: number = this._getContentWidth() - this.width; return Math.max(0, max); }
    public getMaxScrollTop(): number { const max: number = this._getContentHeight() - this.height; return Math.max(0, max); }
    public _moveAfterTouchEnd(): void {
        if (this._ScrV_Props_._velocitys.length == 0) { return; }
        const sum: ScrollPoint = { x: 0, y: 0 };
        let totalW: number = 0;
        for (let i: number = 0; i < this._ScrV_Props_._velocitys.length; i++) {
            const v: ScrollPoint = this._ScrV_Props_._velocitys[i]!;
            const w: number = ScrollView.weight[i]!;
            sum.x += v.x * w;
            sum.y += v.y * w;
            totalW += w;
        }
        this._ScrV_Props_._velocitys.length = 0;
        if (this.scrollSpeed <= 0) { this.scrollSpeed = 1; }
        const x: number = sum.x / totalW * this.scrollSpeed;
        const y: number = sum.y / totalW * this.scrollSpeed;
        const pixelsPerMSX: number = Math.abs(x);
        const pixelsPerMSY: number = Math.abs(y);
        const maxLeft: number = this.getMaxScrollLeft();
        const maxTop: number = this.getMaxScrollTop();
        const datax: ScrollAnimationData = pixelsPerMSX > 0.02 ? this.getAnimationDatas(x, this._ScrV_Props_._scrollLeft, maxLeft) : { position: this._ScrV_Props_._scrollLeft, duration: 1 };
        const datay: ScrollAnimationData = pixelsPerMSY > 0.02 ? this.getAnimationDatas(y, this._ScrV_Props_._scrollTop, maxTop) : { position: this._ScrV_Props_._scrollTop, duration: 1 };
        this.setScrollLeft(datax.position, datax.duration);
        this.setScrollTop(datay.position, datay.duration);
    }
    public onTweenFinished(tw: ScrollTween): void {
        if (tw == this._ScrV_Props_._vScrollTween) { this._ScrV_Props_._isVTweenPlaying = false; }
        if (tw == this._ScrV_Props_._hScrollTween) { this._ScrV_Props_._isHTweenPlaying = false; }
        if (!this._ScrV_Props_._isHTweenPlaying && !this._ScrV_Props_._isVTweenPlaying) { this._onScrollFinished(); }
    }
    public _onScrollStarted(): void { }
    public _onScrollFinished(): void {
        ScrollTween.removeTweens(this);
        this._ScrV_Props_._hScrollTween = null;
        this._ScrV_Props_._vScrollTween = null;
        this._ScrV_Props_._isHTweenPlaying = false;
        this._ScrV_Props_._isVTweenPlaying = false;
        this.dispatchEvent(new Event(Event.COMPLETE));
    }
    public setScrollTop(scrollTop: number, duration: number = 0): void {
        const finalPosition: number = Math.min(this.getMaxScrollTop(), Math.max(scrollTop, 0));
        if (duration == 0) { this.scrollTop = finalPosition; return; }
        if (!this._ScrV_Props_._bounces) { scrollTop = finalPosition; }
        const vtween: ScrollTween = ScrollTween.get(this).to({ scrollTop: scrollTop }, duration, ScrollEase.quartOut);
        if (finalPosition != scrollTop) { vtween.to({ scrollTop: finalPosition }, 300, ScrollEase.quintOut); }
        this._ScrV_Props_._isVTweenPlaying = true;
        this._ScrV_Props_._vScrollTween = vtween;
        vtween.call(this.onTweenFinished, this, [vtween]);
        if (!this._ScrV_Props_._isHTweenPlaying) { this._onScrollStarted(); }
    }
    public setScrollLeft(scrollLeft: number, duration: number = 0): void {
        const finalPosition: number = Math.min(this.getMaxScrollLeft(), Math.max(scrollLeft, 0));
        if (duration == 0) { this.scrollLeft = finalPosition; return; }
        if (!this._ScrV_Props_._bounces) { scrollLeft = finalPosition; }
        const htween: ScrollTween = ScrollTween.get(this).to({ scrollLeft: scrollLeft }, duration, ScrollEase.quartOut);
        if (finalPosition != scrollLeft) { htween.to({ scrollLeft: finalPosition }, 300, ScrollEase.quintOut); }
        this._ScrV_Props_._isHTweenPlaying = true;
        this._ScrV_Props_._hScrollTween = htween;
        htween.call(this.onTweenFinished, this, [htween]);
        if (!this._ScrV_Props_._isVTweenPlaying) { this._onScrollStarted(); }
    }
    public getAnimationDatas(pixelsPerMS: number, curPos: number, maxPos: number): ScrollAnimationData {
        const absPixelsPerMS: number = Math.abs(pixelsPerMS);
        const extraFricition: number = 0.95;
        let duration: number = 0;
        const friction: number = 0.998;
        const minVelocity: number = 0.02;
        let posTo: number = curPos + pixelsPerMS * 500;
        if (posTo < 0 || posTo > maxPos) {
            posTo = curPos;
            while (Math.abs(pixelsPerMS) != Infinity && Math.abs(pixelsPerMS) > minVelocity) {
                posTo += pixelsPerMS;
                if (posTo < 0 || posTo > maxPos) { pixelsPerMS *= friction * extraFricition; }
                else { pixelsPerMS *= friction; }
                duration++;
            }
        } else { duration = -Math.log(minVelocity / absPixelsPerMS) * 500; }
        const result: ScrollAnimationData = { position: Math.min(maxPos + 50, Math.max(posTo, -50)), duration: duration };
        return result;
    }
    public cloneTouchEvent(event: TouchEvent): TouchEvent {
        const evt: TouchEvent = new TouchEvent(event.type, event.bubbles, event.cancelable);
        evt.touchPointID = event.touchPointID;
        evt.$stageX = event.stageX;
        evt.$stageY = event.stageY;
        evt.touchDown = event.touchDown;
        evt.$isDefaultPrevented = false;
        evt.$target = event.target;
        return evt;
    }
    public throwNotSupportedError(): never { return $error(1023); }
    public addChild(_child: DisplayObject): never { return this.throwNotSupportedError(); }
    public addChildAt(_child: DisplayObject, _index: number): never { return this.throwNotSupportedError(); }
    public removeChild(_child: DisplayObject): never { return this.throwNotSupportedError(); }
    public removeChildAt(_index: number): never { return this.throwNotSupportedError(); }
    public setChildIndex(_child: DisplayObject, _index: number): void { this.throwNotSupportedError(); }
    public swapChildren(_child1: DisplayObject, _child2: DisplayObject): void { this.throwNotSupportedError(); }
    public swapChildrenAt(_index1: number, _index2: number): void { this.throwNotSupportedError(); }
}
__reflect(ScrollView.prototype, "egret.ScrollView");

export class ScrollViewProperties {
    public _verticalScrollPolicy: ScrollPolicy = "auto";
    public _horizontalScrollPolicy: ScrollPolicy = "auto";
    public _scrollLeft: number = 0;
    public _scrollTop: number = 0;
    public _hCanScroll: boolean = false;
    public _vCanScroll: boolean = false;
    public _lastTouchPosition: Point = new Point(0, 0);
    public _touchStartPosition: Point = new Point(0, 0);
    public _scrollStarted: boolean = false;
    public _lastTouchTime: number = 0;
    public _lastTouchEvent: TouchEvent | null = null;
    public _velocitys: ScrollPoint[] = [];
    public _isHTweenPlaying: boolean = false;
    public _isVTweenPlaying: boolean = false;
    public _hScrollTween: ScrollTween | null = null;
    public _vScrollTween: ScrollTween | null = null;
    public _bounces: boolean = true;
}
__reflect(ScrollViewProperties.prototype, "egret.ScrollViewProperties");

export class MovieClip extends DisplayObject {
    public $texture: Texture | null = null;
    public offsetPoint: Point = Point.create(0, 0);
    public $movieClipData: MovieClipData | null | undefined = null;
    public frames: MovieClipFrameData[] | null = null;
    public $totalFrames: number = 0;
    public frameLabels: FrameLabel[] | null = null;
    public $frameLabelStart: number = 0;
    public $frameLabelEnd: number | undefined = 0;
    public frameEvents: (string | undefined)[] | null = null;
    public frameIntervalTime: number = 0;
    public $eventPool: string[] | null = null;
    public $isPlaying: boolean = false;
    public isStopped: boolean = true;
    public playTimes: number = 0;
    public $currentFrameNum: number = 0;
    public $nextFrameNum: number = 1;
    public displayedKeyFrameNum: number = 0;
    public passedTime: number = 0;
    public $frameRate: number = NaN;
    public lastTime: number = 0;
    public $smoothing: boolean;

    public constructor(movieClipData?: MovieClipData | null) {
        super();
        this.$smoothing = Bitmap.defaultSmoothing;
        this.setMovieClipData(movieClipData);
        this.$renderNode = new runtime.sys.NormalBitmapNode();
    }
    public get smoothing(): boolean { return this.$smoothing; }
    public set smoothing(value: boolean) {
        if (value == this.$smoothing) { return; }
        this.$smoothing = value;
    }
    public $init(): void {
        this.$reset();
        const movieClipData: MovieClipData | null | undefined = this.$movieClipData;
        if (movieClipData && movieClipData.$isDataValid()) {
            this.frames = movieClipData.frames;
            this.$totalFrames = movieClipData.numFrames;
            this.frameLabels = movieClipData.labels;
            this.frameEvents = movieClipData.events;
            this.$frameRate = movieClipData.frameRate;
            this.frameIntervalTime = 1000 / this.$frameRate;
            this._initFrame();
        }
    }
    public $reset(): void {
        this.frames = null;
        this.playTimes = 0;
        this.$isPlaying = false;
        this.setIsStopped(true);
        this.$currentFrameNum = 0;
        this.$nextFrameNum = 1;
        this.displayedKeyFrameNum = 0;
        this.passedTime = 0;
        this.$eventPool = [];
    }
    public _initFrame(): void {
        if (this.$movieClipData!.$isTextureValid()) { this.advanceFrame(); this.constructFrame(); }
    }
    public $updateRenderNode(): void {
        const texture: Texture | null = this.$texture;
        if (texture) {
            const offsetX: number = Math.round(this.offsetPoint.x);
            const offsetY: number = Math.round(this.offsetPoint.y);
            const bitmapWidth: number = texture.$bitmapWidth;
            const bitmapHeight: number = texture.$bitmapHeight;
            const textureWidth: number = texture.$getTextureWidth();
            const textureHeight: number = texture.$getTextureHeight();
            const destW: number = Math.round(texture.$getScaleBitmapWidth());
            const destH: number = Math.round(texture.$getScaleBitmapHeight());
            const sourceWidth: number = texture.$sourceWidth;
            const sourceHeight: number = texture.$sourceHeight;
            runtime.sys.BitmapNode.$updateTextureData(this.$renderNode as sys.NormalBitmapNode, texture.$bitmapData, texture.$bitmapX, texture.$bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight, BitmapFillMode.SCALE, this.$smoothing);
        }
    }
    public $measureContentBounds(bounds: Rectangle): void {
        const texture: Texture | null = this.$texture;
        if (texture) {
            const x: number = this.offsetPoint.x;
            const y: number = this.offsetPoint.y;
            const w: number = texture.$getTextureWidth();
            const h: number = texture.$getTextureHeight();
            bounds.setTo(x, y, w, h);
        } else { bounds.setEmpty(); }
    }
    public $onAddToStage(stage: Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);
        if (this.$isPlaying && this.$totalFrames > 1) { this.setIsStopped(false); }
    }
    public $onRemoveFromStage(): void { super.$onRemoveFromStage(); this.setIsStopped(true); }
    public getFrameLabelByName(labelName: string, ignoreCase: boolean = false): FrameLabel | null {
        if (ignoreCase) { labelName = labelName.toLowerCase(); }
        const frameLabels: FrameLabel[] | null = this.frameLabels;
        if (frameLabels) {
            for (let i: number = 0; i < frameLabels.length; i++) {
                const outputFrameLabel: FrameLabel = frameLabels[i]!;
                if (ignoreCase ? outputFrameLabel.name.toLowerCase() == labelName : outputFrameLabel.name == labelName) { return outputFrameLabel; }
            }
        }
        return null;
    }
    public getFrameStartEnd(labelName: string): void {
        const frameLabels: FrameLabel[] | null = this.frameLabels;
        if (frameLabels) {
            for (let i: number = 0; i < frameLabels.length; i++) {
                const outputFrameLabel: FrameLabel = frameLabels[i]!;
                if (labelName == outputFrameLabel.name) {
                    this.$frameLabelStart = outputFrameLabel.frame;
                    this.$frameLabelEnd = outputFrameLabel.end;
                    break;
                }
            }
        }
    }
    public getFrameLabelByFrame(frame: number): FrameLabel | null {
        const frameLabels: FrameLabel[] | null = this.frameLabels;
        if (frameLabels) {
            for (let i: number = 0; i < frameLabels.length; i++) {
                const outputFrameLabel: FrameLabel = frameLabels[i]!;
                if (outputFrameLabel.frame == frame) { return outputFrameLabel; }
            }
        }
        return null;
    }
    public getFrameLabelForFrame(frame: number): FrameLabel | null {
        let outputFrameLabel: FrameLabel | null = null;
        const frameLabels: FrameLabel[] | null = this.frameLabels;
        if (frameLabels) {
            for (let i: number = 0; i < frameLabels.length; i++) {
                const tempFrameLabel: FrameLabel = frameLabels[i]!;
                if (tempFrameLabel.frame > frame) { return outputFrameLabel; }
                outputFrameLabel = tempFrameLabel;
            }
        }
        return outputFrameLabel;
    }
    public play(playTimes: number = 0): void {
        this.lastTime = getTimer();
        this.passedTime = 0;
        this.$isPlaying = true;
        this.setPlayTimes(playTimes);
        if (this.$totalFrames > 1 && this.$stage) { this.setIsStopped(false); }
    }
    public stop(): void { this.$isPlaying = false; this.setIsStopped(true); }
    public prevFrame(): void { this.gotoAndStop(this.$currentFrameNum - 1); }
    public nextFrame(): void { this.gotoAndStop(this.$currentFrameNum + 1); }
    public gotoAndPlay(frame: number | string, playTimes: number = 0): void {
        if (arguments.length == 0 || arguments.length > 2) { $error(1022, "MovieClip.gotoAndPlay()"); }
        if (typeof frame === "string") { this.getFrameStartEnd(frame); }
        else { this.$frameLabelStart = 0; this.$frameLabelEnd = 0; }
        this.play(playTimes);
        this.gotoFrame(frame);
    }
    public gotoAndStop(frame: number | string): void {
        if (arguments.length != 1) { $error(1022, "MovieClip.gotoAndStop()"); }
        this.stop();
        this.gotoFrame(frame);
    }
    public gotoFrame(frame: number | string): void {
        let frameNum: number;
        if (typeof frame === "string") { frameNum = this.getFrameLabelByName(frame)!.frame; }
        else {
            frameNum = parseInt(frame + "", 10);
            if (frameNum != frame) { $error(1022, "Frame Label Not Found"); }
        }
        if (frameNum < 1) { frameNum = 1; } else if (frameNum > this.$totalFrames) { frameNum = this.$totalFrames; }
        if (frameNum == this.$nextFrameNum) { return; }
        this.$nextFrameNum = frameNum;
        this.advanceFrame();
        this.constructFrame();
        this.handlePendingEvent();
    }
    public advanceTime(timeStamp: number): boolean {
        const self: this = this;
        const advancedTime: number = timeStamp - self.lastTime;
        self.lastTime = timeStamp;
        const frameIntervalTime: number = self.frameIntervalTime;
        const currentTime: number = self.passedTime + advancedTime;
        self.passedTime = currentTime % frameIntervalTime;
        let num: number = currentTime / frameIntervalTime;
        if (num < 1) { return false; }
        while (num >= 1) {
            num--;
            self.$nextFrameNum++;
            if (self.$nextFrameNum > self.$totalFrames || (self.$frameLabelStart > 0 && self.$nextFrameNum > self.$frameLabelEnd!)) {
                if (self.playTimes == -1) { self.$eventPool!.push(Event.LOOP_COMPLETE); self.$nextFrameNum = 1; }
                else {
                    self.playTimes--;
                    if (self.playTimes > 0) { self.$eventPool!.push(Event.LOOP_COMPLETE); self.$nextFrameNum = 1; }
                    else {
                        self.$nextFrameNum = self.$totalFrames;
                        self.$eventPool!.push(Event.COMPLETE);
                        self.stop();
                        break;
                    }
                }
            }
            if (self.$currentFrameNum == self.$frameLabelEnd) { self.$nextFrameNum = self.$frameLabelStart; }
            self.advanceFrame();
        }
        self.constructFrame();
        self.handlePendingEvent();
        return false;
    }
    public advanceFrame(): void {
        this.$currentFrameNum = this.$nextFrameNum;
        const event: string | undefined = this.frameEvents![this.$nextFrameNum];
        if (event && event != "") { MovieClipEvent.dispatchMovieClipEvent(this, MovieClipEvent.FRAME_LABEL, event); }
    }
    public constructFrame(): void {
        const self: this = this;
        const currentFrameNum: number = self.$currentFrameNum;
        if (self.displayedKeyFrameNum == currentFrameNum) { return; }
        const texture: Texture | null = self.$movieClipData!.getTextureByFrame(currentFrameNum);
        self.$texture = texture;
        self.$movieClipData!.$getOffsetByFrame(currentFrameNum, self.offsetPoint);
        self.displayedKeyFrameNum = currentFrameNum;
        self.$renderDirty = true;
        {
            const p: DisplayObjectContainer | null = self.$parent;
            if (p && !p.$cacheDirty) { p.$cacheDirty = true; p.$cacheDirtyUp(); }
            const maskedObject: DisplayObject | null = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) { maskedObject.$cacheDirty = true; maskedObject.$cacheDirtyUp(); }
        }
    }
    public $renderFrame(): void {
        const self: this = this;
        self.$texture = self.$movieClipData!.getTextureByFrame(self.$currentFrameNum);
        self.$renderDirty = true;
        const p: DisplayObjectContainer | null = self.$parent;
        if (p && !p.$cacheDirty) { p.$cacheDirty = true; p.$cacheDirtyUp(); }
        const maskedObject: DisplayObject | null = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) { maskedObject.$cacheDirty = true; maskedObject.$cacheDirtyUp(); }
    }
    public handlePendingEvent(): void {
        if (this.$eventPool!.length != 0) {
            this.$eventPool!.reverse();
            const eventPool: string[] = this.$eventPool!;
            const length: number = eventPool.length;
            let isComplete: boolean = false;
            let isLoopComplete: boolean = false;
            for (let i: number = 0; i < length; i++) {
                const event: string = eventPool.pop()!;
                if (event == Event.LOOP_COMPLETE) { isLoopComplete = true; }
                else if (event == Event.COMPLETE) { isComplete = true; }
                else { this.dispatchEventWith(event); }
            }
            if (isLoopComplete) { this.dispatchEventWith(Event.LOOP_COMPLETE); }
            if (isComplete) { this.dispatchEventWith(Event.COMPLETE); }
        }
    }
    public get totalFrames(): number { return this.$totalFrames; }
    public get currentFrame(): number { return this.$currentFrameNum; }
    public get currentFrameLabel(): string | null {
        const label: FrameLabel | null = this.getFrameLabelByFrame(this.$currentFrameNum);
        return label && label.name;
    }
    public get currentLabel(): string | null {
        const label: FrameLabel | null = this.getFrameLabelForFrame(this.$currentFrameNum);
        return label ? label.name : null;
    }
    public get frameRate(): number { return this.$frameRate; }
    public set frameRate(value: number) {
        if (value == this.$frameRate) { return; }
        this.$frameRate = value;
        this.frameIntervalTime = 1000 / this.$frameRate;
    }
    public get isPlaying(): boolean { return this.$isPlaying; }
    public get movieClipData(): MovieClipData | null | undefined { return this.$movieClipData; }
    public set movieClipData(value: MovieClipData | null | undefined) { this.setMovieClipData(value); }
    public setMovieClipData(value: MovieClipData | null | undefined): void {
        if (this.$movieClipData == value) { return; }
        this.$movieClipData = value;
        this.$init();
    }
    public setPlayTimes(value: number): void { if (value < 0 || value >= 1) { this.playTimes = value < 0 ? -1 : Math.floor(value); } }
    public setIsStopped(value: boolean): void {
        if (this.isStopped == value) { return; }
        this.isStopped = value;
        if (value) { getTicker().$stopTick(this.advanceTime, this); }
        else {
            this.playTimes = this.playTimes == 0 ? 1 : this.playTimes;
            this.lastTime = getTimer();
            getTicker().$startTick(this.advanceTime, this);
        }
    }
}
__reflect(MovieClip.prototype, "egret.MovieClip");

export class URLRequest extends HashObject {
    public data: URLRequestData = null;
    public method: string = URLRequestMethod.GET;
    public url: string | null = "";
    public requestHeaders: URLRequestHeader[] = [];
    public constructor(url: string | null = null) { super(); this.url = url; }
}
__reflect(URLRequest.prototype, "egret.URLRequest");

export class URLRequestHeader {
    public name: string;
    public value: string;

    public constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}
__reflect(URLRequestHeader.prototype, "egret.URLRequestHeader");

export class URLRequestMethod {
    public static GET: string = "get";
    public static POST: string = "post";
}
__reflect(URLRequestMethod.prototype, "egret.URLRequestMethod");

export class URLVariables extends HashObject {
    public variables: URLVariableMap | null = null;

    public constructor(source: string | null = null) {
        super();
        if (source !== null) { this.decode(source); }
    }
    public decode(source: string): void {
        if (!this.variables) { this.variables = {}; }
        source = source.split("+").join(" ");
        let tokens: RegExpExecArray | null;
        const re: RegExp = /[?&]?([^=]+)=([^&]*)/g;
        while ((tokens = re.exec(source)) !== null) {
            const key: string = decodeURIComponent(tokens[1]!);
            const val: string = decodeURIComponent(tokens[2]!);
            if ((key in this.variables) == false) {
                this.variables[key] = val;
                continue;
            }
            const value: URLVariableValue = this.variables[key]!;
            if (value instanceof Array) { value.push(val); }
            else { this.variables[key] = [value, val]; }
        }
    }
    public toString(): string {
        if (!this.variables) { return ""; }
        const variables: URLVariableMap = this.variables;
        const stringArray: string[] = [];
        let key: string;
        for (key in variables) { stringArray.push(this.encodeValue(key, variables[key]!)); }
        return stringArray.join("&");
    }
    private encodeValue(key: string, value: URLVariableValue): string {
        if (value instanceof Array) { return this.encodeArray(key, value); }
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }
    private encodeArray(key: string, value: URLVariableScalar[]): string {
        if (!key) { return ""; }
        if (value.length == 0) { return encodeURIComponent(key) + "="; }
        return value.map((v: URLVariableScalar): string => encodeURIComponent(key) + "=" + encodeURIComponent(v)).join("&");
    }
}
__reflect(URLVariables.prototype, "egret.URLVariables");

export class MainContext extends EventDispatcher {
    private static _instance: MainContext | undefined;
    private static _deviceType: string | null = null;
    public static DEVICE_PC: string = "web";
    public static DEVICE_MOBILE: string = "native";

    public static get instance(): MainContext {
        if (MainContext._instance == null) {
            MainContext._instance = new MainContext();
        }
        return MainContext._instance;
    }

    public static get deviceType(): string {
        if (MainContext._deviceType == null) {
            MainContext._deviceType = MainContext.testDeviceType() ? MainContext.DEVICE_MOBILE : MainContext.DEVICE_PC;
        }
        return MainContext._deviceType;
    }

    private static testDeviceType(): boolean {
        if (!window.navigator || !navigator) { return true; }
        const ua: string = navigator.userAgent.toLowerCase();
        return ua.indexOf("mobile") != -1 || ua.indexOf("android") != -1;
    }

    public get stage(): Stage {
        return runtime.sys.TempStageHelper.$TempStage!;
    }
}
__reflect(MainContext.prototype, "egret.MainContext");

export class Recycler<T extends object = object> extends HashObject {
    private static _callBackList: RecyclerFrameCheck[] = [];
    private static _isInited = false;

    private objectPool: T[] = [];
    private _length: number = 0;
    private autoDisposeTime: number;
    private frameCount: number;

    public constructor(autoDisposeTime: number = 300) {
        super();
        if (autoDisposeTime < 1) { autoDisposeTime = 1; }
        this.autoDisposeTime = autoDisposeTime;
        this.frameCount = 0;
    }
    public static $init(): void {
        if (!Recycler._isInited) {
            Recycler._isInited = true;
            getTicker().$startTick(Recycler.onUpdate, Recycler);
        }
    }
    private static onUpdate(_timeStamp: number): boolean {
        const list: RecyclerFrameCheck[] = Recycler._callBackList;
        for (let i: number = list.length - 1; i >= 0; i--) { list[i]!.$checkFrame(); }
        return false;
    }
    public $checkFrame(): void {
        this.frameCount--;
        if (this.frameCount <= 0) { this.dispose(); }
    }
    public get length(): number { return this._length; }
    public push(object: T): void {
        const pool: T[] = this.objectPool;
        if (pool.indexOf(object) == -1) {
            pool.push(object);
            if ("__recycle" in object && typeof object.__recycle === "function") { object.__recycle(); }
            this._length++;
            if (this.frameCount == 0) {
                this.frameCount = this.autoDisposeTime;
                Recycler._callBackList.push(this);
            }
        }
    }
    public pop(): T | null {
        if (this._length == 0) { return null; }
        this._length--;
        return this.objectPool.pop()!;
    }
    public dispose(): void {
        if (this._length > 0) { this.objectPool = []; this._length = 0; }
        this.frameCount = 0;
        const list: RecyclerFrameCheck[] = Recycler._callBackList;
        const index: number = list.indexOf(this);
        if (index != -1) { list.splice(index, 1); }
    }
}
__reflect(Recycler.prototype, "egret.Recycler");

export class WebSocket extends EventDispatcher {
    public static TYPE_STRING: string = "webSocketTypeString";
    public static TYPE_BINARY: string = "webSocketTypeBinary";
    private _writeMessage: string = "";
    private _readMessage: string = "";
    private _connected: boolean = false;
    private _connecting: boolean = false;
    private _bytesWrite: boolean = false;
    private _type: string = WebSocket.TYPE_STRING;
    private _readByte: ByteArray | undefined;
    private _writeByte: ByteArray | undefined;
    private socket: web.HTML5WebSocket;

    public constructor(_host: string = "", _port: number = 0) {
        super();
        this.socket = new runtime.web.HTML5WebSocket();
        this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
    }
    public connect(host: string, port: number): void {
        if (!this._connecting && !this._connected) {
            this._connecting = true;
            this.socket.connect(host, port);
        }
    }
    public connectByUrl(url: string): void {
        if (!this._connecting && !this._connected) {
            this._connecting = true;
            this.socket.connectByUrl(url);
        }
    }
    public close(): void { if (this._connected) { this.socket.close(); } }
    private onConnect(): void {
        this._connected = true;
        this._connecting = false;
        this.dispatchEventWith(Event.CONNECT);
    }
    private onClose(): void {
        this._connected = false;
        this.dispatchEventWith(Event.CLOSE);
    }
    private onError(): void {
        if (this._connecting) { this._connecting = false; }
        this.dispatchEventWith(IOErrorEvent.IO_ERROR);
    }
    private onSocketData(message: SocketMessage): void {
        if (typeof message == "string") { this._readMessage += message; }
        else {
            // ���ݺ�˴����¼�����ľ�·�������� Uint8Array ��ԭʼת����Ϊ��
            this._readByte!._writeUint8Array(new Uint8Array(message as ArrayBuffer));
        }
        ProgressEvent.dispatchProgressEvent(this, ProgressEvent.SOCKET_DATA);
    }
    public flush(): void {
        if (!this._connected) { $warn(3101); return; }
        if (this._writeMessage) { this.socket.send(this._writeMessage); this._writeMessage = ""; }
        if (this._bytesWrite) {
            this.socket.send(this._writeByte!.buffer);
            this._bytesWrite = false;
            this._writeByte!.clear();
        }
    }
    public writeUTF(message: string): void {
        if (!this._connected) { $warn(3101); return; }
        if (this._type == WebSocket.TYPE_BINARY) {
            this._bytesWrite = true;
            this._writeByte!.writeUTF(message);
        } else { this._writeMessage += message; }
        this.flush();
    }
    public readUTF(): string {
        let message: string;
        if (this._type == WebSocket.TYPE_BINARY) {
            this._readByte!.position = 0;
            message = this._readByte!.readUTF()!;
            this._readByte!.clear();
        } else { message = this._readMessage; this._readMessage = ""; }
        return message;
    }
    public writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
        if (!this._connected) { $warn(3101); return; }
        if (!this._writeByte) { $warn(3102); return; }
        this._bytesWrite = true;
        this._writeByte.writeBytes(bytes, offset, length);
        this.flush();
    }
    public readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
        if (!this._readByte) { $warn(3102); return; }
        this._readByte.position = 0;
        this._readByte.readBytes(bytes, offset, length);
        this._readByte.clear();
    }
    public get connected(): boolean { return this._connected; }
    public get type(): string { return this._type; }
    public set type(value: string) {
        this._type = value;
        if (value == WebSocket.TYPE_BINARY && !this._writeByte) {
            this._readByte = new ByteArray();
            this._writeByte = new ByteArray();
        }
    }
}
__reflect(WebSocket.prototype, "egret.WebSocket");

export class Ease {
    public constructor() { $error(1014); }
    public static get(amount: number): EaseFunction {
        if (amount < -1) { amount = -1; }
        if (amount > 1) { amount = 1; }
        return (t: number): number => {
            if (amount == 0) { return t; }
            if (amount < 0) { return t * (t * -amount + 1 + amount); }
            return t * ((2 - t) * amount + (1 - amount));
        };
    }
    public static getPowIn(pow: number): EaseFunction { return (t: number): number => Math.pow(t, pow); }
    public static getPowOut(pow: number): EaseFunction { return (t: number): number => 1 - Math.pow(1 - t, pow); }
    public static getPowInOut(pow: number): EaseFunction {
        return (t: number): number => {
            if ((t *= 2) < 1) { return 0.5 * Math.pow(t, pow); }
            return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
        };
    }
    public static sineIn(t: number): number { return 1 - Math.cos(t * Math.PI / 2); }
    public static sineOut(t: number): number { return Math.sin(t * Math.PI / 2); }
    public static sineInOut(t: number): number { return -0.5 * (Math.cos(Math.PI * t) - 1); }
    public static getBackIn(amount: number): EaseFunction {
        return (t: number): number => t * t * ((amount + 1) * t - amount);
    }
    public static getBackOut(amount: number): EaseFunction {
        return (t: number): number => --t * t * ((amount + 1) * t + amount) + 1;
    }
    public static getBackInOut(amount: number): EaseFunction {
        amount *= 1.525;
        return (t: number): number => {
            if ((t *= 2) < 1) { return 0.5 * (t * t * ((amount + 1) * t - amount)); }
            return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
        };
    }
    public static circIn(t: number): number { return -(Math.sqrt(1 - t * t) - 1); }
    public static circOut(t: number): number { return Math.sqrt(1 - --t * t); }
    public static circInOut(t: number): number {
        if ((t *= 2) < 1) { return -0.5 * (Math.sqrt(1 - t * t) - 1); }
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }
    public static bounceIn(t: number): number { return 1 - Ease.bounceOut(1 - t); }
    public static bounceOut(t: number): number {
        if (t < 1 / 2.75) { return 7.5625 * t * t; }
        if (t < 2 / 2.75) { return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75; }
        if (t < 2.5 / 2.75) { return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375; }
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
    public static bounceInOut(t: number): number {
        if (t < 0.5) { return Ease.bounceIn(t * 2) * 0.5; }
        return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    }
    public static getElasticIn(amplitude: number, period: number): EaseFunction {
        const pi2: number = Math.PI * 2;
        return (t: number): number => {
            if (t == 0 || t == 1) { return t; }
            const s: number = period / pi2 * Math.asin(1 / amplitude);
            return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
        };
    }
    public static getElasticOut(amplitude: number, period: number): EaseFunction {
        const pi2: number = Math.PI * 2;
        return (t: number): number => {
            if (t == 0 || t == 1) { return t; }
            const s: number = period / pi2 * Math.asin(1 / amplitude);
            return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1;
        };
    }
    public static getElasticInOut(amplitude: number, period: number): EaseFunction {
        const pi2: number = Math.PI * 2;
        return (t: number): number => {
            const s: number = period / pi2 * Math.asin(1 / amplitude);
            if ((t *= 2) < 1) { return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period)); }
            return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
        };
    }
    public static quadIn: EaseFunction = Ease.getPowIn(2);
    public static quadOut: EaseFunction = Ease.getPowOut(2);
    public static quadInOut: EaseFunction = Ease.getPowInOut(2);
    public static cubicIn: EaseFunction = Ease.getPowIn(3);
    public static cubicOut: EaseFunction = Ease.getPowOut(3);
    public static cubicInOut: EaseFunction = Ease.getPowInOut(3);
    public static quartIn: EaseFunction = Ease.getPowIn(4);
    public static quartOut: EaseFunction = Ease.getPowOut(4);
    public static quartInOut: EaseFunction = Ease.getPowInOut(4);
    public static quintIn: EaseFunction = Ease.getPowIn(5);
    public static quintOut: EaseFunction = Ease.getPowOut(5);
    public static quintInOut: EaseFunction = Ease.getPowInOut(5);
    public static backIn: EaseFunction = Ease.getBackIn(1.7);
    public static backOut: EaseFunction = Ease.getBackOut(1.7);
    public static backInOut: EaseFunction = Ease.getBackInOut(1.7);
    public static elasticIn: EaseFunction = Ease.getElasticIn(1, 0.3);
    public static elasticOut: EaseFunction = Ease.getElasticOut(1, 0.3);
    public static elasticInOut: EaseFunction = Ease.getElasticInOut(1, 0.3 * 1.5);
}
__reflect(Ease.prototype, "egret.Ease");

export class Tween extends EventDispatcher {
    public static NONE: number = 0;
    public static LOOP: number = 1;
    public static REVERSE: number = 2;
    public static _tweens: Tween[] = [];
    public static IGNORE: object = {};
    public static _plugins: Record<string, TweenPlugin[]> = {};
    public static _inited: boolean = false;
    public static _lastTime: number = 0;
    public _target: TweenTarget | null = null;
    public _useTicks: boolean | undefined = false;
    public ignoreGlobalPause: boolean | undefined = false;
    public loop: boolean | undefined = false;
    public pluginData: TweenProperties | null = null;
    public _steps: (TweenStep | TweenAction)[] = [];
    public paused: boolean = false;
    public duration: number = 0;
    public _prevPos: number = -1;
    public position: number | null = null;
    public _prevPosition: number = 0;
    public _stepPosition: number = 0;
    public passive: boolean = false;
    public _curQueueProps: TweenProperties = {};
    public _initQueueProps: TweenProperties = {};

    public constructor(target: object, props?: TweenOptions | null, pluginData?: TweenProperties | null) {
        super();
        this.initialize(target, props, pluginData);
    }
    public static get(target: object, props?: TweenOptions | null, pluginData: TweenProperties | null = null, override: boolean = false): Tween {
        if (override) { Tween.removeTweens(target); }
        return new Tween(target, props, pluginData);
    }
    public static removeTweens(target: TweenTarget): void {
        if (!target.tween_count) { return; }
        const tweens: Tween[] = Tween._tweens;
        for (let i: number = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]!._target == target) { tweens[i]!.paused = true; tweens.splice(i, 1); }
        }
        target.tween_count = 0;
    }
    public static pauseTweens(target: TweenTarget): void {
        if (!target.tween_count) { return; }
        const tweens: Tween[] = Tween._tweens;
        for (let i: number = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]!._target == target) { tweens[i]!.paused = true; }
        }
    }
    public static resumeTweens(target: TweenTarget): void {
        if (!target.tween_count) { return; }
        const tweens: Tween[] = Tween._tweens;
        for (let i: number = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]!._target == target) { tweens[i]!.paused = false; }
        }
    }
    public static tick(timeStamp: number, paused: boolean = false): boolean {
        const delta: number = timeStamp - Tween._lastTime;
        Tween._lastTime = timeStamp;
        const tweens: Tween[] = Tween._tweens.concat();
        for (let i: number = tweens.length - 1; i >= 0; i--) {
            const tween: Tween = tweens[i]!;
            if ((paused && !tween.ignoreGlobalPause) || tween.paused) { continue; }
            tween.$tick(tween._useTicks ? 1 : delta);
        }
        return false;
    }
    public static _register(tween: Tween, value: boolean): void {
        const target: TweenTarget | null = tween._target;
        const tweens: Tween[] = Tween._tweens;
        if (value) {
            if (target) { target.tween_count = (target.tween_count ?? 0) > 0 ? target.tween_count! + 1 : 1; }
            tweens.push(tween);
            if (!Tween._inited) {
                Tween._lastTime = getTimer();
                getTicker().$startTick(Tween.tick, null);
                Tween._inited = true;
            }
        } else {
            if (target) { target.tween_count = (target.tween_count ?? NaN) - 1; }
            let i: number = tweens.length;
            while (i--) { if (tweens[i] == tween) { tweens.splice(i, 1); return; } }
        }
    }
    public static removeAllTweens(): void {
        const tweens: Tween[] = Tween._tweens;
        for (let i: number = 0, l: number = tweens.length; i < l; i++) {
            const tween: Tween = tweens[i]!;
            tween.paused = true;
            tween._target!.tween_count = 0;
        }
        tweens.length = 0;
    }
    private initialize(target: object, props: TweenOptions | null | undefined, pluginData: TweenProperties | null | undefined): void {
        this._target = target;
        if (props) {
            this._useTicks = props.useTicks;
            this.ignoreGlobalPause = props.ignoreGlobalPause;
            this.loop = props.loop;
            if (props.onChange) { this.addEventListener("change", props.onChange, props.onChangeObj); }
            if (props.override) { Tween.removeTweens(target); }
        }
        this.pluginData = pluginData || {};
        this._curQueueProps = {};
        this._initQueueProps = {};
        this._steps = [];
        if (props && props.paused) { this.paused = true; } else { Tween._register(this, true); }
        if (props && props.position != null) { this.setPosition(props.position, Tween.NONE); }
    }
    public setPosition(value: number, actionsMode: number = 1): boolean {
        if (value < 0) { value = 0; }
        let t: number = value;
        let end: boolean = false;
        if (t >= this.duration) {
            if (this.loop) {
                const newTime: number = t % this.duration;
                t = t > 0 && newTime === 0 ? this.duration : newTime;
            } else { t = this.duration; end = true; }
        }
        if (t == this._prevPos) { return end; }
        if (end) { this.setPaused(true); }
        const prevPos: number = this._prevPos;
        this.position = this._prevPos = t;
        this._prevPosition = value;
        if (this._target && this._steps.length > 0) {
            const l: number = this._steps.length;
            let stepIndex: number = -1;
            for (let i: number = 0; i < l; i++) {
                const step: TweenStep | TweenAction = this._steps[i]!;
                if (step.type == "step") {
                    stepIndex = i;
                    if (step.t <= t && step.t + step.d >= t) { break; }
                }
            }
            for (let i: number = 0; i < l; i++) {
                const step: TweenStep | TweenAction = this._steps[i]!;
                if (step.type == "action") {
                    if (actionsMode != 0) {
                        if (this._useTicks) { this._runAction(step, t, t); }
                        else if (actionsMode == 1 && t < prevPos) {
                            if (prevPos != this.duration) { this._runAction(step, prevPos, this.duration); }
                            this._runAction(step, 0, t, true);
                        } else { this._runAction(step, prevPos, t); }
                    }
                } else if (stepIndex == i) {
                    this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                }
            }
        }
        this.dispatchEventWith("change");
        return end;
    }
    private _runAction(action: TweenAction, startPos: number, endPos: number, includeStart: boolean = false): void {
        let sPos: number = startPos;
        let ePos: number = endPos;
        if (startPos > endPos) { sPos = endPos; ePos = startPos; }
        const pos: number = action.t;
        if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) { action.execute(); }
    }
    private _updateTargetProps(step: TweenStep | null, ratio: number): void {
        let p0: TweenProperties;
        let p1: TweenProperties;
        if (!step && ratio == 1) { this.passive = false; p0 = p1 = this._curQueueProps; }
        else {
            this.passive = !!step!.v;
            if (this.passive) { return; }
            if (step!.e) { ratio = step!.e(ratio, 0, 1, 1); }
            p0 = step!.p0;
            p1 = step!.p1;
        }
        let n: string;
        for (n in this._initQueueProps) {
            let v0: unknown = p0[n];
            let v1: unknown = p1[n];
            if (v0 == null) { p0[n] = v0 = this._initQueueProps[n]; }
            if (v1 == null) { p1[n] = v1 = v0; }
            let v: unknown;
            if (v0 == v1 || ratio == 0 || ratio == 1 || typeof v0 != "number") { v = ratio == 1 ? v1 : v0; }
            else { v = v0 + (Number(v1) - v0) * ratio; }
            let ignore: boolean = false;
            const plugins: TweenPlugin[] | undefined = Tween._plugins[n];
            if (plugins) {
                for (let i: number = 0, l: number = plugins.length; i < l; i++) {
                    const v2: unknown = plugins[i]!.tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                    if (v2 == Tween.IGNORE) { ignore = true; } else { v = v2; }
                }
            }
            if (!ignore) { (this._target as TweenProperties)[n] = v; }
        }
    }
    public setPaused(value: boolean): this {
        if (this.paused == value) { return this; }
        this.paused = value;
        Tween._register(this, !value);
        return this;
    }
    private _cloneProps(props: TweenProperties): TweenProperties {
        const output: TweenProperties = {};
        let n: string;
        for (n in props) { output[n] = props[n]; }
        return output;
    }
    private _addStep(step: Omit<TweenStep, "type" | "t">): this {
        if (step.d > 0) {
            this._steps.push({ ...step, type: "step", t: this.duration });
            this.duration += step.d;
        }
        return this;
    }
    private _appendQueueProps(props: TweenProperties | undefined): TweenProperties {
        let injectProps: TweenProperties | undefined;
        let n: string;
        for (n in props) {
            if (this._initQueueProps[n] === undefined) {
                let oldValue: unknown = (this._target as TweenProperties)[n];
                const plugins: TweenPlugin[] | undefined = Tween._plugins[n];
                if (plugins) {
                    for (let i: number = 0, l: number = plugins.length; i < l; i++) {
                        oldValue = plugins[i]!.init(this, n, oldValue);
                    }
                }
                this._initQueueProps[n] = this._curQueueProps[n] = oldValue === undefined ? null : oldValue;
            }
        }
        for (n in props) {
            const oldValue: unknown = this._curQueueProps[n];
            const plugins: TweenPlugin[] | undefined = Tween._plugins[n];
            if (plugins) {
                injectProps = injectProps || {};
                for (let i: number = 0, l: number = plugins.length; i < l; i++) {
                    const plugin: TweenPlugin = plugins[i]!;
                    if (plugin.step) { plugin.step(this, n, oldValue, props![n], injectProps); }
                }
            }
            this._curQueueProps[n] = props![n];
        }
        if (injectProps) { this._appendQueueProps(injectProps); }
        return this._curQueueProps;
    }
    private _addAction(execute: () => void): this {
        this._steps.push({ type: "action", t: this.duration, execute: execute });
        return this;
    }
    private _set(props: TweenProperties | undefined, target: object): void {
        let n: string;
        for (n in props) { (target as TweenProperties)[n] = props![n]; }
    }
    public wait(duration: number, passive?: boolean): this {
        if (duration == null || duration <= 0) { return this; }
        const props: TweenProperties = this._cloneProps(this._curQueueProps);
        return this._addStep({ d: duration, p0: props, p1: props, v: passive });
    }
    public to(props: TweenProperties | undefined, duration: number = 0, ease?: EaseFunction | null): this {
        if (isNaN(duration) || duration < 0) { duration = 0; }
        this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
        return this.set(props);
    }
    public call<TThis, TArgs extends unknown[], TResult>(callback: (this: TThis, ...args: TArgs) => TResult, thisObj?: TThis, params?: TArgs): this {
        const context: TThis = (thisObj ? thisObj : this._target) as TThis;
        return this._addAction((): void => {
            callback.apply(context, (params ? params : []) as TArgs);
        });
    }
    public set(props: TweenProperties | undefined, target: object | null = null): this {
        this._appendQueueProps(props);
        const destination: object = target ? target : this._target!;
        return this._addAction((): void => { this._set(props, destination); });
    }
    public play(tween: Tween | null = null): this {
        const target: Tween = tween || this;
        return this.call(target.setPaused, target, [false]);
    }
    public pause(tween: Tween | null = null): this {
        const target: Tween = tween || this;
        return this.call(target.setPaused, target, [true]);
    }
    public $tick(delta: number): void {
        if (this.paused) { return; }
        this.setPosition(this._prevPosition + delta);
    }
}
__reflect(Tween.prototype, "egret.Tween");

export class HtmlTextParser {
    public replaceArr: [RegExp, string][] = [];
    public resutlArr: ITextElement[] = [];
    public declare stackArray: ITextStyle[];
    public constructor() { this.initReplaceArr(); }
    public initReplaceArr(): void {
        this.replaceArr = [[/&lt;/g, "<"], [/&gt;/g, ">"], [/&amp;/g, "&"], [/&quot;/g, "\""], [/&apos;/g, "'"]];
    }
    public replaceSpecial(value: string): string {
        for (let i: number = 0; i < this.replaceArr.length; i++) {
            const k: RegExp = this.replaceArr[i]![0];
            const v: string = this.replaceArr[i]![1];
            value = value.replace(k, v);
        }
        return value;
    }
    public parse(htmltext: string): ITextElement[] {
        this.stackArray = []; this.resutlArr = [];
        let firstIdx: number = 0;
        const length: number = htmltext.length;
        while (firstIdx < length) {
            const starIdx: number = htmltext.indexOf("<", firstIdx);
            if (starIdx < 0) { this.addToResultArr(htmltext.substring(firstIdx)); firstIdx = length; }
            else {
                this.addToResultArr(htmltext.substring(firstIdx, starIdx));
                let fontEnd: number = htmltext.indexOf(">", starIdx);
                if (fontEnd == -1) { $error(1038); fontEnd = starIdx; }
                else if (htmltext.charAt(starIdx + 1) == "/") { this.stackArray.pop(); }
                else { this.addToArray(htmltext.substring(starIdx + 1, fontEnd)); }
                firstIdx = fontEnd + 1;
            }
        }
        return this.resutlArr;
    }
    public parser(htmltext: string): ITextElement[] { return this.parse(htmltext); }
    public addToResultArr(value: string): void {
        if (value == "") { return; } value = this.replaceSpecial(value);
        if (this.stackArray.length > 0) { this.resutlArr.push({ text: value, style: this.stackArray[this.stackArray.length - 1]! }); }
        else { this.resutlArr.push({ text: value }); }
    }
    public changeStringToObject(str: string): ITextStyle {
        str = str.trim();
        const info: ITextStyle = {};
        let header: RegExpMatchArray | null;
        if (str.charAt(0) == "i" || str.charAt(0) == "b" || str.charAt(0) == "u") { this.addProperty(info, str, "true"); }
        else if (header = str.match(/^(font|a)\s/)) {
            str = str.substring(header[0].length).trim();
            let next: number = 0;
            let titles: RegExpMatchArray | null;
            while (titles = str.match(this.getHeadReg())) {
                const title: string = titles[0];
                let value: string = "";
                str = str.substring(title.length).trim();
                if (str.charAt(0) == "\"") { next = str.indexOf("\"", 1); value = str.substring(1, next); next++; }
                else if (str.charAt(0) == "'") { next = str.indexOf("'", 1); value = str.substring(1, next); next++; }
                else { value = str.match(/(\S)+/)![0]; next = value.length; }
                this.addProperty(info, title.substring(0, title.length - 1).trim(), value.trim()); str = str.substring(next).trim();
            }
        }
        return info;
    }
    public getHeadReg(): RegExp { return /^(color|textcolor|strokecolor|stroke|b|bold|i|italic|u|size|fontfamily|href|target)(\s)*=/; }
    public addProperty(info: ITextStyle, head: string, value: string): void {
        switch (head.toLowerCase()) {
            case "color": case "textcolor": value = value.replace(/#/, "0x"); info.textColor = parseInt(value); break;
            case "strokecolor": value = value.replace(/#/, "0x"); info.strokeColor = parseInt(value); break;
            case "stroke": info.stroke = parseInt(value); break;
            case "b": case "bold": info.bold = value == "true"; break;
            case "u": info.underline = value == "true"; break;
            case "i": case "italic": info.italic = value == "true"; break;
            case "size": info.size = parseInt(value); break;
            case "fontfamily": info.fontFamily = value; break;
            case "href": info.href = this.replaceSpecial(value); break;
            case "target": info.target = this.replaceSpecial(value); break;
        }
    }
    public addToArray(infoStr: string): void {
        const info: ITextStyle = this.changeStringToObject(infoStr);
        if (this.stackArray.length > 0) {
            const lastInfo: ITextStyle = this.stackArray[this.stackArray.length - 1]!;
            const keys: (keyof ITextStyle)[] = Object.keys(lastInfo) as (keyof ITextStyle)[];
            for (let i: number = 0; i < keys.length; i++) { inheritStyle(keys[i]!); }
            function inheritStyle<K extends keyof ITextStyle>(key: K): void {
                const value: ITextStyle[K] = lastInfo[key];
                if (info[key] == null && value !== undefined) { info[key] = value; }
            }
        }
        this.stackArray.push(info);
    }
}
__reflect(HtmlTextParser.prototype, "egret.HtmlTextParser");

export class InputController extends HashObject {
    public stageTextAdded: boolean = false;
    public _text: InputTextField | null = null;
    public _isFocus: boolean = false;
    public declare stageText: StageText;
    public declare tempStage: Stage;
    public init(text: InputTextField): void {
        this._text = text;
        this.stageText = new (getStageText())();
        this.stageText.$setTextField(this._text);
    }
    public _addStageText(): void {
        if (this.stageTextAdded) { return; }
        if (!this._text!.$inputEnabled) { this._text!.$touchEnabled = true; }
        this.tempStage = this._text!.stage!; this.stageText.$addToStage();
        this.stageText.addEventListener("updateText", this.updateTextHandler, this);
        this._text!.addEventListener(TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
        this.stageText.addEventListener("blur", this.blurHandler, this);
        this.stageText.addEventListener("focus", this.focusHandler, this); this.stageTextAdded = true;
    }
    public _removeStageText(): void {
        if (!this.stageTextAdded) { return; }
        if (!this._text!.$inputEnabled) { this._text!.$touchEnabled = false; }
        this.stageText.$removeFromStage();
        this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
        this._text!.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
        this.tempStage.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
        this.stageText.removeEventListener("blur", this.blurHandler, this);
        this.stageText.removeEventListener("focus", this.focusHandler, this); this.stageTextAdded = false;
    }
    public _getText(): string { return this.stageText.$getText(); }
    public _setText(value: string): void { this.stageText.$setText(value); }
    public _setColor(value: number): void { this.stageText.$setColor(value); }
    public focusHandler(event: Event & { showing?: boolean }): void {
        if (!this._isFocus) {
            this._isFocus = true;
            if (!event.showing) { this._text!.$setIsTyping(true); }
            this._text!.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN, true));
        }
    }
    public blurHandler(_event: Event): void {
        if (this._isFocus) {
            this._isFocus = false; this.tempStage.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            this._text!.$setIsTyping(false); this.stageText.$onBlur(); this._text!.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT, true));
        }
    }
    public onMouseDownHandler(_event: Event): void { this.$onFocus(); }
    public $onFocus(): void {
        if (!this._text!.visible || this._isFocus) { return; }
        this.tempStage.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
        callLater((): void => { this.tempStage.addEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this); }, this);
        this.stageText.$show();
    }
    public onStageDownHandler(event: Event): void { if (event.$target != this._text) { this.stageText.$hide(); } }
    public updateTextHandler(_event: Event): void {
        const values: InputTextFieldState = this._text!.$TextField;
        let textValue: string = this.stageText.$getText();
        let isChanged: boolean = false;
        let reg: RegExp;
        let result: RegExpMatchArray | null;
        if (values[35] != null) { reg = new RegExp("[" + values[35] + "]", "g"); result = textValue.match(reg); textValue = result ? result.join("") : ""; isChanged = true; }
        if (values[36] != null) { reg = new RegExp("[^" + values[36] + "]", "g"); result = textValue.match(reg); textValue = result ? result.join("") : ""; isChanged = true; }
        if (isChanged && this.stageText.$getText() != textValue) { this.stageText.$setText(textValue); }
        this.resetText(); this._text!.dispatchEvent(new Event(Event.CHANGE, true));
    }
    public resetText(): void { this._text!.$setBaseText(this.stageText.$getText()); }
    public _hideInput(): void { this.stageText.$removeFromStage(); }
    public updateInput(): void { if (!this._text!.$visible && this.stageText) { this._hideInput(); } }
    public _updateProperties(): void {
        if (this._isFocus) { this.stageText.$resetStageText(); this.updateInput(); return; }
        this.stageText.$setText(this._text!.$TextField[13]); this.stageText.$resetStageText(); this.updateInput();
    }
}
__reflect(InputController.prototype, "egret.InputController");
