import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndexArrayAndPredicate as $Message$CommonProto$Structure$GridIndexArrayAndPredicate, type GridIndexArrayAndPredicateJson as $Json$CommonProto$Structure$GridIndexArrayAndPredicate } from "./GridIndexArrayAndPredicate.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "./ValueAndComparator.js";
import { ValueArrayAndPredicate as $Message$CommonProto$Structure$ValueArrayAndPredicate, type ValueArrayAndPredicateJson as $Json$CommonProto$Structure$ValueArrayAndPredicate } from "./ValueArrayAndPredicate.js";
import { ValueSetAndRelation as $Message$CommonProto$Structure$ValueSetAndRelation, type ValueSetAndRelationJson as $Json$CommonProto$Structure$ValueSetAndRelation } from "./ValueSetAndRelation.js";

export interface TileFilterJson extends $ProtoSchemaJsonBase {
    conPlayerIndex?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conTeamIndex?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conTileType?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conIsOwnerPlayerInTurn?: boolean | null | undefined;
    conIsHighlighted?: boolean | null | undefined;
    conHp?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conCapturePoint?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conBuildPoint?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conUnitsCount?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conGridIndex?: $Json$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined;
    conLocationId?: $Json$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    conCustomNameId?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conBuffTypeId?: $Json$CommonProto$Structure$ValueSetAndRelation | null | undefined;
}

export class TileFilter extends $ProtoSchemaBase {
    private _conPlayerIndex?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conTeamIndex?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conTileType?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conIsOwnerPlayerInTurn?: boolean | null | undefined;
    private _conIsHighlighted?: boolean | null | undefined;
    private _conHp?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conCapturePoint?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conBuildPoint?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conUnitsCount?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conGridIndex?: $Message$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined;
    private _conLocationId?: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    private _conCustomNameId?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conBuffTypeId?: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined;

    public static fromJson(obj: TileFilterJson): TileFilter {
        return new TileFilter().loadJson(obj);
    }
    public override loadJson(obj: TileFilterJson): this {
        this.setConPlayerIndex(obj.conPlayerIndex != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conPlayerIndex) : null);
        this.setConTeamIndex(obj.conTeamIndex != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conTeamIndex) : null);
        this.setConTileType(obj.conTileType != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conTileType) : null);
        this.setConIsOwnerPlayerInTurn(obj.conIsOwnerPlayerInTurn);
        this.setConIsHighlighted(obj.conIsHighlighted);
        this.setConHp(obj.conHp != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conHp) : null);
        this.setConCapturePoint(obj.conCapturePoint != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conCapturePoint) : null);
        this.setConBuildPoint(obj.conBuildPoint != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conBuildPoint) : null);
        this.setConUnitsCount(obj.conUnitsCount != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitsCount) : null);
        this.setConGridIndex(obj.conGridIndex != null ? $Message$CommonProto$Structure$GridIndexArrayAndPredicate.fromJson(obj.conGridIndex) : null);
        this.setConLocationId(obj.conLocationId != null ? $Message$CommonProto$Structure$ValueSetAndRelation.fromJson(obj.conLocationId) : null);
        this.setConCustomNameId(obj.conCustomNameId != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conCustomNameId) : null);
        this.setConBuffTypeId(obj.conBuffTypeId != null ? $Message$CommonProto$Structure$ValueSetAndRelation.fromJson(obj.conBuffTypeId) : null);
        return this;
    }
    public override toJson(obj?: TileFilterJson): TileFilterJson {
        obj ??= ({} as TileFilterJson);

        {
            const value = this.getConPlayerIndex();
            (value != null) && (obj.conPlayerIndex = value.toJson());
        }

        {
            const value = this.getConTeamIndex();
            (value != null) && (obj.conTeamIndex = value.toJson());
        }

        {
            const value = this.getConTileType();
            (value != null) && (obj.conTileType = value.toJson());
        }

        {
            const value = this.getConIsOwnerPlayerInTurn();
            (value != null) && (obj.conIsOwnerPlayerInTurn = value);
        }

        {
            const value = this.getConIsHighlighted();
            (value != null) && (obj.conIsHighlighted = value);
        }

        {
            const value = this.getConHp();
            (value != null) && (obj.conHp = value.toJson());
        }

        {
            const value = this.getConCapturePoint();
            (value != null) && (obj.conCapturePoint = value.toJson());
        }

        {
            const value = this.getConBuildPoint();
            (value != null) && (obj.conBuildPoint = value.toJson());
        }

        {
            const value = this.getConUnitsCount();
            (value != null) && (obj.conUnitsCount = value.toJson());
        }

        {
            const value = this.getConGridIndex();
            (value != null) && (obj.conGridIndex = value.toJson());
        }

        {
            const value = this.getConLocationId();
            (value != null) && (obj.conLocationId = value.toJson());
        }

        {
            const value = this.getConCustomNameId();
            (value != null) && (obj.conCustomNameId = value.toJson());
        }

        {
            const value = this.getConBuffTypeId();
            (value != null) && (obj.conBuffTypeId = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConPlayerIndex();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConTeamIndex();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConTileType();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConIsOwnerPlayerInTurn();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getConIsHighlighted();
            if (value != null) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getConHp();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getConCapturePoint();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getConBuildPoint();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitsCount();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getConGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getConLocationId();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getConCustomNameId();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getConBuffTypeId();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileFilter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileFilter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConPlayerIndex($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConTeamIndex($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConTileType($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setConIsOwnerPlayerInTurn(reader.bool());
                    break;

                case 5:
                    msg.setConIsHighlighted(reader.bool());
                    break;

                case 6:
                    msg.setConHp($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setConCapturePoint($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setConBuildPoint($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setConUnitsCount($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setConGridIndex($Message$CommonProto$Structure$GridIndexArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setConLocationId($Message$CommonProto$Structure$ValueSetAndRelation.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setConCustomNameId($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setConBuffTypeId($Message$CommonProto$Structure$ValueSetAndRelation.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TileFilter {
        return TileFilter.decode(this.encode());
    }

    public override getSchemaName(): "TileFilter" {
        return "TileFilter";
    }

    public checkHasConPlayerIndex(): boolean {
        return this._conPlayerIndex != null;
    }
    public getConPlayerIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conPlayerIndex;
    }
    public setConPlayerIndex(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conPlayerIndex = value;
    }
    public createIfNotExistsConPlayerIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conPlayerIndex ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConTeamIndex(): boolean {
        return this._conTeamIndex != null;
    }
    public getConTeamIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conTeamIndex;
    }
    public setConTeamIndex(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conTeamIndex = value;
    }
    public createIfNotExistsConTeamIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conTeamIndex ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConTileType(): boolean {
        return this._conTileType != null;
    }
    public getConTileType(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conTileType;
    }
    public setConTileType(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conTileType = value;
    }
    public createIfNotExistsConTileType(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conTileType ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConIsOwnerPlayerInTurn(): boolean {
        return this._conIsOwnerPlayerInTurn != null;
    }
    public getConIsOwnerPlayerInTurn(): boolean | null | undefined {
        return this._conIsOwnerPlayerInTurn;
    }
    public setConIsOwnerPlayerInTurn(value: boolean | null | undefined): void {
        this._conIsOwnerPlayerInTurn = value;
    }

    public checkHasConIsHighlighted(): boolean {
        return this._conIsHighlighted != null;
    }
    public getConIsHighlighted(): boolean | null | undefined {
        return this._conIsHighlighted;
    }
    public setConIsHighlighted(value: boolean | null | undefined): void {
        this._conIsHighlighted = value;
    }

    public checkHasConHp(): boolean {
        return this._conHp != null;
    }
    public getConHp(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conHp;
    }
    public setConHp(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conHp = value;
    }
    public createIfNotExistsConHp(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conHp ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConCapturePoint(): boolean {
        return this._conCapturePoint != null;
    }
    public getConCapturePoint(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conCapturePoint;
    }
    public setConCapturePoint(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conCapturePoint = value;
    }
    public createIfNotExistsConCapturePoint(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conCapturePoint ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConBuildPoint(): boolean {
        return this._conBuildPoint != null;
    }
    public getConBuildPoint(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conBuildPoint;
    }
    public setConBuildPoint(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conBuildPoint = value;
    }
    public createIfNotExistsConBuildPoint(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conBuildPoint ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConUnitsCount(): boolean {
        return this._conUnitsCount != null;
    }
    public getConUnitsCount(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conUnitsCount;
    }
    public setConUnitsCount(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conUnitsCount = value;
    }
    public createIfNotExistsConUnitsCount(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conUnitsCount ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConGridIndex(): boolean {
        return this._conGridIndex != null;
    }
    public getConGridIndex(): $Message$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined {
        return this._conGridIndex;
    }
    public setConGridIndex(value: $Message$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined): void {
        this._conGridIndex = value;
    }
    public createIfNotExistsConGridIndex(): $Message$CommonProto$Structure$GridIndexArrayAndPredicate {
        return this._conGridIndex ??= new $Message$CommonProto$Structure$GridIndexArrayAndPredicate();
    }

    public checkHasConLocationId(): boolean {
        return this._conLocationId != null;
    }
    public getConLocationId(): $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined {
        return this._conLocationId;
    }
    public setConLocationId(value: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined): void {
        this._conLocationId = value;
    }
    public createIfNotExistsConLocationId(): $Message$CommonProto$Structure$ValueSetAndRelation {
        return this._conLocationId ??= new $Message$CommonProto$Structure$ValueSetAndRelation();
    }

    public checkHasConCustomNameId(): boolean {
        return this._conCustomNameId != null;
    }
    public getConCustomNameId(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conCustomNameId;
    }
    public setConCustomNameId(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conCustomNameId = value;
    }
    public createIfNotExistsConCustomNameId(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conCustomNameId ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConBuffTypeId(): boolean {
        return this._conBuffTypeId != null;
    }
    public getConBuffTypeId(): $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined {
        return this._conBuffTypeId;
    }
    public setConBuffTypeId(value: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined): void {
        this._conBuffTypeId = value;
    }
    public createIfNotExistsConBuffTypeId(): $Message$CommonProto$Structure$ValueSetAndRelation {
        return this._conBuffTypeId ??= new $Message$CommonProto$Structure$ValueSetAndRelation();
    }
}
