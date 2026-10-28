import { TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { wait } from "../../timer/TimerModel.ts";
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

// eslint-disable-next-line no-shadow
type TutorialInfo = {
    tutorialId      : number;
    titleTextType   : TextType;
    contentTextType : TextType;
    img             : string;
};
const TutorialInfoArray: TutorialInfo[] = [
    { tutorialId: 1,    titleTextType: TextType.B0932,  contentTextType: TextType.A0321, img: "tutorialContent0001" },
    { tutorialId: 2,    titleTextType: TextType.B0933,  contentTextType: TextType.A0322, img: "tutorialContent0002" },
    { tutorialId: 3,    titleTextType: TextType.B0934,  contentTextType: TextType.A0323, img: "tutorialContent0003" },
    { tutorialId: 4,    titleTextType: TextType.B0935,  contentTextType: TextType.A0324, img: "tutorialContent0004" },
    { tutorialId: 5,    titleTextType: TextType.B0936,  contentTextType: TextType.A0325, img: "tutorialContent0005" },
    { tutorialId: 6,    titleTextType: TextType.B0937,  contentTextType: TextType.A0326, img: "tutorialContent0006" },
    { tutorialId: 7,    titleTextType: TextType.B0938,  contentTextType: TextType.A0327, img: "tutorialContent0007" },
    { tutorialId: 8,    titleTextType: TextType.B0939,  contentTextType: TextType.A0328, img: "tutorialContent0008" },
    { tutorialId: 9,    titleTextType: TextType.B0940,  contentTextType: TextType.A0329, img: "tutorialContent0009" },
    { tutorialId: 10,   titleTextType: TextType.Fuel,  contentTextType: TextType.A0330, img: "tutorialContent0010" },
    { tutorialId: 11,   titleTextType: TextType.B0942,  contentTextType: TextType.A0331, img: "tutorialContent0011" },
    { tutorialId: 12,   titleTextType: TextType.B0943,  contentTextType: TextType.A0332, img: "tutorialContent0012" },
    { tutorialId: 13,   titleTextType: TextType.B0944,  contentTextType: TextType.A0333, img: "tutorialContent0013" },
    { tutorialId: 14,   titleTextType: TextType.B0945,  contentTextType: TextType.A0334, img: "tutorialContent0014" },
    // { tutorialId: 15,   titleTextType: LangTextType.B0946,  contentTextType: LangTextType.A0335, img: "tutorialContent0015" },
    { tutorialId: 16,   titleTextType: TextType.B0947,  contentTextType: TextType.A0336, img: "tutorialContent0016" },
    { tutorialId: 17,   titleTextType: TextType.B0438,  contentTextType: TextType.A0337, img: "tutorialContent0017" },
    { tutorialId: 18,   titleTextType: TextType.B0949,  contentTextType: TextType.A0338, img: "tutorialContent0018" },
    { tutorialId: 19,   titleTextType: TextType.B0950,  contentTextType: TextType.A0339, img: "tutorialContent0019" },
    { tutorialId: 20,   titleTextType: TextType.B0951,  contentTextType: TextType.A0340, img: "tutorialContent0020" },
    { tutorialId: 21,   titleTextType: TextType.B0952,  contentTextType: TextType.A0341, img: "tutorialContent0021" },
    { tutorialId: 22,   titleTextType: TextType.B0953,  contentTextType: TextType.A0342, img: "tutorialContent0022" },
    { tutorialId: 23,   titleTextType: TextType.B0954,  contentTextType: TextType.A0343, img: "tutorialContent0023" },
    { tutorialId: 24,   titleTextType: TextType.B0955,  contentTextType: TextType.A0344, img: "tutorialContent0024" },
    { tutorialId: 25,   titleTextType: TextType.B0956,  contentTextType: TextType.A0345, img: "tutorialContent0025" },
    { tutorialId: 26,   titleTextType: TextType.B0957,  contentTextType: TextType.A0346, img: "tutorialContent0026" },
    { tutorialId: 27,   titleTextType: TextType.B0958,  contentTextType: TextType.A0347, img: "tutorialContent0027" },
    { tutorialId: 28,   titleTextType: TextType.B0959,  contentTextType: TextType.A0348, img: "tutorialContent0028" },
    { tutorialId: 29,   titleTextType: TextType.B0960,  contentTextType: TextType.A0349, img: "tutorialContent0029" },
    { tutorialId: 30,   titleTextType: TextType.B0961,  contentTextType: TextType.A0350, img: "tutorialContent0030" },
    { tutorialId: 31,   titleTextType: TextType.B0962,  contentTextType: TextType.A0351, img: "tutorialContent0031" },
    { tutorialId: 32,   titleTextType: TextType.B0963,  contentTextType: TextType.A0352, img: "tutorialContent0032" },
    { tutorialId: 33,   titleTextType: TextType.B0964,  contentTextType: TextType.A0353, img: "tutorialContent0033" },
    { tutorialId: 34,   titleTextType: TextType.B0965,  contentTextType: TextType.A0354, img: "tutorialContent0034" },
    { tutorialId: 35,   titleTextType: TextType.B0966,  contentTextType: TextType.A0355, img: "tutorialContent0035" },
    { tutorialId: 36,   titleTextType: TextType.B0967,  contentTextType: TextType.A0356, img: "tutorialContent0036" },
    { tutorialId: 37,   titleTextType: TextType.B0968,  contentTextType: TextType.A0357, img: "tutorialContent0037" },
    { tutorialId: 38,   titleTextType: TextType.B0969,  contentTextType: TextType.A0358, img: "tutorialContent0038" },
    { tutorialId: 39,   titleTextType: TextType.B0970,  contentTextType: TextType.A0359, img: "tutorialContent0039" },
    { tutorialId: 40,   titleTextType: TextType.B0971,  contentTextType: TextType.A0360, img: "tutorialContent0040" },
    { tutorialId: 41,   titleTextType: TextType.B0972,  contentTextType: TextType.A0361, img: "tutorialContent0041" },
    { tutorialId: 42,   titleTextType: TextType.B0973,  contentTextType: TextType.A0362, img: "tutorialContent0042" },
    { tutorialId: 43,   titleTextType: TextType.B0974,  contentTextType: TextType.A0363, img: "tutorialContent0043" },
    { tutorialId: 44,   titleTextType: TextType.B0975,  contentTextType: TextType.A0364, img: "tutorialContent0044" },
    { tutorialId: 45,   titleTextType: TextType.B0976,  contentTextType: TextType.A0365, img: "tutorialContent0045" },
    // { tutorialId: 46,   titleTextType: LangTextType.B0977,  contentTextType: LangTextType.A0366, img: "tutorialContent0046" },
];

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _groupList!            : IUiContainer;
    private readonly _listName!             : IUiScrollList<DataForNameRenderer>;
    private readonly _btnBack!              : IUiButton;

    private readonly _groupTutorial!        : IUiLayout;
    private readonly _labelTutorialTitle!   : IUiLabel;
    private readonly _imgTutorial!          : IUiImage;
    private readonly _labelTutorial!        : IUiLabel;

    private readonly _groupInfo!            : IUiContainer;

    private _selectedIndex                  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,    callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();

        this._listName.setItemRendererClass(UnitRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const listUnit = this._listName;
        await listUnit.bindData(this._createDataForListName());
        listUnit.scrollTop();
        this._updateComponentsForLanguage();
        this.setSelectedIndexAndUpdateView(0);

        this._selectedIndex = null;
    }
    protected override async _onClosed(): Promise<void> {
        await this._listName.removeAllItems();

        await super._onClosed();
    }

    public async setSelectedIndexAndUpdateView(newIndex: number): Promise<void> {
        const oldIndex      = this._selectedIndex;
        this._selectedIndex = newIndex;

        if (oldIndex !== newIndex) {
            const list = this._listName;
            list.setSelectedItemIndexes([newIndex]);

            const info = list.getFirstSelectedData()?.tutorialInfo;
            if (info) {
                this._labelTutorialTitle.setLangText(info.titleTextType);
                this._labelTutorial.setLangText(info.contentTextType);
                await this._imgTutorial.loadSource(info.img);
                this._groupTutorial.arrangeItems();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected override async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        const groupList = this._groupList;
        Executor.removeTweens(groupList);
        Executor.get(groupList)
            .set({ customAlpha: 0, customX: -40 })
            .to({ customAlpha: 1, customX: 0 }, 200);

        const groupInfo = this._groupInfo;
        Executor.removeTweens(groupInfo);
        Executor.get(groupInfo)
            .set({ customAlpha: 0, customX: 40 })
            .to({ customAlpha: 1, customX: 0 }, 200);

        await wait();
    }
    protected override async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        const groupList = this._groupList;
        Executor.removeTweens(groupList);
        Executor.get(groupList)
            .set({ customAlpha: 1, customX: 0 })
            .to({ customAlpha: 0, customX: -40 }, 200);

        const groupInfo = this._groupInfo;
        Executor.removeTweens(groupInfo);
        Executor.get(groupInfo)
            .set({ customAlpha: 1, customX: 0 })
            .to({ customAlpha: 0, customX: 40 }, 200);

        await wait();
    }

    private _updateComponentsForLanguage(): void {
        this._btnBack.setLangText(TextType.B0146);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _createDataForListName(): DataForNameRenderer[] {
        const data: DataForNameRenderer[] = [];
        for (let index = 0; index < TutorialInfoArray.length; ++index) {
            data.push({
                index,
                tutorialInfo: TutorialInfoArray[index],
                panel       : this,
            });
        }

        return data;
    }
}

interface DataForNameRenderer extends UiListItemData {
    tutorialInfo    : TutorialInfo;
    index           : number;
    panel           : Panel;
}
class UnitRenderer extends UiListItemRenderer<DataForNameRenderer> {
    private readonly _labelName!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData) {
            this._labelName.setLangText(openData.tutorialInfo.titleTextType);
        }
    }

    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setSelectedIndexAndUpdateView(openData.index);
    }
}
