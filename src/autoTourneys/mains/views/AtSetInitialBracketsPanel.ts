import * as AutoTourneysMainsGateway from "../Gateway.ts";
import * as AutoTourneysMainsProvider from "../Provider.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameConfigGcWar from "../../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../../helpers/Collection.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsInitialBracket from "../../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/InitialBracket.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../../timer/TimerModel.ts";
import * as UiComponentsUiListItemRenderer from "../../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../../users/Model.ts";
import * as UsersProxy from "../../../users/Proxy.ts";
import * as WarTypesConstants from "../../../warTypes/Constants.ts";

type Slot = {
    bracketGameId   : number;
    userSlotIndex   : number;
};

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSort!      : UiInterfacesIUiButton.IUiButton;

    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!    : UiInterfacesIUiButton.IUiButton;

    private readonly _listBracket!  : UiInterfacesIUiScrollList.IUiScrollList<DataForBracketRenderer>;

    private _selectedSlot               : Slot | null = null;
    private _dataArrayForListBracket    : DataForBracketRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgAtSetInitialBrackets,     callback: this._onNotifyMsgAtSetInitialBrackets },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnSort,            callback: this._onTouchedBtnSort },

            { ui: this._btnCancel,          callback: this.closePanel },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
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
                bracketGameId   : bracketGameId,
                userSlotIndex   : userSlotIndex,
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0408),
        });
    }

    private _onTouchedBtnSort(): void {
        const dataArray = this._dataArrayForListBracket;
        if (!dataArray.length) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0567),
            availableNumberArray    : [0, 1, 2, 3],
            currentNumber           : null,
            getNumberMainText       : num => {
                switch (num) {
                    case 0  : return LangUtils.getText(LangConstants.TextType.B0198);
                    case 1  : return LangUtils.getText(LangConstants.TextType.B0199);
                    case 2  : return LangUtils.getText(LangConstants.TextType.B1445);
                    case 3  : return LangUtils.getText(LangConstants.TextType.B1207);
                    default : return LangConstants.UndefinedError;
                }
            },
            callbackOnConfirm       : async num => {
                const userIdAndScoreArray: { userId: number, score: number }[] = [];
                {
                    const promiseArray: Promise<void>[] = [];
                    for (const userId of dataArray.flatMap(v => v.userIdArray)) {
                        if (userId == null) {
                            continue;
                        }

                        if (num === 0) {
                            promiseArray.push((async (): Promise<void> => {
                                const info = await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwStd, 2);
                                userIdAndScoreArray.push({ userId, score: info?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore });
                            })());
                        } else if (num === 1) {
                            promiseArray.push((async (): Promise<void> => {
                                const info = await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwFog, 2);
                                userIdAndScoreArray.push({ userId, score: info?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore });
                            })());
                        } else if (num === 2) {
                            promiseArray.push((async (): Promise<void> => {
                                const score1 = (await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwStd, 2))?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore;
                                const score2 = (await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwFog, 2))?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore;
                                userIdAndScoreArray.push({ userId, score: score1 + score2 });
                            })());
                        } else {
                            userIdAndScoreArray.push({ userId, score: Math.random() });
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
        const dataArray: ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsInitialBracket.InitialBracket[] = [];
        for (const data of this._dataArrayForListBracket) {
            dataArray.push(ProtoSchemaCommonProtoNetMessageMsgAtSetInitialBracketsInitialBracket.InitialBracket.fromJson({
                bracketGameId   : data.bracketGameId,
                userIdArray     : HelpersCollection.getNonNullElements(data.userIdArray),
            }));
        }

        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId != null) {
            AutoTourneysMainsGateway.reqAtSetInitialBrackets(tourneyId, dataArray);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetInitialBrackets(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
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

        const bracketInfoArray  = (await AutoTourneysMainsProvider.getAtFullBracketInfo(tourneyId))?.getSingleBracketInfoArray() ?? [];
        const userIdSet         = new Set<number>();
        const dataArray         : DataForBracketRenderer[] = [];
        for (const bracketInfo of bracketInfoArray.filter(v => v.getBracketRoundId() === 1).sort((v1, v2) => (v1.getBracketGameId() ?? 0) - (v2.getBracketGameId() ?? 0))) {
            const userIdArray = bracketInfo.getUserIdArray();
            for (const userId of userIdArray) {
                if (!UsersModel.checkHasUserPublicInfo(userId)) {
                    userIdSet.add(userId);
                }
            }

            dataArray.push({
                bracketGameId   : bracketInfo.getBracketGameId() ?? 0,
                userIdArray     : userIdArray,
                panel           : this,
            });
        }

        if (userIdSet.size) {
            UsersProxy.reqUserGetPublicInfoArray([...userIdSet]);
            FloatText2.showLang(LangConstants.TextType.A0040);
            await TimerTimerModel.wait(2000);
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1046));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
    }
}

interface DataForBracketRenderer extends UiTypesUiListItemData.UiListItemData {
    bracketGameId   : number;
    userIdArray     : (number | null)[];
    panel           : Panel;
}
class BracketRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForBracketRenderer> {
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelGameId!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupName1!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName1!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName1!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelScore1!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupName2!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName2!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName2!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelScore2!  : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupName1,     callback: this._onTouchedGroupName1 },
            { ui: this._groupName2,     callback: this._onTouchedGroupName2 },
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
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupName2(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedSlot(openData.bracketGameId, 1);
        this._updateColorForLabels();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private async _updateLabelName(label: UiInterfacesIUiLabel.IUiLabel, userId: number | null): Promise<void> {
        if (userId == null) {
            label.setText(`----`);
        } else {
            label.setText((await UsersModel.getUserNickname(userId)) || LangConstants.UndefinedError);
        }
    }

    private async _updateLabelScore(label: UiInterfacesIUiLabel.IUiLabel, userId: number | null): Promise<void> {
        if (userId == null) {
            label.setText(`----`);
        } else {
            const info1 = await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwStd, 2);
            const info2 = await UsersModel.getUserMrwRankScoreInfo(userId, WarTypesConstants.WarTypeId.MrwFog, 2);
            label.setText(`${info1?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore}, ${info2?.getCurrentScore() ?? GameConfigGcWar.MultiRankedWar.InitialScore}`);
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
