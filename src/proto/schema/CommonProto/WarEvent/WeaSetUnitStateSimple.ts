import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ArrayModifier as $Message$CommonProto$Structure$ArrayModifier, type ArrayModifierJson as $Json$CommonProto$Structure$ArrayModifier } from "../Structure/ArrayModifier.js";
import { MultiplierAndOffset as $Message$CommonProto$Structure$MultiplierAndOffset, type MultiplierAndOffsetJson as $Json$CommonProto$Structure$MultiplierAndOffset } from "../Structure/MultiplierAndOffset.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { WeightedGridIndex as $Message$CommonProto$Structure$WeightedGridIndex, type WeightedGridIndexJson as $Json$CommonProto$Structure$WeightedGridIndex } from "../Structure/WeightedGridIndex.js";

export interface WeaSetUnitStateSimpleJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    actHp?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actFuel?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actPriAmmo?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actPromotion?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actFlareAmmo?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actBuildMaterial?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actProduceMaterial?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actActionState?: number | null | undefined;
    actIsCoOnboard?: boolean | null | undefined;
    actIsDiving?: boolean | null | undefined;
    actAiMode?: number | null | undefined;
    actTagIdArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actForbiddenLocationIdArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actAiWeightedDestination?: $Json$CommonProto$Structure$WeightedGridIndex | null | undefined;
    actCustomNameId?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
}

export class WeaSetUnitStateSimple extends $ProtoSchemaBase {
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _actHp?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actFuel?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actPriAmmo?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actPromotion?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actFlareAmmo?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actBuildMaterial?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actProduceMaterial?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actActionState?: number | null | undefined;
    private _actIsCoOnboard?: boolean | null | undefined;
    private _actIsDiving?: boolean | null | undefined;
    private _actAiMode?: number | null | undefined;
    private _actTagIdArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actForbiddenLocationIdArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actAiWeightedDestination?: $Message$CommonProto$Structure$WeightedGridIndex | null | undefined;
    private _actCustomNameId?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;

    public static fromJson(obj: WeaSetUnitStateSimpleJson): WeaSetUnitStateSimple {
        return new WeaSetUnitStateSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitStateSimpleJson): this {
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setActHp(obj.actHp != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actHp) : null);
        this.setActFuel(obj.actFuel != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actFuel) : null);
        this.setActPriAmmo(obj.actPriAmmo != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actPriAmmo) : null);
        this.setActPromotion(obj.actPromotion != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actPromotion) : null);
        this.setActFlareAmmo(obj.actFlareAmmo != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actFlareAmmo) : null);
        this.setActBuildMaterial(obj.actBuildMaterial != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actBuildMaterial) : null);
        this.setActProduceMaterial(obj.actProduceMaterial != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actProduceMaterial) : null);
        this.setActActionState(obj.actActionState);
        this.setActIsCoOnboard(obj.actIsCoOnboard);
        this.setActIsDiving(obj.actIsDiving);
        this.setActAiMode(obj.actAiMode);
        this.setActTagIdArray(obj.actTagIdArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actTagIdArray) : null);
        this.setActForbiddenLocationIdArray(obj.actForbiddenLocationIdArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actForbiddenLocationIdArray) : null);
        this.setActAiWeightedDestination(obj.actAiWeightedDestination != null ? $Message$CommonProto$Structure$WeightedGridIndex.fromJson(obj.actAiWeightedDestination) : null);
        this.setActCustomNameId(obj.actCustomNameId != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actCustomNameId) : null);
        return this;
    }
    public override toJson(obj?: WeaSetUnitStateSimpleJson): WeaSetUnitStateSimpleJson {
        obj ??= ({} as WeaSetUnitStateSimpleJson);

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value.toJson());
        }

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value.toJson());
        }

        {
            const value = this.getConPlayerFilter();
            (value != null) && (obj.conPlayerFilter = value.toJson());
        }

        {
            const value = this.getActHp();
            (value != null) && (obj.actHp = value.toJson());
        }

        {
            const value = this.getActFuel();
            (value != null) && (obj.actFuel = value.toJson());
        }

        {
            const value = this.getActPriAmmo();
            (value != null) && (obj.actPriAmmo = value.toJson());
        }

        {
            const value = this.getActPromotion();
            (value != null) && (obj.actPromotion = value.toJson());
        }

        {
            const value = this.getActFlareAmmo();
            (value != null) && (obj.actFlareAmmo = value.toJson());
        }

        {
            const value = this.getActBuildMaterial();
            (value != null) && (obj.actBuildMaterial = value.toJson());
        }

        {
            const value = this.getActProduceMaterial();
            (value != null) && (obj.actProduceMaterial = value.toJson());
        }

        {
            const value = this.getActActionState();
            (value != null) && (obj.actActionState = value);
        }

        {
            const value = this.getActIsCoOnboard();
            (value != null) && (obj.actIsCoOnboard = value);
        }

        {
            const value = this.getActIsDiving();
            (value != null) && (obj.actIsDiving = value);
        }

        {
            const value = this.getActAiMode();
            (value != null) && (obj.actAiMode = value);
        }

        {
            const value = this.getActTagIdArray();
            (value != null) && (obj.actTagIdArray = value.toJson());
        }

        {
            const value = this.getActForbiddenLocationIdArray();
            (value != null) && (obj.actForbiddenLocationIdArray = value.toJson());
        }

        {
            const value = this.getActAiWeightedDestination();
            (value != null) && (obj.actAiWeightedDestination = value.toJson());
        }

        {
            const value = this.getActCustomNameId();
            (value != null) && (obj.actCustomNameId = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConUnitFilter();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConTileFilter();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConPlayerFilter();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getActHp();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getActFuel();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getActPriAmmo();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getActPromotion();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getActFlareAmmo();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getActBuildMaterial();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getActProduceMaterial();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getActActionState();
            if (value != null) {
                writer.uint32(136).int32(value);
            }
        }

        {
            const value = this.getActIsCoOnboard();
            if (value != null) {
                writer.uint32(144).bool(value);
            }
        }

        {
            const value = this.getActIsDiving();
            if (value != null) {
                writer.uint32(152).bool(value);
            }
        }

        {
            const value = this.getActAiMode();
            if (value != null) {
                writer.uint32(160).int32(value);
            }
        }

        {
            const value = this.getActTagIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(170).fork()).ldelim();
            }
        }

        {
            const value = this.getActForbiddenLocationIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(178).fork()).ldelim();
            }
        }

        {
            const value = this.getActAiWeightedDestination();
            if (value != null) {
                value.toWriter(writer.uint32(186).fork()).ldelim();
            }
        }

        {
            const value = this.getActCustomNameId();
            if (value != null) {
                value.toWriter(writer.uint32(194).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitStateSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitStateSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConUnitFilter($Message$CommonProto$Structure$UnitFilter.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConPlayerFilter($Message$CommonProto$Structure$PlayerFilter.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setActHp($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActFuel($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setActPriAmmo($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setActPromotion($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setActFlareAmmo($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setActBuildMaterial($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setActProduceMaterial($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setActActionState(reader.int32());
                    break;

                case 18:
                    msg.setActIsCoOnboard(reader.bool());
                    break;

                case 19:
                    msg.setActIsDiving(reader.bool());
                    break;

                case 20:
                    msg.setActAiMode(reader.int32());
                    break;

                case 21:
                    msg.setActTagIdArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 22:
                    msg.setActForbiddenLocationIdArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 23:
                    msg.setActAiWeightedDestination($Message$CommonProto$Structure$WeightedGridIndex.decode(reader, reader.uint32()));
                    break;

                case 24:
                    msg.setActCustomNameId($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitStateSimple {
        return WeaSetUnitStateSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitStateSimple" {
        return "WeaSetUnitStateSimple";
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

    public checkHasActHp(): boolean {
        return this._actHp != null;
    }
    public getActHp(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actHp;
    }
    public setActHp(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actHp = value;
    }
    public createIfNotExistsActHp(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actHp ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActFuel(): boolean {
        return this._actFuel != null;
    }
    public getActFuel(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actFuel;
    }
    public setActFuel(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actFuel = value;
    }
    public createIfNotExistsActFuel(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actFuel ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActPriAmmo(): boolean {
        return this._actPriAmmo != null;
    }
    public getActPriAmmo(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actPriAmmo;
    }
    public setActPriAmmo(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actPriAmmo = value;
    }
    public createIfNotExistsActPriAmmo(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actPriAmmo ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActPromotion(): boolean {
        return this._actPromotion != null;
    }
    public getActPromotion(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actPromotion;
    }
    public setActPromotion(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actPromotion = value;
    }
    public createIfNotExistsActPromotion(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actPromotion ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActFlareAmmo(): boolean {
        return this._actFlareAmmo != null;
    }
    public getActFlareAmmo(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actFlareAmmo;
    }
    public setActFlareAmmo(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actFlareAmmo = value;
    }
    public createIfNotExistsActFlareAmmo(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actFlareAmmo ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActBuildMaterial(): boolean {
        return this._actBuildMaterial != null;
    }
    public getActBuildMaterial(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actBuildMaterial;
    }
    public setActBuildMaterial(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actBuildMaterial = value;
    }
    public createIfNotExistsActBuildMaterial(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actBuildMaterial ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActProduceMaterial(): boolean {
        return this._actProduceMaterial != null;
    }
    public getActProduceMaterial(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actProduceMaterial;
    }
    public setActProduceMaterial(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actProduceMaterial = value;
    }
    public createIfNotExistsActProduceMaterial(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actProduceMaterial ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActActionState(): boolean {
        return this._actActionState != null;
    }
    public getActActionState(): number | null | undefined {
        return this._actActionState;
    }
    public setActActionState(value: number | null | undefined): void {
        this._actActionState = value;
    }

    public checkHasActIsCoOnboard(): boolean {
        return this._actIsCoOnboard != null;
    }
    public getActIsCoOnboard(): boolean | null | undefined {
        return this._actIsCoOnboard;
    }
    public setActIsCoOnboard(value: boolean | null | undefined): void {
        this._actIsCoOnboard = value;
    }

    public checkHasActIsDiving(): boolean {
        return this._actIsDiving != null;
    }
    public getActIsDiving(): boolean | null | undefined {
        return this._actIsDiving;
    }
    public setActIsDiving(value: boolean | null | undefined): void {
        this._actIsDiving = value;
    }

    public checkHasActAiMode(): boolean {
        return this._actAiMode != null;
    }
    public getActAiMode(): number | null | undefined {
        return this._actAiMode;
    }
    public setActAiMode(value: number | null | undefined): void {
        this._actAiMode = value;
    }

    public checkHasActTagIdArray(): boolean {
        return this._actTagIdArray != null;
    }
    public getActTagIdArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actTagIdArray;
    }
    public setActTagIdArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actTagIdArray = value;
    }
    public createIfNotExistsActTagIdArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actTagIdArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActForbiddenLocationIdArray(): boolean {
        return this._actForbiddenLocationIdArray != null;
    }
    public getActForbiddenLocationIdArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actForbiddenLocationIdArray;
    }
    public setActForbiddenLocationIdArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actForbiddenLocationIdArray = value;
    }
    public createIfNotExistsActForbiddenLocationIdArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actForbiddenLocationIdArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActAiWeightedDestination(): boolean {
        return this._actAiWeightedDestination != null;
    }
    public getActAiWeightedDestination(): $Message$CommonProto$Structure$WeightedGridIndex | null | undefined {
        return this._actAiWeightedDestination;
    }
    public setActAiWeightedDestination(value: $Message$CommonProto$Structure$WeightedGridIndex | null | undefined): void {
        this._actAiWeightedDestination = value;
    }
    public createIfNotExistsActAiWeightedDestination(): $Message$CommonProto$Structure$WeightedGridIndex {
        return this._actAiWeightedDestination ??= new $Message$CommonProto$Structure$WeightedGridIndex();
    }

    public checkHasActCustomNameId(): boolean {
        return this._actCustomNameId != null;
    }
    public getActCustomNameId(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actCustomNameId;
    }
    public setActCustomNameId(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actCustomNameId = value;
    }
    public createIfNotExistsActCustomNameId(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actCustomNameId ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }
}
