import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getOngoingWar } from "../../helpers/GameFlow.ts";
import {
    PointerEventType,
    type PointerUnifiedEventData,
} from "../../helpers/PointerInput.ts";
import { TextType } from "../../lang/Constants.ts";
import { getBgmSfxName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../Constants.ts";
import {
    setMainVolume,
    setMainVolumeToStore,
    playShortSfx,
    setIsMainMute,
    getIsMainMute,
    setIsMainMuteToStore,
    setBgmVolume,
    setBgmVolumeToStore,
    setIsBgmMute,
    getIsBgmMute,
    setIsBgmMuteToStore,
    setEffectVolume,
    setEffectVolumeToStore,
    setIsEffectMute,
    getIsEffectMute,
    setIsEffectMuteToStore,
    getPlayingBgmCode,
    playBgm,
    getMainVolume,
    getBgmVolume,
    getEffectVolume,
} from "../SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getSelfUserId } from "../../users/Model.ts";
import type { Event } from "../../egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _layoutContent!        : IUiLayout;
    private readonly _layoutMain!           : IUiLayout;
    private readonly _labelMainTitle!       : IUiLabel;
    private readonly _imgMainMute!          : IUiImage;
    private readonly _groupMainVolume!      : IUiContainer;
    private readonly _imgMainBar!           : IUiImage;
    private readonly _imgMainPoint!         : IUiImage;
    private readonly _labelMainVolume!      : IUiLabel;

    private readonly _layoutBgm!            : IUiLayout;
    private readonly _labelBgmTitle!        : IUiLabel;
    private readonly _imgBgmMute!           : IUiImage;
    private readonly _groupBgmVolume!       : IUiContainer;
    private readonly _imgBgmBar!            : IUiImage;
    private readonly _imgBgmPoint!          : IUiImage;
    private readonly _labelBgmVolume!       : IUiLabel;

    private readonly _layoutEffect!         : IUiLayout;
    private readonly _labelEffectTitle!     : IUiLabel;
    private readonly _imgEffectMute!        : IUiImage;
    private readonly _groupEffectVolume!    : IUiContainer;
    private readonly _imgEffectBar!         : IUiImage;
    private readonly _imgEffectPoint!       : IUiImage;
    private readonly _labelEffectVolume!    : IUiLabel;

    private readonly _layoutCoBgm!          : IUiLayout;
    private readonly _labelSwitchBgm!       : IUiLabel;
    private readonly _btnSwitchBgm!         : IUiButton;

    private readonly _layoutSwitchBgm!      : IUiLayout;
    private readonly _labelCoBgmSettings!   : IUiLabel;
    private readonly _btnCoBgmSettings!     : IUiButton;
    private readonly _btnSceneBgmSettings!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.SoundManagerPlayingBgmCodeChanged,   callback: this._onNotifySoundManagerPlayingBgmCodeChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },

            { ui: this._groupMainVolume,        callback: this._onTouchedGroupMainVolume },
            { ui: this._groupMainVolume,        callback: this._onTouchMoveGroupMainVolume,             eventType: PointerEventType.PressMove },
            { ui: this._groupMainVolume,        callback: this._onTouchEndGroupMainVolume,              eventType: PointerEventType.ReleaseIn },
            { ui: this._groupMainVolume,        callback: this._onTouchReleaseOutsideGroupMainVolume,   eventType: PointerEventType.ReleaseOut },
            { ui: this._imgMainMute,            callback: this._onTouchedGroupMainMute },

            { ui: this._groupBgmVolume,         callback: this._onTouchedGroupBgmVolume },
            { ui: this._groupBgmVolume,         callback: this._onTouchMoveGroupBgmVolume,              eventType: PointerEventType.PressMove },
            { ui: this._imgBgmMute,             callback: this._onTouchedGroupBgmMute },

            { ui: this._groupEffectVolume,      callback: this._onTouchedGroupEffectVolume },
            { ui: this._groupEffectVolume,      callback: this._onTouchMoveGroupEffectVolume,           eventType: PointerEventType.PressMove },
            { ui: this._groupEffectVolume,      callback: this._onTouchEndGroupEffectVolume,            eventType: PointerEventType.ReleaseIn },
            { ui: this._groupEffectVolume,      callback: this._onTouchReleaseOutsideGroupEffectVolume, eventType: PointerEventType.ReleaseOut },
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

    private _onTouchedGroupMainVolume(e: Event): void {
        const width = this._groupMainVolume.getScaledWidth();
        const data  = e.data as PointerUnifiedEventData;
        const point = this._groupMainVolume.globalToLocal(data.stageX, data.stageY);
        setMainVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupMainVolume();
    }
    private _onTouchMoveGroupMainVolume(e: Event): void {
        const width = this._groupMainVolume.getScaledWidth();
        const data  = e.data as PointerUnifiedEventData;
        const point = this._groupMainVolume.globalToLocal(data.stageX, data.stageY);
        setMainVolume(Math.max(0, Math.min(point.x, width)) / width);
        setMainVolumeToStore();
        this._updateGroupMainVolume();
    }
    private _onTouchEndGroupMainVolume(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchReleaseOutsideGroupMainVolume(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupMainMute(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        setIsMainMute(!getIsMainMute());
        setIsMainMuteToStore();
        this._updateGroupMainMute();
    }

    private _onTouchedGroupBgmVolume(e: Event): void {
        const width = this._groupBgmVolume.getScaledWidth();
        const data  = e.data as PointerUnifiedEventData;
        const point = this._groupBgmVolume.globalToLocal(data.stageX, data.stageY);
        setBgmVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupBgmVolume();
    }
    private _onTouchMoveGroupBgmVolume(e: Event): void {
        const width = this._groupBgmVolume.getScaledWidth();
        const data  = e.data as PointerUnifiedEventData;
        const point = this._groupBgmVolume.globalToLocal(data.stageX, data.stageY);
        setBgmVolume(Math.max(0, Math.min(point.x, width)) / width);
        setBgmVolumeToStore();
        this._updateGroupBgmVolume();
    }
    private _onTouchedGroupBgmMute(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        setIsBgmMute(!getIsBgmMute());
        setIsBgmMuteToStore();
        this._updateGroupBgmMute();
    }

    private _onTouchedGroupEffectVolume(e: Event): void {
        const width = this._groupEffectVolume.getScaledWidth();
        const data  = e.data as PointerUnifiedEventData;
        const point = this._groupEffectVolume.globalToLocal(data.stageX, data.stageY);
        setEffectVolume(Math.max(0, Math.min(point.x, width)) / width);
        this._updateGroupEffectVolume();
    }
    private _onTouchMoveGroupEffectVolume(e: Event): void {
        const width = this._groupEffectVolume.getScaledWidth();
        const data  = e.data as PointerUnifiedEventData;
        const point = this._groupEffectVolume.globalToLocal(data.stageX, data.stageY);
        setEffectVolume(Math.max(0, Math.min(point.x, width)) / width);
        setEffectVolumeToStore();
        this._updateGroupEffectVolume();
    }
    private _onTouchEndGroupEffectVolume(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchReleaseOutsideGroupEffectVolume(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupEffectMute(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        setIsEffectMute(!getIsEffectMute());
        setIsEffectMuteToStore();
        this._updateGroupEffectMute();
    }

    private async _onTouchedBtnSwitchBgm(): Promise<void> {
        // await SoundManager.playPreviousBgm();
        // this._updateLabelBgmName();

        const currentBgmCode = getPlayingBgmCode();
        openPanel(getDict().SoundsChooseSingleBgmPanel, {
            gameConfig          : await getLatestGameConfig(),
            currentBgmCode      : currentBgmCode,
            callbackOnConfirm   : code => {
                getOngoingWar()?.setOverridingBgmCode(code);
            },
            callbackOnCancel    : () => {
                playBgm(currentBgmCode);
            }
        });
    }

    private async _onTouchedBtnCoBgmSettings(): Promise<void> {
        openPanel(getDict().UserSetCoBgmSettingsPanel, {
            gameConfig  : await getLatestGameConfig(),
        });
    }

    private async _onTouchedBtnSceneBgmSettings(): Promise<void> {
        openPanel(getDict().UserSceneBgmSettingsPanel, {
            gameConfig  : await getLatestGameConfig(),
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
        this._labelTitle.setLangText(TextType.B0540);
        this._labelMainTitle.setLangText(TextType.B1325);
        this._labelBgmTitle.setLangText(TextType.B0541);
        this._labelEffectTitle.setLangText(TextType.B0542);
        this._labelSwitchBgm.setLangText(TextType.B1281);
        this._labelCoBgmSettings.setLangText(TextType.B1286);
        this._btnCoBgmSettings.setLangText(TextType.B0425);
        this._btnSceneBgmSettings.setLangText(TextType.B1287);

        this._layoutMain.arrangeItems();
        this._layoutBgm.arrangeItems();
        this._layoutEffect.arrangeItems();
        this._layoutCoBgm.arrangeItems();
        this._layoutSwitchBgm.arrangeItems();
        this._layoutContent.arrangeItems();
        this._updateBtnSwitchBgm();
    }

    private _updateGroupMainMute(): void {
        this._imgMainMute.loadSource(getIsMainMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupBgmMute(): void {
        this._imgBgmMute.loadSource(getIsBgmMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupEffectMute(): void {
        this._imgEffectMute.loadSource(getIsEffectMute() ? "commonIconSound0001" : "commonIconSound0000");
    }
    private _updateGroupMainVolume(): void {
        const volume    = getMainVolume();
        const pos       = this._groupMainVolume.getScaledWidth() * volume;
        this._imgMainPoint.setX(pos);
        this._imgMainBar.setUnscaledManualWidth(pos);
        this._labelMainVolume.setText(`${Math.floor(volume * 100)}`);
    }
    private _updateGroupBgmVolume(): void {
        const volume    = getBgmVolume();
        const pos       = this._groupBgmVolume.getScaledWidth() * volume;
        this._imgBgmPoint.setX(pos);
        this._imgBgmBar.setUnscaledManualWidth(pos);
        this._labelBgmVolume.setText(`${Math.floor(volume * 100)}`);
    }
    private _updateGroupEffectVolume(): void {
        const volume    = getEffectVolume();
        const pos       = this._groupEffectVolume.getScaledWidth() * volume;
        this._imgEffectPoint.setX(pos);
        this._imgEffectBar.setUnscaledManualWidth(pos);
        this._labelEffectVolume.setText(`${Math.floor(volume * 100)}`);
    }

    private _updateBtnCoBgmSettings(): void {
        this._btnCoBgmSettings.setIsVisible(getSelfUserId() != null);
    }
    private async _updateBtnSwitchBgm(): Promise<void> {
        this._btnSwitchBgm.setText(getBgmSfxName(getPlayingBgmCode(), await getLatestGameConfig()) ?? `--`);
    }
}
