import type * as AuxiliaryTypesPositionFilter from "../../auxiliaryTypes/PositionFilter.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as DeprecatedPositionFilterUtils from "../../deprecatedPositionFilter/Utils.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GridMarksConstants from "../../gridMarks/Constants.ts";
import * as GridMarksUtils from "../../gridMarks/Utils.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwProxy from "../../multiPlayerWar/model/MpwProxy.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureGridMarkData from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoStructureUnitFilter from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesUtilsFilter from "../../tiles/utils/Filter.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UnitsUtilsFilter from "../../units/utils/Filter.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

type PositionFilter     = AuxiliaryTypesPositionFilter.PositionFilter;
type UnitFilter         = ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter;
type TileFilter         = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;

let _selectedMarkTypeId     = GridMarksConstants.TypeId.MinMarkTypeId;

export interface OpenData {
    war     : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnImport!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnExport!            : UiInterfacesIUiButton.IUiButton;

    private readonly _labelShow!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listPlayer!           : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;
    private readonly _btnShow!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupHelpBatchMark!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelBatchMark!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPositionFilter!    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelPositionFilter!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTileFilter!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTileFilter!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnUnitFilter!        : UiInterfacesIUiButton.IUiButton;
    private readonly _labelUnitFilter!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnInVision!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelInVision!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnBatchMark!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnBatchUnmark!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMarkType!          : UiInterfacesIUiButton.IUiButton;
    private readonly _imgMarkType!          : UiInterfacesIUiImage.IUiImage;

    private _positionFilter : PositionFilter | null = null;
    private _unitFilter     : UnitFilter | null = null;
    private _tileFilter     : TileFilter | null = null;
    private _isInVision     : boolean | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonSetPlayerIndexesForShowMarkedGrid,   callback: this._onNotifyMsgMpwCommonSetPlayerIndexesForShowMarkedGrid },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonMarkTile,                            callback: this._onNotifyMsgMpwCommonMarkTile },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0275);
                return;
            }

            let data: ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData | undefined;
            try {
                data = ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData.fromJson(JSON.parse(text));
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0784);
                return;
            }

            if (data == null) {
                FloatText2.showLang(LangConstants.TextType.A0784);
                return;
            }

            if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
                MultiPlayerWarModelMpwProxy.reqMpwCommonSetGridMarkList(HelpersMisc.getExisted(war.getWarId()), data.getGridIdAndMarkTypeIdList());

            } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
                war.getGridMarkData().setGridIdAndMarkTypeIdList(data.getGridIdAndMarkTypeIdList());

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkListChanged, {
                    war : war,
                } as NotificationsDataTypes.GridMarkListChanged);
                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

            } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
                war.getSaveSlotExtraData().createIfNotExistsGridMarkData().setGridIdAndMarkTypeIdList(data.getGridIdAndMarkTypeIdList());

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkListChanged, {
                    war : war,
                } as NotificationsDataTypes.GridMarkListChanged);
                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

            } else {
                // TODO
            }
        };

        if (CommonModelCommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0979),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0026),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private _onTouchedBtnExport(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = async () => {
            try {
                window.focus();

                const data = new ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData();
                if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
                    data.setGridIdAndMarkTypeIdList(war.getPlayerLoggedIn()?.getGridMarkList() ?? []);

                } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
                    data.setGridIdAndMarkTypeIdList(war.getGridMarkData().getGridIdAndMarkTypeIdList());

                } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
                    data.setGridIdAndMarkTypeIdList(war.getSaveSlotExtraData().getGridMarkData()?.getGridIdAndMarkTypeIdList() ?? []);

                } else {
                    // TODO
                }
                await navigator.clipboard.writeText(JSON.stringify(data.toJson()));

            } catch {
                FloatText2.showLang(LangConstants.TextType.A0275);
                return;
            }

            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0235));
        };

        if (CommonModelCommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0979),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0026),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
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

        const visibleMarkTypeIdList = HelpersCollection.getNonNullElements(this._listPlayer.getSelectedItems()?.map(v => v.getOpenData()?.markTypeId) ?? []);
        const hiddenMarkTypeIdList  = GridMarksConstants.AllGridMarkTypeId.filter(v => !visibleMarkTypeIdList.includes(v));
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            MultiPlayerWarModelMpwProxy.reqMpwCommonSetHiddenGridMarkTypeIdList(HelpersMisc.getExisted(war.getWarId()), hiddenMarkTypeIdList);

        } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
            const data = war.getGridMarkData();
            if (!HelpersCollection.checkIsSameSet(new Set(data.getHiddenMarkTypeIdList()), new Set(hiddenMarkTypeIdList))) {
                data.setHiddenMarkTypeIdList(hiddenMarkTypeIdList);

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.HiddenGridMarkTypeIdListChanged, {
                    war : war,
                } as NotificationsDataTypes.HiddenGridMarkTypeIdListChanged);
            }
            FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const data = war.getSaveSlotExtraData().createIfNotExistsGridMarkData();
            if (!HelpersCollection.checkIsSameSet(new Set(data.getHiddenMarkTypeIdList()), new Set(hiddenMarkTypeIdList))) {
                data.setHiddenMarkTypeIdList(hiddenMarkTypeIdList);

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.HiddenGridMarkTypeIdListChanged, {
                    war : war,
                } as NotificationsDataTypes.HiddenGridMarkTypeIdListChanged);
            }
            FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

        } else {
            // TODO
        }
    }

    private _onTouchedGroupHelpBatchMark(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0850),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnPositionFilter(): void {
        const mapSize = this.getOpenData()?.war.getTileMap().getMapSize();
        if (mapSize == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WePositionFilterPanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeUnitFilterPanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeTileFilterPanel, {
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

        const player = war instanceof GameHelpersGhFactory.getMpwWarClass() ? war.getPlayerLoggedIn() : war.getPlayerInTurn();
        if (player == null) {
            return;
        }

        const metGridIdArray = this._getMetGridIdArray(player.getTeamIndex());
        const addGridIdArray = metGridIdArray.filter(v => player.getMarkTypeId(v) != _selectedMarkTypeId);
        if (addGridIdArray.length <= 0) {
            FloatText2.showLang(LangConstants.TextType.A0090);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getFormattedText(LangConstants.TextType.F0193, metGridIdArray.length, addGridIdArray.length),
                callback    : () => {
                    if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
                        MultiPlayerWarModelMpwProxy.reqMpwCommonMarkGrid(HelpersMisc.getExisted(war.getWarId()), addGridIdArray, [], _selectedMarkTypeId);

                    } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
                        GridMarksUtils.updateGridMarkList(war.getGridMarkData().getGridIdAndMarkTypeIdList(), addGridIdArray, [], _selectedMarkTypeId);

                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as NotificationsDataTypes.GridMarkListChanged);
                        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

                    } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
                        GridMarksUtils.updateGridMarkList(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), addGridIdArray, [], _selectedMarkTypeId);

                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as NotificationsDataTypes.GridMarkListChanged);
                        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

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

        const player = war instanceof GameHelpersGhFactory.getMpwWarClass() ? war.getPlayerLoggedIn() : war.getPlayerInTurn();
        if (player == null) {
            return;
        }

        const metGridIdArray    = this._getMetGridIdArray(player.getTeamIndex());
        const deleteGridIdArray = metGridIdArray.filter(v => player.getMarkTypeId(v) != null);
        if (deleteGridIdArray.length <= 0) {
            FloatText2.showLang(LangConstants.TextType.A0090);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getFormattedText(LangConstants.TextType.F0193, metGridIdArray.length, deleteGridIdArray.length),
                callback    : () => {
                    if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
                        MultiPlayerWarModelMpwProxy.reqMpwCommonMarkGrid(HelpersMisc.getExisted(war.getWarId()), [], deleteGridIdArray, _selectedMarkTypeId);

                    } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
                        GridMarksUtils.updateGridMarkList(war.getGridMarkData().getGridIdAndMarkTypeIdList(), [], deleteGridIdArray, _selectedMarkTypeId);

                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as NotificationsDataTypes.GridMarkListChanged);
                        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

                    } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
                        GridMarksUtils.updateGridMarkList(war.getSaveSlotExtraData().createIfNotExistsGridMarkData().getGridIdAndMarkTypeIdList(), [], deleteGridIdArray, _selectedMarkTypeId);

                        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkListChanged, {
                            war : war,
                        } as NotificationsDataTypes.GridMarkListChanged);
                        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

                    } else {
                        // TODO
                        player.updateGridMarkList([], deleteGridIdArray, _selectedMarkTypeId);
                    }
                },
            });
        }
    }

    private _onTouchedBtnMarkType(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleGridMarkPanel, {
            currentMarkTypeId   : _selectedMarkTypeId,
            callback            : markTypeId => {
                _selectedMarkTypeId = markTypeId;
                this._updateImgMarkType();
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleGridMarkPanel);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMpwCommonSetPlayerIndexesForShowMarkedGrid(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgMpwCommonMarkTile(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B1108);
        this._labelShow.setLangText(LangConstants.TextType.B1309);
        this._btnShow.setLangText(LangConstants.TextType.B0026);
        this._btnImport.setLangText(LangConstants.TextType.B1253);
        this._btnExport.setLangText(LangConstants.TextType.B1479);

        this._labelBatchMark.setLangText(LangConstants.TextType.B1109);
        this._btnPositionFilter.setLangText(LangConstants.TextType.B1073);
        this._btnUnitFilter.setLangText(LangConstants.TextType.UnitFilter);
        this._btnTileFilter.setLangText(LangConstants.TextType.TileFilter);
        this._btnInVision.setLangText(LangConstants.TextType.B1110);
        this._btnBatchMark.setLangText(LangConstants.TextType.B0914);
        this._btnBatchUnmark.setLangText(LangConstants.TextType.B0915);
        this._updateLabelPositionFilter();
        this._updateLabelUnitFilter();
        this._updateLabelTileFilter();
        this._updateLabelInVision();

        this._groupHelpBatchMark.arrangeItems();
    }

    private _updateImgMarkType(): void {
        this._imgMarkType.loadSource(HelpersImageSource.getGridMark(_selectedMarkTypeId));
    }

    private async _updateListPlayer(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const list      = this._listPlayer;
        const dataArray = GridMarksConstants.AllGridMarkTypeId.map(v => ({ markTypeId: v }));
        await list.bindData(dataArray);

        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const hiddenList    = war.getPlayerLoggedIn()?.getHiddenGridMarkTypeIdList() ?? [];
            const itemIndexes   : number[] = [];
            for (let index = 0; index < dataArray.length; index++) {
                if (!hiddenList.includes(dataArray[index].markTypeId)) {
                    itemIndexes.push(index);
                }
            }
            list.setSelectedItemIndexes(itemIndexes);

        } else if ((war instanceof GameHelpersGhFactory.getMeWarClass()) || (war instanceof GameHelpersGhFactory.getRwWarBaseClass())) {
            const hiddenList    = war.getGridMarkData().getHiddenMarkTypeIdList();
            const itemIndexes   : number[] = [];
            for (let index = 0; index < dataArray.length; index++) {
                if (!hiddenList.includes(dataArray[index].markTypeId)) {
                    itemIndexes.push(index);
                }
            }
            list.setSelectedItemIndexes(itemIndexes);

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
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
        this._labelPositionFilter.setText(LangUtils.getText(this._positionFilter ? LangConstants.TextType.Yes : LangConstants.TextType.No));
    }

    private _updateLabelUnitFilter(): void {
        this._labelUnitFilter.setText(LangUtils.getText(this._unitFilter ? LangConstants.TextType.Yes : LangConstants.TextType.No));
    }

    private _updateLabelTileFilter(): void {
        this._labelTileFilter.setText(LangUtils.getText(this._tileFilter ? LangConstants.TextType.Yes : LangConstants.TextType.No));
    }

    private _updateLabelInVision(): void {
        const label         = this._labelInVision;
        const isInVision    = this._isInVision;
        if (isInVision == null) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0776));
        } else {
            label.setText(LangUtils.getText(isInVision ? LangConstants.TextType.Yes : LangConstants.TextType.No));
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
        const tilesInVision     = VisibilitiesUtils.getAllTilesVisibleToTeam(war, teamIndex);
        const unitsInVision     = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, new Set([teamIndex]));
        const unitMap           = war.getUnitMap();
        const mapSize           = unitMap.getMapSize();
        const gridIdArray       : number[] = [];
        for (const tile of war.getTileMap().getAllTiles()) {
            const isTileInVision = tilesInVision.has(tile);
            if ((isInVision != null) && (isInVision !== isTileInVision)) {
                continue;
            }

            if ((positionFilter) && (!DeprecatedPositionFilterUtils.checkIsMeet(positionFilter, tile))) {
                continue;
            }

            if (tileFilter) {
                if (((isTileInVision) && (!TilesUtilsFilter.checkIsMeet(tileFilter, tile)))              ||
                    ((!isTileInVision) && (!TilesUtilsFilter.checkIsMeetAsOutOfVision(tileFilter, tile)))
                ) {
                    continue;
                }
            }

            const gridIndex = tile.getGridIndex();
            if (unitFilter) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit == null) || (!unitsInVision.has(unit)) || (!UnitsUtilsFilter.checkIsMeet(unitFilter, unit))) {
                    continue;
                }
            }

            gridIdArray.push(gridIndex.getGridId(mapSize));
        }

        return gridIdArray;
    }
}

interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    markTypeId : number;
}
class PlayerRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForPlayerRenderer>
{
    private readonly _groupShow!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgMark!      : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const markTypeId = this.getOpenData()?.markTypeId;
        if (markTypeId != null) {
            this._imgMark.loadSource(HelpersImageSource.getGridMark(markTypeId));
        }
    }
}
