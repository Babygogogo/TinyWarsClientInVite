import type { StateId } from "./Constants.ts";
import type { IActionPlannerView } from "./IActionPlannerView.ts";
import type { ChosenUnitForDrop } from "./Types.ts";
import type { AttackableArea as AuxiliaryTypesAttackableArea } from "../auxiliaryTypes/AttackableArea.ts";
import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { MovableArea as AuxiliaryTypesMovableArea } from "../auxiliaryTypes/MovableArea.ts";
import type { MovePathNode as AuxiliaryTypesMovePathNode } from "../auxiliaryTypes/MovePathNode.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../baseWar/interface/IBwWar.ts";
import type { MovePath } from "../proto/schema/CommonProto/Structure/MovePath.ts";
import type { ITile } from "../tiles/ITile.ts";
import type { IUnit } from "../units/IUnit.ts";

type GridIndex          = AuxiliaryTypesGridIndex;
type MovableArea        = AuxiliaryTypesMovableArea;
type MovePathNode       = AuxiliaryTypesMovePathNode;
type AttackableArea     = AuxiliaryTypesAttackableArea;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type IBwTile            = ITile;
type IBwUnit            = IUnit;
type IBwWar             = BaseWarInterfaceIBwWar;
type ApStateId          = StateId;

export interface IActionPlanner {
    init(): void;
    fastInit(): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    getWar(): IBwWar;

    getPlayerIndexLoggedIn(): Undefinable<number>;
    getSelfPlayerIndexSet(): Set<number>;

    clearAllDataForStates(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for setting common state.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getStateId(): ApStateId;
    getPreviousStateId(): ApStateId;
    setStateId(state: ApStateId): void;

    cancelCurrentState(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): IActionPlannerView;
    updateView(): void;

    checkCanControlUnit(unit: IBwUnit): boolean;

    checkIsStateRequesting(): boolean;

    getFocusUnit(): IBwUnit | null;
    getFocusUnitOnMap(): IBwUnit | null;
    setFocusUnitOnMap(unit: IBwUnit): void;
    clearFocusUnitOnMap(): void;

    getFocusUnitLoaded(): IBwUnit | null;
    setFocusUnitLoaded(unit: IBwUnit): void;
    clearFocusUnitLoaded(): void;
    getUnitIdForFocusUnitLoaded(): number | null;

    getAvailableDropDestinations(): GridIndex[] | null;
    setAvailableDropDestinations(destinations: GridIndex[]): void;
    clearAvailableDropDestinations(): void;

    getChoosingUnitForDrop(): IBwUnit | null;
    setChoosingUnitForDrop(unit: IBwUnit): void;
    clearChoosingUnitForDrop(): void;

    getChosenUnitsForDrop(): ChosenUnitForDrop[];
    pushBackChosenUnitForDrop(data: ChosenUnitForDrop): void;
    popBackChosenUnitForDrop(): ChosenUnitForDrop;
    clearChosenUnitsForDrop(): void;
    getChosenDropDestinations(): GridIndex[];

    getMovableArea(): MovableArea | null;
    resetMovableArea(): void;

    getAttackableArea(): AttackableArea | null;
    resetAttackableArea(): void;

    getAttackableGridsForUnitWeapon(): GridIndex[] | null;
    setAttackableGridsForUnitWeapon(grids: GridIndex[]): void;
    checkHasAttackableGridForUnitWeapon(gridIndex: GridIndex): boolean;
    createAttackableGridsForUnitWeapon(): GridIndex[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for co power targets.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getCoActiveSkillTypeId(): number | null;
    setCoActiveSkillSkillType(skillType: number): void;
    clearCoActiveSkillSkillType(): void;

    getMaxCoActiveSkillTargetsCount(): number | null;

    getCoActiveSkillTargetGridIndexArray(): GridIndex[] | null;
    checkHasCoActiveSkillTargetGridIndex(gridIndex: GridIndex): boolean;
    addCoActiveSkillTargetGridIndex(gridIndex: GridIndex): void;
    deleteCoActiveSkillTargetGridIndex(gridIndex: GridIndex): void;
    clearCoActiveSkillTargetGridIndexArray(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for crush.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitCrushTargetGridIndex(): GridIndex | null;
    setUnitCrushTargetGridIndex(gridIndex: GridIndex): void;
    clearUnitCrushTargetGridIndex(): void;
    getUnitCrushCandidateGridIndexArray(): GridIndex[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for repair.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitRepairTargetGridIndex(): GridIndex | null;
    setUnitRepairTargetGridIndex(gridIndex: GridIndex): void;
    clearUnitRepairTargetGridIndex(): void;
    getUnitRepairCandidateGridIndexArray(): GridIndex[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for move path.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getMovePath(): MovePathNode[];
    resetMovePathAsShortest(destination: GridIndex): void;
    setMovePath(movePath: MovePathNode[]): void;

    getMovePathDestination(): MovePathNode;
    getFocusUnitDestination(): GridIndex;
    updateMovePathByDestination(destination: GridIndex): void;

    generateProtoMovePath(): MovePath;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing attackable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitsForPreviewingAttackableArea(): Map<number, IBwUnit>;
    getTilesForPreviewingAttackableArea(): Set<IBwTile>;

    getAreaForPreviewingAttackableArea(): AttackableArea;
    clearDataForPreviewingAttackableArea(): void;
    addUnitForPreviewAttackableArea(unit: IBwUnit): void;
    addTileForPreviewAttackableArea(tile: IBwTile): void;

    updateAreaForPreviewingAttackableArea(unit: IBwUnit): void;

    getIsIgnoreAllyForPreviewingAttackableArea(): boolean;
    setIsIgnoreAllyForPreviewingAttackableArea(isIgnore: boolean): void;

    getIsIgnoreEnemyForPreviewingAttackableArea(): boolean;
    setIsIgnoreEnemyForPreviewingAttackableArea(isIgnore: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing movable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitForPreviewingMovableArea(): IBwUnit | null;
    getAreaForPreviewingMovableArea(): MovableArea | null;
    setUnitForPreviewingMovableArea(unit: IBwUnit): void;
    clearDataForPreviewingMovableArea(): void;
    resetAreaForPreviewingMovableArea(): void;

    getIsIgnoreEnemyForPreviewingMovableArea(): boolean;
    setIsIgnoreEnemyForPreviewingMovableArea(isIgnore: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing visible area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getUnitForPreviewingVisibleArea(): IBwUnit | null;
    getAreaForPreviewingVisible(): GridIndex[] | null;
    clearDataForPreviewingVisibleArea(): void;
    setUnitForPreviewingVisibleArea(unit: IBwUnit): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkCanFocusUnitOnMapAttackTarget(gridIndex: GridIndex): boolean;

    calculateAvailableDropDestination(unitForDrop: IBwUnit, chosenDropDestinations: GridIndex[]): GridIndex[];
}
