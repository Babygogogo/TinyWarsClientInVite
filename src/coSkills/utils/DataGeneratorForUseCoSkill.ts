import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as CoSkillsConstants from "../Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgInstantManualFixedAreaDamage from "../../proto/schema/CommonProto/Config/CoSkillCfg/InstantManual/FixedAreaDamage.ts";
import * as ProtoSchemaCommonProtoStructureDataForUseCoSkill from "../../proto/schema/CommonProto/Structure/DataForUseCoSkill.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnitMap from "../../units/IUnitMap.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwPlayer                      = PlayersIPlayer.IPlayer;
type IBwUnitMap                     = UnitsIUnitMap.IUnitMap;
type IBwWar                         = BaseWarInterfaceIBwWar.IBwWar;

interface DamageMaps {
    hpMap               : number[][];
    fundMap             : number[][];
    unitCountMap        : number[][];
    capturerValueMap    : number[][];
}
interface ValueMaps {
    hpMap       : number[][];
    fundMap     : number[][];
    capturerMap : boolean[][];
    sameTeamMap : boolean[][];
}

export function generate({ war, player, skillType, skillIndex }: {
    war         : IBwWar;
    player      : IBwPlayer;
    skillType   : number;
    skillIndex  : number;
}): ProtoSchemaCommonProtoStructureDataForUseCoSkill.DataForUseCoSkill {
    const skillId           = player.getCoSkills(skillType)[skillIndex];
    const skillCfg          = war.getGcData().getCoSkillCfg(skillId);
    const dataForUseCoSkill = ProtoSchemaCommonProtoStructureDataForUseCoSkill.DataForUseCoSkill.fromJson({
        skillIndex  : skillIndex,
    });

    {
        const cfg = skillCfg?.getInstantManual()?.getFixedAreaDamage();
        if (cfg) {
            const center = getFixedAreaDamageCenter(war, player, cfg);
            if (center) {
                dataForUseCoSkill.setFixedAreaDamageCenter(center.toProto());
            }
        }
    }

    {
        const cfg = skillCfg?.getInstantManual()?.getChangeWeather();
        if (cfg) {
            dataForUseCoSkill.setNewWeatherType(HelpersCollection.pickRandomElement(cfg.getWeatherTypeIdArray() ?? [], war.getRandomNumberManager().getAndTickNextNumber()));
        }
    }

    return dataForUseCoSkill;
}

function getFixedAreaDamageCenter(war: IBwWar, player: IBwPlayer, cfg: ProtoSchemaCommonProtoConfigCoSkillCfgInstantManualFixedAreaDamage.FixedAreaDamage): AuxiliaryTypesGridIndex.GridIndex | null {
    const targetType        = cfg.getTargetTypeId() ?? 0;
    const radius            = cfg.getRadius() ?? 0;
    const hpDamage          = cfg.getDamage() ?? 0;
    const isIndiscriminate  = !!cfg.getIsIndiscriminate();
    if (targetType === CoSkillsConstants.FixedAreaDamageTargetTypeId.Hp) { // HP
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkillsConstants.FixedAreaDamageTargetTypeId.Value) {  // fund
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkillsConstants.FixedAreaDamageTargetTypeId.RandomOfHpAndValue) {  // random: HP or fund
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType3({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkillsConstants.FixedAreaDamageTargetTypeId.CapturerHp) {  // HP of inf/mech/bike
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType4({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkillsConstants.FixedAreaDamageTargetTypeId.UnitsCount) {  // number of units
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType5({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkillsConstants.FixedAreaDamageTargetTypeId.Appointed) {
        return null;

    } else {
        throw HelpersMisc.newError(`Invalid targetType: ${targetType}`, UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenter_00);
    }
}

function getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypesGridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.hpMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return HelpersMisc.getExisted(HelpersCollection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType1_00);
    }
}

function getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypesGridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.fundMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return HelpersMisc.getExisted(HelpersCollection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType2_00);
    }
}

function getFixedAreaDamageCenterForType3({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypesGridIndex.GridIndex {
    return war.getRandomNumberManager().getAndTickNextNumber() < 0.5
        ? getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate })
        : getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate });
}

function getFixedAreaDamageCenterForType4({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypesGridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.capturerValueMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return HelpersMisc.getExisted(HelpersCollection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType4_00);
    }
}

function getFixedAreaDamageCenterForType5({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypesGridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.unitCountMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return HelpersMisc.getExisted(HelpersCollection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), UtilsClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType5_00);
    }
}

function getValueMap(unitMap: IBwUnitMap, teamIndex: number): ValueMaps {
    const { width, height } = unitMap.getMapSize().getWH();
    const hpMap             = HelpersCollection.createEmptyMap(width, height, 0);
    const fundMap           = HelpersCollection.createEmptyMap(width, height, 0);
    const capturerMap       = HelpersCollection.createEmptyMap(width, height, false);
    const sameTeamMap       = HelpersCollection.createEmptyMap(width, height, false);
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            const unit = unitMap.getUnitOnMap(new AuxiliaryTypesGridIndex.GridIndex(x, y));
            if (unit) {
                hpMap[x][y]         = unit.getNormalizedCurrentHp();
                fundMap[x][y]       = unit.getProductionFinalCost();
                capturerMap[x][y]   = unit.checkIsCapturer();
                sameTeamMap[x][y]   = unit.getTeamIndex() === teamIndex;
            }
        }
    }

    return { hpMap, fundMap, capturerMap, sameTeamMap };
}

function getDamageMap({ valueMaps, hpDamage, isIndiscriminate }: {
    valueMaps       : ValueMaps;
    hpDamage        : number;
    isIndiscriminate: boolean;
}): DamageMaps {
    const srcHpMap          = valueMaps.hpMap;
    const srcFundMap        = valueMaps.fundMap;
    const srcSameTeamMap    = valueMaps.sameTeamMap;
    const srcCapturerMap    = valueMaps.capturerMap;
    const width             = srcHpMap.length;
    const height            = srcHpMap[0].length;

    const hpMap             = HelpersCollection.createEmptyMap(width, height, 0);
    const fundMap           = HelpersCollection.createEmptyMap(width, height, 0);
    const unitCountMap      = HelpersCollection.createEmptyMap(width, height, 0);
    const capturerValueMap  = HelpersCollection.createEmptyMap(width, height, 0);
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            if (srcHpMap[x][y] > 0) {
                const realHpDamage      = Math.min(hpDamage, srcHpMap[x][y] - 1);
                const realFundDamage    = Math.floor(srcFundMap[x][y] * realHpDamage / UnitsConstants.Hp.Normalizer);
                const isSameTeam        = srcSameTeamMap[x][y];
                if (isIndiscriminate) {
                    hpMap[x][y]             = isSameTeam ? -realHpDamage * 2 : realHpDamage;
                    fundMap[x][y]           = isSameTeam ? -realFundDamage * 2 : realFundDamage;
                    unitCountMap[x][y]      = isSameTeam ? -2 : 1;
                    capturerValueMap[x][y]  = isSameTeam
                        ? (-realHpDamage * 2)
                        : (srcCapturerMap[x][y] ? realHpDamage * 100000 : realHpDamage);
                } else {
                    hpMap[x][y]             = isSameTeam ? 0 : realHpDamage;
                    fundMap[x][y]           = isSameTeam ? 0 : realFundDamage;
                    unitCountMap[x][y]      = isSameTeam ? 0 : 1;
                    capturerValueMap[x][y]  = isSameTeam
                        ? (0)
                        : (srcCapturerMap[x][y] ? realHpDamage * 100000 : realHpDamage);
                }
            }
        }
    }
    return { hpMap, fundMap, unitCountMap, capturerValueMap };
}

function getCentersOfHighestDamage(map: number[][], radius: number): AuxiliaryTypesGridIndex.GridIndex[] {
    const centers   : AuxiliaryTypesGridIndex.GridIndex[] = [];
    const width     = map.length;
    const height    = map[0].length;
    const mapSize   = new AuxiliaryTypesMapSize.MapSize(width, height);

    let maxDamage: number | null = null;
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            const center        = new AuxiliaryTypesGridIndex.GridIndex(x, y);
            let totalDamage     = 0;
            for (const gridIndex of center.getGridsWithinDistance({ minDistance: 0, maxDistance: radius, mapSize })) {
                totalDamage += map[gridIndex.getX()][gridIndex.getY()];
            }

            if ((maxDamage == null) || (totalDamage > maxDamage)) {
                maxDamage = totalDamage;
                centers.length = 0;
                centers.push(center);
            } else if (maxDamage === totalDamage) {
                centers.push(center);
            }
        }
    }

    return centers;
}
