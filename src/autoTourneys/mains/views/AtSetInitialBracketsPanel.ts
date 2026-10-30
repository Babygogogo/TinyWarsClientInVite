import {
    Users_Model,
    AutoTourneys_Mains_Provider,
    GamePanels_Dict,
    Helpers_Collection,
    Lang_Utils,
    MultiRankedWars_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    AutoTourneys_Mains_Gateway,
    Users_Proxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    WarTypes_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../../internal.ts";
import { InitialBracket } from "../../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/InitialBracket.ts";

type Slot = {
    bracketGameId   : number;
    userSlotIndex   : number;
};

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSort!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnConfirm!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listBracket!  : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForBracketRenderer>;

    private _selectedSlot               : Slot | null = null;
    private _dataArrayForListBracket    : DataForBracketRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgAtSetInitialBrackets,     callback : this._onNotifyMsgAtSetInitialBrackets },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0408),
        });
    }

    private _onTouchedBtnSort(): void {
        const dataArray = this._dataArrayForListBracket;
        if (!dataArray.length) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0567),
            availableNumberArray : [0, 1, 2, 3],
            currentNumber        : null,
            getNumberMainText    : num => {
                switch (num) {
                    case 0  : return Lang_Utils.getText(Lang_Constants.TextType.B0198);
                    case 1  : return Lang_Utils.getText(Lang_Constants.TextType.B0199);
                    case 2  : return Lang_Utils.getText(Lang_Constants.TextType.B1445);
                    case 3  : return Lang_Utils.getText(Lang_Constants.TextType.B1207);
                    default : return Lang_Constants.UndefinedError;
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
                                const info = await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwStd, 2);
                                userIdAndScoreArray.push({ userId, score : info?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore });
                            })());
                        } else if (num === 1) {
                            promiseArray.push((async (): Promise<void> => {
                                const info = await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwFog, 2);
                                userIdAndScoreArray.push({ userId, score : info?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore });
                            })());
                        } else if (num === 2) {
                            promiseArray.push((async (): Promise<void> => {
                                const score1 = (await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwStd, 2))?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore;
                                const score2 = (await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwFog, 2))?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore;
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
                userIdArray   : Helpers_Collection.getNonNullElements(data.userIdArray),
            }));
        }

        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId != null) {
            AutoTourneys_Mains_Gateway.reqAtSetInitialBrackets(tourneyId, dataArray);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetInitialBrackets(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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

        const bracketInfoArray  = (await AutoTourneys_Mains_Provider.getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        const userIdSet         = new Set<number>();
        const dataArray         : DataForBracketRenderer[] = [];
        for (const bracketInfo of bracketInfoArray.filter(v => v.getBracketRoundId() === 1).sort((v1, v2) => (v1.getBracketGameId()) - (v2.getBracketGameId()))) {
            const userIdArray = bracketInfo.getUserIdArray();
            for (const userId of userIdArray) {
                if (!Users_Model.checkHasUserPublicInfo(userId)) {
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
            Users_Proxy.reqUserGetPublicInfoArray([...userIdSet]);
            FloatText.showLang(Lang_Constants.TextType.A0040);
            await Timer_TimerModel.wait(2000);
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1046);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
    }
}

interface DataForBracketRenderer extends Ui_Types_UiListItemData.UiListItemData {
    bracketGameId   : number;
    userIdArray     : (number | null)[];
    panel           : Panel;
}
class BracketRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForBracketRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelGameId!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupName1!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName1!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelScore1!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupName2!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName2!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName2!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelScore2!  : Ui_Interfaces_IUiLabel.IUiLabel;

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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupName2(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedSlot(openData.bracketGameId, 1);
        this._updateColorForLabels();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private async _updateLabelName(label: Ui_Interfaces_IUiLabel.IUiLabel, userId: number | null): Promise<void> {
        if (userId == null) {
            label.setText(`----`);
        } else {
            label.setText((await Users_Model.getUserNickname(userId)) || Lang_Constants.UndefinedError);
        }
    }

    private async _updateLabelScore(label: Ui_Interfaces_IUiLabel.IUiLabel, userId: number | null): Promise<void> {
        if (userId == null) {
            label.setText(`----`);
        } else {
            const info1 = await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwStd, 2);
            const info2 = await Users_Model.getUserMrwRankScoreInfo(userId, WarTypes_Constants.WarTypeId.MrwFog, 2);
            label.setText(`${info1?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore}, ${info2?.getCurrentScore() ?? MultiRankedWars_Constants.Common.InitialScore}`);
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
