import {
    Helpers_PointerInput,
    Sounds_Constants,
    Ui_Components_UiOpenableComponent,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Types_UiItemTapEventData,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export abstract class UiListItemRenderer<OpenData extends Ui_Types_UiListItemData.UiListItemData>
    extends     Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<OpenData> {
    private _shortSfxCode = Sounds_Constants.ShortSfxCode.None;

    // public constructor() {
    //     super();

    //     this.setIsTouchEnabled(true);
    //     this.setMouseStyle(PointerManager.MouseStyleType.Pointer);
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onItemTapEvent(_e: Ui_Types_UiItemTapEventData.UiItemTapEventData): void {
        // to be overridden
    }

    protected _setShortSfxCode(code: Sounds_Constants.ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): Sounds_Constants.ShortSfxCode {
        return this._shortSfxCode;
    }

    protected _applySettingsForWholeTouch(
        touchEnabled            = true,
        touchChildrenEnabled    = false,
        mouseStyle              = Helpers_PointerInput.MouseStyleType.Pointer,
        shortSfxCode            = Sounds_Constants.ShortSfxCode.ButtonNeutral01,
    ): void {
        this.setIsTouchEnabled(touchEnabled);
        this.setIsTouchChildrenEnabled(touchChildrenEnabled);
        this.setMouseStyle(mouseStyle);
        this._setShortSfxCode(shortSfxCode);
    }
}
