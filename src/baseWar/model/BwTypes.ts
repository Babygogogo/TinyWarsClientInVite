import {
    type Units_Constants,
    type Units_Unit,
} from "../../internal.ts";

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
