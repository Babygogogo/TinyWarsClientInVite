import {
    Helpers_ImageSource,
    Common_Model_CommonModel,
    Lang_Utils,
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
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Utils_Serialization,
} from "../../internal.ts";

export interface OpenData {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    currentUnitType?    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    unitTypeArray       : number[];
    currentSkinId?      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    playerIndexArray    : number[];
    finalSkinIdArray    : number[];
    callback            : (unitType: number, playerIndex: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listSkin!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSkinRenderer>;
    private readonly _listType!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _btnConfirm!   : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSkin.setItemRendererClass(SkinRenderer);
        this._listType.setItemRendererClass(TypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected async _onClosed(): Promise<void> {
        await Promise.all([
            this._listSkin.removeAllItems(),
            this._listType.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async updateOnSelectedSkinIdChanged(): Promise<void> {
        await this._updateListType(undefined);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnConfirm(): void {
        const data = this._listType.getFirstSelectedData();
        if (data == null) {
            return;
        }

        this.getOpenData()?.callback(data.unitType, data.playerIndex);
        this.closePanel();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        await this._updateListSkin(openData.currentSkinId);
        await this._updateListType(openData.currentUnitType);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0913);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
    }
    private async _updateListSkin(selectedSkinId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndexArray  = openData.playerIndexArray;
        const finalSkinIdArray  = openData.finalSkinIdArray;
        const length            = playerIndexArray.length;
        if (length !== finalSkinIdArray.length) {
            return;
        }

        const dataArray: DataForSkinRenderer[] = [];
        for (let i = 0; i < length; ++i) {
            dataArray.push({
                finalSkinId : finalSkinIdArray[i],
                playerIndex : playerIndexArray[i],
                panel       : this,
            });
        }

        const list  = this._listSkin;
        const index = selectedSkinId == null
            ? (list.getFirstSelectedItemIndex() ?? 0)
            : Math.max(0, dataArray.findIndex(v => v.finalSkinId == selectedSkinId));
        await list.bindData(dataArray, true);
        list.setSelectedItemIndex(index);
        list.scrollToItem(index);
    }
    private async _updateListType(selectedUnitType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const selectedData = this._listSkin.getFirstSelectedData();
        if (selectedData == null) {
            return;
        }

        const playerIndex   = selectedData.playerIndex;
        const finalSkinId   = selectedData.finalSkinId;
        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTypeRenderer[] = [];
        for (const newUnitType of openData.unitTypeArray) {
            dataArray.push({
                gameConfig  : gameConfig,
                unitType    : newUnitType,
                playerIndex : playerIndex,
                finalSkinId : finalSkinId,
            });
        }

        const list  = this._listType;
        const index = selectedUnitType == null
            ? (list.getFirstSelectedItemIndex() ?? 0)
            : Math.max(0, dataArray.findIndex(v => v.unitType == selectedUnitType));
        await list.bindData(dataArray);
        list.setSelectedItemIndex(index);
        list.scrollToItem(index);
    }
}

interface DataForSkinRenderer extends Ui_Types_UiListItemData.UiListItemData {
    finalSkinId : number;
    playerIndex : number;
    panel       : Panel;
}
class SkinRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSkinRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForSkinRenderer> {
    private readonly _imgColor! : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        this._updateImgColor();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectedSkinIdChanged();
    }

    private _updateImgColor(): void {
        const skinId = this.getOpenData()?.finalSkinId;
        if (skinId == null) {
            return;
        }

        this._imgColor.loadSource(Helpers_ImageSource.getSkinCircle(skinId, true));
    }
}

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    unitType        : number;
    playerIndex     : number;
    finalSkinId     : number;
}
class TypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conUnitView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _layoutType!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTypeId!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView      = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.UnitAnimationTick,   callback : this._onNotifyUnitAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        this._conUnitView.addUiChild(this._unitView);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelType();
        this._updateUnitView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const newUnitType = openData.unitType;
        this._labelTypeId.setText(`#${newUnitType}`);
        this._labelType.setText(Lang_Utils.getUnitName(newUnitType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutType.arrangeItems();
    }
    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : openData.gameConfig,
            skinId           : openData.finalSkinId,
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                playerIndex : openData.playerIndex,
                unitTypeId  : openData.unitType,
                unitId      : -1,
                gcData      : openData.gameConfig,
            }),
        }));
    }
}
