import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiRankRoomModelMrrModel from "../model/MrrModel.ts";
import * as MultiRankRoomModelMrrProxy from "../model/MrrProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!                   : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutContent!                : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutStd!                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStdTitle!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupStd!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgStdBar!                    : UiInterfacesIUiImage.IUiImage;
    private readonly _imgStdPoint!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _layoutStdCount!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStdCount!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdMaxCount!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupStdIncreaseOffsetScore!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStdIncreaseOffsetScore!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgStdIncreaseOffsetScore!    : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutFog!                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFogTitle!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupFog!                     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgFogBar!                    : UiInterfacesIUiImage.IUiImage;
    private readonly _imgFogPoint!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _layoutFogCount!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFogCount!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFogMaxCount!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupFogIncreaseOffsetScore!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFogIncreaseOffsetScore!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgFogIncreaseOffsetScore!    : UiInterfacesIUiImage.IUiImage;

    private _selectedCountForStd?                   : number;
    private _selectedCountForFog?                   : number;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMrrGetMaxConcurrentCount,    callback: this._onMsgMrrGetMaxConcurrentCount },
            { type: NotificationsTypeId.TypeId.MsgMrrSetMaxConcurrentCount,    callback: this._onMsgMrrSetMaxConcurrentCount },
        ]);
        this._setUiListenerArray([
            { ui: this._groupStd,                       callback: this._onTouchedGroupStd },
            { ui: this._groupStd,                       callback: this._onTouchMoveGroupStd,                    eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._groupStd,                       callback: this._onTouchEndGroupStd,                     eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupStd,                       callback: this._onTouchReleaseOutsideGroupStd,          eventType: HelpersPointerInput.PointerEventType.ReleaseOut },
            { ui: this._groupStdIncreaseOffsetScore,    callback: this._onTouchedGroupStdIncreaseOffsetScore },

            { ui: this._groupFog,                       callback: this._onTouchedGroupFog },
            { ui: this._groupFog,                       callback: this._onTouchMoveGroupFog,                    eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._groupFog,                       callback: this._onTouchEndGroupFog,                     eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupFog,                       callback: this._onTouchReleaseOutsideGroupFog,          eventType: HelpersPointerInput.PointerEventType.ReleaseOut },
            { ui: this._groupFogIncreaseOffsetScore,    callback: this._onTouchedGroupFogIncreaseOffsetScore },

            { ui: this._btnCancel,      callback: this.closePanel },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._labelStdMaxCount.setText(` / ${GameConfigGcWar.MultiRankedWar.MaxConcurrentCount}`);
        this._labelFogMaxCount.setText(` / ${GameConfigGcWar.MultiRankedWar.MaxConcurrentCount}`);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._loadMaxCountAndUpdateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgMrrGetMaxConcurrentCount(): void {
        this._loadMaxCountAndUpdateView();
    }
    private _onMsgMrrSetMaxConcurrentCount(): void {
        this._loadMaxCountAndUpdateView();
    }

    private _onTouchedGroupStd(e: VendorEgretEgret.Event): void {
        const group                 = this._groupStd;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForStd           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - GameConfigGcWar.MultiRankedWar.MinConcurrentCount)) + GameConfigGcWar.MultiRankedWar.MinConcurrentCount;
        this._selectedCountForStd   = countForStd;
        this._updateGroupStd();

        this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - countForStd);
        this._updateGroupFog();
    }
    private _onTouchMoveGroupStd(e: VendorEgretEgret.Event): void {
        const group                 = this._groupStd;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForStd           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - GameConfigGcWar.MultiRankedWar.MinConcurrentCount)) + GameConfigGcWar.MultiRankedWar.MinConcurrentCount;
        this._selectedCountForStd   = countForStd;
        this._updateGroupStd();

        this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - countForStd);
        this._updateGroupFog();
    }
    private _onTouchEndGroupStd(): void {
        // nothing to do
    }
    private _onTouchReleaseOutsideGroupStd(): void {
        // nothing to do
    }
    private _onTouchedGroupStdIncreaseOffsetScore(): void {
        const img = this._imgStdIncreaseOffsetScore;
        img.setIsVisible(!img.getIsVisible());
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupFog(e: VendorEgretEgret.Event): void {
        const group                 = this._groupFog;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForFog           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - GameConfigGcWar.MultiRankedWar.MinConcurrentCount)) + GameConfigGcWar.MultiRankedWar.MinConcurrentCount;
        this._selectedCountForFog   = countForFog;
        this._updateGroupFog();

        this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - countForFog);
        this._updateGroupStd();
    }
    private _onTouchMoveGroupFog(e: VendorEgretEgret.Event): void {
        const group                 = this._groupFog;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForFog           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - GameConfigGcWar.MultiRankedWar.MinConcurrentCount)) + GameConfigGcWar.MultiRankedWar.MinConcurrentCount;
        this._selectedCountForFog   = countForFog;
        this._updateGroupFog();

        this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - countForFog);
        this._updateGroupStd();
    }
    private _onTouchEndGroupFog(): void {
        // nothing to do
    }
    private _onTouchReleaseOutsideGroupFog(): void {
        // nothing to do
    }
    private _onTouchedGroupFogIncreaseOffsetScore(): void {
        const img = this._imgFogIncreaseOffsetScore;
        img.setIsVisible(!img.getIsVisible());
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnConfirm(): void {
        MultiRankRoomModelMrrProxy.reqMrrSetMaxConcurrentCount({
            maxCountForStd                          : HelpersMisc.getExisted(this._selectedCountForStd),
            maxCountForFog                          : HelpersMisc.getExisted(this._selectedCountForFog),
            additionalMaxDifferenceInScoreForStd    : this._imgStdIncreaseOffsetScore.getIsVisible() ? GameConfigGcWar.MultiRankedWar.MaxAdditionalOffsetScoreForMatching: 0,
            additionalMaxDifferenceInScoreForFog    : this._imgFogIncreaseOffsetScore.getIsVisible() ? GameConfigGcWar.MultiRankedWar.MaxAdditionalOffsetScoreForMatching: 0,
        });

        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0132),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _loadMaxCountAndUpdateView(): void {
        this._selectedCountForStd   = MultiRankRoomModelMrrModel.getMaxConcurrentCount(false);
        this._selectedCountForFog   = MultiRankRoomModelMrrModel.getMaxConcurrentCount(true);
        this._imgStdIncreaseOffsetScore.setIsVisible(MultiRankRoomModelMrrModel.getAdditionalMaxDifferenceInScore(false) > 0);
        this._imgFogIncreaseOffsetScore.setIsVisible(MultiRankRoomModelMrrModel.getAdditionalMaxDifferenceInScore(true) > 0);
        this._updateGroupStd();
        this._updateGroupFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0413));
        this._labelStdTitle.setText(LangUtils.getText(LangConstants.TextType.B0548));
        this._labelFogTitle.setText(LangUtils.getText(LangConstants.TextType.B0549));
        this._labelStdIncreaseOffsetScore.setText(LangUtils.getText(LangConstants.TextType.B1363));
        this._labelFogIncreaseOffsetScore.setText(LangUtils.getText(LangConstants.TextType.B1363));

        this._layoutStdCount.arrangeItems();
        this._groupStdIncreaseOffsetScore.arrangeItems();
        this._layoutStd.arrangeItems();
        this._layoutFogCount.arrangeItems();
        this._groupFogIncreaseOffsetScore.arrangeItems();
        this._layoutFog.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateGroupStd(): void {
        const count = HelpersMisc.getExisted(this._selectedCountForStd);
        const pos   = this._groupStd.getUnscaledWidth() * (count - GameConfigGcWar.MultiRankedWar.MinConcurrentCount) / (GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - GameConfigGcWar.MultiRankedWar.MinConcurrentCount);
        this._imgStdPoint.setX(pos);
        this._imgStdBar.setUnscaledManualWidth(pos);
        this._labelStdCount.setText(`${count}`);
        this._layoutStdCount.arrangeItems();
    }
    private _updateGroupFog(): void {
        const count = HelpersMisc.getExisted(this._selectedCountForFog);
        const pos   = this._groupFog.getUnscaledWidth() * (count - GameConfigGcWar.MultiRankedWar.MinConcurrentCount) / (GameConfigGcWar.MultiRankedWar.MaxConcurrentCount - GameConfigGcWar.MultiRankedWar.MinConcurrentCount);
        this._imgFogPoint.setX(pos);
        this._imgFogBar.setUnscaledManualWidth(pos);
        this._labelFogCount.setText(`${count}`);
        this._layoutFogCount.arrangeItems();
    }
}
