import {
    GameConfigs_GameConfig,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    Players_Constants,
    TileBases_Utils,
    Tiles_TileViewBox,
    Tiles_TileViewBoxPool,
    Tween_Executor,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Model_MeTypes,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentBaseType?    : number;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    callback            : (baseType: number, shapeId: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listType!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileBase!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileBaseRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,  callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);
        this._listTileBase.setItemRendererClass(TileBaseRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listType.removeAllItems(),
            this._listTileBase.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newType: number | null, needScroll: boolean): Promise<void> {
        const listType  = this._listType;
        const index     = listType.getRevisedFirstIndex(v => v?.baseType === newType);
        listType.setSelectedItemIndex(index);
        if (needScroll) {
            listType.scrollToItem(index);
        }

        await this._updateListTileBase();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._updateListType(this.getOpenData()?.currentBaseType);
        await this._updateListTileBase();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.TileBase);
    }

    private _createDataForListTileBase(): DataForTileBaseRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const gameConfig    = openData.gameConfig;
        const callback      = openData.callback;
        const baseType      = this._listType.getFirstSelectedData()?.baseType;
        const dataList      : DataForTileBaseRenderer[] = [];
        if (baseType != null) {
            const cfg = Helpers_Misc.getExisted(TileBases_Utils.getTileBaseCfg(baseType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel               : this,
                    gameConfig          : gameConfig,
                    callback            : callback,
                    dataForDrawTileBase : {
                        baseType : baseType,
                        shapeId  : shapeId,
                    },
                });
            }
        }

        return dataList;
    }

    private async _updateListType(selectedType: number | undefined): Promise<void> {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const dataArray: DataForTypeRenderer[] = [];
        for (const cfg of TileBases_Utils.getAllEnabledTileBaseCfgArray()) {
            dataArray.push({
                baseType   : cfg.tileBaseTypeId,
                gameConfig : gameConfig,
                panel      : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.baseType === selectedType));
    }

    private async _updateListTileBase(): Promise<void> {
        await this._listTileBase.bindData(this._createDataForListTileBase(), true);
    }
}

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    baseType        : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    panel           : Panel;
}
class TypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(Lang_Utils.getTileBaseName(openData.baseType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.baseType, false);
    }
}

interface DataForTileBaseRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dataForDrawTileBase : MapEditor_Model_MeTypes.DataForDrawTileBase;
    panel               : Panel;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    callback            : (baseType: number, shapeId: number) => void;
}
class TileBaseRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileBaseRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private _tileView               : Tiles_TileViewBox.TileViewBox | undefined;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        if (this._tileView == null) {
            const view      = Tiles_TileViewBoxPool.TileViewBoxPool.getInstance().acquire();
            this._tileView  = view;
            this._conTileView.addUiChild(view);

            this._updateTileView();
        }
    }
    protected override _doApplyOpenData(): void {
        this._updateTileView();
    }
    protected override async _onClosed(): Promise<void> {
        if (this._tileView) {
            const view = this._tileView;
            this._conTileView.removeUiChild(view);

            Tiles_TileViewBoxPool.TileViewBoxPool.getInstance().release(view);
            delete this._tileView;
        }

        await super._onClosed();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel                 = openData.panel;
        const dataForDrawTileBase   = openData.dataForDrawTileBase;
        openData.callback(dataForDrawTileBase.baseType, dataForDrawTileBase.shapeId);
        panel.closePanel();
    }

    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawTileBase = openData.dataForDrawTileBase;
        const tileView = this._tileView?.getView();
        tileView?.loadViewData({
            baseShapeId : dataForDrawTileBase.shapeId,
            baseTypeId  : dataForDrawTileBase.baseType,
            skinId      : Players_Constants.PlayerIndex.Neutral,
        }, true);
        tileView?.refreshAllViews();
    }
}
