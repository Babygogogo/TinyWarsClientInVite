import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as WarEventsConditionsConstants from "../../warEvents/conditions/Constants.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition          = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;

    private readonly _listType!     : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;

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

        this._listType.setItemRendererClass(TypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listType.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListType();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0516));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));
    }
    private async _updateListType(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition = openData.condition;
        const fullData  = openData.fullData;
        const war       = openData.war;
        const dataArray: DataForTypeRenderer[] = [];
        for (const newConditionType of WarEventsConditionsConstants.AvailableConditionTypeIdArray) {
            dataArray.push({
                war,
                fullData,
                newConditionType,
                condition,
            });
        }
        await this._listType.bindData(dataArray);
    }
}

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    war             : MapEditorInterfaceIMeWar.IMeWar;
    fullData        : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
    newConditionType: WarEventsConditionsConstants.ConditionTypeId;
    condition       : WarEventCondition;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSwitch!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnSwitch,              callback: this._onTouchedBtnSwitch },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateLabelType();
        this._updateLabelUsingAndSwitch();
    }

    private _onTouchedBtnSwitch(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionType = openData.newConditionType;
        const condition     = openData.condition;
        const war           = openData.war;
        if (conditionType !== getConditionType(condition)) {
            WarEventsConditionsUtilsCommon.resetCondition(condition, conditionType);
            WarEventsConditionsUtilsCommon.openConditionModifyPanel({ fullData: openData.fullData, condition, war });
            GamePanelsManager.closePanel(GamePanelsDict.getDict().WeConditionTypeListPanel);

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSwitch.setText(LangUtils.getText(LangConstants.TextType.B0520));

        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        const label = this._labelType;
        if (openData == null) {
            label.setText(``);
        } else {
            label.setText(LangUtils.getWarEventConditionTypeName(openData.newConditionType) || LangConstants.UndefinedError);
        }
    }
    private _updateLabelUsingAndSwitch(): void {
        const openData  = this.getOpenData();
        const btnSwitch = this._btnSwitch;
        if (openData == null) {
            btnSwitch.setIsVisible(false);
        } else {
            btnSwitch.setIsVisible(getConditionType(openData.condition) !== openData.newConditionType);
        }
    }
}

function getConditionType(condition: WarEventCondition): WarEventsConditionsConstants.ConditionTypeId | null {
    if      (condition.getWecPlayerPresence())                  { return WarEventsConditionsConstants.ConditionTypeId.WecPlayerPresence; }
    else if (condition.getWecTurnAndPlayer())                   { return WarEventsConditionsConstants.ConditionTypeId.WecTurnAndPlayer; }
    else if (condition.getWecEventCalledCount())                { return WarEventsConditionsConstants.ConditionTypeId.WecEventCalledCount; }
    else if (condition.getWecWeatherAndFog())                   { return WarEventsConditionsConstants.ConditionTypeId.WecWeatherAndFog; }
    else if (condition.getWecTilePresence())                    { return WarEventsConditionsConstants.ConditionTypeId.WecTilePresence; }
    else if (condition.getWecUnitPresence())                    { return WarEventsConditionsConstants.ConditionTypeId.WecUnitPresence; }
    else if (condition.getWecExpression())                      { return WarEventsConditionsConstants.ConditionTypeId.WecExpression; }
    else if (condition.getWecCustomCounter())                   { return WarEventsConditionsConstants.ConditionTypeId.WecCustomCounter; }
    else if (condition.getWecOngoingPersistentActionPresence()) { return WarEventsConditionsConstants.ConditionTypeId.WecOngoingPersistentActionPresence; }
    else if (condition.getWecManualActionStatistics())          { return WarEventsConditionsConstants.ConditionTypeId.WecManualActionStatistics; }
    else                                                        { return null; }
}
