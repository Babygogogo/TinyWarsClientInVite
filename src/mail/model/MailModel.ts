import { getExisted } from "../../helpers/Misc.ts";
import { MailData } from "./MailData.ts";
import type { MailFullData } from "../../proto/schema/CommonProto/Mail/MailFullData.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";

const _mailArray: MailData[] = [];

export function resetAllMailDataArray(mailFullDataArray: MailFullData[]): void {
    _mailArray.length = 0;

    for (const data of mailFullDataArray) {
        _mailArray.push(new MailData(data));
    }

    _mailArray.sort((v1, v2) => v2.getMailId() - v1.getMailId());
}
export function getAllMailDataArray(): MailData[] {
    return _mailArray;
}
export function getMail(mailId: number): MailData | null {
    return getAllMailDataArray().find(v => v.getMailId() === mailId) ?? null;
}

export function checkIsRed(): boolean {
    return _mailArray.some(v => v.getIsNew());
}

export function updateOnMsgMailGetMail(mailFullData: MailFullData): void {
    const mailData  = new MailData(mailFullData);
    const mailId    = mailData.getMailId();
    const index     = _mailArray.findIndex(v => v.getMailId() === mailId);
    if (index >= 0) {
        _mailArray[index] = mailData;
    } else {
        _mailArray.push(mailData);
        _mailArray.sort((v1, v2) => v2.getMailId() - v1.getMailId());
    }
}
export function updateOnMsgMailDeleteMail(mailId: number): void {
    const index = _mailArray.findIndex(v => v.getMailId() === mailId);
    if (index >= 0) {
        _mailArray.splice(index, 1);
    }
}
export function updateOnMsgMailSetIsNew(msg: S): void {
    getMail(getExisted(msg.getMailId()))?.setIsNew(!!msg.getIsNew());
}
