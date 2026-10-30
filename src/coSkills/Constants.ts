

 
export const enum SkillTypeId {
    Passive     = 0,
    Power       = 1,
    SuperPower  = 2,
}
export const AllSkillTypeIdArray = [
    SkillTypeId.Passive,
    SkillTypeId.Power,
    SkillTypeId.SuperPower,
];

 
export const enum AreaTypeId {
    Zone    = 0,
    OnMap   = 1,
    Halo    = 2,
}

 
export const enum AutoRecoveryTimingId {
    BeforeRegularRepair     = 0,
    AfterRegularRepair      = 1,
    BeforeEndTurn           = 2,
}

 
export const enum FixedAreaDamageTargetTypeId {
    Hp                 = 1,
    Value              = 2,
    RandomOfHpAndValue = 3,
    CapturerHp         = 4,
    UnitsCount         = 5,
    Appointed          = 6,
}
