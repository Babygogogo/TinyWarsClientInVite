import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import * as ProtoSchemaCommonProtoStructureUnitBuff from "../../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaAddUnitBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitBuffSimple.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitBuffsUtilsCommon from "../../../unitBuffs/utils/Common.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";

type PlayerFilter           = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type WeaAddUnitBuffSimple   = ProtoSchemaCommonProtoWarEventWeaAddUnitBuffSimple.WeaAddUnitBuffSimple;
type IPlayer                = PlayersIPlayer.IPlayer;

export function checkIsValid(
    data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddUnitBuffSimple>,
    gameConfig              : GameConfigGcData.GcData,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0260,
        LangUtils.getText(LangConstants.TextType.Units),
        LangUtils.getUnitBuffName(data.getActBuffType() ?? 0)
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConUnitFilter();
            if (filter != null) {
                conTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
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
            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId)}: ${LangUtils.getUnitBuffName(act)}`);
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
        LangUtils.getText(LangConstants.TextType.Units),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.Units),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaAddUnitBuffSimple,
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

    const actBuffTypeId = data.getActBuffType() ?? 0;
    {
        if ((actBuffTypeId != null)                                     &&
            (!UnitBuffsUtilsCommon.checkIsValidTypeId(actBuffTypeId))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
        }
    }
    {
        const act = data.getActEndTurnIndex();
        if (act != null) {
            if (!UnitBuffsUtilsCommon.checkIsValidModificationEndTurnIndex(act)) {
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
            if (!UnitBuffsUtilsCommon.checkIsValidModificationEndPlayerIndex(act)) {
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
        if (!UnitBuffsUtilsCommon.checkIsValidExtraParams(actBuffTypeId, act)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1229));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaAddUnitBuffSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaAddUnitBuffSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newBuff = generateNewBuff(data, war);
    if (newBuff == null) {
        return;
    }

    const targetUnitList: UnitsIUnit.IUnit[] = [];
    {
        const tileMap           = war.getTileMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((conUnitFilter != null) &&
                (!UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))
            ) {
                continue;
            }

            if ((conTileFilter != null) &&
                (!TilesUtilsFilter.checkIsMeet(conTileFilter, tileMap.getTile(unit.getGridIndex())))
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
            return;
        }
    }

    {
        const needUpdateView = !isFastExecute;
        for (const unit of targetUnitList) {
            unit.addBuff(newBuff.clone(), needUpdateView, true);
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
    action              : WeaAddUnitBuffSimple,
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
function generateNewBuff(action: WeaAddUnitBuffSimple, war: BaseWarInterfaceIBwWar.IBwWar): ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff | null {
    const turnManager           = war.getTurnManager();
    const currentTurnIndex      = turnManager.getTurnIndex();
    const currentPlayerIndex    = turnManager.getPlayerIndexInTurn();
    const expiringTime          = calculateExpiringTime(action, currentTurnIndex, currentPlayerIndex, war.getPlayerManager().getTotalPlayersCount(true));
    const buff                  = ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff.fromJson({
        buffTypeId          : action.getActBuffType(),
        expiringTurnIndex   : expiringTime[0],
        expiringPlayerIndex : expiringTime[1],
        extraParamArray     : action.getActExtraParams(),
    });

    return (!UnitBuffsUtilsCommon.checkIsValid(buff)) || (UnitBuffsUtilsCommon.checkIsExpired(buff, currentTurnIndex, currentPlayerIndex))
        ? null
        : buff;
}
