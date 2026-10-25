import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ForceFog as $Message$CommonProto$Structure$ForceFog, type ForceFogJson as $Json$CommonProto$Structure$ForceFog } from "./ForceFog.js";
import { MovingUnitAndPath as $Message$CommonProto$Structure$MovingUnitAndPath, type MovingUnitAndPathJson as $Json$CommonProto$Structure$MovingUnitAndPath } from "./MovingUnitAndPath.js";
import { TaskObjectiveState as $Message$CommonProto$TaskObjectives$TaskObjectiveState, type TaskObjectiveStateJson as $Json$CommonProto$TaskObjectives$TaskObjectiveState } from "../TaskObjectives/TaskObjectiveState.js";
import { CustomCounter as $Message$CommonProto$WarSerialization$CustomCounter, type CustomCounterJson as $Json$CommonProto$WarSerialization$CustomCounter } from "../WarSerialization/CustomCounter.js";
import { SerialPlayer as $Message$CommonProto$WarSerialization$SerialPlayer, type SerialPlayerJson as $Json$CommonProto$WarSerialization$SerialPlayer } from "../WarSerialization/SerialPlayer.js";
import { SerialTile as $Message$CommonProto$WarSerialization$SerialTile, type SerialTileJson as $Json$CommonProto$WarSerialization$SerialTile } from "../WarSerialization/SerialTile.js";
import { SerialUnit as $Message$CommonProto$WarSerialization$SerialUnit, type SerialUnitJson as $Json$CommonProto$WarSerialization$SerialUnit } from "../WarSerialization/SerialUnit.js";
import { SerialWeatherManager as $Message$CommonProto$WarSerialization$SerialWeatherManager, type SerialWeatherManagerJson as $Json$CommonProto$WarSerialization$SerialWeatherManager } from "../WarSerialization/SerialWeatherManager.js";

export interface CommonExtraDataForWarOperationJson extends $ProtoSchemaJsonBase {
    playerArrayAfterAction: $Json$CommonProto$WarSerialization$SerialPlayer[];
    unitArrayAfterAction: $Json$CommonProto$WarSerialization$SerialUnit[];
    destroyedUnitIdArray: number[];
    tileArrayAfterAction: $Json$CommonProto$WarSerialization$SerialTile[];
    nextUnitId?: number | null | undefined;
    movingUnitAndPath?: $Json$CommonProto$Structure$MovingUnitAndPath | null | undefined;
    visibilityArrayFromPathsAfterAction: number[];
    hiddenUnitIdArray: number[];
    weatherManager?: $Json$CommonProto$WarSerialization$SerialWeatherManager | null | undefined;
    customCounterArray: $Json$CommonProto$WarSerialization$CustomCounter[];
    forceFog?: $Json$CommonProto$Structure$ForceFog | null | undefined;
    taskObjectiveStateArray: $Json$CommonProto$TaskObjectives$TaskObjectiveState[];
    visibilityArrayFromPathsAfterWarEvent: number[];
}

export class CommonExtraDataForWarOperation extends $ProtoSchemaBase {
    private _playerArrayAfterAction: $Message$CommonProto$WarSerialization$SerialPlayer[] = [];
    private _unitArrayAfterAction: $Message$CommonProto$WarSerialization$SerialUnit[] = [];
    private _destroyedUnitIdArray: number[] = [];
    private _tileArrayAfterAction: $Message$CommonProto$WarSerialization$SerialTile[] = [];
    private _nextUnitId?: number | null | undefined;
    private _movingUnitAndPath?: $Message$CommonProto$Structure$MovingUnitAndPath | null | undefined;
    private _visibilityArrayFromPathsAfterAction: number[] = [];
    private _hiddenUnitIdArray: number[] = [];
    private _weatherManager?: $Message$CommonProto$WarSerialization$SerialWeatherManager | null | undefined;
    private _customCounterArray: $Message$CommonProto$WarSerialization$CustomCounter[] = [];
    private _forceFog?: $Message$CommonProto$Structure$ForceFog | null | undefined;
    private _taskObjectiveStateArray: $Message$CommonProto$TaskObjectives$TaskObjectiveState[] = [];
    private _visibilityArrayFromPathsAfterWarEvent: number[] = [];

    public static fromJson(obj: CommonExtraDataForWarOperationJson): CommonExtraDataForWarOperation {
        return new CommonExtraDataForWarOperation().loadJson(obj);
    }
    public override loadJson(obj: CommonExtraDataForWarOperationJson): this {
        this.setPlayerArrayAfterAction(obj.playerArrayAfterAction?.map(v => $Message$CommonProto$WarSerialization$SerialPlayer.fromJson(v)) ?? []);
        this.setUnitArrayAfterAction(obj.unitArrayAfterAction?.map(v => $Message$CommonProto$WarSerialization$SerialUnit.fromJson(v)) ?? []);
        this.setDestroyedUnitIdArray(obj.destroyedUnitIdArray?.concat() ?? []);
        this.setTileArrayAfterAction(obj.tileArrayAfterAction?.map(v => $Message$CommonProto$WarSerialization$SerialTile.fromJson(v)) ?? []);
        this.setNextUnitId(obj.nextUnitId);
        this.setMovingUnitAndPath(obj.movingUnitAndPath != null ? $Message$CommonProto$Structure$MovingUnitAndPath.fromJson(obj.movingUnitAndPath) : null);
        this.setVisibilityArrayFromPathsAfterAction(obj.visibilityArrayFromPathsAfterAction?.concat() ?? []);
        this.setHiddenUnitIdArray(obj.hiddenUnitIdArray?.concat() ?? []);
        this.setWeatherManager(obj.weatherManager != null ? $Message$CommonProto$WarSerialization$SerialWeatherManager.fromJson(obj.weatherManager) : null);
        this.setCustomCounterArray(obj.customCounterArray?.map(v => $Message$CommonProto$WarSerialization$CustomCounter.fromJson(v)) ?? []);
        this.setForceFog(obj.forceFog != null ? $Message$CommonProto$Structure$ForceFog.fromJson(obj.forceFog) : null);
        this.setTaskObjectiveStateArray(obj.taskObjectiveStateArray?.map(v => $Message$CommonProto$TaskObjectives$TaskObjectiveState.fromJson(v)) ?? []);
        this.setVisibilityArrayFromPathsAfterWarEvent(obj.visibilityArrayFromPathsAfterWarEvent?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: CommonExtraDataForWarOperationJson): CommonExtraDataForWarOperationJson {
        obj ??= ({} as CommonExtraDataForWarOperationJson);

        {
            obj.playerArrayAfterAction = this.getPlayerArrayAfterAction().map(v => v.toJson());
        }

        {
            obj.unitArrayAfterAction = this.getUnitArrayAfterAction().map(v => v.toJson());
        }

        {
            obj.destroyedUnitIdArray = this.getDestroyedUnitIdArray().concat();
        }

        {
            obj.tileArrayAfterAction = this.getTileArrayAfterAction().map(v => v.toJson());
        }

        {
            const value = this.getNextUnitId();
            (value != null) && (obj.nextUnitId = value);
        }

        {
            const value = this.getMovingUnitAndPath();
            (value != null) && (obj.movingUnitAndPath = value.toJson());
        }

        {
            obj.visibilityArrayFromPathsAfterAction = this.getVisibilityArrayFromPathsAfterAction().concat();
        }

        {
            obj.hiddenUnitIdArray = this.getHiddenUnitIdArray().concat();
        }

        {
            const value = this.getWeatherManager();
            (value != null) && (obj.weatherManager = value.toJson());
        }

        {
            obj.customCounterArray = this.getCustomCounterArray().map(v => v.toJson());
        }

        {
            const value = this.getForceFog();
            (value != null) && (obj.forceFog = value.toJson());
        }

        {
            obj.taskObjectiveStateArray = this.getTaskObjectiveStateArray().map(v => v.toJson());
        }

        {
            obj.visibilityArrayFromPathsAfterWarEvent = this.getVisibilityArrayFromPathsAfterWarEvent().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerArrayAfterAction();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUnitArrayAfterAction();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getDestroyedUnitIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getTileArrayAfterAction();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getNextUnitId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getMovingUnitAndPath();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getVisibilityArrayFromPathsAfterAction();
            const length = value.length;
            if (length) {
                writer.uint32(58).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getHiddenUnitIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(66).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getWeatherManager();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getCustomCounterArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(82).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getForceFog();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getTaskObjectiveStateArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(98).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getVisibilityArrayFromPathsAfterWarEvent();
            const length = value.length;
            if (length) {
                writer.uint32(106).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CommonExtraDataForWarOperation {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CommonExtraDataForWarOperation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._playerArrayAfterAction;
                        arr.push($Message$CommonProto$WarSerialization$SerialPlayer.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    {
                        const arr = msg._unitArrayAfterAction;
                        arr.push($Message$CommonProto$WarSerialization$SerialUnit.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._destroyedUnitIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 4:
                    {
                        const arr = msg._tileArrayAfterAction;
                        arr.push($Message$CommonProto$WarSerialization$SerialTile.decode(reader, reader.uint32()));
                    }
                    break;

                case 5:
                    msg.setNextUnitId(reader.int32());
                    break;

                case 6:
                    msg.setMovingUnitAndPath($Message$CommonProto$Structure$MovingUnitAndPath.decode(reader, reader.uint32()));
                    break;

                case 7:
                    {
                        const arr = msg._visibilityArrayFromPathsAfterAction;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 8:
                    {
                        const arr = msg._hiddenUnitIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 9:
                    msg.setWeatherManager($Message$CommonProto$WarSerialization$SerialWeatherManager.decode(reader, reader.uint32()));
                    break;

                case 10:
                    {
                        const arr = msg._customCounterArray;
                        arr.push($Message$CommonProto$WarSerialization$CustomCounter.decode(reader, reader.uint32()));
                    }
                    break;

                case 11:
                    msg.setForceFog($Message$CommonProto$Structure$ForceFog.decode(reader, reader.uint32()));
                    break;

                case 12:
                    {
                        const arr = msg._taskObjectiveStateArray;
                        arr.push($Message$CommonProto$TaskObjectives$TaskObjectiveState.decode(reader, reader.uint32()));
                    }
                    break;

                case 13:
                    {
                        const arr = msg._visibilityArrayFromPathsAfterWarEvent;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CommonExtraDataForWarOperation {
        return CommonExtraDataForWarOperation.decode(this.encode());
    }

    public override getSchemaName(): "CommonExtraDataForWarOperation" {
        return "CommonExtraDataForWarOperation";
    }

    public getPlayerArrayAfterAction(): $Message$CommonProto$WarSerialization$SerialPlayer[] {
        return this._playerArrayAfterAction;
    }
    public setPlayerArrayAfterAction(value: $Message$CommonProto$WarSerialization$SerialPlayer[]): void {
        this._playerArrayAfterAction = value;
    }

    public getUnitArrayAfterAction(): $Message$CommonProto$WarSerialization$SerialUnit[] {
        return this._unitArrayAfterAction;
    }
    public setUnitArrayAfterAction(value: $Message$CommonProto$WarSerialization$SerialUnit[]): void {
        this._unitArrayAfterAction = value;
    }

    public getDestroyedUnitIdArray(): number[] {
        return this._destroyedUnitIdArray;
    }
    public setDestroyedUnitIdArray(value: number[]): void {
        this._destroyedUnitIdArray = value;
    }

    public getTileArrayAfterAction(): $Message$CommonProto$WarSerialization$SerialTile[] {
        return this._tileArrayAfterAction;
    }
    public setTileArrayAfterAction(value: $Message$CommonProto$WarSerialization$SerialTile[]): void {
        this._tileArrayAfterAction = value;
    }

    public checkHasNextUnitId(): boolean {
        return this._nextUnitId != null;
    }
    public getNextUnitId(): number | null | undefined {
        return this._nextUnitId;
    }
    public setNextUnitId(value: number | null | undefined): void {
        this._nextUnitId = value;
    }

    public checkHasMovingUnitAndPath(): boolean {
        return this._movingUnitAndPath != null;
    }
    public getMovingUnitAndPath(): $Message$CommonProto$Structure$MovingUnitAndPath | null | undefined {
        return this._movingUnitAndPath;
    }
    public setMovingUnitAndPath(value: $Message$CommonProto$Structure$MovingUnitAndPath | null | undefined): void {
        this._movingUnitAndPath = value;
    }
    public createIfNotExistsMovingUnitAndPath(): $Message$CommonProto$Structure$MovingUnitAndPath {
        return this._movingUnitAndPath ??= new $Message$CommonProto$Structure$MovingUnitAndPath();
    }

    public getVisibilityArrayFromPathsAfterAction(): number[] {
        return this._visibilityArrayFromPathsAfterAction;
    }
    public setVisibilityArrayFromPathsAfterAction(value: number[]): void {
        this._visibilityArrayFromPathsAfterAction = value;
    }

    public getHiddenUnitIdArray(): number[] {
        return this._hiddenUnitIdArray;
    }
    public setHiddenUnitIdArray(value: number[]): void {
        this._hiddenUnitIdArray = value;
    }

    public checkHasWeatherManager(): boolean {
        return this._weatherManager != null;
    }
    public getWeatherManager(): $Message$CommonProto$WarSerialization$SerialWeatherManager | null | undefined {
        return this._weatherManager;
    }
    public setWeatherManager(value: $Message$CommonProto$WarSerialization$SerialWeatherManager | null | undefined): void {
        this._weatherManager = value;
    }
    public createIfNotExistsWeatherManager(): $Message$CommonProto$WarSerialization$SerialWeatherManager {
        return this._weatherManager ??= new $Message$CommonProto$WarSerialization$SerialWeatherManager();
    }

    public getCustomCounterArray(): $Message$CommonProto$WarSerialization$CustomCounter[] {
        return this._customCounterArray;
    }
    public setCustomCounterArray(value: $Message$CommonProto$WarSerialization$CustomCounter[]): void {
        this._customCounterArray = value;
    }

    public checkHasForceFog(): boolean {
        return this._forceFog != null;
    }
    public getForceFog(): $Message$CommonProto$Structure$ForceFog | null | undefined {
        return this._forceFog;
    }
    public setForceFog(value: $Message$CommonProto$Structure$ForceFog | null | undefined): void {
        this._forceFog = value;
    }
    public createIfNotExistsForceFog(): $Message$CommonProto$Structure$ForceFog {
        return this._forceFog ??= new $Message$CommonProto$Structure$ForceFog();
    }

    public getTaskObjectiveStateArray(): $Message$CommonProto$TaskObjectives$TaskObjectiveState[] {
        return this._taskObjectiveStateArray;
    }
    public setTaskObjectiveStateArray(value: $Message$CommonProto$TaskObjectives$TaskObjectiveState[]): void {
        this._taskObjectiveStateArray = value;
    }

    public getVisibilityArrayFromPathsAfterWarEvent(): number[] {
        return this._visibilityArrayFromPathsAfterWarEvent;
    }
    public setVisibilityArrayFromPathsAfterWarEvent(value: number[]): void {
        this._visibilityArrayFromPathsAfterWarEvent = value;
    }
}
