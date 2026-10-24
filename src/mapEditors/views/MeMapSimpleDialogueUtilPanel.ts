import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    war                 : MapEditorInterfaceIMeWar.IMeWar;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _btnDeleteAll!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteRedundancy!  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged,  callback: this._onNotifyMeMapSimpleDialogueChanged },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (!war.getMapSimpleDialogueArray().length) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                war.deleteAllMapSimpleDialogues();
                for (const rule of war.getTemplateWarRuleArray()) {
                    rule.setMapSimpleDialogueIdArray([]);
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
            },
        });
    }
    private _onTouchedBtnDeleteRedundancy(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const usedDialogueIdSet = new Set<number>();
        for (const dialogueIdArray of war.getTemplateWarRuleArray().map(v => v.getMapSimpleDialogueIdArray())) {
            for (const dialogueId of dialogueIdArray) {
                usedDialogueIdSet.add(dialogueId);
            }
        }
        const unusedDialogueIdArray: number[] = [];
        for (const dialogueId of war.getMapSimpleDialogueArray().map(v => v.getDialogueId() ?? 0)) {
            if (!usedDialogueIdSet.has(dialogueId)) {
                unusedDialogueIdArray.push(dialogueId);
            }
        }

        if (!unusedDialogueIdArray.length) {
            FloatText2.showLang(LangConstants.TextType.A0389);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0191, unusedDialogueIdArray.map(v => `#${v}`).join(`, `)),
                callback: () => {
                    war.deleteMapSimpleDialogues(unusedDialogueIdArray);
                    FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
                },
            });
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B1095);
        this._btnDeleteAll.setLangText(LangConstants.TextType.B0931);
        this._btnDeleteRedundancy.setLangText(LangConstants.TextType.B0498);
    }
}
