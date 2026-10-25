import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CommonExtraDataForWarOperation as $Message$CommonProto$Structure$CommonExtraDataForWarOperation, type CommonExtraDataForWarOperationJson as $Json$CommonProto$Structure$CommonExtraDataForWarOperation } from "../../Structure/CommonExtraDataForWarOperation.js";
import { MovingUnitAndPath as $Message$CommonProto$Structure$MovingUnitAndPath, type MovingUnitAndPathJson as $Json$CommonProto$Structure$MovingUnitAndPath } from "../../Structure/MovingUnitAndPath.js";

export interface ExtraDataForUnitDropUnitJson extends $ProtoSchemaJsonBase {
    commonExtraData?: $Json$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    isDropBlocked?: boolean | null | undefined;
    droppingUnitAndPathArray: $Json$CommonProto$Structure$MovingUnitAndPath[];
}

export class ExtraDataForUnitDropUnit extends $ProtoSchemaBase {
    private _commonExtraData?: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    private _isDropBlocked?: boolean | null | undefined;
    private _droppingUnitAndPathArray: $Message$CommonProto$Structure$MovingUnitAndPath[] = [];

    public static fromJson(obj: ExtraDataForUnitDropUnitJson): ExtraDataForUnitDropUnit {
        return new ExtraDataForUnitDropUnit().loadJson(obj);
    }
    public override loadJson(obj: ExtraDataForUnitDropUnitJson): this {
        this.setCommonExtraData(obj.commonExtraData != null ? $Message$CommonProto$Structure$CommonExtraDataForWarOperation.fromJson(obj.commonExtraData) : null);
        this.setIsDropBlocked(obj.isDropBlocked);
        this.setDroppingUnitAndPathArray(obj.droppingUnitAndPathArray?.map(v => $Message$CommonProto$Structure$MovingUnitAndPath.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: ExtraDataForUnitDropUnitJson): ExtraDataForUnitDropUnitJson {
        obj ??= ({} as ExtraDataForUnitDropUnitJson);

        {
            const value = this.getCommonExtraData();
            (value != null) && (obj.commonExtraData = value.toJson());
        }

        {
            const value = this.getIsDropBlocked();
            (value != null) && (obj.isDropBlocked = value);
        }

        {
            obj.droppingUnitAndPathArray = this.getDroppingUnitAndPathArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCommonExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getIsDropBlocked();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getDroppingUnitAndPathArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ExtraDataForUnitDropUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ExtraDataForUnitDropUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCommonExtraData($Message$CommonProto$Structure$CommonExtraDataForWarOperation.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setIsDropBlocked(reader.bool());
                    break;

                case 3:
                    {
                        const arr = msg._droppingUnitAndPathArray;
                        arr.push($Message$CommonProto$Structure$MovingUnitAndPath.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ExtraDataForUnitDropUnit {
        return ExtraDataForUnitDropUnit.decode(this.encode());
    }

    public override getSchemaName(): "ExtraDataForUnitDropUnit" {
        return "ExtraDataForUnitDropUnit";
    }

    public checkHasCommonExtraData(): boolean {
        return this._commonExtraData != null;
    }
    public getCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined {
        return this._commonExtraData;
    }
    public setCommonExtraData(value: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined): void {
        this._commonExtraData = value;
    }
    public createIfNotExistsCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation {
        return this._commonExtraData ??= new $Message$CommonProto$Structure$CommonExtraDataForWarOperation();
    }

    public checkHasIsDropBlocked(): boolean {
        return this._isDropBlocked != null;
    }
    public getIsDropBlocked(): boolean | null | undefined {
        return this._isDropBlocked;
    }
    public setIsDropBlocked(value: boolean | null | undefined): void {
        this._isDropBlocked = value;
    }

    public getDroppingUnitAndPathArray(): $Message$CommonProto$Structure$MovingUnitAndPath[] {
        return this._droppingUnitAndPathArray;
    }
    public setDroppingUnitAndPathArray(value: $Message$CommonProto$Structure$MovingUnitAndPath[]): void {
        this._droppingUnitAndPathArray = value;
    }
}
