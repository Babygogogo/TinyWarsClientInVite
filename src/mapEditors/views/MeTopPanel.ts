import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameConfigGcMapEditor from "../../gameConfig/GcMapEditor.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersCompatibility from "../../helpers/Compatibility.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage from "../../localData/Storage.ts";
import type * as MapEditorInterfaceIMeDrawer from "../../mapEditor/interface/IMeDrawer.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import * as NormalMapModelNormalMapProxy from "../../normalMap/model/NormalMapProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmReviewMapS from "../../proto/schema/CommonProto/NetMessage/MsgMmReviewMap/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesUtilsSerialization from "../../tiles/utils/Serialization.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

const MaxLengthForListRecent = 30;

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupRight!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupModeButton!              : UiInterfacesIUiLayout.IUiLayout;
    // private readonly _labelMode!                    : Ui.Interfaces.IUiLabel;
    private readonly _conUnitView!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _conTileView!                  : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupRecent!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listRecent!                   : UiInterfacesIUiScrollList.IUiScrollList<DataForRecentRenderer>;
    private readonly _btnUndo!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRedo!                      : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModePreview!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModePreview!               : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDrawTileBase!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDrawTileBase!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDrawTileDecorator!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDrawTileDecorator!     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDeleteTileDecorator! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDeleteTileDecorator!   : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDrawTileObject!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDrawTileObject!        : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDeleteTileObject!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDeleteTileObject!      : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDrawUnit!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDrawUnit!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDeleteUnit!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDeleteUnit!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDrawLocation!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDrawLocation!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModeDeleteLocation!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModeDeleteLocation!        : UiInterfacesIUiButton.IUiButton;

    private readonly _groupCopyTile!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCopyTile!                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModePasteTile!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModePasteTile!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupCopyUnit!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCopyUnit!                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupModePasteUnit!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModePasteUnit!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupLeftButtons!             : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSaveMap!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLoadMap!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnReviewAccept!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnReviewReject!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnWarRule!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnWarEvent!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMapInfo!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnVisibility!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSymmetry!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChat!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMenu!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _groupAutoAdjust!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnAutoAdjust!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAutoAdjustToggleOn!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAutoAdjustToggleOff!       : UiInterfacesIUiButton.IUiButton;

    private readonly _labelLocation!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMouseHover!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView                      = new (GameHelpersGhFactory.getUnitViewClass())();
    private readonly _tileView                      = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TimeTick,                            callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,                   callback: this._onNotifyTileAnimationTick },
            { type: NotificationsTypeId.TypeId.MeDrawerModeChanged,                 callback: this._onNotifyMeDrawerModeChanged },
            { type: NotificationsTypeId.TypeId.MeAutoAdjustToggleVisibilityChanged, callback: this._onNotifyMeAutoAdjustToggleVisibilityChanged },
            { type: NotificationsTypeId.TypeId.MeRealTimeAdjustChanged,             callback: this._onNotifyMeRealTimeAdjustChanged },
            { type: NotificationsTypeId.TypeId.BwCursorGridIndexChanged,            callback: this._onNotifyBwCursorGridIndexChanged },
            { type: NotificationsTypeId.TypeId.BwTileHasLocationIdSet,              callback: this._onNotifyBwTileLocationFlatSet },
            { type: NotificationsTypeId.TypeId.MsgMeSubmitNormalMap,                callback: this._onNotifyMsgMeSubmitNormalMap },
            { type: NotificationsTypeId.TypeId.MsgMmReviewMap,                      callback: this._onNotifyMsgMmReviewMap },
            { type: NotificationsTypeId.TypeId.MsgMeDeleteSlot,                     callback: this._onNotifyMsgMeDeleteSlot },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignMapRawData,          callback: this._onNotifyMsgCmSetCampaignMapRawData },
        ]);
        this._setUiListenerArray([
            { ui: this._groupModePreview,               callback: this._onTouchedGroupModePreview },
            { ui: this._groupModeDrawTileBase,          callback: this._onTouchedGroupModeDrawTileBase },
            { ui: this._groupModeDrawTileDecorator,     callback: this._onTouchedGroupModeDrawTileDecoration },
            { ui: this._groupModeDeleteTileDecorator,   callback: this._onTouchedGroupModeDeleteTileDecoration },
            { ui: this._groupModeDrawTileObject,        callback: this._onTouchedGroupModeDrawTileObject },
            { ui: this._groupModeDeleteTileObject,      callback: this._onTouchedGroupModeDeleteTileObject },
            { ui: this._groupModeDrawUnit,              callback: this._onTouchedGroupModeDrawUnit },
            { ui: this._groupModeDeleteUnit,            callback: this._onTouchedGroupModeDeleteUnit },
            { ui: this._groupModeDrawLocation,          callback: this._onTouchedGroupModeDrawLocation },
            { ui: this._groupModeDeleteLocation,        callback: this._onTouchedGroupModeDeleteLocation },
            { ui: this._groupCopyTile,                  callback: this._onTouchedGroupCopyTile },
            { ui: this._groupModePasteTile,             callback: this._onTouchedGroupModePasteTile },
            { ui: this._groupCopyUnit,                  callback: this._onTouchedGroupCopyUnit },
            { ui: this._groupModePasteUnit,             callback: this._onTouchedGroupModePasteUnit },

            { ui: this._btnUndo,                        callback: this._onTouchedBtnUndo },
            { ui: this._btnRedo,                        callback: this._onTouchedBtnRedo },
            { ui: this._btnSaveMap,                     callback: this._onTouchedBtnSaveMap },
            { ui: this._btnLoadMap,                     callback: this._onTouchedBtnLoadMap },
            { ui: this._btnReviewAccept,                callback: this._onTouchedBtnReviewAccept },
            { ui: this._btnReviewReject,                callback: this._onTouchedBtnReviewReject },
            { ui: this._btnWarRule,                     callback: this._onTouchedBtnWarRule },
            { ui: this._btnWarEvent,                    callback: this._onTouchedBtnWarEvent },
            { ui: this._btnMapInfo,                     callback: this._onTouchedBtnMapInfo },
            { ui: this._btnVisibility,                  callback: this._onTouchedBtnVisibility },
            { ui: this._btnSymmetry,                    callback: this._onTouchedBtnSymmetry },
            { ui: this._btnChat,                        callback: this._onTouchedBtnChat },
            { ui: this._btnMenu,                        callback: this._onTouchedBtnMenu, },
            { ui: this._btnAutoAdjust,                  callback: this._onTouchedBtnAutoAdjust },
            { ui: this._btnAutoAdjustToggleOn,          callback: this._onTouchedBtnAutoAdjustToggleOn },
            { ui: this._btnAutoAdjustToggleOff,         callback: this._onTouchedBtnAutoAdjustToggleOff },
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

    private _getWar(): MapEditorInterfaceIMeWar.IMeWar {
        return HelpersMisc.getExisted(MapEditorModelMeModel.getWar());
    }
    private _getDrawer(): MapEditorInterfaceIMeDrawer.IMeDrawer {
        return this._getWar().getDrawer();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void  {
        this._updateComponentsForLanguage();
    }
    private async _onNotifyTimeTick(): Promise<void> {
        const autoSaveTime = UsersModel.getSelfMapEditorAutoSaveTime();
        if ((!autoSaveTime) || (TimerTimerModel.getServerTimestamp() % autoSaveTime !== 0)) {
            return;
        }

        const war = MapEditorModelMeModel.getWar();
        if ((war == null) || (!war.getIsMapModified()) || (war.getIsReviewingMap())) {
            return;
        }

        const slotIndex = war.getMapSlotIndex();
        if (slotIndex === await MapEditorModelMeModel.getReviewingMapSlotIndex()) {
            return;
        }

        const mapRawData = await war.serializeForMap();
        if (await MapEditorModelMeHelpers.getCriticalErrorCodeForMapRawData(mapRawData)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0304));
        } else {
            MapEditorModelMeProxy.reqMeSubmitNormalMap({
                slotIndex                   : slotIndex,
                mapRawData                  : mapRawData,
                needReview                  : false,
                srcNormalMapIdForAddEvent   : war.getSrcNormalMapIdForAddEvent(),
                gridMarkData                : war.getGridMarkData(),
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
        const dataArray = HelpersCollection.getNonNullElements(list.getBoundDataArray() ?? []);
        if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileBase) {
            const dataForDrawTileBase   = HelpersMisc.getExisted(drawer.getDrawTargetTileBaseData());
            const newDataArray          = dataArray?.filter(v => {
                const existingData = v?.dataForDrawTileBase;
                return (existingData == null) || (existingData.baseType !== dataForDrawTileBase.baseType) || (existingData.shapeId !== dataForDrawTileBase.shapeId);
            }) ?? [];
            newDataArray.splice(0, 0, {
                war                         : war,
                dataForDrawTileBase         : dataForDrawTileBase,
                dataForDrawTileDecoration   : null,
                dataForDrawTileObject       : null,
                dataForDrawUnit             : null,
                panel                       : this,
            });
            newDataArray.length = Math.min(MaxLengthForListRecent, newDataArray.length);
            await list.bindData(newDataArray);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileDecoration) {
            const dataForDrawTileDecoration = HelpersMisc.getExisted(drawer.getDrawTargetTileDecorationData());
            const newDataArray              = dataArray?.filter(v => {
                const existingData  = v.dataForDrawTileDecoration;
                return (existingData == null) || (existingData.decorationType !== dataForDrawTileDecoration.decorationType) || (existingData.shapeId !== dataForDrawTileDecoration.shapeId);
            }) ?? [];
            newDataArray.splice(0, 0, {
                war                         : war,
                dataForDrawTileBase         : null,
                dataForDrawTileDecoration   : dataForDrawTileDecoration,
                dataForDrawTileObject       : null,
                dataForDrawUnit             : null,
                panel                       : this,
            });
            newDataArray.length = Math.min(MaxLengthForListRecent, newDataArray.length);
            await list.bindData(newDataArray);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileObject) {
            const dataForDrawTileObject = HelpersMisc.getExisted(drawer.getDrawTargetTileObjectData());
            const newDataArray          = dataArray?.filter(v => {
                const existingData = v.dataForDrawTileObject;
                return (existingData == null)
                    || (existingData.objectType !== dataForDrawTileObject.objectType)
                    || (existingData.shapeId !== dataForDrawTileObject.shapeId)
                    || (existingData.playerIndex !== dataForDrawTileObject.playerIndex);
            }) ?? [];
            newDataArray.splice(0, 0, {
                war                         : war,
                dataForDrawTileBase         : null,
                dataForDrawTileDecoration   : null,
                dataForDrawTileObject       : dataForDrawTileObject,
                dataForDrawUnit             : null,
                panel                       : this,
            });
            newDataArray.length = Math.min(MaxLengthForListRecent, newDataArray.length);
            await list.bindData(newDataArray);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawUnit) {
            const targetUnit    = HelpersMisc.getExisted(drawer.getDrawTargetUnit());
            const unitType      = targetUnit.getUnitType();
            const playerIndex   = targetUnit.getPlayerIndex();
            const newDataArray  = dataArray?.filter(v => {
                const existingData = v.dataForDrawUnit;
                return (existingData == null) || (existingData.playerIndex !== playerIndex) || (existingData.unitType !== unitType);
            }) ?? [];
            newDataArray.splice(0, 0, {
                war                         : war,
                dataForDrawTileBase         : null,
                dataForDrawTileDecoration   : null,
                dataForDrawTileObject       : null,
                dataForDrawUnit             : { playerIndex: playerIndex, unitType: unitType },
                panel                       : this,
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
    private _onNotifyMsgMeSubmitNormalMap(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS.S;
        if (!data.getNeedReview()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0085));
        } else {
            const errorCode = data.getMapRawDataErrorCode();
            if (errorCode) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0197));
                FloatText2.show(LangUtils.getErrorText(errorCode));
            } else {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0244));
            }
        }

        this._getWar().setIsMapModified(false);
    }
    private _onNotifyMsgMmReviewMap(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmReviewMapS.S;
        if (data.getIsAccept()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0092));
        } else {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0093));
        }
        HelpersGameFlow.gotoLobby();
    }
    private _onNotifyMsgMeDeleteSlot(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0081));
        HelpersGameFlow.gotoMyWarListPanel(WarTypesConstants.WarTypeId.Me);
    }
    private _onNotifyMsgCmSetCampaignMapRawData(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onEnterFrame(): void {
        const label = this._labelMouseHover;
        if (!HelpersCompatibility.isPc) {
            label.setIsVisible(false);
            return;
        }

        const x = HelpersPointerInput.getMouseX();
        const y = HelpersPointerInput.getMouseY();
        if ((x == null) || (y == null)) {
            label.setIsVisible(false);
            return;
        }

        const war       = this._getWar();
        const gridIndex = AuxiliaryTypesGridIndex.GridIndex.createGridIndexByPoint(war.getView().getFieldContainer().getContentsContainerGlobalToLocal({ x, y }));
        label.setIsVisible(true);
        if (!gridIndex.checkIsInsideMap(war.getTileMap().getMapSize())) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B1112)}: --`);
        } else {
            const locationIdArray   = war.getTileMap().getTile(gridIndex).getLocationIdList(true);
            const textForGridIndex  = `x${gridIndex.getX()} y${gridIndex.getY()}`;
            const textForLocation   = locationIdArray.length ? locationIdArray.join(` `) : `--`;
            label.setText(`${LangUtils.getText(LangConstants.TextType.B1112)}: ${textForGridIndex}, ${LangUtils.getText(LangConstants.TextType.Location)}: ${textForLocation}`);
        }
    }

    private _onTouchedGroupModePreview(): void {
        this._getDrawer().setModePreview();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileBase(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseTileBasePanel, { war: this._getWar() });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileDecoration(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseTileDecorationPanel, { war: this._getWar() });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileObject(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseTileObjectPanel, { war: this._getWar() });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawUnit(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseUnitPanel, { war: this._getWar() });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteTileObject(): void {
        this._getDrawer().setModeDeleteTileObject();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawLocation(): void {
        const war = this._getWar();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility    : true,
            currentGroupedLocationIds       : war.getTileMap().getVisibleGroupedLocationIdArray().concat(),
            war                             : war,
            getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0759),
            callback                        : locationIdArray => {
                if (!locationIdArray.length) {
                    FloatText2.show(LangUtils.getText(LangConstants.TextType.A0266));
                } else {
                    war.getDrawer().setModeAddTileToLocation({ locationIdArray });
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteLocation(): void {
        const war = this._getWar();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility    : true,
            currentGroupedLocationIds       : war.getTileMap().getVisibleGroupedLocationIdArray().concat(),
            war                             : war,
            getTitleText                    : () => LangUtils.getText(LangConstants.TextType.B0760),
            callback                        : locationIdArray => {
                if (!locationIdArray.length) {
                    FloatText2.show(LangUtils.getText(LangConstants.TextType.A0266));
                } else {
                    war.getDrawer().setModeDeleteTileFromLocation({ locationIdArray });
                }
            },
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupCopyTile(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const war = this._getWar();
        war.getDrawer().setDataForPasteTile(war.getTileMap().getTile(war.getCursor().getGridIndex()).serialize());
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0369));
    }
    private _onTouchedGroupModePasteTile(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const drawer    = this._getWar().getDrawer();
        const data      = drawer.getDataForPasteTile();
        if (data == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0371));
        } else {
            drawer.setModePasteTile();
        }
    }
    private _onTouchedGroupCopyUnit(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const war       = this._getWar();
        const unitMap   = war.getUnitMap();
        const unit      = unitMap.getUnitOnMap(war.getCursor().getGridIndex());
        if (unit == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0373));
            return;
        }

        const dataArray = [unit.clone()];
        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
            dataArray.push(loadedUnit.clone());
        }
        war.getDrawer().setDataForPasteUnit(dataArray);
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0370));
    }
    private _onTouchedGroupModePasteUnit(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const drawer    = this._getWar().getDrawer();
        const data      = drawer.getDataForPasteUnit();
        if (data == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0372));
        } else {
            drawer.setModePasteUnit();
        }
    }

    private _onTouchedBtnUndo(): void {
        const war = this._getWar();
        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.A0318);
        } else {
            war.getDrawer().loadPreviousCheckpoint();
        }
    }
    private _onTouchedBtnRedo(): void {
        const war = this._getWar();
        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.A0319);
        } else {
            war.getDrawer().loadNextCheckpoint();
        }
    }

    private _onTouchedBtnSaveMap(): void {
        const war = this._getWar();
        if (war.getCampaignMapData()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeSaveCampaignMapPanel, {
                war     : war,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeSaveNormalMapPanel, {
                war     : war,
            });
        }
    }
    private _onTouchedBtnLoadMap(): void {
        const war = this._getWar();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0072),
            callback: async () => {
                const slotIndex     = war.getMapSlotIndex();
                const gameConfig    = war.getGcData();
                const mapEditorData = await MapEditorModelMeModel.getMapEditorData(slotIndex);
                war.stopRunning();
                await war.initWithMapRawData({
                    mapRawData                  : mapEditorData?.mapRawData ?? await MapEditorModelMeHelpers.createDefaultMapRawData(slotIndex, gameConfig),
                    slotIndex                   : slotIndex,
                    gameConfig                  : gameConfig,
                    srcNormalMapIdForAddEvent   : mapEditorData?.srcNormalMapIdForAddEvent ?? null,
                    gridMarkData                : mapEditorData?.gridMarkData,
                });
                war.setIsMapModified(false);
                war.startRunning()
                    .startRunningView();
            },
        });
    }
    private _onTouchedBtnReviewAccept(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0296),
            tips            : LangUtils.getText(LangConstants.TextType.A0105),
            currentValue    : ``,
            canBeEmpty      : true,
            isMultiLine     : true,
            maxChars        : GameConfigGcMap.Constants.MaxReviewCommentLength,
            charRestrict    : null,
            callback        : panel => {
                const war       = this._getWar();
                const callback  = () => {
                    NormalMapModelNormalMapProxy.reqMmReviewMap({
                        designerUserId  : war.getMapDesignerUserId(),
                        slotIndex       : war.getMapSlotIndex(),
                        modifiedTime    : war.getMapModifiedTime(),
                        isAccept        : true,
                        reviewComment   : panel.getInputText(),
                    });
                };
                if (!war.getTemplateWarRuleArray().some(v => v.getRuleAvailability()?.getCanMrw())) {
                    callback();
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent     : () => LangUtils.getText(LangConstants.TextType.A0296),
                        callback    : callback,
                    });
                }
            },
        });
    }
    private _onTouchedBtnReviewReject(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0297),
            tips            : LangUtils.getText(LangConstants.TextType.A0094),
            currentValue    : ``,
            canBeEmpty      : true,
            isMultiLine     : true,
            maxChars        : GameConfigGcMap.Constants.MaxReviewCommentLength,
            charRestrict    : null,
            callback        : panel => {
                const war = this._getWar();
                NormalMapModelNormalMapProxy.reqMmReviewMap({
                    designerUserId  : war.getMapDesignerUserId(),
                    slotIndex       : war.getMapSlotIndex(),
                    modifiedTime    : war.getMapModifiedTime(),
                    isAccept        : false,
                    reviewComment   : panel.getInputText(),
                });
            },
        });
    }
    private _onTouchedBtnWarRule(): void {
        const war = this._getWar();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeWarRulePanel, { war: war });
    }
    private _onTouchedBtnWarEvent(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeMainPanel, {
            war: this._getWar(),
        });
    }
    private _onTouchedBtnMapInfo(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeMapInfoPanel, {
            war     : this._getWar(),
        });
    }
    private _onTouchedGroupModeDeleteTileDecoration(): void {
        this._getDrawer().setModeDeleteTileDecoration();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteUnit(): void {
        this._getDrawer().setModeDeleteUnit();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnVisibility(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeVisibilityPanel, void 0);
    }
    private _onTouchedBtnSymmetry(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeSymmetryPanel, {
            war: this._getWar(),
        });
    }
    private _onTouchedBtnChat(): void {
        const war = this._getWar();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({
            toMapReviewTarget: war.getIsReviewingMap()
            ? war.getMapDesignerUserId()
            : HelpersMisc.getExisted(UsersModel.getSelfUserId())
        }) });
    }
    private _onTouchedBtnMenu(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeWarMenuPanel, { war: this._getWar() });
    }
    private _onTouchedBtnAutoAdjust(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeAutoAdjustPanel,  {
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
        this._btnModePreview.setLangText(LangConstants.TextType.B0286);
        this._btnModeDrawTileBase.setLangText(LangConstants.TextType.B0282);
        this._btnModeDeleteTileDecorator.setLangText(LangConstants.TextType.B0661);
        this._btnModeDrawUnit.setLangText(LangConstants.TextType.B0281);
        this._btnModeDrawTileDecorator.setLangText(LangConstants.TextType.B0662);
        this._btnModeDrawTileObject.setLangText(LangConstants.TextType.B0283);
        this._btnModeDeleteUnit.setLangText(LangConstants.TextType.B0284);
        this._btnModeDeleteTileObject.setLangText(LangConstants.TextType.B0285);
        this._btnModeDrawLocation.setLangText(LangConstants.TextType.B0759);
        this._btnModeDeleteLocation.setLangText(LangConstants.TextType.B0760);
        this._btnCopyTile.setLangText(LangConstants.TextType.B0993);
        this._btnModePasteTile.setLangText(LangConstants.TextType.B0994);
        this._btnCopyUnit.setLangText(LangConstants.TextType.B0995);
        this._btnModePasteUnit.setLangText(LangConstants.TextType.B0996);
        this._btnSaveMap.setLangText(LangConstants.TextType.B0287);
        this._btnLoadMap.setLangText(LangConstants.TextType.B0288);
        this._btnReviewAccept.setLangText(LangConstants.TextType.B0296);
        this._btnReviewReject.setLangText(LangConstants.TextType.B0297);
        this._btnWarRule.setLangText(LangConstants.TextType.B0314);
        this._btnWarEvent.setLangText(LangConstants.TextType.B0461);
        this._btnMapInfo.setLangText(LangConstants.TextType.B0298);
        this._btnVisibility.setLangText(LangConstants.TextType.B0301);
        this._btnSymmetry.setLangText(LangConstants.TextType.B0306);
        this._btnChat.setLangText(LangConstants.TextType.B0383);
        this._btnMenu.setLangText(LangConstants.TextType.B0155);
        this._btnAutoAdjust.setLangText(LangConstants.TextType.B1451);
        this._btnAutoAdjustToggleOn.setLangText(LangConstants.TextType.B0890);
        this._btnAutoAdjustToggleOff.setLangText(LangConstants.TextType.B0890);
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

        this._groupModePreview.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.Preview ? 80 : 70);
        this._groupModeDrawTileBase.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DrawTileBase ? 80 : 70);
        this._groupModeDrawTileDecorator.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DrawTileDecoration ? 80 : 70);
        this._groupModeDeleteTileDecorator.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DeleteTileDecoration ? 80 : 70);
        this._groupModeDrawTileObject.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DrawTileObject ? 80 : 70);
        this._groupModeDeleteTileObject.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DeleteTileObject ? 80 : 70);
        this._groupModeDrawUnit.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DrawUnit ? 80 : 70);
        this._groupModeDeleteUnit.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DeleteUnit ? 80 : 70);
        this._groupModeDrawLocation.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.AddTileToLocation ? 80 : 70);
        this._groupModeDeleteLocation.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.DeleteTileFromLocation ? 80 : 70);
        this._groupModePasteTile.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.PasteTile ? 80 : 70);
        this._groupModePasteUnit.setUnscaledManualWidth(mode === GameConfigGcMapEditor.DrawerMode.PasteUnit ? 80 : 70);

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
        if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileBase) {
            con.setIsVisible(true);

            const tileBaseData = HelpersMisc.getExisted(drawer.getDrawTargetTileBaseData());
            tileView.init({
                tileBaseShapeId         : tileBaseData.shapeId,
                tileBaseType            : tileBaseData.baseType,
                tileDecorationType      : null,
                tileDecorationShapeId   : null,
                tileObjectShapeId       : null,
                tileObjectType          : null,
                skinId                  : PlayersConstants.PlayerIndex.Neutral,
                overridingSkinId        : undefined,
                gameConfig              : gameConfig,
            });
            tileView.updateView();

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileDecoration) {
            con.setIsVisible(true);

            const tileDecorationData = HelpersMisc.getExisted(drawer.getDrawTargetTileDecorationData());
            tileView.init({
                tileBaseShapeId         : null,
                tileBaseType            : null,
                tileDecorationType      : tileDecorationData.decorationType,
                tileDecorationShapeId   : tileDecorationData.shapeId,
                tileObjectShapeId       : null,
                tileObjectType          : null,
                skinId                  : PlayersConstants.PlayerIndex.Neutral,
                overridingSkinId        : undefined,
                gameConfig              : gameConfig,
            });
            tileView.updateView();

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileObject) {
            con.setIsVisible(true);

            const tileObjectData = HelpersMisc.getExisted(drawer.getDrawTargetTileObjectData());
            tileView.init({
                tileBaseShapeId         : null,
                tileBaseType            : null,
                tileDecorationType      : null,
                tileDecorationShapeId   : null,
                tileObjectShapeId       : tileObjectData.shapeId,
                tileObjectType          : tileObjectData.objectType,
                skinId                  : tileObjectData.playerIndex,
                overridingSkinId        : undefined,
                gameConfig              : gameConfig,
            });
            tileView.updateView();

        } else if (mode === GameConfigGcMapEditor.DrawerMode.PasteTile) {
            con.setIsVisible(true);

            const data = HelpersMisc.getExisted(drawer.getDataForPasteTile());
            tileView.init({
                tileBaseShapeId         : data.getBaseShapeId() ?? 0,
                tileBaseType            : data.getBaseType() ?? 0,
                tileDecorationType      : data.getDecorationType() ?? 0,
                tileDecorationShapeId   : data.getDecorationShapeId() ?? 0,
                tileObjectShapeId       : data.getObjectShapeId() ?? 0,
                tileObjectType          : data.getObjectType() ?? 0,
                skinId                  : ForceSkinsUtils.getDefaultSkinId(data.getPlayerIndex() ?? 0),
                overridingSkinId        : undefined,
                gameConfig              : gameConfig,
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
        if (drawMode === GameConfigGcMapEditor.DrawerMode.DrawUnit) {
            con.setIsVisible(true);
            unitView.init(HelpersMisc.getExisted(drawer.getDrawTargetUnit()));
            unitView.resetAllViews();

        } else if (drawMode === GameConfigGcMapEditor.DrawerMode.PasteUnit) {
            con.setIsVisible(true);
            unitView.init(HelpersMisc.getExisted(drawer.getDataForPasteUnit())[0]);
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
        this._labelLocation.setText(`${textForGridIndex} ${LangUtils.getText(LangConstants.TextType.Location)}: ${textForLocation}`);
    }

    private _updateGroupAutoAdjust(): void {
        const btnOn     = this._btnAutoAdjustToggleOn;
        const btnOff    = this._btnAutoAdjustToggleOff;
        if (!LocalDataStorage.getShowMapEditorAutoAdjustToggle()) {
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
            tileBaseType            : null,
            tileBaseShapeId         : null,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : null,
            tileObjectShapeId       : null,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : this._getWar().getGcData(),
        });
        tileView.startRunningView();
    }
    private _initUnitView(): void {
        const war           = this._getWar();
        const unit          = new (GameHelpersGhFactory.getUnitClass())();
        const gameConfig    = war.getGcData();
        unit.init(UnitsUtilsSerialization.createDefault({
            gridIndex   : { x: 0, y: 0 },
            unitId      : 0,
            unitTypeId  : gameConfig.getFirstUnitType(),
            playerIndex : PlayersConstants.PlayerIndex.First,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);

        this._unitView.init(unit);
    }
}

interface DataForRecentRenderer extends UiTypesUiListItemData.UiListItemData {
    war                         : MapEditorInterfaceIMeWar.IMeWar;
    panel                       : Panel;
    dataForDrawUnit             : AuxiliaryTypesAuxiliaryTypes.Undefinable<MapEditorModelMeTypes.DataForDrawUnit>;
    dataForDrawTileBase         : AuxiliaryTypesAuxiliaryTypes.Undefinable<MapEditorModelMeTypes.DataForDrawTileBase>;
    dataForDrawTileDecoration   : AuxiliaryTypesAuxiliaryTypes.Undefinable<MapEditorModelMeTypes.DataForDrawTileDecoration>;
    dataForDrawTileObject       : AuxiliaryTypesAuxiliaryTypes.Undefinable<MapEditorModelMeTypes.DataForDrawTileObject>;
}
class RecentRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRecentRenderer> {
    private readonly _conUnitView!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;

    private readonly _unitView      = new (GameHelpersGhFactory.getUnitViewClass())();
    private readonly _tileView      = new (GameHelpersGhFactory.getTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,              callback: this._onNotifyStateIndicatorTick },
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

            const unit = new (GameHelpersGhFactory.getUnitClass())();
            unit.init(UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
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
            const playerIndex               = dataForDrawTileObject?.playerIndex ?? PlayersConstants.PlayerIndex.Neutral;
            const tileData                  = TilesUtilsSerialization.create({
                baseType                : dataForDrawTileBase?.baseType ?? null,
                baseShapeId             : dataForDrawTileBase?.shapeId ?? null,
                decorationType          : dataForDrawTileDecoration?.decorationType ?? null,
                decorationShapeId       : dataForDrawTileDecoration?.shapeId ?? null,
                objectType              : dataForDrawTileObject?.objectType ?? null,
                objectShapeId           : dataForDrawTileObject?.shapeId ?? null,
                playerIndex             : playerIndex,

                gridIndex               : { x: 0, y: 0 },
                isHighlighted           : null,
                customNameId            : null,
                groupedLocationIdArray  : [],
                unfixedBuffArray        : [],

                currentBuildPoint       : null,
                currentCapturePoint     : null,
                currentHp               : null,

                customBuildingData      : null,
                customCannonData        : null,
                customCrystalData       : null,
                customLaserTurretData   : null,
            });
            TilesUtilsSerialization.fillNonTrivialDefaultValues(tileData, gameConfig);

            const tileView = this._tileView;
            tileView.setData({
                tileData            : tileData,
                skinId              : playerIndex,
                overridingSkinId    : undefined,
                hasFog              : false,
                isFullReplay        : true,
                gameConfig          : gameConfig,
                themeType           : war.getInstanceWarRule().getWarRuleCommonData()?.getFixedTileTheme()
                    ?? HelpersMisc.getExisted(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getTileTheme()),
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
