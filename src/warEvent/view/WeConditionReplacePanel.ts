import {
    GamePanels_Manager,
    Helpers_Collection,
    Notifications_Dispatcher,
    WarEvents_Conditions_Utils_Common,
    WarEvents_FullDatas_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    fullData        : WarEventFullData;
    parentNodeId    : number;
    oldConditionId  : number | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listCondition!    : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForConditionRenderer>;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoCondition! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0258);
        this._labelNoCondition.setLangText(Lang_Constants.TextType.B0278);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
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
                candidateConditionId    : Helpers_Misc.getExisted(condition.getWecCommonData()?.getConditionId()),
                fullData                : fullData,
            });
        }

        this._labelNoCondition.setIsVisible(!dataArray.length);
        await this._listCondition.bindData(dataArray);
    }
}

interface DataForConditionRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    parentNodeId            : number;
    oldConditionId          : number | null;
    candidateConditionId    : number;
    fullData                : WarEventFullData;
}
class ConditionRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForConditionRenderer> {
    private readonly _labelConditionId! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCondition!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCopy!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSelect!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
            { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeConditionReplacePanel);
        } else {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
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
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeConditionReplacePanel);
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeCommandPanel);
        } else {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setLangText(Lang_Constants.TextType.B0487);
        this._btnSelect.setLangText(Lang_Constants.TextType.B0492);

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
        this._labelConditionId.setText(`C${conditionId} (${Lang_Utils.getText(Lang_Constants.TextType.B0749)}: ${nodeNameArray?.length ? nodeNameArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.None)})`);
    }
    private _updateLabelCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition = openData.fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === openData.candidateConditionId);
        const label     = this._labelCondition;
        if (condition == null) {
            label.setLangText(Lang_Constants.TextType.A0160);
        } else {
            label.setText(WarEvents_Conditions_Utils_Common.getBriefDescForCondition(condition, openData.gameConfig) || Lang_Constants.UndefinedError);
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
    const parentNode = WarEvents_FullDatas_Utils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    const conditionArray    = fullData.getConditionArray();
    const srcCondition      = WarEvents_FullDatas_Utils.getCondition(fullData, conditionIdForClone);
    if (srcCondition == null) {
        return null;
    }

    const newCondition              = srcCondition.clone();
    const conditionIdAndFlagsArray  = parentNode.getConditionIdAndFlagsArray();
    for (let newConditionId = 1; ; ++newConditionId) {
        if (!conditionArray.some(v => v.getWecCommonData()?.getConditionId() === newConditionId)) {
            Helpers_Misc.getExisted(newCondition.getWecCommonData()).setConditionId(newConditionId);
            conditionArray.push(newCondition);
            conditionArray.sort((v1, v2) => Helpers_Misc.getExisted(v1.getWecCommonData()?.getConditionId()) - Helpers_Misc.getExisted(v2.getWecCommonData()?.getConditionId()));

            Helpers_Collection.deleteElementFromList2(conditionIdAndFlagsArray, v => v.getConditionId() === conditionIdForDelete);
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

    const conditionIdAndFlagsArray = WarEvents_FullDatas_Utils.getNode(fullData, parentNodeId)?.getConditionIdAndFlagsArray();
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
