import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
    getTileBuffName,
} from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    getDescForEmbed as getPlayersDescForEmbed,
    checkIsValid as checkIsValidPlayerFilter,
    checkIsMeet as checkIsMeetPlayerFilter,
} from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaAddTileBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";
import {
    checkIsValidTypeId,
    checkIsValidModificationEndTurnIndex,
    checkIsValidModificationEndPlayerIndex,
    checkIsValidExtraParams,
    create,
    checkIsValid as checkIsValidTileBuff,
    checkIsExpired,
} from "../../../tileBuffs/utils/Common.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as getTilesDescForEmbed,
    checkIsValid as checkIsValidTileFilter,
    checkIsMeet as checkIsMeetTileFilter,
} from "../../../tiles/utils/Filter.ts";
import {
    checkIsValid as checkIsValidUnitFilter,
    checkIsMeet as checkIsMeetUnitFilter,
} from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as checkIsValidValueAndComparator,
    checkIsMeet as checkIsMeetValueAndComparator,
} from "../../../valueAndComparators/Utils.ts";

export function checkIsValid(
    data                    : Undefinable<WeaAddTileBuffSimple>,
    gameConfig              : GameConfig,
    mapSize                 : MapSize,
    playersCountUnneutral   : number
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaAddTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return getFormattedText(
        TextType.F0260,
        getText(TextType.Tiles),
        getTileBuffName(data.getActBuffType())
    );
}
export function getDetailDesc(data: Undefinable<WeaAddTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- ${getTilesDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${getText(TextType.B1421)}) ${getPlayersDescForEmbed(filter)}`);
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
    }

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType();
            actTextArray.push(`- ${getText(TextType.AbnormalStateTypeId)}: ${getTileBuffName(act)}`);
        }
        {
            const turnIndex = data.getActEndTurnIndex();
            if (turnIndex == null) {
                actTextArray.push(`- ${getText(TextType.EndTime)}: ${getText(TextType.B1455)}`);
            } else {
                const textForRelative = ` (${getText(TextType.B1017)})`;
                actTextArray.push(`- ${getText(TextType.EndTurnIndex)}: ${turnIndex}${data.getActIsRelativeEndTurnIndex() ? textForRelative : ``}`);

                const playerIndex = data.getActEndPlayerIndex() ?? 0;
                actTextArray.push(`- ${getText(TextType.EndPlayerIndex)}: ${playerIndex}${data.getActIsRelativeEndPlayerIndex() ? textForRelative : ``}`);
            }
        }
        {
            const extraParams = data.getActExtraParams();
            if (extraParams != null) {
                actTextArray.push(`- ${getText(TextType.B1229)}: [${extraParams.join(", ")}]`);
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(getText(TextType.A0957));
        }
    }

    return getFormattedText(
        TextType.F0261,
        getText(TextType.Tiles),
        conTextArray.join(`\n`),
        getText(TextType.Tiles),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaAddTileBuffSimple,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gameConfig              : GameConfig
): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!checkIsValidUnitFilter(filter, playersCountUnneutral, mapSize, gameConfig)) {
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
            (!checkIsValidPlayerFilter(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!checkIsValidTileFilter(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!checkIsValidValueAndComparator(comparator))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    const actBuffTypeId = data.getActBuffType();
    {
        if (!checkIsValidTypeId(actBuffTypeId)) {
            return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
        }
    }
    {
        const act = data.getActEndTurnIndex();
        if (act != null) {
            if (!checkIsValidModificationEndTurnIndex(act)) {
                return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
            }
        }
        if (data.getActIsRelativeEndTurnIndex()) {
            if (act == null) {
                return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
            }
        }
    }
    {
        const act = data.getActEndPlayerIndex();
        if (act != null) {
            if (!checkIsValidModificationEndPlayerIndex(act)) {
                return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
            }
        }
        if (data.getActIsRelativeEndPlayerIndex()) {
            if (act == null) {
                return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
            }
        }
    }
    {
        const act = data.getActExtraParams();
        if (!checkIsValidExtraParams(actBuffTypeId, act)) {
            return getFormattedText(TextType.F0091, getText(TextType.B1229));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaAddTileBuffSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaAddTileBuffSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const newBuff = generateNewBuff(data, war);
    if (newBuff == null) {
        return;
    }

    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((conTileFilter != null) && (!checkIsMeetTileFilter(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (checkIsMeetUnitFilter(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!checkIsMeetValueAndComparator(conUnitComparator, count)) {
                    continue;
                }
            }

            targetTileArray.push(tile);
        }

        if (!targetTileArray.length) {
            return;
        }
    }

    {
        const needUpdateView = !isFastExecute;
        for (const tile of targetTileArray) {
            tile.addUnfixedBuff(newBuff.clone(), needUpdateView);
        }
    }
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeetPlayerFilter(filter, player));
    }
    return !!resultDict.get(player);
}
function calculateExpiringTime(
    action              : WeaAddTileBuffSimple,
    currentTurnIndex    : number,
    currentPlayerIndex  : number,
    playersCountNeutral : number
): (number | null)[] {
    const rawEndTurnIndex = action.getActEndTurnIndex();
    if (rawEndTurnIndex == null) {
        return [null, null];
    }

    let turnIndex   = rawEndTurnIndex                      + (action.getActIsRelativeEndTurnIndex() ? currentTurnIndex : 0);
    let playerIndex = (action.getActEndPlayerIndex() ?? 0) + (action.getActIsRelativeEndPlayerIndex() ? currentPlayerIndex : 0);
    {
        const temp  = Math.floor(playerIndex / playersCountNeutral);
        turnIndex   += temp;
        playerIndex -= temp * playersCountNeutral;
    }
    if (playerIndex < 0) {
        turnIndex   -= 1;
        playerIndex += playersCountNeutral;
    }

    return [turnIndex, playerIndex];
}
function generateNewBuff(action: WeaAddTileBuffSimple, war: IBwWar): TileBuff | null {
    const turnManager           = war.getTurnManager();
    const currentTurnIndex      = turnManager.getTurnIndex();
    const currentPlayerIndex    = turnManager.getPlayerIndexInTurn();
    const expiringTime          = calculateExpiringTime(action, currentTurnIndex, currentPlayerIndex, war.getPlayerManager().getTotalPlayersCount(true));
    const buff                  = create({
        buffTypeId          : action.getActBuffType(),
        expiringTurnIndex   : expiringTime[0],
        expiringPlayerIndex : expiringTime[1],
        extraParams         : action.getActExtraParams(),
    });

    return (!checkIsValidTileBuff(buff))
        || (checkIsExpired(buff, currentTurnIndex, currentPlayerIndex)) ? null : buff;
}
