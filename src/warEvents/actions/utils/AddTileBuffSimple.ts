import {
    TileBuffs_Utils_Common,
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    Lang_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_Tile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaAddTileBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";

export function checkIsValid(
    data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddTileBuffSimple>,
    gameConfig              : GameConfigs_GameConfig.GameConfig,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0260,
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        Lang_Utils.getTileBuffName(data.getActBuffType()),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1421)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const comparator = data.getConUnitComparator();
            if (comparator != null) {
                conTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                    comparator,
                    Lang_Utils.getText(data.getConUnitFilter() == null ? Lang_Constants.TextType.B1418 : Lang_Constants.TextType.B1419),
                )}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
        }
    }

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType();
            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId)}: ${Lang_Utils.getTileBuffName(act)}`);
        }
        {
            const turnIndex = data.getActEndTurnIndex();
            if (turnIndex == null) {
                actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndTime)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1455)}`);
            } else {
                const textForRelative = ` (${Lang_Utils.getText(Lang_Constants.TextType.B1017)})`;
                actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex)}: ${turnIndex}${data.getActIsRelativeEndTurnIndex() ? textForRelative : ``}`);

                const playerIndex = data.getActEndPlayerIndex() ?? 0;
                actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex)}: ${playerIndex}${data.getActIsRelativeEndPlayerIndex() ? textForRelative : ``}`);
            }
        }
        {
            const extraParams = data.getActExtraParams();
            if (extraParams != null) {
                actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.B1229)}: [${extraParams.join(", ")}]`);
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0261,
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaAddTileBuffSimple,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
    gameConfig              : GameConfigs_GameConfig.GameConfig,
): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!ValueAndComparators_Utils.checkIsValid(comparator))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    const actBuffTypeId = data.getActBuffType();
    {
        if (!TileBuffs_Utils_Common.checkIsValidTypeId(actBuffTypeId)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
        }
    }
    {
        const act = data.getActEndTurnIndex();
        if (act != null) {
            if (!TileBuffs_Utils_Common.checkIsValidModificationEndTurnIndex(act)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex));
            }
        }
        if (data.getActIsRelativeEndTurnIndex()) {
            if (act == null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex));
            }
        }
    }
    {
        const act = data.getActEndPlayerIndex();
        if (act != null) {
            if (!TileBuffs_Utils_Common.checkIsValidModificationEndPlayerIndex(act)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex));
            }
        }
        if (data.getActIsRelativeEndPlayerIndex()) {
            if (act == null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex));
            }
        }
    }
    {
        const act = data.getActExtraParams();
        if (!TileBuffs_Utils_Common.checkIsValidExtraParams(actBuffTypeId, act)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1229));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaAddTileBuffSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaAddTileBuffSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newBuff = generateNewBuff(data, war);
    if (newBuff == null) {
        return;
    }

    const targetTileArray: Tiles_Tile.Tile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((conTileFilter != null) && (!Tiles_Utils_Filter.checkIsMeet(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!ValueAndComparators_Utils.checkIsMeet(conUnitComparator, count)) {
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
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function calculateExpiringTime(
    action              : WeaAddTileBuffSimple,
    currentTurnIndex    : number,
    currentPlayerIndex  : number,
    playersCountNeutral : number,
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
function generateNewBuff(action: WeaAddTileBuffSimple, war: BaseWar_Interface_IBwWar.IBwWar): TileBuff | null {
    const turnManager           = war.getTurnManager();
    const currentTurnIndex      = turnManager.getTurnIndex();
    const currentPlayerIndex    = turnManager.getPlayerIndexInTurn();
    const expiringTime          = calculateExpiringTime(action, currentTurnIndex, currentPlayerIndex, war.getPlayerManager().getTotalPlayersCount(true));
    const buff                  = TileBuffs_Utils_Common.create({
        buffTypeId          : action.getActBuffType(),
        expiringTurnIndex   : expiringTime[0],
        expiringPlayerIndex : expiringTime[1],
        extraParams         : action.getActExtraParams(),
    });

    return (!TileBuffs_Utils_Common.checkIsValid(buff))
        || (TileBuffs_Utils_Common.checkIsExpired(buff, currentTurnIndex, currentPlayerIndex)) ? null : buff;
}
