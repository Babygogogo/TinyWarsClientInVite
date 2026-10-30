import {
    Helpers_Misc,
    Ui_Components_UiContainer,
    type ActionPlanners_IActionPlannerView,
    type BaseWar_Interface_IBwCursorView,
    type BaseWar_Interface_IBwGridVisualEffectView,
    type Fields_IField,
    type Fields_IFieldView,
    type Tiles_ITileMapView,
    type Units_IUnitMapView,
} from "../internal.ts";

export class FieldView extends Ui_Components_UiContainer.UiContainer implements Fields_IFieldView.IFieldView {
    private _field?                 : Fields_IField.IField;

    private _tileMapView?           : Tiles_ITileMapView.ITileMapView;
    private _actionPlannerView?     : ActionPlanners_IActionPlannerView.IActionPlannerView;
    private _unitMapView?           : Units_IUnitMapView.IUnitMapView;
    private _cursorView?            : BaseWar_Interface_IBwCursorView.IBwCursorView;
    private _gridVisualEffectView?  : BaseWar_Interface_IBwGridVisualEffectView.IBwGridVisualEffectView;

    public init(field: Fields_IField.IField): void {
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
    public fastInit(field: Fields_IField.IField): void {
        this._field = field;
    }

    public startRunningView(): void {
        // nothing to do
    }
    public stopRunningView(): void {
        // nothing to do
    }

    private _getUnitMapView(): Units_IUnitMapView.IUnitMapView {
        return Helpers_Misc.getExisted(this._unitMapView);
    }
    private _getTileMapView(): Tiles_ITileMapView.ITileMapView {
        return Helpers_Misc.getExisted(this._tileMapView);
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
