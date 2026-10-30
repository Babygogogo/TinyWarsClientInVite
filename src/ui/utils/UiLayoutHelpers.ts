import {
    Ui_Types_UiHorizontalAlign,
    Ui_Types_UiLayoutOrientation,
    Ui_Types_UiVerticalAlign,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiLayoutBase,
} from "../../internal.ts";

interface RowInfo {
    maxHeight   : number;
    totalWidth  : number;       // includes gap
    items       : Ui_Interfaces_IUiComponent.IUiComponent[];
}
interface ColumnInfo {
    maxWidth    : number;
    totalHeight : number;       // includes gap
    items       : Ui_Interfaces_IUiComponent.IUiComponent[];
}

// TODO 未考虑item旋转、锚点、负缩放等情况
export function arrangeItems(layout: Ui_Interfaces_IUiLayoutBase.IUiLayoutBase, allItems: Ui_Interfaces_IUiComponent.IUiComponent[]): void {
    if (layout.getOrientation() === Ui_Types_UiLayoutOrientation.UiLayoutOrientation.Rows) {
        if (!layout.getMultiItemsPerBlock()) {
            _arrangeItemsAsRows1(layout, allItems);
        } else {
            _arrangeItemsAsRows2(layout, allItems);
        }
    } else {
        if (!layout.getMultiItemsPerBlock()) {
            _arrangeItemsAsColumns1(layout, allItems);
        } else {
            _arrangeItemsAsColumns2(layout, allItems);
        }
    }

    // layout.resetBoundsArea();
}
function _arrangeItemsAsRows1(layout: Ui_Interfaces_IUiLayoutBase.IUiLayoutBase, allItems: Ui_Interfaces_IUiComponent.IUiComponent[]): void {
    if (allItems.length <= 0) {
        return;
    }

    const padding = layout.getPadding();

    {
        const hAlign        = layout.getItemsHorizontalAlign();
        const paddingLeft   = padding?.left ?? 0;
        if (hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left) {
            for (const item of allItems) {
                item.setX(paddingLeft);
            }

        } else {
            const requestedWidth    = layout.getUnscaledRequestedWidth() ?? layout.getUnscaledManualWidth();
            let availableWidth      = 0;
            if (requestedWidth == null) {
                for (const item of allItems) {
                    availableWidth = Math.max(availableWidth, item.getScaledWidth());
                }
            } else {
                availableWidth = requestedWidth - paddingLeft - (padding?.right ?? 0);
            }

            if (hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center) {
                for (const item of allItems) {
                    item.setX(paddingLeft + (availableWidth - item.getScaledWidth()) / 2);
                }
            } else {
                for (const item of allItems) {
                    item.setX(paddingLeft + (availableWidth - item.getScaledWidth()));
                }
            }
        }
    }

    {
        const vAlign            = layout.getItemsVerticalAlign();
        const vMargin           = layout.getItemsVerticalMargin();
        const paddingTop        = padding?.top ?? 0;
        const requestedHeight   = layout.getUnscaledRequestedHeight() ?? layout.getUnscaledManualHeight();
        let y                   = 0;
        if ((vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top) || (requestedHeight == null)) {
            y = paddingTop;

        } else {
            const availableHeight   = requestedHeight - paddingTop - (padding?.bottom ?? 0);
            let totalHeight         = vMargin * (allItems.length - 1);
            for (const item of allItems) {
                totalHeight += item.getScaledHeight();
            }
            y = (vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle)
                ? paddingTop + (availableHeight - totalHeight) / 2
                : paddingTop + (availableHeight - totalHeight);
        }

        for (const item of allItems) {
            item.setY(y);
            y += item.getScaledHeight() + vMargin;
        }
    }
}
function _arrangeItemsAsColumns1(layout: Ui_Interfaces_IUiLayoutBase.IUiLayoutBase, allItems: Ui_Interfaces_IUiComponent.IUiComponent[]): void {
    if (allItems.length <= 0) {
        return;
    }

    const padding = layout.getPadding();

    {
        const vAlign        = layout.getItemsVerticalAlign();
        const paddingTop    = padding?.top ?? 0;
        if (vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top) {
            for (const item of allItems) {
                item.setY(paddingTop);
            }

        } else {
            const requestedHeight   = layout.getUnscaledRequestedHeight() ?? layout.getUnscaledManualHeight();
            let availableHeight     = 0;
            if (requestedHeight == null) {
                for (const item of allItems) {
                    availableHeight = Math.max(availableHeight, item.getScaledHeight());
                }
            } else {
                availableHeight = requestedHeight - paddingTop - (padding?.bottom ?? 0);
            }

            if (vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle) {
                for (const item of allItems) {
                    item.setY(paddingTop + (availableHeight - item.getScaledHeight()) / 2);
                }
            } else {
                for (const item of allItems) {
                    item.setY(paddingTop + (availableHeight - item.getScaledHeight()));
                }
            }
        }
    }

    {
        const hAlign            = layout.getItemsHorizontalAlign();
        const hMargin           = layout.getItemsHorizontalMargin();
        const paddingLeft       = padding?.left ?? 0;
        const requestedWidth    = layout.getUnscaledRequestedWidth() ?? layout.getUnscaledManualWidth();
        let x                   = 0;
        if ((hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left) || (requestedWidth == null)) {
            x = paddingLeft;

        } else {
            const availableWidth    = requestedWidth - paddingLeft - (padding?.right ?? 0);
            let totalWidth          = hMargin * (allItems.length - 1);
            for (const item of allItems) {
                totalWidth += item.getScaledWidth();
            }
            x = (hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center)
                ? paddingLeft + (availableWidth - totalWidth) / 2
                : paddingLeft + (availableWidth - totalWidth);
        }

        for (const item of allItems) {
            item.setX(x);
            x += item.getScaledWidth() + hMargin;
        }
    }
}
function _arrangeItemsAsRows2(layout: Ui_Interfaces_IUiLayoutBase.IUiLayoutBase, allItems: Ui_Interfaces_IUiComponent.IUiComponent[]): void {
    if (allItems.length <= 0) {
        return;
    }

    const padding           = layout.getPadding();
    const paddingLeft       = padding?.left ?? 0;
    const paddingTop        = padding?.top ?? 0;
    const hMargin           = layout.getItemsHorizontalMargin();
    const vMargin           = layout.getItemsVerticalMargin();
    const rowInfoArray      : RowInfo[] = [];
    const requestedWidth    = layout.getUnscaledRequestedWidth() ?? layout.getUnscaledManualWidth();
    const availableWidth    = requestedWidth == null
        ? undefined
        : (requestedWidth - paddingLeft - (padding?.right ?? 0));

    {
        let rowMaxHeight    = 0;
        let rowTotalWidth   = 0;
        const newRowItems   : Ui_Interfaces_IUiComponent.IUiComponent[] = [];

        for (const item of allItems) {
            const itemWidth     = item.getScaledWidth();
            const itemHeight    = item.getScaledHeight();
            const rowItemsCount = newRowItems.length;
            if ((rowItemsCount <= 0)                                    ||
                (availableWidth == null)                                ||
                (rowTotalWidth + hMargin + itemWidth <= availableWidth)
            ) {
                rowMaxHeight    = Math.max(rowMaxHeight, itemHeight);
                rowTotalWidth   += itemWidth + (rowItemsCount <= 0 ? 0 : hMargin);
                newRowItems.push(item);
            } else {
                rowInfoArray.push({
                    maxHeight   : rowMaxHeight,
                    totalWidth  : rowTotalWidth,
                    items       : newRowItems.concat(),
                });
                rowMaxHeight        = itemHeight;
                rowTotalWidth       = itemWidth;
                newRowItems.length  = 0;
                newRowItems.push(item);
            }
        }

        if (newRowItems.length > 0) {
            rowInfoArray.push({
                maxHeight   : rowMaxHeight,
                totalWidth  : rowTotalWidth,
                items       : newRowItems,
            });
        }
    }

    const hAlign                = layout.getItemsHorizontalAlign();
    const vAlign                = layout.getItemsVerticalAlign();
    const rowsAvailableWidth    = availableWidth ?? Math.max(...rowInfoArray.map(v => v.totalWidth));
    const requestedHeight       = layout.getUnscaledRequestedHeight() ?? layout.getUnscaledManualHeight();
    let y                       = 0;
    if ((vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top) || (requestedHeight == null)) {
        y = paddingTop;
    } else {
        let rowsTotalHeight = (rowInfoArray.length - 1) * vMargin;
        for (const rowInfo of rowInfoArray) {
            rowsTotalHeight += rowInfo.maxHeight;
        }
        const rowsAvailableHeight = requestedHeight - paddingTop - (padding?.bottom ?? 0);
        y = (vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle)
            ? paddingTop + (rowsAvailableHeight - rowsTotalHeight) / 2
            : paddingTop + (rowsAvailableHeight - rowsTotalHeight);
    }

    for (const rowInfo of rowInfoArray) {
        const items = rowInfo.items;

        {
            let x = 0;
            if (hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left) {
                x = paddingLeft;
            } else {
                const rowWidth = rowInfo.totalWidth;
                x = (hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center)
                    ? paddingLeft + (rowsAvailableWidth - rowWidth) / 2
                    : paddingLeft + (rowsAvailableWidth - rowWidth);
            }

            for (const item of items) {
                item.setX(x);
                x += item.getScaledWidth() + hMargin;
            }
        }

        {
            const rowHeight = rowInfo.maxHeight;
            for (const item of items) {
                if (vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top) {
                    item.setY(y);
                } else {
                    const itemHeight = item.getScaledHeight();
                    item.setY(vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle
                        ? y + (rowHeight - itemHeight) / 2
                        : y + (rowHeight - itemHeight)
                    );
                }
            }
            y += rowHeight + vMargin;
        }
    }
}
function _arrangeItemsAsColumns2(layout: Ui_Interfaces_IUiLayoutBase.IUiLayoutBase, allItems: Ui_Interfaces_IUiComponent.IUiComponent[]): void {
    if (allItems.length <= 0) {
        return;
    }

    const padding           = layout.getPadding();
    const paddingLeft       = padding?.left ?? 0;
    const paddingTop        = padding?.top ?? 0;
    const hMargin           = layout.getItemsHorizontalMargin();
    const vMargin           = layout.getItemsVerticalMargin();
    const columnInfoArray   : ColumnInfo[] = [];
    const requestedHeight   = layout.getUnscaledRequestedHeight() ?? layout.getUnscaledManualHeight();
    const availableHeight   = requestedHeight == null
        ? undefined
        : (requestedHeight - paddingTop - (padding?.bottom ?? 0));

    {
        let columnMaxWidth      = 0;
        let columnTotalHeight   = 0;
        const newColumnItems    : Ui_Interfaces_IUiComponent.IUiComponent[] = [];

        for (const item of allItems) {
            const itemWidth         = item.getScaledWidth();
            const itemHeight        = item.getScaledHeight();
            const columnItemsCount  = newColumnItems.length;
            if ((columnItemsCount <= 0)                                         ||
                (availableHeight == null)                                       ||
                (columnTotalHeight + vMargin + itemHeight <= availableHeight)
            ) {
                columnMaxWidth      = Math.max(columnMaxWidth, itemWidth);
                columnTotalHeight   += itemHeight + (columnItemsCount <= 0 ? 0 : vMargin);
                newColumnItems.push(item);
            } else {
                columnInfoArray.push({
                    maxWidth    : columnMaxWidth,
                    totalHeight : columnTotalHeight,
                    items       : newColumnItems.concat(),
                });
                columnMaxWidth          = itemWidth;
                columnTotalHeight       = itemHeight;
                newColumnItems.length   = 0;
                newColumnItems.push(item);
            }
        }

        if (newColumnItems.length > 0) {
            columnInfoArray.push({
                maxWidth    : columnMaxWidth,
                totalHeight : columnTotalHeight,
                items       : newColumnItems,
            });
        }
    }

    const hAlign                    = layout.getItemsHorizontalAlign();
    const vAlign                    = layout.getItemsVerticalAlign();
    const requestedWidth            = layout.getUnscaledRequestedWidth() ?? layout.getUnscaledManualWidth();
    const columnsAvailableHeight    = availableHeight ?? Math.max(...columnInfoArray.map(v => v.totalHeight));
    let x                           = 0;
    if ((hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left) || (requestedWidth == null)) {
        x = paddingLeft;
    } else {
        let columnsTotalWidth = (columnInfoArray.length - 1) * hMargin;
        for (const rowInfo of columnInfoArray) {
            columnsTotalWidth += rowInfo.maxWidth;
        }
        const columnsAvailableWidth = requestedWidth - paddingLeft - (padding?.right ?? 0);
        x = (hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center)
            ? paddingLeft + (columnsAvailableWidth - columnsTotalWidth) / 2
            : paddingLeft + (columnsAvailableWidth - columnsTotalWidth);
    }

    for (const columnInfo of columnInfoArray) {
        const items = columnInfo.items;

        {
            let y = 0;
            if (vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top) {
                y = paddingTop;
            } else {
                const columnHeight = columnInfo.totalHeight;
                y = (vAlign === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle)
                    ? paddingTop + (columnsAvailableHeight - columnHeight) / 2
                    : paddingTop + (columnsAvailableHeight - columnHeight);
            }

            for (const item of items) {
                item.setY(y);
                y += item.getScaledHeight() + vMargin;
            }
        }

        {
            const columnWidth = columnInfo.maxWidth;
            for (const item of items) {
                if (hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left) {
                    item.setX(x);
                } else {
                    const itemWidth = item.getScaledWidth();
                    item.setX(hAlign === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center
                        ? x + (columnWidth - itemWidth) / 2
                        : x + (columnWidth - itemWidth)
                    );
                }
            }
            x += columnWidth + hMargin;
        }
    }
}
