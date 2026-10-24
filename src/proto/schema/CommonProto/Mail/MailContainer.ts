import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MailAcceptMap as $Message$CommonProto$Mail$MailAcceptMap, type MailAcceptMapJson as $Json$CommonProto$Mail$MailAcceptMap } from "./MailAcceptMap.js";
import { MailAcceptSpectate as $Message$CommonProto$Mail$MailAcceptSpectate, type MailAcceptSpectateJson as $Json$CommonProto$Mail$MailAcceptSpectate } from "./MailAcceptSpectate.js";
import { MailAutoTourneyWinners as $Message$CommonProto$Mail$MailAutoTourneyWinners, type MailAutoTourneyWinnersJson as $Json$CommonProto$Mail$MailAutoTourneyWinners } from "./MailAutoTourneyWinners.js";
import { MailCawValidationResult as $Message$CommonProto$Mail$MailCawValidationResult, type MailCawValidationResultJson as $Json$CommonProto$Mail$MailCawValidationResult } from "./MailCawValidationResult.js";
import { MailCcrInvite as $Message$CommonProto$Mail$MailCcrInvite, type MailCcrInviteJson as $Json$CommonProto$Mail$MailCcrInvite } from "./MailCcrInvite.js";
import { MailEndWarNotification as $Message$CommonProto$Mail$MailEndWarNotification, type MailEndWarNotificationJson as $Json$CommonProto$Mail$MailEndWarNotification } from "./MailEndWarNotification.js";
import { MailMcrInvite as $Message$CommonProto$Mail$MailMcrInvite, type MailMcrInviteJson as $Json$CommonProto$Mail$MailMcrInvite } from "./MailMcrInvite.js";
import { MailMfrInvite as $Message$CommonProto$Mail$MailMfrInvite, type MailMfrInviteJson as $Json$CommonProto$Mail$MailMfrInvite } from "./MailMfrInvite.js";
import { MailMrwBoot as $Message$CommonProto$Mail$MailMrwBoot, type MailMrwBootJson as $Json$CommonProto$Mail$MailMrwBoot } from "./MailMrwBoot.js";
import { MailSrwValidationResult as $Message$CommonProto$Mail$MailSrwValidationResult, type MailSrwValidationResultJson as $Json$CommonProto$Mail$MailSrwValidationResult } from "./MailSrwValidationResult.js";

export interface MailContainerJson extends $ProtoSchemaJsonBase {
    mailEndWarNotification?: $Json$CommonProto$Mail$MailEndWarNotification | null | undefined;
    mailMcrInvite?: $Json$CommonProto$Mail$MailMcrInvite | null | undefined;
    mailCcrInvite?: $Json$CommonProto$Mail$MailCcrInvite | null | undefined;
    mailMfrInvite?: $Json$CommonProto$Mail$MailMfrInvite | null | undefined;
    mailAcceptMap?: $Json$CommonProto$Mail$MailAcceptMap | null | undefined;
    mailAutoTourneyWinners?: $Json$CommonProto$Mail$MailAutoTourneyWinners | null | undefined;
    mailSrwValidationResult?: $Json$CommonProto$Mail$MailSrwValidationResult | null | undefined;
    mailCawValidationResult?: $Json$CommonProto$Mail$MailCawValidationResult | null | undefined;
    mailAcceptSpectate?: $Json$CommonProto$Mail$MailAcceptSpectate | null | undefined;
    mailMrwBoot?: $Json$CommonProto$Mail$MailMrwBoot | null | undefined;
}

export class MailContainer extends $ProtoSchemaBase {
    private _mailEndWarNotification?: $Message$CommonProto$Mail$MailEndWarNotification | null | undefined;
    private _mailMcrInvite?: $Message$CommonProto$Mail$MailMcrInvite | null | undefined;
    private _mailCcrInvite?: $Message$CommonProto$Mail$MailCcrInvite | null | undefined;
    private _mailMfrInvite?: $Message$CommonProto$Mail$MailMfrInvite | null | undefined;
    private _mailAcceptMap?: $Message$CommonProto$Mail$MailAcceptMap | null | undefined;
    private _mailAutoTourneyWinners?: $Message$CommonProto$Mail$MailAutoTourneyWinners | null | undefined;
    private _mailSrwValidationResult?: $Message$CommonProto$Mail$MailSrwValidationResult | null | undefined;
    private _mailCawValidationResult?: $Message$CommonProto$Mail$MailCawValidationResult | null | undefined;
    private _mailAcceptSpectate?: $Message$CommonProto$Mail$MailAcceptSpectate | null | undefined;
    private _mailMrwBoot?: $Message$CommonProto$Mail$MailMrwBoot | null | undefined;

    public static fromJson(obj: MailContainerJson): MailContainer {
        return new MailContainer().loadJson(obj);
    }
    public override loadJson(obj: MailContainerJson): this {
        this.setMailEndWarNotification(obj.mailEndWarNotification != null ? $Message$CommonProto$Mail$MailEndWarNotification.fromJson(obj.mailEndWarNotification) : null);
        this.setMailMcrInvite(obj.mailMcrInvite != null ? $Message$CommonProto$Mail$MailMcrInvite.fromJson(obj.mailMcrInvite) : null);
        this.setMailCcrInvite(obj.mailCcrInvite != null ? $Message$CommonProto$Mail$MailCcrInvite.fromJson(obj.mailCcrInvite) : null);
        this.setMailMfrInvite(obj.mailMfrInvite != null ? $Message$CommonProto$Mail$MailMfrInvite.fromJson(obj.mailMfrInvite) : null);
        this.setMailAcceptMap(obj.mailAcceptMap != null ? $Message$CommonProto$Mail$MailAcceptMap.fromJson(obj.mailAcceptMap) : null);
        this.setMailAutoTourneyWinners(obj.mailAutoTourneyWinners != null ? $Message$CommonProto$Mail$MailAutoTourneyWinners.fromJson(obj.mailAutoTourneyWinners) : null);
        this.setMailSrwValidationResult(obj.mailSrwValidationResult != null ? $Message$CommonProto$Mail$MailSrwValidationResult.fromJson(obj.mailSrwValidationResult) : null);
        this.setMailCawValidationResult(obj.mailCawValidationResult != null ? $Message$CommonProto$Mail$MailCawValidationResult.fromJson(obj.mailCawValidationResult) : null);
        this.setMailAcceptSpectate(obj.mailAcceptSpectate != null ? $Message$CommonProto$Mail$MailAcceptSpectate.fromJson(obj.mailAcceptSpectate) : null);
        this.setMailMrwBoot(obj.mailMrwBoot != null ? $Message$CommonProto$Mail$MailMrwBoot.fromJson(obj.mailMrwBoot) : null);
        return this;
    }
    public override toJson(obj?: MailContainerJson): MailContainerJson {
        obj ??= ({} as MailContainerJson);

        {
            const value = this.getMailEndWarNotification();
            (value != null) && (obj.mailEndWarNotification = value.toJson());
        }

        {
            const value = this.getMailMcrInvite();
            (value != null) && (obj.mailMcrInvite = value.toJson());
        }

        {
            const value = this.getMailCcrInvite();
            (value != null) && (obj.mailCcrInvite = value.toJson());
        }

        {
            const value = this.getMailMfrInvite();
            (value != null) && (obj.mailMfrInvite = value.toJson());
        }

        {
            const value = this.getMailAcceptMap();
            (value != null) && (obj.mailAcceptMap = value.toJson());
        }

        {
            const value = this.getMailAutoTourneyWinners();
            (value != null) && (obj.mailAutoTourneyWinners = value.toJson());
        }

        {
            const value = this.getMailSrwValidationResult();
            (value != null) && (obj.mailSrwValidationResult = value.toJson());
        }

        {
            const value = this.getMailCawValidationResult();
            (value != null) && (obj.mailCawValidationResult = value.toJson());
        }

        {
            const value = this.getMailAcceptSpectate();
            (value != null) && (obj.mailAcceptSpectate = value.toJson());
        }

        {
            const value = this.getMailMrwBoot();
            (value != null) && (obj.mailMrwBoot = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMailEndWarNotification();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getMailMcrInvite();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getMailCcrInvite();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getMailMfrInvite();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getMailAcceptMap();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getMailAutoTourneyWinners();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getMailSrwValidationResult();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getMailCawValidationResult();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getMailAcceptSpectate();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getMailMrwBoot();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailContainer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailContainer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMailEndWarNotification($Message$CommonProto$Mail$MailEndWarNotification.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setMailMcrInvite($Message$CommonProto$Mail$MailMcrInvite.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setMailCcrInvite($Message$CommonProto$Mail$MailCcrInvite.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setMailMfrInvite($Message$CommonProto$Mail$MailMfrInvite.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setMailAcceptMap($Message$CommonProto$Mail$MailAcceptMap.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setMailAutoTourneyWinners($Message$CommonProto$Mail$MailAutoTourneyWinners.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setMailSrwValidationResult($Message$CommonProto$Mail$MailSrwValidationResult.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setMailCawValidationResult($Message$CommonProto$Mail$MailCawValidationResult.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setMailAcceptSpectate($Message$CommonProto$Mail$MailAcceptSpectate.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setMailMrwBoot($Message$CommonProto$Mail$MailMrwBoot.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailContainer {
        return MailContainer.decode(this.encode());
    }

    public override getSchemaName(): "MailContainer" {
        return "MailContainer";
    }

    public checkHasMailEndWarNotification(): boolean {
        return this._mailEndWarNotification != null;
    }
    public getMailEndWarNotification(): $Message$CommonProto$Mail$MailEndWarNotification | null | undefined {
        return this._mailEndWarNotification;
    }
    public setMailEndWarNotification(value: $Message$CommonProto$Mail$MailEndWarNotification | null | undefined): void {
        this._mailEndWarNotification = value;
    }
    public createIfNotExistsMailEndWarNotification(): $Message$CommonProto$Mail$MailEndWarNotification {
        return this._mailEndWarNotification ??= new $Message$CommonProto$Mail$MailEndWarNotification();
    }

    public checkHasMailMcrInvite(): boolean {
        return this._mailMcrInvite != null;
    }
    public getMailMcrInvite(): $Message$CommonProto$Mail$MailMcrInvite | null | undefined {
        return this._mailMcrInvite;
    }
    public setMailMcrInvite(value: $Message$CommonProto$Mail$MailMcrInvite | null | undefined): void {
        this._mailMcrInvite = value;
    }
    public createIfNotExistsMailMcrInvite(): $Message$CommonProto$Mail$MailMcrInvite {
        return this._mailMcrInvite ??= new $Message$CommonProto$Mail$MailMcrInvite();
    }

    public checkHasMailCcrInvite(): boolean {
        return this._mailCcrInvite != null;
    }
    public getMailCcrInvite(): $Message$CommonProto$Mail$MailCcrInvite | null | undefined {
        return this._mailCcrInvite;
    }
    public setMailCcrInvite(value: $Message$CommonProto$Mail$MailCcrInvite | null | undefined): void {
        this._mailCcrInvite = value;
    }
    public createIfNotExistsMailCcrInvite(): $Message$CommonProto$Mail$MailCcrInvite {
        return this._mailCcrInvite ??= new $Message$CommonProto$Mail$MailCcrInvite();
    }

    public checkHasMailMfrInvite(): boolean {
        return this._mailMfrInvite != null;
    }
    public getMailMfrInvite(): $Message$CommonProto$Mail$MailMfrInvite | null | undefined {
        return this._mailMfrInvite;
    }
    public setMailMfrInvite(value: $Message$CommonProto$Mail$MailMfrInvite | null | undefined): void {
        this._mailMfrInvite = value;
    }
    public createIfNotExistsMailMfrInvite(): $Message$CommonProto$Mail$MailMfrInvite {
        return this._mailMfrInvite ??= new $Message$CommonProto$Mail$MailMfrInvite();
    }

    public checkHasMailAcceptMap(): boolean {
        return this._mailAcceptMap != null;
    }
    public getMailAcceptMap(): $Message$CommonProto$Mail$MailAcceptMap | null | undefined {
        return this._mailAcceptMap;
    }
    public setMailAcceptMap(value: $Message$CommonProto$Mail$MailAcceptMap | null | undefined): void {
        this._mailAcceptMap = value;
    }
    public createIfNotExistsMailAcceptMap(): $Message$CommonProto$Mail$MailAcceptMap {
        return this._mailAcceptMap ??= new $Message$CommonProto$Mail$MailAcceptMap();
    }

    public checkHasMailAutoTourneyWinners(): boolean {
        return this._mailAutoTourneyWinners != null;
    }
    public getMailAutoTourneyWinners(): $Message$CommonProto$Mail$MailAutoTourneyWinners | null | undefined {
        return this._mailAutoTourneyWinners;
    }
    public setMailAutoTourneyWinners(value: $Message$CommonProto$Mail$MailAutoTourneyWinners | null | undefined): void {
        this._mailAutoTourneyWinners = value;
    }
    public createIfNotExistsMailAutoTourneyWinners(): $Message$CommonProto$Mail$MailAutoTourneyWinners {
        return this._mailAutoTourneyWinners ??= new $Message$CommonProto$Mail$MailAutoTourneyWinners();
    }

    public checkHasMailSrwValidationResult(): boolean {
        return this._mailSrwValidationResult != null;
    }
    public getMailSrwValidationResult(): $Message$CommonProto$Mail$MailSrwValidationResult | null | undefined {
        return this._mailSrwValidationResult;
    }
    public setMailSrwValidationResult(value: $Message$CommonProto$Mail$MailSrwValidationResult | null | undefined): void {
        this._mailSrwValidationResult = value;
    }
    public createIfNotExistsMailSrwValidationResult(): $Message$CommonProto$Mail$MailSrwValidationResult {
        return this._mailSrwValidationResult ??= new $Message$CommonProto$Mail$MailSrwValidationResult();
    }

    public checkHasMailCawValidationResult(): boolean {
        return this._mailCawValidationResult != null;
    }
    public getMailCawValidationResult(): $Message$CommonProto$Mail$MailCawValidationResult | null | undefined {
        return this._mailCawValidationResult;
    }
    public setMailCawValidationResult(value: $Message$CommonProto$Mail$MailCawValidationResult | null | undefined): void {
        this._mailCawValidationResult = value;
    }
    public createIfNotExistsMailCawValidationResult(): $Message$CommonProto$Mail$MailCawValidationResult {
        return this._mailCawValidationResult ??= new $Message$CommonProto$Mail$MailCawValidationResult();
    }

    public checkHasMailAcceptSpectate(): boolean {
        return this._mailAcceptSpectate != null;
    }
    public getMailAcceptSpectate(): $Message$CommonProto$Mail$MailAcceptSpectate | null | undefined {
        return this._mailAcceptSpectate;
    }
    public setMailAcceptSpectate(value: $Message$CommonProto$Mail$MailAcceptSpectate | null | undefined): void {
        this._mailAcceptSpectate = value;
    }
    public createIfNotExistsMailAcceptSpectate(): $Message$CommonProto$Mail$MailAcceptSpectate {
        return this._mailAcceptSpectate ??= new $Message$CommonProto$Mail$MailAcceptSpectate();
    }

    public checkHasMailMrwBoot(): boolean {
        return this._mailMrwBoot != null;
    }
    public getMailMrwBoot(): $Message$CommonProto$Mail$MailMrwBoot | null | undefined {
        return this._mailMrwBoot;
    }
    public setMailMrwBoot(value: $Message$CommonProto$Mail$MailMrwBoot | null | undefined): void {
        this._mailMrwBoot = value;
    }
    public createIfNotExistsMailMrwBoot(): $Message$CommonProto$Mail$MailMrwBoot {
        return this._mailMrwBoot ??= new $Message$CommonProto$Mail$MailMrwBoot();
    }
}
