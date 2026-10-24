import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MultiplierAndOffset as $Message$CommonProto$Structure$MultiplierAndOffset, type MultiplierAndOffsetJson as $Json$CommonProto$Structure$MultiplierAndOffset } from "../Structure/MultiplierAndOffset.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WeaSetPlayerStateSimpleJson extends $ProtoSchemaJsonBase {
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conTileComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    actFund?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actCoEnergy?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actAliveState?: number | null | undefined;
    actIsSkipTurn?: boolean | null | undefined;
    actCoUsingSkillType?: number | null | undefined;
    actActivateCoSkillType?: number | null | undefined;
    actCoId?: number | null | undefined;
}

export class WeaSetPlayerStateSimple extends $ProtoSchemaBase {
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conTileComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _actFund?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actCoEnergy?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actAliveState?: number | null | undefined;
    private _actIsSkipTurn?: boolean | null | undefined;
    private _actCoUsingSkillType?: number | null | undefined;
    private _actActivateCoSkillType?: number | null | undefined;
    private _actCoId?: number | null | undefined;

    public static fromJson(obj: WeaSetPlayerStateSimpleJson): WeaSetPlayerStateSimple {
        return new WeaSetPlayerStateSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetPlayerStateSimpleJson): this {
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitComparator(obj.conUnitComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitComparator) : null);
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConTileComparator(obj.conTileComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conTileComparator) : null);
        this.setActFund(obj.actFund != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actFund) : null);
        this.setActCoEnergy(obj.actCoEnergy != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actCoEnergy) : null);
        this.setActAliveState(obj.actAliveState);
        this.setActIsSkipTurn(obj.actIsSkipTurn);
        this.setActCoUsingSkillType(obj.actCoUsingSkillType);
        this.setActActivateCoSkillType(obj.actActivateCoSkillType);
        this.setActCoId(obj.actCoId);
        return this;
    }
    public override toJson(obj?: WeaSetPlayerStateSimpleJson): WeaSetPlayerStateSimpleJson {
        obj ??= ({} as WeaSetPlayerStateSimpleJson);

        {
            const value = this.getConPlayerFilter();
            (value != null) && (obj.conPlayerFilter = value.toJson());
        }

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value.toJson());
        }

        {
            const value = this.getConUnitComparator();
            (value != null) && (obj.conUnitComparator = value.toJson());
        }

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value.toJson());
        }

        {
            const value = this.getConTileComparator();
            (value != null) && (obj.conTileComparator = value.toJson());
        }

        {
            const value = this.getActFund();
            (value != null) && (obj.actFund = value.toJson());
        }

        {
            const value = this.getActCoEnergy();
            (value != null) && (obj.actCoEnergy = value.toJson());
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
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitFilter();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitComparator();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConTileFilter();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getConTileComparator();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getActFund();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getActCoEnergy();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getActAliveState();
            if (value != null) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getActIsSkipTurn();
            if (value != null) {
                writer.uint32(104).bool(value);
            }
        }

        {
            const value = this.getActCoUsingSkillType();
            if (value != null) {
                writer.uint32(112).int32(value);
            }
        }

        {
            const value = this.getActActivateCoSkillType();
            if (value != null) {
                writer.uint32(120).int32(value);
            }
        }

        {
            const value = this.getActCoId();
            if (value != null) {
                writer.uint32(128).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetPlayerStateSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetPlayerStateSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConPlayerFilter($Message$CommonProto$Structure$PlayerFilter.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConUnitFilter($Message$CommonProto$Structure$UnitFilter.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConUnitComparator($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setConTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setConTileComparator($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setActFund($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActCoEnergy($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setActAliveState(reader.int32());
                    break;

                case 13:
                    msg.setActIsSkipTurn(reader.bool());
                    break;

                case 14:
                    msg.setActCoUsingSkillType(reader.int32());
                    break;

                case 15:
                    msg.setActActivateCoSkillType(reader.int32());
                    break;

                case 16:
                    msg.setActCoId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetPlayerStateSimple {
        return WeaSetPlayerStateSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetPlayerStateSimple" {
        return "WeaSetPlayerStateSimple";
    }

    public checkHasConPlayerFilter(): boolean {
        return this._conPlayerFilter != null;
    }
    public getConPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter | null | undefined {
        return this._conPlayerFilter;
    }
    public setConPlayerFilter(value: $Message$CommonProto$Structure$PlayerFilter | null | undefined): void {
        this._conPlayerFilter = value;
    }
    public createIfNotExistsConPlayerFilter(): $Message$CommonProto$Structure$PlayerFilter {
        return this._conPlayerFilter ??= new $Message$CommonProto$Structure$PlayerFilter();
    }

    public checkHasConUnitFilter(): boolean {
        return this._conUnitFilter != null;
    }
    public getConUnitFilter(): $Message$CommonProto$Structure$UnitFilter | null | undefined {
        return this._conUnitFilter;
    }
    public setConUnitFilter(value: $Message$CommonProto$Structure$UnitFilter | null | undefined): void {
        this._conUnitFilter = value;
    }
    public createIfNotExistsConUnitFilter(): $Message$CommonProto$Structure$UnitFilter {
        return this._conUnitFilter ??= new $Message$CommonProto$Structure$UnitFilter();
    }

    public checkHasConUnitComparator(): boolean {
        return this._conUnitComparator != null;
    }
    public getConUnitComparator(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conUnitComparator;
    }
    public setConUnitComparator(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conUnitComparator = value;
    }
    public createIfNotExistsConUnitComparator(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conUnitComparator ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConTileFilter(): boolean {
        return this._conTileFilter != null;
    }
    public getConTileFilter(): $Message$CommonProto$Structure$TileFilter | null | undefined {
        return this._conTileFilter;
    }
    public setConTileFilter(value: $Message$CommonProto$Structure$TileFilter | null | undefined): void {
        this._conTileFilter = value;
    }
    public createIfNotExistsConTileFilter(): $Message$CommonProto$Structure$TileFilter {
        return this._conTileFilter ??= new $Message$CommonProto$Structure$TileFilter();
    }

    public checkHasConTileComparator(): boolean {
        return this._conTileComparator != null;
    }
    public getConTileComparator(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conTileComparator;
    }
    public setConTileComparator(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conTileComparator = value;
    }
    public createIfNotExistsConTileComparator(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conTileComparator ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasActFund(): boolean {
        return this._actFund != null;
    }
    public getActFund(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actFund;
    }
    public setActFund(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actFund = value;
    }
    public createIfNotExistsActFund(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actFund ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActCoEnergy(): boolean {
        return this._actCoEnergy != null;
    }
    public getActCoEnergy(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actCoEnergy;
    }
    public setActCoEnergy(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actCoEnergy = value;
    }
    public createIfNotExistsActCoEnergy(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actCoEnergy ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActAliveState(): boolean {
        return this._actAliveState != null;
    }
    public getActAliveState(): number | null | undefined {
        return this._actAliveState;
    }
    public setActAliveState(value: number | null | undefined): void {
        this._actAliveState = value;
    }

    public checkHasActIsSkipTurn(): boolean {
        return this._actIsSkipTurn != null;
    }
    public getActIsSkipTurn(): boolean | null | undefined {
        return this._actIsSkipTurn;
    }
    public setActIsSkipTurn(value: boolean | null | undefined): void {
        this._actIsSkipTurn = value;
    }

    public checkHasActCoUsingSkillType(): boolean {
        return this._actCoUsingSkillType != null;
    }
    public getActCoUsingSkillType(): number | null | undefined {
        return this._actCoUsingSkillType;
    }
    public setActCoUsingSkillType(value: number | null | undefined): void {
        this._actCoUsingSkillType = value;
    }

    public checkHasActActivateCoSkillType(): boolean {
        return this._actActivateCoSkillType != null;
    }
    public getActActivateCoSkillType(): number | null | undefined {
        return this._actActivateCoSkillType;
    }
    public setActActivateCoSkillType(value: number | null | undefined): void {
        this._actActivateCoSkillType = value;
    }

    public checkHasActCoId(): boolean {
        return this._actCoId != null;
    }
    public getActCoId(): number | null | undefined {
        return this._actCoId;
    }
    public setActCoId(value: number | null | undefined): void {
        this._actCoId = value;
    }
}
