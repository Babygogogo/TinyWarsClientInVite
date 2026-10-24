import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as ReplayWarInterfaceIRwWarBase from "./IRwWarBase.ts";

export interface IRwWar extends ReplayWarInterfaceIRwWarBase.IRwWarBase {
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getIsNeedSeedRandom(): boolean;
    getIsExecuteActionsWithExtraData(): boolean;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    serializeForCheckpoint(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getReplayId(): number;
    setReplayId(replayId: number): void;

    tickVisionTeamIndex(): number | null;

    getIsShowAllUnits(): boolean;
    setIsShowAllUnits(isShowAllUnits: boolean): void;
}
