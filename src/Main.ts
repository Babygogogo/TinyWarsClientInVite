
import loadingIcon from './assets/resource/assets/texture/index/loadingIcon.png'
import * as egret from './vendor/egret/Egret.ts'
import { startGame } from './helpers/GameFlow.ts'

class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.once(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
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

        startGame(this.stage!);
    }
}

document.getElementById("logoCon")!.style.backgroundImage = "url(" + loadingIcon + ")";

egret.runEgret({
    renderMode: "webgl",
    audioType: 0,
    entryClass: Main,
    calculateCanvasScaleFactor: (context: any) => {
        const backingStore =
            context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
    }
});
