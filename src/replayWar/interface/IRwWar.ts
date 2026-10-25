import type { ReplayCheckpointData } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IRwWarBase } from "./IRwWarBase.ts";

export interface IRwWar extends IRwWarBase {
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getIsNeedSeedRandom(): boolean;
    getIsExecuteActionsWithExtraData(): boolean;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    serializeForCheckpoint(): ReplayCheckpointData;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getReplayId(): number;
    setReplayId(replayId: number): void;

    tickVisionTeamIndex(): number | null;

    getIsShowAllUnits(): boolean;
    setIsShowAllUnits(isShowAllUnits: boolean): void;
}
