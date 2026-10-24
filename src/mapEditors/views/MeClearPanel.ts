import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    war     : MapEditorInterfaceIMeWar.IMeWar;
};
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
    private readonly _btnWidth!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHeight!            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelNewGrids!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnCancel!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!           : UiInterfacesIUiButton.IUiButton;

    private _newWidth   = 0;
    private _newHeight  = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => `${LangUtils.getText(LangConstants.TextType.A0117)}\n\n${LangUtils.getFormattedText(LangConstants.TextType.F0023, GameConfigGcMap.Constants.MaxGridsCount)}`,
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const width         = HelpersMisc.getExisted(this._newWidth);
        const height        = HelpersMisc.getExisted(this._newHeight);
        const gridsCount    = width * height;
        if ((!gridsCount) || (gridsCount <= 0) || (width <= 0) || (height <= 0) || (gridsCount > GameConfigGcMap.Constants.MaxGridsCount)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0087));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        war.stopRunning();
        await war.initWithMapRawData({
            mapRawData: MapEditorModelMeHelpers.clearMap({
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapCleared);
    }

    private _onTouchedBtnWidth(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0034),
            minValue        : 1,
            maxValue        : Math.floor(GameConfigGcMap.Constants.MaxGridsCount / (this._newHeight || 1)),
            currentValue    : this._newWidth,
            callback        : newWidth => {
                this._newWidth = newWidth;
                this._updateBtnWidth();
                this._updateLabelNewGrids();
            }
        });
    }

    private _onTouchedBtnHeight(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0035),
            minValue        : 1,
            maxValue        : Math.floor(GameConfigGcMap.Constants.MaxGridsCount / (this._newWidth || 1)),
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
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0391));
        this._labelCurrSizeTitle.setText(LangUtils.getText(LangConstants.TextType.B0855));
        this._labelNewSizeTitle.setText(LangUtils.getText(LangConstants.TextType.B0856));
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
        label.setTextColor((grids > 0) && (grids <= GameConfigGcMap.Constants.MaxGridsCount) ? 0xFFFFFF : 0xFFFF00);
    }
}
