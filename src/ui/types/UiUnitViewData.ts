import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as CoSkillsConstants from "../../coSkills/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

type SerialUnit         = ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;

export class UiUnitViewData {
    public unitData             : SerialUnit;
    public skinId               : number;
    public overridingSkinId     : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public hasLoadedUnit?       : boolean;
    public coUsingSkillType?    : CoSkillsConstants.SkillTypeId;
    public isCapturingTile?     : boolean;
    public isBuildingTile?      : boolean;
    public gameConfig           : GameConfigGcData.GcData;

    public constructor({ unitData, skinId, overridingSkinId, hasLoadedUnit, coUsingSkillType, isCapturingTile, isBuildingTile, gameConfig }: {
        unitData            : SerialUnit;
        skinId              : number;
        overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
        hasLoadedUnit?      : boolean;
        coUsingSkillType?   : CoSkillsConstants.SkillTypeId;
        isCapturingTile?    : boolean;
        isBuildingTile?     : boolean;
        gameConfig          : GameConfigGcData.GcData;
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
