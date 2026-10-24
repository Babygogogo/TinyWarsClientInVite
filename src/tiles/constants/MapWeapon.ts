// eslint-disable-next-line no-shadow
export const enum TypeId {
    Crystal             = 1,
    CustomCrystal       = 2,
    CannonUp            = 3,
    CannonDown          = 4,
    CannonLeft          = 5,
    CannonRight         = 6,
    CustomCannon        = 7,
    LaserTurret         = 8,
    CustomLaserTurret   = 9,
}

export const AllTypeIdArray = [
    TypeId.Crystal,
    TypeId.CustomCrystal,
    TypeId.CannonUp,
    TypeId.CannonDown,
    TypeId.CannonLeft,
    TypeId.CannonRight,
    TypeId.CustomCannon,
    TypeId.LaserTurret,
    TypeId.CustomLaserTurret,
];
export const AllCustomizableTypeIdArray = [
    TypeId.CustomCrystal,
    TypeId.CustomCannon,
    TypeId.CustomLaserTurret,
];
