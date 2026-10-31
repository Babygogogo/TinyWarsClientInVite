import {
    type Notifications_Mapping,
    AuxiliaryTypes_ChatToTarget,
    Maps_Constants,
    MapEditors_Constants,
    ForceSkins_Utils,
    AuxiliaryTypes_GridIndex,
    FloatText,
    Tiles_TileView,
    Ui_Components_UiTileView,
    Units_Unit,
    Units_UnitView,
    type AuxiliaryTypes_AuxiliaryTypes,
    Tiles_Utils_Serialization,
    MapEditor_Model_MeHelpers,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Misc,
    MapEditor_Model_MeModel,
    Helpers_PointerInput,
    Helpers_Collection,
    Timer_TimerModel,
    LocalData_Storage,
    Helpers_GameFlow,
    Helpers_Compatibility,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    MapEditor_Model_MeProxy,
    NormalMap_Model_NormalMapProxy,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Model_MeTypes,
    type MapEditor_Interface_IMeDrawer,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Utils_Serialization,
    Users_Model,
    WarTypes_Constants,
    type Egret_Egret,
} from "../../internal.ts";


const MaxLengthForListRecent = 30;

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupRight!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupModeButton!              : Ui_Interfaces_IUiLayout.IUiLayout;
    // private readonly _labelMode!                    : Ui.Interfaces.IUiLabel;
    private readonly _conUnitView!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conTileView!                  : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupRecent!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listRecent!                   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForRecentRenderer>;
    private readonly _btnUndo!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRedo!                      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModePreview!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModePreview!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDrawTileBase!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDrawTileBase!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDrawTileDecorator!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDrawTileDecorator!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDeleteTileDecorator! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDeleteTileDecorator!   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDrawTileObject!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDrawTileObject!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDeleteTileObject!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDeleteTileObject!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDrawUnit!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDrawUnit!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDeleteUnit!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDeleteUnit!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDrawLocation!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDrawLocation!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModeDeleteLocation!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModeDeleteLocation!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupCopyTile!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCopyTile!                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModePasteTile!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModePasteTile!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupCopyUnit!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCopyUnit!                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupModePasteUnit!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModePasteUnit!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupLeftButtons!             : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSaveMap!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLoadMap!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnReviewAccept!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnReviewReject!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnWarRule!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnWarEvent!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMapInfo!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnVisibility!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSymmetry!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChat!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMenu!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupAutoAdjust!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnAutoAdjust!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAutoAdjustToggleOn!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAutoAdjustToggleOff!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelLocation!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMouseHover!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView                      = new Units_UnitView.UnitView();
    private readonly _tileView                      = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "TimeTick",                            callback : this._onNotifyTimeTick },
            { type : "TileAnimationTick",                   callback : this._onNotifyTileAnimationTick },
            { type : "MeDrawerModeChanged",                 callback : this._onNotifyMeDrawerModeChanged },
            { type : "MeAutoAdjustToggleVisibilityChanged", callback : this._onNotifyMeAutoAdjustToggleVisibilityChanged },
            { type : "MeRealTimeAdjustChanged",             callback : this._onNotifyMeRealTimeAdjustChanged },
            { type : "BwCursorGridIndexChanged",            callback : this._onNotifyBwCursorGridIndexChanged },
            { type : "BwTileHasLocationIdSet",              callback : this._onNotifyBwTileLocationFlatSet },
            { type : "MsgMeSubmitNormalMap",                callback : this._onNotifyMsgMeSubmitNormalMap },
            { type : "MsgMmReviewMap",                      callback : this._onNotifyMsgMmReviewMap },
            { type : "MsgMeDeleteSlot",                     callback : this._onNotifyMsgMeDeleteSlot },
            { type : "MsgCmSetCampaignMapRawData",          callback : this._onNotifyMsgCmSetCampaignMapRawData },
        ]);
        this._setUiListenerArray([
            { ui : this._groupModePreview,               callback : this._onTouchedGroupModePreview },
            { ui : this._groupModeDrawTileBase,          callback : this._onTouchedGroupModeDrawTileBase },
            { ui : this._groupModeDrawTileDecorator,     callback : this._onTouchedGroupModeDrawTileDecoration },
            { ui : this._groupModeDeleteTileDecorator,   callback : this._onTouchedGroupModeDeleteTileDecoration },
            { ui : this._groupModeDrawTileObject,        callback : this._onTouchedGroupModeDrawTileObject },
            { ui : this._groupModeDeleteTileObject,      callback : this._onTouchedGroupModeDeleteTileObject },
            { ui : this._groupModeDrawUnit,              callback : this._onTouchedGroupModeDrawUnit },
            { ui : this._groupModeDeleteUnit,            callback : this._onTouchedGroupModeDeleteUnit },
            { ui : this._groupModeDrawLocation,          callback : this._onTouchedGroupModeDrawLocation },
            { ui : this._groupModeDeleteLocation,        callback : this._onTouchedGroupModeDeleteLocation },
            { ui : this._groupCopyTile,                  callback : this._onTouchedGroupCopyTile },
            { ui : this._groupModePasteTile,             callback : this._onTouchedGroupModePasteTile },
            { ui : this._groupCopyUnit,                  callback : this._onTouchedGroupCopyUnit },
            { ui : this._groupModePasteUnit,             callback : this._onTouchedGroupModePasteUnit },

            { ui : this._btnUndo,                        callback : this._onTouchedBtnUndo },
            { ui : this._btnRedo,                        callback : this._onTouchedBtnRedo },
            { ui : this._btnSaveMap,                     callback : this._onTouchedBtnSaveMap },
            { ui : this._btnLoadMap,                     callback : this._onTouchedBtnLoadMap },
            { ui : this._btnReviewAccept,                callback : this._onTouchedBtnReviewAccept },
            { ui : this._btnReviewReject,                callback : this._onTouchedBtnReviewReject },
            { ui : this._btnWarRule,                     callback : this._onTouchedBtnWarRule },
            { ui : this._btnWarEvent,                    callback : this._onTouchedBtnWarEvent },
            { ui : this._btnMapInfo,                     callback : this._onTouchedBtnMapInfo },
            { ui : this._btnVisibility,                  callback : this._onTouchedBtnVisibility },
            { ui : this._btnSymmetry,                    callback : this._onTouchedBtnSymmetry },
            { ui : this._btnChat,                        callback : this._onTouchedBtnChat },
            { ui : this._btnMenu,                        callback : this._onTouchedBtnMenu },
            { ui : this._btnAutoAdjust,                  callback : this._onTouchedBtnAutoAdjust },
            { ui : this._btnAutoAdjustToggleOn,          callback : this._onTouchedBtnAutoAdjustToggleOn },
            { ui : this._btnAutoAdjustToggleOff,         callback : this._onTouchedBtnAutoAdjustToggleOff },
        ]);
        this.getEventAgent().addAutoEnterFrameListener(this._onEnterFrame, this);

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        this._conUnitView.addUiChild(this._unitView);

        this._listRecent.setItemRendererClass(RecentRenderer);
        this._labelLocation.setAutoShrinkHeight(12);
        this._labelMouseHover.setAutoShrinkHeight(12);

        this._initTileView();
        this._initUnitView();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listRecent.removeAllItems();

        await super._onClosed();
    }

    protected override _updateOnResize(stageWidth: number): void {
        const width = stageWidth - 160;
        this._labelLocation.setAutoShrinkWidth(width);
        this._labelMouseHover.setAutoShrinkWidth(width);
    }

    private _getWar(): MapEditor_Interface_IMeWar.IMeWar {
        return Helpers_Misc.getExisted(MapEditor_Model_MeModel.getWar());
    }
    private _getDrawer(): MapEditor_Interface_IMeDrawer.IMeDrawer {
        return this._getWar().getDrawer();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void  {
        this._updateComponentsForLanguage();
    }
    private async _onNotifyTimeTick(): Promise<void> {
        const autoSaveTime = Users_Model.getSelfMapEditorAutoSaveTime();
        if ((!autoSaveTime) || (Timer_TimerModel.getServerTimestamp() % autoSaveTime !== 0)) {
            return;
        }

        const war = MapEditor_Model_MeModel.getWar();
        if ((war == null) || (!war.getIsMapModified()) || (war.getIsReviewingMap())) {
            return;
        }

        const slotIndex = war.getMapSlotIndex();
        if (slotIndex === await MapEditor_Model_MeModel.getReviewingMapSlotIndex()) {
            return;
        }

        const mapRawData = await war.serializeForMap();
        if (await MapEditor_Model_MeHelpers.getCriticalErrorCodeForMapRawData(mapRawData)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0304));
        } else {
            MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                slotIndex                 : slotIndex,
                mapRawData                : mapRawData,
                needReview                : false,
                srcNormalMapIdForAddEvent : war.getSrcNormalMapIdForAddEvent(),
                gridMarkData              : war.getGridMarkData(),
            });
        }
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
    private async _onNotifyMeDrawerModeChanged(): Promise<void> {
        this._updateGroupRight();

        const war       = this._getWar();
        const drawer    = war.getDrawer();
        const mode      = drawer.getMode();
        const list      = this._listRecent;
        const dataArray = Helpers_Collection.getNonNullElements(list.getBoundDataArray() ?? []);
        if (mode === MapEditors_Constants.DrawerMode.DrawTileBase) {
            const dataForDrawTileBase   = Helpers_Misc.getExisted(drawer.getDrawTargetTileBaseData());
            const newDataArray          = dataArray?.filter(v => {
                const existingData = v?.dataForDrawTileBase;
                return (existingData == null) || (existingData.baseType !== dataForDrawTileBase.baseType) || (existingData.shapeId !== dataForDrawTileBase.shapeId);
            });
            newDataArray.splice(0, 0, {
                war                       : war,
                dataForDrawTileBase       : dataForDrawTileBase,
                dataForDrawTileDecoration : null,
                dataForDrawTileObject     : null,
                dataForDrawUnit           : null,
                panel                     : this,
            });
            newDataArray.length = Math.min(MaxLengthForListRecent, newDataArray.length);
            await list.bindData(newDataArray);

        } else if (mode === MapEditors_Constants.DrawerMode.DrawTileDecoration) {
            const dataForDrawTileDecoration = Helpers_Misc.getExisted(drawer.getDrawTargetTileDecorationData());
            const newDataArray              = dataArray?.filter(v => {
                const existingData  = v.dataForDrawTileDecoration;
                return (existingData == null) || (existingData.decorationType !== dataForDrawTileDecoration.decorationType) || (existingData.shapeId !== dataForDrawTileDecoration.shapeId);
            });
            newDataArray.splice(0, 0, {
                war                       : war,
                dataForDrawTileBase       : null,
                dataForDrawTileDecoration : dataForDrawTileDecoration,
                dataForDrawTileObject     : null,
                dataForDrawUnit           : null,
                panel                     : this,
            });
            newDataArray.length = Math.min(MaxLengthForListRecent, newDataArray.length);
            await list.bindData(newDataArray);

        } else if (mode === MapEditors_Constants.DrawerMode.DrawTileObject) {
            const dataForDrawTileObject = Helpers_Misc.getExisted(drawer.getDrawTargetTileObjectData());
            const newDataArray          = dataArray?.filter(v => {
                const existingData = v.dataForDrawTileObject;
                return (existingData == null)
                    || (existingData.objectType !== dataForDrawTileObject.objectType)
                    || (existingData.shapeId !== dataForDrawTileObject.shapeId)
                    || (existingData.playerIndex !== dataForDrawTileObject.playerIndex);
            });
            newDataArray.splice(0, 0, {
                war                       : war,
                dataForDrawTileBase       : null,
                dataForDrawTileDecoration : null,
                dataForDrawTileObject     : dataForDrawTileObject,
                dataForDrawUnit           : null,
                panel                     : this,
            });
            newDataArray.length = Math.min(MaxLengthForListRecent, newDataArray.length);
            await list.bindData(newDataArray);

        } else if (mode === MapEditors_Constants.DrawerMode.DrawUnit) {
            const targetUnit    = Helpers_Misc.getExisted(drawer.getDrawTargetUnit());
            const unitType      = targetUnit.getUnitType();
            const playerIndex   = targetUnit.getPlayerIndex();
            const newDataArray  = dataArray?.filter(v => {
                const existingData = v.dataForDrawUnit;
                return (existingData == null) || (existingData.playerIndex !== playerIndex) || (existingData.unitType !== unitType);
            });
            newDataArray.splice(0, 0, {
                war                       : war,
                dataForDrawTileBase       : null,
                dataForDrawTileDecoration : null,
                dataForDrawTileObject     : null,
                dataForDrawUnit           : { playerIndex : playerIndex, unitType : unitType },
                panel                     : this,
            });
            newDataArray.length = Math.min(MaxLengthForListRecent, newDataArray.length);
            await list.bindData(newDataArray);
        }
    }
    private _onNotifyMeAutoAdjustToggleVisibilityChanged(): void {
        this._updateGroupAutoAdjust();
    }
    private _onNotifyMeRealTimeAdjustChanged(): void {
        this._updateGroupAutoAdjust();
    }
    private _onNotifyBwCursorGridIndexChanged(): void {
        this._updateLabelLocation();
    }
    private _onNotifyBwTileLocationFlatSet(): void {
        this._updateLabelLocation();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMeSubmitNormalMap"]>): void {
        const data = (Helpers_Misc.getExisted(e.data)).msg;
        if (!data.getNeedReview()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0085));
        } else {
            const errorCode = data.getMapRawDataErrorCode();
            if (errorCode) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0197));
                FloatText.show(Lang_Utils.getErrorText(errorCode));
            } else {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0244));
            }
        }

        this._getWar().setIsMapModified(false);
    }
    private _onNotifyMsgMmReviewMap(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgMmReviewMap"]>): void {
        const data = (Helpers_Misc.getExisted(e.data)).msg;
        if (data.getIsAccept()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0092));
        } else {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0093));
        }
        Helpers_GameFlow.gotoLobby();
    }
    private _onNotifyMsgMeDeleteSlot(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0081));
        Helpers_GameFlow.gotoMyWarListPanel(WarTypes_Constants.WarTypeId.Me);
    }
    private _onNotifyMsgCmSetCampaignMapRawData(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onEnterFrame(): void {
        const label = this._labelMouseHover;
        if (!Helpers_Compatibility.isPc) {
            label.setIsVisible(false);
            return;
        }

        const x = Helpers_PointerInput.getMouseX();
        const y = Helpers_PointerInput.getMouseY();
        if ((x == null) || (y == null)) {
            label.setIsVisible(false);
            return;
        }

        const war       = this._getWar();
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.createGridIndexByPoint(war.getView().getFieldContainer().getContentsContainerGlobalToLocal({ x, y }));
        label.setIsVisible(true);
        if (!gridIndex.checkIsInsideMap(war.getTileMap().getMapSize())) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1112)}: --`);
        } else {
            const locationIdArray   = war.getTileMap().getTile(gridIndex).getLocationIdList(true);
            const textForGridIndex  = `x${gridIndex.getX()} y${gridIndex.getY()}`;
            const textForLocation   = locationIdArray.length ? locationIdArray.join(` `) : `--`;
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1112)}: ${textForGridIndex}, ${Lang_Utils.getText(Lang_Constants.TextType.Location)}: ${textForLocation}`);
        }
    }

    private _onTouchedGroupModePreview(): void {
        this._getDrawer().setModePreview();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileBase(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseTileBasePanel, { war : this._getWar() });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileDecoration(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseTileDecorationPanel, { war : this._getWar() });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileObject(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseTileObjectPanel, { war : this._getWar() });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawUnit(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseUnitPanel, { war : this._getWar() });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteTileObject(): void {
        this._getDrawer().setModeDeleteTileObject();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawLocation(): void {
        const war = this._getWar();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility : true,
            currentGroupedLocationIds    : war.getTileMap().getVisibleGroupedLocationIdArray().concat(),
            war                          : war,
            getTitleText                 : () => Lang_Utils.getText(Lang_Constants.TextType.B0759),
            callback                     : locationIdArray => {
                if (!locationIdArray.length) {
                    FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0266));
                } else {
                    war.getDrawer().setModeAddTileToLocation({ locationIdArray });
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteLocation(): void {
        const war = this._getWar();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility : true,
            currentGroupedLocationIds    : war.getTileMap().getVisibleGroupedLocationIdArray().concat(),
            war                          : war,
            getTitleText                 : () => Lang_Utils.getText(Lang_Constants.TextType.B0760),
            callback                     : locationIdArray => {
                if (!locationIdArray.length) {
                    FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0266));
                } else {
                    war.getDrawer().setModeDeleteTileFromLocation({ locationIdArray });
                }
            },
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupCopyTile(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const war = this._getWar();
        war.getDrawer().setDataForPasteTile(war.getTileMap().getTile(war.getCursor().getGridIndex()).serialize());
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0369));
    }
    private _onTouchedGroupModePasteTile(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const drawer    = this._getWar().getDrawer();
        const data      = drawer.getDataForPasteTile();
        if (data == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0371));
        } else {
            drawer.setModePasteTile();
        }
    }
    private _onTouchedGroupCopyUnit(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const war       = this._getWar();
        const unitMap   = war.getUnitMap();
        const unit      = unitMap.getUnitOnMap(war.getCursor().getGridIndex());
        if (unit == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0373));
            return;
        }

        const dataArray = [unit.clone()];
        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
            dataArray.push(loadedUnit.clone());
        }
        war.getDrawer().setDataForPasteUnit(dataArray);
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0370));
    }
    private _onTouchedGroupModePasteUnit(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const drawer    = this._getWar().getDrawer();
        const data      = drawer.getDataForPasteUnit();
        if (data == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0372));
        } else {
            drawer.setModePasteUnit();
        }
    }

    private _onTouchedBtnUndo(): void {
        const war = this._getWar();
        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.A0318);
        } else {
            war.getDrawer().loadPreviousCheckpoint();
        }
    }
    private _onTouchedBtnRedo(): void {
        const war = this._getWar();
        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.A0319);
        } else {
            war.getDrawer().loadNextCheckpoint();
        }
    }

    private _onTouchedBtnSaveMap(): void {
        const war = this._getWar();
        if (war.getCampaignMapData()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeSaveCampaignMapPanel, {
                war : war,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeSaveNormalMapPanel, {
                war : war,
            });
        }
    }
    private _onTouchedBtnLoadMap(): void {
        const war = this._getWar();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0072),
            callback   : async () => {
                const slotIndex     = war.getMapSlotIndex();
                const gameConfig    = war.getGcData();
                const mapEditorData = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
                war.stopRunning();
                await war.initWithMapRawData({
                    mapRawData                : mapEditorData?.mapRawData ?? await MapEditor_Model_MeHelpers.createDefaultMapRawData(slotIndex, gameConfig),
                    slotIndex                 : slotIndex,
                    gameConfig                : gameConfig,
                    srcNormalMapIdForAddEvent : mapEditorData?.srcNormalMapIdForAddEvent ?? null,
                    gridMarkData              : mapEditorData?.gridMarkData,
                });
                war.setIsMapModified(false);
                war.startRunning()
                    .startRunningView();
            },
        });
    }
    private _onTouchedBtnReviewAccept(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0296),
            tips         : Lang_Utils.getText(Lang_Constants.TextType.A0105),
            currentValue : ``,
            canBeEmpty   : true,
            isMultiLine  : true,
            maxChars     : Maps_Constants.Common.MaxReviewCommentLength,
            charRestrict : null,
            callback     : panel => {
                const war       = this._getWar();
                const callback  = () => {
                    NormalMap_Model_NormalMapProxy.reqMmReviewMap({
                        designerUserId : war.getMapDesignerUserId(),
                        slotIndex      : war.getMapSlotIndex(),
                        modifiedTime   : war.getMapModifiedTime(),
                        isAccept       : true,
                        reviewComment  : panel.getInputText(),
                    });
                };
                if (!war.getTemplateWarRuleArray().some(v => v.getRuleAvailability()?.getCanMrw())) {
                    callback();
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0296),
                        callback   : callback,
                    });
                }
            },
        });
    }
    private _onTouchedBtnReviewReject(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0297),
            tips         : Lang_Utils.getText(Lang_Constants.TextType.A0094),
            currentValue : ``,
            canBeEmpty   : true,
            isMultiLine  : true,
            maxChars     : Maps_Constants.Common.MaxReviewCommentLength,
            charRestrict : null,
            callback     : panel => {
                const war = this._getWar();
                NormalMap_Model_NormalMapProxy.reqMmReviewMap({
                    designerUserId : war.getMapDesignerUserId(),
                    slotIndex      : war.getMapSlotIndex(),
                    modifiedTime   : war.getMapModifiedTime(),
                    isAccept       : false,
                    reviewComment  : panel.getInputText(),
                });
            },
        });
    }
    private _onTouchedBtnWarRule(): void {
        const war = this._getWar();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeWarRulePanel, { war : war });
    }
    private _onTouchedBtnWarEvent(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeMainPanel, {
            war : this._getWar(),
        });
    }
    private _onTouchedBtnMapInfo(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeMapInfoPanel, {
            war : this._getWar(),
        });
    }
    private _onTouchedGroupModeDeleteTileDecoration(): void {
        this._getDrawer().setModeDeleteTileDecoration();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteUnit(): void {
        this._getDrawer().setModeDeleteUnit();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnVisibility(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeVisibilityPanel, void 0);
    }
    private _onTouchedBtnSymmetry(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeSymmetryPanel, {
            war : this._getWar(),
        });
    }
    private _onTouchedBtnChat(): void {
        const war = this._getWar();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, {
            toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({
                toMapReviewTarget : war.getIsReviewingMap()
                    ? war.getMapDesignerUserId()
                    : Helpers_Misc.getExisted(Users_Model.getSelfUserId()),
            }), 
        });
    }
    private _onTouchedBtnMenu(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeWarMenuPanel, { war : this._getWar() });
    }
    private _onTouchedBtnAutoAdjust(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeAutoAdjustPanel,  {
            war : this._getWar(),
        });
    }
    private _onTouchedBtnAutoAdjustToggleOn(): void {
        this._getDrawer().setIsRealTimeAdjust(false);
    }
    private _onTouchedBtnAutoAdjustToggleOff(): void {
        this._getDrawer().setIsRealTimeAdjust(true);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for views.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._resetGroupLeftButtons();
        this._updateGroupRight();
        this._updateGroupModePreview();
        this._updateGroupModeDrawUnit();
        this._updateGroupModeDrawTileBase();
        this._updateGroupModeDrawTileDecoration();
        this._updateGroupModeDrawTileObject();
        this._updateGroupModeDeleteUnit();
        this._updateGroupModeDeleteTileDecoration();
        this._updateGroupModeDeleteTileObject();
        this._updateGroupModeDrawLocation();
        this._updateGroupModeDeleteLocation();
        this._updateLabelLocation();
        this._updateGroupCopyTile();
        this._updateGroupModePasteTile();
        this._updateGroupCopyUnit();
        this._updateGroupModePasteUnit();
    }

    private _updateComponentsForLanguage(): void {
        // this._updateLabelMode();
        this._btnModePreview.setLangText(Lang_Constants.TextType.B0286);
        this._btnModeDrawTileBase.setLangText(Lang_Constants.TextType.B0282);
        this._btnModeDeleteTileDecorator.setLangText(Lang_Constants.TextType.B0661);
        this._btnModeDrawUnit.setLangText(Lang_Constants.TextType.B0281);
        this._btnModeDrawTileDecorator.setLangText(Lang_Constants.TextType.B0662);
        this._btnModeDrawTileObject.setLangText(Lang_Constants.TextType.B0283);
        this._btnModeDeleteUnit.setLangText(Lang_Constants.TextType.B0284);
        this._btnModeDeleteTileObject.setLangText(Lang_Constants.TextType.B0285);
        this._btnModeDrawLocation.setLangText(Lang_Constants.TextType.B0759);
        this._btnModeDeleteLocation.setLangText(Lang_Constants.TextType.B0760);
        this._btnCopyTile.setLangText(Lang_Constants.TextType.B0993);
        this._btnModePasteTile.setLangText(Lang_Constants.TextType.B0994);
        this._btnCopyUnit.setLangText(Lang_Constants.TextType.B0995);
        this._btnModePasteUnit.setLangText(Lang_Constants.TextType.B0996);
        this._btnSaveMap.setLangText(Lang_Constants.TextType.B0287);
        this._btnLoadMap.setLangText(Lang_Constants.TextType.B0288);
        this._btnReviewAccept.setLangText(Lang_Constants.TextType.B0296);
        this._btnReviewReject.setLangText(Lang_Constants.TextType.B0297);
        this._btnWarRule.setLangText(Lang_Constants.TextType.B0314);
        this._btnWarEvent.setLangText(Lang_Constants.TextType.B0461);
        this._btnMapInfo.setLangText(Lang_Constants.TextType.B0298);
        this._btnVisibility.setLangText(Lang_Constants.TextType.B0301);
        this._btnSymmetry.setLangText(Lang_Constants.TextType.B0306);
        this._btnChat.setLangText(Lang_Constants.TextType.B0383);
        this._btnMenu.setLangText(Lang_Constants.TextType.B0155);
        this._btnAutoAdjust.setLangText(Lang_Constants.TextType.B1451);
        this._btnAutoAdjustToggleOn.setLangText(Lang_Constants.TextType.B0890);
        this._btnAutoAdjustToggleOff.setLangText(Lang_Constants.TextType.B0890);
    }

    private _resetGroupLeftButtons(): void {
        const group = this._groupLeftButtons;
        group.removeAllItems(false);

        if (this._getWar().getIsReviewingMap()) {
            group.addItem(this._btnReviewAccept, false);
            group.addItem(this._btnReviewReject, false);
        } else {
            group.addItem(this._btnSaveMap, false);
            group.addItem(this._btnLoadMap, false);
        }
        group.addItem(this._btnMapInfo, false);
        group.addItem(this._btnWarRule, false);
        group.addItem(this._btnWarEvent, false);
        group.addItem(this._btnVisibility, false);
        group.addItem(this._btnSymmetry, false);
        group.addItem(this._groupAutoAdjust, false);
        group.addItem(this._btnChat, false);
        group.addItem(this._btnMenu, false);

        group.arrangeItems();

        this._updateGroupAutoAdjust();
    }

    private _updateGroupRight(): void {
        const groupRight = this._groupRight;
        if (this._getWar().getIsReviewingMap()) {
            groupRight.setIsVisible(false);
            return;
        }

        groupRight.setIsVisible(true);
        // this._updateLabelMode();
        this._updateTileView();
        this._updateUnitView();

        const mode = this._getDrawer().getMode();
        // this._imgModePreview.visible                = mode === MapEditorDrawerMode.Preview;
        // this._imgModeDrawTileBase.visible           = mode === MapEditorDrawerMode.DrawTileBase;
        // this._imgModeDrawTileDecorator.visible      = mode === MapEditorDrawerMode.DrawTileDecoration;
        // this._imgModeDeleteTileDecorator.visible    = mode === MapEditorDrawerMode.DeleteTileDecoration;
        // this._imgModeDrawTileObject.visible         = mode === MapEditorDrawerMode.DrawTileObject;
        // this._imgModeDeleteTileObject.visible       = mode === MapEditorDrawerMode.DeleteTileObject;
        // this._imgModeDrawUnit.visible               = mode === MapEditorDrawerMode.DrawUnit;
        // this._imgModeDeleteUnit.visible             = mode === MapEditorDrawerMode.DeleteUnit;
        // this._imgModeDrawLocation.visible           = mode === MapEditorDrawerMode.AddTileToLocation;
        // this._imgModeDeleteLocation.visible         = mode === MapEditorDrawerMode.DeleteTileFromLocation;
        // this._imgModePasteTile.visible              = mode === MapEditorDrawerMode.PasteTile;
        // this._imgModePasteUnit.visible              = mode === MapEditorDrawerMode.PasteUnit;

        this._groupModePreview.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.Preview ? 80 : 70);
        this._groupModeDrawTileBase.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DrawTileBase ? 80 : 70);
        this._groupModeDrawTileDecorator.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DrawTileDecoration ? 80 : 70);
        this._groupModeDeleteTileDecorator.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DeleteTileDecoration ? 80 : 70);
        this._groupModeDrawTileObject.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DrawTileObject ? 80 : 70);
        this._groupModeDeleteTileObject.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DeleteTileObject ? 80 : 70);
        this._groupModeDrawUnit.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DrawUnit ? 80 : 70);
        this._groupModeDeleteUnit.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DeleteUnit ? 80 : 70);
        this._groupModeDrawLocation.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.AddTileToLocation ? 80 : 70);
        this._groupModeDeleteLocation.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.DeleteTileFromLocation ? 80 : 70);
        this._groupModePasteTile.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.PasteTile ? 80 : 70);
        this._groupModePasteUnit.setUnscaledManualWidth(mode === MapEditors_Constants.DrawerMode.PasteUnit ? 80 : 70);

        this._groupModeButton.arrangeItems();
    }

    // private _updateLabelMode(): void {
    //     const label     = this._labelMode;
    //     const drawer    = this._getDrawer();
    //     const mode      = drawer.getMode();
    //     label.textColor = getTextColorForDrawerMode(mode);

    //     const rawText = `${Lang.getText(LangTextType.B0280)}: ${Lang.getMapEditorDrawerModeText(mode)}`;
    //     if (mode === DrawerMode.AddTileToLocation) {
    //         label.text = `${rawText} ${drawer.getDataForAddTileToLocation()?.locationIdArray.join(`,`)}`;
    //     } else if (mode === DrawerMode.DeleteTileFromLocation) {
    //         label.text = `${rawText} ${drawer.getDataForDeleteTileFromLocation()?.locationIdArray.join(`,`)}`;
    //     } else {
    //         label.text = rawText;
    //     }
    // }

    private _updateTileView(): void {
        const drawer        = this._getDrawer();
        const mode          = drawer.getMode();
        const con           = this._conTileView;
        const tileView      = this._tileView;
        const gameConfig    = this._getWar().getGcData();
        if (mode === MapEditors_Constants.DrawerMode.DrawTileBase) {
            con.setIsVisible(true);

            const tileBaseData = Helpers_Misc.getExisted(drawer.getDrawTargetTileBaseData());
            tileView.init({
                tileBaseShapeId       : tileBaseData.shapeId,
                tileBaseType          : tileBaseData.baseType,
                tileDecorationType    : null,
                tileDecorationShapeId : null,
                tileObjectShapeId     : null,
                tileObjectType        : null,
                skinId                : Players_Constants.PlayerIndex.Neutral,
                overridingSkinId      : undefined,
                gameConfig            : gameConfig,
            });
            tileView.updateView();

        } else if (mode === MapEditors_Constants.DrawerMode.DrawTileDecoration) {
            con.setIsVisible(true);

            const tileDecorationData = Helpers_Misc.getExisted(drawer.getDrawTargetTileDecorationData());
            tileView.init({
                tileBaseShapeId       : null,
                tileBaseType          : null,
                tileDecorationType    : tileDecorationData.decorationType,
                tileDecorationShapeId : tileDecorationData.shapeId,
                tileObjectShapeId     : null,
                tileObjectType        : null,
                skinId                : Players_Constants.PlayerIndex.Neutral,
                overridingSkinId      : undefined,
                gameConfig            : gameConfig,
            });
            tileView.updateView();

        } else if (mode === MapEditors_Constants.DrawerMode.DrawTileObject) {
            con.setIsVisible(true);

            const tileObjectData = Helpers_Misc.getExisted(drawer.getDrawTargetTileObjectData());
            tileView.init({
                tileBaseShapeId       : null,
                tileBaseType          : null,
                tileDecorationType    : null,
                tileDecorationShapeId : null,
                tileObjectShapeId     : tileObjectData.shapeId,
                tileObjectType        : tileObjectData.objectType,
                skinId                : tileObjectData.playerIndex,
                overridingSkinId      : undefined,
                gameConfig            : gameConfig,
            });
            tileView.updateView();

        } else if (mode === MapEditors_Constants.DrawerMode.PasteTile) {
            con.setIsVisible(true);

            const data = Helpers_Misc.getExisted(drawer.getDataForPasteTile());
            tileView.init({
                tileBaseShapeId       : data.getBaseShapeId(),
                tileBaseType          : data.getBaseType(),
                tileDecorationType    : data.getDecorationType(),
                tileDecorationShapeId : data.getDecorationShapeId(),
                tileObjectShapeId     : data.getObjectShapeId(),
                tileObjectType        : data.getObjectType(),
                skinId                : ForceSkins_Utils.getDefaultSkinId(data.getPlayerIndex()),
                overridingSkinId      : undefined,
                gameConfig            : gameConfig,
            });
            tileView.updateView();

        } else {
            con.setIsVisible(false);
        }
    }

    private _updateUnitView(): void {
        const drawer    = this._getDrawer();
        const con       = this._conUnitView;
        const unitView  = this._unitView;
        const drawMode  = drawer.getMode();
        if (drawMode === MapEditors_Constants.DrawerMode.DrawUnit) {
            con.setIsVisible(true);
            unitView.init(Helpers_Misc.getExisted(drawer.getDrawTargetUnit()));
            unitView.resetAllViews();

        } else if (drawMode === MapEditors_Constants.DrawerMode.PasteUnit) {
            con.setIsVisible(true);
            unitView.init(Helpers_Misc.getExisted(drawer.getDataForPasteUnit())[0]);
            unitView.resetAllViews();

        } else {
            con.setIsVisible(false);
        }
    }

    private _updateGroupModePreview(): void {
        this._groupModePreview.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDrawTileBase(): void {
        this._groupModeDrawTileBase.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDrawTileDecoration(): void {
        this._groupModeDrawTileDecorator.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDeleteTileDecoration(): void {
        this._groupModeDeleteTileDecorator.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDrawTileObject(): void {
        this._groupModeDrawTileObject.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDeleteTileObject(): void {
        this._groupModeDeleteTileObject.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDrawUnit(): void {
        this._groupModeDrawUnit.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDeleteUnit(): void {
        this._groupModeDeleteUnit.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDrawLocation(): void {
        this._groupModeDrawLocation.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModeDeleteLocation(): void {
        this._groupModeDeleteLocation.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupCopyTile(): void {
        this._groupCopyTile.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModePasteTile(): void {
        this._groupModePasteTile.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupCopyUnit(): void {
        this._groupCopyUnit.setIsVisible(!this._getWar().getIsReviewingMap());
    }
    private _updateGroupModePasteUnit(): void {
        this._groupModePasteUnit.setIsVisible(!this._getWar().getIsReviewingMap());
    }

    private _updateLabelLocation(): void {
        const war               = this._getWar();
        const gridIndex         = war.getCursor().getGridIndex();
        const locationIdArray   = war.getTileMap().getTile(gridIndex).getLocationIdList(true);
        const textForGridIndex  = `x${gridIndex.getX()} y${gridIndex.getY()}`;
        const textForLocation   = locationIdArray.length ? locationIdArray.join(` `) : `--`;
        this._labelLocation.setText(`${textForGridIndex} ${Lang_Utils.getText(Lang_Constants.TextType.Location)}: ${textForLocation}`);
    }

    private _updateGroupAutoAdjust(): void {
        const btnOn     = this._btnAutoAdjustToggleOn;
        const btnOff    = this._btnAutoAdjustToggleOff;
        if (!LocalData_Storage.getShowMapEditorAutoAdjustToggle()) {
            btnOn.setIsVisible(false);
            btnOff.setIsVisible(false);
        } else {
            const isOn = this._getDrawer().getIsRealTimeAdjust();
            btnOn.setIsVisible(isOn);
            btnOff.setIsVisible(!isOn);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _initTileView(): void {
        const tileView = this._tileView;
        tileView.init({
            tileBaseType          : null,
            tileBaseShapeId       : null,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : null,
            tileObjectShapeId     : null,
            skinId                : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : this._getWar().getGcData(),
        });
        tileView.startRunningView();
    }
    private _initUnitView(): void {
        const war           = this._getWar();
        const unit          = new Units_Unit.Unit();
        const gameConfig    = war.getGcData();
        unit.init(Units_Utils_Serialization.createDefault({
            gridIndex   : { x : 0, y : 0 },
            unitId      : 0,
            unitTypeId  : gameConfig.getFirstUnitType(),
            playerIndex : Players_Constants.PlayerIndex.First,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);

        this._unitView.init(unit);
    }
}

interface DataForRecentRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                         : MapEditor_Interface_IMeWar.IMeWar;
    panel                       : Panel;
    dataForDrawUnit             : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapEditor_Model_MeTypes.DataForDrawUnit>;
    dataForDrawTileBase         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapEditor_Model_MeTypes.DataForDrawTileBase>;
    dataForDrawTileDecoration   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapEditor_Model_MeTypes.DataForDrawTileDecoration>;
    dataForDrawTileObject       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapEditor_Model_MeTypes.DataForDrawTileObject>;
}
class RecentRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRecentRenderer> {
    private readonly _conUnitView!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _unitView      = new Units_UnitView.UnitView();
    private readonly _tileView      = new Tiles_TileView.TileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TileAnimationTick",               callback : this._onNotifyTileAnimationTick },
            { type : "StateIndicatorTick",              callback : this._onNotifyStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch();

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        conTileView.addUiChild(tileView.getImgBuff());
        conTileView.addUiChild(tileView.getImgHighlight());
        this._conUnitView.addUiChild(this._unitView);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conUnitView       = this._conUnitView;
        const conTileView       = this._conTileView;
        const war               = openData.war;
        const gameConfig        = war.getGcData();
        const dataForDrawUnit   = openData.dataForDrawUnit;
        if (dataForDrawUnit != null) {
            conUnitView.setIsVisible(true);
            conTileView.setIsVisible(false);

            const unit = new Units_Unit.Unit();
            unit.init(Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                unitId      : 0,
                unitTypeId  : dataForDrawUnit.unitType,
                playerIndex : dataForDrawUnit.playerIndex,
                gcData      : gameConfig,
            }), gameConfig);
            unit.startRunning(war);

            const unitView  = this._unitView;
            unitView.init(unit);
            unitView.startRunningView();
        } else {
            conUnitView.setIsVisible(false);
            conTileView.setIsVisible(true);

            const dataForDrawTileBase       = openData.dataForDrawTileBase;
            const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
            const dataForDrawTileObject     = openData.dataForDrawTileObject;
            const playerIndex               = dataForDrawTileObject?.playerIndex ?? Players_Constants.PlayerIndex.Neutral;
            const tileData                  = Tiles_Utils_Serialization.create({
                baseType          : dataForDrawTileBase?.baseType ?? null,
                baseShapeId       : dataForDrawTileBase?.shapeId ?? null,
                decorationType    : dataForDrawTileDecoration?.decorationType ?? null,
                decorationShapeId : dataForDrawTileDecoration?.shapeId ?? null,
                objectType        : dataForDrawTileObject?.objectType ?? null,
                objectShapeId     : dataForDrawTileObject?.shapeId ?? null,
                playerIndex       : playerIndex,

                gridIndex              : { x : 0, y : 0 },
                isHighlighted          : null,
                customNameId           : null,
                groupedLocationIdArray : [],
                unfixedBuffArray       : [],

                currentBuildPoint   : null,
                currentCapturePoint : null,
                currentHp           : null,

                customBuildingData    : null,
                customCannonData      : null,
                customCrystalData     : null,
                customLaserTurretData : null,
            });
            Tiles_Utils_Serialization.fillNonTrivialDefaultValues(tileData, gameConfig);

            const tileView = this._tileView;
            tileView.setData({
                tileData         : tileData,
                skinId           : playerIndex,
                overridingSkinId : undefined,
                hasFog           : false,
                isFullReplay     : true,
                gameConfig       : gameConfig,
                themeType        : war.getInstanceWarRule().getWarRuleCommonData()?.getFixedTileTheme()
                    ?? Helpers_Misc.getExisted(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getTileTheme()),
            });
            tileView.updateView();
        }
    }

    private _onNotifyTileAnimationTick(): void {
        if (!this.getOpenData()?.dataForDrawUnit) {
            this._tileView.updateTileAnimation();
        }
    }
    private _onNotifyStateIndicatorTick(): void {
        if (!this.getOpenData()?.dataForDrawUnit) {
            this._tileView.updateImgBuff();
        }
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const drawer                    = openData.war.getDrawer();
        const dataForDrawUnit           = openData.dataForDrawUnit;
        const dataForDrawTileBase       = openData.dataForDrawTileBase;
        const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
        const dataForDrawTileObject     = openData.dataForDrawTileObject;
        if (dataForDrawUnit) {
            drawer.setModeDrawUnit(dataForDrawUnit);
        } else if (dataForDrawTileBase) {
            drawer.setModeDrawTileBase(dataForDrawTileBase);
        } else if (dataForDrawTileDecoration) {
            drawer.setModeDrawTileDecoration(dataForDrawTileDecoration);
        } else if (dataForDrawTileObject) {
            drawer.setModeDrawTileObject(dataForDrawTileObject);
        }
    }
}
