import {
    GamePanels_Dict,
    Helpers_Misc,
    MultiMatchRoom_Model_MmrModel,
    Lang_Utils,
    MultiRankedWars_Constants,
    GamePanels_Manager,
    Helpers_PointerInput,
    MultiMatchRoom_Model_MmrProxy,
    Lang_Constants,
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
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutStd!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelStdTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupStd!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgStdBar!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgStdPoint!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _layoutStdCount!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelStdCount!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStdMaxCount! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutFog!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelFogTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupFog!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgFogBar!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgFogPoint!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _layoutFogCount!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelFogCount!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFogMaxCount! : Ui_Interfaces_IUiLabel.IUiLabel;

    private _selectedCountForStd?       : number;
    private _selectedCountForFog?       : number;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                callback : this._onNotifyLanguageChanged },
            { type : "MsgMmrGetMaxConcurrentCount",    callback : this._onMsgMmrGetMaxConcurrentCount },
            { type : "MsgMmrSetMaxConcurrentCount",    callback : this._onMsgMmrSetMaxConcurrentCount },
        ]);
        this._setUiListenerArray([
            { ui : this._groupStd,       callback : this._onTouchedGroupStd },
            { ui : this._groupStd,       callback : this._onTouchMoveGroupStd,            eventType : Helpers_PointerInput.PointerEventType.PressMove },
            { ui : this._groupStd,       callback : this._onTouchEndGroupStd,             eventType : Helpers_PointerInput.PointerEventType.ReleaseIn },
            { ui : this._groupStd,       callback : this._onTouchReleaseOutsideGroupStd,  eventType : Helpers_PointerInput.PointerEventType.ReleaseOut },

            { ui : this._groupFog,       callback : this._onTouchedGroupFog },
            { ui : this._groupFog,       callback : this._onTouchMoveGroupFog,            eventType : Helpers_PointerInput.PointerEventType.PressMove },
            { ui : this._groupFog,       callback : this._onTouchEndGroupFog,             eventType : Helpers_PointerInput.PointerEventType.ReleaseIn },
            { ui : this._groupFog,       callback : this._onTouchReleaseOutsideGroupFog,  eventType : Helpers_PointerInput.PointerEventType.ReleaseOut },

            { ui : this._btnCancel,      callback : this.closePanel },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
            { ui : this._btnHelp,        callback : this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._labelStdMaxCount.setText(` / ${MultiRankedWars_Constants.Common.MaxConcurrentCount}`);
        this._labelFogMaxCount.setText(` / ${MultiRankedWars_Constants.Common.MaxConcurrentCount}`);
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

    private _onTouchedGroupStd(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const group                 = this._groupStd;
        const width                 = group.getUnscaledWidth();
        const data                  = Helpers_Misc.getExisted(e.data);
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForStd           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWars_Constants.Common.MaxConcurrentCount - MultiRankedWars_Constants.Common.MinConcurrentCount)) + MultiRankedWars_Constants.Common.MinConcurrentCount;
        this._selectedCountForStd   = countForStd;
        this._updateGroupStd();

        this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, MultiRankedWars_Constants.Common.MaxConcurrentCount - countForStd);
        this._updateGroupFog();
    }
    private _onTouchMoveGroupStd(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const group                 = this._groupStd;
        const width                 = group.getUnscaledWidth();
        const data                  = Helpers_Misc.getExisted(e.data);
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForStd           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWars_Constants.Common.MaxConcurrentCount - MultiRankedWars_Constants.Common.MinConcurrentCount)) + MultiRankedWars_Constants.Common.MinConcurrentCount;
        this._selectedCountForStd   = countForStd;
        this._updateGroupStd();

        this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, MultiRankedWars_Constants.Common.MaxConcurrentCount - countForStd);
        this._updateGroupFog();
    }
    private _onTouchEndGroupStd(): void {
        // nothing to do
    }
    private _onTouchReleaseOutsideGroupStd(): void {
        // nothing to do
    }

    private _onTouchedGroupFog(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const group                 = this._groupFog;
        const width                 = group.getUnscaledWidth();
        const data                  = Helpers_Misc.getExisted(e.data);
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForFog           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWars_Constants.Common.MaxConcurrentCount - MultiRankedWars_Constants.Common.MinConcurrentCount)) + MultiRankedWars_Constants.Common.MinConcurrentCount;
        this._selectedCountForFog   = countForFog;
        this._updateGroupFog();

        this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, MultiRankedWars_Constants.Common.MaxConcurrentCount - countForFog);
        this._updateGroupStd();
    }
    private _onTouchMoveGroupFog(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        const group                 = this._groupFog;
        const width                 = group.getUnscaledWidth();
        const data                  = Helpers_Misc.getExisted(e.data);
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForFog           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWars_Constants.Common.MaxConcurrentCount - MultiRankedWars_Constants.Common.MinConcurrentCount)) + MultiRankedWars_Constants.Common.MinConcurrentCount;
        this._selectedCountForFog   = countForFog;
        this._updateGroupFog();

        this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, MultiRankedWars_Constants.Common.MaxConcurrentCount - countForFog);
        this._updateGroupStd();
    }
    private _onTouchEndGroupFog(): void {
        // nothing to do
    }
    private _onTouchReleaseOutsideGroupFog(): void {
        // nothing to do
    }

    private _onTouchedBtnConfirm(): void {
        MultiMatchRoom_Model_MmrProxy.reqMmrSetMaxConcurrentCount(Helpers_Misc.getExisted(this._selectedCountForStd), Helpers_Misc.getExisted(this._selectedCountForFog));

        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0400),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _loadMaxCountAndUpdateView(): void {
        this._selectedCountForStd = MultiMatchRoom_Model_MmrModel.getMaxConcurrentCount(false);
        this._selectedCountForFog = MultiMatchRoom_Model_MmrModel.getMaxConcurrentCount(true);
        this._updateGroupStd();
        this._updateGroupFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0413);
        this._labelStdTitle.setLangText(Lang_Constants.TextType.B0548);
        this._labelFogTitle.setLangText(Lang_Constants.TextType.B0549);

        this._layoutStdCount.arrangeItems();
        this._layoutStd.arrangeItems();
        this._layoutFogCount.arrangeItems();
        this._layoutFog.arrangeItems();
    }

    private _updateGroupStd(): void {
        const count = Helpers_Misc.getExisted(this._selectedCountForStd);
        const pos   = this._groupStd.getUnscaledWidth() * (count - MultiRankedWars_Constants.Common.MinConcurrentCount) / (MultiRankedWars_Constants.Common.MaxConcurrentCount - MultiRankedWars_Constants.Common.MinConcurrentCount);
        this._imgStdPoint.setX(pos);
        this._imgStdBar.setUnscaledManualWidth(pos);
        this._labelStdCount.setText(`${count}`);
        this._layoutStdCount.arrangeItems();
    }
    private _updateGroupFog(): void {
        const count = Helpers_Misc.getExisted(this._selectedCountForFog);
        const pos   = this._groupFog.getUnscaledWidth() * (count - MultiRankedWars_Constants.Common.MinConcurrentCount) / (MultiRankedWars_Constants.Common.MaxConcurrentCount - MultiRankedWars_Constants.Common.MinConcurrentCount);
        this._imgFogPoint.setX(pos);
        this._imgFogBar.setUnscaledManualWidth(pos);
        this._labelFogCount.setText(`${count}`);
        this._layoutFogCount.arrangeItems();
    }
}
