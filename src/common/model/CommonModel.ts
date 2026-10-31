import {
    AuxiliaryTypes_CachedDataAccessor,
    Common_Model_CommonProxy,
    Egret_Egret,
    Helpers_ImageSource,
    Helpers_Misc,
    Helpers_Text,
    LocalData_Storage,
    Notifications_Dispatcher,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Graphics_Constants,
    type Units_Constants,
} from "../../internal.ts";
import type { S as CommonGetCoStatisticsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetCoStatistics/S.ts";
import type { DataForMrwPlayerRank } from "../../proto/schema/CommonProto/Structure/DataForMrwPlayerRank.ts";

type FrameCfg       = {
    source  : string | null;
    tick    : number | null;
};

const TILE_ANIMATION_INTERVAL_MS        = 200;
const UNIT_ANIMATION_INTERVAL_MS        = 120;
const STATE_INDICATOR_INTERVAL_MS       = 720;
const UNIT_FLASH_DIVIDER                = UNIT_ANIMATION_INTERVAL_MS * 4 * 3;   // 暂且写死待机状态4动画帧*3tick每帧，闪光只在第一帧短暂显示
const GRID_ANIMATION_INTERVAL_MS        = 100;

let _intervalIdForTileAnimation         : number | null;
let _tileAnimationTickCount             = 0;
let _isUnitAnimationTicking             = false;
let _isUnitFlashVisible                 = false;
let _unitAnimationTickCount             = 0;
let _stateIndicatorTickCount            = 0;
let _gridAnimationTickCount             = 0;
let _isTransparentTouchLayerTouched     = false;

const _unitAndTileTexturePrefixDict     = new Map<Graphics_Constants.TextureVersionId, string>();
const _unitAndTileTextureLongPrefixDict = new Map<Graphics_Constants.TextureVersionId, string>();
const _unitImageSourceDict              = new Map<Graphics_Constants.TextureVersionId, Map<boolean, Map<Units_Constants.AnimationTypeId, Map<number, Map<number, FrameCfg>>>>>();
const _unitFlashImageSourceDict         = new Map<Graphics_Constants.TextureVersionId, Map<number, Map<number, string>>>();
const _tileBaseImageSourceDict          = new Map<Graphics_Constants.TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileDecorationImageSourceDict    = new Map<Graphics_Constants.TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileObjectImageSourceDict        = new Map<Graphics_Constants.TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileBuffImageSourceDict          = new Map<Graphics_Constants.TextureVersionId, Map<number, Map<boolean, string>>>();

let _mrwRankArray           : DataForMrwPlayerRank[] | null = null;
const _coStatisticsAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, CommonGetCoStatisticsResponse>({
    reqData : () => Common_Model_CommonProxy.reqCommonGetCoStatistics(),
});

export function init(): void {
    if (LocalData_Storage.getShowTileAnimation()) {
        startTileAnimationTick();
    }
    if (LocalData_Storage.getShowUnitAnimation()) {
        startUnitAnimationTick();
    }

    Egret_Egret.setInterval(() => {
        ++_gridAnimationTickCount;
        Notifications_Dispatcher.dispatch("GridAnimationTick");
    }, null, GRID_ANIMATION_INTERVAL_MS);

    Egret_Egret.setInterval(() => {
        ++_stateIndicatorTickCount;
        Notifications_Dispatcher.dispatch("StateIndicatorTick");
    }, null, STATE_INDICATOR_INTERVAL_MS);

    updateOnUnitAndTileTextureVersionChanged();
}

export function startTileAnimationTick(): void {
    stopTileAnimationTick();

    _intervalIdForTileAnimation = Egret_Egret.setInterval(() => {
        ++_tileAnimationTickCount;
        tickTileImageSources();
        Notifications_Dispatcher.dispatch("TileAnimationTick");
    }, null, TILE_ANIMATION_INTERVAL_MS);
}
export function stopTileAnimationTick(): void {
    if (_intervalIdForTileAnimation != null) {
        Egret_Egret.clearInterval(_intervalIdForTileAnimation);
        _intervalIdForTileAnimation = null;
    }
}
export function checkIsTileAnimationTicking(): boolean {
    return _intervalIdForTileAnimation != null;
}
export function getTileAnimationTickCount(): number {
    return _tileAnimationTickCount;
}

export function startUnitAnimationTick(): void {
    stopUnitAnimationTick();

    setIsUnitAnimationTicking(true);
    Egret_Egret.startTick(onEgretTickForUnitAnimation, null);
}
export function stopUnitAnimationTick(): void {
    if (getIsUnitAnimationTicking()) {
        Egret_Egret.stopTick(onEgretTickForUnitAnimation, null);
        setIsUnitAnimationTicking(false);
    }
}
function onEgretTickForUnitAnimation(time: number): boolean {
    const newCount = Math.floor(time / UNIT_ANIMATION_INTERVAL_MS);
    if (_unitAnimationTickCount !== newCount) {
        _unitAnimationTickCount = newCount;
        tickUnitImageSources();
        Notifications_Dispatcher.dispatch("UnitAnimationTick");
    }

    setIsUnitFlashVisible((newCount % 4 === 0) && (time % UNIT_FLASH_DIVIDER <= 100));
    Notifications_Dispatcher.dispatch("UnitFlashTick");

    return false;
}
function setIsUnitAnimationTicking(isTicking: boolean): void {
    _isUnitAnimationTicking = isTicking;
}
export function getIsUnitAnimationTicking(): boolean {
    return _isUnitAnimationTicking;
}
export function getUnitAnimationTickCount(): number {
    return _unitAnimationTickCount;
}
export function getStateIndicatorTickCount(): number {
    return _stateIndicatorTickCount;
}
function setIsUnitFlashVisible(isVisible: boolean): void {
    _isUnitFlashVisible = isVisible;
}
export function getIsUnitFlashVisible(): boolean {
    return _isUnitFlashVisible;
}

export function getGridAnimationTickCount(): number {
    return _gridAnimationTickCount;
}

export function updateOnUnitAndTileTextureVersionChanged(): void {
    tickTileImageSources();
    tickUnitImageSources();
}

export function getUnitAndTileTexturePrefix(version: Graphics_Constants.TextureVersionId): string {
    const prefix = _unitAndTileTexturePrefixDict.get(version);
    if (prefix != null) {
        return prefix;
    } else {
        const text = `v${Helpers_Text.getNumText(version)}_`;
        _unitAndTileTexturePrefixDict.set(version, text);
        return text;
    }
}
export function getUnitAndTileTextureLongPrefix(version: Graphics_Constants.TextureVersionId): string {
    const prefix = _unitAndTileTextureLongPrefixDict.get(version);
    if (prefix != null) {
        return prefix;
    } else {
        const text = `ver${Helpers_Text.getNumText(version)}_`;
        _unitAndTileTextureLongPrefixDict.set(version, text);
        return text;
    }
}

export function tickTileImageSources(): void {
    _tileBaseImageSourceDict.clear();
    _tileDecorationImageSourceDict.clear();
    _tileObjectImageSourceDict.clear();
}

export function tickUnitImageSources(): void {
    _unitImageSourceDict.clear();
}

export function getCachedUnitImageSource({ version, skinId, unitType, isDark, animationType, tickCount }: {
    version         : Graphics_Constants.TextureVersionId;
    skinId          : number;
    unitType        : number;
    isDark          : boolean;
    animationType   : Units_Constants.AnimationTypeId;
    tickCount       : number;
}): string {
    if (!_unitImageSourceDict.has(version)) {
        _unitImageSourceDict.set(version, new Map());
    }

    const dict1 = Helpers_Misc.getExisted(_unitImageSourceDict.get(version));
    if (!dict1.has(isDark)) {
        dict1.set(isDark, new Map());
    }

    const dict2 = Helpers_Misc.getExisted(dict1.get(isDark));
    if (!dict2.has(animationType)) {
        dict2.set(animationType, new Map());
    }

    const dict3 = Helpers_Misc.getExisted(dict2.get(animationType));
    if (!dict3.has(skinId)) {
        dict3.set(skinId, new Map());
    }

    const dict4 = Helpers_Misc.getExisted(dict3.get(skinId));
    if (!dict4.has(unitType)) {
        dict4.set(unitType, { source : null, tick : null });
    }

    const cfg = Helpers_Misc.getExisted(dict4.get(unitType));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = Helpers_ImageSource.getUnit({
            version       : version,
            skinId        : skinId,
            unitTypeId    : unitType,
            isDark        : isDark,
            animationType : animationType,
            tickCount     : tickCount,
        });
    }

    return Helpers_Misc.getExisted(cfg.source);
}
export function getCachedUnitFlashImageSource({ version, skinId, unitType }: {
    version         : Graphics_Constants.TextureVersionId;
    skinId          : number;
    unitType        : number;
}): string {
    if (!_unitFlashImageSourceDict.has(version)) {
        _unitFlashImageSourceDict.set(version, new Map());
    }

    const dict1 = Helpers_Misc.getExisted(_unitFlashImageSourceDict.get(version));
    if (!dict1.has(skinId)) {
        dict1.set(skinId, new Map());
    }

    const dict2 = Helpers_Misc.getExisted(dict1.get(skinId));
    if (!dict2.has(unitType)) {
        dict2.set(unitType, Helpers_ImageSource.getUnitFlash({ version, skinId, unitType }));
    }

    return Helpers_Misc.getExisted(dict2.get(unitType));
}

export function getCachedTileBaseImageSource({ version, themeType, skinId, baseType, isDark, shapeId, tickCount } : {
    version     : Graphics_Constants.TextureVersionId;
    themeType   : number;
    skinId      : number;
    baseType    : number;
    isDark      : boolean;
    shapeId     : number;
    tickCount   : number;
}): string {
    if (!_tileBaseImageSourceDict.has(version)) {
        _tileBaseImageSourceDict.set(version, new Map());
    }

    const dict1 = Helpers_Misc.getExisted(_tileBaseImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = Helpers_Misc.getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = Helpers_Misc.getExisted(dict2.get(skinId));
    if (!dict3.has(baseType)) {
        dict3.set(baseType, new Map());
    }

    const dict4 = Helpers_Misc.getExisted(dict3.get(baseType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = Helpers_Misc.getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = Helpers_Misc.getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source : null, tick : null });
    }

    const cfg = Helpers_Misc.getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = Helpers_ImageSource.getTileBase({
            version, themeType, skinId, baseType, isDark, shapeId, tickCount,
        });
    }

    return Helpers_Misc.getExisted(cfg.source);
}

export function getCachedTileDecorationImageSource({ version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount }: {
    version             : Graphics_Constants.TextureVersionId;
    themeType           : number;
    skinId              : number;
    tileDecorationType  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    isDark              : boolean;
    shapeId             : number;
    tickCount           : number;
}): string {
    if (tileDecorationType == null) {
        return ``;
    }

    if (!_tileDecorationImageSourceDict.has(version)) {
        _tileDecorationImageSourceDict.set(version, new Map());
    }

    const dict1 = Helpers_Misc.getExisted(_tileDecorationImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = Helpers_Misc.getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = Helpers_Misc.getExisted(dict2.get(skinId));
    if (!dict3.has(tileDecorationType)) {
        dict3.set(tileDecorationType, new Map());
    }

    const dict4 = Helpers_Misc.getExisted(dict3.get(tileDecorationType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = Helpers_Misc.getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = Helpers_Misc.getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source : null, tick : null });
    }

    const cfg = Helpers_Misc.getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = Helpers_ImageSource.getTileDecoration({
            version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount,
        });
    }

    return Helpers_Misc.getExisted(cfg.source);
}

export function getCachedTileObjectImageSource({ version, themeType, skinId, objectType, isDark, shapeId, tickCount }: {
    version     : Graphics_Constants.TextureVersionId;
    themeType   : number;
    skinId      : number;
    objectType  : number;
    isDark      : boolean;
    shapeId     : number;
    tickCount   : number;
}): string {
    if (!_tileObjectImageSourceDict.has(version)) {
        _tileObjectImageSourceDict.set(version, new Map());
    }

    const dict1 = Helpers_Misc.getExisted(_tileObjectImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = Helpers_Misc.getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = Helpers_Misc.getExisted(dict2.get(skinId));
    if (!dict3.has(objectType)) {
        dict3.set(objectType, new Map());
    }

    const dict4 = Helpers_Misc.getExisted(dict3.get(objectType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = Helpers_Misc.getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = Helpers_Misc.getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source : null, tick : null });
    }

    const cfg = Helpers_Misc.getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = Helpers_ImageSource.getTileObject({
            version, themeType, skinId, objectType, isDark, shapeId, tickCount,
        });
    }

    return Helpers_Misc.getExisted(cfg.source);
}
export function getCachedTileBuffImageSource({ version, buffType, isDark }: {
    version     : Graphics_Constants.TextureVersionId;
    buffType    : number;
    isDark      : boolean;
}): string {
    if (!_tileBuffImageSourceDict.has(version)) {
        _tileBuffImageSourceDict.set(version, new Map());
    }

    const dict1 = Helpers_Misc.getExisted(_tileBuffImageSourceDict.get(version));
    if (!dict1.has(buffType)) {
        dict1.set(buffType, new Map());
    }

    const dict2 = Helpers_Misc.getExisted(dict1.get(buffType));
    if (!dict2.has(isDark)) {
        dict2.set(isDark, Helpers_ImageSource.getTileBuff({ version, buffType, isDark }));
    }

    return Helpers_Misc.getExisted(dict2.get(isDark));
}

export function setMrwRankArray(rankList: DataForMrwPlayerRank[]): void {
    _mrwRankArray = rankList;
}
export function getMrwRankList(): DataForMrwPlayerRank[] | null {
    return _mrwRankArray;
}

export function getCoStatistics(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<CommonGetCoStatisticsResponse>> {
    return _coStatisticsAccessor.getData(null);
}
export function setCoStatistics(data: CommonGetCoStatisticsResponse): void {
    _coStatisticsAccessor.setData(null, data);
}

export function getIsTransparentTouchLayerTouched(): boolean {
    return _isTransparentTouchLayerTouched;
}
export function setIsTransparentTouchLayerTouched(isTouched: boolean): void {
    _isTransparentTouchLayerTouched = isTouched;
}
