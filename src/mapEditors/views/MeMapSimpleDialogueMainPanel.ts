import * as DialoguesConstants from "../../dialogues/Constants.ts";
import * as DialoguesUtilsMapSmallDialogue from "../../dialogues/utils/MapSmallDialogue.ts";
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
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import * as ProtoSchemaCommonProtoMapMapSimpleDialogueDataForAside from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForAside.ts";
import * as ProtoSchemaCommonProtoMapMapSimpleDialogueDataForCoDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForCoDialogue.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogueDataForDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForDialogue.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war: MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddDialogue!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteDialogue!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDialogueList!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listDialogueId!           : UiInterfacesIUiScrollList.IUiScrollList<DataForDialogueIdRenderer>;
    private readonly _labelNoData!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDialogueData!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutError!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDialoguesCount!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClone!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPlay!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRename!                : UiInterfacesIUiButton.IUiButton;
    private readonly _listDialogue!             : UiInterfacesIUiScrollList.IUiScrollList<DataForDialogueRenderer>;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged,  callback: this._onNotifyMapSimpleDialogueChanged },
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
        const index             = HelpersMisc.getExisted(listDialogueId.getRevisedFirstIndex(v => v?.dialogueId === newDialogueId));
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueId = war.addDefaultMapSimpleDialogue();
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);

            this.setAndReviseSelectedDialogueId(dialogueId, true);
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0788),
        });
    }

    private _onTouchedBtnDialogueList(): void {
        const war = this.getOpenData()?.war;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeMapSimpleDialogueUtilPanel, {
            war: war,
        });
    }

    private _onTouchedBtnDeleteDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
        if (dialogueId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0168, `#${dialogueId}`),
            callback: () => {
                war.deleteMapSimpleDialogues([dialogueId]);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
            }
        });
    }
    private _onTouchedBtnClone(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
            if (dialogueId != null) {
                const newDialogueId = war.cloneMapSimpleDialogue(dialogueId);
                if (newDialogueId != null) {
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `#${newDialogueId}`));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);

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

        const dialogueData  = HelpersMisc.getExisted(war.getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId));
        const errorTip      = DialoguesUtilsMapSmallDialogue.getErrorTip(dialogueData, war.getPlayersCountUnneutral(), war.getGcData());
        if (errorTip) {
            FloatText2.show(errorTip);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwMapSimpleDialoguePanel, {
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

        const dialogueData  = HelpersMisc.getExisted(war.getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId));
        const nameArray     = dialogueData.getDialogueNameArray();
        if (war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowLangTextPanel, {
                textArray   : nameArray,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : nameArray,
                maxTextLength       : DialoguesConstants.Common.DialogueNameMaxLength,
                getHelpText         : () => LangUtils.getText(LangConstants.TextType.A0789),
                callback            : newNameArray => {
                    dialogueData.setDialogueNameArray(newNameArray);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1095));
        this._btnRename.setText(LangUtils.getText(LangConstants.TextType.B0162));
    }

    private async _resetListDialogueId(dialogueId: number | null): Promise<void> {
        const dataArray: DataForDialogueIdRenderer[] = [];
        for (const dialogue of this.getOpenData()?.war.getMapSimpleDialogueArray() ?? []) {
            dataArray.push({
                dialogueId  : dialogue.getDialogueId() ?? 0,
                panel       : this,
            });
        }

        const list = this._listDialogueId;
        await list.bindData(dataArray.sort((v1, v2) => v1.dialogueId - v2.dialogueId));
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.dialogueId === dialogueId) ?? (dataArray.length ? 0 : -1));
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

            const errorTip = DialoguesUtilsMapSmallDialogue.getErrorTip(dialogueData, war.getPlayersCountUnneutral(), war.getGcData());
            labelDialoguesCount.setText(`${LangUtils.getText(LangConstants.TextType.B1097)} #${dialogueData.getDialogueId() ?? 0}, ${LangUtils.getText(LangConstants.TextType.B0675)}: ${dataArray.length} / ${DialoguesConstants.Common.MaxCount}`);
            labelError.setText(errorTip ?? LangUtils.getText(LangConstants.TextType.A0790));
            labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
            layoutError.arrangeItems();
            await listDialogue.bindData(dataArray);
        }
    }
}

interface DataForDialogueIdRenderer extends UiTypesUiListItemData.UiListItemData {
    dialogueId  : number;
    panel       : Panel;
}
class DialogueIdRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDialogueIdRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForDialogueIdRenderer>
{
    private readonly _labelId! : UiInterfacesIUiLabel.IUiLabel;

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

interface DataForDialogueRenderer extends UiTypesUiListItemData.UiListItemData {
    war             : MapEditorInterfaceIMeWar.IMeWar;
    dialogue        : ProtoSchemaCommonProtoMapMapSimpleDialogue.MapSimpleDialogue;
    dataForDialogue : ProtoSchemaCommonProtoMapMapSimpleDialogueDataForDialogue.DataForDialogue;
}
class DialogueRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _layoutError!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDialogueId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnInsert!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUp!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!            : UiInterfacesIUiButton.IUiButton;

    private readonly _btnDialogueType!      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelDialogueType!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnPosition!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPosition!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCoDialogue!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCo!                : UiInterfacesIUiButton.IUiButton;
    private readonly _imgCo!                : UiInterfacesIUiImage.IUiImage;
    private readonly _btnPlayerIndex!       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPlayerIndex!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCoName!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnName!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelName!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnLine!              : UiInterfacesIUiButton.IUiButton;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const dataForDialogue = openData.dataForDialogue;

        {
            const dataForAside = dataForDialogue.getDataForAside();
            if (dataForAside) {
                dataForDialogue.setDataForAside(null);
                dataForDialogue.setDataForCoDialogue(ProtoSchemaCommonProtoMapMapSimpleDialogueDataForCoDialogue.DataForCoDialogue.fromJson({
                    coId        : openData.war.getGcData().getCoIdArrayForDialogue()[0],
                    side        : dataForAside.getSide(),
                    textArray   : dataForAside.getTextArray().map(v => v.toJson()),
                    nameArray   : [],
                }));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
                return;
            }
        }

        {
            const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                dataForDialogue.setDataForCoDialogue(null);
                dataForDialogue.setDataForAside(ProtoSchemaCommonProtoMapMapSimpleDialogueDataForAside.DataForAside.fromJson({
                    textArray   : dataForCoDialogue.getTextArray().map(v => v.toJson()),
                    side        : dataForCoDialogue.getSide(),
                }));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueArray = HelpersMisc.getExisted(openData.dialogue.getDataArray());
            if (dialogueArray.length > DialoguesConstants.Common.MaxCount) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0228));
            } else {
                const dataForDialogue = openData.dataForDialogue;
                dialogueArray.splice(dialogueArray.indexOf(dataForDialogue), 0, dataForDialogue.clone());
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
            }
        }
    }

    private _onTouchedBtnUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueArray = HelpersMisc.getExisted(openData.dialogue.getDataArray());
            const index         = dialogueArray.indexOf(openData.dataForDialogue);
            if (index > 0) {
                [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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
            const dataArray = openData.dialogue.getDataArray();
            if ((dataArray == null) || (dataArray.length <= 1)) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                    callback: () => {
                        HelpersCollection.deleteElementFromList(dataArray, openData.dataForDialogue);
                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForDialogue   = openData.dataForDialogue;
            const dialogue          = dataForDialogue.getDataForCoDialogue() ?? dataForDialogue.getDataForAside();
            if (dialogue) {
                dialogue.setSide(dialogue.getSide() === DialoguesConstants.SmallDialogueSideId.Bottom
                    ? DialoguesConstants.SmallDialogueSideId.Top
                    : DialoguesConstants.SmallDialogueSideId.Bottom
                );
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForCoDialogue = openData.dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                const gameConfig    = war.getGcData();
                const currentCoId   = dataForCoDialogue.getCoId() ?? null;
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
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
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForCoDialogue = openData.dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                const currentPlayerIndex = dataForCoDialogue.getPlayerIndex() ?? null;
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
                    currentSkinId           : currentPlayerIndex,
                    availableSkinIdArray    : HelpersCollection.createRange(PlayersConstants.PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1),
                    getHelpText             : () => LangUtils.getText(LangConstants.TextType.A0792),
                    callback                : newPlayerIndex => {
                        if (newPlayerIndex != currentPlayerIndex) {
                            dataForCoDialogue.setPlayerIndex(newPlayerIndex);
                            if (newPlayerIndex != null) {
                                dataForCoDialogue.setCoId(null);
                            }
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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

        const dataForDialogue   = HelpersMisc.getExisted(openData.dataForDialogue.getDataForCoDialogue());
        const currentTextArray  = dataForDialogue.getNameArray();
        if (openData.war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowLangTextPanel, {
                textArray   : currentTextArray ?? [],
            });

        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : currentTextArray ?? [],
                maxTextLength       : DialoguesConstants.Common.MaxNameLength,
                allowEmpty          : true,
                getHelpText         : () => LangUtils.getText(LangConstants.TextType.A0791),
                callback            : newTextArray => {
                    if (newTextArray.length) {
                        dataForDialogue.setNameArray(newTextArray);
                    } else {
                        dataForDialogue.setNameArray([]);
                    }

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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
        const currentTextArray  = HelpersMisc.getExisted(dataForCoDialogue?.getTextArray() ?? dataForAside?.getTextArray());
        if (openData.war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowLangTextPanel, {
                textArray   : currentTextArray,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputLanguageTextPanel, {
                currentTextArray    : currentTextArray,
                maxLength           : DialoguesConstants.Common.MaxTextLength,
                isMultiline         : true,
                getTitle            : () => LangUtils.getText(LangConstants.TextType.B1259),
                callback            : newTextArray => {
                    if (dataForCoDialogue) {
                        dataForCoDialogue.setTextArray(newTextArray);
                    }
                    if (dataForAside) {
                        dataForAside.setTextArray(newTextArray);
                    }

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);
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
            this._imgCo.loadSource(coId == null ? `` : HelpersImageSource.getCoEye(openData.war.getGcData(), coId, true) ?? ``);

            const playerIndex = dataForCoDialogue.getPlayerIndex();
            this._labelPlayerIndex.setText(playerIndex == null ? `` : `P${playerIndex}`);
            this._labelName.setText(LangUtils.getJoinedShortLanguageText(dataForCoDialogue.getNameArray(), 10));
            this._groupCoName.arrangeItems();
        }

        const textArray = dataForCoDialogue ? dataForCoDialogue.getTextArray() : dataForAside?.getTextArray();
        this._btnLine.setText(LangUtils.getJoinedShortLanguageText(textArray, 100));
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelError();
        this._updateLabelDialogueType();
        this._updateLabelDialogueId();
        this._updateLabelPosition();

        this._btnDialogueType.setLangText(LangConstants.TextType.B0805);
        this._btnCo.setLangText(LangConstants.TextType.B0425);
        this._btnPlayerIndex.setLangText(LangConstants.TextType.B0168);
        this._btnName.setLangText(LangConstants.TextType.B0162);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = DialoguesUtilsMapSmallDialogue.getErrorTipForDataForDialogue(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
        const label     = this._labelError;
        if (errorTips) {
            label.setTextColor(GraphicsConstants.ColorValue.Yellow);
            label.setText(errorTips);
        } else {
            label.setTextColor(GraphicsConstants.ColorValue.Green);
            label.setText(LangUtils.getText(LangConstants.TextType.B0493));
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
            label.setText(LangUtils.getText(LangConstants.TextType.B0670));
        } else if (openData.getDataForCoDialogue()) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0671));
        } else {
            label.setText(LangConstants.UndefinedError);
        }
    }

    private _updateLabelDialogueId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelDialogueId.setText(`${LangUtils.getText(LangConstants.TextType.B1259)} #${(openData.dialogue.getDataArray().indexOf(openData.dataForDialogue) ?? -1) + 1}`);
        this._layoutError.arrangeItems();
    }

    private _updateLabelPosition(): void {
        const data = this.getOpenData()?.dataForDialogue;
        if (data == null) {
            return;
        }

        const side = data.getDataForAside()?.getSide() ?? data.getDataForCoDialogue()?.getSide();
        this._labelPosition.setText(side == null
            ? LangConstants.UndefinedError
            : (LangUtils.getMapSimpleDialogueSideName(side) ?? LangConstants.UndefinedError)
        );
    }
}
