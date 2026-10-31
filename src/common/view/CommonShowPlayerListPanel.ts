import {
    AuxiliaryTypes_ChatToTarget,
    Chat_Constants,
    Stages_Constants,
    Helpers_ImageSource,
    GamePanels_Dict,
    Lang_Utils,
    Users_Model,
    Numbers_Utils,
    Helpers_PointerInput,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    warId           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    playerInfoArray : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo2[];
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listPlayer!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
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
        const listHeight    = Numbers_Utils.getValueInRange({
            minValue : 80,
            maxValue : Stages_Constants.Dimension.DesignMinHeight - 80,
            rawValue : dataCount * 40 + (dataCount - 1) * 6,
        });
        this._group.setUnscaledManualHeight(listHeight + 80);

        const list = this._listPlayer;
        list.setUnscaledManualHeight(listHeight);
        await list.bindData(dataArray);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0229);
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
                gameConfig : gameConfig,
                warId      : warId,
                playerInfo : playerInfo,
            });
        }

        return dataArray;
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    warId       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    playerInfo  : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo2;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgForce!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!            : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupPlayer!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutTeam!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTeam!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelUserId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnChat!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRelation!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupCo,        callback : this._onTouchedGroupCo },
            { ui : this._groupPlayer,    callback : this._onTouchedGroupPlayer },
            { ui : this._btnChat,        callback : this._onTouchedBtnChat },
            { ui : this._btnRelation,    callback : this._onTouchedBtnRelation },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerInfo    = openData.playerInfo;
        const playerIndex   = playerInfo.playerIndex;
        this._imgForce.loadSource(Helpers_ImageSource.getCoEyeBackground(playerInfo.skinId));
        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(openData.gameConfig, playerInfo.coId, playerInfo.isAlive) ?? ``);

        {
            const layoutTeam = this._layoutTeam;
            layoutTeam.removeAllItems(false);

            const labelPlayerIndex = this._labelPlayerIndex;
            labelPlayerIndex.setText(`P${playerIndex}`);
            layoutTeam.addItem(labelPlayerIndex, false);

            const teamIndex = playerInfo.teamIndex;
            const labelTeam = this._labelTeam;
            if (teamIndex != null) {
                labelTeam.setText(Lang_Utils.getPlayerTeamName(teamIndex) ?? ``);
                layoutTeam.addItem(labelTeam, false);
            }

            layoutTeam.arrangeItems();
        }

        const userId        = playerInfo.userId;
        const selfUserId    = Users_Model.getSelfUserId();
        this._groupPlayer.setMouseStyle(userId == null ? Helpers_PointerInput.MouseStyleType.Default : Helpers_PointerInput.MouseStyleType.Pointer);
        this._btnChat.setIsVisible((userId != null) && ((openData.warId != null) || (userId !== selfUserId)));
        this._btnRelation.setIsVisible((userId != null) && (userId !== selfUserId));
        this._labelUserId.setText(`#${userId ?? `----`}`);
        this._labelName.setText(userId == null ? Lang_Utils.getText(Lang_Constants.TextType.B0607) : await Users_Model.getUserNickname(userId) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
            gameConfig : openData.gameConfig,
            coId       : openData.playerInfo.coId,
        });
    }

    private _onTouchedGroupPlayer(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId = openData.playerInfo.userId;
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : userId });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
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

        if (userId !== Users_Model.getSelfUserId()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, {
                toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({
                    toUserId : userId,
                }),
            });
        } else {
            const warId = openData.warId;
            if (warId != null) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, {
                    toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({
                        toWarAndSelf : warId * Chat_Constants.Common.TeamDivider + playerIndex,
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetRelationPanel, { userId : userId });
        }
    }
}
