import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as ChatModel from "../../chat/Model.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCompatibility from "../../helpers/Compatibility.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../model/LobbyModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupBottom!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupContainer!   : UiInterfacesIUiContainer.IUiContainer;

    // private readonly _groupStart!       : Ui.Interfaces.IUiContainer;
    private readonly _btnStart!         : UiInterfacesIUiButton.IUiButton;
    private readonly _imgStart!         : UiInterfacesIUiImage.IUiImage;

    private readonly _groupVersion!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelVersion!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupProfile!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutProfile!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelProfile1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelProfile2!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupChat!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutChat!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelChat1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChat2!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgChatRed!       : UiInterfacesIUiImage.IUiImage;

    private readonly _groupMapEditor!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutMapEditor!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapEditor1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapEditor2!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupGameChart!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutGameChart!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelGameChart1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelGameChart2!  : UiInterfacesIUiLabel.IUiLabel;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TimeTick,                        callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,                   callback: this._onMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllReadProgressList,   callback: this._onMsgChatGetAllReadProgressList },
            { type: NotificationsTypeId.TypeId.MsgChatUpdateReadProgress,       callback: this._onMsgChatUpdateReadProgress },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllMessages,           callback: this._onMsgChatGetAllMessages },
            { type: NotificationsTypeId.TypeId.MsgChatAddMessage,               callback: this._onMsgChatAddMessages },
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
        TweenExecutor.Executor.removeTweens(imgStart);
        TweenExecutor.Executor.get(imgStart, { loop: true })
            .to({ customAlpha: 0.8 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateImgStart();
        this._updateBtnChat();
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgStart);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        const languageType2 = LangUtils.getSecondaryLanguageType();
        this._labelProfile1.setLangText(LangConstants.TextType.B1375);
        this._labelProfile2.setText(LangUtils.getText(LangConstants.TextType.B1375, languageType2));
        this._labelChat1.setLangText(LangConstants.TextType.B1376);
        this._labelChat2.setText(LangUtils.getText(LangConstants.TextType.B1376, languageType2));
        this._labelMapEditor1.setLangText(LangConstants.TextType.B1377);
        this._labelMapEditor2.setText(LangUtils.getText(LangConstants.TextType.B1377, languageType2));
        this._labelGameChart1.setLangText(LangConstants.TextType.B0900);
        this._labelGameChart2.setText(LangUtils.getText(LangConstants.TextType.B0900, languageType2));
        this._labelVersion.setText(LangUtils.getGameVersionName(window.GAME_VERSION) ?? LangConstants.UndefinedError);

        this._imgChatRed.setX(this._layoutChat.getX() + this._labelChat1.getScaledWidth());

        this._layoutProfile.arrangeItems();
        this._layoutChat.arrangeItems();
        this._layoutMapEditor.arrangeItems();
        this._layoutGameChart.arrangeItems();
    }

    private _onTouchedBtnStart(): void {
        this._updateImgStart();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyStartPanel, void 0);
    }

    private _onTouchedGroupProfile(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.closePanel(GamePanelsDict.getDict().UserOnlineUsersPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().ChatPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, {
            userId: HelpersMisc.getExisted(UsersModel.getSelfUserId()),
        });
    }

    private _onTouchedGroupChat(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.closePanel(GamePanelsDict.getDict().UserOnlineUsersPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().UserPanel);
        if (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().ChatPanel)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({}) });
        } else {
            GamePanelsManager.closePanel(GamePanelsDict.getDict().ChatPanel);
        }
    }

    private _onTouchedGroupMapEditor(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        HelpersGameFlow.gotoMyWarListPanel(WarTypesConstants.WarTypeId.Me);
    }

    private _onTouchedGroupGameChart(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonGameChartPanel, void 0);
    }

    private _onTouchedGroupVersion(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChangeVersionPanel, void 0);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTimeTick(): void {
        if ((TimerTimerModel.getServerTimestamp() % 10 === 0)                                 &&
            (!HelpersCompatibility.getIsGameHidden())                               &&
            (!GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().LobbyStartPanel))
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
        this._imgStart.setIsVisible(await LobbyModelLobbyModel.checkIsRedForStartButton());
    }

    private _updateBtnChat(): void {
        this._imgChatRed.setIsVisible(ChatModel.checkHasUnreadMessage());
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupProfile,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupChat,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 66,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupMapEditor,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 132,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupGameChart,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 200,
        });

        await TimerTimerModel.wait(200 + GraphicsConstants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupContainer,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });

        await TimerTimerModel.wait();
    }
}

function applyTouchEnabled(container: UiInterfacesIUiContainer.IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
    container.setMouseStyle(HelpersPointerInput.MouseStyleType.Pointer);
}
