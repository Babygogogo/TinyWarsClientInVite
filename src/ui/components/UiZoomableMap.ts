import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CommonMapView } from "../../common/view/CommonMapView.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import type { MouseStyleType } from "../../helpers/PointerInput.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { UiContainer } from "./UiContainer.ts";
import type { IUiZoomableMap } from "../interfaces/IUiZoomableMap.ts";
import { UiHorizontalAlign } from "../types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../types/UiVerticalAlign.ts";
import { getUiZoomableComponentClass } from "../utils/UiFactory.ts";

export class UiZoomableMap extends UiContainer implements IUiZoomableMap {
    private readonly _mapView           = new CommonMapView();
    private readonly _zoomableComponent = new (getUiZoomableComponentClass())();

    public constructor() {
        super();

        const zoom = this._zoomableComponent;
        zoom.checkAndInitSizerInfo().setSizerOptions({
            width           : { percentage: 100 },
            height          : { percentage: 100 },
            horizontalAlign : { align: UiHorizontalAlign.Center },
            verticalAlign   : { align: UiVerticalAlign.Middle },
        });
        zoom.addContent(this._mapView);
        this.addUiChild(zoom);
    }

    public showMapByMapData({ mapRawData, gameConfig, overridingPlayers }: {
        mapRawData          : MapRawData;
        gameConfig          : GameConfig;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
    }): void {
        const mapView = this._mapView;
        mapView.showMapByMapData({ mapRawData, gameConfig, overridingPlayers });

        const zoom = this._zoomableComponent;
        zoom.setContentSize(mapView.getScaledWidth(), mapView.getScaledHeight());
        zoom.setContentScale(0, true);
    }
    public async showMapByWarData({ warData, overridingPlayers, showInitialWarData }: {
        warData             : SerialWar;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
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

    public setContentCursor(style: MouseStyleType): void {
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
