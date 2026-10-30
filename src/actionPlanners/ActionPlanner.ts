import {
    StateId,
    StateIdsForExecuting,
    StateIdsForRequesting,
} from "./Constants.ts";
import type { IActionPlanner } from "./IActionPlanner.ts";
import type { IActionPlannerView } from "./IActionPlannerView.ts";
import { ChoosingCoActiveSkillTarget } from "./states/ChoosingCoActiveSkillTarget.ts";
import { ChoosingTileProductionTarget } from "./states/ChoosingTileProductionTarget.ts";
import { ChoosingUnitAction } from "./states/ChoosingUnitAction.ts";
import { ChoosingUnitAttackTarget } from "./states/ChoosingUnitAttackTarget.ts";
import { ChoosingUnitCrushTarget } from "./states/ChoosingUnitCrushTarget.ts";
import { ChoosingUnitDropDestination } from "./states/ChoosingUnitDropDestination.ts";
import { ChoosingUnitFlareDestination } from "./states/ChoosingUnitFlareDestination.ts";
import { ChoosingUnitMovePath } from "./states/ChoosingUnitMovePath.ts";
import { ChoosingUnitRepairTarget } from "./states/ChoosingUnitRepairTarget.ts";
import { ChoosingUnitSiloDestination } from "./states/ChoosingUnitSiloDestination.ts";
import { ExecutingAction } from "./states/ExecutingAction.ts";
import { Idle } from "./states/Idle.ts";
import type { IState } from "./states/IState.ts";
import { PreviewingTileAttackableArea } from "./states/PreviewingTileAttackableArea.ts";
import { PreviewingUnitAttackableArea } from "./states/PreviewingUnitAttackableArea.ts";
import { PreviewingUnitMovableArea } from "./states/PreviewingUnitMovableArea.ts";
import { PreviewingUnitVisibleArea } from "./states/PreviewingUnitVisibleArea.ts";
import { RequestingPlayerDeleteUnit } from "./states/RequestingPlayerDeleteUnit.ts";
import { RequestingPlayerEndTurn } from "./states/RequestingPlayerEndTurn.ts";
import { RequestingPlayerProduceUnit } from "./states/RequestingPlayerProduceUnit.ts";
import { RequestingPlayerSurrender } from "./states/RequestingPlayerSurrender.ts";
import { RequestingPlayerUseCoActiveSkill } from "./states/RequestingPlayerUseCoActiveSkill.ts";
import { RequestingPlayerVoteForDraw } from "./states/RequestingPlayerVoteForDraw.ts";
import { RequestingUnitAttackTile } from "./states/RequestingUnitAttackTile.ts";
import { RequestingUnitAttackUnit } from "./states/RequestingUnitAttackUnit.ts";
import { RequestingUnitBeLoaded } from "./states/RequestingUnitBeLoaded.ts";
import { RequestingUnitBoardedByCo } from "./states/RequestingUnitBoardedByCo.ts";
import { RequestingUnitBuildTile } from "./states/RequestingUnitBuildTile.ts";
import { RequestingUnitCaptureTile } from "./states/RequestingUnitCaptureTile.ts";
import { RequestingUnitCrushUnit } from "./states/RequestingUnitCrushUnit.ts";
import { RequestingUnitDive } from "./states/RequestingUnitDive.ts";
import { RequestingUnitDrop } from "./states/RequestingUnitDrop.ts";
import { RequestingUnitJoin } from "./states/RequestingUnitJoin.ts";
import { RequestingUnitLaunchFlare } from "./states/RequestingUnitLaunchFlare.ts";
import { RequestingUnitLaunchSilo } from "./states/RequestingUnitLaunchSilo.ts";
import { RequestingUnitProduceUnit } from "./states/RequestingUnitProduceUnit.ts";
import { RequestingUnitRepairUnit } from "./states/RequestingUnitRepairUnit.ts";
import { RequestingUnitSelfDetonate } from "./states/RequestingUnitSelfDetonate.ts";
import { RequestingUnitSupply } from "./states/RequestingUnitSupply.ts";
import { RequestingUnitSurface } from "./states/RequestingUnitSurface.ts";
import { RequestingUnitUseCoActiveSkill } from "./states/RequestingUnitUseCoActiveSkill.ts";
import { RequestingUnitWait } from "./states/RequestingUnitWait.ts";
import type { ChosenUnitForDrop } from "./Types.ts";
import { AttackableArea } from "../auxiliaryTypes/AttackableArea.ts";
import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import { MovableArea } from "../auxiliaryTypes/MovableArea.ts";
import { MovePathNode } from "../auxiliaryTypes/MovePathNode.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { DataForUnitAction } from "../baseWar/model/BwTypes.ts";
import type { OpenData } from "../baseWar/view/BwUnitActionsPanel.ts";
import { SkillTypeId } from "../coSkills/Constants.ts";
import { getPowerSkillTargetsCount } from "../coSkills/utils/Common.ts";
import { show } from "../FloatText.ts";
import {
    getActionPlannerViewClass,
    getMpwWarClass,
    getHrwWarClass,
    getMeWarClass,
    getRwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../gameHelpers/GhFactory.ts";
import { getDict } from "../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../gamePanels/Manager.ts";
import {
    getExisted,
    newError,
} from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../lang/Utils.ts";
import { log } from "../Logger.ts";
import type { BwCursorDragged } from "../notifications/DataTypes.ts";
import {
    addEventListeners,
    removeEventListeners,
    dispatch,
} from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { Listener } from "../notifications/Types.ts";
import { MovePath } from "../proto/schema/CommonProto/Structure/MovePath.ts";
import type { ITile } from "../tiles/ITile.ts";
import {
    ActionTypeId,
    ActionStateId,
} from "../units/Constants.ts";
import type { IUnit } from "../units/IUnit.ts";
import {
    getSelfUserId,
    getSelfSettingsIsAutoScrollMap,
} from "../users/Model.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import type { Event } from "../egret/Egret.ts";
import {
    checkIsUnitOnMapVisibleToTeam,
    checkIsUnitOnMapVisibleToTeams,
} from "../visibilities/Utils.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";

export class ActionPlanner implements IActionPlanner {
    private readonly _view                      = new (getActionPlannerViewClass())();

    private _war?                               : IBwWar;
    private _mapSize?                           : MapSize;

    private _stateId                            = StateId.Idle;
    private _prevStateId                        = StateId.Idle;

    private _focusUnitOnMap                     : IUnit | null = null;
    private _focusUnitLoaded                    : IUnit | null = null;
    private _choosingUnitForDrop                : IUnit | null = null;
    private _chosenUnitsForDrop                 : ChosenUnitForDrop[] = [];
    private _availableDropDestinations          : GridIndex[] | null = null;
    private _movableArea                        : MovableArea | null = null;
    private _attackableArea                     : AttackableArea | null = null;
    private _attackableGridsForUnitWeapon       : GridIndex[] | null = null;
    private _movePath                           : MovePathNode[] = [];
    private _coActiveSkillSkillType             : SkillTypeId | null = null;
    private _coActiveSkillTargetGridIndexArray  : GridIndex[] | null = null;
    private _unitCrushTargetGridIndex           : GridIndex | null = null;
    private _unitRepairTargetGridIndex          : GridIndex | null = null;

    private _unitsForPreviewAttack              = new Map<number, IUnit>();
    private _tilesForPreviewAttack              = new Set<ITile>();
    private _areaForPreviewAttack               = new AttackableArea([]);
    private _unitForPreviewMove                 : IUnit | null = null;
    private _areaForPreviewMove                 : MovableArea | null = null;
    private _unitForPreviewVisible              : IUnit | null = null;
    private _areaForPreviewVisible              : GridIndex[] | null = null;

    private _isIgnoreAllyForPreviewAttack       = true;
    private _isIgnoreEnemyForPreviewAttack      = true;
    private _isIgnoreEnemyForPreviewMove        = true;

    private _notifyListeners: Listener[] = [
        { type: TypeId.BwCursorTapped,      callback: this._onNotifyBwCursorTapped },
        { type: TypeId.BwCursorDragged,     callback: this._onNotifyBwCursorDragged },
        { type: TypeId.BwCursorDragEnded,   callback: this._onNotifyBwCursorDragEnded },
    ];

    public init(mapSize: MapSize): void {
        this._setMapSize(mapSize.clone());

        this.getView().init(this);
    }
    public fastInit(): void {
        this.getView().fastInit(this);
    }

    public startRunning(war: IBwWar): void {
        this._war = war;

        Idle.getInstance().apply(this);
        addEventListeners(this._notifyListeners, this);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    public getWar(): IBwWar {
        return getExisted(this._war, ClientErrorCode.ActionPlanner_GetWar_00);
    }

    public getPlayerIndexLoggedIn(): Undefinable<number> {
        const war = this.getWar();
        if (war instanceof getMpwWarClass()) {
            return war.getPlayerIndexLoggedIn();
        } else {
            return undefined;
        }
    }
    public getSelfPlayerIndexSet(): Set<number> {
        const war = this.getWar();
        if (war instanceof getHrwWarClass()) {
            return new Set();

        } else if (war instanceof getMeWarClass()) {
            return new Set();

        } else if (war instanceof getMpwWarClass()) {
            const playerIndex = this.getPlayerIndexLoggedIn();
            return playerIndex == null ? new Set() : new Set([playerIndex]);

        } else if (war instanceof getRwWarClass()) {
            return new Set();

        } else if (war instanceof getSpwWarClass()) {
            const playerIndexSet = new Set<number>();
            for (const [playerIndex, player] of this.getWar().getPlayerManager().getAllPlayersDict()) {
                if ((!player.checkIsNeutral()) && (player.getUserId() != null)) {
                    playerIndexSet.add(playerIndex);
                }
            }

            return playerIndexSet;

        } else if (war instanceof getTwWarClass()) {
            return new Set();

        } else {
            throw newError(`Invalid war.`);
        }
    }
    public checkCanControlUnit(unit: IUnit): boolean {
        const war = this.getWar();
        if (war instanceof getHrwWarClass()) {
            return false;

        } else if (war instanceof getMeWarClass()) {
            return false;

        } else if (war instanceof getMpwWarClass()) {
            const playerInTurn = war.getPlayerInTurn();
            return (playerInTurn.getUserId() === getSelfUserId())
                && (playerInTurn.getPlayerIndex() === unit.getPlayerIndex());

        } else if (war instanceof getRwWarClass()) {
            return false;

        } else if (war instanceof getSpwWarClass()) {
            const playerInTurn = war.getPlayerInTurn();
            return (unit.getPlayerIndex() === playerInTurn.getPlayerIndex())
                && (playerInTurn.getUserId() != null);

        } else if (war instanceof getTwWarClass()) {
            return false;

        } else {
            throw newError(`Invalid war.`);
        }
    }

    public clearAllDataForStates(): void {
        this.clearFocusUnitOnMap();
        this._clearMovableArea();
        this.setMovePath([]);
        this._clearAttackableArea();
        this.clearFocusUnitLoaded();
        this.clearChoosingUnitForDrop();
        this.clearChosenUnitsForDrop();
        this.clearAvailableDropDestinations();
        this.clearUnitCrushTargetGridIndex();
        this.clearUnitRepairTargetGridIndex();
        this.clearCoActiveSkillSkillType();
        this.clearCoActiveSkillTargetGridIndexArray();
        this.clearDataForPreviewingAttackableArea();
        this.clearDataForPreviewingMovableArea();
        this.clearDataForPreviewingVisibleArea();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyBwCursorTapped(): void {
        const war       = this.getWar();
        const gridIndex = war.getCursor().getGridIndex();
        if (getSelfSettingsIsAutoScrollMap()) {
            war.getView().tweenGridToCentralArea(gridIndex);
        }

        const currStateId = this.getStateId();
        const nextStateId = getState(currStateId).getNextStateIdOnTap(this, gridIndex);
        if (nextStateId === currStateId) {
            if ((checkIsExecuting(currStateId))    ||
                (checkIsRequesting(currStateId))
            ) {
                return;
            }
        }

        getState(nextStateId).doApplyOnTap(this, gridIndex);
    }

    private _onNotifyBwCursorDragged(e: Event): void {
        const war = this.getWar();
        if (getSelfSettingsIsAutoScrollMap()) {
            war.getView().tweenGridToCentralArea((e.data as BwCursorDragged).draggedTo);
        }

        const currStateId = this.getStateId();
        const nextStateId = getState(currStateId).getNextStateIdOnDrag(this);
        if (nextStateId === currStateId) {
            if ((checkIsExecuting(currStateId))    ||
                (checkIsRequesting(currStateId))
            ) {
                return;
            }
        }

        getState(nextStateId).doApplyOnDrag(this, war.getCursor().getGridIndex());
    }

    private _onNotifyBwCursorDragEnded(): void {
        const gridIndex     = this.getWar().getCursor().getGridIndex();
        const currStateId   = this.getStateId();
        const nextStateId   = getState(currStateId).getNextStateIdOnDragEnded(this, gridIndex);
        if (nextStateId !== currStateId) {
            getState(nextStateId).doApplyOnDragEnded(this, gridIndex);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for setting common state.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getStateId(): StateId {
        return this._stateId;
    }
    public getPreviousStateId(): StateId {
        return this._prevStateId;
    }
    public setStateId(stateId: StateId): void {
        const isChanged = this._stateId !== stateId;
        this._prevStateId = this._stateId;
        this._stateId     = stateId;

        log(`ActionPlanner.setStateId() ${stateId}`);
        dispatch(TypeId.ActionPlannerStateSet);
        (isChanged) && (dispatch(TypeId.ActionPlannerStateChanged));
    }

    public cancelCurrentState(): void {
        getState(this.getStateId()).cancel(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): IActionPlannerView {
        return this._view;
    }
    public updateView(): void {
        const war = this.getWar();
        if (war instanceof getHrwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === StateId.ChoosingUnitAction) {
                openPanel(
                    getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                closePanel(getDict().BwUnitActionsPanel);
            }
            if ((currState === StateId.ChoosingUnitMovePath) || (currState === StateId.ChoosingUnitAttackTarget)) {
                openPanel(getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                closePanel(getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof getMeWarClass()) {
            // nothing to do

        } else if (war instanceof getMpwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === StateId.ChoosingUnitAction) {
                openPanel(
                    getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                closePanel(getDict().BwUnitActionsPanel);
            }
            if ((currState === StateId.ChoosingUnitMovePath) || (currState === StateId.ChoosingUnitAttackTarget)) {
                openPanel(getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                closePanel(getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof getRwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === StateId.ChoosingUnitAction) {
                openPanel(
                    getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                closePanel(getDict().BwUnitActionsPanel);
            }
            if ((currState === StateId.ChoosingUnitMovePath) || (currState === StateId.ChoosingUnitAttackTarget)) {
                openPanel(getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                closePanel(getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof getSpwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === StateId.ChoosingUnitAction) {
                openPanel(
                    getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                closePanel(getDict().BwUnitActionsPanel);
            }
            if ((currState === StateId.ChoosingUnitMovePath) || (currState === StateId.ChoosingUnitAttackTarget)) {
                openPanel(getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                closePanel(getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof getTwWarClass()) {
            // nothing to do

        } else {
            throw newError(`Invalid war.`);
        }
    }

    private _setMapSize(size: MapSize): void {
        this._mapSize = size;
    }
    public getMapSize(): MapSize {
        return getExisted(this._mapSize);
    }

    public checkIsStateRequesting(): boolean {
        return checkIsRequesting(this.getStateId());
    }

    public getFocusUnit(): IUnit | null {
        return this.getFocusUnitLoaded() || this.getFocusUnitOnMap();
    }
    public getFocusUnitOnMap(): IUnit | null {
        return this._focusUnitOnMap;
    }
    public setFocusUnitOnMap(unit: IUnit): void {
        this._focusUnitOnMap = unit;
    }
    public clearFocusUnitOnMap(): void {
        this._focusUnitOnMap = null;
    }

    public getFocusUnitLoaded(): IUnit | null {
        return this._focusUnitLoaded;
    }
    public setFocusUnitLoaded(unit: IUnit): void {
        this._focusUnitLoaded = unit;
    }
    public clearFocusUnitLoaded(): void {
        this._focusUnitLoaded = null;
    }
    public getUnitIdForFocusUnitLoaded(): number | null {
        return this.getFocusUnitLoaded()?.getUnitId() ?? null;
    }

    public getAvailableDropDestinations(): GridIndex[] | null {
        return this._availableDropDestinations;
    }
    public setAvailableDropDestinations(destinations: GridIndex[]): void {
        this._availableDropDestinations = destinations;
    }
    public clearAvailableDropDestinations(): void {
        this._availableDropDestinations = null;
    }

    public getChoosingUnitForDrop(): IUnit | null {
        return this._choosingUnitForDrop;
    }
    public setChoosingUnitForDrop(unit: IUnit): void {
        this._choosingUnitForDrop = unit;
    }
    public clearChoosingUnitForDrop(): void {
        this._choosingUnitForDrop = null;
    }

    public getChosenUnitsForDrop(): ChosenUnitForDrop[] {
        return this._chosenUnitsForDrop;
    }
    public pushBackChosenUnitForDrop(data: ChosenUnitForDrop): void {
        this._chosenUnitsForDrop.push(data);
    }
    public popBackChosenUnitForDrop(): ChosenUnitForDrop {
        return getExisted(this.getChosenUnitsForDrop().pop());
    }
    public clearChosenUnitsForDrop(): void {
        this._chosenUnitsForDrop.length = 0;
    }
    public getChosenDropDestinations(): GridIndex[] {
        const destinations: GridIndex[] = [];
        for (const data of this.getChosenUnitsForDrop()) {
            destinations.push(data.destination);
        }
        return destinations;
    }

    public getMovableArea(): MovableArea | null {
        return this._movableArea;
    }
    public resetMovableArea(): void {
        const unit = getExisted(this.getFocusUnit());
        this._movableArea = MovableArea.create({
            gridIndex       : unit.getGridIndex(),
            maxMoveCost     : unit.getFinalMoveRange(),
            mapSize         : this.getMapSize(),
            moveCostGetter  : gridIndex => this._getMoveCost(gridIndex, unit)
        });
    }
    private _clearMovableArea(): void {
        this._movableArea = null;
    }

    public getAttackableArea(): AttackableArea | null {
        return this._attackableArea;
    }
    public resetAttackableArea(): void {
        const focusUnit             = getExisted(this.getFocusUnit());
        const canAttackAfterMoving  = focusUnit.getFinalCanAttackAfterMoving();
        const isLoaded              = focusUnit.getLoaderUnitId() != null;
        const beginningGridIndex    = focusUnit.getGridIndex();
        const hasAmmo               = (!!focusUnit.getPrimaryWeaponCurrentAmmo()) || (focusUnit.checkHasSecondaryWeapon());
        const unitMap               = this.getWar().getUnitMap();
        this._setAttackableArea(AttackableArea.create({
            movableArea         : getExisted(this.getMovableArea()),
            mapSize             : this.getMapSize(),
            minAttackRange      : focusUnit.getMinAttackRange(),
            maxAttackRange      : focusUnit.getFinalMaxAttackRange(),
            checkCanAttack      : (moveGridIndex): boolean => {
                if (!hasAmmo) {
                    return false;
                } else {
                    const existingUnit = unitMap.getVisibleUnitOnMap(moveGridIndex);
                    if ((existingUnit) && (existingUnit !== focusUnit)) {
                        return false;
                    } else {
                        const hasMoved = !moveGridIndex.checkIsEqual(beginningGridIndex);
                        return ((!isLoaded) || (hasMoved))
                            && ((canAttackAfterMoving) || (!hasMoved));
                    }
                }
            }
        }));
    }
    private _setAttackableArea(area: AttackableArea): void {
        this._attackableArea = area;
    }
    private _clearAttackableArea(): void {
        this._setAttackableArea(new AttackableArea([]));
    }

    public getAttackableGridsForUnitWeapon(): GridIndex[] | null {
        return this._attackableGridsForUnitWeapon;
    }
    public setAttackableGridsForUnitWeapon(grids: GridIndex[]): void {
        this._attackableGridsForUnitWeapon = grids;
    }
    public checkHasAttackableGridForUnitWeapon(gridIndex: GridIndex): boolean {
        for (const grid of getExisted(this.getAttackableGridsForUnitWeapon())) {
            if (grid.checkIsEqual(gridIndex)) {
                return true;
            }
        }
        return false;
    }
    public createAttackableGridsForUnitWeapon(): GridIndex[] {
        const unit              = getExisted(this.getFocusUnit());
        const minAttackRange    = unit.getMinAttackRange();
        if (minAttackRange == null) {
            return [];
        } else {
            const destination = this.getMovePathDestination().getGridIndex();
            return destination.getGridsWithinDistance({
                minDistance : minAttackRange,
                maxDistance : unit.getFinalMaxAttackRange() ?? 0,
                mapSize     : this.getMapSize(),
                predicate   : (gridIndex) => unit.checkCanAttackTargetAfterMovePath(this.getMovePath().map(v => v.getGridIndex()), gridIndex),
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for co power targets.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getCoActiveSkillTypeId(): number | null {
        return this._coActiveSkillSkillType;
    }
    public setCoActiveSkillSkillType(skillType: number): void {
        this._coActiveSkillSkillType = skillType;
    }
    public clearCoActiveSkillSkillType(): void {
        this._coActiveSkillSkillType = null;
    }

    public getMaxCoActiveSkillTargetsCount(): number | null {
        const skillType = this.getCoActiveSkillTypeId();
        if (skillType == null) {
            return null;
        }

        const cfg = this.getFocusUnitOnMap()?.getPlayer().getCoBasicCfg();
        return (cfg == null)
            ? null
            : getPowerSkillTargetsCount(cfg, skillType);
    }

    public getCoActiveSkillTargetGridIndexArray(): GridIndex[] | null {
        return this._coActiveSkillTargetGridIndexArray;
    }
    public checkHasCoActiveSkillTargetGridIndex(gridIndex: GridIndex): boolean {
        return this.getCoActiveSkillTargetGridIndexArray()?.some(v => v.checkIsEqual(gridIndex)) ?? false;
    }
    public addCoActiveSkillTargetGridIndex(gridIndex: GridIndex): void {
        (this._coActiveSkillTargetGridIndexArray ??= []).push(gridIndex);
    }
    public deleteCoActiveSkillTargetGridIndex(gridIndex: GridIndex): void {
        const arr = this._coActiveSkillTargetGridIndexArray;
        if (arr) {
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i].checkIsEqual(gridIndex)) {
                    arr.splice(i--, 1);
                }
            }
        }
    }
    public clearCoActiveSkillTargetGridIndexArray(): void {
        this._coActiveSkillTargetGridIndexArray = null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for crush.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitCrushTargetGridIndex(): GridIndex | null {
        return this._unitCrushTargetGridIndex;
    }
    public setUnitCrushTargetGridIndex(gridIndex: GridIndex): void {
        this._unitCrushTargetGridIndex = gridIndex.clone();
    }
    public clearUnitCrushTargetGridIndex(): void {
        this._unitCrushTargetGridIndex = null;
    }
    public getUnitCrushCandidateGridIndexArray(): GridIndex[] {
        const focusUnit = this.getFocusUnit();
        if ((!focusUnit)                                                    ||
            (!focusUnit.getTemplateCfg().getCanCrushAdjacentTargetUnit())   ||
            (this.getMovePath().length !== 1)
        ) {
            return [];
        }

        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        const tileMap   = war.getTileMap();
        const moveType  = focusUnit.getMoveTypeId();
        const teamIndex = focusUnit.getTeamIndex();
        return this.getMovePathDestination().getGridIndex().getAdjacentGrids(this.getMapSize())
            .filter(v => {
                if (tileMap.getTile(v).getMoveCostByMoveType(moveType) == null) {
                    return false;
                }

                const targetUnit = unitMap.getVisibleUnitOnMap(v);
                return (!!targetUnit) && (targetUnit.getTeamIndex() !== teamIndex);
            });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for repair.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitRepairTargetGridIndex(): GridIndex | null {
        return this._unitRepairTargetGridIndex;
    }
    public setUnitRepairTargetGridIndex(gridIndex: GridIndex): void {
        this._unitRepairTargetGridIndex = gridIndex.clone();
    }
    public clearUnitRepairTargetGridIndex(): void {
        this._unitRepairTargetGridIndex = null;
    }
    public getUnitRepairCandidateGridIndexArray(): GridIndex[] {
        const focusUnit = this.getFocusUnit();
        if (!focusUnit?.getTemplateCfg().getCanRepairAdjacentTargetUnit()) {
            return [];
        }

        const war           = this.getWar();
        const unitMap       = war.getUnitMap();
        const tileMap       = war.getTileMap();
        const playerIndex   = focusUnit.getPlayerIndex();
        return this.getMovePathDestination().getGridIndex().getAdjacentGrids(this.getMapSize())
            .filter(v => {
                const targetUnit = unitMap.getVisibleUnitOnMap(v);
                return (!!targetUnit)
                    && (targetUnit !== focusUnit)
                    && (targetUnit.getPlayerIndex() === playerIndex)
                    && ((targetUnit.getCurrentHp() < targetUnit.getMaxHp()) || (targetUnit.checkCanBeSupplied()));
            });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for move path.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public resetMovePathAsShortest(destination: GridIndex): void {
        this.setMovePath(getExisted(this.getMovableArea()).createShortestMovePath(destination));
    }
    public setMovePath(movePath: MovePathNode[]): void {
        this._movePath = movePath;
        dispatch(TypeId.ActionPlannerMovePathChanged);
    }
    public getMovePath(): MovePathNode[] {
        return this._movePath;
    }
    public getFocusUnitDestination(): GridIndex {
        const movePath  = this.getMovePath();
        const length    = movePath.length;
        return length ? movePath[length - 1].getGridIndex() : getExisted(this.getFocusUnitOnMap()).getGridIndex();
    }
    public getMovePathDestination(): MovePathNode {
        const movePath = this.getMovePath();
        return movePath[movePath.length - 1];
    }
    public updateMovePathByDestination(destination: GridIndex): void {
        const { x, y }      = destination.getXY();
        const movableArea   = getExisted(this.getMovableArea());
        const currPath      = this.getMovePath();
        if ((movableArea.checkHasGrid(x, y)) && (!currPath[currPath.length - 1].getGridIndex().checkIsEqual(destination))) {
            if ((!this._checkAndTruncateMovePath(destination)) && (!this._checkAndExtendMovePath(destination))) {
                this.resetMovePathAsShortest(destination);
            }
        }
    }
    private _checkAndTruncateMovePath(destination: GridIndex): boolean {
        const path      = this.getMovePath();
        const length    = path.length;
        for (let i = 0; i < length; ++i) {
            if (path[i].getGridIndex().checkIsEqual(destination)) {
                path.length = i + 1;
                return true;
            }
        }
        return false;
    }
    private _checkAndExtendMovePath(destination: GridIndex): boolean {
        const path      = this.getMovePath();
        const length    = path.length;
        const prevGrid  = path[length - 1];
        if (!prevGrid.getGridIndex().checkIsAdjacent(destination)) {
            return false;
        } else {
            const focusUnit     = getExisted(this.getFocusUnit());
            const totalMoveCost = getExisted(this._getMoveCost(destination, focusUnit)) + prevGrid.getTotalMoveCost();
            if (totalMoveCost > focusUnit.getFinalMoveRange()) {
                return false;
            } else {
                path.push(new MovePathNode(
                    destination.clone(),
                    totalMoveCost,
                ));
                return true;
            }
        }
    }

    public generateProtoMovePath(): MovePath {
        const movePath = this.getMovePath();
        return MovePath.fromJson({
            nodes           : movePath.map(v => v.getGridIndex().toProto().toJson()),
            isBlocked       : false,
            fuelConsumption : movePath[movePath.length - 1].getTotalMoveCost(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing attackable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitsForPreviewingAttackableArea(): Map<number, IUnit> {
        return this._unitsForPreviewAttack;
    }
    public getTilesForPreviewingAttackableArea(): Set<ITile> {
        return this._tilesForPreviewAttack;
    }

    public getAreaForPreviewingAttackableArea(): AttackableArea {
        return this._areaForPreviewAttack;
    }
    public clearDataForPreviewingAttackableArea(): void {
        this.getUnitsForPreviewingAttackableArea().clear();
        this.getTilesForPreviewingAttackableArea().clear();
        this.getAreaForPreviewingAttackableArea().clear();
    }
    public addUnitForPreviewAttackableArea(unit: IUnit): void {
        this.getUnitsForPreviewingAttackableArea().set(unit.getUnitId(), unit);
    }
    public addTileForPreviewAttackableArea(tile: ITile): void {
        this.getTilesForPreviewingAttackableArea().add(tile);

        const mapSize = this.getMapSize();
        this.getAreaForPreviewingAttackableArea().mergeFrom(AttackableArea.createForTile(tile, mapSize), mapSize);
    }

    public updateAreaForPreviewingAttackableArea(unit: IUnit): void {
        const canAttackAfterMoving  = unit.getFinalCanAttackAfterMoving();
        const beginningGridIndex    = unit.getGridIndex();
        const hasAmmo               = (!!unit.getPrimaryWeaponCurrentAmmo()) || (unit.checkHasSecondaryWeapon());
        const teamIndex             = unit.getTeamIndex();
        const war                   = unit.getWar();
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const mapSize               = this.getMapSize();
        const isIgnoreEnemy         = this.getIsIgnoreEnemyForPreviewingAttackableArea();
        const isIgnoreAlly          = this.getIsIgnoreAllyForPreviewingAttackableArea();
        const checkIsUnitVisible    = createFuncCheckIsUnitVisible(war.getPlayerManager().getWatcherTeamIndexesForSelf());
        const newArea               = AttackableArea.create({
            movableArea: MovableArea.create({
                gridIndex       : beginningGridIndex,
                maxMoveCost     : unit.getFinalMoveRange(),
                mapSize         : mapSize,
                moveCostGetter  : targetGridIndex => {
                    const existingUnit  = unitMap.getUnitOnMap(targetGridIndex);
                    if ((existingUnit == null)                      ||
                        (teamIndex === existingUnit.getTeamIndex()) ||
                        (isIgnoreEnemy)                             ||
                        (!checkIsUnitVisible(existingUnit))
                    ) {
                        return tileMap.getTile(targetGridIndex).getMoveCostByUnit(unit);
                    } else {
                        return null;
                    }
                },
            }),
            mapSize             : mapSize,
            minAttackRange      : unit.getMinAttackRange(),
            maxAttackRange      : unit.getFinalMaxAttackRange(),
            checkCanAttack      : moveGridIndex => {
                if (!hasAmmo) {
                    return false;
                }
                if ((!canAttackAfterMoving) && (!moveGridIndex.checkIsEqual(beginningGridIndex))) {
                    return false;
                }

                const existingUnit = unitMap.getUnitOnMap(moveGridIndex);
                return (!existingUnit)
                    || (existingUnit === unit)
                    || ((existingUnit.getTeamIndex() === teamIndex) && (isIgnoreAlly))
                    || ((existingUnit.getTeamIndex() !== teamIndex) && (isIgnoreEnemy))
                    || (!checkIsUnitVisible(existingUnit));
            },
        });

        this.getAreaForPreviewingAttackableArea().mergeFrom(newArea, mapSize);
    }
    private _resetAreaForPreviewingAttackableArea(): void {
        const area = this.getAreaForPreviewingAttackableArea();
        area.clear();

        const war                   = this.getWar();
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const mapSize               = this.getMapSize();
        const isIgnoreEnemy         = this.getIsIgnoreEnemyForPreviewingAttackableArea();
        const isIgnoreAlly          = this.getIsIgnoreAllyForPreviewingAttackableArea();
        const checkIsUnitVisible    = createFuncCheckIsUnitVisible(war.getPlayerManager().getWatcherTeamIndexesForSelf());

        for (const [, unit] of this.getUnitsForPreviewingAttackableArea()) {
            const canAttackAfterMoving  = unit.getFinalCanAttackAfterMoving();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (!!unit.getPrimaryWeaponCurrentAmmo()) || (unit.checkHasSecondaryWeapon());
            const teamIndex             = unit.getTeamIndex();
            const newArea               = AttackableArea.create({
                movableArea: MovableArea.create({
                    gridIndex       : beginningGridIndex,
                    maxMoveCost     : unit.getFinalMoveRange(),
                    mapSize         : mapSize,
                    moveCostGetter  : targetGridIndex => {
                        const existingUnit  = unitMap.getUnitOnMap(targetGridIndex);
                        if ((existingUnit == null)                      ||
                            (teamIndex === existingUnit.getTeamIndex()) ||
                            (isIgnoreEnemy)                             ||
                            (!checkIsUnitVisible(existingUnit))
                        ) {
                            return tileMap.getTile(targetGridIndex).getMoveCostByUnit(unit);
                        } else {
                            return null;
                        }
                    },
                }),
                mapSize             : mapSize,
                minAttackRange      : unit.getMinAttackRange(),
                maxAttackRange      : unit.getFinalMaxAttackRange(),
                checkCanAttack      : moveGridIndex => {
                    if (!hasAmmo) {
                        return false;
                    }
                    if ((!canAttackAfterMoving) && (!moveGridIndex.checkIsEqual(beginningGridIndex))) {
                        return false;
                    }

                    const existingUnit = unitMap.getUnitOnMap(moveGridIndex);
                    return (!existingUnit)
                        || (existingUnit === unit)
                        || ((existingUnit.getTeamIndex() === teamIndex) && (isIgnoreAlly))
                        || ((existingUnit.getTeamIndex() !== teamIndex) && (isIgnoreEnemy))
                        || (!checkIsUnitVisible(existingUnit));
                },
            });
            area.mergeFrom(newArea, mapSize);
        }
    }

    public getIsIgnoreAllyForPreviewingAttackableArea(): boolean {
        return this._isIgnoreAllyForPreviewAttack;
    }
    public setIsIgnoreAllyForPreviewingAttackableArea(isIgnore: boolean): void {
        this._isIgnoreAllyForPreviewAttack = isIgnore;

        if (this.getStateId() === StateId.PreviewingUnitAttackableArea) {
            this._resetAreaForPreviewingAttackableArea();
            this.updateView();
        }
    }

    public getIsIgnoreEnemyForPreviewingAttackableArea(): boolean {
        return this._isIgnoreEnemyForPreviewAttack;
    }
    public setIsIgnoreEnemyForPreviewingAttackableArea(isIgnore: boolean): void {
        this._isIgnoreEnemyForPreviewAttack = isIgnore;

        if (this.getStateId() === StateId.PreviewingUnitAttackableArea) {
            this._resetAreaForPreviewingAttackableArea();
            this.updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing movable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitForPreviewingMovableArea(): IUnit | null {
        return this._unitForPreviewMove;
    }
    public getAreaForPreviewingMovableArea(): MovableArea | null {
        return this._areaForPreviewMove;
    }
    private _setAreaForPreviewingMovableArea(area: MovableArea | null): void {
        this._areaForPreviewMove = area;
    }
    public setUnitForPreviewingMovableArea(unit: IUnit): void {
        this._unitForPreviewMove = unit;
    }
    public clearDataForPreviewingMovableArea(): void {
        this._unitForPreviewMove = null;
        this._setAreaForPreviewingMovableArea(null);
    }
    public resetAreaForPreviewingMovableArea(): void {
        const movingUnit = this.getUnitForPreviewingMovableArea();
        if (movingUnit == null) {
            this._setAreaForPreviewingMovableArea(null);
        } else {
            const isIgnoreEnemy         = this.getIsIgnoreEnemyForPreviewingMovableArea();
            const war                   = this.getWar();
            const teamIndex             = movingUnit.getTeamIndex();
            const tileMap               = war.getTileMap();
            const unitMap               = war.getUnitMap();
            const checkIsUnitVisible    = createFuncCheckIsUnitVisible(war.getPlayerManager().getWatcherTeamIndexesForSelf());
            this._setAreaForPreviewingMovableArea(MovableArea.create({
                gridIndex       : movingUnit.getGridIndex(),
                maxMoveCost     : movingUnit.getFinalMoveRange(),
                mapSize         : this.getMapSize(),
                moveCostGetter  : targetGridIndex => {
                    const existingUnit  = unitMap.getUnitOnMap(targetGridIndex);
                    if ((existingUnit == null)                      ||
                        (teamIndex === existingUnit.getTeamIndex()) ||
                        (isIgnoreEnemy)                             ||
                        (!checkIsUnitVisible(existingUnit))
                    ) {
                        return tileMap.getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
                    } else {
                        return null;
                    }
                },
            }));
        }
    }

    public getIsIgnoreEnemyForPreviewingMovableArea(): boolean {
        return this._isIgnoreEnemyForPreviewMove;
    }
    public setIsIgnoreEnemyForPreviewingMovableArea(isIgnore: boolean): void {
        this._isIgnoreEnemyForPreviewMove = isIgnore;

        if (this.getStateId() === StateId.PreviewingUnitMovableArea) {
            this.resetAreaForPreviewingMovableArea();
            this.updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing visible area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitForPreviewingVisibleArea(): IUnit | null {
        return this._unitForPreviewVisible;
    }
    public getAreaForPreviewingVisible(): GridIndex[] | null {
        return this._areaForPreviewVisible;
    }
    public clearDataForPreviewingVisibleArea(): void {
        this._unitForPreviewVisible = null;
        this._areaForPreviewVisible = null;
    }
    public setUnitForPreviewingVisibleArea(unit: IUnit): void {
        const gridIndex = unit.getGridIndex();
        this._unitForPreviewVisible = unit;
        this._areaForPreviewVisible = gridIndex.getGridsWithinDistance({
            minDistance : 0,
            maxDistance : unit.getFinalVisionRange(unit.getVisionInfo(), gridIndex),
            mapSize     : this.getMapSize(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _getMoveCost(targetGridIndex: GridIndex, movingUnit: IUnit): Undefinable<number> {
        const war = this.getWar();
        if (!targetGridIndex.checkIsInsideMap(this.getMapSize())) {
            return null;
        }

        const existingUnit  = war.getUnitMap().getUnitOnMap(targetGridIndex);
        const teamIndex     = movingUnit.getTeamIndex();
        if ((existingUnit)                                      &&
            (existingUnit.getTeamIndex() !== teamIndex)         &&
            (checkIsUnitOnMapVisibleToTeam({
                war                 : war,
                gridIndex           : targetGridIndex,
                unitType            : existingUnit.getUnitType(),
                isDiving            : existingUnit.getIsDiving(),
                isInvisible         : existingUnit.checkIsInvisible(targetGridIndex),
                unitPlayerIndex     : existingUnit.getPlayerIndex(),
                observerTeamIndex   : teamIndex,
            }))
        ) {
            return null;
        } else {
            return war.getTileMap().getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
        }
    }

    public checkCanFocusUnitOnMapAttackTarget(gridIndex: GridIndex): boolean {
        const attackableArea = getExisted(this.getAttackableArea());
        if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
            return false;
        } else {
            const focusUnit = getExisted(this.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                return true;
            } else {
                return focusUnit.checkCanAttackTargetAfterMovePath(
                    getExisted(this.getMovableArea()).createShortestMovePath(getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination)).map(v => v.getGridIndex()),
                    gridIndex
                );
            }
        }
    }

    public calculateAvailableDropDestination(unitForDrop: IUnit, chosenDropDestinations: GridIndex[]): GridIndex[] {
        const loader                = this.getFocusUnit();
        const loaderEndingGridIndex = this.getMovePathDestination().getGridIndex();
        const war                   = this.getWar();
        const tileMap               = war.getTileMap();
        const unitMap               = war.getUnitMap();
        const destinations          = new Array<GridIndex>();
        if (tileMap.getTile(loaderEndingGridIndex).getMoveCostByUnit(unitForDrop) != null) {
            for (const gridIndex of loaderEndingGridIndex.getAdjacentGrids(this.getMapSize())) {
                const existingUnit = unitMap.getVisibleUnitOnMap(gridIndex);
                if ((tileMap.getTile(gridIndex).getMoveCostByUnit(unitForDrop) != null) &&
                    (chosenDropDestinations.every(g => !g.checkIsEqual(gridIndex)))     &&
                    ((!existingUnit) || (existingUnit === loader))
                ) {
                    destinations.push(gridIndex);
                }
            }
        }
        return destinations;
    }
}

function createFuncCheckIsUnitVisible(observerTeamIndexes: Set<number>): (unit: IUnit) => boolean {
    const unitVisibleDict = new Map<IUnit, boolean>();
    return (unit: IUnit): boolean => {
        if (unitVisibleDict.has(unit)) {
            return !!unitVisibleDict.get(unit);
        }

        const gridIndex = unit.getGridIndex();
        const isVisible = checkIsUnitOnMapVisibleToTeams({
           war                 : unit.getWar(),
           gridIndex           : gridIndex,
           unitType            : unit.getUnitType(),
           isDiving            : unit.getIsDiving(),
           isInvisible         : unit.checkIsInvisible(gridIndex),
           unitPlayerIndex     : unit.getPlayerIndex(),
           observerTeamIndexes : observerTeamIndexes,
       });
       unitVisibleDict.set(unit, isVisible);
       return isVisible;
    };
}

function getState(stateId: StateId): IState {
    switch (stateId) {
        case StateId.Idle                             : return Idle.getInstance();
        case StateId.ExecutingAction                  : return ExecutingAction.getInstance();

        case StateId.ChoosingCoActiveSkillTarget      : return ChoosingCoActiveSkillTarget.getInstance();
        case StateId.ChoosingTileProductionTarget     : return ChoosingTileProductionTarget.getInstance();
        case StateId.ChoosingUnitAction               : return ChoosingUnitAction.getInstance();
        case StateId.ChoosingUnitAttackTarget         : return ChoosingUnitAttackTarget.getInstance();
        case StateId.ChoosingUnitCrushTarget          : return ChoosingUnitCrushTarget.getInstance();
        case StateId.ChoosingUnitDropDestination      : return ChoosingUnitDropDestination.getInstance();
        case StateId.ChoosingUnitFlareDestination     : return ChoosingUnitFlareDestination.getInstance();
        case StateId.ChoosingUnitMovePath             : return ChoosingUnitMovePath.getInstance();
        case StateId.ChoosingUnitRepairTarget         : return ChoosingUnitRepairTarget.getInstance();
        case StateId.ChoosingUnitSiloDestination      : return ChoosingUnitSiloDestination.getInstance();

        case StateId.PreviewingTileAttackableArea     : return PreviewingTileAttackableArea.getInstance();
        case StateId.PreviewingUnitAttackableArea     : return PreviewingUnitAttackableArea.getInstance();
        case StateId.PreviewingUnitMovableArea        : return PreviewingUnitMovableArea.getInstance();
        case StateId.PreviewingUnitVisibleArea        : return PreviewingUnitVisibleArea.getInstance();

        case StateId.RequestingPlayerDeleteUnit       : return RequestingPlayerDeleteUnit.getInstance();
        case StateId.RequestingPlayerEndTurn          : return RequestingPlayerEndTurn.getInstance();
        case StateId.RequestingPlayerProduceUnit      : return RequestingPlayerProduceUnit.getInstance();
        case StateId.RequestingPlayerSurrender        : return RequestingPlayerSurrender.getInstance();
        case StateId.RequestingPlayerUseCoActiveSkill : return RequestingPlayerUseCoActiveSkill.getInstance();
        case StateId.RequestingPlayerVoteForDraw      : return RequestingPlayerVoteForDraw.getInstance();
        case StateId.RequestingUnitAttackTile         : return RequestingUnitAttackTile.getInstance();
        case StateId.RequestingUnitAttackUnit         : return RequestingUnitAttackUnit.getInstance();
        case StateId.RequestingUnitBeLoaded           : return RequestingUnitBeLoaded.getInstance();
        case StateId.RequestingUnitBoardedByCo        : return RequestingUnitBoardedByCo.getInstance();
        case StateId.RequestingUnitBuildTile          : return RequestingUnitBuildTile.getInstance();
        case StateId.RequestingUnitCaptureTile        : return RequestingUnitCaptureTile.getInstance();
        case StateId.RequestingUnitCrushUnit          : return RequestingUnitCrushUnit.getInstance();
        case StateId.RequestingUnitDive               : return RequestingUnitDive.getInstance();
        case StateId.RequestingUnitDrop               : return RequestingUnitDrop.getInstance();
        case StateId.RequestingUnitJoin               : return RequestingUnitJoin.getInstance();
        case StateId.RequestingUnitLaunchFlare        : return RequestingUnitLaunchFlare.getInstance();
        case StateId.RequestingUnitLaunchSilo         : return RequestingUnitLaunchSilo.getInstance();
        case StateId.RequestingUnitProduceUnit        : return RequestingUnitProduceUnit.getInstance();
        case StateId.RequestingUnitRepairUnit         : return RequestingUnitRepairUnit.getInstance();
        case StateId.RequestingUnitSelfDetonate       : return RequestingUnitSelfDetonate.getInstance();
        case StateId.RequestingUnitSupply             : return RequestingUnitSupply.getInstance();
        case StateId.RequestingUnitSurface            : return RequestingUnitSurface.getInstance();
        case StateId.RequestingUnitUseCoActiveSkill   : return RequestingUnitUseCoActiveSkill.getInstance();
        case StateId.RequestingUnitWait               : return RequestingUnitWait.getInstance();

        default                                         : throw newError(`ActionPlanner.getState() invalid stateId: ${stateId}`);
    }
}

function checkIsExecuting(stateId: StateId): boolean {
    return StateIdsForExecuting.has(stateId);
}
function checkIsRequesting(stateId: StateId): boolean {
    return StateIdsForRequesting.has(stateId);
}

function generateOpenDataForUnitActionsPanel(actionPlanner: IActionPlanner): OpenData {
    const war                   = actionPlanner.getWar();
    const destination           = actionPlanner.getMovePathDestination();
    const actionUnitBeLoaded    = getActionUnitBeLoaded(actionPlanner);
    if (actionUnitBeLoaded.length) {
        return {
            war         : war,
            destination : destination.getGridIndex(),
            actionList  : actionUnitBeLoaded,
        };
    }

    const actionUnitJoin = getActionUnitJoin(actionPlanner);
    if (actionUnitJoin.length) {
        return {
            war         : war,
            destination : destination.getGridIndex(),
            actionList  : actionUnitJoin,
        };
    }

    const dataList              : DataForUnitAction[] = [];
    const actionsForDropUnit    = getActionsUnitDropUnit(actionPlanner);
    const canDropUnits          = actionsForDropUnit.length > 0;
    dataList.push(...getActionUnitUseCoSuperPower(actionPlanner));
    dataList.push(...getActionUnitUseCoPower(actionPlanner));
    dataList.push(...getActionUnitBoardedByCo(actionPlanner));
    dataList.push(...getActionUnitAttack(actionPlanner));
    dataList.push(...getActionUnitCapture(actionPlanner));
    dataList.push(...getActionUnitCrushUnit(actionPlanner));
    dataList.push(...getActionUnitRepairUnit(actionPlanner));
    dataList.push(...getActionUnitDive(actionPlanner));
    dataList.push(...getActionUnitSurface(actionPlanner));
    dataList.push(...getActionsUnitLaunchUnit(actionPlanner));
    dataList.push(...actionsForDropUnit);
    dataList.push(...getActionUnitSupply(actionPlanner, canDropUnits));
    dataList.push(...getActionUnitBuildTile(actionPlanner, canDropUnits));
    dataList.push(...getActionUnitLaunchFlare(actionPlanner));
    dataList.push(...getActionUnitLaunchSilo(actionPlanner));
    dataList.push(...getActionUnitProduceUnit(actionPlanner));
    dataList.push(...getActionUnitSelfDetonate(actionPlanner));
    dataList.push(...getActionUnitWait(actionPlanner, dataList.length > 0));

    if (!dataList.length) {
        throw newError(`No actions available?!`);
    }

    return {
        war         : war,
        destination : destination.getGridIndex(),
        actionList  : dataList,
    };
}
function getActionUnitBeLoaded(actionPlanner: IActionPlanner): DataForUnitAction[] {
    const destination   = actionPlanner.getMovePathDestination().getGridIndex();
    const focusUnit     = getExisted(actionPlanner.getFocusUnit());
    if (focusUnit.getGridIndex().checkIsEqual(destination)) {
        return [];
    } else {
        const loader = actionPlanner.getWar().getUnitMap().getUnitOnMap(destination);
        return (loader) && (loader.checkCanLoadUnit(focusUnit))
            ? [{
                actionType  : ActionTypeId.BeLoaded,
                callback    : () => RequestingUnitBeLoaded.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitJoin(actionPlanner: IActionPlanner): DataForUnitAction[] {
    const destination   = actionPlanner.getMovePathDestination().getGridIndex();
    const focusUnit     = getExisted(actionPlanner.getFocusUnit());
    if (focusUnit.getGridIndex().checkIsEqual(destination)) {
        return [];
    } else {
        const target = actionPlanner.getWar().getUnitMap().getUnitOnMap(destination);
        return (target) && (focusUnit.checkCanJoinUnit(target))
            ? [{
                actionType  : ActionTypeId.Join,
                callback    : () => {
                    const cb = () => RequestingUnitJoin.getInstance().doApplyOnChooseAction(actionPlanner);
                    if (target.getActionState() === ActionStateId.Acted) {
                        cb();
                    } else {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent  : () => getText(TextType.A0885),
                            callback    : cb,
                        });
                    }
                },
            }]
            : [];
    }
}
function getActionsUnitDropUnit(actionPlanner: IActionPlanner): DataForUnitAction[] {
    const focusUnit                 = getExisted(actionPlanner.getFocusUnit());
    const destination               = actionPlanner.getMovePathDestination();
    const loadedUnits               = focusUnit.getLoadedUnits();
    const chosenUnits               = actionPlanner.getChosenUnitsForDrop();
    const chosenDropDestinations    = actionPlanner.getChosenDropDestinations();
    const actions                   : DataForUnitAction[] = [];
    if ((loadedUnits.length > chosenUnits.length) && (focusUnit.checkCanDropLoadedUnit(actionPlanner.getWar().getTileMap().getTile(destination.getGridIndex()).getTileTypeId()))) {
        for (const unit of loadedUnits) {
            if ((chosenUnits.every(value => value.unit !== unit)) && (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length)) {
                actions.push({
                    actionType  : ActionTypeId.DropUnit,
                    callback    : () => ChoosingUnitDropDestination.getInstance().doApplyOnChooseAction(actionPlanner, unit),
                    unitForDrop : unit,
                });
            }
        }
    }
    return actions;
}
function getActionUnitUseCoSuperPower(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit = getExisted(actionPlanner.getFocusUnit());
        const skillType = SkillTypeId.SuperPower;
        return !focusUnit.checkCanUseCoSkill(skillType)
            ? []
            : [{
                actionType  : ActionTypeId.UseCoSuperPower,
                callback    : () => {
                    const targetsCount = getPowerSkillTargetsCount(focusUnit.getPlayer().getCoBasicCfg(), skillType);
                    if (targetsCount <= 0) {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent : () => getText(TextType.A0058),
                            callback: () => {
                                actionPlanner.setCoActiveSkillSkillType(skillType);
                                RequestingUnitUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null);
                            },
                        });
                    } else {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent  : () => getFormattedText(TextType.F0205, targetsCount),
                            callback    : () => ChoosingCoActiveSkillTarget.getInstance().doApplyOnChooseAction(actionPlanner, skillType),
                        });
                    }
                },
            }];
    }
}
function getActionUnitUseCoPower(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit = getExisted(actionPlanner.getFocusUnit());
        const skillType = SkillTypeId.Power;
        return !focusUnit.checkCanUseCoSkill(skillType)
            ? []
            : [{
                actionType  : ActionTypeId.UseCoPower,
                callback    : () => {
                    const targetsCount = getPowerSkillTargetsCount(focusUnit.getPlayer().getCoBasicCfg(), skillType);
                    if (targetsCount <= 0) {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent : () => getText(TextType.A0054),
                            callback: () => {
                                actionPlanner.setCoActiveSkillSkillType(skillType);
                                RequestingUnitUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null);
                            },
                        });
                    } else {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent  : () => getFormattedText(TextType.F0205, targetsCount),
                            callback    : () => ChoosingCoActiveSkillTarget.getInstance().doApplyOnChooseAction(actionPlanner, skillType),
                        });
                    }
                },
            }];
    }
}
function getActionUnitBoardedByCo(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return getExisted(actionPlanner.getFocusUnit()).checkCanCoBoardAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()))
            ? [{
                actionType  : ActionTypeId.CoBoard,
                callback    : () => RequestingUnitBoardedByCo.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitAttack(actionPlanner: IActionPlanner): DataForUnitAction[] {
    return actionPlanner.createAttackableGridsForUnitWeapon().length
        ? [{
            actionType  : ActionTypeId.Attack,
            callback    : () => ChoosingUnitAttackTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }]
        : [];
}
function getActionUnitCapture(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (getExisted(actionPlanner.getFocusUnit()).checkCanCaptureTile(actionPlanner.getWar().getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex())))
            ? [{
                actionType: ActionTypeId.CaptureTile,
                callback: () => RequestingUnitCaptureTile.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitCrushUnit(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if ((actionPlanner.getChosenUnitsForDrop().length)                  ||
        (!actionPlanner.getUnitCrushCandidateGridIndexArray().length)
    ) {
        return [];
    } else {
        return [{
            actionType  : ActionTypeId.CrushUnit,
            callback    : () => ChoosingUnitCrushTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }];
    }
}
function getActionUnitDive(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (getExisted(actionPlanner.getFocusUnit()).checkCanDive())
            ? [{
                actionType: ActionTypeId.Dive,
                callback: () => RequestingUnitDive.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitSurface(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (getExisted(actionPlanner.getFocusUnit()).checkCanSurface())
            ? [{
                actionType  : ActionTypeId.Surface,
                callback    : () => openPanel(getDict().CommonConfirmPanel, {
                    getContent  : () => getText(TextType.AreYouSureYouWantToContinue),
                    callback    : () => RequestingUnitSurface.getInstance().doApplyOnChooseAction(actionPlanner),
                }),
            }]
            : [];
    }
}
function getActionsUnitLaunchUnit(actionPlanner: IActionPlanner): DataForUnitAction[] {
    const dataList  : DataForUnitAction[] = [];
    const focusUnit = getExisted(actionPlanner.getFocusUnit());
    if ((focusUnit !== actionPlanner.getFocusUnitLoaded()) && (actionPlanner.getMovePath().length === 1) && (focusUnit.checkCanLaunchLoadedUnit())) {
        const tile = actionPlanner.getWar().getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex());
        for (const unit of focusUnit.getLoadedUnits()) {
            if ((unit.getActionState() === ActionStateId.Idle) && (tile.getMoveCostByUnit(unit) != null)) {
                dataList.push({
                    actionType      : ActionTypeId.LaunchUnit,
                    callback        : () => ChoosingUnitMovePath.getInstance().doApplyOnChooseAction(actionPlanner, unit),
                    unitForLaunch   : unit,
                });
            }
        }
    }
    return dataList;
}
function getActionUnitRepairUnit(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if ((actionPlanner.getChosenUnitsForDrop().length)                  ||
        (!actionPlanner.getUnitRepairCandidateGridIndexArray().length)
    ) {
        return [];
    } else {
        return [{
            actionType  : ActionTypeId.RepairUnit,
            callback    : () => ChoosingUnitRepairTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }];
    }
}
function getActionUnitSelfDetonate(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const selfDetonateCfg = getExisted(actionPlanner.getFocusUnit()).getTemplateCfg().getSelfDetonateCfg();
        if (selfDetonateCfg) {
            return [{
                actionType  : ActionTypeId.SelfDetonate,
                callback    : () => openPanel(getDict().CommonConfirmPanel, {
                    getContent  : () => getFormattedText(TextType.F0209, selfDetonateCfg.getRadius(), selfDetonateCfg.getDamage()),
                    callback    : () => RequestingUnitSelfDetonate.getInstance().doApplyOnChooseAction(actionPlanner),
                }),
            }];
        }
        return [];
    }
}
function getActionUnitSupply(actionPlanner: IActionPlanner, canDropUnits: boolean): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit     = getExisted(actionPlanner.getFocusUnit());
        const playerIndex   = focusUnit.getPlayerIndex();
        const unitMap       = actionPlanner.getWar().getUnitMap();
        if (focusUnit.checkIsAdjacentUnitSupplier()) {
            for (const gridIndex of actionPlanner.getMovePathDestination().getGridIndex().getAdjacentGrids(actionPlanner.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    const cb = () => RequestingUnitSupply.getInstance().doApplyOnChooseAction(actionPlanner);
                    return [{
                        actionType  : ActionTypeId.Supply,
                        callback    : !canDropUnits
                            ? cb
                            : () => openPanel(getDict().CommonConfirmPanel, {
                                getContent  : () => getText(TextType.A0055),
                                callback    : cb,
                            }),
                    }];
                }
            }
        }
        return [];
    }
}
function getActionUnitBuildTile(actionPlanner: IActionPlanner, canDropUnits: boolean): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const destination   = actionPlanner.getMovePathDestination().getGridIndex();
        const tile          = actionPlanner.getWar().getTileMap().getTile(destination);
        if (!getExisted(actionPlanner.getFocusUnit()).checkCanBuildOnTile(tile)) {
            return [];
        } else {
            const cb = () => RequestingUnitBuildTile.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType  : ActionTypeId.BuildTile,
                callback    : !canDropUnits
                    ? cb
                    : () => openPanel(getDict().CommonConfirmPanel, {
                        getContent  : () => getText(TextType.A0055),
                        callback    : cb,
                    }),
            }];
        }
    }
}
function getActionUnitLaunchFlare(actionPlanner: IActionPlanner): DataForUnitAction[] {
    const focusUnit = getExisted(actionPlanner.getFocusUnit());
    const movePath  = actionPlanner.getMovePath();
    if ((!actionPlanner.getWar().getFogMap().checkHasFogCurrently())    ||
        (movePath.length !== 1)                                 ||
        (!focusUnit.getFlareCurrentAmmo())
    ) {
        return [];
    } else {
        return [{
            actionType  : ActionTypeId.LaunchFlare,
            callback    : () => ChoosingUnitFlareDestination.getInstance().doApplyOnChooseAction(
                actionPlanner,
                getExisted(focusUnit.getFlareRadius(movePath[movePath.length - 1].getGridIndex()))
            ),
        }];
    }
}
function getActionUnitLaunchSilo(actionPlanner: IActionPlanner): DataForUnitAction[] {
    const war   = actionPlanner.getWar();
    const tile  = war.getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex());
    return (getExisted(actionPlanner.getFocusUnit()).checkCanLaunchSiloOnTile(tile))
        ? [{
            actionType  : ActionTypeId.LaunchSilo,
            callback    : () => ChoosingUnitSiloDestination.getInstance().doApplyOnChooseAction(
                actionPlanner,
                tile.getTemplateCfg().getLaunchSiloParams()[2]
            ),
        }]
        : [];
}
function getActionUnitProduceUnit(actionPlanner: IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit         = getExisted(actionPlanner.getFocusUnit());
        const produceUnitType   = focusUnit.getProduceUnitTypeId();
        const playerIndex       = focusUnit.getPlayerIndex();
        const war               = focusUnit.getWar();
        const player            = focusUnit.getPlayer();
        if ((actionPlanner.getFocusUnitLoaded())        ||
            (actionPlanner.getMovePath().length !== 1)  ||
            (produceUnitType == null)                   ||
            (player !== war.getPlayerInTurn())
        ) {
            return [];
        }

        const commonSettingManager = war.getCommonSettingManager();
        {
            const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndex, produceUnitType);
            if (canProduce === false) {
                return [];
            } else if (canProduce == null) {
                if (commonSettingManager.getPlayerRule(playerIndex).getBannedUnitTypeArray().includes(produceUnitType)) {
                    return [];
                }
            }
        }

        const costForProduceUnit    = focusUnit.getProduceUnitCost();
        const currentUnitsCount     = war.getUnitMap().countAllUnitsForPlayer(playerIndex);
        const maxUnitsCount         = commonSettingManager
            .getInstanceWarRule()
            .getWarRuleCommonData()
            ?.getPlayerRuleList()
            .find(v => v.getPlayerIndex() === playerIndex)
            ?.getMaxUnitsCount();

        if (focusUnit.getCurrentProduceMaterial() < 1) {
            return [{
                actionType          : ActionTypeId.ProduceUnit,
                callback            : () => show(getText(TextType.B0051)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else if (focusUnit.getLoadedUnitsCount() >= getExisted(focusUnit.getMaxLoadUnitsCount())) {
            return [{
                actionType          : ActionTypeId.ProduceUnit,
                callback            : () => show(getText(TextType.B0052)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else if (player.getFund() < costForProduceUnit) {
            return [{
                actionType          : ActionTypeId.ProduceUnit,
                callback            : () => show(getText(TextType.B0053)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else if ((maxUnitsCount != null) && (currentUnitsCount >= maxUnitsCount)) {
            return [{
                actionType          : ActionTypeId.ProduceUnit,
                callback            : () => show(getFormattedText(TextType.F0266, currentUnitsCount, maxUnitsCount)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else {
            return [{
                actionType          : ActionTypeId.ProduceUnit,
                callback            : () => RequestingUnitProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        }
    }
}
function getActionUnitWait(actionPlanner: IActionPlanner, hasOtherAction: boolean): DataForUnitAction[] {
    const existingUnit = actionPlanner.getWar().getUnitMap().getVisibleUnitOnMap(actionPlanner.getMovePathDestination().getGridIndex());
    if ((existingUnit) && (existingUnit !== actionPlanner.getFocusUnit())) {
        return [];
    } else {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            const cb = () => RequestingUnitDrop.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType  : ActionTypeId.Wait,
                callback    : !hasOtherAction
                    ? cb
                    : () => openPanel(getDict().CommonConfirmPanel, {
                        getContent  : () => getText(TextType.A0055),
                        callback    : cb,
                    }),
            }];
        } else {
            const cb = () => RequestingUnitWait.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType  : ActionTypeId.Wait,
                callback    : !hasOtherAction
                    ? cb
                    : () => openPanel(getDict().CommonConfirmPanel, {
                        getContent  : () => getText(TextType.A0055),
                        callback    : cb,
                    }),
            }];
        }
    }
}
