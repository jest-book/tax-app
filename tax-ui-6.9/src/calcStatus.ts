export type CalcStatus =
  // 計算前
  | 'before-calculation'
  // 計算中
  | 'under-calculation'
  // 長い計算中
  | 'under-long-calculation'
  // 計算終了
  | 'done'

export type CalcResultStatus =
  // 未計算
  | 'no-result'
  // 計算成功
  | 'succeeded'
  // 計算失敗
  | 'failed'
