import {
    Players_Constants,
    Cos_Constants,
    Notifications_Dispatcher,
    ForceSkins_Utils,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    PlayerRules_Utils,
    GameConfigs_Provider,
    Lang_Utils,
    WarRules_Utils_CommonData,
    Users_Model,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type MultiFreeRoom_Model_MfrRoomCreator,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = {
    roomCreator : MultiFreeRoom_Model_MfrRoomCreator.MfrRoomCreator;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listPlayer!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "multiFreeRoom/MfrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    public override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForPlayerInfo();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    public updateView(): void {
        this._updateComponentsForPlayerInfo();
    }

    private async _updateComponentsForPlayerInfo(): Promise<void> {
        await this._listPlayer.bindData(await this._createDataForListPlayer());
    }

    private async _createDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const roomCreator           = openData.roomCreator;
        const initialWarData        = roomCreator.getInitialWarData();
        const playersCountUnneutral = (initialWarData.getPlayerManager()?.getPlayers()?.length ?? 0) - 1;
        const gameConfig            = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(initialWarData.getSettingsForCommon()?.getConfigVersion()));
        const dataArray             : DataForPlayerRenderer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataArray.push({
                roomCreator : roomCreator,
                playerIndex : playerIndex,
                page        : this,
                gameConfig  : gameConfig,
            });
        }

        return dataArray;
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    roomCreator  : MultiFreeRoom_Model_MfrRoomCreator.MfrRoomCreator;
    playerIndex     : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    page            : Page;
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
    private readonly _btnChangeController!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupCo,                callback : this._onTouchedGroupCo },
            { ui : this._btnChangeCo,            callback : this._onTouchedBtnChangeCo },
            { ui : this._btnChangeSkinId,        callback : this._onTouchedBtnChangeSkinId },
            { ui : this._btnChangeController,    callback : this._onTouchedBtnChangeController },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.RoomCreator_SelfCoIdChanged,         callback : this._onNotifyMfrCreateSelfCoIdChanged },
            { type : Notifications_TypeId.TypeId.RoomCreator_SelfPlayerIndexChanged,  callback : this._onNotifyMfrCreateSelfPlayerIndexChanged },
            { type : Notifications_TypeId.TypeId.RoomCreator_SelfSkinIdChanged,       callback : this._onNotifyMfrCreateSelfSkinIdChanged },
            { type : Notifications_TypeId.TypeId.MfrCreatePlayerSkinIdChanged,        callback : this._onNotifyMfrCreatePlayerSkinIdChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const playerIndex       = openData.playerIndex;
        const gameConfig        = openData.gameConfig;
        const initialWarData    = roomCreator.getInitialWarData();
        if (playerIndex === roomCreator.getSelfPlayerIndex()) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
                gameConfig : gameConfig,
                coId       : roomCreator.getSelfCoId(),
            });
            return;
        }

        const playerData = initialWarData.getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex()) === playerIndex);
        if (playerData == null) {
            return;
        }

        if ((playerData.getUserId() == null)                                                     ||
            ((playerData.getAliveState()) === Players_Constants.AliveStateId.Dead)
        ) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
                gameConfig : gameConfig,
                coId       : playerData.getCoId(),
            });
        }
    }
    private _onTouchedBtnChangeSkinId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const playerIndex   = openData.playerIndex;
        const players       = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers() ?? [];
        const playerData    = Helpers_Misc.getExisted(players.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId     = playerData.getUnitAndTileSkinId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray : ForceSkins_Utils.getAllSkinIdArray(false),
            currentSkinId        : oldSkinId,
            callback             : newSkinId => {
                if (newSkinId === oldSkinId) {
                    return;
                }

                const existingPlayer = players.find(v => (v.getUnitAndTileSkinId() === newSkinId));
                existingPlayer?.setUnitAndTileSkinId(oldSkinId);
                playerData.setUnitAndTileSkinId(newSkinId);
                if (existingPlayer?.getPlayerIndex() === roomCreator.getSelfPlayerIndex()) {
                    roomCreator.setSelfUnitAndTileSkinId(oldSkinId);
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MfrCreatePlayerSkinIdChanged);
            },
        });
    }
    private _onTouchedBtnChangeController(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const playerIndex   = openData.playerIndex;
        const playerData    = Helpers_Misc.getExisted(roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex()) === playerIndex));
        playerData.setUserId((playerData.getUserId() == null) ? Users_Model.getSelfUserId() : null);
        this._updateComponentsForSettings();
    }
    private _onTouchedBtnChangeCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const playerIndex       = openData.playerIndex;
        const gameConfig        = openData.gameConfig;
        const warRuleCommonData = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerData        = Helpers_Misc.getExisted(roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex()) === playerIndex));
        const currentCoId       = playerData.getCoId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig         : gameConfig,
            currentCoId        : currentCoId,
            availableCoIdArray : [...PlayerRules_Utils.getFinalMfwHumanCoIdSet({
                playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gameConfig,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : true,
            })],
            isBan             : false,
            callbackOnConfirm : newCoId => {
                if (newCoId !== currentCoId) {
                    playerData.setCoId(newCoId);
                    this._updateComponentsForSettings();
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMfrCreateSelfCoIdChanged(): void {
        this._updateComponentsForSettings();
    }
    private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
        this._updateComponentsForSettings();
    }
    private _onNotifyMfrCreateSelfSkinIdChanged(): void {
        this._updateComponentsForSettings();
    }
    private _onNotifyMfrCreatePlayerSkinIdChanged(): void {
        this._updateComponentsForSettings();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForSettings();
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.setLangText(Lang_Constants.TextType.B0230);
        this._btnChangeSkinId.setLangText(Lang_Constants.TextType.B0609);
        this._btnChangeController.setLangText(Lang_Constants.TextType.B0424);
    }

    private _updateComponentsForSettings(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._labelPlayerIndex.setText(Lang_Utils.getPlayerForceName(playerIndex));

        const roomCreator       = openData.roomCreator;
        const warRuleCommonData = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerRule        = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex);
        this._labelTeamIndex.setText(Lang_Utils.getPlayerTeamName(playerRule.getTeamIndex()) || Lang_Constants.UndefinedError);

        const playerData = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex()) === playerIndex);
        if (playerData == null) {
            return;
        }

        const isDead        = (playerData.getAliveState()) === Players_Constants.AliveStateId.Dead;
        const isHumanPlayer = (playerData.getUserId() != null) && (!isDead);
        this._btnChangeCo.setIsVisible(!isHumanPlayer);
        this._btnChangeSkinId.setIsVisible(!isHumanPlayer);
        this._btnChangeController.setIsVisible((playerIndex !== roomCreator.getSelfPlayerIndex()) && (!isDead));

        const isSelfPlayer = roomCreator.getSelfPlayerIndex() === playerIndex;
        this._imgSkin.loadSource(Helpers_ImageSource.getCoHeadFrame(isSelfPlayer
            ? roomCreator.getSelfUnitAndTileSkinId()
            : (isHumanPlayer ? null : (playerData.getUnitAndTileSkinId())),
        ));
        this._labelPlayerType.setLangText(isSelfPlayer ? Lang_Constants.TextType.B0647 : isHumanPlayer ? Lang_Constants.TextType.B0648 : Lang_Constants.TextType.B0607);

        const gameConfig                = openData.gameConfig;
        const coId                      = isSelfPlayer
            ? roomCreator.getSelfCoId()
            : (isHumanPlayer ? null : (playerData.getCoId()));
        const coCfg                     = coId == null ? null : gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(coId == null ? `` : Helpers_ImageSource.getCoHead(gameConfig, coId) ?? Lang_Constants.UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== Cos_Constants.CoId.Empty) && (!!coCfg));
    }
}
