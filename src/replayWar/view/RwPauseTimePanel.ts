import {
    GamePanels_Dict,
    LocalData_Storage,
    Lang_Utils,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type ReplayWar_Interface_IRwWarBase,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export interface OpenData {
    war     : ReplayWar_Interface_IRwWarBase.IRwWarBase;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPauseTimeTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPauseTime!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPauseTime!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTurnStartTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnStart!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnTurnStart!                 : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },

            { ui : this._btnPauseTime,               callback : this._onTouchedBtnPauseTime },
            { ui : this._btnTurnStart,               callback : this._onTouchedBtnTurnStart },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnPauseTime(): void {
        const minValue  = 0;
        const maxValue  = 5000;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0846),
            minValue     : minValue,
            maxValue     : maxValue,
            currentValue : LocalData_Storage.getReplayPauseTime(),
            getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0290),
            callback     : value => {
                LocalData_Storage.setReplayPauseTime(value);
                this._updateLabelPauseTime();
            },
        });
    }

    private _onTouchedBtnTurnStart(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        war.setIsShowTurnStartPopUp(!war.getIsShowTurnStartPopUp());
        this._updateLabelTurnStart();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0846);
        this._labelPauseTimeTitle.setLangText(Lang_Constants.TextType.B0846);
        this._labelTurnStartTitle.setLangText(Lang_Constants.TextType.B1337);
    }
    private _updateComponentsForFilter(): void {
        this._updateLabelPauseTime();
        this._updateLabelTurnStart();
    }

    private _updateLabelPauseTime(): void {
        this._labelPauseTime.setText(`${LocalData_Storage.getReplayPauseTime()}ms`);
    }

    private _updateLabelTurnStart(): void {
        this._labelTurnStart.setLangText(this.getOpenData()?.war.getIsShowTurnStartPopUp() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
}
