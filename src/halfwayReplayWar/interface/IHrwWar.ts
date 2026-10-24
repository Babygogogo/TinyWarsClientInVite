import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../replayWar/interface/IRwWarBase.ts";

export interface IHrwWar extends ReplayWarInterfaceIRwWarBase.IRwWarBase {
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getIsNeedSeedRandom(): boolean;
    getIsExecuteActionsWithExtraData(): boolean;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    serializeForCheckpoint(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    tickVisionTeamIndex(): number | null;
}
