

// eslint-disable-next-line no-shadow
export const enum Common {
    MinCreateInterval       = 3600 * 24 * 7,
    MaxCreateInterval       = 3600 * 24 * 7 * 4 * 12,
    PlayersCountUnneutral   = 2,
    MaxMapsCount            = 30,
    MaxNameLength           = 30,
}

// eslint-disable-next-line no-shadow
export const enum RegistrationConstants {
    DefaultDuration     = 3600 * 24 * 7,
    MinDuration         = 3600 * 24 * 1,
    MaxDuration         = 3600 * 24 * 28,
}

// eslint-disable-next-line no-shadow
export const enum AdjustmentConstants {
    DefaultDuration     = 3600 * 24 * 1,
    MinDuration         = 0,
    MaxDuration         = 3600 * 24 * 3,
}

// eslint-disable-next-line no-shadow
export const enum PhaseId {
    Registration    = 1,
    Adjustment      = 2,
    Battle          = 3,
    End             = 4,
}
