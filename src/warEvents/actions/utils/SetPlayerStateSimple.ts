import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    Players_Utils_Common,
    MultiplierAndOffsets_Utils,
    CoSkills_Utils_Common,
    Helpers_Misc,
    Players_Constants,
    Lang_Utils,
    Cos_Utils,
    Numbers_Utils,
    AuxiliaryTypes_PlayerDataForWeaSetPlayerState,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetPlayerStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        if (data.getActFund()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Fund));
        }
    }
    {
        if (data.getActCoId() != null) {
            actTextArray.push(`CO`);
        }
    }
    {
        if (data.getActCoEnergy()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoEnergy));
        }
    }
    {
        if (data.getActAliveState()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState));
        }
    }
    {
        if (data.getActIsSkipTurn()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.SkipATurn));
        }
    }
    {
        if (data.getActCoUsingSkillType()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType));
        }
    }
    {
        if (data.getActActivateCoSkillType()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TriggerCoSkillType));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0254,
        Lang_Utils.getText(Lang_Constants.TextType.Players),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConTileComparator();
        if (comparator != null) {
            conTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                comparator,
                Lang_Utils.getText(data.getConTileFilter() == null ? Lang_Constants.TextType.B1406 : Lang_Constants.TextType.B1407),
            )}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            conTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                comparator,
                Lang_Utils.getText(data.getConUnitFilter() == null ? Lang_Constants.TextType.B1404 : Lang_Constants.TextType.B1405),
            )}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        if (data.getActFund()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Fund));
        }
    }
    {
        if (data.getActCoId() != null) {
            actTextArray.push(`CO`);
        }
    }
    {
        if (data.getActCoEnergy()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoEnergy));
        }
    }
    {
        if (data.getActAliveState()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState));
        }
    }
    {
        if (data.getActIsSkipTurn()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.SkipATurn));
        }
    }
    {
        if (data.getActCoUsingSkillType()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType));
        }
    }
    {
        if (data.getActActivateCoSkillType()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TriggerCoSkillType));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0255,
        Lang_Utils.getText(Lang_Constants.TextType.Players),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_Constants.TextType.Players),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetPlayerStateSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
        if (filter != null) {
            if (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
            }
            if (data.getConTileComparator() == null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
            }
        }
    }
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
        const act = data.getActFund();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Fund));
        }
    }
    {
        const act = data.getActCoId();
        if ((act != null)                           &&
            (gameConfig.getCoBasicCfg(act) == null)
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, `CO`);
        }
    }
    {
        const act = data.getActCoEnergy();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CoEnergy));
        }
    }
    {
        const act = data.getActAliveState();
        if ((act != null)                                       &&
            (!Players_Utils_Common.checkIsValidAliveStateId(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsSkipTurn();
    }
    {
        const act = data.getActCoUsingSkillType();
        if ((act != null)                                       &&
            (!CoSkills_Utils_Common.checkIsValidSkillTypeId(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType));
        }
    }
    {
        const act = data.getActActivateCoSkillType();
        if ((act != null)                                       &&
            (!CoSkills_Utils_Common.checkIsValidSkillTypeId(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TriggerCoSkillType));
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
        return Lang_Utils.getText(Lang_Constants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetPlayerStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetPlayerStateSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetPlayerArray: Players_IPlayer.IPlayer[] = [];
    {
        const getAllTiles       = Helpers_Misc.createLazyFunc(() => war.getTileMap().getAllTiles());
        const getAllUnits       = Helpers_Misc.createLazyFunc(() => war.getUnitMap().getAllUnits());
        const conPlayerFilter   = action.getConPlayerFilter();
        const conTileFilter     = action.getConTileFilter();
        const conTileComparator = action.getConTileComparator();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            if ((conPlayerFilter != null) && (!Players_Utils_Filter.checkIsMeet(conPlayerFilter, player))) {
                continue;
            }

            if (conTileComparator != null) {
                const playerIndex   = player.getPlayerIndex();
                let count           = 0;
                for (const tile of getAllTiles()) {
                    if (
                        (tile.getPlayerIndex() === playerIndex)                                                 &&
                        ((conTileFilter == null) || (Tiles_Utils_Filter.checkIsMeet(conTileFilter, tile)))
                    ) {
                        ++count;
                    }
                }
                if (!ValueAndComparators_Utils.checkIsMeet(conTileComparator, count)) {
                    continue;
                }
            }

            if (conUnitComparator != null) {
                const playerIndex   = player.getPlayerIndex();
                let count           = 0;
                for (const unit of getAllUnits()) {
                    if (
                        (unit.getPlayerIndex() === playerIndex)                                                 &&
                        ((conUnitFilter == null) || (Units_Utils_Filter.checkIsMeet(conUnitFilter, unit)))
                    ) {
                        ++count;
                    }
                }
                if (!ValueAndComparators_Utils.checkIsMeet(conUnitComparator, count)) {
                    continue;
                }
            }

            targetPlayerArray.push(player);
        }

        if (!targetPlayerArray.length) {
            return;
        }
    }

    const dataArray: AuxiliaryTypes_PlayerDataForWeaSetPlayerState.PlayerDataForWeaSetPlayerState[] = [];
    {
        for (const player of targetPlayerArray) {
            dataArray.push(new AuxiliaryTypes_PlayerDataForWeaSetPlayerState.PlayerDataForWeaSetPlayerState({
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

function evalActFund(action: WeaSetPlayerStateSimple, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActFund();
    if (act == null) {
        return null;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Players_Constants.Fund.MinFund,
        maxValue : Players_Constants.Fund.MaxFund,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, player.getFund()),
    });
}

function evalActCoId(action: WeaSetPlayerStateSimple): number | null {
    const act = action.getActCoId();
    if (act == null) {
        return null;
    }

    return act;
}

function evalActCoEnergy(action: WeaSetPlayerStateSimple, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActCoEnergy();
    if (act == null) {
        return null;
    }

    return Cos_Utils.getValidEnergy(MultiplierAndOffsets_Utils.getResultValue(act, player.getCoCurrentEnergy()));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActAliveState(action: WeaSetPlayerStateSimple, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActAliveState();
    if (act == null) {
        return null;
    }

    return act;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActIsSkipTurn(action: WeaSetPlayerStateSimple, player: Players_IPlayer.IPlayer): boolean | null {
    const act = action.getActIsSkipTurn();
    if (act == null) {
        return null;
    }

    return act;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActCoUsingSkillType(action: WeaSetPlayerStateSimple, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActCoUsingSkillType();
    if (act == null) {
        return null;
    }

    return act;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evalActActivateCoSkillType(action: WeaSetPlayerStateSimple, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActActivateCoSkillType();
    if (act == null) {
        return null;
    }

    return act;
}
