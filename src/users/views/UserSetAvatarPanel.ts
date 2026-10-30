import {
    Avatars_Utils,
    GameConfigs_Provider,
    Users_Model,
    Helpers_ImageSource,
    Users_Proxy,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _sclAvatar!        : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForAvatarRenderer>;
    private readonly _imgAvatar!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private _gameConfig : GameConfigs_GameConfig.GameConfig | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
        this._gameConfig = await GameConfigs_Provider.getLatestGameConfig();
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
        if ((avatarId != null) && (avatarId !== Users_Model.getSelfAvatarId())) {
            Users_Proxy.reqSetAvatarId(avatarId);
        }
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateImgAvatar();
        this._updateSclAvatar();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0707);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
    }

    private _updateImgAvatar(): void {
        this._imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(this._sclAvatar.getFirstSelectedData()?.avatarId ?? Users_Model.getSelfAvatarId() ?? 1));
    }
    private async _updateSclAvatar(): Promise<void> {
        const dataArray: DataForAvatarRenderer[] = [];
        for (const avatarId of Avatars_Utils.getAvailableUserAvatarIdArray()) {
            dataArray.push({
                avatarId,
                panel   : this,
            });
        }

        const selfAvatarId  = Users_Model.getSelfAvatarId() ?? 1;
        const list          = this._sclAvatar;
        await list.bindData(dataArray);

        const index = Math.max(0, dataArray.findIndex(v => v.avatarId === selfAvatarId));
        list.setSelectedItemIndex(index);
        list.scrollToItem(index);
    }
}

interface DataForAvatarRenderer extends Ui_Types_UiListItemData.UiListItemData {
    avatarId    : number;
    panel       : Panel;
}
class AvatarRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForAvatarRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForAvatarRenderer>
{
    private readonly _imgAvatar!    : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(openData.avatarId));
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSetSelectedAvatar();
    }
}
