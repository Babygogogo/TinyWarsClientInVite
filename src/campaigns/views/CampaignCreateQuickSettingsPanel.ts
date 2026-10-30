import {
    GamePanels_Manager,
    Stages_Constants,
    SinglePlayerMode_Model_SpmModel,
    Campaigns_Mains_Provider,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    GameConfigs_Provider,
    Lang_Utils,
    WarRules_Utils_CommonData,
    Users_Model,
    Numbers_Utils,
    Helpers_GameFlow,
    Players_Constants,
    Sounds_SoundPlayer,
    Campaigns_Mains_Gateway,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { PlayerCoInfo } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/PlayerCoInfo.ts";
import type { S as CampaignCreateWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";

export interface OpenData {
    campaignId      : number;
    campaignMapId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutHighScore!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelHighScoreTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHighScore!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnStart!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listPlayer!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    private _playerCoDict   = new Map<number, number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgCampaignCreateWar,        callback: this._onNotifyMsgCampaignCreateWar },
            { type: Notifications_TypeId.TypeId.MsgCampaignCreateWarFailed,  callback: this._onNotifyMsgCampaignCreateWarFailed },
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
    private _onNotifyMsgCampaignCreateWar(e: Egret_Egret.Event): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);

        const data = e.data as CampaignCreateWarResponse;
        Helpers_GameFlow.gotoSinglePlayerWar({
            slotIndex       : Helpers_Misc.getExisted(data.getSlotIndex()),
            slotExtraData   : Helpers_Misc.getExisted(data.getSlotExtraData()),
            warData         : Helpers_Misc.getExisted(data.getWarData()),
        });
    }
    private _onNotifyMsgCampaignCreateWarFailed(): void {
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
    }

    private async _onTouchedBtnStart(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
            currentSlotIndex        : await SinglePlayerMode_Model_SpmModel.getAvailableSlotIndex(),
            needComment             : false,
            needConfirmOverwrite    : true,
            callback                : slotIndex => {
                Campaigns_Mains_Gateway.reqCampaignCreateWar({
                    slotIndex           : slotIndex,
                    slotExtraData       : new SpmWarSaveSlotExtraData(),
                    campaignId          : openData.campaignId,
                    campaignMapId       : openData.campaignMapId,
                    playerCoInfoArray   : [...this._playerCoDict.entries()].map(v => PlayerCoInfo.fromJson({ playerIndex: v[0], coId: v[1] })),
                });
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                    title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0560);
        this._labelHighScoreTitle.setLangText(Lang_Constants.TextType.B0907);
        this._btnStart.setLangText(Lang_Constants.TextType.B0026);

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
            Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId),
            GameConfigs_Provider.getLatestConfigVersion()
        ]);
        if (openData !== this.getOpenData()) {
            return;
        }

        const label             = this._labelHighScore;
        const cawHighScoreInfo  = Users_Model.getSelfCawHighScoreInfo(campaignId, campaignMapId);
        if (cawHighScoreInfo == null) {
            label.setText(`--`);
        } else {
            const highScore = cawHighScoreInfo.getHighScore();
            if ((cawHighScoreInfo.getCampaignMapRevision() !== mapRawData?.getCampaignMapData()?.getRevision()) ||
                (cawHighScoreInfo.getConfigVersion() !== configVersion)                                         ||
                (highScore == null)
            ) {
                label.setLangText(Lang_Constants.TextType.B1300);
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

        const mapRawData    = await Campaigns_Mains_Provider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId);
        const listPlayer    = this._listPlayer;
        if (mapRawData) {
            await listPlayer.bindData(await this._createDataForListPlayer(mapRawData.getPlayersCountUnneutral()));
        } else {
            await listPlayer.removeAllItems();
        }

        const dataCount = listPlayer.getBoundDataArray()?.length ?? 0;
        this._group.setUnscaledManualWidth(Numbers_Utils.getValueInRange({
            rawValue    : dataCount * 140 + (dataCount - 1) * 10 + 40,
            minValue    : 330,
            maxValue    : Stages_Constants.Dimension.DesignWidth,
        }));
    }

    private async _createDataForListPlayer(playersCountUnneutral: number): Promise<DataForPlayerRenderer[]> {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const { campaignId, campaignMapId } = openData;
        const mapRawData                    = await Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return [];
        }

        const warRuleCommonData = Helpers_Misc.getExisted(mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData());
        const playerCoDict      = this._playerCoDict;
        const dataList          : DataForPlayerRenderer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerRule = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex);
            dataList.push({
                campaignId      : campaignId,
                campaignMapId   : campaignMapId,
                playerIndex     : playerIndex,
                mapRawData      : mapRawData,
                coId            : playerRule.getCampaignAiCoId() ?? Helpers_Misc.getExisted(playerCoDict.get(playerIndex)),
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

        const playerRuleDataArray = ((await Campaigns_Mains_Provider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId))?.getTemplateWarRuleArray() ?? [])[0].getWarRuleCommonData()?.getPlayerRuleList() ?? [];
        for (const playerRule of playerRuleDataArray) {
            const coIdArray = playerRule.getCampaignHumanCoIdArray();
            if (coIdArray?.length) {
                dict.set(playerRule.getPlayerIndex(), coIdArray[0]);
            }
        }
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
    mapRawData      : MapRawData;
    playerIndex     : number;
    coId            : number;
    panel           : Panel;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupChangeCo!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCoHead!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelCo!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayerType!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelPlayerIndex!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTeamIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _onTouchedGroupCo(): Promise<void> {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex       = openData.playerIndex;
        const warRuleCommonData = Helpers_Misc.getExisted(openData.mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData());
        const coIdArray         = (WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex)).getCampaignHumanCoIdArray();
        const coId              = openData.coId;
        if (coIdArray.length <= 1) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
                gameConfig  : await GameConfigs_Provider.getLatestGameConfig(),
                coId        : coId,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
                gameConfig          : await GameConfigs_Provider.getLatestGameConfig(),
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
        const gameConfig                                                    = await GameConfigs_Provider.getLatestGameConfig();
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
        this._labelPlayerIndex.setText(Lang_Utils.getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(Lang_Utils.getPlayerTeamName(playerRule.getTeamIndex()) || Lang_Constants.UndefinedError);
        this._imgSkin.loadSource(Helpers_ImageSource.getCoHeadFrame(playerRule.getCampaignSkinId() ?? 0));
        this._labelPlayerType.setLangText(isAi ? Lang_Constants.TextType.B0607 : Lang_Constants.TextType.B0031);

        const coCfg = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(Helpers_ImageSource.getCoHead(gameConfig, coId) ?? Lang_Constants.UndefinedError);
        this._groupChangeCo.setIsVisible(playerRule.getCampaignHumanCoIdArray().length > 1);
    }
}
