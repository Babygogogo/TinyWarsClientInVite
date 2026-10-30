import type { IActionPlannerView } from "../actionPlanners/IActionPlannerView.ts";
import type { IBwCursorView } from "../baseWar/interface/IBwCursorView.ts";
import type { IBwGridVisualEffectView } from "../baseWar/interface/IBwGridVisualEffectView.ts";
import type { IField } from "./IField.ts";
import type { IFieldView } from "./IFieldView.ts";
import { getExisted } from "../helpers/Misc.ts";
import type { ITileMapView } from "../tiles/ITileMapView.ts";
import { UiContainer } from "../ui/components/UiContainer.ts";
import type { IUnitMapView } from "../units/IUnitMapView.ts";

export class FieldView extends UiContainer implements IFieldView {
    private _field?                 : IField;

    private _tileMapView?           : ITileMapView;
    private _actionPlannerView?     : IActionPlannerView;
    private _unitMapView?           : IUnitMapView;
    private _cursorView?            : IBwCursorView;
    private _gridVisualEffectView?  : IBwGridVisualEffectView;

    public init(field: IField): void {
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
    public fastInit(field: IField): void {
        this._field = field;
    }

    public startRunningView(): void {
        // nothing to do
    }
    public stopRunningView(): void {
        // nothing to do
    }

    private _getUnitMapView(): IUnitMapView {
        return getExisted(this._unitMapView);
    }
    private _getTileMapView(): ITileMapView {
        return getExisted(this._tileMapView);
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
