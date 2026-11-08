import {
    TileBuffs_Constants,
    ValueAndComparators_Constants,
    TileBuffs_Utils_Filter,
    Graphics_Constants,
    Lang_Utils,
    GamePanels_Dict,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    ValueArrayAndPredicates_Utils,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { TileBuffFilter } from "../../proto/schema/CommonProto/Structure/TileBuffFilter.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import { ValueArrayAndPredicate } from "../../proto/schema/CommonProto/Structure/ValueArrayAndPredicate.ts";

export interface OpenData {
    currentFilter           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileBuffFilter>;
    callback                : ((tileBuffFilter: TileBuffFilter | null) => void) | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClear!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _scrDesc!                                  : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConBuffTypeIdArray!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConBuffTypeIdArray!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConBuffTypeIdArrayPredicate!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConBuffTypeIdArrayPredicate!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConIsEverlasting!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsEverlasting!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConEndTurnIndex!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConEndTurnIndex!                     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConIsRelativeEndTurnIndex!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsRelativeEndTurnIndex!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConEndPlayerIndex!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConEndPlayerIndex!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConIsRelativeEndPlayerIndex!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConIsRelativeEndPlayerIndex!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _tileBuffFilter = new TileBuffFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",         callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                               callback : this._onTouchedBtnClose },
            { ui : this._btnClear,                               callback : this._onTouchedBtnClear },

            { ui : this._btnConBuffTypeIdArray,                  callback : this._onTouchedBtnConBuffTypeIdArray },
            { ui : this._btnConBuffTypeIdArrayPredicate,         callback : this._onTouchedBtnConBuffTypeIdArrayPredicate },

            { ui : this._btnConIsEverlasting,                    callback : this._onTouchedBtnConIsEverlasting },

            { ui : this._btnConEndTurnIndex,                     callback : this._onTouchedBtnConEndTurnIndex },
            { ui : this._btnConIsRelativeEndTurnIndex,           callback : this._onTouchedBtnConIsRelativeEndTurnIndex },

            { ui : this._btnConEndPlayerIndex,                   callback : this._onTouchedBtnConEndPlayerIndex },
            { ui : this._btnConIsRelativeEndPlayerIndex,         callback : this._onTouchedBtnConIsRelativeEndPlayerIndex },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._tileBuffFilter = this.getOpenData()?.currentFilter?.clone() ?? new TileBuffFilter();

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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0418),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.No),
                callback          : () => {
                    const tileBuffFilter = this._getTileBuffFilter();
                    callback(TileBuffs_Utils_Filter.checkIsEmpty(tileBuffFilter) ? null : tileBuffFilter);
                    this.closePanel();
                },
                callbackOnCancel : () => this.closePanel(),
                showButtonClose  : true,
            });
        }
    }
    private _onTouchedBtnClear(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                this._tileBuffFilter = new TileBuffFilter();
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConBuffTypeIdArray(): void {
        const filter = this._getTileBuffFilter();
        const oldCon = filter.getConBuffTypeId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
            availableNumberArray : TileBuffs_Constants.AllBuffTypeIdArray,
            getNumberMainText    : typeId => Lang_Utils.getTileBuffName(typeId) ?? Lang_Constants.UndefinedError,
            callbackOnHelp       : typeId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getTitle   : () => Lang_Utils.getTileBuffName(typeId) ?? Lang_Constants.UndefinedError,
                getContent : () => Lang_Utils.getTileBuffDesc(typeId) ?? Lang_Constants.UndefinedError,
            }),
            currentNumberArray : oldCon == null ? null : oldCon.getValueArray(),
            callbackOnConfirm  : arr => {
                if (!arr.length) {
                    filter.setConBuffTypeId(undefined);
                } else {
                    if (oldCon) {
                        oldCon.setValueArray(arr);
                    } else {
                        filter.setConBuffTypeId(ValueArrayAndPredicate.fromJson({
                            valueArray : arr,
                            isOneOf    : true,
                        }));
                    }
                }

                this._updateView();
            },
        });
    }
    private _onTouchedBtnConBuffTypeIdArrayPredicate(): void {
        const filter = this._getTileBuffFilter();
        const oldCon = filter.getConBuffTypeId();
        if (oldCon != null) {
            ValueArrayAndPredicates_Utils.tickIsOneOf(oldCon);
        } else {
            filter.setConBuffTypeId(ValueArrayAndPredicate.fromJson({
                valueArray : [TileBuffs_Constants.AllBuffTypeIdArray[0]],
                isOneOf    : true,
            }));
        }

        this._updateView();
    }

    private _onTouchedBtnConIsEverlasting(): void {
        const filter        = this._getTileBuffFilter();
        const isEverlasting = TileBuffs_Utils_Filter.tickConIsEverlasting(filter);
        if (isEverlasting) {
            filter.setConEndTurnIndex(null);
            filter.setConEndPlayerIndex(null);
            filter.setConIsRelativeEndTurnIndex(false);
            filter.setConIsRelativeEndPlayerIndex(false);
        }

        this._updateView();
    }

    private _onTouchedBtnConEndTurnIndex(): void {
        const filter = this._getTileBuffFilter();
        const oldCon = filter.getConEndTurnIndex();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            getNumberMainText    : comparator => Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError,
            currentNumber        : oldCon ? oldCon.getComparator() : null,
            callbackOnConfirm    : comparator => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex),
                currentValue : oldCon == null ? null : oldCon.getValue(),
                maxValue     : TileBuffs_Constants.EndTimeModification.MaxEndTurnIndex,
                minValue     : TileBuffs_Constants.EndTimeModification.MinEndTurnIndex,
                callback     : value => {
                    if (value == null) {
                        filter.setConEndTurnIndex(null);
                    } else {
                        if (oldCon) {
                            oldCon.setValue(value);
                            oldCon.setComparator(comparator);
                        } else {
                            filter.setConEndTurnIndex(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : comparator,
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
        const filter = this._getTileBuffFilter();
        filter.setConIsRelativeEndTurnIndex(!filter.getConIsRelativeEndTurnIndex());
        filter.setConIsEverlasting(false);

        if (filter.getConEndTurnIndex() == null) {
            filter.setConEndTurnIndex(ValueAndComparator.fromJson({
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }

    private _onTouchedBtnConEndPlayerIndex(): void {
        const filter = this._getTileBuffFilter();
        const oldCon = filter.getConEndPlayerIndex();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex),
            availableNumberArray : ValueAndComparators_Constants.AllComparatorIdArray,
            getNumberMainText    : comparator => Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError,
            currentNumber        : oldCon ? oldCon.getComparator() : null,
            callbackOnConfirm    : comparator => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex),
                currentValue : oldCon == null ? null : oldCon.getValue(),
                maxValue     : TileBuffs_Constants.EndTimeModification.MaxEndPlayerIndex,
                minValue     : TileBuffs_Constants.EndTimeModification.MinEndPlayerIndex,
                callback     : value => {
                    if (value == null) {
                        filter.setConEndPlayerIndex(null);
                    } else {
                        if (oldCon) {
                            oldCon.setValue(value);
                            oldCon.setComparator(comparator);
                        } else {
                            filter.setConEndPlayerIndex(ValueAndComparator.fromJson({
                                value      : value,
                                comparator : comparator,
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
        const filter = this._getTileBuffFilter();
        filter.setConIsRelativeEndPlayerIndex(!filter.getConIsRelativeEndPlayerIndex());
        filter.setConIsEverlasting(false);

        if (filter.getConEndPlayerIndex() == null) {
            filter.setConEndPlayerIndex(ValueAndComparator.fromJson({
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1235);
        this._btnClear.setLangText(Lang_Constants.TextType.B0391);

        this._btnConBuffTypeIdArray.setLangText(Lang_Constants.TextType.AbnormalStateTypeId);
        this._btnConBuffTypeIdArrayPredicate.setLangText(Lang_Constants.TextType.B1403);

        this._btnConIsEverlasting.setLangText(Lang_Constants.TextType.B1455);

        this._btnConEndTurnIndex.setLangText(Lang_Constants.TextType.EndTurnIndex);
        this._btnConIsRelativeEndTurnIndex.setLangText(Lang_Constants.TextType.B1017);

        this._btnConEndPlayerIndex.setLangText(Lang_Constants.TextType.EndPlayerIndex);
        this._btnConIsRelativeEndPlayerIndex.setLangText(Lang_Constants.TextType.B1017);

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

        const filter        = this._getTileBuffFilter();
        const errorTip      = TileBuffs_Utils_Filter.getErrorTip(filter);
        const labelError    = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(TileBuffs_Utils_Filter.getDesc(filter));
        this._groupDesc.arrangeItems();
        this._scrDesc.updateOnItemsChanged();
    }
    private _updateLabelsForConBuffTypeId(): void {
        const filter = this._getTileBuffFilter();
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
            label1.setText(con.getValueArray().map(v => Lang_Utils.getTileBuffName(v)).join(`, `));
            label2.setLangText(con.getIsOneOf() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateLabelsForConIsEverlasting(): void {
        const filter = this._getTileBuffFilter();
        if (filter == null) {
            return;
        }

        const isEverlasting = filter.getConIsEverlasting();
        this._labelConIsEverlasting.setText(isEverlasting == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(isEverlasting),
        );
    }
    private _updateLabelsForConEndTurnIndex() {
        const filter = this._getTileBuffFilter();
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
            const textForComparator = Lang_Utils.getComparatorName(con.getComparator());
            label1.setText(`${textForComparator} ${textForValue}`);
            label2.setLangText(isRelative ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }
    private _updateLabelsForConEndPlayerIndex() {
        const filter = this._getTileBuffFilter();
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
            const textForComparator = Lang_Utils.getComparatorName(con.getComparator());
            label1.setText(`${textForComparator} ${textForValue}`);
            label2.setLangText(isRelative ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        }
    }

    private _getTileBuffFilter(): TileBuffFilter {
        return this._tileBuffFilter;
    }
}
