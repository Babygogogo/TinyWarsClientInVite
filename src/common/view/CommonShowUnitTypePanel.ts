import {
    ForceSkins_Utils,
    GamePanels_Dict,
    GamePanels_Manager,
    Lang_Constants,
    Lang_Utils,
    Numbers_Utils,
    Players_Constants,
    Stages_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Units_UnitView,
    Units_UnitViewPool,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    currentUnitTypeArray    : number[];
    availableUnitTypeArray  : number[];
    getHelpText?            : (() => string) | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listUnitType!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitTypeRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _selectedNumberSet     = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnitType.setItemRendererClass(UnitTypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const numberArray       = openData.currentUnitTypeArray;
        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();
        for (const num of numberArray) {
            selectedNumberSet.add(num);
        }

        this._updateComponentsForLanguage();

        this._btnHelp.setIsVisible(!!openData.getHelpText);
        this._resetList();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listUnitType.removeAllItems();

        await super._onClosed();
    }

    public checkHasSelectedNumber(num: number): boolean {
        return this._selectedNumberSet.has(num);
    }
    public updateOnSelectNumber(num: number): void {
        const selectedNumberSet = this._selectedNumberSet;
        if (selectedNumberSet.has(num)) {
            selectedNumberSet.delete(num);
        } else {
            selectedNumberSet.add(num);
        }

        const list      = this._listUnitType;
        const dataArray = list.getBoundDataArray() ?? [];
        const index     = dataArray.findIndex(v => v?.unitType === num);
        list.updateSingleData(index, dataArray[index]);
    }

    private _onTouchedBtnHelp(): void {
        const getHelpText = this.getOpenData()?.getHelpText;
        if (getHelpText) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => getHelpText(),
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0525);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForUnitTypeRenderer[] = [];
        for (const num of openData.availableUnitTypeArray.concat().sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                unitType   : num,
                gameConfig : gameConfig,
                panel      : this,
            });
        }

        const dataCount     = dataArray.length;
        const rowsCount     = Math.ceil(dataCount / 4);
        const list          = this._listUnitType;
        const listHeight    = Numbers_Utils.getValueInRange({
            rawValue : rowsCount * 34 + (rowsCount - 1) * 6,
            minValue : 120,
            maxValue : Stages_Constants.Dimension.DesignMinHeight - 80,
        });
        this._labelNoData.setIsVisible(!dataCount);
        this._group.setUnscaledManualHeight(listHeight + 80);
        list.setUnscaledManualHeight(listHeight);
        await list.bindData(dataArray);
    }
}

interface DataForUnitTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    unitType    : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    panel       : Panel;
}
class UnitTypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitTypeRenderer> {
    private readonly _groupSelect!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected0!     : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _conUnitView!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelType!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private _unitView                   : Units_UnitView.UnitView | undefined;

    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        if (this._unitView == null) {
            const view      = Units_UnitViewPool.UnitViewPool.getInstance().acquire();
            this._unitView  = view;
            this._conUnitView.addUiChild(view);

            this._updateUnitView();
        }
    }
    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();

        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        if (this._unitView) {
            const view = this._unitView;
            this._conUnitView.removeUiChild(view);

            Units_UnitViewPool.UnitViewPool.getInstance().release(view);
            delete this._unitView;
        }

        await super._onClosed();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const isSelected = openData.panel.checkHasSelectedNumber(openData.unitType);
        this._imgSelected.setIsVisible(isSelected);
        this._imgSelected0.setIsVisible(isSelected);

        this._updateUnitView();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitType = openData.unitType;
        this._labelType.setText(`#${unitType}`);
        this._labelName.setText(Lang_Utils.getUnitName(unitType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = Players_Constants.PlayerIndex.First;
        const unitView      = this._unitView;
        unitView?.loadViewData({
            unitTypeId  : openData.unitType,
            playerIndex : playerIndex,
            skinId      : ForceSkins_Utils.getDefaultSkinId(playerIndex),
        }, true);
        unitView?.refreshAllViews();
    }
}
