import {
    DeprecatedPositionFilter_Utils,
    Common_Model_CommonModel,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    FloatText,
    SinglePlayerWar_Model_SpwWar,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_PositionFilter,
    GridMarks_Constants,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    Helpers_Collection,
    GamePanels_Manager,
    Notifications_Dispatcher,
    Visibilities_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Helpers_ImageSource,
    Sounds_SoundPlayer,
    MultiPlayerWar_Model_MpwProxy,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    GridMarks_Utils,
    type Notifications_DataTypes,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";

let _selectedMarkTypeId     = GridMarks_Constants.TypeId.MinMarkTypeId;

export interface OpenData {
    war     : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnImport!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnExport!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelShow!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listPlayer!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;
    private readonly _btnShow!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupHelpBatchMark!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelBatchMark!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPositionFilter!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPositionFilter!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnTileFilter!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTileFilter!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnUnitFilter!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelUnitFilter!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnInVision!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelInVision!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnBatchMark!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBatchUnmark!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMarkType!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgMarkType!          : Ui_Interfaces_IUiImage.IUiImage;

    private _positionFilter : AuxiliaryTypes_PositionFilter.PositionFilter | null = null;
    private _unitFilter     : UnitFilter | null = null;
    private _tileFilter     : TileFilter | null = null;
    private _isInVision     : boolean | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgMpwCommonSetPlayerIndexesForShowMarkedGrid,   callback : this._onNotifyMsgMpwCommonSetPlayerIndexesForShowMarkedGrid },
            { type : Notifications_TypeId.TypeId.MsgMpwCommonMarkTile,                            callback : this._onNotifyMsgMpwCommonMarkTile },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnImport,          callback : this._onTouchedBtnImport },
            { ui : this._btnExport,          callback : this._onTouchedBtnExport },

            { ui : this._btnShow,            callback : this._onTouchedBtnShow },

            { ui : this._groupHelpBatchMark, callback : this._onTouchedGroupHelpBatchMark },
            { ui : this._btnPositionFilter,  callback : this._onTouchedBtnPositionFilter },
            { ui : this._btnTileFilter,      callback : this._onTouchedBtnTileFilter },
            { ui : this._btnUnitFilter,      callback : this._onTouchedBtnUnitFilter },
            { ui : this._btnInVision,        callback : this._onTouchedBtnInVision },
            { ui : this._btnBatchMark,       callback : this._onTouchedBtnBatchMark },
            { ui : this._btnBatchUnmark,     callback : this._onTouchedBtnBatchUnmark },
            { ui : this._btnMarkType,        callback : this._onTouchedBtnMarkType },
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0275);
                return;
            }

            let data: GridMarkData | undefined;
            try {
                data = GridMarkData.fromJson(JSON.parse(text));
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0784);
                return;
            }

            if (data == null) {
                FloatText.showLang(Lang_Constants.TextType.A0784);
                return;
            }

            if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
                MultiPlayerWar_Model_MpwProxy.reqMpwCommonSetGridMarkList(Helpers_Misc.getExisted(war.getWarId()), data.getGridIdAndMarkTypeIdList());

            } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
                war.getGridMarkData().setGridIdAndMarkTypeIdList(data.getGridIdAndMarkTypeIdList());

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
                    war : war,
                } as Notifications_DataTypes.GridMarkListChanged);
                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

            } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
                war.getSaveSlotExtraData().createIfNotExistsGridMarkData().setGridIdAndMarkTypeIdList(data.getGridIdAndMarkTypeIdList());

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
                    war : war,
                } as Notifications_DataTypes.GridMarkListChanged);
                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

            } else {
                // TODO
            }
        };

        if (Common_Model_CommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0979),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                showButtonClose   : false,
                callback          : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private _onTouchedBtnExport(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = async () => {
            try {
                window.focus();

                const data = new GridMarkData();
                if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
                    data.setGridIdAndMarkTypeIdList(war.getPlayerLoggedIn()?.getGridMarkList() ?? []);

                } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
                    data.setGridIdAndMarkTypeIdList(war.getGridMarkData().getGridIdAndMarkTypeIdList());

                } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
                    data.setGridIdAndMarkTypeIdList(war.getSaveSlotExtraData().getGridMarkData()?.getGridIdAndMarkTypeIdList() ?? []);

                } else {
                    // TODO
                }
                await navigator.clipboard.writeText(JSON.stringify(data.toJson()));

            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0275);
                return;
            }

            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0235));
        };

        if (Common_Model_CommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0979),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                showButtonClose   : false,
                callback          : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
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

        const visibleMarkTypeIdList = Helpers_Collection.getNonNullElements(this._listPlayer.getSelectedItems()?.map(v => v.getOpenData()?.markTypeId) ?? []);
        const hiddenMarkTypeIdList  = GridMarks_Constants.AllGridMarkTypeId.filter(v => !visibleMarkTypeIdList.includes(v));
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            MultiPlayerWar_Model_MpwProxy.reqMpwCommonSetHiddenGridMarkTypeIdList(Helpers_Misc.getExisted(war.getWarId()), hiddenMarkTypeIdList);

        } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
            const data = war.getGridMarkData();
            if (!Helpers_Collection.checkIsSameSet(new Set(data.getHiddenMarkTypeIdList()), new Set(hiddenMarkTypeIdList))) {
                data.setHiddenMarkTypeIdList(hiddenMarkTypeIdList);

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.HiddenGridMarkTypeIdListChanged, {
                    war : war,
                } as Notifications_DataTypes.HiddenGridMarkTypeIdListChanged);
            }
            FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const data = war.getSaveSlotExtraData().createIfNotExistsGridMarkData();
            if (!Helpers_Collection.checkIsSameSet(new Set(data.getHiddenMarkTypeIdList()), new Set(hiddenMarkTypeIdList))) {
                data.setHiddenMarkTypeIdList(hiddenMarkTypeIdList);

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.HiddenGridMarkTypeIdListChanged, {
                    war : war,
                } as Notifications_DataTypes.HiddenGridMarkTypeIdListChanged);
            }
            FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

        } else {
            // TODO
        }
    }

    private _onTouchedGroupHelpBatchMark(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0850),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnPositionFilter(): void {
        const mapSize = this.getOpenData()?.war.getTileMap().getMapSize();
        if (mapSize == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WePositionFilterPanel, {
            currentFilter : this._positionFilter,
            mapSize       : mapSize,
            callback      : positionFilter => {
                this._positionFilter = positionFilter;
                this._updateLabelPositionFilter();
            },
        });
    }

    private _onTouchedBtnUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeUnitFilterPanel, {
            currentFilter         : this._unitFilter,
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            gameConfig            : war.getGcData(),
            mapSize               : war.getTileMap().getMapSize(),
            callback              : unitFilter => {
                this._unitFilter = unitFilter;
                this._updateLabelUnitFilter();
            },
        });
    }

    private _onTouchedBtnTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeTileFilterPanel, {
            currentFilter         : this._tileFilter,
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            gameConfig            : war.getGcData(),
            mapSize               : war.getTileMap().getMapSize(),
            callback              : tileFilter => {
                this._tileFilter = tileFilter;
                this._updateLabelTileFilter();
            },
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

        const player = war instanceof MultiPlayerWar_Model_MpwWar.MpwWar ? war.getPlayerLoggedIn() : war.getPlayerInTurn();
        if (player == null) {
            return;
        }

        const metGridIdArray = this._getMetGridIdArray(player.getTeamIndex());
        const addGridIdArray = metGridIdArray.filter(v => player.getMarkTypeId(v) != _selectedMarkTypeId);
        if (addGridIdArray.length <= 0) {
            FloatText.showLang(Lang_Constants.TextType.A0090);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0193, metGridIdArray.length, addGridIdArray.length),
                callback   : () => {
                    if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
                        MultiPlayerWar_Model_MpwProxy.reqMpwCommonMarkGrid(Helpers_Misc.getExisted(war.getWarId()), addGridIdArray, [], _selectedMarkTypeId);

                    } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
                        GridMarks_Utils.updateGridMarkList(war.getGridMarkData().getGridIdAndMarkTypeIdList(), addGridIdArray, [], _selectedMarkTypeId);

                        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as Notifications_DataTypes.GridMarkListChanged);
                        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

                    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
                        GridMarks_Utils.updateGridMarkList(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), addGridIdArray, [], _selectedMarkTypeId);

                        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as Notifications_DataTypes.GridMarkListChanged);
                        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

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

        const player = war instanceof MultiPlayerWar_Model_MpwWar.MpwWar ? war.getPlayerLoggedIn() : war.getPlayerInTurn();
        if (player == null) {
            return;
        }

        const metGridIdArray    = this._getMetGridIdArray(player.getTeamIndex());
        const deleteGridIdArray = metGridIdArray.filter(v => player.getMarkTypeId(v) != null);
        if (deleteGridIdArray.length <= 0) {
            FloatText.showLang(Lang_Constants.TextType.A0090);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0193, metGridIdArray.length, deleteGridIdArray.length),
                callback   : () => {
                    if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
                        MultiPlayerWar_Model_MpwProxy.reqMpwCommonMarkGrid(Helpers_Misc.getExisted(war.getWarId()), [], deleteGridIdArray, _selectedMarkTypeId);

                    } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
                        GridMarks_Utils.updateGridMarkList(war.getGridMarkData().getGridIdAndMarkTypeIdList(), [], deleteGridIdArray, _selectedMarkTypeId);

                        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as Notifications_DataTypes.GridMarkListChanged);
                        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

                    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
                        GridMarks_Utils.updateGridMarkList(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), [], deleteGridIdArray, _selectedMarkTypeId);

                        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as Notifications_DataTypes.GridMarkListChanged);
                        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

                    } else {
                        // TODO
                        player.updateGridMarkList([], deleteGridIdArray, _selectedMarkTypeId);
                    }
                },
            });
        }
    }

    private _onTouchedBtnMarkType(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleGridMarkPanel, {
            currentMarkTypeId : _selectedMarkTypeId,
            callback          : markTypeId => {
                _selectedMarkTypeId = markTypeId;
                this._updateImgMarkType();
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleGridMarkPanel);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMpwCommonSetPlayerIndexesForShowMarkedGrid(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgMpwCommonMarkTile(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1108);
        this._labelShow.setLangText(Lang_Constants.TextType.B1309);
        this._btnShow.setLangText(Lang_Constants.TextType.B0026);
        this._btnImport.setLangText(Lang_Constants.TextType.B1253);
        this._btnExport.setLangText(Lang_Constants.TextType.B1479);

        this._labelBatchMark.setLangText(Lang_Constants.TextType.B1109);
        this._btnPositionFilter.setLangText(Lang_Constants.TextType.B1073);
        this._btnUnitFilter.setLangText(Lang_Constants.TextType.UnitFilter);
        this._btnTileFilter.setLangText(Lang_Constants.TextType.TileFilter);
        this._btnInVision.setLangText(Lang_Constants.TextType.B1110);
        this._btnBatchMark.setLangText(Lang_Constants.TextType.B0914);
        this._btnBatchUnmark.setLangText(Lang_Constants.TextType.B0915);
        this._updateLabelPositionFilter();
        this._updateLabelUnitFilter();
        this._updateLabelTileFilter();
        this._updateLabelInVision();

        this._groupHelpBatchMark.arrangeItems();
    }

    private _updateImgMarkType(): void {
        this._imgMarkType.loadSource(Helpers_ImageSource.getGridMark(_selectedMarkTypeId));
    }

    private async _updateListPlayer(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const list      = this._listPlayer;
        const dataArray = GridMarks_Constants.AllGridMarkTypeId.map(v => ({ markTypeId : v }));
        await list.bindData(dataArray);

        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const hiddenList    = war.getPlayerLoggedIn()?.getHiddenGridMarkTypeIdList() ?? [];
            const itemIndexes   : number[] = [];
            for (let index = 0; index < dataArray.length; index++) {
                if (!hiddenList.includes(dataArray[index].markTypeId)) {
                    itemIndexes.push(index);
                }
            }
            list.setSelectedItemIndexes(itemIndexes);

        } else if ((war instanceof MapEditor_Model_MeWar.MeWar) || (war instanceof ReplayWar_Model_RwWarBase.RwWarBase)) {
            const hiddenList    = war.getGridMarkData().getHiddenMarkTypeIdList();
            const itemIndexes   : number[] = [];
            for (let index = 0; index < dataArray.length; index++) {
                if (!hiddenList.includes(dataArray[index].markTypeId)) {
                    itemIndexes.push(index);
                }
            }
            list.setSelectedItemIndexes(itemIndexes);

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
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
        this._labelPositionFilter.setLangText(this._positionFilter ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }

    private _updateLabelUnitFilter(): void {
        this._labelUnitFilter.setLangText(this._unitFilter ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }

    private _updateLabelTileFilter(): void {
        this._labelTileFilter.setLangText(this._tileFilter ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }

    private _updateLabelInVision(): void {
        const label         = this._labelInVision;
        const isInVision    = this._isInVision;
        if (isInVision == null) {
            label.setLangText(Lang_Constants.TextType.B0776);
        } else {
            label.setLangText(isInVision ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
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
        const tilesInVision     = Visibilities_Utils.getAllTilesVisibleToTeam(war, teamIndex);
        const unitsInVision     = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, new Set([teamIndex]));
        const unitMap           = war.getUnitMap();
        const mapSize           = unitMap.getMapSize();
        const gridIdArray       : number[] = [];
        for (const tile of war.getTileMap().getAllTiles()) {
            const isTileInVision = tilesInVision.has(tile);
            if ((isInVision != null) && (isInVision !== isTileInVision)) {
                continue;
            }

            if ((positionFilter) && (!DeprecatedPositionFilter_Utils.checkIsMeet(positionFilter, tile))) {
                continue;
            }

            if (tileFilter) {
                if (((isTileInVision) && (!Tiles_Utils_Filter.checkIsMeet(tileFilter, tile)))              ||
                    ((!isTileInVision) && (!Tiles_Utils_Filter.checkIsMeetAsOutOfVision(tileFilter, tile)))
                ) {
                    continue;
                }
            }

            const gridIndex = tile.getGridIndex();
            if (unitFilter) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit == null) || (!unitsInVision.has(unit)) || (!Units_Utils_Filter.checkIsMeet(unitFilter, unit))) {
                    continue;
                }
            }

            gridIdArray.push(gridIndex.getGridId(mapSize));
        }

        return gridIdArray;
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    markTypeId : number;
}
class PlayerRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupShow!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgMark!      : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const markTypeId = this.getOpenData()?.markTypeId;
        if (markTypeId != null) {
            this._imgMark.loadSource(Helpers_ImageSource.getGridMark(markTypeId));
        }
    }
}
