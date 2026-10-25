import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getText, getTileBuffName } from "../../../lang/Utils.ts";
import type { IPlayer as PlayersIPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type {
    PlayerFilter as ProtoSchemaCommonProtoStructurePlayerFilter,
} from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileBuff as ProtoSchemaCommonProtoStructureTileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type {
    WeaAddTileBuffSimple as ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple,
} from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";
import {
    checkIsValidTypeId,
    checkIsValidModificationEndTurnIndex,
    checkIsValidModificationEndPlayerIndex,
    checkIsValidExtraParams,
    create,
    checkIsValid as TileBuffsUtilsCommonCheckIsValid,
    checkIsExpired,
} from "../../../tileBuffs/utils/Common.ts";
import type { ITile } from "../../../tiles/ITile.ts";
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

type TileBuff                   = ProtoSchemaCommonProtoStructureTileBuff;
type PlayerFilter               = ProtoSchemaCommonProtoStructurePlayerFilter;
type WeaAddTileBuffSimple       = ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple;
type IPlayer                    = PlayersIPlayer;

export function checkIsValid(
    data                    : Undefinable<WeaAddTileBuffSimple>,
    gameConfig              : GcData,
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
        getTileBuffName(data.getActBuffType() ?? 0)
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
    }

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType() ?? 0;
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
    gameConfig              : GcData
): string | null {
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

    const actBuffTypeId = data.getActBuffType() ?? 0;
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
            if ((conTileFilter != null) && (!TilesUtilsFilterCheckIsMeet(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtilsCheckIsMeet(conUnitComparator, count)) {
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
        resultDict.set(player, checkIsMeet(filter, player));
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
        buffTypeId          : action.getActBuffType() ?? 0,
        expiringTurnIndex   : expiringTime[0],
        expiringPlayerIndex : expiringTime[1],
        extraParams         : action.getActExtraParams(),
    });

    return (!TileBuffsUtilsCommonCheckIsValid(buff))
        || (checkIsExpired(buff, currentTurnIndex, currentPlayerIndex)) ? null : buff;
}
