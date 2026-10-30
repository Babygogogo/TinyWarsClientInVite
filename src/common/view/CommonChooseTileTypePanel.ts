import {
    Stages_Constants,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Helpers_Collection,
    Numbers_Utils,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
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
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    currentTileTypeArray    : number[];
    availableTileTypeArray  : number[];
    getHelpText             : (() => string) | null;
    callbackOnConfirm       : (tileTypeArray: number[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSelectAll!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSelectAll!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSelectAll!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupSelected!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSelectedTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSelected!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listTileType!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileTypeRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _selectedNumberSet     = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelectAll,     callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listTileType.setItemRendererClass(TileTypeRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listTileType.removeAllItems();

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

        const list      = this._listTileType;
        const dataArray = list.getBoundDataArray() ?? [];
        const index     = dataArray.findIndex(v => v?.tileType === num);
        list.updateSingleData(index, dataArray[index]);
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _onTouchedGroupSelectAll(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();

        const list      = this._listTileType;
        const dataArray = list.getBoundDataArray() ?? [];
        if (!this._imgSelectAll.getIsVisible()) {
            for (const data of dataArray) {
                const tileType = data?.tileType;
                if (tileType != null) {
                    selectedNumberSet.add(tileType);
                }
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

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0718)));
        this._labelSelectAll.setLangText(Lang_Constants.TextType.B0761);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelSelectedTitle.setLangText(Lang_Constants.TextType.B1274);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);

        this._groupSelected.arrangeItems();
        this._groupSelectAll.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const numberArray       = openData.currentTileTypeArray;
        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();
        for (const num of numberArray) {
            selectedNumberSet.add(num);
        }

        this._btnHelp.setIsVisible(!!openData.getHelpText);
        await this._resetList();
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTileTypeRenderer[] = [];
        for (const num of openData.availableTileTypeArray.concat().sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                tileType            : num,
                gameConfig          : gameConfig,
                panel               : this,
            });
        }

        const length                = dataArray.length;
        this._labelNoData.setIsVisible(!length);
        await this._listTileType.bindData(dataArray);

        const rowsCount = Math.ceil(length / 4);
        this._group.setUnscaledManualHeight(Numbers_Utils.getValueInRange({
            rawValue    : Math.max(0, 34 * rowsCount + 6 * (rowsCount - 1)) + 130,
            minValue    : 210,
            maxValue    : Stages_Constants.Dimension.DesignMinHeight,
        }));
    }
    private _updateGroupSelectAll(): void {
        const tileTypeArray = Helpers_Collection.getNonNullElements(this._listTileType.getBoundDataArray()?.map(v => v?.tileType) ?? []);
        const group         = this._groupSelectAll;
        if (!tileTypeArray.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._imgSelectAll.setIsVisible((!!tileTypeArray.length) && (tileTypeArray.every(v => this._selectedNumberSet.has(v))));
        }
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._selectedNumberSet.size} / ${this.getOpenData()?.availableTileTypeArray.length}`);
        this._groupSelected.arrangeItems();
    }
}

interface DataForTileTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    tileType    : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    panel       : Panel;
}
class TileTypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileTypeRenderer> {
    private readonly _groupSelect!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _conTileView!      : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTileType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTileName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView          = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const conTileView   = this._conTileView;
        const tileView      = this._tileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectNumber(openData.tileType);
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();

        this._updateTileView();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType = openData.tileType;
        this._labelTileType.setText(`#${tileType}`);
        this._labelTileName.setText(Lang_Utils.getTileName(tileType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType      = openData.tileType;
        const gameConfig    = openData.gameConfig;
        const objectType    = Helpers_Misc.getExisted(gameConfig.getTileObjectTypeByTileType(tileType));
        const baseType      = Helpers_Misc.getExisted(gameConfig.getTileBaseTypeByTileType(tileType));
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedNumber(tileType));

        this._tileView.init({
            tileBaseType            : baseType,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : objectType,
            tileObjectShapeId       : 0,
            skinId                  : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
    }
}
