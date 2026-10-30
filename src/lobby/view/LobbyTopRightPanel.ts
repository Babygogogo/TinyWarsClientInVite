import {
    Lobby_Model_LobbyModel,
    Tween_Executor,
    GamePanels_Dict,
    GamePanels_Manager,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSettings!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserLogout,           callback : this._onMsgUserLogout },
            { type : Notifications_TypeId.TypeId.MsgMailGetAllMailArray,  callback : this._onNotifyMsgMailGetAllMailArray },
            { type : Notifications_TypeId.TypeId.MsgMailGetMail,          callback : this._onNotifyMsgMailGetMail },
            { type : Notifications_TypeId.TypeId.MsgMailDeleteMail,       callback : this._onNotifyMsgMailDeleteMail },
            { type : Notifications_TypeId.TypeId.MsgMailSetIsNew,         callback : this._onNotifyMsgMailSetIsNew },
        ]);
        this._setUiListenerArray([
            { ui : this._btnSettings,    callback : this._onTouchedBtnSettings },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateRedForBtnSettings();
    }

    private _onMsgUserLogout(): void {
        this.closePanel();
    }
    private _onNotifyMsgMailGetAllMailArray(): void {
        this._updateRedForBtnSettings();
    }
    private _onNotifyMsgMailGetMail(): void {
        this._updateRedForBtnSettings();
    }
    private _onNotifyMsgMailDeleteMail(): void {
        this._updateRedForBtnSettings();
    }
    private _onNotifyMsgMailSetIsNew(): void {
        this._updateRedForBtnSettings();
    }

    private _onNotifyLanguageChanged(): void {
        // nothing to do
    }

    private _onTouchedBtnSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSettingsPanel, void 0);
    }

    private async _updateRedForBtnSettings(): Promise<void> {
        this._btnSettings.setRedVisible(await Lobby_Model_LobbyModel.checkIsRedForGameSettings());
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
}
