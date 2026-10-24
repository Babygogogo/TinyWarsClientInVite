import * as FloatText2 from "../../FloatText.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoWarRuleRuleAvailability from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesUtilsCommon from "../../tiles/utils/Common.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarRulesConstants from "../../warRules/Constants.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnAddRule!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCloneRule!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteRule!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _listWarRule!                  : UiInterfacesIUiScrollList.IUiScrollList<DataForWarRuleNameRenderer>;

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
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0096));
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent : () => LangUtils.getText(LangConstants.TextType.A0097),
                    callback: () => {
                        war.deleteTemplateWarRule(HelpersMisc.getExisted(selectedRule.getRuleId()));
                        this._resetView();
                    },
                });
            }
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => [
                LangUtils.getText(LangConstants.TextType.A0795),
                ``,
                LangUtils.getText(LangConstants.TextType.A0782),
            ].join(`\n`),
        });
    }

    private _onTouchedBtnAddRule(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const count = war.getTemplateWarRuleArray().length;
        if ((count >= WarRulesConstants.Constants.MaxCount) ||
            ((war.getCampaignMapData()) && (count >= 1))
        ) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0099));
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
        if ((count >= WarRulesConstants.Constants.MaxCount) ||
            ((war.getCampaignMapData()) && (count >= 1))
        ) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0099));
            return;
        }

        const srcRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (srcRule == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        war.addTemplateWarRule(srcRule.clone());
        this._resetView();
    }

    private _onTouchedGroupHelpHasFog(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle  : () => LangUtils.getText(LangConstants.TextType.B0020),
            getContent: () => LangUtils.getText(LangConstants.TextType.R0002),
        });
    }

    private _onTouchedGroupModifyHasFog(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (this.getOpenData()?.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const warRuleCommonData = HelpersMisc.getExisted(templateWarRule.getWarRuleCommonData());
            warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
            this._updateImgHasFog(templateWarRule);
        }
    }

    private _onTouchedGroupHelpWeather(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getWeatherFullDesc(gameConfig),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            WarRulesUtilsCommonData.tickDefaultWeatherType(
                HelpersMisc.getExisted(templateWarRule.getWarRuleCommonData()),
                war.getGcData()
            );
            this._updateLabelWeather(templateWarRule);
        }
    }

    private _onTouchedGroupHelpTileTheme(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0794),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const ruleForGlobalParams = templateWarRule.createIfNotExistsWarRuleCommonData();
            ruleForGlobalParams.setFixedTileTheme(TilesUtilsCommon.getNextThemeId(ruleForGlobalParams.getFixedTileTheme() ?? null));
            this._updateLabelTileTheme(templateWarRule);

            war.getInstanceWarRule().createIfNotExistsWarRuleCommonData().setFixedTileTheme(ruleForGlobalParams.getFixedTileTheme());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.flushDataToView();
            }
        }
    }

    private _onTouchedGroupHelpRuleAvailability(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0796),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (war.getCampaignMapData()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const ruleAvailability      = templateWarRule.createIfNotExistsRuleAvailability();
        const currentGameModeArray  = HelpersCollection.getNonNullElements([
            ruleAvailability.getCanCcw() ? GameModesConstants.ModeId.Coop : null,
            ruleAvailability.getCanMcw() ? GameModesConstants.ModeId.Versus : null,
            ruleAvailability.getCanMrw() ? GameModesConstants.ModeId.RankedMatch : null,
            ruleAvailability.getCanSrw() ? GameModesConstants.ModeId.WarRoom : null,
        ]);
        if (war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowGameModePanel, {
                currentGameModeArray    : currentGameModeArray,
                availableGameModeArray  : [
                    GameModesConstants.ModeId.Versus,
                    GameModesConstants.ModeId.Coop,
                    GameModesConstants.ModeId.RankedMatch,
                    GameModesConstants.ModeId.WarRoom,
                ],
            });
        } else {
            const availableGameModeArray = [
                GameModesConstants.ModeId.Versus,
                GameModesConstants.ModeId.Coop,
                GameModesConstants.ModeId.WarRoom,
            ];
            if (UsersModel.getIsSelfMapCommittee()) {
                availableGameModeArray.push(GameModesConstants.ModeId.RankedMatch);
            }

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
                currentNumberArray      : currentGameModeArray,
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
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0804),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeWarRulePlayerRulePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpWarEvent(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0793),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeWarRuleWarEventPanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpTaskObjective(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0713),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeWarRuleTaskObjectivePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupHelpMapSimpleDialogue(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0788),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeWarRuleMapSimpleDialoguePanel, {
            war             : openData.war,
            templateWarRule : templateWarRule,
        });
    }

    private _onTouchedGroupModifyRuleName(): void {
        const templateWarRule = this._listWarRule.getFirstSelectedData()?.templateWarRule;
        if (templateWarRule == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currentNameArray = templateWarRule.getRuleNameArray();
        if (this.getOpenData()?.war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowLangTextPanel, {
                textArray   : currentNameArray,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : currentNameArray,
                maxTextLength       : WarRulesConstants.Constants.MaxNameLength,
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0314));
        this._labelRuleNameTitle.setText(LangUtils.getText(LangConstants.TextType.B0315));
        this._labelHasFogTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0549)} ?`);
        this._labelWeatherTitle.setText(`${LangUtils.getText(LangConstants.TextType.Weather)} ?`);
        this._labelTileThemeTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1113)} ?`);
        this._labelRuleAvailabilityTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1013)} ?`);
        this._labelPlayerRuleTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0407)} ?`);
        this._labelWarEventTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0461)} ?`);
        this._labelTaskObjectiveTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1214)} ?`);
        this._labelMapSimpleDialogueTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1095)} ?`);
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
        this._labelRuleName.setText(LangUtils.getJoinedShortLanguageText(templateWarRule?.getRuleNameArray(), 30));
    }
    private _updateLabelWeather(templateWarRule: TemplateWarRule | null): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        this._labelWeather.setText(LangUtils.getWeatherName(
            templateWarRule
                ? WarRulesUtilsCommonData.getDefaultWeatherType(
                    HelpersMisc.getExisted(templateWarRule.getWarRuleCommonData()),
                    gameConfig
                )
                : gameConfig.getDefaultWeatherType(),
            gameConfig
        ) ?? LangConstants.UndefinedError);
    }
    private _updateImgHasFog(templateWarRule: TemplateWarRule | null): void {
        this._imgHasFog.setIsVisible(!!templateWarRule?.getWarRuleCommonData()?.getHasFogByDefault());
    }
    private _updateLabelTileTheme(templateWarRule: TemplateWarRule | null): void {
        const fixedTileTheme    = templateWarRule?.getWarRuleCommonData()?.getFixedTileTheme();
        const label             = this._labelTileTheme;
        if (fixedTileTheme == null) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0890));
        } else {
            label.setText(LangUtils.getTileThemeName(fixedTileTheme) ?? LangConstants.UndefinedError);
        }
    }
    private _updateLabelRuleAvailability(templateWarRule: TemplateWarRule | null): void {
        const label = this._labelRuleAvailability;
        if (this.getOpenData()?.war.getCampaignMapData()) {
            label.setText(LangUtils.getText(LangConstants.TextType.B1135));
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

interface DataForWarRuleNameRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    templateWarRule : TemplateWarRule;
    panel           : Panel;
}
class WarRuleNameRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForWarRuleNameRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForWarRuleNameRenderer>
{
    private readonly _labelId!  : UiInterfacesIUiLabel.IUiLabel;

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
