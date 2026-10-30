import {
    type Players_Constants,
    type Cos_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type CoSkills_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { CoBasicCfg } from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";
import type { GridIdAndMarkTypeId } from "../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import type { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";

export interface IPlayer {
     
    init(data: SerialPlayer, gameConfig: GameConfigs_GameConfig.GameConfig): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

    serialize(): SerialPlayer;
    serializeForCreateSfw(): SerialPlayer;
    serializeForCreateMfr(): SerialPlayer;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    setFund(fund: number): void;
    getFund(): number;

    setHasVotedForDraw(voted: boolean): void;
    getHasVotedForDraw(): boolean;

    setAliveState(alive: Players_Constants.AliveStateId): void;
    getAliveState(): Players_Constants.AliveStateId;

    getPlayerIndex(): number;
    checkIsNeutral(): boolean;

    getTeamIndex(): number;

    setRestTimeToBoot(seconds: number): void;
    getRestTimeToBoot(): number;

    setWatchOngoingSrcUserIds(list: number[]): void;
    getWatchOngoingSrcUserIds(): Set<number>;
    addWatchOngoingSrcUserId(userId: number): void;
    removeWatchOngoingSrcUserId(userId: number): void;

    setWatchRequestSrcUserIds(list: number[]): void;
    getWatchRequestSrcUserIds(): Set<number>;
    addWatchRequestSrcUserId(userId: number): void;
    removeWatchRequestSrcUserId(userId: number): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for marker.
    ////////////////////////////////////////////////////////////////////////////////
    setGridMarkList(newMarkedGridList: GridIdAndMarkTypeId[]): void;
    getGridMarkList(): GridIdAndMarkTypeId[];
    getMarkTypeId(gridId: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    addGridMark(gridId: number, markTypeId: number): boolean;
    deleteGridMark(gridId: number): boolean;
    updateGridMarkList(gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void;

    updateHiddenGridMarkTypeIdList(list: number[]): void;
    getHiddenGridMarkTypeIdList(): number[];
    getHiddenGridMarkTypeIdListForTeams(teamIndexes: Set<number>): number[];

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for skip turn.
    ////////////////////////////////////////////////////////////////////////////////
    setIsSkipTurn(isSkipTurn: boolean): void;
    getIsSkipTurn(): boolean;

    setUserId(id: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void;
    getUserId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    getUnitAndTileSkinId(): number;

    getNickname(): Promise<string>;

    setCoId(coId: number): void;
    getCoId(): number;
    getCoCategoryId(): number;

    setAndValidateCoCurrentEnergy(energy: number): void;
    addAndValidateCoCurrentEnergy(offset: number): void;
    getCoCurrentEnergy(): number;
    getCoMaxEnergy(): number;
    getCoZoneExpansionEnergyList(): number[] | null;
    getCoPowerEnergy(): number | null;
    getCoSuperPowerEnergy(): number | null;

    getCoEnergyType(): Cos_Constants.EnergyTypeId;
    getCoPowerActivatedCount(): number;

    getCoZoneRadius(): number;
    getCoGridIndexListOnMap(): AuxiliaryTypes_GridIndex.GridIndex[];
    getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet: Set<number>): AuxiliaryTypes_GridIndex.GridIndex[];

    checkIsInCoZone(targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex, coGridIndexOnMap: AuxiliaryTypes_GridIndex.GridIndex[]): boolean;

    getCoUsingSkillType(): CoSkills_Constants.SkillTypeId;
    setCoUsingSkillType(skillType: CoSkills_Constants.SkillTypeId): void;
    getCoCurrentSkills(): number[];
    getCoSkills(skillType: CoSkills_Constants.SkillTypeId): number[];
    checkCoIsUsingActiveSkill(): boolean;
    checkHasZoneSkillForCurrentSkills(): boolean;
    checkCanUseCoSkill(skillType: CoSkills_Constants.SkillTypeId): boolean;
    checkCanGetEnergyWithBattle(): boolean;

    updateOnUseCoSkill(skillType: CoSkills_Constants.SkillTypeId): void;

    getCoIsDestroyedInTurn(): boolean;
    setCoIsDestroyedInTurn(isDestroyed: boolean): void;

    getCoMaxBoardCount(): number;

    getUnitCostModifier(unitTypeId: number): number;

    getCoBasicCfg(): CoBasicCfg;
}
