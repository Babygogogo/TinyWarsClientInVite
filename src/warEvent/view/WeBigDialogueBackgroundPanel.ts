import { Common } from "../../dialogues/Constants.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getBigDialogueBackgroundImage } from "../../helpers/ImageSource.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WeaBigDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    gameConfig  : GcData;
    action      : WeaBigDialogueSimple;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _listBackground!   : IUiScrollList<DataForBackgroundRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.ActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listBackground.setItemRendererClass(BackgroundRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listBackground.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyBwPlannerStateChanged(): void {
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const backgroundId  = this.getOpenData()?.action.getBackgroundId();
        const list          = this._listBackground;
        const dataArray     = this._createDataForList();
        await list.bindData(dataArray);
        list.setSelectedItemIndex(Math.max(0, dataArray.findIndex(v => v.backgroundId === backgroundId)));
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }

    private _createDataForList(): DataForBackgroundRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const maxId     = Common.BackgroundMaxId;
        const dataArray : DataForBackgroundRenderer[] = [];
        const action    = openData.action;
        for (let backgroundId = 0; backgroundId <= maxId; ++backgroundId) {
            dataArray.push({
                backgroundId    : backgroundId,
                action          : action,
                panel           : this,
            });
        }

        return dataArray;
    }
}

interface DataForBackgroundRenderer extends UiListItemData {
    backgroundId            : number;
    action                  : WeaBigDialogueSimple;
    panel                   : Panel;
}
class BackgroundRenderer extends UiListItemRenderer<DataForBackgroundRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _imgBg!        : IUiImage;
    private readonly _imgTarget!    : IUiImage;
    private readonly _groupSelect!  : IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._imgBg,                      callback: this._onTouchedImgBg },
            { ui: this._groupSelect,                callback: this._onTouchedGroupSelect },
        ]);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgBg(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupSelect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel = openData.panel;
        openData.action.setBackgroundId(openData.backgroundId);
        playShortSfx(ShortSfxCode.ButtonConfirm01);
        dispatch(TypeId.WarEventFullDataChanged);
        panel.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const backgroundId = this.getOpenData()?.backgroundId;
        if (backgroundId == null) {
            return;
        }

        this._imgTarget.loadSource(getBigDialogueBackgroundImage(backgroundId));
    }
}
