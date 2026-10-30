import {
    getOngoingMessageIdArray,
    getMessageData,
} from "../Provider.ts";
import { UndefinedError } from "../../lang/Constants.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getStage } from "../../stages/StageManager.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

const _FLOW_SPEED = 80;

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupLamp!    : IUiContainer;
    private readonly _labelLamp!    : IUiLabel;

    private _ongoingMessageIdSet    = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TimeTick,                            callback: this._onNotifyTimeTick },
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgBroadcastGetAllMessageIdArray,    callback: this._onMsgBroadcastGetAllMessageIdArray },
        ]);

        this.setIsTouchChildrenEnabled(false);

        this._resetView();
    }

    private async _onNotifyTimeTick(): Promise<void> {
        const messageIdArray    = await getOngoingMessageIdArray();
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
        this._resetComponentsForLamp(await getOngoingMessageIdArray());
    }

    private async _resetComponentsForLamp(messageIdArray: number[]): Promise<void> {
        const ongoingSet = this._ongoingMessageIdSet;
        ongoingSet.clear();

        const textList: string[] = [];
        for (const messageId of messageIdArray) {
            ongoingSet.add(messageId);
            textList.push(getLanguageText({ textArray: (await getMessageData(messageId))?.getTextList() }) ?? UndefinedError);
        }

        const group = this._groupLamp;
        const label = this._labelLamp;
        Executor.removeTweens(label);

        if (!textList.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            label.setText(textList.join("    "));
            const stageWidth    = getStage().stageWidth;
            const textWidth     = label.getScaledWidth();
            Executor.get(label, { loop: true })
                .set({ customX: stageWidth })
                .to({ customX: -textWidth }, (stageWidth + textWidth) / _FLOW_SPEED * 1000);
        }
    }
}
