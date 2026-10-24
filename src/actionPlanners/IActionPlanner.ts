import type * as ActionPlannersConstants from "./Constants.ts";
import type * as ActionPlannersIActionPlannerView from "./IActionPlannerView.ts";
import type * as ActionPlannersTypes from "./Types.ts";
import type * as AuxiliaryTypesAttackableArea from "../auxiliaryTypes/AttackableArea.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovableArea from "../auxiliaryTypes/MovableArea.ts";
import type * as AuxiliaryTypesMovePathNode from "../auxiliaryTypes/MovePathNode.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as ProtoSchemaCommonProtoStructureMovePath from "../proto/schema/CommonProto/Structure/MovePath.ts";
import type * as TilesITile from "../tiles/ITile.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";

type GridIndex          = AuxiliaryTypesGridIndex.GridIndex;
type MovableArea        = AuxiliaryTypesMovableArea.MovableArea;
type MovePathNode       = AuxiliaryTypesMovePathNode.MovePathNode;
type AttackableArea     = AuxiliaryTypesAttackableArea.AttackableArea;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IBwTile            = TilesITile.ITile;
type IBwUnit            = UnitsIUnit.IUnit;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;
type ApStateId          = ActionPlannersConstants.StateId;

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
    getView(): ActionPlannersIActionPlannerView.IActionPlannerView;
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

    getChosenUnitsForDrop(): ActionPlannersTypes.ChosenUnitForDrop[];
    pushBackChosenUnitForDrop(data: ActionPlannersTypes.ChosenUnitForDrop): void;
    popBackChosenUnitForDrop(): ActionPlannersTypes.ChosenUnitForDrop;
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

    generateProtoMovePath(): ProtoSchemaCommonProtoStructureMovePath.MovePath;

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
