import {
    Tiles_Constants_Common,
    Wars_Constants,
    Lang_Utils,
    WarRules_Utils_CommonData,
    GamePanels_Dict,
    Helpers_Misc,
    NormalMap_Model_NormalMapModel,
    Helpers_Collection,
    BootTimers_Constants,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    FloatText,
    SinglePlayerWars_Constants,
    Lang_Constants,
    Turns_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    WarOperations_Constants,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";

export type OpenData = {
    dataArrayForListSettings    : DataForSettingsRenderer[];
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _listSettings! : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSettingsRenderer>;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "common/CommonWarBasicSettingsPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);

        this._listSettings.setItemRendererClass(SettingsRenderer);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
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

interface DataForSettingsRenderer extends Ui_Types_UiListItemData.UiListItemData {
    settingsType        : Wars_Constants.BasicSettingsTypeId;
    currentValue        : number | string | null;
    instanceWarRule     : InstanceWarRule;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    warEventFullData    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WarEventFullData>;
    callbackOnModify    : ((newValue: string | number | null) => void) | null;
}
class SettingsRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSettingsRenderer> {
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValue!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModify!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnModify,  callback : this._onTouchedBtnModify },
            { ui : this._btnHelp,    callback : this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
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
        if (settingsType === Wars_Constants.BasicSettingsTypeId.NormalMapId) {
            this._modifyAsNormalMapId();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarName) {
            this._modifyAsWarName();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarPassword) {
            this._modifyAsWarPassword();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarComment) {
            this._modifyAsWarComment();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarRuleTitle) {
            this._modifyAsWarRuleTitle();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.HasFog) {
            this._modifyAsHasFog();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.Weather) {
            this._modifyAsWeather();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TileTheme) {
            this._modifyAsTileTheme();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarEvent) {
            this._modifyAsWarEvent();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit) {
            this._modifyAsTurnsAndWarOperationsLimit();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerType) {
            this._modifyAsTimerType();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerRegularParam) {
            this._modifyAsTimerRegularParam();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams) {
            this._modifyAsTimerIncrementalParams();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.SpmSaveSlotIndex) {
            this._modifyAsSpmSaveSlotIndex();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.SpmSaveSlotComment) {
            this._modifyAsSpmSaveSlotComment();
        } else {
            throw Helpers_Misc.newError(`CommonWarBasicSettingsPage.SettingsRenderer._onTouchedBtnModify() invalid settingsType: ${settingsType}`);
        }
    }
    private async _onTouchedBtnHelp(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const settingsType = openData.settingsType;
        if (settingsType === Wars_Constants.BasicSettingsTypeId.NormalMapId) {
            const normalMapId     = openData.currentValue;
            const mapDesc   = (typeof normalMapId == "number")
                ? (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getMapExtraText()?.getMapDescription()
                : (null);
            if (mapDesc == null) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.B0894));
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                    getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0893),
                    getContent : () => Lang_Utils.getLanguageText({ textArray : mapDesc }) ?? Lang_Constants.UndefinedError,
                });
            }

        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.HasFog) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0020),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0002),
            });

        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.Weather) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.Weather),
                getContent : () => Lang_Utils.getWeatherFullDesc(openData.gameConfig),
            });

        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarEvent) {
            const warEventFullData  = openData.warEventFullData;
            const warEventIdArray   = openData.instanceWarRule.getWarEventFullData()?.getEventArray().map(v => v.getEventId()) ?? [];
            if ((warEventFullData) && (warEventIdArray?.length)) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonWarEventListPanel, {
                    warEventFullData,
                    warEventIdArray,
                    gameConfig : openData.gameConfig,
                });
            }

        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0987),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0012),
            });

        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerType) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0574),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0003),
            });
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerRegularParam) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0988),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0013),
            });
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0989),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0014),
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
        this._labelTitle.setText(Lang_Utils.getWarBasicSettingsName(settingsType) || Lang_Constants.UndefinedError);
        this._btnModify.setIsVisible(openData.callbackOnModify != null);

        if (settingsType === Wars_Constants.BasicSettingsTypeId.NormalMapId) {
            this._updateViewAsNormalMapId();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarName) {
            this._updateViewAsWarName();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarPassword) {
            this._updateViewAsWarPassword();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarComment) {
            this._updateViewAsWarComment();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarRuleTitle) {
            this._updateViewAsWarRuleTitle();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.HasFog) {
            this._updateViewAsHasFog();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.Weather) {
            this._updateViewAsWeather();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TileTheme) {
            this._updateViewAsTileTheme();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.WarEvent) {
            this._updateViewAsWarEvent();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit) {
            this._updateViewAsTurnsAndWarOperationsLimit();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerType) {
            this._updateViewAsTimerType();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerRegularParam) {
            this._updateViewAsTimerRegularParam();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams) {
            this._updateViewAsTimerIncrementalParams();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.SpmSaveSlotIndex) {
            this._updateViewAsSpmSaveSlotIndex();
        } else if (settingsType === Wars_Constants.BasicSettingsTypeId.SpmSaveSlotComment) {
            this._updateViewAsSpmSaveSlotComment();
        } else {
            throw Helpers_Misc.newError(`CommonWarBasicSettingsPage.SettingsRenderer._updateView() invalid settingsType: ${settingsType}.`);
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
            labelValue.setText((await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? Lang_Constants.UndefinedError);
            btnHelp.setIsVisible(!!(await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getMapExtraText()?.getMapDescription().length);
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
            labelValue.setLangText(Lang_Constants.TextType.B0321);
            labelValue.setTextColor(0xFFFF00);
        } else {
            labelValue.setText(`(#${templateWarRuleId}) ${Lang_Utils.getLanguageText({ textArray : instanceWarRule?.getRuleNameArray() }) ?? Lang_Constants.UndefinedError}`);
            labelValue.setTextColor(0xFFFFFF);
        }
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsHasFog(): void {
        const openData          = this.getOpenData();
        const hasFog            = openData?.instanceWarRule.getWarRuleCommonData()?.getHasFogByDefault();
        const labelValue        = this._labelValue;
        labelValue.setLangText(hasFog ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        labelValue.setTextColor(hasFog ? 0xFFFF00 : 0xFFFFFF);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const weatherType   = WarRules_Utils_CommonData.getDefaultWeatherType(Helpers_Misc.getExisted(openData.instanceWarRule.getWarRuleCommonData()), gameConfig);
        const labelValue    = this._labelValue;
        labelValue.setText(Lang_Utils.getWeatherName(weatherType, gameConfig) ?? Lang_Constants.UndefinedError);
        labelValue.setTextColor(weatherType === gameConfig.getDefaultWeatherType() ? 0xFFFFFF: 0xFFFF00);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTileTheme(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(Lang_Utils.getTileThemeName(openData?.instanceWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? null) ?? Lang_Constants.UndefinedError);
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
        this._labelValue.setText(Lang_Utils.getBootTimerTypeName(openData?.currentValue as BootTimers_Constants.TimerTypeId) || Lang_Constants.UndefinedError);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTimerRegularParam(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(Lang_Utils.getTimeDurationText2(openData?.currentValue as number));
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTimerIncrementalParams(): void {
        const openData = this.getOpenData();
        this._labelValue.setText((openData?.currentValue as string).split(`,`).map(v => Lang_Utils.getTimeDurationText2(parseInt(v))).join(`  `));
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

        const callback      = Helpers_Misc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0185),
            currentValue : `${currentValue || ``}`,
            maxChars     : Wars_Constants.Misc.MaxNameLength,
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

        const callback      = Helpers_Misc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0186),
            currentValue : `${currentValue || ``}`,
            maxChars     : Wars_Constants.Misc.MaxPasswordLength,
            charRestrict : `0-9`,
            tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0068, Wars_Constants.Misc.MaxPasswordLength),
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

        const callback      = Helpers_Misc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0187),
            currentValue : `${currentValue || ``}`,
            maxChars     : Wars_Constants.Misc.MaxCommentLength,
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

        const callback = Helpers_Misc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsHasFog(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = Helpers_Misc.getExisted(openData.callbackOnModify);
        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback(null);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0129),
                callback   : () => callback(null),
            });
        }
    }
    private _modifyAsWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = Helpers_Misc.getExisted(openData.callbackOnModify);
        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback(null);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0129),
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
                availableNumberArray : [-1].concat(Helpers_Collection.getNonNullElements(Tiles_Constants_Common.AllThemeTypeIdArray)),
                currentNumber        : openData.instanceWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? -1,
                getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1113),
                getNumberMainText    : tileTheme => tileTheme === -1 ? Lang_Utils.getText(Lang_Constants.TextType.B0890) : (Lang_Utils.getTileThemeName(tileTheme) ?? Lang_Constants.UndefinedError),
                callbackOnConfirm    : tileTheme => {
                    callbackOnModify(tileTheme === -1 ? null : tileTheme);
                },
            });
        };

        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback();
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0129),
                callback   : callback,
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

        const callback                  = Helpers_Misc.getExisted(openData.callbackOnModify);
        const minValueForTurnsLimit     = Turns_Constants.TurnIndex.MinLimit;
        const maxValueForTurnsLimit     = Turns_Constants.TurnIndex.MaxLimit;
        const currentValue              = openData.currentValue as string;
        const textArray                 = currentValue.split(`,`);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0842),
            currentValue : parseInt(textArray[0]),
            minValue     : minValueForTurnsLimit,
            maxValue     : maxValueForTurnsLimit,
            callback     : newTurnsLimit => {
                const minValueForWarOperationsLimit = WarOperations_Constants.Common.MinLimit;
                const maxValueForWarOperationsLimit = WarOperations_Constants.Common.MaxLimit;
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0986),
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

        const callback = Helpers_Misc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsTimerRegularParam(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = Helpers_Misc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsTimerIncrementalParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback                  = Helpers_Misc.getExisted(openData.callbackOnModify);
        const minValueForInitialTime    = 10;
        const maxValueForInitialTime    = BootTimers_Constants.Incremental.MaxLimitForInitialTime;
        const currentValue              = openData.currentValue as string;
        const timeParamArray            = currentValue.split(`,`).map(v => parseInt(v));
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0389),
            currentValue : timeParamArray[0],
            minValue     : minValueForInitialTime,
            maxValue     : maxValueForInitialTime,
            tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${minValueForInitialTime}, ${maxValueForInitialTime}] (${Lang_Utils.getText(Lang_Constants.TextType.B0017)})`,
            callback     : newInitialTime => {
                const minValueForIncrementalTimePerUnit = 0;
                const maxValueForIncrementalTimePerUnit = BootTimers_Constants.Incremental.MaxLimitForIncrementPerUnit;
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
                    title        : Lang_Utils.getText(Lang_Constants.TextType.B0390),
                    currentValue : timeParamArray[1],
                    minValue     : minValueForIncrementalTimePerUnit,
                    maxValue     : maxValueForIncrementalTimePerUnit,
                    tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${minValueForIncrementalTimePerUnit}, ${maxValueForIncrementalTimePerUnit}] (${Lang_Utils.getText(Lang_Constants.TextType.B0017)})`,
                    callback     : newIncrementalTimePerUnit => {
                        const minValueForIncrementalTimePerTurn = 0;
                        const maxValueForIncrementalTimePerTurn = BootTimers_Constants.Incremental.MaxLimitForIncrementPerTurn;
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
                            title        : Lang_Utils.getText(Lang_Constants.TextType.B0991),
                            currentValue : timeParamArray[2],
                            minValue     : minValueForIncrementalTimePerTurn,
                            maxValue     : maxValueForIncrementalTimePerTurn,
                            tips         : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${minValueForIncrementalTimePerTurn}, ${maxValueForIncrementalTimePerTurn}] (${Lang_Utils.getText(Lang_Constants.TextType.B0017)})`,
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

        const callback = Helpers_Misc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsSpmSaveSlotComment(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback      = Helpers_Misc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0605),
            currentValue : `${currentValue || ``}`,
            maxChars     : SinglePlayerWars_Constants.Common.MaxSaveSlotCommentLength,
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
