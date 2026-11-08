import {
    Helpers_Misc,
} from "../../internal.ts";
import { MailContainer } from "../../proto/schema/CommonProto/Mail/MailContainer.ts";
import type { MailFullData } from "../../proto/schema/CommonProto/Mail/MailFullData.ts";

export class MailData {
    private readonly _mailId             : number;
    private readonly _createTimestamp    : number;
    private _isNew              : boolean;
    private readonly _mailContainer      : MailContainer;

    public constructor(mailFullData: MailFullData) {
        this._mailId            = mailFullData.getMailId() ?? 0;
        this._createTimestamp   = mailFullData.getCreateTimestamp() ?? 0;
        this._isNew             = !!mailFullData.getIsNew();
        this._mailContainer     = MailContainer.decode(Helpers_Misc.getExisted(mailFullData.getEncodedContainer()));
    }

    public getMailId(): number {
        return this._mailId;
    }
    public getCreateTimestamp(): number {
        return this._createTimestamp;
    }

    public getIsNew(): boolean {
        return this._isNew;
    }
    public setIsNew(isNew: boolean): void {
        this._isNew = isNew;
    }

    public getMailContainer(): MailContainer {
        return this._mailContainer;
    }
}
