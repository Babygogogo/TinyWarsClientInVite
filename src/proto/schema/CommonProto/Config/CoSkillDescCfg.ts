import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface CoSkillDescCfgJson extends $ProtoSchemaJsonBase {
    coId?: number | null | undefined;
    d2d0: string[];
    d2d1: string[];
    d2d2: string[];
    p0: string[];
    p1: string[];
    p2: string[];
    sp0: string[];
    sp1: string[];
    sp2: string[];
    d2dExtra0: string[];
    d2dExtra1: string[];
    d2dExtra2: string[];
    pExtra0: string[];
    pExtra1: string[];
    pExtra2: string[];
    spExtra0: string[];
    spExtra1: string[];
    spExtra2: string[];
}

export class CoSkillDescCfg extends $ProtoSchemaBase {
    private _coId?: number | null | undefined;
    private _d2d0: string[] = [];
    private _d2d1: string[] = [];
    private _d2d2: string[] = [];
    private _p0: string[] = [];
    private _p1: string[] = [];
    private _p2: string[] = [];
    private _sp0: string[] = [];
    private _sp1: string[] = [];
    private _sp2: string[] = [];
    private _d2dExtra0: string[] = [];
    private _d2dExtra1: string[] = [];
    private _d2dExtra2: string[] = [];
    private _pExtra0: string[] = [];
    private _pExtra1: string[] = [];
    private _pExtra2: string[] = [];
    private _spExtra0: string[] = [];
    private _spExtra1: string[] = [];
    private _spExtra2: string[] = [];

    public static fromJson(obj: CoSkillDescCfgJson): CoSkillDescCfg {
        return new CoSkillDescCfg().loadJson(obj);
    }
    public override loadJson(obj: CoSkillDescCfgJson): this {
        this.setCoId(obj.coId);
        this.setD2d0(obj.d2d0?.concat() ?? []);
        this.setD2d1(obj.d2d1?.concat() ?? []);
        this.setD2d2(obj.d2d2?.concat() ?? []);
        this.setP0(obj.p0?.concat() ?? []);
        this.setP1(obj.p1?.concat() ?? []);
        this.setP2(obj.p2?.concat() ?? []);
        this.setSp0(obj.sp0?.concat() ?? []);
        this.setSp1(obj.sp1?.concat() ?? []);
        this.setSp2(obj.sp2?.concat() ?? []);
        this.setD2dExtra0(obj.d2dExtra0?.concat() ?? []);
        this.setD2dExtra1(obj.d2dExtra1?.concat() ?? []);
        this.setD2dExtra2(obj.d2dExtra2?.concat() ?? []);
        this.setPExtra0(obj.pExtra0?.concat() ?? []);
        this.setPExtra1(obj.pExtra1?.concat() ?? []);
        this.setPExtra2(obj.pExtra2?.concat() ?? []);
        this.setSpExtra0(obj.spExtra0?.concat() ?? []);
        this.setSpExtra1(obj.spExtra1?.concat() ?? []);
        this.setSpExtra2(obj.spExtra2?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: CoSkillDescCfgJson): CoSkillDescCfgJson {
        obj ??= ({} as CoSkillDescCfgJson);

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            obj.d2d0 = this.getD2d0().concat();
        }

        {
            obj.d2d1 = this.getD2d1().concat();
        }

        {
            obj.d2d2 = this.getD2d2().concat();
        }

        {
            obj.p0 = this.getP0().concat();
        }

        {
            obj.p1 = this.getP1().concat();
        }

        {
            obj.p2 = this.getP2().concat();
        }

        {
            obj.sp0 = this.getSp0().concat();
        }

        {
            obj.sp1 = this.getSp1().concat();
        }

        {
            obj.sp2 = this.getSp2().concat();
        }

        {
            obj.d2dExtra0 = this.getD2dExtra0().concat();
        }

        {
            obj.d2dExtra1 = this.getD2dExtra1().concat();
        }

        {
            obj.d2dExtra2 = this.getD2dExtra2().concat();
        }

        {
            obj.pExtra0 = this.getPExtra0().concat();
        }

        {
            obj.pExtra1 = this.getPExtra1().concat();
        }

        {
            obj.pExtra2 = this.getPExtra2().concat();
        }

        {
            obj.spExtra0 = this.getSpExtra0().concat();
        }

        {
            obj.spExtra1 = this.getSpExtra1().concat();
        }

        {
            obj.spExtra2 = this.getSpExtra2().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getD2d0();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(18).string(value[i]!);
                }
            }
        }

        {
            const value = this.getD2d1();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(26).string(value[i]!);
                }
            }
        }

        {
            const value = this.getD2d2();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(34).string(value[i]!);
                }
            }
        }

        {
            const value = this.getP0();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(42).string(value[i]!);
                }
            }
        }

        {
            const value = this.getP1();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(50).string(value[i]!);
                }
            }
        }

        {
            const value = this.getP2();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(58).string(value[i]!);
                }
            }
        }

        {
            const value = this.getSp0();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(66).string(value[i]!);
                }
            }
        }

        {
            const value = this.getSp1();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(74).string(value[i]!);
                }
            }
        }

        {
            const value = this.getSp2();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(82).string(value[i]!);
                }
            }
        }

        {
            const value = this.getD2dExtra0();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(90).string(value[i]!);
                }
            }
        }

        {
            const value = this.getD2dExtra1();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(98).string(value[i]!);
                }
            }
        }

        {
            const value = this.getD2dExtra2();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(106).string(value[i]!);
                }
            }
        }

        {
            const value = this.getPExtra0();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(114).string(value[i]!);
                }
            }
        }

        {
            const value = this.getPExtra1();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(122).string(value[i]!);
                }
            }
        }

        {
            const value = this.getPExtra2();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(130).string(value[i]!);
                }
            }
        }

        {
            const value = this.getSpExtra0();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(138).string(value[i]!);
                }
            }
        }

        {
            const value = this.getSpExtra1();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(146).string(value[i]!);
                }
            }
        }

        {
            const value = this.getSpExtra2();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    writer.uint32(154).string(value[i]!);
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoSkillDescCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoSkillDescCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._d2d0;
                        arr.push(reader.string());
                    }
                    break;

                case 3:
                    {
                        const arr = msg._d2d1;
                        arr.push(reader.string());
                    }
                    break;

                case 4:
                    {
                        const arr = msg._d2d2;
                        arr.push(reader.string());
                    }
                    break;

                case 5:
                    {
                        const arr = msg._p0;
                        arr.push(reader.string());
                    }
                    break;

                case 6:
                    {
                        const arr = msg._p1;
                        arr.push(reader.string());
                    }
                    break;

                case 7:
                    {
                        const arr = msg._p2;
                        arr.push(reader.string());
                    }
                    break;

                case 8:
                    {
                        const arr = msg._sp0;
                        arr.push(reader.string());
                    }
                    break;

                case 9:
                    {
                        const arr = msg._sp1;
                        arr.push(reader.string());
                    }
                    break;

                case 10:
                    {
                        const arr = msg._sp2;
                        arr.push(reader.string());
                    }
                    break;

                case 11:
                    {
                        const arr = msg._d2dExtra0;
                        arr.push(reader.string());
                    }
                    break;

                case 12:
                    {
                        const arr = msg._d2dExtra1;
                        arr.push(reader.string());
                    }
                    break;

                case 13:
                    {
                        const arr = msg._d2dExtra2;
                        arr.push(reader.string());
                    }
                    break;

                case 14:
                    {
                        const arr = msg._pExtra0;
                        arr.push(reader.string());
                    }
                    break;

                case 15:
                    {
                        const arr = msg._pExtra1;
                        arr.push(reader.string());
                    }
                    break;

                case 16:
                    {
                        const arr = msg._pExtra2;
                        arr.push(reader.string());
                    }
                    break;

                case 17:
                    {
                        const arr = msg._spExtra0;
                        arr.push(reader.string());
                    }
                    break;

                case 18:
                    {
                        const arr = msg._spExtra1;
                        arr.push(reader.string());
                    }
                    break;

                case 19:
                    {
                        const arr = msg._spExtra2;
                        arr.push(reader.string());
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CoSkillDescCfg {
        return CoSkillDescCfg.decode(this.encode());
    }

    public override getSchemaName(): "CoSkillDescCfg" {
        return "CoSkillDescCfg";
    }

    public checkHasCoId(): boolean {
        return this._coId != null;
    }
    public getCoId(): number {
        return this._coId ?? 0;
    }
    public setCoId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coId = null;
        } else {
            this._coId = value;
        }
    }

    public getD2d0(): string[] {
        return this._d2d0;
    }
    public setD2d0(value: string[]): void {
        this._d2d0 = value;
    }

    public getD2d1(): string[] {
        return this._d2d1;
    }
    public setD2d1(value: string[]): void {
        this._d2d1 = value;
    }

    public getD2d2(): string[] {
        return this._d2d2;
    }
    public setD2d2(value: string[]): void {
        this._d2d2 = value;
    }

    public getP0(): string[] {
        return this._p0;
    }
    public setP0(value: string[]): void {
        this._p0 = value;
    }

    public getP1(): string[] {
        return this._p1;
    }
    public setP1(value: string[]): void {
        this._p1 = value;
    }

    public getP2(): string[] {
        return this._p2;
    }
    public setP2(value: string[]): void {
        this._p2 = value;
    }

    public getSp0(): string[] {
        return this._sp0;
    }
    public setSp0(value: string[]): void {
        this._sp0 = value;
    }

    public getSp1(): string[] {
        return this._sp1;
    }
    public setSp1(value: string[]): void {
        this._sp1 = value;
    }

    public getSp2(): string[] {
        return this._sp2;
    }
    public setSp2(value: string[]): void {
        this._sp2 = value;
    }

    public getD2dExtra0(): string[] {
        return this._d2dExtra0;
    }
    public setD2dExtra0(value: string[]): void {
        this._d2dExtra0 = value;
    }

    public getD2dExtra1(): string[] {
        return this._d2dExtra1;
    }
    public setD2dExtra1(value: string[]): void {
        this._d2dExtra1 = value;
    }

    public getD2dExtra2(): string[] {
        return this._d2dExtra2;
    }
    public setD2dExtra2(value: string[]): void {
        this._d2dExtra2 = value;
    }

    public getPExtra0(): string[] {
        return this._pExtra0;
    }
    public setPExtra0(value: string[]): void {
        this._pExtra0 = value;
    }

    public getPExtra1(): string[] {
        return this._pExtra1;
    }
    public setPExtra1(value: string[]): void {
        this._pExtra1 = value;
    }

    public getPExtra2(): string[] {
        return this._pExtra2;
    }
    public setPExtra2(value: string[]): void {
        this._pExtra2 = value;
    }

    public getSpExtra0(): string[] {
        return this._spExtra0;
    }
    public setSpExtra0(value: string[]): void {
        this._spExtra0 = value;
    }

    public getSpExtra1(): string[] {
        return this._spExtra1;
    }
    public setSpExtra1(value: string[]): void {
        this._spExtra1 = value;
    }

    public getSpExtra2(): string[] {
        return this._spExtra2;
    }
    public setSpExtra2(value: string[]): void {
        this._spExtra2 = value;
    }
}
