import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    public constructor() {
        super();

        this.setIsTouchChildrenEnabled(false);
    }
}
