import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Stages_StageManager,
    ResManager,
    Ui_Utils_UiSkinHelpers,
    Logger,
    type Graphics_Constants,
    type Ui_Interfaces_IUiPanel,
    type GamePanels_Types,
} from "../internal.ts";

const _IS_CACHE_ENABLED = true;
const _runningPanelDict = new Map<GamePanels_Types.PanelConfig<any>, Ui_Interfaces_IUiPanel.IUiPanel<any>>();
const _cachedPanelDict  = new Map<GamePanels_Types.PanelConfig<any>, Ui_Interfaces_IUiPanel.IUiPanel<any>>();
const _queueDict        = new Map<GamePanels_Types.PanelConfig<any>, (() => Promise<void>)[]>();

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
export async function openPanel<T>(config: GamePanels_Types.PanelConfig<T>, openData: T): Promise<Ui_Interfaces_IUiPanel.IUiPanel<T>> {
    return addToQueue(config, () => doOpen(config, openData));
}
async function doOpen<T>(config: GamePanels_Types.PanelConfig<T>, openData: T): Promise<Ui_Interfaces_IUiPanel.IUiPanel<T>> {
    return getRunningPanel(config)
        ? openViaRunningPanel(config, openData)
        : (getCachedPanel(config)
            ? openViaCachedPanel(config, openData)
            : openViaCreatePanel(config, openData)
        );
}
async function openViaRunningPanel<T>(config: GamePanels_Types.PanelConfig<T>, openData: T): Promise<Ui_Interfaces_IUiPanel.IUiPanel<T>> {
    const panel = Helpers_Misc.getExisted(getRunningPanel(config), Utils_ClientErrorCode.ClientErrorCode.PanelManager_OpenViaRunningPanel_00);
    panel.setOpenData(openData);
    await panel.applyOpenData();

    Logger.warn(`Panel opened via running: ${config.skinName}`);
    return panel;
}
async function openViaCachedPanel<T>(config: GamePanels_Types.PanelConfig<T>, openData: T): Promise<Ui_Interfaces_IUiPanel.IUiPanel<T>> {
    const panel     = Helpers_Misc.getExisted(getCachedPanel(config), Utils_ClientErrorCode.ClientErrorCode.PanelManager_OpenViaCachedPanel_00);
    const layerType = config.layer;
    if (config.isExclusive) {
        closeAllPanelsInLayerExcept(layerType, [config]);
    }
    Stages_StageManager.getLayer(layerType).addUiChild(panel);

    panel.setOpenData(openData);
    await Promise.all([
        panel.open(),
        panel.applyOpenData(),
    ]);

    addRunningPanel(config, panel);

    Logger.warn(`Panel opened via cache: ${config.skinName}`);
    return panel;
}
async function openViaCreatePanel<T>(config: GamePanels_Types.PanelConfig<T>, openData: T): Promise<Ui_Interfaces_IUiPanel.IUiPanel<T>> {
    const panel     = await createPanel(config);
    const layerType = config.layer;
    if (config.isExclusive) {
        closeAllPanelsInLayerExcept(layerType, [config]);
    }
    Stages_StageManager.getLayer(layerType).addUiChild(panel);

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

    Logger.warn(`Panel opened via creating: ${config.skinName}`);
    return panel;
}

/**
 * 关闭面板不是瞬时的，因为可能存在关闭动画。
 *
 * 同一个面板所有open与close会依照调用时间顺序被插入到同一个队列中，并依序执行。每个面板都有专属的唯一队列。
 *
 * 轮到此次close时，如果指定面板未被打开，那么此次关闭将直接被忽略，否则就正常进行关闭。
 */
export async function closePanel<T>(config: GamePanels_Types.PanelConfig<T>): Promise<void> {
    addToQueue(config, () => doClose(config));
}
async function doClose<T>(config: GamePanels_Types.PanelConfig<T>): Promise<void> {
    const panel = getRunningPanel(config);
    if (panel == null) {
        // Logger.warn(`Panel close ignored because it's not opened: ${config.skinName}`);
        return;
    }

    await panel.close();

    Stages_StageManager.getLayer(config.layer).removeUiChild(panel);
    deleteRunningPanel(config);

    Logger.warn(`Panel closed: ${config.skinName}`);
}
export async function closeAllPanelsExcept(exceptions: GamePanels_Types.PanelConfig<any>[] = []): Promise<void> {
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
async function closeAllPanelsInLayerExcept(layer: Graphics_Constants.DisplayLayerId, exceptions: GamePanels_Types.PanelConfig<any>[] = []): Promise<void> {
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

async function createPanel<T>(config: GamePanels_Types.PanelConfig<T>): Promise<Ui_Interfaces_IUiPanel.IUiPanel<T>> {
    const panel = new config.cls();
    Ui_Utils_UiSkinHelpers.loadSkin(panel, Helpers_Misc.getExisted(ResManager.getSkin(config.skinName)));
    panel.setPanelConfig(config);

    // if (!panel.getSkinInfo()?.getIsLoaded()) {
    //     await new Promise<void>(resolve => panel.once(UiTypes.RawEventName.SkinLoaded, resolve, null));
    // }

    return panel;
}

export function getRunningPanel<T>(config: GamePanels_Types.PanelConfig<T>): Ui_Interfaces_IUiPanel.IUiPanel<T> | null {
    return _runningPanelDict.get(config) ?? null;
}
function addRunningPanel<T>(config: GamePanels_Types.PanelConfig<T>, panel: Ui_Interfaces_IUiPanel.IUiPanel<T>): void {
    _runningPanelDict.set(config, panel);
}
function deleteRunningPanel<T>(config: GamePanels_Types.PanelConfig<T>): void {
    _runningPanelDict.delete(config);
}

function getCachedPanel<T>(config: GamePanels_Types.PanelConfig<T>): Ui_Interfaces_IUiPanel.IUiPanel<T> | null {
    return _cachedPanelDict.get(config) ?? null;
}
function addCachedPanel<T>(config: GamePanels_Types.PanelConfig<T>, panel: Ui_Interfaces_IUiPanel.IUiPanel<T>): void {
    _cachedPanelDict.set(config, panel);
}

function addToQueue<T>(config: GamePanels_Types.PanelConfig<any>, rawFunc: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
        const func = async (): Promise<void> => {
            const funcList = _queueDict.get(config);
            if (!funcList) {
                throw Helpers_Misc.newError(`PanelManager.addToQueue() exception queueing 1!!`, Utils_ClientErrorCode.ClientErrorCode.PanelManager_AddToQueue_00);
            } else {
                if (funcList[0] !== func) {
                    throw Helpers_Misc.newError(`PanelManager.addToQueue() exception queueing 2!!`, Utils_ClientErrorCode.ClientErrorCode.PanelManager_AddToQueue_01);
                } else {
                    const result = await rawFunc();
                    if (funcList.shift() !== func) {
                        throw Helpers_Misc.newError(`PanelManager.addToQueue() exception queueing 3!!`, Utils_ClientErrorCode.ClientErrorCode.PanelManager_AddToQueue_02);
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
