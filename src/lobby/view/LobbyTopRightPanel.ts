import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LobbyModelLobbyModel from "../model/LobbyModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSettings!      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,           callback: this._onMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgMailGetAllMailArray,  callback: this._onNotifyMsgMailGetAllMailArray },
            { type: NotificationsTypeId.TypeId.MsgMailGetMail,          callback: this._onNotifyMsgMailGetMail },
            { type: NotificationsTypeId.TypeId.MsgMailDeleteMail,       callback: this._onNotifyMsgMailDeleteMail },
            { type: NotificationsTypeId.TypeId.MsgMailSetIsNew,         callback: this._onNotifyMsgMailSetIsNew },
        ]);
        this._setUiListenerArray([
            { ui: this._btnSettings,    callback: this._onTouchedBtnSettings },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSettingsPanel, void 0);
    }

    private async _updateRedForBtnSettings(): Promise<void> {
        this._btnSettings.setRedVisible(await LobbyModelLobbyModel.checkIsRedForGameSettings());
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
}
