import React from "react";
import { SpreadParams } from "../types";
import { Sliders, TrendingUp, DollarSign, ShieldAlert, Percent, Settings2 } from "lucide-react";

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
    const newPremium = Math.round(diff * 0.2);
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
    <div id="control-panel-root" className="bg-white border border-sky-150 text-slate-900 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header section inside the panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-sky-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 text-sky-800 rounded-lg">
            <Settings2 className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-wide font-display">
              交易模型設定控制台
            </h3>
            <p className="text-xs text-slate-550 mt-0.5">
              系統核心參數配置面板，包含履約價差、成交價及預估單期回報，支持對應停損策略與多角度配資計算。
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Strategy choice, Strike Diff, Target Return rate */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Step Direction: 選擇策略方向 */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-650 tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-slate-500" />
              選擇策略方向
            </label>
            <span className="text-[10px] text-slate-500 font-medium">影響線圖與損益模型</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 bg-sky-50 p-1 rounded-xl border border-sky-100">
            <button
              id="strategy-bull"
              type="button"
              onClick={() => setStrategy("bull")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                strategy === "bull"
                  ? "bg-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-650 hover:text-slate-900 hover:bg-sky-100"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              看多價差
            </button>
            <button
              id="strategy-bear"
              type="button"
              onClick={() => setStrategy("bear")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                strategy === "bear"
                  ? "bg-emerald-500 text-white shadow-sm font-bold"
                  : "text-slate-650 hover:text-slate-900 hover:bg-sky-100"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 rotate-90" />
              看空價差
            </button>
          </div>
        </div>

        {/* Step 1: 複式單履約價差 */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              1. 複式單履約價差 (點)
            </label>
            <span className="text-xs bg-indigo-50 text-indigo-750 border border-indigo-100 font-mono font-bold px-2 py-0.5 rounded">
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
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-sm scale-[1.02]"
                    : "bg-slate-200/50 text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: 目標獲利率 */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-slate-500" />
              3. 目標獲利率 %
            </label>
            <span className="text-xs bg-violet-55 text-violet-750 border border-violet-100 font-mono font-bold px-2 py-0.5 rounded">
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
                    ? "bg-violet-600 text-white border-violet-500 shadow-sm scale-[1.03]"
                    : "bg-slate-200/50 text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-200"
                }`}
              >
                {formatPercentVal(rate)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Premium (Slider + input) & Safety Warning Tip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-t border-slate-200/80 pt-5">
        
        {/* Step 2: 價差成交價 */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-500" />
              2. 價差成交價 (收權利金)
            </label>
            <span className="text-[10px] text-slate-505 font-medium">
              限額 {params.strikeDifference} 點
            </span>
          </div>

          <div className="flex items-center gap-3 bg-slate-200/40 p-3 rounded-xl border border-slate-250">
            <span className="text-[10px] font-bold text-slate-600 w-12 text-center bg-slate-250 py-1 rounded border border-slate-300">
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
              className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-slate-300 rounded-lg appearance-none"
            />
            <div className="w-24 flex items-center border border-slate-300 bg-white rounded-lg focus-within:ring-2 focus-within:ring-emerald-55/20 focus-within:border-emerald-500 px-2.5 py-1 shadow-sm">
              <input
                id="premium-input"
                type="number"
                min={1}
                max={params.strikeDifference}
                value={params.premium}
                onChange={(e) => handlePremiumChange(Number(e.target.value))}
                className="w-full text-right outline-none text-xs font-mono font-bold text-slate-900 bg-transparent"
              />
              <span className="text-[10px] font-bold text-slate-400 ml-1">點</span>
            </div>
          </div>

          {/* Quick preset chips for Premium Ratio */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-slate-500 font-medium mr-1">快速權利金比例：</span>
            <div className="flex flex-wrap gap-1.5">
              {[0.10, 0.20, 0.25, 0.33, 0.50].map((ratio) => {
                const calcPrem = Math.round(params.strikeDifference * ratio);
                const isActive = params.premium === calcPrem;
                return (
                  <button
                    type="button"
                    key={ratio}
                    onClick={() => handlePremiumChange(calcPrem)}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border transition-colors ${
                      isActive
                        ? "bg-emerald-50 border-emerald-300 text-slate-900"
                        : "bg-white border-slate-250 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                  >
                    {(ratio * 100).toFixed(0)}%
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Warning Indicator component */}
        <div className="md:col-span-4">
          <div className="p-4 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-900 text-xs flex gap-2">
            <span className="text-sm">⚠️</span>
            <div className="space-y-0.5">
              <p className="font-bold text-amber-850">參數風險提示</p>
              <p className="leading-relaxed text-slate-650 text-[10px]">
                成交價越大代表收取的權利金越多，但在實務上代表所涉履約價越危險偏向價平。低獲利目標會大幅反推所需的超高「預算資金成本」。
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
