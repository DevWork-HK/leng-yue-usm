export enum CLASS {
  TIE_YI = 'TIE_YI',
  SU_WEN = 'SU_WEN',
}

export const classNameMap = new Map<CLASS, string>([
  [CLASS.TIE_YI, 'TIE YI'],
  [CLASS.SU_WEN, 'SU WEN'],
]);

export enum POSITION {
  OWNER = 'OWNER',
}
