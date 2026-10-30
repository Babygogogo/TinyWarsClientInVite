import {
    Helpers_Misc,
    NormalMap_Model_NormalMapModel,
    ReplayWar_Model_RwModel,
    Lang_Utils,
    Ui_Utils_UiSkinHelpers,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    type Egret_Egret,
    type Ui_Interfaces_IUiLabel,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { S as ReplayGetReplayInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type { S as ReplayGetSelfRatingResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type { ReplayInfo } from "../../proto/schema/CommonProto/Replay/ReplayInfo.ts";

export type OpenData = {
    replayId: number;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _labelMapNameTitle!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelWarTypeTitle!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarType!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelGlobalRatingTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelGlobalRating!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelMyRatingTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRating!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelTurnIndexTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnIndex!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelEndTimeTitle!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEndTime!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "replayWar/RwReplayWarInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgReplayGetReplayInfo,  callback : this._onNotifyMsgReplayGetBriefInfo },
            { type : Notifications_TypeId.TypeId.MsgReplayGetSelfRating,  callback : this._onNotifyMsgReplayGetSelfRating },
        ]);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });

        this._updateComponentsForLanguage();
    }
    protected _doApplyOpenData(): void | Promise<void> {
        this._updateComponentsForReplayBriefInfo();
        this._updateLabelMyRating();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgReplayGetBriefInfo(e: Egret_Egret.Event): void {
        const data      = e.data as ReplayGetReplayInfoResponse;
        const replayId  = this.getOpenData()?.replayId;
        if ((replayId != null) && (replayId === data.getReplayId())) {
            this._updateComponentsForReplayBriefInfo();
        }
    }

    private _onNotifyMsgReplayGetSelfRating(e: Egret_Egret.Event): void {
        const data      = e.data as ReplayGetSelfRatingResponse;
        const replayId  = this.getOpenData()?.replayId;
        if ((replayId != null) && (replayId === data.getReplayId())) {
            this._updateLabelMyRating();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelWarTypeTitle.setLangText(Lang_Constants.TextType.B0599);
        this._labelGlobalRatingTitle.setLangText(Lang_Constants.TextType.B0364);
        this._labelMyRatingTitle.setLangText(Lang_Constants.TextType.B0363);
        this._labelTurnIndexTitle.setLangText(Lang_Constants.TextType.B0600);
        this._labelEndTimeTitle.setLangText(Lang_Constants.TextType.EndTime);
    }

    private _updateComponentsForReplayBriefInfo(): void {
        this._updateLabelWarType();
        this._updateLabelGlobalRating();
        this._updateLabelMapName();
        this._updateLabelTurnIndex();
        this._updateLabelEndTime();
    }

    private async _updateLabelWarType(): Promise<void> {
        const replayBriefInfo = await this._getReplayInfo();
        this._labelWarType.setText(replayBriefInfo ? Lang_Utils.getWarTypeName(replayBriefInfo.getWarType()) ?? Lang_Constants.UndefinedError : `??`);
    }

    private async _updateLabelGlobalRating(): Promise<void> {
        const replayBriefInfo   = await this._getReplayInfo();
        const raters            = replayBriefInfo ? replayBriefInfo.getTotalRaters() : null;
        this._labelGlobalRating.setText(raters ? (Helpers_Misc.getExisted(replayBriefInfo?.getTotalRating()) / raters).toFixed(2) : Lang_Utils.getText(Lang_Constants.TextType.None));
    }

    private async _updateLabelMyRating(): Promise<void> {
        const replayId  = this.getOpenData()?.replayId;
        const rating    = replayId == null ? null : await ReplayWar_Model_RwModel.getReplaySelfRating(replayId);
        this._labelMyRating.setText(rating == null ? Lang_Utils.getText(Lang_Constants.TextType.None) : `${rating}`);
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = (await this._getReplayInfo())?.getNormalMapId();
        this._labelMapName.setText(normalMapId == null
            ? `----`
            : (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? Lang_Constants.UndefinedError,
        );
    }

    private async _updateLabelTurnIndex(): Promise<void> {
        const replayBriefInfo = await this._getReplayInfo();
        this._labelTurnIndex.setText(replayBriefInfo
            ? `${replayBriefInfo.getTurnIndex()}, ${replayBriefInfo.getExecutedActionsCount()}`
            : `??`,
        );
    }

    private async _updateLabelEndTime(): Promise<void> {
        const replayBriefInfo   = await this._getReplayInfo();
        this._labelEndTime.setText(replayBriefInfo
            ? Lang_Utils.getTimestampShortText(replayBriefInfo.getWarEndTime())
            : `??`,
        );
    }

    private async _getReplayInfo(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<ReplayInfo>> {
        const replayId = this.getOpenData()?.replayId;
        return replayId == null
            ? null
            : await ReplayWar_Model_RwModel.getReplayInfo(replayId);
    }
}
