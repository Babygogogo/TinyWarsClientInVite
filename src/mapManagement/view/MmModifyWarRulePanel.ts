import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GameModesUtils from "../../gameModes/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NormalMapModelNormalMapProxy from "../../normalMap/model/NormalMapProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as WarRulesConstants from "../../warRules/Constants.ts";
import * as WarRulesUtilsTemplate from "../../warRules/utils/Template.ts";

export interface OpenData {
    normalMapId         : number;
    templateWarRuleId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _btnSetAvailability!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetRuleName!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSetTileTheme!      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                  callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmSetWarRuleAvailability,      callback: this._onNotifyMsgMmSetWarRuleAvailability },
            { type: NotificationsTypeId.TypeId.MsgMmSetWarRuleName,              callback: this._onNotifyMsgMmSetWarRuleName },
            { type: NotificationsTypeId.TypeId.MsgMmSetWarRuleFixedTileTheme,    callback: this._onNotifyMsgMmSetWarRuleFixedTileTheme },
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
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgMmSetWarRuleName(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgMmSetWarRuleFixedTileTheme(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private async _onTouchedBtnSetAvailability(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId   = openData.normalMapId;
        const mapRawData    = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const ruleId            = openData.templateWarRuleId;
        const existingWarRule   = mapRawData.getTemplateWarRuleArray().find(v => (v.getRuleId() ?? 0) === ruleId);
        if (existingWarRule == null) {
            return;
        }

        const gameConfig            = await GameConfigGcModel.getLatestGameConfig();
        const currentGameModeArray  = GameModesUtils.getEnumArray(existingWarRule.getRuleAvailability());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray    : [
                GameModesConstants.ModeId.Versus,
                GameModesConstants.ModeId.RankedMatch,
                GameModesConstants.ModeId.Coop,
                GameModesConstants.ModeId.WarRoom,
            ],
            currentNumberArray      : currentGameModeArray,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0406),
            getNumberMainText       : gameMode => LangUtils.getGameModeName(gameMode) ?? LangConstants.UndefinedError,
            callbackOnHelp          : gameMode => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getGameModeHelpText(gameMode) ?? LangConstants.UndefinedError,
            }),
            callbackOnConfirm       : newGameModeArray => {
                const currentGameModeSet = new Set(currentGameModeArray);
                if ((currentGameModeSet.size === newGameModeArray.length) &&
                    (newGameModeArray.every(v => currentGameModeSet.has(v)))
                ) {
                    return;
                }

                const availability  = GameModesUtils.getRuleAvailability(newGameModeArray);
                const warRule       = existingWarRule.clone();
                warRule.setRuleAvailability(availability);

                const errorCode = WarRulesUtilsTemplate.getErrorCode({
                    templateWarRule             : warRule,
                    playersCountUnneutral       : HelpersMisc.getExisted(mapRawData.getPlayersCountUnneutral()),
                    gameConfig                  : gameConfig,
                    allWarEventIdArray          : HelpersCollection.getNonNullElements(mapRawData.getWarEventFullData()?.getEventArray().map(v => v.getEventId()) ?? []),
                    allMapSimpleDialogueIdArray : mapRawData.getMapSimpleDialogueArray().map(v => v.getDialogueId() ?? 0) ?? [],
                    isCampaignMap               : false,
                    allTaskObjectiveIdSet       : new Set(mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray().map(v => v.getObjectiveId() ?? 0)),
                });
                if (errorCode) {
                    FloatText2.show(LangUtils.getErrorText(errorCode));
                } else {
                    NormalMapModelNormalMapProxy.reqMmSetWarRuleAvailability({
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
        const templateWarRule   = (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray().find(v => (v.getRuleId() ?? 0) === ruleId);
        if (templateWarRule == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : templateWarRule.getRuleNameArray() ?? [],
                maxTextLength       : WarRulesConstants.Constants.MaxNameLength,
                callback            : textArray => NormalMapModelNormalMapProxy.reqMmSetWarRuleName(normalMapId, ruleId, textArray),
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
        const templateWarRule   = (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray().find(v => (v.getRuleId() ?? 0) === templateWarRuleId);
        if (templateWarRule == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                availableNumberArray    : [-1].concat(HelpersCollection.getNonNullElements(TilesConstantsCommon.AllThemeTypeIdArray)),
                currentNumber           : templateWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? -1,
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1113),
                getNumberMainText           : tileTheme => tileTheme === -1 ? LangUtils.getText(LangConstants.TextType.B0890) : (LangUtils.getTileThemeName(tileTheme) ?? LangConstants.UndefinedError),
                callbackOnConfirm       : tileTheme => {
                    NormalMapModelNormalMapProxy.reqMmSetWarRuleFixedTileTheme(normalMapId, templateWarRuleId, tileTheme === -1 ? null : tileTheme);
                },
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0317)} #${this.getOpenData()?.templateWarRuleId}`);
        this._btnSetAvailability.setLangText(LangConstants.TextType.B0406);
        this._btnSetRuleName.setLangText(LangConstants.TextType.B0495);
        this._btnSetTileTheme.setLangText(LangConstants.TextType.B1113);
    }
}
