import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "./GridIndex.js";

export interface GridIndexAndPathInfoJson extends $ProtoSchemaJsonBase {
    gridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    isVisible?: boolean | null | undefined;
    isBlocked?: boolean | null | undefined;
}

export class GridIndexAndPathInfo extends $ProtoSchemaBase {
    private _gridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _isVisible?: boolean | null | undefined;
    private _isBlocked?: boolean | null | undefined;

    public static fromJson(obj: GridIndexAndPathInfoJson): GridIndexAndPathInfo {
        return new GridIndexAndPathInfo().loadJson(obj);
    }
    public override loadJson(obj: GridIndexAndPathInfoJson): this {
        this.setGridIndex(obj.gridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.gridIndex) : null);
        this.setIsVisible(obj.isVisible);
        this.setIsBlocked(obj.isBlocked);
        return this;
    }
    public override toJson(obj?: GridIndexAndPathInfoJson): GridIndexAndPathInfoJson {
        obj ??= ({} as GridIndexAndPathInfoJson);

        {
            const value = this.getGridIndex();
            (value != null) && (obj.gridIndex = value.toJson());
        }

        {
            const value = this.getIsVisible();
            (value != null) && (obj.isVisible = value);
        }

        {
            const value = this.getIsBlocked();
            (value != null) && (obj.isBlocked = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getIsVisible();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getIsBlocked();
            if ((value != null) && (value != false)) {
                writer.uint32(24).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): GridIndexAndPathInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new GridIndexAndPathInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setIsVisible(reader.bool());
                    break;

                case 3:
                    msg.setIsBlocked(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): GridIndexAndPathInfo {
        return GridIndexAndPathInfo.decode(this.encode());
    }

    public override getSchemaName(): "GridIndexAndPathInfo" {
        return "GridIndexAndPathInfo";
    }

    public checkHasGridIndex(): boolean {
        return this._gridIndex != null;
    }
    public getGridIndex(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._gridIndex;
    }
    public setGridIndex(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._gridIndex = value;
    }
    public createIfNotExistsGridIndex(): $Message$CommonProto$Structure$GridIndex {
        return this._gridIndex ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasIsVisible(): boolean {
        return this._isVisible != null;
    }
    public getIsVisible(): boolean {
        return this._isVisible ?? false;
    }
    public setIsVisible(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isVisible = null;
        } else {
            this._isVisible = value;
        }
    }

    public checkHasIsBlocked(): boolean {
        return this._isBlocked != null;
    }
    public getIsBlocked(): boolean {
        return this._isBlocked ?? false;
    }
    public setIsBlocked(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isBlocked = null;
        } else {
            this._isBlocked = value;
        }
    }
}
