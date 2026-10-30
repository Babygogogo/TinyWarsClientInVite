import {
    Utils_ClientErrorCode,
    GamePanels_Manager,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Helpers_PointerInput,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type ReplayWar_Interface_IRwWarBase,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface OpenData {
    war: ReplayWar_Interface_IRwWarBase.IRwWarBase;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutProgress!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTarget!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupProgress!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgProgressBar!   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgProgressPoint! : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _btnFirst!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLast!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private _allCheckpointInfoArray?    : AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointInfo[];
    private _selectedCheckpointId?      : number;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupProgress,     callback: this._onTouchedGroupProgress },
            { ui: this._groupProgress,     callback: this._onTouchMoveGroupProgress,            eventType: Helpers_PointerInput.PointerEventType.PressMove },
            { ui: this._groupProgress,     callback: this._onTouchEndGroupProgress,             eventType: Helpers_PointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupProgress,     callback: this._onTouchReleaseOutsideGroupProgress,  eventType: Helpers_PointerInput.PointerEventType.ReleaseOut },

            { ui: this._btnCancel,      callback: this.closePanel },
            { ui: this._btnFirst,       callback: this._onTouchedBtnFirst },
            { ui: this._btnLast,        callback: this._onTouchedBtnLast },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const allCheckpointInfoArray    = war.getAllCheckpointInfoArray();
        const nextActionId              = war.getNextOperationId();
        const nextCheckpointId          = allCheckpointInfoArray.findIndex(v => v.nextOperationId > nextActionId);
        this._allCheckpointInfoArray    = allCheckpointInfoArray;
        this._selectedCheckpointId      = nextCheckpointId >= 0 ? Math.max(nextCheckpointId - 1, 0) : allCheckpointInfoArray.length - 1;

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // callbacks
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupProgress(e: Egret_Egret.Event): void {
        const data              = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const group             = this._groupProgress;
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const width             = group.getUnscaledWidth();
        const minCheckpointId   = this._getMinCheckpointId();
        const checkpointId      = Math.round(Math.max(0, Math.min(point.x, width)) / width * (this._getMaxCheckpointId() - minCheckpointId)) + minCheckpointId;
        this._setSelectedCheckpointId(checkpointId);
        this._updateGroupProgress();
        this._updateLabelTarget();
    }
    private _onTouchMoveGroupProgress(e: Egret_Egret.Event): void {
        const data              = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const group             = this._groupProgress;
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const width             = group.getUnscaledWidth();
        const minCheckpointId   = this._getMinCheckpointId();
        const checkpointId      = Math.round(Math.max(0, Math.min(point.x, width)) / width * (this._getMaxCheckpointId() - minCheckpointId)) + minCheckpointId;
        this._setSelectedCheckpointId(checkpointId);
        this._updateGroupProgress();
        this._updateLabelTarget();
    }
    private _onTouchEndGroupProgress(): void {
        // nothing to do
    }
    private _onTouchReleaseOutsideGroupProgress(): void {
        // nothing to do
    }
    private _onTouchedBtnFirst(): void {
        this._setSelectedCheckpointId(this._getMinCheckpointId());
        this._updateGroupProgress();
        this._updateLabelTarget();
    }
    private _onTouchedBtnLast(): void {
        this._setSelectedCheckpointId(this._getMaxCheckpointId());
        this._updateGroupProgress();
        this._updateLabelTarget();
    }
    private async _onTouchedBtnConfirm(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
            title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
            content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
        });
        await this.getOpenData()?.war.loadCheckpoint(this._getSelectedCheckpointId());
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupProgress();
        this._updateLabelTarget();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0712);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);

        this._updateLabelTarget();
    }

    private _updateGroupProgress(): void {
        const checkpointId      = this._getSelectedCheckpointId();
        const minCheckpointId   = this._getMinCheckpointId();
        const width             = this._groupProgress.getUnscaledWidth();
        const pos               = width * (checkpointId - minCheckpointId) / (this._getMaxCheckpointId() - minCheckpointId);
        this._imgProgressPoint.setX(pos);
        this._imgProgressBar.setUnscaledManualWidth(pos);
    }
    private _updateLabelTarget(): void {
        const checkpointInfo = Helpers_Misc.getExisted(this._allCheckpointInfoArray, Utils_ClientErrorCode.ClientErrorCode.RwReplayProgressPanel_UpdateGroupProgress_00)[this._getSelectedCheckpointId()];
        this._labelTarget.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0191)}${checkpointInfo.turnIndex}  P${checkpointInfo.playerIndex}  ${Lang_Utils.getText(Lang_Constants.TextType.B0616)}${checkpointInfo.nextOperationId}`);
        this._layoutProgress.arrangeItems();
    }

    private _getSelectedCheckpointId(): number {
        return Helpers_Misc.getExisted(this._selectedCheckpointId, Utils_ClientErrorCode.ClientErrorCode.RwReplayProgressPanel_GetSelectedCheckpointId_00);
    }
    private _setSelectedCheckpointId(checkpointId: number): void {
        this._selectedCheckpointId = checkpointId;
    }
    private _getMinCheckpointId(): number {
        return 0;
    }
    private _getMaxCheckpointId(): number {
        return Helpers_Misc.getExisted(this._allCheckpointInfoArray?.length, Utils_ClientErrorCode.ClientErrorCode.RwReplayProgressPanel_GetMaxCheckpointId_00) - 1;
    }
}
