import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../interface/IRwWarBase.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war     : ReplayWarInterfaceIRwWarBase.IRwWarBase;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _labelPauseTimeTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPauseTime!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPauseTime!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelTurnStartTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurnStart!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTurnStart!                 : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._btnPauseTime,               callback: this._onTouchedBtnPauseTime },
            { ui: this._btnTurnStart,               callback: this._onTouchedBtnTurnStart },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0846),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : LocalDataStorage2.getReplayPauseTime(),
            getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0290),
            callback        : value => {
                LocalDataStorage2.setReplayPauseTime(value);
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0846));
        this._labelPauseTimeTitle.setText(LangUtils.getText(LangConstants.TextType.B0846));
        this._labelTurnStartTitle.setText(LangUtils.getText(LangConstants.TextType.B1337));
    }
    private _updateComponentsForFilter(): void {
        this._updateLabelPauseTime();
        this._updateLabelTurnStart();
    }

    private _updateLabelPauseTime(): void {
        this._labelPauseTime.setText(`${LocalDataStorage2.getReplayPauseTime()}ms`);
    }

    private _updateLabelTurnStart(): void {
        this._labelTurnStart.setText(LangUtils.getTextForYesOrNo(this.getOpenData()?.war.getIsShowTurnStartPopUp()));
    }
}
