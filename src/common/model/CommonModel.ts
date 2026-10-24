import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as CommonModelCommonProxy from "./CommonProxy.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonGetCoStatisticsS from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetCoStatistics/S.ts";
import type * as ProtoSchemaCommonProtoStructureDataForMrwPlayerRank from "../../proto/schema/CommonProto/Structure/DataForMrwPlayerRank.ts";
import type * as UnitsConstants from "../../units/Constants.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type CoStatistics           = ProtoSchemaCommonProtoNetMessageMsgCommonGetCoStatisticsS.S;

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

const _unitAndTileTexturePrefixDict     = new Map<GraphicsConstants.TextureVersionId, string>();
const _unitAndTileTextureLongPrefixDict = new Map<GraphicsConstants.TextureVersionId, string>();
const _unitImageSourceDict              = new Map<GraphicsConstants.TextureVersionId, Map<boolean, Map<UnitsConstants.AnimationTypeId, Map<number, Map<number, FrameCfg>>>>>();
const _unitFlashImageSourceDict         = new Map<GraphicsConstants.TextureVersionId, Map<number, Map<number, string>>>();
const _tileBaseImageSourceDict          = new Map<GraphicsConstants.TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileDecorationImageSourceDict    = new Map<GraphicsConstants.TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileObjectImageSourceDict        = new Map<GraphicsConstants.TextureVersionId, Map<number, Map<number, Map<number, Map<boolean, Map<number, Map<number, FrameCfg>>>>>>>();
const _tileBuffImageSourceDict          = new Map<GraphicsConstants.TextureVersionId, Map<number, Map<boolean, string>>>();

let _mrwRankArray           : ProtoSchemaCommonProtoStructureDataForMrwPlayerRank.DataForMrwPlayerRank[] | null = null;
const _coStatisticsAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, CoStatistics>({
    reqData : () => CommonModelCommonProxy.reqCommonGetCoStatistics(),
});

export function init(): void {
    if (LocalDataStorage2.getShowTileAnimation()) {
        startTileAnimationTick();
    }
    if (LocalDataStorage2.getShowUnitAnimation()) {
        startUnitAnimationTick();
    }

    VendorEgretEgret.setInterval(() => {
        ++_gridAnimationTickCount;
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridAnimationTick);
    }, null, GRID_ANIMATION_INTERVAL_MS);

    VendorEgretEgret.setInterval(() => {
        ++_stateIndicatorTickCount;
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.StateIndicatorTick);
    }, null, STATE_INDICATOR_INTERVAL_MS);

    updateOnUnitAndTileTextureVersionChanged();
}

export function startTileAnimationTick(): void {
    stopTileAnimationTick();

    _intervalIdForTileAnimation = VendorEgretEgret.setInterval(() => {
        ++_tileAnimationTickCount;
        tickTileImageSources();
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.TileAnimationTick);
    }, null, TILE_ANIMATION_INTERVAL_MS);
}
export function stopTileAnimationTick(): void {
    if (_intervalIdForTileAnimation != null) {
        VendorEgretEgret.clearInterval(_intervalIdForTileAnimation);
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
    VendorEgretEgret.startTick(onEgretTickForUnitAnimation, null);
}
export function stopUnitAnimationTick(): void {
    if (getIsUnitAnimationTicking()) {
        VendorEgretEgret.stopTick(onEgretTickForUnitAnimation, null);
        setIsUnitAnimationTicking(false);
    }
}
function onEgretTickForUnitAnimation(time: number): boolean {
    const newCount = Math.floor(time / UNIT_ANIMATION_INTERVAL_MS);
    if (_unitAnimationTickCount !== newCount) {
        _unitAnimationTickCount = newCount;
        tickUnitImageSources();
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UnitAnimationTick);
    }

    setIsUnitFlashVisible((newCount % 4 === 0) && (time % UNIT_FLASH_DIVIDER <= 100));
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.UnitFlashTick);

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

export function getUnitAndTileTexturePrefix(version: GraphicsConstants.TextureVersionId): string {
    const prefix = _unitAndTileTexturePrefixDict.get(version);
    if (prefix != null) {
        return prefix;
    } else {
        const text = `v${HelpersText.getNumText(version)}_`;
        _unitAndTileTexturePrefixDict.set(version, text);
        return text;
    }
}
export function getUnitAndTileTextureLongPrefix(version: GraphicsConstants.TextureVersionId): string {
    const prefix = _unitAndTileTextureLongPrefixDict.get(version);
    if (prefix != null) {
        return prefix;
    } else {
        const text = `ver${HelpersText.getNumText(version)}_`;
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
    gcData          : GameConfigGcData.GcData;
    version         : GraphicsConstants.TextureVersionId;
    skinId          : number;
    unitType        : number;
    isDark          : boolean;
    animationType   : UnitsConstants.AnimationTypeId;
    tickCount       : number;
}): string {
    if (!_unitImageSourceDict.has(version)) {
        _unitImageSourceDict.set(version, new Map());
    }

    const dict1 = HelpersMisc.getExisted(_unitImageSourceDict.get(version));
    if (!dict1.has(isDark)) {
        dict1.set(isDark, new Map());
    }

    const dict2 = HelpersMisc.getExisted(dict1.get(isDark));
    if (!dict2.has(animationType)) {
        dict2.set(animationType, new Map());
    }

    const dict3 = HelpersMisc.getExisted(dict2.get(animationType));
    if (!dict3.has(skinId)) {
        dict3.set(skinId, new Map());
    }

    const dict4 = HelpersMisc.getExisted(dict3.get(skinId));
    if (!dict4.has(unitType)) {
        dict4.set(unitType, { source: null, tick: null });
    }

    const cfg = HelpersMisc.getExisted(dict4.get(unitType));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = HelpersImageSource.getUnit({ gcData, version, skinId, unitType, isDark, animationType, tickCount });
    }

    return HelpersMisc.getExisted(cfg.source);
}
export function getCachedUnitFlashImageSource({ version, skinId, unitType }: {
    version         : GraphicsConstants.TextureVersionId;
    skinId          : number;
    unitType        : number;
}): string {
    if (!_unitFlashImageSourceDict.has(version)) {
        _unitFlashImageSourceDict.set(version, new Map());
    }

    const dict1 = HelpersMisc.getExisted(_unitFlashImageSourceDict.get(version));
    if (!dict1.has(skinId)) {
        dict1.set(skinId, new Map());
    }

    const dict2 = HelpersMisc.getExisted(dict1.get(skinId));
    if (!dict2.has(unitType)) {
        dict2.set(unitType, HelpersImageSource.getUnitFlash({ version, skinId, unitType }));
    }

    return HelpersMisc.getExisted(dict2.get(unitType));
}

export function getCachedTileBaseImageSource({ version, themeType, skinId, baseType, isDark, shapeId, tickCount } : {
    version     : GraphicsConstants.TextureVersionId;
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

    const dict1 = HelpersMisc.getExisted(_tileBaseImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = HelpersMisc.getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = HelpersMisc.getExisted(dict2.get(skinId));
    if (!dict3.has(baseType)) {
        dict3.set(baseType, new Map());
    }

    const dict4 = HelpersMisc.getExisted(dict3.get(baseType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = HelpersMisc.getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = HelpersMisc.getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source: null, tick: null });
    }

    const cfg = HelpersMisc.getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = HelpersImageSource.getTileBase({ version, themeType, skinId, baseType, isDark, shapeId, tickCount });
    }

    return HelpersMisc.getExisted(cfg.source);
}

export function getCachedTileDecorationImageSource({ version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount }: {
    version             : GraphicsConstants.TextureVersionId;
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

    const dict1 = HelpersMisc.getExisted(_tileDecorationImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = HelpersMisc.getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = HelpersMisc.getExisted(dict2.get(skinId));
    if (!dict3.has(tileDecorationType)) {
        dict3.set(tileDecorationType, new Map());
    }

    const dict4 = HelpersMisc.getExisted(dict3.get(tileDecorationType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = HelpersMisc.getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = HelpersMisc.getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source: null, tick: null });
    }

    const cfg = HelpersMisc.getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = HelpersImageSource.getTileDecoration({ version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount });
    }

    return HelpersMisc.getExisted(cfg.source);
}

export function getCachedTileObjectImageSource({ version, themeType, skinId, objectType, isDark, shapeId, tickCount }: {
    version     : GraphicsConstants.TextureVersionId;
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

    const dict1 = HelpersMisc.getExisted(_tileObjectImageSourceDict.get(version));
    if (!dict1.has(themeType)) {
        dict1.set(themeType, new Map());
    }

    const dict2 = HelpersMisc.getExisted(dict1.get(themeType));
    if (!dict2.has(skinId)) {
        dict2.set(skinId, new Map());
    }

    const dict3 = HelpersMisc.getExisted(dict2.get(skinId));
    if (!dict3.has(objectType)) {
        dict3.set(objectType, new Map());
    }

    const dict4 = HelpersMisc.getExisted(dict3.get(objectType));
    if (!dict4.has(isDark)) {
        dict4.set(isDark, new Map());
    }

    const dict5 = HelpersMisc.getExisted(dict4.get(isDark));
    if (!dict5.has(shapeId)) {
        dict5.set(shapeId, new Map());
    }

    const dict6 = HelpersMisc.getExisted(dict5.get(shapeId));
    if (!dict6.has(tickCount)) {
        dict6.set(tickCount, { source: null, tick: null });
    }

    const cfg = HelpersMisc.getExisted(dict6.get(tickCount));
    if (cfg.tick !== tickCount) {
        cfg.tick    = tickCount;
        cfg.source  = HelpersImageSource.getTileObject({ version, themeType, skinId, objectType, isDark, shapeId, tickCount });
    }

    return HelpersMisc.getExisted(cfg.source);
}
export function getCachedTileBuffImageSource({ version, buffType, isDark }: {
    version     : GraphicsConstants.TextureVersionId;
    buffType    : number;
    isDark      : boolean;
}): string {
    if (!_tileBuffImageSourceDict.has(version)) {
        _tileBuffImageSourceDict.set(version, new Map());
    }

    const dict1 = HelpersMisc.getExisted(_tileBuffImageSourceDict.get(version));
    if (!dict1.has(buffType)) {
        dict1.set(buffType, new Map());
    }

    const dict2 = HelpersMisc.getExisted(dict1.get(buffType));
    if (!dict2.has(isDark)) {
        dict2.set(isDark, HelpersImageSource.getTileBuff({ version, buffType, isDark }));
    }

    return HelpersMisc.getExisted(dict2.get(isDark));
}

export function setMrwRankArray(rankList: ProtoSchemaCommonProtoStructureDataForMrwPlayerRank.DataForMrwPlayerRank[]): void {
    _mrwRankArray = rankList;
}
export function getMrwRankList(): ProtoSchemaCommonProtoStructureDataForMrwPlayerRank.DataForMrwPlayerRank[] | null {
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
