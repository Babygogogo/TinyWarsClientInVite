import {
    MapEditor_Model_MeHelpers,
    Maps_Constants,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    MapEditor_Model_MeModel,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MapSize,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import { GridIdAndMarkTypeId } from "../../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelCurrSizeTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCurrWidth!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCurrHeight!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCurrGrids!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNewSizeTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNewWidth!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNewHeight!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNewGrids!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCancel!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnDeltaTop!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeltaBottom!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeltaLeft!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeltaRight!        : Ui_Interfaces_IUiButton.IUiButton;

    private _deltaLeft      = 0;
    private _deltaRight     = 0;
    private _deltaTop       = 0;
    private _deltaBottom    = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnCancel,          callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
            { ui : this._btnDeltaTop,        callback : this._onTouchedBtnDeltaTop },
            { ui : this._btnDeltaBottom,     callback : this._onTouchedBtnDeltaBottom },
            { ui : this._btnDeltaLeft,       callback : this._onTouchedBtnDeltaLeft },
            { ui : this._btnDeltaRight,      callback : this._onTouchedBtnDeltaRight },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0023, Maps_Constants.Common.MaxGridsCount),
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

        const war               = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar());
        const { width, height } = war.getTileMap().getMapSize().getWH();
        const newWidth          = width + deltaLeft + deltaRight;
        const newHeight         = height + deltaTop + deltaBottom;
        if ((newWidth <= 0) || (newHeight <= 0) || (newWidth * newHeight > Maps_Constants.Common.MaxGridsCount)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0265));
            return;
        }

        const gameConfig    = war.getGcData();
        const tempData      = MapEditor_Model_MeHelpers.resizeMap({
            mapRawData : await war.serializeForMap(),
            newWidth   : width + Math.max(0, deltaLeft) + Math.max(0, deltaRight),
            newHeight  : height + Math.max(0, deltaTop) + Math.max(0, deltaBottom),
            gameConfig,
        });
        war.stopRunning();
        await war.initWithMapRawData({
            mapRawData : MapEditor_Model_MeHelpers.resizeMap({
                mapRawData : MapEditor_Model_MeHelpers.addOffset({
                    mapRawData : tempData,
                    offsetX    : deltaLeft,
                    offsetY    : deltaTop,
                    gameConfig : gameConfig,
                }),
                newWidth   : newWidth,
                newHeight  : newHeight,
                gameConfig : gameConfig,
            }),
            slotIndex                 : war.getMapSlotIndex(),
            gameConfig                : war.getGcData(),
            srcNormalMapIdForAddEvent : war.getSrcNormalMapIdForAddEvent(),
            gridMarkData              : generateNewGridMarkData({
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
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSizeChanged);
    }

    private _onTouchedBtnDeltaTop(): void {
        const minValue      = -Maps_Constants.Common.MaxGridsCount;
        const maxValue      = Maps_Constants.Common.MaxGridsCount;
        const currentValue  = this._deltaTop;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle : () => Lang_Utils.getText(Lang_Constants.TextType.B0857),
            currentValue,
            minValue,
            maxValue,
            callback : value => {
                if (value !== currentValue) {
                    this._deltaTop = value;
                    this._updateComponentsForData();
                }
            },
        });
    }
    private _onTouchedBtnDeltaBottom(): void {
        const minValue      = -Maps_Constants.Common.MaxGridsCount;
        const maxValue      = Maps_Constants.Common.MaxGridsCount;
        const currentValue  = this._deltaBottom;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle : () => Lang_Utils.getText(Lang_Constants.TextType.B0858),
            currentValue,
            minValue,
            maxValue,
            callback : value => {
                if (value !== currentValue) {
                    this._deltaBottom = value;
                    this._updateComponentsForData();
                }
            },
        });
    }
    private _onTouchedBtnDeltaLeft(): void {
        const minValue      = -Maps_Constants.Common.MaxGridsCount;
        const maxValue      = Maps_Constants.Common.MaxGridsCount;
        const currentValue  = this._deltaLeft;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle : () => Lang_Utils.getText(Lang_Constants.TextType.B0859),
            currentValue,
            minValue,
            maxValue,
            callback : value => {
                if (value !== currentValue) {
                    this._deltaLeft = value;
                    this._updateComponentsForData();
                }
            },
        });
    }
    private _onTouchedBtnDeltaRight(): void {
        const minValue      = -Maps_Constants.Common.MaxGridsCount;
        const maxValue      = Maps_Constants.Common.MaxGridsCount;
        const currentValue  = this._deltaRight;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle : () => Lang_Utils.getText(Lang_Constants.TextType.B0860),
            currentValue,
            minValue,
            maxValue,
            callback : value => {
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
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0290);
        this._labelCurrSizeTitle.setLangText(Lang_Constants.TextType.B0855);
        this._labelNewSizeTitle.setLangText(Lang_Constants.TextType.B0856);

        this._updateBtnDeltaTop();
        this._updateBtnDeltaBottom();
        this._updateBtnDeltaLeft();
        this._updateBtnDeltaRight();
    }

    private _updateComponentsForData(): void {
        const war                   = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar());
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
        labelNewGrids.setTextColor(((newGrids > 0) && (newGrids <= Maps_Constants.Common.MaxGridsCount)) ? 0xffffff : 0xff0000);
        this._updateBtnDeltaTop();
        this._updateBtnDeltaBottom();
        this._updateBtnDeltaLeft();
        this._updateBtnDeltaRight();
    }

    private _updateBtnDeltaTop(): void {
        const btn   = this._btnDeltaTop;
        const value = this._deltaTop;
        if (value === 0) {
            btn.setLangText(Lang_Constants.TextType.B0857);
        } else {
            btn.setText(value > 0
                ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0086, value)
                : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0087, -value),
            );
        }
    }
    private _updateBtnDeltaBottom(): void {
        const btn   = this._btnDeltaBottom;
        const value = this._deltaBottom;
        if (value === 0) {
            btn.setLangText(Lang_Constants.TextType.B0858);
        } else {
            btn.setText(value > 0
                ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0086, value)
                : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0087, -value),
            );
        }
    }
    private _updateBtnDeltaLeft(): void {
        const btn   = this._btnDeltaLeft;
        const value = this._deltaLeft;
        if (value === 0) {
            btn.setLangText(Lang_Constants.TextType.B0859);
        } else {
            btn.setText(value > 0
                ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0089, value)
                : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0116, -value),
            );
        }

    }
    private _updateBtnDeltaRight(): void {
        const btn   = this._btnDeltaRight;
        const value = this._deltaRight;
        if (value === 0) {
            btn.setLangText(Lang_Constants.TextType.B0860);
        } else {
            btn.setText(value > 0
                ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0089, value)
                : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0116, -value),
            );
        }
    }
}

function generateNewGridMarkData({ oldData, deltaLeft, deltaRight, deltaTop, deltaBottom, oldWidth, oldHeight }: {
    oldData     : GridMarkData;
    deltaLeft   : number;
    deltaRight  : number;
    deltaTop    : number;
    deltaBottom : number;
    oldWidth    : number;
    oldHeight   : number;
}): GridMarkData {
    const oldMapSize    = new AuxiliaryTypes_MapSize.MapSize(oldWidth, oldHeight);
    const newMapSize    = new AuxiliaryTypes_MapSize.MapSize(oldWidth + deltaLeft + deltaRight, oldHeight + deltaTop + deltaBottom);
    const newList       : GridIdAndMarkTypeId[] = [];
    for (const item of oldData.getGridIdAndMarkTypeIdList()) {
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.getGridIndexByGridId(item.getGridId(), oldMapSize);
        gridIndex.setX(gridIndex.getX() + deltaLeft);
        gridIndex.setY(gridIndex.getY() + deltaTop);

        if (gridIndex.checkIsInsideMap(newMapSize)) {
            newList.push(GridIdAndMarkTypeId.fromJson({
                gridId     : gridIndex.getGridId(newMapSize),
                markTypeId : item.getMarkTypeId(),
            }));
        }
    }

    return GridMarkData.fromJson({
        gridIdAndMarkTypeIdList : newList.map(v => v.toJson()),
        hiddenMarkTypeIdList    : oldData.getHiddenMarkTypeIdList(),
    });
}
