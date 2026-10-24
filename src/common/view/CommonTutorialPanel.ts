import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
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

// eslint-disable-next-line no-shadow
type TutorialInfo = {
    tutorialId      : number;
    titleTextType   : LangConstants.TextType;
    contentTextType : LangConstants.TextType;
    img             : string;
};
const TutorialInfoArray: TutorialInfo[] = [
    { tutorialId: 1,    titleTextType: LangConstants.TextType.B0932,  contentTextType: LangConstants.TextType.A0321, img: "tutorialContent0001" },
    { tutorialId: 2,    titleTextType: LangConstants.TextType.B0933,  contentTextType: LangConstants.TextType.A0322, img: "tutorialContent0002" },
    { tutorialId: 3,    titleTextType: LangConstants.TextType.B0934,  contentTextType: LangConstants.TextType.A0323, img: "tutorialContent0003" },
    { tutorialId: 4,    titleTextType: LangConstants.TextType.B0935,  contentTextType: LangConstants.TextType.A0324, img: "tutorialContent0004" },
    { tutorialId: 5,    titleTextType: LangConstants.TextType.B0936,  contentTextType: LangConstants.TextType.A0325, img: "tutorialContent0005" },
    { tutorialId: 6,    titleTextType: LangConstants.TextType.B0937,  contentTextType: LangConstants.TextType.A0326, img: "tutorialContent0006" },
    { tutorialId: 7,    titleTextType: LangConstants.TextType.B0938,  contentTextType: LangConstants.TextType.A0327, img: "tutorialContent0007" },
    { tutorialId: 8,    titleTextType: LangConstants.TextType.B0939,  contentTextType: LangConstants.TextType.A0328, img: "tutorialContent0008" },
    { tutorialId: 9,    titleTextType: LangConstants.TextType.B0940,  contentTextType: LangConstants.TextType.A0329, img: "tutorialContent0009" },
    { tutorialId: 10,   titleTextType: LangConstants.TextType.Fuel,  contentTextType: LangConstants.TextType.A0330, img: "tutorialContent0010" },
    { tutorialId: 11,   titleTextType: LangConstants.TextType.B0942,  contentTextType: LangConstants.TextType.A0331, img: "tutorialContent0011" },
    { tutorialId: 12,   titleTextType: LangConstants.TextType.B0943,  contentTextType: LangConstants.TextType.A0332, img: "tutorialContent0012" },
    { tutorialId: 13,   titleTextType: LangConstants.TextType.B0944,  contentTextType: LangConstants.TextType.A0333, img: "tutorialContent0013" },
    { tutorialId: 14,   titleTextType: LangConstants.TextType.B0945,  contentTextType: LangConstants.TextType.A0334, img: "tutorialContent0014" },
    // { tutorialId: 15,   titleTextType: LangTextType.B0946,  contentTextType: LangTextType.A0335, img: "tutorialContent0015" },
    { tutorialId: 16,   titleTextType: LangConstants.TextType.B0947,  contentTextType: LangConstants.TextType.A0336, img: "tutorialContent0016" },
    { tutorialId: 17,   titleTextType: LangConstants.TextType.B0438,  contentTextType: LangConstants.TextType.A0337, img: "tutorialContent0017" },
    { tutorialId: 18,   titleTextType: LangConstants.TextType.B0949,  contentTextType: LangConstants.TextType.A0338, img: "tutorialContent0018" },
    { tutorialId: 19,   titleTextType: LangConstants.TextType.B0950,  contentTextType: LangConstants.TextType.A0339, img: "tutorialContent0019" },
    { tutorialId: 20,   titleTextType: LangConstants.TextType.B0951,  contentTextType: LangConstants.TextType.A0340, img: "tutorialContent0020" },
    { tutorialId: 21,   titleTextType: LangConstants.TextType.B0952,  contentTextType: LangConstants.TextType.A0341, img: "tutorialContent0021" },
    { tutorialId: 22,   titleTextType: LangConstants.TextType.B0953,  contentTextType: LangConstants.TextType.A0342, img: "tutorialContent0022" },
    { tutorialId: 23,   titleTextType: LangConstants.TextType.B0954,  contentTextType: LangConstants.TextType.A0343, img: "tutorialContent0023" },
    { tutorialId: 24,   titleTextType: LangConstants.TextType.B0955,  contentTextType: LangConstants.TextType.A0344, img: "tutorialContent0024" },
    { tutorialId: 25,   titleTextType: LangConstants.TextType.B0956,  contentTextType: LangConstants.TextType.A0345, img: "tutorialContent0025" },
    { tutorialId: 26,   titleTextType: LangConstants.TextType.B0957,  contentTextType: LangConstants.TextType.A0346, img: "tutorialContent0026" },
    { tutorialId: 27,   titleTextType: LangConstants.TextType.B0958,  contentTextType: LangConstants.TextType.A0347, img: "tutorialContent0027" },
    { tutorialId: 28,   titleTextType: LangConstants.TextType.B0959,  contentTextType: LangConstants.TextType.A0348, img: "tutorialContent0028" },
    { tutorialId: 29,   titleTextType: LangConstants.TextType.B0960,  contentTextType: LangConstants.TextType.A0349, img: "tutorialContent0029" },
    { tutorialId: 30,   titleTextType: LangConstants.TextType.B0961,  contentTextType: LangConstants.TextType.A0350, img: "tutorialContent0030" },
    { tutorialId: 31,   titleTextType: LangConstants.TextType.B0962,  contentTextType: LangConstants.TextType.A0351, img: "tutorialContent0031" },
    { tutorialId: 32,   titleTextType: LangConstants.TextType.B0963,  contentTextType: LangConstants.TextType.A0352, img: "tutorialContent0032" },
    { tutorialId: 33,   titleTextType: LangConstants.TextType.B0964,  contentTextType: LangConstants.TextType.A0353, img: "tutorialContent0033" },
    { tutorialId: 34,   titleTextType: LangConstants.TextType.B0965,  contentTextType: LangConstants.TextType.A0354, img: "tutorialContent0034" },
    { tutorialId: 35,   titleTextType: LangConstants.TextType.B0966,  contentTextType: LangConstants.TextType.A0355, img: "tutorialContent0035" },
    { tutorialId: 36,   titleTextType: LangConstants.TextType.B0967,  contentTextType: LangConstants.TextType.A0356, img: "tutorialContent0036" },
    { tutorialId: 37,   titleTextType: LangConstants.TextType.B0968,  contentTextType: LangConstants.TextType.A0357, img: "tutorialContent0037" },
    { tutorialId: 38,   titleTextType: LangConstants.TextType.B0969,  contentTextType: LangConstants.TextType.A0358, img: "tutorialContent0038" },
    { tutorialId: 39,   titleTextType: LangConstants.TextType.B0970,  contentTextType: LangConstants.TextType.A0359, img: "tutorialContent0039" },
    { tutorialId: 40,   titleTextType: LangConstants.TextType.B0971,  contentTextType: LangConstants.TextType.A0360, img: "tutorialContent0040" },
    { tutorialId: 41,   titleTextType: LangConstants.TextType.B0972,  contentTextType: LangConstants.TextType.A0361, img: "tutorialContent0041" },
    { tutorialId: 42,   titleTextType: LangConstants.TextType.B0973,  contentTextType: LangConstants.TextType.A0362, img: "tutorialContent0042" },
    { tutorialId: 43,   titleTextType: LangConstants.TextType.B0974,  contentTextType: LangConstants.TextType.A0363, img: "tutorialContent0043" },
    { tutorialId: 44,   titleTextType: LangConstants.TextType.B0975,  contentTextType: LangConstants.TextType.A0364, img: "tutorialContent0044" },
    { tutorialId: 45,   titleTextType: LangConstants.TextType.B0976,  contentTextType: LangConstants.TextType.A0365, img: "tutorialContent0045" },
    // { tutorialId: 46,   titleTextType: LangTextType.B0977,  contentTextType: LangTextType.A0366, img: "tutorialContent0046" },
];

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _groupList!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listName!             : UiInterfacesIUiScrollList.IUiScrollList<DataForNameRenderer>;
    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTutorial!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTutorialTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgTutorial!          : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTutorial!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupInfo!            : UiInterfacesIUiContainer.IUiContainer;

    private _selectedIndex                  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
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
                this._labelTutorialTitle.setText(LangUtils.getText(info.titleTextType));
                this._labelTutorial.setText(LangUtils.getText(info.contentTextType));
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
        TweenExecutor.Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        const groupList = this._groupList;
        TweenExecutor.Executor.removeTweens(groupList);
        TweenExecutor.Executor.get(groupList)
            .set({ customAlpha: 0, customX: -40 })
            .to({ customAlpha: 1, customX: 0 }, 200);

        const groupInfo = this._groupInfo;
        TweenExecutor.Executor.removeTweens(groupInfo);
        TweenExecutor.Executor.get(groupInfo)
            .set({ customAlpha: 0, customX: 40 })
            .to({ customAlpha: 1, customX: 0 }, 200);

        await TimerTimerModel.wait();
    }
    protected override async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._imgMask,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        const groupList = this._groupList;
        TweenExecutor.Executor.removeTweens(groupList);
        TweenExecutor.Executor.get(groupList)
            .set({ customAlpha: 1, customX: 0 })
            .to({ customAlpha: 0, customX: -40 }, 200);

        const groupInfo = this._groupInfo;
        TweenExecutor.Executor.removeTweens(groupInfo);
        TweenExecutor.Executor.get(groupInfo)
            .set({ customAlpha: 1, customX: 0 })
            .to({ customAlpha: 0, customX: 40 }, 200);

        await TimerTimerModel.wait();
    }

    private _updateComponentsForLanguage(): void {
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
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

interface DataForNameRenderer extends UiTypesUiListItemData.UiListItemData {
    tutorialInfo    : TutorialInfo;
    index           : number;
    panel           : Panel;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForNameRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData) {
            this._labelName.setText(LangUtils.getText(openData.tutorialInfo.titleTextType));
        }
    }

    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setSelectedIndexAndUpdateView(openData.index);
    }
}
