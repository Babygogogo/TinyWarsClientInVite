import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoWarEventConditionIdAndFlags from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";

export interface OpenData {
    gameConfig      : GameConfigGcData.GcData;
    fullData        : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
    parentNodeId    : number;
    oldConditionId  : number | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listCondition!    : UiInterfacesIUiScrollList.IUiScrollList<DataForConditionRenderer>;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoCondition! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(LangConstants.TextType.B0258);
        this._labelNoCondition.setLangText(LangConstants.TextType.B0278);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
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
                candidateConditionId    : HelpersMisc.getExisted(condition.getWecCommonData()?.getConditionId()),
                fullData                : fullData,
            });
        }

        this._labelNoCondition.setIsVisible(!dataArray.length);
        await this._listCondition.bindData(dataArray);
    }
}

interface DataForConditionRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig              : GameConfigGcData.GcData;
    parentNodeId            : number;
    oldConditionId          : number | null;
    candidateConditionId    : number;
    fullData                : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
}
class ConditionRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForConditionRenderer> {
    private readonly _labelConditionId! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCondition!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCopy!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSelect!        : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
            { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            GamePanelsManager.closePanel(GamePanelsDict.getDict().WeConditionReplacePanel);
        } else {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
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
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            GamePanelsManager.closePanel(GamePanelsDict.getDict().WeConditionReplacePanel);
            GamePanelsManager.closePanel(GamePanelsDict.getDict().WeCommandPanel);
        } else {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setText(LangUtils.getText(LangConstants.TextType.B0487));
        this._btnSelect.setText(LangUtils.getText(LangConstants.TextType.B0492));

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
        this._labelConditionId.setText(`C${conditionId} (${LangUtils.getText(LangConstants.TextType.B0749)}: ${nodeNameArray?.length ? nodeNameArray.join(`, `) : LangUtils.getText(LangConstants.TextType.None)})`);
    }
    private _updateLabelCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition = openData.fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === openData.candidateConditionId);
        const label     = this._labelCondition;
        if (condition == null) {
            label.setText(LangUtils.getText(LangConstants.TextType.A0160));
        } else {
            label.setText(WarEventsConditionsUtilsCommon.getBriefDescForCondition(condition, openData.gameConfig) || LangConstants.UndefinedError);
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
    fullData                : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
    parentNodeId            : number;
    conditionIdForDelete    : number | null;
    conditionIdForClone     : number;
}): number | null {
    const parentNode = WarEventsFullDatasUtils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    const conditionArray    = fullData.getConditionArray();
    const srcCondition      = WarEventsFullDatasUtils.getCondition(fullData, conditionIdForClone);
    if (srcCondition == null) {
        return null;
    }

    const newCondition              = srcCondition.clone();
    const conditionIdAndFlagsArray  = parentNode.getConditionIdAndFlagsArray();
    for (let newConditionId = 1; ; ++newConditionId) {
        if (!conditionArray.some(v => v.getWecCommonData()?.getConditionId() === newConditionId)) {
            HelpersMisc.getExisted(newCondition.getWecCommonData()).setConditionId(newConditionId);
            conditionArray.push(newCondition);
            conditionArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getWecCommonData()?.getConditionId()) - HelpersMisc.getExisted(v2.getWecCommonData()?.getConditionId()));

            HelpersCollection.deleteElementFromList2(conditionIdAndFlagsArray, v => v.getConditionId() === conditionIdForDelete);
            const oldConditionIdAndFlags = conditionIdAndFlagsArray.find(v => v.getConditionId() === conditionIdForDelete);
            if (oldConditionIdAndFlags != null) {
                oldConditionIdAndFlags.setConditionId(newConditionId);
            } else {
                conditionIdAndFlagsArray.push(ProtoSchemaCommonProtoWarEventConditionIdAndFlags.ConditionIdAndFlags.fromJson({ conditionId: newConditionId }));
            }

            // conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());
            return newConditionId;
        }
    }
}

function replaceConditionInParentNode({ fullData, parentNodeId, oldConditionId, newConditionId }: {
    fullData        : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
    parentNodeId    : number;
    oldConditionId  : number | null;
    newConditionId  : number;
}): boolean {
    if (oldConditionId == newConditionId) {
        return false;
    }

    const conditionIdAndFlagsArray = WarEventsFullDatasUtils.getNode(fullData, parentNodeId)?.getConditionIdAndFlagsArray();
    if ((conditionIdAndFlagsArray == null)                                          ||
        (conditionIdAndFlagsArray.some(v => v.getConditionId() === newConditionId))
    ) {
        return false;
    }

    const oldConditionIdAndFlags = conditionIdAndFlagsArray.find(v => v.getConditionId() === oldConditionId);
    if (oldConditionIdAndFlags != null) {
        oldConditionIdAndFlags.setConditionId(newConditionId);
    } else {
        conditionIdAndFlagsArray.push(ProtoSchemaCommonProtoWarEventConditionIdAndFlags.ConditionIdAndFlags.fromJson({ conditionId: newConditionId }));
    }

    // conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());
    return true;
}
