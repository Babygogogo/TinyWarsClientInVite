import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoUserUserOpacitySettings from "../../proto/schema/CommonProto/User/UserOpacitySettings.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutContent!                : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutUnit!                   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelUnitTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupUnitOpacity!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgUnitBar!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _imgUnitPoint!                 : UiInterfacesIUiImage.IUiImage;
    private readonly _labelUnitOpacity!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutTileBase!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTileBaseTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupTileBaseOpacity!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgTileBaseBar!               : UiInterfacesIUiImage.IUiImage;
    private readonly _imgTileBasePoint!             : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTileBaseOpacity!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutTileObject!             : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTileObjectTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupTileObjectOpacity!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgTileObjectBar!             : UiInterfacesIUiImage.IUiImage;
    private readonly _imgTileObjectPoint!           : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTileObjectOpacity!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutTileDecoration!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTileDecoratorTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupTileDecoratorOpacity!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgTileDecoratorBar!          : UiInterfacesIUiImage.IUiImage;
    private readonly _imgTileDecoratorPoint!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTileDecoratorOpacity!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnDefault!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!                   : UiInterfacesIUiButton.IUiButton;

    private _prevOpacitySettings                    = new ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupUnitOpacity,           callback: this._onTouchedGroupUnitOpacity },
            { ui: this._groupUnitOpacity,           callback: this._onTouchMoveGroupUnitOpacity,            eventType: HelpersPointerInput.PointerEventType.PressMove },

            { ui: this._groupTileBaseOpacity,       callback: this._onTouchedGroupTileBaseOpacity },
            { ui: this._groupTileBaseOpacity,       callback: this._onTouchMoveGroupTileBaseOpacity,        eventType: HelpersPointerInput.PointerEventType.PressMove },

            { ui: this._groupTileObjectOpacity,     callback: this._onTouchedGroupTileObjectOpacity },
            { ui: this._groupTileObjectOpacity,     callback: this._onTouchMoveGroupTileObjectOpacity,      eventType: HelpersPointerInput.PointerEventType.PressMove },

            { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchedGroupTileDecorationOpacity },
            { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchMoveGroupTileDecorationOpacity,  eventType: HelpersPointerInput.PointerEventType.PressMove },

            { ui: this._btnClose,                   callback: this._onTouchedBtnClose },
            { ui: this._btnDefault,                 callback: this._onTouchedBtnDefault },
            { ui: this._btnConfirm,                 callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._prevOpacitySettings = UsersModel.getSelfSettingsOpacitySettings()?.clone() ?? new ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings();

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupUnitOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupUnitOpacity(e);
    }
    private _onTouchMoveGroupUnitOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupUnitOpacity(e);
    }
    private _handleTouchGroupUnitOpacity(e: VendorEgretEgret.Event): void {
        const data              = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const group             = this._groupUnitOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = UsersModel.getSelfSettingsOpacitySettings() ?? new ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings();
        opacitySettings.setUnitOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        UsersModel.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupUnitOpacity();
    }

    private _onTouchedGroupTileBaseOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupTileBaseOpacity(e);
    }
    private _onTouchMoveGroupTileBaseOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupTileBaseOpacity(e);
    }
    private _handleTouchGroupTileBaseOpacity(e: VendorEgretEgret.Event): void {
        const data              = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const group             = this._groupTileBaseOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = UsersModel.getSelfSettingsOpacitySettings() ?? new ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings();
        opacitySettings.setTileBaseOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        UsersModel.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileBaseOpacity();
    }

    private _onTouchedGroupTileObjectOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupTileObjectOpacity(e);
    }
    private _onTouchMoveGroupTileObjectOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupTileObjectOpacity(e);
    }
    private _handleTouchGroupTileObjectOpacity(e: VendorEgretEgret.Event): void {
        const data              = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const group             = this._groupTileObjectOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = UsersModel.getSelfSettingsOpacitySettings() ?? new ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings();
        opacitySettings.setTileObjectOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        UsersModel.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileObjectOpacity();
    }

    private _onTouchedGroupTileDecorationOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupTileDecorationOpacity(e);
    }
    private _onTouchMoveGroupTileDecorationOpacity(e: VendorEgretEgret.Event): void {
        this._handleTouchGroupTileDecorationOpacity(e);
    }
    private _handleTouchGroupTileDecorationOpacity(e: VendorEgretEgret.Event): void {
        const data              = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const group             = this._groupTileDecoratorOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = UsersModel.getSelfSettingsOpacitySettings() ?? new ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings();
        opacitySettings.setTileDecorationOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        UsersModel.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileDecorationOpacity();
    }

    private _onTouchedBtnClose(): void {
        UsersModel.setSelfSettingsOpacitySettings(this._prevOpacitySettings);
        this.closePanel();
    }
    private _onTouchedBtnDefault(): void {
        UsersModel.setSelfSettingsOpacitySettings(ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings.fromJson({
            unitOpacity             : 100,
            tileBaseOpacity         : 100,
            tileDecorationOpacity   : 100,
            tileObjectOpacity       : 100,
        }));

        this._updateView();
    }
    private _onTouchedBtnConfirm(): void {
        const opacitySettings       = UsersModel.getSelfSettingsOpacitySettings() ?? new ProtoSchemaCommonProtoUserUserOpacitySettings.UserOpacitySettings();
        const prevOpacitySettings   = this._prevOpacitySettings;
        if (((opacitySettings.getTileBaseOpacity() ?? 100) !== (prevOpacitySettings.getTileBaseOpacity() ?? 100))             ||
            ((opacitySettings.getTileDecorationOpacity() ?? 100) !== (prevOpacitySettings.getTileDecorationOpacity() ?? 100)) ||
            ((opacitySettings.getTileObjectOpacity() ?? 100) !== (prevOpacitySettings.getTileObjectOpacity() ?? 100))         ||
            ((opacitySettings.getUnitOpacity() ?? 100) !== (prevOpacitySettings.getUnitOpacity() ?? 100))
        ) {
            UsersProxy.reqUserSetSettings({
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
        this._labelTitle.setLangText(LangConstants.TextType.B0827);
        this._labelUnitTitle.setLangText(LangConstants.TextType.Units);
        this._labelTileBaseTitle.setLangText(LangConstants.TextType.TileBase);
        this._labelTileObjectTitle.setLangText(LangConstants.TextType.TileObject);
        this._labelTileDecoratorTitle.setLangText(LangConstants.TextType.TileDecoration);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._btnDefault.setLangText(LangConstants.TextType.B0543);
        this._btnClose.setLangText(LangConstants.TextType.B0154);

        this._layoutUnit.arrangeItems();
        this._layoutTileBase.arrangeItems();
        this._layoutTileDecoration.arrangeItems();
        this._layoutTileObject.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateGroupUnitOpacity(): void {
        const opacity   = UsersModel.getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100;
        const pos       = this._groupUnitOpacity.getUnscaledWidth() * opacity / 100;
        this._imgUnitPoint.setX(pos);
        this._imgUnitBar.setUnscaledManualWidth(pos);
        this._labelUnitOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileBaseOpacity(): void {
        const opacity   = UsersModel.getSelfSettingsOpacitySettings()?.getTileBaseOpacity() ?? 100;
        const pos       = this._groupTileBaseOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileBasePoint.setX(pos);
        this._imgTileBaseBar.setUnscaledManualWidth(pos);
        this._labelTileBaseOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileObjectOpacity(): void {
        const opacity   = UsersModel.getSelfSettingsOpacitySettings()?.getTileObjectOpacity() ?? 100;
        const pos       = this._groupTileObjectOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileObjectPoint.setX(pos);
        this._imgTileObjectBar.setUnscaledManualWidth(pos);
        this._labelTileObjectOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileDecorationOpacity(): void {
        const opacity   = UsersModel.getSelfSettingsOpacitySettings()?.getTileDecorationOpacity() ?? 100;
        const pos       = this._groupTileDecoratorOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileDecoratorPoint.setX(pos);
        this._imgTileDecoratorBar.setUnscaledManualWidth(pos);
        this._labelTileDecoratorOpacity.setText(`${opacity}%`);
    }
}
