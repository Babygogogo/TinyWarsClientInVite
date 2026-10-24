import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecPlayerPresence from "../../proto/schema/CommonProto/WarEvent/WecPlayerPresence.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition              = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

export interface OpenData {
    war         : BaseWarInterfaceIBwWar.IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                         : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnPlayerFilter!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPlayerFilter!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPlayerComparator!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPlayerComparator!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnUnitFilter!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelUnitFilter!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnUnitComparator!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelUnitComparator!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTileFilter!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTileFilter!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTileComparator!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTileComparator!              : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },

            { ui: this._btnPlayerFilter,                callback: this._onTouchedBtnPlayerFilter },
            { ui: this._btnPlayerComparator,            callback: this._onTouchedBtnPlayerComparator },

            { ui: this._btnUnitFilter,                  callback: this._onTouchedBtnUnitFilter },
            { ui: this._btnUnitComparator,              callback: this._onTouchedBtnUnitComparator },

            { ui: this._btnTileFilter,                  callback: this._onTouchedBtnTileFilter },
            { ui: this._btnTileComparator,              callback: this._onTouchedBtnTileComparator },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionTypeListPanel, {
            fullData    : openData.fullData,
            condition   : openData.condition,
            war         : openData.war,
        });
    }

    private _onTouchedBtnPlayerFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        if (condition == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : condition.getConPlayerFilter(),
            callback                : filter => {
                condition.setConPlayerFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnPlayerComparator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        if (condition == null) {
            return;
        }

        if (!condition.getConPlayerComparator()) {
            condition.setConPlayerComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            }));
        }

        const con = HelpersMisc.getExisted(condition.getConPlayerComparator());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0229),
            currentValue    : con.getValue() ?? 0,
            minValue        : 0,
            maxValue        : war.getPlayersCountUnneutral() + 1,
            callback        : playersCount => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.Comparator),
                availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
                currentNumber           : con.getComparator(),
                getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
                callbackOnConfirm       : sign => {
                    con.setValue(playersCount);
                    con.setComparator(sign);

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }),
        });
    }
    private _onTouchedBtnUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        if (condition == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : condition.getConUnitFilter(),
            callback                : filter => {
                condition.setConUnitFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnUnitComparator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        if (condition == null) {
            return;
        }

        const oldCon = condition.getConUnitComparator();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0160),
            currentValue    : oldCon?.getValue(),
            minValue        : 0,
            maxValue        : 100000,
            callback        : unitsCount => {
                if (unitsCount == null) {
                    condition.setConUnitComparator(null);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.Comparator),
                        availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
                        currentNumber           : oldCon?.getComparator(),
                        getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
                        callbackOnConfirm       : sign => {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                condition.setConUnitComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                    value       : unitsCount,
                                    comparator  : sign,
                                }));
                            }

                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        }
                    });
                }
            },
        });
    }
    private _onTouchedBtnTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        if (condition == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : condition.getConTileFilter(),
            callback                : filter => {
                condition.setConTileFilter(filter);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnTileComparator(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const condition = this._getCondition();
        if (condition == null) {
            return;
        }

        const oldCon = condition.getConTileComparator();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0778),
            currentValue    : oldCon?.getValue(),
            minValue        : 0,
            maxValue        : GameConfigGcMap.Constants.MaxGridsCount,
            callback        : unitsCount => {
                if (unitsCount == null) {
                    condition.setConTileComparator(null);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                        getTitleText            : () => LangUtils.getText(LangConstants.TextType.Comparator),
                        availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
                        currentNumber           : oldCon?.getComparator(),
                        getNumberMainText       : num => LangUtils.getComparatorName(num) ?? LangConstants.UndefinedError,
                        callbackOnConfirm       : sign => {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                condition.setConTileComparator(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                                    value       : unitsCount,
                                    comparator  : sign,
                                }));
                            }

                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                        }
                    });
                }
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateLabelPlayerFilter();
        this._updateLabelPlayerComparator();
        this._updateLabelUnitFilter();
        this._updateLabelUnitComparator();
        this._updateLabelTileFilter();
        this._updateInputTileComparator();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnType.setLangText(LangConstants.TextType.B0516);

        this._btnPlayerFilter.setLangText(LangConstants.TextType.PlayerFilter);
        this._btnPlayerComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnUnitFilter.setLangText(LangConstants.TextType.UnitFilter);
        this._btnUnitComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnTileFilter.setLangText(LangConstants.TextType.TileFilter);
        this._btnTileComparator.setLangText(LangConstants.TextType.Comparator);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = WarEventsConditionsUtilsCommon.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsConditionsUtilsCommon.getDetailedDescForCondition(condition, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelPlayerFilter(): void {
        this._labelPlayerFilter.setText(this._getCondition()?.getConPlayerFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }
    private _updateLabelPlayerComparator(): void {
        const comparator = this._getCondition()?.getConPlayerComparator();
        this._labelPlayerComparator.setText(comparator == null
            ? LangConstants.UndefinedError
            : ValueAndComparatorsUtils.getBriefDesc(comparator)
        );
    }
    private _updateLabelUnitFilter(): void {
        this._labelUnitFilter.setText(this._getCondition()?.getConUnitFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }
    private _updateLabelUnitComparator(): void {
        const comparator = this._getCondition()?.getConUnitComparator();
        this._labelUnitComparator.setText(comparator == null
            ? ``
            : ValueAndComparatorsUtils.getBriefDesc(comparator)
        );
    }
    private _updateLabelTileFilter(): void {
        this._labelTileFilter.setText(this._getCondition()?.getConTileFilter() == null ? `` : LangUtils.getText(LangConstants.TextType.B1408));
    }
    private _updateInputTileComparator(): void {
        const comparator = this._getCondition()?.getConTileComparator();
        this._labelTileComparator.setText(comparator == null
            ? ``
            : ValueAndComparatorsUtils.getBriefDesc(comparator)
        );
    }

    private _getCondition(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWecPlayerPresence.WecPlayerPresence> {
        return this.getOpenData()?.condition.getWecPlayerPresence();
    }
}
