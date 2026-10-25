

// eslint-disable-next-line no-shadow
export const enum ContextType {
    Unknown,

    Fog,
    Number,
    NumberArray,
    Player,
    PlayerArray,
    Tile,
    TileArray,
    Position,
    PositionArray,
    Turn,
    Unit,
    UnitArray,
    UnitStatistic,
    UnitStatisticArray,
    TaskObjective,
    TileBuff,
    TileBuffArray,
    War,
    WarOperation,
    Weather,

    CustomCounter,
}

// eslint-disable-next-line no-shadow
export const enum ResultType {
    Unknown,

    Fog,
    Number,
    NumberArray,
    Player,
    PlayerArray,
    Tile,
    TileArray,
    Position,
    PositionArray,
    Turn,
    Unit,
    UnitArray,
    UnitStatistic,
    UnitStatisticArray,
    TaskObjective,
    TileBuff,
    TileBuffArray,
    War,
    WarOperation,
    Weather,

    Lambda,
}

// eslint-disable-next-line no-shadow
export const enum Priority {
    Ternary             = 1,
    LogicalOr,
    LogicalAnd,
    Equality,
    Comparator,
    AddSubtract,
    MultiplyDivideMod,
    Unary,
    /** number, paren, variable, functionCall */
    Leaf,
}

// eslint-disable-next-line no-shadow
export const enum OperatorCode {
    // 新增code时不能插入在中间，只能加在后面，否则会造成不兼容
    LogicalOr   = 1,

    LogicalAnd,

    Equal,
    Unequal,

    Greater,
    GreaterEqual,
    Less,
    LessEqual,

    Add,
    Subtract,

    Multiply,
    Divide,
    Mod,

    Negate,
    Not,
}

// eslint-disable-next-line no-shadow
export const enum Token {
    Unknown,

    EOF,

    Add,
    Subtract,
    Multiply,
    Divide,
    PercentageSign,

    OpenParens,
    CloseParens,

    Equal,
    Unequal,
    Greater,
    GreaterEqual,
    Less,
    LessEqual,

    LogicalAnd,
    LogicalOr,

    ExclamationMark,
    QuestionMark,
    Colon,
    Comma,

    Identifier,
    Number,
    Dot,
    Lambda,
    Assign,
}
