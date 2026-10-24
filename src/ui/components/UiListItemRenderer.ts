import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as UiComponentsUiOpenableComponent from "./UiOpenableComponent.ts";
import type * as UiInterfacesIUiListItemRenderer from "../interfaces/IUiListItemRenderer.ts";
import type * as UiTypesUiItemTapEventData from "../types/UiItemTapEventData.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";

export abstract class UiListItemRenderer<OpenData extends UiTypesUiListItemData.UiListItemData>
    extends     UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<OpenData>
{
    private _shortSfxCode = SoundsConstants.ShortSfxCode.None;

    // public constructor() {
    //     super();

    //     this.setIsTouchEnabled(true);
    //     this.setMouseStyle(PointerManager.MouseStyleType.Pointer);
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onItemTapEvent(_e: UiTypesUiItemTapEventData.UiItemTapEventData): void {
        // to be overridden
    }

    protected _setShortSfxCode(code: SoundsConstants.ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): SoundsConstants.ShortSfxCode {
        return this._shortSfxCode;
    }

    protected _applySettingsForWholeTouch(
        touchEnabled            = true,
        touchChildrenEnabled    = false,
        mouseStyle              = HelpersPointerInput.MouseStyleType.Pointer,
        shortSfxCode            = SoundsConstants.ShortSfxCode.ButtonNeutral01
    ): void {
        this.setIsTouchEnabled(touchEnabled);
        this.setIsTouchChildrenEnabled(touchChildrenEnabled);
        this.setMouseStyle(mouseStyle);
        this._setShortSfxCode(shortSfxCode);
    }
}
