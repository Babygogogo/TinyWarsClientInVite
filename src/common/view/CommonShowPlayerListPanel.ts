import type { PlayerInfo2, Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { Common } from "../../chat/Constants.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoEyeBackground, getCoEye } from "../../helpers/ImageSource.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getPlayerTeamName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId, getUserNickname } from "../../users/Model.ts";

type PlayerInfo     = PlayerInfo2;

export interface OpenData {
    gameConfig      : GameConfig;
    warId           : Undefinable<number>;
    playerInfoArray : PlayerInfo[];
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;

    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateOnOpenDataChanged(): Promise<void> {
        const dataArray     = this._generateDataForListPlayer();
        const dataCount     = dataArray.length;
        const listHeight    = getValueInRange({
            minValue    : 80,
            maxValue    : Dimension.DesignMinHeight - 80,
            rawValue    : dataCount * 40 + (dataCount - 1) * 6,
        });
        this._group.setUnscaledManualHeight(listHeight + 80);

        const list = this._listPlayer;
        list.setUnscaledManualHeight(listHeight);
        await list.bindData(dataArray);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0229));
    }

    private _generateDataForListPlayer(): DataForPlayerRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const gameConfig    = openData.gameConfig;
        const warId         = openData.warId;
        const dataArray     : DataForPlayerRenderer[] = [];
        for (const playerInfo of openData.playerInfoArray) {
            dataArray.push({
                gameConfig  : gameConfig,
                warId       : warId,
                playerInfo  : playerInfo,
            });
        }

        return dataArray;
    }
}

interface DataForPlayerRenderer extends UiListItemData {
    gameConfig  : GameConfig;
    warId       : Undefinable<number>;
    playerInfo  : PlayerInfo;
}
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!          : IUiContainer;
    private readonly _imgForce!         : IUiImage;
    private readonly _imgCo!            : IUiImage;

    private readonly _groupPlayer!      : IUiContainer;
    private readonly _layoutTeam!       : IUiLayout;
    private readonly _labelPlayerIndex! : IUiLabel;
    private readonly _labelTeam!        : IUiLabel;
    private readonly _layoutName!       : IUiLayout;
    private readonly _labelUserId!      : IUiLabel;
    private readonly _labelName!        : IUiLabel;

    private readonly _btnChat!          : IUiButton;
    private readonly _btnRelation!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,        callback: this._onTouchedGroupCo, },
            { ui: this._groupPlayer,    callback: this._onTouchedGroupPlayer, },
            { ui: this._btnChat,        callback: this._onTouchedBtnChat, },
            { ui: this._btnRelation,    callback: this._onTouchedBtnRelation },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo    = openData.playerInfo;
        const playerIndex   = playerInfo.playerIndex;
        this._imgForce.loadSource(getCoEyeBackground(playerInfo.skinId));
        this._imgCo.loadSource(getCoEye(openData.gameConfig, playerInfo.coId, playerInfo.isAlive) ?? ``);

        {
            const layoutTeam = this._layoutTeam;
            layoutTeam.removeAllItems(false);

            const labelPlayerIndex = this._labelPlayerIndex;
            labelPlayerIndex.setText(`P${playerIndex}`);
            layoutTeam.addItem(labelPlayerIndex, false);

            const teamIndex = playerInfo.teamIndex;
            const labelTeam = this._labelTeam;
            if (teamIndex != null) {
                labelTeam.setText(getPlayerTeamName(teamIndex) ?? ``);
                layoutTeam.addItem(labelTeam, false);
            }

            layoutTeam.arrangeItems();
        }

        const userId        = playerInfo.userId;
        const selfUserId    = getSelfUserId();
        this._groupPlayer.setMouseStyle(userId == null ? MouseStyleType.Default : MouseStyleType.Pointer);
        this._btnChat.setIsVisible((userId != null) && ((openData.warId != null) || (userId !== selfUserId)));
        this._btnRelation.setIsVisible((userId != null) && (userId !== selfUserId));
        this._labelUserId.setText(`#${userId ?? `----`}`);
        this._labelName.setText(userId == null ? getText(TextType.B0607) : await getUserNickname(userId) ?? UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonCoInfoPanel, {
            gameConfig  : openData.gameConfig,
            coId        : openData.playerInfo.coId,
        });
    }

    private _onTouchedGroupPlayer(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId = openData.playerInfo.userId;
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId: userId });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedBtnChat(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo    = openData.playerInfo;
        const playerIndex   = playerInfo.playerIndex;
        const userId        = playerInfo.userId;
        if (userId == null) {
            return;
        }

        if (userId !== getSelfUserId()) {
            openPanel(getDict().ChatPanel, {
                toTarget    : new ChatToTarget({
                    toUserId    : userId,
                }),
            });
        } else {
            const warId = openData.warId;
            if (warId != null) {
                openPanel(getDict().ChatPanel, {
                    toTarget    : new ChatToTarget({
                        toWarAndSelf    : warId * Common.TeamDivider + playerIndex,
                    }),
                });
            }
        }
    }

    private _onTouchedBtnRelation(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId = openData.playerInfo.userId;
        if (userId != null) {
            openPanel(getDict().UserSetRelationPanel, { userId: userId });
        }
    }
}
