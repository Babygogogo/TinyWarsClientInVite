import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { getCampaignMapRawData } from "../../campaigns/mains/Provider.ts";
import type { GcData as GameConfigGcData } from "../../gameConfig/GcData.ts";
import { Common } from "../../maps/Constants.ts";
import { getLatestGameConfig, getGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    getNormalMapId as HelpersProtoSchemaWarSerializationSerialWarGetNormalMapId,
} from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import {
    getRawData,
    getAverageRating,
    getMapNameInCurrentLanguage,
    getTotalRatersCount,
    getTotalPlayedTimes,
} from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "./UiListItemRenderer.ts";
import { UiOpenableComponent } from "./UiOpenableComponent.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { IUiLayout } from "../interfaces/IUiLayout.ts";
import type { IUiMapInfo } from "../interfaces/IUiMapInfo.ts";
import type { IUiScrollList } from "../interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";
import type { UiMapInfoData } from "../types/UiMapInfoData.ts";
import { getUiTileViewClass } from "../utils/UiFactory.ts";
import { getMapRating } from "../../users/Model.ts";
import { reqUserSetMapRating } from "../../users/Proxy.ts";

type GcData         = GameConfigGcData;

export class UiMapInfo extends UiOpenableComponent<UiMapInfoData> implements IUiMapInfo {
    // private readonly _groupTile!                : UiGroup;
    private readonly _listTile!                 : IUiScrollList<DataForTileRenderer>;

    private readonly _groupFog!                 : IUiContainer;
    private readonly _layoutFog!                : IUiLayout;
    private readonly _labelFogTitle!            : IUiLabel;
    private readonly _labelFog!                 : IUiLabel;

    // private readonly _groupMapInfo!             : UiGroup;
    private readonly _layoutInfo!               : IUiLayout;

    private readonly _layoutName!               : IUiLayout;
    private readonly _labelMapName!             : IUiLabel;
    private readonly _labelDesigner!            : IUiLabel;

    private readonly _layoutMapId!              : IUiLayout;
    private readonly _labelMapIdTitle!          : IUiLabel;
    private readonly _labelMapId!               : IUiLabel;

    private readonly _groupRating!              : IUiLayout;
    private readonly _labelRatingTitle!         : IUiLabel;
    private readonly _layoutRating!             : IUiLayout;
    private readonly _labelRating!              : IUiLabel;
    private readonly _labelRaters!              : IUiLabel;

    private readonly _groupMyRating!            : IUiContainer;
    private readonly _layoutMyRating!           : IUiLayout;
    private readonly _labelMyRatingTitle!       : IUiLabel;
    private readonly _labelMyRating!            : IUiLabel;
    private readonly _imgSetMyRating!           : IUiImage;

    private readonly _groupWarStatistics!       : IUiContainer;
    private readonly _layoutPlayedTimes!        : IUiLayout;
    private readonly _labelPlayedTimesTitle!    : IUiLabel;
    private readonly _labelPlayedTimes!         : IUiLabel;
    private readonly _imgWarStatistics!         : IUiImage;

    private readonly _layoutPlayersCount!       : IUiLayout;
    private readonly _labelPlayersCountTitle!   : IUiLabel;
    private readonly _labelPlayersCount!        : IUiLabel;
    private readonly _layoutMapSize!            : IUiLayout;
    private readonly _labelMapSizeTitle!        : IUiLabel;
    private readonly _labelMapSize!             : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,          callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserSetMapRating,      callback: this._onNotifyMsgUserSetMapRating },
            { type: TypeId.MsgNormalMapGetBriefData, callback: this._onNotifyMsgNormalMapGetBriefData },
        ]);
        this._setUiListenerArray([
            { ui: this._groupMyRating,              callback: this._onTouchedGroupMyRating },
            { ui: this._groupWarStatistics,         callback: this._onTouchedGroupWarStatistics },
        ]);
        this._listTile.setItemRendererClass(TileRenderer);

        this._updateComponentsForLanguage();
        this._updateComponentsForMapInfo();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listTile.removeAllItems();

        await super._onClosed();
    }

    protected override _doApplyOpenData(): Promise<void> | void {
        this._updateComponentsForMapInfo();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserSetMapRating(): void {
        this._updateComponentsForMapInfo();
    }
    private _onNotifyMsgNormalMapGetBriefData(): void {
        this._updateComponentsForMapInfo();
    }
    private _onTouchedGroupMyRating(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = getNormalMapId(openData);
        if (normalMapId != null) {
            const minValue = Common.MinRating;
            const maxValue = Common.MaxRating;
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle           : () => getText(TextType.B0363),
                currentValue    : getMapRating(normalMapId) || 0,
                minValue        : minValue,
                maxValue        : maxValue,
                getHelpText     : () => getText(TextType.A0238),
                callback        : value => {
                    reqUserSetMapRating(normalMapId, value);
                },
            });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupWarStatistics(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = getNormalMapId(openData);
        if (normalMapId != null) {
            openPanel(getDict().CommonMapWarStatisticsPanel, { normalMapId });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelPlayersCountTitle.setLangText(TextType.B0229);
        this._labelPlayedTimesTitle.setLangText(TextType.B0565);
        this._labelMapSizeTitle.setLangText(TextType.B0300);
        this._labelRatingTitle.setLangText(TextType.B0364);
        this._labelMapIdTitle.setLangText(TextType.B0821);
        this._labelMyRatingTitle.setLangText(TextType.B0363);
        this._labelFogTitle.setText(`${getText(TextType.B0020)}:`);
        this._updateLabelFog();
    }

    private async _updateComponentsForMapInfo(): Promise<void> {
        const openData          = this.getOpenData();
        const labelMapName      = this._labelMapName;
        const labelMapId        = this._labelMapId;
        const labelDesigner     = this._labelDesigner;
        const labelPlayersCount = this._labelPlayersCount;
        const labelRating       = this._labelRating;
        const labelRaters       = this._labelRaters;
        const labelMyRating     = this._labelMyRating;
        const labelPlayedTimes  = this._labelPlayedTimes;
        const labelMapSize      = this._labelMapSize;
        const imgSetMyRating    = this._imgSetMyRating;
        const imgWarStatistics  = this._imgWarStatistics;
        const groupFog          = this._groupFog;
        const listTile          = this._listTile;

        if (openData == null) {
            labelMapName.setText(`--`);
            labelMapId.setText(`--`);
            labelDesigner.setText(`${getText(TextType.B0163)}: --`);
            labelPlayersCount.setText(`--`);
            labelRating.setText(`--`);
            labelRaters.setText(`(--)`);
            labelMyRating.setText(`--`);
            labelPlayedTimes.setText(`--`);
            labelMapSize.setText(`--`);
            imgSetMyRating.setIsVisible(false);
            imgWarStatistics.setIsVisible(false);
            groupFog.setIsVisible(false);

            this._arrangeLayouts();
            return;
        }

        {
            const hasFog = getHasFog(openData);
            if (hasFog == null) {
                groupFog.setIsVisible(false);
            } else {
                groupFog.setIsVisible(true);
                this._updateLabelFog();
            }
        }

        {
            const normalMapId = getNormalMapId(openData);
            if (normalMapId != null) {
                const mapRawData    = getExisted(await getRawData(normalMapId));
                const rating        = await getAverageRating(normalMapId);
                const myRating      = getMapRating(normalMapId);
                imgSetMyRating.setIsVisible(true);
                imgWarStatistics.setIsVisible(true);
                labelMapName.setText(await getMapNameInCurrentLanguage(normalMapId) || UndefinedError);
                labelMapId.setText(`${normalMapId}`);
                labelDesigner.setText(`${getText(TextType.B0163)}: ${mapRawData.getDesignerName() ?? UndefinedError}`);
                labelPlayersCount.setText(`${mapRawData.getPlayersCountUnneutral()}`);
                labelRating.setText(rating != null ? rating.toFixed(2) : getText(TextType.None));
                labelRaters.setText(`(${await getTotalRatersCount(normalMapId)})`);
                labelMyRating.setText(myRating != null ? `${myRating}` : getText(TextType.None));
                labelPlayedTimes.setText(`${await getTotalPlayedTimes(normalMapId)}`);
                labelMapSize.setText(`${mapRawData.getMapWidth()} x ${mapRawData.getMapHeight()}`);
                await listTile.bindData(generateDataForListTile(mapRawData.getTileDataArray(), await getLatestGameConfig()));

                this._arrangeLayouts();
                return;
            }
        }

        {
            const campaignMapData = openData.mapInfo?.mapRawData?.getCampaignMapData();
            if (campaignMapData) {
                const campaignId    = campaignMapData.getCampaignId() ?? 0;
                const campaignMapId = campaignMapData.getCampaignMapId() ?? 0;
                const mapRawData    = await getCampaignMapRawData(campaignId, campaignMapId);
                if ((mapRawData == null)                                                            ||
                    (mapRawData?.getCampaignMapData()?.getRevision() ?? 0) !== (campaignMapData.getRevision() ?? 0)
                ) {
                    imgSetMyRating.setIsVisible(false);
                    imgWarStatistics.setIsVisible(false);
                    labelMapName.setText(`--`);
                    labelMapId.setText(`--`);
                    labelDesigner.setText(`${getText(TextType.B0163)}: --`);
                    labelPlayersCount.setText(`--`);
                    labelRating.setText(`--`);
                    labelRaters.setText(`(--)`);
                    labelPlayedTimes.setText(`--`);
                    labelMapSize.setText(`--`);
                    listTile.removeAllItems();
                } else {
                    imgSetMyRating.setIsVisible(false);
                    imgWarStatistics.setIsVisible(false);
                    labelMapName.setText(getLanguageText({ textArray: mapRawData.getMapNameArray() }) ?? UndefinedError);
                    labelMapId.setText(`${campaignId} - ${campaignMapId}`);
                    labelDesigner.setText(`${getText(TextType.B0163)}: ${mapRawData.getDesignerName() ?? UndefinedError}`);
                    labelPlayersCount.setText(`${mapRawData.getPlayersCountUnneutral()}`);
                    labelRating.setText(`--`);
                    labelRaters.setText(`(--)`);
                    labelPlayedTimes.setText(`--`);
                    labelMapSize.setText(`${mapRawData.getMapWidth()} x ${mapRawData.getMapHeight()}`);
                    await listTile.bindData(generateDataForListTile(mapRawData.getTileDataArray(), await getLatestGameConfig()));
                }

                this._arrangeLayouts();
                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                const warData       = warInfo.warData;
                const tileMapData   = getExisted(warData.getField()?.getTileMap());
                const mapSize       = MapSize.createWithSerialTileMap(tileMapData);
                imgSetMyRating.setIsVisible(false);
                imgWarStatistics.setIsVisible(false);
                labelMapName.setText(`--`);
                labelMapId.setText(`--`);
                labelDesigner.setText(`${getText(TextType.B0163)}: --`);
                labelPlayersCount.setText(`${getExisted(warData.getPlayerManager()?.getPlayers()).length - 1}`);
                labelRating.setText(`--`);
                labelRaters.setText(`(--)`);
                labelPlayedTimes.setText(`--`);
                labelMapSize.setText(`${mapSize.getWidth()} x ${mapSize.getHeight()}`);
                await listTile.bindData(generateDataForListTile(tileMapData.getTiles(), await getGameConfig(getExisted(warData.getSettingsForCommon()?.getConfigVersion()))));

                this._arrangeLayouts();
                return;
            }
        }
    }

    private _updateLabelFog(): void {
        const hasFog    = getHasFog(this.getOpenData());
        const label     = this._labelFog;
        label.setLangText(hasFog ? TextType.Yes : TextType.No);
        label.setTextColor(hasFog ? 0xFFFF00 : 0xFFFFFF);

        this._layoutFog.arrangeItems();
    }

    private _arrangeLayouts(): void {
        this._layoutName.arrangeItems();
        this._layoutMapId.arrangeItems();
        this._layoutRating.arrangeItems();
        this._groupRating.arrangeItems();
        this._layoutMyRating.arrangeItems();
        this._layoutPlayedTimes.arrangeItems();
        this._layoutPlayersCount.arrangeItems();
        this._layoutMapSize.arrangeItems();
        this._layoutInfo.arrangeItems();
    }
}

function generateDataForListTile(tileDataArray: SerialTile[], gameConfig: GcData): DataForTileRenderer[] {
    const tileCountDict = new Map<number, number>();
    for (const tile of tileDataArray || []) {
        const tileType = gameConfig.getTileType(tile.getBaseType() ?? 0, tile.getObjectType() ?? 0);
        if (tileType != null) {
            tileCountDict.set(tileType, (tileCountDict.get(tileType) || 0) + 1);
        }
    }

    const dataArray: DataForTileRenderer[] = [];
    for (const tileType of gameConfig.getTileTypeArrayForMapInfo()) {
        dataArray.push({
            tileType,
            num     : tileCountDict.get(tileType) || 0,
            gameConfig,
        });
    }
    return dataArray;
}

function getNormalMapId(data: UiMapInfoData | null): number | null {
    const warData = data?.warInfo?.warData;
    return warData
        ? HelpersProtoSchemaWarSerializationSerialWarGetNormalMapId(warData)
        : (data?.mapInfo?.mapRawData.getNormalMapId() ?? null);
}
function getHasFog(data: Undefinable<UiMapInfoData>): boolean | null {
    const warData = data?.warInfo?.warData;
    return warData
        ? (!!warData.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault())
        : (data?.mapInfo?.hasFog ?? null);
}

interface DataForTileRenderer extends UiListItemData {
    gameConfig      : GcData;
    tileType        : number;
    num             : number;
}
class TileRenderer extends UiListItemRenderer<DataForTileRenderer> {
    // private readonly _group!        : UiGroup;
    private readonly _conTileView!  : IUiContainer;
    private readonly _labelNum!     : IUiLabel;

    private readonly _tileView      = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
        ]);

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        tileView.startRunningView();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelNum.setText(`x${openData.num}`);

        const gameConfig        = openData.gameConfig;
        const tileObjectType    = gameConfig.getTileObjectTypeByTileType(openData.tileType);
        const tileView          = this._tileView;
        tileView.init({
            tileBaseType            : null,
            tileBaseShapeId         : null,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : tileObjectType,
            tileObjectShapeId       : 0,
            skinId                  : PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }

    public _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
}
