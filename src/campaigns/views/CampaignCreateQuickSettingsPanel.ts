import { reqCampaignCreateWar } from "../mains/Gateway.ts";
import { getCampaignMapRawData } from "../mains/Provider.ts";
import {
    getLatestConfigVersion,
    getLatestGameConfig,
} from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    closePanel,
    openPanel,
} from "../../gamePanels/Manager.ts";
import { gotoSinglePlayerWar } from "../../helpers/GameFlow.ts";
import {
    getCoHeadFrame,
    getCoHead,
} from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getPlayerForceName,
    getPlayerTeamName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { PlayerCoInfo } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/PlayerCoInfo.ts";
import type { S as CampaignCreateWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { getAvailableSlotIndex } from "../../singlePlayerMode/model/SpmModel.ts";
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
import { getSelfCawHighScoreInfo } from "../../users/Model.ts";
import type { Event } from "../../egret/Egret.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";

export interface OpenData {
    campaignId      : number;
    campaignMapId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _layoutHighScore!      : IUiLayout;
    private readonly _labelHighScoreTitle!  : IUiLabel;
    private readonly _labelHighScore!       : IUiLabel;

    private readonly _btnStart!             : IUiButton;

    private readonly _listPlayer!           : IUiScrollList<DataForPlayerRenderer>;

    private _playerCoDict   = new Map<number, number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCampaignCreateWar,        callback: this._onNotifyMsgCampaignCreateWar },
            { type: TypeId.MsgCampaignCreateWarFailed,  callback: this._onNotifyMsgCampaignCreateWarFailed },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnStart,           callback: this._onTouchedBtnStart },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        await this._initPlayerCoDict();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectCo(playerIndex: number, coId: number): void {
        this._playerCoDict.set(playerIndex, coId);
        this._updateListPlayer();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCampaignCreateWar(e: Event): void {
        this.closePanel();
        closePanel(getDict().CommonBlockPanel);

        const data = e.data as CampaignCreateWarResponse;
        gotoSinglePlayerWar({
            slotIndex       : getExisted(data.getSlotIndex()),
            slotExtraData   : getExisted(data.getSlotExtraData()),
            warData         : getExisted(data.getWarData()),
        });
    }
    private _onNotifyMsgCampaignCreateWarFailed(): void {
        closePanel(getDict().CommonBlockPanel);
    }

    private async _onTouchedBtnStart(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleSpmSaveSlotPanel, {
            currentSlotIndex        : await getAvailableSlotIndex(),
            needComment             : false,
            needConfirmOverwrite    : true,
            callback                : slotIndex => {
                reqCampaignCreateWar({
                    slotIndex           : slotIndex,
                    slotExtraData       : new SpmWarSaveSlotExtraData(),
                    campaignId          : openData.campaignId,
                    campaignMapId       : openData.campaignMapId,
                    playerCoInfoArray   : [...this._playerCoDict.entries()].map(v => PlayerCoInfo.fromJson({ playerIndex: v[0], coId: v[1] })),
                });
                openPanel(getDict().CommonBlockPanel, {
                    title   : getText(TextType.B0088),
                    content : getText(TextType.A0040),
                });
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelHighScore();
        this._updateListPlayer();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0560);
        this._labelHighScoreTitle.setLangText(TextType.B0907);
        this._btnStart.setLangText(TextType.B0026);

        this._layoutHighScore.arrangeItems();
    }

    private async _updateLabelHighScore(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const campaignId                    = openData.campaignId;
        const campaignMapId                 = openData.campaignMapId;
        const [mapRawData, configVersion]   = await Promise.all([
            getCampaignMapRawData(campaignId, campaignMapId),
            getLatestConfigVersion()
        ]);
        if (openData !== this.getOpenData()) {
            return;
        }

        const label             = this._labelHighScore;
        const cawHighScoreInfo  = getSelfCawHighScoreInfo(campaignId, campaignMapId);
        if (cawHighScoreInfo == null) {
            label.setText(`--`);
        } else {
            const highScore = cawHighScoreInfo.getHighScore();
            if ((cawHighScoreInfo.getCampaignMapRevision() !== mapRawData?.getCampaignMapData()?.getRevision()) ||
                (cawHighScoreInfo.getConfigVersion() !== configVersion)                                         ||
                (highScore == null)
            ) {
                label.setLangText(TextType.B1300);
            } else {
                label.setText(`${highScore}`);
            }
        }
        this._layoutHighScore.arrangeItems();
    }
    private async _updateListPlayer(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapRawData    = await getCampaignMapRawData(openData.campaignId, openData.campaignMapId);
        const listPlayer    = this._listPlayer;
        if (mapRawData) {
            await listPlayer.bindData(await this._createDataForListPlayer(mapRawData.getPlayersCountUnneutral()));
        } else {
            await listPlayer.removeAllItems();
        }

        const dataCount = listPlayer.getBoundDataArray()?.length ?? 0;
        this._group.setUnscaledManualWidth(getValueInRange({
            rawValue    : dataCount * 140 + (dataCount - 1) * 10 + 40,
            minValue    : 330,
            maxValue    : Dimension.DesignWidth,
        }));
    }

    private async _createDataForListPlayer(playersCountUnneutral: number): Promise<DataForPlayerRenderer[]> {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const { campaignId, campaignMapId } = openData;
        const mapRawData                    = await getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return [];
        }

        const warRuleCommonData = getExisted(mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData());
        const playerCoDict      = this._playerCoDict;
        const dataList          : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerRule = getPlayerRule(warRuleCommonData, playerIndex);
            dataList.push({
                campaignId      : campaignId,
                campaignMapId   : campaignMapId,
                playerIndex     : playerIndex,
                mapRawData      : mapRawData,
                coId            : playerRule.getCampaignAiCoId() ?? getExisted(playerCoDict.get(playerIndex)),
                panel           : this,
            });
        }

        return dataList;
    }

    private async _initPlayerCoDict(): Promise<void> {
        const dict = this._playerCoDict;
        dict.clear();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerRuleDataArray = ((await getCampaignMapRawData(openData.campaignId, openData.campaignMapId))?.getTemplateWarRuleArray() ?? [])[0].getWarRuleCommonData()?.getPlayerRuleList() ?? [];
        for (const playerRule of playerRuleDataArray) {
            const coIdArray = playerRule.getCampaignHumanCoIdArray();
            if (coIdArray?.length) {
                dict.set(playerRule.getPlayerIndex(), coIdArray[0]);
            }
        }
    }
}

interface DataForPlayerRenderer extends UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
    mapRawData      : MapRawData;
    playerIndex     : number;
    coId            : number;
    panel           : Panel;
}
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : IUiContainer;
    private readonly _imgSkin!              : IUiImage;
    private readonly _groupChangeCo!        : IUiContainer;
    private readonly _imgCoHead!            : IUiImage;
    private readonly _labelCo!              : IUiLabel;
    private readonly _labelPlayerType!      : IUiLabel;

    private readonly _labelPlayerIndex!     : IUiLabel;
    private readonly _labelTeamIndex!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _onTouchedGroupCo(): Promise<void> {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex       = openData.playerIndex;
        const warRuleCommonData = getExisted(openData.mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData());
        const coIdArray         = (getPlayerRule(warRuleCommonData, playerIndex)).getCampaignHumanCoIdArray();
        const coId              = openData.coId;
        if (coIdArray.length <= 1) {
            openPanel(getDict().CommonCoInfoPanel, {
                gameConfig  : await getLatestGameConfig(),
                coId        : coId,
            });
        } else {
            openPanel(getDict().CommonChooseSingleCoIdPanel, {
                gameConfig          : await getLatestGameConfig(),
                currentCoId         : coId,
                isBan               : false,
                availableCoIdArray  : coIdArray,
                callbackOnConfirm   : newCoId => {
                    if (newCoId !== coId) {
                        openData.panel.updateOnSelectCo(playerIndex, newCoId);
                    }
                },
            });
        }
    }

    private async _updateView(): Promise<void> {
        const oldOpenData = this.getOpenData();
        if (oldOpenData == null) {
            return;
        }

        const { campaignId, campaignMapId, playerIndex, coId, mapRawData }  = oldOpenData;
        const gameConfig                                                    = await getLatestGameConfig();
        if (mapRawData == null) {
            return;
        }

        const newOpenData = this.getOpenData();
        if (newOpenData == null) {
            return;
        }
        if ((campaignId !== newOpenData.campaignId)         ||
            (campaignMapId !== newOpenData.campaignMapId)   ||
            (playerIndex !== newOpenData.playerIndex)       ||
            (coId !== newOpenData.coId)
        ) {
            return;
        }

        const playerRule = mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData()?.getPlayerRuleList().find(v => (v.getPlayerIndex()) === playerIndex);
        if (playerRule == null) {
            return;
        }

        const isAi = playerRule.getCampaignAiCoId() != null;
        this._labelPlayerIndex.setText(getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(getPlayerTeamName(playerRule.getTeamIndex()) || UndefinedError);
        this._imgSkin.loadSource(getCoHeadFrame(playerRule.getCampaignSkinId() ?? 0));
        this._labelPlayerType.setLangText(isAi ? TextType.B0607 : TextType.B0031);

        const coCfg = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(getCoHead(gameConfig, coId) ?? UndefinedError);
        this._groupChangeCo.setIsVisible(playerRule.getCampaignHumanCoIdArray().length > 1);
    }
}
