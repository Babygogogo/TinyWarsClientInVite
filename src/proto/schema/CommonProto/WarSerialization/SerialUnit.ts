import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../Structure/GridIndex.js";
import { UnitBuff as $Message$CommonProto$Structure$UnitBuff, type UnitBuffJson as $Json$CommonProto$Structure$UnitBuff } from "../Structure/UnitBuff.js";
import { WeightedGridIndex as $Message$CommonProto$Structure$WeightedGridIndex, type WeightedGridIndexJson as $Json$CommonProto$Structure$WeightedGridIndex } from "../Structure/WeightedGridIndex.js";

export interface SerialUnitJson extends $ProtoSchemaJsonBase {
    unitType?: number | null | undefined;
    unitId?: number | null | undefined;
    playerIndex?: number | null | undefined;
    gridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    actionState?: number | null | undefined;
    currentHp?: number | null | undefined;
    aiMode?: number | null | undefined;
    groupedTagId?: number | null | undefined;
    customNameId?: number | null | undefined;
    currentPromotion?: number | null | undefined;
    isDiving?: boolean | null | undefined;
    isCoOnboard?: boolean | null | undefined;
    currentBuildMaterial?: number | null | undefined;
    aiWeightedDestination?: $Json$CommonProto$Structure$WeightedGridIndex | null | undefined;
    forbiddenGroupedLocationIdArray: number[];
    buffArray: $Json$CommonProto$Structure$UnitBuff[];
    primaryWeaponCurrentAmmo?: number | null | undefined;
    flareCurrentAmmo?: number | null | undefined;
    currentProduceMaterial?: number | null | undefined;
    currentFuel?: number | null | undefined;
    loaderUnitId?: number | null | undefined;
}

export class SerialUnit extends $ProtoSchemaBase {
    private _unitType?: number | null | undefined;
    private _unitId?: number | null | undefined;
    private _playerIndex?: number | null | undefined;
    private _gridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _actionState?: number | null | undefined;
    private _currentHp?: number | null | undefined;
    private _aiMode?: number | null | undefined;
    private _groupedTagId?: number | null | undefined;
    private _customNameId?: number | null | undefined;
    private _currentPromotion?: number | null | undefined;
    private _isDiving?: boolean | null | undefined;
    private _isCoOnboard?: boolean | null | undefined;
    private _currentBuildMaterial?: number | null | undefined;
    private _aiWeightedDestination?: $Message$CommonProto$Structure$WeightedGridIndex | null | undefined;
    private _forbiddenGroupedLocationIdArray: number[] = [];
    private _buffArray: $Message$CommonProto$Structure$UnitBuff[] = [];
    private _primaryWeaponCurrentAmmo?: number | null | undefined;
    private _flareCurrentAmmo?: number | null | undefined;
    private _currentProduceMaterial?: number | null | undefined;
    private _currentFuel?: number | null | undefined;
    private _loaderUnitId?: number | null | undefined;

    public static fromJson(obj: SerialUnitJson): SerialUnit {
        return new SerialUnit().loadJson(obj);
    }
    public override loadJson(obj: SerialUnitJson): this {
        this.setUnitType(obj.unitType);
        this.setUnitId(obj.unitId);
        this.setPlayerIndex(obj.playerIndex);
        this.setGridIndex(obj.gridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.gridIndex) : null);
        this.setActionState(obj.actionState);
        this.setCurrentHp(obj.currentHp);
        this.setAiMode(obj.aiMode);
        this.setGroupedTagId(obj.groupedTagId);
        this.setCustomNameId(obj.customNameId);
        this.setCurrentPromotion(obj.currentPromotion);
        this.setIsDiving(obj.isDiving);
        this.setIsCoOnboard(obj.isCoOnboard);
        this.setCurrentBuildMaterial(obj.currentBuildMaterial);
        this.setAiWeightedDestination(obj.aiWeightedDestination != null ? $Message$CommonProto$Structure$WeightedGridIndex.fromJson(obj.aiWeightedDestination) : null);
        this.setForbiddenGroupedLocationIdArray(obj.forbiddenGroupedLocationIdArray?.concat() ?? []);
        this.setBuffArray(obj.buffArray?.map(v => $Message$CommonProto$Structure$UnitBuff.fromJson(v)) ?? []);
        this.setPrimaryWeaponCurrentAmmo(obj.primaryWeaponCurrentAmmo);
        this.setFlareCurrentAmmo(obj.flareCurrentAmmo);
        this.setCurrentProduceMaterial(obj.currentProduceMaterial);
        this.setCurrentFuel(obj.currentFuel);
        this.setLoaderUnitId(obj.loaderUnitId);
        return this;
    }
    public override toJson(obj?: SerialUnitJson): SerialUnitJson {
        obj ??= ({} as SerialUnitJson);

        {
            const value = this.getUnitType();
            (value != null) && (obj.unitType = value);
        }

        {
            const value = this.getUnitId();
            (value != null) && (obj.unitId = value);
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getGridIndex();
            (value != null) && (obj.gridIndex = value.toJson());
        }

        {
            const value = this.getActionState();
            (value != null) && (obj.actionState = value);
        }

        {
            const value = this.getCurrentHp();
            (value != null) && (obj.currentHp = value);
        }

        {
            const value = this.getAiMode();
            (value != null) && (obj.aiMode = value);
        }

        {
            const value = this.getGroupedTagId();
            (value != null) && (obj.groupedTagId = value);
        }

        {
            const value = this.getCustomNameId();
            (value != null) && (obj.customNameId = value);
        }

        {
            const value = this.getCurrentPromotion();
            (value != null) && (obj.currentPromotion = value);
        }

        {
            const value = this.getIsDiving();
            (value != null) && (obj.isDiving = value);
        }

        {
            const value = this.getIsCoOnboard();
            (value != null) && (obj.isCoOnboard = value);
        }

        {
            const value = this.getCurrentBuildMaterial();
            (value != null) && (obj.currentBuildMaterial = value);
        }

        {
            const value = this.getAiWeightedDestination();
            (value != null) && (obj.aiWeightedDestination = value.toJson());
        }

        {
            obj.forbiddenGroupedLocationIdArray = this.getForbiddenGroupedLocationIdArray().concat();
        }

        {
            obj.buffArray = this.getBuffArray().map(v => v.toJson());
        }

        {
            const value = this.getPrimaryWeaponCurrentAmmo();
            (value != null) && (obj.primaryWeaponCurrentAmmo = value);
        }

        {
            const value = this.getFlareCurrentAmmo();
            (value != null) && (obj.flareCurrentAmmo = value);
        }

        {
            const value = this.getCurrentProduceMaterial();
            (value != null) && (obj.currentProduceMaterial = value);
        }

        {
            const value = this.getCurrentFuel();
            (value != null) && (obj.currentFuel = value);
        }

        {
            const value = this.getLoaderUnitId();
            (value != null) && (obj.loaderUnitId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitType();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnitId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getActionState();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getCurrentHp();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getAiMode();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getGroupedTagId();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getCustomNameId();
            if (value != null) {
                writer.uint32(72).int32(value);
            }
        }

        {
            const value = this.getCurrentPromotion();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getIsDiving();
            if ((value != null) && (value != false)) {
                writer.uint32(88).bool(value);
            }
        }

        {
            const value = this.getIsCoOnboard();
            if ((value != null) && (value != false)) {
                writer.uint32(96).bool(value);
            }
        }

        {
            const value = this.getCurrentBuildMaterial();
            if ((value != null) && (value != 0)) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getAiWeightedDestination();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getForbiddenGroupedLocationIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(122).fork();
                for (let i = 0; i < length; ++i) {
                    writer.uint32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getBuffArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(130).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getPrimaryWeaponCurrentAmmo();
            if ((value != null) && (value != 0)) {
                writer.uint32(136).int32(value);
            }
        }

        {
            const value = this.getFlareCurrentAmmo();
            if ((value != null) && (value != 0)) {
                writer.uint32(144).int32(value);
            }
        }

        {
            const value = this.getCurrentProduceMaterial();
            if ((value != null) && (value != 0)) {
                writer.uint32(152).int32(value);
            }
        }

        {
            const value = this.getCurrentFuel();
            if ((value != null) && (value != 0)) {
                writer.uint32(160).int32(value);
            }
        }

        {
            const value = this.getLoaderUnitId();
            if (value != null) {
                writer.uint32(168).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitType(reader.int32());
                    break;

                case 2:
                    msg.setUnitId(reader.int32());
                    break;

                case 3:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 4:
                    msg.setGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setActionState(reader.int32());
                    break;

                case 6:
                    msg.setCurrentHp(reader.int32());
                    break;

                case 7:
                    msg.setAiMode(reader.int32());
                    break;

                case 8:
                    msg.setGroupedTagId(reader.int32());
                    break;

                case 9:
                    msg.setCustomNameId(reader.int32());
                    break;

                case 10:
                    msg.setCurrentPromotion(reader.int32());
                    break;

                case 11:
                    msg.setIsDiving(reader.bool());
                    break;

                case 12:
                    msg.setIsCoOnboard(reader.bool());
                    break;

                case 13:
                    msg.setCurrentBuildMaterial(reader.int32());
                    break;

                case 14:
                    msg.setAiWeightedDestination($Message$CommonProto$Structure$WeightedGridIndex.decode(reader, reader.uint32()));
                    break;

                case 15:
                    {
                        const arr = msg._forbiddenGroupedLocationIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.uint32());
                            }
                        } else {
                            arr.push(reader.uint32());
                        }
                    }
                    break;

                case 16:
                    {
                        const arr = msg._buffArray;
                        arr.push($Message$CommonProto$Structure$UnitBuff.decode(reader, reader.uint32()));
                    }
                    break;

                case 17:
                    msg.setPrimaryWeaponCurrentAmmo(reader.int32());
                    break;

                case 18:
                    msg.setFlareCurrentAmmo(reader.int32());
                    break;

                case 19:
                    msg.setCurrentProduceMaterial(reader.int32());
                    break;

                case 20:
                    msg.setCurrentFuel(reader.int32());
                    break;

                case 21:
                    msg.setLoaderUnitId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialUnit {
        return SerialUnit.decode(this.encode());
    }

    public override getSchemaName(): "SerialUnit" {
        return "SerialUnit";
    }

    public checkHasUnitType(): boolean {
        return this._unitType != null;
    }
    public getUnitType(): number {
        return this._unitType ?? 0;
    }
    public setUnitType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitType = null;
        } else {
            this._unitType = value;
        }
    }

    public checkHasUnitId(): boolean {
        return this._unitId != null;
    }
    public getUnitId(): number {
        return this._unitId ?? 0;
    }
    public setUnitId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitId = null;
        } else {
            this._unitId = value;
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

    public checkHasGridIndex(): boolean {
        return this._gridIndex != null;
    }
    public getGridIndex(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._gridIndex;
    }
    public setGridIndex(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._gridIndex = value;
    }
    public createIfNotExistsGridIndex(): $Message$CommonProto$Structure$GridIndex {
        return this._gridIndex ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasActionState(): boolean {
        return this._actionState != null;
    }
    public getActionState(): number {
        return this._actionState ?? 0;
    }
    public setActionState(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._actionState = null;
        } else {
            this._actionState = value;
        }
    }

    public checkHasCurrentHp(): boolean {
        return this._currentHp != null;
    }
    public getCurrentHp(): number {
        return this._currentHp ?? 0;
    }
    public setCurrentHp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentHp = null;
        } else {
            this._currentHp = value;
        }
    }

    public checkHasAiMode(): boolean {
        return this._aiMode != null;
    }
    public getAiMode(): number {
        return this._aiMode ?? 0;
    }
    public setAiMode(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._aiMode = null;
        } else {
            this._aiMode = value;
        }
    }

    public checkHasGroupedTagId(): boolean {
        return this._groupedTagId != null;
    }
    public getGroupedTagId(): number {
        return this._groupedTagId ?? 0;
    }
    public setGroupedTagId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._groupedTagId = null;
        } else {
            this._groupedTagId = value;
        }
    }

    public checkHasCustomNameId(): boolean {
        return this._customNameId != null;
    }
    public getCustomNameId(): number | null | undefined {
        return this._customNameId;
    }
    public setCustomNameId(value: number | null | undefined): void {
        this._customNameId = value;
    }

    public checkHasCurrentPromotion(): boolean {
        return this._currentPromotion != null;
    }
    public getCurrentPromotion(): number {
        return this._currentPromotion ?? 0;
    }
    public setCurrentPromotion(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentPromotion = null;
        } else {
            this._currentPromotion = value;
        }
    }

    public checkHasIsDiving(): boolean {
        return this._isDiving != null;
    }
    public getIsDiving(): boolean {
        return this._isDiving ?? false;
    }
    public setIsDiving(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isDiving = null;
        } else {
            this._isDiving = value;
        }
    }

    public checkHasIsCoOnboard(): boolean {
        return this._isCoOnboard != null;
    }
    public getIsCoOnboard(): boolean {
        return this._isCoOnboard ?? false;
    }
    public setIsCoOnboard(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isCoOnboard = null;
        } else {
            this._isCoOnboard = value;
        }
    }

    public checkHasCurrentBuildMaterial(): boolean {
        return this._currentBuildMaterial != null;
    }
    public getCurrentBuildMaterial(): number {
        return this._currentBuildMaterial ?? 0;
    }
    public setCurrentBuildMaterial(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentBuildMaterial = null;
        } else {
            this._currentBuildMaterial = value;
        }
    }

    public checkHasAiWeightedDestination(): boolean {
        return this._aiWeightedDestination != null;
    }
    public getAiWeightedDestination(): $Message$CommonProto$Structure$WeightedGridIndex | null | undefined {
        return this._aiWeightedDestination;
    }
    public setAiWeightedDestination(value: $Message$CommonProto$Structure$WeightedGridIndex | null | undefined): void {
        this._aiWeightedDestination = value;
    }
    public createIfNotExistsAiWeightedDestination(): $Message$CommonProto$Structure$WeightedGridIndex {
        return this._aiWeightedDestination ??= new $Message$CommonProto$Structure$WeightedGridIndex();
    }

    public getForbiddenGroupedLocationIdArray(): number[] {
        return this._forbiddenGroupedLocationIdArray;
    }
    public setForbiddenGroupedLocationIdArray(value: number[]): void {
        this._forbiddenGroupedLocationIdArray = value;
    }

    public getBuffArray(): $Message$CommonProto$Structure$UnitBuff[] {
        return this._buffArray;
    }
    public setBuffArray(value: $Message$CommonProto$Structure$UnitBuff[]): void {
        this._buffArray = value;
    }

    public checkHasPrimaryWeaponCurrentAmmo(): boolean {
        return this._primaryWeaponCurrentAmmo != null;
    }
    public getPrimaryWeaponCurrentAmmo(): number {
        return this._primaryWeaponCurrentAmmo ?? 0;
    }
    public setPrimaryWeaponCurrentAmmo(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._primaryWeaponCurrentAmmo = null;
        } else {
            this._primaryWeaponCurrentAmmo = value;
        }
    }

    public checkHasFlareCurrentAmmo(): boolean {
        return this._flareCurrentAmmo != null;
    }
    public getFlareCurrentAmmo(): number {
        return this._flareCurrentAmmo ?? 0;
    }
    public setFlareCurrentAmmo(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._flareCurrentAmmo = null;
        } else {
            this._flareCurrentAmmo = value;
        }
    }

    public checkHasCurrentProduceMaterial(): boolean {
        return this._currentProduceMaterial != null;
    }
    public getCurrentProduceMaterial(): number {
        return this._currentProduceMaterial ?? 0;
    }
    public setCurrentProduceMaterial(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentProduceMaterial = null;
        } else {
            this._currentProduceMaterial = value;
        }
    }

    public checkHasCurrentFuel(): boolean {
        return this._currentFuel != null;
    }
    public getCurrentFuel(): number {
        return this._currentFuel ?? 0;
    }
    public setCurrentFuel(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentFuel = null;
        } else {
            this._currentFuel = value;
        }
    }

    public checkHasLoaderUnitId(): boolean {
        return this._loaderUnitId != null;
    }
    public getLoaderUnitId(): number | null | undefined {
        return this._loaderUnitId;
    }
    public setLoaderUnitId(value: number | null | undefined): void {
        this._loaderUnitId = value;
    }
}
