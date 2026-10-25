import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { closePanel, openPanel } from "../../../gamePanels/Manager.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { checkIsValidLanguageTextArray, getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
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
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { ComparatorId } from "../../../valueAndComparators/Constants.ts";
import { ConditionTypeId, MaxCountPerMap } from "../Constants.ts";
import { checkIsValid, getBriefDesc, getDetailedDesc, getErrorTip } from "./CustomCounter.ts";
import {
    checkIsValid as WarEventsConditionsUtilsEventCalledCountCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsEventCalledCountGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsEventCalledCountGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsEventCalledCountGetErrorTip,
} from "./EventCalledCount.ts";
import {
    checkIsValid as WarEventsConditionsUtilsExpressionCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsExpressionGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsExpressionGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsExpressionGetErrorTip,
} from "./Expression.ts";
import {
    checkIsValid as WarEventsConditionsUtilsManualActionStatisticsCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsManualActionStatisticsGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsManualActionStatisticsGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsManualActionStatisticsGetErrorTip,
} from "./ManualActionStatistics.ts";
import {
    checkIsValid as WarEventsConditionsUtilsOngoingPersistentActionPresenceCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsOngoingPersistentActionPresenceGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsOngoingPersistentActionPresenceGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsOngoingPersistentActionPresenceGetErrorTip,
} from "./OngoingPersistentActionPresence.ts";
import {
    checkIsValid as WarEventsConditionsUtilsPlayerPresenceCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsPlayerPresenceGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsPlayerPresenceGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsPlayerPresenceGetErrorTip,
} from "./PlayerPresence.ts";
import {
    checkIsValid as WarEventsConditionsUtilsTilePresenceCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsTilePresenceGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsTilePresenceGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsTilePresenceGetErrorTip,
} from "./TilePresence.ts";
import {
    checkIsValid as WarEventsConditionsUtilsTurnAndPlayerCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsTurnAndPlayerGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsTurnAndPlayerGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsTurnAndPlayerGetErrorTip,
} from "./TurnAndPlayer.ts";
import {
    checkIsValid as WarEventsConditionsUtilsUnitPresenceCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsUnitPresenceGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsUnitPresenceGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsUnitPresenceGetErrorTip,
} from "./UnitPresence.ts";
import {
    checkIsValid as WarEventsConditionsUtilsWeatherAndFogCheckIsValid,
    getBriefDesc as WarEventsConditionsUtilsWeatherAndFogGetBriefDesc,
    getDetailedDesc as WarEventsConditionsUtilsWeatherAndFogGetDetailedDesc,
    getErrorTip as WarEventsConditionsUtilsWeatherAndFogGetErrorTip,
} from "./WeatherAndFog.ts";
import { Event } from "../../Constants.ts";
import { getNode } from "../../fullDatas/Utils.ts";

export function checkIsValidWarEventCondition({ condition, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet }: {  // DONE
    condition               : WarEventCondition;
    mapSize                 : MapSize;
    gameConfig              : GcData;
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
    if (!checkIsValidLanguageTextArray({
        list            : wecCommonData.getConditionNameArray(),
        maxTextLength   : Event.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 0,
    })) {
        return false;
    }

    // TODO add more checkers when the condition types grow.
    return (WarEventsConditionsUtilsEventCalledCountCheckIsValid(condition.getWecEventCalledCount()))
        || (WarEventsConditionsUtilsPlayerPresenceCheckIsValid(condition.getWecPlayerPresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEventsConditionsUtilsTurnAndPlayerCheckIsValid(condition.getWecTurnAndPlayer(), playersCountUnneutral))
        || (WarEventsConditionsUtilsWeatherAndFogCheckIsValid(condition.getWecWeatherAndFog(), gameConfig))
        || (WarEventsConditionsUtilsTilePresenceCheckIsValid(condition.getWecTilePresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEventsConditionsUtilsUnitPresenceCheckIsValid(condition.getWecUnitPresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEventsConditionsUtilsExpressionCheckIsValid(condition.getWecExpression(), customCounterNameSet))
        || (checkIsValid(condition.getWecCustomCounter()))
        || (WarEventsConditionsUtilsOngoingPersistentActionPresenceCheckIsValid(condition.getWecOngoingPersistentActionPresence()))
        || (WarEventsConditionsUtilsManualActionStatisticsCheckIsValid(condition.getWecManualActionStatistics(), playersCountUnneutral));
}

export function resetCondition(condition: WarEventCondition, conditionType: ConditionTypeId): void {
    condition.clearConditionData();

    if (conditionType === ConditionTypeId.WecTurnAndPlayer) {
        condition.setWecTurnAndPlayer(WecTurnAndPlayer.fromJson({
            turnIndexComparator             : ComparatorId.EqualTo,
            turnIndexRemainderComparator    : ComparatorId.EqualTo,
            playerIndexArray                : [],
        }));
    } else if (conditionType === ConditionTypeId.WecWeatherAndFog) {
        condition.setWecWeatherAndFog(WecWeatherAndFog.fromJson({
            weatherTypeArray    : [],
        }));
    } else if (conditionType === ConditionTypeId.WecEventCalledCount) {
        condition.setWecEventCalledCount(WecEventCalledCount.fromJson({
            eventIdArray            : [],
            eventsCount             : 0,
            eventsCountComparator   : ComparatorId.EqualTo,
            timesInTurnComparator   : ComparatorId.EqualTo,
            timesTotalComparator    : ComparatorId.EqualTo,
        }));
    } else if (conditionType === ConditionTypeId.WecPlayerPresence) {
        condition.setWecPlayerPresence(WecPlayerPresence.fromJson({
            conPlayerComparator : {
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === ConditionTypeId.WecTilePresence) {
        condition.setWecTilePresence(WecTilePresence.fromJson({
            conTileComparator   : {
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === ConditionTypeId.WecUnitPresence) {
        condition.setWecUnitPresence(WecUnitPresence.fromJson({
            conUnitComparator   : {
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === ConditionTypeId.WecExpression) {
        condition.setWecExpression(WecExpression.fromJson({
            expression  : "",
        }));
    } else if (conditionType === ConditionTypeId.WecCustomCounter) {
        condition.setWecCustomCounter(WecCustomCounter.fromJson({
            counterIdArray              : [],
            counterCount                : 1,
            counterCountComparator      : ComparatorId.EqualTo,
            valueComparator             : ComparatorId.EqualTo,
            valueRemainderComparator    : ComparatorId.EqualTo,
        }));
    } else if (conditionType === ConditionTypeId.WecOngoingPersistentActionPresence) {
        condition.setWecOngoingPersistentActionPresence(WecOngoingPersistentActionPresence.fromJson({
            ongoingActionIdArray            : [],
            ongoingActionsCount             : 1,
            ongoingActionsCountComparator   : ComparatorId.EqualTo,
        }));
    } else if (conditionType === ConditionTypeId.WecManualActionStatistics) {
        condition.setWecManualActionStatistics(WecManualActionStatistics.fromJson({
            playerIndexArray    : [],
            recentTurnsCount    : 1,
            totalActions        : {
                value           : 1,
                comparator      : ComparatorId.EqualTo,
            },
        }));
    } else {
        // todo: handle more condition types.
        throw newError(`Invalid conditionType: ${conditionType}.`, ClientErrorCode.WarEventHelper_ResetCondition_00);
    }
}

export function openConditionModifyPanel({ fullData, condition, war }: {
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
    war         : IMeWar;
}): void {
    // todo: handle more condition types.
    closePanel(getDict().WecPlayerPresencePanel);
    closePanel(getDict().WecTurnAndPlayerPanel);
    closePanel(getDict().WecEventCalledCountPanel);
    closePanel(getDict().WecTilePresencePanel);
    closePanel(getDict().WecUnitPresencePanel);
    closePanel(getDict().WecWeatherAndFogPanel);
    closePanel(getDict().WecExpressionPanel);
    closePanel(getDict().WeConditionModifyPanel60);
    closePanel(getDict().WecOngoingPersistentActionPanel);
    closePanel(getDict().WecManualActionStatisticsPanel);

    if      (condition.getWecPlayerPresence())                  { openPanel(getDict().WecPlayerPresencePanel,                 { fullData, condition, war }); }
    else if (condition.getWecTurnAndPlayer())                   { openPanel(getDict().WecTurnAndPlayerPanel,                  { fullData, condition, war }); }
    else if (condition.getWecEventCalledCount())                { openPanel(getDict().WecEventCalledCountPanel,               { fullData, condition, war }); }
    else if (condition.getWecTilePresence())                    { openPanel(getDict().WecTilePresencePanel,                   { fullData, condition, war }); }
    else if (condition.getWecUnitPresence())                    { openPanel(getDict().WecUnitPresencePanel,                   { fullData, condition, war }); }
    else if (condition.getWecWeatherAndFog())                   { openPanel(getDict().WecWeatherAndFogPanel,                  { fullData, condition, war }); }
    else if (condition.getWecExpression())                      { openPanel(getDict().WecExpressionPanel,                     { fullData, condition, war }); }
    else if (condition.getWecCustomCounter())                   { openPanel(getDict().WeConditionModifyPanel60,               { fullData, condition, war }); }
    else if (condition.getWecOngoingPersistentActionPresence()) { openPanel(getDict().WecOngoingPersistentActionPanel,        { fullData, condition, war }); }
    else if (condition.getWecManualActionStatistics())          { openPanel(getDict().WecManualActionStatisticsPanel,         { fullData, condition, war }); }
    else                                                        { throw newError(`Invalid condition.`, ClientErrorCode.WarEventHelper_OpenConditionModifyPanel_00); }
}

export function getBriefDescForCondition(con: WarEventCondition, gameConfig: GcData): string | null {
    return (WarEventsConditionsUtilsEventCalledCountGetBriefDesc(con.getWecEventCalledCount()))
        || (WarEventsConditionsUtilsPlayerPresenceGetBriefDesc(con.getWecPlayerPresence()))
        || (WarEventsConditionsUtilsTurnAndPlayerGetBriefDesc(con.getWecTurnAndPlayer()))
        || (WarEventsConditionsUtilsWeatherAndFogGetBriefDesc(con.getWecWeatherAndFog()))
        || (WarEventsConditionsUtilsTilePresenceGetBriefDesc(con.getWecTilePresence()))
        || (WarEventsConditionsUtilsUnitPresenceGetBriefDesc(con.getWecUnitPresence()))
        || (WarEventsConditionsUtilsExpressionGetBriefDesc(con.getWecExpression()))
        || (getBriefDesc(con.getWecCustomCounter()))
        || (WarEventsConditionsUtilsOngoingPersistentActionPresenceGetBriefDesc(con.getWecOngoingPersistentActionPresence()))
        || (WarEventsConditionsUtilsManualActionStatisticsGetBriefDesc(con.getWecManualActionStatistics()));
}
export function getDetailedDescForCondition(con: WarEventCondition, gameConfig: GcData): string | null {
    return (WarEventsConditionsUtilsEventCalledCountGetDetailedDesc(con.getWecEventCalledCount()))
        || (WarEventsConditionsUtilsPlayerPresenceGetDetailedDesc(con.getWecPlayerPresence()))
        || (WarEventsConditionsUtilsTurnAndPlayerGetDetailedDesc(con.getWecTurnAndPlayer()))
        || (WarEventsConditionsUtilsWeatherAndFogGetDetailedDesc(con.getWecWeatherAndFog(), gameConfig))
        || (WarEventsConditionsUtilsTilePresenceGetDetailedDesc(con.getWecTilePresence()))
        || (WarEventsConditionsUtilsUnitPresenceGetDetailedDesc(con.getWecUnitPresence()))
        || (WarEventsConditionsUtilsExpressionGetDetailedDesc(con.getWecExpression()))
        || (getDetailedDesc(con.getWecCustomCounter()))
        || (WarEventsConditionsUtilsOngoingPersistentActionPresenceGetDetailedDesc(con.getWecOngoingPersistentActionPresence()))
        || (WarEventsConditionsUtilsManualActionStatisticsGetDetailedDesc(con.getWecManualActionStatistics()));
}
export function getErrorTipForCondition(fullData: WarEventFullData, condition: WarEventCondition, war: IBwWar): string | null {
    const conditionsCount = fullData.getConditionArray().length;
    if (conditionsCount > MaxCountPerMap) {
        return `${getText(TextType.A0185)} (${conditionsCount}/${MaxCountPerMap})`;
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
        return WarEventsConditionsUtilsEventCalledCountGetErrorTip(wecEventCalledCount, fullData);
    }

    const wecPlayerPresence = condition.getWecPlayerPresence();
    if (wecPlayerPresence) {
        return WarEventsConditionsUtilsPlayerPresenceGetErrorTip(wecPlayerPresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecTurnAndPlayer = condition.getWecTurnAndPlayer();
    if (wecTurnAndPlayer) {
        return WarEventsConditionsUtilsTurnAndPlayerGetErrorTip(wecTurnAndPlayer, war);
    }

    const wecWeatherAndFog = condition.getWecWeatherAndFog();
    if (wecWeatherAndFog) {
        return WarEventsConditionsUtilsWeatherAndFogGetErrorTip(wecWeatherAndFog, war);
    }

    const wecTilePresence = condition.getWecTilePresence();
    if (wecTilePresence) {
        return WarEventsConditionsUtilsTilePresenceGetErrorTip(wecTilePresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecUnitPresence = condition.getWecUnitPresence();
    if (wecUnitPresence) {
        return WarEventsConditionsUtilsUnitPresenceGetErrorTip(wecUnitPresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecExpression = condition.getWecExpression();
    if (wecExpression) {
        return WarEventsConditionsUtilsExpressionGetErrorTip(wecExpression, customCounterNameSet);
    }

    const wecCustomCounter = condition.getWecCustomCounter();
    if (wecCustomCounter) {
        return getErrorTip(wecCustomCounter);
    }

    const wecOngoingPersistentActionPresence = condition.getWecOngoingPersistentActionPresence();
    if (wecOngoingPersistentActionPresence) {
        return WarEventsConditionsUtilsOngoingPersistentActionPresenceGetErrorTip(wecOngoingPersistentActionPresence);
    }

    const wecManualActionStatistics = condition.getWecManualActionStatistics();
    if (wecManualActionStatistics) {
        return WarEventsConditionsUtilsManualActionStatisticsGetErrorTip(wecManualActionStatistics, war);
    }

    return getText(TextType.A0187);
}

export function addDefaultCondition(fullData: WarEventFullData, nodeId: number): number { // DONE
    const node                      = getExisted(getNode(fullData, nodeId), ClientErrorCode.WarEventHelper_AddDefaultCondition_00);
    const conditionIdAndFlagsArray  = node.getConditionIdAndFlagsArray();
    const conditionArray            = fullData.getConditionArray();
    for (let conditionId = 1; ; ++conditionId) {
        if (!conditionArray.some(v => v.getWecCommonData()?.getConditionId() === conditionId)) {
            conditionArray.push(WarEventCondition.fromJson({
                WecCommonData   : {
                    conditionId         : conditionId,
                    conditionNameArray  : [],
                },
                WecTurnAndPlayer : {
                    turnIndexComparator             : ComparatorId.EqualTo,
                    turnIndexRemainderComparator    : ComparatorId.EqualTo,
                    playerIndexArray                : [],
                },
            }));
            conditionArray.sort((v1, v2) => getExisted(v1.getWecCommonData()?.getConditionId()) - getExisted(v2.getWecCommonData()?.getConditionId()));

            conditionIdAndFlagsArray.push(ConditionIdAndFlags.fromJson({ conditionId: conditionId }));
            conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());

            return conditionId;
        }
    }
}
export function cloneCondition(fullData: WarEventFullData, srcConditionId: number): number {
    const conditionArray    = fullData.getConditionArray();
    const newCondition      = getExisted(conditionArray.find(v => v.getWecCommonData()?.getConditionId() === srcConditionId)).clone();
    conditionArray.push(newCondition);

    for (let conditionId = 1; ; ++conditionId) {
        if (conditionArray.some(v => v.getWecCommonData()?.getConditionId() === conditionId)) {
            continue;
        }

        getExisted(newCondition.getWecCommonData()).setConditionId(conditionId);
        conditionArray.sort((v1, v2) => getExisted(v1.getWecCommonData()?.getConditionId()) - getExisted(v2.getWecCommonData()?.getConditionId()));
        return conditionId;
    }
}
