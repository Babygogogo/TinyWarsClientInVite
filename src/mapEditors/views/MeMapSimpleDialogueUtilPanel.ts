import {
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export type OpenData = {
    war                 : MapEditor_Interface_IMeWar.IMeWar;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnDeleteAll!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteRedundancy!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged,  callback : this._onNotifyMeMapSimpleDialogueChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnDeleteAll,           callback : this._onTouchedBtnDeleteAll },
            { ui : this._btnDeleteRedundancy,    callback : this._onTouchedBtnDeleteRedundancy },
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (!war.getMapSimpleDialogueArray().length) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                war.deleteAllMapSimpleDialogues();
                for (const rule of war.getTemplateWarRuleArray()) {
                    rule.setMapSimpleDialogueIdArray([]);
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
            },
        });
    }
    private _onTouchedBtnDeleteRedundancy(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
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
            FloatText.showLang(Lang_Constants.TextType.A0389);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0191, unusedDialogueIdArray.map(v => `#${v}`).join(`, `)),
                callback   : () => {
                    war.deleteMapSimpleDialogues(unusedDialogueIdArray);
                    FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
                },
            });
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1095);
        this._btnDeleteAll.setLangText(Lang_Constants.TextType.B0931);
        this._btnDeleteRedundancy.setLangText(Lang_Constants.TextType.B0498);
    }
}
