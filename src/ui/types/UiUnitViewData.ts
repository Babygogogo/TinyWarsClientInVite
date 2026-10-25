import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { SkillTypeId } from "../../coSkills/Constants.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export class UiUnitViewData {
    public unitData             : SerialUnit;
    public skinId               : number;
    public overridingSkinId     : Undefinable<number>;
    public hasLoadedUnit?       : boolean;
    public coUsingSkillType?    : SkillTypeId;
    public isCapturingTile?     : boolean;
    public isBuildingTile?      : boolean;
    public gameConfig           : GcData;

    public constructor({ unitData, skinId, overridingSkinId, hasLoadedUnit, coUsingSkillType, isCapturingTile, isBuildingTile, gameConfig }: {
        unitData            : SerialUnit;
        skinId              : number;
        overridingSkinId    : Undefinable<number>;
        hasLoadedUnit?      : boolean;
        coUsingSkillType?   : SkillTypeId;
        isCapturingTile?    : boolean;
        isBuildingTile?     : boolean;
        gameConfig          : GcData;
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
