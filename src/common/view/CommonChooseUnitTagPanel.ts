import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { createRange, getNonNullElements } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { AllTagIdArray } from "../../units/Constants.ts";

export interface OpenData {
    currentTagIdList    : number[];
    war                 : IBwWar;
    callback            : (tagIdList: number[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;

    private readonly _groupSelectAll!   : IUiLayout;
    private readonly _imgSelectAll!     : IUiImage;
    private readonly _labelSelectAll!   : IUiLabel;
    private readonly _listTag!          : IUiScrollList<DataForTagRenderer>;

    private readonly _btnConfirm!       : IUiButton;
    private readonly _btnCancel!        : IUiButton;
    private readonly _labelTips!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,              callback: this._onTouchedBtnCancel },
            { ui: this._groupSelectAll,         callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnCancel();
        });
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        list.setSelectedItemIndexes(isSelectAll ? createRange(0, (list.getBoundDataArray()?.length ?? 0) + 1, 1) : []);
        this.updateImgSelectAll();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(getNonNullElements(this._listTag.getSelectedDataArray()?.map(v => v?.tagId) ?? []));
        this.closePanel();
    }
    private _onTouchedBtnCancel(): void {
        this.closePanel();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.Tags);
        this._labelSelectAll.setLangText(TextType.B0761);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
        this._labelTips.setLangText(TextType.A0983);

        this._groupSelectAll.arrangeItems();
    }

    public updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible((this._listTag.getSelectedItems()?.length ?? 0) >= AllTagIdArray.length);
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
        for (const tagId of AllTagIdArray) {
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

interface DataForTagRenderer extends UiListItemData {
    tagId       : number;
    useCount    : number;
    panel       : Panel;
}
class TagRenderer extends UiListItemRenderer<DataForTagRenderer> {
    private readonly _layoutInfo!   : IUiLayout;
    private readonly _labelTagId!   : IUiLabel;

    private readonly _labelInUse!   : IUiLabel;

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
