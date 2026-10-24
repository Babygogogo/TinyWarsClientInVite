

// eslint-disable-next-line no-shadow
export const enum DirectionId {
    Undefined,
    Left,
    Right,
    Up,
    Down,
}

// eslint-disable-next-line no-shadow
export const enum SymmetryTypeId {
    None                = -1,
    UpToDown            = 0,
    UpRightToDownLeft   = 1,
    LeftToRight         = 2,
    UpLeftToDownRight   = 3,
    Rotation            = 4,
}
