import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { checkHasUnreadMessage } from "../../chat/Model.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel, getRunningPanel } from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { getIsGameHidden } from "../../helpers/Compatibility.ts";
import { gotoMyWarListPanel } from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getSecondaryLanguageType, getGameVersionName } from "../../lang/Utils.ts";
import { checkIsRedForStartButton } from "../model/LobbyModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getServerTimestamp, wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupBottom!      : IUiContainer;
    private readonly _groupContainer!   : IUiContainer;

    // private readonly _groupStart!       : Ui.Interfaces.IUiContainer;
    private readonly _btnStart!         : IUiButton;
    private readonly _imgStart!         : IUiImage;

    private readonly _groupVersion!     : IUiContainer;
    private readonly _labelVersion!     : IUiLabel;

    private readonly _groupProfile!     : IUiContainer;
    private readonly _layoutProfile!    : IUiLayout;
    private readonly _labelProfile1!    : IUiLabel;
    private readonly _labelProfile2!    : IUiLabel;

    private readonly _groupChat!        : IUiContainer;
    private readonly _layoutChat!       : IUiLayout;
    private readonly _labelChat1!       : IUiLabel;
    private readonly _labelChat2!       : IUiLabel;
    private readonly _imgChatRed!       : IUiImage;

    private readonly _groupMapEditor!   : IUiContainer;
    private readonly _layoutMapEditor!  : IUiLayout;
    private readonly _labelMapEditor1!  : IUiLabel;
    private readonly _labelMapEditor2!  : IUiLabel;

    private readonly _groupGameChart!   : IUiContainer;
    private readonly _layoutGameChart!  : IUiLayout;
    private readonly _labelGameChart1!  : IUiLabel;
    private readonly _labelGameChart2!  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnStart,           callback: this._onTouchedBtnStart },
            { ui: this._groupProfile,       callback: this._onTouchedGroupProfile },
            { ui: this._groupChat,          callback: this._onTouchedGroupChat },
            { ui: this._groupMapEditor,     callback: this._onTouchedGroupMapEditor },
            { ui: this._groupGameChart,     callback: this._onTouchedGroupGameChart },
            { ui: this._groupVersion,       callback: this._onTouchedGroupVersion },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.TimeTick,                        callback: this._onNotifyTimeTick },
            { type: TypeId.MsgUserLogout,                   callback: this._onMsgUserLogout },
            { type: TypeId.MsgChatGetAllReadProgressList,   callback: this._onMsgChatGetAllReadProgressList },
            { type: TypeId.MsgChatUpdateReadProgress,       callback: this._onMsgChatUpdateReadProgress },
            { type: TypeId.MsgChatGetAllMessages,           callback: this._onMsgChatGetAllMessages },
            { type: TypeId.MsgChatAddMessage,               callback: this._onMsgChatAddMessages },
        ]);

        applyTouchEnabled(this._groupProfile);
        applyTouchEnabled(this._groupChat);
        applyTouchEnabled(this._groupMapEditor);
        applyTouchEnabled(this._groupGameChart);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgStart = this._imgStart;
        imgStart.setAlpha(0);
        Executor.removeTweens(imgStart);
        Executor.get(imgStart, { loop: true })
            .to({ customAlpha: 0.8 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateImgStart();
        this._updateBtnChat();
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgStart);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        const languageType2 = getSecondaryLanguageType();
        this._labelProfile1.setLangText(TextType.B1375);
        this._labelProfile2.setLangText(TextType.B1375, languageType2);
        this._labelChat1.setLangText(TextType.B1376);
        this._labelChat2.setLangText(TextType.B1376, languageType2);
        this._labelMapEditor1.setLangText(TextType.B1377);
        this._labelMapEditor2.setLangText(TextType.B1377, languageType2);
        this._labelGameChart1.setLangText(TextType.B0900);
        this._labelGameChart2.setLangText(TextType.B0900, languageType2);
        this._labelVersion.setText(getGameVersionName(window.GAME_VERSION) ?? UndefinedError);

        this._imgChatRed.setX(this._layoutChat.getX() + this._labelChat1.getScaledWidth());

        this._layoutProfile.arrangeItems();
        this._layoutChat.arrangeItems();
        this._layoutMapEditor.arrangeItems();
        this._layoutGameChart.arrangeItems();
    }

    private _onTouchedBtnStart(): void {
        this._updateImgStart();
        openPanel(getDict().LobbyStartPanel, void 0);
    }

    private _onTouchedGroupProfile(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        closePanel(getDict().UserOnlineUsersPanel);
        closePanel(getDict().ChatPanel);
        openPanel(getDict().UserPanel, {
            userId: getExisted(getSelfUserId()),
        });
    }

    private _onTouchedGroupChat(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        closePanel(getDict().UserOnlineUsersPanel);
        closePanel(getDict().UserPanel);
        if (!getRunningPanel(getDict().ChatPanel)) {
            openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({}) });
        } else {
            closePanel(getDict().ChatPanel);
        }
    }

    private _onTouchedGroupMapEditor(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        gotoMyWarListPanel(WarTypeId.Me);
    }

    private _onTouchedGroupGameChart(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonGameChartPanel, void 0);
    }

    private _onTouchedGroupVersion(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        openPanel(getDict().CommonChangeVersionPanel, void 0);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTimeTick(): void {
        if ((getServerTimestamp() % 10 === 0)                                 &&
            (!getIsGameHidden())                               &&
            (!getRunningPanel(getDict().LobbyStartPanel))
        ) {
            this._updateImgStart();
        }
    }
    private _onMsgUserLogout(): void {
        this.closePanel();
    }
    private _onMsgChatGetAllReadProgressList(): void {
        this._updateBtnChat();
    }
    private _onMsgChatUpdateReadProgress(): void {
        this._updateBtnChat();
    }
    private _onMsgChatGetAllMessages(): void {
        this._updateBtnChat();
    }
    private _onMsgChatAddMessages(): void {
        this._updateBtnChat();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateImgStart(): Promise<void> {
        this._imgStart.setIsVisible(await checkIsRedForStartButton());
    }

    private _updateBtnChat(): void {
        this._imgChatRed.setIsVisible(checkHasUnreadMessage());
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });
        Executor.reset({
            obj         : this._groupProfile,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });
        Executor.reset({
            obj         : this._groupChat,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 66,
        });
        Executor.reset({
            obj         : this._groupMapEditor,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 132,
        });
        Executor.reset({
            obj         : this._groupGameChart,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 200,
        });

        await wait(200 + Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });

        await wait();
    }
}

function applyTouchEnabled(container: IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
    container.setMouseStyle(MouseStyleType.Pointer);
}
