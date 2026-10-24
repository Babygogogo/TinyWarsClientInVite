import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MultiplierAndOffsetsUtils from "../../multiplierAndOffsets/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoStructureMultiplierAndOffset from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple from "../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction                 = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _sclContent!                               : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;

    private readonly _btnConPlayerFilter!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConPlayerFilter!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConUnitComparator!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConUnitComparator!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTileFilter!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileFilter!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConTileComparator!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConTileComparator!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActFund!                               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActFund!                             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCoId!                               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCoId!                             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCoEnergy!                           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCoEnergy!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActAliveState!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActAliveState!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActIsSkipTurn!                         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActIsSkipTurn!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActCoUsingSkillType!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActCoUsingSkillType!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnActActivateCoSkillType!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelActActivateCoSkillType!              : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnType,                                callback: this._onTouchedBtnType },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnConPlayerFilter,                     callback: this._onTouchedBtnConPlayerFilter },
            { ui: this._btnConUnitFilter,                       callback: this._onTouchedBtnConUnitFilter },
            { ui: this._btnConUnitComparator,                   callback: this._onTouchedBtnConUnitComparator },
            { ui: this._btnConTileFilter,                       callback: this._onTouchedBtnConTileFilter },
            { ui: this._btnConTileComparator,                   callback: this._onTouchedBtnConTileComparator },

            { ui: this._btnActFund,                             callback: this._onTouchedBtnActFund },
            { ui: this._btnActCoId,                             callback: this._onTouchedBtnActCoId },
            { ui: this._btnActCoEnergy,                         callback: this._onTouchedBtnActCoEnergy },
            { ui: this._btnActAliveState,                       callback: this._onTouchedBtnActAliveState },
            { ui: this._btnActIsSkipTurn,                       callback: this._onTouchedBtnActIsSkipTurn },
            { ui: this._btnActCoUsingSkillType,                 callback: this._onTouchedBtnActCoUsingSkillType },
            { ui: this._btnActActivateCoSkillType,              callback: this._onTouchedBtnActActivateCoSkillType },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();

        this._sclContent.scrollTop();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }

    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionTypeListPanel, {
            war         : openData.war,
            fullData    : openData.fullData,
            action      : openData.action,
        });
    }

    private _onTouchedBtnConPlayerFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
                action.setConPlayerFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);

                if ((filter != null) && (!action.getConUnitComparator())) {
                    action.setConUnitComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                        comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
                        value       : 0,
                    }));
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConUnitComparator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldCon = action.getConUnitComparator();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Comparator),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle        : () => LangUtils.getText(LangConstants.TextType.B0160),
                    currentValue    : oldCon?.getValue() ?? 0,
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConUnitComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                    value       : unitsCount,
                                    comparator  : sign,
                                }));
                            }

                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        }
                    },
                });
            }
        });
    }

    private _onTouchedBtnConTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);

                if ((filter != null) && (!action.getConTileComparator())) {
                    action.setConTileComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                        comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
                        value       : 0,
                    }));
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnConTileComparator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldCon = action.getConTileComparator();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Comparator),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : sign => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle        : () => LangUtils.getText(LangConstants.TextType.B0160),
                    currentValue    : oldCon?.getValue() ?? 0,
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : TilesCount => {
                        if (TilesCount == null) {
                            action.setConTileComparator(null);
                            action.setConTileFilter(null);
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon) {
                                oldCon.setValue(TilesCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConTileComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                    value       : TilesCount,
                                    comparator  : sign,
                                }));
                            }

                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        }
                    },
                });
            }
        });
    }

    private _onTouchedBtnActFund(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActFund();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActFund(null);
                    } else {
                        action.setActFund(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActCoId(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const gcData = this.getOpenData()?.war.getGcData();
        if (gcData == null) {
            return;
        }

        const act = action.getActCoId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
            currentCoId         : act,
            availableCoIdArray  : gcData.getAllEnabledCoArray().map(v => v.getCoId()),
            gameConfig          : gcData,
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                action.setActCoId(newCoId);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
            callbackOnSetNull   : () => {
                action.setActCoId(null);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActCoEnergy(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCoEnergy();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Multiplier),
            minValue        : -WarEventsConstants.Event.MaxMultiplier,
            maxValue        : WarEventsConstants.Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.Offset),
                minValue        : -WarEventsConstants.Event.MaxOffset,
                maxValue        : WarEventsConstants.Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (MultiplierAndOffsetsUtils.checkIsDefault(multiplierAndOffset)) {
                        action.setActCoEnergy(null);
                    } else {
                        action.setActCoEnergy(multiplierAndOffset);
                    }
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActAliveState(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.PlayerAliveState),
            availableNumberArray    : [-1].concat(PlayersConstants.AllAliveStateIdArray),
            currentNumber           : action.getActAliveState() ?? -1,
            getNumberMainText       : num => num === -1 ? `(${LangUtils.getText(LangConstants.TextType.B0022)})` : (LangUtils.getPlayerAliveStateName(num) ?? LangConstants.UndefinedError),
            callbackOnConfirm       : num => {
                if (num === -1) {
                    action.setActAliveState(null);
                } else {
                    action.setActAliveState(num);
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
        });
    }

    private _onTouchedBtnActIsSkipTurn(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const oldValue = action.getActIsSkipTurn();
        if (oldValue == null) {
            action.setActIsSkipTurn(true);
        } else if (oldValue) {
            action.setActIsSkipTurn(false);
        } else {
            action.setActIsSkipTurn(null);
        }
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActCoUsingSkillType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType),
            availableNumberArray    : [-1].concat(CoSkillsConstants.AllSkillTypeIdArray),
            currentNumber           : action.getActCoUsingSkillType() ?? -1,
            getNumberMainText       : num => num === -1 ? `(${LangUtils.getText(LangConstants.TextType.B0022)})` : (LangUtils.getCoSkillTypeName(num) ?? LangConstants.UndefinedError),
            callbackOnConfirm       : num => {
                if (num === -1) {
                    action.setActCoUsingSkillType(null);
                } else {
                    action.setActCoUsingSkillType(num);
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
        });
    }

    private _onTouchedBtnActActivateCoSkillType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.TriggerCoSkillType),
            availableNumberArray    : [-1].concat(CoSkillsConstants.AllSkillTypeIdArray),
            currentNumber           : action.getActActivateCoSkillType() ?? -1,
            getNumberMainText       : num => num === -1 ? `(${LangUtils.getText(LangConstants.TextType.B0022)})` : (LangUtils.getCoSkillTypeName(num) ?? LangConstants.UndefinedError),
            callbackOnConfirm       : num => {
                if (num === -1) {
                    action.setActActivateCoSkillType(null);
                } else {
                    action.setActActivateCoSkillType(num);
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);

        this._btnConPlayerFilter.setLangText(LangConstants.TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(LangConstants.TextType.UnitFilter);
        this._btnConUnitComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnConTileFilter.setLangText(LangConstants.TextType.TileFilter);
        this._btnConTileComparator.setLangText(LangConstants.TextType.Comparator);

        this._btnActFund.setLangText(LangConstants.TextType.Fund);
        this._btnActCoId.setText(`CO`);
        this._btnActCoEnergy.setLangText(LangConstants.TextType.CoEnergy);
        this._btnActAliveState.setLangText(LangConstants.TextType.PlayerAliveState);
        this._btnActIsSkipTurn.setLangText(LangConstants.TextType.SkipATurn);
        this._btnActCoUsingSkillType.setLangText(LangConstants.TextType.ActivatingCoSkillType);
        this._btnActActivateCoSkillType.setLangText(LangConstants.TextType.TriggerCoSkillType);

        this._updateLabelDescAndLabelError();

        this._updateLabelConPlayerFilter();
        this._updateLabelConUnitFilter();
        this._updateLabelConUnitComparator();
        this._updateLabelConTileFilter();
        this._updateLabelConTileComparator();

        this._updateLabelActFund();
        this._updateLabelActCoId();
        this._updateLabelActCoEnergy();
        this._updateLabelActAliveState();
        this._updateLabelActIsSkipTurn();
        this._updateLabelActCoUsingSkillType();
        this._updateLabelActActivateCoSkillType();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = WarEventsActionsUtilsCommon.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsActionsUtilsCommon.getDetailDescForAction(action, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        this._labelConPlayerFilter.setText(this._getAction()?.getConPlayerFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        this._labelConUnitFilter.setText(this._getAction()?.getConUnitFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const comparator = this._getAction()?.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : ValueAndComparatorsUtils.getBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }

    private _updateLabelConTileComparator(): void {
        const comparator = this._getAction()?.getConTileComparator();
        this._labelConTileComparator.setText(comparator == null ? `` : ValueAndComparatorsUtils.getBriefDesc(comparator));
    }

    private _updateLabelActFund(): void {
        const act = this._getAction()?.getActFund();
        this._labelActFund.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActCoId(): void {
        const gcData    = this.getOpenData()?.war.getGcData();
        const label     = this._labelActCoId;
        if (gcData == null) {
            label.setText(LangConstants.UndefinedError);
            return;
        }

        const act = this._getAction()?.getActCoId();
        this._labelActCoId.setText(act == null
            ? ``
            : (gcData.getCoBasicCfg(act)?.getName() ?? LangConstants.UndefinedError)
        );
    }

    private _updateLabelActCoEnergy(): void {
        const act = this._getAction()?.getActCoEnergy();
        this._labelActCoEnergy.setText(act == null
            ? ``
            : MultiplierAndOffsetsUtils.getBriefDesc(act)
        );
    }

    private _updateLabelActAliveState(): void {
        const act = this._getAction()?.getActAliveState();
        this._labelActAliveState.setText(act == null
            ? ``
            : (LangUtils.getPlayerAliveStateName(act) ?? LangConstants.UndefinedError)
        );
    }

    private _updateLabelActIsSkipTurn(): void {
        const act = this._getAction()?.getActIsSkipTurn();
        this._labelActIsSkipTurn.setText(act == null
            ? ``
            : LangUtils.getTextForYesOrNo(act)
        );
    }

    private _updateLabelActCoUsingSkillType(): void {
        const act = this._getAction()?.getActCoUsingSkillType();
        this._labelActCoUsingSkillType.setText(act == null
            ? ``
            : (LangUtils.getCoSkillTypeName(act) ?? LangConstants.UndefinedError)
        );
    }

    private _updateLabelActActivateCoSkillType(): void {
        const act = this._getAction()?.getActActivateCoSkillType();
        this._labelActActivateCoSkillType.setText(act == null
            ? ``
            : (LangUtils.getCoSkillTypeName(act) ?? LangConstants.UndefinedError)
        );
    }

    private _getAction(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple.WeaSetPlayerStateSimple> {
        return this.getOpenData()?.action.getWeaSetPlayerStateSimple();
    }
}
