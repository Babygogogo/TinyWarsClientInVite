import {
    Fields_Field,
    Helpers_Misc,
    Ui_Components_UiContainer,
    type ActionPlanners_IActionPlannerView,
    type BaseWar_Interface_IBwCursorView,
    type BaseWar_Interface_IBwGridVisualEffectView,
    type Tiles_TileMapView,
    type Units_UnitMapView,
} from "../internal.ts";

export class FieldView extends Ui_Components_UiContainer.UiContainer {
    private _field?                 : Fields_Field.Field;

    private _tileMapView?           : Tiles_TileMapView.TileMapView;
    private _actionPlannerView?     : ActionPlanners_IActionPlannerView.IActionPlannerView;
    private _unitMapView?           : Units_UnitMapView.UnitMapView;
    private _cursorView?            : BaseWar_Interface_IBwCursorView.IBwCursorView;
    private _gridVisualEffectView?  : BaseWar_Interface_IBwGridVisualEffectView.IBwGridVisualEffectView;

    public init(field: Fields_Field.Field): void {
        if (!this._field) {
            this._field = field;

            {
                const view          = field.getTileMap().getView();
                this._tileMapView   = view;

                if (view) {
                    this.addUiChild(view);
                }
            }

            {
                const view              = field.getActionPlanner()?.getView();
                this._actionPlannerView = view;

                if (view) {
                    this.addUiChild(view.getContainerForGrids());
                }
            }

            {
                const view          = field.getUnitMap().getView();
                this._unitMapView   = view;

                if (view) {
                    this.addUiChild(view);
                }
            }

            {
                const view = this._actionPlannerView;
                if (view) {
                    this.addUiChild(view.getContainerForUnits());
                }
            }

            {
                const view          = field.getCursor()?.getView();
                this._cursorView    = view;

                if (view) {
                    this.addUiChild(view);
                }
            }

            {
                const view                  = field.getGridVisualEffect()?.getView();
                this._gridVisualEffectView  = view;

                if (view) {
                    this.addUiChild(view);
                }
            }
        }
    }
    public fastInit(field: Fields_Field.Field): void {
        this._field = field;
    }

    public startRunning(): void {
        // nothing to do
    }
    public stopRunning(): void {
        // nothing to do
    }
    public dispose(): void {
        this.stopRunning();
    }

    private _getUnitMapView(): Units_UnitMapView.UnitMapView {
        return Helpers_Misc.getExisted(this._unitMapView);
    }
    private _getTileMapView(): Tiles_TileMapView.TileMapView {
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
