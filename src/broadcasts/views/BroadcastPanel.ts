import * as BroadcastsProvider from "../Provider.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as StagesStageManager from "../../stages/StageManager.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

const _FLOW_SPEED = 80;

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupLamp!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelLamp!    : UiInterfacesIUiLabel.IUiLabel;

    private _ongoingMessageIdSet    = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TimeTick,                            callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgBroadcastGetAllMessageIdArray,    callback: this._onMsgBroadcastGetAllMessageIdArray },
        ]);

        this.setIsTouchChildrenEnabled(false);

        this._resetView();
    }

    private async _onNotifyTimeTick(): Promise<void> {
        const messageIdArray    = await BroadcastsProvider.getOngoingMessageIdArray();
        const ongoingSet        = this._ongoingMessageIdSet;
        if ((messageIdArray.length !== ongoingSet.size)     ||
            (messageIdArray.some(v => !ongoingSet.has(v)))
        ) {
            this._resetComponentsForLamp(messageIdArray);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._resetView();
    }

    private _onMsgBroadcastGetAllMessageIdArray(): void {
        this._resetView();
    }

    private async _resetView(): Promise<void> {
        this._resetComponentsForLamp(await BroadcastsProvider.getOngoingMessageIdArray());
    }

    private async _resetComponentsForLamp(messageIdArray: number[]): Promise<void> {
        const ongoingSet = this._ongoingMessageIdSet;
        ongoingSet.clear();

        const textList: string[] = [];
        for (const messageId of messageIdArray) {
            ongoingSet.add(messageId);
            textList.push(LangUtils.getLanguageText({ textArray: (await BroadcastsProvider.getMessageData(messageId))?.getTextList() }) ?? LangConstants.UndefinedError);
        }

        const group = this._groupLamp;
        const label = this._labelLamp;
        TweenExecutor.Executor.removeTweens(label);

        if (!textList.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            label.setText(textList.join("    "));
            const stageWidth    = StagesStageManager.getStage().stageWidth;
            const textWidth     = label.getScaledWidth();
            TweenExecutor.Executor.get(label, { loop: true })
                .set({ customX: stageWidth })
                .to({ customX: -textWidth }, (stageWidth + textWidth) / _FLOW_SPEED * 1000);
        }
    }
}
