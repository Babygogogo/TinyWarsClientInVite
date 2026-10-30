import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import {
    MainCategoryId,
    Common,
    ToCategoryId,
    PublicChannelId,
} from "../Constants.ts";
import {
    checkHasUnreadMessageForTarget,
    getLatestMessageTimestamp,
    getTimestampForNextReqAllMessages,
    setTimestampForNextReqAllMessages,
    getMessagesForCategory,
    checkHasUnreadMessageForMainCategory,
} from "../Model.ts";
import {
    reqUpdateReadProgress,
    reqGetAllMessages,
    reqChatAddMessage,
} from "../Proxy.ts";
import {
    getRoomStaticInfo as getCcrModelRoomStaticInfo,
    getJoinedRoomIdArray as getCcrModelJoinedRoomIdArray,
} from "../../coopCustomRoom/model/CcrModel.ts";
import { show } from "../../FloatText.ts";
import { getMpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getOngoingWar } from "../../helpers/GameFlow.ts";
import {
    getUserOnlineState as getImageSourceUserOnlineState,
    getUserAvatar,
    getMedal,
} from "../../helpers/ImageSource.ts";
import {
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import {
    type EventData,
    KeyCode,
} from "../../keyboard/KbTypes.ts";
import {
    LanguageType,
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getCurrentLanguageType,
    getFormattedText,
    getText,
    getChatChannelName,
    getWarTypeName,
    getPlayerTeamName,
    getPlayerShortTeamName,
    getTimestampShortText,
} from "../../lang/Utils.ts";
import {
    getRoomStaticInfo as getMcrModelRoomStaticInfo,
    getJoinedRoomIdArray as getMcrModelJoinedRoomIdArray,
} from "../../multiCustomRoom/model/McrModel.ts";
import {
    getRoomStaticInfo as getMfrModelRoomStaticInfo,
    getJoinedRoomIdArray as getMfrModelJoinedRoomIdArray,
} from "../../multiFreeRoom/model/MfrModel.ts";
import {
    getWarProgressInfo,
    getWarSettings,
    getJoinedMpwIdArray,
    getWarType,
} from "../../multiPlayerWar/model/MpwModel.ts";
import { getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { ChatMessage } from "../../proto/schema/CommonProto/Chat/ChatMessage.ts";
import type { S as ChatAddMessageResponse } from "../../proto/schema/CommonProto/NetMessage/MsgChatAddMessage/S.ts";
import type { S as ChatDeleteMessageResponse } from "../../proto/schema/CommonProto/NetMessage/MsgChatDeleteMessage/S.ts";
import type { S as ChatUpdateReadProgressResponse } from "../../proto/schema/CommonProto/NetMessage/MsgChatUpdateReadProgress/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import {
    getSelfUserId,
    checkIsFollowingUser,
    checkIsBlockingUser,
    getSelfInfo,
    getUserOnlineState as getModelUserOnlineState,
    getUserNickname,
    getUserBriefInfo,
    getUserPublicInfo,
} from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

let _preferredChatToTarget          = new ChatToTarget();
const _preferredChatToTargetDict    = new Map<MainCategoryId, ChatToTarget>();

export interface OpenData {
    toTarget    : ChatToTarget;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnRefresh!       : IUiButton;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnClose!         : IUiButton;

    private readonly _listMainCategory! : IUiScrollList<DataForMainCategoryRenderer>;

    private readonly _groupContent!     : IUiContainer;
    private readonly _labelNoContent!   : IUiLabel;

    private readonly _listTarget!       : IUiScrollList<DataForTargetRenderer>;

    private readonly _groupMessage!     : IUiContainer;
    private readonly _labelNoMessage!   : IUiLabel;
    private readonly _listMessage!      : IUiScrollList<DataForMessageRenderer>;

    private readonly _groupInput!       : IUiContainer;
    private readonly _inputMessage!     : IUiPromptedInput;
    private readonly _btnSend!          : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgChatAddMessage,       callback: this._onNotifyMsgChatAddMessage },
            { type: TypeId.MsgChatDeleteMessage,    callback: this._onNotifyMsgChatDeleteMessage },
            { type: TypeId.MsgChatGetAllMessages,   callback: this._onNotifyMsgChatGetAllMessages },
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
        this._inputMessage.setInputMaxLength(Common.MaxMessageLength);

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

    public async updateOnSelectMainCategory(mainCategory: MainCategoryId): Promise<void> {
        const listMainCategory = this._listMainCategory;
        listMainCategory.setSelectedItemIndex(listMainCategory.getRevisedFirstIndex(v => v?.mainCategory === mainCategory));

        await this._updateGroupContent();

        const chatToTarget = _preferredChatToTargetDict.get(mainCategory) ?? new ChatToTarget();
        this.updateOnSelectToTarget(getDefaultSelectedToCategory(chatToTarget), getDefaultSelectedToTarget(chatToTarget));
    }
    public updateOnSelectToTarget(toCategory: ToCategoryId | null, toTarget: number | null): void {
        const listTarget        = this._listTarget;
        const newSelectedIndex  = listTarget.getRevisedFirstIndex(v => {
            if ((toCategory != null) && (toTarget != null)) {
                return (v?.toCategory === toCategory) && (v.toTarget === toTarget);
            } else {
                if (v?.toCategory !== ToCategoryId.PublicChannel) {
                    return true;
                } else {
                    return v.toTarget === (toTarget ?? (getCurrentLanguageType() === LanguageType.Chinese ? PublicChannelId.PublicCn : PublicChannelId.PublicEn));
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
                if (checkHasUnreadMessageForTarget(selectedToCategory, selectedToTarget)) {
                    reqUpdateReadProgress(
                        selectedToCategory,
                        selectedToTarget,
                        getLatestMessageTimestamp(selectedToCategory, selectedToTarget)
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

    private async _onNotifyMsgChatAddMessage(e: Event): Promise<void> {
        const message       = getExisted((e.data as ChatAddMessageResponse).getMessage());
        const msgFromUserId = message.getFromUserId();
        const selfUserId    = getExisted(getSelfUserId());
        if (msgFromUserId === selfUserId) {
            this._inputMessage.setInputText(``);
        }

        const msgToCategory     = message.getToCategory() as ToCategoryId;
        const rawMsgToTarget    = message.getToTarget();
        if (!checkIsMessageInMainCategory({
            mainCategory    : getExisted(this._listMainCategory.getFirstSelectedData()?.mainCategory),
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

    private async _onNotifyMsgChatDeleteMessage(e: Event): Promise<void> {
        const messageId = (e.data as ChatDeleteMessageResponse).getMessageId();
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
        const currTime  = getServerTimestamp();
        const cdTime    = getTimestampForNextReqAllMessages() - currTime;
        if (cdTime > 0) {
            show(getFormattedText(TextType.F0026, cdTime));
        } else {
            setTimestampForNextReqAllMessages(currTime + 30);
            reqGetAllMessages();
        }
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0870),
        });
    }

    private _onTouchedBtnSend(): void {
        const content = (this._inputMessage.getInputText() ?? ``).trim();
        if (content) {
            if (content.length > Common.MaxMessageLength) {
                show(getText(TextType.B0375));
            } else {
                const data = this._listTarget.getFirstSelectedData();
                if (data != null) {
                    reqChatAddMessage(content, data.toCategory, data.toTarget);
                }
            }
        }
    }

    private _onKeyboard(data: EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys = data.newKeys;
        const allKeys = data.allKeys;
        if ((newKeys.has(KeyCode.Enter)) && (!allKeys.has(KeyCode.Shift))) {
            this._onTouchedBtnSend();

        } else if (newKeys.has(KeyCode.Escape)) {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this.closePanel();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0383);
        this._labelNoContent.setLangText(TextType.B0278);
        this._labelNoMessage.setLangText(TextType.B0381);
        this._btnClose.setLangText(TextType.B0146);
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
        for (const message of getMessagesForCategory(chatData.toCategory).get(chatData.toTarget) || []) {
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
                    mainCategory    : MainCategoryId.PublicChannel,
                    panel           : this,
                },
                {
                    mainCategory    : MainCategoryId.War,
                    panel           : this,
                },
                {
                    mainCategory    : MainCategoryId.Room,
                    panel           : this,
                },
                {
                    mainCategory    : MainCategoryId.Following,
                    panel           : this,
                },
                {
                    mainCategory    : MainCategoryId.Stranger,
                    panel           : this,
                },
                {
                    mainCategory    : MainCategoryId.MapReview,
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
        const selfUserId    = getSelfUserId();
        const timestampList : { index: number, timestamp: number }[] = [];
        const mainCategory  = getExisted(this._listMainCategory.getFirstSelectedData()?.mainCategory);
        let indexForSort    = 0;
        if (mainCategory === MainCategoryId.PublicChannel) {
            for (const [toChannelId, msgList] of getMessagesForCategory(ToCategoryId.PublicChannel)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ToCategoryId.PublicChannel,
                    toTarget    : toChannelId,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.PublicChannel, toTarget: PublicChannelId.PublicCn})) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ToCategoryId.PublicChannel,
                    toTarget    : PublicChannelId.PublicCn,
                });
                timestampList.push(getLatestTimestamp(indexForSort, null));
                ++indexForSort;
            }
            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.PublicChannel, toTarget: PublicChannelId.PublicEn})) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ToCategoryId.PublicChannel,
                    toTarget    : PublicChannelId.PublicEn,
                });
                timestampList.push(getLatestTimestamp(indexForSort, null));
                ++indexForSort;
            }

        } else if (mainCategory === MainCategoryId.War) {
            for (const [toWarAndTeam, msgList] of getMessagesForCategory(ToCategoryId.WarAndTeam)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ToCategoryId.WarAndTeam,
                    toTarget    : toWarAndTeam,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toWarAndSelf, msgList] of getMessagesForCategory(ToCategoryId.WarAndSelf)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ToCategoryId.WarAndSelf,
                    toTarget    : toWarAndSelf,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            if (selfUserId != null) {
                const handlerForWarAndTeam = async (warIdArray: Undefinable<number[]>) => {
                    for (const warId of warIdArray ?? []) {
                        const warProgressInfo = await getWarProgressInfo(warId);
                        if ((warProgressInfo != null) && (!warProgressInfo.getIsEnded())) {
                            const toWarAndTeam1 = warId * Common.TeamDivider;
                            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.WarAndTeam, toTarget: toWarAndTeam1 })) {
                                dataDict.set(indexForSort, {
                                    index       : indexForSort,
                                    panel       : this,
                                    toCategory  : ToCategoryId.WarAndTeam,
                                    toTarget    : toWarAndTeam1,
                                });
                                timestampList.push(getLatestTimestamp(indexForSort, null));
                                ++indexForSort;
                            }

                            const selfPlayerInfo    = (await getWarSettings(warId))?.getPlayerInfoArray().find(v => (v.getUserId() ?? 0) == selfUserId);
                            const toWarAndTeam2     = toWarAndTeam1 + (selfPlayerInfo?.getTeamIndex() ?? 0);
                            if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.WarAndTeam, toTarget: toWarAndTeam2 })) {
                                dataDict.set(indexForSort, {
                                    index       : indexForSort,
                                    panel       : this,
                                    toCategory  : ToCategoryId.WarAndTeam,
                                    toTarget    : toWarAndTeam2,
                                });
                                timestampList.push(getLatestTimestamp(indexForSort, null));
                                ++indexForSort;
                            }

                            {
                                const toWarAndSelf = warId * Common.TeamDivider + (selfPlayerInfo?.getPlayerIndex() ?? 0);
                                if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.WarAndSelf, toTarget: toWarAndSelf })) {
                                    dataDict.set(indexForSort, {
                                        index       : indexForSort,
                                        panel       : this,
                                        toCategory  : ToCategoryId.WarAndSelf,
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
                    handlerForWarAndTeam(await getJoinedMpwIdArray()),
                ]);
            }

        } else if (mainCategory === MainCategoryId.Room) {
            for (const [toRoomId, msgList] of getMessagesForCategory(ToCategoryId.McrRoom)) {
                if (await getMcrModelRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.McrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of getMessagesForCategory(ToCategoryId.CcrRoom)) {
                if (await getCcrModelRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.CcrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of getMessagesForCategory(ToCategoryId.MfrRoom)) {
                if (await getMfrModelRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.MfrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            {
                for (const roomId of await getMcrModelJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.McrRoom, toTarget: roomId })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ToCategoryId.McrRoom,
                            toTarget    : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }
            {
                for (const roomId of await getCcrModelJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.CcrRoom, toTarget: roomId })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ToCategoryId.CcrRoom,
                            toTarget    : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }
            {
                for (const roomId of await getMfrModelJoinedRoomIdArray(false) ?? []) {
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.MfrRoom, toTarget: roomId })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ToCategoryId.MfrRoom,
                            toTarget    : roomId,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }

        } else if (mainCategory === MainCategoryId.MapReview) {
            for (const [toMapReviewTarget, msgList] of getMessagesForCategory(ToCategoryId.MapReview)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ToCategoryId.MapReview,
                    toTarget    : toMapReviewTarget,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            {
                const toMapReviewTarget = chatToTarget.toMapReviewTarget;
                if ((toMapReviewTarget != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.MapReview, toTarget: toMapReviewTarget }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.MapReview,
                        toTarget    : toMapReviewTarget,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            {
                const toMapReviewTarget = getSelfUserId();
                if ((toMapReviewTarget != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.MapReview, toTarget: toMapReviewTarget }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.MapReview,
                        toTarget    : toMapReviewTarget,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else if (mainCategory === MainCategoryId.Following) {
            for (const [toUserId, msgList] of getMessagesForCategory(ToCategoryId.Private)) {
                if ((checkIsFollowingUser(toUserId)) &&
                    (!checkIsBlockingUser(toUserId))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            for (const toUserId of getSelfInfo()?.getUserRelationInfo()?.getFollowingUserIdArray() ?? []) {
                if ((!checkIsBlockingUser(toUserId))                                                                             &&
                    (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.Private, toTarget: toUserId }))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else if (mainCategory === MainCategoryId.Stranger) {
            for (const [toUserId, msgList] of getMessagesForCategory(ToCategoryId.Private)) {
                if ((!checkIsFollowingUser(toUserId))    &&
                    (!checkIsBlockingUser(toUserId))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }

            {
                const toUserId = chatToTarget.toUserId;
                if ((toUserId != null)                                                                                                          &&
                    (!checkIsFollowingUser(toUserId))                                                                            &&
                    (!checkIsBlockingUser(toUserId))                                                                             &&
                    (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ToCategoryId.Private, toTarget: toUserId }))
                ) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ToCategoryId.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

        } else {
            throw newError(`Invalid mainCategory: ${mainCategory}`);
        }

        const dataList  : DataForTargetRenderer[] = [];
        let index       = 0;
        for (const v of timestampList.sort((a, b) => b.timestamp - a.timestamp)) {
            const data = getExisted(dataDict.get(v.index));
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
    toCategory  : ToCategoryId
}): boolean {
    for (const [, data] of dict) {
        if ((data.toCategory === toCategory) && (data.toTarget === toTarget)) {
            return true;
        }
    }
    return false;
}

interface DataForMainCategoryRenderer extends UiListItemData {
    mainCategory    : MainCategoryId;
    panel           : Panel;
}
class MainCategoryRenderer
    extends     UiListItemRenderer<DataForMainCategoryRenderer>
    implements  IUiListItemRenderer<DataForMainCategoryRenderer>
{
    private readonly _labelName!    : IUiLabel;
    private readonly _imgRed!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.MsgChatGetAllMessages,            callback: this._onMsgChatGetAllMessages },
            { type: TypeId.MsgChatAddMessage,                callback: this._onMsgChatAddMessage },
            { type: TypeId.MsgChatGetAllReadProgressList,    callback: this._onMsgChatGetAllReadProgressList },
            { type: TypeId.MsgChatUpdateReadProgress,        callback: this._onMsgChatUpdateReadProgress },
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
    private _onMsgChatAddMessage(e: Event): void {
        const mainCategory = this.getOpenData()?.mainCategory;
        if (mainCategory == null) {
            return;
        }

        const data          = e.data as ChatAddMessageResponse;
        const message       = getExisted(data.getMessage());
        const toCategory    = message.getToCategory() as ToCategoryId;
        if (mainCategory === MainCategoryId.PublicChannel) {
            if (toCategory === ToCategoryId.PublicChannel) {
                this._updateImgRed();
            }
        } else if (mainCategory === MainCategoryId.Room) {
            if ((toCategory === ToCategoryId.CcrRoom) || (toCategory === ToCategoryId.McrRoom) || (toCategory === ToCategoryId.MfrRoom)) {
                this._updateImgRed();
            }
        } else if (mainCategory === MainCategoryId.War) {
            if (toCategory === ToCategoryId.WarAndTeam) {
                this._updateImgRed();
            }
        } else if (mainCategory === MainCategoryId.Following) {
            if (toCategory === ToCategoryId.Private) {
                if ((checkIsFollowingUser(message.getFromUserId())) || (checkIsFollowingUser(message.getToTarget()))) {
                    this._updateImgRed();
                }
            }
        } else if (mainCategory === MainCategoryId.Stranger) {
            if (toCategory === ToCategoryId.Private) {
                if ((!checkIsFollowingUser(message.getFromUserId())) && (!checkIsFollowingUser(message.getToTarget()))) {
                    this._updateImgRed();
                }
            }
        } else if (mainCategory === MainCategoryId.MapReview) {
            if (toCategory === ToCategoryId.MapReview) {
                this._updateImgRed();
            }
        } else {
            throw newError(`Invalid mainCategory: ${mainCategory}`);
        }
    }
    private _onMsgChatGetAllReadProgressList(): void {
        this._updateImgRed();
    }
    private _onMsgChatUpdateReadProgress(e: Event): void {
        const mainCategory = this.getOpenData()?.mainCategory;
        if (mainCategory == null) {
            return;
        }

        const data      = e.data as ChatUpdateReadProgressResponse;
        const progress  = getExisted(data.getProgress());
        if (checkIsMessageInMainCategory({
            mainCategory    : mainCategory,
            toCategory      : progress.getToCategory(),
            toTarget        : progress.getToTarget(),
            fromUserId      : getSelfUserId(),
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
        if (category === MainCategoryId.PublicChannel) {
            labelType.setLangText(TextType.B0376);

        } else if (category === MainCategoryId.War) {
            labelType.setLangText(TextType.B0719);

        } else if (category === MainCategoryId.Room) {
            labelType.setLangText(TextType.B0405);

        } else if (category === MainCategoryId.Following) {
            labelType.setLangText(TextType.B0997);

        } else if (category === MainCategoryId.Stranger) {
            labelType.setLangText(TextType.B0998);

        } else if (category === MainCategoryId.MapReview) {
            labelType.setLangText(TextType.B0892);

        } else {
            labelType.setText(UndefinedError);
        }
    }

    private _updateImgRed(): void {
        const openData = this.getOpenData();
        this._imgRed.setIsVisible(openData == null ? false : checkHasUnreadMessageForMainCategory(openData.mainCategory));
    }
}

interface DataForTargetRenderer extends UiListItemData {
    index       : number;
    panel       : Panel;
    toCategory  : ToCategoryId;
    toTarget    : number;
}
class TargetRenderer
    extends     UiListItemRenderer<DataForTargetRenderer>
    implements  IUiListItemRenderer<DataForTargetRenderer>
{
    private readonly _layoutContent!    : IUiLayout;
    private readonly _layoutType!       : IUiLayout;
    private readonly _labelType!        : IUiLabel;
    private readonly _imgOnlineState!   : IUiImage;
    private readonly _labelName!        : IUiLabel;
    private readonly _imgRed!           : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.MsgChatGetAllMessages,            callback: this._onMsgChatGetAllMessages },
            { type: TypeId.MsgChatAddMessage,                callback: this._onMsgChatAddMessage },
            { type: TypeId.MsgChatGetAllReadProgressList,    callback: this._onMsgChatGetAllReadProgressList },
            { type: TypeId.MsgChatUpdateReadProgress,        callback: this._onMsgChatUpdateReadProgress },
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

        if (toCategory === ToCategoryId.PublicChannel) {
            const languageType  = toTarget === PublicChannelId.PublicCn
                ? LanguageType.Chinese
                : (toTarget === PublicChannelId.PublicEn
                    ? LanguageType.English
                    : getCurrentLanguageType()
                );
            labelType.setLangText(TextType.B0376, languageType);
            labelName.setText(getChatChannelName(toTarget, languageType) ?? UndefinedError);
            imgOnlineState.setIsVisible(false);

        } else if (toCategory === ToCategoryId.WarAndTeam) {
            const divider           = Common.TeamDivider;
            const teamIndex         = toTarget % divider;
            const warId             = Math.floor(toTarget / divider);
            const warType           = await getWarType(warId);
            const war               = getOngoingWar();
            imgOnlineState.setIsVisible(false);

            if (war?.getWarId() !== warId) {
                labelType.setText(`${warType == null ? UndefinedError : getWarTypeName(warType) ?? UndefinedError} #${warId}`);
                labelName.setText(`${teamIndex === 0 ? getText(TextType.B0379) : getPlayerTeamName(teamIndex)}`);
            } else {
                labelType.setText(`${getText(TextType.B1341)} #${warId}`);
                labelType.setTextColor(0x00FF00);

                if (teamIndex === 0) {
                    labelName.setLangText(TextType.B0379);
                } else {
                    if ((war instanceof getMpwWarClass())                                      &&
                        (teamIndex === war.getPlayerManager().getPlayerLoggedIn()?.getTeamIndex())
                    ) {
                        labelName.setText(`${getText(TextType.B1342)} (${getPlayerShortTeamName(teamIndex)})` );
                        labelName.setTextColor(0x00FF00);
                    } else {
                        labelName.setText(getPlayerTeamName(teamIndex) ?? UndefinedError);
                    }
                }
            }

        } else if (toCategory === ToCategoryId.WarAndSelf) {
            const warId             = Math.floor(toTarget / Common.TeamDivider);
            const warType           = await getWarType(warId);
            imgOnlineState.setIsVisible(false);
            labelName.setLangText(TextType.B1367);
            labelName.setTextColor(0x00FF00);

            if (getOngoingWar()?.getWarId() !== warId) {
                labelType.setText(`${warType == null ? UndefinedError : getWarTypeName(warType) ?? UndefinedError} #${warId}`);
            } else {
                labelType.setText(`${getText(TextType.B1341)} #${warId}`);
                labelType.setTextColor(0x00FF00);
            }

        } else if (toCategory === ToCategoryId.Private) {
            labelType.setLangText(TextType.B0378);
            labelName.setText(``);
            imgOnlineState.setIsVisible(true);
            imgOnlineState.loadSource(getImageSourceUserOnlineState(await getModelUserOnlineState(toTarget)));
            labelName.setText((await getUserNickname(toTarget)) ?? UndefinedError);

        } else if (toCategory === ToCategoryId.McrRoom) {
            const hasFog = (await getMcrModelRoomStaticInfo(toTarget))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${getWarTypeName(hasFog ? WarTypeId.McwFog : WarTypeId.McwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await getMcrModelRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                const settingsForMcw    = getExisted(roomInfo.getSettingsForMcw());
                const warName           = settingsForMcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    labelName.setText(await getMapNameInCurrentLanguage(settingsForMcw.getNormalMapId()) ?? UndefinedError);
                }
            }

        } else if (toCategory === ToCategoryId.CcrRoom) {
            const hasFog = (await getCcrModelRoomStaticInfo(toTarget))?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${getWarTypeName(hasFog ? WarTypeId.CcwFog : WarTypeId.CcwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await getCcrModelRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                const settingsForCcw    = getExisted(roomInfo.getSettingsForCcw());
                const warName           = settingsForCcw.getWarName();
                if (warName) {
                    labelName.setText(warName);
                } else {
                    labelName.setText(await getMapNameInCurrentLanguage(settingsForCcw.getNormalMapId()) ?? UndefinedError);
                }
            }

        } else if (toCategory === ToCategoryId.MfrRoom) {
            const hasFog = (await getMfrModelRoomStaticInfo(toTarget))?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault();
            labelType.setText(`${getWarTypeName(hasFog ? WarTypeId.MfwFog : WarTypeId.MfwStd)} #${toTarget}`);
            labelName.setText(``);
            imgOnlineState.setIsVisible(false);

            const roomInfo = await getMfrModelRoomStaticInfo(toTarget);
            if (roomInfo == null) {
                labelName.setText(``);
            } else {
                labelName.setText(roomInfo.getSettingsForMfw()?.getWarName() ?? getText(TextType.B0555));
            }

        } else if (toCategory === ToCategoryId.MapReview) {
            labelType.setLangText(TextType.B0892);
            labelName.setText((await getUserBriefInfo(toTarget))?.getNickname() ?? UndefinedError);
            imgOnlineState.setIsVisible(false);

        } else {
            throw newError(`Invalid data.`);
        }

        this._layoutType.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateImgRed(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgRed.setIsVisible(checkHasUnreadMessageForTarget(openData.toCategory, openData.toTarget));
    }
}

interface DataForMessageRenderer extends UiListItemData {
    message: ChatMessage;
}
class MessageRenderer
    extends     UiListItemRenderer<DataForMessageRenderer>
    implements  IUiListItemRenderer<DataForMessageRenderer>
{
    private readonly _imgAvatar!        : IUiImage;
    private readonly _imgOnlineState!   : IUiImage;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelName!        : IUiLabel;
    private readonly _imgMedal!         : IUiImage;
    private readonly _labelTime!        : IUiLabel;

    private readonly _labelContent!     : IUiLabel;

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
        if (checkIsBlockingUser(message.getFromUserId())) {
            labelContent.setText(`(${getText(TextType.B1301)})`);
            labelContent.setTextColor(0xAAAAAA);
        } else {
            labelContent.setText((message.getContent() ?? UndefinedError));
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
        this._labelName.setTextColor(fromUserId === getSelfUserId() ? 0x00FF00 : 0xFFFFFF);
        this._labelTime.setText(getTimestampShortText(message.getTimestamp()));
        this._imgMedal.loadSource(``);

        const userInfo = getExisted(await getUserPublicInfo(fromUserId));
        if (openData === this.getOpenData()) {
            this._imgAvatar.loadSource(getUserAvatar(userInfo.getAvatarId() ?? 1));
            this._labelName.setText(`${userInfo.getNickname() || `???`}`);

            const medalId = userInfo.getShowMedalIdArray()[0];
            this._imgMedal.loadSource(medalId == null ? `` : getMedal(medalId));
        }
        this._layoutName.arrangeItems();

        this._imgOnlineState.loadSource(getImageSourceUserOnlineState(await getModelUserOnlineState(fromUserId)));
    }

    public async onItemTapEvent(): Promise<void> {
        const message = this.getOpenData()?.message;
        if (message == null) {
            return;
        }

        openPanel(getDict().ChatCommandPanel, {
            messageId   : message.getMessageId(),
            userId      : message.getFromUserId(),
        });
    }
}

function checkIsMessageInMainCategory({ mainCategory, toCategory, toTarget, fromUserId }: {
    mainCategory    : MainCategoryId;
    toCategory      : ToCategoryId;
    toTarget        : number;
    fromUserId      : Undefinable<number>;
}): boolean {
    if (mainCategory === MainCategoryId.PublicChannel) {
        return toCategory === ToCategoryId.PublicChannel;

    } else if (mainCategory === MainCategoryId.Room) {
        return (toCategory === ToCategoryId.CcrRoom) || (toCategory === ToCategoryId.McrRoom) || (toCategory === ToCategoryId.MfrRoom);

    } else if (mainCategory === MainCategoryId.War) {
        return (toCategory === ToCategoryId.WarAndTeam) || (toCategory === ToCategoryId.WarAndSelf);

    } else if (mainCategory === MainCategoryId.Following) {
        return (toCategory === ToCategoryId.Private)
            && ((checkIsFollowingUser(toTarget)) || (checkIsFollowingUser(fromUserId)));

    } else if (mainCategory === MainCategoryId.Stranger) {
        return (toCategory === ToCategoryId.Private)
            && (!checkIsFollowingUser(toTarget))
            && (!checkIsFollowingUser(fromUserId));

    } else if (mainCategory === MainCategoryId.MapReview) {
        return toCategory === ToCategoryId.MapReview;

    } else {
        throw newError(`Invalid mainCategory: ${mainCategory}`);
    }
}

function checkIsEmptyChatToTarget(chatToTarget: ChatToTarget): boolean {
    return (chatToTarget.toCcrRoomId == null)
        && (chatToTarget.toMapReviewTarget == null)
        && (chatToTarget.toMcrRoomId == null)
        && (chatToTarget.toMfrRoomId == null)
        && (chatToTarget.toUserId == null)
        && (chatToTarget.toPublicChannel == null)
        && (chatToTarget.toWarAndTeam == null)
        && (chatToTarget.toWarAndSelf == null);
}
function getDefaultSelectedMainCategory(chatToTarget: ChatToTarget): MainCategoryId {
    if (chatToTarget.toCcrRoomId != null) {
        return MainCategoryId.Room;
    } else if (chatToTarget.toMapReviewTarget != null) {
        return MainCategoryId.MapReview;
    } else if (chatToTarget.toMcrRoomId != null) {
        return MainCategoryId.Room;
    } else if (chatToTarget.toMfrRoomId != null) {
        return MainCategoryId.Room;
    } else if (chatToTarget.toUserId != null) {
        return checkIsFollowingUser(chatToTarget.toUserId) ? MainCategoryId.Following : MainCategoryId.Stranger;
    } else if (chatToTarget.toWarAndTeam != null) {
        return MainCategoryId.War;
    } else if (chatToTarget.toWarAndSelf != null) {
        return MainCategoryId.War;
    } else if (chatToTarget.toPublicChannel != null) {
        return MainCategoryId.PublicChannel;
    } else {
        return MainCategoryId.PublicChannel;
    }
}
function getDefaultSelectedToCategory(chatToTarget: ChatToTarget): ToCategoryId | null {
    if (chatToTarget.toCcrRoomId != null) {
        return ToCategoryId.CcrRoom;
    } else if (chatToTarget.toMapReviewTarget != null) {
        return ToCategoryId.MapReview;
    } else if (chatToTarget.toMcrRoomId != null) {
        return ToCategoryId.McrRoom;
    } else if (chatToTarget.toMfrRoomId != null) {
        return ToCategoryId.MfrRoom;
    } else if (chatToTarget.toUserId != null) {
        return ToCategoryId.Private;
    } else if (chatToTarget.toWarAndTeam != null) {
        return ToCategoryId.WarAndTeam;
    } else if (chatToTarget.toWarAndSelf != null) {
        return ToCategoryId.WarAndSelf;
    } else if (chatToTarget.toPublicChannel != null) {
        return ToCategoryId.PublicChannel;
    } else {
        return null;
    }
}
function getDefaultSelectedToTarget(chatToTarget: ChatToTarget): number | null {
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
function generateChatToTarget(data: DataForTargetRenderer | null): ChatToTarget {
    if (data == null) {
        return new ChatToTarget();
    } else {
        const toCategory = data.toCategory;
        if (toCategory === ToCategoryId.CcrRoom) {
            return new ChatToTarget({ toCcrRoomId: data.toTarget });
        } else if (toCategory === ToCategoryId.MapReview) {
            return new ChatToTarget({ toMapReviewTarget: data.toTarget });
        } else if (toCategory === ToCategoryId.McrRoom) {
            return new ChatToTarget({ toMcrRoomId: data.toTarget });
        } else if (toCategory === ToCategoryId.MfrRoom) {
            return new ChatToTarget({ toMfrRoomId: data.toTarget });
        } else if (toCategory === ToCategoryId.Private) {
            return new ChatToTarget({ toUserId: data.toTarget });
        } else if (toCategory === ToCategoryId.PublicChannel) {
            return new ChatToTarget({ toPublicChannel: data.toTarget });
        } else if (toCategory === ToCategoryId.WarAndTeam) {
            return new ChatToTarget({ toWarAndTeam: data.toTarget });
        } else if (toCategory === ToCategoryId.WarAndSelf) {
            return new ChatToTarget({ toWarAndSelf: data.toTarget });
        } else {
            return new ChatToTarget();
        }
    }
}
