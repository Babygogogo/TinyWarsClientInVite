import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as CampaignsMainsProvider from "../../campaigns/mains/Provider.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "./UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "./UiOpenableComponent.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiMapInfo from "../interfaces/IUiMapInfo.ts";
import type * as UiInterfacesIUiScrollList from "../interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";
import type * as UiTypesUiMapInfoData from "../types/UiMapInfoData.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersProxy from "../../users/Proxy.ts";

type GcData         = GameConfigGcData.GcData;

export class UiMapInfo extends UiComponentsUiOpenableComponent.UiOpenableComponent<UiTypesUiMapInfoData.UiMapInfoData> implements UiInterfacesIUiMapInfo.IUiMapInfo {
    // private readonly _groupTile!                : UiGroup;
    private readonly _listTile!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForTileRenderer>;

    private readonly _groupFog!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutFog!                : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFogTitle!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFog!                 : UiInterfacesIUiLabel.IUiLabel;

    // private readonly _groupMapInfo!             : UiGroup;
    private readonly _layoutInfo!               : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutName!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapName!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDesigner!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutMapId!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapIdTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapId!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupRating!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRatingTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutRating!             : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRating!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRaters!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMyRating!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutMyRating!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMyRatingTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRating!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSetMyRating!           : UiInterfacesIUiImage.IUiImage;

    private readonly _groupWarStatistics!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutPlayedTimes!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayedTimesTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayedTimes!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgWarStatistics!         : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutPlayersCount!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayersCountTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayersCount!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutMapSize!            : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapSizeTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapSize!             : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,          callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetMapRating,      callback: this._onNotifyMsgUserSetMapRating },
            { type: NotificationsTypeId.TypeId.MsgNormalMapGetBriefData, callback: this._onNotifyMsgNormalMapGetBriefData },
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
            const minValue = GameConfigGcMap.Constants.MinRating;
            const maxValue = GameConfigGcMap.Constants.MaxRating;
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => LangUtils.getText(LangConstants.TextType.B0363),
                currentValue    : UsersModel.getMapRating(normalMapId) || 0,
                minValue        : minValue,
                maxValue        : maxValue,
                getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0238),
                callback        : value => {
                    UsersProxy.reqUserSetMapRating(normalMapId, value);
                },
            });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupWarStatistics(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = getNormalMapId(openData);
        if (normalMapId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonMapWarStatisticsPanel, { normalMapId });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelPlayersCountTitle.setLangText(LangConstants.TextType.B0229);
        this._labelPlayedTimesTitle.setLangText(LangConstants.TextType.B0565);
        this._labelMapSizeTitle.setLangText(LangConstants.TextType.B0300);
        this._labelRatingTitle.setLangText(LangConstants.TextType.B0364);
        this._labelMapIdTitle.setLangText(LangConstants.TextType.B0821);
        this._labelMyRatingTitle.setLangText(LangConstants.TextType.B0363);
        this._labelFogTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0020)}:`);
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
            labelDesigner.setText(`${LangUtils.getText(LangConstants.TextType.B0163)}: --`);
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
                const mapRawData    = HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId));
                const rating        = await NormalMapModelNormalMapModel.getAverageRating(normalMapId);
                const myRating      = UsersModel.getMapRating(normalMapId);
                imgSetMyRating.setIsVisible(true);
                imgWarStatistics.setIsVisible(true);
                labelMapName.setText(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) || LangConstants.UndefinedError);
                labelMapId.setText(`${normalMapId}`);
                labelDesigner.setText(`${LangUtils.getText(LangConstants.TextType.B0163)}: ${mapRawData.getDesignerName() ?? LangConstants.UndefinedError}`);
                labelPlayersCount.setText(`${mapRawData.getPlayersCountUnneutral()}`);
                labelRating.setText(rating != null ? rating.toFixed(2) : LangUtils.getText(LangConstants.TextType.None));
                labelRaters.setText(`(${await NormalMapModelNormalMapModel.getTotalRatersCount(normalMapId)})`);
                labelMyRating.setText(myRating != null ? `${myRating}` : LangUtils.getText(LangConstants.TextType.None));
                labelPlayedTimes.setText(`${await NormalMapModelNormalMapModel.getTotalPlayedTimes(normalMapId)}`);
                labelMapSize.setText(`${mapRawData.getMapWidth()} x ${mapRawData.getMapHeight()}`);
                await listTile.bindData(generateDataForListTile(mapRawData.getTileDataArray(), await GameConfigGcModel.getLatestGameConfig()));

                this._arrangeLayouts();
                return;
            }
        }

        {
            const campaignMapData = openData.mapInfo?.mapRawData?.getCampaignMapData();
            if (campaignMapData) {
                const campaignId    = campaignMapData.getCampaignId() ?? 0;
                const campaignMapId = campaignMapData.getCampaignMapId() ?? 0;
                const mapRawData    = await CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId);
                if ((mapRawData == null)                                                            ||
                    (mapRawData?.getCampaignMapData()?.getRevision() ?? 0) !== (campaignMapData.getRevision() ?? 0)
                ) {
                    imgSetMyRating.setIsVisible(false);
                    imgWarStatistics.setIsVisible(false);
                    labelMapName.setText(`--`);
                    labelMapId.setText(`--`);
                    labelDesigner.setText(`${LangUtils.getText(LangConstants.TextType.B0163)}: --`);
                    labelPlayersCount.setText(`--`);
                    labelRating.setText(`--`);
                    labelRaters.setText(`(--)`);
                    labelPlayedTimes.setText(`--`);
                    labelMapSize.setText(`--`);
                    listTile.removeAllItems();
                } else {
                    imgSetMyRating.setIsVisible(false);
                    imgWarStatistics.setIsVisible(false);
                    labelMapName.setText(LangUtils.getLanguageText({ textArray: mapRawData.getMapNameArray() }) ?? LangConstants.UndefinedError);
                    labelMapId.setText(`${campaignId} - ${campaignMapId}`);
                    labelDesigner.setText(`${LangUtils.getText(LangConstants.TextType.B0163)}: ${mapRawData.getDesignerName() ?? LangConstants.UndefinedError}`);
                    labelPlayersCount.setText(`${mapRawData.getPlayersCountUnneutral()}`);
                    labelRating.setText(`--`);
                    labelRaters.setText(`(--)`);
                    labelPlayedTimes.setText(`--`);
                    labelMapSize.setText(`${mapRawData.getMapWidth()} x ${mapRawData.getMapHeight()}`);
                    await listTile.bindData(generateDataForListTile(mapRawData.getTileDataArray(), await GameConfigGcModel.getLatestGameConfig()));
                }

                this._arrangeLayouts();
                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                const warData       = warInfo.warData;
                const tileMapData   = HelpersMisc.getExisted(warData.getField()?.getTileMap());
                const mapSize       = AuxiliaryTypesMapSize.MapSize.createWithSerialTileMap(tileMapData);
                imgSetMyRating.setIsVisible(false);
                imgWarStatistics.setIsVisible(false);
                labelMapName.setText(`--`);
                labelMapId.setText(`--`);
                labelDesigner.setText(`${LangUtils.getText(LangConstants.TextType.B0163)}: --`);
                labelPlayersCount.setText(`${HelpersMisc.getExisted(warData.getPlayerManager()?.getPlayers()).length - 1}`);
                labelRating.setText(`--`);
                labelRaters.setText(`(--)`);
                labelPlayedTimes.setText(`--`);
                labelMapSize.setText(`${mapSize.getWidth()} x ${mapSize.getHeight()}`);
                await listTile.bindData(generateDataForListTile(tileMapData.getTiles(), await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion()))));

                this._arrangeLayouts();
                return;
            }
        }
    }

    private _updateLabelFog(): void {
        const hasFog    = getHasFog(this.getOpenData());
        const label     = this._labelFog;
        label.setLangText(hasFog ? LangConstants.TextType.Yes : LangConstants.TextType.No);
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

function generateDataForListTile(tileDataArray: ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile[], gameConfig: GcData): DataForTileRenderer[] {
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

function getNormalMapId(data: UiTypesUiMapInfoData.UiMapInfoData | null): number | null {
    const warData = data?.warInfo?.warData;
    return warData
        ? HelpersProtoSchemaWarSerializationSerialWar.getNormalMapId(warData)
        : (data?.mapInfo?.mapRawData.getNormalMapId() ?? null);
}
function getHasFog(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<UiTypesUiMapInfoData.UiMapInfoData>): boolean | null {
    const warData = data?.warInfo?.warData;
    return warData
        ? (!!warData.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault())
        : (data?.mapInfo?.hasFog ?? null);
}

interface DataForTileRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig      : GcData;
    tileType        : number;
    num             : number;
}
class TileRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
    // private readonly _group!        : UiGroup;
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelNum!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView      = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
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
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }

    public _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
}
