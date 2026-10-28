import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getWarTypeName, getText, getTimestampShortText } from "../../lang/Utils.ts";
import { getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS,
} from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type { ReplayInfo } from "../../proto/schema/CommonProto/Replay/ReplayInfo.ts";
import { getReplaySelfRating, getReplayInfo } from "../model/RwModel.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export type OpenData = {
    replayId: number;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _labelMapNameTitle!            : IUiLabel;
    private readonly _labelMapName!                 : IUiLabel;

    private readonly _labelWarTypeTitle!            : IUiLabel;
    private readonly _labelWarType!                 : IUiLabel;

    private readonly _labelGlobalRatingTitle!       : IUiLabel;
    private readonly _labelGlobalRating!            : IUiLabel;

    private readonly _labelMyRatingTitle!           : IUiLabel;
    private readonly _labelMyRating!                : IUiLabel;

    private readonly _labelTurnIndexTitle!          : IUiLabel;
    private readonly _labelTurnIndex!               : IUiLabel;

    private readonly _labelEndTimeTitle!            : IUiLabel;
    private readonly _labelEndTime!                 : IUiLabel;

    public constructor() {
        super();

        loadSkinByPath(this, "replayWar/RwReplayWarInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgReplayGetReplayInfo,  callback: this._onNotifyMsgReplayGetBriefInfo },
            { type: TypeId.MsgReplayGetSelfRating,  callback: this._onNotifyMsgReplayGetSelfRating },
        ]);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
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

    private _onNotifyMsgReplayGetBriefInfo(e: Event): void {
        const data      = e.data as S;
        const replayId  = this.getOpenData()?.replayId;
        if ((replayId != null) && (replayId === data.getReplayId())) {
            this._updateComponentsForReplayBriefInfo();
        }
    }

    private _onNotifyMsgReplayGetSelfRating(e: Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS;
        const replayId  = this.getOpenData()?.replayId;
        if ((replayId != null) && (replayId === data.getReplayId())) {
            this._updateLabelMyRating();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.setLangText(TextType.B0225);
        this._labelWarTypeTitle.setLangText(TextType.B0599);
        this._labelGlobalRatingTitle.setLangText(TextType.B0364);
        this._labelMyRatingTitle.setLangText(TextType.B0363);
        this._labelTurnIndexTitle.setLangText(TextType.B0600);
        this._labelEndTimeTitle.setLangText(TextType.EndTime);
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
        this._labelWarType.setText(replayBriefInfo ? getWarTypeName(replayBriefInfo.getWarType()) ?? UndefinedError : `??`);
    }

    private async _updateLabelGlobalRating(): Promise<void> {
        const replayBriefInfo   = await this._getReplayInfo();
        const raters            = replayBriefInfo ? replayBriefInfo.getTotalRaters() : null;
        this._labelGlobalRating.setText(raters ? (getExisted(replayBriefInfo?.getTotalRating()) / raters).toFixed(2) : getText(TextType.None));
    }

    private async _updateLabelMyRating(): Promise<void> {
        const replayId  = this.getOpenData()?.replayId;
        const rating    = replayId == null ? null : await getReplaySelfRating(replayId);
        this._labelMyRating.setText(rating == null ? getText(TextType.None) : `${rating}`);
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = (await this._getReplayInfo())?.getNormalMapId();
        this._labelMapName.setText(normalMapId == null
            ? `----`
            : (await getMapNameInCurrentLanguage(normalMapId)) ?? UndefinedError
        );
    }

    private async _updateLabelTurnIndex(): Promise<void> {
        const replayBriefInfo = await this._getReplayInfo();
        this._labelTurnIndex.setText(replayBriefInfo
            ? `${replayBriefInfo.getTurnIndex()}, ${replayBriefInfo.getExecutedActionsCount()}`
            : `??`
        );
    }

    private async _updateLabelEndTime(): Promise<void> {
        const replayBriefInfo   = await this._getReplayInfo();
        this._labelEndTime.setText(replayBriefInfo
            ? getTimestampShortText(replayBriefInfo.getWarEndTime())
            : `??`
        );
    }

    private async _getReplayInfo(): Promise<Undefinable<ReplayInfo>> {
        const replayId = this.getOpenData()?.replayId;
        return replayId == null
            ? null
            : await getReplayInfo(replayId);
    }
}
