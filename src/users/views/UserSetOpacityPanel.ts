import {
    Users_Model,
    Sounds_SoundPlayer,
    Helpers_PointerInput,
    Users_Proxy,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import { UserOpacitySettings } from "../../proto/schema/CommonProto/User/UserOpacitySettings.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutContent!                : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _layoutUnit!                   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelUnitTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupUnitOpacity!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgUnitBar!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgUnitPoint!                 : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelUnitOpacity!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutTileBase!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTileBaseTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupTileBaseOpacity!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgTileBaseBar!               : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgTileBasePoint!             : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTileBaseOpacity!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutTileObject!             : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTileObjectTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupTileObjectOpacity!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgTileObjectBar!             : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgTileObjectPoint!           : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTileObjectOpacity!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutTileDecoration!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTileDecoratorTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupTileDecoratorOpacity!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgTileDecoratorBar!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgTileDecoratorPoint!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTileDecoratorOpacity!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnDefault!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!                   : Ui_Interfaces_IUiButton.IUiButton;

    private _prevOpacitySettings                    = new UserOpacitySettings();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupUnitOpacity,           callback: this._onTouchedGroupUnitOpacity },
            { ui: this._groupUnitOpacity,           callback: this._onTouchMoveGroupUnitOpacity,            eventType: Helpers_PointerInput.PointerEventType.PressMove },

            { ui: this._groupTileBaseOpacity,       callback: this._onTouchedGroupTileBaseOpacity },
            { ui: this._groupTileBaseOpacity,       callback: this._onTouchMoveGroupTileBaseOpacity,        eventType: Helpers_PointerInput.PointerEventType.PressMove },

            { ui: this._groupTileObjectOpacity,     callback: this._onTouchedGroupTileObjectOpacity },
            { ui: this._groupTileObjectOpacity,     callback: this._onTouchMoveGroupTileObjectOpacity,      eventType: Helpers_PointerInput.PointerEventType.PressMove },

            { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchedGroupTileDecorationOpacity },
            { ui: this._groupTileDecoratorOpacity,  callback: this._onTouchMoveGroupTileDecorationOpacity,  eventType: Helpers_PointerInput.PointerEventType.PressMove },

            { ui: this._btnClose,                   callback: this._onTouchedBtnClose },
            { ui: this._btnDefault,                 callback: this._onTouchedBtnDefault },
            { ui: this._btnConfirm,                 callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._prevOpacitySettings = Users_Model.getSelfSettingsOpacitySettings()?.clone() ?? new UserOpacitySettings();

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupUnitOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupUnitOpacity(e);
    }
    private _onTouchMoveGroupUnitOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupUnitOpacity(e);
    }
    private _handleTouchGroupUnitOpacity(e: Egret_Egret.Event): void {
        const data              = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const group             = this._groupUnitOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = Users_Model.getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setUnitOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        Users_Model.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupUnitOpacity();
    }

    private _onTouchedGroupTileBaseOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupTileBaseOpacity(e);
    }
    private _onTouchMoveGroupTileBaseOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupTileBaseOpacity(e);
    }
    private _handleTouchGroupTileBaseOpacity(e: Egret_Egret.Event): void {
        const data              = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const group             = this._groupTileBaseOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = Users_Model.getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setTileBaseOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        Users_Model.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileBaseOpacity();
    }

    private _onTouchedGroupTileObjectOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupTileObjectOpacity(e);
    }
    private _onTouchMoveGroupTileObjectOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupTileObjectOpacity(e);
    }
    private _handleTouchGroupTileObjectOpacity(e: Egret_Egret.Event): void {
        const data              = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const group             = this._groupTileObjectOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = Users_Model.getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setTileObjectOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        Users_Model.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileObjectOpacity();
    }

    private _onTouchedGroupTileDecorationOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupTileDecorationOpacity(e);
    }
    private _onTouchMoveGroupTileDecorationOpacity(e: Egret_Egret.Event): void {
        this._handleTouchGroupTileDecorationOpacity(e);
    }
    private _handleTouchGroupTileDecorationOpacity(e: Egret_Egret.Event): void {
        const data              = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const group             = this._groupTileDecoratorOpacity;
        const width             = group.getUnscaledWidth();
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const opacitySettings   = Users_Model.getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        opacitySettings.setTileDecorationOpacity(Math.round(Math.max(0, Math.min(point.x, width)) / width * 100));
        Users_Model.setSelfSettingsOpacitySettings(opacitySettings);

        this._updateGroupTileDecorationOpacity();
    }

    private _onTouchedBtnClose(): void {
        Users_Model.setSelfSettingsOpacitySettings(this._prevOpacitySettings);
        this.closePanel();
    }
    private _onTouchedBtnDefault(): void {
        Users_Model.setSelfSettingsOpacitySettings(UserOpacitySettings.fromJson({
            unitOpacity             : 100,
            tileBaseOpacity         : 100,
            tileDecorationOpacity   : 100,
            tileObjectOpacity       : 100,
        }));

        this._updateView();
    }
    private _onTouchedBtnConfirm(): void {
        const opacitySettings       = Users_Model.getSelfSettingsOpacitySettings() ?? new UserOpacitySettings();
        const prevOpacitySettings   = this._prevOpacitySettings;
        if (((opacitySettings.getTileBaseOpacity() ?? 100) !== (prevOpacitySettings.getTileBaseOpacity() ?? 100))             ||
            ((opacitySettings.getTileDecorationOpacity() ?? 100) !== (prevOpacitySettings.getTileDecorationOpacity() ?? 100)) ||
            ((opacitySettings.getTileObjectOpacity() ?? 100) !== (prevOpacitySettings.getTileObjectOpacity() ?? 100))         ||
            ((opacitySettings.getUnitOpacity() ?? 100) !== (prevOpacitySettings.getUnitOpacity() ?? 100))
        ) {
            Users_Proxy.reqUserSetSettings({
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0827);
        this._labelUnitTitle.setLangText(Lang_Constants.TextType.Units);
        this._labelTileBaseTitle.setLangText(Lang_Constants.TextType.TileBase);
        this._labelTileObjectTitle.setLangText(Lang_Constants.TextType.TileObject);
        this._labelTileDecoratorTitle.setLangText(Lang_Constants.TextType.TileDecoration);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnDefault.setLangText(Lang_Constants.TextType.B0543);
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);

        this._layoutUnit.arrangeItems();
        this._layoutTileBase.arrangeItems();
        this._layoutTileDecoration.arrangeItems();
        this._layoutTileObject.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateGroupUnitOpacity(): void {
        const opacity   = Users_Model.getSelfSettingsOpacitySettings()?.getUnitOpacity() ?? 100;
        const pos       = this._groupUnitOpacity.getUnscaledWidth() * opacity / 100;
        this._imgUnitPoint.setX(pos);
        this._imgUnitBar.setUnscaledManualWidth(pos);
        this._labelUnitOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileBaseOpacity(): void {
        const opacity   = Users_Model.getSelfSettingsOpacitySettings()?.getTileBaseOpacity() ?? 100;
        const pos       = this._groupTileBaseOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileBasePoint.setX(pos);
        this._imgTileBaseBar.setUnscaledManualWidth(pos);
        this._labelTileBaseOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileObjectOpacity(): void {
        const opacity   = Users_Model.getSelfSettingsOpacitySettings()?.getTileObjectOpacity() ?? 100;
        const pos       = this._groupTileObjectOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileObjectPoint.setX(pos);
        this._imgTileObjectBar.setUnscaledManualWidth(pos);
        this._labelTileObjectOpacity.setText(`${opacity}%`);
    }
    private _updateGroupTileDecorationOpacity(): void {
        const opacity   = Users_Model.getSelfSettingsOpacitySettings()?.getTileDecorationOpacity() ?? 100;
        const pos       = this._groupTileDecoratorOpacity.getUnscaledWidth() * opacity / 100;
        this._imgTileDecoratorPoint.setX(pos);
        this._imgTileDecoratorBar.setUnscaledManualWidth(pos);
        this._labelTileDecoratorOpacity.setText(`${opacity}%`);
    }
}
