import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../interface/IBwWarStatisticsManager.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersTeam from "../../helpers/Team.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as PlayersUtilsCommon from "../../players/utils/Common.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/Info.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager from "../../proto/schema/CommonProto/WarSerialization/SerialWarStatisticsManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsPlayerStatistics from "../../proto/schema/CommonProto/WarSerialization/WsPlayerStatistics.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsPlayerTurnStatistics from "../../proto/schema/CommonProto/WarSerialization/WsPlayerTurnStatistics.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import * as TeamsUtils from "../../teams/Utils.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";
import * as WarStatisticsUtils from "../../warStatistics/Utils.ts";

type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export class BwWarStatisticsManager implements BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager {
    private _playerStatisticsArray?     : ProtoSchemaCommonProtoWarSerializationWsPlayerStatistics.WsPlayerStatistics[];
    private _unitStatisticsArray?       : ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics[];
    private _war?                       : BaseWarInterfaceIBwWar.IBwWar;
    private _hasHandledPreDeployedUnits = false;

    public init({ data, playersCountUnneutral, currentTurnIndex, gameConfiguration }: {
        data                    : Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager>;
        playersCountUnneutral   : number;
        currentTurnIndex        : number;
        gameConfiguration       : GameConfigGcData.GcData;
    }): void {
        this._hasHandledPreDeployedUnits = data?.getHasHandledPreDeployedUnits() ?? false;
        this._initPlayerStatisticsArray(data?.getPlayerStatisticsArray() ?? [], playersCountUnneutral, currentTurnIndex);
        this._initUnitStatisticsArray(data?.getUnitStatisticsArray() ?? [], playersCountUnneutral, gameConfiguration);
    }
    public fastInit(data: Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager>): void {
        this._hasHandledPreDeployedUnits = data?.getHasHandledPreDeployedUnits() ?? false;
        this._setPlayerStatisticsArray(data?.getPlayerStatisticsArray() ?? []);
        this._setUnitStatisticsArray(data?.getUnitStatisticsArray() ?? []);
    }
    public startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void {
        this._war = war;
        this._checkAndHandlePreDeployedUnits();
    }

    private _getWar(): BaseWarInterfaceIBwWar.IBwWar {
        return HelpersMisc.getExisted(this._war, UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetWar_00);
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager {
        if (this._getWar() instanceof GameHelpersGhFactory.getMeWarClass()) {
            return new ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager();
        } else {
            return ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager.fromJson({
                hasHandledPreDeployedUnits  : this._hasHandledPreDeployedUnits,
                playerStatisticsArray       : this._getPlayerStatisticsArray().map(v => v.toJson()),
                unitStatisticsArray         : this.getUnitStatisticsArray().map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager {
        if (this._getWar() instanceof GameHelpersGhFactory.getMeWarClass()) {
            return new ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager();
        } else {
            return ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager.fromJson({
                hasHandledPreDeployedUnits  : this._hasHandledPreDeployedUnits,
                playerStatisticsArray       : this._getPlayerStatisticsArray().map(v => v.toJson()),
                unitStatisticsArray         : this.getUnitStatisticsArray().map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager {
        if (this._getWar() instanceof GameHelpersGhFactory.getMeWarClass()) {
            return new ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager();
        } else {
            return ProtoSchemaCommonProtoWarSerializationSerialWarStatisticsManager.SerialWarStatisticsManager.fromJson({
                hasHandledPreDeployedUnits  : this._hasHandledPreDeployedUnits,
                playerStatisticsArray       : this._getPlayerStatisticsArray().map(v => v.toJson()),
                unitStatisticsArray         : this.getUnitStatisticsArray().map(v => v.toJson()),
            });
        }
    }

    private _checkAndHandlePreDeployedUnits(): void {
        if (this._hasHandledPreDeployedUnits) {
            return;
        }
        this._hasHandledPreDeployedUnits = true;
        this._setUnitStatisticsArray([]);

        const war       = this._getWar();
        const unitMap   = war.getUnitMap();
        for (const unit of unitMap.getAllUnitsOnMap()) {
            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                const playerIndex                   = unit.getPlayerIndex();
                const groupedObserverTeamIndexes    = HelpersTeam.encodeTeamIndex(observerTeamIndexes);
                this.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : unit.getUnitType(),
                    dstPlayerIndex              : playerIndex,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    groupedObserverTeamIndexes  : groupedObserverTeamIndexes,
                }));
                for (const unitLoaded of unitMap.getUnitsLoadedByLoader(unit, true)) {
                    this.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                        unitType                    : unitLoaded.getUnitType(),
                        dstPlayerIndex              : playerIndex,
                        unitGain                    : 1,
                        unitLoss                    : 0,
                        normalizedHpGain            : unitLoaded.getNormalizedCurrentHp(),
                        normalizedHpLoss            : 0,
                        groupedObserverTeamIndexes  : groupedObserverTeamIndexes,
                    }));
                }
            }
        }
    }

    public _setPlayerStatisticsArray(actions: ProtoSchemaCommonProtoWarSerializationWsPlayerStatistics.WsPlayerStatistics[]): void {
        this._playerStatisticsArray = actions;
    }
    private _getPlayerStatisticsArray(): ProtoSchemaCommonProtoWarSerializationWsPlayerStatistics.WsPlayerStatistics[] {
        return HelpersMisc.getExisted(this._playerStatisticsArray, UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetPlayerTurnStatisticsArray_00);
    }
    private _initPlayerStatisticsArray(playerStatisticsArray: ProtoSchemaCommonProtoWarSerializationWsPlayerStatistics.WsPlayerStatistics[], playersCountUnneutral: number, currentTurnIndex: number): void {
        const playerIndexSet = new Set<number>();
        for (const playerStatisticsData of playerStatisticsArray) {
            const playerIndex = HelpersMisc.getExisted(playerStatisticsData.getPlayerIndex(), UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_00);
            if ((playerIndex < PlayersConstants.PlayerIndex.Neutral) || (playerIndex > playersCountUnneutral)) {
                throw HelpersMisc.newError(`Invalid playerIndex: ${playerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_01);
            }

            if (playerIndexSet.has(playerIndex)) {
                throw HelpersMisc.newError(`Duplicated playerIndex: ${playerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_02);
            }
            playerIndexSet.add(playerIndex);

            const turnIndexSet = new Set<number>();
            for (const playerTurnStatisticsData of playerStatisticsData.getPlayerTurnStatisticsArray()) {
                const turnIndex = HelpersMisc.getExisted(playerTurnStatisticsData.getTurnIndex(), UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_03);
                if ((turnIndex < TurnsConstants.TurnIndex.FirstIndex) || (turnIndex > currentTurnIndex)) {
                    throw HelpersMisc.newError(`Invalid turnIndex: ${turnIndex}`, UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_04);
                }

                if (turnIndexSet.has(turnIndex)) {
                    throw HelpersMisc.newError(`Duplicated turnIndex: ${turnIndex}`, UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_05);
                }
                turnIndexSet.add(turnIndex);
            }
        }

        this._setPlayerStatisticsArray(playerStatisticsArray);
    }

    public _setUnitStatisticsArray(arr: ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics[]): void {
        this._unitStatisticsArray = arr;
    }
    public getUnitStatisticsArray(): ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics[] {
        return HelpersMisc.getExisted(this._unitStatisticsArray);
    }
    public getUnitStatisticsInfoArrayForFullReplay(): ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo.Info[] {
        const resultArray: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo.Info[] = [];
        for (const info of this.getUnitStatisticsArray()) {
            let hasMerged = false;
            for (const existingInfo of resultArray) {
                if (((existingInfo.getUnitType() ?? 0) === (info.getUnitType() ?? 0))             &&
                    ((existingInfo.getPlayerIndex() ?? 0) === (info.getDstPlayerIndex() ?? 0))
                ) {
                    hasMerged = true;
                    existingInfo.setNormalizedHpGain((existingInfo.getNormalizedHpGain() ?? 0) + (info.getNormalizedHpGain() ?? 0));
                    existingInfo.setNormalizedHpLoss((existingInfo.getNormalizedHpLoss() ?? 0) + (info.getNormalizedHpLoss() ?? 0));
                    existingInfo.setUnitGain((existingInfo.getUnitGain() ?? 0) + (info.getUnitGain() ?? 0));
                    existingInfo.setUnitLoss((existingInfo.getUnitLoss() ?? 0) + (info.getUnitLoss() ?? 0));
                    break;
                }
            }
            if (!hasMerged) {
                resultArray.push(ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo.Info.fromJson({
                    unitType            : info.getUnitType() ?? 0,
                    playerIndex         : info.getDstPlayerIndex() ?? 0,
                    unitGain            : info.getUnitGain() ?? 0,
                    unitLoss            : info.getUnitLoss() ?? 0,
                    normalizedHpGain    : info.getNormalizedHpGain() ?? 0,
                    normalizedHpLoss    : info.getNormalizedHpLoss() ?? 0,
                }));
            }
        }
        return resultArray;
    }
    private _initUnitStatisticsArray(unitStatisticsArray: ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics[], playersCountUnneutral: number, gameConfiguration: GameConfigGcData.GcData): void {
        const length = unitStatisticsArray.length;
        for (let i = 0; i < length; ++i) {
            const unitStatistics = unitStatisticsArray[i];
            {
                const unitType = unitStatistics.getUnitType() ?? 0;
                if (!gameConfiguration.checkIsValidUnitType(unitType)) {
                    throw HelpersMisc.newError(`Invalid unitType: ${unitType}`);
                }
            }
            // {
            //     const srcPlayerIndex = unitStatistics.srcPlayerIndex;
            //     if ((srcPlayerIndex != null) && (!GameConfig.Player.PlayerIndex.checkIsValid(srcPlayerIndex, playersCountUnneutral))) {
            //         throw Helpers.newError(`Invalid srcPlayerIndex: ${srcPlayerIndex}`);
            //     }
            // }
            {
                const dstPlayerIndex = unitStatistics.getDstPlayerIndex() ?? 0;
                if (!PlayersUtilsCommon.checkIsValidPlayerIndex(dstPlayerIndex, playersCountUnneutral)) {
                    throw HelpersMisc.newError(`Invalid dstPlayerIndex: ${dstPlayerIndex}`);
                }
            }
            {
                const unitGain          = unitStatistics.getUnitGain() ?? 0;
                const unitLoss          = unitStatistics.getUnitLoss() ?? 0;
                const normalizedHpGain  = unitStatistics.getNormalizedHpGain() ?? 0;
                const normalizedHpLoss  = unitStatistics.getNormalizedHpLoss() ?? 0;
                if ((unitGain === 0)            &&
                    (unitLoss === 0)            &&
                    (normalizedHpGain === 0)    &&
                    (normalizedHpLoss === 0)
                ) {
                    throw HelpersMisc.newError(`Invalid unitGain/Loss normalizedHpGain/Loss: ${unitGain}/${unitLoss}, ${normalizedHpGain}/${normalizedHpLoss}`);
                }
            }
            // {
            //     const reasonType = unitStatistics.reasonType ?? 0;
            //     if (!GameConfig.War.WarStatistics.Unit.Reason.checkIsValid(unitStatistics.reasonType ?? 0)) {
            //         throw Helpers.newError(`Invalid reasonType: ${reasonType}`);
            //     }
            // }
            if (!TeamsUtils.checkIsValidTeamIndexSubset(HelpersTeam.decodeTeamIndex(unitStatistics.getGroupedObserverTeamIndexes() ?? 0), playersCountUnneutral)) {
                throw HelpersMisc.newError(`Invalid observerPlayerIndexArray.`);
            }

            for (let j = i + 1; j < length; ++j) {
                if (WarStatisticsUtils.checkCanMerge(unitStatistics, unitStatisticsArray[j])) {
                    throw HelpersMisc.newError(`Duplicated data.`);
                }
            }
        }

        this._setUnitStatisticsArray(unitStatisticsArray);
    }
    public addUnitStatistics(data: ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics): void {
        const array = this.getUnitStatisticsArray();
        for (const existingData of array) {
            if (WarStatisticsUtils.checkAndMergeTo(data, existingData)) {
                return;
            }
        }
        array.push(data);
    }

    public tickPlayerManualActionsCount(turnIndex: number, playerIndex: number): void {
        const playerStatisticsArray = this._getPlayerStatisticsArray();
        const existingDataForPlayer = playerStatisticsArray.find(v => v.getPlayerIndex() === playerIndex);
        if (existingDataForPlayer == null) {
            playerStatisticsArray.push(ProtoSchemaCommonProtoWarSerializationWsPlayerStatistics.WsPlayerStatistics.fromJson({
                playerIndex                 : playerIndex,
                playerTurnStatisticsArray   : [{
                    turnIndex           : turnIndex,
                    manualActionsCount  : 1,
                }],
            }));
        } else {
            const playerTurnStatisticsArray = existingDataForPlayer.getPlayerTurnStatisticsArray();
            const existingData              = playerTurnStatisticsArray.find(v => v.getTurnIndex() === turnIndex);
            if (existingData == null) {
                playerTurnStatisticsArray.push(ProtoSchemaCommonProtoWarSerializationWsPlayerTurnStatistics.WsPlayerTurnStatistics.fromJson({
                    turnIndex           : turnIndex,
                    manualActionsCount  : 1,
                }));
            } else {
                existingData.setManualActionsCount((existingData.getManualActionsCount() ?? 0) + 1);
            }
        }
    }
    public getManualActionsCount(turnIndex: number, playerIndex: number): number {
        return this._getPlayerStatisticsArray()
            .find(v => v.getPlayerIndex() === playerIndex)
            ?.getPlayerTurnStatisticsArray()
            .find(v => v.getTurnIndex() === turnIndex)
            ?.getManualActionsCount() ?? 0;
    }
    public getManualActionsCountForPlayerInTurn(): number {
        const turnManager = this._getWar().getTurnManager();
        return this.getManualActionsCount(turnManager.getTurnIndex(), turnManager.getPlayerIndexInTurn());
    }
    public getManualActionsCountForPlayersInRecentTurns(playerIndexSet: Set<number>, recentTurnsCount: Undefinable<number>): number {
        const currentTurnIndex  = this._getWar().getTurnManager().getTurnIndex();
        const maxTurnIndex      = currentTurnIndex;
        const minTurnIndex      = recentTurnsCount == null
            ? TurnsConstants.TurnIndex.FirstIndex
            : Math.max(TurnsConstants.TurnIndex.FirstIndex, currentTurnIndex - recentTurnsCount + 1);
        if (minTurnIndex > maxTurnIndex) {
            return 0;
        }

        let manualActionsCount  = 0;
        for (const playerData of this._getPlayerStatisticsArray()) {
            const playerIndex = HelpersMisc.getExisted(playerData.getPlayerIndex(), UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetManualActionsCountForPlayersInRecentTurns_00);
            if (!playerIndexSet.has(playerIndex)) {
                continue;
            }

            for (const playerTurnData of playerData.getPlayerTurnStatisticsArray()) {
                const turnIndex = HelpersMisc.getExisted(playerTurnData.getTurnIndex(), UtilsClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetManualActionsCountForPlayersInRecentTurns_01);
                if ((turnIndex >= minTurnIndex) && (turnIndex <= maxTurnIndex)) {
                    manualActionsCount += playerTurnData.getManualActionsCount() ?? 0;
                }
            }
        }

        return manualActionsCount;
    }
}
