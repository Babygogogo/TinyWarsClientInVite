import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as DestructionsUtils from "../../destructions/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as HalfwayReplayWarInterfaceIHrwWar from "../interface/IHrwWar.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as ReplayWarModelRwWarBase from "../../replayWar/model/RwWarBase.ts";
import * as TeamsConstants from "../../teams/Constants.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

type GcData                 = GameConfigGcData.GcData;

export class HrwWar extends ReplayWarModelRwWarBase.RwWarBase implements HalfwayReplayWarInterfaceIHrwWar.IHrwWar {
    public init(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): void {
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
        const visibleUnitsOnMap     = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (visibleUnitsOnMap.has(unit)) {
                if (!isFastExecute) {
                    unit.setViewVisible(true);
                }
            } else {
                DestructionsUtils.removeUnitOnMap(this, unit.getGridIndex());
            }
        }

        const tileMap = this.getTileMap();
        if (!this.getIsBatchExecuteAction()) {
            const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
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

        const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeams(this, new Set([visionTeamIndex]));
        for (const tile of this.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));

            if (!isFastExecute) {
                tile.flushDataToView();
            }
        }
    }

    public serializeForCheckpoint(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData {
        return {
            nextOperationId : this.getNextOperationId(),
            warData         : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
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
        HelpersCollection.deleteElementFromList(teamIndexArray, TeamsConstants.TeamIndex.Neutral);

        const currentVisionTeamIndex    = this.getVisionTeamIndex();
        const newVisionTeamIndex        = currentVisionTeamIndex == null
            ? (teamIndexArray[0] ?? null)
            : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
        this._setVisionTeamIndex(newVisionTeamIndex);

        return newVisionTeamIndex;
    }
}
