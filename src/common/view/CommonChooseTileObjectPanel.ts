import {
    Tween_Executor,
    GameConfigs_GameConfig,
    TileObjects_Utils,
    Helpers_ImageSource,
    Lang_Utils,
    Tiles_Constants_Common,
    Players_Constants,
    Lang_Constants,
    Graphics_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
    type MapEditor_Model_MeTypes,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
    Users_Model,
} from "../../internal.ts";

export interface OpenData {
    currentPlayerIndex?         : number;
    showNeutralHeadquarters?    : boolean;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    /** 从P0开始；必须连续；不能包含不可用的玩家；需把overriding计算在内 */
    finalSkinIdArray            : number[];
    callback                    : (tileObjectType: number, tileObjectShapeId: number, playerIndex: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listPlayerIndex!  : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listTileObject!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileObjectRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,          callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayerIndex.setItemRendererClass(PlayerIndexRenderer);
        this._listTileObject.setItemRendererClass(TileObjectRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listPlayerIndex.removeAllItems(),
            this._listTileObject.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newPlayerIndex: number | null, needScroll: boolean): Promise<void> {
        const list  = this._listPlayerIndex;
        const index = list.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex);
        list.setSelectedItemIndex(index);
        if (needScroll) {
            list.scrollToItem(index);
        }

        await this._updateListTileObject();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._resetListPlayerIndex(this.getOpenData()?.currentPlayerIndex);
        await this._updateListTileObject();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.TileObject);
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<void> {
        const skinIdArray = this.getOpenData()?.finalSkinIdArray;
        if (skinIdArray == null) {
            return;
        }

        const maxPlayerIndex    = skinIdArray.length - 1;
        const dataArray         : DataForPlayerIndexRenderer[] = [{
            playerIndex : null,
            skinId      : null,
            panel       : this,
        }];
        for (let playerIndex = Players_Constants.PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
            dataArray.push({
                playerIndex : playerIndex,
                skinId      : skinIdArray[playerIndex],
                panel       : this,
            });
        }

        const list = this._listPlayerIndex;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.playerIndex == selectedPlayerIndex));
    }

    private async _updateListTileObject(): Promise<void> {
        const selectedData      = this._listPlayerIndex.getFirstSelectedData();
        const listTileObject    = this._listTileObject;
        if (selectedData == null) {
            await listTileObject.removeAllItems();
            return;
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = selectedData.playerIndex;
        const skinId        = selectedData.skinId ?? 0;
        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTileObjectRenderer[] = [];
        for (const cfg of TileObjects_Utils.getAllTileObjectCfgArray()) {
            if ((cfg.tileObjectTypeId === Tiles_Constants_Common.ObjectTypeId.Headquarters)     &&
                (playerIndex === Players_Constants.PlayerIndex.Neutral)   &&
                (!openData.showNeutralHeadquarters)
            ) {
                continue;
            }
            if (((cfg.isNeutralOnly) && (playerIndex != null))  ||
                ((!cfg.isNeutralOnly) && (playerIndex == null))
            ) {
                continue;
            }

            const shapesCount = (Users_Model.getSelfSettingsTextureVersion() === Graphics_Constants.TextureVersionId.V0
                ? (cfg.shapesCountInEditorForV0)
                : (cfg.shapesCountInEditor));
            for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                dataArray.push({
                    dataForDrawTileObject : {
                        objectType  : cfg.tileObjectTypeId,
                        shapeId     : shapeId,
                        playerIndex : playerIndex ?? 0,
                    },
                    skinId     : skinId,
                    gameConfig : gameConfig,
                    panel      : this,
                    callback   : openData.callback,
                });
            }
        }

        await listTileObject.bindData(dataArray);
    }
}

interface DataForPlayerIndexRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerIndex : number | null;
    skinId      : number | null;
    panel       : Panel;
}
class PlayerIndexRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._labelPlayerIndex.setText(playerIndex != null ? `P${playerIndex}` : Lang_Utils.getText(Lang_Constants.TextType.B0030));
        this._imgBg.loadSource(Helpers_ImageSource.getSkinButtonBackground(openData.skinId ?? 0));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForTileObjectRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dataForDrawTileObject   : MapEditor_Model_MeTypes.DataForDrawTileObject;
    skinId                  : number;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    panel                   : Panel;
    callback                : (tileObjectType: number, tileObjectShapeId: number, playerIndex: number) => void;
}
class TileObjectRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileObjectRenderer> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private _tileView   = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.TileAnimationTick,  callback : this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        tileView.startRunningView();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawTileObject = openData.dataForDrawTileObject;
        const tileObjectType        = dataForDrawTileObject.objectType;
        const gameConfig            = openData.gameConfig;
        this._labelName.setText(Lang_Utils.getTileObjectName(tileObjectType, gameConfig) ?? Lang_Constants.UndefinedError);
        this._tileView.init({
            tileObjectType        : tileObjectType,
            tileObjectShapeId     : dataForDrawTileObject.shapeId,
            tileBaseShapeId       : null,
            tileBaseType          : null,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            skinId                : openData.skinId,
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
        });
        this._tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawTileObject = openData.dataForDrawTileObject;
        openData.callback(dataForDrawTileObject.objectType, dataForDrawTileObject.shapeId, dataForDrawTileObject.playerIndex);
        openData.panel.closePanel();
    }
}
