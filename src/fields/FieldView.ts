import type * as ActionPlannersIActionPlannerView from "../actionPlanners/IActionPlannerView.ts";
import type * as BaseWarInterfaceIBwCursorView from "../baseWar/interface/IBwCursorView.ts";
import type * as BaseWarInterfaceIBwGridVisualEffectView from "../baseWar/interface/IBwGridVisualEffectView.ts";
import type * as FieldsIField from "./IField.ts";
import type * as FieldsIFieldView from "./IFieldView.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import type * as TilesITileMapView from "../tiles/ITileMapView.ts";
import * as UiComponentsUiContainer from "../ui/components/UiContainer.ts";
import type * as UnitsIUnitMapView from "../units/IUnitMapView.ts";

type IBwTileMapView             = TilesITileMapView.ITileMapView;
type IBwUnitMapView             = UnitsIUnitMapView.IUnitMapView;
type IBwCursorView              = BaseWarInterfaceIBwCursorView.IBwCursorView;
type IBwGridVisualEffectView    = BaseWarInterfaceIBwGridVisualEffectView.IBwGridVisualEffectView;

export class FieldView extends UiComponentsUiContainer.UiContainer implements FieldsIFieldView.IFieldView {
    private _field?                 : FieldsIField.IField;

    private _tileMapView?           : IBwTileMapView;
    private _actionPlannerView?     : ActionPlannersIActionPlannerView.IActionPlannerView;
    private _unitMapView?           : IBwUnitMapView;
    private _cursorView?            : IBwCursorView;
    private _gridVisualEffectView?  : IBwGridVisualEffectView;

    public init(field: FieldsIField.IField): void {
        if (!this._field) {
            this._field = field;

            this._tileMapView           = field.getTileMap().getView();
            this._actionPlannerView     = field.getActionPlanner().getView();
            this._unitMapView           = field.getUnitMap().getView();
            this._cursorView            = field.getCursor().getView();
            this._gridVisualEffectView  = field.getGridVisualEffect().getView();
            this.addUiChild(this._tileMapView);
            this.addUiChild(this._actionPlannerView.getContainerForGrids());
            this.addUiChild(this._unitMapView);
            this.addUiChild(this._actionPlannerView.getContainerForUnits());
            this.addUiChild(this._cursorView);
            this.addUiChild(this._gridVisualEffectView);
        }
    }
    public fastInit(field: FieldsIField.IField): void {
        this._field = field;
    }

    public startRunningView(): void {
        // nothing to do
    }
    public stopRunningView(): void {
        // nothing to do
    }

    private _getUnitMapView(): IBwUnitMapView {
        return HelpersMisc.getExisted(this._unitMapView);
    }
    private _getTileMapView(): IBwTileMapView {
        return HelpersMisc.getExisted(this._tileMapView);
    }

    public setUnitsVisible(visible: boolean): void {
        this._getUnitMapView().setIsVisible(visible);
    }
    public getUnitsVisible(): boolean {
        return this._getUnitMapView().getIsVisible();
    }

    public setTileObjectsVisible(visible: boolean): void {
        this._getTileMapView().setObjectLayerVisible(visible);
    }
    public getTileObjectsVisible(): boolean {
        return this._getTileMapView().getObjectLayerVisible();
    }

    public setTileBasesVisible(visible: boolean): void {
        this._getTileMapView().setBaseLayerVisible(visible);
    }
    public getTileBasesVisible(): boolean {
        return this._getTileMapView().getBaseLayerVisible();
    }

    public setTileDecorationsVisible(visible: boolean): void {
        this._getTileMapView().setDecorationLayerVisible(visible);
    }
    public getTileDecorationsVisible(): boolean {
        return this._getTileMapView().getDecorationLayerVisible();
    }
}
