import {
    GridMarks_Utils,
    Players_Constants,
    Helpers_Collection,
    Cos_Utils,
    Utils_ClientErrorCode,
    Cos_Constants,
    Notifications_Dispatcher,
    Helpers_Misc,
    CoSkills_Utils_Common,
    Users_Model,
    CoSkills_Utils_Persistent_SelfUnitCost,
    Numbers_Utils,
    Numbers_Constants,
    CoSkills_Constants,
    Notifications_TypeId,
    type Notifications_DataTypes,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { CoBasicCfg } from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";
import type { GridIdAndMarkTypeId } from "../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import { SerialPlayer } from "../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";

export class Player implements Players_IPlayer.IPlayer {
    private _playerIndex?               : number;
    private _fund?                      : number;
    private _hasVotedForDraw?           : boolean;
    private _aliveState?                : Players_Constants.AliveStateId;
    private _restTimeToBoot?            : number;
    private _userId?                    : number | null;
    private _unitAndTileSkinId?         : number;
    private _coId?                      : number;
    private _coCurrentEnergy            = 0;
    private _coUsingSkillType?          : CoSkills_Constants.SkillTypeId;
    private _coIsDestroyedInTurn?       : boolean;
    private _coPowerActivatedCount?     : number;
    private _watchOngoingSrcUserIds?    : Set<number>;
    private _watchRequestSrcUserIds?    : Set<number>;
    private _markedGridList             = new Array<GridIdAndMarkTypeId>();
    private _hiddenGridMarkTypeIdList   = new Array<number>();
    private _isSkipTurn                 = false;

    private _war?                       : BaseWar_Interface_IBwWar.IBwWar;

     
    public init(data: SerialPlayer, gcData: GameConfigs_GameConfig.GameConfig): void {
        const coId = data.getCoId();
        if (gcData.getCoBasicCfg(coId) == null) {
            throw Helpers_Misc.newError(`Invalid coId: ${coId}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_Init_01);
        }

        const fund              = data.getFund();
        const hasVotedForDraw   = data.getHasVotedForDraw();
        const aliveState        = data.getAliveState();
        if ((aliveState !== Players_Constants.AliveStateId.Alive) &&
            (aliveState !== Players_Constants.AliveStateId.Dead)  &&
            (aliveState !== Players_Constants.AliveStateId.Dying)
        ) {
            throw Helpers_Misc.newError(`Invalid aliveState: ${aliveState}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_Init_02);
        }

        const playerIndex = data.getPlayerIndex();
        if ((playerIndex > Players_Constants.PlayerIndex.Max)   ||
            (playerIndex < Players_Constants.PlayerIndex.Neutral)
        ) {
            throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_Init_03);
        }

        const restTimeToBoot        = data.getRestTimeToBoot();
        const coIsDestroyedInTurn   = data.getCoIsDestroyedInTurn();
        const unitAndTileSkinId     = data.getUnitAndTileSkinId();
        if (((unitAndTileSkinId === 0) && (playerIndex !== Players_Constants.PlayerIndex.Neutral))  ||
            ((unitAndTileSkinId !== 0) && (playerIndex === Players_Constants.PlayerIndex.Neutral))
        ) {
            throw Helpers_Misc.newError(`Invalid unitAndTileSkinId: ${unitAndTileSkinId}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_Init_06);
        }

        const coUsingSkillType  = data.getCoUsingSkillType();
        if ((coUsingSkillType !== CoSkills_Constants.SkillTypeId.Passive)  &&
            (coUsingSkillType !== CoSkills_Constants.SkillTypeId.Power)    &&
            (coUsingSkillType !== CoSkills_Constants.SkillTypeId.SuperPower)
        ) {
            throw Helpers_Misc.newError(`Invalid coUsingSkillType: ${coUsingSkillType}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_Init_08);
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
        this._setCoPowerActivatedCount(data.getCoPowerActivatedCount());
        this.setWatchOngoingSrcUserIds(data.getWatchOngoingSrcUserIdArray() || []);
        this.setWatchRequestSrcUserIds(data.getWatchRequestSrcUserIdArray() || []);
        this.setGridMarkList(data.getMarkedGridArray());
        this._setHiddenGridMarkTypeIdList(data.getHiddenGridMarkTypeIdArray());
        this.setIsSkipTurn(data.getIsSkipTurn());
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._setWar(war);
    }

    public serialize(): SerialPlayer {
        return SerialPlayer.fromJson({
            playerIndex                 : this.getPlayerIndex(),
            fund                        : this.getFund(),
            hasVotedForDraw             : this.getHasVotedForDraw(),
            aliveState                  : this.getAliveState(),
            restTimeToBoot              : this.getRestTimeToBoot(),
            coUsingSkillType            : this.getCoUsingSkillType(),
            coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
            unitAndTileSkinId           : this.getUnitAndTileSkinId(),
            userId                      : this.getUserId(),
            coId                        : this.getCoId(),
            coCurrentEnergy             : this.getCoCurrentEnergy(),
            coPowerActivatedCount       : this.getCoPowerActivatedCount(),
            watchRequestSrcUserIdArray  : [...(this.getWatchRequestSrcUserIds() || [])],
            watchOngoingSrcUserIdArray  : [...(this.getWatchOngoingSrcUserIds() || [])],
            markedGridArray             : this.getGridMarkList().map(v => v.toJson()),
            hiddenGridMarkTypeIdArray   : this.getHiddenGridMarkTypeIdList().concat(),
            isSkipTurn                  : this.getIsSkipTurn(),
            deprecatedMarkedGridIdArray : [],
        });
    }
    public serializeForCreateSfw(): SerialPlayer {
        const war                   = this.getWar();
        const playerIndex           = this.getPlayerIndex();
        const teamIndexes           = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const shouldShowFund        = (war.getShouldSerializeFullInfoForFreeModeGames()) || (!war.getFogMap().checkHasFogCurrently()) || (teamIndexes.has(this.getTeamIndex()));
        return SerialPlayer.fromJson({
            playerIndex,
            fund                        : shouldShowFund ? this.getFund() : 0,
            hasVotedForDraw             : this.getHasVotedForDraw(),
            aliveState                  : this.getAliveState(),
            restTimeToBoot              : this.getRestTimeToBoot(),
            coUsingSkillType            : this.getCoUsingSkillType(),
            coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
            unitAndTileSkinId           : this.getUnitAndTileSkinId(),
            userId                      : playerIndex > 0 ? Users_Model.getSelfUserId() : null,
            coId                        : this.getCoId(),
            coCurrentEnergy             : this.getCoCurrentEnergy(),
            coPowerActivatedCount       : this.getCoPowerActivatedCount(),
            watchRequestSrcUserIdArray  : [],
            watchOngoingSrcUserIdArray  : [],
            markedGridArray             : this.getGridMarkList().map(v => v.toJson()),
            hiddenGridMarkTypeIdArray   : this.getHiddenGridMarkTypeIdList().concat(),
            isSkipTurn                  : this.getIsSkipTurn(),
            deprecatedMarkedGridIdArray : [],
        });
    }
    public serializeForCreateMfr(): SerialPlayer {
        const war                   = this.getWar();
        const playerIndex           = this.getPlayerIndex();
        const teamIndexes           = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const shouldShowFund        = (war.getShouldSerializeFullInfoForFreeModeGames()) || (!war.getFogMap().checkHasFogCurrently()) || (teamIndexes.has(this.getTeamIndex()));
        return SerialPlayer.fromJson({
            playerIndex,
            fund                        : shouldShowFund ? this.getFund() : 0,
            hasVotedForDraw             : this.getHasVotedForDraw(),
            aliveState                  : this.getAliveState(),
            restTimeToBoot              : this.getRestTimeToBoot(),
            coUsingSkillType            : this.getCoUsingSkillType(),
            coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
            unitAndTileSkinId           : playerIndex,
            userId                      : playerIndex > 0 ? Users_Model.getSelfUserId() : null,
            coId                        : this.getCoId(),
            coCurrentEnergy             : this.getCoCurrentEnergy(),
            coPowerActivatedCount       : this.getCoPowerActivatedCount(),
            watchRequestSrcUserIdArray  : [],
            watchOngoingSrcUserIdArray  : [],
            markedGridArray             : this.getGridMarkList().map(v => v.toJson()),
            hiddenGridMarkTypeIdArray   : this.getHiddenGridMarkTypeIdList().concat(),
            isSkipTurn                  : this.getIsSkipTurn(),
            deprecatedMarkedGridIdArray : [],
        });
    }

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    public setFund(fund: number): void {
        if (this._fund !== fund) {
            this._fund = fund;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwPlayerFundChanged, this);
        }
    }
    public getFund(): number {
        return Helpers_Misc.getExisted(this._fund);
    }

    public setHasVotedForDraw(voted: boolean): void {
        this._hasVotedForDraw = voted;
    }
    public getHasVotedForDraw(): boolean {
        return Helpers_Misc.getExisted(this._hasVotedForDraw);
    }

    public setAliveState(alive: Players_Constants.AliveStateId): void {
        this._aliveState = alive;
    }
    public getAliveState(): Players_Constants.AliveStateId {
        return Helpers_Misc.getExisted(this._aliveState);
    }

    private _setPlayerIndex(index: number): void {
        this._playerIndex = index;
    }
    public getPlayerIndex(): number {
        return Helpers_Misc.getExisted(this._playerIndex);
    }
    public checkIsNeutral(): boolean {
        return this.getPlayerIndex() === Players_Constants.PlayerIndex.Neutral;
    }

    public getTeamIndex(): number {
        return this.getWar().getCommonSettingManager().getPlayerRule(this.getPlayerIndex()).getTeamIndex();
    }

    public setRestTimeToBoot(seconds: number): void {
        this._restTimeToBoot = seconds;
    }
    public getRestTimeToBoot(): number {
        return Helpers_Misc.getExisted(this._restTimeToBoot);
    }

    public setWatchOngoingSrcUserIds(list: number[]): void {
        this._watchOngoingSrcUserIds = new Set(list);
    }
    public getWatchOngoingSrcUserIds(): Set<number> {
        return Helpers_Misc.getExisted(this._watchOngoingSrcUserIds);
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
        return Helpers_Misc.getExisted(this._watchRequestSrcUserIds);
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
    public getMarkTypeId(gridId: number): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        for (const data of this.getGridMarkList()) {
            if (data.getGridId() === gridId) {
                return data.getMarkTypeId();
            }
        }

        return undefined;
    }
    public addGridMark(gridId: number, markTypeId: number): boolean {
        const isAdded = GridMarks_Utils.addGridMark(this.getGridMarkList(), gridId, markTypeId);
        if (isAdded) {
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkAdded, {
                war    : this.getWar(),
                gridId : gridId,
            } as Notifications_DataTypes.GridMarkAdded);
        }
        return isAdded;
    }
    public deleteGridMark(gridId: number): boolean {
        const isDeleted = GridMarks_Utils.deleteGridMark(this.getGridMarkList(), gridId);
        if (isDeleted) {
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkDeleted, {
                war    : this.getWar(),
                gridId : gridId,
            } as Notifications_DataTypes.GridMarkDeleted);
        }
        return isDeleted;
    }
    public updateGridMarkList(gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void {
        GridMarks_Utils.updateGridMarkList(this.getGridMarkList(), gridIdArrayForAddMark, gridIdArrayForDeleteMark, markTypeId);

        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
            war : this.getWar(),
        } as Notifications_DataTypes.GridMarkListChanged);
    }

    private _setHiddenGridMarkTypeIdList(newHiddenGridMarkTypeIdList: number[]): void {
        const list  = this.getHiddenGridMarkTypeIdList();
        list.length = 0;
        list.push(...newHiddenGridMarkTypeIdList);
    }
    public updateHiddenGridMarkTypeIdList(playerIndexes: number[]): void {
        if (!Helpers_Collection.checkIsSameSet(new Set(playerIndexes), new Set(this.getHiddenGridMarkTypeIdList()))) {
            this._setHiddenGridMarkTypeIdList(playerIndexes);

            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwPlayerPlayerIndexArrayForShowMarkedGridUpdated, {
                player : this,
            } as Notifications_DataTypes.BwPlayerPlayerIndexArrayForShowMarkedGridUpdated);
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
        return Helpers_Misc.getDefined(this._userId, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_GetUserId_00);
    }

    private _setUnitAndTileSkinId(unitAndTileSkinId: number): void {
        this._unitAndTileSkinId = unitAndTileSkinId;
    }
    public getUnitAndTileSkinId(): number {
        return Helpers_Misc.getExisted(this._unitAndTileSkinId);
    }

    public async getNickname(): Promise<string> {
        const userId = this.getUserId();
        return (userId == null)
            ?  `A.I.`
            : await Users_Model.getUserNickname(userId) || `??`;
    }

    public setCoId(coId: number): void {
        if (this._coId !== coId) {
            this._coId = coId;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwCoIdChanged, this);
        }
    }
    public getCoId(): number {
        return Helpers_Misc.getExisted(this._coId);
    }
    public getCoCategoryId(): number {
        return Helpers_Misc.getExisted(this.getWar().getGcData().getCoBasicCfg(this.getCoId())?.getCoCategoryId());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _setCoCurrentEnergy(energy: number): void {
        if (!Cos_Utils.checkIsValidEnergy(energy)) {
            throw Helpers_Misc.newError(`Invalid energy: ${energy}`);
        }
        this._coCurrentEnergy = energy;
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwCoEnergyChanged);
    }
    public setAndValidateCoCurrentEnergy(energy: number): void {
        this._setCoCurrentEnergy(Cos_Utils.getValidEnergy(energy));
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
            this.setAndValidateCoCurrentEnergy(Numbers_Utils.getValueInRange({
                minValue : minEnergy,
                maxValue : maxEnergy,
                rawValue : currentEnergy + offset,
            }));
        }
    }

    public getCoCurrentEnergy(): number {
        return this._coCurrentEnergy;
    }
    public getCoMaxEnergy(): number {
        return this._getCoRevisedRequiredEnergy(Cos_Utils.getCoMaxEnergy(this.getCoBasicCfg()));
    }
    public getCoZoneExpansionEnergyList(): number[] | null {
        const cfg = this.getCoBasicCfg();
        return cfg ? cfg.getZoneExpansionEnergyList() : null;
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
        const cfg = this.getCoBasicCfg().getCoEnergyRequirementParams();
        return Numbers_Utils.getValueInInt32(rawRequiredEnergy * (Math.min(cfg[1], this.getCoPowerActivatedCount()) * cfg[0] + 100) / 100);
    }

    public getCoEnergyType(): Cos_Constants.EnergyTypeId {
        return this.getCoBasicCfg().getCoEnergyTypeId();
    }
    public getCoPowerActivatedCount(): number {
        return Helpers_Misc.getExisted(this._coPowerActivatedCount, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_GetCoPowerActivatedCount_00);
    }
    private _setCoPowerActivatedCount(count: number): void {
        this._coPowerActivatedCount = count;
    }

    public getCoZoneRadius(): number {
        const cfg       = this.getCoBasicCfg();
        const energy    = this.getCoCurrentEnergy();
        let radius      = cfg.getZoneRadius();
        for (const e of cfg.getZoneExpansionEnergyList()) {
            if (energy >= e) {
                ++radius;
            }
        }

        return Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Numbers_Constants.MaxInt32,
            rawValue : Math.floor(radius + this.getWar().getWarEventManager().getOpaCoZoneRadiusModifier(this.getPlayerIndex())),
        });
    }
    public getCoGridIndexListOnMap(): AuxiliaryTypes_GridIndex.GridIndex[] {
        return this.getWar().getUnitMap().getCoGridIndexListOnMap(this.getPlayerIndex());
    }
    public getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet: Set<number>): AuxiliaryTypes_GridIndex.GridIndex[] {
        return this.getWar().getUnitMap().getVisibleCoGridIndexArrayOnMap(this.getPlayerIndex(), observerTeamIndexSet);
    }

    public checkIsInCoZone(targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex, coGridIndexOnMap: AuxiliaryTypes_GridIndex.GridIndex[]): boolean {
        return targetGridIndex.getMinDistance(coGridIndexOnMap) <= this.getCoZoneRadius();
    }

    public getCoUsingSkillType(): CoSkills_Constants.SkillTypeId {
        return Helpers_Misc.getExisted(this._coUsingSkillType);
    }
    public setCoUsingSkillType(skillType: CoSkills_Constants.SkillTypeId): void {
        if (this._coUsingSkillType !== skillType) {
            this._coUsingSkillType = skillType;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwCoUsingSkillTypeChanged);
        }
    }
    public getCoCurrentSkills(): number[] {
        return this.getCoSkills(this.getCoUsingSkillType());
    }
    public getCoSkills(skillType: CoSkills_Constants.SkillTypeId): number[] {
        const cfg = this.getCoBasicCfg();
        switch (skillType) {
            case CoSkills_Constants.SkillTypeId.Passive      : return cfg.getPassiveSkillIds() || [];
            case CoSkills_Constants.SkillTypeId.Power        : return cfg.getPowerSkillIds() || [];
            case CoSkills_Constants.SkillTypeId.SuperPower   : return cfg.getSuperPowerSkillIds() || [];
            default                             : throw Helpers_Misc.newError(`Invalid skillType: ${skillType}`);
        }
    }
    public checkCoIsUsingActiveSkill(): boolean {
        const t = this.getCoUsingSkillType();
        return (t === CoSkills_Constants.SkillTypeId.Power) || (t === CoSkills_Constants.SkillTypeId.SuperPower);
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
    public checkCanUseCoSkill(skillType: CoSkills_Constants.SkillTypeId): boolean {
        const war = this.getWar();
        if ((this.getCoEnergyType() !== Cos_Constants.EnergyTypeId.Trilogy)                                                                                           ||
            (CoSkills_Utils_Common.getPowerSkillTargetsCount(this.getCoBasicCfg(), skillType) > war.getTileMap().getMapSize().getGridsCount())
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
        if (skillType === CoSkills_Constants.SkillTypeId.Power) {
            const powerEnergy = this.getCoPowerEnergy();
            return (powerEnergy != null) && (energy >= powerEnergy);

        } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
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

    public updateOnUseCoSkill(skillType: CoSkills_Constants.SkillTypeId): void {
        if (skillType === CoSkills_Constants.SkillTypeId.Power) {
            this.addAndValidateCoCurrentEnergy(-Helpers_Misc.getExisted(this.getCoPowerEnergy()));

        } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
            this.addAndValidateCoCurrentEnergy(-Helpers_Misc.getExisted(this.getCoSuperPowerEnergy()));

        } else {
            throw Helpers_Misc.newError(`Invalid skillType: ${skillType}`, Utils_ClientErrorCode.ClientErrorCode.BwPlayer_UpdateOnUseCoSkill_02);
        }

        this._setCoPowerActivatedCount(this.getCoPowerActivatedCount() + 1);
        this.setCoUsingSkillType(skillType);
    }

    public getCoIsDestroyedInTurn(): boolean {
        return Helpers_Misc.getExisted(this._coIsDestroyedInTurn);
    }
    public setCoIsDestroyedInTurn(isDestroyed: boolean): void {
        this._coIsDestroyedInTurn = isDestroyed;
    }

    public getCoMaxBoardCount(): number {
        return this.getCoBasicCfg().getMaxBoardCount();
    }

    public getUnitCostModifier(unitTypeId: number): number {
        if (this.getCoId() === Cos_Constants.CoId.Empty) {
            return 1;
        }

        // const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => this.getCoGridIndexListOnMap());
        const gameConfig                = this.getWar().getGcData();
        let modifier                    = 1;
        for (const skillId of this.getCoCurrentSkills()) {
            modifier *= CoSkills_Utils_Persistent_SelfUnitCost.getTotalMultiplier({
                gameConfig : gameConfig,
                cfg        : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCost(),
                unitTypeId : unitTypeId,
            });
        }

        return modifier;
    }

    public getCoBasicCfg(): CoBasicCfg {
        return Helpers_Misc.getExisted(this.getWar().getGcData().getCoBasicCfg(this.getCoId()));
    }
}
