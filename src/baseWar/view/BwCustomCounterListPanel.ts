import {
    CustomCounters_Constants,
    SingleCustomWar_Model_ScwWar,
    SingleFreeWar_Model_SfwWar,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    war     : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listName!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,     callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listName.setItemRendererClass(CustomCounterRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listName.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListName();
        this._updateLabelTips();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1143);
        this._labelTips.setLangText(Lang_Constants.TextType.A0785);
    }
    private async _updateListName(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataArray: DataForCustomCounterRenderer[] = [];
        for (let id = CustomCounters_Constants.Constants.MinId; id <= CustomCounters_Constants.Constants.MaxId; ++id) {
            dataArray.push({
                war : war,
                id  : id,
            });
        }

        await this._listName.bindData(dataArray);
    }
    private _updateLabelTips(): void {
        this._labelTips.setIsVisible(checkCanModify(this.getOpenData()?.war));
    }
}

interface DataForCustomCounterRenderer extends Ui_Types_UiListItemData.UiListItemData {
    id      : number;
    war     : BaseWar_Interface_IBwWar.IBwWar;
}
class CustomCounterRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._imgSelected,                        callback : this._onTouchedImgSelected },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.BwCustomCountersChanged,     callback : this._onNotifyBwCustomCountersChanged },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (checkCanModify(war)) {
            const id                = openData.id;
            const warEventManager   = war.getWarEventManager();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1143),
                minValue     : Number.MIN_SAFE_INTEGER,
                maxValue     : Number.MAX_SAFE_INTEGER,
                currentValue : warEventManager.getCustomCounter(id),
                callback     : num => warEventManager.setCustomCounter(id, num),
            });
        }
    }

    private _onNotifyBwCustomCountersChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const id                = openData.id;
        const warEventManager   = openData.war.getWarEventManager();
        const nameInfo          = warEventManager.getWarEventFullData()?.getCustomCounterNameArray().find(v => (v.getId() ?? 0) === id);
        this._labelId.setText(`#${id} ${nameInfo?.getName() ?? ``}`);
        this._labelName.setText(`${warEventManager.getCustomCounter(id)}`);
        this._layoutName.arrangeItems();
    }
}

function checkCanModify(war: AuxiliaryTypes_AuxiliaryTypes.Undefinable<BaseWar_Interface_IBwWar.IBwWar>): boolean {
    return (war instanceof SingleCustomWar_Model_ScwWar.ScwWar)
        || (war instanceof SingleFreeWar_Model_SfwWar.SfwWar);
}
