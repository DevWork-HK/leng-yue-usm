export enum CLASS {
  TIE_YI = 'TIE_YI',
  SU_WEN = 'SU_WEN',
  SUI_MENG = 'SUI_MENG',
  XUAN_JI = 'XUAN_JI',
  XUE_HE = 'XUE_HE',
  SHEN_XIANG = 'SHEN_XIANG',
  LONG_YIN = 'LONG_YIN',
  JIU_LING = 'JIU_LING',
}

export const classNameMap = new Map<CLASS, string>([
  [CLASS.TIE_YI, '鐵衣'],
  [CLASS.SU_WEN, '素問'],
  [CLASS.JIU_LING, '九靈'],
  [CLASS.LONG_YIN, '龍吟'],
  [CLASS.SHEN_XIANG, '神相'],
  [CLASS.SUI_MENG, '碎夢'],
  [CLASS.XUAN_JI, '玄機'],
  [CLASS.XUE_HE, '血河'],
]);

export enum POSITION {
  DA_DANG_JIA = 'DA_DANG_JIA',
  ER_DANG_JIA = 'ER_DANG_JIA',
  SAN_DANG_JIA = 'SAN_DANG_JIA',
  SI_DANG_JIA = 'SI_DANG_JIA',
  WU_DANG_JIA = 'WU_DANG_JIA',
  RONG_YU_BANG_ZHONG = 'RONG_YU_BANG_ZHONG',
  TANG_ZHU = 'TANG_ZHU',
  FU_TANG_ZHU = 'FU_TANG_ZHU',
  BANG_ZHONG = 'BANG_ZHONG',
}

export const positionNameMap = new Map<POSITION, string>([
  [POSITION.DA_DANG_JIA, '大當家'],
  [POSITION.ER_DANG_JIA, '二當家'],
  [POSITION.SAN_DANG_JIA, '三當家'],
  [POSITION.SI_DANG_JIA, '四當家'],
  [POSITION.WU_DANG_JIA, '五當家'],
  [POSITION.RONG_YU_BANG_ZHONG, '榮譽幫眾'],
  [POSITION.TANG_ZHU, '堂主'],
  [POSITION.FU_TANG_ZHU, '副堂主'],
  [POSITION.BANG_ZHONG, '幫眾'],
]);

export const positionHierarchy = new Map<POSITION, number>([
  [POSITION.DA_DANG_JIA, 1],
  [POSITION.ER_DANG_JIA, 2],
  [POSITION.SAN_DANG_JIA, 3],
  [POSITION.SI_DANG_JIA, 4],
  [POSITION.WU_DANG_JIA, 5],
  [POSITION.RONG_YU_BANG_ZHONG, 6],
  [POSITION.TANG_ZHU, 7],
  [POSITION.FU_TANG_ZHU, 8],
  [POSITION.BANG_ZHONG, 9],
]);
