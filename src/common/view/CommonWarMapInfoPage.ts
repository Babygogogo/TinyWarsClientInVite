import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GameVersionsUtils from "../../gameVersions/Utils.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiMapInfo from "../../ui/interfaces/IUiMapInfo.ts";
import type * as UiInterfacesIUiOpenableComponent from "../../ui/interfaces/IUiOpenableComponent.ts";
import type * as UiInterfacesIUiZoomableMap from "../../ui/interfaces/IUiZoomableMap.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";

export type OpenData = {
    warInfo?    : {
        warData             : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]>;
    },
    mapInfo?    : {
        hasFog              : boolean | null;
        mapRawData          : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
        gameConfig          : GameConfigGcData.GcData;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer[]>;
    },
} | null;
export class Page
    extends     UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData>
    implements  UiInterfacesIUiOpenableComponent.IUiOpenableComponent<OpenData>
{
    private readonly _uiMapInfo!    : UiInterfacesIUiMapInfo.IUiMapInfo;
    private readonly _labelLoading! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoData!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupZoomMap! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _zoomMap!      : UiInterfacesIUiZoomableMap.IUiZoomableMap;

    public constructor() {
        super();

        const resTypeId = GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId;
        UiUtilsUiSkinHelpers.loadSkinByPath(
            this,
            resTypeId === GraphicsConstants.TextureResolutionId.Dor
                ? `common/CommonWarMapInfoPage.exml`
                : `common/CommonWarMapInfoPage_res${HelpersText.getNumText(resTypeId)}.exml`
        );
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupZoomMap,               callback: this._onTouchedGroupZoomMap },
        ]);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
        });

        this._updateComponentsForLanguage();
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._uiMapInfo.open();
    }
    protected override _doApplyOpenData(): void | Promise<void> {
        this._updateComponentsForRoomInfo();
    }
    protected async _onClosed(): Promise<void> {
        await this._uiMapInfo.close();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedGroupZoomMap(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        {
            const mapInfo = openData.mapInfo;
            if (mapInfo) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                    mapInfo : mapInfo,
                });
                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                    warInfo : warInfo,
                });
                return;
            }
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setText(LangUtils.getText(LangConstants.TextType.A0150));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }
    private async _updateComponentsForRoomInfo(): Promise<void> {
        const zoomMap       = this._zoomMap;
        const uiMapInfo     = this._uiMapInfo;
        const labelLoading  = this._labelLoading;
        const labelNoData   = this._labelNoData;
        const openData      = this.getOpenData();
        if (openData == null) {
            uiMapInfo.setIsVisible(false);
            zoomMap.setIsVisible(false);
            labelLoading.setIsVisible(false);
            labelNoData.setIsVisible(true);
            return;
        }

        uiMapInfo.setIsVisible(true);
        zoomMap.setIsVisible(true);
        labelLoading.setIsVisible(true);
        labelNoData.setIsVisible(false);

        {
            const mapInfo = openData.mapInfo;
            if (mapInfo) {
                uiMapInfo.setOpenData({
                    mapInfo     : mapInfo,
                });
                uiMapInfo.applyOpenData();
                zoomMap.showMapByMapData({
                    mapRawData          : mapInfo.mapRawData,
                    gameConfig          : mapInfo.gameConfig,
                    overridingPlayers   : mapInfo.overridingPlayers,
                });

                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                const warData = warInfo.warData;
                uiMapInfo.setOpenData({
                    warInfo : warInfo,
                });
                uiMapInfo.applyOpenData();
                await zoomMap.showMapByWarData({
                    warData             : warData,
                    showInitialWarData  : warInfo.showInitialWarData,
                    overridingPlayers   : warInfo.overridingPlayers,
                });

                return;
            }
        }

        labelLoading.setIsVisible(false);
        labelNoData.setIsVisible(true);

        uiMapInfo.setOpenData(undefined);
        zoomMap.clearMap();
    }
}
