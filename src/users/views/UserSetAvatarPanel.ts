import * as AvatarsUtils from "../../avatars/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _sclAvatar!        : UiInterfacesIUiScrollList.IUiScrollList<DataForAvatarRenderer>;
    private readonly _imgAvatar!        : UiInterfacesIUiImage.IUiImage;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private _gameConfig : GameConfigGcData.GcData | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._sclAvatar.setItemRendererClass(AvatarRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._gameConfig = await GameConfigGcModel.getLatestGameConfig();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._sclAvatar.removeAllItems();

        await super._onClosed();
    }

    public updateOnSetSelectedAvatar(): void {
        this._updateImgAvatar();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnConfirm(): void {
        const avatarId = this._sclAvatar.getFirstSelectedData()?.avatarId;
        if ((avatarId != null) && (avatarId !== UsersModel.getSelfAvatarId())) {
            UsersProxy.reqSetAvatarId(avatarId);
        }
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateImgAvatar();
        this._updateSclAvatar();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0707));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
    }

    private _updateImgAvatar(): void {
        this._imgAvatar.loadSource(HelpersImageSource.getUserAvatar(this._sclAvatar.getFirstSelectedData()?.avatarId ?? UsersModel.getSelfAvatarId() ?? 1));
    }
    private async _updateSclAvatar(): Promise<void> {
        const dataArray: DataForAvatarRenderer[] = [];
        for (const avatarId of AvatarsUtils.getAvailableUserAvatarIdArray()) {
            dataArray.push({
                avatarId,
                panel   : this,
            });
        }

        const selfAvatarId  = UsersModel.getSelfAvatarId() ?? 1;
        const list          = this._sclAvatar;
        await list.bindData(dataArray);

        const index = Math.max(0, dataArray.findIndex(v => v.avatarId === selfAvatarId));
        list.setSelectedItemIndex(index);
        list.scrollToItem(index);
    }
}

interface DataForAvatarRenderer extends UiTypesUiListItemData.UiListItemData {
    avatarId    : number;
    panel       : Panel;
}
class AvatarRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForAvatarRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForAvatarRenderer>
{
    private readonly _imgAvatar!    : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgAvatar.loadSource(HelpersImageSource.getUserAvatar(openData.avatarId));
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSetSelectedAvatar();
    }
}
