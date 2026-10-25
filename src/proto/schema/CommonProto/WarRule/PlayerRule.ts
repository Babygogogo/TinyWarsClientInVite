import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface PlayerRuleJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    teamIndex?: number | null | undefined;
    initialFund?: number | null | undefined;
    incomeMultiplier?: number | null | undefined;
    energyGrowthMultiplier?: number | null | undefined;
    energyAddPctOnCoBoard?: number | null | undefined;
    energyLossPctOnCoDie?: number | null | undefined;
    moveRangeModifier?: number | null | undefined;
    unitVisionRangeModifier?: number | null | undefined;
    tileVisionRangeModifier?: number | null | undefined;
    attackPowerModifier?: number | null | undefined;
    defenseModifier?: number | null | undefined;
    luckLowerLimit?: number | null | undefined;
    luckUpperLimit?: number | null | undefined;
    canActivateCoSkill?: boolean | null | undefined;
    canCoBoard?: boolean | null | undefined;
    canUnitJoin?: boolean | null | undefined;
    bannedUnitTypeArray: number[];
    maxUnitsCount?: number | null | undefined;
    bannedCoCategoryIdArray: number[];
    mcwHumanCoCategoryIdArray: number[];
    ccwHumanCoCategoryIdArray: number[];
    ccwAiCoId?: number | null | undefined;
    mmwHumanCoCategoryIdArray: number[];
    mrwHumanCoCategoryIdArray: number[];
    atwHumanCoCategoryIdArray: number[];
    srwHumanCoCategoryIdArray: number[];
    srwAiCoId?: number | null | undefined;
    campaignHumanCoIdArray: number[];
    campaignAiCoId?: number | null | undefined;
    campaignSkinId?: number | null | undefined;
}

export class PlayerRule extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _teamIndex?: number | null | undefined;
    private _initialFund?: number | null | undefined;
    private _incomeMultiplier?: number | null | undefined;
    private _energyGrowthMultiplier?: number | null | undefined;
    private _energyAddPctOnCoBoard?: number | null | undefined;
    private _energyLossPctOnCoDie?: number | null | undefined;
    private _moveRangeModifier?: number | null | undefined;
    private _unitVisionRangeModifier?: number | null | undefined;
    private _tileVisionRangeModifier?: number | null | undefined;
    private _attackPowerModifier?: number | null | undefined;
    private _defenseModifier?: number | null | undefined;
    private _luckLowerLimit?: number | null | undefined;
    private _luckUpperLimit?: number | null | undefined;
    private _canActivateCoSkill?: boolean | null | undefined;
    private _canCoBoard?: boolean | null | undefined;
    private _canUnitJoin?: boolean | null | undefined;
    private _bannedUnitTypeArray: number[] = [];
    private _maxUnitsCount?: number | null | undefined;
    private _bannedCoCategoryIdArray: number[] = [];
    private _mcwHumanCoCategoryIdArray: number[] = [];
    private _ccwHumanCoCategoryIdArray: number[] = [];
    private _ccwAiCoId?: number | null | undefined;
    private _mmwHumanCoCategoryIdArray: number[] = [];
    private _mrwHumanCoCategoryIdArray: number[] = [];
    private _atwHumanCoCategoryIdArray: number[] = [];
    private _srwHumanCoCategoryIdArray: number[] = [];
    private _srwAiCoId?: number | null | undefined;
    private _campaignHumanCoIdArray: number[] = [];
    private _campaignAiCoId?: number | null | undefined;
    private _campaignSkinId?: number | null | undefined;

    public static fromJson(obj: PlayerRuleJson): PlayerRule {
        return new PlayerRule().loadJson(obj);
    }
    public override loadJson(obj: PlayerRuleJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setTeamIndex(obj.teamIndex);
        this.setInitialFund(obj.initialFund);
        this.setIncomeMultiplier(obj.incomeMultiplier);
        this.setEnergyGrowthMultiplier(obj.energyGrowthMultiplier);
        this.setEnergyAddPctOnCoBoard(obj.energyAddPctOnCoBoard);
        this.setEnergyLossPctOnCoDie(obj.energyLossPctOnCoDie);
        this.setMoveRangeModifier(obj.moveRangeModifier);
        this.setUnitVisionRangeModifier(obj.unitVisionRangeModifier);
        this.setTileVisionRangeModifier(obj.tileVisionRangeModifier);
        this.setAttackPowerModifier(obj.attackPowerModifier);
        this.setDefenseModifier(obj.defenseModifier);
        this.setLuckLowerLimit(obj.luckLowerLimit);
        this.setLuckUpperLimit(obj.luckUpperLimit);
        this.setCanActivateCoSkill(obj.canActivateCoSkill);
        this.setCanCoBoard(obj.canCoBoard);
        this.setCanUnitJoin(obj.canUnitJoin);
        this.setBannedUnitTypeArray(obj.bannedUnitTypeArray?.concat() ?? []);
        this.setMaxUnitsCount(obj.maxUnitsCount);
        this.setBannedCoCategoryIdArray(obj.bannedCoCategoryIdArray?.concat() ?? []);
        this.setMcwHumanCoCategoryIdArray(obj.mcwHumanCoCategoryIdArray?.concat() ?? []);
        this.setCcwHumanCoCategoryIdArray(obj.ccwHumanCoCategoryIdArray?.concat() ?? []);
        this.setCcwAiCoId(obj.ccwAiCoId);
        this.setMmwHumanCoCategoryIdArray(obj.mmwHumanCoCategoryIdArray?.concat() ?? []);
        this.setMrwHumanCoCategoryIdArray(obj.mrwHumanCoCategoryIdArray?.concat() ?? []);
        this.setAtwHumanCoCategoryIdArray(obj.atwHumanCoCategoryIdArray?.concat() ?? []);
        this.setSrwHumanCoCategoryIdArray(obj.srwHumanCoCategoryIdArray?.concat() ?? []);
        this.setSrwAiCoId(obj.srwAiCoId);
        this.setCampaignHumanCoIdArray(obj.campaignHumanCoIdArray?.concat() ?? []);
        this.setCampaignAiCoId(obj.campaignAiCoId);
        this.setCampaignSkinId(obj.campaignSkinId);
        return this;
    }
    public override toJson(obj?: PlayerRuleJson): PlayerRuleJson {
        obj ??= ({} as PlayerRuleJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getTeamIndex();
            (value != null) && (obj.teamIndex = value);
        }

        {
            const value = this.getInitialFund();
            (value != null) && (obj.initialFund = value);
        }

        {
            const value = this.getIncomeMultiplier();
            (value != null) && (obj.incomeMultiplier = value);
        }

        {
            const value = this.getEnergyGrowthMultiplier();
            (value != null) && (obj.energyGrowthMultiplier = value);
        }

        {
            const value = this.getEnergyAddPctOnCoBoard();
            (value != null) && (obj.energyAddPctOnCoBoard = value);
        }

        {
            const value = this.getEnergyLossPctOnCoDie();
            (value != null) && (obj.energyLossPctOnCoDie = value);
        }

        {
            const value = this.getMoveRangeModifier();
            (value != null) && (obj.moveRangeModifier = value);
        }

        {
            const value = this.getUnitVisionRangeModifier();
            (value != null) && (obj.unitVisionRangeModifier = value);
        }

        {
            const value = this.getTileVisionRangeModifier();
            (value != null) && (obj.tileVisionRangeModifier = value);
        }

        {
            const value = this.getAttackPowerModifier();
            (value != null) && (obj.attackPowerModifier = value);
        }

        {
            const value = this.getDefenseModifier();
            (value != null) && (obj.defenseModifier = value);
        }

        {
            const value = this.getLuckLowerLimit();
            (value != null) && (obj.luckLowerLimit = value);
        }

        {
            const value = this.getLuckUpperLimit();
            (value != null) && (obj.luckUpperLimit = value);
        }

        {
            const value = this.getCanActivateCoSkill();
            (value != null) && (obj.canActivateCoSkill = value);
        }

        {
            const value = this.getCanCoBoard();
            (value != null) && (obj.canCoBoard = value);
        }

        {
            const value = this.getCanUnitJoin();
            (value != null) && (obj.canUnitJoin = value);
        }

        {
            obj.bannedUnitTypeArray = this.getBannedUnitTypeArray().concat();
        }

        {
            const value = this.getMaxUnitsCount();
            (value != null) && (obj.maxUnitsCount = value);
        }

        {
            obj.bannedCoCategoryIdArray = this.getBannedCoCategoryIdArray().concat();
        }

        {
            obj.mcwHumanCoCategoryIdArray = this.getMcwHumanCoCategoryIdArray().concat();
        }

        {
            obj.ccwHumanCoCategoryIdArray = this.getCcwHumanCoCategoryIdArray().concat();
        }

        {
            const value = this.getCcwAiCoId();
            (value != null) && (obj.ccwAiCoId = value);
        }

        {
            obj.mmwHumanCoCategoryIdArray = this.getMmwHumanCoCategoryIdArray().concat();
        }

        {
            obj.mrwHumanCoCategoryIdArray = this.getMrwHumanCoCategoryIdArray().concat();
        }

        {
            obj.atwHumanCoCategoryIdArray = this.getAtwHumanCoCategoryIdArray().concat();
        }

        {
            obj.srwHumanCoCategoryIdArray = this.getSrwHumanCoCategoryIdArray().concat();
        }

        {
            const value = this.getSrwAiCoId();
            (value != null) && (obj.srwAiCoId = value);
        }

        {
            obj.campaignHumanCoIdArray = this.getCampaignHumanCoIdArray().concat();
        }

        {
            const value = this.getCampaignAiCoId();
            (value != null) && (obj.campaignAiCoId = value);
        }

        {
            const value = this.getCampaignSkinId();
            (value != null) && (obj.campaignSkinId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTeamIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getInitialFund();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getIncomeMultiplier();
            if ((value != null) && (value != 0)) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getEnergyGrowthMultiplier();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getEnergyAddPctOnCoBoard();
            if ((value != null) && (value != 0)) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getEnergyLossPctOnCoDie();
            if ((value != null) && (value != 0)) {
                writer.uint32(112).int32(value);
            }
        }

        {
            const value = this.getMoveRangeModifier();
            if ((value != null) && (value != 0)) {
                writer.uint32(120).int32(value);
            }
        }

        {
            const value = this.getUnitVisionRangeModifier();
            if ((value != null) && (value != 0)) {
                writer.uint32(128).int32(value);
            }
        }

        {
            const value = this.getTileVisionRangeModifier();
            if ((value != null) && (value != 0)) {
                writer.uint32(136).int32(value);
            }
        }

        {
            const value = this.getAttackPowerModifier();
            if ((value != null) && (value != 0)) {
                writer.uint32(144).int32(value);
            }
        }

        {
            const value = this.getDefenseModifier();
            if ((value != null) && (value != 0)) {
                writer.uint32(152).int32(value);
            }
        }

        {
            const value = this.getLuckLowerLimit();
            if ((value != null) && (value != 0)) {
                writer.uint32(160).int32(value);
            }
        }

        {
            const value = this.getLuckUpperLimit();
            if ((value != null) && (value != 0)) {
                writer.uint32(168).int32(value);
            }
        }

        {
            const value = this.getCanActivateCoSkill();
            if ((value != null) && (value != false)) {
                writer.uint32(176).bool(value);
            }
        }

        {
            const value = this.getCanCoBoard();
            if ((value != null) && (value != false)) {
                writer.uint32(184).bool(value);
            }
        }

        {
            const value = this.getCanUnitJoin();
            if ((value != null) && (value != false)) {
                writer.uint32(192).bool(value);
            }
        }

        {
            const value = this.getBannedUnitTypeArray();
            const length = value.length;
            if (length) {
                writer.uint32(202).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMaxUnitsCount();
            if (value != null) {
                writer.uint32(216).int32(value);
            }
        }

        {
            const value = this.getBannedCoCategoryIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(242).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMcwHumanCoCategoryIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(250).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getCcwHumanCoCategoryIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(258).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getCcwAiCoId();
            if (value != null) {
                writer.uint32(264).int32(value);
            }
        }

        {
            const value = this.getMmwHumanCoCategoryIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(274).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMrwHumanCoCategoryIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(282).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getAtwHumanCoCategoryIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(290).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getSrwHumanCoCategoryIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(298).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getSrwAiCoId();
            if (value != null) {
                writer.uint32(304).int32(value);
            }
        }

        {
            const value = this.getCampaignHumanCoIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(314).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getCampaignAiCoId();
            if (value != null) {
                writer.uint32(320).int32(value);
            }
        }

        {
            const value = this.getCampaignSkinId();
            if (value != null) {
                writer.uint32(328).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): PlayerRule {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new PlayerRule();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    msg.setTeamIndex(reader.int32());
                    break;

                case 10:
                    msg.setInitialFund(reader.int32());
                    break;

                case 11:
                    msg.setIncomeMultiplier(reader.int32());
                    break;

                case 12:
                    msg.setEnergyGrowthMultiplier(reader.int32());
                    break;

                case 13:
                    msg.setEnergyAddPctOnCoBoard(reader.int32());
                    break;

                case 14:
                    msg.setEnergyLossPctOnCoDie(reader.int32());
                    break;

                case 15:
                    msg.setMoveRangeModifier(reader.int32());
                    break;

                case 16:
                    msg.setUnitVisionRangeModifier(reader.int32());
                    break;

                case 17:
                    msg.setTileVisionRangeModifier(reader.int32());
                    break;

                case 18:
                    msg.setAttackPowerModifier(reader.int32());
                    break;

                case 19:
                    msg.setDefenseModifier(reader.int32());
                    break;

                case 20:
                    msg.setLuckLowerLimit(reader.int32());
                    break;

                case 21:
                    msg.setLuckUpperLimit(reader.int32());
                    break;

                case 22:
                    msg.setCanActivateCoSkill(reader.bool());
                    break;

                case 23:
                    msg.setCanCoBoard(reader.bool());
                    break;

                case 24:
                    msg.setCanUnitJoin(reader.bool());
                    break;

                case 25:
                    {
                        const arr = msg._bannedUnitTypeArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 27:
                    msg.setMaxUnitsCount(reader.int32());
                    break;

                case 30:
                    {
                        const arr = msg._bannedCoCategoryIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 31:
                    {
                        const arr = msg._mcwHumanCoCategoryIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 32:
                    {
                        const arr = msg._ccwHumanCoCategoryIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 33:
                    msg.setCcwAiCoId(reader.int32());
                    break;

                case 34:
                    {
                        const arr = msg._mmwHumanCoCategoryIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 35:
                    {
                        const arr = msg._mrwHumanCoCategoryIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 36:
                    {
                        const arr = msg._atwHumanCoCategoryIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 37:
                    {
                        const arr = msg._srwHumanCoCategoryIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 38:
                    msg.setSrwAiCoId(reader.int32());
                    break;

                case 39:
                    {
                        const arr = msg._campaignHumanCoIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 40:
                    msg.setCampaignAiCoId(reader.int32());
                    break;

                case 41:
                    msg.setCampaignSkinId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): PlayerRule {
        return PlayerRule.decode(this.encode());
    }

    public override getSchemaName(): "PlayerRule" {
        return "PlayerRule";
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number {
        return this._playerIndex ?? 0;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._playerIndex = null;
        } else {
            this._playerIndex = value;
        }
    }

    public checkHasTeamIndex(): boolean {
        return this._teamIndex != null;
    }
    public getTeamIndex(): number {
        return this._teamIndex ?? 0;
    }
    public setTeamIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._teamIndex = null;
        } else {
            this._teamIndex = value;
        }
    }

    public checkHasInitialFund(): boolean {
        return this._initialFund != null;
    }
    public getInitialFund(): number {
        return this._initialFund ?? 0;
    }
    public setInitialFund(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._initialFund = null;
        } else {
            this._initialFund = value;
        }
    }

    public checkHasIncomeMultiplier(): boolean {
        return this._incomeMultiplier != null;
    }
    public getIncomeMultiplier(): number {
        return this._incomeMultiplier ?? 0;
    }
    public setIncomeMultiplier(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._incomeMultiplier = null;
        } else {
            this._incomeMultiplier = value;
        }
    }

    public checkHasEnergyGrowthMultiplier(): boolean {
        return this._energyGrowthMultiplier != null;
    }
    public getEnergyGrowthMultiplier(): number {
        return this._energyGrowthMultiplier ?? 0;
    }
    public setEnergyGrowthMultiplier(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._energyGrowthMultiplier = null;
        } else {
            this._energyGrowthMultiplier = value;
        }
    }

    public checkHasEnergyAddPctOnCoBoard(): boolean {
        return this._energyAddPctOnCoBoard != null;
    }
    public getEnergyAddPctOnCoBoard(): number {
        return this._energyAddPctOnCoBoard ?? 0;
    }
    public setEnergyAddPctOnCoBoard(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._energyAddPctOnCoBoard = null;
        } else {
            this._energyAddPctOnCoBoard = value;
        }
    }

    public checkHasEnergyLossPctOnCoDie(): boolean {
        return this._energyLossPctOnCoDie != null;
    }
    public getEnergyLossPctOnCoDie(): number {
        return this._energyLossPctOnCoDie ?? 0;
    }
    public setEnergyLossPctOnCoDie(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._energyLossPctOnCoDie = null;
        } else {
            this._energyLossPctOnCoDie = value;
        }
    }

    public checkHasMoveRangeModifier(): boolean {
        return this._moveRangeModifier != null;
    }
    public getMoveRangeModifier(): number {
        return this._moveRangeModifier ?? 0;
    }
    public setMoveRangeModifier(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._moveRangeModifier = null;
        } else {
            this._moveRangeModifier = value;
        }
    }

    public checkHasUnitVisionRangeModifier(): boolean {
        return this._unitVisionRangeModifier != null;
    }
    public getUnitVisionRangeModifier(): number {
        return this._unitVisionRangeModifier ?? 0;
    }
    public setUnitVisionRangeModifier(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitVisionRangeModifier = null;
        } else {
            this._unitVisionRangeModifier = value;
        }
    }

    public checkHasTileVisionRangeModifier(): boolean {
        return this._tileVisionRangeModifier != null;
    }
    public getTileVisionRangeModifier(): number {
        return this._tileVisionRangeModifier ?? 0;
    }
    public setTileVisionRangeModifier(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileVisionRangeModifier = null;
        } else {
            this._tileVisionRangeModifier = value;
        }
    }

    public checkHasAttackPowerModifier(): boolean {
        return this._attackPowerModifier != null;
    }
    public getAttackPowerModifier(): number {
        return this._attackPowerModifier ?? 0;
    }
    public setAttackPowerModifier(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._attackPowerModifier = null;
        } else {
            this._attackPowerModifier = value;
        }
    }

    public checkHasDefenseModifier(): boolean {
        return this._defenseModifier != null;
    }
    public getDefenseModifier(): number {
        return this._defenseModifier ?? 0;
    }
    public setDefenseModifier(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._defenseModifier = null;
        } else {
            this._defenseModifier = value;
        }
    }

    public checkHasLuckLowerLimit(): boolean {
        return this._luckLowerLimit != null;
    }
    public getLuckLowerLimit(): number {
        return this._luckLowerLimit ?? 0;
    }
    public setLuckLowerLimit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._luckLowerLimit = null;
        } else {
            this._luckLowerLimit = value;
        }
    }

    public checkHasLuckUpperLimit(): boolean {
        return this._luckUpperLimit != null;
    }
    public getLuckUpperLimit(): number {
        return this._luckUpperLimit ?? 0;
    }
    public setLuckUpperLimit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._luckUpperLimit = null;
        } else {
            this._luckUpperLimit = value;
        }
    }

    public checkHasCanActivateCoSkill(): boolean {
        return this._canActivateCoSkill != null;
    }
    public getCanActivateCoSkill(): boolean {
        return this._canActivateCoSkill ?? false;
    }
    public setCanActivateCoSkill(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canActivateCoSkill = null;
        } else {
            this._canActivateCoSkill = value;
        }
    }

    public checkHasCanCoBoard(): boolean {
        return this._canCoBoard != null;
    }
    public getCanCoBoard(): boolean {
        return this._canCoBoard ?? false;
    }
    public setCanCoBoard(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canCoBoard = null;
        } else {
            this._canCoBoard = value;
        }
    }

    public checkHasCanUnitJoin(): boolean {
        return this._canUnitJoin != null;
    }
    public getCanUnitJoin(): boolean {
        return this._canUnitJoin ?? false;
    }
    public setCanUnitJoin(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canUnitJoin = null;
        } else {
            this._canUnitJoin = value;
        }
    }

    public getBannedUnitTypeArray(): number[] {
        return this._bannedUnitTypeArray;
    }
    public setBannedUnitTypeArray(value: number[]): void {
        this._bannedUnitTypeArray = value;
    }

    public checkHasMaxUnitsCount(): boolean {
        return this._maxUnitsCount != null;
    }
    public getMaxUnitsCount(): number | null | undefined {
        return this._maxUnitsCount;
    }
    public setMaxUnitsCount(value: number | null | undefined): void {
        this._maxUnitsCount = value;
    }

    public getBannedCoCategoryIdArray(): number[] {
        return this._bannedCoCategoryIdArray;
    }
    public setBannedCoCategoryIdArray(value: number[]): void {
        this._bannedCoCategoryIdArray = value;
    }

    public getMcwHumanCoCategoryIdArray(): number[] {
        return this._mcwHumanCoCategoryIdArray;
    }
    public setMcwHumanCoCategoryIdArray(value: number[]): void {
        this._mcwHumanCoCategoryIdArray = value;
    }

    public getCcwHumanCoCategoryIdArray(): number[] {
        return this._ccwHumanCoCategoryIdArray;
    }
    public setCcwHumanCoCategoryIdArray(value: number[]): void {
        this._ccwHumanCoCategoryIdArray = value;
    }

    public checkHasCcwAiCoId(): boolean {
        return this._ccwAiCoId != null;
    }
    public getCcwAiCoId(): number | null | undefined {
        return this._ccwAiCoId;
    }
    public setCcwAiCoId(value: number | null | undefined): void {
        this._ccwAiCoId = value;
    }

    public getMmwHumanCoCategoryIdArray(): number[] {
        return this._mmwHumanCoCategoryIdArray;
    }
    public setMmwHumanCoCategoryIdArray(value: number[]): void {
        this._mmwHumanCoCategoryIdArray = value;
    }

    public getMrwHumanCoCategoryIdArray(): number[] {
        return this._mrwHumanCoCategoryIdArray;
    }
    public setMrwHumanCoCategoryIdArray(value: number[]): void {
        this._mrwHumanCoCategoryIdArray = value;
    }

    public getAtwHumanCoCategoryIdArray(): number[] {
        return this._atwHumanCoCategoryIdArray;
    }
    public setAtwHumanCoCategoryIdArray(value: number[]): void {
        this._atwHumanCoCategoryIdArray = value;
    }

    public getSrwHumanCoCategoryIdArray(): number[] {
        return this._srwHumanCoCategoryIdArray;
    }
    public setSrwHumanCoCategoryIdArray(value: number[]): void {
        this._srwHumanCoCategoryIdArray = value;
    }

    public checkHasSrwAiCoId(): boolean {
        return this._srwAiCoId != null;
    }
    public getSrwAiCoId(): number | null | undefined {
        return this._srwAiCoId;
    }
    public setSrwAiCoId(value: number | null | undefined): void {
        this._srwAiCoId = value;
    }

    public getCampaignHumanCoIdArray(): number[] {
        return this._campaignHumanCoIdArray;
    }
    public setCampaignHumanCoIdArray(value: number[]): void {
        this._campaignHumanCoIdArray = value;
    }

    public checkHasCampaignAiCoId(): boolean {
        return this._campaignAiCoId != null;
    }
    public getCampaignAiCoId(): number | null | undefined {
        return this._campaignAiCoId;
    }
    public setCampaignAiCoId(value: number | null | undefined): void {
        this._campaignAiCoId = value;
    }

    public checkHasCampaignSkinId(): boolean {
        return this._campaignSkinId != null;
    }
    public getCampaignSkinId(): number | null | undefined {
        return this._campaignSkinId;
    }
    public setCampaignSkinId(value: number | null | undefined): void {
        this._campaignSkinId = value;
    }
}
