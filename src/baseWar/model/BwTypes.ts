import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IUnit              = UnitsIUnit.IUnit;

export interface DamagePreviewSettings {
    isEnabled   : boolean;
    settings    : {
        playerIndex             : number;
        isForcedInCoZone        : boolean;
        extraCommandTowerCount  : number;
    }[];
}

export interface DataForUnitAction {
    actionType          : UnitsConstants.ActionTypeId;
    callback            : () => void;
    unitForLaunch?      : IUnit;
    unitForDrop?        : IUnit;
    produceUnitType?    : number;
    costForProduceUnit? : number;
}

export interface DataForTileView {
    gameConfig          : GameConfigGcData.GcData;
    tileData            : ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile;
    themeType           : number;
    hasFog              : boolean;
    isFullReplay        : boolean;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}
