import { PointerEventType, type PointerUnifiedEventData } from "../../helpers/PointerInput.ts";
import { TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UserOpacitySettings } from "../../proto/schema/CommonProto/User/UserOpacitySettings.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getSelfSettingsOpacitySettings, setSelfSettingsOpacitySettings } from "../Model.ts";
import { reqUserSetSettings } from "../Proxy.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;

    private readonly _layoutContent!                : IUiLayout;

    private readonly _layoutUnit!                   : IUiLayout;
    private readonly _labelUnitTitle!               : IUiLabel;
    private readonly _groupUnitOpacity!             : IUiContainer;
    private readonly _imgUnitBar!                   : IUiImage;
    private readonly _imgUnitPoint!                 : IUiImage;
    private readonly _labelUnitOpacity!             : IUiLabel;

    private readonly _layoutTileBase!               : IUiLayout;
    private readonly _labelTileBaseTitle!           : IUiLabel;
    private readonly _groupTileBaseOpacity!         : IUiContainer;
    private readonly _imgTileBaseBar!               : IUiImage;
    private readonly _imgTileBasePoint!             : IUiImage;
    private readonly _labelTileBaseOpacity!         : IUiLabel;

    private readonly _layoutTileObject!             : IUiLayout;
    private readonly _labelTileObjectTitle!         : IUiLabel;
    private readonly _groupTileObjectOpacity!       : IUiContainer;
    private readonly _imgTileObjectBar!             : IUiImage;
    private readonly _imgTileObjectPoint!           : IUiImage;
    private readonly _labelTileObjectOpacity!       : IUiLabel;

    private readonly _layoutTileDecoration!         : IUiLayout;
    private readonly _labelTileDecoratorTitle!      : IUiLabel;
    private readonly _groupTileDecoratorOpacity!    : IUiContainer;
    private readonly _imgTileDecoratorBar!          : IUiImage;
    private readonly _imgTileDecoratorPoint!        : IUiImage;
    private readonly _labelTileDecoratorOpacity!    : IUiLabel;

    private readonly _btnDefault!                   : IUiButton;
    private readonly _btnConfirm!                   : IUiButton;

    private _prevOpacitySettings                    = new UserOpacitySettings();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupUnitOpacity,           callback: this._onTouchedGroupUnitOpacity },
            { ui: this._groupUnitOpacity,           callback: this._onTouchMoveGroupUnitOpacity,            eventType: PointerEventType.PressMove },

            { ui: this._groupTileBaseOpacity,       callback: this._onTouchedGroupTileBaseOpacity },
            { ui: this._groupTileBaseOpacity,       callback: this._onTouchMoveGroupTileBaseOpacity,        eventType: PointerEventType.PressMove },

            { ui: this._groupTileObjectOpacity,     callback: this._onTouchedGroupTileObjectOpacity },
            { ui: this._groupTileObjectOpacity,     callback: this._onTouchMoveGroupTileObjectOpacity,      eventType: PointerEventType.PressMove },

            { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchedGroupTileDecorationOpacity },
            { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchMoveGroupTileDecorationOpacity,  eventType: PointerEventType.PressMove },

            { ui: this._btnClose,                   callback: this._onTouchedBtnClose },
            { ui: this._btnDefault,                 callback: this._onTouchedBtnDefault },
            { ui: this._btnConfirm,                 callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._prevOpacitySettings = getSelfSettingsOpacitySettings()?.clone() ?? new UserOpacitySettings();

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupUnitOpacity(e: Event): void {
        this._handleTouchGroupUnitOpacity(e);
    }
    private _onTouchMoveGroupUnitOpacity(e: Event): void {
        this._handleTouchGroupUnitOpacity(e);
    }
    private _handleTouchGroupUnitOpacity(e: Event): void {
        const data              = e.data as PointerUnifiedEventData;
        const group             = this._groupUnitOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setUnitOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupUnitOpacity();
    }

    private _onTouchedGroupTileBaseOpacity(e: Event): void {
        this._handleTouchGroupTileBaseOpacity(e);
    }
    private _onTouchMoveGroupTileBaseOpacity(e: Event): void {
        this._handleTouchGroupTileBaseOpacity(e);
    }
    private _handleTouchGroupTileBaseOpacity(e: Event): void {
        const data              = e.data as PointerUnifiedEventData;
        const group             = this._groupTileBaseOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setTileBaseOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileBaseOpacity();
    }

    private _onTouchedGroupTileObjectOpacity(e: Event): void {
        this._handleTouchGroupTileObjectOpacity(e);
    }
    private _onTouchMoveGroupTileObjectOpacity(e: Event): void {
        this._handleTouchGroupTileObjectOpacity(e);
    }
    private _handleTouchGroupTileObjectOpacity(e: Event): void {
        const data              = e.data as PointerUnifiedEventData;
        const group             = this._groupTileObjectOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setTileObjectOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileObjectOpacity();
    }

    private _onTouchedGroupTileDecorationOpacity(e: Event): void {
        this._handleTouchGroupTileDecorationOpacity(e);
    }
    private _onTouchMoveGroupTileDecorationOpacity(e: Event): void {
        this._handleTouchGroupTileDecorationOpacity(e);
    }
    private _handleTouchGroupTileDecorationOpacity(e: Event): void {
        const data              = e.data as PointerUnifiedEventData;
        const group             = this._groupTileDecoratorOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setTileDecorationOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileDecorationOpacity();
    }

    private _onTouchedBtnClose(): void {
        setSelfSettingsOpacitySettings(this._prevOpacitySettings);
        this.closePanel();
    }
    private _onTouchedBtnDefault(): void {
        setSelfSettingsOpacitySettings(UserOpacitySettings.fromJson({
            unitOpacity             : 100,
            tileBaseOpacity         : 100,
            tileDecorationOpacity   : 100,
            tileObjectOpacity       : 100,
        }));

        this._updateView();
    }
    private _onTouchedBtnConfirm(): void {
        const opacitySettings       = getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        const prevOpacitySettings   = this._prevOpacitySettings;
        if (((opacitySettings.getTileBaseOpacity() ?? 100) !== (prevOpacitySettings.getTileBaseOpacity() ?? 100))             ||
            ((opacitySettings.getTileDecorationOpacity() ?? 100) !== (prevOpacitySettings.getTileDecorationOpacity() ?? 100)) ||
            ((opacitySettings.getTileObjectOpacity() ?? 100) !== (prevOpacitySettings.getTileObjectOpacity() ?? 100))         ||
            ((opacitySettings.getUnitOpacity() ?? 100) !== (prevOpacitySettings.getUnitOpacity() ?? 100))
        ) {
            reqUserSetSettings({
                opacitySettings : opacitySettings.toJson(),
                coBgmSettings   : [],
            });
        }

        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupUnitOpacity();
        this._updateGroupTileBaseOpacity();
        this._updateGroupTileObjectOpacity();
        this._updateGroupTileDecorationOpacity();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0827);
        this._labelUnitTitle.setLangText(TextType.Units);
        this._labelTileBaseTitle.setLangText(TextType.TileBase);
        this._labelTileObjectTitle.setLangText(TextType.TileObject);
        this._labelTileDecoratorTitle.setLangText(TextType.TileDecoration);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnDefault.setLangText(TextType.B0543);
        this._btnClose.setLangText(TextType.B0154);

        this._layoutUnit.arrangeItems();
        this._layoutTileBase.arrangeItems();
        this._layoutTileDecoration.arrangeItems();
        this._layoutTileObject.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateGroupUnitOpacity(): void {
        const opacity   = getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100;
        const pos       = this._groupUnitOpacity.getUnscaledWidth() * opacity / 100;
        this._imgUnitPoint.setX(pos);
        this._imgUnitBar.setUnscaledManualWidth(pos);
        this._labelUnitOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileBaseOpacity(): void {
        const opacity   = getSelfSettingsOpacitySettings()?.getTileBaseOpacity() ?? 100;
        const pos       = this._groupTileBaseOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileBasePoint.setX(pos);
        this._imgTileBaseBar.setUnscaledManualWidth(pos);
        this._labelTileBaseOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileObjectOpacity(): void {
        const opacity   = getSelfSettingsOpacitySettings()?.getTileObjectOpacity() ?? 100;
        const pos       = this._groupTileObjectOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileObjectPoint.setX(pos);
        this._imgTileObjectBar.setUnscaledManualWidth(pos);
        this._labelTileObjectOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileDecorationOpacity(): void {
        const opacity   = getSelfSettingsOpacitySettings()?.getTileDecorationOpacity() ?? 100;
        const pos       = this._groupTileDecoratorOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileDecoratorPoint.setX(pos);
        this._imgTileDecoratorBar.setUnscaledManualWidth(pos);
        this._labelTileDecoratorOpacity.setText(`${opacity}%`);
    }
}
