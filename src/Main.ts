import loadingIcon from './assets/resource/assets/texture/index/loadingIcon.png';
import {
    Egret_Egret,
    Helpers_GameFlow,
} from "./internal.ts";

class Main extends Egret_Egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.once(Egret_Egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
    }

    private _onAddedToStage(): void {
        // lifecycle.addLifecycleListener((context) => {
        //     // custom lifecycle plugin
        //     context.onUpdate = () => {
        //         // nothing to do
        //     };
        // });
        // lifecycle.onPause = () => {
        //     // egret.ticker.pause();
        // };
        // lifecycle.onResume = () => {
        //     // egret.ticker.resume();
        // };

        Helpers_GameFlow.startGame(this.stage!);
    }
}

document.getElementById("logoCon")!.style.backgroundImage = "url(" + loadingIcon + ")";

Egret_Egret.runEgret({
    renderMode                 : "webgl",
    audioType                  : 0,
    entryClass                 : Main,
    calculateCanvasScaleFactor : (context: any) => {
        const backingStore =
            context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
    },
});
