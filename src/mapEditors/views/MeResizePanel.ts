import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils2 from "../../lang/Utils.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId from "../../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import * as ProtoSchemaCommonProtoStructureGridMarkData from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;

    private readonly _labelCurrSizeTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCurrWidth!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCurrHeight!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCurrGrids!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNewSizeTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNewWidth!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNewHeight!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNewGrids!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCancel!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!           : UiInterfacesIUiButton.IUiButton;

    private readonly _btnDeltaTop!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeltaBottom!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeltaLeft!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeltaRight!        : UiInterfacesIUiButton.IUiButton;

    private _deltaLeft      = 0;
    private _deltaRight     = 0;
    private _deltaTop       = 0;
    private _deltaBottom    = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,          callback: this.closePanel, },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
            { ui: this._btnDeltaTop,        callback: this._onTouchedBtnDeltaTop },
            { ui: this._btnDeltaBottom,     callback: this._onTouchedBtnDeltaBottom },
            { ui: this._btnDeltaLeft,       callback: this._onTouchedBtnDeltaLeft },
            { ui: this._btnDeltaRight,      callback: this._onTouchedBtnDeltaRight },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._deltaLeft     = 0;
        this._deltaRight    = 0;
        this._deltaTop      = 0;
        this._deltaBottom   = 0;

        this._updateView();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils2.getFormattedText(LangConstants.TextType.F0023, GameConfigGcMap.Constants.MaxGridsCount),
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        // const width         = Helpers.getExisted(this._newWidth);
        // const height        = Helpers.getExisted(this._newHeight);
        // const gridsCount    = width * height;
        // if (gridsCount <= 0) {
        //     FloatText.show(Lang.getText(LangTextType.A0087));
        // } else if (gridsCount > GameConfig.MapMaxGridsCount) {
        //     FloatText.show(Lang.getFormattedText(LangTextType.F0023, GameConfig.MapMaxGridsCount));
        // } else {
        //     const war       = Helpers.getExisted(MeModel.getWar());
        //     const currSize  = war.getTileMap().getMapSize();
        //     if ((width !== currSize.width) || (height !== currSize.height)) {
        //         war.stopRunning();
        //         await war.initWithMapEditorData({
        //             mapRawData  : MeUtility.resizeMap(war.serializeForMap(), width, height),
        //             slotIndex   : war.getMapSlotIndex(),
        //         });
        //         war.setIsMapModified(true);
        //         war.startRunning()
        //             .startRunningView();
        //     }

        //     this.close();
        //     TwnsPanelManager.close(TwnsPanelConfig.Dict.MeWarMenuPanel);
        // }

        const deltaLeft     = this._deltaLeft;
        const deltaRight    = this._deltaRight;
        const deltaTop      = this._deltaTop;
        const deltaBottom   = this._deltaBottom;
        if ((deltaLeft === 0) && (deltaRight === 0) && (deltaTop === 0) && (deltaBottom === 0)) {
            this.closePanel();
            return;
        }

        const war               = HelpersMisc.getExisted(MapEditorModelMeModel.getWar());
        const { width, height } = war.getTileMap().getMapSize().getWH();
        const newWidth          = width + deltaLeft + deltaRight;
        const newHeight         = height + deltaTop + deltaBottom;
        if ((newWidth <= 0) || (newHeight <= 0) || (newWidth * newHeight > GameConfigGcMap.Constants.MaxGridsCount)) {
            FloatText2.show(LangUtils2.getText(LangConstants.TextType.A0265));
            return;
        }

        const gameConfig    = war.getGcData();
        const tempData      = MapEditorModelMeHelpers.resizeMap({
            mapRawData  : await war.serializeForMap(),
            newWidth    : width + Math.max(0, deltaLeft) + Math.max(0, deltaRight),
            newHeight   : height + Math.max(0, deltaTop) + Math.max(0, deltaBottom),
            gameConfig,
        });
        war.stopRunning();
        await war.initWithMapRawData({
            mapRawData: MapEditorModelMeHelpers.resizeMap({
                mapRawData: MapEditorModelMeHelpers.addOffset({
                    mapRawData  : tempData,
                    offsetX     : deltaLeft,
                    offsetY     : deltaTop,
                    gameConfig  : gameConfig,
                }),
                newWidth    : newWidth,
                newHeight   : newHeight,
                gameConfig  : gameConfig,
            }),
            slotIndex                   : war.getMapSlotIndex(),
            gameConfig                  : war.getGcData(),
            srcNormalMapIdForAddEvent   : war.getSrcNormalMapIdForAddEvent(),
            gridMarkData                : generateNewGridMarkData({
                oldData     : war.getGridMarkData(),
                deltaLeft   : deltaLeft,
                deltaRight  : deltaRight,
                deltaTop    : deltaTop,
                deltaBottom : deltaBottom,
                oldWidth    : width,
                oldHeight   : height,
            }),
        });
        war.setIsMapModified(true);
        war.startRunning()
            .startRunningView();

        this.closePanel();
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSizeChanged);
    }

    private _onTouchedBtnDeltaTop(): void {
        const minValue      = -GameConfigGcMap.Constants.MaxGridsCount;
        const maxValue      = GameConfigGcMap.Constants.MaxGridsCount;
        const currentValue  = this._deltaTop;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils2.getText(LangConstants.TextType.B0857),
            currentValue,
            minValue,
            maxValue,
            callback        : value => {
                if (value !== currentValue) {
                    this._deltaTop = value;
                    this._updateComponentsForData();
                }
            },
        });
    }
    private _onTouchedBtnDeltaBottom(): void {
        const minValue      = -GameConfigGcMap.Constants.MaxGridsCount;
        const maxValue      = GameConfigGcMap.Constants.MaxGridsCount;
        const currentValue  = this._deltaBottom;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils2.getText(LangConstants.TextType.B0858),
            currentValue,
            minValue,
            maxValue,
            callback        : value => {
                if (value !== currentValue) {
                    this._deltaBottom = value;
                    this._updateComponentsForData();
                }
            },
        });
    }
    private _onTouchedBtnDeltaLeft(): void {
        const minValue      = -GameConfigGcMap.Constants.MaxGridsCount;
        const maxValue      = GameConfigGcMap.Constants.MaxGridsCount;
        const currentValue  = this._deltaLeft;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils2.getText(LangConstants.TextType.B0859),
            currentValue,
            minValue,
            maxValue,
            callback        : value => {
                if (value !== currentValue) {
                    this._deltaLeft = value;
                    this._updateComponentsForData();
                }
            },
        });
    }
    private _onTouchedBtnDeltaRight(): void {
        const minValue      = -GameConfigGcMap.Constants.MaxGridsCount;
        const maxValue      = GameConfigGcMap.Constants.MaxGridsCount;
        const currentValue  = this._deltaRight;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils2.getText(LangConstants.TextType.B0860),
            currentValue,
            minValue,
            maxValue,
            callback        : value => {
                if (value !== currentValue) {
                    this._deltaRight = value;
                    this._updateComponentsForData();
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForData();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils2.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils2.getText(LangConstants.TextType.B0154));
        this._labelTitle.setText(LangUtils2.getText(LangConstants.TextType.B0290));
        this._labelCurrSizeTitle.setText(LangUtils2.getText(LangConstants.TextType.B0855));
        this._labelNewSizeTitle.setText(LangUtils2.getText(LangConstants.TextType.B0856));

        this._updateBtnDeltaTop();
        this._updateBtnDeltaBottom();
        this._updateBtnDeltaLeft();
        this._updateBtnDeltaRight();
    }

    private _updateComponentsForData(): void {
        const war                   = HelpersMisc.getExisted(MapEditorModelMeModel.getWar());
        const { width, height }     = war.getTileMap().getMapSize().getWH();
        this._labelCurrWidth.setText("" + width);
        this._labelCurrHeight.setText("" + height);
        this._labelCurrGrids.setText(`` + (width * height));

        const deltaLeft             = this._deltaLeft;
        const deltaRight            = this._deltaRight;
        const deltaTop              = this._deltaTop;
        const deltaBottom           = this._deltaBottom;
        const newWidth              = width + deltaLeft + deltaRight;
        const newHeight             = height + deltaTop + deltaBottom;
        const newGrids              = newWidth * newHeight;
        const labelNewWidth         = this._labelNewWidth;
        const labelNewHeight        = this._labelNewHeight;
        const labelNewGrids         = this._labelNewGrids;
        labelNewWidth.setText("" + newWidth);
        labelNewWidth.setTextColor(newWidth > 0 ? 0xffffff : 0xff0000);
        labelNewHeight.setText("" + newHeight);
        labelNewHeight.setTextColor(newHeight > 0 ? 0xffffff : 0xff0000);
        labelNewGrids.setText(`` + newGrids);
        labelNewGrids.setTextColor(((newGrids > 0) && (newGrids <= GameConfigGcMap.Constants.MaxGridsCount)) ? 0xffffff : 0xff0000);
        this._updateBtnDeltaTop();
        this._updateBtnDeltaBottom();
        this._updateBtnDeltaLeft();
        this._updateBtnDeltaRight();
    }

    private _updateBtnDeltaTop(): void {
        const btn   = this._btnDeltaTop;
        const value = this._deltaTop;
        if (value === 0) {
            btn.setText(LangUtils2.getText(LangConstants.TextType.B0857));
        } else {
            btn.setText(value > 0
                ? LangUtils2.getFormattedText(LangConstants.TextType.F0086, value)
                : LangUtils2.getFormattedText(LangConstants.TextType.F0087, -value)
            );
        }
    }
    private _updateBtnDeltaBottom(): void {
        const btn   = this._btnDeltaBottom;
        const value = this._deltaBottom;
        if (value === 0) {
            btn.setText(LangUtils2.getText(LangConstants.TextType.B0858));
        } else {
            btn.setText(value > 0
                ? LangUtils2.getFormattedText(LangConstants.TextType.F0086, value)
                : LangUtils2.getFormattedText(LangConstants.TextType.F0087, -value)
            );
        }
    }
    private _updateBtnDeltaLeft(): void {
        const btn   = this._btnDeltaLeft;
        const value = this._deltaLeft;
        if (value === 0) {
            btn.setText(LangUtils2.getText(LangConstants.TextType.B0859));
        } else {
            btn.setText(value > 0
                ? LangUtils2.getFormattedText(LangConstants.TextType.F0089, value)
                : LangUtils2.getFormattedText(LangConstants.TextType.F0116, -value)
            );
        }

    }
    private _updateBtnDeltaRight(): void {
        const btn   = this._btnDeltaRight;
        const value = this._deltaRight;
        if (value === 0) {
            btn.setText(LangUtils2.getText(LangConstants.TextType.B0860));
        } else {
            btn.setText(value > 0
                ? LangUtils2.getFormattedText(LangConstants.TextType.F0089, value)
                : LangUtils2.getFormattedText(LangConstants.TextType.F0116, -value)
            );
        }
    }
}

function generateNewGridMarkData({ oldData, deltaLeft, deltaRight, deltaTop, deltaBottom, oldWidth, oldHeight }: {
    oldData     : ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData;
    deltaLeft   : number;
    deltaRight  : number;
    deltaTop    : number;
    deltaBottom : number;
    oldWidth    : number;
    oldHeight   : number;
}): ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData {
    const oldMapSize    = new AuxiliaryTypesMapSize.MapSize(oldWidth, oldHeight);
    const newMapSize    = new AuxiliaryTypesMapSize.MapSize(oldWidth + deltaLeft + deltaRight, oldHeight + deltaTop + deltaBottom);
    const newList       : ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId[] = [];
    for (const item of oldData.getGridIdAndMarkTypeIdList()) {
        const gridIndex = AuxiliaryTypesGridIndex.GridIndex.getGridIndexByGridId(item.getGridId(), oldMapSize);
        gridIndex.setX(gridIndex.getX() + deltaLeft);
        gridIndex.setY(gridIndex.getY() + deltaTop);

        if (gridIndex.checkIsInsideMap(newMapSize)) {
            newList.push(ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId.fromJson({
                gridId      : gridIndex.getGridId(newMapSize),
                markTypeId  : item.getMarkTypeId(),
            }));
        }
    }

    return ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData.fromJson({
        gridIdAndMarkTypeIdList : newList.map(v => v.toJson()),
        hiddenMarkTypeIdList    : oldData.getHiddenMarkTypeIdList(),
    });
}
