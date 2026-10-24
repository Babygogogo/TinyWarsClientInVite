

// eslint-disable-next-line no-shadow
export const enum Common {
    MaxMessageLength    = 200,
    MaxErrorLength      = 2000,
    TeamDivider         = 100,
}

// eslint-disable-next-line no-shadow
export const enum PublicChannelId {
    System      = 1,
    PublicEn    = 2,
    PublicCn    = 3,
}

// eslint-disable-next-line no-shadow
export const enum ToCategoryId {
    Private         = 1,
    WarAndTeam      = 2,
    PublicChannel   = 3,
    McrRoom         = 4,
    MfrRoom         = 5,
    CcrRoom         = 6,
    MapReview       = 7,
    WarAndSelf      = 8,
}

// eslint-disable-next-line no-shadow
export const enum MainCategoryId {
    PublicChannel,
    War,
    Room,
    Following,
    Stranger,
    MapReview,
}
