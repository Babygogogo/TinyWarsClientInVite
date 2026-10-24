import * as CampaignsMainsGateway from "../mains/Gateway.ts";
import * as CampaignsMainsProvider from "../mains/Provider.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarPlayerCoInfo from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/PlayerCoInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as SinglePlayerModeModelSpmModel from "../../singlePlayerMode/model/SpmModel.ts";
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
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

export interface OpenData {
    campaignId      : number;
    campaignMapId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutHighScore!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelHighScoreTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHighScore!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnStart!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listPlayer!           : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    private _playerCoDict   = new Map<number, number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCampaignCreateWar,        callback: this._onNotifyMsgCampaignCreateWar },
            { type: NotificationsTypeId.TypeId.MsgCampaignCreateWarFailed,  callback: this._onNotifyMsgCampaignCreateWarFailed },
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
    private _onNotifyMsgCampaignCreateWar(e: VendorEgretEgret.Event): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);

        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarS.S;
        HelpersGameFlow.gotoSinglePlayerWar({
            slotIndex       : HelpersMisc.getExisted(data.getSlotIndex()),
            slotExtraData   : HelpersMisc.getExisted(data.getSlotExtraData()),
            warData         : HelpersMisc.getExisted(data.getWarData()),
        });
    }
    private _onNotifyMsgCampaignCreateWarFailed(): void {
        GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
    }

    private async _onTouchedBtnStart(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
            currentSlotIndex        : await SinglePlayerModeModelSpmModel.getAvailableSlotIndex(),
            needComment             : false,
            needConfirmOverwrite    : true,
            callback                : slotIndex => {
                CampaignsMainsGateway.reqCampaignCreateWar({
                    slotIndex           : slotIndex,
                    slotExtraData       : new ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData(),
                    campaignId          : openData.campaignId,
                    campaignMapId       : openData.campaignMapId,
                    playerCoInfoArray   : [...this._playerCoDict.entries()].map(v => ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarPlayerCoInfo.PlayerCoInfo.fromJson({ playerIndex: v[0], coId: v[1] })),
                });
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                    title   : LangUtils.getText(LangConstants.TextType.B0088),
                    content : LangUtils.getText(LangConstants.TextType.A0040),
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0560));
        this._labelHighScoreTitle.setText(LangUtils.getText(LangConstants.TextType.B0907));
        this._btnStart.setText(LangUtils.getText(LangConstants.TextType.B0026));

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
            CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId),
            GameConfigGcModel.getLatestConfigVersion()
        ]);
        if (openData !== this.getOpenData()) {
            return;
        }

        const label             = this._labelHighScore;
        const cawHighScoreInfo  = UsersModel.getSelfCawHighScoreInfo(campaignId, campaignMapId);
        if (cawHighScoreInfo == null) {
            label.setText(`--`);
        } else {
            const highScore = cawHighScoreInfo.getHighScore();
            if ((cawHighScoreInfo.getCampaignMapRevision() !== mapRawData?.getCampaignMapData()?.getRevision()) ||
                (cawHighScoreInfo.getConfigVersion() !== configVersion)                                         ||
                (highScore == null)
            ) {
                label.setText(LangUtils.getText(LangConstants.TextType.B1300));
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

        const mapRawData    = await CampaignsMainsProvider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId);
        const listPlayer    = this._listPlayer;
        if (mapRawData) {
            await listPlayer.bindData(await this._createDataForListPlayer(HelpersMisc.getExisted(mapRawData.getPlayersCountUnneutral())));
        } else {
            await listPlayer.removeAllItems();
        }

        const dataCount = listPlayer.getBoundDataArray()?.length ?? 0;
        this._group.setUnscaledManualWidth(NumbersUtils.getValueInRange({
            rawValue    : dataCount * 140 + (dataCount - 1) * 10 + 40,
            minValue    : 330,
            maxValue    : StagesConstants.Dimension.DesignWidth,
        }));
    }

    private async _createDataForListPlayer(playersCountUnneutral: number): Promise<DataForPlayerRenderer[]> {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const { campaignId, campaignMapId } = openData;
        const mapRawData                    = await CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return [];
        }

        const warRuleCommonData = HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData());
        const playerCoDict      = this._playerCoDict;
        const dataList          : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerRule = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex);
            dataList.push({
                campaignId      : campaignId,
                campaignMapId   : campaignMapId,
                playerIndex     : playerIndex,
                mapRawData      : mapRawData,
                coId            : playerRule.getCampaignAiCoId() ?? HelpersMisc.getExisted(playerCoDict.get(playerIndex)),
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

        const playerRuleDataArray = ((await CampaignsMainsProvider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId))?.getTemplateWarRuleArray() ?? [])[0].getWarRuleCommonData()?.getPlayerRuleList() ?? [];
        for (const playerRule of playerRuleDataArray) {
            const coIdArray = playerRule.getCampaignHumanCoIdArray();
            if (coIdArray?.length) {
                dict.set(playerRule.getPlayerIndex() ?? 0, coIdArray[0]);
            }
        }
    }
}

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    campaignId      : number;
    campaignMapId   : number;
    mapRawData      : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
    playerIndex     : number;
    coId            : number;
    panel           : Panel;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSkin!              : UiInterfacesIUiImage.IUiImage;
    private readonly _groupChangeCo!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCoHead!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelCo!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayerType!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelPlayerIndex!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTeamIndex!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _onTouchedGroupCo(): Promise<void> {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex       = openData.playerIndex;
        const warRuleCommonData = HelpersMisc.getExisted(openData.mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData());
        const coIdArray         = (WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex)).getCampaignHumanCoIdArray();
        const coId              = openData.coId;
        if (coIdArray.length <= 1) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
                gameConfig  : await GameConfigGcModel.getLatestGameConfig(),
                coId        : coId,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
                gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
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
        const gameConfig                                                    = await GameConfigGcModel.getLatestGameConfig();
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

        const playerRule = mapRawData.getTemplateWarRuleArray()[0].getWarRuleCommonData()?.getPlayerRuleList().find(v => (v.getPlayerIndex() ?? 0) === playerIndex);
        if (playerRule == null) {
            return;
        }

        const isAi = playerRule.getCampaignAiCoId() != null;
        this._labelPlayerIndex.setText(LangUtils.getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(LangUtils.getPlayerTeamName(playerRule.getTeamIndex() ?? 0) || LangConstants.UndefinedError);
        this._imgSkin.loadSource(HelpersImageSource.getCoHeadFrame(playerRule.getCampaignSkinId() ?? 0));
        this._labelPlayerType.setText(LangUtils.getText(isAi ? LangConstants.TextType.B0607 : LangConstants.TextType.B0031));

        const coCfg = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(HelpersImageSource.getCoHead(gameConfig, coId) ?? LangConstants.UndefinedError);
        this._groupChangeCo.setIsVisible(playerRule.getCampaignHumanCoIdArray().length > 1);
    }
}
