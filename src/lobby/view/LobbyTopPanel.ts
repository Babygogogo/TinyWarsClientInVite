import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupUserInfo!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgAvatar!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelUserId!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutNickname!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgMedal!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelNickname!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogin,                callback: this._onMsgUserLogin },
            { type: NotificationsTypeId.TypeId.MsgUserLoginAsGuest,         callback: this._onMsgUserLoginAsGuest },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,               callback: this._onMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgUserSetNickname,          callback: this._onMsgUserSetNickname },
            { type: NotificationsTypeId.TypeId.MsgUserSetAvatarId,          callback: this._onNotifyMsgUserSetAvatarId },
            { type: NotificationsTypeId.TypeId.MsgUserSetShowMedalIdArray,  callback: this._onNotifyMsgUserSetShowMEdalIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._groupUserInfo,  callback: this._onTouchedGroupUserInfo },
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
        GamePanelsManager.closePanel(GamePanelsDict.getDict().UserOnlineUsersPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().ChatPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, {
            userId: HelpersMisc.getExisted(UsersModel.getSelfUserId()),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0, customY: -40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });

        await TimerTimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: -40 },
        });

        await TimerTimerModel.wait();
    }

    private _updateView(): void {
        this._updateLabelNickname();
        this._updateImgAvatar();
        this._updateImgMedal();
        this._labelUserId.setText(`ID: ${UsersModel.getSelfUserId()}`);
    }

    private _updateLabelNickname(): void {
        this._labelNickname.setText(UsersModel.getSelfNickname() ?? LangConstants.UndefinedError);
        this._layoutNickname.arrangeItems();
    }

    private _updateImgAvatar(): void {
        this._imgAvatar.loadSource(HelpersImageSource.getUserAvatar(UsersModel.getSelfAvatarId() ?? 1));
    }

    private async _updateImgMedal(): Promise<void> {
        const medalId   = UsersModel.getSelfShowMedalIdArray()[0];
        const img       = this._imgMedal;
        if (medalId == null) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            await img.loadSource(HelpersImageSource.getMedal(medalId));
        }
        this._layoutNickname.arrangeItems();
    }
}
