import {
    Units_Constants,
    Helpers_Collection,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentTagIdList    : number[];
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    callback            : (tagIdList: number[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSelectAll!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgSelectAll!     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelSelectAll!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listTag!          : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTagRenderer>;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnCancel,              callback : this._onTouchedBtnCancel },
            { ui : this._groupSelectAll,         callback : this._onTouchedGroupSelectAll },
            { ui : this._btnConfirm,             callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listTag.setItemRendererClass(TagRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateListTag();
        this.updateImgSelectAll();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listTag.removeAllItems();

        await super._onClosed();
    }

    private _onTouchedGroupSelectAll(): void {
        const isSelectAll   = !this._imgSelectAll.getIsVisible();
        const list          = this._listTag;
        list.setSelectedItemIndexes(isSelectAll ? Helpers_Collection.createRange(0, (list.getBoundDataArray()?.length ?? 0) + 1, 1) : []);
        this.updateImgSelectAll();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(Helpers_Collection.getNonNullElements(this._listTag.getSelectedDataArray()?.map(v => v?.tagId) ?? []));
        this.closePanel();
    }
    private _onTouchedBtnCancel(): void {
        this.closePanel();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.Tags);
        this._labelSelectAll.setLangText(Lang_Constants.TextType.B0761);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelTips.setLangText(Lang_Constants.TextType.A0983);

        this._groupSelectAll.arrangeItems();
    }

    public updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible((this._listTag.getSelectedItems()?.length ?? 0) >= Units_Constants.AllTagIdArray.length);
    }
    private async _updateListTag(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const inUseDict     = new Map<number, number>();
        for (const tagId of war.getUnitMap().getAllUnits().flatMap(v => v.getTagIdArray(true))) {
            inUseDict.set(tagId, (inUseDict.get(tagId) ?? 0) + 1);
        }

        const tagIdList             = openData.currentTagIdList;
        const selectedItemIndexes   : number[] = [];
        let index                   = 0;
        const dataArray             : DataForTagRenderer[] = [];
        for (const tagId of Units_Constants.AllTagIdArray) {
            dataArray.push({
                tagId    : tagId,
                useCount : inUseDict.get(tagId) ?? 0,
                panel    : this,
            });
            if (tagIdList.includes(tagId)) {
                selectedItemIndexes.push(index);
            }
            ++index;
        }

        const list = this._listTag;
        await list.bindData(dataArray);
        list.setSelectedItemIndexes(selectedItemIndexes);
    }
}

interface DataForTagRenderer extends Ui_Types_UiListItemData.UiListItemData {
    tagId       : number;
    useCount    : number;
    panel       : Panel;
}
class TagRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTagRenderer> {
    private readonly _layoutInfo!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTagId!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelInUse!   : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        this._labelTagId.setText(`${openData?.tagId}`);

        {
            const useCount      = openData?.useCount ?? 0;
            const labelInUse    = this._labelInUse;
            labelInUse.setIsVisible(useCount > 0);
            labelInUse.setText(`${useCount}`);
        }

        this._layoutInfo.arrangeItems();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateImgSelectAll();
    }
}
