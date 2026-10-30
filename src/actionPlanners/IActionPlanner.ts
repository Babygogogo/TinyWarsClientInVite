import {
    type AuxiliaryTypes_AttackableArea,
    type ActionPlanners_Types,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlannerView,
    type BaseWar_Interface_IBwWar,
    type Tiles_ITile,
    type Units_IUnit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_MovableArea,
    type AuxiliaryTypes_MovePathNode,
    type ActionPlanners_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { MovePath } from "../proto/schema/CommonProto/Structure/MovePath.ts";

export interface IActionPlanner {
    init(mapSize: AuxiliaryTypes_MapSize.MapSize): void;
    fastInit(): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    getPlayerIndexLoggedIn(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    getSelfPlayerIndexSet(): Set<number>;

    clearAllDataForStates(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for setting common state.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getStateId(): ActionPlanners_Constants.StateId;
    getPreviousStateId(): ActionPlanners_Constants.StateId;
    setStateId(state: ActionPlanners_Constants.StateId): void;

    cancelCurrentState(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): ActionPlanners_IActionPlannerView.IActionPlannerView;
    updateView(): void;

    checkCanControlUnit(unit: Units_IUnit.IUnit): boolean;

    getMapSize(): AuxiliaryTypes_MapSize.MapSize;

    checkIsStateRequesting(): boolean;

    getFocusUnit(): Units_IUnit.IUnit | null;
    getFocusUnitOnMap(): Units_IUnit.IUnit | null;
    setFocusUnitOnMap(unit: Units_IUnit.IUnit): void;
    clearFocusUnitOnMap(): void;

    getFocusUnitLoaded(): Units_IUnit.IUnit | null;
    setFocusUnitLoaded(unit: Units_IUnit.IUnit): void;
    clearFocusUnitLoaded(): void;
    getUnitIdForFocusUnitLoaded(): number | null;

    getAvailableDropDestinations(): AuxiliaryTypes_GridIndex.GridIndex[] | null;
    setAvailableDropDestinations(destinations: AuxiliaryTypes_GridIndex.GridIndex[]): void;
    clearAvailableDropDestinations(): void;

    getChoosingUnitForDrop(): Units_IUnit.IUnit | null;
    setChoosingUnitForDrop(unit: Units_IUnit.IUnit): void;
    clearChoosingUnitForDrop(): void;

    getChosenUnitsForDrop(): ActionPlanners_Types.ChosenUnitForDrop[];
    pushBackChosenUnitForDrop(data: ActionPlanners_Types.ChosenUnitForDrop): void;
    popBackChosenUnitForDrop(): ActionPlanners_Types.ChosenUnitForDrop;
    clearChosenUnitsForDrop(): void;
    getChosenDropDestinations(): AuxiliaryTypes_GridIndex.GridIndex[];

    getMovableArea(): AuxiliaryTypes_MovableArea.MovableArea | null;
    resetMovableArea(): void;

    getAttackableArea(): AuxiliaryTypes_AttackableArea.AttackableArea | null;
    resetAttackableArea(): void;

    getAttackableGridsForUnitWeapon(): AuxiliaryTypes_GridIndex.GridIndex[] | null;
    setAttackableGridsForUnitWeapon(grids: AuxiliaryTypes_GridIndex.GridIndex[]): void;
    checkHasAttackableGridForUnitWeapon(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;
    createAttackableGridsForUnitWeapon(): AuxiliaryTypes_GridIndex.GridIndex[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for co power targets.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getCoActiveSkillTypeId(): number | null;
    setCoActiveSkillSkillType(skillType: number): void;
    clearCoActiveSkillSkillType(): void;

    getMaxCoActiveSkillTargetsCount(): number | null;

    getCoActiveSkillTargetGridIndexArray(): AuxiliaryTypes_GridIndex.GridIndex[] | null;
    checkHasCoActiveSkillTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;
    addCoActiveSkillTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    deleteCoActiveSkillTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    clearCoActiveSkillTargetGridIndexArray(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for crush.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitCrushTargetGridIndex(): AuxiliaryTypes_GridIndex.GridIndex | null;
    setUnitCrushTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    clearUnitCrushTargetGridIndex(): void;
    getUnitCrushCandidateGridIndexArray(): AuxiliaryTypes_GridIndex.GridIndex[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for repair.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitRepairTargetGridIndex(): AuxiliaryTypes_GridIndex.GridIndex | null;
    setUnitRepairTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    clearUnitRepairTargetGridIndex(): void;
    getUnitRepairCandidateGridIndexArray(): AuxiliaryTypes_GridIndex.GridIndex[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for move path.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getMovePath(): AuxiliaryTypes_MovePathNode.MovePathNode[];
    resetMovePathAsShortest(destination: AuxiliaryTypes_GridIndex.GridIndex): void;
    setMovePath(movePath: AuxiliaryTypes_MovePathNode.MovePathNode[]): void;

    getMovePathDestination(): AuxiliaryTypes_MovePathNode.MovePathNode;
    getFocusUnitDestination(): AuxiliaryTypes_GridIndex.GridIndex;
    updateMovePathByDestination(destination: AuxiliaryTypes_GridIndex.GridIndex): void;

    generateProtoMovePath(): MovePath;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing attackable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitsForPreviewingAttackableArea(): Map<number, Units_IUnit.IUnit>;
    getTilesForPreviewingAttackableArea(): Set<Tiles_ITile.ITile>;

    getAreaForPreviewingAttackableArea(): AuxiliaryTypes_AttackableArea.AttackableArea;
    clearDataForPreviewingAttackableArea(): void;
    addUnitForPreviewAttackableArea(unit: Units_IUnit.IUnit): void;
    addTileForPreviewAttackableArea(tile: Tiles_ITile.ITile): void;

    updateAreaForPreviewingAttackableArea(unit: Units_IUnit.IUnit): void;

    getIsIgnoreAllyForPreviewingAttackableArea(): boolean;
    setIsIgnoreAllyForPreviewingAttackableArea(isIgnore: boolean): void;

    getIsIgnoreEnemyForPreviewingAttackableArea(): boolean;
    setIsIgnoreEnemyForPreviewingAttackableArea(isIgnore: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing movable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitForPreviewingMovableArea(): Units_IUnit.IUnit | null;
    getAreaForPreviewingMovableArea(): AuxiliaryTypes_MovableArea.MovableArea | null;
    setUnitForPreviewingMovableArea(unit: Units_IUnit.IUnit): void;
    clearDataForPreviewingMovableArea(): void;
    resetAreaForPreviewingMovableArea(): void;

    getIsIgnoreEnemyForPreviewingMovableArea(): boolean;
    setIsIgnoreEnemyForPreviewingMovableArea(isIgnore: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing visible area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitForPreviewingVisibleArea(): Units_IUnit.IUnit | null;
    getAreaForPreviewingVisible(): AuxiliaryTypes_GridIndex.GridIndex[] | null;
    clearDataForPreviewingVisibleArea(): void;
    setUnitForPreviewingVisibleArea(unit: Units_IUnit.IUnit): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkCanFocusUnitOnMapAttackTarget(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;

    calculateAvailableDropDestination(unitForDrop: Units_IUnit.IUnit, chosenDropDestinations: AuxiliaryTypes_GridIndex.GridIndex[]): AuxiliaryTypes_GridIndex.GridIndex[];
}
