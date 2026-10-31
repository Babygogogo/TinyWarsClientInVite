import {
    Graphics_Constants,
    Dialogues_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    Lang_Utils,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    WarEvents_Actions_Utils_SmallDialogueSimple,
    Helpers_Misc,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSmallDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import { DataForAside } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForAside.ts";
import { DataForCoDialogue } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForDialogue.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnType!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPlay!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddDialogue!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClear!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDialoguesCount!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listDialogue!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnAddDialogue,     callback : this._onTouchedBtnAddDialogue },
            { ui : this._btnClear,           callback : this._onTouchedBtnClear },
            { ui : this._btnType,            callback : this._onTouchedBtnType },
            { ui : this._btnPlay,            callback : this._onTouchedBtnPlay },
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",            callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",    callback : this._onNotifyWarEventFullDataChanged },
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
        const dialogueArray = Helpers_Misc.getExisted(this._getAction()?.getDataArray());
        if (dialogueArray.length > Dialogues_Constants.Common.MaxCount) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0228));
        } else {
            dialogueArray.push(WarEvents_Actions_Utils_Common.getDefaultSimpleCoDialogueData());
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }

    private _onTouchedBtnClear(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                Helpers_Misc.getExisted(this._getAction()?.getDataArray()).length = 0;
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionTypeListPanel, {
            war      : openData.war,
            fullData : openData.fullData,
            action   : openData.action,
        });
    }

    private _onTouchedBtnPlay(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const dialogueAction    = Helpers_Misc.getExisted(action.getWeaSmallDialogueSimple());
        const errorTip          = WarEvents_Actions_Utils_Common.getErrorTipForAction(openData.fullData, action, openData.war);
        if (errorTip) {
            FloatText.show(errorTip);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwSmallDialoguePanel, {
            war             : openData.war,
            actionData      : dialogueAction,
            callbackOnClose : () => {
                // nothing to do
            },
        });
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0118),
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
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
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
                dataForDialogue : dataForAddUnit,
            });
        }

        await this._listDialogue.bindData(dataArray);

        const label     = this._labelDialoguesCount;
        const maxCount  = Dialogues_Constants.Common.MaxCount;
        const currCount = dataArray.length;
        label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0675)}: ${currCount} / ${maxCount}`);
        label.setTextColor(((currCount <= maxCount) && (currCount > 0)) ? Graphics_Constants.ColorValue.White : Graphics_Constants.ColorValue.Red);
    }

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSmallDialogueSimple> {
        return this.getOpenData()?.action.getWeaSmallDialogueSimple();
    }
}

interface DataForDialogueRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    action          : WarEventAction;
    dataForDialogue : DataForDialogue;
}
class DialogueRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _labelError!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnChangeType!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnInsert!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUp!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelDialogueType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPosition!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPosition!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCoDialogue!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPortrait!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPortrait!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCustomName!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCustomName!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btn1!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete1!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label1!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btn2!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete2!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label2!               : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnChangeType,      callback : this._onTouchedBtnChangeType },
            { ui : this._btnInsert,          callback : this._onTouchedBtnInsert },
            { ui : this._btnUp,              callback : this._onTouchedBtnUp },
            { ui : this._btnDelete,          callback : this._onTouchedBtnDelete },

            { ui : this._btnPosition,        callback : this._onTouchedBtnPosition },
            { ui : this._btnPortrait,        callback : this._onTouchedBtnPortrait },
            { ui : this._btnCustomName,      callback : this._onTouchedBtnCustomName },
            { ui : this._btn1,               callback : this._onTouchedBtn1 },
            { ui : this._btnDelete1,         callback : this._onTouchedBtnDelete1 },
            { ui : this._btn2,               callback : this._onTouchedBtn2 },
            { ui : this._btnDelete2,         callback : this._onTouchedBtnDelete2 },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
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
                    coId      : openData.war.getGcData().getCoIdArrayForDialogue()[0],
                    side      : dataForAside.getSide(),
                    textArray : dataForAside.getTextArray().map(v => v.toJson()),
                    nameArray : [],
                }));
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                return;
            }
        }

        {
            const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForAside(DataForAside.fromJson({
                    textArray : dataForCoDialogue.getTextArray().map(v => v.toJson()),
                    side      : dataForCoDialogue.getSide(),
                }));
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                return;
            }
        }

        throw Helpers_Misc.newError(`Invalid dataForDialogue.`);
    }

    private _onTouchedBtnInsert(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = Helpers_Misc.getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray());
        if (dialogueArray.length > Dialogues_Constants.Common.MaxCount) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0228));
        } else {
            dialogueArray.splice(dialogueArray.indexOf(openData.dataForDialogue), 0, openData.dataForDialogue.clone());
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }

    private _onTouchedBtnUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = Helpers_Misc.getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray());
        const index         = dialogueArray.indexOf(openData.dataForDialogue);
        if (index > 0) {
            [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                Helpers_Collection.deleteElementFromList(Helpers_Misc.getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray()), openData.dataForDialogue);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnPosition(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const data = dataForDialogue.getDataForCoDialogue() ?? dataForDialogue.getDataForAside();
        if (data) {
            data.setSide(data.getSide() === Dialogues_Constants.SmallDialogueSideId.Bottom
                ? Dialogues_Constants.SmallDialogueSideId.Top
                : Dialogues_Constants.SmallDialogueSideId.Bottom,
            );
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1442),
            availableNumberArray : [0].concat(Helpers_Collection.createRange(1, openData.war.getPlayersCountUnneutral() + 1, 1)),
            currentNumber        : dataForCoDialogue.getPlayerIndex() ?? 0,
            getNumberMainText    : num => {
                if (num === 0) {
                    return Lang_Utils.getText(Lang_Constants.TextType.B0145);
                } else {
                    return `P${num}`;
                }
            },
            callbackOnConfirm : num => {
                if (num !== 0) {
                    dataForCoDialogue.setCoId(null);
                    dataForCoDialogue.setPlayerIndex(num);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                } else {
                    const currentCoId   = dataForCoDialogue.getCoId();
                    const gameConfig    = openData.war.getGcData();
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig         : gameConfig,
                        availableCoIdArray : gameConfig.getCoIdArrayForDialogue(),
                        currentCoId        : currentCoId,
                        isBan              : false,
                        callbackOnConfirm  : newCoId => {
                            if (newCoId !== currentCoId) {
                                dataForCoDialogue.setPlayerIndex(null);
                                dataForCoDialogue.setCoId(newCoId);
                                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                            }
                        },
                    });
                }
            },
        });
    }

    private _onTouchedBtnCustomName(): void {
        const dataForDialogue = Helpers_Misc.getExisted(this.getOpenData()?.dataForDialogue.getDataForCoDialogue());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : dataForDialogue.getNameArray(),
            allowEmpty       : true,
            maxTextLength    : Dialogues_Constants.Common.MaxNameLength,
            getTitleText     : () => Lang_Utils.getText(Lang_Constants.TextType.B0156),
            getHelpText      : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0020, Dialogues_Constants.Common.MaxNameLength),
            callback         : newNameArray => {
                const revisedArray: LanguageText[] = [];
                for (const name of newNameArray) {
                    if (name.getText()) {
                        revisedArray.push(name);
                    }
                }
                dataForDialogue.setNameArray(revisedArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtn1(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType1 = Lang_Utils.getCurrentLanguageType();
        const textArray     = Helpers_Misc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const textData      = textArray.find(v => (v.getLanguageType()) === languageType1);
        const currentText   = textData?.getText();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0455),
            currentValue : currentText || ``,
            charRestrict : null,
            maxChars     : Dialogues_Constants.Common.MaxTextLength,
            tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0020, Dialogues_Constants.Common.MaxTextLength),
            canBeEmpty   : true,
            isMultiLine  : true,
            callback     : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    Helpers_Collection.deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(LanguageText.fromJson({
                            languageType : languageType1,
                            text         : text,
                        }));
                    }
                }
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnDelete1(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType1     = Lang_Utils.getCurrentLanguageType();
        const textArray         = Helpers_Misc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const index             = textArray.findIndex(v => (v.getLanguageType()) === languageType1);
        const textData          = textArray[index];
        if (textData?.getText() != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                callback   : () => {
                    textArray.splice(index, 1);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            });
        }
    }

    private _onTouchedBtn2(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType2     = Lang_Utils.getSecondaryLanguageType();
        const textArray         = Helpers_Misc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const textData          = textArray.find(v => (v.getLanguageType()) === languageType2);
        const currentText       = textData?.getText();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0456),
            currentValue : currentText || ``,
            charRestrict : null,
            maxChars     : Dialogues_Constants.Common.MaxTextLength,
            tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0020, Dialogues_Constants.Common.MaxTextLength),
            canBeEmpty   : true,
            isMultiLine  : true,
            callback     : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    Helpers_Collection.deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(LanguageText.fromJson({
                            languageType : languageType2,
                            text         : text,
                        }));
                    }
                }
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnDelete2(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType2     = Lang_Utils.getSecondaryLanguageType();
        const textArray         = Helpers_Misc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const index             = textArray.findIndex(v => v.getLanguageType() === languageType2);
        const textData          = textArray[index];
        if (textData?.getText() != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                callback   : () => {
                    textArray.splice(index, 1);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
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
        const languageType1     = Lang_Utils.getCurrentLanguageType();
        const languageType2     = Lang_Utils.getSecondaryLanguageType();
        const groupCoDialogue   = this._groupCoDialogue;
        const labelPosition     = this._labelPosition;

        if (dataForAside) {
            groupCoDialogue.setIsVisible(false);
            labelPosition.setLangText(dataForAside.getSide() === Dialogues_Constants.SmallDialogueSideId.Bottom ? Lang_Constants.TextType.B1261 : Lang_Constants.TextType.B1260);

        } else if (dataForCoDialogue) {
            groupCoDialogue.setIsVisible(true);
            labelPosition.setLangText(dataForCoDialogue.getSide() === Dialogues_Constants.SmallDialogueSideId.Bottom ? Lang_Constants.TextType.B1261 : Lang_Constants.TextType.B1260);

            const coId = dataForCoDialogue.getCoId();
            this._labelPortrait.setText(coId != null
                ? (openData.war.getGcData().getCoNameAndTierText(coId) ?? Lang_Constants.UndefinedError)
                : `P${dataForCoDialogue.getPlayerIndex()}`,
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
            this._label1.setText(Lang_Utils.getLanguageText({
                textArray    : textArray,
                useAlternate : false,
                languageType : languageType1,
            }) || "");
            this._label2.setText(Lang_Utils.getLanguageText({
                textArray    : textArray,
                useAlternate : false,
                languageType : languageType2,
            }) || "");
        }
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelError();
        this._updateLabelDialogueType();

        this._btnChangeType.setLangText(Lang_Constants.TextType.B0668);
        this._btnPosition.setLangText(Lang_Constants.TextType.B1181);
        this._btnPortrait.setLangText(Lang_Constants.TextType.B1442);
        this._btnCustomName.setLangText(Lang_Constants.TextType.B0156);
        this._btn1.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getCurrentLanguageType()) ?? Lang_Constants.UndefinedError);
        this._btn2.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getSecondaryLanguageType()) ?? Lang_Constants.UndefinedError);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = WarEvents_Actions_Utils_SmallDialogueSimple.getErrorTipForWeaSimpleDialogueData(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
        const label     = this._labelError;
        if (errorTips) {
            label.setTextColor(Graphics_Constants.ColorValue.Red);
            label.setText(errorTips);
        } else {
            label.setTextColor(Graphics_Constants.ColorValue.White);
            label.setLangText(Lang_Constants.TextType.B0493);
        }
    }

    private _updateLabelDialogueType(): void {
        const data = this.getOpenData()?.dataForDialogue;
        if (data == null) {
            return;
        }

        const label = this._labelDialogueType;
        if (data.getDataForAside()) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0669)}: ${Lang_Utils.getText(Lang_Constants.TextType.B0670)}`);
        } else if (data.getDataForCoDialogue()) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0669)}: ${Lang_Utils.getText(Lang_Constants.TextType.B0671)}`);
        } else {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0669)}: ${Lang_Utils.getText(Lang_Constants.TextType.B0672)}`);
        }
    }
}
