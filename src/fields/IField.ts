import type * as ActionPlannersIActionPlanner from "../actionPlanners/IActionPlanner.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwCursor from "../baseWar/interface/IBwCursor.ts";
import type * as BaseWarInterfaceIBwGridVisualEffect from "../baseWar/interface/IBwGridVisualEffect.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as FieldsIFieldView from "./IFieldView.ts";
import type * as FogMapsIFogMap from "../fogMaps/IFogMap.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialField from "../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import type * as TilesITileMap from "../tiles/ITileMap.ts";
import type * as UnitsIUnitMap from "../units/IUnitMap.ts";

type SerialField            = ProtoSchemaCommonProtoWarSerializationSerialField.SerialField;
type GcData                 = GameConfigGcData.GcData;
type IBwTileMap             = TilesITileMap.ITileMap;
type IBwUnitMap             = UnitsIUnitMap.IUnitMap;
type IBwCursor              = BaseWarInterfaceIBwCursor.IBwCursor;
type IBwGridVisualEffect    = BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export interface IField {
    getFogMap(): FogMapsIFogMap.IFogMap;
    getTileMap(): IBwTileMap;
    getUnitMap(): IBwUnitMap;
    getActionPlanner(): ActionPlannersIActionPlanner.IActionPlanner;

    init({ data, gameConfig, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialField>;
        gameConfig              : GcData;
        playersCountUnneutral   : number;
    }): void;
    fastInit({ data, gameConfig, playersCountUnneutral }: {
        data                    : SerialField;
        gameConfig              : GcData;
        playersCountUnneutral   : number;
    }): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    serialize(): SerialField;
    serializeForCreateSfw(): SerialField;
    serializeForCreateMfr(): SerialField;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): FieldsIFieldView.IFieldView;

    getCursor(): IBwCursor;

    getGridVisualEffect(): IBwGridVisualEffect;

    getMaxPlayerIndex(): number;
}
