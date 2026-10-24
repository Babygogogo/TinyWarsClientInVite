import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarProgressInfoPlayerInfo from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarProgressInfo/PlayerInfo.ts";
import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettingsPlayerInfo from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings/PlayerInfo.ts";
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
import * as WatchWarModelWwModel from "../model/WwModel.ts";
import * as WatchWarModelWwProxy from "../model/WwProxy.ts";

export interface OpenData {
    warId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;

    private readonly _listPlayer!   : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;
    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;

    private _dataForListPlayer  : DataForPlayerRenderer[] | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
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
        if (await WatchWarModelWwModel.getWatchOutgoingInfo(warId) == null) {
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0083, userIds.length),
                callback: () => {
                    WatchWarModelWwProxy.reqWatchMakeRequest(warId, userIds);
                    this.closePanel();
                }
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
        this._group.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            minValue    : 230,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
            rawValue    : dataCount * 40 + (dataCount - 1) * 6 + 130,
        }));
        await this._listPlayer.bindData(dataArray);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0207));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
    }

    private async _generateDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return [];
        }

        const outgoingInfo  = await WatchWarModelWwModel.getWatchOutgoingInfo(warId);
        if (outgoingInfo == null) {
            return [];
        }

        const configVersion = (await MultiPlayerWarModelMpwModel.getWarSettings(warId))?.getSettingsForCommon()?.getConfigVersion();
        if (configVersion == null) {
            return [];
        }

        const gameConfig                = await GameConfigGcModel.getGameConfig(configVersion);
        const selfUserId                = HelpersMisc.getExisted(UsersModel.getSelfUserId());
        const ongoingDstUserIdArray     = outgoingInfo.getOngoingDstUserIdArray();
        const requestDstUserIdArray     = outgoingInfo.getRequestDstUserIdArray();
        const playerStaticInfoArray     = (await MultiPlayerWarModelMpwModel.getWarSettings(warId))?.getPlayerInfoArray() || [];
        const playerProgressInfoArray   = (await MultiPlayerWarModelMpwModel.getWarProgressInfo(warId))?.getPlayerInfoList() || [];
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
                panel               : this,
                gameConfig          : gameConfig,
                playerStaticInfo    : playerStaticInfo,
                playerProgressInfo  : playerProgressInfo,
                isRequested         : isRequested,
                isWatching          : isWatching,
                isRequesting        : (!isRequested) && (!isWatching) && (userId !== selfUserId) && (!!playerProgressInfo.getIsAlive()),
            });
        }

        return dataList;
    }
}

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    panel               : Panel;
    gameConfig          : GameConfigGcData.GcData;
    playerStaticInfo    : ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettingsPlayerInfo.PlayerInfo;
    playerProgressInfo  : ProtoSchemaCommonProtoMultiPlayerWarMpwWarProgressInfoPlayerInfo.PlayerInfo;
    isRequested         : boolean;
    isWatching          : boolean;
    isRequesting        : boolean;
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

    private readonly _labelState!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupAccept!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgAccept!        : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,        callback: this._onTouchedGroupCo, },
            { ui: this._groupPlayer,    callback: this._onTouchedGroupPlayer, },
            { ui: this._groupAccept,    callback: this._onTouchedGroupAccept, },
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
        this._imgForce.loadSource(unitAndTileSkinId == null ? `` : HelpersImageSource.getCoEyeBackground(unitAndTileSkinId));
        this._imgCo.loadSource(HelpersImageSource.getCoEye(openData.gameConfig, playerStaticInfo.getCoId() ?? 0, isAlive) ?? ``);
        this._labelPlayerIndex.setText(`P${playerStaticInfo.getPlayerIndex()}`);
        this._labelTeam.setText(LangUtils.getPlayerTeamName(playerStaticInfo.getTeamIndex() ?? 0) ?? ``);
        this._layoutTeam.arrangeItems();

        const userId        = playerStaticInfo.getUserId();
        const labelState    = this._labelState;
        const groupAccept   = this._groupAccept;
        if (!playerProgressInfo.getIsAlive()) {
            groupAccept.setIsVisible(false);
            labelState.setIsVisible(true);
            labelState.setText(`${LangUtils.getText(LangConstants.TextType.B0056)}`);
        } else {
            if (userId === UsersModel.getSelfUserId()) {
                groupAccept.setIsVisible(false);
                labelState.setIsVisible(true);
                labelState.setText(`${LangUtils.getText(LangConstants.TextType.B0216)}`);
            } else {
                if (openData.isRequested) {
                    groupAccept.setIsVisible(false);
                    labelState.setIsVisible(true);
                    labelState.setText(`${LangUtils.getText(LangConstants.TextType.B0212)}`);
                } else {
                    if (openData.isWatching) {
                        groupAccept.setIsVisible(false);
                        labelState.setIsVisible(true);
                        labelState.setText(`${LangUtils.getText(LangConstants.TextType.B0213)}`);
                    } else {
                        groupAccept.setIsVisible(true);
                        labelState.setIsVisible(false);
                        this._imgAccept.setIsVisible(openData.isRequesting);
                    }
                }
            }
        }

        this._labelUserId.setText(`#${userId}`);
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
            coId        : openData.playerStaticInfo.getCoId() ?? 0,
        });
    }

    private _onTouchedGroupPlayer(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const userId = this.getOpenData()?.playerStaticInfo.getUserId();
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
        }
    }

    private _onTouchedGroupAccept(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (this._groupAccept.getIsVisible()) {
            const playerIndex   = openData.playerStaticInfo.getPlayerIndex();
            (playerIndex != null) && (openData.panel.setPlayerSelected(playerIndex, !openData.isRequesting));
        }
    }
}
