import type { GcData } from "../../gameConfig/GcData.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoEyeBackground, getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getPlayerTeamName } from "../../lang/Utils.ts";
import { getWarSettings, getWarProgressInfo } from "../../multiPlayerWar/model/MpwModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import type { PlayerInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarProgressInfo/PlayerInfo.ts";
import type {
    PlayerInfo as ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettingsPlayerInfo,
} from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings/PlayerInfo.ts";
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
import { getWatchOutgoingInfo } from "../model/WwModel.ts";
import { reqWatchMakeRequest } from "../model/WwProxy.ts";

export interface OpenData {
    warId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;

    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;
    private readonly _btnConfirm!   : IUiButton;

    private _dataForListPlayer  : DataForPlayerRenderer[] | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        if (await getWatchOutgoingInfo(warId) == null) {
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
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getFormattedText(TextType.F0083, userIds.length),
                callback: () => {
                    reqWatchMakeRequest(warId, userIds);
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
        this._group.setUnscaledManualHeight(getValueInRange({
            minValue    : 230,
            maxValue    : Dimension.DesignMinHeight,
            rawValue    : dataCount * 40 + (dataCount - 1) * 6 + 130,
        }));
        await this._listPlayer.bindData(dataArray);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0207));
        this._btnConfirm.setText(getText(TextType.B0026));
    }

    private async _generateDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
        const warId = this.getOpenData()?.warId;
        if (warId == null) {
            return [];
        }

        const outgoingInfo  = await getWatchOutgoingInfo(warId);
        if (outgoingInfo == null) {
            return [];
        }

        const configVersion = (await getWarSettings(warId))?.getSettingsForCommon()?.getConfigVersion();
        if (configVersion == null) {
            return [];
        }

        const gameConfig                = await getGameConfig(configVersion);
        const selfUserId                = getExisted(getSelfUserId());
        const ongoingDstUserIdArray     = outgoingInfo.getOngoingDstUserIdArray();
        const requestDstUserIdArray     = outgoingInfo.getRequestDstUserIdArray();
        const playerStaticInfoArray     = (await getWarSettings(warId))?.getPlayerInfoArray() || [];
        const playerProgressInfoArray   = (await getWarProgressInfo(warId))?.getPlayerInfoList() || [];
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

interface DataForPlayerRenderer extends UiListItemData {
    panel               : Panel;
    gameConfig          : GcData;
    playerStaticInfo    : ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettingsPlayerInfo;
    playerProgressInfo  : PlayerInfo;
    isRequested         : boolean;
    isWatching          : boolean;
    isRequesting        : boolean;
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

    private readonly _labelState!       : IUiLabel;

    private readonly _groupAccept!      : IUiContainer;
    private readonly _imgAccept!        : IUiImage;

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
        this._imgForce.loadSource(unitAndTileSkinId == null ? `` : getCoEyeBackground(unitAndTileSkinId));
        this._imgCo.loadSource(getCoEye(openData.gameConfig, playerStaticInfo.getCoId() ?? 0, isAlive) ?? ``);
        this._labelPlayerIndex.setText(`P${playerStaticInfo.getPlayerIndex()}`);
        this._labelTeam.setText(getPlayerTeamName(playerStaticInfo.getTeamIndex() ?? 0) ?? ``);
        this._layoutTeam.arrangeItems();

        const userId        = playerStaticInfo.getUserId();
        const labelState    = this._labelState;
        const groupAccept   = this._groupAccept;
        if (!playerProgressInfo.getIsAlive()) {
            groupAccept.setIsVisible(false);
            labelState.setIsVisible(true);
            labelState.setText(`${getText(TextType.B0056)}`);
        } else {
            if (userId === getSelfUserId()) {
                groupAccept.setIsVisible(false);
                labelState.setIsVisible(true);
                labelState.setText(`${getText(TextType.B0216)}`);
            } else {
                if (openData.isRequested) {
                    groupAccept.setIsVisible(false);
                    labelState.setIsVisible(true);
                    labelState.setText(`${getText(TextType.B0212)}`);
                } else {
                    if (openData.isWatching) {
                        groupAccept.setIsVisible(false);
                        labelState.setIsVisible(true);
                        labelState.setText(`${getText(TextType.B0213)}`);
                    } else {
                        groupAccept.setIsVisible(true);
                        labelState.setIsVisible(false);
                        this._imgAccept.setIsVisible(openData.isRequesting);
                    }
                }
            }
        }

        this._labelUserId.setText(`#${userId}`);
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
            coId        : openData.playerStaticInfo.getCoId() ?? 0,
        });
    }

    private _onTouchedGroupPlayer(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const userId = this.getOpenData()?.playerStaticInfo.getUserId();
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId: userId });
        }
    }

    private _onTouchedGroupAccept(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (this._groupAccept.getIsVisible()) {
            const playerIndex   = openData.playerStaticInfo.getPlayerIndex();
            (playerIndex != null) && (openData.panel.setPlayerSelected(playerIndex, !openData.isRequesting));
        }
    }
}
