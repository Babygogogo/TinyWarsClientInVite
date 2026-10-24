import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as HelpersSha1Generator from "../helpers/Sha1Generator.ts";
import * as NetworksManager from "../networks/Manager.ts";
import * as NetworksMessageCodes from "../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS from "../proto/schema/CommonProto/NetMessage/MsgUserGetBriefInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineUserIdArrayS from "../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineUserIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoArrayS from "../proto/schema/CommonProto/NetMessage/MsgUserGetPublicInfoArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetUsersByNicknameS from "../proto/schema/CommonProto/NetMessage/MsgUserGetUsersByNickname/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserLoginS from "../proto/schema/CommonProto/NetMessage/MsgUserLogin/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS from "../proto/schema/CommonProto/NetMessage/MsgUserLoginAsGuest/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS from "../proto/schema/CommonProto/NetMessage/MsgUserLogout/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS from "../proto/schema/CommonProto/NetMessage/MsgUserModifyFavoriteReplayIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserRegisterS from "../proto/schema/CommonProto/NetMessage/MsgUserRegister/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS from "../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserRequestPasswordVerificationCodeS from "../proto/schema/CommonProto/NetMessage/MsgUserRequestPasswordVerificationCode/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserResetPasswordWithEmailS from "../proto/schema/CommonProto/NetMessage/MsgUserResetPasswordWithEmail/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS from "../proto/schema/CommonProto/NetMessage/MsgUserSetAvatarId/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS from "../proto/schema/CommonProto/NetMessage/MsgUserSetCoBgmSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS from "../proto/schema/CommonProto/NetMessage/MsgUserSetDiscordInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS from "../proto/schema/CommonProto/NetMessage/MsgUserSetMapRating/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS from "../proto/schema/CommonProto/NetMessage/MsgUserSetNickname/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetPasswordS from "../proto/schema/CommonProto/NetMessage/MsgUserSetPassword/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS from "../proto/schema/CommonProto/NetMessage/MsgUserSetRelation/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS from "../proto/schema/CommonProto/NetMessage/MsgUserSetSceneBgmSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS from "../proto/schema/CommonProto/NetMessage/MsgUserSetSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS from "../proto/schema/CommonProto/NetMessage/MsgUserSetShowMedalIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS from "../proto/schema/CommonProto/NetMessage/MsgUserVerifyEmail/S.ts";
import type * as ProtoSchemaCommonProtoUserUserDiscordInfo from "../proto/schema/CommonProto/User/UserDiscordInfo.ts";
import type * as ProtoSchemaCommonProtoUserUserSettings from "../proto/schema/CommonProto/User/UserSettings.ts";
import type * as ProtoSchemaCommonProtoUserUserSettingsSceneBgmSettings from "../proto/schema/CommonProto/User/UserSettings/SceneBgmSettings.ts";
import * as UsersModel from "./Model.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserLogin,                            callback: _onMsgUserLogin, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserLoginAsGuest,                     callback: _onMsgUserLoginAsGuest },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserRegister,                         callback: _onMsgUserRegister, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserLogout,                           callback: _onMsgUserLogout, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserGetPublicInfo,                    callback: _onMsgUserGetPublicInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserGetPublicInfoArray,               callback: _onMsgUserGetPublicInfoArray, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserGetBriefInfo,                     callback: _onMsgUserGetBriefInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserGetOnlineState,                   callback: _onMsgUserGetOnlineState },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserGetUsersByNickname,               callback: _onMsgUserGetUsersByNickname },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetNickname,                      callback: _onMsgUserSetNickname, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetDiscordInfo,                   callback: _onMsgUserSetDiscordInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserGetOnlineUserIdArray,             callback: _onMsgUserGetOnlineUserIdArray, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetPassword,                      callback: _onMsgUserSetPassword, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetSettings,                      callback: _onMsgUserSetSettings, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetMapRating,                     callback: _onMsgUserSetMapRating },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetRelation,                      callback: _onMsgUserSetRelation },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserModifyFavoriteReplayIdArray,      callback: _onMsgUserModifyFavoriteReplayIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserRequestEmailVerificationCode,     callback: _onMsgUserRequestEmailVerificationCode },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserRequestPasswordVerificationCode,  callback: _onMsgUserRequestPasswordVerificationCode },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserResetPasswordWithEmail,           callback: _onMsgUserResetPasswordWithEmail },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetAvatarId,                      callback: _onMsgUserSetAvatarId },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetMapEditorAutoSaveTime,         callback: _onMsgUserSetMapEditorAutoSaveTime },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetCoBgmSettings,                 callback: _onMsgUserSetCoBgmSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetSceneBgmSettings,              callback: _onMsgUserSetSceneBgmSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserSetShowMedalIdArray,              callback: _onMsgUserSetShowMedalIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgUserVerifyEmail,                      callback: _onMsgUserVerifyEmail },
    ]);
}

export function reqLogin(account: string, rawPassword: string, isAutoRelogin: boolean): void {
    NetworksManager.send({
        MsgUserLogin: { c: {
            account,
            password    : HelpersSha1Generator.b64_sha1(rawPassword),
            isAutoRelogin,
        } },
    });
}
export function reqRawLogin(account: string, password: string): void {
    NetworksManager.send({
        MsgUserLogin: { c: {
            account,
            password,
            isAutoRelogin   : false,
        } },
    });
}
function _onMsgUserLogin(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserLoginS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserLogin(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserLogin, data);
    }
}

export function reqUserLoginAsGuest(userId: number | null, isAutoRelogin: boolean): void {
    NetworksManager.send({
        MsgUserLoginAsGuest: { c: {
            userId,
            isAutoRelogin,
        } },
    });
}
function _onMsgUserLoginAsGuest(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserLoginAsGuestS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserLoginAsGuest(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserLoginAsGuest, data);
    }
}

export function reqUserRegister(account: string, rawPassword: string, nickname: string): void {
    NetworksManager.send({
        MsgUserRegister: { c: {
            account,
            password: HelpersSha1Generator.b64_sha1(rawPassword),
            nickname,
        } },
    });
}
function _onMsgUserRegister(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserRegisterS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserRegister, data);
    }
}

export function reqLogout(): void {
    NetworksManager.send({
        MsgUserLogout: { c: {
        } },
    });
}
function _onMsgUserLogout(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserLogoutS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserLogout, data);
    }
}

export function reqUserGetPublicInfo(userId: number): void {
    NetworksManager.send({
        MsgUserGetPublicInfo: { c: {
            userId,
        } },
    });
}
function _onMsgUserGetPublicInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoS.S;
    if (data.getErrorCode()) {
        UsersModel.updateOnFailedMsgUserGetPublicInfo(data);
    } else {
        UsersModel.updateOnMsgUserGetPublicInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserGetPublicInfo, data);
    }
}

export function reqUserGetPublicInfoArray(userIdArray: number[]): void {
    NetworksManager.send({
        MsgUserGetPublicInfoArray: { c: {
            userIdArray : userIdArray,
        } },
    });
}
function _onMsgUserGetPublicInfoArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetPublicInfoArrayS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserGetPublicInfoArray, data);
    }
}

export function reqUserGetBriefInfo(userId: number): void {
    NetworksManager.send({
        MsgUserGetBriefInfo: { c: {
            userId,
        } },
    });
}
function _onMsgUserGetBriefInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetBriefInfoS.S;
    if (data.getErrorCode()) {
        UsersModel.updateOnFailedMsgUserGetBriefInfo(data);
    } else {
        UsersModel.updateOnMsgUserGetBriefInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserGetBriefInfo, data);
    }
}

export function reqUserGetOnlineState(userId: number): void {
    NetworksManager.send({
        MsgUserGetOnlineState: { c: {
            userId,
        } },
    });
}
function _onMsgUserGetOnlineState(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS.S;
    if (data.getErrorCode()) {
        UsersModel.updateOnFailedMsgUserGetOnlineState(data);
    } else {
        UsersModel.updateOnMsgUserGetOnlineState(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserGetOnlineState, data);
    }
}

export function reqUserGetUsersByNickname(nickname: string, isFollowing: boolean | null): void {
    NetworksManager.send({
        MsgUserGetUsersByNickname: { c: {
            nickname    : nickname,
            isFollowing : isFollowing,
        } },
    });
}
function _onMsgUserGetUsersByNickname(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetUsersByNicknameS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserGetUsersByNickname, data);
    }
}

export function reqSetNickname(nickname: string): void {
    NetworksManager.send({
        MsgUserSetNickname: { c: {
            nickname,
        }, },
    });
}
async function _onMsgUserSetNickname(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetNicknameS.S;
    if (data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetNicknameFailed, data);
    } else {
        UsersModel.updateOnMsgUserSetNickname(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetNickname, data);
    }
}

export function reqSetDiscordInfo(discordInfo: ProtoSchemaCommonProtoUserUserDiscordInfo.UserDiscordInfoJson): void {
    NetworksManager.send({
        MsgUserSetDiscordInfo: { c: {
            discordInfo : discordInfo,
        }, },
    });
}
async function _onMsgUserSetDiscordInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetDiscordInfoS.S;
    if (data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetDiscordInfoFailed, data);
    } else {
        UsersModel.updateOnMsgUserSetDiscordInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetDiscordInfo, data);
    }
}

export function reqUserGetOnlineUserIdArray(): void {
    NetworksManager.send({
        MsgUserGetOnlineUserIdArray: { c: {} },
    });
}
function _onMsgUserGetOnlineUserIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineUserIdArrayS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserGetOnlineUserIdArray, data);
    }
}

export function reqUserSetPassword(oldRawPassword: string, newRawPassword: string): void {
    NetworksManager.send({ MsgUserSetPassword: { c: {
        oldPassword : HelpersSha1Generator.b64_sha1(oldRawPassword),
        newPassword : HelpersSha1Generator.b64_sha1(newRawPassword),
    } } });
}
function _onMsgUserSetPassword(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetPasswordS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetPassword, data);
    }
}

export function reqUserSetSettings(userSettings: ProtoSchemaCommonProtoUserUserSettings.UserSettingsJson): void {
    NetworksManager.send({ MsgUserSetSettings: { c: {
        userSettings    : userSettings,
    } } });
}
function _onMsgUserSetSettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetSettingsS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserSetSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetSettings, data);
    }
}

export function reqUserSetMapRating(normalMapId: number, rating: number): void {
    NetworksManager.send({ MsgUserSetMapRating: { c: {
        normalMapId : normalMapId,
        rating,
    } } });
}
function _onMsgUserSetMapRating(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetMapRatingS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserSetMapRating(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetMapRating, data);
    }
}

export function reqUserSetRelation(targetUserId: number, isFollow: boolean, isBlock: boolean): void {
    NetworksManager.send({ MsgUserSetRelation: { c: {
        targetUserId    : targetUserId,
        isFollowing     : isFollow,
        isBlocking      : isBlock,
    }}});
}
function _onMsgUserSetRelation(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetRelationS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserSetRelation(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetRelation, data);
    }
}

export function reqUserModifyFavoriteReplayIdArray(addIdArray: number[], deleteIdArray: number[]): void {
    NetworksManager.send({ MsgUserModifyFavoriteReplayIdArray: { c: {
        addIdArray      : addIdArray,
        deleteIdArray   : deleteIdArray,
    }}});
}
function _onMsgUserModifyFavoriteReplayIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserModifyFavoriteReplayIdArrayS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserModifyFavoriteReplayIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserModifyFavoriteReplayIdArray, data);
    }
}

export function reqSetAvatarId(avatarId: number): void {
    NetworksManager.send({
        MsgUserSetAvatarId: { c: {
            avatarId,
        }, },
    });
}
async function _onMsgUserSetAvatarId(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetAvatarIdS.S;
    if (data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetAvatarIdFailed, data);
    } else {
        UsersModel.updateOnMsgUserSetAvatarId(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetAvatarId, data);
    }
}

export function reqSetMapEditorAutoSaveTime(time: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): void {
    NetworksManager.send({
        MsgUserSetMapEditorAutoSaveTime: { c: {
            time,
        }, },
    });
}
function _onMsgUserSetMapEditorAutoSaveTime(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS.S;
    if (data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetMapEditorAutoSaveTimeFailed, data);
    } else {
        UsersModel.updateOnMsgUserSetMapEditorAutoSaveTime(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetMapEditorAutoSaveTime, data);
    }
}

export function reqUserSetCoBgmSettings(coCategoryId: number, bgmCodeArray: number[] | null): void {
    NetworksManager.send({
        MsgUserSetCoBgmSettings: { c: {
            coCategoryId    : coCategoryId,
            bgmCodeArray    : bgmCodeArray ?? [],
        } }
    });
}
function _onMsgUserSetCoBgmSettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetCoBgmSettingsS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserSetCoBgmSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetCoBgmSettings, data);
    }
}

export function reqUserSetSceneBgmSettings(settings: ProtoSchemaCommonProtoUserUserSettingsSceneBgmSettings.SceneBgmSettingsJson): void {
    NetworksManager.send({
        MsgUserSetSceneBgmSettings: { c: {
            sceneBgmSettings    : settings,
        } },
    });
}
function _onMsgUserSetSceneBgmSettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetSceneBgmSettingsS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserSetSceneBgmSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetSceneBgmSettings, data);
    }
}

export function reqUserSetShowMedalIdArray(showMedalIdArray: number[]): void {
    NetworksManager.send({
        MsgUserSetShowMedalIdArray: { c: {
            showMedalIdArray    : showMedalIdArray,
        } },
    });
}
function _onMsgUserSetShowMedalIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetShowMedalIdArrayS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserSetShowMedalIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserSetShowMedalIdArray, data);
    }
}

export function reqUserRequestEmailVerificationCode(address: string): void {
    NetworksManager.send({
        MsgUserRequestEmailVerificationCode: { c: {
            emailAddress    : address,
        } },
    });
}
function _onMsgUserRequestEmailVerificationCode(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserRequestEmailVerificationCode(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserRequestEmailVerificationCode, data);
    } else {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserRequestEmailVerificationCodeFailed, data);
    }
}

export function reqUserVerifyEmail(code: string): void {
    NetworksManager.send({
        MsgUserVerifyEmail: { c: {
            verificationCode    : code,
        } },
    });
}
function _onMsgUserVerifyEmail(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserVerifyEmailS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgUserVerifyEmail(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserVerifyEmail, data);
    }
}

export function reqUserRequestPasswordVerificationCode(account: string): void {
    NetworksManager.send({
        MsgUserRequestPasswordVerificationCode: { c: {
            account : account,
        } },
    });
}
function _onMsgUserRequestPasswordVerificationCode(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserRequestPasswordVerificationCodeS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserRequestPasswordVerificationCode, data);
    } else {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserRequestPasswordVerificationCodeFailed, data);
    }
}

export function reqUserResetPasswordWithEmail(code: string, account: string, newRawPassword: string): void {
    NetworksManager.send({
        MsgUserResetPasswordWithEmail: { c: {
            verificationCode    : code,
            account             : account,
            newPassword         : HelpersSha1Generator.b64_sha1(newRawPassword),
        } },
    });
}
function _onMsgUserResetPasswordWithEmail(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserResetPasswordWithEmailS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgUserResetPasswordWithEmail, data);
    }
}
