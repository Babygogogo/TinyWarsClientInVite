import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import {
    getUnitClass,
    getHrwWarClass,
    getMeWarClass,
    getMpwWarClass,
    getRwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../../gameHelpers/GhFactory.ts";
import type { IHrwWar } from "../../../halfwayReplayWar/interface/IHrwWar.ts";
import { getExisted, createLazyFunc } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getUnitName } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WoPlayerProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { IRwWar } from "../../../replayWar/interface/IRwWar.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { BuffTypeId } from "../../../tileBuffs/Constants.ts";
import { Hp, ActionStateId } from "../../../units/Constants.ts";
import { getNormalizedHp } from "../../../units/utils/Common.ts";
import { create } from "../../../units/utils/Serialization.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { handleCommonExtraData } from "./Common.ts";

let _hrwWarClass    : new () => IHrwWar;
let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarClass     : new () => IRwWar;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoPlayerProduceUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerProduceUnit(war, action);
    } else {
        await normalExePlayerProduceUnit(war, action);
    }
}

function fastExePlayerProduceUnit(war: IBwWar, action: WoPlayerProduceUnit): void {
    handlePlayerProduceUnit(war, action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}
function normalExePlayerProduceUnit(war: IBwWar, action: WoPlayerProduceUnit): void {
    // const desc = await war.getDescForExePlayerProduceUnit(action);
    // (desc) && (FloatText.show(desc));

    handlePlayerProduceUnit(war, action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

function handlePlayerProduceUnit(war: IBwWar, action: WoPlayerProduceUnit, isFastExecute: boolean): void {
    const extraData = action.getExtraData();
    if (extraData) {
        const commonExtraData = getExisted(extraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_HandlePlayerProduceUnit_00);
        handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : true,
        });

        if (!isFastExecute) {
            if (commonExtraData.getUnitArrayAfterAction()?.length) {
                playShortSfx(ShortSfxCode.UnitProduction);
            }
        }

    } else {
        const unitMap           = war.getUnitMap();
        const unitId            = unitMap.getNextUnitId();
        const tileGridIndex     = getExisted(GridIndex.convertGridIndex(action.getGridIndex()));
        const unitType          = getExisted(action.getUnitType());
        const unitHp            = getExisted(action.getUnitHp());
        const gameConfig        = war.getGcData();
        const playerInTurn      = war.getPlayerInTurn();
        const playerIndex       = playerInTurn.getPlayerIndex();
        const tileMap           = war.getTileMap();
        const skillCfg          = tileMap.getTile(tileGridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitTemplateCfg   = getExisted(gameConfig.getUnitTemplateCfg(unitType));
        const cfgCost           = unitTemplateCfg.getProductionCost();
        const cost              = Math.floor(
            cfgCost
            * (skillCfg ? (skillCfg.getCostMultiplierPct()) : 100)
            * getNormalizedHp(unitHp)
            * playerInTurn.getUnitCostModifier(unitType)
            / 100
            / Hp.Normalizer
        );

        const unitData = create({
            unitType                        : unitType,
            unitId                          : unitId,
            playerIndex                     : playerIndex,
            gridIndex                       : tileGridIndex.toProto().toJson(),

            actionState                     : skillCfg?.getUnitActionStateId() ?? ActionStateId.Acted,
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
                    buffTypeId          : BuffTypeId.NoProduction,
                    expiringTurnIndex   : war.getTurnManager().getTurnIndex() + 1,
                    expiringPlayerIndex : playerIndex,
                    extraParamArray     : [],
                }), !isFastExecute);

                const maxCount = cfg.getConMaxCountOfNoProductionBuilding();
                if ((maxCount == null)                                                                                                                                                  ||
                    (tileMap.getTilesCount(v => (v.getPlayerIndex() == playerIndex) && (v.checkHasUnfixedBuff(BuffTypeId.NoProduction))) <= maxCount)
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

        const unit = new (getUnitClass())();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - cost);

        {
            const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : unitType,
                    dstPlayerIndex              : playerIndex,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                }));
            }

            if (!isFastExecute) {
                if ((observerTeamIndexes?.length) &&
                    (war.getPlayerManager().getAllPlayers(false).some(v => (v.getUserId() != null) && (observerTeamIndexes.indexOf(v.getTeamIndex()) >= 0)))
                ) {
                    playShortSfx(ShortSfxCode.UnitProduction);
                }
            }
        }
    }
}

function getPromotionForPlayerProduceUnit(war: IBwWar, gridIndex: GridIndex, unitType: number): number {
    const player                    = war.getPlayerInTurn();
    const coZoneRadius              = player.getCoZoneRadius();
    const gameConfig                = war.getGcData();
    const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
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

function getTeleportDestinationForPlayerProduceUnit(war: IBwWar, player: IPlayer, unitTypeId: number, tileGridIndex: GridIndex, conCoUnitActionStateId: number | null): GridIndex | null {
    const tileMap           = war.getTileMap();
    const unitMap           = war.getUnitMap();
    const mapSize           = tileMap.getMapSize();
    const moveTypeId        = getExisted(war.getGcData().getUnitTemplateCfg(unitTypeId)?.getMoveTypeId());
    const checkedGridIdSet  = new Set<number>();
    let destination         : GridIndex | null = null;
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
function getDistanceList(gridIndex: GridIndex, mapSize: MapSize): number[] {
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
async function getDesc(war: IBwWar, action: WoPlayerProduceUnit, gcData: GameConfig): Promise<string | null> {
    _hrwWarClass    ??= getHrwWarClass();
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarClass     ??= getRwWarClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _hrwWarClass) {
        return `${getText(TextType.B0095)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarClass) {
        return `${getText(TextType.B0095)} ${getUnitName(getExisted(action.getUnitType()), gcData)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
