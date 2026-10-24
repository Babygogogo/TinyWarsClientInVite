import * as CosConstants from "../../cos/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as SinglePlayerModeModelSpmModel from "../../singlePlayerMode/model/SpmModel.ts";
import * as SinglePlayerModeModelSpmProxy from "../../singlePlayerMode/model/SpmProxy.ts";
import type * as SingleRankRoomModelSrrWarCreator from "../model/SrrWarCreator.ts";
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
    warCreator: SingleRankRoomModelSrrWarCreator.SrrWarCreator;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _labelWarRuleTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarRule!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyWarRule!     : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutHighScore!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelHighScoreTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHighScore!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnStart!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listPlayer!           : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnModifyWarRule,   callback: this._onTouchedBtnModifyWarRule },
            { ui: this._btnStart,           callback: this._onTouchedBtnStart },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnModifyWarRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const warRuleId     = warCreator.getInstanceWarRule().getTemplateWarRuleId();
        warCreator.tickTemplateWarRuleId();
        this._updateView();

        if (warRuleId == warCreator.getInstanceWarRule().getTemplateWarRuleId()) {
            FloatText2.showLang(LangConstants.TextType.A0857);
        }
    }

    private async _onTouchedBtnStart(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator = openData.warCreator;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
            currentSlotIndex        : warCreator.getSaveSlotIndex(),
            needComment             : false,
            needConfirmOverwrite    : true,
            callback                : slotIndex => {
                warCreator.setSaveSlotIndex(slotIndex);
                SinglePlayerModeModelSpmProxy.reqSpmCreateSrw(warCreator.generateData());
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnModifyWarRule();
        this._updateLabelWarRule();
        this._updateLabelHighScore();
        this._updateListPlayer();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0908);
        this._labelWarRuleTitle.setLangText(LangConstants.TextType.B0909);
        this._labelHighScoreTitle.setLangText(LangConstants.TextType.B0907);
        this._btnStart.setLangText(LangConstants.TextType.B0249);

        this._layoutHighScore.arrangeItems();
    }

    private async _updateBtnModifyWarRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator = openData.warCreator;
        this._btnModifyWarRule.setIsVisible(((await warCreator.getMapRawData()).getTemplateWarRuleArray().filter(v => v.getRuleAvailability()?.getCanSrw()).length ?? 0) > 1);
    }
    private async _updateLabelWarRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const templateWarRuleId = warCreator.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRule   = (await warCreator.getMapRawData()).getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId);
        this._labelWarRule.setText(templateWarRule
            ? `#${templateWarRuleId} ${LangUtils.getLanguageText({ textArray: templateWarRule.getRuleNameArray() }) ?? LangConstants.UndefinedError}`
            : LangConstants.UndefinedError
        );
    }
    private async _updateLabelHighScore(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const ruleId        = warCreator.getInstanceWarRule().getTemplateWarRuleId();
        const label         = this._labelHighScore;
        const layout        = this._layoutHighScore;
        if (ruleId == null) {
            label.setText(`--`);
            layout.arrangeItems();
            return;
        }

        const normalMapId   = warCreator.getMapRawData().getNormalMapId();
        const configVersion = await GameConfigGcModel.getLatestConfigVersion();
        const score         = UsersModel.getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray().find(v => (v.getConfigVersion() === configVersion) && (v.getNormalMapId() === normalMapId) && (v.getRuleId() === ruleId))?.getHighScore();
        if (score == null) {
            label.setText(`--`);
        } else {
            const rankIndex = await SinglePlayerModeModelSpmModel.getRankIndex(normalMapId, ruleId, score);
            label.setText(((rankIndex != null) && (rankIndex > 0))
                ? `${score} (${rankIndex}${HelpersText.getSuffixForRankIndex(rankIndex)})`
                : `${score} (--)`
            );
        }
        layout.arrangeItems();
    }
    private async _updateListPlayer(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const mapRawData    = await warCreator.getMapRawData();
        const listPlayer    = this._listPlayer;
        const dataArray     = mapRawData ? this._createDataForListPlayer(HelpersMisc.getExisted(mapRawData.getPlayersCountUnneutral())) : [];
        await listPlayer.bindData(dataArray);

        const count = dataArray.length;
        this._group.setUnscaledManualWidth(NumbersUtils.getValueInRange({
            maxValue    : StagesConstants.Dimension.DesignWidth,
            minValue    : 330,
            rawValue    : count * 140 + (count - 1) * 10 + 40,
        }));
    }

    private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const warCreator   = openData.warCreator;
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

        const warCreator    = openData.warCreator;
        const playerData    = warCreator.getPlayerInfo(openData.playerIndex);
        const coId          = playerData ? playerData.getCoId() ?? 0 : null;
        if ((coId != null) && (coId !== CosConstants.CoId.Empty)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoInfoPanel, {
                gameConfig  : warCreator.getGcData(),
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
        const gcData            = warCreator.getGcData();
        const playerInfo        = warCreator.getPlayerInfo(playerIndex);
        const currentCoId       = playerInfo.getCoId();
        const warRuleCommonData = HelpersMisc.getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gcData,
            currentCoId         : currentCoId,
            isBan               : false,
            availableCoIdArray  : [...PlayerRulesUtils.getFinalSrwHumanCoIdSet({
                playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            })],
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
        this._btnChangeCo.setText(LangUtils.getText(LangConstants.TextType.B0230));
        this._btnChangeSkinId.setText(LangUtils.getText(LangConstants.TextType.B0609));
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

        const playerData = warCreator.getPlayerInfo(openData.playerIndex);
        this._imgSkin.loadSource(HelpersImageSource.getCoHeadFrame(HelpersMisc.getExisted(playerData.getUnitAndTileSkinId())));
        this._labelPlayerType.setText(LangUtils.getText(playerData.getUserId() == null ? LangConstants.TextType.B0607 : LangConstants.TextType.B0031));

        const coId          = playerData.getCoId() ?? 0;
        const gameConfig    = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion()));
        const coCfg         = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(HelpersImageSource.getCoHead(gameConfig, coId) ?? LangConstants.UndefinedError);
    }
}
