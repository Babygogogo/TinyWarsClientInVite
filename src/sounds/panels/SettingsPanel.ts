import {
    Lang_Utils,
    Sounds_SoundPlayer,
    GamePanels_Dict,
    GameConfigs_Provider,
    Helpers_GameFlow,
    Users_Model,
    GamePanels_Manager,
    Helpers_PointerInput,
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

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutContent!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutMain!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMainTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMainMute!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupMainVolume!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgMainBar!           : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgMainPoint!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelMainVolume!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutBgm!            : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelBgmTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgBgmMute!           : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupBgmVolume!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBgmBar!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBgmPoint!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelBgmVolume!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutEffect!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelEffectTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgEffectMute!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupEffectVolume!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgEffectBar!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgEffectPoint!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelEffectVolume!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutCoBgm!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSwitchBgm!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSwitchBgm!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutSwitchBgm!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCoBgmSettings!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCoBgmSettings!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSceneBgmSettings!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.SoundManagerPlayingBgmCodeChanged,   callback: this._onNotifySoundManagerPlayingBgmCodeChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },

            { ui: this._groupMainVolume,        callback: this._onTouchedGroupMainVolume },
            { ui: this._groupMainVolume,        callback: this._onTouchMoveGroupMainVolume,             eventType: Helpers_PointerInput.PointerEventType.PressMove },
            { ui: this._groupMainVolume,        callback: this._onTouchEndGroupMainVolume,              eventType: Helpers_PointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupMainVolume,        callback: this._onTouchReleaseOutsideGroupMainVolume,   eventType: Helpers_PointerInput.PointerEventType.ReleaseOut },
            { ui: this._imgMainMute,            callback: this._onTouchedGroupMainMute },

            { ui: this._groupBgmVolume,         callback: this._onTouchedGroupBgmVolume },
            { ui: this._groupBgmVolume,         callback: this._onTouchMoveGroupBgmVolume,              eventType: Helpers_PointerInput.PointerEventType.PressMove },
            { ui: this._imgBgmMute,             callback: this._onTouchedGroupBgmMute },

            { ui: this._groupEffectVolume,      callback: this._onTouchedGroupEffectVolume },
            { ui: this._groupEffectVolume,      callback: this._onTouchMoveGroupEffectVolume,           eventType: Helpers_PointerInput.PointerEventType.PressMove },
            { ui: this._groupEffectVolume,      callback: this._onTouchEndGroupEffectVolume,            eventType: Helpers_PointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupEffectVolume,      callback: this._onTouchReleaseOutsideGroupEffectVolume, eventType: Helpers_PointerInput.PointerEventType.ReleaseOut },
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

    private _onTouchedGroupMainVolume(e: Egret_Egret.Event): void {
        const width = this._groupMainVolume.getScaledWidth();
        const data  = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const point = this._groupMainVolume.globalToLocal(data.stageX, data.stageY);
        Sounds_SoundPlayer.setMainVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupMainVolume();
    }
    private _onTouchMoveGroupMainVolume(e: Egret_Egret.Event): void {
        const width = this._groupMainVolume.getScaledWidth();
        const data  = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const point = this._groupMainVolume.globalToLocal(data.stageX, data.stageY);
        Sounds_SoundPlayer.setMainVolume(Math.max(0, Math.min(point.x, width)) / width);
        Sounds_SoundPlayer.setMainVolumeToStore();
        this._updateGroupMainVolume();
    }
    private _onTouchEndGroupMainVolume(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchReleaseOutsideGroupMainVolume(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupMainMute(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        Sounds_SoundPlayer.setIsMainMute(!Sounds_SoundPlayer.getIsMainMute());
        Sounds_SoundPlayer.setIsMainMuteToStore();
        this._updateGroupMainMute();
    }

    private _onTouchedGroupBgmVolume(e: Egret_Egret.Event): void {
        const width = this._groupBgmVolume.getScaledWidth();
        const data  = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const point = this._groupBgmVolume.globalToLocal(data.stageX, data.stageY);
        Sounds_SoundPlayer.setBgmVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupBgmVolume();
    }
    private _onTouchMoveGroupBgmVolume(e: Egret_Egret.Event): void {
        const width = this._groupBgmVolume.getScaledWidth();
        const data  = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const point = this._groupBgmVolume.globalToLocal(data.stageX, data.stageY);
        Sounds_SoundPlayer.setBgmVolume(Math.max(0, Math.min(point.x, width)) / width);
        Sounds_SoundPlayer.setBgmVolumeToStore();
        this._updateGroupBgmVolume();
    }
    private _onTouchedGroupBgmMute(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        Sounds_SoundPlayer.setIsBgmMute(!Sounds_SoundPlayer.getIsBgmMute());
        Sounds_SoundPlayer.setIsBgmMuteToStore();
        this._updateGroupBgmMute();
    }

    private _onTouchedGroupEffectVolume(e: Egret_Egret.Event): void {
        const width = this._groupEffectVolume.getScaledWidth();
        const data  = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const point = this._groupEffectVolume.globalToLocal(data.stageX, data.stageY);
        Sounds_SoundPlayer.setEffectVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupEffectVolume();
    }
    private _onTouchMoveGroupEffectVolume(e: Egret_Egret.Event): void {
        const width = this._groupEffectVolume.getScaledWidth();
        const data  = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const point = this._groupEffectVolume.globalToLocal(data.stageX, data.stageY);
        Sounds_SoundPlayer.setEffectVolume(Math.max(0, Math.min(point.x, width)) / width);
        Sounds_SoundPlayer.setEffectVolumeToStore();
        this._updateGroupEffectVolume();
    }
    private _onTouchEndGroupEffectVolume(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchReleaseOutsideGroupEffectVolume(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupEffectMute(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        Sounds_SoundPlayer.setIsEffectMute(!Sounds_SoundPlayer.getIsEffectMute());
        Sounds_SoundPlayer.setIsEffectMuteToStore();
        this._updateGroupEffectMute();
    }

    private async _onTouchedBtnSwitchBgm(): Promise<void> {
        // await SoundManager.playPreviousBgm();
        // this._updateLabelBgmName();

        const currentBgmCode = Sounds_SoundPlayer.getPlayingBgmCode();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : await GameConfigs_Provider.getLatestGameConfig(),
            currentBgmCode      : currentBgmCode,
            callbackOnConfirm   : code => {
                Helpers_GameFlow.getOngoingWar()?.setOverridingBgmCode(code);
            },
            callbackOnCancel    : () => {
                Sounds_SoundPlayer.playBgm(currentBgmCode);
            }
        });
    }

    private async _onTouchedBtnCoBgmSettings(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetCoBgmSettingsPanel, {
            gameConfig  : await GameConfigs_Provider.getLatestGameConfig(),
        });
    }

    private async _onTouchedBtnSceneBgmSettings(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSceneBgmSettingsPanel, {
            gameConfig  : await GameConfigs_Provider.getLatestGameConfig(),
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0540);
        this._labelMainTitle.setLangText(Lang_Constants.TextType.B1325);
        this._labelBgmTitle.setLangText(Lang_Constants.TextType.B0541);
        this._labelEffectTitle.setLangText(Lang_Constants.TextType.B0542);
        this._labelSwitchBgm.setLangText(Lang_Constants.TextType.B1281);
        this._labelCoBgmSettings.setLangText(Lang_Constants.TextType.B1286);
        this._btnCoBgmSettings.setLangText(Lang_Constants.TextType.B0425);
        this._btnSceneBgmSettings.setLangText(Lang_Constants.TextType.B1287);

        this._layoutMain.arrangeItems();
        this._layoutBgm.arrangeItems();
        this._layoutEffect.arrangeItems();
        this._layoutCoBgm.arrangeItems();
        this._layoutSwitchBgm.arrangeItems();
        this._layoutContent.arrangeItems();
        this._updateBtnSwitchBgm();
    }

    private _updateGroupMainMute(): void {
        this._imgMainMute.loadSource(Sounds_SoundPlayer.getIsMainMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupBgmMute(): void {
        this._imgBgmMute.loadSource(Sounds_SoundPlayer.getIsBgmMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupEffectMute(): void {
        this._imgEffectMute.loadSource(Sounds_SoundPlayer.getIsEffectMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupMainVolume(): void {
        const volume    = Sounds_SoundPlayer.getMainVolume();
        const pos       = this._groupMainVolume.getScaledWidth() * volume;
        this._imgMainPoint.setX(pos);
        this._imgMainBar.setUnscaledManualWidth(pos);
        this._labelMainVolume.setText(`${Math.floor(volume * 100)}`);
    }
    private _updateGroupBgmVolume(): void {
        const volume    = Sounds_SoundPlayer.getBgmVolume();
        const pos       = this._groupBgmVolume.getScaledWidth() * volume;
        this._imgBgmPoint.setX(pos);
        this._imgBgmBar.setUnscaledManualWidth(pos);
        this._labelBgmVolume.setText(`${Math.floor(volume * 100)}`);
    }
    private _updateGroupEffectVolume(): void {
        const volume    = Sounds_SoundPlayer.getEffectVolume();
        const pos       = this._groupEffectVolume.getScaledWidth() * volume;
        this._imgEffectPoint.setX(pos);
        this._imgEffectBar.setUnscaledManualWidth(pos);
        this._labelEffectVolume.setText(`${Math.floor(volume * 100)}`);
    }

    private _updateBtnCoBgmSettings(): void {
        this._btnCoBgmSettings.setIsVisible(Users_Model.getSelfUserId() != null);
    }
    private async _updateBtnSwitchBgm(): Promise<void> {
        this._btnSwitchBgm.setText(Lang_Utils.getBgmSfxName(Sounds_SoundPlayer.getPlayingBgmCode(), await GameConfigs_Provider.getLatestGameConfig()) ?? `--`);
    }
}
