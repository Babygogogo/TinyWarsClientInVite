import {
    Egret_Egret,
    Egret_Res,
    Egret_Web,
} from "../internal.ts";

export type ResourceSpriteSheet = Egret_Egret.SpriteSheet & { $resourceInfo: Egret_Res.ResourceInfo };
export type ResourceBitmapFont = Egret_Egret.BitmapFont & { $resourceInfo: Egret_Res.ResourceInfo };

export interface Processor<T = unknown> {
    onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<T>;
    onRemoveStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): void | boolean | Promise<void>;
    getData?(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo, key: string, subkey: string): unknown;
}
export interface SheetConfig {
    file: string;
    frames: Record<string, Egret_Egret.BitmapFontGlyph & { scale9grid?: string }>;
}
export interface FontConfig extends Egret_Egret.BitmapFontConfig {
    file: string;
}
export interface LegacyConfig {
    groups: { name: string; keys: string }[];
    resources: Egret_Res.ResourceInfo[];
}
interface DataLoader<T> extends Egret_Egret.IEventDispatcher {
    data?: T | null;
    response?: T | null;
}
interface LegacyFileSystem extends Egret_Res.FileSystem {
    fsData: Record<string, Egret_Res.ResourceInfo>;
}

export function isSupport(resource: Egret_Res.ResourceInfo): Processor | undefined {
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

export function makeEtc1SeperatedAlphaResourceInfo(resource: Egret_Res.ResourceInfo): Egret_Res.ResourceInfo {
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

function promisify<T>(loader: DataLoader<T>, resource: Egret_Res.ResourceInfo): Promise<T> {
    return new Promise<T>((resolve: (value: T | PromiseLike<T>) => void, reject: (reason: unknown) => void): void => {
        const onSuccess: () => void = (): void => {
            const texture: T = (loader.data ? loader.data : loader.response) as T;
            resolve(texture);
        };
        const onError: () => void = (): void => {
            const e: Egret_Res.ResourceManagerError = new Egret_Res.ResourceManagerError(1001, resource.url);
            reject(e);
        };
        loader.addEventListener(Egret_Egret.Event.COMPLETE, onSuccess, undefined);
        loader.addEventListener(Egret_Egret.IOErrorEvent.IO_ERROR, onError, undefined);
    });
}

function applyScale9Grid(texture: Egret_Egret.Texture, grid: string): void {
    const list: string[] = grid.split(",");
    texture.scale9Grid = new Egret_Egret.Rectangle(parseInt(list[0]!), parseInt(list[1]!), parseInt(list[2]!), parseInt(list[3]!));
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
    private static ImageProcessor: Processor<Egret_Egret.Texture> | undefined;
    private static KTXTextureProcessor: Processor<Egret_Egret.Texture | null> | undefined;
    private static ETC1KTXProcessor: Processor<Egret_Egret.Texture | null> | undefined;
    private static BinaryProcessor: Processor<ArrayBuffer> | undefined;
    private static TextProcessor: Processor<string> | undefined;
    private static JsonProcessor: Processor | undefined;
    private static XMLProcessor: Processor<Egret_Egret.XML | null> | undefined;
    private static CommonJSProcessor: Processor<Record<string, unknown>> | undefined;
    private static SheetProcessor: Processor<ResourceSpriteSheet | null> | undefined;
    private static FontProcessor: Processor<ResourceBitmapFont> | undefined;
    // private static SoundProcessor: Processor<egret.Sound> | undefined;
    private static MovieClipProcessor: Processor<Egret_Egret.MovieClipDataFactory> | undefined;
    private static MergeJSONProcessor: Processor<Record<string, unknown>> | undefined;
    private static LegacyResourceConfigProcessor: Processor<LegacyConfig> | undefined;
    private static _map: Record<string, Processor> | undefined;

    public static getImageProcessor(): Processor<Egret_Egret.Texture> {
        return ResProcessorHelper.ImageProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<Egret_Egret.Texture> {
                const loader: Egret_Egret.ImageLoader = new Egret_Web.WebImageLoader();
                loader.load(Egret_Res.getVirtualUrl(resource.root + resource.url));
                return promisify<Egret_Egret.BitmapData>(loader, resource).then((bitmapData: Egret_Egret.BitmapData): Egret_Egret.Texture => {
                    const texture: Egret_Egret.Texture = new Egret_Egret.Texture();
                    texture._setBitmapData(bitmapData);
                    const r: Egret_Res.ResourceInfo | null = host.resourceConfig.getResource(resource.name);
                    if (r && r.scale9grid) {
                        applyScale9Grid(texture, r.scale9grid);
                    }
                    return texture;
                });
            },
            onRemoveStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): void {
                const texture: Egret_Egret.Texture = host.get<Egret_Egret.Texture>(resource)!;
                texture.dispose();
            },
        };
    }
    public static getKTXTextureProcessor(): Processor<Egret_Egret.Texture | null> {
        return ResProcessorHelper.KTXTextureProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<Egret_Egret.Texture | null> {
                return host.load<ArrayBuffer>(resource, "bin").then((data: ArrayBuffer): Egret_Egret.Texture | null => {
                    if (!data) {
                        console.error("ktx:" + resource.root + resource.url + " is null");
                        return null;
                    }
                    const ktx: Egret_Egret.KTXContainer = new Egret_Egret.KTXContainer(data, 1);
                    if (ktx.isInvalid) {
                        console.error("ktx:" + resource.root + resource.url + " is invalid");
                        return null;
                    }
                    const bitmapData: Egret_Egret.BitmapData = new Egret_Egret.BitmapData(data);
                    bitmapData.debugCompressedTextureURL = resource.root + resource.url;
                    bitmapData.format = "ktx";
                    ktx.uploadLevels(bitmapData, false);
                    const texture: Egret_Egret.Texture = new Egret_Egret.Texture();
                    texture._setBitmapData(bitmapData);
                    const r: Egret_Res.ResourceInfo | null = host.resourceConfig.getResource(resource.name);
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
            onRemoveStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): void {
                const texture: Egret_Egret.Texture | null | undefined = host.get<Egret_Egret.Texture | null>(resource);
                if (texture) {
                    texture.dispose();
                }
            },
        };
    }
    public static getETC1KTXProcessor(): Processor<Egret_Egret.Texture | null> {
        return ResProcessorHelper.ETC1KTXProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<Egret_Egret.Texture | null> {
                return host.load<Egret_Egret.Texture | null>(resource, "ktx").then((colorTex: Egret_Egret.Texture | null): Egret_Egret.Texture | null | Promise<Egret_Egret.Texture> => {
                    if (!colorTex) {
                        return null;
                    }
                    if (resource.etc1_alpha_url) {
                        const r: Egret_Res.ResourceInfo = makeEtc1SeperatedAlphaResourceInfo(resource);
                        return host.load<Egret_Egret.Texture>(r, "ktx").then((alphaMaskTex: Egret_Egret.Texture): Egret_Egret.Texture => {
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
            onRemoveStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): void {
                const colorTex: Egret_Egret.Texture | null | undefined = host.get<Egret_Egret.Texture | null>(resource);
                if (colorTex) {
                    colorTex.dispose();
                }
                if (resource.etc1_alpha_url) {
                    const r: Egret_Res.ResourceInfo = makeEtc1SeperatedAlphaResourceInfo(resource);
                    const alphaMaskTex: Egret_Egret.Texture | undefined = host.get<Egret_Egret.Texture>(r);
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
            onLoadStart(_host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<ArrayBuffer> {
                const request: Egret_Egret.HttpRequest = new Egret_Web.WebHttpRequest();
                request.responseType = Egret_Egret.HttpResponseType.ARRAY_BUFFER as XMLHttpRequestResponseType;
                request.open(Egret_Res.getVirtualUrl(resource.root + resource.url), "get");
                request.send();
                return promisify<ArrayBuffer>(request as DataLoader<ArrayBuffer>, resource);
            },
            onRemoveStart(_host: Egret_Res.ProcessHost, _resource: Egret_Res.ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getTextProcessor(): Processor<string> {
        return ResProcessorHelper.TextProcessor ??= {
            onLoadStart(_host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<string> {
                const request: Egret_Egret.HttpRequest = new Egret_Web.WebHttpRequest();
                request.responseType = Egret_Egret.HttpResponseType.TEXT as XMLHttpRequestResponseType;
                request.open(Egret_Res.getVirtualUrl(resource.root + resource.url), "get");
                request.send();
                return promisify<string>(request as DataLoader<string>, resource);
            },
            onRemoveStart(_host: Egret_Res.ProcessHost, _resource: Egret_Res.ResourceInfo): boolean {
                void _host;

                void _resource;

                return true;
            },
        };
    }
    public static getJsonProcessor(): Processor {
        return ResProcessorHelper.JsonProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<unknown> {
                return host.load<string>(resource, "text").then((text: string): unknown => JSON.parse(text) as unknown);
            },
            onRemoveStart(_host: Egret_Res.ProcessHost, _resource: Egret_Res.ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getXMLProcessor(): Processor<Egret_Egret.XML | null> {
        return ResProcessorHelper.XMLProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<Egret_Egret.XML | null> {
                return host.load<string>(resource, "text").then((text: string): Egret_Egret.XML | null => Egret_Web.parseXML(text));
            },
            onRemoveStart(_host: Egret_Res.ProcessHost, _resource: Egret_Res.ResourceInfo): boolean {
                void _host;

                void _resource;

                return true;
            },
        };
    }
    public static getCommonJSProcessor(): Processor<Record<string, unknown>> {
        return ResProcessorHelper.CommonJSProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<Record<string, unknown>> {
                return host.load<string>(resource, "text").then((text: string): Record<string, unknown> => {
                    const f: (require: () => void, exports: Record<string, unknown>) => void = new Function("require", "exports", text) as (require: () => void, exports: Record<string, unknown>) => void;
                    const require: () => void = (): void => { };
                    const exports: Record<string, unknown> = {};
                    try {
                        f(require, exports);
                    } catch (e: unknown) {
                        throw new Egret_Res.ResourceManagerError(2003, resource.name, (e as { message: string }).message);
                    }
                    return exports;
                });
            },
            onRemoveStart(_host: Egret_Res.ProcessHost, _resource: Egret_Res.ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getSheetProcessor(): Processor<ResourceSpriteSheet | null> {
        return ResProcessorHelper.SheetProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<ResourceSpriteSheet | null> {
                return host.load<SheetConfig>(resource, "json").then((data: SheetConfig): Promise<ResourceSpriteSheet | null> => {
                    let r: Egret_Res.ResourceInfo | null = host.resourceConfig.getResource(Egret_Res.nameSelector(data.file));
                    if (!r) {
                        const imageName: string = getRelativePath(resource.url, data.file);
                        r = {
                            name : imageName, url : imageName, type : "image", root : resource.root,
                        };
                    }
                    const imageResource: Egret_Res.ResourceInfo = r;
                    return host.load<Egret_Egret.Texture>(imageResource).then((bitmapData: Egret_Egret.Texture): ResourceSpriteSheet | null => {
                        if (!bitmapData) {
                            return null;
                        }
                        const frames: SheetConfig["frames"] = data.frames;
                        const spriteSheet: ResourceSpriteSheet = new Egret_Egret.SpriteSheet(bitmapData) as ResourceSpriteSheet;
                        spriteSheet.$resourceInfo = imageResource;
                        let subkey: string;
                        for (subkey in frames) {
                            const config: Egret_Egret.BitmapFontGlyph & { scale9grid?: string } = frames[subkey]!;
                            const texture: Egret_Egret.Texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
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
            getData(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo, _key: string, subkey: string): Egret_Egret.Texture | null | undefined {
                const data: ResourceSpriteSheet | undefined = host.get<ResourceSpriteSheet>(resource);
                return data ? data.getTexture(subkey) : null;
            },
            onRemoveStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): void {
                const sheet: ResourceSpriteSheet = host.get<ResourceSpriteSheet>(resource)!;
                const r: Egret_Res.ResourceInfo = sheet.$resourceInfo;
                sheet.dispose();
                host.unload(r);
            },
        };
    }
    public static getFontProcessor(): Processor<ResourceBitmapFont> {
        return ResProcessorHelper.FontProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<ResourceBitmapFont> {
                return host.load<string>(resource, "text").then((data: string): Promise<ResourceBitmapFont> => {
                    let config: FontConfig | string;
                    try {
                        config = JSON.parse(data) as FontConfig | string;
                    } catch {
                        config = data;
                    }
                    const imageName: string = typeof config === "string" ? fontGetTexturePath(resource.url, config) : getRelativePath(resource.url, config.file);
                    let r: Egret_Res.ResourceInfo | null = host.resourceConfig.getResource(Egret_Res.nameSelector(imageName));
                    if (!r) {
                        r = {
                            name : imageName, url : imageName, type : "image", root : resource.root,
                        };
                    }
                    const imageResource: Egret_Res.ResourceInfo = r;
                    return host.load<Egret_Egret.Texture>(imageResource).then((texture: Egret_Egret.Texture): ResourceBitmapFont => {
                        const font: ResourceBitmapFont = new Egret_Egret.BitmapFont(texture, config) as ResourceBitmapFont;
                        font.$resourceInfo = imageResource;
                        host.save(imageResource, texture);
                        return font;
                    }, (e: unknown): never => {
                        host.remove(imageResource);
                        throw e;
                    });
                });
            },
            onRemoveStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): void {
                const font: ResourceBitmapFont = host.get<ResourceBitmapFont>(resource)!;
                const r: Egret_Res.ResourceInfo = font.$resourceInfo;
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
    public static getMovieClipProcessor(): Processor<Egret_Egret.MovieClipDataFactory> {
        return ResProcessorHelper.MovieClipProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<Egret_Egret.MovieClipDataFactory> {
                let mcData: Egret_Res.MovieClipConfig;
                let imageResource: Egret_Res.ResourceInfo;
                return host.load<Egret_Res.MovieClipConfig>(resource, "json").then((value: Egret_Res.MovieClipConfig): Promise<Egret_Egret.Texture> => {
                    mcData = value;
                    const jsonPath: string = resource.name;
                    const imagePath: string = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                    const image: Egret_Res.ResourceInfo | null = host.resourceConfig.getResource(imagePath);
                    if (!image) {
                        throw new Egret_Res.ResourceManagerError(1001, imagePath);
                    }
                    imageResource = image;
                    return host.load<Egret_Egret.Texture>(imageResource);
                }).then((value: Egret_Egret.Texture): Egret_Egret.MovieClipDataFactory => {
                    host.save(imageResource, value);
                    const mcTexture: Egret_Egret.Texture = value;
                    const mcDataFactory: Egret_Egret.MovieClipDataFactory = new Egret_Egret.MovieClipDataFactory(mcData, mcTexture);
                    return mcDataFactory;
                });
            },
            onRemoveStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): void {
                const mcFactory: Egret_Egret.MovieClipDataFactory = host.get<Egret_Egret.MovieClipDataFactory>(resource)!;
                mcFactory.clearCache();
                mcFactory.$spriteSheet!.dispose();
                const jsonPath: string = resource.name;
                const imagePath: string = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                const imageResource: Egret_Res.ResourceInfo | null = host.resourceConfig.getResource(imagePath);
                if (imageResource) {
                    host.unload(imageResource);
                }
            },
        };
    }
    public static getMergeJSONProcessor(): Processor<Record<string, unknown>> {
        return ResProcessorHelper.MergeJSONProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<Record<string, unknown>> {
                return host.load<Record<string, unknown>>(resource, "json").then((data: Record<string, unknown>): Record<string, unknown> => {
                    let key: string;
                    for (key in data) {
                        Egret_Res.getConfig().addSubkey(key, resource.name);
                    }
                    return data;
                });
            },
            getData(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo, _key: string, subkey: string): unknown {
                const data: Record<string, unknown> | undefined = host.get<Record<string, unknown>>(resource);
                if (data) {
                    return data[subkey];
                }
                console.error("missing resource :" + resource.name);
                return null;
            },
            onRemoveStart(_host: Egret_Res.ProcessHost, _resource: Egret_Res.ResourceInfo): void {
                void _host;

                void _resource;
            },
        };
    }
    public static getLegacyResourceConfigProcessor(): Processor<LegacyConfig> {
        return ResProcessorHelper.LegacyResourceConfigProcessor ??= {
            onLoadStart(host: Egret_Res.ProcessHost, resource: Egret_Res.ResourceInfo): Promise<LegacyConfig> {
                return host.load<LegacyConfig>(resource, "json").then((data: LegacyConfig): LegacyConfig => {
                    const resConfigData: Egret_Res.ConfigData = Egret_Res.getConfig().config;
                    const root: string = resource.root;
                    let fileSystem: LegacyFileSystem | null = resConfigData.fileSystem as LegacyFileSystem | null;
                    if (!fileSystem) {
                        fileSystem = {
                            fsData : {},
                            getFile(filename: string): Egret_Res.ResourceInfo | undefined {
                                return fsData[filename];
                            },
                            addFile(file: Egret_Res.ResourceInfo): void {
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
                    const fsData: Record<string, Egret_Res.ResourceInfo> = fileSystem.fsData;
                    for (let i: number = 0; i < data.resources.length; i++) {
                        const entry: Egret_Res.ResourceInfo = data.resources[i]!;
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
