import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { moveElementInList, deleteElementFromList } from "../../helpers/Collection.ts";
import { getTruncatedText } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getLanguageText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war                     : IMeWar;
    templateWarRule         : TemplateWarRule;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnAdd!               : IUiButton;
    private readonly _btnDeleteAll!         : IUiButton;
    private readonly _btnModify!            : IUiButton;

    private readonly _list!                 : IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeMapSimpleDialogueChanged,                  callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnAdd,         callback: this._onTouchedBtnAdd },
            { ui: this._btnDeleteAll,   callback: this._onTouchedBtnDeleteAll },
            { ui: this._btnModify,      callback: this._onTouchedBtnModify },
        ]);
        this._setIsTouchMaskEnabled(true);
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

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeMapSimpleDialogueChanged(): void {
        this._updateView();
    }
    private _onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnAdd(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war                       = openData.war;
        const mapSimpleDialogueArray    = war.getMapSimpleDialogueArray();
        if ((war.getIsReviewingMap()) || (mapSimpleDialogueArray == null)) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule           = openData.templateWarRule;
            const allDialogueIdSet          = new Set(mapSimpleDialogueArray.map(v => v.getDialogueId()));
            const currentDialogueIdArray    = templateWarRule.getMapSimpleDialogueIdArray();
            for (const dialogueId of currentDialogueIdArray) {
                allDialogueIdSet.delete(dialogueId);
            }
            openPanel(getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray        : [...allDialogueIdSet].sort((v1, v2) => v1 - v2),
                currentNumberArray          : [],
                showNumber                  : true,
                getTitleText                : () => getFormattedText(TextType.F0092, getText(TextType.B1095)),
                getNumberMainText           : dialogueId => getTruncatedText(
                    getLanguageText({
                        textArray: mapSimpleDialogueArray.find(v => (v.getDialogueId()) === dialogueId)?.getDialogueNameArray()
                    }) ?? UndefinedError,
                    15
                ),
                callbackOnConfirm           : additionalDialogueIdArray => {
                    if (!currentDialogueIdArray) {
                        templateWarRule.setMapSimpleDialogueIdArray(additionalDialogueIdArray);
                    } else {
                        for (const dialogueId of additionalDialogueIdArray) {
                            if (currentDialogueIdArray.indexOf(dialogueId) < 0) {
                                currentDialogueIdArray.push(dialogueId);
                            }
                        }
                    }
                    dispatch(TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnDeleteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0803),
                callback: () => {
                    openData.templateWarRule.setMapSimpleDialogueIdArray([]);
                    dispatch(TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnModify(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().MeMapSimpleDialogueMainPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B1095)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setLangText(TextType.A0842);
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war                   = openData.war;
        const templateWarRule       = openData.templateWarRule;
        const dataArray             : DataForItemRenderer[] = [];
        for (const dialogueId of templateWarRule.getMapSimpleDialogueIdArray()) {
            dataArray.push({
                war                 : war,
                templateWarRule     : templateWarRule,
                dialogueId          : dialogueId,
            });
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends UiListItemData {
    war                 : IMeWar;
    dialogueId          : number;
    templateWarRule     : TemplateWarRule;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    private readonly _btnUp!        : IUiButton;
    private readonly _btnDown!      : IUiButton;
    private readonly _btnDelete!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnUp,          callback: this._onTouchedBtnUp },
            { ui: this._btnDown,        callback: this._onTouchedBtnDown },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnUp(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                moveElementInList(dialogueIdArray, openData.dialogueId, -1);
                dispatch(TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
            }
        }
    }
    private _onTouchedBtnDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                moveElementInList(dialogueIdArray, openData.dialogueId, 1);
                dispatch(TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
            }
        }
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                deleteElementFromList(dialogueIdArray, openData.dialogueId);
                dispatch(TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
            }
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueId = openData.dialogueId;
        this._labelId.setText(`#${dialogueId}`);
        this._labelName.setText(getTruncatedText(
            getLanguageText({
                textArray: openData.war.getMapSimpleDialogueArray().find(v => (v.getDialogueId()) === dialogueId)?.getDialogueNameArray()
            }) ?? UndefinedError,
            30
        ));
        this._layoutName.arrangeItems();
    }
}
