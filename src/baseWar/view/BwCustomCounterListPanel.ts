import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as CustomCountersConstants from "../../customCounters/Constants.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listName!             : UiInterfacesIUiScrollList.IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1143));
        this._labelTips.setText(LangUtils.getText(LangConstants.TextType.A0785));
    }
    private async _updateListName(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataArray: DataForCustomCounterRenderer[] = [];
        for (let id = CustomCountersConstants.Constants.MinId; id <= CustomCountersConstants.Constants.MaxId; ++id) {
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

interface DataForCustomCounterRenderer extends UiTypesUiListItemData.UiListItemData {
    id      : number;
    war     : BaseWarInterfaceIBwWar.IBwWar;
}
class CustomCounterRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,                        callback: this._onTouchedImgSelected },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.BwCustomCountersChanged,     callback: this._onNotifyBwCustomCountersChanged },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);

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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => LangUtils.getText(LangConstants.TextType.B1143),
                minValue        : Number.MIN_SAFE_INTEGER,
                maxValue        : Number.MAX_SAFE_INTEGER,
                currentValue    : warEventManager.getCustomCounter(id),
                callback        : num => warEventManager.setCustomCounter(id, num),
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

function checkCanModify(war: AuxiliaryTypesAuxiliaryTypes.Undefinable<BaseWarInterfaceIBwWar.IBwWar>): boolean {
    return (war instanceof GameHelpersGhFactory.getScwWarClass())
        || (war instanceof GameHelpersGhFactory.getSfwWarClass());
}
