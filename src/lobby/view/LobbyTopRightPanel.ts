import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { checkIsRedForGameSettings } from "../model/LobbyModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _group!            : IUiContainer;
    private readonly _btnSettings!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,           callback: this._onMsgUserLogout },
            { type: TypeId.MsgMailGetAllMailArray,  callback: this._onNotifyMsgMailGetAllMailArray },
            { type: TypeId.MsgMailGetMail,          callback: this._onNotifyMsgMailGetMail },
            { type: TypeId.MsgMailDeleteMail,       callback: this._onNotifyMsgMailDeleteMail },
            { type: TypeId.MsgMailSetIsNew,         callback: this._onNotifyMsgMailSetIsNew },
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
        openPanel(getDict().UserSettingsPanel, void 0);
    }

    private async _updateRedForBtnSettings(): Promise<void> {
        this._btnSettings.setRedVisible(await checkIsRedForGameSettings());
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
}
