import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { Incremental, TimerTypeId } from "../../bootTimers/Constants.ts";
import { show } from "../../FloatText.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getBootTimerTypeName,
    getFormattedText,
    getLanguageText,
    getText,
    getTileThemeName,
    getTimeDurationText2,
    getWarBasicSettingsName,
    getWeatherFullDesc,
    getWeatherName,
} from "../../lang/Utils.ts";
import { getMapNameInCurrentLanguage, getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { Common as SinglePlayerWarConstants } from "../../singlePlayerWars/Constants.ts";
import { AllThemeTypeIdArray } from "../../tiles/constants/Common.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import { Common } from "../../warOperations/Constants.ts";
import { getDefaultWeatherType } from "../../warRules/utils/CommonData.ts";
import { BasicSettingsTypeId, Misc } from "../../wars/Constants.ts";

export type OpenData = {
    dataArrayForListSettings    : DataForSettingsRenderer[];
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _listSettings! : IUiScrollList<DataForSettingsRenderer>;

    public constructor() {
        super();

        loadSkinByPath(this, "common/CommonWarBasicSettingsPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);

        this._listSettings.setItemRendererClass(SettingsRenderer);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : UiVerticalAlign.Middle },
            horizontalAlign : { align : UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });
    }
    protected override _doApplyOpenData(): void | Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSettings.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData) {
            await this._listSettings.bindData(openData.dataArrayForListSettings);
        }
    }
}

interface DataForSettingsRenderer extends UiListItemData {
    settingsType        : BasicSettingsTypeId;
    currentValue        : number | string | null;
    instanceWarRule     : InstanceWarRule;
    gameConfig          : GcData;
    warEventFullData    : Undefinable<WarEventFullData>;
    callbackOnModify    : ((newValue: string | number | null) => void) | null;
}
class SettingsRenderer extends UiListItemRenderer<DataForSettingsRenderer> {
    private readonly _labelTitle!   : IUiLabel;
    private readonly _labelValue!   : IUiLabel;
    private readonly _btnModify!    : IUiButton;
    private readonly _btnHelp!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnModify,  callback : this._onTouchedBtnModify },
            { ui : this._btnHelp,    callback : this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedBtnModify(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = openData.callbackOnModify;
        if (callback == null) {
            return;
        }

        const settingsType = openData.settingsType;
        if (settingsType === BasicSettingsTypeId.NormalMapId) {
            this._modifyAsNormalMapId();
        } else if (settingsType === BasicSettingsTypeId.WarName) {
            this._modifyAsWarName();
        } else if (settingsType === BasicSettingsTypeId.WarPassword) {
            this._modifyAsWarPassword();
        } else if (settingsType === BasicSettingsTypeId.WarComment) {
            this._modifyAsWarComment();
        } else if (settingsType === BasicSettingsTypeId.WarRuleTitle) {
            this._modifyAsWarRuleTitle();
        } else if (settingsType === BasicSettingsTypeId.HasFog) {
            this._modifyAsHasFog();
        } else if (settingsType === BasicSettingsTypeId.Weather) {
            this._modifyAsWeather();
        } else if (settingsType === BasicSettingsTypeId.TileTheme) {
            this._modifyAsTileTheme();
        } else if (settingsType === BasicSettingsTypeId.WarEvent) {
            this._modifyAsWarEvent();
        } else if (settingsType === BasicSettingsTypeId.TurnsAndWarOperationsLimit) {
            this._modifyAsTurnsAndWarOperationsLimit();
        } else if (settingsType === BasicSettingsTypeId.TimerType) {
            this._modifyAsTimerType();
        } else if (settingsType === BasicSettingsTypeId.TimerRegularParam) {
            this._modifyAsTimerRegularParam();
        } else if (settingsType === BasicSettingsTypeId.TimerIncrementalParams) {
            this._modifyAsTimerIncrementalParams();
        } else if (settingsType === BasicSettingsTypeId.SpmSaveSlotIndex) {
            this._modifyAsSpmSaveSlotIndex();
        } else if (settingsType === BasicSettingsTypeId.SpmSaveSlotComment) {
            this._modifyAsSpmSaveSlotComment();
        } else {
            throw newError(`CommonWarBasicSettingsPage.SettingsRenderer._onTouchedBtnModify() invalid settingsType: ${settingsType}`);
        }
    }
    private async _onTouchedBtnHelp(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const settingsType = openData.settingsType;
        if (settingsType === BasicSettingsTypeId.NormalMapId) {
            const normalMapId     = openData.currentValue;
            const mapDesc   = (typeof normalMapId == "number")
                ? (await getRawData(normalMapId))?.getMapExtraText()?.getMapDescription()
                : (null);
            if (mapDesc == null) {
                show(getText(TextType.B0894));
            } else {
                openPanel(getDict().CommonAlertPanel, {
                    getTitle   : () => getText(TextType.B0893),
                    getContent : () => getLanguageText({ textArray : mapDesc }) ?? UndefinedError,
                });
            }

        } else if (settingsType === BasicSettingsTypeId.HasFog) {
            openPanel(getDict().CommonHelpPanel, {
                getTitle   : () => getText(TextType.B0020),
                getContent : () => getText(TextType.R0002),
            });

        } else if (settingsType === BasicSettingsTypeId.Weather) {
            openPanel(getDict().CommonHelpPanel, {
                getTitle   : () => getText(TextType.Weather),
                getContent : () => getWeatherFullDesc(openData.gameConfig),
            });

        } else if (settingsType === BasicSettingsTypeId.WarEvent) {
            const warEventFullData  = openData.warEventFullData;
            const warEventIdArray   = openData.instanceWarRule.getWarEventFullData()?.getEventArray().map(v => getExisted(v.getEventId())) ?? [];
            if ((warEventFullData) && (warEventIdArray?.length)) {
                openPanel(getDict().CommonWarEventListPanel, {
                    warEventFullData,
                    warEventIdArray,
                    gameConfig : openData.gameConfig,
                });
            }

        } else if (settingsType === BasicSettingsTypeId.TurnsAndWarOperationsLimit) {
            openPanel(getDict().CommonHelpPanel, {
                getTitle   : () => getText(TextType.B0987),
                getContent : () => getText(TextType.R0012),
            });

        } else if (settingsType === BasicSettingsTypeId.TimerType) {
            openPanel(getDict().CommonHelpPanel, {
                getTitle   : () => getText(TextType.B0574),
                getContent : () => getText(TextType.R0003),
            });
        } else if (settingsType === BasicSettingsTypeId.TimerRegularParam) {
            openPanel(getDict().CommonHelpPanel, {
                getTitle   : () => getText(TextType.B0988),
                getContent : () => getText(TextType.R0013),
            });
        } else if (settingsType === BasicSettingsTypeId.TimerIncrementalParams) {
            openPanel(getDict().CommonHelpPanel, {
                getTitle   : () => getText(TextType.B0989),
                getContent : () => getText(TextType.R0014),
            });
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const settingsType = openData.settingsType;
        this._labelTitle.setText(getWarBasicSettingsName(settingsType) || UndefinedError);
        this._btnModify.setIsVisible(openData.callbackOnModify != null);

        if (settingsType === BasicSettingsTypeId.NormalMapId) {
            this._updateViewAsNormalMapId();
        } else if (settingsType === BasicSettingsTypeId.WarName) {
            this._updateViewAsWarName();
        } else if (settingsType === BasicSettingsTypeId.WarPassword) {
            this._updateViewAsWarPassword();
        } else if (settingsType === BasicSettingsTypeId.WarComment) {
            this._updateViewAsWarComment();
        } else if (settingsType === BasicSettingsTypeId.WarRuleTitle) {
            this._updateViewAsWarRuleTitle();
        } else if (settingsType === BasicSettingsTypeId.HasFog) {
            this._updateViewAsHasFog();
        } else if (settingsType === BasicSettingsTypeId.Weather) {
            this._updateViewAsWeather();
        } else if (settingsType === BasicSettingsTypeId.TileTheme) {
            this._updateViewAsTileTheme();
        } else if (settingsType === BasicSettingsTypeId.WarEvent) {
            this._updateViewAsWarEvent();
        } else if (settingsType === BasicSettingsTypeId.TurnsAndWarOperationsLimit) {
            this._updateViewAsTurnsAndWarOperationsLimit();
        } else if (settingsType === BasicSettingsTypeId.TimerType) {
            this._updateViewAsTimerType();
        } else if (settingsType === BasicSettingsTypeId.TimerRegularParam) {
            this._updateViewAsTimerRegularParam();
        } else if (settingsType === BasicSettingsTypeId.TimerIncrementalParams) {
            this._updateViewAsTimerIncrementalParams();
        } else if (settingsType === BasicSettingsTypeId.SpmSaveSlotIndex) {
            this._updateViewAsSpmSaveSlotIndex();
        } else if (settingsType === BasicSettingsTypeId.SpmSaveSlotComment) {
            this._updateViewAsSpmSaveSlotComment();
        } else {
            throw newError(`CommonWarBasicSettingsPage.SettingsRenderer._updateView() invalid settingsType: ${settingsType}.`);
        }
    }
    private async _updateViewAsNormalMapId(): Promise<void> {
        const normalMapId   = this.getOpenData()?.currentValue;
        const labelValue    = this._labelValue;
        const btnHelp       = this._btnHelp;
        if (typeof normalMapId !== "number") {
            labelValue.setText(`--`);
            btnHelp.setIsVisible(false);
        } else {
            labelValue.setText((await getMapNameInCurrentLanguage(normalMapId)) ?? UndefinedError);
            btnHelp.setIsVisible(!!(await getRawData(normalMapId))?.getMapExtraText()?.getMapDescription().length);
        }
    }
    private _updateViewAsWarName(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(`${openData?.currentValue || ``}`);
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsWarPassword(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(`${openData?.currentValue || ``}`);
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsWarComment(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(`${openData?.currentValue || ``}`);
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsWarRuleTitle(): void {
        const openData          = this.getOpenData();
        const instanceWarRule   = openData?.instanceWarRule;
        const labelValue        = this._labelValue;
        const templateWarRuleId = instanceWarRule?.getTemplateWarRuleId();
        if (templateWarRuleId == null) {
            labelValue.setText(getText(TextType.B0321));
            labelValue.setTextColor(0xFFFF00);
        } else {
            labelValue.setText(`(#${templateWarRuleId}) ${getLanguageText({ textArray : instanceWarRule?.getRuleNameArray() }) ?? UndefinedError}`);
            labelValue.setTextColor(0xFFFFFF);
        }
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsHasFog(): void {
        const openData          = this.getOpenData();
        const hasFog            = openData?.instanceWarRule.getWarRuleCommonData()?.getHasFogByDefault();
        const labelValue        = this._labelValue;
        labelValue.setText(getText(hasFog ? TextType.Yes : TextType.No));
        labelValue.setTextColor(hasFog ? 0xFFFF00 : 0xFFFFFF);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const weatherType   = getDefaultWeatherType(getExisted(openData.instanceWarRule.getWarRuleCommonData()), gameConfig);
        const labelValue    = this._labelValue;
        labelValue.setText(getWeatherName(weatherType, gameConfig) ?? UndefinedError);
        labelValue.setTextColor(weatherType === gameConfig.getDefaultWeatherType() ? 0xFFFFFF: 0xFFFF00);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTileTheme(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(getTileThemeName(openData?.instanceWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? null) ?? UndefinedError);
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsWarEvent(): void {
        const openData          = this.getOpenData();
        const warEventsCount    = openData?.instanceWarRule.getWarEventFullData()?.getEventArray().length ?? 0;
        const labelValue        = this._labelValue;
        labelValue.setText(warEventsCount ? `${warEventsCount}` : `--`);
        labelValue.setTextColor(warEventsCount ? 0xFFFF00 : 0xFFFFFF);
        this._btnHelp.setIsVisible((warEventsCount > 0) && (openData?.warEventFullData != null));
    }
    private _updateViewAsTurnsAndWarOperationsLimit(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(`${openData?.currentValue}`);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTimerType(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(getBootTimerTypeName(openData?.currentValue as TimerTypeId) || UndefinedError);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTimerRegularParam(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(getTimeDurationText2(openData?.currentValue as number));
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTimerIncrementalParams(): void {
        const openData = this.getOpenData();
        this._labelValue.setText((openData?.currentValue as string).split(`,`).map(v => getTimeDurationText2(parseInt(v))).join(`  `));
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsSpmSaveSlotIndex(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(`${openData?.currentValue}`);
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsSpmSaveSlotComment(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(`${openData?.currentValue || ``}`);
        this._btnHelp.setIsVisible(false);
    }

    private _modifyAsNormalMapId(): void {
        // nothing to do
    }
    private _modifyAsWarName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback      = getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        openPanel(getDict().CommonInputPanel, {
            title        : getText(TextType.B0185),
            currentValue : `${currentValue || ``}`,
            maxChars     : Misc.MaxNameLength,
            charRestrict : null,
            tips         : null,
            callback     : panel => {
                const newValue = panel.getInputText() || null;
                if (newValue != currentValue) {
                    callback(newValue);
                }
            },
        });
    }
    private _modifyAsWarPassword(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback      = getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        openPanel(getDict().CommonInputPanel, {
            title        : getText(TextType.B0186),
            currentValue : `${currentValue || ``}`,
            maxChars     : Misc.MaxPasswordLength,
            charRestrict : `0-9`,
            tips         : getFormattedText(TextType.F0068, Misc.MaxPasswordLength),
            callback     : panel => {
                const newValue = panel.getInputText() || null;
                if (newValue != currentValue) {
                    callback(newValue);
                }
            },
        });
    }
    private _modifyAsWarComment(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback      = getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        openPanel(getDict().CommonInputPanel, {
            title        : getText(TextType.B0187),
            currentValue : `${currentValue || ``}`,
            maxChars     : Misc.MaxCommentLength,
            charRestrict : null,
            tips         : null,
            callback     : panel => {
                const newValue = panel.getInputText() || null;
                if (newValue != currentValue) {
                    callback(newValue);
                }
            },
        });
    }
    private _modifyAsWarRuleTitle(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsHasFog(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = getExisted(openData.callbackOnModify);
        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback(null);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0129),
                callback   : () => callback(null),
            });
        }
    }
    private _modifyAsWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = getExisted(openData.callbackOnModify);
        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback(null);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0129),
                callback   : () => callback(null),
            });
        }
    }
    private _modifyAsTileTheme(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callbackOnModify = openData.callbackOnModify;
        if (callbackOnModify == null) {
            return;
        }

        const callback = () => {
            openPanel(getDict().CommonChooseSingleNumberPanel, {
                availableNumberArray : [-1].concat(getNonNullElements(AllThemeTypeIdArray)),
                currentNumber        : openData.instanceWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? -1,
                getTitleText         : () => getText(TextType.B1113),
                getNumberMainText    : tileTheme => tileTheme === -1 ? getText(TextType.B0890) : (getTileThemeName(tileTheme) ?? UndefinedError),
                callbackOnConfirm    : tileTheme => {
                    callbackOnModify(tileTheme === -1 ? null : tileTheme);
                },
            });
        };

        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback();
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0129),
                callback   : callback
            });
        }
    }
    private _modifyAsWarEvent(): void {
        // nothing to do
    }
    private _modifyAsTurnsAndWarOperationsLimit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback                  = getExisted(openData.callbackOnModify);
        const minValueForTurnsLimit     = TurnIndex.MinLimit;
        const maxValueForTurnsLimit     = TurnIndex.MaxLimit;
        const currentValue              = openData.currentValue as string;
        const textArray                 = currentValue.split(`,`);
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle     : () => getText(TextType.B0842),
            currentValue : parseInt(textArray[0]),
            minValue     : minValueForTurnsLimit,
            maxValue     : maxValueForTurnsLimit,
            callback     : newTurnsLimit => {
                const minValueForWarOperationsLimit = Common.MinLimit;
                const maxValueForWarOperationsLimit = Common.MaxLimit;
                openPanel(getDict().CommonInputIntegerPanel, {
                    getTitle     : () => getText(TextType.B0986),
                    currentValue : parseInt(textArray[1]),
                    minValue     : minValueForWarOperationsLimit,
                    maxValue     : maxValueForWarOperationsLimit,
                    callback     : newWarOperationsLimit => {
                        const newValue = `${newTurnsLimit}, ${newWarOperationsLimit}`;
                        if (newValue !== currentValue) {
                            callback(newValue);
                        }
                    },
                });
            },
        });
    }
    private _modifyAsTimerType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsTimerRegularParam(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsTimerIncrementalParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback                  = getExisted(openData.callbackOnModify);
        const minValueForInitialTime    = 10;
        const maxValueForInitialTime    = Incremental.MaxLimitForInitialTime;
        const currentValue              = openData.currentValue as string;
        const timeParamArray            = currentValue.split(`,`).map(v => parseInt(v));
        openPanel(getDict().CommonInputDurationPanel, {
            title        : getText(TextType.B0389),
            currentValue : timeParamArray[0],
            minValue     : minValueForInitialTime,
            maxValue     : maxValueForInitialTime,
            tips         : `${getText(TextType.B0319)}: [${minValueForInitialTime}, ${maxValueForInitialTime}] (${getText(TextType.B0017)})`,
            callback     : newInitialTime => {
                const minValueForIncrementalTimePerUnit = 0;
                const maxValueForIncrementalTimePerUnit = Incremental.MaxLimitForIncrementPerUnit;
                openPanel(getDict().CommonInputDurationPanel, {
                    title        : getText(TextType.B0390),
                    currentValue : timeParamArray[1],
                    minValue     : minValueForIncrementalTimePerUnit,
                    maxValue     : maxValueForIncrementalTimePerUnit,
                    tips         : `${getText(TextType.B0319)}: [${minValueForIncrementalTimePerUnit}, ${maxValueForIncrementalTimePerUnit}] (${getText(TextType.B0017)})`,
                    callback     : newIncrementalTimePerUnit => {
                        const minValueForIncrementalTimePerTurn = 0;
                        const maxValueForIncrementalTimePerTurn = Incremental.MaxLimitForIncrementPerTurn;
                        openPanel(getDict().CommonInputDurationPanel, {
                            title        : getText(TextType.B0991),
                            currentValue : timeParamArray[2],
                            minValue     : minValueForIncrementalTimePerTurn,
                            maxValue     : maxValueForIncrementalTimePerTurn,
                            tips         : `${getText(TextType.B0319)}: [${minValueForIncrementalTimePerTurn}, ${maxValueForIncrementalTimePerTurn}] (${getText(TextType.B0017)})`,
                            callback     : newIncrementalTimePerTurn => {
                                const newValue = `${newInitialTime}, ${newIncrementalTimePerUnit}, ${newIncrementalTimePerTurn}`;
                                if (newValue !== currentValue) {
                                    callback(newValue);
                                }
                            },
                        });
                    },
                });
            },
        });
    }
    private _modifyAsSpmSaveSlotIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsSpmSaveSlotComment(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback      = getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        openPanel(getDict().CommonInputPanel, {
            title        : getText(TextType.B0605),
            currentValue : `${currentValue || ``}`,
            maxChars     : SinglePlayerWarConstants.MaxSaveSlotCommentLength,
            charRestrict : null,
            tips         : null,
            callback     : panel => {
                const newValue = panel.getInputText() || null;
                if (newValue != currentValue) {
                    callback(newValue);
                }
            },
        });
    }
}
