import React from "react";
import { SpreadParams } from "../types";
import { Sliders, TrendingUp, DollarSign, ShieldAlert, Percent } from "lucide-react";

interface ControlPanelProps {
  params: SpreadParams;
  onChange: (newParams: SpreadParams) => void;
  strategy: "bull" | "bear";
  setStrategy: (strat: "bull" | "bear") => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  onChange,
  strategy,
  setStrategy,
}) => {
  const strikeDiffOptions = [50, 100, 150, 200];
  const targetReturnOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4];

  const handleStrikeDiffChange = (diff: number) => {
    const newPremium = Math.min(params.premium, diff);
    onChange({
      ...params,
      strikeDifference: diff,
      premium: newPremium,
    });
  };

  const handlePremiumChange = (value: number) => {
    const cleanValue = Math.max(1, Math.min(params.strikeDifference, value));
    onChange({
      ...params,
      premium: cleanValue,
    });
  };

  const handleTargetReturnChange = (rate: number) => {
    onChange({
      ...params,
      targetReturnRate: rate,
    });
  };

  const formatPercentVal = (val: number): string => {
    const rounded = Math.round(val * 10) / 10;
    if (rounded % 1 === 0) {
      return `${Math.round(rounded)}%`;
    }
    return `${rounded.toFixed(1)}%`;
  };

  return (
    <div id="control-panel-root" className="bento-card p-6">
      
      {/* Dynamic Strategy Choice */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            選擇策略方向
          </label>
          <span className="text-[10px] text-slate-500">影響線圖與損益模型</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="strategy-bull"
            onClick={() => setStrategy("bull")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              strategy === "bull"
                ? "bg-rose-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            看多價差 (Bull Put)
          </button>
          <button
            id="strategy-bear"
            onClick={() => setStrategy("bear")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              strategy === "bear"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 rotate-90" />
            看空價差 (Bear Call)
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1: 複式單履約價差 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              1. 複式單履約價差 (點)
            </label>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-bold px-2 py-0.5 rounded">
              {params.strikeDifference} 點
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {strikeDiffOptions.map((diff) => (
              <button
                key={diff}
                id={`strike-diff-${diff}`}
                type="button"
                onClick={() => handleStrikeDiffChange(diff)}
                className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all duration-200 ${
                  params.strikeDifference === diff
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.02]"
                    : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: 價差成交價 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              2. 價差成交價 (收權利金)
            </label>
            <span className="text-[10px] text-slate-500">
              限额 {params.strikeDifference} 點
            </span>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 mb-3">
            <span className="text-[10px] font-bold text-slate-400 w-12 text-center bg-slate-950 py-1 rounded border border-slate-800">
              點數
            </span>
            <input
              id="premium-slider"
              type="range"
              min={1}
              max={params.strikeDifference}
              step={1}
              value={params.premium}
              onChange={(e) => handlePremiumChange(Number(e.target.value))}
              className="flex-1 accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="w-24 flex items-center border border-slate-800 bg-slate-950 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 px-2.5 py-1">
              <input
                id="premium-input"
                type="number"
                min={1}
                max={params.strikeDifference}
                value={params.premium}
                onChange={(e) => handlePremiumChange(Number(e.target.value))}
                className="w-full text-right outline-none text-xs font-mono font-bold text-slate-100 bg-transparent"
              />
              <span className="text-[10px] font-bold text-slate-500 ml-1">點</span>
            </div>
          </div>

          {/* Quick preset chips for Premium Ratio */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            <span className="text-[10px] text-slate-500 self-center mr-1">快速權利金比例：</span>
            {[0.10, 0.20, 0.25, 0.33, 0.50].map((ratio) => {
              const calcPrem = Math.round(params.strikeDifference * ratio);
              const isActive = params.premium === calcPrem;
              return (
                <button
                  type="button"
                  key={ratio}
                  onClick={() => handlePremiumChange(calcPrem)}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border transition-colors ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {(ratio * 100).toFixed(0)}%
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: 獲利率％ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-violet-400" />
              3. 目標獲利率 %
            </label>
            <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono font-bold px-2 py-0.5 rounded">
              {formatPercentVal(params.targetReturnRate)}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {targetReturnOptions.map((rate) => (
              <button
                key={rate}
                id={`target-rate-${rate.toString().replace(".", "-")}`}
                type="button"
                onClick={() => handleTargetReturnChange(rate)}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all duration-200 ${
                  params.targetReturnRate === rate
                    ? "bg-violet-600 text-white border-violet-500 shadow-md scale-[1.03]"
                    : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                }`}
              >
                {formatPercentVal(rate)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Safety warning helper */}
      <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-300 text-xs flex gap-2">
        <span className="text-sm">⚠️</span>
        <div className="space-y-0.5">
          <p className="font-bold text-amber-200">參數風險提示</p>
          <p className="leading-relaxed text-slate-400 text-[11px]">
            成交價越大代表收取的權利金越多，但在實務上代表所涉履約價越危險偏向價平。低獲利目標會大幅反推所需的超高「預算資金成本」。
          </p>
        </div>
      </div>
      
    </div>
  );
};
