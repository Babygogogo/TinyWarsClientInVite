import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as CoSkillsConstants from "../coSkills/Constants.ts";
import * as CoSkillsUtilsDataGeneratorForUseCoSkill from "../coSkills/utils/DataGeneratorForUseCoSkill.ts";
import * as CoSkillsUtilsExecutor from "../coSkills/utils/Executor.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";

export class PlayerDataForWeaSetPlayerState {
    private readonly _playerIndex           : number;
    private readonly _fund                  : number | null;
    private readonly _aliveState            : number | null;
    private readonly _coId                  : number | null;
    private readonly _coEnergy              : number | null;
    private readonly _isSkipTurn            : boolean | null;
    private readonly _coUsingSkillType      : number | null;
    private readonly _activateCoSkillType   : number | null;

    public constructor({ playerIndex, fund, aliveState, coId, coEnergy, isSkipTurn, coUsingSkillType, activateCoSkillType }: {
        playerIndex         : number;
        fund                : number | null;
        aliveState          : number | null;
        coId                : number | null;
        coEnergy            : number | null;
        isSkipTurn          : boolean | null;
        coUsingSkillType    : number | null;
        activateCoSkillType : number | null;
    }) {
        this._playerIndex           = playerIndex;
        this._fund                  = fund;
        this._aliveState            = aliveState;
        this._coId                  = coId;
        this._coEnergy              = coEnergy;
        this._isSkipTurn            = isSkipTurn;
        this._coUsingSkillType      = coUsingSkillType;
        this._activateCoSkillType   = activateCoSkillType;
    }

    public async apply(war: BaseWarInterfaceIBwWar.IBwWar, isFastExecute: boolean): Promise<void> {
        const player = war.getPlayer(this._playerIndex);
        {
            if (this._fund != null) {
                player.setFund(this._fund);
            }
        }
        {
            if (this._aliveState != null) {
                player.setAliveState(this._aliveState);
            }
        }
        {
            if (this._coId != null) {
                player.setCoId(this._coId);
            }
        }
        {
            if (this._coEnergy != null) {
                player.setAndValidateCoCurrentEnergy(this._coEnergy);
            }
        }
        {
            if (this._isSkipTurn != null) {
                player.setIsSkipTurn(this._isSkipTurn);
            }
        }
        {
            if (this._coUsingSkillType != null) {
                player.setCoUsingSkillType(this._coUsingSkillType);
            }
        }
        {
            const skillType = this._activateCoSkillType;
            if (skillType != null) {
                const skillIdArray = player.getCoSkills(skillType);
                for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                    CoSkillsUtilsExecutor.executeInstantSkill({
                        player              : player,
                        skillId             : skillIdArray[skillIndex],
                        skillData           : CoSkillsUtilsDataGeneratorForUseCoSkill.generate({
                            war         : war,
                            player      : player,
                            skillType   : skillType,
                            skillIndex  : skillIndex,
                        }),
                        targetGridIndexes   : null,
                        hasExtraData        : false,
                        isFastExecute       : isFastExecute,
                    });
                }

                if (!isFastExecute) {
                    const playerIndex       = player.getPlayerIndex();
                    const gridVisualEffect  = war.getGridVisualEffect();
                    if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
                        const teamIndexes = new Set(war.getHumanPlayers().map(v => v.getTeamIndex()));
                        for (const unit of VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                            if (unit.getPlayerIndex() === playerIndex) {
                                unit.updateView();

                                if (skillType === CoSkillsConstants.SkillTypeId.Power) {
                                    gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                                } else {
                                    gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                                }
                            }
                        }
                    } else {
                        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                            if (unit.getPlayerIndex() === playerIndex) {
                                unit.updateView();

                                if (skillType === CoSkillsConstants.SkillTypeId.Power) {
                                    gridVisualEffect.showEffectCoPowerActivation(unit.getGridIndex());
                                } else {
                                    gridVisualEffect.showEffectCoSuperPowerActivation(unit.getGridIndex());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
