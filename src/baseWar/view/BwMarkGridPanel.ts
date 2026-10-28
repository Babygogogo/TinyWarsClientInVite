import type { PositionFilter } from "../../auxiliaryTypes/PositionFilter.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { getIsTransparentTouchLayerTouched, setIsTransparentTouchLayerTouched } from "../../common/model/CommonModel.ts";
import { checkIsMeet } from "../../deprecatedPositionFilter/Utils.ts";
import { showLang, show } from "../../FloatText.ts";
import { getMpwWarClass, getMeWarClass, getRwWarBaseClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { TypeId, AllGridMarkTypeId } from "../../gridMarks/Constants.ts";
import { updateGridMarkList } from "../../gridMarks/Utils.ts";
import { getNonNullElements, checkIsSameSet } from "../../helpers/Collection.ts";
import { getGridMark } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getFormattedText } from "../../lang/Utils.ts";
import {
    reqMpwCommonSetGridMarkList,
    reqMpwCommonSetHiddenGridMarkTypeIdList,
    reqMpwCommonMarkGrid,
} from "../../multiPlayerWar/model/MpwProxy.ts";
import type { GridMarkListChanged, HiddenGridMarkTypeIdListChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId as NotificationsTypeId } from "../../notifications/TypeId.ts";
import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { checkIsMeet as TilesUtilsFilterCheckIsMeet, checkIsMeetAsOutOfVision } from "../../tiles/utils/Filter.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { checkIsMeet as UnitsUtilsFilterCheckIsMeet } from "../../units/utils/Filter.ts";
import { getAllTilesVisibleToTeam, getAllUnitsOnMapVisibleToTeams } from "../../visibilities/Utils.ts";

let _selectedMarkTypeId     = TypeId.MinMarkTypeId;

export interface OpenData {
    war     : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnImport!            : IUiButton;
    private readonly _btnExport!            : IUiButton;

    private readonly _labelShow!            : IUiLabel;
    private readonly _listPlayer!           : IUiScrollList<DataForPlayerRenderer>;
    private readonly _btnShow!              : IUiButton;

    private readonly _groupHelpBatchMark!   : IUiLayout;
    private readonly _labelBatchMark!       : IUiLabel;
    private readonly _btnPositionFilter!    : IUiButton;
    private readonly _labelPositionFilter!  : IUiLabel;
    private readonly _btnTileFilter!        : IUiButton;
    private readonly _labelTileFilter!      : IUiLabel;
    private readonly _btnUnitFilter!        : IUiButton;
    private readonly _labelUnitFilter!      : IUiLabel;
    private readonly _btnInVision!          : IUiButton;
    private readonly _labelInVision!        : IUiLabel;
    private readonly _btnBatchMark!         : IUiButton;
    private readonly _btnBatchUnmark!       : IUiButton;
    private readonly _btnMarkType!          : IUiButton;
    private readonly _imgMarkType!          : IUiImage;

    private _positionFilter : PositionFilter | null = null;
    private _unitFilter     : UnitFilter | null = null;
    private _tileFilter     : TileFilter | null = null;
    private _isInVision     : boolean | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.LanguageChanged,                                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.MsgMpwCommonSetPlayerIndexesForShowMarkedGrid,   callback: this._onNotifyMsgMpwCommonSetPlayerIndexesForShowMarkedGrid },
            { type: NotificationsTypeId.MsgMpwCommonMarkTile,                            callback: this._onNotifyMsgMpwCommonMarkTile },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnImport,          callback: this._onTouchedBtnImport },
            { ui: this._btnExport,          callback: this._onTouchedBtnExport },

            { ui: this._btnShow,            callback: this._onTouchedBtnShow },

            { ui: this._groupHelpBatchMark, callback: this._onTouchedGroupHelpBatchMark },
            { ui: this._btnPositionFilter,  callback: this._onTouchedBtnPositionFilter },
            { ui: this._btnTileFilter,      callback: this._onTouchedBtnTileFilter },
            { ui: this._btnUnitFilter,      callback: this._onTouchedBtnUnitFilter },
            { ui: this._btnInVision,        callback: this._onTouchedBtnInVision },
            { ui: this._btnBatchMark,       callback: this._onTouchedBtnBatchMark },
            { ui: this._btnBatchUnmark,     callback: this._onTouchedBtnBatchUnmark },
            { ui: this._btnMarkType,        callback: this._onTouchedBtnMarkType },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateImgMarkType();
        this._updateListPlayer();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnImport(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                showLang(TextType.A0275);
                return;
            }

            let data: GridMarkData | undefined;
            try {
                data = GridMarkData.fromJson(JSON.parse(text));
            } catch {
                showLang(TextType.A0784);
                return;
            }

            if (data == null) {
                showLang(TextType.A0784);
                return;
            }

            if (war instanceof getMpwWarClass()) {
                reqMpwCommonSetGridMarkList(getExisted(war.getWarId()), data.getGridIdAndMarkTypeIdList());

            } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
                war.getGridMarkData().setGridIdAndMarkTypeIdList(data.getGridIdAndMarkTypeIdList());

                dispatch(NotificationsTypeId.GridMarkListChanged, {
                    war : war,
                } as GridMarkListChanged);
                showLang(TextType.OperationSucceeded);

            } else if (war instanceof getSpwWarClass()) {
                war.getSaveSlotExtraData().createIfNotExistsGridMarkData().setGridIdAndMarkTypeIdList(data.getGridIdAndMarkTypeIdList());

                dispatch(NotificationsTypeId.GridMarkListChanged, {
                    war : war,
                } as GridMarkListChanged);
                showLang(TextType.OperationSucceeded);

            } else {
                // TODO
            }
        };

        if (getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0979),
                getTextForConfirm   : () => getText(TextType.B0026),
                getTextForCancel    : () => getText(TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private _onTouchedBtnExport(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = async () => {
            try {
                window.focus();

                const data = new GridMarkData();
                if (war instanceof getMpwWarClass()) {
                    data.setGridIdAndMarkTypeIdList(war.getPlayerLoggedIn()?.getGridMarkList() ?? []);

                } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
                    data.setGridIdAndMarkTypeIdList(war.getGridMarkData().getGridIdAndMarkTypeIdList());

                } else if (war instanceof getSpwWarClass()) {
                    data.setGridIdAndMarkTypeIdList(war.getSaveSlotExtraData().getGridMarkData()?.getGridIdAndMarkTypeIdList() ?? []);

                } else {
                    // TODO
                }
                await navigator.clipboard.writeText(JSON.stringify(data.toJson()));

            } catch {
                showLang(TextType.A0275);
                return;
            }

            show(getText(TextType.A0235));
        };

        if (getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0979),
                getTextForConfirm   : () => getText(TextType.B0026),
                getTextForCancel    : () => getText(TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }

    private _onTouchedBtnShow(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const visibleMarkTypeIdList = getNonNullElements(this._listPlayer.getSelectedItems()?.map(v => v.getOpenData()?.markTypeId) ?? []);
        const hiddenMarkTypeIdList  = AllGridMarkTypeId.filter(v => !visibleMarkTypeIdList.includes(v));
        if (war instanceof getMpwWarClass()) {
            reqMpwCommonSetHiddenGridMarkTypeIdList(getExisted(war.getWarId()), hiddenMarkTypeIdList);

        } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
            const data = war.getGridMarkData();
            if (!checkIsSameSet(new Set(data.getHiddenMarkTypeIdList()), new Set(hiddenMarkTypeIdList))) {
                data.setHiddenMarkTypeIdList(hiddenMarkTypeIdList);

                dispatch(NotificationsTypeId.HiddenGridMarkTypeIdListChanged, {
                    war : war,
                } as HiddenGridMarkTypeIdListChanged);
            }
            showLang(TextType.OperationSucceeded);

        } else if (war instanceof getSpwWarClass()) {
            const data = war.getSaveSlotExtraData().createIfNotExistsGridMarkData();
            if (!checkIsSameSet(new Set(data.getHiddenMarkTypeIdList()), new Set(hiddenMarkTypeIdList))) {
                data.setHiddenMarkTypeIdList(hiddenMarkTypeIdList);

                dispatch(NotificationsTypeId.HiddenGridMarkTypeIdListChanged, {
                    war : war,
                } as HiddenGridMarkTypeIdListChanged);
            }
            showLang(TextType.OperationSucceeded);

        } else {
            // TODO
        }
    }

    private _onTouchedGroupHelpBatchMark(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0850),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnPositionFilter(): void {
        const mapSize = this.getOpenData()?.war.getTileMap().getMapSize();
        if (mapSize == null) {
            return;
        }

        openPanel(getDict().WePositionFilterPanel, {
            currentFilter   : this._positionFilter,
            mapSize         : mapSize,
            callback        : positionFilter => {
                this._positionFilter = positionFilter;
                this._updateLabelPositionFilter();
            }
        });
    }

    private _onTouchedBtnUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().WeUnitFilterPanel, {
            currentFilter           : this._unitFilter,
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            gameConfig              : war.getGcData(),
            mapSize                 : war.getTileMap().getMapSize(),
            callback                : unitFilter => {
                this._unitFilter = unitFilter;
                this._updateLabelUnitFilter();
            }
        });
    }

    private _onTouchedBtnTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().WeTileFilterPanel, {
            currentFilter           : this._tileFilter,
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            gameConfig              : war.getGcData(),
            mapSize                 : war.getTileMap().getMapSize(),
            callback                : tileFilter => {
                this._tileFilter = tileFilter;
                this._updateLabelTileFilter();
            }
        });
    }

    private _onTouchedBtnInVision(): void {
        const isInVision = this._isInVision;
        if (isInVision == null) {
            this._isInVision = true;
        } else if (isInVision === true) {
            this._isInVision = false;
        } else {
            this._isInVision = null;
        }
        this._updateLabelInVision();
    }

    private _onTouchedBtnBatchMark(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player = war instanceof getMpwWarClass() ? war.getPlayerLoggedIn() : war.getPlayerInTurn();
        if (player == null) {
            return;
        }

        const metGridIdArray = this._getMetGridIdArray(player.getTeamIndex());
        const addGridIdArray = metGridIdArray.filter(v => player.getMarkTypeId(v) != _selectedMarkTypeId);
        if (addGridIdArray.length <= 0) {
            showLang(TextType.A0090);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getFormattedText(TextType.F0193, metGridIdArray.length, addGridIdArray.length),
                callback    : () => {
                    if (war instanceof getMpwWarClass()) {
                        reqMpwCommonMarkGrid(getExisted(war.getWarId()), addGridIdArray, [], _selectedMarkTypeId);

                    } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
                        updateGridMarkList(war.getGridMarkData().getGridIdAndMarkTypeIdList(), addGridIdArray, [], _selectedMarkTypeId);

                        dispatch(NotificationsTypeId.GridMarkListChanged, {
                            war : war,
                        } as GridMarkListChanged);
                        showLang(TextType.OperationSucceeded);

                    } else if (war instanceof getSpwWarClass()) {
                        updateGridMarkList(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), addGridIdArray, [], _selectedMarkTypeId);

                        dispatch(NotificationsTypeId.GridMarkListChanged, {
                            war : war,
                        } as GridMarkListChanged);
                        showLang(TextType.OperationSucceeded);

                    } else {
                        // TODO
                        player.updateGridMarkList(addGridIdArray, [], _selectedMarkTypeId);
                    }
                },
            });
        }
    }

    private _onTouchedBtnBatchUnmark(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player = war instanceof getMpwWarClass() ? war.getPlayerLoggedIn() : war.getPlayerInTurn();
        if (player == null) {
            return;
        }

        const metGridIdArray    = this._getMetGridIdArray(player.getTeamIndex());
        const deleteGridIdArray = metGridIdArray.filter(v => player.getMarkTypeId(v) != null);
        if (deleteGridIdArray.length <= 0) {
            showLang(TextType.A0090);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getFormattedText(TextType.F0193, metGridIdArray.length, deleteGridIdArray.length),
                callback    : () => {
                    if (war instanceof getMpwWarClass()) {
                        reqMpwCommonMarkGrid(getExisted(war.getWarId()), [], deleteGridIdArray, _selectedMarkTypeId);

                    } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
                        updateGridMarkList(war.getGridMarkData().getGridIdAndMarkTypeIdList(), [], deleteGridIdArray, _selectedMarkTypeId);

                        dispatch(NotificationsTypeId.GridMarkListChanged, {
                            war : war,
                        } as GridMarkListChanged);
                        showLang(TextType.OperationSucceeded);

                    } else if (war instanceof getSpwWarClass()) {
                        updateGridMarkList(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), [], deleteGridIdArray, _selectedMarkTypeId);

                        dispatch(NotificationsTypeId.GridMarkListChanged, {
                            war : war,
                        } as GridMarkListChanged);
                        showLang(TextType.OperationSucceeded);

                    } else {
                        // TODO
                        player.updateGridMarkList([], deleteGridIdArray, _selectedMarkTypeId);
                    }
                },
            });
        }
    }

    private _onTouchedBtnMarkType(): void {
        openPanel(getDict().CommonChooseSingleGridMarkPanel, {
            currentMarkTypeId   : _selectedMarkTypeId,
            callback            : markTypeId => {
                _selectedMarkTypeId = markTypeId;
                this._updateImgMarkType();
                closePanel(getDict().CommonChooseSingleGridMarkPanel);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMpwCommonSetPlayerIndexesForShowMarkedGrid(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onNotifyMsgMpwCommonMarkTile(): void {
        showLang(TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1108);
        this._labelShow.setLangText(TextType.B1309);
        this._btnShow.setLangText(TextType.B0026);
        this._btnImport.setLangText(TextType.B1253);
        this._btnExport.setLangText(TextType.B1479);

        this._labelBatchMark.setLangText(TextType.B1109);
        this._btnPositionFilter.setLangText(TextType.B1073);
        this._btnUnitFilter.setLangText(TextType.UnitFilter);
        this._btnTileFilter.setLangText(TextType.TileFilter);
        this._btnInVision.setLangText(TextType.B1110);
        this._btnBatchMark.setLangText(TextType.B0914);
        this._btnBatchUnmark.setLangText(TextType.B0915);
        this._updateLabelPositionFilter();
        this._updateLabelUnitFilter();
        this._updateLabelTileFilter();
        this._updateLabelInVision();

        this._groupHelpBatchMark.arrangeItems();
    }

    private _updateImgMarkType(): void {
        this._imgMarkType.loadSource(getGridMark(_selectedMarkTypeId));
    }

    private async _updateListPlayer(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const list      = this._listPlayer;
        const dataArray = AllGridMarkTypeId.map(v => ({ markTypeId: v }));
        await list.bindData(dataArray);

        if (war instanceof getMpwWarClass()) {
            const hiddenList    = war.getPlayerLoggedIn()?.getHiddenGridMarkTypeIdList() ?? [];
            const itemIndexes   : number[] = [];
            for (let index = 0; index < dataArray.length; index++) {
                if (!hiddenList.includes(dataArray[index].markTypeId)) {
                    itemIndexes.push(index);
                }
            }
            list.setSelectedItemIndexes(itemIndexes);

        } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
            const hiddenList    = war.getGridMarkData().getHiddenMarkTypeIdList();
            const itemIndexes   : number[] = [];
            for (let index = 0; index < dataArray.length; index++) {
                if (!hiddenList.includes(dataArray[index].markTypeId)) {
                    itemIndexes.push(index);
                }
            }
            list.setSelectedItemIndexes(itemIndexes);

        } else if (war instanceof getSpwWarClass()) {
            const hiddenList    = war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getHiddenMarkTypeIdList();
            const itemIndexes   : number[] = [];
            for (let index = 0; index < dataArray.length; index++) {
                if (!hiddenList.includes(dataArray[index].markTypeId)) {
                    itemIndexes.push(index);
                }
            }
            list.setSelectedItemIndexes(itemIndexes);

        } else {
            // TODO
        }
    }

    private _updateLabelPositionFilter(): void {
        this._labelPositionFilter.setLangText(this._positionFilter ? TextType.Yes : TextType.No);
    }

    private _updateLabelUnitFilter(): void {
        this._labelUnitFilter.setLangText(this._unitFilter ? TextType.Yes : TextType.No);
    }

    private _updateLabelTileFilter(): void {
        this._labelTileFilter.setLangText(this._tileFilter ? TextType.Yes : TextType.No);
    }

    private _updateLabelInVision(): void {
        const label         = this._labelInVision;
        const isInVision    = this._isInVision;
        if (isInVision == null) {
            label.setLangText(TextType.B0776);
        } else {
            label.setLangText(isInVision ? TextType.Yes : TextType.No);
        }
    }

    private _getMetGridIdArray(teamIndex: number): number[] {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return [];
        }

        const isInVision        = this._isInVision;
        const positionFilter    = this._positionFilter;
        const tileFilter        = this._tileFilter;
        const unitFilter        = this._unitFilter;
        const tilesInVision     = getAllTilesVisibleToTeam(war, teamIndex);
        const unitsInVision     = getAllUnitsOnMapVisibleToTeams(war, new Set([teamIndex]));
        const unitMap           = war.getUnitMap();
        const mapSize           = unitMap.getMapSize();
        const gridIdArray       : number[] = [];
        for (const tile of war.getTileMap().getAllTiles()) {
            const isTileInVision = tilesInVision.has(tile);
            if ((isInVision != null) && (isInVision !== isTileInVision)) {
                continue;
            }

            if ((positionFilter) && (!checkIsMeet(positionFilter, tile))) {
                continue;
            }

            if (tileFilter) {
                if (((isTileInVision) && (!TilesUtilsFilterCheckIsMeet(tileFilter, tile)))              ||
                    ((!isTileInVision) && (!checkIsMeetAsOutOfVision(tileFilter, tile)))
                ) {
                    continue;
                }
            }

            const gridIndex = tile.getGridIndex();
            if (unitFilter) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit == null) || (!unitsInVision.has(unit)) || (!UnitsUtilsFilterCheckIsMeet(unitFilter, unit))) {
                    continue;
                }
            }

            gridIdArray.push(gridIndex.getGridId(mapSize));
        }

        return gridIdArray;
    }
}

interface DataForPlayerRenderer extends UiListItemData {
    markTypeId : number;
}
class PlayerRenderer
    extends     UiListItemRenderer<DataForPlayerRenderer>
    implements  IUiListItemRenderer<DataForPlayerRenderer>
{
    private readonly _groupShow!    : IUiContainer;
    private readonly _imgMark!      : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const markTypeId = this.getOpenData()?.markTypeId;
        if (markTypeId != null) {
            this._imgMark.loadSource(getGridMark(markTypeId));
        }
    }
}
