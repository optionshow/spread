import { SpreadParams, CalculationResult } from "../types";

/**
 * Calculates all metrics for the Taiex Option Spread based on the user-defined parameters
 */
export function calculateSpreadMetrics(params: SpreadParams): CalculationResult {
  const { strikeDifference, premium, targetReturnRate } = params;

  // 1. 獲利金額＝選擇價差成交價 * ＄50
  const profitAmount = premium * 50;

  // 2. 投入資金成本＝獲利金額 / 獲利率％ (e.g. 1.5% is 0.015)
  const rateDecimal = targetReturnRate / 100;
  const capitalCost = rateDecimal > 0 ? profitAmount / rateDecimal : 0;

  // 3. 價差成本＝（複式單履約價差-價差成交價）* ＄50
  const spreadCost = (strikeDifference - premium) * 50;

  // 4. 保留可用餘額％＝（投入資金成本-價差成本）/ 投入資金成本
  const availableBalancePercent = capitalCost > 0 
    ? (capitalCost - spreadCost) / capitalCost 
    : 0;

  // 5. 停損點數 (結果點數 最大等於複式單履約價差)
  const stopLoss100 = Math.min(strikeDifference, premium * 2);
  const stopLoss150 = Math.min(strikeDifference, premium * 2.5);
  const stopLoss200 = Math.min(strikeDifference, premium * 3);
  const stopLoss250 = Math.min(strikeDifference, premium * 3.5);
  const stopLoss300 = Math.min(strikeDifference, premium * 4);

  // 6. 建議保利降部位％＝獲利率％ * 0.85
  const suggestedReducePositionPercent = targetReturnRate * 0.85;

  // 7. 保留最大點數＝價差成交價 * 0.3
  const maxRetainedPoints = premium * 0.3;

  // 8. 最大虧損風險＝（複式單履約價差-價差成交價）* ＄50
  const maxLossRisk = (strikeDifference - premium) * 50;

  // 9. 最大虧損％＝最大虧損風險 / 推算投入資金成本
  const maxLossPercent = capitalCost > 0 ? maxLossRisk / capitalCost : 0;

  return {
    profitAmount,
    capitalCost,
    spreadCost,
    availableBalancePercent,
    stopLoss100,
    stopLoss150,
    stopLoss200,
    stopLoss250,
    stopLoss300,
    suggestedReducePositionPercent,
    maxRetainedPoints,
    maxLossRisk,
    maxLossPercent
  };
}

/**
 * Generates options strategy payoff points for plotting the interactive chart.
 * We can model either a bull spread or a bear spread. Let's model both!
 * 
 * For a Bull Put Spread (賣權看多價差 / Credit Put Spread):
 * - Buy Put at Strike A (lower)
 * - Sell Put at Strike B (higher, difference B - A = strikeDifference)
 * - Net Premium received = premium points
 * - Break even point = Strike B - premium points
 * - If Index >= Strike B: Max Profit = premium points * 50
 * - If Index <= Strike A: Max Loss = (Strike B - Strike A - premium) * 50 = (strikeDifference - premium) * 50
 * - If Strike A < Index < Strike B: Payoff = (Index - Strike B + premium) * 50
 * 
 * Let's generalize the chart to represent "Price change of local market relative to the short strike"
 * This allows a beautiful relative payoff chart without needing absolute strike selection!
 * If relative point offset (X) is from -1.5 * strikeDifference to +1 * strikeDifference:
 * - If Bull Put Spread (看多):
 *   - At offset 0 (Short Strike B): full profit (premium)
 *   - At offset -strikeDifference (Long Strike A): full loss (premium - strikeDifference)
 *   - Linear between -strikeDifference and 0
 */
export interface PayoffDataPoint {
  indexDiff: number; // 指數相對變動點數
  payoff: number;    // 單組損益 (TWD)
  label: string;     // 點數標籤
  isCurrent: boolean;
  isStopLossPoint?: boolean;
}

export function generatePayoffData(
  strikeDifference: number,
  premium: number,
  strategy: "bull" | "bear"
): PayoffDataPoint[] {
  const pointsMap = new Map<number, PayoffDataPoint>();

  const getPayoff = (offset: number): number => {
    if (strategy === "bull") {
      // Bull Put Spread:
      // Buy Put at A = -strikeDifference, Sell Put at B = 0
      if (offset >= 0) {
        return premium * 50;
      } else if (offset <= -strikeDifference) {
        return (premium - strikeDifference) * 50;
      } else {
        return (premium + offset) * 50;
      }
    } else {
      // Bear Call Spread:
      // Sell Call at B = 0, Buy Call at A = strikeDifference
      if (offset <= 0) {
        return premium * 50;
      } else if (offset >= strikeDifference) {
        return (premium - strikeDifference) * 50;
      } else {
        return (premium - offset) * 50;
      }
    }
  };

  const getLabelAndFlags = (offset: number): { label: string; isCurrent: boolean } => {
    if (offset === 0) {
      return { label: strategy === "bull" ? "空方賣權 (0點基準)" : "空方買權 (0點基準)", isCurrent: true };
    }
    const bePoint = strategy === "bull" ? -premium : premium;
    if (offset === bePoint) {
      return { label: `兩平點 (${offset > 0 ? "+" : ""}${offset}點)`, isCurrent: false };
    }
    const longStrike = strategy === "bull" ? -strikeDifference : strikeDifference;
    if (offset === longStrike) {
      return { label: strategy === "bull" ? `下檔履約價 (-${strikeDifference}點)` : `上檔履約價 (+${strikeDifference}點)`, isCurrent: false };
    }
    return { label: `相對偏離 ${offset > 0 ? "+" : ""}${offset}點`, isCurrent: false };
  };

  // Generate dense points
  const minRange = -1.5 * strikeDifference;
  const maxRange = 1.5 * strikeDifference;
  const step = Math.max(1, Math.round(strikeDifference / 20));

  // Add regular stepped points
  for (let offset = minRange; offset <= maxRange; offset += step) {
    const roundedOffset = Math.round(offset);
    pointsMap.set(roundedOffset, {
      indexDiff: roundedOffset,
      payoff: getPayoff(roundedOffset),
      ...getLabelAndFlags(roundedOffset)
    });
  }

  // Explicitly add/ensure all critical points exist
  const criticalOffsets = [
    Math.round(minRange),
    Math.round(-strikeDifference),
    Math.round(strategy === "bull" ? -premium : premium),
    0,
    Math.round(strikeDifference),
    Math.round(maxRange)
  ];

  criticalOffsets.forEach(offset => {
    pointsMap.set(offset, {
      indexDiff: offset,
      payoff: getPayoff(offset),
      ...getLabelAndFlags(offset)
    });
  });

  const uniquePoints = Array.from(pointsMap.values());
  return uniquePoints.sort((a, b) => a.indexDiff - b.indexDiff);
}
