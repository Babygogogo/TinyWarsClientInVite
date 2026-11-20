import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Lang_Constants, Lang_TextType,
    Lang_Utils,
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    UnitBuffs_Utils_Common,
    Units_Utils_Filter,
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_MapSize,
    type BaseWar_Model_War,
    type GameConfigs_GameConfig,
    type Players_Player,
    type Units_Unit,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import { UnitBuff } from "../../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { WeaAddUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitBuffSimple.ts";

export function checkIsValid(
    data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddUnitBuffSimple>,
    gameConfig              : GameConfigs_GameConfig.GameConfig,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_TextType.TextType.F0260,
        Lang_Utils.getText(Lang_TextType.TextType.Units),
        Lang_Utils.getUnitBuffName(data.getActBuffType()),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConUnitFilter();
            if (filter != null) {
                conTextArray.push(`- ${Units_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- (${Lang_Utils.getText(Lang_TextType.TextType.B1423)}) ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${Lang_Utils.getText(Lang_TextType.TextType.B1422)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${Lang_Utils.getText(Lang_TextType.TextType.A0944)}`);
        }
    }

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType();
            actTextArray.push(`- ${Lang_Utils.getText(Lang_TextType.TextType.AbnormalStateTypeId)}: ${Lang_Utils.getUnitBuffName(act)}`);
        }
        {
            const turnIndex = data.getActEndTurnIndex();
            if (turnIndex == null) {
                actTextArray.push(`- ${Lang_Utils.getText(Lang_TextType.TextType.EndTime)}: ${Lang_Utils.getText(Lang_TextType.TextType.B1455)}`);
            } else {
                const textForRelative = ` (${Lang_Utils.getText(Lang_TextType.TextType.B1017)})`;
                actTextArray.push(`- ${Lang_Utils.getText(Lang_TextType.TextType.EndTurnIndex)}: ${turnIndex}${data.getActIsRelativeEndTurnIndex() ? textForRelative : ``}`);

                const playerIndex = data.getActEndPlayerIndex() ?? 0;
                actTextArray.push(`- ${Lang_Utils.getText(Lang_TextType.TextType.EndPlayerIndex)}: ${playerIndex}${data.getActIsRelativeEndPlayerIndex() ? textForRelative : ``}`);
            }
        }
        {
            const extraParams = data.getActExtraParams();
            if (extraParams != null) {
                actTextArray.push(`- ${Lang_Utils.getText(Lang_TextType.TextType.B1229)}: [${extraParams.join(", ")}]`);
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(Lang_Utils.getText(Lang_TextType.TextType.A0957));
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_TextType.TextType.F0261,
        Lang_Utils.getText(Lang_TextType.TextType.Units),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_TextType.TextType.Units),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaAddUnitBuffSimple,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
    gameConfig              : GameConfigs_GameConfig.GameConfig,
): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.UnitFilter));
            }
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.TileFilter));
        }
    }

    const actBuffTypeId = data.getActBuffType();
    {
        if ((actBuffTypeId != null)                                     &&
            (!UnitBuffs_Utils_Common.checkIsValidTypeId(actBuffTypeId))
        ) {
            return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.AbnormalStateTypeId));
        }
    }
    {
        const act = data.getActEndTurnIndex();
        if (act != null) {
            if (!UnitBuffs_Utils_Common.checkIsValidModificationEndTurnIndex(act)) {
                return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.EndTurnIndex));
            }
        }
        if (data.getActIsRelativeEndTurnIndex()) {
            if (act == null) {
                return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.EndTurnIndex));
            }
        }
    }
    {
        const act = data.getActEndPlayerIndex();
        if (act != null) {
            if (!UnitBuffs_Utils_Common.checkIsValidModificationEndPlayerIndex(act)) {
                return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.EndPlayerIndex));
            }
        }
        if (data.getActIsRelativeEndPlayerIndex()) {
            if (act == null) {
                return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.EndPlayerIndex));
            }
        }
    }
    {
        const act = data.getActExtraParams();
        if (!UnitBuffs_Utils_Common.checkIsValidExtraParams(actBuffTypeId, act)) {
            return Lang_Utils.getFormattedText(Lang_TextType.TextType.F0091, Lang_Utils.getText(Lang_TextType.TextType.B1229));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function executeAsOuterWar(_action: WeaAddUnitBuffSimple): Promise<void> {
    // nothing to do
}
export async function executeAsLocalWar(data: WeaAddUnitBuffSimple, war: BaseWar_Model_War.War, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const newBuff = generateNewBuff(data, war);
    if (newBuff == null) {
        return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    }

    const targetUnitList: Units_Unit.Unit[] = [];
    {
        const tileMap           = war.getTileMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const playerFilterDict  = new Map<Players_Player.Player, boolean>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((conUnitFilter != null) &&
                (!Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))
            ) {
                continue;
            }

            if ((conTileFilter != null) &&
                (!Tiles_Utils_Filter.checkIsMeet(conTileFilter, tileMap.getTile(unit.getGridIndex())))
            ) {
                continue;
            }

            if ((conPlayerFilter != null) &&
                (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))
            ) {
                continue;
            }

            targetUnitList.push(unit);
        }

        if (!targetUnitList.length) {
            return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
        }
    }

    {
        const needUpdateView = !isFastExecute;
        for (const unit of targetUnitList) {
            unit.addBuff(newBuff.clone(), needUpdateView);
        }
    }
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({ units : targetUnitList });
}
function checkIsMeetConPlayerFilter(resultDict: Map<Players_Player.Player, boolean>, filter: PlayerFilter, player: Players_Player.Player): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function calculateExpiringTime(
    action              : WeaAddUnitBuffSimple,
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
function generateNewBuff(action: WeaAddUnitBuffSimple, war: BaseWar_Model_War.War): UnitBuff | null {
    const turnManager           = war.getTurnManager();
    const currentTurnIndex      = turnManager.getTurnIndex();
    const currentPlayerIndex    = turnManager.getPlayerIndexInTurn();
    const expiringTime          = calculateExpiringTime(action, currentTurnIndex, currentPlayerIndex, war.getPlayerManager().getTotalPlayersCount(true));
    const buff                  = UnitBuff.fromJson({
        buffTypeId          : action.getActBuffType(),
        expiringTurnIndex   : expiringTime[0],
        expiringPlayerIndex : expiringTime[1],
        extraParamArray     : action.getActExtraParams(),
    });

    return (!UnitBuffs_Utils_Common.checkIsValid(buff)) || (UnitBuffs_Utils_Common.checkIsExpired(buff, currentTurnIndex, currentPlayerIndex))
        ? null
        : buff;
}
