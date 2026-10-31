import {
    WarEvents_Conditions_Constants,
    GamePanels_Manager,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    WarEvents_Conditions_Utils_Common,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listType!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0516);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
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
        for (const newConditionType of WarEvents_Conditions_Constants.AvailableConditionTypeIdArray) {
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

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war             : MapEditor_Interface_IMeWar.IMeWar;
    fullData        : WarEventFullData;
    newConditionType: WarEvents_Conditions_Constants.ConditionTypeId;
    condition       : WarEventCondition;
}
class TypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSwitch!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnSwitch,              callback : this._onTouchedBtnSwitch },
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
            WarEvents_Conditions_Utils_Common.resetCondition(condition, conditionType);
            WarEvents_Conditions_Utils_Common.openConditionModifyPanel({ fullData : openData.fullData, condition, war });
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeConditionTypeListPanel);

            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSwitch.setLangText(Lang_Constants.TextType.B0520);

        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        const label = this._labelType;
        if (openData == null) {
            label.setText(``);
        } else {
            label.setText(Lang_Utils.getWarEventConditionTypeName(openData.newConditionType) || Lang_Constants.UndefinedError);
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

function getConditionType(condition: WarEventCondition): WarEvents_Conditions_Constants.ConditionTypeId | null {
    if      (condition.getWecPlayerPresence())                  {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecPlayerPresence; 
    } else if (condition.getWecTurnAndPlayer())                   {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecTurnAndPlayer; 
    } else if (condition.getWecEventCalledCount())                {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecEventCalledCount; 
    } else if (condition.getWecWeatherAndFog())                   {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecWeatherAndFog; 
    } else if (condition.getWecTilePresence())                    {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecTilePresence; 
    } else if (condition.getWecUnitPresence())                    {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecUnitPresence; 
    } else if (condition.getWecExpression())                      {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecExpression; 
    } else if (condition.getWecCustomCounter())                   {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecCustomCounter; 
    } else if (condition.getWecOngoingPersistentActionPresence()) {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecOngoingPersistentActionPresence; 
    } else if (condition.getWecManualActionStatistics())          {
        return WarEvents_Conditions_Constants.ConditionTypeId.WecManualActionStatistics; 
    } else                                                        {
        return null; 
    }
}
