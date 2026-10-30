import {
    Helpers_Collection,
    Visibilities_Utils,
    Destructions_Utils,
    ReplayWar_Model_RwWarBase,
    Teams_Constants,
    type GameConfigs_GameConfig,
    type HalfwayReplayWar_Interface_IHrwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export class HrwWar extends ReplayWar_Model_RwWarBase.RwWarBase implements HalfwayReplayWar_Interface_IHrwWar.IHrwWar {
    public init(warData: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
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
        const visibleUnitsOnMap     = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (visibleUnitsOnMap.has(unit)) {
                if (!isFastExecute) {
                    unit.setViewVisible(true);
                }
            } else {
                Destructions_Utils.removeUnitOnMap(this, unit.getGridIndex());
            }
        }

        const tileMap = this.getTileMap();
        if (!this.getIsBatchExecuteAction()) {
            const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
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

        const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeams(this, new Set([visionTeamIndex]));
        for (const tile of this.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));

            if (!isFastExecute) {
                tile.flushDataToView();
            }
        }
    }

    public serializeForCheckpoint(): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData {
        return {
            nextOperationId : this.getNextOperationId(),
            warData         : SerialWar.fromJson({
                settingsForCommon : null,
                settingsForMcw    : null,
                settingsForScw    : null,

                warId                    : null,
                isEnded                  : this.getIsEnded(),
                seedRandomInitialState   : null,
                seedRandomCurrentState   : null,
                executedOperationManager : this.getExecutedOperationManager().serializeForReplayCheckpoint().toJson(),
                remainingVotesForDraw    : this.getDrawVoteManager().getRemainingVotes(),
                drawVoteManager          : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
                weatherManager           : this.getWeatherManager().serialize().toJson(),
                warEventManager          : this.getWarEventManager().serialize().toJson(),
                playerManager            : this.getPlayerManager().serialize().toJson(),
                turnManager              : this.getTurnManager().serialize().toJson(),
                field                    : this.getField().serialize().toJson(),
                warStatisticsManager     : this.getWarStatisticsManager().serialize().toJson(),
                taskObjectiveManager     : this.getTaskObjectiveManager().serialize().toJson(),
            }).encode(),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public tickVisionTeamIndex(): number | null {
        const teamIndexArray = [...this.getPlayerManager().getWatcherTeamIndexesForSelf()].sort((v1, v2) => v1 - v2);
        Helpers_Collection.deleteElementFromList(teamIndexArray, Teams_Constants.TeamIndex.Neutral);

        const currentVisionTeamIndex    = this.getVisionTeamIndex();
        const newVisionTeamIndex        = currentVisionTeamIndex == null
            ? (teamIndexArray[0] ?? null)
            : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
        this._setVisionTeamIndex(newVisionTeamIndex);

        return newVisionTeamIndex;
    }
}
