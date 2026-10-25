import { Common, SmallDialogueSideId } from "../../dialogues/Constants.ts";
import { getErrorTip, getErrorTipForDataForDialogue } from "../../dialogues/utils/MapSmallDialogue.ts";
import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { deleteElementFromList, createRange } from "../../helpers/Collection.ts";
import { getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getJoinedShortLanguageText, getMapSimpleDialogueSideName } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import { DataForAside } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForAside.ts";
import { DataForCoDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForCoDialogue.ts";
import type { DataForDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue/DataForDialogue.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war: IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _btnClose!                 : IUiButton;
    private readonly _btnAddDialogue!           : IUiButton;
    private readonly _btnDeleteDialogue!        : IUiButton;
    private readonly _btnDialogueList!          : IUiButton;
    private readonly _btnHelp!                  : IUiButton;
    private readonly _labelTitle!               : IUiLabel;

    private readonly _listDialogueId!           : IUiScrollList<DataForDialogueIdRenderer>;
    private readonly _labelNoData!              : IUiLabel;

    private readonly _groupDialogueData!        : IUiContainer;
    private readonly _layoutError!              : IUiLayout;
    private readonly _labelDialoguesCount!      : IUiLabel;
    private readonly _labelError!               : IUiLabel;
    private readonly _btnClone!                 : IUiButton;
    private readonly _btnPlay!                  : IUiButton;
    private readonly _btnRename!                : IUiButton;
    private readonly _listDialogue!             : IUiScrollList<DataForDialogueRenderer>;

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
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeMapSimpleDialogueChanged,  callback: this._onNotifyMapSimpleDialogueChanged },
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
        const index             = getExisted(listDialogueId.getRevisedFirstIndex(v => v?.dialogueId === newDialogueId));
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueId = war.addDefaultMapSimpleDialogue();
            dispatch(TypeId.MeMapSimpleDialogueChanged);

            this.setAndReviseSelectedDialogueId(dialogueId, true);
        }
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0788),
        });
    }

    private _onTouchedBtnDialogueList(): void {
        const war = this.getOpenData()?.war;
        openPanel(getDict().MeMapSimpleDialogueUtilPanel, {
            war: war,
        });
    }

    private _onTouchedBtnDeleteDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
        if (dialogueId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getFormattedText(TextType.F0168, `#${dialogueId}`),
            callback: () => {
                war.deleteMapSimpleDialogues([dialogueId]);
                dispatch(TypeId.MeMapSimpleDialogueChanged);
            }
        });
    }
    private _onTouchedBtnClone(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueId = this._listDialogueId.getFirstSelectedData()?.dialogueId;
            if (dialogueId != null) {
                const newDialogueId = war.cloneMapSimpleDialogue(dialogueId);
                if (newDialogueId != null) {
                    show(getFormattedText(TextType.F0084, `#${newDialogueId}`));
                    dispatch(TypeId.MeMapSimpleDialogueChanged);

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

        const dialogueData  = getExisted(war.getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId));
        const errorTip      = getErrorTip(dialogueData, war.getPlayersCountUnneutral(), war.getGcData());
        if (errorTip) {
            show(errorTip);
            return;
        }

        openPanel(getDict().BwMapSimpleDialoguePanel, {
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

        const dialogueData  = getExisted(war.getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId));
        const nameArray     = dialogueData.getDialogueNameArray();
        if (war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowLangTextPanel, {
                textArray   : nameArray,
            });
        } else {
            openPanel(getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : nameArray,
                maxTextLength       : Common.DialogueNameMaxLength,
                getHelpText         : () => getText(TextType.A0789),
                callback            : newNameArray => {
                    dialogueData.setDialogueNameArray(newNameArray);
                    dispatch(TypeId.MeMapSimpleDialogueChanged);
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
        this._labelNoData.setText(getText(TextType.B0278));
        this._labelTitle.setText(getText(TextType.B1095));
        this._btnRename.setText(getText(TextType.B0162));
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

            const errorTip = getErrorTip(dialogueData, war.getPlayersCountUnneutral(), war.getGcData());
            labelDialoguesCount.setText(`${getText(TextType.B1097)} #${dialogueData.getDialogueId() ?? 0}, ${getText(TextType.B0675)}: ${dataArray.length} / ${Common.MaxCount}`);
            labelError.setText(errorTip ?? getText(TextType.A0790));
            labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
            layoutError.arrangeItems();
            await listDialogue.bindData(dataArray);
        }
    }
}

interface DataForDialogueIdRenderer extends UiListItemData {
    dialogueId  : number;
    panel       : Panel;
}
class DialogueIdRenderer
    extends     UiListItemRenderer<DataForDialogueIdRenderer>
    implements  IUiListItemRenderer<DataForDialogueIdRenderer>
{
    private readonly _labelId! : IUiLabel;

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

interface DataForDialogueRenderer extends UiListItemData {
    war             : IMeWar;
    dialogue        : MapSimpleDialogue;
    dataForDialogue : DataForDialogue;
}
class DialogueRenderer extends UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _layoutError!          : IUiLayout;
    private readonly _labelDialogueId!      : IUiLabel;
    private readonly _labelError!           : IUiLabel;
    private readonly _btnInsert!            : IUiButton;
    private readonly _btnUp!                : IUiButton;
    private readonly _btnDelete!            : IUiButton;

    private readonly _btnDialogueType!      : IUiButton;
    private readonly _labelDialogueType!    : IUiLabel;

    private readonly _btnPosition!          : IUiContainer;
    private readonly _labelPosition!        : IUiLabel;

    private readonly _groupCoDialogue!      : IUiContainer;
    private readonly _btnCo!                : IUiButton;
    private readonly _imgCo!                : IUiImage;
    private readonly _btnPlayerIndex!       : IUiButton;
    private readonly _labelPlayerIndex!     : IUiLabel;

    private readonly _groupCoName!          : IUiLayout;
    private readonly _btnName!              : IUiButton;
    private readonly _labelName!            : IUiLabel;

    private readonly _btnLine!              : IUiButton;

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
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            showLang(TextType.YouCanNotDoThisRightNow);
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
                dispatch(TypeId.MeMapSimpleDialogueChanged);
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
                dispatch(TypeId.MeMapSimpleDialogueChanged);
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

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueArray = getExisted(openData.dialogue.getDataArray());
            if (dialogueArray.length > Common.MaxCount) {
                show(getText(TextType.A0228));
            } else {
                const dataForDialogue = openData.dataForDialogue;
                dialogueArray.splice(dialogueArray.indexOf(dataForDialogue), 0, dataForDialogue.clone());
                dispatch(TypeId.MeMapSimpleDialogueChanged);
            }
        }
    }

    private _onTouchedBtnUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dialogueArray = getExisted(openData.dialogue.getDataArray());
            const index         = dialogueArray.indexOf(openData.dataForDialogue);
            if (index > 0) {
                [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
                dispatch(TypeId.MeMapSimpleDialogueChanged);
            }
        }
    }

    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dataArray = openData.dialogue.getDataArray();
            if ((dataArray == null) || (dataArray.length <= 1)) {
                showLang(TextType.YouCanNotDoThisRightNow);
            } else {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent : () => getText(TextType.AreYouSureYouWantToContinue),
                    callback: () => {
                        deleteElementFromList(dataArray, openData.dataForDialogue);
                        dispatch(TypeId.MeMapSimpleDialogueChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForDialogue   = openData.dataForDialogue;
            const dialogue          = dataForDialogue.getDataForCoDialogue() ?? dataForDialogue.getDataForAside();
            if (dialogue) {
                dialogue.setSide(dialogue.getSide() === SmallDialogueSideId.Bottom
                    ? SmallDialogueSideId.Top
                    : SmallDialogueSideId.Bottom
                );
                dispatch(TypeId.MeMapSimpleDialogueChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForCoDialogue = openData.dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                const gameConfig    = war.getGcData();
                const currentCoId   = dataForCoDialogue.getCoId() ?? null;
                openPanel(getDict().CommonChooseSingleCoIdPanel, {
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
                            dispatch(TypeId.MeMapSimpleDialogueChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const dataForCoDialogue = openData.dataForDialogue.getDataForCoDialogue();
            if (dataForCoDialogue) {
                const currentPlayerIndex = dataForCoDialogue.getPlayerIndex() ?? null;
                openPanel(getDict().CommonChooseSingleSkinIdPanel, {
                    currentSkinId           : currentPlayerIndex,
                    availableSkinIdArray    : createRange(PlayerIndex.First, war.getPlayersCountUnneutral() + 1, 1),
                    getHelpText             : () => getText(TextType.A0792),
                    callback                : newPlayerIndex => {
                        if (newPlayerIndex != currentPlayerIndex) {
                            dataForCoDialogue.setPlayerIndex(newPlayerIndex);
                            if (newPlayerIndex != null) {
                                dataForCoDialogue.setCoId(null);
                            }
                            dispatch(TypeId.MeMapSimpleDialogueChanged);
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

        const dataForDialogue   = getExisted(openData.dataForDialogue.getDataForCoDialogue());
        const currentTextArray  = dataForDialogue.getNameArray();
        if (openData.war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowLangTextPanel, {
                textArray   : currentTextArray ?? [],
            });

        } else {
            openPanel(getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : currentTextArray ?? [],
                maxTextLength       : Common.MaxNameLength,
                allowEmpty          : true,
                getHelpText         : () => getText(TextType.A0791),
                callback            : newTextArray => {
                    if (newTextArray.length) {
                        dataForDialogue.setNameArray(newTextArray);
                    } else {
                        dataForDialogue.setNameArray([]);
                    }

                    dispatch(TypeId.MeMapSimpleDialogueChanged);
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
        const currentTextArray  = getExisted(dataForCoDialogue?.getTextArray() ?? dataForAside?.getTextArray());
        if (openData.war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowLangTextPanel, {
                textArray   : currentTextArray,
            });
        } else {
            openPanel(getDict().CommonInputLanguageTextPanel, {
                currentTextArray    : currentTextArray,
                maxLength           : Common.MaxTextLength,
                isMultiline         : true,
                getTitle            : () => getText(TextType.B1259),
                callback            : newTextArray => {
                    if (dataForCoDialogue) {
                        dataForCoDialogue.setTextArray(newTextArray);
                    }
                    if (dataForAside) {
                        dataForAside.setTextArray(newTextArray);
                    }

                    dispatch(TypeId.MeMapSimpleDialogueChanged);
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
            this._imgCo.loadSource(coId == null ? `` : getCoEye(openData.war.getGcData(), coId, true) ?? ``);

            const playerIndex = dataForCoDialogue.getPlayerIndex();
            this._labelPlayerIndex.setText(playerIndex == null ? `` : `P${playerIndex}`);
            this._labelName.setText(getJoinedShortLanguageText(dataForCoDialogue.getNameArray(), 10));
            this._groupCoName.arrangeItems();
        }

        const textArray = dataForCoDialogue ? dataForCoDialogue.getTextArray() : dataForAside?.getTextArray();
        this._btnLine.setText(getJoinedShortLanguageText(textArray, 100));
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelError();
        this._updateLabelDialogueType();
        this._updateLabelDialogueId();
        this._updateLabelPosition();

        this._btnDialogueType.setLangText(TextType.B0805);
        this._btnCo.setLangText(TextType.B0425);
        this._btnPlayerIndex.setLangText(TextType.B0168);
        this._btnName.setLangText(TextType.B0162);
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const errorTips = getErrorTipForDataForDialogue(openData.dataForDialogue, war.getPlayersCountUnneutral(), war.getGcData());
        const label     = this._labelError;
        if (errorTips) {
            label.setTextColor(ColorValue.Yellow);
            label.setText(errorTips);
        } else {
            label.setTextColor(ColorValue.Green);
            label.setText(getText(TextType.B0493));
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
            label.setText(getText(TextType.B0670));
        } else if (openData.getDataForCoDialogue()) {
            label.setText(getText(TextType.B0671));
        } else {
            label.setText(UndefinedError);
        }
    }

    private _updateLabelDialogueId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelDialogueId.setText(`${getText(TextType.B1259)} #${(openData.dialogue.getDataArray().indexOf(openData.dataForDialogue) ?? -1) + 1}`);
        this._layoutError.arrangeItems();
    }

    private _updateLabelPosition(): void {
        const data = this.getOpenData()?.dataForDialogue;
        if (data == null) {
            return;
        }

        const side = data.getDataForAside()?.getSide() ?? data.getDataForCoDialogue()?.getSide();
        this._labelPosition.setText(side == null
            ? UndefinedError
            : (getMapSimpleDialogueSideName(side) ?? UndefinedError)
        );
    }
}
