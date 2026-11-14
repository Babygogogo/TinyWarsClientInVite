import {
    AuxiliaryTypes_AuxiliaryTypes,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    HalfwayReplayWar_Model_HrwWar,
    Helpers_Misc,
    Helpers_Team,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    Players_Player,
    ReplayWar_Model_RwWar,
    SinglePlayerWars_War,
    Sounds_Constants,
    Sounds_SoundPlayer,
    TestWar_Model_TwWar,
    TileBuffs_Constants,
    Units_Constants,
    Units_Unit,
    Units_Utils_Common,
    Units_Utils_Serialization,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_MapSize,
    type BaseWar_Model_War,
    type GameConfigs_GameConfig,
} from "../../../internal.ts";

import { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoPlayerProduceUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerProduceUnit(war, action);
    } else {
        await normalExePlayerProduceUnit(war, action);
    }
}

function fastExePlayerProduceUnit(war: BaseWar_Model_War.War, action: WoPlayerProduceUnit): void {
    handlePlayerProduceUnit(war, action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}
function normalExePlayerProduceUnit(war: BaseWar_Model_War.War, action: WoPlayerProduceUnit): void {
    // const desc = await war.getDescForExePlayerProduceUnit(action);
    // (desc) && (FloatText.show(desc));

    handlePlayerProduceUnit(war, action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

function handlePlayerProduceUnit(war: BaseWar_Model_War.War, action: WoPlayerProduceUnit, isFastExecute: boolean): void {
    const extraData = action.getExtraData();
    if (extraData) {
        const commonExtraData = Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_HandlePlayerProduceUnit_00);
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : true,
        });

        if (!isFastExecute) {
            if (commonExtraData.getUnitArrayAfterAction()?.length) {
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.UnitProduction);
            }
        }

    } else {
        const unitMap           = war.getUnitMap();
        const unitId            = unitMap.getNextUnitId();
        const tileGridIndex     = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getGridIndex()));
        const unitType          = Helpers_Misc.getExisted(action.getUnitType());
        const unitHp            = Helpers_Misc.getExisted(action.getUnitHp());
        const gameConfig        = war.getGcData();
        const playerInTurn      = war.getPlayerInTurn();
        const playerIndex       = playerInTurn.getPlayerIndex();
        const tileMap           = war.getTileMap();
        const skillCfg          = tileMap.getTile(tileGridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitTemplateCfg   = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType));
        const cfgCost           = unitTemplateCfg.getProductionCost();
        const cost              = Math.floor(
            cfgCost
            * (skillCfg ? (skillCfg.getCostMultiplierPct()) : 100)
            * Units_Utils_Common.getNormalizedHp(unitHp)
            * playerInTurn.getUnitCostModifier(unitType)
            / 100
            / Units_Constants.Hp.Normalizer,
        );

        const unitData = Units_Utils_Serialization.create({
            unitType    : unitType,
            unitId      : unitId,
            playerIndex : playerIndex,
            gridIndex   : tileGridIndex.toProto().toJson(),

            actionState  : skillCfg?.getUnitActionStateId() ?? Units_Constants.ActionStateId.Acted,
            currentHp    : unitHp,
            aiMode       : null,
            groupedTagId : null,
            customNameId : null,

            currentPromotion     : getPromotionForPlayerProduceUnit(war, tileGridIndex, unitType),
            isDiving             : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
            isCoOnboard          : null,
            currentBuildMaterial : unitTemplateCfg.getMaxBuildMaterial() ?? null,

            aiWeightedDestination           : null,
            forbiddenGroupedLocationIdArray : [],
            buffArray                       : [],

            primaryWeaponCurrentAmmo : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? null,
            flareCurrentAmmo         : unitTemplateCfg.getFlareMaxAmmo() ?? null,
            currentProduceMaterial   : unitTemplateCfg.getMaxProduceMaterial() ?? null,
            currentFuel              : unitTemplateCfg.getMaxFuel(),
            loaderUnitId             : null,
        });
        for (const skillId of playerInTurn.getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfUnitTeleportAfterProduction();
            if (cfg == null) {
                continue;
            }

            const unitCategoryId = cfg.getUnitCategoryId();
            if ((unitCategoryId == null) || (gameConfig.checkIsUnitTypeInCategory(unitType, unitCategoryId))) {
                tileMap.getTile(tileGridIndex).addUnfixedBuff(TileBuff.fromJson({
                    buffTypeId          : TileBuffs_Constants.BuffTypeId.NoProduction,
                    expiringTurnIndex   : war.getTurnManager().getTurnIndex() + 1,
                    expiringPlayerIndex : playerIndex,
                    extraParamArray     : [],
                }), !isFastExecute);

                const maxCount = cfg.getConMaxCountOfNoProductionBuilding();
                if ((maxCount == null)                                                                                                                                                  ||
                    (tileMap.getTilesCount(v => (v.getPlayerIndex() == playerIndex) && (v.checkHasUnfixedBuff(TileBuffs_Constants.BuffTypeId.NoProduction))) <= maxCount)
                ) {
                    const destination = getTeleportDestinationForPlayerProduceUnit(war, playerInTurn, unitType, tileGridIndex, cfg.getConCoUnitActionStateId() ?? null);
                    if (destination != null) {
                        unitData.setGridIndex(destination.toProto());

                        const actionState = cfg.getUnitActionStateId();
                        if (actionState != null) {
                            unitData.setActionState(actionState);
                        }
                    }
                }

                break;
            }
        }

        const unit = new Units_Unit.Unit(true);
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        unit.flushDataToView();
        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - cost);

        {
            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : unitType,
                    dstPlayerIndex             : playerIndex,
                    normalizedHpGain           : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss           : 0,
                    unitGain                   : 1,
                    unitLoss                   : 0,
                    groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                }));
            }

            if (!isFastExecute) {
                if ((observerTeamIndexes?.length) &&
                    (war.getPlayerManager().getAllPlayers(false).some(v => (v.getUserId() != null) && (observerTeamIndexes.indexOf(v.getTeamIndex()) >= 0)))
                ) {
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.UnitProduction);
                }
            }
        }
    }
}

function getPromotionForPlayerProduceUnit(war: BaseWar_Model_War.War, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, unitType: number): number {
    const player                    = war.getPlayerInTurn();
    const coZoneRadius              = player.getCoZoneRadius();
    const gameConfig                = war.getGcData();
    const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => player.getCoGridIndexListOnMap());
    let promotion                   = 0;
    for (const skillId of war.getPlayerInTurn().getCoCurrentSkills()) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfPromotionBonusByProduce();
        if ((cfg)                                                                       &&
            (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId()))   &&
            (gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                coZoneRadius             : coZoneRadius,
            }))
        ) {
            promotion += cfg.getBonus();
        }
    }

    return promotion;
}

function getTeleportDestinationForPlayerProduceUnit(war: BaseWar_Model_War.War, player: Players_Player.Player, unitTypeId: number, tileGridIndex: AuxiliaryTypes_GridIndex.GridIndex, conCoUnitActionStateId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): AuxiliaryTypes_GridIndex.GridIndex | null {
    const tileMap           = war.getTileMap();
    const unitMap           = war.getUnitMap();
    const mapSize           = tileMap.getMapSize();
    const moveTypeId        = Helpers_Misc.getExisted(war.getGcData().getUnitTemplateCfg(unitTypeId)?.getMoveTypeId());
    const checkedGridIdSet  = new Set<number>();
    let destination         : AuxiliaryTypes_GridIndex.GridIndex | null = null;
    for (const coGridIndex of player.getCoGridIndexListOnMap()) {
        if ((conCoUnitActionStateId != null) && (unitMap.getUnitOnMap(coGridIndex)?.getActionState() !== conCoUnitActionStateId)) {
            continue;
        }

        for (const candidate of coGridIndex.getAdjacentGrids(mapSize)) {
            const gridId = candidate.getGridId(mapSize);
            if (checkedGridIdSet.has(gridId)) {
                continue;
            }
            checkedGridIdSet.add(gridId);

            if ((unitMap.getUnitOnMap(candidate) != null)                               ||
                (tileMap.getTile(candidate).getMoveCostByMoveType(moveTypeId) == null)
            ) {
                continue;
            }

            if (destination == null) {
                destination = candidate;
            } else {
                const newDistance = tileGridIndex.getDistance(candidate);
                const oldDistance = tileGridIndex.getDistance(destination);
                if (newDistance > oldDistance) {
                    continue;

                } else if (newDistance < oldDistance) {
                    destination = candidate;

                } else {
                    const compareResult = compareDistanceList(
                        getDistanceList(candidate, mapSize),
                        getDistanceList(destination, mapSize),
                    );
                    if (compareResult > 0) {
                        continue;

                    } else if (compareResult < 0) {
                        destination = candidate;

                    } else {
                        const newX = candidate.getX();
                        const oldX = destination.getX();
                        if (newX > oldX) {
                            continue;

                        } else if (newX < oldX) {
                            destination = candidate;

                        } else {
                            if (candidate.getY() < destination.getY()) {
                                destination = candidate;
                            }
                        }
                    }
                }
            }
        }
    }

    return destination;
}
function getDistanceList(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, mapSize: AuxiliaryTypes_MapSize.MapSize): number[] {
    const x = gridIndex.getX();
    const y = gridIndex.getY();
    return [
        x,
        y,
        mapSize.getWidth() - x,
        mapSize.getHeight() - y,
    ].sort((a, b) => a - b);
}
function compareDistanceList(list1: number[], list2: number[]): number {
    for (let i = 0; i < list1.length; ++i) {
        if (list1[i] < list2[i]) {
            return -1;
        } else if (list1[i] > list2[i]) {
            return 1;
        }
    }
    return 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoPlayerProduceUnit): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const playerInTurn          = war.getPlayerInTurn();
    const gcData                = war.getGcData();
    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const unitType              = Helpers_Misc.getExisted(operation.getUnitType());
    const unitHp                = Helpers_Misc.getExisted(operation.getUnitHp());
    const gridIndex             = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(operation.getGridIndex()));
    const unitTemplateCfg       = Helpers_Misc.getExisted(gcData.getUnitTemplateCfg(unitType));
    const playerIndexInTurn     = playerInTurn.getPlayerIndex();
    const tile                  = tileMap.getTile(gridIndex);
    const productionSkillCfg    = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
    const finalCost             = Math.floor(
        unitTemplateCfg.getProductionCost()                 *
        (productionSkillCfg?.getCostMultiplierPct() ?? 100) *
        Units_Utils_Common.getNormalizedHp(unitHp)          *
        playerInTurn.getUnitCostModifier(unitType)          /
        100                                                 /
        Units_Constants.Hp.MaxNormalizedHp,
    );

    const unitData = SerialUnit.fromJson({
        unitType    : unitType,
        unitId      : unitMap.getNextUnitId(),
        playerIndex : playerIndexInTurn,
        gridIndex   : gridIndex.toProto().toJson(),

        actionState  : productionSkillCfg?.getUnitActionStateId() ?? Units_Constants.ActionStateId.Acted,
        currentHp    : unitHp,
        aiMode       : 0,
        groupedTagId : 0,
        customNameId : null,

        currentPromotion     : getPromotionForPlayerProduceUnit(war, gridIndex, unitType),
        isDiving             : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? false,
        isCoOnboard          : false,
        currentBuildMaterial : unitTemplateCfg.getMaxBuildMaterial() ?? 0,

        aiWeightedDestination           : null,
        forbiddenGroupedLocationIdArray : [],
        buffArray                       : [],

        primaryWeaponCurrentAmmo : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? 0,
        flareCurrentAmmo         : unitTemplateCfg.getFlareMaxAmmo()         ?? 0,
        currentProduceMaterial   : unitTemplateCfg.getMaxProduceMaterial()   ?? 0,
        currentFuel              : unitTemplateCfg.getMaxFuel(),
        loaderUnitId             : null,
    });

    const allTileAppearanceInfosBeforeAction    = tileMap.generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const changedThings                        = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    for (const skillId of playerInTurn.getCoCurrentSkills()) {
        const cfg               = gcData.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfUnitTeleportAfterProduction();
        const unitCategoryId    = cfg?.getUnitCategoryId();
        if ((cfg)                            &&
            ((unitCategoryId == null) || (gcData.checkIsUnitTypeInCategory(unitType, unitCategoryId)))
        ) {
            const buff = new TileBuff();
            buff.setBuffTypeId(TileBuffs_Constants.BuffTypeId.NoProduction);
            buff.setExpiringTurnIndex(war.getTurnManager().getTurnIndex() + 1);
            buff.setExpiringPlayerIndex(playerIndexInTurn);

            tile.addUnfixedBuff(buff, false);
            changedThings.addTile(tile);

            const maxCount = cfg.getConMaxCountOfNoProductionBuilding();
            if ((maxCount == null)                                                                                                                                          ||
                (tileMap.getTilesCount(v => (v.getPlayerIndex() == playerIndexInTurn) && (v.checkHasUnfixedBuff(TileBuffs_Constants.BuffTypeId.NoProduction))) <= maxCount)
            ) {
                const destination = getTeleportDestinationForPlayerProduceUnit(war, playerInTurn, unitType, gridIndex, cfg.getConCoUnitActionStateId());
                if (destination) {
                    unitData.setGridIndex(destination.toProto());

                    const unitActionStateId = cfg.getUnitActionStateId();
                    if (unitActionStateId != null) {
                        unitData.setActionState(unitActionStateId);
                    }
                }
            }

            break;
        }
    }

    const unit = new Units_Unit.Unit(false);
    unit.init(unitData, gcData);
    unit.startRunning(war);
    unitMap.setNextUnitId(unitData.getUnitId() + 1);
    unitMap.setUnitOnMap(unit);
    playerInTurn.setFund(playerInTurn.getFund() - finalCost);

    {
        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({
            war       : war,
            gridIndex : unit.getGridIndex(),
        });
        if (observerTeamIndexes) {
            war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                   : unitType,
                dstPlayerIndex             : unit.getPlayerIndex(),
                normalizedHpGain           : unit.getNormalizedCurrentHp(),
                normalizedHpLoss           : 0,
                unitGain                   : 1,
                unitLoss                   : 0,
                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
            }));
        }
    }

    changedThings.addPlayer(playerInTurn);
    changedThings.addUnit(unit);

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : undefined,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : undefined,
        createMessage                        : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);
            woContainer.createIfNotExistsWoPlayerProduceUnit().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoPlayerProduceUnit, gcData: GameConfigs_GameConfig.GameConfig): Promise<string | null> {
    if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0095)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0095)} ${Lang_Utils.getUnitName(Helpers_Misc.getExisted(action.getUnitType()), gcData)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
