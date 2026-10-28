import { show, showLang } from "../../FloatText.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getText,
    getWeatherFullDesc,
    getFormattedText,
    getGameModeName,
    getGameModeHelpText,
    getJoinedShortLanguageText,
    getWeatherName,
    getTileThemeName,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getNextThemeId } from "../../tiles/utils/Common.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getIsSelfMapCommittee } from "../../users/Model.ts";
import { Constants } from "../../warRules/Constants.ts";
import { tickDefaultWeatherType, getDefaultWeatherType } from "../../warRules/utils/CommonData.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnAddRule!                   : IUiButton;
    private readonly _btnCloneRule!                 : IUiButton;
    private readonly _btnDeleteRule!                : IUiButton;
    private readonly _btnHelp!                      : IUiButton;
    private readonly _btnClose!                     : IUiButton;

    private readonly _listWarRule!                  : IUiScrollList<DataForWarRuleNameRenderer>;

    private readonly _labelRuleNameTitle!           : IUiLabel;
    private readonly _groupModifyRuleName!          : IUiContainer;
    private readonly _labelRuleName!                : IUiLabel;

    private readonly _groupHelpHasFog!              : IUiContainer;
    private readonly _labelHasFogTitle!             : IUiLabel;
    private readonly _groupModifyHasFog!            : IUiContainer;
    private readonly _imgHasFog!                    : IUiImage;

    private readonly _groupHelpWeather!             : IUiContainer;
    private readonly _labelWeatherTitle!            : IUiLabel;
    private readonly _groupModifyWeather!           : IUiContainer;
    private readonly _labelWeather!                 : IUiLabel;

    private readonly _groupHelpTileTheme!           : IUiContainer;
    private readonly _labelTileThemeTitle!          : IUiLabel;
    private readonly _groupModifyTileTheme!         : IUiContainer;
    private readonly _labelTileTheme!               : IUiLabel;

    private readonly _groupHelpRuleAvailability!    : IUiContainer;
    private readonly _labelRuleAvailabilityTitle!   : IUiLabel;
    private readonly _groupModifyRuleAvailability!  : IUiContainer;
    private readonly _labelRuleAvailability!        : IUiLabel;

    private readonly _groupHelpPlayerRule!          : IUiContainer;
    private readonly _labelPlayerRuleTitle!         : IUiLabel;
    private readonly _groupModifyPlayerRule!        : IUiContainer;
    private readonly _labelPlayerRule!              : IUiLabel;

    private readonly _groupHelpWarEvent!            : IUiContainer;
    private readonly _labelWarEventTitle!           : IUiLabel;
    private readonly _groupModifyWarEvent!          : IUiContainer;
    private readonly _labelWarEvent!                : IUiLabel;

    private readonly _groupHelpTaskObjective!       : IUiContainer;
    private readonly _labelTaskObjectiveTitle!      : IUiLabel;
    private readonly _groupModifyTaskObjective!     : IUiContainer;
    private readonly _labelTaskObjective!           : IUiLabel;

    private readonly _groupHelpMapSimpleDialogue!   : IUiContainer;
    private readonly _labelMapSimpleDialogueTitle!  : IUiLabel;
    private readonly _groupModifyMapSimpleDialogue! : IUiContainer;
    private readonly _labelMapSimpleDialogue!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeWarRuleWarEventIdArrayChanged,             callback: this._onNotifyMeWarRuleWarEventIdArrayChanged },
            { type: TypeId.MeWarRuleTaskObjectiveIdArrayChanged,        callback: this._onNotifyMeWarRuleTaskObjectiveIdArrayChanged },
            { type: TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleSimpleDialogueIdArrayChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnAddRule,                     callback: this._onTouchedBtnAddRule },
            { ui: this._btnCloneRule,                   callback: this._onTouchedBtnCloneRule },
            { ui: this._btnDeleteRule,                  callback: this._onTouchedBtnDeleteRule },
            { ui: this._btnHelp,                        callback: this._onTouchedBtnHelp },

            { ui: this._groupModifyRuleName,            callback: this._onTouchedGroupModifyRuleName },

            { ui: this._groupHelpHasFog,                callback: this._onTouchedGroupHelpHasFog },
            { ui: this._groupModifyHasFog,              callback: this._onTouchedGroupModifyHasFog },

            { ui: this._groupHelpWeather,               callback: this._onTouchedGroupHelpWeather },
            { ui: this._groupModifyWeather,             callback: this._onTouchedGroupModifyWeather },

            { ui: this._groupHelpTileTheme,             callback: this._onTouchedGroupHelpTileTheme },
            { ui: this._groupModifyTileTheme,           callback: this._onTouchedGroupModifyTileTheme },

            { ui: this._groupHelpRuleAvailability,      callback: this._onTouchedGroupHelpRuleAvailability },
            { ui: this._groupModifyRuleAvailability,    callback: this._onTouchedGroupModifyRuleAvailability },

            { ui: this._groupHelpPlayerRule,            callback: this._onTouchedGroupHelpPlayerRule },
            { ui: this._groupModifyPlayerRule,          callback: this._onTouchedGroupModifyPlayerRule },

            { ui: this._groupHelpWarEvent,              callback: this._onTouchedGroupHelpWarEvent },
            { ui: this._groupModifyWarEvent,            callback: this._onTouchedGroupModifyWarEvent },

            { ui: this._groupHelpTaskObjective,         callback: this._onTouchedGroupHelpTaskObjective },
            { ui: this._groupModifyTaskObjective,       callback: this._onTouchedGroupModifyTaskObjective },

            { ui: this._groupHelpMapSimpleDialogue,     callback: this._onTouchedGroupHelpMapSimpleDialogue },
            { ui: this._groupModifyMapSimpleDialogue,   callback: this._onTouchedGroupModifyMapSimpleDialogue },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listWarRule.setItemRendererClass(WarRuleNameRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._resetView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listWarRule.removeAllItems();

        await super._onClosed();
    }

    public setSelectedIndex(newIndex: number): void {
        const list      = this._listWarRule;
        const length    = list.getBoundDataArray()?.length ?? 0;
        newIndex = newIndex >= 0 && newIndex < length ? newIndex : -1;
        list.setSelectedItemIndex(newIndex);
        this._updateComponentsForRule();

        // const dataList = this._dataForListWarRule;
        // if (!dataList[newIndex]) {
        //     this._selectedIndex = null;
        //     this._selectedRule  = null;
        //     this._updateComponentsForRule();

        // } else {
        //     const oldIndex      = this.getSelectedIndex();
        //     this._selectedIndex = newIndex;
        //     this._selectedRule  = dataList[newIndex].templateWarRule;
        //     if ((oldIndex != null) && (dataList[oldIndex])) {
        //         this._listWarRule.updateSingleData(oldIndex, dataList[oldIndex]);
        //     }
        //     (oldIndex !== newIndex) && (this._listWarRule.updateSingleData(newIndex, dataList[newIndex]));

        //     this._updateComponentsForRule();
        // }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMeWarRuleWarEventIdArrayChanged(): void {
        this._updateLabelWarEvent(this._listWarRule.getFirstSelectedData()?.templateWarRule ?? null);
    }

    private _onNotifyMeWarRuleTaskObjectiveIdArrayChanged(): void {
        this._updateLabelTaskObjective(this._listWarRule.getFirstSelectedData()?.templateWarRule ?? null);
    }

    private _onNotifyMeWarRuleSimpleDialogueIdArrayChanged(): void {
        this._updateLabelMapSimpleDialogue(this._listWarRule.getFirstSelectedData()?.templateWarRule ?? null);
    }

    private _onTouchedBtnDeleteRule(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const selectedRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (selectedRule != null) {
            if (war.getTemplateWarRuleArray().length <= 1) {
                show(getText(TextType.A0096));
            } else {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent : () => getText(TextType.A0097),
                    callback: () => {
                        war.deleteTemplateWarRule(selectedRule.getRuleId());
                        this._resetView();
                    },
                });
            }
        }
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => [
                getText(TextType.A0795),
                ``,
                getText(TextType.A0782),
            ].join(`\n`),
        });
    }

    private _onTouchedBtnAddRule(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const count = war.getTemplateWarRuleArray().length;
        if ((count >= Constants.MaxCount) ||
            ((war.getCampaignMapData()) && (count >= 1))
        ) {
            show(getText(TextType.A0099));
        } else {
            war.addEmptyTemplateWarRule();
            this._resetView();
        }
    }

    private _onTouchedBtnCloneRule(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const count = war.getTemplateWarRuleArray().length;
        if ((count >= Constants.MaxCount) ||
            ((war.getCampaignMapData()) && (count >= 1))
        ) {
            show(getText(TextType.A0099));
            return;
        }

        const srcRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (srcRule == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        war.addTemplateWarRule(srcRule.clone());
        this._resetView();
    }

    private _onTouchedGroupHelpHasFog(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getTitle  : () => getText(TextType.B0020),
            getContent: () => getText(TextType.R0002),
        });
    }

    private _onTouchedGroupModifyHasFog(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (this.getOpenData()?.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const warRuleCommonData = getExisted(templateWarRule.getWarRuleCommonData());
            warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
            this._updateImgHasFog(templateWarRule);
        }
    }

    private _onTouchedGroupHelpWeather(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getWeatherFullDesc(gameConfig),
        });
    }
    private _onTouchedGroupModifyWeather(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            tickDefaultWeatherType(
                getExisted(templateWarRule.getWarRuleCommonData()),
                war.getGcData()
            );
            this._updateLabelWeather(templateWarRule);
        }
    }

    private _onTouchedGroupHelpTileTheme(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0794),
        });
    }
    private _onTouchedGroupModifyTileTheme(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const ruleForGlobalParams = templateWarRule.createIfNotExistsWarRuleCommonData();
            ruleForGlobalParams.setFixedTileTheme(getNextThemeId(ruleForGlobalParams.getFixedTileTheme() ?? null));
            this._updateLabelTileTheme(templateWarRule);

            war.getInstanceWarRule().createIfNotExistsWarRuleCommonData().setFixedTileTheme(ruleForGlobalParams.getFixedTileTheme());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.flushDataToView();
            }
        }
    }

    private _onTouchedGroupHelpRuleAvailability(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0796),
        });
    }
    private _onTouchedGroupModifyRuleAvailability(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (war.getCampaignMapData()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const ruleAvailability      = templateWarRule.createIfNotExistsRuleAvailability();
        const currentGameModeArray  = getNonNullElements([
            ruleAvailability.getCanCcw() ? ModeId.Coop : null,
            ruleAvailability.getCanMcw() ? ModeId.Versus : null,
            ruleAvailability.getCanMrw() ? ModeId.RankedMatch : null,
            ruleAvailability.getCanSrw() ? ModeId.WarRoom : null,
        ]);
        if (war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowGameModePanel, {
                currentGameModeArray    : currentGameModeArray,
                availableGameModeArray  : [
                    ModeId.Versus,
                    ModeId.Coop,
                    ModeId.RankedMatch,
                    ModeId.WarRoom,
                ],
            });
        } else {
            const availableGameModeArray = [
                ModeId.Versus,
                ModeId.Coop,
                ModeId.WarRoom,
            ];
            if (getIsSelfMapCommittee()) {
                availableGameModeArray.push(ModeId.RankedMatch);
            }

            openPanel(getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : currentGameModeArray,
                availableNumberArray    : availableGameModeArray,
                getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B1013)),
                getNumberMainText       : gameMode => getGameModeName(gameMode) ?? UndefinedError,
                callbackOnHelp          : gameMode => openPanel(getDict().CommonHelpPanel, {
                    getContent : () => getGameModeHelpText(gameMode) ?? UndefinedError,
                }),
                callbackOnConfirm       : gameModeArray => {
                    const canCcw    = gameModeArray.indexOf(ModeId.Coop) >= 0;
                    const canMcw    = gameModeArray.indexOf(ModeId.Versus) >= 0;
                    const canMrw    = gameModeArray.indexOf(ModeId.RankedMatch) >= 0;
                    const canSrw    = gameModeArray.indexOf(ModeId.WarRoom) >= 0;
                    templateWarRule.setRuleAvailability(RuleAvailability.fromJson({
                        canCcw  : canCcw,
                        canMcw  : canMcw,
                        canMrw  : canMrw,
                        canSrw  : canSrw,
                    }));

                    // if (!canCcw) {
                    //     for (const playerRule of templateWarRule.ruleForPlayers?.playerRuleDataArray ?? []) {
                    //         playerRule.fixedCoIdInCcw = null;
                    //     }
                    // }

                    this._updateLabelRuleAvailability(templateWarRule);
                },
            });
        }
    }

    private _onTouchedGroupHelpPlayerRule(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0804),
        });
    }
    private _onTouchedGroupModifyPlayerRule(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeWarRulePlayerRulePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpWarEvent(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0793),
        });
    }
    private _onTouchedGroupModifyWarEvent(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeWarRuleWarEventPanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpTaskObjective(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0713),
        });
    }
    private _onTouchedGroupModifyTaskObjective(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeWarRuleTaskObjectivePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpMapSimpleDialogue(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0788),
        });
    }
    private _onTouchedGroupModifyMapSimpleDialogue(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeWarRuleMapSimpleDialoguePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupModifyRuleName(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currentNameArray = templateWarRule.getRuleNameArray();
        if (this.getOpenData()?.war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowLangTextPanel, {
                textArray   : currentNameArray,
            });
        } else {
            openPanel(getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : currentNameArray,
                maxTextLength       : Constants.MaxNameLength,
                callback            : nameArray => {
                    templateWarRule.setRuleNameArray(nameArray);
                    this._updateLabelRuleName(templateWarRule);
                },
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _resetView(): Promise<void> {
        await this._listWarRule.bindData(this._createDataForListWarRule());
        this.setSelectedIndex(0);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0314);
        this._labelRuleNameTitle.setLangText(TextType.B0315);
        this._labelHasFogTitle.setText(`${getText(TextType.B0549)} ?`);
        this._labelWeatherTitle.setText(`${getText(TextType.Weather)} ?`);
        this._labelTileThemeTitle.setText(`${getText(TextType.B1113)} ?`);
        this._labelRuleAvailabilityTitle.setText(`${getText(TextType.B1013)} ?`);
        this._labelPlayerRuleTitle.setText(`${getText(TextType.B0407)} ?`);
        this._labelWarEventTitle.setText(`${getText(TextType.B0461)} ?`);
        this._labelTaskObjectiveTitle.setText(`${getText(TextType.B1214)} ?`);
        this._labelMapSimpleDialogueTitle.setText(`${getText(TextType.B1095)} ?`);
    }

    private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
        const data  : DataForWarRuleNameRenderer[] = [];
        let index   = 0;
        for (const templateWarRule of this.getOpenData()?.war.getTemplateWarRuleArray() ?? []) {
            data.push({
                index           : index,
                templateWarRule : templateWarRule,
                panel           : this,
            });
            ++index;
        }

        return data;
    }

    private _updateComponentsForRule(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule ?? null;
        this._updateLabelRuleName(templateWarRule);
        this._updateLabelWeather(templateWarRule);
        this._updateImgHasFog(templateWarRule);
        this._updateLabelTileTheme(templateWarRule);
        this._updateLabelRuleAvailability(templateWarRule);
        this._updateLabelPlayerRule();
        this._updateLabelWarEvent(templateWarRule);
        this._updateLabelTaskObjective(templateWarRule);
        this._updateLabelMapSimpleDialogue(templateWarRule);
    }

    private _updateLabelRuleName(templateWarRule: TemplateWarRule | null): void {
        this._labelRuleName.setText(getJoinedShortLanguageText(templateWarRule?.getRuleNameArray(), 30));
    }
    private _updateLabelWeather(templateWarRule: TemplateWarRule | null): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        this._labelWeather.setText(getWeatherName(
            templateWarRule
                ? getDefaultWeatherType(
                    getExisted(templateWarRule.getWarRuleCommonData()),
                    gameConfig
                )
                : gameConfig.getDefaultWeatherType(),
            gameConfig
        ) ?? UndefinedError);
    }
    private _updateImgHasFog(templateWarRule: TemplateWarRule | null): void {
        this._imgHasFog.setIsVisible(!!templateWarRule?.getWarRuleCommonData()?.getHasFogByDefault());
    }
    private _updateLabelTileTheme(templateWarRule: TemplateWarRule | null): void {
        const fixedTileTheme    = templateWarRule?.getWarRuleCommonData()?.getFixedTileTheme();
        const label             = this._labelTileTheme;
        if (fixedTileTheme == null) {
            label.setLangText(TextType.B0890);
        } else {
            label.setText(getTileThemeName(fixedTileTheme) ?? UndefinedError);
        }
    }
    private _updateLabelRuleAvailability(templateWarRule: TemplateWarRule | null): void {
        const label = this._labelRuleAvailability;
        if (this.getOpenData()?.war.getCampaignMapData()) {
            label.setLangText(TextType.B1135);
        } else {
            const availability = templateWarRule?.getRuleAvailability();
            let count           = 0;
            if (availability) {
                if (availability.getCanCcw()) { ++count; }
                if (availability.getCanMcw()) { ++count; }
                if (availability.getCanMrw()) { ++count; }
                if (availability.getCanSrw()) { ++count; }
            }
            label.setText(`${count}`);
        }
    }
    private _updateLabelPlayerRule(): void {
        this._labelPlayerRule.setText(`${this.getOpenData()?.war.getPlayersCountUnneutral()}`);
    }
    private _updateLabelWarEvent(templateWarRule: TemplateWarRule | null): void {
        this._labelWarEvent.setText(`${templateWarRule?.getWarEventIdArray()?.length ?? 0}`);
    }
    private _updateLabelTaskObjective(templateWarRule: TemplateWarRule | null): void {
        this._labelTaskObjective.setText(`${templateWarRule?.getTaskObjectiveIdArray()?.length ?? 0}`);
    }
    private _updateLabelMapSimpleDialogue(templateWarRule: TemplateWarRule | null): void {
        this._labelMapSimpleDialogue.setText(`${templateWarRule?.getMapSimpleDialogueIdArray()?.length ?? 0}`);
    }
}

interface DataForWarRuleNameRenderer extends UiListItemData {
    index           : number;
    templateWarRule : TemplateWarRule;
    panel           : Panel;
}
class WarRuleNameRenderer
    extends     UiListItemRenderer<DataForWarRuleNameRenderer>
    implements  IUiListItemRenderer<DataForWarRuleNameRenderer>
{
    private readonly _labelId!  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._labelId.setText(`R${this.getOpenData()?.templateWarRule.getRuleId() ?? 0}`);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setSelectedIndex(openData.index);
    }
}
