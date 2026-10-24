import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UnitsConstants from "../../units/Constants.ts";

export interface OpenData {
    currentTagIdList    : number[];
    war                 : BaseWarInterfaceIBwWar.IBwWar;
    callback            : (tagIdList: number[]) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSelectAll!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgSelectAll!     : UiInterfacesIUiImage.IUiImage;
    private readonly _labelSelectAll!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listTag!          : UiInterfacesIUiScrollList.IUiScrollList<DataForTagRenderer>;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,              callback: this._onTouchedBtnCancel },
            { ui: this._groupSelectAll,         callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        list.setSelectedItemIndexes(isSelectAll ? HelpersCollection.createRange(0, (list.getBoundDataArray()?.length ?? 0) + 1, 1) : []);
        this.updateImgSelectAll();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(HelpersCollection.getNonNullElements(this._listTag.getSelectedDataArray()?.map(v => v?.tagId) ?? []));
        this.closePanel();
    }
    private _onTouchedBtnCancel(): void {
        this.closePanel();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.Tags);
        this._labelSelectAll.setLangText(LangConstants.TextType.B0761);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._btnCancel.setLangText(LangConstants.TextType.B0154);
        this._labelTips.setLangText(LangConstants.TextType.A0983);

        this._groupSelectAll.arrangeItems();
    }

    public updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible((this._listTag.getSelectedItems()?.length ?? 0) >= UnitsConstants.AllTagIdArray.length);
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
        for (const tagId of UnitsConstants.AllTagIdArray) {
            dataArray.push({
                tagId       : tagId,
                useCount    : inUseDict.get(tagId) ?? 0,
                panel       : this,
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

interface DataForTagRenderer extends UiTypesUiListItemData.UiListItemData {
    tagId       : number;
    useCount    : number;
    panel       : Panel;
}
class TagRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTagRenderer> {
    private readonly _layoutInfo!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTagId!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelInUse!   : UiInterfacesIUiLabel.IUiLabel;

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
