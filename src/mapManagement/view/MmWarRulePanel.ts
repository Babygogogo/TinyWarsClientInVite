import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapProxy from "../../normalMap/model/NormalMapProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoWarRuleRuleAvailability from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesUtilsCommon from "../../tiles/utils/Common.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarRulesConstants from "../../warRules/Constants.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type GcData             = GameConfigGcData.GcData;
type MapRawData         = ProtoSchemaCommonProtoMapMapRawData.MapRawData;

export interface OpenData {
    gcData          : GcData;
    mapRawData      : MapRawData;
    templateWarRule : ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnAddRule!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _labelRuleNameTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyRuleName!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelRuleName!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelpHasFog!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelHasFogTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyHasFog!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgHasFog!                    : UiInterfacesIUiImage.IUiImage;

    private readonly _groupHelpWeather!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWeatherTitle!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyWeather!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWeather!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelpTileTheme!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTileThemeTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyTileTheme!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTileTheme!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelpRuleAvailability!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelRuleAvailabilityTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyRuleAvailability!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelRuleAvailability!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelpPlayerRule!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPlayerRuleTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyPlayerRule!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPlayerRule!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelpWarEvent!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWarEventTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyWarEvent!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWarEvent!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelpTaskObjective!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTaskObjectiveTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyTaskObjective!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTaskObjective!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelpMapSimpleDialogue!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapSimpleDialogueTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyMapSimpleDialogue! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapSimpleDialogue!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeWarRuleWarEventIdArrayChanged,             callback: this._onNotifyMeWarRuleWarEventIdArrayChanged },
            { type: NotificationsTypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged,        callback: this._onNotifyMeWarRuleTaskObjectiveIdArrayChanged },
            { type: NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleSimpleDialogueIdArrayChanged },
            { type: NotificationsTypeId.TypeId.MsgMmAddWarRule,                             callback: this._onNotifyMsgMmAddWarRule },
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
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this.closePanel();
    }

    private _onTouchedBtnAddRule(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0282),
            callback    : () => NormalMapModelNormalMapProxy.reqMmAddWarRule(openData.mapRawData.getNormalMapId() ?? 0, openData.templateWarRule),
        });
    }


    private _onTouchedGroupHelpHasFog(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle  : () => LangUtils.getText(LangConstants.TextType.B0020),
            getContent: () => LangUtils.getText(LangConstants.TextType.R0002),
        });
    }

    private _onTouchedGroupModifyHasFog(): void {
        const templateWarRule = this.getOpenData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const warRuleCommonData = HelpersMisc.getExisted(templateWarRule.getWarRuleCommonData());
        warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
        this._updateImgHasFog();
    }

    private _onTouchedGroupHelpWeather(): void {
        const gcData = this.getOpenData()?.gcData;
        if (gcData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getWeatherFullDesc(gcData),
        });
    }
    private _onTouchedGroupModifyWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        WarRulesUtilsCommonData.tickDefaultWeatherType(
            HelpersMisc.getExisted(openData.templateWarRule.getWarRuleCommonData()),
            openData.gcData
        );
        this._updateLabelWeather();
    }

    private _onTouchedGroupHelpTileTheme(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0794),
        });
    }
    private _onTouchedGroupModifyTileTheme(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const ruleForGlobalParams = openData.templateWarRule.createIfNotExistsWarRuleCommonData();
        ruleForGlobalParams.setFixedTileTheme(TilesUtilsCommon.getNextThemeId(ruleForGlobalParams.getFixedTileTheme()));
        this._updateLabelTileTheme();
    }

    private _onTouchedGroupHelpRuleAvailability(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0796),
        });
    }
    private _onTouchedGroupModifyRuleAvailability(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (openData.mapRawData.getCampaignMapData()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const availableGameModeArray = [
            GameModesConstants.ModeId.Versus,
            GameModesConstants.ModeId.Coop,
            GameModesConstants.ModeId.WarRoom,
        ];
        if (UsersModel.getIsSelfMapCommittee()) {
            availableGameModeArray.push(GameModesConstants.ModeId.RankedMatch);
        }

        const templateWarRule   = openData.templateWarRule;
        const ruleAvailability  = templateWarRule.createIfNotExistsRuleAvailability();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : HelpersCollection.getNonNullElements([
                ruleAvailability.getCanCcw() ? GameModesConstants.ModeId.Coop : null,
                ruleAvailability.getCanMcw() ? GameModesConstants.ModeId.Versus : null,
                ruleAvailability.getCanMrw() ? GameModesConstants.ModeId.RankedMatch : null,
                ruleAvailability.getCanSrw() ? GameModesConstants.ModeId.WarRoom : null,
            ]),
            availableNumberArray    : availableGameModeArray,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B1013)),
            getNumberMainText       : gameMode => LangUtils.getGameModeName(gameMode) ?? LangConstants.UndefinedError,
            callbackOnHelp          : gameMode => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getGameModeHelpText(gameMode) ?? LangConstants.UndefinedError,
            }),
            callbackOnConfirm       : gameModeArray => {
                const canCcw    = gameModeArray.indexOf(GameModesConstants.ModeId.Coop) >= 0;
                const canMcw    = gameModeArray.indexOf(GameModesConstants.ModeId.Versus) >= 0;
                const canMrw    = gameModeArray.indexOf(GameModesConstants.ModeId.RankedMatch) >= 0;
                const canSrw    = gameModeArray.indexOf(GameModesConstants.ModeId.WarRoom) >= 0;
                templateWarRule.setRuleAvailability(ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability.fromJson({
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
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0804),
        });
    }
    private _onTouchedGroupModifyPlayerRule(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmWarRulePlayerRulePanel, {
            gcData          : openData.gcData,
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpWarEvent(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0793),
        });
    }
    private _onTouchedGroupModifyWarEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmWarRuleWarEventPanel, {
            warEventArray   : openData.mapRawData.getWarEventFullData()?.getEventArray() ?? [],
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpTaskObjective(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0713),
        });
    }
    private _onTouchedGroupModifyTaskObjective(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmWarRuleTaskObjectivePanel, {
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupHelpMapSimpleDialogue(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0788),
        });
    }
    private _onTouchedGroupModifyMapSimpleDialogue(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmWarRuleMapSimpleDialoguePanel, {
            mapRawData      : openData.mapRawData,
            templateWarRule : openData.templateWarRule,
        });
    }

    private _onTouchedGroupModifyRuleName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const templateWarRule = openData.templateWarRule;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : templateWarRule.getRuleNameArray(),
            maxTextLength       : WarRulesConstants.Constants.MaxNameLength,
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
        this._labelTitle.setLangText(LangConstants.TextType.B0320);
        this._btnAddRule.setLangText(LangConstants.TextType.B0026);
        this._labelRuleNameTitle.setLangText(LangConstants.TextType.B0315);
        this._labelHasFogTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0549)} ?`);
        this._labelWeatherTitle.setText(`${LangUtils.getText(LangConstants.TextType.Weather)} ?`);
        this._labelTileThemeTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1113)} ?`);
        this._labelRuleAvailabilityTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1013)} ?`);
        this._labelPlayerRuleTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0407)} ?`);
        this._labelWarEventTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0461)} ?`);
        this._labelTaskObjectiveTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1214)} ?`);
        this._labelMapSimpleDialogueTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1095)} ?`);
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
        this._labelRuleName.setText(LangUtils.getJoinedShortLanguageText(this.getOpenData()?.templateWarRule.getRuleNameArray(), 30));
    }
    private _updateLabelWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gcData = openData.gcData;
        this._labelWeather.setText(LangUtils.getWeatherName(
            WarRulesUtilsCommonData.getDefaultWeatherType(
                HelpersMisc.getExisted(openData.templateWarRule.getWarRuleCommonData()),
                gcData
            ),
            gcData
        ) ?? LangConstants.UndefinedError);
    }
    private _updateImgHasFog(): void {
        this._imgHasFog.setIsVisible(!!this.getOpenData()?.templateWarRule.getWarRuleCommonData()?.getHasFogByDefault());
    }
    private _updateLabelTileTheme(): void {
        const fixedTileTheme    = this.getOpenData()?.templateWarRule.getWarRuleCommonData()?.getFixedTileTheme();
        const label             = this._labelTileTheme;
        if (fixedTileTheme == null) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0890));
        } else {
            label.setText(LangUtils.getTileThemeName(fixedTileTheme) ?? LangConstants.UndefinedError);
        }
    }
    private _updateLabelRuleAvailability(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const label = this._labelRuleAvailability;
        if (openData.mapRawData.getCampaignMapData()) {
            label.setText(LangUtils.getText(LangConstants.TextType.B1135));
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
