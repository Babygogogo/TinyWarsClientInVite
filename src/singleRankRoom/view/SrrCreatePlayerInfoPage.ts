import { CoId } from "../../cos/Constants.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
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
    getPlayerForceName,
    getPlayerTeamName,
} from "../../lang/Utils.ts";
import type { WarCreator_PlayerInfoChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalSrwHumanCoIdSet } from "../../playerRules/Utils.ts";
import type { SrrWarCreator } from "../model/SrrWarCreator.ts";
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
import type { Event } from "../../egret/Egret.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";

export type OpenData = {
    warCreator  : SrrWarCreator;
} | null;
export class Page
    extends     UiOpenableComponent<OpenData>
    implements  IUiOpenableComponent<OpenData>
{
    private readonly _groupInfo!    : IUiContainer;
    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        loadSkinByPath(this, "singleRankRoom/SrrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarCreator_TemplateWarRuleIdChanged,  callback: this._onNotifySrrCreateModelTemplateWarRuleIdChanged },
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

interface DataForPlayerRenderer extends UiListItemData {
    warCreator      : SrrWarCreator;
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
    private readonly _btnChangeSkinId!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarCreator_PlayerInfoChanged,     callback: this._onNotifySrrCreatePlayerInfoChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForSettings();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warRuleCommonData = getExisted(openData.warCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerRule        = getPlayerRule(warRuleCommonData, openData.playerIndex);
        this._btnChangeCo.setIsVisible(playerRule.getSrwAiCoId() == null);
    }

    private async _onTouchedGroupCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const playerData    = openData.warCreator.getPlayerInfo(openData.playerIndex);
        const coId          = playerData ? playerData.getCoId() : null;
        if ((coId != null) && (coId !== CoId.Empty)) {
            openPanel(getDict().CommonCoInfoPanel, {
                gameConfig  : openData.warCreator.getGcData(),
                coId        : coId,
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
        const warRuleCommonData = getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        const gcData            = warCreator.getGcData();
        const playerInfo        = warCreator.getPlayerInfo(playerIndex);
        const currentCoId       = playerInfo.getCoId();
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gcData,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...getFinalSrwHumanCoIdSet({
                playerRule      : getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            })],
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                if (newCoId != currentCoId) {
                    playerInfo.setCoId(newCoId);
                    dispatch(TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as WarCreator_PlayerInfoChanged);
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySrrCreatePlayerInfoChanged(e: Event): void {
        const eventData = e.data as WarCreator_PlayerInfoChanged;
        if (eventData.playerIndex === this.getOpenData()?.playerIndex) {
            this._updateComponentsForSettings();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.setLangText(TextType.B0230);
        this._btnChangeSkinId.setLangText(TextType.B0609);
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
        this._imgSkin.loadSource(getCoHeadFrame(playerData.getUnitAndTileSkinId()));
        this._labelPlayerType.setLangText(playerData.getUserId() == null ? TextType.B0607 : TextType.B0031);

        const coId                  = playerData.getCoId();
        const gameConfig            = await getGameConfig(getExisted(settingsForCommon.getConfigVersion()));
        const coCfg                 = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(getCoHead(gameConfig, coId) ?? UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== CoId.Empty) && (!!coCfg));
    }
}
