import {
    type GameConfigs_GameConfig,
    type CoSkills_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export class UiUnitViewData {
    public readonly unitData             : SerialUnit;
    public skinId               : number;
    public readonly overridingSkinId     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public hasLoadedUnit?       : boolean;
    public coUsingSkillType?    : CoSkills_Constants.SkillTypeId;
    public readonly isCapturingTile?     : boolean;
    public readonly isBuildingTile?      : boolean;
    public readonly gameConfig           : GameConfigs_GameConfig.GameConfig;

    public constructor({ unitData, skinId, overridingSkinId, hasLoadedUnit, coUsingSkillType, isCapturingTile, isBuildingTile, gameConfig }: {
        unitData            : SerialUnit;
        skinId              : number;
        overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
        hasLoadedUnit?      : boolean;
        coUsingSkillType?   : CoSkills_Constants.SkillTypeId;
        isCapturingTile?    : boolean;
        isBuildingTile?     : boolean;
        gameConfig          : GameConfigs_GameConfig.GameConfig;
    }) {
        this.unitData           = unitData;
        this.skinId             = skinId;
        this.overridingSkinId   = overridingSkinId;
        this.hasLoadedUnit      = hasLoadedUnit;
        this.coUsingSkillType   = coUsingSkillType;
        this.isCapturingTile    = isCapturingTile;
        this.isBuildingTile     = isBuildingTile;
        this.gameConfig         = gameConfig;
    }
}
