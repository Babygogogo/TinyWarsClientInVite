import {
    GameConfigs_Provider,
    Units_Unit,
    Units_UnitView,
    type GameConfigs_GameConfig,
    Units_Utils_Serialization,
    Tween_Executor,
    GamePanels_Dict,
    Helpers_Misc,
    Helpers_ImageSource,
    Lang_Utils,
    MapEditor_Model_MeModel,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Model_MeTypes,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const MAX_RECENT_COUNT = 10;

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelRecentTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listRecent!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _listPlayerIndex!  : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listUnit!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;

    private readonly _dataListForRecent : DataForUnitRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnSwitch,  callback: this._onTouchedBtnSwitch },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayerIndex.setItemRendererClass(PlayerIndexRenderer);
        this._listRecent.setItemRendererClass(UnitRenderer);
        this._listUnit.setItemRendererClass(UnitRenderer);
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
            this._listUnit.removeAllItems(),
        ]);
        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newPlayerIndex: number, needScroll: boolean): Promise<void> {
        const listPlayerIndex   = this._listPlayerIndex;
        const index             = listPlayerIndex.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex);
        listPlayerIndex.setSelectedItemIndex(index);
        if (needScroll) {
            listPlayerIndex.scrollToItem(index);
        }

        await this._updateListUnit();
    }

    public async updateOnChooseUnit(data: MapEditor_Model_MeTypes.DataForDrawUnit): Promise<void> {
        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawUnit;
            return (oldData.playerIndex != data.playerIndex)
                || (oldData.unitType != data.unitType);
        });
        dataList.length     = 0;
        dataList[0]         = {
            dataForDrawUnit : data,
            panel           : this,
            gameConfig      : await GameConfigs_Provider.getLatestGameConfig(),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseTileBasePanel, {
            war : war,
        });
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0281);
        this._labelRecentTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0372)}:`);
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const data = this._dataListForRecent[0];
        await this._resetListPlayerIndex(data ? data.dataForDrawUnit.playerIndex : Players_Constants.PlayerIndex.First);
        await this._updateListUnit();
        await this._updateListRecent();
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: number | null): Promise<void> {
        const dataArray: DataForPlayerIndexRenderer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex,
                panel       : this,
            });
        }

        const list = this._listPlayerIndex;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.playerIndex === selectedPlayerIndex));
    }

    private async _updateListUnit(): Promise<void> {
        const playerIndex = this._listPlayerIndex.getFirstSelectedData()?.playerIndex;
        const listUnit    = this._listUnit;
        if (playerIndex == null) {
            await listUnit.removeAllItems();
            return;
        }

        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        const dataArray     : DataForUnitRenderer[] = [];
        for (const unitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                panel           : this,
                dataForDrawUnit : {
                    playerIndex,
                    unitType,
                },
                gameConfig,
            });
        }

        await listUnit.bindData(dataArray);
    }

    private async _updateListRecent(): Promise<void> {
        await this._listRecent.bindData(this._dataListForRecent);
        this._listRecent.scrollTop();
    }
}

interface DataForPlayerIndexRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerIndex : number;
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
        Tween_Executor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const playerIndex = this.getOpenData()?.playerIndex;
        if (playerIndex == null) {
            return;
        }

        this._labelPlayerIndex.setText(`P${playerIndex}`);
        this._imgBg.loadSource(Helpers_ImageSource.getSkinButtonBackground(playerIndex));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dataForDrawUnit : MapEditor_Model_MeTypes.DataForDrawUnit;
    panel           : Panel;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conUnitView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private _unitView   = new Units_UnitView.UnitView();

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
        this._conUnitView.addUiChild(this._unitView);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawUnit   = openData.dataForDrawUnit;
        const unitType          = dataForDrawUnit.unitType;
        const gameConfig        = openData.gameConfig;
        const war               = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar());
        this._labelName.setText(Lang_Utils.getUnitName(unitType, gameConfig) ?? Lang_Constants.UndefinedError);

        const unitView  = this._unitView;
        const unit      = new Units_Unit.Unit();
        unit.init(Units_Utils_Serialization.createDefault({
            gridIndex   : { x: 0, y: 0 },
            unitId      : 0,
            unitTypeId  : unitType,
            playerIndex : dataForDrawUnit.playerIndex,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);
        unitView.init(unit);
        unitView.startRunningView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel             = openData.panel;
        const dataForDrawUnit   = openData.dataForDrawUnit;
        panel.updateOnChooseUnit(dataForDrawUnit);
        panel.closePanel();
        Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()).getDrawer().setModeDrawUnit(dataForDrawUnit);
    }
}
