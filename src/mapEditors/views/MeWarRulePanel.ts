import {
    WarRules_Constants,
    WarRules_Utils_CommonData,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Users_Model,
    Tiles_Utils_Common,
    Helpers_Collection,
    GameModes_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnAddRule!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCloneRule!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteRule!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listWarRule!                  : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarRuleNameRenderer>;

    private readonly _labelRuleNameTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyRuleName!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelRuleName!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelpHasFog!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelHasFogTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyHasFog!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgHasFog!                    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupHelpWeather!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWeatherTitle!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyWeather!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWeather!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelpTileTheme!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTileThemeTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyTileTheme!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTileTheme!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelpRuleAvailability!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelRuleAvailabilityTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyRuleAvailability!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelRuleAvailability!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelpPlayerRule!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPlayerRuleTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyPlayerRule!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPlayerRule!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelpWarEvent!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWarEventTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyWarEvent!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWarEvent!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelpTaskObjective!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTaskObjectiveTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyTaskObjective!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTaskObjective!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelpMapSimpleDialogue!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapSimpleDialogueTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyMapSimpleDialogue! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapSimpleDialogue!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MeWarRuleWarEventIdArrayChanged,             callback: this._onNotifyMeWarRuleWarEventIdArrayChanged },
            { type: Notifications_TypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged,        callback: this._onNotifyMeWarRuleTaskObjectiveIdArrayChanged },
            { type: Notifications_TypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleSimpleDialogueIdArrayChanged },
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
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0096));
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0097),
                    callback: () => {
                        war.deleteTemplateWarRule(selectedRule.getRuleId());
                        this._resetView();
                    },
                });
            }
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => [
                Lang_Utils.getText(Lang_Constants.TextType.A0795),
                ``,
                Lang_Utils.getText(Lang_Constants.TextType.A0782),
            ].join(`\n`),
        });
    }

    private _onTouchedBtnAddRule(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const count = war.getTemplateWarRuleArray().length;
        if ((count >= WarRules_Constants.Constants.MaxCount) ||
            ((war.getCampaignMapData()) && (count >= 1))
        ) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0099));
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
        if ((count >= WarRules_Constants.Constants.MaxCount) ||
            ((war.getCampaignMapData()) && (count >= 1))
        ) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0099));
            return;
        }

        const srcRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (srcRule == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        war.addTemplateWarRule(srcRule.clone());
        this._resetView();
    }

    private _onTouchedGroupHelpHasFog(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle  : () => Lang_Utils.getText(Lang_Constants.TextType.B0020),
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.R0002),
        });
    }

    private _onTouchedGroupModifyHasFog(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (this.getOpenData()?.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const warRuleCommonData = Helpers_Misc.getExisted(templateWarRule.getWarRuleCommonData());
            warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
            this._updateImgHasFog(templateWarRule);
        }
    }

    private _onTouchedGroupHelpWeather(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getWeatherFullDesc(gameConfig),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            WarRules_Utils_CommonData.tickDefaultWeatherType(
                Helpers_Misc.getExisted(templateWarRule.getWarRuleCommonData()),
                war.getGcData()
            );
            this._updateLabelWeather(templateWarRule);
        }
    }

    private _onTouchedGroupHelpTileTheme(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0794),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const ruleForGlobalParams = templateWarRule.createIfNotExistsWarRuleCommonData();
            ruleForGlobalParams.setFixedTileTheme(Tiles_Utils_Common.getNextThemeId(ruleForGlobalParams.getFixedTileTheme() ?? null));
            this._updateLabelTileTheme(templateWarRule);

            war.getInstanceWarRule().createIfNotExistsWarRuleCommonData().setFixedTileTheme(ruleForGlobalParams.getFixedTileTheme());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.flushDataToView();
            }
        }
    }

    private _onTouchedGroupHelpRuleAvailability(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0796),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (war.getCampaignMapData()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const ruleAvailability      = templateWarRule.createIfNotExistsRuleAvailability();
        const currentGameModeArray  = Helpers_Collection.getNonNullElements([
            ruleAvailability.getCanCcw() ? GameModes_Constants.ModeId.Coop : null,
            ruleAvailability.getCanMcw() ? GameModes_Constants.ModeId.Versus : null,
            ruleAvailability.getCanMrw() ? GameModes_Constants.ModeId.RankedMatch : null,
            ruleAvailability.getCanSrw() ? GameModes_Constants.ModeId.WarRoom : null,
        ]);
        if (war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowGameModePanel, {
                currentGameModeArray    : currentGameModeArray,
                availableGameModeArray  : [
                    GameModes_Constants.ModeId.Versus,
                    GameModes_Constants.ModeId.Coop,
                    GameModes_Constants.ModeId.RankedMatch,
                    GameModes_Constants.ModeId.WarRoom,
                ],
            });
        } else {
            const availableGameModeArray = [
                GameModes_Constants.ModeId.Versus,
                GameModes_Constants.ModeId.Coop,
                GameModes_Constants.ModeId.WarRoom,
            ];
            if (Users_Model.getIsSelfMapCommittee()) {
                availableGameModeArray.push(GameModes_Constants.ModeId.RankedMatch);
            }

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : currentGameModeArray,
                availableNumberArray    : availableGameModeArray,
                getTitleText            : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B1013)),
                getNumberMainText       : gameMode => Lang_Utils.getGameModeName(gameMode) ?? Lang_Constants.UndefinedError,
                callbackOnHelp          : gameMode => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                    getContent : () => Lang_Utils.getGameModeHelpText(gameMode) ?? Lang_Constants.UndefinedError,
                }),
                callbackOnConfirm       : gameModeArray => {
                    const canCcw    = gameModeArray.indexOf(GameModes_Constants.ModeId.Coop) >= 0;
                    const canMcw    = gameModeArray.indexOf(GameModes_Constants.ModeId.Versus) >= 0;
                    const canMrw    = gameModeArray.indexOf(GameModes_Constants.ModeId.RankedMatch) >= 0;
                    const canSrw    = gameModeArray.indexOf(GameModes_Constants.ModeId.WarRoom) >= 0;
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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0804),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeWarRulePlayerRulePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpWarEvent(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0793),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeWarRuleWarEventPanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpTaskObjective(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0713),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeWarRuleTaskObjectivePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpMapSimpleDialogue(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0788),
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeWarRuleMapSimpleDialoguePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupModifyRuleName(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currentNameArray = templateWarRule.getRuleNameArray();
        if (this.getOpenData()?.war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowLangTextPanel, {
                textArray   : currentNameArray,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : currentNameArray,
                maxTextLength       : WarRules_Constants.Constants.MaxNameLength,
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0314);
        this._labelRuleNameTitle.setLangText(Lang_Constants.TextType.B0315);
        this._labelHasFogTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0549)} ?`);
        this._labelWeatherTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.Weather)} ?`);
        this._labelTileThemeTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1113)} ?`);
        this._labelRuleAvailabilityTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1013)} ?`);
        this._labelPlayerRuleTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0407)} ?`);
        this._labelWarEventTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0461)} ?`);
        this._labelTaskObjectiveTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1214)} ?`);
        this._labelMapSimpleDialogueTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1095)} ?`);
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
        this._labelRuleName.setText(Lang_Utils.getJoinedShortLanguageText(templateWarRule?.getRuleNameArray(), 30));
    }
    private _updateLabelWeather(templateWarRule: TemplateWarRule | null): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        this._labelWeather.setText(Lang_Utils.getWeatherName(
            templateWarRule
                ? WarRules_Utils_CommonData.getDefaultWeatherType(
                    Helpers_Misc.getExisted(templateWarRule.getWarRuleCommonData()),
                    gameConfig
                )
                : gameConfig.getDefaultWeatherType(),
            gameConfig
        ) ?? Lang_Constants.UndefinedError);
    }
    private _updateImgHasFog(templateWarRule: TemplateWarRule | null): void {
        this._imgHasFog.setIsVisible(!!templateWarRule?.getWarRuleCommonData()?.getHasFogByDefault());
    }
    private _updateLabelTileTheme(templateWarRule: TemplateWarRule | null): void {
        const fixedTileTheme    = templateWarRule?.getWarRuleCommonData()?.getFixedTileTheme();
        const label             = this._labelTileTheme;
        if (fixedTileTheme == null) {
            label.setLangText(Lang_Constants.TextType.B0890);
        } else {
            label.setText(Lang_Utils.getTileThemeName(fixedTileTheme) ?? Lang_Constants.UndefinedError);
        }
    }
    private _updateLabelRuleAvailability(templateWarRule: TemplateWarRule | null): void {
        const label = this._labelRuleAvailability;
        if (this.getOpenData()?.war.getCampaignMapData()) {
            label.setLangText(Lang_Constants.TextType.B1135);
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

interface DataForWarRuleNameRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    templateWarRule : TemplateWarRule;
    panel           : Panel;
}
class WarRuleNameRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForWarRuleNameRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForWarRuleNameRenderer>
{
    private readonly _labelId!  : Ui_Interfaces_IUiLabel.IUiLabel;

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
