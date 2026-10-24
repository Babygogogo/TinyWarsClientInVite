import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureTileBuffFilter from "../../proto/schema/CommonProto/Structure/TileBuffFilter.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import * as ProtoSchemaCommonProtoStructureValueArrayAndPredicate from "../../proto/schema/CommonProto/Structure/ValueArrayAndPredicate.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TileBuffsConstants from "../../tileBuffs/Constants.ts";
import * as TileBuffsUtilsFilter from "../../tileBuffs/utils/Filter.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueArrayAndPredicatesUtils from "../../valueArrayAndPredicates/Utils.ts";

export interface OpenData {
    currentFilter           : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureTileBuffFilter.TileBuffFilter>;
    callback                : ((tileBuffFilter: ProtoSchemaCommonProtoStructureTileBuffFilter.TileBuffFilter | null) => void) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClear!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _scrDesc!                                  : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConBuffTypeIdArray!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConBuffTypeIdArray!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConBuffTypeIdArrayPredicate!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConBuffTypeIdArrayPredicate!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConIsEverlasting!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsEverlasting!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConEndTurnIndex!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConEndTurnIndex!                     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConIsRelativeEndTurnIndex!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsRelativeEndTurnIndex!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConEndPlayerIndex!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConEndPlayerIndex!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConIsRelativeEndPlayerIndex!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConIsRelativeEndPlayerIndex!         : UiInterfacesIUiLabel.IUiLabel;

    private _tileBuffFilter = new ProtoSchemaCommonProtoStructureTileBuffFilter.TileBuffFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._tileBuffFilter = this.getOpenData()?.currentFilter?.clone() ?? new ProtoSchemaCommonProtoStructureTileBuffFilter.TileBuffFilter();

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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent             : () => LangUtils.getText(LangConstants.TextType.A0418),
                getTextForConfirm      : () => LangUtils.getText(LangConstants.TextType.Yes),
                getTextForCancel       : () => LangUtils.getText(LangConstants.TextType.No),
                callback            : () => {
                    const tileBuffFilter = this._getTileBuffFilter();
                    callback(TileBuffsUtilsFilter.checkIsEmpty(tileBuffFilter) ? null : tileBuffFilter);
                    this.closePanel();
                },
                callbackOnCancel    : () => this.closePanel(),
                showButtonClose     : true,
            });
        }
    }
    private _onTouchedBtnClear(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                this._tileBuffFilter = new ProtoSchemaCommonProtoStructureTileBuffFilter.TileBuffFilter();
                this._updateView();
            }
        });
    }

    private _onTouchedBtnConBuffTypeIdArray(): void {
        const filter = this._getTileBuffFilter();
        const oldCon = filter.getConBuffTypeId();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
            availableNumberArray    : TileBuffsConstants.AllBuffTypeIdArray,
            getNumberMainText       : typeId => LangUtils.getTileBuffName(typeId) ?? LangConstants.UndefinedError,
            callbackOnHelp          : typeId => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getTitle    : () => LangUtils.getTileBuffName(typeId) ?? LangConstants.UndefinedError,
                getContent  : () => LangUtils.getTileBuffDesc(typeId) ?? LangConstants.UndefinedError,
            }),
            currentNumberArray      : oldCon == null ? null : oldCon.getValueArray(),
            callbackOnConfirm       : arr => {
                if (!arr.length) {
                    filter.setConBuffTypeId(undefined);
                } else {
                    if (oldCon) {
                        oldCon.setValueArray(arr);
                    } else {
                        filter.setConBuffTypeId(ProtoSchemaCommonProtoStructureValueArrayAndPredicate.ValueArrayAndPredicate.fromJson({
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
        const filter = this._getTileBuffFilter();
        const oldCon = filter.getConBuffTypeId();
        if (oldCon != null) {
            ValueArrayAndPredicatesUtils.tickIsOneOf(oldCon);
        } else {
            filter.setConBuffTypeId(ProtoSchemaCommonProtoStructureValueArrayAndPredicate.ValueArrayAndPredicate.fromJson({
                valueArray  : [TileBuffsConstants.AllBuffTypeIdArray[0]],
                isOneOf     : true,
            }));
        }

        this._updateView();
    }

    private _onTouchedBtnConIsEverlasting(): void {
        const filter        = this._getTileBuffFilter();
        const isEverlasting = TileBuffsUtilsFilter.tickConIsEverlasting(filter);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.EndTurnIndex),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            getNumberMainText       : comparator => LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError,
            currentNumber           : oldCon ? oldCon.getComparator() : null,
            callbackOnConfirm       : comparator => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.EndTurnIndex),
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                maxValue        : TileBuffsConstants.EndTimeModification.MaxEndTurnIndex,
                minValue        : TileBuffsConstants.EndTimeModification.MinEndTurnIndex,
                callback        : value => {
                    if (value == null) {
                        filter.setConEndTurnIndex(null);
                    } else {
                        if (oldCon) {
                            oldCon.setValue(value);
                            oldCon.setComparator(comparator);
                        } else {
                            filter.setConEndTurnIndex(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
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
        const filter = this._getTileBuffFilter();
        filter.setConIsRelativeEndTurnIndex(!filter.getConIsRelativeEndTurnIndex());
        filter.setConIsEverlasting(false);

        if (filter.getConEndTurnIndex() == null) {
            filter.setConEndTurnIndex(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }

    private _onTouchedBtnConEndPlayerIndex(): void {
        const filter = this._getTileBuffFilter();
        const oldCon = filter.getConEndPlayerIndex();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.EndPlayerIndex),
            availableNumberArray    : ValueAndComparatorsConstants.AllComparatorIdArray,
            getNumberMainText       : comparator => LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError,
            currentNumber           : oldCon ? oldCon.getComparator() : null,
            callbackOnConfirm       : comparator => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.EndPlayerIndex),
                currentValue    : oldCon == null ? null : oldCon.getValue(),
                maxValue        : TileBuffsConstants.EndTimeModification.MaxEndPlayerIndex,
                minValue        : TileBuffsConstants.EndTimeModification.MinEndPlayerIndex,
                callback        : value => {
                    if (value == null) {
                        filter.setConEndPlayerIndex(null);
                    } else {
                        if (oldCon) {
                            oldCon.setValue(value);
                            oldCon.setComparator(comparator);
                        } else {
                            filter.setConEndPlayerIndex(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
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
        const filter = this._getTileBuffFilter();
        filter.setConIsRelativeEndPlayerIndex(!filter.getConIsRelativeEndPlayerIndex());
        filter.setConIsEverlasting(false);

        if (filter.getConEndPlayerIndex() == null) {
            filter.setConEndPlayerIndex(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
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
        this._labelTitle.setLangText(LangConstants.TextType.B1235);
        this._btnClear.setLangText(LangConstants.TextType.B0391);

        this._btnConBuffTypeIdArray.setLangText(LangConstants.TextType.AbnormalStateTypeId);
        this._btnConBuffTypeIdArrayPredicate.setLangText(LangConstants.TextType.B1403);

        this._btnConIsEverlasting.setLangText(LangConstants.TextType.B1455);

        this._btnConEndTurnIndex.setLangText(LangConstants.TextType.EndTurnIndex);
        this._btnConIsRelativeEndTurnIndex.setLangText(LangConstants.TextType.B1017);

        this._btnConEndPlayerIndex.setLangText(LangConstants.TextType.EndPlayerIndex);
        this._btnConIsRelativeEndPlayerIndex.setLangText(LangConstants.TextType.B1017);

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
        const errorTip      = TileBuffsUtilsFilter.getErrorTip(filter);
        const labelError    = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(TileBuffsUtilsFilter.getDesc(filter));
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
            label1.setText(con.getValueArray().map(v => LangUtils.getTileBuffName(v)).join(`, `) ?? ``);
            label2.setText(LangUtils.getTextForYesOrNo(con.getIsOneOf()));
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
            : LangUtils.getTextForYesOrNo(isEverlasting)
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
            const textForComparator = LangUtils.getComparatorName(con.getComparator());
            label1.setText(`${textForComparator} ${textForValue}`);
            label2.setText(LangUtils.getTextForYesOrNo(isRelative));
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
            const textForComparator = LangUtils.getComparatorName(con.getComparator());
            label1.setText(`${textForComparator} ${textForValue}`);
            label2.setText(LangUtils.getTextForYesOrNo(isRelative));
        }
    }

    private _getTileBuffFilter(): ProtoSchemaCommonProtoStructureTileBuffFilter.TileBuffFilter {
        return this._tileBuffFilter;
    }
}
