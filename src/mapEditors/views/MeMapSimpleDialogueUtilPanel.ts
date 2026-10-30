import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    war                 : IMeWar;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _btnDeleteAll!         : IUiButton;
    private readonly _btnDeleteRedundancy!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeMapSimpleDialogueChanged,  callback: this._onNotifyMeMapSimpleDialogueChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnDeleteAll,           callback: this._onTouchedBtnDeleteAll },
            { ui: this._btnDeleteRedundancy,    callback: this._onTouchedBtnDeleteRedundancy },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeMapSimpleDialogueChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnDeleteAll(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (!war.getMapSimpleDialogueArray().length) {
            showLang(TextType.B0278);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                war.deleteAllMapSimpleDialogues();
                for (const rule of war.getTemplateWarRuleArray()) {
                    rule.setMapSimpleDialogueIdArray([]);
                }

                dispatch(TypeId.MeMapSimpleDialogueChanged);
            },
        });
    }
    private _onTouchedBtnDeleteRedundancy(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const usedDialogueIdSet = new Set<number>();
        for (const dialogueIdArray of war.getTemplateWarRuleArray().map(v => v.getMapSimpleDialogueIdArray())) {
            for (const dialogueId of dialogueIdArray) {
                usedDialogueIdSet.add(dialogueId);
            }
        }
        const unusedDialogueIdArray: number[] = [];
        for (const dialogueId of war.getMapSimpleDialogueArray().map(v => v.getDialogueId())) {
            if (!usedDialogueIdSet.has(dialogueId)) {
                unusedDialogueIdArray.push(dialogueId);
            }
        }

        if (!unusedDialogueIdArray.length) {
            showLang(TextType.A0389);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getFormattedText(TextType.F0191, unusedDialogueIdArray.map(v => `#${v}`).join(`, `)),
                callback: () => {
                    war.deleteMapSimpleDialogues(unusedDialogueIdArray);
                    showLang(TextType.OperationSucceeded);

                    dispatch(TypeId.MeMapSimpleDialogueChanged);
                },
            });
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1095);
        this._btnDeleteAll.setLangText(TextType.B0931);
        this._btnDeleteRedundancy.setLangText(TextType.B0498);
    }
}
