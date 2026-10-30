import {
    Ui_Utils_UiHelpers,
    Graphics_Constants,
    Tween_Executor,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Dialogues_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { WeaSmallDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";

export interface OpenData {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    actionData      : WeaSmallDialogueSimple;
    callbackOnClose : () => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSkip!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgTouchMask!     : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupDialogue1!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupCo1!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCo1!           : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContent1!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDialogue2!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupCo2!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCo2!           : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName2!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContent2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private _dialogueIndex  = -1;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnSkip,        callback : this._onTouchedBtnSkip },
            { ui : this._imgTouchMask,   callback : this._onTouchedImgTouchMask },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,  callback : this._onNotifyLanguageChanged },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0226),
            callback   : () => this.closePanel(),
        });
    }
    private _onTouchedImgTouchMask(): void {
        if (Helpers_Misc.getExisted(this.getOpenData()?.actionData.getDataArray())[this._dialogueIndex + 1]) {
            this._tickDialogue();
        } else {
            this.closePanel();
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSkip.setLangText(Lang_Constants.TextType.B0665);

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
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        ++this._dialogueIndex;

        const war               = openData.war;
        const gameConfig        = war.getGcData();
        const groupCo1          = this._groupCo1;
        const groupCo2          = this._groupCo2;
        const dialogueData      = Helpers_Misc.getExisted(openData.actionData.getDataArray()[this._dialogueIndex]);
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        const dataForAside      = dialogueData.getDataForAside();

        if (dataForCoDialogue) {
            const playerIndex   = dataForCoDialogue.getPlayerIndex();
            const coId          = playerIndex == null ? Helpers_Misc.getExisted(dataForCoDialogue.getCoId()) : war.getPlayer(playerIndex).getCoId();
            const coImageSource = Helpers_ImageSource.getCoHead(gameConfig, coId) ?? Lang_Constants.UndefinedError;
            const coName        = Lang_Utils.getLanguageText({ textArray : dataForCoDialogue.getNameArray() }) ?? gameConfig.getCoNameAndTierText(coId) ?? Lang_Constants.UndefinedError;
            const side          = dataForCoDialogue.getSide();

            if (side === Dialogues_Constants.SmallDialogueSideId.Bottom) {
                this._groupDialogue1.setIsVisible(true);
                this._labelName1.setText(coName);
                this._imgCo1.loadSource(coImageSource);
                this._labelContent1.setText(war.getWarEventManager().handleEscapeText(
                    Helpers_Misc.getExisted(Lang_Utils.getLanguageText({ textArray : dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                Ui_Utils_UiHelpers.changeColor(groupCo1, Graphics_Constants.ColorId.Origin);
                Ui_Utils_UiHelpers.changeColor(groupCo2, Graphics_Constants.ColorId.Dark);

            } else if (side === Dialogues_Constants.SmallDialogueSideId.Top) {
                this._groupDialogue2.setIsVisible(true);
                this._labelName2.setText(coName);
                this._imgCo2.loadSource(coImageSource);
                this._labelContent2.setText(war.getWarEventManager().handleEscapeText(
                    Helpers_Misc.getExisted(Lang_Utils.getLanguageText({ textArray : dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                Ui_Utils_UiHelpers.changeColor(groupCo1, Graphics_Constants.ColorId.Dark);
                Ui_Utils_UiHelpers.changeColor(groupCo2, Graphics_Constants.ColorId.Origin);

            } else {
                throw Helpers_Misc.newError(`BwSimpleDialoguePanel._tickDialogue() invalid side.`);
            }

        } else if (dataForAside) {
            const side = dataForAside.getSide();
            if (side === Dialogues_Constants.SmallDialogueSideId.Bottom) {
                this._groupDialogue1.setIsVisible(true);
                this._labelName1.setText(``);
                this._imgCo1.loadSource(``);
                this._labelContent1.setText(war.getWarEventManager().handleEscapeText(
                    Helpers_Misc.getExisted(Lang_Utils.getLanguageText({ textArray : dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                Ui_Utils_UiHelpers.changeColor(groupCo1, Graphics_Constants.ColorId.Origin);
                Ui_Utils_UiHelpers.changeColor(groupCo2, Graphics_Constants.ColorId.Dark);

            } else if (side === Dialogues_Constants.SmallDialogueSideId.Top) {
                this._groupDialogue2.setIsVisible(true);
                this._labelName2.setText(``);
                this._imgCo2.loadSource(``);
                this._labelContent2.setText(war.getWarEventManager().handleEscapeText(
                    Helpers_Misc.getExisted(Lang_Utils.getLanguageText({ textArray : dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                Ui_Utils_UiHelpers.changeColor(groupCo1, Graphics_Constants.ColorId.Dark);
                Ui_Utils_UiHelpers.changeColor(groupCo2, Graphics_Constants.ColorId.Origin);

            } else {
                throw Helpers_Misc.newError(`BwSimpleDialoguePanel._tickDialogue() invalid side.`);
            }
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._group,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._group,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        await Timer_TimerModel.wait();
    }
}
