import {
    Graphics_Constants,
    Dialogues_Constants,
    Helpers_Collection,
    Notifications_Dispatcher,
    Helpers_ImageSource,
    GamePanels_Dict,
    Dialogues_Utils_MapSmallDialogue,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Players_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import { DataForAside } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForAside.ts";
import { DataForCoDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForDialogue.ts";

export interface OpenData {
    war: MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddDialogue!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteDialogue!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDialogueList!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listDialogueId!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDialogueIdRenderer>;
    private readonly _labelNoData!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDialogueData!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutError!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDialoguesCount!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClone!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPlay!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRename!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listDialogue!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnAddDialogue,             callback: this._onTouchedBtnAddDialogue },
            { ui: this._btnDeleteDialogue,          callback: this._onTouchedBtnDeleteDialogue },
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnDialogueList,            callback: this._onTouchedBtnDialogueList },
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._btnClone,                   callback: this._onTouchedBtnClone },
            { ui: this._btnPlay,                    callback: this._onTouchedBtnPlay },
            { ui: this._btnRename,                  callback: this._onTouchedBtnRename },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged,  callback: this._onNotifyMapSimpleDialogueChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listDialogueId.setItemRendererClass(DialogueIdRenderer);
        this._listDialogue.setItemRendererClass(DialogueRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listDialogue.removeAllItems(),
            this._listDialogueId.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedDialogueId(newDialogueId: number, needScroll: boolean): Promise<void> {
        const listDialogueId    = this._listDialogueId;
        const index             = listDialogueId.getRevisedFirstIndex(v => v?.dialogueId === newDialogueId);
        listDialogueId.setSelectedItemIndex(index);
        if (needScroll) {
            listDialogueId.scrollToItem(index);
        }

        await this._updateGroupDialogueDataAndLabelNoData();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onNotifyMapSimpleDialogueChanged(): Promise<void> {
        await this._resetListDialogueId(this._listDialogueId.getFirstSelectedData()?.dialogueId ?? null);
        await this._updateGroupDialogueDataAndLabelNoData();
    }

    private _onTouchedBtnAddDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueId = war.addDefaultMapSimpleDialogue();
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);

            this.setAndReviseSelectedDialogueId(dialogueId, true);
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0788),
        });
    }

    private _onTouchedBtnDialogueList(): void {
        const war = this.getOpenData()?.war;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeMapSimpleDialogueUtilPanel, {
            war: war,
        });
    }

    private _onTouchedBtnDeleteDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
        if (dialogueId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0168, `#${dialogueId}`),
            callback: () => {
                war.deleteMapSimpleDialogues([dialogueId]);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
            }
        });
    }
    private _onTouchedBtnClone(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
            if (dialogueId != null) {
                const newDialogueId = war.cloneMapSimpleDialogue(dialogueId);
                if (newDialogueId != null) {
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `#${newDialogueId}`));
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);

                    // this.setAndReviseSelectedDialogueId(dialogueId, true);
                }
            }
        }
    }
    private _onTouchedBtnPlay(): void {
        const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
        if (dialogueId == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dialogueData  = Helpers_Misc.getExisted(war.getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId));
        const errorTip      = Dialogues_Utils_MapSmallDialogue.getErrorTip(dialogueData, war.getPlayersCountUnneutral(), war.getGcData());
        if (errorTip) {
            FloatText.show(errorTip);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwMapSimpleDialoguePanel, {
            war             : war,
            dialogueData    : dialogueData,
            callbackOnClose : () => {
                // nothing to do
            },
        });
    }
    private _onTouchedBtnRename(): void {
        const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
        if (dialogueId == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dialogueData  = Helpers_Misc.getExisted(war.getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId));
        const nameArray     = dialogueData.getDialogueNameArray();
        if (war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowLangTextPanel, {
                textArray   : nameArray,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : nameArray,
                maxTextLength       : Dialogues_Constants.Common.DialogueNameMaxLength,
                getHelpText         : () => Lang_Utils.getText(Lang_Constants.TextType.A0789),
                callback            : newNameArray => {
                    dialogueData.setDialogueNameArray(newNameArray);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
                }
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._resetListDialogueId(this._listDialogueId.getFirstSelectedData()?.dialogueId ?? null);
        await this._updateGroupDialogueDataAndLabelNoData();
    }

    private _updateComponentsForLanguage(): void {
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelTitle.setLangText(Lang_Constants.TextType.B1095);
        this._btnRename.setLangText(Lang_Constants.TextType.B0162);
    }

    private async _resetListDialogueId(dialogueId: number | null): Promise<void> {
        const dataArray: DataForDialogueIdRenderer[] = [];
        for (const dialogue of this.getOpenData()?.war.getMapSimpleDialogueArray() ?? []) {
            dataArray.push({
                dialogueId  : dialogue.getDialogueId(),
                panel       : this,
            });
        }

        const list = this._listDialogueId;
        await list.bindData(dataArray.sort((v1, v2) => v1.dialogueId - v2.dialogueId));
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.dialogueId === dialogueId));
    }

    private async _updateGroupDialogueDataAndLabelNoData(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dialogueArray     = war.getMapSimpleDialogueArray();
        const labelNoData       = this._labelNoData;
        const groupDialogueData = this._groupDialogueData;
        if (!dialogueArray.length) {
            labelNoData.setIsVisible(true);
            groupDialogueData.setIsVisible(false);
            return;
        }

        labelNoData.setIsVisible(false);
        groupDialogueData.setIsVisible(true);

        const dialogueId            = this._listDialogueId.getFirstSelectedData()?.dialogueId;
        const dialogueData          = war.getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId);
        const labelDialoguesCount   = this._labelDialoguesCount;
        const labelError            = this._labelError;
        const listDialogue          = this._listDialogue;
        const layoutError           = this._layoutError;
        if (dialogueData == null) {
            labelDialoguesCount.setText(``);
            labelError.setText(``);
            layoutError.arrangeItems();
            await listDialogue.removeAllItems();

        } else {
            const dataArray: DataForDialogueRenderer[] = [];
            for (const data of dialogueData.getDataArray()) {
                dataArray.push({
                    war             : war,
                    dialogue        : dialogueData,
                    dataForDialogue : data,
                });
            }

            const errorTip = Dialogues_Utils_MapSmallDialogue.getErrorTip(dialogueData, war.getPlayersCountUnneutral(), war.getGcData());
            labelDialoguesCount.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1097)} #${dialogueData.getDialogueId()}, ${Lang_Utils.getText(Lang_Constants.TextType.B0675)}: ${dataArray.length} / ${Dialogues_Constants.Common.MaxCount}`);
            labelError.setText(errorTip ?? Lang_Utils.getText(Lang_Constants.TextType.A0790));
            labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
            layoutError.arrangeItems();
            await listDialogue.bindData(dataArray);
        }
    }
}

interface DataForDialogueIdRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dialogueId  : number;
    panel       : Panel;
}
class DialogueIdRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDialogueIdRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForDialogueIdRenderer>
{
    private readonly _labelId! : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._labelId.setText(`#${this.getOpenData()?.dialogueId}`);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedDialogueId(openData.dialogueId, false);
    }
}

interface DataForDialogueRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war             : MapEditor_Interface_IMeWar.IMeWar;
    dialogue        : MapSimpleDialogue;
    dataForDialogue : DataForDialogue;
}
class DialogueRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _layoutError!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDialogueId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnInsert!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUp!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnDialogueType!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelDialogueType!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnPosition!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPosition!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCoDialogue!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCo!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgCo!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnPlayerIndex!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPlayerIndex!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCoName!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnName!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelName!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnLine!              : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDialogueType,    callback: this._onTouchedBtnDialogueType },
            { ui: this._btnInsert,          callback: this._onTouchedBtnInsert },
            { ui: this._btnUp,              callback: this._onTouchedBtnUp },
            { ui: this._btnDelete,          callback: this._onTouchedBtnDelete },
            { ui: this._btnPosition,        callback: this._onTouchedBtnPosition },
            { ui: this._btnCo,              callback: this._onTouchedBtnCo },
            { ui: this._btnPlayerIndex,     callback: this._onTouchedBtnPlayerIndex },
            { ui: this._btnName,            callback: this._onTouchedBtnName },
            { ui: this._btnLine,            callback: this._onTouchedBtnLine },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnDialogueType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
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
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
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
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
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

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueArray = openData.dialogue.getDataArray();
            if (dialogueArray.length > Dialogues_Constants.Common.MaxCount) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0228));
            } else {
                const dataForDialogue = openData.dataForDialogue;
                dialogueArray.splice(dialogueArray.indexOf(dataForDialogue), 0, dataForDialogue.clone());
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
            }
        }
    }

    private _onTouchedBtnUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueArray = openData.dialogue.getDataArray();
            const index         = dialogueArray.indexOf(openData.dataForDialogue);
            if (index > 0) {
                [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
            }
        }
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dataArray = openData.dialogue.getDataArray();
            if ((dataArray == null) || (dataArray.length <= 1)) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                    callback: () => {
                        Helpers_Collection.deleteElementFromList(dataArray, openData.dataForDialogue);
                        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
                    },
                });
            }
        }
    }

    private _onTouchedBtnPosition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForDialogue   = openData.dataForDialogue;
            const dialogue          = dataForDialogue.getDataForCoDialogue() ?? dataForDialogue.getDataForAside();
            if (dialogue) {
                dialogue.setSide(dialogue.getSide() === Dialogues_Constants.SmallDialogueSideId.Bottom
                    ? Dialogues_Constants.SmallDialogueSideId.Top
                    : Dialogues_Constants.SmallDialogueSideId.Bottom
                );
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
            }
        }
    }

    private _onTouchedBtnCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForCoDialogue = openData.dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                const gameConfig    = war.getGcData();
                const currentCoId   = dataForCoDialogue.getCoId() ?? null;
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                    gameConfig          : gameConfig,
                    availableCoIdArray  : gameConfig.getCoIdArrayForDialogue(),
                    currentCoId         : currentCoId,
                    isBan               : false,
                    callbackOnConfirm   : newCoId => {
                        if (newCoId !== currentCoId) {
                            dataForCoDialogue.setCoId(newCoId);
                            if (newCoId != null) {
                                dataForCoDialogue.setPlayerIndex(null);
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
                        }
                    },
                });
            }
        }
    }

    private _onTouchedBtnPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForCoDialogue = openData.dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                const currentPlayerIndex = dataForCoDialogue.getPlayerIndex() ?? null;
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
                    currentSkinId           : currentPlayerIndex,
                    availableSkinIdArray    : Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1),
                    getHelpText             : () => Lang_Utils.getText(Lang_Constants.TextType.A0792),
                    callback                : newPlayerIndex => {
                        if (newPlayerIndex != currentPlayerIndex) {
                            dataForCoDialogue.setPlayerIndex(newPlayerIndex);
                            if (newPlayerIndex != null) {
                                dataForCoDialogue.setCoId(null);
                            }
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
                        }
                    },
                });
            }
        }
    }

    private _onTouchedBtnName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDialogue   = Helpers_Misc.getExisted(openData.dataForDialogue.getDataForCoDialogue());
        const currentTextArray  = dataForDialogue.getNameArray();
        if (openData.war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowLangTextPanel, {
                textArray   : currentTextArray,
            });

        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : currentTextArray,
                maxTextLength       : Dialogues_Constants.Common.MaxNameLength,
                allowEmpty          : true,
                getHelpText         : () => Lang_Utils.getText(Lang_Constants.TextType.A0791),
                callback            : newTextArray => {
                    if (newTextArray.length) {
                        dataForDialogue.setNameArray(newTextArray);
                    } else {
                        dataForDialogue.setNameArray([]);
                    }

                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
                },
            });
        }
    }

    private _onTouchedBtnLine(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDialogue   = openData.dataForDialogue;
        const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
        const dataForAside      = dataForDialogue.getDataForAside();
        const currentTextArray  = Helpers_Misc.getExisted(dataForCoDialogue?.getTextArray() ?? dataForAside?.getTextArray());
        if (openData.war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowLangTextPanel, {
                textArray   : currentTextArray,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputLanguageTextPanel, {
                currentTextArray    : currentTextArray,
                maxLength           : Dialogues_Constants.Common.MaxTextLength,
                isMultiline         : true,
                getTitle            : () => Lang_Utils.getText(Lang_Constants.TextType.B1259),
                callback            : newTextArray => {
                    if (dataForCoDialogue) {
                        dataForCoDialogue.setTextArray(newTextArray);
                    }
                    if (dataForAside) {
                        dataForAside.setTextArray(newTextArray);
                    }

                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);
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
        const groupCoDialogue   = this._groupCoDialogue;
        if (dataForCoDialogue == null) {
            groupCoDialogue.setIsVisible(false);
        } else {
            groupCoDialogue.setIsVisible(true);

            const coId = dataForCoDialogue.getCoId();
            this._imgCo.loadSource(coId == null ? `` : Helpers_ImageSource.getCoEye(openData.war.getGcData(), coId, true) ?? ``);

            const playerIndex = dataForCoDialogue.getPlayerIndex();
            this._labelPlayerIndex.setText(playerIndex == null ? `` : `P${playerIndex}`);
            this._labelName.setText(Lang_Utils.getJoinedShortLanguageText(dataForCoDialogue.getNameArray(), 10));
            this._groupCoName.arrangeItems();
        }

        const textArray = dataForCoDialogue ? dataForCoDialogue.getTextArray() : dataForAside?.getTextArray();
        this._btnLine.setText(Lang_Utils.getJoinedShortLanguageText(textArray, 100));
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelError();
        this._updateLabelDialogueType();
        this._updateLabelDialogueId();
        this._updateLabelPosition();

        this._btnDialogueType.setLangText(Lang_Constants.TextType.B0805);
        this._btnCo.setLangText(Lang_Constants.TextType.B0425);
        this._btnPlayerIndex.setLangText(Lang_Constants.TextType.B0168);
        this._btnName.setLangText(Lang_Constants.TextType.B0162);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = Dialogues_Utils_MapSmallDialogue.getErrorTipForDataForDialogue(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
        const label     = this._labelError;
        if (errorTips) {
            label.setTextColor(Graphics_Constants.ColorValue.Yellow);
            label.setText(errorTips);
        } else {
            label.setTextColor(Graphics_Constants.ColorValue.Green);
            label.setLangText(Lang_Constants.TextType.B0493);
        }
        this._layoutError.arrangeItems();
    }

    private _updateLabelDialogueType(): void {
        const openData = this.getOpenData()?.dataForDialogue;
        if (openData == null) {
            return;
        }

        const label = this._labelDialogueType;
        if (openData.getDataForAside()) {
            label.setLangText(Lang_Constants.TextType.B0670);
        } else if (openData.getDataForCoDialogue()) {
            label.setLangText(Lang_Constants.TextType.B0671);
        } else {
            label.setText(Lang_Constants.UndefinedError);
        }
    }

    private _updateLabelDialogueId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelDialogueId.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1259)} #${(openData.dialogue.getDataArray().indexOf(openData.dataForDialogue)) + 1}`);
        this._layoutError.arrangeItems();
    }

    private _updateLabelPosition(): void {
        const data = this.getOpenData()?.dataForDialogue;
        if (data == null) {
            return;
        }

        const side = data.getDataForAside()?.getSide() ?? data.getDataForCoDialogue()?.getSide();
        this._labelPosition.setText(side == null
            ? Lang_Constants.UndefinedError
            : (Lang_Utils.getMapSimpleDialogueSideName(side) ?? Lang_Constants.UndefinedError)
        );
    }
}
