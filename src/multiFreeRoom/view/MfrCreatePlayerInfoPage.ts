import * as CosConstants from "../../cos/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MultiFreeRoomModelMfrRoomCreator from "../model/MfrRoomCreator.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

export type OpenData = {
    roomCreator : MultiFreeRoomModelMfrRoomCreator.MfrRoomCreator;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listPlayer!   : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "multiFreeRoom/MfrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
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
        const gameConfig            = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(initialWarData.getSettingsForCommon()?.getConfigVersion()));
        const dataArray             : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
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

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    roomCreator  : MultiFreeRoomModelMfrRoomCreator.MfrRoomCreator;
    playerIndex     : number;
    gameConfig      : GameConfigGcData.GcData;
    page            : Page;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSkin!              : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoInfo!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoHead!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelCo!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayerType!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelPlayerIndex!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTeamIndex!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnChangeCo!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeSkinId!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeController!  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
            { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.RoomCreator_SelfCoIdChanged,         callback: this._onNotifyMfrCreateSelfCoIdChanged },
            { type: NotificationsTypeId.TypeId.RoomCreator_SelfPlayerIndexChanged,  callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
            { type: NotificationsTypeId.TypeId.RoomCreator_SelfSkinIdChanged,       callback: this._onNotifyMfrCreateSelfSkinIdChanged },
            { type: NotificationsTypeId.TypeId.MfrCreatePlayerSkinIdChanged,        callback: this._onNotifyMfrCreatePlayerSkinIdChanged },
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
                gameConfig  : gameConfig,
                coId        : roomCreator.getSelfCoId(),
            });
            return;
        }

        const playerData = initialWarData.getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex() ?? 0) === playerIndex);
        if (playerData == null) {
            return;
        }

        if ((playerData.getUserId() == null)                                                     ||
            ((playerData.getAliveState() ?? 0) === PlayersConstants.AliveStateId.Dead)
        ) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
                gameConfig  : gameConfig,
                coId        : playerData.getCoId() ?? 0,
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
        const playerData    = HelpersMisc.getExisted(players.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId     = playerData.getUnitAndTileSkinId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray    : ForceSkinsUtils.getAllSkinIdArray(false),
            currentSkinId           : oldSkinId,
            callback                : newSkinId => {
                if (newSkinId === oldSkinId) {
                    return;
                }

                const existingPlayer = players.find(v => (v.getUnitAndTileSkinId() === newSkinId));
                existingPlayer?.setUnitAndTileSkinId(oldSkinId);
                playerData.setUnitAndTileSkinId(newSkinId);
                if (existingPlayer?.getPlayerIndex() === roomCreator.getSelfPlayerIndex()) {
                    roomCreator.setSelfUnitAndTileSkinId(oldSkinId);
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MfrCreatePlayerSkinIdChanged);
            }
        });
    }
    private _onTouchedBtnChangeController(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const playerIndex   = openData.playerIndex;
        const playerData    = HelpersMisc.getExisted(roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex() ?? 0) === playerIndex));
        playerData.setUserId((playerData.getUserId() == null) ? UsersModel.getSelfUserId() : null);
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
        const warRuleCommonData = HelpersMisc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerData        = HelpersMisc.getExisted(roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex() ?? 0) === playerIndex));
        const currentCoId       = playerData.getCoId() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...PlayerRulesUtils.getFinalMfwHumanCoIdSet({
                playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gameConfig,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : true,
            })],
            isBan               : false,
            callbackOnConfirm   : newCoId => {
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
        this._btnChangeCo.setLangText(LangConstants.TextType.B0230);
        this._btnChangeSkinId.setLangText(LangConstants.TextType.B0609);
        this._btnChangeController.setLangText(LangConstants.TextType.B0424);
    }

    private _updateComponentsForSettings(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._labelPlayerIndex.setText(LangUtils.getPlayerForceName(playerIndex));

        const roomCreator       = openData.roomCreator;
        const warRuleCommonData = HelpersMisc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerRule        = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex);
        this._labelTeamIndex.setText(LangUtils.getPlayerTeamName(HelpersMisc.getExisted(playerRule.getTeamIndex())) || LangConstants.UndefinedError);

        const playerData = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex() ?? 0) === playerIndex);
        if (playerData == null) {
            return;
        }

        const isDead        = (playerData.getAliveState() ?? 0) === PlayersConstants.AliveStateId.Dead;
        const isHumanPlayer = (playerData.getUserId() != null) && (!isDead);
        this._btnChangeCo.setIsVisible(!isHumanPlayer);
        this._btnChangeSkinId.setIsVisible(!isHumanPlayer);
        this._btnChangeController.setIsVisible((playerIndex !== roomCreator.getSelfPlayerIndex()) && (!isDead));

        const isSelfPlayer = roomCreator.getSelfPlayerIndex() === playerIndex;
        this._imgSkin.loadSource(HelpersImageSource.getCoHeadFrame(isSelfPlayer
            ? roomCreator.getSelfUnitAndTileSkinId()
            : (isHumanPlayer ? null : (playerData.getUnitAndTileSkinId() ?? 0))
        ));
        this._labelPlayerType.setText(isSelfPlayer
            ? LangUtils.getText(LangConstants.TextType.B0647)
            : (isHumanPlayer ? LangUtils.getText(LangConstants.TextType.B0648) : LangUtils.getText(LangConstants.TextType.B0607))
        );

        const gameConfig                = openData.gameConfig;
        const coId                      = isSelfPlayer
            ? roomCreator.getSelfCoId()
            : (isHumanPlayer ? null : (playerData.getCoId() ?? 0));
        const coCfg                     = coId == null ? null : gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(coId == null ? `` : HelpersImageSource.getCoHead(gameConfig, coId) ?? LangConstants.UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== CosConstants.CoId.Empty) && (!!coCfg));
    }
}
