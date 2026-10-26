import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { getUnitAnimationTickCount } from "../../common/model/CommonModel.ts";
import { showLang } from "../../FloatText.ts";
import { getFinalSkinIdArray, getRawOverridingSkinId, getDefaultSkinId } from "../../forceSkins/Utils.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import {
    getTileViewClass,
    getMpwWarClass,
    getMeWarClass,
    getRwWarBaseClass,
    getSpwWarClass,
    getRwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { TypeId } from "../../gridMarks/Constants.ts";
import { addGridMark, deleteGridMark } from "../../gridMarks/Utils.ts";
import { createRange, getNonNullElements } from "../../helpers/Collection.ts";
import { getGridMark } from "../../helpers/ImageSource.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { getSignedNumText } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getText,
    getLanguageText,
    getCurrentLanguageType,
    getSecondaryLanguageType,
    getTileName,
    getUnitCategoryName,
} from "../../lang/Utils.ts";
import { reqMpwCommonMarkGrid } from "../../multiPlayerWar/model/MpwProxy.ts";
import type { BwTileBuffChanged, BwTileChanged, GridMarkAdded, GridMarkDeleted } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId as NotificationsTypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { TileTemplateCfg } from "../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import { TileCustomBuildingData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { CustomName, InfoTypeId } from "../../tiles/constants/Common.ts";
import { Building, Common, Crystal, Cannon, LaserTurret } from "../../tiles/constants/CustomLimits.ts";
import { TypeId as TilesConstantsMapWeaponTypeId } from "../../tiles/constants/MapWeapon.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { create } from "../../tiles/utils/Serialization.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import { getUiUnitViewClass } from "../../ui/utils/UiFactory.ts";
import { WeaponTypeId, CategoryId } from "../../units/Constants.ts";
import { createDefault } from "../../units/utils/Serialization.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { checkCanCheatInWar } from "../../warTypes/Utils.ts";

let _selectedMarkTypeId         = TypeId.MinMarkTypeId;

export interface OpenData {
    tile                    : ITile;
    callbackForAddUnit      : (() => void) | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnTilesInfo!         : IUiButton;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnAddUnit!           : IUiButton;

    private readonly _layoutName!           : IUiLayout;
    private readonly _labelName!            : IUiLabel;
    private readonly _labelName1!           : IUiLabel;
    private readonly _conTileView!          : IUiContainer;
    private readonly _btnModifyType!        : IUiButton;
    private readonly _btnModifyName!        : IUiButton;
    private readonly _listInfo!             : IUiScrollList<DataForInfoRenderer>;

    private readonly _groupMoveCost!        : IUiContainer;
    private readonly _layoutMoveCost1!      : IUiLayout;
    private readonly _layoutMoveCost2!      : IUiLayout;
    private readonly _labelMoveCostTitle1!  : IUiLabel;
    private readonly _labelMoveCostTitle2!  : IUiLabel;
    private readonly _labelMoveCost1!       : IUiLabel;
    private readonly _labelMoveCost2!       : IUiLabel;
    private readonly _listMoveCost!         : IUiScrollList<DataForMoveCostRenderer>;

    private readonly _groupDamageChart!     : IUiContainer;
    private readonly _layoutDefense1!       : IUiLayout;
    private readonly _labelDefense1!        : IUiLabel;
    private readonly _labelMain1!           : IUiLabel;
    private readonly _labelSub1!            : IUiLabel;
    private readonly _layoutDefense2!       : IUiLayout;
    private readonly _labelDefense2!        : IUiLabel;
    private readonly _labelMain2!           : IUiLabel;
    private readonly _labelSub2!            : IUiLabel;
    private readonly _listDamageChart!      : IUiScrollList<DataForDamageRenderer>;

    private readonly _groupButtons!         : IUiLayout;
    private readonly _btnMarkType!          : IUiButton;
    private readonly _imgMarkType!          : IUiImage;
    private readonly _btnMark!              : IUiButton;
    private readonly _btnUnmark!            : IUiButton;
    private readonly _btnBatchMark!         : IUiButton;

    private readonly _tileView              = new (getTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.ActionPlannerStateChanged,     callback: this._onNotifyBwPlannerStateChanged },
            { type: NotificationsTypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            { type: NotificationsTypeId.StateIndicatorTick,              callback: this._onNotifyStateIndicatorTick },
            { type: NotificationsTypeId.BwTileIsHighlightedChanged,      callback: this._onNotifyTileIsHighlightedChanged },
            { type: NotificationsTypeId.BwTileBuffChanged,               callback: this._onNotifyTileBuffChanged },
            { type: NotificationsTypeId.BwTileCustomNameIdChanged,       callback: this._onNotifyTileCustomNameIdChanged },
            { type: NotificationsTypeId.MsgMpwCommonMarkTile,            callback: this._onNotifyMsgMpwCommonMarkGrid },
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
    private _onNotifyTileBuffChanged(e: Event): void {
        if ((e.data as BwTileBuffChanged).tile === this.getOpenData()?.tile) {
            this._updateTileView();
            this._updateListInfo();
        }
    }
    private _onNotifyTileCustomNameIdChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyMsgMpwCommonMarkGrid(e: Event): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const tileId = tile.getGridIndex().getGridId(tile.getWar().getTileMap().getMapSize());
        if ((e.data as S).getGridIdArrayForAddMark().indexOf(tileId) >= 0) {
            showLang(TextType.A0848);
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
        openPanel(getDict().CommonChooseTileInfoPanel, {
            gameConfig          : gameConfig,
            finalSkinIdArray    : getFinalSkinIdArray(war, true),
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
                const newCfg            = getExisted(gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType, tileObjectType));
                const data              = create({
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
                dispatch(NotificationsTypeId.BwTileChanged, { gridIndex } as BwTileChanged);

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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B1430),
            availableNumberArray    : createRange(0, CustomName.MaxId + 1, 1),
            currentNumber           : tile.getCustomNameId(),
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${getText(TextType.B0391)})`;
                } else {
                    return getLanguageText({ textArray: arr?.find(v => (v.getNameId() ?? 0) === num)?.getNameTextArray() ?? [] }) ?? `----`;
                }
            },
            callbackForSettings     : () => {
                openPanel(getDict().MeTileCustomNameListPanel, { war: war });
                closePanel(getDict().CommonChooseSingleNumberPanel);
            },
            callbackOnConfirm       : num => tile.setCustomNameId(num == 0 ? null : num),
        });
    }
    private _onTouchedBtnMarkType(): void {
        openPanel(getDict().CommonChooseSingleGridMarkPanel, {
            currentMarkTypeId   : _selectedMarkTypeId,
            callback            : markTypeId => {
                _selectedMarkTypeId = markTypeId;
                this._updateImgMarkType();
                this._updateBtnMarkAndUnmark();
                closePanel(getDict().CommonChooseSingleGridMarkPanel);
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
        if (war instanceof getMpwWarClass()) {
            const player = war.getPlayerLoggedIn();
            if ((player == null) || (player.getMarkTypeId(gridId) === _selectedMarkTypeId)) {
                return;
            }

            reqMpwCommonMarkGrid(getExisted(war.getWarId()), [gridId], [], _selectedMarkTypeId);

        } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
            if (addGridMark(war.getGridMarkData().getGridIdAndMarkTypeIdList(), gridId, _selectedMarkTypeId)) {
                dispatch(NotificationsTypeId.GridMarkAdded, {
                    war     : war,
                    gridId  : gridId,
                } as GridMarkAdded);

                showLang(TextType.A0848);
                this._updateBtnMarkAndUnmark();

            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }

        } else if (war instanceof getSpwWarClass()) {
            if (addGridMark(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), gridId, _selectedMarkTypeId)) {
                dispatch(NotificationsTypeId.GridMarkAdded, {
                    war     : war,
                    gridId  : gridId,
                } as GridMarkAdded);

                showLang(TextType.A0848);
                this._updateBtnMarkAndUnmark();

            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }

        } else {
            // TODO
            const player = war.getPlayerInTurn();
            if (player.getMarkTypeId(gridId)) {
                return;
            }

            player.addGridMark(gridId, _selectedMarkTypeId);
            this._updateBtnMarkAndUnmark();
            showLang(TextType.A0848);
        }
    }
    private _onTouchedBtnUnmark(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const war       = tile.getWar();
        const gridId    = tile.getGridIndex().getGridId(war.getTileMap().getMapSize());
        if (war instanceof getMpwWarClass()) {
            const player = war.getPlayerLoggedIn();
            if ((player == null) || (!player.getMarkTypeId(gridId))) {
                return;
            }

            reqMpwCommonMarkGrid(getExisted(war.getWarId()), [], [gridId], _selectedMarkTypeId);

        } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
            if (deleteGridMark(war.getGridMarkData().getGridIdAndMarkTypeIdList(), gridId)) {
                dispatch(NotificationsTypeId.GridMarkDeleted, {
                    war     : war,
                    gridId  : gridId,
                } as GridMarkDeleted);

                showLang(TextType.OperationSucceeded);
                this._updateBtnMarkAndUnmark();

            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }

        } else if (war instanceof getSpwWarClass()) {
            if (deleteGridMark(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), gridId)) {
                dispatch(NotificationsTypeId.GridMarkDeleted, {
                    war     : war,
                    gridId  : gridId,
                } as GridMarkDeleted);

                showLang(TextType.OperationSucceeded);
                this._updateBtnMarkAndUnmark();

            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
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

        openPanel(getDict().BwMarkGridPanel, {
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

        openPanel(getDict().CommonTileChartPanel, {
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
        this._labelTitle.setLangText(TextType.B0423);
        this._labelMoveCostTitle1.setLangText(TextType.B0351);
        this._labelMoveCostTitle2.setLangText(TextType.B0351);
        this._labelMoveCost1.setLangText(TextType.B1282);
        this._labelMoveCost2.setLangText(TextType.B1282);
        this._labelDefense1.setLangText(TextType.B0334);
        this._labelDefense2.setLangText(TextType.B0334);
        this._labelMain1.setLangText(TextType.B0692);
        this._labelSub1.setLangText(TextType.B0693);
        this._labelMain2.setLangText(TextType.B0692);
        this._labelSub2.setLangText(TextType.B0693);
        this._btnBatchMark.setLangText(TextType.B1109);
        this._btnAddUnit.setLangText(TextType.B0535);
        this._btnTilesInfo.setLangText(TextType.B0910);
        this._btnClose.setLangText(TextType.B0204);
        this._btnMark.setLangText(TextType.B0914);
        this._btnUnmark.setLangText(TextType.B0915);

        this._layoutMoveCost1.arrangeItems();
        this._layoutMoveCost2.arrangeItems();
        this._layoutDefense1.arrangeItems();
        this._layoutDefense2.arrangeItems();
    }

    private _updateBtnAddUnit(): void {
        this._btnAddUnit.setIsVisible(this.getOpenData()?.callbackForAddUnit != null);
    }

    private _updateImgMarkType(): void {
        this._imgMarkType.loadSource(getGridMark(_selectedMarkTypeId));
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
        if (war instanceof getMpwWarClass()) {
            const player    = war.getPlayerLoggedIn();
            const canMark   = (player != null) && (player.getMarkTypeId(gridId) !== _selectedMarkTypeId);
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);

        } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
            const canMark = war.getGridMarkData().getGridIdAndMarkTypeIdList().find(v => v.getGridId() === gridId)?.getMarkTypeId() !== _selectedMarkTypeId;
            btnMark.setIsVisible(canMark);
            btnUnmark.setIsVisible(!canMark);

        } else if (war instanceof getSpwWarClass()) {
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

        const languageType1 = getCurrentLanguageType();
        const languageType2 = getSecondaryLanguageType();
        const customName    = tile.getCustomName(languageType1);
        const customName1   = tile.getCustomName(languageType2);
        const labelName     = this._labelName;
        const labelName1    = this._labelName1;
        if ((customName) ?? (customName1)) {
            labelName.setText(customName ?? customName1 ?? UndefinedError);
            labelName1.setText(customName ? customName1 ?? `----` : `----`);
        } else {
            const tileType      = tile.getTileTypeId();
            const gameConfig    = tile.getGameConfig();
            labelName.setText(getTileName(tileType, gameConfig) ?? UndefinedError);
            labelName1.setText(getTileName(tileType, gameConfig, languageType2) ?? UndefinedError);
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
            overridingSkinId    : getRawOverridingSkinId(war, tile.getPlayerIndex()),
            themeType           : tile.getTileThemeType(),
            isFullReplay        : war instanceof getRwWarClass(),
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
        const dataArray : DataForInfoRenderer[] = getNonNullElements([
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
        const tileCfg           = getExisted(gameConfig.getTileTemplateCfg(tile.getTileTypeId()));
        const playerIndex       = tile.getPlayerIndex() || 1;
        const skinId            = tile.getSkinId();
        const overridingSkinId  = getRawOverridingSkinId(tile.getWar(), playerIndex);

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
        const playerIndex       = PlayerIndex.First;
        const skinId            = getDefaultSkinId(playerIndex);
        const overridingSkinId  = getRawOverridingSkinId(tile.getWar(), playerIndex);

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

interface DataForInfoRenderer extends UiListItemData {
    index       : number;
    infoType    : InfoTypeId;
    tile        : ITile;
    war         : IBwWar;
}
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : IUiImage;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelValue!       : IUiLabel;
    private readonly _groupExtra!       : IUiContainer;
    private readonly _labelExtraInfo!   : IUiLabel;
    private readonly _groupTouchType!   : IUiContainer;
    private readonly _groupTouchValue!  : IUiContainer;
    private readonly _groupTouchModify! : IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupTouchType,             callback: this._onTouchedGroupType },
            { ui: this._groupTouchValue,            callback: this._onTouchedGroupValue },
            { ui: this._groupTouchModify,           callback: this._onTouchedGroupModify },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

        if      (infoType === InfoTypeId.DefenseBonus)                            { this._showHelpAsDefenseBonus(); }
        else if (infoType === InfoTypeId.Income)                                  { this._showHelpAsIncome(); }
        else if (infoType === InfoTypeId.Vision)                                  { this._showHelpAsVision(); }
        else if (infoType === InfoTypeId.HideUnitCategory)                        { this._showHelpAsHideUnitCategory(); }
        else if (infoType === InfoTypeId.IsDefeatedOnCapture)                     { this._showHelpAsIsDefeatedOnCapture(); }
        else if (infoType === InfoTypeId.ProduceUnitCategory)                     { this._showHelpAsProduceUnitCategory(); }
        else if (infoType === InfoTypeId.GlobalBonus)                             { this._showHelpAsGlobalBonus(); }
        else if (infoType === InfoTypeId.RepairUnitCategory)                      { this._showHelpAsRepairUnitCategory(); }
        else if (infoType === InfoTypeId.BlockEnemyUnit)                          { this._showHelpAsBlockEnemyUnit(); }
        else if (infoType === InfoTypeId.CoBoardUnit)                             { this._showHelpAsCoBoardUnit(); }
        else if (infoType === InfoTypeId.Hp)                                      { this._showHelpAsHp(); }
        else if (infoType === InfoTypeId.CapturePoint)                            { this._showHelpAsCapturePoint(); }
        else if (infoType === InfoTypeId.BuildPoint)                              { this._showHelpAsBuildPoint(); }
        else if (infoType === InfoTypeId.IsHighlighted)                           { this._showHelpAsIsHighlighted(); }
        else if (infoType === InfoTypeId.Buff)                                    { this._showHelpAsBuff(); }

        else if (infoType === InfoTypeId.CrystalRadius)                           { this._showHelpAsCrystalRadius(); }
        else if (infoType === InfoTypeId.CrystalPriority)                         { this._showHelpAsCrystalPriority(); }
        else if (infoType === InfoTypeId.CrystalCanAffectSelf)                    { this._showHelpAsCrystalCanAffectSelf(); }
        else if (infoType === InfoTypeId.CrystalCanAffectAlly)                    { this._showHelpAsCrystalCanAffectAlly(); }
        else if (infoType === InfoTypeId.CrystalCanAffectEnemy)                   { this._showHelpAsCrystalCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CrystalDeltaFund)                        { this._showHelpAsCrystalDeltaFund(); }
        else if (infoType === InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showHelpAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaHp)                          { this._showHelpAsCrystalDeltaHp(); }
        else if (infoType === InfoTypeId.CrystalDeltaFuelPercentage)              { this._showHelpAsCrystalDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showHelpAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === InfoTypeId.CannonRangeForUp)                        { this._showHelpAsCannonRangeForUp(); }
        else if (infoType === InfoTypeId.CannonRangeForRight)                     { this._showHelpAsCannonRangeForRight(); }
        else if (infoType === InfoTypeId.CannonRangeForLeft)                      { this._showHelpAsCannonRangeForLeft(); }
        else if (infoType === InfoTypeId.CannonRangeForDown)                      { this._showHelpAsCannonRangeForDown(); }
        else if (infoType === InfoTypeId.CannonPriority)                          { this._showHelpAsCannonPriority(); }
        else if (infoType === InfoTypeId.CannonMaxTargetCount)                    { this._showHelpAsCannonMaxTargetCount(); }
        else if (infoType === InfoTypeId.CannonCanAffectSelf)                     { this._showHelpAsCannonCanAffectSelf(); }
        else if (infoType === InfoTypeId.CannonCanAffectAlly)                     { this._showHelpAsCannonCanAffectAlly(); }
        else if (infoType === InfoTypeId.CannonCanAffectEnemy)                    { this._showHelpAsCannonCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CannonDeltaHp)                           { this._showHelpAsCannonDeltaHp(); }
        else if (infoType === InfoTypeId.CannonDeltaFuelPercentage)               { this._showHelpAsCannonDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showHelpAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === InfoTypeId.LaserTurretRangeForUp)                   { this._showHelpAsLaserTurretRangeForUp(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForRight)                { this._showHelpAsLaserTurretRangeForRight(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForLeft)                 { this._showHelpAsLaserTurretRangeForLeft(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForDown)                 { this._showHelpAsLaserTurretRangeForDown(); }
        else if (infoType === InfoTypeId.LaserTurretPriority)                     { this._showHelpAsLaserTurretPriority(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectSelf)                { this._showHelpAsLaserTurretCanAffectSelf(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectAlly)                { this._showHelpAsLaserTurretCanAffectAlly(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectEnemy)               { this._showHelpAsLaserTurretCanAffectEnemy(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaHp)                      { this._showHelpAsLaserTurretDeltaHp(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showHelpAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedGroupValue(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if      (infoType === InfoTypeId.DefenseBonus)                            { this._showValueAsDefenseBonus(); }
        else if (infoType === InfoTypeId.Income)                                  { this._showValueAsIncome(); }
        else if (infoType === InfoTypeId.Vision)                                  { this._showValueAsVision(); }
        else if (infoType === InfoTypeId.HideUnitCategory)                        { this._showValueAsHideUnitCategory(); }
        else if (infoType === InfoTypeId.IsDefeatedOnCapture)                     { this._showValueAsIsDefeatedOnCapture(); }
        else if (infoType === InfoTypeId.ProduceUnitCategory)                     { this._showValueAsProduceUnitCategory(); }
        else if (infoType === InfoTypeId.GlobalBonus)                             { this._showValueAsGlobalBonus(); }
        else if (infoType === InfoTypeId.RepairUnitCategory)                      { this._showValueAsRepairUnitCategory(); }
        else if (infoType === InfoTypeId.BlockEnemyUnit)                          { this._showValueAsBlockEnemyUnit(); }
        else if (infoType === InfoTypeId.CoBoardUnit)                             { this._showValueAsCoBoardUnit(); }
        else if (infoType === InfoTypeId.Hp)                                      { this._showValueAsHp(); }
        else if (infoType === InfoTypeId.CapturePoint)                            { this._showValueAsCapturePoint(); }
        else if (infoType === InfoTypeId.BuildPoint)                              { this._showValueAsBuildPoint(); }
        else if (infoType === InfoTypeId.IsHighlighted)                           { this._showValueAsIsHighlighted(); }
        else if (infoType === InfoTypeId.Buff)                                    { this._showValueAsBuff(); }

        else if (infoType === InfoTypeId.CrystalRadius)                           { this._showValueAsCrystalRadius(); }
        else if (infoType === InfoTypeId.CrystalPriority)                         { this._showValueAsCrystalPriority(); }
        else if (infoType === InfoTypeId.CrystalCanAffectSelf)                    { this._showValueAsCrystalCanAffectSelf(); }
        else if (infoType === InfoTypeId.CrystalCanAffectAlly)                    { this._showValueAsCrystalCanAffectAlly(); }
        else if (infoType === InfoTypeId.CrystalCanAffectEnemy)                   { this._showValueAsCrystalCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CrystalDeltaFund)                        { this._showValueAsCrystalDeltaFund(); }
        else if (infoType === InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showValueAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaHp)                          { this._showValueAsCrystalDeltaHp(); }
        else if (infoType === InfoTypeId.CrystalDeltaFuelPercentage)              { this._showValueAsCrystalDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showValueAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === InfoTypeId.CannonRangeForUp)                        { this._showValueAsCannonRangeForUp(); }
        else if (infoType === InfoTypeId.CannonRangeForRight)                     { this._showValueAsCannonRangeForRight(); }
        else if (infoType === InfoTypeId.CannonRangeForLeft)                      { this._showValueAsCannonRangeForLeft(); }
        else if (infoType === InfoTypeId.CannonRangeForDown)                      { this._showValueAsCannonRangeForDown(); }
        else if (infoType === InfoTypeId.CannonPriority)                          { this._showValueAsCannonPriority(); }
        else if (infoType === InfoTypeId.CannonMaxTargetCount)                    { this._showValueAsCannonMaxTargetCount(); }
        else if (infoType === InfoTypeId.CannonCanAffectSelf)                     { this._showValueAsCannonCanAffectSelf(); }
        else if (infoType === InfoTypeId.CannonCanAffectAlly)                     { this._showValueAsCannonCanAffectAlly(); }
        else if (infoType === InfoTypeId.CannonCanAffectEnemy)                    { this._showValueAsCannonCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CannonDeltaHp)                           { this._showValueAsCannonDeltaHp(); }
        else if (infoType === InfoTypeId.CannonDeltaFuelPercentage)               { this._showValueAsCannonDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showValueAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === InfoTypeId.LaserTurretRangeForUp)                   { this._showValueAsLaserTurretRangeForUp(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForRight)                { this._showValueAsLaserTurretRangeForRight(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForLeft)                 { this._showValueAsLaserTurretRangeForLeft(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForDown)                 { this._showValueAsLaserTurretRangeForDown(); }
        else if (infoType === InfoTypeId.LaserTurretPriority)                     { this._showValueAsLaserTurretPriority(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectSelf)                { this._showValueAsLaserTurretCanAffectSelf(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectAlly)                { this._showValueAsLaserTurretCanAffectAlly(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectEnemy)               { this._showValueAsLaserTurretCanAffectEnemy(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaHp)                      { this._showValueAsLaserTurretDeltaHp(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showValueAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showValueAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _onTouchedGroupModify(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        if      (infoType === InfoTypeId.DefenseBonus)                            { this._modifyAsDefenseBonus(); }
        else if (infoType === InfoTypeId.Income)                                  { this._modifyAsIncome(); }
        else if (infoType === InfoTypeId.Vision)                                  { this._modifyAsVision(); }
        else if (infoType === InfoTypeId.HideUnitCategory)                        { this._modifyAsHideUnitCategory(); }
        else if (infoType === InfoTypeId.IsDefeatedOnCapture)                     { this._modifyAsIsDefeatedOnCapture(); }
        else if (infoType === InfoTypeId.ProduceUnitCategory)                     { this._modifyAsProduceUnitCategory(); }
        else if (infoType === InfoTypeId.GlobalBonus)                             { this._modifyAsGlobalBonus(); }
        else if (infoType === InfoTypeId.RepairUnitCategory)                      { this._modifyAsRepairUnitCategory(); }
        else if (infoType === InfoTypeId.BlockEnemyUnit)                          { this._modifyAsBlockEnemyUnit(); }
        else if (infoType === InfoTypeId.CoBoardUnit)                             { this._modifyAsCoBoardUnit(); }
        else if (infoType === InfoTypeId.Hp)                                      { this._modifyAsHp(); }
        else if (infoType === InfoTypeId.CapturePoint)                            { this._modifyAsCapturePoint(); }
        else if (infoType === InfoTypeId.BuildPoint)                              { this._modifyAsBuildPoint(); }
        else if (infoType === InfoTypeId.IsHighlighted)                           { this._modifyAsIsHighlighted(); }
        else if (infoType === InfoTypeId.Buff)                                    { this._modifyAsBuff(); }

        else if (infoType === InfoTypeId.CrystalRadius)                           { this._modifyAsCrystalRadius(); }
        else if (infoType === InfoTypeId.CrystalPriority)                         { this._modifyAsCrystalPriority(); }
        else if (infoType === InfoTypeId.CrystalCanAffectSelf)                    { this._modifyAsCrystalCanAffectSelf(); }
        else if (infoType === InfoTypeId.CrystalCanAffectAlly)                    { this._modifyAsCrystalCanAffectAlly(); }
        else if (infoType === InfoTypeId.CrystalCanAffectEnemy)                   { this._modifyAsCrystalCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CrystalDeltaFund)                        { this._modifyAsCrystalOffsetFund(); }
        else if (infoType === InfoTypeId.CrystalDeltaEnergyPercentage)            { this._modifyAsCrystalOffsetEnergyPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaHp)                          { this._modifyAsCrystalOffsetHp(); }
        else if (infoType === InfoTypeId.CrystalDeltaFuelPercentage)              { this._modifyAsCrystalOffsetFuelPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._modifyAsCrystalDeltaPrimaryAmmoPercentage(); }

        else if (infoType === InfoTypeId.CannonRangeForUp)                        { this._modifyAsCannonRangeForUp(); }
        else if (infoType === InfoTypeId.CannonRangeForRight)                     { this._modifyAsCannonRangeForRight(); }
        else if (infoType === InfoTypeId.CannonRangeForLeft)                      { this._modifyAsCannonRangeForLeft(); }
        else if (infoType === InfoTypeId.CannonRangeForDown)                      { this._modifyAsCannonRangeForDown(); }
        else if (infoType === InfoTypeId.CannonPriority)                          { this._modifyAsCannonPriority(); }
        else if (infoType === InfoTypeId.CannonMaxTargetCount)                    { this._modifyAsCannonMaxTargetCount(); }
        else if (infoType === InfoTypeId.CannonCanAffectSelf)                     { this._modifyAsCannonCanAffectSelf(); }
        else if (infoType === InfoTypeId.CannonCanAffectAlly)                     { this._modifyAsCannonCanAffectAlly(); }
        else if (infoType === InfoTypeId.CannonCanAffectEnemy)                    { this._modifyAsCannonCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CannonDeltaHp)                           { this._modifyAsCannonOffsetHp(); }
        else if (infoType === InfoTypeId.CannonDeltaFuelPercentage)               { this._modifyAsCannonDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._modifyAsCannonDeltaPrimaryAmmoPercentage(); }

        else if (infoType === InfoTypeId.LaserTurretRangeForUp)                   { this._modifyAsLaserTurretRangeForUp(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForRight)                { this._modifyAsLaserTurretRangeForRight(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForLeft)                 { this._modifyAsLaserTurretRangeForLeft(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForDown)                 { this._modifyAsLaserTurretRangeForDown(); }
        else if (infoType === InfoTypeId.LaserTurretPriority)                     { this._modifyAsLaserTurretPriority(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectSelf)                { this._modifyAsLaserTurretCanAffectSelf(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectAlly)                { this._modifyAsLaserTurretCanAffectAlly(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectEnemy)               { this._modifyAsLaserTurretCanAffectEnemy(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaHp)                      { this._modifyAsLaserTurretOffsetHp(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._modifyAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._modifyAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw newError(`Invalid infoType: ${infoType}`);
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
        if      (infoType === InfoTypeId.DefenseBonus)                            { this._updateViewAsDefenseBonus(); }
        else if (infoType === InfoTypeId.Income)                                  { this._updateViewAsIncome(); }
        else if (infoType === InfoTypeId.Vision)                                  { this._updateViewAsVision(); }
        else if (infoType === InfoTypeId.HideUnitCategory)                        { this._updateViewAsHideUnitCategory(); }
        else if (infoType === InfoTypeId.IsDefeatedOnCapture)                     { this._updateViewAsIsDefeatedOnCapture(); }
        else if (infoType === InfoTypeId.ProduceUnitCategory)                     { this._updateViewAsProduceUnitCategory(); }
        else if (infoType === InfoTypeId.GlobalBonus)                             { this._updateViewAsGlobalBonus(); }
        else if (infoType === InfoTypeId.RepairUnitCategory)                      { this._updateViewAsRepairUnitCategory(); }
        else if (infoType === InfoTypeId.BlockEnemyUnit)                          { this._updateViewAsBlockEnemyUnit(); }
        else if (infoType === InfoTypeId.CoBoardUnit)                             { this._updateViewAsCoBoardUnit(); }
        else if (infoType === InfoTypeId.Hp)                                      { this._updateViewAsHp(); }
        else if (infoType === InfoTypeId.CapturePoint)                            { this._updateViewAsCapturePoint(); }
        else if (infoType === InfoTypeId.BuildPoint)                              { this._updateViewAsBuildPoint(); }
        else if (infoType === InfoTypeId.IsHighlighted)                           { this._updateViewAsIsHighlighted(); }
        else if (infoType === InfoTypeId.Buff)                                    { this._updateViewAsBuff(); }
        else if (infoType === InfoTypeId.CrystalRadius)                           { this._updateViewAsCrystalRadius(); }
        else if (infoType === InfoTypeId.CrystalPriority)                         { this._updateViewAsCrystalPriority(); }
        else if (infoType === InfoTypeId.CrystalCanAffectSelf)                    { this._updateViewAsCrystalCanAffectSelf(); }
        else if (infoType === InfoTypeId.CrystalCanAffectAlly)                    { this._updateViewAsCrystalCanAffectAlly(); }
        else if (infoType === InfoTypeId.CrystalCanAffectEnemy)                   { this._updateViewAsCrystalCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CrystalDeltaFund)                        { this._updateViewAsCrystalDeltaFund(); }
        else if (infoType === InfoTypeId.CrystalDeltaEnergyPercentage)            { this._updateViewAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaHp)                          { this._updateViewAsCrystalDeltaHp(); }
        else if (infoType === InfoTypeId.CrystalDeltaFuelPercentage)              { this._updateViewAsCrystalDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._updateViewAsCrystalDeltaPrimaryAmmoPercentage(); }
        else if (infoType === InfoTypeId.CannonRangeForUp)                        { this._updateViewAsCannonRangeForUp(); }
        else if (infoType === InfoTypeId.CannonRangeForRight)                     { this._updateViewAsCannonRangeForRight(); }
        else if (infoType === InfoTypeId.CannonRangeForLeft)                      { this._updateViewAsCannonRangeForLeft(); }
        else if (infoType === InfoTypeId.CannonRangeForDown)                      { this._updateViewAsCannonRangeForDown(); }
        else if (infoType === InfoTypeId.CannonPriority)                          { this._updateViewAsCannonPriority(); }
        else if (infoType === InfoTypeId.CannonMaxTargetCount)                    { this._updateViewAsCannonMaxTargetCount(); }
        else if (infoType === InfoTypeId.CannonCanAffectSelf)                     { this._updateViewAsCannonCanAffectSelf(); }
        else if (infoType === InfoTypeId.CannonCanAffectAlly)                     { this._updateViewAsCannonCanAffectAlly(); }
        else if (infoType === InfoTypeId.CannonCanAffectEnemy)                    { this._updateViewAsCannonCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CannonDeltaHp)                           { this._updateViewAsCannonDeltaHp(); }
        else if (infoType === InfoTypeId.CannonDeltaFuelPercentage)               { this._updateViewAsCannonDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._updateViewAsCannonDeltaPrimaryAmmoPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForUp)                   { this._updateViewAsLaserTurretRangeForUp(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForRight)                { this._updateViewAsLaserTurretRangeForRight(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForLeft)                 { this._updateViewAsLaserTurretRangeForLeft(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForDown)                 { this._updateViewAsLaserTurretRangeForDown(); }
        else if (infoType === InfoTypeId.LaserTurretPriority)                     { this._updateViewAsLaserTurretPriority(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectSelf)                { this._updateViewAsLaserTurretCanAffectSelf(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectAlly)                { this._updateViewAsLaserTurretCanAffectAlly(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectEnemy)               { this._updateViewAsLaserTurretCanAffectEnemy(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaHp)                      { this._updateViewAsLaserTurretOffsetHp(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._updateViewAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsDefenseBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.B0352);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getDefenseUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(getUnitCategoryName(
                tile.getTemplateCfg().getDefenseUnitCategoryId(),
                tile.getGameConfig()
            ) ?? UndefinedError);
            groupTouchModify.setIsVisible(false);
        }

        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(`${getSignedNumText(tile.getDefenseAmount())}%`);
    }
    private _updateViewAsIncome(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.Income);
        this._labelValue.setText(`${tile.getIncomePerTurn()}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsVision(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.VisionRange);
        this._labelValue.setText(`${tile.getCfgVisionRange()}`);

        const groupExtra = this._groupExtra;
        if (!tile.getIsVisionEnabledForAllPlayers()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(TextType.B1130);
        }

        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.HidableUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getHideUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(getUnitCategoryName(
                tile.getTemplateCfg().getHideUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsIsDefeatedOnCapture(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.DefeatIfCaptured);
        this._labelValue.setText(tile.getIsDefeatedOnCapture() ? getText(TextType.Yes) : getText(TextType.No));
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((tile.getIsCustomizableBuilding()) && (checkCanCheatInWar(war.getWarType())));
    }
    private _updateViewAsProduceUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.ProducibleUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getRegularProducibleUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(getUnitCategoryName(
                tile.getTemplateCfg().getProduceUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? UndefinedError);
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
        this._labelTitle.setLangText(TextType.B0359);
        this._labelValue.setText(`${offenseBonus ?? `--`} / ${defenseBonus ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getIsCustomizableBuilding()));
    }
    private _updateViewAsRepairUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.RepairableUnits);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getRepairUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(getUnitCategoryName(
                tile.getTemplateCfg().getRepairUnitCategoryId() ?? 0,
                tile.getGameConfig()
            ) ?? UndefinedError);
            groupTouchModify.setIsVisible(false);
        }

        const repairNormalizedHp    = tile.getRepairNormalizedHp();
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(repairNormalizedHp == null ? `--` : `${getSignedNumText(repairNormalizedHp * 10)}`);
    }
    private _updateViewAsBlockEnemyUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.BlockableEnemyUnits);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getBlockEnemyUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(getUnitCategoryName(
                tile.getTemplateCfg().getBlockEnemyUnitCategoryId() ?? 0,
                tile.getGameConfig(),
            ) ?? UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsCoBoardUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.CoBoardableUnit);
        this._groupExtra.setIsVisible(false);

        const labelValue        = this._labelValue;
        const groupTouchModify  = this._groupTouchModify;
        if (tile.getIsCustomizableBuilding()) {
            labelValue.setText(`${tile.getCoBoardUnitTypeArray()?.length ?? 0}`);
            groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
        } else {
            labelValue.setText(getUnitCategoryName(
                tile.getTemplateCfg().getCoBoardUnitCategoryId() ?? 0,
                tile.getGameConfig(),
            ) ?? UndefinedError);
            groupTouchModify.setIsVisible(false);
        }
    }
    private _updateViewAsHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.Hp);
        this._labelValue.setText(`${tile.getCurrentHp()} / ${tile.getMaxHp() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsCapturePoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.CapturePoint);
        this._labelValue.setText(`${tile.getCurrentCapturePoint()} / ${tile.getMaxCapturePoint() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsBuildPoint(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.BuildPoint);
        this._labelValue.setText(`${tile.getCurrentBuildPoint()} / ${tile.getMaxBuildPoint() ?? `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.B0847);
        this._labelValue.setLangText(tile.getIsHighlighted() ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        this._labelTitle.setLangText(TextType.AbnormalStates);
        this._labelValue.setText(`${tile.getUnfixedBuffList()?.length || `--`}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible(checkCanCheatInWar(war.getWarType()));
    }
    private _updateViewAsCrystalRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getRadius();
        this._labelTitle.setLangText(TextType.EffectiveRadius);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getPriority();
        this._labelTitle.setLangText(TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getCanAffectSelf();
        this._labelTitle.setLangText(TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getCanAffectAlly();
        this._labelTitle.setLangText(TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getCanAffectEnemy();
        this._labelTitle.setLangText(TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getOffsetFund();
        this._labelTitle.setLangText(TextType.FundOffset);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getOffsetEnergyPercentage();
        this._labelTitle.setLangText(TextType.CoEnergyOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war }     = openData;
        const customCrystalData = getExisted(tile.getFinalCrystalData());
        const offsetHp          = customCrystalData.getOffsetHp();
        const canBeFatal        = customCrystalData.getCanBeFatal();
        this._labelTitle.setLangText(TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCrystalData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.getTemplateCfg().getMapWeaponTypeId() === TilesConstantsMapWeaponTypeId.CustomCrystal));
    }
    private _updateViewAsCannonRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getRangeForUp();
        this._labelTitle.setLangText(TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getRangeForRight();
        this._labelTitle.setLangText(TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getRangeForDown();
        this._labelTitle.setLangText(TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getRangeForLeft();
        this._labelTitle.setLangText(TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getPriority();
        this._labelTitle.setLangText(TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getMaxTargetCount();
        this._labelTitle.setLangText(TextType.MaxTargets);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getCanAffectSelf();
        this._labelTitle.setLangText(TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getCanAffectAlly();
        this._labelTitle.setLangText(TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getCanAffectEnemy();
        this._labelTitle.setLangText(TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const data          = getExisted(tile.getFinalCannonData());
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalCannonData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getRangeForUp();
        this._labelTitle.setLangText(TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getRangeForRight();
        this._labelTitle.setLangText(TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getRangeForDown();
        this._labelTitle.setLangText(TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getRangeForLeft();
        this._labelTitle.setLangText(TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getPriority();
        this._labelTitle.setLangText(TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getCanAffectSelf();
        this._labelTitle.setLangText(TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getCanAffectAlly();
        this._labelTitle.setLangText(TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getCanAffectEnemy();
        this._labelTitle.setLangText(TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const data          = getExisted(tile.getFinalLaserTurretData());
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(TextType.CanBeFatal);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getOffsetFuelPercentage();
        this._labelTitle.setLangText(TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }
    private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        const currentValue          = getExisted(tile.getFinalLaserTurretData()).getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
        this._groupTouchModify.setIsVisible((checkCanCheatInWar(war.getWarType())) && (tile.checkIsCustomMapWeapon()));
    }

    private _showHelpAsDefenseBonus(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B0352),
            getContent : () => getText(TextType.A0088),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIncome(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.Income),
            getContent : () => getText(TextType.A0086),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsVision(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.VisionRange),
            getContent : () => getText(TextType.A0082),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHideUnitCategory(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.HidableUnits),
            getContent : () => getText(TextType.A0079),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsDefeatedOnCapture(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.DefeatIfCaptured),
            getContent : () => getText(TextType.A0077),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsProduceUnitCategory(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.ProducibleUnits),
            getContent : () => getText(TextType.A0074),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsGlobalBonus(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B0359),
            getContent : () => getText(TextType.A0068),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsRepairUnitCategory(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.RepairableUnits),
            getContent : () => getText(TextType.A0065),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBlockEnemyUnit(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.BlockableEnemyUnits),
            getContent : () => getText(TextType.A0012),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCoBoardUnit(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.CoBoardableUnit),
            getContent : () => getText(TextType.A0011),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.Hp),
            getContent : () => getText(TextType.A0059),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCapturePoint(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.CapturePoint),
            getContent : () => getText(TextType.A0052),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuildPoint(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.BuildPoint),
            getContent : () => getText(TextType.A0051),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsHighlighted(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B0847),
            getContent : () => getText(TextType.A0050),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuff(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.AbnormalStates),
            getContent : () => getText(TextType.A0737),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        openPanel(getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getDefenseUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        openPanel(getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getHideUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        openPanel(getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getRegularProducibleUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        openPanel(getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getRepairUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsBlockEnemyUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig = tile.getGameConfig();
        openPanel(getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getBlockEnemyUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : tile.getGameConfig(),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showValueAsCoBoardUnit(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const gameConfig = tile.getGameConfig();
        openPanel(getDict().CommonShowUnitTypePanel, {
            currentUnitTypeArray    : tile.getCoBoardUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : tile.getGameConfig(),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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

        openPanel(getDict().BwTileBuffListPanel, {
            tile        : tile,
            canModify   : tile.getWar().getCanCheat(),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const maxValue      = Building.DefenseAmount.MaxValue;
        const minValue      = Building.DefenseAmount.MinValue;
        const data          = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
        const gameConfig    = tile.getGameConfig();
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
            currentUnitTypeArray    : data.getDefenseUnitTypeArray() ?? [],
            availableUnitTypeArray  : gameConfig.getAllUnitTypeArray(),
            gameConfig              : gameConfig,
            callbackOnConfirm       : newUnitTypeArray => {
                openPanel(getDict().CommonInputIntegerPanel, {
                    getTitle           : () => getText(TextType.DefBonus$),
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const maxValue  = Building.IncomePerTurn.MaxValue;
        const minValue  = Building.IncomePerTurn.MinValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Income),
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const { tile, war } = openData;
        const maxValue      = Building.VisionRange.MaxValue;
        const minValue      = Building.VisionRange.MinValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.VisionRange),
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
                openPanel(getDict().CommonConfirmPanel, {
                    getContent             : () => getText(TextType.A0018),
                    callback            : () => callback(false),
                    callbackOnCancel    : () => callback(true),
                    getTextForConfirm      : () => getText(TextType.Yes),
                    getTextForCancel       : () => getText(TextType.No),
                });
            },
        });
    }
    private _modifyAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const { tile, war } = openData;
        const gameConfig    = war.getGcData();
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const maxValue  = Building.GlobalAttackBonus.MaxValue;
        const minValue  = Building.GlobalAttackBonus.MinValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.B0183),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : tile.getGlobalAttackBonus(),
            callback        : newAttackBonus => {
                openPanel(getDict().CommonInputIntegerPanel, {
                    getTitle           : () => getText(TextType.DefBonus$),
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
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
                    const maxValue  = Building.RepairNormalizedHp.MaxValue;
                    openPanel(getDict().CommonInputIntegerPanel, {
                        getTitle           : () => getText(TextType.Hp),
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const gameConfig    = tile.getGameConfig();
        openPanel(getDict().CommonChooseMultiUnitTypePanel, {
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
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }

        const tile = openData.tile;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.Hp),
            currentValue    : tile.getCurrentHp(),
            minValue        : 0,
            maxValue        : tile.getMaxHp() ?? 0,
            callback        : value => {
                tile.setCurrentHp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCapturePoint(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currentValue = tile.getCurrentCapturePoint();
        if (tile.getIsCustomizableBuilding()) {
            openPanel(getDict().CommonInputNullableIntegerPanel, {
                getTitle        : () => getText(TextType.MaxCapturePoint),
                currentValue    : tile.getMaxCapturePoint(),
                minValue        : 0,
                maxValue        : Building.MaxCapturePoint.MaxValue,
                callback        : newMaxCapturePoint => {
                    if (newMaxCapturePoint == null) {
                        const data = tile.getCustomBuildingData() ?? new TileCustomBuildingData();
                        data.setMaxCapturePoint(null);
                        tile.setCustomBuildingData(data);
                        tile.setCurrentCapturePoint(0);
                        this._updateView();
                    } else {
                        openPanel(getDict().CommonInputIntegerPanel, {
                            getTitle        : () => getText(TextType.CapturePoint),
                            currentValue    : currentValue ?? 0,
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
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle        : () => getText(TextType.CapturePoint),
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
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }

        const tile = openData.tile;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.BuildPoint),
            currentValue    : tile.getCurrentBuildPoint(),
            minValue        : Common.CurrentBuildPoint.MinValue,
            maxValue        : Common.CurrentBuildPoint.MaxValue,
            callback        : value => {
                tile.setCurrentBuildPoint(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsIsHighlighted(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if (!checkCanCheatInWar(war.getWarType())) {
            return;
        }

        tile.setIsHighlighted(!tile.getIsHighlighted());
        tile.flushDataToView();
        this._updateView();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsBuff(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tile = openData.tile;
        openPanel(getDict().BwTileBuffListPanel, {
            tile        : tile,
            canModify   : tile.getWar().getCanCheat(),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalRadius(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCrystalData()).getRadius();
        const minValue  = Crystal.Radius.MinValue;
        const maxValue  = Crystal.Radius.MaxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.EffectiveRadius),
            currentValue    : currValue ?? 0,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
                tile.setCustomCrystalRadius(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCrystalData()).getPriority();
        const minValue  = Crystal.Priority.MinValue;
        const maxValue  = Crystal.Priority.MaxValue;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Priority),
            currentValue    : currValue ?? 0,
            minValue        : minValue,
            maxValue        : maxValue,
            callback        : value => {
                tile.setCustomCrystalPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectSelf(!getExisted(tile.getFinalCrystalData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectAlly(!getExisted(tile.getFinalCrystalData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        tile.setCustomCrystalCanAffectEnemy(!getExisted(tile.getFinalCrystalData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCrystalData()).getOffsetFund();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.FundOffset),
            currentValue    : currValue ?? 0,
            minValue        : Crystal.OffsetFund.MinValue,
            maxValue        : Crystal.OffsetFund.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaFund(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetEnergyPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCrystalData()).getOffsetEnergyPercentage();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.CoEnergyOffset$),
            currentValue    : currValue ?? 0,
            minValue        : Crystal.OffsetEnergyPercentage.MinValue,
            maxValue        : Crystal.OffsetEnergyPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaEnergyPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType()))            ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ) {
            return;
        }

        const customCrystalData = getExisted(tile.getFinalCrystalData());
        const canBeFatal        = customCrystalData.getCanBeFatal();
        const callback          = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomCrystalOffsetHp(newOffsetHp);
            tile.setCustomCrystalCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsHpOffset),
            currentValue    : customCrystalData.getOffsetHp(),
            minValue        : Crystal.OffsetHp.MinValue,
            maxValue        : Crystal.OffsetHp.MaxValue,
            callback        : value => openPanel(getDict().CommonConfirmPanel, {
                getTitle               : () => getText(TextType.CanBeFatal),
                getContent             : () => getText(TextType.A0958),
                getTextForConfirm      : () => `${getText(TextType.Yes)}${canBeFatal ? `(${getText(TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${getText(TextType.No)}${!canBeFatal ? `(${getText(TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalOffsetFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCrystalData()).getOffsetFuelPercentage();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsFuelOffset$),
            currentValue    : currValue ?? 0,
            minValue        : Crystal.OffsetFuelPercentage.MinValue,
            maxValue        : Crystal.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCrystalData()).getOffsetPrimaryAmmoPercentage();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue ?? 0,
            minValue        : Crystal.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCrystalDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getRangeForUp();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeUp),
            currentValue    : currValue ?? 0,
            minValue        : Cannon.RangeForUp.MinValue,
            maxValue        : Cannon.RangeForUp.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForUp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getRangeForRight();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeRight),
            currentValue    : currValue ?? 0,
            minValue        : Cannon.RangeForRight.MinValue,
            maxValue        : Cannon.RangeForRight.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForRight(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getRangeForDown();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeDown),
            currentValue    : currValue ?? 0,
            minValue        : Cannon.RangeForDown.MinValue,
            maxValue        : Cannon.RangeForDown.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForDown(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getRangeForLeft();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeLeft),
            currentValue    : currValue ?? 0,
            minValue        : Cannon.RangeForLeft.MinValue,
            maxValue        : Cannon.RangeForLeft.MaxValue,
            callback        : value => {
                tile.setCustomCannonRangeForLeft(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getPriority();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Priority),
            currentValue    : currValue,
            minValue        : Cannon.Priority.MinValue,
            maxValue        : Cannon.Priority.MaxValue,
            callback        : value => {
                tile.setCustomCannonPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonMaxTargetCount(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getMaxTargetCount();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.MaxTargets),
            currentValue    : currValue ?? 0,
            minValue        : Cannon.MaxTargetCount.MinValue,
            maxValue        : Cannon.MaxTargetCount.MaxValue,
            callback        : value => {
                tile.setCustomCannonMaxTargetCount(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectSelf(!getExisted(tile.getFinalCannonData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectAlly(!getExisted(tile.getFinalCannonData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        tile.setCustomCannonCanAffectEnemy(!getExisted(tile.getFinalCannonData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType()))            ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ) {
            return;
        }

        const customCannonData  = getExisted(tile.getFinalCannonData());
        const canBeFatal        = customCannonData.getCanBeFatal();
        const callback          = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomCannonOffsetHp(newOffsetHp);
            tile.setCustomCannonCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsHpOffset),
            currentValue    : customCannonData.getOffsetHp(),
            minValue        : Cannon.OffsetHp.MinValue,
            maxValue        : Cannon.OffsetHp.MaxValue,
            callback        : value => openPanel(getDict().CommonConfirmPanel, {
                getTitle               : () => getText(TextType.CanBeFatal),
                getContent             : () => getText(TextType.A0958),
                getTextForConfirm      : () => `${getText(TextType.Yes)}${canBeFatal ? `(${getText(TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${getText(TextType.No)}${!canBeFatal ? `(${getText(TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getOffsetFuelPercentage();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsFuelOffset$),
            currentValue    : currValue ?? 0,
            minValue        : Cannon.OffsetFuelPercentage.MinValue,
            maxValue        : Cannon.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCannonDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsCannonDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)) {
            return;
        }

        const currValue = getExisted(tile.getFinalCannonData()).getOffsetPrimaryAmmoPercentage();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue ?? 0,
            minValue        : Cannon.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomCannonDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForUp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = getExisted(tile.getFinalLaserTurretData()).getRangeForUp();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeUp),
            currentValue    : currValue ?? 0,
            minValue        : LaserTurret.RangeForUp.MinValue,
            maxValue        : LaserTurret.RangeForUp.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForUp(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForRight(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = getExisted(tile.getFinalLaserTurretData()).getRangeForRight();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeRight),
            currentValue    : currValue ?? 0,
            minValue        : LaserTurret.RangeForRight.MinValue,
            maxValue        : LaserTurret.RangeForRight.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForRight(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = getExisted(tile.getFinalLaserTurretData()).getRangeForDown();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeDown),
            currentValue    : currValue ?? 0,
            minValue        : LaserTurret.RangeForDown.MinValue,
            maxValue        : LaserTurret.RangeForDown.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForDown(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretRangeForLeft(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = getExisted(tile.getFinalLaserTurretData()).getRangeForLeft();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.RangeLeft),
            currentValue    : currValue ?? 0,
            minValue        : LaserTurret.RangeForLeft.MinValue,
            maxValue        : LaserTurret.RangeForLeft.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretRangeForLeft(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretPriority(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = getExisted(tile.getFinalLaserTurretData()).getPriority();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.Priority),
            currentValue    : currValue ?? 0,
            minValue        : LaserTurret.Priority.MinValue,
            maxValue        : LaserTurret.Priority.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretPriority(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectSelf(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectSelf(!getExisted(tile.getFinalLaserTurretData()).getCanAffectSelf());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectAlly(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectAlly(!getExisted(tile.getFinalLaserTurretData()).getCanAffectAlly());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretCanAffectEnemy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        tile.setCustomLaserTurretCanAffectEnemy(!getExisted(tile.getFinalLaserTurretData()).getCanAffectEnemy());
        tile.flushDataToView();
        this._updateView();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretOffsetHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType()))                ||
            (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)
        ) {
            return;
        }

        const customLaserTurretData = getExisted(tile.getFinalLaserTurretData());
        const canBeFatal            = customLaserTurretData.getCanBeFatal();
        const callback              = (newOffsetHp: number, newCanBeFatal: boolean) => {
            tile.setCustomLaserTurretOffsetHp(newOffsetHp);
            tile.setCustomLaserTurretCanBeFatal(newCanBeFatal),
            tile.flushDataToView();
            this._updateView();
        };

        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsHpOffset),
            currentValue    : customLaserTurretData.getOffsetHp(),
            minValue        : LaserTurret.OffsetHp.MinValue,
            maxValue        : LaserTurret.OffsetHp.MaxValue,
            callback        : value => openPanel(getDict().CommonConfirmPanel, {
                getTitle               : () => getText(TextType.CanBeFatal),
                getContent             : () => getText(TextType.A0958),
                getTextForConfirm      : () => `${getText(TextType.Yes)}${canBeFatal ? `(${getText(TextType.B1379)})` : ``}`,
                getTextForCancel       : () => `${getText(TextType.No)}${!canBeFatal ? `(${getText(TextType.B1379)})` : ``}`,
                callback            : () => callback(value, true),
                callbackOnCancel    : () => callback(value, false),
            }),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretDeltaFuelPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = getExisted(tile.getFinalLaserTurretData()).getOffsetFuelPercentage();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsFuelOffset$),
            currentValue    : currValue ?? 0,
            minValue        : LaserTurret.OffsetFuelPercentage.MinValue,
            maxValue        : LaserTurret.OffsetFuelPercentage.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretDeltaFuelPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _modifyAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { tile, war } = openData;
        if ((!checkCanCheatInWar(war.getWarType())) || (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)) {
            return;
        }

        const currValue = getExisted(tile.getFinalLaserTurretData()).getOffsetPrimaryAmmoPercentage();
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => getText(TextType.UnitsPriAmmoOffset$),
            currentValue    : currValue ?? 0,
            minValue        : LaserTurret.OffsetPrimaryAmmoPercentage.MinValue,
            maxValue        : LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue,
            callback        : value => {
                tile.setCustomLaserTurretDeltaPrimaryAmmoPercentage(value);
                tile.flushDataToView();
                this._updateView();
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
}

interface DataForMoveCostRenderer extends UiListItemData {
    index               : number;
    gameConfig          : GcData;
    unitType            : number;
    tileCfg             : TileTemplateCfg;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : Undefinable<number>;
}
class MoveCostRenderer extends UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _conView!          : IUiContainer;
    private readonly _labelMoveCost!    : IUiLabel;

    private readonly _unitView          = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
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
        const moveCostCfg   = getExisted(gameConfig.getMoveCostCfg(getExisted(openData.tileCfg.getTileTypeId())));
        const moveCost      = moveCostCfg[getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId())].getCost();
        this._imgBg.setIsVisible(openData.index % 4 === 2);
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : Math.max(PlayerIndex.First, openData.skinId),
            overridingSkinId    : openData.overridingSkinId,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : openData.playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), getUnitAnimationTickCount());
    }
}

interface DataForDamageRenderer extends UiListItemData {
    gameConfig          : GcData;
    index               : number;
    targetTileType      : number;
    playerIndex         : number;
    attackerUnitType    : number;
    skinId              : number;
    overridingSkinId    : Undefinable<number>;
}
class DamageRenderer extends UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : IUiContainer;
    private readonly _imgBg!                : IUiImage;
    private readonly _conView!              : IUiContainer;
    private readonly _labelPrimaryAttack!   : IUiLabel;
    private readonly _labelSecondaryAttack! : IUiLabel;

    private readonly _unitView              = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
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
        unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : openData.skinId,
            overridingSkinId    : openData.overridingSkinId,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : attackerUnitType,
                playerIndex : openData.playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), getUnitAnimationTickCount());

        const attackCfg             = getExisted(gameConfig.getDamageChartCfgs(attackerUnitType));
        const targetArmorType       = getExisted(gameConfig.getTileTemplateCfg(openData.targetTileType)?.getArmorTypeId());
        const primaryAttackDamage   = attackCfg[targetArmorType][WeaponTypeId.Primary].getDamage();
        const secondaryAttackDamage = attackCfg[targetArmorType][WeaponTypeId.Secondary].getDamage();
        this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
        this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
    }
}

function createInfoDefenseBonus(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getDefenseUnitCategoryId() === CategoryId.None) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.DefenseBonus,
            war         : war,
            tile        : tile,
        };
}
function createInfoIncome(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getIncomePerTurn() === 0) && (!tile.getIsCustomizableBuilding())
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.Income,
            war,
            tile,
        };
}
function createInfoVision(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getCfgVisionRange() == 0) && (!tile.getIsVisionEnabledForAllPlayers()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.Vision,
            war,
            tile
        };
}
function createInfoHideUnitCategory(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getHideUnitCategoryId() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.HideUnitCategory,
            war         : war,
            tile        : tile,
        };
}
function createInfoIsDefeatOnCapture(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((!tile.getIsDefeatedOnCapture()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.IsDefeatedOnCapture,
            war,
            tile,
        };
}
function createInfoProduceUnitCategory(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getProduceUnitCategoryId() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.ProduceUnitCategory,
            war,
            tile,
        };
}
function createInfoGlobalBonus(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getGlobalAttackBonus() === 0) && (tile.getGlobalDefenseBonus() === 0) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.GlobalBonus,
            war         : war,
            tile        : tile,
        };
}
function createInfoRepairUnitCategory(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getTemplateCfg().getRepairUnitCategoryId() == CategoryId.None) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.RepairUnitCategory,
            war,
            tile,
        };
}
function createInfoBlockEnemyUnit(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((!tile.getTemplateCfg().getBlockEnemyUnitCategoryId()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.BlockEnemyUnit,
            war,
            tile,
        };
}
function createInfoCoBoardUnit(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((!tile.getTemplateCfg().getCoBoardUnitCategoryId()) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CoBoardUnit,
            war,
            tile,
        };
}
function createInfoHp(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getMaxHp() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.Hp,
            war,
            tile,
        };
}
function createInfoCapturePoint(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return ((tile.getMaxCapturePoint() == null) && (!tile.getIsCustomizableBuilding()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CapturePoint,
            war,
            tile,
        };
}
function createInfoBuildPoint(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getMaxBuildPoint() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.BuildPoint,
            war,
            tile,
        };
}
function createInfoIsHighlighted(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return {
        index       : 0,
        infoType    : InfoTypeId.IsHighlighted,
        war,
        tile,
    };
}
function createInfoBuff(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return {
        index       : 0,
        infoType    : InfoTypeId.Buff,
        war         : war,
        tile        : tile,
    };
}
function createInfoCrystalRadius(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalCrystalData() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalRadius,
            war,
            tile,
        };
}
function createInfoCrystalPriority(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalPriority,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectSelf(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalCanAffectSelf,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectAlly(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalCanAffectAlly,
            war,
            tile,
        };
}
function createInfoCrystalCanAffectEnemy(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoCrystalDeltaFund(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaFund,
            war,
            tile,
        };
}
function createInfoCrystalDeltaEnergyPercentage(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaEnergyPercentage,
            war,
            tile,
        };
}
function createInfoCrystalDeltaHp(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalCrystalData() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaHp,
            war,
            tile,
        };
}
function createInfoCrystalDeltaFuelPercentage(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoCrystalDeltaPrimaryAmmoPercentage(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
function createInfoCannonRangeForUp(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.CannonUp))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForUp,
            war,
            tile,
        };
}
function createInfoCannonRangeForDown(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.CannonDown))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForDown,
            war,
            tile,
        };
}
function createInfoCannonRangeForLeft(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.CannonLeft))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForLeft,
            war,
            tile,
        };
}
function createInfoCannonRangeForRight(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomCannon) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.CannonRight))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForRight,
            war,
            tile,
        };
}
function createInfoCannonPriority(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonPriority,
            war,
            tile,
        };
}
function createInfoCannonMaxTargetCount(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonMaxTargetCount,
            war,
            tile,
        };
}
function createInfoCannonCanAffectSelf(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonCanAffectSelf,
            war,
            tile,
        };
}
function createInfoCannonCanAffectAlly(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonCanAffectAlly,
            war,
            tile,
        };
}
function createInfoCannonCanAffectEnemy(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoCannonDeltaHp(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalCannonData() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonDeltaHp,
            war,
            tile,
        };
}
function createInfoCannonDeltaFuelPercentage(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoCannonDeltaPrimaryAmmoPercentage(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForUp(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForUp,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForDown(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForDown,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForLeft(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForLeft,
            war,
            tile,
        };
}
function createInfoLaserTurretRangeForRight(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    const mapWeaponType = tile.getTemplateCfg().getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForRight,
            war,
            tile,
        };
}
function createInfoLaserTurretPriority(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretPriority,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectSelf(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretCanAffectSelf,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectAlly(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretCanAffectAlly,
            war,
            tile,
        };
}
function createInfoLaserTurretCanAffectEnemy(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretCanAffectEnemy,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaHp(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getFinalLaserTurretData() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretDeltaHp,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaFuelPercentage(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretDeltaFuelPercentage,
            war,
            tile,
        };
}
function createInfoLaserTurretDeltaPrimaryAmmoPercentage(war: IBwWar, tile: ITile): DataForInfoRenderer | null {
    return (tile.getTemplateCfg().getMapWeaponTypeId() !== TilesConstantsMapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage,
            war,
            tile,
        };
}
