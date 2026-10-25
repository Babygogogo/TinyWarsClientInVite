import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetPlayerStateExprJson extends $ProtoSchemaJsonBase {
    conPlayerFilter?: string | null | undefined;
    actFund?: string | null | undefined;
    actCoEnergy?: string | null | undefined;
    actAliveState?: string | null | undefined;
    actIsSkipTurn?: string | null | undefined;
    actCoUsingSkillType?: string | null | undefined;
    actActivateCoSkillType?: string | null | undefined;
    actCoId?: string | null | undefined;
}

export class WeaSetPlayerStateExpr extends $ProtoSchemaBase {
    private _conPlayerFilter?: string | null | undefined;
    private _actFund?: string | null | undefined;
    private _actCoEnergy?: string | null | undefined;
    private _actAliveState?: string | null | undefined;
    private _actIsSkipTurn?: string | null | undefined;
    private _actCoUsingSkillType?: string | null | undefined;
    private _actActivateCoSkillType?: string | null | undefined;
    private _actCoId?: string | null | undefined;

    public static fromJson(obj: WeaSetPlayerStateExprJson): WeaSetPlayerStateExpr {
        return new WeaSetPlayerStateExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetPlayerStateExprJson): this {
        this.setConPlayerFilter(obj.conPlayerFilter);
        this.setActFund(obj.actFund);
        this.setActCoEnergy(obj.actCoEnergy);
        this.setActAliveState(obj.actAliveState);
        this.setActIsSkipTurn(obj.actIsSkipTurn);
        this.setActCoUsingSkillType(obj.actCoUsingSkillType);
        this.setActActivateCoSkillType(obj.actActivateCoSkillType);
        this.setActCoId(obj.actCoId);
        return this;
    }
    public override toJson(obj?: WeaSetPlayerStateExprJson): WeaSetPlayerStateExprJson {
        obj ??= ({} as WeaSetPlayerStateExprJson);

        {
            const value = this.getConPlayerFilter();
            (value != null) && (obj.conPlayerFilter = value);
        }

        {
            const value = this.getActFund();
            (value != null) && (obj.actFund = value);
        }

        {
            const value = this.getActCoEnergy();
            (value != null) && (obj.actCoEnergy = value);
        }

        {
            const value = this.getActAliveState();
            (value != null) && (obj.actAliveState = value);
        }

        {
            const value = this.getActIsSkipTurn();
            (value != null) && (obj.actIsSkipTurn = value);
        }

        {
            const value = this.getActCoUsingSkillType();
            (value != null) && (obj.actCoUsingSkillType = value);
        }

        {
            const value = this.getActActivateCoSkillType();
            (value != null) && (obj.actActivateCoSkillType = value);
        }

        {
            const value = this.getActCoId();
            (value != null) && (obj.actCoId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConPlayerFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActFund();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getActCoEnergy();
            if (value != null) {
                writer.uint32(26).string(value);
            }
        }

        {
            const value = this.getActAliveState();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getActIsSkipTurn();
            if (value != null) {
                writer.uint32(42).string(value);
            }
        }

        {
            const value = this.getActCoUsingSkillType();
            if (value != null) {
                writer.uint32(50).string(value);
            }
        }

        {
            const value = this.getActActivateCoSkillType();
            if (value != null) {
                writer.uint32(58).string(value);
            }
        }

        {
            const value = this.getActCoId();
            if (value != null) {
                writer.uint32(66).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetPlayerStateExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetPlayerStateExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConPlayerFilter(reader.string());
                    break;

                case 2:
                    msg.setActFund(reader.string());
                    break;

                case 3:
                    msg.setActCoEnergy(reader.string());
                    break;

                case 4:
                    msg.setActAliveState(reader.string());
                    break;

                case 5:
                    msg.setActIsSkipTurn(reader.string());
                    break;

                case 6:
                    msg.setActCoUsingSkillType(reader.string());
                    break;

                case 7:
                    msg.setActActivateCoSkillType(reader.string());
                    break;

                case 8:
                    msg.setActCoId(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetPlayerStateExpr {
        return WeaSetPlayerStateExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetPlayerStateExpr" {
        return "WeaSetPlayerStateExpr";
    }

    public checkHasConPlayerFilter(): boolean {
        return this._conPlayerFilter != null;
    }
    public getConPlayerFilter(): string | null | undefined {
        return this._conPlayerFilter;
    }
    public setConPlayerFilter(value: string | null | undefined): void {
        this._conPlayerFilter = value;
    }

    public checkHasActFund(): boolean {
        return this._actFund != null;
    }
    public getActFund(): string | null | undefined {
        return this._actFund;
    }
    public setActFund(value: string | null | undefined): void {
        this._actFund = value;
    }

    public checkHasActCoEnergy(): boolean {
        return this._actCoEnergy != null;
    }
    public getActCoEnergy(): string | null | undefined {
        return this._actCoEnergy;
    }
    public setActCoEnergy(value: string | null | undefined): void {
        this._actCoEnergy = value;
    }

    public checkHasActAliveState(): boolean {
        return this._actAliveState != null;
    }
    public getActAliveState(): string | null | undefined {
        return this._actAliveState;
    }
    public setActAliveState(value: string | null | undefined): void {
        this._actAliveState = value;
    }

    public checkHasActIsSkipTurn(): boolean {
        return this._actIsSkipTurn != null;
    }
    public getActIsSkipTurn(): string | null | undefined {
        return this._actIsSkipTurn;
    }
    public setActIsSkipTurn(value: string | null | undefined): void {
        this._actIsSkipTurn = value;
    }

    public checkHasActCoUsingSkillType(): boolean {
        return this._actCoUsingSkillType != null;
    }
    public getActCoUsingSkillType(): string | null | undefined {
        return this._actCoUsingSkillType;
    }
    public setActCoUsingSkillType(value: string | null | undefined): void {
        this._actCoUsingSkillType = value;
    }

    public checkHasActActivateCoSkillType(): boolean {
        return this._actActivateCoSkillType != null;
    }
    public getActActivateCoSkillType(): string | null | undefined {
        return this._actActivateCoSkillType;
    }
    public setActActivateCoSkillType(value: string | null | undefined): void {
        this._actActivateCoSkillType = value;
    }

    public checkHasActCoId(): boolean {
        return this._actCoId != null;
    }
    public getActCoId(): string | null | undefined {
        return this._actCoId;
    }
    public setActCoId(value: string | null | undefined): void {
        this._actCoId = value;
    }
}
