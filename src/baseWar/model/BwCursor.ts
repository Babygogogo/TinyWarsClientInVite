import {
    BaseWar_View_BwCursorView,
    AuxiliaryTypes_GridIndex,
    ReplayWar_Model_RwWarBase,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwCursorView,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
    Notifications_Dispatcher,
    Helpers_Misc,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Notifications_TypeId,
    type Notifications_DataTypes,
    type Egret_Egret,
    type Notifications_Types,
} from "../../internal.ts";

export class BwCursor implements BaseWar_Interface_IBwCursor.IBwCursor {
    private _gridX              = 0;
    private _gridY              = 0;
    private _previousGridIndex  : AuxiliaryTypes_GridIndex.GridIndex | null = null;
    private _mapSize?           : AuxiliaryTypes_MapSize.MapSize;
    private _isMovableByTouches = true;
    private readonly _view      = new BaseWar_View_BwCursorView.BwCursorView();

    private _war?               : BaseWar_Interface_IBwWar.IBwWar;

    private _notifyListeners: Notifications_Types.Listener[] = [
        { type : Notifications_TypeId.TypeId.BwCursorTapped,          callback : this._onNotifyBwCursorTapped },
        { type : Notifications_TypeId.TypeId.BwCursorDragged,         callback : this._onNotifyBwCursorDragged },
        { type : Notifications_TypeId.TypeId.ActionPlannerStateSet,   callback : this._onNotifyActionPlannerStateChanged },
    ];

    public init(mapSize: AuxiliaryTypes_MapSize.MapSize): void {
        this._setMapSize(mapSize.clone());
        this.setGridIndex(new AuxiliaryTypes_GridIndex.GridIndex(0, 0));

        this.getView().init(this);
    }
    public fastInit(): void {
        this.getView().fastInit(this);
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;

        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this, false, 10);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);

        this.getView().stopRunningView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyBwCursorTapped(e: Egret_Egret.Event): void {
        if (this.getIsMovableByTouches()) {
            const data = e.data as Notifications_DataTypes.BwCursorTapped;
            this.setGridIndex(data.tappedOn);
            this.updateView();
        }
    }
    private _onNotifyBwCursorDragged(e: Egret_Egret.Event): void {
        if (this.getIsMovableByTouches()) {
            const data = e.data as Notifications_DataTypes.BwCursorDragged;
            this.setGridIndex(data.draggedTo);
            this.updateView();
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.CursorMove01);
        }
    }
    private _onNotifyActionPlannerStateChanged(): void {
        const war = this.getWar();
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction())) {
            return;
        }

        this.updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    public getView(): BaseWar_Interface_IBwCursorView.IBwCursorView {
        return this._view;
    }
    public updateView(): void {
        this.getView().updateView();
    }

    private _setMapSize(size: AuxiliaryTypes_MapSize.MapSize): void {
        this._mapSize = size;
    }
    public getMapSize(): AuxiliaryTypes_MapSize.MapSize {
        return Helpers_Misc.getExisted(this._mapSize);
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
    public setGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._setPreviousGridIndex(this.getGridIndex());

        this._gridX = gridIndex.getX();
        this._gridY = gridIndex.getY();
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwCursorGridIndexChanged, { cursor: this });
    }
    public getGridIndex(): AuxiliaryTypes_GridIndex.GridIndex {
        return new AuxiliaryTypes_GridIndex.GridIndex(this.getGridX(), this.getGridY());
    }

    private _setPreviousGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._previousGridIndex = gridIndex;
    }
    public getPreviousGridIndex(): AuxiliaryTypes_GridIndex.GridIndex | null {
        return this._previousGridIndex;
    }

    public setIsMovableByTouches(isMovable: boolean): void {
        this._isMovableByTouches = isMovable;
    }
    public getIsMovableByTouches(): boolean {
        return this._isMovableByTouches;
    }
}
