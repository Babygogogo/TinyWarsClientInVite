import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TilesUtilsSerialization from "../../tiles/utils/Serialization.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarRulesUtilsTemplate from "../../warRules/utils/Template.ts";

export function convertAwbwMap(text: string, gcData: GameConfigGcData.GcData): ProtoSchemaCommonProtoMapMapRawData.MapRawData | undefined {
    const awbwIdMap = text.trim().split(`\n`).map(line => line.split(`,`)).map(line => line.map(cell => parseInt(cell)));
    const mapHeight = awbwIdMap.length;
    if (mapHeight <= 0) {
        return undefined;
    }

    const mapWidth = awbwIdMap[0].length;
    if ((mapWidth <= 0) ||
        (mapWidth * mapHeight > GameConfigGcMap.Constants.MaxGridsCount)
    ) {
        return undefined;
    }

    for (let i = 1; i < mapHeight; ++i) {
        if (awbwIdMap[i].length !== mapWidth) {
            return undefined;
        }
    }

    const unneutralPlayerIndexSet = new Set<number>();
    {
        for (const column of awbwIdMap) {
            for (const awbwTileId of column) {
                const info = TilesConstantsCommon.AwbwTileMapping.get(awbwTileId);
                if (info == null) {
                    return undefined;
                }

                unneutralPlayerIndexSet.add(info.playerIndex);
            }
        }
        unneutralPlayerIndexSet.delete(0);
    }

    const playerIndexMapping = new Map<number, number>([[0, 0]]);
    {
        let newIndex = 1;
        for (const playerIndex of [...unneutralPlayerIndexSet].sort((v1, v2) => v1 - v2)) {
            playerIndexMapping.set(
                playerIndex,
                newIndex <= PlayersConstants.PlayerIndex.Max ? newIndex++ : 0
            );
        }
    }

    const tileArray: ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile[] = [];
    for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const info = TilesConstantsCommon.AwbwTileMapping.get(awbwIdMap[y][x]);
            if (info == null) {
                return undefined;
            }

            const cfg = gcData.getTileTemplateCfg(info.tileTypeId);
            if (cfg == null) {
                return undefined;
            }

            const tile = TilesUtilsSerialization.createDefault({
                gridIndex           : { x, y },
                tileBaseTypeId      : cfg.getToTileBaseTypeId(),
                tileObjectTypeId    : cfg.getToTileObjectTypeId(),
                gcData              : gcData,
            });
            tile.setPlayerIndex(playerIndexMapping.get(info.playerIndex) ?? 0);
            tileArray.push(tile);
        }
    }

    const playersCountUnneutral = Math.min(unneutralPlayerIndexSet.size, PlayersConstants.PlayerIndex.Max);
    return ProtoSchemaCommonProtoMapMapRawData.MapRawData.fromJson({
        designerName            : "AWBW",
        designerUserId          : UsersModel.getSelfUserId(),
        mapNameArray            : [{ languageType: LangConstants.LanguageType.English, text: "AWBW Map" }],
        mapWidth                : mapWidth,
        mapHeight               : mapHeight,
        playersCountUnneutral   : playersCountUnneutral,
        modifiedTime            : TimerTimerModel.getServerTimestamp(),
        tileDataArray           : tileArray.map(v => v.toJson()),
        unitDataArray           : [],
        templateWarRuleArray    : [WarRulesUtilsTemplate.createDefault(0, playersCountUnneutral, gcData).toJson()],
        mapTagIdFlags           : null,
        warEventFullData        : null,
        mapSimpleDialogueArray  : [],
        campaignMapData         : null,
        taskObjectiveFullData   : null,
        mapExtraText            : null,
        tileCustomNameArray     : [],
        unitCustomNameArray     : [],
    });
}
