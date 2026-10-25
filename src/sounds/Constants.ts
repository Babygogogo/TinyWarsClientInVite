import type { BgmSfxCfg } from "./Types.ts";

// eslint-disable-next-line no-shadow
export const enum SoundTypeId {
    Bgm,
    Sfx,
}

// eslint-disable-next-line no-shadow
export const enum BgmSfxCode {
    None        = 0,
    CoEmpty     = 9999,
    Lobby       = 10000,
    MapEditor   = 10100,
    CoPower     = 10200,
}

// eslint-disable-next-line no-shadow
export const enum ShortSfxCode {
    None,
    FootMove01          = 100000,
    TireMove01          = 100001,
    TankMove01          = 100002,
    CopterMove01        = 100003,
    JetMove01           = 100004,
    NavalMove01         = 100005,
    ButtonNeutral01     = 100006,
    ButtonConfirm01     = 100007,
    ButtonCancel01      = 100008,
    ButtonForbidden01   = 100009,
    CursorConfirm01     = 100010,
    CursorMove01        = 100011,
    Explode             = 100012,
    Attack              = 100013,
    Block               = 100014,
    Capture             = 100015,
    SpendMoney          = 100016,
    UnitProduction      = 100017,
}

export const BgmSfxCfgDict = new Map<number, BgmSfxCfg>([
    [7,         { code: 7,      filename: "co0007.m4a",             nameTextId: 30003,  sortWeight: 11100,  isBgm: true,    loopStart: 10000,   loopEnd: 598240 } ],
    [2,         { code: 2,      filename: "co0002.m4a",             nameTextId: 30004,  sortWeight: 11101,  isBgm: true,    loopStart: 10000,   loopEnd: 650000 } ],
    [10,        { code: 10,     filename: "co0010.m4a",             nameTextId: 30008,  sortWeight: 11102,  isBgm: true,    loopStart: 49500,   loopEnd: 620000 } ],
    [1,         { code: 1,      filename: "co0001.m4a",             nameTextId: 30002,  sortWeight: 11103,  isBgm: true,    loopStart: 17500,   loopEnd: 567500 } ],
    [4,         { code: 4,      filename: "co0004.m4a",             nameTextId: 30010,  sortWeight: 11200,  isBgm: true,    loopStart: 32500,   loopEnd: 613500 } ],
    [5,         { code: 5,      filename: "co0005.m4a",             nameTextId: 30005,  sortWeight: 11201,  isBgm: true,    loopStart: 19200,   loopEnd: 630000 } ],
    [6,         { code: 6,      filename: "co0006.m4a",             nameTextId: 30009,  sortWeight: 11202,  isBgm: true,    loopStart: 7000,    loopEnd: 660000 } ],
    [8,         { code: 8,      filename: "co0008.m4a",             nameTextId: 30012,  sortWeight: 11300,  isBgm: true,    loopStart: 38300,   loopEnd: 650000 } ],
    [3,         { code: 3,      filename: "co0003.m4a",             nameTextId: 30011,  sortWeight: 11301,  isBgm: true,    loopStart: 40000,   loopEnd: 586000 } ],
    [11,        { code: 11,     filename: "co0011.m4a",             nameTextId: 30014,  sortWeight: 11400,  isBgm: true,    loopStart: 67200,   loopEnd: 604200 } ],
    [42,        { code: 42,     filename: "co0042.m4a",             nameTextId: 30025,  sortWeight: 11401,  isBgm: true,    loopStart: 76000,   loopEnd: 601000 } ],
    [9,         { code: 9,      filename: "co0009.m4a",             nameTextId: 30013,  sortWeight: 11402,  isBgm: true,    loopStart: 7000,    loopEnd: 720000 } ],
    [9999,      { code: 9999,   filename: "co9999.m4a",             nameTextId: 30006,  sortWeight: 11500,  isBgm: true,    loopStart: 85000,   loopEnd: 725000 } ],
    [20003,     { code: 20003,  filename: "story0004.m4a",          nameTextId: 30023,  sortWeight: 11501,  isBgm: true,    loopStart: 16760,   loopEnd: 322760 } ],    // cyrus
    [14,        { code: 14,     filename: "co0014.m4a",             nameTextId: 30017,  sortWeight: 11502,  isBgm: true,    loopStart: 11000,   loopEnd: 641170 } ],    // the beast
    [29,        { code: 29,     filename: "co0029.m4a",             nameTextId: 30040,  sortWeight: 12100,  isBgm: true,    loopStart: 45390,   loopEnd: 750130 } ],
    [47,        { code: 47,     filename: "co0047.m4a",             nameTextId: 30074,  sortWeight: 12101,  isBgm: true,    loopStart: 57450,   loopEnd: 768590 } ],
    [63,        { code: 63,     filename: "co0063.m4a",             nameTextId: 30074,  sortWeight: 12102,  isBgm: true,    loopStart: 44100,   loopEnd: 613000 } ],
    [30,        { code: 30,     filename: "co0030.m4a",             nameTextId: 30041,  sortWeight: 12103,  isBgm: true,    loopStart: 101310,  loopEnd: 661430 } ],
    [48,        { code: 48,     filename: "co0048.m4a",             nameTextId: 30075,  sortWeight: 12104,  isBgm: true,    loopStart: 105040,  loopEnd: 665040 } ],
    [65,        { code: 65,     filename: "co0065.m4a",             nameTextId: 30075,  sortWeight: 12105,  isBgm: true,    loopStart: 42970,   loopEnd: 448000 } ],
    [31,        { code: 31,     filename: "co0031.m4a",             nameTextId: 30042,  sortWeight: 12106,  isBgm: true,    loopStart: 1180,    loopEnd: 908050 } ],
    [32,        { code: 32,     filename: "co0032.m4a",             nameTextId: 30043,  sortWeight: 12107,  isBgm: true,    loopStart: 1170,    loopEnd: 701330 } ],
    [45,        { code: 45,     filename: "co0045.m4a",             nameTextId: 30072,  sortWeight: 12108,  isBgm: true,    loopStart: 23670,   loopEnd: 723670 } ],
    [84,        { code: 84,     filename: "co0084.m4a",             nameTextId: 30072,  sortWeight: 12109,  isBgm: true,    loopStart: 6060,    loopEnd: 706070 } ],    // max rbc power
    [33,        { code: 33,     filename: "co0033.m4a",             nameTextId: 30044,  sortWeight: 12110,  isBgm: true,    loopStart: 4770,    loopEnd: 614440 } ],
    [44,        { code: 44,     filename: "co0044.m4a",             nameTextId: 30071,  sortWeight: 12111,  isBgm: true,    loopStart: 7040,    loopEnd: 621430 } ],
    [62,        { code: 62,     filename: "co0062.m4a",             nameTextId: 30071,  sortWeight: 12112,  isBgm: true,    loopStart: 7040,    loopEnd: 621430 } ],
    [34,        { code: 34,     filename: "co0034.m4a",             nameTextId: 30045,  sortWeight: 12113,  isBgm: true,    loopStart: 17700,   loopEnd: 632260 } ],
    [35,        { code: 35,     filename: "co0035.m4a",             nameTextId: 30046,  sortWeight: 12114,  isBgm: true,    loopStart: 1280,    loopEnd: 610950 } ],
    [46,        { code: 46,     filename: "co0046.m4a",             nameTextId: 30073,  sortWeight: 12115,  isBgm: true,    loopStart: 12440,   loopEnd: 622000 } ],
    [64,        { code: 64,     filename: "co0064.m4a",             nameTextId: 30073,  sortWeight: 12116,  isBgm: true,    loopStart: 7200,    loopEnd: 616760 } ],
    [21,        { code: 21,     filename: "co0021.m4a",             nameTextId: 30032,  sortWeight: 12200,  isBgm: true,    loopStart: 42110,   loopEnd: 727990 } ],
    [51,        { code: 51,     filename: "co0051.m4a",             nameTextId: 30078,  sortWeight: 12201,  isBgm: true,    loopStart: 68510,   loopEnd: 754240 } ],    // colin rbc
    [87,        { code: 87,     filename: "co0087.m4a",             nameTextId: 30078,  sortWeight: 12202,  isBgm: true,    loopStart: 66290,   loopEnd: 716640 } ],    // colin rbc power
    [22,        { code: 22,     filename: "co0022.m4a",             nameTextId: 30033,  sortWeight: 12203,  isBgm: true,    loopStart: 121200,  loopEnd: 649750 } ],
    [50,        { code: 50,     filename: "co0050.m4a",             nameTextId: 30077,  sortWeight: 12204,  isBgm: true,    loopStart: 122000,  loopEnd: 655330 } ],
    [67,        { code: 67,     filename: "co0067.m4a",             nameTextId: 30077,  sortWeight: 12205,  isBgm: true,    loopStart: 136670,  loopEnd: 670000 } ],
    [23,        { code: 23,     filename: "co0023.m4a",             nameTextId: 30034,  sortWeight: 12206,  isBgm: true,    loopStart: 59750,   loopEnd: 629360 } ],
    [49,        { code: 49,     filename: "co0049.m4a",             nameTextId: 30076,  sortWeight: 12207,  isBgm: true,    loopStart: 24120,   loopEnd: 593620 } ],
    [66,        { code: 66,     filename: "co0066.m4a",             nameTextId: 30076,  sortWeight: 12208,  isBgm: true,    loopStart: 37500,   loopEnd: 607000 } ],
    [24,        { code: 24,     filename: "co0024.m4a",             nameTextId: 30035,  sortWeight: 12209,  isBgm: true,    loopStart: 8750,    loopEnd: 906500 } ],
    [37,        { code: 37,     filename: "co0037.m4a",             nameTextId: 30048,  sortWeight: 12300,  isBgm: true,    loopStart: 84970,   loopEnd: 725110 } ],
    [38,        { code: 38,     filename: "co0038.m4a",             nameTextId: 30049,  sortWeight: 12301,  isBgm: true,    loopStart: 46900,   loopEnd: 595610 } ],
    [52,        { code: 52,     filename: "co0052.m4a",             nameTextId: 30079,  sortWeight: 12302,  isBgm: true,    loopStart: 46390,   loopEnd: 600240 } ],
    [68,        { code: 68,     filename: "co0068.m4a",             nameTextId: 30079,  sortWeight: 12303,  isBgm: true,    loopStart: 74150,   loopEnd: 628000 } ],
    [39,        { code: 39,     filename: "co0039.m4a",             nameTextId: 30050,  sortWeight: 12304,  isBgm: true,    loopStart: 1180,    loopEnd: 634080 } ],
    [54,        { code: 54,     filename: "co0054.m4a",             nameTextId: 30081,  sortWeight: 12305,  isBgm: true,    loopStart: 910,     loopEnd: 633670 } ],
    [70,        { code: 70,     filename: "co0070.m4a",             nameTextId: 30081,  sortWeight: 12306,  isBgm: true,    loopStart: 20000,   loopEnd: 580000 } ],
    [88,        { code: 88,     filename: "co0088.m4a",             nameTextId: 30081,  sortWeight: 12307,  isBgm: true,    loopStart: 10380,   loopEnd: 570380 } ],    // sensei power 2, rbc
    [36,        { code: 36,     filename: "co0036.m4a",             nameTextId: 30047,  sortWeight: 12308,  isBgm: true,    loopStart: 1620,    loopEnd: 561740 } ],
    [53,        { code: 53,     filename: "co0053.m4a",             nameTextId: 30080,  sortWeight: 12309,  isBgm: true,    loopStart: 84960,   loopEnd: 539690 } ],
    [69,        { code: 69,     filename: "co0069.m4a",             nameTextId: 30080,  sortWeight: 12310,  isBgm: true,    loopStart: 89270,   loopEnd: 544000 } ],
    [25,        { code: 25,     filename: "co0025.m4a",             nameTextId: 30036,  sortWeight: 12400,  isBgm: true,    loopStart: 1190,    loopEnd: 601320 } ],
    [56,        { code: 56,     filename: "co0056.m4a",             nameTextId: 30083,  sortWeight: 12401,  isBgm: true,    loopStart: 89690,   loopEnd: 689690 } ],
    [72,        { code: 72,     filename: "co0072.m4a",             nameTextId: 30083,  sortWeight: 12402,  isBgm: true,    loopStart: 115000,  loopEnd: 635000 } ],
    [26,        { code: 26,     filename: "co0026.m4a",             nameTextId: 30037,  sortWeight: 12403,  isBgm: true,    loopStart: 1150,    loopEnd: 680100 } ],
    [55,        { code: 55,     filename: "co0055.m4a",             nameTextId: 30082,  sortWeight: 12404,  isBgm: true,    loopStart: 18410,   loopEnd: 711220 } ],
    [71,        { code: 71,     filename: "co0071.m4a",             nameTextId: 30082,  sortWeight: 12405,  isBgm: true,    loopStart: 91190,   loopEnd: 784000 } ],
    [27,        { code: 27,     filename: "co0027.m4a",             nameTextId: 30038,  sortWeight: 12406,  isBgm: true,    loopStart: 63600,   loopEnd: 590540 } ],
    [28,        { code: 28,     filename: "co0028.m4a",             nameTextId: 30039,  sortWeight: 12407,  isBgm: true,    loopStart: 260890,  loopEnd: 915570 } ],
    [57,        { code: 57,     filename: "co0057.m4a",             nameTextId: 30084,  sortWeight: 12408,  isBgm: true,    loopStart: 261660,  loopEnd: 916220 } ],
    [73,        { code: 73,     filename: "co0073.m4a",             nameTextId: 30084,  sortWeight: 12409,  isBgm: true,    loopStart: 11350,   loopEnd: 676000 } ],
    [15,        { code: 15,     filename: "co0015.m4a",             nameTextId: 30026,  sortWeight: 12500,  isBgm: true,    loopStart: 5000,    loopEnd: 605000 } ],
    [58,        { code: 58,     filename: "co0058.m4a",             nameTextId: 30085,  sortWeight: 12501,  isBgm: true,    loopStart: 23920,   loopEnd: 623910 } ],
    [74,        { code: 74,     filename: "co0074.m4a",             nameTextId: 30085,  sortWeight: 12502,  isBgm: true,    loopStart: 77970,   loopEnd: 678000 } ],    // adder rbc power
    [85,        { code: 85,     filename: "co0085.m4a",             nameTextId: 30106,  sortWeight: 12503,  isBgm: true,    loopStart: 62400,   loopEnd: 773540 } ],    // clone andy rbc
    [86,        { code: 86,     filename: "co0086.m4a",             nameTextId: 30106,  sortWeight: 12504,  isBgm: true,    loopStart: 64490,   loopEnd: 775630 } ],    // clone andy rbc power
    [16,        { code: 16,     filename: "co0016.m4a",             nameTextId: 30027,  sortWeight: 12505,  isBgm: true,    loopStart: 110000,  loopEnd: 794160 } ],    // flak
    [79,        { code: 79,     filename: "co0079.m4a",             nameTextId: 30098,  sortWeight: 12506,  isBgm: true,    loopStart: 4010,    loopEnd: 688000 } ],
    [75,        { code: 75,     filename: "co0075.m4a",             nameTextId: 30098,  sortWeight: 12507,  isBgm: true,    loopStart: 39000,   loopEnd: 723000 } ],
    [13,        { code: 13,     filename: "co0013.m4a",             nameTextId: 30016,  sortWeight: 12508,  isBgm: true,    loopStart: 28930,   loopEnd: 656780 } ],
    [59,        { code: 59,     filename: "co0059.m4a",             nameTextId: 30086,  sortWeight: 12509,  isBgm: true,    loopStart: 33870,   loopEnd: 661600 } ],
    [76,        { code: 76,     filename: "co0076.m4a",             nameTextId: 30086,  sortWeight: 12510,  isBgm: true,    loopStart: 42270,   loopEnd: 670000 } ],
    [40,        { code: 40,     filename: "co0040.m4a",             nameTextId: 30051,  sortWeight: 12511,  isBgm: true,    loopStart: 81190,   loopEnd: 817400 } ],
    [17,        { code: 17,     filename: "co0017.m4a",             nameTextId: 30028,  sortWeight: 12512,  isBgm: true,    loopStart: 20770,   loopEnd: 640280 } ],
    [18,        { code: 18,     filename: "co0018.m4a",             nameTextId: 30029,  sortWeight: 12513,  isBgm: true,    loopStart: 49750,   loopEnd: 944060 } ],
    [19,        { code: 19,     filename: "co0019.m4a",             nameTextId: 30030,  sortWeight: 12514,  isBgm: true,    loopStart: 89460,   loopEnd: 583680 } ],
    [60,        { code: 60,     filename: "co0060.m4a",             nameTextId: 30087,  sortWeight: 12515,  isBgm: true,    loopStart: 93870,   loopEnd: 588000 } ],
    [77,        { code: 77,     filename: "co0077.m4a",             nameTextId: 30087,  sortWeight: 12516,  isBgm: true,    loopStart: 19970,   loopEnd: 468000 } ],
    [41,        { code: 41,     filename: "co0041.m4a",             nameTextId: 30052,  sortWeight: 12517,  isBgm: true,    loopStart: 40,      loopEnd: 561720 } ],
    [61,        { code: 61,     filename: "co0061.m4a",             nameTextId: 30088,  sortWeight: 12518,  isBgm: true,    loopStart: 17940,   loopEnd: 577940 } ],
    [78,        { code: 78,     filename: "co0078.m4a",             nameTextId: 30088,  sortWeight: 12519,  isBgm: true,    loopStart: 2000,    loopEnd: 562000 } ],
    [20,        { code: 20,     filename: "co0020.m4a",             nameTextId: 30031,  sortWeight: 12520,  isBgm: true,    loopStart: 298560,  loopEnd: 961570 } ],
    [43,        { code: 43,     filename: "co0043.m4a",             nameTextId: 30070,  sortWeight: 13100,  isBgm: true,    loopStart: 307810,  loopEnd: 993520 } ],    // Cassie
    [81,        { code: 81,     filename: "co0081.m4a",             nameTextId: 30101,  sortWeight: 13101,  isBgm: true,    loopStart: 6430,    loopEnd: 707550 } ],
    [89,        { code: 89,     filename: "co0089.m4a",             nameTextId: 30128,  sortWeight: 13102,  isBgm: true,    loopStart: 80100,   loopEnd: 811520 } ],    // Davis
    [9998,      { code: 9998,   filename: "co9998.m4a",             nameTextId: 30007,  sortWeight: 13103,  isBgm: true,    loopStart: 46000,   loopEnd: 1153400 } ],   // Grat
    [83,        { code: 83,     filename: "co0083.m4a",             nameTextId: 30105,  sortWeight: 13104,  isBgm: true,    loopStart: 31840,   loopEnd: 837550 } ],    // Judy
    [82,        { code: 82,     filename: "co0082.m4a",             nameTextId: 30104,  sortWeight: 13105,  isBgm: true,    loopStart: 19950,   loopEnd: 1108020 } ],   // Snowind
    [80,        { code: 80,     filename: "co0080.m4a",             nameTextId: 30100,  sortWeight: 13106,  isBgm: true,    loopStart: 3490,    loopEnd: 717030 } ],    // The Fanatic
    [10200,     { code: 10200,  filename: "power00.m4a",            nameTextId: 30015,  sortWeight: 14000,  isBgm: true,    loopStart: 29700,   loopEnd: 380000 } ],
    [10201,     { code: 10201,  filename: "power01.m4a",            nameTextId: 30021,  sortWeight: 14001,  isBgm: true,    loopStart: 27940,   loopEnd: 406890 } ],
    [10202,     { code: 10202,  filename: "power02.m4a",            nameTextId: 30053,  sortWeight: 14002,  isBgm: true,    loopStart: 11020,   loopEnd: 454190 } ],
    [10206,     { code: 10206,  filename: "power06.m4a",            nameTextId: 30089,  sortWeight: 14003,  isBgm: true,    loopStart: 25650,   loopEnd: 468750 } ],
    [10203,     { code: 10203,  filename: "power03.m4a",            nameTextId: 30054,  sortWeight: 14004,  isBgm: true,    loopStart: 11760,   loopEnd: 491870 } ],
    [10207,     { code: 10207,  filename: "power07.m4a",            nameTextId: 30090,  sortWeight: 14005,  isBgm: true,    loopStart: 30100,   loopEnd: 514000 } ],
    [10204,     { code: 10204,  filename: "power04.m4a",            nameTextId: 30055,  sortWeight: 14006,  isBgm: true,    loopStart: 13660,   loopEnd: 501890 } ],
    [10208,     { code: 10208,  filename: "power08.m4a",            nameTextId: 30091,  sortWeight: 14007,  isBgm: true,    loopStart: 23310,   loopEnd: 511460 } ],
    [10205,     { code: 10205,  filename: "power05.m4a",            nameTextId: 30056,  sortWeight: 14008,  isBgm: true,    loopStart: 7940,    loopEnd: 353590 } ],
    [10209,     { code: 10209,  filename: "power09.m4a",            nameTextId: 30092,  sortWeight: 14009,  isBgm: true,    loopStart: 16620,   loopEnd: 365000 } ],
    [20012,     { code: 20012,  filename: "story0013.m4a",          nameTextId: 30064,  sortWeight: 20000,  isBgm: true,    loopStart: 1170,    loopEnd: 394020 } ],
    [20019,     { code: 20019,  filename: "story0019.m4a",          nameTextId: 30093,  sortWeight: 20001,  isBgm: true,    loopStart: 2270,    loopEnd: 395000 } ],
    [20013,     { code: 20013,  filename: "story0014.m4a",          nameTextId: 30065,  sortWeight: 20002,  isBgm: true,    loopStart: 1170,    loopEnd: 601300 } ],
    [20020,     { code: 20020,  filename: "story0020.m4a",          nameTextId: 30094,  sortWeight: 20003,  isBgm: true,    loopStart: 74480,   loopEnd: 682000 } ],
    [20016,     { code: 20016,  filename: "story0017.m4a",          nameTextId: 30068,  sortWeight: 20004,  isBgm: true,    loopStart: 1170,    loopEnd: 405480 } ],
    [20021,     { code: 20021,  filename: "story0021.m4a",          nameTextId: 30095,  sortWeight: 20005,  isBgm: true,    loopStart: 63600,   loopEnd: 370000 } ],
    [20014,     { code: 20014,  filename: "story0015.m4a",          nameTextId: 30066,  sortWeight: 20006,  isBgm: true,    loopStart: 1160,    loopEnd: 361240 } ],
    [20022,     { code: 20022,  filename: "story0022.m4a",          nameTextId: 30096,  sortWeight: 20007,  isBgm: true,    loopStart: 2000,    loopEnd: 362000 } ],
    [20017,     { code: 20017,  filename: "story0018.m4a",          nameTextId: 30069,  sortWeight: 20008,  isBgm: true,    loopStart: 1390,    loopEnd: 335420 } ],
    [20023,     { code: 20023,  filename: "story0023.m4a",          nameTextId: 30097,  sortWeight: 20009,  isBgm: true,    loopStart: 5140,    loopEnd: 342000 } ],
    [20001,     { code: 20001,  filename: "story0002.m4a",          nameTextId: 30020,  sortWeight: 30000,  isBgm: true,    loopStart: 0,       loopEnd: 423640 } ],    // Apocalypse - Chaos Suite, dor
    [20004,     { code: 20004,  filename: "story0005.m4a",          nameTextId: 30024,  sortWeight: 30001,  isBgm: true,    loopStart: 46190,   loopEnd: 355950 } ],    // battle ready, dor
    [20043,     { code: 20043,  filename: "story0043.m4a",          nameTextId: 30127,  sortWeight: 30002,  isBgm: true,    loopStart: 34800,   loopEnd: 234800 } ],    // black hole coming, rbc
    [10100,     { code: 10100,  filename: "mapEditor01.m4a",        nameTextId: 30001,  sortWeight: 30003,  isBgm: true,    loopStart: 7000,    loopEnd: 360000 } ],    // design time, dor
    [10102,     { code: 10102,  filename: "mapEditor03.m4a",        nameTextId: 30107,  sortWeight: 30004,  isBgm: true,    loopStart: 139070,  loopEnd: 5205220 } ],   // design time, rbc
    [20000,     { code: 20000,  filename: "story0001.m4a",          nameTextId: 30019,  sortWeight: 30005,  isBgm: true,    loopStart: 40000,   loopEnd: 466770 } ],    // destructive tendencies, dor
    [20042,     { code: 20042,  filename: "story0042.m4a",          nameTextId: 30126,  sortWeight: 30006,  isBgm: true,    loopStart: 104730,  loopEnd: 575310 } ],    // enigma, rbc
    [20024,     { code: 20024,  filename: "story0024.m4a",          nameTextId: 30108,  sortWeight: 30007,  isBgm: true,    loopStart: 0,       loopEnd: 1800000 } ],   // epilogue, rbc
    [20025,     { code: 20025,  filename: "story0025.m4a",          nameTextId: 30109,  sortWeight: 30008,  isBgm: true,    loopStart: 70360,   loopEnd: 790350 } ],    // factory domination, rbc
    [20026,     { code: 20026,  filename: "story0026.m4a",          nameTextId: 30110,  sortWeight: 30009,  isBgm: true,    loopStart: 53440,   loopEnd: 262080 } ],    // fanfare, rbc
    [20027,     { code: 20027,  filename: "story0027.m4a",          nameTextId: 30111,  sortWeight: 30010,  isBgm: true,    loopStart: 53860,   loopEnd: 533860 } ],    // fanfare 2, rbc
    [20028,     { code: 20028,  filename: "story0028.m4a",          nameTextId: 30112,  sortWeight: 30011,  isBgm: true,    loopStart: 161370,  loopEnd: 1281360 } ],   // final front, rbc
    [10001,     { code: 10001,  filename: "lobby02.m4a",            nameTextId: 30018,  sortWeight: 30012,  isBgm: true,    loopStart: 36080,   loopEnd: 343330 } ],    // First Strike, dor
    [20029,     { code: 20029,  filename: "story0029.m4a",          nameTextId: 30113,  sortWeight: 30013,  isBgm: true,    loopStart: 70890,   loopEnd: 395590 } ],    // It's War!, rbc
    [20030,     { code: 20030,  filename: "story0030.m4a",          nameTextId: 30114,  sortWeight: 30014,  isBgm: true,    loopStart: 15550,   loopEnd: 520370 } ],    // kanbei's resolve, rbc
    [20031,     { code: 20031,  filename: "story0031.m4a",          nameTextId: 30115,  sortWeight: 30015,  isBgm: true,    loopStart: 100460,  loopEnd: 564970 } ],    // macro land map, rbc
    [20032,     { code: 20032,  filename: "story0032.m4a",          nameTextId: 30116,  sortWeight: 30016,  isBgm: true,    loopStart: 32540,   loopEnd: 250720 } ],    // mighty kanbei, rbc
    [20033,     { code: 20033,  filename: "story0033.m4a",          nameTextId: 30117,  sortWeight: 30017,  isBgm: true,    loopStart: 95720,   loopEnd: 495720 } ],    // move out!, rbc
    [20002,     { code: 20002,  filename: "story0003.m4a",          nameTextId: 30022,  sortWeight: 30018,  isBgm: true,    loopStart: 13040,   loopEnd: 511150 } ],    // road to war, dor
    [20034,     { code: 20034,  filename: "story0034.m4a",          nameTextId: 30118,  sortWeight: 30019,  isBgm: true,    loopStart: 24790,   loopEnd: 310080 } ],    // sniper!, rbc
    [20035,     { code: 20035,  filename: "story0035.m4a",          nameTextId: 30119,  sortWeight: 30020,  isBgm: true,    loopStart: 93100,   loopEnd: 722670 } ],    // sonja's goal!, rbc
    [20036,     { code: 20036,  filename: "story0036.m4a",          nameTextId: 30120,  sortWeight: 30022,  isBgm: true,    loopStart: 81290,   loopEnd: 934610 } ],    // the world of macro land, rbc
    [20037,     { code: 20037,  filename: "story0037.m4a",          nameTextId: 30121,  sortWeight: 30023,  isBgm: true,    loopStart: 0,       loopEnd: 1714410 } ],   // victory fanfare, rbc
    [10000,     { code: 10000,  filename: "lobby01.m4a",            nameTextId: 30000,  sortWeight: 30024,  isBgm: true,    loopStart: 160700,  loopEnd: 580700 } ],    // wandering path, dor
    [20040,     { code: 20040,  filename: "story0040.m4a",          nameTextId: 30124,  sortWeight: 30025,  isBgm: true,    loopStart: 70880,   loopEnd: 306160 } ],    // wars world news, rbc
    [20041,     { code: 20041,  filename: "story0041.m4a",          nameTextId: 30125,  sortWeight: 30026,  isBgm: true,    loopStart: 186410,  loopEnd: 506430 } ],    // wars world news 2, rbc
    [20038,     { code: 20038,  filename: "story0038.m4a",          nameTextId: 30122,  sortWeight: 30027,  isBgm: true,    loopStart: 50240,   loopEnd: 520830 } ],    // wars world news (online), rbc
    [20039,     { code: 20039,  filename: "story0039.m4a",          nameTextId: 30123,  sortWeight: 30028,  isBgm: true,    loopStart: 179980,  loopEnd: 500000 } ],    // wars world news 2 (online), rbc
    [20005,     { code: 20005,  filename: "story0006.m4a",          nameTextId: 30057,  sortWeight: 31000,  isBgm: true,    loopStart: 4920,    loopEnd: 214770 } ],
    [20006,     { code: 20006,  filename: "story0007.m4a",          nameTextId: 30058,  sortWeight: 31001,  isBgm: true,    loopStart: 50,      loopEnd: 200650 } ],
    [10101,     { code: 10101,  filename: "mapEditor02.m4a",        nameTextId: 30103,  sortWeight: 31002,  isBgm: true,    loopStart: 60360,   loopEnd: 491910 } ],
    [20011,     { code: 20011,  filename: "story0012.m4a",          nameTextId: 30063,  sortWeight: 31003,  isBgm: true,    loopStart: 1210,    loopEnd: 809830 } ],
    [20009,     { code: 20009,  filename: "story0010.m4a",          nameTextId: 30061,  sortWeight: 31004,  isBgm: true,    loopStart: 16240,   loopEnd: 784430 } ],
    [20008,     { code: 20008,  filename: "story0009.m4a",          nameTextId: 30060,  sortWeight: 31005,  isBgm: true,    loopStart: 1170,    loopEnd: 560570 } ],
    [10002,     { code: 10002,  filename: "lobby03.m4a",            nameTextId: 30102,  sortWeight: 31006,  isBgm: true,    loopStart: 21830,   loopEnd: 465000 } ],
    [20007,     { code: 20007,  filename: "story0008.m4a",          nameTextId: 30059,  sortWeight: 31007,  isBgm: true,    loopStart: 229800,  loopEnd: 732780 } ],
    [20010,     { code: 20010,  filename: "story0011.m4a",          nameTextId: 30062,  sortWeight: 31008,  isBgm: true,    loopStart: 10100,   loopEnd: 438050 } ],
    [20015,     { code: 20015,  filename: "story0016.m4a",          nameTextId: 30067,  sortWeight: 31009,  isBgm: true,    loopStart: 38180,   loopEnd: 702960 } ],
    [10300,     { code: 10300,  filename: "blank00.m4a",            nameTextId: 30099,  sortWeight: 99999,  isBgm: true,    loopStart: 100,     loopEnd: 9900 } ],
    [100000,    { code: 100000, filename: "footMove.mp3",           nameTextId: 50000,  sortWeight: 0,      isBgm: false,   loopStart: 0,       loopEnd: 1530 } ],
    [100001,    { code: 100001, filename: "tireMove.mp3",           nameTextId: 50001,  sortWeight: 0,      isBgm: false,   loopStart: 6200,    loopEnd: 8860 } ],
    [100002,    { code: 100002, filename: "tankMove.mp3",           nameTextId: 50002,  sortWeight: 0,      isBgm: false,   loopStart: 1500,    loopEnd: 2500 } ],
    [100003,    { code: 100003, filename: "copterMove.mp3",         nameTextId: 50003,  sortWeight: 0,      isBgm: false,   loopStart: 600,     loopEnd: 12760 } ],
    [100004,    { code: 100004, filename: "jetMove.mp3",            nameTextId: 50004,  sortWeight: 0,      isBgm: false,   loopStart: 15180,   loopEnd: 17100 } ],
    [100005,    { code: 100005, filename: "navalMove.mp3",          nameTextId: 50005,  sortWeight: 0,      isBgm: false,   loopStart: 15200,   loopEnd: 26100 } ],
    [100006,    { code: 100006, filename: "buttonNeutral01.mp3",    nameTextId: 50006,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100007,    { code: 100007, filename: "buttonConfirm01.mp3",    nameTextId: 50007,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100008,    { code: 100008, filename: "buttonCancel01.mp3",     nameTextId: 50008,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100009,    { code: 100009, filename: "buttonForbidden01.mp3",  nameTextId: 50009,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100010,    { code: 100010, filename: "cursorConfirm01.mp3",    nameTextId: 50010,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100011,    { code: 100011, filename: "cursorMove01.mp3",       nameTextId: 50011,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100012,    { code: 100012, filename: "explode.mp3",            nameTextId: 50012,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100013,    { code: 100013, filename: "attack.m4a",             nameTextId: 50013,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100014,    { code: 100014, filename: "block.m4a",              nameTextId: 50014,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100015,    { code: 100015, filename: "capture.m4a",            nameTextId: 50015,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100016,    { code: 100016, filename: "spendMoney.m4a",         nameTextId: 50016,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
    [100017,    { code: 100017, filename: "unitProduction.m4a",     nameTextId: 50017,  sortWeight: 0,      isBgm: false,   loopStart: null,    loopEnd: null } ],
]);
