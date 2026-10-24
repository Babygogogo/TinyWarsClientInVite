import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesConstants from "../../stages/Constants.ts";
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
    currentIntegerArray     : number[];
    availableIntegerArray   : number[];
    getTitleText            : () => string;
    callbackOnConfirm       : (integerArray: number[]) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSelectAll!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelSelectAll!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSelectAll!         : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutSelected!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSelectedTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSelected!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _list!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForIntegerRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!           : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelectAll,         callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,               callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(IntegerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectInteger(): void {
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _onTouchedGroupSelectAll(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const list = this._list;
        list.setSelectedItemIndexes(this._imgSelectAll.getIsVisible()
            ? []
            : HelpersCollection.createRange(0, list.getBoundDataArray()?.length ?? 0, 1)
        );
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }
    private _onTouchedBtnConfirm(): void {
        const callback  = this.getOpenData()?.callbackOnConfirm;
        const arr       = HelpersCollection.getNonNullElements(this._list.getSelectedDataArray()?.map(v => v?.integer) ?? []).sort((v1, v2) => v1 - v2);
        this.closePanel();
        callback?.(arr);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._resetList();
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? LangConstants.UndefinedError);
        this._labelSelectAll.setText(LangUtils.getText(LangConstants.TextType.B0761));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._labelSelectedTitle.setText(LangUtils.getText(LangConstants.TextType.B1274));

        this._layoutSelected.arrangeItems();
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataArray: DataForIntegerRenderer[] = [];
        for (const integer of openData.availableIntegerArray) {
            dataArray.push({
                integer : integer,
                panel   : this,
            });
        }

        const currIntegerArray      = openData.currentIntegerArray;
        const dataCount             = dataArray.length;
        const list                  = this._list;
        const rowsCount             = Math.ceil(dataCount / 6);
        const listHeight            = NumbersUtils.getValueInRange({
            rawValue    : rowsCount * 30 + (rowsCount - 1) * 6,
            minValue    : 80,
            maxValue    : StagesConstants.Dimension.DesignMinHeight - 130,
        });
        list.setUnscaledManualHeight(listHeight);
        this._labelNoData.setIsVisible(!dataCount);
        this._group.setUnscaledManualHeight(listHeight + 130);

        await list.bindData(dataArray);
        list.setSelectedItemIndexes(HelpersCollection.getNonNullElements(dataArray.map((v, i) => currIntegerArray.indexOf(v.integer) >= 0 ? i : null)));
    }
    private _updateGroupSelectAll(): void {
        const list          = this._list;
        const dataArray     = list.getBoundDataArray() ?? [];
        const group         = this._groupSelectAll;
        if (!dataArray.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._imgSelectAll.setIsVisible(dataArray.length <= (list.getSelectedItemIndexes()?.length ?? 0));
        }
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._list.getSelectedItemIndexes()?.length ?? 0} / ${this.getOpenData()?.availableIntegerArray.length}`);
        this._layoutSelected.arrangeItems();
    }
}

interface DataForIntegerRenderer extends UiTypesUiListItemData.UiListItemData {
    integer     : number;
    panel       : Panel;
}
class IntegerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForIntegerRenderer> {
    private readonly _groupSelect!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectInteger();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._labelName.setText(`${this.getOpenData()?.integer}`);
    }
}
