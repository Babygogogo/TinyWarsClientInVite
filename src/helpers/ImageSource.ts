import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as GameVersionsUtils from "../gameVersions/Utils.ts";
import * as GraphicsConstants from "../graphics/Constants.ts";
import * as HelpersMisc from "./Misc.ts";
import * as HelpersText from "./Text.ts";
import * as PlayersConstants from "../players/Constants.ts";
import * as TilesConstantsCommon from "../tiles/constants/Common.ts";
import * as TimerTimerModel from "../timer/TimerModel.ts";
import type * as UnitBuffsConstants from "../unitBuffs/Constants.ts";
import type * as UnitsConstants from "../units/Constants.ts";

type CornerStateIconTypeId          = UnitsConstants.CornerStateIconTypeId;
type UnitBuffTypeId                 = UnitBuffsConstants.BuffTypeId;
type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function getCoBust(gcData: GameConfigGcData.GcData, coId: number): string | null {
    const imgNumber = gcData.getCoBasicCfg(coId)?.getImage();
    return (imgNumber != null) ? `coBust${HelpersText.getNumText(imgNumber, 4)}` : null;
}
export function getCoEyeBackground(skinId: number): string {
    switch (skinId) {
        case PlayersConstants.PlayerIndex.Neutral    : return ``;
        case 1                                          : return `uncompressedTriangle0001`;
        case 2                                          : return `uncompressedTriangle0002`;
        case 3                                          : return `uncompressedTriangle0003`;
        case 4                                          : return `uncompressedTriangle0004`;
        case 5                                          : return `uncompressedTriangle0005`;
        case 6                                          : return `uncompressedTriangle0007`;
        case 7                                          : return `uncompressedTriangle0008`;
        case 8                                          : return `uncompressedTriangle0009`;
        default                                         : throw HelpersMisc.newError(`Invalid skinId: ${skinId}`);
    }
}
export function getCoEyeBackgroundByCoId(gcData: GameConfigGcData.GcData, coId: number): string | null {
    switch (gcData.getCoBasicCfg(coId)?.getForce()) {
        case 1  : return `uncompressedTriangle0001`;
        case 2  : return `uncompressedTriangle0002`;
        case 3  : return `uncompressedTriangle0003`;
        case 4  : return `uncompressedTriangle0004`;
        case 5  : return `uncompressedTriangle0005`;
        case 6  : return `uncompressedTriangle0007`;
        // case 7  : return `uncompressedTriangle0008`;
        // case 8  : return `uncompressedTriangle0009`;
        default : return null;
    }
}
export function getCoEye(gcData: GameConfigGcData.GcData, coId: number, isAlive: boolean): string | null {
    const imgNumber = gcData.getCoBasicCfg(coId)?.getImage();
    return (imgNumber != null) ? `coEye${isAlive ? `Normal` : `Grey`}${HelpersText.getNumText(imgNumber, 4)}` : null;
}
export function getCoHeadFrame(skinId: Undefinable<number>): string {
    switch (skinId) {
        case 1  : return `uncompressedRectangle0002`;
        case 2  : return `uncompressedRectangle0003`;
        case 3  : return `uncompressedRectangle0004`;
        case 4  : return `uncompressedRectangle0008`;
        case 5  : return `uncompressedRectangle0005`;
        case 6  : return `uncompressedRectangle0010`;
        case 7  : return `uncompressedRectangle0011`;
        case 8  : return `uncompressedRectangle0012`;
        default : return `uncompressedRectangle0006`;
    }
}
export function getCoHeadBackgroundByCoId(gcData: GameConfigGcData.GcData, coId: number): string | null {
    switch (gcData.getCoBasicCfg(coId)?.getForce()) {
        case 1      : return `uncompressedColorRed0001`;
        case 2      : return `uncompressedColorBlue0000`;
        case 3      : return `uncompressedColorYellow0002`;
        case 4      : return `uncompressedColorGreen0001`;
        case 5      : return `uncompressedColorBlack0000`;
        case 6      : return `uncompressedColorGrey0000`;
        default     : return null;
    }
}
export function getCoHead(gcData: GameConfigGcData.GcData, coId: number): string | null {
    const imgNumber = gcData.getCoBasicCfg(coId)?.getImage();
    return (imgNumber != null) ? `coHead${HelpersText.getNumText(imgNumber, 4)}` : null;
}

export function getSkinCircle(skinId: number, isSelected: boolean): string {
    if (skinId === 1) {
        return isSelected ? `uncompressedCircle0000` : `uncompressedCircle0001`;
    } else if (skinId === 2) {
        return isSelected ? `uncompressedCircle0002` : `uncompressedCircle0003`;
    } else if (skinId === 3) {
        return isSelected ? `uncompressedCircle0004` : `uncompressedCircle0005`;
    } else if (skinId === 4) {
        return isSelected ? `uncompressedCircle0010` : `uncompressedCircle0011`;
    } else if (skinId === 5) {
        return isSelected ? `uncompressedCircle0006` : `uncompressedCircle0007`;
    } else if (skinId === 6) {
        return isSelected ? `uncompressedCircle0012` : `uncompressedCircle0013`;
    } else if (skinId === 7) {
        return isSelected ? `uncompressedCircle0014` : `uncompressedCircle0015`;
    } else if (skinId === 8) {
        return isSelected ? `uncompressedCircle0016` : `uncompressedCircle0017`;
    } else {
        return ``;
    }
}
export function getSkinButtonBackground(skinId: number): string {
    switch (skinId) {
        case 0  : return `uncompressedRectangle0013`;
        case 1  : return `uncompressedRectangle0024`;
        case 2  : return `uncompressedRectangle0015`;
        case 3  : return `uncompressedRectangle0018`;
        case 4  : return `uncompressedRectangle0014`;
        case 5  : return `uncompressedRectangle0025`;
        case 6  : return `uncompressedRectangle0019`;
        case 7  : return `uncompressedRectangle0022`;
        case 8  : return `uncompressedRectangle0023`;
        default : return `uncompressedRectangle0016`;
    }
}

export function getTileBase({ version, themeType, skinId, baseType, isDark, shapeId, tickCount }: {
    version     : GraphicsConstants.TextureVersionId;
    themeType   : number;
    skinId      : number;
    baseType    : number;
    isDark      : boolean;
    shapeId     : number;
    tickCount   : number;
}): string {
    const cfg               = HelpersMisc.getExisted(TilesConstantsCommon.BaseCfgDict.get(baseType));
    const cfgForFrame       = HelpersMisc.getExisted(version === GraphicsConstants.TextureVersionId.V0 ? cfg.animParamsForV0 : cfg.animParams);
    const ticksPerFrame     = cfgForFrame[1];
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForTheme      = `theme${HelpersText.getNumText(themeType)}`;
    const textForShapeId    = `shape${HelpersText.getNumText(shapeId || 0)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForSkin       = `skin${HelpersText.getNumText(skinId)}`;
    const textForType       = `type${HelpersText.getNumText(baseType)}`;
    const textForFrame      = ticksPerFrame < 999999
        ? `frame${HelpersText.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
        : `frame00`;
    return `tileBase_${textForResolution}_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
}
export function getTileDecoration({version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount}: {
    version             : GraphicsConstants.TextureVersionId;
    themeType           : number;
    skinId              : number;
    tileDecorationType  : number | null;
    isDark              : boolean;
    shapeId             : number;
    tickCount           : number;
}): string {
    if (tileDecorationType == null) {
        return ``;
    }

    const cfg               = HelpersMisc.getExisted(TilesConstantsCommon.DecorationCfgDict.get(tileDecorationType));
    const cfgForFrame       = HelpersMisc.getExisted(version === GraphicsConstants.TextureVersionId.V0 ? cfg.animParamsForV0 : cfg.animParams);
    const ticksPerFrame     = cfgForFrame[1];
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForTheme      = `theme${HelpersText.getNumText(themeType)}`;
    const textForShapeId    = `shape${HelpersText.getNumText(shapeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForSkin       = `skin${HelpersText.getNumText(skinId)}`;
    const textForType       = `type${HelpersText.getNumText(tileDecorationType)}`;
    const textForFrame      = ticksPerFrame < 999999
        ? `frame${HelpersText.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
        : `frame00`;
    return `tileDecoration_${textForResolution}_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
}
export function getTileObject({ version, themeType, skinId, objectType, isDark, shapeId, tickCount }: {
    version     : GraphicsConstants.TextureVersionId;
    themeType   : number;
    skinId      : number;
    objectType  : number;
    isDark      : boolean;
    shapeId     : number;
    tickCount   : number;
}): string {
    const cfg               = HelpersMisc.getExisted(TilesConstantsCommon.ObjectCfgDict.get(objectType));
    const cfgForFrame       = HelpersMisc.getExisted(version === GraphicsConstants.TextureVersionId.V0 ? cfg.animParamsForV0 : cfg.animParams);
    const ticksPerFrame     = cfgForFrame[1];
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForTheme      = `theme${HelpersText.getNumText(themeType)}`;
    const textForShapeId    = `shape${HelpersText.getNumText(shapeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForSkin       = `skin${HelpersText.getNumText(skinId)}`;
    const textForType       = `type${HelpersText.getNumText(objectType)}`;
    const textForFrame      = ticksPerFrame < 999999
        ? `frame${HelpersText.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
        : `frame00`;
    return `tileObject_${textForResolution}_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
}
export function getTileBuff({ version, buffType, isDark }: {
    version     : GraphicsConstants.TextureVersionId;
    buffType    : number;
    isDark      : boolean;
}): string {
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForType       = `type${HelpersText.getNumText(buffType, 4)}`;
    const textForDark       = `state${isDark ? `01` : `00`}`;
    return `tileBuff_${textForResolution}_${textForVersion}_${textForType}_${textForDark}`;
}

export function getUnit({ gcData, version, skinId, unitType, isDark, animationType, tickCount }: {
    gcData          : GameConfigGcData.GcData;
    version         : GraphicsConstants.TextureVersionId;
    skinId          : number;
    unitType        : number;
    isDark          : boolean;
    animationType   : UnitsConstants.AnimationTypeId;
    tickCount       : number;
}): string {
    const cfg               = HelpersMisc.getExisted(gcData.getUnitTemplateCfg(unitType)?.getAnimParams());
    const index             = version * 4 + (animationType ? 2 : 0);
    const ticksPerFrame     = cfg[index + 1];
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForMoving     = `act${HelpersText.getNumText(animationType)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForSkin       = `skin${HelpersText.getNumText(skinId)}`;
    const textForType       = `type${HelpersText.getNumText(unitType)}`;
    const textForFrame      = `frame${HelpersText.getNumText(Math.floor((tickCount % (cfg[index] * ticksPerFrame)) / ticksPerFrame))}`;
    return `unit_${textForResolution}_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
}
export function getUnitFlash({ version, skinId, unitType }: {
    version     : GraphicsConstants.TextureVersionId;
    skinId      : number;
    unitType    : number;
}): string {
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForType       = `type${HelpersText.getNumText(unitType)}`;
    const textForDark       = `state99`;
    const textForMoving     = `act00`;
    const textForSkin       = `skin${HelpersText.getNumText(skinId)}`;
    const textForFrame      = `frame00`;
    return `unit_${textForResolution}_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
}
export function getUnitHp({ version, hp, isDark }: {
    version     : GraphicsConstants.TextureVersionId;
    hp          : number;
    isDark      : boolean;
}): string {
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForType       = `type${HelpersText.getNumText(hp)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    return `unitHp_${textForResolution}_${textForVersion}_${textForType}_${textForState}`;
}
export function getUnitCornerStateIcon({ version, iconTypeId, isDark, skinId }: {
    version         : GraphicsConstants.TextureVersionId;
    isDark          : boolean;
    iconTypeId      : CornerStateIconTypeId;
    skinId          : number;
}): string {
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForType       = `type${HelpersText.getNumText(iconTypeId)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    const textForSkin       = `skin${HelpersText.getNumText(skinId)}`;
    return `unitState_${textForResolution}_${textForVersion}_${textForType}_${textForState}_${textForSkin}`;
}
export function getUnitPromotion({ version, promotion, isDark, skinId }: {
    version     : GraphicsConstants.TextureVersionId;
    promotion   : number;
    isDark      : boolean;
    skinId      : number;
}): string {
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForType       = `type${HelpersText.getNumText(promotion)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    const textForSkin       = `skin${HelpersText.getNumText(skinId)}`;
    return `unitPromotion_${textForResolution}_${textForVersion}_${textForType}_${textForState}_${textForSkin}`;
}
export function getUnitBuff({ version, buffTypeId, isDark }: {
    version         : GraphicsConstants.TextureVersionId;
    isDark          : boolean;
    buffTypeId      : UnitBuffTypeId;
}): string {
    const textForResolution = `res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${HelpersText.getNumText(version)}`;
    const textForType       = `type${HelpersText.getNumText(buffTypeId)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    return `unitBuff_${textForResolution}_${textForVersion}_${textForType}_${textForState}`;
}
export function getUnitBlock(): string {
    return `unitBlock_res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}
export function getUnitRepair(): string {
    return `unitRepair_res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}
export function getUnitSupply(): string {
    return `unitSupply_res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}

export function getArrayUnitCop(): string[] {
    return doGetArrayUnitCop();
}
const doGetArrayUnitCop = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 27; ++i) {
        arr.push(`unitCop_res${resText}_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitScop(): string[] {
    return doGetArrayUnitScop();
}
const doGetArrayUnitScop = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 34; ++i) {
        arr.push(`unitScop_res${resText}_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitDamage(): string[] {
    return doGetArrayUnitDamage();
}
const doGetArrayUnitDamage = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 8; ++i) {
        arr.push(`unitDamage_res${resText}_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitExplosion(): string[] {
    return doGetArrayUnitExplosion();
}
const doGetArrayUnitExplosion = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 9; ++i) {
        arr.push(`unitExplosion_res${resText}_type01_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitDive(): string[] {
    return doGetArrayUnitDive();
}
const doGetArrayUnitDive = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 7; ++i) {
        arr.push(`unitDive_res${resText}_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitSurface(): string[] {
    return doGetArrayUnitSurface();
}
const doGetArrayUnitSurface = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 5; ++i) {
        arr.push(`unitSurface_res${resText}_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});

export function getArrayTileCharge(): string[] {
    return doGetArrayTileCharge();
}
const doGetArrayTileCharge = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 11; i < 25; ++i) {
        arr.push(`unitScop_res${resText}_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});

export function getMedal(medalId: number): string {
    return `medal${HelpersText.getNumText(medalId, 6)}`;
}

export function getCursorArea2(): string {
    return `cursorArea_res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}_radius02`;
}
export function getCursorCorner(): string {
    return `cursorCorner_res${HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}
export function getArrayCursorAiming(): string[] {
    return doGetArrayCursorAiming();
}
const doGetArrayCursorAiming = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 4; ++i) {
        arr.push(`cursorAim_res${resText}_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});

export function getArrayMovableArea(): string[] {
    return doGetArrayMovableArea();
}
export function getMovableAreaByTick(tick: number): string {
    const arr = getArrayMovableArea();
    return arr[tick % arr.length];
}
const doGetArrayMovableArea = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 15; ++i) {
        arr.push(`grid_res${resText}_color00_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getArrayAttackableArea(): string[] {
    return doGetArrayAttackableArea();
}
export function getAttackableAreaByTick(tick: number): string {
    const arr = getArrayAttackableArea();
    return arr[tick % arr.length];
}
const doGetArrayAttackableArea = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 15; ++i) {
        arr.push(`grid_res${resText}_color01_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getArrayVisibleArea(): string[] {
    return doGetArrayVisibleArea();
}
export function getVisibleAreaByTick(tick: number): string {
    const arr = getArrayVisibleArea();
    return arr[tick % arr.length];
}
const doGetArrayVisibleArea = HelpersMisc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 15; ++i) {
        arr.push(`grid_res${resText}_color02_frame${HelpersText.getNumText(i)}`);
    }
    return arr;
});
export function getMovePath(shapeId: number): string {
    const resText = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    return `movePath_res${resText}_shape${HelpersText.getNumText(shapeId)}`;
}

export function getGridMark(markTypeId: number): string {
    const resText = HelpersText.getNumText(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    return `gridMark_res${resText}_type${HelpersText.getNumText(markTypeId)}`;
}

export function getBigDialogueBackgroundImage(backgroundId: number): string {
    return `resource/assets/texture/background/dialogueBackground${HelpersText.getNumText(backgroundId, 4)}.png`;
}

export function getUserAvatar(avatarId: number): string {
    return `userAvatar${HelpersText.getNumText(avatarId, 4)}`;
}
export function getUserOnlineState(state: Undefinable<AuxiliaryTypesAuxiliaryTypes.UserOnlineState>): string {
    if ((state == null) || (!state.isOnline)) {
        return `uncompressedColorRed0000`;
    } else {
        return (TimerTimerModel.getServerTimestamp() - (state.lastActivityTimestamp ?? 0) > 60)
            ? `uncompressedColorYellow0000`
            : `uncompressedColorGreen0000`;
    }
}
