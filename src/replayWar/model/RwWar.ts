import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as ReplayWarModelRwWarBase from "./RwWarBase.ts";
import * as TeamsConstants from "../../teams/Constants.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

type GcData             = GameConfigGcData.GcData;

export class RwWar extends ReplayWarModelRwWarBase.RwWarBase {
    private _replayId?              : number;
    private _isShowAllUnits         = true;

    public init(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): void {
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
                const visibleUnitsOnMap = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(this, new Set([visionTeamIndex]));
                for (const unit of allUnitsOnMap) {
                    unit.setViewVisible(visibleUnitsOnMap.has(unit));
                }
            }
        }

        const tileMap = this.getTileMap();
        if (!this.getIsBatchExecuteAction()) {
            const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeam(this, visionTeamIndex);
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

    public serializeForCheckpoint(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData {
        const randomNumberManager = this.getRandomNumberManager();
        return {
            nextOperationId    : this.getNextOperationId(),
            warData         : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
                settingsForCommon           : null,
                settingsForMcw              : null,
                settingsForScw              : null,

                warId                       : null,
                isEnded                     : this.getIsEnded(),
                seedRandomInitialState      : HelpersMisc.getExisted(randomNumberManager.getSeedRandomInitialState()).toJson(),
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
        return HelpersMisc.getExisted(this._replayId);
    }
    public setReplayId(replayId: number): void {
        this._replayId = replayId;
    }

    public tickVisionTeamIndex(): number | null {
        const teamIndexArray = [...new Set(this.getPlayerManager().getAllPlayers().map(v => v.getTeamIndex()))].sort((v1, v2) => v1 - v2);
        HelpersCollection.deleteElementFromList(teamIndexArray, TeamsConstants.TeamIndex.Neutral);

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
