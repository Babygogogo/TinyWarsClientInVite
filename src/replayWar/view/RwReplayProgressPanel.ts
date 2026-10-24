import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../interface/IRwWarBase.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    war: ReplayWarInterfaceIRwWarBase.IRwWarBase;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutProgress!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTarget!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupProgress!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgProgressBar!   : UiInterfacesIUiImage.IUiImage;
    private readonly _imgProgressPoint! : UiInterfacesIUiImage.IUiImage;

    private readonly _btnFirst!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLast!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private _allCheckpointInfoArray?    : AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointInfo[];
    private _selectedCheckpointId?      : number;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupProgress,     callback: this._onTouchedGroupProgress },
            { ui: this._groupProgress,     callback: this._onTouchMoveGroupProgress,            eventType: HelpersPointerInput.PointerEventType.PressMove },
            { ui: this._groupProgress,     callback: this._onTouchEndGroupProgress,             eventType: HelpersPointerInput.PointerEventType.ReleaseIn },
            { ui: this._groupProgress,     callback: this._onTouchReleaseOutsideGroupProgress,  eventType: HelpersPointerInput.PointerEventType.ReleaseOut },

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

    private _onTouchedGroupProgress(e: VendorEgretEgret.Event): void {
        const data              = e.data as HelpersPointerInput.PointerUnifiedEventData;
        const group             = this._groupProgress;
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const width             = group.getUnscaledWidth();
        const minCheckpointId   = this._getMinCheckpointId();
        const checkpointId      = Math.round(Math.max(0, Math.min(point.x, width)) / width * (this._getMaxCheckpointId() - minCheckpointId)) + minCheckpointId;
        this._setSelectedCheckpointId(checkpointId);
        this._updateGroupProgress();
        this._updateLabelTarget();
    }
    private _onTouchMoveGroupProgress(e: VendorEgretEgret.Event): void {
        const data              = e.data as HelpersPointerInput.PointerUnifiedEventData;
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
            title   : LangUtils.getText(LangConstants.TextType.B0088),
            content : LangUtils.getText(LangConstants.TextType.A0040),
        });
        await this.getOpenData()?.war.loadCheckpoint(this._getSelectedCheckpointId());
        GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupProgress();
        this._updateLabelTarget();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0712));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));

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
        const checkpointInfo = HelpersMisc.getExisted(this._allCheckpointInfoArray, UtilsClientErrorCode.ClientErrorCode.RwReplayProgressPanel_UpdateGroupProgress_00)[this._getSelectedCheckpointId()];
        this._labelTarget.setText(`${LangUtils.getText(LangConstants.TextType.B0191)}${checkpointInfo.turnIndex}  P${checkpointInfo.playerIndex}  ${LangUtils.getText(LangConstants.TextType.B0616)}${checkpointInfo.nextOperationId}`);
        this._layoutProgress.arrangeItems();
    }

    private _getSelectedCheckpointId(): number {
        return HelpersMisc.getExisted(this._selectedCheckpointId, UtilsClientErrorCode.ClientErrorCode.RwReplayProgressPanel_GetSelectedCheckpointId_00);
    }
    private _setSelectedCheckpointId(checkpointId: number): void {
        this._selectedCheckpointId = checkpointId;
    }
    private _getMinCheckpointId(): number {
        return 0;
    }
    private _getMaxCheckpointId(): number {
        return HelpersMisc.getExisted(this._allCheckpointInfoArray?.length, UtilsClientErrorCode.ClientErrorCode.RwReplayProgressPanel_GetMaxCheckpointId_00) - 1;
    }
}
