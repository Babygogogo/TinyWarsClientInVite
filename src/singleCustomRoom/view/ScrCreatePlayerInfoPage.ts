import { CoId } from "../../cos/Constants.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoHeadFrame, getCoHead } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getPlayerForceName, getPlayerTeamName } from "../../lang/Utils.ts";
import type { ScrCreatePlayerInfoChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalScwHumanCoIdSet } from "../../playerRules/Utils.ts";
import type { ScrWarCreator } from "../model/ScrWarCreator.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiOpenableComponent } from "../../ui/interfaces/IUiOpenableComponent.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";

export type OpenData = {
    warCreator: ScrWarCreator;
} | null;
export class Page
    extends     UiOpenableComponent<OpenData>
    implements  IUiOpenableComponent<OpenData>
{
    private readonly _groupInfo!    : IUiContainer;
    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        loadSkinByPath(this, "singleCustomRoom/ScrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
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
            await listPlayer.bindData(this._createDataForListPlayer(getExisted(mapRawData.getPlayersCountUnneutral())));
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
        const gameConfig    = warCreator.getGcData();
        for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataList.push({
                warCreator      : warCreator,
                gameConfig      : gameConfig,
                playerIndex     : playerIndex,
            });
        }

        return dataList;
    }
}

interface DataForPlayerRenderer extends UiListItemData {
    warCreator      : ScrWarCreator;
    gameConfig      : GcData;
    playerIndex     : number;
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
    private readonly _btnChangeController!  : IUiButton;
    private readonly _btnChangeSkinId!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarCreator_PlayerInfoChanged,     callback: this._onNotifyScrCreatePlayerInfoChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const playerData    = openData.warCreator.getPlayerInfo(openData.playerIndex);
        const coId          = playerData ? playerData.getCoId() ?? 0 : null;
        if ((coId != null) && (coId !== CoId.Empty)) {
            openPanel(getDict().CommonCoInfoPanel, {
                gameConfig  : openData.warCreator.getGcData(),
                coId        : coId,
            });
        }
    }

    private _onTouchedBtnChangeController(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.warCreator.tickUserId(openData.playerIndex);
    }

    private async _onTouchedBtnChangeSkinId(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.warCreator.tickUnitAndTileSkinId(openData.playerIndex);
    }

    private _onTouchedBtnChangeCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const playerIndex       = openData.playerIndex;
        const playerInfo        = warCreator.getPlayerInfo(playerIndex);
        const currentCoId       = playerInfo.getCoId();
        const warRuleCommonData = getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : openData.gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...getFinalScwHumanCoIdSet({
                playerRule      : getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : warCreator.getGcData(),
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            })],
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                if (newCoId != currentCoId) {
                    playerInfo.setCoId(newCoId);
                    dispatch(TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as ScrCreatePlayerInfoChanged);
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyScrCreatePlayerInfoChanged(e: Event): void {
        const eventData = e.data as ScrCreatePlayerInfoChanged;
        if (eventData.playerIndex === this.getOpenData()?.playerIndex) {
            this._updateComponentsForSettings();
        }
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForSettings();
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.setText(getText(TextType.B0230));
        this._btnChangeController.setText(getText(TextType.B0608));
        this._btnChangeSkinId.setText(getText(TextType.B0609));
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }


        const warCreator        = openData.warCreator;
        const playerIndex       = openData.playerIndex;
        const settingsForCommon = warCreator.getSettingsForCommon();
        const warRuleCommonData = getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        this._labelPlayerIndex.setText(getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(getPlayerTeamName(getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) || UndefinedError);

        const playerData = warCreator.getPlayerInfo(playerIndex);
        this._imgSkin.loadSource(getCoHeadFrame(getExisted(playerData.getUnitAndTileSkinId())));
        this._labelPlayerType.setText(playerData.getUserId() == null
            ? getText(TextType.B0607)
            : getText(TextType.B0031)
        );

        const coId          = playerData.getCoId() ?? 0;
        const gameConfig    = await getGameConfig(getExisted(settingsForCommon.getConfigVersion()));
        const coCfg         = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(getCoHead(gameConfig, coId) ?? UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== CoId.Empty) && (!!coCfg));
    }
}
