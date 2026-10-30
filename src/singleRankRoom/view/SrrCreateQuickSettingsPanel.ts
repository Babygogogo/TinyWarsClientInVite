import { CoId } from "../../cos/Constants.ts";
import { showLang } from "../../FloatText.ts";
import {
    getLatestConfigVersion,
    getGameConfig,
} from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    getCoHeadFrame,
    getCoHead,
} from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getSuffixForRankIndex } from "../../helpers/Text.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getLanguageText,
    getPlayerForceName,
    getPlayerTeamName,
} from "../../lang/Utils.ts";
import type { WarCreator_PlayerInfoChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { getFinalSrwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { getRankIndex } from "../../singlePlayerMode/model/SpmModel.ts";
import { reqSpmCreateSrw } from "../../singlePlayerMode/model/SpmProxy.ts";
import type { SrrWarCreator } from "../model/SrrWarCreator.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfInfo } from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";

export interface OpenData {
    warCreator: SrrWarCreator;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _labelWarRuleTitle!    : IUiLabel;
    private readonly _labelWarRule!         : IUiLabel;
    private readonly _btnModifyWarRule!     : IUiButton;

    private readonly _layoutHighScore!      : IUiLayout;
    private readonly _labelHighScoreTitle!  : IUiLabel;
    private readonly _labelHighScore!       : IUiLabel;

    private readonly _btnStart!             : IUiButton;

    private readonly _listPlayer!           : IUiScrollList<DataForPlayerRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
            showLang(TextType.A0857);
        }
    }

    private async _onTouchedBtnStart(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator = openData.warCreator;
        openPanel(getDict().CommonChooseSingleSpmSaveSlotPanel, {
            currentSlotIndex        : warCreator.getSaveSlotIndex(),
            needComment             : false,
            needConfirmOverwrite    : true,
            callback                : slotIndex => {
                warCreator.setSaveSlotIndex(slotIndex);
                reqSpmCreateSrw(warCreator.generateData());
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
        this._labelTitle.setLangText(TextType.B0908);
        this._labelWarRuleTitle.setLangText(TextType.B0909);
        this._labelHighScoreTitle.setLangText(TextType.B0907);
        this._btnStart.setLangText(TextType.B0249);

        this._layoutHighScore.arrangeItems();
    }

    private async _updateBtnModifyWarRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator = openData.warCreator;
        this._btnModifyWarRule.setIsVisible(((await warCreator.getMapRawData()).getTemplateWarRuleArray().filter(v => v.getRuleAvailability()?.getCanSrw()).length) > 1);
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
            ? `#${templateWarRuleId} ${getLanguageText({ textArray: templateWarRule.getRuleNameArray() }) ?? UndefinedError}`
            : UndefinedError
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
        const configVersion = await getLatestConfigVersion();
        const score         = getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray().find(v => (v.getConfigVersion() === configVersion) && (v.getNormalMapId() === normalMapId) && (v.getRuleId() === ruleId))?.getHighScore();
        if (score == null) {
            label.setText(`--`);
        } else {
            const rankIndex = await getRankIndex(normalMapId, ruleId, score);
            label.setText(((rankIndex != null) && (rankIndex > 0))
                ? `${score} (${rankIndex}${getSuffixForRankIndex(rankIndex)})`
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
        const dataArray     = mapRawData ? this._createDataForListPlayer(mapRawData.getPlayersCountUnneutral()) : [];
        await listPlayer.bindData(dataArray);

        const count = dataArray.length;
        this._group.setUnscaledManualWidth(getValueInRange({
            maxValue    : Dimension.DesignWidth,
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

interface DataForPlayerRenderer extends UiListItemData {
    warCreator      : SrrWarCreator;
    playerIndex     : number;
}
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : IUiContainer;
    private readonly _imgSkin!              : IUiImage;
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

        const warCreator    = openData.warCreator;
        const playerData    = warCreator.getPlayerInfo(openData.playerIndex);
        const coId          = playerData ? playerData.getCoId() : null;
        if ((coId != null) && (coId !== CoId.Empty)) {
            openPanel(getDict().CommonCoInfoPanel, {
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
        const warRuleCommonData = getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gcData,
            currentCoId         : currentCoId,
            isBan               : false,
            availableCoIdArray  : [...getFinalSrwHumanCoIdSet({
                playerRule      : getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            })],
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

        const playerData = warCreator.getPlayerInfo(openData.playerIndex);
        this._imgSkin.loadSource(getCoHeadFrame(playerData.getUnitAndTileSkinId()));
        this._labelPlayerType.setLangText(playerData.getUserId() == null ? TextType.B0607 : TextType.B0031);

        const coId          = playerData.getCoId();
        const gameConfig    = await getGameConfig(getExisted(settingsForCommon.getConfigVersion()));
        const coCfg         = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(getCoHead(gameConfig, coId) ?? UndefinedError);
    }
}
