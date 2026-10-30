import {
    ForceSkins_Utils,
    Common_Model_CommonModel,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    ReplayWar_Model_RwWarBase,
    FloatText,
    SinglePlayerWar_Model_SpwWar,
    Tiles_TileView,
    Ui_Components_UiUnitView,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    GridMarks_Utils,
    Tiles_Constants_CustomLimits,
    GamePanels_Manager,
    Tiles_Utils_Serialization,
    Helpers_Collection,
    Tiles_Constants_Common,
    Notifications_Dispatcher,
    Lang_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Helpers_ImageSource,
    Helpers_Text,
    GridMarks_Constants,
    Tiles_Constants_MapWeapon,
    Players_Constants,
    Sounds_SoundPlayer,
    MultiPlayerWar_Model_MpwProxy,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Types_UiUnitViewData,
    type Notifications_DataTypes,
    type Tiles_ITile,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Constants,
    WarTypes_Utils,
    Units_Utils_Serialization,
    type Egret_Egret,
} from "../../internal.ts";

import type { TileTemplateCfg } from "../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { S as MpwCommonMarkGridResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import { TileCustomBuildingData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";

let _selectedMarkTypeId         = GridMarks_Constants.TypeId.MinMarkTypeId;

export interface OpenData {
    tile                    : Tiles_ITile.ITile;
    callbackForAddUnit      : (() => void) | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnTilesInfo!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddUnit!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutName!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conTileView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModifyType!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyName!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listInfo!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForInfoRenderer>;

    private readonly _groupMoveCost!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutMoveCost2!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCost1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listMoveCost!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private readonly _groupDamageChart!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutDefense1!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDefense1!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub1!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutDefense2!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDefense2!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain2!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub2!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listDamageChart!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDamageRenderer>;

    private readonly _groupButtons!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnMarkType!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgMarkType!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnMark!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUnmark!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBatchMark!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _tileView              = new Tiles_TileView.TileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.ActionPlannerStateChanged,     callback: this._onNotifyBwPlannerStateChanged },
            { type: Notifications_TypeId.TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            { type: Notifications_TypeId.TypeId.StateIndicatorTick,              callback: this._onNotifyStateIndicatorTick },
            { type: Notifications_TypeId.TypeId.BwTileIsHighlightedChanged,      callback: this._onNotifyTileIsHighlightedChanged },
            { type: Notifications_TypeId.TypeId.BwTileBuffChanged,               callback: this._onNotifyTileBuffChanged },
            { type: Notifications_TypeId.TypeId.BwTileCustomNameIdChanged,       callback: this._onNotifyTileCustomNameIdChanged },
            { type: Notifications_TypeId.TypeId.MsgMpwCommonMarkTile,            callback: this._onNotifyMsgMpwCommonMarkGrid },
        ]);
        this._setUiListenerArray([
            { ui: this._btnModifyType,                          callback: this._onTouchedBtnModifyType },
            { ui: this._btnModifyName,                          callback: this._onTouchedBtnModifyName },
            { ui: this._btnMarkType,                            callback: this._onTouchedBtnMarkType },
            { ui: this._btnMark,                                callback: this._onTouchedBtnMark },
            { ui: this._btnUnmark,                              callback: this._onTouchedBtnUnmark },
            { ui: this._btnBatchMark,                           callback: this._onTouchedBtnBatchMark },
            { ui: this._btnAddUnit,                             callback: this._onTouchedBtnAddUnit },
            { ui: this._btnTilesInfo,                           callback: this._onTouchedBtnTilesInfo },
            { ui: this._btnClose,                               callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listInfo.setItemRendererClass(InfoRenderer);
        this._listMoveCost.setItemRendererClass(MoveCostRenderer);
        this._listDamageChart.setItemRendererClass(DamageRenderer);

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        conTileView.addUiChild(tileView.getImgBuff());
        conTileView.addUiChild(tileView.getImgHighlight());
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listDamageChart.removeAllItems(),
            this._listInfo.removeAllItems(),
            this._listMoveCost.removeAllItems(),
        ]);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyBwPlannerStateChanged(): void {
        // this.close();
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateTileAnimation();
    }
    private _onNotifyStateIndicatorTick(): void {
        this._tileView.updateImgBuff();
    }
    private _onNotifyTileIsHighlightedChanged(): void {
        this._updateTileView();
    }
    private _onNotifyTileBuffChanged(e: Egret_Egret.Event): void {
        if ((e.data as Notifications_DataTypes.BwTileBuffChanged).tile === this.getOpenData()?.tile) {
            this._updateTileView();
            this._updateListInfo();
        }
    }
    private _onNotifyTileCustomNameIdChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyMsgMpwCommonMarkGrid(e: Egret_Egret.Event): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const tileId = tile.getGridIndex().getGridId(tile.getWar().getTileMap().getMapSize());
        if ((e.data as MpwCommonMarkGridResponse).getGridIdArrayForAddMark().indexOf(tileId) >= 0) {
            FloatText.showLang(Lang_Constants.TextType.A0848);
        }

        this._updateBtnMarkAndUnmark();
    }

    private _onTouchedBtnModifyType(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war = tile.getWar();
        if (!war.getCanCheat()) {
            return;
        }

        const gameConfig = war.getGcData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseTileInfoPanel, {
            gameConfig          : gameConfig,
            finalSkinIdArray    : ForceSkins_Utils.getFinalSkinIdArray(war, true),
            currentTileInfo     : {
                tileBaseShapeId         : tile.getBaseShapeId(),
                tileBaseType            : tile.getBaseType(),
                tileDecorationShapeId   : tile.getDecorationShapeId(),
                tileDecorationType      : tile.getDecorationType(),
                tileObjectShapeId       : tile.getObjectShapeId(),
                tileObjectType          : tile.getObjectType(),
                tilePlayerIndex         : tile.getPlayerIndex(),
            },
            callback        : tileInfo => {
                const gridIndex         = tile.getGridIndex();
                const tileBaseType      = tileInfo.tileBaseType;
                const tileObjectType    = tileInfo.tileObjectType;
                const newCfg            = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType, tileObjectType));
                const data              = Tiles_Utils_Serialization.create({
                    gridIndex               : gridIndex.toProto().toJson(),
                    groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
                    playerIndex             : tileInfo.tilePlayerIndex,
                    baseType                : tileBaseType,
                    baseShapeId             : tileInfo.tileBaseShapeId,
                    objectType              : tileObjectType,
                    objectShapeId           : tileInfo.tileObjectShapeId,
                    decorationType          : tileInfo.tileDecorationType,
                    decorationShapeId       : tileInfo.tileDecorationShapeId,
                    isHighlighted           : tile.getIsHighlighted(),
                    unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                    customNameId            : tile.getCustomNameId() ?? null,

                    currentHp               : newCfg.getMaxHp() ?? null,
                    currentBuildPoint       : null,
                    currentCapturePoint     : null,

                    customBuildingData      : null,
                    customCannonData        : null,
                    customCrystalData       : null,
                    customLaserTurretData   : null,
                });

                tile.init(data, gameConfig);
                tile.startRunning(war);
                tile.flushDataToView();

                war.updateTilesAndUnitsOnVisibilityChanged(false);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileChanged, { gridIndex } as Notifications_DataTypes.BwTileChanged);

                this._updateView();
            },
        });
    }
    private _onTouchedBtnModifyName(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war = tile.getWar();
        if (!war.getCanCheat()) {
            return;
        }

        const arr = war.getTileMap().getTileCustomNameArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B1430),
            availableNumberArray    : Helpers_Collection.createRange(0, Tiles_Constants_Common.CustomName.MaxId + 1, 1),
            currentNumber           : tile.getCustomNameId(),
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${Lang_Utils.getText(Lang_Constants.TextType.B0391)})`;
                } else {
                    return Lang_Utils.getLanguageText({ textArray: arr?.find(v => (v.getNameId()) === num)?.getNameTextArray() ?? [] }) ?? `----`;
                }
            },
            callbackForSettings     : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeTileCustomNameListPanel, { war: war });
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel);
            },
            callbackOnConfirm       : num => tile.setCustomNameId(num == 0 ? null : num),
        });
    }
    private _onTouchedBtnMarkType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleGridMarkPanel, {
            currentMarkTypeId   : _selectedMarkTypeId,
            callback            : markTypeId => {
                _selectedMarkTypeId = markTypeId;
                this._updateImgMarkType();
                this._updateBtnMarkAndUnmark();
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleGridMarkPanel);
            },
        });
    }
    private _onTouchedBtnMark(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war       = tile.getWar();
        const gridId    = tile.getGridIndex().getGridId(war.getTileMap().getMapSize());
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const player = war.getPlayerLoggedIn();
            if ((player == null) || (player.getMarkTypeId(gridId) === _selectedMarkTypeId)) {
                return;
            }

            MultiPlayerWar_Model_MpwProxy.reqMpwCommonMarkGrid(Helpers_Misc.getExisted(war.getWarId()), [gridId], [], _selectedMarkTypeId);

        } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
            if (GridMarks_Utils.addGridMark(war.getGridMarkData().getGridIdAndMarkTypeIdList(), gridId, _selectedMarkTypeId)) {
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkAdded, {
                    war     : war,
                    gridId  : gridId,
                } as Notifications_DataTypes.GridMarkAdded);

                FloatText.showLang(Lang_Constants.TextType.A0848);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            if (GridMarks_Utils.addGridMark(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), gridId, _selectedMarkTypeId)) {
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkAdded, {
                    war     : war,
                    gridId  : gridId,
                } as Notifications_DataTypes.GridMarkAdded);

                FloatText.showLang(Lang_Constants.TextType.A0848);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

        } else {
            // TODO
            const player = war.getPlayerInTurn();
            if (player.getMarkTypeId(gridId)) {
                return;
            }

            player.addGridMark(gridId, _selectedMarkTypeId);
            this._updateBtnMarkAndUnmark();
            FloatText.showLang(Lang_Constants.TextType.A0848);
        }
    }
    private _onTouchedBtnUnmark(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war       = tile.getWar();
        const gridId    = tile.getGridIndex().getGridId(war.getTileMap().getMapSize());
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const player = war.getPlayerLoggedIn();
            if ((player == null) || (!player.getMarkTypeId(gridId))) {
                return;
            }

            MultiPlayerWar_Model_MpwProxy.reqMpwCommonMarkGrid(Helpers_Misc.getExisted(war.getWarId()), [], [gridId], _selectedMarkTypeId);

        } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
            if (GridMarks_Utils.deleteGridMark(war.getGridMarkData().getGridIdAndMarkTypeIdList(), gridId)) {
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkDeleted, {
                    war     : war,
                    gridId  : gridId,
                } as Notifications_DataTypes.GridMarkDeleted);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            if (GridMarks_Utils.deleteGridMark(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), gridId)) {
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkDeleted, {
                    war     : war,
                    gridId  : gridId,
                } as Notifications_DataTypes.GridMarkDeleted);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

        } else {
            // TODO
            const player = war.getPlayerInTurn();
            if (!player.getMarkTypeId(gridId)) {
                return;
            }

            player.deleteGridMark(gridId);
            this._updateBtnMarkAndUnmark();
        }
    }
    private _onTouchedBtnBatchMark(): void {
        const war = this.getOpenData()?.tile.getWar();
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwMarkGridPanel, {
            war : war,
        });
        this.closePanel();
    }
    private _onTouchedBtnAddUnit(): void {
        const callback = this.getOpenData()?.callbackForAddUnit;
        if (callback == null) {
            return;
        }

        callback();
        this.closePanel();
    }
    private _onTouchedBtnTilesInfo(): void {
        const gameConfig = this.getOpenData()?.tile.getGameConfig();
        if (gameConfig == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonTileChartPanel, {
            gameConfig  : gameConfig,
        });
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnAddUnit();
        this._updateImgMarkType();
        this._updateBtnMarkAndUnmark();
        this._updateLabelName();
        this._updateTileView();
        this._updateBtnModifyType();
        this._updateBtnModifyName();
        this._updateListInfo();
        this._updateGroupMoveCost();
        this._updateGroupDamageChart();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0423);
        this._labelMoveCostTitle1.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCost1.setLangText(Lang_Constants.TextType.B1282);
        this._labelMoveCost2.setLangText(Lang_Constants.TextType.B1282);
        this._labelDefense1.setLangText(Lang_Constants.TextType.B0334);
        this._labelDefense2.setLangText(Lang_Constants.TextType.B0334);
        this._labelMain1.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub1.setLangText(Lang_Constants.TextType.B0693);
        this._labelMain2.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub2.setLangText(Lang_Constants.TextType.B0693);
        this._btnBatchMark.setLangText(Lang_Constants.TextType.B1109);
        this._btnAddUnit.setLangText(Lang_Constants.TextType.B0535);
        this._btnTilesInfo.setLangText(Lang_Constants.TextType.B0910);
        this._btnClose.setLangText(Lang_Constants.TextType.B0204);
        this._btnMark.setLangText(Lang_Constants.TextType.B0914);
        this._btnUnmark.setLangText(Lang_Constants.TextType.B0915);

        this._layoutMoveCost1.arrangeItems();
        this._layoutMoveCost2.arrangeItems();
        this._layoutDefense1.arrangeItems();
        this._layoutDefense2.arrangeItems();
    }

    private _updateBtnAddUnit(): void {
        this._btnAddUnit.setIsVisible(this.getOpenData()?.callbackForAddUnit != null);
    }

    private _updateImgMarkType(): void {
        this._imgMarkType.loadSource(Helpers_ImageSource.getGridMark(_selectedMarkTypeId));
    }

    private _updateBtnMarkAndUnmark(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war       = tile.getWar();
        const gridId    = tile.getGridIndex().getGridId(war.getTileMap().getMapSize());
        const btnMark   = this._btnMark;
        const btnUnmark = this._btnUnmark;
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const player    = war.getPlayerLoggedIn();
            const canMark   = (player != null) && (player.getMarkTypeId(gridId) !== _selectedMarkTypeId);
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);

        } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
            const canMark = war.getGridMarkData().getGridIdAndMarkTypeIdList().find(v => v.getGridId() === gridId)?.getMarkTypeId() !== _selectedMarkTypeId;
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const canMark = war.getSaveSlotExtraData().getGridMarkData()?.getGridIdAndMarkTypeIdList().find(v => v.getGridId() === gridId)?.getMarkTypeId() !== _selectedMarkTypeId;
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);

        } else {
            // TODO
            const canMark       = !war.getPlayerInTurn().getMarkTypeId(gridId);
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);
        }
    }

    private _updateLabelName(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const languageType1 = Lang_Utils.getCurrentLanguageType();
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        const customName    = tile.getCustomName(languageType1);
        const customName1   = tile.getCustomName(languageType2);
        const labelName     = this._labelName;
        const labelName1    = this._labelName1;
        if ((customName) ?? (customName1)) {
            labelName.setText(customName ?? customName1 ?? Lang_Constants.UndefinedError);
            labelName1.setText(customName ? customName1 ?? `----` : `----`);
        } else {
            const tileType      = tile.getTileTypeId();
            const gameConfig    = tile.getGameConfig();
            labelName.setText(Lang_Utils.getTileName(tileType, gameConfig) ?? Lang_Constants.UndefinedError);
            labelName1.setText(Lang_Utils.getTileName(tileType, gameConfig, languageType2) ?? Lang_Constants.UndefinedError);
        }
        this._layoutName.arrangeItems();
    }

    private _updateTileView(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const tileView  = this._tileView;
        const war       = tile.getWar();
        tileView.setData({
            gameConfig          : tile.getGameConfig(),
            tileData            : tile.serialize(),
            hasFog              : tile.getHasFog(),
            skinId              : tile.getSkinId(),
            overridingSkinId    : ForceSkins_Utils.getRawOverridingSkinId(war, tile.getPlayerIndex()),
            themeType           : tile.getTileThemeType(),
            isFullReplay        : war instanceof ReplayWar_Model_RwWar.RwWar,
        });
        tileView.updateView();
    }

    private _updateBtnModifyType(): void {
        this._btnModifyType.setIsVisible(!!this.getOpenData()?.tile.getWar().getCanCheat());
    }

    private _updateBtnModifyName(): void {
        this._btnModifyName.setIsVisible(!!this.getOpenData()?.tile.getWar().getCanCheat());
    }

    private async _updateListInfo(): Promise<void> {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war       = tile.getWar();
        const dataArray : DataForInfoRenderer[] = Helpers_Collection.getNonNullElements([
            createInfoDefenseBonus(war, tile),
            createInfoIncome(war, tile),
            createInfoVision(war, tile),
            createInfoHideUnitCategory(war, tile),
            createInfoProduceUnitCategory(war, tile),
            createInfoGlobalBonus(war, tile),
            createInfoRepairUnitCategory(war, tile),
            createInfoBlockEnemyUnit(war, tile),
            createInfoCoBoardUnit(war, tile),
            createInfoHp(war, tile),
            createInfoCapturePoint(war, tile),
            createInfoIsDefeatOnCapture(war, tile),
            createInfoBuildPoint(war, tile),
            createInfoIsHighlighted(war, tile),
            createInfoBuff(war, tile),
            createInfoCrystalRadius(war, tile),
            createInfoCrystalPriority(war, tile),
            createInfoCrystalCanAffectSelf(war, tile),
            createInfoCrystalCanAffectAlly(war, tile),
            createInfoCrystalCanAffectEnemy(war, tile),
            createInfoCrystalDeltaFund(war, tile),
            createInfoCrystalDeltaEnergyPercentage(war, tile),
            createInfoCrystalDeltaHp(war, tile),
            createInfoCrystalDeltaFuelPercentage(war, tile),
            createInfoCrystalDeltaPrimaryAmmoPercentage(war, tile),
            createInfoCannonRangeForUp(war, tile),
            createInfoCannonRangeForRight(war, tile),
            createInfoCannonRangeForDown(war, tile),
            createInfoCannonRangeForLeft(war, tile),
            createInfoCannonPriority(war, tile),
            createInfoCannonMaxTargetCount(war, tile),
            createInfoCannonCanAffectSelf(war, tile),
            createInfoCannonCanAffectAlly(war, tile),
            createInfoCannonCanAffectEnemy(war, tile),
            createInfoCannonDeltaHp(war, tile),
            createInfoCannonDeltaFuelPercentage(war, tile),
            createInfoCannonDeltaPrimaryAmmoPercentage(war, tile),
            createInfoLaserTurretRangeForUp(war, tile),
            createInfoLaserTurretRangeForRight(war, tile),
            createInfoLaserTurretRangeForDown(war, tile),
            createInfoLaserTurretRangeForLeft(war, tile),
            createInfoLaserTurretPriority(war, tile),
            createInfoLaserTurretCanAffectSelf(war, tile),
            createInfoLaserTurretCanAffectAlly(war, tile),
            createInfoLaserTurretCanAffectEnemy(war, tile),
            createInfoLaserTurretDeltaHp(war, tile),
            createInfoLaserTurretDeltaFuelPercentage(war, tile),
            createInfoLaserTurretDeltaPrimaryAmmoPercentage(war, tile),
        ]);

        let index = 0;
        for (const data of dataArray) {
            data.index = index++;
        }
        await this._listInfo.bindData(dataArray);
    }

    private async _updateGroupMoveCost(): Promise<void> {
        const group = this._groupMoveCost;
        if (this.getOpenData()?.tile.getMaxHp() != null) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            await this._listMoveCost.bindData(this._createDataForListMoveCost());
        }
    }

    private async _updateGroupDamageChart(): Promise<void> {
        const group = this._groupDamageChart;
        if (this.getOpenData()?.tile.getMaxHp() == null) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            await this._listDamageChart.bindData(this._createDataForListDamageChart());
        }
    }

    private _createDataForListMoveCost(): DataForMoveCostRenderer[] {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return [];
        }

        const gameConfig        = tile.getGameConfig();
        const tileCfg           = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(tile.getTileTypeId()));
        const playerIndex       = tile.getPlayerIndex() || 1;
        const skinId            = tile.getSkinId();
        const overridingSkinId  = ForceSkins_Utils.getRawOverridingSkinId(tile.getWar(), playerIndex);

        const dataArray : DataForMoveCostRenderer[] = [];
        let index       = 0;
        for (const unitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                index               : index,
                gameConfig          : gameConfig,
                unitType            : unitType,
                tileCfg             : tileCfg,
                playerIndex         : playerIndex,
                skinId              : skinId,
                overridingSkinId    : overridingSkinId,
            });
            ++index;
        }

        return dataArray.sort(sorterForDataForList);
    }

    private _createDataForListDamageChart(): DataForDamageRenderer[] {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return [];
        }

        const gameConfig        = tile.getGameConfig();
        const targetTileType    = tile.getTileTypeId();
        const playerIndex       = Players_Constants.PlayerIndex.First;
        const skinId            = ForceSkins_Utils.getDefaultSkinId(playerIndex);
        const overridingSkinId  = ForceSkins_Utils.getRawOverridingSkinId(tile.getWar(), playerIndex);

        const dataArray : DataForDamageRenderer[] = [];
        let index       = 0;
        for (const attackerUnitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                gameConfig          : gameConfig,
                index               : index,
                targetTileType      : targetTileType,
                attackerUnitType    : attackerUnitType,
                playerIndex         : playerIndex,
                skinId              : skinId,
                overridingSkinId    : overridingSkinId,
            });
            ++index;
        }

        return dataArray;
    }
}

function sorterForDataForList(a: DataForMoveCostRenderer, b: DataForMoveCostRenderer): number {
    return a.unitType - b.unitType;
}

interface DataForInfoRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    infoType    : Tiles_Constants_Common.InfoTypeId;
    tile        : Tiles_ITile.ITile;
    war         : BaseWar_Interface_IBwWar.IBwWar;
}
class InfoRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValue!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupExtra!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupTouchType!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupTouchValue!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupTouchModify! : Ui_Interfaces_IUiContainer.IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupTouchType,             callback: this._onTouchedGroupType },
            { ui: this._groupTouchValue,            callback: this._onTouchedGroupValue },
            { ui: this._groupTouchModify,           callback: this._onTouchedGroupModify },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedGroupType(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if      (infoType === Tiles_Constants_Common.InfoTypeId.DefenseBonus)                            { this._showHelpAsDefenseBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Income)                                  { this._showHelpAsIncome(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Vision)                                  { this._showHelpAsVision(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.HideUnitCategory)                        { this._showHelpAsHideUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture)                     { this._showHelpAsIsDefeatedOnCapture(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory)                     { this._showHelpAsProduceUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.GlobalBonus)                             { this._showHelpAsGlobalBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.RepairUnitCategory)                      { this._showHelpAsRepairUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit)                          { this._showHelpAsBlockEnemyUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CoBoardUnit)                             { this._showHelpAsCoBoardUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Hp)                                      { this._showHelpAsHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CapturePoint)                            { this._showHelpAsCapturePoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BuildPoint)                              { this._showHelpAsBuildPoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsHighlighted)                           { this._showHelpAsIsHighlighted(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Buff)                                    { this._showHelpAsBuff(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalRadius)                           { this._showHelpAsCrystalRadius(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalPriority)                         { this._showHelpAsCrystalPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf)                    { this._showHelpAsCrystalCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly)                    { this._showHelpAsCrystalCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy)                   { this._showHelpAsCrystalCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund)                        { this._showHelpAsCrystalDeltaFund(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showHelpAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp)                          { this._showHelpAsCrystalDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage)              { this._showHelpAsCrystalDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showHelpAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForUp)                        { this._showHelpAsCannonRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForRight)                     { this._showHelpAsCannonRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft)                      { this._showHelpAsCannonRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForDown)                      { this._showHelpAsCannonRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonPriority)                          { this._showHelpAsCannonPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount)                    { this._showHelpAsCannonMaxTargetCount(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf)                     { this._showHelpAsCannonCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly)                     { this._showHelpAsCannonCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy)                    { this._showHelpAsCannonCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaHp)                           { this._showHelpAsCannonDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage)               { this._showHelpAsCannonDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showHelpAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp)                   { this._showHelpAsLaserTurretRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight)                { this._showHelpAsLaserTurretRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft)                 { this._showHelpAsLaserTurretRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown)                 { this._showHelpAsLaserTurretRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretPriority)                     { this._showHelpAsLaserTurretPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf)                { this._showHelpAsLaserTurretCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly)                { this._showHelpAsLaserTurretCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy)               { this._showHelpAsLaserTurretCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp)                      { this._showHelpAsLaserTurretDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showHelpAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedGroupValue(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if      (infoType === Tiles_Constants_Common.InfoTypeId.DefenseBonus)                            { this._showValueAsDefenseBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Income)                                  { this._showValueAsIncome(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Vision)                                  { this._showValueAsVision(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.HideUnitCategory)                        { this._showValueAsHideUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture)                     { this._showValueAsIsDefeatedOnCapture(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory)                     { this._showValueAsProduceUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.GlobalBonus)                             { this._showValueAsGlobalBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.RepairUnitCategory)                      { this._showValueAsRepairUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit)                          { this._showValueAsBlockEnemyUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CoBoardUnit)                             { this._showValueAsCoBoardUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Hp)                                      { this._showValueAsHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CapturePoint)                            { this._showValueAsCapturePoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BuildPoint)                              { this._showValueAsBuildPoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsHighlighted)                           { this._showValueAsIsHighlighted(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Buff)                                    { this._showValueAsBuff(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalRadius)                           { this._showValueAsCrystalRadius(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalPriority)                         { this._showValueAsCrystalPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf)                    { this._showValueAsCrystalCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly)                    { this._showValueAsCrystalCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy)                   { this._showValueAsCrystalCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund)                        { this._showValueAsCrystalDeltaFund(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showValueAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp)                          { this._showValueAsCrystalDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage)              { this._showValueAsCrystalDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showValueAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForUp)                        { this._showValueAsCannonRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForRight)                     { this._showValueAsCannonRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft)                      { this._showValueAsCannonRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForDown)                      { this._showValueAsCannonRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonPriority)                          { this._showValueAsCannonPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount)                    { this._showValueAsCannonMaxTargetCount(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf)                     { this._showValueAsCannonCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly)                     { this._showValueAsCannonCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy)                    { this._showValueAsCannonCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaHp)                           { this._showValueAsCannonDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage)               { this._showValueAsCannonDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showValueAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp)                   { this._showValueAsLaserTurretRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight)                { this._showValueAsLaserTurretRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft)                 { this._showValueAsLaserTurretRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown)                 { this._showValueAsLaserTurretRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretPriority)                     { this._showValueAsLaserTurretPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf)                { this._showValueAsLaserTurretCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly)                { this._showValueAsLaserTurretCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy)               { this._showValueAsLaserTurretCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp)                      { this._showValueAsLaserTurretDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showValueAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showValueAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedGroupModify(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if      (infoType === Tiles_Constants_Common.InfoTypeId.DefenseBonus)                            { this._modifyAsDefenseBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Income)                                  { this._modifyAsIncome(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Vision)                                  { this._modifyAsVision(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.HideUnitCategory)                        { this._modifyAsHideUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture)                     { this._modifyAsIsDefeatedOnCapture(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory)                     { this._modifyAsProduceUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.GlobalBonus)                             { this._modifyAsGlobalBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.RepairUnitCategory)                      { this._modifyAsRepairUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit)                          { this._modifyAsBlockEnemyUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CoBoardUnit)                             { this._modifyAsCoBoardUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Hp)                                      { this._modifyAsHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CapturePoint)                            { this._modifyAsCapturePoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BuildPoint)                              { this._modifyAsBuildPoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsHighlighted)                           { this._modifyAsIsHighlighted(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Buff)                                    { this._modifyAsBuff(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalRadius)                           { this._modifyAsCrystalRadius(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalPriority)                         { this._modifyAsCrystalPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf)                    { this._modifyAsCrystalCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly)                    { this._modifyAsCrystalCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy)                   { this._modifyAsCrystalCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund)                        { this._modifyAsCrystalOffsetFund(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._modifyAsCrystalOffsetEnergyPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp)                          { this._modifyAsCrystalOffsetHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage)              { this._modifyAsCrystalOffsetFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._modifyAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForUp)                        { this._modifyAsCannonRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForRight)                     { this._modifyAsCannonRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft)                      { this._modifyAsCannonRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForDown)                      { this._modifyAsCannonRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonPriority)                          { this._modifyAsCannonPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount)                    { this._modifyAsCannonMaxTargetCount(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf)                     { this._modifyAsCannonCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly)                     { this._modifyAsCannonCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy)                    { this._modifyAsCannonCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaHp)                           { this._modifyAsCannonOffsetHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage)               { this._modifyAsCannonDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._modifyAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp)                   { this._modifyAsLaserTurretRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight)                { this._modifyAsLaserTurretRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft)                 { this._modifyAsLaserTurretRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown)                 { this._modifyAsLaserTurretRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretPriority)                     { this._modifyAsLaserTurretPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf)                { this._modifyAsLaserTurretCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly)                { this._modifyAsLaserTurretCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy)               { this._modifyAsLaserTurretCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp)                      { this._modifyAsLaserTurretOffsetHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._modifyAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._modifyAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        this._imgBg.setIsVisible(openData.index % 2 === 0);

        const infoType = openData.infoType;
        if      (infoType === Tiles_Constants_Common.InfoTypeId.DefenseBonus)                            { this._updateViewAsDefenseBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Income)                                  { this._updateViewAsIncome(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Vision)                                  { this._updateViewAsVision(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.HideUnitCategory)                        { this._updateViewAsHideUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture)                     { this._updateViewAsIsDefeatedOnCapture(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory)                     { this._updateViewAsProduceUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.GlobalBonus)                             { this._updateViewAsGlobalBonus(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.RepairUnitCategory)                      { this._updateViewAsRepairUnitCategory(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit)                          { this._updateViewAsBlockEnemyUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CoBoardUnit)                             { this._updateViewAsCoBoardUnit(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Hp)                                      { this._updateViewAsHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CapturePoint)                            { this._updateViewAsCapturePoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.BuildPoint)                              { this._updateViewAsBuildPoint(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.IsHighlighted)                           { this._updateViewAsIsHighlighted(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.Buff)                                    { this._updateViewAsBuff(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalRadius)                           { this._updateViewAsCrystalRadius(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalPriority)                         { this._updateViewAsCrystalPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf)                    { this._updateViewAsCrystalCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly)                    { this._updateViewAsCrystalCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy)                   { this._updateViewAsCrystalCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund)                        { this._updateViewAsCrystalDeltaFund(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._updateViewAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp)                          { this._updateViewAsCrystalDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage)              { this._updateViewAsCrystalDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._updateViewAsCrystalDeltaPrimaryAmmoPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForUp)                        { this._updateViewAsCannonRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForRight)                     { this._updateViewAsCannonRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft)                      { this._updateViewAsCannonRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForDown)                      { this._updateViewAsCannonRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonPriority)                          { this._updateViewAsCannonPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount)                    { this._updateViewAsCannonMaxTargetCount(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf)                     { this._updateViewAsCannonCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly)                     { this._updateViewAsCannonCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy)                    { this._updateViewAsCannonCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaHp)                           { this._updateViewAsCannonDeltaHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage)               { this._updateViewAsCannonDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._updateViewAsCannonDeltaPrimaryAmmoPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp)                   { this._updateViewAsLaserTurretRangeForUp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight)                { this._updateViewAsLaserTurretRangeForRight(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft)                 { this._updateViewAsLaserTurretRangeForLeft(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown)                 { this._updateViewAsLaserTurretRangeForDown(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretPriority)                     { this._updateViewAsLaserTurretPriority(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf)                { this._updateViewAsLaserTurretCanAffectSelf(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly)                { this._updateViewAsLaserTurretCanAffectAlly(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy)               { this._updateViewAsLaserTurretCanAffectEnemy(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp)                      { this._updateViewAsLaserTurretOffsetHp(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._updateViewAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsDefenseBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.B0352);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getDefenseUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(Lang_Utils.getUnitCategoryName(
                tile.getTemplateCfg().getDefenseUnitCategoryId(),
                tile.getGameConfig()
            ) ?? Lang_Constants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }

        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(`${Helpers_Text.getSignedNumText(tile.getDefenseAmount())}%`);
    }
    private _updateViewAsIncome(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.Income);
        this._labelValue.setText(`${tile.getIncomePerTurn()}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.VisionRange);
        this._labelValue.setText(`${tile.getCfgVisionRange()}`);

        const groupExtra = this._groupExtra;
        if (!tile.getIsVisionEnabledForAllPlayers()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(Lang_Constants.TextType.B1130);
        }

        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.HidableUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getHideUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(Lang_Utils.getUnitCategoryName(
                tile.getTemplateCfg().getHideUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? Lang_Constants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsIsDefeatedOnCapture(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.DefeatIfCaptured);
        this._labelValue.setLangText(tile.getIsDefeatedOnCapture() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((tile.getIsCustomizableBuilding()) && (WarTypes_Utils.checkCanCheatInWar(war.getWarType())));
    }
    private _updateViewAsProduceUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.ProducibleUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getRegularProducibleUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(Lang_Utils.getUnitCategoryName(
                tile.getTemplateCfg().getProduceUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? Lang_Constants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsGlobalBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const offenseBonus              = tile.getGlobalAttackBonus();
        const defenseBonus              = tile.getGlobalDefenseBonus();
        this._labelTitle.setLangText(Lang_Constants.TextType.B0359);
        this._labelValue.setText(`${offenseBonus} / ${defenseBonus}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsRepairUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.RepairableUnits);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getRepairUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(Lang_Utils.getUnitCategoryName(
                tile.getTemplateCfg().getRepairUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? Lang_Constants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }

        const repairNormalizedHp    = tile.getRepairNormalizedHp();
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(repairNormalizedHp == null ? `--` : `${Helpers_Text.getSignedNumText(repairNormalizedHp * 10)}`);
    }
    private _updateViewAsBlockEnemyUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.BlockableEnemyUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getBlockEnemyUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(Lang_Utils.getUnitCategoryName(
                tile.getTemplateCfg().getBlockEnemyUnitCategoryId() ?? 0,
                tile.getGameConfig(),
            ) ?? Lang_Constants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsCoBoardUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.CoBoardableUnit);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getCoBoardUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(Lang_Utils.getUnitCategoryName(
                tile.getTemplateCfg().getCoBoardUnitCategoryId() ?? 0,
                tile.getGameConfig(),
            ) ?? Lang_Constants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.Hp);
        this._labelValue.setText(`${tile.getCurrentHp()} / ${tile.getMaxHp() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsCapturePoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.CapturePoint);
        this._labelValue.setText(`${tile.getCurrentCapturePoint()} / ${tile.getMaxCapturePoint() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsBuildPoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.BuildPoint);
        this._labelValue.setText(`${tile.getCurrentBuildPoint()} / ${tile.getMaxBuildPoint() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.B0847);
        this._labelValue.setLangText(tile.getIsHighlighted() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(Lang_Constants.TextType.AbnormalStates);
        this._labelValue.setText(`${tile.getUnfixedBuffList()?.length || `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypes_Utils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsCrystalRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getRadius();
        this._labelTitle.setLangText(Lang_Constants.TextType.EffectiveRadius);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getPriority();
        this._labelTitle.setLangText(Lang_Constants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getCanAffectSelf();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getCanAffectAlly();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getCanAffectEnemy();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetFund();
        this._labelTitle.setLangText(Lang_Constants.TextType.FundOffset);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetEnergyPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.CoEnergyOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war }     = openData;
        const customCrystalData = Helpers_Misc.getExisted(tile.getFinalCrystalData());
        const offsetHp          = customCrystalData.getOffsetHp();
        const canBeFatal        = customCrystalData.getCanBeFatal();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(Lang_Constants.TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCannonRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForUp();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForRight();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForDown();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForLeft();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getPriority();
        this._labelTitle.setLangText(Lang_Constants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getMaxTargetCount();
        this._labelTitle.setLangText(Lang_Constants.TextType.MaxTargets);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getCanAffectSelf();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getCanAffectAlly();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getCanAffectEnemy();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const data          = Helpers_Misc.getExisted(tile.getFinalCannonData());
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(Lang_Constants.TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalCannonData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForUp();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForRight();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForDown();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForLeft();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getPriority();
        this._labelTitle.setLangText(Lang_Constants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getCanAffectSelf();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getCanAffectAlly();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getCanAffectEnemy();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const data          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData());
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(Lang_Constants.TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypes_Utils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }

    private _showHelpAsDefenseBonus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0352),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0088),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIncome(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.Income),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0086),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsVision(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.VisionRange),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0082),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHideUnitCategory(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.HidableUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0079),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsDefeatedOnCapture(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.DefeatIfCaptured),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0077),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsProduceUnitCategory(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.ProducibleUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0074),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsGlobalBonus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0359),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0068),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsRepairUnitCategory(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.RepairableUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0065),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBlockEnemyUnit(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.BlockableEnemyUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0012),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCoBoardUnit(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.CoBoardableUnit),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0011),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0059),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCapturePoint(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0052),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuildPoint(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.BuildPoint),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0051),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsHighlighted(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0847),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0050),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuff(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStates),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0737),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCrystalRadius(): void {
        // nothing to do
    }
    private _showHelpAsCrystalPriority(): void {
        // nothing to do
    }
    private _showHelpAsCrystalCanAffectSelf(): void {
        // nothing to do
    }
    private _showHelpAsCrystalCanAffectAlly(): void {
        // nothing to do
    }
    private _showHelpAsCrystalCanAffectEnemy(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaFund(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaEnergyPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaHp(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForUp(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForRight(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForLeft(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForDown(): void {
        // nothing to do
    }
    private _showHelpAsCannonPriority(): void {
        // nothing to do
    }
    private _showHelpAsCannonMaxTargetCount(): void {
        // nothing to do
    }
    private _showHelpAsCannonCanAffectSelf(): void {
        // nothing to do
    }
    private _showHelpAsCannonCanAffectAlly(): void {
        // nothing to do
    }
    private _showHelpAsCannonCanAffectEnemy(): void {
        // nothing to do
    }
    private _showHelpAsCannonDeltaHp(): void {
        // nothing to do
    }
    private _showHelpAsCannonDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCannonDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForUp(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForRight(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForLeft(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForDown(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretPriority(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretCanAffectSelf(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretCanAffectAlly(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretCanAffectEnemy(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretDeltaHp(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }

    private _showValueAsDefenseBonus(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getDefenseUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsIncome(): void {
        // nothing to do
    }
    private _showValueAsVision(): void {
        // nothing to do
    }
    private _showValueAsHideUnitCategory(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getHideUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsIsDefeatedOnCapture(): void {
        // nothing to do
    }
    private _showValueAsProduceUnitCategory(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getRegularProducibleUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsGlobalBonus(): void {
        // nothing to do
    }
    private _showValueAsRepairUnitCategory(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getRepairUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsBlockEnemyUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getBlockEnemyUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : tile.getGameConfig(),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsCoBoardUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getCoBoardUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : tile.getGameConfig(),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsHp(): void {
        // nothing to do
    }
    private _showValueAsCapturePoint(): void {
        // nothing to do
    }
    private _showValueAsBuildPoint(): void {
        // nothing to do
    }
    private _showValueAsIsHighlighted(): void {
        // nothing to do
    }
    private _showValueAsBuff(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileBuffListPanel, {
            tile        : tile,
            canModify   : tile.getWar().getCanCheat(),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsCrystalRadius(): void {
        // nothing to do
    }
    private _showValueAsCrystalPriority(): void {
        // nothing to do
    }
    private _showValueAsCrystalCanAffectSelf(): void {
        // nothing to do
    }
    private _showValueAsCrystalCanAffectAlly(): void {
        // nothing to do
    }
    private _showValueAsCrystalCanAffectEnemy(): void {
        // nothing to do
    }
    private _showValueAsCrystalDeltaFund(): void {
        // nothing to do
    }
    private _showValueAsCrystalDeltaEnergyPercentage(): void {
        // nothing to do
    }
    private _showValueAsCrystalDeltaHp(): void {
        // nothing to do
    }
    private _showValueAsCrystalDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showValueAsCrystalDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }
    private _showValueAsCannonRangeForUp(): void {
        // nothing to do
    }
    private _showValueAsCannonRangeForRight(): void {
        // nothing to do
    }
    private _showValueAsCannonRangeForLeft(): void {
        // nothing to do
    }
    private _showValueAsCannonRangeForDown(): void {
        // nothing to do
    }
    private _showValueAsCannonPriority(): void {
        // nothing to do
    }
    private _showValueAsCannonMaxTargetCount(): void {
        // nothing to do
    }
    private _showValueAsCannonCanAffectSelf(): void {
        // nothing to do
    }
    private _showValueAsCannonCanAffectAlly(): void {
        // nothing to do
    }
    private _showValueAsCannonCanAffectEnemy(): void {
        // nothing to do
    }
    private _showValueAsCannonDeltaHp(): void {
        // nothing to do
    }
    private _showValueAsCannonDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showValueAsCannonDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretRangeForUp(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretRangeForRight(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretRangeForLeft(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretRangeForDown(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretPriority(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretCanAffectSelf(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretCanAffectAlly(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretCanAffectEnemy(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretDeltaHp(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showValueAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }

    private _modifyAsDefenseBonus(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const maxValue      = Tiles_Constants_CustomLimits.Building.DefenseAmount.MaxValue;
        const minValue      = Tiles_Constants_CustomLimits.Building.DefenseAmount.MinValue;
        const data          = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : data.getDefenseUnitTypeArray(),
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : newUnitTypeArray => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                    getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.DefBonus$),
                    minValue        : minValue,
                    maxValue        : maxValue,
                    currentValue    : tile.getDefenseAmount(),
                    callback        : newDefenseAmount => {
                        data.setDefenseUnitTypeArray(newUnitTypeArray);
                        data.setDefenseAmount(newUnitTypeArray.length ? newDefenseAmount : 0);
                        tile.setCustomBuildingData(data);
                        this._updateView();
                    },
                });
            },
        });
    }
    private _modifyAsIncome(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const maxValue  = Tiles_Constants_CustomLimits.Building.IncomePerTurn.MaxValue;
        const minValue  = Tiles_Constants_CustomLimits.Building.IncomePerTurn.MinValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Income),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : tile.getIncomePerTurn(),
            callback        : newIncome => {
                const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                data.setIncomePerTurn(newIncome);
                tile.setCustomBuildingData(data);
                this._updateView();
            },
        });
    }
    private _modifyAsVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const { tile, war } = openData;
        const maxValue      = Tiles_Constants_CustomLimits.Building.VisionRange.MaxValue;
        const minValue      = Tiles_Constants_CustomLimits.Building.VisionRange.MinValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.VisionRange),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : tile.getCfgVisionRange(),
            callback        : newVisionRange => {
                const callback = (isGlobalVision: boolean) => {
                    const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                    data.setVisionRange(newVisionRange);
                    data.setIsVisionEnabledForAllPlayers(isGlobalVision);
                    tile.setCustomBuildingData(data);
                    this._updateView();

                    war.updateTilesAndUnitsOnVisibilityChanged(false);
                };
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent             : () => Lang_Utils.getText(Lang_Constants.TextType.A0018),
                    callback            : () => callback(false),
                    callbackOnCancel    : () => callback(true),
                    getTextForConfirm      : () => Lang_Utils.getText(Lang_Constants.TextType.Yes),
                    getTextForCancel       : () => Lang_Utils.getText(Lang_Constants.TextType.No),
                });
            },
        });
    }
    private _modifyAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const { tile, war } = openData;
        const gameConfig    = war.getGcData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getHideUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                data.setHideUnitTypeArray(unitTypeArray);
                tile.setCustomBuildingData(data);
                this._updateView();

                war.updateTilesAndUnitsOnVisibilityChanged(false);
            },
        });
    }
    private _modifyAsIsDefeatedOnCapture(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
        data.setIsDefeatedOnCapture(!data.getIsDefeatedOnCapture());
        tile.setCustomBuildingData(data);
        this._updateView();
    }
    private _modifyAsProduceUnitCategory(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getRegularProducibleUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                data.setProduceUnitTypeArray(unitTypeArray);
                tile.setCustomBuildingData(data);
                this._updateView();
            },
        });
    }
    private _modifyAsGlobalBonus(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const maxValue  = Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MaxValue;
        const minValue  = Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MinValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B0183),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : tile.getGlobalAttackBonus(),
            callback        : newAttackBonus => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                    getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.DefBonus$),
                    minValue        : minValue,
                    maxValue        : maxValue,
                    currentValue    : tile.getGlobalDefenseBonus(),
                    callback        : newDefenseBonus => {
                        const data              = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                        data.setGlobalAttackBonus(newAttackBonus);
                        data.setGlobalDefenseBonus(newDefenseBonus);
                        tile.setCustomBuildingData(data);
                        this._updateView();
                    },
                });
            },
        });
    }
    private _modifyAsRepairUnitCategory(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getRepairUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                if (!unitTypeArray.length) {
                    const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                    data.setRepairUnitTypeArray(unitTypeArray);
                    data.setRepairNormalizedHp(null);
                    tile.setCustomBuildingData(data);
                    this._updateView();
                } else {
                    const minValue  = -1;
                    const maxValue  = Tiles_Constants_CustomLimits.Building.RepairNormalizedHp.MaxValue;
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                        getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
                        currentValue    : tile.getRepairNormalizedHp() ?? -1,
                        minValue        : minValue,
                        maxValue        : maxValue,
                        callback        : normalizedRepairAmount => {
                            const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                            data.setRepairUnitTypeArray(unitTypeArray);
                            data.setRepairNormalizedHp(normalizedRepairAmount < 0 ? null : normalizedRepairAmount);
                            tile.setCustomBuildingData(data);
                            this._updateView();
                        },
                    });
                }
            },
        });
    }
    private _modifyAsBlockEnemyUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getBlockEnemyUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                data.setBlockEnemyUnitTypeArray(unitTypeArray);
                tile.setCustomBuildingData(data);
                this._updateView();
            },
        });
    }
    private _modifyAsCoBoardUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getCoBoardUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                data.setUnitTypeArrayForCoBoard(unitTypeArray);
                tile.setCustomBuildingData(data);
                this._updateView();
            },
        });
    }
    private _modifyAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        const tile = openData.tile;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            currentValue    : tile.getCurrentHp(),
            minValue        : 0,
            maxValue        : tile.getMaxHp() ?? 0,
            callback        : value => {
                tile.setCurrentHp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCapturePoint(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currentValue = tile.getCurrentCapturePoint();
        if (tile.getIsCustomizableBuilding()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.MaxCapturePoint),
                currentValue    : tile.getMaxCapturePoint(),
                minValue        : 0,
                maxValue        : Tiles_Constants_CustomLimits.Building.MaxCapturePoint.MaxValue,
                callback        : newMaxCapturePoint => {
                    if (newMaxCapturePoint == null) {
                        const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                        data.setMaxCapturePoint(null);
                        tile.setCustomBuildingData(data);
                        tile.setCurrentCapturePoint(0);
                        this._updateView();
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
                            currentValue    : currentValue,
                            minValue        : 0,
                            maxValue        : newMaxCapturePoint,
                            callback        : newCurrentCapturePoint => {
                                const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                                data.setMaxCapturePoint(newMaxCapturePoint);
                                tile.setCustomBuildingData(data);
                                tile.setCurrentCapturePoint(newCurrentCapturePoint);
                                this._updateView();
                            },
                        });
                    }
                },
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
                currentValue    : currentValue,
                minValue        : 0,
                maxValue        : tile.getMaxCapturePoint() ?? 0,
                callback        : newCurrentCapturePoint => {
                    tile.setCurrentCapturePoint(newCurrentCapturePoint);
                    this._updateView();
                },
            });
        }
    }
    private _modifyAsBuildPoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        const tile = openData.tile;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => Lang_Utils.getText(Lang_Constants.TextType.BuildPoint),
            currentValue    : tile.getCurrentBuildPoint(),
            minValue        : Tiles_Constants_CustomLimits.Common.CurrentBuildPoint.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Common.CurrentBuildPoint.MaxValue,
            callback        : value => {
                tile.setCurrentBuildPoint(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if (!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        tile.setIsHighlighted(!tile.getIsHighlighted());
        tile.flushDataToView();
        this._updateView();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tile = openData.tile;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileBuffListPanel, {
            tile        : tile,
            canModify   : tile.getWar().getCanCheat(),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getRadius();
        const minValue  = Tiles_Constants_CustomLimits.Crystal.Radius.MinValue;
        const maxValue  = Tiles_Constants_CustomLimits.Crystal.Radius.MaxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.EffectiveRadius),
            currentValue    : currValue,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
                tile.setCustomCrystalRadius(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getPriority();
        const minValue  = Tiles_Constants_CustomLimits.Crystal.Priority.MinValue;
        const maxValue  = Tiles_Constants_CustomLimits.Crystal.Priority.MaxValue;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Priority),
            currentValue    : currValue,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
                tile.setCustomCrystalPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectSelf(!Helpers_Misc.getExisted(tile.getFinalCrystalData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectAlly(!Helpers_Misc.getExisted(tile.getFinalCrystalData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectEnemy(!Helpers_Misc.getExisted(tile.getFinalCrystalData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetFund();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.FundOffset),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Crystal.OffsetFund.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Crystal.OffsetFund.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaFund(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetEnergyPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.CoEnergyOffset$),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaEnergyPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType()))            ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ) {
            return;
        }

        const customCrystalData = Helpers_Misc.getExisted(tile.getFinalCrystalData());
        const canBeFatal        = customCrystalData.getCanBeFatal();
        const callback          = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomCrystalOffsetHp(newOffsetHp);
            tile.setCustomCrystalCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset),
            currentValue    : customCrystalData.getOffsetHp(),
            minValue        : Tiles_Constants_CustomLimits.Crystal.OffsetHp.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Crystal.OffsetHp.MaxValue,
            callback        : value => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getTitle               : () => Lang_Utils.getText(Lang_Constants.TextType.CanBeFatal),
                getContent             : () => Lang_Utils.getText(Lang_Constants.TextType.A0958),
                getTextForConfirm      : () => `${Lang_Utils.getText(Lang_Constants.TextType.Yes)}${canBeFatal ? `(${Lang_Utils.getText(Lang_Constants.TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${Lang_Utils.getText(Lang_Constants.TextType.No)}${!canBeFatal ? `(${Lang_Utils.getText(Lang_Constants.TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetFuelPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCrystalData()).getOffsetPrimaryAmmoPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForUp();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeUp),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.RangeForUp.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.RangeForUp.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForUp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForRight();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeRight),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.RangeForRight.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.RangeForRight.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForRight(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForDown();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeDown),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.RangeForDown.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.RangeForDown.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForDown(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getRangeForLeft();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeLeft),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.RangeForLeft.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.RangeForLeft.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForLeft(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getPriority();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Priority),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.Priority.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.Priority.MaxValue,
            callback        : value => {
                tile.setCustomCannonPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getMaxTargetCount();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.MaxTargets),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.MaxTargetCount.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.MaxTargetCount.MaxValue,
            callback        : value => {
                tile.setCustomCannonMaxTargetCount(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectSelf(!Helpers_Misc.getExisted(tile.getFinalCannonData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectAlly(!Helpers_Misc.getExisted(tile.getFinalCannonData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectEnemy(!Helpers_Misc.getExisted(tile.getFinalCannonData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType()))            ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ) {
            return;
        }

        const customCannonData  = Helpers_Misc.getExisted(tile.getFinalCannonData());
        const canBeFatal        = customCannonData.getCanBeFatal();
        const callback          = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomCannonOffsetHp(newOffsetHp);
            tile.setCustomCannonCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset),
            currentValue    : customCannonData.getOffsetHp(),
            minValue        : Tiles_Constants_CustomLimits.Cannon.OffsetHp.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.OffsetHp.MaxValue,
            callback        : value => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getTitle               : () => Lang_Utils.getText(Lang_Constants.TextType.CanBeFatal),
                getContent             : () => Lang_Utils.getText(Lang_Constants.TextType.A0958),
                getTextForConfirm      : () => `${Lang_Utils.getText(Lang_Constants.TextType.Yes)}${canBeFatal ? `(${Lang_Utils.getText(Lang_Constants.TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${Lang_Utils.getText(Lang_Constants.TextType.No)}${!canBeFatal ? `(${Lang_Utils.getText(Lang_Constants.TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getOffsetFuelPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.OffsetFuelPercentage.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCannonDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalCannonData()).getOffsetPrimaryAmmoPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCannonDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForUp();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeUp),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForUp.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForUp.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForUp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForRight();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeRight),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForRight.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForRight.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForRight(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForDown();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeDown),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForDown.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForDown.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForDown(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getRangeForLeft();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.RangeLeft),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForLeft.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.RangeForLeft.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForLeft(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getPriority();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.Priority),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.Priority.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.Priority.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectSelf(!Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectAlly(!Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectEnemy(!Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType()))                ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ) {
            return;
        }

        const customLaserTurretData = Helpers_Misc.getExisted(tile.getFinalLaserTurretData());
        const canBeFatal            = customLaserTurretData.getCanBeFatal();
        const callback              = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomLaserTurretOffsetHp(newOffsetHp);
            tile.setCustomLaserTurretCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset),
            currentValue    : customLaserTurretData.getOffsetHp(),
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.OffsetHp.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.OffsetHp.MaxValue,
            callback        : value => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getTitle               : () => Lang_Utils.getText(Lang_Constants.TextType.CanBeFatal),
                getContent             : () => Lang_Utils.getText(Lang_Constants.TextType.A0958),
                getTextForConfirm      : () => `${Lang_Utils.getText(Lang_Constants.TextType.Yes)}${canBeFatal ? `(${Lang_Utils.getText(Lang_Constants.TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${Lang_Utils.getText(Lang_Constants.TextType.No)}${!canBeFatal ? `(${Lang_Utils.getText(Lang_Constants.TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getOffsetFuelPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.OffsetFuelPercentage.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypes_Utils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = Helpers_Misc.getExisted(tile.getFinalLaserTurretData()).getOffsetPrimaryAmmoPercentage();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue,
            minValue        : Tiles_Constants_CustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : Tiles_Constants_CustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
}

interface DataForMoveCostRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index               : number;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    unitType            : number;
    tileCfg             : TileTemplateCfg;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}
class MoveCostRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView          = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            { type: Notifications_TypeId.TypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const unitType      = openData.unitType;
        const moveCostCfg   = Helpers_Misc.getExisted(gameConfig.getMoveCostCfg(openData.tileCfg.getTileTypeId()));
        const moveCost      = moveCostCfg[Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId())].getCost();
        this._imgBg.setIsVisible(openData.index % 4 === 2);
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : Math.max(Players_Constants.PlayerIndex.First, openData.skinId),
            overridingSkinId    : openData.overridingSkinId,
            unitData            : Units_Utils_Serialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : openData.playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), Common_Model_CommonModel.getUnitAnimationTickCount());
    }
}

interface DataForDamageRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    index               : number;
    targetTileType      : number;
    playerIndex         : number;
    attackerUnitType    : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}
class DamageRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPrimaryAttack!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView              = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: Notifications_TypeId.TypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 4 >= 2);

        const gameConfig        = openData.gameConfig;
        const attackerUnitType  = openData.attackerUnitType;
        const unitView          = this._unitView;
        unitView.setIsVisible(true);
        unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : openData.skinId,
            overridingSkinId    : openData.overridingSkinId,
            unitData            : Units_Utils_Serialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : attackerUnitType,
                playerIndex : openData.playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), Common_Model_CommonModel.getUnitAnimationTickCount());

        const attackCfg             = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(attackerUnitType));
        const targetArmorType       = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(openData.targetTileType)?.getArmorTypeId());
        const primaryAttackDamage   = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
        const secondaryAttackDamage = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
        this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
        this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
    }
}

function createInfoDefenseBonus(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getDefenseUnitCategoryId() === Units_Constants.CategoryId.None) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.DefenseBonus,
            war         : war,
            tile        : tile,
        };
}
function createInfoIncome(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getIncomePerTurn() === 0) && (!tile.getIsCustomizableBuilding())
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.Income,
            war,
            tile,
        };
}
function createInfoVision(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((tile.getCfgVisionRange() == 0) && (!tile.getIsVisionEnabledForAllPlayers()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.Vision,
            war,
            tile
        };
}
function createInfoHideUnitCategory(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getHideUnitCategoryId() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.HideUnitCategory,
            war         : war,
            tile        : tile,
        };
}
function createInfoIsDefeatOnCapture(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((!tile.getIsDefeatedOnCapture()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture,
            war,
            tile,
        };
}
function createInfoProduceUnitCategory(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getProduceUnitCategoryId() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory,
            war,
            tile,
        };
}
function createInfoGlobalBonus(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((tile.getGlobalAttackBonus() === 0) && (tile.getGlobalDefenseBonus() === 0) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.GlobalBonus,
            war         : war,
            tile        : tile,
        };
}
function createInfoRepairUnitCategory(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getRepairUnitCategoryId() == Units_Constants.CategoryId.None) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.RepairUnitCategory,
            war,
            tile,
        };
}
function createInfoBlockEnemyUnit(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((!tile.getTemplateCfg().getBlockEnemyUnitCategoryId()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit,
            war,
            tile,
        };
}
function createInfoCoBoardUnit(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((!tile.getTemplateCfg().getCoBoardUnitCategoryId()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CoBoardUnit,
            war,
            tile,
        };
}
function createInfoHp(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getMaxHp() == null)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.Hp,
            war,
            tile,
        };
}
function createInfoCapturePoint(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return ((tile.getMaxCapturePoint() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CapturePoint,
            war,
            tile,
        };
}
function createInfoBuildPoint(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getMaxBuildPoint() == null)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.BuildPoint,
            war,
            tile,
        };
}
function createInfoIsHighlighted(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return {
        index       : 0,
        infoType    : Tiles_Constants_Common.InfoTypeId.IsHighlighted,
        war,
        tile,
    };
}
function createInfoBuff(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return {
        index       : 0,
        infoType    : Tiles_Constants_Common.InfoTypeId.Buff,
        war         : war,
        tile        : tile,
    };
}
function createInfoCrystalRadius(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getFinalCrystalData() == null)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalRadius,
            war,
            tile,
        };
}
function createInfoCrystalPriority(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalPriority,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectSelf(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectAlly(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectEnemy(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoCrystalDeltaFund(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund,
            war,
            tile,
        };
}
function createInfoCrystalDeltaEnergyPercentage(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage,
            war,
            tile,
        };
}
function createInfoCrystalDeltaHp(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getFinalCrystalData() == null)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp,
            war,
            tile,
        };
}
function createInfoCrystalDeltaFuelPercentage(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoCrystalDeltaPrimaryAmmoPercentage(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
function createInfoCannonRangeForUp(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonUp))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonRangeForUp,
            war,
            tile,
        };
}
function createInfoCannonRangeForDown(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonDown))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonRangeForDown,
            war,
            tile,
        };
}
function createInfoCannonRangeForLeft(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonLeft))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft,
            war,
            tile,
        };
}
function createInfoCannonRangeForRight(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonRight))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonRangeForRight,
            war,
            tile,
        };
}
function createInfoCannonPriority(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonPriority,
            war,
            tile,
        };
}
function createInfoCannonMaxTargetCount(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount,
            war,
            tile,
        };
}
function createInfoCannonCanAffectSelf(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf,
            war,
            tile,
        };
}
function createInfoCannonCanAffectAlly(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly,
            war,
            tile,
        };
}
function createInfoCannonCanAffectEnemy(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoCannonDeltaHp(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getFinalCannonData() == null)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonDeltaHp,
            war,
            tile,
        };
}
function createInfoCannonDeltaFuelPercentage(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoCannonDeltaPrimaryAmmoPercentage(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForUp(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForDown(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForLeft(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForRight(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight,
            war,
            tile,
        };
}
function createInfoLaserTurretPriority(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretPriority,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectSelf(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectAlly(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectEnemy(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaHp(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getFinalLaserTurretData() == null)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaFuelPercentage(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaPrimaryAmmoPercentage(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
