import {
    Tween_Executor,
    GameConfigs_GameConfig,
    TileObjects_Utils,
    GamePanels_Dict,
    GameConfigs_Provider,
    Helpers_ImageSource,
    Lang_Utils,
    Tiles_Constants_Common,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Graphics_Constants,
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
    Users_Model,
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

    private readonly _labelRecentTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listRecent!                   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileObjectRenderer>;
    private readonly _listPlayerIndex!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listTileObject!               : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileObjectRenderer>;

    private readonly _groupRealTimeAdjust!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjustContainer! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _dataListForRecent             : DataForTileObjectRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
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

        this._listPlayerIndex.setItemRendererClass(PlayerIndexRenderer);
        this._listRecent.setItemRendererClass(TileObjectRenderer);
        this._listTileObject.setItemRendererClass(TileObjectRenderer);
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
            this._listPlayerIndex.removeAllItems(),
            this._listRecent.removeAllItems(),
            this._listTileObject.removeAllItems(),
        ]);
        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newPlayerIndex: number | null, needScroll: boolean): Promise<void> {
        const listWarEventId    = this._listPlayerIndex;
        const index             = listWarEventId.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex);
        listWarEventId.setSelectedItemIndex(index);
        if (needScroll) {
            listWarEventId.scrollToItem(index);
        }

        await this._updateListTileObject();
    }

    public async updateOnChooseTileObject(data: MapEditor_Model_MeTypes.DataForDrawTileObject): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawTileObject;
            return (oldData.objectType != data.objectType)
                || (oldData.playerIndex != data.playerIndex)
                || (oldData.shapeId != data.shapeId);
        });
        dataList.length     = 0;
        dataList[0]         = {
            war                   : war,
            dataForDrawTileObject : data,
            panel                 : this,
            gameConfig            : await GameConfigs_Provider.getLatestGameConfig(),
        };
        for (const v of filteredList) {
            if (dataList.length < MAX_RECENT_COUNT) {
                dataList.push(v);
            } else {
                break;
            }
        }
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseUnitPanel, {
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0283);
        this._labelRecentTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(Lang_Constants.TextType.B1121);

        this._groupRealTimeAdjust.arrangeItems();
        this._groupRealTimeAdjustContainer.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        const recentData = this._dataListForRecent[0];
        if (recentData == null) {
            await this._resetListPlayerIndex(null);
        } else {
            const tileObjectData    = recentData.dataForDrawTileObject;
            const playerIndex       = tileObjectData.playerIndex;
            if (playerIndex !== Players_Constants.PlayerIndex.Neutral) {
                await this._resetListPlayerIndex(playerIndex);
            } else {
                await this._resetListPlayerIndex(TileObjects_Utils.getTileObjectCfg(tileObjectData.objectType)?.isNeutralOnly ? null : playerIndex);
            }
        }

        await this._updateListRecent();
        await this._updateListTileObject();
        this._updateImgRealTimeAdjust();
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: number | null): Promise<void> {
        const dataArray: DataForPlayerIndexRenderer[] = [{
            playerIndex : null,
            panel       : this,
        }];
        for (let playerIndex = Players_Constants.PlayerIndex.Neutral; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex : playerIndex,
                panel       : this,
            });
        }

        const list = this._listPlayerIndex;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.playerIndex === selectedPlayerIndex));
    }

    private async _updateListTileObject(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const selectedData      = this._listPlayerIndex.getFirstSelectedData();
        const listTileObject    = this._listTileObject;
        if (selectedData == null) {
            await listTileObject.removeAllItems();
            return;
        }

        const playerIndex   = selectedData.playerIndex;
        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        const dataArray     : DataForTileObjectRenderer[] = [];
        for (const cfg of TileObjects_Utils.getAllTileObjectCfgArray()) {
            if ((cfg.tileObjectTypeId === Tiles_Constants_Common.ObjectTypeId.Headquarters) &&
                (playerIndex === Players_Constants.PlayerIndex.Neutral)
            ) {
                continue;
            }
            if (((cfg.isNeutralOnly) && (playerIndex != null))  ||
                ((!cfg.isNeutralOnly) && (playerIndex == null))
            ) {
                continue;
            }

            const shapesCount = (Users_Model.getSelfSettingsTextureVersion() === Graphics_Constants.TextureVersionId.V0
                ? (cfg.shapesCountInEditorForV0)
                : (cfg.shapesCountInEditor));
            for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                dataArray.push({
                    panel                 : this,
                    gameConfig            : gameConfig,
                    war                   : war,
                    dataForDrawTileObject : {
                        objectType  : cfg.tileObjectTypeId,
                        playerIndex : playerIndex ?? Players_Constants.PlayerIndex.Neutral,
                        shapeId     : shapeId,
                    },
                });
            }
        }

        await listTileObject.bindData(dataArray);
    }

    private async _updateListRecent(): Promise<void> {
        const list = this._listRecent;
        await list.bindData(this._dataListForRecent);
        list.scrollTop();
    }

    private _updateImgRealTimeAdjust(): void {
        this._imgRealTimeAdjust.setIsVisible(!!this.getOpenData()?.war.getDrawer().getIsRealTimeAdjust());
    }
}

interface DataForPlayerIndexRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerIndex : number | null;
    panel       : Panel;
}
class PlayerIndexRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;

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
        const playerIndex = this.getOpenData()?.playerIndex;
        this._labelPlayerIndex.setText(playerIndex != null ? `P${playerIndex}` : Lang_Utils.getText(Lang_Constants.TextType.B0030));
        this._imgBg.loadSource(Helpers_ImageSource.getSkinButtonBackground(playerIndex ?? 0));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForTileObjectRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dataForDrawTileObject   : MapEditor_Model_MeTypes.DataForDrawTileObject;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    panel                   : Panel;
    war                     : MapEditor_Interface_IMeWar.IMeWar;
}
class TileObjectRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileObjectRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _tileView   = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TileAnimationTick",  callback : this._onNotifyTileAnimationTick },
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

        const dataForDrawTileObject = openData.dataForDrawTileObject;
        const gameConfig            = openData.gameConfig;
        const tileObjectType        = dataForDrawTileObject.objectType;
        const shapeId               = dataForDrawTileObject.shapeId;
        const tileView              = this._tileView;
        this._labelName.setText(`${Lang_Utils.getTileObjectName(tileObjectType, gameConfig)} ${shapeId}`);
        tileView.init({
            tileObjectType        : tileObjectType,
            tileObjectShapeId     : shapeId,
            tileBaseShapeId       : null,
            tileBaseType          : null,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            skinId                : dataForDrawTileObject.playerIndex,
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel                 = openData.panel;
        const dataForDrawTileObject = openData.dataForDrawTileObject;
        panel.updateOnChooseTileObject(dataForDrawTileObject);
        panel.closePanel();
        openData.war.getDrawer().setModeDrawTileObject(dataForDrawTileObject);
    }
}
