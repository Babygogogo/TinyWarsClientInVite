import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UsersModel from "../../users/Model.ts";

export interface OpenData {
    currentPlayerIndex?         : number;
    showNeutralHeadquarters?    : boolean;
    gameConfig                  : GameConfigGcData.GcData;
    /** 从P0开始；必须连续；不能包含不可用的玩家；需把overriding计算在内 */
    finalSkinIdArray            : number[];
    callback                    : (tileObjectType: number, tileObjectShapeId: number, playerIndex: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _listPlayerIndex!  : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listTileObject!   : UiInterfacesIUiScrollList.IUiScrollList<DataForTileObjectRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,          callback: this.closePanel },
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
        const index = HelpersMisc.getExisted(list.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex));
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
        this._labelTitle.setLangText(LangConstants.TextType.TileObject);
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<void> {
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
        for (let playerIndex = PlayersConstants.PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
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
        for (const cfg of gameConfig.getAllTileObjectCfgArray()) {
            if ((cfg.tileObjectTypeId === TilesConstantsCommon.ObjectTypeId.Headquarters)     &&
                (playerIndex === PlayersConstants.PlayerIndex.Neutral)   &&
                (!openData.showNeutralHeadquarters)
            ) {
                continue;
            }
            if (((cfg.isNeutralOnly) && (playerIndex != null))  ||
                ((!cfg.isNeutralOnly) && (playerIndex == null))
            ) {
                continue;
            }

            const shapesCount = HelpersMisc.getExisted(UsersModel.getSelfSettingsTextureVersion() === GraphicsConstants.TextureVersionId.V0
                ? (cfg.shapesCountInEditorForV0 ?? cfg.shapesCountForV0)
                : (cfg.shapesCountInEditor ?? cfg.shapesCount)
            );
            for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                dataArray.push({
                    dataForDrawTileObject   : {
                        objectType      : cfg.tileObjectTypeId,
                        shapeId         : shapeId,
                        playerIndex     : playerIndex ?? 0,
                    },
                    skinId              : skinId,
                    gameConfig          : gameConfig,
                    panel               : this,
                    callback            : openData.callback,
                });
            }
        }

        await listTileObject.bindData(dataArray);
    }
}

interface DataForPlayerIndexRenderer extends UiTypesUiListItemData.UiListItemData {
    playerIndex : number | null;
    skinId      : number | null;
    panel       : Panel;
}
class PlayerIndexRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._labelPlayerIndex.setText(playerIndex != null ? `P${playerIndex}` : LangUtils.getText(LangConstants.TextType.B0030));
        this._imgBg.loadSource(HelpersImageSource.getSkinButtonBackground(openData.skinId ?? 0));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForTileObjectRenderer extends UiTypesUiListItemData.UiListItemData {
    dataForDrawTileObject   : MapEditorModelMeTypes.DataForDrawTileObject;
    skinId                  : number;
    gameConfig              : GameConfigGcData.GcData;
    panel                   : Panel;
    callback                : (tileObjectType: number, tileObjectShapeId: number, playerIndex: number) => void;
}
class TileObjectRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileObjectRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;

    private _tileView   = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
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
        this._labelName.setText(LangUtils.getTileObjectName(tileObjectType, gameConfig) ?? LangConstants.UndefinedError);
        this._tileView.init({
            tileObjectType          : tileObjectType,
            tileObjectShapeId       : dataForDrawTileObject.shapeId,
            tileBaseShapeId         : null,
            tileBaseType            : null,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            skinId                  : openData.skinId,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
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
