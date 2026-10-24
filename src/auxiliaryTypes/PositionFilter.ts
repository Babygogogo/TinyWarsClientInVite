import type * as AuxiliaryTypesAuxiliaryTypes from "./AuxiliaryTypes.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndex from "../proto/schema/CommonProto/Structure/GridIndex.ts";
import type * as ProtoSchemaCommonProtoStructureValueAndComparator from "../proto/schema/CommonProto/Structure/ValueAndComparator.ts";

export class PositionFilter {
    private _conLocationIdArray         : number[] = [];
    private _conGridIndexArray          : ProtoSchemaCommonProtoStructureGridIndex.GridIndex[] = [];
    private _conGridIndexMinDistance?   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator>;
    private _conLocationMinDistance?    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator>;
    private _conGridXArray              : number[] = [];
    private _conGridYArray              : number[] = [];

    public clone(): PositionFilter {
        const filter = new PositionFilter();
        filter._conLocationIdArray = this._conLocationIdArray?.concat();
        filter._conGridIndexArray = this._conGridIndexArray?.map(v => v.clone());
        filter._conGridIndexMinDistance = this._conGridIndexMinDistance?.clone();
        filter._conLocationMinDistance = this._conLocationMinDistance?.clone();
        filter._conGridXArray = this._conGridXArray?.concat();
        filter._conGridYArray = this._conGridYArray?.concat();
        return filter;
    }

    public getConLocationIdArray(): number[] {
        return this._conLocationIdArray;
    }
    public setConLocationIdArray(value: number[]): void {
        this._conLocationIdArray = value.concat();
    }

    public getConGridIndexArray(): ProtoSchemaCommonProtoStructureGridIndex.GridIndex[] {
        return this._conGridIndexArray;
    }
    public setConGridIndexArray(value: ProtoSchemaCommonProtoStructureGridIndex.GridIndex[]): void {
        this._conGridIndexArray = value.map(v => v.clone());
    }

    public getConGridIndexMinDistance(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator> {
        return this._conGridIndexMinDistance;
    }
    public setConGridIndexMinDistance(value: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator>): void {
        this._conGridIndexMinDistance = value?.clone();
    }

    public getConLocationMinDistance(): AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator> {
        return this._conLocationMinDistance;
    }
    public setConLocationMinDistance(value: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator>): void {
        this._conLocationMinDistance = value?.clone();
    }

    public getConGridXArray(): number[] {
        return this._conGridXArray;
    }
    public setConGridXArray(value: number[]): void {
        this._conGridXArray = value.concat();
    }

    public getConGridYArray(): number[] {
        return this._conGridYArray;
    }
    public setConGridYArray(value: number[]): void {
        this._conGridYArray = value.concat();
    }
}
