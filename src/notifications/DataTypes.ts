import {
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwWar,
    type PlayerRules_Constants,
    type Players_IPlayer,
    type Tiles_ITile,
    type Units_IUnit,
} from "../internal.ts";

export type BwPlayerFundChanged                                 = { player: Players_IPlayer.IPlayer };
export type BwCoIdChanged                                       = { player: Players_IPlayer.IPlayer };
export type BwCursorGridIndexChanged                            = { cursor: BaseWar_Interface_IBwCursor.IBwCursor };
export type BwTileHasLocationIdSet                              = { tile: Tiles_ITile.ITile };
export type BwTileIsHighlightedChanged                          = { tile: Tiles_ITile.ITile };
export type BwCursorTapped                                      = { current: AuxiliaryTypes_GridIndex.GridIndex, tappedOn: AuxiliaryTypes_GridIndex.GridIndex };
export type BwCursorDragged                                     = { current: AuxiliaryTypes_GridIndex.GridIndex, draggedTo: AuxiliaryTypes_GridIndex.GridIndex };
export type BwFieldZoomedByTouch                                = { previous: AuxiliaryTypes_AuxiliaryTypes.TouchPoints, current: AuxiliaryTypes_AuxiliaryTypes.TouchPoints };
export type BwFieldDragged                                      = { previous: AuxiliaryTypes_AuxiliaryTypes.Point, current: AuxiliaryTypes_AuxiliaryTypes.Point };
export type BwUnitChanged                                       = { gridIndex: AuxiliaryTypes_GridIndex.GridIndex };
export type BwTileChanged                                       = { gridIndex: AuxiliaryTypes_GridIndex.GridIndex };
export type BwTileBuffChanged                                   = { tile: Tiles_ITile.ITile };
export type BwUnitBuffChanged                                   = { unit: Units_IUnit.IUnit };
export type ScrCreatePlayerInfoChanged                          = { playerIndex: number };
export type WarCreator_PlayerInfoChanged                        = { playerIndex: number };
export type GridMarkAdded                                       = { war: BaseWar_Interface_IBwWar.IBwWar, gridId: number };
export type GridMarkDeleted                                     = { war: BaseWar_Interface_IBwWar.IBwWar, gridId: number };
export type GridMarkListChanged                                 = { war: BaseWar_Interface_IBwWar.IBwWar };
export type HiddenGridMarkTypeIdListChanged                     = { war: BaseWar_Interface_IBwWar.IBwWar };
export type BwPlayerPlayerIndexArrayForShowMarkedGridUpdated    = { player: Players_IPlayer.IPlayer };
export type RuleEditor_PlayerRuleChanged                        = { playerIndex: number, ruleType: PlayerRules_Constants.RuleTypeId };
