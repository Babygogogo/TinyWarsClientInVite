import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { reqCommonGetCoStatistics } from "./CommonProxy.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import type { TextureVersionId } from "../../graphics/Constants.ts";
import { getUnit, getUnitFlash, getTileBase, getTileDecoration, getTileObject, getTileBuff } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getNumText } from "../../helpers/Text.ts";
import { getShowTileAnimation, getShowUnitAnimation } from "../../localData/Storage.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetCoStatistics/S.ts";
import type { DataForMrwPlayerRank } from "../../proto/schema/CommonProto/Structure/DataForMrwPlayerRank.ts";
import type { AnimationTypeId } from "../../units/Constants.ts";
import { setInterval, clearInterval, startTick, stopTick } from "../../vendor/egret/Egret.ts";

type CoStatistics           = S;

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

const _unitAndTileTexturePrefixDict     = new Map<TextureVersionId, string>();
const _unitAndTileTextureLongPrefixDict = new Map<TextureVersionId, string>();
const _unitImageSourceDict              = new Map<TextureVersionId, Map<boolean, Map<AnimationTypeId, Map<number, Map<number, FrameCfg>>>>>();
const _unitFlashImageSourceDict         = new Map<TextureVersionId, Map<number, Map<number, string>>>();
const _tileBaseImageSourceDict          = new Map<TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileDecorationImageSourceDict    = new Map<TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileObjectImageSourceDict        = new Map<TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileBuffImageSourceDict          = new Map<TextureVersionId, Map<number, Map<boolean, string>>>();

let _mrwRankArray           : DataForMrwPlayerRank[] | null = null;
const _coStatisticsAccessor = new CachedDataAccessor<null, CoStatistics>({
    reqData : () => reqCommonGetCoStatistics(),
});

export function init(): void {
    if (getShowTileAnimation()) {
        startTileAnimationTick();
    }
    if (getShowUnitAnimation()) {
        startUnitAnimationTick();
    }

    setInterval(() => {
        ++_gridAnimationTickCount;
        dispatch(TypeId.GridAnimationTick);
    }, null, GRID_ANIMATION_INTERVAL_MS);

    setInterval(() => {
        ++_stateIndicatorTickCount;
        dispatch(TypeId.StateIndicatorTick);
    }, null, STATE_INDICATOR_INTERVAL_MS);

    updateOnUnitAndTileTextureVersionChanged();
}

export function startTileAnimationTick(): void {
    stopTileAnimationTick();

    _intervalIdForTileAnimation = setInterval(() => {
        ++_tileAnimationTickCount;
        tickTileImageSources();
        dispatch(TypeId.TileAnimationTick);
    }, null, TILE_ANIMATION_INTERVAL_MS);
}
export function stopTileAnimationTick(): void {
    if (_intervalIdForTileAnimation != null) {
        clearInterval(_intervalIdForTileAnimation);
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
    startTick(onEgretTickForUnitAnimation, null);
}
export function stopUnitAnimationTick(): void {
    if (getIsUnitAnimationTicking()) {
        stopTick(onEgretTickForUnitAnimation, null);
        setIsUnitAnimationTicking(false);
    }
}
function onEgretTickForUnitAnimation(time: number): boolean {
    const newCount = Math.floor(time / UNIT_ANIMATION_INTERVAL_MS);
    if (_unitAnimationTickCount !== newCount) {
        _unitAnimationTickCount = newCount;
        tickUnitImageSources();
        dispatch(TypeId.UnitAnimationTick);
    }

    setIsUnitFlashVisible((newCount % 4 === 0) && (time % UNIT_FLASH_DIVIDER <= 100));
    dispatch(TypeId.UnitFlashTick);

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

export function getUnitAndTileTexturePrefix(version: TextureVersionId): string {
    const prefix = _unitAndTileTexturePrefixDict.get(version);
    if (prefix != null) {
        return prefix;
    } else {
        const text = `v${getNumText(version)}_`;
        _unitAndTileTexturePrefixDict.set(version, text);
        return text;
    }
}
export function getUnitAndTileTextureLongPrefix(version: TextureVersionId): string {
    const prefix = _unitAndTileTextureLongPrefixDict.get(version);
    if (prefix != null) {
        return prefix;
    } else {
        const text = `ver${getNumText(version)}_`;
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

export function getCachedUnitImageSource({ gcData, version, skinId, unitType, isDark, animationType, tickCount }: {
    gcData          : GameConfig;
    version         : TextureVersionId;
    skinId          : number;
    unitType        : number;
    isDark          : boolean;
    animationType   : AnimationTypeId;
    tickCount       : number;
}): string {
    if (!_unitImageSourceDict.has(version)) {
        _unitImageSourceDict.set(version, new Map());
    }

    const dict1 = getExisted(_unitImageSourceDict.get(version));
    if (!dict1.has(isDark)) {
        dict1.set(isDark, new Map());
    }

    const dict2 = getExisted(dict1.get(isDark));
    if (!dict2.has(animationType)) {
        dict2.set(animationType, new Map());
    }

    const dict3 = getExisted(dict2.get(animationType));
    if (!dict3.has(skinId)) {
        dict3.set(skinId, new Map());
    }

    const dict4 = getExisted(dict3.get(skinId));
    if (!dict4.has(unitType)) {
        dict4.set(unitType, { source: null, tick: null });
    }

    const cfg = getExisted(dict4.get(unitType));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = getUnit({ gcData, version, skinId, unitType, isDark, animationType, tickCount });
    }

    return getExisted(cfg.source);
}
export function getCachedUnitFlashImageSource({ version, skinId, unitType }: {
    version         : TextureVersionId;
    skinId          : number;
    unitType        : number;
}): string {
    if (!_unitFlashImageSourceDict.has(version)) {
        _unitFlashImageSourceDict.set(version, new Map());
    }

    const dict1 = getExisted(_unitFlashImageSourceDict.get(version));
    if (!dict1.has(skinId)) {
        dict1.set(skinId, new Map());
    }

    const dict2 = getExisted(dict1.get(skinId));
    if (!dict2.has(unitType)) {
        dict2.set(unitType, getUnitFlash({ version, skinId, unitType }));
    }

    return getExisted(dict2.get(unitType));
}

export function getCachedTileBaseImageSource({ version, themeType, skinId, baseType, isDark, shapeId, tickCount } : {
    version     : TextureVersionId;
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

    const dict1 = getExisted(_tileBaseImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = getExisted(dict2.get(skinId));
    if (!dict3.has(baseType)) {
        dict3.set(baseType, new Map());
    }

    const dict4 = getExisted(dict3.get(baseType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source: null, tick: null });
    }

    const cfg = getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = getTileBase({ version, themeType, skinId, baseType, isDark, shapeId, tickCount });
    }

    return getExisted(cfg.source);
}

export function getCachedTileDecorationImageSource({ version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount }: {
    version             : TextureVersionId;
    themeType           : number;
    skinId              : number;
    tileDecorationType  : Undefinable<number>;
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

    const dict1 = getExisted(_tileDecorationImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = getExisted(dict2.get(skinId));
    if (!dict3.has(tileDecorationType)) {
        dict3.set(tileDecorationType, new Map());
    }

    const dict4 = getExisted(dict3.get(tileDecorationType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source: null, tick: null });
    }

    const cfg = getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = getTileDecoration({ version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount });
    }

    return getExisted(cfg.source);
}

export function getCachedTileObjectImageSource({ version, themeType, skinId, objectType, isDark, shapeId, tickCount }: {
    version     : TextureVersionId;
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

    const dict1 = getExisted(_tileObjectImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = getExisted(dict2.get(skinId));
    if (!dict3.has(objectType)) {
        dict3.set(objectType, new Map());
    }

    const dict4 = getExisted(dict3.get(objectType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source: null, tick: null });
    }

    const cfg = getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = getTileObject({ version, themeType, skinId, objectType, isDark, shapeId, tickCount });
    }

    return getExisted(cfg.source);
}
export function getCachedTileBuffImageSource({ version, buffType, isDark }: {
    version     : TextureVersionId;
    buffType    : number;
    isDark      : boolean;
}): string {
    if (!_tileBuffImageSourceDict.has(version)) {
        _tileBuffImageSourceDict.set(version, new Map());
    }

    const dict1 = getExisted(_tileBuffImageSourceDict.get(version));
    if (!dict1.has(buffType)) {
        dict1.set(buffType, new Map());
    }

    const dict2 = getExisted(dict1.get(buffType));
    if (!dict2.has(isDark)) {
        dict2.set(isDark, getTileBuff({ version, buffType, isDark }));
    }

    return getExisted(dict2.get(isDark));
}

export function setMrwRankArray(rankList: DataForMrwPlayerRank[]): void {
    _mrwRankArray = rankList;
}
export function getMrwRankList(): DataForMrwPlayerRank[] | null {
    return _mrwRankArray;
}

export function getCoStatistics(): Promise<Undefinable<CoStatistics>> {
    return _coStatisticsAccessor.getData(null);
}
export function setCoStatistics(data: CoStatistics): void {
    _coStatisticsAccessor.setData(null, data);
}

export function getIsTransparentTouchLayerTouched(): boolean {
    return _isTransparentTouchLayerTouched;
}
export function setIsTransparentTouchLayerTouched(isTouched: boolean): void {
    _isTransparentTouchLayerTouched = isTouched;
}
