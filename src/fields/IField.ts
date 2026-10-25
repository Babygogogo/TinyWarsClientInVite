import type { IActionPlanner } from "../actionPlanners/IActionPlanner.ts";
import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwCursor as BaseWarInterfaceIBwCursor } from "../baseWar/interface/IBwCursor.ts";
import type { IBwGridVisualEffect as BaseWarInterfaceIBwGridVisualEffect } from "../baseWar/interface/IBwGridVisualEffect.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../baseWar/interface/IBwWar.ts";
import type { IFieldView } from "./IFieldView.ts";
import type { IFogMap } from "../fogMaps/IFogMap.ts";
import type { GcData as GameConfigGcData } from "../gameConfig/GcData.ts";
import type {
    SerialField as ProtoSchemaCommonProtoWarSerializationSerialField,
} from "../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import type { ITileMap } from "../tiles/ITileMap.ts";
import type { IUnitMap } from "../units/IUnitMap.ts";

type SerialField            = ProtoSchemaCommonProtoWarSerializationSerialField;
type GcData                 = GameConfigGcData;
type IBwTileMap             = ITileMap;
type IBwUnitMap             = IUnitMap;
type IBwCursor              = BaseWarInterfaceIBwCursor;
type IBwGridVisualEffect    = BaseWarInterfaceIBwGridVisualEffect;
type IBwWar                 = BaseWarInterfaceIBwWar;

export interface IField {
    getFogMap(): IFogMap;
    getTileMap(): IBwTileMap;
    getUnitMap(): IBwUnitMap;
    getActionPlanner(): IActionPlanner;

    init({ data, gameConfig, playersCountUnneutral }: {
        data                    : Undefinable<SerialField>;
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
    getView(): IFieldView;

    getCursor(): IBwCursor;

    getGridVisualEffect(): IBwGridVisualEffect;

    getMaxPlayerIndex(): number;
}
