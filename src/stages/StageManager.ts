import { DisplayLayerId } from "../graphics/Constants.ts";
import { getWebPlayer } from "../helpers/Compatibility.ts";
import {
    getExisted,
    newError,
} from "../helpers/Misc.ts";
import { enable } from "../helpers/PointerInput.ts";
import {
    Dimension,
    Scale,
} from "./Constants.ts";
import type { IUiLayer } from "../ui/interfaces/IUiLayer.ts";
import { getUiLayerClass } from "../ui/utils/UiFactory.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import {
    Stage,
    startTick,
    Capabilities,
    OrientationMode,
    Event,
    updateAllScreens,
    DisplayObject,
} from "../vendor/egret/Egret.ts";
import {
    ScreenAdapterHelper,
    type IScreenAdapter,
    type StageSize,
} from "../vendor/egret/Sys.ts";

// The game is in landscape mode, which means that its design max height equals its design width, 960.
const RATIO_FOR_MIN_HEIGHT = Dimension.DesignWidth / Dimension.DesignMinHeight;

const _canvasBoundsInfo = {
    isUpdated   : false,
    rect        : new DOMRect(),
};

let   _stage        : Stage;
let   _stageScale   = Scale.MinScale;
const _LAYERS       = new Map<DisplayLayerId, IUiLayer>();

export function init(stg: Stage): void {
    _stage = stg;

    startTick(() => _canvasBoundsInfo.isUpdated = false, undefined);

    enable();

    if (!Capabilities.isMobile) {
        stg.orientation = OrientationMode.AUTO;
    }
    ScreenAdapterHelper.screenAdapter = new ScreenAdapter();
    _stage.setContentSize(_stage.stageWidth, _stage.stageHeight);
    _stage.addEventListener(Event.RESIZE, _onStageResize, undefined);

    _addLayer(DisplayLayerId.Bottom);
    _addLayer(DisplayLayerId.Scene);
    _addLayer(DisplayLayerId.Hud0);
    _addLayer(DisplayLayerId.Hud1);
    _addLayer(DisplayLayerId.Hud2);
    _addLayer(DisplayLayerId.Hud3);
    _addLayer(DisplayLayerId.Notify0);
    _addLayer(DisplayLayerId.Notify1);
    _addLayer(DisplayLayerId.FloatText);
    _addLayer(DisplayLayerId.Top);
}

export function getStage(): Stage {
    return _stage;
}

export function getCanvasBoundingClientRect(): DOMRect {
    if (!_canvasBoundsInfo.isUpdated) {
        _canvasBoundsInfo.isUpdated = true;
        _canvasBoundsInfo.rect      = getExisted(getWebPlayer()?.canvas.getBoundingClientRect());
    }
    return _canvasBoundsInfo.rect;
}

export function getLayer(layer: DisplayLayerId): IUiLayer {
    return getExisted(_LAYERS.get(layer));
}

export function setStageScale(scale: number): void {
    const s = Math.min(Math.max(Scale.MinScale, scale), Scale.MaxScale);
    if (getStageScale() !== s) {
        _stageScale = s;

        updateAllScreens();
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

function _addLayer(layerType: DisplayLayerId): void {
    if (_LAYERS.has(layerType)) {
        throw newError(`StageManager._addLayer() duplicated layer: ${layerType}.`, ClientErrorCode.StageManager_AddLayer_00);
    }

    const stage     = getStage();
    const width     = stage.stageWidth;
    const height    = stage.stageHeight;
    const layer     = new (getUiLayerClass())();
    layer.resize(width, height);
    _LAYERS.set(layerType, layer);
    getStage().addChild(layer as unknown as DisplayObject);
}

class ScreenAdapter implements IScreenAdapter {
    public calculateStageSize(_scaleMode: string, screenWidth: number, screenHeight: number): StageSize {
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
                stageWidth      : reviseStageDisplaySize(Dimension.DesignMinHeight * screenWidth / screenHeight * scaler),
                stageHeight     : reviseStageDisplaySize(Dimension.DesignMinHeight * scaler),
                displayWidth    : reviseStageDisplaySize(screenWidth),
                displayHeight   : reviseStageDisplaySize(screenHeight),
            };
        } else {
            // 屏幕高度充足
            return {
                stageWidth      : reviseStageDisplaySize(Dimension.DesignWidth * scaler),
                stageHeight     : reviseStageDisplaySize(Dimension.DesignWidth * screenHeight / screenWidth * scaler),
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
