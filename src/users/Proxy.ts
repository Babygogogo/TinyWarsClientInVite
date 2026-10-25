import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { b64_sha1 } from "../helpers/Sha1Generator.ts";
import { addListeners, send } from "../networks/Manager.ts";
import { MessageCodes } from "../networks/MessageCodes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S } from "../proto/schema/CommonProto/NetMessage/MsgUserGetBriefInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineUserIdArrayS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineUserIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoArrayS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfoArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserGetUsersByNicknameS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserGetUsersByNickname/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgUserLoginS } from "../proto/schema/CommonProto/NetMessage/MsgUserLogin/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserLoginAsGuest/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS } from "../proto/schema/CommonProto/NetMessage/MsgUserLogout/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserModifyFavoriteReplayIdArray/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgUserRegisterS } from "../proto/schema/CommonProto/NetMessage/MsgUserRegister/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserRequestPasswordVerificationCodeS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserRequestPasswordVerificationCode/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserResetPasswordWithEmailS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserResetPasswordWithEmail/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetAvatarId/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetDiscordInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapRating/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetNickname/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetPasswordS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetPassword/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetSceneBgmSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetSettings/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserSetShowMedalIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS,
} from "../proto/schema/CommonProto/NetMessage/MsgUserVerifyEmail/S.ts";
import type { UserDiscordInfoJson } from "../proto/schema/CommonProto/User/UserDiscordInfo.ts";
import type { UserSettingsJson } from "../proto/schema/CommonProto/User/UserSettings.ts";
import type { SceneBgmSettingsJson } from "../proto/schema/CommonProto/User/UserSettings/SceneBgmSettings.ts";
import {
    updateOnMsgUserLogin,
    updateOnMsgUserLoginAsGuest,
    updateOnFailedMsgUserGetPublicInfo,
    updateOnMsgUserGetPublicInfo,
    updateOnFailedMsgUserGetBriefInfo,
    updateOnMsgUserGetBriefInfo,
    updateOnFailedMsgUserGetOnlineState,
    updateOnMsgUserGetOnlineState,
    updateOnMsgUserSetNickname,
    updateOnMsgUserSetDiscordInfo,
    updateOnMsgUserSetSettings,
    updateOnMsgUserSetMapRating,
    updateOnMsgUserSetRelation,
    updateOnMsgUserModifyFavoriteReplayIdArray,
    updateOnMsgUserSetAvatarId,
    updateOnMsgUserSetMapEditorAutoSaveTime,
    updateOnMsgUserSetCoBgmSettings,
    updateOnMsgUserSetSceneBgmSettings,
    updateOnMsgUserSetShowMedalIdArray,
    updateOnMsgUserRequestEmailVerificationCode,
    updateOnMsgUserVerifyEmail,
} from "./Model.ts";
import type { Event } from "../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgUserLogin,                            callback: _onMsgUserLogin, },
        { msgCode: MessageCodes.MsgUserLoginAsGuest,                     callback: _onMsgUserLoginAsGuest },
        { msgCode: MessageCodes.MsgUserRegister,                         callback: _onMsgUserRegister, },
        { msgCode: MessageCodes.MsgUserLogout,                           callback: _onMsgUserLogout, },
        { msgCode: MessageCodes.MsgUserGetPublicInfo,                    callback: _onMsgUserGetPublicInfo, },
        { msgCode: MessageCodes.MsgUserGetPublicInfoArray,               callback: _onMsgUserGetPublicInfoArray, },
        { msgCode: MessageCodes.MsgUserGetBriefInfo,                     callback: _onMsgUserGetBriefInfo, },
        { msgCode: MessageCodes.MsgUserGetOnlineState,                   callback: _onMsgUserGetOnlineState },
        { msgCode: MessageCodes.MsgUserGetUsersByNickname,               callback: _onMsgUserGetUsersByNickname },
        { msgCode: MessageCodes.MsgUserSetNickname,                      callback: _onMsgUserSetNickname, },
        { msgCode: MessageCodes.MsgUserSetDiscordInfo,                   callback: _onMsgUserSetDiscordInfo, },
        { msgCode: MessageCodes.MsgUserGetOnlineUserIdArray,             callback: _onMsgUserGetOnlineUserIdArray, },
        { msgCode: MessageCodes.MsgUserSetPassword,                      callback: _onMsgUserSetPassword, },
        { msgCode: MessageCodes.MsgUserSetSettings,                      callback: _onMsgUserSetSettings, },
        { msgCode: MessageCodes.MsgUserSetMapRating,                     callback: _onMsgUserSetMapRating },
        { msgCode: MessageCodes.MsgUserSetRelation,                      callback: _onMsgUserSetRelation },
        { msgCode: MessageCodes.MsgUserModifyFavoriteReplayIdArray,      callback: _onMsgUserModifyFavoriteReplayIdArray },
        { msgCode: MessageCodes.MsgUserRequestEmailVerificationCode,     callback: _onMsgUserRequestEmailVerificationCode },
        { msgCode: MessageCodes.MsgUserRequestPasswordVerificationCode,  callback: _onMsgUserRequestPasswordVerificationCode },
        { msgCode: MessageCodes.MsgUserResetPasswordWithEmail,           callback: _onMsgUserResetPasswordWithEmail },
        { msgCode: MessageCodes.MsgUserSetAvatarId,                      callback: _onMsgUserSetAvatarId },
        { msgCode: MessageCodes.MsgUserSetMapEditorAutoSaveTime,         callback: _onMsgUserSetMapEditorAutoSaveTime },
        { msgCode: MessageCodes.MsgUserSetCoBgmSettings,                 callback: _onMsgUserSetCoBgmSettings },
        { msgCode: MessageCodes.MsgUserSetSceneBgmSettings,              callback: _onMsgUserSetSceneBgmSettings },
        { msgCode: MessageCodes.MsgUserSetShowMedalIdArray,              callback: _onMsgUserSetShowMedalIdArray },
        { msgCode: MessageCodes.MsgUserVerifyEmail,                      callback: _onMsgUserVerifyEmail },
    ]);
}

export function reqLogin(account: string, rawPassword: string, isAutoRelogin: boolean): void {
    send({
        MsgUserLogin: { c: {
            account,
            password    : b64_sha1(rawPassword),
            isAutoRelogin,
        } },
    });
}
export function reqRawLogin(account: string, password: string): void {
    send({
        MsgUserLogin: { c: {
            account,
            password,
            isAutoRelogin   : false,
        } },
    });
}
function _onMsgUserLogin(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserLoginS;
    if (!data.getErrorCode()) {
        updateOnMsgUserLogin(data);
        dispatch(TypeId.MsgUserLogin, data);
    }
}

export function reqUserLoginAsGuest(userId: number | null, isAutoRelogin: boolean): void {
    send({
        MsgUserLoginAsGuest: { c: {
            userId,
            isAutoRelogin,
        } },
    });
}
function _onMsgUserLoginAsGuest(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS;
    if (!data.getErrorCode()) {
        updateOnMsgUserLoginAsGuest(data);
        dispatch(TypeId.MsgUserLoginAsGuest, data);
    }
}

export function reqUserRegister(account: string, rawPassword: string, nickname: string): void {
    send({
        MsgUserRegister: { c: {
            account,
            password: b64_sha1(rawPassword),
            nickname,
        } },
    });
}
function _onMsgUserRegister(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserRegisterS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserRegister, data);
    }
}

export function reqLogout(): void {
    send({
        MsgUserLogout: { c: {
        } },
    });
}
function _onMsgUserLogout(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserLogout, data);
    }
}

export function reqUserGetPublicInfo(userId: number): void {
    send({
        MsgUserGetPublicInfo: { c: {
            userId,
        } },
    });
}
function _onMsgUserGetPublicInfo(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS;
    if (data.getErrorCode()) {
        updateOnFailedMsgUserGetPublicInfo(data);
    } else {
        updateOnMsgUserGetPublicInfo(data);
        dispatch(TypeId.MsgUserGetPublicInfo, data);
    }
}

export function reqUserGetPublicInfoArray(userIdArray: number[]): void {
    send({
        MsgUserGetPublicInfoArray: { c: {
            userIdArray : userIdArray,
        } },
    });
}
function _onMsgUserGetPublicInfoArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoArrayS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserGetPublicInfoArray, data);
    }
}

export function reqUserGetBriefInfo(userId: number): void {
    send({
        MsgUserGetBriefInfo: { c: {
            userId,
        } },
    });
}
function _onMsgUserGetBriefInfo(e: Event): void {
    const data = e.data as S;
    if (data.getErrorCode()) {
        updateOnFailedMsgUserGetBriefInfo(data);
    } else {
        updateOnMsgUserGetBriefInfo(data);
        dispatch(TypeId.MsgUserGetBriefInfo, data);
    }
}

export function reqUserGetOnlineState(userId: number): void {
    send({
        MsgUserGetOnlineState: { c: {
            userId,
        } },
    });
}
function _onMsgUserGetOnlineState(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS;
    if (data.getErrorCode()) {
        updateOnFailedMsgUserGetOnlineState(data);
    } else {
        updateOnMsgUserGetOnlineState(data);
        dispatch(TypeId.MsgUserGetOnlineState, data);
    }
}

export function reqUserGetUsersByNickname(nickname: string, isFollowing: boolean | null): void {
    send({
        MsgUserGetUsersByNickname: { c: {
            nickname    : nickname,
            isFollowing : isFollowing,
        } },
    });
}
function _onMsgUserGetUsersByNickname(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetUsersByNicknameS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserGetUsersByNickname, data);
    }
}

export function reqSetNickname(nickname: string): void {
    send({
        MsgUserSetNickname: { c: {
            nickname,
        }, },
    });
}
async function _onMsgUserSetNickname(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS;
    if (data.getErrorCode()) {
        dispatch(TypeId.MsgUserSetNicknameFailed, data);
    } else {
        updateOnMsgUserSetNickname(data);
        dispatch(TypeId.MsgUserSetNickname, data);
    }
}

export function reqSetDiscordInfo(discordInfo: UserDiscordInfoJson): void {
    send({
        MsgUserSetDiscordInfo: { c: {
            discordInfo : discordInfo,
        }, },
    });
}
async function _onMsgUserSetDiscordInfo(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS;
    if (data.getErrorCode()) {
        dispatch(TypeId.MsgUserSetDiscordInfoFailed, data);
    } else {
        updateOnMsgUserSetDiscordInfo(data);
        dispatch(TypeId.MsgUserSetDiscordInfo, data);
    }
}

export function reqUserGetOnlineUserIdArray(): void {
    send({
        MsgUserGetOnlineUserIdArray: { c: {} },
    });
}
function _onMsgUserGetOnlineUserIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineUserIdArrayS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserGetOnlineUserIdArray, data);
    }
}

export function reqUserSetPassword(oldRawPassword: string, newRawPassword: string): void {
    send({ MsgUserSetPassword: { c: {
        oldPassword : b64_sha1(oldRawPassword),
        newPassword : b64_sha1(newRawPassword),
    } } });
}
function _onMsgUserSetPassword(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetPasswordS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserSetPassword, data);
    }
}

export function reqUserSetSettings(userSettings: UserSettingsJson): void {
    send({ MsgUserSetSettings: { c: {
        userSettings    : userSettings,
    } } });
}
function _onMsgUserSetSettings(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS;
    if (!data.getErrorCode()) {
        updateOnMsgUserSetSettings(data);
        dispatch(TypeId.MsgUserSetSettings, data);
    }
}

export function reqUserSetMapRating(normalMapId: number, rating: number): void {
    send({ MsgUserSetMapRating: { c: {
        normalMapId : normalMapId,
        rating,
    } } });
}
function _onMsgUserSetMapRating(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS;
    if (!data.getErrorCode()) {
        updateOnMsgUserSetMapRating(data);
        dispatch(TypeId.MsgUserSetMapRating, data);
    }
}

export function reqUserSetRelation(targetUserId: number, isFollow: boolean, isBlock: boolean): void {
    send({ MsgUserSetRelation: { c: {
        targetUserId    : targetUserId,
        isFollowing     : isFollow,
        isBlocking      : isBlock,
    }}});
}
function _onMsgUserSetRelation(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS;
    if (!data.getErrorCode()) {
        updateOnMsgUserSetRelation(data);
        dispatch(TypeId.MsgUserSetRelation, data);
    }
}

export function reqUserModifyFavoriteReplayIdArray(addIdArray: number[], deleteIdArray: number[]): void {
    send({ MsgUserModifyFavoriteReplayIdArray: { c: {
        addIdArray      : addIdArray,
        deleteIdArray   : deleteIdArray,
    }}});
}
function _onMsgUserModifyFavoriteReplayIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS;
    if (!data.getErrorCode()) {
        updateOnMsgUserModifyFavoriteReplayIdArray(data);
        dispatch(TypeId.MsgUserModifyFavoriteReplayIdArray, data);
    }
}

export function reqSetAvatarId(avatarId: number): void {
    send({
        MsgUserSetAvatarId: { c: {
            avatarId,
        }, },
    });
}
async function _onMsgUserSetAvatarId(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS;
    if (data.getErrorCode()) {
        dispatch(TypeId.MsgUserSetAvatarIdFailed, data);
    } else {
        updateOnMsgUserSetAvatarId(data);
        dispatch(TypeId.MsgUserSetAvatarId, data);
    }
}

export function reqSetMapEditorAutoSaveTime(time: Undefinable<number>): void {
    send({
        MsgUserSetMapEditorAutoSaveTime: { c: {
            time,
        }, },
    });
}
function _onMsgUserSetMapEditorAutoSaveTime(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS;
    if (data.getErrorCode()) {
        dispatch(TypeId.MsgUserSetMapEditorAutoSaveTimeFailed, data);
    } else {
        updateOnMsgUserSetMapEditorAutoSaveTime(data);
        dispatch(TypeId.MsgUserSetMapEditorAutoSaveTime, data);
    }
}

export function reqUserSetCoBgmSettings(coCategoryId: number, bgmCodeArray: number[] | null): void {
    send({
        MsgUserSetCoBgmSettings: { c: {
            coCategoryId    : coCategoryId,
            bgmCodeArray    : bgmCodeArray ?? [],
        } }
    });
}
function _onMsgUserSetCoBgmSettings(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS;
    if (!data.getErrorCode()) {
        updateOnMsgUserSetCoBgmSettings(data);
        dispatch(TypeId.MsgUserSetCoBgmSettings, data);
    }
}

export function reqUserSetSceneBgmSettings(settings: SceneBgmSettingsJson): void {
    send({
        MsgUserSetSceneBgmSettings: { c: {
            sceneBgmSettings    : settings,
        } },
    });
}
function _onMsgUserSetSceneBgmSettings(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS;
    if (!data.getErrorCode()) {
        updateOnMsgUserSetSceneBgmSettings(data);
        dispatch(TypeId.MsgUserSetSceneBgmSettings, data);
    }
}

export function reqUserSetShowMedalIdArray(showMedalIdArray: number[]): void {
    send({
        MsgUserSetShowMedalIdArray: { c: {
            showMedalIdArray    : showMedalIdArray,
        } },
    });
}
function _onMsgUserSetShowMedalIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS;
    if (!data.getErrorCode()) {
        updateOnMsgUserSetShowMedalIdArray(data);
        dispatch(TypeId.MsgUserSetShowMedalIdArray, data);
    }
}

export function reqUserRequestEmailVerificationCode(address: string): void {
    send({
        MsgUserRequestEmailVerificationCode: { c: {
            emailAddress    : address,
        } },
    });
}
function _onMsgUserRequestEmailVerificationCode(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS;
    if (!data.getErrorCode()) {
        updateOnMsgUserRequestEmailVerificationCode(data);
        dispatch(TypeId.MsgUserRequestEmailVerificationCode, data);
    } else {
        dispatch(TypeId.MsgUserRequestEmailVerificationCodeFailed, data);
    }
}

export function reqUserVerifyEmail(code: string): void {
    send({
        MsgUserVerifyEmail: { c: {
            verificationCode    : code,
        } },
    });
}
function _onMsgUserVerifyEmail(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS;
    if (!data.getErrorCode()) {
        updateOnMsgUserVerifyEmail(data);
        dispatch(TypeId.MsgUserVerifyEmail, data);
    }
}

export function reqUserRequestPasswordVerificationCode(account: string): void {
    send({
        MsgUserRequestPasswordVerificationCode: { c: {
            account : account,
        } },
    });
}
function _onMsgUserRequestPasswordVerificationCode(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserRequestPasswordVerificationCodeS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserRequestPasswordVerificationCode, data);
    } else {
        dispatch(TypeId.MsgUserRequestPasswordVerificationCodeFailed, data);
    }
}

export function reqUserResetPasswordWithEmail(code: string, account: string, newRawPassword: string): void {
    send({
        MsgUserResetPasswordWithEmail: { c: {
            verificationCode    : code,
            account             : account,
            newPassword         : b64_sha1(newRawPassword),
        } },
    });
}
function _onMsgUserResetPasswordWithEmail(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserResetPasswordWithEmailS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgUserResetPasswordWithEmail, data);
    }
}
