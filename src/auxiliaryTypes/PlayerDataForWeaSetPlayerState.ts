import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    CoSkills_Constants,
    CoSkills_Utils_DataGeneratorForUseCoSkill,
    CoSkills_Utils_Executor,
    SinglePlayerWars_War,
    Visibilities_Utils,
    type BaseWar_Model_War,
} from "../internal.ts";

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

    public async apply(war: BaseWar_Model_War.War, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
        const player = war.getPlayer(this._playerIndex);
        const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
        {
            if (this._fund != null) {
                player.setFund(this._fund);
                changedThings.addPlayer(player);
            }
        }
        {
            if (this._aliveState != null) {
                player.setAliveState(this._aliveState);
                changedThings.addPlayer(player);
            }
        }
        {
            if (this._coId != null) {
                player.setCoId(this._coId);
                changedThings.addPlayer(player);
            }
        }
        {
            if (this._coEnergy != null) {
                player.setAndValidateCoCurrentEnergy(this._coEnergy);
                changedThings.addPlayer(player);
            }
        }
        {
            if (this._isSkipTurn != null) {
                player.setIsSkipTurn(this._isSkipTurn);
                changedThings.addPlayer(player);
            }
        }
        {
            if (this._coUsingSkillType != null) {
                player.setCoUsingSkillType(this._coUsingSkillType);
                changedThings.addPlayer(player);
            }
        }
        {
            const skillType = this._activateCoSkillType;
            if (skillType != null) {
                const skillIdArray = player.getCoSkills(skillType);
                for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                    changedThings.mergeFrom(CoSkills_Utils_Executor.executeInstantSkillWithoutExtraData({
                        player            : player,
                        skillId           : skillIdArray[skillIndex],
                        dataForUseCoSkill : CoSkills_Utils_DataGeneratorForUseCoSkill.generate({
                            war        : war,
                            player     : player,
                            skillType  : skillType,
                            skillIndex : skillIndex,
                        }),
                        targetGridIndexes : null,
                        isFastExecute     : isFastExecute,
                    }));
                }

                if (!isFastExecute) {
                    const playerIndex       = player.getPlayerIndex();
                    const gridVisualEffect  = war.getGridVisualEffect();
                    if (war instanceof SinglePlayerWars_War.War) {
                        const teamIndexes = new Set(war.getHumanPlayers().map(v => v.getTeamIndex()));
                        for (const unit of Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                            if (unit.getPlayerIndex() === playerIndex) {
                                unit.flushDataToView();

                                if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                                    gridVisualEffect?.showEffectCoPowerActivation(unit.getGridIndex());
                                } else {
                                    gridVisualEffect?.showEffectCoSuperPowerActivation(unit.getGridIndex());
                                }
                            }
                        }
                    } else {
                        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                            if (unit.getPlayerIndex() === playerIndex) {
                                unit.flushDataToView();

                                if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                                    gridVisualEffect?.showEffectCoPowerActivation(unit.getGridIndex());
                                } else {
                                    gridVisualEffect?.showEffectCoSuperPowerActivation(unit.getGridIndex());
                                }
                            }
                        }
                    }
                }
            }
        }

        return changedThings;
    }
}
