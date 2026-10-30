import {
    Tween_Executor,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

 
type TutorialInfo = {
    tutorialId      : number;
    titleTextType   : Lang_Constants.TextType;
    contentTextType : Lang_Constants.TextType;
    img             : string;
};
const TutorialInfoArray: TutorialInfo[] = [
    {
        tutorialId : 1,    titleTextType : Lang_Constants.TextType.B0932,  contentTextType : Lang_Constants.TextType.A0321, img : "tutorialContent0001", 
    },
    {
        tutorialId : 2,    titleTextType : Lang_Constants.TextType.B0933,  contentTextType : Lang_Constants.TextType.A0322, img : "tutorialContent0002", 
    },
    {
        tutorialId : 3,    titleTextType : Lang_Constants.TextType.B0934,  contentTextType : Lang_Constants.TextType.A0323, img : "tutorialContent0003", 
    },
    {
        tutorialId : 4,    titleTextType : Lang_Constants.TextType.B0935,  contentTextType : Lang_Constants.TextType.A0324, img : "tutorialContent0004", 
    },
    {
        tutorialId : 5,    titleTextType : Lang_Constants.TextType.B0936,  contentTextType : Lang_Constants.TextType.A0325, img : "tutorialContent0005", 
    },
    {
        tutorialId : 6,    titleTextType : Lang_Constants.TextType.B0937,  contentTextType : Lang_Constants.TextType.A0326, img : "tutorialContent0006", 
    },
    {
        tutorialId : 7,    titleTextType : Lang_Constants.TextType.B0938,  contentTextType : Lang_Constants.TextType.A0327, img : "tutorialContent0007", 
    },
    {
        tutorialId : 8,    titleTextType : Lang_Constants.TextType.B0939,  contentTextType : Lang_Constants.TextType.A0328, img : "tutorialContent0008", 
    },
    {
        tutorialId : 9,    titleTextType : Lang_Constants.TextType.B0940,  contentTextType : Lang_Constants.TextType.A0329, img : "tutorialContent0009", 
    },
    {
        tutorialId : 10,   titleTextType : Lang_Constants.TextType.Fuel,  contentTextType : Lang_Constants.TextType.A0330, img : "tutorialContent0010", 
    },
    {
        tutorialId : 11,   titleTextType : Lang_Constants.TextType.B0942,  contentTextType : Lang_Constants.TextType.A0331, img : "tutorialContent0011", 
    },
    {
        tutorialId : 12,   titleTextType : Lang_Constants.TextType.B0943,  contentTextType : Lang_Constants.TextType.A0332, img : "tutorialContent0012", 
    },
    {
        tutorialId : 13,   titleTextType : Lang_Constants.TextType.B0944,  contentTextType : Lang_Constants.TextType.A0333, img : "tutorialContent0013", 
    },
    {
        tutorialId : 14,   titleTextType : Lang_Constants.TextType.B0945,  contentTextType : Lang_Constants.TextType.A0334, img : "tutorialContent0014", 
    },
    // { tutorialId: 15,   titleTextType: LangTextType.B0946,  contentTextType: LangTextType.A0335, img: "tutorialContent0015" },
    {
        tutorialId : 16,   titleTextType : Lang_Constants.TextType.B0947,  contentTextType : Lang_Constants.TextType.A0336, img : "tutorialContent0016", 
    },
    {
        tutorialId : 17,   titleTextType : Lang_Constants.TextType.B0438,  contentTextType : Lang_Constants.TextType.A0337, img : "tutorialContent0017", 
    },
    {
        tutorialId : 18,   titleTextType : Lang_Constants.TextType.B0949,  contentTextType : Lang_Constants.TextType.A0338, img : "tutorialContent0018", 
    },
    {
        tutorialId : 19,   titleTextType : Lang_Constants.TextType.B0950,  contentTextType : Lang_Constants.TextType.A0339, img : "tutorialContent0019", 
    },
    {
        tutorialId : 20,   titleTextType : Lang_Constants.TextType.B0951,  contentTextType : Lang_Constants.TextType.A0340, img : "tutorialContent0020", 
    },
    {
        tutorialId : 21,   titleTextType : Lang_Constants.TextType.B0952,  contentTextType : Lang_Constants.TextType.A0341, img : "tutorialContent0021", 
    },
    {
        tutorialId : 22,   titleTextType : Lang_Constants.TextType.B0953,  contentTextType : Lang_Constants.TextType.A0342, img : "tutorialContent0022", 
    },
    {
        tutorialId : 23,   titleTextType : Lang_Constants.TextType.B0954,  contentTextType : Lang_Constants.TextType.A0343, img : "tutorialContent0023", 
    },
    {
        tutorialId : 24,   titleTextType : Lang_Constants.TextType.B0955,  contentTextType : Lang_Constants.TextType.A0344, img : "tutorialContent0024", 
    },
    {
        tutorialId : 25,   titleTextType : Lang_Constants.TextType.B0956,  contentTextType : Lang_Constants.TextType.A0345, img : "tutorialContent0025", 
    },
    {
        tutorialId : 26,   titleTextType : Lang_Constants.TextType.B0957,  contentTextType : Lang_Constants.TextType.A0346, img : "tutorialContent0026", 
    },
    {
        tutorialId : 27,   titleTextType : Lang_Constants.TextType.B0958,  contentTextType : Lang_Constants.TextType.A0347, img : "tutorialContent0027", 
    },
    {
        tutorialId : 28,   titleTextType : Lang_Constants.TextType.B0959,  contentTextType : Lang_Constants.TextType.A0348, img : "tutorialContent0028", 
    },
    {
        tutorialId : 29,   titleTextType : Lang_Constants.TextType.B0960,  contentTextType : Lang_Constants.TextType.A0349, img : "tutorialContent0029", 
    },
    {
        tutorialId : 30,   titleTextType : Lang_Constants.TextType.B0961,  contentTextType : Lang_Constants.TextType.A0350, img : "tutorialContent0030", 
    },
    {
        tutorialId : 31,   titleTextType : Lang_Constants.TextType.B0962,  contentTextType : Lang_Constants.TextType.A0351, img : "tutorialContent0031", 
    },
    {
        tutorialId : 32,   titleTextType : Lang_Constants.TextType.B0963,  contentTextType : Lang_Constants.TextType.A0352, img : "tutorialContent0032", 
    },
    {
        tutorialId : 33,   titleTextType : Lang_Constants.TextType.B0964,  contentTextType : Lang_Constants.TextType.A0353, img : "tutorialContent0033", 
    },
    {
        tutorialId : 34,   titleTextType : Lang_Constants.TextType.B0965,  contentTextType : Lang_Constants.TextType.A0354, img : "tutorialContent0034", 
    },
    {
        tutorialId : 35,   titleTextType : Lang_Constants.TextType.B0966,  contentTextType : Lang_Constants.TextType.A0355, img : "tutorialContent0035", 
    },
    {
        tutorialId : 36,   titleTextType : Lang_Constants.TextType.B0967,  contentTextType : Lang_Constants.TextType.A0356, img : "tutorialContent0036", 
    },
    {
        tutorialId : 37,   titleTextType : Lang_Constants.TextType.B0968,  contentTextType : Lang_Constants.TextType.A0357, img : "tutorialContent0037", 
    },
    {
        tutorialId : 38,   titleTextType : Lang_Constants.TextType.B0969,  contentTextType : Lang_Constants.TextType.A0358, img : "tutorialContent0038", 
    },
    {
        tutorialId : 39,   titleTextType : Lang_Constants.TextType.B0970,  contentTextType : Lang_Constants.TextType.A0359, img : "tutorialContent0039", 
    },
    {
        tutorialId : 40,   titleTextType : Lang_Constants.TextType.B0971,  contentTextType : Lang_Constants.TextType.A0360, img : "tutorialContent0040", 
    },
    {
        tutorialId : 41,   titleTextType : Lang_Constants.TextType.B0972,  contentTextType : Lang_Constants.TextType.A0361, img : "tutorialContent0041", 
    },
    {
        tutorialId : 42,   titleTextType : Lang_Constants.TextType.B0973,  contentTextType : Lang_Constants.TextType.A0362, img : "tutorialContent0042", 
    },
    {
        tutorialId : 43,   titleTextType : Lang_Constants.TextType.B0974,  contentTextType : Lang_Constants.TextType.A0363, img : "tutorialContent0043", 
    },
    {
        tutorialId : 44,   titleTextType : Lang_Constants.TextType.B0975,  contentTextType : Lang_Constants.TextType.A0364, img : "tutorialContent0044", 
    },
    {
        tutorialId : 45,   titleTextType : Lang_Constants.TextType.B0976,  contentTextType : Lang_Constants.TextType.A0365, img : "tutorialContent0045", 
    },
    // { tutorialId: 46,   titleTextType: LangTextType.B0977,  contentTextType: LangTextType.A0366, img: "tutorialContent0046" },
];

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupList!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listName!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForNameRenderer>;
    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupTutorial!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTutorialTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgTutorial!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTutorial!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupInfo!            : Ui_Interfaces_IUiContainer.IUiContainer;

    private _selectedIndex                  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBack,    callback : this.closePanel },
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
        Tween_Executor.Executor.reset({
            obj        : this._imgMask,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        const groupList = this._groupList;
        Tween_Executor.Executor.removeTweens(groupList);
        Tween_Executor.Executor.get(groupList)
            .set({ customAlpha : 0, customX : -40 })
            .to({ customAlpha : 1, customX : 0 }, 200);

        const groupInfo = this._groupInfo;
        Tween_Executor.Executor.removeTweens(groupInfo);
        Tween_Executor.Executor.get(groupInfo)
            .set({ customAlpha : 0, customX : 40 })
            .to({ customAlpha : 1, customX : 0 }, 200);

        await Timer_TimerModel.wait();
    }
    protected override async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._imgMask,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        const groupList = this._groupList;
        Tween_Executor.Executor.removeTweens(groupList);
        Tween_Executor.Executor.get(groupList)
            .set({ customAlpha : 1, customX : 0 })
            .to({ customAlpha : 0, customX : -40 }, 200);

        const groupInfo = this._groupInfo;
        Tween_Executor.Executor.removeTweens(groupInfo);
        Tween_Executor.Executor.get(groupInfo)
            .set({ customAlpha : 1, customX : 0 })
            .to({ customAlpha : 0, customX : 40 }, 200);

        await Timer_TimerModel.wait();
    }

    private _updateComponentsForLanguage(): void {
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _createDataForListName(): DataForNameRenderer[] {
        const data: DataForNameRenderer[] = [];
        for (let index = 0; index < TutorialInfoArray.length; ++index) {
            data.push({
                index,
                tutorialInfo : TutorialInfoArray[index],
                panel        : this,
            });
        }

        return data;
    }
}

interface DataForNameRenderer extends Ui_Types_UiListItemData.UiListItemData {
    tutorialInfo    : TutorialInfo;
    index           : number;
    panel           : Panel;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForNameRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

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
