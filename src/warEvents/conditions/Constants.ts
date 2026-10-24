

export const MaxCountPerMap = 200;

// eslint-disable-next-line no-shadow
export const enum ConditionTypeId {
    WecTurnAndPlayer,

    WecWeatherAndFog,

    WecEventCalledCount,

    WecPlayerPresence,

    WecTilePresence,

    WecUnitPresence,

    WecExpression,

    WecCustomCounter,

    WecOngoingPersistentActionPresence,

    WecManualActionStatistics,
}
export const AvailableConditionTypeIdArray = [
    ConditionTypeId.WecTurnAndPlayer,
    ConditionTypeId.WecPlayerPresence,
    ConditionTypeId.WecEventCalledCount,
    ConditionTypeId.WecWeatherAndFog,
    ConditionTypeId.WecTilePresence,
    ConditionTypeId.WecUnitPresence,
    ConditionTypeId.WecExpression,
    ConditionTypeId.WecOngoingPersistentActionPresence,
    ConditionTypeId.WecManualActionStatistics,
];
