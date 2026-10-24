import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPersistentShowText from "../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as WarEventsActionsConstantsPersistentShowText from "../../warEvents/actions/constants/PersistentShowText.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrExpression!                            : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupExpression!                          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupAct!                                 : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupActLang1!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActLang1!                            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActLang1!                              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupActLang2!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelActLang2!                            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnActLang2!                              : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                                   callback: this.closePanel },
            { ui: this._btnType,                                    callback: this._onTouchedBtnType },

            { ui: this._btnActLang1,                                callback: this._onTouchedBtnActLang1 },
            { ui: this._btnActLang2,                                callback: this._onTouchedBtnActLang2 },
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
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
            fullData    : openData.fullData,
            action      : openData.action,
            war         : openData.war,
        });
    }

    private _onTouchedBtnActLang1(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const languageType1     = LangUtils.getCurrentLanguageType();
        const textArray         = action.getTextArray();
        const textData          = textArray.find(v => (v.getLanguageType() ?? 0) === languageType1);
        const currentText       = textData?.getText();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0455),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : WarEventsActionsConstantsPersistentShowText.Common.MaxLength,
            tips            : LangUtils.getFormattedText(LangConstants.TextType.F0020, WarEventsActionsConstantsPersistentShowText.Common.MaxLength),
            canBeEmpty      : true,
            isMultiLine     : true,
            callback        : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    HelpersCollection.deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(ProtoSchemaCommonProtoStructureLanguageText.LanguageText.fromJson({
                            languageType    : languageType1,
                            text            : text,
                        }));
                    }
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActLang2(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const languageType1     = LangUtils.getSecondaryLanguageType();
        const textArray         = action.getTextArray();
        const textData          = textArray.find(v => (v.getLanguageType() ?? 0) === languageType1);
        const currentText       = textData?.getText();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0455),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : WarEventsActionsConstantsPersistentShowText.Common.MaxLength,
            tips            : LangUtils.getFormattedText(LangConstants.TextType.F0020, WarEventsActionsConstantsPersistentShowText.Common.MaxLength),
            canBeEmpty      : true,
            isMultiLine     : true,
            callback        : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    HelpersCollection.deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(ProtoSchemaCommonProtoStructureLanguageText.LanguageText.fromJson({
                            languageType    : languageType1,
                            text            : text,
                        }));
                    }
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);

        this._btnActLang1.setText(LangUtils.getLanguageTypeName(LangUtils.getCurrentLanguageType()) ?? LangConstants.UndefinedError);
        this._btnActLang2.setText(LangUtils.getLanguageTypeName(LangUtils.getSecondaryLanguageType()) ?? LangConstants.UndefinedError);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getBriefDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateInputs(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const textArray = action.getTextArray();
        const langType1 = LangUtils.getCurrentLanguageType();
        const langType2 = LangUtils.getSecondaryLanguageType();

        {
            const label = this._labelActLang1;
            label.setText(LangUtils.getLanguageText({ textArray, languageType: langType1, useAlternate: false }) ?? ``);
            this._groupActLang1.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActLang2;
            label.setText(LangUtils.getLanguageText({ textArray, languageType: langType2, useAlternate: false }) ?? ``);
            this._groupActLang2.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaPersistentShowText.WeaPersistentShowText> {
        return this.getOpenData()?.action.getWeaPersistentShowText();
    }
}
