import {
    Notifications_Dispatcher,
    ForceSkins_Utils,
    GamePanels_Dict,
    Helpers_ImageSource,
    Lang_Utils,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listSkin!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSkinRenderer>;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _symmetricalPlayerIndexArray   : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },

            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
            { ui : this._btnCancel,          callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSkin.setItemRendererClass(SkinRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._resetSymmetricalSkinIdSet();
        this._updateListSkin();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSkin.removeAllItems();

        await super._onClosed();
    }

    public getSymmetricalPlayerIndexArray(): number[] {
        return this._symmetricalPlayerIndexArray;
    }
    public getSymmetricalPlayerIndex(playerIndex: number): number {
        return this._symmetricalPlayerIndexArray[playerIndex];
    }
    public setSymmetricalPlayerIndex(srcPlayerIndex: number, dstPlayerIndex: number): void {
        this._symmetricalPlayerIndexArray[srcPlayerIndex] = dstPlayerIndex;
    }
    private _resetSymmetricalSkinIdSet(): void {
        const selectedPlayerIndexArray  = this.getSymmetricalPlayerIndexArray();
        selectedPlayerIndexArray.length = 0;

        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }
        for (let playerIndex = Players_Constants.PlayerIndex.Neutral; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
            selectedPlayerIndexArray[playerIndex] = drawer.getSymmetricalPlayerIndex(playerIndex);
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0478),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        const array = this.getSymmetricalPlayerIndexArray();
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
            drawer.setSymmetricalPlayerIndex(playerIndex, array[playerIndex]);
        }

        this.closePanel();
        Notifications_Dispatcher.dispatch("MeDrawerSymmetricalPlayerIndexChanged");
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1155);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
    }

    private async _updateListSkin(): Promise<void> {
        const dataArray: DataForSkinRenderer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex   : playerIndex,
                panel         : this,
                showSeparator : playerIndex != Players_Constants.PlayerIndex.Max,
            });
        }

        await this._listSkin.bindData(dataArray);
    }
}

interface DataForSkinRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerIndex     : number;
    panel           : Panel;
    showSeparator   : boolean;
}
class SkinRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSkinRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForSkinRenderer> {
    private readonly _imgSrcSkin!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgDstSkin!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSeparator!     : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = openData.playerIndex;
        const panel         = openData.panel;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray : ForceSkins_Utils.getAllSkinIdArray(false),
            currentSkinId        : panel.getSymmetricalPlayerIndex(playerIndex),
            callback             : skinId => {
                panel.setSymmetricalPlayerIndex(playerIndex, skinId);
                this._updateView();
            },
        });
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._imgSrcSkin.loadSource(Helpers_ImageSource.getSkinCircle(playerIndex, true));
        this._imgDstSkin.loadSource(Helpers_ImageSource.getSkinCircle(openData.panel.getSymmetricalPlayerIndex(playerIndex), true));
        this._imgSeparator.setIsVisible(openData.showSeparator);
    }
}
