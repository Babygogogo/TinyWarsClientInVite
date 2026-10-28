import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { Constants } from "../../customCounters/Constants.ts";
import { getScwWarClass, getSfwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _listName!             : IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
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
        this._labelTitle.setLangText(TextType.B1143);
        this._labelTips.setLangText(TextType.A0785);
    }
    private async _updateListName(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataArray: DataForCustomCounterRenderer[] = [];
        for (let id = Constants.MinId; id <= Constants.MaxId; ++id) {
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

interface DataForCustomCounterRenderer extends UiListItemData {
    id      : number;
    war     : IBwWar;
}
class CustomCounterRenderer extends UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    private readonly _imgSelected!  : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,                        callback: this._onTouchedImgSelected },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.BwCustomCountersChanged,     callback: this._onNotifyBwCustomCountersChanged },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

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
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle           : () => getText(TextType.B1143),
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

function checkCanModify(war: Undefinable<IBwWar>): boolean {
    return (war instanceof getScwWarClass())
        || (war instanceof getSfwWarClass());
}
