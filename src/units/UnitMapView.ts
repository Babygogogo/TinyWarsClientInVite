import {
    ReplayWar_Model_RwWar,
    ReplayWar_Model_RwWarBase,
    ActionPlanners_Constants,
    Notifications_Dispatcher,
    Helpers_Misc,
    Graphics_Utils,
    Notifications_TypeId,
    Ui_Components_UiContainer,
    type Ui_Interfaces_IUiContainer,
    Utils_ClientErrorCode,
    Units_Constants,
    Visibilities_Utils,
    Users_Model,
    type Egret_Egret,
    type Units_IUnitMap,
    type Units_IUnitMapView,
    type Units_IUnitView,
} from "../internal.ts";

const getGridWidth          = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight         = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class UnitMapView extends Ui_Components_UiContainer.UiContainer implements Units_IUnitMapView.IUnitMapView {
    private readonly _layerForNaval     = new Ui_Components_UiContainer.UiContainer();
    private readonly _layerForGround    = new Ui_Components_UiContainer.UiContainer();
    private readonly _layerForAir       = new Ui_Components_UiContainer.UiContainer();
    private readonly _notifyListeners   = [
        { type : Notifications_TypeId.TypeId.ActionPlannerStateSet,               callback : this._onNotifyActionPlannerStateChanged },
        { type : Notifications_TypeId.TypeId.UserSettingsOpacitySettingsChanged,  callback : this._onNotifyUserSettingsOpacitySettingsChanged },
    ];

    private _unitMap    : Units_IUnitMap.IUnitMap | null = null;

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

    public init(unitMap: Units_IUnitMap.IUnitMap): void {
        this._setUnitMap(unitMap);

        this._clearAllUnits();
        this._resetZOrderForAllLayers();
    }

    public startRunningView(): void {
        this._clearAllUnits();
        for (const unit of this._getUnitMap().getAllUnits()) {
            this.addUnit(unit.getView(), false);
        }

        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this);
    }
    public stopRunningView(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);
    }

    private _getUnitMap(): Units_IUnitMap.IUnitMap {
        return Helpers_Misc.getExisted(this._unitMap);
    }
    private _setUnitMap(unitMap: Units_IUnitMap.IUnitMap): void {
        this._unitMap = unitMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public addUnit(view: Units_IUnitView.IUnitView, needResetZOrder: boolean): void {
        const model = Helpers_Misc.getExisted(view.getUnit());

        view.setX(getGridWidth() * model.getGridX());
        view.setY(getGridHeight() * model.getGridY());
        (model.getLoaderUnitId() != null) && (view.setIsVisible(false));

        const layer = this._getLayerByUnitType(model.getUnitType());
        layer.addUiChild(view);
        (needResetZOrder) && (this._resetZOrderForLayer(layer));
    }

    public removeUnit(view: Units_IUnitView.IUnitView): void {
        view.getParent()?.removeChild(view as unknown as Egret_Egret.DisplayObject);
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
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAction) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitAttackTarget) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

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
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitFlareDestination) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitRepairTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlanners_Constants.StateId.ChoosingUnitSiloDestination) {
            this._resetVisibleForAllUnitsOnMap();
            Helpers_Misc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

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
        const views         = new Array<Units_IUnitView.IUnitView>(viewsCount);
        for (let i = 0; i < viewsCount; ++i) {
            views[i] = layer.getUiChildAt(i) as any;
        }
        views.sort((v1, v2) => Helpers_Misc.getExisted(v1.getUnit()).getGridY() - Helpers_Misc.getExisted(v2.getUnit()).getGridY());
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
