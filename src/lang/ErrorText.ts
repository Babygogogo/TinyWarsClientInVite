import {
    Utils_ClientErrorCode,
    Utils_ServerErrorCode,
} from "../internal.ts";

export const ErrorText: { [errorCode: number]: string[] } = {
    [Utils_ServerErrorCode.ServerErrorCode.NoError] : [
        "",
        "",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.IllegalRequest0000] : [
        "非法请求",
        "Illegal request.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.BwWarRuleHelper_GetErrorCodeForRuleForPlayers_0031] : [
        `合作模式中，真人玩家数量不能小于2`,
        `In co-op mode, the number of human players cannot be less than 2.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.Common_RequestTooFrequent_0000] : [
        `请求过于频繁，请稍后重试`,
        `Too many requests, please retry later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeCcrJoinRoom_DoExecute_0000] : [
        `房间不存在`,
        `The room doesn't exist.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgUserLogin0001] : [
        "账号不合法，请检查后重试",
        "Invalid account.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgUserLogin0002] : [
        "您已处于登陆状态，不可再次登陆",
        "You have logged in already.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgUserLogin0003] : [
        "密码不合法，请检查后重试",
        "Invalid password.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserLogin_DoExecute_0005] : [
        "账号或密码不正确，请检查后重试",
        "Incorrect account and/or password.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserLogin_0000] : [
        "账号或密码不正确，请检查后重试",
        "Incorrect account and/or password.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserLogin_0001] : [
        "此账号已被禁止登陆",
        "The account is forbidden.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserRequestEmailVerificationCode_0000] : [
        `您的请求过于频繁，请稍后重试。`,
        `Your query requests are too frequent. Please retry later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserRequestEmailVerificationCode_0001] : [
        `邮件发送失败，请检查地址并稍后重试。`,
        `Email delivery failed, please check the address and try again later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserVerifyEmail_0003] : [
        `该邮箱已被其他玩家使用，请更换。`,
        `This email is already used by another player. Please change your email.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserRequestPasswordVerificationCode_0000] : [
        `该账户尚未绑定邮箱。`,
        `The account is not yet tied to an email address.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserRequestPasswordVerificationCode_0001] : [
        `您的请求过于频繁，请稍后重试。`,
        `Your query requests are too frequent. Please retry later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainUser_ExeUserRequestPasswordVerificationCode_0002] : [
        `邮件发送失败，请稍后重试。`,
        `Email delivery failed, please try again later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.GrainCampaign_ExeCmSetCampaignMapEnabled_0003] : [
        `地图数据非法，无法发布`,
        `The map is invalid and can not be published.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeCmSetCampaignMapRawData_Execute_0003] : [
        `地图数据不合法`,
        `The map is invalid.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0000] : [
        "账号不符合要求，请检查后重试",
        "Invalid account.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0001] : [
        "该账号已被注册，请修改后再试",
        "The account has been registered.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0002] : [
        "密码不符合要求，请检查后重试",
        "Invalid password.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0003] : [
        "昵称不符合要求，请检查后重试",
        "Invalid nickname.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0004] : [
        "该账号已被注册，请修改后再试",
        "The account has been registered.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0005] : [
        "您已处于登陆状态，不可注册账号",
        "You have logged in already.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0006] : [
        "该账号已被注册，请修改后再试",
        "The account has been registered.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0007] : [
        "该昵称已被使用，请修改后再试",
        "The nickname has been used.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0008] : [
        "请不要频繁注册账号",
        "Please do not register your account too often.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRegister_ExeWithSocket_0009] : [
        "注册失败，请重试",
        "Failed to register. Please retry.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeUserRequestEmailVerificationCode_ExeWithSocket_0001] : [
        `该邮箱已被其他玩家使用，请更换。`,
        `This email is already used by another player. Please change your email.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgUserSetNickname0000] : [
        "昵称不符合要求，请检查后重试",
        "Invalid nickname.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgUserSetNickname0001] : [
        "该昵称已被使用，请修改后再试",
        "The nickname has been used.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrCreateRoom_DoExecute_0007] : [
        "您已加入了许多未开战的房间，请退出部分后重试",
        "You have joined too many rooms.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrCreateRoom_DoExecute_0008] : [
        "您已创建了许多未开始的房间，请退出部分后重试",
        "You have created too many rooms simultaneously.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrExitRoom_DoExecute_0001] : [
        "房间不存在",
        "The room doesn't exist.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrExitRoom_DoExecute_0003] : [
        "您并未参加该战局",
        "You haven't joined the game.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrJoinRoom_DoExecute_0003] : [
        "您已参与了许多未开始的战局，请退出部分后重试",
        "You have joined too many wars.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrJoinRoom_DoExecute_0005] : [
        "房间不存在",
        "The room doesn't exist.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrJoinRoom_DoExecute_0011] : [
        "您已加入了该房间。",
        "You have already joined the room.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoom_McrStartJoinRoom_0003] : [
        `房间已满员。`,
        `The room is full.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrStartWar_DoExecute_0006] : [
        `房间未满员`,
        `There not enough players in the room.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMcrStartWar_DoExecute_0007] : [
        `还有玩家未准备就绪`,
        `Some players are not ready yet.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorChatMessageManager_AddToPrivate_0002] : [
        `您已被对方屏蔽，无法发送消息`,
        `You are blocked by the player.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorChatMessageManager_AddToPrivate_0003] : [
        `新账号需等待一段时间后才能在私聊频道发送消息，如有不便敬请谅解。`,
        `New accounts will have to wait for a while before messages can be sent in the private channel.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorChatMessageManager_AddToPrivate_0004] : [
        `您尚未完成电子邮件验证。`,
        `You have not completed email verification.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorChatMessageManager_AddToPrivate_0005] : [
        `对方拒绝接受未关注玩家的私聊信息。`,
        `The player doesn't accept PMs from not following players.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorChatMessageManager_AddToPublicChannel_0002] : [
        `新账号需等待一段时间后才能在公共频道发送消息，如有不便敬请谅解。`,
        `New accounts will have to wait for a while before messages can be sent in the public channel.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorChatMessageManager_AddToPublicChannel_0003] : [
        `您尚未完成电子邮件验证。`,
        `You have not completed email verification.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeChatAddMessage_ExeWithSocket_0006] : [
        `您说话太频繁了，请稍后再试`,
        `Please wait a moment before sending another message.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgMapGetRawData0001] : [
        "地图不存在，获取raw data失败。",
        "The map doesn't exist thus fail to get its raw data.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgUserGetPublicInfo0001] : [
        "用户不存在，获取user public info失败。",
        "The user doesn't exist thus fail to get its public info.",
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwCommonContinueWar_ExeWithSocket_0001] : [
        `战局不存在`,
        `The game doesn't exist.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwCommonContinueWar_ExeWithSocket_0002] : [
        `您未参与该战局`,
        `You have not joined the game.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeCcrCreateRoom_DoExecute_0019] : [
        `AI玩家的颜色设置不合法`,
        `The colors of the A.I. players are invalid.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeCcrCreateRoom_DoExecute_0020] : [
        `AI玩家的颜色与您自己的势力颜色冲突`,
        `The colors of you and the A.I. players are invalid.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0001] : [
        `战局不存在`,
        `The game doesn't exist.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0002] : [
        `战局数据不同步，请刷新`,
        `The local data is out of synchronization. Please refresh.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0005] : [
        `当前无法结束您的回合`,
        `Unable to end turn.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwActionPlayerEndTurn_DoExecute_0008] : [
        `您尚未完成关于和局的投票`,
        `You haven't voted for the draw of game.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgMpwWatchMakeRequest_ExeWithSocket_0004] : [
        `已请求观战该玩家`,
        `You have already requested to watch the player.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgMpwWatchMakeRequest_ExeWithSocket_0005] : [
        `观战请求已被接受`,
        `The request has already been accepted.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgMpwWatchHandleRequest_ExeWithSocket_0006] : [
        `该观战请求不存在或已经失效`,
        `The request doesn't exist or has expired.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMfrCreateRoom_DoExecute_0016] : [
        `真人玩家的颜色不能与A.I.的相同。`,
        `The color of human players can not be the same as that of A.I..`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMfrCreateRoom_DoExecute_0019] : [
        `至少需要2名真人玩家。`,
        `There must be at least 2 human players.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMfrStartWar_DoExecute_0005] : [
        `玩家数量不足，请等待更多玩家进入房间。`,
        `There not enough players in the room. Please wait until more players join.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwGetHalfwayReplayData_ExeWithSocket_0001] : [
        `战局已结束，无法即时回放`,
        `Failed to replay this war because the war is over.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwGetHalfwayReplayData_ExeWithSocket_0002] : [
        `您无权观看此战局的即时回放，请先申请观战`,
        `You don't have the permission to view the in-game replay of this war.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeMpwGetHalfwayReplayData_ExeWithSocket_0003] : [
        `此战局未有回放步骤数据（或数据已丢失），无法即时回放`,
        `Failed to replay this war because there is no data or some of the data has been lost.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeSpmCreateSrw_ExeWithSocket_0020] : [
        `各个玩家使用的势力颜色必须互不相同`,
        `Players can't use the same color.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeSpmGetReplayData_ExeWithSocket_0001] : [
        `回放数据不存在，请尝试刷新游戏。`,
        `The replay data doesn't exist. Try refresh the game.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgSpmSaveScw0005] : [
        `存档文件太大，无法保存`,
        `The save file is too big to be saved.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgSpmSaveSfw0005] : [
        `存档文件太大，无法保存`,
        `The save file is too big to be saved.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.MsgSpmSaveSrw0008] : [
        `存档文件太大，无法保存`,
        `The save file is too big to be saved.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoom_McrStartCreateWar_0005] : [
        `玩家数量不足，请等待更多玩家进入房间。`,
        `There not enough players in the room. Please wait until more players join.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoom_McrStartCreateWar_0006] : [
        `尚有玩家未准备就绪`,
        `Some players are not ready.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoom_McrStartExitRoom_0004] : [
        `您是房间里的最后一位玩家，不能直接退出房间`,
        `You are the last player in the room. You can't exit the room directly.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoom_McrStartJoinRoom_0002] : [
        `房主已禁止您再次进入该房间`,
        `You are disallowed to re-entry the room by the room owner.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoom_McrStartJoinRoom_0006] : [
        `房主已禁止您进入该房间`,
        `You are disallowed to enter the room by the room owner.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoomCreator_McrStartCheckAndCreateRoom_0000] : [
        `您已加入了许多未开战的房间，请退出部分房间后重试`,
        `You have joined too many rooms, please exit some of them.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoomManager_McrStartSendJoinedRoomIdArray_0000] : [
        `您的请求过于频繁，请稍后重试`,
        `Your query requests are too frequent. Please retry later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMcrRoomManager_McrStartSendJoinableRoomIdArray_0000] : [
        `您的请求过于频繁，请稍后重试`,
        `Your query requests are too frequent. Please retry later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorCcrRoom_CcrStartJoinRoom_0002] : [
        `房主已禁止您再次进入该房间`,
        `You are disallowed to re-entry the room by the room owner.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorCcrRoom_CcrStartJoinRoom_0006] : [
        `房主已禁止您进入该房间`,
        `You are disallowed to enter the room by the room owner.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorCcrRoomCreator_CcrStartCheckAndCreateRoom_0000] : [
        `您已加入了许多未开战的房间，请退出部分房间后重试`,
        `You have joined too many rooms, please exit some of them.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMfrRoom_MfrStartCreateWar_0005] : [
        `势力颜色不合法`,
        `The colors of the forces are invalid.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMfrRoom_MfrStartJoinRoom_0002] : [
        `房主已禁止您再次进入该房间`,
        `You are disallowed to re-entry the room by the room owner.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMfrRoom_MfrStartJoinRoom_0005] : [
        `房主已禁止您进入该房间`,
        `You are disallowed to enter the room by the room owner.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorMfrRoomCreator_MfrStartCheckAndCreateRoom_0000] : [
        `您已加入了许多未开战的房间，请退出部分房间后重试`,
        `You have joined too many rooms, please exit some of them.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ActorReplayManager_ReplayManagerSendFilteredReplayIdArray_0000] : [
        `您的请求过于频繁，请稍后重试`,
        `Your query requests are too frequent. Please retry later.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.UserGuestPrivilege_0000] : [
        `游客无法进行此操作，请注册账号。`,
        `Unavailable to guests. Please register. :)`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ExeAtRegister_Execute_0001] : [
        `您需要至少完成过一局排位赛。`,
        `You can't do this because you have completed no ranked matches in history.`,
    ],
    [Utils_ServerErrorCode.ServerErrorCode.ServerDisconnect0001] : [
        `服务器维护中`,
        `The server is under maintenance.`,
    ],

    [Utils_ClientErrorCode.ClientErrorCode.BwPlayerManager_Init_03] : [
        `势力颜色不合法`,
        `The colors of the forces are invalid.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhTaskObjective_GetErrorCode_01] : [
        `作战目标描述不合法。`,
        `The description of Task Objective is invalid.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_12] : [
        `存在未被引用的事件动作`,
        `There is a redundant event action. Please delete it via the 'Delete Redundancy' button if you don't need it.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_13] : [
        `存在未被引用的事件条件`,
        `There is a redundant event condition. Please delete it via the 'Delete Redundancy' button if you don't need it.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_14] : [
        `存在未被引用的事件条件节点`,
        `There is a redundant event condition node. Please delete it via the 'Delete Redundancy' button if you don't need it.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_15] : [
        `存在不合法的事件动作`,
        `There is an invalid event action.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_00] : [
        `势力数量不合法`,
        `The number of the forces is not valid.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForPlayersCountUnneutral_03] : [
        `势力颜色不合法`,
        `The colors of the forces are invalid.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapNameArray_00] : [
        `未填写地图名称`,
        `The map name is empty.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_04] : [
        `未填写地图描述`,
        `The map description is empty.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_06] : [
        `存在未被任何规则使用的事件`,
        `There is a redundant event that is not used in any rules.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.MeHelpers_GetErrorCodeForMapRawData_08] : [
        `存在未被引用的可重复简易对话`,
        `There is a redundant repeatable simple dialogue.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_00] : [
        `尚未设置预设规则的名称`,
        `The name of the preset rule has not been set.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForTemplateWarRule_02] : [
        `尚未设置预设规则的游戏模式`,
        `The game modes of the preset rule has not been set.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_00] : [
        `势力规则的数量与实际存在的势力数量不相同，请检查预设规则`,
        `The number of force rules is not the same as the number of forces. Please check the preset rules.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_02] : [
        `势力的队伍设置不合法`,
        `The team settings are invalid.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_13] : [
        `不能禁用“无CO”`,
        `You can't ban "No CO".`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_14] : [
        `您禁用了不存在的部队`,
        `You can't ban a non-existing unit.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_26] : [
        `战役模式下，必须给所有势力指定玩家可用CO*或*AI可用CO`,
        `All forces must be assigned COs for human players *OR* A.I in campaign mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrDataForPlayerRule_GetErrorCodeForRuleForPlayers_27] : [
        `战役模式下，必须给所有势力指定不同的势力颜色`,
        `All forces must be assigned different colors in campaign mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_00] : [
        `势力规则的数量与实际存在的势力数量不相同，请检查预设规则`,
        `The number of force rules is not the same as the number of forces. Please check the preset rules.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_02] : [
        `势力的队伍设置不合法`,
        `The team settings are invalid.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_12] : [
        `不能禁用“无CO”`,
        `You can't ban "No CO".`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_13] : [
        `您禁用了不存在的CO`,
        `You can't ban a non-existing CO.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_17] : [
        `战役模式下，必须给所有势力指定玩家可用CO*或*AI可用CO`,
        `All forces must be assigned COs for human players *OR* A.I in campaign mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_20] : [
        `战役模式下，必须给所有势力指定不同的势力颜色`,
        `All forces must be assigned different colors in campaign mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_23] : [
        `挑战模式下，至少要有一个势力由AI控制`,
        `There must be at least 1 A.I. player in the War Room Mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_24] : [
        `挑战模式下，必须有且只有一个队伍的势力由玩家控制`,
        `There must be one team that controlled by human player in the War Room Mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_25] : [
        `合作模式下，至少要有一个势力由AI控制`,
        `There must be at least 1 A.I. player in the Coop Mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_26] : [
        `合作模式下，至少要有两个势力由真人玩家控制`,
        `There must be at least 2 human players in the Coop Mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.PhWrRuleForPlayers_GetErrorCode_28] : [
        `战役模式下，玩家操控的势力必须属于同一个队伍。`,
        `The forces controlled by player must belong to the same team in campaign mode.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_02] : [
        `预设规则数量太多。`,
        `Too many preset rules.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.WarRuleHelpers_GetErrorCodeForWarRuleArray_04] : [
        `存在多个完全相同的规则。`,
        `There are multiple identical rules.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.MeUtility_GetSevereErrorCodeForMapRawData_00] : [
        `地图文件体积太大，无法保存`,
        `This map is too large to be saved.`,
    ],

    [Utils_ClientErrorCode.ClientErrorCode.ExpressionParser_Parser_ParseExpression_00] : [
        `表达式末尾存在不符合预期的字符。`,
        `Unexpected characters at end of expression.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_00] : [
        `缺少右括号。`,
        `Missing close parenthesis.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_01] : [
        `不允许使用嵌套的lambda函数。`,
        `Nested lambda functions are not supported.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_02] : [
        `lambda函数中不允许进行赋值。`,
        `Assignment is not allowed inside lambda functions.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_03] : [
        `不允许把lambda函数赋值给变量。`,
        `Lambda function is not allowed for assignment.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_04] : [
        `缺少右括号。`,
        `Missing close parenthesis.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseMember_05] : [
        `缺少右括号。`,
        `Missing close parenthesis.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_00] : [
        `表达式太长。`,
        `The expression is too long.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_01] : [
        `表达式首尾有多余空格。`,
        `The are redundant leading or trailing white-spaces.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_02] : [
        `表达式语法不正确。`,
        `The expression is invalid.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_03] : [
        `表达式的包含的Token数量过多。`,
        `Too many tokens in the expression.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_04] : [
        `表达式的结果类型不符合预期。`,
        `Unexpected result type of the expression.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpNodeCollection_Constructor_00] : [
        `表达式数组是空的。`,
        `The array of expression is empty.`,
    ],
    [Utils_ClientErrorCode.ClientErrorCode.EpNodeCollection_Constructor_01] : [
        `除了最后一个表达式，其他表达式必须是赋值。`,
        `The expressions except the last one must be assignment.`,
    ],
};
