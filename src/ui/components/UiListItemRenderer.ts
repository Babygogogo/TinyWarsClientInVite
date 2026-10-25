import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { UiOpenableComponent } from "./UiOpenableComponent.ts";
import type { IUiListItemRenderer } from "../interfaces/IUiListItemRenderer.ts";
import type { UiItemTapEventData } from "../types/UiItemTapEventData.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";

export abstract class UiListItemRenderer<OpenData extends UiListItemData>
    extends     UiOpenableComponent<OpenData>
    implements  IUiListItemRenderer<OpenData>
{
    private _shortSfxCode = ShortSfxCode.None;

    // public constructor() {
    //     super();

    //     this.setIsTouchEnabled(true);
    //     this.setMouseStyle(PointerManager.MouseStyleType.Pointer);
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onItemTapEvent(_e: UiItemTapEventData): void {
        // to be overridden
    }

    protected _setShortSfxCode(code: ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): ShortSfxCode {
        return this._shortSfxCode;
    }

    protected _applySettingsForWholeTouch(
        touchEnabled            = true,
        touchChildrenEnabled    = false,
        mouseStyle              = MouseStyleType.Pointer,
        shortSfxCode            = ShortSfxCode.ButtonNeutral01
    ): void {
        this.setIsTouchEnabled(touchEnabled);
        this.setIsTouchChildrenEnabled(touchChildrenEnabled);
        this.setMouseStyle(mouseStyle);
        this._setShortSfxCode(shortSfxCode);
    }
}
