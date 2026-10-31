import {
    Helpers_Gzip,
    LocalData_DeprecatedIndexedDbAccessor,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import { MapEditorData } from "../proto/schema/CommonProto/Map/MapEditorData.ts";
import { MapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";

export function init(): Promise<void> {
    return LocalData_DeprecatedIndexedDbAccessor.initDatabase();
}

export const StoreNormalMapRawData = new LocalData_DeprecatedIndexedDbAccessor.Store1<number, MapRawData, Uint8Array>({
    storeName : "NormalMapRawData",
    encode    : mapRawData    => Helpers_Gzip.compress(mapRawData.encode()),
    decode    : encodedData   => MapRawData.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMeFullData = new LocalData_DeprecatedIndexedDbAccessor.Store2<AuxiliaryTypes_AuxiliaryTypes.DecodedMapEditorData, Uint8Array>({    // userId, slotIndex
    storeName : "MeFullData",
    encode    : data => Helpers_Gzip.compress(MapEditorData.fromJson({
        slotIndex                 : data.slotIndex,
        reviewComment             : data.reviewComment,
        reviewStatus              : data.reviewStatus,
        encodedMapRawData         : data.mapRawData?.encode(),
        dataTimestamp             : data.dataTimestamp,
        srcNormalMapIdForAddEvent : data.srcNormalMapIdForAddEvent,
        gridMarkData              : data.gridMarkData?.toJson(),
    }).encode()),
    decode : encodedData => {
        const data              = MapEditorData.decode(Helpers_Gzip.decompress(encodedData));
        const encodedMapRawData = data.getEncodedMapRawData();
        return {
            slotIndex                 : data.getSlotIndex(),
            reviewComment             : data.getReviewComment() ?? null,
            reviewStatus              : data.getReviewStatus(),
            mapRawData                : encodedMapRawData ? MapRawData.decode(encodedMapRawData) : null,
            dataTimestamp             : data.getDataTimestamp(),
            srcNormalMapIdForAddEvent : data.getSrcNormalMapIdForAddEvent() ?? null,
            gridMarkData              : data.getGridMarkData(),
        };
    },
});
export const StoreCampaignMapRawData = new LocalData_DeprecatedIndexedDbAccessor.Store2<MapRawData, Uint8Array>({
    storeName : "CampaignMapRawData",
    encode    : mapRawData    => Helpers_Gzip.compress(mapRawData.encode()),
    decode    : encodedData   => MapRawData.decode(Helpers_Gzip.decompress(encodedData)),
});
