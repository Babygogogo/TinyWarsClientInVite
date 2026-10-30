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
    NormalMap_Model_NormalMapProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export interface OpenData {
    gcData          : GameConfigs_GameConfig.GameConfig;
    mapRawData      : MapRawData;
    templateWarRule : TemplateWarRule;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnAddRule!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

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
            { type: Notifications_TypeId.TypeId.MsgMmAddWarRule,                             callback: this._onNotifyMsgMmAddWarRule },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnAddRule,                     callback: this._onTouchedBtnAddRule },

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
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateComponentsForRule();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMeWarRuleWarEventIdArrayChanged(): void {
        this._updateLabelWarEvent();
    }

    private _onNotifyMeWarRuleTaskObjectiveIdArrayChanged(): void {
        this._updateLabelTaskObjective();
    }

    private _onNotifyMeWarRuleSimpleDialogueIdArrayChanged(): void {
        this._updateLabelMapSimpleDialogue();
    }

    private _onNotifyMsgMmAddWarRule(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this.closePanel();
    }

    private _onTouchedBtnAddRule(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.A0282),
            callback    : () => NormalMap_Model_NormalMapProxy.reqMmAddWarRule(openData.mapRawData.getNormalMapId(), openData.templateWarRule),
        });
    }

    private _onTouchedGroupHelpHasFog(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle  : () => Lang_Utils.getText(Lang_Constants.TextType.B0020),
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.R0002),
        });
    }

    private _onTouchedGroupModifyHasFog(): void {
        const templateWarRule = this.getOpenData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const warRuleCommonData = Helpers_Misc.getExisted(templateWarRule.getWarRuleCommonData());
        warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
        this._updateImgHasFog();
    }

    private _onTouchedGroupHelpWeather(): void {
        const gcData = this.getOpenData()?.gcData;
        if (gcData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getWeatherFullDesc(gcData),
        });
    }
    private _onTouchedGroupModifyWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        WarRules_Utils_CommonData.tickDefaultWeatherType(
            Helpers_Misc.getExisted(openData.templateWarRule.getWarRuleCommonData()),
            openData.gcData
        );
        this._updateLabelWeather();
    }

    private _onTouchedGroupHelpTileTheme(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0794),
        });
    }
    private _onTouchedGroupModifyTileTheme(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const ruleForGlobalParams = openData.templateWarRule.createIfNotExistsWarRuleCommonData();
        ruleForGlobalParams.setFixedTileTheme(Tiles_Utils_Common.getNextThemeId(ruleForGlobalParams.getFixedTileTheme()));
        this._updateLabelTileTheme();
    }

    private _onTouchedGroupHelpRuleAvailability(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0796),
        });
    }
    private _onTouchedGroupModifyRuleAvailability(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (openData.mapRawData.getCampaignMapData()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const availableGameModeArray = [
            GameModes_Constants.ModeId.Versus,
            GameModes_Constants.ModeId.Coop,
            GameModes_Constants.ModeId.WarRoom,
        ];
        if (Users_Model.getIsSelfMapCommittee()) {
            availableGameModeArray.push(GameModes_Constants.ModeId.RankedMatch);
        }

        const templateWarRule   = openData.templateWarRule;
        const ruleAvailability  = templateWarRule.createIfNotExistsRuleAvailability();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : Helpers_Collection.getNonNullElements([
                ruleAvailability.getCanCcw() ? GameModes_Constants.ModeId.Coop : null,
                ruleAvailability.getCanMcw() ? GameModes_Constants.ModeId.Versus : null,
                ruleAvailability.getCanMrw() ? GameModes_Constants.ModeId.RankedMatch : null,
                ruleAvailability.getCanSrw() ? GameModes_Constants.ModeId.WarRoom : null,
            ]),
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

                this._updateLabelRuleAvailability();
            },
        });
    }

    private _onTouchedGroupHelpPlayerRule(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0804),
        });
    }
    private _onTouchedGroupModifyPlayerRule(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmWarRulePlayerRulePanel, {
            gcData          : openData.gcData,
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpWarEvent(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0793),
        });
    }
    private _onTouchedGroupModifyWarEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmWarRuleWarEventPanel, {
            warEventArray   : openData.mapRawData.getWarEventFullData()?.getEventArray() ?? [],
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpTaskObjective(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0713),
        });
    }
    private _onTouchedGroupModifyTaskObjective(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmWarRuleTaskObjectivePanel, {
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpMapSimpleDialogue(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent: () => Lang_Utils.getText(Lang_Constants.TextType.A0788),
        });
    }
    private _onTouchedGroupModifyMapSimpleDialogue(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmWarRuleMapSimpleDialoguePanel, {
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupModifyRuleName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const templateWarRule = openData.templateWarRule;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : templateWarRule.getRuleNameArray(),
            maxTextLength       : WarRules_Constants.Constants.MaxNameLength,
            callback            : nameArray => {
                templateWarRule.setRuleNameArray(nameArray);
                this._updateLabelRuleName();
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0320);
        this._btnAddRule.setLangText(Lang_Constants.TextType.B0026);
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

    private _updateComponentsForRule(): void {
        this._updateLabelRuleName();
        this._updateLabelWeather();
        this._updateImgHasFog();
        this._updateLabelTileTheme();
        this._updateLabelRuleAvailability();
        this._updateLabelPlayerRule();
        this._updateLabelWarEvent();
        this._updateLabelTaskObjective();
        this._updateLabelMapSimpleDialogue();
    }

    private _updateLabelRuleName(): void {
        this._labelRuleName.setText(Lang_Utils.getJoinedShortLanguageText(this.getOpenData()?.templateWarRule.getRuleNameArray(), 30));
    }
    private _updateLabelWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gcData = openData.gcData;
        this._labelWeather.setText(Lang_Utils.getWeatherName(
            WarRules_Utils_CommonData.getDefaultWeatherType(
                Helpers_Misc.getExisted(openData.templateWarRule.getWarRuleCommonData()),
                gcData
            ),
            gcData
        ) ?? Lang_Constants.UndefinedError);
    }
    private _updateImgHasFog(): void {
        this._imgHasFog.setIsVisible(!!this.getOpenData()?.templateWarRule.getWarRuleCommonData()?.getHasFogByDefault());
    }
    private _updateLabelTileTheme(): void {
        const fixedTileTheme    = this.getOpenData()?.templateWarRule.getWarRuleCommonData()?.getFixedTileTheme();
        const label             = this._labelTileTheme;
        if (fixedTileTheme == null) {
            label.setLangText(Lang_Constants.TextType.B0890);
        } else {
            label.setText(Lang_Utils.getTileThemeName(fixedTileTheme) ?? Lang_Constants.UndefinedError);
        }
    }
    private _updateLabelRuleAvailability(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const label = this._labelRuleAvailability;
        if (openData.mapRawData.getCampaignMapData()) {
            label.setLangText(Lang_Constants.TextType.B1135);
        } else {
            const availability = openData.templateWarRule.getRuleAvailability();
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
        this._labelPlayerRule.setText(`${this.getOpenData()?.templateWarRule.getWarRuleCommonData()?.getPlayerRuleList().length}`);
    }
    private _updateLabelWarEvent(): void {
        this._labelWarEvent.setText(`${this.getOpenData()?.templateWarRule.getWarEventIdArray().length}`);
    }
    private _updateLabelTaskObjective(): void {
        this._labelTaskObjective.setText(`${this.getOpenData()?.templateWarRule.getTaskObjectiveIdArray().length}`);
    }
    private _updateLabelMapSimpleDialogue(): void {
        this._labelMapSimpleDialogue.setText(`${this.getOpenData()?.templateWarRule.getMapSimpleDialogueIdArray().length}`);
    }
}
