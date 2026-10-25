import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WeaSetTileTypeSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    actChangeTileBase?: boolean | null | undefined;
    actTileBaseType?: number | null | undefined;
    actTileBaseShapeId?: number | null | undefined;
    actChangeTileDecoration?: boolean | null | undefined;
    actDeleteTileDecoration?: boolean | null | undefined;
    actTileDecorationType?: number | null | undefined;
    actTileDecorationShapeId?: number | null | undefined;
    actChangeTileObject?: boolean | null | undefined;
    actDeleteTileObject?: boolean | null | undefined;
    actTileObjectType?: number | null | undefined;
    actTileObjectShapeId?: number | null | undefined;
}

export class WeaSetTileTypeSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _actChangeTileBase?: boolean | null | undefined;
    private _actTileBaseType?: number | null | undefined;
    private _actTileBaseShapeId?: number | null | undefined;
    private _actChangeTileDecoration?: boolean | null | undefined;
    private _actDeleteTileDecoration?: boolean | null | undefined;
    private _actTileDecorationType?: number | null | undefined;
    private _actTileDecorationShapeId?: number | null | undefined;
    private _actChangeTileObject?: boolean | null | undefined;
    private _actDeleteTileObject?: boolean | null | undefined;
    private _actTileObjectType?: number | null | undefined;
    private _actTileObjectShapeId?: number | null | undefined;

    public static fromJson(obj: WeaSetTileTypeSimpleJson): WeaSetTileTypeSimple {
        return new WeaSetTileTypeSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetTileTypeSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitComparator(obj.conUnitComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitComparator) : null);
        this.setActChangeTileBase(obj.actChangeTileBase);
        this.setActTileBaseType(obj.actTileBaseType);
        this.setActTileBaseShapeId(obj.actTileBaseShapeId);
        this.setActChangeTileDecoration(obj.actChangeTileDecoration);
        this.setActDeleteTileDecoration(obj.actDeleteTileDecoration);
        this.setActTileDecorationType(obj.actTileDecorationType);
        this.setActTileDecorationShapeId(obj.actTileDecorationShapeId);
        this.setActChangeTileObject(obj.actChangeTileObject);
        this.setActDeleteTileObject(obj.actDeleteTileObject);
        this.setActTileObjectType(obj.actTileObjectType);
        this.setActTileObjectShapeId(obj.actTileObjectShapeId);
        return this;
    }
    public override toJson(obj?: WeaSetTileTypeSimpleJson): WeaSetTileTypeSimpleJson {
        obj ??= ({} as WeaSetTileTypeSimpleJson);

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
            const value = this.getConUnitComparator();
            (value != null) && (obj.conUnitComparator = value.toJson());
        }

        {
            const value = this.getActChangeTileBase();
            (value != null) && (obj.actChangeTileBase = value);
        }

        {
            const value = this.getActTileBaseType();
            (value != null) && (obj.actTileBaseType = value);
        }

        {
            const value = this.getActTileBaseShapeId();
            (value != null) && (obj.actTileBaseShapeId = value);
        }

        {
            const value = this.getActChangeTileDecoration();
            (value != null) && (obj.actChangeTileDecoration = value);
        }

        {
            const value = this.getActDeleteTileDecoration();
            (value != null) && (obj.actDeleteTileDecoration = value);
        }

        {
            const value = this.getActTileDecorationType();
            (value != null) && (obj.actTileDecorationType = value);
        }

        {
            const value = this.getActTileDecorationShapeId();
            (value != null) && (obj.actTileDecorationShapeId = value);
        }

        {
            const value = this.getActChangeTileObject();
            (value != null) && (obj.actChangeTileObject = value);
        }

        {
            const value = this.getActDeleteTileObject();
            (value != null) && (obj.actDeleteTileObject = value);
        }

        {
            const value = this.getActTileObjectType();
            (value != null) && (obj.actTileObjectType = value);
        }

        {
            const value = this.getActTileObjectShapeId();
            (value != null) && (obj.actTileObjectShapeId = value);
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
            const value = this.getConUnitComparator();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getActChangeTileBase();
            if ((value != null) && (value != false)) {
                writer.uint32(80).bool(value);
            }
        }

        {
            const value = this.getActTileBaseType();
            if (value != null) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getActTileBaseShapeId();
            if (value != null) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getActChangeTileDecoration();
            if ((value != null) && (value != false)) {
                writer.uint32(104).bool(value);
            }
        }

        {
            const value = this.getActDeleteTileDecoration();
            if ((value != null) && (value != false)) {
                writer.uint32(112).bool(value);
            }
        }

        {
            const value = this.getActTileDecorationType();
            if (value != null) {
                writer.uint32(120).int32(value);
            }
        }

        {
            const value = this.getActTileDecorationShapeId();
            if (value != null) {
                writer.uint32(128).int32(value);
            }
        }

        {
            const value = this.getActChangeTileObject();
            if ((value != null) && (value != false)) {
                writer.uint32(136).bool(value);
            }
        }

        {
            const value = this.getActDeleteTileObject();
            if ((value != null) && (value != false)) {
                writer.uint32(144).bool(value);
            }
        }

        {
            const value = this.getActTileObjectType();
            if (value != null) {
                writer.uint32(152).int32(value);
            }
        }

        {
            const value = this.getActTileObjectShapeId();
            if (value != null) {
                writer.uint32(160).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetTileTypeSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetTileTypeSimple();
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

                case 4:
                    msg.setConUnitComparator($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setActChangeTileBase(reader.bool());
                    break;

                case 11:
                    msg.setActTileBaseType(reader.int32());
                    break;

                case 12:
                    msg.setActTileBaseShapeId(reader.int32());
                    break;

                case 13:
                    msg.setActChangeTileDecoration(reader.bool());
                    break;

                case 14:
                    msg.setActDeleteTileDecoration(reader.bool());
                    break;

                case 15:
                    msg.setActTileDecorationType(reader.int32());
                    break;

                case 16:
                    msg.setActTileDecorationShapeId(reader.int32());
                    break;

                case 17:
                    msg.setActChangeTileObject(reader.bool());
                    break;

                case 18:
                    msg.setActDeleteTileObject(reader.bool());
                    break;

                case 19:
                    msg.setActTileObjectType(reader.int32());
                    break;

                case 20:
                    msg.setActTileObjectShapeId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetTileTypeSimple {
        return WeaSetTileTypeSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetTileTypeSimple" {
        return "WeaSetTileTypeSimple";
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

    public checkHasConUnitComparator(): boolean {
        return this._conUnitComparator != null;
    }
    public getConUnitComparator(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conUnitComparator;
    }
    public setConUnitComparator(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conUnitComparator = value;
    }
    public createIfNotExistsConUnitComparator(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conUnitComparator ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasActChangeTileBase(): boolean {
        return this._actChangeTileBase != null;
    }
    public getActChangeTileBase(): boolean {
        return this._actChangeTileBase ?? false;
    }
    public setActChangeTileBase(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actChangeTileBase = null;
        } else {
            this._actChangeTileBase = value;
        }
    }

    public checkHasActTileBaseType(): boolean {
        return this._actTileBaseType != null;
    }
    public getActTileBaseType(): number | null | undefined {
        return this._actTileBaseType;
    }
    public setActTileBaseType(value: number | null | undefined): void {
        this._actTileBaseType = value;
    }

    public checkHasActTileBaseShapeId(): boolean {
        return this._actTileBaseShapeId != null;
    }
    public getActTileBaseShapeId(): number | null | undefined {
        return this._actTileBaseShapeId;
    }
    public setActTileBaseShapeId(value: number | null | undefined): void {
        this._actTileBaseShapeId = value;
    }

    public checkHasActChangeTileDecoration(): boolean {
        return this._actChangeTileDecoration != null;
    }
    public getActChangeTileDecoration(): boolean {
        return this._actChangeTileDecoration ?? false;
    }
    public setActChangeTileDecoration(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actChangeTileDecoration = null;
        } else {
            this._actChangeTileDecoration = value;
        }
    }

    public checkHasActDeleteTileDecoration(): boolean {
        return this._actDeleteTileDecoration != null;
    }
    public getActDeleteTileDecoration(): boolean {
        return this._actDeleteTileDecoration ?? false;
    }
    public setActDeleteTileDecoration(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actDeleteTileDecoration = null;
        } else {
            this._actDeleteTileDecoration = value;
        }
    }

    public checkHasActTileDecorationType(): boolean {
        return this._actTileDecorationType != null;
    }
    public getActTileDecorationType(): number | null | undefined {
        return this._actTileDecorationType;
    }
    public setActTileDecorationType(value: number | null | undefined): void {
        this._actTileDecorationType = value;
    }

    public checkHasActTileDecorationShapeId(): boolean {
        return this._actTileDecorationShapeId != null;
    }
    public getActTileDecorationShapeId(): number | null | undefined {
        return this._actTileDecorationShapeId;
    }
    public setActTileDecorationShapeId(value: number | null | undefined): void {
        this._actTileDecorationShapeId = value;
    }

    public checkHasActChangeTileObject(): boolean {
        return this._actChangeTileObject != null;
    }
    public getActChangeTileObject(): boolean {
        return this._actChangeTileObject ?? false;
    }
    public setActChangeTileObject(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actChangeTileObject = null;
        } else {
            this._actChangeTileObject = value;
        }
    }

    public checkHasActDeleteTileObject(): boolean {
        return this._actDeleteTileObject != null;
    }
    public getActDeleteTileObject(): boolean {
        return this._actDeleteTileObject ?? false;
    }
    public setActDeleteTileObject(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actDeleteTileObject = null;
        } else {
            this._actDeleteTileObject = value;
        }
    }

    public checkHasActTileObjectType(): boolean {
        return this._actTileObjectType != null;
    }
    public getActTileObjectType(): number | null | undefined {
        return this._actTileObjectType;
    }
    public setActTileObjectType(value: number | null | undefined): void {
        this._actTileObjectType = value;
    }

    public checkHasActTileObjectShapeId(): boolean {
        return this._actTileObjectShapeId != null;
    }
    public getActTileObjectShapeId(): number | null | undefined {
        return this._actTileObjectShapeId;
    }
    public setActTileObjectShapeId(value: number | null | undefined): void {
        this._actTileObjectShapeId = value;
    }
}
