import {
    Maps_Constants,
    NormalMap_Model_NormalMapModel,
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Helpers_Misc,
    GameConfigs_Provider,
    Lang_Utils,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    AuxiliaryTypes_MapSize,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Components_UiTileView,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiMapInfo,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type Ui_Types_UiMapInfoData,
    type AuxiliaryTypes_AuxiliaryTypes,
    Users_Model,
    Users_Proxy,
} from "../../internal.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

export class UiMapInfo extends Ui_Components_UiOpenableComponent.UiOpenableComponent<Ui_Types_UiMapInfoData.UiMapInfoData> implements Ui_Interfaces_IUiMapInfo.IUiMapInfo {
    // private readonly _groupTile!                : UiGroup;
    private readonly _listTile!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileRenderer>;

    private readonly _groupFog!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutFog!                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelFogTitle!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFog!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    // private readonly _groupMapInfo!             : UiGroup;
    private readonly _layoutInfo!               : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _layoutName!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapName!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDesigner!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutMapId!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapIdTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapId!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRating!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRatingTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutRating!             : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRating!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRaters!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMyRating!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutMyRating!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMyRatingTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRating!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSetMyRating!           : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupWarStatistics!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutPlayedTimes!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayedTimesTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayedTimes!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgWarStatistics!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutPlayersCount!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayersCountTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayersCount!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutMapSize!            : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapSizeTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapSize!             : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,          callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgUserSetMapRating,      callback: this._onNotifyMsgUserSetMapRating },
            { type: Notifications_TypeId.TypeId.MsgNormalMapGetBriefData, callback: this._onNotifyMsgNormalMapGetBriefData },
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
            const minValue = Maps_Constants.Common.MinRating;
            const maxValue = Maps_Constants.Common.MaxRating;
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B0363),
                currentValue    : Users_Model.getMapRating(normalMapId) || 0,
                minValue        : minValue,
                maxValue        : maxValue,
                getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0238),
                callback        : value => {
                    Users_Proxy.reqUserSetMapRating(normalMapId, value);
                },
            });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }
    private _onTouchedGroupWarStatistics(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = getNormalMapId(openData);
        if (normalMapId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonMapWarStatisticsPanel, { normalMapId });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelPlayersCountTitle.setLangText(Lang_Constants.TextType.B0229);
        this._labelPlayedTimesTitle.setLangText(Lang_Constants.TextType.B0565);
        this._labelMapSizeTitle.setLangText(Lang_Constants.TextType.B0300);
        this._labelRatingTitle.setLangText(Lang_Constants.TextType.B0364);
        this._labelMapIdTitle.setLangText(Lang_Constants.TextType.B0821);
        this._labelMyRatingTitle.setLangText(Lang_Constants.TextType.B0363);
        this._labelFogTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0020)}:`);
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
            labelDesigner.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0163)}: --`);
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
                const mapRawData    = Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId));
                const rating        = await NormalMap_Model_NormalMapModel.getAverageRating(normalMapId);
                const myRating      = Users_Model.getMapRating(normalMapId);
                imgSetMyRating.setIsVisible(true);
                imgWarStatistics.setIsVisible(true);
                labelMapName.setText(await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) || Lang_Constants.UndefinedError);
                labelMapId.setText(`${normalMapId}`);
                labelDesigner.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0163)}: ${mapRawData.getDesignerName() ?? Lang_Constants.UndefinedError}`);
                labelPlayersCount.setText(`${mapRawData.getPlayersCountUnneutral()}`);
                labelRating.setText(rating != null ? rating.toFixed(2) : Lang_Utils.getText(Lang_Constants.TextType.None));
                labelRaters.setText(`(${await NormalMap_Model_NormalMapModel.getTotalRatersCount(normalMapId)})`);
                labelMyRating.setText(myRating != null ? `${myRating}` : Lang_Utils.getText(Lang_Constants.TextType.None));
                labelPlayedTimes.setText(`${await NormalMap_Model_NormalMapModel.getTotalPlayedTimes(normalMapId)}`);
                labelMapSize.setText(`${mapRawData.getMapWidth()} x ${mapRawData.getMapHeight()}`);
                await listTile.bindData(generateDataForListTile(mapRawData.getTileDataArray(), await GameConfigs_Provider.getLatestGameConfig()));

                this._arrangeLayouts();
                return;
            }
        }

        {
            const campaignMapData = openData.mapInfo?.mapRawData?.getCampaignMapData();
            if (campaignMapData) {
                const campaignId    = campaignMapData.getCampaignId();
                const campaignMapId = campaignMapData.getCampaignMapId();
                const mapRawData    = await Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId);
                if ((mapRawData == null)                                                            ||
                    (mapRawData?.getCampaignMapData()?.getRevision() ?? 0) !== (campaignMapData.getRevision())
                ) {
                    imgSetMyRating.setIsVisible(false);
                    imgWarStatistics.setIsVisible(false);
                    labelMapName.setText(`--`);
                    labelMapId.setText(`--`);
                    labelDesigner.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0163)}: --`);
                    labelPlayersCount.setText(`--`);
                    labelRating.setText(`--`);
                    labelRaters.setText(`(--)`);
                    labelPlayedTimes.setText(`--`);
                    labelMapSize.setText(`--`);
                    listTile.removeAllItems();
                } else {
                    imgSetMyRating.setIsVisible(false);
                    imgWarStatistics.setIsVisible(false);
                    labelMapName.setText(Lang_Utils.getLanguageText({ textArray: mapRawData.getMapNameArray() }) ?? Lang_Constants.UndefinedError);
                    labelMapId.setText(`${campaignId} - ${campaignMapId}`);
                    labelDesigner.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0163)}: ${mapRawData.getDesignerName() ?? Lang_Constants.UndefinedError}`);
                    labelPlayersCount.setText(`${mapRawData.getPlayersCountUnneutral()}`);
                    labelRating.setText(`--`);
                    labelRaters.setText(`(--)`);
                    labelPlayedTimes.setText(`--`);
                    labelMapSize.setText(`${mapRawData.getMapWidth()} x ${mapRawData.getMapHeight()}`);
                    await listTile.bindData(generateDataForListTile(mapRawData.getTileDataArray(), await GameConfigs_Provider.getLatestGameConfig()));
                }

                this._arrangeLayouts();
                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                const warData       = warInfo.warData;
                const tileMapData   = Helpers_Misc.getExisted(warData.getField()?.getTileMap());
                const mapSize       = AuxiliaryTypes_MapSize.MapSize.createWithSerialTileMap(tileMapData);
                imgSetMyRating.setIsVisible(false);
                imgWarStatistics.setIsVisible(false);
                labelMapName.setText(`--`);
                labelMapId.setText(`--`);
                labelDesigner.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0163)}: --`);
                labelPlayersCount.setText(`${Helpers_Misc.getExisted(warData.getPlayerManager()?.getPlayers()).length - 1}`);
                labelRating.setText(`--`);
                labelRaters.setText(`(--)`);
                labelPlayedTimes.setText(`--`);
                labelMapSize.setText(`${mapSize.getWidth()} x ${mapSize.getHeight()}`);
                await listTile.bindData(generateDataForListTile(tileMapData.getTiles(), await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warData.getSettingsForCommon()?.getConfigVersion()))));

                this._arrangeLayouts();
                return;
            }
        }
    }

    private _updateLabelFog(): void {
        const hasFog    = getHasFog(this.getOpenData());
        const label     = this._labelFog;
        label.setLangText(hasFog ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
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

function generateDataForListTile(tileDataArray: SerialTile[], gameConfig: GameConfigs_GameConfig.GameConfig): DataForTileRenderer[] {
    const tileCountDict = new Map<number, number>();
    for (const tile of tileDataArray || []) {
        const tileType = gameConfig.getTileType(tile.getBaseType(), tile.getObjectType());
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

function getNormalMapId(data: Ui_Types_UiMapInfoData.UiMapInfoData | null): number | null {
    const warData = data?.warInfo?.warData;
    return warData
        ? Helpers_ProtoSchema_WarSerialization_SerialWar.getNormalMapId(warData)
        : (data?.mapInfo?.mapRawData.getNormalMapId() ?? null);
}
function getHasFog(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<Ui_Types_UiMapInfoData.UiMapInfoData>): boolean | null {
    const warData = data?.warInfo?.warData;
    return warData
        ? (!!warData.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault())
        : (data?.mapInfo?.hasFog ?? null);
}

interface DataForTileRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    tileType        : number;
    num             : number;
}
class TileRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
    // private readonly _group!        : UiGroup;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelNum!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView      = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
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
            skinId                  : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }

    public _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
}
