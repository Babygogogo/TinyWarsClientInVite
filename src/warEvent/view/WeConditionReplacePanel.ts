import { showLang } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { closePanel } from "../../gamePanels/Manager.ts";
import { deleteElementFromList2 } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getBriefDescForCondition } from "../../warEvents/conditions/utils/Common.ts";
import { getNode, getCondition } from "../../warEvents/fullDatas/Utils.ts";

export interface OpenData {
    gameConfig      : GameConfig;
    fullData        : WarEventFullData;
    parentNodeId    : number;
    oldConditionId  : number | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _listCondition!    : IUiScrollList<DataForConditionRenderer>;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelNoCondition! : IUiLabel;
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

        this._listCondition.setItemRendererClass(ConditionRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listCondition.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0258);
        this._labelNoCondition.setLangText(TextType.B0278);
        this._btnClose.setLangText(TextType.B0146);
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const parentNodeId      = openData.parentNodeId;
        const oldConditionId    = openData.oldConditionId;
        const fullData          = openData.fullData;
        const gameConfig        = openData.gameConfig;
        const dataArray         : DataForConditionRenderer[] = [];
        for (const condition of openData.fullData.getConditionArray()) {
            dataArray.push({
                gameConfig              : gameConfig,
                parentNodeId            : parentNodeId,
                oldConditionId          : oldConditionId,
                candidateConditionId    : getExisted(condition.getWecCommonData()?.getConditionId()),
                fullData                : fullData,
            });
        }

        this._labelNoCondition.setIsVisible(!dataArray.length);
        await this._listCondition.bindData(dataArray);
    }
}

interface DataForConditionRenderer extends UiListItemData {
    gameConfig              : GameConfig;
    parentNodeId            : number;
    oldConditionId          : number | null;
    candidateConditionId    : number;
    fullData                : WarEventFullData;
}
class ConditionRenderer extends UiListItemRenderer<DataForConditionRenderer> {
    private readonly _labelConditionId! : IUiLabel;
    private readonly _labelCondition!   : IUiLabel;
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
        this._updateLabelConditionId();
        this._updateLabelCondition();
        this._updateBtnSelect();
    }

    private _onTouchedBtnCopy(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (cloneAndReplaceConditionInParentNode({
            fullData                : openData.fullData,
            parentNodeId            : openData.parentNodeId,
            conditionIdForDelete    : openData.oldConditionId,
            conditionIdForClone     : openData.candidateConditionId,
        }) != null) {
            dispatch(TypeId.WarEventFullDataChanged);
            closePanel(getDict().WeConditionReplacePanel);
        } else {
            showLang(TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onTouchedBtnSelect(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (replaceConditionInParentNode({
            fullData        : openData.fullData,
            parentNodeId    : openData.parentNodeId,
            oldConditionId  : openData.oldConditionId,
            newConditionId  : openData.candidateConditionId,
        })) {
            dispatch(TypeId.WarEventFullDataChanged);
            closePanel(getDict().WeConditionReplacePanel);
            closePanel(getDict().WeCommandPanel);
        } else {
            showLang(TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setText(getText(TextType.B0487));
        this._btnSelect.setText(getText(TextType.B0492));

        this._updateLabelConditionId();
        this._updateLabelCondition();
    }

    private _updateLabelConditionId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionId   = openData.candidateConditionId;
        const nodeNameArray = openData.fullData.getConditionNodeArray().filter(node => node.getConditionIdAndFlagsArray().some(v => v.getConditionId() === conditionId)).map(v => `N${v.getNodeId()}`);
        this._labelConditionId.setText(`C${conditionId} (${getText(TextType.B0749)}: ${nodeNameArray?.length ? nodeNameArray.join(`, `) : getText(TextType.None)})`);
    }
    private _updateLabelCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition = openData.fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === openData.candidateConditionId);
        const label     = this._labelCondition;
        if (condition == null) {
            label.setText(getText(TextType.A0160));
        } else {
            label.setText(getBriefDescForCondition(condition, openData.gameConfig) || UndefinedError);
        }

        this.setUnscaledManualHeight(label.getY() + label.getUnscaledHeight() + 2);
    }
    private _updateBtnSelect(): void {
        const openData= this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnSelect.setIsVisible(openData.oldConditionId != openData.candidateConditionId);
    }
}

function cloneAndReplaceConditionInParentNode({ fullData, parentNodeId, conditionIdForDelete, conditionIdForClone }: {
    fullData                : WarEventFullData;
    parentNodeId            : number;
    conditionIdForDelete    : number | null;
    conditionIdForClone     : number;
}): number | null {
    const parentNode = getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    const conditionArray    = fullData.getConditionArray();
    const srcCondition      = getCondition(fullData, conditionIdForClone);
    if (srcCondition == null) {
        return null;
    }

    const newCondition              = srcCondition.clone();
    const conditionIdAndFlagsArray  = parentNode.getConditionIdAndFlagsArray();
    for (let newConditionId = 1; ; ++newConditionId) {
        if (!conditionArray.some(v => v.getWecCommonData()?.getConditionId() === newConditionId)) {
            getExisted(newCondition.getWecCommonData()).setConditionId(newConditionId);
            conditionArray.push(newCondition);
            conditionArray.sort((v1, v2) => getExisted(v1.getWecCommonData()?.getConditionId()) - getExisted(v2.getWecCommonData()?.getConditionId()));

            deleteElementFromList2(conditionIdAndFlagsArray, v => v.getConditionId() === conditionIdForDelete);
            const oldConditionIdAndFlags = conditionIdAndFlagsArray.find(v => v.getConditionId() === conditionIdForDelete);
            if (oldConditionIdAndFlags != null) {
                oldConditionIdAndFlags.setConditionId(newConditionId);
            } else {
                conditionIdAndFlagsArray.push(ConditionIdAndFlags.fromJson({ conditionId: newConditionId }));
            }

            // conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());
            return newConditionId;
        }
    }
}

function replaceConditionInParentNode({ fullData, parentNodeId, oldConditionId, newConditionId }: {
    fullData        : WarEventFullData;
    parentNodeId    : number;
    oldConditionId  : number | null;
    newConditionId  : number;
}): boolean {
    if (oldConditionId == newConditionId) {
        return false;
    }

    const conditionIdAndFlagsArray = getNode(fullData, parentNodeId)?.getConditionIdAndFlagsArray();
    if ((conditionIdAndFlagsArray == null)                                          ||
        (conditionIdAndFlagsArray.some(v => v.getConditionId() === newConditionId))
    ) {
        return false;
    }

    const oldConditionIdAndFlags = conditionIdAndFlagsArray.find(v => v.getConditionId() === oldConditionId);
    if (oldConditionIdAndFlags != null) {
        oldConditionIdAndFlags.setConditionId(newConditionId);
    } else {
        conditionIdAndFlagsArray.push(ConditionIdAndFlags.fromJson({ conditionId: newConditionId }));
    }

    // conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());
    return true;
}
