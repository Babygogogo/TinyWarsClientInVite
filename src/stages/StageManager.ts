import * as GraphicsConstants from "../graphics/Constants.ts";
import * as HelpersCompatibility from "../helpers/Compatibility.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as HelpersPointerInput from "../helpers/PointerInput.ts";
import * as StagesConstants from "./Constants.ts";
import type * as UiInterfacesIUiLayer from "../ui/interfaces/IUiLayer.ts";
import * as UiUtilsUiFactory from "../ui/utils/UiFactory.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as VendorEgretEgret from "../vendor/egret/Egret.ts";
import * as VendorEgretSys from "../vendor/egret/Sys.ts";

type IUiLayer       = UiInterfacesIUiLayer.IUiLayer;

// The game is in landscape mode, which means that its design max height equals its design width, 960.
const RATIO_FOR_MIN_HEIGHT = StagesConstants.Dimension.DesignWidth / StagesConstants.Dimension.DesignMinHeight;

const _canvasBoundsInfo = {
    isUpdated   : false,
    rect        : new DOMRect(),
};

let   _stage        : VendorEgretEgret.Stage;
let   _stageScale   = StagesConstants.Scale.MinScale;
const _LAYERS       = new Map<GraphicsConstants.DisplayLayerId, IUiLayer>();

export function init(stg: VendorEgretEgret.Stage): void {
    _stage = stg;

    VendorEgretEgret.startTick(() => _canvasBoundsInfo.isUpdated = false, undefined);

    HelpersPointerInput.enable();

    if (!VendorEgretEgret.Capabilities.isMobile) {
        stg.orientation = VendorEgretEgret.OrientationMode.AUTO;
    }
    VendorEgretSys.ScreenAdapterHelper.screenAdapter = new ScreenAdapter();
    _stage.setContentSize(_stage.stageWidth, _stage.stageHeight);
    _stage.addEventListener(VendorEgretEgret.Event.RESIZE, _onStageResize, undefined);

    _addLayer(GraphicsConstants.DisplayLayerId.Bottom);
    _addLayer(GraphicsConstants.DisplayLayerId.Scene);
    _addLayer(GraphicsConstants.DisplayLayerId.Hud0);
    _addLayer(GraphicsConstants.DisplayLayerId.Hud1);
    _addLayer(GraphicsConstants.DisplayLayerId.Hud2);
    _addLayer(GraphicsConstants.DisplayLayerId.Hud3);
    _addLayer(GraphicsConstants.DisplayLayerId.Notify0);
    _addLayer(GraphicsConstants.DisplayLayerId.Notify1);
    _addLayer(GraphicsConstants.DisplayLayerId.FloatText);
    _addLayer(GraphicsConstants.DisplayLayerId.Top);
}

export function getStage(): VendorEgretEgret.Stage {
    return _stage;
}

export function getCanvasBoundingClientRect(): DOMRect {
    if (!_canvasBoundsInfo.isUpdated) {
        _canvasBoundsInfo.isUpdated = true;
        _canvasBoundsInfo.rect      = HelpersMisc.getExisted(HelpersCompatibility.getWebPlayer()?.canvas.getBoundingClientRect());
    }
    return _canvasBoundsInfo.rect;
}

export function getLayer(layer: GraphicsConstants.DisplayLayerId): IUiLayer {
    return HelpersMisc.getExisted(_LAYERS.get(layer));
}

export function setStageScale(scale: number): void {
    const s = Math.min(Math.max(StagesConstants.Scale.MinScale, scale), StagesConstants.Scale.MaxScale);
    if (getStageScale() !== s) {
        _stageScale = s;

        VendorEgretEgret.updateAllScreens();
    }
}
export function getStageScale(): number {
    return _stageScale;
}

function _onStageResize(): void {
    const stage     = getStage();
    const width     = stage.stageWidth;
    const height    = stage.stageHeight;
    for (const [, layer] of _LAYERS) {
        layer.resize(width, height);
    }
}

function _addLayer(layerType: GraphicsConstants.DisplayLayerId): void {
    if (_LAYERS.has(layerType)) {
        throw HelpersMisc.newError(`StageManager._addLayer() duplicated layer: ${layerType}.`, UtilsClientErrorCode.ClientErrorCode.StageManager_AddLayer_00);
    }

    const stage     = getStage();
    const width     = stage.stageWidth;
    const height    = stage.stageHeight;
    const layer     = new (UiUtilsUiFactory.getUiLayerClass())();
    layer.resize(width, height);
    _LAYERS.set(layerType, layer);
    getStage().addChild(layer as unknown as VendorEgretEgret.DisplayObject);
}

class ScreenAdapter implements VendorEgretSys.IScreenAdapter {
    public calculateStageSize(_scaleMode: string, screenWidth: number, screenHeight: number): VendorEgretSys.StageSize {
        // const currRatio = screenWidth / screenHeight;
        // if (currRatio > RATIO_FOR_MIN_HEIGHT) {
        //     return {
        //         stageWidth   : DESIGN_WIDTH,
        //         stageHeight  : DESIGN_MIN_HEIGHT,
        //         displayWidth : screenHeight * RATIO_FOR_MIN_HEIGHT,
        //         displayHeight: screenHeight,
        //     };
        // } else {
        //     return {
        //         stageWidth   : DESIGN_WIDTH,
        //         stageHeight  : screenHeight / screenWidth * DESIGN_WIDTH,
        //         displayWidth : screenWidth,
        //         displayHeight: screenHeight,
        //     };
        // }

        const scaler = getStageScale() / 100;
        if (screenWidth / screenHeight > RATIO_FOR_MIN_HEIGHT) {
            // 屏幕高度不足
            return {
                stageWidth      : reviseStageDisplaySize(StagesConstants.Dimension.DesignMinHeight * screenWidth / screenHeight * scaler),
                stageHeight     : reviseStageDisplaySize(StagesConstants.Dimension.DesignMinHeight * scaler),
                displayWidth    : reviseStageDisplaySize(screenWidth),
                displayHeight   : reviseStageDisplaySize(screenHeight),
            };
        } else {
            // 屏幕高度充足
            return {
                stageWidth      : reviseStageDisplaySize(StagesConstants.Dimension.DesignWidth * scaler),
                stageHeight     : reviseStageDisplaySize(StagesConstants.Dimension.DesignWidth * screenHeight / screenWidth * scaler),
                displayWidth    : reviseStageDisplaySize(screenWidth),
                displayHeight   : reviseStageDisplaySize(screenHeight),
            };
        }
    }
}

function reviseStageDisplaySize(num: number): number {
    // 宽高不是2的整数倍会导致图片绘制出现问题
    num = Math.floor(num);
    return (num % 2 === 0) ? num : num + 1;
}
