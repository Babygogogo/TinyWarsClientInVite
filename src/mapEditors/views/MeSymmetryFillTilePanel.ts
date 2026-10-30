import {
    Tiles_Utils_Serialization,
    GamePanels_Dict,
    Helpers_Misc,
    MapEditor_Model_MeHelpers,
    TileBases_Utils,
    TileDecorations_Utils,
    TileObjects_Utils,
    Lang_Utils,
    AuxiliaryTypes_GridIndex,
    GamePanels_Manager,
    FloatText,
    Geometries_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutContent!                : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _labelFill1!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnUpDown1!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDownUp1!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLeftRight1!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRightLeft1!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUpLeftDownRight1!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDownRightUpLeft1!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUpRightDownLeft1!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDownLeftUpRight1!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelFill2!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnUpDown2!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDownUp2!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLeftRight2!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRightLeft2!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUpLeftDownRight2!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDownRightUpLeft2!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUpRightDownLeft2!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDownLeftUpRight2!          : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0864),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor((mapHeight + 1) / 2); y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.UpToDown);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0865),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor(mapHeight / 2) - 1; y >= 0; --y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.UpToDown);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0866),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor((mapWidth + 1) / 2); x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.LeftToRight);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0867),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor(mapWidth / 2) - 1; x >= 0; --x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.LeftToRight);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0868),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = mapHeight - x; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.UpLeftToDownRight);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0869),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = 0; y < mapWidth - x - 1; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.UpLeftToDownRight);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0870),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = x + 1; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.UpRightToDownLeft);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0871),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = 0; y < x; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.UpRightToDownLeft);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0864),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor((mapHeight + 1) / 2); y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0865),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = Math.floor(mapHeight / 2) - 1; y >= 0; --y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0866),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor((mapWidth + 1) / 2); x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0867),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapSize       = war.getTileMap().getMapSize();
                const mapWidth      = mapSize.getWidth();
                const mapHeight     = mapSize.getHeight();
                for (let x = Math.floor(mapWidth / 2) - 1; x >= 0; --x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0868),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = mapHeight - x; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0869),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = 0; y < mapWidth - x - 1; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0870),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 0; x < mapWidth - 1; ++x) {
                    for (let y = x + 1; y < mapHeight; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0295));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0871),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                for (let x = 1; x < mapWidth; ++x) {
                    for (let y = 0; y < x; ++y) {
                        autoFillTile(war, new AuxiliaryTypes_GridIndex.GridIndex(x, y), Geometries_Constants.SymmetryTypeId.Rotation);
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1245);
        this._labelFill1.setLangText(Lang_Constants.TextType.B0862);
        this._labelFill2.setLangText(Lang_Constants.TextType.B0310);
        this._btnUpDown1.setLangText(Lang_Constants.TextType.B0864);
        this._btnDownUp1.setLangText(Lang_Constants.TextType.B0865);
        this._btnLeftRight1.setLangText(Lang_Constants.TextType.B0866);
        this._btnRightLeft1.setLangText(Lang_Constants.TextType.B0867);
        this._btnUpLeftDownRight1.setLangText(Lang_Constants.TextType.B0868);
        this._btnDownRightUpLeft1.setLangText(Lang_Constants.TextType.B0869);
        this._btnUpRightDownLeft1.setLangText(Lang_Constants.TextType.B0870);
        this._btnDownLeftUpRight1.setLangText(Lang_Constants.TextType.B0871);
        this._btnUpDown2.setLangText(Lang_Constants.TextType.B0864);
        this._btnDownUp2.setLangText(Lang_Constants.TextType.B0865);
        this._btnLeftRight2.setLangText(Lang_Constants.TextType.B0866);
        this._btnRightLeft2.setLangText(Lang_Constants.TextType.B0867);
        this._btnUpLeftDownRight2.setLangText(Lang_Constants.TextType.B0868);
        this._btnDownRightUpLeft2.setLangText(Lang_Constants.TextType.B0869);
        this._btnUpRightDownLeft2.setLangText(Lang_Constants.TextType.B0870);
        this._btnDownLeftUpRight2.setLangText(Lang_Constants.TextType.B0871);

        this._layoutContent.arrangeItems();
    }
}

function autoFillTile(war: MapEditor_Interface_IMeWar.IMeWar, dstGridIndex: AuxiliaryTypes_GridIndex.GridIndex, symmetryType: Geometries_Constants.SymmetryTypeId): void {
    const tileMap           = war.getTileMap();
    const gameConfig        = war.getGcData();
    const drawer            = war.getDrawer();
    const dstTile           = tileMap.getTile(dstGridIndex);
    const srcTile           = tileMap.getTile(Helpers_Misc.getExisted(MapEditor_Model_MeHelpers.getSymmetricalGridIndex(dstGridIndex, symmetryType, tileMap.getMapSize())));
    const decorationType    = srcTile.getDecorationType();
    const decorationShapeId = srcTile.getDecorationShapeId();
    const objectType        = srcTile.getObjectType();
    const baseType          = srcTile.getBaseType();

    const tileData = Tiles_Utils_Serialization.create({
        gridIndex              : dstGridIndex.toProto().toJson(),
        groupedLocationIdArray : dstTile.getGroupedLocationIdArray(),
        baseType               : baseType,
        baseShapeId            : TileBases_Utils.getSymmetricalTileBaseShapeId(baseType, srcTile.getBaseShapeId(), symmetryType) ?? 0,
        objectType             : TileObjects_Utils.getSymmetricalTileObjectType(objectType, symmetryType),
        objectShapeId          : TileObjects_Utils.getSymmetricalTileObjectShapeId(objectType, srcTile.getObjectShapeId(), symmetryType) ?? 0,
        isHighlighted          : dstTile.getIsHighlighted(),
        unfixedBuffArray       : dstTile.getUnfixedBuffList()?.map(v => v.toJson()),
        customNameId           : dstTile.getCustomNameId() ?? null,

        playerIndex : drawer.getIsSymmetricalPlayerIndexEnabled()
            ? drawer.getSymmetricalPlayerIndex(srcTile.getPlayerIndex())
            : srcTile.getPlayerIndex(),

        decorationType    : decorationType,
        decorationShapeId : ((decorationType != null) && (decorationShapeId != null))
            ? TileDecorations_Utils.getSymmetricalTileDecorationShapeId(decorationType, decorationShapeId, symmetryType) ?? 0
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
