import type { ReplayCheckpointData } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IRwWarBase } from "../../replayWar/interface/IRwWarBase.ts";

export interface IHrwWar extends IRwWarBase {
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getIsNeedSeedRandom(): boolean;
    getIsExecuteActionsWithExtraData(): boolean;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    serializeForCheckpoint(): ReplayCheckpointData;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    tickVisionTeamIndex(): number | null;
}
