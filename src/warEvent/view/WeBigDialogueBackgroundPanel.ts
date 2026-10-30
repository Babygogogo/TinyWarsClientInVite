import {
    Dialogues_Constants,
    Notifications_Dispatcher,
    Helpers_ImageSource,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { WeaBigDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";

export interface OpenData {
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    action      : WeaBigDialogueSimple;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listBackground!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForBackgroundRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.ActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
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

        const maxId     = Dialogues_Constants.Common.BackgroundMaxId;
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

interface DataForBackgroundRenderer extends Ui_Types_UiListItemData.UiListItemData {
    backgroundId            : number;
    action                  : WeaBigDialogueSimple;
    panel                   : Panel;
}
class BackgroundRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForBackgroundRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgTarget!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupSelect!  : Ui_Interfaces_IUiContainer.IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupSelect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel = openData.panel;
        openData.action.setBackgroundId(openData.backgroundId);
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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

        this._imgTarget.loadSource(Helpers_ImageSource.getBigDialogueBackgroundImage(backgroundId));
    }
}
