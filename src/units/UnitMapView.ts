import {
    ActionPlanners_Constants,
    Graphics_Utils,
    Helpers_Misc,
    Notifications_Dispatcher,
    type Notifications_Types,
    ReplayWar_Model_RwWar,
    ReplayWar_Model_RwWarBase,
    Ui_Components_UiContainer,
    type Ui_Interfaces_IUiContainer,
    Units_Constants,
    type Units_UnitMap,
    type Units_UnitView,
    Users_Model,
    Utils_ClientErrorCode,
    Visibilities_Utils,
} from "../internal.ts";

const getGridWidth          = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight         = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class UnitMapView extends Ui_Components_UiContainer.UiContainer {
    private readonly _layerForNaval     = new Ui_Components_UiContainer.UiContainer();
    private readonly _layerForGround    = new Ui_Components_UiContainer.UiContainer();
    private readonly _layerForAir       = new Ui_Components_UiContainer.UiContainer();
    private readonly _notifyListeners   : Notifications_Types.Listener[] = [
        { type : "ActionPlannerStateSet",               callback : this._onNotifyActionPlannerStateChanged },
        { type : "UserSettingsOpacitySettingsChanged",  callback : this._onNotifyUserSettingsOpacitySettingsChanged },
    ];

    private _unitMap    : Units_UnitMap.UnitMap | null = null;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initializers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public constructor() {
        super();

        this.addUiChild(this._layerForNaval);
        this.addUiChild(this._layerForGround);
        this.addUiChild(this._layerForAir);
        this._updateOpacityForAllLayers();

        this.setIsTouchChildrenEnabled(false);
    }

    public init(unitMap: Units_UnitMap.UnitMap): void {
        this._setUnitMap(unitMap);

        this._clearAllUnits();
        this._resetZOrderForAllLayers();
    }

    public startRunningView(): void {
        this._clearAllUnits();
        for (const unit of this._getUnitMap().getAllUnits()) {
            const view = unit.getView();
            if (view) {
                this.addUnit(view, false);
            }
        }

        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this);
    }
    public stopRunningView(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);
    }

    private _getUnitMap(): Units_UnitMap.UnitMap {
        return Helpers_Misc.getExisted(this._unitMap);
    }
    private _setUnitMap(unitMap: Units_UnitMap.UnitMap): void {
        this._unitMap = unitMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public addUnit(view: Units_UnitView.UnitView, needResetZOrder: boolean): void {
        const viewData = view.getViewData();

        view.setX(getGridWidth() * viewData.gridX);
        view.setY(getGridHeight() * viewData.gridY);
        if (viewData.isLoadedByUnit) {
            view.setIsVisible(false);
        }

        const layer = this._getLayerByUnitType(viewData.unitTypeId);
        layer.addUiChild(view);
        if (needResetZOrder) {
            this._resetZOrderForLayer(layer);
        }
    }

    public removeUnit(view: Units_UnitView.UnitView): void {
        view.getParent()?.removeChild(view);
    }

    public resetZOrder(unitType: number): void {
        this._resetZOrderForLayer(this._getLayerByUnitType(unitType));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyActionPlannerStateChanged(): void {
        const war = this._getUnitMap().getWar();
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction())) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === ActionPlanners_Constants.StateId.Idle) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === ActionPlanners_Constants.StateId.ExecutingAction) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitMovePath) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitCrushTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingCoActiveSkillTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitDropDestination) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingTileProductionTarget) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            this._resetVisibleForAllUnitsOnMap();
            for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                unit.setViewVisible(false);
            }

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getUnitForPreviewingMovableArea()).setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitVisibleArea) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getUnitForPreviewingVisibleArea()).setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.PreviewingTileAttackableArea) {
            this._resetVisibleForAllUnitsOnMap();

        } else {
            // Nothing to do.
        }
    }

    private _onNotifyUserSettingsOpacitySettingsChanged(): void {
        this._updateOpacityForAllLayers();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other private functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _clearAllUnits(): void {
        this._layerForAir.removeUiChildren();
        this._layerForGround.removeUiChildren();
        this._layerForNaval.removeUiChildren();
    }

    private _resetZOrderForLayer(layer: Ui_Interfaces_IUiContainer.IUiContainer): void {
        const viewsCount    = layer.getUiChildren().length;
        const views         = new Array<Units_UnitView.UnitView>(viewsCount);
        for (let i = 0; i < viewsCount; ++i) {
            views[i] = layer.getUiChildAt(i) as Units_UnitView.UnitView;
        }
        views.sort((v1, v2) => v1.getViewData().gridY - v2.getViewData().gridY);
        for (let i = 0; i < viewsCount; ++i) {
            layer.setUiChildIndex(views[i], i);
        }
    }
    private _resetZOrderForAllLayers(): void {
        this._resetZOrderForLayer(this._layerForAir);
        this._resetZOrderForLayer(this._layerForGround);
        this._resetZOrderForLayer(this._layerForNaval);
    }

    private _getLayerByUnitType(unitType: number): Ui_Interfaces_IUiContainer.IUiContainer {
        switch (this._getUnitMap().getWar().getGcData().getUnitTemplateCfg(unitType)?.getLayer()) {
            case Units_Constants.DisplayLayerId.Air     : return this._layerForAir;
            case Units_Constants.DisplayLayerId.Ground  : return this._layerForGround;
            case Units_Constants.DisplayLayerId.Sea     : return this._layerForNaval;
            default                         : throw Helpers_Misc.newError(`Invalid layer.`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMapView_GetLayerByUnitType_00);
        }
    }

    private _resetVisibleForAllUnitsOnMap(): void {
        const unitMap       = this._getUnitMap();
        const war           = unitMap.getWar();
        const visibleUnits  = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(
            war,
            ((war instanceof ReplayWar_Model_RwWar.RwWar) && (!war.getIsShowAllUnits()))
                ? new Set([war.getVisionTeamIndex() ?? war.getPlayerInTurn().getTeamIndex()])
                : war.getPlayerManager().getWatcherTeamIndexesForSelf(),
        );
        for (const unit of unitMap.getAllUnitsOnMap()) {
            unit.setViewVisible(visibleUnits.has(unit));
        }
    }

    private _updateOpacityForAllLayers(): void {
        const opacity = (Users_Model.getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100) / 100;
        this._layerForAir.setAlpha(opacity);
        this._layerForGround.setAlpha(opacity);
        this._layerForNaval.setAlpha(opacity);
    }
}
