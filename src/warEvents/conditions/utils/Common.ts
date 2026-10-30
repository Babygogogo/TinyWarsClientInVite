import {
    WarEvents_Conditions_Utils_CustomCounter,
    WarEvents_Conditions_Utils_EventCalledCount,
    WarEvents_Conditions_Utils_Expression,
    Lang_Utils,
    WarEvents_Conditions_Utils_ManualActionStatistics,
    WarEvents_Conditions_Utils_OngoingPersistentActionPresence,
    WarEvents_Conditions_Utils_PlayerPresence,
    WarEvents_Conditions_Utils_TilePresence,
    WarEvents_Conditions_Utils_TurnAndPlayer,
    WarEvents_Conditions_Utils_UnitPresence,
    WarEvents_Conditions_Utils_WeatherAndFog,
    Utils_ClientErrorCode,
    GamePanels_Manager,
    ValueAndComparators_Constants,
    WarEvents_Conditions_Constants,
    WarEvents_Constants,
    GamePanels_Dict,
    Helpers_Misc,
    WarEvents_FullDatas_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type MapEditor_Interface_IMeWar,
    type AuxiliaryTypes_MapSize,
} from "../../../internal.ts";
import { ConditionIdAndFlags } from "../../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import { WarEventCondition } from "../../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { WecCustomCounter } from "../../../proto/schema/CommonProto/WarEvent/WecCustomCounter.ts";
import { WecEventCalledCount } from "../../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";
import { WecExpression } from "../../../proto/schema/CommonProto/WarEvent/WecExpression.ts";
import { WecManualActionStatistics } from "../../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";
import { WecOngoingPersistentActionPresence } from "../../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";
import { WecPlayerPresence } from "../../../proto/schema/CommonProto/WarEvent/WecPlayerPresence.ts";
import { WecTilePresence } from "../../../proto/schema/CommonProto/WarEvent/WecTilePresence.ts";
import { WecTurnAndPlayer } from "../../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";
import { WecUnitPresence } from "../../../proto/schema/CommonProto/WarEvent/WecUnitPresence.ts";
import { WecWeatherAndFog } from "../../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";

export function checkIsValidWarEventCondition({ condition, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet }: {  // DONE
    condition               : WarEventCondition;
    mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    playersCountUnneutral   : number;
    customCounterNameSet    : Set<string>;
}): boolean {
    // if (Object.keys(condition).length !== 2) {
    //     return false;
    // }

    const wecCommonData = condition.getWecCommonData();
    if (wecCommonData?.getConditionId() == null) {
        return false;
    }
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : wecCommonData.getConditionNameArray(),
        maxTextLength : WarEvents_Constants.Event.MaxNameLength,
        minTextLength : 1,
        minTextCount  : 0,
    })) {
        return false;
    }

    // TODO add more checkers when the condition types grow.
    return (WarEvents_Conditions_Utils_EventCalledCount.checkIsValid(condition.getWecEventCalledCount()))
        || (WarEvents_Conditions_Utils_PlayerPresence.checkIsValid(condition.getWecPlayerPresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEvents_Conditions_Utils_TurnAndPlayer.checkIsValid(condition.getWecTurnAndPlayer(), playersCountUnneutral))
        || (WarEvents_Conditions_Utils_WeatherAndFog.checkIsValid(condition.getWecWeatherAndFog(), gameConfig))
        || (WarEvents_Conditions_Utils_TilePresence.checkIsValid(condition.getWecTilePresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEvents_Conditions_Utils_UnitPresence.checkIsValid(condition.getWecUnitPresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEvents_Conditions_Utils_Expression.checkIsValid(condition.getWecExpression(), customCounterNameSet))
        || (WarEvents_Conditions_Utils_CustomCounter.checkIsValid(condition.getWecCustomCounter()))
        || (WarEvents_Conditions_Utils_OngoingPersistentActionPresence.checkIsValid(condition.getWecOngoingPersistentActionPresence()))
        || (WarEvents_Conditions_Utils_ManualActionStatistics.checkIsValid(condition.getWecManualActionStatistics(), playersCountUnneutral));
}

export function resetCondition(condition: WarEventCondition, conditionType: WarEvents_Conditions_Constants.ConditionTypeId): void {
    condition.clearConditionData();

    if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecTurnAndPlayer) {
        condition.setWecTurnAndPlayer(WecTurnAndPlayer.fromJson({
            turnIndexComparator          : ValueAndComparators_Constants.ComparatorId.EqualTo,
            turnIndexRemainderComparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            playerIndexArray             : [],
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecWeatherAndFog) {
        condition.setWecWeatherAndFog(WecWeatherAndFog.fromJson({
            weatherTypeArray : [],
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecEventCalledCount) {
        condition.setWecEventCalledCount(WecEventCalledCount.fromJson({
            eventIdArray          : [],
            eventsCount           : 0,
            eventsCountComparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            timesInTurnComparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            timesTotalComparator  : ValueAndComparators_Constants.ComparatorId.EqualTo,
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecPlayerPresence) {
        condition.setWecPlayerPresence(WecPlayerPresence.fromJson({
            conPlayerComparator : {
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecTilePresence) {
        condition.setWecTilePresence(WecTilePresence.fromJson({
            conTileComparator : {
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecUnitPresence) {
        condition.setWecUnitPresence(WecUnitPresence.fromJson({
            conUnitComparator : {
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecExpression) {
        condition.setWecExpression(WecExpression.fromJson({
            expression : "",
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecCustomCounter) {
        condition.setWecCustomCounter(WecCustomCounter.fromJson({
            counterIdArray           : [],
            counterCount             : 1,
            counterCountComparator   : ValueAndComparators_Constants.ComparatorId.EqualTo,
            valueComparator          : ValueAndComparators_Constants.ComparatorId.EqualTo,
            valueRemainderComparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecOngoingPersistentActionPresence) {
        condition.setWecOngoingPersistentActionPresence(WecOngoingPersistentActionPresence.fromJson({
            ongoingActionIdArray          : [],
            ongoingActionsCount           : 1,
            ongoingActionsCountComparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
        }));
    } else if (conditionType === WarEvents_Conditions_Constants.ConditionTypeId.WecManualActionStatistics) {
        condition.setWecManualActionStatistics(WecManualActionStatistics.fromJson({
            playerIndexArray : [],
            recentTurnsCount : 1,
            totalActions     : {
                value      : 1,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            },
        }));
    } else {
        // todo: handle more condition types.
        throw Helpers_Misc.newError(`Invalid conditionType: ${conditionType}.`, Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_ResetCondition_00);
    }
}

export function openConditionModifyPanel({ fullData, condition, war }: {
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
    war         : MapEditor_Interface_IMeWar.IMeWar;
}): void {
    // todo: handle more condition types.
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecPlayerPresencePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecTurnAndPlayerPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecEventCalledCountPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecTilePresencePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecUnitPresencePanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecWeatherAndFogPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecExpressionPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeConditionModifyPanel60);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecOngoingPersistentActionPanel);
    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WecManualActionStatisticsPanel);

    if      (condition.getWecPlayerPresence())                  {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecPlayerPresencePanel,                 { fullData, condition, war }); 
    } else if (condition.getWecTurnAndPlayer())                   {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecTurnAndPlayerPanel,                  { fullData, condition, war }); 
    } else if (condition.getWecEventCalledCount())                {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecEventCalledCountPanel,               { fullData, condition, war }); 
    } else if (condition.getWecTilePresence())                    {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecTilePresencePanel,                   { fullData, condition, war }); 
    } else if (condition.getWecUnitPresence())                    {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecUnitPresencePanel,                   { fullData, condition, war }); 
    } else if (condition.getWecWeatherAndFog())                   {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecWeatherAndFogPanel,                  { fullData, condition, war }); 
    } else if (condition.getWecExpression())                      {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecExpressionPanel,                     { fullData, condition, war }); 
    } else if (condition.getWecCustomCounter())                   {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeConditionModifyPanel60,               { fullData, condition, war }); 
    } else if (condition.getWecOngoingPersistentActionPresence()) {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecOngoingPersistentActionPanel,        { fullData, condition, war }); 
    } else if (condition.getWecManualActionStatistics())          {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WecManualActionStatisticsPanel,         { fullData, condition, war }); 
    } else                                                        {
        throw Helpers_Misc.newError(`Invalid condition.`, Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_OpenConditionModifyPanel_00); 
    }
}

export function getBriefDescForCondition(con: WarEventCondition, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return (WarEvents_Conditions_Utils_EventCalledCount.getBriefDesc(con.getWecEventCalledCount()))
        || (WarEvents_Conditions_Utils_PlayerPresence.getBriefDesc(con.getWecPlayerPresence()))
        || (WarEvents_Conditions_Utils_TurnAndPlayer.getBriefDesc(con.getWecTurnAndPlayer()))
        || (WarEvents_Conditions_Utils_WeatherAndFog.getBriefDesc(con.getWecWeatherAndFog()))
        || (WarEvents_Conditions_Utils_TilePresence.getBriefDesc(con.getWecTilePresence()))
        || (WarEvents_Conditions_Utils_UnitPresence.getBriefDesc(con.getWecUnitPresence()))
        || (WarEvents_Conditions_Utils_Expression.getBriefDesc(con.getWecExpression()))
        || (WarEvents_Conditions_Utils_CustomCounter.getBriefDesc(con.getWecCustomCounter()))
        || (WarEvents_Conditions_Utils_OngoingPersistentActionPresence.getBriefDesc(con.getWecOngoingPersistentActionPresence()))
        || (WarEvents_Conditions_Utils_ManualActionStatistics.getBriefDesc(con.getWecManualActionStatistics()));
}
export function getDetailedDescForCondition(con: WarEventCondition, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return (WarEvents_Conditions_Utils_EventCalledCount.getDetailedDesc(con.getWecEventCalledCount()))
        || (WarEvents_Conditions_Utils_PlayerPresence.getDetailedDesc(con.getWecPlayerPresence()))
        || (WarEvents_Conditions_Utils_TurnAndPlayer.getDetailedDesc(con.getWecTurnAndPlayer()))
        || (WarEvents_Conditions_Utils_WeatherAndFog.getDetailedDesc(con.getWecWeatherAndFog(), gameConfig))
        || (WarEvents_Conditions_Utils_TilePresence.getDetailedDesc(con.getWecTilePresence()))
        || (WarEvents_Conditions_Utils_UnitPresence.getDetailedDesc(con.getWecUnitPresence()))
        || (WarEvents_Conditions_Utils_Expression.getDetailedDesc(con.getWecExpression()))
        || (WarEvents_Conditions_Utils_CustomCounter.getDetailedDesc(con.getWecCustomCounter()))
        || (WarEvents_Conditions_Utils_OngoingPersistentActionPresence.getDetailedDesc(con.getWecOngoingPersistentActionPresence()))
        || (WarEvents_Conditions_Utils_ManualActionStatistics.getDetailedDesc(con.getWecManualActionStatistics()));
}
export function getErrorTipForCondition(fullData: WarEventFullData, condition: WarEventCondition, war: BaseWar_Interface_IBwWar.IBwWar): string | null {
    const conditionsCount = fullData.getConditionArray().length;
    if (conditionsCount > WarEvents_Conditions_Constants.MaxCountPerMap) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0185)} (${conditionsCount}/${WarEvents_Conditions_Constants.MaxCountPerMap})`;
    }

    // if (Object.keys(condition.toJson()).length !== 2) {
    //     return Lang.getText(LangTextType.A0187);
    // }

    const mapSize               = war.getTileMap().getMapSize();
    const playersCountUnneutral = war.getPlayersCountUnneutral();
    const gameConfig            = war.getGcData();
    const customCounterNameSet  = new Set(fullData.getCustomCounterNameArray().map(v => v.getName() ?? ``));

    // todo add more tips for the future conditions.
    const wecEventCalledCount = condition.getWecEventCalledCount();
    if (wecEventCalledCount) {
        return WarEvents_Conditions_Utils_EventCalledCount.getErrorTip(wecEventCalledCount, fullData);
    }

    const wecPlayerPresence = condition.getWecPlayerPresence();
    if (wecPlayerPresence) {
        return WarEvents_Conditions_Utils_PlayerPresence.getErrorTip(wecPlayerPresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecTurnAndPlayer = condition.getWecTurnAndPlayer();
    if (wecTurnAndPlayer) {
        return WarEvents_Conditions_Utils_TurnAndPlayer.getErrorTip(wecTurnAndPlayer, war);
    }

    const wecWeatherAndFog = condition.getWecWeatherAndFog();
    if (wecWeatherAndFog) {
        return WarEvents_Conditions_Utils_WeatherAndFog.getErrorTip(wecWeatherAndFog, war);
    }

    const wecTilePresence = condition.getWecTilePresence();
    if (wecTilePresence) {
        return WarEvents_Conditions_Utils_TilePresence.getErrorTip(wecTilePresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecUnitPresence = condition.getWecUnitPresence();
    if (wecUnitPresence) {
        return WarEvents_Conditions_Utils_UnitPresence.getErrorTip(wecUnitPresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecExpression = condition.getWecExpression();
    if (wecExpression) {
        return WarEvents_Conditions_Utils_Expression.getErrorTip(wecExpression, customCounterNameSet);
    }

    const wecCustomCounter = condition.getWecCustomCounter();
    if (wecCustomCounter) {
        return WarEvents_Conditions_Utils_CustomCounter.getErrorTip(wecCustomCounter);
    }

    const wecOngoingPersistentActionPresence = condition.getWecOngoingPersistentActionPresence();
    if (wecOngoingPersistentActionPresence) {
        return WarEvents_Conditions_Utils_OngoingPersistentActionPresence.getErrorTip(wecOngoingPersistentActionPresence);
    }

    const wecManualActionStatistics = condition.getWecManualActionStatistics();
    if (wecManualActionStatistics) {
        return WarEvents_Conditions_Utils_ManualActionStatistics.getErrorTip(wecManualActionStatistics, war);
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0187);
}

export function addDefaultCondition(fullData: WarEventFullData, nodeId: number): number { // DONE
    const node                      = Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getNode(fullData, nodeId), Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_AddDefaultCondition_00);
    const conditionIdAndFlagsArray  = node.getConditionIdAndFlagsArray();
    const conditionArray            = fullData.getConditionArray();
    for (let conditionId = 1; ; ++conditionId) {
        if (!conditionArray.some(v => v.getWecCommonData()?.getConditionId() === conditionId)) {
            conditionArray.push(WarEventCondition.fromJson({
                WecCommonData : {
                    conditionId        : conditionId,
                    conditionNameArray : [],
                },
                WecTurnAndPlayer : {
                    turnIndexComparator          : ValueAndComparators_Constants.ComparatorId.EqualTo,
                    turnIndexRemainderComparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
                    playerIndexArray             : [],
                },
            }));
            conditionArray.sort((v1, v2) => Helpers_Misc.getExisted(v1.getWecCommonData()?.getConditionId()) - Helpers_Misc.getExisted(v2.getWecCommonData()?.getConditionId()));

            conditionIdAndFlagsArray.push(ConditionIdAndFlags.fromJson({ conditionId : conditionId }));
            conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());

            return conditionId;
        }
    }
}
export function cloneCondition(fullData: WarEventFullData, srcConditionId: number): number {
    const conditionArray    = fullData.getConditionArray();
    const newCondition      = Helpers_Misc.getExisted(conditionArray.find(v => v.getWecCommonData()?.getConditionId() === srcConditionId)).clone();
    conditionArray.push(newCondition);

    for (let conditionId = 1; ; ++conditionId) {
        if (conditionArray.some(v => v.getWecCommonData()?.getConditionId() === conditionId)) {
            continue;
        }

        Helpers_Misc.getExisted(newCondition.getWecCommonData()).setConditionId(conditionId);
        conditionArray.sort((v1, v2) => Helpers_Misc.getExisted(v1.getWecCommonData()?.getConditionId()) - Helpers_Misc.getExisted(v2.getWecCommonData()?.getConditionId()));
        return conditionId;
    }
}
