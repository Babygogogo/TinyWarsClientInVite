import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../Structure/GridIndex.js";
import { TileBuff as $Message$CommonProto$Structure$TileBuff, type TileBuffJson as $Json$CommonProto$Structure$TileBuff } from "../Structure/TileBuff.js";
import { TileCustomBuildingData as $Message$CommonProto$WarSerialization$TileCustomBuildingData, type TileCustomBuildingDataJson as $Json$CommonProto$WarSerialization$TileCustomBuildingData } from "./TileCustomBuildingData.js";
import { TileCustomCannonData as $Message$CommonProto$WarSerialization$TileCustomCannonData, type TileCustomCannonDataJson as $Json$CommonProto$WarSerialization$TileCustomCannonData } from "./TileCustomCannonData.js";
import { TileCustomCrystalData as $Message$CommonProto$WarSerialization$TileCustomCrystalData, type TileCustomCrystalDataJson as $Json$CommonProto$WarSerialization$TileCustomCrystalData } from "./TileCustomCrystalData.js";
import { TileCustomLaserTurretData as $Message$CommonProto$WarSerialization$TileCustomLaserTurretData, type TileCustomLaserTurretDataJson as $Json$CommonProto$WarSerialization$TileCustomLaserTurretData } from "./TileCustomLaserTurretData.js";

export interface SerialTileJson extends $ProtoSchemaJsonBase {
    baseType?: number | null | undefined;
    objectType?: number | null | undefined;
    playerIndex?: number | null | undefined;
    gridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    decorationType?: number | null | undefined;
    baseShapeId?: number | null | undefined;
    objectShapeId?: number | null | undefined;
    decorationShapeId?: number | null | undefined;
    isHighlighted?: boolean | null | undefined;
    customNameId?: number | null | undefined;
    groupedLocationIdArray: number[];
    unfixedBuffArray: $Json$CommonProto$Structure$TileBuff[];
    currentHp?: number | null | undefined;
    currentBuildPoint?: number | null | undefined;
    currentCapturePoint?: number | null | undefined;
    customCrystalData?: $Json$CommonProto$WarSerialization$TileCustomCrystalData | null | undefined;
    customCannonData?: $Json$CommonProto$WarSerialization$TileCustomCannonData | null | undefined;
    customLaserTurretData?: $Json$CommonProto$WarSerialization$TileCustomLaserTurretData | null | undefined;
    customBuildingData?: $Json$CommonProto$WarSerialization$TileCustomBuildingData | null | undefined;
}

export class SerialTile extends $ProtoSchemaBase {
    private _baseType?: number | null | undefined;
    private _objectType?: number | null | undefined;
    private _playerIndex?: number | null | undefined;
    private _gridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _decorationType?: number | null | undefined;
    private _baseShapeId?: number | null | undefined;
    private _objectShapeId?: number | null | undefined;
    private _decorationShapeId?: number | null | undefined;
    private _isHighlighted?: boolean | null | undefined;
    private _customNameId?: number | null | undefined;
    private _groupedLocationIdArray: number[] = [];
    private _unfixedBuffArray: $Message$CommonProto$Structure$TileBuff[] = [];
    private _currentHp?: number | null | undefined;
    private _currentBuildPoint?: number | null | undefined;
    private _currentCapturePoint?: number | null | undefined;
    private _customCrystalData?: $Message$CommonProto$WarSerialization$TileCustomCrystalData | null | undefined;
    private _customCannonData?: $Message$CommonProto$WarSerialization$TileCustomCannonData | null | undefined;
    private _customLaserTurretData?: $Message$CommonProto$WarSerialization$TileCustomLaserTurretData | null | undefined;
    private _customBuildingData?: $Message$CommonProto$WarSerialization$TileCustomBuildingData | null | undefined;

    public static fromJson(obj: SerialTileJson): SerialTile {
        return new SerialTile().loadJson(obj);
    }
    public override loadJson(obj: SerialTileJson): this {
        this.setBaseType(obj.baseType);
        this.setObjectType(obj.objectType);
        this.setPlayerIndex(obj.playerIndex);
        this.setGridIndex(obj.gridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.gridIndex) : null);
        this.setDecorationType(obj.decorationType);
        this.setBaseShapeId(obj.baseShapeId);
        this.setObjectShapeId(obj.objectShapeId);
        this.setDecorationShapeId(obj.decorationShapeId);
        this.setIsHighlighted(obj.isHighlighted);
        this.setCustomNameId(obj.customNameId);
        this.setGroupedLocationIdArray(obj.groupedLocationIdArray?.concat() ?? []);
        this.setUnfixedBuffArray(obj.unfixedBuffArray?.map(v => $Message$CommonProto$Structure$TileBuff.fromJson(v)) ?? []);
        this.setCurrentHp(obj.currentHp);
        this.setCurrentBuildPoint(obj.currentBuildPoint);
        this.setCurrentCapturePoint(obj.currentCapturePoint);
        this.setCustomCrystalData(obj.customCrystalData != null ? $Message$CommonProto$WarSerialization$TileCustomCrystalData.fromJson(obj.customCrystalData) : null);
        this.setCustomCannonData(obj.customCannonData != null ? $Message$CommonProto$WarSerialization$TileCustomCannonData.fromJson(obj.customCannonData) : null);
        this.setCustomLaserTurretData(obj.customLaserTurretData != null ? $Message$CommonProto$WarSerialization$TileCustomLaserTurretData.fromJson(obj.customLaserTurretData) : null);
        this.setCustomBuildingData(obj.customBuildingData != null ? $Message$CommonProto$WarSerialization$TileCustomBuildingData.fromJson(obj.customBuildingData) : null);
        return this;
    }
    public override toJson(obj?: SerialTileJson): SerialTileJson {
        obj ??= ({} as SerialTileJson);

        {
            const value = this.getBaseType();
            (value != null) && (obj.baseType = value);
        }

        {
            const value = this.getObjectType();
            (value != null) && (obj.objectType = value);
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
            const value = this.getDecorationType();
            (value != null) && (obj.decorationType = value);
        }

        {
            const value = this.getBaseShapeId();
            (value != null) && (obj.baseShapeId = value);
        }

        {
            const value = this.getObjectShapeId();
            (value != null) && (obj.objectShapeId = value);
        }

        {
            const value = this.getDecorationShapeId();
            (value != null) && (obj.decorationShapeId = value);
        }

        {
            const value = this.getIsHighlighted();
            (value != null) && (obj.isHighlighted = value);
        }

        {
            const value = this.getCustomNameId();
            (value != null) && (obj.customNameId = value);
        }

        {
            obj.groupedLocationIdArray = this.getGroupedLocationIdArray().concat();
        }

        {
            obj.unfixedBuffArray = this.getUnfixedBuffArray().map(v => v.toJson());
        }

        {
            const value = this.getCurrentHp();
            (value != null) && (obj.currentHp = value);
        }

        {
            const value = this.getCurrentBuildPoint();
            (value != null) && (obj.currentBuildPoint = value);
        }

        {
            const value = this.getCurrentCapturePoint();
            (value != null) && (obj.currentCapturePoint = value);
        }

        {
            const value = this.getCustomCrystalData();
            (value != null) && (obj.customCrystalData = value.toJson());
        }

        {
            const value = this.getCustomCannonData();
            (value != null) && (obj.customCannonData = value.toJson());
        }

        {
            const value = this.getCustomLaserTurretData();
            (value != null) && (obj.customLaserTurretData = value.toJson());
        }

        {
            const value = this.getCustomBuildingData();
            (value != null) && (obj.customBuildingData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getBaseType();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getObjectType();
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
            const value = this.getDecorationType();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getBaseShapeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getObjectShapeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getDecorationShapeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getIsHighlighted();
            if ((value != null) && (value != false)) {
                writer.uint32(72).bool(value);
            }
        }

        {
            const value = this.getCustomNameId();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getGroupedLocationIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(90).fork();
                for (let i = 0; i < length; ++i) {
                    writer.uint32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getUnfixedBuffArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(98).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCurrentHp();
            if ((value != null) && (value != 0)) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getCurrentBuildPoint();
            if ((value != null) && (value != 0)) {
                writer.uint32(112).int32(value);
            }
        }

        {
            const value = this.getCurrentCapturePoint();
            if ((value != null) && (value != 0)) {
                writer.uint32(120).int32(value);
            }
        }

        {
            const value = this.getCustomCrystalData();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getCustomCannonData();
            if (value != null) {
                value.toWriter(writer.uint32(138).fork()).ldelim();
            }
        }

        {
            const value = this.getCustomLaserTurretData();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getCustomBuildingData();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialTile {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialTile();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setBaseType(reader.int32());
                    break;

                case 2:
                    msg.setObjectType(reader.int32());
                    break;

                case 3:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 4:
                    msg.setGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setDecorationType(reader.int32());
                    break;

                case 6:
                    msg.setBaseShapeId(reader.int32());
                    break;

                case 7:
                    msg.setObjectShapeId(reader.int32());
                    break;

                case 8:
                    msg.setDecorationShapeId(reader.int32());
                    break;

                case 9:
                    msg.setIsHighlighted(reader.bool());
                    break;

                case 10:
                    msg.setCustomNameId(reader.int32());
                    break;

                case 11:
                    {
                        const arr = msg._groupedLocationIdArray;
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

                case 12:
                    {
                        const arr = msg._unfixedBuffArray;
                        arr.push($Message$CommonProto$Structure$TileBuff.decode(reader, reader.uint32()));
                    }
                    break;

                case 13:
                    msg.setCurrentHp(reader.int32());
                    break;

                case 14:
                    msg.setCurrentBuildPoint(reader.int32());
                    break;

                case 15:
                    msg.setCurrentCapturePoint(reader.int32());
                    break;

                case 16:
                    msg.setCustomCrystalData($Message$CommonProto$WarSerialization$TileCustomCrystalData.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setCustomCannonData($Message$CommonProto$WarSerialization$TileCustomCannonData.decode(reader, reader.uint32()));
                    break;

                case 18:
                    msg.setCustomLaserTurretData($Message$CommonProto$WarSerialization$TileCustomLaserTurretData.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setCustomBuildingData($Message$CommonProto$WarSerialization$TileCustomBuildingData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialTile {
        return SerialTile.decode(this.encode());
    }

    public override getSchemaName(): "SerialTile" {
        return "SerialTile";
    }

    public checkHasBaseType(): boolean {
        return this._baseType != null;
    }
    public getBaseType(): number {
        return this._baseType ?? 0;
    }
    public setBaseType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._baseType = null;
        } else {
            this._baseType = value;
        }
    }

    public checkHasObjectType(): boolean {
        return this._objectType != null;
    }
    public getObjectType(): number {
        return this._objectType ?? 0;
    }
    public setObjectType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._objectType = null;
        } else {
            this._objectType = value;
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

    public checkHasDecorationType(): boolean {
        return this._decorationType != null;
    }
    public getDecorationType(): number {
        return this._decorationType ?? 0;
    }
    public setDecorationType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._decorationType = null;
        } else {
            this._decorationType = value;
        }
    }

    public checkHasBaseShapeId(): boolean {
        return this._baseShapeId != null;
    }
    public getBaseShapeId(): number {
        return this._baseShapeId ?? 0;
    }
    public setBaseShapeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._baseShapeId = null;
        } else {
            this._baseShapeId = value;
        }
    }

    public checkHasObjectShapeId(): boolean {
        return this._objectShapeId != null;
    }
    public getObjectShapeId(): number {
        return this._objectShapeId ?? 0;
    }
    public setObjectShapeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._objectShapeId = null;
        } else {
            this._objectShapeId = value;
        }
    }

    public checkHasDecorationShapeId(): boolean {
        return this._decorationShapeId != null;
    }
    public getDecorationShapeId(): number {
        return this._decorationShapeId ?? 0;
    }
    public setDecorationShapeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._decorationShapeId = null;
        } else {
            this._decorationShapeId = value;
        }
    }

    public checkHasIsHighlighted(): boolean {
        return this._isHighlighted != null;
    }
    public getIsHighlighted(): boolean {
        return this._isHighlighted ?? false;
    }
    public setIsHighlighted(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isHighlighted = null;
        } else {
            this._isHighlighted = value;
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

    public getGroupedLocationIdArray(): number[] {
        return this._groupedLocationIdArray;
    }
    public setGroupedLocationIdArray(value: number[]): void {
        this._groupedLocationIdArray = value;
    }

    public getUnfixedBuffArray(): $Message$CommonProto$Structure$TileBuff[] {
        return this._unfixedBuffArray;
    }
    public setUnfixedBuffArray(value: $Message$CommonProto$Structure$TileBuff[]): void {
        this._unfixedBuffArray = value;
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

    public checkHasCurrentBuildPoint(): boolean {
        return this._currentBuildPoint != null;
    }
    public getCurrentBuildPoint(): number {
        return this._currentBuildPoint ?? 0;
    }
    public setCurrentBuildPoint(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentBuildPoint = null;
        } else {
            this._currentBuildPoint = value;
        }
    }

    public checkHasCurrentCapturePoint(): boolean {
        return this._currentCapturePoint != null;
    }
    public getCurrentCapturePoint(): number {
        return this._currentCapturePoint ?? 0;
    }
    public setCurrentCapturePoint(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentCapturePoint = null;
        } else {
            this._currentCapturePoint = value;
        }
    }

    public checkHasCustomCrystalData(): boolean {
        return this._customCrystalData != null;
    }
    public getCustomCrystalData(): $Message$CommonProto$WarSerialization$TileCustomCrystalData | null | undefined {
        return this._customCrystalData;
    }
    public setCustomCrystalData(value: $Message$CommonProto$WarSerialization$TileCustomCrystalData | null | undefined): void {
        this._customCrystalData = value;
    }
    public createIfNotExistsCustomCrystalData(): $Message$CommonProto$WarSerialization$TileCustomCrystalData {
        return this._customCrystalData ??= new $Message$CommonProto$WarSerialization$TileCustomCrystalData();
    }

    public checkHasCustomCannonData(): boolean {
        return this._customCannonData != null;
    }
    public getCustomCannonData(): $Message$CommonProto$WarSerialization$TileCustomCannonData | null | undefined {
        return this._customCannonData;
    }
    public setCustomCannonData(value: $Message$CommonProto$WarSerialization$TileCustomCannonData | null | undefined): void {
        this._customCannonData = value;
    }
    public createIfNotExistsCustomCannonData(): $Message$CommonProto$WarSerialization$TileCustomCannonData {
        return this._customCannonData ??= new $Message$CommonProto$WarSerialization$TileCustomCannonData();
    }

    public checkHasCustomLaserTurretData(): boolean {
        return this._customLaserTurretData != null;
    }
    public getCustomLaserTurretData(): $Message$CommonProto$WarSerialization$TileCustomLaserTurretData | null | undefined {
        return this._customLaserTurretData;
    }
    public setCustomLaserTurretData(value: $Message$CommonProto$WarSerialization$TileCustomLaserTurretData | null | undefined): void {
        this._customLaserTurretData = value;
    }
    public createIfNotExistsCustomLaserTurretData(): $Message$CommonProto$WarSerialization$TileCustomLaserTurretData {
        return this._customLaserTurretData ??= new $Message$CommonProto$WarSerialization$TileCustomLaserTurretData();
    }

    public checkHasCustomBuildingData(): boolean {
        return this._customBuildingData != null;
    }
    public getCustomBuildingData(): $Message$CommonProto$WarSerialization$TileCustomBuildingData | null | undefined {
        return this._customBuildingData;
    }
    public setCustomBuildingData(value: $Message$CommonProto$WarSerialization$TileCustomBuildingData | null | undefined): void {
        this._customBuildingData = value;
    }
    public createIfNotExistsCustomBuildingData(): $Message$CommonProto$WarSerialization$TileCustomBuildingData {
        return this._customBuildingData ??= new $Message$CommonProto$WarSerialization$TileCustomBuildingData();
    }
}
