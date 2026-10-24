import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarModelBwWar from "../baseWar/model/BwWar.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState from "../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager from "../proto/schema/CommonProto/WarSerialization/SerialTaskObjectiveManager.ts";

type TaskObjectiveState         = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState;
type TaskObjectiveFullData      = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData;
type SerialTaskObjectiveManager = ProtoSchemaCommonProtoWarSerializationSerialTaskObjectiveManager.SerialTaskObjectiveManager;
type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IBwWar                     = BaseWarModelBwWar.BwWar;

export interface ITaskObjectiveManager {
    init(data: Undefinable<SerialTaskObjectiveManager>, taskObjectiveFullData: Undefinable<TaskObjectiveFullData>): void;
    fastInit(data: Undefinable<SerialTaskObjectiveManager>): void;

    serialize(): SerialTaskObjectiveManager;
    serializeForCreateMfr(): SerialTaskObjectiveManager;
    serializeForCreateSfw(): SerialTaskObjectiveManager;

    startRunning(war: IBwWar): void;

    getWar(): IBwWar;

    getStateArray(): TaskObjectiveState[];
    updateState(state: TaskObjectiveState): boolean;

    autoUpdateAllCurrentProgresses(): void;

    getScore(): number;
}
