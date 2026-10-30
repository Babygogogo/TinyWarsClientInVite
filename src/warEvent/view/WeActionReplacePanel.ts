import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { closePanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";
import {
    getEvent,
    getAction,
} from "../../warEvents/fullDatas/Utils.ts";

export interface OpenData {
    war             : IBwWar;
    fullData        : WarEventFullData;
    eventId         : number;
    nodeId          : number;
    oldActionId     : number | null;
    oldActionIndex  : number | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _listAction!       : IUiScrollList<DataForActionRenderer>;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelNoAction!    : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listAction.setItemRendererClass(ActionRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listAction.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForAction();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0615)} A${this.getOpenData()?.oldActionId}`);
        this._labelNoAction.setLangText(TextType.B0278);
        this._btnClose.setLangText(TextType.B0146);
    }
    private async _updateComponentsForAction(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId           = openData.eventId;
        const nodeId            = openData.nodeId;
        const oldActionId       = openData.oldActionId;
        const oldActionIndex    = openData.oldActionIndex;
        const fullData          = openData.fullData;
        const war               = openData.war;
        const dataArray         : DataForActionRenderer[] = [];
        for (const action of openData.fullData.getActionArray()) {
            dataArray.push({
                war                 : war,
                eventId             : eventId,
                nodeId              : nodeId,
                oldActionId         : oldActionId,
                oldActionIndex      : oldActionIndex,
                candidateActionId   : getExisted(action.getWeaCommonData()?.getActionId()),
                fullData            : fullData,
            });
        }

        this._labelNoAction.setIsVisible(!dataArray.length);
        await this._listAction.bindData(dataArray);
    }
}

interface DataForActionRenderer extends UiListItemData {
    war                 : IBwWar;
    eventId             : number;
    nodeId              : number;
    oldActionId         : number | null;
    oldActionIndex      : number | null;
    candidateActionId   : number;
    fullData            : WarEventFullData;
}
class ActionRenderer extends UiListItemRenderer<DataForActionRenderer> {
    private readonly _labelActionId!    : IUiLabel;
    private readonly _labelAction!      : IUiLabel;
    private readonly _btnCopy!          : IUiButton;
    private readonly _btnSelect!        : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
            { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._btnCopy.setIsVisible(false);
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelActionId();
        this._updateLabelAction();
        this._updateBtnSelect();
    }

    private _onTouchedBtnCopy(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (cloneAndReplaceActionInEvent({
            fullData            : openData.fullData,
            eventId             : openData.eventId,
            nodeId              : openData.nodeId,
            oldActionIndex      : openData.oldActionIndex,
            actionIdForClone    : openData.candidateActionId,
        }) != null) {
            dispatch(TypeId.WarEventFullDataChanged);
            closePanel(getDict().WeActionReplacePanel);
        }
    }
    private _onTouchedBtnSelect(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId           = openData.eventId;
        const nodeId            = openData.nodeId;
        const oldActionIndex    = openData.oldActionIndex;
        const newActionId       = openData.candidateActionId;
        const actionIdArray     = getExisted(openData.fullData.getEventArray()
            .find(v => v.getEventId() === eventId)
            ?.getRootNodeAndActionsArray()
            .find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)
            ?.getActionIdArray());

        if (oldActionIndex == null) {
            actionIdArray.push(newActionId);
        } else {
            actionIdArray[oldActionIndex] = openData.candidateActionId;
        }

        dispatch(TypeId.WarEventFullDataChanged);
        closePanel(getDict().WeActionReplacePanel);
        closePanel(getDict().WeCommandPanel);
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setLangText(TextType.B0487);
        this._btnSelect.setLangText(TextType.B0492);

        this._updateLabelActionId();
        this._updateLabelAction();
    }

    private _updateLabelActionId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionId          = openData.candidateActionId;
        const eventNameArray    = openData.fullData.getEventArray().filter(event => event.getRootNodeAndActionsArray()?.some(v => v.getActionIdArray().includes(actionId))).map(v => `E${v.getEventId()}`);
        this._labelActionId.setText(`A${actionId} (${getText(TextType.B0749)}: ${eventNameArray?.length ? eventNameArray.join(`, `) : getText(TextType.None)})`);
    }
    private _updateLabelAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action    = openData.fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === openData.candidateActionId);
        const label     = this._labelAction;
        if (action == null) {
            label.setLangText(TextType.A0168);
        } else {
            label.setText(getBriefDescForAction(action, openData.war.getGcData()) || UndefinedError);
        }

        this.setUnscaledManualHeight(label.getY() + label.getScaledHeight() + 2);
    }
    private _updateBtnSelect(): void {
        const openData = this.getOpenData();
        this._btnSelect.setIsVisible(openData?.oldActionId !== openData?.candidateActionId);
    }
}

function cloneAndReplaceActionInEvent({ fullData, eventId, nodeId, oldActionIndex, actionIdForClone }: {
    fullData            : WarEventFullData;
    eventId             : number;
    nodeId              : number;
    oldActionIndex      : number | null;
    actionIdForClone    : number;
}): number | null {
    const eventData = getEvent(fullData, eventId);
    if (eventData == null) {
        return null;
    }

    const fullActionArray   = fullData.getActionArray();
    const srcAction         = getAction(fullData, actionIdForClone);
    if (srcAction == null) {
        return null;
    }

    const actionIdArray = eventData.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray();
    if (actionIdArray == null) {
        return null;
    }

    const newAction = srcAction.clone();
    for (let newActionId = 1; ; ++newActionId) {
        if (!fullActionArray.some(v => v.getWeaCommonData()?.getActionId() === newActionId)) {
            getExisted(newAction.getWeaCommonData()).setActionId(newActionId);
            fullActionArray.push(newAction);
            fullActionArray.sort((v1, v2) => getExisted(v1.getWeaCommonData()?.getActionId()) - getExisted(v2.getWeaCommonData()?.getActionId()));

            if (oldActionIndex != null) {
                actionIdArray[oldActionIndex] = newActionId;
            } else {
                actionIdArray.push(newActionId);
            }
            // actionIdArray.sort((v1, v2) => v1 - v2);

            return newActionId;
        }
    }
}
