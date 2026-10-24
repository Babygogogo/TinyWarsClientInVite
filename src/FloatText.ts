import * as GraphicsConstants from "./graphics/Constants.ts";
import type { TextType } from "./lang/Constants.ts";
import * as LangUtils from "./lang/Utils.ts";
import { Dimension } from "./stages/Constants.ts";
import * as StageManager from "./stages/StageManager.ts";
import { Executor } from "./tween/Executor.ts";
import { UiContainer } from "./ui/components/UiContainer.ts";
import type { IUiLayer } from "./ui/interfaces/IUiLayer.ts";
import { UiHorizontalAlign } from "./ui/types/UiHorizontalAlign.ts";
import * as UiFactory from "./ui/utils/UiFactory.ts";

const StartY    = 100;
let Container   : IUiLayer;

export function show(text: string): void {
    Container ??= StageManager.getLayer(GraphicsConstants.DisplayLayerId.FloatText);

    const uiTextCount = Container.getUiChildren().length;
    for (let i = 0; i < uiTextCount; ++i) {
        const uiText = Container.getUiChildAt(i);
        if (uiText) {
            uiText.setAlpha(Math.pow(0.7, uiTextCount - i));
            uiText.setY(StartY - 24 * (uiTextCount - i));
        }
    }

    const newUiText = new UiFloatText(text);
    newUiText.y     = StartY;
    Container.addUiChild(newUiText);
}
export function showLang(langTextType: TextType): void {
    show(LangUtils.getText(langTextType));
}

class UiFloatText extends UiContainer {
    public constructor(text: string) {
        super();

        const width = Dimension.DesignWidth;
        const label = new (UiFactory.getUiLabelClass());
        label.setTextColor(0xFFFFFF);
        label.setStrokeWidth(2);
        label.setFontSize(16);
        label.setText(text);
        label.setAutoShrinkWidth(width);
        // label.setUnscaledManualWidth(width);
        this.addUiChild(label);

        this.checkAndInitSizerInfo().setSizerOptions({
            horizontalAlign : { align: UiHorizontalAlign.Center },
        });

        Executor.get(label)
            .wait(4000)
            .to({ customAlpha: 0 }, 1000)
            .call(() => this.getParent()?.removeChild(this));

        const height = label.getScaledHeight();
        this.setIsTouchChildrenEnabled(false);
        this.setUnscaledManualWidth(label.getScaledWidth());
        this.setUnscaledManualHeight(height);
        this.setAnchorOffsetY(height);

        Executor.get(this as UiContainer)
            .set({ customScaleX: 0.5, customScaleY: 0.5 })
            .to({ customScaleX: 1, customScaleY: 1 }, 100);
    }
}
