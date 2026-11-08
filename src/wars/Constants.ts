export const enum SyncRequestTypeId {
    PlayerRequest,
    PlayerForce,
    ReconnectionRequest,
}

export const enum SyncStatusId {
    NoError = 0,
    NotJoined = 1,
    Synchronized = 2,
    EndedOrNotExists = 3,
}

export const enum Misc {
    MaxNameLength = 20,
    MaxCommentLength = 50,
    MaxPasswordLength = 4,
}

export const enum BasicSettingsTypeId {
    NormalMapId,
    WarName,
    WarPassword,
    WarComment,
    WarRuleTitle,
    HasFog,
     
    Weather,
    TileTheme,
     
    WarEvent,
    TimerType,
    TimerRegularParam,
    TimerIncrementalParams,
    TurnsAndWarOperationsLimit,
    SpmSaveSlotIndex,
    SpmSaveSlotComment,
}