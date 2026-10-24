import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type * as ProtoSchemaCommonProtoReplayReplayInfo from "../../proto/schema/CommonProto/Replay/ReplayInfo.ts";
import * as ReplayWarModelRwModel from "../model/RwModel.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export type OpenData = {
    replayId: number;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _labelMapNameTitle!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelWarTypeTitle!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarType!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelGlobalRatingTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelGlobalRating!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelMyRatingTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRating!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelTurnIndexTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurnIndex!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelEndTimeTitle!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEndTime!                 : UiInterfacesIUiLabel.IUiLabel;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "replayWar/RwReplayWarInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgReplayGetReplayInfo,  callback: this._onNotifyMsgReplayGetBriefInfo },
            { type: NotificationsTypeId.TypeId.MsgReplayGetSelfRating,  callback: this._onNotifyMsgReplayGetSelfRating },
        ]);
        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
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

    private _onNotifyMsgReplayGetBriefInfo(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoS.S;
        const replayId  = this.getOpenData()?.replayId;
        if ((replayId != null) && (replayId === data.getReplayId())) {
            this._updateComponentsForReplayBriefInfo();
        }
    }

    private _onNotifyMsgReplayGetSelfRating(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS.S;
        const replayId  = this.getOpenData()?.replayId;
        if ((replayId != null) && (replayId === data.getReplayId())) {
            this._updateLabelMyRating();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.setLangText(LangConstants.TextType.B0225);
        this._labelWarTypeTitle.setLangText(LangConstants.TextType.B0599);
        this._labelGlobalRatingTitle.setLangText(LangConstants.TextType.B0364);
        this._labelMyRatingTitle.setLangText(LangConstants.TextType.B0363);
        this._labelTurnIndexTitle.setLangText(LangConstants.TextType.B0600);
        this._labelEndTimeTitle.setLangText(LangConstants.TextType.EndTime);
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
        this._labelWarType.setText(replayBriefInfo ? LangUtils.getWarTypeName(HelpersMisc.getExisted(replayBriefInfo.getWarType())) ?? LangConstants.UndefinedError : `??`);
    }

    private async _updateLabelGlobalRating(): Promise<void> {
        const replayBriefInfo   = await this._getReplayInfo();
        const raters            = replayBriefInfo ? replayBriefInfo.getTotalRaters() : null;
        this._labelGlobalRating.setText(raters ? (HelpersMisc.getExisted(replayBriefInfo?.getTotalRating()) / raters).toFixed(2) : LangUtils.getText(LangConstants.TextType.None));
    }

    private async _updateLabelMyRating(): Promise<void> {
        const replayId  = this.getOpenData()?.replayId;
        const rating    = replayId == null ? null : await ReplayWarModelRwModel.getReplaySelfRating(replayId);
        this._labelMyRating.setText(rating == null ? LangUtils.getText(LangConstants.TextType.None) : `${rating}`);
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = (await this._getReplayInfo())?.getNormalMapId();
        this._labelMapName.setText(normalMapId == null
            ? `----`
            : (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? LangConstants.UndefinedError
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
            ? LangUtils.getTimestampShortText(HelpersMisc.getExisted(replayBriefInfo.getWarEndTime()))
            : `??`
        );
    }

    private async _getReplayInfo(): Promise<Undefinable<ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo>> {
        const replayId = this.getOpenData()?.replayId;
        return replayId == null
            ? null
            : await ReplayWarModelRwModel.getReplayInfo(replayId);
    }
}
