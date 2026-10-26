import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { EnergyTypeId, CoId } from "../cos/Constants.ts";
import { checkIsValidEnergy, getValidEnergy, getCoMaxEnergy } from "../cos/Utils.ts";
import { SkillTypeId } from "../coSkills/Constants.ts";
import { getPowerSkillTargetsCount } from "../coSkills/utils/Common.ts";
import { getTotalMultiplier } from "../coSkills/utils/persistent/SelfUnitCost.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import { addGridMark, deleteGridMark, updateGridMarkList } from "../gridMarks/Utils.ts";
import { checkIsSameSet } from "../helpers/Collection.ts";
import { newError, getExisted, getDefined } from "../helpers/Misc.ts";
import type {
    GridMarkAdded,
    GridMarkDeleted,
    GridMarkListChanged,
    BwPlayerPlayerIndexArrayForShowMarkedGridUpdated,
} from "../notifications/DataTypes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { MaxInt32 } from "../numbers/Constants.ts";
import { getValueInRange, getValueInInt32 } from "../numbers/Utils.ts";
import { AliveStateId, PlayerIndex } from "./Constants.ts";
import type { IPlayer } from "./IPlayer.ts";
import type { CoBasicCfg } from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";
import type { GridIdAndMarkTypeId } from "../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import { getSelfUserId, getUserNickname } from "../users/Model.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

export class Player implements IPlayer {
    private _playerIndex?               : number;
    private _fund?                      : number;
    private _hasVotedForDraw?           : boolean;
    private _aliveState?                : AliveStateId;
    private _restTimeToBoot?            : number;
    private _userId?                    : number | null;
    private _unitAndTileSkinId?         : number;
    private _coId?                      : number;
    private _coCurrentEnergy            = 0;
    private _coUsingSkillType?          : SkillTypeId;
    private _coIsDestroyedInTurn?       : boolean;
    private _coPowerActivatedCount?     : number;
    private _watchOngoingSrcUserIds?    : Set<number>;
    private _watchRequestSrcUserIds?    : Set<number>;
    private _markedGridList             = new Array<GridIdAndMarkTypeId>();
    private _hiddenGridMarkTypeIdList   = new Array<number>();
    private _isSkipTurn                 = false;

    private _war?                       : IBwWar;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public init(data: SerialPlayer, gcData: GcData): void {
        const coId = data.getCoId();
        if (gcData.getCoBasicCfg(coId) == null) {
            throw newError(`Invalid coId: ${coId}`, ClientErrorCode.BwPlayer_Init_01);
        }

        const fund              = data.getFund();
        const hasVotedForDraw   = data.getHasVotedForDraw();
        const aliveState        = data.getAliveState();
        if ((aliveState !== AliveStateId.Alive) &&
            (aliveState !== AliveStateId.Dead)  &&
            (aliveState !== AliveStateId.Dying)
        ) {
            throw newError(`Invalid aliveState: ${aliveState}`, ClientErrorCode.BwPlayer_Init_02);
        }

        const playerIndex = data.getPlayerIndex();
        if ((playerIndex > PlayerIndex.Max)   ||
            (playerIndex < PlayerIndex.Neutral)
        ) {
            throw newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwPlayer_Init_03);
        }

        const restTimeToBoot        = data.getRestTimeToBoot();
        const coIsDestroyedInTurn   = data.getCoIsDestroyedInTurn();
        const unitAndTileSkinId     = data.getUnitAndTileSkinId();
        if (((unitAndTileSkinId === 0) && (playerIndex !== PlayerIndex.Neutral))  ||
            ((unitAndTileSkinId !== 0) && (playerIndex === PlayerIndex.Neutral))
        ) {
            throw newError(`Invalid unitAndTileSkinId: ${unitAndTileSkinId}`, ClientErrorCode.BwPlayer_Init_06);
        }

        const coUsingSkillType  = data.getCoUsingSkillType();
        if ((coUsingSkillType !== SkillTypeId.Passive)  &&
            (coUsingSkillType !== SkillTypeId.Power)    &&
            (coUsingSkillType !== SkillTypeId.SuperPower)
        ) {
            throw newError(`Invalid coUsingSkillType: ${coUsingSkillType}`, ClientErrorCode.BwPlayer_Init_08);
        }

        // if (((coUsingSkillType === CoSkillType.Power)       && (!(coConfig.powerSkills || []).length))      ||
        //     ((coUsingSkillType === CoSkillType.SuperPower)  && (!(coConfig.superPowerSkills || []).length))
        // ) {
        //     throw Helpers.newError(`Invalid coUsingSkillType: ${coUsingSkillType}`, ClientErrorCode.BwPlayer_Init_09);
        // }

        const coCurrentEnergy = data.getCoCurrentEnergy() || 0;
        // if (coCurrentEnergy > WarCommonHelpers.getCoMaxEnergy(coConfig)) {
        //     throw Helpers.newError(`Invalid coCurrentEnergy: ${coCurrentEnergy}`, ClientErrorCode.BwPlayer_Init_10);
        // }

        // if ((playerIndex === GameConfig.WarNeutralPlayerIndex) &&
        //     (aliveState !== PlayerAliveState.Alive)
        // ) {
        //     throw Helpers.newError(`The neutral player is not alive.`, ClientErrorCode.BwPlayer_Init_11);
        // }

        this.setFund(fund);
        this.setHasVotedForDraw(hasVotedForDraw);
        this.setAliveState(aliveState);
        this._setPlayerIndex(playerIndex);
        this.setRestTimeToBoot(restTimeToBoot);
        this.setCoUsingSkillType(coUsingSkillType);
        this.setCoIsDestroyedInTurn(coIsDestroyedInTurn);
        this.setUserId(data.getUserId() ?? null);
        this._setUnitAndTileSkinId(unitAndTileSkinId);
        this.setCoId(coId);
        this._setCoCurrentEnergy(coCurrentEnergy);
        this._setCoPowerActivatedCount(data.getCoPowerActivatedCount() ?? 0);
        this.setWatchOngoingSrcUserIds(data.getWatchOngoingSrcUserIdArray() || []);
        this.setWatchRequestSrcUserIds(data.getWatchRequestSrcUserIdArray() || []);
        this.setGridMarkList(data.getMarkedGridArray());
        this._setHiddenGridMarkTypeIdList(data.getHiddenGridMarkTypeIdArray());
        this.setIsSkipTurn(data.getIsSkipTurn() ?? false);
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
    }

    public serialize(): SerialPlayer {
        return SerialPlayer.fromJson({
            playerIndex                         : this.getPlayerIndex(),
            fund                                : this.getFund(),
            hasVotedForDraw                     : this.getHasVotedForDraw(),
            aliveState                          : this.getAliveState(),
            restTimeToBoot                      : this.getRestTimeToBoot(),
            coUsingSkillType                    : this.getCoUsingSkillType(),
            coIsDestroyedInTurn                 : this.getCoIsDestroyedInTurn(),
            unitAndTileSkinId                   : this.getUnitAndTileSkinId(),
            userId                              : this.getUserId(),
            coId                                : this.getCoId(),
            coCurrentEnergy                     : this.getCoCurrentEnergy(),
            coPowerActivatedCount               : this.getCoPowerActivatedCount(),
            watchRequestSrcUserIdArray          : [...(this.getWatchRequestSrcUserIds() || [])],
            watchOngoingSrcUserIdArray          : [...(this.getWatchOngoingSrcUserIds() || [])],
            markedGridArray                     : this.getGridMarkList().map(v => v.toJson()),
            hiddenGridMarkTypeIdArray           : this.getHiddenGridMarkTypeIdList().concat(),
            isSkipTurn                          : this.getIsSkipTurn(),
            deprecatedMarkedGridIdArray         : [],
        });
    }
    public serializeForCreateSfw(): SerialPlayer {
        const war                   = this.getWar();
        const playerIndex           = this.getPlayerIndex();
        const teamIndexes           = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const shouldShowFund        = (war.getShouldSerializeFullInfoForFreeModeGames()) || (!war.getFogMap().checkHasFogCurrently()) || (teamIndexes.has(this.getTeamIndex()));
        return SerialPlayer.fromJson({
            playerIndex,
            fund                                : shouldShowFund ? this.getFund() : 0,
            hasVotedForDraw                     : this.getHasVotedForDraw(),
            aliveState                          : this.getAliveState(),
            restTimeToBoot                      : this.getRestTimeToBoot(),
            coUsingSkillType                    : this.getCoUsingSkillType(),
            coIsDestroyedInTurn                 : this.getCoIsDestroyedInTurn(),
            unitAndTileSkinId                   : this.getUnitAndTileSkinId(),
            userId                              : playerIndex > 0 ? getSelfUserId() : null,
            coId                                : this.getCoId(),
            coCurrentEnergy                     : this.getCoCurrentEnergy(),
            coPowerActivatedCount               : this.getCoPowerActivatedCount(),
            watchRequestSrcUserIdArray          : [],
            watchOngoingSrcUserIdArray          : [],
            markedGridArray                     : this.getGridMarkList().map(v => v.toJson()),
            hiddenGridMarkTypeIdArray           : this.getHiddenGridMarkTypeIdList().concat(),
            isSkipTurn                          : this.getIsSkipTurn(),
            deprecatedMarkedGridIdArray         : [],
        });
    }
    public serializeForCreateMfr(): SerialPlayer {
        const war                   = this.getWar();
        const playerIndex           = this.getPlayerIndex();
        const teamIndexes           = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const shouldShowFund        = (war.getShouldSerializeFullInfoForFreeModeGames()) || (!war.getFogMap().checkHasFogCurrently()) || (teamIndexes.has(this.getTeamIndex()));
        return SerialPlayer.fromJson({
            playerIndex,
            fund                                : shouldShowFund ? this.getFund() : 0,
            hasVotedForDraw                     : this.getHasVotedForDraw(),
            aliveState                          : this.getAliveState(),
            restTimeToBoot                      : this.getRestTimeToBoot(),
            coUsingSkillType                    : this.getCoUsingSkillType(),
            coIsDestroyedInTurn                 : this.getCoIsDestroyedInTurn(),
            unitAndTileSkinId                   : playerIndex,
            userId                              : playerIndex > 0 ? getSelfUserId() : null,
            coId                                : this.getCoId(),
            coCurrentEnergy                     : this.getCoCurrentEnergy(),
            coPowerActivatedCount               : this.getCoPowerActivatedCount(),
            watchRequestSrcUserIdArray          : [],
            watchOngoingSrcUserIdArray          : [],
            markedGridArray                     : this.getGridMarkList().map(v => v.toJson()),
            hiddenGridMarkTypeIdArray           : this.getHiddenGridMarkTypeIdList().concat(),
            isSkipTurn                          : this.getIsSkipTurn(),
            deprecatedMarkedGridIdArray         : [],
        });
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    public setFund(fund: number): void {
        if (this._fund !== fund) {
            this._fund = fund;
            dispatch(TypeId.BwPlayerFundChanged, this);
        }
    }
    public getFund(): number {
        return getExisted(this._fund);
    }

    public setHasVotedForDraw(voted: boolean): void {
        this._hasVotedForDraw = voted;
    }
    public getHasVotedForDraw(): boolean {
        return getExisted(this._hasVotedForDraw);
    }

    public setAliveState(alive: AliveStateId): void {
        this._aliveState = alive;
    }
    public getAliveState(): AliveStateId {
        return getExisted(this._aliveState);
    }

    private _setPlayerIndex(index: number): void {
        this._playerIndex = index;
    }
    public getPlayerIndex(): number {
        return getExisted(this._playerIndex);
    }
    public checkIsNeutral(): boolean {
        return this.getPlayerIndex() === PlayerIndex.Neutral;
    }

    public getTeamIndex(): number {
        return this.getWar().getCommonSettingManager().getPlayerRule(this.getPlayerIndex()).getTeamIndex();
    }

    public setRestTimeToBoot(seconds: number): void {
        this._restTimeToBoot = seconds;
    }
    public getRestTimeToBoot(): number {
        return getExisted(this._restTimeToBoot);
    }

    public setWatchOngoingSrcUserIds(list: number[]): void {
        this._watchOngoingSrcUserIds = new Set(list);
    }
    public getWatchOngoingSrcUserIds(): Set<number> {
        return getExisted(this._watchOngoingSrcUserIds);
    }
    public addWatchOngoingSrcUserId(userId: number): void {
        this.getWatchOngoingSrcUserIds().add(userId);
    }
    public removeWatchOngoingSrcUserId(userId: number): void {
        this.getWatchOngoingSrcUserIds().delete(userId);
    }

    public setWatchRequestSrcUserIds(list: number[]): void {
        this._watchRequestSrcUserIds = new Set(list);
    }
    public getWatchRequestSrcUserIds(): Set<number> {
        return getExisted(this._watchRequestSrcUserIds);
    }
    public addWatchRequestSrcUserId(userId: number): void {
        this.getWatchRequestSrcUserIds().add(userId);
    }
    public removeWatchRequestSrcUserId(userId: number): void {
        this.getWatchRequestSrcUserIds().delete(userId);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for marker.
    ////////////////////////////////////////////////////////////////////////////////
    public setGridMarkList(newMarkedGridList: GridIdAndMarkTypeId[]): void {
        const list  = this.getGridMarkList();
        list.length = 0;

        for (const gridId of newMarkedGridList) {
            list.push(gridId);
        }
    }
    public getGridMarkList(): GridIdAndMarkTypeId[] {
        return this._markedGridList;
    }
    // public getMarkedGridIdArrayForTeamIndexes(teamIndexes: Set<number>): number[] {
    //     return teamIndexes.has(this.getTeamIndex())
    //         ? this._markedGridIdArray
    //         : [];
    // }
    public getMarkTypeId(gridId: number): Undefinable<number> {
        for (const data of this.getGridMarkList()) {
            if (data.getGridId() === gridId) {
                return data.getMarkTypeId();
            }
        }

        return undefined;
    }
    public addGridMark(gridId: number, markTypeId: number): boolean {
        const isAdded = addGridMark(this.getGridMarkList(), gridId, markTypeId);
        if (isAdded) {
            dispatch(TypeId.GridMarkAdded, {
                war     : this.getWar(),
                gridId  : gridId,
            } as GridMarkAdded);
        }
        return isAdded;
    }
    public deleteGridMark(gridId: number): boolean {
        const isDeleted = deleteGridMark(this.getGridMarkList(), gridId);
        if (isDeleted) {
            dispatch(TypeId.GridMarkDeleted, {
                war     : this.getWar(),
                gridId  : gridId,
            } as GridMarkDeleted);
        }
        return isDeleted;
    }
    public updateGridMarkList(gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void {
        updateGridMarkList(this.getGridMarkList(), gridIdArrayForAddMark, gridIdArrayForDeleteMark, markTypeId);

        dispatch(TypeId.GridMarkListChanged, {
            war: this.getWar(),
        } as GridMarkListChanged);
    }

    private _setHiddenGridMarkTypeIdList(newHiddenGridMarkTypeIdList: number[]): void {
        const list  = this.getHiddenGridMarkTypeIdList();
        list.length = 0;
        list.push(...newHiddenGridMarkTypeIdList);
    }
    public updateHiddenGridMarkTypeIdList(playerIndexes: number[]): void {
        if (!checkIsSameSet(new Set(playerIndexes), new Set(this.getHiddenGridMarkTypeIdList()))) {
            this._setHiddenGridMarkTypeIdList(playerIndexes);

            dispatch(TypeId.BwPlayerPlayerIndexArrayForShowMarkedGridUpdated, {
                player  : this,
            } as BwPlayerPlayerIndexArrayForShowMarkedGridUpdated);
        }
    }
    public getHiddenGridMarkTypeIdList(): number[] {
        return this._hiddenGridMarkTypeIdList;
    }
    public getHiddenGridMarkTypeIdListForTeams(teamIndexes: Set<number>): number[] {
        return teamIndexes.has(this.getTeamIndex())
            ? this.getHiddenGridMarkTypeIdList()
            : [];
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for skip turn.
    ////////////////////////////////////////////////////////////////////////////////
    public setIsSkipTurn(isSkipTurn: boolean): void {
        this._isSkipTurn = isSkipTurn;
    }
    public getIsSkipTurn(): boolean {
        return this._isSkipTurn;
    }

    public setUserId(id: number | null): void {
        this._userId = id;
    }
    public getUserId(): number | null {
        return getDefined(this._userId, ClientErrorCode.BwPlayer_GetUserId_00);
    }

    private _setUnitAndTileSkinId(unitAndTileSkinId: number): void {
        this._unitAndTileSkinId = unitAndTileSkinId;
    }
    public getUnitAndTileSkinId(): number {
        return getExisted(this._unitAndTileSkinId);
    }

    public async getNickname(): Promise<string> {
        const userId = this.getUserId();
        return (userId == null)
            ?  `A.I.`
            : await getUserNickname(userId) || `??`;
    }

    public setCoId(coId: number): void {
        if (this._coId !== coId) {
            this._coId = coId;
            dispatch(TypeId.BwCoIdChanged, this);
        }
    }
    public getCoId(): number {
        return getExisted(this._coId);
    }
    public getCoCategoryId(): number {
        return getExisted(this.getWar().getGcData().getCoBasicCfg(this.getCoId())?.getCoCategoryId());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _setCoCurrentEnergy(energy: number): void {
        if (!checkIsValidEnergy(energy)) {
            throw newError(`Invalid energy: ${energy}`);
        }
        this._coCurrentEnergy = energy;
        dispatch(TypeId.BwCoEnergyChanged);
    }
    public setAndValidateCoCurrentEnergy(energy: number): void {
        this._setCoCurrentEnergy(getValidEnergy(energy));
    }
    public addAndValidateCoCurrentEnergy(offset: number): void {
        if (offset === 0) {
            return;
        }

        const minEnergy     = 0;
        const maxEnergy     = this.getCoMaxEnergy();
        const currentEnergy = this.getCoCurrentEnergy();
        if (((offset > 0) && (currentEnergy < maxEnergy)) ||
            ((offset < 0) && (currentEnergy > minEnergy))
        ) {
            this.setAndValidateCoCurrentEnergy(getValueInRange({
                minValue    : minEnergy,
                maxValue    : maxEnergy,
                rawValue    : currentEnergy + offset,
            }));
        }
    }

    public getCoCurrentEnergy(): number {
        return this._coCurrentEnergy;
    }
    public getCoMaxEnergy(): number {
        return this._getCoRevisedRequiredEnergy(getCoMaxEnergy(this.getCoBasicCfg()));
    }
    public getCoZoneExpansionEnergyList(): number[] | null {
        const cfg = this.getCoBasicCfg();
        return cfg ? cfg.getZoneExpansionEnergyList() ?? null : null;
    }
    public getCoPowerEnergy(): number | null {
        const energyList    = this.getCoBasicCfg().getPowerEnergyList();
        const energy        = energyList ? energyList[0] : null;
        if ((energy == null) || (energy < 0)) {
            return null;
        } else {
            return this._getCoRevisedRequiredEnergy(energy);
        }
    }
    public getCoSuperPowerEnergy(): number | null {
        const energyList    = this.getCoBasicCfg().getPowerEnergyList();
        const energy        = energyList ? energyList[1] : null;
        if ((energy == null) || (energy < 0)) {
            return null;
        } else {
            return this._getCoRevisedRequiredEnergy(energy);
        }
    }
    private _getCoRevisedRequiredEnergy(rawRequiredEnergy: number): number {
        const cfg = getExisted(this.getCoBasicCfg().getCoEnergyRequirementParams(), ClientErrorCode.BwPlayer_GetRevisedEnergy_00);
        return getValueInInt32(rawRequiredEnergy * (Math.min(cfg[1], this.getCoPowerActivatedCount()) * cfg[0] + 100) / 100);
    }

    public getCoEnergyType(): EnergyTypeId {
        return getExisted(this.getCoBasicCfg().getCoEnergyTypeId(), ClientErrorCode.BwPlayer_GetCoEnergyType_00);
    }
    public getCoPowerActivatedCount(): number {
        return getExisted(this._coPowerActivatedCount, ClientErrorCode.BwPlayer_GetCoPowerActivatedCount_00);
    }
    private _setCoPowerActivatedCount(count: number): void {
        this._coPowerActivatedCount = count;
    }

    public getCoZoneRadius(): number {
        const cfg       = this.getCoBasicCfg();
        const energy    = this.getCoCurrentEnergy();
        let radius      = getExisted(cfg.getZoneRadius());
        for (const e of cfg.getZoneExpansionEnergyList() ?? []) {
            if (energy >= e) {
                ++radius;
            }
        }

        return getValueInRange({
            minValue    : 0,
            maxValue    : MaxInt32,
            rawValue    : Math.floor(radius + this.getWar().getWarEventManager().getOpaCoZoneRadiusModifier(this.getPlayerIndex())),
        });
    }
    public getCoGridIndexListOnMap(): GridIndex[] {
        return this.getWar().getUnitMap().getCoGridIndexListOnMap(this.getPlayerIndex());
    }
    public getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet: Set<number>): GridIndex[] {
        return this.getWar().getUnitMap().getVisibleCoGridIndexArrayOnMap(this.getPlayerIndex(), observerTeamIndexSet);
    }

    public checkIsInCoZone(targetGridIndex: GridIndex, coGridIndexOnMap: GridIndex[]): boolean {
        return targetGridIndex.getMinDistance(coGridIndexOnMap) <= this.getCoZoneRadius();
    }

    public getCoUsingSkillType(): SkillTypeId {
        return getExisted(this._coUsingSkillType);
    }
    public setCoUsingSkillType(skillType: SkillTypeId): void {
        if (this._coUsingSkillType !== skillType) {
            this._coUsingSkillType = skillType;
            dispatch(TypeId.BwCoUsingSkillTypeChanged);
        }
    }
    public getCoCurrentSkills(): number[] {
        return this.getCoSkills(this.getCoUsingSkillType());
    }
    public getCoSkills(skillType: SkillTypeId): number[] {
        const cfg = this.getCoBasicCfg();
        switch (skillType) {
            case SkillTypeId.Passive      : return cfg.getPassiveSkillIds() || [];
            case SkillTypeId.Power        : return cfg.getPowerSkillIds() || [];
            case SkillTypeId.SuperPower   : return cfg.getSuperPowerSkillIds() || [];
            default                             : throw newError(`Invalid skillType: ${skillType}`);
        }
    }
    public checkCoIsUsingActiveSkill(): boolean {
        const t = this.getCoUsingSkillType();
        return (t === SkillTypeId.Power) || (t === SkillTypeId.SuperPower);
    }
    public checkHasZoneSkillForCurrentSkills(): boolean {
        const currentSkills = this.getCoCurrentSkills();
        if ((!currentSkills) || (!currentSkills.length)) {
            return true;
        } else {
            const gameConfig = this.getWar().getGcData();
            for (const skillId of currentSkills) {
                if (gameConfig.getCoSkillCfg(skillId)?.getShowZone()) {
                    return true;
                }
            }
            return false;
        }
    }
    public checkCanUseCoSkill(skillType: SkillTypeId): boolean {
        const war = this.getWar();
        if ((this.getCoEnergyType() !== EnergyTypeId.Trilogy)                                                                                           ||
            (getPowerSkillTargetsCount(this.getCoBasicCfg(), skillType) > war.getTileMap().getMapSize().getGridsCount())
        ) {
            return false;
        }

        if ((this.checkCoIsUsingActiveSkill())  ||
            (!this.getCoSkills(skillType))
        ) {
            return false;
        }

        {
            const playerIndex       = this.getPlayerIndex();
            const canActivateByOpa  = war.getWarEventManager().checkOpaCanActivateCoSkill(playerIndex);
            if (canActivateByOpa === false) {
                return false;
            } else if (canActivateByOpa == null) {
                if (!war.getCommonSettingManager().getPlayerRule(playerIndex).getCanActivateCoSkill()) {
                    return false;
                }
            }
        }

        const energy = this.getCoCurrentEnergy();
        if (skillType === SkillTypeId.Power) {
            const powerEnergy = this.getCoPowerEnergy();
            return (powerEnergy != null) && (energy >= powerEnergy);

        } else if (skillType === SkillTypeId.SuperPower) {
            const superPowerEnergy = this.getCoSuperPowerEnergy();
            return (superPowerEnergy != null) && (energy >= superPowerEnergy);

        } else {
            return false;
        }
    }
    public checkCanGetEnergyWithBattle(): boolean {
        return (!!this.getCoBasicCfg().getCanGetEnergyWithBattleOnPowerSkills())
            || (!this.checkCoIsUsingActiveSkill());
    }

    public updateOnUseCoSkill(skillType: SkillTypeId): void {
        if (skillType === SkillTypeId.Power) {
            this.addAndValidateCoCurrentEnergy(-getExisted(this.getCoPowerEnergy()));

        } else if (skillType === SkillTypeId.SuperPower) {
            this.addAndValidateCoCurrentEnergy(-getExisted(this.getCoSuperPowerEnergy()));

        } else {
            throw newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwPlayer_UpdateOnUseCoSkill_02);
        }

        this._setCoPowerActivatedCount(this.getCoPowerActivatedCount() + 1);
        this.setCoUsingSkillType(skillType);
    }

    public getCoIsDestroyedInTurn(): boolean {
        return getExisted(this._coIsDestroyedInTurn);
    }
    public setCoIsDestroyedInTurn(isDestroyed: boolean): void {
        this._coIsDestroyedInTurn = isDestroyed;
    }

    public getCoMaxBoardCount(): number {
        return getExisted(this.getCoBasicCfg().getMaxBoardCount());
    }

    public getUnitCostModifier(unitTypeId: number): number {
        if (this.getCoId() === CoId.Empty) {
            return 1;
        }

        // const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => this.getCoGridIndexListOnMap());
        const gameConfig                = this.getWar().getGcData();
        let modifier                    = 1;
        for (const skillId of this.getCoCurrentSkills()) {
            modifier *= getTotalMultiplier({
                gameConfig  : gameConfig,
                cfg         : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCost(),
                unitTypeId  : unitTypeId,
            });
        }

        return modifier;
    }

    public getCoBasicCfg(): CoBasicCfg {
        return getExisted(this.getWar().getGcData().getCoBasicCfg(this.getCoId()));
    }
}
