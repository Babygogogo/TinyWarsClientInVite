import type { IUiContainer } from "./IUiContainer.ts";

export interface IUiOpenableComponent<OpenData> extends IUiContainer {
    /**
     * 外部需确保实际执行open前，此控件已有parent、且未打开。
     */
    open(): Promise<void>;

    /**
     * 外部需确保实际执行close前，此控件已打开。
     *
     * 此函数不会自动把控件从parent中移除，需要外部手动移除。
     */
    close(): Promise<void>;

    getPreviousOpenData(): OpenData | undefined;
    getOpenData(): OpenData | undefined;
    setOpenData(data: OpenData | undefined): void;
    applyOpenData(): Promise<void> | void;
}
