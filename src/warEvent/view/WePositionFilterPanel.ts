import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { PositionFilter } from "../../auxiliaryTypes/PositionFilter.ts";
import {
    checkIsEmpty,
    getErrorTip,
    getDesc,
} from "../../deprecatedPositionFilter/Utils.ts";
import { Common } from "../../maps/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getComparatorName,
} from "../../lang/Utils.ts";
import { AllLocationIdArray } from "../../locations/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ValueAndComparator } from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ComparatorId } from "../../valueAndComparators/Constants.ts";
import { tickComparator } from "../../valueAndComparators/Utils.ts";

export interface OpenData {
    mapSize         : MapSize;
    currentFilter   : Undefinable<PositionFilter>;
    callback        : ((unitFilter: PositionFilter | null) => void) | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnClear!                                 : IUiButton;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _groupDesc!                                : IUiLayout;
    private readonly _labelDesc!                                : IUiLabel;
    private readonly _labelError!                               : IUiLabel;

    private readonly _btnGridX!                                 : IUiButton;
    private readonly _labelGridX!                               : IUiLabel;

    private readonly _btnGridY!                                 : IUiButton;
    private readonly _labelGridY!                               : IUiLabel;

    private readonly _btnLocation!                              : IUiButton;
    private readonly _labelLocation!                            : IUiLabel;

    private readonly _btnGridIndex!                             : IUiButton;
    private readonly _labelGridIndex!                           : IUiLabel;

    private readonly _btnConLocationMinDistance!                : IUiButton;
    private readonly _labelConLocationMinDistance!              : IUiLabel;
    private readonly _btnConLocationMinDistanceComparator!      : IUiButton;
    private readonly _labelConLocationMinDistanceComparator!    : IUiLabel;

    private readonly _btnConGridIndexMinDistance!               : IUiButton;
    private readonly _labelConGridIndexMinDistance!             : IUiLabel;
    private readonly _btnConGridIndexMinDistanceComparator!     : IUiButton;
    private readonly _labelConGridIndexMinDistanceComparator!   : IUiLabel;

    private readonly _imgInnerTouchMask!                        : IUiImage;

    private _positionFilter = new PositionFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this._onTouchedBtnClose },
            { ui: this._btnClear,                               callback: this._onTouchedBtnClear },
            { ui: this._imgInnerTouchMask,                      callback: this._onTouchedImgInnerTouchMask },

            { ui: this._btnGridIndex,                           callback: this._onTouchedBtnGridIndex },
            { ui: this._btnLocation,                            callback: this._onTouchedBtnLocation },
            { ui: this._btnGridX,                               callback: this._onTouchedBtnGridX },
            { ui: this._btnGridY,                               callback: this._onTouchedBtnGridY },

            { ui: this._btnConLocationMinDistanceComparator,    callback: this._onTouchedBtnConLocationMinDistanceComparator },
            { ui: this._btnConLocationMinDistance,              callback: this._onTouchedBtnConLocationMinDistance },

            { ui: this._btnConGridIndexMinDistanceComparator,   callback: this._onTouchedBtnConGridIndexMinDistanceComparator },
            { ui: this._btnConGridIndexMinDistance,             callback: this._onTouchedBtnConGridIndexMinDistance },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._imgInnerTouchMask.setIsTouchEnabled(true);
        this._setInnerTouchMaskEnabled(false);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._positionFilter = this.getOpenData()?.currentFilter?.clone() ?? new PositionFilter();

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
                    const filter = this._getPositionFilter();
                    callback(checkIsEmpty(filter) ? null : filter);
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
                this._positionFilter = new PositionFilter();
                this._updateView();
            }
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
        openPanel(getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray   : getNonNullElements(condition.getConGridIndexArray().map(v => GridIndex.convertGridIndex(v))),
            mapSize                 : mapSize,
            callbackOnConfirm       : gridIndexArray => {
                condition.setConGridIndexArray(gridIndexArray.map(v => v.toProto()));
                this._updateView();
            },
        });
    }

    private _onTouchedBtnLocation(): void {
        const filter = this._getPositionFilter();
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            availableIntegerArray   : AllLocationIdArray,
            currentIntegerArray     : filter.getConLocationIdArray(),
            getTitleText            : () => getText(TextType.Location),
            callbackOnConfirm       : locationIdArray => {
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
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConGridXArray(),
            availableIntegerArray   : mapSize.getValidGridXArray(),
            getTitleText            : () => getText(TextType.B1071),
            callbackOnConfirm       : gridXArray => {
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
        openPanel(getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConGridYArray(),
            availableIntegerArray   : mapSize.getValidGridYArray(),
            getTitleText            : () => getText(TextType.B1072),
            callbackOnConfirm       : gridYArray => {
                filter.setConGridYArray(gridYArray);
                this._updateView();
            },
        });
    }

    private _onTouchedBtnConLocationMinDistanceComparator(): void {
        const filter = this._getPositionFilter();
        const con    = filter.getConLocationMinDistance();
        if (con != null) {
            tickComparator(con);
        } else {
            filter.setConLocationMinDistance(ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }
    private _onTouchedBtnConLocationMinDistance(): void {
        const filter = this._getPositionFilter();
        const oldCon = filter.getConLocationMinDistance();

        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.B1062),
            minValue        : 0,
            maxValue        : Common.MaxGridsCount,
            currentValue    : oldCon == null ? null : oldCon.getValue(),
            callback        : value => {
                if (value == null) {
                    filter.setConLocationMinDistance(null);
                } else {
                    if (oldCon != null) {
                        oldCon.setValue(value);
                    } else {
                        filter.setConLocationMinDistance(ValueAndComparator.fromJson({
                            value       : value,
                            comparator  : ComparatorId.EqualTo,
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
            tickComparator(con);
        } else {
            filter.setConGridIndexMinDistance(ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }
    private _onTouchedBtnConGridIndexMinDistance(): void {
        const filter = this._getPositionFilter();
        const oldCon = filter.getConGridIndexMinDistance();

        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => getText(TextType.B1063),
            minValue        : 0,
            maxValue        : Common.MaxGridsCount,
            currentValue    : oldCon?.getValue(),
            callback        : value => {
                if (value == null) {
                    filter.setConGridIndexMinDistance(null);
                } else {
                    if (oldCon != null) {
                        oldCon.setValue(value);
                    } else {
                        filter.setConGridIndexMinDistance(ValueAndComparator.fromJson({
                            value       : value,
                            comparator  : ComparatorId.EqualTo,
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
        this._labelTitle.setLangText(TextType.B1073);
        this._btnClose.setLangText(TextType.B0204);
        this._btnClear.setLangText(TextType.B0391);
        this._btnGridIndex.setLangText(TextType.B0531);
        this._btnLocation.setLangText(TextType.Location);
        this._btnConLocationMinDistanceComparator.setLangText(TextType.Comparator);
        this._btnConLocationMinDistance.setLangText(TextType.B1062);
        this._btnConGridIndexMinDistanceComparator.setLangText(TextType.Comparator);
        this._btnConGridIndexMinDistance.setLangText(TextType.B1063);
        this._btnGridX.setLangText(TextType.B1071);
        this._btnGridY.setLangText(TextType.B1072);
        // this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const positionFilter    = this._getPositionFilter();
        const errorTip          = getErrorTip(positionFilter, openData.mapSize);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDesc(positionFilter));
        this._groupDesc.arrangeItems();
    }
    private _updateLabelGridIndex(): void {
        const gridIndexArray        = this._getPositionFilter().getConGridIndexArray();
        this._labelGridIndex.setText(gridIndexArray?.length ? gridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`, `) : getText(TextType.B0776));
    }
    private _updateLabelLocation(): void {
        const locationIdArray       = this._getPositionFilter().getConLocationIdArray();
        this._labelLocation.setText(locationIdArray?.length ? locationIdArray.join(`, `) : getText(TextType.B0776));
    }

    private _updateLabelGridX(): void {
        const gridXArray        = this._getPositionFilter().getConGridXArray();
        this._labelGridX.setText(gridXArray?.length ? gridXArray.join(`, `) : getText(TextType.B0776));
    }
    private _updateLabelGridY(): void {
        const gridYArray        = this._getPositionFilter().getConGridYArray();
        this._labelGridY.setText(gridYArray?.length ? gridYArray.join(`, `) : getText(TextType.B0776));
    }

    private _updateLabelConLocationMinDistanceComparator(): void {
        const con           = this._getPositionFilter().getConLocationMinDistance();
        const comparator    = con?.getComparator();
        this._labelConLocationMinDistanceComparator.setText(comparator == null ? `` : (getComparatorName(comparator) ?? UndefinedError));
    }
    private _updateInputConLocationMinDistance(): void {
        const con = this._getPositionFilter().getConLocationMinDistance();
        this._labelConLocationMinDistance.setText(`${con == null ? `` : (con.getValue())}`);
    }

    private _updateLabelConGridIndexMinDistanceComparator(): void {
        const con           = this._getPositionFilter().getConGridIndexMinDistance();
        const comparator    = con?.getComparator();
        this._labelConGridIndexMinDistanceComparator.setText(comparator == null ? `` : (getComparatorName(comparator) ?? UndefinedError));
    }
    private _updateInputConGridIndexMinDistance(): void {
        const con = this._getPositionFilter().getConGridIndexMinDistance();
        this._labelConGridIndexMinDistance.setText(`${con == null ? `` : (con.getValue())}`);
    }

    private _getPositionFilter(): PositionFilter {
        return this._positionFilter;
    }
    private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
        this._imgInnerTouchMask.setIsVisible(isEnabled);
    }
}
