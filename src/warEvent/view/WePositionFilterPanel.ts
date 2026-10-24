import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as AuxiliaryTypesPositionFilter from "../../auxiliaryTypes/PositionFilter.ts";
import * as DeprecatedPositionFilterUtils from "../../deprecatedPositionFilter/Utils.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as ValueAndComparatorsConstants from "../../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";

export interface OpenData {
    mapSize         : AuxiliaryTypesMapSize.MapSize;
    currentFilter   : AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesPositionFilter.PositionFilter>;
    callback        : ((unitFilter: AuxiliaryTypesPositionFilter.PositionFilter | null) => void) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClear!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnGridX!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelGridX!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnGridY!                                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelGridY!                               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnLocation!                              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelLocation!                            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnGridIndex!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelGridIndex!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConLocationMinDistance!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConLocationMinDistance!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConLocationMinDistanceComparator!      : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConLocationMinDistanceComparator!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConGridIndexMinDistance!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConGridIndexMinDistance!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnConGridIndexMinDistanceComparator!     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelConGridIndexMinDistanceComparator!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _imgInnerTouchMask!                        : UiInterfacesIUiImage.IUiImage;

    private _positionFilter = new AuxiliaryTypesPositionFilter.PositionFilter();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._imgInnerTouchMask.setIsTouchEnabled(true);
        this._setInnerTouchMaskEnabled(false);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._positionFilter = this.getOpenData()?.currentFilter?.clone() ?? new AuxiliaryTypesPositionFilter.PositionFilter();

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
                    const filter = this._getPositionFilter();
                    callback(DeprecatedPositionFilterUtils.checkIsEmpty(filter) ? null : filter);
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
                this._positionFilter = new AuxiliaryTypesPositionFilter.PositionFilter();
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseGridIndexPanel, {
            currentGridIndexArray   : HelpersCollection.getNonNullElements(condition.getConGridIndexArray().map(v => AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v)) ?? []),
            mapSize                 : mapSize,
            callbackOnConfirm       : gridIndexArray => {
                condition.setConGridIndexArray(gridIndexArray.map(v => v.toProto()));
                this._updateView();
            },
        });
    }

    private _onTouchedBtnLocation(): void {
        const filter = this._getPositionFilter();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            availableIntegerArray   : LocationsConstants.AllLocationIdArray,
            currentIntegerArray     : filter.getConLocationIdArray(),
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.Location),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConGridXArray(),
            availableIntegerArray   : mapSize.getValidGridXArray(),
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1071),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiIntegerPanel, {
            currentIntegerArray     : filter.getConGridYArray(),
            availableIntegerArray   : mapSize.getValidGridYArray(),
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1072),
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
            ValueAndComparatorsUtils.tickComparator(con);
        } else {
            filter.setConLocationMinDistance(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }
    private _onTouchedBtnConLocationMinDistance(): void {
        const filter = this._getPositionFilter();
        const oldCon = filter.getConLocationMinDistance();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B1062),
            minValue        : 0,
            maxValue        : GameConfigGcMap.Constants.MaxGridsCount,
            currentValue    : oldCon == null ? null : oldCon.getValue(),
            callback        : value => {
                if (value == null) {
                    filter.setConLocationMinDistance(null);
                } else {
                    if (oldCon != null) {
                        oldCon.setValue(value);
                    } else {
                        filter.setConLocationMinDistance(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                            value       : value,
                            comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
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
            ValueAndComparatorsUtils.tickComparator(con);
        } else {
            filter.setConGridIndexMinDistance(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                value       : 0,
                comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
            }));
        }

        this._updateView();
    }
    private _onTouchedBtnConGridIndexMinDistance(): void {
        const filter = this._getPositionFilter();
        const oldCon = filter.getConGridIndexMinDistance();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B1063),
            minValue        : 0,
            maxValue        : GameConfigGcMap.Constants.MaxGridsCount,
            currentValue    : oldCon?.getValue(),
            callback        : value => {
                if (value == null) {
                    filter.setConGridIndexMinDistance(null);
                } else {
                    if (oldCon != null) {
                        oldCon.setValue(value);
                    } else {
                        filter.setConGridIndexMinDistance(ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator.fromJson({
                            value       : value,
                            comparator  : ValueAndComparatorsConstants.ComparatorId.EqualTo,
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
        this._labelTitle.setLangText(LangConstants.TextType.B1073);
        this._btnClose.setLangText(LangConstants.TextType.B0204);
        this._btnClear.setLangText(LangConstants.TextType.B0391);
        this._btnGridIndex.setLangText(LangConstants.TextType.B0531);
        this._btnLocation.setLangText(LangConstants.TextType.Location);
        this._btnConLocationMinDistanceComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnConLocationMinDistance.setLangText(LangConstants.TextType.B1062);
        this._btnConGridIndexMinDistanceComparator.setLangText(LangConstants.TextType.Comparator);
        this._btnConGridIndexMinDistance.setLangText(LangConstants.TextType.B1063);
        this._btnGridX.setLangText(LangConstants.TextType.B1071);
        this._btnGridY.setLangText(LangConstants.TextType.B1072);
        // this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const positionFilter    = this._getPositionFilter();
        const errorTip          = DeprecatedPositionFilterUtils.getErrorTip(positionFilter, openData.mapSize);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(DeprecatedPositionFilterUtils.getDesc(positionFilter));
        this._groupDesc.arrangeItems();
    }
    private _updateLabelGridIndex(): void {
        const gridIndexArray        = this._getPositionFilter().getConGridIndexArray();
        this._labelGridIndex.setText(gridIndexArray?.length ? gridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }
    private _updateLabelLocation(): void {
        const locationIdArray       = this._getPositionFilter().getConLocationIdArray();
        this._labelLocation.setText(locationIdArray?.length ? locationIdArray.join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }

    private _updateLabelGridX(): void {
        const gridXArray        = this._getPositionFilter().getConGridXArray();
        this._labelGridX.setText(gridXArray?.length ? gridXArray.join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }
    private _updateLabelGridY(): void {
        const gridYArray        = this._getPositionFilter().getConGridYArray();
        this._labelGridY.setText(gridYArray?.length ? gridYArray.join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }

    private _updateLabelConLocationMinDistanceComparator(): void {
        const con           = this._getPositionFilter().getConLocationMinDistance();
        const comparator    = con?.getComparator();
        this._labelConLocationMinDistanceComparator.setText(comparator == null ? `` : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError));
    }
    private _updateInputConLocationMinDistance(): void {
        const con = this._getPositionFilter().getConLocationMinDistance();
        this._labelConLocationMinDistance.setText(`${con == null ? `` : (con.getValue() ?? ``)}`);
    }

    private _updateLabelConGridIndexMinDistanceComparator(): void {
        const con           = this._getPositionFilter().getConGridIndexMinDistance();
        const comparator    = con?.getComparator();
        this._labelConGridIndexMinDistanceComparator.setText(comparator == null ? `` : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError));
    }
    private _updateInputConGridIndexMinDistance(): void {
        const con = this._getPositionFilter().getConGridIndexMinDistance();
        this._labelConGridIndexMinDistance.setText(`${con == null ? `` : (con.getValue() ?? ``)}`);
    }

    private _getPositionFilter(): AuxiliaryTypesPositionFilter.PositionFilter {
        return this._positionFilter;
    }
    private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
        this._imgInnerTouchMask.setIsVisible(isEnabled);
    }
}
