import {
    Locations_Constants,
    Units_Constants,
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    Units_Utils_Common,
    ArrayModifiers_Utils,
    Units_Utils_CustomName,
    MultiplierAndOffsets_Utils,
    WeightedGridIndexes_Utils,
    Locations_Utils,
    Helpers_Team,
    Lang_Utils,
    Visibilities_Utils,
    Numbers_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_Tile,
    type Units_Unit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActHp();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ActionState));
        }
    }
    {
        const act = data.getActIsCoOnboard();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoOnboard));
        }
    }
    {
        const act = data.getActIsDiving();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.IsDived));
        }
    }
    {
        const act = data.getActAiMode();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0254,
        Lang_Utils.getText(Lang_Constants.TextType.Units),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${Units_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1422)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1423)}) ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActHp();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ActionState));
        }
    }
    {
        const act = data.getActIsCoOnboard();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoOnboard));
        }
    }
    {
        const act = data.getActIsDiving();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.IsDived));
        }
    }
    {
        const act = data.getActAiMode();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0255,
        Lang_Utils.getText(Lang_Constants.TextType.Units),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_Constants.TextType.Units),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetUnitStateSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
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
        const act = data.getActHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if ((act != null)                                       &&
            (!Units_Utils_Common.checkIsValidActionStateId(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ActionState));
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
            (!Units_Utils_Common.checkIsValidAiModeId(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if ((act != null)                                                                                   &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(Units_Constants.AllTagIdArray)))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(Locations_Constants.AllLocationIdArray)))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if ((act != null)                                               &&
            (!WeightedGridIndexes_Utils.checkIsValid(act, mapSize))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if ((act != null)                                           &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
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
        return Lang_Utils.getText(Lang_Constants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitStateSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const targetUnitArray   : Units_Unit.Unit[] = [];
    {
        const tileMap           = war.getTileMap();
        const conUnitFilter     = data.getConUnitFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        const conTileFilter     = data.getConTileFilter();
        const tileFilterDict    = new Map<Tiles_Tile.Tile, boolean>();
        for (const unit of unitMap.getAllUnits()) {
            if ((conUnitFilter != null) && (!Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))) {
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
                observerTeamIndexesDict.set(gridId, Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
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
                            unitType                   : unit.getUnitType(),
                            dstPlayerIndex             : unit.getPlayerIndex(),
                            unitGain                   : 0,
                            unitLoss                   : 0,
                            normalizedHpGain           : offsetHp > 0 ? offsetHp : 0,
                            normalizedHpLoss           : offsetHp < 0 ? -offsetHp : 0,
                            groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                        }));
                    }
                }
            }
        }
    }
}
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<Tiles_Tile.Tile, boolean>, filter: TileFilter, tile: Tiles_Tile.Tile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, Tiles_Utils_Filter.checkIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
function createNewUnitData(action: WeaSetUnitStateSimple, unit: Units_Unit.Unit): SerialUnit {
    const data = unit.serialize();

    {
        const act           = action.getActHp();
        const currentValue  = unit.getCurrentHp();
        data.setCurrentHp((act == null)
            ? currentValue
            : Numbers_Utils.getValueInRange({
                minValue : 1,
                maxValue : unit.getMaxHp(),
                rawValue : MultiplierAndOffsets_Utils.getResultValue(act, currentValue),
            }),
        );
    }
    {
        const act           = action.getActFuel();
        const currentValue  = unit.getCurrentFuel();
        data.setCurrentFuel((act == null)
            ? currentValue
            : Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxFuel(),
                rawValue : MultiplierAndOffsets_Utils.getResultValue(act, currentValue),
            }),
        );
    }
    {
        const act                       = action.getActPriAmmo();
        const currentValue              = unit.getPrimaryWeaponCurrentAmmo();
        data.setPrimaryWeaponCurrentAmmo(((act == null) || (currentValue == null))
            ? currentValue
            : Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getPrimaryWeaponMaxAmmo() ?? 0,
                rawValue : MultiplierAndOffsets_Utils.getResultValue(act, currentValue),
            }),
        );
    }
    {
        const act               = action.getActPromotion();
        const currentValue      = unit.getCurrentPromotion();
        data.setCurrentPromotion((act == null)
            ? currentValue
            : Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxPromotion(),
                rawValue : MultiplierAndOffsets_Utils.getResultValue(act, currentValue),
            }),
        );
    }
    {
        const act               = action.getActFlareAmmo();
        const currentValue      = unit.getFlareCurrentAmmo();
        data.setFlareCurrentAmmo(((act == null) || (currentValue == null))
            ? currentValue
            : Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getFlareMaxAmmo() ?? 0,
                rawValue : MultiplierAndOffsets_Utils.getResultValue(act, currentValue),
            }),
        );
    }
    {
        const act                   = action.getActBuildMaterial();
        const currentValue          = unit.getCurrentBuildMaterial();
        data.setCurrentBuildMaterial(((act == null) || (currentValue == null))
            ? currentValue
            : Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxBuildMaterial() ?? 0,
                rawValue : MultiplierAndOffsets_Utils.getResultValue(act, currentValue),
            }),
        );
    }
    {
        const act                   = action.getActProduceMaterial();
        const currentValue          = unit.getCurrentProduceMaterial();
        data.setCurrentProduceMaterial(((act == null) || (currentValue == null))
            ? currentValue
            : Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxProduceMaterial() ?? 0,
                rawValue : MultiplierAndOffsets_Utils.getResultValue(act, currentValue),
            }),
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
            : Units_Utils_Common.getEncodedTagId(ArrayModifiers_Utils.getResultValue(act, Units_Utils_Common.getTagIdList(currentValue, true))),
        );
    }
    {
        const act           = action.getActForbiddenLocationIdArray();
        const currentValue  = unit.getForbiddenGroupedLocationIdArray();
        data.setForbiddenGroupedLocationIdArray((act == null)
            ? currentValue
            : Locations_Utils.encode(ArrayModifiers_Utils.getResultValue(act, Locations_Utils.decode(currentValue))),
        );
    }
    {
        const act                   = action.getActAiWeightedDestination();
        const currentValue          = unit.getAiWeightedDestination();
        data.setAiWeightedDestination(((act == null) || (currentValue == null))
            ? currentValue?.toProto()
            : act,
        );
    }
    data.setCustomNameId(evalActCustomNameId(action, unit));

    return data;
}
function evalActCustomNameId(action: WeaSetUnitStateSimple, unit: Units_Unit.Unit): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    const defaultValue  = unit.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (act == null) {
        return defaultValue;
    }

    const value = MultiplierAndOffsets_Utils.getResultValue(act, defaultValue ?? 0);
    return Units_Utils_CustomName.checkIsValidCustomNameId(value)
        ? value
        : (value < 0 ? null : defaultValue);
}
