import {
    Stages_Constants,
    Tween_Executor,
    Lang_Utils,
    Common_Model_CommonModel,
    Numbers_Utils,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
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
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Utils_Serialization,
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
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
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

    private readonly _unitView      = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.UnitAnimationTick,   callback : this._onNotifyUnitAnimationTick },
            { type : Notifications_TypeId.TypeId.StateIndicatorTick,  callback : this._onNotifyUnitStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch(undefined, undefined, undefined, Sounds_Constants.ShortSfxCode.None);

        this._conUnitView.addUiChild(this._unitView);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelName();
        this._updateUnitView();
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    public onItemTapEvent(): void {
        const data = this.getOpenData();
        data?.panel.updateOnSelectUnitType(data.unitType);
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelName.setText(Lang_Utils.getUnitName(openData.unitType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }
    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const unitType      = openData.unitType;
        const playerIndex   = openData.playerIndex;
        this._labelId.setText(`#${unitType}`);
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : openData.skinId,
            overridingSkinId : openData.overridingSkinId,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), Common_Model_CommonModel.getUnitAnimationTickCount());
        this._layoutName.arrangeItems();
    }
}
