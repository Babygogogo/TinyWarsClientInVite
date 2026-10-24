import * as ArrayModifiersUtils from "../../../arrayModifiers/Utils.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as LocationsConstants from "../../../locations/Constants.ts";
import * as LocationsUtils from "../../../locations/Utils.ts";
import * as MultiplierAndOffsetsUtils from "../../../multiplierAndOffsets/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateSimple.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UnitsUtilsCustomName from "../../../units/utils/CustomName.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WeightedGridIndexesUtils from "../../../weightedGridIndexes/Utils.ts";

type PlayerFilter                       = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileFilter                         = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type WeaSetUnitStateSimple              = ProtoSchemaCommonProtoWarEventWeaSetUnitStateSimple.WeaSetUnitStateSimple;
type Undefinable<T>                     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IPlayer                            = PlayersIPlayer.IPlayer;
type IUnit                              = UnitsIUnit.IUnit;
type ITile                              = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitStateSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActHp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ActionState));
        }
    }
    {
        const act = data.getActIsCoOnboard();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoOnboard));
        }
    }
    {
        const act = data.getActIsDiving();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.IsDived));
        }
    }
    {
        const act = data.getActAiMode();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0254,
        LangUtils.getText(LangConstants.TextType.Units),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActHp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ActionState));
        }
    }
    {
        const act = data.getActIsCoOnboard();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoOnboard));
        }
    }
    {
        const act = data.getActIsDiving();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.IsDived));
        }
    }
    {
        const act = data.getActAiMode();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0255,
        LangUtils.getText(LangConstants.TextType.Units),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.Units),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetUnitStateSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
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
        const act = data.getActHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Hp));
        }
    }
    {
        const act = data.getActFuel();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Fuel));
        }
    }
    {
        const act = data.getActPriAmmo();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo));
        }
    }
    {
        const act = data.getActPromotion();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Promotion));
        }
    }
    {
        const act = data.getActFlareAmmo();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActBuildMaterial();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.BuildMaterial));
        }
    }
    {
        const act = data.getActProduceMaterial();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ProductionMaterial));
        }
    }
    {
        const act = data.getActActionState();
        if ((act != null)                                       &&
            (!UnitsUtilsCommon.checkIsValidActionStateId(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ActionState));
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
            (!UnitsUtilsCommon.checkIsValidAiModeId(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AiMode));
        }
    }
    {
        const act = data.getActTagIdArray();
        if ((act != null)                                                                                   &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(UnitsConstants.AllTagIdArray)))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Tags));
        }
    }
    {
        const act = data.getActForbiddenLocationIdArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(LocationsConstants.AllLocationIdArray)))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.NoEntryLocations));
        }
    }
    {
        const act = data.getActAiWeightedDestination();
        if ((act != null)                                               &&
            (!WeightedGridIndexesUtils.checkIsValid(act, mapSize))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AiDestination));
        }
    }
    {
        const act = data.getActCustomNameId();
        if ((act != null)                                           &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CustomNameId));
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
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitStateSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
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
            if ((conUnitFilter != null) && (!UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))) {
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
                observerTeamIndexesDict.set(gridId, VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
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
                        warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                            unitType                    : unit.getUnitType(),
                            dstPlayerIndex              : unit.getPlayerIndex(),
                            unitGain                    : 0,
                            unitLoss                    : 0,
                            normalizedHpGain            : offsetHp > 0 ? offsetHp : 0,
                            normalizedHpLoss            : offsetHp < 0 ? -offsetHp : 0,
                            groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                        }));
                    }
                }
            }
        }
    }
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<ITile, boolean>, filter: TileFilter, tile: ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, TilesUtilsFilter.checkIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
function createNewUnitData(action: WeaSetUnitStateSimple, unit: IUnit): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit {
    const data = unit.serialize();

    {
        const act           = action.getActHp();
        const currentValue  = unit.getCurrentHp();
        data.setCurrentHp((act == null)
            ? currentValue
            : NumbersUtils.getValueInRange({
                minValue    : 1,
                maxValue    : unit.getMaxHp(),
                rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, currentValue),
            })
        );
    }
    {
        const act           = action.getActFuel();
        const currentValue  = unit.getCurrentFuel();
        data.setCurrentFuel((act == null)
            ? currentValue
            : NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxFuel(),
                rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, currentValue),
            })
        );
    }
    {
        const act                       = action.getActPriAmmo();
        const currentValue              = unit.getPrimaryWeaponCurrentAmmo();
        data.setPrimaryWeaponCurrentAmmo(((act == null) || (currentValue == null))
            ? currentValue
            : NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getPrimaryWeaponMaxAmmo() ?? 0,
                rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, currentValue),
            })
        );
    }
    {
        const act               = action.getActPromotion();
        const currentValue      = unit.getCurrentPromotion();
        data.setCurrentPromotion((act == null)
            ? currentValue
            : NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxPromotion(),
                rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, currentValue),
            })
        );
    }
    {
        const act               = action.getActFlareAmmo();
        const currentValue      = unit.getFlareCurrentAmmo();
        data.setFlareCurrentAmmo(((act == null) || (currentValue == null))
            ? currentValue
            : NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getFlareMaxAmmo() ?? 0,
                rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, currentValue),
            })
        );
    }
    {
        const act                   = action.getActBuildMaterial();
        const currentValue          = unit.getCurrentBuildMaterial();
        data.setCurrentBuildMaterial(((act == null) || (currentValue == null))
            ? currentValue
            : NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxBuildMaterial() ?? 0,
                rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, currentValue),
            })
        );
    }
    {
        const act                   = action.getActProduceMaterial();
        const currentValue          = unit.getCurrentProduceMaterial();
        data.setCurrentProduceMaterial(((act == null) || (currentValue == null))
            ? currentValue
            : NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxProduceMaterial() ?? 0,
                rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, currentValue),
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
            : UnitsUtilsCommon.getEncodedTagId(ArrayModifiersUtils.getResultValue(act, UnitsUtilsCommon.getTagIdList(currentValue, true)))
        );
    }
    {
        const act           = action.getActForbiddenLocationIdArray();
        const currentValue  = unit.getForbiddenGroupedLocationIdArray();
        data.setForbiddenGroupedLocationIdArray((act == null)
            ? currentValue
            : LocationsUtils.encode(ArrayModifiersUtils.getResultValue(act, LocationsUtils.decode(currentValue)))
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

    const value = MultiplierAndOffsetsUtils.getResultValue(act, defaultValue ?? 0);
    return UnitsUtilsCustomName.checkIsValidCustomNameId(value)
        ? value
        : (value < 0 ? null : defaultValue);
}
