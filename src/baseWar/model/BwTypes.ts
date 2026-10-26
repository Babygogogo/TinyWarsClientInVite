import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { ActionTypeId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";

export interface DamagePreviewSettings {
    isEnabled   : boolean;
    settings    : {
        playerIndex             : number;
        isForcedInCoZone        : boolean;
        extraCommandTowerCount  : number;
    }[];
}

export interface DataForUnitAction {
    actionType          : ActionTypeId;
    callback            : () => void;
    unitForLaunch?      : IUnit;
    unitForDrop?        : IUnit;
    produceUnitType?    : number;
    costForProduceUnit? : number;
}

export interface DataForTileView {
    gameConfig          : GcData;
    tileData            : SerialTile;
    themeType           : number;
    hasFog              : boolean;
    isFullReplay        : boolean;
    skinId              : number;
    overridingSkinId    : Undefinable<number>;
}
