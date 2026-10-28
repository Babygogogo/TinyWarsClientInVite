import { showLang, show } from "../../FloatText.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getEnumArray, getRuleAvailability } from "../../gameModes/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getGameModeName, getGameModeHelpText, getErrorText, getTileThemeName } from "../../lang/Utils.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { reqMmSetWarRuleAvailability, reqMmSetWarRuleName, reqMmSetWarRuleFixedTileTheme } from "../../normalMap/model/NormalMapProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { AllThemeTypeIdArray } from "../../tiles/constants/Common.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { Constants } from "../../warRules/Constants.ts";
import { getErrorCode } from "../../warRules/utils/Template.ts";

export interface OpenData {
    normalMapId         : number;
    templateWarRuleId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _btnSetAvailability!   : IUiButton;
    private readonly _btnSetRuleName!       : IUiButton;
    private readonly _btnSetTileTheme!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                  callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMmSetWarRuleAvailability,      callback: this._onNotifyMsgMmSetWarRuleAvailability },
            { type: TypeId.MsgMmSetWarRuleName,              callback: this._onNotifyMsgMmSetWarRuleName },
            { type: TypeId.MsgMmSetWarRuleFixedTileTheme,    callback: this._onNotifyMsgMmSetWarRuleFixedTileTheme },
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
        showLang(TextType.OperationSucceeded);
    }
    private _onNotifyMsgMmSetWarRuleName(): void {
        showLang(TextType.OperationSucceeded);
    }
    private _onNotifyMsgMmSetWarRuleFixedTileTheme(): void {
        showLang(TextType.OperationSucceeded);
    }

    private async _onTouchedBtnSetAvailability(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId   = openData.normalMapId;
        const mapRawData    = await getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const ruleId            = openData.templateWarRuleId;
        const existingWarRule   = mapRawData.getTemplateWarRuleArray().find(v => (v.getRuleId()) === ruleId);
        if (existingWarRule == null) {
            return;
        }

        const gameConfig            = await getLatestGameConfig();
        const currentGameModeArray  = getEnumArray(existingWarRule.getRuleAvailability());
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray    : [
                ModeId.Versus,
                ModeId.RankedMatch,
                ModeId.Coop,
                ModeId.WarRoom,
            ],
            currentNumberArray      : currentGameModeArray,
            getTitleText            : () => getText(TextType.B0406),
            getNumberMainText       : gameMode => getGameModeName(gameMode) ?? UndefinedError,
            callbackOnHelp          : gameMode => openPanel(getDict().CommonHelpPanel, {
                getContent : () => getGameModeHelpText(gameMode) ?? UndefinedError,
            }),
            callbackOnConfirm       : newGameModeArray => {
                const currentGameModeSet = new Set(currentGameModeArray);
                if ((currentGameModeSet.size === newGameModeArray.length) &&
                    (newGameModeArray.every(v => currentGameModeSet.has(v)))
                ) {
                    return;
                }

                const availability  = getRuleAvailability(newGameModeArray);
                const warRule       = existingWarRule.clone();
                warRule.setRuleAvailability(availability);

                const errorCode = getErrorCode({
                    templateWarRule             : warRule,
                    playersCountUnneutral       : mapRawData.getPlayersCountUnneutral(),
                    gameConfig                  : gameConfig,
                    allWarEventIdArray          : getNonNullElements(mapRawData.getWarEventFullData()?.getEventArray().map(v => v.getEventId()) ?? []),
                    allMapSimpleDialogueIdArray : mapRawData.getMapSimpleDialogueArray().map(v => v.getDialogueId()),
                    isCampaignMap               : false,
                    allTaskObjectiveIdSet       : new Set(mapRawData.getTaskObjectiveFullData()?.getTaskObjectiveArray().map(v => v.getObjectiveId())),
                });
                if (errorCode) {
                    show(getErrorText(errorCode));
                } else {
                    reqMmSetWarRuleAvailability({
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
        const templateWarRule   = (await getRawData(normalMapId))?.getTemplateWarRuleArray().find(v => (v.getRuleId()) === ruleId);
        if (templateWarRule == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : templateWarRule.getRuleNameArray(),
                maxTextLength       : Constants.MaxNameLength,
                callback            : textArray => reqMmSetWarRuleName(normalMapId, ruleId, textArray),
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
        const templateWarRule   = (await getRawData(normalMapId))?.getTemplateWarRuleArray().find(v => (v.getRuleId()) === templateWarRuleId);
        if (templateWarRule == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().CommonChooseSingleNumberPanel, {
                availableNumberArray    : [-1].concat(getNonNullElements(AllThemeTypeIdArray)),
                currentNumber           : templateWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? -1,
                getTitleText            : () => getText(TextType.B1113),
                getNumberMainText           : tileTheme => tileTheme === -1 ? getText(TextType.B0890) : (getTileThemeName(tileTheme) ?? UndefinedError),
                callbackOnConfirm       : tileTheme => {
                    reqMmSetWarRuleFixedTileTheme(normalMapId, templateWarRuleId, tileTheme === -1 ? null : tileTheme);
                },
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0317)} #${this.getOpenData()?.templateWarRuleId}`);
        this._btnSetAvailability.setLangText(TextType.B0406);
        this._btnSetRuleName.setLangText(TextType.B0495);
        this._btnSetTileTheme.setLangText(TextType.B1113);
    }
}
