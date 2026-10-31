import {
    type GameConfigs_GameConfig,
    type ActionPlanners_IActionPlanner,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwGridVisualEffect,
    type BaseWar_Interface_IBwWar,
    type Fields_IFieldView,
    type FogMaps_IFogMap,
    type Tiles_TileMap,
    type Units_UnitMap,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { SerialField } from "../proto/schema/CommonProto/WarSerialization/SerialField.ts";

export interface IField {
    getFogMap(): FogMaps_IFogMap.IFogMap;
    getTileMap(): Tiles_TileMap.TileMap;
    getUnitMap(): Units_UnitMap.UnitMap;
    getActionPlanner(): ActionPlanners_IActionPlanner.IActionPlanner;

    init({ data, gameConfig, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialField>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        playersCountUnneutral   : number;
    }): void;
    fastInit({ data, gameConfig, playersCountUnneutral }: {
        data                    : SerialField;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        playersCountUnneutral   : number;
    }): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    serialize(): SerialField;
    serializeForCreateSfw(): SerialField;
    serializeForCreateMfr(): SerialField;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): Fields_IFieldView.IFieldView;

    getCursor(): BaseWar_Interface_IBwCursor.IBwCursor;

    getGridVisualEffect(): BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect;

    getMaxPlayerIndex(): number;
}
