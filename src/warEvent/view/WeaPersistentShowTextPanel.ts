import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getCurrentLanguageType,
    getText,
    getFormattedText,
    getSecondaryLanguageType,
    getLanguageTypeName,
    getLanguageText,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaPersistentShowText } from "../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { Common } from "../../warEvents/actions/constants/PersistentShowText.ts";
import { getErrorTipForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction     = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnType!                                  : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _scrExpression!                            : IUiScroller<IUiLayout>;
    private readonly _groupExpression!                          : IUiLayout;
    private readonly _groupAct!                                 : IUiLayout;

    private readonly _groupActLang1!                            : IUiContainer;
    private readonly _labelActLang1!                            : IUiLabel;
    private readonly _btnActLang1!                              : IUiButton;

    private readonly _groupActLang2!                            : IUiContainer;
    private readonly _labelActLang2!                            : IUiLabel;
    private readonly _btnActLang2!                              : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
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

        openPanel(getDict().WeActionTypeListPanel, {
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

        const languageType1     = getCurrentLanguageType();
        const textArray         = action.getTextArray();
        const textData          = textArray.find(v => (v.getLanguageType() ?? 0) === languageType1);
        const currentText       = textData?.getText();

        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0455),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : Common.MaxLength,
            tips            : getFormattedText(TextType.F0020, Common.MaxLength),
            canBeEmpty      : true,
            isMultiLine     : true,
            callback        : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(LanguageText.fromJson({
                            languageType    : languageType1,
                            text            : text,
                        }));
                    }
                }
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnActLang2(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const languageType1     = getSecondaryLanguageType();
        const textArray         = action.getTextArray();
        const textData          = textArray.find(v => (v.getLanguageType() ?? 0) === languageType1);
        const currentText       = textData?.getText();

        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0455),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : Common.MaxLength,
            tips            : getFormattedText(TextType.F0020, Common.MaxLength),
            canBeEmpty      : true,
            isMultiLine     : true,
            callback        : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(LanguageText.fromJson({
                            languageType    : languageType1,
                            text            : text,
                        }));
                    }
                }
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(TextType.B0516);

        this._btnActLang1.setText(getLanguageTypeName(getCurrentLanguageType()) ?? UndefinedError);
        this._btnActLang2.setText(getLanguageTypeName(getSecondaryLanguageType()) ?? UndefinedError);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
        this._labelDesc.setText(getBriefDescForAction(action, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateInputs(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const textArray = action.getTextArray();
        const langType1 = getCurrentLanguageType();
        const langType2 = getSecondaryLanguageType();

        {
            const label = this._labelActLang1;
            label.setText(getLanguageText({ textArray, languageType: langType1, useAlternate: false }) ?? ``);
            this._groupActLang1.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActLang2;
            label.setText(getLanguageText({ textArray, languageType: langType2, useAlternate: false }) ?? ``);
            this._groupActLang2.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): Undefinable<WeaPersistentShowText> {
        return this.getOpenData()?.action.getWeaPersistentShowText();
    }
}
