import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as DestructionsUtils from "../../destructions/Utils.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";
import * as WarTypesUtils from "../../warTypes/Utils.ts";

const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
// const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
// const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
// const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
// const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
// const _CELL_WIDTH           = 80;

export interface OpenData {
    war : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _conTileView!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelGridIndex!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupAttr!        : UiInterfacesIUiLayout.IUiLayout;

    private readonly _imgDefense!       : UiInterfacesIUiImage.IUiImage;
    private readonly _labelDefense!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _imgState!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelState!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView          = new (GameHelpersGhFactory.getTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            // { type: NotifyType.GlobalTouchBegin,            callback: this._onNotifyGlobalTouchBegin },
            // { type: NotifyType.GlobalTouchMove,             callback: this._onNotifyGlobalTouchMove },
            { type: NotificationsTypeId.TypeId.BwCursorGridIndexChanged,        callback: this._onNotifyBwCursorGridIndexChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateSet,           callback: this._onNotifyActionPlannerStateChanged },
            { type: NotificationsTypeId.TypeId.BwTileChanged,                   callback: this._onNotifyMeTileChanged },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,              callback: this._onNotifyStateIndicatorTick },
            { type: NotificationsTypeId.TypeId.BwTileIsHighlightedChanged,      callback: this._onNotifyTileIsHighlightedChanged },
            { type: NotificationsTypeId.TypeId.BwTileBuffChanged,               callback: this._onNotifyTileBuffChanged },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.BwTileCustomNameArrayChanged,    callback: this._onNotifyBwTileCustomNameArrayChanged },
            { type: NotificationsTypeId.TypeId.BwTileCustomNameIdChanged,       callback: this._onNotifyBwTileCustomNameIdChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._group, callback: this._onTouchedGroup, },
        ]);

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // private _onNotifyGlobalTouchBegin(e: egret.Event): void {
    //     this._adjustPositionOnTouch(e.data);
    // }
    // private _onNotifyGlobalTouchMove(e: egret.Event): void {
    //     this._adjustPositionOnTouch(e.data);
    // }
    private _onNotifyBwCursorGridIndexChanged(e: VendorEgretEgret.Event): void {
        const data  = e.data as NotificationsDataTypes.BwCursorGridIndexChanged;
        const war   = this.getOpenData()?.war;
        if ((war?.getIsRunning()) && (data === war.getCursor())) {
            this._updateView();
        }
    }
    private _onNotifyActionPlannerStateChanged(): void {
        const planner = this.getOpenData()?.war.getActionPlanner();
        if ((planner?.getPreviousStateId() === ActionPlannersConstants.StateId.ExecutingAction)    &&
            (planner.getStateId() !== ActionPlannersConstants.StateId.ExecutingAction)
        ) {
            this._updateView();
        }
    }
    private _onNotifyMeTileChanged(e: VendorEgretEgret.Event): void {
        const data  = e.data as NotificationsDataTypes.BwTileChanged;
        const war   = this.getOpenData()?.war;
        if ((war?.getIsRunning()) && (data.gridIndex.checkIsEqual(war.getCursor().getGridIndex()))) {
            this._updateView();
        }
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
        const war = this.getOpenData()?.war;
        if ((e.data as NotificationsDataTypes.BwTileBuffChanged).tile === war?.getTileMap().getTile(war.getCursor().getGridIndex())) {
            this._updateTileView();
        }
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateTileView();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyBwTileCustomNameArrayChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyBwTileCustomNameIdChanged(): void {
        this._updateLabelName();
    }

    private _onTouchedGroup(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gridIndex = war.getCursor().getGridIndex();
        const tileMap   = war.getTileMap();
        const tile      = tileMap.getTile(gridIndex);
        const warType   = war.getWarType();

        if ((warType === WarTypesConstants.WarTypeId.Me)                 ||
            (!WarTypesUtils.checkCanCheatInWar(warType))
        ) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileDetailPanel, {
                tile,
                callbackForAddUnit  : null,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileDetailPanel, {
                tile                : tile,
                callbackForAddUnit  : () => {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseUnitAttrPanel, {
                        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0535),
                        war             : war,
                        callback        : unitData => {
                            const unitMap = war.getUnitMap();
                            if (unitMap.getUnitOnMap(gridIndex)) {
                                DestructionsUtils.destroyUnitOnMap(war, gridIndex, false);
                            }

                            const unitId        = unitMap.getNextUnitId();
                            const unit          = new (GameHelpersGhFactory.getUnitClass())();
                            unitData.setUnitId(unitId);
                            unitData.setGridIndex(gridIndex.toProto());
                            unit.init(unitData, war.getGcData());
                            unit.startRunning(war);
                            unit.startRunningView();
                            unitMap.setUnitOnMap(unit);
                            unitMap.setNextUnitId(unitId + 1);
                            war.updateTilesAndUnitsOnVisibilityChanged(false);
                            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwUnitChanged, { gridIndex } as NotificationsDataTypes.BwUnitChanged);
                        },
                    });
                },
            });
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gridIndex = war.getCursor().getGridIndex();
        const tile      = war.getTileMap().getTile(gridIndex);
        this._labelDefense.setText(`${Math.floor(tile.getDefenseAmount() / 10)}`);
        this._labelGridIndex.setText(`x${gridIndex.getX()} y${gridIndex.getY()}`);
        this._updateLabelName();
        this._updateTileView();

        if ((tile.getCurrentHp() !== 0) || (tile.getMaxHp() != null)) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(_IMAGE_SOURCE_HP);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${tile.getCurrentHp()}`);
        } else if ((tile.getCurrentCapturePoint() !== 0) || (tile.getMaxCapturePoint() != null)) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(_IMAGE_SOURCE_CAPTURE);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${tile.getCurrentCapturePoint()}`);
        } else if ((tile.getCurrentBuildPoint() != 0) || (tile.getMaxBuildPoint() != null)) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(_IMAGE_SOURCE_CAPTURE);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${tile.getCurrentBuildPoint()}`);
        } else {
            this._imgState.setIsVisible(false);
            this._labelState.setIsVisible(false);
        }
        this._groupAttr.arrangeItems();
    }
    private _updateLabelName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const tile = war.getTileMap().getTile(war.getCursor().getGridIndex());
        this._labelName.setText(
            tile.getCustomName() ??
            LangUtils.getTileName(tile.getTileTypeId(), tile.getGameConfig()) ??
            LangConstants.UndefinedError
        );
    }
    private _updateTileView(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const tile      = war.getTileMap().getTile(war.getCursor().getGridIndex());
        const tileView  = this._tileView;
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

    // private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
    //     const unitBriefPanel = TwnsBwUnitBriefPanel.BwUnitBriefPanel.getInstance();
    //     let target = e.target as egret.DisplayObject;
    //     while (target) {
    //         if ((target) && ((target === this) || (target === unitBriefPanel))) {
    //             return;
    //         }
    //         target = target.parent;
    //     }

    //     const stageWidth    = StageManager.getStage().stageWidth;
    //     const group         = this._group;
    //     const currentX      = group.x;
    //     const newX          = e.stageX >= stageWidth / 4 * 3
    //         ? 0
    //         : (e.stageX < stageWidth / 4
    //             ? stageWidth - _CELL_WIDTH
    //             : currentX
    //         );
    //     if (newX !== currentX) {
    //         await this._showCloseAnimation();
    //         group.x = newX;
    //         this._showOpenAnimation();
    //     }
    // }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            tweenTime   : 50,
        });

        await TimerTimerModel.wait(50);
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
            tweenTime   : 50,
        });

        await TimerTimerModel.wait(50);
    }
}
