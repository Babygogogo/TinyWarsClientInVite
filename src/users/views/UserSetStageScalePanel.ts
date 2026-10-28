import { PointerEventType, type PointerUnifiedEventData } from "../../helpers/PointerInput.ts";
import { format } from "../../helpers/Text.ts";
import { TextType } from "../../lang/Constants.ts";
import { setStageScale } from "../../localData/Storage.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Scale } from "../../stages/Constants.ts";
import { getStageScale, setStageScale as StagesStageManagerSetStageScale } from "../../stages/StageManager.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _layoutContent!    : IUiLayout;

    private readonly _labelScaleTitle!  : IUiLabel;
    private readonly _groupScale!       : IUiContainer;
    private readonly _imgScaleBar!      : IUiImage;
    private readonly _imgScalePoint!    : IUiImage;
    private readonly _labelScale!       : IUiLabel;

    private readonly _btnDefault!       : IUiButton;
    private readonly _btnConfirm!       : IUiButton;

    private _prevScale                  : number | null = null;
    private _selectedScale              : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupScale,     callback: this._onTouchedGroupScale,    eventType: PointerEventType.Press },

            { ui: this._btnClose,       callback: this._onTouchedBtnClose },
            { ui: this._btnDefault,     callback: this._onTouchedBtnDefault },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => this._onTouchedPanelMask());
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const scale         = getStageScale();
        this._prevScale     = scale;
        this._selectedScale = scale;

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupScale(e: Event): void {
        this._handleTouchGroupScale(e);
    }
    private _handleTouchGroupScale(e: Event): void {
        const group         = this._groupScale;
        const width         = group.getUnscaledWidth();
        const data          = e.data as PointerUnifiedEventData;
        const point         = group.globalToLocal(data.stageX, data.stageY);
        const scale         = Math.floor(Math.max(0, Math.min(point.x, width)) / width * (Scale.MaxScale - Scale.MinScale) + Scale.MinScale);
        this._selectedScale = scale;
        StagesStageManagerSetStageScale(scale);
        this._updateGroupScale();
    }

    private _onTouchedBtnClose(): void {
        StagesStageManagerSetStageScale(this._prevScale || Scale.MinScale);

        this.closePanel();
    }
    private _onTouchedBtnDefault(): void {
        this._selectedScale = Scale.MinScale;
        StagesStageManagerSetStageScale(Scale.MinScale);

        this._updateView();
    }
    private _onTouchedBtnConfirm(): void {
        setStageScale(this._selectedScale || Scale.MinScale);

        this.closePanel();
    }
    private _onTouchedPanelMask(): void {
        StagesStageManagerSetStageScale(this._prevScale || Scale.MinScale);
        playShortSfx(ShortSfxCode.ButtonCancel01);

        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupScale();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0558);
        this._labelScaleTitle.setLangText(TextType.B0559);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnDefault.setLangText(TextType.B0543);
        this._btnClose.setLangText(TextType.B0154);

        this._layoutContent.arrangeItems();
    }

    private _updateGroupScale(): void {
        const scale = this._selectedScale || Scale.MinScale;
        const width = this._groupScale.getUnscaledWidth();
        const pos   = width * (scale - Scale.MinScale) / (Scale.MaxScale - Scale.MinScale);
        this._imgScalePoint.setX(pos);
        this._imgScaleBar.setUnscaledManualWidth(pos);
        this._labelScale.setText(`${format("%.2f", 10000 / scale)}%`);
    }
}
