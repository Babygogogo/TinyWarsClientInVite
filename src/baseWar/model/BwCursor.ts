import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { IBwCursor } from "../interface/IBwCursor.ts";
import type { IBwCursorView } from "../interface/IBwCursorView.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import {
    getBwCursorViewClass,
    getRwWarBaseClass,
} from "../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../helpers/Misc.ts";
import type {
    BwCursorTapped,
    BwCursorDragged,
} from "../../notifications/DataTypes.ts";
import {
    addEventListeners,
    removeEventListeners,
    dispatch,
} from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { Listener } from "../../notifications/Types.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export class BwCursor implements IBwCursor {
    private _gridX              = 0;
    private _gridY              = 0;
    private _previousGridIndex  : GridIndex | null = null;
    private _mapSize?           : MapSize;
    private _isMovableByTouches = true;
    private readonly _view      = new (getBwCursorViewClass())();

    private _war?               : IBwWar;

    private _notifyListeners: Listener[] = [
        { type: TypeId.BwCursorTapped,          callback: this._onNotifyBwCursorTapped },
        { type: TypeId.BwCursorDragged,         callback: this._onNotifyBwCursorDragged },
        { type: TypeId.ActionPlannerStateSet,   callback: this._onNotifyActionPlannerStateChanged },
    ];

    public init(mapSize: MapSize): void {
        this._setMapSize(mapSize.clone());
        this.setGridIndex(new GridIndex(0, 0));

        this.getView().init(this);
    }
    public fastInit(): void {
        this.getView().fastInit(this);
    }

    public startRunning(war: IBwWar): void {
        this._war = war;

        addEventListeners(this._notifyListeners, this, false, 10);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyBwCursorTapped(e: Event): void {
        if (this.getIsMovableByTouches()) {
            const data = e.data as BwCursorTapped;
            this.setGridIndex(data.tappedOn);
            this.updateView();
        }
    }
    private _onNotifyBwCursorDragged(e: Event): void {
        if (this.getIsMovableByTouches()) {
            const data = e.data as BwCursorDragged;
            this.setGridIndex(data.draggedTo);
            this.updateView();
            playShortSfx(ShortSfxCode.CursorMove01);
        }
    }
    private _onNotifyActionPlannerStateChanged(): void {
        const war = this.getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())) {
            return;
        }


        this.updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    public getView(): IBwCursorView {
        return this._view;
    }
    public updateView(): void {
        this.getView().updateView();
    }

    private _setMapSize(size: MapSize): void {
        this._mapSize = size;
    }
    public getMapSize(): MapSize {
        return getExisted(this._mapSize);
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
    public setGridIndex(gridIndex: GridIndex): void {
        this._setPreviousGridIndex(this.getGridIndex());

        this._gridX = gridIndex.getX();
        this._gridY = gridIndex.getY();
        dispatch(TypeId.BwCursorGridIndexChanged, this);
    }
    public getGridIndex(): GridIndex {
        return new GridIndex(this.getGridX(), this.getGridY());
    }

    private _setPreviousGridIndex(gridIndex: GridIndex): void {
        this._previousGridIndex = gridIndex;
    }
    public getPreviousGridIndex(): GridIndex | null {
        return this._previousGridIndex;
    }

    public setIsMovableByTouches(isMovable: boolean): void {
        this._isMovableByTouches = isMovable;
    }
    public getIsMovableByTouches(): boolean {
        return this._isMovableByTouches;
    }
}
