import {
    Lang_Constants,
    Lang_Utils,
    Numbers_Utils,
    Sounds_Constants,
    Sounds_SoundPlayer,
    Stages_Constants,
    Tween_Executor,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Units_UnitView,
    Units_UnitViewPool,
    type AuxiliaryTypes_AuxiliaryTypes,
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
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    currentUnitType     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    unitTypeArray       : number[];
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    getTitleText?       : () => string;
    callback            : (unitType: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listType!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _labelTips!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private _selectedUnitType       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        await this._listType.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectUnitType(unitType: number): void {
        if (this._selectedUnitType !== unitType) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._selectedUnitType = unitType;
        } else {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
            this.getOpenData()?.callback(unitType);
            this.closePanel();
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListType();
    }

    private _updateComponentsForLanguage(): void {
        const func              = this.getOpenData()?.getTitleText;
        this._labelTitle.setText(func ? func() : Lang_Utils.getText(Lang_Constants.TextType.B0516));
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
    }
    private async _updateListType(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex       = openData.playerIndex;
        const gameConfig        = openData.gameConfig;
        const skinId            = openData.skinId;
        const overridingSkinId  = openData.overridingSkinId;
        const dataArray         : DataForTypeRenderer[] = [];
        for (const unitType of openData.unitTypeArray) {
            dataArray.push({
                gameConfig       : gameConfig,
                unitType         : unitType,
                playerIndex      : playerIndex,
                skinId           : skinId,
                overridingSkinId : overridingSkinId,
                panel            : this,
            });
        }

        const currentUnitType   = openData.currentUnitType;
        const list              = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(currentUnitType == null ? -1 : dataArray.findIndex(v => v.unitType === currentUnitType));

        const rowCount          = Math.ceil(dataArray.length / 4);
        this._selectedUnitType  = currentUnitType;
        this._group.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            rawValue : rowCount * 36 + (rowCount - 1) * 10 + 80,
            minValue : 200,
            maxValue : Stages_Constants.Dimension.DesignMinHeight,
        }));
    }
}

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    unitType            : number;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    panel               : Panel;
}
class TypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conUnitView!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private _unitView               : Units_UnitView.UnitView | undefined;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch(undefined, undefined, undefined, Sounds_Constants.ShortSfxCode.None);
    }

    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        {
            const imgSelected = this._imgSelected;
            imgSelected.setAlpha(0);
            Tween_Executor.Executor.removeTweens(imgSelected);
            Tween_Executor.Executor.get(imgSelected, { loop : true })
                .to({ customAlpha : 0.6 }, 500)
                .to({ customAlpha : 0 }, 500);
        }

        if (this._unitView == null) {
            const view      = Units_UnitViewPool.UnitViewPool.getInstance().acquire();
            this._unitView  = view;
            this._conUnitView.addUiChild(view);

            this._updateUnitView();
        }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelNameAndId();
        this._updateUnitView();
    }
    protected async _onClosed(): Promise<void> {
        if (this._unitView) {
            const view = this._unitView;
            this._conUnitView.removeUiChild(view);

            Units_UnitViewPool.UnitViewPool.getInstance().release(view);
            delete this._unitView;
        }

        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    public onItemTapEvent(): void {
        const data = this.getOpenData();
        data?.panel.updateOnSelectUnitType(data.unitType);
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelNameAndId();
    }

    private _updateLabelNameAndId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitType = openData.unitType;
        this._labelId.setText(`#${unitType}`);
        this._labelName.setText(Lang_Utils.getUnitName(unitType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }
    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitView = this._unitView;
        unitView?.loadViewData({
            unitTypeId  : openData.unitType,
            playerIndex : openData.playerIndex,
            skinId      : openData.overridingSkinId ?? openData.skinId,
        }, true);
        unitView?.refreshAllViews();
    }
}
