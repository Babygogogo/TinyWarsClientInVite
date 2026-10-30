import {
    Tween_Executor,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiContainer,
} from "../../internal.ts";

export interface OpenData {
    war: BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupAll! : Ui_Interfaces_IUiContainer.IUiContainer;

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const groupAll = this._groupAll;
        groupAll.removeUiChildren();
        groupAll.addUiChild(openData.war.getView());
    }
    protected override async _onClosed(): Promise<void> {
        this._groupAll.removeUiChildren();

        await super._onClosed();
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._groupAll,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
            tweenTime   : 1000,
        });

        await Timer_TimerModel.wait(1000);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._groupAll,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await Timer_TimerModel.wait();
    }
}
