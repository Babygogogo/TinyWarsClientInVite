import {
    Helpers_Collection,
    Visibilities_Utils,
    Helpers_Misc,
    ReplayWar_Model_RwWarBase,
    Teams_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export class RwWar extends ReplayWar_Model_RwWarBase.RwWarBase {
    private _replayId?              : number;
    private _isShowAllUnits         = true;

    public init(warData: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        super.init(warData, gameConfig);

        this._initView();
    }

    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return true;
    }
    public getIsNeedSeedRandom(): boolean {
        return true;
    }
    public getIsExecuteActionsWithExtraData(): boolean {
        return false;
    }

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const visionTeamIndex = this.getVisionTeamIndex() ?? this.getPlayerInTurn().getTeamIndex();
        if (!isFastExecute) {
            // 处理发动技能的co挂掉后，剩余部队的技能角标不消失的问题
            const allUnitsOnMap = this.getUnitMap().getAllUnitsOnMap();
            for (const unit of allUnitsOnMap) {
                unit.updateView();
            }

            if (this.getIsShowAllUnits()) {
                for (const unit of allUnitsOnMap) {
                    unit.setViewVisible(true);
                }
            } else {
                const visibleUnitsOnMap = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(this, new Set([visionTeamIndex]));
                for (const unit of allUnitsOnMap) {
                    unit.setViewVisible(visibleUnitsOnMap.has(unit));
                }
            }
        }

        const tileMap = this.getTileMap();
        if (!this.getIsBatchExecuteAction()) {
            const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeam(this, visionTeamIndex);
            for (const tile of tileMap.getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));

                if (!isFastExecute) {
                    tile.flushDataToView();
                }
            }
        }

        if (!isFastExecute) {
            tileMap.getView().updateCoZone();
        }
    }

    public serializeForCheckpoint(): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData {
        const randomNumberManager = this.getRandomNumberManager();
        return {
            nextOperationId : this.getNextOperationId(),
            warData         : SerialWar.fromJson({
                settingsForCommon : null,
                settingsForMcw    : null,
                settingsForScw    : null,

                warId                    : null,
                isEnded                  : this.getIsEnded(),
                seedRandomInitialState   : Helpers_Misc.getExisted(randomNumberManager.getSeedRandomInitialState()).toJson(),
                seedRandomCurrentState   : randomNumberManager.getSeedRandomCurrentStateJson(),
                remainingVotesForDraw    : this.getDrawVoteManager().getRemainingVotes(),
                drawVoteManager          : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
                weatherManager           : this.getWeatherManager().serialize().toJson(),
                warEventManager          : this.getWarEventManager().serialize().toJson(),
                playerManager            : this.getPlayerManager().serialize().toJson(),
                turnManager              : this.getTurnManager().serialize().toJson(),
                field                    : this.getField().serialize().toJson(),
                executedOperationManager : this.getExecutedOperationManager().serializeForReplayCheckpoint().toJson(),
                warStatisticsManager     : this.getWarStatisticsManager().serialize().toJson(),
                taskObjectiveManager     : this.getTaskObjectiveManager().serialize().toJson(),
            }).encode(),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getReplayId(): number {
        return Helpers_Misc.getExisted(this._replayId);
    }
    public setReplayId(replayId: number): void {
        this._replayId = replayId;
    }

    public tickVisionTeamIndex(): number | null {
        const teamIndexArray = [...new Set(this.getPlayerManager().getAllPlayers().map(v => v.getTeamIndex()))].sort((v1, v2) => v1 - v2);
        Helpers_Collection.deleteElementFromList(teamIndexArray, Teams_Constants.TeamIndex.Neutral);

        const currentVisionTeamIndex    = this.getVisionTeamIndex();
        const newVisionTeamIndex        = currentVisionTeamIndex == null
            ? (teamIndexArray[0] ?? null)
            : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
        this._setVisionTeamIndex(newVisionTeamIndex);

        return newVisionTeamIndex;
    }

    public getIsShowAllUnits(): boolean {
        return this._isShowAllUnits;
    }
    public setIsShowAllUnits(isShowAllUnits: boolean): void {
        this._isShowAllUnits = isShowAllUnits;
    }
}
