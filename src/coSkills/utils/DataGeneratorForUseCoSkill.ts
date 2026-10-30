import {
    Utils_ClientErrorCode,
    Helpers_Collection,
    CoSkills_Constants,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Units_Constants,
    AuxiliaryTypes_MapSize,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Units_IUnitMap,
} from "../../internal.ts";
import type { FixedAreaDamage } from "../../proto/schema/CommonProto/Config/CoSkillCfg/InstantManual/FixedAreaDamage.ts";
import { DataForUseCoSkill } from "../../proto/schema/CommonProto/Structure/DataForUseCoSkill.ts";

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
    war         : BaseWar_Interface_IBwWar.IBwWar;
    player      : Players_IPlayer.IPlayer;
    skillType   : number;
    skillIndex  : number;
}): DataForUseCoSkill {
    const skillId           = player.getCoSkills(skillType)[skillIndex];
    const skillCfg          = war.getGcData().getCoSkillCfg(skillId);
    const dataForUseCoSkill = DataForUseCoSkill.fromJson({
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
            dataForUseCoSkill.setNewWeatherType(Helpers_Collection.pickRandomElement(cfg.getWeatherTypeIdArray(), war.getRandomNumberManager().getAndTickNextNumber()));
        }
    }

    return dataForUseCoSkill;
}

function getFixedAreaDamageCenter(war: BaseWar_Interface_IBwWar.IBwWar, player: Players_IPlayer.IPlayer, cfg: FixedAreaDamage): AuxiliaryTypes_GridIndex.GridIndex | null {
    const targetType        = cfg.getTargetTypeId();
    const radius            = cfg.getRadius();
    const hpDamage          = cfg.getDamage();
    const isIndiscriminate  = !!cfg.getIsIndiscriminate();
    if (targetType === CoSkills_Constants.FixedAreaDamageTargetTypeId.Hp) { // HP
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkills_Constants.FixedAreaDamageTargetTypeId.Value) {  // fund
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkills_Constants.FixedAreaDamageTargetTypeId.RandomOfHpAndValue) {  // random: HP or fund
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType3({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkills_Constants.FixedAreaDamageTargetTypeId.CapturerHp) {  // HP of inf/mech/bike
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType4({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkills_Constants.FixedAreaDamageTargetTypeId.UnitsCount) {  // number of units
        const valueMaps = getValueMap(war.getUnitMap(), player.getTeamIndex());
        return getFixedAreaDamageCenterForType5({ war, valueMaps, radius, hpDamage, isIndiscriminate });

    } else if (targetType === CoSkills_Constants.FixedAreaDamageTargetTypeId.Appointed) {
        return null;

    } else {
        throw Helpers_Misc.newError(`Invalid targetType: ${targetType}`, Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenter_00);
    }
}

function getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypes_GridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.hpMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return Helpers_Misc.getExisted(Helpers_Collection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType1_00);
    }
}

function getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypes_GridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.fundMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return Helpers_Misc.getExisted(Helpers_Collection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType2_00);
    }
}

function getFixedAreaDamageCenterForType3({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypes_GridIndex.GridIndex {
    return war.getRandomNumberManager().getAndTickNextNumber() < 0.5
        ? getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate })
        : getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate });
}

function getFixedAreaDamageCenterForType4({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypes_GridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.capturerValueMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return Helpers_Misc.getExisted(Helpers_Collection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType4_00);
    }
}

function getFixedAreaDamageCenterForType5({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    valueMaps           : ValueMaps;
    radius              : number;
    hpDamage            : number;
    isIndiscriminate    : boolean;
}): AuxiliaryTypes_GridIndex.GridIndex {
    const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
    const centers   = getCentersOfHighestDamage(damageMap.unitCountMap, radius);
    if (centers.length === 1) {
        return centers[0];
    } else {
        return Helpers_Misc.getExisted(Helpers_Collection.pickRandomElement(centers, war.getRandomNumberManager().getAndTickNextNumber()), Utils_ClientErrorCode.ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType5_00);
    }
}

function getValueMap(unitMap: Units_IUnitMap.IUnitMap, teamIndex: number): ValueMaps {
    const { width, height } = unitMap.getMapSize().getWH();
    const hpMap             = Helpers_Collection.createEmptyMap(width, height, 0);
    const fundMap           = Helpers_Collection.createEmptyMap(width, height, 0);
    const capturerMap       = Helpers_Collection.createEmptyMap(width, height, false);
    const sameTeamMap       = Helpers_Collection.createEmptyMap(width, height, false);
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            const unit = unitMap.getUnitOnMap(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
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

    const hpMap             = Helpers_Collection.createEmptyMap(width, height, 0);
    const fundMap           = Helpers_Collection.createEmptyMap(width, height, 0);
    const unitCountMap      = Helpers_Collection.createEmptyMap(width, height, 0);
    const capturerValueMap  = Helpers_Collection.createEmptyMap(width, height, 0);
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            if (srcHpMap[x][y] > 0) {
                const realHpDamage      = Math.min(hpDamage, srcHpMap[x][y] - 1);
                const realFundDamage    = Math.floor(srcFundMap[x][y] * realHpDamage / Units_Constants.Hp.Normalizer);
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

function getCentersOfHighestDamage(map: number[][], radius: number): AuxiliaryTypes_GridIndex.GridIndex[] {
    const centers   : AuxiliaryTypes_GridIndex.GridIndex[] = [];
    const width     = map.length;
    const height    = map[0].length;
    const mapSize   = new AuxiliaryTypes_MapSize.MapSize(width, height);

    let maxDamage: number | null = null;
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            const center        = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
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
