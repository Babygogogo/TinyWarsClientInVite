import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MsgAtCreateTourney as $Message$CommonProto$NetMessage$MsgAtCreateTourney, type MsgAtCreateTourneyJson as $Json$CommonProto$NetMessage$MsgAtCreateTourney } from "./MsgAtCreateTourney.js";
import { MsgAtDeleteLastTourney as $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney, type MsgAtDeleteLastTourneyJson as $Json$CommonProto$NetMessage$MsgAtDeleteLastTourney } from "./MsgAtDeleteLastTourney.js";
import { MsgAtDeleteUser as $Message$CommonProto$NetMessage$MsgAtDeleteUser, type MsgAtDeleteUserJson as $Json$CommonProto$NetMessage$MsgAtDeleteUser } from "./MsgAtDeleteUser.js";
import { MsgAtGetFullBracketInfo as $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo, type MsgAtGetFullBracketInfoJson as $Json$CommonProto$NetMessage$MsgAtGetFullBracketInfo } from "./MsgAtGetFullBracketInfo.js";
import { MsgAtGetFullMapInfo as $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo, type MsgAtGetFullMapInfoJson as $Json$CommonProto$NetMessage$MsgAtGetFullMapInfo } from "./MsgAtGetFullMapInfo.js";
import { MsgAtGetGlobalSettings as $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings, type MsgAtGetGlobalSettingsJson as $Json$CommonProto$NetMessage$MsgAtGetGlobalSettings } from "./MsgAtGetGlobalSettings.js";
import { MsgAtGetPhaseInfo as $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo, type MsgAtGetPhaseInfoJson as $Json$CommonProto$NetMessage$MsgAtGetPhaseInfo } from "./MsgAtGetPhaseInfo.js";
import { MsgAtGetRegistrationInfo as $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo, type MsgAtGetRegistrationInfoJson as $Json$CommonProto$NetMessage$MsgAtGetRegistrationInfo } from "./MsgAtGetRegistrationInfo.js";
import { MsgAtGetTourneyInfo as $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo, type MsgAtGetTourneyInfoJson as $Json$CommonProto$NetMessage$MsgAtGetTourneyInfo } from "./MsgAtGetTourneyInfo.js";
import { MsgAtGetUserArray as $Message$CommonProto$NetMessage$MsgAtGetUserArray, type MsgAtGetUserArrayJson as $Json$CommonProto$NetMessage$MsgAtGetUserArray } from "./MsgAtGetUserArray.js";
import { MsgAtRegister as $Message$CommonProto$NetMessage$MsgAtRegister, type MsgAtRegisterJson as $Json$CommonProto$NetMessage$MsgAtRegister } from "./MsgAtRegister.js";
import { MsgAtSetAdjustmentDuration as $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration, type MsgAtSetAdjustmentDurationJson as $Json$CommonProto$NetMessage$MsgAtSetAdjustmentDuration } from "./MsgAtSetAdjustmentDuration.js";
import { MsgAtSetBootTimer as $Message$CommonProto$NetMessage$MsgAtSetBootTimer, type MsgAtSetBootTimerJson as $Json$CommonProto$NetMessage$MsgAtSetBootTimer } from "./MsgAtSetBootTimer.js";
import { MsgAtSetGlobalSettings as $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings, type MsgAtSetGlobalSettingsJson as $Json$CommonProto$NetMessage$MsgAtSetGlobalSettings } from "./MsgAtSetGlobalSettings.js";
import { MsgAtSetInitialBrackets as $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets, type MsgAtSetInitialBracketsJson as $Json$CommonProto$NetMessage$MsgAtSetInitialBrackets } from "./MsgAtSetInitialBrackets.js";
import { MsgAtSetMapPool as $Message$CommonProto$NetMessage$MsgAtSetMapPool, type MsgAtSetMapPoolJson as $Json$CommonProto$NetMessage$MsgAtSetMapPool } from "./MsgAtSetMapPool.js";
import { MsgAtSetName as $Message$CommonProto$NetMessage$MsgAtSetName, type MsgAtSetNameJson as $Json$CommonProto$NetMessage$MsgAtSetName } from "./MsgAtSetName.js";
import { MsgAtSetRegistrationDuration as $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration, type MsgAtSetRegistrationDurationJson as $Json$CommonProto$NetMessage$MsgAtSetRegistrationDuration } from "./MsgAtSetRegistrationDuration.js";
import { MsgAtrDeleteRoomByServer as $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer, type MsgAtrDeleteRoomByServerJson as $Json$CommonProto$NetMessage$MsgAtrDeleteRoomByServer } from "./MsgAtrDeleteRoomByServer.js";
import { MsgAtrGetJoinedRoomIdArray as $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray, type MsgAtrGetJoinedRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray } from "./MsgAtrGetJoinedRoomIdArray.js";
import { MsgAtrGetRoomPublicInfo as $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo, type MsgAtrGetRoomPublicInfoJson as $Json$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo } from "./MsgAtrGetRoomPublicInfo.js";
import { MsgAtrSetBannedCoIdArray as $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray, type MsgAtrSetBannedCoIdArrayJson as $Json$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray } from "./MsgAtrSetBannedCoIdArray.js";
import { MsgAtrSetSelfSettings as $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings, type MsgAtrSetSelfSettingsJson as $Json$CommonProto$NetMessage$MsgAtrSetSelfSettings } from "./MsgAtrSetSelfSettings.js";
import { MsgBroadcastAddMessage as $Message$CommonProto$NetMessage$MsgBroadcastAddMessage, type MsgBroadcastAddMessageJson as $Json$CommonProto$NetMessage$MsgBroadcastAddMessage } from "./MsgBroadcastAddMessage.js";
import { MsgBroadcastDeleteMessage as $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage, type MsgBroadcastDeleteMessageJson as $Json$CommonProto$NetMessage$MsgBroadcastDeleteMessage } from "./MsgBroadcastDeleteMessage.js";
import { MsgBroadcastDoBroadcast as $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast, type MsgBroadcastDoBroadcastJson as $Json$CommonProto$NetMessage$MsgBroadcastDoBroadcast } from "./MsgBroadcastDoBroadcast.js";
import { MsgBroadcastGetAllMessageIdArray as $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray, type MsgBroadcastGetAllMessageIdArrayJson as $Json$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray } from "./MsgBroadcastGetAllMessageIdArray.js";
import { MsgBroadcastGetMessageData as $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData, type MsgBroadcastGetMessageDataJson as $Json$CommonProto$NetMessage$MsgBroadcastGetMessageData } from "./MsgBroadcastGetMessageData.js";
import { MsgCampaignCreateWar as $Message$CommonProto$NetMessage$MsgCampaignCreateWar, type MsgCampaignCreateWarJson as $Json$CommonProto$NetMessage$MsgCampaignCreateWar } from "./MsgCampaignCreateWar.js";
import { MsgCampaignGetAllMapTimestampArray as $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray, type MsgCampaignGetAllMapTimestampArrayJson as $Json$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray } from "./MsgCampaignGetAllMapTimestampArray.js";
import { MsgCampaignGetCampaignInfo as $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo, type MsgCampaignGetCampaignInfoJson as $Json$CommonProto$NetMessage$MsgCampaignGetCampaignInfo } from "./MsgCampaignGetCampaignInfo.js";
import { MsgCampaignGetCampaignLeaderboard as $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard, type MsgCampaignGetCampaignLeaderboardJson as $Json$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard } from "./MsgCampaignGetCampaignLeaderboard.js";
import { MsgCampaignGetCampaignMapLeaderboard as $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard, type MsgCampaignGetCampaignMapLeaderboardJson as $Json$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard } from "./MsgCampaignGetCampaignMapLeaderboard.js";
import { MsgCampaignGetEnabledCampaignIdArray as $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray, type MsgCampaignGetEnabledCampaignIdArrayJson as $Json$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray } from "./MsgCampaignGetEnabledCampaignIdArray.js";
import { MsgCampaignGetMapRawData as $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData, type MsgCampaignGetMapRawDataJson as $Json$CommonProto$NetMessage$MsgCampaignGetMapRawData } from "./MsgCampaignGetMapRawData.js";
import { MsgCampaignGetMapRawDataArray as $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray, type MsgCampaignGetMapRawDataArrayJson as $Json$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray } from "./MsgCampaignGetMapRawDataArray.js";
import { MsgCampaignGetMapTimestamp as $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp, type MsgCampaignGetMapTimestampJson as $Json$CommonProto$NetMessage$MsgCampaignGetMapTimestamp } from "./MsgCampaignGetMapTimestamp.js";
import { MsgCampaignGetScore as $Message$CommonProto$NetMessage$MsgCampaignGetScore, type MsgCampaignGetScoreJson as $Json$CommonProto$NetMessage$MsgCampaignGetScore } from "./MsgCampaignGetScore.js";
import { MsgCampaignSaveWar as $Message$CommonProto$NetMessage$MsgCampaignSaveWar, type MsgCampaignSaveWarJson as $Json$CommonProto$NetMessage$MsgCampaignSaveWar } from "./MsgCampaignSaveWar.js";
import { MsgCampaignValidateWar as $Message$CommonProto$NetMessage$MsgCampaignValidateWar, type MsgCampaignValidateWarJson as $Json$CommonProto$NetMessage$MsgCampaignValidateWar } from "./MsgCampaignValidateWar.js";
import { MsgCcrAddDummy as $Message$CommonProto$NetMessage$MsgCcrAddDummy, type MsgCcrAddDummyJson as $Json$CommonProto$NetMessage$MsgCcrAddDummy } from "./MsgCcrAddDummy.js";
import { MsgCcrCreateRoom as $Message$CommonProto$NetMessage$MsgCcrCreateRoom, type MsgCcrCreateRoomJson as $Json$CommonProto$NetMessage$MsgCcrCreateRoom } from "./MsgCcrCreateRoom.js";
import { MsgCcrDeletePlayer as $Message$CommonProto$NetMessage$MsgCcrDeletePlayer, type MsgCcrDeletePlayerJson as $Json$CommonProto$NetMessage$MsgCcrDeletePlayer } from "./MsgCcrDeletePlayer.js";
import { MsgCcrDeleteRoom as $Message$CommonProto$NetMessage$MsgCcrDeleteRoom, type MsgCcrDeleteRoomJson as $Json$CommonProto$NetMessage$MsgCcrDeleteRoom } from "./MsgCcrDeleteRoom.js";
import { MsgCcrExitRoom as $Message$CommonProto$NetMessage$MsgCcrExitRoom, type MsgCcrExitRoomJson as $Json$CommonProto$NetMessage$MsgCcrExitRoom } from "./MsgCcrExitRoom.js";
import { MsgCcrGetJoinableRoomIdArray as $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray, type MsgCcrGetJoinableRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray } from "./MsgCcrGetJoinableRoomIdArray.js";
import { MsgCcrGetJoinedRoomIdArray as $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray, type MsgCcrGetJoinedRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray } from "./MsgCcrGetJoinedRoomIdArray.js";
import { MsgCcrGetRoomPlayerInfo as $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo, type MsgCcrGetRoomPlayerInfoJson as $Json$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo } from "./MsgCcrGetRoomPlayerInfo.js";
import { MsgCcrGetRoomStaticInfo as $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo, type MsgCcrGetRoomStaticInfoJson as $Json$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo } from "./MsgCcrGetRoomStaticInfo.js";
import { MsgCcrInvite as $Message$CommonProto$NetMessage$MsgCcrInvite, type MsgCcrInviteJson as $Json$CommonProto$NetMessage$MsgCcrInvite } from "./MsgCcrInvite.js";
import { MsgCcrJoinRoom as $Message$CommonProto$NetMessage$MsgCcrJoinRoom, type MsgCcrJoinRoomJson as $Json$CommonProto$NetMessage$MsgCcrJoinRoom } from "./MsgCcrJoinRoom.js";
import { MsgCcrSetDummySettings as $Message$CommonProto$NetMessage$MsgCcrSetDummySettings, type MsgCcrSetDummySettingsJson as $Json$CommonProto$NetMessage$MsgCcrSetDummySettings } from "./MsgCcrSetDummySettings.js";
import { MsgCcrSetReady as $Message$CommonProto$NetMessage$MsgCcrSetReady, type MsgCcrSetReadyJson as $Json$CommonProto$NetMessage$MsgCcrSetReady } from "./MsgCcrSetReady.js";
import { MsgCcrSetSelfSettings as $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings, type MsgCcrSetSelfSettingsJson as $Json$CommonProto$NetMessage$MsgCcrSetSelfSettings } from "./MsgCcrSetSelfSettings.js";
import { MsgCcrStartWar as $Message$CommonProto$NetMessage$MsgCcrStartWar, type MsgCcrStartWarJson as $Json$CommonProto$NetMessage$MsgCcrStartWar } from "./MsgCcrStartWar.js";
import { MsgChangeLogAddMessage as $Message$CommonProto$NetMessage$MsgChangeLogAddMessage, type MsgChangeLogAddMessageJson as $Json$CommonProto$NetMessage$MsgChangeLogAddMessage } from "./MsgChangeLogAddMessage.js";
import { MsgChangeLogGetMessageList as $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList, type MsgChangeLogGetMessageListJson as $Json$CommonProto$NetMessage$MsgChangeLogGetMessageList } from "./MsgChangeLogGetMessageList.js";
import { MsgChangeLogModifyMessage as $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage, type MsgChangeLogModifyMessageJson as $Json$CommonProto$NetMessage$MsgChangeLogModifyMessage } from "./MsgChangeLogModifyMessage.js";
import { MsgChatAddMessage as $Message$CommonProto$NetMessage$MsgChatAddMessage, type MsgChatAddMessageJson as $Json$CommonProto$NetMessage$MsgChatAddMessage } from "./MsgChatAddMessage.js";
import { MsgChatDeleteMessage as $Message$CommonProto$NetMessage$MsgChatDeleteMessage, type MsgChatDeleteMessageJson as $Json$CommonProto$NetMessage$MsgChatDeleteMessage } from "./MsgChatDeleteMessage.js";
import { MsgChatGetAllMessages as $Message$CommonProto$NetMessage$MsgChatGetAllMessages, type MsgChatGetAllMessagesJson as $Json$CommonProto$NetMessage$MsgChatGetAllMessages } from "./MsgChatGetAllMessages.js";
import { MsgChatGetAllReadProgressList as $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList, type MsgChatGetAllReadProgressListJson as $Json$CommonProto$NetMessage$MsgChatGetAllReadProgressList } from "./MsgChatGetAllReadProgressList.js";
import { MsgChatUpdateReadProgress as $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress, type MsgChatUpdateReadProgressJson as $Json$CommonProto$NetMessage$MsgChatUpdateReadProgress } from "./MsgChatUpdateReadProgress.js";
import { MsgCmCreateCampaign as $Message$CommonProto$NetMessage$MsgCmCreateCampaign, type MsgCmCreateCampaignJson as $Json$CommonProto$NetMessage$MsgCmCreateCampaign } from "./MsgCmCreateCampaign.js";
import { MsgCmCreateCampaignMap as $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap, type MsgCmCreateCampaignMapJson as $Json$CommonProto$NetMessage$MsgCmCreateCampaignMap } from "./MsgCmCreateCampaignMap.js";
import { MsgCmGetAllCampaignIdArray as $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray, type MsgCmGetAllCampaignIdArrayJson as $Json$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray } from "./MsgCmGetAllCampaignIdArray.js";
import { MsgCmGetDesigningCampaignIdArray as $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray, type MsgCmGetDesigningCampaignIdArrayJson as $Json$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray } from "./MsgCmGetDesigningCampaignIdArray.js";
import { MsgCmSetCampaignDesc as $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc, type MsgCmSetCampaignDescJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignDesc } from "./MsgCmSetCampaignDesc.js";
import { MsgCmSetCampaignEnabled as $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled, type MsgCmSetCampaignEnabledJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignEnabled } from "./MsgCmSetCampaignEnabled.js";
import { MsgCmSetCampaignMapEnabled as $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled, type MsgCmSetCampaignMapEnabledJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled } from "./MsgCmSetCampaignMapEnabled.js";
import { MsgCmSetCampaignMapExtraText as $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText, type MsgCmSetCampaignMapExtraTextJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText } from "./MsgCmSetCampaignMapExtraText.js";
import { MsgCmSetCampaignMapName as $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName, type MsgCmSetCampaignMapNameJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignMapName } from "./MsgCmSetCampaignMapName.js";
import { MsgCmSetCampaignMapRawData as $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData, type MsgCmSetCampaignMapRawDataJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignMapRawData } from "./MsgCmSetCampaignMapRawData.js";
import { MsgCmSetCampaignMapWarEventAction as $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction, type MsgCmSetCampaignMapWarEventActionJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction } from "./MsgCmSetCampaignMapWarEventAction.js";
import { MsgCmSetCampaignName as $Message$CommonProto$NetMessage$MsgCmSetCampaignName, type MsgCmSetCampaignNameJson as $Json$CommonProto$NetMessage$MsgCmSetCampaignName } from "./MsgCmSetCampaignName.js";
import { MsgCmSetExtraLink as $Message$CommonProto$NetMessage$MsgCmSetExtraLink, type MsgCmSetExtraLinkJson as $Json$CommonProto$NetMessage$MsgCmSetExtraLink } from "./MsgCmSetExtraLink.js";
import { MsgCmUpdateCampaignDesigners as $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners, type MsgCmUpdateCampaignDesignersJson as $Json$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners } from "./MsgCmUpdateCampaignDesigners.js";
import { MsgCommonError as $Message$CommonProto$NetMessage$MsgCommonError, type MsgCommonErrorJson as $Json$CommonProto$NetMessage$MsgCommonError } from "./MsgCommonError.js";
import { MsgCommonGetCoStatistics as $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics, type MsgCommonGetCoStatisticsJson as $Json$CommonProto$NetMessage$MsgCommonGetCoStatistics } from "./MsgCommonGetCoStatistics.js";
import { MsgCommonGetRankList as $Message$CommonProto$NetMessage$MsgCommonGetRankList, type MsgCommonGetRankListJson as $Json$CommonProto$NetMessage$MsgCommonGetRankList } from "./MsgCommonGetRankList.js";
import { MsgCommonGetServerStatus as $Message$CommonProto$NetMessage$MsgCommonGetServerStatus, type MsgCommonGetServerStatusJson as $Json$CommonProto$NetMessage$MsgCommonGetServerStatus } from "./MsgCommonGetServerStatus.js";
import { MsgCommonHeartbeat as $Message$CommonProto$NetMessage$MsgCommonHeartbeat, type MsgCommonHeartbeatJson as $Json$CommonProto$NetMessage$MsgCommonHeartbeat } from "./MsgCommonHeartbeat.js";
import { MsgCommonLatestConfigVersion as $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion, type MsgCommonLatestConfigVersionJson as $Json$CommonProto$NetMessage$MsgCommonLatestConfigVersion } from "./MsgCommonLatestConfigVersion.js";
import { MsgCommonServerDisconnect as $Message$CommonProto$NetMessage$MsgCommonServerDisconnect, type MsgCommonServerDisconnectJson as $Json$CommonProto$NetMessage$MsgCommonServerDisconnect } from "./MsgCommonServerDisconnect.js";
import { MsgGmAddUserMedal as $Message$CommonProto$NetMessage$MsgGmAddUserMedal, type MsgGmAddUserMedalJson as $Json$CommonProto$NetMessage$MsgGmAddUserMedal } from "./MsgGmAddUserMedal.js";
import { MsgGmDeleteCcrRoom as $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom, type MsgGmDeleteCcrRoomJson as $Json$CommonProto$NetMessage$MsgGmDeleteCcrRoom } from "./MsgGmDeleteCcrRoom.js";
import { MsgGmDeleteMcrRoom as $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom, type MsgGmDeleteMcrRoomJson as $Json$CommonProto$NetMessage$MsgGmDeleteMcrRoom } from "./MsgGmDeleteMcrRoom.js";
import { MsgGmDeleteMfrRoom as $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom, type MsgGmDeleteMfrRoomJson as $Json$CommonProto$NetMessage$MsgGmDeleteMfrRoom } from "./MsgGmDeleteMfrRoom.js";
import { MsgGmDeleteMmrRoom as $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom, type MsgGmDeleteMmrRoomJson as $Json$CommonProto$NetMessage$MsgGmDeleteMmrRoom } from "./MsgGmDeleteMmrRoom.js";
import { MsgGmDeleteMrrRoom as $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom, type MsgGmDeleteMrrRoomJson as $Json$CommonProto$NetMessage$MsgGmDeleteMrrRoom } from "./MsgGmDeleteMrrRoom.js";
import { MsgGmDeleteSpmAllScoreAndReplay as $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay, type MsgGmDeleteSpmAllScoreAndReplayJson as $Json$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay } from "./MsgGmDeleteSpmAllScoreAndReplay.js";
import { MsgGmGenerateReplayStatistics as $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics, type MsgGmGenerateReplayStatisticsJson as $Json$CommonProto$NetMessage$MsgGmGenerateReplayStatistics } from "./MsgGmGenerateReplayStatistics.js";
import { MsgGmSetUserPassword as $Message$CommonProto$NetMessage$MsgGmSetUserPassword, type MsgGmSetUserPasswordJson as $Json$CommonProto$NetMessage$MsgGmSetUserPassword } from "./MsgGmSetUserPassword.js";
import { MsgGmSetUserPrivilege as $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege, type MsgGmSetUserPrivilegeJson as $Json$CommonProto$NetMessage$MsgGmSetUserPrivilege } from "./MsgGmSetUserPrivilege.js";
import { MsgGmUpdateReplayInfo as $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo, type MsgGmUpdateReplayInfoJson as $Json$CommonProto$NetMessage$MsgGmUpdateReplayInfo } from "./MsgGmUpdateReplayInfo.js";
import { MsgLbMrwGetRankIndex as $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex, type MsgLbMrwGetRankIndexJson as $Json$CommonProto$NetMessage$MsgLbMrwGetRankIndex } from "./MsgLbMrwGetRankIndex.js";
import { MsgLbSpmOverallGetRankInfo as $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo, type MsgLbSpmOverallGetRankInfoJson as $Json$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo } from "./MsgLbSpmOverallGetRankInfo.js";
import { MsgLbSpmOverallGetTopDataArray as $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray, type MsgLbSpmOverallGetTopDataArrayJson as $Json$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray } from "./MsgLbSpmOverallGetTopDataArray.js";
import { MsgMailDeleteMail as $Message$CommonProto$NetMessage$MsgMailDeleteMail, type MsgMailDeleteMailJson as $Json$CommonProto$NetMessage$MsgMailDeleteMail } from "./MsgMailDeleteMail.js";
import { MsgMailGetAllMailArray as $Message$CommonProto$NetMessage$MsgMailGetAllMailArray, type MsgMailGetAllMailArrayJson as $Json$CommonProto$NetMessage$MsgMailGetAllMailArray } from "./MsgMailGetAllMailArray.js";
import { MsgMailGetMail as $Message$CommonProto$NetMessage$MsgMailGetMail, type MsgMailGetMailJson as $Json$CommonProto$NetMessage$MsgMailGetMail } from "./MsgMailGetMail.js";
import { MsgMailSetIsNew as $Message$CommonProto$NetMessage$MsgMailSetIsNew, type MsgMailSetIsNewJson as $Json$CommonProto$NetMessage$MsgMailSetIsNew } from "./MsgMailSetIsNew.js";
import { MsgMapGetMapTag as $Message$CommonProto$NetMessage$MsgMapGetMapTag, type MsgMapGetMapTagJson as $Json$CommonProto$NetMessage$MsgMapGetMapTag } from "./MsgMapGetMapTag.js";
import { MsgMapGetRawData as $Message$CommonProto$NetMessage$MsgMapGetRawData, type MsgMapGetRawDataJson as $Json$CommonProto$NetMessage$MsgMapGetRawData } from "./MsgMapGetRawData.js";
import { MsgMcrAddDummy as $Message$CommonProto$NetMessage$MsgMcrAddDummy, type MsgMcrAddDummyJson as $Json$CommonProto$NetMessage$MsgMcrAddDummy } from "./MsgMcrAddDummy.js";
import { MsgMcrCreateRoom as $Message$CommonProto$NetMessage$MsgMcrCreateRoom, type MsgMcrCreateRoomJson as $Json$CommonProto$NetMessage$MsgMcrCreateRoom } from "./MsgMcrCreateRoom.js";
import { MsgMcrDeletePlayer as $Message$CommonProto$NetMessage$MsgMcrDeletePlayer, type MsgMcrDeletePlayerJson as $Json$CommonProto$NetMessage$MsgMcrDeletePlayer } from "./MsgMcrDeletePlayer.js";
import { MsgMcrDeleteRoom as $Message$CommonProto$NetMessage$MsgMcrDeleteRoom, type MsgMcrDeleteRoomJson as $Json$CommonProto$NetMessage$MsgMcrDeleteRoom } from "./MsgMcrDeleteRoom.js";
import { MsgMcrExitRoom as $Message$CommonProto$NetMessage$MsgMcrExitRoom, type MsgMcrExitRoomJson as $Json$CommonProto$NetMessage$MsgMcrExitRoom } from "./MsgMcrExitRoom.js";
import { MsgMcrGetJoinableRoomIdArray as $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray, type MsgMcrGetJoinableRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray } from "./MsgMcrGetJoinableRoomIdArray.js";
import { MsgMcrGetJoinedRoomIdArray as $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray, type MsgMcrGetJoinedRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray } from "./MsgMcrGetJoinedRoomIdArray.js";
import { MsgMcrGetRoomPlayerInfo as $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo, type MsgMcrGetRoomPlayerInfoJson as $Json$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo } from "./MsgMcrGetRoomPlayerInfo.js";
import { MsgMcrGetRoomStaticInfo as $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo, type MsgMcrGetRoomStaticInfoJson as $Json$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo } from "./MsgMcrGetRoomStaticInfo.js";
import { MsgMcrInvite as $Message$CommonProto$NetMessage$MsgMcrInvite, type MsgMcrInviteJson as $Json$CommonProto$NetMessage$MsgMcrInvite } from "./MsgMcrInvite.js";
import { MsgMcrJoinRoom as $Message$CommonProto$NetMessage$MsgMcrJoinRoom, type MsgMcrJoinRoomJson as $Json$CommonProto$NetMessage$MsgMcrJoinRoom } from "./MsgMcrJoinRoom.js";
import { MsgMcrSetDummySettings as $Message$CommonProto$NetMessage$MsgMcrSetDummySettings, type MsgMcrSetDummySettingsJson as $Json$CommonProto$NetMessage$MsgMcrSetDummySettings } from "./MsgMcrSetDummySettings.js";
import { MsgMcrSetReady as $Message$CommonProto$NetMessage$MsgMcrSetReady, type MsgMcrSetReadyJson as $Json$CommonProto$NetMessage$MsgMcrSetReady } from "./MsgMcrSetReady.js";
import { MsgMcrSetSelfSettings as $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings, type MsgMcrSetSelfSettingsJson as $Json$CommonProto$NetMessage$MsgMcrSetSelfSettings } from "./MsgMcrSetSelfSettings.js";
import { MsgMcrStartWar as $Message$CommonProto$NetMessage$MsgMcrStartWar, type MsgMcrStartWarJson as $Json$CommonProto$NetMessage$MsgMcrStartWar } from "./MsgMcrStartWar.js";
import { MsgMeDeleteSlot as $Message$CommonProto$NetMessage$MsgMeDeleteSlot, type MsgMeDeleteSlotJson as $Json$CommonProto$NetMessage$MsgMeDeleteSlot } from "./MsgMeDeleteSlot.js";
import { MsgMeGetAllMapDataTimestamps as $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps, type MsgMeGetAllMapDataTimestampsJson as $Json$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps } from "./MsgMeGetAllMapDataTimestamps.js";
import { MsgMeGetMapData as $Message$CommonProto$NetMessage$MsgMeGetMapData, type MsgMeGetMapDataJson as $Json$CommonProto$NetMessage$MsgMeGetMapData } from "./MsgMeGetMapData.js";
import { MsgMeGetMapDataArray as $Message$CommonProto$NetMessage$MsgMeGetMapDataArray, type MsgMeGetMapDataArrayJson as $Json$CommonProto$NetMessage$MsgMeGetMapDataArray } from "./MsgMeGetMapDataArray.js";
import { MsgMeGetMapDataTimestamp as $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp, type MsgMeGetMapDataTimestampJson as $Json$CommonProto$NetMessage$MsgMeGetMapDataTimestamp } from "./MsgMeGetMapDataTimestamp.js";
import { MsgMeSubmitNormalMap as $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap, type MsgMeSubmitNormalMapJson as $Json$CommonProto$NetMessage$MsgMeSubmitNormalMap } from "./MsgMeSubmitNormalMap.js";
import { MsgMfrAddDummy as $Message$CommonProto$NetMessage$MsgMfrAddDummy, type MsgMfrAddDummyJson as $Json$CommonProto$NetMessage$MsgMfrAddDummy } from "./MsgMfrAddDummy.js";
import { MsgMfrCreateRoom as $Message$CommonProto$NetMessage$MsgMfrCreateRoom, type MsgMfrCreateRoomJson as $Json$CommonProto$NetMessage$MsgMfrCreateRoom } from "./MsgMfrCreateRoom.js";
import { MsgMfrDeletePlayer as $Message$CommonProto$NetMessage$MsgMfrDeletePlayer, type MsgMfrDeletePlayerJson as $Json$CommonProto$NetMessage$MsgMfrDeletePlayer } from "./MsgMfrDeletePlayer.js";
import { MsgMfrDeleteRoom as $Message$CommonProto$NetMessage$MsgMfrDeleteRoom, type MsgMfrDeleteRoomJson as $Json$CommonProto$NetMessage$MsgMfrDeleteRoom } from "./MsgMfrDeleteRoom.js";
import { MsgMfrExitRoom as $Message$CommonProto$NetMessage$MsgMfrExitRoom, type MsgMfrExitRoomJson as $Json$CommonProto$NetMessage$MsgMfrExitRoom } from "./MsgMfrExitRoom.js";
import { MsgMfrGetJoinableRoomIdArray as $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray, type MsgMfrGetJoinableRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray } from "./MsgMfrGetJoinableRoomIdArray.js";
import { MsgMfrGetJoinedRoomIdArray as $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray, type MsgMfrGetJoinedRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray } from "./MsgMfrGetJoinedRoomIdArray.js";
import { MsgMfrGetRoomPlayerInfo as $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo, type MsgMfrGetRoomPlayerInfoJson as $Json$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo } from "./MsgMfrGetRoomPlayerInfo.js";
import { MsgMfrGetRoomStaticInfo as $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo, type MsgMfrGetRoomStaticInfoJson as $Json$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo } from "./MsgMfrGetRoomStaticInfo.js";
import { MsgMfrInvite as $Message$CommonProto$NetMessage$MsgMfrInvite, type MsgMfrInviteJson as $Json$CommonProto$NetMessage$MsgMfrInvite } from "./MsgMfrInvite.js";
import { MsgMfrJoinRoom as $Message$CommonProto$NetMessage$MsgMfrJoinRoom, type MsgMfrJoinRoomJson as $Json$CommonProto$NetMessage$MsgMfrJoinRoom } from "./MsgMfrJoinRoom.js";
import { MsgMfrSetDummySettings as $Message$CommonProto$NetMessage$MsgMfrSetDummySettings, type MsgMfrSetDummySettingsJson as $Json$CommonProto$NetMessage$MsgMfrSetDummySettings } from "./MsgMfrSetDummySettings.js";
import { MsgMfrSetReady as $Message$CommonProto$NetMessage$MsgMfrSetReady, type MsgMfrSetReadyJson as $Json$CommonProto$NetMessage$MsgMfrSetReady } from "./MsgMfrSetReady.js";
import { MsgMfrSetSelfSettings as $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings, type MsgMfrSetSelfSettingsJson as $Json$CommonProto$NetMessage$MsgMfrSetSelfSettings } from "./MsgMfrSetSelfSettings.js";
import { MsgMfrStartWar as $Message$CommonProto$NetMessage$MsgMfrStartWar, type MsgMfrStartWarJson as $Json$CommonProto$NetMessage$MsgMfrStartWar } from "./MsgMfrStartWar.js";
import { MsgMmAddIgnoredReviewingMap as $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap, type MsgMmAddIgnoredReviewingMapJson as $Json$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap } from "./MsgMmAddIgnoredReviewingMap.js";
import { MsgMmAddWarEvent as $Message$CommonProto$NetMessage$MsgMmAddWarEvent, type MsgMmAddWarEventJson as $Json$CommonProto$NetMessage$MsgMmAddWarEvent } from "./MsgMmAddWarEvent.js";
import { MsgMmAddWarRule as $Message$CommonProto$NetMessage$MsgMmAddWarRule, type MsgMmAddWarRuleJson as $Json$CommonProto$NetMessage$MsgMmAddWarRule } from "./MsgMmAddWarRule.js";
import { MsgMmDeleteRedundantWarEvent as $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent, type MsgMmDeleteRedundantWarEventJson as $Json$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent } from "./MsgMmDeleteRedundantWarEvent.js";
import { MsgMmDeleteWarRule as $Message$CommonProto$NetMessage$MsgMmDeleteWarRule, type MsgMmDeleteWarRuleJson as $Json$CommonProto$NetMessage$MsgMmDeleteWarRule } from "./MsgMmDeleteWarRule.js";
import { MsgMmGetReviewingMaps as $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps, type MsgMmGetReviewingMapsJson as $Json$CommonProto$NetMessage$MsgMmGetReviewingMaps } from "./MsgMmGetReviewingMaps.js";
import { MsgMmReviewMap as $Message$CommonProto$NetMessage$MsgMmReviewMap, type MsgMmReviewMapJson as $Json$CommonProto$NetMessage$MsgMmReviewMap } from "./MsgMmReviewMap.js";
import { MsgMmSetMapEnabled as $Message$CommonProto$NetMessage$MsgMmSetMapEnabled, type MsgMmSetMapEnabledJson as $Json$CommonProto$NetMessage$MsgMmSetMapEnabled } from "./MsgMmSetMapEnabled.js";
import { MsgMmSetMapName as $Message$CommonProto$NetMessage$MsgMmSetMapName, type MsgMmSetMapNameJson as $Json$CommonProto$NetMessage$MsgMmSetMapName } from "./MsgMmSetMapName.js";
import { MsgMmSetMapTagIdFlags as $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags, type MsgMmSetMapTagIdFlagsJson as $Json$CommonProto$NetMessage$MsgMmSetMapTagIdFlags } from "./MsgMmSetMapTagIdFlags.js";
import { MsgMmSetMapTagSingleData as $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData, type MsgMmSetMapTagSingleDataJson as $Json$CommonProto$NetMessage$MsgMmSetMapTagSingleData } from "./MsgMmSetMapTagSingleData.js";
import { MsgMmSetWarRuleAvailability as $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability, type MsgMmSetWarRuleAvailabilityJson as $Json$CommonProto$NetMessage$MsgMmSetWarRuleAvailability } from "./MsgMmSetWarRuleAvailability.js";
import { MsgMmSetWarRuleFixedTileTheme as $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme, type MsgMmSetWarRuleFixedTileThemeJson as $Json$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme } from "./MsgMmSetWarRuleFixedTileTheme.js";
import { MsgMmSetWarRuleName as $Message$CommonProto$NetMessage$MsgMmSetWarRuleName, type MsgMmSetWarRuleNameJson as $Json$CommonProto$NetMessage$MsgMmSetWarRuleName } from "./MsgMmSetWarRuleName.js";
import { MsgMmSubmitMapSimpleDialogue as $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue, type MsgMmSubmitMapSimpleDialogueJson as $Json$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue } from "./MsgMmSubmitMapSimpleDialogue.js";
import { MsgMmrDeleteRoomByServer as $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer, type MsgMmrDeleteRoomByServerJson as $Json$CommonProto$NetMessage$MsgMmrDeleteRoomByServer } from "./MsgMmrDeleteRoomByServer.js";
import { MsgMmrGetBannedNormalMapIdArray as $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray, type MsgMmrGetBannedNormalMapIdArrayJson as $Json$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray } from "./MsgMmrGetBannedNormalMapIdArray.js";
import { MsgMmrGetBootTimerDaysRange as $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange, type MsgMmrGetBootTimerDaysRangeJson as $Json$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange } from "./MsgMmrGetBootTimerDaysRange.js";
import { MsgMmrGetJoinedRoomIdArray as $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray, type MsgMmrGetJoinedRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray } from "./MsgMmrGetJoinedRoomIdArray.js";
import { MsgMmrGetMaxConcurrentCount as $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount, type MsgMmrGetMaxConcurrentCountJson as $Json$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount } from "./MsgMmrGetMaxConcurrentCount.js";
import { MsgMmrGetRoomPublicInfo as $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo, type MsgMmrGetRoomPublicInfoJson as $Json$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo } from "./MsgMmrGetRoomPublicInfo.js";
import { MsgMmrSetBannedCoIdArray as $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray, type MsgMmrSetBannedCoIdArrayJson as $Json$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray } from "./MsgMmrSetBannedCoIdArray.js";
import { MsgMmrSetBannedNormalMapIdArray as $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray, type MsgMmrSetBannedNormalMapIdArrayJson as $Json$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray } from "./MsgMmrSetBannedNormalMapIdArray.js";
import { MsgMmrSetBootTimerDaysRange as $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange, type MsgMmrSetBootTimerDaysRangeJson as $Json$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange } from "./MsgMmrSetBootTimerDaysRange.js";
import { MsgMmrSetMaxConcurrentCount as $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount, type MsgMmrSetMaxConcurrentCountJson as $Json$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount } from "./MsgMmrSetMaxConcurrentCount.js";
import { MsgMmrSetSelfSettings as $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings, type MsgMmrSetSelfSettingsJson as $Json$CommonProto$NetMessage$MsgMmrSetSelfSettings } from "./MsgMmrSetSelfSettings.js";
import { MsgMpwCommonBroadcastGameStart as $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart, type MsgMpwCommonBroadcastGameStartJson as $Json$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart } from "./MsgMpwCommonBroadcastGameStart.js";
import { MsgMpwCommonContinueWar as $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar, type MsgMpwCommonContinueWarJson as $Json$CommonProto$NetMessage$MsgMpwCommonContinueWar } from "./MsgMpwCommonContinueWar.js";
import { MsgMpwCommonGetHalfwayReplayData as $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData, type MsgMpwCommonGetHalfwayReplayDataJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData } from "./MsgMpwCommonGetHalfwayReplayData.js";
import { MsgMpwCommonGetJoinedMpwIdArray as $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray, type MsgMpwCommonGetJoinedMpwIdArrayJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray } from "./MsgMpwCommonGetJoinedMpwIdArray.js";
import { MsgMpwCommonGetUnitStatistics as $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics, type MsgMpwCommonGetUnitStatisticsJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics } from "./MsgMpwCommonGetUnitStatistics.js";
import { MsgMpwCommonGetWarProgressInfo as $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo, type MsgMpwCommonGetWarProgressInfoJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo } from "./MsgMpwCommonGetWarProgressInfo.js";
import { MsgMpwCommonGetWarSettings as $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings, type MsgMpwCommonGetWarSettingsJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetWarSettings } from "./MsgMpwCommonGetWarSettings.js";
import { MsgMpwCommonGetWarTimestamp as $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp, type MsgMpwCommonGetWarTimestampJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp } from "./MsgMpwCommonGetWarTimestamp.js";
import { MsgMpwCommonHandleBoot as $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot, type MsgMpwCommonHandleBootJson as $Json$CommonProto$NetMessage$MsgMpwCommonHandleBoot } from "./MsgMpwCommonHandleBoot.js";
import { MsgMpwCommonMarkGrid as $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid, type MsgMpwCommonMarkGridJson as $Json$CommonProto$NetMessage$MsgMpwCommonMarkGrid } from "./MsgMpwCommonMarkGrid.js";
import { MsgMpwCommonSetGridMarkList as $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList, type MsgMpwCommonSetGridMarkListJson as $Json$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList } from "./MsgMpwCommonSetGridMarkList.js";
import { MsgMpwCommonSetHiddenGridMarkTypeIdList as $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList, type MsgMpwCommonSetHiddenGridMarkTypeIdListJson as $Json$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList } from "./MsgMpwCommonSetHiddenGridMarkTypeIdList.js";
import { MsgMpwCommonSyncWar as $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar, type MsgMpwCommonSyncWarJson as $Json$CommonProto$NetMessage$MsgMpwCommonSyncWar } from "./MsgMpwCommonSyncWar.js";
import { MsgMpwExecuteWarOperation as $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation, type MsgMpwExecuteWarOperationJson as $Json$CommonProto$NetMessage$MsgMpwExecuteWarOperation } from "./MsgMpwExecuteWarOperation.js";
import { MsgMpwWatchContinueWar as $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar, type MsgMpwWatchContinueWarJson as $Json$CommonProto$NetMessage$MsgMpwWatchContinueWar } from "./MsgMpwWatchContinueWar.js";
import { MsgMpwWatchDeleteWatcher as $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher, type MsgMpwWatchDeleteWatcherJson as $Json$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher } from "./MsgMpwWatchDeleteWatcher.js";
import { MsgMpwWatchGetIncomingInfo as $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo, type MsgMpwWatchGetIncomingInfoJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo } from "./MsgMpwWatchGetIncomingInfo.js";
import { MsgMpwWatchGetOngoingWarIdArray as $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray, type MsgMpwWatchGetOngoingWarIdArrayJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray } from "./MsgMpwWatchGetOngoingWarIdArray.js";
import { MsgMpwWatchGetOutgoingInfo as $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo, type MsgMpwWatchGetOutgoingInfoJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo } from "./MsgMpwWatchGetOutgoingInfo.js";
import { MsgMpwWatchGetRequestableWarIdArray as $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray, type MsgMpwWatchGetRequestableWarIdArrayJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray } from "./MsgMpwWatchGetRequestableWarIdArray.js";
import { MsgMpwWatchGetRequestedWarIdArray as $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray, type MsgMpwWatchGetRequestedWarIdArrayJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray } from "./MsgMpwWatchGetRequestedWarIdArray.js";
import { MsgMpwWatchGetWatchedWarIdArray as $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray, type MsgMpwWatchGetWatchedWarIdArrayJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray } from "./MsgMpwWatchGetWatchedWarIdArray.js";
import { MsgMpwWatchHandleRequest as $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest, type MsgMpwWatchHandleRequestJson as $Json$CommonProto$NetMessage$MsgMpwWatchHandleRequest } from "./MsgMpwWatchHandleRequest.js";
import { MsgMpwWatchMakeRequest as $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest, type MsgMpwWatchMakeRequestJson as $Json$CommonProto$NetMessage$MsgMpwWatchMakeRequest } from "./MsgMpwWatchMakeRequest.js";
import { MsgMrrDeleteRoomByServer as $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer, type MsgMrrDeleteRoomByServerJson as $Json$CommonProto$NetMessage$MsgMrrDeleteRoomByServer } from "./MsgMrrDeleteRoomByServer.js";
import { MsgMrrGetBannedNormalMapIdArray as $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray, type MsgMrrGetBannedNormalMapIdArrayJson as $Json$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray } from "./MsgMrrGetBannedNormalMapIdArray.js";
import { MsgMrrGetBootTimerDaysRange as $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange, type MsgMrrGetBootTimerDaysRangeJson as $Json$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange } from "./MsgMrrGetBootTimerDaysRange.js";
import { MsgMrrGetJoinedRoomIdArray as $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray, type MsgMrrGetJoinedRoomIdArrayJson as $Json$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray } from "./MsgMrrGetJoinedRoomIdArray.js";
import { MsgMrrGetMaxConcurrentCount as $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount, type MsgMrrGetMaxConcurrentCountJson as $Json$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount } from "./MsgMrrGetMaxConcurrentCount.js";
import { MsgMrrGetRoomPublicInfo as $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo, type MsgMrrGetRoomPublicInfoJson as $Json$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo } from "./MsgMrrGetRoomPublicInfo.js";
import { MsgMrrSetBannedCoIdArray as $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray, type MsgMrrSetBannedCoIdArrayJson as $Json$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray } from "./MsgMrrSetBannedCoIdArray.js";
import { MsgMrrSetBannedNormalMapIdArray as $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray, type MsgMrrSetBannedNormalMapIdArrayJson as $Json$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray } from "./MsgMrrSetBannedNormalMapIdArray.js";
import { MsgMrrSetBootTimerDaysRange as $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange, type MsgMrrSetBootTimerDaysRangeJson as $Json$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange } from "./MsgMrrSetBootTimerDaysRange.js";
import { MsgMrrSetMaxConcurrentCount as $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount, type MsgMrrSetMaxConcurrentCountJson as $Json$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount } from "./MsgMrrSetMaxConcurrentCount.js";
import { MsgMrrSetSelfSettings as $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings, type MsgMrrSetSelfSettingsJson as $Json$CommonProto$NetMessage$MsgMrrSetSelfSettings } from "./MsgMrrSetSelfSettings.js";
import { MsgNormalMapGetAllEnabledBriefDataVersions as $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions, type MsgNormalMapGetAllEnabledBriefDataVersionsJson as $Json$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions } from "./MsgNormalMapGetAllEnabledBriefDataVersions.js";
import { MsgNormalMapGetBriefData as $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData, type MsgNormalMapGetBriefDataJson as $Json$CommonProto$NetMessage$MsgNormalMapGetBriefData } from "./MsgNormalMapGetBriefData.js";
import { MsgNormalMapGetBriefDataArray as $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray, type MsgNormalMapGetBriefDataArrayJson as $Json$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray } from "./MsgNormalMapGetBriefDataArray.js";
import { MsgNormalMapGetBriefDataVersion as $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion, type MsgNormalMapGetBriefDataVersionJson as $Json$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion } from "./MsgNormalMapGetBriefDataVersion.js";
import { MsgReplayGetAllInfoVersions as $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions, type MsgReplayGetAllInfoVersionsJson as $Json$CommonProto$NetMessage$MsgReplayGetAllInfoVersions } from "./MsgReplayGetAllInfoVersions.js";
import { MsgReplayGetData as $Message$CommonProto$NetMessage$MsgReplayGetData, type MsgReplayGetDataJson as $Json$CommonProto$NetMessage$MsgReplayGetData } from "./MsgReplayGetData.js";
import { MsgReplayGetInfoVersion as $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion, type MsgReplayGetInfoVersionJson as $Json$CommonProto$NetMessage$MsgReplayGetInfoVersion } from "./MsgReplayGetInfoVersion.js";
import { MsgReplayGetReplayInfo as $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo, type MsgReplayGetReplayInfoJson as $Json$CommonProto$NetMessage$MsgReplayGetReplayInfo } from "./MsgReplayGetReplayInfo.js";
import { MsgReplayGetReplayInfoArray as $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray, type MsgReplayGetReplayInfoArrayJson as $Json$CommonProto$NetMessage$MsgReplayGetReplayInfoArray } from "./MsgReplayGetReplayInfoArray.js";
import { MsgReplayGetSelfRating as $Message$CommonProto$NetMessage$MsgReplayGetSelfRating, type MsgReplayGetSelfRatingJson as $Json$CommonProto$NetMessage$MsgReplayGetSelfRating } from "./MsgReplayGetSelfRating.js";
import { MsgReplaySetSelfRating as $Message$CommonProto$NetMessage$MsgReplaySetSelfRating, type MsgReplaySetSelfRatingJson as $Json$CommonProto$NetMessage$MsgReplaySetSelfRating } from "./MsgReplaySetSelfRating.js";
import { MsgSpmCreateScw as $Message$CommonProto$NetMessage$MsgSpmCreateScw, type MsgSpmCreateScwJson as $Json$CommonProto$NetMessage$MsgSpmCreateScw } from "./MsgSpmCreateScw.js";
import { MsgSpmCreateSfw as $Message$CommonProto$NetMessage$MsgSpmCreateSfw, type MsgSpmCreateSfwJson as $Json$CommonProto$NetMessage$MsgSpmCreateSfw } from "./MsgSpmCreateSfw.js";
import { MsgSpmCreateSrw as $Message$CommonProto$NetMessage$MsgSpmCreateSrw, type MsgSpmCreateSrwJson as $Json$CommonProto$NetMessage$MsgSpmCreateSrw } from "./MsgSpmCreateSrw.js";
import { MsgSpmDeleteWarSaveSlot as $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot, type MsgSpmDeleteWarSaveSlotJson as $Json$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot } from "./MsgSpmDeleteWarSaveSlot.js";
import { MsgSpmGetAllWarSaveSlotTimestamps as $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps, type MsgSpmGetAllWarSaveSlotTimestampsJson as $Json$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps } from "./MsgSpmGetAllWarSaveSlotTimestamps.js";
import { MsgSpmGetRankList as $Message$CommonProto$NetMessage$MsgSpmGetRankList, type MsgSpmGetRankListJson as $Json$CommonProto$NetMessage$MsgSpmGetRankList } from "./MsgSpmGetRankList.js";
import { MsgSpmGetReplayData as $Message$CommonProto$NetMessage$MsgSpmGetReplayData, type MsgSpmGetReplayDataJson as $Json$CommonProto$NetMessage$MsgSpmGetReplayData } from "./MsgSpmGetReplayData.js";
import { MsgSpmGetWarSaveSlotFullData as $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData, type MsgSpmGetWarSaveSlotFullDataJson as $Json$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData } from "./MsgSpmGetWarSaveSlotFullData.js";
import { MsgSpmGetWarSaveSlotFullDataArray as $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray, type MsgSpmGetWarSaveSlotFullDataArrayJson as $Json$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray } from "./MsgSpmGetWarSaveSlotFullDataArray.js";
import { MsgSpmSaveScw as $Message$CommonProto$NetMessage$MsgSpmSaveScw, type MsgSpmSaveScwJson as $Json$CommonProto$NetMessage$MsgSpmSaveScw } from "./MsgSpmSaveScw.js";
import { MsgSpmSaveSfw as $Message$CommonProto$NetMessage$MsgSpmSaveSfw, type MsgSpmSaveSfwJson as $Json$CommonProto$NetMessage$MsgSpmSaveSfw } from "./MsgSpmSaveSfw.js";
import { MsgSpmSaveSrw as $Message$CommonProto$NetMessage$MsgSpmSaveSrw, type MsgSpmSaveSrwJson as $Json$CommonProto$NetMessage$MsgSpmSaveSrw } from "./MsgSpmSaveSrw.js";
import { MsgSpmValidateSrw as $Message$CommonProto$NetMessage$MsgSpmValidateSrw, type MsgSpmValidateSrwJson as $Json$CommonProto$NetMessage$MsgSpmValidateSrw } from "./MsgSpmValidateSrw.js";
import { MsgUserGetBriefInfo as $Message$CommonProto$NetMessage$MsgUserGetBriefInfo, type MsgUserGetBriefInfoJson as $Json$CommonProto$NetMessage$MsgUserGetBriefInfo } from "./MsgUserGetBriefInfo.js";
import { MsgUserGetOnlineState as $Message$CommonProto$NetMessage$MsgUserGetOnlineState, type MsgUserGetOnlineStateJson as $Json$CommonProto$NetMessage$MsgUserGetOnlineState } from "./MsgUserGetOnlineState.js";
import { MsgUserGetOnlineUserIdArray as $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray, type MsgUserGetOnlineUserIdArrayJson as $Json$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray } from "./MsgUserGetOnlineUserIdArray.js";
import { MsgUserGetPublicInfo as $Message$CommonProto$NetMessage$MsgUserGetPublicInfo, type MsgUserGetPublicInfoJson as $Json$CommonProto$NetMessage$MsgUserGetPublicInfo } from "./MsgUserGetPublicInfo.js";
import { MsgUserGetPublicInfoArray as $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray, type MsgUserGetPublicInfoArrayJson as $Json$CommonProto$NetMessage$MsgUserGetPublicInfoArray } from "./MsgUserGetPublicInfoArray.js";
import { MsgUserGetUsersByNickname as $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname, type MsgUserGetUsersByNicknameJson as $Json$CommonProto$NetMessage$MsgUserGetUsersByNickname } from "./MsgUserGetUsersByNickname.js";
import { MsgUserLogin as $Message$CommonProto$NetMessage$MsgUserLogin, type MsgUserLoginJson as $Json$CommonProto$NetMessage$MsgUserLogin } from "./MsgUserLogin.js";
import { MsgUserLoginAsGuest as $Message$CommonProto$NetMessage$MsgUserLoginAsGuest, type MsgUserLoginAsGuestJson as $Json$CommonProto$NetMessage$MsgUserLoginAsGuest } from "./MsgUserLoginAsGuest.js";
import { MsgUserLogout as $Message$CommonProto$NetMessage$MsgUserLogout, type MsgUserLogoutJson as $Json$CommonProto$NetMessage$MsgUserLogout } from "./MsgUserLogout.js";
import { MsgUserModifyFavoriteReplayIdArray as $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray, type MsgUserModifyFavoriteReplayIdArrayJson as $Json$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray } from "./MsgUserModifyFavoriteReplayIdArray.js";
import { MsgUserRegister as $Message$CommonProto$NetMessage$MsgUserRegister, type MsgUserRegisterJson as $Json$CommonProto$NetMessage$MsgUserRegister } from "./MsgUserRegister.js";
import { MsgUserRequestEmailVerificationCode as $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode, type MsgUserRequestEmailVerificationCodeJson as $Json$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode } from "./MsgUserRequestEmailVerificationCode.js";
import { MsgUserRequestPasswordVerificationCode as $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode, type MsgUserRequestPasswordVerificationCodeJson as $Json$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode } from "./MsgUserRequestPasswordVerificationCode.js";
import { MsgUserResetPasswordWithEmail as $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail, type MsgUserResetPasswordWithEmailJson as $Json$CommonProto$NetMessage$MsgUserResetPasswordWithEmail } from "./MsgUserResetPasswordWithEmail.js";
import { MsgUserSetAvatarId as $Message$CommonProto$NetMessage$MsgUserSetAvatarId, type MsgUserSetAvatarIdJson as $Json$CommonProto$NetMessage$MsgUserSetAvatarId } from "./MsgUserSetAvatarId.js";
import { MsgUserSetCoBgmSettings as $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings, type MsgUserSetCoBgmSettingsJson as $Json$CommonProto$NetMessage$MsgUserSetCoBgmSettings } from "./MsgUserSetCoBgmSettings.js";
import { MsgUserSetDiscordInfo as $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo, type MsgUserSetDiscordInfoJson as $Json$CommonProto$NetMessage$MsgUserSetDiscordInfo } from "./MsgUserSetDiscordInfo.js";
import { MsgUserSetMapEditorAutoSaveTime as $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime, type MsgUserSetMapEditorAutoSaveTimeJson as $Json$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime } from "./MsgUserSetMapEditorAutoSaveTime.js";
import { MsgUserSetMapRating as $Message$CommonProto$NetMessage$MsgUserSetMapRating, type MsgUserSetMapRatingJson as $Json$CommonProto$NetMessage$MsgUserSetMapRating } from "./MsgUserSetMapRating.js";
import { MsgUserSetNickname as $Message$CommonProto$NetMessage$MsgUserSetNickname, type MsgUserSetNicknameJson as $Json$CommonProto$NetMessage$MsgUserSetNickname } from "./MsgUserSetNickname.js";
import { MsgUserSetPassword as $Message$CommonProto$NetMessage$MsgUserSetPassword, type MsgUserSetPasswordJson as $Json$CommonProto$NetMessage$MsgUserSetPassword } from "./MsgUserSetPassword.js";
import { MsgUserSetRelation as $Message$CommonProto$NetMessage$MsgUserSetRelation, type MsgUserSetRelationJson as $Json$CommonProto$NetMessage$MsgUserSetRelation } from "./MsgUserSetRelation.js";
import { MsgUserSetSceneBgmSettings as $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings, type MsgUserSetSceneBgmSettingsJson as $Json$CommonProto$NetMessage$MsgUserSetSceneBgmSettings } from "./MsgUserSetSceneBgmSettings.js";
import { MsgUserSetSettings as $Message$CommonProto$NetMessage$MsgUserSetSettings, type MsgUserSetSettingsJson as $Json$CommonProto$NetMessage$MsgUserSetSettings } from "./MsgUserSetSettings.js";
import { MsgUserSetShowMedalIdArray as $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray, type MsgUserSetShowMedalIdArrayJson as $Json$CommonProto$NetMessage$MsgUserSetShowMedalIdArray } from "./MsgUserSetShowMedalIdArray.js";
import { MsgUserVerifyEmail as $Message$CommonProto$NetMessage$MsgUserVerifyEmail, type MsgUserVerifyEmailJson as $Json$CommonProto$NetMessage$MsgUserVerifyEmail } from "./MsgUserVerifyEmail.js";

export interface MessageContainerJson extends $ProtoSchemaJsonBase {
    MsgCommonHeartbeat?: $Json$CommonProto$NetMessage$MsgCommonHeartbeat | null | undefined;
    MsgCommonError?: $Json$CommonProto$NetMessage$MsgCommonError | null | undefined;
    MsgCommonServerDisconnect?: $Json$CommonProto$NetMessage$MsgCommonServerDisconnect | null | undefined;
    MsgCommonLatestConfigVersion?: $Json$CommonProto$NetMessage$MsgCommonLatestConfigVersion | null | undefined;
    MsgCommonGetServerStatus?: $Json$CommonProto$NetMessage$MsgCommonGetServerStatus | null | undefined;
    MsgCommonGetRankList?: $Json$CommonProto$NetMessage$MsgCommonGetRankList | null | undefined;
    MsgCommonGetCoStatistics?: $Json$CommonProto$NetMessage$MsgCommonGetCoStatistics | null | undefined;
    MsgUserRegister?: $Json$CommonProto$NetMessage$MsgUserRegister | null | undefined;
    MsgUserLogin?: $Json$CommonProto$NetMessage$MsgUserLogin | null | undefined;
    MsgUserLogout?: $Json$CommonProto$NetMessage$MsgUserLogout | null | undefined;
    MsgUserGetPublicInfo?: $Json$CommonProto$NetMessage$MsgUserGetPublicInfo | null | undefined;
    MsgUserGetPublicInfoArray?: $Json$CommonProto$NetMessage$MsgUserGetPublicInfoArray | null | undefined;
    MsgUserGetBriefInfo?: $Json$CommonProto$NetMessage$MsgUserGetBriefInfo | null | undefined;
    MsgUserGetOnlineState?: $Json$CommonProto$NetMessage$MsgUserGetOnlineState | null | undefined;
    MsgUserGetOnlineUserIdArray?: $Json$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray | null | undefined;
    MsgUserSetNickname?: $Json$CommonProto$NetMessage$MsgUserSetNickname | null | undefined;
    MsgUserSetDiscordInfo?: $Json$CommonProto$NetMessage$MsgUserSetDiscordInfo | null | undefined;
    MsgUserSetCoBgmSettings?: $Json$CommonProto$NetMessage$MsgUserSetCoBgmSettings | null | undefined;
    MsgUserSetSceneBgmSettings?: $Json$CommonProto$NetMessage$MsgUserSetSceneBgmSettings | null | undefined;
    MsgUserSetPassword?: $Json$CommonProto$NetMessage$MsgUserSetPassword | null | undefined;
    MsgUserSetSettings?: $Json$CommonProto$NetMessage$MsgUserSetSettings | null | undefined;
    MsgUserSetMapRating?: $Json$CommonProto$NetMessage$MsgUserSetMapRating | null | undefined;
    MsgUserSetAvatarId?: $Json$CommonProto$NetMessage$MsgUserSetAvatarId | null | undefined;
    MsgUserSetMapEditorAutoSaveTime?: $Json$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime | null | undefined;
    MsgUserLoginAsGuest?: $Json$CommonProto$NetMessage$MsgUserLoginAsGuest | null | undefined;
    MsgUserGetUsersByNickname?: $Json$CommonProto$NetMessage$MsgUserGetUsersByNickname | null | undefined;
    MsgUserSetRelation?: $Json$CommonProto$NetMessage$MsgUserSetRelation | null | undefined;
    MsgUserSetShowMedalIdArray?: $Json$CommonProto$NetMessage$MsgUserSetShowMedalIdArray | null | undefined;
    MsgUserModifyFavoriteReplayIdArray?: $Json$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray | null | undefined;
    MsgUserRequestEmailVerificationCode?: $Json$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode | null | undefined;
    MsgUserVerifyEmail?: $Json$CommonProto$NetMessage$MsgUserVerifyEmail | null | undefined;
    MsgUserRequestPasswordVerificationCode?: $Json$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode | null | undefined;
    MsgUserResetPasswordWithEmail?: $Json$CommonProto$NetMessage$MsgUserResetPasswordWithEmail | null | undefined;
    MsgMeGetAllMapDataTimestamps?: $Json$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps | null | undefined;
    MsgMeGetMapDataTimestamp?: $Json$CommonProto$NetMessage$MsgMeGetMapDataTimestamp | null | undefined;
    MsgMeGetMapDataArray?: $Json$CommonProto$NetMessage$MsgMeGetMapDataArray | null | undefined;
    MsgMeGetMapData?: $Json$CommonProto$NetMessage$MsgMeGetMapData | null | undefined;
    MsgMeSubmitNormalMap?: $Json$CommonProto$NetMessage$MsgMeSubmitNormalMap | null | undefined;
    MsgMeDeleteSlot?: $Json$CommonProto$NetMessage$MsgMeDeleteSlot | null | undefined;
    MsgChatAddMessage?: $Json$CommonProto$NetMessage$MsgChatAddMessage | null | undefined;
    MsgChatGetAllMessages?: $Json$CommonProto$NetMessage$MsgChatGetAllMessages | null | undefined;
    MsgChatUpdateReadProgress?: $Json$CommonProto$NetMessage$MsgChatUpdateReadProgress | null | undefined;
    MsgChatGetAllReadProgressList?: $Json$CommonProto$NetMessage$MsgChatGetAllReadProgressList | null | undefined;
    MsgChatDeleteMessage?: $Json$CommonProto$NetMessage$MsgChatDeleteMessage | null | undefined;
    MsgMmSetWarRuleAvailability?: $Json$CommonProto$NetMessage$MsgMmSetWarRuleAvailability | null | undefined;
    MsgMmSetMapEnabled?: $Json$CommonProto$NetMessage$MsgMmSetMapEnabled | null | undefined;
    MsgMmGetReviewingMaps?: $Json$CommonProto$NetMessage$MsgMmGetReviewingMaps | null | undefined;
    MsgMmReviewMap?: $Json$CommonProto$NetMessage$MsgMmReviewMap | null | undefined;
    MsgMmSetMapTagIdFlags?: $Json$CommonProto$NetMessage$MsgMmSetMapTagIdFlags | null | undefined;
    MsgMmSetMapName?: $Json$CommonProto$NetMessage$MsgMmSetMapName | null | undefined;
    MsgMmAddWarRule?: $Json$CommonProto$NetMessage$MsgMmAddWarRule | null | undefined;
    MsgMmAddWarEvent?: $Json$CommonProto$NetMessage$MsgMmAddWarEvent | null | undefined;
    MsgMmDeleteWarRule?: $Json$CommonProto$NetMessage$MsgMmDeleteWarRule | null | undefined;
    MsgMmDeleteRedundantWarEvent?: $Json$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent | null | undefined;
    MsgMmSetWarRuleName?: $Json$CommonProto$NetMessage$MsgMmSetWarRuleName | null | undefined;
    MsgMmSetWarRuleFixedTileTheme?: $Json$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme | null | undefined;
    MsgMmSetMapTagSingleData?: $Json$CommonProto$NetMessage$MsgMmSetMapTagSingleData | null | undefined;
    MsgMmSubmitMapSimpleDialogue?: $Json$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue | null | undefined;
    MsgMmAddIgnoredReviewingMap?: $Json$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap | null | undefined;
    MsgReplaySetSelfRating?: $Json$CommonProto$NetMessage$MsgReplaySetSelfRating | null | undefined;
    MsgReplayGetSelfRating?: $Json$CommonProto$NetMessage$MsgReplayGetSelfRating | null | undefined;
    MsgReplayGetData?: $Json$CommonProto$NetMessage$MsgReplayGetData | null | undefined;
    MsgReplayGetReplayInfo?: $Json$CommonProto$NetMessage$MsgReplayGetReplayInfo | null | undefined;
    MsgReplayGetReplayInfoArray?: $Json$CommonProto$NetMessage$MsgReplayGetReplayInfoArray | null | undefined;
    MsgReplayGetAllInfoVersions?: $Json$CommonProto$NetMessage$MsgReplayGetAllInfoVersions | null | undefined;
    MsgReplayGetInfoVersion?: $Json$CommonProto$NetMessage$MsgReplayGetInfoVersion | null | undefined;
    MsgMcrCreateRoom?: $Json$CommonProto$NetMessage$MsgMcrCreateRoom | null | undefined;
    MsgMcrExitRoom?: $Json$CommonProto$NetMessage$MsgMcrExitRoom | null | undefined;
    MsgMcrJoinRoom?: $Json$CommonProto$NetMessage$MsgMcrJoinRoom | null | undefined;
    MsgMcrDeleteRoom?: $Json$CommonProto$NetMessage$MsgMcrDeleteRoom | null | undefined;
    MsgMcrSetReady?: $Json$CommonProto$NetMessage$MsgMcrSetReady | null | undefined;
    MsgMcrDeletePlayer?: $Json$CommonProto$NetMessage$MsgMcrDeletePlayer | null | undefined;
    MsgMcrSetSelfSettings?: $Json$CommonProto$NetMessage$MsgMcrSetSelfSettings | null | undefined;
    MsgMcrStartWar?: $Json$CommonProto$NetMessage$MsgMcrStartWar | null | undefined;
    MsgMcrGetJoinedRoomIdArray?: $Json$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray | null | undefined;
    MsgMcrGetJoinableRoomIdArray?: $Json$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray | null | undefined;
    MsgMcrGetRoomStaticInfo?: $Json$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo | null | undefined;
    MsgMcrGetRoomPlayerInfo?: $Json$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo | null | undefined;
    MsgMcrInvite?: $Json$CommonProto$NetMessage$MsgMcrInvite | null | undefined;
    MsgMcrAddDummy?: $Json$CommonProto$NetMessage$MsgMcrAddDummy | null | undefined;
    MsgMcrSetDummySettings?: $Json$CommonProto$NetMessage$MsgMcrSetDummySettings | null | undefined;
    MsgMpwCommonGetJoinedMpwIdArray?: $Json$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray | null | undefined;
    MsgMpwCommonGetWarTimestamp?: $Json$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp | null | undefined;
    MsgMpwCommonGetUnitStatistics?: $Json$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics | null | undefined;
    MsgMpwCommonContinueWar?: $Json$CommonProto$NetMessage$MsgMpwCommonContinueWar | null | undefined;
    MsgMpwCommonSyncWar?: $Json$CommonProto$NetMessage$MsgMpwCommonSyncWar | null | undefined;
    MsgMpwCommonHandleBoot?: $Json$CommonProto$NetMessage$MsgMpwCommonHandleBoot | null | undefined;
    MsgMpwCommonBroadcastGameStart?: $Json$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart | null | undefined;
    MsgMpwCommonGetWarSettings?: $Json$CommonProto$NetMessage$MsgMpwCommonGetWarSettings | null | undefined;
    MsgMpwCommonGetWarProgressInfo?: $Json$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo | null | undefined;
    MsgMpwCommonMarkGrid?: $Json$CommonProto$NetMessage$MsgMpwCommonMarkGrid | null | undefined;
    MsgMpwCommonSetHiddenGridMarkTypeIdList?: $Json$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList | null | undefined;
    MsgMpwCommonSetGridMarkList?: $Json$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList | null | undefined;
    MsgMpwCommonGetHalfwayReplayData?: $Json$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData | null | undefined;
    MsgMpwWatchMakeRequest?: $Json$CommonProto$NetMessage$MsgMpwWatchMakeRequest | null | undefined;
    MsgMpwWatchHandleRequest?: $Json$CommonProto$NetMessage$MsgMpwWatchHandleRequest | null | undefined;
    MsgMpwWatchDeleteWatcher?: $Json$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher | null | undefined;
    MsgMpwWatchGetRequestableWarIdArray?: $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray | null | undefined;
    MsgMpwWatchGetOngoingWarIdArray?: $Json$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray | null | undefined;
    MsgMpwWatchGetRequestedWarIdArray?: $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray | null | undefined;
    MsgMpwWatchGetWatchedWarIdArray?: $Json$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray | null | undefined;
    MsgMpwWatchContinueWar?: $Json$CommonProto$NetMessage$MsgMpwWatchContinueWar | null | undefined;
    MsgMpwWatchGetIncomingInfo?: $Json$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo | null | undefined;
    MsgMpwWatchGetOutgoingInfo?: $Json$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo | null | undefined;
    MsgMpwExecuteWarOperation?: $Json$CommonProto$NetMessage$MsgMpwExecuteWarOperation | null | undefined;
    MsgSpmCreateScw?: $Json$CommonProto$NetMessage$MsgSpmCreateScw | null | undefined;
    MsgSpmCreateSfw?: $Json$CommonProto$NetMessage$MsgSpmCreateSfw | null | undefined;
    MsgSpmCreateSrw?: $Json$CommonProto$NetMessage$MsgSpmCreateSrw | null | undefined;
    MsgSpmGetAllWarSaveSlotTimestamps?: $Json$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps | null | undefined;
    MsgSpmGetWarSaveSlotFullData?: $Json$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData | null | undefined;
    MsgSpmGetWarSaveSlotFullDataArray?: $Json$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray | null | undefined;
    MsgSpmDeleteWarSaveSlot?: $Json$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot | null | undefined;
    MsgSpmSaveScw?: $Json$CommonProto$NetMessage$MsgSpmSaveScw | null | undefined;
    MsgSpmSaveSfw?: $Json$CommonProto$NetMessage$MsgSpmSaveSfw | null | undefined;
    MsgSpmSaveSrw?: $Json$CommonProto$NetMessage$MsgSpmSaveSrw | null | undefined;
    MsgSpmValidateSrw?: $Json$CommonProto$NetMessage$MsgSpmValidateSrw | null | undefined;
    MsgSpmGetRankList?: $Json$CommonProto$NetMessage$MsgSpmGetRankList | null | undefined;
    MsgSpmGetReplayData?: $Json$CommonProto$NetMessage$MsgSpmGetReplayData | null | undefined;
    MsgMrrSetMaxConcurrentCount?: $Json$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount | null | undefined;
    MsgMrrGetMaxConcurrentCount?: $Json$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount | null | undefined;
    MsgMrrSetBannedNormalMapIdArray?: $Json$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray | null | undefined;
    MsgMrrGetBannedNormalMapIdArray?: $Json$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray | null | undefined;
    MsgMrrSetBootTimerDaysRange?: $Json$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange | null | undefined;
    MsgMrrGetBootTimerDaysRange?: $Json$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange | null | undefined;
    MsgMrrGetJoinedRoomIdArray?: $Json$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray | null | undefined;
    MsgMrrGetRoomPublicInfo?: $Json$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo | null | undefined;
    MsgMrrDeleteRoomByServer?: $Json$CommonProto$NetMessage$MsgMrrDeleteRoomByServer | null | undefined;
    MsgMrrSetBannedCoIdArray?: $Json$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray | null | undefined;
    MsgMrrSetSelfSettings?: $Json$CommonProto$NetMessage$MsgMrrSetSelfSettings | null | undefined;
    MsgBroadcastGetAllMessageIdArray?: $Json$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray | null | undefined;
    MsgBroadcastAddMessage?: $Json$CommonProto$NetMessage$MsgBroadcastAddMessage | null | undefined;
    MsgBroadcastDeleteMessage?: $Json$CommonProto$NetMessage$MsgBroadcastDeleteMessage | null | undefined;
    MsgBroadcastDoBroadcast?: $Json$CommonProto$NetMessage$MsgBroadcastDoBroadcast | null | undefined;
    MsgBroadcastGetMessageData?: $Json$CommonProto$NetMessage$MsgBroadcastGetMessageData | null | undefined;
    MsgChangeLogGetMessageList?: $Json$CommonProto$NetMessage$MsgChangeLogGetMessageList | null | undefined;
    MsgChangeLogAddMessage?: $Json$CommonProto$NetMessage$MsgChangeLogAddMessage | null | undefined;
    MsgChangeLogModifyMessage?: $Json$CommonProto$NetMessage$MsgChangeLogModifyMessage | null | undefined;
    MsgMfrCreateRoom?: $Json$CommonProto$NetMessage$MsgMfrCreateRoom | null | undefined;
    MsgMfrExitRoom?: $Json$CommonProto$NetMessage$MsgMfrExitRoom | null | undefined;
    MsgMfrJoinRoom?: $Json$CommonProto$NetMessage$MsgMfrJoinRoom | null | undefined;
    MsgMfrDeleteRoom?: $Json$CommonProto$NetMessage$MsgMfrDeleteRoom | null | undefined;
    MsgMfrSetReady?: $Json$CommonProto$NetMessage$MsgMfrSetReady | null | undefined;
    MsgMfrDeletePlayer?: $Json$CommonProto$NetMessage$MsgMfrDeletePlayer | null | undefined;
    MsgMfrSetSelfSettings?: $Json$CommonProto$NetMessage$MsgMfrSetSelfSettings | null | undefined;
    MsgMfrStartWar?: $Json$CommonProto$NetMessage$MsgMfrStartWar | null | undefined;
    MsgMfrGetJoinedRoomIdArray?: $Json$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray | null | undefined;
    MsgMfrGetJoinableRoomIdArray?: $Json$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray | null | undefined;
    MsgMfrGetRoomStaticInfo?: $Json$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo | null | undefined;
    MsgMfrGetRoomPlayerInfo?: $Json$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo | null | undefined;
    MsgMfrInvite?: $Json$CommonProto$NetMessage$MsgMfrInvite | null | undefined;
    MsgMfrAddDummy?: $Json$CommonProto$NetMessage$MsgMfrAddDummy | null | undefined;
    MsgMfrSetDummySettings?: $Json$CommonProto$NetMessage$MsgMfrSetDummySettings | null | undefined;
    MsgCcrCreateRoom?: $Json$CommonProto$NetMessage$MsgCcrCreateRoom | null | undefined;
    MsgCcrExitRoom?: $Json$CommonProto$NetMessage$MsgCcrExitRoom | null | undefined;
    MsgCcrJoinRoom?: $Json$CommonProto$NetMessage$MsgCcrJoinRoom | null | undefined;
    MsgCcrDeleteRoom?: $Json$CommonProto$NetMessage$MsgCcrDeleteRoom | null | undefined;
    MsgCcrSetReady?: $Json$CommonProto$NetMessage$MsgCcrSetReady | null | undefined;
    MsgCcrDeletePlayer?: $Json$CommonProto$NetMessage$MsgCcrDeletePlayer | null | undefined;
    MsgCcrSetSelfSettings?: $Json$CommonProto$NetMessage$MsgCcrSetSelfSettings | null | undefined;
    MsgCcrStartWar?: $Json$CommonProto$NetMessage$MsgCcrStartWar | null | undefined;
    MsgCcrGetJoinedRoomIdArray?: $Json$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray | null | undefined;
    MsgCcrGetJoinableRoomIdArray?: $Json$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray | null | undefined;
    MsgCcrGetRoomStaticInfo?: $Json$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo | null | undefined;
    MsgCcrGetRoomPlayerInfo?: $Json$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo | null | undefined;
    MsgCcrInvite?: $Json$CommonProto$NetMessage$MsgCcrInvite | null | undefined;
    MsgCcrAddDummy?: $Json$CommonProto$NetMessage$MsgCcrAddDummy | null | undefined;
    MsgCcrSetDummySettings?: $Json$CommonProto$NetMessage$MsgCcrSetDummySettings | null | undefined;
    MsgLbSpmOverallGetTopDataArray?: $Json$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray | null | undefined;
    MsgLbSpmOverallGetRankInfo?: $Json$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo | null | undefined;
    MsgLbMrwGetRankIndex?: $Json$CommonProto$NetMessage$MsgLbMrwGetRankIndex | null | undefined;
    MsgMmrSetMaxConcurrentCount?: $Json$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount | null | undefined;
    MsgMmrGetMaxConcurrentCount?: $Json$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount | null | undefined;
    MsgMmrSetBannedNormalMapIdArray?: $Json$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray | null | undefined;
    MsgMmrGetBannedNormalMapIdArray?: $Json$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray | null | undefined;
    MsgMmrSetBootTimerDaysRange?: $Json$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange | null | undefined;
    MsgMmrGetBootTimerDaysRange?: $Json$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange | null | undefined;
    MsgMmrGetJoinedRoomIdArray?: $Json$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray | null | undefined;
    MsgMmrGetRoomPublicInfo?: $Json$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo | null | undefined;
    MsgMmrDeleteRoomByServer?: $Json$CommonProto$NetMessage$MsgMmrDeleteRoomByServer | null | undefined;
    MsgMmrSetBannedCoIdArray?: $Json$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray | null | undefined;
    MsgMmrSetSelfSettings?: $Json$CommonProto$NetMessage$MsgMmrSetSelfSettings | null | undefined;
    MsgNormalMapGetAllEnabledBriefDataVersions?: $Json$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions | null | undefined;
    MsgNormalMapGetBriefDataVersion?: $Json$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion | null | undefined;
    MsgNormalMapGetBriefData?: $Json$CommonProto$NetMessage$MsgNormalMapGetBriefData | null | undefined;
    MsgNormalMapGetBriefDataArray?: $Json$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray | null | undefined;
    MsgMapGetRawData?: $Json$CommonProto$NetMessage$MsgMapGetRawData | null | undefined;
    MsgMapGetMapTag?: $Json$CommonProto$NetMessage$MsgMapGetMapTag | null | undefined;
    MsgMailGetAllMailArray?: $Json$CommonProto$NetMessage$MsgMailGetAllMailArray | null | undefined;
    MsgMailGetMail?: $Json$CommonProto$NetMessage$MsgMailGetMail | null | undefined;
    MsgMailDeleteMail?: $Json$CommonProto$NetMessage$MsgMailDeleteMail | null | undefined;
    MsgMailSetIsNew?: $Json$CommonProto$NetMessage$MsgMailSetIsNew | null | undefined;
    MsgAtGetGlobalSettings?: $Json$CommonProto$NetMessage$MsgAtGetGlobalSettings | null | undefined;
    MsgAtSetGlobalSettings?: $Json$CommonProto$NetMessage$MsgAtSetGlobalSettings | null | undefined;
    MsgAtCreateTourney?: $Json$CommonProto$NetMessage$MsgAtCreateTourney | null | undefined;
    MsgAtDeleteLastTourney?: $Json$CommonProto$NetMessage$MsgAtDeleteLastTourney | null | undefined;
    MsgAtSetRegistrationDuration?: $Json$CommonProto$NetMessage$MsgAtSetRegistrationDuration | null | undefined;
    MsgAtSetAdjustmentDuration?: $Json$CommonProto$NetMessage$MsgAtSetAdjustmentDuration | null | undefined;
    MsgAtSetInitialBrackets?: $Json$CommonProto$NetMessage$MsgAtSetInitialBrackets | null | undefined;
    MsgAtSetMapPool?: $Json$CommonProto$NetMessage$MsgAtSetMapPool | null | undefined;
    MsgAtSetName?: $Json$CommonProto$NetMessage$MsgAtSetName | null | undefined;
    MsgAtSetBootTimer?: $Json$CommonProto$NetMessage$MsgAtSetBootTimer | null | undefined;
    MsgAtGetUserArray?: $Json$CommonProto$NetMessage$MsgAtGetUserArray | null | undefined;
    MsgAtDeleteUser?: $Json$CommonProto$NetMessage$MsgAtDeleteUser | null | undefined;
    MsgAtGetPhaseInfo?: $Json$CommonProto$NetMessage$MsgAtGetPhaseInfo | null | undefined;
    MsgAtGetRegistrationInfo?: $Json$CommonProto$NetMessage$MsgAtGetRegistrationInfo | null | undefined;
    MsgAtGetTourneyInfo?: $Json$CommonProto$NetMessage$MsgAtGetTourneyInfo | null | undefined;
    MsgAtGetFullMapInfo?: $Json$CommonProto$NetMessage$MsgAtGetFullMapInfo | null | undefined;
    MsgAtGetFullBracketInfo?: $Json$CommonProto$NetMessage$MsgAtGetFullBracketInfo | null | undefined;
    MsgAtRegister?: $Json$CommonProto$NetMessage$MsgAtRegister | null | undefined;
    MsgAtrGetJoinedRoomIdArray?: $Json$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray | null | undefined;
    MsgAtrGetRoomPublicInfo?: $Json$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo | null | undefined;
    MsgAtrDeleteRoomByServer?: $Json$CommonProto$NetMessage$MsgAtrDeleteRoomByServer | null | undefined;
    MsgAtrSetBannedCoIdArray?: $Json$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray | null | undefined;
    MsgAtrSetSelfSettings?: $Json$CommonProto$NetMessage$MsgAtrSetSelfSettings | null | undefined;
    MsgGmSetUserPrivilege?: $Json$CommonProto$NetMessage$MsgGmSetUserPrivilege | null | undefined;
    MsgGmSetUserPassword?: $Json$CommonProto$NetMessage$MsgGmSetUserPassword | null | undefined;
    MsgGmDeleteMcrRoom?: $Json$CommonProto$NetMessage$MsgGmDeleteMcrRoom | null | undefined;
    MsgGmDeleteMfrRoom?: $Json$CommonProto$NetMessage$MsgGmDeleteMfrRoom | null | undefined;
    MsgGmDeleteCcrRoom?: $Json$CommonProto$NetMessage$MsgGmDeleteCcrRoom | null | undefined;
    MsgGmDeleteMrrRoom?: $Json$CommonProto$NetMessage$MsgGmDeleteMrrRoom | null | undefined;
    MsgGmDeleteMmrRoom?: $Json$CommonProto$NetMessage$MsgGmDeleteMmrRoom | null | undefined;
    MsgGmDeleteSpmAllScoreAndReplay?: $Json$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay | null | undefined;
    MsgGmAddUserMedal?: $Json$CommonProto$NetMessage$MsgGmAddUserMedal | null | undefined;
    MsgGmGenerateReplayStatistics?: $Json$CommonProto$NetMessage$MsgGmGenerateReplayStatistics | null | undefined;
    MsgGmUpdateReplayInfo?: $Json$CommonProto$NetMessage$MsgGmUpdateReplayInfo | null | undefined;
    MsgCmGetAllCampaignIdArray?: $Json$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray | null | undefined;
    MsgCmGetDesigningCampaignIdArray?: $Json$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray | null | undefined;
    MsgCmCreateCampaign?: $Json$CommonProto$NetMessage$MsgCmCreateCampaign | null | undefined;
    MsgCmCreateCampaignMap?: $Json$CommonProto$NetMessage$MsgCmCreateCampaignMap | null | undefined;
    MsgCmSetCampaignName?: $Json$CommonProto$NetMessage$MsgCmSetCampaignName | null | undefined;
    MsgCmSetCampaignDesc?: $Json$CommonProto$NetMessage$MsgCmSetCampaignDesc | null | undefined;
    MsgCmSetCampaignEnabled?: $Json$CommonProto$NetMessage$MsgCmSetCampaignEnabled | null | undefined;
    MsgCmSetCampaignMapEnabled?: $Json$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled | null | undefined;
    MsgCmSetCampaignMapRawData?: $Json$CommonProto$NetMessage$MsgCmSetCampaignMapRawData | null | undefined;
    MsgCmSetCampaignMapExtraText?: $Json$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText | null | undefined;
    MsgCmSetCampaignMapName?: $Json$CommonProto$NetMessage$MsgCmSetCampaignMapName | null | undefined;
    MsgCmSetCampaignMapWarEventAction?: $Json$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction | null | undefined;
    MsgCmUpdateCampaignDesigners?: $Json$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners | null | undefined;
    MsgCmSetExtraLink?: $Json$CommonProto$NetMessage$MsgCmSetExtraLink | null | undefined;
    MsgCampaignGetCampaignInfo?: $Json$CommonProto$NetMessage$MsgCampaignGetCampaignInfo | null | undefined;
    MsgCampaignGetEnabledCampaignIdArray?: $Json$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray | null | undefined;
    MsgCampaignGetAllMapTimestampArray?: $Json$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray | null | undefined;
    MsgCampaignGetMapTimestamp?: $Json$CommonProto$NetMessage$MsgCampaignGetMapTimestamp | null | undefined;
    MsgCampaignGetMapRawDataArray?: $Json$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray | null | undefined;
    MsgCampaignGetMapRawData?: $Json$CommonProto$NetMessage$MsgCampaignGetMapRawData | null | undefined;
    MsgCampaignCreateWar?: $Json$CommonProto$NetMessage$MsgCampaignCreateWar | null | undefined;
    MsgCampaignSaveWar?: $Json$CommonProto$NetMessage$MsgCampaignSaveWar | null | undefined;
    MsgCampaignValidateWar?: $Json$CommonProto$NetMessage$MsgCampaignValidateWar | null | undefined;
    MsgCampaignGetCampaignLeaderboard?: $Json$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard | null | undefined;
    MsgCampaignGetCampaignMapLeaderboard?: $Json$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard | null | undefined;
    MsgCampaignGetScore?: $Json$CommonProto$NetMessage$MsgCampaignGetScore | null | undefined;
}

export class MessageContainer extends $ProtoSchemaBase {
    private _MsgCommonHeartbeat?: $Message$CommonProto$NetMessage$MsgCommonHeartbeat | null | undefined;
    private _MsgCommonError?: $Message$CommonProto$NetMessage$MsgCommonError | null | undefined;
    private _MsgCommonServerDisconnect?: $Message$CommonProto$NetMessage$MsgCommonServerDisconnect | null | undefined;
    private _MsgCommonLatestConfigVersion?: $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion | null | undefined;
    private _MsgCommonGetServerStatus?: $Message$CommonProto$NetMessage$MsgCommonGetServerStatus | null | undefined;
    private _MsgCommonGetRankList?: $Message$CommonProto$NetMessage$MsgCommonGetRankList | null | undefined;
    private _MsgCommonGetCoStatistics?: $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics | null | undefined;
    private _MsgUserRegister?: $Message$CommonProto$NetMessage$MsgUserRegister | null | undefined;
    private _MsgUserLogin?: $Message$CommonProto$NetMessage$MsgUserLogin | null | undefined;
    private _MsgUserLogout?: $Message$CommonProto$NetMessage$MsgUserLogout | null | undefined;
    private _MsgUserGetPublicInfo?: $Message$CommonProto$NetMessage$MsgUserGetPublicInfo | null | undefined;
    private _MsgUserGetPublicInfoArray?: $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray | null | undefined;
    private _MsgUserGetBriefInfo?: $Message$CommonProto$NetMessage$MsgUserGetBriefInfo | null | undefined;
    private _MsgUserGetOnlineState?: $Message$CommonProto$NetMessage$MsgUserGetOnlineState | null | undefined;
    private _MsgUserGetOnlineUserIdArray?: $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray | null | undefined;
    private _MsgUserSetNickname?: $Message$CommonProto$NetMessage$MsgUserSetNickname | null | undefined;
    private _MsgUserSetDiscordInfo?: $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo | null | undefined;
    private _MsgUserSetCoBgmSettings?: $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings | null | undefined;
    private _MsgUserSetSceneBgmSettings?: $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings | null | undefined;
    private _MsgUserSetPassword?: $Message$CommonProto$NetMessage$MsgUserSetPassword | null | undefined;
    private _MsgUserSetSettings?: $Message$CommonProto$NetMessage$MsgUserSetSettings | null | undefined;
    private _MsgUserSetMapRating?: $Message$CommonProto$NetMessage$MsgUserSetMapRating | null | undefined;
    private _MsgUserSetAvatarId?: $Message$CommonProto$NetMessage$MsgUserSetAvatarId | null | undefined;
    private _MsgUserSetMapEditorAutoSaveTime?: $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime | null | undefined;
    private _MsgUserLoginAsGuest?: $Message$CommonProto$NetMessage$MsgUserLoginAsGuest | null | undefined;
    private _MsgUserGetUsersByNickname?: $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname | null | undefined;
    private _MsgUserSetRelation?: $Message$CommonProto$NetMessage$MsgUserSetRelation | null | undefined;
    private _MsgUserSetShowMedalIdArray?: $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray | null | undefined;
    private _MsgUserModifyFavoriteReplayIdArray?: $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray | null | undefined;
    private _MsgUserRequestEmailVerificationCode?: $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode | null | undefined;
    private _MsgUserVerifyEmail?: $Message$CommonProto$NetMessage$MsgUserVerifyEmail | null | undefined;
    private _MsgUserRequestPasswordVerificationCode?: $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode | null | undefined;
    private _MsgUserResetPasswordWithEmail?: $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail | null | undefined;
    private _MsgMeGetAllMapDataTimestamps?: $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps | null | undefined;
    private _MsgMeGetMapDataTimestamp?: $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp | null | undefined;
    private _MsgMeGetMapDataArray?: $Message$CommonProto$NetMessage$MsgMeGetMapDataArray | null | undefined;
    private _MsgMeGetMapData?: $Message$CommonProto$NetMessage$MsgMeGetMapData | null | undefined;
    private _MsgMeSubmitNormalMap?: $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap | null | undefined;
    private _MsgMeDeleteSlot?: $Message$CommonProto$NetMessage$MsgMeDeleteSlot | null | undefined;
    private _MsgChatAddMessage?: $Message$CommonProto$NetMessage$MsgChatAddMessage | null | undefined;
    private _MsgChatGetAllMessages?: $Message$CommonProto$NetMessage$MsgChatGetAllMessages | null | undefined;
    private _MsgChatUpdateReadProgress?: $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress | null | undefined;
    private _MsgChatGetAllReadProgressList?: $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList | null | undefined;
    private _MsgChatDeleteMessage?: $Message$CommonProto$NetMessage$MsgChatDeleteMessage | null | undefined;
    private _MsgMmSetWarRuleAvailability?: $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability | null | undefined;
    private _MsgMmSetMapEnabled?: $Message$CommonProto$NetMessage$MsgMmSetMapEnabled | null | undefined;
    private _MsgMmGetReviewingMaps?: $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps | null | undefined;
    private _MsgMmReviewMap?: $Message$CommonProto$NetMessage$MsgMmReviewMap | null | undefined;
    private _MsgMmSetMapTagIdFlags?: $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags | null | undefined;
    private _MsgMmSetMapName?: $Message$CommonProto$NetMessage$MsgMmSetMapName | null | undefined;
    private _MsgMmAddWarRule?: $Message$CommonProto$NetMessage$MsgMmAddWarRule | null | undefined;
    private _MsgMmAddWarEvent?: $Message$CommonProto$NetMessage$MsgMmAddWarEvent | null | undefined;
    private _MsgMmDeleteWarRule?: $Message$CommonProto$NetMessage$MsgMmDeleteWarRule | null | undefined;
    private _MsgMmDeleteRedundantWarEvent?: $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent | null | undefined;
    private _MsgMmSetWarRuleName?: $Message$CommonProto$NetMessage$MsgMmSetWarRuleName | null | undefined;
    private _MsgMmSetWarRuleFixedTileTheme?: $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme | null | undefined;
    private _MsgMmSetMapTagSingleData?: $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData | null | undefined;
    private _MsgMmSubmitMapSimpleDialogue?: $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue | null | undefined;
    private _MsgMmAddIgnoredReviewingMap?: $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap | null | undefined;
    private _MsgReplaySetSelfRating?: $Message$CommonProto$NetMessage$MsgReplaySetSelfRating | null | undefined;
    private _MsgReplayGetSelfRating?: $Message$CommonProto$NetMessage$MsgReplayGetSelfRating | null | undefined;
    private _MsgReplayGetData?: $Message$CommonProto$NetMessage$MsgReplayGetData | null | undefined;
    private _MsgReplayGetReplayInfo?: $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo | null | undefined;
    private _MsgReplayGetReplayInfoArray?: $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray | null | undefined;
    private _MsgReplayGetAllInfoVersions?: $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions | null | undefined;
    private _MsgReplayGetInfoVersion?: $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion | null | undefined;
    private _MsgMcrCreateRoom?: $Message$CommonProto$NetMessage$MsgMcrCreateRoom | null | undefined;
    private _MsgMcrExitRoom?: $Message$CommonProto$NetMessage$MsgMcrExitRoom | null | undefined;
    private _MsgMcrJoinRoom?: $Message$CommonProto$NetMessage$MsgMcrJoinRoom | null | undefined;
    private _MsgMcrDeleteRoom?: $Message$CommonProto$NetMessage$MsgMcrDeleteRoom | null | undefined;
    private _MsgMcrSetReady?: $Message$CommonProto$NetMessage$MsgMcrSetReady | null | undefined;
    private _MsgMcrDeletePlayer?: $Message$CommonProto$NetMessage$MsgMcrDeletePlayer | null | undefined;
    private _MsgMcrSetSelfSettings?: $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings | null | undefined;
    private _MsgMcrStartWar?: $Message$CommonProto$NetMessage$MsgMcrStartWar | null | undefined;
    private _MsgMcrGetJoinedRoomIdArray?: $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray | null | undefined;
    private _MsgMcrGetJoinableRoomIdArray?: $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray | null | undefined;
    private _MsgMcrGetRoomStaticInfo?: $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo | null | undefined;
    private _MsgMcrGetRoomPlayerInfo?: $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo | null | undefined;
    private _MsgMcrInvite?: $Message$CommonProto$NetMessage$MsgMcrInvite | null | undefined;
    private _MsgMcrAddDummy?: $Message$CommonProto$NetMessage$MsgMcrAddDummy | null | undefined;
    private _MsgMcrSetDummySettings?: $Message$CommonProto$NetMessage$MsgMcrSetDummySettings | null | undefined;
    private _MsgMpwCommonGetJoinedMpwIdArray?: $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray | null | undefined;
    private _MsgMpwCommonGetWarTimestamp?: $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp | null | undefined;
    private _MsgMpwCommonGetUnitStatistics?: $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics | null | undefined;
    private _MsgMpwCommonContinueWar?: $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar | null | undefined;
    private _MsgMpwCommonSyncWar?: $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar | null | undefined;
    private _MsgMpwCommonHandleBoot?: $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot | null | undefined;
    private _MsgMpwCommonBroadcastGameStart?: $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart | null | undefined;
    private _MsgMpwCommonGetWarSettings?: $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings | null | undefined;
    private _MsgMpwCommonGetWarProgressInfo?: $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo | null | undefined;
    private _MsgMpwCommonMarkGrid?: $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid | null | undefined;
    private _MsgMpwCommonSetHiddenGridMarkTypeIdList?: $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList | null | undefined;
    private _MsgMpwCommonSetGridMarkList?: $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList | null | undefined;
    private _MsgMpwCommonGetHalfwayReplayData?: $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData | null | undefined;
    private _MsgMpwWatchMakeRequest?: $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest | null | undefined;
    private _MsgMpwWatchHandleRequest?: $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest | null | undefined;
    private _MsgMpwWatchDeleteWatcher?: $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher | null | undefined;
    private _MsgMpwWatchGetRequestableWarIdArray?: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray | null | undefined;
    private _MsgMpwWatchGetOngoingWarIdArray?: $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray | null | undefined;
    private _MsgMpwWatchGetRequestedWarIdArray?: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray | null | undefined;
    private _MsgMpwWatchGetWatchedWarIdArray?: $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray | null | undefined;
    private _MsgMpwWatchContinueWar?: $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar | null | undefined;
    private _MsgMpwWatchGetIncomingInfo?: $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo | null | undefined;
    private _MsgMpwWatchGetOutgoingInfo?: $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo | null | undefined;
    private _MsgMpwExecuteWarOperation?: $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation | null | undefined;
    private _MsgSpmCreateScw?: $Message$CommonProto$NetMessage$MsgSpmCreateScw | null | undefined;
    private _MsgSpmCreateSfw?: $Message$CommonProto$NetMessage$MsgSpmCreateSfw | null | undefined;
    private _MsgSpmCreateSrw?: $Message$CommonProto$NetMessage$MsgSpmCreateSrw | null | undefined;
    private _MsgSpmGetAllWarSaveSlotTimestamps?: $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps | null | undefined;
    private _MsgSpmGetWarSaveSlotFullData?: $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData | null | undefined;
    private _MsgSpmGetWarSaveSlotFullDataArray?: $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray | null | undefined;
    private _MsgSpmDeleteWarSaveSlot?: $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot | null | undefined;
    private _MsgSpmSaveScw?: $Message$CommonProto$NetMessage$MsgSpmSaveScw | null | undefined;
    private _MsgSpmSaveSfw?: $Message$CommonProto$NetMessage$MsgSpmSaveSfw | null | undefined;
    private _MsgSpmSaveSrw?: $Message$CommonProto$NetMessage$MsgSpmSaveSrw | null | undefined;
    private _MsgSpmValidateSrw?: $Message$CommonProto$NetMessage$MsgSpmValidateSrw | null | undefined;
    private _MsgSpmGetRankList?: $Message$CommonProto$NetMessage$MsgSpmGetRankList | null | undefined;
    private _MsgSpmGetReplayData?: $Message$CommonProto$NetMessage$MsgSpmGetReplayData | null | undefined;
    private _MsgMrrSetMaxConcurrentCount?: $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount | null | undefined;
    private _MsgMrrGetMaxConcurrentCount?: $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount | null | undefined;
    private _MsgMrrSetBannedNormalMapIdArray?: $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray | null | undefined;
    private _MsgMrrGetBannedNormalMapIdArray?: $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray | null | undefined;
    private _MsgMrrSetBootTimerDaysRange?: $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange | null | undefined;
    private _MsgMrrGetBootTimerDaysRange?: $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange | null | undefined;
    private _MsgMrrGetJoinedRoomIdArray?: $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray | null | undefined;
    private _MsgMrrGetRoomPublicInfo?: $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo | null | undefined;
    private _MsgMrrDeleteRoomByServer?: $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer | null | undefined;
    private _MsgMrrSetBannedCoIdArray?: $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray | null | undefined;
    private _MsgMrrSetSelfSettings?: $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings | null | undefined;
    private _MsgBroadcastGetAllMessageIdArray?: $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray | null | undefined;
    private _MsgBroadcastAddMessage?: $Message$CommonProto$NetMessage$MsgBroadcastAddMessage | null | undefined;
    private _MsgBroadcastDeleteMessage?: $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage | null | undefined;
    private _MsgBroadcastDoBroadcast?: $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast | null | undefined;
    private _MsgBroadcastGetMessageData?: $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData | null | undefined;
    private _MsgChangeLogGetMessageList?: $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList | null | undefined;
    private _MsgChangeLogAddMessage?: $Message$CommonProto$NetMessage$MsgChangeLogAddMessage | null | undefined;
    private _MsgChangeLogModifyMessage?: $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage | null | undefined;
    private _MsgMfrCreateRoom?: $Message$CommonProto$NetMessage$MsgMfrCreateRoom | null | undefined;
    private _MsgMfrExitRoom?: $Message$CommonProto$NetMessage$MsgMfrExitRoom | null | undefined;
    private _MsgMfrJoinRoom?: $Message$CommonProto$NetMessage$MsgMfrJoinRoom | null | undefined;
    private _MsgMfrDeleteRoom?: $Message$CommonProto$NetMessage$MsgMfrDeleteRoom | null | undefined;
    private _MsgMfrSetReady?: $Message$CommonProto$NetMessage$MsgMfrSetReady | null | undefined;
    private _MsgMfrDeletePlayer?: $Message$CommonProto$NetMessage$MsgMfrDeletePlayer | null | undefined;
    private _MsgMfrSetSelfSettings?: $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings | null | undefined;
    private _MsgMfrStartWar?: $Message$CommonProto$NetMessage$MsgMfrStartWar | null | undefined;
    private _MsgMfrGetJoinedRoomIdArray?: $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray | null | undefined;
    private _MsgMfrGetJoinableRoomIdArray?: $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray | null | undefined;
    private _MsgMfrGetRoomStaticInfo?: $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo | null | undefined;
    private _MsgMfrGetRoomPlayerInfo?: $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo | null | undefined;
    private _MsgMfrInvite?: $Message$CommonProto$NetMessage$MsgMfrInvite | null | undefined;
    private _MsgMfrAddDummy?: $Message$CommonProto$NetMessage$MsgMfrAddDummy | null | undefined;
    private _MsgMfrSetDummySettings?: $Message$CommonProto$NetMessage$MsgMfrSetDummySettings | null | undefined;
    private _MsgCcrCreateRoom?: $Message$CommonProto$NetMessage$MsgCcrCreateRoom | null | undefined;
    private _MsgCcrExitRoom?: $Message$CommonProto$NetMessage$MsgCcrExitRoom | null | undefined;
    private _MsgCcrJoinRoom?: $Message$CommonProto$NetMessage$MsgCcrJoinRoom | null | undefined;
    private _MsgCcrDeleteRoom?: $Message$CommonProto$NetMessage$MsgCcrDeleteRoom | null | undefined;
    private _MsgCcrSetReady?: $Message$CommonProto$NetMessage$MsgCcrSetReady | null | undefined;
    private _MsgCcrDeletePlayer?: $Message$CommonProto$NetMessage$MsgCcrDeletePlayer | null | undefined;
    private _MsgCcrSetSelfSettings?: $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings | null | undefined;
    private _MsgCcrStartWar?: $Message$CommonProto$NetMessage$MsgCcrStartWar | null | undefined;
    private _MsgCcrGetJoinedRoomIdArray?: $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray | null | undefined;
    private _MsgCcrGetJoinableRoomIdArray?: $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray | null | undefined;
    private _MsgCcrGetRoomStaticInfo?: $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo | null | undefined;
    private _MsgCcrGetRoomPlayerInfo?: $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo | null | undefined;
    private _MsgCcrInvite?: $Message$CommonProto$NetMessage$MsgCcrInvite | null | undefined;
    private _MsgCcrAddDummy?: $Message$CommonProto$NetMessage$MsgCcrAddDummy | null | undefined;
    private _MsgCcrSetDummySettings?: $Message$CommonProto$NetMessage$MsgCcrSetDummySettings | null | undefined;
    private _MsgLbSpmOverallGetTopDataArray?: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray | null | undefined;
    private _MsgLbSpmOverallGetRankInfo?: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo | null | undefined;
    private _MsgLbMrwGetRankIndex?: $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex | null | undefined;
    private _MsgMmrSetMaxConcurrentCount?: $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount | null | undefined;
    private _MsgMmrGetMaxConcurrentCount?: $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount | null | undefined;
    private _MsgMmrSetBannedNormalMapIdArray?: $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray | null | undefined;
    private _MsgMmrGetBannedNormalMapIdArray?: $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray | null | undefined;
    private _MsgMmrSetBootTimerDaysRange?: $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange | null | undefined;
    private _MsgMmrGetBootTimerDaysRange?: $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange | null | undefined;
    private _MsgMmrGetJoinedRoomIdArray?: $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray | null | undefined;
    private _MsgMmrGetRoomPublicInfo?: $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo | null | undefined;
    private _MsgMmrDeleteRoomByServer?: $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer | null | undefined;
    private _MsgMmrSetBannedCoIdArray?: $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray | null | undefined;
    private _MsgMmrSetSelfSettings?: $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings | null | undefined;
    private _MsgNormalMapGetAllEnabledBriefDataVersions?: $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions | null | undefined;
    private _MsgNormalMapGetBriefDataVersion?: $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion | null | undefined;
    private _MsgNormalMapGetBriefData?: $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData | null | undefined;
    private _MsgNormalMapGetBriefDataArray?: $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray | null | undefined;
    private _MsgMapGetRawData?: $Message$CommonProto$NetMessage$MsgMapGetRawData | null | undefined;
    private _MsgMapGetMapTag?: $Message$CommonProto$NetMessage$MsgMapGetMapTag | null | undefined;
    private _MsgMailGetAllMailArray?: $Message$CommonProto$NetMessage$MsgMailGetAllMailArray | null | undefined;
    private _MsgMailGetMail?: $Message$CommonProto$NetMessage$MsgMailGetMail | null | undefined;
    private _MsgMailDeleteMail?: $Message$CommonProto$NetMessage$MsgMailDeleteMail | null | undefined;
    private _MsgMailSetIsNew?: $Message$CommonProto$NetMessage$MsgMailSetIsNew | null | undefined;
    private _MsgAtGetGlobalSettings?: $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings | null | undefined;
    private _MsgAtSetGlobalSettings?: $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings | null | undefined;
    private _MsgAtCreateTourney?: $Message$CommonProto$NetMessage$MsgAtCreateTourney | null | undefined;
    private _MsgAtDeleteLastTourney?: $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney | null | undefined;
    private _MsgAtSetRegistrationDuration?: $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration | null | undefined;
    private _MsgAtSetAdjustmentDuration?: $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration | null | undefined;
    private _MsgAtSetInitialBrackets?: $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets | null | undefined;
    private _MsgAtSetMapPool?: $Message$CommonProto$NetMessage$MsgAtSetMapPool | null | undefined;
    private _MsgAtSetName?: $Message$CommonProto$NetMessage$MsgAtSetName | null | undefined;
    private _MsgAtSetBootTimer?: $Message$CommonProto$NetMessage$MsgAtSetBootTimer | null | undefined;
    private _MsgAtGetUserArray?: $Message$CommonProto$NetMessage$MsgAtGetUserArray | null | undefined;
    private _MsgAtDeleteUser?: $Message$CommonProto$NetMessage$MsgAtDeleteUser | null | undefined;
    private _MsgAtGetPhaseInfo?: $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo | null | undefined;
    private _MsgAtGetRegistrationInfo?: $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo | null | undefined;
    private _MsgAtGetTourneyInfo?: $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo | null | undefined;
    private _MsgAtGetFullMapInfo?: $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo | null | undefined;
    private _MsgAtGetFullBracketInfo?: $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo | null | undefined;
    private _MsgAtRegister?: $Message$CommonProto$NetMessage$MsgAtRegister | null | undefined;
    private _MsgAtrGetJoinedRoomIdArray?: $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray | null | undefined;
    private _MsgAtrGetRoomPublicInfo?: $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo | null | undefined;
    private _MsgAtrDeleteRoomByServer?: $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer | null | undefined;
    private _MsgAtrSetBannedCoIdArray?: $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray | null | undefined;
    private _MsgAtrSetSelfSettings?: $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings | null | undefined;
    private _MsgGmSetUserPrivilege?: $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege | null | undefined;
    private _MsgGmSetUserPassword?: $Message$CommonProto$NetMessage$MsgGmSetUserPassword | null | undefined;
    private _MsgGmDeleteMcrRoom?: $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom | null | undefined;
    private _MsgGmDeleteMfrRoom?: $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom | null | undefined;
    private _MsgGmDeleteCcrRoom?: $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom | null | undefined;
    private _MsgGmDeleteMrrRoom?: $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom | null | undefined;
    private _MsgGmDeleteMmrRoom?: $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom | null | undefined;
    private _MsgGmDeleteSpmAllScoreAndReplay?: $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay | null | undefined;
    private _MsgGmAddUserMedal?: $Message$CommonProto$NetMessage$MsgGmAddUserMedal | null | undefined;
    private _MsgGmGenerateReplayStatistics?: $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics | null | undefined;
    private _MsgGmUpdateReplayInfo?: $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo | null | undefined;
    private _MsgCmGetAllCampaignIdArray?: $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray | null | undefined;
    private _MsgCmGetDesigningCampaignIdArray?: $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray | null | undefined;
    private _MsgCmCreateCampaign?: $Message$CommonProto$NetMessage$MsgCmCreateCampaign | null | undefined;
    private _MsgCmCreateCampaignMap?: $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap | null | undefined;
    private _MsgCmSetCampaignName?: $Message$CommonProto$NetMessage$MsgCmSetCampaignName | null | undefined;
    private _MsgCmSetCampaignDesc?: $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc | null | undefined;
    private _MsgCmSetCampaignEnabled?: $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled | null | undefined;
    private _MsgCmSetCampaignMapEnabled?: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled | null | undefined;
    private _MsgCmSetCampaignMapRawData?: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData | null | undefined;
    private _MsgCmSetCampaignMapExtraText?: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText | null | undefined;
    private _MsgCmSetCampaignMapName?: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName | null | undefined;
    private _MsgCmSetCampaignMapWarEventAction?: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction | null | undefined;
    private _MsgCmUpdateCampaignDesigners?: $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners | null | undefined;
    private _MsgCmSetExtraLink?: $Message$CommonProto$NetMessage$MsgCmSetExtraLink | null | undefined;
    private _MsgCampaignGetCampaignInfo?: $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo | null | undefined;
    private _MsgCampaignGetEnabledCampaignIdArray?: $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray | null | undefined;
    private _MsgCampaignGetAllMapTimestampArray?: $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray | null | undefined;
    private _MsgCampaignGetMapTimestamp?: $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp | null | undefined;
    private _MsgCampaignGetMapRawDataArray?: $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray | null | undefined;
    private _MsgCampaignGetMapRawData?: $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData | null | undefined;
    private _MsgCampaignCreateWar?: $Message$CommonProto$NetMessage$MsgCampaignCreateWar | null | undefined;
    private _MsgCampaignSaveWar?: $Message$CommonProto$NetMessage$MsgCampaignSaveWar | null | undefined;
    private _MsgCampaignValidateWar?: $Message$CommonProto$NetMessage$MsgCampaignValidateWar | null | undefined;
    private _MsgCampaignGetCampaignLeaderboard?: $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard | null | undefined;
    private _MsgCampaignGetCampaignMapLeaderboard?: $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard | null | undefined;
    private _MsgCampaignGetScore?: $Message$CommonProto$NetMessage$MsgCampaignGetScore | null | undefined;

    public static fromJson(obj: MessageContainerJson): MessageContainer {
        return new MessageContainer().loadJson(obj);
    }
    public override loadJson(obj: MessageContainerJson): this {
        this.setMsgCommonHeartbeat(obj.MsgCommonHeartbeat != null ? $Message$CommonProto$NetMessage$MsgCommonHeartbeat.fromJson(obj.MsgCommonHeartbeat) : null);
        this.setMsgCommonError(obj.MsgCommonError != null ? $Message$CommonProto$NetMessage$MsgCommonError.fromJson(obj.MsgCommonError) : null);
        this.setMsgCommonServerDisconnect(obj.MsgCommonServerDisconnect != null ? $Message$CommonProto$NetMessage$MsgCommonServerDisconnect.fromJson(obj.MsgCommonServerDisconnect) : null);
        this.setMsgCommonLatestConfigVersion(obj.MsgCommonLatestConfigVersion != null ? $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion.fromJson(obj.MsgCommonLatestConfigVersion) : null);
        this.setMsgCommonGetServerStatus(obj.MsgCommonGetServerStatus != null ? $Message$CommonProto$NetMessage$MsgCommonGetServerStatus.fromJson(obj.MsgCommonGetServerStatus) : null);
        this.setMsgCommonGetRankList(obj.MsgCommonGetRankList != null ? $Message$CommonProto$NetMessage$MsgCommonGetRankList.fromJson(obj.MsgCommonGetRankList) : null);
        this.setMsgCommonGetCoStatistics(obj.MsgCommonGetCoStatistics != null ? $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics.fromJson(obj.MsgCommonGetCoStatistics) : null);
        this.setMsgUserRegister(obj.MsgUserRegister != null ? $Message$CommonProto$NetMessage$MsgUserRegister.fromJson(obj.MsgUserRegister) : null);
        this.setMsgUserLogin(obj.MsgUserLogin != null ? $Message$CommonProto$NetMessage$MsgUserLogin.fromJson(obj.MsgUserLogin) : null);
        this.setMsgUserLogout(obj.MsgUserLogout != null ? $Message$CommonProto$NetMessage$MsgUserLogout.fromJson(obj.MsgUserLogout) : null);
        this.setMsgUserGetPublicInfo(obj.MsgUserGetPublicInfo != null ? $Message$CommonProto$NetMessage$MsgUserGetPublicInfo.fromJson(obj.MsgUserGetPublicInfo) : null);
        this.setMsgUserGetPublicInfoArray(obj.MsgUserGetPublicInfoArray != null ? $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray.fromJson(obj.MsgUserGetPublicInfoArray) : null);
        this.setMsgUserGetBriefInfo(obj.MsgUserGetBriefInfo != null ? $Message$CommonProto$NetMessage$MsgUserGetBriefInfo.fromJson(obj.MsgUserGetBriefInfo) : null);
        this.setMsgUserGetOnlineState(obj.MsgUserGetOnlineState != null ? $Message$CommonProto$NetMessage$MsgUserGetOnlineState.fromJson(obj.MsgUserGetOnlineState) : null);
        this.setMsgUserGetOnlineUserIdArray(obj.MsgUserGetOnlineUserIdArray != null ? $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray.fromJson(obj.MsgUserGetOnlineUserIdArray) : null);
        this.setMsgUserSetNickname(obj.MsgUserSetNickname != null ? $Message$CommonProto$NetMessage$MsgUserSetNickname.fromJson(obj.MsgUserSetNickname) : null);
        this.setMsgUserSetDiscordInfo(obj.MsgUserSetDiscordInfo != null ? $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo.fromJson(obj.MsgUserSetDiscordInfo) : null);
        this.setMsgUserSetCoBgmSettings(obj.MsgUserSetCoBgmSettings != null ? $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings.fromJson(obj.MsgUserSetCoBgmSettings) : null);
        this.setMsgUserSetSceneBgmSettings(obj.MsgUserSetSceneBgmSettings != null ? $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings.fromJson(obj.MsgUserSetSceneBgmSettings) : null);
        this.setMsgUserSetPassword(obj.MsgUserSetPassword != null ? $Message$CommonProto$NetMessage$MsgUserSetPassword.fromJson(obj.MsgUserSetPassword) : null);
        this.setMsgUserSetSettings(obj.MsgUserSetSettings != null ? $Message$CommonProto$NetMessage$MsgUserSetSettings.fromJson(obj.MsgUserSetSettings) : null);
        this.setMsgUserSetMapRating(obj.MsgUserSetMapRating != null ? $Message$CommonProto$NetMessage$MsgUserSetMapRating.fromJson(obj.MsgUserSetMapRating) : null);
        this.setMsgUserSetAvatarId(obj.MsgUserSetAvatarId != null ? $Message$CommonProto$NetMessage$MsgUserSetAvatarId.fromJson(obj.MsgUserSetAvatarId) : null);
        this.setMsgUserSetMapEditorAutoSaveTime(obj.MsgUserSetMapEditorAutoSaveTime != null ? $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime.fromJson(obj.MsgUserSetMapEditorAutoSaveTime) : null);
        this.setMsgUserLoginAsGuest(obj.MsgUserLoginAsGuest != null ? $Message$CommonProto$NetMessage$MsgUserLoginAsGuest.fromJson(obj.MsgUserLoginAsGuest) : null);
        this.setMsgUserGetUsersByNickname(obj.MsgUserGetUsersByNickname != null ? $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname.fromJson(obj.MsgUserGetUsersByNickname) : null);
        this.setMsgUserSetRelation(obj.MsgUserSetRelation != null ? $Message$CommonProto$NetMessage$MsgUserSetRelation.fromJson(obj.MsgUserSetRelation) : null);
        this.setMsgUserSetShowMedalIdArray(obj.MsgUserSetShowMedalIdArray != null ? $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray.fromJson(obj.MsgUserSetShowMedalIdArray) : null);
        this.setMsgUserModifyFavoriteReplayIdArray(obj.MsgUserModifyFavoriteReplayIdArray != null ? $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray.fromJson(obj.MsgUserModifyFavoriteReplayIdArray) : null);
        this.setMsgUserRequestEmailVerificationCode(obj.MsgUserRequestEmailVerificationCode != null ? $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode.fromJson(obj.MsgUserRequestEmailVerificationCode) : null);
        this.setMsgUserVerifyEmail(obj.MsgUserVerifyEmail != null ? $Message$CommonProto$NetMessage$MsgUserVerifyEmail.fromJson(obj.MsgUserVerifyEmail) : null);
        this.setMsgUserRequestPasswordVerificationCode(obj.MsgUserRequestPasswordVerificationCode != null ? $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode.fromJson(obj.MsgUserRequestPasswordVerificationCode) : null);
        this.setMsgUserResetPasswordWithEmail(obj.MsgUserResetPasswordWithEmail != null ? $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail.fromJson(obj.MsgUserResetPasswordWithEmail) : null);
        this.setMsgMeGetAllMapDataTimestamps(obj.MsgMeGetAllMapDataTimestamps != null ? $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps.fromJson(obj.MsgMeGetAllMapDataTimestamps) : null);
        this.setMsgMeGetMapDataTimestamp(obj.MsgMeGetMapDataTimestamp != null ? $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp.fromJson(obj.MsgMeGetMapDataTimestamp) : null);
        this.setMsgMeGetMapDataArray(obj.MsgMeGetMapDataArray != null ? $Message$CommonProto$NetMessage$MsgMeGetMapDataArray.fromJson(obj.MsgMeGetMapDataArray) : null);
        this.setMsgMeGetMapData(obj.MsgMeGetMapData != null ? $Message$CommonProto$NetMessage$MsgMeGetMapData.fromJson(obj.MsgMeGetMapData) : null);
        this.setMsgMeSubmitNormalMap(obj.MsgMeSubmitNormalMap != null ? $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap.fromJson(obj.MsgMeSubmitNormalMap) : null);
        this.setMsgMeDeleteSlot(obj.MsgMeDeleteSlot != null ? $Message$CommonProto$NetMessage$MsgMeDeleteSlot.fromJson(obj.MsgMeDeleteSlot) : null);
        this.setMsgChatAddMessage(obj.MsgChatAddMessage != null ? $Message$CommonProto$NetMessage$MsgChatAddMessage.fromJson(obj.MsgChatAddMessage) : null);
        this.setMsgChatGetAllMessages(obj.MsgChatGetAllMessages != null ? $Message$CommonProto$NetMessage$MsgChatGetAllMessages.fromJson(obj.MsgChatGetAllMessages) : null);
        this.setMsgChatUpdateReadProgress(obj.MsgChatUpdateReadProgress != null ? $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress.fromJson(obj.MsgChatUpdateReadProgress) : null);
        this.setMsgChatGetAllReadProgressList(obj.MsgChatGetAllReadProgressList != null ? $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList.fromJson(obj.MsgChatGetAllReadProgressList) : null);
        this.setMsgChatDeleteMessage(obj.MsgChatDeleteMessage != null ? $Message$CommonProto$NetMessage$MsgChatDeleteMessage.fromJson(obj.MsgChatDeleteMessage) : null);
        this.setMsgMmSetWarRuleAvailability(obj.MsgMmSetWarRuleAvailability != null ? $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability.fromJson(obj.MsgMmSetWarRuleAvailability) : null);
        this.setMsgMmSetMapEnabled(obj.MsgMmSetMapEnabled != null ? $Message$CommonProto$NetMessage$MsgMmSetMapEnabled.fromJson(obj.MsgMmSetMapEnabled) : null);
        this.setMsgMmGetReviewingMaps(obj.MsgMmGetReviewingMaps != null ? $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps.fromJson(obj.MsgMmGetReviewingMaps) : null);
        this.setMsgMmReviewMap(obj.MsgMmReviewMap != null ? $Message$CommonProto$NetMessage$MsgMmReviewMap.fromJson(obj.MsgMmReviewMap) : null);
        this.setMsgMmSetMapTagIdFlags(obj.MsgMmSetMapTagIdFlags != null ? $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags.fromJson(obj.MsgMmSetMapTagIdFlags) : null);
        this.setMsgMmSetMapName(obj.MsgMmSetMapName != null ? $Message$CommonProto$NetMessage$MsgMmSetMapName.fromJson(obj.MsgMmSetMapName) : null);
        this.setMsgMmAddWarRule(obj.MsgMmAddWarRule != null ? $Message$CommonProto$NetMessage$MsgMmAddWarRule.fromJson(obj.MsgMmAddWarRule) : null);
        this.setMsgMmAddWarEvent(obj.MsgMmAddWarEvent != null ? $Message$CommonProto$NetMessage$MsgMmAddWarEvent.fromJson(obj.MsgMmAddWarEvent) : null);
        this.setMsgMmDeleteWarRule(obj.MsgMmDeleteWarRule != null ? $Message$CommonProto$NetMessage$MsgMmDeleteWarRule.fromJson(obj.MsgMmDeleteWarRule) : null);
        this.setMsgMmDeleteRedundantWarEvent(obj.MsgMmDeleteRedundantWarEvent != null ? $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent.fromJson(obj.MsgMmDeleteRedundantWarEvent) : null);
        this.setMsgMmSetWarRuleName(obj.MsgMmSetWarRuleName != null ? $Message$CommonProto$NetMessage$MsgMmSetWarRuleName.fromJson(obj.MsgMmSetWarRuleName) : null);
        this.setMsgMmSetWarRuleFixedTileTheme(obj.MsgMmSetWarRuleFixedTileTheme != null ? $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme.fromJson(obj.MsgMmSetWarRuleFixedTileTheme) : null);
        this.setMsgMmSetMapTagSingleData(obj.MsgMmSetMapTagSingleData != null ? $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData.fromJson(obj.MsgMmSetMapTagSingleData) : null);
        this.setMsgMmSubmitMapSimpleDialogue(obj.MsgMmSubmitMapSimpleDialogue != null ? $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue.fromJson(obj.MsgMmSubmitMapSimpleDialogue) : null);
        this.setMsgMmAddIgnoredReviewingMap(obj.MsgMmAddIgnoredReviewingMap != null ? $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap.fromJson(obj.MsgMmAddIgnoredReviewingMap) : null);
        this.setMsgReplaySetSelfRating(obj.MsgReplaySetSelfRating != null ? $Message$CommonProto$NetMessage$MsgReplaySetSelfRating.fromJson(obj.MsgReplaySetSelfRating) : null);
        this.setMsgReplayGetSelfRating(obj.MsgReplayGetSelfRating != null ? $Message$CommonProto$NetMessage$MsgReplayGetSelfRating.fromJson(obj.MsgReplayGetSelfRating) : null);
        this.setMsgReplayGetData(obj.MsgReplayGetData != null ? $Message$CommonProto$NetMessage$MsgReplayGetData.fromJson(obj.MsgReplayGetData) : null);
        this.setMsgReplayGetReplayInfo(obj.MsgReplayGetReplayInfo != null ? $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo.fromJson(obj.MsgReplayGetReplayInfo) : null);
        this.setMsgReplayGetReplayInfoArray(obj.MsgReplayGetReplayInfoArray != null ? $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray.fromJson(obj.MsgReplayGetReplayInfoArray) : null);
        this.setMsgReplayGetAllInfoVersions(obj.MsgReplayGetAllInfoVersions != null ? $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions.fromJson(obj.MsgReplayGetAllInfoVersions) : null);
        this.setMsgReplayGetInfoVersion(obj.MsgReplayGetInfoVersion != null ? $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion.fromJson(obj.MsgReplayGetInfoVersion) : null);
        this.setMsgMcrCreateRoom(obj.MsgMcrCreateRoom != null ? $Message$CommonProto$NetMessage$MsgMcrCreateRoom.fromJson(obj.MsgMcrCreateRoom) : null);
        this.setMsgMcrExitRoom(obj.MsgMcrExitRoom != null ? $Message$CommonProto$NetMessage$MsgMcrExitRoom.fromJson(obj.MsgMcrExitRoom) : null);
        this.setMsgMcrJoinRoom(obj.MsgMcrJoinRoom != null ? $Message$CommonProto$NetMessage$MsgMcrJoinRoom.fromJson(obj.MsgMcrJoinRoom) : null);
        this.setMsgMcrDeleteRoom(obj.MsgMcrDeleteRoom != null ? $Message$CommonProto$NetMessage$MsgMcrDeleteRoom.fromJson(obj.MsgMcrDeleteRoom) : null);
        this.setMsgMcrSetReady(obj.MsgMcrSetReady != null ? $Message$CommonProto$NetMessage$MsgMcrSetReady.fromJson(obj.MsgMcrSetReady) : null);
        this.setMsgMcrDeletePlayer(obj.MsgMcrDeletePlayer != null ? $Message$CommonProto$NetMessage$MsgMcrDeletePlayer.fromJson(obj.MsgMcrDeletePlayer) : null);
        this.setMsgMcrSetSelfSettings(obj.MsgMcrSetSelfSettings != null ? $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings.fromJson(obj.MsgMcrSetSelfSettings) : null);
        this.setMsgMcrStartWar(obj.MsgMcrStartWar != null ? $Message$CommonProto$NetMessage$MsgMcrStartWar.fromJson(obj.MsgMcrStartWar) : null);
        this.setMsgMcrGetJoinedRoomIdArray(obj.MsgMcrGetJoinedRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray.fromJson(obj.MsgMcrGetJoinedRoomIdArray) : null);
        this.setMsgMcrGetJoinableRoomIdArray(obj.MsgMcrGetJoinableRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray.fromJson(obj.MsgMcrGetJoinableRoomIdArray) : null);
        this.setMsgMcrGetRoomStaticInfo(obj.MsgMcrGetRoomStaticInfo != null ? $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo.fromJson(obj.MsgMcrGetRoomStaticInfo) : null);
        this.setMsgMcrGetRoomPlayerInfo(obj.MsgMcrGetRoomPlayerInfo != null ? $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo.fromJson(obj.MsgMcrGetRoomPlayerInfo) : null);
        this.setMsgMcrInvite(obj.MsgMcrInvite != null ? $Message$CommonProto$NetMessage$MsgMcrInvite.fromJson(obj.MsgMcrInvite) : null);
        this.setMsgMcrAddDummy(obj.MsgMcrAddDummy != null ? $Message$CommonProto$NetMessage$MsgMcrAddDummy.fromJson(obj.MsgMcrAddDummy) : null);
        this.setMsgMcrSetDummySettings(obj.MsgMcrSetDummySettings != null ? $Message$CommonProto$NetMessage$MsgMcrSetDummySettings.fromJson(obj.MsgMcrSetDummySettings) : null);
        this.setMsgMpwCommonGetJoinedMpwIdArray(obj.MsgMpwCommonGetJoinedMpwIdArray != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray.fromJson(obj.MsgMpwCommonGetJoinedMpwIdArray) : null);
        this.setMsgMpwCommonGetWarTimestamp(obj.MsgMpwCommonGetWarTimestamp != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp.fromJson(obj.MsgMpwCommonGetWarTimestamp) : null);
        this.setMsgMpwCommonGetUnitStatistics(obj.MsgMpwCommonGetUnitStatistics != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics.fromJson(obj.MsgMpwCommonGetUnitStatistics) : null);
        this.setMsgMpwCommonContinueWar(obj.MsgMpwCommonContinueWar != null ? $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar.fromJson(obj.MsgMpwCommonContinueWar) : null);
        this.setMsgMpwCommonSyncWar(obj.MsgMpwCommonSyncWar != null ? $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar.fromJson(obj.MsgMpwCommonSyncWar) : null);
        this.setMsgMpwCommonHandleBoot(obj.MsgMpwCommonHandleBoot != null ? $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot.fromJson(obj.MsgMpwCommonHandleBoot) : null);
        this.setMsgMpwCommonBroadcastGameStart(obj.MsgMpwCommonBroadcastGameStart != null ? $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart.fromJson(obj.MsgMpwCommonBroadcastGameStart) : null);
        this.setMsgMpwCommonGetWarSettings(obj.MsgMpwCommonGetWarSettings != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings.fromJson(obj.MsgMpwCommonGetWarSettings) : null);
        this.setMsgMpwCommonGetWarProgressInfo(obj.MsgMpwCommonGetWarProgressInfo != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo.fromJson(obj.MsgMpwCommonGetWarProgressInfo) : null);
        this.setMsgMpwCommonMarkGrid(obj.MsgMpwCommonMarkGrid != null ? $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid.fromJson(obj.MsgMpwCommonMarkGrid) : null);
        this.setMsgMpwCommonSetHiddenGridMarkTypeIdList(obj.MsgMpwCommonSetHiddenGridMarkTypeIdList != null ? $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList.fromJson(obj.MsgMpwCommonSetHiddenGridMarkTypeIdList) : null);
        this.setMsgMpwCommonSetGridMarkList(obj.MsgMpwCommonSetGridMarkList != null ? $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList.fromJson(obj.MsgMpwCommonSetGridMarkList) : null);
        this.setMsgMpwCommonGetHalfwayReplayData(obj.MsgMpwCommonGetHalfwayReplayData != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData.fromJson(obj.MsgMpwCommonGetHalfwayReplayData) : null);
        this.setMsgMpwWatchMakeRequest(obj.MsgMpwWatchMakeRequest != null ? $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest.fromJson(obj.MsgMpwWatchMakeRequest) : null);
        this.setMsgMpwWatchHandleRequest(obj.MsgMpwWatchHandleRequest != null ? $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest.fromJson(obj.MsgMpwWatchHandleRequest) : null);
        this.setMsgMpwWatchDeleteWatcher(obj.MsgMpwWatchDeleteWatcher != null ? $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher.fromJson(obj.MsgMpwWatchDeleteWatcher) : null);
        this.setMsgMpwWatchGetRequestableWarIdArray(obj.MsgMpwWatchGetRequestableWarIdArray != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray.fromJson(obj.MsgMpwWatchGetRequestableWarIdArray) : null);
        this.setMsgMpwWatchGetOngoingWarIdArray(obj.MsgMpwWatchGetOngoingWarIdArray != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray.fromJson(obj.MsgMpwWatchGetOngoingWarIdArray) : null);
        this.setMsgMpwWatchGetRequestedWarIdArray(obj.MsgMpwWatchGetRequestedWarIdArray != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray.fromJson(obj.MsgMpwWatchGetRequestedWarIdArray) : null);
        this.setMsgMpwWatchGetWatchedWarIdArray(obj.MsgMpwWatchGetWatchedWarIdArray != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray.fromJson(obj.MsgMpwWatchGetWatchedWarIdArray) : null);
        this.setMsgMpwWatchContinueWar(obj.MsgMpwWatchContinueWar != null ? $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar.fromJson(obj.MsgMpwWatchContinueWar) : null);
        this.setMsgMpwWatchGetIncomingInfo(obj.MsgMpwWatchGetIncomingInfo != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo.fromJson(obj.MsgMpwWatchGetIncomingInfo) : null);
        this.setMsgMpwWatchGetOutgoingInfo(obj.MsgMpwWatchGetOutgoingInfo != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo.fromJson(obj.MsgMpwWatchGetOutgoingInfo) : null);
        this.setMsgMpwExecuteWarOperation(obj.MsgMpwExecuteWarOperation != null ? $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation.fromJson(obj.MsgMpwExecuteWarOperation) : null);
        this.setMsgSpmCreateScw(obj.MsgSpmCreateScw != null ? $Message$CommonProto$NetMessage$MsgSpmCreateScw.fromJson(obj.MsgSpmCreateScw) : null);
        this.setMsgSpmCreateSfw(obj.MsgSpmCreateSfw != null ? $Message$CommonProto$NetMessage$MsgSpmCreateSfw.fromJson(obj.MsgSpmCreateSfw) : null);
        this.setMsgSpmCreateSrw(obj.MsgSpmCreateSrw != null ? $Message$CommonProto$NetMessage$MsgSpmCreateSrw.fromJson(obj.MsgSpmCreateSrw) : null);
        this.setMsgSpmGetAllWarSaveSlotTimestamps(obj.MsgSpmGetAllWarSaveSlotTimestamps != null ? $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps.fromJson(obj.MsgSpmGetAllWarSaveSlotTimestamps) : null);
        this.setMsgSpmGetWarSaveSlotFullData(obj.MsgSpmGetWarSaveSlotFullData != null ? $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData.fromJson(obj.MsgSpmGetWarSaveSlotFullData) : null);
        this.setMsgSpmGetWarSaveSlotFullDataArray(obj.MsgSpmGetWarSaveSlotFullDataArray != null ? $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray.fromJson(obj.MsgSpmGetWarSaveSlotFullDataArray) : null);
        this.setMsgSpmDeleteWarSaveSlot(obj.MsgSpmDeleteWarSaveSlot != null ? $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot.fromJson(obj.MsgSpmDeleteWarSaveSlot) : null);
        this.setMsgSpmSaveScw(obj.MsgSpmSaveScw != null ? $Message$CommonProto$NetMessage$MsgSpmSaveScw.fromJson(obj.MsgSpmSaveScw) : null);
        this.setMsgSpmSaveSfw(obj.MsgSpmSaveSfw != null ? $Message$CommonProto$NetMessage$MsgSpmSaveSfw.fromJson(obj.MsgSpmSaveSfw) : null);
        this.setMsgSpmSaveSrw(obj.MsgSpmSaveSrw != null ? $Message$CommonProto$NetMessage$MsgSpmSaveSrw.fromJson(obj.MsgSpmSaveSrw) : null);
        this.setMsgSpmValidateSrw(obj.MsgSpmValidateSrw != null ? $Message$CommonProto$NetMessage$MsgSpmValidateSrw.fromJson(obj.MsgSpmValidateSrw) : null);
        this.setMsgSpmGetRankList(obj.MsgSpmGetRankList != null ? $Message$CommonProto$NetMessage$MsgSpmGetRankList.fromJson(obj.MsgSpmGetRankList) : null);
        this.setMsgSpmGetReplayData(obj.MsgSpmGetReplayData != null ? $Message$CommonProto$NetMessage$MsgSpmGetReplayData.fromJson(obj.MsgSpmGetReplayData) : null);
        this.setMsgMrrSetMaxConcurrentCount(obj.MsgMrrSetMaxConcurrentCount != null ? $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount.fromJson(obj.MsgMrrSetMaxConcurrentCount) : null);
        this.setMsgMrrGetMaxConcurrentCount(obj.MsgMrrGetMaxConcurrentCount != null ? $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount.fromJson(obj.MsgMrrGetMaxConcurrentCount) : null);
        this.setMsgMrrSetBannedNormalMapIdArray(obj.MsgMrrSetBannedNormalMapIdArray != null ? $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray.fromJson(obj.MsgMrrSetBannedNormalMapIdArray) : null);
        this.setMsgMrrGetBannedNormalMapIdArray(obj.MsgMrrGetBannedNormalMapIdArray != null ? $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray.fromJson(obj.MsgMrrGetBannedNormalMapIdArray) : null);
        this.setMsgMrrSetBootTimerDaysRange(obj.MsgMrrSetBootTimerDaysRange != null ? $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange.fromJson(obj.MsgMrrSetBootTimerDaysRange) : null);
        this.setMsgMrrGetBootTimerDaysRange(obj.MsgMrrGetBootTimerDaysRange != null ? $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange.fromJson(obj.MsgMrrGetBootTimerDaysRange) : null);
        this.setMsgMrrGetJoinedRoomIdArray(obj.MsgMrrGetJoinedRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray.fromJson(obj.MsgMrrGetJoinedRoomIdArray) : null);
        this.setMsgMrrGetRoomPublicInfo(obj.MsgMrrGetRoomPublicInfo != null ? $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo.fromJson(obj.MsgMrrGetRoomPublicInfo) : null);
        this.setMsgMrrDeleteRoomByServer(obj.MsgMrrDeleteRoomByServer != null ? $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer.fromJson(obj.MsgMrrDeleteRoomByServer) : null);
        this.setMsgMrrSetBannedCoIdArray(obj.MsgMrrSetBannedCoIdArray != null ? $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray.fromJson(obj.MsgMrrSetBannedCoIdArray) : null);
        this.setMsgMrrSetSelfSettings(obj.MsgMrrSetSelfSettings != null ? $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings.fromJson(obj.MsgMrrSetSelfSettings) : null);
        this.setMsgBroadcastGetAllMessageIdArray(obj.MsgBroadcastGetAllMessageIdArray != null ? $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray.fromJson(obj.MsgBroadcastGetAllMessageIdArray) : null);
        this.setMsgBroadcastAddMessage(obj.MsgBroadcastAddMessage != null ? $Message$CommonProto$NetMessage$MsgBroadcastAddMessage.fromJson(obj.MsgBroadcastAddMessage) : null);
        this.setMsgBroadcastDeleteMessage(obj.MsgBroadcastDeleteMessage != null ? $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage.fromJson(obj.MsgBroadcastDeleteMessage) : null);
        this.setMsgBroadcastDoBroadcast(obj.MsgBroadcastDoBroadcast != null ? $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast.fromJson(obj.MsgBroadcastDoBroadcast) : null);
        this.setMsgBroadcastGetMessageData(obj.MsgBroadcastGetMessageData != null ? $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData.fromJson(obj.MsgBroadcastGetMessageData) : null);
        this.setMsgChangeLogGetMessageList(obj.MsgChangeLogGetMessageList != null ? $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList.fromJson(obj.MsgChangeLogGetMessageList) : null);
        this.setMsgChangeLogAddMessage(obj.MsgChangeLogAddMessage != null ? $Message$CommonProto$NetMessage$MsgChangeLogAddMessage.fromJson(obj.MsgChangeLogAddMessage) : null);
        this.setMsgChangeLogModifyMessage(obj.MsgChangeLogModifyMessage != null ? $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage.fromJson(obj.MsgChangeLogModifyMessage) : null);
        this.setMsgMfrCreateRoom(obj.MsgMfrCreateRoom != null ? $Message$CommonProto$NetMessage$MsgMfrCreateRoom.fromJson(obj.MsgMfrCreateRoom) : null);
        this.setMsgMfrExitRoom(obj.MsgMfrExitRoom != null ? $Message$CommonProto$NetMessage$MsgMfrExitRoom.fromJson(obj.MsgMfrExitRoom) : null);
        this.setMsgMfrJoinRoom(obj.MsgMfrJoinRoom != null ? $Message$CommonProto$NetMessage$MsgMfrJoinRoom.fromJson(obj.MsgMfrJoinRoom) : null);
        this.setMsgMfrDeleteRoom(obj.MsgMfrDeleteRoom != null ? $Message$CommonProto$NetMessage$MsgMfrDeleteRoom.fromJson(obj.MsgMfrDeleteRoom) : null);
        this.setMsgMfrSetReady(obj.MsgMfrSetReady != null ? $Message$CommonProto$NetMessage$MsgMfrSetReady.fromJson(obj.MsgMfrSetReady) : null);
        this.setMsgMfrDeletePlayer(obj.MsgMfrDeletePlayer != null ? $Message$CommonProto$NetMessage$MsgMfrDeletePlayer.fromJson(obj.MsgMfrDeletePlayer) : null);
        this.setMsgMfrSetSelfSettings(obj.MsgMfrSetSelfSettings != null ? $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings.fromJson(obj.MsgMfrSetSelfSettings) : null);
        this.setMsgMfrStartWar(obj.MsgMfrStartWar != null ? $Message$CommonProto$NetMessage$MsgMfrStartWar.fromJson(obj.MsgMfrStartWar) : null);
        this.setMsgMfrGetJoinedRoomIdArray(obj.MsgMfrGetJoinedRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray.fromJson(obj.MsgMfrGetJoinedRoomIdArray) : null);
        this.setMsgMfrGetJoinableRoomIdArray(obj.MsgMfrGetJoinableRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray.fromJson(obj.MsgMfrGetJoinableRoomIdArray) : null);
        this.setMsgMfrGetRoomStaticInfo(obj.MsgMfrGetRoomStaticInfo != null ? $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo.fromJson(obj.MsgMfrGetRoomStaticInfo) : null);
        this.setMsgMfrGetRoomPlayerInfo(obj.MsgMfrGetRoomPlayerInfo != null ? $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo.fromJson(obj.MsgMfrGetRoomPlayerInfo) : null);
        this.setMsgMfrInvite(obj.MsgMfrInvite != null ? $Message$CommonProto$NetMessage$MsgMfrInvite.fromJson(obj.MsgMfrInvite) : null);
        this.setMsgMfrAddDummy(obj.MsgMfrAddDummy != null ? $Message$CommonProto$NetMessage$MsgMfrAddDummy.fromJson(obj.MsgMfrAddDummy) : null);
        this.setMsgMfrSetDummySettings(obj.MsgMfrSetDummySettings != null ? $Message$CommonProto$NetMessage$MsgMfrSetDummySettings.fromJson(obj.MsgMfrSetDummySettings) : null);
        this.setMsgCcrCreateRoom(obj.MsgCcrCreateRoom != null ? $Message$CommonProto$NetMessage$MsgCcrCreateRoom.fromJson(obj.MsgCcrCreateRoom) : null);
        this.setMsgCcrExitRoom(obj.MsgCcrExitRoom != null ? $Message$CommonProto$NetMessage$MsgCcrExitRoom.fromJson(obj.MsgCcrExitRoom) : null);
        this.setMsgCcrJoinRoom(obj.MsgCcrJoinRoom != null ? $Message$CommonProto$NetMessage$MsgCcrJoinRoom.fromJson(obj.MsgCcrJoinRoom) : null);
        this.setMsgCcrDeleteRoom(obj.MsgCcrDeleteRoom != null ? $Message$CommonProto$NetMessage$MsgCcrDeleteRoom.fromJson(obj.MsgCcrDeleteRoom) : null);
        this.setMsgCcrSetReady(obj.MsgCcrSetReady != null ? $Message$CommonProto$NetMessage$MsgCcrSetReady.fromJson(obj.MsgCcrSetReady) : null);
        this.setMsgCcrDeletePlayer(obj.MsgCcrDeletePlayer != null ? $Message$CommonProto$NetMessage$MsgCcrDeletePlayer.fromJson(obj.MsgCcrDeletePlayer) : null);
        this.setMsgCcrSetSelfSettings(obj.MsgCcrSetSelfSettings != null ? $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings.fromJson(obj.MsgCcrSetSelfSettings) : null);
        this.setMsgCcrStartWar(obj.MsgCcrStartWar != null ? $Message$CommonProto$NetMessage$MsgCcrStartWar.fromJson(obj.MsgCcrStartWar) : null);
        this.setMsgCcrGetJoinedRoomIdArray(obj.MsgCcrGetJoinedRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray.fromJson(obj.MsgCcrGetJoinedRoomIdArray) : null);
        this.setMsgCcrGetJoinableRoomIdArray(obj.MsgCcrGetJoinableRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray.fromJson(obj.MsgCcrGetJoinableRoomIdArray) : null);
        this.setMsgCcrGetRoomStaticInfo(obj.MsgCcrGetRoomStaticInfo != null ? $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo.fromJson(obj.MsgCcrGetRoomStaticInfo) : null);
        this.setMsgCcrGetRoomPlayerInfo(obj.MsgCcrGetRoomPlayerInfo != null ? $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo.fromJson(obj.MsgCcrGetRoomPlayerInfo) : null);
        this.setMsgCcrInvite(obj.MsgCcrInvite != null ? $Message$CommonProto$NetMessage$MsgCcrInvite.fromJson(obj.MsgCcrInvite) : null);
        this.setMsgCcrAddDummy(obj.MsgCcrAddDummy != null ? $Message$CommonProto$NetMessage$MsgCcrAddDummy.fromJson(obj.MsgCcrAddDummy) : null);
        this.setMsgCcrSetDummySettings(obj.MsgCcrSetDummySettings != null ? $Message$CommonProto$NetMessage$MsgCcrSetDummySettings.fromJson(obj.MsgCcrSetDummySettings) : null);
        this.setMsgLbSpmOverallGetTopDataArray(obj.MsgLbSpmOverallGetTopDataArray != null ? $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray.fromJson(obj.MsgLbSpmOverallGetTopDataArray) : null);
        this.setMsgLbSpmOverallGetRankInfo(obj.MsgLbSpmOverallGetRankInfo != null ? $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo.fromJson(obj.MsgLbSpmOverallGetRankInfo) : null);
        this.setMsgLbMrwGetRankIndex(obj.MsgLbMrwGetRankIndex != null ? $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex.fromJson(obj.MsgLbMrwGetRankIndex) : null);
        this.setMsgMmrSetMaxConcurrentCount(obj.MsgMmrSetMaxConcurrentCount != null ? $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount.fromJson(obj.MsgMmrSetMaxConcurrentCount) : null);
        this.setMsgMmrGetMaxConcurrentCount(obj.MsgMmrGetMaxConcurrentCount != null ? $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount.fromJson(obj.MsgMmrGetMaxConcurrentCount) : null);
        this.setMsgMmrSetBannedNormalMapIdArray(obj.MsgMmrSetBannedNormalMapIdArray != null ? $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray.fromJson(obj.MsgMmrSetBannedNormalMapIdArray) : null);
        this.setMsgMmrGetBannedNormalMapIdArray(obj.MsgMmrGetBannedNormalMapIdArray != null ? $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray.fromJson(obj.MsgMmrGetBannedNormalMapIdArray) : null);
        this.setMsgMmrSetBootTimerDaysRange(obj.MsgMmrSetBootTimerDaysRange != null ? $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange.fromJson(obj.MsgMmrSetBootTimerDaysRange) : null);
        this.setMsgMmrGetBootTimerDaysRange(obj.MsgMmrGetBootTimerDaysRange != null ? $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange.fromJson(obj.MsgMmrGetBootTimerDaysRange) : null);
        this.setMsgMmrGetJoinedRoomIdArray(obj.MsgMmrGetJoinedRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray.fromJson(obj.MsgMmrGetJoinedRoomIdArray) : null);
        this.setMsgMmrGetRoomPublicInfo(obj.MsgMmrGetRoomPublicInfo != null ? $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo.fromJson(obj.MsgMmrGetRoomPublicInfo) : null);
        this.setMsgMmrDeleteRoomByServer(obj.MsgMmrDeleteRoomByServer != null ? $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer.fromJson(obj.MsgMmrDeleteRoomByServer) : null);
        this.setMsgMmrSetBannedCoIdArray(obj.MsgMmrSetBannedCoIdArray != null ? $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray.fromJson(obj.MsgMmrSetBannedCoIdArray) : null);
        this.setMsgMmrSetSelfSettings(obj.MsgMmrSetSelfSettings != null ? $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings.fromJson(obj.MsgMmrSetSelfSettings) : null);
        this.setMsgNormalMapGetAllEnabledBriefDataVersions(obj.MsgNormalMapGetAllEnabledBriefDataVersions != null ? $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions.fromJson(obj.MsgNormalMapGetAllEnabledBriefDataVersions) : null);
        this.setMsgNormalMapGetBriefDataVersion(obj.MsgNormalMapGetBriefDataVersion != null ? $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion.fromJson(obj.MsgNormalMapGetBriefDataVersion) : null);
        this.setMsgNormalMapGetBriefData(obj.MsgNormalMapGetBriefData != null ? $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData.fromJson(obj.MsgNormalMapGetBriefData) : null);
        this.setMsgNormalMapGetBriefDataArray(obj.MsgNormalMapGetBriefDataArray != null ? $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray.fromJson(obj.MsgNormalMapGetBriefDataArray) : null);
        this.setMsgMapGetRawData(obj.MsgMapGetRawData != null ? $Message$CommonProto$NetMessage$MsgMapGetRawData.fromJson(obj.MsgMapGetRawData) : null);
        this.setMsgMapGetMapTag(obj.MsgMapGetMapTag != null ? $Message$CommonProto$NetMessage$MsgMapGetMapTag.fromJson(obj.MsgMapGetMapTag) : null);
        this.setMsgMailGetAllMailArray(obj.MsgMailGetAllMailArray != null ? $Message$CommonProto$NetMessage$MsgMailGetAllMailArray.fromJson(obj.MsgMailGetAllMailArray) : null);
        this.setMsgMailGetMail(obj.MsgMailGetMail != null ? $Message$CommonProto$NetMessage$MsgMailGetMail.fromJson(obj.MsgMailGetMail) : null);
        this.setMsgMailDeleteMail(obj.MsgMailDeleteMail != null ? $Message$CommonProto$NetMessage$MsgMailDeleteMail.fromJson(obj.MsgMailDeleteMail) : null);
        this.setMsgMailSetIsNew(obj.MsgMailSetIsNew != null ? $Message$CommonProto$NetMessage$MsgMailSetIsNew.fromJson(obj.MsgMailSetIsNew) : null);
        this.setMsgAtGetGlobalSettings(obj.MsgAtGetGlobalSettings != null ? $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings.fromJson(obj.MsgAtGetGlobalSettings) : null);
        this.setMsgAtSetGlobalSettings(obj.MsgAtSetGlobalSettings != null ? $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings.fromJson(obj.MsgAtSetGlobalSettings) : null);
        this.setMsgAtCreateTourney(obj.MsgAtCreateTourney != null ? $Message$CommonProto$NetMessage$MsgAtCreateTourney.fromJson(obj.MsgAtCreateTourney) : null);
        this.setMsgAtDeleteLastTourney(obj.MsgAtDeleteLastTourney != null ? $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney.fromJson(obj.MsgAtDeleteLastTourney) : null);
        this.setMsgAtSetRegistrationDuration(obj.MsgAtSetRegistrationDuration != null ? $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration.fromJson(obj.MsgAtSetRegistrationDuration) : null);
        this.setMsgAtSetAdjustmentDuration(obj.MsgAtSetAdjustmentDuration != null ? $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration.fromJson(obj.MsgAtSetAdjustmentDuration) : null);
        this.setMsgAtSetInitialBrackets(obj.MsgAtSetInitialBrackets != null ? $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets.fromJson(obj.MsgAtSetInitialBrackets) : null);
        this.setMsgAtSetMapPool(obj.MsgAtSetMapPool != null ? $Message$CommonProto$NetMessage$MsgAtSetMapPool.fromJson(obj.MsgAtSetMapPool) : null);
        this.setMsgAtSetName(obj.MsgAtSetName != null ? $Message$CommonProto$NetMessage$MsgAtSetName.fromJson(obj.MsgAtSetName) : null);
        this.setMsgAtSetBootTimer(obj.MsgAtSetBootTimer != null ? $Message$CommonProto$NetMessage$MsgAtSetBootTimer.fromJson(obj.MsgAtSetBootTimer) : null);
        this.setMsgAtGetUserArray(obj.MsgAtGetUserArray != null ? $Message$CommonProto$NetMessage$MsgAtGetUserArray.fromJson(obj.MsgAtGetUserArray) : null);
        this.setMsgAtDeleteUser(obj.MsgAtDeleteUser != null ? $Message$CommonProto$NetMessage$MsgAtDeleteUser.fromJson(obj.MsgAtDeleteUser) : null);
        this.setMsgAtGetPhaseInfo(obj.MsgAtGetPhaseInfo != null ? $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo.fromJson(obj.MsgAtGetPhaseInfo) : null);
        this.setMsgAtGetRegistrationInfo(obj.MsgAtGetRegistrationInfo != null ? $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo.fromJson(obj.MsgAtGetRegistrationInfo) : null);
        this.setMsgAtGetTourneyInfo(obj.MsgAtGetTourneyInfo != null ? $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo.fromJson(obj.MsgAtGetTourneyInfo) : null);
        this.setMsgAtGetFullMapInfo(obj.MsgAtGetFullMapInfo != null ? $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo.fromJson(obj.MsgAtGetFullMapInfo) : null);
        this.setMsgAtGetFullBracketInfo(obj.MsgAtGetFullBracketInfo != null ? $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo.fromJson(obj.MsgAtGetFullBracketInfo) : null);
        this.setMsgAtRegister(obj.MsgAtRegister != null ? $Message$CommonProto$NetMessage$MsgAtRegister.fromJson(obj.MsgAtRegister) : null);
        this.setMsgAtrGetJoinedRoomIdArray(obj.MsgAtrGetJoinedRoomIdArray != null ? $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray.fromJson(obj.MsgAtrGetJoinedRoomIdArray) : null);
        this.setMsgAtrGetRoomPublicInfo(obj.MsgAtrGetRoomPublicInfo != null ? $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo.fromJson(obj.MsgAtrGetRoomPublicInfo) : null);
        this.setMsgAtrDeleteRoomByServer(obj.MsgAtrDeleteRoomByServer != null ? $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer.fromJson(obj.MsgAtrDeleteRoomByServer) : null);
        this.setMsgAtrSetBannedCoIdArray(obj.MsgAtrSetBannedCoIdArray != null ? $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray.fromJson(obj.MsgAtrSetBannedCoIdArray) : null);
        this.setMsgAtrSetSelfSettings(obj.MsgAtrSetSelfSettings != null ? $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings.fromJson(obj.MsgAtrSetSelfSettings) : null);
        this.setMsgGmSetUserPrivilege(obj.MsgGmSetUserPrivilege != null ? $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege.fromJson(obj.MsgGmSetUserPrivilege) : null);
        this.setMsgGmSetUserPassword(obj.MsgGmSetUserPassword != null ? $Message$CommonProto$NetMessage$MsgGmSetUserPassword.fromJson(obj.MsgGmSetUserPassword) : null);
        this.setMsgGmDeleteMcrRoom(obj.MsgGmDeleteMcrRoom != null ? $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom.fromJson(obj.MsgGmDeleteMcrRoom) : null);
        this.setMsgGmDeleteMfrRoom(obj.MsgGmDeleteMfrRoom != null ? $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom.fromJson(obj.MsgGmDeleteMfrRoom) : null);
        this.setMsgGmDeleteCcrRoom(obj.MsgGmDeleteCcrRoom != null ? $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom.fromJson(obj.MsgGmDeleteCcrRoom) : null);
        this.setMsgGmDeleteMrrRoom(obj.MsgGmDeleteMrrRoom != null ? $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom.fromJson(obj.MsgGmDeleteMrrRoom) : null);
        this.setMsgGmDeleteMmrRoom(obj.MsgGmDeleteMmrRoom != null ? $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom.fromJson(obj.MsgGmDeleteMmrRoom) : null);
        this.setMsgGmDeleteSpmAllScoreAndReplay(obj.MsgGmDeleteSpmAllScoreAndReplay != null ? $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay.fromJson(obj.MsgGmDeleteSpmAllScoreAndReplay) : null);
        this.setMsgGmAddUserMedal(obj.MsgGmAddUserMedal != null ? $Message$CommonProto$NetMessage$MsgGmAddUserMedal.fromJson(obj.MsgGmAddUserMedal) : null);
        this.setMsgGmGenerateReplayStatistics(obj.MsgGmGenerateReplayStatistics != null ? $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics.fromJson(obj.MsgGmGenerateReplayStatistics) : null);
        this.setMsgGmUpdateReplayInfo(obj.MsgGmUpdateReplayInfo != null ? $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo.fromJson(obj.MsgGmUpdateReplayInfo) : null);
        this.setMsgCmGetAllCampaignIdArray(obj.MsgCmGetAllCampaignIdArray != null ? $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray.fromJson(obj.MsgCmGetAllCampaignIdArray) : null);
        this.setMsgCmGetDesigningCampaignIdArray(obj.MsgCmGetDesigningCampaignIdArray != null ? $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray.fromJson(obj.MsgCmGetDesigningCampaignIdArray) : null);
        this.setMsgCmCreateCampaign(obj.MsgCmCreateCampaign != null ? $Message$CommonProto$NetMessage$MsgCmCreateCampaign.fromJson(obj.MsgCmCreateCampaign) : null);
        this.setMsgCmCreateCampaignMap(obj.MsgCmCreateCampaignMap != null ? $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap.fromJson(obj.MsgCmCreateCampaignMap) : null);
        this.setMsgCmSetCampaignName(obj.MsgCmSetCampaignName != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignName.fromJson(obj.MsgCmSetCampaignName) : null);
        this.setMsgCmSetCampaignDesc(obj.MsgCmSetCampaignDesc != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc.fromJson(obj.MsgCmSetCampaignDesc) : null);
        this.setMsgCmSetCampaignEnabled(obj.MsgCmSetCampaignEnabled != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled.fromJson(obj.MsgCmSetCampaignEnabled) : null);
        this.setMsgCmSetCampaignMapEnabled(obj.MsgCmSetCampaignMapEnabled != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled.fromJson(obj.MsgCmSetCampaignMapEnabled) : null);
        this.setMsgCmSetCampaignMapRawData(obj.MsgCmSetCampaignMapRawData != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData.fromJson(obj.MsgCmSetCampaignMapRawData) : null);
        this.setMsgCmSetCampaignMapExtraText(obj.MsgCmSetCampaignMapExtraText != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText.fromJson(obj.MsgCmSetCampaignMapExtraText) : null);
        this.setMsgCmSetCampaignMapName(obj.MsgCmSetCampaignMapName != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName.fromJson(obj.MsgCmSetCampaignMapName) : null);
        this.setMsgCmSetCampaignMapWarEventAction(obj.MsgCmSetCampaignMapWarEventAction != null ? $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction.fromJson(obj.MsgCmSetCampaignMapWarEventAction) : null);
        this.setMsgCmUpdateCampaignDesigners(obj.MsgCmUpdateCampaignDesigners != null ? $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners.fromJson(obj.MsgCmUpdateCampaignDesigners) : null);
        this.setMsgCmSetExtraLink(obj.MsgCmSetExtraLink != null ? $Message$CommonProto$NetMessage$MsgCmSetExtraLink.fromJson(obj.MsgCmSetExtraLink) : null);
        this.setMsgCampaignGetCampaignInfo(obj.MsgCampaignGetCampaignInfo != null ? $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo.fromJson(obj.MsgCampaignGetCampaignInfo) : null);
        this.setMsgCampaignGetEnabledCampaignIdArray(obj.MsgCampaignGetEnabledCampaignIdArray != null ? $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray.fromJson(obj.MsgCampaignGetEnabledCampaignIdArray) : null);
        this.setMsgCampaignGetAllMapTimestampArray(obj.MsgCampaignGetAllMapTimestampArray != null ? $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray.fromJson(obj.MsgCampaignGetAllMapTimestampArray) : null);
        this.setMsgCampaignGetMapTimestamp(obj.MsgCampaignGetMapTimestamp != null ? $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp.fromJson(obj.MsgCampaignGetMapTimestamp) : null);
        this.setMsgCampaignGetMapRawDataArray(obj.MsgCampaignGetMapRawDataArray != null ? $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray.fromJson(obj.MsgCampaignGetMapRawDataArray) : null);
        this.setMsgCampaignGetMapRawData(obj.MsgCampaignGetMapRawData != null ? $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData.fromJson(obj.MsgCampaignGetMapRawData) : null);
        this.setMsgCampaignCreateWar(obj.MsgCampaignCreateWar != null ? $Message$CommonProto$NetMessage$MsgCampaignCreateWar.fromJson(obj.MsgCampaignCreateWar) : null);
        this.setMsgCampaignSaveWar(obj.MsgCampaignSaveWar != null ? $Message$CommonProto$NetMessage$MsgCampaignSaveWar.fromJson(obj.MsgCampaignSaveWar) : null);
        this.setMsgCampaignValidateWar(obj.MsgCampaignValidateWar != null ? $Message$CommonProto$NetMessage$MsgCampaignValidateWar.fromJson(obj.MsgCampaignValidateWar) : null);
        this.setMsgCampaignGetCampaignLeaderboard(obj.MsgCampaignGetCampaignLeaderboard != null ? $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard.fromJson(obj.MsgCampaignGetCampaignLeaderboard) : null);
        this.setMsgCampaignGetCampaignMapLeaderboard(obj.MsgCampaignGetCampaignMapLeaderboard != null ? $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard.fromJson(obj.MsgCampaignGetCampaignMapLeaderboard) : null);
        this.setMsgCampaignGetScore(obj.MsgCampaignGetScore != null ? $Message$CommonProto$NetMessage$MsgCampaignGetScore.fromJson(obj.MsgCampaignGetScore) : null);
        return this;
    }
    public override toJson(obj?: MessageContainerJson): MessageContainerJson {
        obj ??= ({} as MessageContainerJson);

        {
            const value = this.getMsgCommonHeartbeat();
            (value != null) && (obj.MsgCommonHeartbeat = value.toJson());
        }

        {
            const value = this.getMsgCommonError();
            (value != null) && (obj.MsgCommonError = value.toJson());
        }

        {
            const value = this.getMsgCommonServerDisconnect();
            (value != null) && (obj.MsgCommonServerDisconnect = value.toJson());
        }

        {
            const value = this.getMsgCommonLatestConfigVersion();
            (value != null) && (obj.MsgCommonLatestConfigVersion = value.toJson());
        }

        {
            const value = this.getMsgCommonGetServerStatus();
            (value != null) && (obj.MsgCommonGetServerStatus = value.toJson());
        }

        {
            const value = this.getMsgCommonGetRankList();
            (value != null) && (obj.MsgCommonGetRankList = value.toJson());
        }

        {
            const value = this.getMsgCommonGetCoStatistics();
            (value != null) && (obj.MsgCommonGetCoStatistics = value.toJson());
        }

        {
            const value = this.getMsgUserRegister();
            (value != null) && (obj.MsgUserRegister = value.toJson());
        }

        {
            const value = this.getMsgUserLogin();
            (value != null) && (obj.MsgUserLogin = value.toJson());
        }

        {
            const value = this.getMsgUserLogout();
            (value != null) && (obj.MsgUserLogout = value.toJson());
        }

        {
            const value = this.getMsgUserGetPublicInfo();
            (value != null) && (obj.MsgUserGetPublicInfo = value.toJson());
        }

        {
            const value = this.getMsgUserGetPublicInfoArray();
            (value != null) && (obj.MsgUserGetPublicInfoArray = value.toJson());
        }

        {
            const value = this.getMsgUserGetBriefInfo();
            (value != null) && (obj.MsgUserGetBriefInfo = value.toJson());
        }

        {
            const value = this.getMsgUserGetOnlineState();
            (value != null) && (obj.MsgUserGetOnlineState = value.toJson());
        }

        {
            const value = this.getMsgUserGetOnlineUserIdArray();
            (value != null) && (obj.MsgUserGetOnlineUserIdArray = value.toJson());
        }

        {
            const value = this.getMsgUserSetNickname();
            (value != null) && (obj.MsgUserSetNickname = value.toJson());
        }

        {
            const value = this.getMsgUserSetDiscordInfo();
            (value != null) && (obj.MsgUserSetDiscordInfo = value.toJson());
        }

        {
            const value = this.getMsgUserSetCoBgmSettings();
            (value != null) && (obj.MsgUserSetCoBgmSettings = value.toJson());
        }

        {
            const value = this.getMsgUserSetSceneBgmSettings();
            (value != null) && (obj.MsgUserSetSceneBgmSettings = value.toJson());
        }

        {
            const value = this.getMsgUserSetPassword();
            (value != null) && (obj.MsgUserSetPassword = value.toJson());
        }

        {
            const value = this.getMsgUserSetSettings();
            (value != null) && (obj.MsgUserSetSettings = value.toJson());
        }

        {
            const value = this.getMsgUserSetMapRating();
            (value != null) && (obj.MsgUserSetMapRating = value.toJson());
        }

        {
            const value = this.getMsgUserSetAvatarId();
            (value != null) && (obj.MsgUserSetAvatarId = value.toJson());
        }

        {
            const value = this.getMsgUserSetMapEditorAutoSaveTime();
            (value != null) && (obj.MsgUserSetMapEditorAutoSaveTime = value.toJson());
        }

        {
            const value = this.getMsgUserLoginAsGuest();
            (value != null) && (obj.MsgUserLoginAsGuest = value.toJson());
        }

        {
            const value = this.getMsgUserGetUsersByNickname();
            (value != null) && (obj.MsgUserGetUsersByNickname = value.toJson());
        }

        {
            const value = this.getMsgUserSetRelation();
            (value != null) && (obj.MsgUserSetRelation = value.toJson());
        }

        {
            const value = this.getMsgUserSetShowMedalIdArray();
            (value != null) && (obj.MsgUserSetShowMedalIdArray = value.toJson());
        }

        {
            const value = this.getMsgUserModifyFavoriteReplayIdArray();
            (value != null) && (obj.MsgUserModifyFavoriteReplayIdArray = value.toJson());
        }

        {
            const value = this.getMsgUserRequestEmailVerificationCode();
            (value != null) && (obj.MsgUserRequestEmailVerificationCode = value.toJson());
        }

        {
            const value = this.getMsgUserVerifyEmail();
            (value != null) && (obj.MsgUserVerifyEmail = value.toJson());
        }

        {
            const value = this.getMsgUserRequestPasswordVerificationCode();
            (value != null) && (obj.MsgUserRequestPasswordVerificationCode = value.toJson());
        }

        {
            const value = this.getMsgUserResetPasswordWithEmail();
            (value != null) && (obj.MsgUserResetPasswordWithEmail = value.toJson());
        }

        {
            const value = this.getMsgMeGetAllMapDataTimestamps();
            (value != null) && (obj.MsgMeGetAllMapDataTimestamps = value.toJson());
        }

        {
            const value = this.getMsgMeGetMapDataTimestamp();
            (value != null) && (obj.MsgMeGetMapDataTimestamp = value.toJson());
        }

        {
            const value = this.getMsgMeGetMapDataArray();
            (value != null) && (obj.MsgMeGetMapDataArray = value.toJson());
        }

        {
            const value = this.getMsgMeGetMapData();
            (value != null) && (obj.MsgMeGetMapData = value.toJson());
        }

        {
            const value = this.getMsgMeSubmitNormalMap();
            (value != null) && (obj.MsgMeSubmitNormalMap = value.toJson());
        }

        {
            const value = this.getMsgMeDeleteSlot();
            (value != null) && (obj.MsgMeDeleteSlot = value.toJson());
        }

        {
            const value = this.getMsgChatAddMessage();
            (value != null) && (obj.MsgChatAddMessage = value.toJson());
        }

        {
            const value = this.getMsgChatGetAllMessages();
            (value != null) && (obj.MsgChatGetAllMessages = value.toJson());
        }

        {
            const value = this.getMsgChatUpdateReadProgress();
            (value != null) && (obj.MsgChatUpdateReadProgress = value.toJson());
        }

        {
            const value = this.getMsgChatGetAllReadProgressList();
            (value != null) && (obj.MsgChatGetAllReadProgressList = value.toJson());
        }

        {
            const value = this.getMsgChatDeleteMessage();
            (value != null) && (obj.MsgChatDeleteMessage = value.toJson());
        }

        {
            const value = this.getMsgMmSetWarRuleAvailability();
            (value != null) && (obj.MsgMmSetWarRuleAvailability = value.toJson());
        }

        {
            const value = this.getMsgMmSetMapEnabled();
            (value != null) && (obj.MsgMmSetMapEnabled = value.toJson());
        }

        {
            const value = this.getMsgMmGetReviewingMaps();
            (value != null) && (obj.MsgMmGetReviewingMaps = value.toJson());
        }

        {
            const value = this.getMsgMmReviewMap();
            (value != null) && (obj.MsgMmReviewMap = value.toJson());
        }

        {
            const value = this.getMsgMmSetMapTagIdFlags();
            (value != null) && (obj.MsgMmSetMapTagIdFlags = value.toJson());
        }

        {
            const value = this.getMsgMmSetMapName();
            (value != null) && (obj.MsgMmSetMapName = value.toJson());
        }

        {
            const value = this.getMsgMmAddWarRule();
            (value != null) && (obj.MsgMmAddWarRule = value.toJson());
        }

        {
            const value = this.getMsgMmAddWarEvent();
            (value != null) && (obj.MsgMmAddWarEvent = value.toJson());
        }

        {
            const value = this.getMsgMmDeleteWarRule();
            (value != null) && (obj.MsgMmDeleteWarRule = value.toJson());
        }

        {
            const value = this.getMsgMmDeleteRedundantWarEvent();
            (value != null) && (obj.MsgMmDeleteRedundantWarEvent = value.toJson());
        }

        {
            const value = this.getMsgMmSetWarRuleName();
            (value != null) && (obj.MsgMmSetWarRuleName = value.toJson());
        }

        {
            const value = this.getMsgMmSetWarRuleFixedTileTheme();
            (value != null) && (obj.MsgMmSetWarRuleFixedTileTheme = value.toJson());
        }

        {
            const value = this.getMsgMmSetMapTagSingleData();
            (value != null) && (obj.MsgMmSetMapTagSingleData = value.toJson());
        }

        {
            const value = this.getMsgMmSubmitMapSimpleDialogue();
            (value != null) && (obj.MsgMmSubmitMapSimpleDialogue = value.toJson());
        }

        {
            const value = this.getMsgMmAddIgnoredReviewingMap();
            (value != null) && (obj.MsgMmAddIgnoredReviewingMap = value.toJson());
        }

        {
            const value = this.getMsgReplaySetSelfRating();
            (value != null) && (obj.MsgReplaySetSelfRating = value.toJson());
        }

        {
            const value = this.getMsgReplayGetSelfRating();
            (value != null) && (obj.MsgReplayGetSelfRating = value.toJson());
        }

        {
            const value = this.getMsgReplayGetData();
            (value != null) && (obj.MsgReplayGetData = value.toJson());
        }

        {
            const value = this.getMsgReplayGetReplayInfo();
            (value != null) && (obj.MsgReplayGetReplayInfo = value.toJson());
        }

        {
            const value = this.getMsgReplayGetReplayInfoArray();
            (value != null) && (obj.MsgReplayGetReplayInfoArray = value.toJson());
        }

        {
            const value = this.getMsgReplayGetAllInfoVersions();
            (value != null) && (obj.MsgReplayGetAllInfoVersions = value.toJson());
        }

        {
            const value = this.getMsgReplayGetInfoVersion();
            (value != null) && (obj.MsgReplayGetInfoVersion = value.toJson());
        }

        {
            const value = this.getMsgMcrCreateRoom();
            (value != null) && (obj.MsgMcrCreateRoom = value.toJson());
        }

        {
            const value = this.getMsgMcrExitRoom();
            (value != null) && (obj.MsgMcrExitRoom = value.toJson());
        }

        {
            const value = this.getMsgMcrJoinRoom();
            (value != null) && (obj.MsgMcrJoinRoom = value.toJson());
        }

        {
            const value = this.getMsgMcrDeleteRoom();
            (value != null) && (obj.MsgMcrDeleteRoom = value.toJson());
        }

        {
            const value = this.getMsgMcrSetReady();
            (value != null) && (obj.MsgMcrSetReady = value.toJson());
        }

        {
            const value = this.getMsgMcrDeletePlayer();
            (value != null) && (obj.MsgMcrDeletePlayer = value.toJson());
        }

        {
            const value = this.getMsgMcrSetSelfSettings();
            (value != null) && (obj.MsgMcrSetSelfSettings = value.toJson());
        }

        {
            const value = this.getMsgMcrStartWar();
            (value != null) && (obj.MsgMcrStartWar = value.toJson());
        }

        {
            const value = this.getMsgMcrGetJoinedRoomIdArray();
            (value != null) && (obj.MsgMcrGetJoinedRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgMcrGetJoinableRoomIdArray();
            (value != null) && (obj.MsgMcrGetJoinableRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgMcrGetRoomStaticInfo();
            (value != null) && (obj.MsgMcrGetRoomStaticInfo = value.toJson());
        }

        {
            const value = this.getMsgMcrGetRoomPlayerInfo();
            (value != null) && (obj.MsgMcrGetRoomPlayerInfo = value.toJson());
        }

        {
            const value = this.getMsgMcrInvite();
            (value != null) && (obj.MsgMcrInvite = value.toJson());
        }

        {
            const value = this.getMsgMcrAddDummy();
            (value != null) && (obj.MsgMcrAddDummy = value.toJson());
        }

        {
            const value = this.getMsgMcrSetDummySettings();
            (value != null) && (obj.MsgMcrSetDummySettings = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonGetJoinedMpwIdArray();
            (value != null) && (obj.MsgMpwCommonGetJoinedMpwIdArray = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonGetWarTimestamp();
            (value != null) && (obj.MsgMpwCommonGetWarTimestamp = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonGetUnitStatistics();
            (value != null) && (obj.MsgMpwCommonGetUnitStatistics = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonContinueWar();
            (value != null) && (obj.MsgMpwCommonContinueWar = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonSyncWar();
            (value != null) && (obj.MsgMpwCommonSyncWar = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonHandleBoot();
            (value != null) && (obj.MsgMpwCommonHandleBoot = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonBroadcastGameStart();
            (value != null) && (obj.MsgMpwCommonBroadcastGameStart = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonGetWarSettings();
            (value != null) && (obj.MsgMpwCommonGetWarSettings = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonGetWarProgressInfo();
            (value != null) && (obj.MsgMpwCommonGetWarProgressInfo = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonMarkGrid();
            (value != null) && (obj.MsgMpwCommonMarkGrid = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonSetHiddenGridMarkTypeIdList();
            (value != null) && (obj.MsgMpwCommonSetHiddenGridMarkTypeIdList = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonSetGridMarkList();
            (value != null) && (obj.MsgMpwCommonSetGridMarkList = value.toJson());
        }

        {
            const value = this.getMsgMpwCommonGetHalfwayReplayData();
            (value != null) && (obj.MsgMpwCommonGetHalfwayReplayData = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchMakeRequest();
            (value != null) && (obj.MsgMpwWatchMakeRequest = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchHandleRequest();
            (value != null) && (obj.MsgMpwWatchHandleRequest = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchDeleteWatcher();
            (value != null) && (obj.MsgMpwWatchDeleteWatcher = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchGetRequestableWarIdArray();
            (value != null) && (obj.MsgMpwWatchGetRequestableWarIdArray = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchGetOngoingWarIdArray();
            (value != null) && (obj.MsgMpwWatchGetOngoingWarIdArray = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchGetRequestedWarIdArray();
            (value != null) && (obj.MsgMpwWatchGetRequestedWarIdArray = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchGetWatchedWarIdArray();
            (value != null) && (obj.MsgMpwWatchGetWatchedWarIdArray = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchContinueWar();
            (value != null) && (obj.MsgMpwWatchContinueWar = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchGetIncomingInfo();
            (value != null) && (obj.MsgMpwWatchGetIncomingInfo = value.toJson());
        }

        {
            const value = this.getMsgMpwWatchGetOutgoingInfo();
            (value != null) && (obj.MsgMpwWatchGetOutgoingInfo = value.toJson());
        }

        {
            const value = this.getMsgMpwExecuteWarOperation();
            (value != null) && (obj.MsgMpwExecuteWarOperation = value.toJson());
        }

        {
            const value = this.getMsgSpmCreateScw();
            (value != null) && (obj.MsgSpmCreateScw = value.toJson());
        }

        {
            const value = this.getMsgSpmCreateSfw();
            (value != null) && (obj.MsgSpmCreateSfw = value.toJson());
        }

        {
            const value = this.getMsgSpmCreateSrw();
            (value != null) && (obj.MsgSpmCreateSrw = value.toJson());
        }

        {
            const value = this.getMsgSpmGetAllWarSaveSlotTimestamps();
            (value != null) && (obj.MsgSpmGetAllWarSaveSlotTimestamps = value.toJson());
        }

        {
            const value = this.getMsgSpmGetWarSaveSlotFullData();
            (value != null) && (obj.MsgSpmGetWarSaveSlotFullData = value.toJson());
        }

        {
            const value = this.getMsgSpmGetWarSaveSlotFullDataArray();
            (value != null) && (obj.MsgSpmGetWarSaveSlotFullDataArray = value.toJson());
        }

        {
            const value = this.getMsgSpmDeleteWarSaveSlot();
            (value != null) && (obj.MsgSpmDeleteWarSaveSlot = value.toJson());
        }

        {
            const value = this.getMsgSpmSaveScw();
            (value != null) && (obj.MsgSpmSaveScw = value.toJson());
        }

        {
            const value = this.getMsgSpmSaveSfw();
            (value != null) && (obj.MsgSpmSaveSfw = value.toJson());
        }

        {
            const value = this.getMsgSpmSaveSrw();
            (value != null) && (obj.MsgSpmSaveSrw = value.toJson());
        }

        {
            const value = this.getMsgSpmValidateSrw();
            (value != null) && (obj.MsgSpmValidateSrw = value.toJson());
        }

        {
            const value = this.getMsgSpmGetRankList();
            (value != null) && (obj.MsgSpmGetRankList = value.toJson());
        }

        {
            const value = this.getMsgSpmGetReplayData();
            (value != null) && (obj.MsgSpmGetReplayData = value.toJson());
        }

        {
            const value = this.getMsgMrrSetMaxConcurrentCount();
            (value != null) && (obj.MsgMrrSetMaxConcurrentCount = value.toJson());
        }

        {
            const value = this.getMsgMrrGetMaxConcurrentCount();
            (value != null) && (obj.MsgMrrGetMaxConcurrentCount = value.toJson());
        }

        {
            const value = this.getMsgMrrSetBannedNormalMapIdArray();
            (value != null) && (obj.MsgMrrSetBannedNormalMapIdArray = value.toJson());
        }

        {
            const value = this.getMsgMrrGetBannedNormalMapIdArray();
            (value != null) && (obj.MsgMrrGetBannedNormalMapIdArray = value.toJson());
        }

        {
            const value = this.getMsgMrrSetBootTimerDaysRange();
            (value != null) && (obj.MsgMrrSetBootTimerDaysRange = value.toJson());
        }

        {
            const value = this.getMsgMrrGetBootTimerDaysRange();
            (value != null) && (obj.MsgMrrGetBootTimerDaysRange = value.toJson());
        }

        {
            const value = this.getMsgMrrGetJoinedRoomIdArray();
            (value != null) && (obj.MsgMrrGetJoinedRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgMrrGetRoomPublicInfo();
            (value != null) && (obj.MsgMrrGetRoomPublicInfo = value.toJson());
        }

        {
            const value = this.getMsgMrrDeleteRoomByServer();
            (value != null) && (obj.MsgMrrDeleteRoomByServer = value.toJson());
        }

        {
            const value = this.getMsgMrrSetBannedCoIdArray();
            (value != null) && (obj.MsgMrrSetBannedCoIdArray = value.toJson());
        }

        {
            const value = this.getMsgMrrSetSelfSettings();
            (value != null) && (obj.MsgMrrSetSelfSettings = value.toJson());
        }

        {
            const value = this.getMsgBroadcastGetAllMessageIdArray();
            (value != null) && (obj.MsgBroadcastGetAllMessageIdArray = value.toJson());
        }

        {
            const value = this.getMsgBroadcastAddMessage();
            (value != null) && (obj.MsgBroadcastAddMessage = value.toJson());
        }

        {
            const value = this.getMsgBroadcastDeleteMessage();
            (value != null) && (obj.MsgBroadcastDeleteMessage = value.toJson());
        }

        {
            const value = this.getMsgBroadcastDoBroadcast();
            (value != null) && (obj.MsgBroadcastDoBroadcast = value.toJson());
        }

        {
            const value = this.getMsgBroadcastGetMessageData();
            (value != null) && (obj.MsgBroadcastGetMessageData = value.toJson());
        }

        {
            const value = this.getMsgChangeLogGetMessageList();
            (value != null) && (obj.MsgChangeLogGetMessageList = value.toJson());
        }

        {
            const value = this.getMsgChangeLogAddMessage();
            (value != null) && (obj.MsgChangeLogAddMessage = value.toJson());
        }

        {
            const value = this.getMsgChangeLogModifyMessage();
            (value != null) && (obj.MsgChangeLogModifyMessage = value.toJson());
        }

        {
            const value = this.getMsgMfrCreateRoom();
            (value != null) && (obj.MsgMfrCreateRoom = value.toJson());
        }

        {
            const value = this.getMsgMfrExitRoom();
            (value != null) && (obj.MsgMfrExitRoom = value.toJson());
        }

        {
            const value = this.getMsgMfrJoinRoom();
            (value != null) && (obj.MsgMfrJoinRoom = value.toJson());
        }

        {
            const value = this.getMsgMfrDeleteRoom();
            (value != null) && (obj.MsgMfrDeleteRoom = value.toJson());
        }

        {
            const value = this.getMsgMfrSetReady();
            (value != null) && (obj.MsgMfrSetReady = value.toJson());
        }

        {
            const value = this.getMsgMfrDeletePlayer();
            (value != null) && (obj.MsgMfrDeletePlayer = value.toJson());
        }

        {
            const value = this.getMsgMfrSetSelfSettings();
            (value != null) && (obj.MsgMfrSetSelfSettings = value.toJson());
        }

        {
            const value = this.getMsgMfrStartWar();
            (value != null) && (obj.MsgMfrStartWar = value.toJson());
        }

        {
            const value = this.getMsgMfrGetJoinedRoomIdArray();
            (value != null) && (obj.MsgMfrGetJoinedRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgMfrGetJoinableRoomIdArray();
            (value != null) && (obj.MsgMfrGetJoinableRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgMfrGetRoomStaticInfo();
            (value != null) && (obj.MsgMfrGetRoomStaticInfo = value.toJson());
        }

        {
            const value = this.getMsgMfrGetRoomPlayerInfo();
            (value != null) && (obj.MsgMfrGetRoomPlayerInfo = value.toJson());
        }

        {
            const value = this.getMsgMfrInvite();
            (value != null) && (obj.MsgMfrInvite = value.toJson());
        }

        {
            const value = this.getMsgMfrAddDummy();
            (value != null) && (obj.MsgMfrAddDummy = value.toJson());
        }

        {
            const value = this.getMsgMfrSetDummySettings();
            (value != null) && (obj.MsgMfrSetDummySettings = value.toJson());
        }

        {
            const value = this.getMsgCcrCreateRoom();
            (value != null) && (obj.MsgCcrCreateRoom = value.toJson());
        }

        {
            const value = this.getMsgCcrExitRoom();
            (value != null) && (obj.MsgCcrExitRoom = value.toJson());
        }

        {
            const value = this.getMsgCcrJoinRoom();
            (value != null) && (obj.MsgCcrJoinRoom = value.toJson());
        }

        {
            const value = this.getMsgCcrDeleteRoom();
            (value != null) && (obj.MsgCcrDeleteRoom = value.toJson());
        }

        {
            const value = this.getMsgCcrSetReady();
            (value != null) && (obj.MsgCcrSetReady = value.toJson());
        }

        {
            const value = this.getMsgCcrDeletePlayer();
            (value != null) && (obj.MsgCcrDeletePlayer = value.toJson());
        }

        {
            const value = this.getMsgCcrSetSelfSettings();
            (value != null) && (obj.MsgCcrSetSelfSettings = value.toJson());
        }

        {
            const value = this.getMsgCcrStartWar();
            (value != null) && (obj.MsgCcrStartWar = value.toJson());
        }

        {
            const value = this.getMsgCcrGetJoinedRoomIdArray();
            (value != null) && (obj.MsgCcrGetJoinedRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgCcrGetJoinableRoomIdArray();
            (value != null) && (obj.MsgCcrGetJoinableRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgCcrGetRoomStaticInfo();
            (value != null) && (obj.MsgCcrGetRoomStaticInfo = value.toJson());
        }

        {
            const value = this.getMsgCcrGetRoomPlayerInfo();
            (value != null) && (obj.MsgCcrGetRoomPlayerInfo = value.toJson());
        }

        {
            const value = this.getMsgCcrInvite();
            (value != null) && (obj.MsgCcrInvite = value.toJson());
        }

        {
            const value = this.getMsgCcrAddDummy();
            (value != null) && (obj.MsgCcrAddDummy = value.toJson());
        }

        {
            const value = this.getMsgCcrSetDummySettings();
            (value != null) && (obj.MsgCcrSetDummySettings = value.toJson());
        }

        {
            const value = this.getMsgLbSpmOverallGetTopDataArray();
            (value != null) && (obj.MsgLbSpmOverallGetTopDataArray = value.toJson());
        }

        {
            const value = this.getMsgLbSpmOverallGetRankInfo();
            (value != null) && (obj.MsgLbSpmOverallGetRankInfo = value.toJson());
        }

        {
            const value = this.getMsgLbMrwGetRankIndex();
            (value != null) && (obj.MsgLbMrwGetRankIndex = value.toJson());
        }

        {
            const value = this.getMsgMmrSetMaxConcurrentCount();
            (value != null) && (obj.MsgMmrSetMaxConcurrentCount = value.toJson());
        }

        {
            const value = this.getMsgMmrGetMaxConcurrentCount();
            (value != null) && (obj.MsgMmrGetMaxConcurrentCount = value.toJson());
        }

        {
            const value = this.getMsgMmrSetBannedNormalMapIdArray();
            (value != null) && (obj.MsgMmrSetBannedNormalMapIdArray = value.toJson());
        }

        {
            const value = this.getMsgMmrGetBannedNormalMapIdArray();
            (value != null) && (obj.MsgMmrGetBannedNormalMapIdArray = value.toJson());
        }

        {
            const value = this.getMsgMmrSetBootTimerDaysRange();
            (value != null) && (obj.MsgMmrSetBootTimerDaysRange = value.toJson());
        }

        {
            const value = this.getMsgMmrGetBootTimerDaysRange();
            (value != null) && (obj.MsgMmrGetBootTimerDaysRange = value.toJson());
        }

        {
            const value = this.getMsgMmrGetJoinedRoomIdArray();
            (value != null) && (obj.MsgMmrGetJoinedRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgMmrGetRoomPublicInfo();
            (value != null) && (obj.MsgMmrGetRoomPublicInfo = value.toJson());
        }

        {
            const value = this.getMsgMmrDeleteRoomByServer();
            (value != null) && (obj.MsgMmrDeleteRoomByServer = value.toJson());
        }

        {
            const value = this.getMsgMmrSetBannedCoIdArray();
            (value != null) && (obj.MsgMmrSetBannedCoIdArray = value.toJson());
        }

        {
            const value = this.getMsgMmrSetSelfSettings();
            (value != null) && (obj.MsgMmrSetSelfSettings = value.toJson());
        }

        {
            const value = this.getMsgNormalMapGetAllEnabledBriefDataVersions();
            (value != null) && (obj.MsgNormalMapGetAllEnabledBriefDataVersions = value.toJson());
        }

        {
            const value = this.getMsgNormalMapGetBriefDataVersion();
            (value != null) && (obj.MsgNormalMapGetBriefDataVersion = value.toJson());
        }

        {
            const value = this.getMsgNormalMapGetBriefData();
            (value != null) && (obj.MsgNormalMapGetBriefData = value.toJson());
        }

        {
            const value = this.getMsgNormalMapGetBriefDataArray();
            (value != null) && (obj.MsgNormalMapGetBriefDataArray = value.toJson());
        }

        {
            const value = this.getMsgMapGetRawData();
            (value != null) && (obj.MsgMapGetRawData = value.toJson());
        }

        {
            const value = this.getMsgMapGetMapTag();
            (value != null) && (obj.MsgMapGetMapTag = value.toJson());
        }

        {
            const value = this.getMsgMailGetAllMailArray();
            (value != null) && (obj.MsgMailGetAllMailArray = value.toJson());
        }

        {
            const value = this.getMsgMailGetMail();
            (value != null) && (obj.MsgMailGetMail = value.toJson());
        }

        {
            const value = this.getMsgMailDeleteMail();
            (value != null) && (obj.MsgMailDeleteMail = value.toJson());
        }

        {
            const value = this.getMsgMailSetIsNew();
            (value != null) && (obj.MsgMailSetIsNew = value.toJson());
        }

        {
            const value = this.getMsgAtGetGlobalSettings();
            (value != null) && (obj.MsgAtGetGlobalSettings = value.toJson());
        }

        {
            const value = this.getMsgAtSetGlobalSettings();
            (value != null) && (obj.MsgAtSetGlobalSettings = value.toJson());
        }

        {
            const value = this.getMsgAtCreateTourney();
            (value != null) && (obj.MsgAtCreateTourney = value.toJson());
        }

        {
            const value = this.getMsgAtDeleteLastTourney();
            (value != null) && (obj.MsgAtDeleteLastTourney = value.toJson());
        }

        {
            const value = this.getMsgAtSetRegistrationDuration();
            (value != null) && (obj.MsgAtSetRegistrationDuration = value.toJson());
        }

        {
            const value = this.getMsgAtSetAdjustmentDuration();
            (value != null) && (obj.MsgAtSetAdjustmentDuration = value.toJson());
        }

        {
            const value = this.getMsgAtSetInitialBrackets();
            (value != null) && (obj.MsgAtSetInitialBrackets = value.toJson());
        }

        {
            const value = this.getMsgAtSetMapPool();
            (value != null) && (obj.MsgAtSetMapPool = value.toJson());
        }

        {
            const value = this.getMsgAtSetName();
            (value != null) && (obj.MsgAtSetName = value.toJson());
        }

        {
            const value = this.getMsgAtSetBootTimer();
            (value != null) && (obj.MsgAtSetBootTimer = value.toJson());
        }

        {
            const value = this.getMsgAtGetUserArray();
            (value != null) && (obj.MsgAtGetUserArray = value.toJson());
        }

        {
            const value = this.getMsgAtDeleteUser();
            (value != null) && (obj.MsgAtDeleteUser = value.toJson());
        }

        {
            const value = this.getMsgAtGetPhaseInfo();
            (value != null) && (obj.MsgAtGetPhaseInfo = value.toJson());
        }

        {
            const value = this.getMsgAtGetRegistrationInfo();
            (value != null) && (obj.MsgAtGetRegistrationInfo = value.toJson());
        }

        {
            const value = this.getMsgAtGetTourneyInfo();
            (value != null) && (obj.MsgAtGetTourneyInfo = value.toJson());
        }

        {
            const value = this.getMsgAtGetFullMapInfo();
            (value != null) && (obj.MsgAtGetFullMapInfo = value.toJson());
        }

        {
            const value = this.getMsgAtGetFullBracketInfo();
            (value != null) && (obj.MsgAtGetFullBracketInfo = value.toJson());
        }

        {
            const value = this.getMsgAtRegister();
            (value != null) && (obj.MsgAtRegister = value.toJson());
        }

        {
            const value = this.getMsgAtrGetJoinedRoomIdArray();
            (value != null) && (obj.MsgAtrGetJoinedRoomIdArray = value.toJson());
        }

        {
            const value = this.getMsgAtrGetRoomPublicInfo();
            (value != null) && (obj.MsgAtrGetRoomPublicInfo = value.toJson());
        }

        {
            const value = this.getMsgAtrDeleteRoomByServer();
            (value != null) && (obj.MsgAtrDeleteRoomByServer = value.toJson());
        }

        {
            const value = this.getMsgAtrSetBannedCoIdArray();
            (value != null) && (obj.MsgAtrSetBannedCoIdArray = value.toJson());
        }

        {
            const value = this.getMsgAtrSetSelfSettings();
            (value != null) && (obj.MsgAtrSetSelfSettings = value.toJson());
        }

        {
            const value = this.getMsgGmSetUserPrivilege();
            (value != null) && (obj.MsgGmSetUserPrivilege = value.toJson());
        }

        {
            const value = this.getMsgGmSetUserPassword();
            (value != null) && (obj.MsgGmSetUserPassword = value.toJson());
        }

        {
            const value = this.getMsgGmDeleteMcrRoom();
            (value != null) && (obj.MsgGmDeleteMcrRoom = value.toJson());
        }

        {
            const value = this.getMsgGmDeleteMfrRoom();
            (value != null) && (obj.MsgGmDeleteMfrRoom = value.toJson());
        }

        {
            const value = this.getMsgGmDeleteCcrRoom();
            (value != null) && (obj.MsgGmDeleteCcrRoom = value.toJson());
        }

        {
            const value = this.getMsgGmDeleteMrrRoom();
            (value != null) && (obj.MsgGmDeleteMrrRoom = value.toJson());
        }

        {
            const value = this.getMsgGmDeleteMmrRoom();
            (value != null) && (obj.MsgGmDeleteMmrRoom = value.toJson());
        }

        {
            const value = this.getMsgGmDeleteSpmAllScoreAndReplay();
            (value != null) && (obj.MsgGmDeleteSpmAllScoreAndReplay = value.toJson());
        }

        {
            const value = this.getMsgGmAddUserMedal();
            (value != null) && (obj.MsgGmAddUserMedal = value.toJson());
        }

        {
            const value = this.getMsgGmGenerateReplayStatistics();
            (value != null) && (obj.MsgGmGenerateReplayStatistics = value.toJson());
        }

        {
            const value = this.getMsgGmUpdateReplayInfo();
            (value != null) && (obj.MsgGmUpdateReplayInfo = value.toJson());
        }

        {
            const value = this.getMsgCmGetAllCampaignIdArray();
            (value != null) && (obj.MsgCmGetAllCampaignIdArray = value.toJson());
        }

        {
            const value = this.getMsgCmGetDesigningCampaignIdArray();
            (value != null) && (obj.MsgCmGetDesigningCampaignIdArray = value.toJson());
        }

        {
            const value = this.getMsgCmCreateCampaign();
            (value != null) && (obj.MsgCmCreateCampaign = value.toJson());
        }

        {
            const value = this.getMsgCmCreateCampaignMap();
            (value != null) && (obj.MsgCmCreateCampaignMap = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignName();
            (value != null) && (obj.MsgCmSetCampaignName = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignDesc();
            (value != null) && (obj.MsgCmSetCampaignDesc = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignEnabled();
            (value != null) && (obj.MsgCmSetCampaignEnabled = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignMapEnabled();
            (value != null) && (obj.MsgCmSetCampaignMapEnabled = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignMapRawData();
            (value != null) && (obj.MsgCmSetCampaignMapRawData = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignMapExtraText();
            (value != null) && (obj.MsgCmSetCampaignMapExtraText = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignMapName();
            (value != null) && (obj.MsgCmSetCampaignMapName = value.toJson());
        }

        {
            const value = this.getMsgCmSetCampaignMapWarEventAction();
            (value != null) && (obj.MsgCmSetCampaignMapWarEventAction = value.toJson());
        }

        {
            const value = this.getMsgCmUpdateCampaignDesigners();
            (value != null) && (obj.MsgCmUpdateCampaignDesigners = value.toJson());
        }

        {
            const value = this.getMsgCmSetExtraLink();
            (value != null) && (obj.MsgCmSetExtraLink = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetCampaignInfo();
            (value != null) && (obj.MsgCampaignGetCampaignInfo = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetEnabledCampaignIdArray();
            (value != null) && (obj.MsgCampaignGetEnabledCampaignIdArray = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetAllMapTimestampArray();
            (value != null) && (obj.MsgCampaignGetAllMapTimestampArray = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetMapTimestamp();
            (value != null) && (obj.MsgCampaignGetMapTimestamp = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetMapRawDataArray();
            (value != null) && (obj.MsgCampaignGetMapRawDataArray = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetMapRawData();
            (value != null) && (obj.MsgCampaignGetMapRawData = value.toJson());
        }

        {
            const value = this.getMsgCampaignCreateWar();
            (value != null) && (obj.MsgCampaignCreateWar = value.toJson());
        }

        {
            const value = this.getMsgCampaignSaveWar();
            (value != null) && (obj.MsgCampaignSaveWar = value.toJson());
        }

        {
            const value = this.getMsgCampaignValidateWar();
            (value != null) && (obj.MsgCampaignValidateWar = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetCampaignLeaderboard();
            (value != null) && (obj.MsgCampaignGetCampaignLeaderboard = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetCampaignMapLeaderboard();
            (value != null) && (obj.MsgCampaignGetCampaignMapLeaderboard = value.toJson());
        }

        {
            const value = this.getMsgCampaignGetScore();
            (value != null) && (obj.MsgCampaignGetScore = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMsgCommonHeartbeat();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCommonError();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCommonServerDisconnect();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCommonLatestConfigVersion();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCommonGetServerStatus();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCommonGetRankList();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCommonGetCoStatistics();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserRegister();
            if (value != null) {
                value.toWriter(writer.uint32(162).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserLogin();
            if (value != null) {
                value.toWriter(writer.uint32(170).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserLogout();
            if (value != null) {
                value.toWriter(writer.uint32(178).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserGetPublicInfo();
            if (value != null) {
                value.toWriter(writer.uint32(186).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserGetPublicInfoArray();
            if (value != null) {
                value.toWriter(writer.uint32(194).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserGetBriefInfo();
            if (value != null) {
                value.toWriter(writer.uint32(202).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserGetOnlineState();
            if (value != null) {
                value.toWriter(writer.uint32(210).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserGetOnlineUserIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(218).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetNickname();
            if (value != null) {
                value.toWriter(writer.uint32(226).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetDiscordInfo();
            if (value != null) {
                value.toWriter(writer.uint32(234).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetCoBgmSettings();
            if (value != null) {
                value.toWriter(writer.uint32(242).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetSceneBgmSettings();
            if (value != null) {
                value.toWriter(writer.uint32(250).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetPassword();
            if (value != null) {
                value.toWriter(writer.uint32(258).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetSettings();
            if (value != null) {
                value.toWriter(writer.uint32(266).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetMapRating();
            if (value != null) {
                value.toWriter(writer.uint32(274).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetAvatarId();
            if (value != null) {
                value.toWriter(writer.uint32(282).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetMapEditorAutoSaveTime();
            if (value != null) {
                value.toWriter(writer.uint32(290).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserLoginAsGuest();
            if (value != null) {
                value.toWriter(writer.uint32(298).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserGetUsersByNickname();
            if (value != null) {
                value.toWriter(writer.uint32(306).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetRelation();
            if (value != null) {
                value.toWriter(writer.uint32(314).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserSetShowMedalIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(322).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserModifyFavoriteReplayIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(330).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserRequestEmailVerificationCode();
            if (value != null) {
                value.toWriter(writer.uint32(338).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserVerifyEmail();
            if (value != null) {
                value.toWriter(writer.uint32(346).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserRequestPasswordVerificationCode();
            if (value != null) {
                value.toWriter(writer.uint32(354).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgUserResetPasswordWithEmail();
            if (value != null) {
                value.toWriter(writer.uint32(362).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMeGetAllMapDataTimestamps();
            if (value != null) {
                value.toWriter(writer.uint32(482).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMeGetMapDataTimestamp();
            if (value != null) {
                value.toWriter(writer.uint32(490).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMeGetMapDataArray();
            if (value != null) {
                value.toWriter(writer.uint32(498).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMeGetMapData();
            if (value != null) {
                value.toWriter(writer.uint32(506).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMeSubmitNormalMap();
            if (value != null) {
                value.toWriter(writer.uint32(514).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMeDeleteSlot();
            if (value != null) {
                value.toWriter(writer.uint32(522).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChatAddMessage();
            if (value != null) {
                value.toWriter(writer.uint32(642).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChatGetAllMessages();
            if (value != null) {
                value.toWriter(writer.uint32(650).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChatUpdateReadProgress();
            if (value != null) {
                value.toWriter(writer.uint32(658).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChatGetAllReadProgressList();
            if (value != null) {
                value.toWriter(writer.uint32(666).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChatDeleteMessage();
            if (value != null) {
                value.toWriter(writer.uint32(674).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSetWarRuleAvailability();
            if (value != null) {
                value.toWriter(writer.uint32(802).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSetMapEnabled();
            if (value != null) {
                value.toWriter(writer.uint32(810).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmGetReviewingMaps();
            if (value != null) {
                value.toWriter(writer.uint32(818).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmReviewMap();
            if (value != null) {
                value.toWriter(writer.uint32(826).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSetMapTagIdFlags();
            if (value != null) {
                value.toWriter(writer.uint32(834).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSetMapName();
            if (value != null) {
                value.toWriter(writer.uint32(842).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmAddWarRule();
            if (value != null) {
                value.toWriter(writer.uint32(850).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmAddWarEvent();
            if (value != null) {
                value.toWriter(writer.uint32(858).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmDeleteWarRule();
            if (value != null) {
                value.toWriter(writer.uint32(866).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmDeleteRedundantWarEvent();
            if (value != null) {
                value.toWriter(writer.uint32(874).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSetWarRuleName();
            if (value != null) {
                value.toWriter(writer.uint32(882).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSetWarRuleFixedTileTheme();
            if (value != null) {
                value.toWriter(writer.uint32(890).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSetMapTagSingleData();
            if (value != null) {
                value.toWriter(writer.uint32(898).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmSubmitMapSimpleDialogue();
            if (value != null) {
                value.toWriter(writer.uint32(906).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmAddIgnoredReviewingMap();
            if (value != null) {
                value.toWriter(writer.uint32(914).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgReplaySetSelfRating();
            if (value != null) {
                value.toWriter(writer.uint32(962).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgReplayGetSelfRating();
            if (value != null) {
                value.toWriter(writer.uint32(970).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgReplayGetData();
            if (value != null) {
                value.toWriter(writer.uint32(986).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgReplayGetReplayInfo();
            if (value != null) {
                value.toWriter(writer.uint32(994).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgReplayGetReplayInfoArray();
            if (value != null) {
                value.toWriter(writer.uint32(1002).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgReplayGetAllInfoVersions();
            if (value != null) {
                value.toWriter(writer.uint32(1010).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgReplayGetInfoVersion();
            if (value != null) {
                value.toWriter(writer.uint32(1018).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrCreateRoom();
            if (value != null) {
                value.toWriter(writer.uint32(1122).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrExitRoom();
            if (value != null) {
                value.toWriter(writer.uint32(1130).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrJoinRoom();
            if (value != null) {
                value.toWriter(writer.uint32(1138).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrDeleteRoom();
            if (value != null) {
                value.toWriter(writer.uint32(1146).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrSetReady();
            if (value != null) {
                value.toWriter(writer.uint32(1154).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrDeletePlayer();
            if (value != null) {
                value.toWriter(writer.uint32(1162).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrSetSelfSettings();
            if (value != null) {
                value.toWriter(writer.uint32(1170).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrStartWar();
            if (value != null) {
                value.toWriter(writer.uint32(1178).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrGetJoinedRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(1186).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrGetJoinableRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(1194).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrGetRoomStaticInfo();
            if (value != null) {
                value.toWriter(writer.uint32(1202).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrGetRoomPlayerInfo();
            if (value != null) {
                value.toWriter(writer.uint32(1210).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrInvite();
            if (value != null) {
                value.toWriter(writer.uint32(1218).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrAddDummy();
            if (value != null) {
                value.toWriter(writer.uint32(1226).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMcrSetDummySettings();
            if (value != null) {
                value.toWriter(writer.uint32(1234).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonGetJoinedMpwIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(1282).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonGetWarTimestamp();
            if (value != null) {
                value.toWriter(writer.uint32(1290).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonGetUnitStatistics();
            if (value != null) {
                value.toWriter(writer.uint32(1298).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonContinueWar();
            if (value != null) {
                value.toWriter(writer.uint32(1330).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonSyncWar();
            if (value != null) {
                value.toWriter(writer.uint32(1338).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonHandleBoot();
            if (value != null) {
                value.toWriter(writer.uint32(1346).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonBroadcastGameStart();
            if (value != null) {
                value.toWriter(writer.uint32(1354).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonGetWarSettings();
            if (value != null) {
                value.toWriter(writer.uint32(1362).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonGetWarProgressInfo();
            if (value != null) {
                value.toWriter(writer.uint32(1370).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonMarkGrid();
            if (value != null) {
                value.toWriter(writer.uint32(1378).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonSetHiddenGridMarkTypeIdList();
            if (value != null) {
                value.toWriter(writer.uint32(1386).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonSetGridMarkList();
            if (value != null) {
                value.toWriter(writer.uint32(1394).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwCommonGetHalfwayReplayData();
            if (value != null) {
                value.toWriter(writer.uint32(1402).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchMakeRequest();
            if (value != null) {
                value.toWriter(writer.uint32(1442).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchHandleRequest();
            if (value != null) {
                value.toWriter(writer.uint32(1450).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchDeleteWatcher();
            if (value != null) {
                value.toWriter(writer.uint32(1458).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchGetRequestableWarIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(1466).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchGetOngoingWarIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(1474).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchGetRequestedWarIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(1482).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchGetWatchedWarIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(1490).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchContinueWar();
            if (value != null) {
                value.toWriter(writer.uint32(1498).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchGetIncomingInfo();
            if (value != null) {
                value.toWriter(writer.uint32(1506).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwWatchGetOutgoingInfo();
            if (value != null) {
                value.toWriter(writer.uint32(1514).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMpwExecuteWarOperation();
            if (value != null) {
                value.toWriter(writer.uint32(1602).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmCreateScw();
            if (value != null) {
                value.toWriter(writer.uint32(1922).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmCreateSfw();
            if (value != null) {
                value.toWriter(writer.uint32(1930).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmCreateSrw();
            if (value != null) {
                value.toWriter(writer.uint32(1938).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmGetAllWarSaveSlotTimestamps();
            if (value != null) {
                value.toWriter(writer.uint32(1946).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmGetWarSaveSlotFullData();
            if (value != null) {
                value.toWriter(writer.uint32(1954).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmGetWarSaveSlotFullDataArray();
            if (value != null) {
                value.toWriter(writer.uint32(1962).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmDeleteWarSaveSlot();
            if (value != null) {
                value.toWriter(writer.uint32(1970).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmSaveScw();
            if (value != null) {
                value.toWriter(writer.uint32(1978).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmSaveSfw();
            if (value != null) {
                value.toWriter(writer.uint32(1986).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmSaveSrw();
            if (value != null) {
                value.toWriter(writer.uint32(1994).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmValidateSrw();
            if (value != null) {
                value.toWriter(writer.uint32(2002).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmGetRankList();
            if (value != null) {
                value.toWriter(writer.uint32(2010).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgSpmGetReplayData();
            if (value != null) {
                value.toWriter(writer.uint32(2018).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrSetMaxConcurrentCount();
            if (value != null) {
                value.toWriter(writer.uint32(2082).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrGetMaxConcurrentCount();
            if (value != null) {
                value.toWriter(writer.uint32(2090).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrSetBannedNormalMapIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2098).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrGetBannedNormalMapIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2106).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrSetBootTimerDaysRange();
            if (value != null) {
                value.toWriter(writer.uint32(2114).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrGetBootTimerDaysRange();
            if (value != null) {
                value.toWriter(writer.uint32(2122).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrGetJoinedRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2130).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrGetRoomPublicInfo();
            if (value != null) {
                value.toWriter(writer.uint32(2138).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrDeleteRoomByServer();
            if (value != null) {
                value.toWriter(writer.uint32(2146).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrSetBannedCoIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2154).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMrrSetSelfSettings();
            if (value != null) {
                value.toWriter(writer.uint32(2162).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgBroadcastGetAllMessageIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2242).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgBroadcastAddMessage();
            if (value != null) {
                value.toWriter(writer.uint32(2250).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgBroadcastDeleteMessage();
            if (value != null) {
                value.toWriter(writer.uint32(2258).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgBroadcastDoBroadcast();
            if (value != null) {
                value.toWriter(writer.uint32(2266).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgBroadcastGetMessageData();
            if (value != null) {
                value.toWriter(writer.uint32(2274).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChangeLogGetMessageList();
            if (value != null) {
                value.toWriter(writer.uint32(2402).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChangeLogAddMessage();
            if (value != null) {
                value.toWriter(writer.uint32(2410).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgChangeLogModifyMessage();
            if (value != null) {
                value.toWriter(writer.uint32(2418).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrCreateRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2562).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrExitRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2570).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrJoinRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2578).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrDeleteRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2586).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrSetReady();
            if (value != null) {
                value.toWriter(writer.uint32(2594).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrDeletePlayer();
            if (value != null) {
                value.toWriter(writer.uint32(2602).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrSetSelfSettings();
            if (value != null) {
                value.toWriter(writer.uint32(2610).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrStartWar();
            if (value != null) {
                value.toWriter(writer.uint32(2618).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrGetJoinedRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2626).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrGetJoinableRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2634).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrGetRoomStaticInfo();
            if (value != null) {
                value.toWriter(writer.uint32(2642).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrGetRoomPlayerInfo();
            if (value != null) {
                value.toWriter(writer.uint32(2650).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrInvite();
            if (value != null) {
                value.toWriter(writer.uint32(2658).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrAddDummy();
            if (value != null) {
                value.toWriter(writer.uint32(2666).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMfrSetDummySettings();
            if (value != null) {
                value.toWriter(writer.uint32(2674).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrCreateRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2722).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrExitRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2730).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrJoinRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2738).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrDeleteRoom();
            if (value != null) {
                value.toWriter(writer.uint32(2746).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrSetReady();
            if (value != null) {
                value.toWriter(writer.uint32(2754).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrDeletePlayer();
            if (value != null) {
                value.toWriter(writer.uint32(2762).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrSetSelfSettings();
            if (value != null) {
                value.toWriter(writer.uint32(2770).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrStartWar();
            if (value != null) {
                value.toWriter(writer.uint32(2778).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrGetJoinedRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2786).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrGetJoinableRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(2794).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrGetRoomStaticInfo();
            if (value != null) {
                value.toWriter(writer.uint32(2802).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrGetRoomPlayerInfo();
            if (value != null) {
                value.toWriter(writer.uint32(2810).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrInvite();
            if (value != null) {
                value.toWriter(writer.uint32(2818).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrAddDummy();
            if (value != null) {
                value.toWriter(writer.uint32(2826).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCcrSetDummySettings();
            if (value != null) {
                value.toWriter(writer.uint32(2834).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgLbSpmOverallGetTopDataArray();
            if (value != null) {
                value.toWriter(writer.uint32(2882).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgLbSpmOverallGetRankInfo();
            if (value != null) {
                value.toWriter(writer.uint32(2890).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgLbMrwGetRankIndex();
            if (value != null) {
                value.toWriter(writer.uint32(2898).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrSetMaxConcurrentCount();
            if (value != null) {
                value.toWriter(writer.uint32(3042).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrGetMaxConcurrentCount();
            if (value != null) {
                value.toWriter(writer.uint32(3050).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrSetBannedNormalMapIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(3058).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrGetBannedNormalMapIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(3066).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrSetBootTimerDaysRange();
            if (value != null) {
                value.toWriter(writer.uint32(3074).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrGetBootTimerDaysRange();
            if (value != null) {
                value.toWriter(writer.uint32(3082).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrGetJoinedRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(3090).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrGetRoomPublicInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3098).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrDeleteRoomByServer();
            if (value != null) {
                value.toWriter(writer.uint32(3106).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrSetBannedCoIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(3114).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMmrSetSelfSettings();
            if (value != null) {
                value.toWriter(writer.uint32(3122).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgNormalMapGetAllEnabledBriefDataVersions();
            if (value != null) {
                value.toWriter(writer.uint32(3202).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgNormalMapGetBriefDataVersion();
            if (value != null) {
                value.toWriter(writer.uint32(3210).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgNormalMapGetBriefData();
            if (value != null) {
                value.toWriter(writer.uint32(3218).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgNormalMapGetBriefDataArray();
            if (value != null) {
                value.toWriter(writer.uint32(3226).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMapGetRawData();
            if (value != null) {
                value.toWriter(writer.uint32(3234).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMapGetMapTag();
            if (value != null) {
                value.toWriter(writer.uint32(3242).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMailGetAllMailArray();
            if (value != null) {
                value.toWriter(writer.uint32(3362).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMailGetMail();
            if (value != null) {
                value.toWriter(writer.uint32(3370).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMailDeleteMail();
            if (value != null) {
                value.toWriter(writer.uint32(3378).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgMailSetIsNew();
            if (value != null) {
                value.toWriter(writer.uint32(3386).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtGetGlobalSettings();
            if (value != null) {
                value.toWriter(writer.uint32(3522).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtSetGlobalSettings();
            if (value != null) {
                value.toWriter(writer.uint32(3530).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtCreateTourney();
            if (value != null) {
                value.toWriter(writer.uint32(3538).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtDeleteLastTourney();
            if (value != null) {
                value.toWriter(writer.uint32(3546).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtSetRegistrationDuration();
            if (value != null) {
                value.toWriter(writer.uint32(3554).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtSetAdjustmentDuration();
            if (value != null) {
                value.toWriter(writer.uint32(3562).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtSetInitialBrackets();
            if (value != null) {
                value.toWriter(writer.uint32(3570).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtSetMapPool();
            if (value != null) {
                value.toWriter(writer.uint32(3578).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtSetName();
            if (value != null) {
                value.toWriter(writer.uint32(3586).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtSetBootTimer();
            if (value != null) {
                value.toWriter(writer.uint32(3594).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtGetUserArray();
            if (value != null) {
                value.toWriter(writer.uint32(3602).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtDeleteUser();
            if (value != null) {
                value.toWriter(writer.uint32(3610).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtGetPhaseInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3618).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtGetRegistrationInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3626).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtGetTourneyInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3634).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtGetFullMapInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3642).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtGetFullBracketInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3650).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtRegister();
            if (value != null) {
                value.toWriter(writer.uint32(3658).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtrGetJoinedRoomIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(3682).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtrGetRoomPublicInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3690).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtrDeleteRoomByServer();
            if (value != null) {
                value.toWriter(writer.uint32(3698).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtrSetBannedCoIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(3706).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgAtrSetSelfSettings();
            if (value != null) {
                value.toWriter(writer.uint32(3714).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmSetUserPrivilege();
            if (value != null) {
                value.toWriter(writer.uint32(3842).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmSetUserPassword();
            if (value != null) {
                value.toWriter(writer.uint32(3850).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmDeleteMcrRoom();
            if (value != null) {
                value.toWriter(writer.uint32(3858).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmDeleteMfrRoom();
            if (value != null) {
                value.toWriter(writer.uint32(3866).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmDeleteCcrRoom();
            if (value != null) {
                value.toWriter(writer.uint32(3874).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmDeleteMrrRoom();
            if (value != null) {
                value.toWriter(writer.uint32(3882).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmDeleteMmrRoom();
            if (value != null) {
                value.toWriter(writer.uint32(3890).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmDeleteSpmAllScoreAndReplay();
            if (value != null) {
                value.toWriter(writer.uint32(3898).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmAddUserMedal();
            if (value != null) {
                value.toWriter(writer.uint32(3906).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmGenerateReplayStatistics();
            if (value != null) {
                value.toWriter(writer.uint32(3914).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgGmUpdateReplayInfo();
            if (value != null) {
                value.toWriter(writer.uint32(3922).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmGetAllCampaignIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(4002).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmGetDesigningCampaignIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(4010).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmCreateCampaign();
            if (value != null) {
                value.toWriter(writer.uint32(4018).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmCreateCampaignMap();
            if (value != null) {
                value.toWriter(writer.uint32(4026).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignName();
            if (value != null) {
                value.toWriter(writer.uint32(4034).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignDesc();
            if (value != null) {
                value.toWriter(writer.uint32(4042).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignEnabled();
            if (value != null) {
                value.toWriter(writer.uint32(4050).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignMapEnabled();
            if (value != null) {
                value.toWriter(writer.uint32(4058).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignMapRawData();
            if (value != null) {
                value.toWriter(writer.uint32(4066).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignMapExtraText();
            if (value != null) {
                value.toWriter(writer.uint32(4074).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignMapName();
            if (value != null) {
                value.toWriter(writer.uint32(4082).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetCampaignMapWarEventAction();
            if (value != null) {
                value.toWriter(writer.uint32(4090).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmUpdateCampaignDesigners();
            if (value != null) {
                value.toWriter(writer.uint32(4098).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCmSetExtraLink();
            if (value != null) {
                value.toWriter(writer.uint32(4106).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetCampaignInfo();
            if (value != null) {
                value.toWriter(writer.uint32(4162).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetEnabledCampaignIdArray();
            if (value != null) {
                value.toWriter(writer.uint32(4170).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetAllMapTimestampArray();
            if (value != null) {
                value.toWriter(writer.uint32(4178).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetMapTimestamp();
            if (value != null) {
                value.toWriter(writer.uint32(4186).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetMapRawDataArray();
            if (value != null) {
                value.toWriter(writer.uint32(4194).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetMapRawData();
            if (value != null) {
                value.toWriter(writer.uint32(4202).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignCreateWar();
            if (value != null) {
                value.toWriter(writer.uint32(4210).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignSaveWar();
            if (value != null) {
                value.toWriter(writer.uint32(4218).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignValidateWar();
            if (value != null) {
                value.toWriter(writer.uint32(4226).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetCampaignLeaderboard();
            if (value != null) {
                value.toWriter(writer.uint32(4234).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetCampaignMapLeaderboard();
            if (value != null) {
                value.toWriter(writer.uint32(4242).fork()).ldelim();
            }
        }

        {
            const value = this.getMsgCampaignGetScore();
            if (value != null) {
                value.toWriter(writer.uint32(4250).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MessageContainer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MessageContainer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMsgCommonHeartbeat($Message$CommonProto$NetMessage$MsgCommonHeartbeat.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setMsgCommonError($Message$CommonProto$NetMessage$MsgCommonError.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setMsgCommonServerDisconnect($Message$CommonProto$NetMessage$MsgCommonServerDisconnect.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setMsgCommonLatestConfigVersion($Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setMsgCommonGetServerStatus($Message$CommonProto$NetMessage$MsgCommonGetServerStatus.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setMsgCommonGetRankList($Message$CommonProto$NetMessage$MsgCommonGetRankList.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setMsgCommonGetCoStatistics($Message$CommonProto$NetMessage$MsgCommonGetCoStatistics.decode(reader, reader.uint32()));
                    break;

                case 20:
                    msg.setMsgUserRegister($Message$CommonProto$NetMessage$MsgUserRegister.decode(reader, reader.uint32()));
                    break;

                case 21:
                    msg.setMsgUserLogin($Message$CommonProto$NetMessage$MsgUserLogin.decode(reader, reader.uint32()));
                    break;

                case 22:
                    msg.setMsgUserLogout($Message$CommonProto$NetMessage$MsgUserLogout.decode(reader, reader.uint32()));
                    break;

                case 23:
                    msg.setMsgUserGetPublicInfo($Message$CommonProto$NetMessage$MsgUserGetPublicInfo.decode(reader, reader.uint32()));
                    break;

                case 24:
                    msg.setMsgUserGetPublicInfoArray($Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray.decode(reader, reader.uint32()));
                    break;

                case 25:
                    msg.setMsgUserGetBriefInfo($Message$CommonProto$NetMessage$MsgUserGetBriefInfo.decode(reader, reader.uint32()));
                    break;

                case 26:
                    msg.setMsgUserGetOnlineState($Message$CommonProto$NetMessage$MsgUserGetOnlineState.decode(reader, reader.uint32()));
                    break;

                case 27:
                    msg.setMsgUserGetOnlineUserIdArray($Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray.decode(reader, reader.uint32()));
                    break;

                case 28:
                    msg.setMsgUserSetNickname($Message$CommonProto$NetMessage$MsgUserSetNickname.decode(reader, reader.uint32()));
                    break;

                case 29:
                    msg.setMsgUserSetDiscordInfo($Message$CommonProto$NetMessage$MsgUserSetDiscordInfo.decode(reader, reader.uint32()));
                    break;

                case 30:
                    msg.setMsgUserSetCoBgmSettings($Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings.decode(reader, reader.uint32()));
                    break;

                case 31:
                    msg.setMsgUserSetSceneBgmSettings($Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings.decode(reader, reader.uint32()));
                    break;

                case 32:
                    msg.setMsgUserSetPassword($Message$CommonProto$NetMessage$MsgUserSetPassword.decode(reader, reader.uint32()));
                    break;

                case 33:
                    msg.setMsgUserSetSettings($Message$CommonProto$NetMessage$MsgUserSetSettings.decode(reader, reader.uint32()));
                    break;

                case 34:
                    msg.setMsgUserSetMapRating($Message$CommonProto$NetMessage$MsgUserSetMapRating.decode(reader, reader.uint32()));
                    break;

                case 35:
                    msg.setMsgUserSetAvatarId($Message$CommonProto$NetMessage$MsgUserSetAvatarId.decode(reader, reader.uint32()));
                    break;

                case 36:
                    msg.setMsgUserSetMapEditorAutoSaveTime($Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime.decode(reader, reader.uint32()));
                    break;

                case 37:
                    msg.setMsgUserLoginAsGuest($Message$CommonProto$NetMessage$MsgUserLoginAsGuest.decode(reader, reader.uint32()));
                    break;

                case 38:
                    msg.setMsgUserGetUsersByNickname($Message$CommonProto$NetMessage$MsgUserGetUsersByNickname.decode(reader, reader.uint32()));
                    break;

                case 39:
                    msg.setMsgUserSetRelation($Message$CommonProto$NetMessage$MsgUserSetRelation.decode(reader, reader.uint32()));
                    break;

                case 40:
                    msg.setMsgUserSetShowMedalIdArray($Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray.decode(reader, reader.uint32()));
                    break;

                case 41:
                    msg.setMsgUserModifyFavoriteReplayIdArray($Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray.decode(reader, reader.uint32()));
                    break;

                case 42:
                    msg.setMsgUserRequestEmailVerificationCode($Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode.decode(reader, reader.uint32()));
                    break;

                case 43:
                    msg.setMsgUserVerifyEmail($Message$CommonProto$NetMessage$MsgUserVerifyEmail.decode(reader, reader.uint32()));
                    break;

                case 44:
                    msg.setMsgUserRequestPasswordVerificationCode($Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode.decode(reader, reader.uint32()));
                    break;

                case 45:
                    msg.setMsgUserResetPasswordWithEmail($Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail.decode(reader, reader.uint32()));
                    break;

                case 60:
                    msg.setMsgMeGetAllMapDataTimestamps($Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps.decode(reader, reader.uint32()));
                    break;

                case 61:
                    msg.setMsgMeGetMapDataTimestamp($Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp.decode(reader, reader.uint32()));
                    break;

                case 62:
                    msg.setMsgMeGetMapDataArray($Message$CommonProto$NetMessage$MsgMeGetMapDataArray.decode(reader, reader.uint32()));
                    break;

                case 63:
                    msg.setMsgMeGetMapData($Message$CommonProto$NetMessage$MsgMeGetMapData.decode(reader, reader.uint32()));
                    break;

                case 64:
                    msg.setMsgMeSubmitNormalMap($Message$CommonProto$NetMessage$MsgMeSubmitNormalMap.decode(reader, reader.uint32()));
                    break;

                case 65:
                    msg.setMsgMeDeleteSlot($Message$CommonProto$NetMessage$MsgMeDeleteSlot.decode(reader, reader.uint32()));
                    break;

                case 80:
                    msg.setMsgChatAddMessage($Message$CommonProto$NetMessage$MsgChatAddMessage.decode(reader, reader.uint32()));
                    break;

                case 81:
                    msg.setMsgChatGetAllMessages($Message$CommonProto$NetMessage$MsgChatGetAllMessages.decode(reader, reader.uint32()));
                    break;

                case 82:
                    msg.setMsgChatUpdateReadProgress($Message$CommonProto$NetMessage$MsgChatUpdateReadProgress.decode(reader, reader.uint32()));
                    break;

                case 83:
                    msg.setMsgChatGetAllReadProgressList($Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList.decode(reader, reader.uint32()));
                    break;

                case 84:
                    msg.setMsgChatDeleteMessage($Message$CommonProto$NetMessage$MsgChatDeleteMessage.decode(reader, reader.uint32()));
                    break;

                case 100:
                    msg.setMsgMmSetWarRuleAvailability($Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability.decode(reader, reader.uint32()));
                    break;

                case 101:
                    msg.setMsgMmSetMapEnabled($Message$CommonProto$NetMessage$MsgMmSetMapEnabled.decode(reader, reader.uint32()));
                    break;

                case 102:
                    msg.setMsgMmGetReviewingMaps($Message$CommonProto$NetMessage$MsgMmGetReviewingMaps.decode(reader, reader.uint32()));
                    break;

                case 103:
                    msg.setMsgMmReviewMap($Message$CommonProto$NetMessage$MsgMmReviewMap.decode(reader, reader.uint32()));
                    break;

                case 104:
                    msg.setMsgMmSetMapTagIdFlags($Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags.decode(reader, reader.uint32()));
                    break;

                case 105:
                    msg.setMsgMmSetMapName($Message$CommonProto$NetMessage$MsgMmSetMapName.decode(reader, reader.uint32()));
                    break;

                case 106:
                    msg.setMsgMmAddWarRule($Message$CommonProto$NetMessage$MsgMmAddWarRule.decode(reader, reader.uint32()));
                    break;

                case 107:
                    msg.setMsgMmAddWarEvent($Message$CommonProto$NetMessage$MsgMmAddWarEvent.decode(reader, reader.uint32()));
                    break;

                case 108:
                    msg.setMsgMmDeleteWarRule($Message$CommonProto$NetMessage$MsgMmDeleteWarRule.decode(reader, reader.uint32()));
                    break;

                case 109:
                    msg.setMsgMmDeleteRedundantWarEvent($Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent.decode(reader, reader.uint32()));
                    break;

                case 110:
                    msg.setMsgMmSetWarRuleName($Message$CommonProto$NetMessage$MsgMmSetWarRuleName.decode(reader, reader.uint32()));
                    break;

                case 111:
                    msg.setMsgMmSetWarRuleFixedTileTheme($Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme.decode(reader, reader.uint32()));
                    break;

                case 112:
                    msg.setMsgMmSetMapTagSingleData($Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData.decode(reader, reader.uint32()));
                    break;

                case 113:
                    msg.setMsgMmSubmitMapSimpleDialogue($Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue.decode(reader, reader.uint32()));
                    break;

                case 114:
                    msg.setMsgMmAddIgnoredReviewingMap($Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap.decode(reader, reader.uint32()));
                    break;

                case 120:
                    msg.setMsgReplaySetSelfRating($Message$CommonProto$NetMessage$MsgReplaySetSelfRating.decode(reader, reader.uint32()));
                    break;

                case 121:
                    msg.setMsgReplayGetSelfRating($Message$CommonProto$NetMessage$MsgReplayGetSelfRating.decode(reader, reader.uint32()));
                    break;

                case 123:
                    msg.setMsgReplayGetData($Message$CommonProto$NetMessage$MsgReplayGetData.decode(reader, reader.uint32()));
                    break;

                case 124:
                    msg.setMsgReplayGetReplayInfo($Message$CommonProto$NetMessage$MsgReplayGetReplayInfo.decode(reader, reader.uint32()));
                    break;

                case 125:
                    msg.setMsgReplayGetReplayInfoArray($Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray.decode(reader, reader.uint32()));
                    break;

                case 126:
                    msg.setMsgReplayGetAllInfoVersions($Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions.decode(reader, reader.uint32()));
                    break;

                case 127:
                    msg.setMsgReplayGetInfoVersion($Message$CommonProto$NetMessage$MsgReplayGetInfoVersion.decode(reader, reader.uint32()));
                    break;

                case 140:
                    msg.setMsgMcrCreateRoom($Message$CommonProto$NetMessage$MsgMcrCreateRoom.decode(reader, reader.uint32()));
                    break;

                case 141:
                    msg.setMsgMcrExitRoom($Message$CommonProto$NetMessage$MsgMcrExitRoom.decode(reader, reader.uint32()));
                    break;

                case 142:
                    msg.setMsgMcrJoinRoom($Message$CommonProto$NetMessage$MsgMcrJoinRoom.decode(reader, reader.uint32()));
                    break;

                case 143:
                    msg.setMsgMcrDeleteRoom($Message$CommonProto$NetMessage$MsgMcrDeleteRoom.decode(reader, reader.uint32()));
                    break;

                case 144:
                    msg.setMsgMcrSetReady($Message$CommonProto$NetMessage$MsgMcrSetReady.decode(reader, reader.uint32()));
                    break;

                case 145:
                    msg.setMsgMcrDeletePlayer($Message$CommonProto$NetMessage$MsgMcrDeletePlayer.decode(reader, reader.uint32()));
                    break;

                case 146:
                    msg.setMsgMcrSetSelfSettings($Message$CommonProto$NetMessage$MsgMcrSetSelfSettings.decode(reader, reader.uint32()));
                    break;

                case 147:
                    msg.setMsgMcrStartWar($Message$CommonProto$NetMessage$MsgMcrStartWar.decode(reader, reader.uint32()));
                    break;

                case 148:
                    msg.setMsgMcrGetJoinedRoomIdArray($Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 149:
                    msg.setMsgMcrGetJoinableRoomIdArray($Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 150:
                    msg.setMsgMcrGetRoomStaticInfo($Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo.decode(reader, reader.uint32()));
                    break;

                case 151:
                    msg.setMsgMcrGetRoomPlayerInfo($Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo.decode(reader, reader.uint32()));
                    break;

                case 152:
                    msg.setMsgMcrInvite($Message$CommonProto$NetMessage$MsgMcrInvite.decode(reader, reader.uint32()));
                    break;

                case 153:
                    msg.setMsgMcrAddDummy($Message$CommonProto$NetMessage$MsgMcrAddDummy.decode(reader, reader.uint32()));
                    break;

                case 154:
                    msg.setMsgMcrSetDummySettings($Message$CommonProto$NetMessage$MsgMcrSetDummySettings.decode(reader, reader.uint32()));
                    break;

                case 160:
                    msg.setMsgMpwCommonGetJoinedMpwIdArray($Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray.decode(reader, reader.uint32()));
                    break;

                case 161:
                    msg.setMsgMpwCommonGetWarTimestamp($Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp.decode(reader, reader.uint32()));
                    break;

                case 162:
                    msg.setMsgMpwCommonGetUnitStatistics($Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics.decode(reader, reader.uint32()));
                    break;

                case 166:
                    msg.setMsgMpwCommonContinueWar($Message$CommonProto$NetMessage$MsgMpwCommonContinueWar.decode(reader, reader.uint32()));
                    break;

                case 167:
                    msg.setMsgMpwCommonSyncWar($Message$CommonProto$NetMessage$MsgMpwCommonSyncWar.decode(reader, reader.uint32()));
                    break;

                case 168:
                    msg.setMsgMpwCommonHandleBoot($Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot.decode(reader, reader.uint32()));
                    break;

                case 169:
                    msg.setMsgMpwCommonBroadcastGameStart($Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart.decode(reader, reader.uint32()));
                    break;

                case 170:
                    msg.setMsgMpwCommonGetWarSettings($Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings.decode(reader, reader.uint32()));
                    break;

                case 171:
                    msg.setMsgMpwCommonGetWarProgressInfo($Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo.decode(reader, reader.uint32()));
                    break;

                case 172:
                    msg.setMsgMpwCommonMarkGrid($Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid.decode(reader, reader.uint32()));
                    break;

                case 173:
                    msg.setMsgMpwCommonSetHiddenGridMarkTypeIdList($Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList.decode(reader, reader.uint32()));
                    break;

                case 174:
                    msg.setMsgMpwCommonSetGridMarkList($Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList.decode(reader, reader.uint32()));
                    break;

                case 175:
                    msg.setMsgMpwCommonGetHalfwayReplayData($Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData.decode(reader, reader.uint32()));
                    break;

                case 180:
                    msg.setMsgMpwWatchMakeRequest($Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest.decode(reader, reader.uint32()));
                    break;

                case 181:
                    msg.setMsgMpwWatchHandleRequest($Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest.decode(reader, reader.uint32()));
                    break;

                case 182:
                    msg.setMsgMpwWatchDeleteWatcher($Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher.decode(reader, reader.uint32()));
                    break;

                case 183:
                    msg.setMsgMpwWatchGetRequestableWarIdArray($Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray.decode(reader, reader.uint32()));
                    break;

                case 184:
                    msg.setMsgMpwWatchGetOngoingWarIdArray($Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray.decode(reader, reader.uint32()));
                    break;

                case 185:
                    msg.setMsgMpwWatchGetRequestedWarIdArray($Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray.decode(reader, reader.uint32()));
                    break;

                case 186:
                    msg.setMsgMpwWatchGetWatchedWarIdArray($Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray.decode(reader, reader.uint32()));
                    break;

                case 187:
                    msg.setMsgMpwWatchContinueWar($Message$CommonProto$NetMessage$MsgMpwWatchContinueWar.decode(reader, reader.uint32()));
                    break;

                case 188:
                    msg.setMsgMpwWatchGetIncomingInfo($Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo.decode(reader, reader.uint32()));
                    break;

                case 189:
                    msg.setMsgMpwWatchGetOutgoingInfo($Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo.decode(reader, reader.uint32()));
                    break;

                case 200:
                    msg.setMsgMpwExecuteWarOperation($Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation.decode(reader, reader.uint32()));
                    break;

                case 240:
                    msg.setMsgSpmCreateScw($Message$CommonProto$NetMessage$MsgSpmCreateScw.decode(reader, reader.uint32()));
                    break;

                case 241:
                    msg.setMsgSpmCreateSfw($Message$CommonProto$NetMessage$MsgSpmCreateSfw.decode(reader, reader.uint32()));
                    break;

                case 242:
                    msg.setMsgSpmCreateSrw($Message$CommonProto$NetMessage$MsgSpmCreateSrw.decode(reader, reader.uint32()));
                    break;

                case 243:
                    msg.setMsgSpmGetAllWarSaveSlotTimestamps($Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps.decode(reader, reader.uint32()));
                    break;

                case 244:
                    msg.setMsgSpmGetWarSaveSlotFullData($Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData.decode(reader, reader.uint32()));
                    break;

                case 245:
                    msg.setMsgSpmGetWarSaveSlotFullDataArray($Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray.decode(reader, reader.uint32()));
                    break;

                case 246:
                    msg.setMsgSpmDeleteWarSaveSlot($Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot.decode(reader, reader.uint32()));
                    break;

                case 247:
                    msg.setMsgSpmSaveScw($Message$CommonProto$NetMessage$MsgSpmSaveScw.decode(reader, reader.uint32()));
                    break;

                case 248:
                    msg.setMsgSpmSaveSfw($Message$CommonProto$NetMessage$MsgSpmSaveSfw.decode(reader, reader.uint32()));
                    break;

                case 249:
                    msg.setMsgSpmSaveSrw($Message$CommonProto$NetMessage$MsgSpmSaveSrw.decode(reader, reader.uint32()));
                    break;

                case 250:
                    msg.setMsgSpmValidateSrw($Message$CommonProto$NetMessage$MsgSpmValidateSrw.decode(reader, reader.uint32()));
                    break;

                case 251:
                    msg.setMsgSpmGetRankList($Message$CommonProto$NetMessage$MsgSpmGetRankList.decode(reader, reader.uint32()));
                    break;

                case 252:
                    msg.setMsgSpmGetReplayData($Message$CommonProto$NetMessage$MsgSpmGetReplayData.decode(reader, reader.uint32()));
                    break;

                case 260:
                    msg.setMsgMrrSetMaxConcurrentCount($Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount.decode(reader, reader.uint32()));
                    break;

                case 261:
                    msg.setMsgMrrGetMaxConcurrentCount($Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount.decode(reader, reader.uint32()));
                    break;

                case 262:
                    msg.setMsgMrrSetBannedNormalMapIdArray($Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray.decode(reader, reader.uint32()));
                    break;

                case 263:
                    msg.setMsgMrrGetBannedNormalMapIdArray($Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray.decode(reader, reader.uint32()));
                    break;

                case 264:
                    msg.setMsgMrrSetBootTimerDaysRange($Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange.decode(reader, reader.uint32()));
                    break;

                case 265:
                    msg.setMsgMrrGetBootTimerDaysRange($Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange.decode(reader, reader.uint32()));
                    break;

                case 266:
                    msg.setMsgMrrGetJoinedRoomIdArray($Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 267:
                    msg.setMsgMrrGetRoomPublicInfo($Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo.decode(reader, reader.uint32()));
                    break;

                case 268:
                    msg.setMsgMrrDeleteRoomByServer($Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer.decode(reader, reader.uint32()));
                    break;

                case 269:
                    msg.setMsgMrrSetBannedCoIdArray($Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray.decode(reader, reader.uint32()));
                    break;

                case 270:
                    msg.setMsgMrrSetSelfSettings($Message$CommonProto$NetMessage$MsgMrrSetSelfSettings.decode(reader, reader.uint32()));
                    break;

                case 280:
                    msg.setMsgBroadcastGetAllMessageIdArray($Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray.decode(reader, reader.uint32()));
                    break;

                case 281:
                    msg.setMsgBroadcastAddMessage($Message$CommonProto$NetMessage$MsgBroadcastAddMessage.decode(reader, reader.uint32()));
                    break;

                case 282:
                    msg.setMsgBroadcastDeleteMessage($Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage.decode(reader, reader.uint32()));
                    break;

                case 283:
                    msg.setMsgBroadcastDoBroadcast($Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast.decode(reader, reader.uint32()));
                    break;

                case 284:
                    msg.setMsgBroadcastGetMessageData($Message$CommonProto$NetMessage$MsgBroadcastGetMessageData.decode(reader, reader.uint32()));
                    break;

                case 300:
                    msg.setMsgChangeLogGetMessageList($Message$CommonProto$NetMessage$MsgChangeLogGetMessageList.decode(reader, reader.uint32()));
                    break;

                case 301:
                    msg.setMsgChangeLogAddMessage($Message$CommonProto$NetMessage$MsgChangeLogAddMessage.decode(reader, reader.uint32()));
                    break;

                case 302:
                    msg.setMsgChangeLogModifyMessage($Message$CommonProto$NetMessage$MsgChangeLogModifyMessage.decode(reader, reader.uint32()));
                    break;

                case 320:
                    msg.setMsgMfrCreateRoom($Message$CommonProto$NetMessage$MsgMfrCreateRoom.decode(reader, reader.uint32()));
                    break;

                case 321:
                    msg.setMsgMfrExitRoom($Message$CommonProto$NetMessage$MsgMfrExitRoom.decode(reader, reader.uint32()));
                    break;

                case 322:
                    msg.setMsgMfrJoinRoom($Message$CommonProto$NetMessage$MsgMfrJoinRoom.decode(reader, reader.uint32()));
                    break;

                case 323:
                    msg.setMsgMfrDeleteRoom($Message$CommonProto$NetMessage$MsgMfrDeleteRoom.decode(reader, reader.uint32()));
                    break;

                case 324:
                    msg.setMsgMfrSetReady($Message$CommonProto$NetMessage$MsgMfrSetReady.decode(reader, reader.uint32()));
                    break;

                case 325:
                    msg.setMsgMfrDeletePlayer($Message$CommonProto$NetMessage$MsgMfrDeletePlayer.decode(reader, reader.uint32()));
                    break;

                case 326:
                    msg.setMsgMfrSetSelfSettings($Message$CommonProto$NetMessage$MsgMfrSetSelfSettings.decode(reader, reader.uint32()));
                    break;

                case 327:
                    msg.setMsgMfrStartWar($Message$CommonProto$NetMessage$MsgMfrStartWar.decode(reader, reader.uint32()));
                    break;

                case 328:
                    msg.setMsgMfrGetJoinedRoomIdArray($Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 329:
                    msg.setMsgMfrGetJoinableRoomIdArray($Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 330:
                    msg.setMsgMfrGetRoomStaticInfo($Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo.decode(reader, reader.uint32()));
                    break;

                case 331:
                    msg.setMsgMfrGetRoomPlayerInfo($Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo.decode(reader, reader.uint32()));
                    break;

                case 332:
                    msg.setMsgMfrInvite($Message$CommonProto$NetMessage$MsgMfrInvite.decode(reader, reader.uint32()));
                    break;

                case 333:
                    msg.setMsgMfrAddDummy($Message$CommonProto$NetMessage$MsgMfrAddDummy.decode(reader, reader.uint32()));
                    break;

                case 334:
                    msg.setMsgMfrSetDummySettings($Message$CommonProto$NetMessage$MsgMfrSetDummySettings.decode(reader, reader.uint32()));
                    break;

                case 340:
                    msg.setMsgCcrCreateRoom($Message$CommonProto$NetMessage$MsgCcrCreateRoom.decode(reader, reader.uint32()));
                    break;

                case 341:
                    msg.setMsgCcrExitRoom($Message$CommonProto$NetMessage$MsgCcrExitRoom.decode(reader, reader.uint32()));
                    break;

                case 342:
                    msg.setMsgCcrJoinRoom($Message$CommonProto$NetMessage$MsgCcrJoinRoom.decode(reader, reader.uint32()));
                    break;

                case 343:
                    msg.setMsgCcrDeleteRoom($Message$CommonProto$NetMessage$MsgCcrDeleteRoom.decode(reader, reader.uint32()));
                    break;

                case 344:
                    msg.setMsgCcrSetReady($Message$CommonProto$NetMessage$MsgCcrSetReady.decode(reader, reader.uint32()));
                    break;

                case 345:
                    msg.setMsgCcrDeletePlayer($Message$CommonProto$NetMessage$MsgCcrDeletePlayer.decode(reader, reader.uint32()));
                    break;

                case 346:
                    msg.setMsgCcrSetSelfSettings($Message$CommonProto$NetMessage$MsgCcrSetSelfSettings.decode(reader, reader.uint32()));
                    break;

                case 347:
                    msg.setMsgCcrStartWar($Message$CommonProto$NetMessage$MsgCcrStartWar.decode(reader, reader.uint32()));
                    break;

                case 348:
                    msg.setMsgCcrGetJoinedRoomIdArray($Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 349:
                    msg.setMsgCcrGetJoinableRoomIdArray($Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 350:
                    msg.setMsgCcrGetRoomStaticInfo($Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo.decode(reader, reader.uint32()));
                    break;

                case 351:
                    msg.setMsgCcrGetRoomPlayerInfo($Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo.decode(reader, reader.uint32()));
                    break;

                case 352:
                    msg.setMsgCcrInvite($Message$CommonProto$NetMessage$MsgCcrInvite.decode(reader, reader.uint32()));
                    break;

                case 353:
                    msg.setMsgCcrAddDummy($Message$CommonProto$NetMessage$MsgCcrAddDummy.decode(reader, reader.uint32()));
                    break;

                case 354:
                    msg.setMsgCcrSetDummySettings($Message$CommonProto$NetMessage$MsgCcrSetDummySettings.decode(reader, reader.uint32()));
                    break;

                case 360:
                    msg.setMsgLbSpmOverallGetTopDataArray($Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray.decode(reader, reader.uint32()));
                    break;

                case 361:
                    msg.setMsgLbSpmOverallGetRankInfo($Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo.decode(reader, reader.uint32()));
                    break;

                case 362:
                    msg.setMsgLbMrwGetRankIndex($Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex.decode(reader, reader.uint32()));
                    break;

                case 380:
                    msg.setMsgMmrSetMaxConcurrentCount($Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount.decode(reader, reader.uint32()));
                    break;

                case 381:
                    msg.setMsgMmrGetMaxConcurrentCount($Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount.decode(reader, reader.uint32()));
                    break;

                case 382:
                    msg.setMsgMmrSetBannedNormalMapIdArray($Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray.decode(reader, reader.uint32()));
                    break;

                case 383:
                    msg.setMsgMmrGetBannedNormalMapIdArray($Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray.decode(reader, reader.uint32()));
                    break;

                case 384:
                    msg.setMsgMmrSetBootTimerDaysRange($Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange.decode(reader, reader.uint32()));
                    break;

                case 385:
                    msg.setMsgMmrGetBootTimerDaysRange($Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange.decode(reader, reader.uint32()));
                    break;

                case 386:
                    msg.setMsgMmrGetJoinedRoomIdArray($Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 387:
                    msg.setMsgMmrGetRoomPublicInfo($Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo.decode(reader, reader.uint32()));
                    break;

                case 388:
                    msg.setMsgMmrDeleteRoomByServer($Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer.decode(reader, reader.uint32()));
                    break;

                case 389:
                    msg.setMsgMmrSetBannedCoIdArray($Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray.decode(reader, reader.uint32()));
                    break;

                case 390:
                    msg.setMsgMmrSetSelfSettings($Message$CommonProto$NetMessage$MsgMmrSetSelfSettings.decode(reader, reader.uint32()));
                    break;

                case 400:
                    msg.setMsgNormalMapGetAllEnabledBriefDataVersions($Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions.decode(reader, reader.uint32()));
                    break;

                case 401:
                    msg.setMsgNormalMapGetBriefDataVersion($Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion.decode(reader, reader.uint32()));
                    break;

                case 402:
                    msg.setMsgNormalMapGetBriefData($Message$CommonProto$NetMessage$MsgNormalMapGetBriefData.decode(reader, reader.uint32()));
                    break;

                case 403:
                    msg.setMsgNormalMapGetBriefDataArray($Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray.decode(reader, reader.uint32()));
                    break;

                case 404:
                    msg.setMsgMapGetRawData($Message$CommonProto$NetMessage$MsgMapGetRawData.decode(reader, reader.uint32()));
                    break;

                case 405:
                    msg.setMsgMapGetMapTag($Message$CommonProto$NetMessage$MsgMapGetMapTag.decode(reader, reader.uint32()));
                    break;

                case 420:
                    msg.setMsgMailGetAllMailArray($Message$CommonProto$NetMessage$MsgMailGetAllMailArray.decode(reader, reader.uint32()));
                    break;

                case 421:
                    msg.setMsgMailGetMail($Message$CommonProto$NetMessage$MsgMailGetMail.decode(reader, reader.uint32()));
                    break;

                case 422:
                    msg.setMsgMailDeleteMail($Message$CommonProto$NetMessage$MsgMailDeleteMail.decode(reader, reader.uint32()));
                    break;

                case 423:
                    msg.setMsgMailSetIsNew($Message$CommonProto$NetMessage$MsgMailSetIsNew.decode(reader, reader.uint32()));
                    break;

                case 440:
                    msg.setMsgAtGetGlobalSettings($Message$CommonProto$NetMessage$MsgAtGetGlobalSettings.decode(reader, reader.uint32()));
                    break;

                case 441:
                    msg.setMsgAtSetGlobalSettings($Message$CommonProto$NetMessage$MsgAtSetGlobalSettings.decode(reader, reader.uint32()));
                    break;

                case 442:
                    msg.setMsgAtCreateTourney($Message$CommonProto$NetMessage$MsgAtCreateTourney.decode(reader, reader.uint32()));
                    break;

                case 443:
                    msg.setMsgAtDeleteLastTourney($Message$CommonProto$NetMessage$MsgAtDeleteLastTourney.decode(reader, reader.uint32()));
                    break;

                case 444:
                    msg.setMsgAtSetRegistrationDuration($Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration.decode(reader, reader.uint32()));
                    break;

                case 445:
                    msg.setMsgAtSetAdjustmentDuration($Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration.decode(reader, reader.uint32()));
                    break;

                case 446:
                    msg.setMsgAtSetInitialBrackets($Message$CommonProto$NetMessage$MsgAtSetInitialBrackets.decode(reader, reader.uint32()));
                    break;

                case 447:
                    msg.setMsgAtSetMapPool($Message$CommonProto$NetMessage$MsgAtSetMapPool.decode(reader, reader.uint32()));
                    break;

                case 448:
                    msg.setMsgAtSetName($Message$CommonProto$NetMessage$MsgAtSetName.decode(reader, reader.uint32()));
                    break;

                case 449:
                    msg.setMsgAtSetBootTimer($Message$CommonProto$NetMessage$MsgAtSetBootTimer.decode(reader, reader.uint32()));
                    break;

                case 450:
                    msg.setMsgAtGetUserArray($Message$CommonProto$NetMessage$MsgAtGetUserArray.decode(reader, reader.uint32()));
                    break;

                case 451:
                    msg.setMsgAtDeleteUser($Message$CommonProto$NetMessage$MsgAtDeleteUser.decode(reader, reader.uint32()));
                    break;

                case 452:
                    msg.setMsgAtGetPhaseInfo($Message$CommonProto$NetMessage$MsgAtGetPhaseInfo.decode(reader, reader.uint32()));
                    break;

                case 453:
                    msg.setMsgAtGetRegistrationInfo($Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo.decode(reader, reader.uint32()));
                    break;

                case 454:
                    msg.setMsgAtGetTourneyInfo($Message$CommonProto$NetMessage$MsgAtGetTourneyInfo.decode(reader, reader.uint32()));
                    break;

                case 455:
                    msg.setMsgAtGetFullMapInfo($Message$CommonProto$NetMessage$MsgAtGetFullMapInfo.decode(reader, reader.uint32()));
                    break;

                case 456:
                    msg.setMsgAtGetFullBracketInfo($Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo.decode(reader, reader.uint32()));
                    break;

                case 457:
                    msg.setMsgAtRegister($Message$CommonProto$NetMessage$MsgAtRegister.decode(reader, reader.uint32()));
                    break;

                case 460:
                    msg.setMsgAtrGetJoinedRoomIdArray($Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray.decode(reader, reader.uint32()));
                    break;

                case 461:
                    msg.setMsgAtrGetRoomPublicInfo($Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo.decode(reader, reader.uint32()));
                    break;

                case 462:
                    msg.setMsgAtrDeleteRoomByServer($Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer.decode(reader, reader.uint32()));
                    break;

                case 463:
                    msg.setMsgAtrSetBannedCoIdArray($Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray.decode(reader, reader.uint32()));
                    break;

                case 464:
                    msg.setMsgAtrSetSelfSettings($Message$CommonProto$NetMessage$MsgAtrSetSelfSettings.decode(reader, reader.uint32()));
                    break;

                case 480:
                    msg.setMsgGmSetUserPrivilege($Message$CommonProto$NetMessage$MsgGmSetUserPrivilege.decode(reader, reader.uint32()));
                    break;

                case 481:
                    msg.setMsgGmSetUserPassword($Message$CommonProto$NetMessage$MsgGmSetUserPassword.decode(reader, reader.uint32()));
                    break;

                case 482:
                    msg.setMsgGmDeleteMcrRoom($Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom.decode(reader, reader.uint32()));
                    break;

                case 483:
                    msg.setMsgGmDeleteMfrRoom($Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom.decode(reader, reader.uint32()));
                    break;

                case 484:
                    msg.setMsgGmDeleteCcrRoom($Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom.decode(reader, reader.uint32()));
                    break;

                case 485:
                    msg.setMsgGmDeleteMrrRoom($Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom.decode(reader, reader.uint32()));
                    break;

                case 486:
                    msg.setMsgGmDeleteMmrRoom($Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom.decode(reader, reader.uint32()));
                    break;

                case 487:
                    msg.setMsgGmDeleteSpmAllScoreAndReplay($Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay.decode(reader, reader.uint32()));
                    break;

                case 488:
                    msg.setMsgGmAddUserMedal($Message$CommonProto$NetMessage$MsgGmAddUserMedal.decode(reader, reader.uint32()));
                    break;

                case 489:
                    msg.setMsgGmGenerateReplayStatistics($Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics.decode(reader, reader.uint32()));
                    break;

                case 490:
                    msg.setMsgGmUpdateReplayInfo($Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo.decode(reader, reader.uint32()));
                    break;

                case 500:
                    msg.setMsgCmGetAllCampaignIdArray($Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray.decode(reader, reader.uint32()));
                    break;

                case 501:
                    msg.setMsgCmGetDesigningCampaignIdArray($Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray.decode(reader, reader.uint32()));
                    break;

                case 502:
                    msg.setMsgCmCreateCampaign($Message$CommonProto$NetMessage$MsgCmCreateCampaign.decode(reader, reader.uint32()));
                    break;

                case 503:
                    msg.setMsgCmCreateCampaignMap($Message$CommonProto$NetMessage$MsgCmCreateCampaignMap.decode(reader, reader.uint32()));
                    break;

                case 504:
                    msg.setMsgCmSetCampaignName($Message$CommonProto$NetMessage$MsgCmSetCampaignName.decode(reader, reader.uint32()));
                    break;

                case 505:
                    msg.setMsgCmSetCampaignDesc($Message$CommonProto$NetMessage$MsgCmSetCampaignDesc.decode(reader, reader.uint32()));
                    break;

                case 506:
                    msg.setMsgCmSetCampaignEnabled($Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled.decode(reader, reader.uint32()));
                    break;

                case 507:
                    msg.setMsgCmSetCampaignMapEnabled($Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled.decode(reader, reader.uint32()));
                    break;

                case 508:
                    msg.setMsgCmSetCampaignMapRawData($Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData.decode(reader, reader.uint32()));
                    break;

                case 509:
                    msg.setMsgCmSetCampaignMapExtraText($Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText.decode(reader, reader.uint32()));
                    break;

                case 510:
                    msg.setMsgCmSetCampaignMapName($Message$CommonProto$NetMessage$MsgCmSetCampaignMapName.decode(reader, reader.uint32()));
                    break;

                case 511:
                    msg.setMsgCmSetCampaignMapWarEventAction($Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction.decode(reader, reader.uint32()));
                    break;

                case 512:
                    msg.setMsgCmUpdateCampaignDesigners($Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners.decode(reader, reader.uint32()));
                    break;

                case 513:
                    msg.setMsgCmSetExtraLink($Message$CommonProto$NetMessage$MsgCmSetExtraLink.decode(reader, reader.uint32()));
                    break;

                case 520:
                    msg.setMsgCampaignGetCampaignInfo($Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo.decode(reader, reader.uint32()));
                    break;

                case 521:
                    msg.setMsgCampaignGetEnabledCampaignIdArray($Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray.decode(reader, reader.uint32()));
                    break;

                case 522:
                    msg.setMsgCampaignGetAllMapTimestampArray($Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray.decode(reader, reader.uint32()));
                    break;

                case 523:
                    msg.setMsgCampaignGetMapTimestamp($Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp.decode(reader, reader.uint32()));
                    break;

                case 524:
                    msg.setMsgCampaignGetMapRawDataArray($Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray.decode(reader, reader.uint32()));
                    break;

                case 525:
                    msg.setMsgCampaignGetMapRawData($Message$CommonProto$NetMessage$MsgCampaignGetMapRawData.decode(reader, reader.uint32()));
                    break;

                case 526:
                    msg.setMsgCampaignCreateWar($Message$CommonProto$NetMessage$MsgCampaignCreateWar.decode(reader, reader.uint32()));
                    break;

                case 527:
                    msg.setMsgCampaignSaveWar($Message$CommonProto$NetMessage$MsgCampaignSaveWar.decode(reader, reader.uint32()));
                    break;

                case 528:
                    msg.setMsgCampaignValidateWar($Message$CommonProto$NetMessage$MsgCampaignValidateWar.decode(reader, reader.uint32()));
                    break;

                case 529:
                    msg.setMsgCampaignGetCampaignLeaderboard($Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard.decode(reader, reader.uint32()));
                    break;

                case 530:
                    msg.setMsgCampaignGetCampaignMapLeaderboard($Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard.decode(reader, reader.uint32()));
                    break;

                case 531:
                    msg.setMsgCampaignGetScore($Message$CommonProto$NetMessage$MsgCampaignGetScore.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MessageContainer {
        return MessageContainer.decode(this.encode());
    }

    public override getSchemaName(): "MessageContainer" {
        return "MessageContainer";
    }

    public getMessageData():
        null |
        undefined |
        $Message$CommonProto$NetMessage$MsgCommonHeartbeat |
        $Message$CommonProto$NetMessage$MsgCommonError |
        $Message$CommonProto$NetMessage$MsgCommonServerDisconnect |
        $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion |
        $Message$CommonProto$NetMessage$MsgCommonGetServerStatus |
        $Message$CommonProto$NetMessage$MsgCommonGetRankList |
        $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics |
        $Message$CommonProto$NetMessage$MsgUserRegister |
        $Message$CommonProto$NetMessage$MsgUserLogin |
        $Message$CommonProto$NetMessage$MsgUserLogout |
        $Message$CommonProto$NetMessage$MsgUserGetPublicInfo |
        $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray |
        $Message$CommonProto$NetMessage$MsgUserGetBriefInfo |
        $Message$CommonProto$NetMessage$MsgUserGetOnlineState |
        $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray |
        $Message$CommonProto$NetMessage$MsgUserSetNickname |
        $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo |
        $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings |
        $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings |
        $Message$CommonProto$NetMessage$MsgUserSetPassword |
        $Message$CommonProto$NetMessage$MsgUserSetSettings |
        $Message$CommonProto$NetMessage$MsgUserSetMapRating |
        $Message$CommonProto$NetMessage$MsgUserSetAvatarId |
        $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime |
        $Message$CommonProto$NetMessage$MsgUserLoginAsGuest |
        $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname |
        $Message$CommonProto$NetMessage$MsgUserSetRelation |
        $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray |
        $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray |
        $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode |
        $Message$CommonProto$NetMessage$MsgUserVerifyEmail |
        $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode |
        $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail |
        $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps |
        $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp |
        $Message$CommonProto$NetMessage$MsgMeGetMapDataArray |
        $Message$CommonProto$NetMessage$MsgMeGetMapData |
        $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap |
        $Message$CommonProto$NetMessage$MsgMeDeleteSlot |
        $Message$CommonProto$NetMessage$MsgChatAddMessage |
        $Message$CommonProto$NetMessage$MsgChatGetAllMessages |
        $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress |
        $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList |
        $Message$CommonProto$NetMessage$MsgChatDeleteMessage |
        $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability |
        $Message$CommonProto$NetMessage$MsgMmSetMapEnabled |
        $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps |
        $Message$CommonProto$NetMessage$MsgMmReviewMap |
        $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags |
        $Message$CommonProto$NetMessage$MsgMmSetMapName |
        $Message$CommonProto$NetMessage$MsgMmAddWarRule |
        $Message$CommonProto$NetMessage$MsgMmAddWarEvent |
        $Message$CommonProto$NetMessage$MsgMmDeleteWarRule |
        $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent |
        $Message$CommonProto$NetMessage$MsgMmSetWarRuleName |
        $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme |
        $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData |
        $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue |
        $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap |
        $Message$CommonProto$NetMessage$MsgReplaySetSelfRating |
        $Message$CommonProto$NetMessage$MsgReplayGetSelfRating |
        $Message$CommonProto$NetMessage$MsgReplayGetData |
        $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo |
        $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray |
        $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions |
        $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion |
        $Message$CommonProto$NetMessage$MsgMcrCreateRoom |
        $Message$CommonProto$NetMessage$MsgMcrExitRoom |
        $Message$CommonProto$NetMessage$MsgMcrJoinRoom |
        $Message$CommonProto$NetMessage$MsgMcrDeleteRoom |
        $Message$CommonProto$NetMessage$MsgMcrSetReady |
        $Message$CommonProto$NetMessage$MsgMcrDeletePlayer |
        $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings |
        $Message$CommonProto$NetMessage$MsgMcrStartWar |
        $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray |
        $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray |
        $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo |
        $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo |
        $Message$CommonProto$NetMessage$MsgMcrInvite |
        $Message$CommonProto$NetMessage$MsgMcrAddDummy |
        $Message$CommonProto$NetMessage$MsgMcrSetDummySettings |
        $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray |
        $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp |
        $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics |
        $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar |
        $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar |
        $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot |
        $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart |
        $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings |
        $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo |
        $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid |
        $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList |
        $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList |
        $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData |
        $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest |
        $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest |
        $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher |
        $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray |
        $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray |
        $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray |
        $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray |
        $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar |
        $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo |
        $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo |
        $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation |
        $Message$CommonProto$NetMessage$MsgSpmCreateScw |
        $Message$CommonProto$NetMessage$MsgSpmCreateSfw |
        $Message$CommonProto$NetMessage$MsgSpmCreateSrw |
        $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps |
        $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData |
        $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray |
        $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot |
        $Message$CommonProto$NetMessage$MsgSpmSaveScw |
        $Message$CommonProto$NetMessage$MsgSpmSaveSfw |
        $Message$CommonProto$NetMessage$MsgSpmSaveSrw |
        $Message$CommonProto$NetMessage$MsgSpmValidateSrw |
        $Message$CommonProto$NetMessage$MsgSpmGetRankList |
        $Message$CommonProto$NetMessage$MsgSpmGetReplayData |
        $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount |
        $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount |
        $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray |
        $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray |
        $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange |
        $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange |
        $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray |
        $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo |
        $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer |
        $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray |
        $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings |
        $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray |
        $Message$CommonProto$NetMessage$MsgBroadcastAddMessage |
        $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage |
        $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast |
        $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData |
        $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList |
        $Message$CommonProto$NetMessage$MsgChangeLogAddMessage |
        $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage |
        $Message$CommonProto$NetMessage$MsgMfrCreateRoom |
        $Message$CommonProto$NetMessage$MsgMfrExitRoom |
        $Message$CommonProto$NetMessage$MsgMfrJoinRoom |
        $Message$CommonProto$NetMessage$MsgMfrDeleteRoom |
        $Message$CommonProto$NetMessage$MsgMfrSetReady |
        $Message$CommonProto$NetMessage$MsgMfrDeletePlayer |
        $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings |
        $Message$CommonProto$NetMessage$MsgMfrStartWar |
        $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray |
        $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray |
        $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo |
        $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo |
        $Message$CommonProto$NetMessage$MsgMfrInvite |
        $Message$CommonProto$NetMessage$MsgMfrAddDummy |
        $Message$CommonProto$NetMessage$MsgMfrSetDummySettings |
        $Message$CommonProto$NetMessage$MsgCcrCreateRoom |
        $Message$CommonProto$NetMessage$MsgCcrExitRoom |
        $Message$CommonProto$NetMessage$MsgCcrJoinRoom |
        $Message$CommonProto$NetMessage$MsgCcrDeleteRoom |
        $Message$CommonProto$NetMessage$MsgCcrSetReady |
        $Message$CommonProto$NetMessage$MsgCcrDeletePlayer |
        $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings |
        $Message$CommonProto$NetMessage$MsgCcrStartWar |
        $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray |
        $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray |
        $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo |
        $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo |
        $Message$CommonProto$NetMessage$MsgCcrInvite |
        $Message$CommonProto$NetMessage$MsgCcrAddDummy |
        $Message$CommonProto$NetMessage$MsgCcrSetDummySettings |
        $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray |
        $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo |
        $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex |
        $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount |
        $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount |
        $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray |
        $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray |
        $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange |
        $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange |
        $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray |
        $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo |
        $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer |
        $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray |
        $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings |
        $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions |
        $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion |
        $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData |
        $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray |
        $Message$CommonProto$NetMessage$MsgMapGetRawData |
        $Message$CommonProto$NetMessage$MsgMapGetMapTag |
        $Message$CommonProto$NetMessage$MsgMailGetAllMailArray |
        $Message$CommonProto$NetMessage$MsgMailGetMail |
        $Message$CommonProto$NetMessage$MsgMailDeleteMail |
        $Message$CommonProto$NetMessage$MsgMailSetIsNew |
        $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings |
        $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings |
        $Message$CommonProto$NetMessage$MsgAtCreateTourney |
        $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney |
        $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration |
        $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration |
        $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets |
        $Message$CommonProto$NetMessage$MsgAtSetMapPool |
        $Message$CommonProto$NetMessage$MsgAtSetName |
        $Message$CommonProto$NetMessage$MsgAtSetBootTimer |
        $Message$CommonProto$NetMessage$MsgAtGetUserArray |
        $Message$CommonProto$NetMessage$MsgAtDeleteUser |
        $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo |
        $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo |
        $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo |
        $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo |
        $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo |
        $Message$CommonProto$NetMessage$MsgAtRegister |
        $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray |
        $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo |
        $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer |
        $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray |
        $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings |
        $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege |
        $Message$CommonProto$NetMessage$MsgGmSetUserPassword |
        $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom |
        $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom |
        $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom |
        $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom |
        $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom |
        $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay |
        $Message$CommonProto$NetMessage$MsgGmAddUserMedal |
        $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics |
        $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo |
        $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray |
        $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray |
        $Message$CommonProto$NetMessage$MsgCmCreateCampaign |
        $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignName |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName |
        $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction |
        $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners |
        $Message$CommonProto$NetMessage$MsgCmSetExtraLink |
        $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo |
        $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray |
        $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray |
        $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp |
        $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray |
        $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData |
        $Message$CommonProto$NetMessage$MsgCampaignCreateWar |
        $Message$CommonProto$NetMessage$MsgCampaignSaveWar |
        $Message$CommonProto$NetMessage$MsgCampaignValidateWar |
        $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard |
        $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard |
        $Message$CommonProto$NetMessage$MsgCampaignGetScore {
        return this._MsgCommonHeartbeat
            ?? this._MsgCommonError
            ?? this._MsgCommonServerDisconnect
            ?? this._MsgCommonLatestConfigVersion
            ?? this._MsgCommonGetServerStatus
            ?? this._MsgCommonGetRankList
            ?? this._MsgCommonGetCoStatistics
            ?? this._MsgUserRegister
            ?? this._MsgUserLogin
            ?? this._MsgUserLogout
            ?? this._MsgUserGetPublicInfo
            ?? this._MsgUserGetPublicInfoArray
            ?? this._MsgUserGetBriefInfo
            ?? this._MsgUserGetOnlineState
            ?? this._MsgUserGetOnlineUserIdArray
            ?? this._MsgUserSetNickname
            ?? this._MsgUserSetDiscordInfo
            ?? this._MsgUserSetCoBgmSettings
            ?? this._MsgUserSetSceneBgmSettings
            ?? this._MsgUserSetPassword
            ?? this._MsgUserSetSettings
            ?? this._MsgUserSetMapRating
            ?? this._MsgUserSetAvatarId
            ?? this._MsgUserSetMapEditorAutoSaveTime
            ?? this._MsgUserLoginAsGuest
            ?? this._MsgUserGetUsersByNickname
            ?? this._MsgUserSetRelation
            ?? this._MsgUserSetShowMedalIdArray
            ?? this._MsgUserModifyFavoriteReplayIdArray
            ?? this._MsgUserRequestEmailVerificationCode
            ?? this._MsgUserVerifyEmail
            ?? this._MsgUserRequestPasswordVerificationCode
            ?? this._MsgUserResetPasswordWithEmail
            ?? this._MsgMeGetAllMapDataTimestamps
            ?? this._MsgMeGetMapDataTimestamp
            ?? this._MsgMeGetMapDataArray
            ?? this._MsgMeGetMapData
            ?? this._MsgMeSubmitNormalMap
            ?? this._MsgMeDeleteSlot
            ?? this._MsgChatAddMessage
            ?? this._MsgChatGetAllMessages
            ?? this._MsgChatUpdateReadProgress
            ?? this._MsgChatGetAllReadProgressList
            ?? this._MsgChatDeleteMessage
            ?? this._MsgMmSetWarRuleAvailability
            ?? this._MsgMmSetMapEnabled
            ?? this._MsgMmGetReviewingMaps
            ?? this._MsgMmReviewMap
            ?? this._MsgMmSetMapTagIdFlags
            ?? this._MsgMmSetMapName
            ?? this._MsgMmAddWarRule
            ?? this._MsgMmAddWarEvent
            ?? this._MsgMmDeleteWarRule
            ?? this._MsgMmDeleteRedundantWarEvent
            ?? this._MsgMmSetWarRuleName
            ?? this._MsgMmSetWarRuleFixedTileTheme
            ?? this._MsgMmSetMapTagSingleData
            ?? this._MsgMmSubmitMapSimpleDialogue
            ?? this._MsgMmAddIgnoredReviewingMap
            ?? this._MsgReplaySetSelfRating
            ?? this._MsgReplayGetSelfRating
            ?? this._MsgReplayGetData
            ?? this._MsgReplayGetReplayInfo
            ?? this._MsgReplayGetReplayInfoArray
            ?? this._MsgReplayGetAllInfoVersions
            ?? this._MsgReplayGetInfoVersion
            ?? this._MsgMcrCreateRoom
            ?? this._MsgMcrExitRoom
            ?? this._MsgMcrJoinRoom
            ?? this._MsgMcrDeleteRoom
            ?? this._MsgMcrSetReady
            ?? this._MsgMcrDeletePlayer
            ?? this._MsgMcrSetSelfSettings
            ?? this._MsgMcrStartWar
            ?? this._MsgMcrGetJoinedRoomIdArray
            ?? this._MsgMcrGetJoinableRoomIdArray
            ?? this._MsgMcrGetRoomStaticInfo
            ?? this._MsgMcrGetRoomPlayerInfo
            ?? this._MsgMcrInvite
            ?? this._MsgMcrAddDummy
            ?? this._MsgMcrSetDummySettings
            ?? this._MsgMpwCommonGetJoinedMpwIdArray
            ?? this._MsgMpwCommonGetWarTimestamp
            ?? this._MsgMpwCommonGetUnitStatistics
            ?? this._MsgMpwCommonContinueWar
            ?? this._MsgMpwCommonSyncWar
            ?? this._MsgMpwCommonHandleBoot
            ?? this._MsgMpwCommonBroadcastGameStart
            ?? this._MsgMpwCommonGetWarSettings
            ?? this._MsgMpwCommonGetWarProgressInfo
            ?? this._MsgMpwCommonMarkGrid
            ?? this._MsgMpwCommonSetHiddenGridMarkTypeIdList
            ?? this._MsgMpwCommonSetGridMarkList
            ?? this._MsgMpwCommonGetHalfwayReplayData
            ?? this._MsgMpwWatchMakeRequest
            ?? this._MsgMpwWatchHandleRequest
            ?? this._MsgMpwWatchDeleteWatcher
            ?? this._MsgMpwWatchGetRequestableWarIdArray
            ?? this._MsgMpwWatchGetOngoingWarIdArray
            ?? this._MsgMpwWatchGetRequestedWarIdArray
            ?? this._MsgMpwWatchGetWatchedWarIdArray
            ?? this._MsgMpwWatchContinueWar
            ?? this._MsgMpwWatchGetIncomingInfo
            ?? this._MsgMpwWatchGetOutgoingInfo
            ?? this._MsgMpwExecuteWarOperation
            ?? this._MsgSpmCreateScw
            ?? this._MsgSpmCreateSfw
            ?? this._MsgSpmCreateSrw
            ?? this._MsgSpmGetAllWarSaveSlotTimestamps
            ?? this._MsgSpmGetWarSaveSlotFullData
            ?? this._MsgSpmGetWarSaveSlotFullDataArray
            ?? this._MsgSpmDeleteWarSaveSlot
            ?? this._MsgSpmSaveScw
            ?? this._MsgSpmSaveSfw
            ?? this._MsgSpmSaveSrw
            ?? this._MsgSpmValidateSrw
            ?? this._MsgSpmGetRankList
            ?? this._MsgSpmGetReplayData
            ?? this._MsgMrrSetMaxConcurrentCount
            ?? this._MsgMrrGetMaxConcurrentCount
            ?? this._MsgMrrSetBannedNormalMapIdArray
            ?? this._MsgMrrGetBannedNormalMapIdArray
            ?? this._MsgMrrSetBootTimerDaysRange
            ?? this._MsgMrrGetBootTimerDaysRange
            ?? this._MsgMrrGetJoinedRoomIdArray
            ?? this._MsgMrrGetRoomPublicInfo
            ?? this._MsgMrrDeleteRoomByServer
            ?? this._MsgMrrSetBannedCoIdArray
            ?? this._MsgMrrSetSelfSettings
            ?? this._MsgBroadcastGetAllMessageIdArray
            ?? this._MsgBroadcastAddMessage
            ?? this._MsgBroadcastDeleteMessage
            ?? this._MsgBroadcastDoBroadcast
            ?? this._MsgBroadcastGetMessageData
            ?? this._MsgChangeLogGetMessageList
            ?? this._MsgChangeLogAddMessage
            ?? this._MsgChangeLogModifyMessage
            ?? this._MsgMfrCreateRoom
            ?? this._MsgMfrExitRoom
            ?? this._MsgMfrJoinRoom
            ?? this._MsgMfrDeleteRoom
            ?? this._MsgMfrSetReady
            ?? this._MsgMfrDeletePlayer
            ?? this._MsgMfrSetSelfSettings
            ?? this._MsgMfrStartWar
            ?? this._MsgMfrGetJoinedRoomIdArray
            ?? this._MsgMfrGetJoinableRoomIdArray
            ?? this._MsgMfrGetRoomStaticInfo
            ?? this._MsgMfrGetRoomPlayerInfo
            ?? this._MsgMfrInvite
            ?? this._MsgMfrAddDummy
            ?? this._MsgMfrSetDummySettings
            ?? this._MsgCcrCreateRoom
            ?? this._MsgCcrExitRoom
            ?? this._MsgCcrJoinRoom
            ?? this._MsgCcrDeleteRoom
            ?? this._MsgCcrSetReady
            ?? this._MsgCcrDeletePlayer
            ?? this._MsgCcrSetSelfSettings
            ?? this._MsgCcrStartWar
            ?? this._MsgCcrGetJoinedRoomIdArray
            ?? this._MsgCcrGetJoinableRoomIdArray
            ?? this._MsgCcrGetRoomStaticInfo
            ?? this._MsgCcrGetRoomPlayerInfo
            ?? this._MsgCcrInvite
            ?? this._MsgCcrAddDummy
            ?? this._MsgCcrSetDummySettings
            ?? this._MsgLbSpmOverallGetTopDataArray
            ?? this._MsgLbSpmOverallGetRankInfo
            ?? this._MsgLbMrwGetRankIndex
            ?? this._MsgMmrSetMaxConcurrentCount
            ?? this._MsgMmrGetMaxConcurrentCount
            ?? this._MsgMmrSetBannedNormalMapIdArray
            ?? this._MsgMmrGetBannedNormalMapIdArray
            ?? this._MsgMmrSetBootTimerDaysRange
            ?? this._MsgMmrGetBootTimerDaysRange
            ?? this._MsgMmrGetJoinedRoomIdArray
            ?? this._MsgMmrGetRoomPublicInfo
            ?? this._MsgMmrDeleteRoomByServer
            ?? this._MsgMmrSetBannedCoIdArray
            ?? this._MsgMmrSetSelfSettings
            ?? this._MsgNormalMapGetAllEnabledBriefDataVersions
            ?? this._MsgNormalMapGetBriefDataVersion
            ?? this._MsgNormalMapGetBriefData
            ?? this._MsgNormalMapGetBriefDataArray
            ?? this._MsgMapGetRawData
            ?? this._MsgMapGetMapTag
            ?? this._MsgMailGetAllMailArray
            ?? this._MsgMailGetMail
            ?? this._MsgMailDeleteMail
            ?? this._MsgMailSetIsNew
            ?? this._MsgAtGetGlobalSettings
            ?? this._MsgAtSetGlobalSettings
            ?? this._MsgAtCreateTourney
            ?? this._MsgAtDeleteLastTourney
            ?? this._MsgAtSetRegistrationDuration
            ?? this._MsgAtSetAdjustmentDuration
            ?? this._MsgAtSetInitialBrackets
            ?? this._MsgAtSetMapPool
            ?? this._MsgAtSetName
            ?? this._MsgAtSetBootTimer
            ?? this._MsgAtGetUserArray
            ?? this._MsgAtDeleteUser
            ?? this._MsgAtGetPhaseInfo
            ?? this._MsgAtGetRegistrationInfo
            ?? this._MsgAtGetTourneyInfo
            ?? this._MsgAtGetFullMapInfo
            ?? this._MsgAtGetFullBracketInfo
            ?? this._MsgAtRegister
            ?? this._MsgAtrGetJoinedRoomIdArray
            ?? this._MsgAtrGetRoomPublicInfo
            ?? this._MsgAtrDeleteRoomByServer
            ?? this._MsgAtrSetBannedCoIdArray
            ?? this._MsgAtrSetSelfSettings
            ?? this._MsgGmSetUserPrivilege
            ?? this._MsgGmSetUserPassword
            ?? this._MsgGmDeleteMcrRoom
            ?? this._MsgGmDeleteMfrRoom
            ?? this._MsgGmDeleteCcrRoom
            ?? this._MsgGmDeleteMrrRoom
            ?? this._MsgGmDeleteMmrRoom
            ?? this._MsgGmDeleteSpmAllScoreAndReplay
            ?? this._MsgGmAddUserMedal
            ?? this._MsgGmGenerateReplayStatistics
            ?? this._MsgGmUpdateReplayInfo
            ?? this._MsgCmGetAllCampaignIdArray
            ?? this._MsgCmGetDesigningCampaignIdArray
            ?? this._MsgCmCreateCampaign
            ?? this._MsgCmCreateCampaignMap
            ?? this._MsgCmSetCampaignName
            ?? this._MsgCmSetCampaignDesc
            ?? this._MsgCmSetCampaignEnabled
            ?? this._MsgCmSetCampaignMapEnabled
            ?? this._MsgCmSetCampaignMapRawData
            ?? this._MsgCmSetCampaignMapExtraText
            ?? this._MsgCmSetCampaignMapName
            ?? this._MsgCmSetCampaignMapWarEventAction
            ?? this._MsgCmUpdateCampaignDesigners
            ?? this._MsgCmSetExtraLink
            ?? this._MsgCampaignGetCampaignInfo
            ?? this._MsgCampaignGetEnabledCampaignIdArray
            ?? this._MsgCampaignGetAllMapTimestampArray
            ?? this._MsgCampaignGetMapTimestamp
            ?? this._MsgCampaignGetMapRawDataArray
            ?? this._MsgCampaignGetMapRawData
            ?? this._MsgCampaignCreateWar
            ?? this._MsgCampaignSaveWar
            ?? this._MsgCampaignValidateWar
            ?? this._MsgCampaignGetCampaignLeaderboard
            ?? this._MsgCampaignGetCampaignMapLeaderboard
            ?? this._MsgCampaignGetScore;
    }

    public checkHasMsgCommonHeartbeat(): boolean {
        return this._MsgCommonHeartbeat != null;
    }
    public getMsgCommonHeartbeat(): $Message$CommonProto$NetMessage$MsgCommonHeartbeat | null | undefined {
        return this._MsgCommonHeartbeat;
    }
    public setMsgCommonHeartbeat(value: $Message$CommonProto$NetMessage$MsgCommonHeartbeat | null | undefined): void {
        this._MsgCommonHeartbeat = value;
    }
    public createIfNotExistsMsgCommonHeartbeat(): $Message$CommonProto$NetMessage$MsgCommonHeartbeat {
        return this._MsgCommonHeartbeat ??= new $Message$CommonProto$NetMessage$MsgCommonHeartbeat();
    }

    public checkHasMsgCommonError(): boolean {
        return this._MsgCommonError != null;
    }
    public getMsgCommonError(): $Message$CommonProto$NetMessage$MsgCommonError | null | undefined {
        return this._MsgCommonError;
    }
    public setMsgCommonError(value: $Message$CommonProto$NetMessage$MsgCommonError | null | undefined): void {
        this._MsgCommonError = value;
    }
    public createIfNotExistsMsgCommonError(): $Message$CommonProto$NetMessage$MsgCommonError {
        return this._MsgCommonError ??= new $Message$CommonProto$NetMessage$MsgCommonError();
    }

    public checkHasMsgCommonServerDisconnect(): boolean {
        return this._MsgCommonServerDisconnect != null;
    }
    public getMsgCommonServerDisconnect(): $Message$CommonProto$NetMessage$MsgCommonServerDisconnect | null | undefined {
        return this._MsgCommonServerDisconnect;
    }
    public setMsgCommonServerDisconnect(value: $Message$CommonProto$NetMessage$MsgCommonServerDisconnect | null | undefined): void {
        this._MsgCommonServerDisconnect = value;
    }
    public createIfNotExistsMsgCommonServerDisconnect(): $Message$CommonProto$NetMessage$MsgCommonServerDisconnect {
        return this._MsgCommonServerDisconnect ??= new $Message$CommonProto$NetMessage$MsgCommonServerDisconnect();
    }

    public checkHasMsgCommonLatestConfigVersion(): boolean {
        return this._MsgCommonLatestConfigVersion != null;
    }
    public getMsgCommonLatestConfigVersion(): $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion | null | undefined {
        return this._MsgCommonLatestConfigVersion;
    }
    public setMsgCommonLatestConfigVersion(value: $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion | null | undefined): void {
        this._MsgCommonLatestConfigVersion = value;
    }
    public createIfNotExistsMsgCommonLatestConfigVersion(): $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion {
        return this._MsgCommonLatestConfigVersion ??= new $Message$CommonProto$NetMessage$MsgCommonLatestConfigVersion();
    }

    public checkHasMsgCommonGetServerStatus(): boolean {
        return this._MsgCommonGetServerStatus != null;
    }
    public getMsgCommonGetServerStatus(): $Message$CommonProto$NetMessage$MsgCommonGetServerStatus | null | undefined {
        return this._MsgCommonGetServerStatus;
    }
    public setMsgCommonGetServerStatus(value: $Message$CommonProto$NetMessage$MsgCommonGetServerStatus | null | undefined): void {
        this._MsgCommonGetServerStatus = value;
    }
    public createIfNotExistsMsgCommonGetServerStatus(): $Message$CommonProto$NetMessage$MsgCommonGetServerStatus {
        return this._MsgCommonGetServerStatus ??= new $Message$CommonProto$NetMessage$MsgCommonGetServerStatus();
    }

    public checkHasMsgCommonGetRankList(): boolean {
        return this._MsgCommonGetRankList != null;
    }
    public getMsgCommonGetRankList(): $Message$CommonProto$NetMessage$MsgCommonGetRankList | null | undefined {
        return this._MsgCommonGetRankList;
    }
    public setMsgCommonGetRankList(value: $Message$CommonProto$NetMessage$MsgCommonGetRankList | null | undefined): void {
        this._MsgCommonGetRankList = value;
    }
    public createIfNotExistsMsgCommonGetRankList(): $Message$CommonProto$NetMessage$MsgCommonGetRankList {
        return this._MsgCommonGetRankList ??= new $Message$CommonProto$NetMessage$MsgCommonGetRankList();
    }

    public checkHasMsgCommonGetCoStatistics(): boolean {
        return this._MsgCommonGetCoStatistics != null;
    }
    public getMsgCommonGetCoStatistics(): $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics | null | undefined {
        return this._MsgCommonGetCoStatistics;
    }
    public setMsgCommonGetCoStatistics(value: $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics | null | undefined): void {
        this._MsgCommonGetCoStatistics = value;
    }
    public createIfNotExistsMsgCommonGetCoStatistics(): $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics {
        return this._MsgCommonGetCoStatistics ??= new $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics();
    }

    public checkHasMsgUserRegister(): boolean {
        return this._MsgUserRegister != null;
    }
    public getMsgUserRegister(): $Message$CommonProto$NetMessage$MsgUserRegister | null | undefined {
        return this._MsgUserRegister;
    }
    public setMsgUserRegister(value: $Message$CommonProto$NetMessage$MsgUserRegister | null | undefined): void {
        this._MsgUserRegister = value;
    }
    public createIfNotExistsMsgUserRegister(): $Message$CommonProto$NetMessage$MsgUserRegister {
        return this._MsgUserRegister ??= new $Message$CommonProto$NetMessage$MsgUserRegister();
    }

    public checkHasMsgUserLogin(): boolean {
        return this._MsgUserLogin != null;
    }
    public getMsgUserLogin(): $Message$CommonProto$NetMessage$MsgUserLogin | null | undefined {
        return this._MsgUserLogin;
    }
    public setMsgUserLogin(value: $Message$CommonProto$NetMessage$MsgUserLogin | null | undefined): void {
        this._MsgUserLogin = value;
    }
    public createIfNotExistsMsgUserLogin(): $Message$CommonProto$NetMessage$MsgUserLogin {
        return this._MsgUserLogin ??= new $Message$CommonProto$NetMessage$MsgUserLogin();
    }

    public checkHasMsgUserLogout(): boolean {
        return this._MsgUserLogout != null;
    }
    public getMsgUserLogout(): $Message$CommonProto$NetMessage$MsgUserLogout | null | undefined {
        return this._MsgUserLogout;
    }
    public setMsgUserLogout(value: $Message$CommonProto$NetMessage$MsgUserLogout | null | undefined): void {
        this._MsgUserLogout = value;
    }
    public createIfNotExistsMsgUserLogout(): $Message$CommonProto$NetMessage$MsgUserLogout {
        return this._MsgUserLogout ??= new $Message$CommonProto$NetMessage$MsgUserLogout();
    }

    public checkHasMsgUserGetPublicInfo(): boolean {
        return this._MsgUserGetPublicInfo != null;
    }
    public getMsgUserGetPublicInfo(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfo | null | undefined {
        return this._MsgUserGetPublicInfo;
    }
    public setMsgUserGetPublicInfo(value: $Message$CommonProto$NetMessage$MsgUserGetPublicInfo | null | undefined): void {
        this._MsgUserGetPublicInfo = value;
    }
    public createIfNotExistsMsgUserGetPublicInfo(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfo {
        return this._MsgUserGetPublicInfo ??= new $Message$CommonProto$NetMessage$MsgUserGetPublicInfo();
    }

    public checkHasMsgUserGetPublicInfoArray(): boolean {
        return this._MsgUserGetPublicInfoArray != null;
    }
    public getMsgUserGetPublicInfoArray(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray | null | undefined {
        return this._MsgUserGetPublicInfoArray;
    }
    public setMsgUserGetPublicInfoArray(value: $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray | null | undefined): void {
        this._MsgUserGetPublicInfoArray = value;
    }
    public createIfNotExistsMsgUserGetPublicInfoArray(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray {
        return this._MsgUserGetPublicInfoArray ??= new $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray();
    }

    public checkHasMsgUserGetBriefInfo(): boolean {
        return this._MsgUserGetBriefInfo != null;
    }
    public getMsgUserGetBriefInfo(): $Message$CommonProto$NetMessage$MsgUserGetBriefInfo | null | undefined {
        return this._MsgUserGetBriefInfo;
    }
    public setMsgUserGetBriefInfo(value: $Message$CommonProto$NetMessage$MsgUserGetBriefInfo | null | undefined): void {
        this._MsgUserGetBriefInfo = value;
    }
    public createIfNotExistsMsgUserGetBriefInfo(): $Message$CommonProto$NetMessage$MsgUserGetBriefInfo {
        return this._MsgUserGetBriefInfo ??= new $Message$CommonProto$NetMessage$MsgUserGetBriefInfo();
    }

    public checkHasMsgUserGetOnlineState(): boolean {
        return this._MsgUserGetOnlineState != null;
    }
    public getMsgUserGetOnlineState(): $Message$CommonProto$NetMessage$MsgUserGetOnlineState | null | undefined {
        return this._MsgUserGetOnlineState;
    }
    public setMsgUserGetOnlineState(value: $Message$CommonProto$NetMessage$MsgUserGetOnlineState | null | undefined): void {
        this._MsgUserGetOnlineState = value;
    }
    public createIfNotExistsMsgUserGetOnlineState(): $Message$CommonProto$NetMessage$MsgUserGetOnlineState {
        return this._MsgUserGetOnlineState ??= new $Message$CommonProto$NetMessage$MsgUserGetOnlineState();
    }

    public checkHasMsgUserGetOnlineUserIdArray(): boolean {
        return this._MsgUserGetOnlineUserIdArray != null;
    }
    public getMsgUserGetOnlineUserIdArray(): $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray | null | undefined {
        return this._MsgUserGetOnlineUserIdArray;
    }
    public setMsgUserGetOnlineUserIdArray(value: $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray | null | undefined): void {
        this._MsgUserGetOnlineUserIdArray = value;
    }
    public createIfNotExistsMsgUserGetOnlineUserIdArray(): $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray {
        return this._MsgUserGetOnlineUserIdArray ??= new $Message$CommonProto$NetMessage$MsgUserGetOnlineUserIdArray();
    }

    public checkHasMsgUserSetNickname(): boolean {
        return this._MsgUserSetNickname != null;
    }
    public getMsgUserSetNickname(): $Message$CommonProto$NetMessage$MsgUserSetNickname | null | undefined {
        return this._MsgUserSetNickname;
    }
    public setMsgUserSetNickname(value: $Message$CommonProto$NetMessage$MsgUserSetNickname | null | undefined): void {
        this._MsgUserSetNickname = value;
    }
    public createIfNotExistsMsgUserSetNickname(): $Message$CommonProto$NetMessage$MsgUserSetNickname {
        return this._MsgUserSetNickname ??= new $Message$CommonProto$NetMessage$MsgUserSetNickname();
    }

    public checkHasMsgUserSetDiscordInfo(): boolean {
        return this._MsgUserSetDiscordInfo != null;
    }
    public getMsgUserSetDiscordInfo(): $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo | null | undefined {
        return this._MsgUserSetDiscordInfo;
    }
    public setMsgUserSetDiscordInfo(value: $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo | null | undefined): void {
        this._MsgUserSetDiscordInfo = value;
    }
    public createIfNotExistsMsgUserSetDiscordInfo(): $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo {
        return this._MsgUserSetDiscordInfo ??= new $Message$CommonProto$NetMessage$MsgUserSetDiscordInfo();
    }

    public checkHasMsgUserSetCoBgmSettings(): boolean {
        return this._MsgUserSetCoBgmSettings != null;
    }
    public getMsgUserSetCoBgmSettings(): $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings | null | undefined {
        return this._MsgUserSetCoBgmSettings;
    }
    public setMsgUserSetCoBgmSettings(value: $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings | null | undefined): void {
        this._MsgUserSetCoBgmSettings = value;
    }
    public createIfNotExistsMsgUserSetCoBgmSettings(): $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings {
        return this._MsgUserSetCoBgmSettings ??= new $Message$CommonProto$NetMessage$MsgUserSetCoBgmSettings();
    }

    public checkHasMsgUserSetSceneBgmSettings(): boolean {
        return this._MsgUserSetSceneBgmSettings != null;
    }
    public getMsgUserSetSceneBgmSettings(): $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings | null | undefined {
        return this._MsgUserSetSceneBgmSettings;
    }
    public setMsgUserSetSceneBgmSettings(value: $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings | null | undefined): void {
        this._MsgUserSetSceneBgmSettings = value;
    }
    public createIfNotExistsMsgUserSetSceneBgmSettings(): $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings {
        return this._MsgUserSetSceneBgmSettings ??= new $Message$CommonProto$NetMessage$MsgUserSetSceneBgmSettings();
    }

    public checkHasMsgUserSetPassword(): boolean {
        return this._MsgUserSetPassword != null;
    }
    public getMsgUserSetPassword(): $Message$CommonProto$NetMessage$MsgUserSetPassword | null | undefined {
        return this._MsgUserSetPassword;
    }
    public setMsgUserSetPassword(value: $Message$CommonProto$NetMessage$MsgUserSetPassword | null | undefined): void {
        this._MsgUserSetPassword = value;
    }
    public createIfNotExistsMsgUserSetPassword(): $Message$CommonProto$NetMessage$MsgUserSetPassword {
        return this._MsgUserSetPassword ??= new $Message$CommonProto$NetMessage$MsgUserSetPassword();
    }

    public checkHasMsgUserSetSettings(): boolean {
        return this._MsgUserSetSettings != null;
    }
    public getMsgUserSetSettings(): $Message$CommonProto$NetMessage$MsgUserSetSettings | null | undefined {
        return this._MsgUserSetSettings;
    }
    public setMsgUserSetSettings(value: $Message$CommonProto$NetMessage$MsgUserSetSettings | null | undefined): void {
        this._MsgUserSetSettings = value;
    }
    public createIfNotExistsMsgUserSetSettings(): $Message$CommonProto$NetMessage$MsgUserSetSettings {
        return this._MsgUserSetSettings ??= new $Message$CommonProto$NetMessage$MsgUserSetSettings();
    }

    public checkHasMsgUserSetMapRating(): boolean {
        return this._MsgUserSetMapRating != null;
    }
    public getMsgUserSetMapRating(): $Message$CommonProto$NetMessage$MsgUserSetMapRating | null | undefined {
        return this._MsgUserSetMapRating;
    }
    public setMsgUserSetMapRating(value: $Message$CommonProto$NetMessage$MsgUserSetMapRating | null | undefined): void {
        this._MsgUserSetMapRating = value;
    }
    public createIfNotExistsMsgUserSetMapRating(): $Message$CommonProto$NetMessage$MsgUserSetMapRating {
        return this._MsgUserSetMapRating ??= new $Message$CommonProto$NetMessage$MsgUserSetMapRating();
    }

    public checkHasMsgUserSetAvatarId(): boolean {
        return this._MsgUserSetAvatarId != null;
    }
    public getMsgUserSetAvatarId(): $Message$CommonProto$NetMessage$MsgUserSetAvatarId | null | undefined {
        return this._MsgUserSetAvatarId;
    }
    public setMsgUserSetAvatarId(value: $Message$CommonProto$NetMessage$MsgUserSetAvatarId | null | undefined): void {
        this._MsgUserSetAvatarId = value;
    }
    public createIfNotExistsMsgUserSetAvatarId(): $Message$CommonProto$NetMessage$MsgUserSetAvatarId {
        return this._MsgUserSetAvatarId ??= new $Message$CommonProto$NetMessage$MsgUserSetAvatarId();
    }

    public checkHasMsgUserSetMapEditorAutoSaveTime(): boolean {
        return this._MsgUserSetMapEditorAutoSaveTime != null;
    }
    public getMsgUserSetMapEditorAutoSaveTime(): $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime | null | undefined {
        return this._MsgUserSetMapEditorAutoSaveTime;
    }
    public setMsgUserSetMapEditorAutoSaveTime(value: $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime | null | undefined): void {
        this._MsgUserSetMapEditorAutoSaveTime = value;
    }
    public createIfNotExistsMsgUserSetMapEditorAutoSaveTime(): $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime {
        return this._MsgUserSetMapEditorAutoSaveTime ??= new $Message$CommonProto$NetMessage$MsgUserSetMapEditorAutoSaveTime();
    }

    public checkHasMsgUserLoginAsGuest(): boolean {
        return this._MsgUserLoginAsGuest != null;
    }
    public getMsgUserLoginAsGuest(): $Message$CommonProto$NetMessage$MsgUserLoginAsGuest | null | undefined {
        return this._MsgUserLoginAsGuest;
    }
    public setMsgUserLoginAsGuest(value: $Message$CommonProto$NetMessage$MsgUserLoginAsGuest | null | undefined): void {
        this._MsgUserLoginAsGuest = value;
    }
    public createIfNotExistsMsgUserLoginAsGuest(): $Message$CommonProto$NetMessage$MsgUserLoginAsGuest {
        return this._MsgUserLoginAsGuest ??= new $Message$CommonProto$NetMessage$MsgUserLoginAsGuest();
    }

    public checkHasMsgUserGetUsersByNickname(): boolean {
        return this._MsgUserGetUsersByNickname != null;
    }
    public getMsgUserGetUsersByNickname(): $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname | null | undefined {
        return this._MsgUserGetUsersByNickname;
    }
    public setMsgUserGetUsersByNickname(value: $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname | null | undefined): void {
        this._MsgUserGetUsersByNickname = value;
    }
    public createIfNotExistsMsgUserGetUsersByNickname(): $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname {
        return this._MsgUserGetUsersByNickname ??= new $Message$CommonProto$NetMessage$MsgUserGetUsersByNickname();
    }

    public checkHasMsgUserSetRelation(): boolean {
        return this._MsgUserSetRelation != null;
    }
    public getMsgUserSetRelation(): $Message$CommonProto$NetMessage$MsgUserSetRelation | null | undefined {
        return this._MsgUserSetRelation;
    }
    public setMsgUserSetRelation(value: $Message$CommonProto$NetMessage$MsgUserSetRelation | null | undefined): void {
        this._MsgUserSetRelation = value;
    }
    public createIfNotExistsMsgUserSetRelation(): $Message$CommonProto$NetMessage$MsgUserSetRelation {
        return this._MsgUserSetRelation ??= new $Message$CommonProto$NetMessage$MsgUserSetRelation();
    }

    public checkHasMsgUserSetShowMedalIdArray(): boolean {
        return this._MsgUserSetShowMedalIdArray != null;
    }
    public getMsgUserSetShowMedalIdArray(): $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray | null | undefined {
        return this._MsgUserSetShowMedalIdArray;
    }
    public setMsgUserSetShowMedalIdArray(value: $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray | null | undefined): void {
        this._MsgUserSetShowMedalIdArray = value;
    }
    public createIfNotExistsMsgUserSetShowMedalIdArray(): $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray {
        return this._MsgUserSetShowMedalIdArray ??= new $Message$CommonProto$NetMessage$MsgUserSetShowMedalIdArray();
    }

    public checkHasMsgUserModifyFavoriteReplayIdArray(): boolean {
        return this._MsgUserModifyFavoriteReplayIdArray != null;
    }
    public getMsgUserModifyFavoriteReplayIdArray(): $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray | null | undefined {
        return this._MsgUserModifyFavoriteReplayIdArray;
    }
    public setMsgUserModifyFavoriteReplayIdArray(value: $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray | null | undefined): void {
        this._MsgUserModifyFavoriteReplayIdArray = value;
    }
    public createIfNotExistsMsgUserModifyFavoriteReplayIdArray(): $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray {
        return this._MsgUserModifyFavoriteReplayIdArray ??= new $Message$CommonProto$NetMessage$MsgUserModifyFavoriteReplayIdArray();
    }

    public checkHasMsgUserRequestEmailVerificationCode(): boolean {
        return this._MsgUserRequestEmailVerificationCode != null;
    }
    public getMsgUserRequestEmailVerificationCode(): $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode | null | undefined {
        return this._MsgUserRequestEmailVerificationCode;
    }
    public setMsgUserRequestEmailVerificationCode(value: $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode | null | undefined): void {
        this._MsgUserRequestEmailVerificationCode = value;
    }
    public createIfNotExistsMsgUserRequestEmailVerificationCode(): $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode {
        return this._MsgUserRequestEmailVerificationCode ??= new $Message$CommonProto$NetMessage$MsgUserRequestEmailVerificationCode();
    }

    public checkHasMsgUserVerifyEmail(): boolean {
        return this._MsgUserVerifyEmail != null;
    }
    public getMsgUserVerifyEmail(): $Message$CommonProto$NetMessage$MsgUserVerifyEmail | null | undefined {
        return this._MsgUserVerifyEmail;
    }
    public setMsgUserVerifyEmail(value: $Message$CommonProto$NetMessage$MsgUserVerifyEmail | null | undefined): void {
        this._MsgUserVerifyEmail = value;
    }
    public createIfNotExistsMsgUserVerifyEmail(): $Message$CommonProto$NetMessage$MsgUserVerifyEmail {
        return this._MsgUserVerifyEmail ??= new $Message$CommonProto$NetMessage$MsgUserVerifyEmail();
    }

    public checkHasMsgUserRequestPasswordVerificationCode(): boolean {
        return this._MsgUserRequestPasswordVerificationCode != null;
    }
    public getMsgUserRequestPasswordVerificationCode(): $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode | null | undefined {
        return this._MsgUserRequestPasswordVerificationCode;
    }
    public setMsgUserRequestPasswordVerificationCode(value: $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode | null | undefined): void {
        this._MsgUserRequestPasswordVerificationCode = value;
    }
    public createIfNotExistsMsgUserRequestPasswordVerificationCode(): $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode {
        return this._MsgUserRequestPasswordVerificationCode ??= new $Message$CommonProto$NetMessage$MsgUserRequestPasswordVerificationCode();
    }

    public checkHasMsgUserResetPasswordWithEmail(): boolean {
        return this._MsgUserResetPasswordWithEmail != null;
    }
    public getMsgUserResetPasswordWithEmail(): $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail | null | undefined {
        return this._MsgUserResetPasswordWithEmail;
    }
    public setMsgUserResetPasswordWithEmail(value: $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail | null | undefined): void {
        this._MsgUserResetPasswordWithEmail = value;
    }
    public createIfNotExistsMsgUserResetPasswordWithEmail(): $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail {
        return this._MsgUserResetPasswordWithEmail ??= new $Message$CommonProto$NetMessage$MsgUserResetPasswordWithEmail();
    }

    public checkHasMsgMeGetAllMapDataTimestamps(): boolean {
        return this._MsgMeGetAllMapDataTimestamps != null;
    }
    public getMsgMeGetAllMapDataTimestamps(): $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps | null | undefined {
        return this._MsgMeGetAllMapDataTimestamps;
    }
    public setMsgMeGetAllMapDataTimestamps(value: $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps | null | undefined): void {
        this._MsgMeGetAllMapDataTimestamps = value;
    }
    public createIfNotExistsMsgMeGetAllMapDataTimestamps(): $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps {
        return this._MsgMeGetAllMapDataTimestamps ??= new $Message$CommonProto$NetMessage$MsgMeGetAllMapDataTimestamps();
    }

    public checkHasMsgMeGetMapDataTimestamp(): boolean {
        return this._MsgMeGetMapDataTimestamp != null;
    }
    public getMsgMeGetMapDataTimestamp(): $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp | null | undefined {
        return this._MsgMeGetMapDataTimestamp;
    }
    public setMsgMeGetMapDataTimestamp(value: $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp | null | undefined): void {
        this._MsgMeGetMapDataTimestamp = value;
    }
    public createIfNotExistsMsgMeGetMapDataTimestamp(): $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp {
        return this._MsgMeGetMapDataTimestamp ??= new $Message$CommonProto$NetMessage$MsgMeGetMapDataTimestamp();
    }

    public checkHasMsgMeGetMapDataArray(): boolean {
        return this._MsgMeGetMapDataArray != null;
    }
    public getMsgMeGetMapDataArray(): $Message$CommonProto$NetMessage$MsgMeGetMapDataArray | null | undefined {
        return this._MsgMeGetMapDataArray;
    }
    public setMsgMeGetMapDataArray(value: $Message$CommonProto$NetMessage$MsgMeGetMapDataArray | null | undefined): void {
        this._MsgMeGetMapDataArray = value;
    }
    public createIfNotExistsMsgMeGetMapDataArray(): $Message$CommonProto$NetMessage$MsgMeGetMapDataArray {
        return this._MsgMeGetMapDataArray ??= new $Message$CommonProto$NetMessage$MsgMeGetMapDataArray();
    }

    public checkHasMsgMeGetMapData(): boolean {
        return this._MsgMeGetMapData != null;
    }
    public getMsgMeGetMapData(): $Message$CommonProto$NetMessage$MsgMeGetMapData | null | undefined {
        return this._MsgMeGetMapData;
    }
    public setMsgMeGetMapData(value: $Message$CommonProto$NetMessage$MsgMeGetMapData | null | undefined): void {
        this._MsgMeGetMapData = value;
    }
    public createIfNotExistsMsgMeGetMapData(): $Message$CommonProto$NetMessage$MsgMeGetMapData {
        return this._MsgMeGetMapData ??= new $Message$CommonProto$NetMessage$MsgMeGetMapData();
    }

    public checkHasMsgMeSubmitNormalMap(): boolean {
        return this._MsgMeSubmitNormalMap != null;
    }
    public getMsgMeSubmitNormalMap(): $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap | null | undefined {
        return this._MsgMeSubmitNormalMap;
    }
    public setMsgMeSubmitNormalMap(value: $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap | null | undefined): void {
        this._MsgMeSubmitNormalMap = value;
    }
    public createIfNotExistsMsgMeSubmitNormalMap(): $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap {
        return this._MsgMeSubmitNormalMap ??= new $Message$CommonProto$NetMessage$MsgMeSubmitNormalMap();
    }

    public checkHasMsgMeDeleteSlot(): boolean {
        return this._MsgMeDeleteSlot != null;
    }
    public getMsgMeDeleteSlot(): $Message$CommonProto$NetMessage$MsgMeDeleteSlot | null | undefined {
        return this._MsgMeDeleteSlot;
    }
    public setMsgMeDeleteSlot(value: $Message$CommonProto$NetMessage$MsgMeDeleteSlot | null | undefined): void {
        this._MsgMeDeleteSlot = value;
    }
    public createIfNotExistsMsgMeDeleteSlot(): $Message$CommonProto$NetMessage$MsgMeDeleteSlot {
        return this._MsgMeDeleteSlot ??= new $Message$CommonProto$NetMessage$MsgMeDeleteSlot();
    }

    public checkHasMsgChatAddMessage(): boolean {
        return this._MsgChatAddMessage != null;
    }
    public getMsgChatAddMessage(): $Message$CommonProto$NetMessage$MsgChatAddMessage | null | undefined {
        return this._MsgChatAddMessage;
    }
    public setMsgChatAddMessage(value: $Message$CommonProto$NetMessage$MsgChatAddMessage | null | undefined): void {
        this._MsgChatAddMessage = value;
    }
    public createIfNotExistsMsgChatAddMessage(): $Message$CommonProto$NetMessage$MsgChatAddMessage {
        return this._MsgChatAddMessage ??= new $Message$CommonProto$NetMessage$MsgChatAddMessage();
    }

    public checkHasMsgChatGetAllMessages(): boolean {
        return this._MsgChatGetAllMessages != null;
    }
    public getMsgChatGetAllMessages(): $Message$CommonProto$NetMessage$MsgChatGetAllMessages | null | undefined {
        return this._MsgChatGetAllMessages;
    }
    public setMsgChatGetAllMessages(value: $Message$CommonProto$NetMessage$MsgChatGetAllMessages | null | undefined): void {
        this._MsgChatGetAllMessages = value;
    }
    public createIfNotExistsMsgChatGetAllMessages(): $Message$CommonProto$NetMessage$MsgChatGetAllMessages {
        return this._MsgChatGetAllMessages ??= new $Message$CommonProto$NetMessage$MsgChatGetAllMessages();
    }

    public checkHasMsgChatUpdateReadProgress(): boolean {
        return this._MsgChatUpdateReadProgress != null;
    }
    public getMsgChatUpdateReadProgress(): $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress | null | undefined {
        return this._MsgChatUpdateReadProgress;
    }
    public setMsgChatUpdateReadProgress(value: $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress | null | undefined): void {
        this._MsgChatUpdateReadProgress = value;
    }
    public createIfNotExistsMsgChatUpdateReadProgress(): $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress {
        return this._MsgChatUpdateReadProgress ??= new $Message$CommonProto$NetMessage$MsgChatUpdateReadProgress();
    }

    public checkHasMsgChatGetAllReadProgressList(): boolean {
        return this._MsgChatGetAllReadProgressList != null;
    }
    public getMsgChatGetAllReadProgressList(): $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList | null | undefined {
        return this._MsgChatGetAllReadProgressList;
    }
    public setMsgChatGetAllReadProgressList(value: $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList | null | undefined): void {
        this._MsgChatGetAllReadProgressList = value;
    }
    public createIfNotExistsMsgChatGetAllReadProgressList(): $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList {
        return this._MsgChatGetAllReadProgressList ??= new $Message$CommonProto$NetMessage$MsgChatGetAllReadProgressList();
    }

    public checkHasMsgChatDeleteMessage(): boolean {
        return this._MsgChatDeleteMessage != null;
    }
    public getMsgChatDeleteMessage(): $Message$CommonProto$NetMessage$MsgChatDeleteMessage | null | undefined {
        return this._MsgChatDeleteMessage;
    }
    public setMsgChatDeleteMessage(value: $Message$CommonProto$NetMessage$MsgChatDeleteMessage | null | undefined): void {
        this._MsgChatDeleteMessage = value;
    }
    public createIfNotExistsMsgChatDeleteMessage(): $Message$CommonProto$NetMessage$MsgChatDeleteMessage {
        return this._MsgChatDeleteMessage ??= new $Message$CommonProto$NetMessage$MsgChatDeleteMessage();
    }

    public checkHasMsgMmSetWarRuleAvailability(): boolean {
        return this._MsgMmSetWarRuleAvailability != null;
    }
    public getMsgMmSetWarRuleAvailability(): $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability | null | undefined {
        return this._MsgMmSetWarRuleAvailability;
    }
    public setMsgMmSetWarRuleAvailability(value: $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability | null | undefined): void {
        this._MsgMmSetWarRuleAvailability = value;
    }
    public createIfNotExistsMsgMmSetWarRuleAvailability(): $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability {
        return this._MsgMmSetWarRuleAvailability ??= new $Message$CommonProto$NetMessage$MsgMmSetWarRuleAvailability();
    }

    public checkHasMsgMmSetMapEnabled(): boolean {
        return this._MsgMmSetMapEnabled != null;
    }
    public getMsgMmSetMapEnabled(): $Message$CommonProto$NetMessage$MsgMmSetMapEnabled | null | undefined {
        return this._MsgMmSetMapEnabled;
    }
    public setMsgMmSetMapEnabled(value: $Message$CommonProto$NetMessage$MsgMmSetMapEnabled | null | undefined): void {
        this._MsgMmSetMapEnabled = value;
    }
    public createIfNotExistsMsgMmSetMapEnabled(): $Message$CommonProto$NetMessage$MsgMmSetMapEnabled {
        return this._MsgMmSetMapEnabled ??= new $Message$CommonProto$NetMessage$MsgMmSetMapEnabled();
    }

    public checkHasMsgMmGetReviewingMaps(): boolean {
        return this._MsgMmGetReviewingMaps != null;
    }
    public getMsgMmGetReviewingMaps(): $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps | null | undefined {
        return this._MsgMmGetReviewingMaps;
    }
    public setMsgMmGetReviewingMaps(value: $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps | null | undefined): void {
        this._MsgMmGetReviewingMaps = value;
    }
    public createIfNotExistsMsgMmGetReviewingMaps(): $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps {
        return this._MsgMmGetReviewingMaps ??= new $Message$CommonProto$NetMessage$MsgMmGetReviewingMaps();
    }

    public checkHasMsgMmReviewMap(): boolean {
        return this._MsgMmReviewMap != null;
    }
    public getMsgMmReviewMap(): $Message$CommonProto$NetMessage$MsgMmReviewMap | null | undefined {
        return this._MsgMmReviewMap;
    }
    public setMsgMmReviewMap(value: $Message$CommonProto$NetMessage$MsgMmReviewMap | null | undefined): void {
        this._MsgMmReviewMap = value;
    }
    public createIfNotExistsMsgMmReviewMap(): $Message$CommonProto$NetMessage$MsgMmReviewMap {
        return this._MsgMmReviewMap ??= new $Message$CommonProto$NetMessage$MsgMmReviewMap();
    }

    public checkHasMsgMmSetMapTagIdFlags(): boolean {
        return this._MsgMmSetMapTagIdFlags != null;
    }
    public getMsgMmSetMapTagIdFlags(): $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags | null | undefined {
        return this._MsgMmSetMapTagIdFlags;
    }
    public setMsgMmSetMapTagIdFlags(value: $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags | null | undefined): void {
        this._MsgMmSetMapTagIdFlags = value;
    }
    public createIfNotExistsMsgMmSetMapTagIdFlags(): $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags {
        return this._MsgMmSetMapTagIdFlags ??= new $Message$CommonProto$NetMessage$MsgMmSetMapTagIdFlags();
    }

    public checkHasMsgMmSetMapName(): boolean {
        return this._MsgMmSetMapName != null;
    }
    public getMsgMmSetMapName(): $Message$CommonProto$NetMessage$MsgMmSetMapName | null | undefined {
        return this._MsgMmSetMapName;
    }
    public setMsgMmSetMapName(value: $Message$CommonProto$NetMessage$MsgMmSetMapName | null | undefined): void {
        this._MsgMmSetMapName = value;
    }
    public createIfNotExistsMsgMmSetMapName(): $Message$CommonProto$NetMessage$MsgMmSetMapName {
        return this._MsgMmSetMapName ??= new $Message$CommonProto$NetMessage$MsgMmSetMapName();
    }

    public checkHasMsgMmAddWarRule(): boolean {
        return this._MsgMmAddWarRule != null;
    }
    public getMsgMmAddWarRule(): $Message$CommonProto$NetMessage$MsgMmAddWarRule | null | undefined {
        return this._MsgMmAddWarRule;
    }
    public setMsgMmAddWarRule(value: $Message$CommonProto$NetMessage$MsgMmAddWarRule | null | undefined): void {
        this._MsgMmAddWarRule = value;
    }
    public createIfNotExistsMsgMmAddWarRule(): $Message$CommonProto$NetMessage$MsgMmAddWarRule {
        return this._MsgMmAddWarRule ??= new $Message$CommonProto$NetMessage$MsgMmAddWarRule();
    }

    public checkHasMsgMmAddWarEvent(): boolean {
        return this._MsgMmAddWarEvent != null;
    }
    public getMsgMmAddWarEvent(): $Message$CommonProto$NetMessage$MsgMmAddWarEvent | null | undefined {
        return this._MsgMmAddWarEvent;
    }
    public setMsgMmAddWarEvent(value: $Message$CommonProto$NetMessage$MsgMmAddWarEvent | null | undefined): void {
        this._MsgMmAddWarEvent = value;
    }
    public createIfNotExistsMsgMmAddWarEvent(): $Message$CommonProto$NetMessage$MsgMmAddWarEvent {
        return this._MsgMmAddWarEvent ??= new $Message$CommonProto$NetMessage$MsgMmAddWarEvent();
    }

    public checkHasMsgMmDeleteWarRule(): boolean {
        return this._MsgMmDeleteWarRule != null;
    }
    public getMsgMmDeleteWarRule(): $Message$CommonProto$NetMessage$MsgMmDeleteWarRule | null | undefined {
        return this._MsgMmDeleteWarRule;
    }
    public setMsgMmDeleteWarRule(value: $Message$CommonProto$NetMessage$MsgMmDeleteWarRule | null | undefined): void {
        this._MsgMmDeleteWarRule = value;
    }
    public createIfNotExistsMsgMmDeleteWarRule(): $Message$CommonProto$NetMessage$MsgMmDeleteWarRule {
        return this._MsgMmDeleteWarRule ??= new $Message$CommonProto$NetMessage$MsgMmDeleteWarRule();
    }

    public checkHasMsgMmDeleteRedundantWarEvent(): boolean {
        return this._MsgMmDeleteRedundantWarEvent != null;
    }
    public getMsgMmDeleteRedundantWarEvent(): $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent | null | undefined {
        return this._MsgMmDeleteRedundantWarEvent;
    }
    public setMsgMmDeleteRedundantWarEvent(value: $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent | null | undefined): void {
        this._MsgMmDeleteRedundantWarEvent = value;
    }
    public createIfNotExistsMsgMmDeleteRedundantWarEvent(): $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent {
        return this._MsgMmDeleteRedundantWarEvent ??= new $Message$CommonProto$NetMessage$MsgMmDeleteRedundantWarEvent();
    }

    public checkHasMsgMmSetWarRuleName(): boolean {
        return this._MsgMmSetWarRuleName != null;
    }
    public getMsgMmSetWarRuleName(): $Message$CommonProto$NetMessage$MsgMmSetWarRuleName | null | undefined {
        return this._MsgMmSetWarRuleName;
    }
    public setMsgMmSetWarRuleName(value: $Message$CommonProto$NetMessage$MsgMmSetWarRuleName | null | undefined): void {
        this._MsgMmSetWarRuleName = value;
    }
    public createIfNotExistsMsgMmSetWarRuleName(): $Message$CommonProto$NetMessage$MsgMmSetWarRuleName {
        return this._MsgMmSetWarRuleName ??= new $Message$CommonProto$NetMessage$MsgMmSetWarRuleName();
    }

    public checkHasMsgMmSetWarRuleFixedTileTheme(): boolean {
        return this._MsgMmSetWarRuleFixedTileTheme != null;
    }
    public getMsgMmSetWarRuleFixedTileTheme(): $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme | null | undefined {
        return this._MsgMmSetWarRuleFixedTileTheme;
    }
    public setMsgMmSetWarRuleFixedTileTheme(value: $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme | null | undefined): void {
        this._MsgMmSetWarRuleFixedTileTheme = value;
    }
    public createIfNotExistsMsgMmSetWarRuleFixedTileTheme(): $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme {
        return this._MsgMmSetWarRuleFixedTileTheme ??= new $Message$CommonProto$NetMessage$MsgMmSetWarRuleFixedTileTheme();
    }

    public checkHasMsgMmSetMapTagSingleData(): boolean {
        return this._MsgMmSetMapTagSingleData != null;
    }
    public getMsgMmSetMapTagSingleData(): $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData | null | undefined {
        return this._MsgMmSetMapTagSingleData;
    }
    public setMsgMmSetMapTagSingleData(value: $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData | null | undefined): void {
        this._MsgMmSetMapTagSingleData = value;
    }
    public createIfNotExistsMsgMmSetMapTagSingleData(): $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData {
        return this._MsgMmSetMapTagSingleData ??= new $Message$CommonProto$NetMessage$MsgMmSetMapTagSingleData();
    }

    public checkHasMsgMmSubmitMapSimpleDialogue(): boolean {
        return this._MsgMmSubmitMapSimpleDialogue != null;
    }
    public getMsgMmSubmitMapSimpleDialogue(): $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue | null | undefined {
        return this._MsgMmSubmitMapSimpleDialogue;
    }
    public setMsgMmSubmitMapSimpleDialogue(value: $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue | null | undefined): void {
        this._MsgMmSubmitMapSimpleDialogue = value;
    }
    public createIfNotExistsMsgMmSubmitMapSimpleDialogue(): $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue {
        return this._MsgMmSubmitMapSimpleDialogue ??= new $Message$CommonProto$NetMessage$MsgMmSubmitMapSimpleDialogue();
    }

    public checkHasMsgMmAddIgnoredReviewingMap(): boolean {
        return this._MsgMmAddIgnoredReviewingMap != null;
    }
    public getMsgMmAddIgnoredReviewingMap(): $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap | null | undefined {
        return this._MsgMmAddIgnoredReviewingMap;
    }
    public setMsgMmAddIgnoredReviewingMap(value: $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap | null | undefined): void {
        this._MsgMmAddIgnoredReviewingMap = value;
    }
    public createIfNotExistsMsgMmAddIgnoredReviewingMap(): $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap {
        return this._MsgMmAddIgnoredReviewingMap ??= new $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap();
    }

    public checkHasMsgReplaySetSelfRating(): boolean {
        return this._MsgReplaySetSelfRating != null;
    }
    public getMsgReplaySetSelfRating(): $Message$CommonProto$NetMessage$MsgReplaySetSelfRating | null | undefined {
        return this._MsgReplaySetSelfRating;
    }
    public setMsgReplaySetSelfRating(value: $Message$CommonProto$NetMessage$MsgReplaySetSelfRating | null | undefined): void {
        this._MsgReplaySetSelfRating = value;
    }
    public createIfNotExistsMsgReplaySetSelfRating(): $Message$CommonProto$NetMessage$MsgReplaySetSelfRating {
        return this._MsgReplaySetSelfRating ??= new $Message$CommonProto$NetMessage$MsgReplaySetSelfRating();
    }

    public checkHasMsgReplayGetSelfRating(): boolean {
        return this._MsgReplayGetSelfRating != null;
    }
    public getMsgReplayGetSelfRating(): $Message$CommonProto$NetMessage$MsgReplayGetSelfRating | null | undefined {
        return this._MsgReplayGetSelfRating;
    }
    public setMsgReplayGetSelfRating(value: $Message$CommonProto$NetMessage$MsgReplayGetSelfRating | null | undefined): void {
        this._MsgReplayGetSelfRating = value;
    }
    public createIfNotExistsMsgReplayGetSelfRating(): $Message$CommonProto$NetMessage$MsgReplayGetSelfRating {
        return this._MsgReplayGetSelfRating ??= new $Message$CommonProto$NetMessage$MsgReplayGetSelfRating();
    }

    public checkHasMsgReplayGetData(): boolean {
        return this._MsgReplayGetData != null;
    }
    public getMsgReplayGetData(): $Message$CommonProto$NetMessage$MsgReplayGetData | null | undefined {
        return this._MsgReplayGetData;
    }
    public setMsgReplayGetData(value: $Message$CommonProto$NetMessage$MsgReplayGetData | null | undefined): void {
        this._MsgReplayGetData = value;
    }
    public createIfNotExistsMsgReplayGetData(): $Message$CommonProto$NetMessage$MsgReplayGetData {
        return this._MsgReplayGetData ??= new $Message$CommonProto$NetMessage$MsgReplayGetData();
    }

    public checkHasMsgReplayGetReplayInfo(): boolean {
        return this._MsgReplayGetReplayInfo != null;
    }
    public getMsgReplayGetReplayInfo(): $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo | null | undefined {
        return this._MsgReplayGetReplayInfo;
    }
    public setMsgReplayGetReplayInfo(value: $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo | null | undefined): void {
        this._MsgReplayGetReplayInfo = value;
    }
    public createIfNotExistsMsgReplayGetReplayInfo(): $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo {
        return this._MsgReplayGetReplayInfo ??= new $Message$CommonProto$NetMessage$MsgReplayGetReplayInfo();
    }

    public checkHasMsgReplayGetReplayInfoArray(): boolean {
        return this._MsgReplayGetReplayInfoArray != null;
    }
    public getMsgReplayGetReplayInfoArray(): $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray | null | undefined {
        return this._MsgReplayGetReplayInfoArray;
    }
    public setMsgReplayGetReplayInfoArray(value: $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray | null | undefined): void {
        this._MsgReplayGetReplayInfoArray = value;
    }
    public createIfNotExistsMsgReplayGetReplayInfoArray(): $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray {
        return this._MsgReplayGetReplayInfoArray ??= new $Message$CommonProto$NetMessage$MsgReplayGetReplayInfoArray();
    }

    public checkHasMsgReplayGetAllInfoVersions(): boolean {
        return this._MsgReplayGetAllInfoVersions != null;
    }
    public getMsgReplayGetAllInfoVersions(): $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions | null | undefined {
        return this._MsgReplayGetAllInfoVersions;
    }
    public setMsgReplayGetAllInfoVersions(value: $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions | null | undefined): void {
        this._MsgReplayGetAllInfoVersions = value;
    }
    public createIfNotExistsMsgReplayGetAllInfoVersions(): $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions {
        return this._MsgReplayGetAllInfoVersions ??= new $Message$CommonProto$NetMessage$MsgReplayGetAllInfoVersions();
    }

    public checkHasMsgReplayGetInfoVersion(): boolean {
        return this._MsgReplayGetInfoVersion != null;
    }
    public getMsgReplayGetInfoVersion(): $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion | null | undefined {
        return this._MsgReplayGetInfoVersion;
    }
    public setMsgReplayGetInfoVersion(value: $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion | null | undefined): void {
        this._MsgReplayGetInfoVersion = value;
    }
    public createIfNotExistsMsgReplayGetInfoVersion(): $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion {
        return this._MsgReplayGetInfoVersion ??= new $Message$CommonProto$NetMessage$MsgReplayGetInfoVersion();
    }

    public checkHasMsgMcrCreateRoom(): boolean {
        return this._MsgMcrCreateRoom != null;
    }
    public getMsgMcrCreateRoom(): $Message$CommonProto$NetMessage$MsgMcrCreateRoom | null | undefined {
        return this._MsgMcrCreateRoom;
    }
    public setMsgMcrCreateRoom(value: $Message$CommonProto$NetMessage$MsgMcrCreateRoom | null | undefined): void {
        this._MsgMcrCreateRoom = value;
    }
    public createIfNotExistsMsgMcrCreateRoom(): $Message$CommonProto$NetMessage$MsgMcrCreateRoom {
        return this._MsgMcrCreateRoom ??= new $Message$CommonProto$NetMessage$MsgMcrCreateRoom();
    }

    public checkHasMsgMcrExitRoom(): boolean {
        return this._MsgMcrExitRoom != null;
    }
    public getMsgMcrExitRoom(): $Message$CommonProto$NetMessage$MsgMcrExitRoom | null | undefined {
        return this._MsgMcrExitRoom;
    }
    public setMsgMcrExitRoom(value: $Message$CommonProto$NetMessage$MsgMcrExitRoom | null | undefined): void {
        this._MsgMcrExitRoom = value;
    }
    public createIfNotExistsMsgMcrExitRoom(): $Message$CommonProto$NetMessage$MsgMcrExitRoom {
        return this._MsgMcrExitRoom ??= new $Message$CommonProto$NetMessage$MsgMcrExitRoom();
    }

    public checkHasMsgMcrJoinRoom(): boolean {
        return this._MsgMcrJoinRoom != null;
    }
    public getMsgMcrJoinRoom(): $Message$CommonProto$NetMessage$MsgMcrJoinRoom | null | undefined {
        return this._MsgMcrJoinRoom;
    }
    public setMsgMcrJoinRoom(value: $Message$CommonProto$NetMessage$MsgMcrJoinRoom | null | undefined): void {
        this._MsgMcrJoinRoom = value;
    }
    public createIfNotExistsMsgMcrJoinRoom(): $Message$CommonProto$NetMessage$MsgMcrJoinRoom {
        return this._MsgMcrJoinRoom ??= new $Message$CommonProto$NetMessage$MsgMcrJoinRoom();
    }

    public checkHasMsgMcrDeleteRoom(): boolean {
        return this._MsgMcrDeleteRoom != null;
    }
    public getMsgMcrDeleteRoom(): $Message$CommonProto$NetMessage$MsgMcrDeleteRoom | null | undefined {
        return this._MsgMcrDeleteRoom;
    }
    public setMsgMcrDeleteRoom(value: $Message$CommonProto$NetMessage$MsgMcrDeleteRoom | null | undefined): void {
        this._MsgMcrDeleteRoom = value;
    }
    public createIfNotExistsMsgMcrDeleteRoom(): $Message$CommonProto$NetMessage$MsgMcrDeleteRoom {
        return this._MsgMcrDeleteRoom ??= new $Message$CommonProto$NetMessage$MsgMcrDeleteRoom();
    }

    public checkHasMsgMcrSetReady(): boolean {
        return this._MsgMcrSetReady != null;
    }
    public getMsgMcrSetReady(): $Message$CommonProto$NetMessage$MsgMcrSetReady | null | undefined {
        return this._MsgMcrSetReady;
    }
    public setMsgMcrSetReady(value: $Message$CommonProto$NetMessage$MsgMcrSetReady | null | undefined): void {
        this._MsgMcrSetReady = value;
    }
    public createIfNotExistsMsgMcrSetReady(): $Message$CommonProto$NetMessage$MsgMcrSetReady {
        return this._MsgMcrSetReady ??= new $Message$CommonProto$NetMessage$MsgMcrSetReady();
    }

    public checkHasMsgMcrDeletePlayer(): boolean {
        return this._MsgMcrDeletePlayer != null;
    }
    public getMsgMcrDeletePlayer(): $Message$CommonProto$NetMessage$MsgMcrDeletePlayer | null | undefined {
        return this._MsgMcrDeletePlayer;
    }
    public setMsgMcrDeletePlayer(value: $Message$CommonProto$NetMessage$MsgMcrDeletePlayer | null | undefined): void {
        this._MsgMcrDeletePlayer = value;
    }
    public createIfNotExistsMsgMcrDeletePlayer(): $Message$CommonProto$NetMessage$MsgMcrDeletePlayer {
        return this._MsgMcrDeletePlayer ??= new $Message$CommonProto$NetMessage$MsgMcrDeletePlayer();
    }

    public checkHasMsgMcrSetSelfSettings(): boolean {
        return this._MsgMcrSetSelfSettings != null;
    }
    public getMsgMcrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings | null | undefined {
        return this._MsgMcrSetSelfSettings;
    }
    public setMsgMcrSetSelfSettings(value: $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings | null | undefined): void {
        this._MsgMcrSetSelfSettings = value;
    }
    public createIfNotExistsMsgMcrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings {
        return this._MsgMcrSetSelfSettings ??= new $Message$CommonProto$NetMessage$MsgMcrSetSelfSettings();
    }

    public checkHasMsgMcrStartWar(): boolean {
        return this._MsgMcrStartWar != null;
    }
    public getMsgMcrStartWar(): $Message$CommonProto$NetMessage$MsgMcrStartWar | null | undefined {
        return this._MsgMcrStartWar;
    }
    public setMsgMcrStartWar(value: $Message$CommonProto$NetMessage$MsgMcrStartWar | null | undefined): void {
        this._MsgMcrStartWar = value;
    }
    public createIfNotExistsMsgMcrStartWar(): $Message$CommonProto$NetMessage$MsgMcrStartWar {
        return this._MsgMcrStartWar ??= new $Message$CommonProto$NetMessage$MsgMcrStartWar();
    }

    public checkHasMsgMcrGetJoinedRoomIdArray(): boolean {
        return this._MsgMcrGetJoinedRoomIdArray != null;
    }
    public getMsgMcrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray | null | undefined {
        return this._MsgMcrGetJoinedRoomIdArray;
    }
    public setMsgMcrGetJoinedRoomIdArray(value: $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray | null | undefined): void {
        this._MsgMcrGetJoinedRoomIdArray = value;
    }
    public createIfNotExistsMsgMcrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray {
        return this._MsgMcrGetJoinedRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgMcrGetJoinedRoomIdArray();
    }

    public checkHasMsgMcrGetJoinableRoomIdArray(): boolean {
        return this._MsgMcrGetJoinableRoomIdArray != null;
    }
    public getMsgMcrGetJoinableRoomIdArray(): $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray | null | undefined {
        return this._MsgMcrGetJoinableRoomIdArray;
    }
    public setMsgMcrGetJoinableRoomIdArray(value: $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray | null | undefined): void {
        this._MsgMcrGetJoinableRoomIdArray = value;
    }
    public createIfNotExistsMsgMcrGetJoinableRoomIdArray(): $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray {
        return this._MsgMcrGetJoinableRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgMcrGetJoinableRoomIdArray();
    }

    public checkHasMsgMcrGetRoomStaticInfo(): boolean {
        return this._MsgMcrGetRoomStaticInfo != null;
    }
    public getMsgMcrGetRoomStaticInfo(): $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo | null | undefined {
        return this._MsgMcrGetRoomStaticInfo;
    }
    public setMsgMcrGetRoomStaticInfo(value: $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo | null | undefined): void {
        this._MsgMcrGetRoomStaticInfo = value;
    }
    public createIfNotExistsMsgMcrGetRoomStaticInfo(): $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo {
        return this._MsgMcrGetRoomStaticInfo ??= new $Message$CommonProto$NetMessage$MsgMcrGetRoomStaticInfo();
    }

    public checkHasMsgMcrGetRoomPlayerInfo(): boolean {
        return this._MsgMcrGetRoomPlayerInfo != null;
    }
    public getMsgMcrGetRoomPlayerInfo(): $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo | null | undefined {
        return this._MsgMcrGetRoomPlayerInfo;
    }
    public setMsgMcrGetRoomPlayerInfo(value: $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo | null | undefined): void {
        this._MsgMcrGetRoomPlayerInfo = value;
    }
    public createIfNotExistsMsgMcrGetRoomPlayerInfo(): $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo {
        return this._MsgMcrGetRoomPlayerInfo ??= new $Message$CommonProto$NetMessage$MsgMcrGetRoomPlayerInfo();
    }

    public checkHasMsgMcrInvite(): boolean {
        return this._MsgMcrInvite != null;
    }
    public getMsgMcrInvite(): $Message$CommonProto$NetMessage$MsgMcrInvite | null | undefined {
        return this._MsgMcrInvite;
    }
    public setMsgMcrInvite(value: $Message$CommonProto$NetMessage$MsgMcrInvite | null | undefined): void {
        this._MsgMcrInvite = value;
    }
    public createIfNotExistsMsgMcrInvite(): $Message$CommonProto$NetMessage$MsgMcrInvite {
        return this._MsgMcrInvite ??= new $Message$CommonProto$NetMessage$MsgMcrInvite();
    }

    public checkHasMsgMcrAddDummy(): boolean {
        return this._MsgMcrAddDummy != null;
    }
    public getMsgMcrAddDummy(): $Message$CommonProto$NetMessage$MsgMcrAddDummy | null | undefined {
        return this._MsgMcrAddDummy;
    }
    public setMsgMcrAddDummy(value: $Message$CommonProto$NetMessage$MsgMcrAddDummy | null | undefined): void {
        this._MsgMcrAddDummy = value;
    }
    public createIfNotExistsMsgMcrAddDummy(): $Message$CommonProto$NetMessage$MsgMcrAddDummy {
        return this._MsgMcrAddDummy ??= new $Message$CommonProto$NetMessage$MsgMcrAddDummy();
    }

    public checkHasMsgMcrSetDummySettings(): boolean {
        return this._MsgMcrSetDummySettings != null;
    }
    public getMsgMcrSetDummySettings(): $Message$CommonProto$NetMessage$MsgMcrSetDummySettings | null | undefined {
        return this._MsgMcrSetDummySettings;
    }
    public setMsgMcrSetDummySettings(value: $Message$CommonProto$NetMessage$MsgMcrSetDummySettings | null | undefined): void {
        this._MsgMcrSetDummySettings = value;
    }
    public createIfNotExistsMsgMcrSetDummySettings(): $Message$CommonProto$NetMessage$MsgMcrSetDummySettings {
        return this._MsgMcrSetDummySettings ??= new $Message$CommonProto$NetMessage$MsgMcrSetDummySettings();
    }

    public checkHasMsgMpwCommonGetJoinedMpwIdArray(): boolean {
        return this._MsgMpwCommonGetJoinedMpwIdArray != null;
    }
    public getMsgMpwCommonGetJoinedMpwIdArray(): $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray | null | undefined {
        return this._MsgMpwCommonGetJoinedMpwIdArray;
    }
    public setMsgMpwCommonGetJoinedMpwIdArray(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray | null | undefined): void {
        this._MsgMpwCommonGetJoinedMpwIdArray = value;
    }
    public createIfNotExistsMsgMpwCommonGetJoinedMpwIdArray(): $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray {
        return this._MsgMpwCommonGetJoinedMpwIdArray ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray();
    }

    public checkHasMsgMpwCommonGetWarTimestamp(): boolean {
        return this._MsgMpwCommonGetWarTimestamp != null;
    }
    public getMsgMpwCommonGetWarTimestamp(): $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp | null | undefined {
        return this._MsgMpwCommonGetWarTimestamp;
    }
    public setMsgMpwCommonGetWarTimestamp(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp | null | undefined): void {
        this._MsgMpwCommonGetWarTimestamp = value;
    }
    public createIfNotExistsMsgMpwCommonGetWarTimestamp(): $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp {
        return this._MsgMpwCommonGetWarTimestamp ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetWarTimestamp();
    }

    public checkHasMsgMpwCommonGetUnitStatistics(): boolean {
        return this._MsgMpwCommonGetUnitStatistics != null;
    }
    public getMsgMpwCommonGetUnitStatistics(): $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics | null | undefined {
        return this._MsgMpwCommonGetUnitStatistics;
    }
    public setMsgMpwCommonGetUnitStatistics(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics | null | undefined): void {
        this._MsgMpwCommonGetUnitStatistics = value;
    }
    public createIfNotExistsMsgMpwCommonGetUnitStatistics(): $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics {
        return this._MsgMpwCommonGetUnitStatistics ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetUnitStatistics();
    }

    public checkHasMsgMpwCommonContinueWar(): boolean {
        return this._MsgMpwCommonContinueWar != null;
    }
    public getMsgMpwCommonContinueWar(): $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar | null | undefined {
        return this._MsgMpwCommonContinueWar;
    }
    public setMsgMpwCommonContinueWar(value: $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar | null | undefined): void {
        this._MsgMpwCommonContinueWar = value;
    }
    public createIfNotExistsMsgMpwCommonContinueWar(): $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar {
        return this._MsgMpwCommonContinueWar ??= new $Message$CommonProto$NetMessage$MsgMpwCommonContinueWar();
    }

    public checkHasMsgMpwCommonSyncWar(): boolean {
        return this._MsgMpwCommonSyncWar != null;
    }
    public getMsgMpwCommonSyncWar(): $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar | null | undefined {
        return this._MsgMpwCommonSyncWar;
    }
    public setMsgMpwCommonSyncWar(value: $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar | null | undefined): void {
        this._MsgMpwCommonSyncWar = value;
    }
    public createIfNotExistsMsgMpwCommonSyncWar(): $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar {
        return this._MsgMpwCommonSyncWar ??= new $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar();
    }

    public checkHasMsgMpwCommonHandleBoot(): boolean {
        return this._MsgMpwCommonHandleBoot != null;
    }
    public getMsgMpwCommonHandleBoot(): $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot | null | undefined {
        return this._MsgMpwCommonHandleBoot;
    }
    public setMsgMpwCommonHandleBoot(value: $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot | null | undefined): void {
        this._MsgMpwCommonHandleBoot = value;
    }
    public createIfNotExistsMsgMpwCommonHandleBoot(): $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot {
        return this._MsgMpwCommonHandleBoot ??= new $Message$CommonProto$NetMessage$MsgMpwCommonHandleBoot();
    }

    public checkHasMsgMpwCommonBroadcastGameStart(): boolean {
        return this._MsgMpwCommonBroadcastGameStart != null;
    }
    public getMsgMpwCommonBroadcastGameStart(): $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart | null | undefined {
        return this._MsgMpwCommonBroadcastGameStart;
    }
    public setMsgMpwCommonBroadcastGameStart(value: $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart | null | undefined): void {
        this._MsgMpwCommonBroadcastGameStart = value;
    }
    public createIfNotExistsMsgMpwCommonBroadcastGameStart(): $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart {
        return this._MsgMpwCommonBroadcastGameStart ??= new $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart();
    }

    public checkHasMsgMpwCommonGetWarSettings(): boolean {
        return this._MsgMpwCommonGetWarSettings != null;
    }
    public getMsgMpwCommonGetWarSettings(): $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings | null | undefined {
        return this._MsgMpwCommonGetWarSettings;
    }
    public setMsgMpwCommonGetWarSettings(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings | null | undefined): void {
        this._MsgMpwCommonGetWarSettings = value;
    }
    public createIfNotExistsMsgMpwCommonGetWarSettings(): $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings {
        return this._MsgMpwCommonGetWarSettings ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetWarSettings();
    }

    public checkHasMsgMpwCommonGetWarProgressInfo(): boolean {
        return this._MsgMpwCommonGetWarProgressInfo != null;
    }
    public getMsgMpwCommonGetWarProgressInfo(): $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo | null | undefined {
        return this._MsgMpwCommonGetWarProgressInfo;
    }
    public setMsgMpwCommonGetWarProgressInfo(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo | null | undefined): void {
        this._MsgMpwCommonGetWarProgressInfo = value;
    }
    public createIfNotExistsMsgMpwCommonGetWarProgressInfo(): $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo {
        return this._MsgMpwCommonGetWarProgressInfo ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetWarProgressInfo();
    }

    public checkHasMsgMpwCommonMarkGrid(): boolean {
        return this._MsgMpwCommonMarkGrid != null;
    }
    public getMsgMpwCommonMarkGrid(): $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid | null | undefined {
        return this._MsgMpwCommonMarkGrid;
    }
    public setMsgMpwCommonMarkGrid(value: $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid | null | undefined): void {
        this._MsgMpwCommonMarkGrid = value;
    }
    public createIfNotExistsMsgMpwCommonMarkGrid(): $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid {
        return this._MsgMpwCommonMarkGrid ??= new $Message$CommonProto$NetMessage$MsgMpwCommonMarkGrid();
    }

    public checkHasMsgMpwCommonSetHiddenGridMarkTypeIdList(): boolean {
        return this._MsgMpwCommonSetHiddenGridMarkTypeIdList != null;
    }
    public getMsgMpwCommonSetHiddenGridMarkTypeIdList(): $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList | null | undefined {
        return this._MsgMpwCommonSetHiddenGridMarkTypeIdList;
    }
    public setMsgMpwCommonSetHiddenGridMarkTypeIdList(value: $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList | null | undefined): void {
        this._MsgMpwCommonSetHiddenGridMarkTypeIdList = value;
    }
    public createIfNotExistsMsgMpwCommonSetHiddenGridMarkTypeIdList(): $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList {
        return this._MsgMpwCommonSetHiddenGridMarkTypeIdList ??= new $Message$CommonProto$NetMessage$MsgMpwCommonSetHiddenGridMarkTypeIdList();
    }

    public checkHasMsgMpwCommonSetGridMarkList(): boolean {
        return this._MsgMpwCommonSetGridMarkList != null;
    }
    public getMsgMpwCommonSetGridMarkList(): $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList | null | undefined {
        return this._MsgMpwCommonSetGridMarkList;
    }
    public setMsgMpwCommonSetGridMarkList(value: $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList | null | undefined): void {
        this._MsgMpwCommonSetGridMarkList = value;
    }
    public createIfNotExistsMsgMpwCommonSetGridMarkList(): $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList {
        return this._MsgMpwCommonSetGridMarkList ??= new $Message$CommonProto$NetMessage$MsgMpwCommonSetGridMarkList();
    }

    public checkHasMsgMpwCommonGetHalfwayReplayData(): boolean {
        return this._MsgMpwCommonGetHalfwayReplayData != null;
    }
    public getMsgMpwCommonGetHalfwayReplayData(): $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData | null | undefined {
        return this._MsgMpwCommonGetHalfwayReplayData;
    }
    public setMsgMpwCommonGetHalfwayReplayData(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData | null | undefined): void {
        this._MsgMpwCommonGetHalfwayReplayData = value;
    }
    public createIfNotExistsMsgMpwCommonGetHalfwayReplayData(): $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData {
        return this._MsgMpwCommonGetHalfwayReplayData ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetHalfwayReplayData();
    }

    public checkHasMsgMpwWatchMakeRequest(): boolean {
        return this._MsgMpwWatchMakeRequest != null;
    }
    public getMsgMpwWatchMakeRequest(): $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest | null | undefined {
        return this._MsgMpwWatchMakeRequest;
    }
    public setMsgMpwWatchMakeRequest(value: $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest | null | undefined): void {
        this._MsgMpwWatchMakeRequest = value;
    }
    public createIfNotExistsMsgMpwWatchMakeRequest(): $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest {
        return this._MsgMpwWatchMakeRequest ??= new $Message$CommonProto$NetMessage$MsgMpwWatchMakeRequest();
    }

    public checkHasMsgMpwWatchHandleRequest(): boolean {
        return this._MsgMpwWatchHandleRequest != null;
    }
    public getMsgMpwWatchHandleRequest(): $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest | null | undefined {
        return this._MsgMpwWatchHandleRequest;
    }
    public setMsgMpwWatchHandleRequest(value: $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest | null | undefined): void {
        this._MsgMpwWatchHandleRequest = value;
    }
    public createIfNotExistsMsgMpwWatchHandleRequest(): $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest {
        return this._MsgMpwWatchHandleRequest ??= new $Message$CommonProto$NetMessage$MsgMpwWatchHandleRequest();
    }

    public checkHasMsgMpwWatchDeleteWatcher(): boolean {
        return this._MsgMpwWatchDeleteWatcher != null;
    }
    public getMsgMpwWatchDeleteWatcher(): $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher | null | undefined {
        return this._MsgMpwWatchDeleteWatcher;
    }
    public setMsgMpwWatchDeleteWatcher(value: $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher | null | undefined): void {
        this._MsgMpwWatchDeleteWatcher = value;
    }
    public createIfNotExistsMsgMpwWatchDeleteWatcher(): $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher {
        return this._MsgMpwWatchDeleteWatcher ??= new $Message$CommonProto$NetMessage$MsgMpwWatchDeleteWatcher();
    }

    public checkHasMsgMpwWatchGetRequestableWarIdArray(): boolean {
        return this._MsgMpwWatchGetRequestableWarIdArray != null;
    }
    public getMsgMpwWatchGetRequestableWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray | null | undefined {
        return this._MsgMpwWatchGetRequestableWarIdArray;
    }
    public setMsgMpwWatchGetRequestableWarIdArray(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray | null | undefined): void {
        this._MsgMpwWatchGetRequestableWarIdArray = value;
    }
    public createIfNotExistsMsgMpwWatchGetRequestableWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray {
        return this._MsgMpwWatchGetRequestableWarIdArray ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestableWarIdArray();
    }

    public checkHasMsgMpwWatchGetOngoingWarIdArray(): boolean {
        return this._MsgMpwWatchGetOngoingWarIdArray != null;
    }
    public getMsgMpwWatchGetOngoingWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray | null | undefined {
        return this._MsgMpwWatchGetOngoingWarIdArray;
    }
    public setMsgMpwWatchGetOngoingWarIdArray(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray | null | undefined): void {
        this._MsgMpwWatchGetOngoingWarIdArray = value;
    }
    public createIfNotExistsMsgMpwWatchGetOngoingWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray {
        return this._MsgMpwWatchGetOngoingWarIdArray ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray();
    }

    public checkHasMsgMpwWatchGetRequestedWarIdArray(): boolean {
        return this._MsgMpwWatchGetRequestedWarIdArray != null;
    }
    public getMsgMpwWatchGetRequestedWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray | null | undefined {
        return this._MsgMpwWatchGetRequestedWarIdArray;
    }
    public setMsgMpwWatchGetRequestedWarIdArray(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray | null | undefined): void {
        this._MsgMpwWatchGetRequestedWarIdArray = value;
    }
    public createIfNotExistsMsgMpwWatchGetRequestedWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray {
        return this._MsgMpwWatchGetRequestedWarIdArray ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray();
    }

    public checkHasMsgMpwWatchGetWatchedWarIdArray(): boolean {
        return this._MsgMpwWatchGetWatchedWarIdArray != null;
    }
    public getMsgMpwWatchGetWatchedWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray | null | undefined {
        return this._MsgMpwWatchGetWatchedWarIdArray;
    }
    public setMsgMpwWatchGetWatchedWarIdArray(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray | null | undefined): void {
        this._MsgMpwWatchGetWatchedWarIdArray = value;
    }
    public createIfNotExistsMsgMpwWatchGetWatchedWarIdArray(): $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray {
        return this._MsgMpwWatchGetWatchedWarIdArray ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetWatchedWarIdArray();
    }

    public checkHasMsgMpwWatchContinueWar(): boolean {
        return this._MsgMpwWatchContinueWar != null;
    }
    public getMsgMpwWatchContinueWar(): $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar | null | undefined {
        return this._MsgMpwWatchContinueWar;
    }
    public setMsgMpwWatchContinueWar(value: $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar | null | undefined): void {
        this._MsgMpwWatchContinueWar = value;
    }
    public createIfNotExistsMsgMpwWatchContinueWar(): $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar {
        return this._MsgMpwWatchContinueWar ??= new $Message$CommonProto$NetMessage$MsgMpwWatchContinueWar();
    }

    public checkHasMsgMpwWatchGetIncomingInfo(): boolean {
        return this._MsgMpwWatchGetIncomingInfo != null;
    }
    public getMsgMpwWatchGetIncomingInfo(): $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo | null | undefined {
        return this._MsgMpwWatchGetIncomingInfo;
    }
    public setMsgMpwWatchGetIncomingInfo(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo | null | undefined): void {
        this._MsgMpwWatchGetIncomingInfo = value;
    }
    public createIfNotExistsMsgMpwWatchGetIncomingInfo(): $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo {
        return this._MsgMpwWatchGetIncomingInfo ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetIncomingInfo();
    }

    public checkHasMsgMpwWatchGetOutgoingInfo(): boolean {
        return this._MsgMpwWatchGetOutgoingInfo != null;
    }
    public getMsgMpwWatchGetOutgoingInfo(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo | null | undefined {
        return this._MsgMpwWatchGetOutgoingInfo;
    }
    public setMsgMpwWatchGetOutgoingInfo(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo | null | undefined): void {
        this._MsgMpwWatchGetOutgoingInfo = value;
    }
    public createIfNotExistsMsgMpwWatchGetOutgoingInfo(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo {
        return this._MsgMpwWatchGetOutgoingInfo ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetOutgoingInfo();
    }

    public checkHasMsgMpwExecuteWarOperation(): boolean {
        return this._MsgMpwExecuteWarOperation != null;
    }
    public getMsgMpwExecuteWarOperation(): $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation | null | undefined {
        return this._MsgMpwExecuteWarOperation;
    }
    public setMsgMpwExecuteWarOperation(value: $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation | null | undefined): void {
        this._MsgMpwExecuteWarOperation = value;
    }
    public createIfNotExistsMsgMpwExecuteWarOperation(): $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation {
        return this._MsgMpwExecuteWarOperation ??= new $Message$CommonProto$NetMessage$MsgMpwExecuteWarOperation();
    }

    public checkHasMsgSpmCreateScw(): boolean {
        return this._MsgSpmCreateScw != null;
    }
    public getMsgSpmCreateScw(): $Message$CommonProto$NetMessage$MsgSpmCreateScw | null | undefined {
        return this._MsgSpmCreateScw;
    }
    public setMsgSpmCreateScw(value: $Message$CommonProto$NetMessage$MsgSpmCreateScw | null | undefined): void {
        this._MsgSpmCreateScw = value;
    }
    public createIfNotExistsMsgSpmCreateScw(): $Message$CommonProto$NetMessage$MsgSpmCreateScw {
        return this._MsgSpmCreateScw ??= new $Message$CommonProto$NetMessage$MsgSpmCreateScw();
    }

    public checkHasMsgSpmCreateSfw(): boolean {
        return this._MsgSpmCreateSfw != null;
    }
    public getMsgSpmCreateSfw(): $Message$CommonProto$NetMessage$MsgSpmCreateSfw | null | undefined {
        return this._MsgSpmCreateSfw;
    }
    public setMsgSpmCreateSfw(value: $Message$CommonProto$NetMessage$MsgSpmCreateSfw | null | undefined): void {
        this._MsgSpmCreateSfw = value;
    }
    public createIfNotExistsMsgSpmCreateSfw(): $Message$CommonProto$NetMessage$MsgSpmCreateSfw {
        return this._MsgSpmCreateSfw ??= new $Message$CommonProto$NetMessage$MsgSpmCreateSfw();
    }

    public checkHasMsgSpmCreateSrw(): boolean {
        return this._MsgSpmCreateSrw != null;
    }
    public getMsgSpmCreateSrw(): $Message$CommonProto$NetMessage$MsgSpmCreateSrw | null | undefined {
        return this._MsgSpmCreateSrw;
    }
    public setMsgSpmCreateSrw(value: $Message$CommonProto$NetMessage$MsgSpmCreateSrw | null | undefined): void {
        this._MsgSpmCreateSrw = value;
    }
    public createIfNotExistsMsgSpmCreateSrw(): $Message$CommonProto$NetMessage$MsgSpmCreateSrw {
        return this._MsgSpmCreateSrw ??= new $Message$CommonProto$NetMessage$MsgSpmCreateSrw();
    }

    public checkHasMsgSpmGetAllWarSaveSlotTimestamps(): boolean {
        return this._MsgSpmGetAllWarSaveSlotTimestamps != null;
    }
    public getMsgSpmGetAllWarSaveSlotTimestamps(): $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps | null | undefined {
        return this._MsgSpmGetAllWarSaveSlotTimestamps;
    }
    public setMsgSpmGetAllWarSaveSlotTimestamps(value: $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps | null | undefined): void {
        this._MsgSpmGetAllWarSaveSlotTimestamps = value;
    }
    public createIfNotExistsMsgSpmGetAllWarSaveSlotTimestamps(): $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps {
        return this._MsgSpmGetAllWarSaveSlotTimestamps ??= new $Message$CommonProto$NetMessage$MsgSpmGetAllWarSaveSlotTimestamps();
    }

    public checkHasMsgSpmGetWarSaveSlotFullData(): boolean {
        return this._MsgSpmGetWarSaveSlotFullData != null;
    }
    public getMsgSpmGetWarSaveSlotFullData(): $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData | null | undefined {
        return this._MsgSpmGetWarSaveSlotFullData;
    }
    public setMsgSpmGetWarSaveSlotFullData(value: $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData | null | undefined): void {
        this._MsgSpmGetWarSaveSlotFullData = value;
    }
    public createIfNotExistsMsgSpmGetWarSaveSlotFullData(): $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData {
        return this._MsgSpmGetWarSaveSlotFullData ??= new $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullData();
    }

    public checkHasMsgSpmGetWarSaveSlotFullDataArray(): boolean {
        return this._MsgSpmGetWarSaveSlotFullDataArray != null;
    }
    public getMsgSpmGetWarSaveSlotFullDataArray(): $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray | null | undefined {
        return this._MsgSpmGetWarSaveSlotFullDataArray;
    }
    public setMsgSpmGetWarSaveSlotFullDataArray(value: $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray | null | undefined): void {
        this._MsgSpmGetWarSaveSlotFullDataArray = value;
    }
    public createIfNotExistsMsgSpmGetWarSaveSlotFullDataArray(): $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray {
        return this._MsgSpmGetWarSaveSlotFullDataArray ??= new $Message$CommonProto$NetMessage$MsgSpmGetWarSaveSlotFullDataArray();
    }

    public checkHasMsgSpmDeleteWarSaveSlot(): boolean {
        return this._MsgSpmDeleteWarSaveSlot != null;
    }
    public getMsgSpmDeleteWarSaveSlot(): $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot | null | undefined {
        return this._MsgSpmDeleteWarSaveSlot;
    }
    public setMsgSpmDeleteWarSaveSlot(value: $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot | null | undefined): void {
        this._MsgSpmDeleteWarSaveSlot = value;
    }
    public createIfNotExistsMsgSpmDeleteWarSaveSlot(): $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot {
        return this._MsgSpmDeleteWarSaveSlot ??= new $Message$CommonProto$NetMessage$MsgSpmDeleteWarSaveSlot();
    }

    public checkHasMsgSpmSaveScw(): boolean {
        return this._MsgSpmSaveScw != null;
    }
    public getMsgSpmSaveScw(): $Message$CommonProto$NetMessage$MsgSpmSaveScw | null | undefined {
        return this._MsgSpmSaveScw;
    }
    public setMsgSpmSaveScw(value: $Message$CommonProto$NetMessage$MsgSpmSaveScw | null | undefined): void {
        this._MsgSpmSaveScw = value;
    }
    public createIfNotExistsMsgSpmSaveScw(): $Message$CommonProto$NetMessage$MsgSpmSaveScw {
        return this._MsgSpmSaveScw ??= new $Message$CommonProto$NetMessage$MsgSpmSaveScw();
    }

    public checkHasMsgSpmSaveSfw(): boolean {
        return this._MsgSpmSaveSfw != null;
    }
    public getMsgSpmSaveSfw(): $Message$CommonProto$NetMessage$MsgSpmSaveSfw | null | undefined {
        return this._MsgSpmSaveSfw;
    }
    public setMsgSpmSaveSfw(value: $Message$CommonProto$NetMessage$MsgSpmSaveSfw | null | undefined): void {
        this._MsgSpmSaveSfw = value;
    }
    public createIfNotExistsMsgSpmSaveSfw(): $Message$CommonProto$NetMessage$MsgSpmSaveSfw {
        return this._MsgSpmSaveSfw ??= new $Message$CommonProto$NetMessage$MsgSpmSaveSfw();
    }

    public checkHasMsgSpmSaveSrw(): boolean {
        return this._MsgSpmSaveSrw != null;
    }
    public getMsgSpmSaveSrw(): $Message$CommonProto$NetMessage$MsgSpmSaveSrw | null | undefined {
        return this._MsgSpmSaveSrw;
    }
    public setMsgSpmSaveSrw(value: $Message$CommonProto$NetMessage$MsgSpmSaveSrw | null | undefined): void {
        this._MsgSpmSaveSrw = value;
    }
    public createIfNotExistsMsgSpmSaveSrw(): $Message$CommonProto$NetMessage$MsgSpmSaveSrw {
        return this._MsgSpmSaveSrw ??= new $Message$CommonProto$NetMessage$MsgSpmSaveSrw();
    }

    public checkHasMsgSpmValidateSrw(): boolean {
        return this._MsgSpmValidateSrw != null;
    }
    public getMsgSpmValidateSrw(): $Message$CommonProto$NetMessage$MsgSpmValidateSrw | null | undefined {
        return this._MsgSpmValidateSrw;
    }
    public setMsgSpmValidateSrw(value: $Message$CommonProto$NetMessage$MsgSpmValidateSrw | null | undefined): void {
        this._MsgSpmValidateSrw = value;
    }
    public createIfNotExistsMsgSpmValidateSrw(): $Message$CommonProto$NetMessage$MsgSpmValidateSrw {
        return this._MsgSpmValidateSrw ??= new $Message$CommonProto$NetMessage$MsgSpmValidateSrw();
    }

    public checkHasMsgSpmGetRankList(): boolean {
        return this._MsgSpmGetRankList != null;
    }
    public getMsgSpmGetRankList(): $Message$CommonProto$NetMessage$MsgSpmGetRankList | null | undefined {
        return this._MsgSpmGetRankList;
    }
    public setMsgSpmGetRankList(value: $Message$CommonProto$NetMessage$MsgSpmGetRankList | null | undefined): void {
        this._MsgSpmGetRankList = value;
    }
    public createIfNotExistsMsgSpmGetRankList(): $Message$CommonProto$NetMessage$MsgSpmGetRankList {
        return this._MsgSpmGetRankList ??= new $Message$CommonProto$NetMessage$MsgSpmGetRankList();
    }

    public checkHasMsgSpmGetReplayData(): boolean {
        return this._MsgSpmGetReplayData != null;
    }
    public getMsgSpmGetReplayData(): $Message$CommonProto$NetMessage$MsgSpmGetReplayData | null | undefined {
        return this._MsgSpmGetReplayData;
    }
    public setMsgSpmGetReplayData(value: $Message$CommonProto$NetMessage$MsgSpmGetReplayData | null | undefined): void {
        this._MsgSpmGetReplayData = value;
    }
    public createIfNotExistsMsgSpmGetReplayData(): $Message$CommonProto$NetMessage$MsgSpmGetReplayData {
        return this._MsgSpmGetReplayData ??= new $Message$CommonProto$NetMessage$MsgSpmGetReplayData();
    }

    public checkHasMsgMrrSetMaxConcurrentCount(): boolean {
        return this._MsgMrrSetMaxConcurrentCount != null;
    }
    public getMsgMrrSetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount | null | undefined {
        return this._MsgMrrSetMaxConcurrentCount;
    }
    public setMsgMrrSetMaxConcurrentCount(value: $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount | null | undefined): void {
        this._MsgMrrSetMaxConcurrentCount = value;
    }
    public createIfNotExistsMsgMrrSetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount {
        return this._MsgMrrSetMaxConcurrentCount ??= new $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount();
    }

    public checkHasMsgMrrGetMaxConcurrentCount(): boolean {
        return this._MsgMrrGetMaxConcurrentCount != null;
    }
    public getMsgMrrGetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount | null | undefined {
        return this._MsgMrrGetMaxConcurrentCount;
    }
    public setMsgMrrGetMaxConcurrentCount(value: $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount | null | undefined): void {
        this._MsgMrrGetMaxConcurrentCount = value;
    }
    public createIfNotExistsMsgMrrGetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount {
        return this._MsgMrrGetMaxConcurrentCount ??= new $Message$CommonProto$NetMessage$MsgMrrGetMaxConcurrentCount();
    }

    public checkHasMsgMrrSetBannedNormalMapIdArray(): boolean {
        return this._MsgMrrSetBannedNormalMapIdArray != null;
    }
    public getMsgMrrSetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray | null | undefined {
        return this._MsgMrrSetBannedNormalMapIdArray;
    }
    public setMsgMrrSetBannedNormalMapIdArray(value: $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray | null | undefined): void {
        this._MsgMrrSetBannedNormalMapIdArray = value;
    }
    public createIfNotExistsMsgMrrSetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray {
        return this._MsgMrrSetBannedNormalMapIdArray ??= new $Message$CommonProto$NetMessage$MsgMrrSetBannedNormalMapIdArray();
    }

    public checkHasMsgMrrGetBannedNormalMapIdArray(): boolean {
        return this._MsgMrrGetBannedNormalMapIdArray != null;
    }
    public getMsgMrrGetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray | null | undefined {
        return this._MsgMrrGetBannedNormalMapIdArray;
    }
    public setMsgMrrGetBannedNormalMapIdArray(value: $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray | null | undefined): void {
        this._MsgMrrGetBannedNormalMapIdArray = value;
    }
    public createIfNotExistsMsgMrrGetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray {
        return this._MsgMrrGetBannedNormalMapIdArray ??= new $Message$CommonProto$NetMessage$MsgMrrGetBannedNormalMapIdArray();
    }

    public checkHasMsgMrrSetBootTimerDaysRange(): boolean {
        return this._MsgMrrSetBootTimerDaysRange != null;
    }
    public getMsgMrrSetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange | null | undefined {
        return this._MsgMrrSetBootTimerDaysRange;
    }
    public setMsgMrrSetBootTimerDaysRange(value: $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange | null | undefined): void {
        this._MsgMrrSetBootTimerDaysRange = value;
    }
    public createIfNotExistsMsgMrrSetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange {
        return this._MsgMrrSetBootTimerDaysRange ??= new $Message$CommonProto$NetMessage$MsgMrrSetBootTimerDaysRange();
    }

    public checkHasMsgMrrGetBootTimerDaysRange(): boolean {
        return this._MsgMrrGetBootTimerDaysRange != null;
    }
    public getMsgMrrGetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange | null | undefined {
        return this._MsgMrrGetBootTimerDaysRange;
    }
    public setMsgMrrGetBootTimerDaysRange(value: $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange | null | undefined): void {
        this._MsgMrrGetBootTimerDaysRange = value;
    }
    public createIfNotExistsMsgMrrGetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange {
        return this._MsgMrrGetBootTimerDaysRange ??= new $Message$CommonProto$NetMessage$MsgMrrGetBootTimerDaysRange();
    }

    public checkHasMsgMrrGetJoinedRoomIdArray(): boolean {
        return this._MsgMrrGetJoinedRoomIdArray != null;
    }
    public getMsgMrrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray | null | undefined {
        return this._MsgMrrGetJoinedRoomIdArray;
    }
    public setMsgMrrGetJoinedRoomIdArray(value: $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray | null | undefined): void {
        this._MsgMrrGetJoinedRoomIdArray = value;
    }
    public createIfNotExistsMsgMrrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray {
        return this._MsgMrrGetJoinedRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgMrrGetJoinedRoomIdArray();
    }

    public checkHasMsgMrrGetRoomPublicInfo(): boolean {
        return this._MsgMrrGetRoomPublicInfo != null;
    }
    public getMsgMrrGetRoomPublicInfo(): $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo | null | undefined {
        return this._MsgMrrGetRoomPublicInfo;
    }
    public setMsgMrrGetRoomPublicInfo(value: $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo | null | undefined): void {
        this._MsgMrrGetRoomPublicInfo = value;
    }
    public createIfNotExistsMsgMrrGetRoomPublicInfo(): $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo {
        return this._MsgMrrGetRoomPublicInfo ??= new $Message$CommonProto$NetMessage$MsgMrrGetRoomPublicInfo();
    }

    public checkHasMsgMrrDeleteRoomByServer(): boolean {
        return this._MsgMrrDeleteRoomByServer != null;
    }
    public getMsgMrrDeleteRoomByServer(): $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer | null | undefined {
        return this._MsgMrrDeleteRoomByServer;
    }
    public setMsgMrrDeleteRoomByServer(value: $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer | null | undefined): void {
        this._MsgMrrDeleteRoomByServer = value;
    }
    public createIfNotExistsMsgMrrDeleteRoomByServer(): $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer {
        return this._MsgMrrDeleteRoomByServer ??= new $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer();
    }

    public checkHasMsgMrrSetBannedCoIdArray(): boolean {
        return this._MsgMrrSetBannedCoIdArray != null;
    }
    public getMsgMrrSetBannedCoIdArray(): $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray | null | undefined {
        return this._MsgMrrSetBannedCoIdArray;
    }
    public setMsgMrrSetBannedCoIdArray(value: $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray | null | undefined): void {
        this._MsgMrrSetBannedCoIdArray = value;
    }
    public createIfNotExistsMsgMrrSetBannedCoIdArray(): $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray {
        return this._MsgMrrSetBannedCoIdArray ??= new $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray();
    }

    public checkHasMsgMrrSetSelfSettings(): boolean {
        return this._MsgMrrSetSelfSettings != null;
    }
    public getMsgMrrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings | null | undefined {
        return this._MsgMrrSetSelfSettings;
    }
    public setMsgMrrSetSelfSettings(value: $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings | null | undefined): void {
        this._MsgMrrSetSelfSettings = value;
    }
    public createIfNotExistsMsgMrrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings {
        return this._MsgMrrSetSelfSettings ??= new $Message$CommonProto$NetMessage$MsgMrrSetSelfSettings();
    }

    public checkHasMsgBroadcastGetAllMessageIdArray(): boolean {
        return this._MsgBroadcastGetAllMessageIdArray != null;
    }
    public getMsgBroadcastGetAllMessageIdArray(): $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray | null | undefined {
        return this._MsgBroadcastGetAllMessageIdArray;
    }
    public setMsgBroadcastGetAllMessageIdArray(value: $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray | null | undefined): void {
        this._MsgBroadcastGetAllMessageIdArray = value;
    }
    public createIfNotExistsMsgBroadcastGetAllMessageIdArray(): $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray {
        return this._MsgBroadcastGetAllMessageIdArray ??= new $Message$CommonProto$NetMessage$MsgBroadcastGetAllMessageIdArray();
    }

    public checkHasMsgBroadcastAddMessage(): boolean {
        return this._MsgBroadcastAddMessage != null;
    }
    public getMsgBroadcastAddMessage(): $Message$CommonProto$NetMessage$MsgBroadcastAddMessage | null | undefined {
        return this._MsgBroadcastAddMessage;
    }
    public setMsgBroadcastAddMessage(value: $Message$CommonProto$NetMessage$MsgBroadcastAddMessage | null | undefined): void {
        this._MsgBroadcastAddMessage = value;
    }
    public createIfNotExistsMsgBroadcastAddMessage(): $Message$CommonProto$NetMessage$MsgBroadcastAddMessage {
        return this._MsgBroadcastAddMessage ??= new $Message$CommonProto$NetMessage$MsgBroadcastAddMessage();
    }

    public checkHasMsgBroadcastDeleteMessage(): boolean {
        return this._MsgBroadcastDeleteMessage != null;
    }
    public getMsgBroadcastDeleteMessage(): $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage | null | undefined {
        return this._MsgBroadcastDeleteMessage;
    }
    public setMsgBroadcastDeleteMessage(value: $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage | null | undefined): void {
        this._MsgBroadcastDeleteMessage = value;
    }
    public createIfNotExistsMsgBroadcastDeleteMessage(): $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage {
        return this._MsgBroadcastDeleteMessage ??= new $Message$CommonProto$NetMessage$MsgBroadcastDeleteMessage();
    }

    public checkHasMsgBroadcastDoBroadcast(): boolean {
        return this._MsgBroadcastDoBroadcast != null;
    }
    public getMsgBroadcastDoBroadcast(): $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast | null | undefined {
        return this._MsgBroadcastDoBroadcast;
    }
    public setMsgBroadcastDoBroadcast(value: $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast | null | undefined): void {
        this._MsgBroadcastDoBroadcast = value;
    }
    public createIfNotExistsMsgBroadcastDoBroadcast(): $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast {
        return this._MsgBroadcastDoBroadcast ??= new $Message$CommonProto$NetMessage$MsgBroadcastDoBroadcast();
    }

    public checkHasMsgBroadcastGetMessageData(): boolean {
        return this._MsgBroadcastGetMessageData != null;
    }
    public getMsgBroadcastGetMessageData(): $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData | null | undefined {
        return this._MsgBroadcastGetMessageData;
    }
    public setMsgBroadcastGetMessageData(value: $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData | null | undefined): void {
        this._MsgBroadcastGetMessageData = value;
    }
    public createIfNotExistsMsgBroadcastGetMessageData(): $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData {
        return this._MsgBroadcastGetMessageData ??= new $Message$CommonProto$NetMessage$MsgBroadcastGetMessageData();
    }

    public checkHasMsgChangeLogGetMessageList(): boolean {
        return this._MsgChangeLogGetMessageList != null;
    }
    public getMsgChangeLogGetMessageList(): $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList | null | undefined {
        return this._MsgChangeLogGetMessageList;
    }
    public setMsgChangeLogGetMessageList(value: $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList | null | undefined): void {
        this._MsgChangeLogGetMessageList = value;
    }
    public createIfNotExistsMsgChangeLogGetMessageList(): $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList {
        return this._MsgChangeLogGetMessageList ??= new $Message$CommonProto$NetMessage$MsgChangeLogGetMessageList();
    }

    public checkHasMsgChangeLogAddMessage(): boolean {
        return this._MsgChangeLogAddMessage != null;
    }
    public getMsgChangeLogAddMessage(): $Message$CommonProto$NetMessage$MsgChangeLogAddMessage | null | undefined {
        return this._MsgChangeLogAddMessage;
    }
    public setMsgChangeLogAddMessage(value: $Message$CommonProto$NetMessage$MsgChangeLogAddMessage | null | undefined): void {
        this._MsgChangeLogAddMessage = value;
    }
    public createIfNotExistsMsgChangeLogAddMessage(): $Message$CommonProto$NetMessage$MsgChangeLogAddMessage {
        return this._MsgChangeLogAddMessage ??= new $Message$CommonProto$NetMessage$MsgChangeLogAddMessage();
    }

    public checkHasMsgChangeLogModifyMessage(): boolean {
        return this._MsgChangeLogModifyMessage != null;
    }
    public getMsgChangeLogModifyMessage(): $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage | null | undefined {
        return this._MsgChangeLogModifyMessage;
    }
    public setMsgChangeLogModifyMessage(value: $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage | null | undefined): void {
        this._MsgChangeLogModifyMessage = value;
    }
    public createIfNotExistsMsgChangeLogModifyMessage(): $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage {
        return this._MsgChangeLogModifyMessage ??= new $Message$CommonProto$NetMessage$MsgChangeLogModifyMessage();
    }

    public checkHasMsgMfrCreateRoom(): boolean {
        return this._MsgMfrCreateRoom != null;
    }
    public getMsgMfrCreateRoom(): $Message$CommonProto$NetMessage$MsgMfrCreateRoom | null | undefined {
        return this._MsgMfrCreateRoom;
    }
    public setMsgMfrCreateRoom(value: $Message$CommonProto$NetMessage$MsgMfrCreateRoom | null | undefined): void {
        this._MsgMfrCreateRoom = value;
    }
    public createIfNotExistsMsgMfrCreateRoom(): $Message$CommonProto$NetMessage$MsgMfrCreateRoom {
        return this._MsgMfrCreateRoom ??= new $Message$CommonProto$NetMessage$MsgMfrCreateRoom();
    }

    public checkHasMsgMfrExitRoom(): boolean {
        return this._MsgMfrExitRoom != null;
    }
    public getMsgMfrExitRoom(): $Message$CommonProto$NetMessage$MsgMfrExitRoom | null | undefined {
        return this._MsgMfrExitRoom;
    }
    public setMsgMfrExitRoom(value: $Message$CommonProto$NetMessage$MsgMfrExitRoom | null | undefined): void {
        this._MsgMfrExitRoom = value;
    }
    public createIfNotExistsMsgMfrExitRoom(): $Message$CommonProto$NetMessage$MsgMfrExitRoom {
        return this._MsgMfrExitRoom ??= new $Message$CommonProto$NetMessage$MsgMfrExitRoom();
    }

    public checkHasMsgMfrJoinRoom(): boolean {
        return this._MsgMfrJoinRoom != null;
    }
    public getMsgMfrJoinRoom(): $Message$CommonProto$NetMessage$MsgMfrJoinRoom | null | undefined {
        return this._MsgMfrJoinRoom;
    }
    public setMsgMfrJoinRoom(value: $Message$CommonProto$NetMessage$MsgMfrJoinRoom | null | undefined): void {
        this._MsgMfrJoinRoom = value;
    }
    public createIfNotExistsMsgMfrJoinRoom(): $Message$CommonProto$NetMessage$MsgMfrJoinRoom {
        return this._MsgMfrJoinRoom ??= new $Message$CommonProto$NetMessage$MsgMfrJoinRoom();
    }

    public checkHasMsgMfrDeleteRoom(): boolean {
        return this._MsgMfrDeleteRoom != null;
    }
    public getMsgMfrDeleteRoom(): $Message$CommonProto$NetMessage$MsgMfrDeleteRoom | null | undefined {
        return this._MsgMfrDeleteRoom;
    }
    public setMsgMfrDeleteRoom(value: $Message$CommonProto$NetMessage$MsgMfrDeleteRoom | null | undefined): void {
        this._MsgMfrDeleteRoom = value;
    }
    public createIfNotExistsMsgMfrDeleteRoom(): $Message$CommonProto$NetMessage$MsgMfrDeleteRoom {
        return this._MsgMfrDeleteRoom ??= new $Message$CommonProto$NetMessage$MsgMfrDeleteRoom();
    }

    public checkHasMsgMfrSetReady(): boolean {
        return this._MsgMfrSetReady != null;
    }
    public getMsgMfrSetReady(): $Message$CommonProto$NetMessage$MsgMfrSetReady | null | undefined {
        return this._MsgMfrSetReady;
    }
    public setMsgMfrSetReady(value: $Message$CommonProto$NetMessage$MsgMfrSetReady | null | undefined): void {
        this._MsgMfrSetReady = value;
    }
    public createIfNotExistsMsgMfrSetReady(): $Message$CommonProto$NetMessage$MsgMfrSetReady {
        return this._MsgMfrSetReady ??= new $Message$CommonProto$NetMessage$MsgMfrSetReady();
    }

    public checkHasMsgMfrDeletePlayer(): boolean {
        return this._MsgMfrDeletePlayer != null;
    }
    public getMsgMfrDeletePlayer(): $Message$CommonProto$NetMessage$MsgMfrDeletePlayer | null | undefined {
        return this._MsgMfrDeletePlayer;
    }
    public setMsgMfrDeletePlayer(value: $Message$CommonProto$NetMessage$MsgMfrDeletePlayer | null | undefined): void {
        this._MsgMfrDeletePlayer = value;
    }
    public createIfNotExistsMsgMfrDeletePlayer(): $Message$CommonProto$NetMessage$MsgMfrDeletePlayer {
        return this._MsgMfrDeletePlayer ??= new $Message$CommonProto$NetMessage$MsgMfrDeletePlayer();
    }

    public checkHasMsgMfrSetSelfSettings(): boolean {
        return this._MsgMfrSetSelfSettings != null;
    }
    public getMsgMfrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings | null | undefined {
        return this._MsgMfrSetSelfSettings;
    }
    public setMsgMfrSetSelfSettings(value: $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings | null | undefined): void {
        this._MsgMfrSetSelfSettings = value;
    }
    public createIfNotExistsMsgMfrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings {
        return this._MsgMfrSetSelfSettings ??= new $Message$CommonProto$NetMessage$MsgMfrSetSelfSettings();
    }

    public checkHasMsgMfrStartWar(): boolean {
        return this._MsgMfrStartWar != null;
    }
    public getMsgMfrStartWar(): $Message$CommonProto$NetMessage$MsgMfrStartWar | null | undefined {
        return this._MsgMfrStartWar;
    }
    public setMsgMfrStartWar(value: $Message$CommonProto$NetMessage$MsgMfrStartWar | null | undefined): void {
        this._MsgMfrStartWar = value;
    }
    public createIfNotExistsMsgMfrStartWar(): $Message$CommonProto$NetMessage$MsgMfrStartWar {
        return this._MsgMfrStartWar ??= new $Message$CommonProto$NetMessage$MsgMfrStartWar();
    }

    public checkHasMsgMfrGetJoinedRoomIdArray(): boolean {
        return this._MsgMfrGetJoinedRoomIdArray != null;
    }
    public getMsgMfrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray | null | undefined {
        return this._MsgMfrGetJoinedRoomIdArray;
    }
    public setMsgMfrGetJoinedRoomIdArray(value: $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray | null | undefined): void {
        this._MsgMfrGetJoinedRoomIdArray = value;
    }
    public createIfNotExistsMsgMfrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray {
        return this._MsgMfrGetJoinedRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgMfrGetJoinedRoomIdArray();
    }

    public checkHasMsgMfrGetJoinableRoomIdArray(): boolean {
        return this._MsgMfrGetJoinableRoomIdArray != null;
    }
    public getMsgMfrGetJoinableRoomIdArray(): $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray | null | undefined {
        return this._MsgMfrGetJoinableRoomIdArray;
    }
    public setMsgMfrGetJoinableRoomIdArray(value: $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray | null | undefined): void {
        this._MsgMfrGetJoinableRoomIdArray = value;
    }
    public createIfNotExistsMsgMfrGetJoinableRoomIdArray(): $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray {
        return this._MsgMfrGetJoinableRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgMfrGetJoinableRoomIdArray();
    }

    public checkHasMsgMfrGetRoomStaticInfo(): boolean {
        return this._MsgMfrGetRoomStaticInfo != null;
    }
    public getMsgMfrGetRoomStaticInfo(): $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo | null | undefined {
        return this._MsgMfrGetRoomStaticInfo;
    }
    public setMsgMfrGetRoomStaticInfo(value: $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo | null | undefined): void {
        this._MsgMfrGetRoomStaticInfo = value;
    }
    public createIfNotExistsMsgMfrGetRoomStaticInfo(): $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo {
        return this._MsgMfrGetRoomStaticInfo ??= new $Message$CommonProto$NetMessage$MsgMfrGetRoomStaticInfo();
    }

    public checkHasMsgMfrGetRoomPlayerInfo(): boolean {
        return this._MsgMfrGetRoomPlayerInfo != null;
    }
    public getMsgMfrGetRoomPlayerInfo(): $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo | null | undefined {
        return this._MsgMfrGetRoomPlayerInfo;
    }
    public setMsgMfrGetRoomPlayerInfo(value: $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo | null | undefined): void {
        this._MsgMfrGetRoomPlayerInfo = value;
    }
    public createIfNotExistsMsgMfrGetRoomPlayerInfo(): $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo {
        return this._MsgMfrGetRoomPlayerInfo ??= new $Message$CommonProto$NetMessage$MsgMfrGetRoomPlayerInfo();
    }

    public checkHasMsgMfrInvite(): boolean {
        return this._MsgMfrInvite != null;
    }
    public getMsgMfrInvite(): $Message$CommonProto$NetMessage$MsgMfrInvite | null | undefined {
        return this._MsgMfrInvite;
    }
    public setMsgMfrInvite(value: $Message$CommonProto$NetMessage$MsgMfrInvite | null | undefined): void {
        this._MsgMfrInvite = value;
    }
    public createIfNotExistsMsgMfrInvite(): $Message$CommonProto$NetMessage$MsgMfrInvite {
        return this._MsgMfrInvite ??= new $Message$CommonProto$NetMessage$MsgMfrInvite();
    }

    public checkHasMsgMfrAddDummy(): boolean {
        return this._MsgMfrAddDummy != null;
    }
    public getMsgMfrAddDummy(): $Message$CommonProto$NetMessage$MsgMfrAddDummy | null | undefined {
        return this._MsgMfrAddDummy;
    }
    public setMsgMfrAddDummy(value: $Message$CommonProto$NetMessage$MsgMfrAddDummy | null | undefined): void {
        this._MsgMfrAddDummy = value;
    }
    public createIfNotExistsMsgMfrAddDummy(): $Message$CommonProto$NetMessage$MsgMfrAddDummy {
        return this._MsgMfrAddDummy ??= new $Message$CommonProto$NetMessage$MsgMfrAddDummy();
    }

    public checkHasMsgMfrSetDummySettings(): boolean {
        return this._MsgMfrSetDummySettings != null;
    }
    public getMsgMfrSetDummySettings(): $Message$CommonProto$NetMessage$MsgMfrSetDummySettings | null | undefined {
        return this._MsgMfrSetDummySettings;
    }
    public setMsgMfrSetDummySettings(value: $Message$CommonProto$NetMessage$MsgMfrSetDummySettings | null | undefined): void {
        this._MsgMfrSetDummySettings = value;
    }
    public createIfNotExistsMsgMfrSetDummySettings(): $Message$CommonProto$NetMessage$MsgMfrSetDummySettings {
        return this._MsgMfrSetDummySettings ??= new $Message$CommonProto$NetMessage$MsgMfrSetDummySettings();
    }

    public checkHasMsgCcrCreateRoom(): boolean {
        return this._MsgCcrCreateRoom != null;
    }
    public getMsgCcrCreateRoom(): $Message$CommonProto$NetMessage$MsgCcrCreateRoom | null | undefined {
        return this._MsgCcrCreateRoom;
    }
    public setMsgCcrCreateRoom(value: $Message$CommonProto$NetMessage$MsgCcrCreateRoom | null | undefined): void {
        this._MsgCcrCreateRoom = value;
    }
    public createIfNotExistsMsgCcrCreateRoom(): $Message$CommonProto$NetMessage$MsgCcrCreateRoom {
        return this._MsgCcrCreateRoom ??= new $Message$CommonProto$NetMessage$MsgCcrCreateRoom();
    }

    public checkHasMsgCcrExitRoom(): boolean {
        return this._MsgCcrExitRoom != null;
    }
    public getMsgCcrExitRoom(): $Message$CommonProto$NetMessage$MsgCcrExitRoom | null | undefined {
        return this._MsgCcrExitRoom;
    }
    public setMsgCcrExitRoom(value: $Message$CommonProto$NetMessage$MsgCcrExitRoom | null | undefined): void {
        this._MsgCcrExitRoom = value;
    }
    public createIfNotExistsMsgCcrExitRoom(): $Message$CommonProto$NetMessage$MsgCcrExitRoom {
        return this._MsgCcrExitRoom ??= new $Message$CommonProto$NetMessage$MsgCcrExitRoom();
    }

    public checkHasMsgCcrJoinRoom(): boolean {
        return this._MsgCcrJoinRoom != null;
    }
    public getMsgCcrJoinRoom(): $Message$CommonProto$NetMessage$MsgCcrJoinRoom | null | undefined {
        return this._MsgCcrJoinRoom;
    }
    public setMsgCcrJoinRoom(value: $Message$CommonProto$NetMessage$MsgCcrJoinRoom | null | undefined): void {
        this._MsgCcrJoinRoom = value;
    }
    public createIfNotExistsMsgCcrJoinRoom(): $Message$CommonProto$NetMessage$MsgCcrJoinRoom {
        return this._MsgCcrJoinRoom ??= new $Message$CommonProto$NetMessage$MsgCcrJoinRoom();
    }

    public checkHasMsgCcrDeleteRoom(): boolean {
        return this._MsgCcrDeleteRoom != null;
    }
    public getMsgCcrDeleteRoom(): $Message$CommonProto$NetMessage$MsgCcrDeleteRoom | null | undefined {
        return this._MsgCcrDeleteRoom;
    }
    public setMsgCcrDeleteRoom(value: $Message$CommonProto$NetMessage$MsgCcrDeleteRoom | null | undefined): void {
        this._MsgCcrDeleteRoom = value;
    }
    public createIfNotExistsMsgCcrDeleteRoom(): $Message$CommonProto$NetMessage$MsgCcrDeleteRoom {
        return this._MsgCcrDeleteRoom ??= new $Message$CommonProto$NetMessage$MsgCcrDeleteRoom();
    }

    public checkHasMsgCcrSetReady(): boolean {
        return this._MsgCcrSetReady != null;
    }
    public getMsgCcrSetReady(): $Message$CommonProto$NetMessage$MsgCcrSetReady | null | undefined {
        return this._MsgCcrSetReady;
    }
    public setMsgCcrSetReady(value: $Message$CommonProto$NetMessage$MsgCcrSetReady | null | undefined): void {
        this._MsgCcrSetReady = value;
    }
    public createIfNotExistsMsgCcrSetReady(): $Message$CommonProto$NetMessage$MsgCcrSetReady {
        return this._MsgCcrSetReady ??= new $Message$CommonProto$NetMessage$MsgCcrSetReady();
    }

    public checkHasMsgCcrDeletePlayer(): boolean {
        return this._MsgCcrDeletePlayer != null;
    }
    public getMsgCcrDeletePlayer(): $Message$CommonProto$NetMessage$MsgCcrDeletePlayer | null | undefined {
        return this._MsgCcrDeletePlayer;
    }
    public setMsgCcrDeletePlayer(value: $Message$CommonProto$NetMessage$MsgCcrDeletePlayer | null | undefined): void {
        this._MsgCcrDeletePlayer = value;
    }
    public createIfNotExistsMsgCcrDeletePlayer(): $Message$CommonProto$NetMessage$MsgCcrDeletePlayer {
        return this._MsgCcrDeletePlayer ??= new $Message$CommonProto$NetMessage$MsgCcrDeletePlayer();
    }

    public checkHasMsgCcrSetSelfSettings(): boolean {
        return this._MsgCcrSetSelfSettings != null;
    }
    public getMsgCcrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings | null | undefined {
        return this._MsgCcrSetSelfSettings;
    }
    public setMsgCcrSetSelfSettings(value: $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings | null | undefined): void {
        this._MsgCcrSetSelfSettings = value;
    }
    public createIfNotExistsMsgCcrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings {
        return this._MsgCcrSetSelfSettings ??= new $Message$CommonProto$NetMessage$MsgCcrSetSelfSettings();
    }

    public checkHasMsgCcrStartWar(): boolean {
        return this._MsgCcrStartWar != null;
    }
    public getMsgCcrStartWar(): $Message$CommonProto$NetMessage$MsgCcrStartWar | null | undefined {
        return this._MsgCcrStartWar;
    }
    public setMsgCcrStartWar(value: $Message$CommonProto$NetMessage$MsgCcrStartWar | null | undefined): void {
        this._MsgCcrStartWar = value;
    }
    public createIfNotExistsMsgCcrStartWar(): $Message$CommonProto$NetMessage$MsgCcrStartWar {
        return this._MsgCcrStartWar ??= new $Message$CommonProto$NetMessage$MsgCcrStartWar();
    }

    public checkHasMsgCcrGetJoinedRoomIdArray(): boolean {
        return this._MsgCcrGetJoinedRoomIdArray != null;
    }
    public getMsgCcrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray | null | undefined {
        return this._MsgCcrGetJoinedRoomIdArray;
    }
    public setMsgCcrGetJoinedRoomIdArray(value: $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray | null | undefined): void {
        this._MsgCcrGetJoinedRoomIdArray = value;
    }
    public createIfNotExistsMsgCcrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray {
        return this._MsgCcrGetJoinedRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray();
    }

    public checkHasMsgCcrGetJoinableRoomIdArray(): boolean {
        return this._MsgCcrGetJoinableRoomIdArray != null;
    }
    public getMsgCcrGetJoinableRoomIdArray(): $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray | null | undefined {
        return this._MsgCcrGetJoinableRoomIdArray;
    }
    public setMsgCcrGetJoinableRoomIdArray(value: $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray | null | undefined): void {
        this._MsgCcrGetJoinableRoomIdArray = value;
    }
    public createIfNotExistsMsgCcrGetJoinableRoomIdArray(): $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray {
        return this._MsgCcrGetJoinableRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgCcrGetJoinableRoomIdArray();
    }

    public checkHasMsgCcrGetRoomStaticInfo(): boolean {
        return this._MsgCcrGetRoomStaticInfo != null;
    }
    public getMsgCcrGetRoomStaticInfo(): $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo | null | undefined {
        return this._MsgCcrGetRoomStaticInfo;
    }
    public setMsgCcrGetRoomStaticInfo(value: $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo | null | undefined): void {
        this._MsgCcrGetRoomStaticInfo = value;
    }
    public createIfNotExistsMsgCcrGetRoomStaticInfo(): $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo {
        return this._MsgCcrGetRoomStaticInfo ??= new $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo();
    }

    public checkHasMsgCcrGetRoomPlayerInfo(): boolean {
        return this._MsgCcrGetRoomPlayerInfo != null;
    }
    public getMsgCcrGetRoomPlayerInfo(): $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo | null | undefined {
        return this._MsgCcrGetRoomPlayerInfo;
    }
    public setMsgCcrGetRoomPlayerInfo(value: $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo | null | undefined): void {
        this._MsgCcrGetRoomPlayerInfo = value;
    }
    public createIfNotExistsMsgCcrGetRoomPlayerInfo(): $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo {
        return this._MsgCcrGetRoomPlayerInfo ??= new $Message$CommonProto$NetMessage$MsgCcrGetRoomPlayerInfo();
    }

    public checkHasMsgCcrInvite(): boolean {
        return this._MsgCcrInvite != null;
    }
    public getMsgCcrInvite(): $Message$CommonProto$NetMessage$MsgCcrInvite | null | undefined {
        return this._MsgCcrInvite;
    }
    public setMsgCcrInvite(value: $Message$CommonProto$NetMessage$MsgCcrInvite | null | undefined): void {
        this._MsgCcrInvite = value;
    }
    public createIfNotExistsMsgCcrInvite(): $Message$CommonProto$NetMessage$MsgCcrInvite {
        return this._MsgCcrInvite ??= new $Message$CommonProto$NetMessage$MsgCcrInvite();
    }

    public checkHasMsgCcrAddDummy(): boolean {
        return this._MsgCcrAddDummy != null;
    }
    public getMsgCcrAddDummy(): $Message$CommonProto$NetMessage$MsgCcrAddDummy | null | undefined {
        return this._MsgCcrAddDummy;
    }
    public setMsgCcrAddDummy(value: $Message$CommonProto$NetMessage$MsgCcrAddDummy | null | undefined): void {
        this._MsgCcrAddDummy = value;
    }
    public createIfNotExistsMsgCcrAddDummy(): $Message$CommonProto$NetMessage$MsgCcrAddDummy {
        return this._MsgCcrAddDummy ??= new $Message$CommonProto$NetMessage$MsgCcrAddDummy();
    }

    public checkHasMsgCcrSetDummySettings(): boolean {
        return this._MsgCcrSetDummySettings != null;
    }
    public getMsgCcrSetDummySettings(): $Message$CommonProto$NetMessage$MsgCcrSetDummySettings | null | undefined {
        return this._MsgCcrSetDummySettings;
    }
    public setMsgCcrSetDummySettings(value: $Message$CommonProto$NetMessage$MsgCcrSetDummySettings | null | undefined): void {
        this._MsgCcrSetDummySettings = value;
    }
    public createIfNotExistsMsgCcrSetDummySettings(): $Message$CommonProto$NetMessage$MsgCcrSetDummySettings {
        return this._MsgCcrSetDummySettings ??= new $Message$CommonProto$NetMessage$MsgCcrSetDummySettings();
    }

    public checkHasMsgLbSpmOverallGetTopDataArray(): boolean {
        return this._MsgLbSpmOverallGetTopDataArray != null;
    }
    public getMsgLbSpmOverallGetTopDataArray(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray | null | undefined {
        return this._MsgLbSpmOverallGetTopDataArray;
    }
    public setMsgLbSpmOverallGetTopDataArray(value: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray | null | undefined): void {
        this._MsgLbSpmOverallGetTopDataArray = value;
    }
    public createIfNotExistsMsgLbSpmOverallGetTopDataArray(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray {
        return this._MsgLbSpmOverallGetTopDataArray ??= new $Message$CommonProto$NetMessage$MsgLbSpmOverallGetTopDataArray();
    }

    public checkHasMsgLbSpmOverallGetRankInfo(): boolean {
        return this._MsgLbSpmOverallGetRankInfo != null;
    }
    public getMsgLbSpmOverallGetRankInfo(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo | null | undefined {
        return this._MsgLbSpmOverallGetRankInfo;
    }
    public setMsgLbSpmOverallGetRankInfo(value: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo | null | undefined): void {
        this._MsgLbSpmOverallGetRankInfo = value;
    }
    public createIfNotExistsMsgLbSpmOverallGetRankInfo(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo {
        return this._MsgLbSpmOverallGetRankInfo ??= new $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo();
    }

    public checkHasMsgLbMrwGetRankIndex(): boolean {
        return this._MsgLbMrwGetRankIndex != null;
    }
    public getMsgLbMrwGetRankIndex(): $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex | null | undefined {
        return this._MsgLbMrwGetRankIndex;
    }
    public setMsgLbMrwGetRankIndex(value: $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex | null | undefined): void {
        this._MsgLbMrwGetRankIndex = value;
    }
    public createIfNotExistsMsgLbMrwGetRankIndex(): $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex {
        return this._MsgLbMrwGetRankIndex ??= new $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex();
    }

    public checkHasMsgMmrSetMaxConcurrentCount(): boolean {
        return this._MsgMmrSetMaxConcurrentCount != null;
    }
    public getMsgMmrSetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount | null | undefined {
        return this._MsgMmrSetMaxConcurrentCount;
    }
    public setMsgMmrSetMaxConcurrentCount(value: $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount | null | undefined): void {
        this._MsgMmrSetMaxConcurrentCount = value;
    }
    public createIfNotExistsMsgMmrSetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount {
        return this._MsgMmrSetMaxConcurrentCount ??= new $Message$CommonProto$NetMessage$MsgMmrSetMaxConcurrentCount();
    }

    public checkHasMsgMmrGetMaxConcurrentCount(): boolean {
        return this._MsgMmrGetMaxConcurrentCount != null;
    }
    public getMsgMmrGetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount | null | undefined {
        return this._MsgMmrGetMaxConcurrentCount;
    }
    public setMsgMmrGetMaxConcurrentCount(value: $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount | null | undefined): void {
        this._MsgMmrGetMaxConcurrentCount = value;
    }
    public createIfNotExistsMsgMmrGetMaxConcurrentCount(): $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount {
        return this._MsgMmrGetMaxConcurrentCount ??= new $Message$CommonProto$NetMessage$MsgMmrGetMaxConcurrentCount();
    }

    public checkHasMsgMmrSetBannedNormalMapIdArray(): boolean {
        return this._MsgMmrSetBannedNormalMapIdArray != null;
    }
    public getMsgMmrSetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray | null | undefined {
        return this._MsgMmrSetBannedNormalMapIdArray;
    }
    public setMsgMmrSetBannedNormalMapIdArray(value: $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray | null | undefined): void {
        this._MsgMmrSetBannedNormalMapIdArray = value;
    }
    public createIfNotExistsMsgMmrSetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray {
        return this._MsgMmrSetBannedNormalMapIdArray ??= new $Message$CommonProto$NetMessage$MsgMmrSetBannedNormalMapIdArray();
    }

    public checkHasMsgMmrGetBannedNormalMapIdArray(): boolean {
        return this._MsgMmrGetBannedNormalMapIdArray != null;
    }
    public getMsgMmrGetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray | null | undefined {
        return this._MsgMmrGetBannedNormalMapIdArray;
    }
    public setMsgMmrGetBannedNormalMapIdArray(value: $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray | null | undefined): void {
        this._MsgMmrGetBannedNormalMapIdArray = value;
    }
    public createIfNotExistsMsgMmrGetBannedNormalMapIdArray(): $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray {
        return this._MsgMmrGetBannedNormalMapIdArray ??= new $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray();
    }

    public checkHasMsgMmrSetBootTimerDaysRange(): boolean {
        return this._MsgMmrSetBootTimerDaysRange != null;
    }
    public getMsgMmrSetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange | null | undefined {
        return this._MsgMmrSetBootTimerDaysRange;
    }
    public setMsgMmrSetBootTimerDaysRange(value: $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange | null | undefined): void {
        this._MsgMmrSetBootTimerDaysRange = value;
    }
    public createIfNotExistsMsgMmrSetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange {
        return this._MsgMmrSetBootTimerDaysRange ??= new $Message$CommonProto$NetMessage$MsgMmrSetBootTimerDaysRange();
    }

    public checkHasMsgMmrGetBootTimerDaysRange(): boolean {
        return this._MsgMmrGetBootTimerDaysRange != null;
    }
    public getMsgMmrGetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange | null | undefined {
        return this._MsgMmrGetBootTimerDaysRange;
    }
    public setMsgMmrGetBootTimerDaysRange(value: $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange | null | undefined): void {
        this._MsgMmrGetBootTimerDaysRange = value;
    }
    public createIfNotExistsMsgMmrGetBootTimerDaysRange(): $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange {
        return this._MsgMmrGetBootTimerDaysRange ??= new $Message$CommonProto$NetMessage$MsgMmrGetBootTimerDaysRange();
    }

    public checkHasMsgMmrGetJoinedRoomIdArray(): boolean {
        return this._MsgMmrGetJoinedRoomIdArray != null;
    }
    public getMsgMmrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray | null | undefined {
        return this._MsgMmrGetJoinedRoomIdArray;
    }
    public setMsgMmrGetJoinedRoomIdArray(value: $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray | null | undefined): void {
        this._MsgMmrGetJoinedRoomIdArray = value;
    }
    public createIfNotExistsMsgMmrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray {
        return this._MsgMmrGetJoinedRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgMmrGetJoinedRoomIdArray();
    }

    public checkHasMsgMmrGetRoomPublicInfo(): boolean {
        return this._MsgMmrGetRoomPublicInfo != null;
    }
    public getMsgMmrGetRoomPublicInfo(): $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo | null | undefined {
        return this._MsgMmrGetRoomPublicInfo;
    }
    public setMsgMmrGetRoomPublicInfo(value: $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo | null | undefined): void {
        this._MsgMmrGetRoomPublicInfo = value;
    }
    public createIfNotExistsMsgMmrGetRoomPublicInfo(): $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo {
        return this._MsgMmrGetRoomPublicInfo ??= new $Message$CommonProto$NetMessage$MsgMmrGetRoomPublicInfo();
    }

    public checkHasMsgMmrDeleteRoomByServer(): boolean {
        return this._MsgMmrDeleteRoomByServer != null;
    }
    public getMsgMmrDeleteRoomByServer(): $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer | null | undefined {
        return this._MsgMmrDeleteRoomByServer;
    }
    public setMsgMmrDeleteRoomByServer(value: $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer | null | undefined): void {
        this._MsgMmrDeleteRoomByServer = value;
    }
    public createIfNotExistsMsgMmrDeleteRoomByServer(): $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer {
        return this._MsgMmrDeleteRoomByServer ??= new $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer();
    }

    public checkHasMsgMmrSetBannedCoIdArray(): boolean {
        return this._MsgMmrSetBannedCoIdArray != null;
    }
    public getMsgMmrSetBannedCoIdArray(): $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray | null | undefined {
        return this._MsgMmrSetBannedCoIdArray;
    }
    public setMsgMmrSetBannedCoIdArray(value: $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray | null | undefined): void {
        this._MsgMmrSetBannedCoIdArray = value;
    }
    public createIfNotExistsMsgMmrSetBannedCoIdArray(): $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray {
        return this._MsgMmrSetBannedCoIdArray ??= new $Message$CommonProto$NetMessage$MsgMmrSetBannedCoIdArray();
    }

    public checkHasMsgMmrSetSelfSettings(): boolean {
        return this._MsgMmrSetSelfSettings != null;
    }
    public getMsgMmrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings | null | undefined {
        return this._MsgMmrSetSelfSettings;
    }
    public setMsgMmrSetSelfSettings(value: $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings | null | undefined): void {
        this._MsgMmrSetSelfSettings = value;
    }
    public createIfNotExistsMsgMmrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings {
        return this._MsgMmrSetSelfSettings ??= new $Message$CommonProto$NetMessage$MsgMmrSetSelfSettings();
    }

    public checkHasMsgNormalMapGetAllEnabledBriefDataVersions(): boolean {
        return this._MsgNormalMapGetAllEnabledBriefDataVersions != null;
    }
    public getMsgNormalMapGetAllEnabledBriefDataVersions(): $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions | null | undefined {
        return this._MsgNormalMapGetAllEnabledBriefDataVersions;
    }
    public setMsgNormalMapGetAllEnabledBriefDataVersions(value: $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions | null | undefined): void {
        this._MsgNormalMapGetAllEnabledBriefDataVersions = value;
    }
    public createIfNotExistsMsgNormalMapGetAllEnabledBriefDataVersions(): $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions {
        return this._MsgNormalMapGetAllEnabledBriefDataVersions ??= new $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions();
    }

    public checkHasMsgNormalMapGetBriefDataVersion(): boolean {
        return this._MsgNormalMapGetBriefDataVersion != null;
    }
    public getMsgNormalMapGetBriefDataVersion(): $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion | null | undefined {
        return this._MsgNormalMapGetBriefDataVersion;
    }
    public setMsgNormalMapGetBriefDataVersion(value: $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion | null | undefined): void {
        this._MsgNormalMapGetBriefDataVersion = value;
    }
    public createIfNotExistsMsgNormalMapGetBriefDataVersion(): $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion {
        return this._MsgNormalMapGetBriefDataVersion ??= new $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataVersion();
    }

    public checkHasMsgNormalMapGetBriefData(): boolean {
        return this._MsgNormalMapGetBriefData != null;
    }
    public getMsgNormalMapGetBriefData(): $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData | null | undefined {
        return this._MsgNormalMapGetBriefData;
    }
    public setMsgNormalMapGetBriefData(value: $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData | null | undefined): void {
        this._MsgNormalMapGetBriefData = value;
    }
    public createIfNotExistsMsgNormalMapGetBriefData(): $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData {
        return this._MsgNormalMapGetBriefData ??= new $Message$CommonProto$NetMessage$MsgNormalMapGetBriefData();
    }

    public checkHasMsgNormalMapGetBriefDataArray(): boolean {
        return this._MsgNormalMapGetBriefDataArray != null;
    }
    public getMsgNormalMapGetBriefDataArray(): $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray | null | undefined {
        return this._MsgNormalMapGetBriefDataArray;
    }
    public setMsgNormalMapGetBriefDataArray(value: $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray | null | undefined): void {
        this._MsgNormalMapGetBriefDataArray = value;
    }
    public createIfNotExistsMsgNormalMapGetBriefDataArray(): $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray {
        return this._MsgNormalMapGetBriefDataArray ??= new $Message$CommonProto$NetMessage$MsgNormalMapGetBriefDataArray();
    }

    public checkHasMsgMapGetRawData(): boolean {
        return this._MsgMapGetRawData != null;
    }
    public getMsgMapGetRawData(): $Message$CommonProto$NetMessage$MsgMapGetRawData | null | undefined {
        return this._MsgMapGetRawData;
    }
    public setMsgMapGetRawData(value: $Message$CommonProto$NetMessage$MsgMapGetRawData | null | undefined): void {
        this._MsgMapGetRawData = value;
    }
    public createIfNotExistsMsgMapGetRawData(): $Message$CommonProto$NetMessage$MsgMapGetRawData {
        return this._MsgMapGetRawData ??= new $Message$CommonProto$NetMessage$MsgMapGetRawData();
    }

    public checkHasMsgMapGetMapTag(): boolean {
        return this._MsgMapGetMapTag != null;
    }
    public getMsgMapGetMapTag(): $Message$CommonProto$NetMessage$MsgMapGetMapTag | null | undefined {
        return this._MsgMapGetMapTag;
    }
    public setMsgMapGetMapTag(value: $Message$CommonProto$NetMessage$MsgMapGetMapTag | null | undefined): void {
        this._MsgMapGetMapTag = value;
    }
    public createIfNotExistsMsgMapGetMapTag(): $Message$CommonProto$NetMessage$MsgMapGetMapTag {
        return this._MsgMapGetMapTag ??= new $Message$CommonProto$NetMessage$MsgMapGetMapTag();
    }

    public checkHasMsgMailGetAllMailArray(): boolean {
        return this._MsgMailGetAllMailArray != null;
    }
    public getMsgMailGetAllMailArray(): $Message$CommonProto$NetMessage$MsgMailGetAllMailArray | null | undefined {
        return this._MsgMailGetAllMailArray;
    }
    public setMsgMailGetAllMailArray(value: $Message$CommonProto$NetMessage$MsgMailGetAllMailArray | null | undefined): void {
        this._MsgMailGetAllMailArray = value;
    }
    public createIfNotExistsMsgMailGetAllMailArray(): $Message$CommonProto$NetMessage$MsgMailGetAllMailArray {
        return this._MsgMailGetAllMailArray ??= new $Message$CommonProto$NetMessage$MsgMailGetAllMailArray();
    }

    public checkHasMsgMailGetMail(): boolean {
        return this._MsgMailGetMail != null;
    }
    public getMsgMailGetMail(): $Message$CommonProto$NetMessage$MsgMailGetMail | null | undefined {
        return this._MsgMailGetMail;
    }
    public setMsgMailGetMail(value: $Message$CommonProto$NetMessage$MsgMailGetMail | null | undefined): void {
        this._MsgMailGetMail = value;
    }
    public createIfNotExistsMsgMailGetMail(): $Message$CommonProto$NetMessage$MsgMailGetMail {
        return this._MsgMailGetMail ??= new $Message$CommonProto$NetMessage$MsgMailGetMail();
    }

    public checkHasMsgMailDeleteMail(): boolean {
        return this._MsgMailDeleteMail != null;
    }
    public getMsgMailDeleteMail(): $Message$CommonProto$NetMessage$MsgMailDeleteMail | null | undefined {
        return this._MsgMailDeleteMail;
    }
    public setMsgMailDeleteMail(value: $Message$CommonProto$NetMessage$MsgMailDeleteMail | null | undefined): void {
        this._MsgMailDeleteMail = value;
    }
    public createIfNotExistsMsgMailDeleteMail(): $Message$CommonProto$NetMessage$MsgMailDeleteMail {
        return this._MsgMailDeleteMail ??= new $Message$CommonProto$NetMessage$MsgMailDeleteMail();
    }

    public checkHasMsgMailSetIsNew(): boolean {
        return this._MsgMailSetIsNew != null;
    }
    public getMsgMailSetIsNew(): $Message$CommonProto$NetMessage$MsgMailSetIsNew | null | undefined {
        return this._MsgMailSetIsNew;
    }
    public setMsgMailSetIsNew(value: $Message$CommonProto$NetMessage$MsgMailSetIsNew | null | undefined): void {
        this._MsgMailSetIsNew = value;
    }
    public createIfNotExistsMsgMailSetIsNew(): $Message$CommonProto$NetMessage$MsgMailSetIsNew {
        return this._MsgMailSetIsNew ??= new $Message$CommonProto$NetMessage$MsgMailSetIsNew();
    }

    public checkHasMsgAtGetGlobalSettings(): boolean {
        return this._MsgAtGetGlobalSettings != null;
    }
    public getMsgAtGetGlobalSettings(): $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings | null | undefined {
        return this._MsgAtGetGlobalSettings;
    }
    public setMsgAtGetGlobalSettings(value: $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings | null | undefined): void {
        this._MsgAtGetGlobalSettings = value;
    }
    public createIfNotExistsMsgAtGetGlobalSettings(): $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings {
        return this._MsgAtGetGlobalSettings ??= new $Message$CommonProto$NetMessage$MsgAtGetGlobalSettings();
    }

    public checkHasMsgAtSetGlobalSettings(): boolean {
        return this._MsgAtSetGlobalSettings != null;
    }
    public getMsgAtSetGlobalSettings(): $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings | null | undefined {
        return this._MsgAtSetGlobalSettings;
    }
    public setMsgAtSetGlobalSettings(value: $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings | null | undefined): void {
        this._MsgAtSetGlobalSettings = value;
    }
    public createIfNotExistsMsgAtSetGlobalSettings(): $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings {
        return this._MsgAtSetGlobalSettings ??= new $Message$CommonProto$NetMessage$MsgAtSetGlobalSettings();
    }

    public checkHasMsgAtCreateTourney(): boolean {
        return this._MsgAtCreateTourney != null;
    }
    public getMsgAtCreateTourney(): $Message$CommonProto$NetMessage$MsgAtCreateTourney | null | undefined {
        return this._MsgAtCreateTourney;
    }
    public setMsgAtCreateTourney(value: $Message$CommonProto$NetMessage$MsgAtCreateTourney | null | undefined): void {
        this._MsgAtCreateTourney = value;
    }
    public createIfNotExistsMsgAtCreateTourney(): $Message$CommonProto$NetMessage$MsgAtCreateTourney {
        return this._MsgAtCreateTourney ??= new $Message$CommonProto$NetMessage$MsgAtCreateTourney();
    }

    public checkHasMsgAtDeleteLastTourney(): boolean {
        return this._MsgAtDeleteLastTourney != null;
    }
    public getMsgAtDeleteLastTourney(): $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney | null | undefined {
        return this._MsgAtDeleteLastTourney;
    }
    public setMsgAtDeleteLastTourney(value: $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney | null | undefined): void {
        this._MsgAtDeleteLastTourney = value;
    }
    public createIfNotExistsMsgAtDeleteLastTourney(): $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney {
        return this._MsgAtDeleteLastTourney ??= new $Message$CommonProto$NetMessage$MsgAtDeleteLastTourney();
    }

    public checkHasMsgAtSetRegistrationDuration(): boolean {
        return this._MsgAtSetRegistrationDuration != null;
    }
    public getMsgAtSetRegistrationDuration(): $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration | null | undefined {
        return this._MsgAtSetRegistrationDuration;
    }
    public setMsgAtSetRegistrationDuration(value: $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration | null | undefined): void {
        this._MsgAtSetRegistrationDuration = value;
    }
    public createIfNotExistsMsgAtSetRegistrationDuration(): $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration {
        return this._MsgAtSetRegistrationDuration ??= new $Message$CommonProto$NetMessage$MsgAtSetRegistrationDuration();
    }

    public checkHasMsgAtSetAdjustmentDuration(): boolean {
        return this._MsgAtSetAdjustmentDuration != null;
    }
    public getMsgAtSetAdjustmentDuration(): $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration | null | undefined {
        return this._MsgAtSetAdjustmentDuration;
    }
    public setMsgAtSetAdjustmentDuration(value: $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration | null | undefined): void {
        this._MsgAtSetAdjustmentDuration = value;
    }
    public createIfNotExistsMsgAtSetAdjustmentDuration(): $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration {
        return this._MsgAtSetAdjustmentDuration ??= new $Message$CommonProto$NetMessage$MsgAtSetAdjustmentDuration();
    }

    public checkHasMsgAtSetInitialBrackets(): boolean {
        return this._MsgAtSetInitialBrackets != null;
    }
    public getMsgAtSetInitialBrackets(): $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets | null | undefined {
        return this._MsgAtSetInitialBrackets;
    }
    public setMsgAtSetInitialBrackets(value: $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets | null | undefined): void {
        this._MsgAtSetInitialBrackets = value;
    }
    public createIfNotExistsMsgAtSetInitialBrackets(): $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets {
        return this._MsgAtSetInitialBrackets ??= new $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets();
    }

    public checkHasMsgAtSetMapPool(): boolean {
        return this._MsgAtSetMapPool != null;
    }
    public getMsgAtSetMapPool(): $Message$CommonProto$NetMessage$MsgAtSetMapPool | null | undefined {
        return this._MsgAtSetMapPool;
    }
    public setMsgAtSetMapPool(value: $Message$CommonProto$NetMessage$MsgAtSetMapPool | null | undefined): void {
        this._MsgAtSetMapPool = value;
    }
    public createIfNotExistsMsgAtSetMapPool(): $Message$CommonProto$NetMessage$MsgAtSetMapPool {
        return this._MsgAtSetMapPool ??= new $Message$CommonProto$NetMessage$MsgAtSetMapPool();
    }

    public checkHasMsgAtSetName(): boolean {
        return this._MsgAtSetName != null;
    }
    public getMsgAtSetName(): $Message$CommonProto$NetMessage$MsgAtSetName | null | undefined {
        return this._MsgAtSetName;
    }
    public setMsgAtSetName(value: $Message$CommonProto$NetMessage$MsgAtSetName | null | undefined): void {
        this._MsgAtSetName = value;
    }
    public createIfNotExistsMsgAtSetName(): $Message$CommonProto$NetMessage$MsgAtSetName {
        return this._MsgAtSetName ??= new $Message$CommonProto$NetMessage$MsgAtSetName();
    }

    public checkHasMsgAtSetBootTimer(): boolean {
        return this._MsgAtSetBootTimer != null;
    }
    public getMsgAtSetBootTimer(): $Message$CommonProto$NetMessage$MsgAtSetBootTimer | null | undefined {
        return this._MsgAtSetBootTimer;
    }
    public setMsgAtSetBootTimer(value: $Message$CommonProto$NetMessage$MsgAtSetBootTimer | null | undefined): void {
        this._MsgAtSetBootTimer = value;
    }
    public createIfNotExistsMsgAtSetBootTimer(): $Message$CommonProto$NetMessage$MsgAtSetBootTimer {
        return this._MsgAtSetBootTimer ??= new $Message$CommonProto$NetMessage$MsgAtSetBootTimer();
    }

    public checkHasMsgAtGetUserArray(): boolean {
        return this._MsgAtGetUserArray != null;
    }
    public getMsgAtGetUserArray(): $Message$CommonProto$NetMessage$MsgAtGetUserArray | null | undefined {
        return this._MsgAtGetUserArray;
    }
    public setMsgAtGetUserArray(value: $Message$CommonProto$NetMessage$MsgAtGetUserArray | null | undefined): void {
        this._MsgAtGetUserArray = value;
    }
    public createIfNotExistsMsgAtGetUserArray(): $Message$CommonProto$NetMessage$MsgAtGetUserArray {
        return this._MsgAtGetUserArray ??= new $Message$CommonProto$NetMessage$MsgAtGetUserArray();
    }

    public checkHasMsgAtDeleteUser(): boolean {
        return this._MsgAtDeleteUser != null;
    }
    public getMsgAtDeleteUser(): $Message$CommonProto$NetMessage$MsgAtDeleteUser | null | undefined {
        return this._MsgAtDeleteUser;
    }
    public setMsgAtDeleteUser(value: $Message$CommonProto$NetMessage$MsgAtDeleteUser | null | undefined): void {
        this._MsgAtDeleteUser = value;
    }
    public createIfNotExistsMsgAtDeleteUser(): $Message$CommonProto$NetMessage$MsgAtDeleteUser {
        return this._MsgAtDeleteUser ??= new $Message$CommonProto$NetMessage$MsgAtDeleteUser();
    }

    public checkHasMsgAtGetPhaseInfo(): boolean {
        return this._MsgAtGetPhaseInfo != null;
    }
    public getMsgAtGetPhaseInfo(): $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo | null | undefined {
        return this._MsgAtGetPhaseInfo;
    }
    public setMsgAtGetPhaseInfo(value: $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo | null | undefined): void {
        this._MsgAtGetPhaseInfo = value;
    }
    public createIfNotExistsMsgAtGetPhaseInfo(): $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo {
        return this._MsgAtGetPhaseInfo ??= new $Message$CommonProto$NetMessage$MsgAtGetPhaseInfo();
    }

    public checkHasMsgAtGetRegistrationInfo(): boolean {
        return this._MsgAtGetRegistrationInfo != null;
    }
    public getMsgAtGetRegistrationInfo(): $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo | null | undefined {
        return this._MsgAtGetRegistrationInfo;
    }
    public setMsgAtGetRegistrationInfo(value: $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo | null | undefined): void {
        this._MsgAtGetRegistrationInfo = value;
    }
    public createIfNotExistsMsgAtGetRegistrationInfo(): $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo {
        return this._MsgAtGetRegistrationInfo ??= new $Message$CommonProto$NetMessage$MsgAtGetRegistrationInfo();
    }

    public checkHasMsgAtGetTourneyInfo(): boolean {
        return this._MsgAtGetTourneyInfo != null;
    }
    public getMsgAtGetTourneyInfo(): $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo | null | undefined {
        return this._MsgAtGetTourneyInfo;
    }
    public setMsgAtGetTourneyInfo(value: $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo | null | undefined): void {
        this._MsgAtGetTourneyInfo = value;
    }
    public createIfNotExistsMsgAtGetTourneyInfo(): $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo {
        return this._MsgAtGetTourneyInfo ??= new $Message$CommonProto$NetMessage$MsgAtGetTourneyInfo();
    }

    public checkHasMsgAtGetFullMapInfo(): boolean {
        return this._MsgAtGetFullMapInfo != null;
    }
    public getMsgAtGetFullMapInfo(): $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo | null | undefined {
        return this._MsgAtGetFullMapInfo;
    }
    public setMsgAtGetFullMapInfo(value: $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo | null | undefined): void {
        this._MsgAtGetFullMapInfo = value;
    }
    public createIfNotExistsMsgAtGetFullMapInfo(): $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo {
        return this._MsgAtGetFullMapInfo ??= new $Message$CommonProto$NetMessage$MsgAtGetFullMapInfo();
    }

    public checkHasMsgAtGetFullBracketInfo(): boolean {
        return this._MsgAtGetFullBracketInfo != null;
    }
    public getMsgAtGetFullBracketInfo(): $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo | null | undefined {
        return this._MsgAtGetFullBracketInfo;
    }
    public setMsgAtGetFullBracketInfo(value: $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo | null | undefined): void {
        this._MsgAtGetFullBracketInfo = value;
    }
    public createIfNotExistsMsgAtGetFullBracketInfo(): $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo {
        return this._MsgAtGetFullBracketInfo ??= new $Message$CommonProto$NetMessage$MsgAtGetFullBracketInfo();
    }

    public checkHasMsgAtRegister(): boolean {
        return this._MsgAtRegister != null;
    }
    public getMsgAtRegister(): $Message$CommonProto$NetMessage$MsgAtRegister | null | undefined {
        return this._MsgAtRegister;
    }
    public setMsgAtRegister(value: $Message$CommonProto$NetMessage$MsgAtRegister | null | undefined): void {
        this._MsgAtRegister = value;
    }
    public createIfNotExistsMsgAtRegister(): $Message$CommonProto$NetMessage$MsgAtRegister {
        return this._MsgAtRegister ??= new $Message$CommonProto$NetMessage$MsgAtRegister();
    }

    public checkHasMsgAtrGetJoinedRoomIdArray(): boolean {
        return this._MsgAtrGetJoinedRoomIdArray != null;
    }
    public getMsgAtrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray | null | undefined {
        return this._MsgAtrGetJoinedRoomIdArray;
    }
    public setMsgAtrGetJoinedRoomIdArray(value: $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray | null | undefined): void {
        this._MsgAtrGetJoinedRoomIdArray = value;
    }
    public createIfNotExistsMsgAtrGetJoinedRoomIdArray(): $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray {
        return this._MsgAtrGetJoinedRoomIdArray ??= new $Message$CommonProto$NetMessage$MsgAtrGetJoinedRoomIdArray();
    }

    public checkHasMsgAtrGetRoomPublicInfo(): boolean {
        return this._MsgAtrGetRoomPublicInfo != null;
    }
    public getMsgAtrGetRoomPublicInfo(): $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo | null | undefined {
        return this._MsgAtrGetRoomPublicInfo;
    }
    public setMsgAtrGetRoomPublicInfo(value: $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo | null | undefined): void {
        this._MsgAtrGetRoomPublicInfo = value;
    }
    public createIfNotExistsMsgAtrGetRoomPublicInfo(): $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo {
        return this._MsgAtrGetRoomPublicInfo ??= new $Message$CommonProto$NetMessage$MsgAtrGetRoomPublicInfo();
    }

    public checkHasMsgAtrDeleteRoomByServer(): boolean {
        return this._MsgAtrDeleteRoomByServer != null;
    }
    public getMsgAtrDeleteRoomByServer(): $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer | null | undefined {
        return this._MsgAtrDeleteRoomByServer;
    }
    public setMsgAtrDeleteRoomByServer(value: $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer | null | undefined): void {
        this._MsgAtrDeleteRoomByServer = value;
    }
    public createIfNotExistsMsgAtrDeleteRoomByServer(): $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer {
        return this._MsgAtrDeleteRoomByServer ??= new $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer();
    }

    public checkHasMsgAtrSetBannedCoIdArray(): boolean {
        return this._MsgAtrSetBannedCoIdArray != null;
    }
    public getMsgAtrSetBannedCoIdArray(): $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray | null | undefined {
        return this._MsgAtrSetBannedCoIdArray;
    }
    public setMsgAtrSetBannedCoIdArray(value: $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray | null | undefined): void {
        this._MsgAtrSetBannedCoIdArray = value;
    }
    public createIfNotExistsMsgAtrSetBannedCoIdArray(): $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray {
        return this._MsgAtrSetBannedCoIdArray ??= new $Message$CommonProto$NetMessage$MsgAtrSetBannedCoIdArray();
    }

    public checkHasMsgAtrSetSelfSettings(): boolean {
        return this._MsgAtrSetSelfSettings != null;
    }
    public getMsgAtrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings | null | undefined {
        return this._MsgAtrSetSelfSettings;
    }
    public setMsgAtrSetSelfSettings(value: $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings | null | undefined): void {
        this._MsgAtrSetSelfSettings = value;
    }
    public createIfNotExistsMsgAtrSetSelfSettings(): $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings {
        return this._MsgAtrSetSelfSettings ??= new $Message$CommonProto$NetMessage$MsgAtrSetSelfSettings();
    }

    public checkHasMsgGmSetUserPrivilege(): boolean {
        return this._MsgGmSetUserPrivilege != null;
    }
    public getMsgGmSetUserPrivilege(): $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege | null | undefined {
        return this._MsgGmSetUserPrivilege;
    }
    public setMsgGmSetUserPrivilege(value: $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege | null | undefined): void {
        this._MsgGmSetUserPrivilege = value;
    }
    public createIfNotExistsMsgGmSetUserPrivilege(): $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege {
        return this._MsgGmSetUserPrivilege ??= new $Message$CommonProto$NetMessage$MsgGmSetUserPrivilege();
    }

    public checkHasMsgGmSetUserPassword(): boolean {
        return this._MsgGmSetUserPassword != null;
    }
    public getMsgGmSetUserPassword(): $Message$CommonProto$NetMessage$MsgGmSetUserPassword | null | undefined {
        return this._MsgGmSetUserPassword;
    }
    public setMsgGmSetUserPassword(value: $Message$CommonProto$NetMessage$MsgGmSetUserPassword | null | undefined): void {
        this._MsgGmSetUserPassword = value;
    }
    public createIfNotExistsMsgGmSetUserPassword(): $Message$CommonProto$NetMessage$MsgGmSetUserPassword {
        return this._MsgGmSetUserPassword ??= new $Message$CommonProto$NetMessage$MsgGmSetUserPassword();
    }

    public checkHasMsgGmDeleteMcrRoom(): boolean {
        return this._MsgGmDeleteMcrRoom != null;
    }
    public getMsgGmDeleteMcrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom | null | undefined {
        return this._MsgGmDeleteMcrRoom;
    }
    public setMsgGmDeleteMcrRoom(value: $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom | null | undefined): void {
        this._MsgGmDeleteMcrRoom = value;
    }
    public createIfNotExistsMsgGmDeleteMcrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom {
        return this._MsgGmDeleteMcrRoom ??= new $Message$CommonProto$NetMessage$MsgGmDeleteMcrRoom();
    }

    public checkHasMsgGmDeleteMfrRoom(): boolean {
        return this._MsgGmDeleteMfrRoom != null;
    }
    public getMsgGmDeleteMfrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom | null | undefined {
        return this._MsgGmDeleteMfrRoom;
    }
    public setMsgGmDeleteMfrRoom(value: $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom | null | undefined): void {
        this._MsgGmDeleteMfrRoom = value;
    }
    public createIfNotExistsMsgGmDeleteMfrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom {
        return this._MsgGmDeleteMfrRoom ??= new $Message$CommonProto$NetMessage$MsgGmDeleteMfrRoom();
    }

    public checkHasMsgGmDeleteCcrRoom(): boolean {
        return this._MsgGmDeleteCcrRoom != null;
    }
    public getMsgGmDeleteCcrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom | null | undefined {
        return this._MsgGmDeleteCcrRoom;
    }
    public setMsgGmDeleteCcrRoom(value: $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom | null | undefined): void {
        this._MsgGmDeleteCcrRoom = value;
    }
    public createIfNotExistsMsgGmDeleteCcrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom {
        return this._MsgGmDeleteCcrRoom ??= new $Message$CommonProto$NetMessage$MsgGmDeleteCcrRoom();
    }

    public checkHasMsgGmDeleteMrrRoom(): boolean {
        return this._MsgGmDeleteMrrRoom != null;
    }
    public getMsgGmDeleteMrrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom | null | undefined {
        return this._MsgGmDeleteMrrRoom;
    }
    public setMsgGmDeleteMrrRoom(value: $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom | null | undefined): void {
        this._MsgGmDeleteMrrRoom = value;
    }
    public createIfNotExistsMsgGmDeleteMrrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom {
        return this._MsgGmDeleteMrrRoom ??= new $Message$CommonProto$NetMessage$MsgGmDeleteMrrRoom();
    }

    public checkHasMsgGmDeleteMmrRoom(): boolean {
        return this._MsgGmDeleteMmrRoom != null;
    }
    public getMsgGmDeleteMmrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom | null | undefined {
        return this._MsgGmDeleteMmrRoom;
    }
    public setMsgGmDeleteMmrRoom(value: $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom | null | undefined): void {
        this._MsgGmDeleteMmrRoom = value;
    }
    public createIfNotExistsMsgGmDeleteMmrRoom(): $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom {
        return this._MsgGmDeleteMmrRoom ??= new $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom();
    }

    public checkHasMsgGmDeleteSpmAllScoreAndReplay(): boolean {
        return this._MsgGmDeleteSpmAllScoreAndReplay != null;
    }
    public getMsgGmDeleteSpmAllScoreAndReplay(): $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay | null | undefined {
        return this._MsgGmDeleteSpmAllScoreAndReplay;
    }
    public setMsgGmDeleteSpmAllScoreAndReplay(value: $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay | null | undefined): void {
        this._MsgGmDeleteSpmAllScoreAndReplay = value;
    }
    public createIfNotExistsMsgGmDeleteSpmAllScoreAndReplay(): $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay {
        return this._MsgGmDeleteSpmAllScoreAndReplay ??= new $Message$CommonProto$NetMessage$MsgGmDeleteSpmAllScoreAndReplay();
    }

    public checkHasMsgGmAddUserMedal(): boolean {
        return this._MsgGmAddUserMedal != null;
    }
    public getMsgGmAddUserMedal(): $Message$CommonProto$NetMessage$MsgGmAddUserMedal | null | undefined {
        return this._MsgGmAddUserMedal;
    }
    public setMsgGmAddUserMedal(value: $Message$CommonProto$NetMessage$MsgGmAddUserMedal | null | undefined): void {
        this._MsgGmAddUserMedal = value;
    }
    public createIfNotExistsMsgGmAddUserMedal(): $Message$CommonProto$NetMessage$MsgGmAddUserMedal {
        return this._MsgGmAddUserMedal ??= new $Message$CommonProto$NetMessage$MsgGmAddUserMedal();
    }

    public checkHasMsgGmGenerateReplayStatistics(): boolean {
        return this._MsgGmGenerateReplayStatistics != null;
    }
    public getMsgGmGenerateReplayStatistics(): $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics | null | undefined {
        return this._MsgGmGenerateReplayStatistics;
    }
    public setMsgGmGenerateReplayStatistics(value: $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics | null | undefined): void {
        this._MsgGmGenerateReplayStatistics = value;
    }
    public createIfNotExistsMsgGmGenerateReplayStatistics(): $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics {
        return this._MsgGmGenerateReplayStatistics ??= new $Message$CommonProto$NetMessage$MsgGmGenerateReplayStatistics();
    }

    public checkHasMsgGmUpdateReplayInfo(): boolean {
        return this._MsgGmUpdateReplayInfo != null;
    }
    public getMsgGmUpdateReplayInfo(): $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo | null | undefined {
        return this._MsgGmUpdateReplayInfo;
    }
    public setMsgGmUpdateReplayInfo(value: $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo | null | undefined): void {
        this._MsgGmUpdateReplayInfo = value;
    }
    public createIfNotExistsMsgGmUpdateReplayInfo(): $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo {
        return this._MsgGmUpdateReplayInfo ??= new $Message$CommonProto$NetMessage$MsgGmUpdateReplayInfo();
    }

    public checkHasMsgCmGetAllCampaignIdArray(): boolean {
        return this._MsgCmGetAllCampaignIdArray != null;
    }
    public getMsgCmGetAllCampaignIdArray(): $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray | null | undefined {
        return this._MsgCmGetAllCampaignIdArray;
    }
    public setMsgCmGetAllCampaignIdArray(value: $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray | null | undefined): void {
        this._MsgCmGetAllCampaignIdArray = value;
    }
    public createIfNotExistsMsgCmGetAllCampaignIdArray(): $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray {
        return this._MsgCmGetAllCampaignIdArray ??= new $Message$CommonProto$NetMessage$MsgCmGetAllCampaignIdArray();
    }

    public checkHasMsgCmGetDesigningCampaignIdArray(): boolean {
        return this._MsgCmGetDesigningCampaignIdArray != null;
    }
    public getMsgCmGetDesigningCampaignIdArray(): $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray | null | undefined {
        return this._MsgCmGetDesigningCampaignIdArray;
    }
    public setMsgCmGetDesigningCampaignIdArray(value: $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray | null | undefined): void {
        this._MsgCmGetDesigningCampaignIdArray = value;
    }
    public createIfNotExistsMsgCmGetDesigningCampaignIdArray(): $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray {
        return this._MsgCmGetDesigningCampaignIdArray ??= new $Message$CommonProto$NetMessage$MsgCmGetDesigningCampaignIdArray();
    }

    public checkHasMsgCmCreateCampaign(): boolean {
        return this._MsgCmCreateCampaign != null;
    }
    public getMsgCmCreateCampaign(): $Message$CommonProto$NetMessage$MsgCmCreateCampaign | null | undefined {
        return this._MsgCmCreateCampaign;
    }
    public setMsgCmCreateCampaign(value: $Message$CommonProto$NetMessage$MsgCmCreateCampaign | null | undefined): void {
        this._MsgCmCreateCampaign = value;
    }
    public createIfNotExistsMsgCmCreateCampaign(): $Message$CommonProto$NetMessage$MsgCmCreateCampaign {
        return this._MsgCmCreateCampaign ??= new $Message$CommonProto$NetMessage$MsgCmCreateCampaign();
    }

    public checkHasMsgCmCreateCampaignMap(): boolean {
        return this._MsgCmCreateCampaignMap != null;
    }
    public getMsgCmCreateCampaignMap(): $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap | null | undefined {
        return this._MsgCmCreateCampaignMap;
    }
    public setMsgCmCreateCampaignMap(value: $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap | null | undefined): void {
        this._MsgCmCreateCampaignMap = value;
    }
    public createIfNotExistsMsgCmCreateCampaignMap(): $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap {
        return this._MsgCmCreateCampaignMap ??= new $Message$CommonProto$NetMessage$MsgCmCreateCampaignMap();
    }

    public checkHasMsgCmSetCampaignName(): boolean {
        return this._MsgCmSetCampaignName != null;
    }
    public getMsgCmSetCampaignName(): $Message$CommonProto$NetMessage$MsgCmSetCampaignName | null | undefined {
        return this._MsgCmSetCampaignName;
    }
    public setMsgCmSetCampaignName(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignName | null | undefined): void {
        this._MsgCmSetCampaignName = value;
    }
    public createIfNotExistsMsgCmSetCampaignName(): $Message$CommonProto$NetMessage$MsgCmSetCampaignName {
        return this._MsgCmSetCampaignName ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignName();
    }

    public checkHasMsgCmSetCampaignDesc(): boolean {
        return this._MsgCmSetCampaignDesc != null;
    }
    public getMsgCmSetCampaignDesc(): $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc | null | undefined {
        return this._MsgCmSetCampaignDesc;
    }
    public setMsgCmSetCampaignDesc(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc | null | undefined): void {
        this._MsgCmSetCampaignDesc = value;
    }
    public createIfNotExistsMsgCmSetCampaignDesc(): $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc {
        return this._MsgCmSetCampaignDesc ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignDesc();
    }

    public checkHasMsgCmSetCampaignEnabled(): boolean {
        return this._MsgCmSetCampaignEnabled != null;
    }
    public getMsgCmSetCampaignEnabled(): $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled | null | undefined {
        return this._MsgCmSetCampaignEnabled;
    }
    public setMsgCmSetCampaignEnabled(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled | null | undefined): void {
        this._MsgCmSetCampaignEnabled = value;
    }
    public createIfNotExistsMsgCmSetCampaignEnabled(): $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled {
        return this._MsgCmSetCampaignEnabled ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignEnabled();
    }

    public checkHasMsgCmSetCampaignMapEnabled(): boolean {
        return this._MsgCmSetCampaignMapEnabled != null;
    }
    public getMsgCmSetCampaignMapEnabled(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled | null | undefined {
        return this._MsgCmSetCampaignMapEnabled;
    }
    public setMsgCmSetCampaignMapEnabled(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled | null | undefined): void {
        this._MsgCmSetCampaignMapEnabled = value;
    }
    public createIfNotExistsMsgCmSetCampaignMapEnabled(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled {
        return this._MsgCmSetCampaignMapEnabled ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignMapEnabled();
    }

    public checkHasMsgCmSetCampaignMapRawData(): boolean {
        return this._MsgCmSetCampaignMapRawData != null;
    }
    public getMsgCmSetCampaignMapRawData(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData | null | undefined {
        return this._MsgCmSetCampaignMapRawData;
    }
    public setMsgCmSetCampaignMapRawData(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData | null | undefined): void {
        this._MsgCmSetCampaignMapRawData = value;
    }
    public createIfNotExistsMsgCmSetCampaignMapRawData(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData {
        return this._MsgCmSetCampaignMapRawData ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignMapRawData();
    }

    public checkHasMsgCmSetCampaignMapExtraText(): boolean {
        return this._MsgCmSetCampaignMapExtraText != null;
    }
    public getMsgCmSetCampaignMapExtraText(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText | null | undefined {
        return this._MsgCmSetCampaignMapExtraText;
    }
    public setMsgCmSetCampaignMapExtraText(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText | null | undefined): void {
        this._MsgCmSetCampaignMapExtraText = value;
    }
    public createIfNotExistsMsgCmSetCampaignMapExtraText(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText {
        return this._MsgCmSetCampaignMapExtraText ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignMapExtraText();
    }

    public checkHasMsgCmSetCampaignMapName(): boolean {
        return this._MsgCmSetCampaignMapName != null;
    }
    public getMsgCmSetCampaignMapName(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName | null | undefined {
        return this._MsgCmSetCampaignMapName;
    }
    public setMsgCmSetCampaignMapName(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName | null | undefined): void {
        this._MsgCmSetCampaignMapName = value;
    }
    public createIfNotExistsMsgCmSetCampaignMapName(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName {
        return this._MsgCmSetCampaignMapName ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignMapName();
    }

    public checkHasMsgCmSetCampaignMapWarEventAction(): boolean {
        return this._MsgCmSetCampaignMapWarEventAction != null;
    }
    public getMsgCmSetCampaignMapWarEventAction(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction | null | undefined {
        return this._MsgCmSetCampaignMapWarEventAction;
    }
    public setMsgCmSetCampaignMapWarEventAction(value: $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction | null | undefined): void {
        this._MsgCmSetCampaignMapWarEventAction = value;
    }
    public createIfNotExistsMsgCmSetCampaignMapWarEventAction(): $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction {
        return this._MsgCmSetCampaignMapWarEventAction ??= new $Message$CommonProto$NetMessage$MsgCmSetCampaignMapWarEventAction();
    }

    public checkHasMsgCmUpdateCampaignDesigners(): boolean {
        return this._MsgCmUpdateCampaignDesigners != null;
    }
    public getMsgCmUpdateCampaignDesigners(): $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners | null | undefined {
        return this._MsgCmUpdateCampaignDesigners;
    }
    public setMsgCmUpdateCampaignDesigners(value: $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners | null | undefined): void {
        this._MsgCmUpdateCampaignDesigners = value;
    }
    public createIfNotExistsMsgCmUpdateCampaignDesigners(): $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners {
        return this._MsgCmUpdateCampaignDesigners ??= new $Message$CommonProto$NetMessage$MsgCmUpdateCampaignDesigners();
    }

    public checkHasMsgCmSetExtraLink(): boolean {
        return this._MsgCmSetExtraLink != null;
    }
    public getMsgCmSetExtraLink(): $Message$CommonProto$NetMessage$MsgCmSetExtraLink | null | undefined {
        return this._MsgCmSetExtraLink;
    }
    public setMsgCmSetExtraLink(value: $Message$CommonProto$NetMessage$MsgCmSetExtraLink | null | undefined): void {
        this._MsgCmSetExtraLink = value;
    }
    public createIfNotExistsMsgCmSetExtraLink(): $Message$CommonProto$NetMessage$MsgCmSetExtraLink {
        return this._MsgCmSetExtraLink ??= new $Message$CommonProto$NetMessage$MsgCmSetExtraLink();
    }

    public checkHasMsgCampaignGetCampaignInfo(): boolean {
        return this._MsgCampaignGetCampaignInfo != null;
    }
    public getMsgCampaignGetCampaignInfo(): $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo | null | undefined {
        return this._MsgCampaignGetCampaignInfo;
    }
    public setMsgCampaignGetCampaignInfo(value: $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo | null | undefined): void {
        this._MsgCampaignGetCampaignInfo = value;
    }
    public createIfNotExistsMsgCampaignGetCampaignInfo(): $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo {
        return this._MsgCampaignGetCampaignInfo ??= new $Message$CommonProto$NetMessage$MsgCampaignGetCampaignInfo();
    }

    public checkHasMsgCampaignGetEnabledCampaignIdArray(): boolean {
        return this._MsgCampaignGetEnabledCampaignIdArray != null;
    }
    public getMsgCampaignGetEnabledCampaignIdArray(): $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray | null | undefined {
        return this._MsgCampaignGetEnabledCampaignIdArray;
    }
    public setMsgCampaignGetEnabledCampaignIdArray(value: $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray | null | undefined): void {
        this._MsgCampaignGetEnabledCampaignIdArray = value;
    }
    public createIfNotExistsMsgCampaignGetEnabledCampaignIdArray(): $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray {
        return this._MsgCampaignGetEnabledCampaignIdArray ??= new $Message$CommonProto$NetMessage$MsgCampaignGetEnabledCampaignIdArray();
    }

    public checkHasMsgCampaignGetAllMapTimestampArray(): boolean {
        return this._MsgCampaignGetAllMapTimestampArray != null;
    }
    public getMsgCampaignGetAllMapTimestampArray(): $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray | null | undefined {
        return this._MsgCampaignGetAllMapTimestampArray;
    }
    public setMsgCampaignGetAllMapTimestampArray(value: $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray | null | undefined): void {
        this._MsgCampaignGetAllMapTimestampArray = value;
    }
    public createIfNotExistsMsgCampaignGetAllMapTimestampArray(): $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray {
        return this._MsgCampaignGetAllMapTimestampArray ??= new $Message$CommonProto$NetMessage$MsgCampaignGetAllMapTimestampArray();
    }

    public checkHasMsgCampaignGetMapTimestamp(): boolean {
        return this._MsgCampaignGetMapTimestamp != null;
    }
    public getMsgCampaignGetMapTimestamp(): $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp | null | undefined {
        return this._MsgCampaignGetMapTimestamp;
    }
    public setMsgCampaignGetMapTimestamp(value: $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp | null | undefined): void {
        this._MsgCampaignGetMapTimestamp = value;
    }
    public createIfNotExistsMsgCampaignGetMapTimestamp(): $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp {
        return this._MsgCampaignGetMapTimestamp ??= new $Message$CommonProto$NetMessage$MsgCampaignGetMapTimestamp();
    }

    public checkHasMsgCampaignGetMapRawDataArray(): boolean {
        return this._MsgCampaignGetMapRawDataArray != null;
    }
    public getMsgCampaignGetMapRawDataArray(): $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray | null | undefined {
        return this._MsgCampaignGetMapRawDataArray;
    }
    public setMsgCampaignGetMapRawDataArray(value: $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray | null | undefined): void {
        this._MsgCampaignGetMapRawDataArray = value;
    }
    public createIfNotExistsMsgCampaignGetMapRawDataArray(): $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray {
        return this._MsgCampaignGetMapRawDataArray ??= new $Message$CommonProto$NetMessage$MsgCampaignGetMapRawDataArray();
    }

    public checkHasMsgCampaignGetMapRawData(): boolean {
        return this._MsgCampaignGetMapRawData != null;
    }
    public getMsgCampaignGetMapRawData(): $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData | null | undefined {
        return this._MsgCampaignGetMapRawData;
    }
    public setMsgCampaignGetMapRawData(value: $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData | null | undefined): void {
        this._MsgCampaignGetMapRawData = value;
    }
    public createIfNotExistsMsgCampaignGetMapRawData(): $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData {
        return this._MsgCampaignGetMapRawData ??= new $Message$CommonProto$NetMessage$MsgCampaignGetMapRawData();
    }

    public checkHasMsgCampaignCreateWar(): boolean {
        return this._MsgCampaignCreateWar != null;
    }
    public getMsgCampaignCreateWar(): $Message$CommonProto$NetMessage$MsgCampaignCreateWar | null | undefined {
        return this._MsgCampaignCreateWar;
    }
    public setMsgCampaignCreateWar(value: $Message$CommonProto$NetMessage$MsgCampaignCreateWar | null | undefined): void {
        this._MsgCampaignCreateWar = value;
    }
    public createIfNotExistsMsgCampaignCreateWar(): $Message$CommonProto$NetMessage$MsgCampaignCreateWar {
        return this._MsgCampaignCreateWar ??= new $Message$CommonProto$NetMessage$MsgCampaignCreateWar();
    }

    public checkHasMsgCampaignSaveWar(): boolean {
        return this._MsgCampaignSaveWar != null;
    }
    public getMsgCampaignSaveWar(): $Message$CommonProto$NetMessage$MsgCampaignSaveWar | null | undefined {
        return this._MsgCampaignSaveWar;
    }
    public setMsgCampaignSaveWar(value: $Message$CommonProto$NetMessage$MsgCampaignSaveWar | null | undefined): void {
        this._MsgCampaignSaveWar = value;
    }
    public createIfNotExistsMsgCampaignSaveWar(): $Message$CommonProto$NetMessage$MsgCampaignSaveWar {
        return this._MsgCampaignSaveWar ??= new $Message$CommonProto$NetMessage$MsgCampaignSaveWar();
    }

    public checkHasMsgCampaignValidateWar(): boolean {
        return this._MsgCampaignValidateWar != null;
    }
    public getMsgCampaignValidateWar(): $Message$CommonProto$NetMessage$MsgCampaignValidateWar | null | undefined {
        return this._MsgCampaignValidateWar;
    }
    public setMsgCampaignValidateWar(value: $Message$CommonProto$NetMessage$MsgCampaignValidateWar | null | undefined): void {
        this._MsgCampaignValidateWar = value;
    }
    public createIfNotExistsMsgCampaignValidateWar(): $Message$CommonProto$NetMessage$MsgCampaignValidateWar {
        return this._MsgCampaignValidateWar ??= new $Message$CommonProto$NetMessage$MsgCampaignValidateWar();
    }

    public checkHasMsgCampaignGetCampaignLeaderboard(): boolean {
        return this._MsgCampaignGetCampaignLeaderboard != null;
    }
    public getMsgCampaignGetCampaignLeaderboard(): $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard | null | undefined {
        return this._MsgCampaignGetCampaignLeaderboard;
    }
    public setMsgCampaignGetCampaignLeaderboard(value: $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard | null | undefined): void {
        this._MsgCampaignGetCampaignLeaderboard = value;
    }
    public createIfNotExistsMsgCampaignGetCampaignLeaderboard(): $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard {
        return this._MsgCampaignGetCampaignLeaderboard ??= new $Message$CommonProto$NetMessage$MsgCampaignGetCampaignLeaderboard();
    }

    public checkHasMsgCampaignGetCampaignMapLeaderboard(): boolean {
        return this._MsgCampaignGetCampaignMapLeaderboard != null;
    }
    public getMsgCampaignGetCampaignMapLeaderboard(): $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard | null | undefined {
        return this._MsgCampaignGetCampaignMapLeaderboard;
    }
    public setMsgCampaignGetCampaignMapLeaderboard(value: $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard | null | undefined): void {
        this._MsgCampaignGetCampaignMapLeaderboard = value;
    }
    public createIfNotExistsMsgCampaignGetCampaignMapLeaderboard(): $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard {
        return this._MsgCampaignGetCampaignMapLeaderboard ??= new $Message$CommonProto$NetMessage$MsgCampaignGetCampaignMapLeaderboard();
    }

    public checkHasMsgCampaignGetScore(): boolean {
        return this._MsgCampaignGetScore != null;
    }
    public getMsgCampaignGetScore(): $Message$CommonProto$NetMessage$MsgCampaignGetScore | null | undefined {
        return this._MsgCampaignGetScore;
    }
    public setMsgCampaignGetScore(value: $Message$CommonProto$NetMessage$MsgCampaignGetScore | null | undefined): void {
        this._MsgCampaignGetScore = value;
    }
    public createIfNotExistsMsgCampaignGetScore(): $Message$CommonProto$NetMessage$MsgCampaignGetScore {
        return this._MsgCampaignGetScore ??= new $Message$CommonProto$NetMessage$MsgCampaignGetScore();
    }
}
