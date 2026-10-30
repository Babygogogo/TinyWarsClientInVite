import {
    GameVersions_Utils,
    GamePanels_Dict,
    Helpers_Text,
    Ui_Utils_UiSkinHelpers,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Graphics_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiMapInfo,
    type Ui_Interfaces_IUiOpenableComponent,
    type Ui_Interfaces_IUiZoomableMap,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export type OpenData = {
    warInfo?    : {
        warData             : SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    },
    mapInfo?    : {
        hasFog              : boolean | null;
        mapRawData          : MapRawData;
        gameConfig          : GameConfigs_GameConfig.GameConfig;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    },
} | null;
export class Page
    extends     Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData>
    implements  Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<OpenData>
{
    private readonly _uiMapInfo!    : Ui_Interfaces_IUiMapInfo.IUiMapInfo;
    private readonly _labelLoading! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoData!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupZoomMap! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _zoomMap!      : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;

    public constructor() {
        super();

        const resTypeId = GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId;
        Ui_Utils_UiSkinHelpers.loadSkinByPath(
            this,
            resTypeId === Graphics_Constants.TextureResolutionId.Dor
                ? `common/CommonWarMapInfoPage.exml`
                : `common/CommonWarMapInfoPage_res${Helpers_Text.getNumText(resTypeId)}.exml`
        );
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupZoomMap,               callback: this._onTouchedGroupZoomMap },
        ]);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
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
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                    mapInfo : mapInfo,
                });
                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                    warInfo : warInfo,
                });
                return;
            }
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(Lang_Constants.TextType.A0150);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
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
