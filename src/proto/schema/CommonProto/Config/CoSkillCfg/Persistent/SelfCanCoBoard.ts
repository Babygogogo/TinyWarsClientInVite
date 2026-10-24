import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfCanCoBoardJson extends $ProtoSchemaJsonBase {
    unitCategoryId?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
    isOwnTile?: boolean | null | undefined;
    canBoard?: boolean | null | undefined;
}

export class SelfCanCoBoard extends $ProtoSchemaBase {
    private _unitCategoryId?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;
    private _isOwnTile?: boolean | null | undefined;
    private _canBoard?: boolean | null | undefined;

    public static fromJson(obj: SelfCanCoBoardJson): SelfCanCoBoard {
        return new SelfCanCoBoard().loadJson(obj);
    }
    public override loadJson(obj: SelfCanCoBoardJson): this {
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setTileCategoryId(obj.tileCategoryId);
        this.setIsOwnTile(obj.isOwnTile);
        this.setCanBoard(obj.canBoard);
        return this;
    }
    public override toJson(obj?: SelfCanCoBoardJson): SelfCanCoBoardJson {
        obj ??= ({} as SelfCanCoBoardJson);

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getTileCategoryId();
            (value != null) && (obj.tileCategoryId = value);
        }

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
            const value = this.getUnitCategoryId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTileCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getIsOwnTile();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getCanBoard();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfCanCoBoard {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfCanCoBoard();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitCategoryId(reader.int32());
                    break;

                case 2:
                    msg.setTileCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setIsOwnTile(reader.bool());
                    break;

                case 4:
                    msg.setCanBoard(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfCanCoBoard {
        return SelfCanCoBoard.decode(this.encode());
    }

    public override getSchemaName(): "SelfCanCoBoard" {
        return "SelfCanCoBoard";
    }

    public checkHasUnitCategoryId(): boolean {
        return this._unitCategoryId != null;
    }
    public getUnitCategoryId(): number | null | undefined {
        return this._unitCategoryId;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        this._unitCategoryId = value;
    }

    public checkHasTileCategoryId(): boolean {
        return this._tileCategoryId != null;
    }
    public getTileCategoryId(): number | null | undefined {
        return this._tileCategoryId;
    }
    public setTileCategoryId(value: number | null | undefined): void {
        this._tileCategoryId = value;
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
    public getCanBoard(): boolean {
        return this._canBoard ?? false;
    }
    public setCanBoard(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canBoard = null;
        } else {
            this._canBoard = value;
        }
    }
}
