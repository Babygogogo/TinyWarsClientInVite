import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import type * as HalfwayReplayWarInterfaceIHrwWar from "../../../halfwayReplayWar/interface/IHrwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as ProtoSchemaCommonProtoStructureTileBuff from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as ReplayWarInterfaceIRwWar from "../../../replayWar/interface/IRwWar.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as TileBuffsConstants from "../../../tileBuffs/Constants.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoPlayerProduceUnit    = ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit.WoPlayerProduceUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

let _hrwWarClass    : new () => HalfwayReplayWarInterfaceIHrwWar.IHrwWar;
let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarClass     : new () => ReplayWarInterfaceIRwWar.IRwWar;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

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
        const commonExtraData = HelpersMisc.getExisted(extraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_HandlePlayerProduceUnit_00);
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : true,
        });

        if (!isFastExecute) {
            if (commonExtraData.getUnitArrayAfterAction()?.length) {
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.UnitProduction);
            }
        }

    } else {
        const unitMap           = war.getUnitMap();
        const unitId            = unitMap.getNextUnitId();
        const tileGridIndex     = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getGridIndex()));
        const unitType          = HelpersMisc.getExisted(action.getUnitType());
        const unitHp            = HelpersMisc.getExisted(action.getUnitHp());
        const gameConfig        = war.getGcData();
        const playerInTurn      = war.getPlayerInTurn();
        const playerIndex       = playerInTurn.getPlayerIndex();
        const tileMap           = war.getTileMap();
        const skillCfg          = tileMap.getTile(tileGridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitTemplateCfg   = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType));
        const cfgCost           = unitTemplateCfg.getProductionCost();
        const cost              = Math.floor(
            cfgCost
            * (skillCfg ? (skillCfg.getCostMultiplierPct() ?? 0) : 100)
            * UnitsUtilsCommon.getNormalizedHp(unitHp)
            * playerInTurn.getUnitCostModifier(unitType)
            / 100
            / UnitsConstants.Hp.Normalizer
        );

        const unitData = UnitsUtilsSerialization.create({
            unitType                        : unitType,
            unitId                          : unitId,
            playerIndex                     : playerIndex,
            gridIndex                       : tileGridIndex.toProto().toJson(),

            actionState                     : skillCfg?.getUnitActionStateId() ?? UnitsConstants.ActionStateId.Acted,
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
                tileMap.getTile(tileGridIndex).addUnfixedBuff(ProtoSchemaCommonProtoStructureTileBuff.TileBuff.fromJson({
                    buffTypeId          : TileBuffsConstants.BuffTypeId.NoProduction,
                    expiringTurnIndex   : war.getTurnManager().getTurnIndex() + 1,
                    expiringPlayerIndex : playerIndex,
                    extraParamArray     : [],
                }), !isFastExecute);

                const maxCount = cfg.getConMaxCountOfNoProductionBuilding();
                if ((maxCount == null)                                                                                                                                                  ||
                    (tileMap.getTilesCount(v => (v.getPlayerIndex() == playerIndex) && (v.checkHasUnfixedBuff(TileBuffsConstants.BuffTypeId.NoProduction))) <= maxCount)
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

        const unit = new (GameHelpersGhFactory.getUnitClass())();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - cost);

        {
            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                war.getWarStatisticsManager().addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : unitType,
                    dstPlayerIndex              : playerIndex,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                }));
            }

            if (!isFastExecute) {
                if ((observerTeamIndexes?.length) &&
                    (war.getPlayerManager().getAllPlayers(false).some(v => (v.getUserId() != null) && (observerTeamIndexes.indexOf(v.getTeamIndex()) >= 0)))
                ) {
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.UnitProduction);
                }
            }
        }
    }
}

function getPromotionForPlayerProduceUnit(war: IBwWar, gridIndex: AuxiliaryTypesGridIndex.GridIndex, unitType: number): number {
    const player                    = war.getPlayerInTurn();
    const coZoneRadius              = player.getCoZoneRadius();
    const gameConfig                = war.getGcData();
    const getCoGridIndexArrayOnMap  = HelpersMisc.createLazyFunc(() => player.getCoGridIndexListOnMap());
    let promotion                   = 0;
    for (const skillId of war.getPlayerInTurn().getCoCurrentSkills()) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfPromotionBonusByProduce();
        if ((cfg)                                                                       &&
            (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))   &&
            (gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType         : cfg.getCoSkillAreaTypeId() ?? 0,
                getCoGridIndexArrayOnMap,
                coZoneRadius,
            }))
        ) {
            promotion += cfg.getBonus() ?? 0;
        }
    }

    return promotion;
}

function getTeleportDestinationForPlayerProduceUnit(war: IBwWar, player: PlayersIPlayer.IPlayer, unitTypeId: number, tileGridIndex: AuxiliaryTypesGridIndex.GridIndex, conCoUnitActionStateId: number | null): AuxiliaryTypesGridIndex.GridIndex | null {
    const tileMap           = war.getTileMap();
    const unitMap           = war.getUnitMap();
    const mapSize           = tileMap.getMapSize();
    const moveTypeId        = HelpersMisc.getExisted(war.getGcData().getUnitTemplateCfg(unitTypeId)?.getMoveTypeId());
    const checkedGridIdSet  = new Set<number>();
    let destination         : AuxiliaryTypesGridIndex.GridIndex | null = null;
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
function getDistanceList(gridIndex: AuxiliaryTypesGridIndex.GridIndex, mapSize: AuxiliaryTypesMapSize.MapSize): number[] {
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
async function getDesc(war: IBwWar, action: WoPlayerProduceUnit, gcData: GameConfigGcData.GcData): Promise<string | null> {
    _hrwWarClass    ??= GameHelpersGhFactory.getHrwWarClass();
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarClass     ??= GameHelpersGhFactory.getRwWarClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _hrwWarClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0095)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0095)} ${LangUtils.getUnitName(HelpersMisc.getExisted(action.getUnitType()), gcData)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
