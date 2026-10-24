import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import * as ProtoSchemaCommonProtoWarEventConditionIdAndFlags from "../../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as ProtoSchemaCommonProtoWarEventWecCustomCounter from "../../../proto/schema/CommonProto/WarEvent/WecCustomCounter.ts";
import * as ProtoSchemaCommonProtoWarEventWecEventCalledCount from "../../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";
import * as ProtoSchemaCommonProtoWarEventWecExpression from "../../../proto/schema/CommonProto/WarEvent/WecExpression.ts";
import * as ProtoSchemaCommonProtoWarEventWecManualActionStatistics from "../../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";
import * as ProtoSchemaCommonProtoWarEventWecOngoingPersistentActionPresence from "../../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";
import * as ProtoSchemaCommonProtoWarEventWecPlayerPresence from "../../../proto/schema/CommonProto/WarEvent/WecPlayerPresence.ts";
import * as ProtoSchemaCommonProtoWarEventWecTilePresence from "../../../proto/schema/CommonProto/WarEvent/WecTilePresence.ts";
import * as ProtoSchemaCommonProtoWarEventWecTurnAndPlayer from "../../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";
import * as ProtoSchemaCommonProtoWarEventWecUnitPresence from "../../../proto/schema/CommonProto/WarEvent/WecUnitPresence.ts";
import * as ProtoSchemaCommonProtoWarEventWecWeatherAndFog from "../../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as ValueAndComparatorsConstants from "../../../valueAndComparators/Constants.ts";
import * as WarEventsConditionsConstants from "../Constants.ts";
import * as WarEventsConditionsUtilsCustomCounter from "./CustomCounter.ts";
import * as WarEventsConditionsUtilsEventCalledCount from "./EventCalledCount.ts";
import * as WarEventsConditionsUtilsExpression from "./Expression.ts";
import * as WarEventsConditionsUtilsManualActionStatistics from "./ManualActionStatistics.ts";
import * as WarEventsConditionsUtilsOngoingPersistentActionPresence from "./OngoingPersistentActionPresence.ts";
import * as WarEventsConditionsUtilsPlayerPresence from "./PlayerPresence.ts";
import * as WarEventsConditionsUtilsTilePresence from "./TilePresence.ts";
import * as WarEventsConditionsUtilsTurnAndPlayer from "./TurnAndPlayer.ts";
import * as WarEventsConditionsUtilsUnitPresence from "./UnitPresence.ts";
import * as WarEventsConditionsUtilsWeatherAndFog from "./WeatherAndFog.ts";
import * as WarEventsConstants from "../../Constants.ts";
import * as WarEventsFullDatasUtils from "../../fullDatas/Utils.ts";

type GcData                 = GameConfigGcData.GcData;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;

export function checkIsValidWarEventCondition({ condition, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet }: {  // DONE
    condition               : ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;
    mapSize                 : AuxiliaryTypesMapSize.MapSize;
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
    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : wecCommonData.getConditionNameArray(),
        maxTextLength   : WarEventsConstants.Event.MaxNameLength,
        minTextLength   : 1,
        minTextCount    : 0,
    })) {
        return false;
    }

    // TODO add more checkers when the condition types grow.
    return (WarEventsConditionsUtilsEventCalledCount.checkIsValid(condition.getWecEventCalledCount()))
        || (WarEventsConditionsUtilsPlayerPresence.checkIsValid(condition.getWecPlayerPresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEventsConditionsUtilsTurnAndPlayer.checkIsValid(condition.getWecTurnAndPlayer(), playersCountUnneutral))
        || (WarEventsConditionsUtilsWeatherAndFog.checkIsValid(condition.getWecWeatherAndFog(), gameConfig))
        || (WarEventsConditionsUtilsTilePresence.checkIsValid(condition.getWecTilePresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEventsConditionsUtilsUnitPresence.checkIsValid(condition.getWecUnitPresence(), playersCountUnneutral, mapSize, gameConfig))
        || (WarEventsConditionsUtilsExpression.checkIsValid(condition.getWecExpression(), customCounterNameSet))
        || (WarEventsConditionsUtilsCustomCounter.checkIsValid(condition.getWecCustomCounter()))
        || (WarEventsConditionsUtilsOngoingPersistentActionPresence.checkIsValid(condition.getWecOngoingPersistentActionPresence()))
        || (WarEventsConditionsUtilsManualActionStatistics.checkIsValid(condition.getWecManualActionStatistics(), playersCountUnneutral));
}

export function resetCondition(condition: ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition, conditionType: WarEventsConditionsConstants.ConditionTypeId): void {
    condition.clearConditionData();

    if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecTurnAndPlayer) {
        condition.setWecTurnAndPlayer(ProtoSchemaCommonProtoWarEventWecTurnAndPlayer.WecTurnAndPlayer.fromJson({
            turnIndexComparator             : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            turnIndexRemainderComparator    : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            playerIndexArray                : [],
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecWeatherAndFog) {
        condition.setWecWeatherAndFog(ProtoSchemaCommonProtoWarEventWecWeatherAndFog.WecWeatherAndFog.fromJson({
            weatherTypeArray    : [],
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecEventCalledCount) {
        condition.setWecEventCalledCount(ProtoSchemaCommonProtoWarEventWecEventCalledCount.WecEventCalledCount.fromJson({
            eventIdArray            : [],
            eventsCount             : 0,
            eventsCountComparator   : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            timesInTurnComparator   : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            timesTotalComparator    : ValueAndComparatorsConstants.ComparatorId.EqualTo,
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecPlayerPresence) {
        condition.setWecPlayerPresence(ProtoSchemaCommonProtoWarEventWecPlayerPresence.WecPlayerPresence.fromJson({
            conPlayerComparator : {
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecTilePresence) {
        condition.setWecTilePresence(ProtoSchemaCommonProtoWarEventWecTilePresence.WecTilePresence.fromJson({
            conTileComparator   : {
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecUnitPresence) {
        condition.setWecUnitPresence(ProtoSchemaCommonProtoWarEventWecUnitPresence.WecUnitPresence.fromJson({
            conUnitComparator   : {
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            },
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecExpression) {
        condition.setWecExpression(ProtoSchemaCommonProtoWarEventWecExpression.WecExpression.fromJson({
            expression  : "",
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecCustomCounter) {
        condition.setWecCustomCounter(ProtoSchemaCommonProtoWarEventWecCustomCounter.WecCustomCounter.fromJson({
            counterIdArray              : [],
            counterCount                : 1,
            counterCountComparator      : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            valueComparator             : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            valueRemainderComparator    : ValueAndComparatorsConstants.ComparatorId.EqualTo,
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecOngoingPersistentActionPresence) {
        condition.setWecOngoingPersistentActionPresence(ProtoSchemaCommonProtoWarEventWecOngoingPersistentActionPresence.WecOngoingPersistentActionPresence.fromJson({
            ongoingActionIdArray            : [],
            ongoingActionsCount             : 1,
            ongoingActionsCountComparator   : ValueAndComparatorsConstants.ComparatorId.EqualTo,
        }));
    } else if (conditionType === WarEventsConditionsConstants.ConditionTypeId.WecManualActionStatistics) {
        condition.setWecManualActionStatistics(ProtoSchemaCommonProtoWarEventWecManualActionStatistics.WecManualActionStatistics.fromJson({
            playerIndexArray    : [],
            recentTurnsCount    : 1,
            totalActions        : {
                value           : 1,
                comparator      : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            },
        }));
    } else {
        // todo: handle more condition types.
        throw HelpersMisc.newError(`Invalid conditionType: ${conditionType}.`, UtilsClientErrorCode.ClientErrorCode.WarEventHelper_ResetCondition_00);
    }
}

export function openConditionModifyPanel({ fullData, condition, war }: {
    fullData    : WarEventFullData;
    condition   : ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;
    war         : MapEditorInterfaceIMeWar.IMeWar;
}): void {
    // todo: handle more condition types.
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecPlayerPresencePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecTurnAndPlayerPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecEventCalledCountPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecTilePresencePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecUnitPresencePanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecWeatherAndFogPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecExpressionPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeConditionModifyPanel60);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecOngoingPersistentActionPanel);
    GamePanelsManager.closePanel(GamePanelsDict.getDict().WecManualActionStatisticsPanel);

    if      (condition.getWecPlayerPresence())                  { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecPlayerPresencePanel,                 { fullData, condition, war }); }
    else if (condition.getWecTurnAndPlayer())                   { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecTurnAndPlayerPanel,                  { fullData, condition, war }); }
    else if (condition.getWecEventCalledCount())                { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecEventCalledCountPanel,               { fullData, condition, war }); }
    else if (condition.getWecTilePresence())                    { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecTilePresencePanel,                   { fullData, condition, war }); }
    else if (condition.getWecUnitPresence())                    { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecUnitPresencePanel,                   { fullData, condition, war }); }
    else if (condition.getWecWeatherAndFog())                   { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecWeatherAndFogPanel,                  { fullData, condition, war }); }
    else if (condition.getWecExpression())                      { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecExpressionPanel,                     { fullData, condition, war }); }
    else if (condition.getWecCustomCounter())                   { GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionModifyPanel60,               { fullData, condition, war }); }
    else if (condition.getWecOngoingPersistentActionPresence()) { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecOngoingPersistentActionPanel,        { fullData, condition, war }); }
    else if (condition.getWecManualActionStatistics())          { GamePanelsManager.openPanel(GamePanelsDict.getDict().WecManualActionStatisticsPanel,         { fullData, condition, war }); }
    else                                                        { throw HelpersMisc.newError(`Invalid condition.`, UtilsClientErrorCode.ClientErrorCode.WarEventHelper_OpenConditionModifyPanel_00); }
}

export function getBriefDescForCondition(con: ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition, gameConfig: GcData): string | null {
    return (WarEventsConditionsUtilsEventCalledCount.getBriefDesc(con.getWecEventCalledCount()))
        || (WarEventsConditionsUtilsPlayerPresence.getBriefDesc(con.getWecPlayerPresence()))
        || (WarEventsConditionsUtilsTurnAndPlayer.getBriefDesc(con.getWecTurnAndPlayer()))
        || (WarEventsConditionsUtilsWeatherAndFog.getBriefDesc(con.getWecWeatherAndFog()))
        || (WarEventsConditionsUtilsTilePresence.getBriefDesc(con.getWecTilePresence()))
        || (WarEventsConditionsUtilsUnitPresence.getBriefDesc(con.getWecUnitPresence()))
        || (WarEventsConditionsUtilsExpression.getBriefDesc(con.getWecExpression()))
        || (WarEventsConditionsUtilsCustomCounter.getBriefDesc(con.getWecCustomCounter()))
        || (WarEventsConditionsUtilsOngoingPersistentActionPresence.getBriefDesc(con.getWecOngoingPersistentActionPresence()))
        || (WarEventsConditionsUtilsManualActionStatistics.getBriefDesc(con.getWecManualActionStatistics()));
}
export function getDetailedDescForCondition(con: ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition, gameConfig: GcData): string | null {
    return (WarEventsConditionsUtilsEventCalledCount.getDetailedDesc(con.getWecEventCalledCount()))
        || (WarEventsConditionsUtilsPlayerPresence.getDetailedDesc(con.getWecPlayerPresence()))
        || (WarEventsConditionsUtilsTurnAndPlayer.getDetailedDesc(con.getWecTurnAndPlayer()))
        || (WarEventsConditionsUtilsWeatherAndFog.getDetailedDesc(con.getWecWeatherAndFog(), gameConfig))
        || (WarEventsConditionsUtilsTilePresence.getDetailedDesc(con.getWecTilePresence()))
        || (WarEventsConditionsUtilsUnitPresence.getDetailedDesc(con.getWecUnitPresence()))
        || (WarEventsConditionsUtilsExpression.getDetailedDesc(con.getWecExpression()))
        || (WarEventsConditionsUtilsCustomCounter.getDetailedDesc(con.getWecCustomCounter()))
        || (WarEventsConditionsUtilsOngoingPersistentActionPresence.getDetailedDesc(con.getWecOngoingPersistentActionPresence()))
        || (WarEventsConditionsUtilsManualActionStatistics.getDetailedDesc(con.getWecManualActionStatistics()));
}
export function getErrorTipForCondition(fullData: WarEventFullData, condition: ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition, war: IBwWar): string | null {
    const conditionsCount = fullData.getConditionArray().length;
    if (conditionsCount > WarEventsConditionsConstants.MaxCountPerMap) {
        return `${LangUtils.getText(LangConstants.TextType.A0185)} (${conditionsCount}/${WarEventsConditionsConstants.MaxCountPerMap})`;
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
        return WarEventsConditionsUtilsEventCalledCount.getErrorTip(wecEventCalledCount, fullData);
    }

    const wecPlayerPresence = condition.getWecPlayerPresence();
    if (wecPlayerPresence) {
        return WarEventsConditionsUtilsPlayerPresence.getErrorTip(wecPlayerPresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecTurnAndPlayer = condition.getWecTurnAndPlayer();
    if (wecTurnAndPlayer) {
        return WarEventsConditionsUtilsTurnAndPlayer.getErrorTip(wecTurnAndPlayer, war);
    }

    const wecWeatherAndFog = condition.getWecWeatherAndFog();
    if (wecWeatherAndFog) {
        return WarEventsConditionsUtilsWeatherAndFog.getErrorTip(wecWeatherAndFog, war);
    }

    const wecTilePresence = condition.getWecTilePresence();
    if (wecTilePresence) {
        return WarEventsConditionsUtilsTilePresence.getErrorTip(wecTilePresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecUnitPresence = condition.getWecUnitPresence();
    if (wecUnitPresence) {
        return WarEventsConditionsUtilsUnitPresence.getErrorTip(wecUnitPresence, playersCountUnneutral, mapSize, gameConfig);
    }

    const wecExpression = condition.getWecExpression();
    if (wecExpression) {
        return WarEventsConditionsUtilsExpression.getErrorTip(wecExpression, customCounterNameSet);
    }

    const wecCustomCounter = condition.getWecCustomCounter();
    if (wecCustomCounter) {
        return WarEventsConditionsUtilsCustomCounter.getErrorTip(wecCustomCounter);
    }

    const wecOngoingPersistentActionPresence = condition.getWecOngoingPersistentActionPresence();
    if (wecOngoingPersistentActionPresence) {
        return WarEventsConditionsUtilsOngoingPersistentActionPresence.getErrorTip(wecOngoingPersistentActionPresence);
    }

    const wecManualActionStatistics = condition.getWecManualActionStatistics();
    if (wecManualActionStatistics) {
        return WarEventsConditionsUtilsManualActionStatistics.getErrorTip(wecManualActionStatistics, war);
    }

    return LangUtils.getText(LangConstants.TextType.A0187);
}

export function addDefaultCondition(fullData: WarEventFullData, nodeId: number): number { // DONE
    const node                      = HelpersMisc.getExisted(WarEventsFullDatasUtils.getNode(fullData, nodeId), UtilsClientErrorCode.ClientErrorCode.WarEventHelper_AddDefaultCondition_00);
    const conditionIdAndFlagsArray  = node.getConditionIdAndFlagsArray();
    const conditionArray            = fullData.getConditionArray();
    for (let conditionId = 1; ; ++conditionId) {
        if (!conditionArray.some(v => v.getWecCommonData()?.getConditionId() === conditionId)) {
            conditionArray.push(ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition.fromJson({
                WecCommonData   : {
                    conditionId         : conditionId,
                    conditionNameArray  : [],
                },
                WecTurnAndPlayer : {
                    turnIndexComparator             : ValueAndComparatorsConstants.ComparatorId.EqualTo,
                    turnIndexRemainderComparator    : ValueAndComparatorsConstants.ComparatorId.EqualTo,
                    playerIndexArray                : [],
                },
            }));
            conditionArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getWecCommonData()?.getConditionId()) - HelpersMisc.getExisted(v2.getWecCommonData()?.getConditionId()));

            conditionIdAndFlagsArray.push(ProtoSchemaCommonProtoWarEventConditionIdAndFlags.ConditionIdAndFlags.fromJson({ conditionId: conditionId }));
            conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());

            return conditionId;
        }
    }
}
export function cloneCondition(fullData: WarEventFullData, srcConditionId: number): number {
    const conditionArray    = fullData.getConditionArray();
    const newCondition      = HelpersMisc.getExisted(conditionArray.find(v => v.getWecCommonData()?.getConditionId() === srcConditionId)).clone();
    conditionArray.push(newCondition);

    for (let conditionId = 1; ; ++conditionId) {
        if (conditionArray.some(v => v.getWecCommonData()?.getConditionId() === conditionId)) {
            continue;
        }

        HelpersMisc.getExisted(newCondition.getWecCommonData()).setConditionId(conditionId);
        conditionArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getWecCommonData()?.getConditionId()) - HelpersMisc.getExisted(v2.getWecCommonData()?.getConditionId()));
        return conditionId;
    }
}
