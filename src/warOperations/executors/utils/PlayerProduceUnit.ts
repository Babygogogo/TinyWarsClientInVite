import {
    AuxiliaryTypes_GridIndex,
    HalfwayReplayWar_Model_HrwWar,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    Units_Unit,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
    Units_Constants,
    TileBuffs_Constants,
    Utils_ClientErrorCode,
    Units_Utils_Serialization,
    Helpers_Misc,
    Helpers_Team,
    Units_Utils_Common,
    Visibilities_Utils,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    type Players_IPlayer,
} from "../../../internal.ts";

import { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WoPlayerProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerProduceUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerProduceUnit(war, action);
    } else {
        await normalExePlayerProduceUnit(war, action);
    }
}

function fastExePlayerProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerProduceUnit): void {
    handlePlayerProduceUnit(war, action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}
function normalExePlayerProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerProduceUnit): void {
    // const desc = await war.getDescForExePlayerProduceUnit(action);
    // (desc) && (FloatText.show(desc));

    handlePlayerProduceUnit(war, action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

function handlePlayerProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerProduceUnit, isFastExecute: boolean): void {
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
            / Units_Constants.Hp.Normalizer
        );

        const unitData = Units_Utils_Serialization.create({
            unitType                        : unitType,
            unitId                          : unitId,
            playerIndex                     : playerIndex,
            gridIndex                       : tileGridIndex.toProto().toJson(),

            actionState                     : skillCfg?.getUnitActionStateId() ?? Units_Constants.ActionStateId.Acted,
            currentHp                       : unitHp,
            aiMode                          : null,
            groupedTagId                    : null,
            customNameId                    : null,

            currentPromotion                : getPromotionForPlayerProduceUnit(war, tileGridIndex, unitType),
            isDiving                        : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
            isCoOnboard                     : null,
            currentBuildMaterial            : unitTemplateCfg.getMaxBuildMaterial() ?? null,

            aiWeightedDestination           : null,
            forbiddenGroupedLocationIdArray : [],
            buffArray                       : [],

            primaryWeaponCurrentAmmo        : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? null,
            flareCurrentAmmo                : unitTemplateCfg.getFlareMaxAmmo() ?? null,
            currentProduceMaterial          : unitTemplateCfg.getMaxProduceMaterial() ?? null,
            currentFuel                     : unitTemplateCfg.getMaxFuel(),
            loaderUnitId                    : null,
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

        const unit = new Units_Unit.Unit();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - cost);

        {
            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : unitType,
                    dstPlayerIndex              : playerIndex,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
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

function getPromotionForPlayerProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, unitType: number): number {
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
                coSkillAreaType         : cfg.getCoSkillAreaTypeId(),
                getCoGridIndexArrayOnMap,
                coZoneRadius,
            }))
        ) {
            promotion += cfg.getBonus();
        }
    }

    return promotion;
}

function getTeleportDestinationForPlayerProduceUnit(war: BaseWar_Interface_IBwWar.IBwWar, player: Players_IPlayer.IPlayer, unitTypeId: number, tileGridIndex: AuxiliaryTypes_GridIndex.GridIndex, conCoUnitActionStateId: number | null): AuxiliaryTypes_GridIndex.GridIndex | null {
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
                        getDistanceList(destination, mapSize)
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerProduceUnit, gcData: GameConfigs_GameConfig.GameConfig): Promise<string | null> {

    if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0095)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0095)} ${Lang_Utils.getUnitName(Helpers_Misc.getExisted(action.getUnitType()), gcData)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
