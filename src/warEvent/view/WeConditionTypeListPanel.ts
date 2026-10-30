import { getDict } from "../../gamePanels/Dict.ts";
import { closePanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getWarEventConditionTypeName } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import {
    AvailableConditionTypeIdArray,
    ConditionTypeId,
} from "../../warEvents/conditions/Constants.ts";
import {
    resetCondition,
    openConditionModifyPanel,
} from "../../warEvents/conditions/utils/Common.ts";

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;

    private readonly _listType!     : IUiScrollList<DataForTypeRenderer>;

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
        this._labelTitle.setLangText(TextType.B0516);
        this._btnClose.setLangText(TextType.B0146);
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
        for (const newConditionType of AvailableConditionTypeIdArray) {
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

interface DataForTypeRenderer extends UiListItemData {
    war             : IMeWar;
    fullData        : WarEventFullData;
    newConditionType: ConditionTypeId;
    condition       : WarEventCondition;
}
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : IUiLabel;
    private readonly _btnSwitch!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            resetCondition(condition, conditionType);
            openConditionModifyPanel({ fullData: openData.fullData, condition, war });
            closePanel(getDict().WeConditionTypeListPanel);

            dispatch(TypeId.WarEventFullDataChanged);
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSwitch.setLangText(TextType.B0520);

        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        const label = this._labelType;
        if (openData == null) {
            label.setText(``);
        } else {
            label.setText(getWarEventConditionTypeName(openData.newConditionType) || UndefinedError);
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

function getConditionType(condition: WarEventCondition): ConditionTypeId | null {
    if      (condition.getWecPlayerPresence())                  { return ConditionTypeId.WecPlayerPresence; }
    else if (condition.getWecTurnAndPlayer())                   { return ConditionTypeId.WecTurnAndPlayer; }
    else if (condition.getWecEventCalledCount())                { return ConditionTypeId.WecEventCalledCount; }
    else if (condition.getWecWeatherAndFog())                   { return ConditionTypeId.WecWeatherAndFog; }
    else if (condition.getWecTilePresence())                    { return ConditionTypeId.WecTilePresence; }
    else if (condition.getWecUnitPresence())                    { return ConditionTypeId.WecUnitPresence; }
    else if (condition.getWecExpression())                      { return ConditionTypeId.WecExpression; }
    else if (condition.getWecCustomCounter())                   { return ConditionTypeId.WecCustomCounter; }
    else if (condition.getWecOngoingPersistentActionPresence()) { return ConditionTypeId.WecOngoingPersistentActionPresence; }
    else if (condition.getWecManualActionStatistics())          { return ConditionTypeId.WecManualActionStatistics; }
    else                                                        { return null; }
}
