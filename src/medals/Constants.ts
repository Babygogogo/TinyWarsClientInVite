import {
    type Medals_Types,
} from "../internal.ts";

// eslint-disable-next-line no-shadow
export const enum Common {
    MedalMaxShowCount       = 1,
}

// eslint-disable-next-line no-shadow
export const enum MedalTypeId {
    TournamentPrize = 1,
}

export const CfgDict = new Map<number, Medals_Types.MedalCfg>([
    // 类型参数备注
    // 1=联赛奖牌	第n届	第n名
    [1,     { medalId: 1,     typeParams: [1, 0, 1] }],   // #0联赛#1
    [2,     { medalId: 2,     typeParams: [1, 0, 2] }],   // #0联赛#2
    [3,     { medalId: 3,     typeParams: [1, 0, 3] }],   // #0联赛#3
    [4,     { medalId: 4,     typeParams: [1, 1, 1] }],   // #1联赛#1
    [5,     { medalId: 5,     typeParams: [1, 1, 2] }],   // #1联赛#2
    [6,     { medalId: 6,     typeParams: [1, 1, 3] }],   // #1联赛#3
    [7,     { medalId: 7,     typeParams: [1, 2, 1] }],   // #2联赛#1
    [8,     { medalId: 8,     typeParams: [1, 2, 2] }],   // #2联赛#2
    [9,     { medalId: 9,     typeParams: [1, 2, 3] }],   // #2联赛#3
    [10,    { medalId: 10,    typeParams: [1, 3, 1] }],   // #3联赛#1
    [11,    { medalId: 11,    typeParams: [1, 3, 2] }],   // #3联赛#2
    [12,    { medalId: 12,    typeParams: [1, 3, 3] }],   // #3联赛#3
    [13,    { medalId: 13,    typeParams: [1, 4, 1] }],   // #4联赛#1
    [14,    { medalId: 14,    typeParams: [1, 4, 2] }],   // #4联赛#2
    [15,    { medalId: 15,    typeParams: [1, 4, 3] }],   // #4联赛#3
    [16,    { medalId: 16,    typeParams: [1, 5, 1] }],   // #5联赛#1
    [17,    { medalId: 17,    typeParams: [1, 5, 2] }],   // #5联赛#2
    [18,    { medalId: 18,    typeParams: [1, 5, 3] }],   // #5联赛#3
    [19,    { medalId: 19,    typeParams: [1, 6, 1] }],   // #6联赛#1
    [20,    { medalId: 20,    typeParams: [1, 6, 2] }],   // #6联赛#2
    [21,    { medalId: 21,    typeParams: [1, 6, 3] }],   // #6联赛#3
    [22,    { medalId: 22,    typeParams: [1, 7, 1] }],   // #7联赛#1
    [23,    { medalId: 23,    typeParams: [1, 7, 2] }],   // #7联赛#2
    [24,    { medalId: 24,    typeParams: [1, 7, 3] }],   // #7联赛#3
    [25,    { medalId: 25,    typeParams: [1, 8, 1] }],   // #8联赛#1
    [26,    { medalId: 26,    typeParams: [1, 8, 2] }],   // #8联赛#2
    [27,    { medalId: 27,    typeParams: [1, 8, 3] }],   // #8联赛#3
    [28,    { medalId: 28,    typeParams: [1, 9, 1] }],   // #9联赛#1
    [29,    { medalId: 29,    typeParams: [1, 9, 2] }],   // #9联赛#2
    [30,    { medalId: 30,    typeParams: [1, 9, 3] }],   // #9联赛#3
]);
