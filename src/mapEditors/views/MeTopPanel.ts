import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import {
    show,
    showLang,
} from "../../FloatText.ts";
import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
import { Common } from "../../maps/Constants.ts";
import { DrawerMode } from "../Constants.ts";
import {
    getUnitViewClass,
    getUnitClass,
    getTileViewClass,
} from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { isPc } from "../../helpers/Compatibility.ts";
import {
    gotoLobby,
    gotoMyWarListPanel,
} from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    getMouseX,
    getMouseY,
} from "../../helpers/PointerInput.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getErrorText,
} from "../../lang/Utils.ts";
import { getShowMapEditorAutoAdjustToggle } from "../../localData/Storage.ts";
import type { IMeDrawer } from "../../mapEditor/interface/IMeDrawer.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import {
    getCriticalErrorCodeForMapRawData,
    createDefaultMapRawData,
} from "../../mapEditor/model/MeHelpers.ts";
import {
    getWar,
    getReviewingMapSlotIndex,
    getMapEditorData,
} from "../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import type {
    DataForDrawUnit,
    DataForDrawTileBase,
    DataForDrawTileDecoration,
    DataForDrawTileObject,
} from "../../mapEditor/model/MeTypes.ts";
import { reqMmReviewMap } from "../../normalMap/model/NormalMapProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type { S as MmReviewMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmReviewMap/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import {
    create,
    fillNonTrivialDefaultValues,
} from "../../tiles/utils/Serialization.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import { createDefault } from "../../units/utils/Serialization.ts";
import {
    getSelfMapEditorAutoSaveTime,
    getSelfUserId,
} from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

const MaxLengthForListRecent = 30;

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupRight!                   : IUiContainer;
    private readonly _groupModeButton!              : IUiLayout;
    // private readonly _labelMode!                    : Ui.Interfaces.IUiLabel;
    private readonly _conUnitView!                  : IUiContainer;
    private readonly _conTileView!                  : IUiContainer;

    private readonly _groupRecent!                  : IUiContainer;
    private readonly _listRecent!                   : IUiScrollList<DataForRecentRenderer>;
    private readonly _btnUndo!                      : IUiButton;
    private readonly _btnRedo!                      : IUiButton;

    private readonly _groupModePreview!             : IUiContainer;
    private readonly _btnModePreview!               : IUiButton;

    private readonly _groupModeDrawTileBase!        : IUiContainer;
    private readonly _btnModeDrawTileBase!          : IUiButton;

    private readonly _groupModeDrawTileDecorator!   : IUiContainer;
    private readonly _btnModeDrawTileDecorator!     : IUiButton;

    private readonly _groupModeDeleteTileDecorator! : IUiContainer;
    private readonly _btnModeDeleteTileDecorator!   : IUiButton;

    private readonly _groupModeDrawTileObject!      : IUiContainer;
    private readonly _btnModeDrawTileObject!        : IUiButton;

    private readonly _groupModeDeleteTileObject!    : IUiContainer;
    private readonly _btnModeDeleteTileObject!      : IUiButton;

    private readonly _groupModeDrawUnit!            : IUiContainer;
    private readonly _btnModeDrawUnit!              : IUiButton;

    private readonly _groupModeDeleteUnit!          : IUiContainer;
    private readonly _btnModeDeleteUnit!            : IUiButton;

    private readonly _groupModeDrawLocation!        : IUiContainer;
    private readonly _btnModeDrawLocation!          : IUiButton;

    private readonly _groupModeDeleteLocation!      : IUiContainer;
    private readonly _btnModeDeleteLocation!        : IUiButton;

    private readonly _groupCopyTile!                : IUiContainer;
    private readonly _btnCopyTile!                  : IUiButton;

    private readonly _groupModePasteTile!           : IUiContainer;
    private readonly _btnModePasteTile!             : IUiButton;

    private readonly _groupCopyUnit!                : IUiContainer;
    private readonly _btnCopyUnit!                  : IUiButton;

    private readonly _groupModePasteUnit!           : IUiContainer;
    private readonly _btnModePasteUnit!             : IUiButton;

    private readonly _groupLeftButtons!             : IUiLayout;
    private readonly _btnSaveMap!                   : IUiButton;
    private readonly _btnLoadMap!                   : IUiButton;
    private readonly _btnReviewAccept!              : IUiButton;
    private readonly _btnReviewReject!              : IUiButton;
    private readonly _btnWarRule!                   : IUiButton;
    private readonly _btnWarEvent!                  : IUiButton;
    private readonly _btnMapInfo!                   : IUiButton;
    private readonly _btnVisibility!                : IUiButton;
    private readonly _btnSymmetry!                  : IUiButton;
    private readonly _btnChat!                      : IUiButton;
    private readonly _btnMenu!                      : IUiButton;
    private readonly _groupAutoAdjust!              : IUiLayout;
    private readonly _btnAutoAdjust!                : IUiButton;
    private readonly _btnAutoAdjustToggleOn!        : IUiButton;
    private readonly _btnAutoAdjustToggleOff!       : IUiButton;

    private readonly _labelLocation!                : IUiLabel;
    private readonly _labelMouseHover!              : IUiLabel;

    private readonly _unitView                      = new (getUnitViewClass())();
    private readonly _tileView                      = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.TimeTick,                            callback: this._onNotifyTimeTick },
            { type: TypeId.TileAnimationTick,                   callback: this._onNotifyTileAnimationTick },
            { type: TypeId.MeDrawerModeChanged,                 callback: this._onNotifyMeDrawerModeChanged },
            { type: TypeId.MeAutoAdjustToggleVisibilityChanged, callback: this._onNotifyMeAutoAdjustToggleVisibilityChanged },
            { type: TypeId.MeRealTimeAdjustChanged,             callback: this._onNotifyMeRealTimeAdjustChanged },
            { type: TypeId.BwCursorGridIndexChanged,            callback: this._onNotifyBwCursorGridIndexChanged },
            { type: TypeId.BwTileHasLocationIdSet,              callback: this._onNotifyBwTileLocationFlatSet },
            { type: TypeId.MsgMeSubmitNormalMap,                callback: this._onNotifyMsgMeSubmitNormalMap },
            { type: TypeId.MsgMmReviewMap,                      callback: this._onNotifyMsgMmReviewMap },
            { type: TypeId.MsgMeDeleteSlot,                     callback: this._onNotifyMsgMeDeleteSlot },
            { type: TypeId.MsgCmSetCampaignMapRawData,          callback: this._onNotifyMsgCmSetCampaignMapRawData },
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

    private _getWar(): IMeWar {
        return getExisted(getWar());
    }
    private _getDrawer(): IMeDrawer {
        return this._getWar().getDrawer();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void  {
        this._updateComponentsForLanguage();
    }
    private async _onNotifyTimeTick(): Promise<void> {
        const autoSaveTime = getSelfMapEditorAutoSaveTime();
        if ((!autoSaveTime) || (getServerTimestamp() % autoSaveTime !== 0)) {
            return;
        }

        const war = getWar();
        if ((war == null) || (!war.getIsMapModified()) || (war.getIsReviewingMap())) {
            return;
        }

        const slotIndex = war.getMapSlotIndex();
        if (slotIndex === await getReviewingMapSlotIndex()) {
            return;
        }

        const mapRawData = await war.serializeForMap();
        if (await getCriticalErrorCodeForMapRawData(mapRawData)) {
            show(getText(TextType.A0304));
        } else {
            reqMeSubmitNormalMap({
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
        const dataArray = getNonNullElements(list.getBoundDataArray() ?? []);
        if (mode === DrawerMode.DrawTileBase) {
            const dataForDrawTileBase   = getExisted(drawer.getDrawTargetTileBaseData());
            const newDataArray          = dataArray?.filter(v => {
                const existingData = v?.dataForDrawTileBase;
                return (existingData == null) || (existingData.baseType !== dataForDrawTileBase.baseType) || (existingData.shapeId !== dataForDrawTileBase.shapeId);
            });
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

        } else if (mode === DrawerMode.DrawTileDecoration) {
            const dataForDrawTileDecoration = getExisted(drawer.getDrawTargetTileDecorationData());
            const newDataArray              = dataArray?.filter(v => {
                const existingData  = v.dataForDrawTileDecoration;
                return (existingData == null) || (existingData.decorationType !== dataForDrawTileDecoration.decorationType) || (existingData.shapeId !== dataForDrawTileDecoration.shapeId);
            });
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

        } else if (mode === DrawerMode.DrawTileObject) {
            const dataForDrawTileObject = getExisted(drawer.getDrawTargetTileObjectData());
            const newDataArray          = dataArray?.filter(v => {
                const existingData = v.dataForDrawTileObject;
                return (existingData == null)
                    || (existingData.objectType !== dataForDrawTileObject.objectType)
                    || (existingData.shapeId !== dataForDrawTileObject.shapeId)
                    || (existingData.playerIndex !== dataForDrawTileObject.playerIndex);
            });
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

        } else if (mode === DrawerMode.DrawUnit) {
            const targetUnit    = getExisted(drawer.getDrawTargetUnit());
            const unitType      = targetUnit.getUnitType();
            const playerIndex   = targetUnit.getPlayerIndex();
            const newDataArray  = dataArray?.filter(v => {
                const existingData = v.dataForDrawUnit;
                return (existingData == null) || (existingData.playerIndex !== playerIndex) || (existingData.unitType !== unitType);
            });
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
    private _onNotifyMsgMeSubmitNormalMap(e: Event): void {
        const data = e.data as MeSubmitNormalMapResponse;
        if (!data.getNeedReview()) {
            show(getText(TextType.A0085));
        } else {
            const errorCode = data.getMapRawDataErrorCode();
            if (errorCode) {
                show(getText(TextType.A0197));
                show(getErrorText(errorCode));
            } else {
                show(getText(TextType.A0244));
            }
        }

        this._getWar().setIsMapModified(false);
    }
    private _onNotifyMsgMmReviewMap(e: Event): void {
        const data = e.data as MmReviewMapResponse;
        if (data.getIsAccept()) {
            show(getText(TextType.A0092));
        } else {
            show(getText(TextType.A0093));
        }
        gotoLobby();
    }
    private _onNotifyMsgMeDeleteSlot(): void {
        show(getText(TextType.A0081));
        gotoMyWarListPanel(WarTypeId.Me);
    }
    private _onNotifyMsgCmSetCampaignMapRawData(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onEnterFrame(): void {
        const label = this._labelMouseHover;
        if (!isPc) {
            label.setIsVisible(false);
            return;
        }

        const x = getMouseX();
        const y = getMouseY();
        if ((x == null) || (y == null)) {
            label.setIsVisible(false);
            return;
        }

        const war       = this._getWar();
        const gridIndex = GridIndex.createGridIndexByPoint(war.getView().getFieldContainer().getContentsContainerGlobalToLocal({ x, y }));
        label.setIsVisible(true);
        if (!gridIndex.checkIsInsideMap(war.getTileMap().getMapSize())) {
            label.setText(`${getText(TextType.B1112)}: --`);
        } else {
            const locationIdArray   = war.getTileMap().getTile(gridIndex).getLocationIdList(true);
            const textForGridIndex  = `x${gridIndex.getX()} y${gridIndex.getY()}`;
            const textForLocation   = locationIdArray.length ? locationIdArray.join(` `) : `--`;
            label.setText(`${getText(TextType.B1112)}: ${textForGridIndex}, ${getText(TextType.Location)}: ${textForLocation}`);
        }
    }

    private _onTouchedGroupModePreview(): void {
        this._getDrawer().setModePreview();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileBase(): void {
        openPanel(getDict().MeChooseTileBasePanel, { war: this._getWar() });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileDecoration(): void {
        openPanel(getDict().MeChooseTileDecorationPanel, { war: this._getWar() });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawTileObject(): void {
        openPanel(getDict().MeChooseTileObjectPanel, { war: this._getWar() });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawUnit(): void {
        openPanel(getDict().MeChooseUnitPanel, { war: this._getWar() });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteTileObject(): void {
        this._getDrawer().setModeDeleteTileObject();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDrawLocation(): void {
        const war = this._getWar();
        openPanel(getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility    : true,
            currentGroupedLocationIds       : war.getTileMap().getVisibleGroupedLocationIdArray().concat(),
            war                             : war,
            getTitleText                    : () => getText(TextType.B0759),
            callback                        : locationIdArray => {
                if (!locationIdArray.length) {
                    show(getText(TextType.A0266));
                } else {
                    war.getDrawer().setModeAddTileToLocation({ locationIdArray });
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteLocation(): void {
        const war = this._getWar();
        openPanel(getDict().MeChooseLocationPanel, {
            needChangeLocationVisibility    : true,
            currentGroupedLocationIds       : war.getTileMap().getVisibleGroupedLocationIdArray().concat(),
            war                             : war,
            getTitleText                    : () => getText(TextType.B0760),
            callback                        : locationIdArray => {
                if (!locationIdArray.length) {
                    show(getText(TextType.A0266));
                } else {
                    war.getDrawer().setModeDeleteTileFromLocation({ locationIdArray });
                }
            },
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupCopyTile(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const war = this._getWar();
        war.getDrawer().setDataForPasteTile(war.getTileMap().getTile(war.getCursor().getGridIndex()).serialize());
        show(getText(TextType.A0369));
    }
    private _onTouchedGroupModePasteTile(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const drawer    = this._getWar().getDrawer();
        const data      = drawer.getDataForPasteTile();
        if (data == null) {
            show(getText(TextType.A0371));
        } else {
            drawer.setModePasteTile();
        }
    }
    private _onTouchedGroupCopyUnit(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const war       = this._getWar();
        const unitMap   = war.getUnitMap();
        const unit      = unitMap.getUnitOnMap(war.getCursor().getGridIndex());
        if (unit == null) {
            show(getText(TextType.A0373));
            return;
        }

        const dataArray = [unit.clone()];
        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
            dataArray.push(loadedUnit.clone());
        }
        war.getDrawer().setDataForPasteUnit(dataArray);
        show(getText(TextType.A0370));
    }
    private _onTouchedGroupModePasteUnit(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const drawer    = this._getWar().getDrawer();
        const data      = drawer.getDataForPasteUnit();
        if (data == null) {
            show(getText(TextType.A0372));
        } else {
            drawer.setModePasteUnit();
        }
    }

    private _onTouchedBtnUndo(): void {
        const war = this._getWar();
        if (war.getIsReviewingMap()) {
            showLang(TextType.A0318);
        } else {
            war.getDrawer().loadPreviousCheckpoint();
        }
    }
    private _onTouchedBtnRedo(): void {
        const war = this._getWar();
        if (war.getIsReviewingMap()) {
            showLang(TextType.A0319);
        } else {
            war.getDrawer().loadNextCheckpoint();
        }
    }

    private _onTouchedBtnSaveMap(): void {
        const war = this._getWar();
        if (war.getCampaignMapData()) {
            openPanel(getDict().MeSaveCampaignMapPanel, {
                war     : war,
            });
        } else {
            openPanel(getDict().MeSaveNormalMapPanel, {
                war     : war,
            });
        }
    }
    private _onTouchedBtnLoadMap(): void {
        const war = this._getWar();
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0072),
            callback: async () => {
                const slotIndex     = war.getMapSlotIndex();
                const gameConfig    = war.getGcData();
                const mapEditorData = await getMapEditorData(slotIndex);
                war.stopRunning();
                await war.initWithMapRawData({
                    mapRawData                  : mapEditorData?.mapRawData ?? await createDefaultMapRawData(slotIndex, gameConfig),
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
        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0296),
            tips            : getText(TextType.A0105),
            currentValue    : ``,
            canBeEmpty      : true,
            isMultiLine     : true,
            maxChars        : Common.MaxReviewCommentLength,
            charRestrict    : null,
            callback        : panel => {
                const war       = this._getWar();
                const callback  = () => {
                    reqMmReviewMap({
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
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent     : () => getText(TextType.A0296),
                        callback    : callback,
                    });
                }
            },
        });
    }
    private _onTouchedBtnReviewReject(): void {
        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0297),
            tips            : getText(TextType.A0094),
            currentValue    : ``,
            canBeEmpty      : true,
            isMultiLine     : true,
            maxChars        : Common.MaxReviewCommentLength,
            charRestrict    : null,
            callback        : panel => {
                const war = this._getWar();
                reqMmReviewMap({
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
        openPanel(getDict().MeWarRulePanel, { war: war });
    }
    private _onTouchedBtnWarEvent(): void {
        openPanel(getDict().WeMainPanel, {
            war: this._getWar(),
        });
    }
    private _onTouchedBtnMapInfo(): void {
        openPanel(getDict().MeMapInfoPanel, {
            war     : this._getWar(),
        });
    }
    private _onTouchedGroupModeDeleteTileDecoration(): void {
        this._getDrawer().setModeDeleteTileDecoration();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupModeDeleteUnit(): void {
        this._getDrawer().setModeDeleteUnit();
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnVisibility(): void {
        openPanel(getDict().MeVisibilityPanel, void 0);
    }
    private _onTouchedBtnSymmetry(): void {
        openPanel(getDict().MeSymmetryPanel, {
            war: this._getWar(),
        });
    }
    private _onTouchedBtnChat(): void {
        const war = this._getWar();
        openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({
            toMapReviewTarget: war.getIsReviewingMap()
            ? war.getMapDesignerUserId()
            : getExisted(getSelfUserId())
        }) });
    }
    private _onTouchedBtnMenu(): void {
        openPanel(getDict().MeWarMenuPanel, { war: this._getWar() });
    }
    private _onTouchedBtnAutoAdjust(): void {
        openPanel(getDict().MeAutoAdjustPanel,  {
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
        this._btnModePreview.setLangText(TextType.B0286);
        this._btnModeDrawTileBase.setLangText(TextType.B0282);
        this._btnModeDeleteTileDecorator.setLangText(TextType.B0661);
        this._btnModeDrawUnit.setLangText(TextType.B0281);
        this._btnModeDrawTileDecorator.setLangText(TextType.B0662);
        this._btnModeDrawTileObject.setLangText(TextType.B0283);
        this._btnModeDeleteUnit.setLangText(TextType.B0284);
        this._btnModeDeleteTileObject.setLangText(TextType.B0285);
        this._btnModeDrawLocation.setLangText(TextType.B0759);
        this._btnModeDeleteLocation.setLangText(TextType.B0760);
        this._btnCopyTile.setLangText(TextType.B0993);
        this._btnModePasteTile.setLangText(TextType.B0994);
        this._btnCopyUnit.setLangText(TextType.B0995);
        this._btnModePasteUnit.setLangText(TextType.B0996);
        this._btnSaveMap.setLangText(TextType.B0287);
        this._btnLoadMap.setLangText(TextType.B0288);
        this._btnReviewAccept.setLangText(TextType.B0296);
        this._btnReviewReject.setLangText(TextType.B0297);
        this._btnWarRule.setLangText(TextType.B0314);
        this._btnWarEvent.setLangText(TextType.B0461);
        this._btnMapInfo.setLangText(TextType.B0298);
        this._btnVisibility.setLangText(TextType.B0301);
        this._btnSymmetry.setLangText(TextType.B0306);
        this._btnChat.setLangText(TextType.B0383);
        this._btnMenu.setLangText(TextType.B0155);
        this._btnAutoAdjust.setLangText(TextType.B1451);
        this._btnAutoAdjustToggleOn.setLangText(TextType.B0890);
        this._btnAutoAdjustToggleOff.setLangText(TextType.B0890);
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

        this._groupModePreview.setUnscaledManualWidth(mode === DrawerMode.Preview ? 80 : 70);
        this._groupModeDrawTileBase.setUnscaledManualWidth(mode === DrawerMode.DrawTileBase ? 80 : 70);
        this._groupModeDrawTileDecorator.setUnscaledManualWidth(mode === DrawerMode.DrawTileDecoration ? 80 : 70);
        this._groupModeDeleteTileDecorator.setUnscaledManualWidth(mode === DrawerMode.DeleteTileDecoration ? 80 : 70);
        this._groupModeDrawTileObject.setUnscaledManualWidth(mode === DrawerMode.DrawTileObject ? 80 : 70);
        this._groupModeDeleteTileObject.setUnscaledManualWidth(mode === DrawerMode.DeleteTileObject ? 80 : 70);
        this._groupModeDrawUnit.setUnscaledManualWidth(mode === DrawerMode.DrawUnit ? 80 : 70);
        this._groupModeDeleteUnit.setUnscaledManualWidth(mode === DrawerMode.DeleteUnit ? 80 : 70);
        this._groupModeDrawLocation.setUnscaledManualWidth(mode === DrawerMode.AddTileToLocation ? 80 : 70);
        this._groupModeDeleteLocation.setUnscaledManualWidth(mode === DrawerMode.DeleteTileFromLocation ? 80 : 70);
        this._groupModePasteTile.setUnscaledManualWidth(mode === DrawerMode.PasteTile ? 80 : 70);
        this._groupModePasteUnit.setUnscaledManualWidth(mode === DrawerMode.PasteUnit ? 80 : 70);

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
        if (mode === DrawerMode.DrawTileBase) {
            con.setIsVisible(true);

            const tileBaseData = getExisted(drawer.getDrawTargetTileBaseData());
            tileView.init({
                tileBaseShapeId         : tileBaseData.shapeId,
                tileBaseType            : tileBaseData.baseType,
                tileDecorationType      : null,
                tileDecorationShapeId   : null,
                tileObjectShapeId       : null,
                tileObjectType          : null,
                skinId                  : PlayerIndex.Neutral,
                overridingSkinId        : undefined,
                gameConfig              : gameConfig,
            });
            tileView.updateView();

        } else if (mode === DrawerMode.DrawTileDecoration) {
            con.setIsVisible(true);

            const tileDecorationData = getExisted(drawer.getDrawTargetTileDecorationData());
            tileView.init({
                tileBaseShapeId         : null,
                tileBaseType            : null,
                tileDecorationType      : tileDecorationData.decorationType,
                tileDecorationShapeId   : tileDecorationData.shapeId,
                tileObjectShapeId       : null,
                tileObjectType          : null,
                skinId                  : PlayerIndex.Neutral,
                overridingSkinId        : undefined,
                gameConfig              : gameConfig,
            });
            tileView.updateView();

        } else if (mode === DrawerMode.DrawTileObject) {
            con.setIsVisible(true);

            const tileObjectData = getExisted(drawer.getDrawTargetTileObjectData());
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

        } else if (mode === DrawerMode.PasteTile) {
            con.setIsVisible(true);

            const data = getExisted(drawer.getDataForPasteTile());
            tileView.init({
                tileBaseShapeId         : data.getBaseShapeId(),
                tileBaseType            : data.getBaseType(),
                tileDecorationType      : data.getDecorationType(),
                tileDecorationShapeId   : data.getDecorationShapeId(),
                tileObjectShapeId       : data.getObjectShapeId(),
                tileObjectType          : data.getObjectType(),
                skinId                  : getDefaultSkinId(data.getPlayerIndex()),
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
        if (drawMode === DrawerMode.DrawUnit) {
            con.setIsVisible(true);
            unitView.init(getExisted(drawer.getDrawTargetUnit()));
            unitView.resetAllViews();

        } else if (drawMode === DrawerMode.PasteUnit) {
            con.setIsVisible(true);
            unitView.init(getExisted(drawer.getDataForPasteUnit())[0]);
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
        this._labelLocation.setText(`${textForGridIndex} ${getText(TextType.Location)}: ${textForLocation}`);
    }

    private _updateGroupAutoAdjust(): void {
        const btnOn     = this._btnAutoAdjustToggleOn;
        const btnOff    = this._btnAutoAdjustToggleOff;
        if (!getShowMapEditorAutoAdjustToggle()) {
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
            skinId                  : PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : this._getWar().getGcData(),
        });
        tileView.startRunningView();
    }
    private _initUnitView(): void {
        const war           = this._getWar();
        const unit          = new (getUnitClass())();
        const gameConfig    = war.getGcData();
        unit.init(createDefault({
            gridIndex   : { x: 0, y: 0 },
            unitId      : 0,
            unitTypeId  : gameConfig.getFirstUnitType(),
            playerIndex : PlayerIndex.First,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);

        this._unitView.init(unit);
    }
}

interface DataForRecentRenderer extends UiListItemData {
    war                         : IMeWar;
    panel                       : Panel;
    dataForDrawUnit             : Undefinable<DataForDrawUnit>;
    dataForDrawTileBase         : Undefinable<DataForDrawTileBase>;
    dataForDrawTileDecoration   : Undefinable<DataForDrawTileDecoration>;
    dataForDrawTileObject       : Undefinable<DataForDrawTileObject>;
}
class RecentRenderer extends UiListItemRenderer<DataForRecentRenderer> {
    private readonly _conUnitView!  : IUiContainer;
    private readonly _conTileView!  : IUiContainer;

    private readonly _unitView      = new (getUnitViewClass())();
    private readonly _tileView      = new (getTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            { type: TypeId.StateIndicatorTick,              callback: this._onNotifyStateIndicatorTick },
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

            const unit = new (getUnitClass())();
            unit.init(createDefault({
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
            const playerIndex               = dataForDrawTileObject?.playerIndex ?? PlayerIndex.Neutral;
            const tileData                  = create({
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
            fillNonTrivialDefaultValues(tileData, gameConfig);

            const tileView = this._tileView;
            tileView.setData({
                tileData            : tileData,
                skinId              : playerIndex,
                overridingSkinId    : undefined,
                hasFog              : false,
                isFullReplay        : true,
                gameConfig          : gameConfig,
                themeType           : war.getInstanceWarRule().getWarRuleCommonData()?.getFixedTileTheme()
                    ?? getExisted(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getTileTheme()),
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
