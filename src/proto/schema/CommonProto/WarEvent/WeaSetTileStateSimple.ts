import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ArrayModifier as $Message$CommonProto$Structure$ArrayModifier, type ArrayModifierJson as $Json$CommonProto$Structure$ArrayModifier } from "../Structure/ArrayModifier.js";
import { MultiplierAndOffset as $Message$CommonProto$Structure$MultiplierAndOffset, type MultiplierAndOffsetJson as $Json$CommonProto$Structure$MultiplierAndOffset } from "../Structure/MultiplierAndOffset.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WeaSetTileStateSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    actPlayerIndex?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCurrentHp?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCurrentBuildPoint?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCurrentCapturePoint?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actIsHighlighted?: boolean | null | undefined;
    actLocationIdArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actCustomNameId?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
}

export class WeaSetTileStateSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _actPlayerIndex?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCurrentHp?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCurrentBuildPoint?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCurrentCapturePoint?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actIsHighlighted?: boolean | null | undefined;
    private _actLocationIdArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actCustomNameId?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;

    public static fromJson(obj: WeaSetTileStateSimpleJson): WeaSetTileStateSimple {
        return new WeaSetTileStateSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetTileStateSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitComparator(obj.conUnitComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitComparator) : null);
        this.setActPlayerIndex(obj.actPlayerIndex != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actPlayerIndex) : null);
        this.setActCurrentHp(obj.actCurrentHp != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actCurrentHp) : null);
        this.setActCurrentBuildPoint(obj.actCurrentBuildPoint != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actCurrentBuildPoint) : null);
        this.setActCurrentCapturePoint(obj.actCurrentCapturePoint != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actCurrentCapturePoint) : null);
        this.setActIsHighlighted(obj.actIsHighlighted);
        this.setActLocationIdArray(obj.actLocationIdArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actLocationIdArray) : null);
        this.setActCustomNameId(obj.actCustomNameId != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actCustomNameId) : null);
        return this;
    }
    public override toJson(obj?: WeaSetTileStateSimpleJson): WeaSetTileStateSimpleJson {
        obj ??= ({} as WeaSetTileStateSimpleJson);

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
            const value = this.getActPlayerIndex();
            (value != null) && (obj.actPlayerIndex = value.toJson());
        }

        {
            const value = this.getActCurrentHp();
            (value != null) && (obj.actCurrentHp = value.toJson());
        }

        {
            const value = this.getActCurrentBuildPoint();
            (value != null) && (obj.actCurrentBuildPoint = value.toJson());
        }

        {
            const value = this.getActCurrentCapturePoint();
            (value != null) && (obj.actCurrentCapturePoint = value.toJson());
        }

        {
            const value = this.getActIsHighlighted();
            (value != null) && (obj.actIsHighlighted = value);
        }

        {
            const value = this.getActLocationIdArray();
            (value != null) && (obj.actLocationIdArray = value.toJson());
        }

        {
            const value = this.getActCustomNameId();
            (value != null) && (obj.actCustomNameId = value.toJson());
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
            const value = this.getActPlayerIndex();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getActCurrentHp();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getActCurrentBuildPoint();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getActCurrentCapturePoint();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getActIsHighlighted();
            if (value != null) {
                writer.uint32(112).bool(value);
            }
        }

        {
            const value = this.getActLocationIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getActCustomNameId();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetTileStateSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetTileStateSimple();
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
                    msg.setActPlayerIndex($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActCurrentHp($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setActCurrentBuildPoint($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setActCurrentCapturePoint($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setActIsHighlighted(reader.bool());
                    break;

                case 15:
                    msg.setActLocationIdArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setActCustomNameId($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetTileStateSimple {
        return WeaSetTileStateSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetTileStateSimple" {
        return "WeaSetTileStateSimple";
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

    public checkHasActPlayerIndex(): boolean {
        return this._actPlayerIndex != null;
    }
    public getActPlayerIndex(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actPlayerIndex;
    }
    public setActPlayerIndex(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actPlayerIndex = value;
    }
    public createIfNotExistsActPlayerIndex(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actPlayerIndex ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActCurrentHp(): boolean {
        return this._actCurrentHp != null;
    }
    public getActCurrentHp(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actCurrentHp;
    }
    public setActCurrentHp(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actCurrentHp = value;
    }
    public createIfNotExistsActCurrentHp(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actCurrentHp ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActCurrentBuildPoint(): boolean {
        return this._actCurrentBuildPoint != null;
    }
    public getActCurrentBuildPoint(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actCurrentBuildPoint;
    }
    public setActCurrentBuildPoint(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actCurrentBuildPoint = value;
    }
    public createIfNotExistsActCurrentBuildPoint(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actCurrentBuildPoint ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActCurrentCapturePoint(): boolean {
        return this._actCurrentCapturePoint != null;
    }
    public getActCurrentCapturePoint(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actCurrentCapturePoint;
    }
    public setActCurrentCapturePoint(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actCurrentCapturePoint = value;
    }
    public createIfNotExistsActCurrentCapturePoint(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actCurrentCapturePoint ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActIsHighlighted(): boolean {
        return this._actIsHighlighted != null;
    }
    public getActIsHighlighted(): boolean | null | undefined {
        return this._actIsHighlighted;
    }
    public setActIsHighlighted(value: boolean | null | undefined): void {
        this._actIsHighlighted = value;
    }

    public checkHasActLocationIdArray(): boolean {
        return this._actLocationIdArray != null;
    }
    public getActLocationIdArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actLocationIdArray;
    }
    public setActLocationIdArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actLocationIdArray = value;
    }
    public createIfNotExistsActLocationIdArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actLocationIdArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActCustomNameId(): boolean {
        return this._actCustomNameId != null;
    }
    public getActCustomNameId(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actCustomNameId;
    }
    public setActCustomNameId(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actCustomNameId = value;
    }
    public createIfNotExistsActCustomNameId(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actCustomNameId ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }
}
