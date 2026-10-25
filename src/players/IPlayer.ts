import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../baseWar/interface/IBwWar.ts";
import type { EnergyTypeId } from "../cos/Constants.ts";
import type { SkillTypeId } from "../coSkills/Constants.ts";
import type { GcData } from "../gameConfig/GcData.ts";
import type { AliveStateId } from "./Constants.ts";
import type { CoBasicCfg } from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";
import type {
    GridIdAndMarkTypeId as ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId,
} from "../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import type {
    SerialPlayer as ProtoSchemaCommonProtoWarSerializationSerialPlayer,
} from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";

type GridIndex              = AuxiliaryTypesGridIndex;
type PlayerAliveState       = AliveStateId;
type CoSkillType            = SkillTypeId;
type CoEnergyType           = EnergyTypeId;
type GameConfiguration      = GcData;
type SerialPlayer           = ProtoSchemaCommonProtoWarSerializationSerialPlayer;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type IBwWar                 = BaseWarInterfaceIBwWar;
type GridIdAndMarkTypeId    = ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId;

export interface IPlayer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init(data: SerialPlayer, gameConfig: GameConfiguration): void;

    startRunning(war: IBwWar): void;

    serialize(): SerialPlayer;
    serializeForCreateSfw(): SerialPlayer;
    serializeForCreateMfr(): SerialPlayer;

    getWar(): IBwWar;

    setFund(fund: number): void;
    getFund(): number;

    setHasVotedForDraw(voted: boolean): void;
    getHasVotedForDraw(): boolean;

    setAliveState(alive: PlayerAliveState): void;
    getAliveState(): PlayerAliveState;

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
    getMarkTypeId(gridId: number): Undefinable<number>;
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

    setUserId(id: Undefinable<number>): void;
    getUserId(): Undefinable<number>;

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

    getCoEnergyType(): CoEnergyType;
    getCoPowerActivatedCount(): number;

    getCoZoneRadius(): number;
    getCoGridIndexListOnMap(): GridIndex[];
    getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet: Set<number>): GridIndex[];

    checkIsInCoZone(targetGridIndex: GridIndex, coGridIndexOnMap: GridIndex[]): boolean;

    getCoUsingSkillType(): CoSkillType;
    setCoUsingSkillType(skillType: CoSkillType): void;
    getCoCurrentSkills(): number[];
    getCoSkills(skillType: CoSkillType): number[];
    checkCoIsUsingActiveSkill(): boolean;
    checkHasZoneSkillForCurrentSkills(): boolean;
    checkCanUseCoSkill(skillType: CoSkillType): boolean;
    checkCanGetEnergyWithBattle(): boolean;

    updateOnUseCoSkill(skillType: CoSkillType): void;

    getCoIsDestroyedInTurn(): boolean;
    setCoIsDestroyedInTurn(isDestroyed: boolean): void;

    getCoMaxBoardCount(): number;

    getUnitCostModifier(unitTypeId: number): number;

    getCoBasicCfg(): CoBasicCfg;
}
