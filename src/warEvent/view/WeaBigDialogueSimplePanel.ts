import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as DialoguesConstants from "../../dialogues/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimple from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForAside from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForAside.ts";
import * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForCoDialogue from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForCoDialogue.ts";
import * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForDialogue from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForDialogue.ts";
import * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForMisc from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc.ts";
import * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForMiscDataForPlayBgm from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc/DataForPlayBgm.ts";
import * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForMiscDataForPlaySfx from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple/DataForMisc/DataForPlaySfx.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as SoundsUtils from "../../sounds/Utils.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarEventsActionsUtilsBigDialogueSimple from "../../warEvents/actions/utils/BigDialogueSimple.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                 = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;
type IBwWar                         = BaseWarInterfaceIBwWar.IBwWar;

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
    private readonly _btnBackground!        : UiInterfacesIUiButton.IUiButton;

    private readonly _listDialogue!         : UiInterfacesIUiScrollList.IUiScrollList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnAddDialogue,     callback: this._onTouchedBtnAddDialogue },
            { ui: this._btnClear,           callback: this._onTouchedBtnClear },
            { ui: this._btnType,            callback: this._onTouchedBtnType },
            { ui: this._btnPlay,            callback: this._onTouchedBtnPlay },
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnBackground,      callback: this._onTouchedBtnBackground },
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
        this._updateBtnBackground();
        this._updateComponentsForDialogues();
    }

    private _onTouchedBtnAddDialogue(): void {
        const dialogueArray = this._getAction()?.getDataArray();
        if (dialogueArray == null) {
            return;
        }

        if (dialogueArray.length > DialoguesConstants.Common.MaxCount) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0228));
        } else {
            dialogueArray.push(getDefaultCoDialogueData());
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnClear(): void {
        const dataArray = this._getAction()?.getDataArray();
        if (dataArray == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                dataArray.length = 0;
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
        const war               = openData.war;
        const dialogueAction    = HelpersMisc.getExisted(action.getWeaBigDialogueSimple());
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        if (errorTip) {
            FloatText2.show(errorTip);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBigDialoguePanel, {
            war             : war,
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

    private _onTouchedBtnBackground(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeBigDialogueBackgroundPanel, {
            action      : this._getAction(),
            gameConfig  : gameConfig,
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);
    }

    private _updateBtnBackground(): void {
        const id = this._getAction()?.getBackgroundId();
        this._btnBackground.setIconSource(id == null ? `` : HelpersImageSource.getBigDialogueBackgroundImage(id));
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
        const maxCount  = DialoguesConstants.Common.MaxCount;
        const currCount = dataArray.length;
        label.setText(`${LangUtils.getText(LangConstants.TextType.B0675)}: ${currCount} / ${maxCount}`);
        label.setTextColor(((currCount <= maxCount) && (currCount > 0)) ? GraphicsConstants.ColorValue.White : GraphicsConstants.ColorValue.Red);
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaBigDialogueSimple.WeaBigDialogueSimple> {
        return this.getOpenData()?.action.getWeaBigDialogueSimple();
    }
}

interface DataForDialogueRenderer extends UiTypesUiListItemData.UiListItemData {
    war             : IBwWar;
    action          : WarEventAction;
    dataForDialogue : ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForDialogue.DataForDialogue;
}
class DialogueRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _labelError!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnChangeType!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnInsert!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUp!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelDialogueType!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDialogueContent!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPosition!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPosition!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCoDialogue!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPortrait!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPortrait!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCustomName!            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCustomName!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btn1!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete1!               : UiInterfacesIUiButton.IUiButton;
    private readonly _label1!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btn2!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete2!               : UiInterfacesIUiButton.IUiButton;
    private readonly _label2!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMisc!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupBgm!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBgm!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _btnBgm!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelBgm!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSfx!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSfx!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _btnSfx!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelSfx!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHideLeftPortrait!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgHideLeftPortrait!      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelHideLeftPortrait!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupHideRightPortrait!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgHideRightPortrait!     : UiInterfacesIUiImage.IUiImage;
    private readonly _labelHideRightPortrait!   : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnChangeType,              callback: this._onTouchedBtnChangeType },
            { ui: this._btnInsert,                  callback: this._onTouchedBtnInsert },
            { ui: this._btnUp,                      callback: this._onTouchedBtnUp },
            { ui: this._btnDelete,                  callback: this._onTouchedBtnDelete },

            { ui: this._btnPosition,                callback: this._onTouchedBtnPosition },
            { ui: this._btnPortrait,                callback: this._onTouchedBtnPortrait },
            { ui: this._btnCustomName,              callback: this._onTouchedBtnCustomName },
            { ui: this._btn1,                       callback: this._onTouchedBtn1 },
            { ui: this._btnDelete1,                 callback: this._onTouchedBtnDelete1 },
            { ui: this._btn2,                       callback: this._onTouchedBtn2 },
            { ui: this._btnDelete2,                 callback: this._onTouchedBtnDelete2 },

            { ui: this._groupBgm,                   callback: this._onTouchedGroupBgm },
            { ui: this._groupSfx,                   callback: this._onTouchedGroupSfx },
            { ui: this._btnBgm,                     callback: this._onTouchedBtnBgm },
            { ui: this._btnSfx,                     callback: this._onTouchedBtnSfx },
            { ui: this._groupHideLeftPortrait,      callback: this._onTouchedGroupHideLeftPortrait },
            { ui: this._groupHideRightPortrait,     callback: this._onTouchedGroupHideRightPortrait },
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
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForMisc(ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForMisc.DataForMisc.fromJson({
                }));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                return;
            }
        }

        {
            const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForMisc(null);
                dataForDialogue.setDataForAside(ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForAside.DataForAside.fromJson({
                    textArray: dataForCoDialogue.getTextArray().map(v => v.toJson()),
                }));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                return;
            }
        }

        {
            const dataForMisc = dataForDialogue.getDataForMisc();
            if (dataForMisc) {
                dataForDialogue.setDataForAside(null);
                dataForDialogue.setDataForMisc(null);
                dataForDialogue.setDataForCoDialogue(ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForCoDialogue.DataForCoDialogue.fromJson({
                    coId        : openData.war.getGcData().getCoIdArrayForDialogue()[0],
                    side        : DialoguesConstants.BigDialogueSideId.Left,
                    nameArray   : [],
                    textArray   : [],
                }));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                return;
            }
        }

        throw HelpersMisc.newError(`Invalid dataForDialogue.`, UtilsClientErrorCode.ClientErrorCode.WeActionModifyPanel3_OnTouchedBtnChangeType_00);
    }

    private _onTouchedBtnInsert(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dialogueArray = HelpersMisc.getExisted(openData.action.getWeaBigDialogueSimple()?.getDataArray());
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

        const dialogueArray = HelpersMisc.getExisted(openData.action.getWeaBigDialogueSimple()?.getDataArray());
        const index         = dialogueArray.indexOf(openData.dataForDialogue);
        if (index > 0) {
            [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    HelpersCollection.deleteElementFromList(HelpersMisc.getExisted(openData.action.getWeaBigDialogueSimple()?.getDataArray()), openData.dataForDialogue);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                },
            });
        }
    }

    private _onTouchedBtnPosition(): void {
        const openData = this.getOpenData()?.dataForDialogue.getDataForCoDialogue();
        if (openData == null) {
            return;
        }

        openData.setSide(openData.getSide() === DialoguesConstants.BigDialogueSideId.Left
            ? DialoguesConstants.BigDialogueSideId.Right
            : DialoguesConstants.BigDialogueSideId.Left
        );
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                    const currentCoId   = dataForCoDialogue.getCoId() ?? null;
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

        const languageType      = LangUtils.getCurrentLanguageType();
        const textArray         = HelpersMisc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const textData          = textArray.find(v => (v.getLanguageType() ?? 0) === languageType);
        const currentText       = textData?.getText();

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
                            languageType    : languageType,
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

        const languageType      = LangUtils.getCurrentLanguageType();
        const textArray         = HelpersMisc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const index             = textArray.findIndex(v => (v.getLanguageType() ?? 0) === languageType);
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

        const languageType      = LangUtils.getSecondaryLanguageType();
        const textArray         = HelpersMisc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const textData          = textArray.find(v => (v.getLanguageType() ?? 0) === languageType);
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
                            languageType    : languageType,
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

        const languageType  = LangUtils.getSecondaryLanguageType();
        const textArray     = HelpersMisc.getExisted(dataForDialogue.getDataForAside()?.getTextArray() || dataForDialogue.getDataForCoDialogue()?.getTextArray());
        const index         = textArray.findIndex(v => (v.getLanguageType() ?? 0) === languageType);
        const textData      = textArray[index];
        if (textData?.getText() != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent  : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback    : () => {
                    textArray.splice(index, 1);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            });
        }
    }

    private _onTouchedGroupBgm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const dataForMisc = openData.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        if (dataForMisc.getDataForPlayBgm()) {
            dataForMisc.setDataForPlayBgm(null);
        } else {
            dataForMisc.setDataForPlayBgm(ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForMiscDataForPlayBgm.DataForPlayBgm.fromJson({
                bgmCode : SoundsUtils.getAllBgmCodeArray()[0],
            }));
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsChooseSingleBgmPanel, {
            currentBgmCode      : dataForMisc.getDataForPlayBgm()?.getBgmCode() ?? 0,
            gameConfig          : openData.war.getGcData(),
            callbackOnConfirm   : bgmCode => {
                dataForMisc.createIfNotExistsDataForPlayBgm().setBgmCode(bgmCode);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedGroupSfx(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const dataForMisc = openData.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        if (dataForMisc.getDataForPlaySfx()) {
            dataForMisc.setDataForPlaySfx(null);
        } else {
            dataForMisc.setDataForPlaySfx(ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForMiscDataForPlaySfx.DataForPlaySfx.fromJson({
                sfxCode : SoundsUtils.getAllSfxCodeArray()[0],
            }));
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSfxPanel, {
            currentSfxCode  : dataForMisc.getDataForPlaySfx()?.getSfxCode() ?? 0,
            gameConfig      : openData.war.getGcData(),
            callback        : sfxCode => {
                dataForMisc.createIfNotExistsDataForPlaySfx().setSfxCode(sfxCode);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedGroupHideLeftPortrait(): void {
        const dataForMisc = this.getOpenData()?.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (dataForMisc.getHideLeftPortrait()) {
            dataForMisc.setHideLeftPortrait(null);
        } else {
            dataForMisc.setHideLeftPortrait(true);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedGroupHideRightPortrait(): void {
        const dataForMisc = this.getOpenData()?.dataForDialogue.getDataForMisc();
        if (dataForMisc == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (dataForMisc.getHideRightPortrait()) {
            dataForMisc.setHideRightPortrait(null);
        } else {
            dataForMisc.setHideRightPortrait(true);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                this._labelBgm.setText(LangUtils.getBgmSfxName(dataForPlayBgm?.getBgmCode() ?? 0, openData.war.getGcData()) ?? LangConstants.UndefinedError);
            }

            {
                const dataForPlaySfx    = dataForMisc.getDataForPlaySfx();
                this._imgSfx.setIsVisible(!!dataForPlaySfx);
                this._labelSfx.setText(LangUtils.getBgmSfxName(dataForPlaySfx?.getSfxCode() ?? 0, openData.war.getGcData()) ?? LangConstants.UndefinedError);
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
            this._labelPosition.setLangText(dataForCoDialogue.getSide() === DialoguesConstants.BigDialogueSideId.Left ? LangConstants.TextType.B1440 : LangConstants.TextType.B1441);

            const coId = dataForCoDialogue.getCoId();
            this._labelPortrait.setText(coId != null
                ? (openData.war.getGcData().getCoNameAndTierText(coId) ?? LangConstants.UndefinedError)
                : `P${dataForCoDialogue.getPlayerIndex()}`
            );
        }

        const languageType1 = LangUtils.getCurrentLanguageType();
        const languageType2 = LangUtils.getSecondaryLanguageType();

        {
            const nameArray = dataForCoDialogue?.getNameArray();
            const name1     = nameArray?.find(v => (v.getLanguageType() ?? 0) === languageType1)?.getText() ?? `--`;
            const name2     = nameArray?.find(v => (v.getLanguageType() ?? 0) === languageType2)?.getText() ?? `--`;
            this._labelCustomName.setText(`${name1}\n${name2}`);
        }

        {
            const textArray = dataForCoDialogue ? dataForCoDialogue.getTextArray() : dataForDialogue.getDataForAside()?.getTextArray();
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
        this._btnBgm.setLangText(LangConstants.TextType.B0631);
        this._btnSfx.setLangText(LangConstants.TextType.B1164);
        this._labelHideLeftPortrait.setLangText(LangConstants.TextType.B1162);
        this._labelHideRightPortrait.setLangText(LangConstants.TextType.B1163);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = WarEventsActionsUtilsBigDialogueSimple.getErrorTipForWeaDialogueData(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
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

function getDefaultCoDialogueData(): ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForDialogue.DataForDialogue {
    return ProtoSchemaCommonProtoWarEventWeaBigDialogueSimpleDataForDialogue.DataForDialogue.fromJson({
        dataForCoDialogue: {
            coId        : null,
            playerIndex : PlayersConstants.PlayerIndex.First,
            side        : DialoguesConstants.BigDialogueSideId.Left,
            nameArray   : [],
            textArray   : [
                { languageType: LangUtils.getCurrentLanguageType(), text: `...` },
            ],
        },
    });
}
