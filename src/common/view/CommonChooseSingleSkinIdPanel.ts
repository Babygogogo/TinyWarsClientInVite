import {
    GamePanels_Manager,
    GamePanels_Dict,
    Helpers_ImageSource,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentSkinId           : number | null;
    availableSkinIdArray    : number[];
    getHelpText?            : () => string;
    callback                : (skinId: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _list!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForItemRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        const text  = func ? func() : null;
        if (text) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnHelp.setIsVisible(!!openData.getHelpText);

        const dataArray     = this._createDataForList();
        const list          = this._list;
        const skinId        = openData.currentSkinId;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(dataArray.findIndex(v => v.skinId === skinId));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0573);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
    }

    private _createDataForList(): DataForItemRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback  = openData.callback;
        const dataArray : DataForItemRenderer[] = [];
        for (const skinId of openData.availableSkinIdArray) {
            dataArray.push({
                skinId      : skinId,
                callback    : callback,
            });
        }

        return dataArray;
    }
}

interface DataForItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    skinId      : number;
    callback    : (skinId: number) => void;
}
class ItemRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgConfirm!   : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgConfirm,  callback: this._onTouchedImgConfirm },
        ]);
        this._applySettingsForWholeTouch(true, true);

        this._imgConfirm.setIsTouchEnabled(true);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgConfirm(e: Egret_Egret.Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
        openData.callback(openData.skinId);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const skinId = this.getOpenData()?.skinId;
        if (skinId == null) {
            return;
        }

        this._imgBg.loadSource(Helpers_ImageSource.getSkinCircle(skinId, false));
        this._imgSelected.loadSource(Helpers_ImageSource.getSkinCircle(skinId, true));
    }
}
