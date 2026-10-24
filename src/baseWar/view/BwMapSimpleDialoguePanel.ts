import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as DialoguesConstants from "../../dialogues/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UiUtilsUiHelpers from "../../ui/utils/UiHelpers.ts";

export type OpenData = {
    war             : BaseWarInterfaceIBwWar.IBwWar;
    dialogueData    : ProtoSchemaCommonProtoMapMapSimpleDialogue.MapSimpleDialogue;
    callbackOnClose : () => void;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSkip!          : UiInterfacesIUiButton.IUiButton;
    private readonly _imgTouchMask!     : UiInterfacesIUiImage.IUiImage;

    private readonly _groupDialogue1!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupCo1!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCo1!           : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContent1!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDialogue2!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupCo2!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCo2!           : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName2!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContent2!    : UiInterfacesIUiLabel.IUiLabel;

    private _dialogueIndex  = -1;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnSkip,        callback: this._onTouchedBtnSkip },
            { ui: this._imgTouchMask,   callback: this._onTouchedImgTouchMask },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const oldOpenData = this.getPreviousOpenData();
        if (oldOpenData) {
            oldOpenData.callbackOnClose();
        }

        this._dialogueIndex = -1;
        this._groupDialogue1.setIsVisible(false);
        this._groupDialogue2.setIsVisible(false);
        this._tickDialogue();
    }
    protected override async _onClosed(): Promise<void> {
        this.getOpenData()?.callbackOnClose();

        await super._onClosed();
    }

    private _onTouchedBtnSkip(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0226),
            callback: () => this.closePanel(),
        });
    }
    private _onTouchedImgTouchMask(): void {
        if (HelpersMisc.getExisted(this.getOpenData()?.dialogueData.getDataArray())[this._dialogueIndex + 1]) {
            this._tickDialogue();
        } else {
            this.closePanel();
        }
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSkip.setText(LangUtils.getText(LangConstants.TextType.B0665));

        this._updateComponentsForDialogue();
    }

    private _updateComponentsForDialogue(): void {
        // const index             = this._dialogueIndex;
        // const dataArray         = Helpers.getExisted(this._getOpenData().actionData.dataArray);
        // const dataForCoDialogue = dataArray[index].dataForCoDialogue;
        // const labelName1        = this._labelName1;
        // const labelName2        = this._labelName2;
        // const labelContent1     = this._labelContent1;
        // const labelContent2     = this._labelContent2;
        // const imgCo1            = this._imgCo1;
        // const imgCo2            = this._imgCo2;
        // const configVersion     = Helpers.getExisted(ConfigManager.getLatestConfigVersion());

        // if (index === 0) {
        //     labelName1.text     = ``;
        //     labelName2.text     = ``;
        //     imgCo1.source       = ``;
        //     imgCo2.source       = ``;
        //     labelContent1.text  = ``;
        //     labelContent2.text  = ``;

        //     // if (dataForCoDialogue) {
        //     //     const nextData = dataArray[index + 1]?.dataForCoDialogue;
        //     //     if (nextData) {
        //     //         const nextSide = nextData.side;
        //     //         if (nextSide !== dataForCoDialogue.side) {
        //     //             const coId          = Helpers.getExisted(nextData.coId);
        //     //             const coImageSource = ConfigManager.getCoHeadImageSource(Helpers.getExisted(coId));
        //     //             const coName        = Lang.getLanguageText({ textArray: dataForCoDialogue.nameArray }) ?? ConfigManager.getCoNameAndTierText(configVersion, coId);
        //     //             if (nextSide === WarEventActionSimpleDialogueSide.Bottom) {
        //     //                 imgCo1.source   = coImageSource;
        //     //                 labelName1.text = coName;
        //     //             } else if (nextSide === WarEventActionSimpleDialogueSide.Top) {
        //     //                 imgCo2.source   = coImageSource;
        //     //                 labelName2.text = coName;
        //     //             }
        //     //         }
        //     //     }
        //     // }
        // }

        // const groupCo1 = this._groupCo1;
        // const groupCo2 = this._groupCo2;
        // if (dataForCoDialogue) {
        //     const { side, nameArray }   = dataForCoDialogue;
        //     const coId                  = Helpers.getExisted(dataForCoDialogue.coId);
        //     const coImageSource         = ConfigManager.getCoHeadImageSource(coId);
        //     const customName            = Lang.getLanguageText({ textArray: nameArray });
        //     const coName                = customName != null ? customName : ConfigManager.getCoNameAndTierText(configVersion, coId);

        //     if (side === WarEventActionSimpleDialogueSide.Bottom) {
        //         labelName1.text     = coName;
        //         imgCo1.source       = coImageSource;
        //         Helpers.changeColor(groupCo1, ColorType.Origin);
        //         Helpers.changeColor(groupCo2, ColorType.Dark);
        //         labelContent1.setRichText(Helpers.getExisted(Lang.getLanguageText({
        //             textArray   : dataForCoDialogue.textArray,
        //         })).replace(/\\n/g, "\n"));

        //     } else if (side === WarEventActionSimpleDialogueSide.Top) {
        //         labelName2.text     = coName;
        //         imgCo2.source       = coImageSource;
        //         Helpers.changeColor(groupCo1, ColorType.Dark);
        //         Helpers.changeColor(groupCo2, ColorType.Origin);
        //         labelContent2.setRichText(Helpers.getExisted(Lang.getLanguageText({
        //             textArray   : dataForCoDialogue.textArray,
        //         })).replace(/\\n/g, "\n"));

        //     } else {
        //         throw Helpers.newError(`BwSimpleDialoguePanel._updateComponentsForDialogue() invalid side.`);
        //     }

        // } else {
        //     throw Helpers.newError(`BwSimpleDialoguePanel._updateComponentsForDialogue() invalid data.`);
        // }
    }

    private _tickDialogue(): void {
        ++this._dialogueIndex;

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war               = openData.war;
        const gameConfig        = war.getGcData();
        const groupCo1          = this._groupCo1;
        const groupCo2          = this._groupCo2;
        const dataForDialogue   = HelpersMisc.getExisted(openData.dialogueData.getDataArray())[this._dialogueIndex];
        const dataForCoDialogue = dataForDialogue.getDataForCoDialogue();
        const dataForAside      = dataForDialogue.getDataForAside();

        if (dataForCoDialogue) {
            const playerIndex   = dataForCoDialogue.getPlayerIndex();
            const coId          = playerIndex == null ? HelpersMisc.getExisted(dataForCoDialogue.getCoId()) : war.getPlayer(playerIndex).getCoId();
            const coImageSource = HelpersImageSource.getCoHead(gameConfig, coId) ?? LangConstants.UndefinedError;
            const coName        = LangUtils.getLanguageText({ textArray: dataForCoDialogue.getNameArray() }) ?? gameConfig.getCoNameAndTierText(coId) ?? LangConstants.UndefinedError;
            const side          = dataForCoDialogue.getSide();

            if (side === DialoguesConstants.SmallDialogueSideId.Bottom) {
                this._groupDialogue1.setIsVisible(true);
                this._labelName1.setText(coName);
                this._imgCo1.loadSource(coImageSource);
                this._labelContent1.setText(war.getWarEventManager().handleEscapeText(
                    HelpersMisc.getExisted(LangUtils.getLanguageText({ textArray: dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                UiUtilsUiHelpers.changeColor(groupCo1, GraphicsConstants.ColorId.Origin);
                UiUtilsUiHelpers.changeColor(groupCo2, GraphicsConstants.ColorId.Dark);

            } else if (side === DialoguesConstants.SmallDialogueSideId.Top) {
                this._groupDialogue2.setIsVisible(true);
                this._labelName2.setText(coName);
                this._imgCo2.loadSource(coImageSource);
                this._labelContent2.setText(war.getWarEventManager().handleEscapeText(
                    HelpersMisc.getExisted(LangUtils.getLanguageText({ textArray: dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                UiUtilsUiHelpers.changeColor(groupCo1, GraphicsConstants.ColorId.Dark);
                UiUtilsUiHelpers.changeColor(groupCo2, GraphicsConstants.ColorId.Origin);

            } else {
                throw HelpersMisc.newError(`BwSimpleDialoguePanel._tickDialogue() invalid side.`);
            }

        } else if (dataForAside) {
            const side = dataForAside.getSide();
            if (side === DialoguesConstants.SmallDialogueSideId.Bottom) {
                this._groupDialogue1.setIsVisible(true);
                this._labelName1.setText(``);
                this._imgCo1.loadSource(``);
                this._labelContent1.setText(war.getWarEventManager().handleEscapeText(
                    HelpersMisc.getExisted(LangUtils.getLanguageText({ textArray: dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                UiUtilsUiHelpers.changeColor(groupCo1, GraphicsConstants.ColorId.Origin);
                UiUtilsUiHelpers.changeColor(groupCo2, GraphicsConstants.ColorId.Dark);

            } else if (side === DialoguesConstants.SmallDialogueSideId.Top) {
                this._groupDialogue2.setIsVisible(true);
                this._labelName2.setText(``);
                this._imgCo2.loadSource(``);
                this._labelContent2.setText(war.getWarEventManager().handleEscapeText(
                    HelpersMisc.getExisted(LangUtils.getLanguageText({ textArray: dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                UiUtilsUiHelpers.changeColor(groupCo1, GraphicsConstants.ColorId.Dark);
                UiUtilsUiHelpers.changeColor(groupCo2, GraphicsConstants.ColorId.Origin);

            } else {
                throw HelpersMisc.newError(`BwSimpleDialoguePanel._tickDialogue() invalid side.`);
            }
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        await TimerTimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await TimerTimerModel.wait();
    }
}
