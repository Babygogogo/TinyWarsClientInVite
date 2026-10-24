import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ArrayModifier as $Message$CommonProto$Structure$ArrayModifier, type ArrayModifierJson as $Json$CommonProto$Structure$ArrayModifier } from "../Structure/ArrayModifier.js";
import { MultiplierAndOffset as $Message$CommonProto$Structure$MultiplierAndOffset, type MultiplierAndOffsetJson as $Json$CommonProto$Structure$MultiplierAndOffset } from "../Structure/MultiplierAndOffset.js";
import { PlayerFilter as $Message$CommonProto$Structure$PlayerFilter, type PlayerFilterJson as $Json$CommonProto$Structure$PlayerFilter } from "../Structure/PlayerFilter.js";
import { TileFilter as $Message$CommonProto$Structure$TileFilter, type TileFilterJson as $Json$CommonProto$Structure$TileFilter } from "../Structure/TileFilter.js";
import { UnitFilter as $Message$CommonProto$Structure$UnitFilter, type UnitFilterJson as $Json$CommonProto$Structure$UnitFilter } from "../Structure/UnitFilter.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WeaSetCustomBuildingStateSimpleJson extends $ProtoSchemaJsonBase {
    conTileFilter?: $Json$CommonProto$Structure$TileFilter | null | undefined;
    conPlayerFilter?: $Json$CommonProto$Structure$PlayerFilter | null | undefined;
    conUnitFilter?: $Json$CommonProto$Structure$UnitFilter | null | undefined;
    conUnitComparator?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
    actDefenseAmount?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actDefenseUnitTypeArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actMaxCapturePoint?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actDeleteMaxCapturePoint?: boolean | null | undefined;
    actIsDefeatedOnCapture?: boolean | null | undefined;
    actRepairNormalizedHp?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actDeleteRepairNormalizedHp?: boolean | null | undefined;
    actRepairUnitTypeArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actIncomePerTurn?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actVisionRange?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actIsVisionEnabledForAllPlayers?: boolean | null | undefined;
    actHideUnitTypeArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actProduceUnitTypeArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actGlobalAttackBonus?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actGlobalDefenseBonus?: $Json$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    actUnitTypeArrayForCoBoard?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
    actBlockEnemyUnitTypeArray?: $Json$CommonProto$Structure$ArrayModifier | null | undefined;
}

export class WeaSetCustomBuildingStateSimple extends $ProtoSchemaBase {
    private _conTileFilter?: $Message$CommonProto$Structure$TileFilter | null | undefined;
    private _conPlayerFilter?: $Message$CommonProto$Structure$PlayerFilter | null | undefined;
    private _conUnitFilter?: $Message$CommonProto$Structure$UnitFilter | null | undefined;
    private _conUnitComparator?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;
    private _actDefenseAmount?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actDefenseUnitTypeArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actMaxCapturePoint?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actDeleteMaxCapturePoint?: boolean | null | undefined;
    private _actIsDefeatedOnCapture?: boolean | null | undefined;
    private _actRepairNormalizedHp?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actDeleteRepairNormalizedHp?: boolean | null | undefined;
    private _actRepairUnitTypeArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actIncomePerTurn?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actVisionRange?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actIsVisionEnabledForAllPlayers?: boolean | null | undefined;
    private _actHideUnitTypeArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actProduceUnitTypeArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actGlobalAttackBonus?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actGlobalDefenseBonus?: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined;
    private _actUnitTypeArrayForCoBoard?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;
    private _actBlockEnemyUnitTypeArray?: $Message$CommonProto$Structure$ArrayModifier | null | undefined;

    public static fromJson(obj: WeaSetCustomBuildingStateSimpleJson): WeaSetCustomBuildingStateSimple {
        return new WeaSetCustomBuildingStateSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetCustomBuildingStateSimpleJson): this {
        this.setConTileFilter(obj.conTileFilter != null ? $Message$CommonProto$Structure$TileFilter.fromJson(obj.conTileFilter) : null);
        this.setConPlayerFilter(obj.conPlayerFilter != null ? $Message$CommonProto$Structure$PlayerFilter.fromJson(obj.conPlayerFilter) : null);
        this.setConUnitFilter(obj.conUnitFilter != null ? $Message$CommonProto$Structure$UnitFilter.fromJson(obj.conUnitFilter) : null);
        this.setConUnitComparator(obj.conUnitComparator != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.conUnitComparator) : null);
        this.setActDefenseAmount(obj.actDefenseAmount != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actDefenseAmount) : null);
        this.setActDefenseUnitTypeArray(obj.actDefenseUnitTypeArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actDefenseUnitTypeArray) : null);
        this.setActMaxCapturePoint(obj.actMaxCapturePoint != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actMaxCapturePoint) : null);
        this.setActDeleteMaxCapturePoint(obj.actDeleteMaxCapturePoint);
        this.setActIsDefeatedOnCapture(obj.actIsDefeatedOnCapture);
        this.setActRepairNormalizedHp(obj.actRepairNormalizedHp != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actRepairNormalizedHp) : null);
        this.setActDeleteRepairNormalizedHp(obj.actDeleteRepairNormalizedHp);
        this.setActRepairUnitTypeArray(obj.actRepairUnitTypeArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actRepairUnitTypeArray) : null);
        this.setActIncomePerTurn(obj.actIncomePerTurn != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actIncomePerTurn) : null);
        this.setActVisionRange(obj.actVisionRange != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actVisionRange) : null);
        this.setActIsVisionEnabledForAllPlayers(obj.actIsVisionEnabledForAllPlayers);
        this.setActHideUnitTypeArray(obj.actHideUnitTypeArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actHideUnitTypeArray) : null);
        this.setActProduceUnitTypeArray(obj.actProduceUnitTypeArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actProduceUnitTypeArray) : null);
        this.setActGlobalAttackBonus(obj.actGlobalAttackBonus != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actGlobalAttackBonus) : null);
        this.setActGlobalDefenseBonus(obj.actGlobalDefenseBonus != null ? $Message$CommonProto$Structure$MultiplierAndOffset.fromJson(obj.actGlobalDefenseBonus) : null);
        this.setActUnitTypeArrayForCoBoard(obj.actUnitTypeArrayForCoBoard != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actUnitTypeArrayForCoBoard) : null);
        this.setActBlockEnemyUnitTypeArray(obj.actBlockEnemyUnitTypeArray != null ? $Message$CommonProto$Structure$ArrayModifier.fromJson(obj.actBlockEnemyUnitTypeArray) : null);
        return this;
    }
    public override toJson(obj?: WeaSetCustomBuildingStateSimpleJson): WeaSetCustomBuildingStateSimpleJson {
        obj ??= ({} as WeaSetCustomBuildingStateSimpleJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value.toJson());
        }

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
            const value = this.getActDefenseAmount();
            (value != null) && (obj.actDefenseAmount = value.toJson());
        }

        {
            const value = this.getActDefenseUnitTypeArray();
            (value != null) && (obj.actDefenseUnitTypeArray = value.toJson());
        }

        {
            const value = this.getActMaxCapturePoint();
            (value != null) && (obj.actMaxCapturePoint = value.toJson());
        }

        {
            const value = this.getActDeleteMaxCapturePoint();
            (value != null) && (obj.actDeleteMaxCapturePoint = value);
        }

        {
            const value = this.getActIsDefeatedOnCapture();
            (value != null) && (obj.actIsDefeatedOnCapture = value);
        }

        {
            const value = this.getActRepairNormalizedHp();
            (value != null) && (obj.actRepairNormalizedHp = value.toJson());
        }

        {
            const value = this.getActDeleteRepairNormalizedHp();
            (value != null) && (obj.actDeleteRepairNormalizedHp = value);
        }

        {
            const value = this.getActRepairUnitTypeArray();
            (value != null) && (obj.actRepairUnitTypeArray = value.toJson());
        }

        {
            const value = this.getActIncomePerTurn();
            (value != null) && (obj.actIncomePerTurn = value.toJson());
        }

        {
            const value = this.getActVisionRange();
            (value != null) && (obj.actVisionRange = value.toJson());
        }

        {
            const value = this.getActIsVisionEnabledForAllPlayers();
            (value != null) && (obj.actIsVisionEnabledForAllPlayers = value);
        }

        {
            const value = this.getActHideUnitTypeArray();
            (value != null) && (obj.actHideUnitTypeArray = value.toJson());
        }

        {
            const value = this.getActProduceUnitTypeArray();
            (value != null) && (obj.actProduceUnitTypeArray = value.toJson());
        }

        {
            const value = this.getActGlobalAttackBonus();
            (value != null) && (obj.actGlobalAttackBonus = value.toJson());
        }

        {
            const value = this.getActGlobalDefenseBonus();
            (value != null) && (obj.actGlobalDefenseBonus = value.toJson());
        }

        {
            const value = this.getActUnitTypeArrayForCoBoard();
            (value != null) && (obj.actUnitTypeArrayForCoBoard = value.toJson());
        }

        {
            const value = this.getActBlockEnemyUnitTypeArray();
            (value != null) && (obj.actBlockEnemyUnitTypeArray = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConTileFilter();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getConPlayerFilter();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitFilter();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getConUnitComparator();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getActDefenseAmount();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getActDefenseUnitTypeArray();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getActMaxCapturePoint();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getActDeleteMaxCapturePoint();
            if ((value != null) && (value != false)) {
                writer.uint32(112).bool(value);
            }
        }

        {
            const value = this.getActIsDefeatedOnCapture();
            if (value != null) {
                writer.uint32(120).bool(value);
            }
        }

        {
            const value = this.getActRepairNormalizedHp();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getActDeleteRepairNormalizedHp();
            if ((value != null) && (value != false)) {
                writer.uint32(136).bool(value);
            }
        }

        {
            const value = this.getActRepairUnitTypeArray();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getActIncomePerTurn();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        {
            const value = this.getActVisionRange();
            if (value != null) {
                value.toWriter(writer.uint32(162).fork()).ldelim();
            }
        }

        {
            const value = this.getActIsVisionEnabledForAllPlayers();
            if (value != null) {
                writer.uint32(168).bool(value);
            }
        }

        {
            const value = this.getActHideUnitTypeArray();
            if (value != null) {
                value.toWriter(writer.uint32(178).fork()).ldelim();
            }
        }

        {
            const value = this.getActProduceUnitTypeArray();
            if (value != null) {
                value.toWriter(writer.uint32(186).fork()).ldelim();
            }
        }

        {
            const value = this.getActGlobalAttackBonus();
            if (value != null) {
                value.toWriter(writer.uint32(194).fork()).ldelim();
            }
        }

        {
            const value = this.getActGlobalDefenseBonus();
            if (value != null) {
                value.toWriter(writer.uint32(202).fork()).ldelim();
            }
        }

        {
            const value = this.getActUnitTypeArrayForCoBoard();
            if (value != null) {
                value.toWriter(writer.uint32(210).fork()).ldelim();
            }
        }

        {
            const value = this.getActBlockEnemyUnitTypeArray();
            if (value != null) {
                value.toWriter(writer.uint32(218).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetCustomBuildingStateSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetCustomBuildingStateSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter($Message$CommonProto$Structure$TileFilter.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setConPlayerFilter($Message$CommonProto$Structure$PlayerFilter.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setConUnitFilter($Message$CommonProto$Structure$UnitFilter.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setConUnitComparator($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setActDefenseAmount($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setActDefenseUnitTypeArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setActMaxCapturePoint($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setActDeleteMaxCapturePoint(reader.bool());
                    break;

                case 15:
                    msg.setActIsDefeatedOnCapture(reader.bool());
                    break;

                case 16:
                    msg.setActRepairNormalizedHp($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setActDeleteRepairNormalizedHp(reader.bool());
                    break;

                case 18:
                    msg.setActRepairUnitTypeArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setActIncomePerTurn($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 20:
                    msg.setActVisionRange($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 21:
                    msg.setActIsVisionEnabledForAllPlayers(reader.bool());
                    break;

                case 22:
                    msg.setActHideUnitTypeArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 23:
                    msg.setActProduceUnitTypeArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 24:
                    msg.setActGlobalAttackBonus($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 25:
                    msg.setActGlobalDefenseBonus($Message$CommonProto$Structure$MultiplierAndOffset.decode(reader, reader.uint32()));
                    break;

                case 26:
                    msg.setActUnitTypeArrayForCoBoard($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                case 27:
                    msg.setActBlockEnemyUnitTypeArray($Message$CommonProto$Structure$ArrayModifier.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetCustomBuildingStateSimple {
        return WeaSetCustomBuildingStateSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetCustomBuildingStateSimple" {
        return "WeaSetCustomBuildingStateSimple";
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

    public checkHasActDefenseAmount(): boolean {
        return this._actDefenseAmount != null;
    }
    public getActDefenseAmount(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actDefenseAmount;
    }
    public setActDefenseAmount(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actDefenseAmount = value;
    }
    public createIfNotExistsActDefenseAmount(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actDefenseAmount ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActDefenseUnitTypeArray(): boolean {
        return this._actDefenseUnitTypeArray != null;
    }
    public getActDefenseUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actDefenseUnitTypeArray;
    }
    public setActDefenseUnitTypeArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actDefenseUnitTypeArray = value;
    }
    public createIfNotExistsActDefenseUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actDefenseUnitTypeArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActMaxCapturePoint(): boolean {
        return this._actMaxCapturePoint != null;
    }
    public getActMaxCapturePoint(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actMaxCapturePoint;
    }
    public setActMaxCapturePoint(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actMaxCapturePoint = value;
    }
    public createIfNotExistsActMaxCapturePoint(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actMaxCapturePoint ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActDeleteMaxCapturePoint(): boolean {
        return this._actDeleteMaxCapturePoint != null;
    }
    public getActDeleteMaxCapturePoint(): boolean {
        return this._actDeleteMaxCapturePoint ?? false;
    }
    public setActDeleteMaxCapturePoint(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actDeleteMaxCapturePoint = null;
        } else {
            this._actDeleteMaxCapturePoint = value;
        }
    }

    public checkHasActIsDefeatedOnCapture(): boolean {
        return this._actIsDefeatedOnCapture != null;
    }
    public getActIsDefeatedOnCapture(): boolean | null | undefined {
        return this._actIsDefeatedOnCapture;
    }
    public setActIsDefeatedOnCapture(value: boolean | null | undefined): void {
        this._actIsDefeatedOnCapture = value;
    }

    public checkHasActRepairNormalizedHp(): boolean {
        return this._actRepairNormalizedHp != null;
    }
    public getActRepairNormalizedHp(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actRepairNormalizedHp;
    }
    public setActRepairNormalizedHp(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actRepairNormalizedHp = value;
    }
    public createIfNotExistsActRepairNormalizedHp(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actRepairNormalizedHp ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActDeleteRepairNormalizedHp(): boolean {
        return this._actDeleteRepairNormalizedHp != null;
    }
    public getActDeleteRepairNormalizedHp(): boolean {
        return this._actDeleteRepairNormalizedHp ?? false;
    }
    public setActDeleteRepairNormalizedHp(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._actDeleteRepairNormalizedHp = null;
        } else {
            this._actDeleteRepairNormalizedHp = value;
        }
    }

    public checkHasActRepairUnitTypeArray(): boolean {
        return this._actRepairUnitTypeArray != null;
    }
    public getActRepairUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actRepairUnitTypeArray;
    }
    public setActRepairUnitTypeArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actRepairUnitTypeArray = value;
    }
    public createIfNotExistsActRepairUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actRepairUnitTypeArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActIncomePerTurn(): boolean {
        return this._actIncomePerTurn != null;
    }
    public getActIncomePerTurn(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actIncomePerTurn;
    }
    public setActIncomePerTurn(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actIncomePerTurn = value;
    }
    public createIfNotExistsActIncomePerTurn(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actIncomePerTurn ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActVisionRange(): boolean {
        return this._actVisionRange != null;
    }
    public getActVisionRange(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actVisionRange;
    }
    public setActVisionRange(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actVisionRange = value;
    }
    public createIfNotExistsActVisionRange(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actVisionRange ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActIsVisionEnabledForAllPlayers(): boolean {
        return this._actIsVisionEnabledForAllPlayers != null;
    }
    public getActIsVisionEnabledForAllPlayers(): boolean | null | undefined {
        return this._actIsVisionEnabledForAllPlayers;
    }
    public setActIsVisionEnabledForAllPlayers(value: boolean | null | undefined): void {
        this._actIsVisionEnabledForAllPlayers = value;
    }

    public checkHasActHideUnitTypeArray(): boolean {
        return this._actHideUnitTypeArray != null;
    }
    public getActHideUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actHideUnitTypeArray;
    }
    public setActHideUnitTypeArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actHideUnitTypeArray = value;
    }
    public createIfNotExistsActHideUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actHideUnitTypeArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActProduceUnitTypeArray(): boolean {
        return this._actProduceUnitTypeArray != null;
    }
    public getActProduceUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actProduceUnitTypeArray;
    }
    public setActProduceUnitTypeArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actProduceUnitTypeArray = value;
    }
    public createIfNotExistsActProduceUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actProduceUnitTypeArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActGlobalAttackBonus(): boolean {
        return this._actGlobalAttackBonus != null;
    }
    public getActGlobalAttackBonus(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actGlobalAttackBonus;
    }
    public setActGlobalAttackBonus(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actGlobalAttackBonus = value;
    }
    public createIfNotExistsActGlobalAttackBonus(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actGlobalAttackBonus ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActGlobalDefenseBonus(): boolean {
        return this._actGlobalDefenseBonus != null;
    }
    public getActGlobalDefenseBonus(): $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined {
        return this._actGlobalDefenseBonus;
    }
    public setActGlobalDefenseBonus(value: $Message$CommonProto$Structure$MultiplierAndOffset | null | undefined): void {
        this._actGlobalDefenseBonus = value;
    }
    public createIfNotExistsActGlobalDefenseBonus(): $Message$CommonProto$Structure$MultiplierAndOffset {
        return this._actGlobalDefenseBonus ??= new $Message$CommonProto$Structure$MultiplierAndOffset();
    }

    public checkHasActUnitTypeArrayForCoBoard(): boolean {
        return this._actUnitTypeArrayForCoBoard != null;
    }
    public getActUnitTypeArrayForCoBoard(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actUnitTypeArrayForCoBoard;
    }
    public setActUnitTypeArrayForCoBoard(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actUnitTypeArrayForCoBoard = value;
    }
    public createIfNotExistsActUnitTypeArrayForCoBoard(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actUnitTypeArrayForCoBoard ??= new $Message$CommonProto$Structure$ArrayModifier();
    }

    public checkHasActBlockEnemyUnitTypeArray(): boolean {
        return this._actBlockEnemyUnitTypeArray != null;
    }
    public getActBlockEnemyUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier | null | undefined {
        return this._actBlockEnemyUnitTypeArray;
    }
    public setActBlockEnemyUnitTypeArray(value: $Message$CommonProto$Structure$ArrayModifier | null | undefined): void {
        this._actBlockEnemyUnitTypeArray = value;
    }
    public createIfNotExistsActBlockEnemyUnitTypeArray(): $Message$CommonProto$Structure$ArrayModifier {
        return this._actBlockEnemyUnitTypeArray ??= new $Message$CommonProto$Structure$ArrayModifier();
    }
}
