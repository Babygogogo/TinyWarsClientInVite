import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { showLang } from "../../FloatText.ts";
import { getOriginSkinIdArray, getRevisedOverridingSkinIdArray, getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { getMpwWarClass, getHrwWarClass, getRwWarClass, getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getSkinCircle } from "../../helpers/ImageSource.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { setMpwOverridingSkinIdArray, setRwOverridingSkinIdArray } from "../../localData/Storage.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war         : IBwWar;
    callback?   : (overridingSkinIdArray: number[] | undefined) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnClose!         : IUiButton;

    private readonly _labelOrigin!      : IUiLabel;
    private readonly _labelTarget!      : IUiLabel;
    private readonly _listSkin!         : IUiScrollList<DataForSkinRenderer>;

    private readonly _btnConfirm!       : IUiButton;
    private readonly _btnReset!         : IUiButton;

    private _targetSkinIdArray          : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,           callback: this.closePanel },

            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnReset,           callback: this._onTouchedBtnReset },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSkin.setItemRendererClass(SkinRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._resetTargetSkinIdArray();
        this._updateListSkin();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSkin.removeAllItems();

        await super._onClosed();
    }

    public getTargetSkinId(playerIndex: number): number | undefined {
        return this._targetSkinIdArray[playerIndex - 1];
    }
    public setTargetSkinId(playerIndex: number, skinId: number): void {
        this._targetSkinIdArray[playerIndex - 1] = skinId;
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0951),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war.getActionPlanner().checkIsStateRequesting()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const rawArray      = this._targetSkinIdArray;
        const revisedArray  = checkIsSame(getOriginSkinIdArray(openData.war, false), rawArray) ? undefined : rawArray;
        this._checkAnsSaveTargetSkinIdArray(revisedArray);

        war.getTileMap().forEachTile(t => t.flushDataToView());
        dispatch(TypeId.BwOverridingSkinIdChanged);

        openData.callback?.(revisedArray);
        this.closePanel();
    }
    private _onTouchedBtnReset(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        // this._resetTargetSkinIdArray();

        this._targetSkinIdArray = getOriginSkinIdArray(openData.war, false);
        this._updateListSkin();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0609);
        this._labelOrigin.setLangText(TextType.B0543);
        this._labelTarget.setLangText(TextType.B1388);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnReset.setLangText(TextType.B0543);
    }

    private async _updateListSkin(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const originSkinIdArray = getOriginSkinIdArray(openData.war, false);
        const length            = originSkinIdArray.length;
        const dataArray         : DataForSkinRenderer[] = [];
        for (let i = 0; i < length; ++i) {
            dataArray.push({
                playerIndex     : i + 1,
                originSkinId    : originSkinIdArray[i],
                showSeparator   : i < length - 1,
                panel           : this,
            });
        }

        this._group.setUnscaledManualWidth(Math.max(300, length * 50 + 70));
        await this._listSkin.bindData(dataArray);
    }

    private _resetTargetSkinIdArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            this._targetSkinIdArray = [];
            return;
        }

        this._targetSkinIdArray = getRevisedOverridingSkinIdArray(openData.war);
    }
    private _checkAnsSaveTargetSkinIdArray(arr: number[] | undefined): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war instanceof getMpwWarClass()) {
            const warId = war.getWarId();
            if (warId != null) {
                setMpwOverridingSkinIdArray(warId, arr);
            }
            return;
        }

        if (war instanceof getHrwWarClass()) {
            const warId = war.getWarId();
            if (warId != null) {
                setMpwOverridingSkinIdArray(warId, arr);
            }
            return;
        }

        if (war instanceof getRwWarClass()) {
            const replayId = war.getReplayId();
            if (replayId != null) {
                setRwOverridingSkinIdArray(replayId, arr);
            }
            return;
        }

        if (war instanceof getSpwWarClass()) {
            const extraData = war.getSaveSlotExtraData();
            if (extraData != null) {
                extraData.setOverridingSkinIdArray(arr ?? []);
            } else {
                war.setSaveSlotExtraData(SpmWarSaveSlotExtraData.fromJson({
                    overridingSkinIdArray   : arr ?? [],
                }));
            }
            return;
        }
    }
}

interface DataForSkinRenderer extends UiListItemData {
    playerIndex     : number;
    originSkinId    : number;
    showSeparator   : boolean;
    panel           : Panel;
}
class SkinRenderer
    extends     UiListItemRenderer<DataForSkinRenderer>
    implements  IUiListItemRenderer<DataForSkinRenderer>
{
    private readonly _labelPlayerIndex! : IUiLabel;
    private readonly _imgSrcSkin!       : IUiImage;
    private readonly _imgDstSkin!       : IUiImage;
    private readonly _imgSeparator!     : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = openData.playerIndex;
        const panel         = openData.panel;
        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray    : getAllSkinIdArray(false),
            currentSkinId           : panel.getTargetSkinId(playerIndex) ?? openData.originSkinId,
            callback                : skinId => {
                panel.setTargetSkinId(playerIndex, skinId);
                this._updateView();
            }
        });
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = openData.playerIndex;
        const originSkinId  = openData.originSkinId;
        this._labelPlayerIndex.setText(`P${playerIndex}`);
        this._imgSrcSkin.loadSource(getSkinCircle(openData.originSkinId, true));
        this._imgDstSkin.loadSource(getSkinCircle(openData.panel.getTargetSkinId(playerIndex) ?? originSkinId, true));
        this._imgSeparator.setIsVisible(openData.showSeparator);
    }
}

function checkIsSame(originSkinIdArray: number[], targetSkinIdArray: number[]): boolean {
    for (let i = 0; i < targetSkinIdArray.length; ++i) {
        if (targetSkinIdArray[i] !== originSkinIdArray[i]) {
            return false;
        }
    }

    return true;
}
