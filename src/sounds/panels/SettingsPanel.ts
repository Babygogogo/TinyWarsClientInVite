import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../Constants.ts";
import * as SoundsSoundPlayer from "../SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutContent!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutMain!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMainTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMainMute!          : UiInterfacesIUiImage.IUiImage;
    private readonly _groupMainVolume!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgMainBar!           : UiInterfacesIUiImage.IUiImage;
    private readonly _imgMainPoint!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelMainVolume!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutBgm!            : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelBgmTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBgmMute!           : UiInterfacesIUiImage.IUiImage;
    private readonly _groupBgmVolume!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBgmBar!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBgmPoint!          : UiInterfacesIUiImage.IUiImage;
    private readonly _labelBgmVolume!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutEffect!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelEffectTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgEffectMute!        : UiInterfacesIUiImage.IUiImage;
    private readonly _groupEffectVolume!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgEffectBar!         : UiInterfacesIUiImage.IUiImage;
    private readonly _imgEffectPoint!       : UiInterfacesIUiImage.IUiImage;
    private readonly _labelEffectVolume!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutCoBgm!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSwitchBgm!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSwitchBgm!         : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutSwitchBgm!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCoBgmSettings!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCoBgmSettings!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSceneBgmSettings!  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.SoundManagerPlayingBgmCodeChanged,   callback: this._onNotifySoundManagerPlayingBgmCodeChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },

            { ui: this._groupMainVolume,        callback: this._onTouchedGroupMainVolume },
            { ui: this._groupMainVolume,        callback: this._onTouchMoveGroupMainVolume,             eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._groupMainVolume,        callback: this._onTouchEndGroupMainVolume,              eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupMainVolume,        callback: this._onTouchReleaseOutsideGroupMainVolume,   eventType: HelpersPointerInput.PointerEventType.ReleaseOut },
            { ui: this._imgMainMute,            callback: this._onTouchedGroupMainMute },

            { ui: this._groupBgmVolume,         callback: this._onTouchedGroupBgmVolume },
            { ui: this._groupBgmVolume,         callback: this._onTouchMoveGroupBgmVolume,              eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._imgBgmMute,             callback: this._onTouchedGroupBgmMute },

            { ui: this._groupEffectVolume,      callback: this._onTouchedGroupEffectVolume },
            { ui: this._groupEffectVolume,      callback: this._onTouchMoveGroupEffectVolume,           eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._groupEffectVolume,      callback: this._onTouchEndGroupEffectVolume,            eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupEffectVolume,      callback: this._onTouchReleaseOutsideGroupEffectVolume, eventType: HelpersPointerInput.PointerEventType.ReleaseOut },
            { ui: this._imgEffectMute,          callback: this._onTouchedGroupEffectMute },

            { ui: this._btnSwitchBgm,           callback: this._onTouchedBtnSwitchBgm },

            { ui: this._btnCoBgmSettings,       callback: this._onTouchedBtnCoBgmSettings },
            { ui: this._btnSceneBgmSettings,    callback: this._onTouchedBtnSceneBgmSettings },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._imgMainMute.setIsTouchEnabled(true);
        this._imgBgmMute.setIsTouchEnabled(true);
        this._imgEffectMute.setIsTouchEnabled(true);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifySoundManagerPlayingBgmCodeChanged(): void {
        this._updateBtnSwitchBgm();
    }

    private _onTouchedGroupMainVolume(e: VendorEgretEgret.Event): void {
        const width = this._groupMainVolume.getScaledWidth();
        const data  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point = this._groupMainVolume.globalToLocal(data.stageX, data.stageY);
        SoundsSoundPlayer.setMainVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupMainVolume();
    }
    private _onTouchMoveGroupMainVolume(e: VendorEgretEgret.Event): void {
        const width = this._groupMainVolume.getScaledWidth();
        const data  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point = this._groupMainVolume.globalToLocal(data.stageX, data.stageY);
        SoundsSoundPlayer.setMainVolume(Math.max(0, Math.min(point.x, width)) / width);
        SoundsSoundPlayer.setMainVolumeToStore();
        this._updateGroupMainVolume();
    }
    private _onTouchEndGroupMainVolume(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchReleaseOutsideGroupMainVolume(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupMainMute(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        SoundsSoundPlayer.setIsMainMute(!SoundsSoundPlayer.getIsMainMute());
        SoundsSoundPlayer.setIsMainMuteToStore();
        this._updateGroupMainMute();
    }

    private _onTouchedGroupBgmVolume(e: VendorEgretEgret.Event): void {
        const width = this._groupBgmVolume.getScaledWidth();
        const data  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point = this._groupBgmVolume.globalToLocal(data.stageX, data.stageY);
        SoundsSoundPlayer.setBgmVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupBgmVolume();
    }
    private _onTouchMoveGroupBgmVolume(e: VendorEgretEgret.Event): void {
        const width = this._groupBgmVolume.getScaledWidth();
        const data  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point = this._groupBgmVolume.globalToLocal(data.stageX, data.stageY);
        SoundsSoundPlayer.setBgmVolume(Math.max(0, Math.min(point.x, width)) / width);
        SoundsSoundPlayer.setBgmVolumeToStore();
        this._updateGroupBgmVolume();
    }
    private _onTouchedGroupBgmMute(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        SoundsSoundPlayer.setIsBgmMute(!SoundsSoundPlayer.getIsBgmMute());
        SoundsSoundPlayer.setIsBgmMuteToStore();
        this._updateGroupBgmMute();
    }

    private _onTouchedGroupEffectVolume(e: VendorEgretEgret.Event): void {
        const width = this._groupEffectVolume.getScaledWidth();
        const data  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point = this._groupEffectVolume.globalToLocal(data.stageX, data.stageY);
        SoundsSoundPlayer.setEffectVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupEffectVolume();
    }
    private _onTouchMoveGroupEffectVolume(e: VendorEgretEgret.Event): void {
        const width = this._groupEffectVolume.getScaledWidth();
        const data  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point = this._groupEffectVolume.globalToLocal(data.stageX, data.stageY);
        SoundsSoundPlayer.setEffectVolume(Math.max(0, Math.min(point.x, width)) / width);
        SoundsSoundPlayer.setEffectVolumeToStore();
        this._updateGroupEffectVolume();
    }
    private _onTouchEndGroupEffectVolume(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchReleaseOutsideGroupEffectVolume(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupEffectMute(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        SoundsSoundPlayer.setIsEffectMute(!SoundsSoundPlayer.getIsEffectMute());
        SoundsSoundPlayer.setIsEffectMuteToStore();
        this._updateGroupEffectMute();
    }

    private async _onTouchedBtnSwitchBgm(): Promise<void> {
        // await SoundManager.playPreviousBgm();
        // this._updateLabelBgmName();

        const currentBgmCode = SoundsSoundPlayer.getPlayingBgmCode();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
            currentBgmCode      : currentBgmCode,
            callbackOnConfirm   : code => {
                HelpersGameFlow.getOngoingWar()?.setOverridingBgmCode(code);
            },
            callbackOnCancel    : () => {
                SoundsSoundPlayer.playBgm(currentBgmCode);
            }
        });
    }

    private async _onTouchedBtnCoBgmSettings(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetCoBgmSettingsPanel, {
            gameConfig  : await GameConfigGcModel.getLatestGameConfig(),
        });
    }

    private async _onTouchedBtnSceneBgmSettings(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSceneBgmSettingsPanel, {
            gameConfig  : await GameConfigGcModel.getLatestGameConfig(),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupMainMute();
        this._updateGroupMainVolume();
        this._updateGroupBgmMute();
        this._updateGroupBgmVolume();
        this._updateGroupEffectMute();
        this._updateGroupEffectVolume();
        this._updateBtnCoBgmSettings();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0540));
        this._labelMainTitle.setText(LangUtils.getText(LangConstants.TextType.B1325));
        this._labelBgmTitle.setText(LangUtils.getText(LangConstants.TextType.B0541));
        this._labelEffectTitle.setText(LangUtils.getText(LangConstants.TextType.B0542));
        this._labelSwitchBgm.setText(LangUtils.getText(LangConstants.TextType.B1281));
        this._labelCoBgmSettings.setText(LangUtils.getText(LangConstants.TextType.B1286));
        this._btnCoBgmSettings.setText(LangUtils.getText(LangConstants.TextType.B0425));
        this._btnSceneBgmSettings.setText(LangUtils.getText(LangConstants.TextType.B1287));

        this._layoutMain.arrangeItems();
        this._layoutBgm.arrangeItems();
        this._layoutEffect.arrangeItems();
        this._layoutCoBgm.arrangeItems();
        this._layoutSwitchBgm.arrangeItems();
        this._layoutContent.arrangeItems();
        this._updateBtnSwitchBgm();
    }

    private _updateGroupMainMute(): void {
        this._imgMainMute.loadSource(SoundsSoundPlayer.getIsMainMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupBgmMute(): void {
        this._imgBgmMute.loadSource(SoundsSoundPlayer.getIsBgmMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupEffectMute(): void {
        this._imgEffectMute.loadSource(SoundsSoundPlayer.getIsEffectMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupMainVolume(): void {
        const volume    = SoundsSoundPlayer.getMainVolume();
        const pos       = this._groupMainVolume.getScaledWidth() * volume;
        this._imgMainPoint.setX(pos);
        this._imgMainBar.setUnscaledManualWidth(pos);
        this._labelMainVolume.setText(`${Math.floor(volume * 100)}`);
    }
    private _updateGroupBgmVolume(): void {
        const volume    = SoundsSoundPlayer.getBgmVolume();
        const pos       = this._groupBgmVolume.getScaledWidth() * volume;
        this._imgBgmPoint.setX(pos);
        this._imgBgmBar.setUnscaledManualWidth(pos);
        this._labelBgmVolume.setText(`${Math.floor(volume * 100)}`);
    }
    private _updateGroupEffectVolume(): void {
        const volume    = SoundsSoundPlayer.getEffectVolume();
        const pos       = this._groupEffectVolume.getScaledWidth() * volume;
        this._imgEffectPoint.setX(pos);
        this._imgEffectBar.setUnscaledManualWidth(pos);
        this._labelEffectVolume.setText(`${Math.floor(volume * 100)}`);
    }

    private _updateBtnCoBgmSettings(): void {
        this._btnCoBgmSettings.setIsVisible(UsersModel.getSelfUserId() != null);
    }
    private async _updateBtnSwitchBgm(): Promise<void> {
        this._btnSwitchBgm.setText(LangUtils.getBgmSfxName(SoundsSoundPlayer.getPlayingBgmCode(), await GameConfigGcModel.getLatestGameConfig()) ?? `--`);
    }
}
