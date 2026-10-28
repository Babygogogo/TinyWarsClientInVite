import { showLang } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
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
import { reqMmAddWarRule } from "../../normalMap/model/NormalMapProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getNextThemeId } from "../../tiles/utils/Common.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { getIsSelfMapCommittee } from "../../users/Model.ts";
import { Constants } from "../../warRules/Constants.ts";
import { tickDefaultWeatherType, getDefaultWeatherType } from "../../warRules/utils/CommonData.ts";

export interface OpenData {
    gcData          : GameConfig;
    mapRawData      : MapRawData;
    templateWarRule : TemplateWarRule;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnAddRule!                   : IUiButton;
    private readonly _btnClose!                     : IUiButton;

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
            { type: TypeId.MsgMmAddWarRule,                             callback: this._onNotifyMsgMmAddWarRule },
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
        showLang(TextType.OperationSucceeded);
        this.closePanel();
    }

    private _onTouchedBtnAddRule(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0282),
            callback    : () => reqMmAddWarRule(openData.mapRawData.getNormalMapId(), openData.templateWarRule),
        });
    }


    private _onTouchedGroupHelpHasFog(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getTitle  : () => getText(TextType.B0020),
            getContent: () => getText(TextType.R0002),
        });
    }

    private _onTouchedGroupModifyHasFog(): void {
        const templateWarRule = this.getOpenData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const warRuleCommonData = getExisted(templateWarRule.getWarRuleCommonData());
        warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
        this._updateImgHasFog();
    }

    private _onTouchedGroupHelpWeather(): void {
        const gcData = this.getOpenData()?.gcData;
        if (gcData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getWeatherFullDesc(gcData),
        });
    }
    private _onTouchedGroupModifyWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        tickDefaultWeatherType(
            getExisted(openData.templateWarRule.getWarRuleCommonData()),
            openData.gcData
        );
        this._updateLabelWeather();
    }

    private _onTouchedGroupHelpTileTheme(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0794),
        });
    }
    private _onTouchedGroupModifyTileTheme(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const ruleForGlobalParams = openData.templateWarRule.createIfNotExistsWarRuleCommonData();
        ruleForGlobalParams.setFixedTileTheme(getNextThemeId(ruleForGlobalParams.getFixedTileTheme()));
        this._updateLabelTileTheme();
    }

    private _onTouchedGroupHelpRuleAvailability(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0796),
        });
    }
    private _onTouchedGroupModifyRuleAvailability(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (openData.mapRawData.getCampaignMapData()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const availableGameModeArray = [
            ModeId.Versus,
            ModeId.Coop,
            ModeId.WarRoom,
        ];
        if (getIsSelfMapCommittee()) {
            availableGameModeArray.push(ModeId.RankedMatch);
        }

        const templateWarRule   = openData.templateWarRule;
        const ruleAvailability  = templateWarRule.createIfNotExistsRuleAvailability();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : getNonNullElements([
                ruleAvailability.getCanCcw() ? ModeId.Coop : null,
                ruleAvailability.getCanMcw() ? ModeId.Versus : null,
                ruleAvailability.getCanMrw() ? ModeId.RankedMatch : null,
                ruleAvailability.getCanSrw() ? ModeId.WarRoom : null,
            ]),
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

                this._updateLabelRuleAvailability();
            },
        });
    }

    private _onTouchedGroupHelpPlayerRule(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0804),
        });
    }
    private _onTouchedGroupModifyPlayerRule(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MmWarRulePlayerRulePanel, {
            gcData          : openData.gcData,
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpWarEvent(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0793),
        });
    }
    private _onTouchedGroupModifyWarEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MmWarRuleWarEventPanel, {
            warEventArray   : openData.mapRawData.getWarEventFullData()?.getEventArray() ?? [],
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpTaskObjective(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0713),
        });
    }
    private _onTouchedGroupModifyTaskObjective(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MmWarRuleTaskObjectivePanel, {
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpMapSimpleDialogue(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0788),
        });
    }
    private _onTouchedGroupModifyMapSimpleDialogue(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MmWarRuleMapSimpleDialoguePanel, {
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupModifyRuleName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const templateWarRule = openData.templateWarRule;
        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : templateWarRule.getRuleNameArray(),
            maxTextLength       : Constants.MaxNameLength,
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
        this._labelTitle.setLangText(TextType.B0320);
        this._btnAddRule.setLangText(TextType.B0026);
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
        this._labelRuleName.setText(getJoinedShortLanguageText(this.getOpenData()?.templateWarRule.getRuleNameArray(), 30));
    }
    private _updateLabelWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gcData = openData.gcData;
        this._labelWeather.setText(getWeatherName(
            getDefaultWeatherType(
                getExisted(openData.templateWarRule.getWarRuleCommonData()),
                gcData
            ),
            gcData
        ) ?? UndefinedError);
    }
    private _updateImgHasFog(): void {
        this._imgHasFog.setIsVisible(!!this.getOpenData()?.templateWarRule.getWarRuleCommonData()?.getHasFogByDefault());
    }
    private _updateLabelTileTheme(): void {
        const fixedTileTheme    = this.getOpenData()?.templateWarRule.getWarRuleCommonData()?.getFixedTileTheme();
        const label             = this._labelTileTheme;
        if (fixedTileTheme == null) {
            label.setLangText(TextType.B0890);
        } else {
            label.setText(getTileThemeName(fixedTileTheme) ?? UndefinedError);
        }
    }
    private _updateLabelRuleAvailability(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const label = this._labelRuleAvailability;
        if (openData.mapRawData.getCampaignMapData()) {
            label.setLangText(TextType.B1135);
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
