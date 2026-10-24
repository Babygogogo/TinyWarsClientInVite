import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiMatchRoomModelMmrModel from "../model/MmrModel.ts";
import * as MultiMatchRoomModelMmrProxy from "../model/MmrProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutStd!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStdTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupStd!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgStdBar!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgStdPoint!      : UiInterfacesIUiImage.IUiImage;
    private readonly _layoutStdCount!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStdCount!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdMaxCount! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutFog!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFogTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupFog!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgFogBar!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgFogPoint!      : UiInterfacesIUiImage.IUiImage;
    private readonly _layoutFogCount!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFogCount!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFogMaxCount! : UiInterfacesIUiLabel.IUiLabel;

    private _selectedCountForStd?       : number;
    private _selectedCountForFog?       : number;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmrGetMaxConcurrentCount,    callback: this._onMsgMmrGetMaxConcurrentCount },
            { type: NotificationsTypeId.TypeId.MsgMmrSetMaxConcurrentCount,    callback: this._onMsgMmrSetMaxConcurrentCount },
        ]);
        this._setUiListenerArray([
            { ui: this._groupStd,       callback: this._onTouchedGroupStd },
            { ui: this._groupStd,       callback: this._onTouchMoveGroupStd,            eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._groupStd,       callback: this._onTouchEndGroupStd,             eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupStd,       callback: this._onTouchReleaseOutsideGroupStd,  eventType: HelpersPointerInput.PointerEventType.ReleaseOut },

            { ui: this._groupFog,       callback: this._onTouchedGroupFog },
            { ui: this._groupFog,       callback: this._onTouchMoveGroupFog,            eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._groupFog,       callback: this._onTouchEndGroupFog,             eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupFog,       callback: this._onTouchReleaseOutsideGroupFog,  eventType: HelpersPointerInput.PointerEventType.ReleaseOut },

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
    private _onMsgMmrGetMaxConcurrentCount(): void {
        this._loadMaxCountAndUpdateView();
    }
    private _onMsgMmrSetMaxConcurrentCount(): void {
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

    private _onTouchedBtnConfirm(): void {
        MultiMatchRoomModelMmrProxy.reqMmrSetMaxConcurrentCount(HelpersMisc.getExisted(this._selectedCountForStd), HelpersMisc.getExisted(this._selectedCountForFog));

        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0400),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _loadMaxCountAndUpdateView(): void {
        this._selectedCountForStd = MultiMatchRoomModelMmrModel.getMaxConcurrentCount(false);
        this._selectedCountForFog = MultiMatchRoomModelMmrModel.getMaxConcurrentCount(true);
        this._updateGroupStd();
        this._updateGroupFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0413));
        this._labelStdTitle.setText(LangUtils.getText(LangConstants.TextType.B0548));
        this._labelFogTitle.setText(LangUtils.getText(LangConstants.TextType.B0549));

        this._layoutStdCount.arrangeItems();
        this._layoutStd.arrangeItems();
        this._layoutFogCount.arrangeItems();
        this._layoutFog.arrangeItems();
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
