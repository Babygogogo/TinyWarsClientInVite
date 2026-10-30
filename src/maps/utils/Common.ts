import {
    Tiles_Constants_Common,
    Maps_Constants,
    Tiles_Utils_Serialization,
    WarRules_Utils_Template,
    Users_Model,
    Timer_TimerModel,
    Lang_Constants,
    Players_Constants,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

export function convertAwbwMap(text: string, gcData: GameConfigs_GameConfig.GameConfig): MapRawData | undefined {
    const awbwIdMap = text.trim().split(`\n`).map(line => line.split(`,`)).map(line => line.map(cell => parseInt(cell)));
    const mapHeight = awbwIdMap.length;
    if (mapHeight <= 0) {
        return undefined;
    }

    const mapWidth = awbwIdMap[0].length;
    if ((mapWidth <= 0) ||
        (mapWidth * mapHeight > Maps_Constants.Common.MaxGridsCount)
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
                const info = Tiles_Constants_Common.AwbwTileMapping.get(awbwTileId);
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
                newIndex <= Players_Constants.PlayerIndex.Max ? newIndex++ : 0
            );
        }
    }

    const tileArray: SerialTile[] = [];
    for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const info = Tiles_Constants_Common.AwbwTileMapping.get(awbwIdMap[y][x]);
            if (info == null) {
                return undefined;
            }

            const cfg = gcData.getTileTemplateCfg(info.tileTypeId);
            if (cfg == null) {
                return undefined;
            }

            const tile = Tiles_Utils_Serialization.createDefault({
                gridIndex           : { x, y },
                tileBaseTypeId      : cfg.getToTileBaseTypeId(),
                tileObjectTypeId    : cfg.getToTileObjectTypeId(),
                gcData              : gcData,
            });
            tile.setPlayerIndex(playerIndexMapping.get(info.playerIndex) ?? 0);
            tileArray.push(tile);
        }
    }

    const playersCountUnneutral = Math.min(unneutralPlayerIndexSet.size, Players_Constants.PlayerIndex.Max);
    return MapRawData.fromJson({
        designerName            : "AWBW",
        designerUserId          : Users_Model.getSelfUserId(),
        mapNameArray            : [{ languageType: Lang_Constants.LanguageType.English, text: "AWBW Map" }],
        mapWidth                : mapWidth,
        mapHeight               : mapHeight,
        playersCountUnneutral   : playersCountUnneutral,
        modifiedTime            : Timer_TimerModel.getServerTimestamp(),
        tileDataArray           : tileArray.map(v => v.toJson()),
        unitDataArray           : [],
        templateWarRuleArray    : [WarRules_Utils_Template.createDefault(0, playersCountUnneutral, gcData).toJson()],
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
