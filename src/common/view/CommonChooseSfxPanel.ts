import {
    Sounds_Utils,
    Lang_Utils,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface OpenData {
    currentSfxCode  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    callback        : (sfxCode: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listSfx!          : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSfxRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                    callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSfx.setItemRendererClass(SfxRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSfx.removeAllItems();

        await super._onClosed();
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
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const list      = this._listSfx;
        const sfxCode   = this.getOpenData()?.currentSfxCode;
        await list.bindData(this._createDataForListSfx());
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.sfxCode === sfxCode));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0542);
    }

    private _createDataForListSfx(): DataForSfxRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback      = openData.callback;
        const dataArray     : DataForSfxRenderer[] = [];
        const gameConfig    = openData.gameConfig;
        for (const sfxCode of Sounds_Utils.getAllSfxCodeArray()) {
            dataArray.push({
                callback    : callback,
                sfxCode     : sfxCode,
                gameConfig  : gameConfig,
                panel       : this,
            });
        }
        return dataArray;
    }
}

interface DataForSfxRenderer extends Ui_Types_UiListItemData.UiListItemData {
    sfxCode     : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    callback    : (sfxCode: number) => void;
    panel       : Panel;
}
class SfxRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSfxRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupSelect!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelect!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelSelect!  : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelect,                    callback: this._onTouchedGroupSelect },
        ]);
        this._applySettingsForWholeTouch(true, true, undefined, Sounds_Constants.ShortSfxCode.None);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const sfxCode = this.getOpenData()?.sfxCode;
        if (sfxCode == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(sfxCode);
    }

    private _onTouchedGroupSelect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.panel.closePanel();
        openData.callback(openData.sfxCode);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelSelect.setLangText(Lang_Constants.TextType.B0258);
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelName.setText(Lang_Utils.getBgmSfxName(openData.sfxCode, openData.gameConfig) ?? Lang_Constants.UndefinedError);
    }
}
