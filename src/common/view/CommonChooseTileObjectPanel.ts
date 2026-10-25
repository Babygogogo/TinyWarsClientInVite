import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GcData } from "../../gameConfig/GcData.ts";
import { TextureVersionId } from "../../graphics/Constants.ts";
import { getSkinButtonBackground } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTileObjectName } from "../../lang/Utils.ts";
import type { DataForDrawTileObject } from "../../mapEditor/model/MeTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ObjectTypeId } from "../../tiles/constants/Common.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import { getSelfSettingsTextureVersion } from "../../users/Model.ts";

export interface OpenData {
    currentPlayerIndex?         : number;
    showNeutralHeadquarters?    : boolean;
    gameConfig                  : GcData;
    /** 从P0开始；必须连续；不能包含不可用的玩家；需把overriding计算在内 */
    finalSkinIdArray            : number[];
    callback                    : (tileObjectType: number, tileObjectShapeId: number, playerIndex: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _listPlayerIndex!  : IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listTileObject!   : IUiScrollList<DataForTileObjectRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        const index = getExisted(list.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex));
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
        this._labelTitle.setLangText(TextType.TileObject);
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: Undefinable<number>): Promise<void> {
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
        for (let playerIndex = PlayerIndex.Neutral; playerIndex <= maxPlayerIndex; ++playerIndex) {
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
        for (const cfg of GcData.getAllTileObjectCfgArray()) {
            if ((cfg.tileObjectTypeId === ObjectTypeId.Headquarters)     &&
                (playerIndex === PlayerIndex.Neutral)   &&
                (!openData.showNeutralHeadquarters)
            ) {
                continue;
            }
            if (((cfg.isNeutralOnly) && (playerIndex != null))  ||
                ((!cfg.isNeutralOnly) && (playerIndex == null))
            ) {
                continue;
            }

            const shapesCount = getExisted(getSelfSettingsTextureVersion() === TextureVersionId.V0
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

interface DataForPlayerIndexRenderer extends UiListItemData {
    playerIndex : number | null;
    skinId      : number | null;
    panel       : Panel;
}
class PlayerIndexRenderer extends UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _imgSelected!      : IUiImage;
    private readonly _imgBg!            : IUiImage;
    private readonly _labelPlayerIndex! : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._labelPlayerIndex.setText(playerIndex != null ? `P${playerIndex}` : getText(TextType.B0030));
        this._imgBg.loadSource(getSkinButtonBackground(openData.skinId ?? 0));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForTileObjectRenderer extends UiListItemData {
    dataForDrawTileObject   : DataForDrawTileObject;
    skinId                  : number;
    gameConfig              : GcData;
    panel                   : Panel;
    callback                : (tileObjectType: number, tileObjectShapeId: number, playerIndex: number) => void;
}
class TileObjectRenderer extends UiListItemRenderer<DataForTileObjectRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _labelName!    : IUiLabel;
    private readonly _conTileView!  : IUiContainer;

    private _tileView   = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
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
        this._labelName.setText(getTileObjectName(tileObjectType, gameConfig) ?? UndefinedError);
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
