import {
    Stages_Constants,
    Tween_Executor,
    ForceSkins_Utils,
    Helpers_Misc,
    Lang_Utils,
    Numbers_Utils,
    Players_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
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
    currentTileType     : number;
    tileTypeArray       : number[];
    callback            : (tileType: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTips!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listType!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;

    private _selectedTileType       : number | null = null;

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
        const currentTileType = this.getOpenData()?.currentTileType;
        if (currentTileType == null) {
            return;
        }

        this._selectedTileType = currentTileType;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listType.removeAllItems();

        await super._onClosed();
    }

    public checkIsTileTypeSelected(tileType: number): boolean {
        return this._selectedTileType === tileType;
    }
    public updateOnSelectedTileType(tileType: number): void {
        const oldTileType = this._selectedTileType;
        if (oldTileType === tileType) {
            this.getOpenData()?.callback(tileType);
            this.closePanel();
        } else {
            this._selectedTileType = tileType;

            const list      = this._listType;
            const dataArray = list.getBoundDataArray() ?? [];
            const oldIndex  = dataArray.findIndex(v => v?.tileType === oldTileType);
            const newIndex  = dataArray.findIndex(v => v?.tileType === tileType);
            if (oldIndex >= 0) {
                list.updateSingleData(oldIndex, dataArray[oldIndex]);
            }
            if (newIndex >= 0) {
                list.updateSingleData(newIndex, dataArray[newIndex]);
            }
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0516);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
    }
    private async _updateListType(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTypeRenderer[] = [];
        for (const newTileType of openData.tileTypeArray) {
            dataArray.push({
                gameConfig : gameConfig,
                tileType   : newTileType,
                panel      : this,
                callback   : openData.callback,
            });
        }
        await this._listType.bindData(dataArray);

        const rowCount = Math.ceil(dataArray.length / 4);
        this._group.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            rawValue : rowCount * 36 + (rowCount - 1) * 10 + 80,
            minValue : 200,
            maxValue : Stages_Constants.Dimension.DesignMinHeight,
        }));
    }
}

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    tileType    : number;
    callback    : (tileType: number) => void;
    panel       : Panel;
}
class TypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView      = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.TileAnimationTick,   callback : this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const conTileView   = this._conTileView;
        const tileView      = this._tileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelId();
        this._updateLabelType();
        this._updateTileView();
        this._updateImgSelected();
    }

    public onItemTapEvent(): void {
        const data = this.getOpenData();
        data?.panel.updateOnSelectedTileType(data.tileType);
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(Lang_Utils.getTileName(openData.tileType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }
    private _updateLabelId(): void {
        this._labelId.setText(`#${this.getOpenData()?.tileType}`);
        this._layoutName.arrangeItems();
    }
    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType      = openData.tileType;
        const gameConfig    = openData.gameConfig;
        this._tileView.init({
            tileBaseType          : Helpers_Misc.getExisted(gameConfig.getTileBaseTypeByTileType(tileType)),
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : Helpers_Misc.getExisted(gameConfig.getTileObjectTypeByTileType(tileType)),
            tileObjectShapeId     : 0,
            skinId                : ForceSkins_Utils.getDefaultSkinId(Players_Constants.PlayerIndex.Neutral),
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
        });
    }
    private _updateImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSelected.setIsVisible(openData.panel.checkIsTileTypeSelected(openData.tileType));
    }
}
