import { getDict } from "../../gamePanels/Dict.ts";
import {
    closePanel,
    openPanel,
} from "../../gamePanels/Manager.ts";
import {
    getUserAvatar,
    getMedal,
} from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { UndefinedError } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import {
    getSelfUserId,
    getSelfNickname,
    getSelfAvatarId,
    getSelfShowMedalIdArray,
} from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _group!            : IUiContainer;

    private readonly _groupUserInfo!    : IUiContainer;
    private readonly _imgAvatar!        : IUiImage;
    private readonly _labelUserId!      : IUiLabel;

    private readonly _layoutNickname!   : IUiLayout;
    private readonly _imgMedal!         : IUiImage;
    private readonly _labelNickname!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogin,                callback: this._onMsgUserLogin },
            { type: TypeId.MsgUserLoginAsGuest,         callback: this._onMsgUserLoginAsGuest },
            { type: TypeId.MsgUserLogout,               callback: this._onMsgUserLogout },
            { type: TypeId.MsgUserSetNickname,          callback: this._onMsgUserSetNickname },
            { type: TypeId.MsgUserSetAvatarId,          callback: this._onNotifyMsgUserSetAvatarId },
            { type: TypeId.MsgUserSetShowMedalIdArray,  callback: this._onNotifyMsgUserSetShowMEdalIdArray },
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
        closePanel(getDict().UserOnlineUsersPanel);
        closePanel(getDict().ChatPanel);
        openPanel(getDict().UserPanel, {
            userId: getExisted(getSelfUserId()),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0, customY: -40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: -40 },
        });

        await wait();
    }

    private _updateView(): void {
        this._updateLabelNickname();
        this._updateImgAvatar();
        this._updateImgMedal();
        this._labelUserId.setText(`ID: ${getSelfUserId()}`);
    }

    private _updateLabelNickname(): void {
        this._labelNickname.setText(getSelfNickname() ?? UndefinedError);
        this._layoutNickname.arrangeItems();
    }

    private _updateImgAvatar(): void {
        this._imgAvatar.loadSource(getUserAvatar(getSelfAvatarId() ?? 1));
    }

    private async _updateImgMedal(): Promise<void> {
        const medalId   = getSelfShowMedalIdArray()[0];
        const img       = this._imgMedal;
        if (medalId == null) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            await img.loadSource(getMedal(medalId));
        }
        this._layoutNickname.arrangeItems();
    }
}
