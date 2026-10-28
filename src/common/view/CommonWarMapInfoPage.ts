import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCurrentGameEssentialConfig } from "../../gameVersions/Utils.ts";
import { TextureResolutionId } from "../../graphics/Constants.ts";
import { getNumText } from "../../helpers/Text.ts";
import { TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiMapInfo } from "../../ui/interfaces/IUiMapInfo.ts";
import type { IUiOpenableComponent } from "../../ui/interfaces/IUiOpenableComponent.ts";
import type { IUiZoomableMap } from "../../ui/interfaces/IUiZoomableMap.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";

export type OpenData = {
    warInfo?    : {
        warData             : SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
    },
    mapInfo?    : {
        hasFog              : boolean | null;
        mapRawData          : MapRawData;
        gameConfig          : GameConfig;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
    },
} | null;
export class Page
    extends     UiOpenableComponent<OpenData>
    implements  IUiOpenableComponent<OpenData>
{
    private readonly _uiMapInfo!    : IUiMapInfo;
    private readonly _labelLoading! : IUiLabel;
    private readonly _labelNoData!  : IUiLabel;
    private readonly _groupZoomMap! : IUiContainer;
    private readonly _zoomMap!      : IUiZoomableMap;

    public constructor() {
        super();

        const resTypeId = getCurrentGameEssentialConfig().textureResolutionTypeId;
        loadSkinByPath(
            this,
            resTypeId === TextureResolutionId.Dor
                ? `common/CommonWarMapInfoPage.exml`
                : `common/CommonWarMapInfoPage_res${getNumText(resTypeId)}.exml`
        );
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupZoomMap,               callback: this._onTouchedGroupZoomMap },
        ]);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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
                playShortSfx(ShortSfxCode.ButtonNeutral01);
                openPanel(getDict().CommonShowMapPanel, {
                    mapInfo : mapInfo,
                });
                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                playShortSfx(ShortSfxCode.ButtonNeutral01);
                openPanel(getDict().CommonShowMapPanel, {
                    warInfo : warInfo,
                });
                return;
            }
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(TextType.A0150);
        this._labelNoData.setLangText(TextType.B0278);
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
