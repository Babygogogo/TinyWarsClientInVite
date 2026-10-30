import {
    Tiles_Constants_Common,
    WarRules_Constants,
    GamePanels_Dict,
    GameModes_Utils,
    WarRules_Utils_Template,
    Lang_Utils,
    GameConfigs_Provider,
    Helpers_Collection,
    NormalMap_Model_NormalMapModel,
    GameModes_Constants,
    GamePanels_Manager,
    NormalMap_Model_NormalMapProxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export interface OpenData {
    normalMapId         : number;
    templateWarRuleId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnSetAvailability!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetRuleName!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetTileTheme!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                  callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgMmSetWarRuleAvailability,      callback: this._onNotifyMsgMmSetWarRuleAvailability },
            { type: Notifications_TypeId.TypeId.MsgMmSetWarRuleName,              callback: this._onNotifyMsgMmSetWarRuleName },
            { type: Notifications_TypeId.TypeId.MsgMmSetWarRuleFixedTileTheme,    callback: this._onNotifyMsgMmSetWarRuleFixedTileTheme },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnSetAvailability, callback: this._onTouchedBtnSetAvailability, },
            { ui: this._btnSetRuleName,     callback: this._onTouchedBtnSetRuleName, },
            { ui: this._btnSetTileTheme,    callback: this._onTouchedBtnSetTileTheme },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMmSetWarRuleAvailability(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgMmSetWarRuleName(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgMmSetWarRuleFixedTileTheme(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private async _onTouchedBtnSetAvailability(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId   = openData.normalMapId;
        const mapRawData    = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const ruleId            = openData.templateWarRuleId;
        const existingWarRule   = mapRawData.getTemplateWarRuleArray().find(v => (v.getRuleId()) === ruleId);
        if (existingWarRule == null) {
            return;
        }

        const gameConfig            = await GameConfigs_Provider.getLatestGameConfig();
        const currentGameModeArray  = GameModes_Utils.getEnumArray(existingWarRule.getRuleAvailability());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray    : [
                GameModes_Constants.ModeId.Versus,
                GameModes_Constants.ModeId.RankedMatch,
                GameModes_Constants.ModeId.Coop,
                GameModes_Constants.ModeId.WarRoom,
            ],
            currentNumberArray      : currentGameModeArray,
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0406),
            getNumberMainText       : gameMode => Lang_Utils.getGameModeName(gameMode) ?? Lang_Constants.UndefinedError,
            callbackOnHelp          : gameMode => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getGameModeHelpText(gameMode) ?? Lang_Constants.UndefinedError,
            }),
            callbackOnConfirm       : newGameModeArray => {
                const currentGameModeSet = new Set(currentGameModeArray);
                if ((currentGameModeSet.size === newGameModeArray.length) &&
                    (newGameModeArray.every(v => currentGameModeSet.has(v)))
                ) {
                    return;
                }

                const availability  = GameModes_Utils.getRuleAvailability(newGameModeArray);
                const warRule       = existingWarRule.clone();
                warRule.setRuleAvailability(availability);

                const errorCode = WarRules_Utils_Template.getErrorCode({
                    templateWarRule             : warRule,
                    playersCountUnneutral       : mapRawData.getPlayersCountUnneutral(),
                    gameConfig                  : gameConfig,
                    allWarEventIdArray          : Helpers_Collection.getNonNullElements(mapRawData.getWarEventFullData()?.getEventArray().map(v => v.getEventId()) ?? []),
                    allMapSimpleDialogueIdArray : mapRawData.getMapSimpleDialogueArray().map(v => v.getDialogueId()),
                    isCampaignMap               : false,
                    allTaskObjectiveIdSet       : new Set(mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray().map(v => v.getObjectiveId())),
                });
                if (errorCode) {
                    FloatText.show(Lang_Utils.getErrorText(errorCode));
                } else {
                    NormalMap_Model_NormalMapProxy.reqMmSetWarRuleAvailability({
                        normalMapId     : normalMapId,
                        ruleId          : ruleId,
                        availability    : availability,
                    });
                }
            },
        });
    }

    private async _onTouchedBtnSetRuleName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const ruleId            = openData.templateWarRuleId;
        const normalMapId       = openData.normalMapId;
        const templateWarRule   = (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray().find(v => (v.getRuleId()) === ruleId);
        if (templateWarRule == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : templateWarRule.getRuleNameArray(),
                maxTextLength       : WarRules_Constants.Constants.MaxNameLength,
                callback            : textArray => NormalMap_Model_NormalMapProxy.reqMmSetWarRuleName(normalMapId, ruleId, textArray),
            });
        }
    }

    private async _onTouchedBtnSetTileTheme(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId       = openData.normalMapId;
        const templateWarRuleId = openData.templateWarRuleId;
        const templateWarRule   = (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray().find(v => (v.getRuleId()) === templateWarRuleId);
        if (templateWarRule == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
                availableNumberArray    : [-1].concat(Helpers_Collection.getNonNullElements(Tiles_Constants_Common.AllThemeTypeIdArray)),
                currentNumber           : templateWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? -1,
                getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B1113),
                getNumberMainText           : tileTheme => tileTheme === -1 ? Lang_Utils.getText(Lang_Constants.TextType.B0890) : (Lang_Utils.getTileThemeName(tileTheme) ?? Lang_Constants.UndefinedError),
                callbackOnConfirm       : tileTheme => {
                    NormalMap_Model_NormalMapProxy.reqMmSetWarRuleFixedTileTheme(normalMapId, templateWarRuleId, tileTheme === -1 ? null : tileTheme);
                },
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0317)} #${this.getOpenData()?.templateWarRuleId}`);
        this._btnSetAvailability.setLangText(Lang_Constants.TextType.B0406);
        this._btnSetRuleName.setLangText(Lang_Constants.TextType.B0495);
        this._btnSetTileTheme.setLangText(Lang_Constants.TextType.B1113);
    }
}
