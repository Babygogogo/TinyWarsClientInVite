import { checkIsValid as ArrayModifiersUtilsCheckIsValid, getResultValue } from "../../../arrayModifiers/Utils.ts";
import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText } from "../../../lang/Utils.ts";
import { AllLocationIdArray } from "../../../locations/Constants.ts";
import { encode, decode } from "../../../locations/Utils.ts";
import {
    checkIsValid as MultiplierAndOffsetsUtilsCheckIsValid,
    getResultValue as MultiplierAndOffsetsUtilsGetResultValue,
} from "../../../multiplierAndOffsets/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import { AllTagIdArray } from "../../../units/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { checkIsValidActionStateId, checkIsValidAiModeId, getEncodedTagId, getTagIdList } from "../../../units/utils/Common.ts";
import { checkIsValidCustomNameId } from "../../../units/utils/CustomName.ts";
import {
    getDescForEmbed as UnitsUtilsFilterGetDescForEmbed,
    checkIsValid as UnitsUtilsFilterCheckIsValid,
    checkIsMeet as UnitsUtilsFilterCheckIsMeet,
} from "../../../units/utils/Filter.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { checkIsValid as WeightedGridIndexesUtilsCheckIsValid } from "../../../weightedGridIndexes/Utils.ts";

export function checkIsValid(data: Undefinable<WeaSetUnitStateSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetUnitStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActHp();
        if (act != null) {
            actTextArray.push(getText(TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if (act != null) {
            actTextArray.push(getText(TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if (act != null) {
            actTextArray.push(getText(TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if (act != null) {
            actTextArray.push(getText(TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if (act != null) {
            actTextArray.push(getText(TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if (act != null) {
            actTextArray.push(getText(TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if (act != null) {
            actTextArray.push(getText(TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if (act != null) {
            actTextArray.push(getText(TextType.ActionState));
        }
    }
    {
        const act = data.getActIsCoOnboard();
        if (act != null) {
            actTextArray.push(getText(TextType.CoOnboard));
        }
    }
    {
        const act = data.getActIsDiving();
        if (act != null) {
            actTextArray.push(getText(TextType.IsDived));
        }
    }
    {
        const act = data.getActAiMode();
        if (act != null) {
            actTextArray.push(getText(TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if (act != null) {
            actTextArray.push(getText(TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if (act != null) {
            actTextArray.push(getText(TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if (act != null) {
            actTextArray.push(getText(TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(getText(TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0254,
        getText(TextType.Units),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: Undefinable<WeaSetUnitStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${UnitsUtilsFilterGetDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1422)}) ${getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1423)}) ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActHp();
        if (act != null) {
            actTextArray.push(getText(TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if (act != null) {
            actTextArray.push(getText(TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if (act != null) {
            actTextArray.push(getText(TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if (act != null) {
            actTextArray.push(getText(TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if (act != null) {
            actTextArray.push(getText(TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if (act != null) {
            actTextArray.push(getText(TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if (act != null) {
            actTextArray.push(getText(TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if (act != null) {
            actTextArray.push(getText(TextType.ActionState));
        }
    }
    {
        const act = data.getActIsCoOnboard();
        if (act != null) {
            actTextArray.push(getText(TextType.CoOnboard));
        }
    }
    {
        const act = data.getActIsDiving();
        if (act != null) {
            actTextArray.push(getText(TextType.IsDived));
        }
    }
    {
        const act = data.getActAiMode();
        if (act != null) {
            actTextArray.push(getText(TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if (act != null) {
            actTextArray.push(getText(TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if (act != null) {
            actTextArray.push(getText(TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if (act != null) {
            actTextArray.push(getText(TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(getText(TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0255,
        getText(TextType.Units),
        conTextArray.join(`\n`),
        getText(TextType.Units),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetUnitStateSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
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
        const act = data.getActHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if ((act != null)                                       &&
            (!checkIsValidActionStateId(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.ActionState));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsCoOnboard();
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsDiving();
    }
    {
        const act = data.getActAiMode();
        if ((act != null)                                   &&
            (!checkIsValidAiModeId(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if ((act != null)                                                                                   &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(AllTagIdArray)))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(AllLocationIdArray)))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if ((act != null)                                               &&
            (!WeightedGridIndexesUtilsCheckIsValid(act, mapSize))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if ((act != null)                                           &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.CustomNameId));
        }
    }

    if ((data.getActHp() == null)                        &&
        (data.getActFuel() == null)                      &&
        (data.getActPriAmmo() == null)                   &&
        (data.getActPromotion() == null)                 &&
        (data.getActFlareAmmo() == null)                 &&
        (data.getActBuildMaterial() == null)             &&
        (data.getActProduceMaterial() == null)           &&
        (data.getActActionState() == null)               &&
        (data.getActIsCoOnboard() == null)               &&
        (data.getActIsDiving() == null)                  &&
        (data.getActAiMode() == null)                    &&
        (data.getActTagIdArray() == null)                &&
        (data.getActForbiddenLocationIdArray() == null)  &&
        (data.getActAiWeightedDestination() == null)     &&
        (data.getActCustomNameId() == null)
    ) {
        return getText(TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitStateSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const targetUnitArray   : IUnit[] = [];
    {
        const tileMap           = war.getTileMap();
        const conUnitFilter     = data.getConUnitFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        const conTileFilter     = data.getConTileFilter();
        const tileFilterDict    = new Map<ITile, boolean>();
        for (const unit of unitMap.getAllUnits()) {
            if ((conUnitFilter != null) && (!UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))) {
                continue;
            }

            if ((conTileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, conTileFilter, tileMap.getTile(unit.getGridIndex())))) {
                continue;
            }

            targetUnitArray.push(unit);
        }

        targetUnitArray.sort((v1, v2) => v1.getUnitId() - v2.getUnitId());

        if (!targetUnitArray.length) {
            return;
        }
    }

    {
        const mapSize                   = unitMap.getMapSize();
        const observerTeamIndexesDict   = new Map<number, number[] | null>();
        for (const unit of targetUnitArray) {
            const gridIndex   = unit.getGridIndex();
            const gridId      = gridIndex.getGridId(mapSize);
            if (!observerTeamIndexesDict.has(gridId)) {
                observerTeamIndexesDict.set(gridId, getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
            }
        }

        const gameConfig            = war.getGcData();
        const warStatisticsManager  = war.getWarStatisticsManager();
        const isLoadedUnitVisible   = true;

        for (const unit of targetUnitArray) {
            const normalizedHp = unit.getNormalizedCurrentHp();

            {
                const unitData = createNewUnitData(data, unit);
                unit.init(unitData, gameConfig);
                unit.startRunning(war);
                // unit.startRunningView();
                (!isFastExecute) && (unit.updateView());
            }

            {
                const offsetHp = unit.getNormalizedCurrentHp() - normalizedHp;
                if ((offsetHp !== 0)                                            &&
                    ((isLoadedUnitVisible) || (unit.getLoaderUnitId() == null))
                ) {
                    const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
                    if (observerTeamIndexes != null) {
                        warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                            unitType                    : unit.getUnitType(),
                            dstPlayerIndex              : unit.getPlayerIndex(),
                            unitGain                    : 0,
                            unitLoss                    : 0,
                            normalizedHpGain            : offsetHp > 0 ? offsetHp : 0,
                            normalizedHpLoss            : offsetHp < 0 ? -offsetHp : 0,
                            groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                        }));
                    }
                }
            }
        }
    }
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<ITile, boolean>, filter: TileFilter, tile: ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, TilesUtilsFilterCheckIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
function createNewUnitData(action: WeaSetUnitStateSimple, unit: IUnit): SerialUnit {
    const data = unit.serialize();

    {
        const act           = action.getActHp();
        const currentValue  = unit.getCurrentHp();
        data.setCurrentHp((act == null)
            ? currentValue
            : getValueInRange({
                minValue    : 1,
                maxValue    : unit.getMaxHp(),
                rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, currentValue),
            })
        );
    }
    {
        const act           = action.getActFuel();
        const currentValue  = unit.getCurrentFuel();
        data.setCurrentFuel((act == null)
            ? currentValue
            : getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxFuel(),
                rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, currentValue),
            })
        );
    }
    {
        const act                       = action.getActPriAmmo();
        const currentValue              = unit.getPrimaryWeaponCurrentAmmo();
        data.setPrimaryWeaponCurrentAmmo(((act == null) || (currentValue == null))
            ? currentValue
            : getValueInRange({
                minValue    : 0,
                maxValue    : unit.getPrimaryWeaponMaxAmmo() ?? 0,
                rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, currentValue),
            })
        );
    }
    {
        const act               = action.getActPromotion();
        const currentValue      = unit.getCurrentPromotion();
        data.setCurrentPromotion((act == null)
            ? currentValue
            : getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxPromotion(),
                rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, currentValue),
            })
        );
    }
    {
        const act               = action.getActFlareAmmo();
        const currentValue      = unit.getFlareCurrentAmmo();
        data.setFlareCurrentAmmo(((act == null) || (currentValue == null))
            ? currentValue
            : getValueInRange({
                minValue    : 0,
                maxValue    : unit.getFlareMaxAmmo() ?? 0,
                rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, currentValue),
            })
        );
    }
    {
        const act                   = action.getActBuildMaterial();
        const currentValue          = unit.getCurrentBuildMaterial();
        data.setCurrentBuildMaterial(((act == null) || (currentValue == null))
            ? currentValue
            : getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxBuildMaterial() ?? 0,
                rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, currentValue),
            })
        );
    }
    {
        const act                   = action.getActProduceMaterial();
        const currentValue          = unit.getCurrentProduceMaterial();
        data.setCurrentProduceMaterial(((act == null) || (currentValue == null))
            ? currentValue
            : getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxProduceMaterial() ?? 0,
                rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, currentValue),
            })
        );
    }
    {
        const act           = action.getActActionState();
        data.setActionState(act == null ? unit.getActionState() : act);
    }
    {
        const act           = action.getActIsCoOnboard();
        data.setIsCoOnboard(act == null ? unit.getIsCoOnboard() : act);
    }
    {
        const act           = action.getActIsDiving();
        data.setIsDiving(((act == null) || (!unit.checkIsDiver())) ? unit.getIsDiving() : act);
    }
    {
        const act   = action.getActAiMode();
        data.setAiMode(act == null ? unit.getAiMode() : act);
    }
    {
        const act           = action.getActTagIdArray();
        const currentValue  = unit.getGroupedTagId();
        data.setGroupedTagId(act == null
            ? currentValue
            : getEncodedTagId(getResultValue(act, getTagIdList(currentValue, true)))
        );
    }
    {
        const act           = action.getActForbiddenLocationIdArray();
        const currentValue  = unit.getForbiddenGroupedLocationIdArray();
        data.setForbiddenGroupedLocationIdArray((act == null)
            ? currentValue
            : encode(getResultValue(act, decode(currentValue)))
        );
    }
    {
        const act                   = action.getActAiWeightedDestination();
        const currentValue          = unit.getAiWeightedDestination();
        data.setAiWeightedDestination(((act == null) || (currentValue == null))
            ? currentValue?.toProto()
            : act
        );
    }
    data.setCustomNameId(evalActCustomNameId(action, unit));

    return data;
}
function evalActCustomNameId(action: WeaSetUnitStateSimple, unit: IUnit): Undefinable<number> {
    const defaultValue  = unit.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (act == null) {
        return defaultValue;
    }

    const value = MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue ?? 0);
    return checkIsValidCustomNameId(value)
        ? value
        : (value < 0 ? null : defaultValue);
}
