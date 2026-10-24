import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface CoBasicCfgJson extends $ProtoSchemaJsonBase {
    coId?: number | null | undefined;
    coCategoryId?: number | null | undefined;
    name?: string | null | undefined;
    zoneRadius?: number | null | undefined;
    boardCostPercentage?: number | null | undefined;
    zoneExpansionEnergyList: number[];
    powerEnergyList: number[];
    isEnabled?: boolean | null | undefined;
    isEnabledForMrwAndAtw?: boolean | null | undefined;
    isEnabledForAi?: boolean | null | undefined;
    isEnabledForDialogue?: boolean | null | undefined;
    artDesigner?: string | null | undefined;
    dataDesigner?: string | null | undefined;
    powerSkillTargetsCountArray: number[];
    powerSkillTargetsRadiusArray: number[];
    image?: number | null | undefined;
    maxBoardCount?: number | null | undefined;
    coEnergyTypeId?: number | null | undefined;
    coEnergyRequirementParams: number[];
    canGetEnergyWithBattleOnPowerSkills?: boolean | null | undefined;
    aiBoardUnitTypeAndScore: number[];
    displayCategoryId?: number | null | undefined;
    force?: number | null | undefined;
    passiveSkillIds: number[];
    powerSkillIds: number[];
    superPowerSkillIds: number[];
}

export class CoBasicCfg extends $ProtoSchemaBase {
    private _coId?: number | null | undefined;
    private _coCategoryId?: number | null | undefined;
    private _name?: string | null | undefined;
    private _zoneRadius?: number | null | undefined;
    private _boardCostPercentage?: number | null | undefined;
    private _zoneExpansionEnergyList: number[] = [];
    private _powerEnergyList: number[] = [];
    private _isEnabled?: boolean | null | undefined;
    private _isEnabledForMrwAndAtw?: boolean | null | undefined;
    private _isEnabledForAi?: boolean | null | undefined;
    private _isEnabledForDialogue?: boolean | null | undefined;
    private _artDesigner?: string | null | undefined;
    private _dataDesigner?: string | null | undefined;
    private _powerSkillTargetsCountArray: number[] = [];
    private _powerSkillTargetsRadiusArray: number[] = [];
    private _image?: number | null | undefined;
    private _maxBoardCount?: number | null | undefined;
    private _coEnergyTypeId?: number | null | undefined;
    private _coEnergyRequirementParams: number[] = [];
    private _canGetEnergyWithBattleOnPowerSkills?: boolean | null | undefined;
    private _aiBoardUnitTypeAndScore: number[] = [];
    private _displayCategoryId?: number | null | undefined;
    private _force?: number | null | undefined;
    private _passiveSkillIds: number[] = [];
    private _powerSkillIds: number[] = [];
    private _superPowerSkillIds: number[] = [];

    public static fromJson(obj: CoBasicCfgJson): CoBasicCfg {
        return new CoBasicCfg().loadJson(obj);
    }
    public override loadJson(obj: CoBasicCfgJson): this {
        this.setCoId(obj.coId);
        this.setCoCategoryId(obj.coCategoryId);
        this.setName(obj.name);
        this.setZoneRadius(obj.zoneRadius);
        this.setBoardCostPercentage(obj.boardCostPercentage);
        this.setZoneExpansionEnergyList(obj.zoneExpansionEnergyList?.concat() ?? []);
        this.setPowerEnergyList(obj.powerEnergyList?.concat() ?? []);
        this.setIsEnabled(obj.isEnabled);
        this.setIsEnabledForMrwAndAtw(obj.isEnabledForMrwAndAtw);
        this.setIsEnabledForAi(obj.isEnabledForAi);
        this.setIsEnabledForDialogue(obj.isEnabledForDialogue);
        this.setArtDesigner(obj.artDesigner);
        this.setDataDesigner(obj.dataDesigner);
        this.setPowerSkillTargetsCountArray(obj.powerSkillTargetsCountArray?.concat() ?? []);
        this.setPowerSkillTargetsRadiusArray(obj.powerSkillTargetsRadiusArray?.concat() ?? []);
        this.setImage(obj.image);
        this.setMaxBoardCount(obj.maxBoardCount);
        this.setCoEnergyTypeId(obj.coEnergyTypeId);
        this.setCoEnergyRequirementParams(obj.coEnergyRequirementParams?.concat() ?? []);
        this.setCanGetEnergyWithBattleOnPowerSkills(obj.canGetEnergyWithBattleOnPowerSkills);
        this.setAiBoardUnitTypeAndScore(obj.aiBoardUnitTypeAndScore?.concat() ?? []);
        this.setDisplayCategoryId(obj.displayCategoryId);
        this.setForce(obj.force);
        this.setPassiveSkillIds(obj.passiveSkillIds?.concat() ?? []);
        this.setPowerSkillIds(obj.powerSkillIds?.concat() ?? []);
        this.setSuperPowerSkillIds(obj.superPowerSkillIds?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: CoBasicCfgJson): CoBasicCfgJson {
        obj ??= ({} as CoBasicCfgJson);

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            const value = this.getCoCategoryId();
            (value != null) && (obj.coCategoryId = value);
        }

        {
            const value = this.getName();
            (value != null) && (obj.name = value);
        }

        {
            const value = this.getZoneRadius();
            (value != null) && (obj.zoneRadius = value);
        }

        {
            const value = this.getBoardCostPercentage();
            (value != null) && (obj.boardCostPercentage = value);
        }

        {
            obj.zoneExpansionEnergyList = this.getZoneExpansionEnergyList().concat();
        }

        {
            obj.powerEnergyList = this.getPowerEnergyList().concat();
        }

        {
            const value = this.getIsEnabled();
            (value != null) && (obj.isEnabled = value);
        }

        {
            const value = this.getIsEnabledForMrwAndAtw();
            (value != null) && (obj.isEnabledForMrwAndAtw = value);
        }

        {
            const value = this.getIsEnabledForAi();
            (value != null) && (obj.isEnabledForAi = value);
        }

        {
            const value = this.getIsEnabledForDialogue();
            (value != null) && (obj.isEnabledForDialogue = value);
        }

        {
            const value = this.getArtDesigner();
            (value != null) && (obj.artDesigner = value);
        }

        {
            const value = this.getDataDesigner();
            (value != null) && (obj.dataDesigner = value);
        }

        {
            obj.powerSkillTargetsCountArray = this.getPowerSkillTargetsCountArray().concat();
        }

        {
            obj.powerSkillTargetsRadiusArray = this.getPowerSkillTargetsRadiusArray().concat();
        }

        {
            const value = this.getImage();
            (value != null) && (obj.image = value);
        }

        {
            const value = this.getMaxBoardCount();
            (value != null) && (obj.maxBoardCount = value);
        }

        {
            const value = this.getCoEnergyTypeId();
            (value != null) && (obj.coEnergyTypeId = value);
        }

        {
            obj.coEnergyRequirementParams = this.getCoEnergyRequirementParams().concat();
        }

        {
            const value = this.getCanGetEnergyWithBattleOnPowerSkills();
            (value != null) && (obj.canGetEnergyWithBattleOnPowerSkills = value);
        }

        {
            obj.aiBoardUnitTypeAndScore = this.getAiBoardUnitTypeAndScore().concat();
        }

        {
            const value = this.getDisplayCategoryId();
            (value != null) && (obj.displayCategoryId = value);
        }

        {
            const value = this.getForce();
            (value != null) && (obj.force = value);
        }

        {
            obj.passiveSkillIds = this.getPassiveSkillIds().concat();
        }

        {
            obj.powerSkillIds = this.getPowerSkillIds().concat();
        }

        {
            obj.superPowerSkillIds = this.getSuperPowerSkillIds().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCoCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getName();
            if ((value != null) && (value != "")) {
                writer.uint32(26).string(value);
            }
        }

        {
            const value = this.getZoneRadius();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getBoardCostPercentage();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getZoneExpansionEnergyList();
            const length = value.length;
            if (length) {
                writer.uint32(50).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getPowerEnergyList();
            const length = value.length;
            if (length) {
                writer.uint32(58).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getIsEnabled();
            if ((value != null) && (value != false)) {
                writer.uint32(64).bool(value);
            }
        }

        {
            const value = this.getIsEnabledForMrwAndAtw();
            if ((value != null) && (value != false)) {
                writer.uint32(72).bool(value);
            }
        }

        {
            const value = this.getIsEnabledForAi();
            if ((value != null) && (value != false)) {
                writer.uint32(80).bool(value);
            }
        }

        {
            const value = this.getIsEnabledForDialogue();
            if ((value != null) && (value != false)) {
                writer.uint32(88).bool(value);
            }
        }

        {
            const value = this.getArtDesigner();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getDataDesigner();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getPowerSkillTargetsCountArray();
            const length = value.length;
            if (length) {
                writer.uint32(114).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getPowerSkillTargetsRadiusArray();
            const length = value.length;
            if (length) {
                writer.uint32(122).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getImage();
            if ((value != null) && (value != 0)) {
                writer.uint32(128).int32(value);
            }
        }

        {
            const value = this.getMaxBoardCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(136).int32(value);
            }
        }

        {
            const value = this.getCoEnergyTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(144).int32(value);
            }
        }

        {
            const value = this.getCoEnergyRequirementParams();
            const length = value.length;
            if (length) {
                writer.uint32(154).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getCanGetEnergyWithBattleOnPowerSkills();
            if ((value != null) && (value != false)) {
                writer.uint32(160).bool(value);
            }
        }

        {
            const value = this.getAiBoardUnitTypeAndScore();
            const length = value.length;
            if (length) {
                writer.uint32(170).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getDisplayCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(176).int32(value);
            }
        }

        {
            const value = this.getForce();
            if ((value != null) && (value != 0)) {
                writer.uint32(184).int32(value);
            }
        }

        {
            const value = this.getPassiveSkillIds();
            const length = value.length;
            if (length) {
                writer.uint32(194).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getPowerSkillIds();
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
            const value = this.getSuperPowerSkillIds();
            const length = value.length;
            if (length) {
                writer.uint32(210).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoBasicCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoBasicCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoId(reader.int32());
                    break;

                case 2:
                    msg.setCoCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setName(reader.string());
                    break;

                case 4:
                    msg.setZoneRadius(reader.int32());
                    break;

                case 5:
                    msg.setBoardCostPercentage(reader.int32());
                    break;

                case 6:
                    {
                        const arr = msg._zoneExpansionEnergyList;
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

                case 7:
                    {
                        const arr = msg._powerEnergyList;
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

                case 8:
                    msg.setIsEnabled(reader.bool());
                    break;

                case 9:
                    msg.setIsEnabledForMrwAndAtw(reader.bool());
                    break;

                case 10:
                    msg.setIsEnabledForAi(reader.bool());
                    break;

                case 11:
                    msg.setIsEnabledForDialogue(reader.bool());
                    break;

                case 12:
                    msg.setArtDesigner(reader.string());
                    break;

                case 13:
                    msg.setDataDesigner(reader.string());
                    break;

                case 14:
                    {
                        const arr = msg._powerSkillTargetsCountArray;
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

                case 15:
                    {
                        const arr = msg._powerSkillTargetsRadiusArray;
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

                case 16:
                    msg.setImage(reader.int32());
                    break;

                case 17:
                    msg.setMaxBoardCount(reader.int32());
                    break;

                case 18:
                    msg.setCoEnergyTypeId(reader.int32());
                    break;

                case 19:
                    {
                        const arr = msg._coEnergyRequirementParams;
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

                case 20:
                    msg.setCanGetEnergyWithBattleOnPowerSkills(reader.bool());
                    break;

                case 21:
                    {
                        const arr = msg._aiBoardUnitTypeAndScore;
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

                case 22:
                    msg.setDisplayCategoryId(reader.int32());
                    break;

                case 23:
                    msg.setForce(reader.int32());
                    break;

                case 24:
                    {
                        const arr = msg._passiveSkillIds;
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

                case 25:
                    {
                        const arr = msg._powerSkillIds;
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

                case 26:
                    {
                        const arr = msg._superPowerSkillIds;
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CoBasicCfg {
        return CoBasicCfg.decode(this.encode());
    }

    public override getSchemaName(): "CoBasicCfg" {
        return "CoBasicCfg";
    }

    public checkHasCoId(): boolean {
        return this._coId != null;
    }
    public getCoId(): number {
        return this._coId ?? 0;
    }
    public setCoId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coId = null;
        } else {
            this._coId = value;
        }
    }

    public checkHasCoCategoryId(): boolean {
        return this._coCategoryId != null;
    }
    public getCoCategoryId(): number {
        return this._coCategoryId ?? 0;
    }
    public setCoCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coCategoryId = null;
        } else {
            this._coCategoryId = value;
        }
    }

    public checkHasName(): boolean {
        return this._name != null;
    }
    public getName(): string {
        return this._name ?? "";
    }
    public setName(value: string | null | undefined): void {
        if ((value == null) || (value == "")) {
            this._name = null;
        } else {
            this._name = value;
        }
    }

    public checkHasZoneRadius(): boolean {
        return this._zoneRadius != null;
    }
    public getZoneRadius(): number {
        return this._zoneRadius ?? 0;
    }
    public setZoneRadius(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._zoneRadius = null;
        } else {
            this._zoneRadius = value;
        }
    }

    public checkHasBoardCostPercentage(): boolean {
        return this._boardCostPercentage != null;
    }
    public getBoardCostPercentage(): number {
        return this._boardCostPercentage ?? 0;
    }
    public setBoardCostPercentage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._boardCostPercentage = null;
        } else {
            this._boardCostPercentage = value;
        }
    }

    public getZoneExpansionEnergyList(): number[] {
        return this._zoneExpansionEnergyList;
    }
    public setZoneExpansionEnergyList(value: number[]): void {
        this._zoneExpansionEnergyList = value;
    }

    public getPowerEnergyList(): number[] {
        return this._powerEnergyList;
    }
    public setPowerEnergyList(value: number[]): void {
        this._powerEnergyList = value;
    }

    public checkHasIsEnabled(): boolean {
        return this._isEnabled != null;
    }
    public getIsEnabled(): boolean {
        return this._isEnabled ?? false;
    }
    public setIsEnabled(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabled = null;
        } else {
            this._isEnabled = value;
        }
    }

    public checkHasIsEnabledForMrwAndAtw(): boolean {
        return this._isEnabledForMrwAndAtw != null;
    }
    public getIsEnabledForMrwAndAtw(): boolean {
        return this._isEnabledForMrwAndAtw ?? false;
    }
    public setIsEnabledForMrwAndAtw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabledForMrwAndAtw = null;
        } else {
            this._isEnabledForMrwAndAtw = value;
        }
    }

    public checkHasIsEnabledForAi(): boolean {
        return this._isEnabledForAi != null;
    }
    public getIsEnabledForAi(): boolean {
        return this._isEnabledForAi ?? false;
    }
    public setIsEnabledForAi(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabledForAi = null;
        } else {
            this._isEnabledForAi = value;
        }
    }

    public checkHasIsEnabledForDialogue(): boolean {
        return this._isEnabledForDialogue != null;
    }
    public getIsEnabledForDialogue(): boolean {
        return this._isEnabledForDialogue ?? false;
    }
    public setIsEnabledForDialogue(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabledForDialogue = null;
        } else {
            this._isEnabledForDialogue = value;
        }
    }

    public checkHasArtDesigner(): boolean {
        return this._artDesigner != null;
    }
    public getArtDesigner(): string | null | undefined {
        return this._artDesigner;
    }
    public setArtDesigner(value: string | null | undefined): void {
        this._artDesigner = value;
    }

    public checkHasDataDesigner(): boolean {
        return this._dataDesigner != null;
    }
    public getDataDesigner(): string | null | undefined {
        return this._dataDesigner;
    }
    public setDataDesigner(value: string | null | undefined): void {
        this._dataDesigner = value;
    }

    public getPowerSkillTargetsCountArray(): number[] {
        return this._powerSkillTargetsCountArray;
    }
    public setPowerSkillTargetsCountArray(value: number[]): void {
        this._powerSkillTargetsCountArray = value;
    }

    public getPowerSkillTargetsRadiusArray(): number[] {
        return this._powerSkillTargetsRadiusArray;
    }
    public setPowerSkillTargetsRadiusArray(value: number[]): void {
        this._powerSkillTargetsRadiusArray = value;
    }

    public checkHasImage(): boolean {
        return this._image != null;
    }
    public getImage(): number {
        return this._image ?? 0;
    }
    public setImage(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._image = null;
        } else {
            this._image = value;
        }
    }

    public checkHasMaxBoardCount(): boolean {
        return this._maxBoardCount != null;
    }
    public getMaxBoardCount(): number {
        return this._maxBoardCount ?? 0;
    }
    public setMaxBoardCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._maxBoardCount = null;
        } else {
            this._maxBoardCount = value;
        }
    }

    public checkHasCoEnergyTypeId(): boolean {
        return this._coEnergyTypeId != null;
    }
    public getCoEnergyTypeId(): number {
        return this._coEnergyTypeId ?? 0;
    }
    public setCoEnergyTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coEnergyTypeId = null;
        } else {
            this._coEnergyTypeId = value;
        }
    }

    public getCoEnergyRequirementParams(): number[] {
        return this._coEnergyRequirementParams;
    }
    public setCoEnergyRequirementParams(value: number[]): void {
        this._coEnergyRequirementParams = value;
    }

    public checkHasCanGetEnergyWithBattleOnPowerSkills(): boolean {
        return this._canGetEnergyWithBattleOnPowerSkills != null;
    }
    public getCanGetEnergyWithBattleOnPowerSkills(): boolean {
        return this._canGetEnergyWithBattleOnPowerSkills ?? false;
    }
    public setCanGetEnergyWithBattleOnPowerSkills(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canGetEnergyWithBattleOnPowerSkills = null;
        } else {
            this._canGetEnergyWithBattleOnPowerSkills = value;
        }
    }

    public getAiBoardUnitTypeAndScore(): number[] {
        return this._aiBoardUnitTypeAndScore;
    }
    public setAiBoardUnitTypeAndScore(value: number[]): void {
        this._aiBoardUnitTypeAndScore = value;
    }

    public checkHasDisplayCategoryId(): boolean {
        return this._displayCategoryId != null;
    }
    public getDisplayCategoryId(): number {
        return this._displayCategoryId ?? 0;
    }
    public setDisplayCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._displayCategoryId = null;
        } else {
            this._displayCategoryId = value;
        }
    }

    public checkHasForce(): boolean {
        return this._force != null;
    }
    public getForce(): number {
        return this._force ?? 0;
    }
    public setForce(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._force = null;
        } else {
            this._force = value;
        }
    }

    public getPassiveSkillIds(): number[] {
        return this._passiveSkillIds;
    }
    public setPassiveSkillIds(value: number[]): void {
        this._passiveSkillIds = value;
    }

    public getPowerSkillIds(): number[] {
        return this._powerSkillIds;
    }
    public setPowerSkillIds(value: number[]): void {
        this._powerSkillIds = value;
    }

    public getSuperPowerSkillIds(): number[] {
        return this._superPowerSkillIds;
    }
    public setSuperPowerSkillIds(value: number[]): void {
        this._superPowerSkillIds = value;
    }
}
