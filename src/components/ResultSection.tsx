import React from "react";
import { CalculationResult, SpreadParams } from "../types";
import { 
  TrendingUp, 
  Coins, 
  Wallet, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Activity, 
  HelpCircle 
} from "lucide-react";

interface ResultSectionProps {
  params: SpreadParams;
  results: CalculationResult;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ params, results }) => {
  const formatTWD = (value: number) => {
    return `NT$ ${Math.round(value).toLocaleString("zh-TW")}`;
  };

  const formatPercentVal = (val: number): string => {
    const rounded = Math.round(val * 10) / 10;
    if (rounded % 1 === 0) {
      return `${Math.round(rounded)}%`;
    }
    return `${rounded.toFixed(1)}%`;
  };

  const formatPercent = (value: number) => {
    return formatPercentVal(value * 100);
  };

  const formatPoints = (value: number) => {
    return `${value.toFixed(1)} 點`;
  };

  const isAvailableBalanceCritical = results.availableBalancePercent < 0;
  const isAvailableBalanceLow = results.availableBalancePercent >= 0 && results.availableBalancePercent < 0.25;

  return (
    <div className="space-y-6">
      
      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: 預期獲利金額 */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                每組預期獲利金額
              </span>
              <h4 className="text-2xl font-extrabold font-mono text-emerald-400">
                {formatTWD(results.profitAmount)}
              </h4>
            </div>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-semibold text-slate-400 shrink-0">公式:</span>
              <span className="font-mono bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] truncate">
                {params.premium}點 * $50
              </span>
            </div>
            <div className="group relative ml-2">
              <HelpCircle className="w-3.5 h-3.5 cursor-help text-slate-500 hover:text-slate-400" />
              <div className="absolute right-0 bottom-6 w-52 bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg text-[10px] invisible group-hover:visible z-50 leading-normal pointer-events-none">
                以加權指數每點 NT$50 為基本契約價值。
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: 投入資金成本 */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                推算投入資金成本
              </span>
              <h4 className="text-2xl font-extrabold font-mono text-violet-400">
                {formatTWD(results.capitalCost)}
              </h4>
            </div>
            <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-semibold text-slate-400 shrink-0">公式:</span>
              <span className="font-mono bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] truncate">
                獲利 / {params.targetReturnRate}%
              </span>
            </div>
            <div className="group relative ml-2">
              <HelpCircle className="w-3.5 h-3.5 cursor-help text-slate-500 hover:text-slate-400" />
              <div className="absolute right-0 bottom-6 w-52 bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg text-[10px] invisible group-hover:visible z-50 leading-normal pointer-events-none">
                根據您的目標獲利率目標，倒推該合約在其配置安全水位內所容許的防禦或承載預算資金額度。
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3: 價差成本 */}
        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                複式單價差保證金
              </span>
              <h4 className="text-2xl font-extrabold font-mono text-cyan-400">
                {formatTWD(results.spreadCost)}
              </h4>
            </div>
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-semibold text-slate-400 shrink-0">公式:</span>
              <span className="font-mono bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] truncate">
                ({params.strikeDifference} - {params.premium}) * $50
              </span>
            </div>
            <div className="group relative ml-2">
              <HelpCircle className="w-3.5 h-3.5 cursor-help text-slate-500 hover:text-slate-400" />
              <div className="absolute right-0 bottom-6 w-52 bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg text-[10px] invisible group-hover:visible z-50 leading-normal pointer-events-none">
                多空雙向履約價差所需扣除的最大保證金。這是期交所規定的最大履約損失保證金額。
              </div>
            </div>
          </div>
        </div>

        {/* KPI 4: 保留可用餘額% */}
        <div className={`bento-card p-5 flex flex-col justify-between border transition-all ${
          isAvailableBalanceCritical 
            ? "border-red-500/40 bg-red-950/15" 
            : isAvailableBalanceLow 
              ? "border-amber-500/40 bg-amber-950/15"
              : "border-emerald-500/30 bg-emerald-950/5"
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                保留可用餘額 %
              </span>
              <h4 className={`text-2xl font-extrabold font-mono ${
                isAvailableBalanceCritical 
                  ? "text-red-400 animate-pulse" 
                  : isAvailableBalanceLow 
                    ? "text-amber-400"
                    : "text-emerald-400"
              }`}>
                {Math.round(results.availableBalancePercent * 100)}%
              </h4>
            </div>
            <div className={`p-2 rounded-lg ${
              isAvailableBalanceCritical 
                ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                : isAvailableBalanceLow 
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            }`}>
              <Wallet className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-semibold text-slate-400 shrink-0">公式:</span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] truncate">
                (資金 - 價差) / 資金
              </span>
            </div>
            <div className="group relative ml-2">
              <HelpCircle className="w-3.5 h-3.5 cursor-help text-slate-500 hover:text-slate-400" />
              <div className="absolute right-0 bottom-6 w-52 bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg text-[10px] invisible group-hover:visible z-50 leading-normal pointer-events-none">
                若餘額為負，表示資金分配上限不足以給付最低合約價差值要求。請調小目標獲利率%或拉高權利金。
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Safety alert if negative available balance */}
      {isAvailableBalanceCritical && (
        <div id="leverage-danger-banner" className="bg-red-950/40 border border-red-500/30 text-red-300 rounded-2xl p-5 flex gap-4 items-start shadow-xl">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1.5">
            <h5 className="font-bold text-sm text-red-200">危險警報：保證金超限且財務槓桿偏高！</h5>
            <p className="text-xs leading-relaxed text-slate-300">
              目前「推算資金成本上限」低於「複式單價差成本」。要滿足目標獲利率 <b>{formatPercentVal(params.targetReturnRate)}</b>，配額總資產 <b>({formatTWD(results.capitalCost)})</b> 還不足以支付交易所規定的最壞清算保證金 <b>({formatTWD(results.spreadCost)})</b>！在現實操作中，這是<b>高融資槓桿</b>，有很高的強制斷頭風險。
            </p>
            <p className="text-xs font-semibold text-emerald-400 pt-1">
              💡 安全指南：建議調整「成交點數」使其更高，或「下調目標獲利率%」以反算更安全穩健的配置防守資金。
            </p>
          </div>
        </div>
      )}

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Risk Limits & Exit Targets */}
        <div className="bento-card p-6 space-y-6">
          <h4 className="text-xs font-bold uppercase text-slate-300 tracking-widest flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            建議保利與最大防守限度
          </h4>

          <div className="space-y-4">
            
            {/* 建議保利降部位% */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">
                  建議保利降部位 %
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  公式： 目標 {formatPercentVal(params.targetReturnRate)} * 0.75
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-emerald-400 block">
                  {formatPercentVal(results.suggestedReducePositionPercent)}
                </span>
                <span className="text-[9px] text-slate-500 block">此獲利下應縮減部位</span>
              </div>
            </div>

            {/* 保留最大點數 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">
                  利潤保護最大保留點數值
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  公式： 成交價 {params.premium} * 0.25
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-indigo-400 block">
                  {formatPoints(results.maxRetainedPoints)}
                </span>
                <span className="text-[9px] text-slate-500 block">利潤回吐警戒點</span>
              </div>
            </div>

            {/* 最大虧損風險 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-rose-400 block">
                  每組最大絕對虧損金額
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  公式： ({params.strikeDifference} - {params.premium}) * $50
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-rose-400 block">
                  {formatTWD(results.maxLossRisk)}
                </span>
                <span className="text-[9px] text-slate-500 block">極端穿價的最壞災損</span>
              </div>
            </div>

            {/* 最大虧損% */}
            <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">
                  極端最壞虧損比例 %
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  公式： 最大虧損 / 推算投入資金成本
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-slate-300 block">
                  {formatPercent(results.maxLossPercent)}
                </span>
                <span className="text-[9px] text-slate-500 block">承擔風險點比</span>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Stop-loss Ladder Panel */}
        <div className="bento-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              動態停損梯級觸發關卡
            </h4>
            <span className="text-[9px] bg-red-400/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono font-medium">
              上限: {params.strikeDifference}點
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            當指數不利跳空或方向變動，複式單權利金將隨之放大。一旦達到以下停損標準點數，建請依指示進行減碼或進行斷尾動作：
          </p>

          <div className="divide-y divide-slate-800/80">
            {[
              { label: "停損 -100% 關卡點", value: results.stopLoss100, factor: "2.0x 基準", desc: "部位承受一倍權利金虧損，宜將持倉砍半觀望。" },
              { label: "停損 -150% 關卡點", value: results.stopLoss150, factor: "2.5x 基準", desc: "觸及防守黃金線，大盤大幅逼近空方主力高地。" },
              { label: "停損 -200% 關卡點", value: results.stopLoss200, factor: "3.0x 基準", desc: "高風險警示，可能面臨保證金追加或催收風險。" },
              { label: "停損 -250% 关卡點", value: results.stopLoss250, factor: "3.5x 基準", desc: "行情嚴重惡化，建議全面平倉以保留剩餘實力。" },
              { label: "停損 -300% 關卡點", value: results.stopLoss300, factor: "4.0x 基準", desc: "直逼該複式單在市場清算的最大可容忍界值。" },
            ].map((row, i) => {
              const isCapped = row.value === params.strikeDifference;
              return (
                <div key={i} className="py-3.5 flex items-center justify-between gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{row.label}</span>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 rounded font-mono px-1">
                        {row.factor}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-450 leading-relaxed">{row.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className={`text-sm font-bold block ${
                      isCapped ? "text-red-400" : "text-amber-400"
                    }`}>
                      {row.value.toFixed(1)} 點
                    </span>
                    {isCapped && (
                      <span className="text-[8px] text-red-400 font-bold uppercase block">
                        (已到頂限)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
