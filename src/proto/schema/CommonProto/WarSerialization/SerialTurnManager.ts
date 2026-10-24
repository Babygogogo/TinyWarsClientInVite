import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SerialTurnManagerJson extends $ProtoSchemaJsonBase {
    turnIndex?: number | null | undefined;
    playerIndex?: number | null | undefined;
    turnPhaseCode?: number | null | undefined;
    enterTurnTime?: number | null | undefined;
}

export class SerialTurnManager extends $ProtoSchemaBase {
    private _turnIndex?: number | null | undefined;
    private _playerIndex?: number | null | undefined;
    private _turnPhaseCode?: number | null | undefined;
    private _enterTurnTime?: number | null | undefined;

    public static fromJson(obj: SerialTurnManagerJson): SerialTurnManager {
        return new SerialTurnManager().loadJson(obj);
    }
    public override loadJson(obj: SerialTurnManagerJson): this {
        this.setTurnIndex(obj.turnIndex);
        this.setPlayerIndex(obj.playerIndex);
        this.setTurnPhaseCode(obj.turnPhaseCode);
        this.setEnterTurnTime(obj.enterTurnTime);
        return this;
    }
    public override toJson(obj?: SerialTurnManagerJson): SerialTurnManagerJson {
        obj ??= ({} as SerialTurnManagerJson);

        {
            const value = this.getTurnIndex();
            (value != null) && (obj.turnIndex = value);
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getTurnPhaseCode();
            (value != null) && (obj.turnPhaseCode = value);
        }

        {
            const value = this.getEnterTurnTime();
            (value != null) && (obj.enterTurnTime = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTurnIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTurnPhaseCode();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getEnterTurnTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialTurnManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialTurnManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTurnIndex(reader.int32());
                    break;

                case 2:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 3:
                    msg.setTurnPhaseCode(reader.int32());
                    break;

                case 4:
                    msg.setEnterTurnTime(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialTurnManager {
        return SerialTurnManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialTurnManager" {
        return "SerialTurnManager";
    }

    public checkHasTurnIndex(): boolean {
        return this._turnIndex != null;
    }
    public getTurnIndex(): number {
        return this._turnIndex ?? 0;
    }
    public setTurnIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._turnIndex = null;
        } else {
            this._turnIndex = value;
        }
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number {
        return this._playerIndex ?? 0;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._playerIndex = null;
        } else {
            this._playerIndex = value;
        }
    }

    public checkHasTurnPhaseCode(): boolean {
        return this._turnPhaseCode != null;
    }
    public getTurnPhaseCode(): number {
        return this._turnPhaseCode ?? 0;
    }
    public setTurnPhaseCode(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._turnPhaseCode = null;
        } else {
            this._turnPhaseCode = value;
        }
    }

    public checkHasEnterTurnTime(): boolean {
        return this._enterTurnTime != null;
    }
    public getEnterTurnTime(): number {
        return this._enterTurnTime ?? 0;
    }
    public setEnterTurnTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._enterTurnTime = null;
        } else {
            this._enterTurnTime = value;
        }
    }
}
