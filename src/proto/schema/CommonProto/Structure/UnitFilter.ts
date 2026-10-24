import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndexArrayAndPredicate as $Message$CommonProto$Structure$GridIndexArrayAndPredicate, type GridIndexArrayAndPredicateJson as $Json$CommonProto$Structure$GridIndexArrayAndPredicate } from "./GridIndexArrayAndPredicate.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "./ValueAndComparator.js";
import { ValueArrayAndPredicate as $Message$CommonProto$Structure$ValueArrayAndPredicate, type ValueArrayAndPredicateJson as $Json$CommonProto$Structure$ValueArrayAndPredicate } from "./ValueArrayAndPredicate.js";
import { ValueSetAndRelation as $Message$CommonProto$Structure$ValueSetAndRelation, type ValueSetAndRelationJson as $Json$CommonProto$Structure$ValueSetAndRelation } from "./ValueSetAndRelation.js";

export interface UnitFilterJson extends $ProtoSchemaJsonBase {
    conPlayerIndex?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conTeamIndex?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conUnitType?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conActionState?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conIsCoOnboard?: boolean | null | undefined;
    conHp?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conFuel?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conPriAmmo?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conPromotion?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conIsOwnerPlayerInTurn?: boolean | null | undefined;
    conIsDiving?: boolean | null | undefined;
    conTagId?: $Json$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    conLoadedUnitsCount?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conIsLoaded?: boolean | null | undefined;
    conFlareAmmo?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conBuildMaterial?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conProduceMaterial?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conForbiddenLocationId?: $Json$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    conAiMode?: $Json$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    conGridIndex?: $Json$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined;
    conLocationId?: $Json$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    conCustomNameId?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    conBuffTypeId?: $Json$CommonProto$Structure$ValueSetAndRelation | null | undefined;
}

export class UnitFilter extends $ProtoSchemaBase {
    private _conPlayerIndex?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conTeamIndex?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conUnitType?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conActionState?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conIsCoOnboard?: boolean | null | undefined;
    private _conHp?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conFuel?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conPriAmmo?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conPromotion?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conIsOwnerPlayerInTurn?: boolean | null | undefined;
    private _conIsDiving?: boolean | null | undefined;
    private _conTagId?: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    private _conLoadedUnitsCount?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conIsLoaded?: boolean | null | undefined;
    private _conFlareAmmo?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conBuildMaterial?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conProduceMaterial?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conForbiddenLocationId?: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    private _conAiMode?: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined;
    private _conGridIndex?: $Message$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined;
    private _conLocationId?: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined;
    private _conCustomNameId?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _conBuffTypeId?: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined;

    public static fromJson(obj: UnitFilterJson): UnitFilter {
        return new UnitFilter().loadJson(obj);
    }
    public override loadJson(obj: UnitFilterJson): this {
        this.setConPlayerIndex(obj.conPlayerIndex != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conPlayerIndex) : null);
        this.setConTeamIndex(obj.conTeamIndex != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conTeamIndex) : null);
        this.setConUnitType(obj.conUnitType != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conUnitType) : null);
        this.setConActionState(obj.conActionState != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conActionState) : null);
        this.setConIsCoOnboard(obj.conIsCoOnboard);
        this.setConHp(obj.conHp != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conHp) : null);
        this.setConFuel(obj.conFuel != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conFuel) : null);
        this.setConPriAmmo(obj.conPriAmmo != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conPriAmmo) : null);
        this.setConPromotion(obj.conPromotion != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conPromotion) : null);
        this.setConIsOwnerPlayerInTurn(obj.conIsOwnerPlayerInTurn);
        this.setConIsDiving(obj.conIsDiving);
        this.setConTagId(obj.conTagId != null ? $Message$CommonProto$Structure$ValueSetAndRelation.fromJson(obj.conTagId) : null);
        this.setConLoadedUnitsCount(obj.conLoadedUnitsCount != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conLoadedUnitsCount) : null);
        this.setConIsLoaded(obj.conIsLoaded);
        this.setConFlareAmmo(obj.conFlareAmmo != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conFlareAmmo) : null);
        this.setConBuildMaterial(obj.conBuildMaterial != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conBuildMaterial) : null);
        this.setConProduceMaterial(obj.conProduceMaterial != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conProduceMaterial) : null);
        this.setConForbiddenLocationId(obj.conForbiddenLocationId != null ? $Message$CommonProto$Structure$ValueSetAndRelation.fromJson(obj.conForbiddenLocationId) : null);
        this.setConAiMode(obj.conAiMode != null ? $Message$CommonProto$Structure$ValueArrayAndPredicate.fromJson(obj.conAiMode) : null);
        this.setConGridIndex(obj.conGridIndex != null ? $Message$CommonProto$Structure$GridIndexArrayAndPredicate.fromJson(obj.conGridIndex) : null);
        this.setConLocationId(obj.conLocationId != null ? $Message$CommonProto$Structure$ValueSetAndRelation.fromJson(obj.conLocationId) : null);
        this.setConCustomNameId(obj.conCustomNameId != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conCustomNameId) : null);
        this.setConBuffTypeId(obj.conBuffTypeId != null ? $Message$CommonProto$Structure$ValueSetAndRelation.fromJson(obj.conBuffTypeId) : null);
        return this;
    }
    public override toJson(obj?: UnitFilterJson): UnitFilterJson {
        obj ??= ({} as UnitFilterJson);

        {
            const value = this.getConPlayerIndex();
            (value != null) && (obj.conPlayerIndex = value.toJson());
        }

        {
            const value = this.getConTeamIndex();
            (value != null) && (obj.conTeamIndex = value.toJson());
        }

        {
            const value = this.getConUnitType();
            (value != null) && (obj.conUnitType = value.toJson());
        }

        {
            const value = this.getConActionState();
            (value != null) && (obj.conActionState = value.toJson());
        }

        {
            const value = this.getConIsCoOnboard();
            (value != null) && (obj.conIsCoOnboard = value);
        }

        {
            const value = this.getConHp();
            (value != null) && (obj.conHp = value.toJson());
        }

        {
            const value = this.getConFuel();
            (value != null) && (obj.conFuel = value.toJson());
        }

        {
            const value = this.getConPriAmmo();
            (value != null) && (obj.conPriAmmo = value.toJson());
        }

        {
            const value = this.getConPromotion();
            (value != null) && (obj.conPromotion = value.toJson());
        }

        {
            const value = this.getConIsOwnerPlayerInTurn();
            (value != null) && (obj.conIsOwnerPlayerInTurn = value);
        }

        {
            const value = this.getConIsDiving();
            (value != null) && (obj.conIsDiving = value);
        }

        {
            const value = this.getConTagId();
            (value != null) && (obj.conTagId = value.toJson());
        }

        {
            const value = this.getConLoadedUnitsCount();
            (value != null) && (obj.conLoadedUnitsCount = value.toJson());
        }

        {
            const value = this.getConIsLoaded();
            (value != null) && (obj.conIsLoaded = value);
        }

        {
            const value = this.getConFlareAmmo();
            (value != null) && (obj.conFlareAmmo = value.toJson());
        }

        {
            const value = this.getConBuildMaterial();
            (value != null) && (obj.conBuildMaterial = value.toJson());
        }

        {
            const value = this.getConProduceMaterial();
            (value != null) && (obj.conProduceMaterial = value.toJson());
        }

        {
            const value = this.getConForbiddenLocationId();
            (value != null) && (obj.conForbiddenLocationId = value.toJson());
        }

        {
            const value = this.getConAiMode();
            (value != null) && (obj.conAiMode = value.toJson());
        }

        {
            const value = this.getConGridIndex();
            (value != null) && (obj.conGridIndex = value.toJson());
        }

        {
            const value = this.getConLocationId();
            (value != null) && (obj.conLocationId = value.toJson());
        }

        {
            const value = this.getConCustomNameId();
            (value != null) && (obj.conCustomNameId = value.toJson());
        }

        {
            const value = this.getConBuffTypeId();
            (value != null) && (obj.conBuffTypeId = value.toJson());
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
            const value = this.getConUnitType();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConActionState();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getConIsCoOnboard();
            if (value != null) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getConHp();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getConFuel();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getConPriAmmo();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getConPromotion();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getConIsOwnerPlayerInTurn();
            if (value != null) {
                writer.uint32(80).bool(value);
            }
        }

        {
            const value = this.getConIsDiving();
            if (value != null) {
                writer.uint32(88).bool(value);
            }
        }

        {
            const value = this.getConTagId();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getConLoadedUnitsCount();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getConIsLoaded();
            if (value != null) {
                writer.uint32(112).bool(value);
            }
        }

        {
            const value = this.getConFlareAmmo();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getConBuildMaterial();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getConProduceMaterial();
            if (value != null) {
                value.toWriter(writer.uint32(138).fork()).ldelim();
            }
        }

        {
            const value = this.getConForbiddenLocationId();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getConAiMode();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        {
            const value = this.getConGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(162).fork()).ldelim();
            }
        }

        {
            const value = this.getConLocationId();
            if (value != null) {
                value.toWriter(writer.uint32(170).fork()).ldelim();
            }
        }

        {
            const value = this.getConCustomNameId();
            if (value != null) {
                value.toWriter(writer.uint32(178).fork()).ldelim();
            }
        }

        {
            const value = this.getConBuffTypeId();
            if (value != null) {
                value.toWriter(writer.uint32(186).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitFilter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitFilter();
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
                    msg.setConUnitType($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setConActionState($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setConIsCoOnboard(reader.bool());
                    break;

                case 6:
                    msg.setConHp($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setConFuel($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setConPriAmmo($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setConPromotion($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setConIsOwnerPlayerInTurn(reader.bool());
                    break;

                case 11:
                    msg.setConIsDiving(reader.bool());
                    break;

                case 12:
                    msg.setConTagId($Message$CommonProto$Structure$ValueSetAndRelation.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setConLoadedUnitsCount($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setConIsLoaded(reader.bool());
                    break;

                case 15:
                    msg.setConFlareAmmo($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setConBuildMaterial($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setConProduceMaterial($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 18:
                    msg.setConForbiddenLocationId($Message$CommonProto$Structure$ValueSetAndRelation.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setConAiMode($Message$CommonProto$Structure$ValueArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 20:
                    msg.setConGridIndex($Message$CommonProto$Structure$GridIndexArrayAndPredicate.decode(reader, reader.uint32()));
                    break;

                case 21:
                    msg.setConLocationId($Message$CommonProto$Structure$ValueSetAndRelation.decode(reader, reader.uint32()));
                    break;

                case 22:
                    msg.setConCustomNameId($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 23:
                    msg.setConBuffTypeId($Message$CommonProto$Structure$ValueSetAndRelation.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UnitFilter {
        return UnitFilter.decode(this.encode());
    }

    public override getSchemaName(): "UnitFilter" {
        return "UnitFilter";
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

    public checkHasConUnitType(): boolean {
        return this._conUnitType != null;
    }
    public getConUnitType(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conUnitType;
    }
    public setConUnitType(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conUnitType = value;
    }
    public createIfNotExistsConUnitType(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conUnitType ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConActionState(): boolean {
        return this._conActionState != null;
    }
    public getConActionState(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conActionState;
    }
    public setConActionState(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conActionState = value;
    }
    public createIfNotExistsConActionState(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conActionState ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConIsCoOnboard(): boolean {
        return this._conIsCoOnboard != null;
    }
    public getConIsCoOnboard(): boolean | null | undefined {
        return this._conIsCoOnboard;
    }
    public setConIsCoOnboard(value: boolean | null | undefined): void {
        this._conIsCoOnboard = value;
    }

    public checkHasConHp(): boolean {
        return this._conHp != null;
    }
    public getConHp(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conHp;
    }
    public setConHp(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conHp = value;
    }
    public createIfNotExistsConHp(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conHp ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConFuel(): boolean {
        return this._conFuel != null;
    }
    public getConFuel(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conFuel;
    }
    public setConFuel(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conFuel = value;
    }
    public createIfNotExistsConFuel(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conFuel ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConPriAmmo(): boolean {
        return this._conPriAmmo != null;
    }
    public getConPriAmmo(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conPriAmmo;
    }
    public setConPriAmmo(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conPriAmmo = value;
    }
    public createIfNotExistsConPriAmmo(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conPriAmmo ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConPromotion(): boolean {
        return this._conPromotion != null;
    }
    public getConPromotion(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conPromotion;
    }
    public setConPromotion(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conPromotion = value;
    }
    public createIfNotExistsConPromotion(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conPromotion ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConIsOwnerPlayerInTurn(): boolean {
        return this._conIsOwnerPlayerInTurn != null;
    }
    public getConIsOwnerPlayerInTurn(): boolean | null | undefined {
        return this._conIsOwnerPlayerInTurn;
    }
    public setConIsOwnerPlayerInTurn(value: boolean | null | undefined): void {
        this._conIsOwnerPlayerInTurn = value;
    }

    public checkHasConIsDiving(): boolean {
        return this._conIsDiving != null;
    }
    public getConIsDiving(): boolean | null | undefined {
        return this._conIsDiving;
    }
    public setConIsDiving(value: boolean | null | undefined): void {
        this._conIsDiving = value;
    }

    public checkHasConTagId(): boolean {
        return this._conTagId != null;
    }
    public getConTagId(): $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined {
        return this._conTagId;
    }
    public setConTagId(value: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined): void {
        this._conTagId = value;
    }
    public createIfNotExistsConTagId(): $Message$CommonProto$Structure$ValueSetAndRelation {
        return this._conTagId ??= new $Message$CommonProto$Structure$ValueSetAndRelation();
    }

    public checkHasConLoadedUnitsCount(): boolean {
        return this._conLoadedUnitsCount != null;
    }
    public getConLoadedUnitsCount(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conLoadedUnitsCount;
    }
    public setConLoadedUnitsCount(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conLoadedUnitsCount = value;
    }
    public createIfNotExistsConLoadedUnitsCount(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conLoadedUnitsCount ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConIsLoaded(): boolean {
        return this._conIsLoaded != null;
    }
    public getConIsLoaded(): boolean | null | undefined {
        return this._conIsLoaded;
    }
    public setConIsLoaded(value: boolean | null | undefined): void {
        this._conIsLoaded = value;
    }

    public checkHasConFlareAmmo(): boolean {
        return this._conFlareAmmo != null;
    }
    public getConFlareAmmo(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conFlareAmmo;
    }
    public setConFlareAmmo(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conFlareAmmo = value;
    }
    public createIfNotExistsConFlareAmmo(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conFlareAmmo ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConBuildMaterial(): boolean {
        return this._conBuildMaterial != null;
    }
    public getConBuildMaterial(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conBuildMaterial;
    }
    public setConBuildMaterial(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conBuildMaterial = value;
    }
    public createIfNotExistsConBuildMaterial(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conBuildMaterial ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConProduceMaterial(): boolean {
        return this._conProduceMaterial != null;
    }
    public getConProduceMaterial(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conProduceMaterial;
    }
    public setConProduceMaterial(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conProduceMaterial = value;
    }
    public createIfNotExistsConProduceMaterial(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conProduceMaterial ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConForbiddenLocationId(): boolean {
        return this._conForbiddenLocationId != null;
    }
    public getConForbiddenLocationId(): $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined {
        return this._conForbiddenLocationId;
    }
    public setConForbiddenLocationId(value: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined): void {
        this._conForbiddenLocationId = value;
    }
    public createIfNotExistsConForbiddenLocationId(): $Message$CommonProto$Structure$ValueSetAndRelation {
        return this._conForbiddenLocationId ??= new $Message$CommonProto$Structure$ValueSetAndRelation();
    }

    public checkHasConAiMode(): boolean {
        return this._conAiMode != null;
    }
    public getConAiMode(): $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined {
        return this._conAiMode;
    }
    public setConAiMode(value: $Message$CommonProto$Structure$ValueArrayAndPredicate | null | undefined): void {
        this._conAiMode = value;
    }
    public createIfNotExistsConAiMode(): $Message$CommonProto$Structure$ValueArrayAndPredicate {
        return this._conAiMode ??= new $Message$CommonProto$Structure$ValueArrayAndPredicate();
    }

    public checkHasConGridIndex(): boolean {
        return this._conGridIndex != null;
    }
    public getConGridIndex(): $Message$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined {
        return this._conGridIndex;
    }
    public setConGridIndex(value: $Message$CommonProto$Structure$GridIndexArrayAndPredicate | null | undefined): void {
        this._conGridIndex = value;
    }
    public createIfNotExistsConGridIndex(): $Message$CommonProto$Structure$GridIndexArrayAndPredicate {
        return this._conGridIndex ??= new $Message$CommonProto$Structure$GridIndexArrayAndPredicate();
    }

    public checkHasConLocationId(): boolean {
        return this._conLocationId != null;
    }
    public getConLocationId(): $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined {
        return this._conLocationId;
    }
    public setConLocationId(value: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined): void {
        this._conLocationId = value;
    }
    public createIfNotExistsConLocationId(): $Message$CommonProto$Structure$ValueSetAndRelation {
        return this._conLocationId ??= new $Message$CommonProto$Structure$ValueSetAndRelation();
    }

    public checkHasConCustomNameId(): boolean {
        return this._conCustomNameId != null;
    }
    public getConCustomNameId(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._conCustomNameId;
    }
    public setConCustomNameId(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._conCustomNameId = value;
    }
    public createIfNotExistsConCustomNameId(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._conCustomNameId ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }

    public checkHasConBuffTypeId(): boolean {
        return this._conBuffTypeId != null;
    }
    public getConBuffTypeId(): $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined {
        return this._conBuffTypeId;
    }
    public setConBuffTypeId(value: $Message$CommonProto$Structure$ValueSetAndRelation | null | undefined): void {
        this._conBuffTypeId = value;
    }
    public createIfNotExistsConBuffTypeId(): $Message$CommonProto$Structure$ValueSetAndRelation {
        return this._conBuffTypeId ??= new $Message$CommonProto$Structure$ValueSetAndRelation();
    }
}
