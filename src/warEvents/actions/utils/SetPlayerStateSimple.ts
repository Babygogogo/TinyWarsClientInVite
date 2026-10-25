import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import { PlayerDataForWeaSetPlayerState } from "../../../auxiliaryTypes/PlayerDataForWeaSetPlayerState.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getValidEnergy } from "../../../cos/Utils.ts";
import { checkIsValidSkillTypeId } from "../../../coSkills/utils/Common.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { createLazyFunc } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText } from "../../../lang/Utils.ts";
import { checkIsValid as MultiplierAndOffsetsUtilsCheckIsValid, getResultValue } from "../../../multiplierAndOffsets/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import { Fund } from "../../../players/Constants.ts";
import type { IPlayer as PlayersIPlayer } from "../../../players/IPlayer.ts";
import { checkIsValidAliveStateId } from "../../../players/utils/Common.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type {
    WeaSetPlayerStateSimple as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";
import { checkIsValid as TilesUtilsFilterCheckIsValid, checkIsMeet as TilesUtilsFilterCheckIsMeet } from "../../../tiles/utils/Filter.ts";
import { checkIsValid as UnitsUtilsFilterCheckIsValid, checkIsMeet as UnitsUtilsFilterCheckIsMeet } from "../../../units/utils/Filter.ts";
import { getDesc, checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet } from "../../../valueAndComparators/Utils.ts";

type WeaSetPlayerStateSimple            = ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple;
type IPlayer                            = PlayersIPlayer;

export function checkIsValid(data: Undefinable<WeaSetPlayerStateSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetPlayerStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        if (data.getActFund()) {
            actTextArray.push(getText(TextType.Fund));
        }
    }
    {
        if (data.getActCoId() != null) {
            actTextArray.push(`CO`);
        }
    }
    {
        if (data.getActCoEnergy()) {
            actTextArray.push(getText(TextType.CoEnergy));
        }
    }
    {
        if (data.getActAliveState()) {
            actTextArray.push(getText(TextType.PlayerAliveState));
        }
    }
    {
        if (data.getActIsSkipTurn()) {
            actTextArray.push(getText(TextType.SkipATurn));
        }
    }
    {
        if (data.getActCoUsingSkillType()) {
            actTextArray.push(getText(TextType.ActivatingCoSkillType));
        }
    }
    {
        if (data.getActActivateCoSkillType()) {
            actTextArray.push(getText(TextType.TriggerCoSkillType));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0254,
        getText(TextType.Players),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: Undefinable<WeaSetPlayerStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- ${getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConTileComparator();
        if (comparator != null) {
            conTextArray.push(`- ${getDesc(
                comparator,
                getText(data.getConTileFilter() == null ? TextType.B1406 : TextType.B1407)
            )}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            conTextArray.push(`- ${getDesc(
                comparator,
                getText(data.getConUnitFilter() == null ? TextType.B1404 : TextType.B1405)
            )}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        if (data.getActFund()) {
            actTextArray.push(getText(TextType.Fund));
        }
    }
    {
        if (data.getActCoId() != null) {
            actTextArray.push(`CO`);
        }
    }
    {
        if (data.getActCoEnergy()) {
            actTextArray.push(getText(TextType.CoEnergy));
        }
    }
    {
        if (data.getActAliveState()) {
            actTextArray.push(getText(TextType.PlayerAliveState));
        }
    }
    {
        if (data.getActIsSkipTurn()) {
            actTextArray.push(getText(TextType.SkipATurn));
        }
    }
    {
        if (data.getActCoUsingSkillType()) {
            actTextArray.push(getText(TextType.ActivatingCoSkillType));
        }
    }
    {
        if (data.getActActivateCoSkillType()) {
            actTextArray.push(getText(TextType.TriggerCoSkillType));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0255,
        getText(TextType.Players),
        conTextArray.join(`\n`),
        getText(TextType.Players),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetPlayerStateSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
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
        if (filter != null) {
            if (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
            }
            if (data.getConTileComparator() == null) {
                return getFormattedText(TextType.F0091, getText(TextType.Comparator));
            }
        }
    }
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
        const act = data.getActFund();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Fund));
        }
    }
    {
        const act = data.getActCoId();
        if ((act != null)                           &&
            (gameConfig.getCoBasicCfg(act) == null)
        ) {
            return getFormattedText(TextType.F0091, `CO`);
        }
    }
    {
        const act = data.getActCoEnergy();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.CoEnergy));
        }
    }
    {
        const act = data.getActAliveState();
        if ((act != null)                                       &&
            (!checkIsValidAliveStateId(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerAliveState));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsSkipTurn();
    }
    {
        const act = data.getActCoUsingSkillType();
        if ((act != null)                                       &&
            (!checkIsValidSkillTypeId(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.ActivatingCoSkillType));
        }
    }
    {
        const act = data.getActActivateCoSkillType();
        if ((act != null)                                       &&
            (!checkIsValidSkillTypeId(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TriggerCoSkillType));
        }
    }

    if (
        (data.getActFund() == null)                 &&
        (data.getActCoId() == null)                 &&
        (data.getActCoEnergy() == null)             &&
        (data.getActAliveState() == null)           &&
        (data.getActIsSkipTurn() == null)           &&
        (data.getActCoUsingSkillType() == null)     &&
        (data.getActActivateCoSkillType() == null)
    ) {
        return getText(TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetPlayerStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetPlayerStateSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetPlayerArray: IPlayer[] = [];
    {
        const getAllTiles       = createLazyFunc(() => war.getTileMap().getAllTiles());
        const getAllUnits       = createLazyFunc(() => war.getUnitMap().getAllUnits());
        const conPlayerFilter   = action.getConPlayerFilter();
        const conTileFilter     = action.getConTileFilter();
        const conTileComparator = action.getConTileComparator();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            if ((conPlayerFilter != null) && (!checkIsMeet(conPlayerFilter, player))) {
                continue;
            }

            if (conTileComparator != null) {
                const playerIndex   = player.getPlayerIndex();
                let count           = 0;
                for (const tile of getAllTiles()) {
                    if (
                        (tile.getPlayerIndex() === playerIndex)                                                 &&
                        ((conTileFilter == null) || (TilesUtilsFilterCheckIsMeet(conTileFilter, tile)))
                    ) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtilsCheckIsMeet(conTileComparator, count)) {
                    continue;
                }
            }

            if (conUnitComparator != null) {
                const playerIndex   = player.getPlayerIndex();
                let count           = 0;
                for (const unit of getAllUnits()) {
                    if (
                        (unit.getPlayerIndex() === playerIndex)                                                 &&
                        ((conUnitFilter == null) || (UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit)))
                    ) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtilsCheckIsMeet(conUnitComparator, count)) {
                    continue;
                }
            }

            targetPlayerArray.push(player);
        }

        if (!targetPlayerArray.length) {
            return;
        }
    }

    const dataArray: PlayerDataForWeaSetPlayerState[] = [];
    {
        for (const player of targetPlayerArray) {
            dataArray.push(new PlayerDataForWeaSetPlayerState({
                playerIndex         : player.getPlayerIndex(),
                fund                : evalActFund(action, player),
                aliveState          : evalActAliveState(action, player),
                coId                : evalActCoId(action),
                coEnergy            : evalActCoEnergy(action, player),
                isSkipTurn          : evalActIsSkipTurn(action, player),
                coUsingSkillType    : evalActCoUsingSkillType(action, player),
                activateCoSkillType : evalActActivateCoSkillType(action, player),
            }));
        }
    }

    {
        for (const data of dataArray) {
            await data.apply(war, isFastExecute);
        }
    }
}

function evalActFund(action: WeaSetPlayerStateSimple, player: IPlayer): number | null {
    const act = action.getActFund();
    if (act == null) {
        return null;
    }

    return getValueInRange({
        minValue    : Fund.MinFund,
        maxValue    : Fund.MaxFund,
        rawValue    : getResultValue(act, player.getFund()),
    });
}

function evalActCoId(action: WeaSetPlayerStateSimple): number | null {
    const act = action.getActCoId();
    if (act == null) {
        return null;
    }

    return act;
}

function evalActCoEnergy(action: WeaSetPlayerStateSimple, player: IPlayer): number | null {
    const act = action.getActCoEnergy();
    if (act == null) {
        return null;
    }

    return getValidEnergy(getResultValue(act, player.getCoCurrentEnergy()));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActAliveState(action: WeaSetPlayerStateSimple, player: IPlayer): number | null {
    const act = action.getActAliveState();
    if (act == null) {
        return null;
    }

    return act;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActIsSkipTurn(action: WeaSetPlayerStateSimple, player: IPlayer): boolean | null {
    const act = action.getActIsSkipTurn();
    if (act == null) {
        return null;
    }

    return act;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActCoUsingSkillType(action: WeaSetPlayerStateSimple, player: IPlayer): number | null {
    const act = action.getActCoUsingSkillType();
    if (act == null) {
        return null;
    }

    return act;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActActivateCoSkillType(action: WeaSetPlayerStateSimple, player: IPlayer): number | null {
    const act = action.getActActivateCoSkillType();
    if (act == null) {
        return null;
    }

    return act;
}
