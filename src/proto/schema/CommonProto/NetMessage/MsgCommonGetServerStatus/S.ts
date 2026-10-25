import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    totalAccounts?: number | null | undefined;
    totalOnlineTime?: number | null | undefined;
    activeAccounts: number[];
    newAccounts: number[];
    ongoingMpwInfo: number[];
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _totalAccounts?: number | null | undefined;
    private _totalOnlineTime?: number | null | undefined;
    private _activeAccounts: number[] = [];
    private _newAccounts: number[] = [];
    private _ongoingMpwInfo: number[] = [];

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setTotalAccounts(obj.totalAccounts);
        this.setTotalOnlineTime(obj.totalOnlineTime);
        this.setActiveAccounts(obj.activeAccounts?.concat() ?? []);
        this.setNewAccounts(obj.newAccounts?.concat() ?? []);
        this.setOngoingMpwInfo(obj.ongoingMpwInfo?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getTotalAccounts();
            (value != null) && (obj.totalAccounts = value);
        }

        {
            const value = this.getTotalOnlineTime();
            (value != null) && (obj.totalOnlineTime = value);
        }

        {
            obj.activeAccounts = this.getActiveAccounts().concat();
        }

        {
            obj.newAccounts = this.getNewAccounts().concat();
        }

        {
            obj.ongoingMpwInfo = this.getOngoingMpwInfo().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTotalAccounts();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTotalOnlineTime();
            if (value != null) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getActiveAccounts();
            const length = value.length;
            if (length) {
                writer.uint32(34).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getNewAccounts();
            const length = value.length;
            if (length) {
                writer.uint32(42).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getOngoingMpwInfo();
            const length = value.length;
            if (length) {
                writer.uint32(50).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setTotalAccounts(reader.int32());
                    break;

                case 3:
                    msg.setTotalOnlineTime(reader.uint32());
                    break;

                case 4:
                    {
                        const arr = msg._activeAccounts;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 5:
                    {
                        const arr = msg._newAccounts;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 6:
                    {
                        const arr = msg._ongoingMpwInfo;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
    }

    public checkHasTotalAccounts(): boolean {
        return this._totalAccounts != null;
    }
    public getTotalAccounts(): number | null | undefined {
        return this._totalAccounts;
    }
    public setTotalAccounts(value: number | null | undefined): void {
        this._totalAccounts = value;
    }

    public checkHasTotalOnlineTime(): boolean {
        return this._totalOnlineTime != null;
    }
    public getTotalOnlineTime(): number | null | undefined {
        return this._totalOnlineTime;
    }
    public setTotalOnlineTime(value: number | null | undefined): void {
        this._totalOnlineTime = value;
    }

    public getActiveAccounts(): number[] {
        return this._activeAccounts;
    }
    public setActiveAccounts(value: number[]): void {
        this._activeAccounts = value;
    }

    public getNewAccounts(): number[] {
        return this._newAccounts;
    }
    public setNewAccounts(value: number[]): void {
        this._newAccounts = value;
    }

    public getOngoingMpwInfo(): number[] {
        return this._ongoingMpwInfo;
    }
    public setOngoingMpwInfo(value: number[]): void {
        this._ongoingMpwInfo = value;
    }
}
