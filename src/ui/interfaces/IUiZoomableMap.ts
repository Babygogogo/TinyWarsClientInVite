import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as UiInterfacesIUiContainerBase from "./IUiContainerBase.ts";

export interface IUiZoomableMap extends UiInterfacesIUiContainerBase.IUiContainerBase {
    showMapByMapData({ mapRawData, gameConfig, overridingPlayers }: {
        mapRawData          : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
        gameConfig          : GameConfigGcData.GcData;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]>;
    }): void;
    showMapByWarData({ warData, overridingPlayers, showInitialWarData }: {
        warData             : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]>;
        showInitialWarData  : boolean;
    }): Promise<void>;

    clearMap(): void;

    setContentCursor(style: HelpersPointerInput.MouseStyleType): void;
    setMouseWheelListenerEnabled(enabled: boolean): void;
    setTouchListenerEnabled(enabled: boolean): void;
    setBoundarySpacings(left?: number, right?: number, top?: number, bottom?: number): void;
}
