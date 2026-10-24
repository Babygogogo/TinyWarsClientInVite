import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface CampaignInfoJson extends $ProtoSchemaJsonBase {
    campaignId?: number | null | undefined;
    isEnabled?: boolean | null | undefined;
    designerUserIdArray: number[];
    nextCampaignMapId?: number | null | undefined;
    allCampaignMapIdArray: number[];
    enabledCampaignMapIdArray: number[];
    nameArray: $Json$CommonProto$Structure$LanguageText[];
    descArray: $Json$CommonProto$Structure$LanguageText[];
    extraLink?: string | null | undefined;
}

export class CampaignInfo extends $ProtoSchemaBase {
    private _campaignId?: number | null | undefined;
    private _isEnabled?: boolean | null | undefined;
    private _designerUserIdArray: number[] = [];
    private _nextCampaignMapId?: number | null | undefined;
    private _allCampaignMapIdArray: number[] = [];
    private _enabledCampaignMapIdArray: number[] = [];
    private _nameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _descArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _extraLink?: string | null | undefined;

    public static fromJson(obj: CampaignInfoJson): CampaignInfo {
        return new CampaignInfo().loadJson(obj);
    }
    public override loadJson(obj: CampaignInfoJson): this {
        this.setCampaignId(obj.campaignId);
        this.setIsEnabled(obj.isEnabled);
        this.setDesignerUserIdArray(obj.designerUserIdArray?.concat() ?? []);
        this.setNextCampaignMapId(obj.nextCampaignMapId);
        this.setAllCampaignMapIdArray(obj.allCampaignMapIdArray?.concat() ?? []);
        this.setEnabledCampaignMapIdArray(obj.enabledCampaignMapIdArray?.concat() ?? []);
        this.setNameArray(obj.nameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setDescArray(obj.descArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setExtraLink(obj.extraLink);
        return this;
    }
    public override toJson(obj?: CampaignInfoJson): CampaignInfoJson {
        obj ??= ({} as CampaignInfoJson);

        {
            const value = this.getCampaignId();
            (value != null) && (obj.campaignId = value);
        }

        {
            const value = this.getIsEnabled();
            (value != null) && (obj.isEnabled = value);
        }

        {
            obj.designerUserIdArray = this.getDesignerUserIdArray().concat();
        }

        {
            const value = this.getNextCampaignMapId();
            (value != null) && (obj.nextCampaignMapId = value);
        }

        {
            obj.allCampaignMapIdArray = this.getAllCampaignMapIdArray().concat();
        }

        {
            obj.enabledCampaignMapIdArray = this.getEnabledCampaignMapIdArray().concat();
        }

        {
            obj.nameArray = this.getNameArray().map(v => v.toJson());
        }

        {
            obj.descArray = this.getDescArray().map(v => v.toJson());
        }

        {
            const value = this.getExtraLink();
            (value != null) && (obj.extraLink = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCampaignId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsEnabled();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getDesignerUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getNextCampaignMapId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getAllCampaignMapIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(42).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getEnabledCampaignMapIdArray();
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
            const value = this.getNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(58).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getDescArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(66).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getExtraLink();
            if (value != null) {
                writer.uint32(74).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CampaignInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CampaignInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCampaignId(reader.int32());
                    break;

                case 2:
                    msg.setIsEnabled(reader.bool());
                    break;

                case 3:
                    {
                        const arr = msg._designerUserIdArray;
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

                case 4:
                    msg.setNextCampaignMapId(reader.int32());
                    break;

                case 5:
                    {
                        const arr = msg._allCampaignMapIdArray;
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

                case 6:
                    {
                        const arr = msg._enabledCampaignMapIdArray;
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
                        const arr = msg._nameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 8:
                    {
                        const arr = msg._descArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 9:
                    msg.setExtraLink(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CampaignInfo {
        return CampaignInfo.decode(this.encode());
    }

    public override getSchemaName(): "CampaignInfo" {
        return "CampaignInfo";
    }

    public checkHasCampaignId(): boolean {
        return this._campaignId != null;
    }
    public getCampaignId(): number {
        return this._campaignId ?? 0;
    }
    public setCampaignId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._campaignId = null;
        } else {
            this._campaignId = value;
        }
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

    public getDesignerUserIdArray(): number[] {
        return this._designerUserIdArray;
    }
    public setDesignerUserIdArray(value: number[]): void {
        this._designerUserIdArray = value;
    }

    public checkHasNextCampaignMapId(): boolean {
        return this._nextCampaignMapId != null;
    }
    public getNextCampaignMapId(): number {
        return this._nextCampaignMapId ?? 0;
    }
    public setNextCampaignMapId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._nextCampaignMapId = null;
        } else {
            this._nextCampaignMapId = value;
        }
    }

    public getAllCampaignMapIdArray(): number[] {
        return this._allCampaignMapIdArray;
    }
    public setAllCampaignMapIdArray(value: number[]): void {
        this._allCampaignMapIdArray = value;
    }

    public getEnabledCampaignMapIdArray(): number[] {
        return this._enabledCampaignMapIdArray;
    }
    public setEnabledCampaignMapIdArray(value: number[]): void {
        this._enabledCampaignMapIdArray = value;
    }

    public getNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._nameArray;
    }
    public setNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._nameArray = value;
    }

    public getDescArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._descArray;
    }
    public setDescArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._descArray = value;
    }

    public checkHasExtraLink(): boolean {
        return this._extraLink != null;
    }
    public getExtraLink(): string | null | undefined {
        return this._extraLink;
    }
    public setExtraLink(value: string | null | undefined): void {
        this._extraLink = value;
    }
}
