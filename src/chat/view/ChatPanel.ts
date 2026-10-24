import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as ChatConstants from "../Constants.ts";
import * as ChatModel from "../Model.ts";
import * as ChatProxy from "../Proxy.ts";
import * as CoopCustomRoomModelCcrModel from "../../coopCustomRoom/model/CcrModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as KeyboardKbTypes from "../../keyboard/KbTypes.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiCustomRoomModelMcrModel from "../../multiCustomRoom/model/McrModel.ts";
import * as MultiFreeRoomModelMfrModel from "../../multiFreeRoom/model/MfrModel.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoChatChatMessage from "../../proto/schema/CommonProto/Chat/ChatMessage.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatAddMessageS from "../../proto/schema/CommonProto/NetMessage/MsgChatAddMessage/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatDeleteMessageS from "../../proto/schema/CommonProto/NetMessage/MsgChatDeleteMessage/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatUpdateReadProgressS from "../../proto/schema/CommonProto/NetMessage/MsgChatUpdateReadProgress/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

let _preferredChatToTarget          = new AuxiliaryTypesChatToTarget.ChatToTarget();
const _preferredChatToTargetDict    = new Map<ChatConstants.MainCategoryId, AuxiliaryTypesChatToTarget.ChatToTarget>();

export interface OpenData {
    toTarget    : AuxiliaryTypesChatToTarget.ChatToTarget;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnRefresh!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _listMainCategory! : UiInterfacesIUiScrollList.IUiScrollList<DataForMainCategoryRenderer>;

    private readonly _groupContent!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelNoContent!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listTarget!       : UiInterfacesIUiScrollList.IUiScrollList<DataForTargetRenderer>;

    private readonly _groupMessage!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelNoMessage!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listMessage!      : UiInterfacesIUiScrollList.IUiScrollList<DataForMessageRenderer>;

    private readonly _groupInput!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _inputMessage!     : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnSend!          : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgChatAddMessage,       callback: this._onNotifyMsgChatAddMessage },
            { type: NotificationsTypeId.TypeId.MsgChatDeleteMessage,    callback: this._onNotifyMsgChatDeleteMessage },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllMessages,   callback: this._onNotifyMsgChatGetAllMessages },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnRefresh,     callback: this._onTouchedBtnRefresh },
            { ui: this._btnSend,        callback: this._onTouchedBtnSend },
        ]);
        this._setKeyboardListener({
            callback    : this._onKeyboard,
            thisObject  : this,
            priority    : 2,
        });
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMainCategory.setItemRendererClass(MainCategoryRenderer);
        this._listTarget.setItemRendererClass(TargetRenderer);
        this._listMessage.setItemRendererClass(MessageRenderer);
        this._inputMessage.setInputMaxLength(ChatConstants.Common.MaxMessageLength);

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

    public async updateOnSelectMainCategory(mainCategory: ChatConstants.MainCategoryId): Promise<void> {
        const listMainCategory = this._listMainCategory;
        listMainCategory.setSelectedItemIndex(HelpersMisc.getExisted(listMainCategory.getRevisedFirstIndex(v => v?.mainCategory === mainCategory)));

        await this._updateGroupContent();

        const chatToTarget = _preferredChatToTargetDict.get(mainCategory) ?? new AuxiliaryTypesChatToTarget.ChatToTarget();
        this.updateOnSelectToTarget(getDefaultSelectedToCategory(chatToTarget), getDefaultSelectedToTarget(chatToTarget));
    }
    public updateOnSelectToTarget(toCategory: ChatConstants.ToCategoryId | null, toTarget: number | null): void {
        const listTarget        = this._listTarget;
        const newSelectedIndex  = listTarget.getRevisedFirstIndex(v => {
            if ((toCategory != null) && (toTarget != null)) {
                return (v?.toCategory === toCategory) && (v.toTarget === toTarget);
            } else {
                if (v?.toCategory !== ChatConstants.ToCategoryId.PublicChannel) {
                    return true;
                } else {
                    return v.toTarget === (toTarget ?? (LangUtils.getCurrentLanguageType() === LangConstants.LanguageType.Chinese ? ChatConstants.PublicChannelId.PublicCn : ChatConstants.PublicChannelId.PublicEn));
                }
            }
        }) ?? -1;
        listTarget.setSelectedItemIndex(newSelectedIndex);
        this._updateComponentsForMessage(true);

        {
            const targetData = listTarget.getFirstSelectedData();
            if (targetData != null) {
                const selectedToCategory    = targetData.toCategory;
                const selectedToTarget      = targetData.toTarget;
                if (ChatModel.checkHasUnreadMessageForTarget(selectedToCategory, selectedToTarget)) {
                    ChatProxy.reqUpdateReadProgress(
                        selectedToCategory,
                        selectedToTarget,
                        ChatModel.getLatestMessageTimestamp(selectedToCategory, selectedToTarget)
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

    private async _onNotifyMsgChatAddMessage(e: VendorEgretEgret.Event): Promise<void> {
        const message       = HelpersMisc.getExisted((e.data as ProtoSchemaCommonProtoNetMessageMsgChatAddMessageS.S).getMessage());
        const msgFromUserId = HelpersMisc.getExisted(message.getFromUserId());
        const selfUserId    = HelpersMisc.getExisted(UsersModel.getSelfUserId());
        if (msgFromUserId === selfUserId) {
            this._inputMessage.setInputText(``);
        }

        const msgToCategory     = HelpersMisc.getExisted(message.getToCategory()) as ChatConstants.ToCategoryId;
        const rawMsgToTarget    = HelpersMisc.getExisted(message.getToTarget());
        if (!checkIsMessageInMainCategory({
            mainCategory    : HelpersMisc.getExisted(this._listMainCategory.getFirstSelectedData()?.mainCategory),
            toCategory      : msgToCategory,
            toTarget        : rawMsgToTarget,
            fromUserId      : msgFromUserId,
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

    private async _onNotifyMsgChatDeleteMessage(e: VendorEgretEgret.Event): Promise<void> {
        const messageId = (e.data as ProtoSchemaCommonProtoNetMessageMsgChatDeleteMessageS.S).getMessageId();
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
        const currTime  = TimerTimerModel.getServerTimestamp();
        const cdTime    = ChatModel.getTimestampForNextReqAllMessages() - currTime;
        if (cdTime > 0) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0026, cdTime));
        } else {
            ChatModel.setTimestampForNextReqAllMessages(currTime + 30);
            ChatProxy.reqGetAllMessages();
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0870),
        });
    }

    private _onTouchedBtnSend(): void {
        const content = (this._inputMessage.getInputText() ?? ``).trim();
        if (content) {
            if (content.length > ChatConstants.Common.MaxMessageLength) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.B0375));
            } else {
                const data = this._listTarget.getFirstSelectedData();
                if (data != null) {
                    ChatProxy.reqChatAddMessage(content, data.toCategory, data.toTarget);
                }
            }
        }
    }

    private _onKeyboard(data: KeyboardKbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys = data.newKeys;
        const allKeys = data.allKeys;
        if ((newKeys.has(KeyboardKbTypes.KeyCode.Enter)) && (!allKeys.has(KeyboardKbTypes.KeyCode.Shift))) {
            this._onTouchedBtnSend();

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.Escape)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this.closePanel();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0383));
        this._labelNoContent.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._labelNoMessage.setText(LangUtils.getText(LangConstants.TextType.B0381));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));
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
        for (const message of ChatModel.getMessagesForCategory(chatData.toCategory).get(chatData.toTarget) || []) {
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
                    mainCategory    : ChatConstants.MainCategoryId.PublicChannel,
                    panel           : this,
                },
                {
                    mainCategory    : ChatConstants.MainCategoryId.War,
                    panel           : this,
                },
                {
                    mainCategory    : ChatConstants.MainCategoryId.Room,
                    panel           : this,
                },
                {
                    mainCategory    : ChatConstants.MainCategoryId.Following,
                    panel           : this,
                },
                {
                    mainCategory    : ChatConstants.MainCategoryId.Stranger,
                    panel           : this,
                },
                {
                    mainCategory    : ChatConstants.MainCategoryId.MapReview,
                    panel           : this,
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
        const selfUserId    = UsersModel.getSelfUserId();
        const timestampList : { index: number, timestamp: number }[] = [];
        const mainCategory  = HelpersMisc.getExisted(this._listMainCategory.getFirstSelectedData()?.mainCategory);
        let indexForSort    = 0;
        if (mainCategory === ChatConstants.MainCategoryId.PublicChannel) {
            for (const [toChannelId, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.PublicChannel)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatConstants.ToCategoryId.PublicChannel,
                    toTarget    : toChannelId,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.PublicChannel, toTarget: ChatConstants.PublicChannelId.PublicCn})) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatConstants.ToCategoryId.PublicChannel,
                    toTarget    : ChatConstants.PublicChannelId.PublicCn,
                });
                timestampList.push(getLatestTimestamp(indexForSort, null));
                ++indexForSort;
            }
            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.PublicChannel, toTarget: ChatConstants.PublicChannelId.PublicEn})) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatConstants.ToCategoryId.PublicChannel,
                    toTarget    : ChatConstants.PublicChannelId.PublicEn,
                });
                timestampList.push(getLatestTimestamp(indexForSort, null));
                ++indexForSort;
            }

        } else if (mainCategory === ChatConstants.MainCategoryId.War) {
            for (const [toWarAndTeam, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.WarAndTeam)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatConstants.ToCategoryId.WarAndTeam,
                    toTarget    : toWarAndTeam,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toWarAndSelf, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.WarAndSelf)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatConstants.ToCategoryId.WarAndSelf,
                    toTarget    : toWarAndSelf,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            if (selfUserId != null) {
                const handlerForWarAndTeam = async (warIdArray: Undefinable<number[]>) => {
                    for (const warId of warIdArray ?? []) {
                        const warProgressInfo = await MultiPlayerWarModelMpwModel.getWarProgressInfo(warId);
                        if ((warProgressInfo != null) && (!warProgressInfo.getIsEnded())) {
                            const toWarAndTeam1 = warId * ChatConstants.Common.TeamDivider;
                            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.WarAndTeam, toTarget: toWarAndTeam1 })) {
                                dataDict.set(indexForSort, {
                                    index       : indexForSort,
                                    panel       : this,
                                    toCategory  : ChatConstants.ToCategoryId.WarAndTeam,
                                    toTarget    : toWarAndTeam1,
                                });
                                timestampList.push(getLatestTimestamp(indexForSort, null));
                                ++indexForSort;
                            }

                            const selfPlayerInfo    = (await MultiPlayerWarModelMpwModel.getWarSettings(warId))?.getPlayerInfoArray().find(v => (v.getUserId() ?? 0) == selfUserId);
                            const toWarAndTeam2     = toWarAndTeam1 + (selfPlayerInfo?.getTeamIndex() ?? 0);
                            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.WarAndTeam, toTarget: toWarAndTeam2 })) {
                                dataDict.set(indexForSort, {
                                    index       : indexForSort,
                                    panel       : this,
                                    toCategory  : ChatConstants.ToCategoryId.WarAndTeam,
                                    toTarget    : toWarAndTeam2,
                                });
                                timestampList.push(getLatestTimestamp(indexForSort, null));
                                ++indexForSort;
                            }

                            {
                                const toWarAndSelf = warId * ChatConstants.Common.TeamDivider + (selfPlayerInfo?.getPlayerIndex() ?? 0);
                                if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.WarAndSelf, toTarget: toWarAndSelf })) {
                                    dataDict.set(indexForSort, {
                                        index       : indexForSort,
                                        panel       : this,
                                        toCategory  : ChatConstants.ToCategoryId.WarAndSelf,
                                        toTarget    : toWarAndSelf,
                                    });
                                    timestampList.push(getLatestTimestamp(indexForSort, null));
                                    ++indexForSort;
                                }
                            }
                        }
                    }
                };
                await Promise.all([
                    handlerForWarAndTeam(await MultiPlayerWarModelMpwModel.getJoinedMpwIdArray()),
                ]);
            }

        } else if (mainCategory === ChatConstants.MainCategoryId.Room) {
            for (const [toRoomId, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.McrRoom)) {
                if (await MultiCustomRoomModelMcrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.McrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.CcrRoom)) {
                if (await CoopCustomRoomModelCcrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.CcrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.MfrRoom)) {
                if (await MultiFreeRoomModelMfrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.MfrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            {
                for (const roomId of await MultiCustomRoomModelMcrModel.getJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.McrRoom, toTarget: roomId })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ChatConstants.ToCategoryId.McrRoom,
                            toTarget    : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }
            {
                for (const roomId of await CoopCustomRoomModelCcrModel.getJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.CcrRoom, toTarget: roomId })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ChatConstants.ToCategoryId.CcrRoom,
                            toTarget    : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }
            {
                for (const roomId of await MultiFreeRoomModelMfrModel.getJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.MfrRoom, toTarget: roomId })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ChatConstants.ToCategoryId.MfrRoom,
                            toTarget    : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }

        } else if (mainCategory === ChatConstants.MainCategoryId.MapReview) {
            for (const [toMapReviewTarget, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.MapReview)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatConstants.ToCategoryId.MapReview,
                    toTarget    : toMapReviewTarget,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            {
                const toMapReviewTarget = chatToTarget.toMapReviewTarget;
                if ((toMapReviewTarget != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.MapReview, toTarget: toMapReviewTarget }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.MapReview,
                        toTarget    : toMapReviewTarget,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            {
                const toMapReviewTarget = UsersModel.getSelfUserId();
                if ((toMapReviewTarget != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.MapReview, toTarget: toMapReviewTarget }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.MapReview,
                        toTarget    : toMapReviewTarget,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else if (mainCategory === ChatConstants.MainCategoryId.Following) {
            for (const [toUserId, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.Private)) {
                if ((UsersModel.checkIsFollowingUser(toUserId)) &&
                    (!UsersModel.checkIsBlockingUser(toUserId))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            for (const toUserId of UsersModel.getSelfInfo()?.getUserRelationInfo()?.getFollowingUserIdArray() ?? []) {
                if ((!UsersModel.checkIsBlockingUser(toUserId))                                                                             &&
                    (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.Private, toTarget: toUserId }))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else if (mainCategory === ChatConstants.MainCategoryId.Stranger) {
            for (const [toUserId, msgList] of ChatModel.getMessagesForCategory(ChatConstants.ToCategoryId.Private)) {
                if ((!UsersModel.checkIsFollowingUser(toUserId))    &&
                    (!UsersModel.checkIsBlockingUser(toUserId))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            {
                const toUserId = chatToTarget.toUserId;
                if ((toUserId != null)                                                                                                          &&
                    (!UsersModel.checkIsFollowingUser(toUserId))                                                                            &&
                    (!UsersModel.checkIsBlockingUser(toUserId))                                                                             &&
                    (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatConstants.ToCategoryId.Private, toTarget: toUserId }))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatConstants.ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else {
            throw HelpersMisc.newError(`Invalid mainCategory: ${mainCategory}`);
        }

        const dataList  : DataForTargetRenderer[] = [];
        let index       = 0;
        for (const v of timestampList.sort((a, b) => b.timestamp - a.timestamp)) {
            const data = HelpersMisc.getExisted(dataDict.get(v.index));
            data.index = index;
            dataList.push(data);
            ++index;
        }

        return dataList;
    }
}

function getLatestTimestamp(index: number, msgList: ProtoSchemaCommonProtoChatChatMessage.ChatMessage[] | null): { index: number, timestamp: number } {
    let timestamp = 0;
    for (const msg of msgList || []) {
        timestamp = Math.max(timestamp, HelpersMisc.getExisted(msg.getTimestamp()));
    }
    return {
        index,
        timestamp,
    };
}
function checkHasDataForChatCategoryAndTarget({ dict, toTarget, toCategory }: {
    dict        : Map<number, DataForTargetRenderer>;
    toTarget    : number;
    toCategory  : ChatConstants.ToCategoryId
}): boolean {
    for (const [, data] of dict) {
        if ((data.toCategory === toCategory) && (data.toTarget === toTarget)) {
            return true;
        }
    }
    return false;
}

interface DataForMainCategoryRenderer extends UiTypesUiListItemData.UiListItemData {
    mainCategory    : ChatConstants.MainCategoryId;
    panel           : Panel;
}
class MainCategoryRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMainCategoryRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForMainCategoryRenderer>
{
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgRed!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.MsgChatGetAllMessages,            callback: this._onMsgChatGetAllMessages },
            { type: NotificationsTypeId.TypeId.MsgChatAddMessage,                callback: this._onMsgChatAddMessage },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllReadProgressList,    callback: this._onMsgChatGetAllReadProgressList },
            { type: NotificationsTypeId.TypeId.MsgChatUpdateReadProgress,        callback: this._onMsgChatUpdateReadProgress },
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
    private _onMsgChatAddMessage(e: VendorEgretEgret.Event): void {
        const mainCategory = this.getOpenData()?.mainCategory;
        if (mainCategory == null) {
            return;
        }

        const data          = e.data as ProtoSchemaCommonProtoNetMessageMsgChatAddMessageS.S;
        const message       = HelpersMisc.getExisted(data.getMessage());
        const toCategory    = HelpersMisc.getExisted(message.getToCategory()) as ChatConstants.ToCategoryId;
        if (mainCategory === ChatConstants.MainCategoryId.PublicChannel) {
            if (toCategory === ChatConstants.ToCategoryId.PublicChannel) {
                this._updateImgRed();
            }
        } else if (mainCategory === ChatConstants.MainCategoryId.Room) {
            if ((toCategory === ChatConstants.ToCategoryId.CcrRoom) || (toCategory === ChatConstants.ToCategoryId.McrRoom) || (toCategory === ChatConstants.ToCategoryId.MfrRoom)) {
                this._updateImgRed();
            }
        } else if (mainCategory === ChatConstants.MainCategoryId.War) {
            if (toCategory === ChatConstants.ToCategoryId.WarAndTeam) {
                this._updateImgRed();
            }
        } else if (mainCategory === ChatConstants.MainCategoryId.Following) {
            if (toCategory === ChatConstants.ToCategoryId.Private) {
                if ((UsersModel.checkIsFollowingUser(message.getFromUserId())) || (UsersModel.checkIsFollowingUser(message.getToTarget()))) {
                    this._updateImgRed();
                }
            }
        } else if (mainCategory === ChatConstants.MainCategoryId.Stranger) {
            if (toCategory === ChatConstants.ToCategoryId.Private) {
                if ((!UsersModel.checkIsFollowingUser(message.getFromUserId())) && (!UsersModel.checkIsFollowingUser(message.getToTarget()))) {
                    this._updateImgRed();
                }
            }
        } else if (mainCategory === ChatConstants.MainCategoryId.MapReview) {
            if (toCategory === ChatConstants.ToCategoryId.MapReview) {
                this._updateImgRed();
            }
        } else {
            throw HelpersMisc.newError(`Invalid mainCategory: ${mainCategory}`);
        }
    }
    private _onMsgChatGetAllReadProgressList(): void {
        this._updateImgRed();
    }
    private _onMsgChatUpdateReadProgress(e: VendorEgretEgret.Event): void {
        const mainCategory = this.getOpenData()?.mainCategory;
        if (mainCategory == null) {
            return;
        }

        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgChatUpdateReadProgressS.S;
        const progress  = HelpersMisc.getExisted(data.getProgress());
        if (checkIsMessageInMainCategory({
            mainCategory    : mainCategory,
            toCategory      : HelpersMisc.getExisted(progress.getToCategory()),
            toTarget        : HelpersMisc.getExisted(progress.getToTarget()),
            fromUserId      : UsersModel.getSelfUserId(),
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
        if (category === ChatConstants.MainCategoryId.PublicChannel) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0376));

        } else if (category === ChatConstants.MainCategoryId.War) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0719));

        } else if (category === ChatConstants.MainCategoryId.Room) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0405));

        } else if (category === ChatConstants.MainCategoryId.Following) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0997));

        } else if (category === ChatConstants.MainCategoryId.Stranger) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0998));

        } else if (category === ChatConstants.MainCategoryId.MapReview) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0892));

        } else {
            labelType.setText(LangConstants.UndefinedError);
        }
    }

    private _updateImgRed(): void {
        const openData = this.getOpenData();
        this._imgRed.setIsVisible(openData == null ? false : ChatModel.checkHasUnreadMessageForMainCategory(openData.mainCategory));
    }
}

interface DataForTargetRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    panel       : Panel;
    toCategory  : ChatConstants.ToCategoryId;
    toTarget    : number;
}
class TargetRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTargetRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForTargetRenderer>
{
    private readonly _layoutContent!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutType!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelType!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgOnlineState!   : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgRed!           : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.MsgChatGetAllMessages,            callback: this._onMsgChatGetAllMessages },
            { type: NotificationsTypeId.TypeId.MsgChatAddMessage,                callback: this._onMsgChatAddMessage },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllReadProgressList,    callback: this._onMsgChatGetAllReadProgressList },
            { type: NotificationsTypeId.TypeId.MsgChatUpdateReadProgress,        callback: this._onMsgChatUpdateReadProgress },
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

        if (toCategory === ChatConstants.ToCategoryId.PublicChannel) {
            const languageType  = toTarget === ChatConstants.PublicChannelId.PublicCn
                ? LangConstants.LanguageType.Chinese
                : (toTarget === ChatConstants.PublicChannelId.PublicEn
                    ? LangConstants.LanguageType.English
                    : LangUtils.getCurrentLanguageType()
                );
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0376, languageType));
            labelName.setText(LangUtils.getChatChannelName(toTarget, languageType) ?? LangConstants.UndefinedError);
            imgOnlineState.setIsVisible(false);

        } else if (toCategory === ChatConstants.ToCategoryId.WarAndTeam) {
            const divider           = ChatConstants.Common.TeamDivider;
            const teamIndex         = toTarget % divider;
            const warId             = Math.floor(toTarget / divider);
            const warType           = await MultiPlayerWarModelMpwModel.getWarType(warId);
            const war               = HelpersGameFlow.getOngoingWar();
            imgOnlineState.setIsVisible(false);

            if (war?.getWarId() !== warId) {
                labelType.setText(`${warType == null ? LangConstants.UndefinedError : LangUtils.getWarTypeName(warType) ?? LangConstants.UndefinedError} #${warId}`);
                labelName.setText(`${teamIndex === 0 ? LangUtils.getText(LangConstants.TextType.B0379) : LangUtils.getPlayerTeamName(teamIndex)}`);
            } else {
                labelType.setText(`${LangUtils.getText(LangConstants.TextType.B1341)} #${warId}`);
                labelType.setTextColor(0x00FF00);

                if (teamIndex === 0) {
                    labelName.setText(LangUtils.getText(LangConstants.TextType.B0379));
                } else {
                    if ((war instanceof GameHelpersGhFactory.getMpwWarClass())                                      &&
                        (teamIndex === war.getPlayerManager().getPlayerLoggedIn()?.getTeamIndex())
                    ) {
                        labelName.setText(`${LangUtils.getText(LangConstants.TextType.B1342)} (${LangUtils.getPlayerShortTeamName(teamIndex)})` );
                        labelName.setTextColor(0x00FF00);
                    } else {
                        labelName.setText(LangUtils.getPlayerTeamName(teamIndex) ?? LangConstants.UndefinedError);
                    }
                }
            }

        } else if (toCategory === ChatConstants.ToCategoryId.WarAndSelf) {
            const warId             = Math.floor(toTarget / ChatConstants.Common.TeamDivider);
            const warType           = await MultiPlayerWarModelMpwModel.getWarType(warId);
            imgOnlineState.setIsVisible(false);
            labelName.setText(LangUtils.getText(LangConstants.TextType.B1367) ?? LangConstants.UndefinedError);
            labelName.setTextColor(0x00FF00);

            if (HelpersGameFlow.getOngoingWar()?.getWarId() !== warId) {
                labelType.setText(`${warType == null ? LangConstants.UndefinedError : LangUtils.getWarTypeName(warType) ?? LangConstants.UndefinedError} #${warId}`);
            } else {
                labelType.setText(`${LangUtils.getText(LangConstants.TextType.B1341)} #${warId}`);
                labelType.setTextColor(0x00FF00);
            }

        } else if (toCategory === ChatConstants.ToCategoryId.Private) {
            labelType.setText(LangUtils.getText(LangConstants.TextType.B0378));
            labelName.setText(``);
            imgOnlineState.setIsVisible(true);
            imgOnlineState.loadSource(HelpersImageSource.getUserOnlineState(await UsersModel.getUserOnlineState(toTarget)));
            labelName.setText((await UsersModel.getUserNickname(toTarget)) ?? LangConstants.UndefinedError);

        } else if (toCategory === ChatConstants.ToCategoryId.McrRoom) {
            const hasFog = (await MultiCustomRoomModelMcrModel.getRoomStaticInfo(toTarget))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${LangUtils.getWarTypeName(hasFog ? WarTypesConstants.WarTypeId.McwFog : WarTypesConstants.WarTypeId.McwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await MultiCustomRoomModelMcrModel.getRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                const settingsForMcw    = HelpersMisc.getExisted(roomInfo.getSettingsForMcw());
                const warName           = settingsForMcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    labelName.setText(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError);
                }
            }

        } else if (toCategory === ChatConstants.ToCategoryId.CcrRoom) {
            const hasFog = (await CoopCustomRoomModelCcrModel.getRoomStaticInfo(toTarget))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${LangUtils.getWarTypeName(hasFog ? WarTypesConstants.WarTypeId.CcwFog : WarTypesConstants.WarTypeId.CcwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await CoopCustomRoomModelCcrModel.getRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                const settingsForCcw    = HelpersMisc.getExisted(roomInfo.getSettingsForCcw());
                const warName           = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    labelName.setText(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId() ?? 0) ?? LangConstants.UndefinedError);
                }
            }

        } else if (toCategory === ChatConstants.ToCategoryId.MfrRoom) {
            const hasFog = (await MultiFreeRoomModelMfrModel.getRoomStaticInfo(toTarget))?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${LangUtils.getWarTypeName(hasFog ? WarTypesConstants.WarTypeId.MfwFog : WarTypesConstants.WarTypeId.MfwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await MultiFreeRoomModelMfrModel.getRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                labelName.setText(roomInfo.getSettingsForMfw()?.getWarName() ?? LangUtils.getText(LangConstants.TextType.B0555));
            }

        } else if (toCategory === ChatConstants.ToCategoryId.MapReview) {
            labelType.setText(`${LangUtils.getText(LangConstants.TextType.B0892)}`);
            labelName.setText((await UsersModel.getUserBriefInfo(toTarget))?.getNickname() ?? LangConstants.UndefinedError);
            imgOnlineState.setIsVisible(false);

        } else {
            throw HelpersMisc.newError(`Invalid data.`);
        }

        this._layoutType.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateImgRed(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgRed.setIsVisible(ChatModel.checkHasUnreadMessageForTarget(openData.toCategory, openData.toTarget));
    }
}

interface DataForMessageRenderer extends UiTypesUiListItemData.UiListItemData {
    message: ProtoSchemaCommonProtoChatChatMessage.ChatMessage;
}
class MessageRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMessageRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForMessageRenderer>
{
    private readonly _imgAvatar!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgOnlineState!   : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMedal!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTime!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelContent!     : UiInterfacesIUiLabel.IUiLabel;

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
        if (UsersModel.checkIsBlockingUser(HelpersMisc.getExisted(message.getFromUserId()))) {
            labelContent.setText(`(${LangUtils.getText(LangConstants.TextType.B1301)})`);
            labelContent.setTextColor(0xAAAAAA);
        } else {
            labelContent.setText((message.getContent() ?? LangConstants.UndefinedError));
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
        const fromUserId    = HelpersMisc.getExisted(message.getFromUserId());
        this._labelName.setTextColor(fromUserId === UsersModel.getSelfUserId() ? 0x00FF00 : 0xFFFFFF);
        this._labelTime.setText(LangUtils.getTimestampShortText(HelpersMisc.getExisted(message.getTimestamp())));
        this._imgMedal.loadSource(``);

        const userInfo = HelpersMisc.getExisted(await UsersModel.getUserPublicInfo(fromUserId));
        if (openData === this.getOpenData()) {
            this._imgAvatar.loadSource(HelpersImageSource.getUserAvatar(userInfo.getAvatarId() ?? 1));
            this._labelName.setText(`${userInfo.getNickname() || `???`}`);

            const medalId = userInfo.getShowMedalIdArray()[0];
            this._imgMedal.loadSource(medalId == null ? `` : HelpersImageSource.getMedal(medalId));
        }
        this._layoutName.arrangeItems();

        this._imgOnlineState.loadSource(HelpersImageSource.getUserOnlineState(await UsersModel.getUserOnlineState(fromUserId)));
    }

    public async onItemTapEvent(): Promise<void> {
        const message = this.getOpenData()?.message;
        if (message == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatCommandPanel, {
            messageId   : HelpersMisc.getExisted(message.getMessageId()),
            userId      : message.getFromUserId(),
        });
    }
}

function checkIsMessageInMainCategory({ mainCategory, toCategory, toTarget, fromUserId }: {
    mainCategory    : ChatConstants.MainCategoryId;
    toCategory      : ChatConstants.ToCategoryId;
    toTarget        : number;
    fromUserId      : Undefinable<number>;
}): boolean {
    if (mainCategory === ChatConstants.MainCategoryId.PublicChannel) {
        return toCategory === ChatConstants.ToCategoryId.PublicChannel;

    } else if (mainCategory === ChatConstants.MainCategoryId.Room) {
        return (toCategory === ChatConstants.ToCategoryId.CcrRoom) || (toCategory === ChatConstants.ToCategoryId.McrRoom) || (toCategory === ChatConstants.ToCategoryId.MfrRoom);

    } else if (mainCategory === ChatConstants.MainCategoryId.War) {
        return (toCategory === ChatConstants.ToCategoryId.WarAndTeam) || (toCategory === ChatConstants.ToCategoryId.WarAndSelf);

    } else if (mainCategory === ChatConstants.MainCategoryId.Following) {
        return (toCategory === ChatConstants.ToCategoryId.Private)
            && ((UsersModel.checkIsFollowingUser(toTarget)) || (UsersModel.checkIsFollowingUser(fromUserId)));

    } else if (mainCategory === ChatConstants.MainCategoryId.Stranger) {
        return (toCategory === ChatConstants.ToCategoryId.Private)
            && (!UsersModel.checkIsFollowingUser(toTarget))
            && (!UsersModel.checkIsFollowingUser(fromUserId));

    } else if (mainCategory === ChatConstants.MainCategoryId.MapReview) {
        return toCategory === ChatConstants.ToCategoryId.MapReview;

    } else {
        throw HelpersMisc.newError(`Invalid mainCategory: ${mainCategory}`);
    }
}

function checkIsEmptyChatToTarget(chatToTarget: AuxiliaryTypesChatToTarget.ChatToTarget): boolean {
    return (chatToTarget.toCcrRoomId == null)
        && (chatToTarget.toMapReviewTarget == null)
        && (chatToTarget.toMcrRoomId == null)
        && (chatToTarget.toMfrRoomId == null)
        && (chatToTarget.toUserId == null)
        && (chatToTarget.toPublicChannel == null)
        && (chatToTarget.toWarAndTeam == null)
        && (chatToTarget.toWarAndSelf == null);
}
function getDefaultSelectedMainCategory(chatToTarget: AuxiliaryTypesChatToTarget.ChatToTarget): ChatConstants.MainCategoryId {
    if (chatToTarget.toCcrRoomId != null) {
        return ChatConstants.MainCategoryId.Room;
    } else if (chatToTarget.toMapReviewTarget != null) {
        return ChatConstants.MainCategoryId.MapReview;
    } else if (chatToTarget.toMcrRoomId != null) {
        return ChatConstants.MainCategoryId.Room;
    } else if (chatToTarget.toMfrRoomId != null) {
        return ChatConstants.MainCategoryId.Room;
    } else if (chatToTarget.toUserId != null) {
        return UsersModel.checkIsFollowingUser(chatToTarget.toUserId) ? ChatConstants.MainCategoryId.Following : ChatConstants.MainCategoryId.Stranger;
    } else if (chatToTarget.toWarAndTeam != null) {
        return ChatConstants.MainCategoryId.War;
    } else if (chatToTarget.toWarAndSelf != null) {
        return ChatConstants.MainCategoryId.War;
    } else if (chatToTarget.toPublicChannel != null) {
        return ChatConstants.MainCategoryId.PublicChannel;
    } else {
        return ChatConstants.MainCategoryId.PublicChannel;
    }
}
function getDefaultSelectedToCategory(chatToTarget: AuxiliaryTypesChatToTarget.ChatToTarget): ChatConstants.ToCategoryId | null {
    if (chatToTarget.toCcrRoomId != null) {
        return ChatConstants.ToCategoryId.CcrRoom;
    } else if (chatToTarget.toMapReviewTarget != null) {
        return ChatConstants.ToCategoryId.MapReview;
    } else if (chatToTarget.toMcrRoomId != null) {
        return ChatConstants.ToCategoryId.McrRoom;
    } else if (chatToTarget.toMfrRoomId != null) {
        return ChatConstants.ToCategoryId.MfrRoom;
    } else if (chatToTarget.toUserId != null) {
        return ChatConstants.ToCategoryId.Private;
    } else if (chatToTarget.toWarAndTeam != null) {
        return ChatConstants.ToCategoryId.WarAndTeam;
    } else if (chatToTarget.toWarAndSelf != null) {
        return ChatConstants.ToCategoryId.WarAndSelf;
    } else if (chatToTarget.toPublicChannel != null) {
        return ChatConstants.ToCategoryId.PublicChannel;
    } else {
        return null;
    }
}
function getDefaultSelectedToTarget(chatToTarget: AuxiliaryTypesChatToTarget.ChatToTarget): number | null {
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
function generateChatToTarget(data: DataForTargetRenderer | null): AuxiliaryTypesChatToTarget.ChatToTarget {
    if (data == null) {
        return new AuxiliaryTypesChatToTarget.ChatToTarget();
    } else {
        const toCategory = data.toCategory;
        if (toCategory === ChatConstants.ToCategoryId.CcrRoom) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toCcrRoomId: data.toTarget });
        } else if (toCategory === ChatConstants.ToCategoryId.MapReview) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toMapReviewTarget: data.toTarget });
        } else if (toCategory === ChatConstants.ToCategoryId.McrRoom) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toMcrRoomId: data.toTarget });
        } else if (toCategory === ChatConstants.ToCategoryId.MfrRoom) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toMfrRoomId: data.toTarget });
        } else if (toCategory === ChatConstants.ToCategoryId.Private) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toUserId: data.toTarget });
        } else if (toCategory === ChatConstants.ToCategoryId.PublicChannel) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toPublicChannel: data.toTarget });
        } else if (toCategory === ChatConstants.ToCategoryId.WarAndTeam) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toWarAndTeam: data.toTarget });
        } else if (toCategory === ChatConstants.ToCategoryId.WarAndSelf) {
            return new AuxiliaryTypesChatToTarget.ChatToTarget({ toWarAndSelf: data.toTarget });
        } else {
            return new AuxiliaryTypesChatToTarget.ChatToTarget();
        }
    }
}
