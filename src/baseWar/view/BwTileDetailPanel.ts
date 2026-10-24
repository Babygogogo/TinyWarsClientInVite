import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GridMarksConstants from "../../gridMarks/Constants.ts";
import * as GridMarksUtils from "../../gridMarks/Utils.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwProxy from "../../multiPlayerWar/model/MpwProxy.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoConfigTileTemplateCfg from "../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TilesConstantsCustomLimits from "../../tiles/constants/CustomLimits.ts";
import * as TilesConstantsMapWeapon from "../../tiles/constants/MapWeapon.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as TilesUtilsSerialization from "../../tiles/utils/Serialization.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesUtils from "../../warTypes/Utils.ts";

type ITile                      = TilesITile.ITile;

let _selectedMarkTypeId         = GridMarksConstants.TypeId.MinMarkTypeId;

export interface OpenData {
    tile                    : ITile;
    callbackForAddUnit      : (() => void) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTilesInfo!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddUnit!           : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutName!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conTileView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModifyType!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyName!        : UiInterfacesIUiButton.IUiButton;
    private readonly _listInfo!             : UiInterfacesIUiScrollList.IUiScrollList<DataForInfoRenderer>;

    private readonly _groupMoveCost!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutMoveCost2!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCost1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listMoveCost!         : UiInterfacesIUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private readonly _groupDamageChart!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutDefense1!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDefense1!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub1!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutDefense2!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDefense2!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain2!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub2!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listDamageChart!      : UiInterfacesIUiScrollList.IUiScrollList<DataForDamageRenderer>;

    private readonly _groupButtons!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnMarkType!          : UiInterfacesIUiButton.IUiButton;
    private readonly _imgMarkType!          : UiInterfacesIUiImage.IUiImage;
    private readonly _btnMark!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUnmark!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnBatchMark!         : UiInterfacesIUiButton.IUiButton;

    private readonly _tileView              = new (GameHelpersGhFactory.getTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateChanged,     callback: this._onNotifyBwPlannerStateChanged },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,              callback: this._onNotifyStateIndicatorTick },
            { type: NotificationsTypeId.TypeId.BwTileIsHighlightedChanged,      callback: this._onNotifyTileIsHighlightedChanged },
            { type: NotificationsTypeId.TypeId.BwTileBuffChanged,               callback: this._onNotifyTileBuffChanged },
            { type: NotificationsTypeId.TypeId.BwTileCustomNameIdChanged,       callback: this._onNotifyTileCustomNameIdChanged },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonMarkTile,            callback: this._onNotifyMsgMpwCommonMarkGrid },
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
    private _onNotifyTileBuffChanged(e: VendorEgretEgret.Event): void {
        if ((e.data as NotificationsDataTypes.BwTileBuffChanged).tile === this.getOpenData()?.tile) {
            this._updateTileView();
            this._updateListInfo();
        }
    }
    private _onNotifyTileCustomNameIdChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyMsgMpwCommonMarkGrid(e: VendorEgretEgret.Event): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const tileId = tile.getGridIndex().getGridId(tile.getWar().getTileMap().getMapSize());
        if ((e.data as ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS.S).getGridIdArrayForAddMark().indexOf(tileId) >= 0) {
            FloatText2.showLang(LangConstants.TextType.A0848);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileInfoPanel, {
            gameConfig          : gameConfig,
            finalSkinIdArray    : ForceSkinsUtils.getFinalSkinIdArray(war, true),
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
                const newCfg            = HelpersMisc.getExisted(gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType, tileObjectType));
                const data              = TilesUtilsSerialization.create({
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
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);

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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1430),
            availableNumberArray    : HelpersCollection.createRange(0, TilesConstantsCommon.CustomName.MaxId + 1, 1),
            currentNumber           : tile.getCustomNameId(),
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${LangUtils.getText(LangConstants.TextType.B0391)})`;
                } else {
                    return LangUtils.getLanguageText({ textArray: arr?.find(v => (v.getNameId() ?? 0) === num)?.getNameTextArray() ?? [] }) ?? `----`;
                }
            },
            callbackForSettings     : () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MeTileCustomNameListPanel, { war: war });
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel);
            },
            callbackOnConfirm       : num => tile.setCustomNameId(num == 0 ? null : num),
        });
    }
    private _onTouchedBtnMarkType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleGridMarkPanel, {
            currentMarkTypeId   : _selectedMarkTypeId,
            callback            : markTypeId => {
                _selectedMarkTypeId = markTypeId;
                this._updateImgMarkType();
                this._updateBtnMarkAndUnmark();
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleGridMarkPanel);
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
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const player = war.getPlayerLoggedIn();
            if ((player == null) || (player.getMarkTypeId(gridId) === _selectedMarkTypeId)) {
                return;
            }

            MultiPlayerWarModelMpwProxy.reqMpwCommonMarkGrid(HelpersMisc.getExisted(war.getWarId()), [gridId], [], _selectedMarkTypeId);

        } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
            if (GridMarksUtils.addGridMark(war.getGridMarkData().getGridIdAndMarkTypeIdList(), gridId, _selectedMarkTypeId)) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkAdded, {
                    war     : war,
                    gridId  : gridId,
                } as NotificationsDataTypes.GridMarkAdded);

                FloatText2.showLang(LangConstants.TextType.A0848);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            if (GridMarksUtils.addGridMark(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), gridId, _selectedMarkTypeId)) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkAdded, {
                    war     : war,
                    gridId  : gridId,
                } as NotificationsDataTypes.GridMarkAdded);

                FloatText2.showLang(LangConstants.TextType.A0848);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }

        } else {
            // TODO
            const player = war.getPlayerInTurn();
            if (player.getMarkTypeId(gridId)) {
                return;
            }

            player.addGridMark(gridId, _selectedMarkTypeId);
            this._updateBtnMarkAndUnmark();
            FloatText2.showLang(LangConstants.TextType.A0848);
        }
    }
    private _onTouchedBtnUnmark(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war       = tile.getWar();
        const gridId    = tile.getGridIndex().getGridId(war.getTileMap().getMapSize());
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const player = war.getPlayerLoggedIn();
            if ((player == null) || (!player.getMarkTypeId(gridId))) {
                return;
            }

            MultiPlayerWarModelMpwProxy.reqMpwCommonMarkGrid(HelpersMisc.getExisted(war.getWarId()), [], [gridId], _selectedMarkTypeId);

        } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
            if (GridMarksUtils.deleteGridMark(war.getGridMarkData().getGridIdAndMarkTypeIdList(), gridId)) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkDeleted, {
                    war     : war,
                    gridId  : gridId,
                } as NotificationsDataTypes.GridMarkDeleted);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            if (GridMarksUtils.deleteGridMark(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), gridId)) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkDeleted, {
                    war     : war,
                    gridId  : gridId,
                } as NotificationsDataTypes.GridMarkDeleted);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                this._updateBtnMarkAndUnmark();

            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwMarkGridPanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonTileChartPanel, {
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
        this._labelTitle.setLangText(LangConstants.TextType.B0423);
        this._labelMoveCostTitle1.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCost1.setLangText(LangConstants.TextType.B1282);
        this._labelMoveCost2.setLangText(LangConstants.TextType.B1282);
        this._labelDefense1.setLangText(LangConstants.TextType.B0334);
        this._labelDefense2.setLangText(LangConstants.TextType.B0334);
        this._labelMain1.setLangText(LangConstants.TextType.B0692);
        this._labelSub1.setLangText(LangConstants.TextType.B0693);
        this._labelMain2.setLangText(LangConstants.TextType.B0692);
        this._labelSub2.setLangText(LangConstants.TextType.B0693);
        this._btnBatchMark.setLangText(LangConstants.TextType.B1109);
        this._btnAddUnit.setLangText(LangConstants.TextType.B0535);
        this._btnTilesInfo.setLangText(LangConstants.TextType.B0910);
        this._btnClose.setLangText(LangConstants.TextType.B0204);
        this._btnMark.setLangText(LangConstants.TextType.B0914);
        this._btnUnmark.setLangText(LangConstants.TextType.B0915);

        this._layoutMoveCost1.arrangeItems();
        this._layoutMoveCost2.arrangeItems();
        this._layoutDefense1.arrangeItems();
        this._layoutDefense2.arrangeItems();
    }

    private _updateBtnAddUnit(): void {
        this._btnAddUnit.setIsVisible(this.getOpenData()?.callbackForAddUnit != null);
    }

    private _updateImgMarkType(): void {
        this._imgMarkType.loadSource(HelpersImageSource.getGridMark(_selectedMarkTypeId));
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
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const player    = war.getPlayerLoggedIn();
            const canMark   = (player != null) && (player.getMarkTypeId(gridId) !== _selectedMarkTypeId);
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);

        } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
            const canMark = war.getGridMarkData().getGridIdAndMarkTypeIdList().find(v => v.getGridId() === gridId)?.getMarkTypeId() !== _selectedMarkTypeId;
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
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

        const languageType1 = LangUtils.getCurrentLanguageType();
        const languageType2 = LangUtils.getSecondaryLanguageType();
        const customName    = tile.getCustomName(languageType1);
        const customName1   = tile.getCustomName(languageType2);
        const labelName     = this._labelName;
        const labelName1    = this._labelName1;
        if ((customName) ?? (customName1)) {
            labelName.setText(customName ?? customName1 ?? LangConstants.UndefinedError);
            labelName1.setText(customName ? customName1 ?? `----` : `----`);
        } else {
            const tileType      = tile.getTileTypeId();
            const gameConfig    = tile.getGameConfig();
            labelName.setText(LangUtils.getTileName(tileType, gameConfig) ?? LangConstants.UndefinedError);
            labelName1.setText(LangUtils.getTileName(tileType, gameConfig, languageType2) ?? LangConstants.UndefinedError);
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
            overridingSkinId    : ForceSkinsUtils.getRawOverridingSkinId(war, tile.getPlayerIndex()),
            themeType           : tile.getTileThemeType(),
            isFullReplay        : war instanceof GameHelpersGhFactory.getRwWarClass(),
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
        const dataArray : DataForInfoRenderer[] = HelpersCollection.getNonNullElements([
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
        const tileCfg           = HelpersMisc.getExisted(gameConfig.getTileTemplateCfg(tile.getTileTypeId()));
        const playerIndex       = tile.getPlayerIndex() || 1;
        const skinId            = tile.getSkinId();
        const overridingSkinId  = ForceSkinsUtils.getRawOverridingSkinId(tile.getWar(), playerIndex);

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
        const playerIndex       = PlayersConstants.PlayerIndex.First;
        const skinId            = ForceSkinsUtils.getDefaultSkinId(playerIndex);
        const overridingSkinId  = ForceSkinsUtils.getRawOverridingSkinId(tile.getWar(), playerIndex);

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

interface DataForInfoRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    infoType    : TilesConstantsCommon.InfoTypeId;
    tile        : ITile;
    war         : BaseWarInterfaceIBwWar.IBwWar;
}
class InfoRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelValue!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupExtra!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupTouchType!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupTouchValue!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupTouchModify! : UiInterfacesIUiContainer.IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupTouchType,             callback: this._onTouchedGroupType },
            { ui: this._groupTouchValue,            callback: this._onTouchedGroupValue },
            { ui: this._groupTouchModify,           callback: this._onTouchedGroupModify },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

        if      (infoType === TilesConstantsCommon.InfoTypeId.DefenseBonus)                            { this._showHelpAsDefenseBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Income)                                  { this._showHelpAsIncome(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Vision)                                  { this._showHelpAsVision(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.HideUnitCategory)                        { this._showHelpAsHideUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture)                     { this._showHelpAsIsDefeatedOnCapture(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.ProduceUnitCategory)                     { this._showHelpAsProduceUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.GlobalBonus)                             { this._showHelpAsGlobalBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.RepairUnitCategory)                      { this._showHelpAsRepairUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BlockEnemyUnit)                          { this._showHelpAsBlockEnemyUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CoBoardUnit)                             { this._showHelpAsCoBoardUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Hp)                                      { this._showHelpAsHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CapturePoint)                            { this._showHelpAsCapturePoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BuildPoint)                              { this._showHelpAsBuildPoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsHighlighted)                           { this._showHelpAsIsHighlighted(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Buff)                                    { this._showHelpAsBuff(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalRadius)                           { this._showHelpAsCrystalRadius(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalPriority)                         { this._showHelpAsCrystalPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf)                    { this._showHelpAsCrystalCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly)                    { this._showHelpAsCrystalCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy)                   { this._showHelpAsCrystalCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFund)                        { this._showHelpAsCrystalDeltaFund(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showHelpAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaHp)                          { this._showHelpAsCrystalDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage)              { this._showHelpAsCrystalDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showHelpAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForUp)                        { this._showHelpAsCannonRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForRight)                     { this._showHelpAsCannonRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForLeft)                      { this._showHelpAsCannonRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForDown)                      { this._showHelpAsCannonRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonPriority)                          { this._showHelpAsCannonPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount)                    { this._showHelpAsCannonMaxTargetCount(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf)                     { this._showHelpAsCannonCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly)                     { this._showHelpAsCannonCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy)                    { this._showHelpAsCannonCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaHp)                           { this._showHelpAsCannonDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage)               { this._showHelpAsCannonDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showHelpAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp)                   { this._showHelpAsLaserTurretRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight)                { this._showHelpAsLaserTurretRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft)                 { this._showHelpAsLaserTurretRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown)                 { this._showHelpAsLaserTurretRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretPriority)                     { this._showHelpAsLaserTurretPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf)                { this._showHelpAsLaserTurretCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly)                { this._showHelpAsLaserTurretCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy)               { this._showHelpAsLaserTurretCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp)                      { this._showHelpAsLaserTurretDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showHelpAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedGroupValue(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if      (infoType === TilesConstantsCommon.InfoTypeId.DefenseBonus)                            { this._showValueAsDefenseBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Income)                                  { this._showValueAsIncome(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Vision)                                  { this._showValueAsVision(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.HideUnitCategory)                        { this._showValueAsHideUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture)                     { this._showValueAsIsDefeatedOnCapture(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.ProduceUnitCategory)                     { this._showValueAsProduceUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.GlobalBonus)                             { this._showValueAsGlobalBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.RepairUnitCategory)                      { this._showValueAsRepairUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BlockEnemyUnit)                          { this._showValueAsBlockEnemyUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CoBoardUnit)                             { this._showValueAsCoBoardUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Hp)                                      { this._showValueAsHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CapturePoint)                            { this._showValueAsCapturePoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BuildPoint)                              { this._showValueAsBuildPoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsHighlighted)                           { this._showValueAsIsHighlighted(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Buff)                                    { this._showValueAsBuff(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalRadius)                           { this._showValueAsCrystalRadius(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalPriority)                         { this._showValueAsCrystalPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf)                    { this._showValueAsCrystalCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly)                    { this._showValueAsCrystalCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy)                   { this._showValueAsCrystalCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFund)                        { this._showValueAsCrystalDeltaFund(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showValueAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaHp)                          { this._showValueAsCrystalDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage)              { this._showValueAsCrystalDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showValueAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForUp)                        { this._showValueAsCannonRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForRight)                     { this._showValueAsCannonRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForLeft)                      { this._showValueAsCannonRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForDown)                      { this._showValueAsCannonRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonPriority)                          { this._showValueAsCannonPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount)                    { this._showValueAsCannonMaxTargetCount(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf)                     { this._showValueAsCannonCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly)                     { this._showValueAsCannonCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy)                    { this._showValueAsCannonCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaHp)                           { this._showValueAsCannonDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage)               { this._showValueAsCannonDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showValueAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp)                   { this._showValueAsLaserTurretRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight)                { this._showValueAsLaserTurretRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft)                 { this._showValueAsLaserTurretRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown)                 { this._showValueAsLaserTurretRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretPriority)                     { this._showValueAsLaserTurretPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf)                { this._showValueAsLaserTurretCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly)                { this._showValueAsLaserTurretCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy)               { this._showValueAsLaserTurretCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp)                      { this._showValueAsLaserTurretDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showValueAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showValueAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedGroupModify(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if      (infoType === TilesConstantsCommon.InfoTypeId.DefenseBonus)                            { this._modifyAsDefenseBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Income)                                  { this._modifyAsIncome(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Vision)                                  { this._modifyAsVision(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.HideUnitCategory)                        { this._modifyAsHideUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture)                     { this._modifyAsIsDefeatedOnCapture(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.ProduceUnitCategory)                     { this._modifyAsProduceUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.GlobalBonus)                             { this._modifyAsGlobalBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.RepairUnitCategory)                      { this._modifyAsRepairUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BlockEnemyUnit)                          { this._modifyAsBlockEnemyUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CoBoardUnit)                             { this._modifyAsCoBoardUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Hp)                                      { this._modifyAsHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CapturePoint)                            { this._modifyAsCapturePoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BuildPoint)                              { this._modifyAsBuildPoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsHighlighted)                           { this._modifyAsIsHighlighted(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Buff)                                    { this._modifyAsBuff(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalRadius)                           { this._modifyAsCrystalRadius(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalPriority)                         { this._modifyAsCrystalPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf)                    { this._modifyAsCrystalCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly)                    { this._modifyAsCrystalCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy)                   { this._modifyAsCrystalCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFund)                        { this._modifyAsCrystalOffsetFund(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._modifyAsCrystalOffsetEnergyPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaHp)                          { this._modifyAsCrystalOffsetHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage)              { this._modifyAsCrystalOffsetFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._modifyAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForUp)                        { this._modifyAsCannonRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForRight)                     { this._modifyAsCannonRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForLeft)                      { this._modifyAsCannonRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForDown)                      { this._modifyAsCannonRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonPriority)                          { this._modifyAsCannonPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount)                    { this._modifyAsCannonMaxTargetCount(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf)                     { this._modifyAsCannonCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly)                     { this._modifyAsCannonCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy)                    { this._modifyAsCannonCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaHp)                           { this._modifyAsCannonOffsetHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage)               { this._modifyAsCannonDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._modifyAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp)                   { this._modifyAsLaserTurretRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight)                { this._modifyAsLaserTurretRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft)                 { this._modifyAsLaserTurretRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown)                 { this._modifyAsLaserTurretRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretPriority)                     { this._modifyAsLaserTurretPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf)                { this._modifyAsLaserTurretCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly)                { this._modifyAsLaserTurretCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy)               { this._modifyAsLaserTurretCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp)                      { this._modifyAsLaserTurretOffsetHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._modifyAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._modifyAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
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
        if      (infoType === TilesConstantsCommon.InfoTypeId.DefenseBonus)                            { this._updateViewAsDefenseBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Income)                                  { this._updateViewAsIncome(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Vision)                                  { this._updateViewAsVision(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.HideUnitCategory)                        { this._updateViewAsHideUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture)                     { this._updateViewAsIsDefeatedOnCapture(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.ProduceUnitCategory)                     { this._updateViewAsProduceUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.GlobalBonus)                             { this._updateViewAsGlobalBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.RepairUnitCategory)                      { this._updateViewAsRepairUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BlockEnemyUnit)                          { this._updateViewAsBlockEnemyUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CoBoardUnit)                             { this._updateViewAsCoBoardUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Hp)                                      { this._updateViewAsHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CapturePoint)                            { this._updateViewAsCapturePoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BuildPoint)                              { this._updateViewAsBuildPoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsHighlighted)                           { this._updateViewAsIsHighlighted(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Buff)                                    { this._updateViewAsBuff(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalRadius)                           { this._updateViewAsCrystalRadius(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalPriority)                         { this._updateViewAsCrystalPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf)                    { this._updateViewAsCrystalCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly)                    { this._updateViewAsCrystalCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy)                   { this._updateViewAsCrystalCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFund)                        { this._updateViewAsCrystalDeltaFund(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._updateViewAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaHp)                          { this._updateViewAsCrystalDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage)              { this._updateViewAsCrystalDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._updateViewAsCrystalDeltaPrimaryAmmoPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForUp)                        { this._updateViewAsCannonRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForRight)                     { this._updateViewAsCannonRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForLeft)                      { this._updateViewAsCannonRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForDown)                      { this._updateViewAsCannonRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonPriority)                          { this._updateViewAsCannonPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount)                    { this._updateViewAsCannonMaxTargetCount(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf)                     { this._updateViewAsCannonCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly)                     { this._updateViewAsCannonCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy)                    { this._updateViewAsCannonCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaHp)                           { this._updateViewAsCannonDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage)               { this._updateViewAsCannonDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._updateViewAsCannonDeltaPrimaryAmmoPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp)                   { this._updateViewAsLaserTurretRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight)                { this._updateViewAsLaserTurretRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft)                 { this._updateViewAsLaserTurretRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown)                 { this._updateViewAsLaserTurretRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretPriority)                     { this._updateViewAsLaserTurretPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf)                { this._updateViewAsLaserTurretCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly)                { this._updateViewAsLaserTurretCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy)               { this._updateViewAsLaserTurretCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp)                      { this._updateViewAsLaserTurretOffsetHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._updateViewAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsDefenseBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.B0352);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getDefenseUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(LangUtils.getUnitCategoryName(
                tile.getTemplateCfg().getDefenseUnitCategoryId(),
                tile.getGameConfig()
            ) ?? LangConstants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }

        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(`${HelpersText.getSignedNumText(tile.getDefenseAmount())}%`);
    }
    private _updateViewAsIncome(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.Income);
        this._labelValue.setText(`${tile.getIncomePerTurn()}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.VisionRange);
        this._labelValue.setText(`${tile.getCfgVisionRange()}`);

        const groupExtra = this._groupExtra;
        if (!tile.getIsVisionEnabledForAllPlayers()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(LangConstants.TextType.B1130);
        }

        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.HidableUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getHideUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(LangUtils.getUnitCategoryName(
                tile.getTemplateCfg().getHideUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? LangConstants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsIsDefeatedOnCapture(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.DefeatIfCaptured);
        this._labelValue.setText(tile.getIsDefeatedOnCapture() ? LangUtils.getText(LangConstants.TextType.Yes) : LangUtils.getText(LangConstants.TextType.No));
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((tile.getIsCustomizableBuilding()) && (WarTypesUtils.checkCanCheatInWar(war.getWarType())));
    }
    private _updateViewAsProduceUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.ProducibleUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getRegularProducibleUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(LangUtils.getUnitCategoryName(
                tile.getTemplateCfg().getProduceUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? LangConstants.UndefinedError);
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
        this._labelTitle.setLangText(LangConstants.TextType.B0359);
        this._labelValue.setText(`${offenseBonus ?? `--`} / ${defenseBonus ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsRepairUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.RepairableUnits);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getRepairUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(LangUtils.getUnitCategoryName(
                tile.getTemplateCfg().getRepairUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? LangConstants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }

        const repairNormalizedHp    = tile.getRepairNormalizedHp();
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(repairNormalizedHp == null ? `--` : `${HelpersText.getSignedNumText(repairNormalizedHp * 10)}`);
    }
    private _updateViewAsBlockEnemyUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.BlockableEnemyUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getBlockEnemyUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(LangUtils.getUnitCategoryName(
                tile.getTemplateCfg().getBlockEnemyUnitCategoryId() ?? 0,
                tile.getGameConfig(),
            ) ?? LangConstants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsCoBoardUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.CoBoardableUnit);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getCoBoardUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(LangUtils.getUnitCategoryName(
                tile.getTemplateCfg().getCoBoardUnitCategoryId() ?? 0,
                tile.getGameConfig(),
            ) ?? LangConstants.UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.Hp);
        this._labelValue.setText(`${tile.getCurrentHp()} / ${tile.getMaxHp() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsCapturePoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.CapturePoint);
        this._labelValue.setText(`${tile.getCurrentCapturePoint()} / ${tile.getMaxCapturePoint() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsBuildPoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.BuildPoint);
        this._labelValue.setText(`${tile.getCurrentBuildPoint()} / ${tile.getMaxBuildPoint() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.B0847);
        this._labelValue.setLangText(tile.getIsHighlighted() ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(LangConstants.TextType.AbnormalStates);
        this._labelValue.setText(`${tile.getUnfixedBuffList()?.length || `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(WarTypesUtils.checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsCrystalRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getRadius();
        this._labelTitle.setLangText(LangConstants.TextType.EffectiveRadius);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getPriority();
        this._labelTitle.setLangText(LangConstants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getCanAffectSelf();
        this._labelTitle.setLangText(LangConstants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getCanAffectAlly();
        this._labelTitle.setLangText(LangConstants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getCanAffectEnemy();
        this._labelTitle.setLangText(LangConstants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetFund();
        this._labelTitle.setLangText(LangConstants.TextType.FundOffset);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetEnergyPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.CoEnergyOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war }     = openData;
        const customCrystalData = HelpersMisc.getExisted(tile.getFinalCrystalData());
        const offsetHp          = customCrystalData.getOffsetHp();
        const canBeFatal        = customCrystalData.getCanBeFatal();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(LangConstants.TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeapon.TypeId.CustomCrystal));
    }
    private _updateViewAsCannonRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForUp();
        this._labelTitle.setLangText(LangConstants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForRight();
        this._labelTitle.setLangText(LangConstants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForDown();
        this._labelTitle.setLangText(LangConstants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForLeft();
        this._labelTitle.setLangText(LangConstants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getPriority();
        this._labelTitle.setLangText(LangConstants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getMaxTargetCount();
        this._labelTitle.setLangText(LangConstants.TextType.MaxTargets);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getCanAffectSelf();
        this._labelTitle.setLangText(LangConstants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getCanAffectAlly();
        this._labelTitle.setLangText(LangConstants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getCanAffectEnemy();
        this._labelTitle.setLangText(LangConstants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const data          = HelpersMisc.getExisted(tile.getFinalCannonData());
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(LangConstants.TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalCannonData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForUp();
        this._labelTitle.setLangText(LangConstants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForRight();
        this._labelTitle.setLangText(LangConstants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForDown();
        this._labelTitle.setLangText(LangConstants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForLeft();
        this._labelTitle.setLangText(LangConstants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getPriority();
        this._labelTitle.setLangText(LangConstants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getCanAffectSelf();
        this._labelTitle.setLangText(LangConstants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getCanAffectAlly();
        this._labelTitle.setLangText(LangConstants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getCanAffectEnemy();
        this._labelTitle.setLangText(LangConstants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const data          = HelpersMisc.getExisted(tile.getFinalLaserTurretData());
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(LangConstants.TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((WarTypesUtils.checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }

    private _showHelpAsDefenseBonus(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0352),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0088),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIncome(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.Income),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0086),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsVision(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.VisionRange),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0082),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHideUnitCategory(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.HidableUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0079),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsDefeatedOnCapture(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.DefeatIfCaptured),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0077),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsProduceUnitCategory(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.ProducibleUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0074),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsGlobalBonus(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0359),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0068),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsRepairUnitCategory(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.RepairableUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0065),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBlockEnemyUnit(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0012),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCoBoardUnit(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.CoBoardableUnit),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0011),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.Hp),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0059),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCapturePoint(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.CapturePoint),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0052),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuildPoint(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.BuildPoint),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0051),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsHighlighted(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0847),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0050),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuff(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.AbnormalStates),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0737),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getDefenseUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getHideUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getRegularProducibleUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getRepairUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsBlockEnemyUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig = tile.getGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getBlockEnemyUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : tile.getGameConfig(),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsCoBoardUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig = tile.getGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getCoBoardUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : tile.getGameConfig(),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileBuffListPanel, {
            tile        : tile,
            canModify   : tile.getWar().getCanCheat(),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const maxValue      = TilesConstantsCustomLimits.Building.DefenseAmount.MaxValue;
        const minValue      = TilesConstantsCustomLimits.Building.DefenseAmount.MinValue;
        const data          = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
        const gameConfig    = tile.getGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : data.getDefenseUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : newUnitTypeArray => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                    getTitle           : () => LangUtils.getText(LangConstants.TextType.DefBonus$),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const maxValue  = TilesConstantsCustomLimits.Building.IncomePerTurn.MaxValue;
        const minValue  = TilesConstantsCustomLimits.Building.IncomePerTurn.MinValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Income),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : tile.getIncomePerTurn(),
            callback        : newIncome => {
                const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const { tile, war } = openData;
        const maxValue      = TilesConstantsCustomLimits.Building.VisionRange.MaxValue;
        const minValue      = TilesConstantsCustomLimits.Building.VisionRange.MinValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.VisionRange),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : tile.getCfgVisionRange(),
            callback        : newVisionRange => {
                const callback = (isGlobalVision: boolean) => {
                    const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
                    data.setVisionRange(newVisionRange);
                    data.setIsVisionEnabledForAllPlayers(isGlobalVision);
                    tile.setCustomBuildingData(data);
                    this._updateView();

                    war.updateTilesAndUnitsOnVisibilityChanged(false);
                };
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent             : () => LangUtils.getText(LangConstants.TextType.A0018),
                    callback            : () => callback(false),
                    callbackOnCancel    : () => callback(true),
                    getTextForConfirm      : () => LangUtils.getText(LangConstants.TextType.Yes),
                    getTextForCancel       : () => LangUtils.getText(LangConstants.TextType.No),
                });
            },
        });
    }
    private _modifyAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const { tile, war } = openData;
        const gameConfig    = war.getGcData();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getHideUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
        data.setIsDefeatedOnCapture(!data.getIsDefeatedOnCapture());
        tile.setCustomBuildingData(data);
        this._updateView();
    }
    private _modifyAsProduceUnitCategory(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getRegularProducibleUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const maxValue  = TilesConstantsCustomLimits.Building.GlobalAttackBonus.MaxValue;
        const minValue  = TilesConstantsCustomLimits.Building.GlobalAttackBonus.MinValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0183),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : tile.getGlobalAttackBonus(),
            callback        : newAttackBonus => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                    getTitle           : () => LangUtils.getText(LangConstants.TextType.DefBonus$),
                    minValue        : minValue,
                    maxValue        : maxValue,
                    currentValue    : tile.getGlobalDefenseBonus(),
                    callback        : newDefenseBonus => {
                        const data              = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getRepairUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                if (!unitTypeArray.length) {
                    const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
                    data.setRepairUnitTypeArray(unitTypeArray);
                    data.setRepairNormalizedHp(null);
                    tile.setCustomBuildingData(data);
                    this._updateView();
                } else {
                    const minValue  = -1;
                    const maxValue  = TilesConstantsCustomLimits.Building.RepairNormalizedHp.MaxValue;
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                        getTitle           : () => LangUtils.getText(LangConstants.TextType.Hp),
                        currentValue    : tile.getRepairNormalizedHp() ?? -1,
                        minValue        : minValue,
                        maxValue        : maxValue,
                        callback        : normalizedRepairAmount => {
                            const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getBlockEnemyUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : tile.getCoBoardUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : unitTypeArray => {
                const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        const tile = openData.tile;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.Hp),
            currentValue    : tile.getCurrentHp(),
            minValue        : 0,
            maxValue        : tile.getMaxHp() ?? 0,
            callback        : value => {
                tile.setCurrentHp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCapturePoint(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currentValue = tile.getCurrentCapturePoint();
        if (tile.getIsCustomizableBuilding()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.MaxCapturePoint),
                currentValue    : tile.getMaxCapturePoint(),
                minValue        : 0,
                maxValue        : TilesConstantsCustomLimits.Building.MaxCapturePoint.MaxValue,
                callback        : newMaxCapturePoint => {
                    if (newMaxCapturePoint == null) {
                        const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
                        data.setMaxCapturePoint(null);
                        tile.setCustomBuildingData(data);
                        tile.setCurrentCapturePoint(0);
                        this._updateView();
                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                            getTitle        : () => LangUtils.getText(LangConstants.TextType.CapturePoint),
                            currentValue    : currentValue ?? 0,
                            minValue        : 0,
                            maxValue        : newMaxCapturePoint,
                            callback        : newCurrentCapturePoint => {
                                const data = tile.getCustomBuildingData() ?? new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle        : () => LangUtils.getText(LangConstants.TextType.CapturePoint),
                currentValue    : currentValue ?? 0,
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
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        const tile = openData.tile;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.BuildPoint),
            currentValue    : tile.getCurrentBuildPoint(),
            minValue        : TilesConstantsCustomLimits.Common.CurrentBuildPoint.MinValue,
            maxValue        : TilesConstantsCustomLimits.Common.CurrentBuildPoint.MaxValue,
            callback        : value => {
                tile.setCurrentBuildPoint(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if (!WarTypesUtils.checkCanCheatInWar(war.getWarType())) {
            return;
        }

        tile.setIsHighlighted(!tile.getIsHighlighted());
        tile.flushDataToView();
        this._updateView();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tile = openData.tile;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileBuffListPanel, {
            tile        : tile,
            canModify   : tile.getWar().getCanCheat(),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCrystalData()).getRadius();
        const minValue  = TilesConstantsCustomLimits.Crystal.Radius.MinValue;
        const maxValue  = TilesConstantsCustomLimits.Crystal.Radius.MaxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.EffectiveRadius),
            currentValue    : currValue ?? 0,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
                tile.setCustomCrystalRadius(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCrystalData()).getPriority();
        const minValue  = TilesConstantsCustomLimits.Crystal.Priority.MinValue;
        const maxValue  = TilesConstantsCustomLimits.Crystal.Priority.MaxValue;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Priority),
            currentValue    : currValue ?? 0,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
                tile.setCustomCrystalPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectSelf(!HelpersMisc.getExisted(tile.getFinalCrystalData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectAlly(!HelpersMisc.getExisted(tile.getFinalCrystalData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectEnemy(!HelpersMisc.getExisted(tile.getFinalCrystalData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetFund();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.FundOffset),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Crystal.OffsetFund.MinValue,
            maxValue        : TilesConstantsCustomLimits.Crystal.OffsetFund.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaFund(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetEnergyPercentage();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.CoEnergyOffset$),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MinValue,
            maxValue        : TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaEnergyPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType()))            ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ) {
            return;
        }

        const customCrystalData = HelpersMisc.getExisted(tile.getFinalCrystalData());
        const canBeFatal        = customCrystalData.getCanBeFatal();
        const callback          = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomCrystalOffsetHp(newOffsetHp);
            tile.setCustomCrystalCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsHpOffset),
            currentValue    : customCrystalData.getOffsetHp(),
            minValue        : TilesConstantsCustomLimits.Crystal.OffsetHp.MinValue,
            maxValue        : TilesConstantsCustomLimits.Crystal.OffsetHp.MaxValue,
            callback        : value => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getTitle               : () => LangUtils.getText(LangConstants.TextType.CanBeFatal),
                getContent             : () => LangUtils.getText(LangConstants.TextType.A0958),
                getTextForConfirm      : () => `${LangUtils.getText(LangConstants.TextType.Yes)}${canBeFatal ? `(${LangUtils.getText(LangConstants.TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${LangUtils.getText(LangConstants.TextType.No)}${!canBeFatal ? `(${LangUtils.getText(LangConstants.TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetFuelPercentage();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MinValue,
            maxValue        : TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCrystalData()).getOffsetPrimaryAmmoPercentage();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForUp();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeUp),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Cannon.RangeForUp.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.RangeForUp.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForUp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForRight();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeRight),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Cannon.RangeForRight.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.RangeForRight.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForRight(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForDown();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeDown),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Cannon.RangeForDown.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.RangeForDown.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForDown(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getRangeForLeft();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeLeft),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Cannon.RangeForLeft.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.RangeForLeft.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForLeft(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getPriority();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Priority),
            currentValue    : currValue,
            minValue        : TilesConstantsCustomLimits.Cannon.Priority.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.Priority.MaxValue,
            callback        : value => {
                tile.setCustomCannonPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getMaxTargetCount();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.MaxTargets),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Cannon.MaxTargetCount.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.MaxTargetCount.MaxValue,
            callback        : value => {
                tile.setCustomCannonMaxTargetCount(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectSelf(!HelpersMisc.getExisted(tile.getFinalCannonData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectAlly(!HelpersMisc.getExisted(tile.getFinalCannonData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectEnemy(!HelpersMisc.getExisted(tile.getFinalCannonData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType()))            ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ) {
            return;
        }

        const customCannonData  = HelpersMisc.getExisted(tile.getFinalCannonData());
        const canBeFatal        = customCannonData.getCanBeFatal();
        const callback          = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomCannonOffsetHp(newOffsetHp);
            tile.setCustomCannonCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsHpOffset),
            currentValue    : customCannonData.getOffsetHp(),
            minValue        : TilesConstantsCustomLimits.Cannon.OffsetHp.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.OffsetHp.MaxValue,
            callback        : value => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getTitle               : () => LangUtils.getText(LangConstants.TextType.CanBeFatal),
                getContent             : () => LangUtils.getText(LangConstants.TextType.A0958),
                getTextForConfirm      : () => `${LangUtils.getText(LangConstants.TextType.Yes)}${canBeFatal ? `(${LangUtils.getText(LangConstants.TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${LangUtils.getText(LangConstants.TextType.No)}${!canBeFatal ? `(${LangUtils.getText(LangConstants.TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getOffsetFuelPercentage();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCannonDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalCannonData()).getOffsetPrimaryAmmoPercentage();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCannonDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForUp();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeUp),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.LaserTurret.RangeForUp.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.RangeForUp.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForUp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForRight();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeRight),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.LaserTurret.RangeForRight.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.RangeForRight.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForRight(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForDown();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeDown),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.LaserTurret.RangeForDown.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.RangeForDown.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForDown(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getRangeForLeft();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.RangeLeft),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.LaserTurret.RangeForLeft.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.RangeForLeft.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForLeft(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getPriority();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.Priority),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.LaserTurret.Priority.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.Priority.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectSelf(!HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectAlly(!HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectEnemy(!HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType()))                ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ) {
            return;
        }

        const customLaserTurretData = HelpersMisc.getExisted(tile.getFinalLaserTurretData());
        const canBeFatal            = customLaserTurretData.getCanBeFatal();
        const callback              = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomLaserTurretOffsetHp(newOffsetHp);
            tile.setCustomLaserTurretCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsHpOffset),
            currentValue    : customLaserTurretData.getOffsetHp(),
            minValue        : TilesConstantsCustomLimits.LaserTurret.OffsetHp.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.OffsetHp.MaxValue,
            callback        : value => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getTitle               : () => LangUtils.getText(LangConstants.TextType.CanBeFatal),
                getContent             : () => LangUtils.getText(LangConstants.TextType.A0958),
                getTextForConfirm      : () => `${LangUtils.getText(LangConstants.TextType.Yes)}${canBeFatal ? `(${LangUtils.getText(LangConstants.TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${LangUtils.getText(LangConstants.TextType.No)}${!canBeFatal ? `(${LangUtils.getText(LangConstants.TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getOffsetFuelPercentage();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.LaserTurret.OffsetFuelPercentage.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!WarTypesUtils.checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = HelpersMisc.getExisted(tile.getFinalLaserTurretData()).getOffsetPrimaryAmmoPercentage();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue ?? 0,
            minValue        : TilesConstantsCustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : TilesConstantsCustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
}

interface DataForMoveCostRenderer extends UiTypesUiListItemData.UiListItemData {
    index               : number;
    gameConfig          : GameConfigGcData.GcData;
    unitType            : number;
    tileCfg             : ProtoSchemaCommonProtoConfigTileTemplateCfg.TileTemplateCfg;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}
class MoveCostRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView          = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
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
        const moveCostCfg   = HelpersMisc.getExisted(gameConfig.getMoveCostCfg(HelpersMisc.getExisted(openData.tileCfg.getTileTypeId())));
        const moveCost      = moveCostCfg[HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId())].getCost();
        this._imgBg.setIsVisible(openData.index % 4 === 2);
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : Math.max(PlayersConstants.PlayerIndex.First, openData.skinId),
            overridingSkinId    : openData.overridingSkinId,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : openData.playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), CommonModelCommonModel.getUnitAnimationTickCount());
    }
}

interface DataForDamageRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig          : GameConfigGcData.GcData;
    index               : number;
    targetTileType      : number;
    playerIndex         : number;
    attackerUnitType    : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}
class DamageRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!                : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPrimaryAttack!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView              = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
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
        unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : openData.skinId,
            overridingSkinId    : openData.overridingSkinId,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : attackerUnitType,
                playerIndex : openData.playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), CommonModelCommonModel.getUnitAnimationTickCount());

        const attackCfg             = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(attackerUnitType));
        const targetArmorType       = HelpersMisc.getExisted(gameConfig.getTileTemplateCfg(openData.targetTileType)?.getArmorTypeId());
        const primaryAttackDamage   = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
        const secondaryAttackDamage = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
        this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
        this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
    }
}

function createInfoDefenseBonus(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getDefenseUnitCategoryId() === UnitsConstants.CategoryId.None) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.DefenseBonus,
            war         : war,
            tile        : tile,
        };
}
function createInfoIncome(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getIncomePerTurn() === 0) && (!tile.getIsCustomizableBuilding())
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.Income,
            war,
            tile,
        };
}
function createInfoVision(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getCfgVisionRange() == 0) && (!tile.getIsVisionEnabledForAllPlayers()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.Vision,
            war,
            tile
        };
}
function createInfoHideUnitCategory(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getHideUnitCategoryId() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.HideUnitCategory,
            war         : war,
            tile        : tile,
        };
}
function createInfoIsDefeatOnCapture(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((!tile.getIsDefeatedOnCapture()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture,
            war,
            tile,
        };
}
function createInfoProduceUnitCategory(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getProduceUnitCategoryId() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.ProduceUnitCategory,
            war,
            tile,
        };
}
function createInfoGlobalBonus(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getGlobalAttackBonus() === 0) && (tile.getGlobalDefenseBonus() === 0) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.GlobalBonus,
            war         : war,
            tile        : tile,
        };
}
function createInfoRepairUnitCategory(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getRepairUnitCategoryId() == UnitsConstants.CategoryId.None) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.RepairUnitCategory,
            war,
            tile,
        };
}
function createInfoBlockEnemyUnit(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((!tile.getTemplateCfg().getBlockEnemyUnitCategoryId()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.BlockEnemyUnit,
            war,
            tile,
        };
}
function createInfoCoBoardUnit(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((!tile.getTemplateCfg().getCoBoardUnitCategoryId()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CoBoardUnit,
            war,
            tile,
        };
}
function createInfoHp(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getMaxHp() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.Hp,
            war,
            tile,
        };
}
function createInfoCapturePoint(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getMaxCapturePoint() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CapturePoint,
            war,
            tile,
        };
}
function createInfoBuildPoint(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getMaxBuildPoint() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.BuildPoint,
            war,
            tile,
        };
}
function createInfoIsHighlighted(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return {
        index       : 0,
        infoType    : TilesConstantsCommon.InfoTypeId.IsHighlighted,
        war,
        tile,
    };
}
function createInfoBuff(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return {
        index       : 0,
        infoType    : TilesConstantsCommon.InfoTypeId.Buff,
        war         : war,
        tile        : tile,
    };
}
function createInfoCrystalRadius(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalCrystalData() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalRadius,
            war,
            tile,
        };
}
function createInfoCrystalPriority(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalPriority,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectSelf(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectAlly(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectEnemy(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoCrystalDeltaFund(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaFund,
            war,
            tile,
        };
}
function createInfoCrystalDeltaEnergyPercentage(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage,
            war,
            tile,
        };
}
function createInfoCrystalDeltaHp(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalCrystalData() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaHp,
            war,
            tile,
        };
}
function createInfoCrystalDeltaFuelPercentage(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoCrystalDeltaPrimaryAmmoPercentage(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
function createInfoCannonRangeForUp(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonUp))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForUp,
            war,
            tile,
        };
}
function createInfoCannonRangeForDown(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonDown))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForDown,
            war,
            tile,
        };
}
function createInfoCannonRangeForLeft(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonLeft))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForLeft,
            war,
            tile,
        };
}
function createInfoCannonRangeForRight(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonRight))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForRight,
            war,
            tile,
        };
}
function createInfoCannonPriority(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonPriority,
            war,
            tile,
        };
}
function createInfoCannonMaxTargetCount(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount,
            war,
            tile,
        };
}
function createInfoCannonCanAffectSelf(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf,
            war,
            tile,
        };
}
function createInfoCannonCanAffectAlly(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly,
            war,
            tile,
        };
}
function createInfoCannonCanAffectEnemy(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoCannonDeltaHp(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalCannonData() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonDeltaHp,
            war,
            tile,
        };
}
function createInfoCannonDeltaFuelPercentage(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoCannonDeltaPrimaryAmmoPercentage(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForUp(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForDown(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForLeft(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForRight(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight,
            war,
            tile,
        };
}
function createInfoLaserTurretPriority(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretPriority,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectSelf(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectAlly(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectEnemy(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaHp(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalLaserTurretData() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaFuelPercentage(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaPrimaryAmmoPercentage(war: BaseWarInterfaceIBwWar.IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
