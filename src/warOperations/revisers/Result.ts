import {
    AuxiliaryTypes_MovePath,
    Utils_ClientErrorCode,
} from "../../internal";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer";

export class Result {
    public readonly errorCode : Utils_ClientErrorCode.ClientErrorCode;
    public readonly operation : WoContainer | undefined;
    public readonly movePath  : AuxiliaryTypes_MovePath.MovePath | undefined;

    public static create(errorCode: Utils_ClientErrorCode.ClientErrorCode): Result {
        return new Result(errorCode);
    }

    public static create2(operation: WoContainer, movePath?: AuxiliaryTypes_MovePath.MovePath): Result {
        return new Result(Utils_ClientErrorCode.ClientErrorCode.NoError, operation, movePath);
    }

    private constructor(errorCode: Utils_ClientErrorCode.ClientErrorCode, operation?: WoContainer, movePath?: AuxiliaryTypes_MovePath.MovePath) {
        this.errorCode = errorCode;
        this.operation = operation;
        this.movePath = movePath;
    }
}
