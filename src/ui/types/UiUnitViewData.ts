import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { SkillTypeId } from "../../coSkills/Constants.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export class UiUnitViewData {
    public unitData             : SerialUnit;
    public skinId               : number;
    public overridingSkinId     : Undefinable<number>;
    public hasLoadedUnit?       : boolean;
    public coUsingSkillType?    : SkillTypeId;
    public isCapturingTile?     : boolean;
    public isBuildingTile?      : boolean;
    public gameConfig           : GameConfig;

    public constructor({ unitData, skinId, overridingSkinId, hasLoadedUnit, coUsingSkillType, isCapturingTile, isBuildingTile, gameConfig }: {
        unitData            : SerialUnit;
        skinId              : number;
        overridingSkinId    : Undefinable<number>;
        hasLoadedUnit?      : boolean;
        coUsingSkillType?   : SkillTypeId;
        isCapturingTile?    : boolean;
        isBuildingTile?     : boolean;
        gameConfig          : GameConfig;
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
