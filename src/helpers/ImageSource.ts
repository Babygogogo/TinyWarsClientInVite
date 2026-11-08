import {
    GameVersions_Utils,
    Graphics_Constants,
    Helpers_Misc,
    Helpers_Text,
    Players_Constants,
    Tiles_Constants_Common,
    Timer_TimerModel,
    Units_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type GameConfigs_GameConfig,
    type UnitBuffs_Constants,
} from "../internal.ts";

export function getCoBust(gcData: GameConfigs_GameConfig.GameConfig, coId: number): string | null {
    const imgNumber = gcData.getCoBasicCfg(coId)?.getImage();
    return (imgNumber != null) ? `coBust${Helpers_Text.getNumText(imgNumber, 4)}` : null;
}
export function getCoEyeBackground(skinId: number): string {
    switch (skinId) {
        case Players_Constants.PlayerIndex.Neutral    : return ``;
        case 1                                          : return `uncompressedTriangle0001`;
        case 2                                          : return `uncompressedTriangle0002`;
        case 3                                          : return `uncompressedTriangle0003`;
        case 4                                          : return `uncompressedTriangle0004`;
        case 5                                          : return `uncompressedTriangle0005`;
        case 6                                          : return `uncompressedTriangle0007`;
        case 7                                          : return `uncompressedTriangle0008`;
        case 8                                          : return `uncompressedTriangle0009`;
        default                                         : throw Helpers_Misc.newError(`Invalid skinId: ${skinId}`);
    }
}
export function getCoEyeBackgroundByCoId(gcData: GameConfigs_GameConfig.GameConfig, coId: number): string | null {
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
export function getCoEye(gcData: GameConfigs_GameConfig.GameConfig, coId: number, isAlive: boolean): string | null {
    const imgNumber = gcData.getCoBasicCfg(coId)?.getImage();
    return (imgNumber != null) ? `coEye${isAlive ? `Normal` : `Grey`}${Helpers_Text.getNumText(imgNumber, 4)}` : null;
}
export function getCoHeadFrame(skinId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): string {
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
export function getCoHeadBackgroundByCoId(gcData: GameConfigs_GameConfig.GameConfig, coId: number): string | null {
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
export function getCoHead(gcData: GameConfigs_GameConfig.GameConfig, coId: number): string | null {
    const imgNumber = gcData.getCoBasicCfg(coId)?.getImage();
    return (imgNumber != null) ? `coHead${Helpers_Text.getNumText(imgNumber, 4)}` : null;
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
    version     : Graphics_Constants.TextureVersionId;
    themeType   : number;
    skinId      : number;
    baseType    : number;
    isDark      : boolean;
    shapeId     : number;
    tickCount   : number;
}): string {
    const cfg               = Helpers_Misc.getExisted(Tiles_Constants_Common.BaseCfgDict.get(baseType));
    const cfgForFrame       = (version === Graphics_Constants.TextureVersionId.V0 ? cfg.animParamsForV0 : cfg.animParams);
    const ticksPerFrame     = cfgForFrame[1];
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForTheme      = `theme${Helpers_Text.getNumText(themeType)}`;
    const textForShapeId    = `shape${Helpers_Text.getNumText(shapeId || 0)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForSkin       = `skin${Helpers_Text.getNumText(skinId)}`;
    const textForType       = `type${Helpers_Text.getNumText(baseType)}`;
    const textForFrame      = ticksPerFrame < 999999
        ? `frame${Helpers_Text.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
        : `frame00`;
    return `tileBase_${textForResolution}_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
}
export function getTileDecoration({ version, themeType, skinId, tileDecorationType, isDark, shapeId, tickCount }: {
    version             : Graphics_Constants.TextureVersionId;
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

    const cfg               = Helpers_Misc.getExisted(Tiles_Constants_Common.DecorationCfgDict.get(tileDecorationType));
    const cfgForFrame       = (version === Graphics_Constants.TextureVersionId.V0 ? cfg.animParamsForV0 : cfg.animParams);
    const ticksPerFrame     = cfgForFrame[1];
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForTheme      = `theme${Helpers_Text.getNumText(themeType)}`;
    const textForShapeId    = `shape${Helpers_Text.getNumText(shapeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForSkin       = `skin${Helpers_Text.getNumText(skinId)}`;
    const textForType       = `type${Helpers_Text.getNumText(tileDecorationType)}`;
    const textForFrame      = ticksPerFrame < 999999
        ? `frame${Helpers_Text.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
        : `frame00`;
    return `tileDecoration_${textForResolution}_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
}
export function getTileObject({ version, themeType, skinId, objectType, isDark, shapeId, tickCount }: {
    version     : Graphics_Constants.TextureVersionId;
    themeType   : number;
    skinId      : number;
    objectType  : number;
    isDark      : boolean;
    shapeId     : number;
    tickCount   : number;
}): string {
    const cfg               = Helpers_Misc.getExisted(Tiles_Constants_Common.ObjectCfgDict.get(objectType));
    const cfgForFrame       = (version === Graphics_Constants.TextureVersionId.V0 ? cfg.animParamsForV0 : cfg.animParams);
    const ticksPerFrame     = cfgForFrame[1];
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForTheme      = `theme${Helpers_Text.getNumText(themeType)}`;
    const textForShapeId    = `shape${Helpers_Text.getNumText(shapeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForSkin       = `skin${Helpers_Text.getNumText(skinId)}`;
    const textForType       = `type${Helpers_Text.getNumText(objectType)}`;
    const textForFrame      = ticksPerFrame < 999999
        ? `frame${Helpers_Text.getNumText(Math.floor((tickCount % (cfgForFrame[0] * ticksPerFrame)) / ticksPerFrame))}`
        : `frame00`;
    return `tileObject_${textForResolution}_${textForVersion}_${textForTheme}_${textForType}_${textForDark}_${textForShapeId}_${textForSkin}_${textForFrame}`;
}
export function getTileBuff({ version, buffType, isDark }: {
    version     : Graphics_Constants.TextureVersionId;
    buffType    : number;
    isDark      : boolean;
}): string {
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForType       = `type${Helpers_Text.getNumText(buffType, 4)}`;
    const textForDark       = `state${isDark ? `01` : `00`}`;
    return `tileBuff_${textForResolution}_${textForVersion}_${textForType}_${textForDark}`;
}

export function getUnit({ version, skinId, unitTypeId, isDark, animationType, tickCount }: {
    version         : Graphics_Constants.TextureVersionId;
    skinId          : number;
    unitTypeId      : number;
    isDark          : boolean;
    animationType   : Units_Constants.AnimationTypeId;
    tickCount       : number;
}): string {
    const cfg               = Helpers_Misc.getExisted(Units_Constants.AnimationCfgDict.get(unitTypeId));
    const ticksPerFrame     = animationType === Units_Constants.AnimationTypeId.Stand ? cfg.idleFrameDuration : cfg.moveFrameDuration;
    const framesCount       = animationType === Units_Constants.AnimationTypeId.Stand ? cfg.idleFramesCount : cfg.moveFramesCount;
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForDark       = isDark ? `state01` : `state00`;
    const textForMoving     = `act${Helpers_Text.getNumText(animationType)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForSkin       = `skin${Helpers_Text.getNumText(skinId)}`;
    const textForType       = `type${Helpers_Text.getNumText(unitTypeId)}`;
    const textForFrame      = `frame${Helpers_Text.getNumText(Math.floor((tickCount % (framesCount * ticksPerFrame)) / ticksPerFrame))}`;
    return `unit_${textForResolution}_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
}
export function getUnitFlash({ version, skinId, unitType }: {
    version     : Graphics_Constants.TextureVersionId;
    skinId      : number;
    unitType    : number;
}): string {
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForType       = `type${Helpers_Text.getNumText(unitType)}`;
    const textForDark       = `state99`;
    const textForMoving     = `act00`;
    const textForSkin       = `skin${Helpers_Text.getNumText(skinId)}`;
    const textForFrame      = `frame00`;
    return `unit_${textForResolution}_${textForVersion}_${textForType}_${textForDark}_${textForMoving}_${textForSkin}_${textForFrame}`;
}
export function getUnitHp({ version, hp, isDark }: {
    version     : Graphics_Constants.TextureVersionId;
    hp          : number;
    isDark      : boolean;
}): string {
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForType       = `type${Helpers_Text.getNumText(hp)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    return `unitHp_${textForResolution}_${textForVersion}_${textForType}_${textForState}`;
}
export function getUnitCornerStateIcon({ version, iconTypeId, isDark, skinId }: {
    version         : Graphics_Constants.TextureVersionId;
    isDark          : boolean;
    iconTypeId      : Units_Constants.CornerStateIconTypeId;
    skinId          : number;
}): string {
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForType       = `type${Helpers_Text.getNumText(iconTypeId)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    const textForSkin       = `skin${Helpers_Text.getNumText(skinId)}`;
    return `unitState_${textForResolution}_${textForVersion}_${textForType}_${textForState}_${textForSkin}`;
}
export function getUnitPromotion({ version, promotion, isDark, skinId }: {
    version     : Graphics_Constants.TextureVersionId;
    promotion   : number;
    isDark      : boolean;
    skinId      : number;
}): string {
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForType       = `type${Helpers_Text.getNumText(promotion)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    const textForSkin       = `skin${Helpers_Text.getNumText(skinId)}`;
    return `unitPromotion_${textForResolution}_${textForVersion}_${textForType}_${textForState}_${textForSkin}`;
}
export function getUnitBuff({ version, buffTypeId, isDark }: {
    version         : Graphics_Constants.TextureVersionId;
    isDark          : boolean;
    buffTypeId      : UnitBuffs_Constants.BuffTypeId;
}): string {
    const textForResolution = `res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
    const textForVersion    = `ver${Helpers_Text.getNumText(version)}`;
    const textForType       = `type${Helpers_Text.getNumText(buffTypeId)}`;
    const textForState      = `state${isDark ? `01` : `00`}`;
    return `unitBuff_${textForResolution}_${textForVersion}_${textForType}_${textForState}`;
}
export function getUnitBlock(): string {
    return `unitBlock_res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}
export function getUnitRepair(): string {
    return `unitRepair_res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}
export function getUnitSupply(): string {
    return `unitSupply_res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}

export function getArrayUnitCop(): string[] {
    return doGetArrayUnitCop();
}
const doGetArrayUnitCop = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 27; ++i) {
        arr.push(`unitCop_res${resText}_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitScop(): string[] {
    return doGetArrayUnitScop();
}
const doGetArrayUnitScop = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 34; ++i) {
        arr.push(`unitScop_res${resText}_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitDamage(): string[] {
    return doGetArrayUnitDamage();
}
const doGetArrayUnitDamage = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 8; ++i) {
        arr.push(`unitDamage_res${resText}_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitExplosion(): string[] {
    return doGetArrayUnitExplosion();
}
const doGetArrayUnitExplosion = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 9; ++i) {
        arr.push(`unitExplosion_res${resText}_type01_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitDive(): string[] {
    return doGetArrayUnitDive();
}
const doGetArrayUnitDive = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 7; ++i) {
        arr.push(`unitDive_res${resText}_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});
export function getArrayUnitSurface(): string[] {
    return doGetArrayUnitSurface();
}
const doGetArrayUnitSurface = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 5; ++i) {
        arr.push(`unitSurface_res${resText}_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});

export function getArrayTileCharge(): string[] {
    return doGetArrayTileCharge();
}
const doGetArrayTileCharge = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 11; i < 25; ++i) {
        arr.push(`unitScop_res${resText}_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});

export function getMedal(medalId: number): string {
    return `medal${Helpers_Text.getNumText(medalId, 6)}`;
}

export function getCursorArea2(): string {
    return `cursorArea_res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}_radius02`;
}
export function getCursorCorner(): string {
    return `cursorCorner_res${Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId)}`;
}
export function getArrayCursorAiming(): string[] {
    return doGetArrayCursorAiming();
}
const doGetArrayCursorAiming = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 4; ++i) {
        arr.push(`cursorAim_res${resText}_frame${Helpers_Text.getNumText(i)}`);
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
const doGetArrayMovableArea = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 15; ++i) {
        arr.push(`grid_res${resText}_color00_frame${Helpers_Text.getNumText(i)}`);
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
const doGetArrayAttackableArea = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 15; ++i) {
        arr.push(`grid_res${resText}_color01_frame${Helpers_Text.getNumText(i)}`);
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
const doGetArrayVisibleArea = Helpers_Misc.createLazyFunc(() => {
    const arr       : string[] = [];
    const resText   = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    for (let i = 0; i < 15; ++i) {
        arr.push(`grid_res${resText}_color02_frame${Helpers_Text.getNumText(i)}`);
    }
    return arr;
});
export function getMovePath(shapeId: number): string {
    const resText = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    return `movePath_res${resText}_shape${Helpers_Text.getNumText(shapeId)}`;
}

export function getGridMark(markTypeId: number): string {
    const resText = Helpers_Text.getNumText(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId);
    return `gridMark_res${resText}_type${Helpers_Text.getNumText(markTypeId)}`;
}

export function getBigDialogueBackgroundImage(backgroundId: number): string {
    return `resource/assets/texture/background/dialogueBackground${Helpers_Text.getNumText(backgroundId, 4)}.png`;
}

export function getUserAvatar(avatarId: number): string {
    return `userAvatar${Helpers_Text.getNumText(avatarId, 4)}`;
}
export function getUserOnlineState(state: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_AuxiliaryTypes.UserOnlineState>): string {
    if ((state == null) || (!state.isOnline)) {
        return `uncompressedColorRed0000`;
    } else {
        return (Timer_TimerModel.getServerTimestamp() - (state.lastActivityTimestamp) > 60)
            ? `uncompressedColorYellow0000`
            : `uncompressedColorGreen0000`;
    }
}
