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
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteAll!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModify!            : UiInterfacesIUiButton.IUiButton;

    private readonly _list!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged,                  callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule           = openData.templateWarRule;
            const allDialogueIdSet          = new Set(mapSimpleDialogueArray.map(v => v.getDialogueId() ?? 0));
            const currentDialogueIdArray    = templateWarRule.getMapSimpleDialogueIdArray();
            for (const dialogueId of currentDialogueIdArray) {
                allDialogueIdSet.delete(dialogueId);
            }
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray        : [...allDialogueIdSet].sort((v1, v2) => v1 - v2),
                currentNumberArray          : [],
                showNumber                  : true,
                getTitleText                : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B1095)),
                getNumberMainText           : dialogueId => HelpersText.getTruncatedText(
                    LangUtils.getLanguageText({
                        textArray: mapSimpleDialogueArray.find(v => (v.getDialogueId() ?? 0) === dialogueId)?.getDialogueNameArray()
                    }) ?? LangConstants.UndefinedError,
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
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
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
                getContent : () => LangUtils.getText(LangConstants.TextType.A0803),
                callback: () => {
                    openData.templateWarRule.setMapSimpleDialogueIdArray([]);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnModify(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeMapSimpleDialogueMainPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1095)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.A0842));
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

interface DataForItemRenderer extends UiTypesUiListItemData.UiListItemData {
    war                 : MapEditorInterfaceIMeWar.IMeWar;
    dialogueId          : number;
    templateWarRule     : ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
}
class ItemRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnUp!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDown!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!    : UiInterfacesIUiButton.IUiButton;

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
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                HelpersCollection.moveElementInList(dialogueIdArray, openData.dialogueId, -1);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
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
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                HelpersCollection.moveElementInList(dialogueIdArray, openData.dialogueId, 1);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
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
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                HelpersCollection.deleteElementFromList(dialogueIdArray, openData.dialogueId);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged);
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
        this._labelName.setText(HelpersText.getTruncatedText(
            LangUtils.getLanguageText({
                textArray: openData.war.getMapSimpleDialogueArray().find(v => (v.getDialogueId() ?? 0) === dialogueId)?.getDialogueNameArray()
            }) ?? LangConstants.UndefinedError,
            30
        ));
        this._layoutName.arrangeItems();
    }
}
