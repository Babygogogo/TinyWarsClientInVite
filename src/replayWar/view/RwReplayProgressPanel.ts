import type { ReplayCheckpointInfo } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { PointerEventType, type PointerUnifiedEventData } from "../../helpers/PointerInput.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { IRwWarBase } from "../interface/IRwWarBase.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export interface OpenData {
    war: IRwWarBase;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;

    private readonly _layoutProgress!   : IUiLayout;
    private readonly _labelTarget!      : IUiLabel;

    private readonly _groupProgress!    : IUiContainer;
    private readonly _imgProgressBar!   : IUiImage;
    private readonly _imgProgressPoint! : IUiImage;

    private readonly _btnFirst!         : IUiButton;
    private readonly _btnLast!          : IUiButton;
    private readonly _btnCancel!        : IUiButton;
    private readonly _btnConfirm!       : IUiButton;

    private _allCheckpointInfoArray?    : ReplayCheckpointInfo[];
    private _selectedCheckpointId?      : number;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupProgress,     callback: this._onTouchedGroupProgress },
            { ui: this._groupProgress,     callback: this._onTouchMoveGroupProgress,            eventType: PointerEventType.PressMove },
            { ui: this._groupProgress,     callback: this._onTouchEndGroupProgress,             eventType: PointerEventType.ReleaseIn },
            { ui: this._groupProgress,     callback: this._onTouchReleaseOutsideGroupProgress,  eventType: PointerEventType.ReleaseOut },

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

    private _onTouchedGroupProgress(e: Event): void {
        const data              = e.data as PointerUnifiedEventData;
        const group             = this._groupProgress;
        const point             = group.globalToLocal(data.stageX, data.stageY);
        const width             = group.getUnscaledWidth();
        const minCheckpointId   = this._getMinCheckpointId();
        const checkpointId      = Math.round(Math.max(0, Math.min(point.x, width)) / width * (this._getMaxCheckpointId() - minCheckpointId)) + minCheckpointId;
        this._setSelectedCheckpointId(checkpointId);
        this._updateGroupProgress();
        this._updateLabelTarget();
    }
    private _onTouchMoveGroupProgress(e: Event): void {
        const data              = e.data as PointerUnifiedEventData;
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
        openPanel(getDict().CommonBlockPanel, {
            title   : getText(TextType.B0088),
            content : getText(TextType.A0040),
        });
        await this.getOpenData()?.war.loadCheckpoint(this._getSelectedCheckpointId());
        closePanel(getDict().CommonBlockPanel);
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateGroupProgress();
        this._updateLabelTarget();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0712));
        this._btnConfirm.setText(getText(TextType.B0026));
        this._btnCancel.setText(getText(TextType.B0154));

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
        const checkpointInfo = getExisted(this._allCheckpointInfoArray, ClientErrorCode.RwReplayProgressPanel_UpdateGroupProgress_00)[this._getSelectedCheckpointId()];
        this._labelTarget.setText(`${getText(TextType.B0191)}${checkpointInfo.turnIndex}  P${checkpointInfo.playerIndex}  ${getText(TextType.B0616)}${checkpointInfo.nextOperationId}`);
        this._layoutProgress.arrangeItems();
    }

    private _getSelectedCheckpointId(): number {
        return getExisted(this._selectedCheckpointId, ClientErrorCode.RwReplayProgressPanel_GetSelectedCheckpointId_00);
    }
    private _setSelectedCheckpointId(checkpointId: number): void {
        this._selectedCheckpointId = checkpointId;
    }
    private _getMinCheckpointId(): number {
        return 0;
    }
    private _getMaxCheckpointId(): number {
        return getExisted(this._allCheckpointInfoArray?.length, ClientErrorCode.RwReplayProgressPanel_GetMaxCheckpointId_00) - 1;
    }
}
