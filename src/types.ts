export interface SpreadParams {
  strikeDifference: number; // 複式單履約價差 (50, 100, 150, 200)
  premium: number;          // 價差成交價 (最多不超過履約價差)
  targetReturnRate: number; // 獲利率% (1% - 4%)
}

export interface CalculationResult {
  profitAmount: number;         // 獲利金額 = 選擇價差成交價 * 50
  capitalCost: number;          // 投入資金成本 = 獲利金額 / 獲利率%
  spreadCost: number;           // 價差成本 = (複式單履約價差 - 價差成交價) * 50
  availableBalancePercent: number; // 保留可用餘額% = (投入資金成本 - 價差成本) / 投入資金成本

  // 停損點數 (結果點數最大等於複式單履約價差)
  stopLoss100: number; // 價差成交價 * 2
  stopLoss150: number; // 價差成交價 * 2.5
  stopLoss200: number; // 價差成交價 * 3
  stopLoss250: number; // 價差成交價 * 3.5
  stopLoss300: number; // 價差成交價 * 4

  suggestedReducePositionPercent: number; // 建議保利降部位% = 獲利率% * 0.75
  maxRetainedPoints: number;              // 保留最大點數 = 價差成交價 * 0.2
  maxLossRisk: number;                    // 最大虧損風險 = 價差成本
  maxLossPercent: number;                 // 最大虧損% = (複式單履約價差 - 價差成交價) / 複式單履約價差
}
