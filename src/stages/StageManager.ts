import {
    Stages_Constants,
    Graphics_Constants,
    Helpers_PointerInput,
    Helpers_Misc,
    Helpers_Compatibility,
    Ui_Components_UiLayer,
    type Ui_Interfaces_IUiLayer,
    Egret_Egret,
    Utils_ClientErrorCode,
    Egret_Sys,
} from "../internal.ts";

// The game is in landscape mode, which means that its design max height equals its design width, 960.
const RATIO_FOR_MIN_HEIGHT = Stages_Constants.Dimension.DesignWidth / Stages_Constants.Dimension.DesignMinHeight;

const _canvasBoundsInfo = {
    isUpdated   : false,
    rect        : new DOMRect(),
};

let   _stage        : Egret_Egret.Stage;
let   _stageScale   = Stages_Constants.Scale.MinScale;
const _LAYERS       = new Map<Graphics_Constants.DisplayLayerId, Ui_Interfaces_IUiLayer.IUiLayer>();

export function init(stg: Egret_Egret.Stage): void {
    _stage = stg;

    Egret_Egret.startTick(() => _canvasBoundsInfo.isUpdated = false, undefined);

    Helpers_PointerInput.enable();

    if (!Egret_Egret.Capabilities.isMobile) {
        stg.orientation = Egret_Egret.OrientationMode.AUTO;
    }
    Egret_Sys.ScreenAdapterHelper.screenAdapter = new ScreenAdapter();
    _stage.setContentSize(_stage.stageWidth, _stage.stageHeight);
    _stage.addEventListener(Egret_Egret.Event.RESIZE, _onStageResize, undefined);

    _addLayer(Graphics_Constants.DisplayLayerId.Bottom);
    _addLayer(Graphics_Constants.DisplayLayerId.Scene);
    _addLayer(Graphics_Constants.DisplayLayerId.Hud0);
    _addLayer(Graphics_Constants.DisplayLayerId.Hud1);
    _addLayer(Graphics_Constants.DisplayLayerId.Hud2);
    _addLayer(Graphics_Constants.DisplayLayerId.Hud3);
    _addLayer(Graphics_Constants.DisplayLayerId.Notify0);
    _addLayer(Graphics_Constants.DisplayLayerId.Notify1);
    _addLayer(Graphics_Constants.DisplayLayerId.FloatText);
    _addLayer(Graphics_Constants.DisplayLayerId.Top);
}

export function getStage(): Egret_Egret.Stage {
    return _stage;
}

export function getCanvasBoundingClientRect(): DOMRect {
    if (!_canvasBoundsInfo.isUpdated) {
        _canvasBoundsInfo.isUpdated = true;
        _canvasBoundsInfo.rect      = Helpers_Misc.getExisted(Helpers_Compatibility.getWebPlayer()?.canvas.getBoundingClientRect());
    }
    return _canvasBoundsInfo.rect;
}

export function getLayer(layer: Graphics_Constants.DisplayLayerId): Ui_Interfaces_IUiLayer.IUiLayer {
    return Helpers_Misc.getExisted(_LAYERS.get(layer));
}

export function setStageScale(scale: number): void {
    const s = Math.min(Math.max(Stages_Constants.Scale.MinScale, scale), Stages_Constants.Scale.MaxScale);
    if (getStageScale() !== s) {
        _stageScale = s;

        Egret_Egret.updateAllScreens();
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

function _addLayer(layerType: Graphics_Constants.DisplayLayerId): void {
    if (_LAYERS.has(layerType)) {
        throw Helpers_Misc.newError(`StageManager._addLayer() duplicated layer: ${layerType}.`, Utils_ClientErrorCode.ClientErrorCode.StageManager_AddLayer_00);
    }

    const stage     = getStage();
    const width     = stage.stageWidth;
    const height    = stage.stageHeight;
    const layer     = new Ui_Components_UiLayer.UiLayer();
    layer.resize(width, height);
    _LAYERS.set(layerType, layer);
    getStage().addChild(layer as unknown as Egret_Egret.DisplayObject);
}

class ScreenAdapter implements Egret_Sys.IScreenAdapter {
    public calculateStageSize(_scaleMode: string, screenWidth: number, screenHeight: number): Egret_Sys.StageSize {
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
                stageWidth      : reviseStageDisplaySize(Stages_Constants.Dimension.DesignMinHeight * screenWidth / screenHeight * scaler),
                stageHeight     : reviseStageDisplaySize(Stages_Constants.Dimension.DesignMinHeight * scaler),
                displayWidth    : reviseStageDisplaySize(screenWidth),
                displayHeight   : reviseStageDisplaySize(screenHeight),
            };
        } else {
            // 屏幕高度充足
            return {
                stageWidth      : reviseStageDisplaySize(Stages_Constants.Dimension.DesignWidth * scaler),
                stageHeight     : reviseStageDisplaySize(Stages_Constants.Dimension.DesignWidth * screenHeight / screenWidth * scaler),
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
