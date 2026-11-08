import {
    Stages_Constants,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    Users_Model,
    Numbers_Utils,
    MultiPlayerWar_Model_MpwModel,
    WatchWar_Model_WwModel,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    WatchWar_Model_WwProxy,
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
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { PlayerInfo as ProtoPlayerInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarProgressInfo/PlayerInfo.ts";
import type { PlayerInfo as MpwWarSettingsPlayerInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings/PlayerInfo.ts";

export interface OpenData {
    warId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listPlayer!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;
    private readonly _btnConfirm!   : Ui_Interfaces_IUiButton.IUiButton;

    private _dataForListPlayer  : DataForPlayerRenderer[] | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._dataForListPlayer = await this._generateDataForListPlayer();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    public setPlayerSelected(playerIndex: number, selected: boolean): void {
        const dataList = this._dataForListPlayer;
        if (dataList) {
            const index         = dataList.findIndex(value => value.playerStaticInfo.getPlayerIndex() === playerIndex);
            const data          = dataList[index];
            data.isRequesting   = selected;
            this._listPlayer.updateSingleData(index, data);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return;
        }
        if (await WatchWar_Model_WwModel.getWatchOutgoingInfo(warId) == null) {
            this.closePanel();
            return;
        }

        const userIds: number[] = [];
        for (const data of this._dataForListPlayer || []) {
            if (data.isRequesting) {
                const userId = data.playerStaticInfo.getUserId();
                (userId != null) && (userIds.push(userId));
            }
        }
        if (userIds.length <= 0) {
            this.closePanel();
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0083, userIds.length),
                callback   : () => {
                    WatchWar_Model_WwProxy.reqWatchMakeRequest(warId, userIds);
                    this.closePanel();
                },
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const dataArray = this._dataForListPlayer ?? [];
        const dataCount = dataArray.length;
        this._group.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            minValue : 230,
            maxValue : Stages_Constants.Dimension.DesignMinHeight,
            rawValue : dataCount * 40 + (dataCount - 1) * 6 + 130,
        }));
        await this._listPlayer.bindData(dataArray);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0207);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
    }

    private async _generateDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return [];
        }

        const outgoingInfo  = await WatchWar_Model_WwModel.getWatchOutgoingInfo(warId);
        if (outgoingInfo == null) {
            return [];
        }

        const configVersion = (await MultiPlayerWar_Model_MpwModel.getWarSettings(warId))?.getSettingsForCommon()?.getConfigVersion();
        if (configVersion == null) {
            return [];
        }

        const gameConfig                = await GameConfigs_Provider.getGameConfig(configVersion);
        const selfUserId                = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
        const ongoingDstUserIdArray     = outgoingInfo.getOngoingDstUserIdArray();
        const requestDstUserIdArray     = outgoingInfo.getRequestDstUserIdArray();
        const playerStaticInfoArray     = (await MultiPlayerWar_Model_MpwModel.getWarSettings(warId))?.getPlayerInfoArray() || [];
        const playerProgressInfoArray   = (await MultiPlayerWar_Model_MpwModel.getWarProgressInfo(warId))?.getPlayerInfoList() || [];
        const dataList                  : DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playerStaticInfoArray.length; ++playerIndex) {
            const playerStaticInfo = playerStaticInfoArray.find(v => v.getPlayerIndex() === playerIndex);
            if (playerStaticInfo == null) {
                continue;
            }

            const playerProgressInfo = playerProgressInfoArray.find(v => v.getPlayerIndex() === playerIndex);
            if (playerProgressInfo == null) {
                continue;
            }

            const userId = playerStaticInfo.getUserId();
            if (userId == null) {
                continue;
            }

            const isRequested   = requestDstUserIdArray.indexOf(userId) >= 0;
            const isWatching    = ongoingDstUserIdArray.indexOf(userId) >= 0;
            dataList.push({
                panel              : this,
                gameConfig         : gameConfig,
                playerStaticInfo   : playerStaticInfo,
                playerProgressInfo : playerProgressInfo,
                isRequested        : isRequested,
                isWatching         : isWatching,
                isRequesting       : (!isRequested) && (!isWatching) && (userId !== selfUserId) && (!!playerProgressInfo.getIsAlive()),
            });
        }

        return dataList;
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    panel               : Panel;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    playerStaticInfo    : MpwWarSettingsPlayerInfo;
    playerProgressInfo  : ProtoPlayerInfo;
    isRequested         : boolean;
    isWatching          : boolean;
    isRequesting        : boolean;
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

    private readonly _labelState!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupAccept!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgAccept!        : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupCo,        callback : this._onTouchedGroupCo },
            { ui : this._groupPlayer,    callback : this._onTouchedGroupPlayer },
            { ui : this._groupAccept,    callback : this._onTouchedGroupAccept },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerStaticInfo      = openData.playerStaticInfo;
        const playerProgressInfo    = openData.playerProgressInfo;
        const unitAndTileSkinId     = playerStaticInfo.getUnitAndTileSkinId();
        const isAlive               = !!playerProgressInfo.getIsAlive();
        this._imgForce.loadSource(unitAndTileSkinId == null ? `` : Helpers_ImageSource.getCoEyeBackground(unitAndTileSkinId));
        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(openData.gameConfig, playerStaticInfo.getCoId() ?? 0, isAlive) ?? ``);
        this._labelPlayerIndex.setText(`P${playerStaticInfo.getPlayerIndex()}`);
        this._labelTeam.setText(Lang_Utils.getPlayerTeamName(playerStaticInfo.getTeamIndex() ?? 0) ?? ``);
        this._layoutTeam.arrangeItems();

        const userId        = playerStaticInfo.getUserId();
        const labelState    = this._labelState;
        const groupAccept   = this._groupAccept;
        if (!playerProgressInfo.getIsAlive()) {
            groupAccept.setIsVisible(false);
            labelState.setIsVisible(true);
            labelState.setLangText(Lang_Constants.TextType.B0056);
        } else {
            if (userId === Users_Model.getSelfUserId()) {
                groupAccept.setIsVisible(false);
                labelState.setIsVisible(true);
                labelState.setLangText(Lang_Constants.TextType.B0216);
            } else {
                if (openData.isRequested) {
                    groupAccept.setIsVisible(false);
                    labelState.setIsVisible(true);
                    labelState.setLangText(Lang_Constants.TextType.B0212);
                } else {
                    if (openData.isWatching) {
                        groupAccept.setIsVisible(false);
                        labelState.setIsVisible(true);
                        labelState.setLangText(Lang_Constants.TextType.B0213);
                    } else {
                        groupAccept.setIsVisible(true);
                        labelState.setIsVisible(false);
                        this._imgAccept.setIsVisible(openData.isRequesting);
                    }
                }
            }
        }

        this._labelUserId.setText(`#${userId}`);
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
            coId       : openData.playerStaticInfo.getCoId() ?? 0,
        });
    }

    private _onTouchedGroupPlayer(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const userId = this.getOpenData()?.playerStaticInfo.getUserId();
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : userId });
        }
    }

    private _onTouchedGroupAccept(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (this._groupAccept.getIsVisible()) {
            const playerIndex   = openData.playerStaticInfo.getPlayerIndex();
            (playerIndex != null) && (openData.panel.setPlayerSelected(playerIndex, !openData.isRequesting));
        }
    }
}
