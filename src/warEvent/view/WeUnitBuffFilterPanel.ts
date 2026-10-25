import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getUnitBuffName, getUnitBuffDesc, getComparatorName, getTextForYesOrNo } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UnitBuffFilter } from "../../proto/schema/CommonProto/Structure/UnitBuffFilter.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import { ValueArrayAndPredicate } from "../../proto/schema/CommonProto/Structure/ValueArrayAndPredicate.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { AllBuffTypeIdArray, EndTimeModification } from "../../unitBuffs/Constants.ts";
import { checkIsEmpty, tickConIsEverlasting, getErrorTip, getDesc } from "../../unitBuffs/utils/Filter.ts";
import { AllComparatorIdArray, ComparatorId } from "../../valueAndComparators/Constants.ts";
import { tickIsOneOf } from "../../valueArrayAndPredicates/Utils.ts";

export interface OpenData {
    currentFilter           : Undefinable<UnitBuffFilter>;
    callback                : ((unitBuffFilter: UnitBuffFilter | null) => void) | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnClear!                                 : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _scrDesc!                                  : IUiScroller<IUiLayout>;
    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _btnConBuffTypeIdArray!                    : IUiButton;
    private readonly _labelConBuffTypeIdArray!                  : IUiLabel;
    private readonly _btnConBuffTypeIdArrayPredicate!           : IUiButton;
    private readonly _labelConBuffTypeIdArrayPredicate!         : IUiLabel;

    private readonly _btnConIsEverlasting!                      : IUiButton;
    private readonly _labelConIsEverlasting!                    : IUiLabel;

    private readonly _btnConEndTurnIndex!                       : IUiButton;
    private readonly _labelConEndTurnIndex!                     : IUiLabel;
    private readonly _btnConIsRelativeEndTurnIndex!             : IUiButton;
    private readonly _labelConIsRelativeEndTurnIndex!           : IUiLabel;

    private readonly _btnConEndPlayerIndex!                     : IUiButton;
    private readonly _labelConEndPlayerIndex!                   : IUiLabel;
    private readonly _btnConIsRelativeEndPlayerIndex!           : IUiButton;
    private readonly _labelConIsRelativeEndPlayerIndex!         : IUiLabel;

    private _unitBuffFilter = new UnitBuffFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this._onTouchedBtnClose },
            { ui: this._btnClear,                               callback: this._onTouchedBtnClear },

            { ui: this._btnConBuffTypeIdArray,                  callback: this._onTouchedBtnConBuffTypeIdArray },
            { ui: this._btnConBuffTypeIdArrayPredicate,         callback: this._onTouchedBtnConBuffTypeIdArrayPredicate },

            { ui: this._btnConIsEverlasting,                    callback: this._onTouchedBtnConIsEverlasting },

            { ui: this._btnConEndTurnIndex,                     callback: this._onTouchedBtnConEndTurnIndex },
            { ui: this._btnConIsRelativeEndTurnIndex,           callback: this._onTouchedBtnConIsRelativeEndTurnIndex },

            { ui: this._btnConEndPlayerIndex,                   callback: this._onTouchedBtnConEndPlayerIndex },
            { ui: this._btnConIsRelativeEndPlayerIndex,         callback: this._onTouchedBtnConIsRelativeEndPlayerIndex },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._unitBuffFilter = this.getOpenData()?.currentFilter?.clone() ?? new UnitBuffFilter();

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnClose(): void {
        const callback = this.getOpenData()?.callback;
        if (callback == null) {
            this.closePanel();
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent             : () => getText(TextType.A0418),
                getTextForConfirm      : () => getText(TextType.Yes),
                getTextForCancel       : () => getText(TextType.No),
                callback            : () => {
                    const unitBuffFilter = this._getUnitBuffFilter();
                    callback(checkIsEmpty(unitBuffFilter) ? null : unitBuffFilter);
                    this.closePanel();
                },
                callbackOnCancel    : () => this.closePanel(),
                showButtonClose     : true,
            });
        }
    }
    private _onTouchedBtnClear(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                this._unitBuffFilter = new UnitBuffFilter();
                this._updateView();
            }
        });
    }

    private _onTouchedBtnConBuffTypeIdArray(): void {
        const filter = this._getUnitBuffFilter();
        const oldCon = filter.getConBuffTypeId();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => getText(TextType.AbnormalStateTypeId),
            availableNumberArray    : AllBuffTypeIdArray,
            getNumberMainText       : typeId => getUnitBuffName(typeId) ?? UndefinedError,
            callbackOnHelp          : typeId => openPanel(getDict().CommonHelpPanel, {
                getTitle    : () => getUnitBuffName(typeId) ?? UndefinedError,
                getContent  : () => getUnitBuffDesc(typeId) ?? UndefinedError,
            }),
            currentNumberArray      : oldCon == null ? null : oldCon.getValueArray(),
            callbackOnConfirm       : arr => {
                if (!arr.length) {
                    filter.setConBuffTypeId(undefined);
                } else {
                    if (oldCon) {
                        oldCon.setValueArray(arr);
                    } else {
                        filter.setConBuffTypeId(ValueArrayAndPredicate.fromJson({
                            valueArray  : arr,
                            isOneOf     : true,
                        }));
                    }
                }

                this._updateView();
            },
        });
    }
    private _onTouchedBtnConBuffTypeIdArrayPredicate(): void {
        const filter = this._getUnitBuffFilter();
        const oldCon = filter.getConBuffTypeId();
        if (oldCon != null) {
            tickIsOneOf(oldCon);
        } else {
            filter.setConBuffTypeId(ValueArrayAndPredicate.fromJson({
                valueArray  : [AllBuffTypeIdArray[0]],
                isOneOf     : true,
            }));
        }

        this._updateView();
    }

    private _onTouchedBtnConIsEverlasting(): void {
        const filter        = this._getUnitBuffFilter();
        const isEverlasting = tickConIsEverlasting(filter);
        if (isEverlasting) {
            filter.setConEndTurnIndex(null);
            filter.setConEndPlayerIndex(null);
            filter.setConIsRelativeEndTurnIndex(false);
            filter.setConIsRelativeEndPlayerIndex(false);
        }

        this._updateView();
    }

    private _onTouchedBtnConEndTurnIndex(): void {
        const filter = this._getUnitBuffFilter();
        const oldCon = filter.getConEndTurnIndex();
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.EndTurnIndex),
            availableNumberArray    : AllComparatorIdArray,
            getNumberMainText       : comparator => getComparatorName(comparator) ?? UndefinedError,
            currentNumber           : oldCon ? oldCon.getComparator() : null,
            callbackOnConfirm       : comparator => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.EndTurnIndex),
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                maxValue        : EndTimeModification.MaxEndTurnIndex,
                minValue        : EndTimeModification.MinEndTurnIndex,
                callback        : value => {
                    if (value == null) {
                        filter.setConEndTurnIndex(null);
                    } else {
                        if (oldCon) {
                            oldCon.setValue(value);
                            oldCon.setComparator(comparator);
                        } else {
                            filter.setConEndTurnIndex(ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : comparator,
                            }));
                        }
                        filter.setConIsEverlasting(false);
                    }

                    this._updateView();
                },
            }),
        });
    }
    private _onTouchedBtnConIsRelativeEndTurnIndex(): void {
        const filter = this._getUnitBuffFilter();
        filter.setConIsRelativeEndTurnIndex(!filter.getConIsRelativeEndTurnIndex());
        filter.setConIsEverlasting(false);

        if (filter.getConEndTurnIndex() == null) {
            filter.setConEndTurnIndex(ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }

    private _onTouchedBtnConEndPlayerIndex(): void {
        const filter = this._getUnitBuffFilter();
        const oldCon = filter.getConEndPlayerIndex();
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.EndPlayerIndex),
            availableNumberArray    : AllComparatorIdArray,
            getNumberMainText       : comparator => getComparatorName(comparator) ?? UndefinedError,
            currentNumber           : oldCon ? oldCon.getComparator() : null,
            callbackOnConfirm       : comparator => openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.EndPlayerIndex),
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                maxValue        : EndTimeModification.MaxEndPlayerIndex,
                minValue        : EndTimeModification.MinEndPlayerIndex,
                callback        : value => {
                    if (value == null) {
                        filter.setConEndPlayerIndex(null);
                    } else {
                        if (oldCon) {
                            oldCon.setValue(value);
                            oldCon.setComparator(comparator);
                        } else {
                            filter.setConEndPlayerIndex(ValueAndComparator.fromJson({
                                value       : value,
                                comparator  : comparator,
                            }));
                        }
                        filter.setConIsEverlasting(false);
                    }

                    this._updateView();
                },
            }),
        });
    }
    private _onTouchedBtnConIsRelativeEndPlayerIndex(): void {
        const filter = this._getUnitBuffFilter();
        filter.setConIsRelativeEndPlayerIndex(!filter.getConIsRelativeEndPlayerIndex());
        filter.setConIsEverlasting(false);

        if (filter.getConEndPlayerIndex() == null) {
            filter.setConEndPlayerIndex(ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // view functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1235);
        this._btnClear.setLangText(TextType.B0391);

        this._btnConBuffTypeIdArray.setLangText(TextType.AbnormalStateTypeId);
        this._btnConBuffTypeIdArrayPredicate.setLangText(TextType.B1403);

        this._btnConIsEverlasting.setLangText(TextType.B1455);

        this._btnConEndTurnIndex.setLangText(TextType.EndTurnIndex);
        this._btnConIsRelativeEndTurnIndex.setLangText(TextType.B1017);

        this._btnConEndPlayerIndex.setLangText(TextType.EndPlayerIndex);
        this._btnConIsRelativeEndPlayerIndex.setLangText(TextType.B1017);

        this._updateLabelDescAndLabelError();

        this._updateLabelsForConBuffTypeId();
        this._updateLabelsForConIsEverlasting();
        this._updateLabelsForConEndTurnIndex();
        this._updateLabelsForConEndPlayerIndex();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const filter        = this._getUnitBuffFilter();
        const errorTip      = getErrorTip(filter);
        const labelError    = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDesc(filter));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConBuffTypeId(): void {
        const filter = this._getUnitBuffFilter();
        if (filter == null) {
            return;
        }

        const con       = filter.getConBuffTypeId();
        const label1    = this._labelConBuffTypeIdArray;
        const label2    = this._labelConBuffTypeIdArrayPredicate;
        if (con == null) {
            label1.setText(``);
            label2.setText(``);
        } else {
            label1.setText(con.getValueArray()?.map(v => getUnitBuffName(v)).join(`, `) ?? ``);
            label2.setText(getTextForYesOrNo(con.getIsOneOf()));
        }
    }
    private _updateLabelsForConIsEverlasting(): void {
        const filter = this._getUnitBuffFilter();
        if (filter == null) {
            return;
        }

        const isEverlasting = filter.getConIsEverlasting();
        this._labelConIsEverlasting.setText(isEverlasting == null
            ? ``
            : getTextForYesOrNo(isEverlasting)
        );
    }
    private _updateLabelsForConEndTurnIndex() {
        const filter = this._getUnitBuffFilter();
        if (filter == null) {
            return;
        }

        const con       = filter.getConEndTurnIndex();
        const label1    = this._labelConEndTurnIndex;
        const label2    = this._labelConIsRelativeEndTurnIndex;
        if ((con == null) || (filter.getConIsEverlasting())) {
            label1.setText(``);
            label2.setText(``);
        } else {
            const isRelative        = filter.getConIsRelativeEndTurnIndex();
            const value             = con.getValue();
            const textForValue      = `${value}`;
            const textForComparator = getComparatorName(con.getComparator());
            label1.setText(`${textForComparator} ${textForValue}`);
            label2.setText(getTextForYesOrNo(isRelative));
        }
    }
    private _updateLabelsForConEndPlayerIndex() {
        const filter = this._getUnitBuffFilter();
        if (filter == null) {
            return;
        }

        const con       = filter.getConEndPlayerIndex();
        const label1    = this._labelConEndPlayerIndex;
        const label2    = this._labelConIsRelativeEndPlayerIndex;
        if ((con == null) || (filter.getConIsEverlasting())) {
            label1.setText(``);
            label2.setText(``);
        } else {
            const isRelative        = filter.getConIsRelativeEndPlayerIndex();
            const value             = con.getValue();
            const textForValue      = `${value}`;
            const textForComparator = getComparatorName(con.getComparator());
            label1.setText(`${textForComparator} ${textForValue}`);
            label2.setText(getTextForYesOrNo(isRelative));
        }
    }

    private _getUnitBuffFilter(): UnitBuffFilter {
        return this._unitBuffFilter;
    }
}
