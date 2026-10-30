
import {
    SpriteSheet,
    BitmapFont,
    type BitmapFontGlyph,
    type BitmapFontConfig,
    type IEventDispatcher,
    Event,
    IOErrorEvent,
    Texture,
    Rectangle,
    type XML,
    MovieClipDataFactory,
    type ImageLoader,
    getImageLoader,
    BitmapData,
    KTXContainer,
    type HttpRequest,
    getHttpRequest,
    HttpResponseType,
} from "./EgretCore";
import {
    type ResourceInfo,
    type ProcessHost,
    ResourceManagerError,
    getVirtualUrl,
    nameSelector,
    type MovieClipConfig,
    getConfig,
    type ConfigData,
    type FileSystem,
} from "./ResCore";
import { parseXML } from "./WebCore";

export type ResourceSpriteSheet = SpriteSheet & { $resourceInfo: ResourceInfo };
export type ResourceBitmapFont = BitmapFont & { $resourceInfo: ResourceInfo };

export interface Processor<T = unknown> {
    onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<T>;
    onRemoveStart(host: ProcessHost, resource: ResourceInfo): void | boolean | Promise<void>;
    getData?(host: ProcessHost, resource: ResourceInfo, key: string, subkey: string): unknown;
}
export interface SheetConfig {
    file: string;
    frames: Record<string, BitmapFontGlyph & { scale9grid?: string }>;
}
export interface FontConfig extends BitmapFontConfig {
    file: string;
}
export interface LegacyConfig {
    groups: { name: string; keys: string }[];
    resources: ResourceInfo[];
}
interface DataLoader<T> extends IEventDispatcher {
    data?: T | null;
    response?: T | null;
}
interface LegacyFileSystem extends FileSystem {
    fsData: Record<string, ResourceInfo>;
}

export function isSupport(resource: ResourceInfo): Processor | undefined {
    return getMap()[resource.type];
}

export function map(type: string, processor: Processor): void {
    getMap()[type] = processor;
}

export function getRelativePath(url: string, file: string): string {
    if (file.indexOf("://") != -1) {
        return file;
    }
    url = url.split("\\").join("/");
    const params: RegExpMatchArray | null = url.match(/#.*|\?.*/);
    let paramUrl: string = "";
    if (params) {
        paramUrl = params[0]!;
    }
    const index: number = url.lastIndexOf("/");
    url = index != -1 ? url.substring(0, index + 1) + file : file;
    return url + paramUrl;
}

export function makeEtc1SeperatedAlphaResourceInfo(resource: ResourceInfo): ResourceInfo {
    return {
        name : resource.name + "_alpha",
        url  : resource.etc1_alpha_url!,
        type : "ktx",
        root : resource.root,
    };
}

export function getMap(): Record<string, Processor> {
    // TODO 原api为 export const _map: Record<string, Processor> = ...
    return ResProcessorHelper.getMap();
}

function promisify<T>(loader: DataLoader<T>, resource: ResourceInfo): Promise<T> {
    return new Promise<T>((resolve: (value: T | PromiseLike<T>) => void, reject: (reason: unknown) => void): void => {
        const onSuccess: () => void = (): void => {
            const texture: T = (loader.data ? loader.data : loader.response) as T;
            resolve(texture);
        };
        const onError: () => void = (): void => {
            const e: ResourceManagerError = new ResourceManagerError(1001, resource.url);
            reject(e);
        };
        loader.addEventListener(Event.COMPLETE, onSuccess, undefined);
        loader.addEventListener(IOErrorEvent.IO_ERROR, onError, undefined);
    });
}

function applyScale9Grid(texture: Texture, grid: string): void {
    const list: string[] = grid.split(",");
    texture.scale9Grid = new Rectangle(parseInt(list[0]!), parseInt(list[1]!), parseInt(list[2]!), parseInt(list[3]!));
}

function fontGetTexturePath(url: string, fntText: string): string {
    let file: string = "";
    const lines: string[] = fntText.split("\n");
    let pngLine: string = lines[2]!;
    let index: number = pngLine.indexOf('file="');
    if (index != -1) {
        pngLine = pngLine.substring(index + 6);
        index = pngLine.indexOf('"');
        file = pngLine.substring(0, index);
    }
    url = url.split("\\").join("/");
    index = url.lastIndexOf("/");
    return index != -1 ? url.substring(0, index + 1) + file : file;
}

export class ResProcessorHelper {
    private static ImageProcessor: Processor<Texture> | undefined;
    private static KTXTextureProcessor: Processor<Texture | null> | undefined;
    private static ETC1KTXProcessor: Processor<Texture | null> | undefined;
    private static BinaryProcessor: Processor<ArrayBuffer> | undefined;
    private static TextProcessor: Processor<string> | undefined;
    private static JsonProcessor: Processor | undefined;
    private static XMLProcessor: Processor<XML | null> | undefined;
    private static CommonJSProcessor: Processor<Record<string, unknown>> | undefined;
    private static SheetProcessor: Processor<ResourceSpriteSheet | null> | undefined;
    private static FontProcessor: Processor<ResourceBitmapFont> | undefined;
    // private static SoundProcessor: Processor<egret.Sound> | undefined;
    private static MovieClipProcessor: Processor<MovieClipDataFactory> | undefined;
    private static MergeJSONProcessor: Processor<Record<string, unknown>> | undefined;
    private static LegacyResourceConfigProcessor: Processor<LegacyConfig> | undefined;
    private static _map: Record<string, Processor> | undefined;

    public static getImageProcessor(): Processor<Texture> {
        return ResProcessorHelper.ImageProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<Texture> {
                const loader: ImageLoader = new (getImageLoader())();
                loader.load(getVirtualUrl(resource.root + resource.url));
                return promisify<BitmapData>(loader, resource).then((bitmapData: BitmapData): Texture => {
                    const texture: Texture = new Texture();
                    texture._setBitmapData(bitmapData);
                    const r: ResourceInfo | null = host.resourceConfig.getResource(resource.name);
                    if (r && r.scale9grid) {
                        applyScale9Grid(texture, r.scale9grid);
                    }
                    return texture;
                });
            },
            onRemoveStart(host: ProcessHost, resource: ResourceInfo): void {
                const texture: Texture = host.get<Texture>(resource)!;
                texture.dispose();
            },
        };
    }
    public static getKTXTextureProcessor(): Processor<Texture | null> {
        return ResProcessorHelper.KTXTextureProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<Texture | null> {
                return host.load<ArrayBuffer>(resource, "bin").then((data: ArrayBuffer): Texture | null => {
                    if (!data) {
                        console.error("ktx:" + resource.root + resource.url + " is null");
                        return null;
                    }
                    const ktx: KTXContainer = new KTXContainer(data, 1);
                    if (ktx.isInvalid) {
                        console.error("ktx:" + resource.root + resource.url + " is invalid");
                        return null;
                    }
                    const bitmapData: BitmapData = new BitmapData(data);
                    bitmapData.debugCompressedTextureURL = resource.root + resource.url;
                    bitmapData.format = "ktx";
                    ktx.uploadLevels(bitmapData, false);
                    const texture: Texture = new Texture();
                    texture._setBitmapData(bitmapData);
                    const r: ResourceInfo | null = host.resourceConfig.getResource(resource.name);
                    if (r && r.scale9grid) {
                        applyScale9Grid(texture, r.scale9grid);
                    }
                    host.save(resource, texture);
                    return texture;
                }, (e: unknown): never => {
                    host.remove(resource);
                    throw e;
                });
            },
            onRemoveStart(host: ProcessHost, resource: ResourceInfo): void {
                const texture: Texture | null | undefined = host.get<Texture | null>(resource);
                if (texture) {
                    texture.dispose();
                }
            },
        };
    }
    public static getETC1KTXProcessor(): Processor<Texture | null> {
        return ResProcessorHelper.ETC1KTXProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<Texture | null> {
                return host.load<Texture | null>(resource, "ktx").then((colorTex: Texture | null): Texture | null | Promise<Texture> => {
                    if (!colorTex) {
                        return null;
                    }
                    if (resource.etc1_alpha_url) {
                        const r: ResourceInfo = makeEtc1SeperatedAlphaResourceInfo(resource);
                        return host.load<Texture>(r, "ktx").then((alphaMaskTex: Texture): Texture => {
                            if (colorTex && colorTex.$bitmapData && alphaMaskTex.$bitmapData) {
                                colorTex.$bitmapData.etcAlphaMask = alphaMaskTex.$bitmapData;
                                host.save(r, alphaMaskTex);
                            } else {
                                host.remove(r);
                            }
                            return colorTex;
                        }, (e: unknown): never => {
                            host.remove(r);
                            throw e;
                        });
                    }
                    return colorTex;
                }, (e: unknown): never => {
                    host.remove(resource);
                    throw e;
                });
            },
            onRemoveStart(host: ProcessHost, resource: ResourceInfo): void {
                const colorTex: Texture | null | undefined = host.get<Texture | null>(resource);
                if (colorTex) {
                    colorTex.dispose();
                }
                if (resource.etc1_alpha_url) {
                    const r: ResourceInfo = makeEtc1SeperatedAlphaResourceInfo(resource);
                    const alphaMaskTex: Texture | undefined = host.get<Texture>(r);
                    if (alphaMaskTex) {
                        alphaMaskTex.dispose();
                    }
                    host.unload(r);
                }
            },
        };
    }
    public static getBinaryProcessor(): Processor<ArrayBuffer> {
        return ResProcessorHelper.BinaryProcessor ??= {
            onLoadStart(_host: ProcessHost, resource: ResourceInfo): Promise<ArrayBuffer> {
                const request: HttpRequest = new (getHttpRequest())();
                request.responseType = HttpResponseType.ARRAY_BUFFER as XMLHttpRequestResponseType;
                request.open(getVirtualUrl(resource.root + resource.url), "get");
                request.send();
                return promisify<ArrayBuffer>(request as DataLoader<ArrayBuffer>, resource);
            },
            onRemoveStart(_host: ProcessHost, _resource: ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getTextProcessor(): Processor<string> {
        return ResProcessorHelper.TextProcessor ??= {
            onLoadStart(_host: ProcessHost, resource: ResourceInfo): Promise<string> {
                const request: HttpRequest = new (getHttpRequest())();
                request.responseType = HttpResponseType.TEXT as XMLHttpRequestResponseType;
                request.open(getVirtualUrl(resource.root + resource.url), "get");
                request.send();
                return promisify<string>(request as DataLoader<string>, resource);
            },
            onRemoveStart(_host: ProcessHost, _resource: ResourceInfo): boolean {
                void _host;

                void _resource;

                return true;
            },
        };
    }
    public static getJsonProcessor(): Processor {
        return ResProcessorHelper.JsonProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<unknown> {
                return host.load<string>(resource, "text").then((text: string): unknown => JSON.parse(text) as unknown);
            },
            onRemoveStart(_host: ProcessHost, _resource: ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getXMLProcessor(): Processor<XML | null> {
        return ResProcessorHelper.XMLProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<XML | null> {
                return host.load<string>(resource, "text").then((text: string): XML | null => parseXML(text));
            },
            onRemoveStart(_host: ProcessHost, _resource: ResourceInfo): boolean {
                void _host;

                void _resource;

                return true;
            },
        };
    }
    public static getCommonJSProcessor(): Processor<Record<string, unknown>> {
        return ResProcessorHelper.CommonJSProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<Record<string, unknown>> {
                return host.load<string>(resource, "text").then((text: string): Record<string, unknown> => {
                    const f: (require: () => void, exports: Record<string, unknown>) => void = new Function("require", "exports", text) as (require: () => void, exports: Record<string, unknown>) => void;
                    const require: () => void = (): void => { };
                    const exports: Record<string, unknown> = {};
                    try {
                        f(require, exports);
                    } catch (e: unknown) {
                        throw new ResourceManagerError(2003, resource.name, (e as { message: string }).message);
                    }
                    return exports;
                });
            },
            onRemoveStart(_host: ProcessHost, _resource: ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getSheetProcessor(): Processor<ResourceSpriteSheet | null> {
        return ResProcessorHelper.SheetProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<ResourceSpriteSheet | null> {
                return host.load<SheetConfig>(resource, "json").then((data: SheetConfig): Promise<ResourceSpriteSheet | null> => {
                    let r: ResourceInfo | null = host.resourceConfig.getResource(nameSelector(data.file));
                    if (!r) {
                        const imageName: string = getRelativePath(resource.url, data.file);
                        r = {
                            name : imageName, url : imageName, type : "image", root : resource.root,
                        };
                    }
                    const imageResource: ResourceInfo = r;
                    return host.load<Texture>(imageResource).then((bitmapData: Texture): ResourceSpriteSheet | null => {
                        if (!bitmapData) {
                            return null;
                        }
                        const frames: SheetConfig["frames"] = data.frames;
                        const spriteSheet: ResourceSpriteSheet = new SpriteSheet(bitmapData) as ResourceSpriteSheet;
                        spriteSheet.$resourceInfo = imageResource;
                        let subkey: string;
                        for (subkey in frames) {
                            const config: BitmapFontGlyph & { scale9grid?: string } = frames[subkey]!;
                            const texture: Texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                            if (config.scale9grid) {
                                applyScale9Grid(texture, config.scale9grid);
                            }
                        }
                        host.save(imageResource, bitmapData);
                        return spriteSheet;
                    }, (e: unknown): never => {
                        host.remove(imageResource);
                        throw e;
                    });
                });
            },
            getData(host: ProcessHost, resource: ResourceInfo, _key: string, subkey: string): Texture | null | undefined {
                const data: ResourceSpriteSheet | undefined = host.get<ResourceSpriteSheet>(resource);
                return data ? data.getTexture(subkey) : null;
            },
            onRemoveStart(host: ProcessHost, resource: ResourceInfo): void {
                const sheet: ResourceSpriteSheet = host.get<ResourceSpriteSheet>(resource)!;
                const r: ResourceInfo = sheet.$resourceInfo;
                sheet.dispose();
                host.unload(r);
            },
        };
    }
    public static getFontProcessor(): Processor<ResourceBitmapFont> {
        return ResProcessorHelper.FontProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<ResourceBitmapFont> {
                return host.load<string>(resource, "text").then((data: string): Promise<ResourceBitmapFont> => {
                    let config: FontConfig | string;
                    try {
                        config = JSON.parse(data) as FontConfig | string;
                    } catch {
                        config = data;
                    }
                    const imageName: string = typeof config === "string" ? fontGetTexturePath(resource.url, config) : getRelativePath(resource.url, config.file);
                    let r: ResourceInfo | null = host.resourceConfig.getResource(nameSelector(imageName));
                    if (!r) {
                        r = {
                            name : imageName, url : imageName, type : "image", root : resource.root,
                        };
                    }
                    const imageResource: ResourceInfo = r;
                    return host.load<Texture>(imageResource).then((texture: Texture): ResourceBitmapFont => {
                        const font: ResourceBitmapFont = new BitmapFont(texture, config) as ResourceBitmapFont;
                        font.$resourceInfo = imageResource;
                        host.save(imageResource, texture);
                        return font;
                    }, (e: unknown): never => {
                        host.remove(imageResource);
                        throw e;
                    });
                });
            },
            onRemoveStart(host: ProcessHost, resource: ResourceInfo): void {
                const font: ResourceBitmapFont = host.get<ResourceBitmapFont>(resource)!;
                const r: ResourceInfo = font.$resourceInfo;
                host.unload(r);
            },
        };
    }
    // public static getSoundProcessor(): Processor<egret.Sound> {
    //     return ResProcessorHelper.SoundProcessor ??= {
    //         onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<egret.Sound> {
    //             const sound: egret.Sound = new egret.Sound();
    //             sound.load(RES.getVirtualUrl(resource.root + resource.url));
    //             return promisify<unknown>(sound, resource).then((): egret.Sound => sound);
    //         },
    //         onRemoveStart(host: ProcessHost, resource: ResourceInfo): void {
    //             const sound: egret.Sound = host.get<egret.Sound>(resource)!;
    //             sound.close();
    //         }
    //     };
    // }
    public static getMovieClipProcessor(): Processor<MovieClipDataFactory> {
        return ResProcessorHelper.MovieClipProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<MovieClipDataFactory> {
                let mcData: MovieClipConfig;
                let imageResource: ResourceInfo;
                return host.load<MovieClipConfig>(resource, "json").then((value: MovieClipConfig): Promise<Texture> => {
                    mcData = value;
                    const jsonPath: string = resource.name;
                    const imagePath: string = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                    const image: ResourceInfo | null = host.resourceConfig.getResource(imagePath);
                    if (!image) {
                        throw new ResourceManagerError(1001, imagePath);
                    }
                    imageResource = image;
                    return host.load<Texture>(imageResource);
                }).then((value: Texture): MovieClipDataFactory => {
                    host.save(imageResource, value);
                    const mcTexture: Texture = value;
                    const mcDataFactory: MovieClipDataFactory = new MovieClipDataFactory(mcData, mcTexture);
                    return mcDataFactory;
                });
            },
            onRemoveStart(host: ProcessHost, resource: ResourceInfo): void {
                const mcFactory: MovieClipDataFactory = host.get<MovieClipDataFactory>(resource)!;
                mcFactory.clearCache();
                mcFactory.$spriteSheet!.dispose();
                const jsonPath: string = resource.name;
                const imagePath: string = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                const imageResource: ResourceInfo | null = host.resourceConfig.getResource(imagePath);
                if (imageResource) {
                    host.unload(imageResource);
                }
            },
        };
    }
    public static getMergeJSONProcessor(): Processor<Record<string, unknown>> {
        return ResProcessorHelper.MergeJSONProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<Record<string, unknown>> {
                return host.load<Record<string, unknown>>(resource, "json").then((data: Record<string, unknown>): Record<string, unknown> => {
                    let key: string;
                    for (key in data) {
                        getConfig().addSubkey(key, resource.name);
                    }
                    return data;
                });
            },
            getData(host: ProcessHost, resource: ResourceInfo, _key: string, subkey: string): unknown {
                const data: Record<string, unknown> | undefined = host.get<Record<string, unknown>>(resource);
                if (data) {
                    return data[subkey];
                }
                console.error("missing resource :" + resource.name);
                return null;
            },
            onRemoveStart(_host: ProcessHost, _resource: ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getLegacyResourceConfigProcessor(): Processor<LegacyConfig> {
        return ResProcessorHelper.LegacyResourceConfigProcessor ??= {
            onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<LegacyConfig> {
                return host.load<LegacyConfig>(resource, "json").then((data: LegacyConfig): LegacyConfig => {
                    const resConfigData: ConfigData = getConfig().config;
                    const root: string = resource.root;
                    let fileSystem: LegacyFileSystem | null = resConfigData.fileSystem as LegacyFileSystem | null;
                    if (!fileSystem) {
                        fileSystem = {
                            fsData : {},
                            getFile(filename: string): ResourceInfo | undefined {
                                return fsData[filename];
                            },
                            addFile(file: ResourceInfo): void {
                                if (!file.type) {
                                    file.type = "";
                                }
                                if (root == undefined) {
                                    file.root = "";
                                }
                                fsData[file.name] = file;
                            },
                            profile(): void {
                                console.log(fsData);
                            },
                            removeFile(filename: string): void {
                                delete fsData[filename];
                            },
                        };
                        resConfigData.fileSystem = fileSystem;
                    }
                    const groups: Record<string, string[]> = resConfigData.groups;
                    for (let i: number = 0; i < data.groups.length; i++) {
                        const g: LegacyConfig["groups"][number] = data.groups[i]!;
                        groups[g.name] = g.keys == "" ? [] : g.keys.split(",");
                    }
                    const alias: Record<string, string> = resConfigData.alias;
                    const fsData: Record<string, ResourceInfo> = fileSystem.fsData;
                    for (let i: number = 0; i < data.resources.length; i++) {
                        const entry: ResourceInfo = data.resources[i]!;
                        fsData[entry.name] = entry;
                        entry.root = root;
                        if (entry.subkeys) {
                            entry.subkeys.split(",").forEach((subkey: string): void => {
                                alias[subkey] = entry.name + "#" + subkey;
                                alias[entry.name + "." + subkey] = entry.name + "#" + subkey;
                            });
                        }
                    }
                    host.save(resource, data);
                    return data;
                });
            },
            onRemoveStart(): void { },
        };
    }

    public static getMap(): Record<string, Processor> {
        return ResProcessorHelper._map ??= {
            image                : ResProcessorHelper.getImageProcessor(),
            json                 : ResProcessorHelper.getJsonProcessor(),
            text                 : ResProcessorHelper.getTextProcessor(),
            xml                  : ResProcessorHelper.getXMLProcessor(),
            sheet                : ResProcessorHelper.getSheetProcessor(),
            font                 : ResProcessorHelper.getFontProcessor(),
            bin                  : ResProcessorHelper.getBinaryProcessor(),
            commonjs             : ResProcessorHelper.getCommonJSProcessor(),
            // sound: ResProcessorHelper.getSoundProcessor(),
            movieclip            : ResProcessorHelper.getMovieClipProcessor(),
            mergeJson            : ResProcessorHelper.getMergeJSONProcessor(),
            legacyResourceConfig : ResProcessorHelper.getLegacyResourceConfigProcessor(),
            ktx                  : ResProcessorHelper.getKTXTextureProcessor(),
            "etc1.ktx"           : ResProcessorHelper.getETC1KTXProcessor(),
            "pvrtc.ktx"          : ResProcessorHelper.getKTXTextureProcessor(),
        };
    }
}
