import {
    type Notifications_Mapping,
    AuxiliaryTypes_ChatToTarget,
    Chat_Model,
    Chat_Constants,
    CoopCustomRoom_Model_CcrModel,
    MultiPlayerWar_Model_MpwWar,
    Chat_Proxy,
    FloatText,
    type AuxiliaryTypes_AuxiliaryTypes,
    Users_Model,
    type Egret_Egret,
    Keyboard_KbTypes,
    Lang_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Helpers_ImageSource,
    MultiPlayerWar_Model_MpwModel,
    NormalMap_Model_NormalMapModel,
    MultiCustomRoom_Model_McrModel,
    MultiFreeRoom_Model_MfrModel,
    Helpers_GameFlow,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiPromptedInput,
    type Ui_Interfaces_IUiScrollList,
    Lang_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    type Ui_Types_UiListItemData,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    WarTypes_Constants,
} from "../../internal.ts";

import type { ChatMessage } from "../../proto/schema/CommonProto/Chat/ChatMessage.ts";
import type { S as ChatAddMessageResponse } from "../../proto/schema/CommonProto/NetMessage/MsgChatAddMessage/S.ts";
import type { S as ChatDeleteMessageResponse } from "../../proto/schema/CommonProto/NetMessage/MsgChatDeleteMessage/S.ts";
import type { S as ChatUpdateReadProgressResponse } from "../../proto/schema/CommonProto/NetMessage/MsgChatUpdateReadProgress/S.ts";

let _preferredChatToTarget          = new AuxiliaryTypes_ChatToTarget.ChatToTarget();
const _preferredChatToTargetDict    = new Map<Chat_Constants.MainCategoryId, AuxiliaryTypes_ChatToTarget.ChatToTarget>();

export interface OpenData {
    toTarget    : AuxiliaryTypes_ChatToTarget.ChatToTarget;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnRefresh!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listMainCategory! : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMainCategoryRenderer>;

    private readonly _groupContent!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelNoContent!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listTarget!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTargetRenderer>;

    private readonly _groupMessage!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelNoMessage!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listMessage!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMessageRenderer>;

    private readonly _groupInput!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _inputMessage!     : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnSend!          : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "MsgChatAddMessage",       callback : this._onNotifyMsgChatAddMessage },
            { type : "MsgChatDeleteMessage",    callback : this._onNotifyMsgChatDeleteMessage },
            { type : "MsgChatGetAllMessages",   callback : this._onNotifyMsgChatGetAllMessages },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnHelp,        callback : this._onTouchedBtnHelp },
            { ui : this._btnRefresh,     callback : this._onTouchedBtnRefresh },
            { ui : this._btnSend,        callback : this._onTouchedBtnSend },
        ]);
        this._setKeyboardListener({
            callback   : this._onKeyboard,
            thisObject : this,
            priority   : 2,
        });
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMainCategory.setItemRendererClass(MainCategoryRenderer);
        this._listTarget.setItemRendererClass(TargetRenderer);
        this._listMessage.setItemRendererClass(MessageRenderer);
        this._inputMessage.setInputMaxLength(Chat_Constants.Common.MaxMessageLength);

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        await this._initListMainCategory();
        {
            const chatToTarget = openData.toTarget;
            if (!checkIsEmptyChatToTarget(chatToTarget)) {
                _preferredChatToTarget = chatToTarget.clone();
                _preferredChatToTargetDict.set(getDefaultSelectedMainCategory(chatToTarget), chatToTarget.clone());
            }
        }

        this.updateOnSelectMainCategory(getDefaultSelectedMainCategory(_preferredChatToTarget));
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listMainCategory.removeAllItems(),
            this._listMessage.removeAllItems(),
            this._listTarget.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async updateOnSelectMainCategory(mainCategory: Chat_Constants.MainCategoryId): Promise<void> {
        const listMainCategory = this._listMainCategory;
        listMainCategory.setSelectedItemIndex(listMainCategory.getRevisedFirstIndex(v => v?.mainCategory === mainCategory));

        await this._updateGroupContent();

        const chatToTarget = _preferredChatToTargetDict.get(mainCategory) ?? new AuxiliaryTypes_ChatToTarget.ChatToTarget();
        this.updateOnSelectToTarget(getDefaultSelectedToCategory(chatToTarget), getDefaultSelectedToTarget(chatToTarget));
    }
    public updateOnSelectToTarget(toCategory: Chat_Constants.ToCategoryId | null, toTarget: number | null): void {
        const listTarget        = this._listTarget;
        const newSelectedIndex  = listTarget.getRevisedFirstIndex(v => {
            if ((toCategory != null) && (toTarget != null)) {
                return (v?.toCategory === toCategory) && (v.toTarget === toTarget);
            } else {
                if (v?.toCategory !== Chat_Constants.ToCategoryId.PublicChannel) {
                    return true;
                } else {
                    return v.toTarget === (toTarget ?? (Lang_Utils.getCurrentLanguageType() === Lang_Constants.LanguageType.Chinese ? Chat_Constants.PublicChannelId.PublicCn : Chat_Constants.PublicChannelId.PublicEn));
                }
            }
        });
        listTarget.setSelectedItemIndex(newSelectedIndex);
        this._updateComponentsForMessage(true);

        {
            const targetData = listTarget.getFirstSelectedData();
            if (targetData != null) {
                const selectedToCategory    = targetData.toCategory;
                const selectedToTarget      = targetData.toTarget;
                if (Chat_Model.checkHasUnreadMessageForTarget(selectedToCategory, selectedToTarget)) {
                    Chat_Proxy.reqUpdateReadProgress(
                        selectedToCategory,
                        selectedToTarget,
                        Chat_Model.getLatestMessageTimestamp(selectedToCategory, selectedToTarget),
                    );
                }

                const chatToTarget      = generateChatToTarget(targetData);
                _preferredChatToTarget  = chatToTarget;
                _preferredChatToTargetDict.set(getDefaultSelectedMainCategory(chatToTarget), chatToTarget.clone());
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onNotifyMsgChatAddMessage(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgChatAddMessage"]>): Promise<void> {
        const message       = Helpers_Misc.getExisted(((e.data as { msg: ChatAddMessageResponse }).msg).getMessage());
        const msgFromUserId = message.getFromUserId();
        const selfUserId    = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
        if (msgFromUserId === selfUserId) {
            this._inputMessage.setInputText(``);
        }

        const msgToCategory     = message.getToCategory() as Chat_Constants.ToCategoryId;
        const rawMsgToTarget    = message.getToTarget();
        if (!checkIsMessageInMainCategory({
            mainCategory : Helpers_Misc.getExisted(this._listMainCategory.getFirstSelectedData()?.mainCategory),
            toCategory   : msgToCategory,
            toTarget     : rawMsgToTarget,
            fromUserId   : msgFromUserId,
        })) {
            return;
        }

        const listTarget    = this._listTarget;
        const oldTargetData = listTarget.getFirstSelectedData();
        await this._updateGroupContent();

        if (oldTargetData == null) {
            this.updateOnSelectToTarget(null, null);
        } else {
            this.updateOnSelectToTarget(oldTargetData.toCategory, oldTargetData.toTarget);
        }
    }

    private async _onNotifyMsgChatDeleteMessage(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgChatDeleteMessage"]>): Promise<void> {
        const messageId = ((e.data as { msg: ChatDeleteMessageResponse }).msg).getMessageId();
        if (this._listMessage.getBoundDataArray()?.some(v => v?.message.getMessageId() === messageId)) {
            this._updateComponentsForMessage(false);
        }
    }

    private async _onNotifyMsgChatGetAllMessages(): Promise<void> {
        const oldTargetData = this._listTarget.getFirstSelectedData();
        await this._updateGroupContent();

        if (oldTargetData == null) {
            this.updateOnSelectToTarget(null, null);
        } else {
            this.updateOnSelectToTarget(oldTargetData.toCategory, oldTargetData.toTarget);
        }
    }

    private _onTouchedBtnRefresh(): void {
        const currTime  = Timer_TimerModel.getServerTimestamp();
        const cdTime    = Chat_Model.getTimestampForNextReqAllMessages() - currTime;
        if (cdTime > 0) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0026, cdTime));
        } else {
            Chat_Model.setTimestampForNextReqAllMessages(currTime + 30);
            Chat_Proxy.reqGetAllMessages();
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0870),
        });
    }

    private _onTouchedBtnSend(): void {
        const content = (this._inputMessage.getInputText() ?? ``).trim();
        if (content) {
            if (content.length > Chat_Constants.Common.MaxMessageLength) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0375));
            } else {
                const data = this._listTarget.getFirstSelectedData();
                if (data != null) {
                    Chat_Proxy.reqChatAddMessage(content, data.toCategory, data.toTarget);
                }
            }
        }
    }

    private _onKeyboard(data: Keyboard_KbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys = data.newKeys;
        const allKeys = data.allKeys;
        if ((newKeys.has(Keyboard_KbTypes.KeyCode.Enter)) && (!allKeys.has(Keyboard_KbTypes.KeyCode.Shift))) {
            this._onTouchedBtnSend();

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Escape)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this.closePanel();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0383);
        this._labelNoContent.setLangText(Lang_Constants.TextType.B0278);
        this._labelNoMessage.setLangText(Lang_Constants.TextType.B0381);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
    }
    private async _updateGroupContent(): Promise<void> {
        const dataArray         = await this._createDataForListTarget();
        const groupContent      = this._groupContent;
        const labelNoContent    = this._labelNoContent;
        const listTarget        = this._listTarget;
        if (dataArray.length) {
            groupContent.setIsVisible(true);
            labelNoContent.setIsVisible(false);
            await listTarget.bindData(dataArray);
        } else {
            groupContent.setIsVisible(false);
            labelNoContent.setIsVisible(true);
            listTarget.removeAllItems();
        }
    }
    private async _updateComponentsForMessage(needScroll: boolean): Promise<void> {
        const labelNoMessage    = this._labelNoMessage;
        const listMessage       = this._listMessage;
        const chatData          = this._listTarget.getFirstSelectedData();
        if (chatData == null) {
            labelNoMessage.setIsVisible(true);
            listMessage.removeAllItems();
            return;
        }

        const dataArray : DataForMessageRenderer[] = [];
        for (const message of Chat_Model.getMessagesForCategory(chatData.toCategory).get(chatData.toTarget) || []) {
            dataArray.push({ message });
        }
        labelNoMessage.setIsVisible(!dataArray.length);
        await listMessage.bindData(dataArray);

        if (needScroll) {
            listMessage.scrollBottom();
        }
    }

    private async _initListMainCategory(): Promise<void> {
        const list = this._listMainCategory;
        if (!list.getBoundDataArray()?.length) {
            await list.bindData([
                {
                    mainCategory : Chat_Constants.MainCategoryId.PublicChannel,
                    panel        : this,
                },
                {
                    mainCategory : Chat_Constants.MainCategoryId.War,
                    panel        : this,
                },
                {
                    mainCategory : Chat_Constants.MainCategoryId.Room,
                    panel        : this,
                },
                {
                    mainCategory : Chat_Constants.MainCategoryId.Following,
                    panel        : this,
                },
                {
                    mainCategory : Chat_Constants.MainCategoryId.Stranger,
                    panel        : this,
                },
                {
                    mainCategory : Chat_Constants.MainCategoryId.MapReview,
                    panel        : this,
                },
            ]);
        }
    }
    private async _createDataForListTarget(): Promise<DataForTargetRenderer[]> {
        const chatToTarget = this.getOpenData()?.toTarget;
        if (chatToTarget == null) {
            return [];
        }

        const dataDict      = new Map<number, DataForTargetRenderer>();
        const selfUserId    = Users_Model.getSelfUserId();
        const timestampList : { index: number, timestamp: number }[] = [];
        const mainCategory  = Helpers_Misc.getExisted(this._listMainCategory.getFirstSelectedData()?.mainCategory);
        let indexForSort    = 0;
        if (mainCategory === Chat_Constants.MainCategoryId.PublicChannel) {
            for (const [toChannelId, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.PublicChannel)) {
                dataDict.set(indexForSort, {
                    index      : indexForSort,
                    panel      : this,
                    toCategory : Chat_Constants.ToCategoryId.PublicChannel,
                    toTarget   : toChannelId,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.PublicChannel, toTarget : Chat_Constants.PublicChannelId.PublicCn })) {
                dataDict.set(indexForSort, {
                    index      : indexForSort,
                    panel      : this,
                    toCategory : Chat_Constants.ToCategoryId.PublicChannel,
                    toTarget   : Chat_Constants.PublicChannelId.PublicCn,
                });
                timestampList.push(getLatestTimestamp(indexForSort, null));
                ++indexForSort;
            }
            if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.PublicChannel, toTarget : Chat_Constants.PublicChannelId.PublicEn })) {
                dataDict.set(indexForSort, {
                    index      : indexForSort,
                    panel      : this,
                    toCategory : Chat_Constants.ToCategoryId.PublicChannel,
                    toTarget   : Chat_Constants.PublicChannelId.PublicEn,
                });
                timestampList.push(getLatestTimestamp(indexForSort, null));
                ++indexForSort;
            }

        } else if (mainCategory === Chat_Constants.MainCategoryId.War) {
            for (const [toWarAndTeam, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.WarAndTeam)) {
                dataDict.set(indexForSort, {
                    index      : indexForSort,
                    panel      : this,
                    toCategory : Chat_Constants.ToCategoryId.WarAndTeam,
                    toTarget   : toWarAndTeam,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toWarAndSelf, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.WarAndSelf)) {
                dataDict.set(indexForSort, {
                    index      : indexForSort,
                    panel      : this,
                    toCategory : Chat_Constants.ToCategoryId.WarAndSelf,
                    toTarget   : toWarAndSelf,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            if (selfUserId != null) {
                const handlerForWarAndTeam = async (warIdArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>) => {
                    for (const warId of warIdArray ?? []) {
                        const warProgressInfo = await MultiPlayerWar_Model_MpwModel.getWarProgressInfo(warId);
                        if ((warProgressInfo != null) && (!warProgressInfo.getIsEnded())) {
                            const toWarAndTeam1 = warId * Chat_Constants.Common.TeamDivider;
                            if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.WarAndTeam, toTarget : toWarAndTeam1 })) {
                                dataDict.set(indexForSort, {
                                    index      : indexForSort,
                                    panel      : this,
                                    toCategory : Chat_Constants.ToCategoryId.WarAndTeam,
                                    toTarget   : toWarAndTeam1,
                                });
                                timestampList.push(getLatestTimestamp(indexForSort, null));
                                ++indexForSort;
                            }

                            const selfPlayerInfo    = (await MultiPlayerWar_Model_MpwModel.getWarSettings(warId))?.getPlayerInfoArray().find(v => (v.getUserId() ?? 0) == selfUserId);
                            const toWarAndTeam2     = toWarAndTeam1 + (selfPlayerInfo?.getTeamIndex() ?? 0);
                            if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.WarAndTeam, toTarget : toWarAndTeam2 })) {
                                dataDict.set(indexForSort, {
                                    index      : indexForSort,
                                    panel      : this,
                                    toCategory : Chat_Constants.ToCategoryId.WarAndTeam,
                                    toTarget   : toWarAndTeam2,
                                });
                                timestampList.push(getLatestTimestamp(indexForSort, null));
                                ++indexForSort;
                            }

                            {
                                const toWarAndSelf = warId * Chat_Constants.Common.TeamDivider + (selfPlayerInfo?.getPlayerIndex() ?? 0);
                                if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.WarAndSelf, toTarget : toWarAndSelf })) {
                                    dataDict.set(indexForSort, {
                                        index      : indexForSort,
                                        panel      : this,
                                        toCategory : Chat_Constants.ToCategoryId.WarAndSelf,
                                        toTarget   : toWarAndSelf,
                                    });
                                    timestampList.push(getLatestTimestamp(indexForSort, null));
                                    ++indexForSort;
                                }
                            }
                        }
                    }
                };
                await Promise.all([
                    handlerForWarAndTeam(await MultiPlayerWar_Model_MpwModel.getJoinedMpwIdArray()),
                ]);
            }

        } else if (mainCategory === Chat_Constants.MainCategoryId.Room) {
            for (const [toRoomId, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.McrRoom)) {
                if (await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.McrRoom,
                        toTarget   : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.CcrRoom)) {
                if (await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.CcrRoom,
                        toTarget   : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.MfrRoom)) {
                if (await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.MfrRoom,
                        toTarget   : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            {
                for (const roomId of await MultiCustomRoom_Model_McrModel.getJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.McrRoom, toTarget : roomId })) {
                        dataDict.set(indexForSort, {
                            index      : indexForSort,
                            panel      : this,
                            toCategory : Chat_Constants.ToCategoryId.McrRoom,
                            toTarget   : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }
            {
                for (const roomId of await CoopCustomRoom_Model_CcrModel.getJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.CcrRoom, toTarget : roomId })) {
                        dataDict.set(indexForSort, {
                            index      : indexForSort,
                            panel      : this,
                            toCategory : Chat_Constants.ToCategoryId.CcrRoom,
                            toTarget   : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }
            {
                for (const roomId of await MultiFreeRoom_Model_MfrModel.getJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.MfrRoom, toTarget : roomId })) {
                        dataDict.set(indexForSort, {
                            index      : indexForSort,
                            panel      : this,
                            toCategory : Chat_Constants.ToCategoryId.MfrRoom,
                            toTarget   : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }

        } else if (mainCategory === Chat_Constants.MainCategoryId.MapReview) {
            for (const [toMapReviewTarget, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.MapReview)) {
                dataDict.set(indexForSort, {
                    index      : indexForSort,
                    panel      : this,
                    toCategory : Chat_Constants.ToCategoryId.MapReview,
                    toTarget   : toMapReviewTarget,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            {
                const toMapReviewTarget = chatToTarget.toMapReviewTarget;
                if ((toMapReviewTarget != null) && (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.MapReview, toTarget : toMapReviewTarget }))) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.MapReview,
                        toTarget   : toMapReviewTarget,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            {
                const toMapReviewTarget = Users_Model.getSelfUserId();
                if ((toMapReviewTarget != null) && (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.MapReview, toTarget : toMapReviewTarget }))) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.MapReview,
                        toTarget   : toMapReviewTarget,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else if (mainCategory === Chat_Constants.MainCategoryId.Following) {
            for (const [toUserId, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.Private)) {
                if ((Users_Model.checkIsFollowingUser(toUserId)) &&
                    (!Users_Model.checkIsBlockingUser(toUserId))
                ) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.Private,
                        toTarget   : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            for (const toUserId of Users_Model.getSelfInfo()?.getUserRelationInfo()?.getFollowingUserIdArray() ?? []) {
                if ((!Users_Model.checkIsBlockingUser(toUserId))                                                                             &&
                    (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.Private, toTarget : toUserId }))
                ) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.Private,
                        toTarget   : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else if (mainCategory === Chat_Constants.MainCategoryId.Stranger) {
            for (const [toUserId, msgList] of Chat_Model.getMessagesForCategory(Chat_Constants.ToCategoryId.Private)) {
                if ((!Users_Model.checkIsFollowingUser(toUserId))    &&
                    (!Users_Model.checkIsBlockingUser(toUserId))
                ) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.Private,
                        toTarget   : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            {
                const toUserId = chatToTarget.toUserId;
                if ((toUserId != null)                                                                                                          &&
                    (!Users_Model.checkIsFollowingUser(toUserId))                                                                            &&
                    (!Users_Model.checkIsBlockingUser(toUserId))                                                                             &&
                    (!checkHasDataForChatCategoryAndTarget({ dict : dataDict, toCategory : Chat_Constants.ToCategoryId.Private, toTarget : toUserId }))
                ) {
                    dataDict.set(indexForSort, {
                        index      : indexForSort,
                        panel      : this,
                        toCategory : Chat_Constants.ToCategoryId.Private,
                        toTarget   : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else {
            throw Helpers_Misc.newError(`Invalid mainCategory: ${mainCategory}`);
        }

        const dataList  : DataForTargetRenderer[] = [];
        let index       = 0;
        for (const v of timestampList.sort((a, b) => b.timestamp - a.timestamp)) {
            const data = Helpers_Misc.getExisted(dataDict.get(v.index));
            data.index = index;
            dataList.push(data);
            ++index;
        }

        return dataList;
    }
}

function getLatestTimestamp(index: number, msgList: ChatMessage[] | null): { index: number, timestamp: number } {
    let timestamp = 0;
    for (const msg of msgList || []) {
        timestamp = Math.max(timestamp, msg.getTimestamp());
    }
    return {
        index,
        timestamp,
    };
}
function checkHasDataForChatCategoryAndTarget({ dict, toTarget, toCategory }: {
    dict        : Map<number, DataForTargetRenderer>;
    toTarget    : number;
    toCategory  : Chat_Constants.ToCategoryId
}): boolean {
    for (const [, data] of dict) {
        if ((data.toCategory === toCategory) && (data.toTarget === toTarget)) {
            return true;
        }
    }
    return false;
}

interface DataForMainCategoryRenderer extends Ui_Types_UiListItemData.UiListItemData {
    mainCategory    : Chat_Constants.MainCategoryId;
    panel           : Panel;
}
class MainCategoryRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMainCategoryRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForMainCategoryRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgRed!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "MsgChatGetAllMessages",            callback : this._onMsgChatGetAllMessages },
            { type : "MsgChatAddMessage",                callback : this._onMsgChatAddMessage },
            { type : "MsgChatGetAllReadProgressList",    callback : this._onMsgChatGetAllReadProgressList },
            { type : "MsgChatUpdateReadProgress",        callback : this._onMsgChatUpdateReadProgress },
        ]);
        this._applySettingsForWholeTouch();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.panel.updateOnSelectMainCategory(openData.mainCategory);
    }

    private _onMsgChatGetAllMessages(): void {
        this._updateImgRed();
    }
    private _onMsgChatAddMessage(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgChatAddMessage"]>): void {
        const mainCategory = this.getOpenData()?.mainCategory;
        if (mainCategory == null) {
            return;
        }

        const data          = (e.data as { msg: ChatAddMessageResponse }).msg;
        const message       = Helpers_Misc.getExisted(data.getMessage());
        const toCategory    = message.getToCategory() as Chat_Constants.ToCategoryId;
        if (mainCategory === Chat_Constants.MainCategoryId.PublicChannel) {
            if (toCategory === Chat_Constants.ToCategoryId.PublicChannel) {
                this._updateImgRed();
            }
        } else if (mainCategory === Chat_Constants.MainCategoryId.Room) {
            if ((toCategory === Chat_Constants.ToCategoryId.CcrRoom) || (toCategory === Chat_Constants.ToCategoryId.McrRoom) || (toCategory === Chat_Constants.ToCategoryId.MfrRoom)) {
                this._updateImgRed();
            }
        } else if (mainCategory === Chat_Constants.MainCategoryId.War) {
            if (toCategory === Chat_Constants.ToCategoryId.WarAndTeam) {
                this._updateImgRed();
            }
        } else if (mainCategory === Chat_Constants.MainCategoryId.Following) {
            if (toCategory === Chat_Constants.ToCategoryId.Private) {
                if ((Users_Model.checkIsFollowingUser(message.getFromUserId())) || (Users_Model.checkIsFollowingUser(message.getToTarget()))) {
                    this._updateImgRed();
                }
            }
        } else if (mainCategory === Chat_Constants.MainCategoryId.Stranger) {
            if (toCategory === Chat_Constants.ToCategoryId.Private) {
                if ((!Users_Model.checkIsFollowingUser(message.getFromUserId())) && (!Users_Model.checkIsFollowingUser(message.getToTarget()))) {
                    this._updateImgRed();
                }
            }
        } else if (mainCategory === Chat_Constants.MainCategoryId.MapReview) {
            if (toCategory === Chat_Constants.ToCategoryId.MapReview) {
                this._updateImgRed();
            }
        } else {
            throw Helpers_Misc.newError(`Invalid mainCategory: ${mainCategory}`);
        }
    }
    private _onMsgChatGetAllReadProgressList(): void {
        this._updateImgRed();
    }
    private _onMsgChatUpdateReadProgress(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgChatUpdateReadProgress"]>): void {
        const mainCategory = this.getOpenData()?.mainCategory;
        if (mainCategory == null) {
            return;
        }

        const data      = (e.data as { msg: ChatUpdateReadProgressResponse }).msg;
        const progress  = Helpers_Misc.getExisted(data.getProgress());
        if (checkIsMessageInMainCategory({
            mainCategory : mainCategory,
            toCategory   : progress.getToCategory(),
            toTarget     : progress.getToTarget(),
            fromUserId   : Users_Model.getSelfUserId(),
        })) {
            this._updateImgRed();
        }
    }

    protected override _doApplyOpenData(): void {
        this._updateLabels();
        this._updateImgRed();
    }

    private async _updateLabels(): Promise<void> {
        const category = this.getOpenData()?.mainCategory;
        if (category == null) {
            return;
        }

        const labelType = this._labelName;
        if (category === Chat_Constants.MainCategoryId.PublicChannel) {
            labelType.setLangText(Lang_Constants.TextType.B0376);

        } else if (category === Chat_Constants.MainCategoryId.War) {
            labelType.setLangText(Lang_Constants.TextType.B0719);

        } else if (category === Chat_Constants.MainCategoryId.Room) {
            labelType.setLangText(Lang_Constants.TextType.B0405);

        } else if (category === Chat_Constants.MainCategoryId.Following) {
            labelType.setLangText(Lang_Constants.TextType.B0997);

        } else if (category === Chat_Constants.MainCategoryId.Stranger) {
            labelType.setLangText(Lang_Constants.TextType.B0998);

        } else if (category === Chat_Constants.MainCategoryId.MapReview) {
            labelType.setLangText(Lang_Constants.TextType.B0892);

        } else {
            labelType.setText(Lang_Constants.UndefinedError);
        }
    }

    private _updateImgRed(): void {
        const openData = this.getOpenData();
        this._imgRed.setIsVisible(openData == null ? false : Chat_Model.checkHasUnreadMessageForMainCategory(openData.mainCategory));
    }
}

interface DataForTargetRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    panel       : Panel;
    toCategory  : Chat_Constants.ToCategoryId;
    toTarget    : number;
}
class TargetRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTargetRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForTargetRenderer> {
    private readonly _layoutContent!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutType!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelType!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgOnlineState!   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgRed!           : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "MsgChatGetAllMessages",            callback : this._onMsgChatGetAllMessages },
            { type : "MsgChatAddMessage",                callback : this._onMsgChatAddMessage },
            { type : "MsgChatGetAllReadProgressList",    callback : this._onMsgChatGetAllReadProgressList },
            { type : "MsgChatUpdateReadProgress",        callback : this._onMsgChatUpdateReadProgress },
        ]);
        this._applySettingsForWholeTouch();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.panel.updateOnSelectToTarget(openData.toCategory, openData.toTarget);
    }

    private _onMsgChatGetAllMessages(): void {
        this._updateImgRed();
    }
    private _onMsgChatAddMessage(): void {
        this._updateImgRed();
    }
    private _onMsgChatGetAllReadProgressList(): void {
        this._updateImgRed();
    }
    private _onMsgChatUpdateReadProgress(): void {
        this._updateImgRed();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabels();
        this._updateImgRed();
    }

    private async _updateLabels(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const toCategory        = openData.toCategory;
        const toTarget          = openData.toTarget;
        const labelType         = this._labelType;
        const labelName         = this._labelName;
        const imgOnlineState    = this._imgOnlineState;
        labelType.setTextColor(0xFFFFFF);
        labelName.setTextColor(0xFFFFFF);

        if (toCategory === Chat_Constants.ToCategoryId.PublicChannel) {
            const languageType  = toTarget === Chat_Constants.PublicChannelId.PublicCn
                ? Lang_Constants.LanguageType.Chinese
                : (toTarget === Chat_Constants.PublicChannelId.PublicEn
                    ? Lang_Constants.LanguageType.English
                    : Lang_Utils.getCurrentLanguageType()
                );
            labelType.setLangText(Lang_Constants.TextType.B0376, languageType);
            labelName.setText(Lang_Utils.getChatChannelName(toTarget, languageType) ?? Lang_Constants.UndefinedError);
            imgOnlineState.setIsVisible(false);

        } else if (toCategory === Chat_Constants.ToCategoryId.WarAndTeam) {
            const divider           = Chat_Constants.Common.TeamDivider;
            const teamIndex         = toTarget % divider;
            const warId             = Math.floor(toTarget / divider);
            const warType           = await MultiPlayerWar_Model_MpwModel.getWarType(warId);
            const war               = Helpers_GameFlow.getOngoingWar();
            imgOnlineState.setIsVisible(false);

            if (war?.getWarId() !== warId) {
                labelType.setText(`${warType == null ? Lang_Constants.UndefinedError : Lang_Utils.getWarTypeName(warType) ?? Lang_Constants.UndefinedError} #${warId}`);
                labelName.setText(`${teamIndex === 0 ? Lang_Utils.getText(Lang_Constants.TextType.B0379) : Lang_Utils.getPlayerTeamName(teamIndex)}`);
            } else {
                labelType.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1341)} #${warId}`);
                labelType.setTextColor(0x00FF00);

                if (teamIndex === 0) {
                    labelName.setLangText(Lang_Constants.TextType.B0379);
                } else {
                    if ((war instanceof MultiPlayerWar_Model_MpwWar.MpwWar)                                      &&
                        (teamIndex === war.getPlayerManager().getPlayerLoggedIn()?.getTeamIndex())
                    ) {
                        labelName.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1342)} (${Lang_Utils.getPlayerShortTeamName(teamIndex)})` );
                        labelName.setTextColor(0x00FF00);
                    } else {
                        labelName.setText(Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError);
                    }
                }
            }

        } else if (toCategory === Chat_Constants.ToCategoryId.WarAndSelf) {
            const warId             = Math.floor(toTarget / Chat_Constants.Common.TeamDivider);
            const warType           = await MultiPlayerWar_Model_MpwModel.getWarType(warId);
            imgOnlineState.setIsVisible(false);
            labelName.setLangText(Lang_Constants.TextType.B1367);
            labelName.setTextColor(0x00FF00);

            if (Helpers_GameFlow.getOngoingWar()?.getWarId() !== warId) {
                labelType.setText(`${warType == null ? Lang_Constants.UndefinedError : Lang_Utils.getWarTypeName(warType) ?? Lang_Constants.UndefinedError} #${warId}`);
            } else {
                labelType.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1341)} #${warId}`);
                labelType.setTextColor(0x00FF00);
            }

        } else if (toCategory === Chat_Constants.ToCategoryId.Private) {
            labelType.setLangText(Lang_Constants.TextType.B0378);
            labelName.setText(``);
            imgOnlineState.setIsVisible(true);
            imgOnlineState.loadSource(Helpers_ImageSource.getUserOnlineState(await Users_Model.getUserOnlineState(toTarget)));
            labelName.setText((await Users_Model.getUserNickname(toTarget)) ?? Lang_Constants.UndefinedError);

        } else if (toCategory === Chat_Constants.ToCategoryId.McrRoom) {
            const hasFog = (await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(toTarget))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${Lang_Utils.getWarTypeName(hasFog ? WarTypes_Constants.WarTypeId.McwFog : WarTypes_Constants.WarTypeId.McwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await MultiCustomRoom_Model_McrModel.getRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                const settingsForMcw    = Helpers_Misc.getExisted(roomInfo.getSettingsForMcw());
                const warName           = settingsForMcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    labelName.setText(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId()) ?? Lang_Constants.UndefinedError);
                }
            }

        } else if (toCategory === Chat_Constants.ToCategoryId.CcrRoom) {
            const hasFog = (await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(toTarget))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${Lang_Utils.getWarTypeName(hasFog ? WarTypes_Constants.WarTypeId.CcwFog : WarTypes_Constants.WarTypeId.CcwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await CoopCustomRoom_Model_CcrModel.getRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                const settingsForCcw    = Helpers_Misc.getExisted(roomInfo.getSettingsForCcw());
                const warName           = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    labelName.setText(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId()) ?? Lang_Constants.UndefinedError);
                }
            }

        } else if (toCategory === Chat_Constants.ToCategoryId.MfrRoom) {
            const hasFog = (await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(toTarget))?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${Lang_Utils.getWarTypeName(hasFog ? WarTypes_Constants.WarTypeId.MfwFog : WarTypes_Constants.WarTypeId.MfwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await MultiFreeRoom_Model_MfrModel.getRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                labelName.setText(roomInfo.getSettingsForMfw()?.getWarName() ?? Lang_Utils.getText(Lang_Constants.TextType.B0555));
            }

        } else if (toCategory === Chat_Constants.ToCategoryId.MapReview) {
            labelType.setLangText(Lang_Constants.TextType.B0892);
            labelName.setText((await Users_Model.getUserBriefInfo(toTarget))?.getNickname() ?? Lang_Constants.UndefinedError);
            imgOnlineState.setIsVisible(false);

        } else {
            throw Helpers_Misc.newError(`Invalid data.`);
        }

        this._layoutType.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateImgRed(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgRed.setIsVisible(Chat_Model.checkHasUnreadMessageForTarget(openData.toCategory, openData.toTarget));
    }
}

interface DataForMessageRenderer extends Ui_Types_UiListItemData.UiListItemData {
    message: ChatMessage;
}
class MessageRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMessageRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForMessageRenderer> {
    private readonly _imgAvatar!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgOnlineState!   : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMedal!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTime!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelContent!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._updateLabelContent();
        this._updateLayoutName();
    }
    private _updateLabelContent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const message       = openData.message;
        const labelContent  = this._labelContent;
        if (Users_Model.checkIsBlockingUser(message.getFromUserId())) {
            labelContent.setText(`(${Lang_Utils.getText(Lang_Constants.TextType.B1301)})`);
            labelContent.setTextColor(0xAAAAAA);
        } else {
            labelContent.setText((message.getContent() ?? Lang_Constants.UndefinedError));
            labelContent.setTextColor(0xFFFFFF);
        }
        this.setUnscaledManualHeight(labelContent.getScaledHeight() + 30);
    }
    private async _updateLayoutName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const message       = openData.message;
        const fromUserId    = message.getFromUserId();
        this._labelName.setTextColor(fromUserId === Users_Model.getSelfUserId() ? 0x00FF00 : 0xFFFFFF);
        this._labelTime.setText(Lang_Utils.getTimestampShortText(message.getTimestamp()));
        this._imgMedal.loadSource(``);

        const userInfo = Helpers_Misc.getExisted(await Users_Model.getUserPublicInfo(fromUserId));
        if (openData === this.getOpenData()) {
            this._imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(userInfo.getAvatarId() ?? 1));
            this._labelName.setText(`${userInfo.getNickname() || `???`}`);

            const medalId = userInfo.getShowMedalIdArray()[0];
            this._imgMedal.loadSource(medalId == null ? `` : Helpers_ImageSource.getMedal(medalId));
        }
        this._layoutName.arrangeItems();

        this._imgOnlineState.loadSource(Helpers_ImageSource.getUserOnlineState(await Users_Model.getUserOnlineState(fromUserId)));
    }

    public async onItemTapEvent(): Promise<void> {
        const message = this.getOpenData()?.message;
        if (message == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatCommandPanel, {
            messageId : message.getMessageId(),
            userId    : message.getFromUserId(),
        });
    }
}

function checkIsMessageInMainCategory({ mainCategory, toCategory, toTarget, fromUserId }: {
    mainCategory    : Chat_Constants.MainCategoryId;
    toCategory      : Chat_Constants.ToCategoryId;
    toTarget        : number;
    fromUserId      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}): boolean {
    if (mainCategory === Chat_Constants.MainCategoryId.PublicChannel) {
        return toCategory === Chat_Constants.ToCategoryId.PublicChannel;

    } else if (mainCategory === Chat_Constants.MainCategoryId.Room) {
        return (toCategory === Chat_Constants.ToCategoryId.CcrRoom) || (toCategory === Chat_Constants.ToCategoryId.McrRoom) || (toCategory === Chat_Constants.ToCategoryId.MfrRoom);

    } else if (mainCategory === Chat_Constants.MainCategoryId.War) {
        return (toCategory === Chat_Constants.ToCategoryId.WarAndTeam) || (toCategory === Chat_Constants.ToCategoryId.WarAndSelf);

    } else if (mainCategory === Chat_Constants.MainCategoryId.Following) {
        return (toCategory === Chat_Constants.ToCategoryId.Private)
            && ((Users_Model.checkIsFollowingUser(toTarget)) || (Users_Model.checkIsFollowingUser(fromUserId)));

    } else if (mainCategory === Chat_Constants.MainCategoryId.Stranger) {
        return (toCategory === Chat_Constants.ToCategoryId.Private)
            && (!Users_Model.checkIsFollowingUser(toTarget))
            && (!Users_Model.checkIsFollowingUser(fromUserId));

    } else if (mainCategory === Chat_Constants.MainCategoryId.MapReview) {
        return toCategory === Chat_Constants.ToCategoryId.MapReview;

    } else {
        throw Helpers_Misc.newError(`Invalid mainCategory: ${mainCategory}`);
    }
}

function checkIsEmptyChatToTarget(chatToTarget: AuxiliaryTypes_ChatToTarget.ChatToTarget): boolean {
    return (chatToTarget.toCcrRoomId == null)
        && (chatToTarget.toMapReviewTarget == null)
        && (chatToTarget.toMcrRoomId == null)
        && (chatToTarget.toMfrRoomId == null)
        && (chatToTarget.toUserId == null)
        && (chatToTarget.toPublicChannel == null)
        && (chatToTarget.toWarAndTeam == null)
        && (chatToTarget.toWarAndSelf == null);
}
function getDefaultSelectedMainCategory(chatToTarget: AuxiliaryTypes_ChatToTarget.ChatToTarget): Chat_Constants.MainCategoryId {
    if (chatToTarget.toCcrRoomId != null) {
        return Chat_Constants.MainCategoryId.Room;
    } else if (chatToTarget.toMapReviewTarget != null) {
        return Chat_Constants.MainCategoryId.MapReview;
    } else if (chatToTarget.toMcrRoomId != null) {
        return Chat_Constants.MainCategoryId.Room;
    } else if (chatToTarget.toMfrRoomId != null) {
        return Chat_Constants.MainCategoryId.Room;
    } else if (chatToTarget.toUserId != null) {
        return Users_Model.checkIsFollowingUser(chatToTarget.toUserId) ? Chat_Constants.MainCategoryId.Following : Chat_Constants.MainCategoryId.Stranger;
    } else if (chatToTarget.toWarAndTeam != null) {
        return Chat_Constants.MainCategoryId.War;
    } else if (chatToTarget.toWarAndSelf != null) {
        return Chat_Constants.MainCategoryId.War;
    } else if (chatToTarget.toPublicChannel != null) {
        return Chat_Constants.MainCategoryId.PublicChannel;
    } else {
        return Chat_Constants.MainCategoryId.PublicChannel;
    }
}
function getDefaultSelectedToCategory(chatToTarget: AuxiliaryTypes_ChatToTarget.ChatToTarget): Chat_Constants.ToCategoryId | null {
    if (chatToTarget.toCcrRoomId != null) {
        return Chat_Constants.ToCategoryId.CcrRoom;
    } else if (chatToTarget.toMapReviewTarget != null) {
        return Chat_Constants.ToCategoryId.MapReview;
    } else if (chatToTarget.toMcrRoomId != null) {
        return Chat_Constants.ToCategoryId.McrRoom;
    } else if (chatToTarget.toMfrRoomId != null) {
        return Chat_Constants.ToCategoryId.MfrRoom;
    } else if (chatToTarget.toUserId != null) {
        return Chat_Constants.ToCategoryId.Private;
    } else if (chatToTarget.toWarAndTeam != null) {
        return Chat_Constants.ToCategoryId.WarAndTeam;
    } else if (chatToTarget.toWarAndSelf != null) {
        return Chat_Constants.ToCategoryId.WarAndSelf;
    } else if (chatToTarget.toPublicChannel != null) {
        return Chat_Constants.ToCategoryId.PublicChannel;
    } else {
        return null;
    }
}
function getDefaultSelectedToTarget(chatToTarget: AuxiliaryTypes_ChatToTarget.ChatToTarget): number | null {
    return chatToTarget.toCcrRoomId
        ?? chatToTarget.toMapReviewTarget
        ?? chatToTarget.toMcrRoomId
        ?? chatToTarget.toMfrRoomId
        ?? chatToTarget.toUserId
        ?? chatToTarget.toWarAndTeam
        ?? chatToTarget.toWarAndSelf
        ?? chatToTarget.toPublicChannel
        ?? null;
}
function generateChatToTarget(data: DataForTargetRenderer | null): AuxiliaryTypes_ChatToTarget.ChatToTarget {
    if (data == null) {
        return new AuxiliaryTypes_ChatToTarget.ChatToTarget();
    } else {
        const toCategory = data.toCategory;
        if (toCategory === Chat_Constants.ToCategoryId.CcrRoom) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toCcrRoomId : data.toTarget });
        } else if (toCategory === Chat_Constants.ToCategoryId.MapReview) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toMapReviewTarget : data.toTarget });
        } else if (toCategory === Chat_Constants.ToCategoryId.McrRoom) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toMcrRoomId : data.toTarget });
        } else if (toCategory === Chat_Constants.ToCategoryId.MfrRoom) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toMfrRoomId : data.toTarget });
        } else if (toCategory === Chat_Constants.ToCategoryId.Private) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toUserId : data.toTarget });
        } else if (toCategory === Chat_Constants.ToCategoryId.PublicChannel) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toPublicChannel : data.toTarget });
        } else if (toCategory === Chat_Constants.ToCategoryId.WarAndTeam) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toWarAndTeam : data.toTarget });
        } else if (toCategory === Chat_Constants.ToCategoryId.WarAndSelf) {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget({ toWarAndSelf : data.toTarget });
        } else {
            return new AuxiliaryTypes_ChatToTarget.ChatToTarget();
        }
    }
}
