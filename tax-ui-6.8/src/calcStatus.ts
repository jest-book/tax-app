export type CalcStatus =
  // 計算前
  | 'before-calculation'
  // 計算中
  | 'under-calculation'
  // 計算成功
  | 'succeeded'
  // 計算失敗
  | 'failed'
