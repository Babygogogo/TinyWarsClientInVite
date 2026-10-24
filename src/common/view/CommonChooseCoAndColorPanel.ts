import * as CosConstants from "../../cos/Constants.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";

export interface OpenData {
    gcData                  : GameConfigGcData.GcData;
    availableCoIdArray      : number[];
    availableSkinIdArray    : number[];
    currentCoId             : number;
    currentSkinId           : number;
    callback                : (coId: number, unitAndTileSkinId: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutCo!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnCo!            : UiInterfacesIUiButton.IUiButton;
    private readonly _imgCo!            : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutColor!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnColor!         : UiInterfacesIUiButton.IUiButton;
    private readonly _imgColor!         : UiInterfacesIUiImage.IUiImage;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private _coId                       = CosConstants.CoId.Empty;
    private _skinId                     = ForceSkinsConstants.SkinId.First;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                           callback: this.closePanel },

            { ui: this._btnCo,                              callback: this._onTouchedBtnCo },
            { ui: this._btnColor,                           callback: this._onTouchedBtnColor },
            { ui: this._btnConfirm,                         callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._coId      = openData.currentCoId;
        this._skinId    = openData.currentSkinId;
        this._updateLayoutCo();
        this._updateLayoutColor();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : openData.gcData,
            availableCoIdArray  : openData.availableCoIdArray,
            currentCoId         : this._coId,
            isBan               : false,
            callbackOnConfirm   : coId => {
                this._coId = coId;
                this._updateLayoutCo();
            },
        });
    }
    private _onTouchedBtnColor(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray    : openData.availableSkinIdArray,
            currentSkinId           : this._skinId,
            callback                : skinId => {
                this._skinId = skinId;
                this._updateLayoutColor();
            }
        });
    }
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.callback(this._coId, this._skinId);
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0560);
        this._btnCo.setText(`CO`);
        this._btnColor.setLangText(LangConstants.TextType.B0397);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
    }

    private _updateLayoutCo(): void {
        const gcData = this.getOpenData()?.gcData;
        if (gcData == null) {
            return;
        }

        this._imgCo.loadSource(HelpersImageSource.getCoEye(gcData, this._coId, true) ?? ``);
        this._layoutCo.arrangeItems();
    }

    private _updateLayoutColor(): void {
        this._imgColor.loadSource(HelpersImageSource.getSkinCircle(this._skinId, true));
        this._layoutColor.arrangeItems();
    }
}
