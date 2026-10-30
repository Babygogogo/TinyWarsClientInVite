import {
    Common_View_CommonMapView,
    Ui_Components_UiContainer,
    Ui_Types_UiHorizontalAlign,
    Ui_Types_UiVerticalAlign,
    Ui_Components_UiZoomableComponent,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiZoomableMap,
    type Helpers_PointerInput,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export class UiZoomableMap extends Ui_Components_UiContainer.UiContainer implements Ui_Interfaces_IUiZoomableMap.IUiZoomableMap {
    private readonly _mapView           = new Common_View_CommonMapView.CommonMapView();
    private readonly _zoomableComponent = new Ui_Components_UiZoomableComponent.UiZoomableComponent();

    public constructor() {
        super();

        const zoom = this._zoomableComponent;
        zoom.checkAndInitSizerInfo().setSizerOptions({
            width           : { percentage : 100 },
            height          : { percentage : 100 },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
        });
        zoom.addContent(this._mapView);
        this.addUiChild(zoom);
    }

    public showMapByMapData({ mapRawData, gameConfig, overridingPlayers }: {
        mapRawData          : MapRawData;
        gameConfig          : GameConfigs_GameConfig.GameConfig;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    }): void {
        const mapView = this._mapView;
        mapView.showMapByMapData({ mapRawData, gameConfig, overridingPlayers });

        const zoom = this._zoomableComponent;
        zoom.setContentSize(mapView.getScaledWidth(), mapView.getScaledHeight());
        zoom.setContentScale(0, true);
    }
    public async showMapByWarData({ warData, overridingPlayers, showInitialWarData }: {
        warData             : SerialWar;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
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

    public setContentCursor(style: Helpers_PointerInput.MouseStyleType): void {
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
