import {
    Stages_Constants,
    Graphics_Constants,
    Tween_Executor,
    Stages_StageManager,
    Lang_Utils,
    Ui_Components_UiContainer,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiLabel,
    type Ui_Interfaces_IUiLayer,
    type Lang_Constants,
} from "./internal.ts";

const StartY    = 100;
let Container   : Ui_Interfaces_IUiLayer.IUiLayer;

export function show(text: string): void {
    Container ??= Stages_StageManager.getLayer(Graphics_Constants.DisplayLayerId.FloatText);

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
export function showLang(langTextType: Lang_Constants.TextType): void {
    show(Lang_Utils.getText(langTextType));
}

class UiFloatText extends Ui_Components_UiContainer.UiContainer {
    public constructor(text: string) {
        super();

        const width = Stages_Constants.Dimension.DesignWidth;
        const label = new Ui_Components_UiLabel.UiLabel();
        label.setTextColor(0xFFFFFF);
        label.setStrokeWidth(2);
        label.setFontSize(16);
        label.setText(text);
        label.setAutoShrinkWidth(width);
        // label.setUnscaledManualWidth(width);
        this.addUiChild(label);

        this.checkAndInitSizerInfo().setSizerOptions({
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
        });

        Tween_Executor.Executor.get(label)
            .wait(4000)
            .to({ customAlpha : 0 }, 1000)
            .call(() => this.getParent()?.removeChild(this));

        const height = label.getScaledHeight();
        this.setIsTouchChildrenEnabled(false);
        this.setUnscaledManualWidth(label.getScaledWidth());
        this.setUnscaledManualHeight(height);
        this.setAnchorOffsetY(height);

        Tween_Executor.Executor.get(this as Ui_Components_UiContainer.UiContainer)
            .set({ customScaleX : 0.5, customScaleY : 0.5 })
            .to({ customScaleX : 1, customScaleY : 1 }, 100);
    }
}
