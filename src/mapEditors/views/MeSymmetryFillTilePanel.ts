import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { SymmetryTypeId } from "../../geometries/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getSymmetricalGridIndex } from "../../mapEditor/model/MeHelpers.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getSymmetricalTileBaseShapeId } from "../../tileBases/Utils.ts";
import { getSymmetricalTileDecorationShapeId } from "../../tileDecorations/Utils.ts";
import {
    getSymmetricalTileObjectShapeId,
    getSymmetricalTileObjectType,
} from "../../tileObjects/Utils.ts";
import { create } from "../../tiles/utils/Serialization.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;

    private readonly _layoutContent!                : IUiLayout;

    private readonly _labelFill1!                   : IUiLabel;
    private readonly _btnUpDown1!                   : IUiButton;
    private readonly _btnDownUp1!                   : IUiButton;
    private readonly _btnLeftRight1!                : IUiButton;
    private readonly _btnRightLeft1!                : IUiButton;
    private readonly _btnUpLeftDownRight1!          : IUiButton;
    private readonly _btnDownRightUpLeft1!          : IUiButton;
    private readonly _btnUpRightDownLeft1!          : IUiButton;
    private readonly _btnDownLeftUpRight1!          : IUiButton;

    private readonly _labelFill2!                   : IUiLabel;
    private readonly _btnUpDown2!                   : IUiButton;
    private readonly _btnDownUp2!                   : IUiButton;
    private readonly _btnLeftRight2!                : IUiButton;
    private readonly _btnRightLeft2!                : IUiButton;
    private readonly _btnUpLeftDownRight2!          : IUiButton;
    private readonly _btnDownRightUpLeft2!          : IUiButton;
    private readonly _btnUpRightDownLeft2!          : IUiButton;
    private readonly _btnDownLeftUpRight2!          : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },

            { ui : this._btnUpDown1,                 callback : this._onTouchedBtnUpDown1 },
            { ui : this._btnDownUp1,                 callback : this._onTouchedBtnDownUp1 },
            { ui : this._btnLeftRight1,              callback : this._onTouchedBtnLeftRight1 },
            { ui : this._btnRightLeft1,              callback : this._onTouchedBtnRightLeft1 },
            { ui : this._btnUpLeftDownRight1,        callback : this._onTouchedBtnUpLeftDownRight1 },
            { ui : this._btnDownRightUpLeft1,        callback : this._onTouchedBtnDownRightUpLeft1 },
            { ui : this._btnUpRightDownLeft1,        callback : this._onTouchedBtnUpRightDownLeft1 },
            { ui : this._btnDownLeftUpRight1,        callback : this._onTouchedBtnDownLeftUpRight1 },

            { ui : this._btnUpDown2,                 callback : this._onTouchedBtnUpDown2 },
            { ui : this._btnDownUp2,                 callback : this._onTouchedBtnDownUp2 },
            { ui : this._btnLeftRight2,              callback : this._onTouchedBtnLeftRight2 },
            { ui : this._btnRightLeft2,              callback : this._onTouchedBtnRightLeft2 },
            { ui : this._btnUpLeftDownRight2,        callback : this._onTouchedBtnUpLeftDownRight2 },
            { ui : this._btnDownRightUpLeft2,        callback : this._onTouchedBtnDownRightUpLeft2 },
            { ui : this._btnUpRightDownLeft2,        callback : this._onTouchedBtnUpRightDownLeft2 },
            { ui : this._btnDownLeftUpRight2,        callback : this._onTouchedBtnDownLeftUpRight2 },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnUpDown1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0864),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor((mapHeight + 1) / 2); y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.UpToDown);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnDownUp1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0865),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor(mapHeight / 2) - 1; y >= 0; --y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.UpToDown);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnLeftRight1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0866),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor((mapWidth + 1) / 2); x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.LeftToRight);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnRightLeft1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0867),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor(mapWidth / 2) - 1; x >= 0; --x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.LeftToRight);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnUpLeftDownRight1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0868),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = mapHeight - x; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.UpLeftToDownRight);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnDownRightUpLeft1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0869),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = 0; y < mapWidth - x - 1; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.UpLeftToDownRight);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnUpRightDownLeft1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0870),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = x + 1; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.UpRightToDownLeft);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnDownLeftUpRight1(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0871),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = 0; y < x; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.UpRightToDownLeft);
                    }
                }

                this.closePanel();
            },
        });
    }

    private _onTouchedBtnUpDown2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0864),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor((mapHeight + 1) / 2); y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnDownUp2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0865),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor(mapHeight / 2) - 1; y >= 0; --y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnLeftRight2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0866),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor((mapWidth + 1) / 2); x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnRightLeft2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0867),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor(mapWidth / 2) - 1; x >= 0; --x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnUpLeftDownRight2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0868),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = mapHeight - x; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnDownRightUpLeft2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0869),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = 0; y < mapWidth - x - 1; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnUpRightDownLeft2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0870),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = x + 1; y < mapHeight; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }
    private _onTouchedBtnDownLeftUpRight2(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapSize       = war.getTileMap().getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        if (mapWidth !== mapHeight) {
            show(getText(TextType.A0295));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0871),
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = 0; y < x; ++y) {
                        autoFillTile(war, new GridIndex(x, y), SymmetryTypeId.Rotation);
                    }
                }

                this.closePanel();
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1245);
        this._labelFill1.setLangText(TextType.B0862);
        this._labelFill2.setLangText(TextType.B0310);
        this._btnUpDown1.setLangText(TextType.B0864);
        this._btnDownUp1.setLangText(TextType.B0865);
        this._btnLeftRight1.setLangText(TextType.B0866);
        this._btnRightLeft1.setLangText(TextType.B0867);
        this._btnUpLeftDownRight1.setLangText(TextType.B0868);
        this._btnDownRightUpLeft1.setLangText(TextType.B0869);
        this._btnUpRightDownLeft1.setLangText(TextType.B0870);
        this._btnDownLeftUpRight1.setLangText(TextType.B0871);
        this._btnUpDown2.setLangText(TextType.B0864);
        this._btnDownUp2.setLangText(TextType.B0865);
        this._btnLeftRight2.setLangText(TextType.B0866);
        this._btnRightLeft2.setLangText(TextType.B0867);
        this._btnUpLeftDownRight2.setLangText(TextType.B0868);
        this._btnDownRightUpLeft2.setLangText(TextType.B0869);
        this._btnUpRightDownLeft2.setLangText(TextType.B0870);
        this._btnDownLeftUpRight2.setLangText(TextType.B0871);

        this._layoutContent.arrangeItems();
    }
}

function autoFillTile(war: IMeWar, dstGridIndex: GridIndex, symmetryType: SymmetryTypeId): void {
    const tileMap           = war.getTileMap();
    const gameConfig        = war.getGcData();
    const drawer            = war.getDrawer();
    const dstTile           = tileMap.getTile(dstGridIndex);
    const srcTile           = tileMap.getTile(getExisted(getSymmetricalGridIndex(dstGridIndex, symmetryType, tileMap.getMapSize())));
    const decorationType    = srcTile.getDecorationType();
    const decorationShapeId = srcTile.getDecorationShapeId();
    const objectType        = srcTile.getObjectType();
    const baseType          = srcTile.getBaseType();

    const tileData = create({
        gridIndex              : dstGridIndex.toProto().toJson(),
        groupedLocationIdArray : dstTile.getGroupedLocationIdArray(),
        baseType               : baseType,
        baseShapeId            : getSymmetricalTileBaseShapeId(baseType, srcTile.getBaseShapeId(), symmetryType) ?? 0,
        objectType             : getSymmetricalTileObjectType(objectType, symmetryType),
        objectShapeId          : getSymmetricalTileObjectShapeId(objectType, srcTile.getObjectShapeId(), symmetryType) ?? 0,
        isHighlighted          : dstTile.getIsHighlighted(),
        unfixedBuffArray       : dstTile.getUnfixedBuffList()?.map(v => v.toJson()),
        customNameId           : dstTile.getCustomNameId() ?? null,

        playerIndex : drawer.getIsSymmetricalPlayerIndexEnabled()
            ? drawer.getSymmetricalPlayerIndex(srcTile.getPlayerIndex())
            : srcTile.getPlayerIndex(),

        decorationType    : decorationType,
        decorationShapeId : ((decorationType != null) && (decorationShapeId != null))
            ? getSymmetricalTileDecorationShapeId(decorationType, decorationShapeId, symmetryType) ?? 0
            : decorationShapeId,

        currentBuildPoint   : srcTile.getCurrentBuildPoint(),
        currentCapturePoint : srcTile.getCurrentCapturePoint(),
        currentHp           : srcTile.getCurrentHp(),

        customBuildingData    : srcTile.getCustomBuildingData()?.toJson() ?? null,
        customCrystalData     : srcTile.getCustomCrystalData()?.toJson() ?? null,
        customCannonData      : srcTile.getCustomCannonData()?.toJson() ?? null,
        customLaserTurretData : srcTile.getCustomLaserTurretData()?.toJson() ?? null,
    });

    dstTile.init(tileData, gameConfig);
    dstTile.startRunning(war);
    dstTile.flushDataToView();
}
