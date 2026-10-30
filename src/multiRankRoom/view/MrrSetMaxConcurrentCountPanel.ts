import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    PointerEventType,
    type PointerUnifiedEventData,
} from "../../helpers/PointerInput.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { Common as MultiRankedWarsCommon } from "../../multiRankedWars/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import {
    getAdditionalMaxDifferenceInScore,
    getMaxConcurrentCount,
} from "../model/MrrModel.ts";
import { reqMrrSetMaxConcurrentCount } from "../model/MrrProxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnHelp!                      : IUiButton;
    private readonly _btnCancel!                    : IUiButton;
    private readonly _btnConfirm!                   : IUiButton;

    private readonly _layoutContent!                : IUiLayout;

    private readonly _layoutStd!                    : IUiLayout;
    private readonly _labelStdTitle!                : IUiLabel;
    private readonly _groupStd!                     : IUiContainer;
    private readonly _imgStdBar!                    : IUiImage;
    private readonly _imgStdPoint!                  : IUiImage;
    private readonly _layoutStdCount!               : IUiLayout;
    private readonly _labelStdCount!                : IUiLabel;
    private readonly _labelStdMaxCount!             : IUiLabel;
    private readonly _groupStdIncreaseOffsetScore!  : IUiLayout;
    private readonly _labelStdIncreaseOffsetScore!  : IUiLabel;
    private readonly _imgStdIncreaseOffsetScore!    : IUiImage;

    private readonly _layoutFog!                    : IUiLayout;
    private readonly _labelFogTitle!                : IUiLabel;
    private readonly _groupFog!                     : IUiContainer;
    private readonly _imgFogBar!                    : IUiImage;
    private readonly _imgFogPoint!                  : IUiImage;
    private readonly _layoutFogCount!               : IUiLayout;
    private readonly _labelFogCount!                : IUiLabel;
    private readonly _labelFogMaxCount!             : IUiLabel;
    private readonly _groupFogIncreaseOffsetScore!  : IUiLayout;
    private readonly _labelFogIncreaseOffsetScore!  : IUiLabel;
    private readonly _imgFogIncreaseOffsetScore!    : IUiImage;

    private _selectedCountForStd?                   : number;
    private _selectedCountForFog?                   : number;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged,                callback : this._onNotifyLanguageChanged },
            { type : TypeId.MsgMrrGetMaxConcurrentCount,    callback : this._onMsgMrrGetMaxConcurrentCount },
            { type : TypeId.MsgMrrSetMaxConcurrentCount,    callback : this._onMsgMrrSetMaxConcurrentCount },
        ]);
        this._setUiListenerArray([
            { ui : this._groupStd,                       callback : this._onTouchedGroupStd },
            { ui : this._groupStd,                       callback : this._onTouchMoveGroupStd,                    eventType : PointerEventType.PressMove },
            { ui : this._groupStd,                       callback : this._onTouchEndGroupStd,                     eventType : PointerEventType.ReleaseIn },
            { ui : this._groupStd,                       callback : this._onTouchReleaseOutsideGroupStd,          eventType : PointerEventType.ReleaseOut },
            { ui : this._groupStdIncreaseOffsetScore,    callback : this._onTouchedGroupStdIncreaseOffsetScore },

            { ui : this._groupFog,                       callback : this._onTouchedGroupFog },
            { ui : this._groupFog,                       callback : this._onTouchMoveGroupFog,                    eventType : PointerEventType.PressMove },
            { ui : this._groupFog,                       callback : this._onTouchEndGroupFog,                     eventType : PointerEventType.ReleaseIn },
            { ui : this._groupFog,                       callback : this._onTouchReleaseOutsideGroupFog,          eventType : PointerEventType.ReleaseOut },
            { ui : this._groupFogIncreaseOffsetScore,    callback : this._onTouchedGroupFogIncreaseOffsetScore },

            { ui : this._btnCancel,      callback : this.closePanel },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
            { ui : this._btnHelp,        callback : this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._labelStdMaxCount.setText(` / ${MultiRankedWarsCommon.MaxConcurrentCount}`);
        this._labelFogMaxCount.setText(` / ${MultiRankedWarsCommon.MaxConcurrentCount}`);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._loadMaxCountAndUpdateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgMrrGetMaxConcurrentCount(): void {
        this._loadMaxCountAndUpdateView();
    }
    private _onMsgMrrSetMaxConcurrentCount(): void {
        this._loadMaxCountAndUpdateView();
    }

    private _onTouchedGroupStd(e: Event): void {
        const group                 = this._groupStd;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForStd           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWarsCommon.MaxConcurrentCount - MultiRankedWarsCommon.MinConcurrentCount)) + MultiRankedWarsCommon.MinConcurrentCount;
        this._selectedCountForStd   = countForStd;
        this._updateGroupStd();

        this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, MultiRankedWarsCommon.MaxConcurrentCount - countForStd);
        this._updateGroupFog();
    }
    private _onTouchMoveGroupStd(e: Event): void {
        const group                 = this._groupStd;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForStd           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWarsCommon.MaxConcurrentCount - MultiRankedWarsCommon.MinConcurrentCount)) + MultiRankedWarsCommon.MinConcurrentCount;
        this._selectedCountForStd   = countForStd;
        this._updateGroupStd();

        this._selectedCountForFog   = Math.min(this._selectedCountForFog ?? 0, MultiRankedWarsCommon.MaxConcurrentCount - countForStd);
        this._updateGroupFog();
    }
    private _onTouchEndGroupStd(): void {
        // nothing to do
    }
    private _onTouchReleaseOutsideGroupStd(): void {
        // nothing to do
    }
    private _onTouchedGroupStdIncreaseOffsetScore(): void {
        const img = this._imgStdIncreaseOffsetScore;
        img.setIsVisible(!img.getIsVisible());
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupFog(e: Event): void {
        const group                 = this._groupFog;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForFog           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWarsCommon.MaxConcurrentCount - MultiRankedWarsCommon.MinConcurrentCount)) + MultiRankedWarsCommon.MinConcurrentCount;
        this._selectedCountForFog   = countForFog;
        this._updateGroupFog();

        this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, MultiRankedWarsCommon.MaxConcurrentCount - countForFog);
        this._updateGroupStd();
    }
    private _onTouchMoveGroupFog(e: Event): void {
        const group                 = this._groupFog;
        const width                 = group.getUnscaledWidth();
        const data                  = e.data as PointerUnifiedEventData;
        const point                 = group.globalToLocal(data.stageX, data.stageY);
        const countForFog           = Math.round(Math.max(0, Math.min(point.x, width)) / width * (MultiRankedWarsCommon.MaxConcurrentCount - MultiRankedWarsCommon.MinConcurrentCount)) + MultiRankedWarsCommon.MinConcurrentCount;
        this._selectedCountForFog   = countForFog;
        this._updateGroupFog();

        this._selectedCountForStd   = Math.min(this._selectedCountForStd ?? 0, MultiRankedWarsCommon.MaxConcurrentCount - countForFog);
        this._updateGroupStd();
    }
    private _onTouchEndGroupFog(): void {
        // nothing to do
    }
    private _onTouchReleaseOutsideGroupFog(): void {
        // nothing to do
    }
    private _onTouchedGroupFogIncreaseOffsetScore(): void {
        const img = this._imgFogIncreaseOffsetScore;
        img.setIsVisible(!img.getIsVisible());
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnConfirm(): void {
        reqMrrSetMaxConcurrentCount({
            maxCountForStd                       : getExisted(this._selectedCountForStd),
            maxCountForFog                       : getExisted(this._selectedCountForFog),
            additionalMaxDifferenceInScoreForStd : this._imgStdIncreaseOffsetScore.getIsVisible() ? MultiRankedWarsCommon.MaxAdditionalOffsetScoreForMatching: 0,
            additionalMaxDifferenceInScoreForFog : this._imgFogIncreaseOffsetScore.getIsVisible() ? MultiRankedWarsCommon.MaxAdditionalOffsetScoreForMatching: 0,
        });

        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0132),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _loadMaxCountAndUpdateView(): void {
        this._selectedCountForStd   = getMaxConcurrentCount(false);
        this._selectedCountForFog   = getMaxConcurrentCount(true);
        this._imgStdIncreaseOffsetScore.setIsVisible(getAdditionalMaxDifferenceInScore(false) > 0);
        this._imgFogIncreaseOffsetScore.setIsVisible(getAdditionalMaxDifferenceInScore(true) > 0);
        this._updateGroupStd();
        this._updateGroupFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
        this._labelTitle.setLangText(TextType.B0413);
        this._labelStdTitle.setLangText(TextType.B0548);
        this._labelFogTitle.setLangText(TextType.B0549);
        this._labelStdIncreaseOffsetScore.setLangText(TextType.B1363);
        this._labelFogIncreaseOffsetScore.setLangText(TextType.B1363);

        this._layoutStdCount.arrangeItems();
        this._groupStdIncreaseOffsetScore.arrangeItems();
        this._layoutStd.arrangeItems();
        this._layoutFogCount.arrangeItems();
        this._groupFogIncreaseOffsetScore.arrangeItems();
        this._layoutFog.arrangeItems();
        this._layoutContent.arrangeItems();
    }

    private _updateGroupStd(): void {
        const count = getExisted(this._selectedCountForStd);
        const pos   = this._groupStd.getUnscaledWidth() * (count - MultiRankedWarsCommon.MinConcurrentCount) / (MultiRankedWarsCommon.MaxConcurrentCount - MultiRankedWarsCommon.MinConcurrentCount);
        this._imgStdPoint.setX(pos);
        this._imgStdBar.setUnscaledManualWidth(pos);
        this._labelStdCount.setText(`${count}`);
        this._layoutStdCount.arrangeItems();
    }
    private _updateGroupFog(): void {
        const count = getExisted(this._selectedCountForFog);
        const pos   = this._groupFog.getUnscaledWidth() * (count - MultiRankedWarsCommon.MinConcurrentCount) / (MultiRankedWarsCommon.MaxConcurrentCount - MultiRankedWarsCommon.MinConcurrentCount);
        this._imgFogPoint.setX(pos);
        this._imgFogBar.setUnscaledManualWidth(pos);
        this._labelFogCount.setText(`${count}`);
        this._layoutFogCount.arrangeItems();
    }
}
