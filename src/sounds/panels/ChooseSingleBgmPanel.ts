import {
    Tween_Executor,
    Sounds_Utils,
    Lang_Utils,
    GamePanels_Dict,
    Sounds_SoundPlayer,
    GamePanels_Manager,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiInputEventType,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiPromptedInput,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface OpenData {
    currentBgmCode      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    callbackOnConfirm   : (bgmCode: number) => void;
    callbackOnCancel?   : () => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutOngoing!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelOngoingTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOngoing!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _inputFilter!          : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnClearFilter!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listBgm!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForBgmRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnHelp,                                    callback : this._onTouchedBtnHelp },
            { ui : this._btnClose,                                   callback : this._onTouchedBtnClose },
            { ui : this._btnClearFilter,                             callback : this._onTouchedBtnClearFilter },

            { ui : this._layoutOngoing,                               callback : this._onTouchedGroupOngoing },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.SoundManagerPlayingBgmCodeChanged,   callback : this._onNotifySoundManagerPlayingBgmCodeChanged },
        ]);
        this._setInputListenerArray([
            { ui : this._inputFilter,                                callback : this._onFocusOutInputFilter,  eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listBgm.setItemRendererClass(BgmRenderer);

        {
            const layoutOngoing = this._layoutOngoing;
            layoutOngoing.setIsTouchEnabled(true);
            layoutOngoing.setIsTouchChildrenEnabled(false);
        }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listBgm.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0820),
        });
    }
    private _onTouchedBtnClose(): void {
        const callback = this.getOpenData()?.callbackOnCancel;
        (callback) && (callback());
        this.closePanel();
    }
    private _onTouchedBtnClearFilter(): void {
        const input = this._inputFilter;
        if (input.getInputText()?.length) {
            input.setInputText(``);
            this._updateListBgm(null);
        }
    }
    private _onTouchedGroupOngoing(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        openData.callbackOnConfirm(Sounds_SoundPlayer.getPlayingBgmCode());
        this.closePanel();
    }
    private _onFocusOutInputFilter(): void {
        this._inputFilter.trimInputText();
        this._updateListBgm(null);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifySoundManagerPlayingBgmCodeChanged(): void {
        this._updateLabelOngoing();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListBgm(this.getOpenData()?.currentBgmCode);
        this._updateLabelOngoing();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0541);
        this._labelOngoingTitle.setLangText(Lang_Constants.TextType.B1281);
        this._inputFilter.setPromptText(Lang_Utils.getText(Lang_Constants.TextType.B0132));
        this._updateLabelOngoing();
    }

    private async _updateListBgm(bgmCode: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<void> {
        const list      = this._listBgm;
        const dataArray = this._createDataForListBgm();
        bgmCode         ??= Sounds_SoundPlayer.getPlayingBgmCode();
        await list.bindData(dataArray);

        const index = dataArray.findIndex(v => v.bgmCode === bgmCode);
        list.setSelectedItemIndex(index);
        list.scrollToItem(Math.max(0, index));
    }
    private _updateLabelOngoing(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        this._labelOngoing.setText(Lang_Utils.getBgmSfxName(Sounds_SoundPlayer.getPlayingBgmCode(), gameConfig) ?? `----`);
        this._layoutOngoing.arrangeItems();
    }

    private _createDataForListBgm(): DataForBgmRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const filterText    = this._inputFilter.getInputText()?.toLocaleLowerCase();
        const gameConfig    = openData.gameConfig;
        const callback      = openData.callbackOnConfirm;
        const dataArray     : DataForBgmRenderer[] = [];
        for (const bgmCode of Sounds_Utils.getAllBgmCodeArray()) {
            if ((!filterText) || (Lang_Utils.getBgmSfxName(bgmCode, gameConfig)?.toLocaleLowerCase().includes(filterText))) {
                dataArray.push({
                    callback   : callback,
                    bgmCode    : bgmCode,
                    gameConfig : gameConfig,
                    panel      : this,
                });
            }
        }
        return dataArray;
    }
}

interface DataForBgmRenderer extends Ui_Types_UiListItemData.UiListItemData {
    bgmCode     : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    callback    : (bgmCode: number) => void;
    panel       : Panel;
}
class BgmRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForBgmRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutText!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTag!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._imgSelected,    callback : this._onTouchedImgSelected },
            { ui : this,                 callback : this._onTouchedSelf },
        ]);
        this._setShortSfxCode(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        this.setIsTouchEnabled(true);

        this._imgSelected.setIsTouchEnabled(true);
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
        await super._onClosed();

        Tween_Executor.Executor.removeTweens(this._imgSelected);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(e: Egret_Egret.Event): void {
        e.stopPropagation();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.panel.closePanel();
        openData.callback(openData.bgmCode);
    }
    private _onTouchedSelf(): void {
        const bgmCode = this.getOpenData()?.bgmCode;
        if (bgmCode != null) {
            Sounds_SoundPlayer.playBgm(bgmCode);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const name      = Lang_Utils.getBgmSfxName(openData.bgmCode, openData.gameConfig) ?? Lang_Constants.UndefinedError;
        const index     = name.lastIndexOf(`(`);
        const labelTag  = this._labelTag;
        const labelName = this._labelName;
        if (index >= 0) {
            labelTag.setText(name.substring(index + 1, name.length - 1));
            labelName.setText(name.substring(0, index));
        } else {
            labelTag.setText(`--`);
            labelName.setText(name);
        }
        this._layoutText.arrangeItems();
    }
}
