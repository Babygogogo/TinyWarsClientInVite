

 
export const enum PlayerIndex {
    Neutral     = 0,
    First       = 1,
    Max         = 8,
}

 
export const enum AliveStateId {
    Alive   = 0,
    Dying   = 1,
    Dead    = 2,
}
export const AllAliveStateIdArray = [
    AliveStateId.Alive,
    AliveStateId.Dying,
    AliveStateId.Dead,
];

 
export const enum Fund {
    MaxFund     = 1000000000,
    MinFund     = -1000000000,
}
