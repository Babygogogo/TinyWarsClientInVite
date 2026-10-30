import {
    Tween_Executor,
    GameConfigs_GameConfig,
    TileDecorations_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    MapEditor_Model_MeModel,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
    type MapEditor_Model_MeTypes,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const MAX_RECENT_COUNT = 10;

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!                    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listType!                     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileDecoration!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileDecorationRenderer>;
    private readonly _listRecent!                   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileDecorationRenderer>;
    private readonly _labelRecentTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRealTimeAdjust!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjustContainer! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : Ui_Interfaces_IUiButton.IUiButton;

    private _dataListForRecent  : DataForTileDecorationRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnSwitch,                  callback : this._onTouchedBtnSwitch },

            { ui : this._groupRealTimeAdjust,        callback : this._onTouchedGroupRealTimeAdjust },
            { ui : this._btnHelpRealTimeAdjust,      callback : this._onTouchedBtnHelpRealTimeAdjust },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);
        this._listTileDecoration.setItemRendererClass(TileDecorationRenderer);
        this._listRecent.setItemRendererClass(TileDecorationRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listRecent.removeAllItems(),
            this._listTileDecoration.removeAllItems(),
            this._listType.removeAllItems(),
        ]);
        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newType: number | null, needScroll: boolean): Promise<void> {
        const listType  = this._listType;
        const index     = listType.getRevisedFirstIndex(v => v?.decorationType === newType);
        listType.setSelectedItemIndex(index);
        await this._updateListTileDecoration();

        if (needScroll) {
            listType.scrollToItem(index);
        }
    }

    public async updateOnChooseTileDecoration(data: MapEditor_Model_MeTypes.DataForDrawTileDecoration): Promise<void> {
        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawTileDecoration;
            return (oldData.decorationType != data.decorationType)
                || (oldData.shapeId != data.shapeId);
        });
        dataList.length     = 0;
        dataList[0]         = {
            dataForDrawTileDecoration : data,
            panel                     : this,
            gameConfig                : Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()?.getGcData()),
        };
        for (const v of filteredList) {
            if (dataList.length < MAX_RECENT_COUNT) {
                dataList.push(v);
            } else {
                break;
            }
        }
        await this._updateListRecent();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnSwitch(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseTileObjectPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0032),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0662);
        this._labelRecentTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(Lang_Constants.TextType.B1121);

        this._groupRealTimeAdjust.arrangeItems();
        this._groupRealTimeAdjustContainer.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        await this._updateListType(this._dataListForRecent[0]?.dataForDrawTileDecoration.decorationType);
        await this._updateListTileDecoration();
        await this._updateListRecent();
        this._updateImgRealTimeAdjust();
    }

    private _createDataForListTileDecoration(): DataForTileDecorationRenderer[] {
        const gameConfig        = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()?.getGcData());
        const decorationType    = this._listType.getFirstSelectedData()?.decorationType;
        const dataList          : DataForTileDecorationRenderer[] = [];
        if (decorationType != null) {
            const cfg = Helpers_Misc.getExisted(TileDecorations_Utils.getTileDecorationCfg(decorationType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel                     : this,
                    gameConfig                : gameConfig,
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
        const gameConfig    = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()?.getGcData());
        const dataArray     : DataForTypeRenderer[] = [];
        for (const cfg of TileDecorations_Utils.getAllTileDecorationCfgArray()) {
            dataArray.push({
                decorationType : cfg.tileDecorationTypeId,
                gameConfig     : gameConfig,
                panel          : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.decorationType === selectedType));
    }

    private async _updateListTileDecoration(): Promise<void> {
        const list = this._listTileDecoration;
        await list.bindData(this._createDataForListTileDecoration());
        list.scrollToItem(0);
    }

    private async _updateListRecent(): Promise<void> {
        const list = this._listRecent;
        await list.bindData(this._dataListForRecent);
        list.scrollToItem(0);
    }

    private _updateImgRealTimeAdjust(): void {
        this._imgRealTimeAdjust.setIsVisible(!!this.getOpenData()?.war.getDrawer().getIsRealTimeAdjust());
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

        const panel                     = openData.panel;
        const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
        panel.updateOnChooseTileDecoration(dataForDrawTileDecoration);
        panel.closePanel();
        Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()).getDrawer().setModeDrawTileDecoration(dataForDrawTileDecoration);
    }
}
