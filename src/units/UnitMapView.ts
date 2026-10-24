import * as ActionPlannersConstants from "../actionPlanners/Constants.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as GraphicsUtils from "../graphics/Utils.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as UiComponentsUiContainer from "../ui/components/UiContainer.ts";
import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";
import * as UiUtilsUiFactory from "../ui/utils/UiFactory.ts";
import * as UnitsConstants from "./Constants.ts";
import type * as UnitsIUnitMap from "./IUnitMap.ts";
import type * as UnitsIUnitMapView from "./IUnitMapView.ts";
import type * as UnitsIUnitView from "./IUnitView.ts";
import * as UsersModel from "../users/Model.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";

const getGridWidth          = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight         = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);

export class UnitMapView extends UiComponentsUiContainer.UiContainer implements UnitsIUnitMapView.IUnitMapView {
    private readonly _layerForNaval     = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _layerForGround    = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _layerForAir       = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _notifyListeners   = [
        { type: NotificationsTypeId.TypeId.ActionPlannerStateSet,               callback: this._onNotifyActionPlannerStateChanged },
        { type: NotificationsTypeId.TypeId.UserSettingsOpacitySettingsChanged,  callback: this._onNotifyUserSettingsOpacitySettingsChanged },
    ];

    private _unitMap    : UnitsIUnitMap.IUnitMap | null = null;

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

    public init(unitMap: UnitsIUnitMap.IUnitMap): void {
        this._setUnitMap(unitMap);

        this._clearAllUnits();
        this._resetZOrderForAllLayers();
    }

    public startRunningView(): void {
        this._clearAllUnits();
        for (const unit of this._getUnitMap().getAllUnits()) {
            this.addUnit(unit.getView(), false);
        }

        NotificationsDispatcher.addEventListeners(this._notifyListeners, this);
    }
    public stopRunningView(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyListeners, this);
    }

    private _getUnitMap(): UnitsIUnitMap.IUnitMap {
        return HelpersMisc.getExisted(this._unitMap);
    }
    private _setUnitMap(unitMap: UnitsIUnitMap.IUnitMap): void {
        this._unitMap = unitMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public addUnit(view: UnitsIUnitView.IUnitView, needResetZOrder: boolean): void {
        const model = HelpersMisc.getExisted(view.getUnit());

        view.setX(getGridWidth() * model.getGridX());
        view.setY(getGridHeight() * model.getGridY());
        (model.getLoaderUnitId() != null) && (view.setIsVisible(false));

        const layer = this._getLayerByUnitType(model.getUnitType());
        layer.addUiChild(view);
        (needResetZOrder) && (this._resetZOrderForLayer(layer));
    }

    public removeUnit(view: UnitsIUnitView.IUnitView): void {
        view.getParent()?.removeChild(view as unknown as VendorEgretEgret.DisplayObject);
    }

    public resetZOrder(unitType: number): void {
        this._resetZOrderForLayer(this._getLayerByUnitType(unitType));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyActionPlannerStateChanged(): void {
        const war = this._getUnitMap().getWar();
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass()) && (war.getIsBatchExecuteAction())) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === ActionPlannersConstants.StateId.Idle) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === ActionPlannersConstants.StateId.ExecutingAction) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitMovePath) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAction) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitAttackTarget) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitCrushTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingCoActiveSkillTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitDropDestination) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitFlareDestination) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitRepairTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === ActionPlannersConstants.StateId.ChoosingUnitSiloDestination) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === ActionPlannersConstants.StateId.ChoosingTileProductionTarget) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitAttackableArea) {
            this._resetVisibleForAllUnitsOnMap();
            for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                unit.setViewVisible(false);
            }

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitMovableArea) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getUnitForPreviewingMovableArea()).setViewVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingUnitVisibleArea) {
            this._resetVisibleForAllUnitsOnMap();
            HelpersMisc.getExisted(actionPlanner.getUnitForPreviewingVisibleArea()).setViewVisible(false);

        } else if (state === ActionPlannersConstants.StateId.PreviewingTileAttackableArea) {
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

    private _resetZOrderForLayer(layer: UiInterfacesIUiContainer.IUiContainer): void {
        const viewsCount    = layer.getUiChildren().length;
        const views         = new Array<UnitsIUnitView.IUnitView>(viewsCount);
        for (let i = 0; i < viewsCount; ++i) {
            views[i] = layer.getUiChildAt(i) as any;
        }
        views.sort((v1, v2) => HelpersMisc.getExisted(v1.getUnit()).getGridY() - HelpersMisc.getExisted(v2.getUnit()).getGridY());
        for (let i = 0; i < viewsCount; ++i) {
            layer.setUiChildIndex(views[i], i);
        }
    }
    private _resetZOrderForAllLayers(): void {
        this._resetZOrderForLayer(this._layerForAir);
        this._resetZOrderForLayer(this._layerForGround);
        this._resetZOrderForLayer(this._layerForNaval);
    }

    private _getLayerByUnitType(unitType: number): UiInterfacesIUiContainer.IUiContainer {
        switch (this._getUnitMap().getWar().getGcData().getUnitTemplateCfg(unitType)?.getLayer()) {
            case UnitsConstants.DisplayLayerId.Air     : return this._layerForAir;
            case UnitsConstants.DisplayLayerId.Ground  : return this._layerForGround;
            case UnitsConstants.DisplayLayerId.Sea     : return this._layerForNaval;
            default                         : throw HelpersMisc.newError(`Invalid layer.`, UtilsClientErrorCode.ClientErrorCode.BwUnitMapView_GetLayerByUnitType_00);
        }
    }

    private _resetVisibleForAllUnitsOnMap(): void {
        const unitMap       = this._getUnitMap();
        const war           = unitMap.getWar();
        const visibleUnits  = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(
            war,
            ((war instanceof GameHelpersGhFactory.getRwWarClass()) && (!war.getIsShowAllUnits()))
                ? new Set([war.getVisionTeamIndex() ?? war.getPlayerInTurn().getTeamIndex()])
                : war.getPlayerManager().getWatcherTeamIndexesForSelf()
        );
        for (const unit of unitMap.getAllUnitsOnMap()) {
            unit.setViewVisible(visibleUnits.has(unit));
        }
    }

    private _updateOpacityForAllLayers(): void {
        const opacity = (UsersModel.getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100) / 100;
        this._layerForAir.setAlpha(opacity);
        this._layerForGround.setAlpha(opacity);
        this._layerForNaval.setAlpha(opacity);
    }
}
