import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import {
    getReplayPauseTime,
    setReplayPauseTime,
} from "../../localData/Storage.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { IRwWarBase } from "../interface/IRwWarBase.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war     : IRwWarBase;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;

    private readonly _labelPauseTimeTitle!          : IUiLabel;
    private readonly _labelPauseTime!               : IUiLabel;
    private readonly _btnPauseTime!                 : IUiButton;

    private readonly _labelTurnStartTitle!          : IUiLabel;
    private readonly _labelTurnStart!               : IUiLabel;
    private readonly _btnTurnStart!                 : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._btnPauseTime,               callback: this._onTouchedBtnPauseTime },
            { ui: this._btnTurnStart,               callback: this._onTouchedBtnTurnStart },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0846),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : getReplayPauseTime(),
            getHelpText     : () => getText(TextType.A0290),
            callback        : value => {
                setReplayPauseTime(value);
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
        this._labelTitle.setLangText(TextType.B0846);
        this._labelPauseTimeTitle.setLangText(TextType.B0846);
        this._labelTurnStartTitle.setLangText(TextType.B1337);
    }
    private _updateComponentsForFilter(): void {
        this._updateLabelPauseTime();
        this._updateLabelTurnStart();
    }

    private _updateLabelPauseTime(): void {
        this._labelPauseTime.setText(`${getReplayPauseTime()}ms`);
    }

    private _updateLabelTurnStart(): void {
        this._labelTurnStart.setLangText(this.getOpenData()?.war.getIsShowTurnStartPopUp() ? TextType.Yes : TextType.No);
    }
}
