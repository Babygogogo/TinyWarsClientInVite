import {
    type Units_Constants,
    type GameConfigs_GameConfig,
    type Units_Unit,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

export interface DamagePreviewSettings {
    isEnabled   : boolean;
    settings    : {
        playerIndex             : number;
        isForcedInCoZone        : boolean;
        extraCommandTowerCount  : number;
    }[];
}

export interface DataForUnitAction {
    actionType          : Units_Constants.ActionTypeId;
    callback            : () => void;
    unitForLaunch?      : Units_Unit.Unit;
    unitForDrop?        : Units_Unit.Unit;
    produceUnitType?    : number;
    costForProduceUnit? : number;
}

export interface DataForTileView {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    tileData            : SerialTile;
    themeType           : number;
    hasFog              : boolean;
    isFullReplay        : boolean;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}
