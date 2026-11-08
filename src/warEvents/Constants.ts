 
export const enum DescType {
    EventName,
    EventMaxCallCountInPlayerTurn,
    EventMaxCallCountTotal,
    ConditionNode,
    Condition,
    Action,
}

 
export const enum Event {
    MaxNameLength               = 150,
    MaxEventsPerMap             = 100,
    MaxCallCountTotal           = 1000,
    MaxCallCountInPlayerTurn    = 10,
    MaxExpressionLength         = 1000,
    MaxExpressionTokensCount    = 100,

    MaxMultiplier               = 1000000,
    MaxOffset                   = 1000000,
}

 
export const enum ConditionNode {
    MaxCountPerMap              = 150,
    MaxCountPerEventRoot        = 5,
}
