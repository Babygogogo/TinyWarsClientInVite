
import loadingIcon from './assets/resource/assets/texture/index/loadingIcon.png'
import * as Res from "./vendor/egret/Res.ts"
import * as egret from './vendor/egret/Egret.ts'
import * as lifecycle from './vendor/egret/Lifecycle.ts'
import * as ResManager from './ResManager.ts'

// egret.runEgret();
await ResManager.init();
await ResManager.loadMainRes();

class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {

        lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        // lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }

        // lifecycle.onResume = () => {
        //     egret.ticker.resume();
        // }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }

        this.createGameScene();
        this.startAnimation([
            "<font color=0x00ff0c>Open-source</font>,<font color=0x00ff0c>Free</font>,<font color=0x00ff0c>Multi-platform</font>",
            "Push <font color=0x00ff0c>Game </font>Forward",
            "<font color=0x00ff0c>HTML5 </font>Game Engine"
        ]);
    }

    private textfield: egret.TextField | undefined;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let sky = this.createBitmapByName("bg_002");
        this.addChild(sky);
        let stageW = this.stage?.stageWidth!;
        let stageH = this.stage?.stageHeight!;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let icon = this.createBitmapByName("bg_002");
        icon.width = 115;
        icon.height = 172;
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;

        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);


        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;


    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = Res.getRes(name)!;
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield!;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
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
