

// eslint-disable-next-line no-shadow
export const enum CategoryId {
    UnitSimple,
    UnitExpr,
    TileSimple,
    TileExpr,
    PlayerSimple,
    PlayerExpr,
    WeatherAndFogSimple,
    WeatherAndFogExpr,
    ImageAndSoundSimple,
    ImageAndSoundExpr,
    MiscSimple,
    MiscExpr,
}

// eslint-disable-next-line no-shadow
export const enum ActionTypeId {
    AddUnitOnMapSimple,
    DeprecatedFillUnitOnMapSimple,
    FillUnitOnMapSimple,
    FillUnitOnMapExpr,
    FillUnitLoadedSimple,
    FillUnitLoadedExpr,
    DestroyUnitSimple,
    DestroyUnitExpr,
    SetUnitTypeSimple,
    SetUnitTypeExpr,
    SetUnitOwnershipSimple,
    SetUnitOwnershipExpr,
    SetUnitPositionSimple,
    SetUnitPositionExpr,
    SetUnitStateSimple,
    SetUnitStateExpr,
    AddUnitBuffSimple,
    ModifyUnitBuffSimple,
    DeleteUnitBuffSimple,

    BigDialogueSimple,
    SetViewpointExpr,
    SetViewpointSimple,
    SetWeatherSimple,
    SetWeatherExpr,
    SmallDialogueSimple,
    PlayBgm,
    PlaySfx,
    SetForceFogCodeExpr,
    SetForceFogCodeSimple,
    SetCustomCounters,
    StopPersistentAction,

    SetPlayerStateExpr,
    SetPlayerStateSimple,

    SetTaskObjectiveState,
    SetUnitMovePathVisibility,

    SetTileTypeExpr,
    SetTileTypeSimple,
    DeprecatedSetTileState,
    SetTileStateExpr,
    SetTileStateSimple,
    SetCustomBuildingStateExpr,
    SetCustomBuildingStateSimple,
    SetCustomCrystalStateExpr,
    SetCustomCrystalStateSimple,
    SetCustomCannonStateExpr,
    SetCustomCannonStateSimple,
    SetCustomLaserTurretStateExpr,
    SetCustomLaserTurretStateSimple,
    DeleteTileBuffExpr,
    DeleteTileBuffSimple,
    AddTileBuffExpr,
    AddTileBuffSimple,
    ModifyTileBuffExpr,
    ModifyTileBuffSimple,

    PersistentShowText,
    PersistentPlayBgm,
    PersistentModifyPlayerAttribute,
    PersistentModifyUnitAttribute,
}

export const TypeDict = new Map<CategoryId, ActionTypeId[]>([
    [CategoryId.UnitSimple, [
        ActionTypeId.AddUnitOnMapSimple,
        ActionTypeId.FillUnitOnMapSimple,
        ActionTypeId.FillUnitLoadedSimple,
        ActionTypeId.DestroyUnitSimple,
        ActionTypeId.SetUnitTypeSimple,
        ActionTypeId.SetUnitOwnershipSimple,
        ActionTypeId.SetUnitPositionSimple,
        ActionTypeId.SetUnitStateSimple,
        ActionTypeId.AddUnitBuffSimple,
        ActionTypeId.ModifyUnitBuffSimple,
        ActionTypeId.DeleteUnitBuffSimple,
    ]],
    [CategoryId.UnitExpr, [
        ActionTypeId.FillUnitOnMapExpr,
        ActionTypeId.FillUnitLoadedExpr,
        ActionTypeId.DestroyUnitExpr,
        ActionTypeId.SetUnitTypeExpr,
        ActionTypeId.SetUnitOwnershipExpr,
        ActionTypeId.SetUnitPositionExpr,
        ActionTypeId.SetUnitStateExpr,
        ActionTypeId.PersistentModifyUnitAttribute,
    ]],
    [CategoryId.TileSimple, [
        // ActionType.DeprecatedSetTileType,
        ActionTypeId.SetTileTypeSimple,
        ActionTypeId.SetTileStateSimple,
        ActionTypeId.SetCustomBuildingStateSimple,
        ActionTypeId.SetCustomCrystalStateSimple,
        ActionTypeId.SetCustomCannonStateSimple,
        ActionTypeId.SetCustomLaserTurretStateSimple,
        ActionTypeId.AddTileBuffSimple,
        ActionTypeId.ModifyTileBuffSimple,
        ActionTypeId.DeleteTileBuffSimple,
    ]],
    [CategoryId.TileExpr, [
        ActionTypeId.SetTileTypeExpr,
        ActionTypeId.SetTileStateExpr,
        ActionTypeId.SetCustomBuildingStateExpr,
        ActionTypeId.SetCustomCrystalStateExpr,
        ActionTypeId.SetCustomCannonStateExpr,
        ActionTypeId.SetCustomLaserTurretStateExpr,
        ActionTypeId.AddTileBuffExpr,
        ActionTypeId.ModifyTileBuffExpr,
        ActionTypeId.DeleteTileBuffExpr,
    ]],
    [CategoryId.PlayerSimple, [
        ActionTypeId.SetPlayerStateSimple,
    ]],
    [CategoryId.PlayerExpr, [
        ActionTypeId.SetPlayerStateExpr,
        ActionTypeId.PersistentModifyPlayerAttribute,
    ]],
    [CategoryId.WeatherAndFogSimple, [
        ActionTypeId.SetWeatherSimple,
        ActionTypeId.SetForceFogCodeSimple,
    ]],
    [CategoryId.WeatherAndFogExpr, [
        ActionTypeId.SetWeatherExpr,
        ActionTypeId.SetForceFogCodeExpr,
        ActionTypeId.SetUnitMovePathVisibility,
    ]],
    [CategoryId.ImageAndSoundSimple, [
        ActionTypeId.SetViewpointSimple,
        ActionTypeId.BigDialogueSimple,
        ActionTypeId.SmallDialogueSimple,
        ActionTypeId.PlayBgm,
        ActionTypeId.PlaySfx,
        ActionTypeId.PersistentShowText,
        ActionTypeId.PersistentPlayBgm,
    ]],
    [CategoryId.ImageAndSoundExpr, [
        ActionTypeId.SetViewpointExpr,
    ]],
    [CategoryId.MiscSimple, [
        ActionTypeId.StopPersistentAction,
    ]],
    [CategoryId.MiscExpr, [
        ActionTypeId.SetTaskObjectiveState,
        ActionTypeId.SetCustomCounters,
    ]],
]);

// eslint-disable-next-line no-shadow
export const enum MaxCounts {
    PerMap      = 200,
    PerEvent    = 20,
}

// eslint-disable-next-line no-shadow
export const enum InterchangeableTypeId {
    NotInterchangeable,
    Persistent,
    Instant,
}
export const PersistentInterchangeableActionTypeArray = [
    ActionTypeId.PersistentShowText,
    ActionTypeId.PersistentPlayBgm,
];
export const InstantInterchangeableActionTypeArray = [
    ActionTypeId.BigDialogueSimple,
    ActionTypeId.SmallDialogueSimple,
    ActionTypeId.PlayBgm,
    ActionTypeId.PlaySfx,
    ActionTypeId.SetViewpointExpr,
    ActionTypeId.SetViewpointSimple,
];

// eslint-disable-next-line no-shadow
export const enum BuffEndTimeModificationMode {
    DoNotChange                     = 0,
    Delete                          = 1,
    SetAbsoluteValue                = 2,
    AddOffset                       = 3,
    SetValueRelativeToCurrentTime   = 4,
}
export const AllBuffEndTimeModificationModeArray = [
    BuffEndTimeModificationMode.DoNotChange,
    BuffEndTimeModificationMode.Delete,
    BuffEndTimeModificationMode.SetAbsoluteValue,
    BuffEndTimeModificationMode.AddOffset,
    BuffEndTimeModificationMode.SetValueRelativeToCurrentTime,
];
