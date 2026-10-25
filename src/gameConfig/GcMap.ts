

// eslint-disable-next-line no-shadow
export const enum Constants {
    MaxGridsCount           = 3600,

    MaxNameLength           = 30,
    MaxDesignerLength       = 30,
    MaxFileSize             = 200000,
    MaxDescLength           = 1000,
    MaxReviewCommentLength  = 5000,

    MaxRating               = 10,
    MinRating               = 0,
}

// eslint-disable-next-line no-shadow
export const enum ReviewStatus {
    None        = 0,
    Reviewing   = 1,
    Rejected    = 2,
    Accepted    = 3,
}

// eslint-disable-next-line no-shadow
export const enum SortType {
    MapName,
    NormalMapId,
    DesignerName,
    Popularity,
    GlobalRating,
    MyRating,
    PlayersCountUnneutral,
    GridsCount,
}
