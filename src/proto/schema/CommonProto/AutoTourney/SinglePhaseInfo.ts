import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SinglePhaseInfoJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    phase?: number | null | undefined;
}

export class SinglePhaseInfo extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _phase?: number | null | undefined;

    public static fromJson(obj: SinglePhaseInfoJson): SinglePhaseInfo {
        return new SinglePhaseInfo().loadJson(obj);
    }
    public override loadJson(obj: SinglePhaseInfoJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setPhase(obj.phase);
        return this;
    }
    public override toJson(obj?: SinglePhaseInfoJson): SinglePhaseInfoJson {
        obj ??= ({} as SinglePhaseInfoJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            const value = this.getPhase();
            (value != null) && (obj.phase = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTourneyId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPhase();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SinglePhaseInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SinglePhaseInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTourneyId(reader.int32());
                    break;

                case 2:
                    msg.setPhase(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SinglePhaseInfo {
        return SinglePhaseInfo.decode(this.encode());
    }

    public override getSchemaName(): "SinglePhaseInfo" {
        return "SinglePhaseInfo";
    }

    public checkHasTourneyId(): boolean {
        return this._tourneyId != null;
    }
    public getTourneyId(): number {
        return this._tourneyId ?? 0;
    }
    public setTourneyId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tourneyId = null;
        } else {
            this._tourneyId = value;
        }
    }

    public checkHasPhase(): boolean {
        return this._phase != null;
    }
    public getPhase(): number {
        return this._phase ?? 0;
    }
    public setPhase(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._phase = null;
        } else {
            this._phase = value;
        }
    }
}
