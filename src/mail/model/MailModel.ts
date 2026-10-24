import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MailModelMailData from "./MailData.ts";
import type * as ProtoSchemaCommonProtoMailMailFullData from "../../proto/schema/CommonProto/Mail/MailFullData.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";

type MailFullData       = ProtoSchemaCommonProtoMailMailFullData.MailFullData;

const _mailArray: MailModelMailData.MailData[] = [];

export function resetAllMailDataArray(mailFullDataArray: MailFullData[]): void {
    _mailArray.length = 0;

    for (const data of mailFullDataArray) {
        _mailArray.push(new MailModelMailData.MailData(data));
    }

    _mailArray.sort((v1, v2) => v2.getMailId() - v1.getMailId());
}
export function getAllMailDataArray(): MailModelMailData.MailData[] {
    return _mailArray;
}
export function getMail(mailId: number): MailModelMailData.MailData | null {
    return getAllMailDataArray().find(v => v.getMailId() === mailId) ?? null;
}

export function checkIsRed(): boolean {
    return _mailArray.some(v => v.getIsNew());
}

export function updateOnMsgMailGetMail(mailFullData: MailFullData): void {
    const mailData  = new MailModelMailData.MailData(mailFullData);
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
export function updateOnMsgMailSetIsNew(msg: ProtoSchemaCommonProtoNetMessageMsgMailSetIsNewS.S): void {
    getMail(HelpersMisc.getExisted(msg.getMailId()))?.setIsNew(!!msg.getIsNew());
}
