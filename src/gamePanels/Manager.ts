import type * as GamePanelsTypes from "./Types.ts";
import type * as GraphicsConstants from "../graphics/Constants.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as Logger2 from "../Logger.ts";
import * as ResManager2 from "../ResManager.ts";
import * as StagesStageManager from "../stages/StageManager.ts";
import type * as UiInterfacesIUiPanel from "../ui/interfaces/IUiPanel.ts";
import * as UiUtilsUiSkinHelpers from "../ui/utils/UiSkinHelpers.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

type PanelConfig<T>     = GamePanelsTypes.PanelConfig<T>;
type IUiPanel<T>        = UiInterfacesIUiPanel.IUiPanel<T>;
const _IS_CACHE_ENABLED = true;
const _runningPanelDict = new Map<PanelConfig<any>, IUiPanel<any>>();
const _cachedPanelDict  = new Map<PanelConfig<any>, IUiPanel<any>>();
const _queueDict        = new Map<PanelConfig<any>, (() => Promise<void>)[]>();

/**
 * 打开面板不是瞬时的，因为可能需要加载远程资源。
 *
 * 同一个面板所有open与close会依照调用时间顺序被插入到同一个队列中，并依序执行。每个面板都有专属的唯一队列。
 *
 * 轮到此次open时，执行逻辑如下：
 *
 * 如果指定面板正处于打开状态（无论打开动画是否播放完毕），那么会使用该面板实例直接显示新数据。
 *
 * 如果指定面板已被创建并缓存过，则会使用该缓存实例来显示（会重新进行必要的事件注册、显示打开动画）。
 *
 * 如果不是以上情况，则会从头创建面板。
 */
export async function openPanel<T>(config: PanelConfig<T>, openData: T): Promise<IUiPanel<T>> {
    return addToQueue(config, () => doOpen(config, openData));
}
async function doOpen<T>(config: PanelConfig<T>, openData: T): Promise<IUiPanel<T>> {
    return getRunningPanel(config)
        ? openViaRunningPanel(config, openData)
        : (getCachedPanel(config)
            ? openViaCachedPanel(config, openData)
            : openViaCreatePanel(config, openData)
        );
}
async function openViaRunningPanel<T>(config: PanelConfig<T>, openData: T): Promise<IUiPanel<T>> {
    const panel = HelpersMisc.getExisted(getRunningPanel(config), UtilsClientErrorCode.ClientErrorCode.PanelManager_OpenViaRunningPanel_00);
    panel.setOpenData(openData);
    await panel.applyOpenData();

    Logger2.warn(`Panel opened via running: ${config.skinName}`);
    return panel;
}
async function openViaCachedPanel<T>(config: PanelConfig<T>, openData: T): Promise<IUiPanel<T>> {
    const panel     = HelpersMisc.getExisted(getCachedPanel(config), UtilsClientErrorCode.ClientErrorCode.PanelManager_OpenViaCachedPanel_00);
    const layerType = config.layer;
    if (config.isExclusive) {
        closeAllPanelsInLayerExcept(layerType, [config]);
    }
    StagesStageManager.getLayer(layerType).addUiChild(panel);

    panel.setOpenData(openData);
    await Promise.all([
        panel.open(),
        panel.applyOpenData(),
    ]);

    addRunningPanel(config, panel);

    Logger2.warn(`Panel opened via cache: ${config.skinName}`);
    return panel;
}
async function openViaCreatePanel<T>(config: PanelConfig<T>, openData: T): Promise<IUiPanel<T>> {
    const panel     = await createPanel(config);
    const layerType = config.layer;
    if (config.isExclusive) {
        closeAllPanelsInLayerExcept(layerType, [config]);
    }
    StagesStageManager.getLayer(layerType).addUiChild(panel);

    // if (!panel.getIsChildrenCreated()) {
    //     await new Promise<void>(resolve => panel.once(TwnsUiPanel.EVENT_PANEL_CHILDREN_CREATED, resolve, null));
    // }

    panel.setOpenData(openData);
    await Promise.all([
        panel.open(),
        panel.applyOpenData(),
    ]);

    addRunningPanel(config, panel);
    if ((_IS_CACHE_ENABLED) && (config.needCache)) {
        addCachedPanel(config, panel);
    }

    Logger2.warn(`Panel opened via creating: ${config.skinName}`);
    return panel;
}

/**
 * 关闭面板不是瞬时的，因为可能存在关闭动画。
 *
 * 同一个面板所有open与close会依照调用时间顺序被插入到同一个队列中，并依序执行。每个面板都有专属的唯一队列。
 *
 * 轮到此次close时，如果指定面板未被打开，那么此次关闭将直接被忽略，否则就正常进行关闭。
 */
export async function closePanel<T>(config: PanelConfig<T>): Promise<void> {
    addToQueue(config, () => doClose(config));
}
async function doClose<T>(config: PanelConfig<T>): Promise<void> {
    const panel = getRunningPanel(config);
    if (panel == null) {
        // Logger.warn(`Panel close ignored because it's not opened: ${config.skinName}`);
        return;
    }

    await panel.close();

    StagesStageManager.getLayer(config.layer).removeUiChild(panel);
    deleteRunningPanel(config);

    Logger2.warn(`Panel closed: ${config.skinName}`);
}
export async function closeAllPanelsExcept(exceptions: PanelConfig<any>[] = []): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const [config, queue] of _queueDict) {
        if (((queue.length) || (getRunningPanel(config)))   &&
            (exceptions.indexOf(config) < 0)
        ) {
            promiseArray.push(closePanel(config));
        }
    }

    await Promise.all(promiseArray);
}
async function closeAllPanelsInLayerExcept(layer: GraphicsConstants.DisplayLayerId, exceptions: PanelConfig<any>[] = []): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const [config, queue] of _queueDict) {
        if (((queue.length) || (getRunningPanel(config)))   &&
            (config.layer === layer)                        &&
            (exceptions.indexOf(config) < 0)
        ) {
            promiseArray.push(closePanel(config));
        }
    }

    await Promise.all(promiseArray);
}

async function createPanel<T>(config: PanelConfig<T>): Promise<IUiPanel<T>> {
    const panel = new config.cls();
    UiUtilsUiSkinHelpers.loadSkin(panel, HelpersMisc.getExisted(ResManager2.getSkin(config.skinName)));
    panel.setPanelConfig(config);

    // if (!panel.getSkinInfo()?.getIsLoaded()) {
    //     await new Promise<void>(resolve => panel.once(UiTypes.RawEventName.SkinLoaded, resolve, null));
    // }

    return panel;
}

export function getRunningPanel<T>(config: PanelConfig<T>): IUiPanel<T> | null {
    return _runningPanelDict.get(config) ?? null;
}
function addRunningPanel<T>(config: PanelConfig<T>, panel: IUiPanel<T>): void {
    _runningPanelDict.set(config, panel);
}
function deleteRunningPanel<T>(config: PanelConfig<T>): void {
    _runningPanelDict.delete(config);
}

function getCachedPanel<T>(config: PanelConfig<T>): IUiPanel<T> | null {
    return _cachedPanelDict.get(config) ?? null;
}
function addCachedPanel<T>(config: PanelConfig<T>, panel: IUiPanel<T>): void {
    _cachedPanelDict.set(config, panel);
}

function addToQueue<T>(config: PanelConfig<any>, rawFunc: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
        const func = async (): Promise<void> => {
            const funcList = _queueDict.get(config);
            if (!funcList) {
                throw HelpersMisc.newError(`PanelManager.addToQueue() exception queueing 1!!`, UtilsClientErrorCode.ClientErrorCode.PanelManager_AddToQueue_00);
            } else {
                if (funcList[0] !== func) {
                    throw HelpersMisc.newError(`PanelManager.addToQueue() exception queueing 2!!`, UtilsClientErrorCode.ClientErrorCode.PanelManager_AddToQueue_01);
                } else {
                    const result = await rawFunc();
                    if (funcList.shift() !== func) {
                        throw HelpersMisc.newError(`PanelManager.addToQueue() exception queueing 3!!`, UtilsClientErrorCode.ClientErrorCode.PanelManager_AddToQueue_02);
                    }
                    resolve(result);

                    if (funcList.length) {
                        funcList[0]();
                    } else {
                        // _queueDict.delete(config);
                    }
                }
            }
        };

        const currQueue = _queueDict.get(config);
        if (currQueue) {
            currQueue.push(func);
            (currQueue.length === 1) && (func());
        } else {
            _queueDict.set(config, [func]);
            func();
        }
    });
}
