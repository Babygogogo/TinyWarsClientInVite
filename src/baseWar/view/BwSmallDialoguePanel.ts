import type { IBwWar } from "../interface/IBwWar.ts";
import { SmallDialogueSideId } from "../../dialogues/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorId } from "../../graphics/Constants.ts";
import { getCoHead } from "../../helpers/ImageSource.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WeaSmallDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaSmallDialogueSimple.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { changeColor } from "../../ui/utils/UiHelpers.ts";

export interface OpenData {
    war             : IBwWar;
    actionData      : WeaSmallDialogueSimple;
    callbackOnClose : () => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!            : IUiContainer;
    private readonly _btnSkip!          : IUiButton;
    private readonly _imgTouchMask!     : IUiImage;

    private readonly _groupDialogue1!   : IUiContainer;
    private readonly _groupCo1!         : IUiContainer;
    private readonly _imgCo1!           : IUiImage;
    private readonly _labelName1!       : IUiLabel;
    private readonly _labelContent1!    : IUiLabel;

    private readonly _groupDialogue2!   : IUiContainer;
    private readonly _groupCo2!         : IUiContainer;
    private readonly _imgCo2!           : IUiImage;
    private readonly _labelName2!       : IUiLabel;
    private readonly _labelContent2!    : IUiLabel;

    private _dialogueIndex  = -1;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnSkip,        callback: this._onTouchedBtnSkip },
            { ui: this._imgTouchMask,   callback: this._onTouchedImgTouchMask },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
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
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0226),
            callback: () => this.closePanel(),
        });
    }
    private _onTouchedImgTouchMask(): void {
        if (getExisted(this.getOpenData()?.actionData.getDataArray())[this._dialogueIndex + 1]) {
            this._tickDialogue();
        } else {
            this.closePanel();
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSkip.setText(getText(TextType.B0665));

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
        const dialogueData      = getExisted(getExisted(openData.actionData.getDataArray())[this._dialogueIndex]);
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        const dataForAside      = dialogueData.getDataForAside();

        if (dataForCoDialogue) {
            const playerIndex   = dataForCoDialogue.getPlayerIndex();
            const coId          = playerIndex == null ? getExisted(dataForCoDialogue.getCoId()) : war.getPlayer(playerIndex).getCoId();
            const coImageSource = getCoHead(gameConfig, coId) ?? UndefinedError;
            const coName        = getLanguageText({ textArray: dataForCoDialogue.getNameArray() }) ?? gameConfig.getCoNameAndTierText(coId) ?? UndefinedError;
            const side          = dataForCoDialogue.getSide();

            if (side === SmallDialogueSideId.Bottom) {
                this._groupDialogue1.setIsVisible(true);
                this._labelName1.setText(coName);
                this._imgCo1.loadSource(coImageSource);
                this._labelContent1.setText(war.getWarEventManager().handleEscapeText(
                    getExisted(getLanguageText({ textArray: dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                changeColor(groupCo1, ColorId.Origin);
                changeColor(groupCo2, ColorId.Dark);

            } else if (side === SmallDialogueSideId.Top) {
                this._groupDialogue2.setIsVisible(true);
                this._labelName2.setText(coName);
                this._imgCo2.loadSource(coImageSource);
                this._labelContent2.setText(war.getWarEventManager().handleEscapeText(
                    getExisted(getLanguageText({ textArray: dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                changeColor(groupCo1, ColorId.Dark);
                changeColor(groupCo2, ColorId.Origin);

            } else {
                throw newError(`BwSimpleDialoguePanel._tickDialogue() invalid side.`);
            }

        } else if (dataForAside) {
            const side = dataForAside.getSide();
            if (side === SmallDialogueSideId.Bottom) {
                this._groupDialogue1.setIsVisible(true);
                this._labelName1.setText(``);
                this._imgCo1.loadSource(``);
                this._labelContent1.setText(war.getWarEventManager().handleEscapeText(
                    getExisted(getLanguageText({ textArray: dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                changeColor(groupCo1, ColorId.Origin);
                changeColor(groupCo2, ColorId.Dark);

            } else if (side === SmallDialogueSideId.Top) {
                this._groupDialogue2.setIsVisible(true);
                this._labelName2.setText(``);
                this._imgCo2.loadSource(``);
                this._labelContent2.setText(war.getWarEventManager().handleEscapeText(
                    getExisted(getLanguageText({ textArray: dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
                ));
                changeColor(groupCo1, ColorId.Dark);
                changeColor(groupCo2, ColorId.Origin);

            } else {
                throw newError(`BwSimpleDialoguePanel._tickDialogue() invalid side.`);
            }
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await wait();
    }
}
