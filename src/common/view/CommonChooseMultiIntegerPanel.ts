import {
    Helpers_Collection,
    Stages_Constants,
    Numbers_Utils,
    Sounds_SoundPlayer,
    Sounds_Constants,
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
    currentIntegerArray     : number[];
    availableIntegerArray   : number[];
    getTitleText            : () => string;
    callbackOnConfirm       : (integerArray: number[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSelectAll!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelSelectAll!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSelectAll!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutSelected!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSelectedTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSelected!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _list!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForIntegerRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const list = this._list;
        list.setSelectedItemIndexes(this._imgSelectAll.getIsVisible()
            ? []
            : Helpers_Collection.createRange(0, list.getBoundDataArray()?.length ?? 0, 1)
        );
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }
    private _onTouchedBtnConfirm(): void {
        const callback  = this.getOpenData()?.callbackOnConfirm;
        const arr       = Helpers_Collection.getNonNullElements(this._list.getSelectedDataArray()?.map(v => v?.integer) ?? []).sort((v1, v2) => v1 - v2);
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
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? Lang_Constants.UndefinedError);
        this._labelSelectAll.setLangText(Lang_Constants.TextType.B0761);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._labelSelectedTitle.setLangText(Lang_Constants.TextType.B1274);

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
        const listHeight            = Numbers_Utils.getValueInRange({
            rawValue    : rowsCount * 30 + (rowsCount - 1) * 6,
            minValue    : 80,
            maxValue    : Stages_Constants.Dimension.DesignMinHeight - 130,
        });
        list.setUnscaledManualHeight(listHeight);
        this._labelNoData.setIsVisible(!dataCount);
        this._group.setUnscaledManualHeight(listHeight + 130);

        await list.bindData(dataArray);
        list.setSelectedItemIndexes(Helpers_Collection.getNonNullElements(dataArray.map((v, i) => currIntegerArray.indexOf(v.integer) >= 0 ? i : null)));
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

interface DataForIntegerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    integer     : number;
    panel       : Panel;
}
class IntegerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForIntegerRenderer> {
    private readonly _groupSelect!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
