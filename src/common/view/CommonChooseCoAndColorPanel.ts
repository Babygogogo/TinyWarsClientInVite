import { CoId } from "../../cos/Constants.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoEye, getSkinCircle } from "../../helpers/ImageSource.ts";
import { TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export interface OpenData {
    gcData                  : GameConfig;
    availableCoIdArray      : number[];
    availableSkinIdArray    : number[];
    currentCoId             : number;
    currentSkinId           : number;
    callback                : (coId: number, unitAndTileSkinId: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _layoutCo!         : IUiLayout;
    private readonly _btnCo!            : IUiButton;
    private readonly _imgCo!            : IUiImage;

    private readonly _layoutColor!      : IUiLayout;
    private readonly _btnColor!         : IUiButton;
    private readonly _imgColor!         : IUiImage;

    private readonly _btnConfirm!       : IUiButton;

    private _coId                       = CoId.Empty;
    private _skinId                     = SkinId.First;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                           callback: this.closePanel },

            { ui: this._btnCo,                              callback: this._onTouchedBtnCo },
            { ui: this._btnColor,                           callback: this._onTouchedBtnColor },
            { ui: this._btnConfirm,                         callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
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

        openPanel(getDict().CommonChooseSingleCoIdPanel, {
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

        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
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
        this._labelTitle.setLangText(TextType.B0560);
        this._btnCo.setText(`CO`);
        this._btnColor.setLangText(TextType.B0397);
        this._btnConfirm.setLangText(TextType.B0026);
    }

    private _updateLayoutCo(): void {
        const gcData = this.getOpenData()?.gcData;
        if (gcData == null) {
            return;
        }

        this._imgCo.loadSource(getCoEye(gcData, this._coId, true) ?? ``);
        this._layoutCo.arrangeItems();
    }

    private _updateLayoutColor(): void {
        this._imgColor.loadSource(getSkinCircle(this._skinId, true));
        this._layoutColor.arrangeItems();
    }
}
