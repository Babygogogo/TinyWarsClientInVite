// eslint-disable-next-line no-shadow
export const enum SyncRequestType {
    PlayerRequest,
    PlayerForce,
    ReconnectionRequest,
}

// eslint-disable-next-line no-shadow
export const enum SyncStatus {
    NoError             = 0,
    NotJoined           = 1,
    Synchronized        = 2,
    EndedOrNotExists    = 3,
}

// eslint-disable-next-line no-shadow
export const enum TaskObjectives {
    MaxObjectivesCount = 10,
    MaxDescLength      = 100,
}

// eslint-disable-next-line no-shadow
export const enum VisibilityTypeId {
    Outside         = 0,
    Inside          = 1,
    Penetrating     = 2,
}

// eslint-disable-next-line no-shadow
export const enum Misc {
    MaxNameLength       = 20,
    MaxCommentLength    = 50,
    MaxPasswordLength   = 4,
}

// eslint-disable-next-line no-shadow
export const enum BasicSettingsType {
    NormalMapId,
    WarName,
    WarPassword,
    WarComment,
    WarRuleTitle,
    HasFog,
    // eslint-disable-next-line no-shadow
    Weather,
    TileTheme,
    // eslint-disable-next-line no-shadow
    WarEvent,
    TimerType,
    TimerRegularParam,
    TimerIncrementalParams,
    TurnsAndWarOperationsLimit,
    SpmSaveSlotIndex,
    SpmSaveSlotComment,
}

export namespace SinglePlayerWar {
    export const MaxSaveSlotCount           = 10;
    export const MaxSaveSlotCommentLength   = 15;

    // eslint-disable-next-line no-shadow
    export const enum PlayerScore {
        MinScore    = -999999,
        MaxScore    = 999999,
        BaseScore   = 100000,
    }
}

export namespace MultiRankedWar {
    export const InitialScore                           = 1200;

    export const MinConcurrentCount                     = 0;
    export const MaxConcurrentCount                     = 10;

    export const RoomPhaseTime                          = 3600 * 24;
    export const MaxAdditionalOffsetScoreForMatching    = 400;

    // eslint-disable-next-line no-shadow
    export const enum BootTimer {
        MinDays                 = 1,
        MaxDays                 = 7,
        DefaultDays             = 3,
    }
}

export namespace MultiMatchWar {
    // eslint-disable-next-line no-shadow
    export const enum BootTimer {
        MinDays                 = 1,
        MaxDays                 = 7,
        DefaultDays             = 3,
    }
}

// eslint-disable-next-line no-shadow
export const enum ReplayWar {
    MaxRating                   = 10,
    MinRating                   = 0,
}

export namespace SingleRankedWar {
    // eslint-disable-next-line no-shadow
    export const enum ValidateStatus {
        Succeed,
        ConfigVersionNotLatest,
        ScoreNotHighest,
        ScoreTooLow,
    }
}

// eslint-disable-next-line no-shadow
export const enum MultiCustomWar {
    MaxInviteCount              = 50,
}

// eslint-disable-next-line no-shadow
export const enum MultiFreeWar {
    MaxInviteCount              = 50,
}

// eslint-disable-next-line no-shadow
export const enum CoopCustomWar {
    MaxInviteCount              = 50,
}

// eslint-disable-next-line no-shadow
export const enum CampaignWar {
    MaxNameLength           = 30,
    MaxDescLength           = 1000,
}
