import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIdAndMarkTypeId as $Message$CommonProto$Structure$GridIdAndMarkTypeId, type GridIdAndMarkTypeIdJson as $Json$CommonProto$Structure$GridIdAndMarkTypeId } from "../Structure/GridIdAndMarkTypeId.js";

export interface SerialPlayerJson extends $ProtoSchemaJsonBase {
    fund?: number | null | undefined;
    hasVotedForDraw?: boolean | null | undefined;
    aliveState?: number | null | undefined;
    playerIndex?: number | null | undefined;
    userId?: number | null | undefined;
    coId?: number | null | undefined;
    coCurrentEnergy?: number | null | undefined;
    coUsingSkillType?: number | null | undefined;
    coIsDestroyedInTurn?: boolean | null | undefined;
    watchOngoingSrcUserIdArray: number[];
    watchRequestSrcUserIdArray: number[];
    restTimeToBoot?: number | null | undefined;
    unitAndTileSkinId?: number | null | undefined;
    coPowerActivatedCount?: number | null | undefined;
    deprecatedMarkedGridIdArray: number[];
    isSkipTurn?: boolean | null | undefined;
    hiddenGridMarkTypeIdArray: number[];
    markedGridArray: $Json$CommonProto$Structure$GridIdAndMarkTypeId[];
}

export class SerialPlayer extends $ProtoSchemaBase {
    private _fund?: number | null | undefined;
    private _hasVotedForDraw?: boolean | null | undefined;
    private _aliveState?: number | null | undefined;
    private _playerIndex?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _coCurrentEnergy?: number | null | undefined;
    private _coUsingSkillType?: number | null | undefined;
    private _coIsDestroyedInTurn?: boolean | null | undefined;
    private _watchOngoingSrcUserIdArray: number[] = [];
    private _watchRequestSrcUserIdArray: number[] = [];
    private _restTimeToBoot?: number | null | undefined;
    private _unitAndTileSkinId?: number | null | undefined;
    private _coPowerActivatedCount?: number | null | undefined;
    private _deprecatedMarkedGridIdArray: number[] = [];
    private _isSkipTurn?: boolean | null | undefined;
    private _hiddenGridMarkTypeIdArray: number[] = [];
    private _markedGridArray: $Message$CommonProto$Structure$GridIdAndMarkTypeId[] = [];

    public static fromJson(obj: SerialPlayerJson): SerialPlayer {
        return new SerialPlayer().loadJson(obj);
    }
    public override loadJson(obj: SerialPlayerJson): this {
        this.setFund(obj.fund);
        this.setHasVotedForDraw(obj.hasVotedForDraw);
        this.setAliveState(obj.aliveState);
        this.setPlayerIndex(obj.playerIndex);
        this.setUserId(obj.userId);
        this.setCoId(obj.coId);
        this.setCoCurrentEnergy(obj.coCurrentEnergy);
        this.setCoUsingSkillType(obj.coUsingSkillType);
        this.setCoIsDestroyedInTurn(obj.coIsDestroyedInTurn);
        this.setWatchOngoingSrcUserIdArray(obj.watchOngoingSrcUserIdArray?.concat() ?? []);
        this.setWatchRequestSrcUserIdArray(obj.watchRequestSrcUserIdArray?.concat() ?? []);
        this.setRestTimeToBoot(obj.restTimeToBoot);
        this.setUnitAndTileSkinId(obj.unitAndTileSkinId);
        this.setCoPowerActivatedCount(obj.coPowerActivatedCount);
        this.setDeprecatedMarkedGridIdArray(obj.deprecatedMarkedGridIdArray?.concat() ?? []);
        this.setIsSkipTurn(obj.isSkipTurn);
        this.setHiddenGridMarkTypeIdArray(obj.hiddenGridMarkTypeIdArray?.concat() ?? []);
        this.setMarkedGridArray(obj.markedGridArray?.map(v => $Message$CommonProto$Structure$GridIdAndMarkTypeId.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialPlayerJson): SerialPlayerJson {
        obj ??= ({} as SerialPlayerJson);

        {
            const value = this.getFund();
            (value != null) && (obj.fund = value);
        }

        {
            const value = this.getHasVotedForDraw();
            (value != null) && (obj.hasVotedForDraw = value);
        }

        {
            const value = this.getAliveState();
            (value != null) && (obj.aliveState = value);
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            const value = this.getCoCurrentEnergy();
            (value != null) && (obj.coCurrentEnergy = value);
        }

        {
            const value = this.getCoUsingSkillType();
            (value != null) && (obj.coUsingSkillType = value);
        }

        {
            const value = this.getCoIsDestroyedInTurn();
            (value != null) && (obj.coIsDestroyedInTurn = value);
        }

        {
            obj.watchOngoingSrcUserIdArray = this.getWatchOngoingSrcUserIdArray().concat();
        }

        {
            obj.watchRequestSrcUserIdArray = this.getWatchRequestSrcUserIdArray().concat();
        }

        {
            const value = this.getRestTimeToBoot();
            (value != null) && (obj.restTimeToBoot = value);
        }

        {
            const value = this.getUnitAndTileSkinId();
            (value != null) && (obj.unitAndTileSkinId = value);
        }

        {
            const value = this.getCoPowerActivatedCount();
            (value != null) && (obj.coPowerActivatedCount = value);
        }

        {
            obj.deprecatedMarkedGridIdArray = this.getDeprecatedMarkedGridIdArray().concat();
        }

        {
            const value = this.getIsSkipTurn();
            (value != null) && (obj.isSkipTurn = value);
        }

        {
            obj.hiddenGridMarkTypeIdArray = this.getHiddenGridMarkTypeIdArray().concat();
        }

        {
            obj.markedGridArray = this.getMarkedGridArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getFund();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getHasVotedForDraw();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getAliveState();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getCoId();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getCoCurrentEnergy();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getCoUsingSkillType();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getCoIsDestroyedInTurn();
            if ((value != null) && (value != false)) {
                writer.uint32(72).bool(value);
            }
        }

        {
            const value = this.getWatchOngoingSrcUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(82).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getWatchRequestSrcUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(90).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getRestTimeToBoot();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getUnitAndTileSkinId();
            if ((value != null) && (value != 0)) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getCoPowerActivatedCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(112).int32(value);
            }
        }

        {
            const value = this.getDeprecatedMarkedGridIdArray();
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
            const value = this.getIsSkipTurn();
            if ((value != null) && (value != false)) {
                writer.uint32(128).bool(value);
            }
        }

        {
            const value = this.getHiddenGridMarkTypeIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(138).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMarkedGridArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(146).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialPlayer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialPlayer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setFund(reader.int32());
                    break;

                case 2:
                    msg.setHasVotedForDraw(reader.bool());
                    break;

                case 3:
                    msg.setAliveState(reader.int32());
                    break;

                case 4:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 5:
                    msg.setUserId(reader.int32());
                    break;

                case 6:
                    msg.setCoId(reader.int32());
                    break;

                case 7:
                    msg.setCoCurrentEnergy(reader.int32());
                    break;

                case 8:
                    msg.setCoUsingSkillType(reader.int32());
                    break;

                case 9:
                    msg.setCoIsDestroyedInTurn(reader.bool());
                    break;

                case 10:
                    {
                        const arr = msg._watchOngoingSrcUserIdArray;
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

                case 11:
                    {
                        const arr = msg._watchRequestSrcUserIdArray;
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

                case 12:
                    msg.setRestTimeToBoot(reader.int32());
                    break;

                case 13:
                    msg.setUnitAndTileSkinId(reader.int32());
                    break;

                case 14:
                    msg.setCoPowerActivatedCount(reader.int32());
                    break;

                case 15:
                    {
                        const arr = msg._deprecatedMarkedGridIdArray;
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
                    msg.setIsSkipTurn(reader.bool());
                    break;

                case 17:
                    {
                        const arr = msg._hiddenGridMarkTypeIdArray;
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

                case 18:
                    {
                        const arr = msg._markedGridArray;
                        arr.push($Message$CommonProto$Structure$GridIdAndMarkTypeId.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialPlayer {
        return SerialPlayer.decode(this.encode());
    }

    public override getSchemaName(): "SerialPlayer" {
        return "SerialPlayer";
    }

    public checkHasFund(): boolean {
        return this._fund != null;
    }
    public getFund(): number {
        return this._fund ?? 0;
    }
    public setFund(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._fund = null;
        } else {
            this._fund = value;
        }
    }

    public checkHasHasVotedForDraw(): boolean {
        return this._hasVotedForDraw != null;
    }
    public getHasVotedForDraw(): boolean {
        return this._hasVotedForDraw ?? false;
    }
    public setHasVotedForDraw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._hasVotedForDraw = null;
        } else {
            this._hasVotedForDraw = value;
        }
    }

    public checkHasAliveState(): boolean {
        return this._aliveState != null;
    }
    public getAliveState(): number {
        return this._aliveState ?? 0;
    }
    public setAliveState(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._aliveState = null;
        } else {
            this._aliveState = value;
        }
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

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
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

    public checkHasCoCurrentEnergy(): boolean {
        return this._coCurrentEnergy != null;
    }
    public getCoCurrentEnergy(): number {
        return this._coCurrentEnergy ?? 0;
    }
    public setCoCurrentEnergy(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coCurrentEnergy = null;
        } else {
            this._coCurrentEnergy = value;
        }
    }

    public checkHasCoUsingSkillType(): boolean {
        return this._coUsingSkillType != null;
    }
    public getCoUsingSkillType(): number {
        return this._coUsingSkillType ?? 0;
    }
    public setCoUsingSkillType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coUsingSkillType = null;
        } else {
            this._coUsingSkillType = value;
        }
    }

    public checkHasCoIsDestroyedInTurn(): boolean {
        return this._coIsDestroyedInTurn != null;
    }
    public getCoIsDestroyedInTurn(): boolean {
        return this._coIsDestroyedInTurn ?? false;
    }
    public setCoIsDestroyedInTurn(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._coIsDestroyedInTurn = null;
        } else {
            this._coIsDestroyedInTurn = value;
        }
    }

    public getWatchOngoingSrcUserIdArray(): number[] {
        return this._watchOngoingSrcUserIdArray;
    }
    public setWatchOngoingSrcUserIdArray(value: number[]): void {
        this._watchOngoingSrcUserIdArray = value;
    }

    public getWatchRequestSrcUserIdArray(): number[] {
        return this._watchRequestSrcUserIdArray;
    }
    public setWatchRequestSrcUserIdArray(value: number[]): void {
        this._watchRequestSrcUserIdArray = value;
    }

    public checkHasRestTimeToBoot(): boolean {
        return this._restTimeToBoot != null;
    }
    public getRestTimeToBoot(): number {
        return this._restTimeToBoot ?? 0;
    }
    public setRestTimeToBoot(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._restTimeToBoot = null;
        } else {
            this._restTimeToBoot = value;
        }
    }

    public checkHasUnitAndTileSkinId(): boolean {
        return this._unitAndTileSkinId != null;
    }
    public getUnitAndTileSkinId(): number {
        return this._unitAndTileSkinId ?? 0;
    }
    public setUnitAndTileSkinId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitAndTileSkinId = null;
        } else {
            this._unitAndTileSkinId = value;
        }
    }

    public checkHasCoPowerActivatedCount(): boolean {
        return this._coPowerActivatedCount != null;
    }
    public getCoPowerActivatedCount(): number {
        return this._coPowerActivatedCount ?? 0;
    }
    public setCoPowerActivatedCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coPowerActivatedCount = null;
        } else {
            this._coPowerActivatedCount = value;
        }
    }

    public getDeprecatedMarkedGridIdArray(): number[] {
        return this._deprecatedMarkedGridIdArray;
    }
    public setDeprecatedMarkedGridIdArray(value: number[]): void {
        this._deprecatedMarkedGridIdArray = value;
    }

    public checkHasIsSkipTurn(): boolean {
        return this._isSkipTurn != null;
    }
    public getIsSkipTurn(): boolean {
        return this._isSkipTurn ?? false;
    }
    public setIsSkipTurn(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isSkipTurn = null;
        } else {
            this._isSkipTurn = value;
        }
    }

    public getHiddenGridMarkTypeIdArray(): number[] {
        return this._hiddenGridMarkTypeIdArray;
    }
    public setHiddenGridMarkTypeIdArray(value: number[]): void {
        this._hiddenGridMarkTypeIdArray = value;
    }

    public getMarkedGridArray(): $Message$CommonProto$Structure$GridIdAndMarkTypeId[] {
        return this._markedGridArray;
    }
    public setMarkedGridArray(value: $Message$CommonProto$Structure$GridIdAndMarkTypeId[]): void {
        this._markedGridArray = value;
    }
}
