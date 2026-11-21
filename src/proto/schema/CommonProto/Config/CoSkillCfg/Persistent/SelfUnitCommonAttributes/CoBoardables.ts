import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface CoBoardablesJson extends $ProtoSchemaJsonBase {
    isOwnTile?: boolean | null | undefined;
    canBoard?: boolean | null | undefined;
}

export class CoBoardables extends $ProtoSchemaBase {
    private _isOwnTile?: boolean | null | undefined;
    private _canBoard?: boolean | null | undefined;

    public static fromJson(obj: CoBoardablesJson): CoBoardables {
        return new CoBoardables().loadJson(obj);
    }
    public override loadJson(obj: CoBoardablesJson): this {
        this.setIsOwnTile(obj.isOwnTile);
        this.setCanBoard(obj.canBoard);
        return this;
    }
    public override toJson(obj?: CoBoardablesJson): CoBoardablesJson {
        obj ??= ({} as CoBoardablesJson);

        {
            const value = this.getIsOwnTile();
            (value != null) && (obj.isOwnTile = value);
        }

        {
            const value = this.getCanBoard();
            (value != null) && (obj.canBoard = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsOwnTile();
            if (value != null) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getCanBoard();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoBoardables {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoBoardables();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsOwnTile(reader.bool());
                    break;

                case 2:
                    msg.setCanBoard(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CoBoardables {
        return CoBoardables.decode(this.encode());
    }

    public override getSchemaName(): "CoBoardables" {
        return "CoBoardables";
    }

    public checkHasIsOwnTile(): boolean {
        return this._isOwnTile != null;
    }
    public getIsOwnTile(): boolean | null | undefined {
        return this._isOwnTile;
    }
    public setIsOwnTile(value: boolean | null | undefined): void {
        this._isOwnTile = value;
    }

    public checkHasCanBoard(): boolean {
        return this._canBoard != null;
    }
    public getCanBoard(): boolean | null | undefined {
        return this._canBoard;
    }
    public setCanBoard(value: boolean | null | undefined): void {
        this._canBoard = value;
    }
}
