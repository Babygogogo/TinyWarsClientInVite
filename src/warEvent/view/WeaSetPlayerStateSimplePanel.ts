import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { AllSkillTypeIdArray } from "../../coSkills/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getComparatorName, getPlayerAliveStateName, getCoSkillTypeName, getTextForYesOrNo } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { checkIsDefault, getBriefDesc } from "../../multiplierAndOffsets/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { AllAliveStateIdArray } from "../../players/Constants.ts";
import { MultiplierAndOffset } from "../../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaSetPlayerStateSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { ComparatorId, AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc as ValueAndComparatorsUtilsGetBriefDesc } from "../../valueAndComparators/Utils.ts";
import { getErrorTipForAction, getDetailDescForAction } from "../../warEvents/actions/utils/Common.ts";
import { Event } from "../../warEvents/Constants.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction                 = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnType!                                  : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _sclContent!                               : IUiScroller<IUiContainer>;

    private readonly _btnConPlayerFilter!                       : IUiButton;
    private readonly _labelConPlayerFilter!                     : IUiLabel;

    private readonly _btnConUnitFilter!                         : IUiButton;
    private readonly _labelConUnitFilter!                       : IUiLabel;

    private readonly _btnConUnitComparator!                     : IUiButton;
    private readonly _labelConUnitComparator!                   : IUiLabel;

    private readonly _btnConTileFilter!                         : IUiButton;
    private readonly _labelConTileFilter!                       : IUiLabel;

    private readonly _btnConTileComparator!                     : IUiButton;
    private readonly _labelConTileComparator!                   : IUiLabel;

    private readonly _btnActFund!                               : IUiButton;
    private readonly _labelActFund!                             : IUiLabel;

    private readonly _btnActCoId!                               : IUiButton;
    private readonly _labelActCoId!                             : IUiLabel;

    private readonly _btnActCoEnergy!                           : IUiButton;
    private readonly _labelActCoEnergy!                         : IUiLabel;

    private readonly _btnActAliveState!                         : IUiButton;
    private readonly _labelActAliveState!                       : IUiLabel;

    private readonly _btnActIsSkipTurn!                         : IUiButton;
    private readonly _labelActIsSkipTurn!                       : IUiLabel;

    private readonly _btnActCoUsingSkillType!                   : IUiButton;
    private readonly _labelActCoUsingSkillType!                 : IUiLabel;

    private readonly _btnActActivateCoSkillType!                : IUiButton;
    private readonly _labelActActivateCoSkillType!              : IUiLabel;

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
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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

        openPanel(getDict().WeActionTypeListPanel, {
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

        openPanel(getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : action.getConPlayerFilter(),
            callback                : filter => {
                action.setConPlayerFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
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

        openPanel(getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConUnitFilter(),
            callback                : filter => {
                action.setConUnitFilter(filter);

                if ((filter != null) && (!action.getConUnitComparator())) {
                    action.setConUnitComparator(ValueAndComparator.fromJson({
                        comparator  : ComparatorId.EqualTo,
                        value       : 0,
                    }));
                }

                dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Comparator),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => {
                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle        : () => getText(TextType.B0160),
                    currentValue    : oldCon?.getValue() ?? 0,
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : unitsCount => {
                        if (unitsCount == null) {
                            action.setConUnitComparator(null);
                            action.setConUnitFilter(null);
                            dispatch(TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConUnitComparator(ValueAndComparator.fromJson({
                                    value       : unitsCount,
                                    comparator  : sign,
                                }));
                            }

                            dispatch(TypeId.WarEventFullDataChanged);
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

        openPanel(getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : action.getConTileFilter(),
            callback                : filter => {
                action.setConTileFilter(filter);

                if ((filter != null) && (!action.getConTileComparator())) {
                    action.setConTileComparator(ValueAndComparator.fromJson({
                        comparator  : ComparatorId.EqualTo,
                        value       : 0,
                    }));
                }

                dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.Comparator),
            availableNumberArray    : AllComparatorIdArray,
            currentNumber           : oldCon?.getComparator(),
            getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
            callbackOnConfirm       : sign => {
                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle        : () => getText(TextType.B0160),
                    currentValue    : oldCon?.getValue() ?? 0,
                    minValue        : 0,
                    maxValue        : 10,
                    callback        : TilesCount => {
                        if (TilesCount == null) {
                            action.setConTileComparator(null);
                            action.setConTileFilter(null);
                            dispatch(TypeId.WarEventFullDataChanged);
                        } else {
                            if (oldCon) {
                                oldCon.setValue(TilesCount);
                                oldCon.setComparator(sign);
                            } else {
                                action.setConTileComparator(ValueAndComparator.fromJson({
                                    value       : TilesCount,
                                    comparator  : sign,
                                }));
                            }

                            dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActFund(null);
                    } else {
                        action.setActFund(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
            currentCoId         : act,
            availableCoIdArray  : gcData.getAllEnabledCoArray().map(v => v.getCoId()),
            gameConfig          : gcData,
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                action.setActCoId(newCoId);
                dispatch(TypeId.WarEventFullDataChanged);
            },
            callbackOnSetNull   : () => {
                action.setActCoId(null);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnActCoEnergy(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        const act = action.getActCoEnergy();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Multiplier),
            minValue        : -Event.MaxMultiplier,
            maxValue        : Event.MaxMultiplier,
            currentValue    : act?.getMultiplierPct() ?? 100,
            callback        : newMultiplierPct => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.Offset),
                minValue        : -Event.MaxOffset,
                maxValue        : Event.MaxOffset,
                currentValue    : act?.getOffset() ?? 0,
                callback        : newOffset => {
                    const multiplierAndOffset = MultiplierAndOffset.fromJson({
                        multiplierPct   : newMultiplierPct,
                        offset          : newOffset,
                    });
                    if (checkIsDefault(multiplierAndOffset)) {
                        action.setActCoEnergy(null);
                    } else {
                        action.setActCoEnergy(multiplierAndOffset);
                    }
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }

    private _onTouchedBtnActAliveState(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.PlayerAliveState),
            availableNumberArray    : [-1].concat(AllAliveStateIdArray),
            currentNumber           : action.getActAliveState() ?? -1,
            getNumberMainText       : num => num === -1 ? `(${getText(TextType.B0022)})` : (getPlayerAliveStateName(num) ?? UndefinedError),
            callbackOnConfirm       : num => {
                if (num === -1) {
                    action.setActAliveState(null);
                } else {
                    action.setActAliveState(num);
                }
                dispatch(TypeId.WarEventFullDataChanged);
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
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _onTouchedBtnActCoUsingSkillType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.ActivatingCoSkillType),
            availableNumberArray    : [-1].concat(AllSkillTypeIdArray),
            currentNumber           : action.getActCoUsingSkillType() ?? -1,
            getNumberMainText       : num => num === -1 ? `(${getText(TextType.B0022)})` : (getCoSkillTypeName(num) ?? UndefinedError),
            callbackOnConfirm       : num => {
                if (num === -1) {
                    action.setActCoUsingSkillType(null);
                } else {
                    action.setActCoUsingSkillType(num);
                }
                dispatch(TypeId.WarEventFullDataChanged);
            }
        });
    }

    private _onTouchedBtnActActivateCoSkillType(): void {
        const action = this._getAction();
        if (action == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.TriggerCoSkillType),
            availableNumberArray    : [-1].concat(AllSkillTypeIdArray),
            currentNumber           : action.getActActivateCoSkillType() ?? -1,
            getNumberMainText       : num => num === -1 ? `(${getText(TextType.B0022)})` : (getCoSkillTypeName(num) ?? UndefinedError),
            callbackOnConfirm       : num => {
                if (num === -1) {
                    action.setActActivateCoSkillType(null);
                } else {
                    action.setActActivateCoSkillType(num);
                }
                dispatch(TypeId.WarEventFullDataChanged);
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
        this._labelTitle.setText(`${getText(TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(TextType.B0516);

        this._btnConPlayerFilter.setLangText(TextType.PlayerFilter);
        this._btnConUnitFilter.setLangText(TextType.UnitFilter);
        this._btnConUnitComparator.setLangText(TextType.Comparator);
        this._btnConTileFilter.setLangText(TextType.TileFilter);
        this._btnConTileComparator.setLangText(TextType.Comparator);

        this._btnActFund.setLangText(TextType.Fund);
        this._btnActCoId.setText(`CO`);
        this._btnActCoEnergy.setLangText(TextType.CoEnergy);
        this._btnActAliveState.setLangText(TextType.PlayerAliveState);
        this._btnActIsSkipTurn.setLangText(TextType.SkipATurn);
        this._btnActCoUsingSkillType.setLangText(TextType.ActivatingCoSkillType);
        this._btnActActivateCoSkillType.setLangText(TextType.TriggerCoSkillType);

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
        const errorTip          = getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailDescForAction(action, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateLabelConPlayerFilter(): void {
        this._labelConPlayerFilter.setText(this._getAction()?.getConPlayerFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitFilter(): void {
        this._labelConUnitFilter.setText(this._getAction()?.getConUnitFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConUnitComparator(): void {
        const comparator = this._getAction()?.getConUnitComparator();
        this._labelConUnitComparator.setText(comparator == null ? `` : ValueAndComparatorsUtilsGetBriefDesc(comparator));
    }

    private _updateLabelConTileFilter(): void {
        this._labelConTileFilter.setText(this._getAction()?.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _updateLabelConTileComparator(): void {
        const comparator = this._getAction()?.getConTileComparator();
        this._labelConTileComparator.setText(comparator == null ? `` : ValueAndComparatorsUtilsGetBriefDesc(comparator));
    }

    private _updateLabelActFund(): void {
        const act = this._getAction()?.getActFund();
        this._labelActFund.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActCoId(): void {
        const gcData    = this.getOpenData()?.war.getGcData();
        const label     = this._labelActCoId;
        if (gcData == null) {
            label.setText(UndefinedError);
            return;
        }

        const act = this._getAction()?.getActCoId();
        this._labelActCoId.setText(act == null
            ? ``
            : (gcData.getCoBasicCfg(act)?.getName() ?? UndefinedError)
        );
    }

    private _updateLabelActCoEnergy(): void {
        const act = this._getAction()?.getActCoEnergy();
        this._labelActCoEnergy.setText(act == null
            ? ``
            : getBriefDesc(act)
        );
    }

    private _updateLabelActAliveState(): void {
        const act = this._getAction()?.getActAliveState();
        this._labelActAliveState.setText(act == null
            ? ``
            : (getPlayerAliveStateName(act) ?? UndefinedError)
        );
    }

    private _updateLabelActIsSkipTurn(): void {
        const act = this._getAction()?.getActIsSkipTurn();
        this._labelActIsSkipTurn.setText(act == null
            ? ``
            : getTextForYesOrNo(act)
        );
    }

    private _updateLabelActCoUsingSkillType(): void {
        const act = this._getAction()?.getActCoUsingSkillType();
        this._labelActCoUsingSkillType.setText(act == null
            ? ``
            : (getCoSkillTypeName(act) ?? UndefinedError)
        );
    }

    private _updateLabelActActivateCoSkillType(): void {
        const act = this._getAction()?.getActActivateCoSkillType();
        this._labelActActivateCoSkillType.setText(act == null
            ? ``
            : (getCoSkillTypeName(act) ?? UndefinedError)
        );
    }

    private _getAction(): Undefinable<WeaSetPlayerStateSimple> {
        return this.getOpenData()?.action.getWeaSetPlayerStateSimple();
    }
}
