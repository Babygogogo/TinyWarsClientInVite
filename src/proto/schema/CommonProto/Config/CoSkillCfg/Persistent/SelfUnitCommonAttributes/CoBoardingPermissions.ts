import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface CoBoardingPermissionsJson extends $ProtoSchemaJsonBase {
    conIsOwnTile?: boolean | null | undefined;
    actCanBoard?: boolean | null | undefined;
}

export class CoBoardingPermissions extends $ProtoSchemaBase {
    private _conIsOwnTile?: boolean | null | undefined;
    private _actCanBoard?: boolean | null | undefined;

    public static fromJson(obj: CoBoardingPermissionsJson): CoBoardingPermissions {
        return new CoBoardingPermissions().loadJson(obj);
    }
    public override loadJson(obj: CoBoardingPermissionsJson): this {
        this.setConIsOwnTile(obj.conIsOwnTile);
        this.setActCanBoard(obj.actCanBoard);
        return this;
    }
    public override toJson(obj?: CoBoardingPermissionsJson): CoBoardingPermissionsJson {
        obj ??= ({} as CoBoardingPermissionsJson);

        {
            const value = this.getConIsOwnTile();
            (value != null) && (obj.conIsOwnTile = value);
        }

        {
            const value = this.getActCanBoard();
            (value != null) && (obj.actCanBoard = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConIsOwnTile();
            if (value != null) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getActCanBoard();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoBoardingPermissions {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoBoardingPermissions();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConIsOwnTile(reader.bool());
                    break;

                case 2:
                    msg.setActCanBoard(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CoBoardingPermissions {
        return CoBoardingPermissions.decode(this.encode());
    }

    public override getSchemaName(): "CoBoardingPermissions" {
        return "CoBoardingPermissions";
    }

    public checkHasConIsOwnTile(): boolean {
        return this._conIsOwnTile != null;
    }
    public getConIsOwnTile(): boolean | null | undefined {
        return this._conIsOwnTile;
    }
    public setConIsOwnTile(value: boolean | null | undefined): void {
        this._conIsOwnTile = value;
    }

    public checkHasActCanBoard(): boolean {
        return this._actCanBoard != null;
    }
    public getActCanBoard(): boolean | null | undefined {
        return this._actCanBoard;
    }
    public setActCanBoard(value: boolean | null | undefined): void {
        this._actCanBoard = value;
    }
}
