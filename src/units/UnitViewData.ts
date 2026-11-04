import {
    BaseWar_Interface_IBwWar,
    CoSkills_Constants,
    ForceSkins_Constants,
    ForceSkins_Utils,
    GameConfigs_GameConfig,
    Helpers_Collection,
    Numbers_Constants,
    Players_Constants,
    Units_Constants,
    Units_Unit,
    Units_Utils_Common,
} from "../internal";
import type { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit";

export interface IUnitViewData {
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

export class UnitViewData implements IUnitViewData {
    public unitTypeId               = Units_Constants.UnitTypeId.First;
    public gridX                    = 0;
    public gridY                    = 0;
    public playerIndex              = Players_Constants.PlayerIndex.First;
    public skinId                   = ForceSkins_Constants.SkinId.First;
    public normalizedHp             = Units_Constants.Hp.MaxNormalizedHp;
    public animationTypeId          = Units_Constants.AnimationTypeId.Stand;
    public isDark                   = false;
    public isLoadedByUnit           = false;
    public isActiveCoSkillReady     = false;

    public promotion                = 0;
    public coSkillTypeIdInUse       = CoSkills_Constants.SkillTypeId.Passive;
    public isCoOnboard              = false;
    public isFuelInShort            = false;
    public isAmmoInShort            = false;
    public isMaterialInShort        = false;
    public isDived                  = false;
    public isCapturingTile          = false;
    public isBuildingTile           = false;
    public hasLoadedUnits           = false;
    public readonly buffTypeIdList  = new Array<number>();

    public static generateFromUnit(unit: Units_Unit.Unit, war: BaseWar_Interface_IBwWar.IBwWar, ignorePosition: boolean): UnitViewData {
        const player            = unit.getPlayer();
        const playerIndex       = unit.getPlayerIndex();
        const coUsingSkillType  = player.getCoUsingSkillType();

        return new UnitViewData({
            unitTypeId           : unit.getUnitType(),
            gridX                : ignorePosition ? 0 : unit.getGridX(),
            gridY                : ignorePosition ? 0 : unit.getGridY(),
            playerIndex          : playerIndex,
            skinId               : ForceSkins_Utils.getFinalSkinId(war, playerIndex),
            normalizedHp         : unit.getNormalizedCurrentHp(),
            animationTypeId      : Units_Constants.AnimationTypeId.Stand,
            isDark               : unit.getActionState() === Units_Constants.ActionStateId.Acted,
            isLoadedByUnit       : unit.getLoaderUnitId() != null,
            isActiveCoSkillReady : (player.getCoCurrentEnergy() >= (player.getCoPowerEnergy() ?? player.getCoSuperPowerEnergy() ?? Numbers_Constants.MaxInt32))
                && (coUsingSkillType === CoSkills_Constants.SkillTypeId.Passive),

            promotion          : unit.getCurrentPromotion(),
            coSkillTypeIdInUse : coUsingSkillType,
            isCoOnboard        : unit.getIsCoOnboard(),
            isFuelInShort      : unit.checkIsFuelInShort(),
            isAmmoInShort      : unit.checkIsPrimaryWeaponAmmoInShort() || unit.checkIsFlareAmmoInShort(),
            isMaterialInShort  : unit.checkIsBuildMaterialInShort() || unit.checkIsProduceMaterialInShort(),
            isDived            : unit.getIsDiving(),
            isCapturingTile    : unit.checkIsCapturingTile(),
            isBuildingTile     : unit.checkIsBuildingTile(),
            hasLoadedUnits     : unit.getLoadedUnitsCount() > 0,
            buffTypeIdList     : unit.getBuffList().map(v => v.getBuffTypeId()),
        });
    }

    public static generateFromSerialUnit(unit: SerialUnit, gameConfig: GameConfigs_GameConfig.GameConfig, player?: SerialPlayer): UnitViewData {
        const playerIndex               = unit.getPlayerIndex();
        const unitTypeId                = unit.getUnitType();
        const gridIndex                 = unit.getGridIndex();
        const unitTemplateCfg           = gameConfig.getUnitTemplateCfg(unitTypeId);
        const isFuelInShort             = Units_Utils_Common.checkIsFuelInShort(unit.getCurrentFuel(), unitTemplateCfg?.getMaxFuel());
        const isPrimaryAmmoInShort      = Units_Utils_Common.checkIsPrimaryAmmoInShort(unit.getPrimaryWeaponCurrentAmmo(), unitTemplateCfg?.getPrimaryWeaponMaxAmmo());
        const isFlareAmmoInShort        = Units_Utils_Common.checkIsFlareAmmoInShort(unit.getFlareCurrentAmmo(), unitTemplateCfg?.getFlareMaxAmmo());
        const isProduceMaterialInShort  = Units_Utils_Common.checkIsProduceMaterialInShort(unit.getCurrentProduceMaterial(), unitTemplateCfg?.getMaxProduceMaterial());
        const isBuildMaterialInShort    = Units_Utils_Common.checkIsBuildMaterialInShort(unit.getCurrentBuildMaterial(), unitTemplateCfg?.getMaxBuildMaterial());

        return new UnitViewData({
            unitTypeId           : unitTypeId,
            gridX                : gridIndex?.getX() ?? 0,
            gridY                : gridIndex?.getY() ?? 0,
            playerIndex          : playerIndex,
            skinId               : player ? player.getUnitAndTileSkinId() : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            normalizedHp         : Units_Utils_Common.getNormalizedHp(unit.getCurrentHp()),
            animationTypeId      : Units_Constants.AnimationTypeId.Stand,
            isDark               : unit.getActionState() === Units_Constants.ActionStateId.Acted,
            isLoadedByUnit       : unit.getLoaderUnitId() != null,
            isActiveCoSkillReady : false,   // TODO

            promotion          : unit.getCurrentPromotion(),
            coSkillTypeIdInUse : player?.getCoUsingSkillType() ?? CoSkills_Constants.SkillTypeId.Passive,
            isCoOnboard        : unit.getIsCoOnboard(),
            isFuelInShort      : isFuelInShort,
            isAmmoInShort      : isPrimaryAmmoInShort || isFlareAmmoInShort,
            isMaterialInShort  : isProduceMaterialInShort || isBuildMaterialInShort,
            isDived            : unit.getIsDiving(),
            isCapturingTile    : false,     // TODO
            isBuildingTile     : false,     // TODO
            hasLoadedUnits     : false,     // TODO
            buffTypeIdList     : unit.getBuffArray().map(v => v.getBuffTypeId()),
        });
    }

    public constructor(source?: Partial<IUnitViewData>) {
        if (source) {
            this.mergeFrom(source);
        }
    }

    public mergeFrom(source: Partial<IUnitViewData>): boolean {
        let hasChanged  = false;

        // for (const [key, newValue] of Object.entries(source) as [keyof Units_Types.ViewData, Units_Types.ViewData[keyof Units_Types.ViewData]][]) {
        //     if ((newValue !== undefined) && (target[key] !== newValue)) {
        //         (target[key] as typeof newValue)= newValue;
        //         hasChanged = true;
        //     }
        // }

        if ((source.unitTypeId !== undefined) &&
            (this.unitTypeId !== source.unitTypeId)
        ) {
            this.unitTypeId = source.unitTypeId;
            hasChanged = true;
        }
        if ((source.gridX !== undefined) &&
            (this.gridX !== source.gridX)
        ) {
            this.gridX = source.gridX;
            hasChanged = true;
        }
        if ((source.gridY !== undefined) &&
            (this.gridY !== source.gridY)
        ) {
            this.gridY = source.gridY;
            hasChanged = true;
        }
        if ((source.playerIndex !== undefined) &&
            (this.playerIndex !== source.playerIndex)
        ) {
            this.playerIndex = source.playerIndex;
            hasChanged = true;
        }
        if ((source.skinId !== undefined) &&
            (this.skinId !== source.skinId)
        ) {
            this.skinId = source.skinId;
            hasChanged = true;
        }
        if ((source.normalizedHp !== undefined) &&
            (this.normalizedHp !== source.normalizedHp)
        ) {
            this.normalizedHp = source.normalizedHp;
            hasChanged = true;
        }
        if ((source.animationTypeId !== undefined) &&
            (this.animationTypeId !== source.animationTypeId)
        ) {
            this.animationTypeId = source.animationTypeId;
            hasChanged = true;
        }
        if ((source.isDark !== undefined) &&
            (this.isDark !== source.isDark)
        ) {
            this.isDark = source.isDark;
            hasChanged = true;
        }
        if ((source.isLoadedByUnit !== undefined) &&
            (this.isLoadedByUnit !== source.isLoadedByUnit)
        ) {
            this.isLoadedByUnit = source.isLoadedByUnit;
            hasChanged = true;
        }
        if ((source.isActiveCoSkillReady !== undefined) &&
            (this.isActiveCoSkillReady !== source.isActiveCoSkillReady)
        ) {
            this.isActiveCoSkillReady = source.isActiveCoSkillReady;
            hasChanged = true;
        }
        if ((source.promotion !== undefined) &&
            (this.promotion !== source.promotion)
        ) {
            this.promotion = source.promotion;
            hasChanged = true;
        }
        if ((source.coSkillTypeIdInUse !== undefined) &&
            (this.coSkillTypeIdInUse !== source.coSkillTypeIdInUse)
        ) {
            this.coSkillTypeIdInUse = source.coSkillTypeIdInUse;
            hasChanged = true;
        }
        if ((source.isCoOnboard !== undefined) &&
            (this.isCoOnboard !== source.isCoOnboard)
        ) {
            this.isCoOnboard = source.isCoOnboard;
            hasChanged = true;
        }
        if ((source.isFuelInShort !== undefined) &&
            (this.isFuelInShort !== source.isFuelInShort)
        ) {
            this.isFuelInShort = source.isFuelInShort;
            hasChanged = true;
        }
        if ((source.isAmmoInShort !== undefined) &&
            (this.isAmmoInShort !== source.isAmmoInShort)
        ) {
            this.isAmmoInShort = source.isAmmoInShort;
            hasChanged = true;
        }
        if ((source.isMaterialInShort !== undefined) &&
            (this.isMaterialInShort !== source.isMaterialInShort)
        ) {
            this.isMaterialInShort = source.isMaterialInShort;
            hasChanged = true;
        }
        if ((source.isDived !== undefined) &&
            (this.isDived !== source.isDived)
        ) {
            this.isDived = source.isDived;
            hasChanged = true;
        }
        if ((source.isCapturingTile !== undefined) &&
            (this.isCapturingTile !== source.isCapturingTile)
        ) {
            this.isCapturingTile = source.isCapturingTile;
            hasChanged = true;
        }
        if ((source.isBuildingTile !== undefined) &&
            (this.isBuildingTile !== source.isBuildingTile)
        ) {
            this.isBuildingTile = source.isBuildingTile;
            hasChanged = true;
        }
        if ((source.hasLoadedUnits !== undefined) &&
            (this.hasLoadedUnits !== source.hasLoadedUnits)
        ) {
            this.hasLoadedUnits = source.hasLoadedUnits;
            hasChanged = true;
        }
        if ((source.buffTypeIdList !== undefined) &&
            (!Helpers_Collection.checkIsSameList(this.buffTypeIdList, source.buffTypeIdList))
        ) {
            this.buffTypeIdList.length = 0;
            this.buffTypeIdList.push(...source.buffTypeIdList);
            hasChanged = true;
        }

        return hasChanged;
    }
}
