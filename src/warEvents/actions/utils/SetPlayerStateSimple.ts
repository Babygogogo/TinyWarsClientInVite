import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import * as AuxiliaryTypesPlayerDataForWeaSetPlayerState from "../../../auxiliaryTypes/PlayerDataForWeaSetPlayerState.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CosUtils from "../../../cos/Utils.ts";
import * as CoSkillsUtilsCommon from "../../../coSkills/utils/Common.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as MultiplierAndOffsetsUtils from "../../../multiplierAndOffsets/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsCommon from "../../../players/utils/Common.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateSimple.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WeaSetPlayerStateSimple            = ProtoSchemaCommonProtoWarEventWeaSetPlayerStateSimple.WeaSetPlayerStateSimple;
type IPlayer                            = PlayersIPlayer.IPlayer;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetPlayerStateSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetPlayerStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        if (data.getActFund()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Fund));
        }
    }
    {
        if (data.getActCoId() != null) {
            actTextArray.push(`CO`);
        }
    }
    {
        if (data.getActCoEnergy()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoEnergy));
        }
    }
    {
        if (data.getActAliveState()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.PlayerAliveState));
        }
    }
    {
        if (data.getActIsSkipTurn()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.SkipATurn));
        }
    }
    {
        if (data.getActCoUsingSkillType()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType));
        }
    }
    {
        if (data.getActActivateCoSkillType()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TriggerCoSkillType));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0254,
        LangUtils.getText(LangConstants.TextType.Players),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetPlayerStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConTileComparator();
        if (comparator != null) {
            conTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                comparator,
                LangUtils.getText(data.getConTileFilter() == null ? LangConstants.TextType.B1406 : LangConstants.TextType.B1407)
            )}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            conTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                comparator,
                LangUtils.getText(data.getConUnitFilter() == null ? LangConstants.TextType.B1404 : LangConstants.TextType.B1405)
            )}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        if (data.getActFund()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Fund));
        }
    }
    {
        if (data.getActCoId() != null) {
            actTextArray.push(`CO`);
        }
    }
    {
        if (data.getActCoEnergy()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoEnergy));
        }
    }
    {
        if (data.getActAliveState()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.PlayerAliveState));
        }
    }
    {
        if (data.getActIsSkipTurn()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.SkipATurn));
        }
    }
    {
        if (data.getActCoUsingSkillType()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType));
        }
    }
    {
        if (data.getActActivateCoSkillType()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TriggerCoSkillType));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0255,
        LangUtils.getText(LangConstants.TextType.Players),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.Players),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetPlayerStateSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
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
        if (filter != null) {
            if (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
            }
            if (data.getConTileComparator() == null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
            }
        }
    }
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
        const act = data.getActFund();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Fund));
        }
    }
    {
        const act = data.getActCoId();
        if ((act != null)                           &&
            (gameConfig.getCoBasicCfg(act) == null)
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, `CO`);
        }
    }
    {
        const act = data.getActCoEnergy();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CoEnergy));
        }
    }
    {
        const act = data.getActAliveState();
        if ((act != null)                                       &&
            (!PlayersUtilsCommon.checkIsValidAliveStateId(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerAliveState));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsSkipTurn();
    }
    {
        const act = data.getActCoUsingSkillType();
        if ((act != null)                                       &&
            (!CoSkillsUtilsCommon.checkIsValidSkillTypeId(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType));
        }
    }
    {
        const act = data.getActActivateCoSkillType();
        if ((act != null)                                       &&
            (!CoSkillsUtilsCommon.checkIsValidSkillTypeId(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TriggerCoSkillType));
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
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetPlayerStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetPlayerStateSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetPlayerArray: IPlayer[] = [];
    {
        const getAllTiles       = HelpersMisc.createLazyFunc(() => war.getTileMap().getAllTiles());
        const getAllUnits       = HelpersMisc.createLazyFunc(() => war.getUnitMap().getAllUnits());
        const conPlayerFilter   = action.getConPlayerFilter();
        const conTileFilter     = action.getConTileFilter();
        const conTileComparator = action.getConTileComparator();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            if ((conPlayerFilter != null) && (!PlayersUtilsFilter.checkIsMeet(conPlayerFilter, player))) {
                continue;
            }

            if (conTileComparator != null) {
                const playerIndex   = player.getPlayerIndex();
                let count           = 0;
                for (const tile of getAllTiles()) {
                    if (
                        (tile.getPlayerIndex() === playerIndex)                                                 &&
                        ((conTileFilter == null) || (TilesUtilsFilter.checkIsMeet(conTileFilter, tile)))
                    ) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtils.checkIsMeet(conTileComparator, count)) {
                    continue;
                }
            }

            if (conUnitComparator != null) {
                const playerIndex   = player.getPlayerIndex();
                let count           = 0;
                for (const unit of getAllUnits()) {
                    if (
                        (unit.getPlayerIndex() === playerIndex)                                                 &&
                        ((conUnitFilter == null) || (UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit)))
                    ) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtils.checkIsMeet(conUnitComparator, count)) {
                    continue;
                }
            }

            targetPlayerArray.push(player);
        }

        if (!targetPlayerArray.length) {
            return;
        }
    }

    const dataArray: AuxiliaryTypesPlayerDataForWeaSetPlayerState.PlayerDataForWeaSetPlayerState[] = [];
    {
        for (const player of targetPlayerArray) {
            dataArray.push(new AuxiliaryTypesPlayerDataForWeaSetPlayerState.PlayerDataForWeaSetPlayerState({
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

    return NumbersUtils.getValueInRange({
        minValue    : PlayersConstants.Fund.MinFund,
        maxValue    : PlayersConstants.Fund.MaxFund,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, player.getFund()),
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

    return CosUtils.getValidEnergy(MultiplierAndOffsetsUtils.getResultValue(act, player.getCoCurrentEnergy()));
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
