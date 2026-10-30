import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    moveElementInList,
    deleteElementFromList,
} from "../../helpers/Collection.ts";
import { getTruncatedText } from "../../helpers/Text.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
    getLanguageText,
} from "../../lang/Utils.ts";
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
    private readonly _btnClose!             : IUiButton;
    private readonly _btnAdd!               : IUiButton;
    private readonly _btnDeleteAll!         : IUiButton;
    private readonly _btnModify!            : IUiButton;

    private readonly _listEvent!            : IUiScrollList<DataForEventRenderer>;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelNoEvent!         : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
            { type: TypeId.MeWarRuleWarEventIdArrayChanged, callback: this._onNotifyMeWarRuleWarEventIdArrayChanged },
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

        this._listEvent.setItemRendererClass(ConditionRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listEvent.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onNotifyMeWarRuleWarEventIdArrayChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnAdd(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war               = openData.war;
        const warEventFullData  = war.getWarEventManager().getWarEventFullData();
        if ((war.getIsReviewingMap()) || (warEventFullData == null)) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule           = openData.templateWarRule;
            const allWarEventIdSet          = new Set(warEventFullData.getEventArray().map(v => v.getEventId()));
            const currentWarEventIdArray    = templateWarRule.getWarEventIdArray();
            for (const warEventId of currentWarEventIdArray) {
                allWarEventIdSet.delete(warEventId);
            }
            openPanel(getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray        : [...allWarEventIdSet],
                currentNumberArray          : [],
                showNumber                  : true,
                getTitleText                : () => getFormattedText(TextType.F0092, getText(TextType.B0461)),
                getNumberMainText           : warEventId => getTruncatedText(
                    getLanguageText({
                        textArray: warEventFullData.getEventArray().find(v => v.getEventId() === warEventId)?.getEventNameArray()
                    }) ?? UndefinedError,
                    15
                ),
                callbackOnConfirm           : additionalWarEventIdArray => {
                    if (!currentWarEventIdArray) {
                        templateWarRule.setWarEventIdArray(additionalWarEventIdArray);
                    } else {
                        for (const warEventId of additionalWarEventIdArray) {
                            if (currentWarEventIdArray.indexOf(warEventId) < 0) {
                                currentWarEventIdArray.push(warEventId);
                            }
                        }
                    }
                    dispatch(TypeId.MeWarRuleWarEventIdArrayChanged);
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
                getContent : () => getText(TextType.A0801),
                callback: () => {
                    openData.templateWarRule.setWarEventIdArray([]);
                    dispatch(TypeId.MeWarRuleWarEventIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnModify(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().WeMainPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0461)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoEvent.setLangText(TextType.B0278);
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war               = openData.war;
        const templateWarRule   = openData.templateWarRule;
        const dataArray         : DataForEventRenderer[] = [];
        for (const warEventId of templateWarRule.getWarEventIdArray()) {
            dataArray.push({
                war             : war,
                templateWarRule : templateWarRule,
                warEventId      : warEventId,
            });
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listEvent.bindData(dataArray);
    }
}

interface DataForEventRenderer extends UiListItemData {
    war                 : IMeWar;
    warEventId          : number;
    templateWarRule     : TemplateWarRule;
}
class ConditionRenderer extends UiListItemRenderer<DataForEventRenderer> {
    private readonly _layoutEvent!      : IUiLayout;
    private readonly _labelEventId!     : IUiLabel;
    private readonly _labelEventName!   : IUiLabel;

    private readonly _btnUp!            : IUiButton;
    private readonly _btnDown!          : IUiButton;
    private readonly _btnDelete!        : IUiButton;

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
            const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
            if (warEventIdArray) {
                moveElementInList(warEventIdArray, openData.warEventId, -1);
                dispatch(TypeId.MeWarRuleWarEventIdArrayChanged);
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
            const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
            if (warEventIdArray) {
                moveElementInList(warEventIdArray, openData.warEventId, 1);
                dispatch(TypeId.MeWarRuleWarEventIdArrayChanged);
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
            const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
            if (warEventIdArray) {
                deleteElementFromList(warEventIdArray, openData.warEventId);
                dispatch(TypeId.MeWarRuleWarEventIdArrayChanged);
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

        const eventId = openData.warEventId;
        this._labelEventId.setText(`E${eventId}`);
        this._labelEventName.setText(getTruncatedText(
            getLanguageText({
                textArray: openData.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === eventId)?.getEventNameArray()
            }) ?? UndefinedError,
            30
        ));
        this._layoutEvent.arrangeItems();
    }
}
