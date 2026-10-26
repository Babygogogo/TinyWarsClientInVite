import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getText } from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetViewpointSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointSimple.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import { checkIsValid as UnitsUtilsFilterCheckIsValid, checkIsMeet as UnitsUtilsFilterCheckIsMeet } from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
} from "../../../valueAndComparators/Utils.ts";
import { Common } from "../constants/SetViewpointSimple.ts";
import { doApply } from "./SetViewpointExpr.ts";

export function checkIsValid(data: Undefinable<WeaSetViewpointSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetViewpointSimple>): string | null {
    if (!data) {
        return null;
    }

    return getFormattedText(
        TextType.F0258,
        getText(TextType.Tiles),
        getText(TextType.Tiles),
    );
}
export function getDetailDesc(data: Undefinable<WeaSetViewpointSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1421)}) ${getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            conTextArray.push(`- ${getDesc(
                comparator,
                getText(data.getConUnitFilter() == null ? TextType.B1418 : TextType.B1419)
            )}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    return getFormattedText(
        TextType.F0259,
        getText(TextType.Tiles),
        conTextArray.join(`\n`),
        getText(TextType.Tiles),
    );
}

export function getErrorTip(data: WeaSetViewpointSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return getFormattedText(TextType.F0091, getText(TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!ValueAndComparatorsUtilsCheckIsValid(comparator))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActNeedFocusEffect();
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsOneByOne();
    }
    {
        const act = data.getActInterval() ?? Common.DefaultInterval;
        if (
            (act > Common.MaxInterval)    ||
            (act < Common.MinInterval)
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.B1035));
        }
    }

    return null;
}

export async function applyWithExtraData(action: WeaSetViewpointSimple, isFast: boolean, war: IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(data: WeaSetViewpointSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetGridIndexArray: GridIndex[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((conTileFilter != null) && (!TilesUtilsFilterCheckIsMeet(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(gridIndex)) {
                    if ((conUnitFilter == null) || (UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtilsCheckIsMeet(conUnitComparator, count)) {
                    continue;
                }
            }

            targetGridIndexArray.push(gridIndex);
        }

        if (!targetGridIndexArray.length) {
            return;
        }
    }

    return doApply({
        gridIndexArray      : targetGridIndexArray,
        isNeedFocusEffect   : !!data.getActNeedFocusEffect(),
        isOneByOne          : !!data.getActIsOneByOne(),
        interval            : data.getActInterval() ?? Common.DefaultInterval,
        war                 : war,
        isFastExecute       : isFastExecute,
    });
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
