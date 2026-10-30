import {
    Helpers_Collection,
} from "../internal.ts";

 
export const enum CategoryId {
    None    = 0,
    All     = 1,
}

 
export const enum TagId {
    MinTagId        = 1,
    MaxTagId        = 30,
    MaxEncodedTagId = 2 ** MaxTagId - 1,
}
export const AllTagIdArray = Helpers_Collection.createRange(TagId.MinTagId, TagId.MaxTagId + 1, 1);

 
export const enum AiModeId {
    Normal              = 0,
    WaitUntilCanAttack  = 1,
    NoMove              = 2,
}
export const AllAiModeIdArray = [
    AiModeId.Normal,
    AiModeId.WaitUntilCanAttack,
    AiModeId.NoMove,
];

 
export const enum AiDestination {
    MinWeight   = -99999999,
    MaxWeight   = 99999999,
}

 
export const enum ActionStateId {
    Idle    = 0,
    Acted   = 1,
}
export const AllActionStateIdArray = [
    ActionStateId.Idle,
    ActionStateId.Acted,
];

 
export const enum CustomName {
    MinId       = 1,
    MaxId       = 30,
    MinLength   = 1,
    MaxLength   = 15,
}

 
export const enum CornerStateIconTypeId {
    LowFuel                 = 1,
    LowPrimaryAmmo          = 2,
    LoadingUnits            = 3,
    CapturingTile           = 4,
    Diving                  = 5,
    BuildingTile            = 8,
    LowFlareAmmo            = 9,
    CoOnboard               = 10,
    ActivatingCoPower       = 11,
    ActivatingCoSuperPower  = 12,
    LowBuildMaterial        = 13,
    LowProduceMaterial      = 14,
    Moved                   = 15,
}

 
export const enum DisplayLayerId {
    Air         = 3,
    Ground      = 2,
    Sea         = 1,
}

 
export const enum AnimationTypeId {
    Stand           = 0,
    MoveHorizontal  = 1,
    MoveDown        = 2,
    MoveUp          = 3,
}

 
export const enum ActionTypeId {
    Attack,
    BeLoaded,
    BuildTile,
    CaptureTile,
    CoBoard,
    CrushUnit,
    Dive,
    DropUnit,
    Join,
    LaunchFlare,
    LaunchSilo,
    LaunchUnit,
    ProduceUnit,
    RepairUnit,
    SelfDetonate,
    Supply,
    Surface,
    UseCoPower,
    UseCoSuperPower,
    Wait,
}

 
export const enum UnitTypeId {
    First       = 0,
}

 
export const enum Hp  {
    Normalizer          = 10,
    MaxHp               = 100,
    MaxNormalizedHp     = MaxHp / Normalizer,
}

 
export const enum LoadedStateId {
    AnyState       = 0,
    IsNotLoaded    = 1,
    IsLoaded       = 2,
}

 
export const enum WeaponTypeId {
    Primary     = 0,
    Secondary   = 1,
}

 
export const enum ProduceMaterialHardLimit {
    Min     = -100,
    Max     = 100,
}

 
export const enum PrimaryAmmoHardLimit {
    Min     = -100,
    Max     = 100,
}
