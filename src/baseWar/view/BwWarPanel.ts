import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";

export interface OpenData {
    war: BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupAll! : UiInterfacesIUiContainer.IUiContainer;

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
        TweenExecutor.Executor.reset({
            obj         : this._groupAll,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
            tweenTime   : 1000,
        });

        await TimerTimerModel.wait(1000);
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupAll,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await TimerTimerModel.wait();
    }
}
