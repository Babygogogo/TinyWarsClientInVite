import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesUtilsSerialization from "../../tiles/utils/Serialization.ts";
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
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";

type DataForDrawTileBase    = MapEditorModelMeTypes.DataForDrawTileBase;

const MAX_RECENT_COUNT = 8;

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSwitch!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _listType!                     : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileBase!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForTileBaseRenderer>;
    private readonly _listRecent!                   : UiInterfacesIUiScrollList.IUiScrollList<DataForTileBaseRenderer>;
    private readonly _labelRecentTitle!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupBottomRight!             : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupFill!                    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgFill!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelFill!                    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupRealTimeAdjustContainer! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjust!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : UiInterfacesIUiButton.IUiButton;

    private readonly _btnRandomize!                 : UiInterfacesIUiButton.IUiButton;

    private _needFill           = false;
    private _dataListForRecent  : DataForTileBaseRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnSwitch,                  callback: this._onTouchedBtnSwitch },
            { ui: this._btnRandomize,               callback: this._onTouchedBtnRandomize },
            { ui: this._groupFill,                  callback: this._onTouchedGroupFill },
            { ui: this._groupRealTimeAdjust,        callback: this._onTouchedGroupRealTimeAdjust },
            { ui: this._btnHelpRealTimeAdjust,      callback: this._onTouchedBtnHelpRealTimeAdjust },
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
        const index     = HelpersMisc.getExisted(listType.getRevisedFirstIndex(v => v?.baseType === newType));
        listType.setSelectedItemIndex(index);
        if (needScroll) {
            listType.scrollToItem(index);
        }

        await this._updateListTileBase();
    }

    public async updateOnChooseTileBase(data: DataForDrawTileBase): Promise<void> {
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
            gameConfig          : HelpersMisc.getExisted(MapEditorModelMeModel.getWar()?.getGcData()),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseTileDecorationPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onTouchedBtnRandomize(): void {
        const war = MapEditorModelMeModel.getWar();
        if ((war == null) || (war.getIsReviewingMap())) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0657),
            callback    : () => {
                const tileMap   = war.getTileMap();
                const allTiles  = tileMap.getAllTiles();
                for (const tile of allTiles) {
                    tile.setBaseType(Math.floor(Math.random() * 4) + 1);
                }
                for (const tile of allTiles) {
                    const shapeId = MapEditorModelMeHelpers.getAutoTileBaseShapeId(tileMap, tile) ?? 0;
                    if (shapeId != tile.getBaseShapeId()) {
                        tile.setBaseShapeId(shapeId);
                    }
                }
                for (const tile of allTiles) {
                    const { decorationType, shapeId } = MapEditorModelMeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, tile.getGridIndex());
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0032),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0282);
        this._labelFill.setLangText(LangConstants.TextType.B0294);
        this._labelRecentTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(LangConstants.TextType.B1121);

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
        const gameConfig    = HelpersMisc.getExisted(MapEditorModelMeModel.getWar()?.getGcData());
        const baseType      = this._listType.getFirstSelectedData()?.baseType;
        const dataList      : DataForTileBaseRenderer[] = [];
        if (baseType != null) {
            const cfg = HelpersMisc.getExisted(gameConfig.getTileBaseCfg(baseType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel               : this,
                    gameConfig          : gameConfig,
                    dataForDrawTileBase : {
                        baseType    : baseType,
                        shapeId     : shapeId,
                    },
                });
            }
        }

        return dataList;
    }

    private async _updateListType(selectedType: number | undefined): Promise<void> {
        const gameConfig    = HelpersMisc.getExisted(MapEditorModelMeModel.getWar()?.getGcData());
        const dataArray     : DataForTypeRenderer[] = [];
        for (const cfg of gameConfig.getAllEnabledTileBaseCfgArray()) {
            dataArray.push({
                baseType        : cfg.tileBaseTypeId,
                gameConfig      : gameConfig,
                panel           : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.baseType === selectedType) ?? (dataArray.length ? 0 : -1));
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

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    baseType        : number;
    gameConfig      : GameConfigGcData.GcData;
    panel           : Panel;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(LangUtils.getTileBaseName(openData.baseType, openData.gameConfig) ?? LangConstants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.baseType, false);
    }
}

interface DataForTileBaseRenderer extends UiTypesUiListItemData.UiListItemData {
    dataForDrawTileBase : DataForDrawTileBase;
    panel               : Panel;
    gameConfig          : GameConfigGcData.GcData;
}
class TileBaseRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileBaseRenderer> {
    private readonly _labelShapeId! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;

    private _tileView   = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
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
            tileBaseShapeId         : shapeId,
            tileBaseType            : dataForDrawTileBase.baseType,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectShapeId       : null,
            tileObjectType          : null,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : openData.gameConfig,
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
            HelpersMisc.getExisted(MapEditorModelMeModel.getWar()).getDrawer().setModeDrawTileBase(dataForDrawTileBase);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0089),
                callback: () => {
                    const war           = HelpersMisc.getExisted(MapEditorModelMeModel.getWar());
                    const gameConfig    = war.getGcData();
                    const baseType      = dataForDrawTileBase.baseType;
                    const baseShapeId   = dataForDrawTileBase.shapeId;

                    for (const tile of war.getTileMap().getAllTiles()) {
                        const tileData = TilesUtilsSerialization.create({
                            gridIndex               : tile.getGridIndex().toProto().toJson(),
                            playerIndex             : PlayersConstants.PlayerIndex.Neutral,
                            baseType                : baseType,
                            baseShapeId             : baseShapeId,
                            groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
                            isHighlighted           : tile.getIsHighlighted(),
                            unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                            customNameId            : tile.getCustomNameId() ?? null,

                            objectType              : null,
                            objectShapeId           : null,
                            decorationType          : null,
                            decorationShapeId       : null,

                            currentBuildPoint       : null,
                            currentCapturePoint     : null,
                            currentHp               : null,

                            customBuildingData      : null,
                            customCannonData        : null,
                            customCrystalData       : null,
                            customLaserTurretData   : null,
                        });

                        tile.init(tileData, gameConfig);
                        tile.startRunning(war);
                        tile.flushDataToView();
                    }

                    panel.updateOnChooseTileBase(dataForDrawTileBase);
                    panel.closePanel();
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex: war.getCursor().getGridIndex() } as NotificationsDataTypes.BwTileChanged);
                },
            });
        }
    }
}
