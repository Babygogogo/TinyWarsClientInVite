import {
    Graphics_Utils,
    Helpers_Misc,
    Tiles_TileView,
    Tiles_TileViewPool,
    Ui_Components_UiContainer,
} from "../internal.ts";

const getGridHeight = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class TileViewBox extends Ui_Components_UiContainer.UiContainer {
    private _tileView : Tiles_TileView.TileView | undefined;

    public constructor() {
        super();

        this.setAnchorOffsetY(getGridHeight());
        this._setView(Tiles_TileViewPool.TileViewPool.getInstance().acquire());
    }

    public dispose(): void {
        this.removeUiChildren();

        const view = this.getView();
        if (view) {
            this._setView(undefined);
            Tiles_TileViewPool.TileViewPool.getInstance().release(view);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): Tiles_TileView.TileView | undefined {
        return this._tileView;
    }
    private _setView(view: Tiles_TileView.TileView | undefined): void {
        this._tileView = view;

        if (view) {
            this.addUiChild(view.getImgBase());
            this.addUiChild(view.getImgDecoration());
            this.addUiChild(view.getImgObject());
            this.addUiChild(view.getImgBuff());
            this.addUiChild(view.getImgHighlight());
        }
    }
}
