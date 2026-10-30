import {
    Tween_Executor,
    GameConfigs_GameConfig,
    TileDecorations_Utils,
    Helpers_Misc,
    Lang_Utils,
    Players_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
    type MapEditor_Model_MeTypes,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentDecorationType?  : number;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    callback                : (decorationType: number, shapeId: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listType!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileDecoration!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileDecorationRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,      callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);
        this._listTileDecoration.setItemRendererClass(TileDecorationRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listType.removeAllItems(),
            this._listTileDecoration.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newType: number | null, needScroll: boolean): Promise<void> {
        const listType  = this._listType;
        const index     = listType.getRevisedFirstIndex(v => v?.decorationType === newType);
        listType.setSelectedItemIndex(index);
        if (needScroll) {
            listType.scrollToItem(index);
        }

        await this._updateListTileDecoration();
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

        await this._updateListType(this.getOpenData()?.currentDecorationType);
        await this._updateListTileDecoration();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.TileDecoration);
    }

    private _createDataForListTileDecoration(): DataForTileDecorationRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const gameConfig        = openData.gameConfig;
        const callback          = openData.callback;
        const decorationType    = this._listType.getFirstSelectedData()?.decorationType;
        const dataList          : DataForTileDecorationRenderer[] = [];
        if (decorationType != null) {
            const cfg = Helpers_Misc.getExisted(TileDecorations_Utils.getTileDecorationCfg(decorationType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel                     : this,
                    gameConfig                : gameConfig,
                    callback                  : callback,
                    dataForDrawTileDecoration : {
                        decorationType : decorationType,
                        shapeId        : shapeId,
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
        for (const cfg of TileDecorations_Utils.getAllTileDecorationCfgArray()) {
            dataArray.push({
                decorationType : cfg.tileDecorationTypeId,
                gameConfig     : gameConfig,
                panel          : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.decorationType == selectedType));
    }

    private async _updateListTileDecoration(): Promise<void> {
        await this._listTileDecoration.bindData(this._createDataForListTileDecoration(), true);
    }
}

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    decorationType  : number;
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
    protected override async _onOpened(): Promise<void> {
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
        this._labelType.setText(Lang_Utils.getTileDecorationName(openData.decorationType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.decorationType, false);
    }
}

interface DataForTileDecorationRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dataForDrawTileDecoration   : MapEditor_Model_MeTypes.DataForDrawTileDecoration;
    panel                       : Panel;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    callback                    : (decorationType: number, shapeId: number) => void;
}
class TileDecorationRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileDecorationRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private _tileView   = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.TileAnimationTick,  callback : this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        tileView.startRunningView();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
        const shapeId                   = dataForDrawTileDecoration.shapeId;
        this._labelName.setText(`${shapeId}`);

        const tileView = this._tileView;
        tileView.init({
            tileBaseShapeId       : null,
            tileBaseType          : null,
            tileDecorationType    : dataForDrawTileDecoration.decorationType,
            tileDecorationShapeId : shapeId,
            tileObjectShapeId     : null,
            tileObjectType        : null,
            skinId                : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : openData.gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = openData.dataForDrawTileDecoration;
        openData.callback(data.decorationType, data.shapeId);
        openData.panel.closePanel();
    }
}
