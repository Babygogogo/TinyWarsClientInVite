import {
    type ReplayWar_Interface_IRwWarBase,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface IHrwWar extends ReplayWar_Interface_IRwWarBase.IRwWarBase {
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getIsNeedSeedRandom(): boolean;
    getIsExecuteActionsWithExtraData(): boolean;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    serializeForCheckpoint(): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    tickVisionTeamIndex(): number | null;
}
