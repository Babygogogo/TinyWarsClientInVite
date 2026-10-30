import {
    ActionPlanners_ActionPlannerView,
    AuxiliaryTypes_AttackableArea,
    ActionPlanners_States_ChoosingCoActiveSkillTarget,
    ActionPlanners_States_ChoosingTileProductionTarget,
    ActionPlanners_States_ChoosingUnitAction,
    ActionPlanners_States_ChoosingUnitAttackTarget,
    ActionPlanners_States_ChoosingUnitCrushTarget,
    ActionPlanners_States_ChoosingUnitDropDestination,
    ActionPlanners_States_ChoosingUnitFlareDestination,
    ActionPlanners_States_ChoosingUnitMovePath,
    ActionPlanners_States_ChoosingUnitRepairTarget,
    ActionPlanners_States_ChoosingUnitSiloDestination,
    ActionPlanners_States_ExecutingAction,
    CoSkills_Utils_Common,
    HalfwayReplayWar_Model_HrwWar,
    ActionPlanners_States_Idle,
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovableArea,
    AuxiliaryTypes_MovePathNode,
    MultiPlayerWar_Model_MpwWar,
    ActionPlanners_States_PreviewingTileAttackableArea,
    ActionPlanners_States_PreviewingUnitAttackableArea,
    ActionPlanners_States_PreviewingUnitMovableArea,
    ActionPlanners_States_PreviewingUnitVisibleArea,
    ActionPlanners_States_RequestingPlayerDeleteUnit,
    ActionPlanners_States_RequestingPlayerEndTurn,
    ActionPlanners_States_RequestingPlayerProduceUnit,
    ActionPlanners_States_RequestingPlayerSurrender,
    ActionPlanners_States_RequestingPlayerUseCoActiveSkill,
    ActionPlanners_States_RequestingPlayerVoteForDraw,
    ActionPlanners_States_RequestingUnitAttackTile,
    ActionPlanners_States_RequestingUnitAttackUnit,
    ActionPlanners_States_RequestingUnitBeLoaded,
    ActionPlanners_States_RequestingUnitBoardedByCo,
    ActionPlanners_States_RequestingUnitBuildTile,
    ActionPlanners_States_RequestingUnitCaptureTile,
    ActionPlanners_States_RequestingUnitCrushUnit,
    ActionPlanners_States_RequestingUnitDive,
    ActionPlanners_States_RequestingUnitDrop,
    ActionPlanners_States_RequestingUnitJoin,
    ActionPlanners_States_RequestingUnitLaunchFlare,
    ActionPlanners_States_RequestingUnitLaunchSilo,
    ActionPlanners_States_RequestingUnitProduceUnit,
    ActionPlanners_States_RequestingUnitRepairUnit,
    ActionPlanners_States_RequestingUnitSelfDetonate,
    ActionPlanners_States_RequestingUnitSupply,
    ActionPlanners_States_RequestingUnitSurface,
    ActionPlanners_States_RequestingUnitUseCoActiveSkill,
    ActionPlanners_States_RequestingUnitWait,
    ReplayWar_Model_RwWar,
    FloatText,
    CoSkills_Constants,
    SinglePlayerWar_Model_SpwWar,
    ActionPlanners_Constants,
    TestWar_Model_TwWar,
    type ActionPlanners_Types,
    type BaseWar_Model_BwTypes,
    type AuxiliaryTypes_GridIndex,
    type ActionPlanners_IActionPlanner,
    type ActionPlanners_IActionPlannerView,
    type BaseWar_Interface_IBwWar,
    type ActionPlanners_States_IState,
    type BaseWar_View_BwUnitActionsPanel,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Constants,
    Notifications_Dispatcher,
    Visibilities_Utils,
    Utils_ClientErrorCode,
    GamePanels_Manager,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Users_Model,
    Logger,
    Lang_Constants,
    Notifications_TypeId,
    type Notifications_DataTypes,
    type Egret_Egret,
    type Tiles_ITile,
    type Units_IUnit,
    type Notifications_Types,
    type AuxiliaryTypes_MapSize,
} from "../internal.ts";

import { MovePath } from "../proto/schema/CommonProto/Structure/MovePath.ts";

export class ActionPlanner implements ActionPlanners_IActionPlanner.IActionPlanner {
    private readonly _view                      = new ActionPlanners_ActionPlannerView.ActionPlannerView();

    private _war?                               : BaseWar_Interface_IBwWar.IBwWar;
    private _mapSize?                           : AuxiliaryTypes_MapSize.MapSize;

    private _stateId                            = ActionPlanners_Constants.StateId.Idle;
    private _prevStateId                        = ActionPlanners_Constants.StateId.Idle;

    private _focusUnitOnMap                     : Units_IUnit.IUnit | null = null;
    private _focusUnitLoaded                    : Units_IUnit.IUnit | null = null;
    private _choosingUnitForDrop                : Units_IUnit.IUnit | null = null;
    private _chosenUnitsForDrop                 : ActionPlanners_Types.ChosenUnitForDrop[] = [];
    private _availableDropDestinations          : AuxiliaryTypes_GridIndex.GridIndex[] | null = null;
    private _movableArea                        : AuxiliaryTypes_MovableArea.MovableArea | null = null;
    private _attackableArea                     : AuxiliaryTypes_AttackableArea.AttackableArea | null = null;
    private _attackableGridsForUnitWeapon       : AuxiliaryTypes_GridIndex.GridIndex[] | null = null;
    private _movePath                           : AuxiliaryTypes_MovePathNode.MovePathNode[] = [];
    private _coActiveSkillSkillType             : CoSkills_Constants.SkillTypeId | null = null;
    private _coActiveSkillTargetGridIndexArray  : AuxiliaryTypes_GridIndex.GridIndex[] | null = null;
    private _unitCrushTargetGridIndex           : AuxiliaryTypes_GridIndex.GridIndex | null = null;
    private _unitRepairTargetGridIndex          : AuxiliaryTypes_GridIndex.GridIndex | null = null;

    private _unitsForPreviewAttack              = new Map<number, Units_IUnit.IUnit>();
    private _tilesForPreviewAttack              = new Set<Tiles_ITile.ITile>();
    private _areaForPreviewAttack               = new AuxiliaryTypes_AttackableArea.AttackableArea([]);
    private _unitForPreviewMove                 : Units_IUnit.IUnit | null = null;
    private _areaForPreviewMove                 : AuxiliaryTypes_MovableArea.MovableArea | null = null;
    private _unitForPreviewVisible              : Units_IUnit.IUnit | null = null;
    private _areaForPreviewVisible              : AuxiliaryTypes_GridIndex.GridIndex[] | null = null;

    private _isIgnoreAllyForPreviewAttack       = true;
    private _isIgnoreEnemyForPreviewAttack      = true;
    private _isIgnoreEnemyForPreviewMove        = true;

    private _notifyListeners: Notifications_Types.Listener[] = [
        { type : Notifications_TypeId.TypeId.BwCursorTapped,      callback : this._onNotifyBwCursorTapped },
        { type : Notifications_TypeId.TypeId.BwCursorDragged,     callback : this._onNotifyBwCursorDragged },
        { type : Notifications_TypeId.TypeId.BwCursorDragEnded,   callback : this._onNotifyBwCursorDragEnded },
    ];

    public init(mapSize: AuxiliaryTypes_MapSize.MapSize): void {
        this._setMapSize(mapSize.clone());

        this.getView().init(this);
    }
    public fastInit(): void {
        this.getView().fastInit(this);
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;

        ActionPlanners_States_Idle.Idle.getInstance().apply(this);
        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war, Utils_ClientErrorCode.ClientErrorCode.ActionPlanner_GetWar_00);
    }

    public getPlayerIndexLoggedIn(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        const war = this.getWar();
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            return war.getPlayerIndexLoggedIn();
        } else {
            return undefined;
        }
    }
    public getSelfPlayerIndexSet(): Set<number> {
        const war = this.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            return new Set();

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return new Set();

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const playerIndex = this.getPlayerIndexLoggedIn();
            return playerIndex == null ? new Set() : new Set([playerIndex]);

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            return new Set();

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const playerIndexSet = new Set<number>();
            for (const [playerIndex, player] of this.getWar().getPlayerManager().getAllPlayersDict()) {
                if ((!player.checkIsNeutral()) && (player.getUserId() != null)) {
                    playerIndexSet.add(playerIndex);
                }
            }

            return playerIndexSet;

        } else if (war instanceof TestWar_Model_TwWar.TwWar) {
            return new Set();

        } else {
            throw Helpers_Misc.newError(`Invalid war.`);
        }
    }
    public checkCanControlUnit(unit: Units_IUnit.IUnit): boolean {
        const war = this.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            return false;

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            return false;

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const playerInTurn = war.getPlayerInTurn();
            return (playerInTurn.getUserId() === Users_Model.getSelfUserId())
                && (playerInTurn.getPlayerIndex() === unit.getPlayerIndex());

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            return false;

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const playerInTurn = war.getPlayerInTurn();
            return (unit.getPlayerIndex() === playerInTurn.getPlayerIndex())
                && (playerInTurn.getUserId() != null);

        } else if (war instanceof TestWar_Model_TwWar.TwWar) {
            return false;

        } else {
            throw Helpers_Misc.newError(`Invalid war.`);
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
        if (Users_Model.getSelfSettingsIsAutoScrollMap()) {
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

    private _onNotifyBwCursorDragged(e: Egret_Egret.Event): void {
        const war = this.getWar();
        if (Users_Model.getSelfSettingsIsAutoScrollMap()) {
            war.getView().tweenGridToCentralArea((e.data as Notifications_DataTypes.BwCursorDragged).draggedTo);
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
    public getStateId(): ActionPlanners_Constants.StateId {
        return this._stateId;
    }
    public getPreviousStateId(): ActionPlanners_Constants.StateId {
        return this._prevStateId;
    }
    public setStateId(stateId: ActionPlanners_Constants.StateId): void {
        const isChanged = this._stateId !== stateId;
        this._prevStateId = this._stateId;
        this._stateId     = stateId;

        Logger.log(`ActionPlanner.setStateId() ${stateId}`);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.ActionPlannerStateSet);
        (isChanged) && (Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.ActionPlannerStateChanged));
    }

    public cancelCurrentState(): void {
        getState(this.getStateId()).cancel(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): ActionPlanners_IActionPlannerView.IActionPlannerView {
        return this._view;
    }
    public updateView(): void {
        const war = this.getWar();
        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
                GamePanels_Manager.openPanel(
                    GamePanels_Dict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) || (currState === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget)) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwDamagePreviewPanel, { war : this.getWar() });
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            // nothing to do

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
                GamePanels_Manager.openPanel(
                    GamePanels_Dict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) || (currState === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget)) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwDamagePreviewPanel, { war : this.getWar() });
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
                GamePanels_Manager.openPanel(
                    GamePanels_Dict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) || (currState === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget)) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwDamagePreviewPanel, { war : this.getWar() });
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            this.getView().updateView();

            const currState = this.getStateId();
            if (currState === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
                GamePanels_Manager.openPanel(
                    GamePanels_Dict.getDict().BwUnitActionsPanel,
                    generateOpenDataForUnitActionsPanel(this),
                );
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitActionsPanel);
            }
            if ((currState === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) || (currState === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget)) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwDamagePreviewPanel, { war : this.getWar() });
            } else {
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwDamagePreviewPanel);
            }

        } else if (war instanceof TestWar_Model_TwWar.TwWar) {
            // nothing to do

        } else {
            throw Helpers_Misc.newError(`Invalid war.`);
        }
    }

    private _setMapSize(size: AuxiliaryTypes_MapSize.MapSize): void {
        this._mapSize = size;
    }
    public getMapSize(): AuxiliaryTypes_MapSize.MapSize {
        return Helpers_Misc.getExisted(this._mapSize);
    }

    public checkIsStateRequesting(): boolean {
        return checkIsRequesting(this.getStateId());
    }

    public getFocusUnit(): Units_IUnit.IUnit | null {
        return this.getFocusUnitLoaded() || this.getFocusUnitOnMap();
    }
    public getFocusUnitOnMap(): Units_IUnit.IUnit | null {
        return this._focusUnitOnMap;
    }
    public setFocusUnitOnMap(unit: Units_IUnit.IUnit): void {
        this._focusUnitOnMap = unit;
    }
    public clearFocusUnitOnMap(): void {
        this._focusUnitOnMap = null;
    }

    public getFocusUnitLoaded(): Units_IUnit.IUnit | null {
        return this._focusUnitLoaded;
    }
    public setFocusUnitLoaded(unit: Units_IUnit.IUnit): void {
        this._focusUnitLoaded = unit;
    }
    public clearFocusUnitLoaded(): void {
        this._focusUnitLoaded = null;
    }
    public getUnitIdForFocusUnitLoaded(): number | null {
        return this.getFocusUnitLoaded()?.getUnitId() ?? null;
    }

    public getAvailableDropDestinations(): AuxiliaryTypes_GridIndex.GridIndex[] | null {
        return this._availableDropDestinations;
    }
    public setAvailableDropDestinations(destinations: AuxiliaryTypes_GridIndex.GridIndex[]): void {
        this._availableDropDestinations = destinations;
    }
    public clearAvailableDropDestinations(): void {
        this._availableDropDestinations = null;
    }

    public getChoosingUnitForDrop(): Units_IUnit.IUnit | null {
        return this._choosingUnitForDrop;
    }
    public setChoosingUnitForDrop(unit: Units_IUnit.IUnit): void {
        this._choosingUnitForDrop = unit;
    }
    public clearChoosingUnitForDrop(): void {
        this._choosingUnitForDrop = null;
    }

    public getChosenUnitsForDrop(): ActionPlanners_Types.ChosenUnitForDrop[] {
        return this._chosenUnitsForDrop;
    }
    public pushBackChosenUnitForDrop(data: ActionPlanners_Types.ChosenUnitForDrop): void {
        this._chosenUnitsForDrop.push(data);
    }
    public popBackChosenUnitForDrop(): ActionPlanners_Types.ChosenUnitForDrop {
        return Helpers_Misc.getExisted(this.getChosenUnitsForDrop().pop());
    }
    public clearChosenUnitsForDrop(): void {
        this._chosenUnitsForDrop.length = 0;
    }
    public getChosenDropDestinations(): AuxiliaryTypes_GridIndex.GridIndex[] {
        const destinations: AuxiliaryTypes_GridIndex.GridIndex[] = [];
        for (const data of this.getChosenUnitsForDrop()) {
            destinations.push(data.destination);
        }
        return destinations;
    }

    public getMovableArea(): AuxiliaryTypes_MovableArea.MovableArea | null {
        return this._movableArea;
    }
    public resetMovableArea(): void {
        const unit = Helpers_Misc.getExisted(this.getFocusUnit());
        this._movableArea = AuxiliaryTypes_MovableArea.MovableArea.create({
            gridIndex      : unit.getGridIndex(),
            maxMoveCost    : unit.getFinalMoveRange(),
            mapSize        : this.getMapSize(),
            moveCostGetter : gridIndex => this._getMoveCost(gridIndex, unit),
        });
    }
    private _clearMovableArea(): void {
        this._movableArea = null;
    }

    public getAttackableArea(): AuxiliaryTypes_AttackableArea.AttackableArea | null {
        return this._attackableArea;
    }
    public resetAttackableArea(): void {
        const focusUnit             = Helpers_Misc.getExisted(this.getFocusUnit());
        const canAttackAfterMoving  = focusUnit.getFinalCanAttackAfterMoving();
        const isLoaded              = focusUnit.getLoaderUnitId() != null;
        const beginningGridIndex    = focusUnit.getGridIndex();
        const hasAmmo               = (!!focusUnit.getPrimaryWeaponCurrentAmmo()) || (focusUnit.checkHasSecondaryWeapon());
        const unitMap               = this.getWar().getUnitMap();
        this._setAttackableArea(AuxiliaryTypes_AttackableArea.AttackableArea.create({
            movableArea    : Helpers_Misc.getExisted(this.getMovableArea()),
            mapSize        : this.getMapSize(),
            minAttackRange : focusUnit.getMinAttackRange(),
            maxAttackRange : focusUnit.getFinalMaxAttackRange(),
            checkCanAttack : (moveGridIndex): boolean => {
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
            },
        }));
    }
    private _setAttackableArea(area: AuxiliaryTypes_AttackableArea.AttackableArea): void {
        this._attackableArea = area;
    }
    private _clearAttackableArea(): void {
        this._setAttackableArea(new AuxiliaryTypes_AttackableArea.AttackableArea([]));
    }

    public getAttackableGridsForUnitWeapon(): AuxiliaryTypes_GridIndex.GridIndex[] | null {
        return this._attackableGridsForUnitWeapon;
    }
    public setAttackableGridsForUnitWeapon(grids: AuxiliaryTypes_GridIndex.GridIndex[]): void {
        this._attackableGridsForUnitWeapon = grids;
    }
    public checkHasAttackableGridForUnitWeapon(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean {
        for (const grid of Helpers_Misc.getExisted(this.getAttackableGridsForUnitWeapon())) {
            if (grid.checkIsEqual(gridIndex)) {
                return true;
            }
        }
        return false;
    }
    public createAttackableGridsForUnitWeapon(): AuxiliaryTypes_GridIndex.GridIndex[] {
        const unit              = Helpers_Misc.getExisted(this.getFocusUnit());
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
            : CoSkills_Utils_Common.getPowerSkillTargetsCount(cfg, skillType);
    }

    public getCoActiveSkillTargetGridIndexArray(): AuxiliaryTypes_GridIndex.GridIndex[] | null {
        return this._coActiveSkillTargetGridIndexArray;
    }
    public checkHasCoActiveSkillTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean {
        return this.getCoActiveSkillTargetGridIndexArray()?.some(v => v.checkIsEqual(gridIndex)) ?? false;
    }
    public addCoActiveSkillTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        (this._coActiveSkillTargetGridIndexArray ??= []).push(gridIndex);
    }
    public deleteCoActiveSkillTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
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
    public getUnitCrushTargetGridIndex(): AuxiliaryTypes_GridIndex.GridIndex | null {
        return this._unitCrushTargetGridIndex;
    }
    public setUnitCrushTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._unitCrushTargetGridIndex = gridIndex.clone();
    }
    public clearUnitCrushTargetGridIndex(): void {
        this._unitCrushTargetGridIndex = null;
    }
    public getUnitCrushCandidateGridIndexArray(): AuxiliaryTypes_GridIndex.GridIndex[] {
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
    public getUnitRepairTargetGridIndex(): AuxiliaryTypes_GridIndex.GridIndex | null {
        return this._unitRepairTargetGridIndex;
    }
    public setUnitRepairTargetGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._unitRepairTargetGridIndex = gridIndex.clone();
    }
    public clearUnitRepairTargetGridIndex(): void {
        this._unitRepairTargetGridIndex = null;
    }
    public getUnitRepairCandidateGridIndexArray(): AuxiliaryTypes_GridIndex.GridIndex[] {
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
    public resetMovePathAsShortest(destination: AuxiliaryTypes_GridIndex.GridIndex): void {
        this.setMovePath(Helpers_Misc.getExisted(this.getMovableArea()).createShortestMovePath(destination));
    }
    public setMovePath(movePath: AuxiliaryTypes_MovePathNode.MovePathNode[]): void {
        this._movePath = movePath;
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.ActionPlannerMovePathChanged);
    }
    public getMovePath(): AuxiliaryTypes_MovePathNode.MovePathNode[] {
        return this._movePath;
    }
    public getFocusUnitDestination(): AuxiliaryTypes_GridIndex.GridIndex {
        const movePath  = this.getMovePath();
        const length    = movePath.length;
        return length ? movePath[length - 1].getGridIndex() : Helpers_Misc.getExisted(this.getFocusUnitOnMap()).getGridIndex();
    }
    public getMovePathDestination(): AuxiliaryTypes_MovePathNode.MovePathNode {
        const movePath = this.getMovePath();
        return movePath[movePath.length - 1];
    }
    public updateMovePathByDestination(destination: AuxiliaryTypes_GridIndex.GridIndex): void {
        const { x, y }      = destination.getXY();
        const movableArea   = Helpers_Misc.getExisted(this.getMovableArea());
        const currPath      = this.getMovePath();
        if ((movableArea.checkHasGrid(x, y)) && (!currPath[currPath.length - 1].getGridIndex().checkIsEqual(destination))) {
            if ((!this._checkAndTruncateMovePath(destination)) && (!this._checkAndExtendMovePath(destination))) {
                this.resetMovePathAsShortest(destination);
            }
        }
    }
    private _checkAndTruncateMovePath(destination: AuxiliaryTypes_GridIndex.GridIndex): boolean {
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
    private _checkAndExtendMovePath(destination: AuxiliaryTypes_GridIndex.GridIndex): boolean {
        const path      = this.getMovePath();
        const length    = path.length;
        const prevGrid  = path[length - 1];
        if (!prevGrid.getGridIndex().checkIsAdjacent(destination)) {
            return false;
        } else {
            const focusUnit     = Helpers_Misc.getExisted(this.getFocusUnit());
            const totalMoveCost = Helpers_Misc.getExisted(this._getMoveCost(destination, focusUnit)) + prevGrid.getTotalMoveCost();
            if (totalMoveCost > focusUnit.getFinalMoveRange()) {
                return false;
            } else {
                path.push(new AuxiliaryTypes_MovePathNode.MovePathNode(
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
    public getUnitsForPreviewingAttackableArea(): Map<number, Units_IUnit.IUnit> {
        return this._unitsForPreviewAttack;
    }
    public getTilesForPreviewingAttackableArea(): Set<Tiles_ITile.ITile> {
        return this._tilesForPreviewAttack;
    }

    public getAreaForPreviewingAttackableArea(): AuxiliaryTypes_AttackableArea.AttackableArea {
        return this._areaForPreviewAttack;
    }
    public clearDataForPreviewingAttackableArea(): void {
        this.getUnitsForPreviewingAttackableArea().clear();
        this.getTilesForPreviewingAttackableArea().clear();
        this.getAreaForPreviewingAttackableArea().clear();
    }
    public addUnitForPreviewAttackableArea(unit: Units_IUnit.IUnit): void {
        this.getUnitsForPreviewingAttackableArea().set(unit.getUnitId(), unit);
    }
    public addTileForPreviewAttackableArea(tile: Tiles_ITile.ITile): void {
        this.getTilesForPreviewingAttackableArea().add(tile);

        const mapSize = this.getMapSize();
        this.getAreaForPreviewingAttackableArea().mergeFrom(AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize), mapSize);
    }

    public updateAreaForPreviewingAttackableArea(unit: Units_IUnit.IUnit): void {
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
        const newArea               = AuxiliaryTypes_AttackableArea.AttackableArea.create({
            movableArea : AuxiliaryTypes_MovableArea.MovableArea.create({
                gridIndex      : beginningGridIndex,
                maxMoveCost    : unit.getFinalMoveRange(),
                mapSize        : mapSize,
                moveCostGetter : targetGridIndex => {
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
            mapSize        : mapSize,
            minAttackRange : unit.getMinAttackRange(),
            maxAttackRange : unit.getFinalMaxAttackRange(),
            checkCanAttack : moveGridIndex => {
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
            const newArea               = AuxiliaryTypes_AttackableArea.AttackableArea.create({
                movableArea : AuxiliaryTypes_MovableArea.MovableArea.create({
                    gridIndex      : beginningGridIndex,
                    maxMoveCost    : unit.getFinalMoveRange(),
                    mapSize        : mapSize,
                    moveCostGetter : targetGridIndex => {
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
                mapSize        : mapSize,
                minAttackRange : unit.getMinAttackRange(),
                maxAttackRange : unit.getFinalMaxAttackRange(),
                checkCanAttack : moveGridIndex => {
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

        if (this.getStateId() === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            this._resetAreaForPreviewingAttackableArea();
            this.updateView();
        }
    }

    public getIsIgnoreEnemyForPreviewingAttackableArea(): boolean {
        return this._isIgnoreEnemyForPreviewAttack;
    }
    public setIsIgnoreEnemyForPreviewingAttackableArea(isIgnore: boolean): void {
        this._isIgnoreEnemyForPreviewAttack = isIgnore;

        if (this.getStateId() === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            this._resetAreaForPreviewingAttackableArea();
            this.updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing movable area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitForPreviewingMovableArea(): Units_IUnit.IUnit | null {
        return this._unitForPreviewMove;
    }
    public getAreaForPreviewingMovableArea(): AuxiliaryTypes_MovableArea.MovableArea | null {
        return this._areaForPreviewMove;
    }
    private _setAreaForPreviewingMovableArea(area: AuxiliaryTypes_MovableArea.MovableArea | null): void {
        this._areaForPreviewMove = area;
    }
    public setUnitForPreviewingMovableArea(unit: Units_IUnit.IUnit): void {
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
            this._setAreaForPreviewingMovableArea(AuxiliaryTypes_MovableArea.MovableArea.create({
                gridIndex      : movingUnit.getGridIndex(),
                maxMoveCost    : movingUnit.getFinalMoveRange(),
                mapSize        : this.getMapSize(),
                moveCostGetter : targetGridIndex => {
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

        if (this.getStateId() === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            this.resetAreaForPreviewingMovableArea();
            this.updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for previewing visible area.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getUnitForPreviewingVisibleArea(): Units_IUnit.IUnit | null {
        return this._unitForPreviewVisible;
    }
    public getAreaForPreviewingVisible(): AuxiliaryTypes_GridIndex.GridIndex[] | null {
        return this._areaForPreviewVisible;
    }
    public clearDataForPreviewingVisibleArea(): void {
        this._unitForPreviewVisible = null;
        this._areaForPreviewVisible = null;
    }
    public setUnitForPreviewingVisibleArea(unit: Units_IUnit.IUnit): void {
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
    private _getMoveCost(targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex, movingUnit: Units_IUnit.IUnit): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        const war = this.getWar();
        if (!targetGridIndex.checkIsInsideMap(this.getMapSize())) {
            return null;
        }

        const existingUnit  = war.getUnitMap().getUnitOnMap(targetGridIndex);
        const teamIndex     = movingUnit.getTeamIndex();
        if ((existingUnit)                                      &&
            (existingUnit.getTeamIndex() !== teamIndex)         &&
            (Visibilities_Utils.checkIsUnitOnMapVisibleToTeam({
                war               : war,
                gridIndex         : targetGridIndex,
                unitType          : existingUnit.getUnitType(),
                isDiving          : existingUnit.getIsDiving(),
                isInvisible       : existingUnit.checkIsInvisible(targetGridIndex),
                unitPlayerIndex   : existingUnit.getPlayerIndex(),
                observerTeamIndex : teamIndex,
            }))
        ) {
            return null;
        } else {
            return war.getTileMap().getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
        }
    }

    public checkCanFocusUnitOnMapAttackTarget(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean {
        const attackableArea = Helpers_Misc.getExisted(this.getAttackableArea());
        if (!attackableArea.checkHasGridByGridIndex(gridIndex)) {
            return false;
        } else {
            const focusUnit = Helpers_Misc.getExisted(this.getFocusUnit());
            if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath().map(v => v.getGridIndex()), gridIndex)) {
                return true;
            } else {
                return focusUnit.checkCanAttackTargetAfterMovePath(
                    Helpers_Misc.getExisted(this.getMovableArea()).createShortestMovePath(Helpers_Misc.getExisted(attackableArea.getDataByGridIndex(gridIndex)?.movePathDestination)).map(v => v.getGridIndex()),
                    gridIndex,
                );
            }
        }
    }

    public calculateAvailableDropDestination(unitForDrop: Units_IUnit.IUnit, chosenDropDestinations: AuxiliaryTypes_GridIndex.GridIndex[]): AuxiliaryTypes_GridIndex.GridIndex[] {
        const loader                = this.getFocusUnit();
        const loaderEndingGridIndex = this.getMovePathDestination().getGridIndex();
        const war                   = this.getWar();
        const tileMap               = war.getTileMap();
        const unitMap               = war.getUnitMap();
        const destinations          = new Array<AuxiliaryTypes_GridIndex.GridIndex>();
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

function createFuncCheckIsUnitVisible(observerTeamIndexes: Set<number>): (unit: Units_IUnit.IUnit) => boolean {
    const unitVisibleDict = new Map<Units_IUnit.IUnit, boolean>();
    return (unit: Units_IUnit.IUnit): boolean => {
        if (unitVisibleDict.has(unit)) {
            return !!unitVisibleDict.get(unit);
        }

        const gridIndex = unit.getGridIndex();
        const isVisible = Visibilities_Utils.checkIsUnitOnMapVisibleToTeams({
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

function getState(stateId: ActionPlanners_Constants.StateId): ActionPlanners_States_IState.IState {
    switch (stateId) {
        case ActionPlanners_Constants.StateId.Idle                             : return ActionPlanners_States_Idle.Idle.getInstance();
        case ActionPlanners_Constants.StateId.ExecutingAction                  : return ActionPlanners_States_ExecutingAction.ExecutingAction.getInstance();

        case ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget      : return ActionPlanners_States_ChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingTileProductionTarget     : return ActionPlanners_States_ChoosingTileProductionTarget.ChoosingTileProductionTarget.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitAction               : return ActionPlanners_States_ChoosingUnitAction.ChoosingUnitAction.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget         : return ActionPlanners_States_ChoosingUnitAttackTarget.ChoosingUnitAttackTarget.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget          : return ActionPlanners_States_ChoosingUnitCrushTarget.ChoosingUnitCrushTarget.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitDropDestination      : return ActionPlanners_States_ChoosingUnitDropDestination.ChoosingUnitDropDestination.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination     : return ActionPlanners_States_ChoosingUnitFlareDestination.ChoosingUnitFlareDestination.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitMovePath             : return ActionPlanners_States_ChoosingUnitMovePath.ChoosingUnitMovePath.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget         : return ActionPlanners_States_ChoosingUnitRepairTarget.ChoosingUnitRepairTarget.getInstance();
        case ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination      : return ActionPlanners_States_ChoosingUnitSiloDestination.ChoosingUnitSiloDestination.getInstance();

        case ActionPlanners_Constants.StateId.PreviewingTileAttackableArea     : return ActionPlanners_States_PreviewingTileAttackableArea.PreviewingTileAttackableArea.getInstance();
        case ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea     : return ActionPlanners_States_PreviewingUnitAttackableArea.PreviewingUnitAttackableArea.getInstance();
        case ActionPlanners_Constants.StateId.PreviewingUnitMovableArea        : return ActionPlanners_States_PreviewingUnitMovableArea.PreviewingUnitMovableArea.getInstance();
        case ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea        : return ActionPlanners_States_PreviewingUnitVisibleArea.PreviewingUnitVisibleArea.getInstance();

        case ActionPlanners_Constants.StateId.RequestingPlayerDeleteUnit       : return ActionPlanners_States_RequestingPlayerDeleteUnit.RequestingPlayerDeleteUnit.getInstance();
        case ActionPlanners_Constants.StateId.RequestingPlayerEndTurn          : return ActionPlanners_States_RequestingPlayerEndTurn.RequestingPlayerEndTurn.getInstance();
        case ActionPlanners_Constants.StateId.RequestingPlayerProduceUnit      : return ActionPlanners_States_RequestingPlayerProduceUnit.RequestingPlayerProduceUnit.getInstance();
        case ActionPlanners_Constants.StateId.RequestingPlayerSurrender        : return ActionPlanners_States_RequestingPlayerSurrender.RequestingPlayerSurrender.getInstance();
        case ActionPlanners_Constants.StateId.RequestingPlayerUseCoActiveSkill : return ActionPlanners_States_RequestingPlayerUseCoActiveSkill.RequestingPlayerUseCoActiveSkill.getInstance();
        case ActionPlanners_Constants.StateId.RequestingPlayerVoteForDraw      : return ActionPlanners_States_RequestingPlayerVoteForDraw.RequestingPlayerVoteForDraw.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitAttackTile         : return ActionPlanners_States_RequestingUnitAttackTile.RequestingUnitAttackTile.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitAttackUnit         : return ActionPlanners_States_RequestingUnitAttackUnit.RequestingUnitAttackUnit.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitBeLoaded           : return ActionPlanners_States_RequestingUnitBeLoaded.RequestingUnitBeLoaded.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitBoardedByCo        : return ActionPlanners_States_RequestingUnitBoardedByCo.RequestingUnitBoardedByCo.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitBuildTile          : return ActionPlanners_States_RequestingUnitBuildTile.RequestingUnitBuildTile.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitCaptureTile        : return ActionPlanners_States_RequestingUnitCaptureTile.RequestingUnitCaptureTile.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitCrushUnit          : return ActionPlanners_States_RequestingUnitCrushUnit.RequestingUnitCrushUnit.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitDive               : return ActionPlanners_States_RequestingUnitDive.RequestingUnitDive.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitDrop               : return ActionPlanners_States_RequestingUnitDrop.RequestingUnitDrop.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitJoin               : return ActionPlanners_States_RequestingUnitJoin.RequestingUnitJoin.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitLaunchFlare        : return ActionPlanners_States_RequestingUnitLaunchFlare.RequestingUnitLaunchFlare.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitLaunchSilo         : return ActionPlanners_States_RequestingUnitLaunchSilo.RequestingUnitLaunchSilo.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitProduceUnit        : return ActionPlanners_States_RequestingUnitProduceUnit.RequestingUnitProduceUnit.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitRepairUnit         : return ActionPlanners_States_RequestingUnitRepairUnit.RequestingUnitRepairUnit.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitSelfDetonate       : return ActionPlanners_States_RequestingUnitSelfDetonate.RequestingUnitSelfDetonate.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitSupply             : return ActionPlanners_States_RequestingUnitSupply.RequestingUnitSupply.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitSurface            : return ActionPlanners_States_RequestingUnitSurface.RequestingUnitSurface.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitUseCoActiveSkill   : return ActionPlanners_States_RequestingUnitUseCoActiveSkill.RequestingUnitUseCoActiveSkill.getInstance();
        case ActionPlanners_Constants.StateId.RequestingUnitWait               : return ActionPlanners_States_RequestingUnitWait.RequestingUnitWait.getInstance();

        default                                         : throw Helpers_Misc.newError(`ActionPlanner.getState() invalid stateId: ${stateId}`);
    }
}

function checkIsExecuting(stateId: ActionPlanners_Constants.StateId): boolean {
    return ActionPlanners_Constants.StateIdsForExecuting.has(stateId);
}
function checkIsRequesting(stateId: ActionPlanners_Constants.StateId): boolean {
    return ActionPlanners_Constants.StateIdsForRequesting.has(stateId);
}

function generateOpenDataForUnitActionsPanel(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_View_BwUnitActionsPanel.OpenData {
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

    const dataList              : BaseWar_Model_BwTypes.DataForUnitAction[] = [];
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
        throw Helpers_Misc.newError(`No actions available?!`);
    }

    return {
        war         : war,
        destination : destination.getGridIndex(),
        actionList  : dataList,
    };
}
function getActionUnitBeLoaded(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    const destination   = actionPlanner.getMovePathDestination().getGridIndex();
    const focusUnit     = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
    if (focusUnit.getGridIndex().checkIsEqual(destination)) {
        return [];
    } else {
        const loader = actionPlanner.getWar().getUnitMap().getUnitOnMap(destination);
        return (loader) && (loader.checkCanLoadUnit(focusUnit))
            ? [{
                actionType : Units_Constants.ActionTypeId.BeLoaded,
                callback   : () => ActionPlanners_States_RequestingUnitBeLoaded.RequestingUnitBeLoaded.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitJoin(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    const destination   = actionPlanner.getMovePathDestination().getGridIndex();
    const focusUnit     = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
    if (focusUnit.getGridIndex().checkIsEqual(destination)) {
        return [];
    } else {
        const target = actionPlanner.getWar().getUnitMap().getUnitOnMap(destination);
        return (target) && (focusUnit.checkCanJoinUnit(target))
            ? [{
                actionType : Units_Constants.ActionTypeId.Join,
                callback   : () => {
                    const cb = () => ActionPlanners_States_RequestingUnitJoin.RequestingUnitJoin.getInstance().doApplyOnChooseAction(actionPlanner);
                    if (target.getActionState() === Units_Constants.ActionStateId.Acted) {
                        cb();
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0885),
                            callback   : cb,
                        });
                    }
                },
            }]
            : [];
    }
}
function getActionsUnitDropUnit(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    const focusUnit                 = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
    const destination               = actionPlanner.getMovePathDestination();
    const loadedUnits               = focusUnit.getLoadedUnits();
    const chosenUnits               = actionPlanner.getChosenUnitsForDrop();
    const chosenDropDestinations    = actionPlanner.getChosenDropDestinations();
    const actions                   : BaseWar_Model_BwTypes.DataForUnitAction[] = [];
    if ((loadedUnits.length > chosenUnits.length) && (focusUnit.checkCanDropLoadedUnit(actionPlanner.getWar().getTileMap().getTile(destination.getGridIndex()).getTileTypeId()))) {
        for (const unit of loadedUnits) {
            if ((chosenUnits.every(value => value.unit !== unit)) && (actionPlanner.calculateAvailableDropDestination(unit, chosenDropDestinations).length)) {
                actions.push({
                    actionType  : Units_Constants.ActionTypeId.DropUnit,
                    callback    : () => ActionPlanners_States_ChoosingUnitDropDestination.ChoosingUnitDropDestination.getInstance().doApplyOnChooseAction(actionPlanner, unit),
                    unitForDrop : unit,
                });
            }
        }
    }
    return actions;
}
function getActionUnitUseCoSuperPower(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
        const skillType = CoSkills_Constants.SkillTypeId.SuperPower;
        return !focusUnit.checkCanUseCoSkill(skillType)
            ? []
            : [{
                actionType : Units_Constants.ActionTypeId.UseCoSuperPower,
                callback   : () => {
                    const targetsCount = CoSkills_Utils_Common.getPowerSkillTargetsCount(focusUnit.getPlayer().getCoBasicCfg(), skillType);
                    if (targetsCount <= 0) {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0058),
                            callback   : () => {
                                actionPlanner.setCoActiveSkillSkillType(skillType);
                                ActionPlanners_States_RequestingUnitUseCoActiveSkill.RequestingUnitUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null);
                            },
                        });
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0205, targetsCount),
                            callback   : () => ActionPlanners_States_ChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnChooseAction(actionPlanner, skillType),
                        });
                    }
                },
            }];
    }
}
function getActionUnitUseCoPower(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
        const skillType = CoSkills_Constants.SkillTypeId.Power;
        return !focusUnit.checkCanUseCoSkill(skillType)
            ? []
            : [{
                actionType : Units_Constants.ActionTypeId.UseCoPower,
                callback   : () => {
                    const targetsCount = CoSkills_Utils_Common.getPowerSkillTargetsCount(focusUnit.getPlayer().getCoBasicCfg(), skillType);
                    if (targetsCount <= 0) {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0054),
                            callback   : () => {
                                actionPlanner.setCoActiveSkillSkillType(skillType);
                                ActionPlanners_States_RequestingUnitUseCoActiveSkill.RequestingUnitUseCoActiveSkill.getInstance().doApplyOnChooseAction(actionPlanner, skillType, null);
                            },
                        });
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0205, targetsCount),
                            callback   : () => ActionPlanners_States_ChoosingCoActiveSkillTarget.ChoosingCoActiveSkillTarget.getInstance().doApplyOnChooseAction(actionPlanner, skillType),
                        });
                    }
                },
            }];
    }
}
function getActionUnitBoardedByCo(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanCoBoardAfterMovePath(actionPlanner.getMovePath().map(v => v.getGridIndex()))
            ? [{
                actionType : Units_Constants.ActionTypeId.CoBoard,
                callback   : () => ActionPlanners_States_RequestingUnitBoardedByCo.RequestingUnitBoardedByCo.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitAttack(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    return actionPlanner.createAttackableGridsForUnitWeapon().length
        ? [{
            actionType : Units_Constants.ActionTypeId.Attack,
            callback   : () => ActionPlanners_States_ChoosingUnitAttackTarget.ChoosingUnitAttackTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }]
        : [];
}
function getActionUnitCapture(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanCaptureTile(actionPlanner.getWar().getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex())))
            ? [{
                actionType : Units_Constants.ActionTypeId.CaptureTile,
                callback   : () => ActionPlanners_States_RequestingUnitCaptureTile.RequestingUnitCaptureTile.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitCrushUnit(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if ((actionPlanner.getChosenUnitsForDrop().length)                  ||
        (!actionPlanner.getUnitCrushCandidateGridIndexArray().length)
    ) {
        return [];
    } else {
        return [{
            actionType : Units_Constants.ActionTypeId.CrushUnit,
            callback   : () => ActionPlanners_States_ChoosingUnitCrushTarget.ChoosingUnitCrushTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }];
    }
}
function getActionUnitDive(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanDive())
            ? [{
                actionType : Units_Constants.ActionTypeId.Dive,
                callback   : () => ActionPlanners_States_RequestingUnitDive.RequestingUnitDive.getInstance().doApplyOnChooseAction(actionPlanner),
            }]
            : [];
    }
}
function getActionUnitSurface(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        return (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanSurface())
            ? [{
                actionType : Units_Constants.ActionTypeId.Surface,
                callback   : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                    callback   : () => ActionPlanners_States_RequestingUnitSurface.RequestingUnitSurface.getInstance().doApplyOnChooseAction(actionPlanner),
                }),
            }]
            : [];
    }
}
function getActionsUnitLaunchUnit(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    const dataList  : BaseWar_Model_BwTypes.DataForUnitAction[] = [];
    const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
    if ((focusUnit !== actionPlanner.getFocusUnitLoaded()) && (actionPlanner.getMovePath().length === 1) && (focusUnit.checkCanLaunchLoadedUnit())) {
        const tile = actionPlanner.getWar().getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex());
        for (const unit of focusUnit.getLoadedUnits()) {
            if ((unit.getActionState() === Units_Constants.ActionStateId.Idle) && (tile.getMoveCostByUnit(unit) != null)) {
                dataList.push({
                    actionType    : Units_Constants.ActionTypeId.LaunchUnit,
                    callback      : () => ActionPlanners_States_ChoosingUnitMovePath.ChoosingUnitMovePath.getInstance().doApplyOnChooseAction(actionPlanner, unit),
                    unitForLaunch : unit,
                });
            }
        }
    }
    return dataList;
}
function getActionUnitRepairUnit(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if ((actionPlanner.getChosenUnitsForDrop().length)                  ||
        (!actionPlanner.getUnitRepairCandidateGridIndexArray().length)
    ) {
        return [];
    } else {
        return [{
            actionType : Units_Constants.ActionTypeId.RepairUnit,
            callback   : () => ActionPlanners_States_ChoosingUnitRepairTarget.ChoosingUnitRepairTarget.getInstance().doApplyOnChooseAction(actionPlanner),
        }];
    }
}
function getActionUnitSelfDetonate(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const selfDetonateCfg = Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).getTemplateCfg().getSelfDetonateCfg();
        if (selfDetonateCfg) {
            return [{
                actionType : Units_Constants.ActionTypeId.SelfDetonate,
                callback   : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0209, selfDetonateCfg.getRadius(), selfDetonateCfg.getDamage()),
                    callback   : () => ActionPlanners_States_RequestingUnitSelfDetonate.RequestingUnitSelfDetonate.getInstance().doApplyOnChooseAction(actionPlanner),
                }),
            }];
        }
        return [];
    }
}
function getActionUnitSupply(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, canDropUnits: boolean): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit     = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
        const playerIndex   = focusUnit.getPlayerIndex();
        const unitMap       = actionPlanner.getWar().getUnitMap();
        if (focusUnit.checkIsAdjacentUnitSupplier()) {
            for (const gridIndex of actionPlanner.getMovePathDestination().getGridIndex().getAdjacentGrids(actionPlanner.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    const cb = () => ActionPlanners_States_RequestingUnitSupply.RequestingUnitSupply.getInstance().doApplyOnChooseAction(actionPlanner);
                    return [{
                        actionType : Units_Constants.ActionTypeId.Supply,
                        callback   : !canDropUnits
                            ? cb
                            : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0055),
                                callback   : cb,
                            }),
                    }];
                }
            }
        }
        return [];
    }
}
function getActionUnitBuildTile(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, canDropUnits: boolean): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const destination   = actionPlanner.getMovePathDestination().getGridIndex();
        const tile          = actionPlanner.getWar().getTileMap().getTile(destination);
        if (!Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanBuildOnTile(tile)) {
            return [];
        } else {
            const cb = () => ActionPlanners_States_RequestingUnitBuildTile.RequestingUnitBuildTile.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType : Units_Constants.ActionTypeId.BuildTile,
                callback   : !canDropUnits
                    ? cb
                    : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0055),
                        callback   : cb,
                    }),
            }];
        }
    }
}
function getActionUnitLaunchFlare(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    const focusUnit = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
    const movePath  = actionPlanner.getMovePath();
    if ((!actionPlanner.getWar().getFogMap().checkHasFogCurrently())    ||
        (movePath.length !== 1)                                 ||
        (!focusUnit.getFlareCurrentAmmo())
    ) {
        return [];
    } else {
        return [{
            actionType : Units_Constants.ActionTypeId.LaunchFlare,
            callback   : () => ActionPlanners_States_ChoosingUnitFlareDestination.ChoosingUnitFlareDestination.getInstance().doApplyOnChooseAction(
                actionPlanner,
                Helpers_Misc.getExisted(focusUnit.getFlareRadius(movePath[movePath.length - 1].getGridIndex())),
            ),
        }];
    }
}
function getActionUnitLaunchSilo(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    const war   = actionPlanner.getWar();
    const tile  = war.getTileMap().getTile(actionPlanner.getMovePathDestination().getGridIndex());
    return (Helpers_Misc.getExisted(actionPlanner.getFocusUnit()).checkCanLaunchSiloOnTile(tile))
        ? [{
            actionType : Units_Constants.ActionTypeId.LaunchSilo,
            callback   : () => ActionPlanners_States_ChoosingUnitSiloDestination.ChoosingUnitSiloDestination.getInstance().doApplyOnChooseAction(
                actionPlanner,
                tile.getTemplateCfg().getLaunchSiloParams()[2],
            ),
        }]
        : [];
}
function getActionUnitProduceUnit(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner): BaseWar_Model_BwTypes.DataForUnitAction[] {
    if (actionPlanner.getChosenUnitsForDrop().length) {
        return [];
    } else {
        const focusUnit         = Helpers_Misc.getExisted(actionPlanner.getFocusUnit());
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
                actionType         : Units_Constants.ActionTypeId.ProduceUnit,
                callback           : () => FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0051)),
                costForProduceUnit : costForProduceUnit,
                produceUnitType    : produceUnitType,
            }];
        } else if (focusUnit.getLoadedUnitsCount() >= Helpers_Misc.getExisted(focusUnit.getMaxLoadUnitsCount())) {
            return [{
                actionType         : Units_Constants.ActionTypeId.ProduceUnit,
                callback           : () => FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0052)),
                costForProduceUnit : costForProduceUnit,
                produceUnitType    : produceUnitType,
            }];
        } else if (player.getFund() < costForProduceUnit) {
            return [{
                actionType         : Units_Constants.ActionTypeId.ProduceUnit,
                callback           : () => FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0053)),
                costForProduceUnit : costForProduceUnit,
                produceUnitType    : produceUnitType,
            }];
        } else if ((maxUnitsCount != null) && (currentUnitsCount >= maxUnitsCount)) {
            return [{
                actionType         : Units_Constants.ActionTypeId.ProduceUnit,
                callback           : () => FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0266, currentUnitsCount, maxUnitsCount)),
                costForProduceUnit : costForProduceUnit,
                produceUnitType    : produceUnitType,
            }];
        } else {
            return [{
                actionType         : Units_Constants.ActionTypeId.ProduceUnit,
                callback           : () => ActionPlanners_States_RequestingUnitProduceUnit.RequestingUnitProduceUnit.getInstance().doApplyOnChooseAction(actionPlanner),
                costForProduceUnit : costForProduceUnit,
                produceUnitType    : produceUnitType,
            }];
        }
    }
}
function getActionUnitWait(actionPlanner: ActionPlanners_IActionPlanner.IActionPlanner, hasOtherAction: boolean): BaseWar_Model_BwTypes.DataForUnitAction[] {
    const existingUnit = actionPlanner.getWar().getUnitMap().getVisibleUnitOnMap(actionPlanner.getMovePathDestination().getGridIndex());
    if ((existingUnit) && (existingUnit !== actionPlanner.getFocusUnit())) {
        return [];
    } else {
        if (actionPlanner.getChosenUnitsForDrop().length) {
            const cb = () => ActionPlanners_States_RequestingUnitDrop.RequestingUnitDrop.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType : Units_Constants.ActionTypeId.Wait,
                callback   : !hasOtherAction
                    ? cb
                    : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0055),
                        callback   : cb,
                    }),
            }];
        } else {
            const cb = () => ActionPlanners_States_RequestingUnitWait.RequestingUnitWait.getInstance().doApplyOnChooseAction(actionPlanner);
            return [{
                actionType : Units_Constants.ActionTypeId.Wait,
                callback   : !hasOtherAction
                    ? cb
                    : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0055),
                        callback   : cb,
                    }),
            }];
        }
    }
}
