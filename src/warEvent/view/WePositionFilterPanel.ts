import {
    Locations_Constants,
    DeprecatedPositionFilter_Utils,
    Graphics_Constants,
    Maps_Constants,
    ValueAndComparators_Constants,
    Lang_Utils,
    GamePanels_Dict,
    Helpers_Collection,
    AuxiliaryTypes_GridIndex,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    AuxiliaryTypes_PositionFilter,
    Sounds_Constants,
    Lang_Constants,
    ValueAndComparators_Utils,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";

export interface OpenData {
    mapSize         : AuxiliaryTypes_MapSize.MapSize;
    currentFilter   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_PositionFilter.PositionFilter>;
    callback        : ((unitFilter: AuxiliaryTypes_PositionFilter.PositionFilter | null) => void) | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClear!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnGridX!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelGridX!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnGridY!                                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelGridY!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnLocation!                              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelLocation!                            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnGridIndex!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelGridIndex!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConLocationMinDistance!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConLocationMinDistance!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConLocationMinDistanceComparator!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConLocationMinDistanceComparator!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConGridIndexMinDistance!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConGridIndexMinDistance!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnConGridIndexMinDistanceComparator!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelConGridIndexMinDistanceComparator!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _imgInnerTouchMask!                        : Ui_Interfaces_IUiImage.IUiImage;

    private _positionFilter = new AuxiliaryTypes_PositionFilter.PositionFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                               callback : this._onTouchedBtnClose },
            { ui : this._btnClear,                               callback : this._onTouchedBtnClear },
            { ui : this._imgInnerTouchMask,                      callback : this._onTouchedImgInnerTouchMask },

            { ui : this._btnGridIndex,                           callback : this._onTouchedBtnGridIndex },
            { ui : this._btnLocation,                            callback : this._onTouchedBtnLocation },
            { ui : this._btnGridX,                               callback : this._onTouchedBtnGridX },
            { ui : this._btnGridY,                               callback : this._onTouchedBtnGridY },

            { ui : this._btnConLocationMinDistanceComparator,    callback : this._onTouchedBtnConLocationMinDistanceComparator },
            { ui : this._btnConLocationMinDistance,              callback : this._onTouchedBtnConLocationMinDistance },

            { ui : this._btnConGridIndexMinDistanceComparator,   callback : this._onTouchedBtnConGridIndexMinDistanceComparator },
            { ui : this._btnConGridIndexMinDistance,             callback : this._onTouchedBtnConGridIndexMinDistance },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._imgInnerTouchMask.setIsTouchEnabled(true);
        this._setInnerTouchMaskEnabled(false);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._positionFilter = this.getOpenData()?.currentFilter?.clone() ?? new AuxiliaryTypes_PositionFilter.PositionFilter();

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
                    const filter = this._getPositionFilter();
                    callback(DeprecatedPositionFilter_Utils.checkIsEmpty(filter) ? null : filter);
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
                this._positionFilter = new AuxiliaryTypes_PositionFilter.PositionFilter();
                this._updateView();
            },
        });
    }

    private _onTouchedImgInnerTouchMask(): void {
        this._setInnerTouchMaskEnabled(false);
    }
    private _onTouchedBtnGridIndex(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        const condition = this._getPositionFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray : Helpers_Collection.getNonNullElements(condition.getConGridIndexArray().map(v => AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))),
            mapSize               : mapSize,
            callbackOnConfirm     : gridIndexArray => {
                condition.setConGridIndexArray(gridIndexArray.map(v => v.toProto()));
                this._updateView();
            },
        });
    }

    private _onTouchedBtnLocation(): void {
        const filter = this._getPositionFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            availableIntegerArray : Locations_Constants.AllLocationIdArray,
            currentIntegerArray   : filter.getConLocationIdArray(),
            getTitleText          : () => Lang_Utils.getText(Lang_Constants.TextType.Location),
            callbackOnConfirm     : locationIdArray => {
                filter.setConLocationIdArray(locationIdArray);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnGridX(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        const filter = this._getPositionFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray   : filter.getConGridXArray(),
            availableIntegerArray : mapSize.getValidGridXArray(),
            getTitleText          : () => Lang_Utils.getText(Lang_Constants.TextType.B1071),
            callbackOnConfirm     : gridXArray => {
                filter.setConGridXArray(gridXArray);
                this._updateView();
            },
        });
    }
    private _onTouchedBtnGridY(): void {
        const mapSize = this.getOpenData()?.mapSize;
        if (mapSize == null) {
            return;
        }

        const filter = this._getPositionFilter();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray   : filter.getConGridYArray(),
            availableIntegerArray : mapSize.getValidGridYArray(),
            getTitleText          : () => Lang_Utils.getText(Lang_Constants.TextType.B1072),
            callbackOnConfirm     : gridYArray => {
                filter.setConGridYArray(gridYArray);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConLocationMinDistanceComparator(): void {
        const filter = this._getPositionFilter();
        const con    = filter.getConLocationMinDistance();
        if (con != null) {
            ValueAndComparators_Utils.tickComparator(con);
        } else {
            filter.setConLocationMinDistance(ValueAndComparator.fromJson({
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }
    private _onTouchedBtnConLocationMinDistance(): void {
        const filter = this._getPositionFilter();
        const oldCon = filter.getConLocationMinDistance();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1062),
            minValue     : 0,
            maxValue     : Maps_Constants.Common.MaxGridsCount,
            currentValue : oldCon == null ? null : oldCon.getValue(),
            callback     : value => {
                if (value == null) {
                    filter.setConLocationMinDistance(null);
                } else {
                    if (oldCon != null) {
                        oldCon.setValue(value);
                    } else {
                        filter.setConLocationMinDistance(ValueAndComparator.fromJson({
                            value      : value,
                            comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
                        }));
                    }
                }
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConGridIndexMinDistanceComparator(): void {
        const filter = this._getPositionFilter();
        const con    = filter.getConGridIndexMinDistance();
        if (con != null) {
            ValueAndComparators_Utils.tickComparator(con);
        } else {
            filter.setConGridIndexMinDistance(ValueAndComparator.fromJson({
                value      : 0,
                comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }
    private _onTouchedBtnConGridIndexMinDistance(): void {
        const filter = this._getPositionFilter();
        const oldCon = filter.getConGridIndexMinDistance();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1063),
            minValue     : 0,
            maxValue     : Maps_Constants.Common.MaxGridsCount,
            currentValue : oldCon?.getValue(),
            callback     : value => {
                if (value == null) {
                    filter.setConGridIndexMinDistance(null);
                } else {
                    if (oldCon != null) {
                        oldCon.setValue(value);
                    } else {
                        filter.setConGridIndexMinDistance(ValueAndComparator.fromJson({
                            value      : value,
                            comparator : ValueAndComparators_Constants.ComparatorId.EqualTo,
                        }));
                    }
                }
                this._updateView();
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelGridIndex();
        this._updateLabelLocation();
        this._updateLabelGridY();
        this._updateLabelGridX();
        this._updateLabelConLocationMinDistanceComparator();
        this._updateInputConLocationMinDistance();
        this._updateLabelConGridIndexMinDistanceComparator();
        this._updateInputConGridIndexMinDistance();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1073);
        this._btnClose.setLangText(Lang_Constants.TextType.B0204);
        this._btnClear.setLangText(Lang_Constants.TextType.B0391);
        this._btnGridIndex.setLangText(Lang_Constants.TextType.B0531);
        this._btnLocation.setLangText(Lang_Constants.TextType.Location);
        this._btnConLocationMinDistanceComparator.setLangText(Lang_Constants.TextType.Comparator);
        this._btnConLocationMinDistance.setLangText(Lang_Constants.TextType.B1062);
        this._btnConGridIndexMinDistanceComparator.setLangText(Lang_Constants.TextType.Comparator);
        this._btnConGridIndexMinDistance.setLangText(Lang_Constants.TextType.B1063);
        this._btnGridX.setLangText(Lang_Constants.TextType.B1071);
        this._btnGridY.setLangText(Lang_Constants.TextType.B1072);
        // this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const positionFilter    = this._getPositionFilter();
        const errorTip          = DeprecatedPositionFilter_Utils.getErrorTip(positionFilter, openData.mapSize);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(DeprecatedPositionFilter_Utils.getDesc(positionFilter));
        this._groupDesc.arrangeItems();
    }
    private _updateLabelGridIndex(): void {
        const gridIndexArray        = this._getPositionFilter().getConGridIndexArray();
        this._labelGridIndex.setText(gridIndexArray?.length ? gridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }
    private _updateLabelLocation(): void {
        const locationIdArray       = this._getPositionFilter().getConLocationIdArray();
        this._labelLocation.setText(locationIdArray?.length ? locationIdArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }

    private _updateLabelGridX(): void {
        const gridXArray        = this._getPositionFilter().getConGridXArray();
        this._labelGridX.setText(gridXArray?.length ? gridXArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }
    private _updateLabelGridY(): void {
        const gridYArray        = this._getPositionFilter().getConGridYArray();
        this._labelGridY.setText(gridYArray?.length ? gridYArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }

    private _updateLabelConLocationMinDistanceComparator(): void {
        const con           = this._getPositionFilter().getConLocationMinDistance();
        const comparator    = con?.getComparator();
        this._labelConLocationMinDistanceComparator.setText(comparator == null ? `` : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError));
    }
    private _updateInputConLocationMinDistance(): void {
        const con = this._getPositionFilter().getConLocationMinDistance();
        this._labelConLocationMinDistance.setText(`${con == null ? `` : (con.getValue())}`);
    }

    private _updateLabelConGridIndexMinDistanceComparator(): void {
        const con           = this._getPositionFilter().getConGridIndexMinDistance();
        const comparator    = con?.getComparator();
        this._labelConGridIndexMinDistanceComparator.setText(comparator == null ? `` : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError));
    }
    private _updateInputConGridIndexMinDistance(): void {
        const con = this._getPositionFilter().getConGridIndexMinDistance();
        this._labelConGridIndexMinDistance.setText(`${con == null ? `` : (con.getValue())}`);
    }

    private _getPositionFilter(): AuxiliaryTypes_PositionFilter.PositionFilter {
        return this._positionFilter;
    }
    private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
        this._imgInnerTouchMask.setIsVisible(isEnabled);
    }
}
