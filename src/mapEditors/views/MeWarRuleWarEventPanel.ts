import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war                     : MapEditorInterfaceIMeWar.IMeWar;
    templateWarRule         : ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteAll!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModify!            : UiInterfacesIUiButton.IUiButton;

    private readonly _listEvent!            : UiInterfacesIUiScrollList.IUiScrollList<DataForEventRenderer>;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoEvent!         : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
            { type: NotificationsTypeId.TypeId.MeWarRuleWarEventIdArrayChanged, callback: this._onNotifyMeWarRuleWarEventIdArrayChanged },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule           = openData.templateWarRule;
            const allWarEventIdSet          = new Set(warEventFullData.getEventArray().map(v => v.getEventId() ?? 0));
            const currentWarEventIdArray    = templateWarRule.getWarEventIdArray();
            for (const warEventId of currentWarEventIdArray ?? []) {
                allWarEventIdSet.delete(warEventId);
            }
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray        : [...allWarEventIdSet],
                currentNumberArray          : [],
                showNumber                  : true,
                getTitleText                : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0461)),
                getNumberMainText           : warEventId => HelpersText.getTruncatedText(
                    LangUtils.getLanguageText({
                        textArray: warEventFullData.getEventArray().find(v => v.getEventId() === warEventId)?.getEventNameArray()
                    }) ?? LangConstants.UndefinedError,
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
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0801),
                callback: () => {
                    openData.templateWarRule.setWarEventIdArray([]);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnModify(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeMainPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0461)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoEvent.setText(LangUtils.getText(LangConstants.TextType.B0278));
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

interface DataForEventRenderer extends UiTypesUiListItemData.UiListItemData {
    war                 : MapEditorInterfaceIMeWar.IMeWar;
    warEventId          : number;
    templateWarRule     : ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
}
class ConditionRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForEventRenderer> {
    private readonly _layoutEvent!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelEventId!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEventName!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnUp!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDown!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!        : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnUp,          callback: this._onTouchedBtnUp },
            { ui: this._btnDown,        callback: this._onTouchedBtnDown },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
            if (warEventIdArray) {
                HelpersCollection.moveElementInList(warEventIdArray, openData.warEventId, -1);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
            }
        }
    }
    private _onTouchedBtnDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
            if (warEventIdArray) {
                HelpersCollection.moveElementInList(warEventIdArray, openData.warEventId, 1);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
            }
        }
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
            if (warEventIdArray) {
                HelpersCollection.deleteElementFromList(warEventIdArray, openData.warEventId);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
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
        this._labelEventName.setText(HelpersText.getTruncatedText(
            LangUtils.getLanguageText({
                textArray: openData.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === eventId)?.getEventNameArray()
            }) ?? LangConstants.UndefinedError,
            30
        ));
        this._layoutEvent.arrangeItems();
    }
}
