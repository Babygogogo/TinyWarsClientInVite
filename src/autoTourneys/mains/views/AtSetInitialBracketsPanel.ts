import { showLang } from "../../../FloatText.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../../helpers/Collection.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import { Common as MultiRankedWarConstants } from "../../../multiRankedWars/Constants.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import { InitialBracket } from "../../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/InitialBracket.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import { wait } from "../../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../../ui/types/UiListItemData.ts";
import { checkHasUserPublicInfo, getUserMrwRankScoreInfo, getUserNickname } from "../../../users/Model.ts";
import { reqUserGetPublicInfoArray } from "../../../users/Proxy.ts";
import { WarTypeId } from "../../../warTypes/Constants.ts";
import { reqAtSetInitialBrackets } from "../Gateway.ts";
import { getAtFullBracketInfo } from "../Provider.ts";

type Slot = {
    bracketGameId   : number;
    userSlotIndex   : number;
};

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;
    private readonly _btnHelp!      : IUiButton;
    private readonly _btnSort!      : IUiButton;

    private readonly _btnConfirm!   : IUiButton;
    private readonly _btnCancel!    : IUiButton;

    private readonly _listBracket!  : IUiScrollList<DataForBracketRenderer>;

    private _selectedSlot               : Slot | null = null;
    private _dataArrayForListBracket    : DataForBracketRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : TypeId.MsgAtSetInitialBrackets,     callback : this._onNotifyMsgAtSetInitialBrackets },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
            { ui : this._btnSort,            callback : this._onTouchedBtnSort },

            { ui : this._btnCancel,          callback : this.closePanel },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listBracket.setItemRendererClass(BracketRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._dataArrayForListBracket = await this._createDataArrayForListBracket();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listBracket.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectedSlot(bracketGameId: number, userSlotIndex: number): void {
        if (this._selectedSlot == null) {
            this._selectedSlot = {
                bracketGameId : bracketGameId,
                userSlotIndex : userSlotIndex,
            };
            return;
        }

        const selectedSlot          = this._selectedSlot;
        const selectedBracketGameId = selectedSlot.bracketGameId;
        const selectedUserSlotIndex = selectedSlot.userSlotIndex;
        if ((selectedBracketGameId === bracketGameId) && (selectedUserSlotIndex === userSlotIndex)) {
            this._selectedSlot = null;
            return;
        }

        const dataArray                     = this._dataArrayForListBracket;
        const index1                        = dataArray.findIndex(v => v.bracketGameId === selectedBracketGameId);
        const index2                        = dataArray.findIndex(v => v.bracketGameId === bracketGameId);
        const data1                         = dataArray[index1];
        const data2                         = dataArray[index2];
        const userIdArray1                  = data1.userIdArray;
        const userIdArray2                  = data2.userIdArray;
        const userId1                       = userIdArray1[selectedUserSlotIndex] ?? null;
        const userId2                       = userIdArray2[userSlotIndex] ?? null;
        userIdArray1[selectedUserSlotIndex] = userId2;
        userIdArray2[userSlotIndex]         = userId1;
        this._selectedSlot                  = null;

        const listBracket = this._listBracket;
        listBracket.updateSingleData(index1, data1);
        listBracket.updateSingleData(index2, data2);
    }
    public getSelectedSlot(): Slot | null {
        return this._selectedSlot;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0408),
        });
    }

    private _onTouchedBtnSort(): void {
        const dataArray = this._dataArrayForListBracket;
        if (!dataArray.length) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => getText(TextType.B0567),
            availableNumberArray : [0, 1, 2, 3],
            currentNumber        : null,
            getNumberMainText    : num => {
                switch (num) {
                    case 0  : return getText(TextType.B0198);
                    case 1  : return getText(TextType.B0199);
                    case 2  : return getText(TextType.B1445);
                    case 3  : return getText(TextType.B1207);
                    default : return UndefinedError;
                }
            },
            callbackOnConfirm : async num => {
                const userIdAndScoreArray: { userId: number, score: number }[] = [];
                {
                    const promiseArray: Promise<void>[] = [];
                    for (const userId of dataArray.flatMap(v => v.userIdArray)) {
                        if (userId == null) {
                            continue;
                        }

                        if (num === 0) {
                            promiseArray.push((async (): Promise<void> => {
                                const info = await getUserMrwRankScoreInfo(userId, WarTypeId.MrwStd, 2);
                                userIdAndScoreArray.push({ userId, score : info?.getCurrentScore() ?? MultiRankedWarConstants.InitialScore });
                            })());
                        } else if (num === 1) {
                            promiseArray.push((async (): Promise<void> => {
                                const info = await getUserMrwRankScoreInfo(userId, WarTypeId.MrwFog, 2);
                                userIdAndScoreArray.push({ userId, score : info?.getCurrentScore() ?? MultiRankedWarConstants.InitialScore });
                            })());
                        } else if (num === 2) {
                            promiseArray.push((async (): Promise<void> => {
                                const score1 = (await getUserMrwRankScoreInfo(userId, WarTypeId.MrwStd, 2))?.getCurrentScore() ?? MultiRankedWarConstants.InitialScore;
                                const score2 = (await getUserMrwRankScoreInfo(userId, WarTypeId.MrwFog, 2))?.getCurrentScore() ?? MultiRankedWarConstants.InitialScore;
                                userIdAndScoreArray.push({ userId, score : score1 + score2 });
                            })());
                        } else {
                            userIdAndScoreArray.push({ userId, score : Math.random() });
                        }
                    }
                    await Promise.all(promiseArray);
                    userIdAndScoreArray.sort((v1, v2) => v2.score - v1.score);
                }

                const bracketsCount     = dataArray.length;
                const newBracketArray   = new Array<number[]>(bracketsCount);
                {
                    const usersCount            = userIdAndScoreArray.length;
                    const seededPlayersCount    = bracketsCount * 2 - usersCount;
                    let bracketIndex            = 0;
                    for (let i = 0; i < usersCount; ++i) {
                        const arr = newBracketArray[bracketIndex] ??= [];
                        arr.push(userIdAndScoreArray[i].userId);
                        if ((i < seededPlayersCount) || (arr.length >= 2)) {
                            ++bracketIndex;
                        }
                    }
                    newBracketArray.sort(() => Math.random() - 0.5);
                }

                const list = this._listBracket;
                for (let i = 0; i < bracketsCount; ++i) {
                    const data          = dataArray[i];
                    data.userIdArray    = newBracketArray[i];
                    list.updateSingleData(i, data);
                }
            },
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const dataArray: InitialBracket[] = [];
        for (const data of this._dataArrayForListBracket) {
            dataArray.push(InitialBracket.fromJson({
                bracketGameId : data.bracketGameId,
                userIdArray   : getNonNullElements(data.userIdArray),
            }));
        }

        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId != null) {
            reqAtSetInitialBrackets(tourneyId, dataArray);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetInitialBrackets(): void {
        showLang(TextType.OperationSucceeded);
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._listBracket.bindData(this._dataArrayForListBracket, true);
    }

    private async _createDataArrayForListBracket(): Promise<DataForBracketRenderer[]> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return [];
        }

        const bracketInfoArray  = (await getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        const userIdSet         = new Set<number>();
        const dataArray         : DataForBracketRenderer[] = [];
        for (const bracketInfo of bracketInfoArray.filter(v => v.getBracketRoundId() === 1).sort((v1, v2) => (v1.getBracketGameId()) - (v2.getBracketGameId()))) {
            const userIdArray = bracketInfo.getUserIdArray();
            for (const userId of userIdArray) {
                if (!checkHasUserPublicInfo(userId)) {
                    userIdSet.add(userId);
                }
            }

            dataArray.push({
                bracketGameId : bracketInfo.getBracketGameId(),
                userIdArray   : userIdArray,
                panel         : this,
            });
        }

        if (userIdSet.size) {
            reqUserGetPublicInfoArray([...userIdSet]);
            showLang(TextType.A0040);
            await wait(2000);
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1046);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
    }
}

interface DataForBracketRenderer extends UiListItemData {
    bracketGameId   : number;
    userIdArray     : (number | null)[];
    panel           : Panel;
}
class BracketRenderer extends UiListItemRenderer<DataForBracketRenderer> {
    private readonly _imgBg!        : IUiImage;
    private readonly _labelGameId!  : IUiLabel;

    private readonly _groupName1!   : IUiContainer;
    private readonly _layoutName1!  : IUiLayout;
    private readonly _labelName1!   : IUiLabel;
    private readonly _labelScore1!  : IUiLabel;

    private readonly _groupName2!   : IUiContainer;
    private readonly _layoutName2!  : IUiLayout;
    private readonly _labelName2!   : IUiLabel;
    private readonly _labelScore2!  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupName1,     callback : this._onTouchedGroupName1 },
            { ui : this._groupName2,     callback : this._onTouchedGroupName2 },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateOnOpenDataChanged();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userIdArray       = openData.userIdArray;
        const bracketGameId     = openData.bracketGameId;
        this._imgBg.setIsVisible(bracketGameId % 2 < 1);
        this._labelGameId.setText(`#${bracketGameId}`);

        const userId1       = userIdArray[0];
        const userId2       = userIdArray[1];
        await Promise.all([
            this._updateLabelName(this._labelName1, userId1),
            this._updateLabelName(this._labelName2, userId2),
            this._updateLabelScore(this._labelScore1, userId1),
            this._updateLabelScore(this._labelScore2, userId2),
        ]);
        this._layoutName1.arrangeItems();
        this._layoutName2.arrangeItems();
        this._updateColorForLabels();
    }

    private _onTouchedGroupName1(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedSlot(openData.bracketGameId, 0);
        this._updateColorForLabels();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupName2(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedSlot(openData.bracketGameId, 1);
        this._updateColorForLabels();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private async _updateLabelName(label: IUiLabel, userId: number | null): Promise<void> {
        if (userId == null) {
            label.setText(`----`);
        } else {
            label.setText((await getUserNickname(userId)) || UndefinedError);
        }
    }

    private async _updateLabelScore(label: IUiLabel, userId: number | null): Promise<void> {
        if (userId == null) {
            label.setText(`----`);
        } else {
            const info1 = await getUserMrwRankScoreInfo(userId, WarTypeId.MrwStd, 2);
            const info2 = await getUserMrwRankScoreInfo(userId, WarTypeId.MrwFog, 2);
            label.setText(`${info1?.getCurrentScore() ?? MultiRankedWarConstants.InitialScore}, ${info2?.getCurrentScore() ?? MultiRankedWarConstants.InitialScore}`);
        }
    }

    private _updateColorForLabels(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const bracketGameId         = openData.bracketGameId;
        const selectedSlot          = openData.panel.getSelectedSlot();
        this._labelName1.setTextColor((selectedSlot?.bracketGameId === bracketGameId) && (selectedSlot.userSlotIndex === 0) ? 0x00FF00 : 0xFFFFFF);
        this._labelScore1.setTextColor((selectedSlot?.bracketGameId === bracketGameId) && (selectedSlot.userSlotIndex === 0) ? 0x00FF00 : 0xFFFFFF);
        this._labelName2.setTextColor((selectedSlot?.bracketGameId === bracketGameId) && (selectedSlot.userSlotIndex === 1) ? 0x00FF00 : 0xFFFFFF);
        this._labelScore2.setTextColor((selectedSlot?.bracketGameId === bracketGameId) && (selectedSlot.userSlotIndex === 1) ? 0x00FF00 : 0xFFFFFF);
    }
}
