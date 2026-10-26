import { CoId } from "../../cos/Constants.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoHeadFrame, getCoHead } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getPlayerForceName, getPlayerTeamName, getText } from "../../lang/Utils.ts";
import type { MfrRoomCreator } from "../model/MfrRoomCreator.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalMfwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex, AliveStateId } from "../../players/Constants.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";

export type OpenData = {
    roomCreator : MfrRoomCreator;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _groupInfo!    : IUiContainer;
    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        loadSkinByPath(this, "multiFreeRoom/MfrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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
        const gameConfig            = await getGameConfig(getExisted(initialWarData.getSettingsForCommon()?.getConfigVersion()));
        const dataArray             : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
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

interface DataForPlayerRenderer extends UiListItemData {
    roomCreator  : MfrRoomCreator;
    playerIndex     : number;
    gameConfig      : GcData;
    page            : Page;
}
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : IUiContainer;
    private readonly _imgSkin!              : IUiImage;
    private readonly _imgCoInfo!            : IUiImage;
    private readonly _imgCoHead!            : IUiImage;
    private readonly _labelCo!              : IUiLabel;
    private readonly _labelPlayerType!      : IUiLabel;

    private readonly _labelPlayerIndex!     : IUiLabel;
    private readonly _labelTeamIndex!       : IUiLabel;

    private readonly _btnChangeCo!          : IUiButton;
    private readonly _btnChangeSkinId!      : IUiButton;
    private readonly _btnChangeController!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
            { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.RoomCreator_SelfCoIdChanged,         callback: this._onNotifyMfrCreateSelfCoIdChanged },
            { type: TypeId.RoomCreator_SelfPlayerIndexChanged,  callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
            { type: TypeId.RoomCreator_SelfSkinIdChanged,       callback: this._onNotifyMfrCreateSelfSkinIdChanged },
            { type: TypeId.MfrCreatePlayerSkinIdChanged,        callback: this._onNotifyMfrCreatePlayerSkinIdChanged },
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
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            openPanel(getDict().CommonCoInfoPanel, {
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
            ((playerData.getAliveState() ?? 0) === AliveStateId.Dead)
        ) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            openPanel(getDict().CommonCoInfoPanel, {
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
        const playerData    = getExisted(players.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId     = playerData.getUnitAndTileSkinId();
        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray    : getAllSkinIdArray(false),
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

                dispatch(TypeId.MfrCreatePlayerSkinIdChanged);
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
        const playerData    = getExisted(roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex() ?? 0) === playerIndex));
        playerData.setUserId((playerData.getUserId() == null) ? getSelfUserId() : null);
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
        const warRuleCommonData = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerData        = getExisted(roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex() ?? 0) === playerIndex));
        const currentCoId       = playerData.getCoId() ?? 0;
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...getFinalMfwHumanCoIdSet({
                playerRule      : getPlayerRule(warRuleCommonData, playerIndex),
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
        this._btnChangeCo.setLangText(TextType.B0230);
        this._btnChangeSkinId.setLangText(TextType.B0609);
        this._btnChangeController.setLangText(TextType.B0424);
    }

    private _updateComponentsForSettings(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._labelPlayerIndex.setText(getPlayerForceName(playerIndex));

        const roomCreator       = openData.roomCreator;
        const warRuleCommonData = getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerRule        = getPlayerRule(warRuleCommonData, playerIndex);
        this._labelTeamIndex.setText(getPlayerTeamName(getExisted(playerRule.getTeamIndex())) || UndefinedError);

        const playerData = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers()?.find(v => (v.getPlayerIndex() ?? 0) === playerIndex);
        if (playerData == null) {
            return;
        }

        const isDead        = (playerData.getAliveState() ?? 0) === AliveStateId.Dead;
        const isHumanPlayer = (playerData.getUserId() != null) && (!isDead);
        this._btnChangeCo.setIsVisible(!isHumanPlayer);
        this._btnChangeSkinId.setIsVisible(!isHumanPlayer);
        this._btnChangeController.setIsVisible((playerIndex !== roomCreator.getSelfPlayerIndex()) && (!isDead));

        const isSelfPlayer = roomCreator.getSelfPlayerIndex() === playerIndex;
        this._imgSkin.loadSource(getCoHeadFrame(isSelfPlayer
            ? roomCreator.getSelfUnitAndTileSkinId()
            : (isHumanPlayer ? null : (playerData.getUnitAndTileSkinId() ?? 0))
        ));
        this._labelPlayerType.setText(isSelfPlayer
            ? getText(TextType.B0647)
            : (isHumanPlayer ? getText(TextType.B0648) : getText(TextType.B0607))
        );

        const gameConfig                = openData.gameConfig;
        const coId                      = isSelfPlayer
            ? roomCreator.getSelfCoId()
            : (isHumanPlayer ? null : (playerData.getCoId() ?? 0));
        const coCfg                     = coId == null ? null : gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(coId == null ? `` : getCoHead(gameConfig, coId) ?? UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== CoId.Empty) && (!!coCfg));
    }
}
