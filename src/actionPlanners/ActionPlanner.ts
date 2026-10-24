import * as ActionPlannersConstants from "./Constants.ts";
import type * as ActionPlannersIActionPlanner from "./IActionPlanner.ts";
import type * as ActionPlannersIActionPlannerView from "./IActionPlannerView.ts";
import * as ActionPlannersStatesChoosingCoActiveSkillTarget from "./states/ChoosingCoActiveSkillTarget.ts";
import * as ActionPlannersStatesChoosingTileProductionTarget from "./states/ChoosingTileProductionTarget.ts";
import * as ActionPlannersStatesChoosingUnitAction from "./states/ChoosingUnitAction.ts";
import * as ActionPlannersStatesChoosingUnitAttackTarget from "./states/ChoosingUnitAttackTarget.ts";
import * as ActionPlannersStatesChoosingUnitCrushTarget from "./states/ChoosingUnitCrushTarget.ts";
import * as ActionPlannersStatesChoosingUnitDropDestination from "./states/ChoosingUnitDropDestination.ts";
import * as ActionPlannersStatesChoosingUnitFlareDestination from "./states/ChoosingUnitFlareDestination.ts";
import * as ActionPlannersStatesChoosingUnitMovePath from "./states/ChoosingUnitMovePath.ts";
import * as ActionPlannersStatesChoosingUnitRepairTarget from "./states/ChoosingUnitRepairTarget.ts";
import * as ActionPlannersStatesChoosingUnitSiloDestination from "./states/ChoosingUnitSiloDestination.ts";
import * as ActionPlannersStatesExecutingAction from "./states/ExecutingAction.ts";
import * as ActionPlannersStatesIdle from "./states/Idle.ts";
import type * as ActionPlannersStatesIState from "./states/IState.ts";
import * as ActionPlannersStatesPreviewingTileAttackableArea from "./states/PreviewingTileAttackableArea.ts";
import * as ActionPlannersStatesPreviewingUnitAttackableArea from "./states/PreviewingUnitAttackableArea.ts";
import * as ActionPlannersStatesPreviewingUnitMovableArea from "./states/PreviewingUnitMovableArea.ts";
import * as ActionPlannersStatesPreviewingUnitVisibleArea from "./states/PreviewingUnitVisibleArea.ts";
import * as ActionPlannersStatesRequestingPlayerDeleteUnit from "./states/RequestingPlayerDeleteUnit.ts";
import * as ActionPlannersStatesRequestingPlayerEndTurn from "./states/RequestingPlayerEndTurn.ts";
import * as ActionPlannersStatesRequestingPlayerProduceUnit from "./states/RequestingPlayerProduceUnit.ts";
import * as ActionPlannersStatesRequestingPlayerSurrender from "./states/RequestingPlayerSurrender.ts";
import * as ActionPlannersStatesRequestingPlayerUseCoActiveSkill from "./states/RequestingPlayerUseCoActiveSkill.ts";
import * as ActionPlannersStatesRequestingPlayerVoteForDraw from "./states/RequestingPlayerVoteForDraw.ts";
import * as ActionPlannersStatesRequestingUnitAttackTile from "./states/RequestingUnitAttackTile.ts";
import * as ActionPlannersStatesRequestingUnitAttackUnit from "./states/RequestingUnitAttackUnit.ts";
import * as ActionPlannersStatesRequestingUnitBeLoaded from "./states/RequestingUnitBeLoaded.ts";
import * as ActionPlannersStatesRequestingUnitBoardedByCo from "./states/RequestingUnitBoardedByCo.ts";
import * as ActionPlannersStatesRequestingUnitBuildTile from "./states/RequestingUnitBuildTile.ts";
import * as ActionPlannersStatesRequestingUnitCaptureTile from "./states/RequestingUnitCaptureTile.ts";
import * as ActionPlannersStatesRequestingUnitCrushUnit from "./states/RequestingUnitCrushUnit.ts";
import * as ActionPlannersStatesRequestingUnitDive from "./states/RequestingUnitDive.ts";
import * as ActionPlannersStatesRequestingUnitDrop from "./states/RequestingUnitDrop.ts";
import * as ActionPlannersStatesRequestingUnitJoin from "./states/RequestingUnitJoin.ts";
import * as ActionPlannersStatesRequestingUnitLaunchFlare from "./states/RequestingUnitLaunchFlare.ts";
import * as ActionPlannersStatesRequestingUnitLaunchSilo from "./states/RequestingUnitLaunchSilo.ts";
import * as ActionPlannersStatesRequestingUnitProduceUnit from "./states/RequestingUnitProduceUnit.ts";
import * as ActionPlannersStatesRequestingUnitRepairUnit from "./states/RequestingUnitRepairUnit.ts";
import * as ActionPlannersStatesRequestingUnitSelfDetonate from "./states/RequestingUnitSelfDetonate.ts";
import * as ActionPlannersStatesRequestingUnitSupply from "./states/RequestingUnitSupply.ts";
import * as ActionPlannersStatesRequestingUnitSurface from "./states/RequestingUnitSurface.ts";
import * as ActionPlannersStatesRequestingUnitUseCoActiveSkill from "./states/RequestingUnitUseCoActiveSkill.ts";
import * as ActionPlannersStatesRequestingUnitWait from "./states/RequestingUnitWait.ts";
import type * as ActionPlannersTypes from "./Types.ts";
import * as AuxiliaryTypesAttackableArea from "../auxiliaryTypes/AttackableArea.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovableArea from "../auxiliaryTypes/MovableArea.ts";
import * as AuxiliaryTypesMovePathNode from "../auxiliaryTypes/MovePathNode.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as BaseWarModelBwTypes from "../baseWar/model/BwTypes.ts";
import type * as BaseWarViewBwUnitActionsPanel from "../baseWar/view/BwUnitActionsPanel.ts";
import * as CoSkillsConstants from "../coSkills/Constants.ts";
import * as CoSkillsUtilsCommon from "../coSkills/utils/Common.ts";
import * as FloatText2 from "../FloatText.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../gamePanels/Dict.ts";
import * as GamePanelsManager from "../gamePanels/Manager.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as Logger2 from "../Logger.ts";
import type * as NotificationsDataTypes from "../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as NotificationsTypes from "../notifications/Types.ts";
import * as ProtoSchemaCommonProtoStructureMovePath from "../proto/schema/CommonProto/Structure/MovePath.ts";
import type * as TilesITile from "../tiles/ITile.ts";
import * as UnitsConstants from "../units/Constants.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";
import * as UsersModel from "../users/Model.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type DataForUnitAction      = BaseWarModelBwTypes.DataForUnitAction;
type IBwTile                = TilesITile.ITile;
type IBwUnit                = UnitsIUnit.IUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export class ActionPlanner implements ActionPlannersIActionPlanner.IActionPlanner {
    private readonly _view                      = new (GameHelpersGhFactory.getActionPlannerViewClass())();

    private _war?                               : IBwWar;

    private _stateId                            = ActionPlannersConstants.StateId.Idle;
    private _prevStateId                        = ActionPlannersConstants.StateId.Idle;

    private _focusUnitOnMap                     : IBwUnit | null = null;
    private _focusUnitLoaded                    : IBwUnit | null = null;
    private _choosingUnitForDrop                : IBwUnit | null = null;
    private _chosenUnitsForDrop                 : ActionPlannersTypes.ChosenUnitForDrop[] = [];
    private _availableDropDestinations          : GridIndex[] | null = null;
    private _movableArea                        : AuxiliaryTypesMovableArea.MovableArea | null = null;
    private _attackableArea                     : AuxiliaryTypesAttackableArea.AttackableArea | null = null;
    private _attackableGridsForUnitWeapon       : GridIndex[] | null = null;
    private _movePath                           : AuxiliaryTypesMovePathNode.MovePathNode[] = [];
    private _coActiveSkillSkillType             : CoSkillsConstants.SkillTypeId | null = null;
    private _coActiveSkillTargetGridIndexArray  : GridIndex[] | null = null;
    private _unitCrushTargetGridIndex           : GridIndex | null = null;
    private _unitRepairTargetGridIndex          : GridIndex | null = null;

    private _unitsForPreviewAttack              = new Map<number, IBwUnit>();
    private _tilesForPreviewAttack              = new Set<IBwTile>();
    private _areaForPreviewAttack               = new AuxiliaryTypesAttackableArea.AttackableArea([]);
    private _unitForPreviewMove                 : IBwUnit | null = null;
    private _areaForPreviewMove                 : AuxiliaryTypesMovableArea.MovableArea | null = null;
    private _unitForPreviewVisible              : IBwUnit | null = null;
    private _areaForPreviewVisible              : GridIndex[] | null = null;

    private _isIgnoreAllyForPreviewAttack       = true;
    private _isIgnoreEnemyForPreviewAttack      = true;
    private _isIgnoreEnemyForPreviewMove        = true;

    private _notifyListeners: NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.BwCursorTapped,      callback: this._onNotifyBwCursorTapped },
        { type: NotificationsTypeId.TypeId.BwCursorDragged,     callback: this._onNotifyBwCursorDragged },
        { type: NotificationsTypeId.TypeId.BwCursorDragEnded,   callback: this._onNotifyBwCursorDragEnded },
    ];

    public init(): void {
        this.getView().init(this);
    }
    public fastInit(): void {
        this.getView().fastInit(this);
    }

    public startRunning(war: IBwWar): void {
        this._war = war;

        ActionPlannersStatesIdle.Idle.getInstance().apply(this);
        NotificationsDispatcher.addEventListeners(this._notifyListeners, this);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    public getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war, UtilsClientErrorCode.ClientErrorCode.ActionPlanner_GetWar_00);
    }

    public getPlayerIndexLoggedIn(): Undefinable<number> {
        const war = this.getWar();
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            return war.getPlayerIndexLoggedIn();
        } else {
            return undefined;
        }
    }
    public getSelfPlayerIndexSet(): Set<number> {
        const war = this.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            return new Set();

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return new Set();

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const playerIndex = this.getPlayerIndexLoggedIn();
            return playerIndex == null ? new Set() : new Set([playerIndex]);

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            return new Set();

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const playerIndexSet = new Set<number>();
            for (const [playerIndex, player] of this.getWar().getPlayerManager().getAllPlayersDict()) {
                if ((!player.checkIsNeutral()) && (player.getUserId() != null)) {
                    playerIndexSet.add(playerIndex);
                }
            }

            return playerIndexSet;

        } else if (war instanceof GameHelpersGhFactory.getTwWarClass()) {
            return new Set();

        } else {
            throw HelpersMisc.newError(`Invalid war.`);
        }
    }
    public checkCanControlUnit(unit: IBwUnit): boolean {
        const war = this.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            return false;

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            return false;

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const playerInTurn = war.getPlayerInTurn();
            return (playerInTurn.getUserId() === UsersModel.getSelfUserId())
                && (playerInTurn.getPlayerIndex() === unit.getPlayerIndex());

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            return false;

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const playerInTurn = war.getPlayerInTurn();
            return (unit.getPlayerIndex() === playerInTurn.getPlayerIndex())
                && (playerInTurn.getUserId() != null);

        } else if (war instanceof GameHelpersGhFactory.getTwWarClass()) {
            return false;

        } else {
            throw HelpersMisc.newError(`Invalid war.`);
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
        if (UsersModel.getSelfSettingsIsAutoScrollMap()) {
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

    private _onNotifyBwCursorDragged(e: VendorEgretEgret.Event): void {
        const war = this.getWar();
        if (UsersModel.getSelfSettingsIsAutoScrollMap()) {
            war.getView().tweenGridToCentralArea((e.data as NotificationsDataTypes.BwCursorDragged).draggedTo);
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
    public getStateId(): ActionPlannersConstants.StateId {
        return this._stateId;
    }
    public getPreviousStateId(): ActionPlannersConstants.StateId {
        return this._prevStateId;
    }
    public setStateId(stateId: ActionPlannersConstants.StateId): void {
        const isChanged = this._stateId !== stateId;
        this._prevStateId = this._stateId;
        this._stateId     = stateId;

        Logger2.log(`ActionPlanner.setStateId() ${stateId}`);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ActionPlannerStateSet);
        (isChanged) && (NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ActionPlannerStateChanged));
    }

    public cancelCurrentState(): void {
        getState(this.getStateId()).cancel(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): ActionPlannersIActionPlannerView.IActionPlannerView {
        return this._view;
    }
    public updateView(): void {
        const war = this.getWar();
        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
                GamePanelsManager.openPanel(
                    GamePanelsDict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlannersConstants.StateId.ChoosingUnitMovePath) || (currState === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget)) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            // nothing to do

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
                GamePanelsManager.openPanel(
                    GamePanelsDict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlannersConstants.StateId.ChoosingUnitMovePath) || (currState === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget)) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
                GamePanelsManager.openPanel(
                    GamePanelsDict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlannersConstants.StateId.ChoosingUnitMovePath) || (currState === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget)) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlannersConstants.StateId.ChoosingUnitAction) {
                GamePanelsManager.openPanel(
                    GamePanelsDict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlannersConstants.StateId.ChoosingUnitMovePath) || (currState === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget)) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwDamagePreviewPanel, { war: this.getWar() });
            } else {
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof GameHelpersGhFactory.getTwWarClass()) {
            // nothing to do

        } else {
            throw HelpersMisc.newError(`Invalid war.`);
        }
    }

    public checkIsStateRequesting(): boolean {
        return checkIsRequesting(this.getStateId());
    }

    public getFocusUnit(): IBwUnit | null {
        return this.getFocusUnitLoaded() || this.getFocusUnitOnMap();
    }
    public getFocusUnitOnMap(): IBwUnit | null {
        return this._focusUnitOnMap;
    }
    public setFocusUnitOnMap(unit: IBwUnit): void {
        this._focusUnitOnMap = unit;
    }
    public clearFocusUnitOnMap(): void {
        this._focusUnitOnMap = null;
    }

    public getFocusUnitLoaded(): IBwUnit | null {
        return this._focusUnitLoaded;
    }
    public setFocusUnitLoaded(unit: IBwUnit): void {
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

    public getChoosingUnitForDrop(): IBwUnit | null {
        return this._choosingUnitForDrop;
    }
    public setChoosingUnitForDrop(unit: IBwUnit): void {
        this._choosingUnitForDrop = unit;
    }
    public clearChoosingUnitForDrop(): void {
        this._choosingUnitForDrop = null;
    }

    public getChosenUnitsForDrop(): ActionPlannersTypes.ChosenUnitForDrop[] {
        return this._chosenUnitsForDrop;
    }
    public pushBackChosenUnitForDrop(data: ActionPlannersTypes.ChosenUnitForDrop): void {
        this._chosenUnitsForDrop.push(data);
    }
    public popBackChosenUnitForDrop(): ActionPlannersTypes.ChosenUnitForDrop {
        return HelpersMisc.getExisted(this.getChosenUnitsForDrop().pop());
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

    public getMovableArea(): AuxiliaryTypesMovableArea.MovableArea | null {
        return this._movableArea;
    }
    public resetMovableArea(): void {
        const unit = HelpersMisc.getExisted(this.getFocusUnit());
        this._movableArea = AuxiliaryTypesMovableArea.MovableArea.create({
            gridIndex       : unit.getGridIndex(),
            maxMoveCost     : unit.getFinalMoveRange(),
            mapSize         : this.getWar().getTileMap().getMapSize(),
            moveCostGetter  : gridIndex => this._getMoveCost(gridIndex, unit)
        });
    }
    private _clearMovableArea(): void {
        this._movableArea = null;
    }

    public getAttackableArea(): AuxiliaryTypesAttackableArea.AttackableArea | null {
        return this._attackableArea;
    }
    public resetAttackableArea(): void {
        const focusUnit             = HelpersMisc.getExisted(this.getFocusUnit());
        const canAttackAfterMoving  = focusUnit.getFinalCanAttackAfterMoving();
        const isLoaded              = focusUnit.getLoaderUnitId() != null;
        const beginningGridIndex    = focusUnit.getGridIndex();
        const hasAmmo               = (!!focusUnit.getPrimaryWeaponCurrentAmmo()) || (focusUnit.checkHasSecondaryWeapon());
        const unitMap               = this.getWar().getUnitMap();
        this._setAttackableArea(AuxiliaryTypesAttackableArea.AttackableArea.create({
            movableArea         : HelpersMisc.getExisted(this.getMovableArea()),
            mapSize             : unitMap.getMapSize(),
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
    private _setAttackableArea(area: AuxiliaryTypesAttackableArea.AttackableArea): void {
        this._attackableArea = area;
    }
    private _clearAttackableArea(): void {
        this._setAttackableArea(new AuxiliaryTypesAttackableArea.AttackableArea([]));
    }

    public getAttackableGridsForUnitWeapon(): GridIndex[] | null {
        return this._attackableGridsForUnitWeapon;
    }
    public setAttackableGridsForUnitWeapon(grids: GridIndex[]): void {
        this._attackableGridsForUnitWeapon = grids;
    }
    public checkHasAttackableGridForUnitWeapon(gridIndex: GridIndex): boolean {
        for (const grid of HelpersMisc.getExisted(this.getAttackableGridsForUnitWeapon())) {
            if (grid.checkIsEqual(gridIndex)) {
                return true;
            }
        }
        return false;
    }
    public createAttackableGridsForUnitWeapon(): GridIndex[] {
        const unit              = HelpersMisc.getExisted(this.getFocusUnit());
        const minAttackRange    = unit.getMinAttackRange();
        if (minAttackRange == null) {
            return [];
        } else {
            const destination = this.getMovePathDestination().getGridIndex();
            return destination.getGridsWithinDistance({
                minDistance : minAttackRange,
                maxDistance : unit.getFinalMaxAttackRange() ?? 0,
                mapSize     : this.getWar().getTileMap().getMapSize(),
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
            : CoSkillsUtilsCommon.getPowerSkillTargetsCount(cfg, skillType);
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
        return this.getMovePathDestination().getGridIndex().getAdjacentGrids(tileMap.getMapSize())
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
        return this.getMovePathDestination().getGridIndex().getAdjacentGrids(tileMap.getMapSize())
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
        this.setMovePath(HelpersMisc.getExisted(this.getMovableArea()).createShortestMovePath(destination));
    }
    public setMovePath(movePath: AuxiliaryTypesMovePathNode.MovePathNode[]): void {
        this._movePath = movePath;
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.ActionPlannerMovePathChanged);
    }
    public getMovePath(): AuxiliaryTypesMovePathNode.MovePathNode[] {
        return this._movePath;
    }
    public getFocusUnitDestination(): GridIndex {
        const movePath  = this.getMovePath();
        const length    = movePath.length;
        return length ? movePath[length - 1].getGridIndex() : HelpersMisc.getExisted(this.getFocusUnitOnMap()).getGridIndex();
    }
    public getMovePathDestination(): AuxiliaryTypesMovePathNode.MovePathNode {
        const movePath = this.getMovePath();
        return movePath[movePath.length - 1];
    }
    public updateMovePathByDestination(destination: GridIndex): void {
        const { x, y }      = destination.getXY();
        const movableArea   = HelpersMisc.getExisted(this.getMovableArea());
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
            const focusUnit     = HelpersMisc.getExisted(this.getFocusUnit());
            const totalMoveCost = HelpersMisc.getExisted(this._getMoveCost(destination, focusUnit)) + prevGrid.getTotalMoveCost();
            if (totalMoveCost > focusUnit.getFinalMoveRange()) {
                return false;
            } else {
                path.push(new AuxiliaryTypesMovePathNode.MovePathNode(
                    destination.clone(),
                    totalMoveCost,
                ));
                return true;
            }
        }
    }

    public generateProtoMovePath(): ProtoSchemaCommonProtoStructureMovePath.MovePath {
        const movePath = this.getMovePath();
        return ProtoSchemaCommonProtoStructureMovePath.MovePath.fromJson({
            nodes           : movePath.map(v => v.getGridIndex().toProto().toJson()),
            isBlocked       : false,
            fuelConsumption : movePath[movePath.length - 1].getTotalMoveCost(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing attackable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitsForPreviewingAttackableArea(): Map<number, IBwUnit> {
        return this._unitsForPreviewAttack;
    }
    public getTilesForPreviewingAttackableArea(): Set<IBwTile> {
        return this._tilesForPreviewAttack;
    }

    public getAreaForPreviewingAttackableArea(): AuxiliaryTypesAttackableArea.AttackableArea {
        return this._areaForPreviewAttack;
    }
    public clearDataForPreviewingAttackableArea(): void {
        this.getUnitsForPreviewingAttackableArea().clear();
        this.getTilesForPreviewingAttackableArea().clear();
        this.getAreaForPreviewingAttackableArea().clear();
    }
    public addUnitForPreviewAttackableArea(unit: IBwUnit): void {
        this.getUnitsForPreviewingAttackableArea().set(unit.getUnitId(), unit);
    }
    public addTileForPreviewAttackableArea(tile: IBwTile): void {
        this.getTilesForPreviewingAttackableArea().add(tile);

        const mapSize = this.getWar().getTileMap().getMapSize();
        this.getAreaForPreviewingAttackableArea().mergeFrom(AuxiliaryTypesAttackableArea.AttackableArea.createForTile(tile, mapSize), mapSize);
    }

    public updateAreaForPreviewingAttackableArea(unit: IBwUnit): void {
        const canAttackAfterMoving  = unit.getFinalCanAttackAfterMoving();
        const beginningGridIndex    = unit.getGridIndex();
        const hasAmmo               = (!!unit.getPrimaryWeaponCurrentAmmo()) || (unit.checkHasSecondaryWeapon());
        const teamIndex             = unit.getTeamIndex();
        const war                   = unit.getWar();
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const mapSize               = tileMap.getMapSize();
        const isIgnoreEnemy         = this.getIsIgnoreEnemyForPreviewingAttackableArea();
        const isIgnoreAlly          = this.getIsIgnoreAllyForPreviewingAttackableArea();
        const checkIsUnitVisible    = createFuncCheckIsUnitVisible(war.getPlayerManager().getWatcherTeamIndexesForSelf());
        const newArea               = AuxiliaryTypesAttackableArea.AttackableArea.create({
            movableArea: AuxiliaryTypesMovableArea.MovableArea.create({
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
        const mapSize               = tileMap.getMapSize();
        const isIgnoreEnemy         = this.getIsIgnoreEnemyForPreviewingAttackableArea();
        const isIgnoreAlly          = this.getIsIgnoreAllyForPreviewingAttackableArea();
        const checkIsUnitVisible    = createFuncCheckIsUnitVisible(war.getPlayerManager().getWatcherTeamIndexesForSelf());

        for (const [, unit] of this.getUnitsForPreviewingAttackableArea()) {
            const canAttackAfterMoving  = unit.getFinalCanAttackAfterMoving();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (!!unit.getPrimaryWeaponCurrentAmmo()) || (unit.checkHasSecondaryWeapon());
            const teamIndex             = unit.getTeamIndex();
            const newArea               = AuxiliaryTypesAttackableArea.AttackableArea.create({
                movableArea: AuxiliaryTypesMovableArea.MovableArea.create({
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

        if (this.getStateId() === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            this._resetAreaForPreviewingAttackableArea();
            this.updateView();
        }
    }

    public getIsIgnoreEnemyForPreviewingAttackableArea(): boolean {
        return this._isIgnoreEnemyForPreviewAttack;
    }
    public setIsIgnoreEnemyForPreviewingAttackableArea(isIgnore: boolean): void {
        this._isIgnoreEnemyForPreviewAttack = isIgnore;

        if (this.getStateId() === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            this._resetAreaForPreviewingAttackableArea();
            this.updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing movable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitForPreviewingMovableArea(): IBwUnit | null {
        return this._unitForPreviewMove;
    }
    public getAreaForPreviewingMovableArea(): AuxiliaryTypesMovableArea.MovableArea | null {
        return this._areaForPreviewMove;
    }
    private _setAreaForPreviewingMovableArea(area: AuxiliaryTypesMovableArea.MovableArea | null): void {
        this._areaForPreviewMove = area;
    }
    public setUnitForPreviewingMovableArea(unit: IBwUnit): void {
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
            this._setAreaForPreviewingMovableArea(AuxiliaryTypesMovableArea.MovableArea.create({
                gridIndex       : movingUnit.getGridIndex(),
                maxMoveCost     : movingUnit.getFinalMoveRange(),
                mapSize         : tileMap.getMapSize(),
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

        if (this.getStateId() === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            this.resetAreaForPreviewingMovableArea();
            this.updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing visible area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitForPreviewingVisibleArea(): IBwUnit | null {
        return this._unitForPreviewVisible;
    }
    public getAreaForPreviewingVisible(): GridIndex[] | null {
        return this._areaForPreviewVisible;
    }
    public clearDataForPreviewingVisibleArea(): void {
        this._unitForPreviewVisible = null;
        this._areaForPreviewVisible = null;
    }
    public setUnitForPreviewingVisibleArea(unit: IBwUnit): void {
        const gridIndex = unit.getGridIndex();
        this._unitForPreviewVisible = unit;
        this._areaForPreviewVisible = gridIndex.getGridsWithinDistance({
            minDistance : 0,
            maxDistance : unit.getFinalVisionRange(unit.getVisionInfo(), gridIndex) ?? 0,
            mapSize     : this.getWar().getTileMap().getMapSize(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _getMoveCost(targetGridIndex: GridIndex, movingUnit: IBwUnit): Undefinable<number> {
        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        if (!targetGridIndex.checkIsInsideMap(unitMap.getMapSize())) {
            return null;
        }

        const existingUnit  = unitMap.getUnitOnMap(targetGridIndex);
        const teamIndex     = movingUnit.getTeamIndex();
        if ((existingUnit)                                      &&
            (existingUnit.getTeamIndex() !== teamIndex)         &&
            (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeam({
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
        const attackableArea = HelpersMisc.getExisted(this.getAttackableArea());
        if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
            return false;
        } else {
            const focusUnit = HelpersMisc.getExisted(this.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                return true;
            } else {
                return focusUnit.checkCanAttackTargetAfterMovePath(
                    HelpersMisc.getExisted(this.getMovableArea()).createShortestMovePath(HelpersMisc.getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination)).map(v => v.getGridIndex()),
                    gridIndex
                );
            }
        }
    }

    public calculateAvailableDropDestination(unitForDrop: IBwUnit, chosenDropDestinations: GridIndex[]): GridIndex[] {
        const loader                = this.getFocusUnit();
        const loaderEndingGridIndex = this.getMovePathDestination().getGridIndex();
        const war                   = this.getWar();
        const tileMap               = war.getTileMap();
        const unitMap               = war.getUnitMap();
        const destinations          = new Array<GridIndex>();
        if (tileMap.getTile(loaderEndingGridIndex).getMoveCostByUnit(unitForDrop) != null) {
            for (const gridIndex of loaderEndingGridIndex.getAdjacentGrids(tileMap.getMapSize())) {
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

function createFuncCheckIsUnitVisible(observerTeamIndexes: Set<number>): (unit: IBwUnit) => boolean {
    const unitVisibleDict = new Map<IBwUnit, boolean>();
    return (unit: IBwUnit): boolean => {
        if (unitVisibleDict.has(unit)) {
            return !!unitVisibleDict.get(unit);
        }

        const gridIndex = unit.getGridIndex();
        const isVisible = VisibilitiesUtils.checkIsUnitOnMapVisibleToTeams({
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

function getState(stateId: ActionPlannersConstants.StateId): ActionPlannersStatesIState.IState {
    switch (stateId) {
        case ActionPlannersConstants.StateId.Idle                             : return ActionPlannersStatesIdle.Idle.getInstance();
        case ActionPlannersConstants.StateId.ExecutingAction                  : return ActionPlannersStatesExecutingAction.ExecutingAction.getInstance();

        case ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget      : return ActionPlannersStatesChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance();
        case ActionPlannersConstants.StateId.ChoosingTileProductionTarget     : return ActionPlannersStatesChoosingTileProductionTarget.ChoosingTileProductionTarget.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitAction               : return ActionPlannersStatesChoosingUnitAction.ChoosingUnitAction.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitAttackTarget         : return ActionPlannersStatesChoosingUnitAttackTarget.ChoosingUnitAttackTarget.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitCrushTarget          : return ActionPlannersStatesChoosingUnitCrushTarget.ChoosingUnitCrushTarget.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitDropDestination      : return ActionPlannersStatesChoosingUnitDropDestination.ChoosingUnitDropDestination.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitFlareDestination     : return ActionPlannersStatesChoosingUnitFlareDestination.ChoosingUnitFlareDestination.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitMovePath             : return ActionPlannersStatesChoosingUnitMovePath.ChoosingUnitMovePath.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitRepairTarget         : return ActionPlannersStatesChoosingUnitRepairTarget.ChoosingUnitRepairTarget.getInstance();
        case ActionPlannersConstants.StateId.ChoosingUnitSiloDestination      : return ActionPlannersStatesChoosingUnitSiloDestination.ChoosingUnitSiloDestination.getInstance();

        case ActionPlannersConstants.StateId.PreviewingTileAttackableArea     : return ActionPlannersStatesPreviewingTileAttackableArea.PreviewingTileAttackableArea.getInstance();
        case ActionPlannersConstants.StateId.PreviewingUnitAttackableArea     : return ActionPlannersStatesPreviewingUnitAttackableArea.PreviewingUnitAttackableArea.getInstance();
        case ActionPlannersConstants.StateId.PreviewingUnitMovableArea        : return ActionPlannersStatesPreviewingUnitMovableArea.PreviewingUnitMovableArea.getInstance();
        case ActionPlannersConstants.StateId.PreviewingUnitVisibleArea        : return ActionPlannersStatesPreviewingUnitVisibleArea.PreviewingUnitVisibleArea.getInstance();

        case ActionPlannersConstants.StateId.RequestingPlayerDeleteUnit       : return ActionPlannersStatesRequestingPlayerDeleteUnit.RequestingPlayerDeleteUnit.getInstance();
        case ActionPlannersConstants.StateId.RequestingPlayerEndTurn          : return ActionPlannersStatesRequestingPlayerEndTurn.RequestingPlayerEndTurn.getInstance();
        case ActionPlannersConstants.StateId.RequestingPlayerProduceUnit      : return ActionPlannersStatesRequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance();
        case ActionPlannersConstants.StateId.RequestingPlayerSurrender        : return ActionPlannersStatesRequestingPlayerSurrender.RequestingPlayerSurrender.getInstance();
        case ActionPlannersConstants.StateId.RequestingPlayerUseCoActiveSkill : return ActionPlannersStatesRequestingPlayerUseCoActiveSkill.RequestingPlayerUseCoActiveSkill.getInstance();
        case ActionPlannersConstants.StateId.RequestingPlayerVoteForDraw      : return ActionPlannersStatesRequestingPlayerVoteForDraw.RequestingPlayerVoteForDraw.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitAttackTile         : return ActionPlannersStatesRequestingUnitAttackTile.RequestingUnitAttackTile.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitAttackUnit         : return ActionPlannersStatesRequestingUnitAttackUnit.RequestingUnitAttackUnit.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitBeLoaded           : return ActionPlannersStatesRequestingUnitBeLoaded.RequestingUnitBeLoaded.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitBoardedByCo        : return ActionPlannersStatesRequestingUnitBoardedByCo.RequestingUnitBoardedByCo.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitBuildTile          : return ActionPlannersStatesRequestingUnitBuildTile.RequestingUnitBuildTile.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitCaptureTile        : return ActionPlannersStatesRequestingUnitCaptureTile.RequestingUnitCaptureTile.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitCrushUnit          : return ActionPlannersStatesRequestingUnitCrushUnit.RequestingUnitCrushUnit.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitDive               : return ActionPlannersStatesRequestingUnitDive.RequestingUnitDive.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitDrop               : return ActionPlannersStatesRequestingUnitDrop.RequestingUnitDrop.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitJoin               : return ActionPlannersStatesRequestingUnitJoin.RequestingUnitJoin.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitLaunchFlare        : return ActionPlannersStatesRequestingUnitLaunchFlare.RequestingUnitLaunchFlare.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitLaunchSilo         : return ActionPlannersStatesRequestingUnitLaunchSilo.RequestingUnitLaunchSilo.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitProduceUnit        : return ActionPlannersStatesRequestingUnitProduceUnit.RequestingUnitProduceUnit.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitRepairUnit         : return ActionPlannersStatesRequestingUnitRepairUnit.RequestingUnitRepairUnit.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitSelfDetonate       : return ActionPlannersStatesRequestingUnitSelfDetonate.RequestingUnitSelfDetonate.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitSupply             : return ActionPlannersStatesRequestingUnitSupply.RequestingUnitSupply.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitSurface            : return ActionPlannersStatesRequestingUnitSurface.RequestingUnitSurface.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitUseCoActiveSkill   : return ActionPlannersStatesRequestingUnitUseCoActiveSkill.RequestingUnitUseCoActiveSkill.getInstance();
        case ActionPlannersConstants.StateId.RequestingUnitWait               : return ActionPlannersStatesRequestingUnitWait.RequestingUnitWait.getInstance();

        default                                         : throw HelpersMisc.newError(`ActionPlanner.getState() invalid stateId: ${stateId}`);
    }
}

function checkIsExecuting(stateId: ActionPlannersConstants.StateId): boolean {
    return ActionPlannersConstants.StateIdsForExecuting.has(stateId);
}
function checkIsRequesting(stateId: ActionPlannersConstants.StateId): boolean {
    return ActionPlannersConstants.StateIdsForRequesting.has(stateId);
}

function generateOpenDataForUnitActionsPanel(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): BaseWarViewBwUnitActionsPanel.OpenData {
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
        throw HelpersMisc.newError(`No actions available?!`);
    }

    return {
        war         : war,
        destination : destination.getGridIndex(),
        actionList  : dataList,
    };
}
function getActionUnitBeLoaded(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    const destination   = actionPlanner.getMovePathDestination().getGridIndex();
    const focusUnit     = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
    if (focusUnit.getGridIndex().checkIsEqual(destination)) {
        return [];
    } else {
        const loader = actionPlanner.getWar().getUnitMap().getUnitOnMap(destination);
        return (loader) && (loader.checkCanLoadUnit(focusUnit))
            ? [{
                actionType  : UnitsConstants.ActionTypeId.BeLoaded,
                callback    : () => ActionPlannersStatesRequestingUnitBeLoaded.RequestingUnitBeLoaded.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitJoin(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    const destination   = actionPlanner.getMovePathDestination().getGridIndex();
    const focusUnit     = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
    if (focusUnit.getGridIndex().checkIsEqual(destination)) {
        return [];
    } else {
        const target = actionPlanner.getWar().getUnitMap().getUnitOnMap(destination);
        return (target) && (focusUnit.checkCanJoinUnit(target))
            ? [{
                actionType  : UnitsConstants.ActionTypeId.Join,
                callback    : () => {
                    const cb = () => ActionPlannersStatesRequestingUnitJoin.RequestingUnitJoin.getInstance().doApplyOnChooseAction(actionPlanner);
                    if (target.getActionState() === UnitsConstants.ActionStateId.Acted) {
                        cb();
                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent  : () => LangUtils.getText(LangConstants.TextType.A0885),
                            callback    : cb,
                        });
                    }
                },
            }]
            : [];
    }
}
function getActionsUnitDropUnit(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    const focusUnit                 = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
    const destination               = actionPlanner.getMovePathDestination();
    const loadedUnits               = focusUnit.getLoadedUnits();
    const chosenUnits               = actionPlanner.getChosenUnitsForDrop();
    const chosenDropDestinations    = actionPlanner.getChosenDropDestinations();
    const actions                   : DataForUnitAction[] = [];
    if ((loadedUnits.length > chosenUnits.length) && (focusUnit.checkCanDropLoadedUnit(actionPlanner.getWar().getTileMap().getTile(destination.getGridIndex()).getTileTypeId()))) {
        for (const unit of loadedUnits) {
            if ((chosenUnits.every(value => value.unit !== unit)) && (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length)) {
                actions.push({
                    actionType  : UnitsConstants.ActionTypeId.DropUnit,
                    callback    : () => ActionPlannersStatesChoosingUnitDropDestination.ChoosingUnitDropDestination.getInstance().doApplyOnChooseAction(actionPlanner, unit),
                    unitForDrop : unit,
                });
            }
        }
    }
    return actions;
}
function getActionUnitUseCoSuperPower(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
        const skillType = CoSkillsConstants.SkillTypeId.SuperPower;
        return !focusUnit.checkCanUseCoSkill(skillType)
            ? []
            : [{
                actionType  : UnitsConstants.ActionTypeId.UseCoSuperPower,
                callback    : () => {
                    const targetsCount = CoSkillsUtilsCommon.getPowerSkillTargetsCount(focusUnit.getPlayer().getCoBasicCfg(), skillType);
                    if (targetsCount <= 0) {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent : () => LangUtils.getText(LangConstants.TextType.A0058),
                            callback: () => {
                                actionPlanner.setCoActiveSkillSkillType(skillType);
                                ActionPlannersStatesRequestingUnitUseCoActiveSkill.RequestingUnitUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null);
                            },
                        });
                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent  : () => LangUtils.getFormattedText(LangConstants.TextType.F0205, targetsCount),
                            callback    : () => ActionPlannersStatesChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnChooseAction(actionPlanner, skillType),
                        });
                    }
                },
            }];
    }
}
function getActionUnitUseCoPower(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
        const skillType = CoSkillsConstants.SkillTypeId.Power;
        return !focusUnit.checkCanUseCoSkill(skillType)
            ? []
            : [{
                actionType  : UnitsConstants.ActionTypeId.UseCoPower,
                callback    : () => {
                    const targetsCount = CoSkillsUtilsCommon.getPowerSkillTargetsCount(focusUnit.getPlayer().getCoBasicCfg(), skillType);
                    if (targetsCount <= 0) {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent : () => LangUtils.getText(LangConstants.TextType.A0054),
                            callback: () => {
                                actionPlanner.setCoActiveSkillSkillType(skillType);
                                ActionPlannersStatesRequestingUnitUseCoActiveSkill.RequestingUnitUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null);
                            },
                        });
                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent  : () => LangUtils.getFormattedText(LangConstants.TextType.F0205, targetsCount),
                            callback    : () => ActionPlannersStatesChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnChooseAction(actionPlanner, skillType),
                        });
                    }
                },
            }];
    }
}
function getActionUnitBoardedByCo(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanCoBoardAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()))
            ? [{
                actionType  : UnitsConstants.ActionTypeId.CoBoard,
                callback    : () => ActionPlannersStatesRequestingUnitBoardedByCo.RequestingUnitBoardedByCo.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitAttack(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    return actionPlanner.createAttackableGridsForUnitWeapon().length
        ? [{
            actionType  : UnitsConstants.ActionTypeId.Attack,
            callback    : () => ActionPlannersStatesChoosingUnitAttackTarget.ChoosingUnitAttackTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }]
        : [];
}
function getActionUnitCapture(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanCaptureTile(actionPlanner.getWar().getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex())))
            ? [{
                actionType: UnitsConstants.ActionTypeId.CaptureTile,
                callback: () => ActionPlannersStatesRequestingUnitCaptureTile.RequestingUnitCaptureTile.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitCrushUnit(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if ((actionPlanner.getChosenUnitsForDrop().length)                  ||
        (!actionPlanner.getUnitCrushCandidateGridIndexArray().length)
    ) {
        return [];
    } else {
        return [{
            actionType  : UnitsConstants.ActionTypeId.CrushUnit,
            callback    : () => ActionPlannersStatesChoosingUnitCrushTarget.ChoosingUnitCrushTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }];
    }
}
function getActionUnitDive(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanDive())
            ? [{
                actionType: UnitsConstants.ActionTypeId.Dive,
                callback: () => ActionPlannersStatesRequestingUnitDive.RequestingUnitDive.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitSurface(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanSurface())
            ? [{
                actionType  : UnitsConstants.ActionTypeId.Surface,
                callback    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent  : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                    callback    : () => ActionPlannersStatesRequestingUnitSurface.RequestingUnitSurface.getInstance().doApplyOnChooseAction(actionPlanner),
                }),
            }]
            : [];
    }
}
function getActionsUnitLaunchUnit(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    const dataList  : DataForUnitAction[] = [];
    const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
    if ((focusUnit !== actionPlanner.getFocusUnitLoaded()) && (actionPlanner.getMovePath().length === 1) && (focusUnit.checkCanLaunchLoadedUnit())) {
        const tile = actionPlanner.getWar().getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex());
        for (const unit of focusUnit.getLoadedUnits()) {
            if ((unit.getActionState() === UnitsConstants.ActionStateId.Idle) && (tile.getMoveCostByUnit(unit) != null)) {
                dataList.push({
                    actionType      : UnitsConstants.ActionTypeId.LaunchUnit,
                    callback        : () => ActionPlannersStatesChoosingUnitMovePath.ChoosingUnitMovePath.getInstance().doApplyOnChooseAction(actionPlanner, unit),
                    unitForLaunch   : unit,
                });
            }
        }
    }
    return dataList;
}
function getActionUnitRepairUnit(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if ((actionPlanner.getChosenUnitsForDrop().length)                  ||
        (!actionPlanner.getUnitRepairCandidateGridIndexArray().length)
    ) {
        return [];
    } else {
        return [{
            actionType  : UnitsConstants.ActionTypeId.RepairUnit,
            callback    : () => ActionPlannersStatesChoosingUnitRepairTarget.ChoosingUnitRepairTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }];
    }
}
function getActionUnitSelfDetonate(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const selfDetonateCfg = HelpersMisc.getExisted(actionPlanner.getFocusUnit()).getTemplateCfg().getSelfDetonateCfg();
        if (selfDetonateCfg) {
            return [{
                actionType  : UnitsConstants.ActionTypeId.SelfDetonate,
                callback    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent  : () => LangUtils.getFormattedText(LangConstants.TextType.F0209, selfDetonateCfg.getRadius(), selfDetonateCfg.getDamage()),
                    callback    : () => ActionPlannersStatesRequestingUnitSelfDetonate.RequestingUnitSelfDetonate.getInstance().doApplyOnChooseAction(actionPlanner),
                }),
            }];
        }
        return [];
    }
}
function getActionUnitSupply(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, canDropUnits: boolean): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit     = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
        const playerIndex   = focusUnit.getPlayerIndex();
        const unitMap       = actionPlanner.getWar().getUnitMap();
        if (focusUnit.checkIsAdjacentUnitSupplier()) {
            for (const gridIndex of actionPlanner.getMovePathDestination().getGridIndex().getAdjacentGrids(unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    const cb = () => ActionPlannersStatesRequestingUnitSupply.RequestingUnitSupply.getInstance().doApplyOnChooseAction(actionPlanner);
                    return [{
                        actionType  : UnitsConstants.ActionTypeId.Supply,
                        callback    : !canDropUnits
                            ? cb
                            : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                                getContent  : () => LangUtils.getText(LangConstants.TextType.A0055),
                                callback    : cb,
                            }),
                    }];
                }
            }
        }
        return [];
    }
}
function getActionUnitBuildTile(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, canDropUnits: boolean): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const destination   = actionPlanner.getMovePathDestination().getGridIndex();
        const tile          = actionPlanner.getWar().getTileMap().getTile(destination);
        if (!HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanBuildOnTile(tile)) {
            return [];
        } else {
            const cb = () => ActionPlannersStatesRequestingUnitBuildTile.RequestingUnitBuildTile.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType  : UnitsConstants.ActionTypeId.BuildTile,
                callback    : !canDropUnits
                    ? cb
                    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent  : () => LangUtils.getText(LangConstants.TextType.A0055),
                        callback    : cb,
                    }),
            }];
        }
    }
}
function getActionUnitLaunchFlare(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    const focusUnit = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
    const movePath  = actionPlanner.getMovePath();
    if ((!actionPlanner.getWar().getFogMap().checkHasFogCurrently())    ||
        (movePath.length !== 1)                                 ||
        (!focusUnit.getFlareCurrentAmmo())
    ) {
        return [];
    } else {
        return [{
            actionType  : UnitsConstants.ActionTypeId.LaunchFlare,
            callback    : () => ActionPlannersStatesChoosingUnitFlareDestination.ChoosingUnitFlareDestination.getInstance().doApplyOnChooseAction(
                actionPlanner,
                HelpersMisc.getExisted(focusUnit.getFlareRadius(movePath[movePath.length - 1].getGridIndex()))
            ),
        }];
    }
}
function getActionUnitLaunchSilo(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    const war   = actionPlanner.getWar();
    const tile  = war.getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex());
    return (HelpersMisc.getExisted(actionPlanner.getFocusUnit()).checkCanLaunchSiloOnTile(tile))
        ? [{
            actionType  : UnitsConstants.ActionTypeId.LaunchSilo,
            callback    : () => ActionPlannersStatesChoosingUnitSiloDestination.ChoosingUnitSiloDestination.getInstance().doApplyOnChooseAction(
                actionPlanner,
                HelpersMisc.getExisted(tile.getTemplateCfg().getLaunchSiloParams())[2]
            ),
        }]
        : [];
}
function getActionUnitProduceUnit(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner): DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit         = HelpersMisc.getExisted(actionPlanner.getFocusUnit());
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

        if (HelpersMisc.getExisted(focusUnit.getCurrentProduceMaterial()) < 1) {
            return [{
                actionType          : UnitsConstants.ActionTypeId.ProduceUnit,
                callback            : () => FloatText2.show(LangUtils.getText(LangConstants.TextType.B0051)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else if (focusUnit.getLoadedUnitsCount() >= HelpersMisc.getExisted(focusUnit.getMaxLoadUnitsCount())) {
            return [{
                actionType          : UnitsConstants.ActionTypeId.ProduceUnit,
                callback            : () => FloatText2.show(LangUtils.getText(LangConstants.TextType.B0052)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else if (player.getFund() < costForProduceUnit) {
            return [{
                actionType          : UnitsConstants.ActionTypeId.ProduceUnit,
                callback            : () => FloatText2.show(LangUtils.getText(LangConstants.TextType.B0053)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else if ((maxUnitsCount != null) && (currentUnitsCount >= maxUnitsCount)) {
            return [{
                actionType          : UnitsConstants.ActionTypeId.ProduceUnit,
                callback            : () => FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0266, currentUnitsCount, maxUnitsCount)),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        } else {
            return [{
                actionType          : UnitsConstants.ActionTypeId.ProduceUnit,
                callback            : () => ActionPlannersStatesRequestingUnitProduceUnit.RequestingUnitProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner),
                costForProduceUnit  : costForProduceUnit,
                produceUnitType     : produceUnitType,
            }];
        }
    }
}
function getActionUnitWait(actionPlanner: ActionPlannersIActionPlanner.IActionPlanner, hasOtherAction: boolean): DataForUnitAction[] {
    const existingUnit = actionPlanner.getWar().getUnitMap().getVisibleUnitOnMap(actionPlanner.getMovePathDestination().getGridIndex());
    if ((existingUnit) && (existingUnit !== actionPlanner.getFocusUnit())) {
        return [];
    } else {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            const cb = () => ActionPlannersStatesRequestingUnitDrop.RequestingUnitDrop.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType  : UnitsConstants.ActionTypeId.Wait,
                callback    : !hasOtherAction
                    ? cb
                    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent  : () => LangUtils.getText(LangConstants.TextType.A0055),
                        callback    : cb,
                    }),
            }];
        } else {
            const cb = () => ActionPlannersStatesRequestingUnitWait.RequestingUnitWait.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType  : UnitsConstants.ActionTypeId.Wait,
                callback    : !hasOtherAction
                    ? cb
                    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent  : () => LangUtils.getText(LangConstants.TextType.A0055),
                        callback    : cb,
                    }),
            }];
        }
    }
}
