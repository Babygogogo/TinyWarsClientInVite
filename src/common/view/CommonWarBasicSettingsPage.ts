import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export type OpenData = {
    dataArrayForListSettings    : DataForSettingsRenderer[];
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _listSettings! : UiInterfacesIUiScrollList.IUiScrollList<DataForSettingsRenderer>;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "common/CommonWarBasicSettingsPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._listSettings.setItemRendererClass(SettingsRenderer);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
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

interface DataForSettingsRenderer extends UiTypesUiListItemData.UiListItemData {
    settingsType        : GameConfigGcWar.BasicSettingsType;
    currentValue        : number | string | null;
    instanceWarRule     : ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;
    gameConfig          : GameConfigGcData.GcData;
    warEventFullData    : Undefinable<ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData>;
    callbackOnModify    : ((newValue: string | number | null) => void) | null;
}
class SettingsRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSettingsRenderer> {
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelValue!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModify!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnModify,  callback: this._onTouchedBtnModify },
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        if (settingsType === GameConfigGcWar.BasicSettingsType.NormalMapId) {
            this._modifyAsNormalMapId();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarName) {
            this._modifyAsWarName();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarPassword) {
            this._modifyAsWarPassword();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarComment) {
            this._modifyAsWarComment();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarRuleTitle) {
            this._modifyAsWarRuleTitle();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.HasFog) {
            this._modifyAsHasFog();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.Weather) {
            this._modifyAsWeather();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TileTheme) {
            this._modifyAsTileTheme();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarEvent) {
            this._modifyAsWarEvent();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit) {
            this._modifyAsTurnsAndWarOperationsLimit();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerType) {
            this._modifyAsTimerType();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerRegularParam) {
            this._modifyAsTimerRegularParam();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerIncrementalParams) {
            this._modifyAsTimerIncrementalParams();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.SpmSaveSlotIndex) {
            this._modifyAsSpmSaveSlotIndex();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.SpmSaveSlotComment) {
            this._modifyAsSpmSaveSlotComment();
        } else {
            throw HelpersMisc.newError(`CommonWarBasicSettingsPage.SettingsRenderer._onTouchedBtnModify() invalid settingsType: ${settingsType}`);
        }
    }
    private async _onTouchedBtnHelp(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const settingsType = openData.settingsType;
        if (settingsType === GameConfigGcWar.BasicSettingsType.NormalMapId) {
            const normalMapId     = openData.currentValue;
            const mapDesc   = (typeof normalMapId == "number")
                ? (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getMapExtraText()?.getMapDescription()
                : (null);
            if (mapDesc == null) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.B0894));
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                    getTitle   : () => LangUtils.getText(LangConstants.TextType.B0893),
                    getContent : () => LangUtils.getLanguageText({ textArray: mapDesc }) ?? LangConstants.UndefinedError,
                });
            }

        } else if (settingsType === GameConfigGcWar.BasicSettingsType.HasFog) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getTitle  : () => LangUtils.getText(LangConstants.TextType.B0020),
                getContent: () => LangUtils.getText(LangConstants.TextType.R0002),
            });

        } else if (settingsType === GameConfigGcWar.BasicSettingsType.Weather) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getTitle  : () => LangUtils.getText(LangConstants.TextType.Weather),
                getContent: () => LangUtils.getWeatherFullDesc(openData.gameConfig),
            });

        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarEvent) {
            const warEventFullData  = openData.warEventFullData;
            const warEventIdArray   = openData.instanceWarRule.getWarEventFullData()?.getEventArray().map(v => HelpersMisc.getExisted(v.getEventId())) ?? [];
            if ((warEventFullData) && (warEventIdArray?.length)) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonWarEventListPanel, {
                    warEventFullData,
                    warEventIdArray,
                    gameConfig          : openData.gameConfig,
                });
            }

        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getTitle  : () => LangUtils.getText(LangConstants.TextType.B0987),
                getContent: () => LangUtils.getText(LangConstants.TextType.R0012),
            });

        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerType) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getTitle  : () => LangUtils.getText(LangConstants.TextType.B0574),
                getContent: () => LangUtils.getText(LangConstants.TextType.R0003),
            });
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerRegularParam) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getTitle   : () => LangUtils.getText(LangConstants.TextType.B0988),
                getContent : () => LangUtils.getText(LangConstants.TextType.R0013),
            });
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerIncrementalParams) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getTitle   : () => LangUtils.getText(LangConstants.TextType.B0989),
                getContent : () => LangUtils.getText(LangConstants.TextType.R0014),
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
        this._labelTitle.setText(LangUtils.getWarBasicSettingsName(settingsType) || LangConstants.UndefinedError);
        this._btnModify.setIsVisible(openData.callbackOnModify != null);

        if (settingsType === GameConfigGcWar.BasicSettingsType.NormalMapId) {
            this._updateViewAsNormalMapId();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarName) {
            this._updateViewAsWarName();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarPassword) {
            this._updateViewAsWarPassword();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarComment) {
            this._updateViewAsWarComment();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarRuleTitle) {
            this._updateViewAsWarRuleTitle();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.HasFog) {
            this._updateViewAsHasFog();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.Weather) {
            this._updateViewAsWeather();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TileTheme) {
            this._updateViewAsTileTheme();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.WarEvent) {
            this._updateViewAsWarEvent();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit) {
            this._updateViewAsTurnsAndWarOperationsLimit();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerType) {
            this._updateViewAsTimerType();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerRegularParam) {
            this._updateViewAsTimerRegularParam();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.TimerIncrementalParams) {
            this._updateViewAsTimerIncrementalParams();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.SpmSaveSlotIndex) {
            this._updateViewAsSpmSaveSlotIndex();
        } else if (settingsType === GameConfigGcWar.BasicSettingsType.SpmSaveSlotComment) {
            this._updateViewAsSpmSaveSlotComment();
        } else {
            throw HelpersMisc.newError(`CommonWarBasicSettingsPage.SettingsRenderer._updateView() invalid settingsType: ${settingsType}.`);
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
            labelValue.setText((await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? LangConstants.UndefinedError);
            btnHelp.setIsVisible(!!(await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getMapExtraText()?.getMapDescription().length);
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
            labelValue.setText(LangUtils.getText(LangConstants.TextType.B0321));
            labelValue.setTextColor(0xFFFF00);
        } else {
            labelValue.setText(`(#${templateWarRuleId}) ${LangUtils.getLanguageText({ textArray: instanceWarRule?.getRuleNameArray() }) ?? LangConstants.UndefinedError}`);
            labelValue.setTextColor(0xFFFFFF);
        }
        this._btnHelp.setIsVisible(false);
    }
    private _updateViewAsHasFog(): void {
        const openData          = this.getOpenData();
        const hasFog            = openData?.instanceWarRule.getWarRuleCommonData()?.getHasFogByDefault();
        const labelValue        = this._labelValue;
        labelValue.setText(LangUtils.getText(hasFog ? LangConstants.TextType.Yes : LangConstants.TextType.No));
        labelValue.setTextColor(hasFog ? 0xFFFF00 : 0xFFFFFF);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const weatherType   = WarRulesUtilsCommonData.getDefaultWeatherType(HelpersMisc.getExisted(openData.instanceWarRule.getWarRuleCommonData()), gameConfig);
        const labelValue    = this._labelValue;
        labelValue.setText(LangUtils.getWeatherName(weatherType, gameConfig) ?? LangConstants.UndefinedError);
        labelValue.setTextColor(weatherType === gameConfig.getDefaultWeatherType() ? 0xFFFFFF: 0xFFFF00);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTileTheme(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(LangUtils.getTileThemeName(openData?.instanceWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? null) ?? LangConstants.UndefinedError);
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
        this._labelValue.setText(LangUtils.getBootTimerTypeName(openData?.currentValue as BootTimersConstants.TimerTypeId) || LangConstants.UndefinedError);
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTimerRegularParam(): void {
        const openData = this.getOpenData();
        this._labelValue.setText(LangUtils.getTimeDurationText2(openData?.currentValue as number));
        this._btnHelp.setIsVisible(true);
    }
    private _updateViewAsTimerIncrementalParams(): void {
        const openData = this.getOpenData();
        this._labelValue.setText((openData?.currentValue as string).split(`,`).map(v => LangUtils.getTimeDurationText2(parseInt(v))).join(`  `));
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

        const callback      = HelpersMisc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0185),
            currentValue    : `${currentValue || ``}`,
            maxChars        : GameConfigGcWar.Misc.MaxNameLength,
            charRestrict    : null,
            tips            : null,
            callback        : panel => {
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

        const callback      = HelpersMisc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0186),
            currentValue    : `${currentValue || ``}`,
            maxChars        : GameConfigGcWar.Misc.MaxPasswordLength,
            charRestrict    : `0-9`,
            tips            : LangUtils.getFormattedText(LangConstants.TextType.F0068, GameConfigGcWar.Misc.MaxPasswordLength),
            callback        : panel => {
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

        const callback      = HelpersMisc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0187),
            currentValue    : `${currentValue || ``}`,
            maxChars        : GameConfigGcWar.Misc.MaxCommentLength,
            charRestrict    : null,
            tips            : null,
            callback        : panel => {
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

        const callback = HelpersMisc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsHasFog(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = HelpersMisc.getExisted(openData.callbackOnModify);
        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback(null);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0129),
                callback: () => callback(null),
            });
        }
    }
    private _modifyAsWeather(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = HelpersMisc.getExisted(openData.callbackOnModify);
        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback(null);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0129),
                callback: () => callback(null),
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                availableNumberArray    : [-1].concat(HelpersCollection.getNonNullElements(TilesConstantsCommon.AllThemeTypeIdArray)),
                currentNumber           : openData.instanceWarRule.getWarRuleCommonData()?.getFixedTileTheme() ?? -1,
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1113),
                getNumberMainText           : tileTheme => tileTheme === -1 ? LangUtils.getText(LangConstants.TextType.B0890) : (LangUtils.getTileThemeName(tileTheme) ?? LangConstants.UndefinedError),
                callbackOnConfirm       : tileTheme => {
                    callbackOnModify(tileTheme === -1 ? null : tileTheme);
                },
            });
        };

        if (openData.instanceWarRule.getTemplateWarRuleId() == null) {
            callback();
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0129),
                callback: callback
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

        const callback                  = HelpersMisc.getExisted(openData.callbackOnModify);
        const minValueForTurnsLimit     = TurnsConstants.TurnIndex.MinLimit;
        const maxValueForTurnsLimit     = TurnsConstants.TurnIndex.MaxLimit;
        const currentValue              = openData.currentValue as string;
        const textArray                 = currentValue.split(`,`);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0842),
            currentValue    : parseInt(textArray[0]),
            minValue        : minValueForTurnsLimit,
            maxValue        : maxValueForTurnsLimit,
            callback        : newTurnsLimit => {
                const minValueForWarOperationsLimit = WarOperationsConstants.Common.MinLimit;
                const maxValueForWarOperationsLimit = WarOperationsConstants.Common.MaxLimit;
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                    getTitle           : () => LangUtils.getText(LangConstants.TextType.B0986),
                    currentValue    : parseInt(textArray[1]),
                    minValue        : minValueForWarOperationsLimit,
                    maxValue        : maxValueForWarOperationsLimit,
                    callback        : newWarOperationsLimit => {
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

        const callback = HelpersMisc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsTimerRegularParam(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback = HelpersMisc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsTimerIncrementalParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback                  = HelpersMisc.getExisted(openData.callbackOnModify);
        const minValueForInitialTime    = 10;
        const maxValueForInitialTime    = BootTimersConstants.Incremental.MaxLimitForInitialTime;
        const currentValue              = openData.currentValue as string;
        const timeParamArray            = currentValue.split(`,`).map(v => parseInt(v));
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0389),
            currentValue    : timeParamArray[0],
            minValue        : minValueForInitialTime,
            maxValue        : maxValueForInitialTime,
            tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${minValueForInitialTime}, ${maxValueForInitialTime}] (${LangUtils.getText(LangConstants.TextType.B0017)})`,
            callback        : newInitialTime => {
                const minValueForIncrementalTimePerUnit = 0;
                const maxValueForIncrementalTimePerUnit = BootTimersConstants.Incremental.MaxLimitForIncrementPerUnit;
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
                    title           : LangUtils.getText(LangConstants.TextType.B0390),
                    currentValue    : timeParamArray[1],
                    minValue        : minValueForIncrementalTimePerUnit,
                    maxValue        : maxValueForIncrementalTimePerUnit,
                    tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${minValueForIncrementalTimePerUnit}, ${maxValueForIncrementalTimePerUnit}] (${LangUtils.getText(LangConstants.TextType.B0017)})`,
                    callback        : newIncrementalTimePerUnit => {
                        const minValueForIncrementalTimePerTurn = 0;
                        const maxValueForIncrementalTimePerTurn = BootTimersConstants.Incremental.MaxLimitForIncrementPerTurn;
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
                            title           : LangUtils.getText(LangConstants.TextType.B0991),
                            currentValue    : timeParamArray[2],
                            minValue        : minValueForIncrementalTimePerTurn,
                            maxValue        : maxValueForIncrementalTimePerTurn,
                            tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${minValueForIncrementalTimePerTurn}, ${maxValueForIncrementalTimePerTurn}] (${LangUtils.getText(LangConstants.TextType.B0017)})`,
                            callback        : newIncrementalTimePerTurn => {
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

        const callback = HelpersMisc.getExisted(openData.callbackOnModify);
        callback(null);
    }
    private _modifyAsSpmSaveSlotComment(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const callback      = HelpersMisc.getExisted(openData.callbackOnModify);
        const currentValue  = openData.currentValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0605),
            currentValue    : `${currentValue || ``}`,
            maxChars        : GameConfigGcWar.SinglePlayerWar.MaxSaveSlotCommentLength,
            charRestrict    : null,
            tips            : null,
            callback        : panel => {
                const newValue = panel.getInputText() || null;
                if (newValue != currentValue) {
                    callback(newValue);
                }
            },
        });
    }
}
