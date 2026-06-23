import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
  Cell,
  Label,
} from "recharts";
import { CalculationResult, SpreadParams } from "../types";
import { generatePayoffData } from "../utils/calculations";
import { Activity, ShieldCheck, DollarSign, Coins } from "lucide-react";

interface RiskChartsProps {
  params: SpreadParams;
  results: CalculationResult;
  strategy: "bull" | "bear";
}

export const RiskCharts: React.FC<RiskChartsProps> = ({ params, results, strategy }) => {
  const [customCapital, setCustomCapital] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("opt_spread_customCapital");
      return saved ? parseInt(saved, 10) : 400000;
    } catch (e) {
      console.error("Failed to load custom capital from localStorage:", e);
      return 400000;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("opt_spread_customCapital", customCapital.toString());
    } catch (e) {
      console.error("Failed to save custom capital to localStorage:", e);
    }
  }, [customCapital]);

  const presets = [100000, 250000, 300000, 400000, 500000, 1000000];

  const payoffData = useMemo(() => {
    return generatePayoffData(params.strikeDifference, params.premium, strategy);
  }, [params.strikeDifference, params.premium, strategy]);

  const stopLossLadder = useMemo(() => {
    return [
      { name: "基準成交價", points: params.premium, color: "#10b981", percent: "基準" },
      { name: "-100% 停損", points: results.stopLoss100, color: "#f59e0b", percent: "2.0x" },
      { name: "-150% 停損", points: results.stopLoss150, color: "#f97316", percent: "2.5x" },
      { name: "-200% 停損", points: results.stopLoss200, color: "#f43f5e", percent: "3.0x" },
      { name: "-250% 停損", points: results.stopLoss250, color: "#e11d48", percent: "3.5x" },
      { name: "-300% 停損", points: results.stopLoss300, color: "#be123c", percent: "4.0x" },
    ];
  }, [params.premium, results]);

  const capitalData = useMemo(() => {
    const safeBuffer = Math.max(0, results.capitalCost - results.spreadCost);
    const leverageWarning = results.capitalCost < results.spreadCost;
    
    return [
      {
        name: "資金成本配置",
        "價差成本 (保證金)": results.spreadCost,
        "保留可用餘額": safeBuffer,
        "超額槓桿缺口 (風險值)": leverageWarning ? results.spreadCost - results.capitalCost : 0,
      }
    ];
  }, [results.capitalCost, results.spreadCost]);

  // Proportional math
  const proportionalProfit = results.capitalCost > 0 
    ? (customCapital / results.capitalCost) * results.profitAmount 
    : 0;
  const proportionalProfitRate = customCapital > 0 
    ? (proportionalProfit / customCapital) * 100 
    : 0;

  const proportionalMaxLoss = results.capitalCost > 0 
    ? (customCapital / results.capitalCost) * results.maxLossRisk 
    : 0;
  const proportionalMaxLossRate = customCapital > 0 
    ? (proportionalMaxLoss / customCapital) * 100 
    : 0;

  // Real Integer math
  const integerGroups = results.capitalCost > 0 
    ? Math.ceil(customCapital / results.capitalCost) 
    : 0;
  const integerProfit = integerGroups * results.profitAmount;
  const integerProfitRate = customCapital > 0 
    ? (integerProfit / customCapital) * 100 
    : 0;

  const integerProtectedProfit = integerProfit * 0.85;

  const integerMaxLoss = integerGroups * results.maxLossRisk;
  const integerMaxLossRate = customCapital > 0 
    ? (integerMaxLoss / customCapital) * 100 
    : 0;

  const customAvailableBalancePercent = results.availableBalancePercent * 100;

  const formatTWD = (value: number) => {
    return `$ ${Math.round(value).toLocaleString("zh-TW")}`;
  };

  const formatPercentVal = (val: number): string => {
    const rounded = Math.round(val * 10) / 10;
    if (rounded % 1 === 0) {
      return `${Math.round(rounded)}%`;
    }
    return `${rounded.toFixed(1)}%`;
  };

  const breakEvenPoint = strategy === "bull" ? -params.premium : params.premium;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Chart 1: Option Payoff Curve */}
      <div className="bento-card p-6 lg:col-span-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase text-slate-300 tracking-widest flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-emerald-400" />
              損益平衡相對變動分析圖表 (單組)
            </h3>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium">
              自研高頻模擬數據
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            此圖預估當指數相較於「空方合約履約價」發生變動時，在結算日的實際契約價值。
            兩平點落於相差 <b className="text-emerald-400 font-bold">{breakEvenPoint} 點</b> 回檔防守區，最大損失壓在 <b className="text-rose-400 font-bold">{formatTWD(results.maxLossRisk)}</b> 以內。
          </p>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={payoffData}
              margin={{ top: 10, right: 15, left: -10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              
              <XAxis 
                dataKey="indexDiff" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }} 
              >
                <Label value="結算日指數相對空方合約之差額" offset={-12} position="insideBottom" fill="#64748b" style={{ fontSize: 10 }} />
              </XAxis>
              
              <YAxis 
                tickFormatter={(val) => `${val >= 0 ? "+" : ""}${val}`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
              />

              <Tooltip 
                formatter={(value: any) => [formatTWD(Number(value)), "結算損益"]}
                labelFormatter={(label: any) => `偏離空方合約履約價: ${label > 0 ? "+" : ""}${label} 點`}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  border: "1px solid rgba(71, 85, 105, 0.5)",
                  color: "#f8fafc",
                  fontSize: "11px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)"
                }}
              />

              {/* Zero flat profit line */}
              <ReferenceLine y={0} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />
              {/* Short strike level */}
              <ReferenceLine x={0} stroke="#64748b" strokeWidth={1.5} label={{ value: "空方賣權 (0點基準)", position: "top", fill: "#94a3b8", fontSize: 9 }} />
              {/* Breakeven point */}
              <ReferenceLine x={breakEvenPoint} stroke={strategy === "bull" ? "#f43f5e" : "#10b981"} strokeWidth={1.5} label={{ value: "兩平價", position: "bottom", fill: strategy === "bull" ? "#f43f5e" : "#10b981", fontSize: 9 }} />
              
              <Line
                name="結算損益"
                type="linear"
                dataKey="payoff"
                stroke={strategy === "bull" ? "#f43f5e" : "#10b981"}
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const isShortStrike = payload.indexDiff === 0;
                  const isBreakEven = payload.indexDiff === breakEvenPoint;
                  const isLongStrike = payload.indexDiff === (strategy === "bull" ? -params.strikeDifference : params.strikeDifference);
                  
                  if (isShortStrike || isBreakEven || isLongStrike) {
                     const dotStroke = isBreakEven 
                      ? (strategy === "bull" ? "#f43f5e" : "#10b981") 
                      : (strategy === "bull" ? "#f43f5e" : "#10b981");
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={4.5} 
                        fill="#0f172a" 
                        stroke={dotStroke} 
                        strokeWidth={2.5} 
                        key={props.key} 
                      />
                    );
                  }
                  return <circle cx={cx} cy={cy} r={0} key={props.key} />;
                }}
                activeDot={{ r: 6, strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 justify-center items-center mt-4 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${strategy === "bull" ? "bg-rose-500" : "bg-emerald-500"}`}></span>
            看多選定防核色標 (目前看多: 紅色系)
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${strategy === "bull" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            看空選定防核色標 (目前看空: 綠色系)
          </span>
        </div>
      </div>

      {/* Chart 3: Capital Allocation Breakdown */}
      <div className="bento-card p-6 lg:col-span-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase text-slate-300 tracking-widest flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-violet-400" />
            推估全配資金成本架構 (TWD)
          </h3>
          {results.availableBalancePercent < 0 && (
            <span className="text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md font-bold border border-red-500/30 animate-pulse">
              ⚠️ 警告：保留可用餘額為負數 (高度融資過熱)
            </span>
          )}
        </div>
        
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          分析每組部位配資總規模 <b className="text-violet-400 font-bold">{formatTWD(results.capitalCost)}</b> 在扣抵保證金後的安全抗震緩衝。可用緩衝越大，代表抗震波（例如遭遇跳空或突發崩跌）的存活率越高。
        </p>

        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={capitalData}
              stackOffset="sign"
              margin={{ top: 5, right: 15, left: -25, bottom: 10 }}
            >
              <XAxis type="number" tickFormatter={(val) => `${val >= 0 ? "" : "-"}$${Math.round(Math.abs(val) / 1000)}k`} tick={{ fontSize: 9, fill: "#94a3b8" }} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip 
                formatter={(value: any) => [formatTWD(Math.abs(value)), "金額"]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "10px",
                  border: "1px solid rgba(71,85,105,0.5)",
                  fontSize: "11px",
                  color: "#f8fafc"
                }}
              />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "5px", color: "#f8fafc" }} />
              <Bar dataKey="價差成本 (保證金)" stackId="a" fill="#3b82f6" radius={results.availableBalancePercent < 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]} />
              <Bar dataKey="保留可用餘額" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
              <Bar dataKey="超額槓桿缺口 (風險值)" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Capital Section under Chart 3 */}
      <div id="custom-capital-assess-card" className="bento-card p-6 lg:col-span-12 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden rounded-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-widest flex items-center gap-2">
              <Coins className="w-4.5 h-4.5 text-teal-600" />
              自定義投入資金成本模擬 (Portfolio Scale Calculator)
            </h4>
            <p className="text-xs text-slate-500">
              輸入自定義的期權配置總資金，自動試算對應此價差合約下的預估獲利與最大虧損。
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setCustomCapital(val)}
                className={`px-2.5 py-1 rounded text-xs transition duration-150 ${
                  customCapital === val
                    ? "bg-teal-600 text-white font-bold"
                    : "bg-slate-200/50 text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-200"
                }`}
              >
                {val / 10000}萬
              </button>
            ))}
          </div>
        </div>

        {/* Input and basic settings */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 space-y-3.5">
            <div className="space-y-2">
              <label htmlFor="custom-capital-field" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                自定義投入資金成本 (TWD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs mt-0.5">$</span>
                <input
                  id="custom-capital-field"
                  type="text"
                  value={customCapital === 0 ? "" : customCapital.toLocaleString("zh-TW")}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9]/g, "");
                    setCustomCapital(cleaned ? parseInt(cleaned, 10) : 0);
                  }}
                  className="bg-white border border-slate-300 focus:border-indigo-500 rounded-xl text-slate-900 font-mono font-bold text-lg py-2.5 pl-11 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                  placeholder="輸入資金"
                />
              </div>
            </div>

            {/* Display Available Balance % below Custom Capital */}
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-inner">
              <span className="text-xs text-slate-600 font-medium">保留可用餘額 %</span>
              <span className={`font-mono font-extrabold text-sm ${
                customAvailableBalancePercent < 0 ? "text-rose-600" : "text-emerald-600"
              }`}>
                {Math.round(customAvailableBalancePercent)}%
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal">
              * 分母獲利率％與虧損率％均以此自訂投入金額計算。
            </p>
          </div>

          <div className="md:col-span-8">
            
            {/* Integer Mode Result (Real Trading) */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                  整組承作 (Integer Contract Model)
                </span>
                <span className="text-xs text-emerald-600 font-mono font-bold">
                  可承作: {integerGroups} 組
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-bold">成交獲利</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600 block font-mono">
                      {formatTWD(integerProfit)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (獲利率 {formatPercentVal(integerProfitRate)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs text-slate-500 font-bold block">保利獲利</span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      = 成交獲利 * 0.85
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-600 block font-mono">
                      {formatTWD(integerProtectedProfit)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (保利率 {formatPercentVal(integerProfitRate * 0.85)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-bold">最大虧損</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-rose-600 block font-mono">
                      {formatTWD(integerMaxLoss)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (虧損率 {formatPercentVal(integerMaxLossRate)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
