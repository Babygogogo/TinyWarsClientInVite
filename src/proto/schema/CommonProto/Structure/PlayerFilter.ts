import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "./ValueAndComparator.js";
import { ValueArrayAndPredicate as $Message$CommonProto$Structure$ValueArrayAndPredicate, type ValueArrayAndPredicateJson as $Json$CommonProto$Structure$ValueArrayAndPredicate } from "./ValueArrayAndPredicate.js";

export interface PlayerFilterJson extends $ProtoSchemaJsonBase {
    conPlayerIndex?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conTeamIndex?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conAliveState?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conCoUsingSkillType?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conCoCategoryId?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conIsInTurn?: boolean | null | undefined;
    conIsSkipTurn?: boolean | null | undefined;
    conFund?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conCoEnergy?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
}

export class PlayerFilter extends $ProtoSchemaBase {
    private _conPlayerIndex?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conTeamIndex?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conAliveState?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conCoUsingSkillType?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conCoCategoryId?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conIsInTurn?: boolean | null | undefined;
    private _conIsSkipTurn?: boolean | null | undefined;
    private _conFund?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conCoEnergy?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;

    public static fromJson(obj: PlayerFilterJson): PlayerFilter {
        return new PlayerFilter().loadJson(obj);
    }
    public override loadJson(obj: PlayerFilterJson): this {
        this.setConPlayerIndex(obj.conPlayerIndex != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conPlayerIndex) : null);
        this.setConTeamIndex(obj.conTeamIndex != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conTeamIndex) : null);
        this.setConAliveState(obj.conAliveState != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conAliveState) : null);
        this.setConCoUsingSkillType(obj.conCoUsingSkillType != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conCoUsingSkillType) : null);
        this.setConCoCategoryId(obj.conCoCategoryId != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conCoCategoryId) : null);
        this.setConIsInTurn(obj.conIsInTurn);
        this.setConIsSkipTurn(obj.conIsSkipTurn);
        this.setConFund(obj.conFund != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conFund) : null);
        this.setConCoEnergy(obj.conCoEnergy != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conCoEnergy) : null);
        return this;
    }
    public override toJson(obj?: PlayerFilterJson): PlayerFilterJson {
        obj ??= ({} as PlayerFilterJson);

        {
            const value = this.getConPlayerIndex();
            (value != null) && (obj.conPlayerIndex = value.toJson());
        }

        {
            const value = this.getConTeamIndex();
            (value != null) && (obj.conTeamIndex = value.toJson());
        }

        {
            const value = this.getConAliveState();
            (value != null) && (obj.conAliveState = value.toJson());
        }

        {
            const value = this.getConCoUsingSkillType();
            (value != null) && (obj.conCoUsingSkillType = value.toJson());
        }

        {
            const value = this.getConCoCategoryId();
            (value != null) && (obj.conCoCategoryId = value.toJson());
        }

        {
            const value = this.getConIsInTurn();
            (value != null) && (obj.conIsInTurn = value);
        }

        {
            const value = this.getConIsSkipTurn();
            (value != null) && (obj.conIsSkipTurn = value);
        }

        {
            const value = this.getConFund();
            (value != null) && (obj.conFund = value.toJson());
        }

        {
            const value = this.getConCoEnergy();
            (value != null) && (obj.conCoEnergy = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConPlayerIndex();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConTeamIndex();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConAliveState();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConCoUsingSkillType();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getConCoCategoryId();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getConIsInTurn();
            if (value != null) {
                writer.uint32(48).bool(value);
            }
        }

        {
            const value = this.getConIsSkipTurn();
            if (value != null) {
                writer.uint32(56).bool(value);
            }
        }

        {
            const value = this.getConFund();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getConCoEnergy();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): PlayerFilter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new PlayerFilter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConPlayerIndex($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConTeamIndex($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConAliveState($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setConCoUsingSkillType($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setConCoCategoryId($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setConIsInTurn(reader.bool());
                    break;

                case 7:
                    msg.setConIsSkipTurn(reader.bool());
                    break;

                case 8:
                    msg.setConFund($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setConCoEnergy($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): PlayerFilter {
        return PlayerFilter.decode(this.encode());
    }

    public override getSchemaName(): "PlayerFilter" {
        return "PlayerFilter";
    }

    public checkHasConPlayerIndex(): boolean {
        return this._conPlayerIndex != null;
    }
    public getConPlayerIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conPlayerIndex;
    }
    public setConPlayerIndex(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conPlayerIndex = value;
    }
    public createIfNotExistsConPlayerIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conPlayerIndex ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConTeamIndex(): boolean {
        return this._conTeamIndex != null;
    }
    public getConTeamIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conTeamIndex;
    }
    public setConTeamIndex(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conTeamIndex = value;
    }
    public createIfNotExistsConTeamIndex(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conTeamIndex ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConAliveState(): boolean {
        return this._conAliveState != null;
    }
    public getConAliveState(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conAliveState;
    }
    public setConAliveState(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conAliveState = value;
    }
    public createIfNotExistsConAliveState(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conAliveState ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConCoUsingSkillType(): boolean {
        return this._conCoUsingSkillType != null;
    }
    public getConCoUsingSkillType(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conCoUsingSkillType;
    }
    public setConCoUsingSkillType(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conCoUsingSkillType = value;
    }
    public createIfNotExistsConCoUsingSkillType(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conCoUsingSkillType ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConCoCategoryId(): boolean {
        return this._conCoCategoryId != null;
    }
    public getConCoCategoryId(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conCoCategoryId;
    }
    public setConCoCategoryId(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conCoCategoryId = value;
    }
    public createIfNotExistsConCoCategoryId(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conCoCategoryId ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConIsInTurn(): boolean {
        return this._conIsInTurn != null;
    }
    public getConIsInTurn(): boolean | null | undefined {
        return this._conIsInTurn;
    }
    public setConIsInTurn(value: boolean | null | undefined): void {
        this._conIsInTurn = value;
    }

    public checkHasConIsSkipTurn(): boolean {
        return this._conIsSkipTurn != null;
    }
    public getConIsSkipTurn(): boolean | null | undefined {
        return this._conIsSkipTurn;
    }
    public setConIsSkipTurn(value: boolean | null | undefined): void {
        this._conIsSkipTurn = value;
    }

    public checkHasConFund(): boolean {
        return this._conFund != null;
    }
    public getConFund(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conFund;
    }
    public setConFund(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conFund = value;
    }
    public createIfNotExistsConFund(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conFund ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConCoEnergy(): boolean {
        return this._conCoEnergy != null;
    }
    public getConCoEnergy(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conCoEnergy;
    }
    public setConCoEnergy(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conCoEnergy = value;
    }
    public createIfNotExistsConCoEnergy(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conCoEnergy ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }
}
