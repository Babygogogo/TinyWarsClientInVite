import { StateId } from "../actionPlanners/Constants.ts";
import {
    getRwWarBaseClass,
    getRwWarClass,
} from "../gameHelpers/GhFactory.ts";
import { getCurrentTextureResolutionConfig } from "../graphics/Utils.ts";
import {
    createLazyFunc,
    getExisted,
    newError,
} from "../helpers/Misc.ts";
import {
    addEventListeners,
    removeEventListeners,
} from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { UiContainer } from "../ui/components/UiContainer.ts";
import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";
import { getUiContainerClass } from "../ui/utils/UiFactory.ts";
import { DisplayLayerId } from "./Constants.ts";
import type { IUnitMap } from "./IUnitMap.ts";
import type { IUnitMapView } from "./IUnitMapView.ts";
import type { IUnitView } from "./IUnitView.ts";
import { getSelfSettingsOpacitySettings } from "../users/Model.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import type { DisplayObject } from "../vendor/egret/Egret.ts";
import { getAllUnitsOnMapVisibleToTeams } from "../visibilities/Utils.ts";

const getGridWidth          = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight         = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);

export class UnitMapView extends UiContainer implements IUnitMapView {
    private readonly _layerForNaval     = new (getUiContainerClass())();
    private readonly _layerForGround    = new (getUiContainerClass())();
    private readonly _layerForAir       = new (getUiContainerClass())();
    private readonly _notifyListeners   = [
        { type: TypeId.ActionPlannerStateSet,               callback: this._onNotifyActionPlannerStateChanged },
        { type: TypeId.UserSettingsOpacitySettingsChanged,  callback: this._onNotifyUserSettingsOpacitySettingsChanged },
    ];

    private _unitMap    : IUnitMap | null = null;

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

    public init(unitMap: IUnitMap): void {
        this._setUnitMap(unitMap);

        this._clearAllUnits();
        this._resetZOrderForAllLayers();
    }

    public startRunningView(): void {
        this._clearAllUnits();
        for (const unit of this._getUnitMap().getAllUnits()) {
            this.addUnit(unit.getView(), false);
        }

        addEventListeners(this._notifyListeners, this);
    }
    public stopRunningView(): void {
        removeEventListeners(this._notifyListeners, this);
    }

    private _getUnitMap(): IUnitMap {
        return getExisted(this._unitMap);
    }
    private _setUnitMap(unitMap: IUnitMap): void {
        this._unitMap = unitMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public addUnit(view: IUnitView, needResetZOrder: boolean): void {
        const model = getExisted(view.getUnit());

        view.setX(getGridWidth() * model.getGridX());
        view.setY(getGridHeight() * model.getGridY());
        (model.getLoaderUnitId() != null) && (view.setIsVisible(false));

        const layer = this._getLayerByUnitType(model.getUnitType());
        layer.addUiChild(view);
        (needResetZOrder) && (this._resetZOrderForLayer(layer));
    }

    public removeUnit(view: IUnitView): void {
        view.getParent()?.removeChild(view as unknown as DisplayObject);
    }

    public resetZOrder(unitType: number): void {
        this._resetZOrderForLayer(this._getLayerByUnitType(unitType));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyActionPlannerStateChanged(): void {
        const war = this._getUnitMap().getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        const state         = actionPlanner.getStateId();

        if (state === StateId.Idle) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === StateId.ExecutingAction) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === StateId.ChoosingUnitMovePath) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === StateId.ChoosingUnitAction) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === StateId.ChoosingUnitAttackTarget) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === StateId.ChoosingUnitCrushTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === StateId.ChoosingCoActiveSkillTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === StateId.ChoosingUnitDropDestination) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === StateId.ChoosingUnitFlareDestination) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === StateId.ChoosingUnitRepairTarget) {
            this._resetVisibleForAllUnitsOnMap();
            actionPlanner.getFocusUnitOnMap()?.setViewVisible(false);
            actionPlanner.getFocusUnitLoaded()?.setViewVisible(false);

        } else if (state === StateId.ChoosingUnitSiloDestination) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
            const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
            (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

        } else if (state === StateId.ChoosingTileProductionTarget) {
            this._resetVisibleForAllUnitsOnMap();

        } else if (state === StateId.PreviewingUnitAttackableArea) {
            this._resetVisibleForAllUnitsOnMap();
            for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                unit.setViewVisible(false);
            }

        } else if (state === StateId.PreviewingUnitMovableArea) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getUnitForPreviewingMovableArea()).setViewVisible(false);

        } else if (state === StateId.PreviewingUnitVisibleArea) {
            this._resetVisibleForAllUnitsOnMap();
            getExisted(actionPlanner.getUnitForPreviewingVisibleArea()).setViewVisible(false);

        } else if (state === StateId.PreviewingTileAttackableArea) {
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

    private _resetZOrderForLayer(layer: IUiContainer): void {
        const viewsCount    = layer.getUiChildren().length;
        const views         = new Array<IUnitView>(viewsCount);
        for (let i = 0; i < viewsCount; ++i) {
            views[i] = layer.getUiChildAt(i) as any;
        }
        views.sort((v1, v2) => getExisted(v1.getUnit()).getGridY() - getExisted(v2.getUnit()).getGridY());
        for (let i = 0; i < viewsCount; ++i) {
            layer.setUiChildIndex(views[i], i);
        }
    }
    private _resetZOrderForAllLayers(): void {
        this._resetZOrderForLayer(this._layerForAir);
        this._resetZOrderForLayer(this._layerForGround);
        this._resetZOrderForLayer(this._layerForNaval);
    }

    private _getLayerByUnitType(unitType: number): IUiContainer {
        switch (this._getUnitMap().getWar().getGcData().getUnitTemplateCfg(unitType)?.getLayer()) {
            case DisplayLayerId.Air     : return this._layerForAir;
            case DisplayLayerId.Ground  : return this._layerForGround;
            case DisplayLayerId.Sea     : return this._layerForNaval;
            default                         : throw newError(`Invalid layer.`, ClientErrorCode.BwUnitMapView_GetLayerByUnitType_00);
        }
    }

    private _resetVisibleForAllUnitsOnMap(): void {
        const unitMap       = this._getUnitMap();
        const war           = unitMap.getWar();
        const visibleUnits  = getAllUnitsOnMapVisibleToTeams(
            war,
            ((war instanceof getRwWarClass()) && (!war.getIsShowAllUnits()))
                ? new Set([war.getVisionTeamIndex() ?? war.getPlayerInTurn().getTeamIndex()])
                : war.getPlayerManager().getWatcherTeamIndexesForSelf()
        );
        for (const unit of unitMap.getAllUnitsOnMap()) {
            unit.setViewVisible(visibleUnits.has(unit));
        }
    }

    private _updateOpacityForAllLayers(): void {
        const opacity = (getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100) / 100;
        this._layerForAir.setAlpha(opacity);
        this._layerForGround.setAlpha(opacity);
        this._layerForNaval.setAlpha(opacity);
    }
}
