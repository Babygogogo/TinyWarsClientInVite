import {
    type Notifications_Mapping,
    Cos_Constants,
    Notifications_Dispatcher,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    PlayerRules_Utils,
    GameConfigs_Provider,
    Lang_Utils,
    WarRules_Utils_CommonData,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiOpenableComponent,
    type Ui_Interfaces_IUiScrollList,
    type SingleRankRoom_Model_SrrWarCreator,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = {
    warCreator  : SingleRankRoom_Model_SrrWarCreator.SrrWarCreator;
} | null;
export class Page
    extends     Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData>
    implements  Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listPlayer!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "singleRankRoom/SrrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                         callback : this._onNotifyLanguageChanged },
            { type : "WarCreator_TemplateWarRuleIdChanged",  callback : this._onNotifySrrCreateModelTemplateWarRuleIdChanged },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
        this._updateComponentsForPlayerInfo();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySrrCreateModelTemplateWarRuleIdChanged(): void {
        this._updateComponentsForPlayerInfo();
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }
    private async _updateComponentsForPlayerInfo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapRawData    = await openData.warCreator.getMapRawData();
        const listPlayer    = this._listPlayer;
        if (mapRawData) {
            await listPlayer.bindData(this._createDataForListPlayer(mapRawData.getPlayersCountUnneutral()));
        } else {
            await listPlayer.removeAllItems();
        }
    }

    private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const warCreator    = openData.warCreator;
        const dataList      : DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataList.push({
                warCreator  : warCreator,
                playerIndex : playerIndex,
            });
        }

        return dataList;
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    warCreator      : SingleRankRoom_Model_SrrWarCreator.SrrWarCreator;
    playerIndex     : number;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoInfo!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoHead!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelCo!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayerType!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelPlayerIndex!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTeamIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnChangeCo!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeSkinId!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupCo,                callback : this._onTouchedGroupCo },
            { ui : this._btnChangeCo,            callback : this._onTouchedBtnChangeCo },
            { ui : this._btnChangeSkinId,        callback : this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                callback : this._onNotifyLanguageChanged },
            { type : "WarCreator_PlayerInfoChanged",     callback : this._onNotifySrrCreatePlayerInfoChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForSettings();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warRuleCommonData = Helpers_Misc.getExisted(openData.warCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerRule        = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, openData.playerIndex);
        this._btnChangeCo.setIsVisible(playerRule.getSrwAiCoId() == null);
    }

    private async _onTouchedGroupCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const playerData    = openData.warCreator.getPlayerInfo(openData.playerIndex);
        const coId          = playerData ? playerData.getCoId() : null;
        if ((coId != null) && (coId !== Cos_Constants.CoId.Empty)) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
                gameConfig : openData.warCreator.getGcData(),
                coId       : coId,
            });
        }
    }

    private _onTouchedBtnChangeSkinId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.warCreator.tickUnitAndTileSkinId(openData.playerIndex);
    }

    private async _onTouchedBtnChangeCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const playerIndex       = openData.playerIndex;
        const warRuleCommonData = Helpers_Misc.getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        const gcData            = warCreator.getGcData();
        const playerInfo        = warCreator.getPlayerInfo(playerIndex);
        const currentCoId       = playerInfo.getCoId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig         : gcData,
            currentCoId        : currentCoId,
            availableCoIdArray : [...PlayerRules_Utils.getFinalSrwHumanCoIdSet({
                playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            })],
            isBan             : false,
            callbackOnConfirm : newCoId => {
                if (newCoId != currentCoId) {
                    playerInfo.setCoId(newCoId);
                    Notifications_Dispatcher.dispatch("WarCreator_PlayerInfoChanged", { playerIndex });
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySrrCreatePlayerInfoChanged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["WarCreator_PlayerInfoChanged"]>): void {
        const eventData = Helpers_Misc.getExisted(e.data);
        if (eventData.playerIndex === this.getOpenData()?.playerIndex) {
            this._updateComponentsForSettings();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.setLangText(Lang_Constants.TextType.B0230);
        this._btnChangeSkinId.setLangText(Lang_Constants.TextType.B0609);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const playerIndex       = openData.playerIndex;
        const settingsForCommon = warCreator.getSettingsForCommon();
        const warRuleCommonData = Helpers_Misc.getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        this._labelPlayerIndex.setText(Lang_Utils.getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(Lang_Utils.getPlayerTeamName(WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) || Lang_Constants.UndefinedError);

        const playerData = warCreator.getPlayerInfo(playerIndex);
        this._imgSkin.loadSource(Helpers_ImageSource.getCoHeadFrame(playerData.getUnitAndTileSkinId()));
        this._labelPlayerType.setLangText(playerData.getUserId() == null ? Lang_Constants.TextType.B0607 : Lang_Constants.TextType.B0031);

        const coId                  = playerData.getCoId();
        const gameConfig            = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion()));
        const coCfg                 = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(Helpers_ImageSource.getCoHead(gameConfig, coId) ?? Lang_Constants.UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== Cos_Constants.CoId.Empty) && (!!coCfg));
    }
}
