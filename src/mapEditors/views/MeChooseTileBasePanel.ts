import {
    Tiles_Utils_Serialization,
    Notifications_Dispatcher,
    Tween_Executor,
    GameConfigs_GameConfig,
    TileBases_Utils,
    MapEditor_Model_MeHelpers,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    MapEditor_Model_MeModel,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
    type Notifications_DataTypes,
    type MapEditor_Model_MeTypes,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const MAX_RECENT_COUNT = 8;

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSwitch!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listType!                     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileBase!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileBaseRenderer>;
    private readonly _listRecent!                   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileBaseRenderer>;
    private readonly _labelRecentTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupBottomRight!             : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupFill!                    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgFill!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelFill!                    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRealTimeAdjustContainer! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjust!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnRandomize!                 : Ui_Interfaces_IUiButton.IUiButton;

    private _needFill           = false;
    private _dataListForRecent  : DataForTileBaseRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnSwitch,                  callback : this._onTouchedBtnSwitch },
            { ui : this._btnRandomize,               callback : this._onTouchedBtnRandomize },
            { ui : this._groupFill,                  callback : this._onTouchedGroupFill },
            { ui : this._groupRealTimeAdjust,        callback : this._onTouchedGroupRealTimeAdjust },
            { ui : this._btnHelpRealTimeAdjust,      callback : this._onTouchedBtnHelpRealTimeAdjust },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);
        this._listTileBase.setItemRendererClass(TileBaseRenderer);
        this._listRecent.setItemRendererClass(TileBaseRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listRecent.removeAllItems(),
            this._listTileBase.removeAllItems(),
            this._listType.removeAllItems(),
        ]);
        await super._onClosed();
    }

    public getNeedFill(): boolean {
        return this._needFill;
    }

    public async setAndReviseSelectedPlayerIndex(newType: number | null, needScroll: boolean): Promise<void> {
        const listType  = this._listType;
        const index     = listType.getRevisedFirstIndex(v => v?.baseType === newType);
        listType.setSelectedItemIndex(index);
        if (needScroll) {
            listType.scrollToItem(index);
        }

        await this._updateListTileBase();
    }

    public async updateOnChooseTileBase(data: MapEditor_Model_MeTypes.DataForDrawTileBase): Promise<void> {
        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawTileBase;
            return (oldData.baseType != data.baseType)
                || (oldData.shapeId != data.shapeId);
        });
        dataList.length     = 0;
        dataList[0]         = {
            dataForDrawTileBase : data,
            panel               : this,
            gameConfig          : Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()?.getGcData()),
        };
        for (const v of filteredList) {
            if (dataList.length < MAX_RECENT_COUNT) {
                dataList.push(v);
            } else {
                break;
            }
        }

        await this._updateListRecent();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnSwitch(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseTileDecorationPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onTouchedBtnRandomize(): void {
        const war = MapEditor_Model_MeModel.getWar();
        if ((war == null) || (war.getIsReviewingMap())) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0657),
            callback   : () => {
                const tileMap   = war.getTileMap();
                const allTiles  = tileMap.getAllTiles();
                for (const tile of allTiles) {
                    tile.setBaseType(Math.floor(Math.random() * 4) + 1);
                }
                for (const tile of allTiles) {
                    const shapeId = MapEditor_Model_MeHelpers.getAutoTileBaseShapeId(tileMap, tile) ?? 0;
                    if (shapeId != tile.getBaseShapeId()) {
                        tile.setBaseShapeId(shapeId);
                    }
                }
                for (const tile of allTiles) {
                    const { decorationType, shapeId } = MapEditor_Model_MeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, tile.getGridIndex());
                    if ((tile.getDecorationType() !== decorationType) || (tile.getDecorationShapeId() !== shapeId)) {
                        tile.setDecorationType(decorationType);
                        tile.setDecorationShapeId(shapeId);
                    }
                }
                for (const tile of allTiles) {
                    tile.flushDataToView();
                }

                this.closePanel();
            },
        });
    }

    private _onTouchedGroupFill(): void {
        this._needFill = !this._needFill;
        this._updateImgFill();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0032),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0282);
        this._labelFill.setLangText(Lang_Constants.TextType.B0294);
        this._labelRecentTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(Lang_Constants.TextType.B1121);

        this._groupFill.arrangeItems();
        this._groupRealTimeAdjust.arrangeItems();
        this._groupRealTimeAdjustContainer.arrangeItems();
        this._groupBottomRight.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        this._needFill = false;
        this._updateImgFill();

        await this._updateListType(this._dataListForRecent[0]?.dataForDrawTileBase.baseType);
        await this._updateListTileBase();
        await this._updateListRecent();
        this._updateImgRealTimeAdjust();
    }

    private _updateImgFill(): void {
        this._imgFill.setIsVisible(this._needFill);
    }

    private _createDataForListTileBase(): DataForTileBaseRenderer[] {
        const gameConfig    = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()?.getGcData());
        const baseType      = this._listType.getFirstSelectedData()?.baseType;
        const dataList      : DataForTileBaseRenderer[] = [];
        if (baseType != null) {
            const cfg = Helpers_Misc.getExisted(TileBases_Utils.getTileBaseCfg(baseType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel               : this,
                    gameConfig          : gameConfig,
                    dataForDrawTileBase : {
                        baseType : baseType,
                        shapeId  : shapeId,
                    },
                });
            }
        }

        return dataList;
    }

    private async _updateListType(selectedType: number | undefined): Promise<void> {
        const gameConfig    = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()?.getGcData());
        const dataArray     : DataForTypeRenderer[] = [];
        for (const cfg of TileBases_Utils.getAllEnabledTileBaseCfgArray()) {
            dataArray.push({
                baseType   : cfg.tileBaseTypeId,
                gameConfig : gameConfig,
                panel      : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.baseType === selectedType));
    }

    private async _updateListTileBase(): Promise<void> {
        await this._listTileBase.bindData(this._createDataForListTileBase());
        this._listTileBase.scrollToItem(0);
    }

    private async _updateListRecent(): Promise<void> {
        await this._listRecent.bindData(this._dataListForRecent);
        this._listRecent.scrollToItem(0);
    }

    private _updateImgRealTimeAdjust(): void {
        this._imgRealTimeAdjust.setIsVisible(!!this.getOpenData()?.war.getDrawer().getIsRealTimeAdjust());
    }
}

interface DataForTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    baseType        : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    panel           : Panel;
}
class TypeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
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

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(Lang_Utils.getTileBaseName(openData.baseType, openData.gameConfig) ?? Lang_Constants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.baseType, false);
    }
}

interface DataForTileBaseRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dataForDrawTileBase : MapEditor_Model_MeTypes.DataForDrawTileBase;
    panel               : Panel;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
}
class TileBaseRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileBaseRenderer> {
    private readonly _labelShapeId! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private _tileView   = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.TileAnimationTick,  callback : this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        tileView.startRunningView();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawTileBase   = openData.dataForDrawTileBase;
        const shapeId               = dataForDrawTileBase.shapeId;
        const tileView              = this._tileView;
        this._labelShapeId.setText(`${shapeId}`);
        tileView.init({
            tileBaseShapeId       : shapeId,
            tileBaseType          : dataForDrawTileBase.baseType,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectShapeId     : null,
            tileObjectType        : null,
            skinId                : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : openData.gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel                 = openData.panel;
        const dataForDrawTileBase   = openData.dataForDrawTileBase;
        if (!panel.getNeedFill()) {
            panel.updateOnChooseTileBase(dataForDrawTileBase);
            panel.closePanel();
            Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar()).getDrawer().setModeDrawTileBase(dataForDrawTileBase);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0089),
                callback   : () => {
                    const war           = Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar());
                    const gameConfig    = war.getGcData();
                    const baseType      = dataForDrawTileBase.baseType;
                    const baseShapeId   = dataForDrawTileBase.shapeId;

                    for (const tile of war.getTileMap().getAllTiles()) {
                        const tileData = Tiles_Utils_Serialization.create({
                            gridIndex              : tile.getGridIndex().toProto().toJson(),
                            playerIndex            : Players_Constants.PlayerIndex.Neutral,
                            baseType               : baseType,
                            baseShapeId            : baseShapeId,
                            groupedLocationIdArray : tile.getGroupedLocationIdArray(),
                            isHighlighted          : tile.getIsHighlighted(),
                            unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
                            customNameId           : tile.getCustomNameId() ?? null,

                            objectType        : null,
                            objectShapeId     : null,
                            decorationType    : null,
                            decorationShapeId : null,

                            currentBuildPoint   : null,
                            currentCapturePoint : null,
                            currentHp           : null,

                            customBuildingData    : null,
                            customCannonData      : null,
                            customCrystalData     : null,
                            customLaserTurretData : null,
                        });

                        tile.init(tileData, gameConfig);
                        tile.startRunning(war);
                        tile.flushDataToView();
                    }

                    panel.updateOnChooseTileBase(dataForDrawTileBase);
                    panel.closePanel();
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileChanged, { gridIndex : war.getCursor().getGridIndex() } as Notifications_DataTypes.BwTileChanged);
                },
            });
        }
    }
}
