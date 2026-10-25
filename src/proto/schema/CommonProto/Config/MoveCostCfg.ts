import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MoveCostCfgJson extends $ProtoSchemaJsonBase {
    tileTypeId?: number | null | undefined;
    moveTypeId?: number | null | undefined;
    cost?: number | null | undefined;
}

export class MoveCostCfg extends $ProtoSchemaBase {
    private _tileTypeId?: number | null | undefined;
    private _moveTypeId?: number | null | undefined;
    private _cost?: number | null | undefined;

    public static fromJson(obj: MoveCostCfgJson): MoveCostCfg {
        return new MoveCostCfg().loadJson(obj);
    }
    public override loadJson(obj: MoveCostCfgJson): this {
        this.setTileTypeId(obj.tileTypeId);
        this.setMoveTypeId(obj.moveTypeId);
        this.setCost(obj.cost);
        return this;
    }
    public override toJson(obj?: MoveCostCfgJson): MoveCostCfgJson {
        obj ??= ({} as MoveCostCfgJson);

        {
            const value = this.getTileTypeId();
            (value != null) && (obj.tileTypeId = value);
        }

        {
            const value = this.getMoveTypeId();
            (value != null) && (obj.moveTypeId = value);
        }

        {
            const value = this.getCost();
            (value != null) && (obj.cost = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTileTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMoveTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCost();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MoveCostCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MoveCostCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTileTypeId(reader.int32());
                    break;

                case 2:
                    msg.setMoveTypeId(reader.int32());
                    break;

                case 3:
                    msg.setCost(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MoveCostCfg {
        return MoveCostCfg.decode(this.encode());
    }

    public override getSchemaName(): "MoveCostCfg" {
        return "MoveCostCfg";
    }

    public checkHasTileTypeId(): boolean {
        return this._tileTypeId != null;
    }
    public getTileTypeId(): number {
        return this._tileTypeId ?? 0;
    }
    public setTileTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileTypeId = null;
        } else {
            this._tileTypeId = value;
        }
    }

    public checkHasMoveTypeId(): boolean {
        return this._moveTypeId != null;
    }
    public getMoveTypeId(): number {
        return this._moveTypeId ?? 0;
    }
    public setMoveTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._moveTypeId = null;
        } else {
            this._moveTypeId = value;
        }
    }

    public checkHasCost(): boolean {
        return this._cost != null;
    }
    public getCost(): number | null | undefined {
        return this._cost;
    }
    public setCost(value: number | null | undefined): void {
        this._cost = value;
    }
}
