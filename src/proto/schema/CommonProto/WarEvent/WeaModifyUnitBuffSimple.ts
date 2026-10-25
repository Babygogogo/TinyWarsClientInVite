import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitBuffFilter as $Message$CommonProto$Structure$UnitBuffFilter, type UnitBuffFilterJson as $Json$CommonProto$Structure$UnitBuffFilter } from "../Structure/UnitBuffFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";

export interface WeaModifyUnitBuffSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitBuffFilter?: $Json$CommonProto$Structure$UnitBuffFilter | null | undefined;
    conMaxModifyCount?: number | null | undefined;
    actBuffType?: number | null | undefined;
    actEndTurnIndex?: number | null | undefined;
    actEndPlayerIndex?: number | null | undefined;
    actEndTurnIndexMode?: number | null | undefined;
    actEndPlayerIndexMode?: number | null | undefined;
}

export class WeaModifyUnitBuffSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitBuffFilter?: $Message$CommonProto$Structure$UnitBuffFilter | null | undefined;
    private _conMaxModifyCount?: number | null | undefined;
    private _actBuffType?: number | null | undefined;
    private _actEndTurnIndex?: number | null | undefined;
    private _actEndPlayerIndex?: number | null | undefined;
    private _actEndTurnIndexMode?: number | null | undefined;
    private _actEndPlayerIndexMode?: number | null | undefined;

    public static fromJson(obj: WeaModifyUnitBuffSimpleJson): WeaModifyUnitBuffSimple {
        return new WeaModifyUnitBuffSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaModifyUnitBuffSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitBuffFilter(obj.conUnitBuffFilter != null ? $Message$CommonProto$Structure$UnitBuffFilter.fromJson(obj.conUnitBuffFilter) : null);
        this.setConMaxModifyCount(obj.conMaxModifyCount);
        this.setActBuffType(obj.actBuffType);
        this.setActEndTurnIndex(obj.actEndTurnIndex);
        this.setActEndPlayerIndex(obj.actEndPlayerIndex);
        this.setActEndTurnIndexMode(obj.actEndTurnIndexMode);
        this.setActEndPlayerIndexMode(obj.actEndPlayerIndexMode);
        return this;
    }
    public override toJson(obj?: WeaModifyUnitBuffSimpleJson): WeaModifyUnitBuffSimpleJson {
        obj ??= ({} as WeaModifyUnitBuffSimpleJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value.toJson());
        }

        {
            const value = this.getConPlayerFilter();
            (value != null) && (obj.conPlayerFilter = value.toJson());
        }

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value.toJson());
        }

        {
            const value = this.getConUnitBuffFilter();
            (value != null) && (obj.conUnitBuffFilter = value.toJson());
        }

        {
            const value = this.getConMaxModifyCount();
            (value != null) && (obj.conMaxModifyCount = value);
        }

        {
            const value = this.getActBuffType();
            (value != null) && (obj.actBuffType = value);
        }

        {
            const value = this.getActEndTurnIndex();
            (value != null) && (obj.actEndTurnIndex = value);
        }

        {
            const value = this.getActEndPlayerIndex();
            (value != null) && (obj.actEndPlayerIndex = value);
        }

        {
            const value = this.getActEndTurnIndexMode();
            (value != null) && (obj.actEndTurnIndexMode = value);
        }

        {
            const value = this.getActEndPlayerIndexMode();
            (value != null) && (obj.actEndPlayerIndexMode = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConTileFilter();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConPlayerFilter();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitFilter();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitBuffFilter();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getConMaxModifyCount();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getActBuffType();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getActEndTurnIndex();
            if (value != null) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getActEndPlayerIndex();
            if (value != null) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getActEndTurnIndexMode();
            if ((value != null) && (value != 0)) {
                writer.uint32(120).int32(value);
            }
        }

        {
            const value = this.getActEndPlayerIndexMode();
            if ((value != null) && (value != 0)) {
                writer.uint32(128).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaModifyUnitBuffSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaModifyUnitBuffSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConPlayerFilter($Message$CommonProto$Structure$PlayerFilter.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConUnitFilter($Message$CommonProto$Structure$UnitFilter.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setConUnitBuffFilter($Message$CommonProto$Structure$UnitBuffFilter.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setConMaxModifyCount(reader.int32());
                    break;

                case 10:
                    msg.setActBuffType(reader.int32());
                    break;

                case 12:
                    msg.setActEndTurnIndex(reader.int32());
                    break;

                case 13:
                    msg.setActEndPlayerIndex(reader.int32());
                    break;

                case 15:
                    msg.setActEndTurnIndexMode(reader.int32());
                    break;

                case 16:
                    msg.setActEndPlayerIndexMode(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaModifyUnitBuffSimple {
        return WeaModifyUnitBuffSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaModifyUnitBuffSimple" {
        return "WeaModifyUnitBuffSimple";
    }

    public checkHasConTileFilter(): boolean {
        return this._conTileFilter != null;
    }
    public getConTileFilter(): $Message$CommonProto$Structure$TileFilter | null | undefined {
        return this._conTileFilter;
    }
    public setConTileFilter(value: $Message$CommonProto$Structure$TileFilter | null | undefined): void {
        this._conTileFilter = value;
    }
    public createIfNotExistsConTileFilter(): $Message$CommonProto$Structure$TileFilter {
        return this._conTileFilter ??= new $Message$CommonProto$Structure$TileFilter();
    }

    public checkHasConPlayerFilter(): boolean {
        return this._conPlayerFilter != null;
    }
    public getConPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter | null | undefined {
        return this._conPlayerFilter;
    }
    public setConPlayerFilter(value: $Message$CommonProto$Structure$PlayerFilter | null | undefined): void {
        this._conPlayerFilter = value;
    }
    public createIfNotExistsConPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter {
        return this._conPlayerFilter ??= new $Message$CommonProto$Structure$PlayerFilter();
    }

    public checkHasConUnitFilter(): boolean {
        return this._conUnitFilter != null;
    }
    public getConUnitFilter(): $Message$CommonProto$Structure$UnitFilter | null | undefined {
        return this._conUnitFilter;
    }
    public setConUnitFilter(value: $Message$CommonProto$Structure$UnitFilter | null | undefined): void {
        this._conUnitFilter = value;
    }
    public createIfNotExistsConUnitFilter(): $Message$CommonProto$Structure$UnitFilter {
        return this._conUnitFilter ??= new $Message$CommonProto$Structure$UnitFilter();
    }

    public checkHasConUnitBuffFilter(): boolean {
        return this._conUnitBuffFilter != null;
    }
    public getConUnitBuffFilter(): $Message$CommonProto$Structure$UnitBuffFilter | null | undefined {
        return this._conUnitBuffFilter;
    }
    public setConUnitBuffFilter(value: $Message$CommonProto$Structure$UnitBuffFilter | null | undefined): void {
        this._conUnitBuffFilter = value;
    }
    public createIfNotExistsConUnitBuffFilter(): $Message$CommonProto$Structure$UnitBuffFilter {
        return this._conUnitBuffFilter ??= new $Message$CommonProto$Structure$UnitBuffFilter();
    }

    public checkHasConMaxModifyCount(): boolean {
        return this._conMaxModifyCount != null;
    }
    public getConMaxModifyCount(): number | null | undefined {
        return this._conMaxModifyCount;
    }
    public setConMaxModifyCount(value: number | null | undefined): void {
        this._conMaxModifyCount = value;
    }

    public checkHasActBuffType(): boolean {
        return this._actBuffType != null;
    }
    public getActBuffType(): number | null | undefined {
        return this._actBuffType;
    }
    public setActBuffType(value: number | null | undefined): void {
        this._actBuffType = value;
    }

    public checkHasActEndTurnIndex(): boolean {
        return this._actEndTurnIndex != null;
    }
    public getActEndTurnIndex(): number | null | undefined {
        return this._actEndTurnIndex;
    }
    public setActEndTurnIndex(value: number | null | undefined): void {
        this._actEndTurnIndex = value;
    }

    public checkHasActEndPlayerIndex(): boolean {
        return this._actEndPlayerIndex != null;
    }
    public getActEndPlayerIndex(): number | null | undefined {
        return this._actEndPlayerIndex;
    }
    public setActEndPlayerIndex(value: number | null | undefined): void {
        this._actEndPlayerIndex = value;
    }

    public checkHasActEndTurnIndexMode(): boolean {
        return this._actEndTurnIndexMode != null;
    }
    public getActEndTurnIndexMode(): number {
        return this._actEndTurnIndexMode ?? 0;
    }
    public setActEndTurnIndexMode(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actEndTurnIndexMode = null;
        } else {
            this._actEndTurnIndexMode = value;
        }
    }

    public checkHasActEndPlayerIndexMode(): boolean {
        return this._actEndPlayerIndexMode != null;
    }
    public getActEndPlayerIndexMode(): number {
        return this._actEndPlayerIndexMode ?? 0;
    }
    public setActEndPlayerIndexMode(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actEndPlayerIndexMode = null;
        } else {
            this._actEndPlayerIndexMode = value;
        }
    }
}
