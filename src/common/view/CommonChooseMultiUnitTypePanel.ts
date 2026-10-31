import {
    Stages_Constants,
    ForceSkins_Utils,
    GamePanels_Dict,
    Lang_Utils,
    Common_Model_CommonModel,
    Numbers_Utils,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiUnitView,
    Ui_Types_UiUnitViewData,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Utils_Serialization,
} from "../../internal.ts";

export interface OpenData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    currentUnitTypeArray    : number[];
    availableUnitTypeArray  : number[];
    getTitleText?           : () => string;
    getHelpText?            : (() => string) | null;
    callbackOnConfirm       : (unitTypeIdArray: number[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSelectAll!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelSelectAll!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSelectAll!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupSelected!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSelectedTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSelected!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listUnitType!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitTypeRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _selectedNumberSet     = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._groupSelectAll,     callback : this._onTouchedGroupSelectAll },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
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
        this._updateOnOpenDataChanged();
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
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _onTouchedGroupSelectAll(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();

        const list      = this._listUnitType;
        const dataArray = list.getBoundDataArray() ?? [];
        if (!this._imgSelectAll.getIsVisible()) {
            for (const data of dataArray) {
                (data != null) && (selectedNumberSet.add(data.unitType));
            }
        }
        for (let i = 0; i < dataArray.length; ++i) {
            list.updateSingleData(i, dataArray[i]);
        }

        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callbackOnConfirm([...this._selectedNumberSet].sort((v1, v2) => v1 - v2));
        this.closePanel();
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

    private async _updateOnOpenDataChanged(): Promise<void> {
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
        await this._resetList();
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText?.() ?? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0525)));
        this._labelSelectAll.setLangText(Lang_Constants.TextType.B0761);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelSelectedTitle.setLangText(Lang_Constants.TextType.B1274);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);

        this._groupSelected.arrangeItems();
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
        const list          = this._listUnitType;
        const rowsCount     = Math.ceil(dataCount / 4);
        const listHeight    = Numbers_Utils.getValueInRange({
            rawValue : rowsCount * 34 + (rowsCount - 1) * 6,
            minValue : 80,
            maxValue : Stages_Constants.Dimension.DesignMinHeight - 130,
        });
        list.setUnscaledManualHeight(listHeight);
        this._group.setUnscaledManualHeight(listHeight + 130);
        this._labelNoData.setIsVisible(!dataCount);

        await list.bindData(dataArray);
    }
    private _updateGroupSelectAll(): void {
        const numberArray   = this._listUnitType.getBoundDataArray()?.map(v => v?.unitType) ?? [];
        const group         = this._groupSelectAll;
        if (!numberArray.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const numberSet = this._selectedNumberSet;
            this._imgSelectAll.setIsVisible((!!numberArray.length) && (numberArray.every(v => (v != null) && (numberSet.has(v)))));
        }
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._selectedNumberSet.size} / ${this.getOpenData()?.availableUnitTypeArray.length}`);
        this._groupSelected.arrangeItems();
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

    private readonly _conUnitView!      : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelType!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView          = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
            { type : "UnitAnimationTick",   callback : this._onNotifyUnitAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }
    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectNumber(openData.unitType);
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();

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

        const unitType      = openData.unitType;
        const playerIndex   = Players_Constants.PlayerIndex.First;
        const gameConfig    = openData.gameConfig;
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedNumber(unitType));
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }));
    }
}
