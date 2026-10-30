import {
    Destructions_Utils,
    ForceSkins_Utils,
    ReplayWar_Model_RwWar,
    ActionPlanners_Constants,
    Tiles_TileView,
    Units_Unit,
    type BaseWar_Interface_IBwWar,
    WarTypes_Utils,
    Notifications_Dispatcher,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    WarTypes_Constants,
    type Notifications_DataTypes,
    type Egret_Egret,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
// const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
// const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
// const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
// const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
// const _CELL_WIDTH           = 80;

export interface OpenData {
    war : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conTileView!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelGridIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupAttr!        : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _imgDefense!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelDefense!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _imgState!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelState!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView          = new Tiles_TileView.TileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            // { type: NotifyType.GlobalTouchBegin,            callback: this._onNotifyGlobalTouchBegin },
            // { type: NotifyType.GlobalTouchMove,             callback: this._onNotifyGlobalTouchMove },
            { type: Notifications_TypeId.TypeId.BwCursorGridIndexChanged,        callback: this._onNotifyBwCursorGridIndexChanged },
            { type: Notifications_TypeId.TypeId.ActionPlannerStateSet,           callback: this._onNotifyActionPlannerStateChanged },
            { type: Notifications_TypeId.TypeId.BwTileChanged,                   callback: this._onNotifyMeTileChanged },
            { type: Notifications_TypeId.TypeId.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            { type: Notifications_TypeId.TypeId.StateIndicatorTick,              callback: this._onNotifyStateIndicatorTick },
            { type: Notifications_TypeId.TypeId.BwTileIsHighlightedChanged,      callback: this._onNotifyTileIsHighlightedChanged },
            { type: Notifications_TypeId.TypeId.BwTileBuffChanged,               callback: this._onNotifyTileBuffChanged },
            { type: Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.BwTileCustomNameArrayChanged,    callback: this._onNotifyBwTileCustomNameArrayChanged },
            { type: Notifications_TypeId.TypeId.BwTileCustomNameIdChanged,       callback: this._onNotifyBwTileCustomNameIdChanged },
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
    private _onNotifyBwCursorGridIndexChanged(e: Egret_Egret.Event): void {
        const data  = e.data as Notifications_DataTypes.BwCursorGridIndexChanged;
        const war   = this.getOpenData()?.war;
        if ((war?.getIsRunning()) && (data === war.getCursor())) {
            this._updateView();
        }
    }
    private _onNotifyActionPlannerStateChanged(): void {
        const planner = this.getOpenData()?.war.getActionPlanner();
        if ((planner?.getPreviousStateId() === ActionPlanners_Constants.StateId.ExecutingAction)    &&
            (planner.getStateId() !== ActionPlanners_Constants.StateId.ExecutingAction)
        ) {
            this._updateView();
        }
    }
    private _onNotifyMeTileChanged(e: Egret_Egret.Event): void {
        const data  = e.data as Notifications_DataTypes.BwTileChanged;
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
    private _onNotifyTileBuffChanged(e: Egret_Egret.Event): void {
        const war = this.getOpenData()?.war;
        if ((e.data as Notifications_DataTypes.BwTileBuffChanged).tile === war?.getTileMap().getTile(war.getCursor().getGridIndex())) {
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

        if ((warType === WarTypes_Constants.WarTypeId.Me)                 ||
            (!WarTypes_Utils.checkCanCheatInWar(warType))
        ) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileDetailPanel, {
                tile,
                callbackForAddUnit  : null,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileDetailPanel, {
                tile                : tile,
                callbackForAddUnit  : () => {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseUnitAttrPanel, {
                        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B0535),
                        war             : war,
                        callback        : unitData => {
                            const unitMap = war.getUnitMap();
                            if (unitMap.getUnitOnMap(gridIndex)) {
                                Destructions_Utils.destroyUnitOnMap(war, gridIndex, false);
                            }

                            const unitId        = unitMap.getNextUnitId();
                            const unit          = new Units_Unit.Unit();
                            unitData.setUnitId(unitId);
                            unitData.setGridIndex(gridIndex.toProto());
                            unit.init(unitData, war.getGcData());
                            unit.startRunning(war);
                            unit.startRunningView();
                            unitMap.setUnitOnMap(unit);
                            unitMap.setNextUnitId(unitId + 1);
                            war.updateTilesAndUnitsOnVisibilityChanged(false);
                            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwUnitChanged, { gridIndex } as Notifications_DataTypes.BwUnitChanged);
                        },
                    });
                },
            });
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
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
            Lang_Utils.getTileName(tile.getTileTypeId(), tile.getGameConfig()) ??
            Lang_Constants.UndefinedError
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
            overridingSkinId    : ForceSkins_Utils.getRawOverridingSkinId(war, tile.getPlayerIndex()),
            themeType           : tile.getTileThemeType(),
            isFullReplay        : war instanceof ReplayWar_Model_RwWar.RwWar,
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
        Tween_Executor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            tweenTime   : 50,
        });

        await Timer_TimerModel.wait(50);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
            tweenTime   : 50,
        });

        await Timer_TimerModel.wait(50);
    }
}
