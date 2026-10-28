import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { Common, SmallDialogueSideId } from "../../dialogues/Constants.ts";
import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { deleteElementFromList, createRange } from "../../helpers/Collection.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getCurrentLanguageType,
    getSecondaryLanguageType,
    getLanguageText,
    getLanguageTypeName,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSmallDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import { DataForAside } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForAside.ts";
import { DataForCoDialogue } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForDialogue.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getDefaultSimpleCoDialogueData, getErrorTipForAction } from "../../warEvents/actions/utils/Common.ts";
import { getErrorTipForWeaSimpleDialogueData } from "../../warEvents/actions/utils/SmallDialogueSimple.ts";

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnType!              : IUiButton;
    private readonly _btnPlay!              : IUiButton;
    private readonly _btnAddDialogue!       : IUiButton;
    private readonly _btnClear!             : IUiButton;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelDialoguesCount!  : IUiLabel;
    private readonly _listDialogue!         : IUiScrollList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnAddDialogue,     callback: this._onTouchedBtnAddDialogue },
            { ui: this._btnClear,           callback: this._onTouchedBtnClear },
            { ui: this._btnType,            callback: this._onTouchedBtnType },
            { ui: this._btnPlay,            callback: this._onTouchedBtnPlay },
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listDialogue.setItemRendererClass(DialogueRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listDialogue.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyWarEventFullDataChanged(): void {
        this._updateComponentsForDialogues();
    }

    private _onTouchedBtnAddDialogue(): void {
        const dialogueArray = getExisted(this._getAction()?.getDataArray());
        if (dialogueArray.length > Common.MaxCount) {
            show(getText(TextType.A0228));
        } else {
            dialogueArray.push(getDefaultSimpleCoDialogueData());
            dispatch(TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnClear(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                getExisted(this._getAction()?.getDataArray()).length = 0;
                dispatch(TypeId.WarEventFullDataChanged);
            }
        });
    }

    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().WeActionTypeListPanel, {
            war         : openData.war,
            fullData    : openData.fullData,
            action      : openData.action,
        });
    }

    private _onTouchedBtnPlay(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const dialogueAction    = getExisted(action.getWeaSmallDialogueSimple());
        const errorTip          = getErrorTipForAction(openData.fullData, action, openData.war);
        if (errorTip) {
            show(errorTip);
            return;
        }

        openPanel(getDict().BwSmallDialoguePanel, {
            war             : openData.war,
            actionData      : dialogueAction,
            callbackOnClose : () => {
                // nothing to do
            },
        });
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0118),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForDialogues();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(TextType.B0516);
    }

    private async _updateComponentsForDialogues(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action    = openData.action;
        const war       = openData.war;
        const dataArray : DataForDialogueRenderer[] = [];
        for (const dataForAddUnit of action.getWeaSmallDialogueSimple()?.getDataArray() ?? []) {
            dataArray.push({
                war,
                action,
                dataForDialogue: dataForAddUnit,
            });
        }

        await this._listDialogue.bindData(dataArray);

        const label     = this._labelDialoguesCount;
        const maxCount  = Common.MaxCount;
        const currCount = dataArray.length;
        label.setText(`${getText(TextType.B0675)}: ${currCount} / ${maxCount}`);
        label.setTextColor(((currCount <= maxCount) && (currCount > 0)) ? ColorValue.White : ColorValue.Red);
    }

    private _getAction(): Undefinable<WeaSmallDialogueSimple> {
        return this.getOpenData()?.action.getWeaSmallDialogueSimple();
    }
}

interface DataForDialogueRenderer extends UiListItemData {
    war             : IBwWar;
    action          : WarEventAction;
    dataForDialogue : DataForDialogue;
}
class DialogueRenderer extends UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _labelError!           : IUiLabel;
    private readonly _btnChangeType!        : IUiButton;
    private readonly _btnInsert!            : IUiButton;
    private readonly _btnUp!                : IUiButton;
    private readonly _btnDelete!            : IUiButton;

    private readonly _labelDialogueType!    : IUiLabel;
    private readonly _btnPosition!          : IUiButton;
    private readonly _labelPosition!        : IUiLabel;

    private readonly _groupCoDialogue!      : IUiContainer;
    private readonly _btnPortrait!          : IUiButton;
    private readonly _labelPortrait!        : IUiLabel;
    private readonly _btnCustomName!        : IUiButton;
    private readonly _labelCustomName!      : IUiLabel;

    private readonly _btn1!                 : IUiButton;
    private readonly _btnDelete1!           : IUiButton;
    private readonly _label1!               : IUiLabel;
    private readonly _btn2!                 : IUiButton;
    private readonly _btnDelete2!           : IUiButton;
    private readonly _label2!               : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnChangeType,      callback: this._onTouchedBtnChangeType },
            { ui: this._btnInsert,          callback: this._onTouchedBtnInsert },
            { ui: this._btnUp,              callback: this._onTouchedBtnUp },
            { ui: this._btnDelete,          callback: this._onTouchedBtnDelete },

            { ui: this._btnPosition,        callback: this._onTouchedBtnPosition },
            { ui: this._btnPortrait,        callback: this._onTouchedBtnPortrait },
            { ui: this._btnCustomName,      callback: this._onTouchedBtnCustomName },
            { ui: this._btn1,               callback: this._onTouchedBtn1 },
            { ui: this._btnDelete1,         callback: this._onTouchedBtnDelete1 },
            { ui: this._btn2,               callback: this._onTouchedBtn2 },
            { ui: this._btnDelete2,         callback: this._onTouchedBtnDelete2 },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._label1.setAutoShrinkHeight(60);
        this._label2.setAutoShrinkHeight(60);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnChangeType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDialogue = openData.dataForDialogue;

        {
            const dataForAside = dataForDialogue.getDataForAside();
            if (dataForAside) {
                dataForDialogue.setDataForAside(null);
                dataForDialogue.setDataForCoDialogue(DataForCoDialogue.fromJson({
                    coId        : openData.war.getGcData().getCoIdArrayForDialogue()[0],
                    side        : dataForAside.getSide(),
                    textArray   : dataForAside.getTextArray().map(v => v.toJson()),
                    nameArray   : [],
                }));
                dispatch(TypeId.WarEventFullDataChanged);
                return;
            }
        }

        {
            const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForAside(DataForAside.fromJson({
                    textArray   : dataForCoDialogue.getTextArray().map(v => v.toJson()),
                    side        : dataForCoDialogue.getSide(),
                }));
                dispatch(TypeId.WarEventFullDataChanged);
                return;
            }
        }

        throw newError(`Invalid dataForDialogue.`);
    }

    private _onTouchedBtnInsert(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray());
        if (dialogueArray.length > Common.MaxCount) {
            show(getText(TextType.A0228));
        } else {
            dialogueArray.splice(dialogueArray.indexOf(openData.dataForDialogue), 0, openData.dataForDialogue.clone());
            dispatch(TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray());
        const index         = dialogueArray.indexOf(openData.dataForDialogue);
        if (index > 0) {
            [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
            dispatch(TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                deleteElementFromList(getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray()), openData.dataForDialogue);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPosition(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const data = dataForDialogue.getDataForCoDialogue() ?? dataForDialogue.getDataForAside();
        if (data) {
            data.setSide(data.getSide() === SmallDialogueSideId.Bottom
                ? SmallDialogueSideId.Top
                : SmallDialogueSideId.Bottom
            );
            dispatch(TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnPortrait(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForCoDialogue = openData.dataForDialogue.getDataForCoDialogue();
        if (dataForCoDialogue == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B1442),
            availableNumberArray    : [0].concat(createRange(1, openData.war.getPlayersCountUnneutral() + 1, 1)),
            currentNumber           : dataForCoDialogue.getPlayerIndex() ?? 0,
            getNumberMainText       : num => {
                if (num === 0) {
                    return getText(TextType.B0145);
                } else {
                    return `P${num}`;
                }
            },
            callbackOnConfirm       : num => {
                if (num !== 0) {
                    dataForCoDialogue.setCoId(null);
                    dataForCoDialogue.setPlayerIndex(num);
                    dispatch(TypeId.WarEventFullDataChanged);
                } else {
                    const currentCoId   = dataForCoDialogue.getCoId();
                    const gameConfig    = openData.war.getGcData();
                    openPanel(getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gameConfig,
                        availableCoIdArray  : gameConfig.getCoIdArrayForDialogue(),
                        currentCoId         : currentCoId,
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (newCoId !== currentCoId) {
                                dataForCoDialogue.setPlayerIndex(null);
                                dataForCoDialogue.setCoId(newCoId);
                                dispatch(TypeId.WarEventFullDataChanged);
                            }
                        },
                    });
                }
            }
        });
    }

    private _onTouchedBtnCustomName(): void {
        const dataForDialogue = getExisted(this.getOpenData()?.dataForDialogue.getDataForCoDialogue());
        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : dataForDialogue.getNameArray(),
            allowEmpty          : true,
            maxTextLength       : Common.MaxNameLength,
            getTitleText        : () => getText(TextType.B0156),
            getHelpText         : () => getFormattedText(TextType.F0020, Common.MaxNameLength),
            callback            : newNameArray => {
                const revisedArray: LanguageText[] = [];
                for (const name of newNameArray) {
                    if (name.getText()) {
                        revisedArray.push(name);
                    }
                }
                dataForDialogue.setNameArray(revisedArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtn1(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType1 = getCurrentLanguageType();
        const textArray     = getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const textData      = textArray.find(v => (v.getLanguageType()) === languageType1);
        const currentText   = textData?.getText();

        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0455),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : Common.MaxTextLength,
            tips            : getFormattedText(TextType.F0020, Common.MaxTextLength),
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

    private _onTouchedBtnDelete1(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType1     = getCurrentLanguageType();
        const textArray         = getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const index             = textArray.findIndex(v => (v.getLanguageType()) === languageType1);
        const textData          = textArray[index];
        if (textData?.getText() != null) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
                callback    : () => {
                    textArray.splice(index, 1);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onTouchedBtn2(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType2     = getSecondaryLanguageType();
        const textArray         = getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const textData          = textArray.find(v => (v.getLanguageType()) === languageType2);
        const currentText       = textData?.getText();

        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0456),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : Common.MaxTextLength,
            tips            : getFormattedText(TextType.F0020, Common.MaxTextLength),
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
                            languageType    : languageType2,
                            text            : text,
                        }));
                    }
                }
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnDelete2(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType2     = getSecondaryLanguageType();
        const textArray         = getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const index             = textArray.findIndex(v => v.getLanguageType() === languageType2);
        const textData          = textArray[index];
        if (textData?.getText() != null) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
                callback    : () => {
                    textArray.splice(index, 1);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // view functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDialogue   = openData.dataForDialogue;
        const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
        const dataForAside      = dataForDialogue.getDataForAside();
        const languageType1     = getCurrentLanguageType();
        const languageType2     = getSecondaryLanguageType();
        const groupCoDialogue   = this._groupCoDialogue;
        const labelPosition     = this._labelPosition;

        if (dataForAside) {
            groupCoDialogue.setIsVisible(false);
            labelPosition.setLangText(dataForAside.getSide() === SmallDialogueSideId.Bottom ? TextType.B1261 : TextType.B1260);

        } else if (dataForCoDialogue) {
            groupCoDialogue.setIsVisible(true);
            labelPosition.setLangText(dataForCoDialogue.getSide() === SmallDialogueSideId.Bottom ? TextType.B1261 : TextType.B1260);

            const coId = dataForCoDialogue.getCoId();
            this._labelPortrait.setText(coId != null
                ? (openData.war.getGcData().getCoNameAndTierText(coId) ?? UndefinedError)
                : `P${dataForCoDialogue.getPlayerIndex()}`
            );

            {
                const nameArray = dataForCoDialogue?.getNameArray();
                const name1     = nameArray?.find(v => (v.getLanguageType()) === languageType1)?.getText() ?? `--`;
                const name2     = nameArray?.find(v => (v.getLanguageType()) === languageType2)?.getText() ?? `--`;
                this._labelCustomName.setText(`${name1}\n${name2}`);
            }
        }

        {
            const textArray = dataForCoDialogue ? dataForCoDialogue.getTextArray() : dataForAside?.getTextArray();
            this._label1.setText(getLanguageText({
                textArray   : textArray,
                useAlternate: false,
                languageType: languageType1,
            }) || "");
            this._label2.setText(getLanguageText({
                textArray   : textArray,
                useAlternate: false,
                languageType: languageType2,
            }) || "");
        }
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelError();
        this._updateLabelDialogueType();

        this._btnChangeType.setLangText(TextType.B0668);
        this._btnPosition.setLangText(TextType.B1181);
        this._btnPortrait.setLangText(TextType.B1442);
        this._btnCustomName.setLangText(TextType.B0156);
        this._btn1.setText(getLanguageTypeName(getCurrentLanguageType()) ?? UndefinedError);
        this._btn2.setText(getLanguageTypeName(getSecondaryLanguageType()) ?? UndefinedError);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = getErrorTipForWeaSimpleDialogueData(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
        const label     = this._labelError;
        if (errorTips) {
            label.setTextColor(ColorValue.Red);
            label.setText(errorTips);
        } else {
            label.setTextColor(ColorValue.White);
            label.setLangText(TextType.B0493);
        }
    }

    private _updateLabelDialogueType(): void {
        const data = this.getOpenData()?.dataForDialogue;
        if (data == null) {
            return;
        }

        const label = this._labelDialogueType;
        if (data.getDataForAside()) {
            label.setText(`${getText(TextType.B0669)}: ${getText(TextType.B0670)}`);
        } else if (data.getDataForCoDialogue()) {
            label.setText(`${getText(TextType.B0669)}: ${getText(TextType.B0671)}`);
        } else {
            label.setText(`${getText(TextType.B0669)}: ${getText(TextType.B0672)}`);
        }
    }
}
