import {
    Tween_Executor,
    Lang_Utils,
    Broadcasts_Provider,
    Stages_StageManager,
    Ui_Components_UiPanel,
    Lang_Constants,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

const _FLOW_SPEED = 80;

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupLamp!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelLamp!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _ongoingMessageIdSet    = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TimeTick",                            callback : this._onNotifyTimeTick },
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "MsgBroadcastGetAllMessageIdArray",    callback : this._onMsgBroadcastGetAllMessageIdArray },
        ]);

        this.setIsTouchChildrenEnabled(false);

        this._resetView();
    }

    private async _onNotifyTimeTick(): Promise<void> {
        const messageIdArray    = await Broadcasts_Provider.getOngoingMessageIdArray();
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
        this._resetComponentsForLamp(await Broadcasts_Provider.getOngoingMessageIdArray());
    }

    private async _resetComponentsForLamp(messageIdArray: number[]): Promise<void> {
        const ongoingSet = this._ongoingMessageIdSet;
        ongoingSet.clear();

        const textList: string[] = [];
        for (const messageId of messageIdArray) {
            ongoingSet.add(messageId);
            textList.push(Lang_Utils.getLanguageText({ textArray : (await Broadcasts_Provider.getMessageData(messageId))?.getTextList() }) ?? Lang_Constants.UndefinedError);
        }

        const group = this._groupLamp;
        const label = this._labelLamp;
        Tween_Executor.Executor.removeTweens(label);

        if (!textList.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            label.setText(textList.join("    "));
            const stageWidth    = Stages_StageManager.getStage().stageWidth;
            const textWidth     = label.getScaledWidth();
            Tween_Executor.Executor.get(label, { loop : true })
                .set({ customX : stageWidth })
                .to({ customX : -textWidth }, (stageWidth + textWidth) / _FLOW_SPEED * 1000);
        }
    }
}
