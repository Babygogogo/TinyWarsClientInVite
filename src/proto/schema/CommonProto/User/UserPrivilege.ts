import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UserPrivilegeJson extends $ProtoSchemaJsonBase {
    canLogin?: boolean | null | undefined;
    canChat?: boolean | null | undefined;
    isAdmin?: boolean | null | undefined;
    isMapCommittee?: boolean | null | undefined;
    isChangeLogEditor?: boolean | null | undefined;
    isChatManager?: boolean | null | undefined;
    isAutoTourneyCommittee?: boolean | null | undefined;
    isCampaignManager?: boolean | null | undefined;
}

export class UserPrivilege extends $ProtoSchemaBase {
    private _canLogin?: boolean | null | undefined;
    private _canChat?: boolean | null | undefined;
    private _isAdmin?: boolean | null | undefined;
    private _isMapCommittee?: boolean | null | undefined;
    private _isChangeLogEditor?: boolean | null | undefined;
    private _isChatManager?: boolean | null | undefined;
    private _isAutoTourneyCommittee?: boolean | null | undefined;
    private _isCampaignManager?: boolean | null | undefined;

    public static fromJson(obj: UserPrivilegeJson): UserPrivilege {
        return new UserPrivilege().loadJson(obj);
    }
    public override loadJson(obj: UserPrivilegeJson): this {
        this.setCanLogin(obj.canLogin);
        this.setCanChat(obj.canChat);
        this.setIsAdmin(obj.isAdmin);
        this.setIsMapCommittee(obj.isMapCommittee);
        this.setIsChangeLogEditor(obj.isChangeLogEditor);
        this.setIsChatManager(obj.isChatManager);
        this.setIsAutoTourneyCommittee(obj.isAutoTourneyCommittee);
        this.setIsCampaignManager(obj.isCampaignManager);
        return this;
    }
    public override toJson(obj?: UserPrivilegeJson): UserPrivilegeJson {
        obj ??= ({} as UserPrivilegeJson);

        {
            const value = this.getCanLogin();
            (value != null) && (obj.canLogin = value);
        }

        {
            const value = this.getCanChat();
            (value != null) && (obj.canChat = value);
        }

        {
            const value = this.getIsAdmin();
            (value != null) && (obj.isAdmin = value);
        }

        {
            const value = this.getIsMapCommittee();
            (value != null) && (obj.isMapCommittee = value);
        }

        {
            const value = this.getIsChangeLogEditor();
            (value != null) && (obj.isChangeLogEditor = value);
        }

        {
            const value = this.getIsChatManager();
            (value != null) && (obj.isChatManager = value);
        }

        {
            const value = this.getIsAutoTourneyCommittee();
            (value != null) && (obj.isAutoTourneyCommittee = value);
        }

        {
            const value = this.getIsCampaignManager();
            (value != null) && (obj.isCampaignManager = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCanLogin();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getCanChat();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getIsAdmin();
            if ((value != null) && (value != false)) {
                writer.uint32(80).bool(value);
            }
        }

        {
            const value = this.getIsMapCommittee();
            if ((value != null) && (value != false)) {
                writer.uint32(88).bool(value);
            }
        }

        {
            const value = this.getIsChangeLogEditor();
            if ((value != null) && (value != false)) {
                writer.uint32(96).bool(value);
            }
        }

        {
            const value = this.getIsChatManager();
            if ((value != null) && (value != false)) {
                writer.uint32(104).bool(value);
            }
        }

        {
            const value = this.getIsAutoTourneyCommittee();
            if ((value != null) && (value != false)) {
                writer.uint32(112).bool(value);
            }
        }

        {
            const value = this.getIsCampaignManager();
            if ((value != null) && (value != false)) {
                writer.uint32(120).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserPrivilege {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserPrivilege();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCanLogin(reader.bool());
                    break;

                case 2:
                    msg.setCanChat(reader.bool());
                    break;

                case 10:
                    msg.setIsAdmin(reader.bool());
                    break;

                case 11:
                    msg.setIsMapCommittee(reader.bool());
                    break;

                case 12:
                    msg.setIsChangeLogEditor(reader.bool());
                    break;

                case 13:
                    msg.setIsChatManager(reader.bool());
                    break;

                case 14:
                    msg.setIsAutoTourneyCommittee(reader.bool());
                    break;

                case 15:
                    msg.setIsCampaignManager(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserPrivilege {
        return UserPrivilege.decode(this.encode());
    }

    public override getSchemaName(): "UserPrivilege" {
        return "UserPrivilege";
    }

    public checkHasCanLogin(): boolean {
        return this._canLogin != null;
    }
    public getCanLogin(): boolean {
        return this._canLogin ?? false;
    }
    public setCanLogin(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canLogin = null;
        } else {
            this._canLogin = value;
        }
    }

    public checkHasCanChat(): boolean {
        return this._canChat != null;
    }
    public getCanChat(): boolean {
        return this._canChat ?? false;
    }
    public setCanChat(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canChat = null;
        } else {
            this._canChat = value;
        }
    }

    public checkHasIsAdmin(): boolean {
        return this._isAdmin != null;
    }
    public getIsAdmin(): boolean {
        return this._isAdmin ?? false;
    }
    public setIsAdmin(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isAdmin = null;
        } else {
            this._isAdmin = value;
        }
    }

    public checkHasIsMapCommittee(): boolean {
        return this._isMapCommittee != null;
    }
    public getIsMapCommittee(): boolean {
        return this._isMapCommittee ?? false;
    }
    public setIsMapCommittee(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isMapCommittee = null;
        } else {
            this._isMapCommittee = value;
        }
    }

    public checkHasIsChangeLogEditor(): boolean {
        return this._isChangeLogEditor != null;
    }
    public getIsChangeLogEditor(): boolean {
        return this._isChangeLogEditor ?? false;
    }
    public setIsChangeLogEditor(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isChangeLogEditor = null;
        } else {
            this._isChangeLogEditor = value;
        }
    }

    public checkHasIsChatManager(): boolean {
        return this._isChatManager != null;
    }
    public getIsChatManager(): boolean {
        return this._isChatManager ?? false;
    }
    public setIsChatManager(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isChatManager = null;
        } else {
            this._isChatManager = value;
        }
    }

    public checkHasIsAutoTourneyCommittee(): boolean {
        return this._isAutoTourneyCommittee != null;
    }
    public getIsAutoTourneyCommittee(): boolean {
        return this._isAutoTourneyCommittee ?? false;
    }
    public setIsAutoTourneyCommittee(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isAutoTourneyCommittee = null;
        } else {
            this._isAutoTourneyCommittee = value;
        }
    }

    public checkHasIsCampaignManager(): boolean {
        return this._isCampaignManager != null;
    }
    public getIsCampaignManager(): boolean {
        return this._isCampaignManager ?? false;
    }
    public setIsCampaignManager(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isCampaignManager = null;
        } else {
            this._isCampaignManager = value;
        }
    }
}
