import { show } from "../../FloatText.ts";
import { Common } from "../../maps/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { clearMap } from "../../mapEditor/model/MeHelpers.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    war     : IMeWar;
};
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
    private readonly _btnWidth!             : IUiButton;
    private readonly _btnHeight!            : IUiButton;
    private readonly _labelNewGrids!        : IUiLabel;

    private readonly _btnCancel!            : IUiButton;
    private readonly _btnConfirm!           : IUiButton;

    private _newWidth   = 0;
    private _newHeight  = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnCancel,          callback: this.closePanel, },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
            { ui: this._btnWidth,           callback: this._onTouchedBtnWidth },
            { ui: this._btnHeight,          callback: this._onTouchedBtnHeight },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { width, height } = openData.war.getTileMap().getMapSize().getWH();
        this._labelCurrHeight.setText(`${height}`);
        this._labelCurrWidth.setText(`${width}`);
        this._labelCurrGrids.setText(`${width * height}`);
        this._newWidth              = width;
        this._newHeight             = height;
        this._updateBtnWidth();
        this._updateBtnHeight();
        this._updateLabelNewGrids();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => `${getText(TextType.A0117)}\n\n${getFormattedText(TextType.F0023, Common.MaxGridsCount)}`,
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const width         = this._newWidth;
        const height        = this._newHeight;
        const gridsCount    = width * height;
        if ((!gridsCount) || (gridsCount <= 0) || (width <= 0) || (height <= 0) || (gridsCount > Common.MaxGridsCount)) {
            show(getText(TextType.A0087));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        war.stopRunning();
        await war.initWithMapRawData({
            mapRawData: clearMap({
                mapRawData  : await war.serializeForMap(),
                newWidth    : width,
                newHeight   : height,
                gameConfig  : gameConfig,
            }),
            slotIndex                   : war.getMapSlotIndex(),
            gameConfig                  : gameConfig,
            srcNormalMapIdForAddEvent   : war.getSrcNormalMapIdForAddEvent(),
            gridMarkData                : null,
        });
        war.setIsMapModified(true);
        war.startRunning()
            .startRunningView();

        this.closePanel();
        dispatch(TypeId.MeMapCleared);
    }

    private _onTouchedBtnWidth(): void {
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0034),
            minValue        : 1,
            maxValue        : Math.floor(Common.MaxGridsCount / (this._newHeight || 1)),
            currentValue    : this._newWidth,
            callback        : newWidth => {
                this._newWidth = newWidth;
                this._updateBtnWidth();
                this._updateLabelNewGrids();
            }
        });
    }

    private _onTouchedBtnHeight(): void {
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0035),
            minValue        : 1,
            maxValue        : Math.floor(Common.MaxGridsCount / (this._newWidth || 1)),
            currentValue    : this._newHeight,
            callback        : newHeight => {
                this._newHeight = newHeight;
                this._updateBtnHeight();
                this._updateLabelNewGrids();
            }
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
        this._labelTitle.setLangText(TextType.B0391);
        this._labelCurrSizeTitle.setLangText(TextType.B0855);
        this._labelNewSizeTitle.setLangText(TextType.B0856);
    }

    private _updateBtnWidth(): void {
        this._btnWidth.setText(`${this._newWidth}`);
    }
    private _updateBtnHeight(): void {
        this._btnHeight.setText(`${this._newHeight}`);
    }
    private _updateLabelNewGrids(): void {
        const grids     = this._newWidth * this._newHeight;
        const label     = this._labelNewGrids;
        label.setText(`${grids}`);
        label.setTextColor((grids > 0) && (grids <= Common.MaxGridsCount) ? 0xFFFFFF : 0xFFFF00);
    }
}
