import {
    Dialogues_Constants,
    Utils_ClientErrorCode,
    Graphics_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    Sounds_Utils,
    Lang_Utils,
    Helpers_ImageSource,
    GamePanels_Dict,
    WarEvents_Actions_Utils_Common,
    WarEvents_Actions_Utils_BigDialogueSimple,
    Helpers_Misc,
    GamePanels_Manager,
    Players_Constants,
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
import type { WeaBigDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import { DataForAside } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForAside.ts";
import { DataForCoDialogue } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForCoDialogue.ts";
import { DataForDialogue } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForDialogue.ts";
import { DataForMisc } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc.ts";
import { DataForPlayBgm } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc/DataForPlayBgm.ts";
import { DataForPlaySfx } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc/DataForPlaySfx.ts";

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
    private readonly _btnBackground!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listDialogue!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnAddDialogue,     callback : this._onTouchedBtnAddDialogue },
            { ui : this._btnClear,           callback : this._onTouchedBtnClear },
            { ui : this._btnType,            callback : this._onTouchedBtnType },
            { ui : this._btnPlay,            callback : this._onTouchedBtnPlay },
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
            { ui : this._btnBackground,      callback : this._onTouchedBtnBackground },
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
        this._updateBtnBackground();
        this._updateComponentsForDialogues();
    }

    private _onTouchedBtnAddDialogue(): void {
        const dialogueArray = this._getAction()?.getDataArray();
        if (dialogueArray == null) {
            return;
        }

        if (dialogueArray.length > Dialogues_Constants.Common.MaxCount) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0228));
        } else {
            dialogueArray.push(getDefaultCoDialogueData());
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }

    private _onTouchedBtnClear(): void {
        const dataArray = this._getAction()?.getDataArray();
        if (dataArray == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                dataArray.length = 0;
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
        const war               = openData.war;
        const dialogueAction    = Helpers_Misc.getExisted(action.getWeaBigDialogueSimple());
        const errorTip          = WarEvents_Actions_Utils_Common.getErrorTipForAction(openData.fullData, action, war);
        if (errorTip) {
            FloatText.show(errorTip);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBigDialoguePanel, {
            war             : war,
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

    private _onTouchedBtnBackground(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeBigDialogueBackgroundPanel, {
            action     : this._getAction(),
            gameConfig : gameConfig,
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnBackground();
        this._updateComponentsForDialogues();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
    }

    private _updateBtnBackground(): void {
        const id = this._getAction()?.getBackgroundId();
        this._btnBackground.setIconSource(id == null ? `` : Helpers_ImageSource.getBigDialogueBackgroundImage(id));
    }

    private async _updateComponentsForDialogues(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action    = openData.action;
        const war       = openData.war;
        const dataArray : DataForDialogueRenderer[] = [];
        for (const dataForAddUnit of action.getWeaBigDialogueSimple()?.getDataArray() ?? []) {
            dataArray.push({
                war             : war,
                action          : action,
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

    private _getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaBigDialogueSimple> {
        return this.getOpenData()?.action.getWeaBigDialogueSimple();
    }
}

interface DataForDialogueRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    action          : WarEventAction;
    dataForDialogue : DataForDialogue;
}
class DialogueRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _labelError!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnChangeType!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnInsert!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUp!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelDialogueType!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDialogueContent!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPosition!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPosition!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCoDialogue!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPortrait!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPortrait!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCustomName!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCustomName!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btn1!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete1!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label1!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btn2!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete2!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label2!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMisc!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupBgm!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBgm!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnBgm!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelBgm!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSfx!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSfx!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnSfx!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelSfx!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHideLeftPortrait!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgHideLeftPortrait!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelHideLeftPortrait!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupHideRightPortrait!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgHideRightPortrait!     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelHideRightPortrait!   : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnChangeType,              callback : this._onTouchedBtnChangeType },
            { ui : this._btnInsert,                  callback : this._onTouchedBtnInsert },
            { ui : this._btnUp,                      callback : this._onTouchedBtnUp },
            { ui : this._btnDelete,                  callback : this._onTouchedBtnDelete },

            { ui : this._btnPosition,                callback : this._onTouchedBtnPosition },
            { ui : this._btnPortrait,                callback : this._onTouchedBtnPortrait },
            { ui : this._btnCustomName,              callback : this._onTouchedBtnCustomName },
            { ui : this._btn1,                       callback : this._onTouchedBtn1 },
            { ui : this._btnDelete1,                 callback : this._onTouchedBtnDelete1 },
            { ui : this._btn2,                       callback : this._onTouchedBtn2 },
            { ui : this._btnDelete2,                 callback : this._onTouchedBtnDelete2 },

            { ui : this._groupBgm,                   callback : this._onTouchedGroupBgm },
            { ui : this._groupSfx,                   callback : this._onTouchedGroupSfx },
            { ui : this._btnBgm,                     callback : this._onTouchedBtnBgm },
            { ui : this._btnSfx,                     callback : this._onTouchedBtnSfx },
            { ui : this._groupHideLeftPortrait,      callback : this._onTouchedGroupHideLeftPortrait },
            { ui : this._groupHideRightPortrait,     callback : this._onTouchedGroupHideRightPortrait },
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
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForMisc(DataForMisc.fromJson({
                }));
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                return;
            }
        }

        {
            const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForMisc(null);
                dataForDialogue.setDataForAside(DataForAside.fromJson({
                    textArray : dataForCoDialogue.getTextArray().map(v => v.toJson()),
                }));
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                return;
            }
        }

        {
            const dataForMisc = dataForDialogue.getDataForMisc();
            if (dataForMisc) {
                dataForDialogue.setDataForAside(null);
                dataForDialogue.setDataForMisc(null);
                dataForDialogue.setDataForCoDialogue(DataForCoDialogue.fromJson({
                    coId      : openData.war.getGcData().getCoIdArrayForDialogue()[0],
                    side      : Dialogues_Constants.BigDialogueSideId.Left,
                    nameArray : [],
                    textArray : [],
                }));
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                return;
            }
        }

        throw Helpers_Misc.newError(`Invalid dataForDialogue.`, Utils_ClientErrorCode.ClientErrorCode.WeActionModifyPanel3_OnTouchedBtnChangeType_00);
    }

    private _onTouchedBtnInsert(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = Helpers_Misc.getExisted(openData.action.getWeaBigDialogueSimple()?.getDataArray());
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

        const dialogueArray = Helpers_Misc.getExisted(openData.action.getWeaBigDialogueSimple()?.getDataArray());
        const index         = dialogueArray.indexOf(openData.dataForDialogue);
        if (index > 0) {
            [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                callback   : () => {
                    Helpers_Collection.deleteElementFromList(Helpers_Misc.getExisted(openData.action.getWeaBigDialogueSimple()?.getDataArray()), openData.dataForDialogue);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            });
        }
    }

    private _onTouchedBtnPosition(): void {
        const openData = this.getOpenData()?.dataForDialogue.getDataForCoDialogue();
        if (openData == null) {
            return;
        }

        openData.setSide(openData.getSide() === Dialogues_Constants.BigDialogueSideId.Left
            ? Dialogues_Constants.BigDialogueSideId.Right
            : Dialogues_Constants.BigDialogueSideId.Left,
        );
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
                    const currentCoId   = dataForCoDialogue.getCoId() ?? null;
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

        const languageType      = Lang_Utils.getCurrentLanguageType();
        const textArray         = Helpers_Misc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const textData          = textArray.find(v => (v.getLanguageType()) === languageType);
        const currentText       = textData?.getText();

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
                            languageType : languageType,
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

        const languageType      = Lang_Utils.getCurrentLanguageType();
        const textArray         = Helpers_Misc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const index             = textArray.findIndex(v => (v.getLanguageType()) === languageType);
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

        const languageType      = Lang_Utils.getSecondaryLanguageType();
        const textArray         = Helpers_Misc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const textData          = textArray.find(v => (v.getLanguageType()) === languageType);
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
                            languageType : languageType,
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

        const languageType  = Lang_Utils.getSecondaryLanguageType();
        const textArray     = Helpers_Misc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const index         = textArray.findIndex(v => (v.getLanguageType()) === languageType);
        const textData      = textArray[index];
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

    private _onTouchedGroupBgm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const dataForMisc = openData.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        if (dataForMisc.getDataForPlayBgm()) {
            dataForMisc.setDataForPlayBgm(null);
        } else {
            dataForMisc.setDataForPlayBgm(DataForPlayBgm.fromJson({
                bgmCode : Sounds_Utils.getAllBgmCodeArray()[0],
            }));
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnBgm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForMisc = openData.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsChooseSingleBgmPanel, {
            currentBgmCode    : dataForMisc.getDataForPlayBgm()?.getBgmCode() ?? 0,
            gameConfig        : openData.war.getGcData(),
            callbackOnConfirm : bgmCode => {
                dataForMisc.createIfNotExistsDataForPlayBgm().setBgmCode(bgmCode);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedGroupSfx(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const dataForMisc = openData.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        if (dataForMisc.getDataForPlaySfx()) {
            dataForMisc.setDataForPlaySfx(null);
        } else {
            dataForMisc.setDataForPlaySfx(DataForPlaySfx.fromJson({
                sfxCode : Sounds_Utils.getAllSfxCodeArray()[0],
            }));
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnSfx(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForMisc = openData.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSfxPanel, {
            currentSfxCode : dataForMisc.getDataForPlaySfx()?.getSfxCode() ?? 0,
            gameConfig     : openData.war.getGcData(),
            callback       : sfxCode => {
                dataForMisc.createIfNotExistsDataForPlaySfx().setSfxCode(sfxCode);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedGroupHideLeftPortrait(): void {
        const dataForMisc = this.getOpenData()?.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (dataForMisc.getHideLeftPortrait()) {
            dataForMisc.setHideLeftPortrait(null);
        } else {
            dataForMisc.setHideLeftPortrait(true);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedGroupHideRightPortrait(): void {
        const dataForMisc = this.getOpenData()?.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (dataForMisc.getHideRightPortrait()) {
            dataForMisc.setHideRightPortrait(null);
        } else {
            dataForMisc.setHideRightPortrait(true);
        }
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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

        const dataForDialogue       = openData.dataForDialogue;
        const dataForMisc           = dataForDialogue.getDataForMisc();
        const groupMisc             = this._groupMisc;
        const groupDialogueContent  = this._groupDialogueContent;
        if (dataForMisc) {
            groupMisc.setIsVisible(true);
            groupDialogueContent.setIsVisible(false);

            {
                const dataForPlayBgm    = dataForMisc.getDataForPlayBgm();
                this._imgBgm.setIsVisible(!!dataForPlayBgm);
                this._labelBgm.setText(Lang_Utils.getBgmSfxName(dataForPlayBgm?.getBgmCode() ?? 0, openData.war.getGcData()) ?? Lang_Constants.UndefinedError);
            }

            {
                const dataForPlaySfx    = dataForMisc.getDataForPlaySfx();
                this._imgSfx.setIsVisible(!!dataForPlaySfx);
                this._labelSfx.setText(Lang_Utils.getBgmSfxName(dataForPlaySfx?.getSfxCode() ?? 0, openData.war.getGcData()) ?? Lang_Constants.UndefinedError);
            }

            {
                this._imgHideLeftPortrait.setIsVisible(!!dataForMisc.getHideLeftPortrait());
                this._imgHideRightPortrait.setIsVisible(!!dataForMisc.getHideRightPortrait());
            }

            return;
        }

        groupMisc.setIsVisible(false);
        groupDialogueContent.setIsVisible(true);

        const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
        const groupCoDialogue   = this._groupCoDialogue;
        if (dataForCoDialogue == null) {
            groupCoDialogue.setIsVisible(false);
        } else {
            groupCoDialogue.setIsVisible(true);
            this._labelPosition.setLangText(dataForCoDialogue.getSide() === Dialogues_Constants.BigDialogueSideId.Left ? Lang_Constants.TextType.B1440 : Lang_Constants.TextType.B1441);

            const coId = dataForCoDialogue.getCoId();
            this._labelPortrait.setText(coId != null
                ? (openData.war.getGcData().getCoNameAndTierText(coId) ?? Lang_Constants.UndefinedError)
                : `P${dataForCoDialogue.getPlayerIndex()}`,
            );
        }

        const languageType1 = Lang_Utils.getCurrentLanguageType();
        const languageType2 = Lang_Utils.getSecondaryLanguageType();

        {
            const nameArray = dataForCoDialogue?.getNameArray();
            const name1     = nameArray?.find(v => (v.getLanguageType()) === languageType1)?.getText() ?? `--`;
            const name2     = nameArray?.find(v => (v.getLanguageType()) === languageType2)?.getText() ?? `--`;
            this._labelCustomName.setText(`${name1}\n${name2}`);
        }

        {
            const textArray = dataForCoDialogue ? dataForCoDialogue.getTextArray() : dataForDialogue.getDataForAside()?.getTextArray();
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
        this._btnBgm.setLangText(Lang_Constants.TextType.B0631);
        this._btnSfx.setLangText(Lang_Constants.TextType.B1164);
        this._labelHideLeftPortrait.setLangText(Lang_Constants.TextType.B1162);
        this._labelHideRightPortrait.setLangText(Lang_Constants.TextType.B1163);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = WarEvents_Actions_Utils_BigDialogueSimple.getErrorTipForWeaDialogueData(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
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

function getDefaultCoDialogueData(): DataForDialogue {
    return DataForDialogue.fromJson({
        dataForCoDialogue : {
            coId        : null,
            playerIndex : Players_Constants.PlayerIndex.First,
            side        : Dialogues_Constants.BigDialogueSideId.Left,
            nameArray   : [],
            textArray   : [
                { languageType : Lang_Utils.getCurrentLanguageType(), text : `...` },
            ],
        },
    });
}
