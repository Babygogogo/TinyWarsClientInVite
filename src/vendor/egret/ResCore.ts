
import type * as processor from "./ProcessorCore";
import { runtime } from "./Runtime";
import * as egret from "./EgretCore";
import * as path from "./Path";
import * as sys from "./SysCore";

export type ResourceCallback<T = unknown> = (this: unknown, data: T | null, key: string) => void;
export type ResourceErrorCode = 1001 | 1002 | 2001 | 2002 | 2003 | 2004 | 2005 | 2006;

export interface ResourceInfo {
    name: string;
    url: string;
    type: string;
    root: string;
    extra?: number;
    groupNames?: string[];
    promise?: Promise<unknown>;
    scale9grid?: string;
    subkeys?: string;
    etc1_alpha_url?: string;
}
export interface ResourceWithSubkey {
    r: ResourceInfo;
    key: string;
    subkey: string;
}
export interface FileSystem {
    getFile(filename: string): ResourceInfo | null | undefined;
    addFile(data: ResourceInfo): void;
    removeFile(filename: string): void;
    profile(): void;
}
export interface ConfigData {
    alias: Record<string, string>;
    groups: Record<string, string[]>;
    resourceRoot: string;
    mergeSelector: ((path: string) => string) | null;
    fileSystem: FileSystem | null;
    loadGroup: string[];
}
export interface PromiseTaskReporter {
    onProgress(current: number, total: number, resource: ResourceInfo): void;
}
export interface IVersionController {
    init(): Promise<void>;
    getVirtualUrl(url: string): string;
}
export interface ProcessHost {
    state: Record<string, number>;
    readonly resourceConfig: ResourceConfig;
    load<T = unknown>(resource: ResourceInfo, processor?: string | processor.Processor<T>): Promise<T>;
    unload(resource: ResourceInfo): boolean;
    save(resource: ResourceInfo, data: unknown): void;
    get<T = unknown>(resource: ResourceInfo): T | undefined;
    remove(resource: ResourceInfo): void;
}
export interface GroupLoadError {
    itemList?: ResourceInfo[];
    error?: ResourceManagerError;
    lastError?: ResourceManagerError;
}
export interface MovieClipConfig {
    mc: Record<string, egret.MovieClipSource>;
    res: Record<string, { x: number; y: number; w: number; h: number }>;
}
export interface ResourceItem {
    name: string;
    url: string;
    type: string;
    data: ResourceInfo;
    root: string;
}
export interface FileEntry {
    url: string;
    type: string;
    name?: string;
    root?: string;
}
export interface FileTree {
    [name: string]: FileTree | FileEntry | undefined;
}

export function getResourceInfo(path: string): ResourceInfo | null | undefined {
    let result: ResourceInfo | null | undefined = getConfig().config.fileSystem!.getFile(path);
    if (!result) {
        // let resourceNameSelector = (path: string): string => path;
        // path = resourceNameSelector(path);
        result = getConfig().config.fileSystem!.getFile(path);
    }
    return result;
}

export function setConfigURL(url: string, root: string): void {
    ConfigItemHelper.setConfigURL(url, root);
}

export function nameSelector(url: string): string {
    return path.basename(url).split(".").join("_");
}

export function typeSelector(path: string): string {
    const ext: string = path.substr(path.lastIndexOf(".") + 1);
    switch (ext) {
        case "xml": case "json": case "sheet": case "mergeJson": case "zip": case "pvr": return ext;
        case "png": case "jpg": case "gif": case "jpeg": case "bmp": return ResourceItemHelper.TYPE_IMAGE;
        case "fnt": return ResourceItemHelper.TYPE_FONT;
        case "txt": return ResourceItemHelper.TYPE_TEXT;
        case "mp3": case "ogg": case "mpeg": case "wav": case "m4a": case "mp4": case "aiff": case "wma": case "mid": return ResourceItemHelper.TYPE_SOUND;
        default: return ResourceItemHelper.TYPE_BIN;
    }
}

export function registerAnalyzer(_type: string, _analyzerClass: abstract new (...args: never[]) => object): never {
    throw new ResourceManagerError(2002);
}

export function loadConfig(url: string, resourceRoot: string): Promise<void> | null | undefined {
    if (resourceRoot.indexOf("://") >= 0) {
        const temp: string[] = resourceRoot.split("://");
        resourceRoot = temp[0]! + "://" + path.normalize(temp[1]! + "/");
        url = url.replace(resourceRoot, "");
    } else {
        resourceRoot = path.normalize(resourceRoot + "/");
        url = url.replace(resourceRoot, "");
    }
    setConfigURL(url, resourceRoot);

    return Resource.getInstance().loadConfig();
}

export function loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<void> | null | undefined {
    return Resource.getInstance().loadGroup(name, priority, reporter);
}

export function isGroupLoaded(name: string): boolean {
    return Resource.getInstance().isGroupLoaded(name);
}

export function getGroupByName(name: string): ResourceItem[] {
    return Resource.getInstance().getGroupByName(name).map((r: ResourceInfo): ResourceItem => ResourceItemHelper.convertToResItem(r));
}

export function createGroup(name: string, keys: string[], override: boolean = false): boolean {
    return Resource.getInstance().createGroup(name, keys, override);
}

export function hasRes(key: string): boolean | null {
    return Resource.getInstance().hasRes(key);
}

export function getRes<T = unknown>(key: string): T | null | undefined {
    return Resource.getInstance().getRes<T>(key);
}

export function getResAsync<T = unknown>(key: string, compFunc?: ResourceCallback<T>, thisObject?: unknown): Promise<T> | null | undefined {
    return Resource.getInstance().getResAsync<T>(key, compFunc, thisObject);
}

export function getResByUrl<T = unknown>(url: string, compFunc?: ResourceCallback<T>, thisObject?: unknown, type: string = ""): Promise<T> | null | undefined {
    const instance = Resource.getInstance();
    if (!instance.getHasLoadConfig()) {
        const message: string = sys.tr(3200);
        egret.warn(message);
        return Promise.reject(message);
    }
    return instance.getResByUrl<T>(url, compFunc, thisObject, type);
}

export function destroyRes(name: string, force?: boolean): boolean {
    return Resource.getInstance().destroyRes(name, force);
}

export function setMaxLoadingThread(thread: number): void {
    Resource.getInstance().setMaxLoadingThread(thread);
}

export function setMaxRetryTimes(retry: number): void {
    Resource.getInstance().setMaxRetryTimes(retry);
}

export function addEventListener(type: string, listener: egret.EventListener, thisObject: unknown, useCapture: boolean = false, priority: number = 0): void {
    Resource.getInstance().addEventListener(type, listener, thisObject, useCapture, priority);
}

export function removeEventListener(type: string, listener: egret.EventListener, thisObject: unknown, useCapture: boolean = false): void {
    Resource.getInstance().removeEventListener(type, listener, thisObject, useCapture);
}

export function $addResourceData(data: ResourceInfo): void {
    Resource.getInstance().addResourceData(data);
}

export function getVersionController(): IVersionController | undefined {
    return Resource.getInstance().vcs;
}

export function registerVersionController(vcs: IVersionController): void {
    Resource.getInstance().registerVersionController(vcs);
}

export function getVirtualUrl(url: string): string {
    const vcs = Resource.getInstance().vcs;
    return vcs ? vcs.getVirtualUrl(url) : url;
}

export function profile(): void {
    ResHelper.profile();
}

export function getHost(): ProcessHost {
    // TODO 原api为 export const host: ProcessHost = ...
    return ResHelper.getHost();
}

export function getConfig(): ResourceConfig {
    // TODO 原api为 export const config: ResourceConfig = new ResourceConfig();
    return ResHelper.getConfig();
}

export function getQueue(): ResourceLoader {
    // TODO 原api为 export const queue: ResourceLoader = new ResourceLoader();
    return ResHelper.getQueue();
}

function isResourceManagerError(error: unknown): error is ResourceManagerError {
    return typeof error === "object" && error !== null && "__resource_manager_error__" in error && !!error.__resource_manager_error__;
}

export class ConfigItemHelper {
    private static _configItem: ResourceInfo | undefined;

    public static setConfigURL(url: string, root: string): void {
        ConfigItemHelper._configItem = {
            type: url.indexOf(".json") >= 0 ? "legacyResourceConfig" : "resourceConfig",
            root: root,
            url: url,
            name: url
        };
    }

    public static getConfigItem(): ResourceInfo | undefined {
        return ConfigItemHelper._configItem;
    }
}

export class ResourceConfig {
    public config!: ConfigData;

    public constructor() {
    }

    public init(): Promise<unknown> {
        const configItem = ConfigItemHelper.getConfigItem();
        if (configItem == null) {
            throw new ResourceManagerError(1001);
        }

        if (!this.config) {
            this.config = {
                alias: {},
                groups: {},
                resourceRoot: configItem.root,
                mergeSelector: null,
                fileSystem: null,
                loadGroup: []
            };
        }

        return getQueue().pushResItem(configItem).catch((reason: unknown): Promise<never> => {
            let error: unknown = reason;
            if (!isResourceManagerError(error)) {
                const details: { error?: { stack?: string }; stack?: string } = error as { error?: { stack?: string }; stack?: string };
                console.error(details.error ? details.error.stack : details.stack);
                error = new ResourceManagerError(1002);
            }
            getHost().remove(configItem);
            return Promise.reject(error);
        });
    }
    public getGroupByName(name: string): ResourceInfo[] {
        const group: string[] | undefined = this.config.groups[name];
        const result: ResourceInfo[] = [];
        if (!group) { return result; }
        for (let i: number = 0; i < group.length; i++) {
            const paramKey: string = group[i]!;
            const entry: ResourceWithSubkey | null = getConfig().getResourceWithSubkey(paramKey);
            if (entry == null) { continue; }
            const r: ResourceInfo = entry.r;
            if (r == null) { throw new ResourceManagerError(2005, entry.key); }
            if (result.indexOf(r) == -1) { result.push(r); }
        }
        return result;
    }
    public __temp__get__type__via__url(url_or_alias: string): string {
        const url: string = this.config.alias[url_or_alias] || url_or_alias;
        if (typeSelector) {
            const type: string = typeSelector(url);
            if (!type) { throw new ResourceManagerError(2004, url); }
            return type;
        }
        console.warn("RES.mapConfig ��δ���� typeSelector");
        return "unknown";
    }
    public getResourceWithSubkey(key: string): ResourceWithSubkey | null {
        key = this.getKeyByAlias(key);
        const index: number = key.indexOf("#");
        let subkey: string = "";
        if (index >= 0) { subkey = key.substr(index + 1); key = key.substr(0, index); }
        const r: ResourceInfo | null = this.getResource(key);
        return r ? { r: r, key: key, subkey: subkey } : null;
    }
    public getKeyByAlias(aliasName: string): string { return this.config.alias[aliasName] || aliasName; }
    public getResource(path_or_alias: string): ResourceInfo | null {
        const path: string = this.config.alias[path_or_alias] || path_or_alias;
        return getResourceInfo(path) || null;
    }
    public createGroup(name: string, keys: string[], override: boolean = false): boolean {
        if ((!override && this.config.groups[name]) || !keys || keys.length == 0) { return false; }
        let group: string[] = [];
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[i]!;
            const groupInfo: string[] | undefined = this.config.groups[key];
            if (groupInfo) { group = group.concat(groupInfo); } else { group.push(key); }
        }
        this.config.groups[name] = group;
        return true;
    }
    public addSubkey(subkey: string, name: string): void { this.addAlias(subkey, name + "#" + subkey); }
    public addAlias(alias: string, key: string): void { this.config.alias[alias] = this.config.alias[key] || key; }
    public addResourceData(data: ResourceInfo): void {
        if (hasRes(data.name)) { return; }
        if (!data.type) { data.type = this.__temp__get__type__via__url(data.url); }
        getConfig().config.fileSystem!.addFile(data);
    }
    public removeResourceData(data: ResourceInfo): void {
        if (!hasRes(data.name)) { return; }
        getConfig().config.fileSystem!.removeFile(data.url);
        if (this.config.alias[data.name]) { delete this.config.alias[data.name]; }
    }
}
egret.__reflect(ResourceConfig.prototype, "RES.ResourceConfig");

export class ResourceLoader {
    public groupTotalDic: Record<string, number> = {};
    public numLoadedDic: Record<string, number> = {};
    public groupErrorDic: Record<string, boolean> = {};
    public retryTimesDic: Record<string, number> = {};
    public maxRetryTimes: number = 3;
    public reporterDic: Record<string, PromiseTaskReporter | undefined> = {};
    public dispatcherDic: Record<string, egret.EventDispatcher> = {};
    public failedList: ResourceInfo[] = [];
    public loadItemErrorDic: Record<string, ResourceInfo[]> = {};
    public errorDic: Record<string, ResourceManagerError> = {};
    public itemListPriorityDic: Record<string, ResourceInfo[]> = {};
    public itemLoadDic: Record<string, number> = {};
    public promiseHash: Record<string, Promise<unknown>> = {};
    public lazyLoadList: ResourceInfo[] = [];
    public loadingCount: number = 0;
    public thread: number = 4;
    public pushResItem(resInfo: ResourceInfo): Promise<unknown> {
        const key: string = resInfo.root + resInfo.name;
        const existing: Promise<unknown> | undefined = this.promiseHash[key];
        if (existing) { return existing; }
        this.lazyLoadList.push(resInfo);
        this.itemListPriorityDic[Number.NEGATIVE_INFINITY] = this.lazyLoadList;
        this.updatelistPriority(this.lazyLoadList, Number.NEGATIVE_INFINITY);
        const dispatcher: egret.EventDispatcher = new egret.EventDispatcher();
        this.dispatcherDic[key] = dispatcher;
        const promise: Promise<unknown> = new Promise<unknown>((resolve: (value: unknown) => void, reject: (reason: unknown) => void): void => {
            dispatcher.addEventListener("complete", (e: egret.Event): void => { resolve(e.data); }, null);
            dispatcher.addEventListener("error", (e: egret.Event): void => { reject(e.data); }, null);
        });
        this.promiseHash[key] = promise;
        this.loadNextResource();
        return promise;
    }
    public pushResGroup(list: ResourceInfo[], groupName: string, priority: number, reporter?: PromiseTaskReporter): Promise<unknown> {
        const existing: Promise<unknown> | undefined = this.promiseHash[groupName];
        if (existing) { return existing; }
        const total: number = list.length;
        for (let i: number = 0; i < total; i++) {
            const resInfo: ResourceInfo = list[i]!;
            if (!resInfo.groupNames) { resInfo.groupNames = []; }
            resInfo.groupNames.push(groupName);
        }
        this.groupTotalDic[groupName] = list.length;
        this.numLoadedDic[groupName] = 0;
        this.updatelistPriority(list, priority);
        this.reporterDic[groupName] = reporter;
        const dispatcher: egret.EventDispatcher = new egret.EventDispatcher();
        this.dispatcherDic[groupName] = dispatcher;
        const promise: Promise<unknown> = new Promise<unknown>((resolve: (value: unknown) => void, reject: (reason: unknown) => void): void => {
            dispatcher.addEventListener("complete", resolve, null);
            dispatcher.addEventListener("error", (e: egret.Event): void => { reject(e.data); }, null);
        });
        this.promiseHash[groupName] = promise;
        this.loadNextResource();
        return promise;
    }
    public updatelistPriority(list: ResourceInfo[], priority: number): void {
        if (this.itemListPriorityDic[priority] == undefined) { this.itemListPriorityDic[priority] = []; }
        for (let i: number = 0; i < list.length; i++) {
            const item: ResourceInfo = list[i]!;
            if (this.itemLoadDic[item.root + item.name] == 1) { continue; }
            const oldPriority: number | undefined = this.findPriorityInDic(item);
            if (oldPriority == undefined) { this.itemListPriorityDic[priority]!.push(item); }
            else if (oldPriority < priority) {
                this.itemListPriorityDic[priority]!.push(item);
                const index: number = this.itemListPriorityDic[oldPriority]!.indexOf(item);
                this.itemListPriorityDic[oldPriority]!.splice(index, 1);
            }
        }
    }
    public findPriorityInDic(item: ResourceInfo): number | undefined {
        let priority: string;
        for (priority in this.itemListPriorityDic) {
            if (this.itemListPriorityDic[priority]!.indexOf(item) > -1) { return parseInt(priority); }
        }
        return undefined;
    }
    public loadNextResource(): void {
        while (this.loadingCount < this.thread) {
            const isload: boolean = this.loadSingleResource();
            if (!isload) { break; }
        }
    }
    public loadSingleResource(): boolean {
        const r: ResourceInfo | undefined = this.getOneResourceInfoInGroup();
        if (!r) { return false; }
        this.itemLoadDic[r.root + r.name] = 1;
        this.loadingCount++;
        this.loadResource(r).then((response: unknown): void => {
            this.loadingCount--;
            delete this.itemLoadDic[r.root + r.name];
            getHost().save(r, response);
            if (this.promiseHash[r.root + r.name] != null) {
                const dispatcher: egret.EventDispatcher = this.deleteDispatcher(r.root + r.name);
                dispatcher.dispatchEventWith("complete", false, response);
            }
            const groupNames: string[] | undefined = r.groupNames;
            if (groupNames) {
                delete r.groupNames;
                for (let i: number = 0; i < groupNames.length; i++) {
                    const groupName: string = groupNames[i]!;
                    if (this.setGroupProgress(groupName, r)) { this.loadGroupEnd(groupName); }
                }
            }
            this.loadNextResource();
        }).catch((error: unknown): void => {
            if (!error) { throw r.name + " load fail"; }
            if (!isResourceManagerError(error)) { throw error; }
            delete this.itemLoadDic[r.root + r.name];
            this.loadingCount--;
            delete getHost().state[r.root + r.name];
            const times: number = this.retryTimesDic[r.name] || 1;
            if (times > this.maxRetryTimes) {
                delete this.retryTimesDic[r.name];
                if (this.promiseHash[r.root + r.name] != null) {
                    const dispatcher: egret.EventDispatcher = this.deleteDispatcher(r.root + r.name);
                    dispatcher.dispatchEventWith("error", false, { r: r, error: error });
                }
                const groupNames: string[] | undefined = r.groupNames;
                if (groupNames) {
                    delete r.groupNames;
                    for (let i: number = 0; i < groupNames.length; i++) {
                        const groupName: string = groupNames[i]!;
                        if (!this.loadItemErrorDic[groupName]) { this.loadItemErrorDic[groupName] = []; }
                        if (this.loadItemErrorDic[groupName]!.indexOf(r) == -1) { this.loadItemErrorDic[groupName]!.push(r); }
                        this.groupErrorDic[groupName] = true;
                        if (this.setGroupProgress(groupName, r)) { this.loadGroupEnd(groupName, error); }
                        else { this.errorDic[groupName] = error; }
                    }
                }
                this.loadNextResource();
            } else {
                this.retryTimesDic[r.name] = times + 1;
                this.failedList.push(r);
                this.loadNextResource();
            }
        });
        return true;
    }
    public getOneResourceInfoInGroup(): ResourceInfo | undefined {
        if (this.failedList.length > 0) { return this.failedList.shift(); }
        let maxPriority: number = Number.NEGATIVE_INFINITY;
        let p: string;
        for (p in this.itemListPriorityDic) { maxPriority = Math.max(maxPriority, Number(p)); }
        const list: ResourceInfo[] | undefined = this.itemListPriorityDic[maxPriority];
        if (!list) { return undefined; }
        if (list.length == 0) { delete this.itemListPriorityDic[maxPriority]; return this.getOneResourceInfoInGroup(); }
        return list.shift();
    }
    public setGroupProgress(groupName: string, r: ResourceInfo): boolean {
        const reporter: PromiseTaskReporter | undefined = this.reporterDic[groupName];
        this.numLoadedDic[groupName] = this.numLoadedDic[groupName]! + 1;
        const current: number = this.numLoadedDic[groupName]!;
        const total: number = this.groupTotalDic[groupName]!;
        if (reporter && reporter.onProgress) { reporter.onProgress(current, total, r); }
        return current == total;
    }
    public loadGroupEnd(groupName: string, lastError?: ResourceManagerError): void {
        delete this.groupTotalDic[groupName];
        delete this.numLoadedDic[groupName];
        delete this.reporterDic[groupName];
        const dispatcher: egret.EventDispatcher = this.deleteDispatcher(groupName);
        if (!lastError) {
            const groupError: boolean | undefined = this.groupErrorDic[groupName];
            delete this.groupErrorDic[groupName];
            if (groupError) {
                const itemList: ResourceInfo[] | undefined = this.loadItemErrorDic[groupName];
                delete this.loadItemErrorDic[groupName];
                const error: ResourceManagerError | undefined = this.errorDic[groupName];
                delete this.errorDic[groupName];
                dispatcher.dispatchEventWith("error", false, { itemList: itemList, error: error });
            } else { dispatcher.dispatchEventWith("complete"); }
        } else {
            delete this.groupErrorDic[groupName];
            const itemList: ResourceInfo[] | undefined = this.loadItemErrorDic[groupName];
            delete this.loadItemErrorDic[groupName];
            dispatcher.dispatchEventWith("error", false, { itemList: itemList, lastError: lastError });
        }
    }
    public deleteDispatcher(groupName: string): egret.EventDispatcher {
        delete this.promiseHash[groupName];
        const dispatcher: egret.EventDispatcher = this.dispatcherDic[groupName]!;
        delete this.dispatcherDic[groupName];
        return dispatcher;
    }
    public loadResource(r: ResourceInfo, p?: processor.Processor): Promise<unknown> {
        if (!p) {
            {
                const s: number | undefined = getHost().state[r.root + r.name];
                if (s == 2) { return Promise.resolve(getHost().get(r)); }
                if (s == 1) { return r.promise!; }
            }
            p = runtime.processor.isSupport(r);
        }
        if (!p) { throw new ResourceManagerError(2001, r.name, r.type); }
        getHost().state[r.root + r.name] = 1;
        const promise: Promise<unknown> = p.onLoadStart(getHost(), r);
        r.promise = promise;
        return promise;
    }
    public unloadResource(r: ResourceInfo): boolean {
        const data: unknown = getHost().get(r);
        if (!data) { console.warn("�����ͷŲ����ڵ���Դ:", r.name); return false; }
        const p: processor.Processor | undefined = runtime.processor.isSupport(r);
        if (p) {
            p.onRemoveStart(getHost(), r);
            getHost().remove(r);
            if (r.extra == 1) { getConfig().removeResourceData(r); }
        }
        return true;
    }
}
egret.__reflect(ResourceLoader.prototype, "RES.ResourceLoader");

export class Resource extends egret.EventDispatcher {
    public isVcsInit: boolean = false;
    public vcs: IVersionController | undefined;
    public normalLoadConfig: () => Promise<void> = (): Promise<void> => getConfig().init().then(
        (_data: unknown): void => {
            this._hasLoadConfig = true;
            ResourceEvent.dispatchResourceEvent(this, ResourceEvent.CONFIG_COMPLETE);
        },
        (error: unknown): Promise<never> => {
            ResourceEvent.dispatchResourceEvent(this, ResourceEvent.CONFIG_LOAD_ERROR);
            return Promise.reject(error);
        }
    );
    private _hasLoadConfig = false;
    private static _instance: Resource | undefined;

    public static getInstance(): Resource {
        return Resource._instance ??= new Resource();
    }

    private constructor() {
        super();
    }
    public registerVersionController(vcs: IVersionController): void {
        this.vcs = vcs;
        this.isVcsInit = false;
    }

    public loadConfig(): Promise<void> {
        if (!this.isVcsInit && this.vcs) {
            this.isVcsInit = true;
            return this.vcs.init().then((): Promise<void> => this.normalLoadConfig());
        }
        return this.normalLoadConfig();
    }
    public getHasLoadConfig(): boolean {
        return this._hasLoadConfig;
    }

    public isGroupLoaded(name: string): boolean {
        const resources: ResourceInfo[] = getConfig().getGroupByName(name);
        return resources.every((r: ResourceInfo): boolean => getHost().get(r) != null);
    }
    public getGroupByName(name: string): ResourceInfo[] { return getConfig().getGroupByName(name); }
    public loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<void> {
        const reporterDelegate: PromiseTaskReporter = {
            onProgress: (current: number, total: number, resItem: ResourceInfo): void => {
                if (reporter && reporter.onProgress) { reporter.onProgress(current, total, resItem); }
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_PROGRESS, name, resItem, current, total);
            }
        };
        return this._loadGroup(name, priority, reporterDelegate).then((_data: unknown): void => {
            if (getConfig().config.loadGroup.indexOf(name) == -1) { getConfig().config.loadGroup.push(name); }
            ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_COMPLETE, name);
        }, (error: GroupLoadError): Promise<never> => {
            if (getConfig().config.loadGroup.indexOf(name) == -1) { getConfig().config.loadGroup.push(name); }
            if (error.itemList) {
                const itemList: ResourceInfo[] = error.itemList;
                const length: number = itemList.length;
                for (let i: number = 0; i < length; i++) {
                    const item: ResourceInfo = itemList[i]!;
                    delete item.promise;
                    ResourceEvent.dispatchResourceEvent(this, ResourceEvent.ITEM_LOAD_ERROR, name, item);
                }
            }
            ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_LOAD_ERROR, name);
            return Promise.reject(error.error);
        });
    }
    public _loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<unknown> {
        const resources: ResourceInfo[] = getConfig().getGroupByName(name);
        if (resources.length == 0) { return Promise.reject({ error: new ResourceManagerError(2005, name) }); }
        return getQueue().pushResGroup(resources, name, priority, reporter);
    }
    public createGroup(name: string, keys: string[], override: boolean = false): boolean { return getConfig().createGroup(name, keys, override); }
    public hasRes(key: string): boolean | null { return getConfig().getResourceWithSubkey(key) != null; }
    public getRes<T = unknown>(resKey: string): T | null | undefined {
        const result: ResourceWithSubkey | null = getConfig().getResourceWithSubkey(resKey);
        if (!result) { return null; }
        const r: ResourceInfo = result.r;
        const p: processor.Processor | undefined = runtime.processor.isSupport(r);
        if (p && p.getData && result.subkey) { return p.getData(getHost(), r, result.key, result.subkey) as T; }
        return getHost().get<T>(r);
    }
    public getResAsync<T = unknown>(key: string, compFunc?: ResourceCallback<T>, thisObject?: unknown): Promise<T> | null {
        const paramKey: string = key;
        const tempResult: ResourceWithSubkey | null = getConfig().getResourceWithSubkey(key);
        if (tempResult == null) {
            if (compFunc) { compFunc.call(thisObject, null, paramKey); }
            return Promise.reject(new ResourceManagerError(2006, key));
        }
        const data: T | null | undefined = this.getRes<T>(key);
        if (data) {
            if (compFunc) { egret.callLater((): void => { compFunc.call(thisObject, data, paramKey); }, this); }
            return Promise.resolve(data);
        }
        const r: ResourceInfo = tempResult.r;
        const subkey: string = tempResult.subkey;
        return getQueue().pushResItem(r).then((value: unknown): T => {
            getHost().save(r, value);
            const p: processor.Processor | undefined = runtime.processor.isSupport(r);
            if (p && p.getData && subkey) { value = p.getData(getHost(), r, key, subkey); }
            if (compFunc) { compFunc.call(thisObject, value as T, paramKey); }
            return value as T;
        }, (error: unknown): Promise<never> => {
            getHost().remove(r);
            ResourceEvent.dispatchResourceEvent(this, ResourceEvent.ITEM_LOAD_ERROR, "", r);
            if (compFunc) { compFunc.call(thisObject, null, paramKey); return Promise.reject(null); }
            return Promise.reject(error);
        });
    }
    public getResByUrl<T = unknown>(url: string, compFunc?: ResourceCallback<T>, thisObject?: unknown, type: string = ""): Promise<T> | null {
        let r: ResourceInfo | null = getConfig().getResource(url);
        if (!r) {
            if (!type) { type = getConfig().__temp__get__type__via__url(url); }
            r = { name: url, url: url, type: type, root: "", extra: 1 };
            getConfig().addResourceData(r);
            r = getConfig().getResource(url);
            if (!r) { throw "never"; }
        }
        const resource: ResourceInfo = r;
        return getQueue().pushResItem(resource).then((value: unknown): T => {
            getHost().save(resource, value);
            if (compFunc) { compFunc.call(thisObject, value as T, resource.url); }
            return value as T;
        }, (error: unknown): Promise<never> => {
            getHost().remove(resource);
            ResourceEvent.dispatchResourceEvent(this, ResourceEvent.ITEM_LOAD_ERROR, "", resource);
            if (compFunc) { compFunc.call(thisObject, null, url); return Promise.reject(null); }
            return Promise.reject(error);
        });
    }
    public destroyRes(name: string, force: boolean = true): boolean {
        const group: ResourceInfo[] = getConfig().getGroupByName(name);
        if (group && group.length > 0) {
            const index: number = getConfig().config.loadGroup.indexOf(name);
            if (index == -1) { return false; }
            if (force || (getConfig().config.loadGroup.length == 1 && getConfig().config.loadGroup[0] == name)) {
                for (let i: number = 0; i < group.length; i++) { const item: ResourceInfo = group[i]!; getQueue().unloadResource(item); }
                getConfig().config.loadGroup.splice(index, 1);
            } else {
                const removeItemHash: Record<string, number> = {};
                const loadedGroups: string[] = getConfig().config.loadGroup;
                for (let i: number = 0; i < loadedGroups.length; i++) {
                    const groupName: string = loadedGroups[i]!;
                    const keys: string[] = getConfig().config.groups[groupName]!;
                    for (let j: number = 0; j < keys.length; j++) {
                        const tmpname: string = keys[j]!;
                        removeItemHash[tmpname] = removeItemHash[tmpname] ? removeItemHash[tmpname]! + 1 : 1;
                    }
                }
                for (let i: number = 0; i < group.length; i++) {
                    const item: ResourceInfo = group[i]!;
                    if (removeItemHash[item.name] && removeItemHash[item.name] == 1) { getQueue().unloadResource(item); }
                }
                getConfig().config.loadGroup.splice(index, 1);
            }
            return true;
        }
        const item: ResourceInfo | null = getConfig().getResource(name);
        if (item) { return getQueue().unloadResource(item); }
        console.warn("���ڴ�" + name + "��Դ������");
        return false;
    }
    public setMaxLoadingThread(thread: number): void { if (thread < 1) { thread = 1; } getQueue().thread = thread; }
    public setMaxRetryTimes(retry: number): void { getQueue().maxRetryTimes = Math.max(retry, 0); }
    public addResourceData(data: ResourceInfo): void { data.root = ""; getConfig().addResourceData(data); }
}
egret.__reflect(Resource.prototype, "RES.Resource");

export class ResourceEvent extends egret.Event {
    public itemsLoaded: number = 0;
    public itemsTotal: number = 0;
    public groupName: string = "";
    public resItem: ResourceItem | undefined;
    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) { super(type, bubbles, cancelable); }
    public static dispatchResourceEvent(target: egret.IEventDispatcher, type: string, groupName: string = "", resItem: ResourceInfo | undefined = undefined, itemsLoaded: number = 0, itemsTotal: number = 0): boolean {
        const event: ResourceEvent = egret.Event.create(ResourceEvent, type);
        event.groupName = groupName;
        if (resItem) { event.resItem = ResourceItemHelper.convertToResItem(resItem); }
        event.itemsLoaded = itemsLoaded; event.itemsTotal = itemsTotal;
        const result: boolean = target.dispatchEvent(event);
        egret.Event.release(event);
        return result;
    }
    public static ITEM_LOAD_ERROR: string = "itemLoadError";
    public static CONFIG_COMPLETE: string = "configComplete";
    public static CONFIG_LOAD_ERROR: string = "configLoadError";
    public static GROUP_PROGRESS: string = "groupProgress";
    public static GROUP_COMPLETE: string = "groupComplete";
    public static GROUP_LOAD_ERROR: string = "groupLoadError";
}
egret.__reflect(ResourceEvent.prototype, "RES.ResourceEvent");

export class NewFileSystem {
    public data: FileTree;

    public constructor(data: FileTree) {
        this.data = data;
    }
    public profile(): void { console.log(this.data); }
    public addFile(filename: string, type: string = ""): void {
        if (!type) { type = ""; }
        filename = path.normalize(filename);
        const basefilename: string = path.basename(filename);
        const folder: string = path.dirname(filename);
        if (!this.exists(folder)) { this.mkdir(folder); }
        const d: FileTree = this.resolve(folder) as FileTree;
        d[basefilename] = { url: filename, type: type };
    }
    public getFile(filename: string): FileEntry | FileTree | undefined {
        const result: FileEntry | FileTree | undefined = this.resolve(filename);
        if (result) { (result as FileEntry).name = filename; }
        return result;
    }
    public resolve(dirpath: string): FileTree | FileEntry | undefined {
        if (dirpath == "") { return this.data; }
        dirpath = path.normalize(dirpath);
        const list: string[] = dirpath.split("/");
        let current: FileTree | FileEntry | undefined = this.data;
        for (let i: number = 0; i < list.length; i++) {
            const f: string = list[i]!;
            if (current) { current = (current as FileTree)[f]; } else { return current; }
        }
        return current;
    }
    public mkdir(dirpath: string): void {
        dirpath = path.normalize(dirpath);
        const list: string[] = dirpath.split("/");
        let current: FileTree = this.data;
        for (let i: number = 0; i < list.length; i++) { const f: string = list[i]!; if (!current[f]) { current[f] = {}; } current = current[f] as FileTree; }
    }
    public exists(dirpath: string): boolean {
        if (dirpath == "") { return true; }
        dirpath = path.normalize(dirpath);
        const list: string[] = dirpath.split("/");
        let current: FileTree = this.data;
        for (let i: number = 0; i < list.length; i++) { const f: string = list[i]!; if (!current[f]) { return false; } current = current[f] as FileTree; }
        return true;
    }
}
egret.__reflect(NewFileSystem.prototype, "RES.NewFileSystem");

export class ResourceItemHelper {
    public static readonly TYPE_XML: string = "xml";
    public static readonly TYPE_IMAGE: string = "image";
    public static readonly TYPE_BIN: string = "bin";
    public static readonly TYPE_TEXT: string = "text";
    public static readonly TYPE_JSON: string = "json";
    public static readonly TYPE_SHEET: string = "sheet";
    public static readonly TYPE_FONT: string = "font";
    public static readonly TYPE_SOUND: string = "sound";

    public static convertToResItem(r: ResourceInfo): ResourceItem {
        let name: string = r.name;
        if (!getConfig().config) {
            name = r.url;
        } else {
            let aliasName: string;
            for (aliasName in getConfig().config.alias) {
                if (getConfig().config.alias[aliasName] == r.url) {
                    name = aliasName;
                }
            }
        }

        return {
            name: name,
            url: r.url,
            type: r.type,
            data: r,
            root: r.root
        };
    }
}

export class ResourceManagerError extends Error {
    public __resource_manager_error__: boolean = true;
    public constructor(code: ResourceErrorCode, replacer?: string, replacer2?: string) {
        super();
        this.name = code.toString();
        this.message = ResourceManagerError.errorMessage[code].replace("{0}", String(replacer)).replace("{1}", String(replacer2));
    }
    public static errorMessage: Record<ResourceErrorCode, string> = {
        1001: '文件加载失败:{0}',
        1002: "ResourceManager 初始化失败：配置文件加载失败",
        2001: "{0}解析失败,不支持指定解析类型:\'{1}\'，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
        2002: "Analyzer 相关API 在 ResourceManager 中不再支持，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
        2003: "{0}解析失败,错误原因:{1}",
        2004: "无法找到文件类型:{0}",
        2005: "RES加载了不存在或空的资源组:\"{0}\"",
        2006: "资源配置文件中无法找到特定的资源:{0}"
    };
}
egret.__reflect(ResourceManagerError.prototype, "RES.ResourceManagerError");

export class ResHelper {
    private static __tempCache: Record<string, unknown> = {};
    private static _host: ProcessHost | undefined;
    private static readonly _config = new ResourceConfig();
    private static readonly _queue = new ResourceLoader();

    public static profile(): void {
        ResHelper._config.config.fileSystem!.profile();
        console.log(ResHelper.__tempCache);
        let totalImageSize: number = 0;
        let key: string;
        for (key in ResHelper.__tempCache) {
            const img: unknown = ResHelper.__tempCache[key];
            if (img instanceof egret.Texture) {
                totalImageSize += img.$bitmapWidth * img.$bitmapHeight * 4;
            }
        }
        console.log("gpu size : " + (totalImageSize / 1024).toFixed(3) + "kb");
    }

    public static getHost(): ProcessHost {
        if (!ResHelper._host) {
            const host: ProcessHost = {
                state: {},
                get resourceConfig(): ResourceConfig {
                    return ResHelper._config;
                },
                load<T = unknown>(r: ResourceInfo, processorName?: string | processor.Processor<T>): Promise<T> {
                    const p: processor.Processor | undefined = typeof processorName == "string" ? runtime.processor.getMap()[processorName] : processorName;
                    return ResHelper._queue.loadResource(r, p) as Promise<T>;
                },
                unload(r: ResourceInfo): boolean {
                    return ResHelper._queue.unloadResource(r);
                },
                save(resource: ResourceInfo, data: unknown): void {
                    host.state[resource.root + resource.name] = 2;
                    delete resource.promise;
                    ResHelper.__tempCache[resource.root + resource.name] = data;
                },
                get<T = unknown>(resource: ResourceInfo): T | undefined {
                    return ResHelper.__tempCache[resource.root + resource.name] as T | undefined;
                },
                remove(resource: ResourceInfo): void {
                    delete host.state[resource.root + resource.name];
                    delete ResHelper.__tempCache[resource.root + resource.name];
                }
            };
            ResHelper._host = host;
        }

        return ResHelper._host;
    }

    public static getConfig(): ResourceConfig {
        return ResHelper._config;
    }

    public static getQueue(): ResourceLoader {
        return ResHelper._queue;
    }
}
