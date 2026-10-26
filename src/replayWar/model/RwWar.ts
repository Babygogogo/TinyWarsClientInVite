import type { ReplayCheckpointData } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { RwWarBase } from "./RwWarBase.ts";
import { TeamIndex } from "../../teams/Constants.ts";
import { getAllUnitsOnMapVisibleToTeams, getAllTilesVisibleToTeam } from "../../visibilities/Utils.ts";

export class RwWar extends RwWarBase {
    private _replayId?              : number;
    private _isShowAllUnits         = true;

    public init(warData: SerialWar, gameConfig: GameConfig): void {
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
                const visibleUnitsOnMap = getAllUnitsOnMapVisibleToTeams(this, new Set([visionTeamIndex]));
                for (const unit of allUnitsOnMap) {
                    unit.setViewVisible(visibleUnitsOnMap.has(unit));
                }
            }
        }

        const tileMap = this.getTileMap();
        if (!this.getIsBatchExecuteAction()) {
            const visibleTiles = getAllTilesVisibleToTeam(this, visionTeamIndex);
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

    public serializeForCheckpoint(): ReplayCheckpointData {
        const randomNumberManager = this.getRandomNumberManager();
        return {
            nextOperationId    : this.getNextOperationId(),
            warData         : SerialWar.fromJson({
                settingsForCommon           : null,
                settingsForMcw              : null,
                settingsForScw              : null,

                warId                       : null,
                isEnded                     : this.getIsEnded(),
                seedRandomInitialState      : getExisted(randomNumberManager.getSeedRandomInitialState()).toJson(),
                seedRandomCurrentState      : randomNumberManager.getSeedRandomCurrentStateJson(),
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                drawVoteManager             : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
                weatherManager              : this.getWeatherManager().serialize().toJson(),
                warEventManager             : this.getWarEventManager().serialize().toJson(),
                playerManager               : this.getPlayerManager().serialize().toJson(),
                turnManager                 : this.getTurnManager().serialize().toJson(),
                field                       : this.getField().serialize().toJson(),
                executedOperationManager    : this.getExecutedOperationManager().serializeForReplayCheckpoint().toJson(),
                warStatisticsManager        : this.getWarStatisticsManager().serialize().toJson(),
                taskObjectiveManager        : this.getTaskObjectiveManager().serialize().toJson(),
            }).encode(),
        };
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getReplayId(): number {
        return getExisted(this._replayId);
    }
    public setReplayId(replayId: number): void {
        this._replayId = replayId;
    }

    public tickVisionTeamIndex(): number | null {
        const teamIndexArray = [...new Set(this.getPlayerManager().getAllPlayers().map(v => v.getTeamIndex()))].sort((v1, v2) => v1 - v2);
        deleteElementFromList(teamIndexArray, TeamIndex.Neutral);

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
