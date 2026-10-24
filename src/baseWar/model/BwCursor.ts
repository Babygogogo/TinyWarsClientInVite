import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwCursor from "../interface/IBwCursor.ts";
import type * as BaseWarInterfaceIBwCursorView from "../interface/IBwCursorView.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as NotificationsTypes from "../../notifications/Types.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export class BwCursor implements BaseWarInterfaceIBwCursor.IBwCursor {
    private _gridX              = 0;
    private _gridY              = 0;
    private _previousGridIndex  : AuxiliaryTypesGridIndex.GridIndex | null = null;
    private _mapSize?           : AuxiliaryTypesMapSize.MapSize;
    private _isMovableByTouches = true;
    private readonly _view      = new (GameHelpersGhFactory.getBwCursorViewClass())();

    private _war?               : BaseWarInterfaceIBwWar.IBwWar;

    private _notifyListeners: NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.BwCursorTapped,          callback: this._onNotifyBwCursorTapped },
        { type: NotificationsTypeId.TypeId.BwCursorDragged,         callback: this._onNotifyBwCursorDragged },
        { type: NotificationsTypeId.TypeId.ActionPlannerStateSet,   callback: this._onNotifyActionPlannerStateChanged },
    ];

    public init(mapSize: AuxiliaryTypesMapSize.MapSize): void {
        this._setMapSize(mapSize.clone());
        this.setGridIndex(new AuxiliaryTypesGridIndex.GridIndex(0, 0));

        this.getView().init(this);
    }
    public fastInit(): void {
        this.getView().fastInit(this);
    }

    public startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void {
        this._war = war;

        NotificationsDispatcher.addEventListeners(this._notifyListeners, this, false, 10);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyBwCursorTapped(e: VendorEgretEgret.Event): void {
        if (this.getIsMovableByTouches()) {
            const data = e.data as NotificationsDataTypes.BwCursorTapped;
            this.setGridIndex(data.tappedOn);
            this.updateView();
        }
    }
    private _onNotifyBwCursorDragged(e: VendorEgretEgret.Event): void {
        if (this.getIsMovableByTouches()) {
            const data = e.data as NotificationsDataTypes.BwCursorDragged;
            this.setGridIndex(data.draggedTo);
            this.updateView();
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.CursorMove01);
        }
    }
    private _onNotifyActionPlannerStateChanged(): void {
        const war = this.getWar();
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass()) && (war.getIsBatchExecuteAction())) {
            return;
        }


        this.updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWar(): BaseWarInterfaceIBwWar.IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    public getView(): BaseWarInterfaceIBwCursorView.IBwCursorView {
        return this._view;
    }
    public updateView(): void {
        this.getView().updateView();
    }

    private _setMapSize(size: AuxiliaryTypesMapSize.MapSize): void {
        this._mapSize = size;
    }
    public getMapSize(): AuxiliaryTypesMapSize.MapSize {
        return HelpersMisc.getExisted(this._mapSize);
    }

    public setIsVisible(visible: boolean): void {
        this.getView().setIsVisible(visible);
    }
    public getIsVisible(): boolean {
        return this.getView().getIsVisible();
    }

    public getGridX(): number {
        return this._gridX;
    }
    public getGridY(): number {
        return this._gridY;
    }
    public setGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._setPreviousGridIndex(this.getGridIndex());

        this._gridX = gridIndex.getX();
        this._gridY = gridIndex.getY();
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorGridIndexChanged, this);
    }
    public getGridIndex(): AuxiliaryTypesGridIndex.GridIndex {
        return new AuxiliaryTypesGridIndex.GridIndex(this.getGridX(), this.getGridY());
    }

    private _setPreviousGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._previousGridIndex = gridIndex;
    }
    public getPreviousGridIndex(): AuxiliaryTypesGridIndex.GridIndex | null {
        return this._previousGridIndex;
    }

    public setIsMovableByTouches(isMovable: boolean): void {
        this._isMovableByTouches = isMovable;
    }
    public getIsMovableByTouches(): boolean {
        return this._isMovableByTouches;
    }
}
