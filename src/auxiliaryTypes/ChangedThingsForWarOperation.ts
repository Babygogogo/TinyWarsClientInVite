import type {
    Players_Player,
    Tiles_Tile,
    Units_Unit,
} from "../internal";
import type { ForceFog } from "../proto/schema/CommonProto/Structure/ForceFog";
import type { TaskObjectiveState } from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState";
import { CustomCounter } from "../proto/schema/CommonProto/WarSerialization/CustomCounter";
import type { SerialWeatherManager } from "../proto/schema/CommonProto/WarSerialization/SerialWeatherManager";

export class ChangedThingsForWarOperation {
    private _players                                : Set<Players_Player.Player> | undefined;
    private _tiles                                  : Set<Tiles_Tile.Tile> | undefined;
    private _units                                  : Set<Units_Unit.Unit> | undefined;
    private _weatherManager                         : SerialWeatherManager | undefined;
    private _customCounterDict                      : Map<number, number> | undefined;
    private _forceFog                               : ForceFog | undefined;
    private _taskObjectiveStateDict                 : Map<number, TaskObjectiveState> | undefined;
    private _unitMovePathVisibilityDictForWarEvent  : Map<number, number> | undefined;

    public constructor({ players, tiles, units, weatherManager, customCounterDict, forceFog, taskObjectiveStateDict, unitMovePathVisibilityDictForWarEvent }: {
        players?                                : Set<Players_Player.Player> | Array<Players_Player.Player>;
        tiles?                                  : Set<Tiles_Tile.Tile> | Array<Tiles_Tile.Tile>;
        units?                                  : Set<Units_Unit.Unit> | Array<Units_Unit.Unit>;
        weatherManager?                         : SerialWeatherManager;
        customCounterDict?                      : Map<number, number>;
        forceFog?                               : ForceFog;
        taskObjectiveStateDict?                 : Map<number, TaskObjectiveState>;
        unitMovePathVisibilityDictForWarEvent?  : Map<number, number>;
    } = {}) {
        if (players) {
            this.addPlayers(players);
        }
        if (tiles) {
            this.addTiles(tiles);
        }
        if (units) {
            this.addUnits(units);
        }
        if (weatherManager) {
            this.setWeatherManager(weatherManager);
        }
        if (customCounterDict) {
            for (const [customCounterId, value] of customCounterDict) {
                this.setCustomCounter(customCounterId, value);
            }
        }
        if (forceFog) {
            this.setForceFog(forceFog);
        }
        if (taskObjectiveStateDict) {
            for (const taskObjectiveState of taskObjectiveStateDict.values()) {
                this.setTaskObjectiveState(taskObjectiveState);
            }
        }
        if (unitMovePathVisibilityDictForWarEvent) {
            this.setUnitMovePathVisibilityDictForWarEvent(unitMovePathVisibilityDictForWarEvent);
        }
    }

    public mergeFrom(other: ChangedThingsForWarOperation): this {
        {
            const players = other._players;
            if (players) {
                this.addPlayers(players);
            }
        }
        {
            const tiles = other._tiles;
            if (tiles) {
                this.addTiles(tiles);
            }
        }
        {
            const units = other._units;
            if (units) {
                this.addUnits(units);
            }
        }
        {
            const weatherManager = other._weatherManager;
            if (weatherManager) {
                this.setWeatherManager(weatherManager);
            }
        }
        {
            const customCounterDict = other._customCounterDict;
            if (customCounterDict) {
                for (const [customCounterId, value] of customCounterDict) {
                    this.setCustomCounter(customCounterId, value);
                }
            }
        }
        {
            const forceFog = other._forceFog;
            if (forceFog) {
                this.setForceFog(forceFog);
            }
        }
        {
            const taskObjectiveStateDict = other._taskObjectiveStateDict;
            if (taskObjectiveStateDict) {
                for (const taskObjectiveState of taskObjectiveStateDict.values()) {
                    this.setTaskObjectiveState(taskObjectiveState);
                }
            }
        }
        {
            const unitMovePathVisibilityDictForWarEvent = other._unitMovePathVisibilityDictForWarEvent;
            if (unitMovePathVisibilityDictForWarEvent) {
                this.setUnitMovePathVisibilityDictForWarEvent(unitMovePathVisibilityDictForWarEvent);
            }
        }

        return this;
    }

    public getPlayers(): Set<Players_Player.Player> | undefined {
        return this._players;
    }
    public addPlayer(player: Players_Player.Player): void {
        (this._players ??= new Set()).add(player);
    }
    public addPlayers(players: Set<Players_Player.Player> | Array<Players_Player.Player>): void {
        for (const player of players) {
            this.addPlayer(player);
        }
    }

    public getTiles(): Set<Tiles_Tile.Tile> | undefined {
        return this._tiles;
    }
    public addTile(tile: Tiles_Tile.Tile): void {
        (this._tiles ??= new Set()).add(tile);
    }
    public addTiles(tiles: Set<Tiles_Tile.Tile> | Array<Tiles_Tile.Tile>): void {
        for (const tile of tiles) {
            this.addTile(tile);
        }
    }

    public getUnits(): Set<Units_Unit.Unit> | undefined {
        return this._units;
    }
    public addUnit(unit: Units_Unit.Unit): void {
        (this._units ??= new Set()).add(unit);
    }
    public addUnits(units: Set<Units_Unit.Unit> | Array<Units_Unit.Unit>): void {
        for (const unit of units) {
            this.addUnit(unit);
        }
    }

    public getWeatherManager(): SerialWeatherManager | undefined {
        return this._weatherManager;
    }
    public setWeatherManager(weatherManager: SerialWeatherManager): void {
        this._weatherManager = weatherManager;
    }

    public getCustomCounterDict(): Map<number, number> | undefined {
        return this._customCounterDict;
    }
    public getCustomCounters(): CustomCounter[] {
        const list: CustomCounter[] = [];
        for (const [customCounterId, value] of this._customCounterDict ?? []) {
            list.push(CustomCounter.fromJson({
                customCounterId : customCounterId,
                value           : value,
            }));
        }
        return list;
    }
    public setCustomCounter(customCounterId: number, value: number): void {
        (this._customCounterDict ??= new Map()).set(customCounterId, value);
    }

    public getForceFog(): ForceFog | undefined {
        return this._forceFog;
    }
    public setForceFog(forceFog: ForceFog): void {
        this._forceFog = forceFog;
    }

    public getTaskObjectiveStateDict(): Map<number, TaskObjectiveState> | undefined {
        return this._taskObjectiveStateDict;
    }
    public getTaskObjectiveStates(): TaskObjectiveState[] {
        const dict = this._taskObjectiveStateDict;
        return dict ? [...dict.values()] : [];
    }
    public setTaskObjectiveState(taskObjectiveState: TaskObjectiveState): void {
        (this._taskObjectiveStateDict ??= new Map()).set(taskObjectiveState.getObjectiveId(), taskObjectiveState);
    }

    public getUnitMovePathVisibilityDictForWarEvent(): Map<number, number> | undefined {
        return this._unitMovePathVisibilityDictForWarEvent;
    }
    public setUnitMovePathVisibilityDictForWarEvent(dict: Map<number, number>): void {
        this._unitMovePathVisibilityDictForWarEvent = dict;
    }
}
