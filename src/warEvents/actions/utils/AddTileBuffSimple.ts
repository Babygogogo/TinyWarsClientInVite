import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffSimple.ts";
import * as TileBuffsUtilsCommon from "../../../tileBuffs/utils/Common.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type TileBuff                   = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type PlayerFilter               = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type WeaAddTileBuffSimple       = ProtoSchemaCommonProtoWarEventWeaAddTileBuffSimple.WeaAddTileBuffSimple;
type IPlayer                    = PlayersIPlayer.IPlayer;

export function checkIsValid(
    data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddTileBuffSimple>,
    gameConfig              : GameConfigGcData.GcData,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0260,
        LangUtils.getText(LangConstants.TextType.Tiles),
        LangUtils.getTileBuffName(data.getActBuffType() ?? 0)
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- ${TilesUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1421)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const comparator = data.getConUnitComparator();
            if (comparator != null) {
                conTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                    comparator,
                    LangUtils.getText(data.getConUnitFilter() == null ? LangConstants.TextType.B1418 : LangConstants.TextType.B1419)
                )}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
        }
    }

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType() ?? 0;
            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId)}: ${LangUtils.getTileBuffName(act)}`);
        }
        {
            const turnIndex = data.getActEndTurnIndex();
            if (turnIndex == null) {
                actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndTime)}: ${LangUtils.getText(LangConstants.TextType.B1455)}`);
            } else {
                const textForRelative = ` (${LangUtils.getText(LangConstants.TextType.B1017)})`;
                actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndTurnIndex)}: ${turnIndex}${data.getActIsRelativeEndTurnIndex() ? textForRelative : ``}`);

                const playerIndex = data.getActEndPlayerIndex() ?? 0;
                actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndPlayerIndex)}: ${playerIndex}${data.getActIsRelativeEndPlayerIndex() ? textForRelative : ``}`);
            }
        }
        {
            const extraParams = data.getActExtraParams();
            if (extraParams != null) {
                actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.B1229)}: [${extraParams.join(", ")}]`);
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
        }
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0261,
        LangUtils.getText(LangConstants.TextType.Tiles),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.Tiles),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaAddTileBuffSimple,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number,
    gameConfig              : GameConfigGcData.GcData
): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!ValueAndComparatorsUtils.checkIsValid(comparator))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    const actBuffTypeId = data.getActBuffType() ?? 0;
    {
        if (!TileBuffsUtilsCommon.checkIsValidTypeId(actBuffTypeId)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
        }
    }
    {
        const act = data.getActEndTurnIndex();
        if (act != null) {
            if (!TileBuffsUtilsCommon.checkIsValidModificationEndTurnIndex(act)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndTurnIndex));
            }
        }
        if (data.getActIsRelativeEndTurnIndex()) {
            if (act == null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndTurnIndex));
            }
        }
    }
    {
        const act = data.getActEndPlayerIndex();
        if (act != null) {
            if (!TileBuffsUtilsCommon.checkIsValidModificationEndPlayerIndex(act)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndPlayerIndex));
            }
        }
        if (data.getActIsRelativeEndPlayerIndex()) {
            if (act == null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndPlayerIndex));
            }
        }
    }
    {
        const act = data.getActExtraParams();
        if (!TileBuffsUtilsCommon.checkIsValidExtraParams(actBuffTypeId, act)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1229));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaAddTileBuffSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaAddTileBuffSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newBuff = generateNewBuff(data, war);
    if (newBuff == null) {
        return;
    }

    const targetTileArray: TilesITile.ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((conTileFilter != null) && (!TilesUtilsFilter.checkIsMeet(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtils.checkIsMeet(conUnitComparator, count)) {
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
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
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
function generateNewBuff(action: WeaAddTileBuffSimple, war: BaseWarInterfaceIBwWar.IBwWar): TileBuff | null {
    const turnManager           = war.getTurnManager();
    const currentTurnIndex      = turnManager.getTurnIndex();
    const currentPlayerIndex    = turnManager.getPlayerIndexInTurn();
    const expiringTime          = calculateExpiringTime(action, currentTurnIndex, currentPlayerIndex, war.getPlayerManager().getTotalPlayersCount(true));
    const buff                  = TileBuffsUtilsCommon.create({
        buffTypeId          : action.getActBuffType() ?? 0,
        expiringTurnIndex   : expiringTime[0],
        expiringPlayerIndex : expiringTime[1],
        extraParams         : action.getActExtraParams(),
    });

    return (!TileBuffsUtilsCommon.checkIsValid(buff))
        || (TileBuffsUtilsCommon.checkIsExpired(buff, currentTurnIndex, currentPlayerIndex)) ? null : buff;
}
