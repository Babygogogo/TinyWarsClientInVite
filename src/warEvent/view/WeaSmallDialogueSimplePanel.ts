import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as DialoguesConstants from "../../dialogues/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimple from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForAside from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForAside.ts";
import * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForCoDialogue from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForCoDialogue.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForDialogue from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple/DataForDialogue.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsActionsUtilsSmallDialogueSimple from "../../warEvents/actions/utils/SmallDialogueSimple.ts";

type IBwWar                             = BaseWarInterfaceIBwWar.IBwWar;
type WarEventFullData                   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                     = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnType!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPlay!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddDialogue!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClear!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDialoguesCount!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listDialogue!         : UiInterfacesIUiScrollList.IUiScrollList<DataForDialogueRenderer>;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
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
        const dialogueArray = HelpersMisc.getExisted(this._getAction()?.getDataArray());
        if (dialogueArray.length > DialoguesConstants.Common.MaxCount) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0228));
        } else {
            dialogueArray.push(WarEventsActionsUtilsCommon.getDefaultSimpleCoDialogueData());
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnClear(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                HelpersMisc.getExisted(this._getAction()?.getDataArray()).length = 0;
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
        });
    }

    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
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
        const dialogueAction    = HelpersMisc.getExisted(action.getWeaSmallDialogueSimple());
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, openData.war);
        if (errorTip) {
            FloatText2.show(errorTip);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwSmallDialoguePanel, {
            war             : openData.war,
            actionData      : dialogueAction,
            callbackOnClose : () => {
                // nothing to do
            },
        });
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0118),
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);
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
        const maxCount  = DialoguesConstants.Common.MaxCount;
        const currCount = dataArray.length;
        label.setText(`${LangUtils.getText(LangConstants.TextType.B0675)}: ${currCount} / ${maxCount}`);
        label.setTextColor(((currCount <= maxCount) && (currCount > 0)) ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimple.WeaSmallDialogueSimple> {
        return this.getOpenData()?.action.getWeaSmallDialogueSimple();
    }
}

interface DataForDialogueRenderer extends UiTypesUiListItemData.UiListItemData {
    war             : IBwWar;
    action          : WarEventAction;
    dataForDialogue : ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForDialogue.DataForDialogue;
}
class DialogueRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _labelError!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnChangeType!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnInsert!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUp!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!            : UiInterfacesIUiButton.IUiButton;

    private readonly _labelDialogueType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPosition!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPosition!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCoDialogue!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPortrait!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPortrait!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCustomName!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCustomName!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btn1!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete1!           : UiInterfacesIUiButton.IUiButton;
    private readonly _label1!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btn2!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete2!           : UiInterfacesIUiButton.IUiButton;
    private readonly _label2!               : UiInterfacesIUiLabel.IUiLabel;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
                dataForDialogue.setDataForCoDialogue(ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForCoDialogue.DataForCoDialogue.fromJson({
                    coId        : openData.war.getGcData().getCoIdArrayForDialogue()[0],
                    side        : dataForAside.getSide(),
                    textArray   : dataForAside.getTextArray().map(v => v.toJson()),
                    nameArray   : [],
                }));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                return;
            }
        }

        {
            const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForAside(ProtoSchemaCommonProtoWarEventWeaSmallDialogueSimpleDataForAside.DataForAside.fromJson({
                    textArray   : dataForCoDialogue.getTextArray().map(v => v.toJson()),
                    side        : dataForCoDialogue.getSide(),
                }));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                return;
            }
        }

        throw HelpersMisc.newError(`Invalid dataForDialogue.`);
    }

    private _onTouchedBtnInsert(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = HelpersMisc.getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray());
        if (dialogueArray.length > DialoguesConstants.Common.MaxCount) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0228));
        } else {
            dialogueArray.splice(dialogueArray.indexOf(openData.dataForDialogue), 0, openData.dataForDialogue.clone());
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = HelpersMisc.getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray());
        const index         = dialogueArray.indexOf(openData.dataForDialogue);
        if (index > 0) {
            [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                HelpersCollection.deleteElementFromList(HelpersMisc.getExisted(openData.action.getWeaSmallDialogueSimple()?.getDataArray()), openData.dataForDialogue);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnPosition(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const data = dataForDialogue.getDataForCoDialogue() ?? dataForDialogue.getDataForAside();
        if (data) {
            data.setSide(data.getSide() === DialoguesConstants.SmallDialogueSideId.Bottom
                ? DialoguesConstants.SmallDialogueSideId.Top
                : DialoguesConstants.SmallDialogueSideId.Bottom
            );
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1442),
            availableNumberArray    : [0].concat(HelpersCollection.createRange(1, openData.war.getPlayersCountUnneutral() + 1, 1)),
            currentNumber           : dataForCoDialogue.getPlayerIndex() ?? 0,
            getNumberMainText       : num => {
                if (num === 0) {
                    return LangUtils.getText(LangConstants.TextType.B0145);
                } else {
                    return `P${num}`;
                }
            },
            callbackOnConfirm       : num => {
                if (num !== 0) {
                    dataForCoDialogue.setCoId(null);
                    dataForCoDialogue.setPlayerIndex(num);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                } else {
                    const currentCoId   = dataForCoDialogue.getCoId();
                    const gameConfig    = openData.war.getGcData();
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                        gameConfig          : gameConfig,
                        availableCoIdArray  : gameConfig.getCoIdArrayForDialogue(),
                        currentCoId         : currentCoId,
                        isBan               : false,
                        callbackOnConfirm   : newCoId => {
                            if (newCoId !== currentCoId) {
                                dataForCoDialogue.setPlayerIndex(null);
                                dataForCoDialogue.setCoId(newCoId);
                                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                            }
                        },
                    });
                }
            }
        });
    }

    private _onTouchedBtnCustomName(): void {
        const dataForDialogue = HelpersMisc.getExisted(this.getOpenData()?.dataForDialogue.getDataForCoDialogue());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : dataForDialogue.getNameArray(),
            allowEmpty          : true,
            maxTextLength       : DialoguesConstants.Common.MaxNameLength,
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0156),
            getHelpText         : () => LangUtils.getFormattedText(LangConstants.TextType.F0020, DialoguesConstants.Common.MaxNameLength),
            callback            : newNameArray => {
                const revisedArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[] = [];
                for (const name of newNameArray) {
                    if (name.getText()) {
                        revisedArray.push(name);
                    }
                }
                dataForDialogue.setNameArray(revisedArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtn1(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType1 = LangUtils.getCurrentLanguageType();
        const textArray     = HelpersMisc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const textData      = textArray.find(v => (v.getLanguageType() ?? 0) === languageType1);
        const currentText   = textData?.getText();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0455),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : DialoguesConstants.Common.MaxTextLength,
            tips            : LangUtils.getFormattedText(LangConstants.TextType.F0020, DialoguesConstants.Common.MaxTextLength),
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

    private _onTouchedBtnDelete1(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType1     = LangUtils.getCurrentLanguageType();
        const textArray         = HelpersMisc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const index             = textArray.findIndex(v => (v.getLanguageType() ?? 0) === languageType1);
        const textData          = textArray[index];
        if (textData?.getText() != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback    : () => {
                    textArray.splice(index, 1);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onTouchedBtn2(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType2     = LangUtils.getSecondaryLanguageType();
        const textArray         = HelpersMisc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const textData          = textArray.find(v => (v.getLanguageType() ?? 0) === languageType2);
        const currentText       = textData?.getText();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0456),
            currentValue    : currentText || ``,
            charRestrict    : null,
            maxChars        : DialoguesConstants.Common.MaxTextLength,
            tips            : LangUtils.getFormattedText(LangConstants.TextType.F0020, DialoguesConstants.Common.MaxTextLength),
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
                            languageType    : languageType2,
                            text            : text,
                        }));
                    }
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnDelete2(): void {
        const dataForDialogue = this.getOpenData()?.dataForDialogue;
        if (dataForDialogue == null) {
            return;
        }

        const languageType2     = LangUtils.getSecondaryLanguageType();
        const textArray         = HelpersMisc.getExisted(dataForDialogue.getDataForCoDialogue()?.getTextArray() ?? dataForDialogue.getDataForAside()?.getTextArray());
        const index             = textArray.findIndex(v => v.getLanguageType() === languageType2);
        const textData          = textArray[index];
        if (textData?.getText() != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback    : () => {
                    textArray.splice(index, 1);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        const languageType1     = LangUtils.getCurrentLanguageType();
        const languageType2     = LangUtils.getSecondaryLanguageType();
        const groupCoDialogue   = this._groupCoDialogue;
        const labelPosition     = this._labelPosition;

        if (dataForAside) {
            groupCoDialogue.setIsVisible(false);
            labelPosition.setLangText(dataForAside.getSide() === DialoguesConstants.SmallDialogueSideId.Bottom ? LangConstants.TextType.B1261 : LangConstants.TextType.B1260);

        } else if (dataForCoDialogue) {
            groupCoDialogue.setIsVisible(true);
            labelPosition.setLangText(dataForCoDialogue.getSide() === DialoguesConstants.SmallDialogueSideId.Bottom ? LangConstants.TextType.B1261 : LangConstants.TextType.B1260);

            const coId = dataForCoDialogue.getCoId();
            this._labelPortrait.setText(coId != null
                ? (openData.war.getGcData().getCoNameAndTierText(coId) ?? LangConstants.UndefinedError)
                : `P${dataForCoDialogue.getPlayerIndex()}`
            );

            {
                const nameArray = dataForCoDialogue?.getNameArray();
                const name1     = nameArray?.find(v => (v.getLanguageType() ?? 0) === languageType1)?.getText() ?? `--`;
                const name2     = nameArray?.find(v => (v.getLanguageType() ?? 0) === languageType2)?.getText() ?? `--`;
                this._labelCustomName.setText(`${name1}\n${name2}`);
            }
        }

        {
            const textArray = dataForCoDialogue ? dataForCoDialogue.getTextArray() : dataForAside?.getTextArray();
            this._label1.setText(LangUtils.getLanguageText({
                textArray   : textArray,
                useAlternate: false,
                languageType: languageType1,
            }) || "");
            this._label2.setText(LangUtils.getLanguageText({
                textArray   : textArray,
                useAlternate: false,
                languageType: languageType2,
            }) || "");
        }
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelError();
        this._updateLabelDialogueType();

        this._btnChangeType.setLangText(LangConstants.TextType.B0668);
        this._btnPosition.setLangText(LangConstants.TextType.B1181);
        this._btnPortrait.setLangText(LangConstants.TextType.B1442);
        this._btnCustomName.setLangText(LangConstants.TextType.B0156);
        this._btn1.setText(LangUtils.getLanguageTypeName(LangUtils.getCurrentLanguageType()) ?? LangConstants.UndefinedError);
        this._btn2.setText(LangUtils.getLanguageTypeName(LangUtils.getSecondaryLanguageType()) ?? LangConstants.UndefinedError);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = WarEventsActionsUtilsSmallDialogueSimple.getErrorTipForWeaSimpleDialogueData(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
        const label     = this._labelError;
        if (errorTips) {
            label.setTextColor(GraphicsConstants.ColorValue.Red);
            label.setText(errorTips);
        } else {
            label.setTextColor(GraphicsConstants.ColorValue.White);
            label.setLangText(LangConstants.TextType.B0493);
        }
    }

    private _updateLabelDialogueType(): void {
        const data = this.getOpenData()?.dataForDialogue;
        if (data == null) {
            return;
        }

        const label = this._labelDialogueType;
        if (data.getDataForAside()) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0669)}: ${LangUtils.getText(LangConstants.TextType.B0670)}`);
        } else if (data.getDataForCoDialogue()) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0669)}: ${LangUtils.getText(LangConstants.TextType.B0671)}`);
        } else {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0669)}: ${LangUtils.getText(LangConstants.TextType.B0672)}`);
        }
    }
}
