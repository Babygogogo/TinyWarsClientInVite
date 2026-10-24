import * as DialoguesConstants from "../../dialogues/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaBigDialogueSimple from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    gameConfig  : GameConfigGcData.GcData;
    action      : ProtoSchemaCommonProtoWarEventWeaBigDialogueSimple.WeaBigDialogueSimple;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listBackground!   : UiInterfacesIUiScrollList.IUiScrollList<DataForBackgroundRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
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

        const maxId     = DialoguesConstants.Common.BackgroundMaxId;
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

interface DataForBackgroundRenderer extends UiTypesUiListItemData.UiListItemData {
    backgroundId            : number;
    action                  : ProtoSchemaCommonProtoWarEventWeaBigDialogueSimple.WeaBigDialogueSimple;
    panel                   : Panel;
}
class BackgroundRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForBackgroundRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgTarget!    : UiInterfacesIUiImage.IUiImage;
    private readonly _groupSelect!  : UiInterfacesIUiContainer.IUiContainer;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupSelect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel = openData.panel;
        openData.action.setBackgroundId(openData.backgroundId);
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonConfirm01);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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

        this._imgTarget.loadSource(HelpersImageSource.getBigDialogueBackgroundImage(backgroundId));
    }
}
