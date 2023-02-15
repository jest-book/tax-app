export type CalcStatus =
  // 計算前
  | 'before'
  // 計算中
  | 'calculating'
  // 計算成功
  | 'succeeded'
  // 計算失敗
  | 'failed'
