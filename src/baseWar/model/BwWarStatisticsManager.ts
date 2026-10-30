import {
    MapEditor_Model_MeWar,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type AuxiliaryTypes_AuxiliaryTypes,
    WarStatistics_Utils,
    Players_Utils_Common,
    Teams_Utils,
    Utils_ClientErrorCode,
    Helpers_Team,
    Helpers_Misc,
    Visibilities_Utils,
    Players_Constants,
    Turns_Constants,
} from "../../internal.ts";

import { Info } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/Info.ts";
import { SerialWarStatisticsManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWarStatisticsManager.ts";
import { WsPlayerStatistics } from "../../proto/schema/CommonProto/WarSerialization/WsPlayerStatistics.ts";
import { WsPlayerTurnStatistics } from "../../proto/schema/CommonProto/WarSerialization/WsPlayerTurnStatistics.ts";
import { WsUnitStatistics } from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export class BwWarStatisticsManager implements BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager {
    private _playerStatisticsArray?     : WsPlayerStatistics[];
    private _unitStatisticsArray?       : WsUnitStatistics[];
    private _war?                       : BaseWar_Interface_IBwWar.IBwWar;
    private _hasHandledPreDeployedUnits = false;

    public init({ data, playersCountUnneutral, currentTurnIndex, gameConfiguration }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWarStatisticsManager>;
        playersCountUnneutral   : number;
        currentTurnIndex        : number;
        gameConfiguration       : GameConfigs_GameConfig.GameConfig;
    }): void {
        this._hasHandledPreDeployedUnits = data?.getHasHandledPreDeployedUnits() ?? false;
        this._initPlayerStatisticsArray(data?.getPlayerStatisticsArray() ?? [], playersCountUnneutral, currentTurnIndex);
        this._initUnitStatisticsArray(data?.getUnitStatisticsArray() ?? [], playersCountUnneutral, gameConfiguration);
    }
    public fastInit(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWarStatisticsManager>): void {
        this._hasHandledPreDeployedUnits = data?.getHasHandledPreDeployedUnits() ?? false;
        this._setPlayerStatisticsArray(data?.getPlayerStatisticsArray() ?? []);
        this._setUnitStatisticsArray(data?.getUnitStatisticsArray() ?? []);
    }
    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
        this._checkAndHandlePreDeployedUnits();
    }

    private _getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war, Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetWar_00);
    }

    public serialize(): SerialWarStatisticsManager {
        if (this._getWar() instanceof MapEditor_Model_MeWar.MeWar) {
            return new SerialWarStatisticsManager();
        } else {
            return SerialWarStatisticsManager.fromJson({
                hasHandledPreDeployedUnits : this._hasHandledPreDeployedUnits,
                playerStatisticsArray      : this._getPlayerStatisticsArray().map(v => v.toJson()),
                unitStatisticsArray        : this.getUnitStatisticsArray().map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateSfw(): SerialWarStatisticsManager {
        if (this._getWar() instanceof MapEditor_Model_MeWar.MeWar) {
            return new SerialWarStatisticsManager();
        } else {
            return SerialWarStatisticsManager.fromJson({
                hasHandledPreDeployedUnits : this._hasHandledPreDeployedUnits,
                playerStatisticsArray      : this._getPlayerStatisticsArray().map(v => v.toJson()),
                unitStatisticsArray        : this.getUnitStatisticsArray().map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateMfr(): SerialWarStatisticsManager {
        if (this._getWar() instanceof MapEditor_Model_MeWar.MeWar) {
            return new SerialWarStatisticsManager();
        } else {
            return SerialWarStatisticsManager.fromJson({
                hasHandledPreDeployedUnits : this._hasHandledPreDeployedUnits,
                playerStatisticsArray      : this._getPlayerStatisticsArray().map(v => v.toJson()),
                unitStatisticsArray        : this.getUnitStatisticsArray().map(v => v.toJson()),
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
            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex : unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                const playerIndex                   = unit.getPlayerIndex();
                const groupedObserverTeamIndexes    = Helpers_Team.encodeTeamIndex(observerTeamIndexes);
                this.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : unit.getUnitType(),
                    dstPlayerIndex             : playerIndex,
                    unitGain                   : 1,
                    unitLoss                   : 0,
                    normalizedHpGain           : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss           : 0,
                    groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                }));
                for (const unitLoaded of unitMap.getUnitsLoadedByLoader(unit, true)) {
                    this.addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                   : unitLoaded.getUnitType(),
                        dstPlayerIndex             : playerIndex,
                        unitGain                   : 1,
                        unitLoss                   : 0,
                        normalizedHpGain           : unitLoaded.getNormalizedCurrentHp(),
                        normalizedHpLoss           : 0,
                        groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                    }));
                }
            }
        }
    }

    public _setPlayerStatisticsArray(actions: WsPlayerStatistics[]): void {
        this._playerStatisticsArray = actions;
    }
    private _getPlayerStatisticsArray(): WsPlayerStatistics[] {
        return Helpers_Misc.getExisted(this._playerStatisticsArray, Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetPlayerTurnStatisticsArray_00);
    }
    private _initPlayerStatisticsArray(playerStatisticsArray: WsPlayerStatistics[], playersCountUnneutral: number, currentTurnIndex: number): void {
        const playerIndexSet = new Set<number>();
        for (const playerStatisticsData of playerStatisticsArray) {
            const playerIndex = Helpers_Misc.getExisted(playerStatisticsData.getPlayerIndex(), Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_00);
            if ((playerIndex < Players_Constants.PlayerIndex.Neutral) || (playerIndex > playersCountUnneutral)) {
                throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_01);
            }

            if (playerIndexSet.has(playerIndex)) {
                throw Helpers_Misc.newError(`Duplicated playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_02);
            }
            playerIndexSet.add(playerIndex);

            const turnIndexSet = new Set<number>();
            for (const playerTurnStatisticsData of playerStatisticsData.getPlayerTurnStatisticsArray()) {
                const turnIndex = Helpers_Misc.getExisted(playerTurnStatisticsData.getTurnIndex(), Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_03);
                if ((turnIndex < Turns_Constants.TurnIndex.FirstIndex) || (turnIndex > currentTurnIndex)) {
                    throw Helpers_Misc.newError(`Invalid turnIndex: ${turnIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_04);
                }

                if (turnIndexSet.has(turnIndex)) {
                    throw Helpers_Misc.newError(`Duplicated turnIndex: ${turnIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_Init_05);
                }
                turnIndexSet.add(turnIndex);
            }
        }

        this._setPlayerStatisticsArray(playerStatisticsArray);
    }

    public _setUnitStatisticsArray(arr: WsUnitStatistics[]): void {
        this._unitStatisticsArray = arr;
    }
    public getUnitStatisticsArray(): WsUnitStatistics[] {
        return Helpers_Misc.getExisted(this._unitStatisticsArray);
    }
    public getUnitStatisticsInfoArrayForFullReplay(): Info[] {
        const resultArray: Info[] = [];
        for (const info of this.getUnitStatisticsArray()) {
            let hasMerged = false;
            for (const existingInfo of resultArray) {
                if (((existingInfo.getUnitType() ?? 0) === (info.getUnitType()))             &&
                    ((existingInfo.getPlayerIndex() ?? 0) === (info.getDstPlayerIndex()))
                ) {
                    hasMerged = true;
                    existingInfo.setNormalizedHpGain((existingInfo.getNormalizedHpGain() ?? 0) + (info.getNormalizedHpGain()));
                    existingInfo.setNormalizedHpLoss((existingInfo.getNormalizedHpLoss() ?? 0) + (info.getNormalizedHpLoss()));
                    existingInfo.setUnitGain((existingInfo.getUnitGain() ?? 0) + (info.getUnitGain()));
                    existingInfo.setUnitLoss((existingInfo.getUnitLoss() ?? 0) + (info.getUnitLoss()));
                    break;
                }
            }
            if (!hasMerged) {
                resultArray.push(Info.fromJson({
                    unitType         : info.getUnitType(),
                    playerIndex      : info.getDstPlayerIndex(),
                    unitGain         : info.getUnitGain(),
                    unitLoss         : info.getUnitLoss(),
                    normalizedHpGain : info.getNormalizedHpGain(),
                    normalizedHpLoss : info.getNormalizedHpLoss(),
                }));
            }
        }
        return resultArray;
    }
    private _initUnitStatisticsArray(unitStatisticsArray: WsUnitStatistics[], playersCountUnneutral: number, gameConfiguration: GameConfigs_GameConfig.GameConfig): void {
        const length = unitStatisticsArray.length;
        for (let i = 0; i < length; ++i) {
            const unitStatistics = unitStatisticsArray[i];
            {
                const unitType = unitStatistics.getUnitType();
                if (!gameConfiguration.checkIsValidUnitType(unitType)) {
                    throw Helpers_Misc.newError(`Invalid unitType: ${unitType}`);
                }
            }
            // {
            //     const srcPlayerIndex = unitStatistics.srcPlayerIndex;
            //     if ((srcPlayerIndex != null) && (!GameConfig.Player.PlayerIndex.checkIsValid(srcPlayerIndex, playersCountUnneutral))) {
            //         throw Helpers.newError(`Invalid srcPlayerIndex: ${srcPlayerIndex}`);
            //     }
            // }
            {
                const dstPlayerIndex = unitStatistics.getDstPlayerIndex();
                if (!Players_Utils_Common.checkIsValidPlayerIndex(dstPlayerIndex, playersCountUnneutral)) {
                    throw Helpers_Misc.newError(`Invalid dstPlayerIndex: ${dstPlayerIndex}`);
                }
            }
            {
                const unitGain          = unitStatistics.getUnitGain();
                const unitLoss          = unitStatistics.getUnitLoss();
                const normalizedHpGain  = unitStatistics.getNormalizedHpGain();
                const normalizedHpLoss  = unitStatistics.getNormalizedHpLoss();
                if ((unitGain === 0)            &&
                    (unitLoss === 0)            &&
                    (normalizedHpGain === 0)    &&
                    (normalizedHpLoss === 0)
                ) {
                    throw Helpers_Misc.newError(`Invalid unitGain/Loss normalizedHpGain/Loss: ${unitGain}/${unitLoss}, ${normalizedHpGain}/${normalizedHpLoss}`);
                }
            }
            // {
            //     const reasonType = unitStatistics.reasonType ?? 0;
            //     if (!GameConfig.War.WarStatistics.Unit.Reason.checkIsValid(unitStatistics.reasonType ?? 0)) {
            //         throw Helpers.newError(`Invalid reasonType: ${reasonType}`);
            //     }
            // }
            if (!Teams_Utils.checkIsValidTeamIndexSubset(Helpers_Team.decodeTeamIndex(unitStatistics.getGroupedObserverTeamIndexes()), playersCountUnneutral)) {
                throw Helpers_Misc.newError(`Invalid observerPlayerIndexArray.`);
            }

            for (let j = i + 1; j < length; ++j) {
                if (WarStatistics_Utils.checkCanMerge(unitStatistics, unitStatisticsArray[j])) {
                    throw Helpers_Misc.newError(`Duplicated data.`);
                }
            }
        }

        this._setUnitStatisticsArray(unitStatisticsArray);
    }
    public addUnitStatistics(data: WsUnitStatistics): void {
        const array = this.getUnitStatisticsArray();
        for (const existingData of array) {
            if (WarStatistics_Utils.checkAndMergeTo(data, existingData)) {
                return;
            }
        }
        array.push(data);
    }

    public tickPlayerManualActionsCount(turnIndex: number, playerIndex: number): void {
        const playerStatisticsArray = this._getPlayerStatisticsArray();
        const existingDataForPlayer = playerStatisticsArray.find(v => v.getPlayerIndex() === playerIndex);
        if (existingDataForPlayer == null) {
            playerStatisticsArray.push(WsPlayerStatistics.fromJson({
                playerIndex               : playerIndex,
                playerTurnStatisticsArray : [{
                    turnIndex          : turnIndex,
                    manualActionsCount : 1,
                }],
            }));
        } else {
            const playerTurnStatisticsArray = existingDataForPlayer.getPlayerTurnStatisticsArray();
            const existingData              = playerTurnStatisticsArray.find(v => v.getTurnIndex() === turnIndex);
            if (existingData == null) {
                playerTurnStatisticsArray.push(WsPlayerTurnStatistics.fromJson({
                    turnIndex          : turnIndex,
                    manualActionsCount : 1,
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
    public getManualActionsCountForPlayersInRecentTurns(playerIndexSet: Set<number>, recentTurnsCount: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): number {
        const currentTurnIndex  = this._getWar().getTurnManager().getTurnIndex();
        const maxTurnIndex      = currentTurnIndex;
        const minTurnIndex      = recentTurnsCount == null
            ? Turns_Constants.TurnIndex.FirstIndex
            : Math.max(Turns_Constants.TurnIndex.FirstIndex, currentTurnIndex - recentTurnsCount + 1);
        if (minTurnIndex > maxTurnIndex) {
            return 0;
        }

        let manualActionsCount  = 0;
        for (const playerData of this._getPlayerStatisticsArray()) {
            const playerIndex = Helpers_Misc.getExisted(playerData.getPlayerIndex(), Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetManualActionsCountForPlayersInRecentTurns_00);
            if (!playerIndexSet.has(playerIndex)) {
                continue;
            }

            for (const playerTurnData of playerData.getPlayerTurnStatisticsArray()) {
                const turnIndex = Helpers_Misc.getExisted(playerTurnData.getTurnIndex(), Utils_ClientErrorCode.ClientErrorCode.BwWarStatisticsManager_GetManualActionsCountForPlayersInRecentTurns_01);
                if ((turnIndex >= minTurnIndex) && (turnIndex <= maxTurnIndex)) {
                    manualActionsCount += playerTurnData.getManualActionsCount() ?? 0;
                }
            }
        }

        return manualActionsCount;
    }
}
