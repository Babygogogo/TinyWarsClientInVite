import * as CosConstants from "../../cos/Constants.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import type * as SingleRankRoomModelSrrWarCreator from "../model/SrrWarCreator.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiOpenableComponent from "../../ui/interfaces/IUiOpenableComponent.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

export type OpenData = {
    warCreator  : SingleRankRoomModelSrrWarCreator.SrrWarCreator;
} | null;
export class Page
    extends     UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData>
    implements  UiInterfacesIUiOpenableComponent.IUiOpenableComponent<OpenData>
{
    private readonly _groupInfo!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listPlayer!   : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "singleRankRoom/SrrCreatePlayerInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarCreator_TemplateWarRuleIdChanged,  callback: this._onNotifySrrCreateModelTemplateWarRuleIdChanged },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
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
            await listPlayer.bindData(this._createDataForListPlayer(HelpersMisc.getExisted(mapRawData.getPlayersCountUnneutral())));
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

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    warCreator      : SingleRankRoomModelSrrWarCreator.SrrWarCreator;
    playerIndex     : number;
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

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarCreator_PlayerInfoChanged,     callback: this._onNotifySrrCreatePlayerInfoChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForSettings();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warRuleCommonData = HelpersMisc.getExisted(openData.warCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerRule        = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, openData.playerIndex);
        this._btnChangeCo.setIsVisible(playerRule.getSrwAiCoId() == null);
    }

    private async _onTouchedGroupCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const playerData    = openData.warCreator.getPlayerInfo(openData.playerIndex);
        const coId          = playerData ? playerData.getCoId() ?? 0 : null;
        if ((coId != null) && (coId !== CosConstants.CoId.Empty)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
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
        const warRuleCommonData = HelpersMisc.getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        const gcData            = warCreator.getGcData();
        const playerInfo        = warCreator.getPlayerInfo(playerIndex);
        const currentCoId       = playerInfo.getCoId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gcData,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...PlayerRulesUtils.getFinalSrwHumanCoIdSet({
                playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            })],
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                if (newCoId != currentCoId) {
                    playerInfo.setCoId(newCoId);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as NotificationsDataTypes.WarCreator_PlayerInfoChanged);
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySrrCreatePlayerInfoChanged(e: VendorEgretEgret.Event): void {
        const eventData = e.data as NotificationsDataTypes.WarCreator_PlayerInfoChanged;
        if (eventData.playerIndex === this.getOpenData()?.playerIndex) {
            this._updateComponentsForSettings();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.setLangText(LangConstants.TextType.B0230);
        this._btnChangeSkinId.setLangText(LangConstants.TextType.B0609);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const playerIndex       = openData.playerIndex;
        const settingsForCommon = warCreator.getSettingsForCommon();
        const warRuleCommonData = HelpersMisc.getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        this._labelPlayerIndex.setText(LangUtils.getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(LangUtils.getPlayerTeamName(WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) || LangConstants.UndefinedError);

        const playerData = warCreator.getPlayerInfo(playerIndex);
        this._imgSkin.loadSource(HelpersImageSource.getCoHeadFrame(HelpersMisc.getExisted(playerData.getUnitAndTileSkinId())));
        this._labelPlayerType.setText(playerData.getUserId() == null
            ? LangUtils.getText(LangConstants.TextType.B0607)
            : LangUtils.getText(LangConstants.TextType.B0031)
        );

        const coId                  = playerData.getCoId() ?? 0;
        const gameConfig            = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion()));
        const coCfg                 = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(HelpersImageSource.getCoHead(gameConfig, coId) ?? LangConstants.UndefinedError);
        this._imgCoInfo.setIsVisible((coId !== CosConstants.CoId.Empty) && (!!coCfg));
    }
}
