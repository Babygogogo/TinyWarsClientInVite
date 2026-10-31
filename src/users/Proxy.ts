import {
    Networks_Manager,
    Helpers_Sha1Generator,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Users_Model,
    type Egret_Egret,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { S as UserGetBriefInfoResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetBriefInfo/S.ts";
import type { S as UserGetOnlineStateResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import type { S as UserGetOnlineUserIdArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineUserIdArray/S.ts";
import type { S as UserGetPublicInfoResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfo/S.ts";
import type { S as UserGetPublicInfoArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfoArray/S.ts";
import type { S as UserGetUsersByNicknameResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserGetUsersByNickname/S.ts";
import type { S as UserLoginResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserLogin/S.ts";
import type { S as UserLoginAsGuestResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserLoginAsGuest/S.ts";
import type { S as UserLogoutResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserLogout/S.ts";
import type { S as UserModifyFavoriteReplayIdArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserModifyFavoriteReplayIdArray/S.ts";
import type { S as UserRegisterResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserRegister/S.ts";
import type { S as UserRequestEmailVerificationCodeResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import type { S as UserRequestPasswordVerificationCodeResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserRequestPasswordVerificationCode/S.ts";
import type { S as UserResetPasswordWithEmailResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserResetPasswordWithEmail/S.ts";
import type { S as UserSetAvatarIdResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetAvatarId/S.ts";
import type { S as UserSetCoBgmSettingsResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import type { S as UserSetDiscordInfoResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetDiscordInfo/S.ts";
import type { S as UserSetMapEditorAutoSaveTimeResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import type { S as UserSetMapRatingResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapRating/S.ts";
import type { S as UserSetNicknameResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetNickname/S.ts";
import type { S as UserSetPasswordResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetPassword/S.ts";
import type { S as UserSetRelationResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import type { S as UserSetSceneBgmSettingsResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetSceneBgmSettings/S.ts";
import type { S as UserSetSettingsResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetSettings/S.ts";
import type { S as UserSetShowMedalIdArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserSetShowMedalIdArray/S.ts";
import type { S as UserVerifyEmailResponse } from "../proto/schema/CommonProto/NetMessage/MsgUserVerifyEmail/S.ts";
import type { UserDiscordInfoJson } from "../proto/schema/CommonProto/User/UserDiscordInfo.ts";
import type { UserSettingsJson } from "../proto/schema/CommonProto/User/UserSettings.ts";
import type { SceneBgmSettingsJson } from "../proto/schema/CommonProto/User/UserSettings/SceneBgmSettings.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserLogin,                            callback : _onMsgUserLogin },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserLoginAsGuest,                     callback : _onMsgUserLoginAsGuest },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserRegister,                         callback : _onMsgUserRegister },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserLogout,                           callback : _onMsgUserLogout },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserGetPublicInfo,                    callback : _onMsgUserGetPublicInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserGetPublicInfoArray,               callback : _onMsgUserGetPublicInfoArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserGetBriefInfo,                     callback : _onMsgUserGetBriefInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserGetOnlineState,                   callback : _onMsgUserGetOnlineState },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserGetUsersByNickname,               callback : _onMsgUserGetUsersByNickname },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetNickname,                      callback : _onMsgUserSetNickname },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetDiscordInfo,                   callback : _onMsgUserSetDiscordInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserGetOnlineUserIdArray,             callback : _onMsgUserGetOnlineUserIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetPassword,                      callback : _onMsgUserSetPassword },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetSettings,                      callback : _onMsgUserSetSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetMapRating,                     callback : _onMsgUserSetMapRating },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetRelation,                      callback : _onMsgUserSetRelation },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserModifyFavoriteReplayIdArray,      callback : _onMsgUserModifyFavoriteReplayIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserRequestEmailVerificationCode,     callback : _onMsgUserRequestEmailVerificationCode },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserRequestPasswordVerificationCode,  callback : _onMsgUserRequestPasswordVerificationCode },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserResetPasswordWithEmail,           callback : _onMsgUserResetPasswordWithEmail },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetAvatarId,                      callback : _onMsgUserSetAvatarId },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetMapEditorAutoSaveTime,         callback : _onMsgUserSetMapEditorAutoSaveTime },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetCoBgmSettings,                 callback : _onMsgUserSetCoBgmSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetSceneBgmSettings,              callback : _onMsgUserSetSceneBgmSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserSetShowMedalIdArray,              callback : _onMsgUserSetShowMedalIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgUserVerifyEmail,                      callback : _onMsgUserVerifyEmail },
    ]);
}

export function reqLogin(account: string, rawPassword: string, isAutoRelogin: boolean): void {
    Networks_Manager.send({
        MsgUserLogin : {
            c : {
                account,
                password : Helpers_Sha1Generator.b64_sha1(rawPassword),
                isAutoRelogin,
            }, 
        },
    });
}
export function reqRawLogin(account: string, password: string): void {
    Networks_Manager.send({
        MsgUserLogin : {
            c : {
                account,
                password,
                isAutoRelogin : false,
            }, 
        },
    });
}
function _onMsgUserLogin(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserLogin"]>): void {
    const data = e.data as UserLoginResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserLogin(data);
        Notifications_Dispatcher.dispatch("MsgUserLogin", { msg: data });
    }
}

export function reqUserLoginAsGuest(userId: number | null, isAutoRelogin: boolean): void {
    Networks_Manager.send({
        MsgUserLoginAsGuest : {
            c : {
                userId,
                isAutoRelogin,
            }, 
        },
    });
}
function _onMsgUserLoginAsGuest(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserLoginAsGuest"]>): void {
    const data = e.data as UserLoginAsGuestResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserLoginAsGuest(data);
        Notifications_Dispatcher.dispatch("MsgUserLoginAsGuest", { msg: data });
    }
}

export function reqUserRegister(account: string, rawPassword: string, nickname: string): void {
    Networks_Manager.send({
        MsgUserRegister : {
            c : {
                account,
                password : Helpers_Sha1Generator.b64_sha1(rawPassword),
                nickname,
            }, 
        },
    });
}
function _onMsgUserRegister(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserRegister"]>): void {
    const data = e.data as UserRegisterResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserRegister", { msg: data });
    }
}

export function reqLogout(): void {
    Networks_Manager.send({
        MsgUserLogout : {
            c : {
            }, 
        },
    });
}
function _onMsgUserLogout(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserLogout"]>): void {
    const data = e.data as UserLogoutResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserLogout", { msg: data });
    }
}

export function reqUserGetPublicInfo(userId: number): void {
    Networks_Manager.send({
        MsgUserGetPublicInfo : {
            c : {
                userId,
            }, 
        },
    });
}
function _onMsgUserGetPublicInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserGetPublicInfo"]>): void {
    const data = e.data as UserGetPublicInfoResponse;
    if (data.getErrorCode()) {
        Users_Model.updateOnFailedMsgUserGetPublicInfo(data);
    } else {
        Users_Model.updateOnMsgUserGetPublicInfo(data);
        Notifications_Dispatcher.dispatch("MsgUserGetPublicInfo", { msg: data });
    }
}

export function reqUserGetPublicInfoArray(userIdArray: number[]): void {
    Networks_Manager.send({
        MsgUserGetPublicInfoArray : {
            c : {
                userIdArray : userIdArray,
            }, 
        },
    });
}
function _onMsgUserGetPublicInfoArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserGetPublicInfoArray"]>): void {
    const data = e.data as UserGetPublicInfoArrayResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserGetPublicInfoArray", { msg: data });
    }
}

export function reqUserGetBriefInfo(userId: number): void {
    Networks_Manager.send({
        MsgUserGetBriefInfo : {
            c : {
                userId,
            }, 
        },
    });
}
function _onMsgUserGetBriefInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserGetBriefInfo"]>): void {
    const data = e.data as UserGetBriefInfoResponse;
    if (data.getErrorCode()) {
        Users_Model.updateOnFailedMsgUserGetBriefInfo(data);
    } else {
        Users_Model.updateOnMsgUserGetBriefInfo(data);
        Notifications_Dispatcher.dispatch("MsgUserGetBriefInfo", { msg: data });
    }
}

export function reqUserGetOnlineState(userId: number): void {
    Networks_Manager.send({
        MsgUserGetOnlineState : {
            c : {
                userId,
            }, 
        },
    });
}
function _onMsgUserGetOnlineState(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserGetOnlineState"]>): void {
    const data = e.data as UserGetOnlineStateResponse;
    if (data.getErrorCode()) {
        Users_Model.updateOnFailedMsgUserGetOnlineState(data);
    } else {
        Users_Model.updateOnMsgUserGetOnlineState(data);
        Notifications_Dispatcher.dispatch("MsgUserGetOnlineState", { msg: data });
    }
}

export function reqUserGetUsersByNickname(nickname: string, isFollowing: boolean | null): void {
    Networks_Manager.send({
        MsgUserGetUsersByNickname : {
            c : {
                nickname    : nickname,
                isFollowing : isFollowing,
            }, 
        },
    });
}
function _onMsgUserGetUsersByNickname(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserGetUsersByNickname"]>): void {
    const data = e.data as UserGetUsersByNicknameResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserGetUsersByNickname", { msg: data });
    }
}

export function reqSetNickname(nickname: string): void {
    Networks_Manager.send({
        MsgUserSetNickname : {
            c : {
                nickname,
            }, 
        },
    });
}
async function _onMsgUserSetNickname(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetNickname"]>): Promise<void> {
    const data = e.data as UserSetNicknameResponse;
    if (data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserSetNicknameFailed", { msg: data });
    } else {
        Users_Model.updateOnMsgUserSetNickname(data);
        Notifications_Dispatcher.dispatch("MsgUserSetNickname", { msg: data });
    }
}

export function reqSetDiscordInfo(discordInfo: UserDiscordInfoJson): void {
    Networks_Manager.send({
        MsgUserSetDiscordInfo : {
            c : {
                discordInfo : discordInfo,
            }, 
        },
    });
}
async function _onMsgUserSetDiscordInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetDiscordInfo"]>): Promise<void> {
    const data = e.data as UserSetDiscordInfoResponse;
    if (data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserSetDiscordInfoFailed", { msg: data });
    } else {
        Users_Model.updateOnMsgUserSetDiscordInfo(data);
        Notifications_Dispatcher.dispatch("MsgUserSetDiscordInfo", { msg: data });
    }
}

export function reqUserGetOnlineUserIdArray(): void {
    Networks_Manager.send({
        MsgUserGetOnlineUserIdArray : { c : {} },
    });
}
function _onMsgUserGetOnlineUserIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserGetOnlineUserIdArray"]>): void {
    const data = e.data as UserGetOnlineUserIdArrayResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserGetOnlineUserIdArray", { msg: data });
    }
}

export function reqUserSetPassword(oldRawPassword: string, newRawPassword: string): void {
    Networks_Manager.send({
        MsgUserSetPassword : {
            c : {
                oldPassword : Helpers_Sha1Generator.b64_sha1(oldRawPassword),
                newPassword : Helpers_Sha1Generator.b64_sha1(newRawPassword),
            }, 
        }, 
    });
}
function _onMsgUserSetPassword(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetPassword"]>): void {
    const data = e.data as UserSetPasswordResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserSetPassword", { msg: data });
    }
}

export function reqUserSetSettings(userSettings: UserSettingsJson): void {
    Networks_Manager.send({
        MsgUserSetSettings : {
            c : {
                userSettings : userSettings,
            }, 
        }, 
    });
}
function _onMsgUserSetSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetSettings"]>): void {
    const data = e.data as UserSetSettingsResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserSetSettings(data);
        Notifications_Dispatcher.dispatch("MsgUserSetSettings", { msg: data });
    }
}

export function reqUserSetMapRating(normalMapId: number, rating: number): void {
    Networks_Manager.send({
        MsgUserSetMapRating : {
            c : {
                normalMapId : normalMapId,
                rating,
            }, 
        }, 
    });
}
function _onMsgUserSetMapRating(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetMapRating"]>): void {
    const data = e.data as UserSetMapRatingResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserSetMapRating(data);
        Notifications_Dispatcher.dispatch("MsgUserSetMapRating", { msg: data });
    }
}

export function reqUserSetRelation(targetUserId: number, isFollow: boolean, isBlock: boolean): void {
    Networks_Manager.send({
        MsgUserSetRelation : {
            c : {
                targetUserId : targetUserId,
                isFollowing  : isFollow,
                isBlocking   : isBlock,
            }, 
        }, 
    });
}
function _onMsgUserSetRelation(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetRelation"]>): void {
    const data = e.data as UserSetRelationResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserSetRelation(data);
        Notifications_Dispatcher.dispatch("MsgUserSetRelation", { msg: data });
    }
}

export function reqUserModifyFavoriteReplayIdArray(addIdArray: number[], deleteIdArray: number[]): void {
    Networks_Manager.send({
        MsgUserModifyFavoriteReplayIdArray : {
            c : {
                addIdArray    : addIdArray,
                deleteIdArray : deleteIdArray,
            }, 
        }, 
    });
}
function _onMsgUserModifyFavoriteReplayIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserModifyFavoriteReplayIdArray"]>): void {
    const data = e.data as UserModifyFavoriteReplayIdArrayResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserModifyFavoriteReplayIdArray(data);
        Notifications_Dispatcher.dispatch("MsgUserModifyFavoriteReplayIdArray", { msg: data });
    }
}

export function reqSetAvatarId(avatarId: number): void {
    Networks_Manager.send({
        MsgUserSetAvatarId : {
            c : {
                avatarId,
            }, 
        },
    });
}
async function _onMsgUserSetAvatarId(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetAvatarId"]>): Promise<void> {
    const data = e.data as UserSetAvatarIdResponse;
    if (data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserSetAvatarIdFailed", { msg: data });
    } else {
        Users_Model.updateOnMsgUserSetAvatarId(data);
        Notifications_Dispatcher.dispatch("MsgUserSetAvatarId", { msg: data });
    }
}

export function reqSetMapEditorAutoSaveTime(time: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void {
    Networks_Manager.send({
        MsgUserSetMapEditorAutoSaveTime : {
            c : {
                time,
            }, 
        },
    });
}
function _onMsgUserSetMapEditorAutoSaveTime(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetMapEditorAutoSaveTime"]>): void {
    const data = e.data as UserSetMapEditorAutoSaveTimeResponse;
    if (data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserSetMapEditorAutoSaveTimeFailed", { msg: data });
    } else {
        Users_Model.updateOnMsgUserSetMapEditorAutoSaveTime(data);
        Notifications_Dispatcher.dispatch("MsgUserSetMapEditorAutoSaveTime", { msg: data });
    }
}

export function reqUserSetCoBgmSettings(coCategoryId: number, bgmCodeArray: number[] | null): void {
    Networks_Manager.send({
        MsgUserSetCoBgmSettings : {
            c : {
                coCategoryId : coCategoryId,
                bgmCodeArray : bgmCodeArray ?? [],
            }, 
        },
    });
}
function _onMsgUserSetCoBgmSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetCoBgmSettings"]>): void {
    const data = e.data as UserSetCoBgmSettingsResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserSetCoBgmSettings(data);
        Notifications_Dispatcher.dispatch("MsgUserSetCoBgmSettings", { msg: data });
    }
}

export function reqUserSetSceneBgmSettings(settings: SceneBgmSettingsJson): void {
    Networks_Manager.send({
        MsgUserSetSceneBgmSettings : {
            c : {
                sceneBgmSettings : settings,
            }, 
        },
    });
}
function _onMsgUserSetSceneBgmSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetSceneBgmSettings"]>): void {
    const data = e.data as UserSetSceneBgmSettingsResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserSetSceneBgmSettings(data);
        Notifications_Dispatcher.dispatch("MsgUserSetSceneBgmSettings", { msg: data });
    }
}

export function reqUserSetShowMedalIdArray(showMedalIdArray: number[]): void {
    Networks_Manager.send({
        MsgUserSetShowMedalIdArray : {
            c : {
                showMedalIdArray : showMedalIdArray,
            }, 
        },
    });
}
function _onMsgUserSetShowMedalIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserSetShowMedalIdArray"]>): void {
    const data = e.data as UserSetShowMedalIdArrayResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserSetShowMedalIdArray(data);
        Notifications_Dispatcher.dispatch("MsgUserSetShowMedalIdArray", { msg: data });
    }
}

export function reqUserRequestEmailVerificationCode(address: string): void {
    Networks_Manager.send({
        MsgUserRequestEmailVerificationCode : {
            c : {
                emailAddress : address,
            }, 
        },
    });
}
function _onMsgUserRequestEmailVerificationCode(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserRequestEmailVerificationCode"]>): void {
    const data = e.data as UserRequestEmailVerificationCodeResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserRequestEmailVerificationCode(data);
        Notifications_Dispatcher.dispatch("MsgUserRequestEmailVerificationCode", { msg: data });
    } else {
        Notifications_Dispatcher.dispatch("MsgUserRequestEmailVerificationCodeFailed", { msg: data });
    }
}

export function reqUserVerifyEmail(code: string): void {
    Networks_Manager.send({
        MsgUserVerifyEmail : {
            c : {
                verificationCode : code,
            }, 
        },
    });
}
function _onMsgUserVerifyEmail(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserVerifyEmail"]>): void {
    const data = e.data as UserVerifyEmailResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgUserVerifyEmail(data);
        Notifications_Dispatcher.dispatch("MsgUserVerifyEmail", { msg: data });
    }
}

export function reqUserRequestPasswordVerificationCode(account: string): void {
    Networks_Manager.send({
        MsgUserRequestPasswordVerificationCode : {
            c : {
                account : account,
            }, 
        },
    });
}
function _onMsgUserRequestPasswordVerificationCode(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserRequestPasswordVerificationCode"]>): void {
    const data = e.data as UserRequestPasswordVerificationCodeResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserRequestPasswordVerificationCode", { msg: data });
    } else {
        Notifications_Dispatcher.dispatch("MsgUserRequestPasswordVerificationCodeFailed", { msg: data });
    }
}

export function reqUserResetPasswordWithEmail(code: string, account: string, newRawPassword: string): void {
    Networks_Manager.send({
        MsgUserResetPasswordWithEmail : {
            c : {
                verificationCode : code,
                account          : account,
                newPassword      : Helpers_Sha1Generator.b64_sha1(newRawPassword),
            }, 
        },
    });
}
function _onMsgUserResetPasswordWithEmail(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgUserResetPasswordWithEmail"]>): void {
    const data = e.data as UserResetPasswordWithEmailResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgUserResetPasswordWithEmail", { msg: data });
    }
}
