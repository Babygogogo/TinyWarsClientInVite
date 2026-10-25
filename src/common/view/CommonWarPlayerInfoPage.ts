import type { PlayerInfo } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { CoId } from "../../cos/Constants.ts";
import { showLang } from "../../FloatText.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { MultiRankedWar } from "../../gameConfig/GcWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoHeadFrame, getCoHead } from "../../helpers/ImageSource.ts";
import { newError } from "../../helpers/Misc.ts";
import { getSuffixForRankIndex } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getPlayerForceName, getPlayerTeamName, getTimeDurationText2 } from "../../lang/Utils.ts";
import { getMrwRankIndex } from "../../leaderboard/model/LeaderboardModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import { getSelfUserId, getUserNickname, getUserPublicInfo, getSelfSettingsIsReplayResultVisible } from "../../users/Model.ts";
import { checkIsDummy } from "../../users/Utils.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export type OpenData = {
    gameConfig              : GcData;
    playersCountUnneutral   : number;
    enterTurnTime           : number | null;
    roomOwnerPlayerIndex    : number | null;
    isReplay                : boolean;
    playerInfoArray         : PlayerInfo[];
    callbackOnAddDummy      : ((playerIndex: number) => void) | null;
    callbackOnChangeDummy   : ((playerIndex: number) => void) | null;
    callbackOnExitRoom      : (() => void) | null;
    callbackOnDeletePlayer  : ((playerIndex: number, forbidReentrance: boolean) => void) | null;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : IUiContainer;
    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        loadSkinByPath(this, "common/CommonWarPlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
        });

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected _doApplyOpenData(): void | Promise<void> {
        this._updateListPlayer();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    private async _updateListPlayer(): Promise<void> {
        const openData      = this.getOpenData();
        const listPlayer    = this._listPlayer;
        if (openData == null) {
            await listPlayer.removeAllItems();
            return;
        }

        const {
            gameConfig,
            callbackOnAddDummy,
            callbackOnChangeDummy,
            callbackOnExitRoom,
            callbackOnDeletePlayer,
            roomOwnerPlayerIndex,
            playersCountUnneutral,
            playerInfoArray,
            enterTurnTime,
            isReplay,
        } = openData;
        const isRoomOwnedBySelf = playerInfoArray.find(v => v.playerIndex === roomOwnerPlayerIndex)?.userId === getSelfUserId();
        const dataArray         : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerInfo = playerInfoArray.find(v => v.playerIndex === playerIndex);
            if (playerInfo == null) {
                throw newError(`CommonWarPlayerInfoPage._updateListPlayer() empty playerInfo.`);
            }

            dataArray.push({
                gameConfig              : gameConfig,
                isRoomOwnedBySelf       : isRoomOwnedBySelf,
                playerInfo              : playerInfo,
                enterTurnTime           : enterTurnTime,
                isReplay                : isReplay,
                callbackOnAddDummy      : callbackOnAddDummy,
                callbackOnChangeDummy   : callbackOnChangeDummy,
                callbackOnExitRoom      : callbackOnExitRoom,
                callbackOnDeletePlayer  : callbackOnDeletePlayer,
            });
        }

        await listPlayer.bindData(dataArray);
    }
}

interface DataForPlayerRenderer extends UiListItemData {
    gameConfig              : GcData;
    isRoomOwnedBySelf       : boolean;
    enterTurnTime           : number | null;
    playerInfo              : PlayerInfo;
    isReplay                : boolean;
    callbackOnAddDummy      : ((playerIndex: number) => void) | null;
    callbackOnChangeDummy   : ((playerIndex: number) => void) | null;
    callbackOnExitRoom      : (() => void) | null;
    callbackOnDeletePlayer  : ((playerIndex: number, forbidReentrance: boolean) => void) | null;
}
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!                  : IUiContainer;
    private readonly _imgSkin!                  : IUiImage;
    private readonly _imgCoHead!                : IUiImage;
    private readonly _labelNickname!            : IUiLabel;
    private readonly _labelCo!                  : IUiLabel;
    private readonly _labelStatus!              : IUiLabel;

    private readonly _layoutInfo!               : IUiLayout;
    private readonly _labelPlayerIndex!         : IUiLabel;
    private readonly _labelTeamIndex!           : IUiLabel;

    private readonly _layoutStd!                : IUiLayout;
    private readonly _labelRankStdTitle!        : IUiLabel;
    private readonly _labelRankStd!             : IUiLabel;

    private readonly _layoutFog!                : IUiLayout;
    private readonly _labelRankFogTitle!        : IUiLabel;
    private readonly _labelRankFog!             : IUiLabel;

    private readonly _groupRestTimeToBoot!      : IUiLayout;
    private readonly _labelRestTimeToBootTitle! : IUiLabel;
    private readonly _labelRestTimeToBoot!      : IUiLabel;

    private readonly _groupButton!              : IUiLayout;
    private readonly _btnChat!                  : IUiButton;
    private readonly _btnInfo!                  : IUiButton;
    private readonly _btnDelete!                : IUiButton;
    private readonly _btnAddDummy!              : IUiButton;
    private readonly _btnChangeDummy!           : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,        callback: this._onTouchedGroupCo },
            { ui: this._btnChat,        callback: this._onTouchedBtnChat },
            { ui: this._btnInfo,        callback: this._onTouchedBtnInfo },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
            { ui: this._btnAddDummy,    callback: this._onTouchedBtnAddDummy },
            { ui: this._btnChangeDummy, callback: this._onTouchedBtnChangeDummy },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: TypeId.TimeTick,                                    callback: this._onNotifyTimeTick },
            { type: TypeId.UserSettingsIsReplayResultVisibleChanged,    callback: this._onNotifyUserSettingsIsReplayResultVisibleChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const coId  = openData.playerInfo.coId;
        if ((coId != null) && (coId !== CoId.Empty)) {
            openPanel(getDict().CommonCoInfoPanel, {
                gameConfig  : openData.gameConfig,
                coId,
            });
        }
    }

    private _onTouchedBtnChat(): void {
        const userId = this.getOpenData()?.playerInfo.userId;
        if (userId != null) {
            openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({ toUserId: userId }) });
        }
    }

    private _onTouchedBtnInfo(): void {
        const userId = this.getOpenData()?.playerInfo.userId;
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId });
        }
    }

    private async _onTouchedBtnDelete(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo    = openData.playerInfo;
        const userId        = playerInfo.userId;
        if (userId == null) {
            return;
        }

        if (userId === getSelfUserId()) {
            const callback = openData.callbackOnExitRoom;
            if (callback) {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent : () => getText(TextType.A0126),
                    callback,
                });
            }

        } else {
            const callback = openData.callbackOnDeletePlayer;
            if ((callback) && (openData.isRoomOwnedBySelf)) {
                openPanel(getDict().CommonDeletePlayerPanel, {
                    content : getFormattedText(TextType.F0029, await getUserNickname(userId)),
                    callback: (forbidReentrance: boolean) => {
                        callback(playerInfo.playerIndex, forbidReentrance);
                    },
                });
            }
        }
    }

    private _onTouchedBtnAddDummy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = openData.callbackOnAddDummy;
        if (callback == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        callback(openData.playerInfo.playerIndex);
    }

    private _onTouchedBtnChangeDummy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = openData.callbackOnChangeDummy;
        if (callback == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        callback(openData.playerInfo.playerIndex);
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTimeTick(): void {
        this._updateGroupRestTimeToBoot();
    }
    private _onNotifyUserSettingsIsReplayResultVisibleChanged(): void {
        this._updateLabelStatus();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForInfo();
    }

    private _updateComponentsForLanguage(): void {
        this._labelRankStdTitle.setLangText(TextType.B0546);
        this._labelRankFogTitle.setLangText(TextType.B0547);
        this._labelRestTimeToBootTitle.setLangText(TextType.B0188);
        this._btnAddDummy.setText(`A.I.`);
        this._btnChangeDummy.setLangText(TextType.B0560);

        this._layoutFog.arrangeItems();
        this._layoutStd.arrangeItems();
        this._groupRestTimeToBoot.arrangeItems();
        this._layoutInfo.arrangeItems();
    }

    private async _updateComponentsForInfo(): Promise<void> {
        this._updateLabelStatus();
        this._updateComponentsForRankInfo();
        this._updateGroupRestTimeToBoot();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo    = openData.playerInfo;
        const playerIndex   = playerInfo.playerIndex;
        this._labelPlayerIndex.setText(getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(getPlayerTeamName(playerInfo.teamIndex) || UndefinedError);
        this._imgSkin.loadSource(getCoHeadFrame(playerInfo.unitAndTileSkinId));

        const coId      = playerInfo.coId;
        const labelCo   = this._labelCo;
        const imgCoHead = this._imgCoHead;
        if (coId == null) {
            labelCo.setText(`??`);
            imgCoHead.loadSource(``);
        } else {
            const gameConfig    = openData.gameConfig;
            const coCfg         = gameConfig.getCoBasicCfg(coId);
            labelCo.setText(coCfg?.getName() ?? UndefinedError);
            imgCoHead.loadSource(getCoHead(gameConfig, coId) ?? UndefinedError);
        }

        const userId        = playerInfo.userId;
        const userInfo      = userId == null ? null : await getUserPublicInfo(userId);
        const labelNickname = this._labelNickname;
        if (userInfo) {
            labelNickname.setText(userInfo.getNickname() || UndefinedError);
        } else {
            labelNickname.setText(playerInfo.isAi ? getText(TextType.B0607) : `??`);
        }

        {
            const groupButton = this._groupButton;
            groupButton.removeAllItems(false);

            const isRoomOwnedBySelf = openData.isRoomOwnedBySelf;
            if (userInfo == null) {
                if ((coId == null)                  &&
                    (isRoomOwnedBySelf)             &&
                    (openData.callbackOnAddDummy)
                ) {
                    groupButton.addItem(this._btnAddDummy, false);
                }

            } else {
                const isDummy = checkIsDummy(userId);
                if ((isDummy)                       &&
                    (isRoomOwnedBySelf)             &&
                    (openData.callbackOnChangeDummy)
                ) {
                    groupButton.addItem(this._btnChangeDummy, false);
                }

                if (!isDummy) {
                    groupButton.addItem(this._btnInfo, false);
                }

                const selfUserId = getSelfUserId();
                if ((!isDummy) && (userId !== selfUserId)) {
                    groupButton.addItem(this._btnChat, false);
                }

                if (((openData.callbackOnExitRoom) && (userId === selfUserId))      ||
                    ((openData.callbackOnDeletePlayer) && (isRoomOwnedBySelf))
                ) {
                    groupButton.addItem(this._btnDelete, false);
                }
            }
            groupButton.arrangeItems();
        }
    }

    private _updateLabelStatus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const label = this._labelStatus;
        if ((openData.isReplay) && (!getSelfSettingsIsReplayResultVisible())) {
            label.setText(``);
            return;
        }

        const playerInfo = openData.playerInfo;
        if (playerInfo.isReady) {
            label.setText(getText(TextType.B0402));
        } else if (playerInfo.isInTurn) {
            label.setText(getText(TextType.B0086));
        } else if (playerInfo.isDefeat != null) {
            label.setText(getText(playerInfo.isDefeat ? TextType.B0472 : TextType.B0471));
        } else {
            // TODO
            label.setText(``);
        }
    }

    private async _updateComponentsForRankInfo(): Promise<void> {
        const userId        = this.getOpenData()?.playerInfo.userId;
        const labelRankStd  = this._labelRankStd;
        const labelRankFog  = this._labelRankFog;
        if (userId == null) {
            labelRankStd.setText(`??`);
            labelRankFog.setText(`??`);
            return;
        }

        const rankScoreArray    = (await getUserPublicInfo(userId))?.getUserMrwRankInfoArray();
        const stdRankInfo       = rankScoreArray?.find(v => v.getWarType() === WarTypeId.MrwStd);
        const fogRankInfo       = rankScoreArray?.find(v => v.getWarType() === WarTypeId.MrwFog);
        const stdRankIndex      = await getMrwRankIndex(WarTypeId.MrwStd, userId);
        const fogRankIndex      = await getMrwRankIndex(WarTypeId.MrwFog, userId);
        labelRankStd.setText(stdRankInfo
            ? `${stdRankInfo?.getCurrentScore() ?? MultiRankedWar.InitialScore} (${stdRankIndex == null ? `--` : `${stdRankIndex}${getSuffixForRankIndex(stdRankIndex)}`})`
            : `${MultiRankedWar.InitialScore} (--)`
        );
        labelRankFog.setText(fogRankInfo
            ? `${fogRankInfo?.getCurrentScore() ?? MultiRankedWar.InitialScore} (${fogRankIndex == null ? `--` : `${fogRankIndex}${getSuffixForRankIndex(fogRankIndex)}`})`
            : `${MultiRankedWar.InitialScore} (--)`
        );

        this._layoutStd.arrangeItems();
        this._layoutFog.arrangeItems();
        this._layoutInfo.arrangeItems();
    }

    private _updateGroupRestTimeToBoot(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo        = openData.playerInfo;
        const restTimeToBoot    = playerInfo.restTimeToBoot;
        const enterTurnTime     = openData.enterTurnTime;
        const restTime          = (restTimeToBoot == null) || (enterTurnTime == null)
            ? null
            : (playerInfo.isInTurn
                ? Math.max(0, restTimeToBoot + enterTurnTime - getServerTimestamp())
                : restTimeToBoot
            );
        const label             = this._labelRestTimeToBoot;
        if (restTime == null) {
            label.setText(`--`);
            label.setTextColor(0xFFFFFF);
        } else {
            label.setText(getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400)
            );
        }

        this._groupRestTimeToBoot.arrangeItems();
        this._layoutInfo.arrangeItems();
    }
}
