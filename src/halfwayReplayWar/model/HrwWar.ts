import type { ReplayCheckpointData } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { removeUnitOnMap } from "../../destructions/Utils.ts";
import type { GcData as GameConfigGcData } from "../../gameConfig/GcData.ts";
import type { IHrwWar } from "../interface/IHrwWar.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { RwWarBase } from "../../replayWar/model/RwWarBase.ts";
import { TeamIndex } from "../../teams/Constants.ts";
import { getAllUnitsOnMapVisibleToTeams, getAllTilesVisibleToTeams } from "../../visibilities/Utils.ts";

type GcData                 = GameConfigGcData;

export class HrwWar extends RwWarBase implements IHrwWar {
    public init(warData: SerialWar, gameConfig: GcData): void {
        super.init(warData, gameConfig);

        this.getPlayerManager().initWatcherTeamIndexesForHrw(warData);

        const executedOperationManager = warData.getExecutedOperationManager();
        this.getExecutedOperationManager().setExecutedOperationsCount(executedOperationManager?.getExecutedOperationsCount() ?? 0);

        this._initView();
    }

    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }
    public getIsExecuteActionsWithExtraData(): boolean {
        return true;
    }

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const watcherTeamIndexes    = this.getPlayerManager().getWatcherTeamIndexesForSelf();
        const visibleUnitsOnMap     = getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (visibleUnitsOnMap.has(unit)) {
                if (!isFastExecute) {
                    unit.setViewVisible(true);
                }
            } else {
                removeUnitOnMap(this, unit.getGridIndex());
            }
        }

        const tileMap = this.getTileMap();
        if (!this.getIsBatchExecuteAction()) {
            const visibleTiles = getAllTilesVisibleToTeams(this, watcherTeamIndexes);
            for (const tile of tileMap.getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        tile.resetTileDataAsHasFog();
                    }
                }

                if (!isFastExecute) {
                    tile.flushDataToView();
                }
            }
        }

        if (!isFastExecute) {
            tileMap.getView().updateCoZone();
        }

        if (!this.getIsBatchExecuteAction()) {
            this._handleVisionTeamIndex(watcherTeamIndexes, isFastExecute);
        }
    }
    private _handleVisionTeamIndex(watcherTeamIndexes: Set<number>, isFastExecute: boolean): void {
        const visionTeamIndex = this.getVisionTeamIndex();
        if (visionTeamIndex == null) {
            return;
        }
        if ((watcherTeamIndexes.size === 1) && (watcherTeamIndexes.values().next().value === visionTeamIndex)) {
            return;
        }

        const visibleTiles = getAllTilesVisibleToTeams(this, new Set([visionTeamIndex]));
        for (const tile of this.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));

            if (!isFastExecute) {
                tile.flushDataToView();
            }
        }
    }

    public serializeForCheckpoint(): ReplayCheckpointData {
        return {
            nextOperationId : this.getNextOperationId(),
            warData         : SerialWar.fromJson({
                settingsForCommon           : null,
                settingsForMcw              : null,
                settingsForScw              : null,

                warId                       : null,
                isEnded                     : this.getIsEnded(),
                seedRandomInitialState      : null,
                seedRandomCurrentState      : null,
                executedOperationManager    : this.getExecutedOperationManager().serializeForReplayCheckpoint().toJson(),
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                drawVoteManager             : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
                weatherManager              : this.getWeatherManager().serialize().toJson(),
                warEventManager             : this.getWarEventManager().serialize().toJson(),
                playerManager               : this.getPlayerManager().serialize().toJson(),
                turnManager                 : this.getTurnManager().serialize().toJson(),
                field                       : this.getField().serialize().toJson(),
                warStatisticsManager        : this.getWarStatisticsManager().serialize().toJson(),
                taskObjectiveManager        : this.getTaskObjectiveManager().serialize().toJson(),
            }).encode(),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public tickVisionTeamIndex(): number | null {
        const teamIndexArray = [...this.getPlayerManager().getWatcherTeamIndexesForSelf()].sort((v1, v2) => v1 - v2);
        deleteElementFromList(teamIndexArray, TeamIndex.Neutral);

        const currentVisionTeamIndex    = this.getVisionTeamIndex();
        const newVisionTeamIndex        = currentVisionTeamIndex == null
            ? (teamIndexArray[0] ?? null)
            : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
        this._setVisionTeamIndex(newVisionTeamIndex);

        return newVisionTeamIndex;
    }
}
