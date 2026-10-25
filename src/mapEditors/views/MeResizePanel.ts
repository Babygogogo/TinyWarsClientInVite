import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { show } from "../../FloatText.ts";
import { Constants } from "../../gameConfig/GcMap.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText, getText } from "../../lang/Utils.ts";
import { resizeMap, addOffset } from "../../mapEditor/model/MeHelpers.ts";
import { getWar } from "../../mapEditor/model/MeModel.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { GridIdAndMarkTypeId } from "../../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnHelp!              : IUiButton;

    private readonly _labelCurrSizeTitle!   : IUiLabel;
    private readonly _labelCurrWidth!       : IUiLabel;
    private readonly _labelCurrHeight!      : IUiLabel;
    private readonly _labelCurrGrids!       : IUiLabel;
    private readonly _labelNewSizeTitle!    : IUiLabel;
    private readonly _labelNewWidth!        : IUiLabel;
    private readonly _labelNewHeight!       : IUiLabel;
    private readonly _labelNewGrids!        : IUiLabel;
    private readonly _btnCancel!            : IUiButton;
    private readonly _btnConfirm!           : IUiButton;

    private readonly _btnDeltaTop!          : IUiButton;
    private readonly _btnDeltaBottom!       : IUiButton;
    private readonly _btnDeltaLeft!         : IUiButton;
    private readonly _btnDeltaRight!        : IUiButton;

    private _deltaLeft      = 0;
    private _deltaRight     = 0;
    private _deltaTop       = 0;
    private _deltaBottom    = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getFormattedText(TextType.F0023, Constants.MaxGridsCount),
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

        const war               = getExisted(getWar());
        const { width, height } = war.getTileMap().getMapSize().getWH();
        const newWidth          = width + deltaLeft + deltaRight;
        const newHeight         = height + deltaTop + deltaBottom;
        if ((newWidth <= 0) || (newHeight <= 0) || (newWidth * newHeight > Constants.MaxGridsCount)) {
            show(getText(TextType.A0265));
            return;
        }

        const gameConfig    = war.getGcData();
        const tempData      = resizeMap({
            mapRawData  : await war.serializeForMap(),
            newWidth    : width + Math.max(0, deltaLeft) + Math.max(0, deltaRight),
            newHeight   : height + Math.max(0, deltaTop) + Math.max(0, deltaBottom),
            gameConfig,
        });
        war.stopRunning();
        await war.initWithMapRawData({
            mapRawData: resizeMap({
                mapRawData: addOffset({
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
        dispatch(TypeId.MeMapSizeChanged);
    }

    private _onTouchedBtnDeltaTop(): void {
        const minValue      = -Constants.MaxGridsCount;
        const maxValue      = Constants.MaxGridsCount;
        const currentValue  = this._deltaTop;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0857),
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
        const minValue      = -Constants.MaxGridsCount;
        const maxValue      = Constants.MaxGridsCount;
        const currentValue  = this._deltaBottom;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0858),
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
        const minValue      = -Constants.MaxGridsCount;
        const maxValue      = Constants.MaxGridsCount;
        const currentValue  = this._deltaLeft;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0859),
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
        const minValue      = -Constants.MaxGridsCount;
        const maxValue      = Constants.MaxGridsCount;
        const currentValue  = this._deltaRight;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0860),
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
        this._btnConfirm.setText(getText(TextType.B0026));
        this._btnCancel.setText(getText(TextType.B0154));
        this._labelTitle.setText(getText(TextType.B0290));
        this._labelCurrSizeTitle.setText(getText(TextType.B0855));
        this._labelNewSizeTitle.setText(getText(TextType.B0856));

        this._updateBtnDeltaTop();
        this._updateBtnDeltaBottom();
        this._updateBtnDeltaLeft();
        this._updateBtnDeltaRight();
    }

    private _updateComponentsForData(): void {
        const war                   = getExisted(getWar());
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
        labelNewGrids.setTextColor(((newGrids > 0) && (newGrids <= Constants.MaxGridsCount)) ? 0xffffff : 0xff0000);
        this._updateBtnDeltaTop();
        this._updateBtnDeltaBottom();
        this._updateBtnDeltaLeft();
        this._updateBtnDeltaRight();
    }

    private _updateBtnDeltaTop(): void {
        const btn   = this._btnDeltaTop;
        const value = this._deltaTop;
        if (value === 0) {
            btn.setText(getText(TextType.B0857));
        } else {
            btn.setText(value > 0
                ? getFormattedText(TextType.F0086, value)
                : getFormattedText(TextType.F0087, -value)
            );
        }
    }
    private _updateBtnDeltaBottom(): void {
        const btn   = this._btnDeltaBottom;
        const value = this._deltaBottom;
        if (value === 0) {
            btn.setText(getText(TextType.B0858));
        } else {
            btn.setText(value > 0
                ? getFormattedText(TextType.F0086, value)
                : getFormattedText(TextType.F0087, -value)
            );
        }
    }
    private _updateBtnDeltaLeft(): void {
        const btn   = this._btnDeltaLeft;
        const value = this._deltaLeft;
        if (value === 0) {
            btn.setText(getText(TextType.B0859));
        } else {
            btn.setText(value > 0
                ? getFormattedText(TextType.F0089, value)
                : getFormattedText(TextType.F0116, -value)
            );
        }

    }
    private _updateBtnDeltaRight(): void {
        const btn   = this._btnDeltaRight;
        const value = this._deltaRight;
        if (value === 0) {
            btn.setText(getText(TextType.B0860));
        } else {
            btn.setText(value > 0
                ? getFormattedText(TextType.F0089, value)
                : getFormattedText(TextType.F0116, -value)
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
    const oldMapSize    = new MapSize(oldWidth, oldHeight);
    const newMapSize    = new MapSize(oldWidth + deltaLeft + deltaRight, oldHeight + deltaTop + deltaBottom);
    const newList       : GridIdAndMarkTypeId[] = [];
    for (const item of oldData.getGridIdAndMarkTypeIdList()) {
        const gridIndex = GridIndex.getGridIndexByGridId(item.getGridId(), oldMapSize);
        gridIndex.setX(gridIndex.getX() + deltaLeft);
        gridIndex.setY(gridIndex.getY() + deltaTop);

        if (gridIndex.checkIsInsideMap(newMapSize)) {
            newList.push(GridIdAndMarkTypeId.fromJson({
                gridId      : gridIndex.getGridId(newMapSize),
                markTypeId  : item.getMarkTypeId(),
            }));
        }
    }

    return GridMarkData.fromJson({
        gridIdAndMarkTypeIdList : newList.map(v => v.toJson()),
        hiddenMarkTypeIdList    : oldData.getHiddenMarkTypeIdList(),
    });
}
