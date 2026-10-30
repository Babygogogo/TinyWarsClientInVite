 
export const enum Common {
    FirstId         = 0,

    DefaultLimit    = 10000,
    MaxLimit        = 10000,
    MinLimit        = 1000,
}

 
export const enum OperationTypeId {
    SystemBeginTurn             = 1,
    SystemCallWarEvent          = 2,
    SystemDestroyPlayerForce    = 3,
    SystemEndWar                = 4,
    SystemEndTurn               = 5,
    SystemHandleBootPlayer      = 6,
    SystemVoteForDraw           = 7,

    PlayerEndTurn               = 100,
    PlayerSurrender             = 101,
    PlayerProduceUnit           = 102,
    PlayerDeleteUnit            = 103,
    PlayerVoteForDraw           = 104,
    PlayerUseCoSkill            = 105,

    UnitWait                    = 200,
    UnitBeLoaded                = 201,
    UnitCaptureTile             = 202,
    UnitAttackTile              = 203,
    UnitAttackUnit              = 204,
    UnitDropUnit                = 205,
    UnitBuildTile               = 206,
    UnitDive                    = 207,
    UnitSurface                 = 208,
    UnitJoinUnit                = 209,
    UnitLaunchFlare             = 210,
    UnitLaunchSilo              = 211,
    UnitProduceUnit             = 212,
    UnitSupplyUnit              = 213,
    UnitBoardedByCo             = 214,
    UnitUseCoSkill              = 215,
    UnitRepairUnit              = 216,
    UnitCrushUnit               = 217,
    UnitSelfDetonate            = 218,
    // UnitTakeOff                = 223,
}
