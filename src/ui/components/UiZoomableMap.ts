import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonViewCommonMapView from "../../common/view/CommonMapView.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as UiComponentsUiContainer from "./UiContainer.ts";
import type * as UiInterfacesIUiZoomableMap from "../interfaces/IUiZoomableMap.ts";
import * as UiTypesUiHorizontalAlign from "../types/UiHorizontalAlign.ts";
import * as UiTypesUiVerticalAlign from "../types/UiVerticalAlign.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";

export class UiZoomableMap extends UiComponentsUiContainer.UiContainer implements UiInterfacesIUiZoomableMap.IUiZoomableMap {
    private readonly _mapView           = new CommonViewCommonMapView.CommonMapView();
    private readonly _zoomableComponent = new (UiUtilsUiFactory.getUiZoomableComponentClass())();

    public constructor() {
        super();

        const zoom = this._zoomableComponent;
        zoom.checkAndInitSizerInfo().setSizerOptions({
            width           : { percentage: 100 },
            height          : { percentage: 100 },
            horizontalAlign : { align: UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            verticalAlign   : { align: UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
        });
        zoom.addContent(this._mapView);
        this.addUiChild(zoom);
    }

    public showMapByMapData({ mapRawData, gameConfig, overridingPlayers }: {
        mapRawData          : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
        gameConfig          : GameConfigGcData.GcData;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]>;
    }): void {
        const mapView = this._mapView;
        mapView.showMapByMapData({ mapRawData, gameConfig, overridingPlayers });

        const zoom = this._zoomableComponent;
        zoom.setContentSize(mapView.getScaledWidth(), mapView.getScaledHeight());
        zoom.setContentScale(0, true);
    }
    public async showMapByWarData({ warData, overridingPlayers, showInitialWarData }: {
        warData             : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]>;
        showInitialWarData  : boolean;
    }): Promise<void> {
        const mapView = this._mapView;
        await mapView.showMapByWarData({ warData, showInitialWarData, overridingPlayers });

        const zoom = this._zoomableComponent;
        zoom.setContentSize(mapView.getScaledWidth(), mapView.getScaledHeight());
        zoom.setContentScale(0, true);
    }

    public clearMap(): void {
        this._mapView.clear();
    }

    public setContentCursor(style: HelpersPointerInput.MouseStyleType): void {
        this._zoomableComponent.setMouseStyle(style);
    }
    public setMouseWheelListenerEnabled(enabled: boolean): void {
        this._zoomableComponent.setMouseWheelListenerEnabled(enabled);
    }
    public setTouchListenerEnabled(enabled: boolean): void {
        this._zoomableComponent.setTouchListenerEnabled(enabled);
    }
    public setBoundarySpacings(left = 0, right = 0, top = 0, bottom = 0): void {
        this._zoomableComponent.setBoundarySpacings(left, right, top, bottom);
    }
}
