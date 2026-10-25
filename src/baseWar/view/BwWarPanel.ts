import type { IBwWar } from "../interface/IBwWar.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";

export interface OpenData {
    war: IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupAll! : IUiContainer;

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
        Executor.reset({
            obj         : this._groupAll,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
            tweenTime   : 1000,
        });

        await wait(1000);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupAll,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await wait();
    }
}
