import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";

export interface WeaAddUnitBuffSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    actBuffType?: number | null | undefined;
    actEndTurnIndex?: number | null | undefined;
    actEndPlayerIndex?: number | null | undefined;
    actExtraParams: number[];
    actIsRelativeEndTurnIndex?: boolean | null | undefined;
    actIsRelativeEndPlayerIndex?: boolean | null | undefined;
}

export class WeaAddUnitBuffSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _actBuffType?: number | null | undefined;
    private _actEndTurnIndex?: number | null | undefined;
    private _actEndPlayerIndex?: number | null | undefined;
    private _actExtraParams: number[] = [];
    private _actIsRelativeEndTurnIndex?: boolean | null | undefined;
    private _actIsRelativeEndPlayerIndex?: boolean | null | undefined;

    public static fromJson(obj: WeaAddUnitBuffSimpleJson): WeaAddUnitBuffSimple {
        return new WeaAddUnitBuffSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaAddUnitBuffSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setActBuffType(obj.actBuffType);
        this.setActEndTurnIndex(obj.actEndTurnIndex);
        this.setActEndPlayerIndex(obj.actEndPlayerIndex);
        this.setActExtraParams(obj.actExtraParams?.concat() ?? []);
        this.setActIsRelativeEndTurnIndex(obj.actIsRelativeEndTurnIndex);
        this.setActIsRelativeEndPlayerIndex(obj.actIsRelativeEndPlayerIndex);
        return this;
    }
    public override toJson(obj?: WeaAddUnitBuffSimpleJson): WeaAddUnitBuffSimpleJson {
        obj ??= ({} as WeaAddUnitBuffSimpleJson);

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
            obj.actExtraParams = this.getActExtraParams().concat();
        }

        {
            const value = this.getActIsRelativeEndTurnIndex();
            (value != null) && (obj.actIsRelativeEndTurnIndex = value);
        }

        {
            const value = this.getActIsRelativeEndPlayerIndex();
            (value != null) && (obj.actIsRelativeEndPlayerIndex = value);
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
            const value = this.getActBuffType();
            if ((value != null) && (value != 0)) {
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
            const value = this.getActExtraParams();
            const length = value.length;
            if (length) {
                writer.uint32(114).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getActIsRelativeEndTurnIndex();
            if ((value != null) && (value != false)) {
                writer.uint32(120).bool(value);
            }
        }

        {
            const value = this.getActIsRelativeEndPlayerIndex();
            if ((value != null) && (value != false)) {
                writer.uint32(128).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaAddUnitBuffSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaAddUnitBuffSimple();
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

                case 10:
                    msg.setActBuffType(reader.int32());
                    break;

                case 12:
                    msg.setActEndTurnIndex(reader.int32());
                    break;

                case 13:
                    msg.setActEndPlayerIndex(reader.int32());
                    break;

                case 14:
                    {
                        const arr = msg._actExtraParams;
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

                case 15:
                    msg.setActIsRelativeEndTurnIndex(reader.bool());
                    break;

                case 16:
                    msg.setActIsRelativeEndPlayerIndex(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaAddUnitBuffSimple {
        return WeaAddUnitBuffSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaAddUnitBuffSimple" {
        return "WeaAddUnitBuffSimple";
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

    public checkHasActBuffType(): boolean {
        return this._actBuffType != null;
    }
    public getActBuffType(): number {
        return this._actBuffType ?? 0;
    }
    public setActBuffType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actBuffType = null;
        } else {
            this._actBuffType = value;
        }
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

    public getActExtraParams(): number[] {
        return this._actExtraParams;
    }
    public setActExtraParams(value: number[]): void {
        this._actExtraParams = value;
    }

    public checkHasActIsRelativeEndTurnIndex(): boolean {
        return this._actIsRelativeEndTurnIndex != null;
    }
    public getActIsRelativeEndTurnIndex(): boolean {
        return this._actIsRelativeEndTurnIndex ?? false;
    }
    public setActIsRelativeEndTurnIndex(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actIsRelativeEndTurnIndex = null;
        } else {
            this._actIsRelativeEndTurnIndex = value;
        }
    }

    public checkHasActIsRelativeEndPlayerIndex(): boolean {
        return this._actIsRelativeEndPlayerIndex != null;
    }
    public getActIsRelativeEndPlayerIndex(): boolean {
        return this._actIsRelativeEndPlayerIndex ?? false;
    }
    public setActIsRelativeEndPlayerIndex(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actIsRelativeEndPlayerIndex = null;
        } else {
            this._actIsRelativeEndPlayerIndex = value;
        }
    }
}
