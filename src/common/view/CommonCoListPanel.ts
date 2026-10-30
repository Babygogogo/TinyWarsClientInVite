import {
    Players_Constants,
    Tween_Executor,
    Helpers_ImageSource,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiCoInfo,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
    playerIndex : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listCo!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCoRenderer>;
    private readonly _uiCoInfo!     : Ui_Interfaces_IUiCoInfo.IUiCoInfo;

    private _previewingPlayerIndex  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,   callback : this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listCo.setItemRendererClass(CoRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._uiCoInfo.open();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateListCo();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listCo.removeAllItems(),
            this._uiCoInfo.close(),
        ]);

        await super._onClosed();
    }

    public setPreviewingPlayerIndex(playerIndex: number | null): void {
        if (this._getPreviewingPlayerIndex() !== playerIndex) {
            this._previewingPlayerIndex = playerIndex;
            this._updateUiCoInfo();
        }
    }
    private _getPreviewingPlayerIndex(): number | null {
        return this._previewingPlayerIndex;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0140);
    }

    private async _updateListCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const gameConfig    = war.getGcData();
        const dataArray     : DataForCoRenderer[] = [];
        for (const player of war.getPlayerManager().getAllPlayers(false)) {
            dataArray.push({
                coId        : player.getCoId(),
                skinId      : player.getUnitAndTileSkinId(),
                isAlive     : player.getAliveState() !== Players_Constants.AliveStateId.Dead,
                playerIndex : player.getPlayerIndex(),
                gameConfig  : gameConfig,
                panel       : this,
            });
        }

        const playerIndex   = openData.playerIndex;
        const list          = this._listCo;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(Math.max(0, dataArray.findIndex(v => v.playerIndex === playerIndex)));
        this._updateUiCoInfo();
    }

    private async _updateUiCoInfo(): Promise<void> {
        const selectedData = this._listCo.getFirstSelectedData();
        if (selectedData) {
            const uiCoInfo = this._uiCoInfo;
            uiCoInfo.setOpenData({
                gameConfig : selectedData.gameConfig,
                coId       : selectedData.coId,
            });
            await uiCoInfo.applyOpenData();
        }
    }
}

interface DataForCoRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerIndex : number;
    skinId      : number;
    coId        : number;
    isAlive     : boolean;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    panel       : Panel;
}
class CoRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCoRenderer> {
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;

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

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setPreviewingPlayerIndex(openData.playerIndex);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.loadSource(Helpers_ImageSource.getSkinButtonBackground(openData.skinId));
        this._labelPlayerIndex.setText(`P${openData.playerIndex}`);
        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(openData.gameConfig, openData.coId, openData.isAlive) ?? ``);
    }
}
