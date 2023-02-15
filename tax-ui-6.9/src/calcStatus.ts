export type CalcStatus =
  // 計算前
  | 'before'
  // 計算中
  | 'calculating'
  // 長い計算中
  | 'long-calculating'
  // 計算終了
  | 'done'

export type CalcResultStatus =
  // 未計算
  | 'notyet'
  // 計算成功
  | 'succeeded'
  // 計算失敗
  | 'failed'
