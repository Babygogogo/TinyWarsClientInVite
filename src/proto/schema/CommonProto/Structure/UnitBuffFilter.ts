import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "./ValueAndComparator.js";
import { ValueArrayAndPredicate as $Message$CommonProto$Structure$ValueArrayAndPredicate, type ValueArrayAndPredicateJson as $Json$CommonProto$Structure$ValueArrayAndPredicate } from "./ValueArrayAndPredicate.js";

export interface UnitBuffFilterJson extends $ProtoSchemaJsonBase {
    conBuffTypeId?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conEndTurnIndex?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conEndPlayerIndex?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conIsRelativeEndTurnIndex?: boolean | null | undefined;
    conIsRelativeEndPlayerIndex?: boolean | null | undefined;
    conIsEverlasting?: boolean | null | undefined;
}

export class UnitBuffFilter extends $ProtoSchemaBase {
    private _conBuffTypeId?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conEndTurnIndex?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conEndPlayerIndex?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conIsRelativeEndTurnIndex?: boolean | null | undefined;
    private _conIsRelativeEndPlayerIndex?: boolean | null | undefined;
    private _conIsEverlasting?: boolean | null | undefined;

    public static fromJson(obj: UnitBuffFilterJson): UnitBuffFilter {
        return new UnitBuffFilter().loadJson(obj);
    }
    public override loadJson(obj: UnitBuffFilterJson): this {
        this.setConBuffTypeId(obj.conBuffTypeId != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conBuffTypeId) : null);
        this.setConEndTurnIndex(obj.conEndTurnIndex != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conEndTurnIndex) : null);
        this.setConEndPlayerIndex(obj.conEndPlayerIndex != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conEndPlayerIndex) : null);
        this.setConIsRelativeEndTurnIndex(obj.conIsRelativeEndTurnIndex);
        this.setConIsRelativeEndPlayerIndex(obj.conIsRelativeEndPlayerIndex);
        this.setConIsEverlasting(obj.conIsEverlasting);
        return this;
    }
    public override toJson(obj?: UnitBuffFilterJson): UnitBuffFilterJson {
        obj ??= ({} as UnitBuffFilterJson);

        {
            const value = this.getConBuffTypeId();
            (value != null) && (obj.conBuffTypeId = value.toJson());
        }

        {
            const value = this.getConEndTurnIndex();
            (value != null) && (obj.conEndTurnIndex = value.toJson());
        }

        {
            const value = this.getConEndPlayerIndex();
            (value != null) && (obj.conEndPlayerIndex = value.toJson());
        }

        {
            const value = this.getConIsRelativeEndTurnIndex();
            (value != null) && (obj.conIsRelativeEndTurnIndex = value);
        }

        {
            const value = this.getConIsRelativeEndPlayerIndex();
            (value != null) && (obj.conIsRelativeEndPlayerIndex = value);
        }

        {
            const value = this.getConIsEverlasting();
            (value != null) && (obj.conIsEverlasting = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConBuffTypeId();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConEndTurnIndex();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConEndPlayerIndex();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConIsRelativeEndTurnIndex();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getConIsRelativeEndPlayerIndex();
            if ((value != null) && (value != false)) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getConIsEverlasting();
            if (value != null) {
                writer.uint32(48).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitBuffFilter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitBuffFilter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConBuffTypeId($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConEndTurnIndex($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConEndPlayerIndex($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setConIsRelativeEndTurnIndex(reader.bool());
                    break;

                case 5:
                    msg.setConIsRelativeEndPlayerIndex(reader.bool());
                    break;

                case 6:
                    msg.setConIsEverlasting(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UnitBuffFilter {
        return UnitBuffFilter.decode(this.encode());
    }

    public override getSchemaName(): "UnitBuffFilter" {
        return "UnitBuffFilter";
    }

    public checkHasConBuffTypeId(): boolean {
        return this._conBuffTypeId != null;
    }
    public getConBuffTypeId(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conBuffTypeId;
    }
    public setConBuffTypeId(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conBuffTypeId = value;
    }
    public createIfNotExistsConBuffTypeId(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conBuffTypeId ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConEndTurnIndex(): boolean {
        return this._conEndTurnIndex != null;
    }
    public getConEndTurnIndex(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conEndTurnIndex;
    }
    public setConEndTurnIndex(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conEndTurnIndex = value;
    }
    public createIfNotExistsConEndTurnIndex(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conEndTurnIndex ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConEndPlayerIndex(): boolean {
        return this._conEndPlayerIndex != null;
    }
    public getConEndPlayerIndex(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conEndPlayerIndex;
    }
    public setConEndPlayerIndex(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conEndPlayerIndex = value;
    }
    public createIfNotExistsConEndPlayerIndex(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conEndPlayerIndex ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConIsRelativeEndTurnIndex(): boolean {
        return this._conIsRelativeEndTurnIndex != null;
    }
    public getConIsRelativeEndTurnIndex(): boolean {
        return this._conIsRelativeEndTurnIndex ?? false;
    }
    public setConIsRelativeEndTurnIndex(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._conIsRelativeEndTurnIndex = null;
        } else {
            this._conIsRelativeEndTurnIndex = value;
        }
    }

    public checkHasConIsRelativeEndPlayerIndex(): boolean {
        return this._conIsRelativeEndPlayerIndex != null;
    }
    public getConIsRelativeEndPlayerIndex(): boolean {
        return this._conIsRelativeEndPlayerIndex ?? false;
    }
    public setConIsRelativeEndPlayerIndex(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._conIsRelativeEndPlayerIndex = null;
        } else {
            this._conIsRelativeEndPlayerIndex = value;
        }
    }

    public checkHasConIsEverlasting(): boolean {
        return this._conIsEverlasting != null;
    }
    public getConIsEverlasting(): boolean | null | undefined {
        return this._conIsEverlasting;
    }
    public setConIsEverlasting(value: boolean | null | undefined): void {
        this._conIsEverlasting = value;
    }
}
