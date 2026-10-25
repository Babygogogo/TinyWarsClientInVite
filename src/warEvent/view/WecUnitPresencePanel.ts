import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getComparatorName } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type {
    WarEventCondition as ProtoSchemaCommonProtoWarEventWarEventCondition,
} from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecUnitPresence } from "../../proto/schema/CommonProto/WarEvent/WecUnitPresence.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { AllComparatorIdArray } from "../../valueAndComparators/Constants.ts";
import { getBriefDesc } from "../../valueAndComparators/Utils.ts";
import { getErrorTipForCondition, getDetailedDescForCondition } from "../../warEvents/conditions/utils/Common.ts";

type WarEventFullData               = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventCondition              = ProtoSchemaCommonProtoWarEventWarEventCondition;

export interface OpenData {
    war         : IBwWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                          : IUiImage;
    private readonly _group!                            : IUiContainer;
    private readonly _labelTitle!                       : IUiLabel;
    private readonly _btnType!                          : IUiButton;
    private readonly _btnClose!                         : IUiButton;

    private readonly _groupDesc!                        : IUiLayout;
    private readonly _labelDesc!                        : IUiLabel;
    private readonly _labelError!                       : IUiLabel;

    private readonly _btnPlayerFilter!                  : IUiButton;
    private readonly _labelPlayerFilter!                : IUiLabel;

    private readonly _btnUnitFilter!                    : IUiButton;
    private readonly _labelUnitFilter!                  : IUiLabel;
    private readonly _btnUnitComparator!                : IUiButton;
    private readonly _labelUnitComparator!              : IUiLabel;

    private readonly _btnTileFilter!                    : IUiButton;
    private readonly _labelTileFilter!                  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },

            { ui: this._btnPlayerFilter,                callback: this._onTouchedBtnPlayerFilter },

            { ui: this._btnUnitFilter,                  callback: this._onTouchedBtnUnitFilter },
            { ui: this._btnUnitComparator,              callback: this._onTouchedBtnUnitComparator },

            { ui: this._btnTileFilter,                  callback: this._onTouchedBtnTileFilter },
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

        openPanel(getDict().WeConditionTypeListPanel, {
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

        openPanel(getDict().WePlayerFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            currentFilter           : condition.getConPlayerFilter(),
            callback                : filter => {
                condition.setConPlayerFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
            },
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

        openPanel(getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : condition.getConUnitFilter(),
            callback                : filter => {
                condition.setConUnitFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.B0160),
            currentValue    : oldCon?.getValue(),
            minValue        : 0,
            maxValue        : 100000,
            callback        : unitsCount => {
                if (unitsCount == null) {
                    condition.setConUnitComparator(null);
                    dispatch(TypeId.WarEventFullDataChanged);
                } else {
                    openPanel(getDict().CommonChooseSingleNumberPanel, {
                        getTitleText            : () => getText(TextType.Comparator),
                        availableNumberArray    : AllComparatorIdArray,
                        currentNumber           : oldCon?.getComparator(),
                        getNumberMainText       : num => getComparatorName(num) ?? UndefinedError,
                        callbackOnConfirm       : sign => {
                            if (oldCon) {
                                oldCon.setValue(unitsCount);
                                oldCon.setComparator(sign);
                            } else {
                                condition.setConUnitComparator(ValueAndComparator.fromJson({
                                    value       : unitsCount,
                                    comparator  : sign,
                                }));
                            }

                            dispatch(TypeId.WarEventFullDataChanged);
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

        openPanel(getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : condition.getConTileFilter(),
            callback                : filter => {
                condition.setConTileFilter(filter);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateLabelPlayerFilter();
        this._updateLabelUnitFilter();
        this._updateLabelUnitComparator();
        this._updateLabelTileFilter();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnType.setLangText(TextType.B0516);

        this._btnPlayerFilter.setLangText(TextType.PlayerFilter);
        this._btnUnitFilter.setLangText(TextType.UnitFilter);
        this._btnUnitComparator.setLangText(TextType.Comparator);
        this._btnTileFilter.setLangText(TextType.TileFilter);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailedDescForCondition(condition, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelPlayerFilter(): void {
        this._labelPlayerFilter.setText(this._getCondition()?.getConPlayerFilter() == null ? `` : getText(TextType.B1408));
    }
    private _updateLabelUnitFilter(): void {
        this._labelUnitFilter.setText(this._getCondition()?.getConUnitFilter() == null ? `` : getText(TextType.B1408));
    }
    private _updateLabelUnitComparator(): void {
        const comparator = this._getCondition()?.getConUnitComparator();
        this._labelUnitComparator.setText(comparator == null
            ? ``
            : getBriefDesc(comparator)
        );
    }
    private _updateLabelTileFilter(): void {
        this._labelTileFilter.setText(this._getCondition()?.getConTileFilter() == null ? `` : getText(TextType.B1408));
    }

    private _getCondition(): Undefinable<WecUnitPresence> {
        return this.getOpenData()?.condition.getWecUnitPresence();
    }
}
