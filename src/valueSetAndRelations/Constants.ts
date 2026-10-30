

 
export const enum SetRelationId {
    EqualTo         = 1,
    NotEqualTo,
    SupersetOf,
    NotSupersetOf,
    SubsetOf,
    NotSubsetOf,
    Intersection,
    NoIntersection,
}
export const AllSetRelationIdArray = [
    SetRelationId.EqualTo,
    SetRelationId.NotEqualTo,
    SetRelationId.SupersetOf,
    SetRelationId.NotSupersetOf,
    SetRelationId.SubsetOf,
    SetRelationId.NotSubsetOf,
    SetRelationId.Intersection,
    SetRelationId.NoIntersection,
];
