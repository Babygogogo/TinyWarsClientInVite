import type {
    CoSkills_Constants,
    Units_Constants,
} from "../internal";

export interface AnimationCfg {
    unitTypeId          : number;
    idleFramesCount     : number;
    idleFrameDuration   : number;
    moveFramesCount     : number;
    moveFrameDuration   : number;
}

export interface ViewData {
    unitTypeId              : number;
    gridX                   : number;
    gridY                   : number;
    playerIndex             : number;
    skinId                  : number;
    normalizedHp            : number;
    animationTypeId         : Units_Constants.AnimationTypeId;
    isDark                  : boolean;
    isLoadedByUnit          : boolean;
    isActiveCoSkillReady    : boolean;

    promotion           : number;
    coSkillTypeIdInUse  : CoSkills_Constants.SkillTypeId;
    isCoOnboard         : boolean;
    isFuelInShort       : boolean;
    isAmmoInShort       : boolean;
    isMaterialInShort   : boolean;
    isDived             : boolean;
    isCapturingTile     : boolean;
    isBuildingTile      : boolean;
    hasLoadedUnits      : boolean;
    buffTypeIdList      : number[];
}
