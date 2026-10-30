import {
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Helpers_Misc,
    Helpers_ImageSource,
    Users_Model,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Lang_Constants,
    Timer_TimerModel,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupUserInfo!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgAvatar!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelUserId!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutNickname!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgMedal!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelNickname!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserLogin,                callback : this._onMsgUserLogin },
            { type : Notifications_TypeId.TypeId.MsgUserLoginAsGuest,         callback : this._onMsgUserLoginAsGuest },
            { type : Notifications_TypeId.TypeId.MsgUserLogout,               callback : this._onMsgUserLogout },
            { type : Notifications_TypeId.TypeId.MsgUserSetNickname,          callback : this._onMsgUserSetNickname },
            { type : Notifications_TypeId.TypeId.MsgUserSetAvatarId,          callback : this._onNotifyMsgUserSetAvatarId },
            { type : Notifications_TypeId.TypeId.MsgUserSetShowMedalIdArray,  callback : this._onNotifyMsgUserSetShowMEdalIdArray },
        ]);
        this._setUiListenerArray([
            { ui : this._groupUserInfo,  callback : this._onTouchedGroupUserInfo },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onMsgUserLogin(): void {
        this._updateView();
    }
    private _onMsgUserLoginAsGuest(): void {
        this._updateView();
    }

    private _onMsgUserLogout(): void {
        this.closePanel();
    }

    private _onMsgUserSetNickname(): void {
        this._updateLabelNickname();
    }

    private _onNotifyMsgUserSetAvatarId(): void {
        this._updateImgAvatar();
    }

    private _onNotifyMsgUserSetShowMEdalIdArray(): void {
        this._updateImgMedal();
    }

    private _onNotifyLanguageChanged(): void {
        // nothing to do
    }

    private _onTouchedGroupUserInfo(): void {
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().UserOnlineUsersPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().ChatPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, {
            userId : Helpers_Misc.getExisted(Users_Model.getSelfUserId()),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._group,
            beginProps : { customAlpha : 0, customY : -40 },
            endProps   : { customAlpha : 1, customY : 0 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._group,
            beginProps : { customAlpha : 1, customY : 0 },
            endProps   : { customAlpha : 0, customY : -40 },
        });

        await Timer_TimerModel.wait();
    }

    private _updateView(): void {
        this._updateLabelNickname();
        this._updateImgAvatar();
        this._updateImgMedal();
        this._labelUserId.setText(`ID: ${Users_Model.getSelfUserId()}`);
    }

    private _updateLabelNickname(): void {
        this._labelNickname.setText(Users_Model.getSelfNickname() ?? Lang_Constants.UndefinedError);
        this._layoutNickname.arrangeItems();
    }

    private _updateImgAvatar(): void {
        this._imgAvatar.loadSource(Helpers_ImageSource.getUserAvatar(Users_Model.getSelfAvatarId() ?? 1));
    }

    private async _updateImgMedal(): Promise<void> {
        const medalId   = Users_Model.getSelfShowMedalIdArray()[0];
        const img       = this._imgMedal;
        if (medalId == null) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            await img.loadSource(Helpers_ImageSource.getMedal(medalId));
        }
        this._layoutNickname.arrangeItems();
    }
}
