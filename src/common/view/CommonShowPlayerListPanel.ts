import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as ChatConstants from "../../chat/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";

type PlayerInfo     = AuxiliaryTypesAuxiliaryTypes.PlayerInfo2;

export interface OpenData {
    gameConfig      : GameConfigGcData.GcData;
    warId           : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    playerInfoArray : PlayerInfo[];
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;

    private readonly _listPlayer!   : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        const listHeight    = NumbersUtils.getValueInRange({
            minValue    : 80,
            maxValue    : StagesConstants.Dimension.DesignMinHeight - 80,
            rawValue    : dataCount * 40 + (dataCount - 1) * 6,
        });
        this._group.setUnscaledManualHeight(listHeight + 80);

        const list = this._listPlayer;
        list.setUnscaledManualHeight(listHeight);
        await list.bindData(dataArray);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0229));
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

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig  : GameConfigGcData.GcData;
    warId       : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    playerInfo  : PlayerInfo;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgForce!         : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!            : UiInterfacesIUiImage.IUiImage;

    private readonly _groupPlayer!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutTeam!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTeam!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelUserId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnChat!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRelation!      : UiInterfacesIUiButton.IUiButton;

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
        this._imgForce.loadSource(HelpersImageSource.getCoEyeBackground(playerInfo.skinId));
        this._imgCo.loadSource(HelpersImageSource.getCoEye(openData.gameConfig, playerInfo.coId, playerInfo.isAlive) ?? ``);

        {
            const layoutTeam = this._layoutTeam;
            layoutTeam.removeAllItems(false);

            const labelPlayerIndex = this._labelPlayerIndex;
            labelPlayerIndex.setText(`P${playerIndex}`);
            layoutTeam.addItem(labelPlayerIndex, false);

            const teamIndex = playerInfo.teamIndex;
            const labelTeam = this._labelTeam;
            if (teamIndex != null) {
                labelTeam.setText(LangUtils.getPlayerTeamName(teamIndex) ?? ``);
                layoutTeam.addItem(labelTeam, false);
            }

            layoutTeam.arrangeItems();
        }

        const userId        = playerInfo.userId;
        const selfUserId    = UsersModel.getSelfUserId();
        this._groupPlayer.setMouseStyle(userId == null ? HelpersPointerInput.MouseStyleType.Default : HelpersPointerInput.MouseStyleType.Pointer);
        this._btnChat.setIsVisible((userId != null) && ((openData.warId != null) || (userId !== selfUserId)));
        this._btnRelation.setIsVisible((userId != null) && (userId !== selfUserId));
        this._labelUserId.setText(`#${userId ?? `----`}`);
        this._labelName.setText(userId == null ? LangUtils.getText(LangConstants.TextType.B0607) : await UsersModel.getUserNickname(userId) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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

        if (userId !== UsersModel.getSelfUserId()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, {
                toTarget    : new AuxiliaryTypesChatToTarget.ChatToTarget({
                    toUserId    : userId,
                }),
            });
        } else {
            const warId = openData.warId;
            if (warId != null) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, {
                    toTarget    : new AuxiliaryTypesChatToTarget.ChatToTarget({
                        toWarAndSelf    : warId * ChatConstants.Common.TeamDivider + playerIndex,
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetRelationPanel, { userId: userId });
        }
    }
}
